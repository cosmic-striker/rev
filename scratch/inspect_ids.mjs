import fs from 'fs';

const html = fs.readFileSync('./admin.html', 'utf-8');
const idMatches = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);

console.log('Total IDs found in admin.html:', idMatches.length);
console.log('Media related IDs:');
idMatches.filter(id => id.toLowerCase().includes('media')).forEach(id => console.log(' -', id));
