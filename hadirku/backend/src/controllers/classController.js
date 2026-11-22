const dbService = require('../services/dbService');

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await dbService.getClasses();
    return res.json({
      success: true,
      data: classes,
      total: classes.length
    });
  } catch (err) {
    console.error('Error in getAllClasses:', err);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar kelas.' });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const cls = await dbService.getClassById(req.params.id);
    if (!cls) {
      return res.status(404).json({ success: false, message: 'Kelas tidak ditemukan.' });
    }
    return res.json({ success: true, data: cls });
  } catch (err) {
    console.error('Error in getClassById:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data kelas.' });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { name, grade, major_id, academic_year_id, homeroom_teacher_id } = req.body;

    if (!name || !major_id) {
      return res.status(400).json({
        success: false,
        message: 'Nama Kelas dan Jurusan wajib diisi.'
      });
    }

    const newClass = await dbService.createClass({
      name: name.trim(),
      grade: grade ? Number(grade) : 10,
      major_id: Number(major_id),
      academic_year_id: academic_year_id ? Number(academic_year_id) : 1,
      homeroom_teacher_id: homeroom_teacher_id ? Number(homeroom_teacher_id) : null
    });

    return res.status(201).json({
      success: true,
      message: 'Kelas baru berhasil ditambahkan.',
      data: newClass
    });
  } catch (err) {
    console.error('Error in createClass:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Gagal menambahkan kelas baru.'
    });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { name, grade, major_id, academic_year_id, homeroom_teacher_id } = req.body;
    const updated = await dbService.updateClass(req.params.id, {
      name: name ? name.trim() : undefined,
      grade,
      major_id,
      academic_year_id,
      homeroom_teacher_id
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Kelas tidak ditemukan.' });
    }

    return res.json({
      success: true,
      message: 'Data kelas berhasil diperbarui.',
      data: updated
    });
  } catch (err) {
    console.error('Error in updateClass:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui data kelas.' });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const deleted = await dbService.deleteClass(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Kelas tidak ditemukan.' });
    }
    return res.json({ success: true, message: 'Data kelas berhasil dihapus.' });
  } catch (err) {
    console.error('Error in deleteClass:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus data kelas.' });
  }
};
