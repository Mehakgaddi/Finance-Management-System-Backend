// AI Financial Insights Component
// Displays AI-generated financial insights and spending summary

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AIInsights.css';

function AIInsights() {
  const [insights, setInsights] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch AI insights when component loads
  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        'http://localhost:5000/api/ai/insights',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setInsights(response.data.insights);
      setSummary(response.data.summary);
    } catch (err) {
      setError('Could not fetch AI insights. Please try again.');
      console.log('Error fetching insights:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-insights">
      <div className="insights-header">
        <h2>🤖 AI Financial Insights</h2>
        <button
          onClick={fetchInsights}
          className="refresh-btn"
          disabled={loading}
        >
          {loading ? '⏳ Analyzing...' : '🔄 Refresh Insights'}
        </button>
      </div>

      {loading && (
        <div className="insights-loading">
          <p>🤔 Analyzing your spending patterns...</p>
        </div>
      )}

      {error && (
        <div className="insights-error">
          <p>❌ {error}</p>
        </div>
      )}

      {insights && !loading && (
        <div className="insights-content">
          {/* Spending Summary */}
          {summary && (
            <div className="summary-box">
              <h3>📊 Your Spending Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Total Income</span>
                  <span className="value income">₹ {summary.totalIncome}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Expenses</span>
                  <span className="value expense">₹ {summary.totalExpense}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Current Balance</span>
                  <span className="value balance">₹ {summary.balance}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Savings Rate</span>
                  <span className="value savings">{summary.savingsRate}</span>
                </div>
              </div>

              {/* Top Spending Categories */}
              {summary.topCategories && summary.topCategories.length > 0 && (
                <div className="top-categories">
                  <h4>💸 Top Spending Categories</h4>
                  <ul>
                    {summary.topCategories.map((category, index) => (
                      <li key={index}>
                        <span className="category-name">{category.category}</span>
                        <span className="category-amount">
                          ₹ {category.amount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* AI Insights */}
          <div className="insights-box">
            <h3>💡 AI Recommendations</h3>
            <div className="insights-text">
              {insights
                .split('\n')
                .filter(line => line.trim() !== '')
                .map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
            </div>
          </div>

          {/* Refresh Note */}
          <div className="insights-note">
            <p>💬 Click "Refresh Insights" to get updated recommendations based on your latest transactions.</p>
          </div>
        </div>
      )}

      {!loading && !insights && !error && (
        <div className="insights-empty">
          <p>📈 Add some transactions to get AI-powered financial insights!</p>
        </div>
      )}
    </div>
  );
}

export default AIInsights;
