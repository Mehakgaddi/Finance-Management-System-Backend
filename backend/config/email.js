// Email Configuration
// File: backend/config/email.js
// Configures Nodemailer for sending emails

const nodemailer = require("nodemailer");

// Create email transporter
// This object handles sending emails
let transporter = null;

const initializeEmailTransporter = () => {
  // Check if email credentials are provided
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  // If credentials missing, email feature is disabled
  if (!emailUser || !emailPassword) {
    console.log("⚠️ Email credentials not found. Email feature disabled.");
    console.log(
      "📝 Set EMAIL_USER and EMAIL_PASSWORD in .env to enable emails.",
    );
    return null;
  }

  try {
    // Create transporter using Gmail (or any email service)
    // Gmail requires: App Password (not regular password)
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser, // Your email (e.g., yourname@gmail.com)
        pass: emailPassword, // App password (16 characters from Gmail)
      },
    });

    console.log("✅ Email transporter initialized successfully");
    return transporter;
  } catch (error) {
    console.error("❌ Error initializing email transporter:", error.message);
    return null;
  }
};

// Initialize on module load
transporter = initializeEmailTransporter();

// Export transporter
module.exports = { transporter };
