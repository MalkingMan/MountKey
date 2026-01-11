/**
 * ============================================================
 * MOUNTKEY - WEATHER RISK CONTROLLER
 * ============================================================
 * Controller untuk endpoint Weather Risk Index.
 * 
 * ENDPOINT:
 * GET /v1/mountains/:slug/weather-risk
 * 
 * FLOW:
 * 1. Extract slug dari params
 * 2. Query mountain dari database
 * 3. Call weatherRiskService
 * 4. Return formatted response
 * ============================================================
 */

const { pool } = require('../config/database');
const { getWeatherRisk } = require('../services/weatherRiskService');
const { success, notFound, error } = require('../utils/responseHelper');

// ============================================================
// MAIN CONTROLLER
// ============================================================

/**
 * GET /v1/mountains/:slug/weather-risk
 * 
 * Get weather risk assessment for a specific mountain
 * 
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
async function getWeatherRiskBySlug(req, res) {
    try {
        const { slug } = req.params;

        // ─────────────────────────────────────────────────────
        // STEP 1: Validate slug
        // ─────────────────────────────────────────────────────
        if (!slug || typeof slug !== 'string') {
            return error(res, 'Mountain slug is required', 'INVALID_SLUG', 400);
        }

        // ─────────────────────────────────────────────────────
        // STEP 2: Query mountain from database
        // ─────────────────────────────────────────────────────
        const mountain = await findMountainBySlug(slug);

        if (!mountain) {
            return notFound(
                res,
                `Mountain '${slug}' not found`,
                'MOUNTAIN_NOT_FOUND'
            );
        }

        // ─────────────────────────────────────────────────────
        // STEP 3: Get weather risk from service
        // ─────────────────────────────────────────────────────
        const weatherRisk = await getWeatherRisk({
            id: mountain.id,
            name: mountain.name,
            latitude: parseFloat(mountain.latitude),
            longitude: parseFloat(mountain.longitude),
            elevation_meters: mountain.elevation_meters
        });

        // ─────────────────────────────────────────────────────
        // STEP 4: Return success response
        // ─────────────────────────────────────────────────────
        return success(
            res,
            weatherRisk,
            'Weather risk retrieved successfully'
        );

    } catch (err) {
        console.error('[WeatherRiskController] Error:', err.message);

        // Handle specific weather service errors
        if (err.code && err.code.startsWith('WEATHER_')) {
            return error(
                res,
                'Weather service temporarily unavailable. Please try again later.',
                'WEATHER_SERVICE_UNAVAILABLE',
                503
            );
        }

        // Generic server error
        return error(
            res,
            'Failed to retrieve weather risk data',
            'SERVER_ERROR',
            500
        );
    }
}

// ============================================================
// DATABASE HELPER
// ============================================================

/**
 * Find mountain by slug from database
 * 
 * @param {string} slug - Mountain slug (URL-friendly name)
 * @returns {Promise<object|null>} Mountain data or null if not found
 */
async function findMountainBySlug(slug) {
    const [rows] = await pool.execute(`
        SELECT 
            id,
            name,
            slug,
            province,
            latitude,
            longitude,
            elevation_meters,
            mountain_status,
            mountain_type
        FROM mountains
        WHERE slug = ? AND is_active = 1
        LIMIT 1
    `, [slug]);

    return rows.length > 0 ? rows[0] : null;
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    getWeatherRiskBySlug
};
