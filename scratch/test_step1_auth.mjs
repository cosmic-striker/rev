import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';

async function runStep1Tests() {
  console.log('🚀 Starting Resolution Admin Step 1: Foundation & Authentication Test Suite...\n');

  // ----------------------------------------------------
  // Test 1: Static Route Delivery for /admin, /admin/login, /admin/dashboard
  // ----------------------------------------------------
  console.log('--- Test 1: Admin Route Delivery ---');
  const resAdmin = await fetch(`${BASE_URL}/admin`);
  assert.strictEqual(resAdmin.status, 200);
  const htmlAdmin = await resAdmin.text();
  assert.ok(htmlAdmin.includes('Resolution — Curatorial Board CMS'));
  assert.ok(htmlAdmin.includes('id="login-screen"'));
  assert.ok(htmlAdmin.includes('id="admin-app-shell"'));
  console.log('✓ /admin delivers admin.html with login screen and dashboard shell');

  const resAdminLogin = await fetch(`${BASE_URL}/admin/login`);
  assert.strictEqual(resAdminLogin.status, 200);
  console.log('✓ /admin/login delivers admin.html');

  const resAdminDashboard = await fetch(`${BASE_URL}/admin/dashboard`);
  assert.strictEqual(resAdminDashboard.status, 200);
  console.log('✓ /admin/dashboard delivers admin.html');

  // ----------------------------------------------------
  // Test 2: Invalid Credentials Rejection
  // ----------------------------------------------------
  console.log('\n--- Test 2: Invalid Credentials Handling ---');
  const resBadLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'curator_admin', password: 'wrong_password_123' })
  });
  assert.strictEqual(resBadLogin.status, 401);
  const badLoginJson = await resBadLogin.json();
  assert.strictEqual(badLoginJson.success, false);
  assert.ok(badLoginJson.message);
  console.log('✓ Invalid password correctly rejected (401) with clean message:', badLoginJson.message);

  const resEmptyLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: '', password: '' })
  });
  assert.strictEqual(resEmptyLogin.status, 400);
  console.log('✓ Empty credentials rejected (400)');

  // ----------------------------------------------------
  // Test 3: Valid Super Admin Authentication
  // ----------------------------------------------------
  console.log('\n--- Test 3: Super Admin Login Flow ---');
  const resAdminLoginApi = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
  });
  assert.strictEqual(resAdminLoginApi.status, 200);
  const adminLoginJson = await resAdminLoginApi.json();
  assert.strictEqual(adminLoginJson.success, true);
  assert.ok(adminLoginJson.token);
  assert.strictEqual(adminLoginJson.user.role, 'admin');
  assert.strictEqual(adminLoginJson.user.username, 'curator_admin');
  const adminToken = adminLoginJson.token;
  console.log('✓ Super Admin authenticated successfully (JWT + role: admin)');

  // ----------------------------------------------------
  // Test 4: Valid Content Editor Authentication
  // ----------------------------------------------------
  console.log('\n--- Test 4: Content Editor Login Flow ---');
  const resEditorLoginApi = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'editor_resolution', password: 'resolution2026' })
  });
  assert.strictEqual(resEditorLoginApi.status, 200);
  const editorLoginJson = await resEditorLoginApi.json();
  assert.strictEqual(editorLoginJson.success, true);
  assert.ok(editorLoginJson.token);
  assert.strictEqual(editorLoginJson.user.role, 'editor');
  assert.strictEqual(editorLoginJson.user.username, 'editor_resolution');
  const editorToken = editorLoginJson.token;
  console.log('✓ Content Editor authenticated successfully (JWT + role: editor)');

  // ----------------------------------------------------
  // Test 5: Token Verification via /api/auth/me
  // ----------------------------------------------------
  console.log('\n--- Test 5: Token Verification Endpoint (/api/auth/me) ---');
  const resMeAdmin = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(resMeAdmin.status, 200);
  const meAdminJson = await resMeAdmin.json();
  assert.strictEqual(meAdminJson.success, true);
  assert.strictEqual(meAdminJson.user.role, 'admin');
  console.log('✓ Verified Super Admin token via /api/auth/me');

  const resMeEditor = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${editorToken}` }
  });
  assert.strictEqual(resMeEditor.status, 200);
  const meEditorJson = await resMeEditor.json();
  assert.strictEqual(meEditorJson.success, true);
  assert.strictEqual(meEditorJson.user.role, 'editor');
  console.log('✓ Verified Content Editor token via /api/auth/me');

  // ----------------------------------------------------
  // Test 6: Expired / Invalid Token Handling (Session Expiry)
  // ----------------------------------------------------
  console.log('\n--- Test 6: Invalid / Expired Token Rejection ---');
  const resInvalidToken = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': 'Bearer invalid_tampered_token_xyz' }
  });
  assert.strictEqual(resInvalidToken.status, 401);
  console.log('✓ Invalid token rejected with 401 Unauthorized');

  const resProtectedMetricsNoToken = await fetch(`${BASE_URL}/api/admin/metrics`);
  assert.strictEqual(resProtectedMetricsNoToken.status, 401);
  console.log('✓ Unauthenticated request to protected metrics rejected (401)');

  // ----------------------------------------------------
  // Test 7: Protected Metrics Access for Authenticated Session
  // ----------------------------------------------------
  console.log('\n--- Test 7: Authenticated Metrics Access ---');
  const resMetrics = await fetch(`${BASE_URL}/api/admin/metrics`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(resMetrics.status, 200);
  const metricsJson = await resMetrics.json();
  assert.strictEqual(metricsJson.success, true);
  assert.ok(metricsJson.data.totalWorks >= 0);
  console.log('✓ Live telemetry metrics retrieved for dashboard shell:', metricsJson.data);

  // ----------------------------------------------------
  // Test 8: Public Resolution Website Zero-Regression
  // ----------------------------------------------------
  console.log('\n--- Test 8: Public Website Integrity Check ---');
  const resIndex = await fetch(`${BASE_URL}/`);
  assert.strictEqual(resIndex.status, 200);
  const htmlIndex = await resIndex.text();
  assert.ok(htmlIndex.includes('Resolution — Media Collective Platform'));
  assert.ok(htmlIndex.includes('id="selected-works"'));
  assert.ok(htmlIndex.includes('id="manifesto"'));
  assert.ok(htmlIndex.includes('id="events"'));
  assert.ok(htmlIndex.includes('id="optical-engine"'));
  console.log('✓ Public website index.html intact with all sections');

  console.log('\n🎉 ALL 8 STEP-1 VERIFICATION TESTS PASSED FLAWLESSLY WITH 100% SUCCESS!\n');
}

runStep1Tests().catch(err => {
  console.error('❌ Step 1 Test Failed:', err);
  process.exit(1);
});
