// AI Insights Page - Clean & Focused
// Only AI-powered insights, no duplicate content

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AIInsights from '../components/AIInsights';
import './AIInsightsPage.css';

function AIInsightsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://${import.meta.env.VITE_API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.log('Error fetching transactions:', error.message);
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
