// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import '../Styles/Login.css';

// import FitxLogo from '../assets/image/FitxLogo.jpg';
// import GymBackground from '../assets/image/gymbackground.jpg';

// const AdminLogin = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
  
//   // Use AuthContext
//   const { login, isLoading, error, clearError, isAuthenticated, user } = useAuth();

//   // Set CSS custom property for background image
//   React.useEffect(() => {
//     document.documentElement.style.setProperty('--gym-background-url', `url(${GymBackground})`);
//   }, []);

//   // Check if admin is already logged in using AuthContext
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       if (user.role === 'admin') {
//         navigate('/admin-dashboard');
//       } else if (user.role === 'user') {
//         navigate('/dashboard');
//       }
//     }
//   }, [isAuthenticated, user, navigate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (error) clearError();
//   };

//   // Fill admin test credentials
//   const fillAdminCredentials = () => {
//     setFormData({
//       email: 'ayush@gmail.com',
//       password: 'ayush1234'
//     });
//   };

//   // Use AuthContext login method
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
    
//   //   console.log('🔐 Admin login attempt:', formData.email);
    
//   //   try {
//   //     const result = await login({
//   //       email: formData.email,
//   //       password: formData.password
//   //     });

//   //     if (result.success) {
//   //       console.log('✅ Admin login successful:', result.user);
        
//   //       // Check if user is admin
//   //       if (result.user.role === 'admin') {
//   //         console.log('🔑 Admin role confirmed, redirecting to admin dashboard');
//   //         navigate('/admin-dashboard');
//   //       } else {
//   //         console.log('❌ User is not admin, redirecting to user dashboard');
//   //         navigate('/dashboard');
//   //       }
//   //     } else {
//   //       console.log('❌ Admin login failed:', result.error);
//   //     }
//   //   } catch (error) {
//   //     console.error('❌ Admin login error:', error);
//   //   }
//   // };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const result = await login({
//       email: formData.email,
//       password: formData.password
//     });

//     if (result.success) {
//       if (result.user.role === 'admin') {
//         navigate('/admin-dashboard');
//       } else {
//         setError('Admin access only. Please log in with an admin account.');
//       }
//     } else {
//       setError(result.message || 'Login failed');
//     }
//   } catch (err) {
//     console.error('Login error:', err);
//     setError('An error occurred. Please check your network and try again.');
//   }
// };

//   return (
//     <div className="auth-background with-gym-bg">
//       <div className="auth-container">
//         <div className="auth-card">
//           <div className="auth-header">
//             <img src={FitxLogo} alt="FitX Logo" className="fitx-logo-img" />
//             <h1 className="auth-title">Admin Access</h1>
//             <p className="auth-subtitle">Platform Management Portal</p>
//           </div>

//           <form onSubmit={handleSubmit} className="auth-form">
//             {error && (
//               <div className="message message-error">
//                 {error}
//               </div>
//             )}

//             <div className="message message-info">
//               <strong>Demo Admin Account:</strong><br/>
//               ⚡ ayush@gmail.com<br/>
//               🔑 ayush1234
//               <button
//                 type="button"
//                 onClick={fillAdminCredentials}
//                 style={{
//                   display: 'block',
//                   margin: '8px auto 0',
//                   padding: '6px 12px',
//                   background: '#1565c0',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '6px',
//                   fontSize: '12px',
//                   cursor: 'pointer',
//                   fontWeight: '600'
//                 }}
//               >
//                 Fill Admin Data
//               </button>
//             </div>

//             <div className="form-group">
//               <label className="form-label">Admin Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="Enter admin email address"
//                 className="form-input"
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Admin Password</label>
//               <div className="password-input-container">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="Enter admin password"
//                   className="form-input password-input"
//                   required
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   className="password-toggle-btn"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={isLoading}
//                 >
//                   {showPassword ? '🙈' : '👁️'}
//                 </button>
//               </div>
//             </div>

//             <button 
//               type="submit" 
//               disabled={isLoading || !formData.email || !formData.password} 
//               className="auth-btn btn-primary"
//             >
//               {isLoading ? 'Signing In...' : 'Access Admin Panel'}
//             </button>

//             <div className="auth-links">
//               <Link to="/admin-register" className="auth-link">
//                 Register as Administrator
//               </Link>
//             </div>

//             <div className="auth-links">
//               <Link to="/login" className="auth-link">
//                 ← Regular User Login
//               </Link>
//             </div>
//           </form>

//           <div className="auth-footer">
//             © 2025 FitX Fitness - Administrator Portal
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;


// src/Pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../Styles/Login.css';

import FitxLogo from '../assets/image/FitxLogo.jpg';
import GymBackground from '../assets/image/gymbackground.jpg';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Use AuthContext
  const { login, isLoading, error, clearError } = useAuth();

  // Set background image
  React.useEffect(() => {
    document.documentElement.style.setProperty('--gym-background-url', `url(${GymBackground})`);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  // Fill demo admin credentials
  const fillAdminCredentials = () => {
    setFormData({
      email: 'ayush@gmail.com',
      password: 'ayush1234'
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(formData);

      if (!result.success) {
        console.log('❌ Login failed:', result.error);
        // Error is already set in context, but we can keep local display
      }
      // ✅ No manual redirect — handled by login() in AuthContext
    } catch (err) {
      console.error('🚨 Login error:', err);
      // Avoid setting error manually if context already handles it
    }
  };

  return (
    <div className="auth-background with-gym-bg">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <img src={FitxLogo} alt="FitX Logo" className="fitx-logo-img" />
            <h1 className="auth-title">Admin Access</h1>
            <p className="auth-subtitle">Platform Management Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="message message-error">
                {error}
              </div>
            )}

            <div className="message message-info">
              <strong>Demo Admin Account:</strong><br/>
              ⚡ ayush@gmail.com<br/>
              🔑 ayush1234
              <button
                type="button"
                onClick={fillAdminCredentials}
                style={{
                  display: 'block',
                  margin: '8px auto 0',
                  padding: '6px 12px',
                  background: '#1565c0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Fill Admin Data
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter admin email address"
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter admin password"
                  className="form-input password-input"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !formData.email || !formData.password} 
              className="auth-btn btn-primary"
            >
              {isLoading ? 'Signing In...' : 'Access Admin Panel'}
            </button>

            <div className="auth-links">
              <Link to="/admin-register" className="auth-link">
                Register as Administrator
              </Link>
            </div>

            <div className="auth-links">
              <Link to="/login" className="auth-link">
                ← Regular User Login
              </Link>
            </div>
          </form>

          <div className="auth-footer">
            © 2025 FitX Fitness - Administrator Portal
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;