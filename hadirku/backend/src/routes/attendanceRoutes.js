const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/class', authenticateToken, authorizeRoles('admin', 'guru'), attendanceController.getByClassAndDate);
router.post('/save-batch', authenticateToken, authorizeRoles('admin', 'guru'), attendanceController.saveBatch);
router.post('/quick-scan', authenticateToken, authorizeRoles('admin', 'guru'), attendanceController.quickScanQR);
router.get('/history', authenticateToken, attendanceController.getHistory);

module.exports = router;
