const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /shodan-verify
router.get('/shodan-verify', async (req, res) => {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: "API key required" });

  try {
    const response = await axios.get('https://api.shodan.io/api-info', {
      params: { key }
    });
    
    res.json({
      valid: true,
      plan: response.data.plan,
      queryCredits: response.data.query_credits,
      scanCredits: response.data.scan_credits
    });
  } catch (err) {
    res.status(401).json({ valid: false, error: "Invalid Shodan API key" });
  }
});

module.exports = router;
