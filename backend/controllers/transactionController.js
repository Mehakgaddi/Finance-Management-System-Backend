// This file handles all transaction related logic
// Add, Get All, and Delete transactions

const Transaction = require('../models/Transaction');

// ADD a new transaction
const addTransaction = async (req, res) => {
  const { title, amount, type, category, date } = req.body;

  try {
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date,
      userId: req.userId  // comes from the auth middleware
    });

    res.status(201).json({ message: 'Transaction added', transaction });

  } catch (error) {
    res.status(500).json({ message: 'Could not add transaction', error: error.message });
  }
};

// GET all transactions for the logged in user
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.userId },
      order: [['date', 'DESC']]  // show latest first
    });

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({ message: 'Could not fetch transactions', error: error.message });
  }
};

// DELETE a transaction by id
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    // Make sure the transaction belongs to the logged in user
    const transaction = await Transaction.findOne({
      where: { id, userId: req.userId }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.destroy();

    res.status(200).json({ message: 'Transaction deleted' });

  } catch (error) {
    res.status(500).json({ message: 'Could not delete transaction', error: error.message });
  }
};

module.exports = { addTransaction, getTransactions, deleteTransaction };
