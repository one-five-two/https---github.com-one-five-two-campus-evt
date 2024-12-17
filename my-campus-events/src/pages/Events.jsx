import React, { useState, useEffect } from 'react';
import { events } from '../services/api';
import '../styles/Events.css';

const Events = () => {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await events.getAll();
      setEventsList(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load events');
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await events.register(eventId);
      // Refresh events list after registration
      fetchEvents();
    } catch (error) {
      setError('Failed to register for event');
    }
  };

  const filterAndSortEvents = (events) => {
    let filtered = events;
    
    // Category filter
    if (filter !== 'all') {
      filtered = filtered.filter(event => event.category === filter);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Campus Events</h1>
        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'academic' ? 'active' : ''} 
            onClick={() => setFilter('academic')}
          >
            Academic
          </button>
          <button 
            className={filter === 'social' ? 'active' : ''} 
            onClick={() => setFilter('social')}
          >
            Social
          </button>
          <button 
            className={filter === 'cultural' ? 'active' : ''} 
            onClick={() => setFilter('cultural')}
          >
            Cultural
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      <div className="events-grid">
        {filterAndSortEvents(eventsList).map(event => (
          <div key={event._id} className="event-card">
            <div className="event-image">
              <img src={event.image || '/default-event.jpg'} alt={event.title} />
              <div className="event-category">{event.category}</div>
            </div>
            <div className="event-content">
              <h3>{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <div className="event-details">
                <div className="detail">
                  <i className="far fa-calendar"></i>
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="detail">
                  <i className="far fa-clock"></i>
                  {new Date(event.date).toLocaleTimeString()}
                </div>
                <div className="detail">
                  <i className="fas fa-map-marker-alt"></i>
                  {event.location}
                </div>
              </div>
              <button 
                onClick={() => handleRegister(event._id)}
                className="register-button"
                disabled={event.isRegistered}
              >
                {event.isRegistered ? 'Registered' : 'Register Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
