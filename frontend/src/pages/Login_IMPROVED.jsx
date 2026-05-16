// Improved Login Component
// File: frontend/src/pages/Login.jsx
// Uses API helper, input validation, error handling

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { getLoginErrors } from '../utils/validation';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    // 1. Validate input on frontend first
    const validationErrors = getLoginErrors(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      // 2. Call API (from api.js)
      // This automatically:
      // - Sends request to backend
      // - Saves token to localStorage
      // - Saves user info to localStorage
      const response = await loginUser(email, password);

      // 3. Success - redirect to dashboard
      console.log('✅ Login successful');
      navigate('/dashboard');

    } catch (error) {
      // 4. Handle specific error codes from backend
      if (error.code === 'INVALID_CREDENTIALS') {
        setGeneralError('Invalid email or password');
      } else if (error.code === 'USER_NOT_FOUND') {
        setGeneralError('User not found. Please signup first.');
      } else {
        setGeneralError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login to Your Account</h2>

        {/* General error message */}
        {generalError && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {errors.email && (
              <p className="error-text" style={{ color: 'red', fontSize: '12px' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {errors.password && (
              <p className="error-text" style={{ color: 'red', fontSize: '12px' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Sign up link */}
        <p>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'blue', textDecoration: 'none' }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
