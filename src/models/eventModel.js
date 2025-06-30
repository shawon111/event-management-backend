const eventSchema = require('../schemas/eventSchema');
const mongoose = require('mongoose');
const { model } = mongoose;

const Event = model('Event', eventSchema);
module.exports = Event;