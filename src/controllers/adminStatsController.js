/**
 * ============================================================
 * MOUNTKEY - ADMIN STATS CONTROLLER
 * ============================================================
 * Controller untuk mengambil statistik dashboard dari database
 * ============================================================
 */

const { pool } = require('../config/database');

/**
 * GET /admin/stats
 * Mengambil statistik untuk dashboard admin
 */
exports.getDashboardStats = async (req, res) => {
    try {
        // Query untuk menghitung total mountains yang aktif
        const [mountainsResult] = await pool.query(
            'SELECT COUNT(*) as total FROM mountains WHERE is_active = 1'
        );

        // Query untuk menghitung total trails yang aktif
        const [trailsResult] = await pool.query(
            'SELECT COUNT(*) as total FROM trails WHERE is_active = 1'
        );

        // Query untuk menghitung total users
        const [usersResult] = await pool.query(
            'SELECT COUNT(*) as total FROM users'
        );

        // Query untuk menghitung active API keys (status = 'active' dan belum expired)
        const [apiKeysResult] = await pool.query(
            `SELECT COUNT(*) as total FROM api_keys 
             WHERE status = 'active' 
             AND expires_at > NOW()`
        );

        res.json({
            success: true,
            data: {
                totalMountains: mountainsResult[0].total || 0,
                totalTrails: trailsResult[0].total || 0,
                totalUsers: usersResult[0].total || 0,
                totalApiKeys: apiKeysResult[0].total || 0
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
};
