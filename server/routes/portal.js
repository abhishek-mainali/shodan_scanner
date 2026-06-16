const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const requireAuth = require('../middleware/auth');

const PORTALS_FILE = path.join(__dirname, '../data/portals.json');
const SCANS_FILE = path.join(__dirname, '../data/scans.json');

const loadPortals = () => fs.existsSync(PORTALS_FILE) ? fs.readJsonSync(PORTALS_FILE) : [];
const savePortals = (data) => fs.writeJsonSync(PORTALS_FILE, data, { spaces: 2 });

// POST /reports - ANALYST/ADMIN only
router.post('/reports', requireAuth(['ADMIN', 'ANALYST']), async (req, res) => {
  const { scanIds, clientName, clientEmail, expiresIn, branding } = req.body;
  if (!scanIds?.length || !clientName) return res.status(400).json({ error: "Scan IDs and Client Name required" });

  const token = crypto.randomBytes(16).toString('hex');
  const expiryDate = expiresIn === 'never' ? null : new Date(Date.now() + parseInt(expiresIn) * 60 * 60 * 1000);

  const newPortal = {
    token,
    clientName,
    clientEmail,
    scanIds,
    createdBy: req.user.username,
    createdAt: new Date().toISOString(),
    expiresAt: expiryDate,
    viewCount: 0,
    branding: branding || { companyName: 'ReconX Security', reporterName: req.user.username }
  };

  const portals = loadPortals();
  portals.push(newPortal);
  savePortals(portals);

  res.json({ token, portalUrl: `/portal/${token}` });
});

// GET /:token - PUBLIC access
router.get('/:token', async (req, res) => {
  const portals = loadPortals();
  const portal = portals.find(p => p.token === req.params.token);

  if (!portal) return res.status(404).json({ error: "Link invalid or revoked" });
  if (portal.expiresAt && new Date() > new Date(portal.expiresAt)) return res.status(410).json({ error: "Link expired" });

  portal.viewCount++;
  portal.lastViewed = new Date().toISOString();
  savePortals(portals);

  // Return limited metadata for the public view
  const { token, clientName, scanIds, branding, createdAt } = portal;
  res.json({ token, clientName, scanIds, branding, createdAt });
});

// GET /:token/scans/:scanId - PUBLIC access (restricted to portal scans)
router.get('/:token/scans/:scanId', async (req, res) => {
  const portals = loadPortals();
  const portal = portals.find(p => p.token === req.params.token);

  if (!portal || !portal.scanIds.includes(req.params.scanId)) return res.status(403).json({ error: "Access denied" });
  if (portal.expiresAt && new Date() > new Date(portal.expiresAt)) return res.status(410).json({ error: "Link expired" });

  const scans = fs.existsSync(SCANS_FILE) ? fs.readJsonSync(SCANS_FILE) : [];
  const scan = scans.find(s => s.id === req.params.scanId);

  if (!scan) return res.status(404).json({ error: "Intelligence data missing" });

  res.json(scan);
});

module.exports = router;
