// Models Index
// File: backend/models/index.js
// Exports all models for easy importing

const User = require("./User");
const Transaction = require("./Transaction");

module.exports = {
  User,
  Transaction,
};
