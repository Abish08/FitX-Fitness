// // API Base URL
// const API_BASE_URL = 'http://localhost:5000/api';

// // Helper function to get token from localStorage
// const getToken = () => localStorage.getItem('token');

// // Helper function to set token in localStorage
// const setToken = (token) => localStorage.setItem('token', token);

// // Helper function to remove token from localStorage
// const removeToken = () => localStorage.removeItem('token');

// // Generic API request function
// const apiRequest = async (endpoint, options = {}) => {
//   const url = `${API_BASE_URL}${endpoint}`;
//   const token = getToken();

//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//     ...options,
//   };

//   // Add authorization header if token exists
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  
//   try {
//     const response = await fetch(url, config);
//     const data = await response.json();

//     console.log(`📡 API Response (${response.status}):`, data);

//     if (!response.ok) {
//       throw new Error(data.message || `HTTP error! status: ${response.status}`);
//     }

//     return {
//       success: true,
//       data: data.data || data,
//       message: data.message,
//     };
//   } catch (error) {
//     console.error(`❌ API Error (${endpoint}):`, error);
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// // Authentication API functions
// export const register = async (userData) => {
//   return apiRequest('/auth/register', {
//     method: 'POST',
//     body: JSON.stringify(userData),
//   });
// };

// export const login = async (credentials) => {
//   const response = await apiRequest('/auth/login', {
//     method: 'POST',
//     body: JSON.stringify(credentials),
//   });

//   // If login successful, store the token
//   if (response.success && response.data.token) {
//     setToken(response.data.token);
//     console.log('🔐 Token stored successfully');
//   }

//   return response;
// };

// export const logout = () => {
//   removeToken();
//   console.log('🚪 Token removed from localStorage');
//   return { success: true };
// };

// export const getCurrentUser = async () => {
//   return apiRequest('/auth/me');
// };

// // User API functions
// export const getUserProfile = async () => {
//   return apiRequest('/users/profile');
// };

// export const updateUserProfile = async (profileData) => {
//   return apiRequest('/users/profile', {
//     method: 'PUT',
//     body: JSON.stringify(profileData),
//   });
// };

// export const changePassword = async (passwordData) => {
//   return apiRequest('/users/change-password', {
//     method: 'PUT',
//     body: JSON.stringify(passwordData),
//   });
// };

// // Admin API functions
// export const getAllUsers = async () => {
//   return apiRequest('/admin/users');
// };

// export const deleteUser = async (userId) => {
//   return apiRequest(`/admin/users/${userId}`, {
//     method: 'DELETE',
//   });
// };

// export const updateUserRole = async (userId, role) => {
//   return apiRequest(`/admin/users/${userId}/role`, {
//     method: 'PUT',
//     body: JSON.stringify({ role }),
//   });
// };

// // Exercise API functions
// export const getExercises = async () => {
//   return apiRequest('/exercises');
// };

// export const createExercise = async (exerciseData) => {
//   return apiRequest('/exercises', {
//     method: 'POST',
//     body: JSON.stringify(exerciseData),
//   });
// };

// export const updateExercise = async (exerciseId, exerciseData) => {
//   return apiRequest(`/exercises/${exerciseId}`, {
//     method: 'PUT',
//     body: JSON.stringify(exerciseData),
//   });
// };

// export const deleteExercise = async (exerciseId) => {
//   return apiRequest(`/exercises/${exerciseId}`, {
//     method: 'DELETE',
//   });
// };

// // Workout API functions
// export const getWorkouts = async () => {
//   return apiRequest('/workouts');
// };

// export const createWorkout = async (workoutData) => {
//   return apiRequest('/workouts', {
//     method: 'POST',
//     body: JSON.stringify(workoutData),
//   });
// };

// export const updateWorkout = async (workoutId, workoutData) => {
//   return apiRequest(`/workouts/${workoutId}`, {
//     method: 'PUT',
//     body: JSON.stringify(workoutData),
//   });
// };

// export const deleteWorkout = async (workoutId) => {
//   return apiRequest(`/workouts/${workoutId}`, {
//     method: 'DELETE',
//   });
// };

// // Progress tracking API functions
// export const getProgress = async () => {
//   return apiRequest('/progress');
// };

// export const addProgress = async (progressData) => {
//   return apiRequest('/progress', {
//     method: 'POST',
//     body: JSON.stringify(progressData),
//   });
// };

// export const updateProgress = async (progressId, progressData) => {
//   return apiRequest(`/progress/${progressId}`, {
//     method: 'PUT',
//     body: JSON.stringify(progressData),
//   });
// };

// export const deleteProgress = async (progressId) => {
//   return apiRequest(`/progress/${progressId}`, {
//     method: 'DELETE',
//   });
// };

// // Health check
// export const healthCheck = async () => {
//   return apiRequest('/health');
// };

// // Export default object with all functions (for backward compatibility)
// const api = {
//   // Auth
//   register,
//   login,
//   logout,
//   getCurrentUser,
  
//   // Users
//   getUserProfile,
//   updateUserProfile,
//   changePassword,
  
//   // Admin
//   getAllUsers,
//   deleteUser,
//   updateUserRole,
  
//   // Exercises
//   getExercises,
//   createExercise,
//   updateExercise,
//   deleteExercise,
  
//   // Workouts
//   getWorkouts,
//   createWorkout,
//   updateWorkout,
//   deleteWorkout,
  
//   // Progress
//   getProgress,
//   addProgress,
//   updateProgress,
//   deleteProgress,
  
//   // Health
//   healthCheck,
  
//   // Utility
//   getToken,
//   setToken,
//   removeToken,
// };

// export default api;

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function to set token in localStorage
const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    console.log('🔐 Token saved to localStorage');
  }
};

// Helper function to remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
  console.log('🚪 Token removed from localStorage');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  console.log(`📎 Headers:`, { Authorization: config.headers.Authorization ? 'Bearer <present>' : 'missing' });

  try {
    const response = await fetch(url, config);

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('❌ Failed to parse JSON:', jsonError);
      return {
        success: false,
        error: 'Invalid JSON response from server',
        message: 'Server returned malformed data'
      };
    }

    console.log(`📡 API Response (${response.status}) ${endpoint}:`, data);

    // Handle HTTP errors
    if (!response.ok) {
      const errorMsg = data.message || `HTTP ${response.status}`;
      console.warn(`❌ HTTP ${response.status}:`, errorMsg);
      return {
        success: false,
        message: errorMsg,
        ...(data.error && { error: data.error })
      };
    }

    // Normalize response: prefer data.data, fallback to data
    return {
      success: true,
      data: data.data !== undefined ? data.data : data,
      message: data.message || null
    };
  } catch (error) {
    console.error(`🚨 Network error on ${endpoint}:`, error);
    return {
      success: false,
      error: error.message || 'Network error',
      message: 'Unable to connect to server. Check if backend is running.'
    };
  }
};

// Authentication API functions
export const register = async (userData) => {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  return response;
};

export const login = async (credentials) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });

  // Save token if login successful
  if (response.success && response.data?.token) {
    setToken(response.data.token);
  } else {
    console.warn('🔐 Login failed or no token received');
  }

  return response;
};

export const logout = () => {
  removeToken();
  return { success: true, message: 'Logged out successfully' };
};

export const getCurrentUser = async () => {
  return apiRequest('/auth/me');
};

// User API functions
export const getUserProfile = async () => {
  return apiRequest('/users/profile');
};

export const updateUserProfile = async (profileData) => {
  return apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};

export const changePassword = async (passwordData) => {
  return apiRequest('/users/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData)
  });
};

// Admin API functions
export const getAllUsers = async () => {
  return apiRequest('/admin/users');
};

export const deleteUser = async (userId) => {
  return apiRequest(`/admin/users/${userId}`, {
    method: 'DELETE'
  });
};

export const updateUserRole = async (userId, role) => {
  return apiRequest(`/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role })
  });
};

// Exercise API functions
export const getExercises = async () => {
  return apiRequest('/exercises');
};

export const createExercise = async (exerciseData) => {
  return apiRequest('/exercises', {
    method: 'POST',
    body: JSON.stringify(exerciseData)
  });
};

export const updateExercise = async (exerciseId, exerciseData) => {
  return apiRequest(`/exercises/${exerciseId}`, {
    method: 'PUT',
    body: JSON.stringify(exerciseData)
  });
};

export const deleteExercise = async (exerciseId) => {
  return apiRequest(`/exercises/${exerciseId}`, {
    method: 'DELETE'
  });
};

// Workout API functions
export const getWorkouts = async () => {
  return apiRequest('/workouts');
};

export const createWorkout = async (workoutData) => {
  return apiRequest('/workouts', {
    method: 'POST',
    body: JSON.stringify(workoutData)
  });
};

export const updateWorkout = async (workoutId, workoutData) => {
  return apiRequest(`/workouts/${workoutId}`, {
    method: 'PUT',
    body: JSON.stringify(workoutData)
  });
};

export const deleteWorkout = async (workoutId) => {
  return apiRequest(`/workouts/${workoutId}`, {
    method: 'DELETE'
  });
};

// Progress tracking API functions
export const getProgress = async () => {
  return apiRequest('/progress');
};

export const addProgress = async (progressData) => {
  return apiRequest('/progress', {
    method: 'POST',
    body: JSON.stringify(progressData)
  });
};

export const updateProgress = async (progressId, progressData) => {
  return apiRequest(`/progress/${progressId}`, {
    method: 'PUT',
    body: JSON.stringify(progressData)
  });
};

export const deleteProgress = async (progressId) => {
  return apiRequest(`/progress/${progressId}`, {
    method: 'DELETE'
  });
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health');
};

// Export default object (for backward compatibility)
const api = {
  // Auth
  register,
  login,
  logout,
  getCurrentUser,

  // Users
  getUserProfile,
  updateUserProfile,
  changePassword,

  // Admin
  getAllUsers,
  deleteUser,
  updateUserRole,

  // Exercises
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,

  // Workouts
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,

  // Progress
  getProgress,
  addProgress,
  updateProgress,
  deleteProgress,

  // Health
  healthCheck,

  // Utility
  getToken,
  setToken,
  removeToken,
};

export default api;