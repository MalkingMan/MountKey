/**
 * ============================================================
 * MOUNTKEY - PUBLIC CONTROLLER
 * ============================================================
 * Controller untuk endpoint publik (tanpa API key).
 * Hanya menampilkan data dasar, read-only.
 * ============================================================
 */

const { pool } = require('../config/database');
const { success, error } = require('../utils/responseHelper');

// ============================================================
// PUBLIC MOUNTAINS LIST
// ============================================================

/**
 * GET /public/mountains
 * 
 * List semua gunung (public, tanpa API key)
 * Hanya menampilkan data dasar:
 * - name, slug, province, regency, elevation, type, status
 */
async function listMountainsPublic(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
        const offset = (page - 1) * limit;

        const province = req.query.province || null;

        // Build query
        let whereClause = 'WHERE is_active = 1';
        const params = [];

        if (province) {
            whereClause += ' AND province = ?';
            params.push(province);
        }

        // Get total count
        const [countResult] = await pool.execute(
            `SELECT COUNT(*) as total FROM mountains ${whereClause}`,
            params
        );
        const total = countResult[0].total;

        // Get mountains (basic data only)
        const [rows] = await pool.execute(`
            SELECT 
                id,
                name,
                slug,
                province,
                regency,
                elevation_meters,
                mountain_status,
                mountain_type
            FROM mountains 
            ${whereClause}
            ORDER BY name ASC
            LIMIT ? OFFSET ?
        `, [...params, limit.toString(), offset.toString()]);

        // Format response (simplified)
        const mountains = rows.map(row => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            location: {
                province: row.province,
                regency: row.regency
            },
            elevation_meters: row.elevation_meters,
            status: row.mountain_status,
            type: row.mountain_type
        }));

        const totalPages = Math.ceil(total / limit);

        return success(res, {
            mountains,
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
        console.error('[PublicController] listMountainsPublic error:', err.message);
        return error(res, 'Failed to retrieve mountains', 'SERVER_ERROR', 500);
    }
}

/**
 * GET /public/mountains/:slug
 * 
 * Get single mountain by slug (public, tanpa API key)
 * Hanya data dasar, tanpa trails/weather
 */
async function getMountainPublic(req, res) {
    try {
        const { slug } = req.params;

        const [rows] = await pool.execute(`
            SELECT 
                id,
                name,
                slug,
                province,
                regency,
                elevation_meters,
                mountain_status,
                mountain_type,
                conservation_area,
                conservation_type,
                description
            FROM mountains 
            WHERE slug = ? AND is_active = 1
            LIMIT 1
        `, [slug]);

        if (rows.length === 0) {
            return error(res, `Mountain '${slug}' not found`, 'MOUNTAIN_NOT_FOUND', 404);
        }

        const row = rows[0];

        // Get trail count only (not details)
        const [trailCount] = await pool.execute(
            `SELECT COUNT(*) as count FROM trails WHERE mountain_id = ? AND is_active = 1`,
            [row.id]
        );

        const mountain = {
            id: row.id,
            name: row.name,
            slug: row.slug,
            location: {
                province: row.province,
                regency: row.regency
            },
            elevation_meters: row.elevation_meters,
            status: row.mountain_status,
            type: row.mountain_type,
            conservation: {
                area: row.conservation_area,
                type: row.conservation_type
            },
            description: row.description,
            trail_count: trailCount[0].count
        };

        return success(res, { mountain }, 'Mountain retrieved successfully');

    } catch (err) {
        console.error('[PublicController] getMountainPublic error:', err.message);
        return error(res, 'Failed to retrieve mountain', 'SERVER_ERROR', 500);
    }
}

module.exports = {
    listMountainsPublic,
    getMountainPublic
};
