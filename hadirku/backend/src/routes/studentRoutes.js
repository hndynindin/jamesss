const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRoles('admin', 'guru'), studentController.getAllStudents);
router.get('/qr/:token', authenticateToken, studentController.getStudentByQR);
router.get('/:id', authenticateToken, studentController.getStudentById);
router.post('/', authenticateToken, authorizeRoles('admin'), studentController.createStudent);
router.put('/:id', authenticateToken, authorizeRoles('admin'), studentController.updateStudent);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), studentController.deleteStudent);

module.exports = router;
