import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

// Layout manages the sidebar collapsed/expanded state
// and passes it down so both Sidebar and the content area
// can adjust themselves accordingly.
const Layout = ({ children, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <Sidebar
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />

      {/* Main content shifts right when sidebar is open, fills space when collapsed */}
      <div className="main-content-wrapper">
        <Header />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
