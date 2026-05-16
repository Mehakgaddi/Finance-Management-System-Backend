// This file defines the chatbot routes
// Routes for sending messages to chatbot

const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/chatbotController");
const protect = require("../middleware/authMiddleware");

// Protect the chatbot endpoint so only logged-in users can use it
// This prevents anonymous API abuse and Gemini quota drain
router.post("/message", protect, sendMessage);

module.exports = router;
