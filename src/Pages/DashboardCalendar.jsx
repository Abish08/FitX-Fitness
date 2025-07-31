import React, { useState, useEffect } from 'react';
import '../Styles/DashboardCalendar.css';

const DashboardCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'workout',
    time: '',
    description: '',
    date: ''
  });

  // Event types for fitness activities
  const eventTypes = {
    workout: { color: '#4CAF50', label: 'Workout', icon: '💪' },
    cardio: { color: '#FF5722', label: 'Cardio', icon: '🏃' },
    nutrition: { color: '#FF9800', label: 'Nutrition', icon: '🥗' },
    rest: { color: '#2196F3', label: 'Rest Day', icon: '😴' },
    measurement: { color: '#9C27B0', label: 'Progress Check', icon: '📏' }
  };

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('fitnessEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Add some sample events for demo
      const sampleEvents = [
        {
          id: 1,
          title: 'Morning Cardio Blast',
          type: 'cardio',
          time: '07:00',
          description: 'HIIT Training',
          date: getTodayString(),
          status: 'completed'
        },
        {
          id: 2,
          title: 'Nutrition Check-in',
          type: 'nutrition',
          time: '12:00',
          description: 'Meal Planning',
          date: getTodayString(),
          status: 'pending'
        },
        {
          id: 3,
          title: 'Strength Training',
          type: 'workout',
          time: '18:00',
          description: 'Weight Training',
          date: getTodayString(),
          status: 'scheduled'
        }
      ];
      setEvents(sampleEvents);
      localStorage.setItem('fitnessEvents', JSON.stringify(sampleEvents));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('fitnessEvents', JSON.stringify(events));
  }, [events]);

  function getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateStr === getTodayString()) return 'Today';
    if (dateStr === formatDateString(tomorrow)) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  function formatDateString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // Get current week dates
  function getCurrentWeekDates() {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(formatDateString(date));
    }
    return weekDates;
  }

  // Get events for specific date
  function getEventsForDate(dateStr) {
    return events.filter(event => event.date === dateStr)
                 .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }

  // Get today's events
  function getTodaysEvents() {
    return getEventsForDate(getTodayString());
  }

  // Event handlers
  function handleSaveEvent() {
    if (!newEvent.title || !newEvent.date) return;

    const eventToSave = {
      ...newEvent,
      id: editingEvent ? editingEvent.id : Date.now(),
      status: 'scheduled'
    };

    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id ? eventToSave : event
      ));
    } else {
      setEvents([...events, eventToSave]);
    }

    resetModal();
  }

  function handleDeleteEvent(eventId) {
    setEvents(events.filter(event => event.id !== eventId));
  }

  function toggleEventStatus(eventId) {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const statusOrder = ['scheduled', 'pending', 'completed'];
        const currentIndex = statusOrder.indexOf(event.status || 'scheduled');
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
        return { ...event, status: nextStatus };
      }
      return event;
    }));
  }

  function openModal(event = null) {
    if (event) {
      setEditingEvent(event);
      setNewEvent(event);
    } else {
      setEditingEvent(null);
      setNewEvent({
        title: '',
        type: 'workout',
        time: '',
        description: '',
        date: getTodayString()
      });
    }
    setShowModal(true);
  }

  function resetModal() {
    setShowModal(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      type: 'workout',
      time: '',
      description: '',
      date: ''
    });
  }

  const todaysEvents = getTodaysEvents();

  return (
    <div className="dashboard-calendar">
      {/* Week Schedule Header */}
      <div className="schedule-header">
        <h3>This Week Schedule</h3>
        <div className="schedule-actions">
          <button 
            className="calendar-view-btn"
            onClick={() => setShowFullCalendar(!showFullCalendar)}
          >
            {showFullCalendar ? 'Week View' : 'Calendar View'}
          </button>
          <button 
            className="add-event-btn"
            onClick={() => openModal()}
          >
            + Add Event
          </button>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="todays-schedule">
        <h4>Today, {formatDate(getTodayString())}</h4>
        {todaysEvents.length === 0 ? (
          <div className="no-events">
            <p>No events scheduled for today</p>
            <button 
              className="add-first-event"
              onClick={() => openModal()}
            >
              Add your first event
            </button>
          </div>
        ) : (
          <div className="events-list">
            {todaysEvents.map(event => (
              <div 
                key={event.id} 
                className={`event-item ${event.status || 'scheduled'}`}
                onClick={() => toggleEventStatus(event.id)}
              >
                <div className="event-time">
                  {event.time || 'All Day'}
                </div>
                <div className="event-content">
                  <div className="event-header">
                    <span className="event-icon">
                      {eventTypes[event.type]?.icon || '📅'}
                    </span>
                    <span className="event-title">{event.title}</span>
                    <span className={`event-status ${event.status || 'scheduled'}`}>
                      {event.status === 'completed' ? '✅' : 
                       event.status === 'pending' ? '🔄' : '⏰'}
                    </span>
                  </div>
                  <div className="event-details">
                    <span className="event-type">{eventTypes[event.type]?.label}</span>
                    {event.description && (
                      <span className="event-description"> - {event.description}</span>
                    )}
                  </div>
                </div>
                <div className="event-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(event);
                    }}
                    className="edit-btn"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Week Overview */}
      {!showFullCalendar && (
        <div className="week-overview">
          <div className="week-grid">
            {getCurrentWeekDates().map(date => {
              const dayEvents = getEventsForDate(date);
              const isToday = date === getTodayString();
              
              return (
                <div key={date} className={`week-day ${isToday ? 'today' : ''}`}>
                  <div className="day-header">
                    <span className="day-name">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="day-number">
                      {new Date(date).getDate()}
                    </span>
                  </div>
                  <div className="day-events">
                    {dayEvents.slice(0, 2).map(event => (
                      <div 
                        key={event.id}
                        className="mini-event"
                        style={{ borderLeft: `3px solid ${eventTypes[event.type]?.color}` }}
                      >
                        <span className="mini-event-icon">
                          {eventTypes[event.type]?.icon}
                        </span>
                        <span className="mini-event-title">
                          {event.title.length > 15 ? 
                            event.title.substring(0, 15) + '...' : 
                            event.title}
                        </span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="more-events">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Calendar View */}
      {showFullCalendar && (
        <div className="full-calendar">
          <div className="calendar-header">
            <button 
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}
            >
              ‹
            </button>
            <h3>
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            <button 
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
            >
              ›
            </button>
          </div>
          
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            
            <div className="calendar-days">
              {Array.from({ length: 35 }, (_, index) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                date.setDate(date.getDate() - date.getDay() + index);
                const dateStr = formatDateString(date);
                const dayEvents = getEventsForDate(dateStr);
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isToday = dateStr === getTodayString();
                
                return (
                  <div 
                    key={index}
                    className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}`}
                    onClick={() => openModal({ ...newEvent, date: dateStr })}
                  >
                    <span className="day-number">{date.getDate()}</span>
                    <div className="day-events">
                      {dayEvents.slice(0, 3).map(event => (
                        <div 
                          key={event.id}
                          className="calendar-event"
                          style={{ backgroundColor: eventTypes[event.type]?.color }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding/editing events */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
              <button onClick={resetModal} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="e.g. Morning Workout"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
                  {Object.entries(eventTypes).map(([type, config]) => (
                    <option key={type} value={type}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Additional details..."
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={resetModal} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleSaveEvent} className="save-btn">
                {editingEvent ? 'Update' : 'Save'} Event
              </button>
              {editingEvent && (
                <button 
                  onClick={() => {
                    handleDeleteEvent(editingEvent.id);
                    resetModal();
                  }} 
                  className="delete-btn"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCalendar;