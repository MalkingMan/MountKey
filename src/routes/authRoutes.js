/**
 * ============================================================
 * MOUNTKEY - AUTH ROUTES
 * ============================================================
 * Routes untuk autentikasi (tanpa API key)
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * POST /auth/register
 * Register user baru + generate first API key
 */
router.post('/register', authController.register);

/**
 * POST /auth/login
 * Login user + get existing API keys
 */
router.post('/login', authController.login);

module.exports = router;
