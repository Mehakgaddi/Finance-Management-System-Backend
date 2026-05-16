// This file defines the filter routes
// All routes are protected - user must be logged in

const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getFilteredTransactions,
  getCategories,
} = require("../controllers/filterController");

// Get filtered transactions with query parameters
// Example: /api/filters?dateFilter=monthly&typeFilter=expense&categoryFilter=Food
router.get("/", protect, getFilteredTransactions);

// Get all unique categories for the user
router.get("/categories", protect, getCategories);

module.exports = router;
