/**
 * ============================================================
 * MOUNTKEY - RESPONSE HELPER
 * ============================================================
 * Standardized response format untuk konsistensi API.
 * 
 * SUCCESS FORMAT:
 * {
 *   "success": true,
 *   "message": "...",
 *   "data": { ... },
 *   "timestamp": "2026-01-10T05:36:24.000Z"
 * }
 * 
 * ERROR FORMAT:
 * {
 *   "success": false,
 *   "message": "...",
 *   "error_code": "ERROR_CODE",
 *   "timestamp": "2026-01-10T05:36:24.000Z"
 * }
 * ============================================================
 */

// ============================================================
// SUCCESS RESPONSES
// ============================================================

/**
 * Standard success response
 * 
 * @param {object} res - Express response object
 * @param {object|null} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status (default: 200)
 */
function success(res, data = null, message = 'Success', statusCode = 200) {
    const response = {
        success: true,
        message,
        timestamp: new Date().toISOString()
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
}

/**
 * Created response (201)
 */
function created(res, data, message = 'Created successfully') {
    return success(res, data, message, 201);
}

// ============================================================
// ERROR RESPONSES
// ============================================================

/**
 * Standard error response
 * 
 * @param {object} res - Express response object
 * @param {string} message - Error message (user-friendly)
 * @param {string} errorCode - Internal error code (UPPER_SNAKE_CASE)
 * @param {number} statusCode - HTTP status (default: 400)
 */
function error(res, message, errorCode, statusCode = 400) {
    return res.status(statusCode).json({
        success: false,
        message,
        error_code: errorCode,
        timestamp: new Date().toISOString()
    });
}

/**
 * Unauthorized response (401)
 * Digunakan untuk authentication errors
 */
function unauthorized(res, message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
    return error(res, message, errorCode, 401);
}

/**
 * Forbidden response (403)
 * Digunakan untuk authorization errors
 */
function forbidden(res, message = 'Forbidden', errorCode = 'FORBIDDEN') {
    return error(res, message, errorCode, 403);
}

/**
 * Not Found response (404)
 */
function notFound(res, message = 'Resource not found', errorCode = 'NOT_FOUND') {
    return error(res, message, errorCode, 404);
}

/**
 * Conflict response (409)
 * Digunakan untuk duplicate entries
 */
function conflict(res, message = 'Resource already exists', errorCode = 'CONFLICT') {
    return error(res, message, errorCode, 409);
}

/**
 * Validation error response (422)
 * 
 * @param {object} res - Express response object
 * @param {Array} errors - Array of { field, message }
 * @param {string} message - General error message
 */
function validationError(res, errors, message = 'Validation failed') {
    return res.status(422).json({
        success: false,
        message,
        error_code: 'VALIDATION_ERROR',
        errors,
        timestamp: new Date().toISOString()
    });
}

/**
 * Internal Server Error (500)
 */
function serverError(res, message = 'Internal server error') {
    return error(res, message, 'SERVER_ERROR', 500);
}

// ============================================================
// API KEY SPECIFIC ERRORS
// ============================================================

const ApiKeyErrors = {
    MISSING: {
        message: 'API key is required. Provide header: X-MountKey-API-Key',
        code: 'API_KEY_MISSING'
    },
    INVALID_FORMAT: {
        message: 'Invalid API key format',
        code: 'API_KEY_INVALID_FORMAT'
    },
    INVALID: {
        message: 'Invalid API key',
        code: 'API_KEY_INVALID'
    },
    EXPIRED: {
        message: 'API key has expired',
        code: 'API_KEY_EXPIRED'
    },
    REVOKED: {
        message: 'API key has been revoked',
        code: 'API_KEY_REVOKED'
    },
    INACTIVE: {
        message: 'API key is not active',
        code: 'API_KEY_INACTIVE'
    },
    USER_INACTIVE: {
        message: 'User account is not active',
        code: 'USER_INACTIVE'
    }
};

/**
 * Helper untuk API key errors
 * 
 * @param {object} res - Express response object
 * @param {string} errorType - Key dari ApiKeyErrors
 */
function apiKeyError(res, errorType) {
    const err = ApiKeyErrors[errorType];
    if (!err) {
        return unauthorized(res, 'Authentication failed', 'AUTH_FAILED');
    }
    return unauthorized(res, err.message, err.code);
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    // Success
    success,
    created,

    // Errors
    error,
    unauthorized,
    forbidden,
    notFound,
    conflict,
    validationError,
    serverError,

    // API Key specific
    apiKeyError,
    ApiKeyErrors
};
