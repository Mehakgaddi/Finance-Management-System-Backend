// Budget Routes
// File: backend/routes/budgetRoutes.js
// Defines all budget-related API endpoints
// All routes are protected (require JWT token)

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  setBudget,
  getBudget
} = require('../controllers/budgetController');

// ============ ROUTES ============

// POST /api/budget/set
// User sets their monthly budget
// Body: { monthlyLimit: 50000 }
router.post('/set', protect, setBudget);

// GET /api/budget/get
// Get user's current month budget
router.get('/get', protect, getBudget);

module.exports = router;
