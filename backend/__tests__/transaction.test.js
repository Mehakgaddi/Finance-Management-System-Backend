// Simplified Test - Amount & Transaction Type Validation
// File: backend/__tests__/transaction.test.js
// Testing ONLY validation functions (easiest module)

// Simple validation functions
const validateAmount = (amount) => {
  return !isNaN(amount) && amount > 0;
};

const validateTransactionType = (type) => {
  return type === "income" || type === "expense";
};

// ============ TESTS ============

describe("Amount Validation", () => {
  test("should accept positive number", () => {
    expect(validateAmount(100)).toBe(true);
  });

  test("should accept decimal number", () => {
    expect(validateAmount(99.99)).toBe(true);
  });

  test("should reject zero", () => {
    expect(validateAmount(0)).toBe(false);
  });

  test("should reject negative number", () => {
    expect(validateAmount(-50)).toBe(false);
  });

  test("should reject non-numeric string", () => {
    expect(validateAmount("abc")).toBe(false);
  });
});

describe("Transaction Type Validation", () => {
  test("should accept 'income'", () => {
    expect(validateTransactionType("income")).toBe(true);
  });

  test("should accept 'expense'", () => {
    expect(validateTransactionType("expense")).toBe(true);
  });

  test("should reject invalid type", () => {
    expect(validateTransactionType("transfer")).toBe(false);
  });

  test("should reject uppercase", () => {
    expect(validateTransactionType("INCOME")).toBe(false);
  });

  test("should reject empty string", () => {
    expect(validateTransactionType("")).toBe(false);
  });
});
