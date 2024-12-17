import React, { useState, useEffect } from 'react';
import { events } from '../services/api';
import '../styles/Events.css';

const Events = () => {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await events.getAll();
      console.log('Events response:', response); // Debug log
      if (response && response.events) {
        setEventsList(response.events);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events-page">
      <h1>Campus Events</h1>
      <div className="events-grid">
        {eventsList.map(event => (
          <div key={event._id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <div className="event-details">
              <span>{new Date(event.date).toLocaleDateString()}</span>
              <span>{event.time}</span>
              <span>{event.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;