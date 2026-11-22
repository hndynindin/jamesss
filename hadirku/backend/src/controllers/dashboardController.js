const dbService = require('../services/dbService');

exports.getAdminStats = async (req, res) => {
  try {
    const { date } = req.query;
    const stats = await dbService.getAdminDashboardStats(date);
    return res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Error fetching admin dashboard stats:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data dashboard admin.'
    });
  }
};

exports.getTeacherDashboard = async (req, res) => {
  try {
    let teacherId = req.query.teacher_id;
    if (!teacherId) {
      const teacher = await dbService.getTeacherByUserId(req.user.id);
      if (!teacher) {
        return res.status(404).json({ success: false, message: 'Data profil guru tidak ditemukan.' });
      }
      teacherId = teacher.id;
    }

    const stats = await dbService.getTeacherDashboardStats(teacherId, req.query.date);
    return res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Error fetching teacher dashboard:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Gagal mengambil data dashboard guru.'
    });
  }
};

exports.getStudentDashboard = async (req, res) => {
  try {
    let studentId = req.query.student_id;
    if (req.user.role === 'siswa') {
      const student = await dbService.getStudentByUserId(req.user.id);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Data profil siswa tidak ditemukan.' });
      }
      studentId = student.id;
    }

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'ID siswa diperlukan.' });
    }

    const stats = await dbService.getStudentDashboardStats(studentId);
    return res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Error fetching student dashboard:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Gagal mengambil data dashboard siswa.'
    });
  }
};
