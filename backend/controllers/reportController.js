// Report Controller
// File: backend/controllers/reportController.js
// Handles report generation and sending

const { Transaction, User } = require('../models');
const { generateTransactionPDF } = require('../services/pdfService');
const { sendTransactionReport } = require('../services/emailService');

/**
 * Generate PDF report
 * Returns PDF file for download
 */
const generatePDFReport = async (req, res) => {
  try {
    console.log(`📄 Generating PDF report for user: ${req.userId}`);

    // Get user
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all transactions for this user
    const transactions = await Transaction.findAll({
      where: { userId: req.userId },
      order: [['date', 'DESC']]
    });

    if (!transactions || transactions.length === 0) {
      return res.status(400).json({ message: 'No transactions found to generate report' });
    }

    // Calculate statistics
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      const amount = parseFloat(t.amount);
      if (t.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }
    });

    const stats = {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };

    console.log(`📊 Report stats - Income: ${totalIncome}, Expense: ${totalExpense}`);

    // Generate PDF
    const pdfBuffer = await generateTransactionPDF(user.name, transactions, stats);

    // Send as file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="finance-report-${new Date().toISOString().split('T')[0]}.pdf"`);
    res.send(pdfBuffer);

    console.log('✅ PDF generated and sent successfully');

  } catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};

/**
 * Generate and email report
 * Sends PDF to user's email
 */
const sendReportByEmail = async (req, res) => {
  try {
    console.log(`📧 Sending report by email for user: ${req.userId}`);

    // Get user
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all transactions for this user
    const transactions = await Transaction.findAll({
      where: { userId: req.userId },
      order: [['date', 'DESC']]
    });

    if (!transactions || transactions.length === 0) {
      return res.status(400).json({ message: 'No transactions found to generate report' });
    }

    // Calculate statistics
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      const amount = parseFloat(t.amount);
      if (t.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }
    });

    const stats = {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };

    // Generate PDF
    console.log('🔄 Generating PDF...');
    const pdfBuffer = await generateTransactionPDF(user.name, transactions, stats);

    // Send email
    console.log(`🔄 Sending to ${user.email}...`);
    const emailSent = await sendTransactionReport(user.email, user.name, pdfBuffer);

    if (emailSent) {
      res.status(200).json({
        message: `Report sent successfully to ${user.email}`,
        stats
      });
    } else {
      res.status(500).json({
        message: 'Email feature is not configured. Check server logs.',
        stats
      });
    }

  } catch (error) {
    console.error('❌ Error sending report:', error.message);
    res.status(500).json({ message: 'Failed to send report', error: error.message });
  }
};

module.exports = { generatePDFReport, sendReportByEmail };
