import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Login.css';
// Import your images
import FitxLogo from '../assets/image/FitxLogo.jpg';
import GymBackground from '../assets/image/gymbackground.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Set CSS custom property for background image
  React.useEffect(() => {
    document.documentElement.style.setProperty('--gym-background-url', `url(${GymBackground})`);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email.trim() && email.includes('@')) {
        setSent(true);
      } else {
        setError('Please enter a valid email address');
      }
      setLoading(false);
    }, 1500);
  };

  const handleResend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (sent) {
    return (
      <div className="auth-background with-gym-bg">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <span className="auth-logo">📧</span>
              <h1 className="auth-title">Check Your Email</h1>
              <p className="auth-subtitle">We've sent you a reset link</p>
            </div>

            <div className="success-container">
              <p>We've sent a password reset link to:</p>
              <div className="email-highlight">{email}</div>
              <p className="text-muted">
                Click the link in the email to reset your password. 
                If you don't see it, check your spam folder.
              </p>

              <div className="forgot-password-actions">
                <button 
                  onClick={handleResend}
                  disabled={loading}
                  className="auth-btn btn-secondary"
                >
                  {loading ? 'Resending...' : 'Resend Email'}
                </button>
                
                <Link to="/" className="back-link">
                  Back to Sign In
                </Link>
              </div>

              <div className="message message-info forgot-password-security">
                🔒 For security, this link will expire in 24 hours
              </div>
            </div>

            <div className="auth-footer">
              © 2025 FitX Fitness. Transform your body, transform your life.
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
            <span className="auth-logo">🔐</span>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">No worries, we'll help you get back in</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="message message-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your email address"
                className="form-input"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !email.trim()}
              className="auth-btn btn-primary"
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>

            <div className="auth-links">
              <Link to="/" className="auth-link">
                ← Back to Sign In
              </Link>
            </div>

            <div className="auth-links">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create one here
              </Link>
            </div>
          </form>

          <div className="message message-info forgot-password-security">
            🔒 We take your security seriously. Reset links are encrypted and expire automatically.
          </div>

          <div className="auth-footer">
            © 2025 FitX Fitness. Transform your body, transform your life.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;