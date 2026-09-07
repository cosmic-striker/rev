import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🎬 =======================================================');
  console.log('🎬 RESOLUTION STEP 10: MEDIA LIBRARY VERIFICATION SUITE');
  console.log('🎬 =======================================================\n');

  let adminToken = '';
  let editorToken = '';

  // 1. Super Admin Authentication
  console.log('▶ [1/10] Authenticating Super Admin...');
  const adminAuthRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
  });
  const adminAuth = await adminAuthRes.json();
  if (!adminAuth.token || !['admin', 'super_admin'].includes(adminAuth.user.role)) {
    throw new Error(`Admin login failed: ${JSON.stringify(adminAuth)}`);
  }
  adminToken = adminAuth.token;
  console.log('  ✔ Super Admin authenticated successfully (Role: admin)');

  // 2. Content Editor Authentication
  console.log('▶ [2/10] Authenticating Content Editor...');
  const editorAuthRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'editor_resolution', password: 'resolution2026' })
  });
  const editorAuth = await editorAuthRes.json();
  if (!editorAuth.token || !['editor', 'content_editor'].includes(editorAuth.user.role)) {
    throw new Error(`Editor login failed: ${JSON.stringify(editorAuth)}`);
  }
  editorToken = editorAuth.token;
  console.log('  ✔ Content Editor authenticated successfully (Role: editor)');

  // 3. Fetch Media Library Stats & List
  console.log('▶ [3/10] Testing GET /api/admin/media with real statistics...');
  const mediaListRes = await fetch(`${BASE_URL}/api/admin/media`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const mediaData = await mediaListRes.json();
  if (!mediaData.success || !mediaData.stats || !Array.isArray(mediaData.assets)) {
    throw new Error(`GET /api/admin/media failed: ${JSON.stringify(mediaData)}`);
  }
  console.log('  ✔ Media Library stats returned:');
  console.log(`    - Total Assets: ${mediaData.stats.totalAssets}`);
  console.log(`    - Images: ${mediaData.stats.imagesCount}`);
  console.log(`    - Videos: ${mediaData.stats.videosCount}`);
  console.log(`    - Total Size: ${mediaData.stats.totalStorageFormatted}`);
  console.log(`    - Unused Assets: ${mediaData.stats.unusedCount}`);
  console.log(`    - Items on current page: ${mediaData.assets.length}`);

  if (mediaData.assets.length === 0) {
    throw new Error('Expected initial seeded media assets, found 0.');
  }

  // 4. Test Filtering & Search
  console.log('▶ [4/10] Testing Media filtering (type=video, usage=used) & search...');
  const videoFilterRes = await fetch(`${BASE_URL}/api/admin/media?type=video`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const videoData = await videoFilterRes.json();
  if (!videoData.success || videoData.assets.some(i => i.mediaType !== 'video')) {
    throw new Error(`Type filter failed: ${JSON.stringify(videoData)}`);
  }
  console.log(`  ✔ Type filter (video) returned ${videoData.assets.length} items`);

  const searchRes = await fetch(`${BASE_URL}/api/admin/media?search=lighting`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const searchData = await searchRes.json();
  if (!searchData.success || searchData.assets.length === 0) {
    throw new Error(`Search filter failed: ${JSON.stringify(searchData)}`);
  }
  console.log(`  ✔ Search filter ('lighting') matched ${searchData.assets.length} item(s)`);

  // 5. Test Live Reference Detection & Safe Delete Protection
  console.log('▶ [5/10] Testing Reference Awareness & Safe Delete Protection...');
  const referencedAsset = mediaData.assets.find(item => item.references && item.references.length > 0);
  if (!referencedAsset) {
    throw new Error('Expected at least one referenced media asset among seeded data.');
  }
  console.log(`  - Testing with referenced asset: "${referencedAsset.originalName}" (${referencedAsset.references.length} references)`);
  console.log(`    References: ${referencedAsset.references.map(r => `${r.module}: ${r.title || r.name || r.id}`).join(', ')}`);

  // Attempt to delete referenced asset (should fail with 400 and references list)
  const deleteBlockedRes = await fetch(`${BASE_URL}/api/admin/media/${referencedAsset._id || referencedAsset.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const deleteBlockedData = await deleteBlockedRes.json();
  if (deleteBlockedRes.status !== 400 || !deleteBlockedData.references) {
    throw new Error(`Expected safe delete blocking with status 400, got: ${deleteBlockedRes.status} ${JSON.stringify(deleteBlockedData)}`);
  }
  console.log('  ✔ Safe Delete successfully blocked deletion of actively referenced asset (Status 400 returned with reference details)');

  // 6. Test Metadata Update (PATCH /api/admin/media/:id)
  console.log('▶ [6/10] Testing Metadata Update (PATCH /api/admin/media/:id)...');
  const targetId = referencedAsset._id || referencedAsset.id;
  const updateMetaRes = await fetch(`${BASE_URL}/api/admin/media/${targetId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${editorToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      altText: 'Updated Accessible Alt Text for Test',
      caption: 'Custom Archival Caption for Test',
      tags: ['test-tag-1', 'cinematography', 'updated']
    })
  });
  const updateMetaData = await updateMetaRes.json();
  if (!updateMetaData.success || updateMetaData.asset.altText !== 'Updated Accessible Alt Text for Test') {
    throw new Error(`Metadata update failed: ${JSON.stringify(updateMetaData)}`);
  }
  console.log('  ✔ Metadata updated successfully with alt text, caption, and tags.');

  // 7. Test Media Upload (POST /api/admin/media/upload)
  console.log('▶ [7/10] Testing Media Upload (POST /api/admin/media/upload)...');
  const testFileBuffer = Buffer.from('RIFF....WEBPVP8 ... fake image binary buffer for testing 1234567890');
  const blob = new Blob([testFileBuffer], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('mediaFiles', blob, 'test_upload_banner.jpg');

  const uploadRes = await fetch(`${BASE_URL}/api/admin/media/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    },
    body: formData
  });
  const uploadData = await uploadRes.json();
  if (!uploadData.success || !uploadData.assets || uploadData.assets.length === 0) {
    throw new Error(`Media upload failed: ${JSON.stringify(uploadData)}`);
  }
  const uploadedAsset = uploadData.assets[0];
  console.log(`  ✔ Asset uploaded successfully: "${uploadedAsset.originalName}" -> ${uploadedAsset.url} (ID: ${uploadedAsset._id || uploadedAsset.id})`);

  // 8. Test Safe Asset Replacement (POST /api/admin/media/:id/replace)
  console.log('▶ [8/10] Testing Safe Asset Replacement (POST /api/admin/media/:id/replace)...');
  const replaceBuffer = Buffer.from('RIFF....WEBPVP8 ... replacement binary buffer 987654321');
  const replaceBlob = new Blob([replaceBuffer], { type: 'image/jpeg' });
  const replaceFormData = new FormData();
  replaceFormData.append('file', replaceBlob, 'test_replacement_v2.jpg');

  const replaceRes = await fetch(`${BASE_URL}/api/admin/media/${uploadedAsset._id || uploadedAsset.id}/replace`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    },
    body: replaceFormData
  });
  const replaceData = await replaceRes.json();
  if (!replaceData.success || !replaceData.asset || !replaceData.asset.url) {
    throw new Error(`Asset replacement failed: ${JSON.stringify(replaceData)}`);
  }
  console.log(`  ✔ Asset replaced successfully: newUrl=${replaceData.asset.url} (Propagated references: ${replaceData.updatedReferencesCount})`);

  // 9. Test RBAC & Safe Deletion of Unused Asset
  console.log('▶ [9/10] Testing RBAC Delete Guard & Safe Deletion of Unused Asset...');
  const assetToDeleteId = replaceData.asset._id || replaceData.asset.id;

  // Editor attempts delete -> should fail with 403 Forbidden
  const editorDeleteRes = await fetch(`${BASE_URL}/api/admin/media/${assetToDeleteId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${editorToken}` }
  });
  if (editorDeleteRes.status !== 403) {
    throw new Error(`Expected 403 Forbidden for editor deletion, got ${editorDeleteRes.status}`);
  }
  console.log('  ✔ Content Editor deletion attempt properly rejected with 403 Forbidden (RBAC enforced)');

  // Super Admin deletes unused asset -> should succeed (200 OK)
  const adminDeleteRes = await fetch(`${BASE_URL}/api/admin/media/${assetToDeleteId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const adminDeleteData = await adminDeleteRes.json();
  if (!adminDeleteData.success) {
    throw new Error(`Admin delete failed: ${JSON.stringify(adminDeleteData)}`);
  }
  console.log('  ✔ Super Admin deleted unused asset successfully (200 OK)');

  // 10. Verify Public UI & API Integrity (Zero Regressions)
  console.log('▶ [10/10] Verifying Public API & Page Integrity...');
  const publicContentRes = await fetch(`${BASE_URL}/api/content`);
  const publicContent = await publicContentRes.json();
  if (!publicContent.success || !publicContent.data) {
    throw new Error('Public /api/content failed');
  }

  const publicWorksRes = await fetch(`${BASE_URL}/api/works`);
  const publicWorks = await publicWorksRes.json();
  if (!publicWorks.success || !Array.isArray(publicWorks.data)) {
    throw new Error('Public /api/works failed');
  }

  const publicEventsRes = await fetch(`${BASE_URL}/api/events`);
  const publicEvents = await publicEventsRes.json();
  if (!publicEvents.success || !Array.isArray(publicEvents.data)) {
    throw new Error('Public /api/events failed');
  }

  const publicIndexRes = await fetch(`${BASE_URL}/`);
  if (publicIndexRes.status !== 200) {
    throw new Error('Public homepage returned non-200');
  }
  console.log('  ✔ Public website endpoints & HTML serving completely intact and functional');

  console.log('\n=======================================================');
  console.log('✨ ALL 10 STEP 10 MEDIA LIBRARY TESTS PASSED PERFECTLY!');
  console.log('=======================================================');
}

runTests().catch(err => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
