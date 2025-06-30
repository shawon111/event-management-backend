const express = require('express');
const cors = require('cors');
const requireAuth = require('./middlewares/requireAuth');
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

// entry route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Eevent management app API',
        status: 'success',
    });
});

module.exports = app;