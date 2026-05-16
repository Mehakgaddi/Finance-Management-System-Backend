// This is the auth middleware
// It checks if the request has a valid JWT token
// If no token or wrong token → block the request
// If valid token → allow the request and attach user info

const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = (req, res, next) => {
  // Get the token from the request header
  let token = req.headers.authorization;

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: "No token provided. Please login first.",
      code: "NO_TOKEN",
    });
  }

  // Handle both "Bearer <token>" and plain "<token>" formats
  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user id and expiration to the request
    req.userId = decoded.id;
    req.tokenExp = decoded.exp; // Token expiration time

    next();
  } catch (error) {
    // Different error messages for different JWT errors
    let message = "Invalid token";
    let code = "INVALID_TOKEN";

    if (error.name === "TokenExpiredError") {
      message = "Your session has expired. Please login again.";
      code = "TOKEN_EXPIRED";
      return res.status(401).json({ message, code });
    }

    if (error.name === "JsonWebTokenError") {
      message = "Invalid token format. Please login again.";
      code = "INVALID_FORMAT";
      return res.status(401).json({ message, code });
    }

    if (error.name === "NotBeforeError") {
      message = "Token not yet valid";
      code = "TOKEN_NOT_VALID";
      return res.status(401).json({ message, code });
    }

    // Generic invalid token message
    return res.status(401).json({ message, code });
  }
};

module.exports = protect;
