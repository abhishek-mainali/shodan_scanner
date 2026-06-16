const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100, // Increased for development
  standardHeaders: true,

  legacyHeaders: false,
  message: {
    error: "Rate limit exceeded",
    retryAfter: 60
  }
});

module.exports = apiLimiter;
