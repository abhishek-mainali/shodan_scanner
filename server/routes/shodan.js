const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const shodanClient = require('../utils/shodanClient');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/auth');

const SCANS_FILE = path.join(__dirname, '../data/scans.json');
fs.ensureDirSync(path.join(__dirname, '../data'));

const saveScan = (scan) => {
  const scans = fs.existsSync(SCANS_FILE) ? fs.readJsonSync(SCANS_FILE) : [];
  scans.unshift(scan);
  fs.writeJsonSync(SCANS_FILE, scans.slice(0, 500)); // Keep last 500
};

// Helper to handle Shodan errors
const handleShodanError = (error, res) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 401) return res.status(401).json({ error: "Invalid API key" });
    if (status === 404) return res.status(404).json({ error: "No results found for this target" });
    if (status === 429) return res.status(429).json({ error: "Shodan rate limit hit", retryAfter: 1 });
    return res.status(status).json({ error: data.error || "Shodan API error" });
  }
  return res.status(500).json({ error: "Shodan unreachable", details: error.message });
};

// GET /host/:ip
router.get('/host/:ip', requireAuth(['ADMIN', 'ANALYST']), validate, async (req, res) => {
  try {
    const response = await shodanClient.get(`/shodan/host/${req.params.ip}`);
    const scan = { ...response.data, scannedBy: req.user.username, timestamp: new Date().toISOString() };
    saveScan(scan);
    res.json(response.data);
  } catch (error) {
    handleShodanError(error, res);
  }
});

// GET /dns/resolve
router.get('/dns/resolve', requireAuth(['ADMIN', 'ANALYST']), validate, async (req, res) => {
  try {
    const response = await shodanClient.get('/dns/resolve', {
      params: { hostnames: req.query.hostnames }
    });
    const ip = response.data[req.query.hostnames];
    if (!ip) throw { response: { status: 404 } };
    
    // Auto-fetch host data for the resolved IP
    const hostData = await shodanClient.get(`/shodan/host/${ip}`);
    const scan = { ...hostData.data, scannedBy: req.user.username, timestamp: new Date().toISOString() };
    saveScan(scan);
    res.json(hostData.data);
  } catch (error) {
    handleShodanError(error, res);
  }
});


// GET /network
router.get('/network', validate, async (req, res) => {
  try {
    const response = await shodanClient.get('/shodan/host/search', {
      params: { query: `net:${req.query.cidr}` }
    });
    res.json(response.data.matches);
  } catch (error) {
    handleShodanError(error, res);
  }
});

// GET /ssl
router.get('/ssl', validate, async (req, res) => {
  try {
    const response = await shodanClient.get(`/shodan/host/${req.query.ip}`);
    const httpsBanner = response.data.data.find(d => d.port === 443 || d.ssl);
    
    if (!httpsBanner || !httpsBanner.ssl) {
      return res.status(404).json({ error: "No SSL certificate found on this host" });
    }

    const { cert } = httpsBanner.ssl;
    res.json({
      issuer: cert.issuer.CN,
      subject: cert.subject.CN,
      expiry: cert.expires,
      valid: new Date(cert.expires) > new Date(),
      fingerprint: httpsBanner.ssl.fingerprint
    });
  } catch (error) {
    handleShodanError(error, res);
  }
});

// GET /cve
router.get('/cve', validate, async (req, res) => {
  try {
    const response = await shodanClient.get(`/shodan/host/${req.query.ip}`);
    const vulns = response.data.vulns || [];
    
    // In a real app we might fetch more CVE info, here we extract from host response
    // Shodan host response has 'vulns' as array of IDs. 
    // Usually 'data' banners contain more details if opted in.
    const cveDetails = (response.data.data || [])
      .filter(d => d.vulns)
      .reduce((acc, d) => ({ ...acc, ...d.opts?.vulns }), {});

    const enrichedCVEs = Object.entries(cveDetails).map(([id, info]) => ({
      id,
      cvss: info.cvss || 0,
      severity: info.cvss >= 9 ? 'CRITICAL' : info.cvss >= 7 ? 'HIGH' : info.cvss >= 4 ? 'MEDIUM' : 'LOW',
      summary: info.summary || "No summary available"
    }));

    res.json(enrichedCVEs);
  } catch (error) {
    handleShodanError(error, res);
  }
});

module.exports = router;
