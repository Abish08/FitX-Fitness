import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Login.css';

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Simple image paths from public folder
  const gymBackground = '/images/gym-background.jpg';
  const fitxLogo = '/images/FitxLogo.jpg';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      
      // Check if user already exists
      const userExists = existingUsers.find(user => 
        user.email.toLowerCase().trim() === data.email.toLowerCase().trim()
      );
      
      if (userExists) {
        setError('An account with this email already exists. Please login instead.');
        setLoading(false);
        return;
      }
      
      // Create new user data
      const newUser = {
        id: Date.now(), // Simple ID generation
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password, // In production, this should be hashed
        role: 'user', // Always user for this registration
        fitnessGoal: data.fitnessGoal || '',
        joinDate: new Date().toISOString(),
        membershipStatus: 'active',
        newsletter: data.newsletter || false,
        profileComplete: false
      };
      
      // Add to users array
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      
      console.log('User registered successfully:', newUser);
      console.log('All users now:', existingUsers);
      
      setSuccess(true);
      
      // Redirect to login page after success message
      setTimeout(() => {
        navigate('/');
      }, 2500);
      
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div 
        className="auth-background" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.8)), url(${gymBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="auth-container">
          <div className="auth-card">
            <div className="success-container">
              <div 
                className="fitx-logo"
                style={{
                  backgroundImage: `url(${fitxLogo})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
              <div className="success-icon">✅</div>
              <h2 className="success-title">Welcome to FitX!</h2>
              <p>Your account has been created successfully!</p>
              <p className="text-muted">Redirecting to login page...</p>
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
    <div 
      className="auth-background" 
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.8)), url(${gymBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div 
              className="fitx-logo"
              style={{
                backgroundImage: `url(${fitxLogo})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <h1 className="auth-title">JOIN FITX</h1>
            <p className="auth-subtitle">Start your transformation journey today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Error Message */}
            {error && (
              <div className="message message-error">
                {error}
              </div>
            )}

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
                placeholder="Enter your full name"
                className="form-input"
                disabled={loading}
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
                placeholder="Enter your email address"
                className="form-input"
                disabled={loading}
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
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, lowercase letter, and number'
                    }
                  })}
                  placeholder="Create a strong password"
                  className="form-input password-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
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
                  placeholder="Confirm your password"
                  className="form-input password-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Fitness Goal</label>
              <select 
                {...register('fitnessGoal')} 
                className="form-select"
                disabled={loading}
              >
                <option value="">Select your primary goal</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="endurance">Build Endurance</option>
                <option value="strength">Build Strength</option>
                <option value="general">General Fitness</option>
                <option value="flexibility">Improve Flexibility</option>
              </select>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                {...register('terms', { required: 'You must agree to continue' })}
                className="checkbox-input"
                disabled={loading}
              />
              <label className="checkbox-label">
                I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
              </label>
            </div>
            {errors.terms && <span className="field-error">{errors.terms.message}</span>}

            <div className="checkbox-group">
              <input
                type="checkbox"
                {...register('newsletter')}
                className="checkbox-input"
                disabled={loading}
              />
              <label className="checkbox-label">
                Send me workout tips and fitness updates (optional)
              </label>
            </div>

            <button type="submit" disabled={loading} className="auth-btn btn-primary">
              {loading ? 'Creating Your Account...' : 'Create My FitX Account'}
            </button>

            <div className="auth-links">
              Already have an account?{' '}
              <Link to="/" className="auth-link">
                <strong>Sign in here</strong>
              </Link>
            </div>

            <div className="auth-links">
              <Link to="/admin-register" className="auth-link">
                🔐 Administrator Registration
              </Link>
            </div>
          </form>

          <div className="auth-footer">
            © 2025 FitX Fitness. Your transformation begins here.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;