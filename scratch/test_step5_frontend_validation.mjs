import fs from 'fs';
import assert from 'node:assert';

console.log('\n--- VALIDATING STEP 5 FRONTEND ARTIFACTS & INTEGRATION ---\n');

// 1. Validate admin.html
console.log('1. Validating admin.html markup and DOM IDs...');
const adminHtml = fs.readFileSync('admin.html', 'utf8');

const requiredAdminIds = [
  'nav-works',
  'admin-works-view',
  'works-count-all',
  'works-count-published',
  'works-count-draft',
  'works-count-archived',
  'works-count-featured',
  'works-search-input',
  'works-discipline-filter',
  'works-status-select',
  'works-featured-select',
  'works-sort-select',
  'works-table-body',
  'works-mobile-cards',
  'works-empty-state',
  'works-pagination-bar',
  'work-form-modal',
  'work-form',
  'work-form-id',
  'work-title-input',
  'work-slug-input',
  'work-discipline-select',
  'work-disciplinelabel-input',
  'work-code-input',
  'work-format-input',
  'work-camera-input',
  'work-aspectratio-select',
  'work-gridspan-select',
  'work-order-input',
  'work-crew-input',
  'work-file-input',
  'work-image-url-input',
  'work-cover-img-preview',
  'work-laurel-input',
  'work-laurels-container',
  'work-preview-modal',
  'work-reorder-modal',
  'work-reorder-list',
  'work-delete-modal',
  'work-unsaved-modal'
];

requiredAdminIds.forEach(id => {
  assert(adminHtml.includes(`id="${id}"`), `admin.html must contain element with id="${id}"`);
});
console.log(`  ✓ All ${requiredAdminIds.length} required Selected Works DOM elements present in admin.html`);

// 2. Validate admin.js
console.log('\n2. Validating admin.js state and controller functions...');
const adminJs = fs.readFileSync('admin.js', 'utf8');

const requiredJsFunctions = [
  'loadAdminWorks',
  'renderWorksTable',
  'renderWorksMobileCards',
  'updateWorksStatusBadges',
  'updateWorksPaginationUI',
  'prevWorksPage',
  'nextWorksPage',
  'setWorksStatusFilter',
  'handleWorksFilterChange',
  'initWorksSearchInput',
  'clearWorksSearch',
  'openCreateWorkModal',
  'openEditWorkModal',
  'closeWorkFormModal',
  'handleCloseWorkForm',
  'confirmDiscardWorkChanges',
  'closeWorkUnsavedModal',
  'handleWorkTitleInput',
  'handleWorkDisciplineChange',
  'handleWorkFileInputChange',
  'handleWorkUrlDirectInput',
  'clearWorkImagePreview',
  'addLaurelTag',
  'removeLaurelTag',
  'renderLaurelTags',
  'handleWorkFormSubmit',
  'toggleArchiveWork',
  'openWorkPreviewModal',
  'closeWorkPreviewModal',
  'openWorkReorderModal',
  'closeWorkReorderModal',
  'renderWorkReorderList',
  'moveWorkOrderItem',
  'saveWorksReorder',
  'openDeleteWorkModal',
  'closeDeleteWorkModal',
  'executeDeleteWork'
];

requiredJsFunctions.forEach(fn => {
  assert(adminJs.includes(fn), `admin.js must define function "${fn}"`);
});
console.log(`  ✓ All ${requiredJsFunctions.length} Selected Works controller functions present in admin.js`);

// 3. Validate main.js
console.log('\n3. Validating main.js public website dynamic sync...');
const mainJs = fs.readFileSync('main.js', 'utf8');
assert(mainJs.includes('syncWorksFromAPI'), 'main.js must define syncWorksFromAPI');
assert(mainJs.includes('/api/works'), 'main.js must fetch from /api/works');
assert(mainJs.includes('openWorkLightbox'), 'main.js must maintain openWorkLightbox');
assert(mainJs.includes('worksData'), 'main.js must maintain worksData mapping');
console.log('  ✓ Public sync and Lightbox integrations validated in main.js');

// 4. Validate index.html
console.log('\n4. Validating index.html Selected Works section...');
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('id="selected-works"'), 'index.html must have #selected-works section');
assert(indexHtml.includes('id="works-grid"'), 'index.html must have #works-grid container');
assert(indexHtml.includes('id="work-lightbox-modal"'), 'index.html must have #work-lightbox-modal');
console.log('  ✓ Selected works section and lightbox markup intact in index.html');

console.log('\n=================================================');
console.log('  ✓ ALL FRONTEND ARTIFACT VALIDATIONS PASSED!    ');
console.log('=================================================\n');
