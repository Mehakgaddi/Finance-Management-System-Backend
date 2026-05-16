// Budget Service
// File: backend/services/budgetService.js
// Handles budget checking and overspending notifications
// This service is called when a transaction is added

const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { sendOverspendingAlert } = require('./emailService');

/**
 * Check if user is overspending and send email if needed
 * This function is called after every transaction is added
 * 
 * @param {number} userId - User ID
 * @returns {Promise<object>} Result with overspending status
 */
const checkAndNotifyOverspending = async (userId) => {
  try {
    // Get current month in format YYYY-MM
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${month}`;

    // Get user's budget for this month
    const budget = await Budget.findOne({
      where: { userId, month: currentMonth }
    });

    // If no budget set, nothing to check
    if (!budget) {
      return {
        isOverspending: false,
        message: 'No budget set for this month'
      };
    }

    // Get all expenses for this month
    const transactions = await Transaction.findAll({
      where: { userId, type: 'expense' }
    });

    // Calculate total spending for current month
    let currentSpending = 0;
    transactions.forEach(t => {
      // Check if transaction is in current month
      const transactionDate = new Date(t.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = String(transactionDate.getMonth() + 1).padStart(2, '0');
      const transactionMonthStr = `${transactionYear}-${transactionMonth}`;

      if (transactionMonthStr === currentMonth) {
        currentSpending += parseFloat(t.amount);
      }
    });

    // Check if overspending
    const isOverspending = currentSpending > budget.monthlyLimit;

    // If overspending and email not sent yet, send email
    if (isOverspending && !budget.emailSent) {
      // Get user details
      const user = await User.findByPk(userId);

      if (user) {
        // Send overspending email
        const emailSent = await sendOverspendingAlert(
          user.email,
          user.name,
          budget.monthlyLimit,
          currentSpending
        );

        // Mark email as sent
        if (emailSent) {
          budget.emailSent = true;
          await budget.save();
          console.log(`📧 Overspending email sent to ${user.email}`);
        }
      }
    }

    // If spending is back under budget, reset email flag
    if (!isOverspending && budget.emailSent) {
      budget.emailSent = false;
      await budget.save();
      console.log('✅ Spending is back under budget. Email flag reset.');
    }

    return {
      isOverspending,
      currentSpending,
      budget: budget.monthlyLimit,
      emailSent: budget.emailSent
    };

  } catch (error) {
    console.error('Error checking overspending:', error.message);
    return {
      isOverspending: false,
      error: error.message
    };
  }
};

module.exports = {
  checkAndNotifyOverspending
};
