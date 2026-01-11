/**
 * ============================================================
 * MOUNTKEY - API KEY UTILITIES
 * ============================================================
 * Core utilities untuk generate, hash, dan validasi API key.
 * 
 * SECURITY NOTES:
 * - API key di-generate dengan crypto.randomBytes (CSPRNG)
 * - Hash menggunakan SHA-256 (cepat untuk lookup)
 * - Format: {prefix}{random_base64url}
 * ============================================================
 */

const crypto = require('crypto');

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
    PREFIX: 'mk_live_',           // Prefix untuk identifikasi
    RANDOM_BYTES: 32,             // 256 bits of entropy
    MIN_KEY_LENGTH: 40,           // Minimum total length
};

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * Generate secure random API key
 * 
 * Format: mk_live_[43 karakter base64url]
 * Total: 51 karakter
 * Entropy: 256 bits
 * 
 * @returns {string} Plain text API key
 * 
 * @example
 * const key = generateApiKey();
 * // => "mk_live_dGhpcyBpcyBhIHRlc3Qga2V5IGZvciBkZW1v"
 */
function generateApiKey() {
    const randomBytes = crypto.randomBytes(CONFIG.RANDOM_BYTES);
    const randomString = randomBytes.toString('base64url');
    return `${CONFIG.PREFIX}${randomString}`;
}

/**
 * Hash API key menggunakan SHA-256
 * 
 * Digunakan untuk:
 * - Storage di database (NEVER store plain text)
 * - Lookup saat validasi
 * 
 * @param {string} apiKey - Plain text API key
 * @returns {string} SHA-256 hash (64 karakter hex)
 * 
 * @example
 * const hash = hashApiKey("mk_live_abc123...");
 * // => "a1b2c3d4e5f6..."
 */
function hashApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
        throw new Error('API key must be a non-empty string');
    }

    return crypto
        .createHash('sha256')
        .update(apiKey, 'utf8')
        .digest('hex');
}

/**
 * Mask API key untuk display yang aman
 * 
 * Format: mk_live_****...****abcd
 * Hanya menampilkan prefix dan 4 karakter terakhir
 * 
 * @param {string} prefix - Prefix API key
 * @param {string} lastFour - 4 karakter terakhir
 * @returns {string} Masked API key
 * 
 * @example
 * maskApiKey("mk_live_", "abcd");
 * // => "mk_live_****************************abcd"
 */
function maskApiKey(prefix, lastFour) {
    const maskLength = 28; // Jumlah asterisk
    return `${prefix}${'*'.repeat(maskLength)}${lastFour}`;
}

/**
 * Extract last 4 characters dari API key
 * 
 * @param {string} apiKey - Plain text API key
 * @returns {string} 4 karakter terakhir
 */
function getLastFour(apiKey) {
    if (!apiKey || apiKey.length < 4) {
        return '****';
    }
    return apiKey.slice(-4);
}

/**
 * Get prefix dari API key
 * 
 * @param {string} apiKey - Plain text API key
 * @returns {string} Prefix
 */
function getPrefix(apiKey) {
    return CONFIG.PREFIX;
}

/**
 * Validasi format API key
 * 
 * Rules:
 * 1. Harus string non-empty
 * 2. Harus dimulai dengan prefix yang benar
 * 3. Harus memenuhi minimum length
 * 4. Hanya boleh karakter alphanumeric, -, _
 * 
 * @param {string} apiKey - API key untuk divalidasi
 * @returns {{ valid: boolean, error?: string }}
 * 
 * @example
 * validateApiKeyFormat("mk_live_abc123");
 * // => { valid: true }
 * 
 * validateApiKeyFormat("invalid");
 * // => { valid: false, error: "Invalid prefix" }
 */
function validateApiKeyFormat(apiKey) {
    // Check type
    if (!apiKey || typeof apiKey !== 'string') {
        return { valid: false, error: 'API key must be a string' };
    }

    // Check prefix
    if (!apiKey.startsWith(CONFIG.PREFIX)) {
        return { valid: false, error: 'Invalid API key prefix' };
    }

    // Check minimum length
    if (apiKey.length < CONFIG.MIN_KEY_LENGTH) {
        return { valid: false, error: 'API key too short' };
    }

    // Check characters (base64url safe: a-z, A-Z, 0-9, -, _)
    const keyPart = apiKey.slice(CONFIG.PREFIX.length);
    const validChars = /^[a-zA-Z0-9_-]+$/;

    if (!validChars.test(keyPart)) {
        return { valid: false, error: 'API key contains invalid characters' };
    }

    return { valid: true };
}

/**
 * Calculate expiration date dari sekarang
 * 
 * @param {number} days - Jumlah hari dari sekarang
 * @returns {Date} Expiration date (UTC)
 */
function calculateExpirationDate(days) {
    const expiresAt = new Date();
    expiresAt.setUTCDate(expiresAt.getUTCDate() + days);
    return expiresAt;
}

/**
 * Check apakah tanggal sudah expired
 * 
 * @param {Date|string} expiresAt - Tanggal expiration
 * @returns {boolean} True jika sudah expired
 */
function isExpired(expiresAt) {
    const expiry = new Date(expiresAt);
    const now = new Date();
    return expiry <= now;
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    // Core functions
    generateApiKey,
    hashApiKey,
    maskApiKey,
    getLastFour,
    getPrefix,
    validateApiKeyFormat,

    // Date utilities
    calculateExpirationDate,
    isExpired,

    // Config (read-only)
    CONFIG: Object.freeze({ ...CONFIG })
};
