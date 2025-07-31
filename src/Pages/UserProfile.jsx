import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../Styles/UserProfile.css';

const UserProfile = () => {
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : { name: 'User', role: 'user' };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { name: 'User', role: 'user' };
    }
  };

  const user = getUserData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@fitx.com',
    phone: '+1 (555) 123-4567',
    age: '28',
    height: '5\'8"',
    currentWeight: '165',
    targetWeight: '155',
    fitnessGoal: 'Weight Loss',
    activityLevel: 'Moderate',
    experience: 'Intermediate'
  });

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log('Saving profile data:', editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || 'User',
      email: user?.email || 'user@fitx.com',
      phone: '+1 (555) 123-4567',
      age: '28',
      height: '5\'8"',
      currentWeight: '165',
      targetWeight: '155',
      fitnessGoal: 'Weight Loss',
      activityLevel: 'Moderate',
      experience: 'Intermediate'
    });
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const userStats = [
    { label: 'Workouts Completed', value: '127', icon: '💪', change: '+8 this week', trend: 'up' },
    { label: 'Total Distance', value: '284 miles', icon: '🏃', change: '+12 miles', trend: 'up' },
    { label: 'Calories Burned', value: '45,280', icon: '🔥', change: '+1,240 this week', trend: 'up' },
    { label: 'Active Days', value: '89', icon: '📅', change: '+5 this month', trend: 'up' },
    { label: 'Current Streak', value: '12 days', icon: '⚡', change: 'Personal best!', trend: 'up' },
    { label: 'Weight Progress', value: '-8 lbs', icon: '⚖️', change: '2 lbs to goal', trend: 'down' }
  ];

  const achievements = [
    { title: '30-Day Streak', description: 'Completed workouts for 30 consecutive days', icon: '🔥', earned: true, date: 'Dec 15, 2024' },
    { title: 'Weight Loss Champion', description: 'Lost 10+ pounds in 3 months', icon: '⚖️', earned: true, date: 'Nov 20, 2024' },
    { title: 'Early Bird', description: 'Completed 20 morning workouts', icon: '🌅', earned: true, date: 'Oct 5, 2024' },
    { title: 'Consistency King', description: 'Never missed a scheduled workout for 2 weeks', icon: '👑', earned: false, progress: 85 },
    { title: 'Marathon Ready', description: 'Run 100+ miles total', icon: '🏃‍♂️', earned: false, progress: 67 },
    { title: 'Strength Beast', description: 'Complete 50 strength training sessions', icon: '💪', earned: false, progress: 42 }
  ];

  const recentActivities = [
    { date: '2025-01-27', activity: 'Full Body Strength', duration: '45 min', calories: 320 },
    { date: '2025-01-26', activity: 'Cardio HIIT', duration: '30 min', calories: 280 },
    { date: '2025-01-25', activity: 'Yoga Flow', duration: '60 min', calories: 180 },
    { date: '2025-01-24', activity: 'Upper Body', duration: '40 min', calories: 290 },
    { date: '2025-01-23', activity: 'Running', duration: '35 min', calories: 350 }
  ];

  const profileFormFields = [
    { label: 'Full Name', field: 'name', type: 'text' },
    { label: 'Email Address', field: 'email', type: 'email' },
    { label: 'Phone Number', field: 'phone', type: 'tel' },
    { label: 'Age', field: 'age', type: 'number', suffix: ' years' },
    { label: 'Height', field: 'height', type: 'text' },
    { label: 'Current Weight', field: 'currentWeight', type: 'number', suffix: ' lbs' },
    { label: 'Target Weight', field: 'targetWeight', type: 'number', suffix: ' lbs' },
    { label: 'Fitness Goal', field: 'fitnessGoal', type: 'select', options: ['Weight Loss', 'Muscle Gain', 'Endurance', 'General Fitness', 'Strength'] },
    { label: 'Activity Level', field: 'activityLevel', type: 'select', options: ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'] },
    { label: 'Experience Level', field: 'experience', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] }
  ];

  return (
    <div className="user-profile">
      {/* Header */}
      <header className="profile-header">
        <div className="profile-header-content">
          <div className="profile-logo">
            <span className="profile-logo-icon">👤</span>
            <div className="profile-branding">
              <h1>User Profile</h1>
              <span className="profile-subtitle">Manage Your Account & Settings</span>
            </div>
          </div>
          
          <nav className="profile-nav">
            <button 
              className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              Statistics
            </button>
            <button 
              className={`nav-tab ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
          </nav>

          <div className="profile-user-section">
            <button onClick={handleGoBack} className="back-btn">← Back to Dashboard</button>
            <div className="profile-user-info">
              <span className="profile-welcome">Welcome, {user?.name || 'User'}</span>
            </div>
            <button onClick={handleLogout} className="profile-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="sidebar-section">
            <div className="user-avatar-section">
              <div className="user-avatar-large">
                <span className="avatar-icon-large">👤</span>
              </div>
              <h3>{editData.name}</h3>
              <p className="user-email">{editData.email}</p>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Quick Stats</h3>
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="quick-stat-value">127</span>
                <span className="quick-stat-label">Workouts</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-value">68%</span>
                <span className="quick-stat-label">Goal Progress</span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-value">12</span>
                <span className="quick-stat-label">Day Streak</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          {activeTab === 'profile' && (
            <section className="profile-content-section fade-in">
              <div className="section-header">
                <h3>Personal Information</h3>
                {!isEditing ? (
                  <button className="edit-btn" onClick={handleEdit}>
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave}>Save</button>
                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                  </div>
                )}
              </div>

              <div className="profile-form">
                <div className="form-grid">
                  {profileFormFields.map((item, index) => (
                    <div key={index} className="form-group">
                      <label>{item.label}</label>
                      {isEditing ? (
                        item.type === 'select' ? (
                          <select
                            value={editData[item.field]}
                            onChange={(e) => handleInputChange(item.field, e.target.value)}
                            className="form-input"
                          >
                            {item.options.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={item.type}
                            value={editData[item.field]}
                            onChange={(e) => handleInputChange(item.field, e.target.value)}
                            className="form-input"
                          />
                        )
                      ) : (
                        <span className="form-display">
                          {editData[item.field]}{item.suffix || ''}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'stats' && (
            <section className="profile-content-section fade-in">
              <div className="section-header">
                <div>
                  <h3>Your Statistics</h3>
                  <p>Track your progress and achievements</p>
                </div>
                <button className="view-all-btn">Detailed Analytics</button>
              </div>

              <div className="stats-grid">
                {userStats.map((stat, index) => (
                  <div key={index} className="stat-card enhanced">
                    <div className="stat-header">
                      <span className="stat-icon">{stat.icon}</span>
                      <span className={`stat-change ${stat.trend}`}>{stat.change}</span>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="recent-activities">
                <h4>Recent Activities</h4>
                <div className="activities-list">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-info">
                        <div className="activity-name">{activity.activity}</div>
                        <div className="activity-date">{activity.date}</div>
                      </div>
                      <div className="activity-stats">
                        <div className="activity-duration">{activity.duration}</div>
                        <div className="activity-calories">{activity.calories} cal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'achievements' && (
            <section className="profile-content-section fade-in">
              <div className="section-header">
                <div>
                  <h3>Achievements & Badges</h3>
                  <p>Track your fitness milestones and unlock new badges</p>
                </div>
              </div>

              <div className="achievements-grid">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
                    {!achievement.earned && achievement.progress && (
                      <div 
                        className="achievement-progress" 
                        style={{ width: `${achievement.progress}%` }}
                      />
                    )}
                    
                    <div className="achievement-icon">
                      {achievement.earned ? achievement.icon : '🔒'}
                    </div>
                    <div className="achievement-content">
                      <h4 className="achievement-title">{achievement.title}</h4>
                      <p className="achievement-description">{achievement.description}</p>
                      
                      {achievement.earned ? (
                        <div className="achievement-details">
                          <span className="achievement-status earned">Earned</span>
                          <div className="achievement-date">{achievement.date}</div>
                        </div>
                      ) : (
                        <div className="achievement-details">
                          <span className="achievement-status locked">
                            {achievement.progress ? `${achievement.progress}% Complete` : 'Locked'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="profile-footer">
        <div className="profile-footer-content">
          <p>© 2025 FitX Fitness - Your Fitness Journey</p>
          <div className="profile-footer-links">
            <a href="#privacy">Privacy Settings</a>
            <a href="#security">Security</a>
            <a href="#help">Help & Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;