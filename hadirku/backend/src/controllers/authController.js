const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbService = require('../services/dbService');

const JWT_SECRET = process.env.JWT_SECRET || 'hadirku_super_secret_jwt_token_key_2024_tkj';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/Email dan Password wajib diisi.'
      });
    }

    const user = await dbService.findUserByUsernameOrEmail(identifier.trim());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak ditemukan. Periksa kembali username atau email Anda.'
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password yang Anda masukkan salah. Silakan coba lagi.'
      });
    }

    let profile = null;
    if (user.role === 'guru') {
      profile = await dbService.getTeacherByUserId(user.id);
      if (profile) {
        const fullTeacher = await dbService.getTeacherById(profile.id);
        profile = fullTeacher;
      }
    } else if (user.role === 'siswa') {
      profile = await dbService.getStudentByUserId(user.id);
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile_id: profile ? profile.id : null
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      success: true,
      message: 'Login berhasil. Selamat datang di VeloCheck!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        profile
      }
    });
  } catch (err) {
    console.error('Error on login:', err);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat proses login.'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await dbService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan.'
      });
    }

    let profile = null;
    if (user.role === 'guru') {
      profile = await dbService.getTeacherByUserId(user.id);
      if (profile) {
        profile = await dbService.getTeacherById(profile.id);
      }
    } else if (user.role === 'siswa') {
      profile = await dbService.getStudentByUserId(user.id);
    }

    return res.json({
      success: true,
      user: {
        ...user,
        profile
      }
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data profil.'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email, old_password, new_password, avatar } = req.body;
    const user = await dbService.findUserByUsernameOrEmail(req.user.username);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    let hashedPassword = null;
    if (new_password) {
      if (!old_password) {
        return res.status(400).json({ success: false, message: 'Password lama diperlukan untuk mengubah password.' });
      }
      const isMatch = bcrypt.compareSync(old_password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Password lama tidak cocok.' });
      }
      hashedPassword = bcrypt.hashSync(new_password, 10);
    }

    const updated = await dbService.updateUserProfile(user.id, {
      username: username ? username.trim() : undefined,
      email: email ? email.trim() : undefined,
      password: hashedPassword || undefined,
      avatar: avatar !== undefined ? avatar : undefined
    });

    return res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      user: updated
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui profil pengguna.'
    });
  }
};
