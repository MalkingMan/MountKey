/**
 * ============================================================
 * MOUNTKEY - TRAILS ROUTES (v1)
 * ============================================================
 * Routes untuk Trails endpoints.
 * 
 * BASE PATH: /v1/trails
 * 
 * ENDPOINTS:
 * - GET /:slug - Get single trail with checkpoints
 * ============================================================
 */

const express = require('express');
const router = express.Router();

const { getTrailBySlug } = require('../../controllers/trailController');

// ============================================================
// ROUTES
// ============================================================

/**
 * GET /v1/trails/:slug
 * 
 * Get single trail by slug with checkpoints.
 * Includes mountain information and checkpoint details.
 * 
 * EXAMPLE:
 * GET /v1/trails/semeru-via-ranu-pane
 */
router.get('/:slug', getTrailBySlug);

// ============================================================
// EXPORTS
// ============================================================

module.exports = router;
