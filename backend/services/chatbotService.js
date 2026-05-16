// This file handles all chatbot logic using Gemini API

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fallback rule-based responses if API fails
const fallbackKnowledge = {
  "hello": "👋 Hello! I'm your Finance Assistant. I'm currently running in offline mode. Ask me about saving, budgeting, or tracking expenses!",
  "hi": "👋 Hi there! I'm your Finance Assistant. Ask me anything about money management!",
  "budget": "📊 A budget is a plan for your money. It helps you control spending and save for goals.",
  "save": "💰 To save money: set a budget, track expenses, cut unnecessary spending, and use the 50/30/20 rule.",
};

const getFallbackResponse = (message) => {
  const lowerMsg = message.toLowerCase();
  for (const [key, value] of Object.entries(fallbackKnowledge)) {
    if (lowerMsg.includes(key)) return value;
  }
  return "🤔 I'm currently offline and can only answer basic questions about saving, budgets, and expenses. Please check your Gemini API key in the backend .env file.";
};

// Get chatbot response
const getChatbotResponse = async (userMessage) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, using fallback chatbot.");
      return getFallbackResponse(userMessage);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const prompt = `You are a helpful, friendly, and expert financial advisor chatbot for a Finance Management System. 
Answer the user's question about personal finance, budgeting, saving money, or managing expenses.
Keep the answer concise (under 100 words if possible), practical, and easy to understand. Use emojis.
User question: "${userMessage}"`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error from Gemini API in chatbot:", error.message);
    return getFallbackResponse(userMessage);
  }
};

module.exports = { getChatbotResponse };
