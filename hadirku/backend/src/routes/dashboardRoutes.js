const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/admin', authenticateToken, authorizeRoles('admin'), dashboardController.getAdminStats);
router.get('/guru', authenticateToken, authorizeRoles('admin', 'guru'), dashboardController.getTeacherDashboard);
router.get('/siswa', authenticateToken, authorizeRoles('admin', 'guru', 'siswa'), dashboardController.getStudentDashboard);

module.exports = router;
