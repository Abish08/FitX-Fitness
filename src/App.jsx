import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';

import Signup from "./Pages/Register";
import Login from "./Pages/Login";
import AdminLogin from "./Pages/AdminLogin";
import AdminRegister from "./Pages/AdminRegister";
import ForgotPassword from "./Pages/ForgotPassword";

// User Pages
import Dashboard from "./Pages/Dashboard";
import ExerciseLibrary from "./Pages/ExerciseLibrary";
import ProgressTracking from "./Pages/ProgressTracking";
import UserProfile from "./Pages/UserProfile";
import WorkoutPlans from "./Pages/WorkoutPlans";
import SystemSettings from "./Pages/SystemSettings";

// Admin Pages
import AdminDashboard from "./Pages/AdminDashboard";
import AdminExerciseLibrary from "./Pages/AdminExerciseLibrary";
import AdminSystemSettings from "./Pages/SystemSettings";

// Route Protection Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
       
        {/* Admin Authentication Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
       
        {/* User Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercise-library"
          element={
            <ProtectedRoute>
              <ExerciseLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress-tracking"
          element={
            <ProtectedRoute>
              <ProgressTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workout-plans"
          element={
            <ProtectedRoute>
              <WorkoutPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-settings"
          element={
            <ProtectedRoute>
              <SystemSettings />
            </ProtectedRoute>
          }
        />
       
        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/exercise-library"
          element={
            <AdminRoute>
              <AdminExerciseLibrary />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/system-settings"
          element={
            <AdminRoute>
              <AdminSystemSettings />
            </AdminRoute>
          }
        />
       
        {/* Fallback Routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;