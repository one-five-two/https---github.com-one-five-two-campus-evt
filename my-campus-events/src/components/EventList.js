import React, { useState, useEffect } from 'react';
import { events } from '../services/api';

const EventList = () => {
  const [eventList, setEventList] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    date: ''
  });

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      const response = await events.getAll(filters);
      setEventList(response.data.events);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await events.register(eventId);
      loadEvents(); // Refresh list after registration
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  return (
    <div className="events-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Search events..."
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="academic">Academic</option>
          <option value="sports">Sports</option>
          <option value="cultural">Cultural</option>
          <option value="technology">Technology</option>
          <option value="other">Other</option>
        </select>
        <input
          type="date"
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>

      <div className="events-list">
        {eventList.map((event) => (
          <div key={event._id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Time: {event.time}</p>
            <p>Location: {event.location}</p>
            <p>Category: {event.category}</p>
            <p>Capacity: {event.registeredUsers?.length || 0}/{event.capacity}</p>
            <button onClick={() => handleRegister(event._id)}>
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList; 