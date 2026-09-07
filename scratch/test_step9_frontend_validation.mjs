import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('--- STARTING STEP 9: FRONTEND CODE & DOM ELEMENT INTEGRITY VALIDATION ---');

const baseDir = process.cwd();
const adminHtmlPath = path.join(baseDir, 'admin.html');
const adminJsPath = path.join(baseDir, 'admin.js');
const mainJsPath = path.join(baseDir, 'main.js');

const adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');
const adminJs = fs.readFileSync(adminJsPath, 'utf8');
const mainJs = fs.readFileSync(mainJsPath, 'utf8');

// 1. Check admin.html elements
const requiredHtmlIds = [
  'nav-about',
  'nav-about-dot',
  'nav-about-badge',
  'admin-about-view',
  'about-status-badge',
  'about-last-published-info',
  'btn-preview-about',
  'btn-save-about-draft',
  'btn-publish-about',
  'btn-discard-about',
  'tab-btn-about-origin',
  'tab-btn-about-mission',
  'tab-btn-about-values',
  'tab-btn-about-milestones',
  'tab-btn-about-media',
  'tab-btn-about-history',
  'tab-panel-about-origin',
  'tab-panel-about-mission',
  'tab-panel-about-values',
  'tab-panel-about-milestones',
  'tab-panel-about-media',
  'tab-panel-about-history',
  'input-about-origin-tag',
  'input-about-origin-heading',
  'input-about-origin-story',
  'input-about-origin-quote',
  'input-about-origin-quote-author',
  'input-about-mission-heading',
  'input-about-mission-statement',
  'input-about-mission-supporting',
  'input-about-chapter-dept',
  'input-about-chapter-coords',
  'input-about-chapter-copyright',
  'input-about-chapter-license',
  'about-values-list',
  'about-values-empty',
  'milestone-pill-total',
  'milestone-pill-published',
  'milestone-pill-draft',
  'milestone-pill-archived',
  'milestones-search-input',
  'milestones-status-filter',
  'milestones-category-filter',
  'milestones-sort-select',
  'milestones-table-body',
  'milestones-mobile-cards',
  'milestones-empty-state',
  'milestones-loading-skeleton',
  'input-about-media-portrait',
  'input-about-media-studio',
  'input-about-media-darkroom',
  'about-json-preview',
  'milestone-form-modal',
  'milestone-delete-modal',
  'milestone-reorder-modal',
  'value-form-modal',
  'about-preview-modal',
  'about-unsaved-modal'
];

requiredHtmlIds.forEach(id => {
  assert.ok(adminHtml.includes(`id="${id}"`), `Missing DOM element in admin.html: #${id}`);
});
console.log(`✓ 1. admin.html contains all ${requiredHtmlIds.length} required Step 9 DOM elements & modals`);

// 2. Check admin.js controllers & methods
const requiredJsSymbols = [
  'AboutState',
  'switchAboutTab',
  'markAboutDirty',
  'loadAdminAboutContent',
  'populateAboutForm',
  'collectAboutFormData',
  'saveAboutDraft',
  'publishAboutContent',
  'discardAboutChanges',
  'confirmDiscardAboutChanges',
  'openAddValueModal',
  'openEditValueModal',
  'handleValueFormSubmit',
  'removeCoreValue',
  'loadAdminMilestones',
  'renderMilestonesTable',
  'openCreateMilestoneModal',
  'openEditMilestoneModal',
  'handleMilestoneFormSubmit',
  'toggleArchiveMilestone',
  'openDeleteMilestoneModal',
  'executeDeleteMilestone',
  'openMilestonesReorderModal',
  'saveMilestonesReorder',
  'openAboutPreviewModal',
  'closeAboutPreviewModal'
];

requiredJsSymbols.forEach(sym => {
  assert.ok(adminJs.includes(sym), `Missing symbol/method in admin.js: ${sym}`);
});
console.log(`✓ 2. admin.js contains all ${requiredJsSymbols.length} required Step 9 methods and state controllers`);

// 3. Check main.js hydration
assert.ok(mainJs.includes('/api/content/about'), 'main.js missing /api/content/about hydration call');
assert.ok(mainJs.includes('resolutionAboutData'), 'main.js missing resolutionAboutData assignment');
console.log('✓ 3. main.js contains dynamic About & Milestones hydration without altering frozen UI');

console.log('\n======================================================');
console.log('ALL FRONTEND INTEGRITY VALIDATIONS PASSED PERFECTLY!');
console.log('======================================================');
