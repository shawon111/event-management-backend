const express = require('express');
const cors = require('cors');
const app = express();

// app configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'https://example.com'];
const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);

// entry route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Eevent management app API',
        status: 'success',
    });
});

// global error handler
app.use((err, req, res, next) => {
    console.error('Unexpected Error:', err.stack);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
    });
});

module.exports = app;