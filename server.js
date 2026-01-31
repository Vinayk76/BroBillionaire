// ============================================
// BROBILLIONAIRE - Backend Server
// MongoDB Integration for Newsletter Subscriptions
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection String
const MONGODB_URI = 'mongodb+srv://vinay91098_db_user:<db_password>@cluster0.hbhhpo6.mongodb.net/brobillionaire';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Schema for Subscribers
const subscriberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    tradingInterest: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

// Create model with collection name 'subscribe_brobillionaire'
const Subscriber = mongoose.model('Subscriber', subscriberSchema, 'subscribe_brobillionaire');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        console.log('📦 Collection: subscribe_brobillionaire');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
    });

// API Routes

// POST - Subscribe new user
app.post('/api/subscribe', async (req, res) => {
    try {
        const { firstName, lastName, email, tradingInterest, experienceLevel } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !tradingInterest || !experienceLevel) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if email already exists
        const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existingSubscriber) {
            return res.status(409).json({
                success: false,
                message: 'This email is already subscribed!'
            });
        }

        // Create new subscriber
        const subscriber = new Subscriber({
            firstName,
            lastName,
            email,
            tradingInterest,
            experienceLevel
        });

        await subscriber.save();

        console.log(`📧 New subscriber: ${email}`);

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to BroBillionaire!'
        });

    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// GET - Check server status
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 BroBillionaire Server running on http://localhost:${PORT}`);
    console.log('📝 Subscribe endpoint: POST /api/subscribe\n');
});
