import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('--- STARTING STEP 9: ABOUT & MILESTONES CMS BACKEND VERIFICATION ---');

  // 1. Authenticate as Super Admin
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
  });
  const adminLoginData = await adminLoginRes.json();
  assert.strictEqual(adminLoginRes.status, 200, 'Super admin login failed');
  assert.ok(adminLoginData.token, 'Super admin token missing');
  const adminToken = adminLoginData.token;
  console.log('✓ 1. Super Admin authentication successful');

  // 2. Authenticate as Content Editor
  const editorLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'editor_resolution', password: 'resolution2026' })
  });
  const editorLoginData = await editorLoginRes.json();
  assert.strictEqual(editorLoginRes.status, 200, 'Editor login failed');
  assert.ok(editorLoginData.token, 'Editor token missing');
  const editorToken = editorLoginData.token;
  console.log('✓ 2. Content Editor authentication successful');

  // 3. Public GET /api/content/about
  const publicRes = await fetch(`${BASE_URL}/api/content/about`);
  const publicData = await publicRes.json();
  assert.strictEqual(publicRes.status, 200, 'Public /api/content/about failed');
  assert.ok(publicData.success, 'Public response not successful');
  assert.ok(publicData.data.aboutOriginStory, 'Public aboutOriginStory missing');
  assert.ok(Array.isArray(publicData.data.milestones), 'Public milestones array missing');
  assert.strictEqual(publicData.data.draftData, undefined, 'Public payload leaked draftData');
  assert.strictEqual(publicData.data.aboutDraftData, undefined, 'Public payload leaked aboutDraftData');
  console.log(`✓ 3. Public API /api/content/about functional with ${publicData.data.milestones.length} published milestones`);

  // 4. Admin GET /api/admin/about
  const adminAboutRes = await fetch(`${BASE_URL}/api/admin/about`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const adminAboutData = await adminAboutRes.json();
  assert.strictEqual(adminAboutRes.status, 200, 'Admin /api/admin/about failed');
  assert.ok(adminAboutData.success, 'Admin response not successful');
  assert.ok(adminAboutData.data.published, 'Published data missing in admin payload');
  console.log('✓ 4. Admin GET /api/admin/about dashboard metadata verified');

  // 5. Test Draft Isolation: PUT /api/admin/about/draft
  const draftPayload = {
    aboutOriginTag: '01 // ORIGIN (DRAFT EXPERIMENT)',
    aboutOriginHeading: 'Testing Draft Story',
    aboutOriginStory: 'This is a work-in-progress draft story that must not appear publicly.',
    aboutOriginQuote: 'Draft quote...',
    aboutOriginQuoteAuthor: 'DRAFT AUTHOR',
    aboutMissionHeading: 'Draft Mission Heading',
    aboutMissionStatement: 'Draft Mission Statement',
    aboutMissionSupporting: 'Draft Supporting Narrative',
    aboutChapterBase: {
      department: 'DRAFT LAB 99',
      coordinates: '0.0000° N, 0.0000° E',
      copyrightText: '© 2026 DRAFT',
      licenseText: 'DRAFT LICENSE'
    },
    aboutCoreValues: [
      { id: 'val-test-1', title: 'Draft Value 1', description: 'Draft description 1', icon: 'star', order: 1 }
    ],
    aboutMedia: {
      portraitUrl: 'https://example.com/draft-portrait.jpg',
      studioImageUrl: 'https://example.com/draft-studio.jpg',
      darkroomImageUrl: 'https://example.com/draft-darkroom.jpg'
    }
  };

  const putDraftRes = await fetch(`${BASE_URL}/api/admin/about/draft`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify(draftPayload)
  });
  const putDraftData = await putDraftRes.json();
  assert.strictEqual(putDraftRes.status, 200, 'Draft PUT failed');
  assert.ok(putDraftData.success, 'Draft save not successful');
  assert.strictEqual(putDraftData.data.aboutOriginTag, '01 // ORIGIN (DRAFT EXPERIMENT)');

  // Verify public endpoint still sees live content, NOT draft
  const publicCheckRes = await fetch(`${BASE_URL}/api/content/about`);
  const publicCheckData = await publicCheckRes.json();
  assert.notStrictEqual(publicCheckData.data.aboutOriginTag, '01 // ORIGIN (DRAFT EXPERIMENT)', 'Draft leaked to public endpoint!');
  console.log('✓ 5. Draft isolation verified: Public site remains unaffected during draft edits');

  // 6. Test Promotion / Direct Publish: PUT /api/admin/about
  const publishRes = await fetch(`${BASE_URL}/api/admin/about`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify(draftPayload)
  });
  const publishData = await publishRes.json();
  assert.strictEqual(publishRes.status, 200, 'Publish PUT failed');
  assert.strictEqual(publishData.data.aboutOriginTag, '01 // ORIGIN (DRAFT EXPERIMENT)');

  const publicLiveRes = await fetch(`${BASE_URL}/api/content/about`);
  const publicLiveData = await publicLiveRes.json();
  assert.strictEqual(publicLiveData.data.aboutOriginTag, '01 // ORIGIN (DRAFT EXPERIMENT)', 'Published content did not reflect on public site');
  console.log('✓ 6. Live publishing promoted successfully to public endpoint');

  // 7. Milestone CRUD Suite
  // A. Create Milestone
  const createMilestoneRes = await fetch(`${BASE_URL}/api/admin/milestones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${editorToken}`
    },
    body: JSON.stringify({
      year: '2027',
      title: 'Automated Test Milestone',
      description: 'Verifying automated milestone lifecycle.',
      category: 'Technology',
      order: 99,
      status: 'published'
    })
  });
  const createMilestoneData = await createMilestoneRes.json();
  assert.strictEqual(createMilestoneRes.status, 201, 'Create milestone failed');
  const createdId = createMilestoneData.data._id || createMilestoneData.data.id;
  assert.ok(createdId, 'Created milestone ID missing');
  console.log(`✓ 7A. Created new milestone with ID ${createdId}`);

  // B. Get Single Milestone
  const getSingleRes = await fetch(`${BASE_URL}/api/admin/milestones/${createdId}`, {
    headers: { 'Authorization': `Bearer ${editorToken}` }
  });
  const getSingleData = await getSingleRes.json();
  assert.strictEqual(getSingleRes.status, 200, 'Get milestone failed');
  assert.strictEqual(getSingleData.data.title, 'Automated Test Milestone');
  console.log('✓ 7B. Retrieved single milestone record');

  // C. Update Milestone
  const updateMilestoneRes = await fetch(`${BASE_URL}/api/admin/milestones/${createdId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${editorToken}`
    },
    body: JSON.stringify({
      year: '2027',
      title: 'Updated Test Milestone Title',
      description: 'Updated milestone description.',
      category: 'Exhibition',
      order: 99,
      status: 'published'
    })
  });
  const updateMilestoneData = await updateMilestoneRes.json();
  assert.strictEqual(updateMilestoneRes.status, 200, 'Update milestone failed');
  assert.strictEqual(updateMilestoneData.data.title, 'Updated Test Milestone Title');
  console.log('✓ 7C. Updated milestone record');

  // D. Toggle Archive
  const archiveRes = await fetch(`${BASE_URL}/api/admin/milestones/${createdId}/archive`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${editorToken}` }
  });
  const archiveData = await archiveRes.json();
  assert.strictEqual(archiveRes.status, 200, 'Archive toggle failed');
  assert.strictEqual(archiveData.data.status, 'archived');
  console.log('✓ 7D. Milestone archive toggle verified');

  // E. Atomic Batch Reorder
  const reorderRes = await fetch(`${BASE_URL}/api/admin/milestones/reorder`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${editorToken}`
    },
    body: JSON.stringify({
      items: [
        { id: createdId, order: 1 }
      ]
    })
  });
  const reorderData = await reorderRes.json();
  assert.strictEqual(reorderRes.status, 200, 'Milestone reorder failed');
  assert.ok(reorderData.success, 'Reorder not successful');
  console.log('✓ 7E. Atomic batch reordering verified');

  // 8. RBAC Test on Delete
  // Content Editor should receive 403 Forbidden on DELETE
  const editorDeleteRes = await fetch(`${BASE_URL}/api/admin/milestones/${createdId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${editorToken}` }
  });
  assert.strictEqual(editorDeleteRes.status, 403, 'Editor was improperly allowed to delete milestone');
  console.log('✓ 8A. RBAC verified: Content Editor rejected with 403 Forbidden for milestone deletion');

  // Super Admin should successfully delete
  const adminDeleteRes = await fetch(`${BASE_URL}/api/admin/milestones/${createdId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const adminDeleteData = await adminDeleteRes.json();
  assert.strictEqual(adminDeleteRes.status, 200, 'Admin delete failed');
  assert.ok(adminDeleteData.success, 'Admin delete unsuccessful');
  console.log('✓ 8B. Super Admin successfully deleted milestone record');

  console.log('\n======================================================');
  console.log('ALL STEP 9 ABOUT & MILESTONES API TESTS PASSED PERFECTLY!');
  console.log('======================================================');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
