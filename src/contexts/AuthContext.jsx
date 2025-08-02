// import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import * as api from '../services/api';

// const AuthContext = createContext();

// // Initial state
// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   isLoading: true,
//   error: null,
// };

// // Reducer
// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_LOADING':
//       return { ...state, isLoading: action.payload };
//     case 'LOGIN_SUCCESS':
//       return {
//         ...state,
//         user: action.payload.user,
//         isAuthenticated: true,
//         isLoading: false,
//         error: null,
//       };
//     case 'LOGOUT':
//       return {
//         ...state,
//         user: null,
//         isAuthenticated: false,
//         isLoading: false,
//         error: null,
//       };
//     case 'SET_ERROR':
//       return {
//         ...state,
//         error: action.payload,
//         isLoading: false,
//       };
//     case 'CLEAR_ERROR':
//       return { ...state, error: null };
//     default:
//       return state;
//   }
// };

// // Auth Provider Component
// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);
//   const navigate = useNavigate();

//   // Check auth on app load
//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       dispatch({ type: 'SET_LOADING', payload: false });
//       return;
//     }

//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       console.log('🔍 Checking authentication with token...');

//       const response = await api.getCurrentUser();

//       if (response.success && response.data) {
//         console.log('✅ Auth check: User verified:', response.data.email);
//         dispatch({
//           type: 'LOGIN_SUCCESS',
//           payload: { user: response.data },
//         });
//       } else {
//         console.warn('❌ Auth check failed:', response.message);
//         handleLogout();
//       }
//     } catch (error) {
//       console.error('🚨 Auth check network error:', error);
//       handleLogout();
//     } finally {
//       dispatch({ type: 'SET_LOADING', payload: false });
//     }
//   };

//   // Login function
//   const login = async (credentials) => {
//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       dispatch({ type: 'CLEAR_ERROR' });

//       console.log('🔐 Attempting login for:', credentials.email);
//       const response = await api.login(credentials);

//       if (response.success && response.data?.user && response.data.token) {
//         const { user, token } = response.data;

//         // Save token
//         localStorage.setItem('token', token);

//         // Update state
//         dispatch({
//           type: 'LOGIN_SUCCESS',
//           payload: { user },
//         });

//         console.log('✅ Login successful:', user);

//         // Redirect based on role
//         if (user.role === 'admin') {
//           console.log('🏛️ Redirecting to /admin-dashboard');
//           navigate('/admin-dashboard', { replace: true });
//         } else {
//           console.log('👤 Redirecting to /dashboard');
//           navigate('/dashboard', { replace: true });
//         }

//         return { success: true };
//       } else {
//         const errorMsg = response.message || 'Login failed';
//         console.warn('❌ Login failed:', errorMsg);
//         dispatch({ type: 'SET_ERROR', payload: errorMsg });
//         return { success: false, error: errorMsg };
//       }
//     } catch (error) {
//       console.error('🚨 Login network error:', error);
//       const errorMsg = 'Network error. Please check your connection.';
//       dispatch({ type: 'SET_ERROR', payload: errorMsg });
//       return { success: false, error: errorMsg };
//     } finally {
//       dispatch({ type: 'SET_LOADING', payload: false });
//     }
//   };

//   // Register function
//   const register = async (userData) => {
//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       dispatch({ type: 'CLEAR_ERROR' });

//       console.log('📝 Registering user:', userData.email);
//       const response = await api.register(userData);

//       if (response.success && response.data?.user && response.data.token) {
//         const { user, token } = response.data;

//         localStorage.setItem('token', token);
//         dispatch({
//           type: 'LOGIN_SUCCESS',
//           payload: { user },
//         });

//         console.log('✅ Registration successful:', user);

//         if (user.role === 'admin') {
//           navigate('/admin-dashboard', { replace: true });
//         } else {
//           navigate('/dashboard', { replace: true });
//         }

//         return { success: true };
//       } else {
//         const errorMsg = response.message || 'Registration failed';
//         dispatch({ type: 'SET_ERROR', payload: errorMsg });
//         return { success: false, error: errorMsg };
//       }
//     } catch (error) {
//       console.error('🚨 Registration error:', error);
//       const errorMsg = 'Network error. Please try again.';
//       dispatch({ type: 'SET_ERROR', payload: errorMsg });
//       return { success: false, error: errorMsg };
//     } finally {
//       dispatch({ type: 'SET_LOADING', payload: false });
//     }
//   };

//   // Logout function
//   const logout = () => {
//     console.log('🚪 Logging out...');
//     localStorage.removeItem('token');
//     dispatch({ type: 'LOGOUT' });
//     // Use navigate instead of window.location to keep React Router clean
//     navigate('/login', { replace: true });
//   };

//   // Clear error
//   const clearError = () => {
//     dispatch({ type: 'CLEAR_ERROR' });
//   };

//   // Helper: Is current user admin?
//   const isAdmin = state.user?.role === 'admin';

//   // Context value
//   const value = {
//     user: state.user,
//     isAuthenticated: state.isAuthenticated,
//     isLoading: state.isLoading,
//     error: state.error,
//     isAdmin,
//     login,
//     register,
//     logout,
//     clearError,
//     checkAuth,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as true — wait for auth check
  error: null,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false, // Only set false after login
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

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Check auth on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    // No token → not authenticated
    if (!token) {
      console.log('🔐 No token found, user not authenticated');
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    console.log('🔍 Checking authentication with token...');

    try {
      const response = await api.getCurrentUser();

      if (response.success && response.data) {
        console.log('✅ Auth check: User verified:', response.data.email);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.data },
        });
      } else {
        console.warn('❌ Auth check failed:', response.message);
        handleLogout();
      }
    } catch (error) {
      console.error('🚨 Auth check network error:', error);
      handleLogout();
    } finally {
      // ✅ Only set loading to false after auth check completes
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      console.log('🔐 Attempting login for:', credentials.email);
      const response = await api.login(credentials);

      if (response.success && response.data?.user && response.data.token) {
        const { user, token } = response.data;

        // Save token
        localStorage.setItem('token', token);

        // Update state
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user },
        });

        console.log('✅ Login successful:', user);

        // Redirect based on role
        if (user.role === 'admin') {
          console.log('🏛️ Redirecting to /admin-dashboard');
          navigate('/admin-dashboard', { replace: true });
        } else {
          console.log('👤 Redirecting to /dashboard');
          navigate('/dashboard', { replace: true });
        }

        return { success: true };
      } else {
        const errorMsg = response.message || 'Login failed';
        console.warn('❌ Login failed:', errorMsg);
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('🚨 Login network error:', error);
      const errorMsg = 'Network error. Please check your connection.';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      console.log('📝 Registering user:', userData.email);
      const response = await api.register(userData);

      if (response.success && response.data?.user && response.data.token) {
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user },
        });

        console.log('✅ Registration successful:', user);

        if (user.role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }

        return { success: true };
      } else {
        const errorMsg = response.message || 'Registration failed';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('🚨 Registration error:', error);
      const errorMsg = 'Network error. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Logout function
  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    navigate('/login', { replace: true });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // ✅ Helper: Is current user admin?
  const isAdmin = state.user?.role === 'admin';

  // ✅ Context value
  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    isAdmin,
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

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};