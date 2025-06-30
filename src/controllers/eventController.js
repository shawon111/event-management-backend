const Event = require("../models/eventModel");

// Create event
const createEvent = async (req, res) => {
    const { title, name, description, dateTime, location } = req.body;
    // Validate input data
    const validateInput = await validateEvent(req.body);
    if (validateInput.error) {
        return res.status(400).json({ message: 'Validation failed', errors: validateInput.error.details.map(err => err.message) });
    }

    try {
        const event = await Event.create({
            title,
            name,
            description,
            dateTime,
            location,
            createdBy: req.user._id,
        });

        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ message: 'Event creation failed', error: err.message });
    }
};

// join event
const joinEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check if already joined
        const alreadyJoined = event.joinedUsers.includes(req.user._id);
        if (alreadyJoined) {
            return res.status(400).json({ message: 'You already joined this event' });
        }

        event.joinedUsers.push(req.user._id);
        event.attendeeCount = event.joinedUsers.length;
        const updatedEvent = await Event.findByIdAndUpdate(eventId, {
            joinedUsers: event.joinedUsers,
            attendeeCount: event.attendeeCount
        });

        res.status(200).json({ message: 'Successfully joined the event', attendeeCount: updatedEvent.attendeeCount });
    } catch (err) {
        res.status(500).json({ message: 'Failed to join event', error: err.message });
    }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const { search, filter } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Date filters
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));
    const startOfWeek = new Date(); startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(); endOfWeek.setDate(startOfWeek.getDate() + 6);
    const startOfLastWeek = new Date(startOfWeek); startOfLastWeek.setDate(startOfWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfWeek); endOfLastWeek.setDate(startOfWeek.getDate() - 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    if (filter === 'today') {
      query.dateTime = { $gte: todayStart, $lte: todayEnd };
    } else if (filter === 'current-week') {
      query.dateTime = { $gte: startOfWeek, $lte: endOfWeek };
    } else if (filter === 'last-week') {
      query.dateTime = { $gte: startOfLastWeek, $lte: endOfLastWeek };
    } else if (filter === 'current-month') {
      query.dateTime = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (filter === 'last-month') {
      query.dateTime = { $gte: startOfLastMonth, $lte: endOfLastMonth };
    }

    const events = await Event.find(query).sort({ dateTime: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get events', error: err.message });
  }
};


// Get my events
const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user._id }).sort({ dateTime: -1 });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get events', error: err.message });
    }
};

// Update an event
const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (!event.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        const updates = req.body;
        const updated = await Event.findByIdAndUpdate(eventId, updates);
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update event', error: err.message });
    }
};

// Delete an event
const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (!event.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await Event.findByIdAndDelete(eventId);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        next(err);
    }
};

const eventController = {
    createEvent,
    joinEvent,
    getAllEvents,
    getMyEvents,
    updateEvent,
    deleteEvent
};

module.exports = eventController;