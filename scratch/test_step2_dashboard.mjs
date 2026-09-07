/**
 * Resolution Admin Step 2 Verification Test Suite
 * Validates /api/admin/metrics payload, calculation fidelity, capacity percentages,
 * needs attention logic, recent activity derivation, and public site non-regression.
 */

async function runStep2Tests() {
  console.log('====================================================');
  console.log('🧪 RUNNING RESOLUTION ADMIN STEP 2 TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  const BASE_URL = 'http://localhost:3000';

  try {
    // 1. Unauthenticated Metrics Request Check (Should return 401)
    console.log('\n--- 1. Testing Unauthenticated Access to Metrics ---');
    const unauthRes = await fetch(`${BASE_URL}/api/admin/metrics`);
    assert(unauthRes.status === 401, `GET /api/admin/metrics unauthenticated should return 401 (got ${unauthRes.status})`);

    // 2. Authenticate as Super Admin
    console.log('\n--- 2. Authenticating as Super Admin (curator_admin) ---');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
    });
    assert(loginRes.status === 200, `Admin login status code is 200 (got ${loginRes.status})`);
    const loginData = await loginRes.json();
    assert(loginData.success === true && loginData.token, 'Super admin received valid JWT token');
    const token = loginData.token;

    // 3. Authenticated Metrics Fetch
    console.log('\n--- 3. Testing Authenticated GET /api/admin/metrics ---');
    const metricsRes = await fetch(`${BASE_URL}/api/admin/metrics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert(metricsRes.status === 200, `Authenticated GET /api/admin/metrics returned 200 OK (got ${metricsRes.status})`);
    const metricsData = await metricsRes.json();
    assert(metricsData.success === true, 'Metrics response reports success: true');
    assert(Boolean(metricsData.data), 'Metrics response contains data payload');

    const d = metricsData.data;

    // 4. Verify Summary Core KPIs
    console.log('\n--- 4. Validating Summary Core KPI Payload ---');
    assert(typeof d.summary === 'object', 'data.summary object exists');
    assert(d.summary.totalWorks >= 4, `summary.totalWorks >= 4 (actual: ${d.summary.totalWorks})`);
    assert(d.summary.upcomingEvents >= 2, `summary.upcomingEvents >= 2 (actual: ${d.summary.upcomingEvents})`);
    assert(d.summary.totalRsvps >= 60, `summary.totalRsvps calculated accurately (actual: ${d.summary.totalRsvps})`);
    assert(d.summary.pendingApplications >= 2, `summary.pendingApplications accurate (actual: ${d.summary.pendingApplications})`);
    assert(d.summary.totalTeamMembers >= 4, `summary.totalTeamMembers accurate (actual: ${d.summary.totalTeamMembers})`);
    assert(d.summary.equipmentCheckedOut >= 1, `summary.equipmentCheckedOut accurate (actual: ${d.summary.equipmentCheckedOut})`);
    assert(d.summary.totalEquipment >= 4, `summary.totalEquipment accurate (actual: ${d.summary.totalEquipment})`);

    // 5. Verify Needs Attention Section
    console.log('\n--- 5. Validating Needs Attention Actionable Items ---');
    assert(Array.isArray(d.needsAttention), 'data.needsAttention is an Array');
    assert(d.needsAttention.length >= 2, `needsAttention contains action items (length: ${d.needsAttention.length})`);
    const hasApplicationAlert = d.needsAttention.some(item => item.category === 'applications' || item.category === 'recruitment');
    assert(hasApplicationAlert, 'needsAttention flags pending applications');
    const hasEquipmentAlert = d.needsAttention.some(item => item.category === 'equipment');
    assert(hasEquipmentAlert, 'needsAttention flags checked out equipment');

    // 6. Verify Upcoming Events and Capacity Progress Calculations
    console.log('\n--- 6. Validating Upcoming Events & Capacity Progress ---');
    assert(Array.isArray(d.upcomingEventsList), 'data.upcomingEventsList is an Array');
    assert(d.upcomingEventsList.length >= 2, `upcomingEventsList contains >= 2 upcoming events (count: ${d.upcomingEventsList.length})`);
    
    d.upcomingEventsList.forEach((evt, idx) => {
      console.log(`   Event #${idx+1}: "${evt.title}" - Capacity: ${evt.capacityPercent}% (${evt.rsvpCount}/${evt.capacity})`);
      assert(typeof evt.capacityPercent === 'number', `Event #${idx+1} has numerical capacityPercent`);
      assert(evt.capacityPercent >= 0 && evt.capacityPercent <= 100, `Event #${idx+1} capacityPercent is within 0-100 range`);
      assert(evt.seatsRemaining === (evt.capacity - evt.rsvpCount), `Event #${idx+1} seatsRemaining matches math`);
    });

    // 7. Verify Recent Activity Feed
    console.log('\n--- 7. Validating Recent Platform Activity Feed ---');
    assert(Array.isArray(d.recentActivity), 'data.recentActivity is an Array');
    assert(d.recentActivity.length >= 5, `recentActivity contains >= 5 real derived items (count: ${d.recentActivity.length})`);
    
    // Check timestamps are sorted descending
    let isSorted = true;
    for (let i = 0; i < d.recentActivity.length - 1; i++) {
      const t1 = new Date(d.recentActivity[i].timestamp).getTime();
      const t2 = new Date(d.recentActivity[i+1].timestamp).getTime();
      if (t1 < t2) {
        isSorted = false;
        break;
      }
    }
    assert(isSorted, 'recentActivity items are sorted chronologically descending');

    // 8. Verify Recent Applications Preview
    console.log('\n--- 8. Validating Recent Applications Preview ---');
    assert(Array.isArray(d.recentApplications), 'data.recentApplications is an Array');
    assert(d.recentApplications.length >= 3, `recentApplications contains candidates (count: ${d.recentApplications.length})`);
    assert(Boolean(d.recentApplications[0].fullName), `First application candidate has fullName: ${d.recentApplications[0].fullName}`);

    // 9. Verify Public Website Non-Regression
    console.log('\n--- 9. Verifying Public Website Non-Regression ---');
    const pubHome = await fetch(`${BASE_URL}/`);
    assert(pubHome.status === 200, 'Public homepage returns 200 OK');
    const pubWorks = await fetch(`${BASE_URL}/api/works`);
    assert(pubWorks.status === 200, 'Public /api/works returns 200 OK');
    const pubEvents = await fetch(`${BASE_URL}/api/events`);
    assert(pubEvents.status === 200, 'Public /api/events returns 200 OK');
    const pubTeam = await fetch(`${BASE_URL}/api/team`);
    assert(pubTeam.status === 200, 'Public /api/team returns 200 OK');
    const pubContent = await fetch(`${BASE_URL}/api/site-content`);
    assert(pubContent.status === 200, 'Public /api/site-content returns 200 OK');

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`📊 STEP 2 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runStep2Tests();
