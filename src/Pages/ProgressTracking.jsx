import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Target, Dumbbell, Droplets, Ruler, FileText, TrendingUp, Activity, Moon, Footprints } from 'lucide-react';
import '../Styles/ProgressTracking.css';

const ProgressTracking = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    currentWeight: 165,
    goalWeight: 155,
    height: 70, // inches
    bodyFat: 18.5,
    muscleMass: 142,
    waterIntake: 6, // glasses today
    waterGoal: 8, // glasses per day
    sleepHours: 7.5,
    sleepGoal: 8,
    dailySteps: 8500,
    stepsGoal: 10000,
    workoutStreak: 7,
    waterStreak: 12
  });

  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [weightHistory, setWeightHistory] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [bodyMeasurements, setBodyMeasurements] = useState({
    chest: 42,
    waist: 32,
    arms: 14.5,
    thighs: 24
  });

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    const heightInMeters = height * 0.0254;
    const weightInKg = weight * 0.453592;
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Calculate weight progress
  const getWeightProgress = () => {
    const totalToLose = userStats.currentWeight - userStats.goalWeight;
    const currentProgress = userStats.currentWeight - userStats.goalWeight;
    return totalToLose > 0 ? Math.max(0, Math.min(100, ((totalToLose - currentProgress) / totalToLose) * 100)) : 0;
  };

  // Get weight change from last entry
  const getWeightChange = () => {
    if (weightHistory.length === 0) return 0;
    const lastEntry = weightHistory[weightHistory.length - 1];
    return userStats.currentWeight - lastEntry.weight;
  };

  // Handle weight logging
  const handleLogWeight = () => {
    if (!newWeight || isNaN(newWeight)) return;
    
    const weight = parseFloat(newWeight);
    setUserStats(prev => ({ ...prev, currentWeight: weight }));
    
    setNewWeight('');
    setShowWeightModal(false);
  };

  // Handle goal setting
  const handleSetGoal = () => {
    if (!newGoal || isNaN(newGoal)) return;
    
    const goal = parseFloat(newGoal);
    setUserStats(prev => ({ ...prev, goalWeight: goal }));
    
    setNewGoal('');
    setShowGoalModal(false);
  };

  const weightChange = getWeightChange();
  const bmi = calculateBMI(userStats.currentWeight, userStats.height);
  const weightProgress = getWeightProgress();

  return (
    <div className="progress-tracking-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <div className="header-content">
          <h1>Progress Tracking</h1>
          <p>Monitor Your Fitness Journey</p>
        </div>
      </div>

      <div className="progress-container">
        {/* Quick Status Overview */}
        <div className="quick-status-overview">
          <div className="status-card">
            <div className="status-dot weight"></div>
            <div className="status-info">
              <span className="status-label">Weight Goal</span>
              <span className="status-value">{Math.round(weightProgress)}%</span>
            </div>
          </div>
          
          <div className="status-card">
            <div className="status-dot water"></div>
            <div className="status-info">
              <span className="status-label">Water Today</span>
              <span className="status-value">{userStats.waterIntake}/{userStats.waterGoal}</span>
            </div>
          </div>
          
          <div className="status-card">
            <div className="status-dot sleep"></div>
            <div className="status-info">
              <span className="status-label">Sleep</span>
              <span className="status-value">{userStats.sleepHours}h</span>
            </div>
          </div>
          
          <div className="status-card">
            <div className="status-dot steps"></div>
            <div className="status-info">
              <span className="status-label">Steps</span>
              <span className="status-value">{userStats.dailySteps.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="status-card">
            <div className="status-dot streak"></div>
            <div className="status-info">
              <span className="status-label">Streak</span>
              <span className="status-value">{userStats.workoutStreak} days</span>
            </div>
          </div>
        </div>

        <div className="main-layout-grid">
          {/* Quick Actions Sidebar */}
          <div className="quick-actions-sidebar">
            <div className="sidebar-header">
              <h3>Quick Actions</h3>
            </div>

            <div className="action-item" onClick={() => setShowWeightModal(true)}>
              <div className="action-icon">
                <Scale size={20} />
              </div>
              <div className="action-content">
                <h4>Log Weight</h4>
                <p>Record today's weight</p>
              </div>
            </div>

            <div className="action-item" onClick={() => setShowGoalModal(true)}>
              <div className="action-icon">
                <Target size={20} />
              </div>
              <div className="action-content">
                <h4>Set New Goal</h4>
                <p>Update fitness goal</p>
              </div>
            </div>

            <div className="action-item" onClick={() => {
              const newStats = { 
                ...userStats, 
                waterIntake: Math.min(userStats.waterIntake + 1, userStats.waterGoal) 
              };
              setUserStats(newStats);
            }}>
              <div className="action-icon">
                <Droplets size={20} />
              </div>
              <div className="action-content">
                <h4>Log Water</h4>
                <p>Track daily hydration</p>
              </div>
            </div>

            <div className="action-item" onClick={() => setShowMeasurementsModal(true)}>
              <div className="action-icon">
                <Ruler size={20} />
              </div>
              <div className="action-content">
                <h4>Body Measurements</h4>
                <p>Update measurements</p>
              </div>
            </div>

            <div className="action-item" onClick={() => setShowNotesModal(true)}>
              <div className="action-icon">
                <FileText size={20} />
              </div>
              <div className="action-content">
                <h4>Workout Notes</h4>
                <p>Log workout details</p>
              </div>
            </div>

            {/* Current Status */}
            <div className="current-status">
              <h4>Current Status</h4>
              <div className="status-item">
                <span className="status-dot weight"></span>
                <div className="status-info">
                  <span className="status-label">Weight Goal</span>
                  <span className="status-value">{Math.round(weightProgress)}%</span>
                </div>
              </div>
              <div className="status-item">
                <span className="status-dot workout"></span>
                <div className="status-info">
                  <span className="status-label">Workouts</span>
                  <span className="status-value">{recentWorkouts.length} completed</span>
                </div>
              </div>
              <div className="status-item">
                <span className="status-dot water"></span>
                <div className="status-info">
                  <span className="status-label">Water Today</span>
                  <span className="status-value">{userStats.waterIntake || 6}/{userStats.waterGoal || 8} glasses</span>
                </div>
              </div>
              <div className="status-item">
                <span className="status-dot sleep"></span>
                <div className="status-info">
                  <span className="status-label">Sleep</span>
                  <span className="status-value">7.5h / 8h</span>
                </div>
              </div>
              <div className="status-item">
                <span className="status-dot steps"></span>
                <div className="status-info">
                  <span className="status-label">Steps Today</span>
                  <span className="status-value">8,500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-icon">⚖️</div>
                <div className="stat-content">
                  <h3>{userStats.currentWeight} lbs</h3>
                  <p>Current Weight</p>
                  <div className="stat-change">
                    <span className={`change ${weightChange < 0 ? 'positive' : weightChange > 0 ? 'negative' : 'neutral'}`}>
                      {weightChange !== 0 && (weightChange > 0 ? '+' : '')}{weightChange.toFixed(1)} lbs
                    </span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>{userStats.bodyFat}%</h3>
                  <p>Body Fat %</p>
                  <div className="stat-change">
                    <span className="change neutral">-2.1%</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💪</div>
                <div className="stat-content">
                  <h3>{userStats.muscleMass} lbs</h3>
                  <p>Muscle Mass</p>
                  <div className="stat-change">
                    <span className="change positive">+1.8 lbs</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📏</div>
                <div className="stat-content">
                  <h3>{bmi}</h3>
                  <p>BMI</p>
                  <div className="stat-change">
                    <span className="change neutral">-0.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Goals Section */}
            <div className="goals-section">
              <div className="section-header">
                <h3>Current Goals</h3>
                <button 
                  onClick={() => setShowGoalModal(true)}
                  className="btn btn-primary"
                >
                  Manage Goals
                </button>
              </div>

              <div className="goal-card" style={{'--progress': `${weightProgress}%`}}>
                <div className="goal-info">
                  <h4>Weight Loss Goal</h4>
                  <div className="goal-details">
                    <span>Current: {userStats.currentWeight} lbs</span>
                    <span>Target: {userStats.goalWeight} lbs</span>
                    <span className="goal-status">
                      {userStats.currentWeight > userStats.goalWeight ? 'On-Track' : 'Goal Achieved!'}
                    </span>
                  </div>
                </div>
                <div className="goal-progress">
                  <div className="progress-circle" style={{'--progress': `${weightProgress}%`}}>
                    <div className="progress-value">{Math.round(weightProgress)}%</div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${weightProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="weekly-summary">
              <h3>Weekly Summary</h3>
              <div className="summary-grid">
                <div className="summary-card water-card">
                  <div className="summary-icon">💧</div>
                  <div className="summary-content">
                    <h4>Hydration</h4>
                    <div className="summary-value">{userStats.waterIntake}/{userStats.waterGoal}</div>
                    <p className="summary-text">glasses today</p>
                    <div className="water-progress">
                      <div 
                        className="water-progress-fill" 
                        style={{ width: `${(userStats.waterIntake / userStats.waterGoal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">🌙</div>
                  <div className="summary-content">
                    <h4>Sleep</h4>
                    <div className="summary-value">{userStats.sleepHours}h</div>
                    <p className="summary-text">last night</p>
                    <div className="summary-progress">
                      <div 
                        className="summary-progress-fill" 
                        style={{ width: `${(userStats.sleepHours / userStats.sleepGoal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">👣</div>
                  <div className="summary-content">
                    <h4>Steps</h4>
                    <div className="summary-value">{userStats.dailySteps.toLocaleString()}</div>
                    <p className="summary-text">steps today</p>
                    <div className="summary-progress">
                      <div 
                        className="summary-progress-fill" 
                        style={{ width: `${(userStats.dailySteps / userStats.stepsGoal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Weight Modal */}
      {showWeightModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Log Weight</h3>
              <button onClick={() => setShowWeightModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Current Weight (lbs)</label>
                <input
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Enter your current weight"
                  step="0.1"
                  min="50"
                  max="500"
                />
              </div>
              <div className="weight-info">
                <p>Last recorded: {userStats.currentWeight} lbs</p>
                {weightHistory.length > 0 && (
                  <p>Previous entry: {weightHistory[weightHistory.length - 1]?.weight} lbs</p>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowWeightModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleLogWeight} className="btn btn-primary">
                Log Weight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Goal Modal */}
      {showGoalModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Set Weight Goal</h3>
              <button onClick={() => setShowGoalModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Goal Weight (lbs)</label>
                <input
                  type="number"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Enter your goal weight"
                  step="0.1"
                  min="50"
                  max="500"
                />
              </div>
              <div className="goal-info">
                <p>Current weight: {userStats.currentWeight} lbs</p>
                <p>Current goal: {userStats.goalWeight} lbs</p>
                {newGoal && (
                  <p className="goal-preview">
                    {newGoal < userStats.currentWeight 
                      ? `You need to lose ${(userStats.currentWeight - parseFloat(newGoal)).toFixed(1)} lbs`
                      : newGoal > userStats.currentWeight
                      ? `You need to gain ${(parseFloat(newGoal) - userStats.currentWeight).toFixed(1)} lbs`
                      : 'You\'re already at your goal weight!'
                    }
                  </p>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowGoalModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleSetGoal} className="btn btn-primary">
                Set Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Body Measurements Modal */}
      {showMeasurementsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Update Body Measurements</h3>
              <button onClick={() => setShowMeasurementsModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="measurements-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Chest (inches)</label>
                    <input
                      type="number"
                      value={bodyMeasurements.chest}
                      onChange={(e) => setBodyMeasurements({...bodyMeasurements, chest: parseFloat(e.target.value)})}
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Waist (inches)</label>
                    <input
                      type="number"
                      value={bodyMeasurements.waist}
                      onChange={(e) => setBodyMeasurements({...bodyMeasurements, waist: parseFloat(e.target.value)})}
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Arms (inches)</label>
                    <input
                      type="number"
                      value={bodyMeasurements.arms}
                      onChange={(e) => setBodyMeasurements({...bodyMeasurements, arms: parseFloat(e.target.value)})}
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Thighs (inches)</label>
                    <input
                      type="number"
                      value={bodyMeasurements.thighs}
                      onChange={(e) => setBodyMeasurements({...bodyMeasurements, thighs: parseFloat(e.target.value)})}
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowMeasurementsModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowMeasurementsModal(false);
                  alert('Measurements updated successfully!');
                }} 
                className="btn btn-primary"
              >
                Save Measurements
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workout Notes Modal */}
      {showNotesModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Workout Notes</h3>
              <button onClick={() => setShowNotesModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="notes-section">
                <h4>Add Today's Workout Note</h4>
                <div className="form-group">
                  <label>Workout Type</label>
                  <select>
                    <option value="strength">Strength Training</option>
                    <option value="cardio">Cardio</option>
                    <option value="hiit">HIIT</option>
                    <option value="yoga">Yoga/Flexibility</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>How did you feel?</label>
                  <div className="mood-selector">
                    <button className="mood-btn">😴 Tired</button>
                    <button className="mood-btn">😐 Okay</button>
                    <button className="mood-btn">😊 Good</button>
                    <button className="mood-btn">💪 Strong</button>
                    <button className="mood-btn">🔥 Amazing</button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea 
                    placeholder="How was your workout? Any achievements, challenges, or observations..."
                    rows="4"
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowNotesModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowNotesModal(false);
                  alert('Workout note saved!');
                }} 
                className="btn btn-primary"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracking;