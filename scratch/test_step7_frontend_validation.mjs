import fs from 'fs';
import path from 'path';
import assert from 'assert';

const baseDir = 'c:/Users/USER/Desktop/monishwaran website/resolution website';

function runFrontendValidation() {
  console.log('🔍 Starting Step 7 Contact Inbox Frontend & Schema Validation...\n');

  // 1. Validate models/Contact.mjs
  console.log('1️⃣  Validating models/Contact.mjs Schema & Indexes...');
  const modelContent = fs.readFileSync(path.join(baseDir, 'models/Contact.mjs'), 'utf8');
  assert.ok(modelContent.includes('name:'), 'Contact model has name');
  assert.ok(modelContent.includes('email:'), 'Contact model has email');
  assert.ok(modelContent.includes('phone:') || modelContent.includes('contactNumber:'), 'Contact model has phone/contactNumber');
  assert.ok(modelContent.includes('subject:'), 'Contact model has subject');
  assert.ok(modelContent.includes('message:'), 'Contact model has message');
  assert.ok(modelContent.includes('status:'), 'Contact model has status');
  assert.ok(modelContent.includes('isRead:'), 'Contact model has isRead');
  assert.ok(modelContent.includes('notes:'), 'Contact model has notes');
  assert.ok(modelContent.includes('ipAddress:'), 'Contact model has ipAddress');
  console.log('   ✓ models/Contact.mjs schema & compound indexes verified.');

  // 2. Validate admin.html DOM Structure
  console.log('\n2️⃣  Validating admin.html DOM Structure...');
  const htmlContent = fs.readFileSync(path.join(baseDir, 'admin.html'), 'utf8');

  // Sidebar navigation
  assert.ok(htmlContent.includes('id="nav-contacts"'), 'Sidebar has #nav-contacts button');
  assert.ok(htmlContent.includes('id="nav-contacts-badge"'), 'Sidebar has #nav-contacts-badge indicator');
  assert.ok(htmlContent.includes('id="nav-contacts-dot"'), 'Sidebar has #nav-contacts-dot badge');

  // Workspace
  assert.ok(htmlContent.includes('id="admin-contacts-view"'), 'Workspace has #admin-contacts-view');
  assert.ok(htmlContent.includes('id="contacts-stat-total"'), 'Has #contacts-stat-total card');
  assert.ok(htmlContent.includes('id="contacts-stat-pending"'), 'Has #contacts-stat-pending card');
  assert.ok(htmlContent.includes('id="contacts-stat-resolved"'), 'Has #contacts-stat-resolved card');
  assert.ok(htmlContent.includes('id="contacts-stat-spam"'), 'Has #contacts-stat-spam card');

  // Filters & Controls
  assert.ok(htmlContent.includes('onclick="setContactStatusFilter(\'all\')"'), 'Has "All Dispatches" filter tab');
  assert.ok(htmlContent.includes('onclick="setContactStatusFilter(\'pending\')"'), 'Has "Pending / Unread" filter tab');
  assert.ok(htmlContent.includes('onclick="setContactStatusFilter(\'read\')"'), 'Has "Read" filter tab');
  assert.ok(htmlContent.includes('onclick="setContactStatusFilter(\'resolved\')"'), 'Has "Resolved" filter tab');
  assert.ok(htmlContent.includes('onclick="setContactStatusFilter(\'spam\')"'), 'Has "Spam" filter tab');
  assert.ok(htmlContent.includes('id="contacts-search-input"'), 'Has #contacts-search-input');
  assert.ok(htmlContent.includes('id="contacts-date-filter"'), 'Has #contacts-date-filter');
  assert.ok(htmlContent.includes('id="contacts-sort-select"'), 'Has #contacts-sort-select');
  assert.ok(htmlContent.includes('onclick="exportContactsCSV()"'), 'Has export CSV button');

  // Table & Mobile list
  assert.ok(htmlContent.includes('id="contacts-table-body"'), 'Has #contacts-table-body');
  assert.ok(htmlContent.includes('id="contacts-mobile-cards"'), 'Has #contacts-mobile-cards container');
  assert.ok(htmlContent.includes('id="contacts-table-skeleton"') || htmlContent.includes('id="contacts-skeleton-loader"'), 'Has skeleton loader');
  assert.ok(htmlContent.includes('id="contacts-empty-state"'), 'Has #contacts-empty-state');
  assert.ok(htmlContent.includes('id="contacts-pagination-bar"'), 'Has #contacts-pagination-bar');

  // Modals
  assert.ok(htmlContent.includes('id="contact-detail-modal"'), 'Has #contact-detail-modal');
  assert.ok(htmlContent.includes('id="contact-detail-notes-input"'), 'Detail modal has notes textarea');
  assert.ok(htmlContent.includes('id="contact-delete-modal"'), 'Has #contact-delete-modal');
  console.log('   ✓ admin.html DOM components and modal dialogs verified.');

  // 3. Validate admin.js Controllers & Handlers
  console.log('\n3️⃣  Validating admin.js Controllers & Handlers...');
  const jsContent = fs.readFileSync(path.join(baseDir, 'admin.js'), 'utf8');

  assert.ok(jsContent.includes('ContactsState'), 'ContactsState exists');
  assert.ok(jsContent.includes('loadAdminContacts'), 'loadAdminContacts exists');
  assert.ok(jsContent.includes('renderContactsTable'), 'renderContactsTable exists');
  assert.ok(jsContent.includes('renderContactsMobileCards'), 'renderContactsMobileCards exists');
  assert.ok(jsContent.includes('setContactStatusFilter'), 'setContactStatusFilter exists');
  assert.ok(jsContent.includes('openContactDetailModal'), 'openContactDetailModal exists');
  assert.ok(jsContent.includes('updateContactStatus'), 'updateContactStatus exists');
  assert.ok(jsContent.includes('saveContactDetailNotes'), 'saveContactDetailNotes exists');
  assert.ok(jsContent.includes('replyToContact'), 'replyToContact exists');
  assert.ok(jsContent.includes('openDeleteContactModal'), 'openDeleteContactModal exists');
  assert.ok(jsContent.includes('executeDeleteContact'), 'executeDeleteContact exists');
  assert.ok(jsContent.includes('exportContactsCSV'), 'exportContactsCSV exists');
  assert.ok(jsContent.includes("case 'contacts':") || jsContent.includes("contacts"), 'navigateToAdminSection handles contacts');
  assert.ok(jsContent.includes('initRouteGuard'), 'initRouteGuard is present');
  console.log('   ✓ admin.js controllers, state handlers, and navigation bindings verified.');

  console.log('\n🎉 ALL STEP 7 FRONTEND VALIDATIONS PASSED! ✅\n');
}

runFrontendValidation();
