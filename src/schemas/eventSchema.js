const mongoose = require('mongoose');
const { Schema } = mongoose;
const eventSchema = new Schema = ({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true,
        minlength: [2, 'Event name must be at least 2 characters'],
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
    },
    dateTime: {
        type: Date,
        required: [true, 'Date and time are required'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    attendeeCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    joinedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

module.exports = eventSchema;