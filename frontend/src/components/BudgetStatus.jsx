// Budget Status Component
// File: frontend/src/components/BudgetStatus.jsx
// Shows current budget status and spending progress
// Displays warning if overspending

import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './BudgetStatus.css';

function BudgetStatus() {
  const [budget, setBudget] = useState(null);
  const [spending, setSpending] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch budget and transactions when component loads
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch budget and transactions in parallel for speed
      const [budgetResponse, transResponse] = await Promise.all([
        API.get('/budget/get'),
        API.get('/transactions'),
      ]);

      setBudget(budgetResponse.data);
      setTransactions(transResponse.data);

      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      let totalSpending = 0;
      transResponse.data.forEach(t => {
        if (t.type === 'expense') {
          const transDate = new Date(t.date + 'T00:00:00');
          const transMonth = `${transDate.getFullYear()}-${String(transDate.getMonth() + 1).padStart(2, '0')}`;
          if (transMonth === currentMonth) {
            totalSpending += parseFloat(t.amount);
          }
        }
      });

      setSpending(totalSpending);
    } catch (error) {
      // 404 means no budget set — handled by the !budget check below
      if (error.response?.status !== 404) {
        console.log('Error fetching budget data:', error.response?.data?.message || error.message);
      }
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
