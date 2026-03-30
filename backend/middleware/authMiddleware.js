// This is the auth middleware
// It checks if the request has a valid JWT token
// If no token or wrong token → block the request
// If valid token → allow the request and attach user info

const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  // Get the token from the request header
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  // Handle both "Bearer <token>" and plain "<token>" formats
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user id to the request so controllers can use it
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protect;
