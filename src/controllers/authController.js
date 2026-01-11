/**
 * ============================================================
 * MOUNTKEY - AUTH CONTROLLER
 * ============================================================
 * Controller untuk endpoint autentikasi:
 * - POST /auth/register
 * - POST /auth/login
 * ============================================================
 */

const userService = require('../services/userService');
const apiKeyService = require('../services/apiKeyService');
const { generateToken } = require('../middlewares/jwtAuth');
const {
    success: successResponse,
    error: errorResponse,
    validationError: validationErrorResponse
} = require('../utils/responseHelper');

/**
 * POST /auth/register
 * Register user baru dan generate API key pertama
 */
async function register(req, res) {
    try {
        const { name, email, password, api_key_expiration_days } = req.body;

        // Validasi input
        const errors = [];

        if (!name || name.trim().length < 2) {
            errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
        }

        if (!email || !isValidEmail(email)) {
            errors.push({ field: 'email', message: 'Valid email is required' });
        }

        if (!password || password.length < 8) {
            errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
        }

        if (errors.length > 0) {
            return validationErrorResponse(res, errors);
        }

        // Register user
        const user = await userService.registerUser({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password
        });

        // Determine expiration days (default: 30)
        const expirationDays = getValidExpirationDays(api_key_expiration_days);

        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expirationDays);

        // Generate first API key
        const { plainKey, keyData } = await apiKeyService.createApiKey(user.id, expiresAt, 'Default Key');

        // Generate JWT token for web access
        const token = generateToken(user);

        return successResponse(res, {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            api_key: {
                // ⚠️ PERHATIAN: API key ini HANYA ditampilkan SEKALI!
                key: plainKey,
                ...keyData,
                warning: 'Please save this API key. It will NOT be shown again!'
            }
        }, 'Registration successful. Please save your API key!', 201);

    } catch (error) {
        if (error.message === 'EMAIL_EXISTS') {
            return errorResponse(res, 'Email already registered', 'EMAIL_EXISTS', 409);
        }

        console.error('Registration error:', error);
        return errorResponse(res, 'Registration failed', 'SERVER_ERROR', 500);
    }
}

/**
 * POST /auth/login
 * Login user (tanpa generate API key, user bisa generate manual)
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return validationErrorResponse(res, [
                { field: 'email', message: 'Email is required' },
                { field: 'password', message: 'Password is required' }
            ]);
        }

        // Login user
        const user = await userService.loginUser(
            email.toLowerCase().trim(),
            password
        );

        // Get user's API keys
        const apiKeys = await apiKeyService.getUserApiKeys(user.id);

        // Generate JWT token for web access
        const token = generateToken(user);

        return successResponse(res, {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            api_keys: apiKeys,
            message: apiKeys.length === 0
                ? 'You have no API keys. Please create one.'
                : `You have ${apiKeys.length} API key(s).`
        }, 'Login successful');

    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return errorResponse(res, 'Invalid email or password', 'INVALID_CREDENTIALS', 401);
        }

        if (error.message === 'USER_INACTIVE') {
            return errorResponse(res, 'Your account is not active', 'USER_INACTIVE', 403);
        }

        console.error('Login error:', error);
        return errorResponse(res, 'Login failed', 'SERVER_ERROR', 500);
    }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getValidExpirationDays(days) {
    const validDays = parseInt(days);

    // Allowed values: 7, 30, 90, atau custom (max 365)
    if (isNaN(validDays) || validDays < 1) {
        return 30; // default
    }

    if (validDays > 365) {
        return 365; // max 1 tahun
    }

    return validDays;
}

module.exports = {
    register,
    login
};
