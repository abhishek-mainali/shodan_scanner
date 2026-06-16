const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const requireAuth = require('../middleware/auth');

const SCANS_FILE = path.join(__dirname, '../data/scans.json');

router.get('/', requireAuth(['ADMIN', 'ANALYST', 'VIEWER']), async (req, res) => {
  const { q, risk, type, from, to, port, country, service, user } = req.query;
  const scans = fs.existsSync(SCANS_FILE) ? fs.readJsonSync(SCANS_FILE) : [];

  let results = scans;

  // Full-text search
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(s => 
      s.target?.toLowerCase().includes(query) ||
      s.geo?.org?.toLowerCase().includes(query) ||
      s.geo?.asn?.toLowerCase().includes(query) ||
      s.ports?.some(p => p.service?.toLowerCase().includes(query) || p.version?.toLowerCase().includes(query)) ||
      s.cves?.some(c => c.id.toLowerCase().includes(query) || c.summary.toLowerCase().includes(query))
    );
  }

  // Filters
  if (risk) {
    const risks = risk.split(',');
    results = results.filter(s => {
      // Very crude risk estimation for filtering
      const score = (s.cves?.length || 0) * 10; 
      const level = score > 70 ? 'critical' : score > 40 ? 'high' : score > 10 ? 'medium' : 'low';
      return risks.includes(level);
    });
  }

  if (type) results = results.filter(s => s.type?.toLowerCase() === type.toLowerCase());
  
  if (from) results = results.filter(s => new Date(s.timestamp) >= new Date(from));
  if (to) results = results.filter(s => new Date(s.timestamp) <= new Date(to));
  
  if (port) results = results.filter(s => s.ports?.some(p => p.port === parseInt(port)));
  if (country) results = results.filter(s => s.geo?.country_code === country.toUpperCase());
  if (service) results = results.filter(s => s.ports?.some(p => p.service?.toLowerCase().includes(service.toLowerCase())));
  
  if (req.user.role !== 'ADMIN' && user) {
    // Only ADMIN can filter by other users
  } else if (user) {
    results = results.filter(s => s.scannedBy === user);
  }

  const pageSize = parseInt(req.query.pageSize) || 20;
  const page = parseInt(req.query.page) || 1;
  const paginated = results.slice((page - 1) * pageSize, page * pageSize);

  res.json({
    results: paginated,
    total: results.length,
    page,
    pageSize,
    appliedFilters: req.query
  });
});

router.get('/suggest', requireAuth(), async (req, res) => {
  const { q } = req.query;
  const scans = fs.existsSync(SCANS_FILE) ? fs.readJsonSync(SCANS_FILE) : [];
  
  if (!q) return res.json([]);
  
  const query = q.toLowerCase();
  const suggestions = new Set();
  
  scans.forEach(s => {
    if (s.target?.toLowerCase().includes(query)) suggestions.add(s.target);
    s.ports?.forEach(p => {
      if (p.service?.toLowerCase().includes(query)) suggestions.add(p.service);
    });
    s.cves?.forEach(c => {
      if (c.id.toLowerCase().includes(query)) suggestions.add(c.id);
    });
  });

  res.json(Array.from(suggestions).slice(0, 5));
});

module.exports = router;
