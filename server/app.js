const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Load .env file only if not in test
if (process.env.NODE_ENV !== 'test') {
    dotenv.config();
}

// Set default JWT_SECRET for test
if (process.env.NODE_ENV === 'test' && !process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'testsecretkey12345';
}

console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting - only in production/development
if (process.env.NODE_ENV !== 'test') {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: { success: false, message: 'Terlalu banyak request. Coba lagi nanti.' }
    });
    app.use('/api/', limiter);
}

// Static files
if (process.env.NODE_ENV !== 'test') {
    app.use(express.static('public'));
}

// Routes API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

// Serve frontend (skip in test)
if (process.env.NODE_ENV !== 'test') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server'
    });
});

module.exports = app;