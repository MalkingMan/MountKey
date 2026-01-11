/**
 * ============================================================
 * MOUNTKEY - ADMIN SERVICE
 * ============================================================
 * Business logic untuk operasi admin (TERPISAH dari users):
 * - Register Admin
 * - Login Admin
 * - Get Admin Profile
 * ============================================================
 */

const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const SALT_ROUNDS = 12;

/**
 * Register admin baru
 * 
 * @param {object} adminData - { name, email, password }
 * @returns {object} - Admin data (tanpa password)
 */
async function registerAdmin(adminData) {
    const { name, email, password } = adminData;

    // Check apakah email sudah ada
    const [existing] = await pool.execute(
        'SELECT id FROM admins WHERE email = ?',
        [email]
    );

    if (existing.length > 0) {
        throw new Error('EMAIL_EXISTS');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert admin
    const [result] = await pool.execute(`
        INSERT INTO admins (name, email, password_hash, status, created_at)
        VALUES (?, ?, ?, 'active', NOW())
    `, [name, email, passwordHash]);

    return {
        id: result.insertId,
        name,
        email,
        status: 'active',
        createdAt: new Date().toISOString()
    };
}

/**
 * Login admin
 * 
 * @param {string} email - Email admin
 * @param {string} password - Password plain text
 * @returns {object} - Admin data (tanpa password)
 */
async function loginAdmin(email, password) {
    // Get admin by email
    const [admins] = await pool.execute(`
        SELECT id, name, email, password_hash, status
        FROM admins
        WHERE email = ?
    `, [email]);

    if (admins.length === 0) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const admin = admins[0];

    // Check status
    if (admin.status !== 'active') {
        throw new Error('ADMIN_SUSPENDED');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password_hash);

    if (!isValid) {
        throw new Error('INVALID_CREDENTIALS');
    }

    // Update last login
    await pool.execute(`
        UPDATE admins SET last_login_at = NOW() WHERE id = ?
    `, [admin.id]);

    return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        status: admin.status
    };
}

/**
 * Get admin by ID
 * 
 * @param {number} adminId - Admin ID
 * @returns {object|null} - Admin data atau null
 */
async function getAdminById(adminId) {
    const [admins] = await pool.execute(`
        SELECT id, name, email, status, created_at, last_login_at
        FROM admins
        WHERE id = ?
    `, [adminId]);

    if (admins.length === 0) {
        return null;
    }

    return admins[0];
}

module.exports = {
    registerAdmin,
    loginAdmin,
    getAdminById
};
