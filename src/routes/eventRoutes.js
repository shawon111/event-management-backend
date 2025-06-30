const express = require('express');
const router = express.Router();

// Middleware
const requireAuth = require('../middlewares/requireAuth');

// Controllers
const {
    createEvent,
    joinEvent,
    getAllEvents,
    getMyEvents,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

// Routes
// Create a new event
router.post('/', requireAuth, createEvent);
// Get all events
router.get('/', getAllEvents);
// Get event by specific user
router.get('/:userId', getMyEvents);
// Join an event
router.post('/:eventId/join', requireAuth, joinEvent);
// Delete an event
router.post('/:eventId/delete', requireAuth, deleteEvent);
// Update an event
router.put('/:eventId', requireAuth, updateEvent);

module.exports = router;