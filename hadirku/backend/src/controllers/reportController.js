const dbService = require('../services/dbService');

exports.getRecap = async (req, res) => {
  try {
    const { period, class_id, student_id, date_from, date_to } = req.query;

    let targetStudentId = student_id;
    if (req.user.role === 'siswa') {
      const student = await dbService.getStudentByUserId(req.user.id);
      if (student) targetStudentId = student.id;
    }

    const report = await dbService.getRecapReport({
      period: period || 'monthly',
      class_id,
      student_id: targetStudentId,
      date_from,
      date_to
    });

    return res.json({
      success: true,
      data: report
    });
  } catch (err) {
    console.error('Error in getRecap:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat laporan rekapitulasi absensi.'
    });
  }
};

exports.getMasterData = async (req, res) => {
  try {
    const majors = await dbService.getMajors();
    const classes = await dbService.getClasses();
    const academicYears = await dbService.getAcademicYears();

    return res.json({
      success: true,
      data: {
        majors,
        classes,
        academic_years: academicYears
      }
    });
  } catch (err) {
    console.error('Error in getMasterData:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat master data.'
    });
  }
};
