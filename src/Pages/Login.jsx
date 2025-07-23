import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Simple image paths from public folder
  const gymBackground = '/images/gym-background.jpg';
  const fitxLogo = '/images/FitxLogo.jpg';

  // Check if user is already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'user') {
      navigate('/dashboard');
    } else if (user && user.role === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authentication process
    setTimeout(() => {
      // Get all registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      
      console.log('Attempting login for:', formData.email);
      console.log('All registered users:', registeredUsers);
      
      // Find user with matching email and password
      const foundUser = registeredUsers.find(user => 
        user.email.toLowerCase().trim() === formData.email.toLowerCase().trim() && 
        user.password === formData.password
      );
      
      console.log('Found user:', foundUser);
      
      if (foundUser) {
        // Successful login - set user session
        const userSession = {
          id: foundUser.id || Date.now(),
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          fitnessGoal: foundUser.fitnessGoal,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(userSession));
        console.log('Login successful, redirecting...');
        
        // Redirect based on role
        if (foundUser.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Check demo accounts as fallback
        if (formData.email === 'user@fitx.com' && formData.password === 'user123') {
          const demoUser = {
            id: 'demo-user',
            name: 'Demo User',
            email: 'user@fitx.com',
            role: 'user',
            loginTime: new Date().toISOString()
          };
          localStorage.setItem('user', JSON.stringify(demoUser));
          navigate('/dashboard');
        } else if (formData.email === 'admin@fitx.com' && formData.password === 'admin123') {
          const demoAdmin = {
            id: 'demo-admin',
            name: 'Demo Admin',
            email: 'admin@fitx.com',
            role: 'admin',
            loginTime: new Date().toISOString()
          };
          localStorage.setItem('user', JSON.stringify(demoAdmin));
          navigate('/admin-dashboard');
        } else {
          console.log('Login failed - no matching user found');
          setError('Invalid credentials. Please check your email and password or register first.');
        }
      }
      setLoading(false);
    }, 1500);
  };

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
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue your fitness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="message message-error">
                {error}
              </div>
            )}

            <div className="message message-info">
              <strong>Demo Account:</strong><br/>
              📧 user@fitx.com<br/>
              🔑 user123
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
                disabled={loading}
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
                  placeholder="Enter your password"
                  className="form-input password-input"
                  required
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
            </div>

            <button type="submit" disabled={loading || !formData.email || !formData.password} className="auth-btn btn-primary">
              {loading ? 'Signing In...' : 'Sign In to FitX'}
            </button>

            <div className="auth-links">
              <Link to="/forgot-password" className="auth-link">
                Forgot your password?
              </Link>
            </div>

            <div className="auth-links">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                <strong>Create one here</strong>
              </Link>
            </div>

            <div className="auth-links">
              <Link to="/admin-login" className="auth-link">
                🔐 Administrator Login
              </Link>
            </div>
          </form>

          <div className="auth-footer">
            © 2025 FitX Fitness. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;