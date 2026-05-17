import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

/**
 * isOpen        — expanded (labels visible) vs collapsed (icons only) — desktop
 * onToggle      — called when toggle/close button is clicked
 * onNavClick    — called when a nav link is clicked (closes mobile drawer)
 * isMobileDrawer — true when rendered inside the mobile slide-in drawer
 */
const Sidebar = ({ onLogout, isOpen, onToggle, onNavClick, isMobileDrawer = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard',    icon: '🏠', label: 'Dashboard'   },
    { to: '/transactions', icon: '💳', label: 'Transactions' },
    { to: '/budget',       icon: '📊', label: 'Budget'       },
    { to: '/analytics',    icon: '📈', label: 'Analytics'    },
    { to: '/ai-insights',  icon: '🤖', label: 'AI Insights'  },
    { to: '/chatbot',      icon: '💬', label: 'AI Assistant' },
    { to: '/profile',      icon: '👤', label: 'Profile'      },
  ];

  return (
    <aside className={`sidebar glass-card ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

      {/* ── Brand + toggle ── */}
      <div className="sidebar-brand">
        {isOpen && <h2>💰 FMS</h2>}

        <button
          className="sidebar-toggle-btn"
          onClick={onToggle}
          title={isMobileDrawer ? 'Close menu' : (isOpen ? 'Collapse' : 'Expand')}
          aria-label={isMobileDrawer ? 'Close menu' : (isOpen ? 'Collapse sidebar' : 'Expand sidebar')}
        >
          {/* Mobile drawer shows ✕, desktop shows ◀ / ▶ */}
          {isMobileDrawer ? '✕' : (isOpen ? '◀' : '▶')}
        </button>
      </div>

      {/* ── Nav links ── */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="nav-item"
            title={!isOpen ? label : undefined}
            onClick={onNavClick}
          >
            <span className="icon">{icon}</span>
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
