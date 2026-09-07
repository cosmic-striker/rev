import assert from 'assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Starting Step 7: Contact Inbox Backend API & Security Tests...\n');

  // 1. Authenticate Super Admin & Content Editor
  console.log('1️⃣  Authenticating Admins...');
  const superAdminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
  });
  const superAdminData = await superAdminLoginRes.json();
  assert.strictEqual(superAdminLoginRes.status, 200, 'Super Admin login must return 200');
  const superAdminToken = superAdminData.token;
  console.log('   ✓ Super Admin authenticated successfully (Role: ' + superAdminData.user.role + ')');

  const editorLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'editor_resolution', password: 'resolution2026' })
  });
  const editorData = await editorLoginRes.json();
  assert.strictEqual(editorLoginRes.status, 200, 'Editor login must return 200');
  const editorToken = editorData.token;
  console.log('   ✓ Content Editor authenticated successfully (Role: ' + editorData.user.role + ')');

  // 2. Test Public Contact Submission
  console.log('\n2️⃣  Testing Public Contact Submission (POST /api/contact)...');
  const testContactPayload = {
    name: 'Mira Sundaram',
    email: 'mira.sundaram@cinema-collective.in',
    phone: '+91 98765 43210',
    subject: 'Collaboration Proposal: Indie Short Film Retrospective',
    message: 'Greetings Resolution Curatorial Board. We would love to collaborate on a screening session showcasing student cinematography work in South India.'
  };

  const submitRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testContactPayload)
  });
  const submitData = await submitRes.json();
  assert.strictEqual(submitRes.status, 201, 'Public submission must return 201 Created');
  assert.strictEqual(submitData.success, true, 'success field must be true');
  assert.ok(submitData.contactId, 'Must return assigned contact ID');
  const newContactId = submitData.contactId;
  console.log('   ✓ Contact submission created ID:', newContactId);

  // 3. Test Public Validation Errors
  console.log('\n3️⃣  Testing Input Validation & Sanitization...');
  const invalidEmailRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Bad Email User',
      email: 'not-an-email',
      message: 'Hello Resolution collective.'
    })
  });
  assert.strictEqual(invalidEmailRes.status, 400, 'Invalid email should return 400');
  console.log('   ✓ Invalid email correctly rejected (400)');

  const tooShortMsgRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Brief User',
      email: 'user@test.org',
      message: 'Hi'
    })
  });
  assert.strictEqual(tooShortMsgRes.status, 400, 'Message < 5 characters should return 400');
  console.log('   ✓ Short message < 5 chars correctly rejected (400)');

  // 4. Test Admin List Contacts & KPI Stats
  console.log('\n4️⃣  Testing Admin Contact Listing & Stats Aggregation (GET /api/admin/contacts)...');
  const listRes = await fetch(`${BASE_URL}/api/admin/contacts?status=all&limit=50`, {
    headers: { Authorization: `Bearer ${superAdminToken}` }
  });
  const listData = await listRes.json();
  assert.strictEqual(listRes.status, 200, 'Admin contact list must return 200');
  assert.ok(Array.isArray(listData.contacts), 'Must return contacts array');
  assert.ok(listData.stats, 'Must return aggregate stats');
  console.log('   ✓ Stats returned:', listData.stats);
  console.log('   ✓ Total contacts count:', listData.pagination.total);
  assert.ok(listData.stats.total >= 1, 'Total stats must be >= 1');
  assert.ok(listData.stats.pending >= 1, 'Pending stats must be >= 1');

  // Verify created contact is in list
  const foundCreated = listData.contacts.find(c => c._id === newContactId);
  assert.ok(foundCreated, 'Newly created contact must be in admin list');
  assert.strictEqual(foundCreated.name, 'Mira Sundaram');
  assert.strictEqual(foundCreated.status, 'pending');
  assert.strictEqual(foundCreated.isRead, false);

  // 5. Test Filter & Search Functionality
  console.log('\n5️⃣  Testing Search & Status Filters...');
  const searchRes = await fetch(`${BASE_URL}/api/admin/contacts?search=Mira`, {
    headers: { Authorization: `Bearer ${superAdminToken}` }
  });
  const searchData = await searchRes.json();
  assert.strictEqual(searchRes.status, 200);
  assert.ok(searchData.contacts.some(c => c.name.includes('Mira')), 'Search should return Mira');
  console.log(`   ✓ Search for "Mira" found ${searchData.contacts.length} record(s)`);

  const pendingFilterRes = await fetch(`${BASE_URL}/api/admin/contacts?status=pending`, {
    headers: { Authorization: `Bearer ${superAdminToken}` }
  });
  const pendingData = await pendingFilterRes.json();
  assert.ok(pendingData.contacts.every(c => c.status === 'pending' || !c.isRead), 'All records must be pending/unread');
  console.log(`   ✓ Pending status filter returned ${pendingData.contacts.length} record(s)`);

  // 6. Test Single Contact Detail & Auto-Mark As Read
  console.log('\n6️⃣  Testing Contact Detail Fetch (GET /api/admin/contacts/:id)...');
  const detailRes = await fetch(`${BASE_URL}/api/admin/contacts/${newContactId}`, {
    headers: { Authorization: `Bearer ${superAdminToken}` }
  });
  const detailData = await detailRes.json();
  assert.strictEqual(detailRes.status, 200);
  assert.strictEqual(detailData.contact._id, newContactId);
  assert.strictEqual(detailData.contact.isRead, true, 'Opening contact should auto-mark as read');
  assert.strictEqual(detailData.contact.status, 'read');
  console.log('   ✓ Detail fetched and automatically marked as read');

  // 7. Test Contact Status & Notes Update (PATCH /api/admin/contacts/:id)
  console.log('\n7️⃣  Testing Status Transition & Notes (PATCH /api/admin/contacts/:id)...');
  const updateRes = await fetch(`${BASE_URL}/api/admin/contacts/${newContactId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${editorToken}`
    },
    body: JSON.stringify({
      status: 'resolved',
      notes: 'Reviewed by curatorial team; agreed to schedule a call for next week.'
    })
  });
  const updateData = await updateRes.json();
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateData.contact.status, 'resolved');
  assert.strictEqual(updateData.contact.notes, 'Reviewed by curatorial team; agreed to schedule a call for next week.');
  console.log('   ✓ Status updated to "resolved" and notes persisted by Content Editor');

  // 8. Test Role RBAC: Content Editor Deletion Forbidden (403)
  console.log('\n8️⃣  Testing Role-Based Access Control (RBAC) on Deletion...');
  const editorDeleteRes = await fetch(`${BASE_URL}/api/admin/contacts/${newContactId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${editorToken}` }
  });
  assert.strictEqual(editorDeleteRes.status, 403, 'Content Editor must be forbidden from deleting contacts (403)');
  console.log('   ✓ Content Editor DELETE correctly blocked with 403 Forbidden');

  // 9. Test Super Admin Deletion Permitted (200)
  console.log('\n9️⃣  Testing Super Admin Permanent Deletion (DELETE /api/admin/contacts/:id)...');
  const superAdminDeleteRes = await fetch(`${BASE_URL}/api/admin/contacts/${newContactId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${superAdminToken}` }
  });
  assert.strictEqual(superAdminDeleteRes.status, 200, 'Super Admin deletion must return 200');
  console.log('   ✓ Super Admin successfully deleted contact');

  // Verify it is gone
  const verifyGoneRes = await fetch(`${BASE_URL}/api/admin/contacts/${newContactId}`, {
    headers: { Authorization: `Bearer ${superAdminToken}` }
  });
  assert.strictEqual(verifyGoneRes.status, 404, 'Deleted contact must return 404 Not Found');
  console.log('   ✓ Verification confirmed: contact is purged (404)');

  // 10. Test Admin Metrics Integration
  console.log('\n🔟 Testing Dashboard Metrics Live Integration (/api/admin/metrics)...');
  const metricsRes = await fetch(`${BASE_URL}/api/admin/metrics`, {
    headers: { Authorization: `Bearer ${superAdminToken}` }
  });
  const metricsData = await metricsRes.json();
  assert.strictEqual(metricsRes.status, 200);
  const summary = metricsData.data?.summary || metricsData.summary || metricsData.data;
  assert.ok(typeof summary.pendingContacts === 'number', 'pendingContacts summary metric exists');
  assert.ok(typeof summary.totalContacts === 'number', 'totalContacts summary metric exists');
  console.log(`   ✓ Dashboard Metrics: pendingContacts=${summary.pendingContacts}, totalContacts=${summary.totalContacts}`);

  console.log('\n🎉 ALL STEP 7 CONTACT INBOX TESTS PASSED SUCCESSFULLY! ✅\n');
}

runTests().catch(err => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
