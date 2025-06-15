import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (
      storedUser &&
      formData.email === storedUser.email &&
      formData.password === storedUser.password
    ) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-card">
          <div className="logo">💪</div>
          <h2>FitX Fitness</h2>
          <p>Welcome back! Sign in to continue your fitness journey</p>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <button type="submit">Sign In</button>

          <div className="signup-link">
            Don’t have an account? <a href="/register">Create one here</a>
          </div>

          <footer>© 2025 FitX Fitness. Transform your body, transform your life.</footer>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
