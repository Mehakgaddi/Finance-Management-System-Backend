// Error Handler Middleware
// This catches all errors and sends them in a safe format
// Never exposes sensitive information to the frontend

// Global error handling middleware
// Should be added at the END of server.js after all other middleware
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  // Send error to frontend in a safe way
  // Don't expose internal server details
  res.status(statusCode).json({
    message: message,
    // In production, don't send error details
    // error: process.env.NODE_ENV === 'development' ? err : undefined
  });
};

// Function to create custom API errors
const ApiError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
};

module.exports = {
  errorHandler,
  ApiError,
};
