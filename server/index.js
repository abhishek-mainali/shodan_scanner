const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const shodanRoutes = require('./routes/shodan');
const exportRoutes = require('./routes/export');
const alertRoutes = require('./routes/alerts');
const settingsRoutes = require('./routes/settings');
const intelRoutes = require('./routes/intel');
const searchRoutes = require('./routes/search');
const templateRoutes = require('./routes/templates');
const portalRoutes = require('./routes/portal'); // Future-proof
const apiLimiter = require('./middleware/rateLimit');

const initScheduler = require('./scheduler');



const app = express();
const PORT = process.env.PORT || 3001;

// Global Security & Logging
app.use(helmet({
  contentSecurityPolicy: false, // For easier dev, lock down in prod
}));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter);

// Auth Routes (unprotected)
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/shodan', shodanRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/intel', intelRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/portal', portalRoutes);



// Error fallback
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`ReconX Proxy Server active on port ${PORT}`);
  initScheduler(PORT);
  if (!process.env.SHODAN_API_KEY) {

    console.warn("WARNING: SHODAN_API_KEY is not set in .env");
  }
});
