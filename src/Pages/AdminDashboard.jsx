import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../Styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Check authentication and admin status
  useEffect(() => {
    console.log('🏛️ AdminDashboard mounted');
    console.log('🔍 Auth state:', { isAuthenticated, isLoading, isAdmin, user: user?.email });
    
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      console.log(' Access denied, redirecting to admin login');
      navigate('/admin-login', { replace: true });
    }
  }, [isAuthenticated, isLoading, isAdmin, navigate]);

  const handleLogout = () => {
    console.log('Admin logout clicked');
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        color: '#1e293b'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>🏛️</div>
        <div style={{ fontSize: '18px' }}>Loading Admin Dashboard...</div>
      </div>
    );
  }

  // Not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect via useEffect
  }

  // Simplified core stats
  const adminStats = [
    { label: 'Total Users', value: '2,847', icon: '👥', change: '+12%', trend: 'up' },
    { label: 'Active Workouts', value: '43', icon: '💪', change: '+5%', trend: 'up' },
    { label: 'Total Exercises', value: '156', icon: '📋', change: '+8%', trend: 'up' },
    { label: 'User Engagement', value: '87%', icon: '📊', change: '+3%', trend: 'up' }
  ];

  // Recent users for management
  const recentUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', joined: '2 hours ago', status: 'active' },
    { id: 2, name: 'Mike Chen', email: 'mike@email.com', joined: '5 hours ago', status: 'active' },
    { id: 3, name: 'Emma Davis', email: 'emma@email.com', joined: '1 day ago', status: 'inactive' },
    { id: 4, name: 'John Smith', email: 'john@email.com', joined: '2 days ago', status: 'active' }
  ];

  // Popular workouts for content management
  const popularWorkouts = [
    { id: 1, name: 'HIIT Cardio Blast', users: 1234, rating: 4.8, category: 'Cardio' },
    { id: 2, name: 'Full Body Strength', users: 987, rating: 4.9, category: 'Strength' },
    { id: 3, name: 'Yoga Flow Basics', users: 756, rating: 4.7, category: 'Flexibility' },
    { id: 4, name: 'Core Crusher', users: 543, rating: 4.6, category: 'Core' }
  ];

  // Recent admin activities
  const recentActivity = [
    { action: 'New user registered', user: 'Sarah Johnson', time: '2 hours ago', type: 'user' },
    { action: 'Workout plan updated', user: 'Admin', time: '4 hours ago', type: 'content' },
    { action: 'User profile edited', user: 'Admin', time: '1 day ago', type: 'user' },
    { action: 'New exercise added', user: 'Admin', time: '2 days ago', type: 'content' }
  ];

  // Essential admin actions with proper routing
  const quickActions = [
    { title: 'Manage Users', description: 'View, edit, and manage user accounts', icon: '👥', action: 'users' },
    { title: 'Workout Plans', description: 'Create and edit workout programs', icon: '💪', action: 'workouts' },
    { title: 'Exercise Library', description: 'Add and manage exercises', icon: '📚', action: 'exercises' },
    { title: 'System Settings', description: 'Configure platform settings', icon: '⚙️', action: 'settings' }
  ];

  const handleQuickAction = (action) => {
  switch(action) {
    case 'users':
      navigate('/admin/users'); // ✅ Go to real user management
      break;
    case 'exercises':
      navigate('/admin/exercise-library');
      break;
    case 'settings':
      navigate('/admin/system-settings');
      break;
    default:
      navigate('/admin-dashboard');
  }
};

  // CRUD Operations
  const handleUserAction = (userId, action) => {
    console.log(`Performing ${action} on user ${userId}`);
    alert(`${action} action performed on user ${userId}`);
  };

  const handleWorkoutAction = (workoutId, action) => {
    console.log(`Performing ${action} on workout ${workoutId}`);
    alert(`${action} action performed on workout ${workoutId}`);
  };

  const handleCreateNew = (type) => {
    console.log(`Creating new ${type}`);
    alert(`Create new ${type} functionality would open here`);
  };

  return (
    <div className="admin-dashboard">
      {/* Enhanced Admin Header */}
      <header className="admin-header-nav">
        <div className="admin-nav-container">
          {/* Brand Section */}
          <div className="admin-brand">
            <div className="admin-brand-icon">⚡</div>
            <div className="admin-brand-text">
              <h1 className="admin-brand-title">FitX Admin</h1>
              <span className="admin-brand-subtitle">Platform Management</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="admin-nav-tabs">
            <button 
              className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="tab-icon">📊</span>
              <span className="tab-text">Overview</span>
            </button>
            
          </nav>

          {/* Admin User Section */}
          <div className="admin-user-section">
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {(user?.firstName || user?.username || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="admin-user-details">
                <span className="admin-user-name">
                  Welcome, {user?.firstName || user?.username || 'Admin'}
                </span>
                <span className="admin-user-role">Administrator</span>
              </div>
            </div>
            <button onClick={handleLogout} className="admin-logout-btn">
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        {/* Enhanced Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Quick Actions</h3>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button 
                  key={index} 
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(action.action)}
                >
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
            <h3 className="sidebar-title">System Status</h3>
            <div className="system-status">
              <div className="status-item">
                <span className="status-indicator online"></span>
                <div className="status-info">
                  <span className="status-label">Server Status</span>
                  <span className="status-value">Online</span>
                </div>
              </div>
              <div className="status-item">
                <span className="status-indicator good"></span>
                <div className="status-info">
                  <span className="status-label">Database</span>
                  <span className="status-value">Healthy</span>
                </div>
              </div>
              <div className="status-item">
                <span className="status-indicator good"></span>
                <div className="status-info">
                  <span className="status-label">Users Online</span>
                  <span className="status-value">234</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Admin Content */}
        <main className="admin-main">
          {activeTab === 'overview' && (
            <div className="tab-content">
              {/* Admin Stats */}
              <section className="admin-stats-section">
                <h3 className="section-title">Platform Analytics</h3>
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

              {/* Recent Activity */}
              <section className="admin-panel-section">
                <div className="section-header">
                  <h3>Recent Activity</h3>
                  <button className="view-all-btn">View All Activity</button>
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
            </div>
          )}

          {activeTab === 'users' && (
            <div className="tab-content">
              <section className="admin-panel-section">
                <div className="section-header">
                  <h3>User Management</h3>
                  <button 
                    className="create-btn"
                    onClick={() => handleCreateNew('user')}
                  >
                    + Add New User
                  </button>
                </div>
                <div className="users-list">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="user-item">
                      <div className="user-avatar">
                        {user.name.charAt(0)}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                        <div className="user-meta">
                          <span className="user-joined">Joined {user.joined}</span>
                          <span className={`user-status ${user.status}`}>{user.status}</span>
                        </div>
                      </div>
                      <div className="user-actions">
                        <button 
                          className="action-btn view"
                          onClick={() => handleUserAction(user.id, 'view')}
                        >
                          View
                        </button>
                        <button 
                          className="action-btn edit"
                          onClick={() => handleUserAction(user.id, 'edit')}
                        >
                          Edit
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleUserAction(user.id, 'delete')}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="tab-content">
              <section className="admin-panel-section">
                <div className="section-header">
                  <h3>Workout Management</h3>
                  <button 
                    className="create-btn"
                    onClick={() => handleCreateNew('workout')}
                  >
                    + Create Workout Plan
                  </button>
                </div>
                <div className="workouts-list">
                  {popularWorkouts.map((workout) => (
                    <div key={workout.id} className="workout-item">
                      <div className="workout-info">
                        <div className="workout-name">{workout.name}</div>
                        <div className="workout-meta">
                          <span className="workout-category">{workout.category}</span>
                          <span className="workout-users">{workout.users} users</span>
                          <span className="workout-rating">⭐ {workout.rating}</span>
                        </div>
                      </div>
                      <div className="workout-actions">
                        <button 
                          className="action-btn view"
                          onClick={() => handleWorkoutAction(workout.id, 'view')}
                        >
                          View
                        </button>
                        <button 
                          className="action-btn edit"
                          onClick={() => handleWorkoutAction(workout.id, 'edit')}
                        >
                          Edit
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleWorkoutAction(workout.id, 'delete')}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="admin-panel-section">
                <div className="section-header">
                  <h3>Exercise Library</h3>
                  <button 
                    className="create-btn"
                    onClick={() => navigate('/admin/exercise-library')}
                  >
                    📚 Manage Exercise Library
                  </button>
                </div>
                <div className="exercises-grid">
                  {['Push-ups', 'Squats', 'Burpees', 'Planks', 'Lunges', 'Mountain Climbers'].map((exercise, index) => (
                    <div key={index} className="exercise-card">
                      <div className="exercise-name">{exercise}</div>
                      <div className="exercise-actions">
                        <button className="action-btn-small edit">Edit</button>
                        <button className="action-btn-small delete">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;