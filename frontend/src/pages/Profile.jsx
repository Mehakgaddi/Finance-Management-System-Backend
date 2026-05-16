// Profile page
// Shows the logged-in user's name and email
// Also lets the user update their password and logout

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './Profile.css';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profileError, setProfileError] = useState('');

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch user profile when page loads
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (err) {
      console.log('Profile fetch error:', err.response?.data || err.message);
      setProfileError(err.response?.data?.message || 'Could not load profile');
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.put(
        'http://localhost:5000/api/auth/update-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      setCurrentPassword('');
      setNewPassword('');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  // Logout - just clear localStorage and go to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>

      <div className="profile-container">

        <h2 className="profile-heading">My Profile</h2>

        {/* User Info Section */}
        <div className="profile-card">
          <h3>Account Details</h3>
          {profileError ? (
            <p className="error-msg">{profileError}</p>
          ) : (
            <>
              <div className="profile-field">
                <label>Name</label>
                <p>{name}</p>
              </div>
              <div className="profile-field">
                <label>Email</label>
                <p>{email}</p>
              </div>
            </>
          )}
        </div>

        {/* Update Password Section */}
        <div className="profile-card">
          <h3>Update Password</h3>
          <form onSubmit={handleUpdatePassword}>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="update-btn">
              Update Password
            </button>
          </form>

          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* Logout Button */}
        <div className="profile-card">
          <h3>Session</h3>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;
