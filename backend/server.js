// This is the main entry point of our backend
// It starts the Express server and connects to the database

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// We need to import Transaction model so Sequelize knows about it
// and creates the table when we sync
require('./models/Transaction');

const app = express();

// Middleware
app.use(cors());                  // allows frontend to talk to backend
app.use(express.json());          // allows us to read JSON from request body

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('Finance Management System API is running');
});

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
// sequelize.sync() creates the tables if they don't exist
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database connected and tables synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Database connection failed:', error.message);
  });
