const dbService = require('../services/dbService');

exports.getByClassAndDate = async (req, res) => {
  try {
    const { class_id, date } = req.query;
    if (!class_id || !date) {
      return res.status(400).json({
        success: false,
        message: 'Parameter class_id dan date wajib disertakan.'
      });
    }

    const records = await dbService.getAttendanceByClassAndDate(class_id, date);
    return res.json({
      success: true,
      class_id: Number(class_id),
      date,
      data: records
    });
  } catch (err) {
    console.error('Error in getByClassAndDate:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat data absensi kelas.'
    });
  }
};

exports.saveBatch = async (req, res) => {
  try {
    const { class_id, date, records } = req.body;

    if (!class_id || !date || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'Format data absensi tidak valid (class_id, date, dan records array diperlukan).'
      });
    }

    let teacherId = null;
    if (req.user.role === 'guru') {
      const teacher = await dbService.getTeacherByUserId(req.user.id);
      if (teacher) teacherId = teacher.id;
    }

    const result = await dbService.saveBatchAttendance({
      class_id: Number(class_id),
      date,
      teacher_id: teacherId,
      records
    });

    return res.json({
      success: true,
      message: `Data absensi (${result.count} siswa) berhasil disimpan.`,
      result
    });
  } catch (err) {
    console.error('Error in saveBatch attendance:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal menyimpan absensi siswa. ' + err.message
    });
  }
};

exports.quickScanQR = async (req, res) => {
  try {
    const { qr_token, status = 'HADIR', notes, date, session } = req.body;
    if (!qr_token) {
      return res.status(400).json({
        success: false,
        message: 'Token QR Code atau NIS siswa tidak boleh kosong.'
      });
    }

    const student = await dbService.getStudentByQRToken(qr_token.trim());
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Siswa dengan data QR/NIS tersebut tidak ditemukan.'
      });
    }

    const todayDate = date || new Date().toISOString().split('T')[0];
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeIn = `${hours}:${minutes}:${seconds}`;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Tentukan sesi: 'pagi' atau 'siang'
    // Sesi Pagi: Jadwal Masuk: 06:30 WIB • Batas Terlambat: 06:35 WIB • Jam Pulang: 11:50 WIB
    // Sesi Siang: Jadwal Masuk: 12:30 WIB • Batas Terlambat: 12:35 WIB • Jam Pulang: 17:50 WIB
    const activeSession = session || (now.getHours() < 12 ? 'pagi' : 'siang');

    let isLate = 0;
    let lateMinutes = 0;

    // Keterlambatan hanya dihitung untuk status HADIR
    if (status === 'HADIR') {
      if (activeSession === 'pagi') {
        const lateThreshold = 6 * 60 + 35; // 06:35 WIB
        if (currentMinutes > lateThreshold) {
          isLate = 1;
          lateMinutes = currentMinutes - lateThreshold;
        }
      } else {
        const lateThreshold = 12 * 60 + 35; // 12:35 WIB
        if (currentMinutes > lateThreshold) {
          isLate = 1;
          lateMinutes = currentMinutes - lateThreshold;
        }
      }
    }

    const sessionLabel = activeSession === 'pagi' ? 'Sesi Pagi (06:30 - 11:50)' : 'Sesi Siang (12:30 - 17:50)';
    const autoNotes = notes || (isLate ? `Terlambat ${lateMinutes} menit [${sessionLabel}]` : `Tepat Waktu [${sessionLabel}]`);

    const result = await dbService.recordQuickAttendance({
      student_id: student.id,
      date: todayDate,
      time_in: timeIn,
      status: status || 'HADIR',
      notes: autoNotes,
      is_late: isLate,
      late_minutes: lateMinutes
    });

    return res.json({
      success: true,
      message: `Presensi berhasil dicatat untuk ${student.full_name} (${student.nis}) - [${status}] ${isLate ? `(Terlambat ${lateMinutes}m)` : '(Tepat Waktu)'}`,
      data: {
        student,
        session: activeSession,
        attendance: {
          date: todayDate,
          time_in: timeIn,
          status,
          is_late: isLate,
          late_minutes: lateMinutes,
          session: activeSession
        }
      }
    });
  } catch (err) {
    console.error('Error in quickScanQR:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mencatat absensi via QR Code: ' + err.message
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { date_from, date_to, class_id, student_id, status, limit } = req.query;

    let targetStudentId = student_id;
    if (req.user.role === 'siswa') {
      const student = await dbService.getStudentByUserId(req.user.id);
      if (student) targetStudentId = student.id;
    }

    const history = await dbService.getAttendanceHistory({
      date_from,
      date_to,
      class_id,
      student_id: targetStudentId,
      status,
      limit: limit ? Number(limit) : 200
    });

    return res.json({
      success: true,
      data: history,
      total: history.length
    });
  } catch (err) {
    console.error('Error in getHistory:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat riwayat absensi.'
    });
  }
};
