  // This file defines the User model
  // A model tells Sequelize what the 'users' table looks like

  const { DataTypes } = require('sequelize');
  const sequelize = require('../config/db');

  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true   // no two users can have the same email
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false  // we will store the hashed password here
    }
  });

  module.exports = User;
