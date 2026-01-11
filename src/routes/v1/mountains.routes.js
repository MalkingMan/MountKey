/**
 * ============================================================
 * MOUNTKEY - MOUNTAINS ROUTES (v1)
 * ============================================================
 * Routes untuk Mountains endpoints.
 * 
 * BASE PATH: /v1/mountains
 * 
 * ENDPOINTS:
 * - GET /               - List all mountains
 * - GET /:slug          - Get single mountain
 * - GET /:slug/trails   - Get trails for mountain
 * - GET /:slug/weather-risk - (from weatherRisk.routes.js)
 * ============================================================
 */

const express = require('express');
const router = express.Router();

const {
    listMountains,
    getMountainBySlug,
    getMountainTrails
} = require('../../controllers/mountainController');
const { getWeatherRiskBySlug } = require('../../controllers/weatherRiskController');

// ============================================================
// ROUTES
// ============================================================

/**
 * GET /v1/mountains
 * 
 * List all mountains with pagination and filtering.
 * 
 * QUERY PARAMS:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - province: Filter by province name
 * - status: Filter by mountain status (active/dormant/extinct)
 * - sort: Sort field (name, elevation_meters, province, created_at)
 * - order: Sort order (asc/desc)
 * 
 * EXAMPLE:
 * GET /v1/mountains?page=1&limit=10&province=Jawa%20Timur
 */
router.get('/', listMountains);

/**
 * GET /v1/mountains/:slug
 * 
 * Get single mountain by slug.
 * 
 * EXAMPLE:
 * GET /v1/mountains/semeru
 */
router.get('/:slug', getMountainBySlug);

/**
 * GET /v1/mountains/:slug/trails
 * 
 * Get all trails for a specific mountain.
 * 
 * EXAMPLE:
 * GET /v1/mountains/semeru/trails
 */
router.get('/:slug/trails', getMountainTrails);

/**
 * GET /v1/mountains/:slug/weather-risk
 * 
 * Get weather risk assessment for a specific mountain.
 * 
 * EXAMPLE:
 * GET /v1/mountains/semeru/weather-risk
 */
router.get('/:slug/weather-risk', getWeatherRiskBySlug);

// ============================================================
// EXPORTS
// ============================================================

module.exports = router;
