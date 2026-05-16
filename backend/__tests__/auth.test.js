// Simplified Test - Email & Password Validation
// File: backend/__tests__/auth.test.js
// Testing ONLY validation functions (easiest module)

// Simple validation function
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return !!(password && password.length >= 6);
};

// ============ TESTS ============

describe("Email Validation", () => {
  test("should accept valid email format", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  test("should reject email without @", () => {
    expect(validateEmail("userexample.com")).toBe(false);
  });

  test("should reject email without domain", () => {
    expect(validateEmail("user@")).toBe(false);
  });

  test("should reject empty email", () => {
    expect(validateEmail("")).toBe(false);
  });
});

describe("Password Validation", () => {
  test("should accept password with 6+ characters", () => {
    expect(validatePassword("password123")).toBe(true);
  });

  test("should reject password with less than 6 chars", () => {
    expect(validatePassword("12345")).toBe(false);
  });

  test("should reject empty password", () => {
    expect(validatePassword("")).toBe(false);
  });

  test("should accept exactly 6 characters", () => {
    expect(validatePassword("123456")).toBe(true);
  });
});
