// TransactionList component
// Shows transactions in a table with a delete button for each
// 'heading' prop lets the parent pass a custom title like "Recent Transactions"

import React from 'react';
import './TransactionList.css';

function TransactionList({ transactions, onDelete, heading }) {

  if (transactions.length === 0) {
    return (
      <div className="list-container">
        <h3>{heading || 'Transactions'}</h3>
        <p className="no-data">No transactions yet. Add one above.</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <h3>{heading || 'Transactions'}</h3>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.category}</td>
              <td>{t.date}</td>
              <td>
                <span className={t.type === 'income' ? 'badge income' : 'badge expense'}>
                  {t.type}
                </span>
              </td>
              <td>₹ {parseFloat(t.amount).toFixed(2)}</td>
              <td>
                <button className="delete-btn" onClick={() => onDelete(t.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
