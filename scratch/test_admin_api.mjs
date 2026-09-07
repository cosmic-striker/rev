import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Starting Comprehensive Admin CMS & Backend Test Suite...\n');

  // 1. Public Content Endpoints
  console.log('--- 1. Testing Public Endpoints ---');
  const resContent = await fetch(`${BASE_URL}/api/content`);
  const jsonContent = await resContent.json();
  assert.strictEqual(jsonContent.success, true, 'Site content should return success');
  console.log('✓ GET /api/content OK');

  const resWorks = await fetch(`${BASE_URL}/api/works`);
  const jsonWorks = await resWorks.json();
  assert.strictEqual(jsonWorks.success, true);
  assert.ok(jsonWorks.data.length > 0);
  console.log(`✓ GET /api/works OK (${jsonWorks.data.length} works loaded)`);

  const resEvents = await fetch(`${BASE_URL}/api/events`);
  const jsonEvents = await resEvents.json();
  assert.strictEqual(jsonEvents.success, true);
  console.log(`✓ GET /api/events OK (${jsonEvents.data.length} events loaded)`);

  const resTeam = await fetch(`${BASE_URL}/api/team`);
  const jsonTeam = await resTeam.json();
  assert.strictEqual(jsonTeam.success, true);
  console.log(`✓ GET /api/team OK (${jsonTeam.data.length} team members loaded)`);

  // 2. Authentication Tests
  console.log('\n--- 2. Testing Authentication ---');
  // Invalid login
  const resBadAuth = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'wrong', password: 'wrong' })
  });
  assert.strictEqual(resBadAuth.status, 401, 'Bad credentials should return 401');
  console.log('✓ Bad login correctly rejected (401)');

  // Super Admin login
  const resAdminAuth = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
  });
  assert.strictEqual(resAdminAuth.status, 200);
  const adminAuthJson = await resAdminAuth.json();
  assert.strictEqual(adminAuthJson.success, true);
  assert.strictEqual(adminAuthJson.user.role, 'admin');
  const adminToken = adminAuthJson.token;
  console.log('✓ Super Admin authenticated successfully with JWT');

  // Editor login
  const resEditorAuth = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'editor_resolution', password: 'resolution2026' })
  });
  assert.strictEqual(resEditorAuth.status, 200);
  const editorAuthJson = await resEditorAuth.json();
  assert.strictEqual(editorAuthJson.success, true);
  assert.strictEqual(editorAuthJson.user.role, 'editor');
  const editorToken = editorAuthJson.token;
  console.log('✓ Content Editor authenticated successfully with JWT');

  // 3. Admin Metrics & Super Admin Protected Routes
  console.log('\n--- 3. Testing Admin Metrics & Protected Operations ---');
  const resMetrics = await fetch(`${BASE_URL}/api/admin/metrics`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(resMetrics.status, 200);
  const metricsJson = await resMetrics.json();
  assert.strictEqual(metricsJson.success, true);
  console.log('✓ GET /api/admin/metrics OK:', metricsJson.data);

  // User Management (Admin only)
  const resUsersAdmin = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(resUsersAdmin.status, 200);
  console.log('✓ Super Admin can access /api/admin/users');

  const resUsersEditor = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: { 'Authorization': `Bearer ${editorToken}` }
  });
  assert.strictEqual(resUsersEditor.status, 403, 'Editor should be forbidden on /api/admin/users');
  console.log('✓ Editor correctly denied access (403) to /api/admin/users');

  // 4. CRUD on Events
  console.log('\n--- 4. Testing Events CRUD ---');
  const newEventData = {
    title: 'Anamorphic Lens Shootout 2026',
    date: 'APRIL 20, 2026 • 18:00 IST',
    location: 'Lens Lab 4 // Sound Stage A',
    category: 'workshops',
    seatsLeft: 20,
    description: 'Direct comparison of Cooke, Kowa, and Atlas anamorphic primes.'
  };
  const resCreateEvent = await fetch(`${BASE_URL}/api/admin/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${editorToken}`
    },
    body: JSON.stringify(newEventData)
  });
  assert.strictEqual(resCreateEvent.status, 201);
  const createEventJson = await resCreateEvent.json();
  const createdEventId = createEventJson.data.id || createEventJson.data._id;
  console.log(`✓ Created Event ID: ${createdEventId}`);

  // Update Event
  const resUpdateEvent = await fetch(`${BASE_URL}/api/admin/events/${createdEventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${editorToken}`
    },
    body: JSON.stringify({ seatsLeft: 18, location: 'Main Sound Stage 1' })
  });
  assert.strictEqual(resUpdateEvent.status, 200);
  console.log('✓ Updated Event OK');

  // Delete Event with Editor (should be 403)
  const resDeleteEventForbidden = await fetch(`${BASE_URL}/api/admin/events/${createdEventId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${editorToken}` }
  });
  assert.strictEqual(resDeleteEventForbidden.status, 403, 'Editor cannot delete events');
  console.log('✓ Editor correctly denied deletion (403)');

  // Delete Event with Admin (should be 200)
  const resDeleteEvent = await fetch(`${BASE_URL}/api/admin/events/${createdEventId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(resDeleteEvent.status, 200);
  console.log('✓ Super Admin deleted Event OK (200)');

  // 5. CRUD on Works / Filmography
  console.log('\n--- 5. Testing Works CRUD ---');
  const newWorkData = {
    title: 'Echoes of Marina',
    discipline: 'narrative',
    disciplineLabel: 'Narrative Short',
    format: '2.39:1 Cinemascope',
    camera: 'ARRI Alexa Mini LF // Cooke 40mm',
    synopsis: 'A dawn study of Marina shorelines.',
    crew: 'Director: Test User',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e'
  };
  const resCreateWork = await fetch(`${BASE_URL}/api/admin/works`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify(newWorkData)
  });
  assert.strictEqual(resCreateWork.status, 201);
  const createWorkJson = await resCreateWork.json();
  const createdWorkId = createWorkJson.data.id || createWorkJson.data._id;
  console.log(`✓ Created Work ID: ${createdWorkId}`);

  const resDeleteWork = await fetch(`${BASE_URL}/api/admin/works/${createdWorkId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(resDeleteWork.status, 200);
  console.log('✓ Deleted Work OK');

  // 6. Public Intake & Admin CSV Export
  console.log('\n--- 6. Testing Public RSVP & CSV Export ---');
  const resRsvp = await fetch(`${BASE_URL}/api/events/1/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Kavita Iyer', email: 'kavita@cine.edu' })
  });
  assert.strictEqual(resRsvp.status, 201);
  const rsvpJson = await resRsvp.json();
  assert.ok(rsvpJson.data.passId);
  console.log(`✓ Public RSVP created with Pass ID: ${rsvpJson.data.passId}`);

  // Test CSV export
  const resCsv = await fetch(`${BASE_URL}/api/admin/rsvps/export/csv`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(resCsv.status, 200);
  const csvText = await resCsv.text();
  assert.ok(csvText.includes('Kavita Iyer'), 'CSV export should contain attendee name');
  console.log('✓ RSVP CSV export generated and verified');

  // 7. Contact Inbox Intake & Status Update
  console.log('\n--- 7. Testing Contact Inbox & Admin Flow ---');
  const resContact = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Ravi Teja',
      email: 'ravi@filmfest.org',
      subject: 'Festival Screening Invitation',
      message: 'We would love to screen The Monsoon Sessions at our upcoming festival.'
    })
  });
  assert.strictEqual(resContact.status, 201);
  const contactJson = await resContact.json();
  const contactId = contactJson.data.id || contactJson.data._id;
  console.log(`✓ Public contact inquiry submitted (ID: ${contactId})`);

  // Update status in admin
  const resUpdateContact = await fetch(`${BASE_URL}/api/admin/contacts/${contactId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'in_progress' })
  });
  assert.strictEqual(resUpdateContact.status, 200);
  console.log('✓ Admin updated contact status to in_progress');

  // 8. Site Content CMS Update
  console.log('\n--- 8. Testing Site Content CMS Update ---');
  const resUpdateContent = await fetch(`${BASE_URL}/api/admin/content`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      announcement: 'OPEN CALL // SPRING 2026 INTAKE EXTENDED',
      productionsCount: '52+'
    })
  });
  assert.strictEqual(resUpdateContent.status, 200);

  const resVerifyContent = await fetch(`${BASE_URL}/api/content`);
  const verifyContentJson = await resVerifyContent.json();
  assert.strictEqual(verifyContentJson.data.announcement, 'OPEN CALL // SPRING 2026 INTAKE EXTENDED');
  console.log('✓ Site content updated and verified across public endpoint');

  // 9. Media Upload System
  console.log('\n--- 9. Testing Media Upload & Security Validation ---');
  const formData = new FormData();
  const dummySvgBlob = new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="yellow" width="100" height="100"/></svg>'], { type: 'image/svg+xml' });
  formData.append('mediaFile', dummySvgBlob, 'test-plate.svg');

  const resUpload = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: formData
  });
  assert.strictEqual(resUpload.status, 200);
  const uploadJson = await resUpload.json();
  assert.strictEqual(uploadJson.success, true);
  assert.ok(uploadJson.fileUrl);
  console.log(`✓ Image upload passed validation: ${uploadJson.fileUrl}`);

  // Non-image rejection test
  const badFormData = new FormData();
  const badBlob = new Blob(['malicious executable'], { type: 'application/x-msdownload' });
  badFormData.append('mediaFile', badBlob, 'dangerous.exe');

  const resBadUpload = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: badFormData
  });
  assert.strictEqual(resBadUpload.status, 400);
  console.log('✓ Invalid MIME type correctly rejected (400)');

  // 10. Static Route Accessibility
  console.log('\n--- 10. Testing Page Delivery & SPA Fallback ---');
  const resIndex = await fetch(`${BASE_URL}/`);
  assert.strictEqual(resIndex.status, 200);
  const indexHtml = await resIndex.text();
  assert.ok(indexHtml.includes('Resolution — Media Collective Platform'));
  console.log('✓ Public index.html served correctly');

  const resAdminPage = await fetch(`${BASE_URL}/admin`);
  assert.strictEqual(resAdminPage.status, 200);
  const adminHtml = await resAdminPage.text();
  assert.ok(adminHtml.includes('Resolution — Curatorial Board CMS') || adminHtml.includes('Curatorial Board CMS'));
  console.log('✓ Admin Portal /admin served correctly');

  console.log('\n🎉 ALL 10 TEST SUITES PASSED FLAWLESSLY WITH 100% SUCCESS!\n');
}

runTests().catch(err => {
  console.error('❌ Test Failed:', err);
  process.exit(1);
});
