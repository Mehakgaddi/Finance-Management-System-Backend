// Login Page
// Uses the centralized API helper for requests
// Validates input before sending, shows proper error messages

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { getLoginErrors } from '../utils/validation';
import './Auth.css';

function Login() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);
  const [generalError, setGeneralError] = useState('');

  const navigate = useNavigate();

  // If user is already logged in, send them straight to dashboard
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    // Client-side validation first
    const validationErrors = getLoginErrors(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password);
      // loginUser saves token + user to localStorage automatically
      navigate('/dashboard', { replace: true });
    } catch (error) {
      // error is the response body: { message, code }
      const code = error.code;
      if (code === 'INVALID_CREDENTIALS') {
        setGeneralError('Invalid email or password. Please try again.');
      } else if (code === 'EMAIL_EXISTS') {
        setGeneralError('This email is already registered.');
      } else {
        // Show whatever message the server sent, fall back to generic
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

        {generalError && (
          <div className="error-message">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && (
              <p className="error-text">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="error-text">{errors.password}</p>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p>
          Don't have an account?{' '}
          <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
