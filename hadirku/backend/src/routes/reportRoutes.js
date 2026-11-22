const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

router.get('/recap', authenticateToken, reportController.getRecap);
router.get('/master', authenticateToken, reportController.getMasterData);

module.exports = router;
