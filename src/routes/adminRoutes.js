/**
 * ============================================================
 * MOUNTKEY - ADMIN ROUTES
 * ============================================================
 * Routes untuk Admin Panel (TERPISAH dari user API)
 * 
 * BASE PATH: /admin
 * 
 * ENDPOINTS:
 * - POST /admin/register     - Register admin baru
 * - POST /admin/login        - Login admin
 * - GET  /admin/mountains    - List mountains
 * - GET  /admin/mountains/:id - Get mountain detail
 * - POST /admin/mountains    - Create mountain
 * - PUT  /admin/mountains/:id - Update mountain
 * - DELETE /admin/mountains/:id - Delete mountain
 * - GET  /admin/trails       - List trails
 * - GET  /admin/trails/:id   - Get trail detail
 * - POST /admin/trails       - Create trail
 * - PUT  /admin/trails/:id   - Update trail
 * - DELETE /admin/trails/:id - Delete trail
 * - GET  /admin/users        - List users
 * - GET  /admin/users/:id    - Get user detail + API keys
 * - PUT  /admin/users/:id/status - Suspend/unsuspend user
 * - PUT  /admin/users/:userId/api-keys/:keyId/revoke - Revoke API key
 * - PUT  /admin/users/:userId/api-keys/:keyId/extend - Extend API key
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const adminMountainController = require('../controllers/adminMountainController');
const adminTrailController = require('../controllers/adminTrailController');
const adminUserController = require('../controllers/adminUserController');

// ============================================================
// AUTH ROUTES
// ============================================================
router.post('/register', adminAuthController.register);
router.post('/login', adminAuthController.login);

// ============================================================
// MOUNTAIN ROUTES
// ============================================================
router.get('/mountains', adminMountainController.listMountains);
router.get('/mountains/:id', adminMountainController.getMountain);
router.post('/mountains', adminMountainController.createMountain);
router.put('/mountains/:id', adminMountainController.updateMountain);
router.delete('/mountains/:id', adminMountainController.deleteMountain);

// ============================================================
// WEATHER META ROUTES
// ============================================================
const adminWeatherMetaController = require('../controllers/adminWeatherMetaController');
router.get('/weather-meta/:mountain_id', adminWeatherMetaController.getWeatherMeta);
router.put('/weather-meta/:mountain_id', adminWeatherMetaController.updateWeatherMeta);

// ============================================================
// TRAIL ROUTES
// ============================================================
router.get('/trails', adminTrailController.listTrails);
router.get('/trails/:id', adminTrailController.getTrail);
router.post('/trails', adminTrailController.createTrail);
router.put('/trails/:id', adminTrailController.updateTrail);
router.delete('/trails/:id', adminTrailController.deleteTrail);

// ============================================================
// USER & API KEY MANAGEMENT ROUTES
// ============================================================
router.get('/users', adminUserController.listUsers);
router.get('/users/:id', adminUserController.getUser);
router.put('/users/:id/status', adminUserController.updateUserStatus);
router.put('/users/:userId/api-keys/:keyId/revoke', adminUserController.revokeApiKey);
router.put('/users/:userId/api-keys/:keyId/extend', adminUserController.extendApiKey);

module.exports = router;
