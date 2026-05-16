// Improved Dashboard Page
// Shows all features in a professional, organized layout
// Includes: Summary cards, Charts, Transactions, Reports

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Charts from '../components/Charts';
import ReportButtons from '../components/ReportButtons';
import BudgetForm from '../components/BudgetForm';
import BudgetStatus from '../components/BudgetStatus';
import TransactionFilter from '../components/TransactionFilter';
import AIInsights from '../components/AIInsights';
import SpendingReport from '../components/SpendingReport';
import './Dashboard_IMPROVED.css';

function Dashboard_IMPROVED() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // Fetch transactions when page loads
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

  // Called after adding a transaction
  const handleTransactionAdded = () => {
    fetchTransactions();
    setFilteredTransactions(null); // clear filter so new transaction is visible
    setShowForm(false);
  };

  // Handle filter changes from TransactionFilter component
  const handleFilterChange = (filteredData) => {
    if (filteredData === null) {
      setFilteredTransactions(null);
    } else {
      setFilteredTransactions(filteredData);
    }
  };

  // Delete a transaction
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://${import.meta.env.VITE_API_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update both the main list and the filtered list immediately
      setTransactions(prev => prev.filter(t => t.id !== id));
      setFilteredTransactions(prev => prev !== null ? prev.filter(t => t.id !== id) : null);
    } catch (error) {
      console.log('Error deleting transaction:', error.message);
    }
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Get recent transactions (last 10)
  // Use filtered transactions if available, otherwise use all transactions
  const displayTransactions = filteredTransactions !== null ? filteredTransactions : transactions;
  const recentTransactions = displayTransactions.slice(0, 10);

  return (
    <div className="dashboard-improved">


      {/* Header Section */}
      <div className="dashboard-header-improved">
        <div className="header-content">
          <h1>💰 Finance Dashboard</h1>
          <p>Track your income and expenses with ease</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Summary Cards Section */}
        <section className="summary-section">
          <div className="summary-cards-improved">
            <div className="summary-card-improved income-card-improved">
              <div className="card-icon">📈</div>
              <div className="card-content">
                <h3>Total Income</h3>
                <p className="card-amount">₹ {totalIncome.toFixed(2)}</p>
              </div>
            </div>

            <div className="summary-card-improved expense-card-improved">
              <div className="card-icon">📉</div>
              <div className="card-content">
                <h3>Total Expense</h3>
                <p className="card-amount">₹ {totalExpense.toFixed(2)}</p>
              </div>
            </div>

            <div className="summary-card-improved balance-card-improved">
              <div className="card-icon">💳</div>
              <div className="card-content">
                <h3>Current Balance</h3>
                <p className="card-amount">₹ {balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="charts-section">
          <h2>📊 Visual Analytics</h2>
          <Charts transactions={transactions} />
        </section>

        {/* Budget Section */}
        <section className="budget-section">
          <h2>💰 Budget Management</h2>
          <BudgetStatus />
          <BudgetForm />
        </section>

        {/* Add Transaction Section */}
        <section className="add-transaction-section">
          <div className="section-header">
            <h2>➕ Add New Transaction</h2>
            <button
              className="toggle-form-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancel' : '+ Add Transaction'}
            </button>
          </div>
          {showForm && (
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          )}
        </section>

        {/* Reports Section */}
        <section className="reports-section">
          <h2>📄 Generate Reports</h2>
          <div className="reports-content">
            <p className="reports-description">
              Download your financial report as PDF or send it to your email
            </p>
            <ReportButtons />
          </div>
        </section>

        {/* Transaction Filter Section */}
        <section className="filter-section">
          <TransactionFilter
            onFilterChange={handleFilterChange}
            transactions={transactions}
          />
        </section>

        {/* AI Insights Section */}
        <section className="ai-insights-section">
          <AIInsights />
        </section>

        {/* Spending Report Section */}
        <section className="spending-report-section">
          <SpendingReport />
        </section>

        {/* Transactions List Section */}
        <section className="transactions-section">
          <h2>📋 {filteredTransactions !== null ? 'Filtered Transactions' : 'Recent Transactions'}</h2>
          {loading ? (
            <div className="loading-message">Loading transactions...</div>
          ) : (
            <TransactionList
              transactions={recentTransactions}
              onDelete={handleDelete}
              heading=""
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard_IMPROVED;
