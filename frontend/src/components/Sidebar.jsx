import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-brand">
        <h2>💰 FMS</h2>
      </div>

      <nav className="sidebar-nav">
        {/* NavLink automatically adds 'active' class when the route matches */}
        <NavLink to="/dashboard" className="nav-item">
          <span className="icon">🏠</span>
          <span className="label">Dashboard</span>
        </NavLink>
        
        <NavLink to="/transactions" className="nav-item">
          <span className="icon">💳</span>
          <span className="label">Transactions</span>
        </NavLink>

        <NavLink to="/budget" className="nav-item">
          <span className="icon">📊</span>
          <span className="label">Budget</span>
        </NavLink>

        <NavLink to="/analytics" className="nav-item">
          <span className="icon">📈</span>
          <span className="label">Analytics</span>
        </NavLink>

        <NavLink to="/ai-insights" className="nav-item">
          <span className="icon">🤖</span>
          <span className="label">AI Insights</span>
        </NavLink>

        <NavLink to="/chatbot" className="nav-item">
          <span className="icon">💬</span>
          <span className="label">AI Assistant</span>
        </NavLink>
        
        <NavLink to="/profile" className="nav-item">
          <span className="icon">👤</span>
          <span className="label">Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span className="icon">🚪</span>
          <span className="label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
