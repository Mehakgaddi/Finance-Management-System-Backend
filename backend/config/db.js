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
require('dotenv').config();

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

module.exports = sequelize;