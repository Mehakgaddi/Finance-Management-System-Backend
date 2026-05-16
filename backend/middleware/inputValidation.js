// Input Validation Middleware
// This checks if user input is valid before saving to database
// Prevents bad data and SQL injection attempts

// VALIDATE SIGNUP INPUT
const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please provide name, email, and password",
    });
  }

  // Check if name is between 2-50 characters
  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({
      message: "Name must be between 2 and 50 characters",
    });
  }

  // Check if email is valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please provide a valid email address",
    });
  }

  // Check if password is strong enough
  // Minimum 6 characters (beginner-friendly, not too strict)
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  // Trim input to prevent extra spaces causing issues
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.password = password;

  next();
};

// VALIDATE LOGIN INPUT
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please provide a valid email address",
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

// VALIDATE TRANSACTION INPUT
const validateTransaction = (req, res, next) => {
  const { title, amount, type, category, date } = req.body;

  // Check if all fields are provided
  if (!title || !amount || !type || !category || !date) {
    return res.status(400).json({
      message: "Please provide all transaction details",
    });
  }

  // Check if title is valid (1-100 characters)
  if (title.length < 1 || title.length > 100) {
    return res.status(400).json({
      message: "Title must be between 1 and 100 characters",
    });
  }

  // Check if amount is a valid number and positive
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({
      message: "Amount must be a positive number",
    });
  }

  // Check if amount is not too large (prevent spam)
  if (numAmount > 999999999) {
    return res.status(400).json({
      message: "Amount is too large",
    });
  }

  // Check if type is either 'income' or 'expense'
  if (type !== "income" && type !== "expense") {
    return res.status(400).json({
      message: 'Type must be either "income" or "expense"',
    });
  }

  // Check if category is valid (1-50 characters)
  if (category.length < 1 || category.length > 50) {
    return res.status(400).json({
      message: "Category must be between 1 and 50 characters",
    });
  }

  // Check if date is valid
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      message: "Please provide a valid date",
    });
  }

  // Trim string inputs
  req.body.title = title.trim();
  req.body.category = category.trim();
  req.body.amount = numAmount;
  req.body.date = parsedDate;

  next();
};

// VALIDATE PASSWORD UPDATE
const validatePasswordUpdate = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "Please provide current and new password",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "New password must be at least 6 characters",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      message: "New password must be different from current password",
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateTransaction,
  validatePasswordUpdate,
};
