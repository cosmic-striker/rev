import fs from 'fs';

const server = fs.readFileSync('./server.mjs', 'utf-8');
const lines = server.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('/api/works') || lines[i].includes('/api/events')) {
    console.log(`Line ${i+1}: ${lines[i]}`);
  }
}
