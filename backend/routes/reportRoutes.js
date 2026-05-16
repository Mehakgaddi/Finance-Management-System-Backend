// Report Routes
// File: backend/routes/reportRoutes.js
// API endpoints for report generation and email

const express = require("express");
const router = express.Router();
const {
  generatePDFReport,
  sendReportByEmail,
} = require("../controllers/reportController");
const protect = require("../middleware/authMiddleware");

/**
 * POST /api/reports/download
 * Generate PDF report and download it
 * Protected route - user must be logged in
 */
router.post("/download", protect, generatePDFReport);

/**
 * POST /api/reports/email
 * Generate PDF report and send via email
 * Protected route - user must be logged in
 */
router.post("/email", protect, sendReportByEmail);

module.exports = router;
