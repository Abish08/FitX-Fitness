import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/AdminDashboard.css';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const adminStats = [
    { label: 'Total Users', value: '2,847', icon: '👥', change: '+12%', trend: 'up' },
    { label: 'Active Programs', value: '43', icon: '📋', change: '+5%', trend: 'up' },
    { label: 'Monthly Revenue', value: '$28,450', icon: '💰', change: '+18%', trend: 'up' },
    { label: 'Completion Rate', value: '87%', icon: '📊', change: '+3%', trend: 'up' }
  ];

  const recentUsers = [
    { name: 'Sarah Johnson', email: 'sarah@email.com', joined: '2 hours ago', status: 'active', plan: 'Premium' },
    { name: 'Mike Chen', email: 'mike@email.com', joined: '5 hours ago', status: 'active', plan: 'Basic' },
    { name: 'Emma Davis', email: 'emma@email.com', joined: '1 day ago', status: 'pending', plan: 'Premium' },
    { name: 'John Smith', email: 'john@email.com', joined: '2 days ago', status: 'active', plan: 'Basic' }
  ];

  const popularWorkouts = [
    { name: 'HIIT Cardio Blast', users: 1234, rating: 4.8, category: 'Cardio' },
    { name: 'Full Body Strength', users: 987, rating: 4.9, category: 'Strength' },
    { name: 'Yoga Flow Basics', users: 756, rating: 4.7, category: 'Flexibility' },
    { name: 'Core Crusher', users: 543, rating: 4.6, category: 'Core' }
  ];

  const recentActivity = [
    { action: 'New workout plan created', user: 'Admin', time: '2 hours ago', type: 'content' },
    { action: 'User support ticket resolved', user: 'Admin', time: '4 hours ago', type: 'support' },
    { action: 'Monthly analytics report generated', user: 'System', time: '1 day ago', type: 'system' },
    { action: 'New exercise added to library', user: 'Admin', time: '2 days ago', type: 'content' }
  ];

  const quickActions = [
    { title: 'Create Workout Plan', description: 'Add new workout program', icon: '📋', action: 'create-workout' },
    { title: 'Add Exercise', description: 'Expand exercise library', icon: '💪', action: 'add-exercise' },
    { title: 'Manage Users', description: 'View and edit user accounts', icon: '👥', action: 'manage-users' },
    { title: 'View Analytics', description: 'Platform performance insights', icon: '📊', action: 'analytics' },
    { title: 'Content Management', description: 'Manage all platform content', icon: '📝', action: 'content' },
    { title: 'Support Center', description: 'User questions and feedback', icon: '🎧', action: 'support' }
  ];

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <span className="admin-logo-icon">⚡</span>
            <div className="admin-branding">
              <h1>FitX Admin</h1>
              <span className="admin-subtitle">Platform Management</span>
            </div>
          </div>

          <nav className="admin-nav">
            <button 
              className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button 
              className={`nav-tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button 
              className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </nav>

          <div className="admin-user-section">
            <div className="admin-user-info">
              <span className="admin-welcome">Welcome, {user?.name}</span>
              <span className="admin-badge">Administrator</span>
            </div>
            <button onClick={handleLogout} className="admin-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button key={index} className="quick-action-btn">
                  <span className="action-icon">{action.icon}</span>
                  <div className="action-content">
                    <div className="action-title">{action.title}</div>
                    <div className="action-description">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>System Status</h3>
            <div className="system-status">
              <div className="status-item">
                <span className="status-indicator online"></span>
                <span className="status-label">Server Status</span>
                <span className="status-value">Online</span>
              </div>
              <div className="status-item">
                <span className="status-indicator good"></span>
                <span className="status-label">Database</span>
                <span className="status-value">Healthy</span>
              </div>
              <div className="status-item">
                <span className="status-indicator warning"></span>
                <span className="status-label">Storage</span>
                <span className="status-value">85% Used</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Admin Content */}
        <main className="admin-main">
          {/* Admin Stats */}
          <section className="admin-stats-section">
            <div className="admin-stats-grid">
              {adminStats.map((stat, index) => (
                <div key={index} className="admin-stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">{stat.icon}</span>
                    <span className={`stat-change ${stat.trend}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="admin-content-grid">
            {/* Recent Users */}
            <section className="admin-panel-section">
              <div className="section-header">
                <h3>Recent Users</h3>
                <button className="view-all-btn">View All Users</button>
              </div>
              <div className="users-list">
                {recentUsers.map((user, index) => (
                  <div key={index} className="user-item">
                    <div className="user-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                      <div className="user-meta">
                        <span className="user-joined">Joined {user.joined}</span>
                        <span className={`user-status ${user.status}`}>{user.status}</span>
                        <span className="user-plan">{user.plan}</span>
                      </div>
                    </div>
                    <button className="user-action-btn">Manage</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Workouts */}
            <section className="admin-panel-section">
              <div className="section-header">
                <h3>Popular Workouts</h3>
                <button className="view-all-btn">Manage Content</button>
              </div>
              <div className="workouts-list">
                {popularWorkouts.map((workout, index) => (
                  <div key={index} className="workout-item">
                    <div className="workout-info">
                      <div className="workout-name">{workout.name}</div>
                      <div className="workout-meta">
                        <span className="workout-category">{workout.category}</span>
                        <span className="workout-users">{workout.users} users</span>
                        <span className="workout-rating">⭐ {workout.rating}</span>
                      </div>
                    </div>
                    <button className="workout-action-btn">Edit</button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Recent Activity */}
          <section className="admin-panel-section">
            <div className="section-header">
              <h3>Recent Activity</h3>
              <button className="view-all-btn">View Activity Log</button>
            </div>
            <div className="activity-timeline">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-indicator ${activity.type}`}></div>
                  <div className="activity-content">
                    <div className="activity-action">{activity.action}</div>
                    <div className="activity-meta">
                      <span className="activity-user">by {activity.user}</span>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Performance Metrics */}
          <section className="admin-panel-section">
            <div className="section-header">
              <h3>Performance Metrics</h3>
              <button className="view-all-btn">Detailed Analytics</button>
            </div>
            <div className="metrics-grid">
              <div className="metric-card">
                <h4>User Engagement</h4>
                <div className="metric-chart">
                  <div className="chart-placeholder">
                    📈 Average session: 24 minutes
                  </div>
                </div>
              </div>
              <div className="metric-card">
                <h4>Revenue Growth</h4>
                <div className="metric-chart">
                  <div className="chart-placeholder">
                    💹 Monthly growth: +18%
                  </div>
                </div>
              </div>
              <div className="metric-card">
                <h4>Content Performance</h4>
                <div className="metric-chart">
                  <div className="chart-placeholder">
                    🎯 Completion rate: 87%
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Admin Footer */}
      <footer className="admin-footer">
        <div className="admin-footer-content">
          <p>© 2025 FitX Fitness - Admin Dashboard</p>
          <div className="admin-footer-links">
            <a href="#system-logs">System Logs</a>
            <a href="#documentation">Documentation</a>
            <a href="#support">Admin Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;