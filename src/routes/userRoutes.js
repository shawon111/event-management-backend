const express = require('express');
const router = express.Router();

// Middleware
const requireAuth = require('../middlewares/requireAuth');
// Controllers
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile
} = require('../controllers/userController');

// Routes
// User registration route
router.post('/register', registerUser);
// User login route
router.post('/login', loginUser);
// User logout route
router.post('/logout', logoutUser);
// Get user profile route
router.get('/profile', requireAuth, getUserProfile);

module.exports = router;