/**
 * ============================================================
 * MOUNTKEY - MOUNTAIN CONTROLLER
 * ============================================================
 * Controller untuk endpoint Mountains (Read-Only).
 * 
 * ENDPOINTS:
 * - GET /v1/mountains           - List all mountains
 * - GET /v1/mountains/:slug     - Get single mountain
 * - GET /v1/mountains/:slug/trails - Get trails for mountain
 * ============================================================
 */

const { pool } = require('../config/database');
const { success, notFound, error } = require('../utils/responseHelper');

// ============================================================
// CONFIGURATION
// ============================================================

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// Fields to expose (exclude internal fields)
const MOUNTAIN_PUBLIC_FIELDS = `
    id,
    name,
    slug,
    province,
    regency,
    latitude,
    longitude,
    elevation_meters,
    mountain_status,
    mountain_type,
    conservation_area,
    conservation_type,
    description,
    created_at,
    updated_at
`;

// ============================================================
// CONTROLLERS
// ============================================================

/**
 * GET /v1/mountains
 * 
 * List all mountains with pagination and filtering
 * 
 * QUERY PARAMS:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - province: Filter by province
 * - status: Filter by mountain_status
 * - sort: Sort field (default: name)
 * - order: Sort order (asc/desc, default: asc)
 */
async function listMountains(req, res) {
    try {
        // ─────────────────────────────────────────────────────
        // Parse query parameters
        // ─────────────────────────────────────────────────────
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(req.query.limit) || DEFAULT_PAGE_SIZE));
        const offset = (page - 1) * limit;

        const province = req.query.province || null;
        const status = req.query.status || null;
        const sortField = validateSortField(req.query.sort);
        const sortOrder = req.query.order === 'desc' ? 'DESC' : 'ASC';

        // ─────────────────────────────────────────────────────
        // Build query
        // ─────────────────────────────────────────────────────
        let whereClause = 'WHERE is_active = 1';
        const params = [];

        if (province) {
            whereClause += ' AND province = ?';
            params.push(province);
        }

        if (status && ['active', 'dormant', 'extinct'].includes(status)) {
            whereClause += ' AND mountain_status = ?';
            params.push(status);
        }

        // ─────────────────────────────────────────────────────
        // Get total count
        // ─────────────────────────────────────────────────────
        const [countResult] = await pool.execute(
            `SELECT COUNT(*) as total FROM mountains ${whereClause}`,
            params
        );
        const total = countResult[0].total;

        // ─────────────────────────────────────────────────────
        // Get paginated data
        // ─────────────────────────────────────────────────────
        const [rows] = await pool.execute(
            `SELECT ${MOUNTAIN_PUBLIC_FIELDS}
             FROM mountains 
             ${whereClause}
             ORDER BY ${sortField} ${sortOrder}
             LIMIT ? OFFSET ?`,
            [...params, limit.toString(), offset.toString()]
        );

        // ─────────────────────────────────────────────────────
        // Build response
        // ─────────────────────────────────────────────────────
        const totalPages = Math.ceil(total / limit);

        return success(res, {
            mountains: rows.map(formatMountainResponse),
            pagination: {
                current_page: page,
                per_page: limit,
                total_items: total,
                total_pages: totalPages,
                has_next: page < totalPages,
                has_prev: page > 1
            }
        }, 'Mountains retrieved successfully');

    } catch (err) {
        console.error('[MountainController] listMountains error:', err.message);
        return error(res, 'Failed to retrieve mountains', 'SERVER_ERROR', 500);
    }
}

/**
 * GET /v1/mountains/:slug
 * 
 * Get single mountain by slug
 */
async function getMountainBySlug(req, res) {
    try {
        const { slug } = req.params;

        // ─────────────────────────────────────────────────────
        // Query database
        // ─────────────────────────────────────────────────────
        const [rows] = await pool.execute(
            `SELECT ${MOUNTAIN_PUBLIC_FIELDS}
             FROM mountains 
             WHERE slug = ? AND is_active = 1
             LIMIT 1`,
            [slug]
        );

        if (rows.length === 0) {
            return notFound(res, `Mountain '${slug}' not found`, 'MOUNTAIN_NOT_FOUND');
        }

        // ─────────────────────────────────────────────────────
        // Get trail count for this mountain
        // ─────────────────────────────────────────────────────
        const [trailCount] = await pool.execute(
            `SELECT COUNT(*) as count FROM trails WHERE mountain_id = ? AND is_active = 1`,
            [rows[0].id]
        );

        const mountain = formatMountainResponse(rows[0]);
        mountain.trail_count = trailCount[0].count;

        return success(res, { mountain }, 'Mountain retrieved successfully');

    } catch (err) {
        console.error('[MountainController] getMountainBySlug error:', err.message);
        return error(res, 'Failed to retrieve mountain', 'SERVER_ERROR', 500);
    }
}

/**
 * GET /v1/mountains/:slug/trails
 * 
 * Get all trails for a specific mountain
 */
async function getMountainTrails(req, res) {
    try {
        const { slug } = req.params;

        // ─────────────────────────────────────────────────────
        // Find mountain first
        // ─────────────────────────────────────────────────────
        const [mountains] = await pool.execute(
            `SELECT id, name, slug FROM mountains WHERE slug = ? AND is_active = 1 LIMIT 1`,
            [slug]
        );

        if (mountains.length === 0) {
            return notFound(res, `Mountain '${slug}' not found`, 'MOUNTAIN_NOT_FOUND');
        }

        const mountain = mountains[0];

        // ─────────────────────────────────────────────────────
        // Get trails
        // ─────────────────────────────────────────────────────
        const [trails] = await pool.execute(
            `SELECT 
                id,
                name,
                slug,
                basecamp_name,
                basecamp_village,
                basecamp_district,
                basecamp_latitude,
                basecamp_longitude,
                distance_km,
                estimated_time_up_hours,
                estimated_time_down_hours,
                difficulty_level,
                trail_status,
                status_reason,
                daily_quota,
                description,
                created_at,
                updated_at
             FROM trails 
             WHERE mountain_id = ? AND is_active = 1
             ORDER BY name ASC`,
            [mountain.id]
        );

        return success(res, {
            mountain: {
                id: mountain.id,
                name: mountain.name,
                slug: mountain.slug
            },
            trails: trails.map(formatTrailResponse),
            count: trails.length
        }, 'Trails retrieved successfully');

    } catch (err) {
        console.error('[MountainController] getMountainTrails error:', err.message);
        return error(res, 'Failed to retrieve trails', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Format mountain response (remove internal fields, format data)
 */
function formatMountainResponse(mountain) {
    return {
        id: mountain.id,
        name: mountain.name,
        slug: mountain.slug,
        location: {
            province: mountain.province,
            regency: mountain.regency,
            coordinates: {
                latitude: parseFloat(mountain.latitude),
                longitude: parseFloat(mountain.longitude)
            }
        },
        elevation_meters: mountain.elevation_meters,
        status: mountain.mountain_status,
        type: mountain.mountain_type,
        conservation: {
            area: mountain.conservation_area,
            type: mountain.conservation_type
        },
        description: mountain.description,
        created_at: mountain.created_at,
        updated_at: mountain.updated_at
    };
}

/**
 * Format trail response
 */
function formatTrailResponse(trail) {
    return {
        id: trail.id,
        name: trail.name,
        slug: trail.slug,
        basecamp: {
            name: trail.basecamp_name,
            village: trail.basecamp_village,
            district: trail.basecamp_district,
            coordinates: trail.basecamp_latitude ? {
                latitude: parseFloat(trail.basecamp_latitude),
                longitude: parseFloat(trail.basecamp_longitude)
            } : null
        },
        distance_km: trail.distance_km ? parseFloat(trail.distance_km) : null,
        estimated_hours: {
            up: trail.estimated_time_up_hours ? parseFloat(trail.estimated_time_up_hours) : null,
            down: trail.estimated_time_down_hours ? parseFloat(trail.estimated_time_down_hours) : null
        },
        difficulty_level: trail.difficulty_level,
        status: trail.trail_status,
        status_reason: trail.status_reason,
        daily_quota: trail.daily_quota,
        description: trail.description,
        created_at: trail.created_at,
        updated_at: trail.updated_at
    };
}

/**
 * Validate sort field to prevent SQL injection
 */
function validateSortField(field) {
    const allowedFields = ['name', 'elevation_meters', 'province', 'created_at'];
    return allowedFields.includes(field) ? field : 'name';
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    listMountains,
    getMountainBySlug,
    getMountainTrails
};
