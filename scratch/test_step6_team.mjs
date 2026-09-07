// Step 6 Automated Test Suite: Team Management CMS
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('  RUNNING STEP 6 TEAM MANAGEMENT CMS TEST SUITE');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Test Public GET /api/team
    console.log('\n--- 1. Testing Public Team API ---');
    const pubRes = await fetch(`${BASE_URL}/api/team`);
    assert(pubRes.status === 200, 'Public GET /api/team returns 200 OK');
    const pubJson = await pubRes.json();
    assert(pubJson.success === true, 'Public response success is true');
    assert(Array.isArray(pubJson.data) && pubJson.data.length >= 4, `Initial public team members returned (${pubJson.data.length})`);
    
    // Check discipline filter on public endpoint
    const dirRes = await fetch(`${BASE_URL}/api/team?discipline=direction`);
    const dirJson = await dirRes.json();
    assert(dirJson.success === true && dirJson.data.length >= 1, `Public discipline filter (direction) returns members (${dirJson.data.length})`);

    // 2. Test Public GET /api/team/:id
    console.log('\n--- 2. Testing Public Member by ID / Name / Handle ---');
    const firstMember = pubJson.data[0];
    const singleRes = await fetch(`${BASE_URL}/api/team/${firstMember._id || firstMember.id}`);
    assert(singleRes.status === 200, 'Public GET /api/team/:id returns 200 OK');
    const singleJson = await singleRes.json();
    assert(singleJson.data && singleJson.data.name === firstMember.name, `Member matches name: "${firstMember.name}"`);

    // 3. Test Admin Authentication for Super Admin & Editor
    console.log('\n--- 3. Testing Admin Authentication ---');
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
    });
    const adminAuth = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminAuth.token, 'Super Admin login successful');
    const adminToken = adminAuth.token;

    const editorLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'editor_resolution', password: 'resolution2026' })
    });
    const editorAuth = await editorLoginRes.json();
    assert(editorLoginRes.status === 200 && editorAuth.token, 'Content Editor login successful');
    const editorToken = editorAuth.token;

    // 4. Test Admin GET /api/admin/team
    console.log('\n--- 4. Testing Admin Team Roster & Telemetry ---');
    const adminListRes = await fetch(`${BASE_URL}/api/admin/team`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(adminListRes.status === 200, 'Admin GET /api/admin/team returns 200 OK');
    const adminListJson = await adminListRes.json();
    assert(adminListJson.success === true, 'Admin response success is true');
    assert(adminListJson.counts && typeof adminListJson.counts.active === 'number', `Counts object returned with active: ${adminListJson.counts.active}`);

    // 5. Test Admin POST /api/admin/team (Create Team Member)
    console.log('\n--- 5. Testing Create Team Member (Editor) ---');
    const newMemberPayload = {
      name: 'Test Visionary',
      role: 'Head of Sound Systems',
      handle: '@test_visionary',
      discipline: 'sound',
      disciplineCode: 'SND • 02',
      academicYear: 'Third Year',
      order: 99,
      status: 'active',
      isHeadOfDiscipline: true,
      bio: 'Pioneering binaural audio recording methods for experimental short films.',
      portraitUrl: '/assets/images/placeholder-portrait.jpg'
    };

    const createRes = await fetch(`${BASE_URL}/api/admin/team`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${editorToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMemberPayload)
    });
    assert(createRes.status === 201, 'POST /api/admin/team returns 201 Created');
    const createJson = await createRes.json();
    const createdId = createJson.data._id || createJson.data.id;
    assert(Boolean(createdId), `Created member ID: ${createdId}`);

    // Validation Check: missing name or role
    const invalidRes = await fetch(`${BASE_URL}/api/admin/team`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${editorToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: '' })
    });
    assert(invalidRes.status === 400, 'POST /api/admin/team rejects empty name with 400 Bad Request');

    // 6. Test Admin PUT /api/admin/team/:id (Update Team Member)
    console.log('\n--- 6. Testing Update Team Member ---');
    const updateRes = await fetch(`${BASE_URL}/api/admin/team/${createdId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${editorToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Visionary (Updated)',
        role: 'Chief Sound Architect & Mixer',
        isHeadOfDiscipline: false
      })
    });
    assert(updateRes.status === 200, 'PUT /api/admin/team/:id returns 200 OK');
    const updateJson = await updateRes.json();
    assert(updateJson.data.name === 'Test Visionary (Updated)', 'Member name updated correctly');
    assert(updateJson.data.isHeadOfDiscipline === false, 'Leadership flag updated correctly');

    // 7. Test Admin PATCH /api/admin/team/:id/archive (Toggle Archive)
    console.log('\n--- 7. Testing Archive & Restore ---');
    const archiveRes = await fetch(`${BASE_URL}/api/admin/team/${createdId}/archive`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${editorToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isArchived: true })
    });
    assert(archiveRes.status === 200, 'PATCH /api/admin/team/:id/archive returns 200 OK');
    const archiveJson = await archiveRes.json();
    assert(archiveJson.data.isArchived === true && archiveJson.data.status === 'archived', 'Member archived and status set to archived');

    // Unarchive
    const unarchiveRes = await fetch(`${BASE_URL}/api/admin/team/${createdId}/archive`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${editorToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isArchived: false })
    });
    assert(unarchiveRes.status === 200, 'PATCH /api/admin/team/:id/archive restore returns 200 OK');

    // 8. Test Admin PATCH /api/admin/team/reorder (Batch Reordering)
    console.log('\n--- 8. Testing Batch Reordering ---');
    const reorderRes = await fetch(`${BASE_URL}/api/admin/team/reorder`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${editorToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orders: [
          { id: createdId, order: 1 }
        ]
      })
    });
    const reorderBody = await reorderRes.text();
    if (reorderRes.status !== 200) {
      console.log(`    [DEBUG] Reorder status: ${reorderRes.status}, body: ${reorderBody}`);
    }
    assert(reorderRes.status === 200, 'PATCH /api/admin/team/reorder returns 200 OK');

    // 9. Test Role Permissions on DELETE (Editor Forbidden 403 vs Admin Allowed 200)
    console.log('\n--- 9. Testing Role Security & Deletion Permissions ---');
    const editorDeleteRes = await fetch(`${BASE_URL}/api/admin/team/${createdId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${editorToken}` }
    });
    assert(editorDeleteRes.status === 403, 'Content Editor DELETE returns 403 Forbidden');

    const adminDeleteRes = await fetch(`${BASE_URL}/api/admin/team/${createdId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(adminDeleteRes.status === 200, 'Super Admin DELETE returns 200 OK');

    // Verify member is gone
    const verifyGetRes = await fetch(`${BASE_URL}/api/admin/team/${createdId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(verifyGetRes.status === 404, 'Deleted member returns 404 Not Found');

    // 10. Test Admin Live Metrics Endpoint includes Team count
    console.log('\n--- 10. Testing Dashboard Telemetry Integration ---');
    const metricsRes = await fetch(`${BASE_URL}/api/admin/metrics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const metricsJson = await metricsRes.json();
    assert(metricsJson.success === true, 'Admin metrics returned');
    assert(typeof metricsJson.data.teamMembers === 'number', `Metrics includes teamMembers count: ${metricsJson.data.teamMembers}`);

  } catch (err) {
    console.error('Fatal Test Error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`  STEP 6 RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
