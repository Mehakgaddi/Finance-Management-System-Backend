// Chatbot Page
// Displays the finance chatbot

import React from 'react';

import Chatbot from '../components/Chatbot';
import './ChatbotPage.css';

function ChatbotPage() {
  return (
    <div className="chatbot-page">


      <div className="chatbot-page-header">
        <div className="header-content">
          <h1>💬 Finance Assistant</h1>
          <p>Get instant answers to your financial questions</p>
        </div>
      </div>

      <div className="chatbot-page-content">
        <div className="chatbot-wrapper">
          <Chatbot />
        </div>

        <div className="chatbot-info">
          <h2>❓ Frequently Asked Topics</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <h3>💰 Saving Money</h3>
              <p>Learn effective strategies to save more money and build wealth</p>
            </div>
            <div className="topic-card">
              <h3>📉 Reducing Expenses</h3>
              <p>Discover ways to cut unnecessary spending and optimize your budget</p>
            </div>
            <div className="topic-card">
              <h3>📊 Budgeting</h3>
              <p>Understand how to create and manage a personal budget</p>
            </div>
            <div className="topic-card">
              <h3>📝 Tracking Spending</h3>
              <p>Learn how to track your expenses and identify spending patterns</p>
            </div>
            <div className="topic-card">
              <h3>⚠️ Overspending</h3>
              <p>Understand overspending and how to avoid it</p>
            </div>
            <div className="topic-card">
              <h3>🆘 Emergency Fund</h3>
              <p>Learn why you need an emergency fund and how to build one</p>
            </div>
            <div className="topic-card">
              <h3>🎯 Financial Goals</h3>
              <p>Set and achieve your financial goals effectively</p>
            </div>
            <div className="topic-card">
              <h3>💳 Debt Management</h3>
              <p>Strategies to manage and reduce your debt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;
