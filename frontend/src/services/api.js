// API Helper for Frontend
// This file contains helper functions to make API calls to the backend
// Automatically includes JWT token in every request
// Handles token refresh when token expires

import axios from "axios";

// Base URL comes from the environment variable.
// In Create React App, env vars must start with REACT_APP_.
// We store the full backend URL (e.g. https://your-app.onrender.com)
// and just append /api here — no need to add http:// ourselves.
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance with base URL
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor to handle responses and errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If token is expired, try to refresh it
    if (error.response?.data?.code === "TOKEN_EXPIRED") {
      const refreshed = await refreshTokenSilently();

      // If refresh successful, retry original request
      if (refreshed) {
        return API(error.config);
      }
    }

    // For other errors, just throw them
    return Promise.reject(error);
  },
);

// Silently refresh token (don't show to user)
const refreshTokenSilently = async () => {
  try {
    const currentToken = localStorage.getItem("token");

    // Make request with current token
    const response = await axios.post(
      `${BASE_URL}/api/auth/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Save new token
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      console.log("✅ Token refreshed silently");
      return true;
    }
  } catch (error) {
    console.log("❌ Token refresh failed");
    // If refresh fails, user needs to login again
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return false;
  }
};

// AUTHENTICATION ENDPOINTS

// Sign up new user
export const signupUser = async (name, email, password) => {
  try {
    const response = await API.post("/auth/signup", { name, email, password });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: error.message || "Network error. Please try again." };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });

    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    // Throw the server's response body if available, otherwise a network error object
    if (error.response?.data) {
      throw error.response.data;
    }
    // Network error (server down, CORS, timeout)
    throw { message: error.message || "Network error. Please try again." };
  }
};

// Get current user profile
export const getUserProfile = async () => {
  try {
    const response = await API.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};

// Update password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await API.put("/auth/update-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update password" };
  }
};

// Logout user (clear localStorage)
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// OPTIONAL: Manually refresh token (if needed)
export const manualRefreshToken = async () => {
  try {
    const response = await API.post("/auth/refresh-token");

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      console.log("✅ Token refreshed manually");
      return response.data;
    }
  } catch (error) {
    console.log("❌ Failed to refresh token:", error.message);
    throw error.response?.data || { message: "Token refresh failed" };
  }
};

// TRANSACTION ENDPOINTS

// Add new transaction
export const addTransaction = async (title, amount, type, category, date) => {
  try {
    const response = await API.post("/transactions", {
      title,
      amount,
      type,
      category,
      date,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add transaction" };
  }
};

// Get all transactions
export const getTransactions = async () => {
  try {
    const response = await API.get("/transactions");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch transactions" };
  }
};

// Delete transaction
export const deleteTransaction = async (id) => {
  try {
    const response = await API.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete transaction" };
  }
};

// HELPER FUNCTIONS

// Get auth token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get user from localStorage
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export default API;
