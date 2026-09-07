import assert from 'assert';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

async function verifyDOMAndEndpoints() {
  console.log('Testing Frontend Asset Delivery and DOM Structure...');

  // 1. Fetch /admin.html
  const htmlRes = await fetch(`${BASE_URL}/admin.html`);
  assert.strictEqual(htmlRes.status, 200, 'admin.html should return 200');
  const html = await htmlRes.text();

  assert(html.includes('id="nav-rsvps"'), 'Must contain unlocked #nav-rsvps sidebar link');
  assert(html.includes('id="admin-rsvps-view"'), 'Must contain #admin-rsvps-view container');
  assert(html.includes('id="rsvps-stat-total"'), 'Must contain #rsvps-stat-total');
  assert(html.includes('id="rsvps-capacity-banner"'), 'Must contain #rsvps-capacity-banner');
  assert(html.includes('id="rsvps-search-input"'), 'Must contain #rsvps-search-input');
  assert(html.includes('id="rsvps-event-filter"'), 'Must contain #rsvps-event-filter');
  assert(html.includes('id="rsvps-status-filter"'), 'Must contain #rsvps-status-filter');
  assert(html.includes('id="admin-rsvps-table-body"'), 'Must contain #admin-rsvps-table-body');
  assert(html.includes('id="rsvp-details-modal"'), 'Must contain #rsvp-details-modal');
  assert(html.includes('id="rsvp-cancel-modal"'), 'Must contain #rsvp-cancel-modal');
  console.log('✓ admin.html contains all required Step 4 DOM structures and IDs.');

  // 2. Fetch /admin.js
  const jsRes = await fetch(`${BASE_URL}/admin.js`);
  assert.strictEqual(jsRes.status, 200, 'admin.js should return 200');
  const js = await jsRes.text();

  assert(js.includes('loadAdminRsvps'), 'admin.js must define loadAdminRsvps');
  assert(js.includes('copyPassId'), 'admin.js must define copyPassId');
  assert(js.includes('toggleRsvpCheckIn'), 'admin.js must define toggleRsvpCheckIn');
  assert(js.includes('openRsvpDetailsModal'), 'admin.js must define openRsvpDetailsModal');
  assert(js.includes('exportRsvpsCsv'), 'admin.js must define exportRsvpsCsv');
  assert(js.includes('executeCancelRsvp'), 'admin.js must define executeCancelRsvp');
  console.log('✓ admin.js exports all required controllers and handlers.');

  console.log('✓ All DOM structures and frontend files verified successfully!');
}

verifyDOMAndEndpoints().catch(err => {
  console.error('DOM test failed:', err);
  process.exit(1);
});
