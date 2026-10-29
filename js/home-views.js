/**
 * index.html — in-page subviews (공지사항, 게시판, 시설물, 안전등급, 자료실)
 * 사용자 페이지 type3 / fcr-flat 패턴과 동일 셸
 */
(function () {
  const LIST_BODY_CLASSES = [
    'home-subpage-open',
    'archive-notice-page',
    'type3-port-page',
    'fcr-flat-page',
  ];
  const DETAIL_BODY_CLASSES = [
    'home-subpage-open',
    'archive-notice-detail-page',
    'facility-change-request-detail-page',
    'type3-port-page',
    'fcr-detail-flat-page',
  ];
  const ALL_VIEW_CLASSES = Array.from(new Set([
    ...LIST_BODY_CLASSES,
    ...DETAIL_BODY_CLASSES,
    'archive-board-page',
    'home-facility-page',
    'home-safety-page',
    'home-archive-page',
    'home-vendor-apply-page',
  ]));

  let currentKey = null;
  let currentIsDetail = false;
  let suppressHashChange = false;
  const routeHandlers = [];

  function subpageEl() {
    return document.getElementById('homeSubpage');
  }

  function landingEl() {
    return document.getElementById('homeLanding');
  }

  function panelEl() {
    return document.getElementById('homeSubPanel');
  }

  function listChromeEl() {
    return document.getElementById('homeSubListChrome');
  }

  function titleEl() {
    return document.getElementById('homeSubTitleText');
  }

  function crumbCurrentEl() {
    return document.getElementById('homeSubCrumbCurrent');
  }

  function bodyEl() {
    return document.getElementById('homeSubBody');
  }

  function clearViewClasses() {
    document.body.classList.remove(...ALL_VIEW_CLASSES);
  }

  function updateHomeHeaderActive(key) {
    document
      .querySelectorAll('.home-header__nav-btn[data-home-view]')
      .forEach((btn) => btn.classList.remove('is-active'));
    if (!key) return;
    const parentKey =
      key === 'notice' || key === 'law' || key === 'archive'
        ? 'archive'
        : key === 'facility' || key === 'safety'
          ? key
          : key;
    const active = document.querySelector(`.home-header__nav-btn[data-home-view="${parentKey}"]`);
    active?.classList.add('is-active');
  }

  function applyViewClasses(isDetail, key) {
    clearViewClasses();
    const classes = isDetail ? DETAIL_BODY_CLASSES : LIST_BODY_CLASSES;
    document.body.classList.add(...classes);
    document.body.classList.toggle('home-facility-page', key === 'facility');
    document.body.classList.toggle('home-safety-page', key === 'safety');
    document.body.classList.toggle(
      'home-archive-page',
      key === 'notice' || key === 'law' || key === 'archive'
    );
    document.body.classList.toggle('home-vendor-apply-page', key === 'vendor-apply');
    if (key === 'law') {
      document.body.classList.add('archive-board-page');
      if (!isDetail) document.body.classList.remove('archive-notice-page');
    }
  }

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, '').trim();
    if (!raw) return { key: null, id: null };
    const [key, id] = raw.split('/');
    return { key: key || null, id: id || null };
  }

  function setHash(key, id) {
    const next = id ? `#/${key}/${id}` : key ? `#/${key}` : '';
    const current = location.hash;
    if (current === next || (!current && !next)) return;

    suppressHashChange = true;
    if (next) {
      location.hash = next;
    } else {
      history.replaceState(null, '', location.pathname + location.search);
    }
    setTimeout(() => {
      suppressHashChange = false;
    }, 0);
  }

  function setMainPopupsHidden(hidden) {
    document.querySelectorAll('.main-popup').forEach((el) => {
      if (hidden) {
        el.dataset.homeSubHidden = el.hidden ? '1' : '0';
        el.hidden = true;
      } else if (el.dataset.homeSubHidden === '0') {
        el.hidden = false;
        delete el.dataset.homeSubHidden;
      } else {
        delete el.dataset.homeSubHidden;
      }
    });
  }

  function showLanding() {
    const sub = subpageEl();
    const land = landingEl();
    const panel = panelEl();
    const chrome = listChromeEl();

    if (sub) sub.hidden = true;
    if (land) land.hidden = false;
    if (panel) panel.classList.remove('is-detail');
    if (chrome) chrome.hidden = false;
    clearViewClasses();
    setMainPopupsHidden(false);

    currentKey = null;
    currentIsDetail = false;
    updateHomeHeaderActive(null);
    setHash(null, null);
    window.scrollTo(0, 0);
  }

  function backToList() {
    const key = currentKey;
    if (key === 'notice' && window.PomsHomeNotice) {
      window.PomsHomeNotice.openList(false);
      return;
    }
    if (key === 'law' && window.PomsHomeLaw) {
      window.PomsHomeLaw.openList(false);
      return;
    }
    if (key === 'archive' && window.PomsHomeArchive) {
      window.PomsHomeArchive.openList(false);
      return;
    }
    showLanding();
  }

  function showView(opts) {
    const body = bodyEl();
    if (!body) return;

    const { key, title, isDetail, id, render, listLabel, hideChrome } = opts;
    const sub = subpageEl();
    const land = landingEl();
    const panel = panelEl();
    const chrome = listChromeEl();

    if (sub) sub.hidden = false;
    if (land) land.hidden = true;
    setMainPopupsHidden(true);
    applyViewClasses(!!isDetail, key);

    // 상세에서도 공통 네비(< / 홈 / 브레드크럼)는 유지하고, 본문 쪽 중복 헤더는 렌더러에서 제외
    if (chrome) chrome.hidden = Boolean(hideChrome);
    if (titleEl()) titleEl().textContent = title || '';
    if (crumbCurrentEl()) crumbCurrentEl().textContent = title || '';
    if (panel) {
      panel.classList.toggle('is-detail', !!isDetail);
      if (listLabel) panel.dataset.listLabel = listLabel;
      else delete panel.dataset.listLabel;
    }

    currentKey = key;
    currentIsDetail = !!isDetail;
    updateHomeHeaderActive(key);
    setHash(key, id);

    if (typeof render === 'function') {
      render(body);
    }

    window.scrollTo(0, 0);
  }

  function onRoute(handler) {
    routeHandlers.push(handler);
  }

  function dispatchRoute() {
    const route = parseHash();
    routeHandlers.forEach((handler) => handler(route));
    resolveRoute(route);
  }

  function resolveRoute(route) {
    const { key, id } = route;
    if (!key) {
      if (currentKey) showLanding();
      return;
    }

    const detailId = id ? Number(id) : null;

    if (key === 'notice' && window.PomsHomeNotice) {
      if (detailId) window.PomsHomeNotice.openDetail(detailId);
      else window.PomsHomeNotice.openList(true);
      return;
    }
    if (key === 'law' && window.PomsHomeLaw) {
      if (id) window.PomsHomeLaw.openDetail(id);
      else window.PomsHomeLaw.openList(true);
      return;
    }
    if (key === 'archive' && window.PomsHomeArchive) {
      if (detailId) window.PomsHomeArchive.openDetail(detailId);
      else window.PomsHomeArchive.openList(true);
      return;
    }
    if (key === 'facility' && window.PomsHomeFacility) {
      window.PomsHomeFacility.open();
      return;
    }
    if (key === 'safety' && window.PomsHomeSafety) {
      window.PomsHomeSafety.open();
      return;
    }
    if (key === 'vendor-apply' && window.PomsHomeVendorApply) {
      window.PomsHomeVendorApply.open();
      return;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const goHome = (event) => {
      event.preventDefault();
      showLanding();
    };
    // 상세에서 < 는 해당 목록으로, 목록에서 < / 홈은 랜딩으로
    document.getElementById('homeSubBack')?.addEventListener('click', (event) => {
      event.preventDefault();
      if (currentIsDetail) backToList();
      else showLanding();
    });
    document.getElementById('homeSubHome')?.addEventListener('click', goHome);
    document.getElementById('homeSubCrumbHome')?.addEventListener('click', goHome);

    window.addEventListener('hashchange', () => {
      if (suppressHashChange) return;
      dispatchRoute();
    });

    document.querySelectorAll('[data-home-view]').forEach((el) => {
      el.addEventListener('click', (event) => {
        const view = el.getAttribute('data-home-view');
        if (!view) return;
        event.preventDefault();
        const href = el.getAttribute('href') || '';
        const hashMatch = href.match(/#\/([^/?#]+)/);
        location.hash = hashMatch ? `#/${hashMatch[1]}` : `#/${view}`;
      });
    });

    window.addEventListener('load', () => {
      if (location.hash) {
        resolveRoute(parseHash());
      }
    });
  });

  window.PomsHomeViews = {
    showLanding,
    showView,
    parseHash,
    onRoute,
    getCurrentKey: () => currentKey,
    isDetailView: () => currentIsDetail,
  };
})();
