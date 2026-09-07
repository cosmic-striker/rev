import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  let data = null;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

async function runStep5Tests() {
  console.log('\n--- STARTING STEP 5: SELECTED WORKS CMS TEST SUITE ---\n');

  // 1. PUBLIC ENDPOINTS
  console.log('1. Testing Public GET /api/works...');
  const publicWorksRes = await request('/api/works');
  assert.strictEqual(publicWorksRes.status, 200, 'Public GET /api/works must return 200');
  assert.strictEqual(publicWorksRes.data.success, true, 'Response must be success: true');
  assert(Array.isArray(publicWorksRes.data.data), 'data must be an array');
  assert(publicWorksRes.data.data.length > 0, 'Should return initial seeded works');
  console.log(`  ✓ Public GET /api/works returned ${publicWorksRes.data.data.length} published works`);

  const firstWork = publicWorksRes.data.data[0];
  console.log(`2. Testing Public GET /api/works/:id with ID=${firstWork._id || firstWork.id}...`);
  const publicWorkById = await request(`/api/works/${firstWork._id || firstWork.id}`);
  assert.strictEqual(publicWorkById.status, 200, 'Public GET /api/works/:id must return 200');
  assert.strictEqual(publicWorkById.data.data.title, firstWork.title, 'Should match work title');
  console.log(`  ✓ Public GET /api/works/:id returned "${publicWorkById.data.data.title}"`);

  if (firstWork.workCode) {
    console.log(`3. Testing Public GET /api/works/:id with workCode=${firstWork.workCode}...`);
    const publicWorkByCode = await request(`/api/works/${encodeURIComponent(firstWork.workCode)}`);
    assert.strictEqual(publicWorkByCode.status, 200, 'Public GET /api/works/:workCode must return 200');
    assert.strictEqual(publicWorkByCode.data.data.title, firstWork.title, 'Should match work title');
    console.log(`  ✓ Public GET /api/works/:code returned "${publicWorkByCode.data.data.title}"`);
  }

  if (firstWork.slug) {
    console.log(`3b. Testing Public GET /api/works/:id with slug=${firstWork.slug}...`);
    const publicWorkBySlug = await request(`/api/works/${firstWork.slug}`);
    assert.strictEqual(publicWorkBySlug.status, 200, 'Public GET /api/works/:slug must return 200');
    assert.strictEqual(publicWorkBySlug.data.data.title, firstWork.title, 'Should match work title');
    console.log(`  ✓ Public GET /api/works/:slug returned "${publicWorkBySlug.data.data.title}"`);
  }

  // 2. AUTHENTICATION & ROLE CHECKS
  console.log('\n4. Testing Unauthorized Access to Admin Endpoints...');
  const unauthRes = await request('/api/admin/works');
  assert.strictEqual(unauthRes.status, 401, 'Unauthenticated GET /api/admin/works must return 401');
  console.log('  ✓ Unauthenticated access correctly rejected with 401 Unauthorized');

  console.log('5. Logging in as Super Admin (curator_admin)...');
  const adminLoginRes = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
  });
  assert.strictEqual(adminLoginRes.status, 200, 'Super admin login must succeed');
  const adminToken = adminLoginRes.data.token;
  assert(adminToken, 'Admin token must exist');
  console.log('  ✓ Super Admin login successful');

  console.log('6. Logging in as Content Editor (editor_resolution)...');
  const editorLoginRes = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'editor_resolution', password: 'resolution2026' })
  });
  assert.strictEqual(editorLoginRes.status, 200, 'Editor login must succeed');
  const editorToken = editorLoginRes.data.token;
  assert(editorToken, 'Editor token must exist');
  console.log('  ✓ Content Editor login successful');

  // 3. ADMIN LIST & METRICS
  console.log('\n7. Testing Admin GET /api/admin/works (Super Admin)...');
  const adminWorksRes = await request('/api/admin/works', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(adminWorksRes.status, 200, 'Admin GET /api/admin/works must return 200');
  assert.strictEqual(adminWorksRes.data.success, true);
  assert(adminWorksRes.data.metrics, 'Metrics object must be returned');
  assert(typeof adminWorksRes.data.metrics.total === 'number', 'metrics.total must be a number');
  assert(typeof adminWorksRes.data.metrics.published === 'number', 'metrics.published must be a number');
  console.log(`  ✓ Admin works returned metrics: Total=${adminWorksRes.data.metrics.total}, Published=${adminWorksRes.data.metrics.published}, Drafts=${adminWorksRes.data.metrics.drafts}, Archived=${adminWorksRes.data.metrics.archived}`);

  // 4. CREATE WORK (Admin/Editor)
  console.log('\n8. Testing Admin POST /api/admin/works (Create Work)...');
  const newWorkPayload = {
    title: 'Neon Noir Horizon',
    discipline: 'narrative',
    disciplineLabel: 'NARRATIVE CINEMA',
    format: '2.39:1 ANAMORPHIC // 8K RAW',
    camera: 'ARRI ALEXA MINI LF // ATLAS ORION ANAMORPHIC',
    synopsis: 'A cyberpunk neo-noir exploring subterranean rain corridors in old Madras.',
    shortDescription: 'Cinematography by Rahul V • Sound Design by Ananya',
    crew: 'Director: K. Selvan • Cinematographer: Rahul V • Editor: Priya S',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    aspectRatio: '16:9',
    gridSpan: 'md:col-span-8',
    status: 'published',
    isFeatured: true,
    order: 99,
    laurels: ['Official Selection - Chennai CineFest 2026', 'Best Cinematography - South Asian Indie Awards']
  };

  const createRes = await request('/api/admin/works', {
    method: 'POST',
    headers: { Authorization: `Bearer ${editorToken}` },
    body: JSON.stringify(newWorkPayload)
  });
  assert.strictEqual(createRes.status, 201, 'Editor POST /api/admin/works must return 201');
  assert.strictEqual(createRes.data.success, true);
  const createdWork = createRes.data.data;
  assert.strictEqual(createdWork.title, 'Neon Noir Horizon');
  assert(createdWork._id, 'Created work must have _id');
  console.log(`  ✓ Work created with ID: ${createdWork._id}, workCode: ${createdWork.workCode}`);

  // 5. UPDATE WORK
  console.log('\n9. Testing Admin PUT /api/admin/works/:id (Update Work)...');
  const updateRes = await request(`/api/admin/works/${createdWork._id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${editorToken}` },
    body: JSON.stringify({
      title: 'Neon Noir Horizon (Director Cut)',
      format: '2.39:1 IMAX 70MM // 8K RAW',
      laurels: ['Winner - Best Student Short 2026', 'Official Selection - Chennai CineFest 2026']
    })
  });
  assert.strictEqual(updateRes.status, 200, 'PUT /api/admin/works/:id must return 200');
  assert.strictEqual(updateRes.data.data.title, 'Neon Noir Horizon (Director Cut)');
  assert.strictEqual(updateRes.data.data.format, '2.39:1 IMAX 70MM // 8K RAW');
  console.log(`  ✓ Work updated successfully: "${updateRes.data.data.title}"`);

  // 6. TOGGLE ARCHIVE STATUS
  console.log('\n10. Testing Admin PATCH /api/admin/works/:id/archive (Archive Work)...');
  const archiveRes = await request(`/api/admin/works/${createdWork._id}/archive`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${editorToken}` },
    body: JSON.stringify({ isArchived: true })
  });
  assert.strictEqual(archiveRes.status, 200, 'Archive toggle must return 200');
  assert.strictEqual(archiveRes.data.data.isArchived, true);
  assert.strictEqual(archiveRes.data.data.status, 'archived');
  console.log('  ✓ Work archived successfully');

  // Verify archived work is NOT in public GET /api/works
  console.log('11. Verifying archived work is excluded from Public GET /api/works...');
  const publicAfterArchive = await request('/api/works');
  const foundInPublic = publicAfterArchive.data.data.some(w => (w._id || w.id) === createdWork._id);
  assert.strictEqual(foundInPublic, false, 'Archived work must not appear in public feed');
  console.log('  ✓ Archived work is successfully excluded from public listing');

  // Unarchive it
  console.log('12. Unarchiving work back to published...');
  const unarchiveRes = await request(`/api/admin/works/${createdWork._id}/archive`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${editorToken}` },
    body: JSON.stringify({ isArchived: false, status: 'published' })
  });
  assert.strictEqual(unarchiveRes.status, 200);
  assert.strictEqual(unarchiveRes.data.data.isArchived, false);
  console.log('  ✓ Work unarchived and restored to published');

  // 7. REORDER WORKS
  console.log('\n13. Testing Admin PATCH /api/admin/works/reorder (Bulk Reordering)...');
  const reorderPayload = {
    items: [
      { id: createdWork._id, order: 1 },
      { id: firstWork._id || firstWork.id, order: 2 }
    ]
  };
  const reorderRes = await request('/api/admin/works/reorder', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${editorToken}` },
    body: JSON.stringify(reorderPayload)
  });
  assert.strictEqual(reorderRes.status, 200, 'Reorder works must return 200');
  assert.strictEqual(reorderRes.data.success, true);
  console.log('  ✓ Bulk works reordered successfully');

  // 8. ROLE PERMISSIONS CHECK: DELETE WORK
  console.log('\n14. Testing Role Permission: Content Editor DELETE /api/admin/works/:id (Should be Forbidden)...');
  const editorDeleteRes = await request(`/api/admin/works/${createdWork._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${editorToken}` }
  });
  assert.strictEqual(editorDeleteRes.status, 403, 'Editor DELETE must be rejected with 403 Forbidden');
  console.log('  ✓ Content Editor correctly forbidden from permanently deleting works');

  console.log('15. Testing Role Permission: Super Admin DELETE /api/admin/works/:id (Should Succeed)...');
  const adminDeleteRes = await request(`/api/admin/works/${createdWork._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(adminDeleteRes.status, 200, 'Super Admin DELETE must return 200');
  assert.strictEqual(adminDeleteRes.data.success, true);
  console.log('  ✓ Super Admin successfully deleted work');

  // Verify work is completely gone
  const verifyDeleted = await request(`/api/admin/works/${createdWork._id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(verifyDeleted.status, 404, 'Deleted work must return 404');
  console.log('  ✓ Deleted work verified non-existent (404)');

  // 9. VALIDATION EDGE CASES
  console.log('\n16. Testing Validation on Invalid Work Creation...');
  const invalidCreate = await request('/api/admin/works', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      title: '', // Missing title
      discipline: 'invalid_discipline'
    })
  });
  assert.strictEqual(invalidCreate.status, 400, 'Invalid work creation must return 400 Bad Request');
  console.log('  ✓ Invalid work payload correctly rejected with 400');

  console.log('\n=================================================');
  console.log('  🎉 ALL STEP 5 SELECTED WORKS CMS TESTS PASSED!  ');
  console.log('=================================================\n');
}

runStep5Tests().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
