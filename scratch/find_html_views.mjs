import fs from 'fs';

const html = fs.readFileSync('./admin.html', 'utf-8');
const lines = html.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="admin-media-view"') || lines[i].includes('id="admin-about-view"') || lines[i].includes('</main>')) {
    console.log(`Line ${i+1}: ${lines[i]}`);
  }
}
