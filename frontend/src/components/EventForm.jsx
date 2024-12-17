import React, { useState } from 'react';
import { events } from '../services/api';

const EventForm = ({ onEventCreated }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    capacity: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await events.create(eventData);
      onEventCreated(); // Callback to refresh event list
      // Clear form
      setEventData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        capacity: ''
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Event Title"
        value={eventData.title}
        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
        required
      />
      {/* Add other form fields similarly */}
      <button type="submit">Create Event</button>
    </form>
  );
};

export default EventForm; 