// Analytics Page - Clean & Focused
// Only analytics and charts, no duplicate content

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Charts from '../components/Charts';
import SpendingReport from '../components/SpendingReport';
import './AnalyticsPage.css';

function AnalyticsPage() {
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

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="analytics-page">


      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1>Analytics & Reports</h1>
          <p>View your financial insights and trends</p>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-box">
            <span className="stat-label">Total Income</span>
            <span className="stat-value income">₹ {totalIncome.toFixed(2)}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-value expense">₹ {totalExpense.toFixed(2)}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Net Balance</span>
            <span className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
              ₹ {balance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="card">
            <h2>Spending Trends</h2>
            {loading ? (
              <p>Loading charts...</p>
            ) : (
              <Charts transactions={transactions} />
            )}
          </div>
        </div>

        {/* Reports Section */}
        <div className="reports-section">
          <div className="card">
            <h2>Financial Report</h2>
            {loading ? (
              <p>Loading report...</p>
            ) : (
              <SpendingReport transactions={transactions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
