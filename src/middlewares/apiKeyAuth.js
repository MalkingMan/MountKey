/**
 * ============================================================
 * MOUNTKEY - API KEY AUTHENTICATION MIDDLEWARE
 * ============================================================
 * Core middleware untuk validasi API key pada setiap request.
 * 
 * HEADER: X-MountKey-API-Key
 * 
 * VALIDATION FLOW:
 * ┌─────────────────────────────────────────────────────────┐
 * │  1. Extract API key dari header                         │
 * │  2. Validate format (prefix, length, characters)        │
 * │  3. Hash API key dengan SHA-256                         │
 * │  4. Query database by hash                              │
 * │  5. Check: status === 'active'                          │
 * │  6. Check: expires_at > NOW()                           │
 * │  7. Check: user.status === 'active'                     │
 * │  8. Update last_used_at (async)                         │
 * │  9. Attach user & apiKey ke req                         │
 * │  10. Call next()                                        │
 * └─────────────────────────────────────────────────────────┘
 * 
 * ERROR CODES:
 * - API_KEY_MISSING       : Header tidak ada
 * - API_KEY_INVALID_FORMAT: Format salah
 * - API_KEY_INVALID       : Key tidak ditemukan
 * - API_KEY_EXPIRED       : Key sudah expired
 * - API_KEY_REVOKED       : Key sudah di-revoke
 * - USER_INACTIVE         : User tidak aktif
 * ============================================================
 */

const { validateApiKeyFormat } = require('../utils/apiKeyUtils');
const { validateApiKey, updateLastUsed } = require('../services/apiKeyService');
const { apiKeyError } = require('../utils/responseHelper');

// ============================================================
// CONFIGURATION
// ============================================================

const HEADER_NAME = 'x-mountkey-api-key';

// ============================================================
// MAIN MIDDLEWARE
// ============================================================

/**
 * API Key Authentication Middleware
 * 
 * Validates API key dari header dan attach user info ke request.
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 * 
 * @example
 * // Protect route dengan middleware
 * app.get('/api/mountains', authenticateApiKey, (req, res) => {
 *   console.log(req.user);   // { id, name, email, role }
 *   console.log(req.apiKey); // { id, keyName, expiresAt }
 * });
 */
async function authenticateApiKey(req, res, next) {
    try {
        // ──────────────────────────────────────────────────────
        // STEP 1: Extract API key dari header
        // ──────────────────────────────────────────────────────
        const apiKey = req.headers[HEADER_NAME];

        if (!apiKey) {
            return apiKeyError(res, 'MISSING');
        }

        // ──────────────────────────────────────────────────────
        // STEP 2: Validate format
        // ──────────────────────────────────────────────────────
        const formatCheck = validateApiKeyFormat(apiKey);

        if (!formatCheck.valid) {
            return apiKeyError(res, 'INVALID_FORMAT');
        }

        // ──────────────────────────────────────────────────────
        // STEP 3-7: Validate key (hash, lookup, check status)
        // ──────────────────────────────────────────────────────
        const result = await validateApiKey(apiKey);

        if (!result.valid) {
            // Map error ke response
            return apiKeyError(res, result.error);
        }

        // ──────────────────────────────────────────────────────
        // STEP 8: Update last_used_at (async, non-blocking)
        // ──────────────────────────────────────────────────────
        const clientIp = getClientIp(req);

        // Fire and forget - tidak perlu await
        updateLastUsed(result.data.apiKey.id, clientIp);

        // ──────────────────────────────────────────────────────
        // STEP 9: Attach data ke request
        // ──────────────────────────────────────────────────────
        req.user = result.data.user;
        req.apiKey = result.data.apiKey;

        // ──────────────────────────────────────────────────────
        // STEP 10: Continue to next middleware/route
        // ──────────────────────────────────────────────────────
        next();

    } catch (error) {
        // Log error untuk debugging
        console.error('[ApiKeyAuth] Unexpected error:', error.message);

        // Return generic auth error (tidak expose internal error)
        return apiKeyError(res, 'INVALID');
    }
}

// ============================================================
// OPTIONAL MIDDLEWARE
// ============================================================

/**
 * Optional API Key Middleware
 * 
 * Sama seperti authenticateApiKey, tapi TIDAK error jika
 * API key tidak ada. Berguna untuk endpoint yang bisa
 * diakses dengan atau tanpa autentikasi.
 * 
 * @example
 * app.get('/api/public', optionalApiKey, (req, res) => {
 *   if (req.user) {
 *     // Authenticated request
 *   } else {
 *     // Anonymous request
 *   }
 * });
 */
async function optionalApiKey(req, res, next) {
    const apiKey = req.headers[HEADER_NAME];

    // Jika tidak ada API key, lanjut tanpa auth
    if (!apiKey) {
        req.user = null;
        req.apiKey = null;
        return next();
    }

    // Jika ada, validasi seperti biasa
    return authenticateApiKey(req, res, next);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Extract client IP address dari request
 * Handles proxy headers (X-Forwarded-For, etc.)
 * 
 * @param {object} req - Express request
 * @returns {string} Client IP address
 */
function getClientIp(req) {
    // Check proxy headers first
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        // Ambil IP pertama (original client)
        return forwarded.split(',')[0].trim();
    }

    // Check other common headers
    const realIp = req.headers['x-real-ip'];
    if (realIp) {
        return realIp;
    }

    // Fallback ke direct connection
    return req.ip ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        'unknown';
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    authenticateApiKey,
    optionalApiKey,
    HEADER_NAME
};
