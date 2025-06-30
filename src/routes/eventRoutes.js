const express = require('express');
const router = express.Router();

// Middleware
const requireAuth = require('../middlewares/requireAuth');

// Controllers
const {
    createEvent,
    getAllEvents,
    getEventById,
    joinEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

// Routes
// Create a new event
router.post('/', requireAuth, createEvent);
// Get all events
router.get('/', getAllEvents);
// Get a specific event by ID
router.get('/:eventId', getEventById);
// Join an event
router.post('/:eventId/join', requireAuth, joinEvent);
// Delete an event
router.post('/:eventId/leave', requireAuth, deleteEvent);
// Update an event
router.put('/:eventId', requireAuth, updateEvent);

module.exports = router;