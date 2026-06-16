const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, 'server/data/users.json');

async function initAdmin() {
  console.log('--- ReconX Administrative Initialization ---');
  
  if (!fs.existsSync(path.dirname(USERS_FILE))) {
    fs.mkdirpSync(path.dirname(USERS_FILE));
  }

  const users = fs.existsSync(USERS_FILE) ? fs.readJsonSync(USERS_FILE) : [];

  const adminExists = users.find(u => u.username === 'admin');

  if (adminExists) {
    console.log('(!) Admin user already exists. Skipping initialization.');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = {
    id: 'admin-' + Date.now(),
    username: 'admin',
    password: hashedPassword,
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  };

  users.push(adminUser);
  fs.writeJsonSync(USERS_FILE, users, { spaces: 2 });

  console.log('(+) Default Admin Created Successfully.');
  console.log('    Username: admin');
  console.log('    Password: admin123');
  console.log('---------------------------------------------');
}

initAdmin();
