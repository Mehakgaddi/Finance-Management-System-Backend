// This file defines the auth routes
// POST /api/auth/signup          → signup
// POST /api/auth/login           → login
// GET  /api/auth/profile         → get logged-in user info (protected)
// PUT  /api/auth/update-password → update password (protected)

const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updatePassword } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/update-password', protect, updatePassword);

module.exports = router;
