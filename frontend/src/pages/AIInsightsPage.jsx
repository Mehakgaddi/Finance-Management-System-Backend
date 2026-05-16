// AI Insights Page - Clean & Focused
// Only AI-powered insights, no duplicate content

import React, { useState, useEffect } from 'react';
import API from '../services/api';

import AIInsights from '../components/AIInsights';
import './AIInsightsPage.css';

function AIInsightsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await API.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.log('Error fetching transactions:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-insights-page">


      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1>AI Financial Insights</h1>
          <p>Get personalized financial recommendations powered by AI</p>
        </div>

        {/* AI Insights */}
        <div className="insights-section">
          {loading ? (
            <div className="card">
              <p>Loading insights...</p>
            </div>
          ) : (
            <AIInsights transactions={transactions} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AIInsightsPage;
