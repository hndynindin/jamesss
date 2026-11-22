const dbService = require('../services/dbService');

exports.getAllStudents = async (req, res) => {
  try {
    const { search, class_id, major_id } = req.query;
    const students = await dbService.getStudents({ search, class_id, major_id });
    return res.json({
      success: true,
      data: students,
      total: students.length
    });
  } catch (err) {
    console.error('Error in getAllStudents:', err);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar siswa.' });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await dbService.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });
    }
    return res.json({ success: true, data: student });
  } catch (err) {
    console.error('Error in getStudentById:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data siswa.' });
  }
};

exports.getStudentByQR = async (req, res) => {
  try {
    const { token } = req.params;
    const student = await dbService.getStudentByQRToken(token);
    if (!student) {
      return res.status(404).json({ success: false, message: 'QR Code atau NIS siswa tidak terdaftar.' });
    }
    return res.json({ success: true, data: student });
  } catch (err) {
    console.error('Error in getStudentByQR:', err);
    return res.status(500).json({ success: false, message: 'Gagal memverifikasi QR Code siswa.' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { nis, nisn, full_name, gender, class_id, major_id, entry_year, phone, address, email, password } = req.body;

    if (!nis || !full_name || !class_id || !major_id) {
      return res.status(400).json({
        success: false,
        message: 'NIS, Nama Lengkap, Kelas, dan Jurusan wajib diisi.'
      });
    }

    const newStudent = await dbService.createStudent({
      nis: nis.trim(),
      nisn: nisn ? nisn.trim() : null,
      full_name: full_name.trim(),
      gender: gender || 'L',
      class_id: Number(class_id),
      major_id: Number(major_id),
      entry_year: entry_year || new Date().getFullYear(),
      phone: phone ? phone.trim() : null,
      address: address ? address.trim() : null,
      email: email ? email.trim() : null,
      password: password || 'password123'
    });

    return res.status(201).json({
      success: true,
      message: 'Siswa baru berhasil ditambahkan.',
      data: newStudent
    });
  } catch (err) {
    console.error('Error in createStudent:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Gagal menambahkan data siswa baru.'
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { nis, nisn, full_name, gender, class_id, major_id, entry_year, phone, address } = req.body;
    const updated = await dbService.updateStudent(req.params.id, {
      nis: nis ? nis.trim() : undefined,
      nisn: nisn ? nisn.trim() : undefined,
      full_name: full_name ? full_name.trim() : undefined,
      gender,
      class_id,
      major_id,
      entry_year,
      phone,
      address
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });
    }

    return res.json({
      success: true,
      message: 'Data siswa berhasil diperbarui.',
      data: updated
    });
  } catch (err) {
    console.error('Error in updateStudent:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui data siswa.' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await dbService.deleteStudent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan.' });
    }
    return res.json({ success: true, message: 'Data siswa berhasil dihapus.' });
  } catch (err) {
    console.error('Error in deleteStudent:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus data siswa.' });
  }
};
