const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hadirku_super_secret_jwt_token_key_2024_tkj';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token autentikasi tidak ditemukan.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token tidak valid atau sudah kedaluwarsa. Silakan login kembali.'
      });
    }
    req.user = user;
    next();
  });
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses dilarang. Hanya role [${allowedRoles.join(', ')}] yang diizinkan.`
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
