// Budget Status Component
// File: frontend/src/components/BudgetStatus.jsx
// Shows current budget status and spending progress
// Displays warning if overspending

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BudgetStatus.css';

function BudgetStatus() {
  const [budget, setBudget] = useState(null);
  const [spending, setSpending] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // Fetch budget and transactions when component loads
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get budget
      const budgetResponse = await axios.get('http://localhost:5000/api/budget/get', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudget(budgetResponse.data);

      // Get transactions
      const transResponse = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(transResponse.data);

      // Calculate current month spending
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      let totalSpending = 0;
      transResponse.data.forEach(t => {
        if (t.type === 'expense') {
          const transDate = new Date(t.date);
          const transMonth = `${transDate.getFullYear()}-${String(transDate.getMonth() + 1).padStart(2, '0')}`;
          if (transMonth === currentMonth) {
            totalSpending += parseFloat(t.amount);
          }
        }
      });

      setSpending(totalSpending);

    } catch (error) {
      console.log('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="budget-status-loading">Loading budget status...</div>;
  }

  if (!budget) {
    return (
      <div className="budget-status-empty">
        <p>📊 No budget set yet. Set a budget to track your spending!</p>
      </div>
    );
  }

  // Calculate percentages
  const percentageUsed = (spending / budget.monthlyLimit) * 100;
  const remaining = budget.monthlyLimit - spending;
  const isOverspending = spending > budget.monthlyLimit;

  return (
    <div className="budget-status-container">
      <div className={`budget-status-card ${isOverspending ? 'overspending' : 'normal'}`}>
        <h3>📊 Budget Status</h3>

        {/* Budget Info */}
        <div className="budget-info">
          <div className="info-item">
            <span className="label">Monthly Budget:</span>
            <span className="value">₹{budget.monthlyLimit.toFixed(2)}</span>
          </div>
          <div className="info-item">
            <span className="label">Current Spending:</span>
            <span className={`value ${isOverspending ? 'overspend' : ''}`}>
              ₹{spending.toFixed(2)}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Remaining:</span>
            <span className={`value ${isOverspending ? 'overspend' : 'remaining'}`}>
              {isOverspending ? '❌' : '✅'} ₹{Math.abs(remaining).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-label">
            <span>Spending Progress</span>
            <span className="percentage">{Math.min(percentageUsed, 100).toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${isOverspending ? 'overspend' : ''}`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Warning Message */}
        {isOverspending && (
          <div className="warning-box">
            <p>
              ⚠️ <strong>You are overspending!</strong>
            </p>
            <p>
              You've exceeded your budget by ₹{(spending - budget.monthlyLimit).toFixed(2)}.
              An email alert has been sent to you.
            </p>
          </div>
        )}

        {/* Safe Zone Message */}
        {!isOverspending && remaining > 0 && (
          <div className="safe-box">
            <p>
              ✅ <strong>You're within budget!</strong>
            </p>
            <p>
              You have ₹{remaining.toFixed(2)} left to spend this month.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetStatus;
