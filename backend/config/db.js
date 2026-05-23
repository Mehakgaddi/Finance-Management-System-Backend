// // This file sets up the connection to our MySQL database using Sequelize
// // Sequelize is an ORM - it lets us talk to the database using JavaScript instead of raw SQL

// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// // Create a new Sequelize instance with our DB credentials from .env file
// const sequelize = new Sequelize(
//   process.env.DB_NAME,      // database name
//   process.env.DB_USER,      // mysql username
//   process.env.DB_PASSWORD,  // mysql password
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',       // we are using MySQL
//     logging: false          // set to true if you want to see SQL queries in terminal
//   }
// );

// module.exports = sequelize;


const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

// Load environment variables dynamically
require('./env');

// Create the Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

// This function checks if the MySQL database exists, and creates it if it doesn't.
// Useful for running the application locally on a new computer without needing
// to manually log into MySQL to run CREATE DATABASE queries.
const ensureDatabaseExists = async () => {
  try {
    // Connect to MySQL server without specifying database name first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Run the create database query if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.end();
    console.log(`✅ Database "${process.env.DB_NAME}" verified/created successfully.`);
  } catch (error) {
    // If it fails (e.g. permission limits in production cloud DBs), we print a warning,
    // but don't crash, because Sequelize might still be able to connect directly
    // if the database is already created for us.
    console.warn(`⚠️ Warning: Could not pre-verify/create database "${process.env.DB_NAME}":`, error.message);
  }
};

// Attach helper to the exported instance
sequelize.ensureDatabaseExists = ensureDatabaseExists;

module.exports = sequelize;