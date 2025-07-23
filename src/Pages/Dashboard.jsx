import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Dashboard.css';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('SUN');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Different content based on user role
  const isAdmin = user?.role === 'admin';

  const workoutCategories = [
    'Workout Plans',
    'Exercise Library', 
    'Progress Tracking',
    'Nutrition Plans',
    'Membership Plans',
    'User Management',
    'Analytics Dashboard'
  ];

  const featuredContent = [
    {
      title: "Full Body HIIT Challenge",
      subtitle: "FEATURED PROGRAM",
      description: "4-week intensive program to burn fat and build strength",
      image: "🔥",
      difficulty: "Intermediate",
      duration: "4 weeks",
      participants: "1,234 active"
    },
    {
      title: "Beginner's Strength Journey",
      subtitle: "STRENGTH BUILDING",
      description: "Perfect introduction to weight training fundamentals",
      image: "💪",
      difficulty: "Beginner",
      duration: "6 weeks",
      participants: "892 active"
    },
    {
      title: "Flexibility & Recovery",
      subtitle: "WELLNESS",
      description: "Improve mobility and reduce injury risk",
      image: "🧘",
      difficulty: "All Levels",
      duration: "3 weeks",
      participants: "567 active"
    }
  ];

  const todaysSchedule = isAdmin ? [
    { time: "09:00 AM", activity: "Review User Analytics", type: "Admin Task", status: "pending" },
    { time: "11:00 AM", activity: "Update Exercise Database", type: "Content Management", status: "pending" },
    { time: "02:00 PM", activity: "Member Support Session", type: "User Management", status: "scheduled" },
    { time: "04:00 PM", activity: "Create New Workout Plan", type: "Content Creation", status: "pending" }
  ] : [
    { time: "07:00 AM", activity: "Morning Cardio Blast", type: "HIIT Training", status: "completed" },
    { time: "12:00 PM", activity: "Nutrition Check-in", type: "Meal Planning", status: "pending" },
    { time: "06:00 PM", activity: "Strength Training", type: "Weight Training", status: "scheduled" },
    { time: "08:00 PM", activity: "Progress Photo Upload", type: "Tracking", status: "pending" }
  ];

  const quickStats = isAdmin ? [
    { label: 'Total Users', value: '2,847', icon: '👥', change: '+12%' },
    { label: 'Active Programs', value: '43', icon: '📋', change: '+5%' },
    { label: 'This Month Revenue', value: '$28,450', icon: '💰', change: '+18%' },
    { label: 'Completion Rate', value: '87%', icon: '📊', change: '+3%' }
  ] : [
    { label: 'Workouts This Week', value: '5', icon: '💪', change: '+2' },
    { label: 'Current Streak', value: '12 Days', icon: '🔥', change: '+1' },
    { label: 'Weight Progress', value: '-3.2 lbs', icon: '⚖️', change: '-0.5' },
    { label: 'Program Completion', value: '68%', icon: '🎯', change: '+15%' }
  ];

  return (
    <div className="dashboard-container">
      {/* Navigation Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <span className="header-logo-icon">💪</span>
            <h1 className="header-title">FitX Fitness</h1>
          </div>
          
          <nav className="header-nav">
            <a href="#workouts" className="nav-link">Workouts</a>
            <a href="#programs" className="nav-link">Programs</a>
            <a href="#nutrition" className="nav-link">Nutrition</a>
            <a href="#community" className="nav-link">Community</a>
            {isAdmin && <a href="#admin" className="nav-link admin-link">Admin Panel</a>}
          </nav>

          <div className="header-user">
            <span className="user-welcome">Hi {user?.name || 'User'}!</span>
            {isAdmin && <span className="admin-badge">Admin</span>}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-section">
            <h3>Quick Access</h3>
            <ul className="sidebar-menu">
              {workoutCategories.map((category, index) => (
                <li key={index} className="sidebar-item">
                  <a href={`#${category.toLowerCase().replace(/\s+/g, '-')}`} className="sidebar-link">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>My Fitness</h3>
            <div className="fitness-summary">
              <div className="summary-item">
                <span className="summary-label">Current Weight</span>
                <span className="summary-value">165 lbs</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Goal Weight</span>
                <span className="summary-value">155 lbs</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">BMI</span>
                <span className="summary-value">23.4</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Welcome Banner */}
          <section className="welcome-banner">
            <div className="banner-content">
              <h2>Welcome back, {user?.name}! 💪</h2>
              <p>{isAdmin ? 'Manage your fitness platform and help users achieve their goals.' : 'Ready to crush your fitness goals today?'}</p>
            </div>
            <div className="banner-action">
              <button className="cta-button">
                {isAdmin ? 'View Analytics Dashboard' : 'Start Today\'s Workout'}
              </button>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="stats-section">
            <div className="stats-grid">
              {quickStats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">{stat.icon}</span>
                    <span className="stat-change positive">{stat.change}</span>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="content-grid">
            {/* This Week Schedule */}
            <section className="schedule-section">
              <div className="section-header">
                <h3>This Week</h3>
                <button className="view-calendar">Calendar View</button>
              </div>
              
              <div className="week-selector">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    className={`day-button ${activeDay === day ? 'active' : ''}`}
                    onClick={() => setActiveDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="schedule-content">
                <h4>{currentDay} Schedule</h4>
                {todaysSchedule.length > 0 ? (
                  <div className="schedule-list">
                    {todaysSchedule.map((item, index) => (
                      <div key={index} className={`schedule-item ${item.status}`}>
                        <div className="schedule-time">{item.time}</div>
                        <div className="schedule-details">
                          <div className="schedule-title">{item.activity}</div>
                          <div className="schedule-type">{item.type}</div>
                        </div>
                        <div className={`schedule-status ${item.status}`}>
                          {item.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-schedule">
                    <p>You have nothing scheduled yet.</p>
                    <button className="schedule-workout-btn">Schedule a Workout</button>
                  </div>
                )}
              </div>
            </section>

            {/* Featured Content */}
            <section className="featured-section">
              <div className="section-header">
                <h3>Featured</h3>
                <button className="view-all">View All</button>
              </div>
              
              <div className="featured-content">
                {featuredContent.map((content, index) => (
                  <div key={index} className="featured-card">
                    <div className="featured-image">
                      <span className="featured-icon">{content.image}</span>
                      <div className="featured-overlay">
                        <button className="play-button">▶</button>
                      </div>
                    </div>
                    <div className="featured-info">
                      <div className="featured-subtitle">{content.subtitle}</div>
                      <h4 className="featured-title">{content.title}</h4>
                      <p className="featured-description">{content.description}</p>
                      <div className="featured-meta">
                        <span className="meta-item">🏷️ {content.difficulty}</span>
                        <span className="meta-item">⏱️ {content.duration}</span>
                        <span className="meta-item">👥 {content.participants}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Recent Activity */}
          <section className="activity-section">
            <h3>Recent Activity</h3>
            <div className="activity-feed">
              <div className="activity-item">
                <div className="activity-icon">🏆</div>
                <div className="activity-content">
                  <div className="activity-text">Completed "Full Body HIIT" workout</div>
                  <div className="activity-time">2 hours ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📸</div>
                <div className="activity-content">
                  <div className="activity-text">Uploaded progress photo</div>
                  <div className="activity-time">1 day ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🎯</div>
                <div className="activity-content">
                  <div className="activity-text">Reached weekly workout goal</div>
                  <div className="activity-time">2 days ago</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>© 2025 FitX Fitness. Transform your body, transform your life.</p>
          <div className="footer-links">
            <a href="#support">Support</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;