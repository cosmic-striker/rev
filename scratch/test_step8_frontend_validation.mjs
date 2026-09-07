/**
 * Comprehensive Step 8 Verification Script: Homepage Content CMS
 */
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

async function runStep8Validation() {
  console.log('🚀 Starting Comprehensive Step 8 Validation...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Static HTML & JS Checks
  console.log('--- 1. Static Files & DOM Structure Verification ---');
  const adminHtml = fs.readFileSync('admin.html', 'utf8');
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  const adminJs = fs.readFileSync('admin.js', 'utf8');
  const mainJs = fs.readFileSync('main.js', 'utf8');

  assert(adminHtml.includes('id="admin-content-view"'), 'admin.html includes #admin-content-view');
  assert(adminHtml.includes('id="tab-panel-hero"'), 'admin.html includes Hero tab panel');
  assert(adminHtml.includes('id="tab-panel-media"'), 'admin.html includes Media tab panel');
  assert(adminHtml.includes('id="tab-panel-manifesto"'), 'admin.html includes Manifesto tab panel');
  assert(adminHtml.includes('id="tab-panel-works"'), 'admin.html includes Featured Works tab panel');
  assert(adminHtml.includes('id="tab-panel-events"'), 'admin.html includes Featured Events tab panel');
  assert(adminHtml.includes('id="tab-panel-announcement"'), 'admin.html includes Announcement tab panel');
  assert(adminHtml.includes('id="tab-panel-visibility"'), 'admin.html includes Section Visibility tab panel');
  assert(adminHtml.includes('id="content-works-picker-modal"'), 'admin.html includes Works Picker modal');
  assert(adminHtml.includes('id="content-events-picker-modal"'), 'admin.html includes Events Picker modal');
  assert(adminHtml.includes('id="content-preview-modal"'), 'admin.html includes 1:1 Preview modal');
  assert(adminHtml.includes('id="content-unsaved-modal"'), 'admin.html includes Unsaved Changes modal');

  assert(indexHtml.includes('id="hero-section"'), 'index.html includes #hero-section');
  assert(indexHtml.includes('id="global-announcement-banner"'), 'index.html includes #global-announcement-banner');
  assert(indexHtml.includes('id="film-reel"'), 'index.html includes #film-reel');

  assert(adminJs.includes('window.loadAdminHomepageContent'), 'admin.js exports window.loadAdminHomepageContent');
  assert(adminJs.includes('window.switchContentTab'), 'admin.js exports window.switchContentTab');
  assert(adminJs.includes('window.saveHomepageDraft'), 'admin.js exports window.saveHomepageDraft');
  assert(adminJs.includes('window.publishHomepageContent'), 'admin.js exports window.publishHomepageContent');
  assert(adminJs.includes('window.discardContentChanges'), 'admin.js exports window.discardContentChanges');
  assert(adminJs.includes('window.openWorksPickerModal'), 'admin.js exports window.openWorksPickerModal');
  assert(adminJs.includes('window.openEventsPickerModal'), 'admin.js exports window.openEventsPickerModal');
  assert(adminJs.includes('window.openHomepagePreviewModal'), 'admin.js exports window.openHomepagePreviewModal');

  assert(mainJs.includes('initDynamicSiteSync'), 'main.js defines initDynamicSiteSync');
  assert(mainJs.includes('/api/content/home'), 'main.js calls /api/content/home for hydration');

  // 2. Authentication & Admin REST API Verification
  console.log('\n--- 2. REST API & End-to-End Workflow Verification ---');

  // Admin login
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'curator_admin', password: 'resolution2026' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  assert(Boolean(token), 'Super Admin logged in successfully');

  // Fetch initial content
  const initRes = await fetch(`${BASE_URL}/api/admin/content/home`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const initJson = await initRes.json();
  assert(initJson.success === true, 'Admin content fetch succeeds');
  assert(Array.isArray(initJson.data.availableWorks), 'Admin receives availableWorks array');
  assert(Array.isArray(initJson.data.availableEvents), 'Admin receives availableEvents array');

  // Save a Draft
  const testDraftPayload = {
    hero: {
      headingLine1: 'We Capture',
      headingLine2: 'Pure Kinetic Cinema.',
      badgeLabel: 'TEST COHORT // STEP 8 DRAFT',
      subheading: 'A curated test draft of the Resolution media homepage.'
    },
    announcement: {
      active: true,
      text: 'SPECIAL TEST NOTICE // DRAFT ACTIVE'
    }
  };

  const draftRes = await fetch(`${BASE_URL}/api/admin/content/home/draft`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testDraftPayload)
  });
  const draftJson = await draftRes.json();
  assert(draftJson.success === true, 'Draft saved successfully on backend');

  // Verify Draft Isolation (Public endpoint must NOT show draft)
  const pubRes1 = await fetch(`${BASE_URL}/api/content/home`);
  const pubJson1 = await pubRes1.json();
  assert(pubJson1.data.heroHeadingLine1 !== 'We Capture', 'Draft is properly isolated from public visitors');

  // Publish Live
  const pubActionRes = await fetch(`${BASE_URL}/api/admin/content/home/publish`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const pubActionJson = await pubActionRes.json();
  assert(pubActionJson.success === true, 'Draft promoted to live published content');

  // Verify Public Reflection
  const pubRes2 = await fetch(`${BASE_URL}/api/content/home`);
  const pubJson2 = await pubRes2.json();
  assert(pubJson2.data.heroHeadingLine1 === 'We Capture', 'Public site immediately reflects published changes');
  assert(pubJson2.data.heroBadge === 'TEST COHORT // STEP 8 DRAFT', 'Public site has updated badge');

  // Restore Default Seed Data for clean baseline
  const resetPayload = {
    hero: {
      headingLine1: 'We Frame',
      headingLine2: 'The Moment.',
      badgeLabel: 'STUDENT MEDIA COLLECTIVE • VOL. 03',
      subheading: 'Resolution is an avant-garde student media collective in visual arts, filmmaking, and contemporary photo-journalism. We turn collegiate friction into archival art.',
      primaryCtaText: 'Explore Selected Work',
      primaryCtaUrl: '#selected-works',
      secondaryCtaText: 'Play Showreel 2026',
      secondaryCtaUrl: 'modal:reel',
      backdropType: 'image',
      backdropImage: 'images/hero.webp'
    },
    manifesto: {
      tag: '01 // MANIFESTO & POSITION',
      heading: "We don't just capture moments.",
      italicHighlight: 'We give them a point of view.',
      body: 'In an era flooded with ephemeral vertical reels, Resolution constructs deliberate cinematic artifacts. Our collective provides university storytellers with industry-spec glass, continuous light bays, sound stages, and festival distribution channels.',
      productionsCount: '48+',
      laurelsCount: '12',
      preservedFramesCount: '140K+',
      creatorsCount: '200+',
      portraitUrl: 'images/crew-portrait.webp',
      portraitLead: 'Cinematography Lead: Ananya Rao',
      portraitExif: 'RAW / 800 ISO',
      quoteTitle: 'PERSPECTIVE OVER PIXELS',
      quoteBody: '"The camera does not record reality; it isolates an intention from chaos."'
    },
    announcement: {
      active: true,
      text: 'OPEN CALL // SPRING 2026 COHORT INTAKE ACTIVE',
      url: '#recruitment-portal',
      actionLabel: 'Apply Now'
    },
    sectionVisibility: {
      hero: true,
      manifesto: true,
      works: true,
      optics: true,
      reel: true,
      events: true,
      team: true,
      recruitment: true
    }
  };

  const resetRes = await fetch(`${BASE_URL}/api/admin/content/home`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resetPayload)
  });
  const resetJson = await resetRes.json();
  assert(resetJson.success === true, 'Baseline homepage content restored cleanly');

  console.log(`\n==============================================`);
  console.log(`📊 FINAL SUMMARY: ${passed} passed, ${failed} failed`);
  console.log(`==============================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runStep8Validation().catch(err => {
  console.error('Validation Script Error:', err);
  process.exit(1);
});
