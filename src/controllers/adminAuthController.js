/**
 * ============================================================
 * MOUNTKEY - ADMIN AUTH CONTROLLER
 * ============================================================
 * Controller untuk autentikasi admin (TERPISAH dari user):
 * - POST /admin/register
 * - POST /admin/login
 * ============================================================
 */

const adminService = require('../services/adminService');
const responseHelper = require('../utils/responseHelper');

// Helper wrapper untuk memastikan fungsi tersedia
const success = (res, data, msg, code) => responseHelper.success(res, data, msg, code);
const errorResponse = (res, msg, code, status) => {
    // Defensive check
    if (typeof responseHelper.error === 'function') {
        return responseHelper.error(res, msg, code, status);
    }
    // Fallback manual jika helper gagal
    return res.status(status || 500).json({
        success: false,
        message: msg,
        error_code: code,
        timestamp: new Date().toISOString()
    });
};
const validationError = (res, errors) => responseHelper.validationError(res, errors);

/**
 * POST /admin/register
 * Register admin baru
 */
async function register(req, res) {
    try {
        const { name, email, password } = req.body;

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
            return validationError(res, errors);
        }

        // Register admin
        const admin = await adminService.registerAdmin({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password
        });

        // Generate simple token (admin_id encoded)
        const token = Buffer.from(`admin:${admin.id}:${admin.email}`).toString('base64');

        return success(res, {
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            },
            token
        }, 'Admin registration successful', 201);

    } catch (err) {
        if (err.message === 'EMAIL_EXISTS') {
            return errorResponse(res, 'Email already registered', 'EMAIL_EXISTS', 409);
        }

        console.error('Admin registration error:', err);
        return errorResponse(res, 'Registration failed', 'SERVER_ERROR', 500);
    }
}

/**
 * POST /admin/login
 * Login admin
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return validationError(res, [
                { field: 'email', message: 'Email is required' },
                { field: 'password', message: 'Password is required' }
            ]);
        }

        // Login admin
        const admin = await adminService.loginAdmin(
            email.toLowerCase().trim(),
            password
        );

        // Generate simple token
        const token = Buffer.from(`admin:${admin.id}:${admin.email}`).toString('base64');

        return success(res, {
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            },
            token
        }, 'Login successful');

    } catch (err) {
        // Logging detail error ke server console
        console.error('------------------------------------------');
        console.error('ADMIN LOGIN ERROR');
        console.error('Time:', new Date().toISOString());
        console.error('Error Message:', err.message);
        console.error('Stack:', err.stack);
        console.error('------------------------------------------');

        // Handle specific business logic errors
        if (err.message === 'INVALID_CREDENTIALS') {
            return errorResponse(res, 'Invalid email or password', 'INVALID_CREDENTIALS', 401);
        }

        if (err.message === 'ADMIN_SUSPENDED') {
            return errorResponse(res, 'Your admin account is suspended', 'ADMIN_SUSPENDED', 403);
        }

        // Handle unhandled errors
        if (typeof errorResponse === 'function') {
            return errorResponse(res, 'Login failed due to server error', 'SERVER_ERROR', 500);
        } else {
            // Fallback jika helper error response tidak tersedia/rusak
            return res.status(500).json({
                success: false,
                message: 'Critical Server Error',
                error: err.message
            });
        }
    }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = {
    register,
    login
};
