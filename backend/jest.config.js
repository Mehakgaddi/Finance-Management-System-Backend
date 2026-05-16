// Jest Configuration for Backend
// File: backend/jest.config.js
// Configures Jest testing framework

module.exports = {
  // Use Node environment (not browser)
  testEnvironment: 'node',

  // Look for test files in these patterns
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],

  // Coverage thresholds (optional)
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
  ],

  // Verbose output (show each test)
  verbose: true,

  // Timeout for tests (5 seconds)
  testTimeout: 5000,

  // Don't show coverage by default
  collectCoverage: false,

  // Transform files with babel (optional)
  transform: {},
};
