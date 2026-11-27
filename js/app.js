/* ==========================================================================
   COMMUNITRADERS // NOIR VICE HUD — INTERACTIVE ENGINE
   Badges (10 x 5 Tiers) • Global Leaderboards (8 Tabs) • 7 Season Challenges • Manager Tim
   ========================================================================== */

(function () {
  const Data = window.ViceData;
  const Charts = window.ViceCharts;

  const state = {
    theme: localStorage.getItem('communitraders_theme') || 'dark',
    isAuthenticated: false,
    publicLeaderboardsOpen: false,
    activeRole: 'follower',
    activeView: 'following',
    activeAnalyticsTab: 'profitability',
    analyticsYear: '2026',
    ordersTab: 'open',
    ordersSearch: '',
    followersSearch: '',
    discoverFilter: 'all',
    discoverAsset: 'ALL',
    discoverSort: 'popular',
    discoverSearch: '',
    leaderboardTab: 'top-mm',
    leaderboardTimeframe: 'monthly',
    socialHubOpen: false,
    agentGreetingDismissed: false,
    mobileSidebarOpen: false,
    userMenuOpen: false,
    openOrders: [...Data.orders.open],
    closedOrders: [...Data.orders.closed],
    historicalSettings: [...Data.orders.historicalSettings],
    notes: [...Data.providerNotes],
    strategies: JSON.parse(JSON.stringify(Data.strategies)),
    followerUser: JSON.parse(JSON.stringify(Data.users.follower)),
    providerUser: JSON.parse(JSON.stringify(Data.users.provider)),
    agentChats: {
      follower: [...Data.agentChatInitial.follower],
      provider: [...Data.agentChatInitial.provider]
    },
    agentTyping: false,
    timAlertIndex: 0,
    challenge: JSON.parse(JSON.stringify(Data.signalChallenge)),
    badges: JSON.parse(JSON.stringify(Data.badgesCatalog))
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const TIM_AVATAR_URL =
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23141120'/%3E%3Cpath d='M16 100 C18 74 82 74 84 100 Z' fill='%230b0912'/%3E%3Cpath d='M31 44 C31 24 69 24 69 44 C69 62 59 69 50 69 C41 69 31 62 31 44 Z' fill='%23e5aa7d'/%3E%3Cpath d='M29 41 C28 22 44 15 58 18 C68 20 72 30 70 40 C64 30 38 28 29 41 Z' fill='%232c2936'/%3E%3Cpath d='M33 38 L48 38 L46 49 C45 52 35 52 33 47 Z' fill='%23ff0055' stroke='%23ffd166' stroke-width='2'/%3E%3Cpath d='M52 38 L67 38 L67 47 C65 52 55 52 54 49 Z' fill='%23b026ff' stroke='%23ffd166' stroke-width='2'/%3E%3C/svg%3E";

  function showToast(message) {
    const stack = $('#toast-stack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = 'vice-toast';
    el.innerHTML = `<span style="color:var(--neon-purple-bright);">◈</span><span>${escapeHtml(message)}</span>`;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(16px)';
      el.style.transition = 'all 0.25s';
      setTimeout(() => el.remove(), 260);
    }, 3200);
  }

  // Proactive Manager Tim Animated Achievement / Rank Notification
  function showTimNotification(title, tier, text) {
    const stack = $('#toast-stack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = 'tim-toast';
    el.innerHTML = `
      <img src="${TIM_AVATAR_URL}" alt="Manager Tim" style="width:38px; height:38px; border-radius:50%; border:2px solid var(--accent); flex-shrink:0;"/>
      <div style="flex:1; min-width:0;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; margin-bottom:2px;">
          <strong class="font-heading" style="font-size:11px; color:var(--accent);">MANAGER TIM // ${escapeHtml(title)}</strong>
          ${tier ? `<span class="tier-pill tier-${escapeHtml(tier)}">${escapeHtml(tier)}</span>` : ''}
        </div>
        <div style="font-size:12.5px; color:var(--text-primary); line-height:1.35;">${escapeHtml(text)}</div>
      </div>
    `;
    stack.appendChild(el);

    if (state.isAuthenticated) {
      state.agentChats[state.activeRole].push({
        role: 'agent',
        sender: 'Manager Tim',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `[${title}] ${text}`
      });
      if ($('#social-hub-count')) {
        $('#social-hub-count').textContent = state.agentChats[state.activeRole].length;
      }
      if (state.socialHubOpen) renderSocialHub();
    }

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(16px)';
      el.style.transition = 'all 0.25s';
      setTimeout(() => el.remove(), 260);
    }, 5000);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getCurrentUser() {
    return state.activeRole === 'follower' ? state.followerUser : state.providerUser;
  }

  function getStrategyById(id) {
    return state.strategies.find((s) => s.id === id) || state.strategies[0];
  }

  function renderFlagPair(flags = []) {
    return `<div class="pair-flags">${flags
      .map((f) => `<span class="flag-dot">${f.toUpperCase()}</span>`)
      .join('')}</div>`;
  }

  function renderAvatarImg(avatarKey) {
    return Data.avatars[avatarKey] || Data.avatars.cyberChart;
  }

  function syncModeCopy() {
    const isSerious = state.theme === 'serious';
    const setText = (sel, val) => {
      const el = $(sel);
      if (el) el.textContent = val;
    };
    const setHtml = (sel, val) => {
      const el = $(sel);
      if (el) el.innerHTML = val;
    };

    setText('#login-ticker-status', isSerious ? '● FEED // ONLINE' : '● SYNDICATE SERVER // ONLINE');
    setText('#login-hero-tag', isSerious ? 'COMMUNITRADERS' : 'SEASON');
    setHtml(
      '#login-hero-title',
      isSerious
        ? 'Follow experienced traders or share your own trading expertise!'
        : 'TRADE LIKE A BOSS. <span class="highlight-vice">OWN THE SYNDICATE.</span>'
    );
    setHtml(
      '#login-hero-sub',
      isSerious
        ? 'Access Communitraders as a <strong>Follower</strong> or <strong>Signal Provider</strong> using your MetaTrader credentials.'
        : "Enter Tradeview's next-gen copy-trading arena. Mirror elite strategies as a <strong>Follower</strong> or command followers as a <strong>Signal Provider</strong>."
    );
    setText('#stage-chip-left', isSerious ? 'MT4 & MT5' : 'HOLO-DESK // MT4 & MT5');
    setText('#stage-chip-right', isSerious ? '12 STRATEGIES' : '12 STRATEGIES ONLINE');
    setText('#stage-rank-title', isSerious ? 'Communitraders Platform' : 'COMMUNITRADERS COPY-TRADING TERMINAL');
    setText('#demo-accounts-heading', isSerious ? 'Quick demo access' : 'Select Trader Class // 1-Click Test Login');
    setText('#demo-follower-class', isSerious ? 'Follower account' : 'CLASS // MIRROR OPS');
    setText('#demo-provider-class', isSerious ? 'Signal provider account' : 'CLASS // SYNDICATE LEAD');
    setText('#login-terminal-label', isSerious ? 'MetaTrader Login' : 'TERMINAL // AUTH GATEWAY');
    setText('#login-submit-btn', isSerious ? 'Login' : 'Enter Vice Terminal →');
    setText('#manager-tim-drawer-title', isSerious ? 'Social Hub' : 'MANAGER TIM // ASSISTANT');
    setText('#social-hub-fab-label', isSerious ? 'Social Hub' : 'Manager Tim');
  }

  function applyTheme(themeName, shouldRerender = false) {
    const allowed = ['dark', 'light', 'serious'];
    state.theme = allowed.includes(themeName) ? themeName : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('communitraders_theme', state.theme);

    $$('.mode-switch-btn[data-set-theme]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.setTheme === state.theme);
    });
    $$('.dropdown-item[data-set-theme]').forEach((btn) => {
      const active = btn.dataset.setTheme === state.theme;
      btn.style.fontWeight = active ? '700' : '';
      btn.style.color = active ? 'var(--accent)' : '';
    });

    syncModeCopy();

    if (shouldRerender && (state.isAuthenticated || state.publicLeaderboardsOpen)) {
      if (state.isAuthenticated) renderSidebar();
      renderMainView();
    }
  }

  function setTheme(themeName) {
    applyTheme(themeName, true);
    const labelMap = { dark: 'Dark Mode', light: 'Light Mode', serious: 'Serious Mode' };
    showToast(`${labelMap[state.theme] || 'Dark Mode'} activated`);
  }

  function applyUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme') || params.get('mode');
    if (themeParam === 'dark' || themeParam === 'light' || themeParam === 'serious') {
      applyTheme(themeParam, false);
    }
    const role = params.get('role');
    const view = params.get('view');
    if (role === 'follower' || role === 'provider') {
      state.isAuthenticated = true;
      state.publicLeaderboardsOpen = false;
      state.activeRole = role;
      state.activeView = view || (role === 'follower' ? 'following' : 'profile');
    } else if (role === 'leaderboards') {
      state.isAuthenticated = false;
      state.publicLeaderboardsOpen = true;
    } else if (role === 'login') {
      state.isAuthenticated = false;
      state.publicLeaderboardsOpen = false;
    }
  }

  function syncDemoSelection(roleKey) {
    const fBtn = $('#demo-btn-follower');
    const pBtn = $('#demo-btn-provider');
    if (fBtn) fBtn.classList.toggle('is-selected', roleKey === 'follower');
    if (pBtn) pBtn.classList.toggle('is-selected', roleKey === 'provider');
  }

  function triggerProfileTransition() {
    if (state.theme === 'serious') return;
    const appShell = $('#app-shell');
    const bar = $('#profile-transition-bar');
    if (appShell) {
      appShell.classList.remove('profile-entering');
      void appShell.offsetWidth;
      appShell.classList.add('profile-entering');
    }
    if (bar) {
      bar.classList.remove('active');
      void bar.offsetWidth;
      bar.classList.add('active');
    }
  }

  function fillDemoCredentials(roleKey) {
    const user = roleKey === 'follower' ? Data.users.follower : Data.users.provider;
    $('#login-account').value = user.id;
    $('#login-password').value = user.password;
    $('#login-role').value = user.role;
    $('#login-platform').value = user.platform;
    $('#login-server').value = user.server;
    $('#login-terms').checked = true;
    $('#login-error').classList.add('hidden');
    syncDemoSelection(roleKey);
  }

  function loginAs(roleKey, customId) {
    state.activeRole = roleKey === 'provider' ? 'provider' : 'follower';
    state.activeView = state.activeRole === 'follower' ? 'following' : 'profile';
    state.ordersTab = 'open';
    state.ordersSearch = '';
    state.followersSearch = '';
    state.publicLeaderboardsOpen = false;
    state.isAuthenticated = true;

    if (customId) {
      getCurrentUser().id = customId;
    }

    renderRoot();
    triggerProfileTransition();

    // Proactive Manager Tim greeting alert on login
    const alertPreset =
      state.activeRole === 'provider' ? Data.timNotifications[1] : Data.timNotifications[2];
    setTimeout(() => {
      showTimNotification(alertPreset.title, alertPreset.tier, alertPreset.text);
    }, 350);
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const acc = $('#login-account').value.trim();
    const pass = $('#login-password').value.trim();
    const role = $('#login-role').value;
    const platform = $('#login-platform').value;
    const server = $('#login-server').value;
    const terms = $('#login-terms').checked;
    const errEl = $('#login-error');

    if (!acc || !pass || !role || !platform || !server) {
      errEl.textContent = 'Please complete all MetaTrader credentials, Role, Platform, and Server fields.';
      errEl.classList.remove('hidden');
      return;
    }
    if (!terms) {
      errEl.textContent = 'You must accept the Communitraders Acknowledgement and Agreement terms to continue.';
      errEl.classList.remove('hidden');
      return;
    }

    errEl.classList.add('hidden');
    loginAs(role, acc);
  }

  function logout() {
    state.isAuthenticated = false;
    state.publicLeaderboardsOpen = false;
    state.userMenuOpen = false;
    state.socialHubOpen = false;
    renderRoot();
    showToast('Signed out of Communitraders');
  }

  function renderRoot() {
    const loginShell = $('#login-shell');
    const appShell = $('#app-shell');

    // Public Global Leaderboards Mode (accessible from Login screen without signing in)
    if (!state.isAuthenticated && state.publicLeaderboardsOpen) {
      loginShell.classList.add('hidden');
      appShell.classList.remove('hidden');
      $('#app-sidebar').classList.add('hidden');
      $('#topbar-kpi-strip').innerHTML = `<span class="badge badge-purple">PUBLIC RANKING PORTAL // COMMUNITRADERS RANKINGS</span>`;
      $('#switch-to-follower').parentElement.classList.add('hidden');
      $('#user-menu-trigger').parentElement.classList.add('hidden');
      $('#social-hub-fab').classList.add('hidden');
      $('#social-hub-drawer').classList.add('hidden');
      $('#agent-greeting-card').classList.add('hidden');
      renderLeaderboardsView($('#main-view-container'), true);
      return;
    }

    if (!state.isAuthenticated) {
      loginShell.classList.remove('hidden');
      appShell.classList.add('hidden');
      $('#social-hub-fab').classList.add('hidden');
      $('#social-hub-drawer').classList.add('hidden');
      $('#agent-greeting-card').classList.add('hidden');
      return;
    }

    loginShell.classList.add('hidden');
    appShell.classList.remove('hidden');
    $('#app-sidebar').classList.remove('hidden');
    $('#switch-to-follower').parentElement.classList.remove('hidden');
    $('#user-menu-trigger').parentElement.classList.remove('hidden');

    renderTopbar();
    renderSidebar();
    renderMainView();
    renderSocialHub();
  }

  function renderTopbar() {
    const user = getCurrentUser();
    const k = user.kpis;
    const isProvider = state.activeRole === 'provider';

    $('#topbar-kpi-strip').innerHTML = `
      <div class="kpi-item"><span class="kpi-label">P&amp;L</span><span class="kpi-value">${k.pnl}</span></div>
      <div class="kpi-item"><span class="kpi-label">Margin</span><span class="kpi-value">${k.margin}</span></div>
      <div class="kpi-item"><span class="kpi-label">Free margin</span><span class="kpi-value">${k.freeMargin}</span></div>
      <div class="kpi-item"><span class="kpi-label">Balance</span><span class="kpi-value">${k.balance}</span></div>
      <div class="kpi-item"><span class="kpi-label">Credit</span><span class="kpi-value">${k.credit}</span></div>
      <div class="kpi-item"><span class="kpi-label">Equity</span><span class="kpi-value">${k.equity}</span></div>
      ${isProvider
        ? `<div class="kpi-item"><span class="kpi-label">Risk</span><span class="kpi-risk-pill">${k.risk}</span></div>`
        : ''
      }
    `;

    $('#switch-to-follower').className = `role-switch-btn ${!isProvider ? 'active purple' : ''}`;
    $('#switch-to-provider').className = `role-switch-btn ${isProvider ? 'active' : ''}`;

    const avatar = $('#topbar-user-avatar');
    avatar.textContent = user.avatarInitial;
    avatar.className = `user-avatar-circle ${isProvider ? 'provider' : ''}`;
    $('#topbar-user-name').textContent = user.shortName;
  }

  function renderSidebar() {
    const user = getCurrentUser();
    const isProvider = state.activeRole === 'provider';
    const sidebar = $('#app-sidebar');

    const navItems = isProvider
      ? [
        { id: 'profile', label: 'My profile', icon: 'compass' },
        { id: 'challenge', label: 'Season Challenges', icon: 'trophy' },
        { id: 'leaderboards', label: 'Global Leaderboards', icon: 'crown' },
        { id: 'followers', label: 'Followers', icon: 'users' },
        { id: 'orders', label: 'Orders', icon: 'orders' }
      ]
      : [
        { id: 'following', label: 'Following settings', icon: 'trend' },
        { id: 'discover', label: 'Discover', icon: 'users' },
        { id: 'leaderboards', label: 'Global Leaderboards', icon: 'crown' },
        { id: 'challenge', label: 'Season Challenges', icon: 'trophy' },
        { id: 'orders', label: 'Orders', icon: 'orders' }
      ];

    const toggleChecked = isProvider ? user.visibility : user.copyStatus;
    const toggleLabel = isProvider ? 'Visibility' : 'Copy status';

    sidebar.innerHTML = `
      <div>
        <div class="sidebar-profile-card ${isProvider ? '' : 'follower-theme'}">
          <div class="sidebar-role-label">${escapeHtml(user.roleLabel)}</div>
          <div class="sidebar-user-name">${escapeHtml(user.name)}</div>
          <div class="sidebar-account-id">${escapeHtml(user.id)}</div>
          <div class="sidebar-status-row">
            <span>${toggleLabel}</span>
            <label class="vice-switch">
              <input type="checkbox" id="sidebar-status-toggle" ${toggleChecked ? 'checked' : ''}/>
              <span class="vice-switch-track"></span>
            </label>
          </div>
        </div>

        <nav class="sidebar-nav">
          ${navItems
        .map(
          (item) => `
            <button type="button" class="nav-item ${state.activeView === item.id ? 'active' : ''}" data-nav="${item.id}">
              ${getNavIcon(item.icon)}
              <span>${item.label}</span>
            </button>
          `
        )
        .join('')}
        </nav>
      </div>

      <div class="sidebar-footer-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="font-heading" style="font-size:11px; color:var(--neon-purple-bright);">${state.theme === 'serious' ? 'Platform' : 'HUD'} // ${escapeHtml(user.platform)}</span>
          <span class="badge badge-profit">LIVE</span>
        </div>
        <div class="font-mono" style="font-size:11px; color:var(--text-muted);">${escapeHtml(user.server)}</div>
        <a href="mockups.html" class="btn btn-ghost btn-sm" style="margin-top:4px; width:100%;">
          Deliverables &amp; Mockups
        </a>
      </div>
    `;

    $('#sidebar-status-toggle').addEventListener('change', (e) => {
      const checked = e.target.checked;
      if (isProvider) {
        state.providerUser.visibility = checked;
        showToast(`Strategy visibility ${checked ? 'enabled' : 'paused'}`);
      } else {
        state.followerUser.copyStatus = checked;
        state.followerUser.followingSettings.copyStatus = checked ? 'Copying' : 'Paused';
        showToast(`Copy trading ${checked ? 'activated' : 'paused'}`);
        if (state.activeView === 'following') renderMainView();
      }
    });

    $$('[data-nav]', sidebar).forEach((btn) => {
      btn.addEventListener('click', () => {
        state.activeView = btn.dataset.nav;
        state.ordersTab = 'open';
        state.mobileSidebarOpen = false;
        sidebar.classList.remove('open');
        renderSidebar();
        renderMainView();
      });
    });
  }

  function getNavIcon(name) {
    const icons = {
      trend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
      users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      orders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/></svg>`,
      trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
      crown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"/><path d="M4 17L2 6l6 4 4-6 4 6 6-4-2 11z"/></svg>`,
      compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
    };
    return icons[name] || icons.compass;
  }

  function renderMainView() {
    const container = $('#main-view-container');
    if (state.activeView === 'leaderboards') {
      renderLeaderboardsView(container, false);
      return;
    }
    if (state.activeView === 'challenge') {
      renderChallengeView(container);
      return;
    }

    if (state.activeRole === 'follower') {
      if (state.activeView === 'following') renderFollowerDashboard(container);
      else if (state.activeView === 'discover') renderDiscoverView(container);
      else renderOrdersView(container);
    } else {
      if (state.activeView === 'profile') renderProviderDashboard(container);
      else if (state.activeView === 'followers') renderFollowersListView(container);
      else renderOrdersView(container);
    }
  }

  // ==========================================================================
  // BADGES & ACHIEVEMENTS SECTION (10 BADGES, 5 TIERS: BRONZE -> LEGENDARY)
  // ==========================================================================
  function renderBadgesSection(roleKey) {
    const unlockedCount = state.badges.filter((b) =>
      roleKey === 'provider' ? b.providerTier : b.followerTier
    ).length;

    return `
      <section class="glass-card hud-panel following-settings-card">
        <div class="card-header-flex">
          <div>
            <h2 class="card-title-lg">Badges &amp; Achievements</h2>
            <div style="font-size:12px; color:var(--text-secondary);">
              Verifiable trading milestones • Tiers: Bronze, Silver, Gold, Platinum, Legendary
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="badge badge-purple">${unlockedCount} / ${state.badges.length} Unlocked</span>
            <button type="button" class="btn btn-outline-pink btn-sm" id="btn-share-badges">Share Profile &amp; Badges</button>
          </div>
        </div>

        <div class="badges-grid">
          ${state.badges
        .map((b) => {
          const tier = roleKey === 'provider' ? b.providerTier : b.followerTier;
          const isLocked = !tier;
          return `
                <article class="badge-tile ${isLocked ? 'locked' : ''}" title="${escapeHtml(b.criteria)}">
                  <div class="badge-tile-top">
                    <div class="badge-emblem">${b.icon}</div>
                    ${tier
              ? `<span class="tier-pill tier-${escapeHtml(tier)}">${escapeHtml(tier)}</span>`
              : `<span class="badge badge-neutral" style="font-size:9.5px;">Locked</span>`
            }
                  </div>
                  <div class="badge-title">${escapeHtml(b.name)}</div>
                  <div class="badge-desc">${escapeHtml(b.desc)}</div>
                  <div class="risk-bar-track" style="margin-top:auto;">
                    <div class="risk-bar-fill ${isLocked ? 'medium' : ''}" style="width:${b.progressPct}%;"></div>
                  </div>
                </article>
              `;
        })
        .join('')}
        </div>
      </section>
    `;
  }

  function renderBullCandlesSvg() {
    const isSerious = state.theme === 'serious';
    const c1 = isSerious ? '#d60093' : '#e81c7b';
    const c2 = isSerious ? '#ff8d35' : '#f7944d';
    const c3 = isSerious ? '#a34d84' : '#c04cfd';

    return `
    <div class="colorimetria-bull-art">
      <svg viewBox="0 0 260 175" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id="bullRay" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stop-color="${c1}" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="${c2}" stop-opacity="0.75"/>
          </linearGradient>

          <!-- Realistic Cast Bronze / Dark Patina Gradients -->
          <linearGradient id="bronzeBase" x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stop-color="#3c354f"/>
            <stop offset="40%" stop-color="#221e2e"/>
            <stop offset="80%" stop-color="#14111c"/>
            <stop offset="100%" stop-color="#0b0910"/>
          </linearGradient>

          <linearGradient id="bronzeMuscle" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${c2}" stop-opacity="0.78"/>
            <stop offset="45%" stop-color="${c3}" stop-opacity="0.52"/>
            <stop offset="100%" stop-color="#1b1826" stop-opacity="0.9"/>
          </linearGradient>

          <linearGradient id="bronzeSpecular" x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stop-color="#ffd1a6"/>
            <stop offset="35%" stop-color="${c2}"/>
            <stop offset="85%" stop-color="${c1}"/>
            <stop offset="100%" stop-color="${c3}"/>
          </linearGradient>

          <linearGradient id="hornGrad" x1="0" y1="1" x2="0.3" y2="0">
            <stop offset="0%" stop-color="#2a2438"/>
            <stop offset="30%" stop-color="${c1}"/>
            <stop offset="75%" stop-color="${c2}"/>
            <stop offset="100%" stop-color="#ffe0be"/>
          </linearGradient>

          <radialGradient id="hoofShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#050408" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#050408" stop-opacity="0"/>
          </radialGradient>

          <filter id="sculptGlow" x="-12%" y="-12%" width="124%" height="124%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.6" flood-color="${c2}" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- Candlestick Backdrop -->
        <g opacity="0.35">
          <line x1="28" y1="35" x2="28" y2="115" stroke="${c1}" stroke-width="2"/><rect x="23" y="52" width="10" height="40" rx="2" fill="${c1}"/>
          <line x1="56" y1="25" x2="56" y2="105" stroke="${c3}" stroke-width="2"/><rect x="51" y="42" width="10" height="36" rx="2" fill="${c3}"/>
          <line x1="84" y1="45" x2="84" y2="125" stroke="${c2}" stroke-width="2"/><rect x="79" y="60" width="10" height="42" rx="2" fill="${c2}"/>
          <line x1="112" y1="18" x2="112" y2="95" stroke="${c1}" stroke-width="2"/><rect x="107" y="34" width="10" height="38" rx="2" fill="${c1}"/>
        </g>

        <!-- Neon Diagonal Beams -->
        <path d="M120 175 L260 20 L260 55 L155 175 Z" fill="url(#bullRay)" opacity="0.45"/>
        <line x1="110" y1="175" x2="260" y2="28" stroke="${c1}" stroke-width="2.5"/>

        <!-- Beveled Cobblestone Plinth -->
        <g>
          <rect x="52" y="147" width="166" height="28" rx="4" fill="#15131f" stroke="${c1}" stroke-opacity="0.45"/>
          <path d="M56 151 H214" stroke="${c2}" stroke-opacity="0.3" stroke-width="1"/>
          <path d="M68 159 H90 M102 159 H128 M140 159 H166 M178 159 H202 M78 167 H106 M118 167 H148 M160 167 H190" stroke="${c3}" stroke-opacity="0.18" stroke-width="1.2" stroke-linecap="round"/>
        </g>

        <!-- Realistic Sculpted Charging Bull (Front-3/4 Angle) -->
        <g transform="translate(8, 2)">
          <!-- Individual Ground Contact Shadows -->
          <ellipse cx="60" cy="144" rx="16" ry="3.2" fill="url(#hoofShadow)"/>
          <ellipse cx="117" cy="133" rx="13" ry="2.8" fill="url(#hoofShadow)"/>
          <ellipse cx="136" cy="146" rx="17" ry="3.5" fill="url(#hoofShadow)"/>
          <ellipse cx="183" cy="138" rx="14" ry="3" fill="url(#hoofShadow)"/>

          <!-- 1. WHIPPING TAIL (Rounded Tubular Volume + Hair Tuft) -->
          <path d="
            M 161 46
            C 170 35, 168 19, 152 17
            C 143 16, 139 23, 144 27
            C 147 29, 150 25, 148 23
            C 153 22, 160 27, 165 31
            C 174 37, 188 37, 194 27
            C 196 24, 192 22, 190 25
            C 185 31, 175 30, 167 24
            C 162 20, 157 17, 152 17
            C 162 23, 163 36, 156 46
            Z"
            fill="url(#bronzeSpecular)"
            stroke="#14111c"
            stroke-width="0.6"
          />
          <!-- Tail Brush Tuft -->
          <path d="M 190 25 C 193 21, 198 22, 197 27 C 196 30, 192 31, 189 29 Z" fill="${c2}"/>

          <!-- 2. MAIN SCULPTED BODY & LIMBS -->
          <path d="
            M 135 34
            C 126 34, 118 41, 112 48
            C 100 53, 91 62, 87 74
            L 64 113
            L 48 134
            C 45 140, 48 144, 58 144
            C 67 144, 73 140, 73 134
            L 72 125
            L 98 103
            C 103 110, 108 117, 111 122
            L 106 128
            C 105 132, 113 135, 123 133
            L 129 124
            L 134 119
            L 125 136
            C 121 142, 125 146, 136 146
            C 146 146, 151 142, 149 136
            L 158 124
            L 172 114
            L 173 129
            C 170 134, 174 138, 183 138
            C 192 138, 196 134, 193 129
            L 192 106
            C 198 95, 198 81, 193 70
            C 194 61, 191 53, 184 48
            C 174 41, 158 38, 144 37
            C 140 35, 138 34, 135 34
            Z"
            fill="url(#bronzeBase)"
            stroke="url(#bronzeSpecular)"
            stroke-opacity="0.45"
            stroke-width="1"
            stroke-linejoin="round"
          />

          <!-- 3. ANATOMICAL MUSCLE RELIEF VOLUMES -->
          <!-- Massive Trapezius & Shoulder Hump -->
          <path d="
            M 134 37
            C 124 39, 117 48, 112 56
            C 101 59, 93 67, 90 78
            C 93 90, 101 99, 112 103
            L 122 95
            L 126 112
            C 132 117, 143 117, 150 111
            L 157 93
            C 167 89, 175 82, 179 73
            L 186 67
            C 184 55, 173 45, 156 41
            Z"
            fill="url(#bronzeMuscle)"
          />

          <!-- Extended Right Foreleg (Deltoid, Bicep, Radius & Fetlock) -->
          <path d="
            M 111 54
            C 99 58, 91 67, 88 76
            L 64 114
            L 50 133
            C 54 135, 58 135, 62 133
            L 74 115
            C 80 105, 88 96, 95 87
            C 95 75, 101 64, 113 59
            Z"
            fill="url(#bronzeSpecular)"
            opacity="0.92"
          />
          <!-- Forearm Tendon & Muscle Crease -->
          <path d="M 85 83 C 77 95, 70 108, 63 121" fill="none" stroke="#14111c" stroke-width="1.3" stroke-linecap="round" opacity="0.7"/>
          <path d="M 96 67 C 92 75, 91 83, 94 90" fill="none" stroke="#14111c" stroke-width="1.1" stroke-linecap="round" opacity="0.6"/>

          <!-- Back Crest & Spine Highlight -->
          <path d="
            M 134 35
            C 138 37, 139 45, 137 54
            L 149 57
            C 155 51, 152 43, 145 38
            C 141 35, 137 34, 134 35
            Z"
            fill="url(#bronzeSpecular)"
          />
          <path d="M 156 42 C 169 44, 181 51, 185 62 C 178 59, 170 55, 164 49 Z" fill="url(#bronzeSpecular)" opacity="0.85"/>

          <!-- Lunging Front-Left Foreleg Muscle -->
          <path d="M 157 94 L 142 121 L 137 134 L 147 133 L 166 114 L 173 97 Z" fill="url(#bronzeMuscle)"/>
          <path d="M 159 101 L 148 122" stroke="url(#bronzeSpecular)" stroke-width="1.1" stroke-linecap="round" opacity="0.6"/>

          <!-- Hind Leg Thigh Contour -->
          <path d="M 183 78 C 188 89, 188 103, 183 116" fill="none" stroke="url(#bronzeSpecular)" stroke-width="1.3" stroke-linecap="round" opacity="0.55"/>

          <!-- 4. CLOVEN HOOVES (Left/Right Keratin Split) -->
          <!-- Front Right Hoof -->
          <path d="M 48 135 C 46 142, 71 143, 73 135 L 71 131 L 51 132 Z" fill="url(#bronzeMuscle)"/>
          <path d="M 48 135 C 47 141, 56 143, 60 142 L 60 132 L 51 132 Z" fill="url(#bronzeSpecular)"/>
          <line x1="60" y1="133" x2="60" y2="143" stroke="#110e18" stroke-width="1.1"/>

          <!-- Front Left Hoof -->
          <path d="M 124 136 C 122 144, 150 144, 149 136 L 146 132 L 127 132 Z" fill="url(#bronzeMuscle)"/>
          <path d="M 124 136 C 123 142, 132 144, 136 144 L 136 132 L 127 132 Z" fill="url(#bronzeSpecular)" opacity="0.85"/>
          <line x1="136" y1="133" x2="136" y2="145" stroke="#110e18" stroke-width="1.1"/>

          <!-- Back Hooves -->
          <path d="M 106 128 C 106 132, 121 134, 126 128 L 124 124 L 109 125 Z" fill="url(#bronzeMuscle)"/>
          <path d="M 173 129 C 171 136, 194 137, 193 129 L 191 125 L 175 125 Z" fill="url(#bronzeMuscle)"/>

          <!-- 5. SCULPTED HEAD, SNOUT, EYES & HORNS -->
          <!-- Head Cranium & Cheekbones -->
          <path d="
            M 123 64
            C 134 60, 150 62, 161 69
            L 158 84
            L 149 101
            C 148 107, 143 111, 137 111
            C 131 111, 127 106, 127 100
            L 123 83
            Z"
            fill="url(#bronzeBase)"
          />

          <!-- Broad Forehead & Nasal Bridge Highlight -->
          <path d="
            M 125 65
            C 135 62, 148 64, 158 69
            L 153 83
            L 146 97
            C 145 102, 142 105, 137 105
            C 132 105, 129 102, 130 96
            L 129 82
            Z"
            fill="url(#bronzeSpecular)"
          />

          <!-- Heavy Brow Ridges & Deep-Set Eyes -->
          <path d="M 119 70 C 124 72, 129 75, 132 79 L 129 84 C 126 80, 122 77, 119 75 Z" fill="#120f1a"/>
          <path d="M 164 74 C 159 76, 154 78, 151 82 L 153 87 C 156 83, 160 80, 164 78 Z" fill="#120f1a"/>
          <!-- Specular Eye Glints -->
          <circle cx="126" cy="78" r="1" fill="#ffe0be"/>
          <circle cx="156" cy="81" r="1" fill="#ffe0be"/>

          <!-- Ears (Tucked Behind Horns) -->
          <path d="M 114 68 C 111 73, 114 79, 120 80 C 118 76, 117 72, 118 69 Z" fill="url(#bronzeSpecular)"/>
          <path d="M 167 74 C 170 78, 168 83, 162 84 C 164 80, 165 77, 164 74 Z" fill="url(#bronzeMuscle)"/>

          <!-- Muzzle, Flared Nostrils & Lower Lip -->
          <path d="M 129 98 C 127 103, 131 108, 138 108 C 145 108, 149 103, 146 98 C 143 101, 133 101, 129 98 Z" fill="url(#bronzeMuscle)"/>
          <!-- Nostrils -->
          <ellipse cx="132.5" cy="102" rx="2" ry="1.3" transform="rotate(-18 132.5 102)" fill="#100d17"/>
          <ellipse cx="142.5" cy="102" rx="2" ry="1.3" transform="rotate(18 142.5 102)" fill="#100d17"/>
          <!-- Wet Nose Highlight & Chin -->
          <path d="M 134 99.5 Q 137.5 101 141 99.5" fill="none" stroke="#ffe0be" stroke-width="0.9" stroke-linecap="round"/>
          <path d="M 131 109.5 C 135 112, 141 112, 145 109.5" fill="none" stroke="url(#bronzeSpecular)" stroke-width="1.3" stroke-linecap="round"/>

          <!-- Dewlap / Neck Skin Folds Under Chin -->
          <path d="M 126 113 C 132 118, 143 118, 149 113" fill="none" stroke="url(#bronzeSpecular)" stroke-width="1.1" stroke-linecap="round" opacity="0.7"/>
          <path d="M 129 117 C 134 121, 141 121, 146 117" fill="none" stroke="${c1}" stroke-width="0.9" stroke-linecap="round" opacity="0.55"/>

          <!-- 6. TAPERED, ROUNDED HORNS -->
          <!-- Viewer's Left Horn -->
          <path d="
            M 125 65
            C 112 58, 109 42, 115 30
            C 117 30, 119 35, 120 42
            C 122 52, 128 58, 138 60
            Z"
            fill="url(#hornGrad)"
            filter="url(#sculptGlow)"
          />
          <!-- Viewer's Right Horn -->
          <path d="
            M 157 69
            C 172 68, 184 56, 187 42
            C 189 42, 191 48, 190 56
            C 188 72, 175 80, 158 75
            Z"
            fill="url(#hornGrad)"
            filter="url(#sculptGlow)"
          />
          <!-- Horn Base Growth Rings -->
          <path d="M 126 62 C 129 61, 132 61, 134 62 M 160 71 C 162 72, 165 73, 167 72" fill="none" stroke="#14111c" stroke-width="0.9" stroke-linecap="round" opacity="0.65"/>
        </g>
      </svg>
    </div>
  `;
  }

  function renderColorimetriaHero({ eyebrow, titleMain, titleAccent, subtitle, ctaHtml = '' }) {
    const ch = state.challenge;
    const currentRank = ch.ranksLadder[ch.currentRankIndex] || ch.ranksLadder[2];
    const xpPct = Math.min(100, Math.round((ch.userXp / ch.nextLevelXp) * 100));

    return `
      <section class="glass-card colorimetria-hero">
        <div>
          <div class="colorimetria-eyebrow">${escapeHtml(eyebrow)}</div>
          <h2 class="colorimetria-headline">${escapeHtml(titleMain)} <span>${escapeHtml(titleAccent)}</span></h2>
          <p style="color:var(--text-secondary); font-size:13.5px; max-width:520px;">${escapeHtml(subtitle)}</p>

          <div class="level-hex-row">
            <div class="level-hex-shield">
              ${renderTrophyOrMedalSvg('trophy', currentRank.name)}
            </div>
            <div style="flex:1; min-width:210px;">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:4px;">
                <div>
                  <span style="font-size:11.5px; color:var(--text-muted);">Your Level</span>
                  <div style="display:flex; align-items:baseline; gap:8px;">
                    <strong class="font-heading" style="font-size:26px;">${ch.userLevel}</strong>
                    <span style="font-size:13px; color:var(--text-muted);">/ 20</span>
                    <span class="tier-pill tier-${escapeHtml(currentRank.name)}">${escapeHtml(currentRank.name)}</span>
                  </div>
                </div>
                <span class="font-mono" style="font-size:11.5px; color:var(--text-secondary);">${ch.userXp.toLocaleString()} / ${ch.nextLevelXp.toLocaleString()} XP</span>
              </div>
              <div class="challenge-bar-track"><div class="challenge-bar-fill" style="width:${xpPct}%;"></div></div>
            </div>
            ${ctaHtml}
          </div>
        </div>
        ${renderBullCandlesSvg()}
      </section>
    `;
  }

  function renderFollowerDashboard(container) {
    const user = state.followerUser;
    const strategy = user.followedStrategyId ? getStrategyById(user.followedStrategyId) : null;

    const followerHero =
      state.theme === 'serious'
        ? ''
        : renderColorimetriaHero({
          eyebrow: 'Follower Hub & Progress',
          titleMain: 'Follow. Trade.',
          titleAccent: 'Achieve.',
          subtitle: 'Monitor your active copy parameters, risk guardrails, and seasonal milestones.',
          ctaHtml: `<button type="button" class="btn btn-primary btn-sm" id="follower-hero-challenges">Challenges →</button>`
        });

    if (!strategy) {
      container.innerHTML = `
        <div class="view-container">
          ${followerHero}
          <div class="glass-card hud-panel" style="padding:48px 32px; text-align:center;">
            <h2 class="font-display" style="font-size:26px; margin-bottom:10px;">NO ACTIVE STRATEGY FOLLOWED</h2>
            <p style="color:var(--text-secondary); margin-bottom:22px;">Browse verified signal providers in Discover or Global Leaderboards to begin automated copy trading.</p>
            <button class="btn btn-primary" id="go-discover-empty">Explore Strategies</button>
          </div>
          ${renderBadgesSection('follower')}
        </div>
      `;
      $('#follower-hero-challenges').addEventListener('click', () => { state.activeView = 'challenge'; renderSidebar(); renderMainView(); });
      $('#go-discover-empty').addEventListener('click', () => {
        state.activeView = 'discover';
        renderSidebar();
        renderMainView();
      });
      bindBadgeShareEvent();
      return;
    }

    const fs = user.followingSettings;

    container.innerHTML = `
      <div class="view-container">
        ${followerHero}
        <div class="dashboard-top-grid">
          ${renderStrategyOverviewCard(strategy, 'follower')}
          ${renderNotesFeedCard(false)}
        </div>

        <section class="glass-card hud-panel following-settings-card">
          <div class="card-header-flex">
            <h2 class="card-title-lg">My following settings</h2>
            <button type="button" class="btn btn-ghost btn-icon" id="btn-edit-following" title="Edit following settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
          </div>
          <div class="settings-grid-4">
            <div class="setting-box"><div class="setting-box-label">Drawdown</div><div class="setting-box-value">${escapeHtml(fs.drawdown)}</div></div>
            <div class="setting-box"><div class="setting-box-label">Copy mode</div><div class="setting-box-value">${escapeHtml(fs.copyMode)}</div></div>
            <div class="setting-box"><div class="setting-box-label">Copy status</div><div class="setting-box-value ${fs.copyStatus === 'Copying' ? 'status-copying' : ''}">${escapeHtml(fs.copyStatus)}</div></div>
            <div class="setting-box"><div class="setting-box-label">Risk ratio</div><div class="setting-box-value">${fs.riskRatio}</div></div>
            <div class="setting-box"><div class="setting-box-label">Min. lot size</div><div class="setting-box-value">${fs.minLotSize}</div></div>
            <div class="setting-box"><div class="setting-box-label">Max. lot size</div><div class="setting-box-value">${fs.maxLotSize}</div></div>
            <div class="setting-box"><div class="setting-box-label">Max. DD</div><div class="setting-box-value">$${fs.maxDD}</div></div>
          </div>
        </section>

        ${renderBadgesSection('follower')}
        ${renderAnalyticsSection(strategy, ['profitability', 'risk', 'followers'])}
      </div>
    `;

    bindDashboardCommonEvents(strategy, 'follower');
  }

  function renderProviderDashboard(container) {
    const strategy = getStrategyById(state.providerUser.ownStrategyId);

    container.innerHTML = `
      <div class="view-container">
        <div class="dashboard-top-grid">
          ${renderStrategyOverviewCard(strategy, 'provider')}
          ${renderNotesFeedCard(true)}
        </div>

        ${renderBadgesSection('provider')}
        ${renderAnalyticsSection(strategy, ['profitability', 'performance', 'risk', 'followers'])}
      </div>
    `;

    bindDashboardCommonEvents(strategy, 'provider');
  }

  function bindBadgeShareEvent() {
    const btn = $('#btn-share-badges');
    if (btn) {
      btn.addEventListener('click', () => {
        const entry = Data.leaderboardEntries[0];
        openPublicProfileModal(entry);
      });
    }
  }

  function renderStrategyOverviewCard(strategy, mode) {
    const actionBtn =
      mode === 'follower'
        ? `<button type="button" class="btn btn-primary btn-sm" id="btn-unfollow-main">Unfollow</button>`
        : `<div style="display:flex; gap:8px; flex-wrap:wrap;">
             <button type="button" class="btn btn-primary btn-sm" id="btn-share-link">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
               Share Link
             </button>
             <button type="button" class="btn btn-purple btn-sm" id="btn-view-public-profile">Public Profile ↗</button>
           </div>`;

    const editIcon =
      mode === 'provider'
        ? `<button type="button" class="btn btn-ghost btn-icon" id="btn-edit-strategy" title="Edit strategy profile">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
           </button>`
        : '';

    return `
      <section class="glass-card hud-panel strategy-profile-card">
        <div class="strategy-header-row">
          <div class="strategy-identity">
            <div class="strategy-avatar">
              <img src="${renderAvatarImg(strategy.avatarKey)}" alt="${escapeHtml(strategy.name)}" width="76" height="76"/>
            </div>
            <div>
              <div class="strategy-name">${escapeHtml(strategy.name)}</div>
              <div class="strategy-desc">${escapeHtml(strategy.description)}</div>
              ${actionBtn}
            </div>
          </div>
          ${editIcon}
        </div>

        <div>
          <div class="overview-header">
            <h3>Strategy overview</h3>
            <span class="badge badge-profit">Currency: ${escapeHtml(strategy.currency)}</span>
            <span class="badge badge-purple">Strategy type: ${escapeHtml(strategy.strategyType)}</span>
          </div>
          <div class="metrics-grid-4">
            <div class="metric-tile"><div><div class="metric-tile-label">Leverage</div><div class="metric-tile-val">${strategy.leverage}</div></div><span class="metric-tile-icon">⚡</span></div>
            <div class="metric-tile"><div><div class="metric-tile-label">Account type</div><div class="metric-tile-val">${escapeHtml(strategy.accountType)}</div></div><span class="metric-tile-icon">◈</span></div>
            <div class="metric-tile"><div><div class="metric-tile-label">Drawdown</div><div class="metric-tile-val">${strategy.drawdown}</div></div><span class="metric-tile-icon">⇅</span></div>
            <div class="metric-tile"><div><div class="metric-tile-label">Fee</div><div class="metric-tile-val">${strategy.fee}%</div></div><span class="metric-tile-icon">❖</span></div>
          </div>
        </div>

        <div>
          <div class="overview-header"><h3>Most traded symbols</h3></div>
          <div class="symbols-grid-3">
            ${strategy.topSymbols
        .map(
          (sym) => `
              <div class="symbol-tile">
                <div><div class="symbol-name">${escapeHtml(sym.symbol)}</div><div class="symbol-pct">${escapeHtml(sym.pct)}</div></div>
                ${renderFlagPair(sym.flags)}
              </div>
            `
        )
        .join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderNotesFeedCard(canWrite) {
    return `
      <aside class="glass-card feed-card">
        <div class="feed-list">
          ${state.notes
        .map(
          (n) => `
            <div class="feed-note-item">
              <div class="feed-note-head">
                <div class="feed-mini-avatar"><img src="${renderAvatarImg('cyberChart')}" alt="" width="30" height="30"/></div>
                <div class="feed-note-meta">
                  <strong>${escapeHtml(n.author)}</strong>
                  <span>${escapeHtml(n.timestamp)}</span>
                </div>
              </div>
              <div class="feed-note-body">${escapeHtml(n.text)}</div>
            </div>
          `
        )
        .join('')}
        </div>
        ${canWrite
        ? `<div class="feed-footer-actions">
                 <button type="button" class="btn btn-purple btn-sm" id="btn-write-note">+ Write a note</button>
               </div>`
        : ''
      }
      </aside>
    `;
  }

  function renderAnalyticsSection(strategy, tabs) {
    const tabLabels = {
      profitability: 'Profitability',
      performance: 'Performance',
      risk: 'Risk score',
      followers: 'Followers'
    };

    return `
      <div class="analytics-grid">
        <section class="glass-card hud-panel chart-card">
          <div class="tabs-bar">
            ${tabs
        .map(
          (t) => `<button type="button" class="tab-btn ${state.activeAnalyticsTab === t ? 'active' : ''}" data-analytics-tab="${t}">${tabLabels[t]}</button>`
        )
        .join('')}
          </div>

          <div class="chart-controls-row" id="analytics-controls">
            <div class="yield-readout">
              Yield: <span style="color:${strategy.yieldCurrent >= 0 ? 'var(--profit)' : 'var(--accent)'};">${strategy.yieldCurrent}%</span>
            </div>
            <div class="chart-selects">
              <select class="form-select" id="analytics-period-select">
                <option value="year">Year</option>
                <option value="quarter">Quarter</option>
              </select>
              <select class="form-select" id="analytics-year-select">
                <option value="2026" ${state.analyticsYear === '2026' ? 'selected' : ''}>2026</option>
                <option value="2025" ${state.analyticsYear === '2025' ? 'selected' : ''}>2025</option>
              </select>
            </div>
          </div>

          <div class="chart-canvas-wrap" id="analytics-chart-canvas"></div>
        </section>

        <section class="glass-card hud-panel trades-gauge-card">
          <div id="trades-donut-canvas"></div>
          <div class="card-title-lg">Trades</div>
          <div class="trades-gauge-stats">
            <div class="mini-stat"><span>Win Rate</span><strong style="color:var(--profit);">${strategy.winRate}%</strong></div>
            <div class="mini-stat"><span>Profit Factor</span><strong style="color:var(--neon-purple-bright);">${strategy.profitFactor}</strong></div>
          </div>
        </section>
      </div>
    `;
  }

  function bindDashboardCommonEvents(strategy, mode) {
    bindBadgeShareEvent();
    const canvas = $('#analytics-chart-canvas');
    const donut = $('#trades-donut-canvas');
    Charts.renderTradesDonut(donut, strategy.totalTrades, strategy.winRate);

    function renderActiveChart() {
      const tab = state.activeAnalyticsTab;
      if (tab === 'profitability') {
        const vals = strategy.monthlyYield[state.analyticsYear] || strategy.monthlyYield[2026];
        Charts.renderMonthlyBars(canvas, vals);
      } else if (tab === 'performance') {
        Charts.renderEquityCurve(canvas, strategy.equityCurve);
      } else if (tab === 'risk') {
        Charts.renderRiskMeter(canvas, strategy.riskScore);
      } else if (tab === 'followers') {
        canvas.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:10px; padding-top:8px;">
            ${Data.followersList
            .map(
              (f) => `
              <div class="metric-tile">
                <div><strong>${escapeHtml(f.name)}</strong><div class="metric-tile-label">ID ${escapeHtml(f.login)}</div></div>
                <span class="badge badge-purple">${escapeHtml(f.copyMode)}</span>
              </div>
            `
            )
            .join('')}
          </div>
        `;
      }
    }

    renderActiveChart();

    $$('[data-analytics-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.activeAnalyticsTab = btn.dataset.analyticsTab;
        $$('[data-analytics-tab]').forEach((b) => b.classList.toggle('active', b === btn));
        renderActiveChart();
      });
    });

    const yearSelect = $('#analytics-year-select');
    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        state.analyticsYear = e.target.value;
        renderActiveChart();
      });
    }

    if (mode === 'follower') {
      const fHeroBtn = $('#follower-hero-challenges');
      if (fHeroBtn) {
        fHeroBtn.addEventListener('click', () => {
          state.activeView = 'challenge';
          renderSidebar();
          renderMainView();
        });
      }
      const unfollowBtn = $('#btn-unfollow-main');
      if (unfollowBtn) {
        unfollowBtn.addEventListener('click', () => {
          state.followerUser.followedStrategyId = null;
          showToast(`Unfollowed ${strategy.name}`);
          renderMainView();
        });
      }
      const editFollowingBtn = $('#btn-edit-following');
      if (editFollowingBtn) editFollowingBtn.addEventListener('click', openEditFollowingModal);
    } else {
      const shareBtn = $('#btn-share-link');
      if (shareBtn) {
        shareBtn.addEventListener('click', () => {
          const url = `https://communitraders.tradeviewforex.com/ref/TV-SIG-2100224001`;
          if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => { });
          showToast('Personalized manager referral link copied');
        });
      }
      const pubBtn = $('#btn-view-public-profile');
      if (pubBtn) {
        pubBtn.addEventListener('click', () => openPublicProfileModal(Data.leaderboardEntries[0]));
      }
      const editStratBtn = $('#btn-edit-strategy');
      if (editStratBtn) editStratBtn.addEventListener('click', () => openEditStrategyModal(strategy));
      const writeNoteBtn = $('#btn-write-note');
      if (writeNoteBtn) writeNoteBtn.addEventListener('click', openWriteNoteModal);
    }
  }

  // ==========================================================================
  // GLOBAL LEADERBOARDS VIEW (8 TABS x 5 TIMEFRAMES + PUBLIC PROFILES)
  // ==========================================================================
  function getReturnForTimeframe(entry, tf) {
    if (tf === 'weekly') return entry.returnWeekly;
    if (tf === 'monthly') return entry.returnMonthly;
    if (tf === 'quarterly') return entry.returnQuarterly;
    if (tf === 'annual') return entry.returnAnnual;
    return entry.returnAll;
  }

  function renderLeaderboardsView(container, isPublicPreview) {
    const tf = state.leaderboardTimeframe;
    const tab = state.leaderboardTab;

    let rows = [...Data.leaderboardEntries];
    if (tab === 'top-mm') rows = rows.filter((r) => r.type === 'Money Manager').concat(rows.filter((r) => r.type !== 'Money Manager'));
    else if (tab === 'top-sp') rows = rows.filter((r) => r.type === 'Signal Provider').concat(rows.filter((r) => r.type !== 'Signal Provider'));

    rows.sort((a, b) => {
      if (tab === 'best-risk') return b.profitDdRatio - a.profitDdRatio;
      if (tab === 'capital-leaders') return b.aum - a.aum;
      if (tab === 'most-followed') return b.followers - a.followers;
      if (tab === 'fastest-growing') return b.growthPct - a.growthPct;
      if (tab === 'most-consistent') return b.consistencyPct - a.consistencyPct;
      if (tab === 'rising-stars') return b.growthPct - a.growthPct;
      return getReturnForTimeframe(b, tf) - getReturnForTimeframe(a, tf);
    });

    const timeframes = [
      { id: 'weekly', label: 'Weekly' },
      { id: 'monthly', label: 'Monthly' },
      { id: 'quarterly', label: 'Quarterly' },
      { id: 'annual', label: 'Annual' },
      { id: 'all-time', label: 'All-Time' }
    ];

    container.innerHTML = `
      <div class="view-container">
        ${renderColorimetriaHero({
      eyebrow: 'Communitraders Rankings',
      titleMain: 'Compete. Rank.',
      titleAccent: 'Lead.',
      subtitle: 'Verified performance rankings across Money Managers and Signal Providers. Inspect public profiles, badges, and join directly.',
      ctaHtml: `
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              ${isPublicPreview ? `<button type="button" class="btn btn-ghost btn-sm" id="lb-back-login">← Login</button>` : ''}
              <button type="button" class="btn btn-primary btn-sm" id="lb-open-account">Open Account</button>
            </div>
          `
    })}

        <section class="glass-card hud-panel table-panel">
          <div class="lb-tabs-scroll">
            ${Data.leaderboardTabs
        .map(
          (t) => `<button type="button" class="filter-pill ${tab === t.id ? 'active' : ''}" data-lb-tab="${t.id}">${escapeHtml(t.label)}</button>`
        )
        .join('')}
          </div>

          <div class="lb-timeframe-bar">
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              ${timeframes
        .map(
          (f) => `<button type="button" class="btn btn-sm ${tf === f.id ? 'btn-primary' : 'btn-ghost'}" data-lb-tf="${f.id}">${f.label}</button>`
        )
        .join('')}
            </div>
            <span style="font-size:12px; color:var(--text-muted);">Verifiable live &amp; audited trade telemetry • No unverified churn metrics</span>
          </div>

          <div class="table-wrap">
            <table class="vice-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Strategy / Manager</th>
                  <th>Platform</th>
                  <th>Return (${tf.toUpperCase()})</th>
                  <th>Profit / DD</th>
                  <th>AUM</th>
                  <th>Followers</th>
                  <th>Consistency</th>
                  <th>Top Badge</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rows
        .map((r, i) => {
          const ret = getReturnForTimeframe(r, tf);
          const topBadge = r.badges[0];
          return `
                      <tr class="${r.isSelf ? 'is-self-row' : ''}">
                        <td class="font-mono" style="color:var(--neon-purple-bright); font-weight:700;">#${i + 1}</td>
                        <td>
                          <strong>${escapeHtml(r.name)}</strong>
                          ${r.featured ? `<span class="badge badge-accent" style="margin-left:6px; font-size:9.5px;">Featured</span>` : ''}
                          <div style="font-size:11px; color:var(--text-muted);">${escapeHtml(r.manager)} • ${escapeHtml(r.type)}</div>
                        </td>
                        <td><span class="badge badge-neutral">${escapeHtml(r.platform)}</span></td>
                        <td class="font-mono" style="color:var(--profit); font-weight:700;">+${ret.toFixed(2)}%</td>
                        <td class="font-mono">${r.profitDdRatio.toFixed(1)}x</td>
                        <td class="font-mono">$${r.aum.toLocaleString()}</td>
                        <td class="font-mono">${r.followers}</td>
                        <td class="font-mono">${r.consistencyPct}%</td>
                        <td><span class="tier-pill tier-${escapeHtml(topBadge.tier)}">${escapeHtml(topBadge.name)}</span></td>
                        <td>
                          <button type="button" class="btn btn-purple btn-sm" data-open-public-profile="${r.id}">Public Profile</button>
                        </td>
                      </tr>
                    `;
        })
        .join('')}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;

    $$('[data-lb-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.leaderboardTab = btn.dataset.lbTab;
        renderMainView();
      });
    });
    $$('[data-lb-tf]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.leaderboardTimeframe = btn.dataset.lbTf;
        renderMainView();
      });
    });
    $$('[data-open-public-profile]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const entry = Data.leaderboardEntries.find((e) => e.id === btn.dataset.openPublicProfile);
        if (entry) openPublicProfileModal(entry);
      });
    });

    const backBtn = $('#lb-back-login');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.publicLeaderboardsOpen = false;
        renderRoot();
      });
    }
    $('#lb-open-account').addEventListener('click', openTradeviewAccountModal);
  }

  // ==========================================================================
  // PUBLIC PROFILE & CLIENT ACQUISITION MODAL
  // ==========================================================================
  function openPublicProfileModal(entry) {
    const refUrl = `https://communitraders.tradeviewforex.com/ref/${entry.referralCode}`;
    openModal(
      `${entry.name} — Public ${entry.type} Profile`,
      `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <div class="font-heading" style="font-size:17px;">${escapeHtml(entry.manager)}</div>
              <div style="font-size:12px; color:var(--text-secondary);">${escapeHtml(entry.platform)} • ${escapeHtml(entry.type)} • Fee ${entry.fee}%</div>
            </div>
            <span class="badge badge-profit">All-Time +${entry.returnAll}%</span>
          </div>

          <div class="modal-grid-2">
            <div class="setting-box"><div class="setting-box-label">Profit / Drawdown</div><div class="setting-box-value">${entry.profitDdRatio}x</div></div>
            <div class="setting-box"><div class="setting-box-label">Capital (AUM)</div><div class="setting-box-value">$${entry.aum.toLocaleString()}</div></div>
            <div class="setting-box"><div class="setting-box-label">Win Rate / Max DD</div><div class="setting-box-value">${entry.winRate}% / ${entry.maxDD}%</div></div>
            <div class="setting-box"><div class="setting-box-label">Active Followers</div><div class="setting-box-value">${entry.followers}</div></div>
          </div>

          <div>
            <div class="form-label" style="margin-bottom:8px;">Unlocked Badges &amp; Tier Levels</div>
            <div class="share-row">
              ${entry.badges
        .map((b) => `<span class="tier-pill tier-${escapeHtml(b.tier)}">${escapeHtml(b.tier)} • ${escapeHtml(b.name)}</span>`)
        .join('')}
            </div>
          </div>

          <div class="referral-box">
            <div style="min-width:0;">
              <div style="font-size:10.5px; color:var(--text-muted); text-transform:uppercase;">Personalized Referral Link</div>
              <div class="font-mono" style="font-size:11.5px; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(refUrl)}</div>
            </div>
            <button type="button" class="btn btn-purple btn-sm" id="modal-copy-ref">Copy Link</button>
          </div>

          <div>
            <div class="form-label" style="margin-bottom:8px;">Share Achievement &amp; Ranking</div>
            <div class="share-row">
              <button type="button" class="btn btn-ghost btn-sm" data-share-social="X / Twitter">Share on X</button>
              <button type="button" class="btn btn-ghost btn-sm" data-share-social="LinkedIn">Share on LinkedIn</button>
              <button type="button" class="btn btn-ghost btn-sm" data-share-social="Telegram">Share on Telegram</button>
              <button type="button" class="btn btn-outline-pink btn-sm" id="modal-open-tv-account">Open Tradeview Account</button>
            </div>
          </div>
        </div>
      `,
      (close) => {
        if (!state.isAuthenticated) {
          close();
          state.publicLeaderboardsOpen = false;
          renderRoot();
          showToast(`Select Follower or sign in to join ${entry.name}`);
          return;
        }
        state.followerUser.followedStrategyId = entry.strategyId;
        close();
        showToast(`Joined ${entry.name} via verified strategy link!`);
      },
      state.isAuthenticated ? 'Join / Copy Strategy' : 'Sign In to Join Strategy'
    );

    $('#modal-copy-ref').addEventListener('click', () => {
      if (navigator.clipboard) navigator.clipboard.writeText(refUrl).catch(() => { });
      showToast('Referral link copied to clipboard');
    });
    $$('[data-share-social]').forEach((btn) => {
      btn.addEventListener('click', () => {
        showToast(`Prepared share card for ${btn.dataset.shareSocial}`);
      });
    });
    $('#modal-open-tv-account').addEventListener('click', openTradeviewAccountModal);
  }

  function openTradeviewAccountModal() {
    openModal(
      'Open a Tradeview Markets Account',
      `
        <div style="display:flex; flex-direction:column; gap:14px;">
          <p style="font-size:13px; color:var(--text-secondary);">
            Open a live MT4/MT5 account with Tradeview Financial Markets to copy top-ranked strategies on Communitraders &amp; MultiMAM, or qualify via the Demo to Live Challenge.
          </p>
          <div class="form-group">
            <label class="form-label">Account Path</label>
            <select class="form-select" id="tv-acct-path">
              <option value="follower">Live Follower Account (Copy Trading)</option>
              <option value="demo-challenge">Demo to Live Challenge Candidate</option>
              <option value="provider">Signal Provider / MultiMAM Manager</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" id="tv-acct-email" placeholder="trader@domain.com"/>
          </div>
        </div>
      `,
      (close) => {
        close();
        showToast('Account onboarding link dispatched! Compliance review applies for funded challenges.');
      },
      'Continue Onboarding'
    );
  }

  // ==========================================================================
  // DISCOVER VIEW (FOLLOWER)
  // ==========================================================================
  function renderDiscoverView(container) {
    let filtered = state.strategies.filter((s) => {
      const q = state.discoverSearch.trim().toLowerCase();
      if (q && !s.name.toLowerCase().includes(q) && !s.mostTraded.toLowerCase().includes(q)) return false;
      if (state.discoverAsset !== 'ALL' && !s.mostTraded.includes(state.discoverAsset)) return false;
      if (state.discoverFilter === 'popular') return s.popularScore >= 70;
      if (state.discoverFilter === 'low-fee') return s.fee <= 10;
      if (state.discoverFilter === 'high-risk') return s.riskScore >= 5;
      if (state.discoverFilter === 'low-risk') return s.riskScore <= 2;
      return true;
    });

    if (state.discoverSort === 'return') filtered = [...filtered].sort((a, b) => b.totalReturn - a.totalReturn);
    else if (state.discoverSort === 'risk') filtered = [...filtered].sort((a, b) => a.riskScore - b.riskScore);
    else filtered = [...filtered].sort((a, b) => b.popularScore - a.popularScore);

    const followedStrat = state.followerUser.followedStrategyId
      ? getStrategyById(state.followerUser.followedStrategyId)
      : null;

    const filters = [
      { id: 'all', label: 'All' },
      { id: 'popular', label: 'Most popular' },
      { id: 'low-fee', label: 'Low fees' },
      { id: 'high-risk', label: 'High risk' },
      { id: 'low-risk', label: 'Low risk' }
    ];

    container.innerHTML = `
      <div class="view-container">
        ${state.theme === 'serious'
        ? ''
        : renderColorimetriaHero({
          eyebrow: 'Signal Marketplace & Discovery',
          titleMain: 'Explore. Copy.',
          titleAccent: 'Grow.',
          subtitle: `${state.strategies.length} verified strategies live • Currently following: ${followedStrat ? followedStrat.name : 'None'}.`,
          ctaHtml: followedStrat
            ? `<button type="button" class="btn btn-primary btn-sm" id="discover-goto-settings">Following Settings →</button>`
            : `<button type="button" class="btn btn-outline-pink btn-sm" id="discover-goto-lb">Leaderboards →</button>`
        })
      }

        <div class="glass-card hud-panel discover-toolbar">
          <div class="discover-search-group">
            <div class="form-group" style="min-width:155px;">
              <label class="form-label">Assets</label>
              <select class="form-select" id="discover-asset-select">
                <option value="ALL" ${state.discoverAsset === 'ALL' ? 'selected' : ''}>Select assets</option>
                <option value="EURUSD" ${state.discoverAsset === 'EURUSD' ? 'selected' : ''}>EURUSD</option>
                <option value="USDJPY" ${state.discoverAsset === 'USDJPY' ? 'selected' : ''}>USDJPY</option>
                <option value="GBPUSD" ${state.discoverAsset === 'GBPUSD' ? 'selected' : ''}>GBPUSD</option>
              </select>
            </div>
            <div class="form-group" style="min-width:155px;">
              <label class="form-label">Sort by</label>
              <select class="form-select" id="discover-sort-select">
                <option value="popular" ${state.discoverSort === 'popular' ? 'selected' : ''}>Most Popular</option>
                <option value="return" ${state.discoverSort === 'return' ? 'selected' : ''}>Highest Return</option>
                <option value="risk" ${state.discoverSort === 'risk' ? 'selected' : ''}>Lowest Risk</option>
              </select>
            </div>
            <div class="form-group" style="flex:1; min-width:210px; max-width:300px;">
              <label class="form-label">Strategy</label>
              <div class="input-with-icon left-icon">
                <span class="input-icon-left">🔍</span>
                <input type="text" class="form-control" id="discover-search-input" placeholder="Search by strategy name" value="${escapeHtml(state.discoverSearch)}"/>
              </div>
            </div>
            <button type="button" class="btn btn-primary" id="discover-search-btn" style="height:44px;">Search</button>
          </div>

          <div class="discover-filter-pills">
            ${filters.map((f) => `<button type="button" class="filter-pill ${state.discoverFilter === f.id ? 'active' : ''}" data-filter="${f.id}">${f.label}</button>`).join('')}
          </div>
        </div>

        <div class="strategies-grid">
          ${filtered.length === 0 ? `<div class="glass-card" style="grid-column:1/-1; padding:42px; text-align:center; color:var(--text-muted);">No strategies match your current filter.</div>` : filtered.map((s) => renderDiscoverCard(s)).join('')}
        </div>
      </div>
    `;

    const gotoBtn = $('#discover-goto-settings');
    if (gotoBtn) {
      gotoBtn.addEventListener('click', () => {
        state.activeView = 'following';
        renderSidebar();
        renderMainView();
      });
    }
    const gotoLbBtn = $('#discover-goto-lb');
    if (gotoLbBtn) {
      gotoLbBtn.addEventListener('click', () => {
        state.activeView = 'leaderboards';
        renderSidebar();
        renderMainView();
      });
    }
    $('#discover-asset-select').addEventListener('change', (e) => { state.discoverAsset = e.target.value; renderMainView(); });
    $('#discover-sort-select').addEventListener('change', (e) => { state.discoverSort = e.target.value; renderMainView(); });
    $('#discover-search-btn').addEventListener('click', () => { state.discoverSearch = $('#discover-search-input').value; renderMainView(); });
    $('#discover-search-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { state.discoverSearch = e.target.value; renderMainView(); } });
    $$('[data-filter]').forEach((btn) => btn.addEventListener('click', () => { state.discoverFilter = btn.dataset.filter; renderMainView(); }));

    $$('[data-follow-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sid = btn.dataset.followToggle;
        const strat = getStrategyById(sid);
        if (state.followerUser.followedStrategyId === sid) {
          state.followerUser.followedStrategyId = null;
          showToast(`Unfollowed ${strat.name}`);
        } else {
          state.followerUser.followedStrategyId = sid;
          showToast(`Now copying ${strat.name}`);
        }
        renderMainView();
      });
    });

    $$('[data-discover-more]').forEach((btn) => {
      btn.addEventListener('click', () => openStrategyDetailModal(getStrategyById(btn.dataset.discoverMore)));
    });
  }

  function renderDiscoverCard(s) {
    const isFollowed = state.followerUser.followedStrategyId === s.id;
    const returnBadgeClass = s.totalReturn < 0 ? 'badge-loss' : 'badge-profit';
    const riskFillClass = s.riskScore >= 6 ? 'high' : s.riskScore >= 3 ? 'medium' : '';
    const riskWidth = Math.max(4, Math.min(100, s.riskScore * 12));

    return `
      <article class="glass-card strategy-card ${isFollowed ? 'is-following' : ''}">
        <div class="sc-top">
          <div class="sc-user">
            <div class="sc-avatar"><img src="${renderAvatarImg(s.avatarKey)}" alt="" width="42" height="42"/></div>
            <div class="sc-title" title="${escapeHtml(s.name)}">${escapeHtml(s.name)}</div>
          </div>
          <div class="sc-return-col">
            <small>Total return</small>
            <span class="badge ${returnBadgeClass} font-mono">${s.totalReturn.toFixed(2)}%</span>
          </div>
        </div>

        <div class="sc-meta-row"><span>Fee: <strong>${s.fee}%</strong></span><span>Drawdown: <strong>${s.drawdown}</strong></span></div>
        <div class="sc-meta-row"><span>Followers: <strong>${s.followersCount}</strong></span><span>Most traded: <strong>${escapeHtml(s.mostTraded)}</strong></span></div>

        <div class="sc-risk-block">
          <div class="sc-risk-top"><span>Risk score: <strong class="font-mono">${s.riskScore}</strong></span><span style="color:${s.riskScore >= 5 ? 'var(--accent)' : 'var(--profit)'}; font-size:11px;">▲</span></div>
          <div class="risk-bar-track"><div class="risk-bar-fill ${riskFillClass}" style="width:${riskWidth}%;"></div></div>
        </div>

        <div class="sc-actions">
          <button type="button" class="sc-discover-link" data-discover-more="${s.id}">Discover more</button>
          <button type="button" class="btn btn-sm ${isFollowed ? 'btn-primary' : 'btn-purple'}" data-follow-toggle="${s.id}">${isFollowed ? 'Unfollow' : 'Follow'}</button>
        </div>
      </article>
    `;
  }

  // ==========================================================================
  // 7 SEASON CHALLENGES WINDOW (TROPHIES, MEDALS, STARS, RANKS & LEVEL UP)
  // ==========================================================================
  function renderTrophyOrMedalSvg(kind, tier) {
    const isSerious = state.theme === 'serious';
    const color = isSerious
      ? tier === 'Legendary'
        ? '#d60093'
        : tier === 'Platinum'
          ? '#d4d4d8'
          : tier === 'Gold'
            ? '#ff8d35'
            : tier === 'Silver'
              ? '#a1aab8'
              : '#b87b4b'
      : tier === 'Legendary'
        ? '#e81c7b'
        : tier === 'Platinum'
          ? '#d580ff'
          : tier === 'Gold'
            ? '#ffd166'
            : tier === 'Silver'
              ? '#cbd5e1'
              : '#cd7f32';
    if (kind === 'medal') {
      return `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="14" r="6" fill="rgba(255,255,255,0.04)"/>
          <path d="M9 3h6l-1.5 5h-3L9 3z"/>
          <polygon points="12 11.2 12.9 13 14.8 13.3 13.4 14.6 13.7 16.5 12 15.6 10.3 16.5 10.6 14.6 9.2 13.3 11.1 13" fill="${color}"/>
        </svg>
      `;
    }
    return `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" fill="rgba(255,255,255,0.04)"/>
      </svg>
    `;
  }

  function renderStars(count, max = 5) {
    let out = '<span class="star-rating" aria-label="' + count + ' out of ' + max + ' stars">';
    for (let i = 1; i <= max; i++) {
      out += `<span class="${i <= count ? '' : 'dim'}">★</span>`;
    }
    return out + '</span>';
  }

  function triggerLevelUpAnimation(newLevel, newRankName, rewardText) {
    const overlay = $('#level-up-overlay');
    if (!overlay) return;
    const isSerious = state.theme === 'serious';
    overlay.innerHTML = `
      <div class="level-up-card">
        <div class="level-up-stars-row">
          <span>★</span><span>★</span><span style="font-size:28px;">★</span><span>★</span><span>★</span>
        </div>
        <div class="level-up-burst">
          ${renderTrophyOrMedalSvg('trophy', newRankName)}
        </div>
        <div class="hud-tag" style="margin:0 auto 10px;">
          <span class="hud-dot"></span>
          <span>${isSerious ? 'ACCOUNT TIER // PROGRESSION' : 'PROFILE ADVANCEMENT // LEVEL UP'}</span>
        </div>
        <h2 class="font-display" style="font-size:32px; color:#ffffff; margin-bottom:4px;">${isSerious ? `Tier Level ${newLevel}` : `LEVEL ${newLevel} REACHED`}</h2>
        <div style="margin-bottom:12px;">
          <span class="tier-pill tier-${escapeHtml(newRankName)}">${escapeHtml(newRankName)} Rank</span>
        </div>
        <p style="font-size:13px; color:var(--text-secondary);">
          ${escapeHtml(rewardText || 'New performance tier & profile visibility unlocked!')}
        </p>
        <div class="level-up-bar-wrap"><div class="level-up-bar-fill"></div></div>
        <div class="font-mono" style="font-size:11.5px; color:var(--profit); margin-bottom:18px;">+750 XP AWARDED • VERIFIED TELEMETRY</div>
        <button type="button" class="btn btn-primary" id="close-level-up-btn" style="width:100%;">Continue</button>
      </div>
    `;
    overlay.classList.remove('hidden');
    $('#close-level-up-btn').addEventListener('click', () => overlay.classList.add('hidden'));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.add('hidden');
    });
  }

  function renderChallengeView(container) {
    const ch = state.challenge;
    const currentRank = ch.ranksLadder[ch.currentRankIndex] || ch.ranksLadder[2];
    const gridChallenges = ch.challengesCatalog.slice(0, 6);

    container.innerHTML = `
      <div class="view-container">
        <!-- Colorimetria Hero ("Grow. Trade. Achieve." + Level Shield + Bull & Candles) -->
        ${renderColorimetriaHero({
      eyebrow: 'Levels & Achievements',
      titleMain: 'Grow. Trade.',
      titleAccent: 'Achieve.',
      subtitle: 'Complete challenges, unlock achievements, and take your trading journey to the next level.',
      ctaHtml: `<button type="button" class="btn btn-primary btn-sm" id="btn-simulate-levelup">${state.theme === 'serious' ? 'Tier Upgrade Preview' : '⚡ Level Up Preview'}</button>`
    })}

        <!-- Highlighted Levels & Ranks Ladder -->
        <section class="glass-card hud-panel following-settings-card">
          <div class="card-header-flex">
            <h3 class="card-title-lg">Levels &amp; Rank Progression Ladder</h3>
            <span class="badge badge-accent">Current: ${escapeHtml(currentRank.name)} (LVL ${ch.userLevel})</span>
          </div>
          <div class="rank-ladder-strip">
            ${ch.ranksLadder
        .map((r, idx) => {
          const isCurrent = idx === ch.currentRankIndex;
          const isPassed = idx < ch.currentRankIndex;
          return `
                  <div class="rank-step ${isCurrent ? 'current' : isPassed ? 'passed' : ''}">
                    ${renderTrophyOrMedalSvg(idx >= 3 ? 'trophy' : 'medal', r.name)}
                    <span class="tier-pill tier-${escapeHtml(r.name)}">${escapeHtml(r.name)}</span>
                    ${renderStars(r.stars, 5)}
                    <div class="font-mono" style="font-size:11px; color:var(--text-secondary);">LVL ${r.minLevel}+</div>
                    <div style="font-size:10.5px; color:var(--text-muted);">${escapeHtml(r.perk)}</div>
                  </div>
                `;
        })
        .join('')}
          </div>
        </section>

        <!-- Trophies, Medals & Stars Cabinet -->
        <section class="glass-card hud-panel following-settings-card">
          <div class="card-header-flex">
            <h3 class="card-title-lg">Trophies, Medals &amp; Achievement Stars</h3>
            <span class="badge badge-purple">${ch.trophiesAndMedals.length} Honors Unlocked</span>
          </div>
          <div class="trophy-cabinet-grid">
            ${ch.trophiesAndMedals
        .map(
          (tm) => `
                <article class="trophy-item-card">
                  <div class="trophy-icon-ring">${renderTrophyOrMedalSvg(tm.kind, tm.tier)}</div>
                  <span class="tier-pill tier-${escapeHtml(tm.tier)}">${escapeHtml(tm.tier)} ${tm.kind === 'trophy' ? 'Trophy' : 'Medal'}</span>
                  <div class="badge-title">${escapeHtml(tm.name)}</div>
                  ${renderStars(tm.stars, 5)}
                  <div class="badge-desc">${escapeHtml(tm.desc)}</div>
                </article>
              `
        )
        .join('')}
          </div>
        </section>

        <section>
          <div class="card-header-flex">
            <h3 class="card-title-lg" style="display:flex; align-items:center; gap:8px;">
              ${renderTrophyOrMedalSvg('trophy', 'Legendary')}
              <span>Challenges</span>
            </h3>
            <button type="button" class="btn btn-outline-pink btn-sm" id="btn-preview-tim-alert">Trigger Manager Tim Alert</button>
          </div>

          <!-- 3-Column Colorimetria Challenge Grid (6 Cards + Manager League Banner below) -->
          <div class="challenges-catalog-grid">
            ${gridChallenges
        .map((c, idx) => {
          const isClaimed = c.status === 'claimed';
          const isClaimable = c.status === 'claimable';
          const iconKind = idx % 2 === 0 ? 'trophy' : 'medal';
          const rewardTier = isClaimed ? 'Platinum' : isClaimable ? 'Gold' : 'Silver';
          const stars = isClaimed ? 5 : isClaimable ? 4 : 3;
          return `
                  <article class="glass-card challenge-full-card">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <div class="trophy-icon-ring" style="width:42px; height:42px;">${renderTrophyOrMedalSvg(iconKind, rewardTier)}</div>
                      <span class="challenge-lock-badge" title="${escapeHtml(c.status)}">${isClaimed ? '✓' : isClaimable ? '★' : '🔒'}</span>
                    </div>

                    <div>
                      <div class="mission-title" style="margin-bottom:4px;">${escapeHtml(c.name)}</div>
                      ${renderStars(stars, 5)}
                      <div class="mission-desc" style="margin-top:6px;">${escapeHtml(c.objective)}</div>
                    </div>

                    <div class="challenge-meta-grid">
                      <div class="challenge-meta-pill"><span>Eligibility</span>${escapeHtml(c.eligibility)}</div>
                      <div class="challenge-meta-pill"><span>Window</span>${escapeHtml(c.startDate)} → ${escapeHtml(c.endDate)}</div>
                    </div>

                    <div>
                      <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:5px;">
                        <span style="color:var(--text-muted);">Progress (${escapeHtml(c.rank)})</span>
                        <strong class="font-mono">${c.progressPct}%</strong>
                      </div>
                      <div class="challenge-bar-track"><div class="challenge-bar-fill" style="width:${c.progressPct}%;"></div></div>
                    </div>

                    <button type="button"
                      class="btn challenge-cta-pill ${idx === 0 || isClaimable ? 'btn-primary' : 'btn-outline-pink'}"
                      data-claim-challenge="${c.id}"
                      ${isClaimed ? 'disabled' : ''}>
                      ${isClaimed ? '✓ Claimed' : isClaimable ? 'Join Challenge →' : 'Join Challenge →'}
                    </button>
                  </article>
                `;
        })
        .join('')}
          </div>
        </section>

        <!-- Featured Manager League Banner (Matched to colorimetria_dark & Colorimetria_light) -->
        <section class="league-banner-card">
          <div style="display:flex; align-items:center; gap:16px;">
            <div class="trophy-icon-ring" style="background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.35);">
              ${renderTrophyOrMedalSvg('trophy', 'Gold')}
            </div>
            <div>
              <h3 class="font-heading" style="font-size:20px; color:#ffffff; margin-bottom:2px;">Manager League</h3>
              <p style="font-size:13px; color:rgba(255,255,255,0.88);">Monthly, quarterly and annual competitions.</p>
            </div>
          </div>
          <button type="button" class="league-banner-btn" id="btn-view-league-lb">View League →</button>
        </section>
      </div>
    `;

    $('#btn-view-league-lb').addEventListener('click', () => {
      state.activeView = 'leaderboards';
      renderSidebar();
      renderMainView();
    });

    $('#btn-simulate-levelup').addEventListener('click', () => {
      ch.userLevel += 1;
      ch.userXp += 750;
      if (ch.userXp >= ch.nextLevelXp) {
        ch.userXp = ch.userXp - ch.nextLevelXp + 400;
        ch.nextLevelXp += 1000;
        ch.currentRankIndex = Math.min(ch.ranksLadder.length - 1, ch.currentRankIndex + 1);
      }
      const nextRank = ch.ranksLadder[ch.currentRankIndex];
      renderMainView();
      triggerLevelUpAnimation(ch.userLevel, nextRank.name, `Advanced to ${nextRank.name} Rank — ${nextRank.perk}`);
      showTimNotification('Level Up Achieved!', nextRank.name, `Congratulations! You reached Level ${ch.userLevel} (${nextRank.name} Rank).`);
    });

    $('#btn-preview-tim-alert').addEventListener('click', () => {
      const preset = Data.timNotifications[state.timAlertIndex % Data.timNotifications.length];
      state.timAlertIndex += 1;
      showTimNotification(preset.title, preset.tier, preset.text);
    });

    $$('[data-claim-challenge]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = state.challenge.challengesCatalog.find((c) => c.id === btn.dataset.claimChallenge);
        if (!item) return;
        if (item.status === 'claimable') {
          item.status = 'claimed';
          ch.userLevel += 1;
          ch.userXp += 750;
          if (ch.userXp >= ch.nextLevelXp) {
            ch.userXp = ch.userXp - ch.nextLevelXp + 350;
            ch.nextLevelXp += 1000;
            ch.currentRankIndex = Math.min(ch.ranksLadder.length - 1, ch.currentRankIndex + 1);
          }
          const nextRank = ch.ranksLadder[ch.currentRankIndex];
          renderMainView();
          triggerLevelUpAnimation(ch.userLevel, nextRank.name, `Completed ${item.name} • Unlocked ${item.reward}`);
          showTimNotification('Challenge Completed!', nextRank.name, `Congratulations! You completed ${item.name} and unlocked: ${item.reward}`);
        } else {
          showTimNotification(item.name, 'Silver', `${item.progressPct}% complete (${item.rank}). Keep drawdown controlled to qualify.`);
        }
      });
    });
  }

  function renderFollowersListView(container) {
    const q = state.followersSearch.trim().toLowerCase();
    const rows = Data.followersList.filter(
      (f) => !q || f.login.toLowerCase().includes(q) || f.name.toLowerCase().includes(q)
    );

    container.innerHTML = `
      <div class="view-container">
        <section class="glass-card hud-panel table-panel">
          <h2 class="card-title-lg" style="font-size:18px;">My followers</h2>

          <div class="table-search-row">
            <div class="input-with-icon left-icon">
              <span class="input-icon-left">🔍</span>
              <input type="text" class="form-control" id="followers-search-input" placeholder="Search by: login or name" value="${escapeHtml(state.followersSearch)}"/>
            </div>
            <button type="button" class="btn btn-primary" id="followers-search-btn" style="height:44px;">Search</button>
          </div>

          <div class="table-wrap">
            <table class="vice-table">
              <thead>
                <tr>
                  <th>Follower</th><th>Follower name</th><th>Copy mode <span class="help-dot" title="Proportional or FixedLots">?</span></th>
                  <th>Min. lot size</th><th>Max. lot size</th><th>Risk ratio <span class="help-dot" title="Multiplier applied to provider volume">?</span></th>
                  <th>Fixed lot amt. <span class="help-dot" title="Fixed trade volume per copied order">?</span></th>
                  <th>DD protection <span class="help-dot" title="Drawdown equity shield mode">?</span></th>
                  <th>Max. DD <span class="help-dot" title="Maximum drawdown threshold">?</span></th>
                </tr>
              </thead>
              <tbody>
                ${rows.length === 0
        ? `<tr><td colspan="9" class="empty-state-cell">No matching followers found</td></tr>`
        : rows
          .map(
            (f) => `
                    <tr>
                      <td class="font-mono" style="color:var(--neon-purple-bright);">${escapeHtml(f.login)}</td>
                      <td><strong>${escapeHtml(f.name)}</strong></td>
                      <td><span class="badge ${f.copyMode === 'FixedLots' ? 'badge-accent' : 'badge-purple'}">${escapeHtml(f.copyMode)}</span></td>
                      <td class="font-mono">${escapeHtml(f.minLot)}</td>
                      <td class="font-mono">${escapeHtml(f.maxLot)}</td>
                      <td class="font-mono">${escapeHtml(f.riskRatio)}</td>
                      <td class="font-mono">${escapeHtml(f.fixedLotAmt)}</td>
                      <td>${escapeHtml(f.ddProtection)}</td>
                      <td class="font-mono">${escapeHtml(f.maxDD)}</td>
                    </tr>
                  `
          )
          .join('')
      }
              </tbody>
            </table>
          </div>

          <div class="table-footer">
            <div>Total: <strong class="font-mono">${rows.length}</strong></div>
            <div class="pagination"><button type="button" class="page-btn">&lt;</button><button type="button" class="page-btn active">1</button><button type="button" class="page-btn">&gt;</button></div>
          </div>
        </section>
      </div>
    `;

    $('#followers-search-btn').addEventListener('click', () => { state.followersSearch = $('#followers-search-input').value; renderMainView(); });
    $('#followers-search-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { state.followersSearch = e.target.value; renderMainView(); } });
  }

  function renderOrdersView(container) {
    const isFollower = state.activeRole === 'follower';
    const tabs = isFollower
      ? [{ id: 'open', label: 'Open orders' }, { id: 'closed', label: 'Close orders' }, { id: 'history', label: 'Historical settings' }]
      : [{ id: 'open', label: 'Open orders' }, { id: 'closed', label: 'Close orders' }];

    const q = state.ordersSearch.trim().toLowerCase();
    let tableContent = '';
    let rowCount = 0;

    if (state.ordersTab === 'history' && isFollower) {
      const hRows = state.historicalSettings.filter((h) => !q || h.strategy.toLowerCase().includes(q) || h.action.toLowerCase().includes(q));
      rowCount = hRows.length;
      tableContent = `
        <table class="vice-table">
          <thead><tr><th>Date</th><th>Strategy</th><th>Copy Mode</th><th>Risk / Lot</th><th>Min / Max Lot</th><th>DD Protection</th><th>Change</th></tr></thead>
          <tbody>
            ${hRows.length === 0 ? `<tr><td colspan="7" class="empty-state-cell">No rows</td></tr>` : hRows.map((h) => `
              <tr>
                <td class="font-mono">${escapeHtml(h.date)}</td><td><strong>${escapeHtml(h.strategy)}</strong></td>
                <td><span class="badge badge-purple">${escapeHtml(h.copyMode)}</span></td><td class="font-mono">${escapeHtml(h.riskOrLot)}</td>
                <td class="font-mono">${escapeHtml(h.minMaxLot)}</td><td>${escapeHtml(h.ddProtection)}</td><td>${escapeHtml(h.action)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      const source = state.ordersTab === 'open' ? state.openOrders : state.closedOrders;
      const oRows = source.filter((o) => !q || o.ticket.toLowerCase().includes(q) || o.symbol.toLowerCase().includes(q) || o.comment.toLowerCase().includes(q));
      rowCount = oRows.length;
      tableContent = `
        <table class="vice-table">
          <thead><tr><th>Ticket</th><th>Open Time</th><th>Type</th><th>Symbol</th><th>Volume</th><th>Price</th><th>Stop Loss</th><th>Take Profit</th><th>Commission</th><th>Swap</th><th>Profit/Loss</th><th>Comment</th></tr></thead>
          <tbody>
            ${oRows.length === 0 ? `<tr><td colspan="12" class="empty-state-cell">No rows</td></tr>` : oRows.map((o) => `
              <tr>
                <td class="font-mono" style="color:var(--neon-purple-bright);">${escapeHtml(o.ticket)}</td>
                <td class="font-mono">${escapeHtml(o.openTime)}</td>
                <td><span class="badge ${o.type === 'BUY' ? 'badge-profit' : 'badge-loss'}">${escapeHtml(o.type)}</span></td>
                <td><strong>${escapeHtml(o.symbol)}</strong></td><td class="font-mono">${escapeHtml(o.volume)}</td>
                <td class="font-mono">${escapeHtml(o.price)}</td><td class="font-mono">${escapeHtml(o.sl)}</td>
                <td class="font-mono">${escapeHtml(o.tp)}</td><td class="font-mono">${escapeHtml(o.commission)}</td>
                <td class="font-mono">${escapeHtml(o.swap)}</td>
                <td class="font-mono" style="color:${o.pnl.startsWith('-') ? 'var(--accent)' : 'var(--profit)'}; font-weight:700;">${escapeHtml(o.pnl)}</td>
                <td style="color:var(--text-secondary);">${escapeHtml(o.comment)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    container.innerHTML = `
      <div class="view-container">
        <section class="glass-card hud-panel table-panel">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
            <h2 class="card-title-lg" style="font-size:18px;">Orders</h2>
            ${state.ordersTab === 'open' ? `<button type="button" class="btn btn-outline-pink btn-sm" id="btn-simulate-order">${state.openOrders.length ? 'Clear Simulated Order' : '+ Simulate Live Order'}</button>` : ''}
          </div>
          <div class="tabs-bar">${tabs.map((t) => `<button type="button" class="tab-btn ${state.ordersTab === t.id ? 'active' : ''}" data-orders-tab="${t.id}">${t.label}</button>`).join('')}</div>
          <div class="table-search-row">
            <div class="input-with-icon left-icon"><span class="input-icon-left">🔍</span><input type="text" class="form-control" id="orders-search-input" placeholder="Search order" value="${escapeHtml(state.ordersSearch)}"/></div>
            <button type="button" class="btn btn-primary" id="orders-search-btn" style="height:44px;">Search</button>
          </div>
          <div class="table-wrap">${tableContent}</div>
          <div class="table-footer"><div>Total: <strong class="font-mono">${rowCount}</strong></div><div class="pagination"><button type="button" class="page-btn">&lt;</button><button type="button" class="page-btn active">1</button><button type="button" class="page-btn">&gt;</button></div></div>
        </section>
      </div>
    `;

    $$('[data-orders-tab]').forEach((btn) => btn.addEventListener('click', () => { state.ordersTab = btn.dataset.ordersTab; renderMainView(); }));
    $('#orders-search-btn').addEventListener('click', () => { state.ordersSearch = $('#orders-search-input').value; renderMainView(); });
    $('#orders-search-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { state.ordersSearch = e.target.value; renderMainView(); } });

    const simBtn = $('#btn-simulate-order');
    if (simBtn) {
      simBtn.addEventListener('click', () => {
        if (state.openOrders.length) {
          state.openOrders = [];
          showToast('Reset Open Orders to empty state');
        } else {
          state.openOrders = [{ ...Data.orders.sampleSimulatedOrder }];
          showToast('Simulated live EURUSD order added');
        }
        renderMainView();
      });
    }
  }

  function openModal(title, bodyHtml, onSave, saveLabel = 'Save Changes') {
    const backdrop = $('#modal-backdrop');
    backdrop.innerHTML = `
      <div class="glass-card hud-panel modal-box">
        <div class="modal-header"><h3>${escapeHtml(title)}</h3><button type="button" class="btn btn-ghost btn-icon" id="modal-close-x">✕</button></div>
        <div id="modal-body">${bodyHtml}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" id="modal-cancel-btn">Cancel</button>
          ${onSave ? `<button type="button" class="btn btn-primary" id="modal-save-btn">${escapeHtml(saveLabel)}</button>` : ''}
        </div>
      </div>
    `;
    backdrop.classList.remove('hidden');
    const close = () => backdrop.classList.add('hidden');
    $('#modal-close-x').addEventListener('click', close);
    $('#modal-cancel-btn').addEventListener('click', close);
    if (onSave) $('#modal-save-btn').addEventListener('click', () => onSave(close));
  }

  function openEditFollowingModal() {
    const fs = state.followerUser.followingSettings;
    openModal(
      'Edit My Following Settings',
      `
        <div class="modal-grid-2">
          <div class="form-group"><label class="form-label">Drawdown Protection</label><select class="form-select" id="m-fs-dd"><option value="In equity" ${fs.drawdown === 'In equity' ? 'selected' : ''}>In equity</option><option value="No drawdown" ${fs.drawdown === 'No drawdown' ? 'selected' : ''}>No drawdown</option></select></div>
          <div class="form-group"><label class="form-label">Copy mode</label><select class="form-select" id="m-fs-mode"><option value="FixedLots" ${fs.copyMode === 'FixedLots' ? 'selected' : ''}>FixedLots</option><option value="Proportional" ${fs.copyMode === 'Proportional' ? 'selected' : ''}>Proportional</option></select></div>
          <div class="form-group"><label class="form-label">Risk ratio</label><input type="number" step="0.1" class="form-control" id="m-fs-risk" value="${fs.riskRatio}"/></div>
          <div class="form-group"><label class="form-label">Max. DD ($)</label><input type="number" class="form-control" id="m-fs-maxdd" value="${fs.maxDD}"/></div>
          <div class="form-group"><label class="form-label">Min. lot size</label><input type="number" step="0.01" class="form-control" id="m-fs-minlot" value="${fs.minLotSize}"/></div>
          <div class="form-group"><label class="form-label">Max. lot size</label><input type="number" step="0.1" class="form-control" id="m-fs-maxlot" value="${fs.maxLotSize}"/></div>
        </div>
      `,
      (close) => {
        fs.drawdown = $('#m-fs-dd').value;
        fs.copyMode = $('#m-fs-mode').value;
        fs.riskRatio = parseFloat($('#m-fs-risk').value) || 1;
        fs.maxDD = parseInt($('#m-fs-maxdd').value, 10) || 0;
        fs.minLotSize = parseFloat($('#m-fs-minlot').value) || 0.01;
        fs.maxLotSize = parseFloat($('#m-fs-maxlot').value) || 10;
        state.historicalSettings.unshift({
          date: new Date().toISOString().slice(0, 19).replace('T', ' '),
          strategy: getStrategyById(state.followerUser.followedStrategyId).name,
          copyMode: fs.copyMode,
          riskOrLot: `${fs.riskRatio}`,
          minMaxLot: `${fs.minLotSize} / ${fs.maxLotSize}`,
          ddProtection: `${fs.drawdown} ($${fs.maxDD})`,
          action: 'Updated following parameters'
        });
        close();
        renderMainView();
        showToast('Following settings saved');
      }
    );
  }

  function openEditStrategyModal(strategy) {
    openModal(
      'Edit Signal Provider Profile',
      `
        <div style="display:flex; flex-direction:column; gap:14px;">
          <div class="form-group"><label class="form-label">Strategy Name</label><input type="text" class="form-control" id="m-st-name" value="${escapeHtml(strategy.name)}"/></div>
          <div class="form-group"><label class="form-label">Description</label><input type="text" class="form-control" id="m-st-desc" value="${escapeHtml(strategy.description)}"/></div>
          <div class="modal-grid-2">
            <div class="form-group"><label class="form-label">Performance Fee (%)</label><input type="number" min="0" max="50" class="form-control" id="m-st-fee" value="${strategy.fee}"/></div>
            <div class="form-group"><label class="form-label">Strategy Type</label><select class="form-select" id="m-st-type"><option value="ExpertAdvisor" ${strategy.strategyType === 'ExpertAdvisor' ? 'selected' : ''}>ExpertAdvisor</option><option value="Manual" ${strategy.strategyType === 'Manual' ? 'selected' : ''}>Manual</option></select></div>
          </div>
        </div>
      `,
      (close) => {
        const oldFee = strategy.fee;
        strategy.name = $('#m-st-name').value.trim() || strategy.name;
        strategy.description = $('#m-st-desc').value.trim() || strategy.description;
        strategy.fee = parseInt($('#m-st-fee').value, 10) || 0;
        strategy.strategyType = $('#m-st-type').value;
        if (oldFee !== strategy.fee) {
          state.notes.unshift({
            id: `note-${Date.now()}`,
            author: strategy.name,
            timestamp: 'Just now',
            text: `[Automatic message] Important!, this signal provider has just updated its fee from ${oldFee}% to ${strategy.fee}%.`
          });
        }
        close();
        renderMainView();
        showToast('Strategy profile updated');
      }
    );
  }

  function openWriteNoteModal() {
    openModal(
      'Broadcast Note to Followers',
      `<div class="form-group"><label class="form-label">Message</label><textarea id="m-note-text" class="form-control" style="height:110px; padding:12px; resize:vertical;" placeholder="Share trade commentary, risk updates, or session schedule..."></textarea></div>`,
      (close) => {
        const txt = $('#m-note-text').value.trim();
        if (!txt) return;
        const strat = getStrategyById(state.providerUser.ownStrategyId);
        state.notes.unshift({ id: `note-${Date.now()}`, author: strat.name, timestamp: 'Just now', text: txt });
        close();
        renderMainView();
        showToast('Note posted to followers feed');
      },
      'Publish Note'
    );
  }

  function openStrategyDetailModal(strategy) {
    const isFollowed = state.followerUser.followedStrategyId === strategy.id;
    openModal(
      `${strategy.name} — Strategy Details`,
      `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; align-items:center; gap:14px;">
            <img src="${renderAvatarImg(strategy.avatarKey)}" width="56" height="56" style="border-radius:50%; border:1.5px solid var(--neon-purple);"/>
            <div>
              <div style="font-size:13px; color:var(--text-secondary);">${escapeHtml(strategy.description)}</div>
              <div style="display:flex; gap:8px; margin-top:6px;">
                <span class="badge badge-profit">Return: ${strategy.totalReturn}%</span>
                <span class="badge badge-purple">Fee: ${strategy.fee}%</span>
                <span class="badge badge-accent">Risk: ${strategy.riskScore}</span>
              </div>
            </div>
          </div>
          <div id="modal-detail-curve" style="height:180px;"></div>
          <div class="modal-grid-2">
            <div class="setting-box"><div class="setting-box-label">Followers</div><div class="setting-box-value">${strategy.followersCount}</div></div>
            <div class="setting-box"><div class="setting-box-label">Win Rate</div><div class="setting-box-value">${strategy.winRate}%</div></div>
          </div>
        </div>
      `,
      (close) => {
        if (isFollowed) {
          state.followerUser.followedStrategyId = null;
          showToast(`Unfollowed ${strategy.name}`);
        } else {
          state.followerUser.followedStrategyId = strategy.id;
          showToast(`Following ${strategy.name}`);
        }
        close();
        renderMainView();
      },
      isFollowed ? 'Unfollow Strategy' : 'Follow Strategy'
    );
    Charts.renderEquityCurve($('#modal-detail-curve'), strategy.equityCurve);
  }

  // ==========================================================================
  // MANAGER TIM INTERACTIVE ASSISTANT
  // ==========================================================================
  function getAgentReply(promptText) {
    const q = promptText.toLowerCase();
    const isProvider = state.activeRole === 'provider';

    if (q.includes('alert') || q.includes('notify')) {
      const preset = Data.timNotifications[state.timAlertIndex % Data.timNotifications.length];
      state.timAlertIndex += 1;
      showTimNotification(preset.title, preset.tier, preset.text);
      return `Triggered live Manager Tim alert: "${preset.text}"`;
    }

    if (q.includes('badge') || q.includes('achievement')) {
      const unlocked = state.badges.filter((b) => (isProvider ? b.providerTier : b.followerTier));
      return `You have ${unlocked.length}/10 unlocked badges (including ${unlocked[0] ? unlocked[0].name : 'Best Risk Manager'}). Complete TP Hunter (80/100 TPs) or Capital King to climb from Bronze to Legendary.`;
    }

    if (q.includes('leaderboard') || q.includes('rank')) {
      return `Global Leaderboards are live across 8 categories & 5 timeframes. StrategyForex2 currently ranks #2 in Top Signal Providers (+77.86% all-time, 4.8x Profit/DD).`;
    }

    if (isProvider) {
      const strat = getStrategyById(state.providerUser.ownStrategyId);
      if (q.includes('challenge') || q.includes('season')) {
        return `Current ${state.challenge.seasonTitle} has 7 challenges active. You're 100% qualified on Risk Master Challenge & Strategy Builder, and #2 in Manager of the Month!`;
      }
      if (q.includes('follower') || q.includes('referral')) {
        return `You have ${Data.followersList.length} active followers. Share your personalized referral link (TV-SIG-2100224001) on your Public Profile to grow AUM toward Capital King.`;
      }
      if (q.includes('note') || q.includes('draft') || q.includes('post')) {
        const draft = `Manager Tim Desk Note: ${strat.name} holds Risk Score ${strat.riskScore} with ${strat.winRate}% win rate across ${strat.totalTrades} trades.`;
        state.notes.unshift({ id: `note-${Date.now()}`, author: strat.name, timestamp: 'Just now (via Manager Tim)', text: draft });
        if (state.activeView === 'profile') renderMainView();
        return `Published new follower briefing: "${draft}"`;
      }
      return `Hi Signal Test — I'm Manager Tim! Ask me about your 10 Badges, Global Leaderboard rank, 7 Season Challenges, or click "Trigger Tim Alert" to preview notifications.`;
    }

    const fs = state.followerUser.followingSettings;
    if (q.includes('risk') || q.includes('setting')) {
      return `Copy Risk Guard: ${fs.copyMode}, Risk ratio ${fs.riskRatio}, Lots ${fs.minLotSize}–${fs.maxLotSize}, Drawdown "${fs.drawdown}" capped at $${fs.maxDD}.`;
    }
    if (q.includes('recommend') || q.includes('strategy') || q.includes('demo')) {
      return `Top Risk-Adjusted Picks: StrategyForex2 (4.8x Profit/DD, Risk 1) & Vanguard MultiMAM Alpha (5.4x Profit/DD). Want to become a provider? Join the Demo to Live Challenge!`;
    }
    return `Hi IB Test — I'm Manager Tim! Ask me about Badges, Global Leaderboards, Demo to Live Challenge, or your risk settings.`;
  }

  function sendAgentMessage(rawText) {
    const text = rawText.trim();
    if (!text) return;
    const roleKey = state.activeRole;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    state.agentChats[roleKey].push({ role: 'user', sender: getCurrentUser().shortName, time: nowTime, text });
    state.agentTyping = true;
    renderSocialHub();

    setTimeout(() => {
      state.agentTyping = false;
      state.agentChats[roleKey].push({
        role: 'agent',
        sender: 'Manager Tim',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: getAgentReply(text)
      });
      renderSocialHub();
    }, 240);
  }

  function renderSocialHub() {
    const fab = $('#social-hub-fab');
    const drawer = $('#social-hub-drawer');
    const greetingCard = $('#agent-greeting-card');
    const roleKey = state.activeRole;
    const messages = state.agentChats[roleKey] || [];

    fab.classList.remove('hidden');
    $('#social-hub-count').textContent = messages.length;
    drawer.classList.toggle('hidden', !state.socialHubOpen);

    if (greetingCard) {
      const showGreeting = state.isAuthenticated && !state.socialHubOpen && !state.agentGreetingDismissed;
      greetingCard.classList.toggle('hidden', !showGreeting);
    }

    if (!state.socialHubOpen) return;

    const chips =
      roleKey === 'provider'
        ? ['Check my badges', 'Season Challenges', 'Leaderboard rank', 'Trigger Tim alert', 'Publish follower note']
        : ['Check my badges', 'Recommend strategy', 'Analyze risk settings', 'Trigger Tim alert'];

    $('#agent-quick-chips').innerHTML = chips
      .map((c) => `<button type="button" class="agent-chip" data-agent-chip="${escapeHtml(c)}">${escapeHtml(c)}</button>`)
      .join('');

    $$('[data-agent-chip]').forEach((btn) => {
      btn.addEventListener('click', () => sendAgentMessage(btn.dataset.agentChip));
    });

    const body = $('#social-hub-body');
    body.innerHTML =
      messages
        .map(
          (m) => `
        <div class="chat-bubble ${m.role}">
          <div class="chat-bubble-meta"><span class="chat-bubble-sender">${escapeHtml(m.sender)}</span><span>${escapeHtml(m.time)}</span></div>
          <div>${escapeHtml(m.text)}</div>
        </div>
      `
        )
        .join('') +
      (state.agentTyping
        ? `<div class="chat-bubble agent"><div class="chat-bubble-meta"><span class="chat-bubble-sender">Manager Tim</span><span>Typing...</span></div><div style="color:var(--text-muted);">Checking live metrics...</div></div>`
        : '');

    body.scrollTop = body.scrollHeight;
  }

  function init() {
    applyTheme(state.theme);
    applyUrlParams();

    $$('[data-set-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (state.userMenuOpen) {
          state.userMenuOpen = false;
          $('#user-dropdown')?.classList.add('hidden');
        }
        setTheme(btn.dataset.setTheme);
      });
    });

    $('#login-leaderboards-btn').addEventListener('click', () => {
      state.publicLeaderboardsOpen = true;
      renderRoot();
    });

    $('#demo-btn-follower').addEventListener('click', () => { fillDemoCredentials('follower'); loginAs('follower'); });
    $('#demo-btn-provider').addEventListener('click', () => { fillDemoCredentials('provider'); loginAs('provider'); });
    $('#login-role').addEventListener('change', (e) => syncDemoSelection(e.target.value));
    syncDemoSelection($('#login-role').value || 'follower');

    $('#toggle-password-btn').addEventListener('click', () => {
      const inp = $('#login-password');
      inp.type = inp.type === 'password' ? 'text' : 'password';
    });

    $('#login-form').addEventListener('submit', handleLoginSubmit);
    $('#switch-to-follower').addEventListener('click', () => loginAs('follower'));
    $('#switch-to-provider').addEventListener('click', () => loginAs('provider'));

    $('#user-menu-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      state.userMenuOpen = !state.userMenuOpen;
      $('#user-dropdown').classList.toggle('hidden', !state.userMenuOpen);
    });
    document.addEventListener('click', () => {
      if (state.userMenuOpen) {
        state.userMenuOpen = false;
        $('#user-dropdown').classList.add('hidden');
      }
    });

    $('#dropdown-switch-follower').addEventListener('click', () => {
      state.userMenuOpen = false;
      $('#user-dropdown').classList.add('hidden');
      loginAs('follower');
    });
    $('#dropdown-switch-provider').addEventListener('click', () => {
      state.userMenuOpen = false;
      $('#user-dropdown').classList.add('hidden');
      loginAs('provider');
    });
    $('#dropdown-logout').addEventListener('click', logout);

    $('#mobile-menu-btn').addEventListener('click', () => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
      $('#app-sidebar').classList.toggle('open', state.mobileSidebarOpen);
    });

    $('#social-hub-fab').addEventListener('click', () => {
      state.socialHubOpen = !state.socialHubOpen;
      state.agentGreetingDismissed = true;
      renderSocialHub();
      if (state.socialHubOpen) setTimeout(() => $('#agent-chat-input')?.focus(), 50);
    });
    $('#agent-greeting-card').addEventListener('click', () => {
      state.socialHubOpen = true;
      state.agentGreetingDismissed = true;
      renderSocialHub();
      setTimeout(() => $('#agent-chat-input')?.focus(), 50);
    });
    $('#agent-greeting-close').addEventListener('click', (e) => {
      e.stopPropagation();
      state.agentGreetingDismissed = true;
      renderSocialHub();
    });
    $('#social-hub-close').addEventListener('click', () => {
      state.socialHubOpen = false;
      renderSocialHub();
    });
    $('#agent-chat-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = $('#agent-chat-input');
      if (!inp.value.trim()) return;
      sendAgentMessage(inp.value);
      inp.value = '';
    });

    renderRoot();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
