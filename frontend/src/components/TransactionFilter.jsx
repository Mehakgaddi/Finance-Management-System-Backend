// Transaction Filter Component
// Filters transactions client-side by date range, type, and category

import React, { useState, useEffect, useMemo } from 'react';
import './TransactionFilter.css';

function TransactionFilter({ onFilterChange, transactions = [] }) {
  const [dateFilter,     setDateFilter]     = useState('');
  const [typeFilter,     setTypeFilter]     = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Derive unique categories from the transactions prop
  const categories = useMemo(() => {
    const set = new Set(transactions.map(t => t.category).filter(Boolean));
    return [...set].sort();
  }, [transactions]);

  // Re-run filter whenever any filter value or the source list changes
  useEffect(() => {
    applyFilters();
  // eslint-disable-next-line
  }, [dateFilter, typeFilter, categoryFilter, transactions]);

  // Returns { start: Date, end: Date } for the chosen date filter
  const getDateBounds = (filter) => {
    const now   = new Date();
    // Midnight today (local time)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
      case 'daily': {
        // Today only
        const end = new Date(today); end.setDate(today.getDate() + 1);
        return { start: today, end };
      }
      case 'weekly': {
        // Last 7 days including today  (today - 7 days  →  today)
        const start = new Date(today); start.setDate(today.getDate() - 7);
        const end   = new Date(today); end.setDate(today.getDate() + 1);
        return { start, end };
      }
      case 'last30': {
        // Last 30 days including today
        const start = new Date(today); start.setDate(today.getDate() - 30);
        const end   = new Date(today); end.setDate(today.getDate() + 1);
        return { start, end };
      }
      case 'monthly': {
        // Calendar month (1st of this month → 1st of next month)
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end   = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return { start, end };
      }
      case 'last3months': {
        // Last 3 calendar months
        const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        const end   = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return { start, end };
      }
      case 'yearly': {
        // This calendar year
        const start = new Date(now.getFullYear(), 0, 1);
        const end   = new Date(now.getFullYear() + 1, 0, 1);
        return { start, end };
      }
      default:
        return null;
    }
  };

  const applyFilters = () => {
    // No filters active → show everything
    if (!dateFilter && !typeFilter && !categoryFilter) {
      onFilterChange(null);
      return;
    }

    let result = [...transactions];

    // ── Date filter ──────────────────────────────────────────────
    if (dateFilter) {
      const bounds = getDateBounds(dateFilter);
      if (bounds) {
        result = result.filter(t => {
          // t.date is a "YYYY-MM-DD" string from the backend
          const d = new Date(t.date + 'T00:00:00');
          return d >= bounds.start && d < bounds.end;
        });
      }
    }

    // ── Type filter ──────────────────────────────────────────────
    if (typeFilter) {
      result = result.filter(t => t.type === typeFilter);
    }

    // ── Category filter ──────────────────────────────────────────
    if (categoryFilter) {
      result = result.filter(
        t => t.category?.trim().toLowerCase() === categoryFilter.trim().toLowerCase()
      );
    }

    onFilterChange(result);
  };

  const handleReset = () => {
    setDateFilter('');
    setTypeFilter('');
    setCategoryFilter('');
    // useEffect fires → applyFilters() → onFilterChange(null)
  };

  const hasActiveFilter = dateFilter || typeFilter || categoryFilter;

  // Human-readable label for the active date filter tag
  const dateLabel = {
    daily:      'Today',
    weekly:     'Last 7 Days',
    last30:     'Last 30 Days',
    monthly:    'This Month',
    last3months:'Last 3 Months',
    yearly:     'This Year',
  }[dateFilter] || dateFilter;

  return (
    <div className="transaction-filter">
      <h3>🔍 Filter Transactions</h3>

      <div className="filter-controls">

        {/* ── Date Range ── */}
        <div className="filter-group">
          <label>📅 Date Range</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Time</option>
            <option value="daily">Today</option>
            <option value="weekly">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
            <option value="monthly">This Month</option>
            <option value="last3months">Last 3 Months</option>
            <option value="yearly">This Year</option>
          </select>
        </div>

        {/* ── Transaction Type ── */}
        <div className="filter-group">
          <label>💳 Transaction Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* ── Category ── */}
        <div className="filter-group">
          <label>🏷️ Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* ── Reset ── */}
        <button
          onClick={handleReset}
          className="filter-reset-btn"
          disabled={!hasActiveFilter}
        >
          🔄 Reset Filters
        </button>

      </div>

      {/* Active filter tags */}
      {hasActiveFilter && (
        <div className="active-filters">
          <p>
            <strong>Active:</strong>
            {dateFilter     && <span className="filter-tag">{dateLabel}</span>}
            {typeFilter     && <span className="filter-tag">{typeFilter}</span>}
            {categoryFilter && <span className="filter-tag">{categoryFilter}</span>}
          </p>
        </div>
      )}
    </div>
  );
}

export default TransactionFilter;
