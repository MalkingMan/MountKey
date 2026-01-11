/**
 * ============================================================
 * MOUNTKEY - API KEY SERVICE
 * ============================================================
 * Core business logic untuk operasi API key.
 * 
 * RESPONSIBILITIES:
 * - Create new API key
 * - Validate API key (lookup by hash)
 * - Revoke API key
 * - Update usage statistics
 * 
 * SECURITY:
 * - API key plain text NEVER stored
 * - Only SHA-256 hash stored in database
 * - Plain text returned ONCE on creation
 * ============================================================
 */

const { pool } = require('../config/database');
const {
    generateApiKey,
    hashApiKey,
    getLastFour,
    getPrefix,
    maskApiKey,
    isExpired
} = require('../utils/apiKeyUtils');

// ============================================================
// CREATE API KEY
// ============================================================

/**
 * Create new API key untuk user
 * 
 * FLOW:
 * 1. Generate random API key
 * 2. Hash untuk storage
 * 3. Extract prefix & last 4 chars
 * 4. Insert ke database
 * 5. Return plain text (SEKALI SAJA)
 * 
 * @param {number} userId - User ID
 * @param {Date} expiresAt - Tanggal kadaluarsa
 * @param {string} keyName - Nama untuk identifikasi (optional)
 * @returns {Promise<{ plainKey: string, keyData: object }>}
 * 
 * @example
 * const { plainKey, keyData } = await createApiKey(1, new Date('2026-02-10'));
 * // plainKey: "mk_live_abc123..." (SIMPAN INI!)
 * // keyData: { id, maskedKey, expiresAt, ... }
 */
async function createApiKey(userId, expiresAt, keyName = 'Default Key') {
    // Generate API key
    const plainKey = generateApiKey();

    // Hash untuk storage
    const keyHash = hashApiKey(plainKey);

    // Extract parts untuk display
    const prefix = getPrefix(plainKey);
    const lastFour = getLastFour(plainKey);

    // Insert ke database
    const [result] = await pool.execute(`
        INSERT INTO api_keys (
            user_id, 
            api_key_hash, 
            api_key_prefix, 
            api_key_last_four, 
            key_name, 
            status, 
            expires_at
        ) VALUES (?, ?, ?, ?, ?, 'active', ?)
    `, [userId, keyHash, prefix, lastFour, keyName, expiresAt]);

    return {
        // Plain text - HANYA DITAMPILKAN SEKALI
        plainKey,

        // Data yang aman untuk disimpan/ditampilkan
        keyData: {
            id: result.insertId,
            keyName,
            maskedKey: maskApiKey(prefix, lastFour),
            status: 'active',
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString()
        }
    };
}

// ============================================================
// VALIDATE API KEY
// ============================================================

/**
 * Validate API key dan return user/key info
 * 
 * FLOW:
 * 1. Hash input key
 * 2. Query database by hash
 * 3. Validate status & expiration
 * 4. Return validated data
 * 
 * @param {string} apiKey - Plain text API key dari header
 * @returns {Promise<{ valid: boolean, error?: string, data?: object }>}
 * 
 * @example
 * const result = await validateApiKey("mk_live_abc123...");
 * 
 * if (result.valid) {
 *   console.log(result.data.user); // { id, name, email, role }
 *   console.log(result.data.apiKey); // { id, keyName, expiresAt }
 * } else {
 *   console.log(result.error); // "EXPIRED" | "REVOKED" | "INVALID"
 * }
 */
async function validateApiKey(apiKey) {
    // Hash untuk lookup
    const keyHash = hashApiKey(apiKey);

    // Query database
    const [rows] = await pool.execute(`
        SELECT 
            ak.id AS key_id,
            ak.user_id,
            ak.key_name,
            ak.status AS key_status,
            ak.expires_at,
            u.name AS user_name,
            u.email AS user_email,
            u.role AS user_role,
            u.status AS user_status
        FROM api_keys ak
        INNER JOIN users u ON ak.user_id = u.id
        WHERE ak.api_key_hash = ?
        LIMIT 1
    `, [keyHash]);

    // Key tidak ditemukan
    if (rows.length === 0) {
        return { valid: false, error: 'INVALID' };
    }

    const record = rows[0];

    // Check key status
    if (record.key_status === 'revoked') {
        return { valid: false, error: 'REVOKED' };
    }

    if (record.key_status === 'expired') {
        return { valid: false, error: 'EXPIRED' };
    }

    if (record.key_status !== 'active') {
        return { valid: false, error: 'INACTIVE' };
    }

    // Check expiration
    if (isExpired(record.expires_at)) {
        // Auto-update status ke expired
        await pool.execute(
            'UPDATE api_keys SET status = ? WHERE id = ?',
            ['expired', record.key_id]
        );
        return { valid: false, error: 'EXPIRED' };
    }

    // Check user status
    if (record.user_status !== 'active') {
        return { valid: false, error: 'USER_INACTIVE' };
    }

    // VALID - return data
    return {
        valid: true,
        data: {
            apiKey: {
                id: record.key_id,
                keyName: record.key_name,
                expiresAt: record.expires_at
            },
            user: {
                id: record.user_id,
                name: record.user_name,
                email: record.user_email,
                role: record.user_role
            }
        }
    };
}

// ============================================================
// REVOKE API KEY
// ============================================================

/**
 * Revoke API key (soft delete)
 * 
 * @param {number} keyId - API Key ID
 * @param {number} userId - User ID (untuk ownership check)
 * @returns {Promise<boolean>} - True jika berhasil
 */
async function revokeApiKey(keyId, userId) {
    const [result] = await pool.execute(`
        UPDATE api_keys 
        SET 
            status = 'revoked',
            revoked_at = NOW()
        WHERE id = ? 
          AND user_id = ? 
          AND status = 'active'
    `, [keyId, userId]);

    return result.affectedRows > 0;
}

// ============================================================
// UPDATE LAST USED
// ============================================================

/**
 * Update statistik penggunaan API key
 * 
 * Dipanggil secara async (fire-and-forget)
 * untuk tidak blocking request.
 * 
 * @param {number} keyId - API Key ID
 * @param {string} ipAddress - IP address client
 */
async function updateLastUsed(keyId, ipAddress = null) {
    try {
        await pool.execute(`
            UPDATE api_keys 
            SET 
                last_used_at = NOW(),
                last_used_ip = ?
            WHERE id = ?
        `, [ipAddress, keyId]);
    } catch (error) {
        // Log but don't throw - ini non-critical operation
        console.error('[ApiKeyService] Failed to update last_used:', error.message);
    }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get semua API keys milik user (untuk management)
 * 
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - List of API keys (masked)
 */
async function getUserApiKeys(userId) {
    const [rows] = await pool.execute(`
        SELECT 
            id,
            key_name,
            api_key_prefix,
            api_key_last_four,
            status,
            expires_at,
            last_used_at,
            created_at
        FROM api_keys
        WHERE user_id = ?
        ORDER BY created_at DESC
    `, [userId]);

    return rows.map(row => ({
        id: row.id,
        keyName: row.key_name,
        maskedKey: maskApiKey(row.api_key_prefix, row.api_key_last_four),
        status: row.status,
        expiresAt: row.expires_at,
        lastUsedAt: row.last_used_at,
        createdAt: row.created_at,
        isExpired: isExpired(row.expires_at)
    }));
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    createApiKey,
    validateApiKey,
    revokeApiKey,
    updateLastUsed,
    getUserApiKeys
};
