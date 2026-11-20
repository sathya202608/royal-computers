require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Models & Seed Data
const Auth = require('./models/Auth');
const ShopSettings = require('./models/ShopSettings');
const RateCategory = require('./models/RateCategory');
const Stock = require('./models/Stock');
const Employee = require('./models/Employee');
const Bill = require('./models/Bill');
const {
  DEFAULT_AUTH,
  DEFAULT_SHOP_SETTINGS,
  DEFAULT_RATES,
  DEFAULT_STOCK,
  DEFAULT_EMPLOYEES,
  DEFAULT_BILLS,
} = require('./data/defaultData');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const ratesRoutes = require('./routes/ratesRoutes');
const stockRoutes = require('./routes/stockRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const billRoutes = require('./routes/billRoutes');
const customerRoutes = require('./routes/customerRoutes');
const seedRoutes = require('./routes/seedRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Root Endpoint (For Render Service Verification)
app.get('/', (req, res) => {
  res.json({
    message: 'Royal Computers Xerox Shop Backend API is running live!',
    status: 'online',
    healthCheck: '/api/health',
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  const isConnected = require('mongoose').connection.readyState === 1;
  res.json({
    status: isConnected ? 'ok' : 'degraded',
    database: isConnected ? 'connected' : 'disconnected',
    readyState: require('mongoose').connection.readyState,
    shop: 'Royal Computers Xerox Shop',
    timestamp: new Date().toISOString(),
  });
});

// Reconnect Endpoint
app.get('/api/reconnect', async (req, res) => {
  const connected = await connectDB();
  const isConnected = require('mongoose').connection.readyState === 1;
  res.json({
    success: isConnected,
    database: isConnected ? 'connected' : 'disconnected',
    message: isConnected 
      ? 'MongoDB Connected Successfully!' 
      : 'Could not connect to MongoDB Atlas. Please ensure IP 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.',
  });
});

// Fast-fail guard: Return immediately if MongoDB is disconnected so API calls don't hang for 10 seconds
app.use('/api', async (req, res, next) => {
  if (req.path === '/health' || req.path === '/reconnect' || req.path.startsWith('/auth')) return next();
  if (require('mongoose').connection.readyState !== 1) {
    const connected = await connectDB();
    if (!connected && require('mongoose').connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected. Please whitelist your IP in MongoDB Atlas Network Access.',
        isDbOffline: true,
      });
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/rates', ratesRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/seed', seedRoutes);

// Start Server
async function startServer() {
  try {
    await connectDB();
  } catch (error) {
    console.warn(`⚠️ Auto-init notice: ${error.message}`);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Royal Computers Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 MongoDB Atlas Single Source of Truth active!`);

    // Automatic background retry every 25 seconds if disconnected
    setInterval(async () => {
      if (require('mongoose').connection.readyState !== 1) {
        await connectDB();
      }
    }, 25000);
  });
}

startServer();
