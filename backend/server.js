// This is the main entry point of our backend
// It starts the Express server and connects to the database
// Also initializes Firebase for cloud backup

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import Firebase config to initialize it
require("./config/firebase");

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const filterRoutes = require("./routes/filterRoutes");
const aiRoutes = require("./routes/aiRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const reportsAnalyticsRoutes = require("./routes/reportsAnalyticsRoutes");
const { errorHandler } = require("./middleware/errorHandler");

// We need to import models so Sequelize knows about them
// and creates the tables when we sync
require("./models/Transaction");
require("./models/Budget");

const app = express();

// Middleware
// Allow requests from both local dev and the deployed Vercel frontend.
// FRONTEND_URL is set in Render's environment variables to your Vercel URL.
// Locally it falls back to localhost:3000 so testing still works.
const allowedOrigins = [
  process.env.FRONTEND_URL,          // e.g. https://your-app.vercel.app (set in Render)
  "http://localhost:3000",            // local CRA dev server
].filter(Boolean); // remove undefined if FRONTEND_URL is not set

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json()); // allows us to read JSON from request body

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/filters", filterRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/analytics", reportsAnalyticsRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.send("Finance Management System API is running");
});

// Error handling middleware (MUST be at the end after all other routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
// Using sync({ force: false }) to avoid MySQL "Too many keys" error with alter:true
// Tables are created if they don't exist, but existing tables are not altered
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log("Database tables synced");
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `\n❌ Port ${PORT} is already in use!\n` +
          `   Please close the other process using that port and restart.\n` +
          `   You can run: netstat -ano | findstr :${PORT}  then  taskkill /PID <PID> /F\n`
        );
        process.exit(1);
      } else {
        throw err;
      }
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    console.error("   Make sure MySQL is running and credentials in .env are correct.");
    process.exit(1);
  });

// Catch unhandled exceptions to prevent silent crashes
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});
