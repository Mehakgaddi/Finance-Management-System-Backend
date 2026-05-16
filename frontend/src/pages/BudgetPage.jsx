// Budget Page - Clean & Focused
// Only budget management, no duplicate content

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import BudgetForm from '../components/BudgetForm';
import BudgetStatus from '../components/BudgetStatus';
import './BudgetPage.css';

function BudgetPage() {
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBudgetAndTransactions();
  }, []);

  const fetchBudgetAndTransactions = async () => {
    try {
      setLoading(true);
      
      try {
        const budgetResponse = await axios.get(`http://${import.meta.env.VITE_API_URL}/api/budget/get`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBudget(budgetResponse.data);
      } catch (error) {
        setBudget(null);
      }

      const transResponse = await axios.get(`http://${import.meta.env.VITE_API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(transResponse.data);
    } catch (error) {
      console.log('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonthSpending = () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    return transactions
      .filter(t => {
        const transDate = new Date(t.date);
        const transMonth = `${transDate.getFullYear()}-${String(transDate.getMonth() + 1).padStart(2, '0')}`;
        return t.type === 'expense' && transMonth === currentMonth;
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const currentSpending = getCurrentMonthSpending();
  const budgetLimit = budget ? parseFloat(budget.monthlyLimit) : 0;
  const remaining = budgetLimit - currentSpending;
  const isOverBudget = currentSpending > budgetLimit;

  return (
    <div className="budget-page">


      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1>Budget Management</h1>
          <p>Set and track your monthly budget</p>
        </div>

        <div className="page-content">
          {/* Left - Budget Form */}
          <div className="form-section">
            <div className="card">
              <h2>Set Monthly Budget</h2>
              <BudgetForm onBudgetUpdated={fetchBudgetAndTransactions} />
            </div>
          </div>

          {/* Right - Budget Status */}
          <div className="status-section">
            {loading ? (
              <div className="card">
                <p>Loading budget information...</p>
              </div>
            ) : budget ? (
              <>
                <div className="card">
                  <h2>Current Budget</h2>
                  <BudgetStatus />
                </div>

                <div className="card">
                  <h3>Budget Summary</h3>
                  <div className="summary-item">
                    <span>Monthly Limit</span>
                    <span className="value">₹ {budgetLimit.toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Current Spending</span>
                    <span className={`value ${isOverBudget ? 'over' : ''}`}>
                      ₹ {currentSpending.toFixed(2)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span>Remaining</span>
                    <span className={`value ${remaining < 0 ? 'over' : ''}`}>
                      ₹ {remaining.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="card">
                <p>No budget set yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetPage;
