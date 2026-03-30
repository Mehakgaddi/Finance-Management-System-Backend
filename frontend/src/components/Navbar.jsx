// Navbar component
// Shows the app name, a link to Profile, and a logout button

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1>Finance Manager</h1>
      <div className="nav-right">
        {user && <span>Hello, {user.name}</span>}
        <Link to="/profile" className="nav-link">Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
