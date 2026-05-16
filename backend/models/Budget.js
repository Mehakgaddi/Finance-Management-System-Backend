// Budget Model
// File: backend/models/Budget.js
// This file defines the Budget model
// Each user can have ONE budget per month
// Budget stores: monthly limit, current month, and user ID

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Budget = sequelize.define('Budget', {
  // Monthly budget amount (e.g., 50000)
  monthlyLimit: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },

  // Which month this budget is for (e.g., "2024-01")
  month: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => {
      // Get current month in format YYYY-MM
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    }
  },

  // Which user this budget belongs to
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Has email been sent for overspending? (to avoid sending multiple emails)
  emailSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// One user can have many budgets (one per month)
User.hasMany(Budget, { foreignKey: 'userId' });
Budget.belongsTo(User, { foreignKey: 'userId' });

module.exports = Budget;
