import fs from 'fs';
import path from 'path';

function validateFrontend() {
  console.log('🎬 =======================================================');
  console.log('🎬 STEP 10 FRONTEND DOM & CONTROLLER VALIDATION SUITE');
  console.log('🎬 =======================================================\n');

  const adminHtmlPath = path.join(process.cwd(), 'admin.html');
  const adminJsPath = path.join(process.cwd(), 'admin.js');

  const adminHtml = fs.readFileSync(adminHtmlPath, 'utf-8');
  const adminJs = fs.readFileSync(adminJsPath, 'utf-8');

  // Check essential HTML components
  const requiredHtmlIds = [
    'nav-media',
    'nav-media-dot',
    'nav-media-badge',
    'admin-media-view',
    'media-stat-total',
    'media-stat-images',
    'media-stat-videos',
    'media-stat-storage',
    'media-stat-unused',
    'media-search-input',
    'media-search-clear',
    'media-type-filter-group',
    'media-usage-filter-group',
    'media-sort-select',
    'media-view-grid-btn',
    'media-view-list-btn',
    'media-loading-state',
    'media-empty-state',
    'media-error-banner',
    'media-grid-container',
    'media-grid-items',
    'media-list-container',
    'media-table-body',
    'media-pagination-container',
    'media-pagination-prev',
    'media-pagination-next',
    'media-preview-modal',
    'media-preview-img',
    'media-preview-video',
    'media-preview-references-list',
    'media-upload-modal',
    'media-modal-dropzone',
    'media-upload-progress-bar',
    'media-replace-modal',
    'media-replace-notice',
    'btn-confirm-media-replace',
    'media-delete-modal',
    'media-delete-blocked-banner',
    'media-delete-allowed-container',
    'btn-confirm-media-delete',
    'media-metadata-modal',
    'media-meta-form',
    'media-meta-alt',
    'media-meta-caption',
    'media-meta-tags'
  ];

  console.log('▶ [1/3] Validating admin.html DOM IDs for Media Library...');
  for (const id of requiredHtmlIds) {
    if (!adminHtml.includes(`id="${id}"`)) {
      throw new Error(`Missing required DOM ID: "${id}" in admin.html`);
    }
  }
  console.log(`  ✔ All ${requiredHtmlIds.length} required Media Library DOM IDs present in admin.html`);

  // Check essential JS functions & State in admin.js
  const requiredJsTokens = [
    'MediaState',
    'loadAdminMedia',
    'renderMediaGrid',
    'renderMediaList',
    'renderMediaPagination',
    'setMediaTypeFilter',
    'setMediaUsageFilter',
    'handleMediaSearchInput',
    'handleMediaSortChange',
    'setMediaViewMode',
    'openMediaPreview',
    'closeMediaPreviewModal',
    'copyCurrentMediaUrl',
    'openMediaUploadModal',
    'closeMediaUploadModal',
    'executeMediaBatchUpload',
    'openMediaReplaceModal',
    'closeMediaReplaceModal',
    'executeMediaReplace',
    'openMediaDeleteModal',
    'closeMediaDeleteModal',
    'executeMediaDelete',
    'openMediaMetadataModal',
    'closeMediaMetadataModal',
    'handleMediaMetadataSubmit'
  ];

  console.log('▶ [2/3] Validating admin.js Media controller methods & state...');
  for (const token of requiredJsTokens) {
    if (!adminJs.includes(token)) {
      throw new Error(`Missing required JS controller method/token: "${token}" in admin.js`);
    }
  }
  console.log(`  ✔ All ${requiredJsTokens.length} required Media controller tokens verified in admin.js`);

  // Check Routing
  console.log('▶ [3/3] Checking Navigation Router & Route Guard for /admin/media...');
  if (!adminJs.includes("navigateToAdminSection('media')")) {
    throw new Error('Navigation call for media view not found in route handler.');
  }
  if (!adminJs.includes('admin-media-view')) {
    throw new Error('admin-media-view section switch not found in admin.js.');
  }
  console.log('  ✔ Navigation routing and view visibility handling for /admin/media confirmed.');

  console.log('\n=======================================================');
  console.log('✨ ALL FRONTEND DOM & CONTROLLER VALIDATIONS PASSED!');
  console.log('=======================================================');
}

validateFrontend();
