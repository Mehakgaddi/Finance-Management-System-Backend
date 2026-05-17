// This file handles signup and login logic
// signup → create a new user in the database
// login  → check credentials and return a JWT token
// Also backups user data to Firebase

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { saveUserToFirebase } = require("../services/firebaseService");
const { generateToken, isTokenExpiringSoon } = require("../utils/tokenUtils");
require("dotenv").config();

// SIGNUP
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if a user with this email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
        code: "EMAIL_EXISTS",
      });
    }

    // Hash the password before saving (never store plain text passwords)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Also backup user info to Firebase
    saveUserToFirebase(newUser.id, { name, email });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email (email is already lowercased by validateLogin middleware)
    const user = await User.findOne({ where: { email } });
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
