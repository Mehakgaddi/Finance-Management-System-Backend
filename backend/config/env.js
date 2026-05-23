// Unified Environment Variable Loader
// File: backend/config/env.js
// This helper makes sure we load environment variables in the right order:
// 1. '.env.local' - Contains local developer overrides (not committed to git).
// 2. '.env' - Contains default/production settings.
// Since dotenv does not overwrite already set variables, .env.local values take precedence.

const path = require("path");
const fs = require("fs");

// Build absolute paths to our env files in the backend root
const backendRootDir = path.resolve(__dirname, "..");
const localEnvPath = path.join(backendRootDir, ".env.local");
const baseEnvPath = path.join(backendRootDir, ".env");

// Load .env.local first if it exists
if (fs.existsSync(localEnvPath)) {
  require("dotenv").config({ path: localEnvPath });
}

// Load default .env file
require("dotenv").config({ path: baseEnvPath });
