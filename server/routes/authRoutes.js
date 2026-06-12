const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (tanpa autentikasi)
router.post('/register', register);
router.post('/login', login);

// Protected routes (perlu autentikasi)
router.get('/me', protect, getMe);

module.exports = router;