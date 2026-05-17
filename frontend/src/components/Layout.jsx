import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, onLogout }) => {
  // Desktop: sidebar open/collapsed toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Mobile: drawer open/closed
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Track whether we are on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Close drawer when resizing to desktop
      if (!mobile) setDrawerOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close drawer when navigating (clicking a link)
  const handleNavClick = () => {
    if (isMobile) setDrawerOpen(false);
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>

      {/* ── Desktop sidebar ── */}
      {!isMobile && (
        <Sidebar
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(p => !p)}
          onNavClick={handleNavClick}
        />
      )}

      {/* ── Mobile: overlay drawer ── */}
      {isMobile && (
        <>
          {/* Dark backdrop — tap to close */}
          {drawerOpen && (
            <div
              className="drawer-backdrop"
              onClick={() => setDrawerOpen(false)}
            />
          )}
          <div className={`mobile-drawer ${drawerOpen ? 'drawer-open' : ''}`}>
            <Sidebar
              onLogout={onLogout}
              isOpen={true}
              onToggle={() => setDrawerOpen(false)}
              onNavClick={handleNavClick}
              isMobileDrawer
            />
          </div>
        </>
      )}

      {/* ── Main content ── */}
      <div className="main-content-wrapper">
        {/* Mobile top bar with hamburger */}
        {isMobile && (
          <div className="mobile-topbar">
            <button
              className="hamburger-btn"
              onClick={() => setDrawerOpen(p => !p)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <span className="mobile-brand">💰 FMS</span>
          </div>
        )}

        <Header />

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
