import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import '../Styles/WorkoutPlans.css';

const WorkoutPlans = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userPlans, setUserPlans] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [enrollingPlan, setEnrollingPlan] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [user, setUser] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Get user role
  const getUserRole = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return parsedUser.role || 'user';
      }
      return 'user';
    } catch {
      return 'user';
    }
  };

  const isAdmin = () => user && user.role === 'admin';

  // Initial workout plans data with YouTube videos
  const defaultPlans = [
    {
      id: 1,
      name: "Full Body HIIT Challenge",
      category: "HIIT",
      difficulty: "Intermediate",
      duration: "4 weeks",
      sessions: 16,
      description: "High-intensity interval training to burn fat and build strength",
      exercises: ["Burpees", "Mountain Climbers", "Jump Squats", "Push-ups"],
      participants: 1234,
      rating: 4.8,
      image: "🔥",
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      videoId: "UBMk30rjy0o", // 20 Min Full Body HIIT Workout
      workoutVideos: [
        { name: "HIIT Beginner Workout", videoId: "gC_L9qAHVJ8", duration: "15 min" },
        { name: "Full Body HIIT", videoId: "UBMk30rjy0o", duration: "20 min" },
        { name: "Advanced HIIT Training", videoId: "g_tea8ZNk5A", duration: "25 min" }
      ]
    },
    {
      id: 2,
      name: "Beginner's Strength Journey",
      category: "Strength",
      difficulty: "Beginner",
      duration: "6 weeks",
      sessions: 18,
      description: "Perfect introduction to weight training fundamentals",
      exercises: ["Bodyweight Squats", "Wall Push-ups", "Planks", "Lunges"],
      participants: 892,
      rating: 4.9,
      image: "💪",
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      videoId: "QOVaHwm-Q6U", // Beginner Strength Training
      workoutVideos: [
        { name: "Beginner Bodyweight", videoId: "vc1E5CfRfos", duration: "12 min" },
        { name: "Strength Basics", videoId: "QOVaHwm-Q6U", duration: "18 min" },
        { name: "Progressive Training", videoId: "SVGJtXGpbA4", duration: "22 min" }
      ]
    },
    {
      id: 3,
      name: "Flexibility & Recovery",
      category: "Wellness",
      difficulty: "All Levels",
      duration: "3 weeks",
      sessions: 12,
      description: "Improve mobility and reduce injury risk",
      exercises: ["Yoga Flow", "Stretching", "Foam Rolling", "Meditation"],
      participants: 567,
      rating: 4.7,
      image: "🧘",
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      videoId: "v7AYKMP6rOE", // Morning Yoga Flow
      workoutVideos: [
        { name: "Morning Yoga Flow", videoId: "v7AYKMP6rOE", duration: "20 min" },
        { name: "Full Body Stretch", videoId: "g_tea8ZNk5A", duration: "15 min" },
        { name: "Deep Relaxation", videoId: "lw3lr0lz_YI", duration: "25 min" }
      ]
    }
  ];

  // Load plans and user data on component mount
  useEffect(() => {
    getUserRole();
    
    // Load available plans
    const savedPlans = JSON.parse(localStorage.getItem('workoutPlans')) || defaultPlans;
    setAvailablePlans(savedPlans);
    
    // If no plans exist, save default plans
    if (!localStorage.getItem('workoutPlans')) {
      localStorage.setItem('workoutPlans', JSON.stringify(defaultPlans));
    }
    
    // Load user enrolled plans
    const savedUserPlans = JSON.parse(localStorage.getItem('userWorkoutPlans')) || [];
    setUserPlans(savedUserPlans);
  }, []);

  // CRUD Operations

  // CREATE - Add new workout plan (Admin only)
  const onCreateSubmit = (data) => {
    const exercisesList = data.exercises.split(',').map(ex => ex.trim()).filter(ex => ex);
    const videoIds = data.workoutVideos ? data.workoutVideos.split(',').map(id => id.trim()).filter(id => id) : [];
    
    const newPlan = {
      id: Date.now(),
      name: data.name,
      category: data.category,
      difficulty: data.difficulty,
      duration: data.duration,
      sessions: parseInt(data.sessions),
      description: data.description,
      exercises: exercisesList,
      participants: 0,
      rating: 0,
      image: data.image || "🏋️",
      createdBy: user?.name || 'admin',
      createdAt: new Date().toISOString(),
      videoId: videoIds[0] || null, // First video as preview
      workoutVideos: videoIds.map((id, index) => ({
        name: `Workout ${index + 1}`,
        videoId: id,
        duration: "15 min" // Default duration
      }))
    };

    const updatedPlans = [...availablePlans, newPlan];
    setAvailablePlans(updatedPlans);
    localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans));
    
    setShowCreateForm(false);
    reset();
    alert('Workout plan created successfully!');
  };

  // UPDATE - Edit existing workout plan (Admin only)
  const onEditSubmit = (data) => {
    const exercisesList = data.exercises.split(',').map(ex => ex.trim()).filter(ex => ex);
    
    const updatedPlan = {
      ...editingPlan,
      name: data.name,
      category: data.category,
      difficulty: data.difficulty,
      duration: data.duration,
      sessions: parseInt(data.sessions),
      description: data.description,
      exercises: exercisesList,
      image: data.image,
      updatedAt: new Date().toISOString()
    };

    const updatedPlans = availablePlans.map(plan => 
      plan.id === editingPlan.id ? updatedPlan : plan
    );
    
    setAvailablePlans(updatedPlans);
    localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans));
    
    setShowEditForm(false);
    setEditingPlan(null);
    reset();
    alert('Workout plan updated successfully!');
  };

  // DELETE - Remove workout plan (Admin only)
  const deletePlan = (planId) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      const updatedPlans = availablePlans.filter(plan => plan.id !== planId);
      setAvailablePlans(updatedPlans);
      localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans));
      
      // Also remove from user enrolled plans
      const updatedUserPlans = userPlans.filter(plan => plan.id !== planId);
      setUserPlans(updatedUserPlans);
      localStorage.setItem('userWorkoutPlans', JSON.stringify(updatedUserPlans));
      
      alert('Workout plan deleted successfully!');
    }
  };

  // User enrollment
  const onEnrollSubmit = (data) => {
    const newUserPlan = {
      ...enrollingPlan,
      enrolledDate: new Date().toISOString(),
      progress: 0,
      status: 'active',
      preferences: data
    };
    
    const existingPlans = JSON.parse(localStorage.getItem('userWorkoutPlans')) || [];
    existingPlans.push(newUserPlan);
    localStorage.setItem('userWorkoutPlans', JSON.stringify(existingPlans));
    
    // Update participants count
    const updatedPlans = availablePlans.map(plan =>
      plan.id === enrollingPlan.id 
        ? { ...plan, participants: plan.participants + 1 }
        : plan
    );
    setAvailablePlans(updatedPlans);
    localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans));
    
    setUserPlans([...userPlans, newUserPlan]);
    setShowEnrollForm(false);
    setEnrollingPlan(null);
    reset();
    alert(`Successfully enrolled in ${enrollingPlan.name}!`);
  };

  // Unenroll from plan
  const unenrollFromPlan = (planId) => {
    if (window.confirm('Are you sure you want to unenroll from this plan?')) {
      const updatedUserPlans = userPlans.filter(plan => plan.id !== planId);
      setUserPlans(updatedUserPlans);
      localStorage.setItem('userWorkoutPlans', JSON.stringify(updatedUserPlans));
      
      // Update participants count
      const updatedPlans = availablePlans.map(plan =>
        plan.id === planId 
          ? { ...plan, participants: Math.max(0, plan.participants - 1) }
          : plan
      );
      setAvailablePlans(updatedPlans);
      localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans));
      
      alert('Successfully unenrolled from the plan!');
    }
  };

  const startEnrollment = (plan) => {
    setEnrollingPlan(plan);
    setShowEnrollForm(true);
  };

  const startEdit = (plan) => {
    setEditingPlan(plan);
    setValue('name', plan.name);
    setValue('category', plan.category);
    setValue('difficulty', plan.difficulty);
    setValue('duration', plan.duration);
    setValue('sessions', plan.sessions);
    setValue('description', plan.description);
    setValue('exercises', plan.exercises.join(', '));
    setValue('image', plan.image);
    setShowEditForm(true);
  };

  const getPlansByCategory = () => {
    const categories = {};
    availablePlans.forEach(plan => {
      if (!categories[plan.category]) {
        categories[plan.category] = [];
      }
      categories[plan.category].push(plan);
    });
    return categories;
  };

  const isEnrolled = (planId) => {
    return userPlans.some(plan => plan.id === planId);
  };

  return (
    <div className="workout-plans-page">
      {/* Header */}
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Workout Plans</h1>
        {isAdmin() && (
          <button 
            onClick={() => setShowCreateForm(true)} 
            className="btn btn-primary"
          >
            + Create New Plan
          </button>
        )}
      </div>

      <div className="workout-plans-container">
        {/* My Plans Section */}
        {userPlans.length > 0 && (
          <section className="my-plans-section">
            <h2>My Active Plans</h2>
            <div className="my-plans-grid">
              {userPlans.map(plan => (
                <div key={`my-${plan.id}`} className="plan-card my-plan">
                  <div className="plan-icon">{plan.image}</div>
                  <div className="plan-info">
                    <h3>{plan.name}</h3>
                    <div className="plan-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{plan.progress}% Complete</span>
                    </div>
                    <div className="plan-actions-inline">
                      <button className="btn btn-primary">Continue Plan</button>
                      <button 
                        className="btn btn-danger btn-small"
                        onClick={() => unenrollFromPlan(plan.id)}
                      >
                        Unenroll
                      </button>
                      {plan.videoId && (
                        <button 
                          className="btn btn-video btn-small"
                          onClick={() => window.open(`https://www.youtube.com/watch?v=${plan.videoId}`, '_blank')}
                        >
                          📺 Videos
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Available Plans */}
        <section className="available-plans-section">
          <h2>Available Workout Plans</h2>
          
          {Object.entries(getPlansByCategory()).map(([category, plans]) => (
            <div key={category} className="category-section">
              <h3 className="category-title">{category}</h3>
              <div className="plans-grid">
                {plans.map(plan => (
                  <div key={plan.id} className="plan-card">
                    <div className="plan-header">
                      <div className="plan-icon">{plan.image}</div>
                      <div className="plan-badge">{plan.difficulty}</div>
                      {isAdmin() && (
                        <div className="admin-actions">
                          <button 
                            onClick={() => startEdit(plan)}
                            className="admin-btn edit-btn"
                            title="Edit Plan"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => deletePlan(plan.id)}
                            className="admin-btn delete-btn"
                            title="Delete Plan"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="plan-content">
                      <h3>{plan.name}</h3>
                      <p className="plan-description">{plan.description}</p>
                      
                      <div className="plan-details">
                        <div className="detail-item">
                          <span className="detail-label">Duration:</span>
                          <span>{plan.duration}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Sessions:</span>
                          <span>{plan.sessions}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Rating:</span>
                          <span>⭐ {plan.rating || 'New'}</span>
                        </div>
                      </div>

                      <div className="plan-exercises">
                        <strong>Key Exercises:</strong>
                        <div className="exercises-list">
                          {plan.exercises.slice(0, 3).map((exercise, index) => (
                            <span key={index} className="exercise-tag">{exercise}</span>
                          ))}
                          {plan.exercises.length > 3 && (
                            <span className="exercise-tag more">+{plan.exercises.length - 3} more</span>
                          )}
                        </div>
                      </div>

                      <div className="plan-stats">
                        <span>👥 {plan.participants} active</span>
                        {plan.createdBy && (
                          <span className="creator">Created by: {plan.createdBy}</span>
                        )}
                      </div>
                    </div>

                    <div className="plan-actions">
                      {isEnrolled(plan.id) ? (
                        <div className="enrolled-actions">
                          <button className="btn btn-success" disabled>
                            ✓ Enrolled
                          </button>
                          {plan.videoId && (
                            <button 
                              className="btn btn-video"
                              onClick={() => window.open(`https://www.youtube.com/watch?v=${plan.videoId}`, '_blank')}
                            >
                              📺 Watch Videos
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="plan-buttons">
                          <button 
                            className="btn btn-secondary"
                            onClick={() => setSelectedPlan(plan)}
                          >
                            View Details
                          </button>
                          <button 
                            className="btn btn-primary"
                            onClick={() => startEnrollment(plan)}
                          >
                            Enroll Now
                          </button>
                          {plan.videoId && (
                            <button 
                              className="btn btn-video"
                              onClick={() => window.open(`https://www.youtube.com/watch?v=${plan.videoId}`, '_blank')}
                            >
                              📺 Preview
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Create Plan Modal (Admin only) */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="create-plan-modal">
            <div className="modal-header">
              <h3>Create New Workout Plan</h3>
              <button onClick={() => setShowCreateForm(false)} className="close-btn">✕</button>
            </div>
            <form onSubmit={handleSubmit(onCreateSubmit)} className="create-plan-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Plan Name</label>
                  <input 
                    type="text"
                    {...register('name', { required: 'Plan name is required' })}
                    className="form-input"
                    placeholder="e.g. Advanced HIIT Training"
                  />
                  {errors.name && <span className="field-error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    {...register('category', { required: 'Category is required' })}
                    className="form-select"
                  >
                    <option value="">Select category</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Yoga">Yoga</option>
                    <option value="CrossFit">CrossFit</option>
                  </select>
                  {errors.category && <span className="field-error">{errors.category.message}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select 
                    {...register('difficulty', { required: 'Difficulty is required' })}
                    className="form-select"
                  >
                    <option value="">Select difficulty</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                  {errors.difficulty && <span className="field-error">{errors.difficulty.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input 
                    type="text"
                    {...register('duration', { required: 'Duration is required' })}
                    className="form-input"
                    placeholder="e.g. 4 weeks"
                  />
                  {errors.duration && <span className="field-error">{errors.duration.message}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Total Sessions</label>
                  <input 
                    type="number"
                    {...register('sessions', { required: 'Sessions count is required', min: 1 })}
                    className="form-input"
                    placeholder="e.g. 16"
                  />
                  {errors.sessions && <span className="field-error">{errors.sessions.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Icon/Emoji</label>
                  <input 
                    type="text"
                    {...register('image')}
                    className="form-input"
                    placeholder="e.g. 🔥"
                    maxLength="2"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  {...register('description', { required: 'Description is required' })}
                  className="form-textarea"
                  placeholder="Describe what this workout plan offers..."
                  rows="3"
                />
                {errors.description && <span className="field-error">{errors.description.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Exercises (comma-separated)</label>
                <textarea 
                  {...register('exercises', { required: 'At least one exercise is required' })}
                  className="form-textarea"
                  placeholder="e.g. Burpees, Mountain Climbers, Jump Squats, Push-ups"
                  rows="2"
                />
                {errors.exercises && <span className="field-error">{errors.exercises.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Workout Videos (YouTube IDs, comma-separated)</label>
                <textarea 
                  {...register('workoutVideos')}
                  className="form-textarea"
                  placeholder="e.g. UBMk30rjy0o,gC_L9qAHVJ8,g_tea8ZNk5A"
                  rows="2"
                />
                <small className="form-help">Enter YouTube video IDs for workout demonstrations</small>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Plan Modal (Admin only) */}
      {showEditForm && editingPlan && (
        <div className="modal-overlay">
          <div className="create-plan-modal">
            <div className="modal-header">
              <h3>Edit Workout Plan</h3>
              <button onClick={() => setShowEditForm(false)} className="close-btn">✕</button>
            </div>
            <form onSubmit={handleSubmit(onEditSubmit)} className="create-plan-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Plan Name</label>
                  <input 
                    type="text"
                    {...register('name', { required: 'Plan name is required' })}
                    className="form-input"
                  />
                  {errors.name && <span className="field-error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    {...register('category', { required: 'Category is required' })}
                    className="form-select"
                  >
                    <option value="HIIT">HIIT</option>
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Yoga">Yoga</option>
                    <option value="CrossFit">CrossFit</option>
                  </select>
                  {errors.category && <span className="field-error">{errors.category.message}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select 
                    {...register('difficulty', { required: 'Difficulty is required' })}
                    className="form-select"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                  {errors.difficulty && <span className="field-error">{errors.difficulty.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input 
                    type="text"
                    {...register('duration', { required: 'Duration is required' })}
                    className="form-input"
                  />
                  {errors.duration && <span className="field-error">{errors.duration.message}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Total Sessions</label>
                  <input 
                    type="number"
                    {...register('sessions', { required: 'Sessions count is required', min: 1 })}
                    className="form-input"
                  />
                  {errors.sessions && <span className="field-error">{errors.sessions.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Icon/Emoji</label>
                  <input 
                    type="text"
                    {...register('image')}
                    className="form-input"
                    maxLength="2"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  {...register('description', { required: 'Description is required' })}
                  className="form-textarea"
                  rows="3"
                />
                {errors.description && <span className="field-error">{errors.description.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Exercises (comma-separated)</label>
                <textarea 
                  {...register('exercises', { required: 'At least one exercise is required' })}
                  className="form-textarea"
                  rows="2"
                />
                {errors.exercises && <span className="field-error">{errors.exercises.message}</span>}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Detail Modal */}
      {selectedPlan && (
        <div className="modal-overlay">
          <div className="plan-detail-modal">
            <div className="modal-header">
              <h3>{selectedPlan.name}</h3>
              <button onClick={() => setSelectedPlan(null)} className="close-btn">✕</button>
            </div>
            <div className="modal-content">
              <div className="plan-detail-info">
                <div className="plan-icon large">{selectedPlan.image}</div>
                <p>{selectedPlan.description}</p>
                <div className="detail-grid">
                  <div><strong>Category:</strong> {selectedPlan.category}</div>
                  <div><strong>Difficulty:</strong> {selectedPlan.difficulty}</div>
                  <div><strong>Duration:</strong> {selectedPlan.duration}</div>
                  <div><strong>Sessions:</strong> {selectedPlan.sessions}</div>
                  <div><strong>Rating:</strong> ⭐ {selectedPlan.rating || 'New'}</div>
                  <div><strong>Participants:</strong> {selectedPlan.participants}</div>
                </div>
              </div>
              <div className="exercises-detail">
                <h4>Exercises Included:</h4>
                <ul>
                  {selectedPlan.exercises.map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              </div>

              {selectedPlan.workoutVideos && (
                <div className="workout-videos">
                  <h4>Workout Videos:</h4>
                  <div className="video-list">
                    {selectedPlan.workoutVideos.map((video, index) => (
                      <div key={index} className="video-item">
                        <div className="video-thumbnail">
                          <img 
                            src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                            alt={video.name}
                          />
                          <div 
                            className="video-play-btn"
                            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
                          >
                            ▶
                          </div>
                        </div>
                        <div className="video-info">
                          <h5>{video.name}</h5>
                          <span className="video-duration">{video.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="modal-actions">
                {!isEnrolled(selectedPlan.id) ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      startEnrollment(selectedPlan);
                      setSelectedPlan(null);
                    }}
                  >
                    Enroll in This Plan
                  </button>
                ) : (
                  <button className="btn btn-success" disabled>
                    ✓ Already Enrolled
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Form Modal */}
      {showEnrollForm && enrollingPlan && (
        <div className="modal-overlay">
          <div className="enrollment-modal">
            <div className="modal-header">
              <h3>Enroll in {enrollingPlan.name}</h3>
              <button onClick={() => setShowEnrollForm(false)} className="close-btn">✕</button>
            </div>
            <form onSubmit={handleSubmit(onEnrollSubmit)} className="enrollment-form">
              <div className="form-group">
                <label className="form-label">What's your primary goal with this program?</label>
                <select 
                  {...register('goal', { required: 'Please select your goal' })}
                  className="form-select"
                >
                  <option value="">Select your goal</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="endurance">Build Endurance</option>
                  <option value="strength">Build Strength</option>
                  <option value="general">General Fitness</option>
                </select>
                {errors.goal && <span className="field-error">{errors.goal.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">How many days per week can you commit?</label>
                <select 
                  {...register('frequency', { required: 'Please select your frequency' })}
                  className="form-select"
                >
                  <option value="">Select frequency</option>
                  <option value="3">3 days per week</option>
                  <option value="4">4 days per week</option>
                  <option value="5">5 days per week</option>
                  <option value="6">6 days per week</option>
                  <option value="7">7 days per week</option>
                </select>
                {errors.frequency && <span className="field-error">{errors.frequency.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Current fitness level</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      value="beginner" 
                      {...register('fitnessLevel', { required: 'Please select your fitness level' })}
                    />
                    Beginner
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      value="intermediate" 
                      {...register('fitnessLevel', { required: 'Please select your fitness level' })}
                    />
                    Intermediate
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      value="advanced" 
                      {...register('fitnessLevel', { required: 'Please select your fitness level' })}
                    />
                    Advanced
                  </label>
                </div>
                {errors.fitnessLevel && <span className="field-error">{errors.fitnessLevel.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Preferred workout time</label>
                <select 
                  {...register('preferredTime')}
                  className="form-select"
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning (6-10 AM)</option>
                  <option value="afternoon">Afternoon (12-4 PM)</option>
                  <option value="evening">Evening (6-10 PM)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    {...register('notifications')}
                  />
                  Send me workout reminders and tips
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowEnrollForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Enroll Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlans;