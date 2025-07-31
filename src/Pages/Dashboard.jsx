import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // FIXED: Use AuthContext
import DashboardCalendar from './DashboardCalendar';
import '../Styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading, checkAuth } = useAuth(); // FIXED: Use auth context
  const [stats, setStats] = useState({
    programCompletion: 68,
    caloriesBurned: 1234,
    workoutsThisMonth: 15,
    avgWorkoutTime: 45
  });

  // FIXED: Use AuthContext instead of localStorage
  useEffect(() => {
    // Check authentication status
    if (!isAuthenticated && !isLoading) {
      // Try to load user if there's a token
      if (localStorage.getItem('token')) {
        checkAuth();
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, navigate, checkAuth]);

  // FIXED: Handle logout using AuthContext
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation handlers
  const navigateTo = (path) => {
    navigate(path);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // FIXED: Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // FIXED: Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Enhanced Navigation Header */}
      <header className="dashboard-header-nav">
        <div className="nav-container">
          {/* Brand Section */}
          <div className="nav-brand">
            <div className="brand-icon">🦊</div>
            <div className="brand-text">
              <h1 className="brand-title">FitX Fitness</h1>
              <span className="brand-subtitle">Transform Your Life</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="nav-menu">
            <button 
              onClick={() => navigateTo('/workout-plans')} 
              className="nav-item"
              title="Browse Workouts"
            >
              <span className="nav-icon">💪</span>
              <span className="nav-text">Workouts</span>
            </button>
            <button 
              onClick={() => navigateTo('/exercise-library')} 
              className="nav-item"
              title="Exercise Library"
            >
              <span className="nav-icon">📺</span>
              <span className="nav-text">Exercises</span>
            </button>
            <button 
              onClick={() => navigateTo('/progress-tracking')} 
              className="nav-item"
              title="Track Progress"
            >
              <span className="nav-icon">📈</span>
              <span className="nav-text">Progress</span>
            </button>
            <button 
              onClick={() => navigateTo('/user-profile')} 
              className="nav-item"
              title="User Profile"
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </button>
          </nav>

          {/* User Section - FIXED: Use user from AuthContext */}
          <div className="nav-user-section">
            <div className="user-info">
              <div className="user-avatar">
                {(user.firstName || user.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">
                  Welcome, {user.firstName || user.username || 'User'}
                </span>
                <span className="user-status">{user.role === 'admin' ? 'Admin' : 'Premium Member'}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Hero Section - FIXED: Use user from AuthContext */}
        <section className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">
              {getGreeting()}, {user.firstName || user.username || 'User'}! 👋
            </h2>
            <p className="hero-subtitle">
              Here's your fitness overview for today. Keep pushing towards your goals!
            </p>
          </div>
          <div className="hero-actions">
            <button 
              onClick={() => navigateTo('/workout-plans')} 
              className="cta-button primary"
            >
              <span className="cta-icon">🔥</span>
              <span className="cta-text">Start Workout</span>
            </button>
            <button 
              onClick={() => navigateTo('/progress-tracking')} 
              className="cta-button secondary"
            >
              <span className="cta-icon">📊</span>
              <span className="cta-text">View Progress</span>
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <h3 className="section-title">Today's Overview</h3>
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>{stats.programCompletion}%</h3>
                <p>Program Completion</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${stats.programCompletion}%`}}
                  ></div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <h3>{stats.caloriesBurned.toLocaleString()}</h3>
                <p>Calories Burned</p>
                <span className="stat-change positive">+12% from yesterday</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💪</div>
              <div className="stat-content">
                <h3>{stats.workoutsThisMonth}</h3>
                <p>Workouts This Month</p>
                <span className="stat-change positive">+3 from last month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <h3>{stats.avgWorkoutTime}m</h3>
                <p>Avg Workout Time</p>
                <span className="stat-change neutral">Same as last week</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Calendar Section */}
        <DashboardCalendar />

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          {/* Fitness Status */}
          <div className="fitness-status">
            <div className="section-header">
              <h3>My Fitness Status</h3>
              <button 
                onClick={() => navigateTo('/progress-tracking')} 
                className="view-more-btn"
              >
                View Details
              </button>
            </div>
            
            <div className="status-grid">
              <div className="status-item">
                <div className="status-icon">⚖️</div>
                <div className="status-info">
                  <div className="status-label">Current Weight</div>
                  <div className="status-value">165 lbs</div>
                  <div className="status-progress">
                    <span className="progress-text">10 lbs to goal</span>
                  </div>
                </div>
              </div>

              <div className="status-item">
                <div className="status-icon">🎯</div>
                <div className="status-info">
                  <div className="status-label">Goal Weight</div>
                  <div className="status-value">155 lbs</div>
                  <div className="status-progress">
                    <span className="progress-text">Target: Dec 2025</span>
                  </div>
                </div>
              </div>

              <div className="status-item">
                <div className="status-icon">📊</div>
                <div className="status-info">
                  <div className="status-label">BMI</div>
                  <div className="status-value">23.4</div>
                  <div className="status-progress">
                    <span className="progress-text status-good">Normal Range</span>
                  </div>
                </div>
              </div>

              <div className="status-item">
                <div className="status-icon">💧</div>
                <div className="status-info">
                  <div className="status-label">Water Intake</div>
                  <div className="status-value">6/8 glasses</div>
                  <div className="status-progress">
                    <span className="progress-text">2 more to go!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Programs */}
          <div className="featured-programs">
            <div className="section-header">
              <h3>Featured Programs</h3>
              <button 
                onClick={() => navigateTo('/workout-plans')} 
                className="view-all-btn"
              >
                View All Programs
              </button>
            </div>
            
            <div className="programs-list">
              <div className="program-card featured">
                <div className="program-badge">FEATURED</div>
                <div className="program-icon">🔥</div>
                <div className="program-content">
                  <h4>Full Body HIIT Challenge</h4>
                  <p className="program-details">Intermediate • 4 weeks</p>
                  <p className="program-participants">1,234 active participants</p>
                  <div className="program-tags">
                    <span className="tag">Fat Burn</span>
                    <span className="tag">Strength</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigateTo('/workout-plans')} 
                  className="start-btn"
                >
                  Start Now
                </button>
              </div>

              <div className="program-card">
                <div className="program-icon">💪</div>
                <div className="program-content">
                  <h4>Beginner's Strength Journey</h4>
                  <p className="program-details">Beginner • 6 weeks</p>
                  <p className="program-participants">892 active participants</p>
                  <div className="program-tags">
                    <span className="tag">Beginner</span>
                    <span className="tag">Strength</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigateTo('/workout-plans')} 
                  className="start-btn secondary"
                >
                  Start
                </button>
              </div>

              <div className="program-card">
                <div className="program-icon">🧘</div>
                <div className="program-content">
                  <h4>Flexibility & Recovery</h4>
                  <p className="program-details">All Levels • 3 weeks</p>
                  <p className="program-participants">567 active participants</p>
                  <div className="program-tags">
                    <span className="tag">Recovery</span>
                    <span className="tag">Mobility</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigateTo('/workout-plans')} 
                  className="start-btn secondary"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;