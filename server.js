// ============================================
// BROBILLIONAIRE - Backend Server
// MongoDB Integration for Newsletter Subscriptions
// API Proxy for Crypto Data (with .env support)
// ============================================

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection String from .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vinay91098_db_user:JJ3NQLMpe3K2Uvu1@cluster0.hbhhpo6.mongodb.net/brobillionaire';

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

// MongoDB Schema for Contact Messages
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Create model with collection name 'contacts_brobillionaire'
const Contact = mongoose.model('Contact', contactSchema, 'contacts_brobillionaire');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        console.log('📦 Collections: subscribe_brobillionaire, contacts_brobillionaire');
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

// POST - Submit contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Create new contact message
        const contact = new Contact({
            name,
            email,
            subject,
            message
        });

        await contact.save();

        console.log(`📩 New contact message from: ${email} - Subject: ${subject}`);

        res.status(201).json({
            success: true,
            message: 'Thank you! Your message has been sent successfully.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
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

// ============================================
// CRYPTO API PROXY ROUTES
// These allow HTML files to call /api/* endpoints
// Benefits: Hide API keys, avoid CORS, add caching
// ============================================

// Helper function for fetch (Node 18+)
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

// Fear & Greed Index Proxy
app.get('/api/fear-greed', async (req, res) => {
    try {
        const limit = req.query.limit || 31;
        const response = await fetchWithTimeout(`https://api.alternative.me/fng/?limit=${limit}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Fear & Greed API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch fear & greed data' });
    }
});

// CoinGecko Markets Proxy (with optional API key from .env)
app.get('/api/crypto/markets', async (req, res) => {
    try {
        const { vs_currency = 'usd', per_page = 8, page = 1 } = req.query;
        
        let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=false&price_change_percentage=24h`;
        
        const headers = {};
        if (process.env.COINGECKO_API_KEY) {
            url = url.replace('api.coingecko.com', 'pro-api.coingecko.com');
            headers['x-cg-pro-api-key'] = process.env.COINGECKO_API_KEY;
        }
        
        const response = await fetchWithTimeout(url, { headers });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('CoinGecko Markets API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch market data' });
    }
});

// CoinGecko Global Data Proxy
app.get('/api/crypto/global', async (req, res) => {
    try {
        let url = 'https://api.coingecko.com/api/v3/global';
        
        const headers = {};
        if (process.env.COINGECKO_API_KEY) {
            url = url.replace('api.coingecko.com', 'pro-api.coingecko.com');
            headers['x-cg-pro-api-key'] = process.env.COINGECKO_API_KEY;
        }
        
        const response = await fetchWithTimeout(url, { headers });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('CoinGecko Global API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch global data' });
    }
});

// CoinGecko Simple Price Proxy
app.get('/api/crypto/price', async (req, res) => {
    try {
        const { ids = 'bitcoin', vs_currencies = 'usd' } = req.query;
        
        let url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs_currencies}`;
        
        const headers = {};
        if (process.env.COINGECKO_API_KEY) {
            url = url.replace('api.coingecko.com', 'pro-api.coingecko.com');
            headers['x-cg-pro-api-key'] = process.env.COINGECKO_API_KEY;
        }
        
        const response = await fetchWithTimeout(url, { headers });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('CoinGecko Price API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch price data' });
    }
});

// Generic CoinGecko Proxy (for any endpoint)
app.get('/api/coingecko/*', async (req, res) => {
    try {
        const endpoint = req.params[0];
        const queryString = new URLSearchParams(req.query).toString();
        
        let url = `https://api.coingecko.com/api/v3/${endpoint}${queryString ? '?' + queryString : ''}`;
        
        const headers = {};
        if (process.env.COINGECKO_API_KEY) {
            url = url.replace('api.coingecko.com', 'pro-api.coingecko.com');
            headers['x-cg-pro-api-key'] = process.env.COINGECKO_API_KEY;
        }
        
        const response = await fetchWithTimeout(url, { headers });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('CoinGecko API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// ============================================
// INDIA VIX PROXY (Yahoo Finance)
// ============================================

app.get('/api/indiavix', async (req, res) => {
    try {
        const url = 'https://query1.finance.yahoo.com/v8/finance/chart/%5EINDIAVIX?interval=1d&range=1d';
        const response = await fetchWithTimeout(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('India VIX API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch India VIX data' });
    }
});

// ============================================
// AI API PROXIES
// Supports: Google Gemini (FREE), OpenAI (Paid)
// ============================================

// Google Gemini API Proxy (FREE - 15 requests/minute)
// Get free API key at: https://aistudio.google.com/app/apikey
app.post('/api/gemini/analyze', async (req, res) => {
    try {
        const geminiKey = process.env.GEMINI_API_KEY;
        
        if (!geminiKey) {
            return res.status(500).json({ 
                error: 'Gemini API key not configured. Get a FREE key at https://aistudio.google.com/app/apikey' 
            });
        }
        
        const { prompt, imageBase64 } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        
        // Use Gemini 1.5 Flash for vision (faster and free)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        
        // Build request body
        const requestBody = {
            contents: [{
                parts: []
            }],
            generationConfig: {
                temperature: 0.1,
                topK: 32,
                topP: 1,
                maxOutputTokens: 4096,
                responseMimeType: "application/json"
            },
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ]
        };
        
        // Add image if provided
        if (imageBase64) {
            // Extract base64 data and mime type
            const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
            if (matches) {
                requestBody.contents[0].parts.push({
                    inlineData: {
                        mimeType: matches[1],
                        data: matches[2]
                    }
                });
            }
        }
        
        // Add text prompt
        requestBody.contents[0].parts.push({ text: prompt });
        
        const response = await fetchWithTimeout(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }, 90000); // 90 second timeout for AI vision
        
        const data = await response.json();
        
        if (data.error) {
            console.error('Gemini API Error:', data.error);
            return res.status(500).json({ error: data.error.message || 'Gemini API error' });
        }
        
        // Extract the generated text
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const generatedText = data.candidates[0].content.parts[0].text;
            res.json({ 
                success: true, 
                content: generatedText,
                model: 'gemini-1.5-flash'
            });
        } else {
            res.status(500).json({ error: 'No response generated' });
        }
        
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        res.status(500).json({ error: 'Failed to get AI response: ' + error.message });
    }
});

// OpenAI Chat Completions Proxy (Fallback - requires paid API)
app.post('/api/openai/chat', async (req, res) => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }
        
        const response = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(req.body)
        }, 60000); // 60 second timeout for AI
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('OpenAI API Error:', error.message);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

// Config endpoint - serves non-sensitive config to frontend
app.get('/api/config', (req, res) => {
    res.json({
        gaTrackingId: process.env.GA_TRACKING_ID || 'G-N0Y2LBMRSW',
        hasProApi: !!process.env.COINGECKO_API_KEY,
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        hasGemini: !!process.env.GEMINI_API_KEY
    });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 BroBillionaire Server running on http://localhost:${PORT}`);
    console.log('📝 Subscribe endpoint: POST /api/subscribe');
    console.log(`🔑 CoinGecko Pro API: ${process.env.COINGECKO_API_KEY ? 'Enabled' : 'Disabled (using free tier)'}`);
    console.log(`🤖 Gemini AI (FREE): ${process.env.GEMINI_API_KEY ? 'Enabled ✓' : 'Not configured - Get FREE key at https://aistudio.google.com/app/apikey'}`);
    console.log(`🤖 OpenAI API: ${process.env.OPENAI_API_KEY ? 'Enabled' : 'Not configured (optional)'}`);
    console.log('\n📡 API Proxy Endpoints:');
    console.log('   /api/fear-greed        - Fear & Greed Index');
    console.log('   /api/crypto/markets    - Top Crypto Markets');
    console.log('   /api/crypto/global     - Global Market Data');
    console.log('   /api/crypto/price      - Simple Price Data');
    console.log('   /api/coingecko/*       - Generic CoinGecko Proxy');
    console.log('   /api/gemini/analyze    - Google Gemini AI (FREE vision)');
    console.log('   /api/openai/chat       - OpenAI Chat Completions\n');
});
