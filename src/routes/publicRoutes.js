/**
 * ============================================================
 * MOUNTKEY - PUBLIC ROUTES
 * ============================================================
 * Routes untuk akses publik (tanpa API key).
 * Read-only, data dasar saja.
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// ============================================================
// PUBLIC MOUNTAINS (NO AUTH REQUIRED)
// ============================================================

/**
 * GET /public/mountains
 * List semua gunung (public catalog)
 */
router.get('/mountains', publicController.listMountainsPublic);

/**
 * GET /public/mountains/:slug
 * Get single mountain (public catalog)
 */
router.get('/mountains/:slug', publicController.getMountainPublic);

module.exports = router;
