import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // FIXED: Use AuthContext
import '../Styles/Login.css';
import FitxLogo from '../assets/image/FitxLogo.jpg';
import GymBackground from '../assets/image/gymbackground.jpg';

function AdminRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // FIXED: Use AuthContext
  const { register: registerUser, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  React.useEffect(() => {
    document.documentElement.style.setProperty('--gym-background-url', `url(${GymBackground})`);
  }, []);

  // FIXED: Use AuthContext register method
  const onSubmit = async (data) => {
    if (error) clearError();
    
    console.log('📝 Admin registration attempt:', data.email);
    
    try {
      const result = await registerUser({
        username: data.name.toLowerCase().replace(/\s+/g, ''), // Create username from name
        email: data.email,
        password: data.password,
        firstName: data.name.split(' ')[0] || data.name,
        lastName: data.name.split(' ').slice(1).join(' ') || '',
        role: 'admin' // FIXED: Set admin role
      });

      if (result.success) {
        console.log('✅ Admin registration successful:', result.user);
        setSuccess(true);
        
        // Redirect to admin login page after success
        setTimeout(() => {
          navigate('/admin-login');
        }, 2500);
      } else {
        console.log('❌ Admin registration failed:', result.error);
      }
    } catch (err) {
      console.error('❌ Admin registration error:', err);
    }
  };

  if (success) {
    return (
      <div className="auth-background with-gym-bg">
        <div className="auth-container">
          <div className="auth-card">
            <div className="success-container">
              <img src={FitxLogo} alt="FitX Logo" className="fitx-logo-img" />
              <div className="success-icon">⚡</div>
              <h2 className="success-title">Admin Account Created!</h2>
              <p>Your administrator account has been created successfully!</p>
              <p className="text-muted">Redirecting to admin login...</p>
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-background with-gym-bg">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <img src={FitxLogo} alt="FitX Logo" className="fitx-logo-img" />
            <h1 className="auth-title">Admin Registration</h1>
            <p className="auth-subtitle">Create Administrator Account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {error && (
              <div className="message message-error">
                {error}
              </div>
            )}

            <div className="message message-info">
              <strong>⚠️ Administrator Registration</strong><br/>
              This will create an admin account with platform management privileges.
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                {...register('name', { 
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 50, message: 'Name must be less than 50 characters' },
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: 'Name can only contain letters and spaces'
                  }
                })}
                placeholder="Enter administrator full name"
                className="form-input"
                disabled={isLoading}
              />
              {errors.name && <span className="field-error">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                placeholder="Enter admin email address"
                className="form-input"
                disabled={isLoading}
              />
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Admin password must be at least 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain uppercase, lowercase, and number'
                    }
                  })}
                  placeholder="Create a strong admin password"
                  className="form-input password-input"
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
              {errors.password && <span className="field-error">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  placeholder="Confirm admin password"
                  className="form-input password-input"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                {...register('terms', { required: 'You must agree to continue' })}
                className="checkbox-input"
                disabled={isLoading}
              />
              <label className="checkbox-label">
                I agree to the <strong>Administrator Terms</strong> and understand the responsibilities
              </label>
            </div>
            {errors.terms && <span className="field-error">{errors.terms.message}</span>}

            <button type="submit" disabled={isLoading} className="auth-btn btn-primary">
              {isLoading ? 'Creating Admin Account...' : 'Create Administrator Account'}
            </button>

            <div className="auth-links">
              Already have an admin account?{' '}
              <Link to="/admin-login" className="auth-link">
                <strong>Admin Login</strong>
              </Link>
            </div>

            <div className="auth-links">
              <Link to="/register" className="auth-link">
                ← Regular User Registration
              </Link>
            </div>
          </form>

          <div className="auth-footer">
            © 2025 FitX Fitness - Administrator Registration
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;