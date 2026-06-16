const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs-extra');
const path = require('path');
const requireAuth = require('../middleware/auth');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!SECRET || !REFRESH_SECRET) {
  console.warn('[SECURITY] CRITICAL: JWT secrets not defined in environment. Authentication will fail.');
}


const loadUsers = () => (fs.existsSync(USERS_FILE) ? fs.readJsonSync(USERS_FILE) : []);
const saveUsers = (users) => fs.writeJsonSync(USERS_FILE, users, { spaces: 2 });

// POST /register (ADMIN only)
router.post('/register', requireAuth(['ADMIN']), async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });

  const users = loadUsers();
  if (users.find(u => u.username === username)) return res.status(409).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    role: role || 'ANALYST',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ id: newUser.id, username: newUser.username, role: newUser.role });
});

// POST /signup (Public self-registration)
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) return res.status(400).json({ error: "Username, password and email required" });
  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

  const users = loadUsers();
  if (users.find(u => u.username === username)) return res.status(409).json({ error: "Operator ID already in registry" });
  if (users.find(u => u.email === email)) return res.status(409).json({ error: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password: hashedPassword,
    role: 'ANALYST', 
    createdAt: new Date().toISOString()
  };


  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ status: "success", message: "Operator registered" });
});


// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`[AUTH] Login attempt for user: ${username}`);
  const users = loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    console.log(`[AUTH] User not found: ${username}`);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(`[AUTH] Password match: ${isMatch}`);

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }


  const accessToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // In real life, store hashed refreshToken in DB
  user.currentRefreshToken = await bcrypt.hash(refreshToken, 10);
  saveUsers(users);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken, user: { id: user.id, username: user.username, role: user.role } });
});

// POST /refresh
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token missing" });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const users = loadUsers();
    const user = users.find(u => u.id === decoded.id);

    if (!user || !(await bcrypt.compare(refreshToken, user.currentRefreshToken))) {
      throw new Error();
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

// POST /logout
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true });
});

// GET /me
router.get('/me', requireAuth(), (req, res) => {
  res.json(req.user);
});

module.exports = router;
