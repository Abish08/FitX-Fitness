import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      console.log('🔍 Checking authentication with token...');
      const response = await api.getCurrentUser();
      
      if (response.success && response.data) {
        console.log('✅ User authenticated:', response.data);
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: response.data } 
        });
      } else {
        console.log('❌ Authentication failed, clearing token');
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (credentials, isAdmin = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      console.log('🔐 Attempting login:', { email: credentials.email, isAdmin });
      
      const response = await api.login(credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        console.log('✅ Login successful:', { user: user.email, role: user.role });
        
        // Store token
        localStorage.setItem('token', token);
        
        // Update state
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user } 
        });

        // Navigate based on role
        if (user.role === 'admin') {
          console.log('🏛️ Redirecting to admin dashboard');
          navigate('/admin-dashboard', { replace: true });
        } else {
          console.log('👤 Redirecting to user dashboard');
          navigate('/dashboard', { replace: true });
        }

        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error.message || 'Login failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      console.log('📝 Attempting registration:', { email: userData.email, role: userData.role });
      
      const response = await api.register(userData);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        console.log('✅ Registration successful:', { user: user.email, role: user.role });
        
        // Store token
        localStorage.setItem('token', token);
        
        // Update state
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user } 
        });

        // Navigate based on role
        if (user.role === 'admin') {
          console.log('🏛️ Redirecting to admin dashboard');
          navigate('/admin-dashboard', { replace: true });
        } else {
          console.log('👤 Redirecting to user dashboard');
          navigate('/dashboard', { replace: true });
        }

        return { success: true };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    try {
      console.log('🚪 Logging out user...');
      
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      // Update state
      dispatch({ type: 'LOGOUT' });
      
      // Force navigation to login page
      window.location.href = '/login';
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force navigation even if there's an error
      window.location.href = '/login';
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Helper function to check if user is admin
  const isAdmin = state.user?.role === 'admin';

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    isAdmin, // Boolean value, not function
    login,
    register,
    logout,
    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};