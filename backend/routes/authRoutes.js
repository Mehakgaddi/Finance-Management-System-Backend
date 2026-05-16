// This file defines the auth routes
// POST /api/auth/signup          → signup
// POST /api/auth/login           → login
// GET  /api/auth/profile         → get logged-in user info (protected)
// PUT  /api/auth/update-password → update password (protected)
// POST /api/auth/refresh-token   → get new token (protected)

const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  updatePassword,
  refreshToken,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const {
  validateSignup,
  validateLogin,
  validatePasswordUpdate,
} = require("../middleware/inputValidation");

// Apply validation middleware before the controller
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/profile", protect, getProfile);
router.put("/update-password", protect, validatePasswordUpdate, updatePassword);
router.post("/refresh-token", protect, refreshToken); // Get new token without re-login

module.exports = router;
