const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const shodanClient = require('../utils/shodanClient');

const ALERTS_FILE = path.join(__dirname, '../data/alerts.json');
const HISTORY_FILE = path.join(__dirname, '../data/alerts-history.json');

// Ensure data directory exists
fs.ensureDirSync(path.join(__dirname, '../data'));

const loadData = (file) => (fs.existsSync(file) ? fs.readJsonSync(file) : []);
const saveData = (file, data) => fs.writeJsonSync(file, data, { spaces: 2 });

// POST /targets
router.post('/targets', async (req, res) => {
  const { target, label, alertThreshold } = req.body;
  if (!target) return res.status(400).json({ error: "Target required" });

  const alerts = loadData(ALERTS_FILE);
  const newTarget = {
    id: Date.now().toString(),
    target,
    label: label || target,
    threshold: alertThreshold || 'all',
    lastChecked: null,
    status: 'watching',
    createdAt: new Date().toISOString()
  };

  alerts.push(newTarget);
  saveData(ALERTS_FILE, alerts);
  res.json(newTarget);
});

// GET /targets
router.get('/targets', (req, res) => {
  res.json(loadData(ALERTS_FILE));
});

// DELETE /targets/:id
router.delete('/targets/:id', (req, res) => {
  const alerts = loadData(ALERTS_FILE);
  const filtered = alerts.filter(a => a.id !== req.params.id);
  saveData(ALERTS_FILE, filtered);
  res.json({ success: true });
});

// GET /history
router.get('/history', (req, res) => {
  res.json(loadData(HISTORY_FILE));
});

// POST /check (Manual trigger)
router.post('/check', async (req, res) => {
  const alerts = loadData(ALERTS_FILE);
  const history = loadData(HISTORY_FILE);
  let newEventsCount = 0;

  for (let targetObj of alerts) {
    try {
      // Logic for Shodan re-scan and comparison
      // Note: This is an intensive operation
      const response = await shodanClient.get(`/shodan/host/${targetObj.target}`);
      const newVulns = response.data.vulns || [];
      
      // Comparison logic (simplified for Phase 3)
      // In a real app, compare newVulns with a baseline stored in alerts.json
      if (newVulns.length > 0) {
        history.unshift({
          id: Date.now().toString() + Math.random(),
          target: targetObj.target,
          type: 'NEW_VULNERABILITIES',
          count: newVulns.length,
          timestamp: new Date().toISOString(),
          details: newVulns
        });
        targetObj.status = 'alert_triggered';
        newEventsCount++;
      }
      
      targetObj.lastChecked = new Date().toISOString();
    } catch (e) {
      console.error(`Alert check failed for ${targetObj.target}:`, e.message);
    }
  }

  saveData(ALERTS_FILE, alerts);
  saveData(HISTORY_FILE, history.slice(0, 100)); // Keep last 100 events
  
  res.json({ success: true, eventsFound: newEventsCount });
});

module.exports = router;
