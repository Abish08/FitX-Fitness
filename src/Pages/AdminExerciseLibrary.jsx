import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../Styles/AdminExerciseLibrary.css';

const AdminExerciseLibrary = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  // State management
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    difficulty: 'All'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showModals, setShowModals] = useState({
    add: false,
    edit: false,
    view: false
  });
  const [currentExercise, setCurrentExercise] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Form state
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    category: 'upper-body',
    difficulty: 'Beginner',
    duration: '',
    muscles: '',
    videoId: ''
  });

  const categories = ['All', 'upper-body', 'lower-body', 'core', 'cardio'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/admin-login', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch exercises from backend
  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching exercises from backend...');
      
      const response = await axios.get('http://localhost:5000/api/exercises');
      
      if (response.data.success) {
        console.log(`✅ Loaded ${response.data.data.length} exercises from backend`);
        
        // Transform backend data to match our component structure
        const transformedExercises = response.data.data.map(exercise => ({
          id: exercise.id,
          name: exercise.name || 'Unnamed Exercise',
          category: exercise.category || 'upper-body',
          difficulty: exercise.difficulty || 'Beginner',
          duration: exercise.duration || '30 seconds',
          muscles: typeof exercise.muscles === 'string' ? exercise.muscles : 'N/A',
          videoId: exercise.videoId || '',
          description: exercise.description || 'No description available',
          equipment: 'None',
          calories: 8,
          reps: '10-15',
          sets: 3,
          status: 'Active',
          created: exercise.created_at ? exercise.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          createdBy: 'Admin',
          lastModified: new Date().toISOString().split('T')[0],
          usageCount: Math.floor(Math.random() * 1000),
          rating: (Math.random() * 2 + 3).toFixed(1),
          approved: true,
          featured: Math.random() > 0.7,
          tags: [exercise.category || 'general']
        }));
        
        setExercises(transformedExercises);
      }
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching exercises:', err);
      setError('Failed to load exercises from server');
    } finally {
      setLoading(false);
    }
  };

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Filter and sort exercises
  useEffect(() => {
    let filtered = exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.muscles.toLowerCase().includes(searchTerm.toLowerCase());
     
      const matchesCategory = filters.category === 'All' || exercise.category === filters.category;
      const matchesDifficulty = filters.difficulty === 'All' || exercise.difficulty === filters.difficulty;
     
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort exercises
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
     
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
     
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredExercises(filtered);
  }, [exercises, searchTerm, filters, sortBy, sortOrder]);

  // Modal handlers
  const openModal = (type, exercise = null) => {
    setShowModals(prev => ({ ...prev, [type]: true }));
    if (exercise) {
      setCurrentExercise(exercise);
      if (type === 'edit') {
        setExerciseForm({
          name: exercise.name,
          category: exercise.category,
          difficulty: exercise.difficulty,
          duration: exercise.duration,
          muscles: exercise.muscles,
          videoId: exercise.videoId
        });
      }
    }
  };

  const closeModal = (type) => {
    setShowModals(prev => ({ ...prev, [type]: false }));
    setCurrentExercise(null);
    if (type === 'add' || type === 'edit') {
      setExerciseForm({
        name: '',
        category: 'upper-body',
        difficulty: 'Beginner',
        duration: '',
        muscles: '',
        videoId: ''
      });
    }
  };

  // CRUD operations
  const handleAddExercise = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      console.log('📝 Creating new exercise:', exerciseForm);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(
        'http://localhost:5000/api/exercises',
        exerciseForm,
        config
      );
      
      if (response.data.success) {
        alert('Exercise created successfully!');
        await fetchExercises();
        closeModal('add');
      }
    } catch (err) {
      console.error('❌ Error creating exercise:', err);
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.');
        navigate('/admin-login');
      } else {
        alert('Failed to create exercise: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleEditExercise = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      console.log('📝 Updating exercise:', currentExercise.id);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.put(
        `http://localhost:5000/api/exercises/${currentExercise.id}`,
        exerciseForm,
        config
      );
      
      if (response.data.success) {
        alert('Exercise updated successfully!');
        await fetchExercises();
        closeModal('edit');
      }
    } catch (err) {
      console.error('❌ Error updating exercise:', err);
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.');
        navigate('/admin-login');
      } else {
        alert('Failed to update exercise: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDeleteExercise = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      console.log('🗑️ Deleting exercise:', id);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.delete(
        `http://localhost:5000/api/exercises/${id}`,
        config
      );

      if (response.data.success) {
        alert('Exercise deleted successfully!');
        await fetchExercises();
        setSelectedExercises(selectedExercises.filter(exId => exId !== id));
      }
    } catch (err) {
      console.error('❌ Error deleting exercise:', err);
      alert('Failed to delete exercise: ' + (err.response?.data?.message || err.message));
    }
  };

  const toggleExerciseSelection = (id) => {
    setSelectedExercises(prev =>
      prev.includes(id) ? prev.filter(exId => exId !== id) : [...prev, id]
    );
  };

  const selectAllExercises = () => {
    if (selectedExercises.length === filteredExercises.length) {
      setSelectedExercises([]);
    } else {
      setSelectedExercises(filteredExercises.map(ex => ex.id));
    }
  };

  // Analytics data
  const analytics = {
    total: exercises.length,
    active: exercises.filter(ex => ex.status === 'Active').length,
    featured: exercises.filter(ex => ex.featured).length,
    avgRating: exercises.length > 0 ? (exercises.reduce((sum, ex) => sum + parseFloat(ex.rating), 0) / exercises.length).toFixed(1) : '0.0',
    totalUsage: exercises.reduce((sum, ex) => sum + ex.usageCount, 0),
    mostPopular: exercises.length > 0 ? exercises.reduce((prev, current) => prev.usageCount > current.usageCount ? prev : current) : { name: 'None', usageCount: 0 }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="admin-exercise-library">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <div>Loading exercises...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-exercise-library">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <div>{error}</div>
          <button onClick={fetchExercises} style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#6366f1', color: 'white' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-exercise-library">
      {/* Header */}
      <div className="library-header">
        <div className="header-content">
          <button onClick={() => navigate('/admin-dashboard')} className="back-button">
            ← Back to Dashboard
          </button>
          <h1>Exercise Library Management</h1>
          <p>Manage and organize your exercise database ({exercises.length} exercises)</p>
        </div>
       
        <div className="header-actions">
          <button
            className={`analytics-toggle ${showAnalytics ? 'active' : ''}`}
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            📊 Analytics
          </button>
          <button className="add-exercise-button" onClick={() => openModal('add')}>
            + Add Exercise
          </button>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="analytics-panel">
          <div className="analytics-header">
            <h3>📊 Library Analytics</h3>
            <button onClick={() => setShowAnalytics(false)} className="close-analytics">×</button>
          </div>
         
          <div className="analytics-stats">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-value">{analytics.total}</div>
                <div className="stat-label">Total Exercises</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">{analytics.active}</div>
                <div className="stat-label">Active</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">{analytics.featured}</div>
                <div className="stat-label">Featured</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-value">{analytics.avgRating}</div>
                <div className="stat-label">Avg Rating</div>
              </div>
            </div>
          </div>
          
          <div className="popular-exercise">
            <h4>🏆 Most Popular Exercise</h4>
            <div className="popular-info">
              <span className="popular-name">{analytics.mostPopular.name}</span>
              <span className="popular-usage">{analytics.mostPopular.usageCount} uses</span>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search exercises by name, description, or muscle groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
        </div>
        <div className="filters-row">
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            className="filter-select"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="created">Sort by Date</option>
            <option value="usageCount">Sort by Popularity</option>
            <option value="rating">Sort by Rating</option>
          </select>
          <button
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        <div className="view-controls">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰ List
            </button>
          </div>
          {selectedExercises.length > 0 && (
            <button className="bulk-actions-btn">
              Bulk Actions ({selectedExercises.length})
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <div className="results-info">
          <span>Showing {filteredExercises.length} of {exercises.length} exercises</span>
          {selectedExercises.length > 0 && (
            <span className="selected-count">{selectedExercises.length} selected</span>
          )}
        </div>
       
        <button onClick={selectAllExercises} className="select-all-btn">
          {selectedExercises.length === filteredExercises.length && filteredExercises.length > 0
            ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Exercise Grid */}
      <div className={`exercises-container ${viewMode}`}>
        {filteredExercises.map(exercise => (
          <div
            key={exercise.id}
            className={`exercise-card ${selectedExercises.includes(exercise.id) ? 'selected' : ''}`}
          >
            <div className="exercise-checkbox">
              <input
                type="checkbox"
                checked={selectedExercises.includes(exercise.id)}
                onChange={() => toggleExerciseSelection(exercise.id)}
              />
            </div>
            <div className="exercise-thumbnail">
              <img
                src={exercise.videoId 
                  ? `https://img.youtube.com/vi/${exercise.videoId}/hqdefault.jpg`
                  : 'https://via.placeholder.com/320x180/667eea/ffffff?text=No+Video'
                }
                alt={exercise.name}
                className="thumbnail-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/320x180/667eea/ffffff?text=No+Video';
                }}
              />
             
              <div className="exercise-badges">
                <span className={`difficulty-badge ${exercise.difficulty.toLowerCase()}`}>
                  {exercise.difficulty}
                </span>
                <span className={`status-badge ${exercise.status.toLowerCase()}`}>
                  {exercise.status}
                </span>
                {exercise.featured && <span className="featured-badge">⭐ Featured</span>}
              </div>
            </div>
            <div className="exercise-content">
              <div className="exercise-header">
                <h4 className="exercise-name">{exercise.name}</h4>
                <div className="exercise-rating">
                  <span className="rating-stars">⭐</span>
                  <span className="rating-value">{exercise.rating}</span>
                </div>
              </div>
              <p className="exercise-description">{exercise.description}</p>
             
              <div className="exercise-tags">
                {exercise.tags.map(tag => (
                  <span key={tag} className="exercise-tag">#{tag}</span>
                ))}
              </div>
              
              <div className="exercise-meta">
                <div className="meta-item">
                  <span className="meta-icon">⏱️</span>
                  <span>{exercise.duration}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🎯</span>
                  <span>{exercise.muscles}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📊</span>
                  <span>{exercise.usageCount} uses</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📂</span>
                  <span>{exercise.category}</span>
                </div>
              </div>
              
              <div className="exercise-footer">
                <div className="exercise-info">
                  <span>Created by {exercise.createdBy}</span>
                  <span>ID: {exercise.id}</span>
                </div>
                <div className="exercise-actions">
                  <button
                    className="action-btn view"
                    onClick={() => openModal('view', exercise)}
                    title="View Details"
                  >
                    👁️
                  </button>
                  <button
                    className="action-btn edit"
                    onClick={() => openModal('edit', exercise)}
                    title="Edit Exercise"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteExercise(exercise.id, exercise.name)}
                    title="Delete Exercise"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredExercises.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No exercises found</h3>
          <p>Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ category: 'All', difficulty: 'All' });
            }}
            className="reset-filters-btn"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Add Exercise Modal */}
      {showModals.add && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Add New Exercise</h3>
              <button onClick={() => closeModal('add')} className="close-btn">×</button>
            </div>
           
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Exercise Name *</label>
                  <input
                    type="text"
                    value={exerciseForm.name}
                    onChange={(e) => setExerciseForm({...exerciseForm, name: e.target.value})}
                    placeholder="Enter exercise name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={exerciseForm.category}
                    onChange={(e) => setExerciseForm({...exerciseForm, category: e.target.value})}
                    required
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={exerciseForm.difficulty}
                    onChange={(e) => setExerciseForm({...exerciseForm, difficulty: e.target.value})}
                  >
                    {difficulties.slice(1).map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={exerciseForm.duration}
                    onChange={(e) => setExerciseForm({...exerciseForm, duration: e.target.value})}
                    placeholder="e.g., 30 seconds"
                  />
                </div>
                <div className="form-group">
                  <label>Target Muscles</label>
                  <input
                    type="text"
                    value={exerciseForm.muscles}
                    onChange={(e) => setExerciseForm({...exerciseForm, muscles: e.target.value})}
                    placeholder="e.g., Chest, Triceps, Shoulders"
                  />
                </div>
                <div className="form-group">
                  <label>YouTube Video ID</label>
                  <input
                    type="text"
                    value={exerciseForm.videoId}
                    onChange={(e) => setExerciseForm({...exerciseForm, videoId: e.target.value})}
                    placeholder="e.g., IODxDxX7oi4"
                  />
                </div>
              </div>
            </div>
           
            <div className="modal-footer">
              <button onClick={() => closeModal('add')} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleAddExercise} className="btn-primary">
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exercise Modal */}
      {showModals.edit && currentExercise && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Edit Exercise</h3>
              <button onClick={() => closeModal('edit')} className="close-btn">×</button>
            </div>
           
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Exercise Name *</label>
                  <input
                    type="text"
                    value={exerciseForm.name}
                    onChange={(e) => setExerciseForm({...exerciseForm, name: e.target.value})}
                    placeholder="Enter exercise name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={exerciseForm.category}
                    onChange={(e) => setExerciseForm({...exerciseForm, category: e.target.value})}
                    required
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={exerciseForm.difficulty}
                    onChange={(e) => setExerciseForm({...exerciseForm, difficulty: e.target.value})}
                  >
                    {difficulties.slice(1).map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={exerciseForm.duration}
                    onChange={(e) => setExerciseForm({...exerciseForm, duration: e.target.value})}
                    placeholder="e.g., 30 seconds"
                  />
                </div>
                <div className="form-group">
                  <label>Target Muscles</label>
                  <input
                    type="text"
                    value={exerciseForm.muscles}
                    onChange={(e) => setExerciseForm({...exerciseForm, muscles: e.target.value})}
                    placeholder="e.g., Chest, Triceps, Shoulders"
                  />
                </div>
                <div className="form-group">
                  <label>YouTube Video ID</label>
                  <input
                    type="text"
                    value={exerciseForm.videoId}
                    onChange={(e) => setExerciseForm({...exerciseForm, videoId: e.target.value})}
                    placeholder="e.g., IODxDxX7oi4"
                  />
                </div>
              </div>
            </div>
           
            <div className="modal-footer">
              <button onClick={() => closeModal('edit')} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleEditExercise} className="btn-primary">
                Update Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Exercise Modal */}
      {showModals.view && currentExercise && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>{currentExercise.name}</h3>
              <button onClick={() => closeModal('view')} className="close-btn">×</button>
            </div>
           
            <div className="modal-body">
              <div className="exercise-details">
                <div className="detail-section">
                  <h4>📋 Basic Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{currentExercise.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Difficulty:</span>
                      <span className="detail-value">{currentExercise.difficulty}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{currentExercise.duration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Target Muscles:</span>
                      <span className="detail-value">{currentExercise.muscles}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>📝 Description</h4>
                  <p className="exercise-description-full">{currentExercise.description}</p>
                </div>
                
                <div className="detail-section">
                  <h4>📊 Statistics</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Usage Count:</span>
                      <span className="stat-value">{currentExercise.usageCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Rating:</span>
                      <span className="stat-value">⭐ {currentExercise.rating}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Status:</span>
                      <span className="stat-value">{currentExercise.status}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Featured:</span>
                      <span className="stat-value">{currentExercise.featured ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>📅 History</h4>
                  <div className="history-info">
                    <p>Created by <strong>{currentExercise.createdBy}</strong> on {currentExercise.created}</p>
                    <p>Exercise ID: {currentExercise.id}</p>
                    {currentExercise.videoId && (
                      <p>Video ID: {currentExercise.videoId}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
           
            <div className="modal-footer">
              {currentExercise.videoId && (
                <button
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${currentExercise.videoId}`, '_blank')}
                  className="btn-secondary"
                >
                  🎥 Watch Video
                </button>
              )}
              <button onClick={() => {
                closeModal('view');
                openModal('edit', currentExercise);
              }} className="btn-primary">
                ✏️ Edit Exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExerciseLibrary;