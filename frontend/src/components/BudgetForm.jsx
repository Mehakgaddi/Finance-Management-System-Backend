// Budget Form Component
// File: frontend/src/components/BudgetForm.jsx
// Allows user to set their monthly budget
// Shows current budget status

import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './BudgetForm.css';

// onBudgetUpdated: optional callback so the parent can refresh after budget is saved
function BudgetForm({ onBudgetUpdated }) {
  const [budget, setBudget] = useState('');
  const [currentBudget, setCurrentBudget] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch current budget when component loads
  useEffect(() => {
    fetchBudget();
  }, []);

  // Get current budget from backend
  const fetchBudget = async () => {
    try {
      const response = await API.get('/budget/get');
      setCurrentBudget(response.data);
      setBudget(response.data.monthlyLimit);
    } catch (err) {
      // 404 just means no budget set yet — that's fine
      console.log('No budget set yet');
    }
  };

  // Handle setting budget
  const handleSetBudget = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!budget || budget <= 0) {
      setError('Budget must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/budget/set', { monthlyLimit: parseFloat(budget) });

      setMessage('✅ Budget set successfully!');
      setCurrentBudget(response.data.budget);
      setBudget(response.data.budget.monthlyLimit);

      // Tell the parent page to refresh its data
      if (onBudgetUpdated) onBudgetUpdated();

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budget-form-container">
      <div className="budget-card">
        <h3>💰 Set Your Monthly Budget</h3>

        {/* Current Budget Display */}
        {currentBudget && (
          <div className="current-budget">
            <p>Current Budget: <strong>₹{currentBudget.monthlyLimit.toFixed(2)}</strong></p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Month: {currentBudget.month}
            </p>
          </div>
        )}

        {/* Budget Form */}
        <form onSubmit={handleSetBudget} className="budget-form">
          <div className="form-group">
            <label htmlFor="budget">Monthly Budget Amount (₹)</label>
            <input
              type="number"
              id="budget"
              placeholder="Enter your monthly budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Setting Budget...' : 'Set Budget'}
          </button>
        </form>

        {/* Messages */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        {/* Info Box */}
        <div className="info-box">
          <p>
            <strong>💡 Tip:</strong> Set a realistic monthly budget. 
            You'll receive an email alert if you exceed it!
          </p>
        </div>
      </div>
    </div>
  );
}

export default BudgetForm;
