import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

// isOpen  — whether the sidebar is expanded (shows labels) or collapsed (icons only)
// onToggle — called when the user clicks the toggle button
const Sidebar = ({ onLogout, isOpen, onToggle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard',    icon: '🏠', label: 'Dashboard'    },
    { to: '/transactions', icon: '💳', label: 'Transactions'  },
    { to: '/budget',       icon: '📊', label: 'Budget'        },
    { to: '/analytics',    icon: '📈', label: 'Analytics'     },
    { to: '/ai-insights',  icon: '🤖', label: 'AI Insights'   },
    { to: '/chatbot',      icon: '💬', label: 'AI Assistant'  },
    { to: '/profile',      icon: '👤', label: 'Profile'       },
  ];

  return (
    <aside className={`sidebar glass-card ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

      {/* ── Brand + Toggle button ── */}
      <div className="sidebar-brand">
        {isOpen && <h2>💰 FMS</h2>}

        {/* Toggle button — always visible */}
        <button
          className="sidebar-toggle-btn"
          onClick={onToggle}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* ── Navigation links ── */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="nav-item"
            title={!isOpen ? label : undefined}  /* tooltip when collapsed */
          >
            <span className="icon">{icon}</span>
            {/* Label only shown when sidebar is open */}
            {isOpen && <span className="label">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className="logout-btn"
          title={!isOpen ? 'Logout' : undefined}
        >
          <span className="icon">🚪</span>
          {isOpen && <span className="label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
