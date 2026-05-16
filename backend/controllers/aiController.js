// This file handles all AI-related API requests
// Gets financial insights from Gemini API

const { getFinancialInsights } = require("../services/aiService");

// GET AI Financial Insights
const getInsights = async (req, res) => {
  try {
    const userId = req.userId; // comes from auth middleware

    // Get insights from AI service
    const result = await getFinancialInsights(userId);

    res.status(200).json({
      message: "AI insights generated successfully",
      insights: result.insights,
      summary: result.summary,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not generate AI insights",
      error: error.message,
    });
  }
};

module.exports = { getInsights };
