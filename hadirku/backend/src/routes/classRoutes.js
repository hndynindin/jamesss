const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, classController.getAllClasses);
router.get('/:id', authenticateToken, classController.getClassById);
router.post('/', authenticateToken, authorizeRoles('admin'), classController.createClass);
router.put('/:id', authenticateToken, authorizeRoles('admin'), classController.updateClass);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), classController.deleteClass);

module.exports = router;
