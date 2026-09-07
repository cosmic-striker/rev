// Frontend DOM & Script Validation for Step 6: Team Management CMS
import fs from 'fs';
import path from 'path';

function runFrontendValidation() {
  console.log('====================================================');
  console.log('  VALIDATING STEP 6 FRONTEND & ADMIN WORKSPACE UI');
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

  const adminHtml = fs.readFileSync('admin.html', 'utf-8');
  const adminJs = fs.readFileSync('admin.js', 'utf-8');
  const mainJs = fs.readFileSync('main.js', 'utf-8');
  const indexHtml = fs.readFileSync('index.html', 'utf-8');

  console.log('\n--- 1. Checking admin.html Structure ---');
  assert(adminHtml.includes('id="admin-team-view"'), 'admin.html contains #admin-team-view');
  assert(adminHtml.includes('id="nav-team"'), 'admin.html contains sidebar #nav-team button');
  assert(adminHtml.includes('id="nav-team-dot"'), 'admin.html contains sidebar #nav-team-dot indicator');
  assert(adminHtml.includes('id="team-stat-total"'), 'admin.html contains KPI #team-stat-total');
  assert(adminHtml.includes('id="team-stat-active"'), 'admin.html contains KPI #team-stat-active');
  assert(adminHtml.includes('id="team-stat-leadership"'), 'admin.html contains KPI #team-stat-leadership');
  assert(adminHtml.includes('id="team-stat-archived"'), 'admin.html contains KPI #team-stat-archived');
  assert(adminHtml.includes('id="team-status-tabs"'), 'admin.html contains filter tabs #team-status-tabs');
  assert(adminHtml.includes('id="team-search-input"'), 'admin.html contains search input #team-search-input');
  assert(adminHtml.includes('id="team-discipline-filter"'), 'admin.html contains dropdown #team-discipline-filter');
  assert(adminHtml.includes('id="team-year-filter"'), 'admin.html contains dropdown #team-year-filter');
  assert(adminHtml.includes('id="team-sort-select"'), 'admin.html contains dropdown #team-sort-select');
  assert(adminHtml.includes('id="team-table-body"'), 'admin.html contains table body #team-table-body');
  assert(adminHtml.includes('id="team-mobile-cards-container"'), 'admin.html contains mobile container #team-mobile-cards-container');
  assert(adminHtml.includes('id="team-form-modal"'), 'admin.html contains modal #team-form-modal');
  assert(adminHtml.includes('id="team-preview-modal"'), 'admin.html contains modal #team-preview-modal');
  assert(adminHtml.includes('id="team-reorder-modal"'), 'admin.html contains modal #team-reorder-modal');
  assert(adminHtml.includes('id="team-delete-modal"'), 'admin.html contains modal #team-delete-modal');
  assert(adminHtml.includes('id="team-unsaved-modal"'), 'admin.html contains modal #team-unsaved-modal');

  console.log('\n--- 2. Checking admin.js Controller Functions ---');
  assert(adminJs.includes('window.loadAdminTeam'), 'admin.js defines window.loadAdminTeam');
  assert(adminJs.includes('window.openCreateTeamModal'), 'admin.js defines window.openCreateTeamModal');
  assert(adminJs.includes('window.openEditTeamModal'), 'admin.js defines window.openEditTeamModal');
  assert(adminJs.includes('window.handleCloseTeamForm'), 'admin.js defines window.handleCloseTeamForm');
  assert(adminJs.includes('window.closeTeamFormModal'), 'admin.js defines window.closeTeamFormModal');
  assert(adminJs.includes('window.handleTeamFormSubmit'), 'admin.js defines window.handleTeamFormSubmit');
  assert(adminJs.includes('window.toggleArchiveTeamMember'), 'admin.js defines window.toggleArchiveTeamMember');
  assert(adminJs.includes('window.openTeamPreviewModal'), 'admin.js defines window.openTeamPreviewModal');
  assert(adminJs.includes('window.openTeamReorderModal'), 'admin.js defines window.openTeamReorderModal');
  assert(adminJs.includes('window.saveTeamReorder'), 'admin.js defines window.saveTeamReorder');
  assert(adminJs.includes('window.openDeleteTeamModal'), 'admin.js defines window.openDeleteTeamModal');
  assert(adminJs.includes('window.executeDeleteTeamMember'), 'admin.js defines window.executeDeleteTeamMember');
  assert(adminJs.includes('window.exportTeamCSV'), 'admin.js defines window.exportTeamCSV');
  assert(adminJs.includes("navigateToAdminSection('team')"), 'admin.js handles navigation to team section');

  console.log('\n--- 3. Checking Public UI Invariance & Dynamic Sync ---');
  assert(indexHtml.includes('id="team"'), 'index.html contains #team section');
  assert(mainJs.includes("fetch('/api/team')"), 'main.js dynamically synchronizes public team cards');
  assert(mainJs.includes('data-cursor="MEET"'), 'main.js maintains data-cursor="MEET"');
  assert(mainJs.includes('data-tilt="true"'), 'main.js maintains data-tilt="true" 3D perspective tilt');

  console.log('\n====================================================');
  console.log(`  VALIDATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runFrontendValidation();
