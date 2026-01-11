/**
 * ============================================================
 * MOUNTKEY - MAIN SERVER
 * ============================================================
 * Entry point untuk MountKey API Platform
 * ============================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const publicRoutes = require('./routes/publicRoutes');
const v1Routes = require('./routes/v1');

// Import response helper
const { error } = require('./utils/responseHelper');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARES
// ============================================================

// CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
        next();
    });
}

// ============================================================
// ROUTES
// ============================================================

// Health check
app.get('/', (req, res) => {
    res.json({
        name: 'MountKey API',
        version: '1.0.0',
        description: 'API Platform Data Gunung & Jalur Pendakian Indonesia',
        status: 'running',
        documentation: '/docs',
        endpoints: {
            v1: '/v1',
            admin: '/admin'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', async (req, res) => {
    const dbConnected = await testConnection();
    res.json({
        status: dbConnected ? 'healthy' : 'unhealthy',
        database: dbConnected ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// User auth routes (for API consumers)
app.use('/auth', authRoutes);

// Admin auth routes (for admin panel - SEPARATE from users!)
app.use('/admin', adminRoutes);

// API Key management routes (protected by own middleware)
app.use('/api-keys', apiKeyRoutes);

// ============================================================
// PUBLIC ROUTES (NO AUTH REQUIRED)
// ============================================================
app.use('/public', publicRoutes);

// ============================================================
// API v1 ROUTES (Protected by API Key)
// ============================================================
app.use('/v1', v1Routes);

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler
app.use((req, res) => {
    return error(res, `Route ${req.method} ${req.path} not found`, 'NOT_FOUND', 404);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    return error(res, 'Internal server error', 'SERVER_ERROR', 500);
});

// ============================================================
// START SERVER
// ============================================================

async function startServer() {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
        console.error('❌ Cannot start server: Database connection failed');
        console.log('💡 Make sure MySQL is running on port', process.env.DB_PORT || 3309);
        process.exit(1);
    }

    // Start listening
    app.listen(PORT, () => {
        console.log('');
        console.log('============================================================');
        console.log('  🏔️  MOUNTKEY API SERVER');
        console.log('============================================================');
        console.log(`  Status    : Running`);
        console.log(`  Port      : ${PORT}`);
        console.log(`  Mode      : ${process.env.NODE_ENV || 'development'}`);
        console.log(`  Database  : ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
        console.log('============================================================');
        console.log('  User Endpoints (for API consumers):');
        console.log('    POST /auth/register - Register User');
        console.log('    POST /auth/login    - Login User');
        console.log('    *    /api-keys      - API Key Management');
        console.log('');
        console.log('  Admin Endpoints (SEPARATE from users):');
        console.log('    POST /admin/register - Register Admin');
        console.log('    POST /admin/login    - Login Admin');
        console.log('');
        console.log('  API v1 (requires API Key):');
        console.log('    GET  /v1/mountains');
        console.log('    GET  /v1/mountains/:slug');
        console.log('    GET  /v1/mountains/:slug/trails');
        console.log('    GET  /v1/mountains/:slug/weather-risk');
        console.log('    GET  /v1/trails/:slug');
        console.log('============================================================');
        console.log('');
    });
}

startServer();
