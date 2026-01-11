/**
 * ============================================================
 * MOUNTKEY - ADMIN USER CONTROLLER
 * ============================================================
 * Controller untuk monitoring users & API keys di Admin Panel.
 * 
 * PRINSIP KEAMANAN:
 * - API key TIDAK PERNAH ditampilkan plaintext
 * - Admin TIDAK bisa generate API key
 * - Admin TIDAK bisa login sebagai user
 * - Semua aksi eksplisit & reversible
 * ============================================================
 */

const { pool } = require('../config/database');
const { success, error, notFound } = require('../utils/responseHelper');

// ============================================================
// LIST USERS
// ============================================================

/**
 * GET /admin/users
 * List semua users dengan statistik
 */
async function listUsers(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const offset = (page - 1) * limit;

        const search = req.query.search || null;
        const status = req.query.status || null;

        // Build WHERE clause
        let whereClause = 'WHERE 1=1';
        const params = [];

        if (search) {
            whereClause += ' AND (u.email LIKE ? OR u.name LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (status) {
            whereClause += ' AND u.status = ?';
            params.push(status);
        }

        // Get total count
        const [countResult] = await pool.execute(
            `SELECT COUNT(*) as total FROM users u ${whereClause}`,
            params
        );
        const total = countResult[0].total;

        // Get users with stats
        const [rows] = await pool.execute(`
            SELECT 
                u.id,
                u.name,
                u.email,
                u.role,
                u.status,
                u.created_at,
                u.last_login_at,
                (SELECT COUNT(*) FROM api_keys WHERE user_id = u.id) as total_api_keys,
                (SELECT COUNT(*) FROM api_keys WHERE user_id = u.id AND status = 'active') as active_api_keys
            FROM users u
            ${whereClause}
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
        `, [...params, limit.toString(), offset.toString()]);

        const users = rows.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role,
            status: row.status,
            registered_at: row.created_at,
            last_login_at: row.last_login_at,
            total_api_keys: row.total_api_keys,
            active_api_keys: row.active_api_keys
        }));

        const totalPages = Math.ceil(total / limit);

        return success(res, {
            users,
            pagination: {
                current_page: page,
                per_page: limit,
                total_items: total,
                total_pages: totalPages,
                has_next: page < totalPages,
                has_prev: page > 1
            }
        }, 'Users retrieved successfully');

    } catch (err) {
        console.error('[AdminUserController] listUsers error:', err.message);
        return error(res, 'Failed to retrieve users', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// GET USER DETAIL + API KEYS
// ============================================================

/**
 * GET /admin/users/:id
 * Get user detail dengan daftar API keys (masked)
 */
async function getUser(req, res) {
    try {
        const { id } = req.params;

        // Get user
        const [users] = await pool.execute(`
            SELECT 
                id, name, email, role, status, created_at, last_login_at
            FROM users 
            WHERE id = ?
        `, [id]);

        if (users.length === 0) {
            return notFound(res, 'User not found');
        }

        const user = users[0];

        // Get user's API keys (masked!)
        const [apiKeys] = await pool.execute(`
            SELECT 
                id,
                api_key_prefix,
                api_key_last_four,
                key_name,
                status,
                expires_at,
                created_at,
                last_used_at,
                last_used_ip
            FROM api_keys
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [id]);

        const maskedApiKeys = apiKeys.map(key => ({
            id: key.id,
            masked_key: `${key.api_key_prefix}****${key.api_key_last_four}`,
            key_name: key.key_name,
            status: key.status,
            expires_at: key.expires_at,
            created_at: key.created_at,
            last_used_at: key.last_used_at,
            last_used_ip: key.last_used_ip
        }));

        return success(res, {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                registered_at: user.created_at,
                last_login_at: user.last_login_at
            },
            api_keys: maskedApiKeys
        }, 'User retrieved successfully');

    } catch (err) {
        console.error('[AdminUserController] getUser error:', err.message);
        return error(res, 'Failed to retrieve user', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// SUSPEND / UNSUSPEND USER
// ============================================================

/**
 * PUT /admin/users/:id/status
 * Update user status (suspend/unsuspend)
 */
async function updateUserStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['active', 'suspended'].includes(status)) {
            return error(res, 'Invalid status. Must be "active" or "suspended"', 'INVALID_STATUS', 400);
        }

        // Check user exists
        const [users] = await pool.execute('SELECT id, email FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return notFound(res, 'User not found');
        }

        // Update status
        await pool.execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);

        return success(res, {
            user_id: parseInt(id),
            email: users[0].email,
            status
        }, `User ${status === 'suspended' ? 'suspended' : 'activated'} successfully`);

    } catch (err) {
        console.error('[AdminUserController] updateUserStatus error:', err.message);
        return error(res, 'Failed to update user status', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// REVOKE API KEY
// ============================================================

/**
 * PUT /admin/users/:userId/api-keys/:keyId/revoke
 * Revoke API key (admin action)
 */
async function revokeApiKey(req, res) {
    try {
        const { userId, keyId } = req.params;

        // Verify key belongs to user
        const [keys] = await pool.execute(
            'SELECT id, key_name, status FROM api_keys WHERE id = ? AND user_id = ?',
            [keyId, userId]
        );

        if (keys.length === 0) {
            return notFound(res, 'API key not found');
        }

        if (keys[0].status === 'revoked') {
            return error(res, 'API key already revoked', 'ALREADY_REVOKED', 400);
        }

        // Revoke
        await pool.execute(
            'UPDATE api_keys SET status = ?, revoked_at = NOW() WHERE id = ?',
            ['revoked', keyId]
        );

        return success(res, {
            key_id: parseInt(keyId),
            key_name: keys[0].key_name,
            status: 'revoked'
        }, 'API key revoked successfully');

    } catch (err) {
        console.error('[AdminUserController] revokeApiKey error:', err.message);
        return error(res, 'Failed to revoke API key', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// EXTEND API KEY EXPIRATION
// ============================================================

/**
 * PUT /admin/users/:userId/api-keys/:keyId/extend
 * Extend API key expiration
 */
async function extendApiKey(req, res) {
    try {
        const { userId, keyId } = req.params;
        const { days } = req.body;

        // Validate days
        const extendDays = Math.min(365, Math.max(1, parseInt(days) || 30));

        // Verify key belongs to user
        const [keys] = await pool.execute(
            'SELECT id, key_name, expires_at, status FROM api_keys WHERE id = ? AND user_id = ?',
            [keyId, userId]
        );

        if (keys.length === 0) {
            return notFound(res, 'API key not found');
        }

        if (keys[0].status === 'revoked') {
            return error(res, 'Cannot extend revoked API key', 'KEY_REVOKED', 400);
        }

        // Calculate new expiration
        const currentExpiry = new Date(keys[0].expires_at);
        const now = new Date();
        const baseDate = currentExpiry > now ? currentExpiry : now;
        const newExpiry = new Date(baseDate);
        newExpiry.setDate(newExpiry.getDate() + extendDays);

        // Update
        await pool.execute(
            'UPDATE api_keys SET expires_at = ?, status = ? WHERE id = ?',
            [newExpiry, 'active', keyId]
        );

        return success(res, {
            key_id: parseInt(keyId),
            key_name: keys[0].key_name,
            previous_expiry: keys[0].expires_at,
            new_expiry: newExpiry,
            extended_days: extendDays
        }, 'API key expiration extended successfully');

    } catch (err) {
        console.error('[AdminUserController] extendApiKey error:', err.message);
        return error(res, 'Failed to extend API key', 'SERVER_ERROR', 500);
    }
}

module.exports = {
    listUsers,
    getUser,
    updateUserStatus,
    revokeApiKey,
    extendApiKey
};
