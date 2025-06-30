const userSchema = require('../schemas/userSchema');
const mongoose = require('mongoose');
const { model } = mongoose;

const User = model('User', userSchema);
module.exports = User;