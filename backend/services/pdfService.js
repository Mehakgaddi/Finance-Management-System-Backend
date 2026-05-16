// PDF Service
// File: backend/services/pdfService.js
// Generates PDF report of transactions

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate PDF report of transactions
 * 
 * @param {string} userName - User's name
 * @param {Array} transactions - Array of transaction objects
 * @param {Object} stats - Statistics object { totalIncome, totalExpense, balance }
 * @returns {Promise<Buffer>} PDF as buffer (can be sent as email attachment or downloaded)
 */
const generateTransactionPDF = async (userName, transactions, stats) => {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument();
      
      // Collect PDF data in buffer
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      // --- PDF HEADER ---
      doc.fontSize(20).font('Helvetica-Bold').text('Finance Report', 50, 50);
      doc.fontSize(12).font('Helvetica').text(`User: ${userName}`, 50, 80);
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, 50, 100);
      doc.moveTo(50, 120).lineTo(550, 120).stroke(); // Horizontal line

      // --- SUMMARY SECTION ---
      doc.fontSize(14).font('Helvetica-Bold').text('Summary', 50, 140);
      
      const summaryY = 170;
      doc.fontSize(11).font('Helvetica');
      doc.text(`Total Income:    ₹${stats.totalIncome.toFixed(2)}`, 60, summaryY);
      doc.text(`Total Expense:   ₹${stats.totalExpense.toFixed(2)}`, 60, summaryY + 25);
      
      // Balance with color coding (red for negative, black for positive)
      const balanceLabel = stats.balance < 0 ? 'Balance (Deficit):' : 'Balance (Surplus):';
      doc.text(`${balanceLabel} ₹${stats.balance.toFixed(2)}`, 60, summaryY + 50);
      
      doc.moveTo(50, summaryY + 85).lineTo(550, summaryY + 85).stroke();

      // --- TRANSACTIONS TABLE ---
      doc.fontSize(14).font('Helvetica-Bold').text('Transactions', 50, summaryY + 110);

      // Table headers
      const tableY = summaryY + 145;
      const colX = [70, 180, 280, 380, 450];
      
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Date', colX[0], tableY);
      doc.text('Title', colX[1], tableY);
      doc.text('Type', colX[2], tableY);
      doc.text('Category', colX[3], tableY);
      doc.text('Amount', colX[4], tableY);

      // Table data
      let currentY = tableY + 20;
      const rowHeight = 20;
      const maxRows = 12; // Max rows per page
      let rowCount = 0;

      doc.fontSize(9).font('Helvetica');

      transactions.forEach((transaction, index) => {
        // Move to next page if needed
        if (rowCount >= maxRows) {
          doc.addPage();
          currentY = 50;
          rowCount = 0;

          // Repeat headers on new page
          doc.fontSize(10).font('Helvetica-Bold');
          doc.text('Date', colX[0], currentY);
          doc.text('Title', colX[1], currentY);
          doc.text('Type', colX[2], currentY);
          doc.text('Category', colX[3], currentY);
          doc.text('Amount', colX[4], currentY);
          currentY += 20;
          doc.fontSize(9).font('Helvetica');
        }

        // Format date
        const date = new Date(transaction.date).toLocaleDateString();
        
        // Format amount with color
        const amountText = `₹${transaction.amount}`;
        
        // Write row
        doc.text(date, colX[0], currentY, { width: 100 });
        doc.text(transaction.title, colX[1], currentY, { width: 100 });
        doc.text(transaction.type, colX[2], currentY, { width: 100 });
        doc.text(transaction.category || 'N/A', colX[3], currentY, { width: 70 });
        doc.text(amountText, colX[4], currentY, { width: 100 });

        currentY += rowHeight;
        rowCount++;
      });

      // --- FOOTER ---
      doc.fontSize(8).font('Helvetica').text(
        'This is an automatically generated report. For official records, please contact support.',
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

      // End document
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateTransactionPDF };
