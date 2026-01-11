/**
 * ============================================================
 * MOUNTKEY - EXAMPLE ROUTES
 * ============================================================
 * Contoh penggunaan middleware apiKeyAuth di routes.
 * 
 * File ini menunjukkan:
 * 1. Route publik (tanpa auth)
 * 2. Route protected (dengan auth)
 * 3. Route optional auth
 * ============================================================
 */

const express = require('express');
const router = express.Router();

// Import middleware
const {
    authenticateApiKey,
    optionalApiKey
} = require('../middlewares/apiKeyAuth');

// Import response helper
const { success } = require('../utils/responseHelper');

// ============================================================
// PUBLIC ROUTES (Tanpa API Key)
// ============================================================

/**
 * GET /example/public
 * Route publik - tidak perlu API key
 */
router.get('/public', (req, res) => {
    return success(res, {
        message: 'This is a public endpoint',
        authenticated: false
    });
});

// ============================================================
// PROTECTED ROUTES (Wajib API Key)
// ============================================================

/**
 * GET /example/protected
 * Route protected - WAJIB API key
 * 
 * Jika valid:
 * - req.user tersedia
 * - req.apiKey tersedia
 * 
 * Jika tidak valid:
 * - Return 401 dengan error code
 */
router.get('/protected', authenticateApiKey, (req, res) => {
    return success(res, {
        message: 'You have access to protected resources',
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        },
        apiKey: {
            id: req.apiKey.id,
            name: req.apiKey.keyName,
            expiresAt: req.apiKey.expiresAt
        }
    });
});

/**
 * GET /example/me
 * Get current user info
 */
router.get('/me', authenticateApiKey, (req, res) => {
    return success(res, {
        user: req.user,
        apiKey: {
            id: req.apiKey.id,
            name: req.apiKey.keyName,
            expiresAt: req.apiKey.expiresAt
        }
    });
});

// ============================================================
// OPTIONAL AUTH ROUTES
// ============================================================

/**
 * GET /example/optional
 * Route dengan optional auth
 * 
 * Bisa diakses dengan atau tanpa API key.
 * Response berbeda berdasarkan status auth.
 */
router.get('/optional', optionalApiKey, (req, res) => {
    if (req.user) {
        // Authenticated request
        return success(res, {
            authenticated: true,
            user: req.user,
            message: 'Welcome back!'
        });
    } else {
        // Anonymous request
        return success(res, {
            authenticated: false,
            message: 'Hello, anonymous user!'
        });
    }
});

// ============================================================
// PROTECTED ROUTE GROUP
// ============================================================

/**
 * Cara apply middleware ke semua routes dalam group
 */
const protectedRouter = express.Router();

// Apply middleware ke semua routes di bawah
protectedRouter.use(authenticateApiKey);

protectedRouter.get('/resource-1', (req, res) => {
    return success(res, { resource: 1, user: req.user.name });
});

protectedRouter.get('/resource-2', (req, res) => {
    return success(res, { resource: 2, user: req.user.name });
});

protectedRouter.get('/resource-3', (req, res) => {
    return success(res, { resource: 3, user: req.user.name });
});

// Mount protected router
router.use('/resources', protectedRouter);

// ============================================================
// EXPORTS
// ============================================================

module.exports = router;
