const bcrypt = require('bcryptjs');
const fs = require('fs-extra');
const path = require('path');

const usersPath = path.join(__dirname, 'server/data/users.json');

async function reset() {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    
    const admin = {
        id: "1",
        username: "admin",
        password: hash,
        role: "ADMIN",
        createdAt: new Date().toISOString()
    };
    
    fs.writeJsonSync(usersPath, [admin], { spaces: 2 });
    console.log('Admin password reset to: admin123');
    console.log('Hash:', hash);
}

reset();
