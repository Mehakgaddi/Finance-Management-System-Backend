// This file defines the transaction routes
// All these routes are protected - user must be logged in (valid token required)

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  addTransaction,
  getTransactions,
  deleteTransaction
} = require('../controllers/transactionController');

router.post('/', protect, addTransaction);          // Add transaction
router.get('/', protect, getTransactions);          // Get all transactions
router.delete('/:id', protect, deleteTransaction);  // Delete a transaction

module.exports = router;
