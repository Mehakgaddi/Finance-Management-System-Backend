// Transactions Page - Clean & Organized
// Focused on transaction management only

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import TransactionFilter from '../components/TransactionFilter';
import './TransactionsPage.css';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.log('Error fetching transactions:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAdded = () => {
    fetchTransactions();
    setFilteredTransactions(null); // clear filter so new transaction is visible
    setShowForm(false);
  };

  const handleFilterChange = (filteredData) => {
    setFilteredTransactions(filteredData);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update both the main list and the filtered list immediately
      setTransactions(prev => prev.filter(t => t.id !== id));
      setFilteredTransactions(prev => prev !== null ? prev.filter(t => t.id !== id) : null);
    } catch (error) {
      console.log('Error deleting transaction:', error.message);
    }
  };

  const displayTransactions = filteredTransactions !== null ? filteredTransactions : transactions;
  const totalIncome = displayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = displayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="transactions-page">


      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1>Transactions</h1>
          <p>Manage your income and expenses</p>
        </div>

        <div className="page-content">
          {/* Left Sidebar - Summary & Quick Stats */}
          <div className="transactions-left-panel">
            <div className="stats-card">
              <div className="stat-item">
                <span className="stat-label">Income</span>
                <span className="stat-value income">₹ {totalIncome.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Expense</span>
                <span className="stat-value expense">₹ {totalExpense.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Balance</span>
                <span className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
                  ₹ {balance.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Filter Section */}
            <div className="filter-card">
              <h3>Filter</h3>
              <TransactionFilter
                onFilterChange={handleFilterChange}
                transactions={transactions}
              />
            </div>
          </div>

          {/* Main Content - Transactions */}
          <div className="main-content">
            {/* Add Transaction Button */}
            <div className="action-bar">
              <button
                className={`btn-add ${showForm ? 'active' : ''}`}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? '✕ Cancel' : '+ Add Transaction'}
              </button>
            </div>

            {/* Add Transaction Form */}
            {showForm && (
              <div className="form-container">
                <TransactionForm onTransactionAdded={handleTransactionAdded} />
              </div>
            )}

            {/* Transactions List */}
            <div className="transactions-container">
              {loading ? (
                <div className="empty-state">Loading transactions...</div>
              ) : displayTransactions.length === 0 ? (
                <div className="empty-state">No transactions found</div>
              ) : (
                <TransactionList
                  transactions={displayTransactions}
                  onDelete={handleDelete}
                  heading=""
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;
