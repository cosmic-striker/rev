/**
 * Resolution: Media Collective Platform - Admin Panel Controller
 * Step 1: Authentication, Route Guards, State Management, Session Expiry & Dashboard Foundation.
 * Step 2: Live Metrics, Core KPI Cards, Needs Attention Panel, Capacity Progress Bars,
 *         Recent Activity Feed, Recent Applications, and Real-time Telemetry.
 */

// 1. Centralized Authentication State
const AuthState = {
  token: localStorage.getItem('res_auth_token') || '',
  user: JSON.parse(localStorage.getItem('res_auth_user') || 'null'),
  isAuthenticated() {
    return Boolean(this.token && this.user);
  },
  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('res_auth_token', token);
    localStorage.setItem('res_auth_user', JSON.stringify(user));
  },
  clearAuth() {
    this.token = '';
    this.user = null;
    localStorage.removeItem('res_auth_token');
    localStorage.removeItem('res_auth_user');
  }
};

// 2. DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  initRouteGuard();
  initPasswordToggle();
  initLoginForm();
  initMobileMenu();
  updateAcademicDate();
  initWorksSearchInput();
  initRsvpsSearchInput();

  window.addEventListener('popstate', () => {
    initRouteGuard();
  });
});

// Helper: Format Current Academic Date
function updateAcademicDate() {
  const dateElem = document.getElementById('current-academic-date');
  if (!dateElem) return;
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElem.textContent = now.toLocaleDateString('en-US', options);
}

// Helper: Dynamic Time-based Greeting
function getGreeting(name = 'Curator Admin') {
  const hour = new Date().getHours();
  let timeStr = 'Good Evening';
  if (hour >= 5 && hour < 12) {
    timeStr = 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    timeStr = 'Good Afternoon';
  }
  return `${timeStr}, ${name}`;
}

// 3. Client-Side Route Guard & Navigation Controller
async function initRouteGuard(forceExpiredMsg = false) {
  const path = window.location.pathname;

  // Check if token exists and verify with backend
  if (AuthState.isAuthenticated()) {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${AuthState.token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          AuthState.user = { ...AuthState.user, ...data.user };
          localStorage.setItem('res_auth_user', JSON.stringify(AuthState.user));
        }

        showDashboardShell();

        if (path === '/admin/works') {
          navigateToAdminSection('works');
        } else if (path === '/admin/events') {
          navigateToAdminSection('events');
        } else if (path === '/admin/rsvps') {
          navigateToAdminSection('rsvps');
        } else if (path === '/admin/team') {
          navigateToAdminSection('team');
        } else if (path === '/admin/contacts') {
          navigateToAdminSection('contacts');
        } else if (path === '/admin/content' || path === '/admin/homepage') {
          navigateToAdminSection('content');
        } else if (path === '/admin/about') {
          navigateToAdminSection('about');
        } else if (path === '/admin/media') {
          navigateToAdminSection('media');
        } else if (path === '/admin/users') {
          navigateToAdminSection('users');
        } else {
          if (path === '/admin/login' || path === '/admin') {
            history.replaceState(null, '', '/admin/dashboard');
          }
          navigateToAdminSection('dashboard');
        }
        return;
      } else {
        // Token invalid or expired
        handleSessionExpired();
        return;
      }
    } catch (err) {
      console.warn('Network issue checking token; continuing with local session:', err);
      showDashboardShell();
      if (path === '/admin/works') {
        navigateToAdminSection('works');
      } else if (path === '/admin/events') {
        navigateToAdminSection('events');
      } else if (path === '/admin/rsvps') {
        navigateToAdminSection('rsvps');
      } else if (path === '/admin/team') {
        navigateToAdminSection('team');
      } else if (path === '/admin/contacts') {
        navigateToAdminSection('contacts');
      } else if (path === '/admin/content' || path === '/admin/homepage') {
        navigateToAdminSection('content');
      } else if (path === '/admin/about') {
        navigateToAdminSection('about');
      } else if (path === '/admin/media') {
        navigateToAdminSection('media');
      } else if (path === '/admin/users') {
        navigateToAdminSection('users');
      } else {
        navigateToAdminSection('dashboard');
      }
      return;
    }
  }

  // If unauthenticated:
  if (path !== '/admin/login') {
    history.replaceState(null, '', '/admin/login');
  }
  showLoginScreen(forceExpiredMsg ? 'Your session has expired. Please sign in again.' : null);
}

// 4. View Transitions
function showLoginScreen(noticeText = null) {
  const loginScreen = document.getElementById('login-screen');
  const appShell = document.getElementById('admin-app-shell');
  if (loginScreen) loginScreen.classList.remove('hidden');
  if (appShell) appShell.classList.add('hidden');

  if (noticeText) {
    showLoginAlert(noticeText, 'warning');
  } else {
    hideLoginAlert();
  }
}

function showDashboardShell() {
  const loginScreen = document.getElementById('login-screen');
  const appShell = document.getElementById('admin-app-shell');
  if (loginScreen) loginScreen.classList.add('hidden');
  if (appShell) appShell.classList.remove('hidden');

  const user = AuthState.user;
  if (user) {
    const userDisplay = document.getElementById('user-display-name');
    const roleBadge = document.getElementById('user-role-badge');
    const headerRole = document.getElementById('header-role-indicator');
    const greetingHeader = document.getElementById('dashboard-greeting');

    const name = user.fullName || user.username || 'Curator Admin';
    const isSuper = user.role === 'admin';

    if (userDisplay) userDisplay.textContent = user.username || 'curator_admin';
    if (roleBadge) {
      roleBadge.textContent = isSuper ? 'SUPER ADMIN' : 'CONTENT EDITOR';
      roleBadge.className = isSuper 
        ? 'text-[9px] text-primary uppercase font-bold tracking-wider block'
        : 'text-[9px] text-yellow-200 uppercase font-bold tracking-wider block';
    }
    if (headerRole) {
      headerRole.textContent = isSuper ? 'SUPER ADMIN' : 'CONTENT EDITOR';
    }
    if (greetingHeader) {
      greetingHeader.textContent = getGreeting(name);
    }
  }
}

// 5. Password Visibility Toggle
function initPasswordToggle() {
  const toggleBtn = document.getElementById('toggle-password-btn');
  const passwordInput = document.getElementById('login-password');
  const icon = document.getElementById('toggle-password-icon');

  if (!toggleBtn || !passwordInput || !icon) return;

  toggleBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    icon.textContent = isPassword ? 'visibility_off' : 'visibility';
  });
}

// 6. Login Form Submission Handler
function initLoginForm() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const submitBtn = document.getElementById('login-submit-btn');
    const spinner = document.getElementById('login-spinner');
    const arrowIcon = document.getElementById('login-arrow-icon');
    const btnText = document.getElementById('login-btn-text');

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showLoginAlert('Please enter both username and password.', 'error');
      return;
    }

    // Set Loading State
    if (submitBtn) submitBtn.disabled = true;
    if (spinner) spinner.classList.remove('hidden');
    if (arrowIcon) arrowIcon.classList.add('hidden');
    if (btnText) btnText.textContent = 'Verifying Credentials...';
    hideLoginAlert();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        // Successful Authentication
        AuthState.setAuth(data.token, data.user);
        showToast(`Welcome back, ${data.user.username}. Authenticated as ${data.user.role.toUpperCase()}.`, 'success');
        
        history.pushState(null, '', '/admin/dashboard');
        showDashboardShell();
        loadDashboardMetrics();
      } else {
        // Invalid Credentials
        const msg = data.message || 'Invalid username or passcode. Please try again.';
        showLoginAlert(msg, 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      showLoginAlert('Network error: Unable to connect to Resolution authentication server.', 'error');
    } finally {
      // Reset Button State
      if (submitBtn) submitBtn.disabled = false;
      if (spinner) spinner.classList.add('hidden');
      if (arrowIcon) arrowIcon.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Authenticate & Enter CMS';
    }
  });
}

// 7. Login Alert Banner UI Helper
function showLoginAlert(message, type = 'error') {
  const alertBox = document.getElementById('login-alert-box');
  const alertText = document.getElementById('login-alert-text');
  const alertIcon = document.getElementById('login-alert-icon');
  if (!alertBox || !alertText) return;

  alertText.textContent = message;
  alertBox.classList.remove('hidden');

  if (type === 'warning') {
    alertBox.className = 'p-3 bg-yellow-950/50 border border-primary/50 text-primary text-xs flex items-center gap-2 transition-all';
    if (alertIcon) {
      alertIcon.textContent = 'warning';
      alertIcon.className = 'material-symbols-outlined text-[18px] text-primary';
    }
  } else {
    alertBox.className = 'p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 transition-all';
    if (alertIcon) {
      alertIcon.textContent = 'error';
      alertIcon.className = 'material-symbols-outlined text-[18px] text-red-400';
    }
  }
}

function hideLoginAlert() {
  const alertBox = document.getElementById('login-alert-box');
  if (alertBox) alertBox.classList.add('hidden');
}

// 8. Logout Handler
window.handleLogout = function() {
  AuthState.clearAuth();
  showToast('You have been logged out securely.', 'info');
  history.pushState(null, '', '/admin/login');
  showLoginScreen();
};

// 9. Session Expiry Handler
function handleSessionExpired() {
  AuthState.clearAuth();
  history.replaceState(null, '', '/admin/login');
  showLoginScreen('Your session has expired. Please sign in again.');
}

// 10. Authenticated API Helper (Attaches JWT & Catches Expiry)
async function apiFetch(url, options = {}) {
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${AuthState.token}`
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      handleSessionExpired();
      throw new Error('Unauthorized');
    }
    return res;
  } catch (err) {
    throw err;
  }
}

// Helper: Format Relative Time
function formatRelativeTime(dateInput) {
  if (!dateInput) return 'Recently';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Recently';
  
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Helper: Format Date String for display
function formatEventDate(dateInput) {
  if (!dateInput) return 'TBA';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
}

// =========================================================================
// 11. STEP 2: Live Metrics, Core KPI Cards, Needs Attention, Recent Activity
// =========================================================================
window.loadDashboardMetrics = async function(isManual = false) {
  const refreshIcon = document.getElementById('refresh-icon');
  const errorBanner = document.getElementById('metrics-error-banner');
  const syncTimeElem = document.getElementById('last-sync-time');

  if (refreshIcon) refreshIcon.classList.add('animate-spin');
  setMetricsSkeletonState(true);
  if (errorBanner) errorBanner.classList.add('hidden');

  try {
    const res = await apiFetch('/api/admin/metrics');
    if (!res.ok) {
      throw new Error(`Metrics API returned status ${res.status}`);
    }

    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.message || 'Invalid metrics data format');
    }

    const data = json.data;
    const summary = data.summary || {};

    updateCoreMetricsUI(summary);
    updateNeedsAttentionUI(data.needsAttention || []);
    updateUpcomingEventsUI(data.upcomingEventsList || []);
    updateRecentActivityUI(data.recentActivity || []);
    updateRecentApplicationsUI(data.recentApplications || []);

    if (syncTimeElem) {
      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      syncTimeElem.textContent = timeStr;
    }

    if (isManual) {
      showToast('Live telemetry synchronized successfully.', 'success');
    }

  } catch (err) {
    console.error('Failed to load dashboard metrics:', err);
    if (errorBanner) errorBanner.classList.remove('hidden');
    if (isManual) {
      showToast('Error syncing telemetry with backend.', 'error');
    }
  } finally {
    setMetricsSkeletonState(false);
    if (refreshIcon) {
      setTimeout(() => refreshIcon.classList.remove('animate-spin'), 300);
    }
  }
};

function setMetricsSkeletonState(isLoading) {
  const skeletons = document.querySelectorAll('.metric-skeleton');
  const values = document.querySelectorAll('.metric-value');

  skeletons.forEach(s => {
    if (isLoading) s.classList.remove('hidden');
    else s.classList.add('hidden');
  });

  values.forEach(v => {
    if (isLoading) v.classList.add('hidden');
    else v.classList.remove('hidden');
  });

  const attentionSkel = document.getElementById('attention-skeleton');
  const eventsSkel = document.getElementById('events-skeleton');
  const actSkel = document.getElementById('activity-skeleton');
  const appSkel = document.getElementById('applications-skeleton');

  if (attentionSkel) attentionSkel.style.display = isLoading ? 'block' : 'none';
  if (eventsSkel) eventsSkel.style.display = isLoading ? 'block' : 'none';
  if (actSkel) actSkel.style.display = isLoading ? 'block' : 'none';
  if (appSkel) appSkel.style.display = isLoading ? 'block' : 'none';
}

function updateCoreMetricsUI(summary) {
  const valWorks = document.getElementById('val-works');
  const valEvents = document.getElementById('val-events');
  const valRsvps = document.getElementById('val-rsvps');
  const valApps = document.getElementById('val-applications');
  const valTeam = document.getElementById('val-team');
  const valEqChecked = document.getElementById('val-equipment-checked');
  const valEqTotal = document.getElementById('val-equipment-total');
  const navContactsBadge = document.getElementById('nav-contacts-badge');

  if (valWorks && summary.totalWorks !== undefined) valWorks.textContent = summary.totalWorks;
  if (valEvents && summary.upcomingEvents !== undefined) valEvents.textContent = summary.upcomingEvents;
  if (valRsvps && summary.totalRsvps !== undefined) valRsvps.textContent = summary.totalRsvps;
  
  if (valApps && summary.pendingApplications !== undefined) {
    valApps.textContent = summary.pendingApplications;
    const cardApps = document.getElementById('card-applications');
    if (cardApps) {
      if (summary.pendingApplications > 0) {
        cardApps.classList.add('border-yellow-500/40');
      } else {
        cardApps.classList.remove('border-yellow-500/40');
      }
    }
  }

  if (valTeam && summary.totalTeamMembers !== undefined) valTeam.textContent = summary.totalTeamMembers;
  if (valEqChecked && summary.equipmentCheckedOut !== undefined) valEqChecked.textContent = summary.equipmentCheckedOut;
  if (valEqTotal && summary.totalEquipment !== undefined) valEqTotal.textContent = summary.totalEquipment;

  // Synchronize dynamic sidebar unread badge
  if (navContactsBadge && summary.pendingContacts !== undefined) {
    if (summary.pendingContacts > 0) {
      navContactsBadge.textContent = summary.pendingContacts;
      navContactsBadge.classList.remove('hidden');
    } else {
      navContactsBadge.classList.add('hidden');
    }
  }
}

function updateNeedsAttentionUI(items) {
  const container = document.getElementById('needs-attention-list');
  const countBadge = document.getElementById('attention-count-badge');
  if (!container) return;

  if (countBadge) {
    if (items.length > 0) {
      countBadge.textContent = `${items.length} PENDING ${items.length === 1 ? 'ITEM' : 'ITEMS'}`;
      countBadge.className = 'text-[10px] font-mono px-2 py-0.5 bg-yellow-950/40 border border-yellow-500/40 text-yellow-400 font-bold';
    } else {
      countBadge.textContent = 'ALL CLEAR';
      countBadge.className = 'text-[10px] font-mono px-2 py-0.5 bg-green-950/40 border border-green-500/40 text-green-400 font-bold';
    }
  }

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="p-4 bg-surface-container/60 border border-green-500/30 flex items-center gap-3">
        <span class="material-symbols-outlined text-[20px] text-green-400">check_circle</span>
        <div class="text-xs">
          <span class="font-bold text-green-300">Everything is up to date.</span>
          <p class="text-outline text-[11px] mt-0.5">No pending member applications or critical capacity alerts require immediate attention.</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    let icon = 'info';
    let borderColor = 'border-surface-high';
    let badgeBg = 'bg-surface-high text-on-surface';

    if (item.priority === 'urgent' || item.priority === 'high') {
      icon = 'priority_high';
      borderColor = 'border-red-500/40 bg-red-950/20';
      badgeBg = 'bg-red-950/60 text-red-300 border border-red-500/40';
    } else if (item.priority === 'medium') {
      icon = 'warning';
      borderColor = 'border-yellow-500/30 bg-yellow-950/10';
      badgeBg = 'bg-yellow-950/40 text-yellow-300 border border-yellow-500/30';
    }

    let clickHandler = '';
    if (item.category === 'contacts' || item.type === 'contact') {
      clickHandler = `onclick="navigateToAdminSection('contacts')"`;
    } else if (item.category === 'events' || item.type === 'event') {
      clickHandler = `onclick="navigateToAdminSection('events')"`;
    } else if (item.category === 'applications' || item.type === 'application') {
      clickHandler = `onclick="showToast('Applications management module active.', 'info')"`;
    }

    return `
      <div class="p-3.5 bg-surface-container border ${borderColor} flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors hover:border-primary/40 cursor-pointer" ${clickHandler}>
        <div class="flex items-start sm:items-center gap-3">
          <div class="w-7 h-7 rounded bg-surface-low border border-surface-high flex items-center justify-center flex-shrink-0 text-primary">
            <span class="material-symbols-outlined text-[16px]">${icon}</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-on-surface">${escapeHTML(item.title)}</span>
              <span class="text-[9px] font-mono px-1.5 py-0.2 ${badgeBg} uppercase">${escapeHTML(item.category || 'ALERT')}</span>
            </div>
            <p class="text-[11px] text-on-surface-variant mt-0.5">${escapeHTML(item.message)}</p>
          </div>
        </div>
        <div class="self-end sm:self-center flex-shrink-0">
          <span class="text-[10px] text-primary font-bold tracking-wider uppercase">${escapeHTML(item.actionLabel || 'REVIEW')} &rarr;</span>
        </div>
      </div>
    `;
  }).join('');
}

function updateUpcomingEventsUI(events) {
  const container = document.getElementById('upcoming-events-container');
  if (!container) return;

  if (!events || events.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-outline text-xs border border-dashed border-surface-high">
        No upcoming scheduled events found. Create an event in Step 3.
      </div>
    `;
    return;
  }

  container.innerHTML = events.map(evt => {
    const percent = evt.capacityPercent || 0;
    const isSoldOut = evt.isSoldOut || percent >= 100;
    const isFillingFast = percent >= 75 && !isSoldOut;

    let barColor = 'bg-primary';
    let badgeText = 'ACTIVE REGISTRATION';
    let badgeClass = 'bg-green-950/40 text-green-300 border-green-500/30';

    if (isSoldOut) {
      barColor = 'bg-red-500';
      badgeText = 'SOLD OUT';
      badgeClass = 'bg-red-950/60 text-red-300 border-red-500/40';
    } else if (isFillingFast) {
      barColor = 'bg-amber-400';
      badgeText = 'FILLING FAST';
      badgeClass = 'bg-yellow-950/50 text-yellow-300 border-yellow-500/40';
    }

    return `
      <div class="p-4 bg-surface-container border border-surface-high/80 hover:border-primary/40 transition-all space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-on-surface hover:text-primary transition-colors cursor-pointer" onclick="openEventPreview('${evt._id || evt.id}')">${escapeHTML(evt.title)}</span>
              <span class="text-[9px] font-mono px-1.5 py-0.5 border ${badgeClass} font-bold">${badgeText}</span>
            </div>
            <div class="flex flex-wrap items-center gap-3 text-[11px] text-outline mt-1">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">calendar_today</span>
                ${escapeHTML(evt.date)} &bull; ${escapeHTML(evt.time || '18:00')}
              </span>
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">location_on</span>
                ${escapeHTML(evt.location || 'Darkroom')}
              </span>
            </div>
          </div>

          <div class="text-right flex-shrink-0">
            <span class="text-xs font-mono font-bold text-on-surface">${evt.rsvpCount}</span>
            <span class="text-xs font-mono text-outline">/ ${evt.capacity} Seats</span>
          </div>
        </div>

        <!-- Progress Bar Container -->
        <div class="space-y-1">
          <div class="w-full bg-surface-lowest h-2 rounded-full overflow-hidden border border-surface-high/60">
            <div class="h-full ${barColor} transition-all duration-700 ease-out" style="width: ${percent}%;"></div>
          </div>
          <div class="flex items-center justify-between text-[10px] text-outline font-mono">
            <span>${percent}% Booked</span>
            <span>${evt.seatsRemaining} seats left</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updateRecentActivityUI(activities) {
  const container = document.getElementById('recent-activity-container');
  if (!container) return;

  if (!activities || activities.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-outline text-xs border border-dashed border-surface-high">
        No recent activity records recorded yet.
      </div>
    `;
    return;
  }

  container.innerHTML = activities.slice(0, 7).map((act) => {
    let icon = 'bolt';
    let iconColor = 'text-primary';

    if (act.type === 'rsvp') {
      icon = 'confirmation_number';
      iconColor = 'text-primary';
    } else if (act.type === 'application') {
      icon = 'how_to_reg';
      iconColor = 'text-yellow-400';
    } else if (act.type === 'contact') {
      icon = 'mail';
      iconColor = 'text-blue-400';
    } else if (act.type === 'work') {
      icon = 'movie';
      iconColor = 'text-emerald-400';
    } else if (act.type === 'equipment') {
      icon = 'photo_camera';
      iconColor = 'text-purple-400';
    }

    const relTime = formatRelativeTime(act.timestamp);

    return `
      <div class="p-3 bg-surface-container border border-surface-high/70 flex items-start gap-3 hover:border-primary/40 transition-colors">
        <div class="w-7 h-7 rounded bg-surface-low border border-surface-high flex items-center justify-center flex-shrink-0 ${iconColor}">
          <span class="material-symbols-outlined text-[15px]">${icon}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold text-on-surface truncate">${escapeHTML(act.title)}</span>
            <span class="text-[10px] font-mono text-outline flex-shrink-0">${relTime}</span>
          </div>
          <p class="text-[11px] text-on-surface-variant truncate mt-0.5">${escapeHTML(act.description)}</p>
        </div>
      </div>
    `;
  }).join('');
}

function updateRecentApplicationsUI(apps) {
  const container = document.getElementById('recent-applications-container');
  const countBadge = document.getElementById('app-count-badge');
  if (!container) return;

  if (countBadge) {
    countBadge.textContent = `${apps.length} SUBMISSIONS`;
  }

  if (!apps || apps.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-outline text-xs border border-dashed border-surface-high">
        No candidate applications recorded yet.
      </div>
    `;
    return;
  }

  container.innerHTML = apps.slice(0, 5).map(app => {
    const isPending = (app.status || 'pending').toLowerCase() === 'pending';
    const statusClass = isPending 
      ? 'bg-yellow-950/40 text-yellow-300 border-yellow-500/40'
      : 'bg-green-950/40 text-green-300 border-green-500/40';

    return `
      <div class="p-3 bg-surface-container border border-surface-high/70 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-full bg-surface-low border border-surface-high flex items-center justify-center flex-shrink-0 text-yellow-400 font-bold text-xs">
            ${escapeHTML(app.fullName ? app.fullName.charAt(0) : 'A')}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-on-surface truncate">${escapeHTML(app.fullName)}</span>
              <span class="text-[9px] font-mono px-1.5 py-0.2 border ${statusClass} uppercase font-bold">${escapeHTML(app.status || 'PENDING')}</span>
            </div>
            <div class="text-[10px] text-outline truncate mt-0.5">
              ${escapeHTML(app.roleApplied || 'Curatorial Apprentice')} &bull; ${escapeHTML(app.email || '')}
            </div>
          </div>
        </div>

        <span class="text-[10px] text-outline font-mono flex-shrink-0">
          ${formatRelativeTime(app.createdAt)}
        </span>
      </div>
    `;
  }).join('');
}

// =========================================================================
// 12. STEP 5: SELECTED WORKS CMS & CONTROLLER
// =========================================================================

// Centralized Works State
const WorksState = {
  items: [],
  total: 0,
  page: 1,
  limit: 25,
  search: '',
  discipline: 'all',
  status: 'all',
  featured: 'all',
  sort: 'order_asc',
  metrics: { all: 0, published: 0, draft: 0, archived: 0, featured: 0, narrative: 0, photo: 0, sound: 0 },
  selectedWork: null,
  dirtyForm: false,
  coverImage: '',
  laurels: [],
  deleteTargetId: null,
  deleteTargetTitle: '',
  deleteTargetCode: '',
  reorderItems: []
};

// 12.1 Section Navigation Switcher (Dashboard vs Works vs Events vs RSVPs vs Team vs Contacts vs Content)
window.navigateToAdminSection = function(section) {
  // Check if navigating away from content with unsaved changes
  const currentPath = window.location.pathname;
  if ((currentPath === '/admin/content' || currentPath === '/admin/homepage') && section !== 'content') {
    if (typeof HomepageContentState !== 'undefined' && HomepageContentState.isDirty) {
      HomepageContentState.pendingNavSection = section;
      const unsavedModal = document.getElementById('content-unsaved-modal');
      if (unsavedModal) {
        unsavedModal.classList.remove('hidden');
        unsavedModal.classList.add('flex');
        return;
      }
    }
  }

  if (currentPath === '/admin/about' && section !== 'about') {
    if (typeof AboutState !== 'undefined' && AboutState.isDirty) {
      AboutState.pendingNavSection = section;
      const unsavedModal = document.getElementById('about-unsaved-modal');
      if (unsavedModal) {
        unsavedModal.classList.remove('hidden');
        unsavedModal.classList.add('flex');
        return;
      }
    }
  }

  const dashView = document.getElementById('admin-dashboard-view');
  const worksView = document.getElementById('admin-works-view');
  const eventsView = document.getElementById('admin-events-view');
  const rsvpsView = document.getElementById('admin-rsvps-view');
  const teamView = document.getElementById('admin-team-view');
  const contactsView = document.getElementById('admin-contacts-view');
  const contentView = document.getElementById('admin-content-view');
  const aboutView = document.getElementById('admin-about-view');
  const mediaView = document.getElementById('admin-media-view');
  const usersView = document.getElementById('admin-users-view');

  const navDash = document.getElementById('nav-dashboard');
  const navWorks = document.getElementById('nav-works');
  const navEvents = document.getElementById('nav-events');
  const navRsvps = document.getElementById('nav-rsvps');
  const navTeam = document.getElementById('nav-team');
  const navContacts = document.getElementById('nav-contacts');
  const navContent = document.getElementById('nav-content');
  const navAbout = document.getElementById('nav-about');
  const navMedia = document.getElementById('nav-media');
  const navUsers = document.getElementById('nav-users');

  const dotDash = document.getElementById('nav-dashboard-dot');
  const dotWorks = document.getElementById('nav-works-dot');
  const dotEvents = document.getElementById('nav-events-dot');
  const dotRsvps = document.getElementById('nav-rsvps-dot');
  const dotTeam = document.getElementById('nav-team-dot');
  const dotContacts = document.getElementById('nav-contacts-dot');
  const dotContent = document.getElementById('nav-content-dot');
  const dotAbout = document.getElementById('nav-about-dot');
  const dotMedia = document.getElementById('nav-media-dot');
  const dotUsers = document.getElementById('nav-users-dot');

  const breadcrumb = document.getElementById('top-breadcrumb-section');

  const activeClass = 'w-full px-3.5 py-2.5 bg-primary text-black font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer rounded-sm';
  const inactiveClass = 'w-full px-3.5 py-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer rounded-sm';

  if (dashView) dashView.classList.toggle('hidden', section !== 'dashboard');
  if (worksView) worksView.classList.toggle('hidden', section !== 'works');
  if (eventsView) eventsView.classList.toggle('hidden', section !== 'events');
  if (rsvpsView) rsvpsView.classList.toggle('hidden', section !== 'rsvps');
  if (teamView) teamView.classList.toggle('hidden', section !== 'team');
  if (contactsView) contactsView.classList.toggle('hidden', section !== 'contacts');
  if (contentView) contentView.classList.toggle('hidden', section !== 'content');
  if (aboutView) aboutView.classList.toggle('hidden', section !== 'about');
  if (mediaView) mediaView.classList.toggle('hidden', section !== 'media');
  if (usersView) usersView.classList.toggle('hidden', section !== 'users');

  // For the users view, switch display to flex when shown
  if (usersView && section === 'users') {
    usersView.style.display = 'flex';
  } else if (usersView) {
    usersView.style.display = '';
  }

  if (navDash) navDash.className = section === 'dashboard' ? activeClass : inactiveClass;
  if (dotDash) dotDash.className = section === 'dashboard' ? 'w-1.5 h-1.5 rounded-full bg-black' : 'w-1.5 h-1.5 rounded-full bg-transparent';

  if (navWorks) navWorks.className = section === 'works' ? activeClass : inactiveClass;
  if (dotWorks) dotWorks.className = section === 'works' ? 'w-1.5 h-1.5 rounded-full bg-black' : 'w-1.5 h-1.5 rounded-full bg-transparent';

  if (navEvents) navEvents.className = section === 'events' ? activeClass : inactiveClass;
  if (dotEvents) dotEvents.className = section === 'events' ? 'w-1.5 h-1.5 rounded-full bg-black' : 'w-1.5 h-1.5 rounded-full bg-transparent';

  if (navRsvps) navRsvps.className = section === 'rsvps' ? activeClass : inactiveClass;
  if (dotRsvps) dotRsvps.className = section === 'rsvps' ? 'w-1.5 h-1.5 rounded-full bg-black' : 'w-1.5 h-1.5 rounded-full bg-transparent';

  if (navTeam) navTeam.className = section === 'team' ? activeClass : inactiveClass;
  if (dotTeam) dotTeam.className = section === 'team' ? 'w-1.5 h-1.5 rounded-full bg-black' : 'w-1.5 h-1.5 rounded-full bg-transparent';

  if (navContacts) navContacts.className = section === 'contacts' ? activeClass : inactiveClass;
  if (dotContacts) dotContacts.className = section === 'contacts' ? 'w-1.5 h-1.5 rounded-full bg-black' : 'w-1.5 h-1.5 rounded-full bg-transparent';

  if (navContent) navContent.className = section === 'content' ? activeClass : inactiveClass;
  if (dotContent) dotContent.className = section === 'content' ? 'w-1.5 h-1.5 rounded-full bg-black' : 'w-1.5 h-1.5 rounded-full bg-transparent';

  if (navAbout) navAbout.className = section === 'about' ? activeClass : inactiveClass;
  if (dotAbout) dotAbout.className = section === 'about' ? 'w-1.5 h-1.5 rounded-full bg-black' : 'w-1.5 h-1.5 rounded-full bg-transparent';

  if (navMedia) navMedia.className = section === 'media' ? activeClass : inactiveClass;
  if (dotMedia) dotMedia.className = section === 'media' ? 'w-1.5 h-1.5 rounded-full bg-black' : 'w-1.5 h-1.5 rounded-full bg-transparent';

  if (navUsers) navUsers.className = section === 'users' ? activeClass : inactiveClass;
  if (dotUsers) dotUsers.className = section === 'users' ? 'w-1.5 h-1.5 rounded-full bg-black' : 'w-1.5 h-1.5 rounded-full bg-transparent';

  // Role guard: hide Users nav link for non-admin roles
  if (navUsers) {
    const isAdmin = AuthState.user && (AuthState.user.role === 'admin' || AuthState.user.role === 'super_admin');
    navUsers.style.display = isAdmin ? '' : 'none';
  }

  if (section === 'works') {
    history.pushState(null, '', '/admin/works');
    if (breadcrumb) breadcrumb.textContent = 'SELECTED WORKS CMS // ARCHIVE';
    loadAdminWorks();
  } else if (section === 'events') {
    history.pushState(null, '', '/admin/events');
    if (breadcrumb) breadcrumb.textContent = 'EVENTS CMS // REGISTRY';
    loadAdminEvents();
  } else if (section === 'rsvps') {
    history.pushState(null, '', '/admin/rsvps');
    if (breadcrumb) breadcrumb.textContent = 'RSVP & ATTENDEE REGISTRY';
    loadRsvpsEventFilter();
    loadAdminRsvps();
  } else if (section === 'team') {
    history.pushState(null, '', '/admin/team');
    if (breadcrumb) breadcrumb.textContent = 'CREW & TEAM CMS // ROSTER';
    loadAdminTeam();
  } else if (section === 'contacts') {
    history.pushState(null, '', '/admin/contacts');
    if (breadcrumb) breadcrumb.textContent = 'CONTACT INBOX // DISPATCHES';
    loadAdminContacts();
  } else if (section === 'content') {
    history.pushState(null, '', '/admin/content');
    if (breadcrumb) breadcrumb.textContent = 'HOMEPAGE CONTENT CMS // ARCHIVE';
    loadAdminHomepageContent();
  } else if (section === 'about') {
    history.pushState(null, '', '/admin/about');
    if (breadcrumb) breadcrumb.textContent = 'ABOUT & MILESTONES CMS // EDITORIAL';
    loadAdminAboutContent();
    loadAdminMilestones();
  } else if (section === 'media') {
    history.pushState(null, '', '/admin/media');
    if (breadcrumb) breadcrumb.textContent = 'CENTRAL MEDIA LIBRARY // REGISTRY';
    loadAdminMedia();
  } else if (section === 'users') {
    history.pushState(null, '', '/admin/users');
    if (breadcrumb) breadcrumb.textContent = 'USERS & SECURITY // ACCESS CONTROL';
    loadAdminUsers();
  } else {
    history.pushState(null, '', '/admin/dashboard');
    if (breadcrumb) breadcrumb.textContent = 'DASHBOARD OVERVIEW';
    loadDashboardMetrics();
  }
};

// 12.2 Load Admin Works from REST API
window.loadAdminWorks = async function(isManual = false) {
  const tableBody = document.getElementById('works-table-body');
  const mobileContainer = document.getElementById('works-mobile-cards');
  const skeleton = document.getElementById('works-loading-skeleton');
  const tableWrapper = document.getElementById('works-table-wrapper');
  const emptyState = document.getElementById('works-empty-state');
  const errorState = document.getElementById('works-error-state');
  const refreshIcon = document.getElementById('works-refresh-icon');

  if (refreshIcon) refreshIcon.classList.add('animate-spin');
  if (skeleton) skeleton.classList.remove('hidden');
  if (tableWrapper) tableWrapper.classList.add('hidden');
  if (mobileContainer) mobileContainer.classList.add('hidden');
  if (emptyState) emptyState.classList.add('hidden');
  if (errorState) errorState.classList.add('hidden');

  try {
    const params = new URLSearchParams({
      page: String(WorksState.page),
      limit: String(WorksState.limit),
      q: WorksState.search || '',
      discipline: WorksState.discipline || 'all',
      status: WorksState.status || 'all',
      featured: WorksState.featured || 'all',
      sortBy: WorksState.sort || 'order_asc'
    });

    const res = await apiFetch(`/api/admin/works?${params.toString()}`);
    if (!res.ok) throw new Error(`Works API error: ${res.status}`);

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      throw new Error(json.message || 'Invalid works data format');
    }

    WorksState.items = json.data;
    WorksState.total = json.total !== undefined ? json.total : json.data.length;
    WorksState.metrics = json.counts || WorksState.metrics;

    // Update Metric Pill Badges
    updateWorksStatusBadges(WorksState.metrics);

    // Update Pagination Bar
    const totalPages = (json.pagination && json.pagination.totalPages) ? json.pagination.totalPages : Math.ceil(WorksState.total / WorksState.limit) || 1;
    updateWorksPaginationUI(WorksState.page, totalPages, WorksState.total);

    // Render Table & Cards
    if (WorksState.items.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (tableWrapper) tableWrapper.classList.remove('hidden');
      if (mobileContainer) mobileContainer.classList.remove('hidden');
      renderWorksTable(WorksState.items);
      renderWorksMobileCards(WorksState.items);
    }

    if (isManual) {
      showToast('Selected Works catalogue synchronized.', 'success');
    }

  } catch (err) {
    console.error('Failed to load admin works:', err);
    if (errorState) {
      errorState.classList.remove('hidden');
      const msg = document.getElementById('works-error-message');
      if (msg) msg.textContent = err.message || 'Error connecting to database.';
    }
    if (isManual) showToast('Failed to load works from server.', 'error');
  } finally {
    if (skeleton) skeleton.classList.add('hidden');
    if (refreshIcon) {
      setTimeout(() => refreshIcon.classList.remove('animate-spin'), 300);
    }
  }
};

// 12.3 Render Works Table (Desktop / Tablet)
function renderWorksTable(works) {
  const tbody = document.getElementById('works-table-body');
  if (!tbody) return;

  const isSuperAdmin = AuthState.user && AuthState.user.role === 'admin';

  tbody.innerHTML = works.map((w, idx) => {
    const id = w._id || w.workCode || w.slug;
    const coverUrl = w.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80';
    const isArchived = Boolean(w.isArchived || w.status === 'archived');
    const isDraft = w.status === 'draft';
    const isFeatured = Boolean(w.isFeatured);

    // Discipline Tag Badge
    let discPillClass = 'bg-surface-container text-primary border-primary/30';
    if (w.discipline === 'photo') discPillClass = 'bg-surface-container text-blue-300 border-blue-400/30';
    else if (w.discipline === 'sound') discPillClass = 'bg-surface-container text-amber-300 border-amber-400/30';

    // Status Badge
    let statusClass = 'bg-green-950/40 text-green-300 border-green-500/40';
    let statusLabel = 'PUBLISHED';
    if (isArchived) {
      statusClass = 'bg-surface-container text-outline border-surface-high';
      statusLabel = 'ARCHIVED';
    } else if (isDraft) {
      statusClass = 'bg-yellow-950/40 text-yellow-300 border-yellow-500/40';
      statusLabel = 'DRAFT';
    }

    return `
      <tr class="hover:bg-surface-container/60 transition-colors group">
        <!-- Order Number -->
        <td class="py-3 px-4 text-center font-mono font-bold text-outline group-hover:text-primary">
          ${w.order !== undefined ? w.order : idx + 1}
        </td>

        <!-- Cover Thumbnail -->
        <td class="py-3 px-4">
          <div class="w-16 h-10 rounded bg-surface-lowest border border-surface-high overflow-hidden relative cursor-pointer group-hover:border-primary/40 transition-colors" onclick="openWorkPreviewModal('${id}')" title="Click to Preview">
            <img 
              alt="${w.title}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              loading="lazy" 
              src="${coverUrl}"
              onerror="this.src='https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80'"
            />
          </div>
        </td>

        <!-- Title, WorkCode, Slug -->
        <td class="py-3 px-4">
          <div class="space-y-0.5">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-bold text-sm text-on-surface group-hover:text-primary transition-colors cursor-pointer" onclick="openEditWorkModal('${id}')">
                ${w.title}
              </span>
              ${isFeatured ? `<span class="px-1.5 py-0.2 bg-primary/10 border border-primary/40 text-primary text-[9px] font-bold uppercase rounded">FEATURED</span>` : ''}
            </div>
            <div class="flex items-center gap-2 text-[10px] text-outline font-mono">
              <span class="text-primary font-bold">${w.workCode || '—'}</span>
              <span>&bull;</span>
              <span class="truncate max-w-[140px]">${w.slug || '—'}</span>
            </div>
            <div class="text-[11px] text-on-surface-variant truncate max-w-xs pt-0.5">
              ${w.crew || '—'}
            </div>
          </div>
        </td>

        <!-- Discipline -->
        <td class="py-3 px-4">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${discPillClass}">
            <span class="material-symbols-outlined text-[12px]">${w.discipline === 'photo' ? 'camera' : (w.discipline === 'sound' ? 'volume_up' : 'movie')}</span>
            <span>${w.disciplineLabel || (w.discipline === 'photo' ? '35mm Photo' : (w.discipline === 'sound' ? 'Soundscapes' : 'Narrative Cinema'))}</span>
          </span>
        </td>

        <!-- Technical Specs (Format & Camera) -->
        <td class="py-3 px-4">
          <div class="space-y-0.5">
            <span class="text-[11px] text-on-surface font-mono block">${w.format || '—'}</span>
            <span class="text-[10px] text-outline truncate max-w-[180px] block">${w.camera || '—'}</span>
            ${w.laurels && w.laurels.length > 0 ? `<div class="text-[9px] text-primary flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">military_tech</span><span>${w.laurels.length} Laurel(s)</span></div>` : ''}
          </div>
        </td>

        <!-- Grid Span & Order -->
        <td class="py-3 px-4 text-center">
          <div class="space-y-0.5">
            <span class="px-2 py-0.5 bg-surface-container border border-surface-high text-[10px] font-mono text-outline uppercase block">
              ${w.gridSpan || 'col-span-8'}
            </span>
            <span class="text-[9px] text-outline font-mono block">Order #${w.order !== undefined ? w.order : idx + 1}</span>
          </div>
        </td>

        <!-- Status Pill -->
        <td class="py-3 px-4 text-center">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${statusClass}">
            ${statusLabel}
          </span>
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1">
            <!-- Preview -->
            <button 
              class="p-1.5 bg-surface-container hover:bg-surface-high hover:text-primary text-on-surface border border-surface-high transition-colors rounded cursor-pointer" 
              onclick="openWorkPreviewModal('${id}')" 
              title="Preview Public Card &amp; Lightbox" 
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">visibility</span>
            </button>

            <!-- Edit -->
            <button 
              class="p-1.5 bg-surface-container hover:bg-surface-high hover:text-primary text-on-surface border border-surface-high transition-colors rounded cursor-pointer" 
              onclick="openEditWorkModal('${id}')" 
              title="Edit Work Plate" 
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>

            <!-- Archive / Restore Toggle -->
            <button 
              class="p-1.5 bg-surface-container hover:bg-surface-high hover:text-yellow-400 text-on-surface border border-surface-high transition-colors rounded cursor-pointer" 
              onclick="toggleArchiveWork('${id}')" 
              title="${isArchived ? 'Restore to Published Portfolio' : 'Archive from Public Gallery'}" 
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">${isArchived ? 'unarchive' : 'archive'}</span>
            </button>

            <!-- Destructive Permanent Delete (Super Admin Only) -->
            ${isSuperAdmin ? `
              <button 
                class="p-1.5 bg-surface-container hover:bg-red-950/60 hover:text-red-400 hover:border-red-500/40 text-on-surface border border-surface-high transition-colors rounded cursor-pointer" 
                onclick="openDeleteWorkModal('${id}')" 
                title="Permanently Delete Work" 
                type="button"
              >
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            ` : `
              <button 
                class="p-1.5 bg-surface-container/30 text-outline/40 border border-surface-high/30 cursor-not-allowed rounded" 
                title="Permanent delete requires Super Admin role" 
                disabled 
                type="button"
              >
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 12.4 Render Works Mobile Cards
function renderWorksMobileCards(works) {
  const container = document.getElementById('works-mobile-cards');
  if (!container) return;

  const isSuperAdmin = AuthState.user && AuthState.user.role === 'admin';

  container.innerHTML = works.map((w, idx) => {
    const id = w._id || w.workCode || w.slug;
    const coverUrl = w.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80';
    const isArchived = Boolean(w.isArchived || w.status === 'archived');
    const isDraft = w.status === 'draft';

    let statusClass = 'bg-green-950/40 text-green-300 border-green-500/40';
    let statusLabel = 'PUBLISHED';
    if (isArchived) {
      statusClass = 'bg-surface-container text-outline border-surface-high';
      statusLabel = 'ARCHIVED';
    } else if (isDraft) {
      statusClass = 'bg-yellow-950/40 text-yellow-300 border-yellow-500/40';
      statusLabel = 'DRAFT';
    }

    return `
      <div class="p-4 bg-surface-low border border-surface-high space-y-3">
        <div class="flex items-start gap-3">
          <div class="w-20 h-14 rounded bg-surface-lowest border border-surface-high overflow-hidden shrink-0" onclick="openWorkPreviewModal('${id}')">
            <img alt="${w.title}" class="w-full h-full object-cover" src="${coverUrl}" onerror="this.src='https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80'" />
          </div>
          <div class="flex-1 min-w-0 space-y-1">
            <div class="flex items-center justify-between gap-1">
              <span class="font-bold text-sm text-on-surface truncate">${w.title}</span>
              <span class="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${statusClass}">${statusLabel}</span>
            </div>
            <div class="flex items-center gap-2 text-[10px] text-outline font-mono">
              <span class="text-primary font-bold">${w.workCode || '—'}</span>
              <span>&bull;</span>
              <span>Order #${w.order !== undefined ? w.order : idx + 1}</span>
            </div>
            <span class="text-[10px] text-primary uppercase font-bold block">${w.disciplineLabel || w.discipline}</span>
          </div>
        </div>

        <div class="text-[11px] text-outline font-mono border-t border-surface-high/60 pt-2 space-y-0.5">
          <div><span class="text-on-surface-variant">Format:</span> ${w.format || '—'}</div>
          <div><span class="text-on-surface-variant">Camera:</span> ${w.camera || '—'}</div>
        </div>

        <div class="flex items-center justify-between gap-2 pt-2 border-t border-surface-high/60">
          <button class="px-3 py-1.5 bg-surface-container hover:bg-surface-high text-xs text-on-surface font-bold uppercase flex items-center gap-1 border border-surface-high cursor-pointer" onclick="openWorkPreviewModal('${id}')" type="button">
            <span class="material-symbols-outlined text-[14px] text-primary">visibility</span>
            <span>Preview</span>
          </button>
          
          <div class="flex items-center gap-1.5">
            <button class="px-3 py-1.5 bg-surface-container hover:bg-surface-high text-xs text-on-surface font-bold uppercase flex items-center gap-1 border border-surface-high cursor-pointer" onclick="openEditWorkModal('${id}')" type="button">
              <span class="material-symbols-outlined text-[14px]">edit</span>
              <span>Edit</span>
            </button>
            <button class="p-1.5 bg-surface-container hover:bg-surface-high text-on-surface border border-surface-high rounded cursor-pointer" onclick="toggleArchiveWork('${id}')" title="Archive / Restore" type="button">
              <span class="material-symbols-outlined text-[16px]">${isArchived ? 'unarchive' : 'archive'}</span>
            </button>
            ${isSuperAdmin ? `
              <button class="p-1.5 bg-surface-container hover:bg-red-950 text-red-400 border border-surface-high rounded cursor-pointer" onclick="openDeleteWorkModal('${id}')" title="Delete" type="button">
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 12.5 Update Works Metric Badges
function updateWorksStatusBadges(counts) {
  if (!counts) return;
  const countAll = document.getElementById('works-count-all');
  const countPublished = document.getElementById('works-count-published');
  const countDraft = document.getElementById('works-count-draft');
  const countArchived = document.getElementById('works-count-archived');
  const countFeatured = document.getElementById('works-count-featured');
  const tableBadge = document.getElementById('works-table-total-badge');

  if (countAll) countAll.textContent = counts.all || 0;
  if (countPublished) countPublished.textContent = counts.published || 0;
  if (countDraft) countDraft.textContent = counts.draft || 0;
  if (countArchived) countArchived.textContent = counts.archived || 0;
  if (countFeatured) countFeatured.textContent = counts.featured || 0;
  if (tableBadge) tableBadge.textContent = `${WorksState.total} PLATES`;
}

// 12.6 Pagination UI Update
function updateWorksPaginationUI(currentPage, totalPages, totalItems) {
  const info = document.getElementById('works-pagination-info');
  const pageNum = document.getElementById('works-current-page');
  const prevBtn = document.getElementById('works-prev-page-btn');
  const nextBtn = document.getElementById('works-next-page-btn');

  if (pageNum) pageNum.textContent = String(currentPage);
  if (info) {
    const start = totalItems === 0 ? 0 : (currentPage - 1) * WorksState.limit + 1;
    const end = Math.min(currentPage * WorksState.limit, totalItems);
    info.textContent = `Showing ${start} to ${end} of ${totalItems} plates (Page ${currentPage} of ${totalPages})`;
  }

  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

window.prevWorksPage = function() {
  if (WorksState.page > 1) {
    WorksState.page--;
    loadAdminWorks();
  }
};

window.nextWorksPage = function() {
  const maxPages = Math.ceil(WorksState.total / WorksState.limit) || 1;
  if (WorksState.page < maxPages) {
    WorksState.page++;
    loadAdminWorks();
  }
};

// 12.7 Filter & Search Handlers
window.setWorksStatusFilter = function(status) {
  WorksState.status = status;
  WorksState.page = 1;
  const statusSelect = document.getElementById('works-status-select');
  if (statusSelect) statusSelect.value = status;
  loadAdminWorks();
};

window.handleWorksFilterChange = function() {
  const discSelect = document.getElementById('works-discipline-filter');
  const statusSelect = document.getElementById('works-status-select');
  const featSelect = document.getElementById('works-featured-select');
  const sortSelect = document.getElementById('works-sort-select');

  if (discSelect) WorksState.discipline = discSelect.value;
  if (statusSelect) WorksState.status = statusSelect.value;
  if (featSelect) WorksState.featured = featSelect.value;
  if (sortSelect) WorksState.sort = sortSelect.value;

  WorksState.page = 1;
  loadAdminWorks();
};

let worksSearchDebounce = null;
function initWorksSearchInput() {
  const searchInput = document.getElementById('works-search-input');
  const searchClear = document.getElementById('works-search-clear');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (searchClear) searchClear.classList.toggle('hidden', val.length === 0);

    clearTimeout(worksSearchDebounce);
    worksSearchDebounce = setTimeout(() => {
      WorksState.search = val;
      WorksState.page = 1;
      loadAdminWorks();
    }, 280);
  });
}

window.clearWorksSearch = function() {
  const searchInput = document.getElementById('works-search-input');
  const searchClear = document.getElementById('works-search-clear');
  if (searchInput) searchInput.value = '';
  if (searchClear) searchClear.classList.add('hidden');
  WorksState.search = '';
  WorksState.page = 1;
  loadAdminWorks();
};

// 12.8 Work Create & Edit Modal Operations
window.openCreateWorkModal = function() {
  WorksState.selectedWork = null;
  WorksState.dirtyForm = false;
  WorksState.laurels = [];
  WorksState.coverImage = '';

  const modal = document.getElementById('work-form-modal');
  const form = document.getElementById('work-form');
  const modalTitle = document.getElementById('work-modal-title');
  const modalIcon = document.getElementById('work-modal-icon');
  const idInput = document.getElementById('work-form-id');

  if (form) form.reset();
  if (idInput) idInput.value = '';
  if (modalTitle) modalTitle.textContent = 'Add Creative Work';
  if (modalIcon) modalIcon.textContent = 'add_circle';

  // Set default code
  const nextCodeNum = String(WorksState.total + 1).padStart(2, '0');
  const codeInput = document.getElementById('work-code-input');
  if (codeInput) codeInput.value = `#RES-2026-${nextCodeNum}`;

  // Set default order
  const orderInput = document.getElementById('work-order-input');
  if (orderInput) orderInput.value = String(WorksState.total + 1);

  // Set default discipline label
  const labelInput = document.getElementById('work-disciplinelabel-input');
  if (labelInput) labelInput.value = 'Narrative Cinema';

  clearWorkImagePreview();
  renderLaurelTags();

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  // Bind dirty tracking
  bindWorkFormDirtyTracking();
};

window.openEditWorkModal = async function(id) {
  WorksState.dirtyForm = false;
  let work = WorksState.items.find(w => w._id === id || w.workCode === id || w.slug === id);

  if (!work) {
    try {
      const res = await apiFetch(`/api/admin/works/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) work = json.data;
      }
    } catch (e) {
      console.warn('Failed to fetch work detail:', e);
    }
  }

  if (!work) {
    showToast('Work record not found.', 'error');
    return;
  }

  WorksState.selectedWork = work;
  WorksState.coverImage = work.image || '';
  WorksState.laurels = Array.isArray(work.laurels) ? [...work.laurels] : [];

  const modal = document.getElementById('work-form-modal');
  const modalTitle = document.getElementById('work-modal-title');
  const modalIcon = document.getElementById('work-modal-icon');
  const idInput = document.getElementById('work-form-id');

  if (modalTitle) modalTitle.textContent = 'Edit Work Plate';
  if (modalIcon) modalIcon.textContent = 'edit';
  if (idInput) idInput.value = work._id || work.workCode || id;

  // Populate Fields
  const titleInput = document.getElementById('work-title-input');
  const discSelect = document.getElementById('work-discipline-select');
  const labelInput = document.getElementById('work-disciplinelabel-input');
  const codeInput = document.getElementById('work-code-input');
  const slugInput = document.getElementById('work-slug-input');
  const synopsisInput = document.getElementById('work-synopsis-input');
  const formatInput = document.getElementById('work-format-input');
  const cameraInput = document.getElementById('work-camera-input');
  const aspectSelect = document.getElementById('work-aspectratio-select');
  const spanSelect = document.getElementById('work-gridspan-select');
  const crewInput = document.getElementById('work-crew-input');
  const orderInput = document.getElementById('work-order-input');
  const statusSelect = document.getElementById('work-status-select-modal');
  const featCheckbox = document.getElementById('work-featured-checkbox');
  const urlInput = document.getElementById('work-image-url-input');

  if (titleInput) titleInput.value = work.title || '';
  if (discSelect) discSelect.value = work.discipline || 'narrative';
  if (labelInput) labelInput.value = work.disciplineLabel || '';
  if (codeInput) codeInput.value = work.workCode || '';
  if (slugInput) slugInput.value = work.slug || '';
  if (synopsisInput) synopsisInput.value = work.synopsis || '';
  if (formatInput) formatInput.value = wFormat(work);
  if (cameraInput) cameraInput.value = work.camera || '';
  if (aspectSelect) aspectSelect.value = work.aspectRatio || '16:9';
  if (spanSelect) spanSelect.value = work.gridSpan || 'col-span-8';
  if (crewInput) crewInput.value = work.crew || '';
  if (orderInput) orderInput.value = work.order !== undefined ? String(work.order) : '1';
  if (statusSelect) statusSelect.value = work.status || (work.isArchived ? 'archived' : 'published');
  if (featCheckbox) featCheckbox.checked = Boolean(work.isFeatured);
  if (urlInput) urlInput.value = work.image || '';

  // Set Cover Image Preview
  if (work.image) {
    setWorkImagePreview(work.image);
  } else {
    clearWorkImagePreview();
  }

  renderLaurelTags();

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  bindWorkFormDirtyTracking();
};

function wFormat(work) {
  return work.format || '';
}

function bindWorkFormDirtyTracking() {
  const form = document.getElementById('work-form');
  if (!form) return;
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(el => {
    el.addEventListener('input', () => { WorksState.dirtyForm = true; }, { once: true });
    el.addEventListener('change', () => { WorksState.dirtyForm = true; }, { once: true });
  });
}

window.handleCloseWorkForm = function() {
  if (WorksState.dirtyForm) {
    const unsavedModal = document.getElementById('work-unsaved-modal');
    if (unsavedModal) {
      unsavedModal.classList.remove('hidden');
      unsavedModal.classList.add('flex');
    }
  } else {
    closeWorkFormModal();
  }
};

window.closeWorkUnsavedModal = function() {
  const unsavedModal = document.getElementById('work-unsaved-modal');
  if (unsavedModal) {
    unsavedModal.classList.add('hidden');
    unsavedModal.classList.remove('flex');
  }
};

window.confirmDiscardWorkChanges = function() {
  closeWorkUnsavedModal();
  closeWorkFormModal();
};

function closeWorkFormModal() {
  const modal = document.getElementById('work-form-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
  WorksState.dirtyForm = false;
}

window.handleWorkTitleInput = function(val) {
  const slugInput = document.getElementById('work-slug-input');
  if (!WorksState.selectedWork && slugInput) {
    slugInput.value = val.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
};

window.handleWorkDisciplineChange = function(val) {
  const labelInput = document.getElementById('work-disciplinelabel-input');
  if (labelInput && (!labelInput.value || !WorksState.selectedWork)) {
    if (val === 'narrative') labelInput.value = 'Narrative Cinema';
    else if (val === 'photo') labelInput.value = '35mm Photo / Exhibition Still';
    else if (val === 'sound') labelInput.value = 'Soundscapes & Documentary Still';
  }
};

// 12.9 Work Cover Image Upload & Preview Handling
window.handleWorkFileInputChange = async function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  // File size check: 5MB
  if (file.size > 5 * 1024 * 1024) {
    showToast('File rejected: Maximum permitted image size is 5MB.', 'error');
    event.target.value = '';
    return;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.mimetype || file.type)) {
    showToast('File rejected: Invalid MIME type. Permitted formats: JPEG, PNG, WebP, AVIF, GIF, SVG.', 'error');
    event.target.value = '';
    return;
  }

  const spinner = document.getElementById('work-image-uploading');
  if (spinner) {
    spinner.classList.remove('hidden');
    spinner.classList.add('flex');
  }

  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await apiFetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (res.ok && data.success && data.fileUrl) {
      WorksState.coverImage = data.fileUrl;
      WorksState.dirtyForm = true;
      setWorkImagePreview(data.fileUrl);
      const urlInput = document.getElementById('work-image-url-input');
      if (urlInput) urlInput.value = data.fileUrl;
      showToast('Image uploaded and verified successfully.', 'success');
    } else {
      throw new Error(data.message || 'Image upload failed');
    }
  } catch (err) {
    console.error('Work image upload error:', err);
    showToast(err.message || 'Image upload failed. Please try again.', 'error');
  } finally {
    if (spinner) {
      spinner.classList.add('hidden');
      spinner.classList.remove('flex');
    }
    event.target.value = '';
  }
};

window.handleWorkUrlDirectInput = function(val) {
  WorksState.dirtyForm = true;
  if (val && val.trim().length > 4) {
    setWorkImagePreview(val.trim());
  } else {
    clearWorkImagePreview();
  }
};

function setWorkImagePreview(url) {
  WorksState.coverImage = url;
  const previewImg = document.getElementById('work-cover-img-preview');
  const placeholder = document.getElementById('work-image-placeholder');
  const hoverActions = document.getElementById('work-image-hover-actions');

  if (previewImg) {
    previewImg.src = url;
    previewImg.classList.remove('hidden');
  }
  if (placeholder) placeholder.classList.add('hidden');
  if (hoverActions) hoverActions.classList.remove('hidden');
}

window.clearWorkImagePreview = function() {
  WorksState.coverImage = '';
  WorksState.dirtyForm = true;
  const previewImg = document.getElementById('work-cover-img-preview');
  const placeholder = document.getElementById('work-image-placeholder');
  const hoverActions = document.getElementById('work-image-hover-actions');
  const urlInput = document.getElementById('work-image-url-input');

  if (previewImg) {
    previewImg.src = '';
    previewImg.classList.add('hidden');
  }
  if (placeholder) placeholder.classList.remove('hidden');
  if (hoverActions) hoverActions.classList.add('hidden');
  if (urlInput) urlInput.value = '';
};

// 12.10 Festival Laurels Manager
window.addLaurelTag = function() {
  const input = document.getElementById('work-laurel-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  if (!WorksState.laurels.includes(val)) {
    WorksState.laurels.push(val);
    WorksState.dirtyForm = true;
    renderLaurelTags();
  }
  input.value = '';
  input.focus();
};

window.removeLaurelTag = function(idx) {
  WorksState.laurels.splice(idx, 1);
  WorksState.dirtyForm = true;
  renderLaurelTags();
};

function renderLaurelTags() {
  const container = document.getElementById('work-laurels-container');
  if (!container) return;

  if (WorksState.laurels.length === 0) {
    container.innerHTML = `<span class="text-[10px] text-outline italic">No festival laurels added yet.</span>`;
    return;
  }

  container.innerHTML = WorksState.laurels.map((laurel, idx) => `
    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-lowest border border-primary/30 text-primary text-[10px] font-mono rounded">
      <span class="material-symbols-outlined text-[12px]">stars</span>
      <span>${laurel}</span>
      <button class="text-outline hover:text-red-400 ml-1 transition-colors cursor-pointer" onclick="removeLaurelTag(${idx})" title="Remove Laurel" type="button">
        <span class="material-symbols-outlined text-[12px]">close</span>
      </button>
    </span>
  `).join('');
}

// 12.11 Work Form Submission
window.handleWorkFormSubmit = async function(event) {
  event.preventDefault();

  const idInput = document.getElementById('work-form-id');
  const titleInput = document.getElementById('work-title-input');
  const discSelect = document.getElementById('work-discipline-select');
  const labelInput = document.getElementById('work-disciplinelabel-input');
  const codeInput = document.getElementById('work-code-input');
  const slugInput = document.getElementById('work-slug-input');
  const synopsisInput = document.getElementById('work-synopsis-input');
  const formatInput = document.getElementById('work-format-input');
  const cameraInput = document.getElementById('work-camera-input');
  const aspectSelect = document.getElementById('work-aspectratio-select');
  const spanSelect = document.getElementById('work-gridspan-select');
  const crewInput = document.getElementById('work-crew-input');
  const orderInput = document.getElementById('work-order-input');
  const statusSelect = document.getElementById('work-status-select-modal');
  const featCheckbox = document.getElementById('work-featured-checkbox');
  const urlInput = document.getElementById('work-image-url-input');

  const id = idInput ? idInput.value : '';
  const title = titleInput ? titleInput.value.trim() : '';
  const discipline = discSelect ? discSelect.value : 'narrative';
  const disciplineLabel = labelInput ? labelInput.value.trim() : 'Narrative Cinema';
  const workCode = codeInput ? codeInput.value.trim() : '';
  const slug = slugInput ? slugInput.value.trim() : '';
  const synopsis = synopsisInput ? synopsisInput.value.trim() : '';
  const format = formatInput ? formatInput.value.trim() : '';
  const camera = cameraInput ? cameraInput.value.trim() : '';
  const aspectRatio = aspectSelect ? aspectSelect.value : '16:9';
  const gridSpan = spanSelect ? spanSelect.value : 'col-span-8';
  const crew = crewInput ? crewInput.value.trim() : '';
  const order = orderInput ? parseInt(orderInput.value) || 0 : 0;
  const status = statusSelect ? statusSelect.value : 'published';
  const isFeatured = featCheckbox ? featCheckbox.checked : false;
  const image = (urlInput && urlInput.value.trim()) || WorksState.coverImage;

  if (!title) {
    showToast('Work title is required.', 'error');
    return;
  }
  if (!format) {
    showToast('Technical format specification is required.', 'error');
    return;
  }
  if (!camera) {
    showToast('Camera and optics specification is required.', 'error');
    return;
  }
  if (!synopsis) {
    showToast('Curatorial synopsis is required.', 'error');
    return;
  }
  if (!crew) {
    showToast('Crew credits are required.', 'error');
    return;
  }
  if (!image) {
    showToast('Cover image asset is required (Max 5MB).', 'error');
    return;
  }

  const payload = {
    title,
    discipline,
    disciplineLabel,
    workCode,
    slug,
    synopsis,
    format,
    camera,
    aspectRatio,
    gridSpan,
    crew,
    order,
    status,
    isArchived: status === 'archived',
    isFeatured,
    image,
    laurels: WorksState.laurels
  };

  const submitBtn = document.getElementById('work-form-submit-btn');
  const spinner = document.getElementById('work-form-spinner');
  const btnText = document.getElementById('work-form-submit-text');
  const icon = document.getElementById('work-form-submit-icon');

  if (submitBtn) submitBtn.disabled = true;
  if (spinner) spinner.classList.remove('hidden');
  if (icon) icon.classList.add('hidden');
  if (btnText) btnText.textContent = id ? 'Updating Plate...' : 'Cataloging Work...';

  try {
    const isEdit = Boolean(id);
    const endpoint = isEdit ? `/api/admin/works/${id}` : '/api/admin/works';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await apiFetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to save creative work.');
    }

    showToast(data.message || (isEdit ? 'Work plate updated successfully.' : 'Work plate cataloged successfully.'), 'success');
    closeWorkFormModal();
    loadAdminWorks();
    if (typeof loadDashboardMetrics === 'function') loadDashboardMetrics();

  } catch (err) {
    console.error('Work save error:', err);
    showToast(err.message || 'An error occurred while saving the work.', 'error');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    if (spinner) spinner.classList.add('hidden');
    if (icon) icon.classList.remove('hidden');
    if (btnText) btnText.textContent = 'Save Work Plate';
  }
};

// 12.12 Toggle Archive Work
window.toggleArchiveWork = async function(id) {
  try {
    const res = await apiFetch(`/api/admin/works/${id}/archive`, {
      method: 'PATCH'
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update work archive status.');
    }

    showToast(data.message || 'Work archive status updated.', 'success');
    loadAdminWorks();
    if (typeof loadDashboardMetrics === 'function') loadDashboardMetrics();
  } catch (err) {
    console.error('Archive toggle error:', err);
    showToast(err.message || 'Failed to update archive status.', 'error');
  }
};

// 12.13 Live Presentation Preview Modal
window.openWorkPreviewModal = async function(id) {
  let work = WorksState.items.find(w => w._id === id || w.workCode === id || w.slug === id);

  if (!work) {
    try {
      const res = await apiFetch(`/api/admin/works/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) work = json.data;
      }
    } catch (e) {
      console.warn('Failed to fetch preview data:', e);
    }
  }

  if (!work) {
    showToast('Work record not found for preview.', 'error');
    return;
  }

  const modal = document.getElementById('work-preview-modal');
  const cardImg = document.getElementById('preview-card-image');
  const cardFormat = document.getElementById('preview-card-format');
  const cardDisc = document.getElementById('preview-card-discipline');
  const cardTitle = document.getElementById('preview-card-title');
  const cardCrew = document.getElementById('preview-card-crew');

  const lbCode = document.getElementById('preview-lb-code');
  const lbCamera = document.getElementById('preview-lb-camera');
  const lbSynopsis = document.getElementById('preview-lb-synopsis');
  const lbLaurelsList = document.getElementById('preview-lb-laurels-list');
  const lbLaurelsSection = document.getElementById('preview-lb-laurels-section');

  const coverUrl = work.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80';

  if (cardImg) cardImg.style.backgroundImage = `url('${coverUrl}')`;
  if (cardFormat) cardFormat.textContent = (work.format || '4K DCI MASTER').toUpperCase();
  if (cardDisc) cardDisc.textContent = `${work.workCode || '#RES-2026'} • ${(work.disciplineLabel || work.discipline || 'NARRATIVE CINEMA').toUpperCase()}`;
  if (cardTitle) cardTitle.textContent = work.title || 'Untitled Work';
  if (cardCrew) cardCrew.textContent = work.crew || '—';

  if (lbCode) lbCode.textContent = work.workCode || '—';
  if (lbCamera) lbCamera.textContent = work.camera || '—';
  if (lbSynopsis) lbSynopsis.textContent = work.synopsis || '—';

  if (lbLaurelsList && lbLaurelsSection) {
    if (Array.isArray(work.laurels) && work.laurels.length > 0) {
      lbLaurelsSection.classList.remove('hidden');
      lbLaurelsList.innerHTML = work.laurels.map(l => `
        <div class="flex items-center gap-1.5 text-primary text-[11px] font-mono">
          <span class="material-symbols-outlined text-[14px]">stars</span>
          <span>${l}</span>
        </div>
      `).join('');
    } else {
      lbLaurelsSection.classList.add('hidden');
    }
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
};

window.closeWorkPreviewModal = function() {
  const modal = document.getElementById('work-preview-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
};

// 12.14 Portfolio Sequence & Reorder Modal
window.openWorkReorderModal = function() {
  WorksState.reorderItems = [...WorksState.items].sort((a, b) => (a.order || 0) - (b.order || 0));
  renderWorkReorderList();

  const modal = document.getElementById('work-reorder-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
};

window.closeWorkReorderModal = function() {
  const modal = document.getElementById('work-reorder-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
};

function renderWorkReorderList() {
  const listContainer = document.getElementById('work-reorder-list');
  if (!listContainer) return;

  if (WorksState.reorderItems.length === 0) {
    listContainer.innerHTML = `<p class="text-xs text-outline text-center py-4">No works available to reorder.</p>`;
    return;
  }

  listContainer.innerHTML = WorksState.reorderItems.map((item, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === WorksState.reorderItems.length - 1;
    const coverUrl = item.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80';

    return `
      <div class="p-2.5 bg-surface-container/60 border border-surface-high flex items-center justify-between gap-3 hover:border-primary/40 transition-colors">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-7 h-7 rounded-full bg-surface-lowest border border-surface-high flex items-center justify-center font-mono font-bold text-primary text-xs shrink-0">
            ${idx + 1}
          </div>
          <div class="w-12 h-8 rounded bg-surface-lowest overflow-hidden shrink-0 border border-surface-high">
            <img alt="${item.title}" class="w-full h-full object-cover" src="${coverUrl}" onerror="this.src='https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80'" />
          </div>
          <div class="truncate">
            <span class="font-bold text-on-surface text-xs truncate block">${item.title}</span>
            <span class="text-[10px] text-outline font-mono">${item.workCode || ''} &bull; ${item.disciplineLabel || item.discipline}</span>
          </div>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button 
            class="p-1.5 bg-surface-container hover:bg-surface-high text-on-surface border border-surface-high disabled:opacity-30 disabled:cursor-not-allowed rounded cursor-pointer transition-colors" 
            onclick="moveWorkOrderItem(${idx}, -1)" 
            title="Move Up" 
            type="button" 
            ${isFirst ? 'disabled' : ''}
          >
            <span class="material-symbols-outlined text-[16px]">arrow_upward</span>
          </button>
          <button 
            class="p-1.5 bg-surface-container hover:bg-surface-high text-on-surface border border-surface-high disabled:opacity-30 disabled:cursor-not-allowed rounded cursor-pointer transition-colors" 
            onclick="moveWorkOrderItem(${idx}, 1)" 
            title="Move Down" 
            type="button" 
            ${isLast ? 'disabled' : ''}
          >
            <span class="material-symbols-outlined text-[16px]">arrow_downward</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.moveWorkOrderItem = function(index, direction) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= WorksState.reorderItems.length) return;

  const temp = WorksState.reorderItems[index];
  WorksState.reorderItems[index] = WorksState.reorderItems[targetIndex];
  WorksState.reorderItems[targetIndex] = temp;

  renderWorkReorderList();
};

window.saveWorksReorder = async function() {
  const saveBtn = document.getElementById('work-reorder-save-btn');
  if (saveBtn) saveBtn.disabled = true;

  try {
    const payloadItems = WorksState.reorderItems.map((item, idx) => ({
      id: item._id || item.workCode || item.slug,
      order: idx + 1
    }));

    const res = await apiFetch('/api/admin/works/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: payloadItems })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update work sequence.');
    }

    showToast('Portfolio sequence updated and synchronized.', 'success');
    closeWorkReorderModal();
    loadAdminWorks();
  } catch (err) {
    console.error('Reorder error:', err);
    showToast(err.message || 'Failed to update work sequence.', 'error');
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
};

// 12.15 Permanent Destructive Delete (Super Admin Only)
window.openDeleteWorkModal = function(id) {
  if (AuthState.user && AuthState.user.role !== 'admin') {
    showToast('Permission denied: Destructive deletion is restricted to Super Admin.', 'warning');
    return;
  }

  const work = WorksState.items.find(w => w._id === id || w.workCode === id || w.slug === id);
  WorksState.deleteTargetId = id;
  WorksState.deleteTargetTitle = work ? work.title : 'Selected Work';
  WorksState.deleteTargetCode = work ? work.workCode : id;

  const modal = document.getElementById('work-delete-modal');
  const titleDisplay = document.getElementById('work-delete-title-display');
  const codeDisplay = document.getElementById('work-delete-code-display');

  if (titleDisplay) titleDisplay.textContent = WorksState.deleteTargetTitle;
  if (codeDisplay) codeDisplay.textContent = WorksState.deleteTargetCode;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
};

window.closeDeleteWorkModal = function() {
  const modal = document.getElementById('work-delete-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
  WorksState.deleteTargetId = null;
};

window.executeDeleteWork = async function() {
  const id = WorksState.deleteTargetId;
  if (!id) return;

  const btn = document.getElementById('confirm-delete-work-btn');
  if (btn) btn.disabled = true;

  try {
    const res = await apiFetch(`/api/admin/works/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete work.');
    }

    showToast(data.message || 'Work plate permanently deleted.', 'success');
    closeDeleteWorkModal();
    loadAdminWorks();
    if (typeof loadDashboardMetrics === 'function') loadDashboardMetrics();
  } catch (err) {
    console.error('Delete error:', err);
    showToast(err.message || 'Failed to delete work.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
};

// =========================================================================
// 13. STEP 3: EVENTS MANAGEMENT CMS & CONTROLLER
// =========================================================================

// Centralized Events State
const EventsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  search: '',
  category: 'all',
  status: 'all',
  year: 'all',
  sort: 'date_asc',
  metrics: { all: 0, upcoming: 0, past: 0, draft: 0, archived: 0 },
  selectedEvent: null,
  dirtyForm: false,
  coverImage: '',
  gallery: [], // array of { url, caption, order }
  deleteTargetId: null,
  deleteTargetTitle: ''
};



// 12.2 Load Admin Events from REST API
window.loadAdminEvents = async function(isManual = false) {
  const tableBody = document.getElementById('admin-events-table-body');
  const mobileContainer = document.getElementById('admin-events-mobile-cards');
  const skeleton = document.getElementById('admin-events-skeleton');
  const tableContainer = document.getElementById('admin-events-table-container');
  const emptyState = document.getElementById('admin-events-empty-state');
  const refreshIcon = document.getElementById('events-refresh-icon');

  if (refreshIcon) refreshIcon.classList.add('animate-spin');
  if (skeleton) skeleton.classList.remove('hidden');
  if (tableContainer) tableContainer.classList.add('hidden');
  if (mobileContainer) mobileContainer.classList.add('hidden');
  if (emptyState) emptyState.classList.add('hidden');

  try {
    const params = new URLSearchParams({
      page: String(EventsState.page),
      limit: String(EventsState.limit),
      q: EventsState.search || '',
      category: EventsState.category || 'all',
      status: EventsState.status || 'all',
      year: EventsState.year || 'all',
      sort: EventsState.sort || 'date_asc'
    });

    const res = await apiFetch(`/api/admin/events?${params.toString()}`);
    if (!res.ok) throw new Error(`Events API error: ${res.status}`);

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      throw new Error(json.message || 'Invalid events data format');
    }

    EventsState.items = json.data;
    EventsState.total = json.total || json.data.length;
    EventsState.metrics = json.metrics || EventsState.metrics;

    // Update Status Pill Badges
    updateEventsStatusBadges(EventsState.metrics);

    // Update Table Badges & Pagination
    updateEventsPaginationUI(json.page || EventsState.page, json.totalPages || 1, json.total || EventsState.total);

    // Render Table & Cards
    if (EventsState.items.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (tableContainer) tableContainer.classList.remove('hidden');
      if (mobileContainer) mobileContainer.classList.remove('hidden');
      renderEventsTable(EventsState.items);
      renderEventsMobileCards(EventsState.items);
    }

    if (isManual) {
      showToast('Events registry synchronized.', 'success');
    }

  } catch (err) {
    console.error('Failed to load admin events:', err);
    if (isManual) showToast('Failed to load events from server.', 'error');
  } finally {
    if (skeleton) skeleton.classList.add('hidden');
    if (refreshIcon) {
      setTimeout(() => refreshIcon.classList.remove('animate-spin'), 300);
    }
  }
};

// 12.3 Render Events Table (Desktop / Tablet)
function renderEventsTable(events) {
  const tbody = document.getElementById('admin-events-table-body');
  if (!tbody) return;

  const isSuperAdmin = AuthState.user && AuthState.user.role === 'admin';

  tbody.innerHTML = events.map(evt => {
    const id = evt._id || evt.id;
    const coverUrl = evt.coverImage || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80';
    const percent = evt.capacityPercent || 0;
    const isArchived = Boolean(evt.isArchived);

    // Status Badge
    let statusClass = 'bg-green-950/40 text-green-300 border-green-500/40';
    let statusLabel = 'ACTIVE';

    if (isArchived) {
      statusClass = 'bg-surface-container text-outline border-surface-high';
      statusLabel = 'ARCHIVED';
    } else if (evt.status === 'draft') {
      statusClass = 'bg-yellow-950/40 text-yellow-300 border-yellow-500/40';
      statusLabel = 'DRAFT';
    } else if (evt.status === 'past' || evt.isPast) {
      statusClass = 'bg-surface-container text-outline border-surface-high';
      statusLabel = 'PAST';
    } else if (evt.isSoldOut || percent >= 100) {
      statusClass = 'bg-red-950/40 text-red-300 border-red-500/40';
      statusLabel = 'SOLD OUT';
    }

    // Category Color
    const catLabel = (evt.category || 'workshops').toUpperCase();

    return `
      <tr class="hover:bg-surface-container/40 transition-colors border-b border-surface-high/40 ${isArchived ? 'opacity-60' : ''}">
        <!-- Cover Thumbnail -->
        <td class="p-3 text-center">
          <div class="w-12 h-9 bg-surface-container overflow-hidden border border-surface-high mx-auto relative group">
            <img src="${escapeHTML(coverUrl)}" alt="Cover" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80'" />
            ${evt.gallery && evt.gallery.length > 0 ? `<span class="absolute bottom-0 right-0 bg-surface-lowest/90 px-1 text-[8px] text-primary font-mono">+${evt.gallery.length}</span>` : ''}
          </div>
        </td>

        <!-- Event Title & Category -->
        <td class="p-3">
          <div class="flex items-center gap-2">
            <span class="font-bold text-on-surface hover:text-primary transition-colors cursor-pointer text-xs" onclick="openEventPreview('${id}')">
              ${escapeHTML(evt.title)}
            </span>
            ${evt.flagship ? `<span class="text-[8px] px-1 bg-primary text-black font-bold uppercase">FLAGSHIP</span>` : ''}
          </div>
          <div class="text-[10px] text-primary uppercase font-bold tracking-wider mt-0.5">
            ${escapeHTML(catLabel)}
          </div>
        </td>

        <!-- Schedule & Location -->
        <td class="p-3">
          <div class="text-xs text-on-surface font-mono">
            ${escapeHTML(evt.dateDisplay || formatEventDate(evt.date))}
          </div>
          <div class="text-[10px] text-outline flex items-center gap-1 mt-0.5">
            <span class="material-symbols-outlined text-[12px]">location_on</span>
            <span class="truncate max-w-[180px]">${escapeHTML(evt.location || 'Chennai Campus Base')}</span>
          </div>
        </td>

        <!-- RSVP / Capacity Bar -->
        <td class="p-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-[10px]">
              <span class="font-bold text-on-surface">${evt.rsvpCount || 0} / ${evt.totalCapacity || 30}</span>
              <span class="text-outline font-mono">${percent}%</span>
            </div>
            <div class="w-full bg-surface-lowest h-1.5 rounded-full overflow-hidden border border-surface-high/60">
              <div class="h-full ${percent >= 100 ? 'bg-red-500' : (percent >= 75 ? 'bg-amber-400' : 'bg-primary')}" style="width: ${percent}%;"></div>
            </div>
            <div class="text-[9px] text-outline">
              ${evt.seatsRemaining !== undefined ? `${evt.seatsRemaining} seats available` : ''}
            </div>
          </div>
        </td>

        <!-- Status -->
        <td class="p-3 text-center">
          <span class="inline-block text-[9px] font-mono px-2 py-0.5 border ${statusClass} font-bold uppercase">
            ${statusLabel}
          </span>
        </td>

        <!-- Actions Toolbar -->
        <td class="p-3 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <!-- Preview Action -->
            <button 
              class="p-1.5 text-outline hover:text-primary hover:bg-surface-container rounded transition-colors cursor-pointer" 
              onclick="openEventPreview('${id}')" 
              title="Preview Event Details"
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">visibility</span>
            </button>

            <!-- Edit Action -->
            <button 
              class="p-1.5 text-outline hover:text-yellow-300 hover:bg-surface-container rounded transition-colors cursor-pointer" 
              onclick="openEditEventModal('${id}')" 
              title="Edit Event"
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>

            <!-- Archive Toggle Action -->
            <button 
              class="p-1.5 text-outline hover:text-amber-300 hover:bg-surface-container rounded transition-colors cursor-pointer" 
              onclick="toggleArchiveEvent('${id}', ${isArchived})" 
              title="${isArchived ? 'Unarchive Event' : 'Archive Event'}"
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">${isArchived ? 'unarchive' : 'archive'}</span>
            </button>

            <!-- Destructive Delete Action (Super Admin Only) -->
            ${isSuperAdmin ? `
              <button 
                class="p-1.5 text-outline hover:text-red-400 hover:bg-surface-container rounded transition-colors cursor-pointer" 
                onclick="openDeleteEventModal('${id}', '${escapeHTML(evt.title).replace(/'/g, "\\'")}')" 
                title="Delete Event"
                type="button"
              >
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            ` : `
              <button 
                class="p-1.5 text-outline/30 cursor-not-allowed" 
                title="Super Admin Only"
                disabled
                type="button"
              >
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 12.4 Render Mobile Responsive Cards
function renderEventsMobileCards(events) {
  const container = document.getElementById('admin-events-mobile-cards');
  if (!container) return;

  const isSuperAdmin = AuthState.user && AuthState.user.role === 'admin';

  container.innerHTML = events.map(evt => {
    const id = evt._id || evt.id;
    const coverUrl = evt.coverImage || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80';
    const percent = evt.capacityPercent || 0;
    const isArchived = Boolean(evt.isArchived);

    return `
      <div class="p-4 bg-surface-low border border-surface-high space-y-3 ${isArchived ? 'opacity-60' : ''}">
        <div class="flex items-start gap-3">
          <div class="w-16 h-12 bg-surface-container overflow-hidden border border-surface-high flex-shrink-0">
            <img src="${escapeHTML(coverUrl)}" alt="Cover" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80'" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <span class="text-[9px] text-primary uppercase font-bold">${escapeHTML(evt.category || 'WORKSHOP')}</span>
              <span class="text-[9px] font-mono px-1.5 py-0.2 border ${isArchived ? 'border-surface-high text-outline' : 'border-green-500/40 text-green-300'} uppercase font-bold">
                ${isArchived ? 'ARCHIVED' : (evt.status || 'ACTIVE')}
              </span>
            </div>
            <h3 class="text-xs font-bold text-on-surface truncate cursor-pointer hover:text-primary" onclick="openEventPreview('${id}')">
              ${escapeHTML(evt.title)}
            </h3>
            <div class="text-[10px] text-outline mt-0.5">
              ${escapeHTML(evt.dateDisplay || formatEventDate(evt.date))} &bull; ${escapeHTML(evt.location || 'Campus Base')}
            </div>
          </div>
        </div>

        <!-- Seating Bar -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-[10px] text-outline font-mono">
            <span>SEATS: ${evt.rsvpCount || 0} / ${evt.totalCapacity || 30}</span>
            <span>${percent}% BOOKED</span>
          </div>
          <div class="w-full bg-surface-lowest h-1.5 rounded-full overflow-hidden border border-surface-high">
            <div class="h-full bg-primary" style="width: ${percent}%;"></div>
          </div>
        </div>

        <!-- Mobile Action Buttons -->
        <div class="flex items-center justify-between pt-2 border-t border-surface-high/60">
          <button class="text-xs text-primary font-bold flex items-center gap-1" onclick="openEventPreview('${id}')" type="button">
            <span class="material-symbols-outlined text-[14px]">visibility</span>
            <span>Preview</span>
          </button>

          <div class="flex items-center gap-2">
            <button class="px-2.5 py-1 bg-surface-container text-xs font-bold hover:bg-surface-high text-on-surface border border-surface-high" onclick="openEditEventModal('${id}')" type="button">
              Edit
            </button>
            <button class="px-2.5 py-1 bg-surface-container text-xs font-bold hover:bg-surface-high text-on-surface border border-surface-high" onclick="toggleArchiveEvent('${id}', ${isArchived})" type="button">
              ${isArchived ? 'Unarchive' : 'Archive'}
            </button>
            ${isSuperAdmin ? `
              <button class="px-2.5 py-1 bg-red-950/50 text-xs font-bold hover:bg-red-900 text-red-300 border border-red-500/40" onclick="openDeleteEventModal('${id}', '${escapeHTML(evt.title).replace(/'/g, "\\'")}')" type="button">
                Delete
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 12.5 Status Pill Counts Helper
function updateEventsStatusBadges(m) {
  const elAll = document.getElementById('events-count-all');
  const elUp = document.getElementById('events-count-upcoming');
  const elPast = document.getElementById('events-count-past');
  const elDraft = document.getElementById('events-count-draft');
  const elArch = document.getElementById('events-count-archived');
  const elTotal = document.getElementById('events-table-total-badge');

  if (elAll && m.all !== undefined) elAll.textContent = m.all;
  if (elUp && m.upcoming !== undefined) elUp.textContent = m.upcoming;
  if (elPast && m.past !== undefined) elPast.textContent = m.past;
  if (elDraft && m.draft !== undefined) elDraft.textContent = m.draft;
  if (elArch && m.archived !== undefined) elArch.textContent = m.archived;
  if (elTotal) elTotal.textContent = `${EventsState.total} EVENTS`;
}

// 12.6 Pagination UI Helper
function updateEventsPaginationUI(page, totalPages, totalItems) {
  const pageCurrent = document.getElementById('events-page-current');
  const pagePrev = document.getElementById('events-page-prev');
  const pageNext = document.getElementById('events-page-next');
  const pageInfo = document.getElementById('events-pagination-info');

  EventsState.page = page;

  if (pageCurrent) pageCurrent.textContent = page;
  if (pagePrev) pagePrev.disabled = page <= 1;
  if (pageNext) pageNext.disabled = page >= totalPages;

  if (pageInfo) {
    const start = totalItems === 0 ? 0 : (page - 1) * EventsState.limit + 1;
    const end = Math.min(page * EventsState.limit, totalItems);
    pageInfo.textContent = `Showing ${start} to ${end} of ${totalItems} events`;
  }
}

window.changeEventsPage = function(delta) {
  const newPage = EventsState.page + delta;
  if (newPage < 1) return;
  EventsState.page = newPage;
  loadAdminEvents();
};

// 12.7 Filter & Search Triggers
let eventsSearchTimeout = null;
const searchInput = document.getElementById('events-search-input');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const clearBtn = document.getElementById('events-search-clear');
    if (clearBtn) clearBtn.classList.toggle('hidden', !e.target.value);

    clearTimeout(eventsSearchTimeout);
    eventsSearchTimeout = setTimeout(() => {
      EventsState.search = e.target.value.trim();
      EventsState.page = 1;
      loadAdminEvents();
    }, 300);
  });
}

window.clearEventsSearch = function() {
  const input = document.getElementById('events-search-input');
  const clearBtn = document.getElementById('events-search-clear');
  if (input) input.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  EventsState.search = '';
  EventsState.page = 1;
  loadAdminEvents();
};

window.handleEventsFilterChange = function() {
  const cat = document.getElementById('events-category-filter');
  const status = document.getElementById('events-status-select');
  const year = document.getElementById('events-year-filter');
  const sort = document.getElementById('events-sort-select');

  if (cat) EventsState.category = cat.value;
  if (status) EventsState.status = status.value;
  if (year) EventsState.year = year.value;
  if (sort) EventsState.sort = sort.value;

  EventsState.page = 1;
  loadAdminEvents();
};

window.setEventsStatusFilter = function(statusVal) {
  const statusSelect = document.getElementById('events-status-select');
  if (statusSelect) statusSelect.value = statusVal;
  EventsState.status = statusVal;
  EventsState.page = 1;
  loadAdminEvents();
};

// =========================================================================
// 13. EVENT FORM MODAL (CREATE / EDIT / IMAGE UPLOADS / GALLERY REORDER)
// =========================================================================

// Open Create Event Modal
window.openCreateEventModal = function() {
  const modal = document.getElementById('event-form-modal');
  const form = document.getElementById('admin-event-form');
  const title = document.getElementById('event-modal-title');
  const icon = document.getElementById('event-modal-icon');
  const submitText = document.getElementById('event-submit-text');

  if (!modal || !form) return;

  form.reset();
  document.getElementById('event-form-id').value = '';
  document.getElementById('event-cover-url').value = '';
  EventsState.coverImage = '';
  EventsState.gallery = [];
  EventsState.dirtyForm = false;

  if (title) title.textContent = 'Create New Event';
  if (icon) icon.textContent = 'add_circle';
  if (submitText) submitText.textContent = 'Save & Publish Event';

  // Set default values
  document.getElementById('event-category-select').value = 'workshops';
  document.getElementById('event-capacity-input').value = '30';
  document.getElementById('event-time-input').value = '18:00 IST';
  document.getElementById('event-status-input').value = 'active';

  // Clear images
  removeCoverImage(true);
  renderGalleryPreviews();

  hideEventFormAlert();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

// Open Edit Event Modal
window.openEditEventModal = async function(eventId) {
  const modal = document.getElementById('event-form-modal');
  const title = document.getElementById('event-modal-title');
  const icon = document.getElementById('event-modal-icon');
  const submitText = document.getElementById('event-submit-text');

  if (!modal) return;

  try {
    const res = await apiFetch(`/api/admin/events/${eventId}`);
    if (!res.ok) throw new Error('Event not found');
    const json = await res.json();
    const evt = json.data;

    document.getElementById('event-form-id').value = evt._id || evt.id;
    document.getElementById('event-title-input').value = evt.title || '';
    document.getElementById('event-category-select').value = evt.category || 'workshops';
    document.getElementById('event-short-desc-input').value = evt.shortDescription || '';
    document.getElementById('event-description-input').value = evt.description || '';

    // Date formatting (YYYY-MM-DD for date input)
    let dateStr = '';
    if (evt.date) {
      const d = new Date(evt.date);
      if (!isNaN(d.getTime())) {
        dateStr = d.toISOString().split('T')[0];
      } else {
        dateStr = String(evt.date);
      }
    }
    document.getElementById('event-date-input').value = dateStr;
    document.getElementById('event-time-input').value = evt.time || '18:00 IST';
    document.getElementById('event-endtime-input').value = evt.endTime || '';
    document.getElementById('event-location-input').value = evt.location || '';
    document.getElementById('event-datedisplay-input').value = evt.dateDisplay || '';
    document.getElementById('event-capacity-input').value = evt.totalCapacity || 30;
    document.getElementById('event-flagship-checkbox').checked = Boolean(evt.flagship);
    document.getElementById('event-status-input').value = evt.status || (evt.isArchived ? 'archived' : 'active');
    document.getElementById('event-badge-input').value = evt.seatsRemainingBadge || '';

    // Cover Image
    EventsState.coverImage = evt.coverImage || '';
    document.getElementById('event-cover-url').value = EventsState.coverImage;
    if (EventsState.coverImage) {
      setCoverPreviewUI(EventsState.coverImage);
    } else {
      removeCoverImage(true);
    }

    // Gallery
    EventsState.gallery = Array.isArray(evt.gallery) ? [...evt.gallery] : [];
    renderGalleryPreviews();

    EventsState.dirtyForm = false;

    if (title) title.textContent = `Edit Event: ${evt.title}`;
    if (icon) icon.textContent = 'edit';
    if (submitText) submitText.textContent = 'Save Changes';

    hideEventFormAlert();
    modal.classList.remove('hidden');
    modal.classList.add('flex');

  } catch (err) {
    console.error('Failed to load event for edit:', err);
    showToast('Failed to load event details.', 'error');
  }
};

// Form Dirty Tracker
const formElement = document.getElementById('admin-event-form');
if (formElement) {
  formElement.addEventListener('input', () => { EventsState.dirtyForm = true; });
  formElement.addEventListener('change', () => { EventsState.dirtyForm = true; });
}

// Close Event Form Modal with Dirty Check
window.handleCloseEventFormModal = function() {
  if (EventsState.dirtyForm) {
    const unsavedModal = document.getElementById('unsaved-changes-modal');
    if (unsavedModal) {
      unsavedModal.classList.remove('hidden');
      unsavedModal.classList.add('flex');
    }
  } else {
    forceCloseEventFormModal();
  }
};

function forceCloseEventFormModal() {
  const modal = document.getElementById('event-form-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  EventsState.dirtyForm = false;
}

window.closeUnsavedChangesModal = function() {
  const modal = document.getElementById('unsaved-changes-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.confirmDiscardChanges = function() {
  closeUnsavedChangesModal();
  forceCloseEventFormModal();
};

function showEventFormAlert(msg) {
  const box = document.getElementById('event-form-alert');
  const txt = document.getElementById('event-form-alert-text');
  if (box && txt) {
    txt.textContent = msg;
    box.classList.remove('hidden');
  }
}

function hideEventFormAlert() {
  const box = document.getElementById('event-form-alert');
  if (box) box.classList.add('hidden');
}

// 13.1 Single Cover Image Upload Handler
const coverFileInput = document.getElementById('cover-file-input');
const coverDropZone = document.getElementById('cover-drop-zone');

if (coverFileInput) {
  coverFileInput.addEventListener('change', async (e) => {
    if (e.target.files && e.target.files[0]) {
      await uploadSingleCoverFile(e.target.files[0]);
    }
  });
}

if (coverDropZone) {
  ['dragenter', 'dragover'].forEach(name => {
    coverDropZone.addEventListener(name, (e) => {
      e.preventDefault();
      coverDropZone.classList.add('border-primary');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    coverDropZone.addEventListener(name, (e) => {
      e.preventDefault();
      coverDropZone.classList.remove('border-primary');
    });
  });

  coverDropZone.addEventListener('drop', async (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadSingleCoverFile(e.dataTransfer.files[0]);
    }
  });
}

async function uploadSingleCoverFile(file) {
  if (!file) return;

  // Validate Max 5MB Limit
  if (file.size > 5 * 1024 * 1024) {
    showToast('File size exceeds the 5MB maximum limit.', 'error');
    return;
  }

  // Validate MIME
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
  if (!allowed.includes(file.type)) {
    showToast('Only JPEG, PNG, WebP, AVIF, or GIF images are allowed.', 'error');
    return;
  }

  const progContainer = document.getElementById('cover-upload-progress-container');
  const progBar = document.getElementById('cover-upload-progress-bar');
  if (progContainer) progContainer.classList.remove('hidden');
  if (progBar) progBar.style.width = '40%';

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await apiFetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (progBar) progBar.style.width = '80%';

    const data = await res.json();
    if (res.ok && data.success && data.url) {
      EventsState.coverImage = data.url;
      EventsState.dirtyForm = true;
      document.getElementById('event-cover-url').value = data.url;
      setCoverPreviewUI(data.url);
      showToast('Cover image uploaded successfully.', 'success');
    } else {
      throw new Error(data.message || 'Upload failed');
    }
  } catch (err) {
    console.error('Cover upload error:', err);
    showToast(err.message || 'Cover upload failed.', 'error');
  } finally {
    if (progBar) progBar.style.width = '100%';
    setTimeout(() => {
      if (progContainer) progContainer.classList.add('hidden');
      if (progBar) progBar.style.width = '0%';
    }, 400);
  }
}

function setCoverPreviewUI(url) {
  const img = document.getElementById('cover-preview-img');
  const emptyLabel = document.getElementById('cover-empty-label');
  const removeBtn = document.getElementById('cover-remove-btn');

  if (img) {
    img.src = url;
    img.classList.remove('hidden');
  }
  if (emptyLabel) emptyLabel.classList.add('hidden');
  if (removeBtn) removeBtn.classList.remove('hidden');
}

window.removeCoverImage = function(silent = false) {
  EventsState.coverImage = '';
  const urlInput = document.getElementById('event-cover-url');
  if (urlInput) urlInput.value = '';

  const img = document.getElementById('cover-preview-img');
  const emptyLabel = document.getElementById('cover-empty-label');
  const removeBtn = document.getElementById('cover-remove-btn');

  if (img) {
    img.src = '';
    img.classList.add('hidden');
  }
  if (emptyLabel) emptyLabel.classList.remove('hidden');
  if (removeBtn) removeBtn.classList.add('hidden');

  if (!silent) {
    EventsState.dirtyForm = true;
    showToast('Cover image removed.', 'info');
  }
};

// 13.2 Multi-Gallery Image Upload & Reorder Handler
const galleryFileInput = document.getElementById('gallery-file-input');
const galleryDropZone = document.getElementById('gallery-drop-zone');

if (galleryFileInput) {
  galleryFileInput.addEventListener('change', async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadMultiGalleryFiles(e.target.files);
    }
  });
}

if (galleryDropZone) {
  ['dragenter', 'dragover'].forEach(name => {
    galleryDropZone.addEventListener(name, (e) => {
      e.preventDefault();
      galleryDropZone.classList.add('border-primary');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    galleryDropZone.addEventListener(name, (e) => {
      e.preventDefault();
      galleryDropZone.classList.remove('border-primary');
    });
  });

  galleryDropZone.addEventListener('drop', async (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadMultiGalleryFiles(e.dataTransfer.files);
    }
  });
}

async function uploadMultiGalleryFiles(fileList) {
  const files = Array.from(fileList);
  if (files.length === 0) return;

  // Validate 5MB limit on all files
  for (const f of files) {
    if (f.size > 5 * 1024 * 1024) {
      showToast(`"${f.name}" exceeds 5MB limit. Upload cancelled.`, 'error');
      return;
    }
  }

  const progContainer = document.getElementById('gallery-upload-progress-container');
  const progBar = document.getElementById('gallery-upload-progress-bar');
  if (progContainer) progContainer.classList.remove('hidden');
  if (progBar) progBar.style.width = '35%';

  const formData = new FormData();
  files.forEach(f => formData.append('images', f));

  try {
    const res = await apiFetch('/api/upload-gallery', {
      method: 'POST',
      body: formData
    });

    if (progBar) progBar.style.width = '85%';

    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.files)) {
      data.files.forEach(uploaded => {
        EventsState.gallery.push({
          url: uploaded.url,
          caption: '',
          order: EventsState.gallery.length
        });
      });

      EventsState.dirtyForm = true;
      renderGalleryPreviews();
      showToast(`Uploaded ${data.files.length} gallery image(s).`, 'success');
    } else {
      throw new Error(data.message || 'Gallery upload failed');
    }
  } catch (err) {
    console.error('Gallery upload error:', err);
    showToast(err.message || 'Gallery upload failed.', 'error');
  } finally {
    if (progBar) progBar.style.width = '100%';
    setTimeout(() => {
      if (progContainer) progContainer.classList.add('hidden');
      if (progBar) progBar.style.width = '0%';
    }, 400);
  }
}

function renderGalleryPreviews() {
  const grid = document.getElementById('gallery-previews-grid');
  const badge = document.getElementById('gallery-count-badge');
  if (!grid) return;

  if (badge) badge.textContent = `${EventsState.gallery.length} ${EventsState.gallery.length === 1 ? 'IMAGE' : 'IMAGES'}`;

  if (EventsState.gallery.length === 0) {
    grid.innerHTML = `<div class="col-span-2 sm:col-span-4 text-center py-2 text-outline text-[11px]">No gallery images added yet.</div>`;
    return;
  }

  grid.innerHTML = EventsState.gallery.map((item, idx) => `
    <div class="bg-surface-lowest border border-surface-high p-2 flex flex-col gap-1.5 relative group">
      <div class="aspect-[4/3] bg-surface-container overflow-hidden relative">
        <img src="${escapeHTML(item.url)}" alt="Gallery photo ${idx + 1}" class="w-full h-full object-cover" />
        <span class="absolute top-1 left-1 bg-surface-lowest/90 px-1 text-[8px] font-mono text-primary">#${idx + 1}</span>
      </div>

      <input 
        type="text" 
        placeholder="Caption..." 
        value="${escapeHTML(item.caption || '')}" 
        onchange="updateGalleryCaption(${idx}, this.value)"
        class="bg-surface-container px-1.5 py-1 text-[10px] text-on-surface border border-surface-high focus:outline-none focus:border-primary"
      />

      <div class="flex items-center justify-between text-[10px] pt-0.5">
        <div class="flex items-center gap-1">
          <button 
            type="button" 
            onclick="moveGalleryItem(${idx}, -1)" 
            ${idx === 0 ? 'disabled' : ''}
            class="p-0.5 bg-surface-container hover:bg-surface-high disabled:opacity-30 disabled:cursor-not-allowed text-outline hover:text-primary transition-colors" 
            title="Move Left/Up"
          >
            <span class="material-symbols-outlined text-[14px]">arrow_back</span>
          </button>
          <button 
            type="button" 
            onclick="moveGalleryItem(${idx}, 1)" 
            ${idx === EventsState.gallery.length - 1 ? 'disabled' : ''}
            class="p-0.5 bg-surface-container hover:bg-surface-high disabled:opacity-30 disabled:cursor-not-allowed text-outline hover:text-primary transition-colors" 
            title="Move Right/Down"
          >
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <button 
          type="button" 
          onclick="removeGalleryItem(${idx})" 
          class="p-0.5 text-red-400 hover:text-red-300 transition-colors" 
          title="Remove Image"
        >
          <span class="material-symbols-outlined text-[14px]">delete</span>
        </button>
      </div>
    </div>
  `).join('');
}

window.updateGalleryCaption = function(index, captionVal) {
  if (EventsState.gallery[index]) {
    EventsState.gallery[index].caption = captionVal;
    EventsState.dirtyForm = true;
  }
};

window.moveGalleryItem = function(index, delta) {
  const newIndex = index + delta;
  if (newIndex < 0 || newIndex >= EventsState.gallery.length) return;

  const temp = EventsState.gallery[index];
  EventsState.gallery[index] = EventsState.gallery[newIndex];
  EventsState.gallery[newIndex] = temp;

  // Update order property
  EventsState.gallery.forEach((g, i) => { g.order = i; });
  EventsState.dirtyForm = true;
  renderGalleryPreviews();
};

window.removeGalleryItem = function(index) {
  EventsState.gallery.splice(index, 1);
  EventsState.gallery.forEach((g, i) => { g.order = i; });
  EventsState.dirtyForm = true;
  renderGalleryPreviews();
};

// 13.3 Submit Event Form (Create or Update)
window.handleEventFormSubmit = async function(e) {
  e.preventDefault();

  const id = document.getElementById('event-form-id').value;
  const title = document.getElementById('event-title-input').value.trim();
  const category = document.getElementById('event-category-select').value;
  const shortDescription = document.getElementById('event-short-desc-input').value.trim();
  const description = document.getElementById('event-description-input').value.trim();
  const date = document.getElementById('event-date-input').value;
  const time = document.getElementById('event-time-input').value.trim();
  const endTime = document.getElementById('event-endtime-input').value.trim();
  const location = document.getElementById('event-location-input').value.trim();
  const dateDisplay = document.getElementById('event-datedisplay-input').value.trim();
  const totalCapacity = parseInt(document.getElementById('event-capacity-input').value, 10) || 30;
  const flagship = document.getElementById('event-flagship-checkbox').checked;
  const status = document.getElementById('event-status-input').value;
  const seatsRemainingBadge = document.getElementById('event-badge-input').value.trim();

  // Basic Validation
  if (!title || !category || !description || !date || !location) {
    showEventFormAlert('Please complete all required fields (Title, Category, Description, Date, Location).');
    return;
  }

  const submitBtn = document.getElementById('event-submit-btn');
  const spinner = document.getElementById('event-submit-spinner');
  const btnText = document.getElementById('event-submit-text');

  if (submitBtn) submitBtn.disabled = true;
  if (spinner) spinner.classList.remove('hidden');
  if (btnText) btnText.textContent = 'Saving Event...';
  hideEventFormAlert();

  const payload = {
    title,
    category,
    shortDescription,
    description,
    date,
    time,
    endTime,
    location,
    dateDisplay,
    totalCapacity,
    flagship,
    status,
    seatsRemainingBadge,
    coverImage: EventsState.coverImage,
    gallery: EventsState.gallery,
    isArchived: status === 'archived'
  };

  try {
    const isEdit = Boolean(id);
    const url = isEdit ? `/api/admin/events/${id}` : '/api/admin/events';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      showToast(isEdit ? 'Event updated successfully.' : 'New event published successfully.', 'success');
      forceCloseEventFormModal();
      loadAdminEvents();
      loadDashboardMetrics();
    } else {
      throw new Error(data.message || 'Failed to save event');
    }
  } catch (err) {
    console.error('Error saving event:', err);
    showEventFormAlert(err.message || 'Server error occurred while saving event.');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    if (spinner) spinner.classList.add('hidden');
    if (btnText) btnText.textContent = id ? 'Save Changes' : 'Save & Publish Event';
  }
};

// =========================================================================
// 14. EVENT PREVIEW MODAL
// =========================================================================
window.openEventPreview = async function(eventId) {
  const modal = document.getElementById('event-preview-modal');
  if (!modal) return;

  try {
    const res = await apiFetch(`/api/admin/events/${eventId}`);
    if (!res.ok) throw new Error('Event not found');
    const json = await res.json();
    const evt = json.data;

    document.getElementById('preview-category-badge').textContent = (evt.category || 'WORKSHOP').toUpperCase();
    document.getElementById('preview-status-badge').textContent = (evt.status || 'ACTIVE').toUpperCase();
    document.getElementById('preview-title').textContent = evt.title;
    document.getElementById('preview-date-time').innerHTML = `
      <span class="material-symbols-outlined text-[14px]">calendar_today</span>
      <span>${escapeHTML(evt.dateDisplay || formatEventDate(evt.date))} &bull; ${escapeHTML(evt.time || '18:00 IST')}</span>
    `;
    document.getElementById('preview-location').innerHTML = `
      <span class="material-symbols-outlined text-[14px]">location_on</span>
      <span>${escapeHTML(evt.location || 'Chennai Base')}</span>
    `;

    const coverBanner = document.getElementById('preview-cover-banner');
    if (coverBanner) {
      const coverUrl = evt.coverImage || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&q=80';
      coverBanner.style.backgroundImage = `url('${coverUrl}')`;
    }

    const badgePill = document.getElementById('preview-badge-pill');
    if (badgePill) {
      badgePill.textContent = evt.seatsRemainingBadge || (evt.isSoldOut ? 'SOLD OUT' : 'SEATS OPEN');
    }

    // Capacity Stats
    const percent = evt.capacityPercent || 0;
    document.getElementById('preview-capacity-ratio').textContent = `${evt.rsvpCount || 0} / ${evt.totalCapacity || 30} Seats Claimed`;
    document.getElementById('preview-capacity-bar').style.width = `${percent}%`;
    document.getElementById('preview-capacity-percent').textContent = `${percent}% Booked`;
    document.getElementById('preview-seats-left').textContent = `${evt.seatsRemaining !== undefined ? evt.seatsRemaining : 0} seats available`;

    // Description
    document.getElementById('preview-description').textContent = evt.description || 'No description provided.';

    // Gallery
    const gallerySection = document.getElementById('preview-gallery-section');
    const galleryGrid = document.getElementById('preview-gallery-grid');
    if (gallerySection && galleryGrid) {
      if (evt.gallery && evt.gallery.length > 0) {
        gallerySection.classList.remove('hidden');
        galleryGrid.innerHTML = evt.gallery.map(g => `
          <div class="space-y-1">
            <div class="aspect-[4/3] bg-surface-container overflow-hidden border border-surface-high">
              <img src="${escapeHTML(g.url)}" alt="Gallery" class="w-full h-full object-cover" />
            </div>
            ${g.caption ? `<p class="text-[9px] text-outline truncate">${escapeHTML(g.caption)}</p>` : ''}
          </div>
        `).join('');
      } else {
        gallerySection.classList.add('hidden');
      }
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');

  } catch (err) {
    console.error('Preview load error:', err);
    showToast('Failed to load event preview.', 'error');
  }
};

window.closeEventPreviewModal = function() {
  const modal = document.getElementById('event-preview-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// =========================================================================
// 15. ARCHIVE & DESTRUCTIVE DELETE ACTIONS
// =========================================================================

// Toggle Archive Status
window.toggleArchiveEvent = async function(eventId, currentIsArchived) {
  try {
    const res = await apiFetch(`/api/admin/events/${eventId}/archive`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isArchived: !currentIsArchived })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      showToast(!currentIsArchived ? 'Event archived from public view.' : 'Event restored to active registry.', 'success');
      loadAdminEvents();
      loadDashboardMetrics();
    } else {
      throw new Error(data.message || 'Failed to toggle archive state');
    }
  } catch (err) {
    console.error('Archive error:', err);
    showToast(err.message || 'Error updating event archive status.', 'error');
  }
};

// Open Delete Modal
window.openDeleteEventModal = function(eventId, eventTitle) {
  // Check Super Admin Permission
  if (!AuthState.user || AuthState.user.role !== 'admin') {
    showToast('Permission Denied: Only Super Admin can permanently delete events.', 'error');
    return;
  }

  EventsState.deleteTargetId = eventId;
  EventsState.deleteTargetTitle = eventTitle;

  const modal = document.getElementById('event-delete-modal');
  const titleDisplay = document.getElementById('delete-event-title-display');

  if (titleDisplay) titleDisplay.textContent = eventTitle || 'Selected Event';
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeDeleteEventModal = function() {
  const modal = document.getElementById('event-delete-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  EventsState.deleteTargetId = null;
  EventsState.deleteTargetTitle = '';
};

// Execute Permanent Delete
window.executeDeleteEvent = async function() {
  const targetId = EventsState.deleteTargetId;
  if (!targetId) return;

  const btn = document.getElementById('confirm-delete-btn');
  if (btn) btn.disabled = true;

  try {
    const res = await apiFetch(`/api/admin/events/${targetId}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (res.ok && data.success) {
      showToast(`Event "${EventsState.deleteTargetTitle}" was permanently deleted.`, 'success');
      closeDeleteEventModal();
      loadAdminEvents();
      loadDashboardMetrics();
    } else {
      throw new Error(data.message || 'Delete operation failed');
    }
  } catch (err) {
    console.error('Delete error:', err);
    showToast(err.message || 'Error deleting event from server.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
};

// ====================================================
// STEP 4: RSVP & ATTENDEE MANAGEMENT CONTROLLER
// ====================================================

const RsvpsState = {
  search: '',
  eventId: 'all',
  status: 'all',
  sortBy: 'newest',
  page: 1,
  limit: 25,
  total: 0,
  totalPages: 1,
  data: [],
  selectedRsvp: null,
  cancelTargetId: null,
  cancelTargetName: '',
  cancelTargetPass: '',
  eventsList: []
};

// 18.1 Search Input Debounce for RSVPs
let rsvpsSearchDebounceTimer = null;
function initRsvpsSearchInput() {
  const input = document.getElementById('rsvps-search-input');
  const clearBtn = document.getElementById('rsvps-search-clear');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const val = e.target.value;
    if (clearBtn) clearBtn.classList.toggle('hidden', !val);

    clearTimeout(rsvpsSearchDebounceTimer);
    rsvpsSearchDebounceTimer = setTimeout(() => {
      RsvpsState.search = val.trim();
      RsvpsState.page = 1;
      loadAdminRsvps();
    }, 300);
  });
}

window.clearRsvpsSearch = function() {
  const input = document.getElementById('rsvps-search-input');
  const clearBtn = document.getElementById('rsvps-search-clear');
  if (input) input.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  RsvpsState.search = '';
  RsvpsState.page = 1;
  loadAdminRsvps();
};

window.clearAllRsvpFilters = function() {
  const searchInput = document.getElementById('rsvps-search-input');
  const eventSelect = document.getElementById('rsvps-event-filter');
  const statusSelect = document.getElementById('rsvps-status-filter');
  const sortSelect = document.getElementById('rsvps-sort-filter');
  const clearBtn = document.getElementById('rsvps-search-clear');

  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  if (eventSelect) eventSelect.value = 'all';
  if (statusSelect) statusSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'newest';

  RsvpsState.search = '';
  RsvpsState.eventId = 'all';
  RsvpsState.status = 'all';
  RsvpsState.sortBy = 'newest';
  RsvpsState.page = 1;
  loadAdminRsvps();
};

// 18.2 Populate Events Filter Dropdown
window.loadRsvpsEventFilter = async function() {
  const filterSelect = document.getElementById('rsvps-event-filter');
  if (!filterSelect) return;

  try {
    const res = await fetch('/api/admin/events?limit=100', {
      headers: { 'Authorization': `Bearer ${AuthState.token}` }
    });
    if (!res.ok) return;

    const result = await res.json();
    if (result.success && Array.isArray(result.data)) {
      RsvpsState.eventsList = result.data;
      const currentVal = RsvpsState.eventId || 'all';

      let optionsHTML = '<option value="all">All Events</option>';
      result.data.forEach(ev => {
        const val = ev._id || ev.id || ev.slug;
        const isSelected = val === currentVal ? 'selected' : '';
        const seatsClaimed = ev.rsvpCount || (ev.totalCapacity - (ev.seatsRemaining || 0));
        optionsHTML += `<option value="${val}" ${isSelected}>${escapeHTML(ev.title)} (${seatsClaimed}/${ev.totalCapacity})</option>`;
      });

      filterSelect.innerHTML = optionsHTML;
    }
  } catch (err) {
    console.warn('Failed to load events filter list for RSVPs:', err);
  }
};

window.handleRsvpsFilterChange = function() {
  const eventSelect = document.getElementById('rsvps-event-filter');
  const statusSelect = document.getElementById('rsvps-status-filter');
  const sortSelect = document.getElementById('rsvps-sort-filter');

  if (eventSelect) RsvpsState.eventId = eventSelect.value;
  if (statusSelect) RsvpsState.status = statusSelect.value;
  if (sortSelect) RsvpsState.sortBy = sortSelect.value;

  RsvpsState.page = 1;
  loadAdminRsvps();
};

window.changeRsvpsPage = function(delta) {
  const targetPage = RsvpsState.page + delta;
  if (targetPage >= 1 && targetPage <= RsvpsState.totalPages) {
    RsvpsState.page = targetPage;
    loadAdminRsvps();
  }
};

// 18.3 Load RSVPs from REST API
window.loadAdminRsvps = async function(isManual = false) {
  const tableBody = document.getElementById('admin-rsvps-table-body');
  const mobileContainer = document.getElementById('admin-rsvps-mobile-cards');
  const skeleton = document.getElementById('admin-rsvps-skeleton');
  const tableContainer = document.getElementById('admin-rsvps-table-container');
  const emptyState = document.getElementById('admin-rsvps-empty-state');
  const refreshIcon = document.getElementById('rsvps-refresh-icon');

  if (refreshIcon) refreshIcon.classList.add('animate-spin');
  if (skeleton) skeleton.classList.remove('hidden');
  if (tableContainer) tableContainer.classList.add('hidden');
  if (mobileContainer) mobileContainer.classList.add('hidden');
  if (emptyState) emptyState.classList.add('hidden');

  try {
    const params = new URLSearchParams({
      eventId: RsvpsState.eventId,
      search: RsvpsState.search,
      status: RsvpsState.status,
      sortBy: RsvpsState.sortBy,
      page: RsvpsState.page,
      limit: RsvpsState.limit
    });

    const res = await fetch(`/api/admin/rsvps?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${AuthState.token}` }
    });

    if (res.status === 401) {
      handleSessionExpired();
      return;
    }

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to load attendee records');

    RsvpsState.data = json.data || [];
    RsvpsState.total = json.total || 0;
    RsvpsState.totalPages = (json.pagination && json.pagination.totalPages) ? json.pagination.totalPages : 1;

    // 1. Update KPI Summary Cards
    const metrics = json.metrics || {};
    const valTotal = document.getElementById('rsvps-stat-total');
    const valToday = document.getElementById('rsvps-stat-today');
    const valChecked = document.getElementById('rsvps-stat-checkedin');
    const valEvents = document.getElementById('rsvps-stat-events');
    const totalBadge = document.getElementById('rsvps-table-total-badge');

    if (valTotal) valTotal.textContent = metrics.totalRsvps !== undefined ? metrics.totalRsvps : 0;
    if (valToday) valToday.textContent = metrics.rsvpsToday !== undefined ? metrics.rsvpsToday : 0;
    if (valChecked) valChecked.textContent = metrics.checkedInCount !== undefined ? metrics.checkedInCount : 0;
    if (valEvents) valEvents.textContent = metrics.eventsWithRegistrations !== undefined ? metrics.eventsWithRegistrations : 0;
    if (totalBadge) totalBadge.textContent = `${json.total} ATTENDEES`;

    // 2. Update Selected Event Capacity Banner
    const capTitle = document.getElementById('rsvps-capacity-title');
    const capRatio = document.getElementById('rsvps-capacity-ratio');
    const capBadge = document.getElementById('rsvps-capacity-badge');
    const capBar = document.getElementById('rsvps-capacity-bar');
    const capPercent = document.getElementById('rsvps-capacity-percent');
    const capRem = document.getElementById('rsvps-capacity-remaining');

    if (json.selectedEventCapacity) {
      const sec = json.selectedEventCapacity;
      if (capTitle) capTitle.textContent = `Event Capacity: ${sec.title}`;
      if (capRatio) capRatio.textContent = `${sec.claimedSeats} / ${sec.totalCapacity} Seats Claimed`;
      if (capBadge) {
        capBadge.textContent = sec.isSoldOut ? 'SOLD OUT' : (sec.capacityPercent >= 80 ? 'FILLING FAST' : 'SEATS OPEN');
        capBadge.className = sec.isSoldOut 
          ? 'text-[10px] px-2 py-0.5 bg-red-950/60 border border-red-500/50 text-red-300 font-bold'
          : 'text-[10px] px-2 py-0.5 bg-surface-container border border-surface-high font-bold text-primary';
      }
      if (capBar) capBar.style.width = `${Math.min(100, sec.capacityPercent)}%`;
      if (capPercent) capPercent.textContent = `${sec.capacityPercent}% booked`;
      if (capRem) capRem.textContent = `${sec.seatsRemaining} seats remaining`;
    } else {
      const activeTotal = metrics.totalRsvps || 0;
      if (capTitle) capTitle.textContent = 'Overall Capacity Telemetry (All Scheduled Events)';
      if (capRatio) capRatio.textContent = `${activeTotal} Total Registrations`;
      if (capBadge) {
        capBadge.textContent = 'LIVE SYNC';
        capBadge.className = 'text-[10px] px-2 py-0.5 bg-surface-container border border-surface-high font-bold text-primary';
      }
      if (capBar) capBar.style.width = activeTotal > 0 ? '75%' : '0%';
      if (capPercent) capPercent.textContent = `${metrics.eventsWithRegistrations || 0} active event registries`;
      if (capRem) capRem.textContent = 'Active reservation system';
    }

    // 3. Render Table & Mobile Cards
    renderRsvpsTable(RsvpsState.data);
    renderRsvpsMobileCards(RsvpsState.data);
    updateRsvpsPagination();

    if (RsvpsState.data.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      const emptyTitle = document.getElementById('rsvps-empty-title');
      const emptySub = document.getElementById('rsvps-empty-subtitle');
      if (emptyTitle && emptySub) {
        if (RsvpsState.search) {
          emptyTitle.textContent = 'No Attendees Match Search';
          emptySub.textContent = `No registrations found for query "${RsvpsState.search}".`;
        } else if (RsvpsState.eventId !== 'all') {
          emptyTitle.textContent = 'No Registrations for this Event';
          emptySub.textContent = 'No guests have registered for the selected event yet.';
        } else {
          emptyTitle.textContent = 'No Registrations Yet';
          emptySub.textContent = 'When attendees register on the public Resolution website, their passes will appear here.';
        }
      }
    } else {
      if (tableContainer) tableContainer.classList.remove('hidden');
      if (mobileContainer) mobileContainer.classList.remove('hidden');
    }

    if (isManual) showToast('RSVP registry and gate telemetry updated.', 'success');
  } catch (err) {
    console.error('Failed to load RSVPs:', err);
    showToast(err.message || 'Error communicating with RSVP service', 'error');
  } finally {
    if (refreshIcon) refreshIcon.classList.remove('animate-spin');
    if (skeleton) skeleton.classList.add('hidden');
  }
};

// 18.4 Render Desktop RSVP Table
function renderRsvpsTable(rsvps) {
  const tbody = document.getElementById('admin-rsvps-table-body');
  if (!tbody) return;

  if (rsvps.length === 0) {
    tbody.innerHTML = '';
    return;
  }

  tbody.innerHTML = rsvps.map(r => {
    const isCheckedIn = Boolean(r.isCheckedIn || r.status === 'checked_in');
    const isCancelled = r.status === 'cancelled';
    const isSuperAdmin = AuthState.user && AuthState.user.role === 'admin';

    // Status Badge
    let statusBadge = `<span class="px-2 py-0.5 bg-surface-container border border-surface-high text-[10px] text-primary font-bold">CONFIRMED</span>`;
    if (isCheckedIn) {
      statusBadge = `<span class="px-2 py-0.5 bg-green-950/60 border border-green-500/50 text-[10px] text-green-300 font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>CHECKED IN</span>`;
    } else if (isCancelled) {
      statusBadge = `<span class="px-2 py-0.5 bg-red-950/60 border border-red-500/50 text-[10px] text-red-300 font-bold">CANCELLED</span>`;
    }

    // Checkin Button
    let checkinAction = `
      <button 
        class="px-2.5 py-1 bg-surface-container hover:bg-surface-high text-on-surface border border-surface-high text-[10px] uppercase font-bold transition-all flex items-center gap-1 cursor-pointer mx-auto"
        onclick="toggleRsvpCheckIn('${r._id || r.id}')"
        type="button"
        title="Check in this attendee at the gate"
      >
        <span class="material-symbols-outlined text-[14px] text-outline">check_circle</span>
        <span>Check In</span>
      </button>
    `;
    if (isCheckedIn) {
      checkinAction = `
        <button 
          class="px-2.5 py-1 bg-green-950/60 hover:bg-green-900 border border-green-500/50 text-green-300 text-[10px] uppercase font-bold transition-all flex items-center gap-1 cursor-pointer mx-auto"
          onclick="toggleRsvpCheckIn('${r._id || r.id}')"
          type="button"
          title="Revoke check-in state"
        >
          <span class="material-symbols-outlined text-[14px] text-green-400">task_alt</span>
          <span>Checked In</span>
        </button>
      `;
    }

    const regDateStr = r.registeredAt ? new Date(r.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
    const regTimeStr = r.registeredAt ? new Date(r.registeredAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    return `
      <tr class="hover:bg-surface-container/40 transition-colors group">
        <!-- Pass ID & Copy Button -->
        <td class="p-3.5 align-middle">
          <div class="flex items-center gap-1.5">
            <span class="font-mono text-primary font-bold text-xs select-all">${escapeHTML(r.passId)}</span>
            <button 
              class="p-1 text-outline hover:text-primary transition-colors cursor-pointer rounded"
              onclick="copyPassId('${r.passId}', this)"
              type="button"
              title="Copy Pass ID to Clipboard"
            >
              <span class="material-symbols-outlined text-[14px]">content_copy</span>
            </button>
          </div>
          <span class="text-[9px] text-outline block pt-0.5">${regDateStr} ${regTimeStr}</span>
        </td>

        <!-- Attendee Info -->
        <td class="p-3.5 align-middle">
          <div class="font-bold text-on-surface text-xs">${escapeHTML(r.attendeeName)}</div>
          <div class="text-[11px] text-outline font-mono">${escapeHTML(r.email)}</div>
          ${r.phone ? `<div class="text-[10px] text-outline font-mono">${escapeHTML(r.phone)}</div>` : ''}
        </td>

        <!-- Event Info -->
        <td class="p-3.5 align-middle max-w-xs">
          <div class="font-bold text-on-surface text-xs truncate" title="${escapeHTML(r.eventTitle || 'Cinema Session')}">
            ${escapeHTML(r.eventTitle || 'Cinema Session')}
          </div>
          <div class="flex items-center gap-1.5 text-[10px] text-outline pt-0.5">
            <span class="text-primary font-bold uppercase">${escapeHTML(r.eventCategory || 'WORKSHOP')}</span>
            <span>&bull;</span>
            <span>${escapeHTML(r.eventDateDisplay || '')}</span>
          </div>
        </td>

        <!-- Gate Pass Status -->
        <td class="p-3.5 align-middle text-center">
          <span class="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 border border-surface-high">
            ${escapeHTML(r.gateStatus || 'ALL-ACCESS PASS')}
          </span>
          <div class="pt-1">${statusBadge}</div>
        </td>

        <!-- Gate Check-in Action -->
        <td class="p-3.5 align-middle text-center">
          ${checkinAction}
        </td>

        <!-- Actions -->
        <td class="p-3.5 align-middle text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button 
              class="p-1.5 bg-surface-container hover:bg-surface-high text-on-surface border border-surface-high hover:border-primary/50 text-[11px] font-bold transition-all cursor-pointer rounded-sm"
              onclick="openRsvpDetailsModal('${r._id || r.id}')"
              type="button"
              title="View Attendee Pass Details"
            >
              <span class="material-symbols-outlined text-[16px] text-primary">visibility</span>
            </button>

            <button 
              class="p-1.5 bg-surface-container hover:bg-red-950/40 text-on-surface-variant hover:text-red-400 border border-surface-high hover:border-red-500/50 text-[11px] font-bold transition-all cursor-pointer rounded-sm"
              onclick="openCancelRsvpModal('${r._id || r.id}', '${escapeHTML(r.attendeeName)}', '${r.passId}')"
              type="button"
              title="Cancel Registration / Delete Pass"
            >
              <span class="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 18.5 Render Mobile Touch Cards
function renderRsvpsMobileCards(rsvps) {
  const container = document.getElementById('admin-rsvps-mobile-cards');
  if (!container) return;

  if (rsvps.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = rsvps.map(r => {
    const isCheckedIn = Boolean(r.isCheckedIn || r.status === 'checked_in');
    const isCancelled = r.status === 'cancelled';
    const regDateStr = r.registeredAt ? new Date(r.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

    return `
      <div class="p-4 bg-surface-low border border-surface-high flex flex-col gap-3 camera-frame">
        <!-- Pass ID & Header -->
        <div class="flex items-center justify-between border-b border-surface-high/60 pb-2">
          <div class="flex items-center gap-1.5">
            <span class="font-mono text-primary font-bold text-xs select-all">${escapeHTML(r.passId)}</span>
            <button 
              class="p-1 text-outline hover:text-primary transition-colors cursor-pointer"
              onclick="copyPassId('${r.passId}', this)"
              type="button"
              title="Copy Pass ID"
            >
              <span class="material-symbols-outlined text-[14px]">content_copy</span>
            </button>
          </div>
          <span class="text-[9px] text-outline font-mono">${regDateStr}</span>
        </div>

        <!-- Attendee & Event Details -->
        <div class="space-y-1">
          <div class="font-bold text-on-surface text-sm">${escapeHTML(r.attendeeName)}</div>
          <div class="text-xs text-outline font-mono">${escapeHTML(r.email)}</div>
          <div class="text-xs text-primary font-bold pt-1">${escapeHTML(r.eventTitle || 'Cinema Session')}</div>
        </div>

        <!-- Gate Status & Actions -->
        <div class="flex items-center justify-between pt-2 border-t border-surface-high/60">
          <span class="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 border border-surface-high">
            ${escapeHTML(r.gateStatus || 'ALL-ACCESS PASS')}
          </span>

          <div class="flex items-center gap-2">
            <button 
              class="px-2.5 py-1 ${isCheckedIn ? 'bg-green-950/60 text-green-300 border-green-500/50' : 'bg-surface-container text-on-surface border-surface-high'} border text-[10px] uppercase font-bold transition-all flex items-center gap-1 cursor-pointer"
              onclick="toggleRsvpCheckIn('${r._id || r.id}')"
              type="button"
            >
              <span class="material-symbols-outlined text-[14px]">${isCheckedIn ? 'task_alt' : 'check_circle'}</span>
              <span>${isCheckedIn ? 'Checked In' : 'Check In'}</span>
            </button>

            <button 
              class="p-1.5 bg-surface-container hover:bg-surface-high text-primary border border-surface-high cursor-pointer"
              onclick="openRsvpDetailsModal('${r._id || r.id}')"
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">visibility</span>
            </button>

            <button 
              class="p-1.5 bg-surface-container hover:bg-red-950/40 text-red-400 border border-surface-high cursor-pointer"
              onclick="openCancelRsvpModal('${r._id || r.id}', '${escapeHTML(r.attendeeName)}', '${r.passId}')"
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 18.6 Update RSVP Pagination Bar
function updateRsvpsPagination() {
  const info = document.getElementById('rsvps-pagination-info');
  const pageCurrent = document.getElementById('rsvps-page-current');
  const prevBtn = document.getElementById('rsvps-page-prev');
  const nextBtn = document.getElementById('rsvps-page-next');
  const bar = document.getElementById('rsvps-pagination-bar');

  if (!bar) return;

  if (RsvpsState.total === 0) {
    bar.classList.add('hidden');
    return;
  }
  bar.classList.remove('hidden');

  const start = (RsvpsState.page - 1) * RsvpsState.limit + 1;
  const end = Math.min(RsvpsState.page * RsvpsState.limit, RsvpsState.total);

  if (info) info.textContent = `Showing ${start} to ${end} of ${RsvpsState.total} attendees`;
  if (pageCurrent) pageCurrent.textContent = RsvpsState.page;
  if (prevBtn) prevBtn.disabled = RsvpsState.page <= 1;
  if (nextBtn) nextBtn.disabled = RsvpsState.page >= RsvpsState.totalPages;
}

// 18.7 One-Click Copy Pass ID with Visual Feedback
window.copyPassId = function(passId, btnElement) {
  if (!passId) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(passId).then(() => {
      triggerCopyFeedback(btnElement);
      showToast(`Pass ID [${passId}] copied to clipboard!`, 'success');
    }).catch(() => fallbackCopyPassId(passId, btnElement));
  } else {
    fallbackCopyPassId(passId, btnElement);
  }
};

function fallbackCopyPassId(passId, btnElement) {
  const tempInput = document.createElement('input');
  tempInput.value = passId;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  triggerCopyFeedback(btnElement);
  showToast(`Pass ID [${passId}] copied to clipboard!`, 'success');
}

function triggerCopyFeedback(btnElement) {
  if (!btnElement) return;
  const icon = btnElement.querySelector('.material-symbols-outlined');
  if (icon) {
    const orig = icon.textContent;
    icon.textContent = 'check';
    icon.classList.add('text-green-400');
    setTimeout(() => {
      icon.textContent = orig;
      icon.classList.remove('text-green-400');
    }, 1500);
  }
}

// 18.8 Toggle RSVP Gate Check-In State
window.toggleRsvpCheckIn = async function(id) {
  if (!id) return;

  try {
    const res = await fetch(`/api/admin/rsvps/${id}/checkin`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AuthState.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401) {
      handleSessionExpired();
      return;
    }

    const data = await res.json();
    if (data.success) {
      showToast(data.message || 'Check-in state updated.', 'success');
      loadAdminRsvps();
      loadDashboardMetrics();
    } else {
      throw new Error(data.message || 'Failed to update check-in');
    }
  } catch (err) {
    console.error('Check-in error:', err);
    showToast(err.message || 'Network error updating check-in status', 'error');
  }
};

// 18.9 Attendee Details Modal
window.openRsvpDetailsModal = async function(id) {
  const modal = document.getElementById('rsvp-details-modal');
  if (!modal || !id) return;

  try {
    const res = await fetch(`/api/admin/rsvps/${id}`, {
      headers: { 'Authorization': `Bearer ${AuthState.token}` }
    });

    if (res.status === 401) {
      handleSessionExpired();
      return;
    }

    const json = await res.json();
    if (!json.success || !json.data) throw new Error(json.message || 'Attendee details unavailable');

    const r = json.data;
    RsvpsState.selectedRsvp = r;

    // Populate Modal Elements
    const passIdEl = document.getElementById('rsvp-detail-passid');
    const gateStatusEl = document.getElementById('rsvp-detail-gatestatus');
    const nameEl = document.getElementById('rsvp-detail-name');
    const emailEl = document.getElementById('rsvp-detail-email');
    const phoneEl = document.getElementById('rsvp-detail-phone');
    const regEl = document.getElementById('rsvp-detail-registered');
    const catEl = document.getElementById('rsvp-detail-category');
    const evTitleEl = document.getElementById('rsvp-detail-event-title');
    const evDateEl = document.getElementById('rsvp-detail-event-date');
    const evLocEl = document.getElementById('rsvp-detail-event-location');
    const evCapEl = document.getElementById('rsvp-detail-event-capacity');
    const checkinStatusEl = document.getElementById('rsvp-detail-checkin-status');
    const checkinTimeEl = document.getElementById('rsvp-detail-checkin-time');

    if (passIdEl) passIdEl.textContent = r.passId || 'RES-PASS-000000';
    if (gateStatusEl) gateStatusEl.textContent = r.gateStatus || 'ALL-ACCESS PASS';
    if (nameEl) nameEl.textContent = r.attendeeName || '—';
    if (emailEl) emailEl.textContent = r.email || '—';
    if (phoneEl) phoneEl.textContent = r.phone || 'Not Provided';
    if (regEl) regEl.textContent = r.registeredAt ? new Date(r.registeredAt).toLocaleString('en-US') : '—';
    if (catEl) catEl.textContent = (r.eventCategory || 'WORKSHOP').toUpperCase();
    if (evTitleEl) evTitleEl.textContent = r.eventTitle || 'Resolution Encounter';
    if (evDateEl) evDateEl.textContent = r.eventDateDisplay || 'Scheduled Session';
    if (evLocEl) evLocEl.textContent = r.eventLocation || 'Studio Theater C';
    if (evCapEl) evCapEl.textContent = `${r.eventTotalCapacity || 30} Total Seats Allocated`;

    const isCheckedIn = Boolean(r.isCheckedIn || r.status === 'checked_in');
    if (checkinStatusEl) {
      checkinStatusEl.innerHTML = isCheckedIn
        ? `<span class="w-2.5 h-2.5 rounded-full bg-green-400"></span><span class="font-bold text-xs text-green-300">Checked In &amp; Admitted</span>`
        : `<span class="w-2.5 h-2.5 rounded-full bg-yellow-400"></span><span class="font-bold text-xs text-on-surface">Awaiting Gate Arrival</span>`;
    }
    if (checkinTimeEl) {
      checkinTimeEl.textContent = isCheckedIn && r.checkInTime 
        ? `Admitted at ${new Date(r.checkInTime).toLocaleTimeString('en-US')} on ${new Date(r.checkInTime).toLocaleDateString('en-US')}`
        : 'No gate entry recorded yet.';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } catch (err) {
    console.error('Details error:', err);
    showToast(err.message || 'Error loading attendee profile', 'error');
  }
};

window.closeRsvpDetailsModal = function() {
  const modal = document.getElementById('rsvp-details-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  RsvpsState.selectedRsvp = null;
};

window.copyPassIdFromDetail = function() {
  if (RsvpsState.selectedRsvp && RsvpsState.selectedRsvp.passId) {
    const btn = document.getElementById('rsvp-detail-copy-btn');
    copyPassId(RsvpsState.selectedRsvp.passId, btn);
  }
};

window.toggleCheckInFromDetail = async function() {
  if (RsvpsState.selectedRsvp) {
    const id = RsvpsState.selectedRsvp._id || RsvpsState.selectedRsvp.id;
    await toggleRsvpCheckIn(id);
    await openRsvpDetailsModal(id);
  }
};

// 18.10 Cancel / Delete RSVP Modal
window.openCancelRsvpModal = function(id, name, passId) {
  const modal = document.getElementById('rsvp-cancel-modal');
  if (!modal) return;

  RsvpsState.cancelTargetId = id;
  RsvpsState.cancelTargetName = name;
  RsvpsState.cancelTargetPass = passId;

  const nameEl = document.getElementById('rsvp-cancel-name-display');
  const passEl = document.getElementById('rsvp-cancel-pass-display');

  if (nameEl) nameEl.textContent = name || 'Attendee';
  if (passEl) passEl.textContent = passId || 'RES-PASS-XXXXXX';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeCancelRsvpModal = function() {
  const modal = document.getElementById('rsvp-cancel-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  RsvpsState.cancelTargetId = null;
};

window.openCancelRsvpFromDetail = function() {
  if (RsvpsState.selectedRsvp) {
    const r = RsvpsState.selectedRsvp;
    closeRsvpDetailsModal();
    openCancelRsvpModal(r._id || r.id, r.attendeeName, r.passId);
  }
};

window.executeCancelRsvp = async function() {
  const btn = document.getElementById('confirm-cancel-rsvp-btn');
  if (!RsvpsState.cancelTargetId) return;

  if (btn) btn.disabled = true;

  try {
    const res = await fetch(`/api/admin/rsvps/${RsvpsState.cancelTargetId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AuthState.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'cancelled' })
    });

    if (res.status === 401) {
      handleSessionExpired();
      return;
    }

    const data = await res.json();
    if (data.success) {
      showToast(`Registration pass [${RsvpsState.cancelTargetPass}] for ${RsvpsState.cancelTargetName} cancelled. Seat capacity restored.`, 'success');
      closeCancelRsvpModal();
      loadAdminRsvps();
      loadDashboardMetrics();
    } else {
      throw new Error(data.message || 'Cancellation failed');
    }
  } catch (err) {
    console.error('Cancel error:', err);
    showToast(err.message || 'Error cancelling registration', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
};

// 18.11 Export RSVPs to Sanitized CSV
window.exportRsvpsCsv = async function() {
  try {
    showToast('Preparing attendee CSV export...', 'info');
    const params = new URLSearchParams({
      eventId: RsvpsState.eventId,
      search: RsvpsState.search,
      status: RsvpsState.status
    });

    const res = await fetch(`/api/admin/rsvps/export/csv?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${AuthState.token}` }
    });

    if (res.status === 401) {
      handleSessionExpired();
      return;
    }

    if (!res.ok) throw new Error('Failed to generate attendee CSV file');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resolution-rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showToast('Attendee CSV export downloaded successfully.', 'success');
  } catch (err) {
    console.error('CSV Export Error:', err);
    showToast(err.message || 'Error downloading CSV report', 'error');
  }
};

// 18.12 Print-Friendly Attendee List
window.printRsvpsList = function() {
  window.print();
};

// =========================================================================
// 19. STEP 6: TEAM MANAGEMENT CMS & CONTROLLER
// =========================================================================

// Centralized Team State
const TeamState = {
  items: [],
  total: 0,
  page: 1,
  limit: 25,
  search: '',
  discipline: '',
  academicYear: '',
  status: 'all',
  sort: 'order-asc',
  metrics: { all: 0, active: 0, draft: 0, archived: 0, leadership: 0 },
  dirtyForm: false,
  portraitUrl: '',
  deleteTargetId: null,
  deleteTargetName: '',
  reorderItems: [],
  searchDebounceTimer: null
};

// 19.1 Load Team Members from Backend REST API
window.loadAdminTeam = async function(isManual = false) {
  const tableBody = document.getElementById('team-table-body');
  const mobileContainer = document.getElementById('team-mobile-cards-container');
  const skeleton = document.getElementById('team-loading-skeleton');
  const tableContainer = document.getElementById('team-table-container');
  const emptyState = document.getElementById('team-empty-state');
  const refreshIcon = document.getElementById('team-refresh-icon');

  if (refreshIcon) refreshIcon.classList.add('animate-spin');
  if (skeleton) skeleton.classList.remove('hidden');
  if (tableContainer) tableContainer.classList.add('hidden');
  if (mobileContainer) mobileContainer.classList.add('hidden');
  if (emptyState) emptyState.classList.add('hidden');

  try {
    const params = new URLSearchParams({
      page: TeamState.page,
      limit: TeamState.limit,
      search: TeamState.search,
      discipline: TeamState.discipline,
      academicYear: TeamState.academicYear,
      status: TeamState.status,
      sort: TeamState.sort
    });

    const res = await apiFetch(`/api/admin/team?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch team roster`);

    const json = await res.json();
    const data = json.data || [];
    const pagination = json.pagination || { total: data.length, page: 1, limit: TeamState.limit, totalPages: 1 };
    const counts = json.counts || { all: data.length, active: data.length, draft: 0, archived: 0, leadership: 0 };

    TeamState.items = data;
    TeamState.total = pagination.total;
    TeamState.metrics = counts;

    // Update KPI & Tab Counts
    updateTeamStatusBadges(counts);

    // Update Pagination UI
    updateTeamPaginationUI(pagination.total, pagination.page, pagination.limit);

    if (data.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (tableContainer) tableContainer.classList.remove('hidden');
      if (mobileContainer) mobileContainer.classList.remove('hidden');
      renderTeamTable(data);
      renderTeamMobileCards(data);
    }

    if (isManual) {
      showToast('Team roster synchronized with database.', 'success');
    }

  } catch (err) {
    console.error('Failed to load admin team roster:', err);
    showToast(err.message || 'Error loading team data.', 'error');
    if (emptyState) emptyState.classList.remove('hidden');
  } finally {
    if (skeleton) skeleton.classList.add('hidden');
    if (refreshIcon) refreshIcon.classList.remove('animate-spin');
  }
};

// 19.2 Update KPI Metrics & Status Tab Badges
function updateTeamStatusBadges(counts) {
  const statTotal = document.getElementById('team-stat-total');
  const statActive = document.getElementById('team-stat-active');
  const statLeadership = document.getElementById('team-stat-leadership');
  const statArchived = document.getElementById('team-stat-archived');

  const countAll = document.getElementById('team-count-all');
  const countActive = document.getElementById('team-count-active');
  const countLeadership = document.getElementById('team-count-leadership');
  const countDraft = document.getElementById('team-count-draft');
  const countArchived = document.getElementById('team-count-archived');

  if (statTotal) statTotal.textContent = counts.all || 0;
  if (statActive) statActive.textContent = counts.active || 0;
  if (statLeadership) statLeadership.textContent = counts.leadership || 0;
  if (statArchived) statArchived.textContent = (counts.draft || 0) + (counts.archived || 0);

  if (countAll) countAll.textContent = counts.all || 0;
  if (countActive) countActive.textContent = counts.active || 0;
  if (countLeadership) countLeadership.textContent = counts.leadership || 0;
  if (countDraft) countDraft.textContent = counts.draft || 0;
  if (countArchived) countArchived.textContent = counts.archived || 0;
}

// 19.3 Render Desktop Team Table Rows
function renderTeamTable(members) {
  const tbody = document.getElementById('team-table-body');
  if (!tbody) return;

  const isSuper = AuthState.user && AuthState.user.role === 'admin';

  tbody.innerHTML = members.map(m => {
    const id = m._id || m.id;
    const isArchived = Boolean(m.isArchived || m.status === 'archived');
    const isDraft = m.status === 'draft';
    const isHead = Boolean(m.isHeadOfDiscipline);
    const portrait = m.portraitUrl || m.image || '/assets/images/placeholder-portrait.jpg';
    const code = m.disciplineCode || (m.discipline ? m.discipline.substring(0, 3).toUpperCase() : 'CREW');

    let statusBadge = '<span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-green-950/40 text-green-300 border border-green-500/30">ACTIVE</span>';
    if (isArchived) {
      statusBadge = '<span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">ARCHIVED</span>';
    } else if (isDraft) {
      statusBadge = '<span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-yellow-950/40 text-yellow-300 border border-yellow-500/30">DRAFT</span>';
    }

    const headBadge = isHead 
      ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/30"><span class="material-symbols-outlined text-[12px]">star</span> HEAD</span>'
      : '<span class="text-outline text-[11px] font-mono">&mdash;</span>';

    return `
      <tr class="hover:bg-surface-container/50 transition-colors group">
        <!-- Order -->
        <td class="py-3 px-4 text-center font-mono text-primary font-bold">
          ${m.order || 0}
        </td>

        <!-- Member & Role -->
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-13 aspect-[3/4] bg-surface-container overflow-hidden border border-surface-high flex-shrink-0 relative">
              <img src="${escapeHTML(portrait)}" alt="${escapeHTML(m.name)}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" onerror="this.src='/assets/images/placeholder-portrait.jpg'"/>
            </div>
            <div class="min-w-0">
              <div class="font-bold text-on-surface uppercase tracking-wide flex items-center gap-1.5">
                <span class="truncate">${escapeHTML(m.name)}</span>
              </div>
              <div class="text-[11px] text-primary font-medium truncate">${escapeHTML(m.role || '')}</div>
              <div class="text-[10px] text-outline font-mono truncate">${escapeHTML(m.handle || '')}</div>
            </div>
          </div>
        </td>

        <!-- Discipline & Code -->
        <td class="py-3 px-4">
          <span class="inline-block px-2 py-0.5 bg-surface-container border border-surface-high font-mono text-[11px] text-on-surface font-bold">
            ${escapeHTML(code)}
          </span>
          <span class="block text-[10px] text-outline uppercase mt-0.5">${escapeHTML(m.discipline || 'General')}</span>
        </td>

        <!-- Academic Year -->
        <td class="py-3 px-4 font-mono text-on-surface-variant">
          ${escapeHTML(m.academicYear || 'Member')}
        </td>

        <!-- Leadership / Head -->
        <td class="py-3 px-4 text-center">
          ${headBadge}
        </td>

        <!-- Status -->
        <td class="py-3 px-4 text-center">
          ${statusBadge}
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <!-- Preview -->
            <button 
              type="button" 
              class="p-1.5 text-outline hover:text-primary hover:bg-surface-container border border-transparent hover:border-surface-high transition-colors cursor-pointer"
              onclick="openTeamPreviewModal('${id}')"
              title="Preview Public Card"
            >
              <span class="material-symbols-outlined text-[16px]">visibility</span>
            </button>

            <!-- Edit -->
            <button 
              type="button" 
              class="p-1.5 text-outline hover:text-primary hover:bg-surface-container border border-transparent hover:border-surface-high transition-colors cursor-pointer"
              onclick="openEditTeamModal('${id}')"
              title="Edit Member Details"
            >
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>

            <!-- Toggle Archive -->
            <button 
              type="button" 
              class="p-1.5 text-outline hover:text-yellow-400 hover:bg-surface-container border border-transparent hover:border-surface-high transition-colors cursor-pointer"
              onclick="toggleArchiveTeamMember('${id}', ${isArchived})"
              title="${isArchived ? 'Restore to Active' : 'Archive Member'}"
            >
              <span class="material-symbols-outlined text-[16px]">${isArchived ? 'unarchive' : 'archive'}</span>
            </button>

            <!-- Delete (Visible to all, Super Admin enforced on backend) -->
            <button 
              type="button" 
              class="p-1.5 ${isSuper ? 'text-outline hover:text-red-400' : 'text-outline/40 hover:text-red-400'} hover:bg-surface-container border border-transparent hover:border-surface-high transition-colors cursor-pointer"
              onclick="openDeleteTeamModal('${id}', '${escapeHTML(m.name)}')"
              title="${isSuper ? 'Delete Member Permanently' : 'Permanent Delete (Admin Only)'}"
            >
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 19.4 Render Mobile Responsive Cards
function renderTeamMobileCards(members) {
  const container = document.getElementById('team-mobile-cards-container');
  if (!container) return;

  const isSuper = AuthState.user && AuthState.user.role === 'admin';

  container.innerHTML = members.map(m => {
    const id = m._id || m.id;
    const isArchived = Boolean(m.isArchived || m.status === 'archived');
    const isDraft = m.status === 'draft';
    const isHead = Boolean(m.isHeadOfDiscipline);
    const portrait = m.portraitUrl || m.image || '/assets/images/placeholder-portrait.jpg';
    const code = m.disciplineCode || (m.discipline ? m.discipline.substring(0, 3).toUpperCase() : 'CREW');

    let statusBadge = '<span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-green-950/40 text-green-300 border border-green-500/30">ACTIVE</span>';
    if (isArchived) {
      statusBadge = '<span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">ARCHIVED</span>';
    } else if (isDraft) {
      statusBadge = '<span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-yellow-950/40 text-yellow-300 border border-yellow-500/30">DRAFT</span>';
    }

    return `
      <div class="p-4 bg-surface-low border border-surface-high space-y-3">
        <div class="flex items-start gap-3">
          <div class="w-14 aspect-[3/4] bg-surface-container overflow-hidden border border-surface-high flex-shrink-0 relative">
            <img src="${escapeHTML(portrait)}" alt="${escapeHTML(m.name)}" class="w-full h-full object-cover grayscale" onerror="this.src='/assets/images/placeholder-portrait.jpg'"/>
            <div class="absolute bottom-0.5 left-0.5 bg-black/80 px-1 font-mono text-[8px] text-primary">${escapeHTML(code)}</div>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-primary text-xs font-bold">#${m.order || 0}</span>
              ${statusBadge}
            </div>
            <h4 class="font-bold text-sm text-on-surface uppercase tracking-wide truncate mt-0.5">${escapeHTML(m.name)}</h4>
            <p class="text-xs text-primary font-medium truncate">${escapeHTML(m.role || '')}</p>
            <p class="text-[11px] text-outline font-mono truncate">${escapeHTML(m.handle || '')}</p>
          </div>
        </div>

        <div class="flex items-center justify-between text-[11px] text-outline border-t border-surface-high/60 pt-2 font-mono">
          <span>${escapeHTML(m.discipline || 'General')} &bull; ${escapeHTML(m.academicYear || '')}</span>
          ${isHead ? '<span class="text-yellow-400 font-bold flex items-center gap-0.5"><span class="material-symbols-outlined text-[14px]">star</span> LEAD</span>' : ''}
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-surface-high/60 pt-2">
          <button 
            type="button" 
            class="px-2.5 py-1 bg-surface-container text-xs text-outline hover:text-primary flex items-center gap-1 border border-surface-high"
            onclick="openTeamPreviewModal('${id}')"
          >
            <span class="material-symbols-outlined text-[14px]">visibility</span>
            <span>Preview</span>
          </button>

          <button 
            type="button" 
            class="px-2.5 py-1 bg-surface-container text-xs text-outline hover:text-primary flex items-center gap-1 border border-surface-high"
            onclick="openEditTeamModal('${id}')"
          >
            <span class="material-symbols-outlined text-[14px]">edit</span>
            <span>Edit</span>
          </button>

          <button 
            type="button" 
            class="px-2.5 py-1 bg-surface-container text-xs text-outline hover:text-yellow-400 flex items-center gap-1 border border-surface-high"
            onclick="toggleArchiveTeamMember('${id}', ${isArchived})"
          >
            <span class="material-symbols-outlined text-[14px]">${isArchived ? 'unarchive' : 'archive'}</span>
            <span>${isArchived ? 'Restore' : 'Archive'}</span>
          </button>

          <button 
            type="button" 
            class="px-2.5 py-1 bg-surface-container text-xs text-outline hover:text-red-400 flex items-center gap-1 border border-surface-high"
            onclick="openDeleteTeamModal('${id}', '${escapeHTML(m.name)}')"
          >
            <span class="material-symbols-outlined text-[14px]">delete</span>
            <span>Delete</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// 19.5 Pagination UI Helpers
function updateTeamPaginationUI(total, page, limit) {
  const info = document.getElementById('team-pagination-info');
  const prevBtn = document.getElementById('team-page-prev');
  const nextBtn = document.getElementById('team-page-next');
  const curPage = document.getElementById('team-page-current');

  const totalPages = Math.ceil(total / limit) || 1;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (info) info.textContent = `Showing ${start} to ${end} of ${total} crew members`;
  if (curPage) curPage.textContent = page;
  if (prevBtn) prevBtn.disabled = page <= 1;
  if (nextBtn) nextBtn.disabled = page >= totalPages;
}

window.changeTeamPage = function(delta) {
  const newPage = TeamState.page + delta;
  if (newPage < 1) return;
  TeamState.page = newPage;
  loadAdminTeam();
};

// 19.6 Filter & Search Handlers
window.setTeamStatusFilter = function(filter) {
  TeamState.status = filter;
  TeamState.page = 1;

  const tabButtons = document.querySelectorAll('#team-status-tabs button');
  tabButtons.forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.className = 'px-3 py-1.5 text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer bg-primary text-black';
    } else {
      btn.className = 'px-3 py-1.5 text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer bg-surface-container text-on-surface hover:bg-surface-high';
    }
  });

  loadAdminTeam();
};

window.handleTeamFilterChange = function() {
  const discFilter = document.getElementById('team-discipline-filter');
  const yearFilter = document.getElementById('team-year-filter');
  const sortSelect = document.getElementById('team-sort-select');

  if (discFilter) TeamState.discipline = discFilter.value;
  if (yearFilter) TeamState.academicYear = yearFilter.value;
  if (sortSelect) TeamState.sort = sortSelect.value;

  TeamState.page = 1;
  loadAdminTeam();
};

window.handleTeamSearchInput = function(event) {
  const val = event.target.value.trim();
  const clearBtn = document.getElementById('clear-team-search-btn');

  if (clearBtn) {
    clearBtn.classList.toggle('hidden', val.length === 0);
  }

  clearTimeout(TeamState.searchDebounceTimer);
  TeamState.searchDebounceTimer = setTimeout(() => {
    TeamState.search = val;
    TeamState.page = 1;
    loadAdminTeam();
  }, 300);
};

window.clearTeamSearch = function() {
  const searchInput = document.getElementById('team-search-input');
  const clearBtn = document.getElementById('clear-team-search-btn');
  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  TeamState.search = '';
  TeamState.page = 1;
  loadAdminTeam();
};

window.clearAllTeamFilters = function() {
  const searchInput = document.getElementById('team-search-input');
  const clearBtn = document.getElementById('clear-team-search-btn');
  const discFilter = document.getElementById('team-discipline-filter');
  const yearFilter = document.getElementById('team-year-filter');
  const sortSelect = document.getElementById('team-sort-select');

  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  if (discFilter) discFilter.value = '';
  if (yearFilter) yearFilter.value = '';
  if (sortSelect) sortSelect.value = 'order-asc';

  TeamState.search = '';
  TeamState.discipline = '';
  TeamState.academicYear = '';
  TeamState.sort = 'order-asc';
  TeamState.status = 'all';
  TeamState.page = 1;

  setTeamStatusFilter('all');
};

// 19.7 Modal Form Open / Close Handlers
window.openCreateTeamModal = function() {
  const modal = document.getElementById('team-form-modal');
  const form = document.getElementById('team-form');
  const title = document.getElementById('team-modal-title');
  const submitLabel = document.getElementById('team-submit-label');
  const nextOrder = TeamState.total + 1;

  if (!modal || !form) return;

  form.reset();
  document.getElementById('team-form-id').value = '';
  document.getElementById('team-form-order').value = nextOrder;
  document.getElementById('team-form-discipline').value = 'direction';
  document.getElementById('team-form-discipline-code').value = 'DIR • 01';
  document.getElementById('team-form-academic-year').value = 'Final Year';
  document.getElementById('team-form-status').value = 'active';
  document.getElementById('team-form-is-head').checked = false;
  document.getElementById('team-form-portrait-url').value = '';

  clearTeamPhotoPreview();
  TeamState.dirtyForm = false;

  if (title) title.textContent = 'Add Team Member';
  if (submitLabel) submitLabel.textContent = 'Save Member';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.openEditTeamModal = async function(id) {
  const modal = document.getElementById('team-form-modal');
  const title = document.getElementById('team-modal-title');
  const submitLabel = document.getElementById('team-submit-label');

  if (!modal) return;

  try {
    const res = await apiFetch(`/api/admin/team/${id}`);
    if (!res.ok) throw new Error('Failed to fetch member details');

    const json = await res.json();
    const m = json.data;

    document.getElementById('team-form-id').value = m._id || m.id;
    document.getElementById('team-form-name').value = m.name || '';
    document.getElementById('team-form-role').value = m.role || '';
    document.getElementById('team-form-handle').value = m.handle || '';
    document.getElementById('team-form-discipline').value = m.discipline || 'direction';
    document.getElementById('team-form-discipline-code').value = m.disciplineCode || '';
    document.getElementById('team-form-academic-year').value = m.academicYear || 'Final Year';
    document.getElementById('team-form-order').value = m.order || 1;
    document.getElementById('team-form-status').value = m.status || (m.isArchived ? 'archived' : 'active');
    document.getElementById('team-form-is-head').checked = Boolean(m.isHeadOfDiscipline);
    document.getElementById('team-form-bio').value = m.bio || '';
    document.getElementById('team-form-portrait-url').value = m.portraitUrl || m.image || '';

    const img = m.portraitUrl || m.image;
    if (img) {
      setTeamPhotoPreviewUI(img, m.disciplineCode || 'DIR • 01');
    } else {
      clearTeamPhotoPreview();
    }

    TeamState.dirtyForm = false;

    if (title) title.textContent = `Edit Member: ${m.name}`;
    if (submitLabel) submitLabel.textContent = 'Save Changes';

    modal.classList.remove('hidden');
    modal.classList.add('flex');

  } catch (err) {
    console.error('Failed to open edit modal:', err);
    showToast(err.message || 'Error loading member for edit', 'error');
  }
};

window.handleCloseTeamForm = function() {
  if (TeamState.dirtyForm) {
    const unsavedModal = document.getElementById('team-unsaved-modal');
    if (unsavedModal) {
      unsavedModal.classList.remove('hidden');
      unsavedModal.classList.add('flex');
    }
  } else {
    closeTeamFormModal();
  }
};

window.closeTeamFormModal = function() {
  const modal = document.getElementById('team-form-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  TeamState.dirtyForm = false;
};

window.markTeamFormDirty = function() {
  TeamState.dirtyForm = true;
};

window.confirmDiscardTeamChanges = function() {
  closeTeamUnsavedModal();
  closeTeamFormModal();
};

window.closeTeamUnsavedModal = function() {
  const modal = document.getElementById('team-unsaved-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// 19.8 Discipline Code Auto-Suggester
window.handleTeamDisciplineChange = function() {
  const disc = document.getElementById('team-form-discipline').value;
  const codeInput = document.getElementById('team-form-discipline-code');
  const previewBadge = document.getElementById('team-preview-discipline-badge');

  const mapping = {
    direction: 'DIR • 01',
    cinematography: 'CINE • 01',
    sound: 'SND • 01',
    photo: 'FOTO • 01',
    design: 'DSGN • 01',
    production: 'PROD • 01',
    general: 'GEN • 01'
  };

  const suggested = mapping[disc] || 'CREW';
  if (codeInput && (!codeInput.value || codeInput.value.includes('•'))) {
    codeInput.value = suggested;
  }
  if (previewBadge) {
    previewBadge.textContent = codeInput.value || suggested;
  }
  markTeamFormDirty();
};

// 19.9 Portrait Image Upload & Preview Controller
window.handleTeamFileInputChange = async function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast('Image file size exceeds maximum limit of 5MB.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  const dropZone = document.getElementById('team-drop-zone');
  const uploadIcon = document.getElementById('team-upload-icon');
  if (uploadIcon) uploadIcon.textContent = 'hourglass_top';

  try {
    showToast('Uploading portrait to Resolution CDN...', 'info');
    const res = await fetch('/api/admin/team/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${AuthState.token}` },
      body: formData
    });

    if (res.status === 401) {
      handleSessionExpired();
      return;
    }

    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.message || 'Upload failed');

    const imageUrl = data.url;
    document.getElementById('team-form-portrait-url').value = imageUrl;
    const code = document.getElementById('team-form-discipline-code').value || 'DIR • 01';
    setTeamPhotoPreviewUI(imageUrl, code);
    markTeamFormDirty();
    showToast('Portrait image uploaded successfully.', 'success');

  } catch (err) {
    console.error('Portrait upload failed:', err);
    showToast(err.message || 'Error uploading portrait.', 'error');
  } finally {
    if (uploadIcon) uploadIcon.textContent = 'cloud_upload';
  }
};

window.handleTeamUrlDirectInput = function(event) {
  const url = event.target.value.trim();
  const code = document.getElementById('team-form-discipline-code').value || 'DIR • 01';
  if (url) {
    setTeamPhotoPreviewUI(url, code);
  } else {
    clearTeamPhotoPreview();
  }
  markTeamFormDirty();
};

function setTeamPhotoPreviewUI(url, code) {
  const previewImg = document.getElementById('team-image-preview');
  const placeholder = document.getElementById('team-image-preview-placeholder');
  const clearBtn = document.getElementById('team-url-clear-btn');
  const previewBadge = document.getElementById('team-preview-discipline-badge');

  if (previewImg) {
    previewImg.src = url;
    previewImg.classList.remove('hidden');
  }
  if (placeholder) placeholder.classList.add('hidden');
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (previewBadge) previewBadge.textContent = code || 'DIR • 01';
  TeamState.portraitUrl = url;
}

window.clearTeamPhotoPreview = function() {
  const previewImg = document.getElementById('team-image-preview');
  const placeholder = document.getElementById('team-image-preview-placeholder');
  const clearBtn = document.getElementById('team-url-clear-btn');
  const urlInput = document.getElementById('team-form-portrait-url');
  const fileInput = document.getElementById('team-form-file-input');

  if (previewImg) {
    previewImg.src = '';
    previewImg.classList.add('hidden');
  }
  if (placeholder) placeholder.classList.remove('hidden');
  if (clearBtn) clearBtn.classList.add('hidden');
  if (urlInput) urlInput.value = '';
  if (fileInput) fileInput.value = '';
  TeamState.portraitUrl = '';
};

// 19.10 Form Submission (Create or Update)
window.handleTeamFormSubmit = async function(event) {
  event.preventDefault();

  const id = document.getElementById('team-form-id').value;
  const name = document.getElementById('team-form-name').value.trim();
  const role = document.getElementById('team-form-role').value.trim();
  const handle = document.getElementById('team-form-handle').value.trim();
  const discipline = document.getElementById('team-form-discipline').value;
  const disciplineCode = document.getElementById('team-form-discipline-code').value.trim();
  const academicYear = document.getElementById('team-form-academic-year').value;
  const order = parseInt(document.getElementById('team-form-order').value, 10) || 1;
  const status = document.getElementById('team-form-status').value;
  const isHeadOfDiscipline = document.getElementById('team-form-is-head').checked;
  const bio = document.getElementById('team-form-bio').value.trim();
  const portraitUrl = document.getElementById('team-form-portrait-url').value.trim();

  if (!name || !role) {
    showToast('Please provide both Full Name and Role Title.', 'error');
    return;
  }

  const payload = {
    name,
    role,
    handle,
    discipline,
    disciplineCode: disciplineCode || (discipline.substring(0, 3).toUpperCase() + ' • 01'),
    academicYear,
    order,
    status,
    isHeadOfDiscipline,
    bio,
    portraitUrl: portraitUrl || '/assets/images/placeholder-portrait.jpg',
    image: portraitUrl || '/assets/images/placeholder-portrait.jpg'
  };

  const submitBtn = document.getElementById('team-form-submit-btn');
  const submitIcon = document.getElementById('team-submit-icon');
  const submitLabel = document.getElementById('team-submit-label');

  if (submitBtn) submitBtn.disabled = true;
  if (submitIcon) submitIcon.textContent = 'hourglass_top';

  try {
    const isEdit = Boolean(id);
    const endpoint = isEdit ? `/api/admin/team/${id}` : '/api/admin/team';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await apiFetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Operation failed');

    showToast(isEdit ? `Member "${name}" updated successfully.` : `Member "${name}" created successfully.`, 'success');
    closeTeamFormModal();
    loadAdminTeam();
    loadDashboardMetrics();

  } catch (err) {
    console.error('Failed to save team member:', err);
    showToast(err.message || 'Error saving team member.', 'error');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    if (submitIcon) submitIcon.textContent = 'save';
    if (submitLabel) submitLabel.textContent = 'Save Member';
  }
};

// 19.11 Toggle Archive / Active Status
window.toggleArchiveTeamMember = async function(id, isCurrentlyArchived) {
  try {
    const newArchived = !isCurrentlyArchived;
    const actionLabel = newArchived ? 'archived' : 'restored to active';

    const res = await apiFetch(`/api/admin/team/${id}/archive`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isArchived: newArchived })
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Archive update failed');

    showToast(`Member has been ${actionLabel}.`, 'success');
    loadAdminTeam();
    loadDashboardMetrics();

  } catch (err) {
    console.error('Failed to toggle archive state:', err);
    showToast(err.message || 'Error updating archive state.', 'error');
  }
};

// 19.12 Public Card Preview Modal Controller
window.openTeamPreviewModal = function(id) {
  const member = TeamState.items.find(m => (m._id || m.id) === id);
  if (!member) return;

  const modal = document.getElementById('team-preview-modal');
  const nameEl = document.getElementById('team-preview-card-name');
  const roleEl = document.getElementById('team-preview-card-role');
  const handleEl = document.getElementById('team-preview-card-handle');
  const badgeEl = document.getElementById('team-preview-card-badge');
  const bioEl = document.getElementById('team-preview-card-bio');
  const imgEl = document.getElementById('team-preview-card-img');

  const portrait = member.portraitUrl || member.image || '/assets/images/placeholder-portrait.jpg';
  const code = member.disciplineCode || (member.discipline ? member.discipline.substring(0, 3).toUpperCase() + ' • 01' : 'DIR • 01');

  if (nameEl) nameEl.textContent = member.name || 'MEMBER';
  if (roleEl) roleEl.textContent = member.role || 'ROLE';
  if (handleEl) handleEl.textContent = member.handle || '@resolution';
  if (badgeEl) badgeEl.textContent = code;
  if (bioEl) bioEl.textContent = member.bio || 'Curatorial member of Resolution.';
  if (imgEl) imgEl.style.backgroundImage = `url('${portrait}')`;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.previewCurrentTeamForm = function() {
  const name = document.getElementById('team-form-name').value || 'MEMBER NAME';
  const role = document.getElementById('team-form-role').value || 'ROLE TITLE';
  const handle = document.getElementById('team-form-handle').value || '@handle';
  const code = document.getElementById('team-form-discipline-code').value || 'DIR • 01';
  const bio = document.getElementById('team-form-bio').value || 'Curatorial statement...';
  const portrait = document.getElementById('team-form-portrait-url').value || '/assets/images/placeholder-portrait.jpg';

  const modal = document.getElementById('team-preview-modal');
  const nameEl = document.getElementById('team-preview-card-name');
  const roleEl = document.getElementById('team-preview-card-role');
  const handleEl = document.getElementById('team-preview-card-handle');
  const badgeEl = document.getElementById('team-preview-card-badge');
  const bioEl = document.getElementById('team-preview-card-bio');
  const imgEl = document.getElementById('team-preview-card-img');

  if (nameEl) nameEl.textContent = name;
  if (roleEl) roleEl.textContent = role;
  if (handleEl) handleEl.textContent = handle;
  if (badgeEl) badgeEl.textContent = code;
  if (bioEl) bioEl.textContent = bio;
  if (imgEl) imgEl.style.backgroundImage = `url('${portrait}')`;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeTeamPreviewModal = function() {
  const modal = document.getElementById('team-preview-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// 19.13 Interactive Team Reordering Workspace
window.openTeamReorderModal = async function() {
  const modal = document.getElementById('team-reorder-modal');
  if (!modal) return;

  try {
    // Fetch all active/ordered team members for reordering
    const res = await apiFetch('/api/admin/team?limit=100&sort=order-asc');
    const json = await res.json();
    TeamState.reorderItems = (json.data || []).map((m, idx) => ({
      id: m._id || m.id,
      name: m.name,
      role: m.role,
      disciplineCode: m.disciplineCode || 'DIR • 01',
      order: m.order || (idx + 1)
    }));

    renderTeamReorderList();
    modal.classList.remove('hidden');
    modal.classList.add('flex');

  } catch (err) {
    console.error('Failed to load team for reordering:', err);
    showToast('Failed to open reordering workspace.', 'error');
  }
};

window.closeTeamReorderModal = function() {
  const modal = document.getElementById('team-reorder-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

function renderTeamReorderList() {
  const container = document.getElementById('team-reorder-list');
  if (!container) return;

  container.innerHTML = TeamState.reorderItems.map((item, idx) => `
    <div class="p-3 bg-surface-container border border-surface-high flex items-center justify-between gap-3 group hover:border-primary/40 transition-colors">
      <div class="flex items-center gap-3 min-w-0">
        <span class="w-7 h-7 rounded bg-surface-low border border-surface-high font-mono text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
          ${idx + 1}
        </span>
        <div class="min-w-0">
          <div class="text-xs font-bold text-on-surface uppercase truncate">${escapeHTML(item.name)}</div>
          <div class="text-[10px] text-outline font-mono truncate">${escapeHTML(item.disciplineCode)} &bull; ${escapeHTML(item.role)}</div>
        </div>
      </div>

      <div class="flex items-center gap-1 flex-shrink-0">
        <button 
          type="button" 
          class="p-1 text-outline hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          onclick="moveTeamOrderItem(${idx}, -1)"
          ${idx === 0 ? 'disabled' : ''}
          title="Move Up"
        >
          <span class="material-symbols-outlined text-[20px]">arrow_upward</span>
        </button>

        <button 
          type="button" 
          class="p-1 text-outline hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          onclick="moveTeamOrderItem(${idx}, 1)"
          ${idx === TeamState.reorderItems.length - 1 ? 'disabled' : ''}
          title="Move Down"
        >
          <span class="material-symbols-outlined text-[20px]">arrow_downward</span>
        </button>
      </div>
    </div>
  `).join('');
}

window.moveTeamOrderItem = function(index, direction) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= TeamState.reorderItems.length) return;

  const temp = TeamState.reorderItems[index];
  TeamState.reorderItems[index] = TeamState.reorderItems[targetIndex];
  TeamState.reorderItems[targetIndex] = temp;

  // Reassign order numbers
  TeamState.reorderItems.forEach((item, idx) => {
    item.order = idx + 1;
  });

  renderTeamReorderList();
};

window.saveTeamReorder = async function() {
  const saveBtn = document.getElementById('team-reorder-save-btn');
  if (saveBtn) saveBtn.disabled = true;

  try {
    const orders = TeamState.reorderItems.map((item, idx) => ({
      id: item.id,
      order: idx + 1
    }));

    const res = await apiFetch('/api/admin/team/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders })
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Reorder failed');

    showToast('Team roster order updated successfully.', 'success');
    closeTeamReorderModal();
    loadAdminTeam();

  } catch (err) {
    console.error('Failed to save team order:', err);
    showToast(err.message || 'Error saving team ordering.', 'error');
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
};

// 19.14 Delete Team Member (Super Admin Enforced)
window.openDeleteTeamModal = function(id, name) {
  TeamState.deleteTargetId = id;
  TeamState.deleteTargetName = name;

  const modal = document.getElementById('team-delete-modal');
  const nameEl = document.getElementById('delete-team-member-name');

  if (nameEl) nameEl.textContent = `"${name}"`;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeDeleteTeamModal = function() {
  const modal = document.getElementById('team-delete-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  TeamState.deleteTargetId = null;
  TeamState.deleteTargetName = '';
};

window.executeDeleteTeamMember = async function() {
  if (!TeamState.deleteTargetId) return;

  const confirmBtn = document.getElementById('confirm-delete-team-btn');
  if (confirmBtn) confirmBtn.disabled = true;

  try {
    const res = await apiFetch(`/api/admin/team/${TeamState.deleteTargetId}`, {
      method: 'DELETE'
    });

    if (res.status === 403) {
      showToast('Permission Denied: Permanent delete is restricted to Super Administrators.', 'error');
      closeDeleteTeamModal();
      return;
    }

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Delete operation failed');

    showToast(`Member "${TeamState.deleteTargetName}" permanently deleted.`, 'success');
    closeDeleteTeamModal();
    loadAdminTeam();
    loadDashboardMetrics();

  } catch (err) {
    console.error('Failed to delete member:', err);
    showToast(err.message || 'Error deleting member.', 'error');
  } finally {
    if (confirmBtn) confirmBtn.disabled = false;
  }
};

// 19.15 Export Team Roster to CSV
window.exportTeamCSV = async function() {
  try {
    showToast('Exporting team roster to CSV...', 'info');

    const res = await apiFetch('/api/admin/team?limit=500&sort=order-asc');
    const json = await res.json();
    const members = json.data || [];

    if (members.length === 0) {
      showToast('No team members found to export.', 'warning');
      return;
    }

    const headers = ['Order', 'Name', 'Role', 'Discipline', 'Discipline Code', 'Academic Year', 'Social Handle', 'Leadership', 'Status', 'Bio'];
    const csvRows = [headers.join(',')];

    members.forEach(m => {
      const row = [
        m.order || 0,
        `"${(m.name || '').replace(/"/g, '""')}"`,
        `"${(m.role || '').replace(/"/g, '""')}"`,
        `"${(m.discipline || '').replace(/"/g, '""')}"`,
        `"${(m.disciplineCode || '').replace(/"/g, '""')}"`,
        `"${(m.academicYear || '').replace(/"/g, '""')}"`,
        `"${(m.handle || '').replace(/"/g, '""')}"`,
        m.isHeadOfDiscipline ? 'Head' : 'Member',
        m.status || 'active',
        `"${(m.bio || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `resolution-team-roster-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Team roster CSV exported successfully.', 'success');

  } catch (err) {
    console.error('CSV Export Failed:', err);
    showToast('Failed to export CSV.', 'error');
  }
};

// =========================================================================
// 20. STEP 7: CONTACT INBOX MANAGEMENT CMS & CONTROLLER
// =========================================================================

// Centralized Contact Inbox State
const ContactsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 15,
  search: '',
  status: 'all',
  dateRange: 'all',
  sort: 'newest',
  stats: { total: 0, pending: 0, unread: 0, read: 0, resolved: 0, spam: 0 },
  selectedContact: null,
  deleteTargetId: null,
  deleteTargetName: '',
  searchDebounceTimer: null
};

// 20.1 Load Admin Contacts from REST API
window.loadAdminContacts = async function(isManual = false) {
  const tableBody = document.getElementById('contacts-table-body');
  const mobileContainer = document.getElementById('contacts-mobile-cards');
  const skeleton = document.getElementById('contacts-table-skeleton');
  const emptyState = document.getElementById('contacts-empty-state');
  const errorBanner = document.getElementById('contacts-error-banner');
  const refreshIcon = document.getElementById('contacts-refresh-icon');

  if (refreshIcon) refreshIcon.classList.add('animate-spin');
  if (skeleton) skeleton.classList.remove('hidden');
  if (emptyState) emptyState.classList.add('hidden');
  if (errorBanner) errorBanner.classList.add('hidden');

  try {
    const params = new URLSearchParams({
      page: ContactsState.page,
      limit: ContactsState.limit,
      status: ContactsState.status,
      range: ContactsState.dateRange,
      sort: ContactsState.sort
    });

    if (ContactsState.search) {
      params.append('search', ContactsState.search);
    }

    const res = await apiFetch(`/api/admin/contacts?${params.toString()}`);
    if (!res.ok) throw new Error(`Contact API returned status ${res.status}`);

    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch contact messages');

    ContactsState.items = json.data || [];
    ContactsState.total = json.total || 0;
    if (json.stats) {
      ContactsState.stats = json.stats;
    }

    updateContactStatusBadges(ContactsState.stats);
    renderContactsTable(ContactsState.items);
    renderContactsMobileCards(ContactsState.items);
    updateContactsPagination(json.page, json.totalPages, json.total);

    // Synchronize Sidebar Dynamic Badge
    const sidebarBadge = document.getElementById('nav-contacts-badge');
    if (sidebarBadge) {
      const pendingCount = ContactsState.stats.pending || 0;
      if (pendingCount > 0) {
        sidebarBadge.textContent = pendingCount;
        sidebarBadge.classList.remove('hidden');
      } else {
        sidebarBadge.classList.add('hidden');
      }
    }

    if (ContactsState.items.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
    }

    if (isManual) {
      showToast('Contact inbox refreshed successfully.', 'success');
    }

  } catch (err) {
    console.error('Failed to load contact messages:', err);
    if (errorBanner) errorBanner.classList.remove('hidden');
    if (isManual) {
      showToast('Error syncing contact inbox with backend.', 'error');
    }
  } finally {
    if (skeleton) skeleton.classList.add('hidden');
    if (refreshIcon) {
      setTimeout(() => refreshIcon.classList.remove('animate-spin'), 300);
    }
  }
};

// 20.2 Render Desktop High-Density Table
function renderContactsTable(items) {
  const tableBody = document.getElementById('contacts-table-body');
  if (!tableBody) return;

  if (!items || items.length === 0) {
    tableBody.innerHTML = '';
    return;
  }

  tableBody.innerHTML = items.map(c => {
    const isPending = c.status === 'pending' || !c.isRead;
    const isResolved = c.status === 'resolved';
    const isSpam = c.status === 'spam';
    const isRead = c.isRead && c.status === 'read';

    // Status dot
    let dotColor = 'bg-yellow-400 animate-pulse';
    if (isResolved) dotColor = 'bg-green-400';
    else if (isSpam) dotColor = 'bg-red-500';
    else if (isRead) dotColor = 'bg-outline/50';

    // Status badge
    let badgeClass = 'bg-yellow-950/40 text-yellow-300 border-yellow-500/40';
    let badgeText = 'PENDING';
    if (isResolved) {
      badgeClass = 'bg-green-950/40 text-green-300 border-green-500/40';
      badgeText = 'RESOLVED';
    } else if (isSpam) {
      badgeClass = 'bg-red-950/40 text-red-300 border-red-500/40';
      badgeText = 'SPAM';
    } else if (isRead) {
      badgeClass = 'bg-surface-container text-on-surface-variant border-surface-high';
      badgeText = 'READ';
    }

    const relTime = formatRelativeTime(c.createdAt);
    const fullDate = new Date(c.createdAt).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const safeName = escapeHTML(c.name || 'Anonymous');
    const safeEmail = escapeHTML(c.email || '');
    const safeSubject = escapeHTML(c.subject || 'General Inquiry');
    const previewMessage = escapeHTML(c.message ? (c.message.length > 90 ? c.message.slice(0, 90) + '...' : c.message) : '');

    const textWeightClass = isPending ? 'font-bold text-on-surface' : 'text-on-surface-variant';
    const rowBgClass = isPending ? 'bg-surface-container/30' : '';

    return `
      <tr class="hover:bg-surface-container transition-colors group cursor-pointer ${rowBgClass}" onclick="openContactDetailModal('${c._id}')">
        <!-- Status Dot Indicator -->
        <td class="py-3 px-3 text-center">
          <span class="inline-block w-2 h-2 rounded-full ${dotColor}" title="${badgeText}"></span>
        </td>

        <!-- Received Date -->
        <td class="py-3 px-4 font-mono text-[11px] text-outline whitespace-nowrap" title="${fullDate}">
          ${relTime}
        </td>

        <!-- Sender (Name + Email) -->
        <td class="py-3 px-4">
          <div class="truncate max-w-[180px]">
            <div class="${textWeightClass} text-xs truncate">${safeName}</div>
            <div class="font-mono text-[10px] text-outline truncate">${safeEmail}</div>
          </div>
        </td>

        <!-- Subject & Preview -->
        <td class="py-3 px-4">
          <div class="space-y-0.5 max-w-md lg:max-w-xl">
            <div class="${textWeightClass} text-xs truncate flex items-center gap-1.5">
              <span>${safeSubject}</span>
              ${c.notes ? `<span class="material-symbols-outlined text-[13px] text-primary" title="Contains internal notes">note</span>` : ''}
            </div>
            <p class="text-[11px] text-outline truncate font-sans">${previewMessage}</p>
          </div>
        </td>

        <!-- Status Badge -->
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <span class="inline-block text-[9px] font-mono px-2 py-0.5 border ${badgeClass} uppercase font-bold">
            ${badgeText}
          </span>
        </td>

        <!-- Row Actions -->
        <td class="py-3 px-4 text-right whitespace-nowrap" onclick="event.stopPropagation()">
          <div class="flex items-center justify-end gap-1">
            <!-- View Detail -->
            <button 
              class="p-1.5 text-outline hover:text-primary hover:bg-surface-high rounded transition-colors cursor-pointer"
              onclick="openContactDetailModal('${c._id}')"
              title="View Full Message"
              type="button"
            >
              <span class="material-symbols-outlined text-[17px]">visibility</span>
            </button>

            <!-- Quick Resolve / Pending Toggle -->
            ${!isResolved ? `
              <button 
                class="p-1.5 text-outline hover:text-green-400 hover:bg-surface-high rounded transition-colors cursor-pointer"
                onclick="updateContactStatus('${c._id}', 'resolved', event)"
                title="Mark as Resolved"
                type="button"
              >
                <span class="material-symbols-outlined text-[17px]">task_alt</span>
              </button>
            ` : `
              <button 
                class="p-1.5 text-outline hover:text-yellow-400 hover:bg-surface-high rounded transition-colors cursor-pointer"
                onclick="updateContactStatus('${c._id}', 'pending', event)"
                title="Mark as Pending"
                type="button"
              >
                <span class="material-symbols-outlined text-[17px]">history</span>
              </button>
            `}

            <!-- Quick Reply via Email Client -->
            <button 
              class="p-1.5 text-outline hover:text-primary hover:bg-surface-high rounded transition-colors cursor-pointer"
              onclick="replyToContact('${escapeHTML(c.email)}', '${escapeHTML(c.subject)}', event)"
              title="Reply to Sender"
              type="button"
            >
              <span class="material-symbols-outlined text-[17px]">reply</span>
            </button>

            <!-- Quick Move to Spam -->
            ${!isSpam ? `
              <button 
                class="p-1.5 text-outline hover:text-red-400 hover:bg-surface-high rounded transition-colors cursor-pointer"
                onclick="updateContactStatus('${c._id}', 'spam', event)"
                title="Move to Spam"
                type="button"
              >
                <span class="material-symbols-outlined text-[17px]">report</span>
              </button>
            ` : ''}

            <!-- Delete (Super Admin only) -->
            <button 
              class="p-1.5 text-outline hover:text-red-400 hover:bg-surface-high rounded transition-colors cursor-pointer"
              onclick="openDeleteContactModal('${c._id}', '${safeName}', event)"
              title="Delete Message"
              type="button"
            >
              <span class="material-symbols-outlined text-[17px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 20.3 Render Mobile Stacked Cards
function renderContactsMobileCards(items) {
  const container = document.getElementById('contacts-mobile-cards');
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = items.map(c => {
    const isPending = c.status === 'pending' || !c.isRead;
    const isResolved = c.status === 'resolved';
    const isSpam = c.status === 'spam';

    let badgeClass = 'bg-yellow-950/40 text-yellow-300 border-yellow-500/40';
    let badgeText = 'PENDING';
    if (isResolved) {
      badgeClass = 'bg-green-950/40 text-green-300 border-green-500/40';
      badgeText = 'RESOLVED';
    } else if (isSpam) {
      badgeClass = 'bg-red-950/40 text-red-300 border-red-500/40';
      badgeText = 'SPAM';
    } else if (c.status === 'read') {
      badgeClass = 'bg-surface-container text-on-surface-variant border-surface-high';
      badgeText = 'READ';
    }

    const safeName = escapeHTML(c.name || 'Anonymous');
    const safeEmail = escapeHTML(c.email || '');
    const safeSubject = escapeHTML(c.subject || 'General Inquiry');
    const safeMessage = escapeHTML(c.message || '');
    const relTime = formatRelativeTime(c.createdAt);

    return `
      <div class="p-4 bg-surface-low border border-surface-high space-y-3 ${isPending ? 'border-yellow-500/40 bg-surface-container/20' : ''}" onclick="openContactDetailModal('${c._id}')">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-1.5">
              ${isPending ? `<span class="w-2 h-2 rounded-full bg-yellow-400"></span>` : ''}
              <span class="text-xs font-bold text-on-surface">${safeName}</span>
            </div>
            <div class="text-[10px] font-mono text-outline">${safeEmail}</div>
          </div>
          <span class="text-[9px] font-mono px-2 py-0.5 border ${badgeClass} uppercase font-bold">
            ${badgeText}
          </span>
        </div>

        <div>
          <h4 class="text-xs font-bold text-on-surface">${safeSubject}</h4>
          <p class="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5 font-sans">${safeMessage}</p>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-surface-high/60 text-[10px] text-outline font-mono">
          <span>${relTime}</span>
          <div class="flex items-center gap-2" onclick="event.stopPropagation()">
            <button class="text-primary font-bold uppercase hover:underline" onclick="replyToContact('${safeEmail}', '${safeSubject}', event)">Reply</button>
            <span>&bull;</span>
            <button class="text-on-surface hover:underline uppercase" onclick="openContactDetailModal('${c._id}')">Details</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 20.4 Update KPI Badges & Tab Counters
function updateContactStatusBadges(stats = {}) {
  const statTotal = document.getElementById('contacts-stat-total');
  const statPending = document.getElementById('contacts-stat-pending');
  const statResolved = document.getElementById('contacts-stat-resolved');
  const statSpam = document.getElementById('contacts-stat-spam');

  const countAll = document.getElementById('contacts-count-all');
  const countPending = document.getElementById('contacts-count-pending');
  const countRead = document.getElementById('contacts-count-read');
  const countResolved = document.getElementById('contacts-count-resolved');
  const countSpam = document.getElementById('contacts-count-spam');

  if (statTotal) statTotal.textContent = stats.total || 0;
  if (statPending) statPending.textContent = stats.pending || 0;
  if (statResolved) statResolved.textContent = stats.resolved || 0;
  if (statSpam) statSpam.textContent = stats.spam || 0;

  if (countAll) countAll.textContent = stats.total || 0;
  if (countPending) countPending.textContent = stats.pending || 0;
  if (countRead) countRead.textContent = stats.read || 0;
  if (countResolved) countResolved.textContent = stats.resolved || 0;
  if (countSpam) countSpam.textContent = stats.spam || 0;
}

// 20.5 Tab Filters
window.setContactStatusFilter = function(status) {
  ContactsState.status = status;
  ContactsState.page = 1;

  const tabButtons = document.querySelectorAll('#contacts-status-tabs button');
  tabButtons.forEach(btn => {
    const filter = btn.getAttribute('data-filter');
    if (filter === status) {
      btn.className = 'px-3 py-1.5 text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer bg-primary text-black';
    } else {
      btn.className = 'px-3 py-1.5 text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer bg-surface-container text-on-surface hover:bg-surface-high';
    }
  });

  loadAdminContacts();
};

// 20.6 Handle Filter & Sort Dropdown Changes
window.handleContactFilterChange = function() {
  const dateSelect = document.getElementById('contacts-date-filter');
  const sortSelect = document.getElementById('contacts-sort-select');

  if (dateSelect) ContactsState.dateRange = dateSelect.value;
  if (sortSelect) ContactsState.sort = sortSelect.value;
  ContactsState.page = 1;

  loadAdminContacts();
};

// 20.7 Search Handler with Debounce
window.handleContactSearchInput = function(event) {
  const value = event.target.value.trim();
  const clearBtn = document.getElementById('contacts-search-clear-btn');

  if (clearBtn) {
    clearBtn.classList.toggle('hidden', !value);
  }

  clearTimeout(ContactsState.searchDebounceTimer);
  ContactsState.searchDebounceTimer = setTimeout(() => {
    ContactsState.search = value;
    ContactsState.page = 1;
    loadAdminContacts();
  }, 250);
};

window.clearContactSearch = function() {
  const input = document.getElementById('contacts-search-input');
  const clearBtn = document.getElementById('contacts-search-clear-btn');
  if (input) input.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  ContactsState.search = '';
  ContactsState.page = 1;
  loadAdminContacts();
};

window.clearAllContactsFilters = function() {
  const searchInput = document.getElementById('contacts-search-input');
  const clearBtn = document.getElementById('contacts-search-clear-btn');
  const dateSelect = document.getElementById('contacts-date-filter');
  const sortSelect = document.getElementById('contacts-sort-select');

  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  if (dateSelect) dateSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'newest';

  ContactsState.search = '';
  ContactsState.status = 'all';
  ContactsState.dateRange = 'all';
  ContactsState.sort = 'newest';
  ContactsState.page = 1;

  setContactStatusFilter('all');
};

// 20.8 Pagination
function updateContactsPagination(currentPage, totalPages, totalCount) {
  const info = document.getElementById('contacts-pagination-info');
  const current = document.getElementById('contacts-page-current');
  const prevBtn = document.getElementById('btn-contacts-prev');
  const nextBtn = document.getElementById('btn-contacts-next');

  if (current) current.textContent = currentPage || 1;
  if (prevBtn) prevBtn.disabled = (currentPage <= 1);
  if (nextBtn) nextBtn.disabled = (currentPage >= totalPages);

  if (info) {
    const start = totalCount === 0 ? 0 : (currentPage - 1) * ContactsState.limit + 1;
    const end = Math.min(currentPage * ContactsState.limit, totalCount);
    info.textContent = `Showing ${start} to ${end} of ${totalCount} messages`;
  }
}

window.changeContactsPage = function(delta) {
  ContactsState.page = Math.max(1, ContactsState.page + delta);
  loadAdminContacts();
};

// 20.9 Open Message Detail Modal
window.openContactDetailModal = async function(contactId) {
  const modal = document.getElementById('contact-detail-modal');
  if (!modal) return;

  try {
    const res = await apiFetch(`/api/admin/contacts/${contactId}`);
    const json = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.message || 'Unable to load message details');
    }

    const contact = json.data;
    ContactsState.selectedContact = contact;

    // Populate Fields
    const subjectElem = document.getElementById('contact-detail-subject');
    const nameElem = document.getElementById('contact-detail-name');
    const emailElem = document.getElementById('contact-detail-email');
    const phoneElem = document.getElementById('contact-detail-phone');
    const dateElem = document.getElementById('contact-detail-date');
    const messageElem = document.getElementById('contact-detail-message');
    const statusPill = document.getElementById('contact-detail-status-pill');
    const currentStatusLabel = document.getElementById('contact-detail-current-status-label');
    const readTimeElem = document.getElementById('contact-detail-read-time');
    const notesInput = document.getElementById('contact-detail-notes-input');

    if (subjectElem) subjectElem.textContent = contact.subject || 'General Inquiry';
    if (nameElem) nameElem.textContent = contact.name || 'Anonymous';
    if (emailElem) {
      emailElem.textContent = contact.email || '';
      emailElem.href = `mailto:${contact.email}?subject=${encodeURIComponent('Re: ' + (contact.subject || 'Resolution Media Collective'))}`;
    }
    if (phoneElem) phoneElem.textContent = contact.phone || contact.contactNumber || 'Not Provided';
    
    if (dateElem) {
      dateElem.textContent = new Date(contact.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium', timeStyle: 'short'
      });
    }

    if (messageElem) messageElem.textContent = contact.message || '';
    if (notesInput) notesInput.value = contact.notes || '';

    // Update Status Pill
    const isPending = contact.status === 'pending' || !contact.isRead;
    const isResolved = contact.status === 'resolved';
    const isSpam = contact.status === 'spam';

    let pillClass = 'text-yellow-400 bg-yellow-950/40 border border-yellow-500/40 px-2 py-0.5';
    let pillText = 'PENDING REVIEW';
    if (isResolved) {
      pillClass = 'text-green-300 bg-green-950/40 border border-green-500/40 px-2 py-0.5';
      pillText = 'RESOLVED';
    } else if (isSpam) {
      pillClass = 'text-red-300 bg-red-950/40 border border-red-500/40 px-2 py-0.5';
      pillText = 'SPAM FLAGGED';
    } else if (contact.status === 'read') {
      pillClass = 'text-on-surface-variant bg-surface-container border border-surface-high px-2 py-0.5';
      pillText = 'READ';
    }

    if (statusPill) {
      statusPill.className = `text-[10px] font-mono font-bold uppercase ${pillClass}`;
      statusPill.textContent = pillText;
    }

    if (currentStatusLabel) {
      currentStatusLabel.textContent = `CURRENT: ${(contact.status || 'PENDING').toUpperCase()}`;
    }

    if (readTimeElem) {
      readTimeElem.textContent = contact.isRead 
        ? (contact.readAt ? `READ (${formatRelativeTime(contact.readAt)})` : 'READ') 
        : 'UNREAD';
    }

    // Role-based visibility for Delete button in modal
    const deleteBtn = document.getElementById('btn-contact-delete');
    if (deleteBtn) {
      const isSuperAdmin = AuthState.user && AuthState.user.role === 'admin';
      deleteBtn.classList.toggle('hidden', !isSuperAdmin);
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // If message was unread and in pending status, automatically mark as read upon viewing
    if (!contact.isRead) {
      apiFetch(`/api/admin/contacts/${contact._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      }).then(() => {
        contact.isRead = true;
        loadAdminContacts();
        loadDashboardMetrics();
      }).catch(e => console.warn('Could not mark message as read:', e));
    }

  } catch (err) {
    console.error('Failed to open message detail:', err);
    showToast(err.message || 'Failed to open message detail.', 'error');
  }
};

window.closeContactDetailModal = function() {
  const modal = document.getElementById('contact-detail-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  ContactsState.selectedContact = null;
};

// 20.10 Update Contact Status
window.updateActiveContactStatus = async function(newStatus) {
  if (!ContactsState.selectedContact) return;
  const contactId = ContactsState.selectedContact._id;
  await window.updateContactStatus(contactId, newStatus);
  closeContactDetailModal();
};

window.updateContactStatus = async function(contactId, newStatus, event) {
  if (event) event.stopPropagation();

  try {
    const res = await apiFetch(`/api/admin/contacts/${contactId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Status update failed');
    }

    let statusText = 'updated';
    if (newStatus === 'resolved') statusText = 'marked as resolved';
    else if (newStatus === 'spam') statusText = 'moved to spam';
    else if (newStatus === 'read') statusText = 'marked as read';
    else if (newStatus === 'pending') statusText = 'marked as pending/unread';

    showToast(`Message ${statusText}.`, 'success');
    loadAdminContacts();
    loadDashboardMetrics();

  } catch (err) {
    console.error('Failed to update status:', err);
    showToast(err.message || 'Error updating status.', 'error');
  }
};

// 20.11 Save Notes
window.saveContactDetailNotes = async function() {
  if (!ContactsState.selectedContact) return;
  const contactId = ContactsState.selectedContact._id;
  const notesInput = document.getElementById('contact-detail-notes-input');
  const notes = notesInput ? notesInput.value.trim() : '';

  try {
    const res = await apiFetch(`/api/admin/contacts/${contactId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to save notes');

    showToast('Curatorial notes saved successfully.', 'success');
    if (ContactsState.selectedContact) {
      ContactsState.selectedContact.notes = notes;
    }
  } catch (err) {
    console.error('Failed to save notes:', err);
    showToast(err.message || 'Error saving notes.', 'error');
  }
};

// 20.12 Reply Handler
window.replyToActiveContact = function() {
  if (!ContactsState.selectedContact) return;
  const contact = ContactsState.selectedContact;
  window.replyToContact(contact.email, contact.subject);
};

window.replyToContact = function(email, subject, event) {
  if (event) event.stopPropagation();
  if (!email) {
    showToast('Sender email address is unavailable for reply.', 'warning');
    return;
  }

  const cleanSubject = encodeURIComponent(subject ? (subject.startsWith('Re:') ? subject : `Re: ${subject}`) : 'Re: Resolution Media Collective Inquiry');
  const mailtoLink = `mailto:${encodeURIComponent(email)}?subject=${cleanSubject}`;
  
  window.location.href = mailtoLink;
  showToast(`Opening email client for ${email}...`, 'info');
};

// 20.13 Delete Message Workflow (Super Admin Restricted)
window.openDeleteActiveContactModal = function() {
  if (!ContactsState.selectedContact) return;
  const contact = ContactsState.selectedContact;
  closeContactDetailModal();
  openDeleteContactModal(contact._id, contact.name);
};

window.openDeleteContactModal = function(contactId, senderName, event) {
  if (event) event.stopPropagation();

  // Role check guard
  if (!AuthState.user || AuthState.user.role !== 'admin') {
    showToast('Permission Denied: Permanent message deletion is restricted to Super Administrators.', 'error');
    return;
  }

  ContactsState.deleteTargetId = contactId;
  ContactsState.deleteTargetName = senderName || 'this sender';

  const nameElem = document.getElementById('delete-contact-sender-name');
  if (nameElem) nameElem.textContent = senderName || 'this sender';

  const modal = document.getElementById('contact-delete-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeDeleteContactModal = function() {
  const modal = document.getElementById('contact-delete-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  ContactsState.deleteTargetId = null;
  ContactsState.deleteTargetName = '';
};

window.executeDeleteContact = async function() {
  if (!ContactsState.deleteTargetId) return;
  const confirmBtn = document.getElementById('confirm-delete-contact-btn');
  if (confirmBtn) confirmBtn.disabled = true;

  try {
    const res = await apiFetch(`/api/admin/contacts/${ContactsState.deleteTargetId}`, {
      method: 'DELETE'
    });

    if (res.status === 403) {
      showToast('Permission Denied: Permanent delete is restricted to Super Administrators.', 'error');
      closeDeleteContactModal();
      return;
    }

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Delete operation failed');

    showToast(`Message from "${ContactsState.deleteTargetName}" permanently deleted.`, 'success');
    closeDeleteContactModal();
    loadAdminContacts();
    loadDashboardMetrics();

  } catch (err) {
    console.error('Failed to delete contact message:', err);
    showToast(err.message || 'Error deleting message.', 'error');
  } finally {
    if (confirmBtn) confirmBtn.disabled = false;
  }
};

// 20.14 Export Messages to CSV
window.exportContactsCSV = async function() {
  try {
    showToast('Exporting contact messages to CSV...', 'info');

    const res = await apiFetch('/api/admin/contacts?limit=500&sort=newest');
    const json = await res.json();
    const messages = json.data || [];

    if (messages.length === 0) {
      showToast('No contact messages found to export.', 'warning');
      return;
    }

    const headers = ['Received At', 'Sender Name', 'Email', 'Phone', 'Subject', 'Status', 'Read', 'Message', 'Notes'];
    const csvRows = [headers.join(',')];

    messages.forEach(c => {
      const row = [
        `"${new Date(c.createdAt).toISOString()}"`,
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${(c.phone || c.contactNumber || '').replace(/"/g, '""')}"`,
        `"${(c.subject || '').replace(/"/g, '""')}"`,
        c.status || 'pending',
        c.isRead ? 'Yes' : 'No',
        `"${(c.message || '').replace(/"/g, '""')}"`,
        `"${(c.notes || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `resolution-contact-inbox-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Contact messages CSV exported successfully.', 'success');

  } catch (err) {
    console.error('CSV Export Failed:', err);
    showToast('Failed to export CSV.', 'error');
  }
};

// =========================================================================
// 21. STEP 8: HOMEPAGE CONTENT CMS & DRAFT WORKFLOW CONTROLLER
// =========================================================================

// Centralized Homepage Content State
const HomepageContentState = {
  publishedData: null,
  draftData: null,
  activeData: null,
  availableWorks: [],
  availableEvents: [],
  selectedWorkIds: [],
  selectedEventIds: [],
  isDirty: false,
  activeTab: 'hero',
  pendingNavSection: null,
  worksPickerSelectedIds: [],
  eventsPickerSelectedIds: [],
  heroMediaType: 'image',
  heroMediaUrl: 'images/hero.webp',
  heroVideoUrl: ''
};

// 21.1 Tab Switching
window.switchContentTab = function(tabName) {
  HomepageContentState.activeTab = tabName;

  const tabBtns = document.querySelectorAll('.content-tab-btn');
  const tabPanels = document.querySelectorAll('.content-tab-panel');

  tabBtns.forEach(btn => {
    const isTarget = btn.getAttribute('data-tab') === tabName;
    if (isTarget) {
      btn.className = 'content-tab-btn px-4 py-2.5 border-b-2 border-primary text-primary font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer';
    } else {
      btn.className = 'content-tab-btn px-4 py-2.5 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface hover:border-surface-high font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer';
    }
  });

  tabPanels.forEach(panel => {
    panel.classList.toggle('hidden', panel.id !== `tab-panel-${tabName}`);
  });
};

// 21.2 Load Homepage CMS Content from REST API
window.loadAdminHomepageContent = async function(isManual = false) {
  const skeleton = document.getElementById('content-loading-skeleton');
  const workspace = document.getElementById('content-workspace-wrapper');

  if (skeleton) skeleton.classList.remove('hidden');
  if (workspace) workspace.classList.add('hidden');

  try {
    const res = await apiFetch('/api/admin/content/home');
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load homepage CMS data`);

    const json = await res.json();
    if (!json.success || !json.data) throw new Error(json.message || 'Invalid CMS content payload');

    const payload = json.data;
    HomepageContentState.publishedData = payload.published || {};
    HomepageContentState.draftData = payload.draftData || null;
    HomepageContentState.availableWorks = payload.availableWorks || [];
    HomepageContentState.availableEvents = payload.availableEvents || [];

    // Decide active data: draft has precedence in editor view
    const isDraftActive = Boolean(HomepageContentState.draftData);
    HomepageContentState.activeData = isDraftActive
      ? JSON.parse(JSON.stringify(HomepageContentState.draftData))
      : JSON.parse(JSON.stringify(HomepageContentState.publishedData));

    // Update status badges and controls
    updateContentStatusUI(isDraftActive, payload.published ? payload.published.updatedAt : null);

    // Populate all form fields
    populateContentForm(HomepageContentState.activeData);

    // Render works & events lists
    renderFeaturedWorksList();
    renderFeaturedEventsList();

    HomepageContentState.isDirty = false;
    updateSaveDraftButtonState();

    if (isManual) {
      showToast('Homepage CMS synchronized with live database.', 'success');
    }
  } catch (err) {
    console.error('Failed to load homepage content:', err);
    showToast(err.message || 'Error loading homepage CMS.', 'error');
  } finally {
    if (skeleton) skeleton.classList.add('hidden');
    if (workspace) workspace.classList.remove('hidden');
  }
};

// Helper: Update Status Badge, Last Updated, and Discard Button
function updateContentStatusUI(hasDraft, updatedAt) {
  const statusBadge = document.getElementById('content-status-badge');
  const lastUpdated = document.getElementById('content-last-updated');
  const discardBtn = document.getElementById('content-discard-btn');
  const navContentBadge = document.getElementById('nav-content-badge');

  if (statusBadge) {
    if (hasDraft) {
      statusBadge.textContent = 'DRAFT SAVED';
      statusBadge.className = 'text-[9px] font-mono px-2 py-0.5 bg-yellow-950/40 border border-yellow-500/50 text-yellow-400 font-bold uppercase';
    } else {
      statusBadge.textContent = 'PUBLISHED';
      statusBadge.className = 'text-[9px] font-mono px-2 py-0.5 bg-green-950/40 border border-green-500/50 text-green-400 font-bold uppercase';
    }
  }

  if (lastUpdated) {
    if (updatedAt) {
      lastUpdated.textContent = `LAST SYNCED: ${new Date(updatedAt).toLocaleString('en-US').toUpperCase()}`;
    } else {
      lastUpdated.textContent = 'STATUS: ACTIVE';
    }
  }

  if (discardBtn) {
    discardBtn.disabled = !hasDraft;
    discardBtn.classList.toggle('opacity-40', !hasDraft);
    discardBtn.classList.toggle('cursor-not-allowed', !hasDraft);
  }

  if (navContentBadge) {
    navContentBadge.classList.toggle('hidden', !hasDraft);
  }
}

// 21.3 Populate Form from CMS Data Object
function populateContentForm(data) {
  if (!data) return;

  const hero = data.hero || {};
  const manifesto = data.manifesto || {};
  const announcement = data.announcement || {};
  const vis = data.sectionVisibility || {};

  // TAB 1: Hero Form
  setVal('input-hero-heading-1', hero.headingLine1 || 'We Frame');
  setVal('input-hero-heading-2', hero.headingLine2 || 'The Moment.');
  setVal('input-hero-badge', hero.badgeLabel || 'STUDENT MEDIA COLLECTIVE • VOL. 03');
  setVal('input-hero-subheading', hero.subheading || '');
  setVal('input-hero-cta-primary-label', hero.primaryCtaText || 'Explore Selected Work');
  setVal('input-hero-cta-primary-link', hero.primaryCtaUrl || '#selected-works');
  setVal('input-hero-cta-secondary-label', hero.secondaryCtaText || 'Play Showreel 2026');
  setVal('input-hero-cta-secondary-link', hero.secondaryCtaUrl || 'modal:reel');

  // TAB 2: Hero Media
  HomepageContentState.heroMediaType = hero.backdropType || 'image';
  HomepageContentState.heroMediaUrl = hero.backdropImage || 'images/hero.webp';
  HomepageContentState.heroVideoUrl = hero.backdropVideo || '';

  const radioImg = document.getElementById('media-type-image');
  const radioVid = document.getElementById('media-type-video');
  if (radioImg) radioImg.checked = (HomepageContentState.heroMediaType === 'image');
  if (radioVid) radioVid.checked = (HomepageContentState.heroMediaType === 'video');

  setVal('input-hero-bg-image', HomepageContentState.heroMediaUrl);
  setVal('input-hero-video-url', HomepageContentState.heroVideoUrl);
  updateHeroMediaPreviewUI();

  // TAB 3: Manifesto & Metrics
  setVal('input-manifesto-tag', manifesto.tag || '01 // MANIFESTO & POSITION');
  setVal('input-manifesto-heading', manifesto.heading || "We don't just capture moments.");
  setVal('input-manifesto-highlight', manifesto.italicHighlight || 'We give them a point of view.');
  setVal('input-manifesto-body', manifesto.body || '');

  setVal('input-metric-productions', manifesto.productionsCount || '48+');
  setVal('input-metric-laurels', manifesto.laurelsCount || '12');
  setVal('input-metric-frames', manifesto.preservedFramesCount || '140K+');
  setVal('input-metric-creators', manifesto.creatorsCount || '200+');

  setVal('input-manifesto-portrait-url', manifesto.portraitUrl || 'images/crew-portrait.webp');
  setVal('input-manifesto-portrait-lead', manifesto.portraitLead || 'Cinematography Lead: Ananya Rao');
  setVal('input-manifesto-portrait-exif', manifesto.portraitExif || 'RAW / 800 ISO');
  setVal('input-manifesto-quote-title', manifesto.quoteTitle || 'PERSPECTIVE OVER PIXELS');
  setVal('input-manifesto-quote-body', manifesto.quoteBody || '"The camera does not record reality; it isolates an intention from chaos."');

  const portraitPreview = document.getElementById('manifesto-portrait-preview');
  if (portraitPreview) {
    portraitPreview.src = manifesto.portraitUrl || 'images/crew-portrait.webp';
    portraitPreview.onerror = () => { portraitPreview.src = 'images/crew-portrait.webp'; };
  }

  // TAB 4: Featured Works
  const worksMode = data.featuredWorksMode || 'manual';
  const modeWorksManual = document.getElementById('mode-works-manual');
  const modeWorksAuto = document.getElementById('mode-works-auto');
  if (modeWorksManual) modeWorksManual.checked = (worksMode === 'manual');
  if (modeWorksAuto) modeWorksAuto.checked = (worksMode === 'auto');
  HomepageContentState.selectedWorkIds = Array.isArray(data.featuredWorkIds) ? [...data.featuredWorkIds] : [];

  // TAB 5: Featured Events
  const eventsMode = data.featuredEventsMode || 'upcoming';
  const modeEventsUpcoming = document.getElementById('mode-events-upcoming');
  const modeEventsManual = document.getElementById('mode-events-manual');
  if (modeEventsUpcoming) modeEventsUpcoming.checked = (eventsMode === 'upcoming');
  if (modeEventsManual) modeEventsManual.checked = (eventsMode === 'manual');
  HomepageContentState.selectedEventIds = Array.isArray(data.featuredEventIds) ? [...data.featuredEventIds] : [];

  // TAB 6: Announcements
  setCheckbox('toggle-announcement-active', Boolean(announcement.active));
  setVal('input-announcement-text', announcement.text || 'OPEN CALL // SPRING 2026 COHORT INTAKE ACTIVE');
  setVal('input-announcement-link', announcement.url || '#recruitment-portal');
  setVal('input-announcement-label', announcement.actionLabel || 'Apply Now');

  // TAB 7: Visibility Toggles
  setCheckbox('toggle-show-hero', vis.hero !== false);
  setCheckbox('toggle-show-manifesto', vis.manifesto !== false);
  setCheckbox('toggle-show-works', vis.works !== false);
  setCheckbox('toggle-show-optics', vis.optics !== false);
  setCheckbox('toggle-show-reel', vis.reel !== false);
  setCheckbox('toggle-show-events', vis.events !== false);
  setCheckbox('toggle-show-team', vis.team !== false);
  setCheckbox('toggle-show-recruitment', vis.recruitment !== false);
}

function setVal(elemId, val) {
  const el = document.getElementById(elemId);
  if (el) el.value = val || '';
}

function getVal(elemId, fallback = '') {
  const el = document.getElementById(elemId);
  return el ? el.value.trim() : fallback;
}

function setCheckbox(elemId, checked) {
  const el = document.getElementById(elemId);
  if (el) el.checked = Boolean(checked);
}

function getCheckbox(elemId, fallback = true) {
  const el = document.getElementById(elemId);
  return el ? el.checked : fallback;
}

// 21.4 Collect Current Form Data into Clean Payload
function collectContentFormData() {
  const worksModeRadio = document.querySelector('input[name="worksSelectionMode"]:checked');
  const eventsModeRadio = document.querySelector('input[name="eventsSelectionMode"]:checked');

  return {
    hero: {
      headingLine1: getVal('input-hero-heading-1', 'We Frame'),
      headingLine2: getVal('input-hero-heading-2', 'The Moment.'),
      badgeLabel: getVal('input-hero-badge', 'STUDENT MEDIA COLLECTIVE • VOL. 03'),
      subheading: getVal('input-hero-subheading', ''),
      primaryCtaText: getVal('input-hero-cta-primary-label', 'Explore Selected Work'),
      primaryCtaUrl: getVal('input-hero-cta-primary-link', '#selected-works'),
      secondaryCtaText: getVal('input-hero-cta-secondary-label', 'Play Showreel 2026'),
      secondaryCtaUrl: getVal('input-hero-cta-secondary-link', 'modal:reel'),
      backdropType: HomepageContentState.heroMediaType || 'image',
      backdropImage: getVal('input-hero-bg-image', HomepageContentState.heroMediaUrl || 'images/hero.webp'),
      backdropVideo: getVal('input-hero-video-url', HomepageContentState.heroVideoUrl || '')
    },
    manifesto: {
      tag: getVal('input-manifesto-tag', '01 // MANIFESTO & POSITION'),
      heading: getVal('input-manifesto-heading', "We don't just capture moments."),
      italicHighlight: getVal('input-manifesto-highlight', 'We give them a point of view.'),
      body: getVal('input-manifesto-body', ''),
      productionsCount: getVal('input-metric-productions', '48+'),
      laurelsCount: getVal('input-metric-laurels', '12'),
      preservedFramesCount: getVal('input-metric-frames', '140K+'),
      creatorsCount: getVal('input-metric-creators', '200+'),
      portraitUrl: getVal('input-manifesto-portrait-url', 'images/crew-portrait.webp'),
      portraitLead: getVal('input-manifesto-portrait-lead', 'Cinematography Lead: Ananya Rao'),
      portraitExif: getVal('input-manifesto-portrait-exif', 'RAW / 800 ISO'),
      quoteTitle: getVal('input-manifesto-quote-title', 'PERSPECTIVE OVER PIXELS'),
      quoteBody: getVal('input-manifesto-quote-body', '"The camera does not record reality; it isolates an intention from chaos."')
    },
    featuredWorksMode: worksModeRadio ? worksModeRadio.value : 'manual',
    featuredWorkIds: [...HomepageContentState.selectedWorkIds],
    featuredEventsMode: eventsModeRadio ? eventsModeRadio.value : 'upcoming',
    featuredEventIds: [...HomepageContentState.selectedEventIds],
    announcement: {
      active: getCheckbox('toggle-announcement-active', true),
      text: getVal('input-announcement-text', 'OPEN CALL // SPRING 2026 COHORT INTAKE ACTIVE'),
      url: getVal('input-announcement-link', '#recruitment-portal'),
      actionLabel: getVal('input-announcement-label', 'Apply Now')
    },
    sectionVisibility: {
      hero: getCheckbox('toggle-show-hero', true),
      manifesto: getCheckbox('toggle-show-manifesto', true),
      works: getCheckbox('toggle-show-works', true),
      optics: getCheckbox('toggle-show-optics', true),
      reel: getCheckbox('toggle-show-reel', true),
      events: getCheckbox('toggle-show-events', true),
      team: getCheckbox('toggle-show-team', true),
      recruitment: getCheckbox('toggle-show-recruitment', true)
    }
  };
}

// 21.5 Dirty Tracking
window.markContentDirty = function() {
  HomepageContentState.isDirty = true;
  updateSaveDraftButtonState();
};

function updateSaveDraftButtonState() {
  const saveDraftBtn = document.getElementById('content-save-draft-btn');
  if (saveDraftBtn) {
    if (HomepageContentState.isDirty) {
      saveDraftBtn.innerHTML = `
        <span class="material-symbols-outlined text-[16px]">save</span>
        <span>Save Draft *</span>
      `;
      saveDraftBtn.classList.add('border-primary/80', 'text-primary');
    } else {
      saveDraftBtn.innerHTML = `
        <span class="material-symbols-outlined text-[16px]">save</span>
        <span>Save Draft</span>
      `;
      saveDraftBtn.classList.remove('border-primary/80', 'text-primary');
    }
  }
}

// 21.6 Hero Media Handlers
window.handleHeroMediaTypeChange = function(type) {
  HomepageContentState.heroMediaType = type;
  updateHeroMediaPreviewUI();
  markContentDirty();
};

window.handleHeroMediaUrlInput = function(url) {
  HomepageContentState.heroMediaUrl = url;
  const imgEl = document.getElementById('hero-media-preview-img');
  if (imgEl) {
    imgEl.src = url;
    imgEl.onerror = () => { imgEl.src = 'images/hero.webp'; };
  }
  markContentDirty();
};

function updateHeroMediaPreviewUI() {
  const isVideo = HomepageContentState.heroMediaType === 'video';
  const imgEl = document.getElementById('hero-media-preview-img');
  const videoEl = document.getElementById('hero-media-preview-video');
  const videoInputContainer = document.getElementById('hero-video-input-container');

  if (imgEl) {
    imgEl.src = HomepageContentState.heroMediaUrl || 'images/hero.webp';
    imgEl.classList.toggle('hidden', isVideo);
  }

  if (videoEl) {
    videoEl.src = HomepageContentState.heroVideoUrl || '';
    videoEl.classList.toggle('hidden', !isVideo);
    if (isVideo && HomepageContentState.heroVideoUrl) {
      videoEl.play().catch(() => {});
    }
  }

  if (videoInputContainer) {
    videoInputContainer.classList.toggle('opacity-50', !isVideo);
  }
}

window.revertHeroMediaToDefault = function() {
  HomepageContentState.heroMediaType = 'image';
  HomepageContentState.heroMediaUrl = 'images/hero.webp';
  HomepageContentState.heroVideoUrl = '';

  const radioImg = document.getElementById('media-type-image');
  if (radioImg) radioImg.checked = true;
  setVal('input-hero-bg-image', 'images/hero.webp');
  setVal('input-hero-video-url', '');
  updateHeroMediaPreviewUI();
  markContentDirty();
  showToast('Hero media backdrop reverted to default.', 'info');
};

window.handleHeroMediaUpload = async function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  // File size guard (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('File exceeds 5MB limit. Please compress media.', 'error');
    event.target.value = '';
    return;
  }

  const spinner = document.getElementById('hero-media-uploading');
  if (spinner) spinner.classList.remove('hidden');

  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${AuthState.token}` },
      body: formData
    });

    if (res.status === 401) {
      handleSessionExpired();
      return;
    }

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Media upload failed');

    const fileUrl = json.imageUrl || json.fileUrl;
    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      HomepageContentState.heroMediaType = 'video';
      HomepageContentState.heroVideoUrl = fileUrl;
      const radioVid = document.getElementById('media-type-video');
      if (radioVid) radioVid.checked = true;
      setVal('input-hero-video-url', fileUrl);
    } else {
      HomepageContentState.heroMediaType = 'image';
      HomepageContentState.heroMediaUrl = fileUrl;
      const radioImg = document.getElementById('media-type-image');
      if (radioImg) radioImg.checked = true;
      setVal('input-hero-bg-image', fileUrl);
    }

    updateHeroMediaPreviewUI();
    markContentDirty();
    showToast('Hero media backdrop uploaded successfully.', 'success');

  } catch (err) {
    console.error('Upload Error:', err);
    showToast(err.message || 'Failed to upload media file.', 'error');
  } finally {
    if (spinner) spinner.classList.add('hidden');
    event.target.value = '';
  }
};

// 21.7 Featured Works Curatorial Selection & Reordering
window.handleWorksModeChange = function(mode) {
  const list = document.getElementById('content-featured-works-list');
  const btn = document.getElementById('btn-open-works-picker');
  if (mode === 'auto') {
    if (list) list.classList.add('opacity-50');
    if (btn) btn.disabled = true;
  } else {
    if (list) list.classList.remove('opacity-50');
    if (btn) btn.disabled = false;
  }
  markContentDirty();
};

window.renderFeaturedWorksList = function() {
  const container = document.getElementById('content-featured-works-list');
  if (!container) return;

  const works = HomepageContentState.availableWorks || [];
  const selectedIds = HomepageContentState.selectedWorkIds || [];

  if (selectedIds.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center border border-dashed border-surface-high text-outline text-xs">
        No curated works selected. The public website will fall back to top published works.
      </div>
    `;
    return;
  }

  container.innerHTML = selectedIds.map((id, idx) => {
    const work = works.find(w => String(w._id || w.id) === String(id));
    if (!work) return '';

    return `
      <div class="p-3 bg-surface-container border border-surface-high flex items-center justify-between gap-3 group hover:border-primary/40 transition-colors">
        <div class="flex items-center gap-3 min-w-0">
          <span class="w-6 h-6 rounded bg-surface-low border border-surface-high font-mono text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
            ${idx + 1}
          </span>
          <img src="${escapeHTML(work.coverImage || 'images/works/hero-film.webp')}" alt="" class="w-10 h-7 object-cover border border-surface-high flex-shrink-0" onerror="this.src='images/works/hero-film.webp'" />
          <div class="min-w-0">
            <div class="text-xs font-bold text-on-surface uppercase truncate">${escapeHTML(work.title)}</div>
            <div class="text-[10px] text-outline font-mono truncate">${escapeHTML(work.discipline || 'Direction')} &bull; ${escapeHTML(work.workCode || 'RES-01')}</div>
          </div>
        </div>

        <div class="flex items-center gap-1 flex-shrink-0">
          <button type="button" class="p-1 text-outline hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer" onclick="moveFeaturedWork(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} title="Move Up">
            <span class="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
          <button type="button" class="p-1 text-outline hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer" onclick="moveFeaturedWork(${idx}, 1)" ${idx === selectedIds.length - 1 ? 'disabled' : ''} title="Move Down">
            <span class="material-symbols-outlined text-[18px]">arrow_downward</span>
          </button>
          <button type="button" class="p-1 text-outline hover:text-red-400 cursor-pointer" onclick="removeFeaturedWork('${id}')" title="Remove from Homepage">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
};

window.moveFeaturedWork = function(index, delta) {
  const targetIndex = index + delta;
  const ids = HomepageContentState.selectedWorkIds;
  if (targetIndex < 0 || targetIndex >= ids.length) return;

  const temp = ids[index];
  ids[index] = ids[targetIndex];
  ids[targetIndex] = temp;

  renderFeaturedWorksList();
  markContentDirty();
};

window.removeFeaturedWork = function(workId) {
  HomepageContentState.selectedWorkIds = HomepageContentState.selectedWorkIds.filter(id => String(id) !== String(workId));
  renderFeaturedWorksList();
  markContentDirty();
  showToast('Work removed from homepage featured list.', 'info');
};

// Works Picker Modal
window.openWorksPickerModal = function() {
  const modal = document.getElementById('content-works-picker-modal');
  if (!modal) return;

  HomepageContentState.worksPickerSelectedIds = [...HomepageContentState.selectedWorkIds];
  renderWorksPickerList(HomepageContentState.availableWorks);

  const searchInput = document.getElementById('works-picker-search-input');
  if (searchInput) searchInput.value = '';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeWorksPickerModal = function() {
  const modal = document.getElementById('content-works-picker-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.filterWorksPickerList = function(query) {
  const q = (query || '').toLowerCase().trim();
  const filtered = HomepageContentState.availableWorks.filter(w => {
    return (w.title && w.title.toLowerCase().includes(q)) ||
           (w.discipline && w.discipline.toLowerCase().includes(q)) ||
           (w.workCode && w.workCode.toLowerCase().includes(q));
  });
  renderWorksPickerList(filtered);
};

function renderWorksPickerList(works) {
  const container = document.getElementById('works-picker-list');
  const countBadge = document.getElementById('works-picker-selected-count');
  if (!container) return;

  if (countBadge) {
    countBadge.textContent = `${HomepageContentState.worksPickerSelectedIds.length} works selected`;
  }

  if (!works || works.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-outline text-xs border border-dashed border-surface-high">
        No matching archival works found in the database.
      </div>
    `;
    return;
  }

  container.innerHTML = works.map(w => {
    const id = String(w._id || w.id);
    const isSelected = HomepageContentState.worksPickerSelectedIds.includes(id);

    return `
      <div class="p-3 bg-surface-container border ${isSelected ? 'border-primary bg-primary/5' : 'border-surface-high'} flex items-center justify-between gap-3 cursor-pointer hover:border-primary/60 transition-colors" onclick="toggleWorkSelectionInPicker('${id}')">
        <div class="flex items-center gap-3 min-w-0">
          <input type="checkbox" ${isSelected ? 'checked' : ''} class="accent-primary w-4 h-4 cursor-pointer" onclick="event.stopPropagation(); toggleWorkSelectionInPicker('${id}')" />
          <img src="${escapeHTML(w.coverImage || 'images/works/hero-film.webp')}" alt="" class="w-10 h-7 object-cover border border-surface-high flex-shrink-0" onerror="this.src='images/works/hero-film.webp'" />
          <div class="min-w-0">
            <div class="text-xs font-bold text-on-surface uppercase truncate">${escapeHTML(w.title)}</div>
            <div class="text-[10px] text-outline font-mono truncate">${escapeHTML(w.discipline || 'Direction')} &bull; ${escapeHTML(w.workCode || 'RES-01')}</div>
          </div>
        </div>

        <span class="text-[9px] font-mono px-1.5 py-0.5 border ${w.status === 'published' ? 'border-green-500/40 text-green-400' : 'border-surface-high text-outline'} uppercase">
          ${escapeHTML(w.status || 'draft')}
        </span>
      </div>
    `;
  }).join('');
}

window.toggleWorkSelectionInPicker = function(workId) {
  const id = String(workId);
  const idx = HomepageContentState.worksPickerSelectedIds.indexOf(id);
  if (idx >= 0) {
    HomepageContentState.worksPickerSelectedIds.splice(idx, 1);
  } else {
    HomepageContentState.worksPickerSelectedIds.push(id);
  }

  const searchInput = document.getElementById('works-picker-search-input');
  filterWorksPickerList(searchInput ? searchInput.value : '');
};

window.saveFeaturedWorksSelection = function() {
  HomepageContentState.selectedWorkIds = [...HomepageContentState.worksPickerSelectedIds];
  closeWorksPickerModal();
  renderFeaturedWorksList();
  markContentDirty();
  showToast(`Featured works selection updated (${HomepageContentState.selectedWorkIds.length} chosen).`, 'success');
};

// 21.8 Featured Events Curatorial Selection
window.handleEventsModeChange = function(mode) {
  const list = document.getElementById('content-featured-events-list');
  const btn = document.getElementById('btn-open-events-picker');
  if (mode === 'upcoming') {
    if (list) list.classList.add('opacity-50');
    if (btn) btn.disabled = true;
  } else {
    if (list) list.classList.remove('opacity-50');
    if (btn) btn.disabled = false;
  }
  markContentDirty();
};

window.renderFeaturedEventsList = function() {
  const container = document.getElementById('content-featured-events-list');
  if (!container) return;

  const events = HomepageContentState.availableEvents || [];
  const selectedIds = HomepageContentState.selectedEventIds || [];

  if (selectedIds.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center border border-dashed border-surface-high text-outline text-xs">
        No manual events curated. The public calendar will automatically showcase next upcoming events.
      </div>
    `;
    return;
  }

  container.innerHTML = selectedIds.map((id, idx) => {
    const ev = events.find(e => String(e._id || e.id) === String(id));
    if (!ev) return '';

    return `
      <div class="p-3 bg-surface-container border border-surface-high flex items-center justify-between gap-3 group hover:border-primary/40 transition-colors">
        <div class="flex items-center gap-3 min-w-0">
          <span class="w-6 h-6 rounded bg-surface-low border border-surface-high font-mono text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
            ${idx + 1}
          </span>
          <div class="min-w-0">
            <div class="text-xs font-bold text-on-surface uppercase truncate">${escapeHTML(ev.title)}</div>
            <div class="text-[10px] text-outline font-mono truncate">${escapeHTML(ev.category || 'WORKSHOP')} &bull; ${formatEventDate(ev.date)} &bull; ${escapeHTML(ev.location || 'Studio')}</div>
          </div>
        </div>

        <button type="button" class="p-1 text-outline hover:text-red-400 cursor-pointer flex-shrink-0" onclick="removeFeaturedEvent('${id}')" title="Remove from Featured Events">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `;
  }).join('');
};

window.removeFeaturedEvent = function(eventId) {
  HomepageContentState.selectedEventIds = HomepageContentState.selectedEventIds.filter(id => String(id) !== String(eventId));
  renderFeaturedEventsList();
  markContentDirty();
  showToast('Event removed from featured list.', 'info');
};

// Events Picker Modal
window.openEventsPickerModal = function() {
  const modal = document.getElementById('content-events-picker-modal');
  if (!modal) return;

  HomepageContentState.eventsPickerSelectedIds = [...HomepageContentState.selectedEventIds];
  renderEventsPickerList();

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeEventsPickerModal = function() {
  const modal = document.getElementById('content-events-picker-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

function renderEventsPickerList() {
  const container = document.getElementById('events-picker-list');
  const countBadge = document.getElementById('events-picker-selected-count');
  if (!container) return;

  const events = HomepageContentState.availableEvents || [];
  if (countBadge) {
    countBadge.textContent = `${HomepageContentState.eventsPickerSelectedIds.length} events selected`;
  }

  if (events.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-outline text-xs border border-dashed border-surface-high">
        No event records available in the database.
      </div>
    `;
    return;
  }

  container.innerHTML = events.map(ev => {
    const id = String(ev._id || ev.id);
    const isSelected = HomepageContentState.eventsPickerSelectedIds.includes(id);

    return `
      <div class="p-3 bg-surface-container border ${isSelected ? 'border-primary bg-primary/5' : 'border-surface-high'} flex items-center justify-between gap-3 cursor-pointer hover:border-primary/60 transition-colors" onclick="toggleEventSelectionInPicker('${id}')">
        <div class="flex items-center gap-3 min-w-0">
          <input type="checkbox" ${isSelected ? 'checked' : ''} class="accent-primary w-4 h-4 cursor-pointer" onclick="event.stopPropagation(); toggleEventSelectionInPicker('${id}')" />
          <div class="min-w-0">
            <div class="text-xs font-bold text-on-surface uppercase truncate">${escapeHTML(ev.title)}</div>
            <div class="text-[10px] text-outline font-mono truncate">${escapeHTML(ev.category || 'WORKSHOP')} &bull; ${formatEventDate(ev.date)} &bull; ${escapeHTML(ev.location || 'Studio')}</div>
          </div>
        </div>

        <span class="text-[9px] font-mono px-1.5 py-0.5 border ${ev.status === 'upcoming' ? 'border-green-500/40 text-green-400' : 'border-surface-high text-outline'} uppercase">
          ${escapeHTML(ev.status || 'upcoming')}
        </span>
      </div>
    `;
  }).join('');
}

window.toggleEventSelectionInPicker = function(eventId) {
  const id = String(eventId);
  const idx = HomepageContentState.eventsPickerSelectedIds.indexOf(id);
  if (idx >= 0) {
    HomepageContentState.eventsPickerSelectedIds.splice(idx, 1);
  } else {
    HomepageContentState.eventsPickerSelectedIds.push(id);
  }
  renderEventsPickerList();
};

window.saveFeaturedEventsSelection = function() {
  HomepageContentState.selectedEventIds = [...HomepageContentState.eventsPickerSelectedIds];
  closeEventsPickerModal();
  renderFeaturedEventsList();
  markContentDirty();
  showToast(`Featured events selection updated (${HomepageContentState.selectedEventIds.length} chosen).`, 'success');
};

// 21.9 Draft vs Publish Workflow Actions
window.saveHomepageDraft = async function() {
  const saveBtn = document.getElementById('content-save-draft-btn');
  if (saveBtn) saveBtn.disabled = true;

  try {
    const payload = collectContentFormData();

    const res = await apiFetch('/api/admin/content/home/draft', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to save draft');

    HomepageContentState.draftData = json.data;
    HomepageContentState.isDirty = false;
    updateSaveDraftButtonState();
    updateContentStatusUI(true, json.data ? json.data.updatedAt : null);

    showToast('Homepage draft saved successfully. Changes isolated from live visitors.', 'success');

  } catch (err) {
    console.error('Draft Save Error:', err);
    showToast(err.message || 'Error saving draft.', 'error');
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
};

window.publishHomepageContent = async function() {
  const pubBtn = document.getElementById('content-publish-btn');
  if (pubBtn) pubBtn.disabled = true;

  try {
    const payload = collectContentFormData();

    // Direct publish endpoint
    const res = await apiFetch('/api/admin/content/home', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to publish live content');

    HomepageContentState.publishedData = json.data;
    HomepageContentState.draftData = null;
    HomepageContentState.isDirty = false;

    updateSaveDraftButtonState();
    updateContentStatusUI(false, json.data ? json.data.updatedAt : null);

    showToast('Homepage content published live! All changes are now active on the public site.', 'success');

  } catch (err) {
    console.error('Publish Error:', err);
    showToast(err.message || 'Error publishing content.', 'error');
  } finally {
    if (pubBtn) pubBtn.disabled = false;
  }
};

window.discardContentChanges = function() {
  const unsavedModal = document.getElementById('content-unsaved-modal');
  if (unsavedModal) {
    unsavedModal.classList.remove('hidden');
    unsavedModal.classList.add('flex');
  }
};

window.confirmDiscardContentChanges = async function() {
  closeContentUnsavedModal();

  try {
    const res = await apiFetch('/api/admin/content/home/discard', {
      method: 'POST'
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to discard draft');

    HomepageContentState.draftData = null;
    HomepageContentState.activeData = JSON.parse(JSON.stringify(HomepageContentState.publishedData || {}));
    populateContentForm(HomepageContentState.activeData);
    renderFeaturedWorksList();
    renderFeaturedEventsList();

    HomepageContentState.isDirty = false;
    updateSaveDraftButtonState();
    updateContentStatusUI(false, HomepageContentState.publishedData ? HomepageContentState.publishedData.updatedAt : null);

    showToast('Draft changes discarded. Reverted to live published content.', 'info');

    // If pending navigation was intercepted, proceed
    if (HomepageContentState.pendingNavSection) {
      const target = HomepageContentState.pendingNavSection;
      HomepageContentState.pendingNavSection = null;
      navigateToAdminSection(target);
    }

  } catch (err) {
    console.error('Discard Error:', err);
    showToast(err.message || 'Error discarding changes.', 'error');
  }
};

window.closeContentUnsavedModal = function() {
  const unsavedModal = document.getElementById('content-unsaved-modal');
  if (unsavedModal) {
    unsavedModal.classList.add('hidden');
    unsavedModal.classList.remove('flex');
  }
  HomepageContentState.pendingNavSection = null;
};

// 21.10 Preview Summary Modal
window.openHomepagePreviewModal = function() {
  const modal = document.getElementById('content-preview-modal');
  if (!modal) return;

  const data = collectContentFormData();
  const hero = data.hero || {};
  const manifesto = data.manifesto || {};

  const badgeEl = document.getElementById('preview-cms-badge');
  const h1El = document.getElementById('preview-cms-heading-1');
  const h2El = document.getElementById('preview-cms-heading-2');
  const subEl = document.getElementById('preview-cms-subheading');
  const cta1El = document.getElementById('preview-cms-cta-1');
  const cta2El = document.getElementById('preview-cms-cta-2');

  const mTagEl = document.getElementById('preview-cms-manifesto-tag');
  const mHeadingEl = document.getElementById('preview-cms-manifesto-heading');
  const mHighlightEl = document.getElementById('preview-cms-manifesto-highlight');
  const mBodyEl = document.getElementById('preview-cms-manifesto-body');

  const metric1 = document.getElementById('preview-cms-metric-1');
  const metric2 = document.getElementById('preview-cms-metric-2');
  const metric3 = document.getElementById('preview-cms-metric-3');
  const metric4 = document.getElementById('preview-cms-metric-4');

  if (badgeEl) badgeEl.textContent = hero.badgeLabel || 'STUDENT MEDIA COLLECTIVE • VOL. 03';
  if (h1El) h1El.textContent = hero.headingLine1 || 'We Frame';
  if (h2El) h2El.textContent = hero.headingLine2 || 'The Moment.';
  if (subEl) subEl.textContent = hero.subheading || 'Resolution supporting description...';
  if (cta1El) cta1El.textContent = hero.primaryCtaText || 'Explore Selected Work';
  if (cta2El) cta2El.textContent = hero.secondaryCtaText || 'Play Showreel 2026';

  if (mTagEl) mTagEl.textContent = manifesto.tag || '01 // MANIFESTO & POSITION';
  if (mHeadingEl) mHeadingEl.innerHTML = `${escapeHTML(manifesto.heading || '')} <span class="italic text-primary" id="preview-cms-manifesto-highlight">${escapeHTML(manifesto.italicHighlight || '')}</span>`;
  if (mBodyEl) mBodyEl.textContent = manifesto.body || '';

  if (metric1) metric1.textContent = manifesto.productionsCount || '48+';
  if (metric2) metric2.textContent = manifesto.laurelsCount || '12';
  if (metric3) metric3.textContent = manifesto.preservedFramesCount || '140K+';
  if (metric4) metric4.textContent = manifesto.creatorsCount || '200+';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeHomepagePreviewModal = function() {
  const modal = document.getElementById('content-preview-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// =========================================================================
// 22. STEP 9: About & Milestones CMS Controller
// =========================================================================

const AboutState = {
  publishedData: null,
  draftData: null,
  activeData: {},
  isDirty: false,
  activeTab: 'origin',
  pendingNavSection: null,
  coreValues: [],
  milestones: [],
  milestonesTotal: 0,
  milestonesMetrics: { total: 0, published: 0, draft: 0, archived: 0 },
  milestonesSearch: '',
  milestonesStatus: 'all',
  milestonesCategory: 'all',
  milestonesSort: 'order_asc',
  activeMilestoneId: null,
  activeValueId: null
};

window.AboutState = AboutState;

// 22.1 Tab Navigation
window.switchAboutTab = function(tabName) {
  AboutState.activeTab = tabName;

  const panels = document.querySelectorAll('.about-tab-panel');
  panels.forEach(p => p.classList.add('hidden'));

  const activePanel = document.getElementById(`tab-panel-about-${tabName}`);
  if (activePanel) activePanel.classList.remove('hidden');

  const tabs = ['origin', 'mission', 'values', 'milestones', 'media', 'history'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-about-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.className = 'px-4 py-2.5 font-bold uppercase tracking-wider transition-colors border-b-2 border-primary text-primary flex items-center gap-1.5 flex-shrink-0 cursor-pointer';
      } else {
        btn.className = 'px-4 py-2.5 font-bold uppercase tracking-wider transition-colors border-b-2 border-transparent text-outline hover:text-on-surface flex items-center gap-1.5 flex-shrink-0 cursor-pointer';
      }
    }
  });

  if (tabName === 'history') {
    updateAboutJsonPreview();
  }
};

// 22.2 Dirty State Management
window.markAboutDirty = function() {
  AboutState.isDirty = true;
  updateSaveAboutDraftButtonState();
};

function updateSaveAboutDraftButtonState() {
  const saveDraftBtn = document.getElementById('btn-save-about-draft');
  if (saveDraftBtn) {
    if (AboutState.isDirty) {
      saveDraftBtn.classList.add('border-amber-400', 'text-amber-300', 'bg-amber-950/20');
    } else {
      saveDraftBtn.classList.remove('border-amber-400', 'text-amber-300', 'bg-amber-950/20');
    }
  }
}

function updateAboutStatusUI(hasDraft, updatedAt) {
  const statusBadge = document.getElementById('about-status-badge');
  const infoText = document.getElementById('about-last-published-info');
  const navBadge = document.getElementById('nav-about-badge');

  if (statusBadge) {
    if (hasDraft) {
      statusBadge.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-300 text-[10px] uppercase font-bold tracking-widest';
      statusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span><span>UNPUBLISHED DRAFT (ISOLATED)</span>';
    } else {
      statusBadge.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] uppercase font-bold tracking-widest';
      statusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span><span>CURRENTLY PUBLISHED</span>';
    }
  }

  if (navBadge) {
    navBadge.classList.toggle('hidden', !hasDraft);
  }

  if (infoText) {
    if (hasDraft) {
      infoText.textContent = `Draft saved ${formatRelativeTime(updatedAt)}. Not visible on live public site until published.`;
    } else {
      infoText.textContent = `Live on public About page • Synced ${formatRelativeTime(updatedAt)}`;
    }
  }
}

// 22.3 Load Admin About Content
window.loadAdminAboutContent = async function(isManual = false) {
  try {
    const res = await apiFetch('/api/admin/about');
    if (!res.ok) throw new Error(`About API returned status ${res.status}`);

    const json = await res.json();
    if (!json.success || !json.data) throw new Error(json.message || 'Invalid about data');

    AboutState.publishedData = json.data.published || {};
    AboutState.draftData = json.data.draft || null;
    AboutState.isDirty = false;

    // Use draft if exists, else published
    AboutState.activeData = AboutState.draftData
      ? JSON.parse(JSON.stringify(AboutState.draftData))
      : JSON.parse(JSON.stringify(AboutState.publishedData));

    populateAboutForm(AboutState.activeData);
    updateAboutStatusUI(Boolean(AboutState.draftData), (AboutState.draftData || AboutState.publishedData).updatedAt);

    if (isManual) {
      showToast('About CMS synchronized with server.', 'success');
    }
  } catch (err) {
    console.error('Failed to load about content:', err);
    showToast(err.message || 'Error loading About data', 'error');
  }
};

// 22.4 Populate About Form Inputs
window.populateAboutForm = function(data) {
  if (!data) return;

  // Origin
  const tagEl = document.getElementById('input-about-origin-tag');
  const headEl = document.getElementById('input-about-origin-heading');
  const storyEl = document.getElementById('input-about-origin-story');
  const quoteEl = document.getElementById('input-about-origin-quote');
  const authorEl = document.getElementById('input-about-origin-quote-author');

  if (tagEl) tagEl.value = data.aboutOriginTag || '01 // ORIGIN & FOUNDATION';
  if (headEl) headEl.value = data.aboutOriginHeading || 'Formed in the darkroom, driven by vision.';
  if (storyEl) storyEl.value = data.aboutOriginStory || '';
  if (quoteEl) quoteEl.value = data.aboutOriginQuote || '';
  if (authorEl) authorEl.value = data.aboutOriginQuoteAuthor || 'MONISHWARAN — FOUNDER & CREATIVE DIRECTOR';

  // Mission
  const mHeadEl = document.getElementById('input-about-mission-heading');
  const mStmtEl = document.getElementById('input-about-mission-statement');
  const mSuppEl = document.getElementById('input-about-mission-supporting');

  if (mHeadEl) mHeadEl.value = data.aboutMissionHeading || 'Our Creative Mandate';
  if (mStmtEl) mStmtEl.value = data.aboutMissionStatement || '';
  if (mSuppEl) mSuppEl.value = data.aboutMissionSupporting || '';

  // Chapter Base
  const base = data.aboutChapterBase || {};
  const deptEl = document.getElementById('input-about-chapter-dept');
  const coordsEl = document.getElementById('input-about-chapter-coords');
  const copyEl = document.getElementById('input-about-chapter-copyright');
  const licEl = document.getElementById('input-about-chapter-license');

  if (deptEl) deptEl.value = base.department || 'DEPARTMENT OF VISUAL ARTS // RESOLUTION LAB 04';
  if (coordsEl) coordsEl.value = base.coordinates || '13.0827° N, 80.2707° E';
  if (copyEl) copyEl.value = base.copyrightText || '© 2026 RESOLUTION MEDIA COLLECTIVE. ALL RIGHTS RESERVED.';
  if (licEl) licEl.value = base.licenseText || 'ARCHIVAL MEDIA DCI 4K • RESTRICTED EDUCATIONAL BROADCAST';

  // Core Values
  AboutState.coreValues = Array.isArray(data.aboutCoreValues) ? [...data.aboutCoreValues] : [];
  renderCoreValuesList();

  // Media Assets
  const media = data.aboutMedia || {};
  const portraitEl = document.getElementById('input-about-media-portrait');
  const studioEl = document.getElementById('input-about-media-studio');
  const darkroomEl = document.getElementById('input-about-media-darkroom');

  const prevPortrait = document.getElementById('about-portrait-preview-img');
  const prevStudio = document.getElementById('about-studio-preview-img');
  const prevDarkroom = document.getElementById('about-darkroom-preview-img');

  if (portraitEl) portraitEl.value = media.portraitUrl || '';
  if (studioEl) studioEl.value = media.studioImageUrl || '';
  if (darkroomEl) darkroomEl.value = media.darkroomImageUrl || '';

  if (prevPortrait && media.portraitUrl) prevPortrait.src = media.portraitUrl;
  if (prevStudio && media.studioImageUrl) prevStudio.src = media.studioImageUrl;
  if (prevDarkroom && media.darkroomImageUrl) prevDarkroom.src = media.darkroomImageUrl;

  updateSaveAboutDraftButtonState();
};

// 22.5 Collect Form Data Payload
function collectAboutFormData() {
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  return {
    aboutOriginTag: getVal('input-about-origin-tag'),
    aboutOriginHeading: getVal('input-about-origin-heading'),
    aboutOriginStory: getVal('input-about-origin-story'),
    aboutOriginQuote: getVal('input-about-origin-quote'),
    aboutOriginQuoteAuthor: getVal('input-about-origin-quote-author'),

    aboutMissionHeading: getVal('input-about-mission-heading'),
    aboutMissionStatement: getVal('input-about-mission-statement'),
    aboutMissionSupporting: getVal('input-about-mission-supporting'),

    aboutChapterBase: {
      department: getVal('input-about-chapter-dept'),
      coordinates: getVal('input-about-chapter-coords'),
      copyrightText: getVal('input-about-chapter-copyright'),
      licenseText: getVal('input-about-chapter-license')
    },

    aboutCoreValues: AboutState.coreValues || [],

    aboutMedia: {
      portraitUrl: getVal('input-about-media-portrait'),
      studioImageUrl: getVal('input-about-media-studio'),
      darkroomImageUrl: getVal('input-about-media-darkroom')
    }
  };
}

// 22.6 Draft vs Live Publish Workflow
window.saveAboutDraft = async function() {
  const btn = document.getElementById('btn-save-about-draft');
  if (btn) btn.disabled = true;

  try {
    const payload = collectAboutFormData();
    const res = await apiFetch('/api/admin/about/draft', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to save about draft');

    AboutState.draftData = json.data;
    AboutState.isDirty = false;
    updateSaveAboutDraftButtonState();
    updateAboutStatusUI(true, json.data ? json.data.updatedAt : null);

    showToast('About draft saved successfully. Changes isolated from live visitors.', 'success');
  } catch (err) {
    console.error('About Draft Save Error:', err);
    showToast(err.message || 'Error saving draft.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
};

window.publishAboutContent = async function() {
  const btn = document.getElementById('btn-publish-about');
  if (btn) btn.disabled = true;

  try {
    const payload = collectAboutFormData();
    const res = await apiFetch('/api/admin/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to publish live about content');

    AboutState.publishedData = json.data;
    AboutState.draftData = null;
    AboutState.isDirty = false;

    updateSaveAboutDraftButtonState();
    updateAboutStatusUI(false, json.data ? json.data.updatedAt : null);

    showToast('About content published live! Synced with public website.', 'success');
  } catch (err) {
    console.error('About Publish Error:', err);
    showToast(err.message || 'Error publishing content.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
};

window.discardAboutChanges = function() {
  const modal = document.getElementById('about-unsaved-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.confirmDiscardAboutChanges = async function() {
  closeAboutUnsavedModal();

  try {
    const res = await apiFetch('/api/admin/about/discard', { method: 'POST' });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to discard draft');

    AboutState.draftData = null;
    AboutState.activeData = JSON.parse(JSON.stringify(AboutState.publishedData || {}));
    populateAboutForm(AboutState.activeData);

    AboutState.isDirty = false;
    updateSaveAboutDraftButtonState();
    updateAboutStatusUI(false, AboutState.publishedData ? AboutState.publishedData.updatedAt : null);

    showToast('Draft changes discarded. Reverted to live published content.', 'info');

    if (AboutState.pendingNavSection) {
      const target = AboutState.pendingNavSection;
      AboutState.pendingNavSection = null;
      navigateToAdminSection(target);
    }
  } catch (err) {
    console.error('Discard Error:', err);
    showToast(err.message || 'Error discarding changes.', 'error');
  }
};

window.closeAboutUnsavedModal = function() {
  const modal = document.getElementById('about-unsaved-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  AboutState.pendingNavSection = null;
};

// 22.7 Core Values Management
function renderCoreValuesList() {
  const container = document.getElementById('about-values-list');
  const emptyEl = document.getElementById('about-values-empty');
  const badgeEl = document.getElementById('about-values-count-badge');
  if (!container) return;

  const values = AboutState.coreValues || [];
  if (badgeEl) badgeEl.textContent = String(values.length);

  if (values.length === 0) {
    container.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');

  container.innerHTML = values.map((val, idx) => {
    const id = val.id || `val-${idx}`;
    return `
      <div class="p-4 bg-surface-container border border-surface-high space-y-2 group hover:border-primary/40 transition-colors">
        <div class="flex items-center justify-between border-b border-surface-high/60 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">${escapeHTML(val.icon || 'star')}</span>
            <span class="font-bold text-on-surface text-xs uppercase">${escapeHTML(val.title)}</span>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" class="p-1 text-outline hover:text-primary cursor-pointer" onclick="openEditValueModal('${id}')" title="Edit Value">
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>
            <button type="button" class="p-1 text-outline hover:text-red-400 cursor-pointer" onclick="removeCoreValue('${id}')" title="Delete Value">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
        <p class="text-on-surface-variant text-xs leading-relaxed">${escapeHTML(val.description)}</p>
        <div class="text-[9px] font-mono text-outline">ORDER #${val.order !== undefined ? val.order : idx + 1}</div>
      </div>
    `;
  }).join('');
}

window.openAddValueModal = function() {
  AboutState.activeValueId = null;
  const modal = document.getElementById('value-form-modal');
  const titleEl = document.getElementById('value-modal-title');
  const form = document.getElementById('value-form');

  if (titleEl) titleEl.textContent = 'Add Core Value';
  if (form) form.reset();

  const orderEl = document.getElementById('input-value-order');
  if (orderEl) orderEl.value = (AboutState.coreValues.length + 1);

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.openEditValueModal = function(valueId) {
  AboutState.activeValueId = String(valueId);
  const val = AboutState.coreValues.find(v => String(v.id) === String(valueId));
  if (!val) return;

  const modal = document.getElementById('value-form-modal');
  const titleEl = document.getElementById('value-modal-title');
  if (titleEl) titleEl.textContent = 'Edit Core Value';

  const tInput = document.getElementById('input-value-title');
  const dInput = document.getElementById('input-value-description');
  const iInput = document.getElementById('input-value-icon');
  const oInput = document.getElementById('input-value-order');

  if (tInput) tInput.value = val.title || '';
  if (dInput) dInput.value = val.description || '';
  if (iInput) iInput.value = val.icon || 'star';
  if (oInput) oInput.value = val.order || 1;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeValueFormModal = function() {
  const modal = document.getElementById('value-form-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  AboutState.activeValueId = null;
};

window.handleValueFormSubmit = function(event) {
  event.preventDefault();
  const title = document.getElementById('input-value-title').value.trim();
  const desc = document.getElementById('input-value-description').value.trim();
  const icon = document.getElementById('input-value-icon').value.trim() || 'star';
  const order = parseInt(document.getElementById('input-value-order').value, 10) || 1;

  if (!title || !desc) {
    showToast('Please enter both title and description.', 'error');
    return;
  }

  if (AboutState.activeValueId) {
    // Edit existing
    const idx = AboutState.coreValues.findIndex(v => String(v.id) === String(AboutState.activeValueId));
    if (idx >= 0) {
      AboutState.coreValues[idx] = { ...AboutState.coreValues[idx], title, description: desc, icon, order };
    }
  } else {
    // Add new
    const newId = `val-${Date.now()}`;
    AboutState.coreValues.push({ id: newId, title, description: desc, icon, order });
  }

  AboutState.coreValues.sort((a, b) => (a.order || 0) - (b.order || 0));
  renderCoreValuesList();
  closeValueFormModal();
  markAboutDirty();
  showToast('Core value saved.', 'success');
};

window.removeCoreValue = function(valueId) {
  AboutState.coreValues = AboutState.coreValues.filter(v => String(v.id) !== String(valueId));
  renderCoreValuesList();
  markAboutDirty();
  showToast('Core value removed.', 'info');
};

// 22.8 Milestones Management
window.loadAdminMilestones = async function(isManual = false) {
  const skeleton = document.getElementById('milestones-loading-skeleton');
  const tableWrapper = document.getElementById('milestones-table-wrapper');
  const emptyState = document.getElementById('milestones-empty-state');
  const mobileContainer = document.getElementById('milestones-mobile-cards');

  if (skeleton) skeleton.classList.remove('hidden');
  if (tableWrapper) tableWrapper.classList.add('hidden');
  if (emptyState) emptyState.classList.add('hidden');
  if (mobileContainer) mobileContainer.classList.add('hidden');

  try {
    const params = new URLSearchParams({
      search: AboutState.milestonesSearch || '',
      status: AboutState.milestonesStatus || 'all',
      category: AboutState.milestonesCategory || 'all',
      sortBy: AboutState.milestonesSort || 'order_asc'
    });

    const res = await apiFetch(`/api/admin/milestones?${params.toString()}`);
    if (!res.ok) throw new Error(`Milestones API error: ${res.status}`);

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error(json.message || 'Invalid milestones format');

    AboutState.milestones = json.data;
    AboutState.milestonesTotal = json.total || json.data.length;
    AboutState.milestonesMetrics = json.counts || AboutState.milestonesMetrics;

    updateMilestonesMetricsBadges(AboutState.milestonesMetrics);

    if (AboutState.milestones.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (tableWrapper) tableWrapper.classList.remove('hidden');
      if (mobileContainer) mobileContainer.classList.remove('hidden');
      renderMilestonesTable(AboutState.milestones);
      renderMilestonesMobileCards(AboutState.milestones);
    }

    if (isManual) showToast('Milestones timeline synchronized.', 'success');
  } catch (err) {
    console.error('Failed to load milestones:', err);
    showToast(err.message || 'Failed to load milestones', 'error');
  } finally {
    if (skeleton) skeleton.classList.add('hidden');
  }
};

function updateMilestonesMetricsBadges(metrics) {
  if (!metrics) return;
  const tEl = document.getElementById('milestone-pill-total');
  const pEl = document.getElementById('milestone-pill-published');
  const dEl = document.getElementById('milestone-pill-draft');
  const aEl = document.getElementById('milestone-pill-archived');
  const navBadge = document.getElementById('about-milestones-count-badge');

  if (tEl) tEl.textContent = metrics.total !== undefined ? metrics.total : '0';
  if (pEl) pEl.textContent = metrics.published !== undefined ? metrics.published : '0';
  if (dEl) dEl.textContent = metrics.draft !== undefined ? metrics.draft : '0';
  if (aEl) aEl.textContent = metrics.archived !== undefined ? metrics.archived : '0';
  if (navBadge) navBadge.textContent = String(metrics.total || '0');
}

function renderMilestonesTable(milestones) {
  const tbody = document.getElementById('milestones-table-body');
  if (!tbody) return;

  const isSuperAdmin = AuthState.user && AuthState.user.role === 'admin';

  tbody.innerHTML = milestones.map((m, idx) => {
    const id = m._id || m.id;
    const isArchived = Boolean(m.isArchived || m.status === 'archived');
    const isDraft = m.status === 'draft';

    let statusClass = 'bg-green-950/40 text-green-300 border-green-500/40';
    let statusLabel = 'PUBLISHED';
    if (isArchived) {
      statusClass = 'bg-surface-container text-outline border-surface-high';
      statusLabel = 'ARCHIVED';
    } else if (isDraft) {
      statusClass = 'bg-yellow-950/40 text-yellow-300 border-yellow-500/40';
      statusLabel = 'DRAFT';
    }

    return `
      <tr class="hover:bg-surface-container/60 transition-colors group">
        <td class="py-3 px-4 text-center font-mono font-bold text-outline group-hover:text-primary">
          ${m.order !== undefined ? m.order : idx + 1}
        </td>

        <td class="py-3 px-4 font-mono font-bold text-primary">
          ${escapeHTML(m.year)}
        </td>

        <td class="py-3 px-4">
          <div class="space-y-0.5">
            <span class="font-bold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer block" onclick="openEditMilestoneModal('${id}')">
              ${escapeHTML(m.title)}
            </span>
            <p class="text-[11px] text-on-surface-variant line-clamp-2 max-w-md">
              ${escapeHTML(m.description)}
            </p>
          </div>
        </td>

        <td class="py-3 px-4">
          <span class="px-2 py-0.5 bg-surface-container border border-surface-high text-[10px] font-mono text-outline uppercase">
            ${escapeHTML(m.category || 'Milestone')}
          </span>
        </td>

        <td class="py-3 px-4 text-center">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${statusClass}">
            ${statusLabel}
          </span>
        </td>

        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1">
            <button 
              class="p-1.5 bg-surface-container hover:bg-surface-high hover:text-primary text-on-surface border border-surface-high transition-colors rounded cursor-pointer" 
              onclick="openEditMilestoneModal('${id}')" 
              title="Edit Milestone" 
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>

            <button 
              class="p-1.5 bg-surface-container hover:bg-surface-high ${isArchived ? 'text-yellow-300' : 'text-outline hover:text-yellow-300'} border border-surface-high transition-colors rounded cursor-pointer" 
              onclick="toggleArchiveMilestone('${id}')" 
              title="${isArchived ? 'Unarchive Milestone' : 'Archive Milestone'}" 
              type="button"
            >
              <span class="material-symbols-outlined text-[16px]">${isArchived ? 'unarchive' : 'archive'}</span>
            </button>

            ${isSuperAdmin ? `
              <button 
                class="p-1.5 bg-surface-container hover:bg-red-950/40 text-outline hover:text-red-400 border border-surface-high transition-colors rounded cursor-pointer" 
                onclick="openDeleteMilestoneModal('${id}')" 
                title="Delete Permanently" 
                type="button"
              >
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderMilestonesMobileCards(milestones) {
  const container = document.getElementById('milestones-mobile-cards');
  if (!container) return;

  const isSuperAdmin = AuthState.user && AuthState.user.role === 'admin';

  container.innerHTML = milestones.map(m => {
    const id = m._id || m.id;
    const isArchived = Boolean(m.isArchived || m.status === 'archived');
    const isDraft = m.status === 'draft';

    let statusClass = 'bg-green-950/40 text-green-300 border-green-500/40';
    let statusLabel = 'PUBLISHED';
    if (isArchived) {
      statusClass = 'bg-surface-container text-outline border-surface-high';
      statusLabel = 'ARCHIVED';
    } else if (isDraft) {
      statusClass = 'bg-yellow-950/40 text-yellow-300 border-yellow-500/40';
      statusLabel = 'DRAFT';
    }

    return `
      <div class="p-4 bg-surface-low border border-surface-high space-y-3">
        <div class="flex items-center justify-between border-b border-surface-high/60 pb-2">
          <div class="flex items-center gap-2">
            <span class="font-mono text-primary font-bold text-sm">${escapeHTML(m.year)}</span>
            <span class="text-[10px] font-mono text-outline">#${m.order}</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${statusClass}">${statusLabel}</span>
        </div>

        <div>
          <h4 class="font-bold text-sm text-on-surface">${escapeHTML(m.title)}</h4>
          <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">${escapeHTML(m.description)}</p>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-surface-high/60">
          <span class="px-2 py-0.5 bg-surface-container border border-surface-high text-[9px] font-mono text-outline uppercase">${escapeHTML(m.category || 'Milestone')}</span>
          <div class="flex items-center gap-1">
            <button type="button" class="p-1.5 bg-surface-container border border-surface-high text-xs" onclick="openEditMilestoneModal('${id}')">Edit</button>
            <button type="button" class="p-1.5 bg-surface-container border border-surface-high text-xs" onclick="toggleArchiveMilestone('${id}')">${isArchived ? 'Restore' : 'Archive'}</button>
            ${isSuperAdmin ? `<button type="button" class="p-1.5 bg-red-950/40 text-red-300 border border-red-500/40 text-xs" onclick="openDeleteMilestoneModal('${id}')">Delete</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 22.9 Filter & Search Event Handlers
window.handleMilestonesSearch = function(val) {
  AboutState.milestonesSearch = val.trim();
  loadAdminMilestones();
};

window.handleMilestonesStatusFilter = function(val) {
  AboutState.milestonesStatus = val;
  loadAdminMilestones();
};

window.handleMilestonesCategoryFilter = function(val) {
  AboutState.milestonesCategory = val;
  loadAdminMilestones();
};

window.handleMilestonesSortChange = function(val) {
  AboutState.milestonesSort = val;
  loadAdminMilestones();
};

// 22.10 Milestone Modal Form Lifecycle
window.openCreateMilestoneModal = function() {
  AboutState.activeMilestoneId = null;
  const modal = document.getElementById('milestone-form-modal');
  const titleEl = document.getElementById('milestone-modal-title');
  const btnText = document.getElementById('milestone-submit-btn-text');
  const form = document.getElementById('milestone-form');

  if (titleEl) titleEl.textContent = 'Add Milestone';
  if (btnText) btnText.textContent = 'Save Milestone';
  if (form) form.reset();

  const orderInput = document.getElementById('input-milestone-order');
  if (orderInput) orderInput.value = (AboutState.milestones.length + 1);

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.openEditMilestoneModal = async function(id) {
  AboutState.activeMilestoneId = String(id);
  const modal = document.getElementById('milestone-form-modal');
  const titleEl = document.getElementById('milestone-modal-title');
  const btnText = document.getElementById('milestone-submit-btn-text');

  if (titleEl) titleEl.textContent = 'Edit Milestone';
  if (btnText) btnText.textContent = 'Update Milestone';

  try {
    const res = await apiFetch(`/api/admin/milestones/${id}`);
    const json = await res.json();
    if (!res.ok || !json.success || !json.data) throw new Error(json.message || 'Error fetching milestone');

    const m = json.data;
    document.getElementById('milestone-form-id').value = m._id || m.id;
    document.getElementById('input-milestone-year').value = m.year || '';
    document.getElementById('input-milestone-category').value = m.category || 'Milestone';
    document.getElementById('input-milestone-title').value = m.title || '';
    document.getElementById('input-milestone-description').value = m.description || '';
    document.getElementById('input-milestone-order').value = m.order !== undefined ? m.order : 1;
    document.getElementById('input-milestone-status').value = m.status || 'published';
    document.getElementById('input-milestone-image').value = m.image || '';

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  } catch (err) {
    console.error('Fetch milestone error:', err);
    showToast(err.message || 'Failed to load milestone details', 'error');
  }
};

window.handleCloseMilestoneForm = function() {
  const modal = document.getElementById('milestone-form-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  AboutState.activeMilestoneId = null;
};

window.handleMilestoneFormSubmit = async function(event) {
  event.preventDefault();
  const btn = document.getElementById('btn-milestone-submit');
  if (btn) btn.disabled = true;

  const id = document.getElementById('milestone-form-id').value;
  const payload = {
    year: document.getElementById('input-milestone-year').value.trim(),
    category: document.getElementById('input-milestone-category').value,
    title: document.getElementById('input-milestone-title').value.trim(),
    description: document.getElementById('input-milestone-description').value.trim(),
    order: parseInt(document.getElementById('input-milestone-order').value, 10) || 1,
    status: document.getElementById('input-milestone-status').value,
    image: document.getElementById('input-milestone-image').value.trim()
  };

  try {
    const url = id ? `/api/admin/milestones/${id}` : '/api/admin/milestones';
    const method = id ? 'PUT' : 'POST';

    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to save milestone');

    handleCloseMilestoneForm();
    loadAdminMilestones();
    showToast(`Milestone ${id ? 'updated' : 'created'} successfully.`, 'success');
  } catch (err) {
    console.error('Milestone save error:', err);
    showToast(err.message || 'Error saving milestone', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
};

window.toggleArchiveMilestone = async function(id) {
  try {
    const res = await apiFetch(`/api/admin/milestones/${id}/archive`, { method: 'PATCH' });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to toggle archive');

    loadAdminMilestones();
    showToast(`Milestone status updated to ${json.data.status.toUpperCase()}.`, 'info');
  } catch (err) {
    console.error('Archive error:', err);
    showToast(err.message || 'Error updating status', 'error');
  }
};

window.openDeleteMilestoneModal = function(id) {
  AboutState.activeMilestoneId = String(id);
  const m = AboutState.milestones.find(item => String(item._id || item.id) === String(id));
  const titleEl = document.getElementById('milestone-delete-title');
  if (titleEl && m) {
    titleEl.textContent = `"${m.title}" (${m.year})`;
  }

  const modal = document.getElementById('milestone-delete-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeDeleteMilestoneModal = function() {
  const modal = document.getElementById('milestone-delete-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  AboutState.activeMilestoneId = null;
};

window.executeDeleteMilestone = async function() {
  if (!AboutState.activeMilestoneId) return;
  const btn = document.getElementById('btn-confirm-delete-milestone');
  if (btn) btn.disabled = true;

  try {
    const res = await apiFetch(`/api/admin/milestones/${AboutState.activeMilestoneId}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to delete milestone');

    closeDeleteMilestoneModal();
    loadAdminMilestones();
    showToast('Milestone record permanently deleted.', 'success');
  } catch (err) {
    console.error('Delete error:', err);
    showToast(err.message || 'Failed to delete milestone', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
};

// 22.11 Reorder Milestones Timeline
window.openMilestonesReorderModal = function() {
  const modal = document.getElementById('milestone-reorder-modal');
  if (!modal) return;

  renderMilestonesReorderList();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeMilestonesReorderModal = function() {
  const modal = document.getElementById('milestone-reorder-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

function renderMilestonesReorderList() {
  const container = document.getElementById('milestones-reorder-list');
  if (!container) return;

  const list = [...AboutState.milestones].sort((a, b) => (a.order || 0) - (b.order || 0));

  container.innerHTML = list.map((m, idx) => {
    return `
      <div class="p-3 bg-surface-container border border-surface-high flex items-center justify-between gap-3 group">
        <div class="flex items-center gap-3 min-w-0">
          <span class="w-6 h-6 rounded bg-surface-low border border-surface-high font-mono text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
            ${idx + 1}
          </span>
          <div class="min-w-0">
            <div class="text-xs font-bold text-on-surface uppercase truncate">${escapeHTML(m.title)}</div>
            <div class="text-[10px] text-outline font-mono">${escapeHTML(m.year)} &bull; ${escapeHTML(m.category || 'Milestone')}</div>
          </div>
        </div>

        <div class="flex items-center gap-1 flex-shrink-0">
          <button type="button" class="p-1 text-outline hover:text-primary cursor-pointer disabled:opacity-20" ${idx === 0 ? 'disabled' : ''} onclick="moveMilestoneInReorder(${idx}, -1)">
            <span class="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
          <button type="button" class="p-1 text-outline hover:text-primary cursor-pointer disabled:opacity-20" ${idx === list.length - 1 ? 'disabled' : ''} onclick="moveMilestoneInReorder(${idx}, 1)">
            <span class="material-symbols-outlined text-[18px]">arrow_downward</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.moveMilestoneInReorder = function(idx, dir) {
  const list = [...AboutState.milestones].sort((a, b) => (a.order || 0) - (b.order || 0));
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= list.length) return;

  const temp = list[idx];
  list[idx] = list[targetIdx];
  list[targetIdx] = temp;

  list.forEach((item, index) => {
    item.order = index + 1;
  });

  AboutState.milestones = list;
  renderMilestonesReorderList();
};

window.saveMilestonesReorder = async function() {
  try {
    const list = [...AboutState.milestones].sort((a, b) => (a.order || 0) - (b.order || 0));
    const items = list.map((m, idx) => ({ id: m._id || m.id, order: idx + 1 }));

    const res = await apiFetch('/api/admin/milestones/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to save milestone ordering');

    closeMilestonesReorderModal();
    loadAdminMilestones();
    showToast('Milestone sequence reordered successfully.', 'success');
  } catch (err) {
    console.error('Reorder error:', err);
    showToast(err.message || 'Error reordering milestones', 'error');
  }
};

window.handleMilestoneImageUpload = async function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    showToast('Uploading milestone media...', 'info');
    const res = await apiFetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Upload failed');

    const input = document.getElementById('input-milestone-image');
    if (input) input.value = json.url;
    showToast('Milestone media uploaded successfully.', 'success');
  } catch (err) {
    console.error('Milestone image upload error:', err);
    showToast(err.message || 'Upload failed', 'error');
  }
};

// 22.12 Media Asset Upload Handlers
window.handleAboutAssetUpload = async function(event, type) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    showToast(`Uploading ${type} asset...`, 'info');
    const res = await apiFetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Upload failed');

    handleAboutAssetUrlChange(type, json.url);
    showToast(`${type} asset uploaded and linked.`, 'success');
  } catch (err) {
    console.error('Asset upload error:', err);
    showToast(err.message || 'Asset upload failed', 'error');
  }
};

window.handleAboutAssetUrlChange = function(type, url) {
  const inputEl = document.getElementById(`input-about-media-${type}`);
  const previewEl = document.getElementById(`about-${type}-preview-img`);

  if (inputEl) inputEl.value = url;
  if (previewEl && url) previewEl.src = url;

  markAboutDirty();
};

// 22.13 Live Presentation Preview Modal
window.openAboutPreviewModal = function() {
  const modal = document.getElementById('about-preview-modal');
  if (!modal) return;

  const data = collectAboutFormData();
  const base = data.aboutChapterBase || {};

  const tagEl = document.getElementById('preview-about-origin-tag');
  const headEl = document.getElementById('preview-about-origin-heading');
  const storyEl = document.getElementById('preview-about-origin-story');
  const quoteEl = document.getElementById('preview-about-quote');
  const authEl = document.getElementById('preview-about-quote-author');

  const mHeadEl = document.getElementById('preview-about-mission-heading');
  const mStmtEl = document.getElementById('preview-about-mission-statement');
  const deptEl = document.getElementById('preview-about-dept');
  const coordsEl = document.getElementById('preview-about-coords');
  const valGrid = document.getElementById('preview-about-values-grid');

  if (tagEl) tagEl.textContent = data.aboutOriginTag || '01 // ORIGIN & FOUNDATION';
  if (headEl) headEl.textContent = data.aboutOriginHeading || 'Formed in the darkroom, driven by vision.';
  if (storyEl) storyEl.textContent = data.aboutOriginStory || '';
  if (quoteEl) quoteEl.textContent = `"${data.aboutOriginQuote || ''}"`;
  if (authEl) authEl.textContent = `— ${data.aboutOriginQuoteAuthor || 'CURATORIAL LEAD'}`;

  if (mHeadEl) mHeadEl.textContent = data.aboutMissionHeading || 'Creative Mandate';
  if (mStmtEl) mStmtEl.textContent = data.aboutMissionStatement || '';
  if (deptEl) deptEl.textContent = base.department || 'DEPARTMENT OF VISUAL ARTS // LAB 04';
  if (coordsEl) coordsEl.textContent = base.coordinates || '13.0827° N, 80.2707° E';

  if (valGrid) {
    const values = data.aboutCoreValues || [];
    valGrid.innerHTML = values.map(v => `
      <div class="p-3 bg-surface-container border border-surface-high">
        <div class="flex items-center gap-2 text-primary text-xs font-bold uppercase">
          <span class="material-symbols-outlined text-[16px]">${escapeHTML(v.icon || 'star')}</span>
          <span>${escapeHTML(v.title)}</span>
        </div>
        <p class="text-[11px] text-on-surface-variant mt-1">${escapeHTML(v.description)}</p>
      </div>
    `).join('');
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeAboutPreviewModal = function() {
  const modal = document.getElementById('about-preview-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// 22.14 Schema Inspector
function updateAboutJsonPreview() {
  const preview = document.getElementById('about-json-preview');
  if (!preview) return;

  const data = collectAboutFormData();
  preview.textContent = JSON.stringify(data, null, 2);
}

window.copyAboutJsonSchema = function() {
  const data = collectAboutFormData();
  navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    .then(() => showToast('About schema JSON copied to clipboard.', 'success'))
    .catch(() => showToast('Failed to copy to clipboard.', 'error'));
};

// =========================================================================
// 23. STEP 10: MEDIA LIBRARY & ASSET MANAGEMENT CONTROLLER
// =========================================================================

// Central Media Library State
const MediaState = {
  assets: [],
  stats: {
    totalAssets: 0,
    imagesCount: 0,
    videosCount: 0,
    vectorsCount: 0,
    totalStorageBytes: 0,
    totalStorageFormatted: '0 B',
    usedCount: 0,
    unusedCount: 0
  },
  pagination: {
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 1
  },
  filters: {
    search: '',
    type: 'all',
    usage: 'all',
    sort: 'newest'
  },
  viewMode: 'grid', // 'grid' | 'list'
  selectedAsset: null,
  pendingUploadFiles: [],
  replacementTargetAsset: null,
  replacementFile: null,
  searchDebounceTimer: null
};

// Helper: Format bytes to human readable format
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = 1;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 23.1 Fetch and Load Media Assets from REST API
window.loadAdminMedia = async function() {
  const loading = document.getElementById('media-loading-state');
  const errorBanner = document.getElementById('media-error-banner');
  const emptyState = document.getElementById('media-empty-state');
  const gridContainer = document.getElementById('media-grid-container');
  const listContainer = document.getElementById('media-list-container');
  const paginationContainer = document.getElementById('media-pagination-container');

  if (loading) loading.classList.remove('hidden');
  if (errorBanner) errorBanner.classList.add('hidden');
  if (emptyState) emptyState.classList.add('hidden');

  try {
    const params = new URLSearchParams({
      page: MediaState.pagination.page,
      limit: MediaState.pagination.limit,
      search: MediaState.filters.search,
      type: MediaState.filters.type,
      usage: MediaState.filters.usage,
      sort: MediaState.filters.sort
    });

    const res = await apiFetch(`/api/admin/media?${params.toString()}`);
    if (!res.ok) throw new Error(`Server returned status ${res.status}`);
    const data = await res.json();

    if (data.success) {
      MediaState.assets = data.assets || [];
      if (data.stats) MediaState.stats = data.stats;
      if (data.pagination) MediaState.pagination = data.pagination;

      updateMediaStatsUI();

      // Synchronize Sidebar Badge with Total Assets
      const sidebarBadge = document.getElementById('nav-media-badge');
      if (sidebarBadge) {
        sidebarBadge.textContent = MediaState.stats.totalAssets;
        sidebarBadge.classList.toggle('hidden', MediaState.stats.totalAssets === 0);
      }

      if (loading) loading.classList.add('hidden');

      if (MediaState.assets.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        if (gridContainer) gridContainer.classList.add('hidden');
        if (listContainer) listContainer.classList.add('hidden');
        if (paginationContainer) paginationContainer.classList.add('hidden');
      } else {
        if (emptyState) emptyState.classList.add('hidden');
        if (paginationContainer) paginationContainer.classList.remove('hidden');

        if (MediaState.viewMode === 'grid') {
          if (gridContainer) gridContainer.classList.remove('hidden');
          if (listContainer) listContainer.classList.add('hidden');
          renderMediaGrid();
        } else {
          if (gridContainer) gridContainer.classList.add('hidden');
          if (listContainer) listContainer.classList.remove('hidden');
          renderMediaList();
        }

        renderMediaPagination();
      }
    }
  } catch (err) {
    console.error('Error loading media assets:', err);
    if (loading) loading.classList.add('hidden');
    if (errorBanner) {
      errorBanner.classList.remove('hidden');
      const msg = document.getElementById('media-error-message');
      if (msg) msg.textContent = `Failed to load media assets: ${err.message}`;
    }
  }
};

// 23.2 Update Top KPI Storage Bar
function updateMediaStatsUI() {
  const statTotal = document.getElementById('media-stat-total');
  const statImages = document.getElementById('media-stat-images');
  const statVideos = document.getElementById('media-stat-videos');
  const statStorage = document.getElementById('media-stat-storage');
  const statUnused = document.getElementById('media-stat-unused');

  if (statTotal) statTotal.textContent = MediaState.stats.totalAssets;
  if (statImages) statImages.textContent = MediaState.stats.imagesCount;
  if (statVideos) statVideos.textContent = MediaState.stats.videosCount;
  if (statStorage) statStorage.textContent = MediaState.stats.totalStorageFormatted;
  if (statUnused) statUnused.textContent = MediaState.stats.unusedCount;
}

// 23.3 Render Media Grid Cards
function renderMediaGrid() {
  const container = document.getElementById('media-grid-items');
  if (!container) return;

  container.innerHTML = MediaState.assets.map(asset => {
    const isVideo = asset.mediaType === 'video' || (asset.mimeType && asset.mimeType.startsWith('video/'));
    const isVector = asset.mediaType === 'vector' || asset.mimeType === 'image/svg+xml';
    const formattedSize = formatBytes(asset.size);
    const refCount = asset.referenceCount || (asset.references ? asset.references.length : 0);
    const isUsed = refCount > 0;

    const usageBadge = isUsed
      ? `<span class="px-1.5 py-0.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono font-bold flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Used (${refCount})</span>
        </span>`
      : `<span class="px-1.5 py-0.5 bg-yellow-950/70 border border-yellow-500/40 text-yellow-300 text-[9px] font-mono font-bold flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
          <span>Unused</span>
        </span>`;

    let visualContent = '';
    if (isVideo) {
      visualContent = `
        <div class="w-full h-full bg-surface-lowest flex flex-col items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
          <span class="material-symbols-outlined text-[36px] text-purple-400">play_circle</span>
          <span class="text-[9px] font-mono text-purple-300 uppercase mt-1">4K REEL / MP4</span>
        </div>
      `;
    } else if (isVector) {
      visualContent = `
        <div class="w-full h-full bg-surface-container/30 p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <img src="${escapeHTML(asset.url)}" alt="${escapeHTML(asset.altText || asset.filename)}" class="max-w-full max-h-full object-contain" />
        </div>
      `;
    } else {
      visualContent = `
        <img 
          src="${escapeHTML(asset.url)}" 
          alt="${escapeHTML(asset.altText || asset.filename)}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          loading="lazy"
        />
      `;
    }

    return `
      <div 
        class="bg-surface-low border border-surface-high hover:border-primary/60 transition-all flex flex-col overflow-hidden group cursor-pointer shadow-sm relative camera-frame-box"
        onclick="openMediaPreview('${asset._id}')"
      >
        <!-- Thumbnail Container -->
        <div class="w-full aspect-[4/3] bg-surface-lowest overflow-hidden relative">
          ${visualContent}
          <div class="absolute top-2 left-2 z-10">
            ${usageBadge}
          </div>
          <div class="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-xs text-[9px] font-mono text-outline z-10">
            ${formattedSize}
          </div>
        </div>

        <!-- Meta Details -->
        <div class="p-2.5 space-y-1 bg-surface-low flex-1 flex flex-col justify-between">
          <div class="overflow-hidden">
            <span class="text-xs font-mono font-bold text-on-surface truncate block" title="${escapeHTML(asset.originalName || asset.filename)}">
              ${escapeHTML(asset.originalName || asset.filename)}
            </span>
            <span class="text-[10px] text-outline font-mono truncate block">
              ${escapeHTML(asset.mimeType || 'image/jpeg')}
            </span>
          </div>

          <!-- Quick Action Bar -->
          <div class="flex items-center justify-between pt-1 border-t border-surface-high/50 text-[10px] text-outline">
            <span>${formatRelativeTime(asset.createdAt)}</span>
            <span class="text-primary group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 23.4 Render Media List Table Rows
function renderMediaList() {
  const tbody = document.getElementById('media-table-body');
  if (!tbody) return;

  tbody.innerHTML = MediaState.assets.map(asset => {
    const isVideo = asset.mediaType === 'video' || (asset.mimeType && asset.mimeType.startsWith('video/'));
    const isVector = asset.mediaType === 'vector' || asset.mimeType === 'image/svg+xml';
    const formattedSize = formatBytes(asset.size);
    const refCount = asset.referenceCount || (asset.references ? asset.references.length : 0);
    const isUsed = refCount > 0;

    let thumbHtml = '';
    if (isVideo) {
      thumbHtml = `<div class="w-12 h-12 bg-surface-lowest rounded-xs flex items-center justify-center text-purple-400 border border-surface-high"><span class="material-symbols-outlined text-[20px]">videocam</span></div>`;
    } else {
      thumbHtml = `<img src="${escapeHTML(asset.url)}" alt="Thumbnail" class="w-12 h-12 object-cover rounded-xs border border-surface-high" loading="lazy" />`;
    }

    const usageBadge = isUsed
      ? `<span class="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold inline-flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Used (${refCount})</span>
        </span>`
      : `<span class="px-2 py-0.5 bg-yellow-950/60 border border-yellow-500/40 text-yellow-300 text-[10px] font-mono font-bold inline-flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
          <span>Unused</span>
        </span>`;

    return `
      <tr class="hover:bg-surface-container/50 transition-colors">
        <td class="p-3 cursor-pointer" onclick="openMediaPreview('${asset._id}')">
          ${thumbHtml}
        </td>
        <td class="p-3 cursor-pointer" onclick="openMediaPreview('${asset._id}')">
          <span class="font-mono text-xs font-bold text-on-surface hover:text-primary transition-colors block truncate max-w-xs sm:max-w-md">
            ${escapeHTML(asset.originalName || asset.filename)}
          </span>
          <span class="text-[10px] text-outline font-mono block">
            ${escapeHTML(asset.url)}
          </span>
        </td>
        <td class="p-3 font-mono text-[11px] text-on-surface-variant">
          ${escapeHTML(asset.mimeType || 'image/jpeg')}
        </td>
        <td class="p-3 font-mono text-[11px] text-on-surface font-bold">
          ${formattedSize}
        </td>
        <td class="p-3">
          ${usageBadge}
        </td>
        <td class="p-3 font-mono text-[11px] text-outline">
          ${formatRelativeTime(asset.createdAt)}
        </td>
        <td class="p-3 text-right">
          <div class="flex items-center justify-end gap-1">
            <button class="p-1 text-outline hover:text-primary transition-colors cursor-pointer" title="Preview Asset" onclick="openMediaPreview('${asset._id}')" type="button">
              <span class="material-symbols-outlined text-[16px]">visibility</span>
            </button>
            <button class="p-1 text-outline hover:text-primary transition-colors cursor-pointer" title="Copy URL" onclick="copyMediaUrl('${asset.url}')" type="button">
              <span class="material-symbols-outlined text-[16px]">content_copy</span>
            </button>
            <button class="p-1 text-outline hover:text-primary transition-colors cursor-pointer" title="Replace Asset" onclick="openMediaReplaceModal('${asset._id}')" type="button">
              <span class="material-symbols-outlined text-[16px]">sync</span>
            </button>
            <button class="p-1 text-outline hover:text-red-400 transition-colors cursor-pointer" title="Delete Asset" onclick="openMediaDeleteModal('${asset._id}')" type="button">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 23.5 Pagination Controls Render
function renderMediaPagination() {
  const { page, totalPages, total, limit } = MediaState.pagination;
  const info = document.getElementById('media-pagination-info');
  const prevBtn = document.getElementById('media-pagination-prev');
  const nextBtn = document.getElementById('media-pagination-next');
  const pagesContainer = document.getElementById('media-pagination-pages');

  if (info) {
    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(total, page * limit);
    info.textContent = `Showing ${start}–${end} of ${total} assets`;
  }

  if (prevBtn) prevBtn.disabled = page <= 1;
  if (nextBtn) nextBtn.disabled = page >= totalPages;

  if (pagesContainer) {
    let pagesHtml = '';
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
        const isActive = p === page;
        pagesHtml += `
          <button 
            class="w-7 h-7 font-mono text-xs font-bold ${isActive ? 'bg-primary text-black' : 'bg-surface-container hover:bg-surface-high text-on-surface'} transition-colors cursor-pointer" 
            onclick="goToMediaPage(${p})" 
            type="button"
          >
            ${p}
          </button>
        `;
      }
    }
    pagesContainer.innerHTML = pagesHtml;
  }
}

// 23.6 Filter & View Mode Controls
window.setMediaTypeFilter = function(type) {
  MediaState.filters.type = type;
  MediaState.pagination.page = 1;

  ['all', 'image', 'video', 'vector'].forEach(t => {
    const btn = document.getElementById(`media-type-${t}`);
    if (btn) {
      if (t === type) {
        btn.className = 'px-2.5 py-1 bg-primary text-black font-bold uppercase text-[10px] cursor-pointer';
      } else {
        btn.className = 'px-2.5 py-1 text-outline hover:text-on-surface uppercase text-[10px] cursor-pointer';
      }
    }
  });

  loadAdminMedia();
};

window.setMediaUsageFilter = function(usage) {
  MediaState.filters.usage = usage;
  MediaState.pagination.page = 1;

  ['all', 'used', 'unused'].forEach(u => {
    const btn = document.getElementById(`media-usage-${u}`);
    if (btn) {
      if (u === usage) {
        btn.className = 'px-2.5 py-1 bg-surface-container text-on-surface font-bold uppercase text-[10px] cursor-pointer';
      } else {
        btn.className = 'px-2.5 py-1 text-outline hover:text-on-surface uppercase text-[10px] cursor-pointer';
      }
    }
  });

  loadAdminMedia();
};

window.handleMediaSearchInput = function(val) {
  const clearBtn = document.getElementById('media-search-clear');
  if (clearBtn) clearBtn.classList.toggle('hidden', !val || !val.trim());

  if (MediaState.searchDebounceTimer) clearTimeout(MediaState.searchDebounceTimer);
  MediaState.searchDebounceTimer = setTimeout(() => {
    MediaState.filters.search = val.trim();
    MediaState.pagination.page = 1;
    loadAdminMedia();
  }, 250);
};

window.clearMediaSearch = function() {
  const input = document.getElementById('media-search-input');
  if (input) input.value = '';
  const clearBtn = document.getElementById('media-search-clear');
  if (clearBtn) clearBtn.classList.add('hidden');
  MediaState.filters.search = '';
  MediaState.pagination.page = 1;
  loadAdminMedia();
};

window.handleMediaSortChange = function(val) {
  MediaState.filters.sort = val;
  MediaState.pagination.page = 1;
  loadAdminMedia();
};

window.setMediaViewMode = function(mode) {
  MediaState.viewMode = mode;
  const gridBtn = document.getElementById('media-view-grid-btn');
  const listBtn = document.getElementById('media-view-list-btn');

  if (gridBtn && listBtn) {
    if (mode === 'grid') {
      gridBtn.className = 'p-1 bg-surface-container text-primary cursor-pointer';
      listBtn.className = 'p-1 text-outline hover:text-on-surface cursor-pointer';
    } else {
      gridBtn.className = 'p-1 text-outline hover:text-on-surface cursor-pointer';
      listBtn.className = 'p-1 bg-surface-container text-primary cursor-pointer';
    }
  }

  loadAdminMedia();
};

window.resetMediaFilters = function() {
  MediaState.filters.search = '';
  MediaState.filters.type = 'all';
  MediaState.filters.usage = 'all';
  MediaState.filters.sort = 'newest';
  MediaState.pagination.page = 1;

  const searchInput = document.getElementById('media-search-input');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('media-search-clear');
  if (clearBtn) clearBtn.classList.add('hidden');
  const sortSelect = document.getElementById('media-sort-select');
  if (sortSelect) sortSelect.value = 'newest';

  setMediaTypeFilter('all');
  setMediaUsageFilter('all');
};

window.handleMediaPrevPage = function() {
  if (MediaState.pagination.page > 1) {
    MediaState.pagination.page--;
    loadAdminMedia();
  }
};

window.handleMediaNextPage = function() {
  if (MediaState.pagination.page < MediaState.pagination.totalPages) {
    MediaState.pagination.page++;
    loadAdminMedia();
  }
};

window.goToMediaPage = function(p) {
  if (p >= 1 && p <= MediaState.pagination.totalPages) {
    MediaState.pagination.page = p;
    loadAdminMedia();
  }
};

// 23.7 Media Preview Drawer / Modal
window.openMediaPreview = async function(assetId) {
  try {
    const res = await apiFetch(`/api/admin/media/${assetId}`);
    if (!res.ok) throw new Error('Asset not found');
    const data = await res.json();
    if (!data.success || !data.asset) throw new Error('Invalid asset data');

    const asset = data.asset;
    MediaState.selectedAsset = asset;

    const modal = document.getElementById('media-preview-modal');
    const title = document.getElementById('media-preview-title');
    const mimeType = document.getElementById('media-preview-mimetype');
    const typeIcon = document.getElementById('media-preview-type-icon');

    const imgContainer = document.getElementById('media-preview-image-container');
    const videoContainer = document.getElementById('media-preview-video-container');
    const vectorContainer = document.getElementById('media-preview-vector-container');

    const imgElem = document.getElementById('media-preview-img');
    const videoElem = document.getElementById('media-preview-video');
    const vectorElem = document.getElementById('media-preview-vector');

    const sizeElem = document.getElementById('media-preview-size');
    const mimeElem = document.getElementById('media-preview-mime');
    const dateElem = document.getElementById('media-preview-date');
    const uploaderElem = document.getElementById('media-preview-uploader');
    const urlInput = document.getElementById('media-preview-url-input');

    const usageBanner = document.getElementById('media-preview-usage-banner');
    const usageDot = document.getElementById('media-preview-usage-dot');
    const usageText = document.getElementById('media-preview-usage-text');
    const usageBadge = document.getElementById('media-preview-usage-badge');
    const referencesList = document.getElementById('media-preview-references-list');

    if (title) title.textContent = asset.originalName || asset.filename;
    if (mimeType) mimeType.textContent = asset.mimeType || 'image/jpeg';

    const isVideo = asset.mediaType === 'video' || (asset.mimeType && asset.mimeType.startsWith('video/'));
    const isVector = asset.mediaType === 'vector' || asset.mimeType === 'image/svg+xml';

    if (typeIcon) {
      typeIcon.textContent = isVideo ? 'videocam' : (isVector ? 'draw' : 'image');
    }

    // Toggle Visual Previews
    if (imgContainer) imgContainer.classList.toggle('hidden', isVideo || isVector);
    if (videoContainer) videoContainer.classList.toggle('hidden', !isVideo);
    if (vectorContainer) vectorContainer.classList.toggle('hidden', !isVector);

    if (isVideo && videoElem) {
      videoElem.src = asset.url;
    } else if (isVector && vectorElem) {
      vectorElem.src = asset.url;
    } else if (imgElem) {
      imgElem.src = asset.url;
    }

    // Populate Specifications
    if (sizeElem) sizeElem.textContent = formatBytes(asset.size);
    if (mimeElem) mimeElem.textContent = asset.mimeType || 'image/jpeg';
    if (dateElem) dateElem.textContent = new Date(asset.createdAt).toLocaleString('en-US');
    if (uploaderElem) uploaderElem.textContent = asset.uploadedBy || 'Curator Admin';
    if (urlInput) urlInput.value = asset.url;

    // References Awareness Breakdown
    const refCount = asset.referenceCount || (asset.references ? asset.references.length : 0);
    const isUsed = refCount > 0;

    if (usageDot) usageDot.className = isUsed ? 'w-2 h-2 rounded-full bg-emerald-400' : 'w-2 h-2 rounded-full bg-yellow-400';
    if (usageText) usageText.textContent = isUsed ? `Used in ${refCount} Item(s)` : 'Unused / Orphaned Asset';
    if (usageBadge) usageBadge.textContent = isUsed ? 'LIVE REFERENCE' : 'ORPHANED';

    if (referencesList) {
      if (!isUsed) {
        referencesList.innerHTML = `
          <div class="p-3 bg-surface-lowest border border-dashed border-surface-high text-outline text-[11px] font-mono text-center">
            This asset is not referenced by any live content modules. Safe to delete or replace.
          </div>
        `;
      } else {
        referencesList.innerHTML = asset.references.map(r => `
          <div class="p-2 bg-surface-lowest border border-surface-high flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 overflow-hidden">
              <span class="material-symbols-outlined text-[14px] text-primary shrink-0">link</span>
              <span class="font-mono text-[11px] text-on-surface truncate">${escapeHTML(r.label || `${r.module} — ${r.title}`)}</span>
            </div>
            <span class="text-[9px] px-1.5 py-0.2 bg-surface-container font-mono text-outline uppercase shrink-0">${escapeHTML(r.module)}</span>
          </div>
        `).join('');
      }
    }

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  } catch (err) {
    showToast(`Error previewing asset: ${err.message}`, 'error');
  }
};

window.closeMediaPreviewModal = function() {
  const modal = document.getElementById('media-preview-modal');
  const videoElem = document.getElementById('media-preview-video');
  if (videoElem) {
    videoElem.pause();
    videoElem.src = '';
  }
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.copyCurrentMediaUrl = function() {
  if (!MediaState.selectedAsset) return;
  copyMediaUrl(MediaState.selectedAsset.url);
};

window.copyMediaUrl = function(url) {
  if (!url) return;
  navigator.clipboard.writeText(url)
    .then(() => showToast('Media asset URL copied to clipboard.', 'success'))
    .catch(() => showToast('Failed to copy URL.', 'error'));
};

// 23.8 Media Upload Modal & Batch Uploading
window.openMediaUploadModal = function() {
  MediaState.pendingUploadFiles = [];
  const modal = document.getElementById('media-upload-modal');
  const previewContainer = document.getElementById('media-upload-preview-container');
  const progressContainer = document.getElementById('media-upload-progress-container');
  const errorBox = document.getElementById('media-upload-error-box');
  const uploadBtn = document.getElementById('btn-media-start-upload');
  const fileInput = document.getElementById('media-modal-file-input');

  if (fileInput) fileInput.value = '';
  if (previewContainer) previewContainer.classList.add('hidden');
  if (progressContainer) progressContainer.classList.add('hidden');
  if (errorBox) errorBox.classList.add('hidden');
  if (uploadBtn) uploadBtn.disabled = true;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeMediaUploadModal = function() {
  const modal = document.getElementById('media-upload-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleMediaFilesSelected = function(e) {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;

  MediaState.pendingUploadFiles = files;
  renderPendingUploadFiles();
};

function renderPendingUploadFiles() {
  const container = document.getElementById('media-upload-preview-container');
  const list = document.getElementById('media-upload-files-list');
  const uploadBtn = document.getElementById('btn-media-start-upload');

  if (!container || !list) return;

  if (MediaState.pendingUploadFiles.length === 0) {
    container.classList.add('hidden');
    if (uploadBtn) uploadBtn.disabled = true;
    return;
  }

  container.classList.remove('hidden');
  if (uploadBtn) uploadBtn.disabled = false;

  list.innerHTML = MediaState.pendingUploadFiles.map((f, idx) => `
    <div class="p-2 bg-surface-lowest border border-surface-high flex items-center justify-between gap-2 text-xs">
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="material-symbols-outlined text-[16px] text-primary shrink-0">${f.type.startsWith('video/') ? 'videocam' : 'image'}</span>
        <span class="font-mono text-on-surface truncate">${escapeHTML(f.name)}</span>
        <span class="text-[10px] text-outline font-mono">(${formatBytes(f.size)})</span>
      </div>
      <button class="text-outline hover:text-red-400 p-0.5 cursor-pointer" onclick="removePendingUploadFile(${idx})" type="button">
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  `).join('');
}

window.removePendingUploadFile = function(idx) {
  MediaState.pendingUploadFiles.splice(idx, 1);
  renderPendingUploadFiles();
};

window.executeMediaBatchUpload = async function() {
  if (MediaState.pendingUploadFiles.length === 0) return;

  const uploadBtn = document.getElementById('btn-media-start-upload');
  const progressContainer = document.getElementById('media-upload-progress-container');
  const progressBar = document.getElementById('media-upload-progress-bar');
  const progressText = document.getElementById('media-upload-progress-text');
  const errorBox = document.getElementById('media-upload-error-box');
  const errorText = document.getElementById('media-upload-error-text');

  if (uploadBtn) uploadBtn.disabled = true;
  if (progressContainer) progressContainer.classList.remove('hidden');
  if (errorBox) errorBox.classList.add('hidden');
  if (progressBar) progressBar.style.width = '30%';
  if (progressText) progressText.textContent = '30%';

  try {
    const formData = new FormData();
    MediaState.pendingUploadFiles.forEach(file => {
      formData.append('files', file);
    });

    if (progressBar) progressBar.style.width = '60%';
    if (progressText) progressText.textContent = '60%';

    const res = await fetch('/api/admin/media/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AuthState.token}`
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Upload failed');
    }

    if (progressBar) progressBar.style.width = '100%';
    if (progressText) progressText.textContent = '100%';

    showToast(`Successfully uploaded and registered ${data.count || 1} asset(s).`, 'success');
    closeMediaUploadModal();
    loadAdminMedia();
  } catch (err) {
    console.error('Upload error:', err);
    if (uploadBtn) uploadBtn.disabled = false;
    if (progressContainer) progressContainer.classList.add('hidden');
    if (errorBox) {
      errorBox.classList.remove('hidden');
      if (errorText) errorText.textContent = err.message;
    }
    showToast(`Upload failed: ${err.message}`, 'error');
  }
};

// 23.9 Safe Media Replacement Workflow
window.openMediaReplaceModalFromPreview = function() {
  if (!MediaState.selectedAsset) return;
  openMediaReplaceModal(MediaState.selectedAsset._id);
};

window.openMediaReplaceModal = function(assetId) {
  const asset = MediaState.assets.find(a => String(a._id) === String(assetId)) || MediaState.selectedAsset;
  if (!asset) return;

  MediaState.replacementTargetAsset = asset;
  MediaState.replacementFile = null;

  const modal = document.getElementById('media-replace-modal');
  const currentImg = document.getElementById('media-replace-current-img');
  const currentName = document.getElementById('media-replace-current-name');
  const currentSize = document.getElementById('media-replace-current-size');
  const pickerLabel = document.getElementById('media-replace-picker-label');
  const confirmBtn = document.getElementById('btn-confirm-media-replace');
  const errorBox = document.getElementById('media-replace-error-box');
  const fileInput = document.getElementById('media-replace-file-input');

  if (fileInput) fileInput.value = '';
  if (currentImg) currentImg.src = asset.url;
  if (currentName) currentName.textContent = asset.originalName || asset.filename;
  if (currentSize) currentSize.textContent = formatBytes(asset.size);
  if (pickerLabel) pickerLabel.textContent = 'Select replacement file';
  if (confirmBtn) confirmBtn.disabled = true;
  if (errorBox) errorBox.classList.add('hidden');

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeMediaReplaceModal = function() {
  const modal = document.getElementById('media-replace-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleReplacementFileSelected = function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  MediaState.replacementFile = file;
  const pickerLabel = document.getElementById('media-replace-picker-label');
  const confirmBtn = document.getElementById('btn-confirm-media-replace');

  if (pickerLabel) pickerLabel.textContent = `Selected: ${file.name} (${formatBytes(file.size)})`;
  if (confirmBtn) confirmBtn.disabled = false;
};

window.executeMediaReplace = async function() {
  if (!MediaState.replacementTargetAsset || !MediaState.replacementFile) return;

  const confirmBtn = document.getElementById('btn-confirm-media-replace');
  const errorBox = document.getElementById('media-replace-error-box');
  const errorText = document.getElementById('media-replace-error-text');

  if (confirmBtn) confirmBtn.disabled = true;
  if (errorBox) errorBox.classList.add('hidden');

  try {
    const formData = new FormData();
    formData.append('file', MediaState.replacementFile);

    const res = await fetch(`/api/admin/media/${MediaState.replacementTargetAsset._id}/replace`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AuthState.token}`
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Replacement failed');
    }

    showToast(data.message || 'Media replaced successfully.', 'success');
    closeMediaReplaceModal();
    closeMediaPreviewModal();
    loadAdminMedia();
  } catch (err) {
    console.error('Replacement error:', err);
    if (confirmBtn) confirmBtn.disabled = false;
    if (errorBox) {
      errorBox.classList.remove('hidden');
      if (errorText) errorText.textContent = err.message;
    }
    showToast(`Replacement failed: ${err.message}`, 'error');
  }
};

// 23.10 Safe Media Deletion Workflow
window.openMediaDeleteModalFromPreview = function() {
  if (!MediaState.selectedAsset) return;
  openMediaDeleteModal(MediaState.selectedAsset._id);
};

window.openMediaDeleteModal = function(assetId) {
  const asset = MediaState.assets.find(a => String(a._id) === String(assetId)) || MediaState.selectedAsset;
  if (!asset) return;

  MediaState.selectedAsset = asset;

  const modal = document.getElementById('media-delete-modal');
  const targetFilename = document.getElementById('media-delete-target-filename');
  const blockedBanner = document.getElementById('media-delete-blocked-banner');
  const blockingRefs = document.getElementById('media-delete-blocking-refs');
  const allowedContainer = document.getElementById('media-delete-allowed-container');
  const confirmBtn = document.getElementById('btn-confirm-media-delete');
  const errorBox = document.getElementById('media-delete-error-box');

  if (targetFilename) targetFilename.textContent = asset.originalName || asset.filename;
  if (errorBox) errorBox.classList.add('hidden');

  const refCount = asset.referenceCount || (asset.references ? asset.references.length : 0);
  const isUsed = refCount > 0;

  if (isUsed) {
    // Block Deletion
    if (blockedBanner) blockedBanner.classList.remove('hidden');
    if (allowedContainer) allowedContainer.classList.add('hidden');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.classList.add('opacity-40', 'cursor-not-allowed');
    }
    if (blockingRefs) {
      blockingRefs.innerHTML = (asset.references || []).map(r => `
        <div class="flex items-center gap-1.5 text-red-300">
          <span>&bull;</span>
          <span class="font-bold">${escapeHTML(r.module)}:</span>
          <span>${escapeHTML(r.title)}</span>
        </div>
      `).join('');
    }
  } else {
    // Allow Deletion
    if (blockedBanner) blockedBanner.classList.add('hidden');
    if (allowedContainer) allowedContainer.classList.remove('hidden');
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.classList.remove('opacity-40', 'cursor-not-allowed');
    }
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeMediaDeleteModal = function() {
  const modal = document.getElementById('media-delete-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.executeMediaDelete = async function() {
  if (!MediaState.selectedAsset) return;

  const confirmBtn = document.getElementById('btn-confirm-media-delete');
  const errorBox = document.getElementById('media-delete-error-box');
  const errorText = document.getElementById('media-delete-error-text');

  if (confirmBtn) confirmBtn.disabled = true;
  if (errorBox) errorBox.classList.add('hidden');

  try {
    const res = await apiFetch(`/api/admin/media/${MediaState.selectedAsset._id}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Deletion failed');
    }

    showToast(data.message || 'Media asset permanently deleted.', 'success');
    closeMediaDeleteModal();
    closeMediaPreviewModal();
    loadAdminMedia();
  } catch (err) {
    console.error('Delete error:', err);
    if (confirmBtn) confirmBtn.disabled = false;
    if (errorBox) {
      errorBox.classList.remove('hidden');
      if (errorText) errorText.textContent = err.message;
    }
    showToast(`Delete failed: ${err.message}`, 'error');
  }
};

// 23.11 Media Metadata Editor
window.openMediaMetadataModalFromPreview = function() {
  if (!MediaState.selectedAsset) return;
  openMediaMetadataModal(MediaState.selectedAsset._id);
};

window.openMediaMetadataModal = function(assetId) {
  const asset = MediaState.assets.find(a => String(a._id) === String(assetId)) || MediaState.selectedAsset;
  if (!asset) return;

  MediaState.selectedAsset = asset;

  const modal = document.getElementById('media-metadata-modal');
  const altInput = document.getElementById('media-meta-alt');
  const captionInput = document.getElementById('media-meta-caption');
  const tagsInput = document.getElementById('media-meta-tags');

  if (altInput) altInput.value = asset.altText || '';
  if (captionInput) captionInput.value = asset.caption || '';
  if (tagsInput) tagsInput.value = Array.isArray(asset.tags) ? asset.tags.join(', ') : (asset.tags || '');

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeMediaMetadataModal = function() {
  const modal = document.getElementById('media-metadata-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleMediaMetadataSubmit = async function(e) {
  e.preventDefault();
  if (!MediaState.selectedAsset) return;

  const altText = (document.getElementById('media-meta-alt')?.value || '').trim();
  const caption = (document.getElementById('media-meta-caption')?.value || '').trim();
  const tagsRaw = (document.getElementById('media-meta-tags')?.value || '').trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  try {
    const res = await apiFetch(`/api/admin/media/${MediaState.selectedAsset._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ altText, caption, tags })
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update metadata');

    showToast('Media metadata updated.', 'success');
    closeMediaMetadataModal();
    if (MediaState.selectedAsset) {
      MediaState.selectedAsset = data.asset;
    }
    loadAdminMedia();
  } catch (err) {
    showToast(`Error updating metadata: ${err.message}`, 'error');
  }
};

// =========================================================================
// 24. STEP 11: USERS & SECURITY MANAGEMENT CONTROLLER
// =========================================================================

// 24.1 Centralized Users State
const UsersState = {
  users: [],
  auditLogs: [],
  auditTotal: 0,
  activeTab: 'list',
  editTargetId: null,
  editTargetUsername: '',
  deleteTargetId: null,
  deleteTargetUsername: '',
  resetTargetId: null,
  resetTargetUsername: ''
};

// 24.2 Load Users & Hydrate Table
window.loadAdminUsers = async function(isManual = false) {
  const tableBody = document.getElementById('users-table-body');
  const countBadge = document.getElementById('users-count-badge');
  const warningBanner = document.getElementById('users-rbac-warning');
  const createBtn = document.getElementById('btn-open-user-create');

  // Role guard: Content Editors cannot use this panel
  const isAdmin = AuthState.user && (AuthState.user.role === 'admin' || AuthState.user.role === 'super_admin');

  if (warningBanner) {
    if (!isAdmin) {
      warningBanner.classList.remove('hidden');
      warningBanner.classList.add('flex');
    } else {
      warningBanner.classList.add('hidden');
      warningBanner.classList.remove('flex');
    }
  }

  if (createBtn) createBtn.style.display = isAdmin ? '' : 'none';

  if (!isAdmin) {
    if (tableBody) tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-xs text-outline font-mono">
          Access restricted. Super Admin credentials required.
        </td>
      </tr>
    `;
    return;
  }

  if (tableBody) tableBody.innerHTML = `
    <tr>
      <td colspan="6" class="py-8 text-center">
        <span class="material-symbols-outlined text-[22px] text-primary animate-spin">progress_activity</span>
      </td>
    </tr>
  `;

  try {
    const res = await apiFetch('/api/admin/users');
    const data = await res.json();

    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load users.');

    UsersState.users = data.data || [];

    if (countBadge) countBadge.textContent = UsersState.users.length;

    renderUsersTable(UsersState.users);

    if (isManual) showToast('User registry synchronized.', 'success');

    // Load audit logs for the audit tab
    loadAuditLogs();

  } catch (err) {
    console.error('Load users error:', err);
    if (tableBody) tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-xs text-red-400 font-mono">
          Failed to load users: ${escapeHTML(err.message)}
        </td>
      </tr>
    `;
    if (isManual) showToast(`Error loading users: ${err.message}`, 'error');
  }
};

// 24.3 Render Users Table
function renderUsersTable(users) {
  const tableBody = document.getElementById('users-table-body');
  if (!tableBody) return;

  if (!users || users.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-xs text-outline font-mono">
          No admin users found in the registry.
        </td>
      </tr>
    `;
    return;
  }

  const currentUserId = AuthState.user?.id || AuthState.user?._id;

  tableBody.innerHTML = users.map(user => {
    const isSuper = user.role === 'admin' || user.role === 'super_admin';
    const isSelf = String(user._id || user.id) === String(currentUserId) || user.username === AuthState.user?.username;
    const isActive = user.isActive !== false;

    const rolePill = isSuper
      ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/15 border border-primary/40 text-primary text-[9px] font-bold uppercase font-mono tracking-wider">
           <span class="material-symbols-outlined text-[11px]">shield</span>SUPER ADMIN
         </span>`
      : `<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-high border border-surface-high text-on-surface-variant text-[9px] font-bold uppercase font-mono tracking-wider">
           <span class="material-symbols-outlined text-[11px]">edit</span>EDITOR
         </span>`;

    const statusPill = isActive
      ? `<span class="text-[9px] font-mono px-1.5 py-0.5 bg-green-950/40 border border-green-500/40 text-green-400 uppercase font-bold">ACTIVE</span>`
      : `<span class="text-[9px] font-mono px-1.5 py-0.5 bg-red-950/40 border border-red-500/40 text-red-400 uppercase font-bold">DISABLED</span>`;

    const selfBadge = isSelf
      ? `<span class="text-[9px] font-mono px-1.5 py-0.5 bg-surface-container border border-surface-high text-outline uppercase">YOU</span>`
      : '';

    const lastLogin = user.lastLogin
      ? formatRelativeTime(user.lastLogin)
      : '<span class="text-outline">Never</span>';

    const userId = user._id || user.id;

    const actionButtons = isSelf
      ? `<span class="text-[10px] text-outline font-mono italic">Current Session</span>`
      : `<div class="flex items-center justify-end gap-1.5">
           <button
             class="p-1.5 text-outline hover:text-primary hover:bg-surface-container transition-colors rounded cursor-pointer"
             onclick="openEditUserModal('${userId}')"
             title="Edit User"
             type="button"
           >
             <span class="material-symbols-outlined text-[16px]">edit</span>
           </button>
           <button
             class="p-1.5 text-outline hover:text-yellow-400 hover:bg-surface-container transition-colors rounded cursor-pointer"
             onclick="openResetPasswordModal('${userId}', '${escapeHTML(user.username)}')"
             title="Reset Passcode"
             type="button"
           >
             <span class="material-symbols-outlined text-[16px]">key</span>
           </button>
           <button
             class="p-1.5 text-outline hover:text-red-400 hover:bg-red-950/20 transition-colors rounded cursor-pointer"
             onclick="openDeleteUserModal('${userId}', '${escapeHTML(user.username)}')"
             title="Delete User"
             type="button"
           >
             <span class="material-symbols-outlined text-[16px]">delete</span>
           </button>
         </div>`;

    return `
      <tr class="hover:bg-surface-container/40 transition-colors ${!isActive ? 'opacity-50' : ''}">
        <td class="py-3 px-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-surface-container border border-surface-high flex items-center justify-center flex-shrink-0 text-primary font-bold text-xs">
              ${escapeHTML(user.username ? user.username.charAt(0).toUpperCase() : 'U')}
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-on-surface text-xs">${escapeHTML(user.username)}</span>
                ${selfBadge}
              </div>
              <span class="text-[10px] text-outline">${escapeHTML(user.fullName || '')}</span>
            </div>
          </div>
        </td>
        <td class="py-3 px-4 text-xs text-on-surface-variant">${escapeHTML(user.email || '—')}</td>
        <td class="py-3 px-4">${rolePill}</td>
        <td class="py-3 px-4">${statusPill}</td>
        <td class="py-3 px-4 text-[11px] text-outline font-mono">${lastLogin}</td>
        <td class="py-3 px-4 text-right">${actionButtons}</td>
      </tr>
    `;
  }).join('');
}

// 24.4 Audit Logs Loader
async function loadAuditLogs() {
  const action = document.getElementById('audit-action-filter')?.value || '';
  const tableBody = document.getElementById('audit-table-body');
  const totalCount = document.getElementById('audit-total-count');

  if (tableBody) tableBody.innerHTML = `
    <tr><td colspan="6" class="py-6 text-center"><span class="material-symbols-outlined text-[20px] text-primary animate-spin">progress_activity</span></td></tr>
  `;

  try {
    const params = new URLSearchParams({ limit: 100 });
    if (action) params.set('action', action);

    const res = await apiFetch(`/api/admin/audit-logs?${params.toString()}`);
    const data = await res.json();

    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load audit logs.');

    UsersState.auditLogs = data.data || [];
    UsersState.auditTotal = data.total || UsersState.auditLogs.length;

    if (totalCount) totalCount.textContent = `${UsersState.auditTotal} Recorded Logs`;

    renderAuditTable(UsersState.auditLogs);

  } catch (err) {
    console.error('Audit logs error:', err);
    if (tableBody) tableBody.innerHTML = `
      <tr><td colspan="6" class="py-6 text-center text-xs text-red-400 font-mono">Failed to load audit trail: ${escapeHTML(err.message)}</td></tr>
    `;
  }
}

// 24.5 Render Audit Trail Table
function renderAuditTable(logs) {
  const tableBody = document.getElementById('audit-table-body');
  if (!tableBody) return;

  if (!logs || logs.length === 0) {
    tableBody.innerHTML = `
      <tr><td colspan="6" class="py-8 text-center text-xs text-outline font-mono">No audit logs recorded yet.</td></tr>
    `;
    return;
  }

  const actionBadgeClass = (action) => {
    if (action === 'AUTH_LOGIN_SUCCESS') return 'text-green-400 border-green-500/40 bg-green-950/30';
    if (action === 'AUTH_LOGIN_FAILED' || action === 'AUTH_LOGIN_LOCKED') return 'text-red-400 border-red-500/40 bg-red-950/30';
    if (action === 'AUTH_LOGOUT') return 'text-outline border-surface-high bg-surface-container';
    if (action === 'USER_CREATE') return 'text-primary border-primary/40 bg-primary/10';
    if (action === 'USER_DELETE') return 'text-red-400 border-red-500/40 bg-red-950/30';
    if (action === 'USER_PASSWORD_RESET') return 'text-yellow-400 border-yellow-500/40 bg-yellow-950/30';
    return 'text-on-surface-variant border-surface-high bg-surface-container';
  };

  const statusBadgeClass = (status) => {
    if (status === 'success') return 'text-green-400';
    if (status === 'failure' || status === 'warning') return 'text-red-400';
    return 'text-outline';
  };

  tableBody.innerHTML = logs.map(log => {
    const ts = log.timestamp ? new Date(log.timestamp).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    }) : '—';

    const actionClass = actionBadgeClass(log.action);
    const stsClass = statusBadgeClass(log.status);

    return `
      <tr class="hover:bg-surface-container/30 transition-colors">
        <td class="py-2.5 px-4 text-[10px] text-outline font-mono whitespace-nowrap">${escapeHTML(ts)}</td>
        <td class="py-2.5 px-4">
          <span class="text-[9px] font-mono px-1.5 py-0.5 border ${actionClass} uppercase font-bold">${escapeHTML(log.action || '—')}</span>
        </td>
        <td class="py-2.5 px-4 text-[11px] font-mono text-on-surface">${escapeHTML(log.username || 'anonymous')}</td>
        <td class="py-2.5 px-4 text-[11px] text-on-surface-variant max-w-xs truncate">${escapeHTML(log.details || '—')}</td>
        <td class="py-2.5 px-4 text-[10px] font-mono text-outline">${escapeHTML(log.ip || '—')}</td>
        <td class="py-2.5 px-4 text-right">
          <span class="text-[9px] font-mono uppercase font-bold ${stsClass}">${escapeHTML(log.status || '—')}</span>
        </td>
      </tr>
    `;
  }).join('');
}

// 24.6 Tab Switcher
window.switchUsersTab = function(tab) {
  UsersState.activeTab = tab;
  const listPanel = document.getElementById('tab-panel-users-list');
  const auditPanel = document.getElementById('tab-panel-audit-logs');
  const tabList = document.getElementById('tab-btn-users-list');
  const tabAudit = document.getElementById('tab-btn-audit-logs');

  const activeBtnClass = 'px-4 py-2.5 text-xs uppercase font-bold tracking-wider text-primary border-b-2 border-primary transition-colors flex items-center gap-2 cursor-pointer';
  const inactiveBtnClass = 'px-4 py-2.5 text-xs uppercase font-bold tracking-wider text-outline hover:text-on-surface border-b-2 border-transparent transition-colors flex items-center gap-2 cursor-pointer';

  if (tab === 'list') {
    if (listPanel) listPanel.classList.remove('hidden');
    if (auditPanel) auditPanel.classList.add('hidden');
    if (tabList) tabList.className = activeBtnClass;
    if (tabAudit) tabAudit.className = inactiveBtnClass;
  } else {
    if (listPanel) listPanel.classList.add('hidden');
    if (auditPanel) auditPanel.classList.remove('hidden');
    if (tabList) tabList.className = inactiveBtnClass;
    if (tabAudit) tabAudit.className = activeBtnClass;
    // Reload audit trail on tab switch
    loadAuditLogs();
  }
};

// 24.7 Audit Filter Change Handler
window.handleAuditFilterChange = function() {
  loadAuditLogs();
};

// 24.8 Create User Modal
window.openCreateUserModal = function() {
  const modal = document.getElementById('user-create-modal');
  const form = document.getElementById('user-create-form');
  const errorBox = document.getElementById('user-create-error');

  if (form) form.reset();
  if (errorBox) errorBox.classList.add('hidden');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  document.getElementById('input-user-username')?.focus();
};

window.closeCreateUserModal = function() {
  const modal = document.getElementById('user-create-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleCreateUserSubmit = async function(e) {
  e.preventDefault();
  const errorBox = document.getElementById('user-create-error');
  const errorMsg = document.getElementById('user-create-error-msg');
  const submitBtn = e.target.querySelector('[type="submit"]');

  const username = document.getElementById('input-user-username')?.value.trim() || '';
  const fullName = document.getElementById('input-user-fullname')?.value.trim() || '';
  const email = document.getElementById('input-user-email')?.value.trim() || '';
  const password = document.getElementById('input-user-password')?.value || '';
  const role = document.getElementById('input-user-role')?.value || 'editor';

  if (errorBox) errorBox.classList.add('hidden');

  if (!username || !email || !password) {
    if (errorBox) errorBox.classList.remove('hidden');
    if (errorMsg) errorMsg.textContent = 'Username, email and password are required.';
    return;
  }

  if (password.length < 8) {
    if (errorBox) errorBox.classList.remove('hidden');
    if (errorMsg) errorMsg.textContent = 'Password must be at least 8 characters.';
    return;
  }

  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Provisioning...'; }

  try {
    const res = await apiFetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, fullName, email, password, role })
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create user.');

    showToast(`Account "${username}" provisioned successfully.`, 'success');
    closeCreateUserModal();
    loadAdminUsers();

  } catch (err) {
    if (errorBox) errorBox.classList.remove('hidden');
    if (errorMsg) errorMsg.textContent = err.message;
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Provision Account'; }
  }
};

// 24.9 Edit User Modal
window.openEditUserModal = function(userId) {
  const user = UsersState.users.find(u => String(u._id || u.id) === String(userId));
  if (!user) { showToast('User not found.', 'error'); return; }

  UsersState.editTargetId = userId;
  UsersState.editTargetUsername = user.username;

  const modal = document.getElementById('user-edit-modal');
  const targetTitle = document.getElementById('edit-user-target-title');
  const fullNameInput = document.getElementById('edit-user-fullname');
  const emailInput = document.getElementById('edit-user-email');
  const roleSelect = document.getElementById('edit-user-role');
  const activeChk = document.getElementById('edit-user-active');
  const errorBox = document.getElementById('user-edit-error');

  if (targetTitle) targetTitle.textContent = `USERNAME: ${user.username.toUpperCase()}`;
  if (fullNameInput) fullNameInput.value = user.fullName || '';
  if (emailInput) emailInput.value = user.email || '';
  if (roleSelect) roleSelect.value = (user.role === 'admin' || user.role === 'super_admin') ? 'admin' : 'editor';
  if (activeChk) activeChk.checked = user.isActive !== false;
  if (errorBox) errorBox.classList.add('hidden');

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeEditUserModal = function() {
  const modal = document.getElementById('user-edit-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  UsersState.editTargetId = null;
  UsersState.editTargetUsername = '';
};

window.handleEditUserSubmit = async function(e) {
  e.preventDefault();
  if (!UsersState.editTargetId) return;

  const errorBox = document.getElementById('user-edit-error');
  const errorMsg = document.getElementById('user-edit-error-msg');
  const submitBtn = e.target.querySelector('[type="submit"]');

  const fullName = document.getElementById('edit-user-fullname')?.value.trim() || '';
  const email = document.getElementById('edit-user-email')?.value.trim() || '';
  const role = document.getElementById('edit-user-role')?.value || 'editor';
  const isActive = document.getElementById('edit-user-active')?.checked ?? true;

  if (errorBox) errorBox.classList.add('hidden');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Saving...'; }

  try {
    const res = await apiFetch(`/api/admin/users/${UsersState.editTargetId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, role, isActive })
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update user.');

    showToast(`User "${UsersState.editTargetUsername}" updated successfully.`, 'success');
    closeEditUserModal();
    loadAdminUsers();

  } catch (err) {
    if (errorBox) errorBox.classList.remove('hidden');
    if (errorMsg) errorMsg.textContent = err.message;
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Save Changes'; }
  }
};

// 24.10 Reset Password Modal
window.openResetPasswordModal = function(userId, username) {
  UsersState.resetTargetId = userId;
  UsersState.resetTargetUsername = username;

  const modal = document.getElementById('user-password-modal');
  const targetTitle = document.getElementById('password-user-target-title');
  const form = document.getElementById('user-password-form');
  const errorBox = document.getElementById('user-password-error');

  if (targetTitle) targetTitle.textContent = `ACCOUNT: ${username.toUpperCase()}`;
  if (form) form.reset();
  if (errorBox) errorBox.classList.add('hidden');

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  document.getElementById('input-new-password')?.focus();
};

window.closeResetPasswordModal = function() {
  const modal = document.getElementById('user-password-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  UsersState.resetTargetId = null;
  UsersState.resetTargetUsername = '';
};

window.handleResetPasswordSubmit = async function(e) {
  e.preventDefault();
  if (!UsersState.resetTargetId) return;

  const errorBox = document.getElementById('user-password-error');
  const errorMsg = document.getElementById('user-password-error-msg');
  const submitBtn = e.target.querySelector('[type="submit"]');

  const newPass = document.getElementById('input-new-password')?.value || '';
  const confirmPass = document.getElementById('input-confirm-password')?.value || '';

  if (errorBox) errorBox.classList.add('hidden');

  if (newPass !== confirmPass) {
    if (errorBox) errorBox.classList.remove('hidden');
    if (errorMsg) errorMsg.textContent = 'Passcodes do not match. Please re-enter.';
    return;
  }

  if (newPass.length < 8) {
    if (errorBox) errorBox.classList.remove('hidden');
    if (errorMsg) errorMsg.textContent = 'Passcode must be at least 8 characters long.';
    return;
  }

  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Updating...'; }

  try {
    const res = await apiFetch(`/api/admin/users/${UsersState.resetTargetId}/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPass })
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to reset passcode.');

    showToast(`Passcode for "${UsersState.resetTargetUsername}" updated.`, 'success');
    closeResetPasswordModal();

  } catch (err) {
    if (errorBox) errorBox.classList.remove('hidden');
    if (errorMsg) errorMsg.textContent = err.message;
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Update Passcode'; }
  }
};

// 24.11 Delete User Modal
window.openDeleteUserModal = function(userId, username) {
  UsersState.deleteTargetId = userId;
  UsersState.deleteTargetUsername = username;

  const modal = document.getElementById('user-delete-modal');
  const usernameSlab = document.getElementById('delete-user-username');
  const errorBox = document.getElementById('user-delete-error');

  if (usernameSlab) usernameSlab.textContent = username;
  if (errorBox) errorBox.classList.add('hidden');

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeDeleteUserModal = function() {
  const modal = document.getElementById('user-delete-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  UsersState.deleteTargetId = null;
  UsersState.deleteTargetUsername = '';
};

window.executeDeleteUser = async function() {
  if (!UsersState.deleteTargetId) return;

  const errorBox = document.getElementById('user-delete-error');
  const errorMsg = document.getElementById('user-delete-error-msg');
  const deleteBtn = document.querySelector('#user-delete-modal [onclick="executeDeleteUser()"]');

  if (errorBox) errorBox.classList.add('hidden');
  if (deleteBtn) { deleteBtn.disabled = true; }

  try {
    const res = await apiFetch(`/api/admin/users/${UsersState.deleteTargetId}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete user.');

    showToast(`User "${UsersState.deleteTargetUsername}" permanently deleted.`, 'success');
    closeDeleteUserModal();
    loadAdminUsers();

  } catch (err) {
    if (errorBox) errorBox.classList.remove('hidden');
    if (errorMsg) errorMsg.textContent = err.message;
    showToast(`Delete failed: ${err.message}`, 'error');
  } finally {
    if (deleteBtn) { deleteBtn.disabled = false; }
  }
};

