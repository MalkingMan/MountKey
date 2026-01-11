/**
 * ============================================================
 * MOUNTKEY - ADMIN MOUNTAIN CONTROLLER
 * ============================================================
 * Controller untuk CRUD Mountains di Admin Panel
 * ============================================================
 */

const { pool } = require('../config/database');
const responseHelper = require('../utils/responseHelper');

// ============================================================
// LIST MOUNTAINS (for Admin)
// ============================================================
async function listMountains(req, res) {
    try {
        const { page = 1, limit = 20, sort = 'name', order = 'asc', search = '' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Validate sort field
        const allowedSorts = ['id', 'name', 'province', 'elevation_meters', 'mountain_status'];
        const sortField = allowedSorts.includes(sort) ? sort : 'name';
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

        // Build search condition
        let whereClause = '';
        let queryParams = [];

        if (search.trim()) {
            whereClause = 'WHERE (name LIKE ? OR slug LIKE ? OR province LIKE ?)';
            const searchPattern = `%${search.trim()}%`;
            queryParams = [searchPattern, searchPattern, searchPattern];
        }

        const [mountains] = await pool.execute(`
            SELECT id, name, slug, province, regency, elevation_meters, mountain_status, mountain_type
            FROM mountains
            ${whereClause}
            ORDER BY ${sortField} ${sortOrder}
            LIMIT ${parseInt(limit)} OFFSET ${offset}
        `, queryParams);

        // Count with same search condition
        const [countResult] = await pool.execute(
            `SELECT COUNT(*) as total FROM mountains ${whereClause}`,
            queryParams
        );
        const total = countResult[0].total;

        return responseHelper.success(res, {
            mountains,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                total_pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        console.error('Admin listMountains error:', err);
        return responseHelper.error(res, 'Failed to fetch mountains', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// GET SINGLE MOUNTAIN
// ============================================================
async function getMountain(req, res) {
    try {
        const { id } = req.params;

        const [mountains] = await pool.execute(`
            SELECT * FROM mountains WHERE id = ?
        `, [id]);

        if (mountains.length === 0) {
            return responseHelper.error(res, 'Mountain not found', 'NOT_FOUND', 404);
        }

        return responseHelper.success(res, { mountain: mountains[0] });
    } catch (err) {
        console.error('Admin getMountain error:', err);
        return responseHelper.error(res, 'Failed to fetch mountain', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// CREATE MOUNTAIN
// ============================================================
async function createMountain(req, res) {
    try {
        const {
            name, slug, province, regency, latitude, longitude,
            elevation_meters, mountain_status, mountain_type, description
        } = req.body;

        // Basic validation
        if (!name || !slug || !province) {
            return responseHelper.validationError(res, [
                { field: 'name', message: 'Name is required' },
                { field: 'slug', message: 'Slug is required' },
                { field: 'province', message: 'Province is required' }
            ]);
        }

        const [result] = await pool.execute(`
            INSERT INTO mountains 
            (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
            name, slug, province, regency || null,
            latitude || null, longitude || null, elevation_meters || 0,
            mountain_status || 'dormant', mountain_type || 'stratovolcano',
            description || null
        ]);

        return responseHelper.created(res, {
            id: result.insertId,
            name, slug
        }, 'Mountain created successfully');
    } catch (err) {
        console.error('Admin createMountain error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return responseHelper.error(res, 'Mountain with this slug already exists', 'DUPLICATE', 409);
        }
        return responseHelper.error(res, 'Failed to create mountain', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// UPDATE MOUNTAIN
// ============================================================
async function updateMountain(req, res) {
    try {
        const { id } = req.params;
        const {
            name, slug, province, regency, latitude, longitude,
            elevation_meters, mountain_status, mountain_type, description
        } = req.body;

        const [result] = await pool.execute(`
            UPDATE mountains SET
                name = ?, slug = ?, province = ?, regency = ?,
                latitude = ?, longitude = ?, elevation_meters = ?,
                mountain_status = ?, mountain_type = ?, description = ?,
                updated_at = NOW()
            WHERE id = ?
        `, [
            name, slug, province, regency || null,
            latitude || null, longitude || null, elevation_meters || 0,
            mountain_status || 'dormant', mountain_type || 'stratovolcano',
            description || null,
            id
        ]);

        if (result.affectedRows === 0) {
            return responseHelper.error(res, 'Mountain not found', 'NOT_FOUND', 404);
        }

        return responseHelper.success(res, { id, name }, 'Mountain updated successfully');
    } catch (err) {
        console.error('Admin updateMountain error:', err);
        return responseHelper.error(res, 'Failed to update mountain', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// DELETE MOUNTAIN
// ============================================================
async function deleteMountain(req, res) {
    try {
        const { id } = req.params;

        const [result] = await pool.execute('DELETE FROM mountains WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return responseHelper.error(res, 'Mountain not found', 'NOT_FOUND', 404);
        }

        return responseHelper.success(res, null, 'Mountain deleted successfully');
    } catch (err) {
        console.error('Admin deleteMountain error:', err);
        return responseHelper.error(res, 'Failed to delete mountain', 'SERVER_ERROR', 500);
    }
}

module.exports = {
    listMountains,
    getMountain,
    createMountain,
    updateMountain,
    deleteMountain
};
