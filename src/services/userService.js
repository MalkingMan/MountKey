/**
 * ============================================================
 * MOUNTKEY - USER SERVICE
 * ============================================================
 * Business logic untuk operasi user:
 * - Register
 * - Login
 * - Get profile
 * ============================================================
 */

const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const SALT_ROUNDS = 12;

/**
 * Register user baru
 * 
 * @param {object} userData - { name, email, password }
 * @returns {object} - User data (tanpa password)
 */
async function registerUser(userData) {
    const { name, email, password } = userData;

    // Check apakah email sudah ada
    const [existing] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
    );

    if (existing.length > 0) {
        throw new Error('EMAIL_EXISTS');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const [result] = await pool.execute(`
        INSERT INTO users (name, email, password_hash, role, status, created_at)
        VALUES (?, ?, ?, 'user', 'active', NOW())
    `, [name, email, passwordHash]);

    return {
        id: result.insertId,
        name,
        email,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString()
    };
}

/**
 * Login user
 * 
 * @param {string} email - Email user
 * @param {string} password - Password plain text
 * @returns {object} - User data (tanpa password)
 */
async function loginUser(email, password) {
    // Get user by email
    const [users] = await pool.execute(`
        SELECT id, name, email, password_hash, role, status
        FROM users
        WHERE email = ?
    `, [email]);

    if (users.length === 0) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const user = users[0];

    // Check status
    if (user.status !== 'active') {
        throw new Error('USER_INACTIVE');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
        throw new Error('INVALID_CREDENTIALS');
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    };
}

/**
 * Get user by ID
 * 
 * @param {number} userId - User ID
 * @returns {object|null} - User data atau null
 */
async function getUserById(userId) {
    const [users] = await pool.execute(`
        SELECT id, name, email, role, status, created_at
        FROM users
        WHERE id = ?
    `, [userId]);

    if (users.length === 0) {
        return null;
    }

    return users[0];
}

/**
 * Get user by email
 * 
 * @param {string} email - Email user
 * @returns {object|null} - User data atau null
 */
async function getUserByEmail(email) {
    const [users] = await pool.execute(`
        SELECT id, name, email, role, status, created_at
        FROM users
        WHERE email = ?
    `, [email]);

    if (users.length === 0) {
        return null;
    }

    return users[0];
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    getUserByEmail
};
