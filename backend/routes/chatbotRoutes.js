// This file defines the chatbot routes
// Routes for sending messages to chatbot

const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/chatbotController");

// Send message to chatbot (no auth required - public endpoint)
router.post("/message", sendMessage);

module.exports = router;
