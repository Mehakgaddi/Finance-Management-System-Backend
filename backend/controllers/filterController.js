// This file handles all transaction filtering logic
// Filter by date range (daily, weekly, monthly, yearly)
// Filter by transaction type (income/expense)
// Filter by category

const Transaction = require("../models/Transaction");
const { Op } = require("sequelize");

// Helper function to format Date object into YYYY-MM-DD in local time
// This prevents timezone-shifting bugs where toISOString() shifts dates to UTC (the previous day)
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to get date range based on filter type
const getDateRange = (filterType) => {
  const today = new Date();
  let startDate, endDate;

  if (filterType === "daily") {
    // Today only
    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  } else if (filterType === "weekly") {
    // Last 7 days
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);
    endDate = new Date(today);
    endDate.setDate(today.getDate() + 1);
  } else if (filterType === "monthly") {
    // Current month
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  } else if (filterType === "yearly") {
    // Current year
    startDate = new Date(today.getFullYear(), 0, 1);
    endDate = new Date(today.getFullYear() + 1, 0, 1);
  }

  return { startDate, endDate };
};

// GET filtered transactions
// Query parameters:
// - dateFilter: "daily", "weekly", "monthly", "yearly"
// - typeFilter: "income", "expense", or empty for all
// - categoryFilter: category name, or empty for all
const getFilteredTransactions = async (req, res) => {
  try {
    const { dateFilter, typeFilter, categoryFilter } = req.query;
    const userId = req.userId;

    // Build the where clause for filtering
    let whereClause = { userId };

    // Add date filter if provided
    if (dateFilter) {
      const { startDate, endDate } = getDateRange(dateFilter);
      whereClause.date = {
        [Op.gte]: formatLocalDate(startDate),
        [Op.lt]: formatLocalDate(endDate),
      };
    }

    // Add type filter if provided
    if (typeFilter && (typeFilter === "income" || typeFilter === "expense")) {
      whereClause.type = typeFilter;
    }

    // Add category filter if provided
    if (categoryFilter && categoryFilter.trim() !== "") {
      whereClause.category = categoryFilter;
    }

    // Fetch filtered transactions
    const transactions = await Transaction.findAll({
      where: whereClause,
      order: [["date", "DESC"]], // show latest first
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch filtered transactions",
      error: error.message,
    });
  }
};

// GET all unique categories for the user
// This is used to populate the category dropdown
const getCategories = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all unique categories for this user
    const categories = await Transaction.findAll({
      attributes: ["category"],
      where: { userId },
      raw: true,
      group: ["category"],
    });

    // Extract just the category names
    const categoryList = categories.map((c) => c.category);

    res.status(200).json(categoryList);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch categories",
      error: error.message,
    });
  }
};

module.exports = { getFilteredTransactions, getCategories };
