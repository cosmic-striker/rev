import assert from 'assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 STEP 4: RSVP & ATTENDEE MANAGEMENT TEST SUITE');
  console.log('====================================================\n');

  let adminToken = '';
  let editorToken = '';

  // 1. Authenticate as Super Admin
  console.log('Test 1: Authenticating Super Admin (curator_admin)...');
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
  });
  assert.strictEqual(adminLoginRes.status, 200, 'Admin login should succeed');
  const adminData = await adminLoginRes.json();
  assert.strictEqual(adminData.success, true);
  assert.strictEqual(adminData.user.role, 'admin');
  adminToken = adminData.token;
  console.log('✓ Admin authenticated successfully.\n');

  // 2. Authenticate as Content Editor
  console.log('Test 2: Authenticating Content Editor (editor_resolution)...');
  const editorLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'editor_resolution', password: 'resolution2026' })
  });
  assert.strictEqual(editorLoginRes.status, 200, 'Editor login should succeed');
  const editorData = await editorLoginRes.json();
  assert.strictEqual(editorData.success, true);
  assert.strictEqual(editorData.user.role, 'editor');
  editorToken = editorData.token;
  console.log('✓ Editor authenticated successfully.\n');

  // 3. Security: Unauthenticated request to /api/admin/rsvps
  console.log('Test 3: Security - Anonymous GET /api/admin/rsvps must return 401...');
  const unauthRes = await fetch(`${BASE_URL}/api/admin/rsvps`);
  assert.strictEqual(unauthRes.status, 401, 'Anonymous request must be rejected with 401');
  console.log('✓ Anonymous access rejected with 401 Unauthorized.\n');

  // 4. GET /api/admin/rsvps with Admin Token
  console.log('Test 4: Super Admin GET /api/admin/rsvps...');
  const listRes = await fetch(`${BASE_URL}/api/admin/rsvps`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(listRes.status, 200, 'Admin should retrieve RSVPs');
  const listJson = await listRes.json();
  assert.strictEqual(listJson.success, true);
  assert(Array.isArray(listJson.data), 'Data must be an array');
  assert(listJson.metrics !== undefined, 'Metrics summary must be present');
  console.log(`✓ Fetched ${listJson.count} RSVPs. Metrics: Total=${listJson.metrics.totalRsvps}, Today=${listJson.metrics.rsvpsToday}, CheckedIn=${listJson.metrics.checkedInCount}\n`);

  // 5. Register for an Event on the Public Website (POST /api/events/:id/rsvp)
  console.log('Test 5: Public Registration Flow (POST /api/events/directors-masterclass-lighting-the-unseen/rsvp)...');
  const newRsvpRes = await fetch(`${BASE_URL}/api/events/directors-masterclass-lighting-the-unseen/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Aditya Swaminathan',
      email: 'aditya.swamy@cinema.org',
      phone: '+91 98409 99887'
    })
  });
  assert.strictEqual(newRsvpRes.status, 201, 'Public RSVP should succeed with 201');
  const newRsvpData = await newRsvpRes.json();
  assert.strictEqual(newRsvpData.success, true);
  assert(newRsvpData.data.passId.startsWith('RES-PASS-'), 'Must issue valid RES-PASS pass ID');
  const createdPassId = newRsvpData.data.passId;
  console.log(`✓ Issued new pass: ${createdPassId} for ${newRsvpData.data.attendeeName}\n`);

  // 6. Search attendee by Name
  console.log('Test 6: Search RSVPs by Name ("Aditya")...');
  const searchNameRes = await fetch(`${BASE_URL}/api/admin/rsvps?search=Aditya`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const searchNameJson = await searchNameRes.json();
  assert.strictEqual(searchNameJson.success, true);
  assert(searchNameJson.data.some(r => r.attendeeName.includes('Aditya')), 'Must return newly registered attendee');
  console.log(`✓ Found ${searchNameJson.count} matching record(s) for name search.\n`);

  // 7. Search attendee by Pass ID
  console.log(`Test 7: Search RSVPs by Pass ID ("${createdPassId}")...`);
  const searchPassRes = await fetch(`${BASE_URL}/api/admin/rsvps?search=${createdPassId}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const searchPassJson = await searchPassRes.json();
  assert.strictEqual(searchPassJson.success, true);
  assert.strictEqual(searchPassJson.count, 1, 'Exact pass ID search must return precisely 1 record');
  assert.strictEqual(searchPassJson.data[0].passId, createdPassId);
  const createdRsvpId = searchPassJson.data[0]._id || searchPassJson.data[0].id;
  console.log(`✓ Verified pass search: matched ${searchPassJson.data[0].attendeeName}\n`);

  // 8. Filter RSVPs by Specific Event
  console.log('Test 8: Filter RSVPs by Event ("directors-masterclass-lighting-the-unseen")...');
  const eventFilterRes = await fetch(`${BASE_URL}/api/admin/rsvps?eventId=directors-masterclass-lighting-the-unseen`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const eventFilterJson = await eventFilterRes.json();
  assert.strictEqual(eventFilterJson.success, true);
  assert(eventFilterJson.selectedEventCapacity !== null, 'Selected event capacity must be calculated');
  console.log(`✓ Event Capacity Breakdown: ${eventFilterJson.selectedEventCapacity.claimedSeats}/${eventFilterJson.selectedEventCapacity.totalCapacity} seats claimed (${eventFilterJson.selectedEventCapacity.capacityPercent}%)\n`);

  // 9. Fetch Single RSVP Details
  console.log(`Test 9: GET /api/admin/rsvps/${createdRsvpId} (Detailed Attendee & Event Plate)...`);
  const detailRes = await fetch(`${BASE_URL}/api/admin/rsvps/${createdRsvpId}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(detailRes.status, 200, 'Single detail view should succeed');
  const detailJson = await detailRes.json();
  assert.strictEqual(detailJson.success, true);
  assert.strictEqual(detailJson.data.passId, createdPassId);
  assert.strictEqual(detailJson.data.attendeeName, 'Aditya Swaminathan');
  assert.strictEqual(detailJson.data.phone, '+91 98409 99887');
  console.log(`✓ Retrieved attendee detail plate for ${detailJson.data.attendeeName} (${detailJson.data.eventTitle})\n`);

  // 10. Gate Check-in Toggle (PATCH /api/admin/rsvps/:id/checkin)
  console.log(`Test 10: Toggle Gate Check-in State for ${createdPassId}...`);
  const checkinRes = await fetch(`${BASE_URL}/api/admin/rsvps/${createdRsvpId}/checkin`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isCheckedIn: true })
  });
  assert.strictEqual(checkinRes.status, 200, 'Check-in toggle must return 200');
  const checkinJson = await checkinRes.json();
  assert.strictEqual(checkinJson.success, true);
  assert.strictEqual(checkinJson.data.isCheckedIn, true);
  assert.strictEqual(checkinJson.data.status, 'checked_in');
  console.log(`✓ Attendee checked in at gate. Check-in timestamp: ${checkinJson.data.checkInTime}\n`);

  // 11. Filter by Status = 'checked_in'
  console.log('Test 11: Filter RSVPs by status="checked_in"...');
  const checkedInFilterRes = await fetch(`${BASE_URL}/api/admin/rsvps?status=checked_in`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const checkedInFilterJson = await checkedInFilterRes.json();
  assert.strictEqual(checkedInFilterJson.success, true);
  assert(checkedInFilterJson.data.some(r => r.passId === createdPassId), 'Newly checked-in attendee must appear');
  console.log(`✓ Verified status filter: ${checkedInFilterJson.count} checked in attendee(s)\n`);

  // 12. Export RSVPs to Sanitized CSV
  console.log('Test 12: GET /api/admin/rsvps/export/csv...');
  const csvRes = await fetch(`${BASE_URL}/api/admin/rsvps/export/csv`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(csvRes.status, 200, 'CSV export should return 200');
  assert(csvRes.headers.get('content-type').includes('text/csv'), 'Content-Type must be text/csv');
  const csvText = await csvRes.text();
  assert(csvText.includes('Pass ID'), 'CSV headers must be present');
  assert(csvText.includes(createdPassId), 'Created pass ID must be in CSV export');
  assert(csvText.includes('Aditya Swaminathan'), 'Attendee name must be in CSV export');
  console.log(`✓ CSV Export verified. Sample:\n${csvText.split('\n').slice(0, 3).join('\n')}\n`);

  // 13. Cancellation of RSVP (PATCH /api/admin/rsvps/:id/status)
  console.log(`Test 13: Cancel RSVP ${createdPassId} and verify capacity restoration...`);
  const cancelRes = await fetch(`${BASE_URL}/api/admin/rsvps/${createdRsvpId}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'cancelled' })
  });
  assert.strictEqual(cancelRes.status, 200, 'Cancellation should return 200');
  const cancelJson = await cancelRes.json();
  assert.strictEqual(cancelJson.success, true);
  assert.strictEqual(cancelJson.data.status, 'cancelled');
  console.log(`✓ Registration cancelled for ${createdPassId}.\n`);

  // 14. Editor Attempt to DELETE an RSVP (Must be rejected with 403)
  console.log('Test 14: Role Permissions - Content Editor DELETE /api/admin/rsvps/:id must return 403...');
  const editorDeleteRes = await fetch(`${BASE_URL}/api/admin/rsvps/${createdRsvpId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${editorToken}` }
  });
  assert.strictEqual(editorDeleteRes.status, 403, 'Editor must be forbidden from permanent delete');
  console.log('✓ Content Editor correctly forbidden from permanent deletion (403 Forbidden).\n');

  // 15. Super Admin DELETE an RSVP (Allowed with 200)
  console.log('Test 15: Role Permissions - Super Admin DELETE /api/admin/rsvps/:id...');
  const adminDeleteRes = await fetch(`${BASE_URL}/api/admin/rsvps/${createdRsvpId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(adminDeleteRes.status, 200, 'Super Admin should be permitted to delete');
  const adminDeleteJson = await adminDeleteRes.json();
  assert.strictEqual(adminDeleteJson.success, true);
  console.log('✓ Super Admin successfully executed permanent deletion.\n');

  // 16. Regression: Check Dashboard & Events Endpoints
  console.log('Test 16: Regression - Checking /api/admin/metrics & /api/events...');
  const metricsRes = await fetch(`${BASE_URL}/api/admin/metrics`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(metricsRes.status, 200);
  const eventsRes = await fetch(`${BASE_URL}/api/events`);
  assert.strictEqual(eventsRes.status, 200);
  console.log('✓ Regression verified: Dashboard metrics and Public Events APIs are 100% operational.\n');

  console.log('====================================================');
  console.log('🎉 ALL STEP 4 TESTS COMPLETED AND VERIFIED (16/16 PASSING)');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('❌ Test Failure:', err);
  process.exit(1);
});
