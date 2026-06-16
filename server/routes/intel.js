const express = require('express');
const router = express.Router();
const axios = require('axios');
const whois = require('whois');
const { promisify } = require('util');
const whoisLookup = promisify(whois.lookup);

// GET /reputation
router.get('/reputation', async (req, res) => {
  const { ip } = req.query;
  if (!ip) return res.status(400).json({ error: "IP required" });

  try {
    // AbuseIPDB check (if key exists)
    let abuseScore = 0;
    if (process.env.ABUSEIPDB_API_KEY) {
      const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
        params: { ipAddress: ip },
        headers: { 'Key': process.env.ABUSEIPDB_API_KEY, 'Accept': 'application/json' }
      });
      abuseScore = response.data.data.abuseConfidenceScore;
    }

    // VirusTotal check (placeholder)
    let vtMalicious = 0;
    if (process.env.VIRUSTOTAL_API_KEY) {
      // VT API call...
    }

    res.json({
      abuseScore,
      vtMalicious: Math.floor(Math.random() * 2), // Mock
      vtTotal: 88,
      threatLevel: abuseScore > 50 ? 'MALICIOUS' : abuseScore > 10 ? 'SUSPICIOUS' : 'CLEAN'
    });
  } catch (err) {
    res.json({ abuseScore: 0, vtMalicious: 0, threatLevel: 'UNKNOWN' });
  }
});

// GET /whois
router.get('/whois', async (req, res) => {
  const { target } = req.query;
  try {
    const data = await whoisLookup(target);
    // Simple parsing logic (can be more complex)
    res.json({ raw: data });
  } catch (err) {
    res.status(500).json({ error: "WHOIS lookup failed" });
  }
});

module.exports = router;
