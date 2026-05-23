// This file handles all AI-related logic using Gemini API
// Analyzes spending patterns and generates financial insights

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get AI Financial Insights
const getFinancialInsights = async (userId) => {
  try {
    // Fetch all transactions for the user
    const transactions = await Transaction.findAll({
      where: { userId },
    });

    if (transactions.length === 0) {
      return {
        insights: "No transactions found. Start adding transactions to get insights!",
        summary: null,
      };
    }

    // Calculate spending summary
    const summary = calculateSpendingSummary(transactions);

    // Get budget information
    const budget = await Budget.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    // Build prompt for Gemini
    const prompt = buildAIPrompt(summary, budget);

    // Try to call Gemini API
    try {
      // gemini-2.5-flash is the current working model for this API key
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });
      const response = await result.response;
      const insights = response.text();

      return {
        insights,
        summary,
      };
    } catch (apiError) {
      // If Gemini API fails, use fallback insights
      console.warn("Gemini API unavailable, using fallback insights:", apiError.message);
      const fallbackInsights = generateFallbackInsights(summary, budget);
      
      return {
        insights: fallbackInsights,
        summary,
      };
    }
  } catch (error) {
    console.error("Error getting AI insights:", error.message);
    throw new Error("Could not generate AI insights");
  }
};

// Calculate spending summary from transactions
const calculateSpendingSummary = (transactions) => {
  let totalIncome = 0;
  let totalExpense = 0;
  const categorySpending = {};
  const monthlySpending = {};

  transactions.forEach((transaction) => {
    const amount = parseFloat(transaction.amount);

    if (transaction.type === "income") {
      totalIncome += amount;
    } else {
      totalExpense += amount;
    }

    // Track spending by category
    if (transaction.type === "expense") {
      if (!categorySpending[transaction.category]) {
        categorySpending[transaction.category] = 0;
      }
      categorySpending[transaction.category] += amount;
    }

    // Track spending by month (transaction.date is in YYYY-MM-DD format)
    const month = transaction.date.slice(0, 7);
    if (!monthlySpending[month]) {
      monthlySpending[month] = 0;
    }
    if (transaction.type === "expense") {
      monthlySpending[month] += amount;
    }
  });

  // Find top spending categories
  const topCategories = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, amount]) => ({ category, amount }));

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(2) : 0;

  return {
    totalIncome: totalIncome.toFixed(2),
    totalExpense: totalExpense.toFixed(2),
    balance: balance.toFixed(2),
    savingsRate: `${savingsRate}%`,
    topCategories,
    transactionCount: transactions.length,
  };
};

// Build prompt for Gemini API
const buildAIPrompt = (summary, budget) => {
  let prompt = `You are a financial advisor. Give exactly 3 short bullet-point insights (one sentence each) based on this data:

Income: ₹${summary.totalIncome} | Expenses: ₹${summary.totalExpense} | Balance: ₹${summary.balance} | Savings: ${summary.savingsRate}
Top categories: ${summary.topCategories.map((c) => `${c.category} ₹${c.amount.toFixed(0)}`).join(", ")}`;

  if (budget) {
    prompt += ` | Budget: ₹${budget.monthlyLimit}`;
  }

  prompt += `

Rules: 3 bullet points only, each under 15 words, no headers, no markdown bold, plain text.`;

  return prompt;
};

// Generate fallback insights when Gemini API is unavailable
const generateFallbackInsights = (summary, budget) => {
  let insights = "📊 **Financial Insights (Offline Mode)**\n\n";

  // Positive observation
  if (parseFloat(summary.balance) > 0) {
    insights += `✅ **Good News!** You have a positive balance of ₹${summary.balance}. Keep up the good financial habits!\n\n`;
  } else {
    insights += `⚠️ **Attention:** Your balance is negative (₹${summary.balance}). Consider reducing expenses.\n\n`;
  }

  // Savings rate observation
  const savingsRate = parseFloat(summary.savingsRate);
  if (savingsRate > 20) {
    insights += `💰 **Excellent Savings Rate:** You're saving ${summary.savingsRate} of your income. This is great!\n\n`;
  } else if (savingsRate > 10) {
    insights += `📈 **Good Savings Rate:** You're saving ${summary.savingsRate} of your income. Try to increase this.\n\n`;
  } else {
    insights += `📉 **Low Savings Rate:** You're only saving ${summary.savingsRate} of your income. Consider cutting expenses.\n\n`;
  }

  // Top spending category
  if (summary.topCategories.length > 0) {
    const topCategory = summary.topCategories[0];
    insights += `🏆 **Top Spending Category:** ${topCategory.category} (₹${topCategory.amount.toFixed(2)})\n`;
    insights += `Consider reviewing this category to find savings opportunities.\n\n`;
  }

  // Budget recommendation
  if (budget) {
    const monthlyExpense = parseFloat(summary.totalExpense);
    const budgetLimit = parseFloat(budget.monthlyLimit);
    const percentageUsed = ((monthlyExpense / budgetLimit) * 100).toFixed(2);
    
    if (percentageUsed > 100) {
      insights += `🚨 **Budget Alert:** You've exceeded your budget by ${(percentageUsed - 100).toFixed(2)}%!\n`;
      insights += `Current spending: ₹${monthlyExpense.toFixed(2)} / Budget: ₹${budgetLimit.toFixed(2)}\n`;
      insights += `Reduce spending immediately to stay within budget.\n\n`;
    } else if (percentageUsed > 80) {
      insights += `⚠️ **Budget Warning:** You've used ${percentageUsed}% of your budget.\n`;
      insights += `Be careful with remaining expenses this month.\n\n`;
    } else {
      insights += `✅ **Budget Status:** You're using ${percentageUsed}% of your budget.\n`;
      insights += `You have ₹${(budgetLimit - monthlyExpense).toFixed(2)} remaining.\n\n`;
    }
  }

  // General recommendations
  insights += `💡 **Recommendations:**\n`;
  insights += `1. Track all your expenses regularly\n`;
  insights += `2. Set realistic monthly budgets\n`;
  insights += `3. Review spending by category monthly\n`;
  insights += `4. Build an emergency fund (3-6 months expenses)\n`;
  insights += `5. Reduce unnecessary subscriptions\n\n`;

  insights += `*Note: These insights are generated offline. For AI-powered recommendations, please ensure your Gemini API key is valid.*`;

  return insights;
};

module.exports = { getFinancialInsights };
