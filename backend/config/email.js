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
    // Create transporter using direct Gmail SMTP servers for maximum stability
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL/TLS secure connection
      auth: {
        user: emailUser, // Your email
        pass: emailPassword.replace(/\s+/g, ""), // Strip spaces if they pasted with spaces
      },
    });

    // Verify connection configuration on server startup to catch authentication issues early
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Email transport verification failed:", error.message);
        console.warn("   Double-check your email credentials. If using Gmail, make sure to generate a fresh 16-character App Password.");
      } else {
        console.log("📧 Email SMTP server is ready to deliver notifications");
      }
    });

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
