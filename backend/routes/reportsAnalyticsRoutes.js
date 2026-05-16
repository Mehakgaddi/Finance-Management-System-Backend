// This file defines the reports and analytics routes
// All routes are protected - user must be logged in

const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getReport } = require("../controllers/reportsController");

// Get spending report and analytics
router.get("/spending", protect, getReport);

module.exports = router;
