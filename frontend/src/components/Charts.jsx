// Charts Component
// Shows visual charts for income and expenses
// Uses Recharts library for simple, clean charts

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Charts.css';

function Charts({ transactions }) {
  // Calculate income and expense totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Data for pie chart (income vs expense)
  const pieData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpense },
  ];

  // Colors for pie chart
  const COLORS = ['#16a34a', '#dc2626'];

  // Group transactions by category for bar chart
  const categoryData = {};
  transactions.forEach(t => {
    if (!categoryData[t.category]) {
      categoryData[t.category] = { category: t.category, income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      categoryData[t.category].income += parseFloat(t.amount);
    } else {
      categoryData[t.category].expense += parseFloat(t.amount);
    }
  });

  const barData = Object.values(categoryData);

  // If no transactions, show empty state
  if (transactions.length === 0) {
    return (
      <div className="charts-container">
        <p className="no-data-message">📊 Add transactions to see charts</p>
      </div>
    );
  }

  return (
    <div className="charts-container">
      {/* Pie Chart - Income vs Expense */}
      <div className="chart-box">
        <h3>Income vs Expense</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ₹${value.toFixed(0)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Category Breakdown */}
      {barData.length > 0 && (
        <div className="chart-box">
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" fill="#16a34a" name="Income" />
              <Bar dataKey="expense" fill="#dc2626" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Charts;
