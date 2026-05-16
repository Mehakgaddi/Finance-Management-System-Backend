// Finance Chatbot Component
// Simple rule-based chatbot for financial help
// No AI needed - just predefined Q&A

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your Finance Assistant. I can help you with questions about budgeting, saving, spending, and financial management. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to chatbot
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Send to backend
      const response = await axios.post(
        `http://${import.meta.env.VITE_API_URL}/api/chatbot/message`,
        { message: inputValue }
      );

      // Add bot response to chat
      const botMessage = {
        id: messages.length + 2,
        text: response.data.botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        text: '❌ Sorry, I could not process your message. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      console.log('Error sending message:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>💬 Finance Assistant</h2>
        <p>Ask me anything about money management!</p>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              {msg.text.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <span className="message-time">
              {msg.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}

        {loading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chatbot-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me about budgeting, saving, spending..."
          className="chatbot-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="chatbot-send-btn"
          disabled={loading || !inputValue.trim()}
        >
          {loading ? '⏳' : '📤'}
        </button>
      </form>

      <div className="chatbot-suggestions">
        <p>💡 Try asking:</p>
        <div className="suggestion-buttons">
          <button
            onClick={() => setInputValue('How to save money')}
            className="suggestion-btn"
          >
            How to save money
          </button>
          <button
            onClick={() => setInputValue('What is a budget')}
            className="suggestion-btn"
          >
            What is a budget
          </button>
          <button
            onClick={() => setInputValue('How to reduce expenses')}
            className="suggestion-btn"
          >
            How to reduce expenses
          </button>
          <button
            onClick={() => setInputValue('Help')}
            className="suggestion-btn"
          >
            Help
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
