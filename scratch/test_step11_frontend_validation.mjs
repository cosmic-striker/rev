/**
 * Step 11 — Frontend DOM & Controller Validation Suite
 * Verifies all required DOM IDs in admin.html and controller tokens in admin.js
 * for the Users & Security Management section.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const html = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf-8');
const js = fs.readFileSync(path.join(rootDir, 'admin.js'), 'utf-8');

let passed = 0;
let failed = 0;

function assertHtml(id, label) {
  const found = html.includes(`id="${id}"`);
  if (found) { console.log(`  ✔ [HTML] #${id}`); passed++; }
  else { console.error(`  ✘ [HTML] MISSING: #${id} — ${label}`); failed++; }
}

function assertJs(token, label) {
  const found = js.includes(token);
  if (found) { console.log(`  ✔ [JS] ${token}`); passed++; }
  else { console.error(`  ✘ [JS] MISSING: ${token} — ${label}`); failed++; }
}

function assertRoute(path) {
  const found = js.includes(`'/admin/users'`);
  if (found) { console.log(`  ✔ [JS] Route '/admin/users' present`); passed++; }
  else { console.error(`  ✘ [JS] Route '/admin/users' NOT found`); failed++; }
}

console.log('\n=======================================================');
console.log('🎬 STEP 11 FRONTEND DOM & CONTROLLER VALIDATION SUITE');
console.log('=======================================================');

// ── TEST 1: Admin.html DOM IDs ────────────────────────────────────────────────
console.log('\n▶ [1/3] Validating admin.html DOM IDs for Users & Security...');

// View & Nav
assertHtml('admin-users-view', 'Users section view panel');
assertHtml('nav-users', 'Users sidebar nav link');
assertHtml('nav-users-dot', 'Users nav active indicator dot');

// Header buttons
assertHtml('btn-open-user-create', 'Create user button');
assertHtml('btn-refresh-users', 'Refresh users button');

// RBAC warning banner
assertHtml('users-rbac-warning', 'RBAC restricted warning banner');

// Tab navigation
assertHtml('users-tabs-nav', 'Users tabs nav container');
assertHtml('tab-btn-users-list', 'Active Accounts tab button');
assertHtml('tab-btn-audit-logs', 'Audit Trail tab button');
assertHtml('users-count-badge', 'Active accounts count badge');

// Accounts table
assertHtml('tab-panel-users-list', 'Active accounts list panel');
assertHtml('users-table-body', 'Users table body for dynamic rows');

// Audit trail
assertHtml('tab-panel-audit-logs', 'Audit logs panel');
assertHtml('audit-action-filter', 'Audit action filter select');
assertHtml('audit-total-count', 'Audit log total count label');
assertHtml('audit-table-body', 'Audit trail table body');

// Create User Modal
assertHtml('user-create-modal', 'Create user modal wrapper');
assertHtml('user-create-form', 'Create user form');
assertHtml('input-user-username', 'Username input');
assertHtml('input-user-fullname', 'Full name input');
assertHtml('input-user-email', 'Email input');
assertHtml('input-user-password', 'Password input');
assertHtml('input-user-role', 'Role select');
assertHtml('user-create-error', 'Create user error box');
assertHtml('user-create-error-msg', 'Create user error message span');

// Edit User Modal
assertHtml('user-edit-modal', 'Edit user modal wrapper');
assertHtml('user-edit-form', 'Edit user form');
assertHtml('edit-user-target-title', 'Edit modal target username title');
assertHtml('edit-user-fullname', 'Edit fullname input');
assertHtml('edit-user-email', 'Edit email input');
assertHtml('edit-user-role', 'Edit role select');
assertHtml('edit-user-active', 'Active status checkbox');
assertHtml('user-edit-error', 'Edit user error box');
assertHtml('user-edit-error-msg', 'Edit user error message span');

// Reset Password Modal
assertHtml('user-password-modal', 'Reset password modal wrapper');
assertHtml('user-password-form', 'Reset password form');
assertHtml('password-user-target-title', 'Password modal target title');
assertHtml('input-new-password', 'New password input');
assertHtml('input-confirm-password', 'Confirm password input');
assertHtml('user-password-error', 'Password error box');
assertHtml('user-password-error-msg', 'Password error message span');

// Delete User Modal
assertHtml('user-delete-modal', 'Delete user modal wrapper');
assertHtml('delete-user-username', 'Delete target username display');
assertHtml('user-delete-error', 'Delete user error box');
assertHtml('user-delete-error-msg', 'Delete error message span');

const htmlCount = passed + failed;
console.log(`\n  → ${passed} DOM IDs verified, ${failed} missing.`);

// ── TEST 2: admin.js Controller Methods & State ───────────────────────────────
console.log('\n▶ [2/3] Validating admin.js controller methods & state...');
const jsBefore = passed;

assertJs('UsersState', 'Centralized users state object');
assertJs('window.loadAdminUsers', 'loadAdminUsers function (window-exposed)');
assertJs('renderUsersTable', 'renderUsersTable render function');
assertJs('renderAuditTable', 'renderAuditTable render function');
assertJs('loadAuditLogs', 'loadAuditLogs async function');
assertJs('window.switchUsersTab', 'switchUsersTab tab switcher');
assertJs('window.handleAuditFilterChange', 'handleAuditFilterChange handler');
assertJs('window.openCreateUserModal', 'openCreateUserModal opener');
assertJs('window.closeCreateUserModal', 'closeCreateUserModal closer');
assertJs('window.handleCreateUserSubmit', 'handleCreateUserSubmit form handler');
assertJs('window.openEditUserModal', 'openEditUserModal opener');
assertJs('window.closeEditUserModal', 'closeEditUserModal closer');
assertJs('window.handleEditUserSubmit', 'handleEditUserSubmit form handler');
assertJs('window.openResetPasswordModal', 'openResetPasswordModal opener');
assertJs('window.closeResetPasswordModal', 'closeResetPasswordModal closer');
assertJs('window.handleResetPasswordSubmit', 'handleResetPasswordSubmit form handler');
assertJs('window.openDeleteUserModal', 'openDeleteUserModal opener');
assertJs('window.closeDeleteUserModal', 'closeDeleteUserModal closer');
assertJs('window.executeDeleteUser', 'executeDeleteUser delete executor');
assertJs(`'/api/admin/users'`, 'Users API endpoint reference');
assertJs('audit-logs', 'Audit logs API endpoint reference (template literal)');

const jsCount = (passed + failed) - htmlCount;
const jsNewPassed = passed - jsBefore;
console.log(`\n  → ${jsNewPassed} controller tokens verified.`);

// ── TEST 3: Route Guard & Navigation Router ───────────────────────────────────
console.log('\n▶ [3/3] Checking route guard & nav router for /admin/users...');

assertRoute('/admin/users');
assertJs(`navigateToAdminSection('users')`, 'users section routing in initRouteGuard');
assertJs(`section === 'users'`, 'users section condition in navigateToAdminSection');
assertJs(`section !== 'users'`, 'users view toggle in navigateToAdminSection');
assertJs(`'USERS & SECURITY // ACCESS CONTROL'`, 'Breadcrumb label for users section');
assertJs('AuthState.user.role === \'admin\'', 'RBAC role guard in nav');

// ── Final Report ──────────────────────────────────────────────────────────────
console.log('\n=======================================================');
if (failed === 0) {
  console.log(`✨ ALL ${passed} FRONTEND DOM & CONTROLLER VALIDATIONS PASSED!`);
} else {
  console.log(`⚠ ${passed} PASSED, ${failed} FAILED`);
}
console.log('=======================================================\n');

if (failed > 0) process.exit(1);
