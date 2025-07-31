import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/ExerciseLibrary.css';

const ExerciseLibrary = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Exercises', icon: '🏋' },
    { id: 'upper-body', name: 'Upper Body', icon: '💪' },
    { id: 'lower-body', name: 'Lower Body', icon: '🦵' },
    { id: 'core', name: 'Core', icon: '🔥' },
    { id: 'cardio', name: 'Cardio', icon: '❤' }
  ];

  const difficultyColors = {
    'Beginner': '#28a745',
    'Intermediate': '#ffc107',
    'Advanced': '#dc3545'
  };

  // Fetch exercises from backend
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log('🔄 Fetching exercises from API...');
        const response = await axios.get('http://localhost:5000/api/exercises');
        console.log('✅ API Response:', response.data);
        
        // Handle the API response structure: { success: true, data: [...], count: 12 }
        if (response.data.success && response.data.data) {
          setExercises(response.data.data);
          console.log(`📋 Loaded ${response.data.data.length} exercises`);
        } else {
          setExercises([]);
          console.warn('⚠️ No exercises data in response');
        }
        setError(null);
      } catch (err) {
        console.error('❌ Failed to fetch exercises:', err);
        setError('Failed to load exercises. Please try again later.');
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    
    const matchesSearch = searchTerm === '' || 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exercise.muscles && (
        typeof exercise.muscles === 'string' 
          ? exercise.muscles.toLowerCase().includes(searchTerm.toLowerCase())
          : Array.isArray(exercise.muscles) 
            ? exercise.muscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()))
            : false
      ));
    
    return matchesCategory && matchesSearch;
  });

  const openVideo = (videoId) => {
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    } else {
      alert('Video not available for this exercise');
    }
  };

  return (
    <div className="exercise-library-page">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h1>Exercise Library</h1>
          <p>Learn proper form with video demonstrations</p>
        </div>
      </div>

      <div className="exercise-library-container">
        <div className="search-filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search exercises or muscle groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="exercises-section">
          <div className="section-header">
            <h3>
              {selectedCategory === 'all'
                ? 'All Exercises'
                : categories.find(c => c.id === selectedCategory)?.name}
              <span className="exercise-count">({filteredExercises.length} exercises)</span>
            </h3>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">🔄</div>
              <p>Loading exercises...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">❌</div>
              <h3>Error Loading Exercises</h3>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="exercises-grid">
              {filteredExercises.map(exercise => (
                <div key={exercise.id} className="exercise-card">
                  <div className="exercise-thumbnail">
                    <img
                      src={exercise.videoId 
                        ? `https://img.youtube.com/vi/${exercise.videoId}/hqdefault.jpg`
                        : 'https://via.placeholder.com/480x360?text=No+Video'
                      }
                      alt={exercise.name}
                      className="thumbnail-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/480x360?text=No+Video';
                      }}
                    />
                    <div className="play-overlay" onClick={() => openVideo(exercise.videoId)}>
                      <div className="play-button">▶</div>
                    </div>
                    <div
                      className="difficulty-badge"
                      style={{ backgroundColor: difficultyColors[exercise.difficulty] || '#6c757d' }}
                    >
                      {exercise.difficulty || 'Unknown'}
                    </div>
                  </div>

                  <div className="exercise-info">
                    <h4 className="exercise-name">{exercise.name}</h4>
                    <p className="exercise-description">{exercise.description || 'No description available'}</p>

                    <div className="exercise-details">
                      <div className="detail-item">
                        <span className="detail-icon">⏱</span>
                        <span>{exercise.duration || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🎯</span>
                        <span>{
                          exercise.muscles 
                            ? (typeof exercise.muscles === 'string' 
                                ? exercise.muscles 
                                : Array.isArray(exercise.muscles) 
                                  ? exercise.muscles.join(', ')
                                  : 'N/A'
                              )
                            : 'N/A'
                        }</span>
                      </div>
                    </div>

                    <div className="exercise-actions">
                      <button
                        onClick={() => openVideo(exercise.videoId)}
                        className="btn btn-primary"
                        disabled={!exercise.videoId}
                      >
                        <span>📺</span> Watch Video
                      </button>
                      <button
                        onClick={() => alert('Added to your custom workout!')}
                        className="btn btn-secondary"
                      >
                        <span>➕</span> Add to Workout
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredExercises.length === 0 && (
            <div className="no-exercises">
              <div className="no-exercises-icon">🔍</div>
              <h3>No exercises found</h3>
              <p>Try adjusting your search or category filter</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="btn btn-primary"
              >
                Show All Exercises
              </button>
            </div>
          )}
        </div>

        <div className="youtube-attribution">
          <p>
            <span>📺</span> Exercise videos are sourced from YouTube for educational purposes
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseLibrary;