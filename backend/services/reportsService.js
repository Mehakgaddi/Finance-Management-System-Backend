// This file handles all reports and insights logic
// Generates spending analytics and summary reports

const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

// Get comprehensive spending report
const getSpendingReport = async (userId) => {
  try {
    // Fetch all transactions for the user
    const transactions = await Transaction.findAll({
      where: { userId },
    });

    if (transactions.length === 0) {
      return {
        message: "No transactions found",
        report: null,
      };
    }

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;
    const categorySpending = {};
    const monthlyData = {};

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      // Slice the date string directly (it is in YYYY-MM-DD format) to prevent timezone shifts
      const month = transaction.date.slice(0, 7);

      if (transaction.type === "income") {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }

      // Track by category
      if (transaction.type === "expense") {
        if (!categorySpending[transaction.category]) {
          categorySpending[transaction.category] = 0;
        }
        categorySpending[transaction.category] += amount;
      }

      // Track by month
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (transaction.type === "income") {
        monthlyData[month].income += amount;
      } else {
        monthlyData[month].expense += amount;
      }
    });

    // Calculate balance and savings
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(2) : 0;

    // Get top 5 spending categories
    const topCategories = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount: amount.toFixed(2),
        percentage: ((amount / totalExpense) * 100).toFixed(2),
      }));

    // Get monthly trends (last 6 months)
    const sortedMonths = Object.keys(monthlyData).sort().reverse().slice(0, 6).reverse();
    const monthlyTrends = sortedMonths.map((month) => ({
      month,
      income: monthlyData[month].income.toFixed(2),
      expense: monthlyData[month].expense.toFixed(2),
      balance: (monthlyData[month].income - monthlyData[month].expense).toFixed(2),
    }));

    // Get budget information
    const budget = await Budget.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    // Calculate budget status
    let budgetStatus = null;
    if (budget) {
      // Calculate current month in local timezone to avoid date/month boundary shifts
      const now = new Date();
      const year = now.getFullYear();
      const currentMonthStr = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const currentMonthExpense = monthlyData[currentMonthStr]?.expense || 0;
      budgetStatus = {
        monthlyLimit: budget.monthlyLimit,
        currentSpending: currentMonthExpense.toFixed(2),
        remaining: (budget.monthlyLimit - currentMonthExpense).toFixed(2),
        percentageUsed: ((currentMonthExpense / budget.monthlyLimit) * 100).toFixed(2),
        isOverBudget: currentMonthExpense > budget.monthlyLimit,
      };
    }

    return {
      message: "Report generated successfully",
      report: {
        summary: {
          totalIncome: totalIncome.toFixed(2),
          totalExpense: totalExpense.toFixed(2),
          balance: balance.toFixed(2),
          savingsRate: `${savingsRate}%`,
          transactionCount: transactions.length,
        },
        topCategories,
        monthlyTrends,
        budgetStatus,
      },
    };
  } catch (error) {
    console.error("Error generating report:", error.message);
    throw new Error("Could not generate spending report");
  }
};

module.exports = { getSpendingReport };
