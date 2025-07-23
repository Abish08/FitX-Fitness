import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import AdminDashboard from './Pages/AdminDashboard';
import ForgotPassword from './Pages/ForgotPassword';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <div className="fade-in">{children}</div>;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user) {
    // Redirect based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <div className="fade-in">{children}</div>;
};

// Authentication Guard - checks if user should be redirected on app load
const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // If user is logged in and on login page, redirect to appropriate dashboard
    if (user && location.pathname === '/') {
      if (user.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate, location]);

  return children;
};

function App() {
  return (
    <div className="app">
      <AuthGuard>
        <Routes>
          {/* Public Routes - Redirect to appropriate dashboard if already logged in */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          
          {/* Role-based Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthGuard>
    </div>
  );
}

export default App;