/**
 * ============================================================
 * MOUNTKEY - ADMIN TRAIL CONTROLLER
 * ============================================================
 * Controller untuk CRUD Trails di Admin Panel
 * ============================================================
 */

const { pool } = require('../config/database');
const responseHelper = require('../utils/responseHelper');

// ============================================================
// LIST TRAILS (for Admin)
// ============================================================
async function listTrails(req, res) {
    try {
        const { page = 1, limit = 20, mountain_id } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let query = `
            SELECT t.*, m.name as mountain_name
            FROM trails t
            LEFT JOIN mountains m ON t.mountain_id = m.id
        `;
        const params = [];

        if (mountain_id) {
            query += ' WHERE t.mountain_id = ?';
            params.push(mountain_id);
        }

        query += ` ORDER BY t.name ASC LIMIT ${parseInt(limit)} OFFSET ${offset}`;

        const [trails] = await pool.execute(query, params);

        let countQuery = 'SELECT COUNT(*) as total FROM trails';
        if (mountain_id) {
            countQuery += ' WHERE mountain_id = ?';
        }
        const [countResult] = await pool.execute(countQuery, mountain_id ? [mountain_id] : []);
        const total = countResult[0].total;

        return responseHelper.success(res, {
            trails,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                total_pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        console.error('Admin listTrails error:', err);
        return responseHelper.error(res, 'Failed to fetch trails', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// GET SINGLE TRAIL
// ============================================================
async function getTrail(req, res) {
    try {
        const { id } = req.params;

        const [trails] = await pool.execute(`
            SELECT t.*, m.name as mountain_name
            FROM trails t
            LEFT JOIN mountains m ON t.mountain_id = m.id
            WHERE t.id = ?
        `, [id]);

        if (trails.length === 0) {
            return responseHelper.error(res, 'Trail not found', 'NOT_FOUND', 404);
        }

        return responseHelper.success(res, { trail: trails[0] });
    } catch (err) {
        console.error('Admin getTrail error:', err);
        return responseHelper.error(res, 'Failed to fetch trail', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// CREATE TRAIL
// ============================================================
async function createTrail(req, res) {
    try {
        const {
            mountain_id, name, slug,
            basecamp_name, basecamp_village, basecamp_district,
            basecamp_latitude, basecamp_longitude,
            distance_km, estimated_time_up_hours, estimated_time_down_hours,
            difficulty_level, trail_status, status_reason,
            daily_quota, description
        } = req.body;

        // Validation
        if (!mountain_id || !name || !basecamp_name) {
            return responseHelper.validationError(res, [
                { field: 'mountain_id', message: 'Mountain ID is required' },
                { field: 'name', message: 'Trail name is required' },
                { field: 'basecamp_name', message: 'Basecamp name is required' }
            ]);
        }

        const trailSlug = slug || name.toLowerCase().replace(/\s+/g, '-');

        const [result] = await pool.execute(`
            INSERT INTO trails 
            (mountain_id, name, slug, basecamp_name, basecamp_village, basecamp_district,
             basecamp_latitude, basecamp_longitude, distance_km, 
             estimated_time_up_hours, estimated_time_down_hours,
             difficulty_level, trail_status, status_reason, daily_quota, description, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
            mountain_id, name, trailSlug,
            basecamp_name,
            basecamp_village || null,
            basecamp_district || null,
            basecamp_latitude || null,
            basecamp_longitude || null,
            distance_km || null,
            estimated_time_up_hours || null,
            estimated_time_down_hours || null,
            difficulty_level || 3,
            trail_status || 'open',
            status_reason || null,
            daily_quota || null,
            description || null
        ]);

        return responseHelper.created(res, {
            id: result.insertId,
            name
        }, 'Trail created successfully');
    } catch (err) {
        console.error('Admin createTrail error:', err);
        return responseHelper.error(res, 'Failed to create trail: ' + err.message, 'SERVER_ERROR', 500);
    }
}

// ============================================================
// UPDATE TRAIL
// ============================================================
async function updateTrail(req, res) {
    try {
        const { id } = req.params;
        const {
            mountain_id, name, slug,
            basecamp_name, basecamp_village, basecamp_district,
            basecamp_latitude, basecamp_longitude,
            distance_km, estimated_time_up_hours, estimated_time_down_hours,
            difficulty_level, trail_status, status_reason,
            daily_quota, description
        } = req.body;

        const [result] = await pool.execute(`
            UPDATE trails SET
                mountain_id = ?, name = ?, slug = ?, 
                basecamp_name = ?, basecamp_village = ?, basecamp_district = ?,
                basecamp_latitude = ?, basecamp_longitude = ?,
                distance_km = ?, estimated_time_up_hours = ?, estimated_time_down_hours = ?,
                difficulty_level = ?, trail_status = ?, status_reason = ?,
                daily_quota = ?, description = ?, updated_at = NOW()
            WHERE id = ?
        `, [
            mountain_id, name, slug || name.toLowerCase().replace(/\s+/g, '-'),
            basecamp_name,
            basecamp_village || null,
            basecamp_district || null,
            basecamp_latitude || null,
            basecamp_longitude || null,
            distance_km || null,
            estimated_time_up_hours || null,
            estimated_time_down_hours || null,
            difficulty_level || 3,
            trail_status || 'open',
            status_reason || null,
            daily_quota || null,
            description || null,
            id
        ]);

        if (result.affectedRows === 0) {
            return responseHelper.error(res, 'Trail not found', 'NOT_FOUND', 404);
        }

        return responseHelper.success(res, { id, name }, 'Trail updated successfully');
    } catch (err) {
        console.error('Admin updateTrail error:', err);
        return responseHelper.error(res, 'Failed to update trail: ' + err.message, 'SERVER_ERROR', 500);
    }
}

// ============================================================
// DELETE TRAIL
// ============================================================
async function deleteTrail(req, res) {
    try {
        const { id } = req.params;

        const [result] = await pool.execute('DELETE FROM trails WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return responseHelper.error(res, 'Trail not found', 'NOT_FOUND', 404);
        }

        return responseHelper.success(res, null, 'Trail deleted successfully');
    } catch (err) {
        console.error('Admin deleteTrail error:', err);
        return responseHelper.error(res, 'Failed to delete trail', 'SERVER_ERROR', 500);
    }
}

module.exports = {
    listTrails,
    getTrail,
    createTrail,
    updateTrail,
    deleteTrail
};
