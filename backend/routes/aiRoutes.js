// This file defines the AI routes
// All routes are protected - user must be logged in

const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getInsights } = require("../controllers/aiController");

// Get AI Financial Insights
router.get("/insights", protect, getInsights);

module.exports = router;
