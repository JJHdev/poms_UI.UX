/**
 * POMS 공통 GNB (facility.html과 동일 형식·비율)
 * 사용: PomsSidebar.mount('#sidebar-root', { active: 'facility-search' });
 * #sidebar-root가 있으면 페이지 경로로 자동 mount 됩니다.
 */
const PomsSidebar = (() => {
  const LOGO_EMBLEM = 'assets/service/main/figma/logo-emblem-light.svg';
  const LOGO_TITLE = 'assets/service/main/figma/logo-text-light.svg';
  const LOGOUT = 'assets/service/main/figma/icon-logout-dark.svg';

  const NAV = [
    {
      id: 'facility-info',
      label: '시설물정보',
      href: 'facility-search.html',
      children: [
        { id: 'facility-search', label: '시설물통합검색', href: 'facility-search.html' },
        { id: 'facility-filter', label: '시설물조건 검색', href: 'facility-condition-search.html' },
      ],
    },
    {
      id: 'facility-manage',
      label: '시설물관리',
      href: 'inspection-status.html',
      children: [
        { id: 'inspection-status', label: '점검정보현황', href: 'inspection-status.html' },
        { id: 'safety-grade', label: '안전 등급현황', href: 'safety-grade-status.html' },
        { id: 'facility-stats', label: '시설물통계', href: 'facility-statistics.html' },
        { id: 'special-facility', label: '특별관리시설', href: 'special-facility.html' },
        { id: 'type3-port', label: '제 3종 항만시설물', href: 'type3-port-facility.html', hidden: true },
        { id: 'facility-change-request', label: '시설물 정보변경 요청', href: 'facility-change-request.html' },
        { id: 'data-receive', label: '자료수신', href: 'data-receive.html' },
        { id: 'data-process', label: '자료처리', href: 'data-process.html' },
        { id: 'stats-process', label: '통계처리', href: 'stats-process.html' },
      ],
    },
    {
      id: 'archive',
      label: '자료실',
      href: 'archive.html',
      children: [
        { id: 'archive-notice', label: '공지사항', href: 'archive.html' },
        { id: 'archive-report', label: '안전점검보고서', href: 'safety-inspection-report.html' },
        { id: 'archive-law', label: '게시판', href: 'archive-board.html' },
      ],
    },
  ];

  const SUBNAV = {
    'facility-info': [
      { id: 'facility-search', label: '시설물 통합검색', href: 'facility-search.html' },
      { id: 'facility-filter', label: '시설물 조건검색', href: 'facility-condition-search.html' },
    ],
    /* Figma 188:6656 — 시설물관리 세부메뉴 */
    'facility-manage': [
      { id: 'inspection-status', label: '점검정보현황', href: 'inspection-status.html' },
      { id: 'safety-grade', label: '안전 등급현황', href: 'safety-grade-status.html' },
      { id: 'facility-stats', label: '시설물통계', href: 'facility-statistics.html' },
      { id: 'special-facility', label: '특별관리시설', href: 'special-facility.html' },
      { id: 'type3-port', label: '제 3종 항만시설물', href: 'type3-port-facility.html', hidden: true },
      { id: 'facility-change-request', label: '시설물 정보변경 요청', href: 'facility-change-request.html' },
      { id: 'data-receive', label: '자료수신', href: 'data-receive.html' },
      { id: 'data-process', label: '자료처리', href: 'data-process.html' },
      { id: 'stats-process', label: '통계처리', href: 'stats-process.html' },
    ],
    /* 자료실 사이드바 — 공지사항 / 안전점검보고서 / 게시판 */
    archive: [
      { id: 'archive-notice', label: '공지사항', href: 'archive.html' },
      { id: 'archive-report', label: '안전점검보고서', href: 'safety-inspection-report.html' },
      { id: 'archive-law', label: '게시판', href: 'archive-board.html' },
    ],
  };

  const FILE_ALIASES = {
    'facility.html': 'home',
    'facility-search.html': 'facility-search',
    'facility-condition-search.html': 'facility-filter',
    'facility-condition-result.html': 'facility-filter',
    'facility-detail.html': 'facility-search',
    'facility-major-defect-detail.html': 'facility-search',
    'facility-vulnerable-detail.html': 'facility-search',
    'facility-repair-detail.html': 'facility-search',
    'facility-precision-detail.html': 'facility-search',
    'type3-port-facility.html': 'type3-port',
    'type3-survey-detail.html': 'type3-port',
    'type3-survey-create.html': 'type3-port',
    'facility-change-request-detail.html': 'facility-change-request',
    'data-receive-detail.html': 'data-receive',
    'notice-detail.html': 'archive-notice',
    'notice-register.html': 'archive-notice',
    'archive.html': 'archive-notice',
    'safety-inspection-report.html': 'archive-report',
    'basic-plan-floor.html': 'archive-law',
    'archive-board.html': 'archive-law',
    'archive-safety-materials.html': 'archive-law',
    'related-laws.html': 'archive-law',
    'related-law-detail.html': 'archive-law',
    'system-archive.html': 'archive-law',
    'system-archive-detail.html': 'archive-law',
    'archive-board-detail.html': 'archive-law',
    'archive-safety-materials-detail.html': 'archive-law',
    'facility-info.html': 'facility-stats',
    'facility-statistics.html': 'facility-stats',
    'safety-grade-info.html': 'safety-grade',
    'safety-grade-status.html': 'safety-grade',
    'safety-grade-status-detail.html': 'safety-grade',
    'special-facility.html': 'special-facility',
    'facility-change-request.html': 'facility-change-request',
    'data-receive.html': 'data-receive',
    'data-process.html': 'data-process',
    'stats-process.html': 'stats-process',
  };

  function currentFile() {
    return decodeURIComponent((location.pathname.split('/').pop() || '').toLowerCase());
  }

  function inferActiveId() {
    const file = currentFile();
    if (FILE_ALIASES[file]) return FILE_ALIASES[file];

    for (const item of NAV) {
      if ((item.href || '').toLowerCase() === file) return item.id;
      const child = item.children?.find((c) => (c.href || '').toLowerCase() === file);
      if (child) return child.id;
    }
    return 'home';
  }

  function resolveActive(activeId) {
    if (!activeId || activeId === 'home') {
      return { parent: null, childId: null };
    }

    for (const item of NAV) {
      if (item.id === activeId) return { parent: item, childId: null };
      if (item.children?.some((child) => child.id === activeId)) {
        return { parent: item, childId: activeId };
      }
      if (SUBNAV[item.id]?.some((child) => child.id === activeId)) {
        return { parent: item, childId: activeId };
      }
    }

    // 상세·별칭 화면 — 부모만 매핑
    const orphanParent = {
      'archive-plan': 'archive',
      'archive-materials': 'archive',
    };
    const parentId = orphanParent[activeId];
    if (parentId) {
      const parent = NAV.find((item) => item.id === parentId) || null;
      return { parent, childId: activeId };
    }

    return { parent: null, childId: null };
  }

  function getUserDisplay() {
    if (typeof PomsAuth !== 'undefined') {
      return PomsAuth.getSidebarUser('한국항만협회 사용자');
    }
    return { name: '한국항만협회 사용자', avatar: '한' };
  }

  function menuHiddenAttr(item) {
    return item && item.hidden ? ' hidden' : '';
  }

  function renderNav(parentId) {
    return NAV.map((item) => {
      const isActive = item.id === parentId;
      const children = item.children?.length
        ? `<div class="gnb-nav__panel" role="menu" aria-label="${item.label} 하위 메뉴">
            ${item.children
              .map(
                (child) =>
                  `<a class="gnb-nav__sub" role="menuitem" href="${child.href}"${menuHiddenAttr(child)}>${child.label}</a>`
              )
              .join('')}
          </div>`
        : '';

      return `
        <div class="gnb-nav__drop">
          <a class="gnb-nav__item${isActive ? ' is-active' : ''}" href="${item.href}"${
            item.children?.length ? ' aria-haspopup="true" aria-expanded="false"' : ''
          }>${item.label}</a>
          ${children}
        </div>`;
    }).join('');
  }

  function renderSubnav(parent, childId) {
    const items = SUBNAV[parent.id];
    if (!items?.length || !childId) return '';

    return `
      <nav class="gnb-subnav" aria-label="${parent.label} 하위 메뉴">
        <div class="gnb-subnav__inner">
          ${items
            .map(
              (item) => `
            <a class="gnb-subnav__item${item.id === childId ? ' is-active' : ''}" href="${item.href}"${menuHiddenAttr(item)}>
              ${item.label}
            </a>`
            )
            .join('')}
        </div>
      </nav>`;
  }

  /** GNB 메가 드롭다운 열 구성 — 관리자 GNB(Figma 250:3327)와 동일 스타일 */
  const MEGA_COLS = [
    {
      id: 'facility-info',
      items: [
        { id: 'facility-search', label: '시설물 통합검색', href: 'facility-search.html' },
        { id: 'facility-filter', label: '시설물 조건검색', href: 'facility-condition-search.html' },
      ],
    },
    {
      id: 'facility-manage',
      items: [
        { id: 'inspection-status', label: '점검정보현황', href: 'inspection-status.html' },
        { id: 'safety-grade', label: '안전 등급현황', href: 'safety-grade-status.html' },
        { id: 'facility-stats', label: '시설물통계', href: 'facility-statistics.html' },
        { id: 'special-facility', label: '특별관리시설', href: 'special-facility.html' },
        { id: 'type3-port', label: '제 3종 항만시설물', href: 'type3-port-facility.html', hidden: true },
        { id: 'facility-change-request', label: '시설물 정보변경 요청', href: 'facility-change-request.html' },
        { id: 'data-receive', label: '자료수신', href: 'data-receive.html' },
        { id: 'data-process', label: '자료처리', href: 'data-process.html' },
        { id: 'stats-process', label: '통계처리', href: 'stats-process.html' },
      ],
    },
    {
      id: 'archive',
      items: [
        { id: 'archive-notice', label: '공지사항', href: 'archive.html' },
        { id: 'archive-report', label: '안전점검보고서', href: 'safety-inspection-report.html' },
        { id: 'archive-law', label: '게시판', href: 'archive-board.html' },
      ],
    },
  ];

  const MAIN_LABELS = {
    'facility-info': '시설물 정보',
    'facility-manage': '시설물 관리',
    archive: '자료실',
  };

  const MAIN_HREFS = {
    'facility-info': 'facility-search.html',
    'facility-manage': 'inspection-status.html',
    archive: 'archive.html',
  };

  function renderMegaMenu(activeId) {
    const file = currentFile();
    const resolved = FILE_ALIASES[file] || activeId;
    const hasExactHref = MEGA_COLS.some((col) =>
      col.items.some((item) => (item.href || '').split('/').pop().toLowerCase() === file)
    );
    return `
      <div class="gnb-mega" role="navigation" aria-label="전체 메뉴">
        <div class="gnb-mega__inner">
          ${MEGA_COLS.map(
            (col) => `
            <div class="gnb-mega__col" data-mega-col="${col.id}">
              ${col.items
                .map((item) => {
                  const hrefFile = (item.href || '').split('/').pop().toLowerCase();
                  const on = hrefFile === file || (!hasExactHref && item.id === resolved);
                  const wrap = Boolean(item.labelHtml);
                  const text = item.labelHtml || item.label;
                  return `
                <a class="gnb-mega__link${on ? ' is-active' : ''}${wrap ? ' gnb-mega__link--wrap' : ''}" href="${item.href}"${on ? ' aria-current="page"' : ''}${menuHiddenAttr(item)}>${text}</a>`;
                })
                .join('')}
            </div>`
          ).join('')}
        </div>
      </div>
      <div class="gnb-mega-dim" aria-hidden="true"></div>`;
  }

  /** 주메뉴 서브바 + hover 메가메뉴 — 관리자 GNB와 동일 인터랙션 */
  function renderMainSubnav(activeParentId, options = {}) {
    const { home = false, activeId: pageActiveId } = options;
    const activeId = home ? null : activeParentId;
    return `
      <nav class="gnb-subnav gnb-subnav--mega${home ? ' gnb-subnav--home' : ' gnb-subnav--main'}" aria-label="주 메뉴">
        <div class="gnb-subnav__inner">
          ${NAV.map((item) => {
            const href = MAIN_HREFS[item.id] || item.href;
            return `
            <a class="gnb-subnav__item${activeId && item.id === activeId ? ' is-active' : ''}" href="${href}" data-mega-trigger="${item.id}">
              ${MAIN_LABELS[item.id] || item.label}
            </a>`;
          }).join('')}
        </div>
        ${renderMegaMenu(home ? null : (pageActiveId || activeParentId))}
      </nav>`;
  }

  /** 시설물 정보·관리·자료실 — Figma처럼 헤더 내비 없이 메인 서브탭 + 페이지 LNB */
  function usesMainSubnavOnly(activeId, parent) {
    if (!parent) return false;
    if (parent.id === 'facility-info') return true;
    if (parent.id === 'facility-manage') return true;
    if (parent.id === 'archive') return true;
    return false;
  }

  const LNB_CHEVRON = 'assets/main/facility-search/figma224/icon-lnb-chevron.svg';

  function lnbItemsFor(parent) {
    if (!parent) return [];
    return SUBNAV[parent.id] || parent.children || [];
  }

  function renderPageLnb(parent, activeId) {
    const items = lnbItemsFor(parent);
    const title = MAIN_LABELS[parent.id] || parent.label || '';
    const current = currentFile();
    return `
      <aside class="fs-lnb" aria-label="${title} 메뉴" data-poms-lnb="1">
        <div class="fs-lnb__title">
          <span class="fs-lnb__title-text">${title}</span>
        </div>
        <nav class="fs-lnb__nav">
          ${items
            .map((item) => {
              const hrefFile = (item.href || '').split('/').pop().toLowerCase();
              const isActive =
                item.id === activeId ||
                hrefFile === current ||
                (FILE_ALIASES[current] && FILE_ALIASES[current] === item.id);
              return `
            <a class="fs-lnb__item${isActive ? ' is-active' : ''}" href="${item.href}"${isActive ? ' aria-current="page"' : ''}${menuHiddenAttr(item)}>
              <span>${item.label}</span>
              <img class="fs-lnb__chevron" src="${LNB_CHEVRON}" alt="" width="16" height="16">
            </a>`;
            })
            .join('')}
        </nav>
      </aside>`;
  }

  function ensureFacilitySearchCss() {
    if (document.querySelector('link[href*="css/facility-search.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/facility-search.css';
    document.head.appendChild(link);
  }

  function syncExistingLnb(parent, activeId) {
    const lnb = document.querySelector('.fs-lnb');
    if (!lnb || !parent) return;
    const items = lnbItemsFor(parent);
    const current = currentFile();
    lnb.querySelectorAll('.fs-lnb__item').forEach((anchor) => {
      const href = (anchor.getAttribute('href') || '').split('/').pop().toLowerCase();
      const matched = items.find((item) => (item.href || '').split('/').pop().toLowerCase() === href);
      const isHidden = Boolean(matched?.hidden);
      anchor.hidden = isHidden;
      if (isHidden) {
        anchor.classList.remove('is-active');
        anchor.removeAttribute('aria-current');
        return;
      }
      const isActive =
        (matched && matched.id === activeId) ||
        href === current ||
        (matched && FILE_ALIASES[current] === matched.id);
      anchor.classList.toggle('is-active', Boolean(isActive));
      if (isActive) anchor.setAttribute('aria-current', 'page');
      else anchor.removeAttribute('aria-current');
    });
  }

  /** 페이지에 LNB가 없으면 main 콘텐츠를 fs-layout으로 감싸 주입 */
  function ensurePageLnb(activeId, parent) {
    if (!usesMainSubnavOnly(activeId, parent) || !parent) return;

    document.body.classList.add('facility-search-page');
    ensureFacilitySearchCss();

    if (document.querySelector('.fs-lnb')) {
      syncExistingLnb(parent, activeId);
      return;
    }

    const main = document.querySelector('main.main-content');
    if (!main) return;

    const layout = document.createElement('div');
    layout.className = 'fs-layout';
    layout.innerHTML = renderPageLnb(parent, activeId);

    const manage = document.createElement('div');
    manage.className = 'fs-manage';
    while (main.firstChild) {
      manage.appendChild(main.firstChild);
    }
    layout.appendChild(manage);
    main.appendChild(layout);
  }

  function render(activeId = 'home') {
    const user = getUserDisplay();
    const isHome = !activeId || activeId === 'home';
    const { parent, childId } = resolveActive(activeId);
    const mainSubnavOnly = !isHome && usesMainSubnavOnly(activeId, parent);
    const hideHeaderNav = isHome || mainSubnavOnly;

    return `
      <div class="gnb-wrap">
        <header class="gnb inner">
          <div class="gnb-left">
            <a href="facility.html" class="gnb-logo" aria-label="POMS 메인으로 이동">
              <img class="gnb-logo__emblem" src="${LOGO_EMBLEM}" alt="">
              <img class="gnb-logo__title" src="${LOGO_TITLE}" alt="항만시설물 유지관리시스템">
            </a>
            ${
              hideHeaderNav
                ? ''
                : `<nav class="gnb-nav" aria-label="주 메뉴">
              ${renderNav(parent?.id || null)}
            </nav>`
            }
          </div>
          <div class="gnb-r">
            <div class="gnb-user">
              <div class="gnb-avatar" aria-hidden="true">${user.avatar}</div>
              <span class="gnb-u">${user.name}</span>
            </div>
            <a href="index.html?logout=1" class="gnb-logout" aria-label="로그아웃">
              <img src="${LOGOUT}" alt="">
            </a>
          </div>
        </header>
      </div>
      ${
        isHome
          ? renderMainSubnav('facility-info', { home: true, activeId })
          : mainSubnavOnly
            ? renderMainSubnav(parent.id, { activeId })
            : parent
              ? renderSubnav(parent, childId)
              : ''
      }`;
  }

  function collectMenuFiles() {
    const files = new Set(['facility.html']);
    const add = (href) => {
      if (!href) return;
      files.add(href.split('/').pop().toLowerCase());
    };
    NAV.forEach((item) => {
      add(item.href);
      item.children?.forEach((child) => add(child.href));
    });
    Object.values(SUBNAV).forEach((items) => items.forEach((item) => add(item.href)));
    MEGA_COLS.forEach((col) => col.items.forEach((item) => add(item.href)));
    return files;
  }

  /** 목록: 뒤로가기 없음 / 상세·등록·검색결과: 뒤로가기 유지 */
  function isUserListPage() {
    const file = currentFile();
    if (!file || file === 'facility.html' || file === 'index.html') return true;
    if (/-detail|-create|-register|-edit/.test(file)) return false;
    return collectMenuFiles().has(file);
  }

  function removeListBackButtons() {
    if (!isUserListPage()) return;
    document.querySelectorAll('.page-header a.btn-back, .page-header button.btn-back').forEach((el) => {
      el.remove();
    });
  }

  function mount(selector, options = {}) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    const activeId = options.active || inferActiveId();
    el.innerHTML = render(activeId);
    el.dataset.mounted = 'true';
    const { parent } = resolveActive(activeId);
    ensurePageLnb(activeId, parent);
    removeListBackButtons();
  }

  function autoMount() {
    const el = document.querySelector('#sidebar-root');
    if (!el || el.dataset.mounted === 'true' || el.children.length) return;
    mount(el, { active: inferActiveId() });
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }

  ensureSiteFooter();

  return { mount, render };
})();
