import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin, user } = useAuth();

  console.log('AdminRoute check:', { isAuthenticated, isLoading, isAdmin, userRole: user?.role });

  if (isLoading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ marginBottom: '10px', fontSize: '24px' }}>🏋️‍♂️ FitX Admin</div>
        <div>Loading admin dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/admin-login" replace />;
  }

  // FIXED: Check isAdmin as boolean value, not function
  if (!isAdmin) {
    console.log('❌ Not admin user, redirecting to user dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ Admin access granted');
  return children;
};

export default AdminRoute;