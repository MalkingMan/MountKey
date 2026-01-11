/**
 * ============================================================
 * MOUNTKEY - JWT AUTHENTICATION MIDDLEWARE
 * ============================================================
 * Middleware untuk autentikasi user berbasis JWT token.
 * Digunakan untuk web user yang login via /auth/login
 * ============================================================
 */

const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { unauthorized } = require('../utils/responseHelper');

const JWT_SECRET = process.env.JWT_SECRET || 'mountkey-secret-key-change-in-production';

/**
 * JWT Authentication Middleware
 * 
 * Validates JWT token dari header Authorization: Bearer <token>
 */
async function authenticateJWT(req, res, next) {
    try {
        // Extract token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return unauthorized(res, 'Authentication token is required', 'TOKEN_MISSING');
        }

        const token = authHeader.substring(7); // Remove 'Bearer '

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return unauthorized(res, 'Token has expired', 'TOKEN_EXPIRED');
            }
            return unauthorized(res, 'Invalid token', 'TOKEN_INVALID');
        }

        // Get user from database
        const [users] = await pool.execute(
            `SELECT id, name, email, role, status FROM users WHERE id = ? AND status = 'active' LIMIT 1`,
            [decoded.userId]
        );

        if (users.length === 0) {
            return unauthorized(res, 'User not found or inactive', 'USER_NOT_FOUND');
        }

        // Attach user to request
        req.user = users[0];
        next();

    } catch (error) {
        console.error('[JWTAuth] Error:', error.message);
        return unauthorized(res, 'Authentication failed', 'AUTH_FAILED');
    }
}

/**
 * Generate JWT token for user
 */
function generateToken(user, expiresIn = '7d') {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn }
    );
}

module.exports = {
    authenticateJWT,
    generateToken,
    JWT_SECRET
};
