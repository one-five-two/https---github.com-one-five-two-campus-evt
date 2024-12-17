const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const mongoose = require('mongoose');

// Get all events (no auth required)
router.get('/', async (req, res) => {
  try {
    console.log('GET /events - Start');
    const events = await Event.find().lean();
    console.log('Found events:', events);
    res.json({
      events: events || [],
      totalPages: 1,
      currentPage: 1
    });
  } catch (error) {
    console.error('GET /events - Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create event (no auth required for testing)
router.post('/', async (req, res) => {
  try {
    console.log('Creating event with data:', req.body);
    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location || 'TBD',
      category: req.body.category
    });

    await event.save();
    console.log('Event created:', event);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 