// TransactionForm component
// A form to add a new income or expense transaction

import React, { useState } from 'react';
import API from '../services/api';
import './TransactionForm.css';

function TransactionForm({ onTransactionAdded }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      await API.post('/transactions', { title, amount, type, category, date });

      setMessage('Transaction added!');
      setTitle('');
      setAmount('');
      setType('income');
      setCategory('');
      setDate('');
      onTransactionAdded();
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      // Show the actual error from the server, not a generic message
      setMessage(error.response?.data?.message || 'Failed to add transaction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit} className="transaction-form">
        <input
          type="text"
          placeholder="Title (e.g. Salary, Rent)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Category (e.g. Food, Salary)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <div className="date-input-wrapper">
          <input
            id="transaction-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button
            type="button"
            className="calendar-btn"
            onClick={() => document.getElementById('transaction-date').showPicker()}
            title="Pick a date"
          >
            📅
          </button>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </form>
      {message && <p className="form-msg">{message}</p>}
    </div>
  );
}

export default TransactionForm;
