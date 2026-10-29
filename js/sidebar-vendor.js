/**
 * 용역사(POMS) 전용 사이드바
 * 사용: PomsSidebarVendor.mount('#sidebar-root', { active: 'target-facility' });
 */
const PomsSidebarVendor = (() => {
  const BRAND = 'assets/main/dashboard/Frame.svg';

  const MENU = [
    {
      id: 'target-facility',
      label: '1. 대상시설물 신청',
      href: 'vendor-application.html',
      icon: 'home',
    },
    {
      id: 'inspection-report',
      label: '2. 점검 보고서 등록',
      href: 'vendor-inspection.html',
      icon: 'report',
    },
  ];

  function iconSvg(name) {
    const icons = {
      home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      report: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>`,
      logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
      bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    };
    return icons[name] || '';
  }

  function renderMenu(activeId) {
    return MENU.map((item) => {
      const isActive = item.id === activeId;
      return `
        <a href="${item.href}" class="sidebar__item sidebar__item--numbered${isActive ? ' is-active' : ''}">
          <span class="sidebar__item-icon">${iconSvg(item.icon)}</span>
          <span class="sidebar__item-label">${item.label}</span>
        </a>`;
    }).join('');
  }

  function getUserDisplay() {
    if (typeof PomsAuth !== 'undefined') {
      return PomsAuth.getSidebarUser('한국항만협회 용역사');
    }
    return { name: '한국항만협회 용역사', avatar: '한' };
  }

  function render(activeId = 'target-facility') {
    const user = getUserDisplay();
    return `
      <aside class="sidebar sidebar--vendor" aria-label="용역사 메뉴">
        <a href="index.html" class="sidebar__brand">
          <img src="${BRAND}" alt="항만시설물 유지관리시스템" class="sidebar__brand-img" width="228" height="40">
        </a>
        <div class="sidebar__divider" role="separator"></div>
        <nav class="sidebar__nav sidebar__nav--vendor">${renderMenu(activeId)}</nav>
        <div class="sidebar__footer">
          <div class="sidebar__user">
            <span class="sidebar__avatar" aria-hidden="true">${user.avatar}</span>
            <span class="sidebar__user-name">${user.name}</span>
            <button type="button" class="sidebar__notify" aria-label="알림">
              ${iconSvg('bell')}
              <span class="sidebar__notify-dot" aria-hidden="true"></span>
            </button>
          </div>
          <a href="index.html?logout=1" class="sidebar__logout">
            <span class="sidebar__logout-icon">${iconSvg('logout')}</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>`;
  }

  function mount(selector, options = {}) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = render(options.active || 'target-facility');
  }

  function ensureSiteFooter() {
    if (window.PomsSiteFooter || document.querySelector('script[data-poms-site-footer]')) return;
    const current = document.currentScript;
    const script = document.createElement('script');
    script.src = current?.src
      ? current.src.replace(/sidebar(?:-admin|-vendor)?\.js(?:\?.*)?$/i, 'site-footer.js')
      : 'js/site-footer.js';
    script.dataset.pomsSiteFooter = '1';
    (document.body || document.head).appendChild(script);
  }

  ensureSiteFooter();

  return { mount, render };
})();
