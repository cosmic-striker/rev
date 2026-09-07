const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('--- STARTING STEP 8 HOMEPAGE CONTENT CMS TESTS ---');

  // 1. Test Public GET /api/content/home
  console.log('\n[1] Testing Public GET /api/content/home:');
  const pubRes = await fetch(`${BASE_URL}/api/content/home`);
  if (!pubRes.ok) {
    throw new Error(`Public endpoint returned status ${pubRes.status}`);
  }
  const pubJson = await pubRes.json();
  if (!pubJson.success || !pubJson.data) {
    throw new Error('Invalid public content response format');
  }
  console.log('✓ Public content fetched successfully.');
  console.log(`  Hero Headline: "${pubJson.data.heroHeadingLine1} ${pubJson.data.heroHeadingLine2}"`);
  console.log(`  Featured Works count: ${pubJson.data.featuredWorks?.length || 0}`);
  console.log(`  Featured Events count: ${pubJson.data.featuredEvents?.length || 0}`);
  if (pubJson.data.draftData !== undefined) {
    throw new Error('Security violation: draftData exposed in public endpoint!');
  }

  // 2. Test Login to get JWT Token
  console.log('\n[2] Authenticating as Super Admin:');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
  });
  const loginJson = await loginRes.json();
  if (!loginJson.success || !loginJson.token) {
    throw new Error('Super Admin authentication failed');
  }
  const token = loginJson.token;
  console.log('✓ Authenticated as curator_admin');

  // 3. Test Admin GET /api/admin/content/home without token (Should fail with 401)
  console.log('\n[3] Testing Unauthenticated Access to Admin Content:');
  const unauthRes = await fetch(`${BASE_URL}/api/admin/content/home`);
  if (unauthRes.status !== 401) {
    throw new Error(`Expected 401 Unauthorized but received ${unauthRes.status}`);
  }
  console.log('✓ Unauthenticated request rejected with 401 Unauthorized.');

  // 4. Test Admin GET /api/admin/content/home with token
  console.log('\n[4] Testing Authenticated Admin GET /api/admin/content/home:');
  const adminRes = await fetch(`${BASE_URL}/api/admin/content/home`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!adminRes.ok) {
    throw new Error(`Admin endpoint returned status ${adminRes.status}`);
  }
  const adminJson = await adminRes.json();
  if (!adminJson.success || !adminJson.data || !adminJson.data.published) {
    throw new Error('Invalid admin content response format');
  }
  console.log('✓ Admin content retrieved successfully.');
  console.log(`  Available Works in picker: ${adminJson.data.availableWorks?.length || 0}`);
  console.log(`  Available Events in picker: ${adminJson.data.availableEvents?.length || 0}`);

  // 5. Test Saving Draft PUT /api/admin/content/home/draft
  console.log('\n[5] Testing Save Draft PUT /api/admin/content/home/draft:');
  const draftPayload = {
    heroHeadingLine1: 'Archival Light',
    heroHeadingLine2: 'Cinematic Vision',
    heroSubheading: 'Draft updated description for student filmmakers.',
    heroBadge: 'VOL. 04 • DRAFT EDITION',
    heroCtaPrimaryLabel: 'View Curated Works',
    heroCtaPrimaryLink: '#selected-works',
    announcementText: 'DRAFT ANNOUNCEMENT // FESTIVAL SUBMISSIONS OPEN',
    announcementActive: true,
    manifestoHeading: 'We frame student cinema.',
    productionsCount: '52+',
    showHero: true,
    showSelectedWorks: true
  };
  const draftRes = await fetch(`${BASE_URL}/api/admin/content/home/draft`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(draftPayload)
  });
  const draftJson = await draftRes.json();
  if (!draftRes.ok || !draftJson.success) {
    throw new Error(`Save draft failed: ${draftJson.error || draftJson.message}`);
  }
  console.log('✓ Draft saved successfully.');

  // Verify that the public endpoint STILL reflects the published version and NOT the draft
  const pubVerifyRes = await fetch(`${BASE_URL}/api/content/home`);
  const pubVerifyJson = await pubVerifyRes.json();
  if (pubVerifyJson.data.heroHeadingLine1 === 'Archival Light') {
    throw new Error('Regression: Draft data prematurely leaked to live public endpoint!');
  }
  console.log('✓ Verified: Public site remains unchanged while draft is in progress.');

  // 6. Test Publishing Content POST /api/admin/content/home/publish
  console.log('\n[6] Testing Publish Live POST /api/admin/content/home/publish:');
  const pubActionRes = await fetch(`${BASE_URL}/api/admin/content/home/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({})
  });
  const pubActionJson = await pubActionRes.json();
  if (!pubActionRes.ok || !pubActionJson.success) {
    throw new Error(`Publish failed: ${pubActionJson.error || pubActionJson.message}`);
  }
  console.log('✓ Homepage published live successfully.');

  // Verify that the public endpoint NOW reflects the published changes
  const liveRes = await fetch(`${BASE_URL}/api/content/home`);
  const liveJson = await liveRes.json();
  if (liveJson.data.heroHeadingLine1 !== 'Archival Light') {
    throw new Error(`Expected published headline "Archival Light" but got "${liveJson.data.heroHeadingLine1}"`);
  }
  console.log('✓ Verified: Public site immediately updated with published changes.');

  // 7. Reset back to original seed content for clean state
  console.log('\n[7] Resetting back to default approved headline:');
  const resetRes = await fetch(`${BASE_URL}/api/admin/content/home`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      heroHeadingLine1: 'We Frame',
      heroHeadingLine2: 'The Moment.',
      heroSubheading: 'Resolution is an avant-garde student media collective in visual arts, filmmaking, and contemporary photo-journalism. We turn collegiate friction into archival art.',
      heroBadge: 'STUDENT MEDIA COLLECTIVE • VOL. 03',
      heroCtaPrimaryLabel: 'Explore Selected Work',
      heroCtaPrimaryLink: '#selected-works',
      heroCtaSecondaryLabel: 'Play Showreel 2026',
      heroCtaSecondaryLink: 'modal:reel',
      announcementText: 'OPEN CALL // SPRING 2026 COHORT INTAKE ACTIVE',
      announcementActive: true,
      manifestoTag: '01 // MANIFESTO & POSITION',
      manifestoHeading: "We don't just capture moments.",
      manifestoHeadingHighlight: 'We give them a point of view.',
      manifestoBody: 'In an era flooded with ephemeral vertical reels, Resolution constructs deliberate cinematic artifacts. Our collective provides university storytellers with industry-spec glass, continuous light bays, sound stages, and festival distribution channels.',
      productionsCount: '48+',
      laurelsCount: '12',
      preservedFramesCount: '140K+',
      creatorsCount: '200+',
      showHero: true,
      showManifesto: true,
      showSelectedWorks: true,
      showOpticalEngine: true,
      showFilmReel: true,
      showEvents: true,
      showTeam: true,
      showRecruitment: true,
      showAnnouncement: true
    })
  });
  const resetJson = await resetRes.json();
  if (!resetRes.ok || !resetJson.success) {
    throw new Error('Failed to reset content to default state');
  }
  console.log('✓ Successfully reset to default approved homepage content.');

  console.log('\n--- ALL STEP 8 HOMEPAGE CONTENT CMS TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('\n❌ Test Error:', err.message);
  process.exit(1);
});
