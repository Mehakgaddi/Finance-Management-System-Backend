// Spending Report Component
// Displays comprehensive spending analytics and reports

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SpendingReport.css';

function SpendingReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch report when component loads
  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://${import.meta.env.VITE_API_URL}/api/analytics/spending`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setReport(response.data.report);
    } catch (err) {
      setError('Could not fetch spending report. Please try again.');
      console.log('Error fetching report:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spending-report">
        <div className="report-loading">
          <p>📊 Generating your spending report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spending-report">
        <div className="report-error">
          <p>❌ {error}</p>
          <button onClick={fetchReport} className="retry-btn">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="spending-report">
        <div className="report-empty">
          <p>📈 Add some transactions to see your spending report!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="spending-report">
      <div className="report-header">
        <h2>📊 Spending Report & Analytics</h2>
        <button onClick={fetchReport} className="refresh-btn" disabled={loading}>
          {loading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Summary Section */}
      <div className="report-section">
        <h3>📈 Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="label">Total Income</span>
            <span className="value income">₹ {report.summary.totalIncome}</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Expense</span>
            <span className="value expense">₹ {report.summary.totalExpense}</span>
          </div>
          <div className="summary-item">
            <span className="label">Balance</span>
            <span className="value balance">₹ {report.summary.balance}</span>
          </div>
          <div className="summary-item">
            <span className="label">Savings Rate</span>
            <span className="value savings">{report.summary.savingsRate}</span>
          </div>
        </div>
      </div>

      {/* Top Categories Section */}
      {report.topCategories && report.topCategories.length > 0 && (
        <div className="report-section">
          <h3>💸 Top Spending Categories</h3>
          <div className="categories-list">
            {report.topCategories.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category.category}</span>
                  <span className="category-percentage">{category.percentage}%</span>
                </div>
                <div className="category-bar">
                  <div
                    className="category-bar-fill"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <span className="category-amount">₹ {category.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Trends Section */}
      {report.monthlyTrends && report.monthlyTrends.length > 0 && (
        <div className="report-section">
          <h3>📅 Monthly Trends (Last 6 Months)</h3>
          <div className="trends-table">
            <div className="trends-header">
              <div className="trend-col">Month</div>
              <div className="trend-col">Income</div>
              <div className="trend-col">Expense</div>
              <div className="trend-col">Balance</div>
            </div>
            {report.monthlyTrends.map((trend, index) => (
              <div key={index} className="trends-row">
                <div className="trend-col">{trend.month}</div>
                <div className="trend-col income">₹ {trend.income}</div>
                <div className="trend-col expense">₹ {trend.expense}</div>
                <div className="trend-col balance">₹ {trend.balance}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Status Section */}
      {report.budgetStatus && (
        <div className="report-section">
          <h3>💰 Budget Status (Current Month)</h3>
          <div className="budget-status">
            <div className="budget-info">
              <div className="budget-item">
                <span className="label">Monthly Budget</span>
                <span className="value">₹ {report.budgetStatus.monthlyLimit}</span>
              </div>
              <div className="budget-item">
                <span className="label">Current Spending</span>
                <span className="value">₹ {report.budgetStatus.currentSpending}</span>
              </div>
              <div className="budget-item">
                <span className="label">Remaining</span>
                <span className={`value ${report.budgetStatus.isOverBudget ? 'over' : 'under'}`}>
                  ₹ {report.budgetStatus.remaining}
                </span>
              </div>
            </div>
            <div className="budget-bar">
              <div
                className={`budget-bar-fill ${report.budgetStatus.isOverBudget ? 'over-budget' : ''}`}
                style={{ width: `${Math.min(report.budgetStatus.percentageUsed, 100)}%` }}
              ></div>
            </div>
            <p className="budget-percentage">
              {report.budgetStatus.percentageUsed}% of budget used
              {report.budgetStatus.isOverBudget && ' ⚠️ Over Budget!'}
            </p>
          </div>
        </div>
      )}

      {/* Transaction Count */}
      <div className="report-footer">
        <p>📝 Total Transactions: {report.summary.transactionCount}</p>
      </div>
    </div>
  );
}

export default SpendingReport;
