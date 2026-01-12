/**
 * ============================================================
 * MOUNTKEY - API v1 ROUTER INDEX
 * ============================================================
 * Central router untuk semua endpoint v1.
 * 
 * BASE PATH: /v1
 * 
 * AUTHENTICATION:
 * All v1 routes require API key via X-MountKey-API-Key header
 * 
 * ENDPOINTS:
 * - GET /v1                           - API v1 info
 * - GET /v1/mountains                 - List all mountains
 * - GET /v1/mountains/:slug           - Get single mountain
 * - GET /v1/mountains/:slug/trails    - Get trails for mountain
 * - GET /v1/mountains/:slug/weather-risk - Get weather risk
 * - GET /v1/mountains/:slug/weather-meta - Get weather meta
 * - GET /v1/trails/:slug              - Get single trail
 * ============================================================
 */

const express = require('express');
const router = express.Router();

// Middleware
const { authenticateApiKey } = require('../../middlewares/apiKeyAuth');

// Route modules
const mountainsRoutes = require('./mountains.routes');
const trailsRoutes = require('./trails.routes');

// ============================================================
// APPLY AUTHENTICATION TO ALL v1 ROUTES
// ============================================================

router.use(authenticateApiKey);

// ============================================================
// MOUNT ROUTES
// ============================================================

/**
 * Mountains Routes
 * 
 * GET /v1/mountains
 * GET /v1/mountains/:slug
 * GET /v1/mountains/:slug/trails
 * GET /v1/mountains/:slug/weather-risk
 * GET /v1/mountains/:slug/weather-meta
 */
router.use('/mountains', mountainsRoutes);

/**
 * Trails Routes
 * 
 * GET /v1/trails/:slug
 */
router.use('/trails', trailsRoutes);

// ============================================================
// v1 ROOT INFO
// ============================================================

/**
 * GET /v1
 * 
 * API v1 information endpoint
 */
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'MountKey API v1',
        data: {
            version: 'v1',
            description: 'Public API untuk data gunung dan jalur pendakian Indonesia',
            endpoints: {
                mountains: {
                    list: {
                        method: 'GET',
                        path: '/v1/mountains',
                        description: 'List all mountains with pagination'
                    },
                    detail: {
                        method: 'GET',
                        path: '/v1/mountains/:slug',
                        description: 'Get single mountain by slug'
                    },
                    trails: {
                        method: 'GET',
                        path: '/v1/mountains/:slug/trails',
                        description: 'Get all trails for a mountain'
                    },
                    weather_risk: {
                        method: 'GET',
                        path: '/v1/mountains/:slug/weather-risk',
                        description: 'Get weather risk assessment'
                    },
                    weather_meta: {
                        method: 'GET',
                        path: '/v1/mountains/:slug/weather-meta',
                        description: 'Get static weather metadata'
                    }
                },
                trails: {
                    detail: {
                        method: 'GET',
                        path: '/v1/trails/:slug',
                        description: 'Get single trail with checkpoints'
                    }
                }
            },
            authenticated_as: {
                user_id: req.user.id,
                user_name: req.user.name,
                api_key_id: req.apiKey.id
            }
        },
        timestamp: new Date().toISOString()
    });
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = router;
