// This file handles all reports API requests
// Gets spending reports and analytics

const { getSpendingReport } = require("../services/reportsService");

// GET spending report
const getReport = async (req, res) => {
  try {
    const userId = req.userId; // comes from auth middleware

    // Get report from service
    const result = await getSpendingReport(userId);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Could not generate spending report",
      error: error.message,
    });
  }
};

module.exports = { getReport };
