// This file handles signup and login logic
// signup → create a new user in the database
// login  → check credentials and return a JWT token
// Also backups user data to Firebase

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { saveUserToFirebase } = require("../services/firebaseService");
const { generateToken, isTokenExpiringSoon } = require("../utils/tokenUtils");
require("../config/env");

// SIGNUP
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  // email is already lowercased by validateSignup middleware
  // but we double-ensure here for safety
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Case-insensitive duplicate check — prevents Test@Gmail.com and test@gmail.com
    // from being registered as two separate accounts
    const { fn, col, where } = require("sequelize");
    const existingUser = await User.findOne({
      where: where(fn("LOWER", col("email")), normalizedEmail),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
        code: "EMAIL_EXISTS",
      });
    }

    // Hash the password before saving (never store plain text passwords)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Always store email in lowercase
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Also backup user info to Firebase
    saveUserToFirebase(newUser.id, { name: name.trim(), email: normalizedEmail });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error.message);
    // Handle Sequelize unique constraint violation (race condition safety net)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Email already registered",
        code: "EMAIL_EXISTS",
      });
    }
    res.status(500).json({
      message: "Something went wrong",
      code: "SERVER_ERROR",
      error: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use case-insensitive email lookup so old users (stored with any case) can still login.
    // MySQL utf8_general_ci is case-insensitive by default, but we use fn('LOWER') to be safe
    // across all DB collations including utf8_bin.
    const { Op, fn, col, where } = require("sequelize");
    const user = await User.findOne({
      where: where(fn("LOWER", col("email")), email.toLowerCase()),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Compare the entered password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Normalize the stored email to lowercase on successful login
    // This silently fixes old accounts that were stored with mixed case
    if (user.email !== user.email.toLowerCase()) {
      user.email = user.email.toLowerCase();
      await user.save();
    }

    // Generate token using utility function
    const token = generateToken(user.id, "1d");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Something went wrong",
      code: "SERVER_ERROR",
      error: error.message,
    });
  }
};

// GET PROFILE
// Returns the logged-in user's name and email
// req.userId comes from the auth middleware (decoded from JWT token)
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// UPDATE PASSWORD
// User sends currentPassword and newPassword
// We check if currentPassword is correct, then save the new hashed password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password they entered is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password before saving
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// REFRESH TOKEN
// Generate a new token when the old one is about to expire
// User must have valid token (middleware will check)
const refreshToken = async (req, res) => {
  try {
    // req.userId comes from protect middleware
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new token
    const newToken = generateToken(user.id, "1d");

    res.status(200).json({
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { signup, login, getProfile, updatePassword, refreshToken };
