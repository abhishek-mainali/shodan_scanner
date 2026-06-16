const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const requireAuth = require('../middleware/auth');

const TEMPLATES_FILE = path.join(__dirname, '../data/templates.json');

const DEFAULT_TEMPLATES = [
  {
    id: "default-quick",
    name: "Quick Recon",
    description: "Ports & Geo only, optimized for speed.",
    createdBy: "SYSTEM",
    isGlobal: true,
    config: {
      modules: { ports: true, cves: false, ssl: false, geo: true, intel: false },
      aggressiveness: 1,
      timeout: 15
    },
    useCount: 0
  },
  {
    id: "default-full",
    name: "Full Intelligence",
    description: "Complete 7-step analysis including external enrichment.",
    createdBy: "SYSTEM",
    isGlobal: true,
    config: {
      modules: { ports: true, cves: true, ssl: true, geo: true, intel: true },
      aggressiveness: 2,
      timeout: 60
    },
    useCount: 0
  },
  {
    id: "default-vuln",
    name: "CVE Hunter",
    description: "Focused on identifying vulnerabilities and SSL weaknesses.",
    createdBy: "SYSTEM",
    isGlobal: true,
    config: {
      modules: { ports: true, cves: true, ssl: true, geo: false, intel: false },
      aggressiveness: 2,
      timeout: 45
    },
    useCount: 0
  }
];

if (!fs.existsSync(TEMPLATES_FILE)) {
  fs.writeJsonSync(TEMPLATES_FILE, DEFAULT_TEMPLATES);
}

router.get('/', requireAuth(), async (req, res) => {
  const templates = fs.readJsonSync(TEMPLATES_FILE);
  // User templates + Global templates
  res.json(templates.filter(t => t.isGlobal || t.createdBy === req.user.username));
});

router.post('/', requireAuth(['ADMIN', 'ANALYST']), async (req, res) => {
  const templates = fs.readJsonSync(TEMPLATES_FILE);
  const newTemplate = {
    ...req.body,
    id: Date.now().toString(),
    createdBy: req.user.username,
    createdAt: new Date().toISOString(),
    useCount: 0
  };
  templates.push(newTemplate);
  fs.writeJsonSync(TEMPLATES_FILE, templates);
  res.status(201).json(newTemplate);
});

router.post('/:id/use', requireAuth(), async (req, res) => {
  const templates = fs.readJsonSync(TEMPLATES_FILE);
  const idx = templates.findIndex(t => t.id === req.params.id);
  if (idx !== -1) {
    templates[idx].useCount++;
    templates[idx].lastUsed = new Date().toISOString();
    fs.writeJsonSync(TEMPLATES_FILE, templates);
    res.json(templates[idx]);
  } else {
    res.status(404).json({ error: "Template not found" });
  }
});

module.exports = router;
