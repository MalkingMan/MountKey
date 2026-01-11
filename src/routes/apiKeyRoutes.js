/**
 * ============================================================
 * MOUNTKEY - API KEY ROUTES
 * ============================================================
 * Routes untuk API key management
 * Menggunakan JWT authentication untuk web user
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');
const { authenticateJWT } = require('../middlewares/jwtAuth');

// Semua routes memerlukan JWT authentication (Bearer token)
router.use(authenticateJWT);

/**
 * GET /api-keys
 * List semua API keys milik user
 */
router.get('/', apiKeyController.listApiKeys);

/**
 * POST /api-keys
 * Create API key baru
 */
router.post('/', apiKeyController.createApiKey);

/**
 * GET /api-keys/:id
 * Get detail single API key
 */
router.get('/:id', apiKeyController.getApiKey);

/**
 * DELETE /api-keys/:id
 * Revoke API key
 */
router.delete('/:id', apiKeyController.revokeApiKey);

/**
 * POST /api-keys/:id/regenerate
 * Regenerate API key
 */
router.post('/:id/regenerate', apiKeyController.regenerateApiKey);

module.exports = router;
