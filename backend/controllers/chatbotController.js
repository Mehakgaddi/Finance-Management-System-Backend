// This file handles all chatbot API requests
// Receives user message and returns chatbot response

const { getChatbotResponse } = require("../services/chatbotService");

// POST send message to chatbot
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    // Get chatbot response (now async because it uses Gemini API)
    const response = await getChatbotResponse(message);

    res.status(200).json({
      userMessage: message,
      botResponse: response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not process chatbot message",
      error: error.message,
    });
  }
};

module.exports = { sendMessage };
