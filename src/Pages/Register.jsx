import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../Styles/Login.css';
import FitxLogo from '../assets/image/FitxLogo.jpg';
import GymBackground from '../assets/image/gymbackground.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  // Use AuthContext
  const { register, isLoading, error, clearError, isAuthenticated, user } = useAuth();

  // Set CSS custom property for background image
  React.useEffect(() => {
    document.documentElement.style.setProperty('--gym-background-url', `url(${GymBackground})`);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'user') {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (error) clearError();
    if (passwordError) setPasswordError('');
  };

  // Validate passwords match
  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Use AuthContext register method
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (!validatePasswords()) {
      return;
    }

    console.log('📝 User registration attempt:', formData.email);
    
    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'user'
      });

      if (result.success) {
        console.log('✅ User registration successful');
        setSuccess(true);
        // AuthContext will automatically redirect based on user role
      } else {
        console.log('❌ User registration failed:', result.error);
      }
    } catch (error) {
      console.error('❌ User registration error:', error);
    }
  };

  // Success page
  if (success) {
    return (
      <div className="auth-background with-gym-bg">
        <div className="auth-container">
          <div className="auth-card">
            <div className="success-container">
              <img src={FitxLogo} alt="FitX Logo" className="fitx-logo-img" />
              <div className="success-icon">✅</div>
              <h2 className="success-title">Welcome to FitX!</h2>
              <p>Your account has been created successfully!</p>
              <p className="text-muted">Redirecting to dashboard...</p>
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
            <h1 className="auth-title">Join FitX</h1>
            <p className="auth-subtitle">Create your fitness journey account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="message message-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a unique username"
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className="form-input"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className="form-input"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className="form-input password-input"
                  required
                  disabled={isLoading}
                  minLength="6"
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

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={validatePasswords}
                  placeholder="Confirm your password"
                  className="form-input password-input"
                  required
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
              {passwordError && (
                <div className="field-error">{passwordError}</div>
              )}
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                className="checkbox-input"
                required
                disabled={isLoading}
              />
              <label htmlFor="terms" className="checkbox-label">
                I agree to the <Link to="/terms" className="auth-link">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="auth-link">Privacy Policy</Link>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !formData.email || !formData.password || !formData.username || passwordError} 
              className="auth-btn btn-primary"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-links">
              <Link to="/login" className="auth-link">
                Already have an account? Sign in here
              </Link>
            </div>

            <div className="auth-links">
              <Link to="/admin-register" className="auth-link admin-link">
                Register as Administrator →
              </Link>
            </div>
          </form>

          <div className="auth-footer">
            © 2025 FitX Fitness - Transform Your Body, Transform Your Life
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;