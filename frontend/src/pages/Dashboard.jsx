// Dashboard page - the main page after login
// Shows: page heading, 3 summary cards, add transaction button/form, recent transactions list

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ReportButtons from '../components/ReportButtons';
import Navbar from '../components/Navbar';
import './Dashboard.css';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false); // toggle form visibility

  const token = localStorage.getItem('token');

  // Fetch all transactions when the page loads
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://${import.meta.env.VITE_API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.log('Error fetching transactions:', error.message);
    }
  };

  // Called after a new transaction is added — refresh the list
  const handleTransactionAdded = () => {
    fetchTransactions();
    setShowForm(false); // hide form after adding
  };

  // Delete a transaction by id
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://${import.meta.env.VITE_API_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.log('Error deleting transaction:', error.message);
    }
  };

  // Calculate totals from the transactions array
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Show only the 5 most recent transactions on dashboard
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">

        {/* Page Heading */}
        <div className="dashboard-heading">
          <h2>Finance Dashboard</h2>
          <p>Track your income and expenses easily</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card income-card">
            <h3>Total Income</h3>
            <p>₹ {totalIncome.toFixed(2)}</p>
          </div>
          <div className="card expense-card">
            <h3>Total Expense</h3>
            <p>₹ {totalExpense.toFixed(2)}</p>
          </div>
          <div className="card balance-card">
            <h3>Current Balance</h3>
            <p>₹ {balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Add Transaction Button */}
        <div className="add-btn-row">
          <button
            className="add-transaction-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Transaction'}
          </button>
        </div>

        {/* Show form only when button is clicked */}
        {showForm && (
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
        )}

        {/* Report Buttons Section */}
        <div className="report-section">
          <h3>Generate Reports</h3>
          <ReportButtons />
        </div>

        {/* Recent Transactions */}
        <TransactionList
          transactions={recentTransactions}
          onDelete={handleDelete}
          heading="Recent Transactions"
        />

      </div>
    </div>
  );
}

export default Dashboard;
