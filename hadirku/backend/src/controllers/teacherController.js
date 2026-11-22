const dbService = require('../services/dbService');

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await dbService.getTeachers();
    return res.json({
      success: true,
      data: teachers,
      total: teachers.length
    });
  } catch (err) {
    console.error('Error in getAllTeachers:', err);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar guru.' });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await dbService.getTeacherById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Guru tidak ditemukan.' });
    }
    return res.json({ success: true, data: teacher });
  } catch (err) {
    console.error('Error in getTeacherById:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data guru.' });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { nip, full_name, email, phone, gender, subject, username, password, assigned_class_ids } = req.body;

    if (!nip || !full_name || !email || !subject) {
      return res.status(400).json({
        success: false,
        message: 'NIP, Nama Lengkap, Email, dan Mata Pelajaran wajib diisi.'
      });
    }

    const newTeacher = await dbService.createTeacher({
      nip: nip.trim(),
      full_name: full_name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      gender: gender || 'L',
      subject: subject.trim(),
      username: username ? username.trim() : nip.trim(),
      password: password || 'password123',
      assigned_class_ids: assigned_class_ids || []
    });

    return res.status(201).json({
      success: true,
      message: 'Guru baru berhasil ditambahkan.',
      data: newTeacher
    });
  } catch (err) {
    console.error('Error in createTeacher:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Gagal menambahkan data guru baru.'
    });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { nip, full_name, email, phone, gender, subject, assigned_class_ids } = req.body;
    const updated = await dbService.updateTeacher(req.params.id, {
      nip: nip ? nip.trim() : undefined,
      full_name: full_name ? full_name.trim() : undefined,
      email: email ? email.trim() : undefined,
      phone,
      gender,
      subject: subject ? subject.trim() : undefined,
      assigned_class_ids
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Guru tidak ditemukan.' });
    }

    return res.json({
      success: true,
      message: 'Data guru berhasil diperbarui.',
      data: updated
    });
  } catch (err) {
    console.error('Error in updateTeacher:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui data guru.' });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const deleted = await dbService.deleteTeacher(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Guru tidak ditemukan.' });
    }
    return res.json({ success: true, message: 'Data guru berhasil dihapus.' });
  } catch (err) {
    console.error('Error in deleteTeacher:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus data guru.' });
  }
};
