import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

// Scroll to top on every page navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Pages
import Signup from './pages/Signup';
import Login from './pages/Login_IMPROVED';
import Dashboard from './pages/Dashboard_IMPROVED';
import Profile from './pages/Profile';
import TransactionsPage from './pages/TransactionsPage';
import BudgetPage from './pages/BudgetPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AIInsightsPage from './pages/AIInsightsPage';
import ChatbotPage from './pages/ChatbotPage';

// Components
import Breadcrumbs from './components/Breadcrumbs';
import Layout from './components/Layout';

// Protected Route Wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  return token ? (
    <Layout onLogout={handleLogout}>
      {children}
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Scroll to top on every navigation */}
      <ScrollToTop />

      {/* Global Breadcrumbs */}
      <Breadcrumbs />

      <Routes>
        {/* Redirect Root */}
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        {/* Public Routes */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Protected Transactions Page */}
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <TransactionsPage />
            </PrivateRoute>
          }
        />

        {/* Protected Budget Page */}
        <Route
          path="/budget"
          element={
            <PrivateRoute>
              <BudgetPage />
            </PrivateRoute>
          }
        />

        {/* Protected Analytics Page */}
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <AnalyticsPage />
            </PrivateRoute>
          }
        />

        {/* Protected AI Insights Page */}
        <Route
          path="/ai-insights"
          element={
            <PrivateRoute>
              <AIInsightsPage />
            </PrivateRoute>
          }
        />

        {/* Protected Chatbot Page */}
        <Route
          path="/chatbot"
          element={
            <PrivateRoute>
              <ChatbotPage />
            </PrivateRoute>
          }
        />

        {/* Protected Profile */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <h2
              style={{
                textAlign: 'center',
                marginTop: '50px',
              }}
            >
              404 Page Not Found
            </h2>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;