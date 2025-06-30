const { generateAccessToken, generateRefreshToken } = require("../utils/manageTokens");

const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { validateUser, validateLogin } = require("../utils/dataValidator");

// Register user
const registerUser = async (req, res) => {
    const { name, email, password, photoURL } = req.body;
    // Validate input data
    const validateInput = await validateUser(req.body)
    if (validateInput.error) {
        return res.status(400).json({ message: 'Validation failed', errors: validateInput.error.details.map(err => err.message) });
    }

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: 'Email already registered' });
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            photoURL,
        }).select("-password");

        if (!user) {
            return res.status(400).json({ message: 'User registration failed' });
        }

        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input data
    const validateInput = await validateLogin(req.body)
    if (validateInput.error) {
        return res.status(400).json({ message: 'Validation failed', errors: validateInput.error.details.map(err => err.message) });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

// Logout user
const logoutUser = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'None',
    });

    res.status(200).json({ message: 'Logged out successfully' });
};

// Get user profile
const getUserProfile = async (req, res) => {
    const { user } = req;
    try {
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
    }
}

const userController = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile
};

module.exports = userController;