const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silakan login terlebih dahulu.'
      });
    }

    // Debug
    console.log('Token received:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found:', req.user ? req.user._id : 'No user');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User tidak ditemukan.'
        });
      }

      next();
    } catch (jwtError) {
      console.log('JWT verification error:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid atau sudah kedaluwarsa.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah kedaluwarsa.'
    });
  }
};

module.exports = { protect };