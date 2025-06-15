import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    navigate('/dashboard');
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <form onSubmit={handleSubmit(onSubmit)} className="login-card">
          <div className="logo">📝</div>
          <h2>Create Your FitX Account</h2>
          <p>Start your fitness journey with us!</p>

          <label>Full Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            placeholder="John Doe"
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}

          <label>Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            placeholder="you@example.com"
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

          <label>Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' }
            })}
            placeholder="******"
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

          <button type="submit">Register</button>

          <div className="signup-link">
            Already have an account? <a href="/">Login</a>
          </div>

          <footer>© 2025 FitX Fitness. Your transformation begins here.</footer>
        </form>
      </div>
    </div>
  );
}

export default Register;
