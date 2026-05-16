import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

// The Layout component wraps our main application content
// It ensures the Sidebar and Header are always present,
// and displays the specific page content in the central area.
const Layout = ({ children, onLogout }) => {
  return (
    <div className="layout-container">
      <Sidebar onLogout={onLogout} />
      
      <div className="main-content-wrapper">
        <Header />
        
        {/* The children prop represents whichever page component is currently active */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
