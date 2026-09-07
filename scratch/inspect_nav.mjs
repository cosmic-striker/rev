import fs from 'fs';

const js = fs.readFileSync('./admin.js', 'utf-8');
const lines = js.split('\n');

const navIdx = lines.findIndex(l => l.includes('function navigateToAdminSection'));
if (navIdx !== -1) {
  console.log(lines.slice(navIdx, navIdx + 60).join('\n'));
} else {
  console.log('navigateToAdminSection not found as function definition');
}
