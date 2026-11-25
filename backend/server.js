const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const { connectMongoDB } = require('./config/mongodb');

// Optional MongoDB Connection (Compass / Atlas)
connectMongoDB();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');
const foodRoutes = require('./routes/foodRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const waterRoutes = require('./routes/waterRoutes');
const fitnessRoutes = require('./routes/fitnessRoutes');
const mealRoutes = require('./routes/mealRoutes');
const historyRoutes = require('./routes/historyRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & Body Parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path to the web frontend directory
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// Serve static frontend files from ../frontend/
app.use(express.static(FRONTEND_DIR));

// API Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/healthcheck', (req, res) => {
    res.status(200).json({
        status: 'online',
        app: 'NutriRoute AI-Powered Health-Aware System',
        timestamp: new Date().toISOString()
    });
});

// Fallback to index.html for main routing
app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start HTTP Server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🍃 NutriRoute Server running on http://localhost:${PORT}`);
    console.log(`====================================================`);
});
