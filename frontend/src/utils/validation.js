// Frontend Validation Utilities
// This file contains helper functions to validate user input on the frontend
// Prevents sending invalid data to backend

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password length
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validate name length
export const isValidName = (name) => {
  return name && name.length >= 2 && name.length <= 50;
};

// Validate transaction amount (positive number)
export const isValidAmount = (amount) => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount > 0 && numAmount <= 999999999;
};

// Validate transaction type
export const isValidType = (type) => {
  return type === "income" || type === "expense";
};

// Validate transaction title
export const isValidTitle = (title) => {
  return title && title.length >= 1 && title.length <= 100;
};

// Validate category
export const isValidCategory = (category) => {
  return category && category.length >= 1 && category.length <= 50;
};

// Validate date
export const isValidDate = (date) => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

// Get error message for signup form
export const getSignupErrors = (name, email, password, confirmPassword) => {
  const errors = {};

  if (!name) {
    errors.name = "Name is required";
  } else if (!isValidName(name)) {
    errors.name = "Name must be 2-50 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (!isValidPassword(password)) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

// Get error message for login form
export const getLoginErrors = (email, password) => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

// Get error message for transaction form
export const getTransactionErrors = (title, amount, type, category, date) => {
  const errors = {};

  if (!title) {
    errors.title = "Title is required";
  } else if (!isValidTitle(title)) {
    errors.title = "Title must be 1-100 characters";
  }

  if (!amount) {
    errors.amount = "Amount is required";
  } else if (!isValidAmount(amount)) {
    errors.amount = "Amount must be a positive number";
  }

  if (!type) {
    errors.type = "Type is required";
  } else if (!isValidType(type)) {
    errors.type = 'Type must be "income" or "expense"';
  }

  if (!category) {
    errors.category = "Category is required";
  } else if (!isValidCategory(category)) {
    errors.category = "Category must be 1-50 characters";
  }

  if (!date) {
    errors.date = "Date is required";
  } else if (!isValidDate(date)) {
    errors.date = "Invalid date format";
  }

  return errors;
};
