/**
 * ============================================================
 * MOUNTKEY - TRAIL CONTROLLER
 * ============================================================
 * Controller untuk endpoint Trails (Read-Only).
 * 
 * ENDPOINTS:
 * - GET /v1/trails/:slug - Get single trail with checkpoints
 * ============================================================
 */

const { pool } = require('../config/database');
const { success, notFound, error } = require('../utils/responseHelper');

// ============================================================
// CONTROLLERS
// ============================================================

/**
 * GET /v1/trails/:slug
 * 
 * Get single trail by slug with checkpoints
 */
async function getTrailBySlug(req, res) {
    try {
        const { slug } = req.params;

        // ─────────────────────────────────────────────────────
        // Get trail with mountain info
        // ─────────────────────────────────────────────────────
        const [trails] = await pool.execute(
            `SELECT 
                t.id,
                t.name,
                t.slug,
                t.basecamp_name,
                t.basecamp_village,
                t.basecamp_district,
                t.basecamp_latitude,
                t.basecamp_longitude,
                t.distance_km,
                t.estimated_time_up_hours,
                t.estimated_time_down_hours,
                t.difficulty_level,
                t.trail_status,
                t.status_reason,
                t.daily_quota,
                t.description,
                t.created_at,
                t.updated_at,
                m.id AS mountain_id,
                m.name AS mountain_name,
                m.slug AS mountain_slug,
                m.elevation_meters AS mountain_elevation
             FROM trails t
             INNER JOIN mountains m ON t.mountain_id = m.id
             WHERE t.slug = ? AND t.is_active = 1 AND m.is_active = 1
             LIMIT 1`,
            [slug]
        );

        if (trails.length === 0) {
            return notFound(res, `Trail '${slug}' not found`, 'TRAIL_NOT_FOUND');
        }

        const trail = trails[0];

        // ─────────────────────────────────────────────────────
        // Get checkpoints for this trail
        // ─────────────────────────────────────────────────────
        const [checkpoints] = await pool.execute(
            `SELECT 
                id,
                name,
                sequence_order,
                elevation_meters,
                distance_from_basecamp_km,
                latitude,
                longitude,
                has_water_source,
                has_shelter,
                has_camping_ground,
                description
             FROM trail_checkpoints
             WHERE trail_id = ? AND is_active = 1
             ORDER BY sequence_order ASC`,
            [trail.id]
        );

        // ─────────────────────────────────────────────────────
        // Format response
        // ─────────────────────────────────────────────────────
        return success(res, {
            trail: formatTrailDetailResponse(trail),
            checkpoints: checkpoints.map(formatCheckpointResponse),
            checkpoint_count: checkpoints.length
        }, 'Trail retrieved successfully');

    } catch (err) {
        console.error('[TrailController] getTrailBySlug error:', err.message);
        return error(res, 'Failed to retrieve trail', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Format trail detail response
 */
function formatTrailDetailResponse(trail) {
    return {
        id: trail.id,
        name: trail.name,
        slug: trail.slug,
        mountain: {
            id: trail.mountain_id,
            name: trail.mountain_name,
            slug: trail.mountain_slug,
            elevation_meters: trail.mountain_elevation
        },
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
            down: trail.estimated_time_down_hours ? parseFloat(trail.estimated_time_down_hours) : null,
            total: calculateTotalHours(trail.estimated_time_up_hours, trail.estimated_time_down_hours)
        },
        difficulty: {
            level: trail.difficulty_level,
            label: getDifficultyLabel(trail.difficulty_level)
        },
        status: trail.trail_status,
        status_reason: trail.status_reason,
        daily_quota: trail.daily_quota,
        description: trail.description,
        created_at: trail.created_at,
        updated_at: trail.updated_at
    };
}

/**
 * Format checkpoint response
 */
function formatCheckpointResponse(checkpoint) {
    return {
        id: checkpoint.id,
        name: checkpoint.name,
        order: checkpoint.sequence_order,
        elevation_meters: checkpoint.elevation_meters,
        distance_from_basecamp_km: checkpoint.distance_from_basecamp_km
            ? parseFloat(checkpoint.distance_from_basecamp_km)
            : null,
        coordinates: checkpoint.latitude ? {
            latitude: parseFloat(checkpoint.latitude),
            longitude: parseFloat(checkpoint.longitude)
        } : null,
        facilities: {
            water_source: !!checkpoint.has_water_source,
            shelter: !!checkpoint.has_shelter,
            camping_ground: !!checkpoint.has_camping_ground
        },
        description: checkpoint.description
    };
}

/**
 * Calculate total hiking hours
 */
function calculateTotalHours(up, down) {
    if (!up && !down) return null;
    return parseFloat(up || 0) + parseFloat(down || 0);
}

/**
 * Get difficulty label from level
 */
function getDifficultyLabel(level) {
    const labels = {
        1: 'Easy',
        2: 'Moderate',
        3: 'Challenging',
        4: 'Difficult',
        5: 'Extreme'
    };
    return labels[level] || 'Unknown';
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    getTrailBySlug
};
