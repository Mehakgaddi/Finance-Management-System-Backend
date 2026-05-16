// Backend Test - Validation Functions with Integration Tests
// File: backend/__tests__/validation.test.js
// Tests for input validation utilities with unit and integration tests

// Mock validation functions (would import from actual utils)
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return !!(password && password.length >= 6);
};

const validateAmount = (amount) => {
  return !isNaN(amount) && amount > 0;
};

const validateTransactionType = (type) => {
  return type === "income" || type === "expense";
};

const validateTitle = (title) => {
  return !!(title && title.trim().length > 0 && title.length <= 100);
};

const validateCategory = (category) => {
  return !!(category && category.trim().length > 0 && category.length <= 50);
};

const validateDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

// Integration validation function - validates entire transaction object
const validateTransaction = (transaction) => {
  return {
    isValid: 
      validateTitle(transaction.title) &&
      validateAmount(transaction.amount) &&
      validateTransactionType(transaction.type) &&
      validateCategory(transaction.category) &&
      validateDate(transaction.date),
    errors: {
      title: validateTitle(transaction.title) ? null : "Title is required and must be 1-100 characters",
      amount: validateAmount(transaction.amount) ? null : "Amount must be a positive number",
      type: validateTransactionType(transaction.type) ? null : "Type must be 'income' or 'expense'",
      category: validateCategory(transaction.category) ? null : "Category is required and must be 1-50 characters",
      date: validateDate(transaction.date) ? null : "Date must be a valid date"
    }
  };
};

// ============ UNIT TESTS ============

describe("Validation Functions - Unit Tests", () => {
  describe("validateEmail", () => {
    test("should return true for valid email", () => {
      expect(validateEmail("user@example.com")).toBe(true);
    });

    test("should return true for email with subdomain", () => {
      expect(validateEmail("user@mail.example.co.uk")).toBe(true);
    });

    test("should return false for email without @", () => {
      expect(validateEmail("userexample.com")).toBe(false);
    });

    test("should return false for email without domain", () => {
      expect(validateEmail("user@")).toBe(false);
    });

    test("should return false for empty email", () => {
      expect(validateEmail("")).toBe(false);
    });

    test("should return false for email with spaces", () => {
      expect(validateEmail("user @example.com")).toBe(false);
    });

    test("should return true for email with numbers", () => {
      expect(validateEmail("user123@example456.com")).toBe(true);
    });

    test("should return true for email with dots in local part", () => {
      expect(validateEmail("first.last@example.com")).toBe(true);
    });
  });

  describe("validatePassword", () => {
    test("should return true for password with 6 characters", () => {
      expect(validatePassword("123456")).toBe(true);
    });

    test("should return true for long password", () => {
      expect(validatePassword("this-is-a-long-password")).toBe(true);
    });

    test("should return false for password with less than 6 chars", () => {
      expect(validatePassword("12345")).toBe(false);
    });

    test("should return false for empty password", () => {
      expect(validatePassword("")).toBe(false);
    });

    test("should return false for null password", () => {
      expect(validatePassword(null)).toBe(false);
    });

    test("should return true for password with special characters", () => {
      expect(validatePassword("Pass@123!")).toBe(true);
    });

    test("should return true for password with spaces", () => {
      expect(validatePassword("pass word 123")).toBe(true);
    });
  });

  describe("validateAmount", () => {
    test("should return true for positive number", () => {
      expect(validateAmount(100)).toBe(true);
    });

    test("should return true for decimal number", () => {
      expect(validateAmount(99.99)).toBe(true);
    });

    test("should return true for large number", () => {
      expect(validateAmount(1000000)).toBe(true);
    });

    test("should return false for zero", () => {
      expect(validateAmount(0)).toBe(false);
    });

    test("should return false for negative number", () => {
      expect(validateAmount(-50)).toBe(false);
    });

    test("should return false for non-numeric string", () => {
      expect(validateAmount("abc")).toBe(false);
    });

    test("should return false for empty string", () => {
      expect(validateAmount("")).toBe(false);
    });

    test("should return true for string number", () => {
      expect(validateAmount("100.50")).toBe(true);
    });

    test("should return true for very small decimal", () => {
      expect(validateAmount(0.01)).toBe(true);
    });
  });

  describe("validateTransactionType", () => {
    test("should return true for income", () => {
      expect(validateTransactionType("income")).toBe(true);
    });

    test("should return true for expense", () => {
      expect(validateTransactionType("expense")).toBe(true);
    });

    test("should return false for invalid type", () => {
      expect(validateTransactionType("other")).toBe(false);
    });

    test("should return false for uppercase INCOME", () => {
      expect(validateTransactionType("INCOME")).toBe(false);
    });

    test("should return false for empty string", () => {
      expect(validateTransactionType("")).toBe(false);
    });

    test("should return false for null", () => {
      expect(validateTransactionType(null)).toBe(false);
    });
  });

  describe("validateTitle", () => {
    test("should return true for valid title", () => {
      expect(validateTitle("Salary")).toBe(true);
    });

    test("should return true for title with spaces", () => {
      expect(validateTitle("Monthly Salary")).toBe(true);
    });

    test("should return false for empty title", () => {
      expect(validateTitle("")).toBe(false);
    });

    test("should return false for title with only spaces", () => {
      expect(validateTitle("   ")).toBe(false);
    });

    test("should return false for title exceeding 100 characters", () => {
      const longTitle = "a".repeat(101);
      expect(validateTitle(longTitle)).toBe(false);
    });

    test("should return true for title with exactly 100 characters", () => {
      const title = "a".repeat(100);
      expect(validateTitle(title)).toBe(true);
    });
  });

  describe("validateCategory", () => {
    test("should return true for valid category", () => {
      expect(validateCategory("Food")).toBe(true);
    });

    test("should return false for empty category", () => {
      expect(validateCategory("")).toBe(false);
    });

    test("should return false for category exceeding 50 characters", () => {
      const longCategory = "a".repeat(51);
      expect(validateCategory(longCategory)).toBe(false);
    });

    test("should return true for category with exactly 50 characters", () => {
      const category = "a".repeat(50);
      expect(validateCategory(category)).toBe(true);
    });
  });

  describe("validateDate", () => {
    test("should return true for valid date string", () => {
      expect(validateDate("2024-01-15")).toBe(true);
    });

    test("should return true for valid date object", () => {
      expect(validateDate(new Date())).toBe(true);
    });

    test("should return false for invalid date string", () => {
      expect(validateDate("invalid-date")).toBe(false);
    });

    test("should return false for empty string", () => {
      expect(validateDate("")).toBe(false);
    });

    test("should return true for ISO date format", () => {
      expect(validateDate("2024-12-31T23:59:59Z")).toBe(true);
    });
  });
});

// ============ INTEGRATION TESTS ============

describe("Validation Functions - Integration Tests", () => {
  describe("validateTransaction - Complete Transaction Validation", () => {
    test("should validate a complete valid transaction", () => {
      const transaction = {
        title: "Monthly Salary",
        amount: 50000,
        type: "income",
        category: "Salary",
        date: "2024-01-15"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(true);
      expect(result.errors.title).toBeNull();
      expect(result.errors.amount).toBeNull();
      expect(result.errors.type).toBeNull();
      expect(result.errors.category).toBeNull();
      expect(result.errors.date).toBeNull();
    });

    test("should detect invalid title in transaction", () => {
      const transaction = {
        title: "",
        amount: 100,
        type: "expense",
        category: "Food",
        date: "2024-01-15"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).not.toBeNull();
    });

    test("should detect invalid amount in transaction", () => {
      const transaction = {
        title: "Lunch",
        amount: -50,
        type: "expense",
        category: "Food",
        date: "2024-01-15"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(false);
      expect(result.errors.amount).not.toBeNull();
    });

    test("should detect invalid type in transaction", () => {
      const transaction = {
        title: "Lunch",
        amount: 50,
        type: "invalid",
        category: "Food",
        date: "2024-01-15"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(false);
      expect(result.errors.type).not.toBeNull();
    });

    test("should detect multiple validation errors", () => {
      const transaction = {
        title: "",
        amount: 0,
        type: "invalid",
        category: "",
        date: "invalid-date"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).not.toBeNull();
      expect(result.errors.amount).not.toBeNull();
      expect(result.errors.type).not.toBeNull();
      expect(result.errors.category).not.toBeNull();
      expect(result.errors.date).not.toBeNull();
    });

    test("should validate expense transaction", () => {
      const transaction = {
        title: "Grocery Shopping",
        amount: 2500.50,
        type: "expense",
        category: "Groceries",
        date: "2024-01-20"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(true);
    });

    test("should validate income transaction", () => {
      const transaction = {
        title: "Freelance Project",
        amount: 15000,
        type: "income",
        category: "Freelance",
        date: "2024-01-25"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(true);
    });

    test("should handle edge case with minimum valid values", () => {
      const transaction = {
        title: "A",
        amount: 0.01,
        type: "income",
        category: "B",
        date: "2024-01-01"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(true);
    });

    test("should handle edge case with maximum valid values", () => {
      const transaction = {
        title: "a".repeat(100),
        amount: 999999999,
        type: "expense",
        category: "a".repeat(50),
        date: "2024-12-31"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(true);
    });
  });

  describe("Cross-field Validation Scenarios", () => {
    test("should validate transaction with decimal amount", () => {
      const transaction = {
        title: "Coffee",
        amount: 125.75,
        type: "expense",
        category: "Food",
        date: "2024-01-15"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(true);
      expect(result.errors.amount).toBeNull();
    });

    test("should reject transaction with zero amount", () => {
      const transaction = {
        title: "Test",
        amount: 0,
        type: "income",
        category: "Test",
        date: "2024-01-15"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(false);
      expect(result.errors.amount).not.toBeNull();
    });

    test("should validate transaction with special characters in title", () => {
      const transaction = {
        title: "Salary - January 2024",
        amount: 50000,
        type: "income",
        category: "Salary",
        date: "2024-01-15"
      };
      const result = validateTransaction(transaction);
      expect(result.isValid).toBe(true);
    });
  });
});
