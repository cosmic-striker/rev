import fs from 'fs';

const server = fs.readFileSync('./server.mjs', 'utf-8');
const lines = server.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('authenticateToken') || lines[i].includes('requireAdmin') || lines[i].includes('jwt.sign') || lines[i].includes('bcrypt') || lines[i].includes('login') || lines[i].includes('/api/auth')) {
    console.log(`Line ${i+1}: ${lines[i].slice(0, 100)}`);
  }
}
