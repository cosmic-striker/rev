import fs from 'fs';

const js = fs.readFileSync('./admin.js', 'utf-8');
const lines = js.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('navigate') || lines[i].includes('switchSection') || lines[i].includes('nav-')) {
    console.log(`Line ${i+1}: ${lines[i].trim()}`);
  }
}
