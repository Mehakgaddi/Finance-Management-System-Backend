// TransactionForm component
// A form to add a new income or expense transaction

import React, { useState } from 'react';
import axios from 'axios';
import './TransactionForm.css';

function TransactionForm({ onTransactionAdded }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:5000/api/transactions',
        { title, amount, type, category, date },
        { headers: { Authorization: token } }
      );

      setMessage('Transaction added!');

      // Clear the form
      setTitle('');
      setAmount('');
      setType('income');
      setCategory('');
      setDate('');

      // Tell Dashboard to refresh the list
      onTransactionAdded();

      setTimeout(() => setMessage(''), 2000);

    } catch (error) {
      setMessage('Failed to add transaction');
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
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
      {message && <p className="form-msg">{message}</p>}
    </div>
  );
}

export default TransactionForm;
