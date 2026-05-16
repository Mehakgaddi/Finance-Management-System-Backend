// Budget Controller
// File: backend/controllers/budgetController.js
// Handles all budget-related operations
// Simple logic: Set budget, Get budget, Check overspending

const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { Op } = require('sequelize');

// ============ SET BUDGET ============
// User sets their monthly budget
// Example: User says "My budget is 50000 per month"
const setBudget = async (req, res) => {
  try {
    const { monthlyLimit } = req.body;
    const userId = req.userId; // comes from auth middleware

    // Validate input
    if (!monthlyLimit || monthlyLimit <= 0) {
      return res.status(400).json({ message: 'Budget must be greater than 0' });
    }

    // Get current month in format YYYY-MM
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${month}`;

    // Check if budget already exists for this month
    let budget = await Budget.findOne({
      where: { userId, month: currentMonth }
    });

    if (budget) {
      // Update existing budget
      budget.monthlyLimit = monthlyLimit;
      budget.emailSent = false; // Reset email flag when budget changes
      await budget.save();
      return res.status(200).json({
        message: 'Budget updated successfully',
        budget
      });
    }

    // Create new budget for this month
    budget = await Budget.create({
      monthlyLimit,
      month: currentMonth,
      userId,
      emailSent: false
    });

    res.status(201).json({
      message: 'Budget set successfully',
      budget
    });

  } catch (error) {
    console.error('Error setting budget:', error.message);
    res.status(500).json({ message: 'Failed to set budget' });
  }
};

// ============ GET BUDGET ============
// Get user's current month budget
const getBudget = async (req, res) => {
  try {
    const userId = req.userId;

    // Get current month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${month}`;

    // Find budget for current month
    const budget = await Budget.findOne({
      where: { userId, month: currentMonth }
    });

    if (!budget) {
      return res.status(404).json({ message: 'No budget set for this month' });
    }

    res.status(200).json(budget);

  } catch (error) {
    console.error('Error getting budget:', error.message);
    res.status(500).json({ message: 'Failed to get budget' });
  }
};

// ============ CHECK OVERSPENDING ============
// Check if user has exceeded their budget
// This is called automatically when a transaction is added
// Returns: { isOverspending: true/false, currentSpending, budget }
const checkOverspending = async (userId) => {
  try {
    // Get current month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${month}`;

    // Get user's budget for this month
    const budget = await Budget.findOne({
      where: { userId, month: currentMonth }
    });

    // If no budget set, can't check overspending
    if (!budget) {
      return { isOverspending: false, currentSpending: 0, budget: null };
    }

    // Get all expenses for this month only — filter in the DB, not in JS
    const transactions = await Transaction.findAll({
      where: {
        userId,
        type: 'expense',
        date: {
          [Op.gte]: `${currentMonth}-01`,
          [Op.lte]: `${currentMonth}-31`,
        }
      }
    });

    // Sum up the spending
    let currentSpending = 0;
    transactions.forEach(t => {
      currentSpending += parseFloat(t.amount);
    });

    // Check if overspending
    const isOverspending = currentSpending > budget.monthlyLimit;

    return {
      isOverspending,
      currentSpending,
      budget: budget.monthlyLimit,
      emailSent: budget.emailSent
    };

  } catch (error) {
    console.error('Error checking overspending:', error.message);
    return { isOverspending: false, currentSpending: 0, budget: null };
  }
};

// ============ UPDATE EMAIL SENT FLAG ============
// Mark that overspending email has been sent
// This prevents sending multiple emails for same overspending
const markEmailSent = async (userId) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${month}`;

    const budget = await Budget.findOne({
      where: { userId, month: currentMonth }
    });

    if (budget) {
      budget.emailSent = true;
      await budget.save();
    }

  } catch (error) {
    console.error('Error marking email sent:', error.message);
  }
};

module.exports = {
  setBudget,
  getBudget,
  checkOverspending,
  markEmailSent
};
