// JWT Token Utilities
// Helper functions for token operations

const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate a new JWT token
const generateToken = (userId, expiresIn = "1d") => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

// Generate a short-lived refresh token (optional, for later use)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: "refresh" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }, // Refresh token valid for 7 days
  );
};

// Verify if token is close to expiring (within 1 hour)
const isTokenExpiringSoon = (tokenExp) => {
  if (!tokenExp) return false;

  // tokenExp is in seconds (unix timestamp)
  const now = Math.floor(Date.now() / 1000);
  const secondsUntilExpiry = tokenExp - now;
  const oneHourInSeconds = 3600;

  return secondsUntilExpiry < oneHourInSeconds && secondsUntilExpiry > 0;
};

// Decode token without verification (for debugging)
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  isTokenExpiringSoon,
  decodeToken,
};
