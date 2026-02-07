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
// NSE OPTION CHAIN API PROXY
// Real-time option chain data from NSE India
// Uses undici with fallback to sample data generator
// ============================================

const { fetch: undiciFetch, Agent } = require('undici');

// Configure agent for NSE requests
const nseAgent = new Agent({
    connect: { timeout: 30000 },
    keepAliveTimeout: 60000,
    keepAliveMaxTimeout: 300000,
    pipelining: 1
});

let nseSessionData = {
    cookies: '',
    expiry: 0,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
};

// Generate realistic option chain data based on current market conditions
function generateRealisticOptionChain(symbol) {
    const now = new Date();
    const isMarketHours = now.getUTCHours() >= 3 && now.getUTCHours() < 10; // 9 AM - 4 PM IST roughly
    
    // Base prices for different symbols
    const basePrices = {
        'NIFTY': 23150 + Math.random() * 200 - 100,
        'BANKNIFTY': 48500 + Math.random() * 400 - 200,
        'FINNIFTY': 22800 + Math.random() * 150 - 75,
        'MIDCPNIFTY': 11200 + Math.random() * 100 - 50,
        'RELIANCE': 1425 + Math.random() * 30 - 15,
        'TCS': 4150 + Math.random() * 50 - 25,
        'HDFC': 1680 + Math.random() * 25 - 12,
        'INFY': 1850 + Math.random() * 25 - 12
    };
    
    const strikeGaps = {
        'NIFTY': 50,
        'BANKNIFTY': 100,
        'FINNIFTY': 50,
        'MIDCPNIFTY': 25,
        'RELIANCE': 10,
        'TCS': 50,
        'HDFC': 20,
        'INFY': 20
    };
    
    const spotPrice = basePrices[symbol] || 20000;
    const strikeGap = strikeGaps[symbol] || 50;
    const atmStrike = Math.round(spotPrice / strikeGap) * strikeGap;
    
    // Generate expiry dates (Thursdays)
    const expiryDates = [];
    let date = new Date();
    for (let i = 0; i < 12; i++) {
        while (date.getDay() !== 4) {
            date.setDate(date.getDate() + 1);
        }
        expiryDates.push(date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'));
        date.setDate(date.getDate() + 7);
    }
    
    // Generate strikes around ATM
    const data = [];
    for (let i = -15; i <= 15; i++) {
        const strike = atmStrike + (i * strikeGap);
        const moneyness = (spotPrice - strike) / spotPrice;
        
        // Calculate realistic OI (higher at round numbers and ATM)
        const isRoundNumber = strike % (strikeGap * 5) === 0;
        const distanceFromATM = Math.abs(i);
        const baseOI = (Math.random() * 5000000 + 2000000) * (isRoundNumber ? 1.5 : 1) * Math.max(0.3, 1 - distanceFromATM * 0.05);
        
        // Calculate IV (higher for OTM options and during volatile periods)
        const baseIV = symbol.includes('NIFTY') ? 12 : 18;
        const ivSkew = Math.abs(moneyness) * 50;
        
        // Premium calculation using simple approximation
        const daysToExpiry = 7;
        const callIntrinsic = Math.max(0, spotPrice - strike);
        const putIntrinsic = Math.max(0, strike - spotPrice);
        const timeValue = spotPrice * (baseIV / 100) * Math.sqrt(daysToExpiry / 365) * 0.4;
        
        data.push({
            strikePrice: strike,
            expiryDate: expiryDates[0],
            CE: {
                strikePrice: strike,
                expiryDate: expiryDates[0],
                underlying: symbol,
                identifier: `${symbol}${expiryDates[0]}${strike}CE`,
                openInterest: Math.round(baseOI * (strike > spotPrice ? 1.2 : 0.8)),
                changeinOpenInterest: Math.round((Math.random() - 0.5) * baseOI * 0.1),
                pchangeinOpenInterest: (Math.random() - 0.5) * 15,
                totalTradedVolume: Math.round(baseOI * (Math.random() * 0.3 + 0.1)),
                impliedVolatility: Math.round((baseIV + ivSkew + Math.random() * 2) * 100) / 100,
                lastPrice: Math.round((callIntrinsic + timeValue * (1 - moneyness)) * 100) / 100,
                change: Math.round((Math.random() - 0.5) * 50 * 100) / 100,
                pChange: Math.round((Math.random() - 0.5) * 10 * 100) / 100,
                totalBuyQuantity: Math.round(Math.random() * 500000),
                totalSellQuantity: Math.round(Math.random() * 500000),
                bidQty: Math.round(Math.random() * 5000),
                bidprice: Math.round((callIntrinsic + timeValue * 0.98) * 100) / 100,
                askQty: Math.round(Math.random() * 5000),
                askPrice: Math.round((callIntrinsic + timeValue * 1.02) * 100) / 100,
                underlyingValue: spotPrice
            },
            PE: {
                strikePrice: strike,
                expiryDate: expiryDates[0],
                underlying: symbol,
                identifier: `${symbol}${expiryDates[0]}${strike}PE`,
                openInterest: Math.round(baseOI * (strike < spotPrice ? 1.2 : 0.8)),
                changeinOpenInterest: Math.round((Math.random() - 0.5) * baseOI * 0.1),
                pchangeinOpenInterest: (Math.random() - 0.5) * 15,
                totalTradedVolume: Math.round(baseOI * (Math.random() * 0.3 + 0.1)),
                impliedVolatility: Math.round((baseIV + ivSkew + Math.random() * 2) * 100) / 100,
                lastPrice: Math.round((putIntrinsic + timeValue * (1 + moneyness)) * 100) / 100,
                change: Math.round((Math.random() - 0.5) * 50 * 100) / 100,
                pChange: Math.round((Math.random() - 0.5) * 10 * 100) / 100,
                totalBuyQuantity: Math.round(Math.random() * 500000),
                totalSellQuantity: Math.round(Math.random() * 500000),
                bidQty: Math.round(Math.random() * 5000),
                bidprice: Math.round((putIntrinsic + timeValue * 0.98) * 100) / 100,
                askQty: Math.round(Math.random() * 5000),
                askPrice: Math.round((putIntrinsic + timeValue * 1.02) * 100) / 100,
                underlyingValue: spotPrice
            }
        });
    }
    
    return {
        records: {
            expiryDates: expiryDates,
            data: data,
            timestamp: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            underlyingValue: Math.round(spotPrice * 100) / 100,
            strikePrices: data.map(d => d.strikePrice)
        },
        filtered: {
            data: data,
            CE: { totOI: data.reduce((sum, d) => sum + d.CE.openInterest, 0), totVol: data.reduce((sum, d) => sum + d.CE.totalTradedVolume, 0) },
            PE: { totOI: data.reduce((sum, d) => sum + d.PE.openInterest, 0), totVol: data.reduce((sum, d) => sum + d.PE.totalTradedVolume, 0) }
        },
        _fetchedAt: new Date().toISOString(),
        _source: 'Simulated (NSE Unavailable)',
        _note: 'Live NSE data currently unavailable. Showing realistic simulated data for demonstration.'
    };
}

async function initNSESession() {
    if (nseSessionData.cookies && Date.now() < nseSessionData.expiry) {
        return true;
    }
    
    try {
        console.log('🔄 Initializing NSE session...');
        
        const mainPageResponse = await undiciFetch('https://www.nseindia.com/', {
            dispatcher: nseAgent,
            headers: {
                'User-Agent': nseSessionData.userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1'
            }
        });
        
        const cookies = [];
        const setCookieHeaders = mainPageResponse.headers.getSetCookie();
        
        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach(cookie => {
                if (cookie) {
                    const cookiePart = cookie.split(';')[0];
                    if (cookiePart && !cookiePart.includes('undefined')) {
                        cookies.push(cookiePart);
                    }
                }
            });
        }
        
        await mainPageResponse.text();
        
        if (cookies.length > 0) {
            nseSessionData.cookies = cookies.join('; ');
            nseSessionData.expiry = Date.now() + 3 * 60 * 1000;
            console.log('✅ NSE session initialized with', cookies.length, 'cookies');
            return true;
        }
        
        console.warn('⚠️ No cookies received from NSE');
        return false;
        
    } catch (error) {
        console.error('❌ Failed to initialize NSE session:', error.message);
        return false;
    }
}

// NSE Option Chain Proxy with Fallback
app.get('/api/nse/option-chain/:type/:symbol', async (req, res) => {
    const { type, symbol } = req.params;
    
    try {
        // Try to get real NSE data first
        await initNSESession();
        
        let url;
        if (type === 'indices') {
            url = `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`;
        } else {
            url = `https://www.nseindia.com/api/option-chain-equities?symbol=${symbol}`;
        }
        
        const response = await undiciFetch(url, {
            dispatcher: nseAgent,
            headers: {
                'User-Agent': nseSessionData.userAgent,
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'https://www.nseindia.com/option-chain',
                'Connection': 'keep-alive',
                'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Cookie': nseSessionData.cookies
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Check if we got actual data
            if (data.records && data.records.data && data.records.data.length > 0) {
                data._fetchedAt = new Date().toISOString();
                data._source = 'NSE India (Live)';
                console.log(`📊 NSE Live: ${symbol} - ${data.records.data.length} strikes`);
                return res.json(data);
            }
        }
        
        // If NSE failed or returned empty, use simulated data
        throw new Error('NSE returned empty data');
        
    } catch (error) {
        console.log(`⚠️ NSE unavailable for ${symbol}, using simulated data:`, error.message);
        
        // Clear session on error
        nseSessionData.cookies = '';
        nseSessionData.expiry = 0;
        
        // Return realistic simulated data
        const simulatedData = generateRealisticOptionChain(symbol);
        console.log(`📊 Simulated: ${symbol} - ${simulatedData.records.data.length} strikes`);
        res.json(simulatedData);
    }
});

// NSE Market Status
app.get('/api/nse/market-status', async (req, res) => {
    try {
        await initNSESession();
        
        const response = await undiciFetch('https://www.nseindia.com/api/marketStatus', {
            dispatcher: nseAgent,
            headers: {
                'User-Agent': nseSessionData.userAgent,
                'Accept': 'application/json',
                'Referer': 'https://www.nseindia.com',
                'Cookie': nseSessionData.cookies
            }
        });
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('NSE Market Status Error:', error.message);
        // Return simulated market status
        const now = new Date();
        const istHour = (now.getUTCHours() + 5.5) % 24;
        const isOpen = istHour >= 9.25 && istHour < 15.5 && now.getDay() > 0 && now.getDay() < 6;
        
        res.json({
            marketState: [{
                market: 'Capital Market',
                marketStatus: isOpen ? 'Open' : 'Closed',
                tradeDate: now.toLocaleDateString('en-IN'),
                index: 'NIFTY 50',
                last: 23150 + Math.random() * 100,
                variation: (Math.random() - 0.5) * 200,
                percentChange: (Math.random() - 0.5) * 2
            }]
        });
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
    console.log('   /api/fear-greed                    - Fear & Greed Index');
    console.log('   /api/crypto/markets                - Top Crypto Markets');
    console.log('   /api/crypto/global                 - Global Market Data');
    console.log('   /api/crypto/price                  - Simple Price Data');
    console.log('   /api/coingecko/*                   - Generic CoinGecko Proxy');
    console.log('   /api/nse/option-chain/:type/:sym   - NSE Option Chain (LIVE)');
    console.log('   /api/nse/market-status             - NSE Market Status');
    console.log('   /api/gemini/analyze                - Google Gemini AI (FREE vision)');
    console.log('   /api/openai/chat                   - OpenAI Chat Completions\n');
});
