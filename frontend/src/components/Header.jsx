import React from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  // A simple function to get a readable page title from the URL path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/transactions') return 'Transactions';
    if (path === '/budget') return 'Budget Management';
    if (path === '/analytics') return 'Analytics';
    if (path === '/ai-insights') return 'AI Insights';
    if (path === '/chatbot') return 'AI Assistant';
    if (path === '/profile') return 'My Profile';
    return 'Welcome';
  };

  return (
    <header className="header glass-card">
      <div className="header-left">
        <h2>{getPageTitle()}</h2>
      </div>
      <div className="header-right">
        {/* A simple placeholder for user profile */}
        <div className="user-profile">
          <div className="avatar">👤</div>
          <span className="username">Welcome Back</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
