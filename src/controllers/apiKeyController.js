/**
 * ============================================================
 * MOUNTKEY - API KEY CONTROLLER
 * ============================================================
 * Controller untuk endpoint API key management:
 * - GET    /api-keys           (List all keys)
 * - POST   /api-keys           (Create new key)
 * - GET    /api-keys/:id       (Get single key)
 * - DELETE /api-keys/:id       (Revoke key)
 * - POST   /api-keys/:id/regenerate (Regenerate key)
 * ============================================================
 */

const apiKeyService = require('../services/apiKeyService');
const {
    success: successResponse,
    error: errorResponse,
    notFound: notFoundResponse,
    validationError: validationErrorResponse
} = require('../utils/responseHelper');

/**
 * GET /api-keys
 * List semua API keys milik user yang login
 */
async function listApiKeys(req, res) {
    try {
        const userId = req.user.id;
        const apiKeys = await apiKeyService.getUserApiKeys(userId);

        return successResponse(res, {
            count: apiKeys.length,
            api_keys: apiKeys
        }, 'API keys retrieved successfully');

    } catch (error) {
        console.error('List API keys error:', error);
        return errorResponse(res, 'Failed to retrieve API keys', 'SERVER_ERROR', 500);
    }
}

/**
 * POST /api-keys
 * Create API key baru
 * 
 * Body:
 * - expiration_days: 7 | 30 | 90 | custom (max 365)
 * - key_name: string (optional)
 */
async function createApiKey(req, res) {
    try {
        const userId = req.user.id;
        const { expiration_days, key_name } = req.body;

        // Validate expiration days
        const expirationDays = getValidExpirationDays(expiration_days);

        // Validate key name
        const keyName = (key_name && key_name.trim().length > 0)
            ? key_name.trim().substring(0, 50)
            : 'API Key';

        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expirationDays);

        // Create API key
        const { plainKey, keyData } = await apiKeyService.createApiKey(userId, expiresAt, keyName);

        return successResponse(res, {
            // ⚠️ API KEY DITAMPILKAN SEKALI!
            api_key: plainKey,
            ...keyData,
            warning: 'Please save this API key securely. It will NOT be shown again!'
        }, 'API key created successfully', 201);

    } catch (error) {
        console.error('Create API key error:', error);
        return errorResponse(res, 'Failed to create API key', 'SERVER_ERROR', 500);
    }
}

/**
 * GET /api-keys/:id
 * Get detail single API key
 */
async function getApiKey(req, res) {
    try {
        const userId = req.user.id;
        const apiKeyId = parseInt(req.params.id);

        if (isNaN(apiKeyId)) {
            return errorResponse(res, 'Invalid API key ID', 'INVALID_ID', 400);
        }

        const apiKeyData = await apiKeyService.getApiKeyById(userId, apiKeyId);

        if (!apiKeyData) {
            return notFoundResponse(res, 'API key not found', 'API_KEY_NOT_FOUND');
        }

        return successResponse(res, { api_key: apiKeyData });

    } catch (error) {
        console.error('Get API key error:', error);
        return errorResponse(res, 'Failed to retrieve API key', 'SERVER_ERROR', 500);
    }
}

/**
 * DELETE /api-keys/:id
 * Revoke API key
 */
async function revokeApiKey(req, res) {
    try {
        const userId = req.user.id;
        const apiKeyId = parseInt(req.params.id);

        if (isNaN(apiKeyId)) {
            return errorResponse(res, 'Invalid API key ID', 'INVALID_ID', 400);
        }

        const success = await apiKeyService.revokeApiKey(userId, apiKeyId);

        if (!success) {
            return notFoundResponse(
                res,
                'API key not found or already revoked',
                'API_KEY_NOT_FOUND'
            );
        }

        return successResponse(res, null, 'API key revoked successfully');

    } catch (error) {
        console.error('Revoke API key error:', error);
        return errorResponse(res, 'Failed to revoke API key', 'SERVER_ERROR', 500);
    }
}

/**
 * POST /api-keys/:id/regenerate
 * Regenerate API key (revoke old, create new)
 * 
 * Body:
 * - expiration_days: 7 | 30 | 90 | custom
 * - key_name: string (optional, default = nama lama)
 */
async function regenerateApiKey(req, res) {
    try {
        const userId = req.user.id;
        const oldApiKeyId = parseInt(req.params.id);
        const { expiration_days, key_name } = req.body;

        if (isNaN(oldApiKeyId)) {
            return errorResponse(res, 'Invalid API key ID', 'INVALID_ID', 400);
        }

        const expirationDays = getValidExpirationDays(expiration_days);

        const result = await apiKeyService.regenerateApiKey(userId, oldApiKeyId, {
            expirationDays,
            keyName: key_name
        });

        if (!result) {
            return notFoundResponse(res, 'API key not found', 'API_KEY_NOT_FOUND');
        }

        return successResponse(res, {
            // ⚠️ API KEY BARU DITAMPILKAN SEKALI!
            api_key: result.apiKey,
            ...result.apiKeyData,
            warning: 'Your old API key has been revoked. Please save this new key securely!'
        }, 'API key regenerated successfully', 201);

    } catch (error) {
        console.error('Regenerate API key error:', error);
        return errorResponse(res, 'Failed to regenerate API key', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getValidExpirationDays(days) {
    const validDays = parseInt(days);

    if (isNaN(validDays) || validDays < 1) {
        return 30; // default
    }

    if (validDays > 365) {
        return 365; // max 1 tahun
    }

    return validDays;
}

module.exports = {
    listApiKeys,
    createApiKey,
    getApiKey,
    revokeApiKey,
    regenerateApiKey
};
