/* ── 모바일 뒤로가기 = 열린 창 닫기 (사진 확대·시트·영상창 등) ──────────
   창을 열 때 방문 기록 1개를 넣고, 뒤로가기가 오면 맨 위 창만 닫음.
   X·바깥 클릭으로 닫으면 넣어 둔 기록을 되돌려 다음 뒤로가기가 정상 동작. */
window.pomsBackLayer = window.pomsBackLayer || (function () {
  var stack = [], skipPops = 0, pendingBack = 0, timer = null, closingFromBack = false;
  function find(id) { for (var i = stack.length - 1; i >= 0; i--) if (stack[i].id === id) return i; return -1; }
  function opened(id, closeFn) {
    if (find(id) >= 0) return;
    var st = Object.assign({}, history.state || {}, { pomsLayer: id });
    history.pushState(st, '', location.href);
    stack.push({ id: id, close: closeFn });
  }
  function closedByUi(id) {
    if (closingFromBack) return;
    var i = find(id);
    if (i < 0) return;
    stack.splice(i, 1);
    pendingBack++;
    if (!timer) timer = setTimeout(function () {
      timer = null;
      var n = pendingBack; pendingBack = 0;
      if (n > 0) { skipPops++; history.go(-n); }
    }, 0);
  }
  function discardAll() { stack = []; }          // 화면 이동 시: 기록은 두고 목록만 비움
  window.addEventListener('popstate', function (e) {
    if (skipPops > 0) { skipPops--; e.stopImmediatePropagation(); return; }
    if (!stack.length) return;
    var top = stack.pop();
    closingFromBack = true;
    try { top.close(); } finally { closingFromBack = false; }
    e.stopImmediatePropagation();
  });
  return { opened: opened, closedByUi: closedByUi, discardAll: discardAll };
})();

  window.pomsInspectStore = window.pomsInspectStore || (function () {
    var KEY = 'pomsInspectRecords';
    function parse(raw) {
      try { return JSON.parse(raw || ''); } catch (e) { return null; }
    }
    function renameLegacy(records) {
      if (!records || typeof records !== 'object') return records;
      if (!records['파제제']) {
        if (records['목포항 파제제']) records['파제제'] = records['목포항 파제제'];
        else if (records['B 외곽시설']) records['파제제'] = records['B 외곽시설'];
      }
      delete records['B 외곽시설'];
      if (records['파제제']) delete records['목포항 파제제'];
      return records;
    }
    function read() {
      var local = parse(localStorage.getItem(KEY));
      if (local && typeof local === 'object') return renameLegacy(local);
      var sess = parse(sessionStorage.getItem(KEY));
      if (sess && typeof sess === 'object') return renameLegacy(sess);
      return {};
    }
    function write(records) {
      try {
        var json = JSON.stringify(records);
        localStorage.setItem(KEY, json);
        sessionStorage.setItem(KEY, json);
      } catch (e) {
        try { sessionStorage.setItem(KEY, JSON.stringify(records)); } catch (e2) {}
      }
    }
    return { read: read, write: write };
  })();

  /* ── 화면 전환 ─────────────────────────── */
  var currentPhoneId = 'phoneHome';
  var screenStack = [];

  function screenUrl(phoneId) {
    return location.pathname + location.search + '#screen=' + encodeURIComponent(phoneId);
  }

  function rememberScreen(phoneId, mode) {
    var state = { pomsPhone: phoneId };
    if (mode === 'push') {
      screenStack.push(phoneId);
      history.pushState(state, '', screenUrl(phoneId));
      return;
    }
    screenStack = [phoneId];
    history.replaceState(state, '', screenUrl(phoneId));
  }
  function showSampleLoading(phoneId) {
    var phone = document.getElementById(phoneId);
    if (!phone) return;

    var host;
    if (phoneId === 'phoneFacility') {
      var keywordPanel = phone.querySelector('#facPanelKeyword');
      var isKeyword = keywordPanel && !keywordPanel.hidden;
      host = phone.querySelector(isKeyword ? '#facKeywordResults' : '#facLocResults');
    } else {
      host = phone.querySelector('.scroll-body');
    }
    if (!host) return;

    host.querySelectorAll('.sample-loading-overlay').forEach(function (el) { el.remove(); });
    host.classList.add('is-sample-loading');

    var overlay = document.createElement('div');
    overlay.className = 'sample-loading-overlay';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-label', '로딩 중');
    overlay.innerHTML = '<span class="sample-loading-spinner" aria-hidden="true"></span>';
    host.appendChild(overlay);

    window.setTimeout(function () {
      overlay.remove();
      host.classList.remove('is-sample-loading');
    }, 1000);
  }

  function showPhone(id, options) {
    options = options || {};
    if (!options.skipHistory) window.pomsBackLayer.discardAll();
    var phones = document.querySelectorAll('body > .phone');
    var target = document.getElementById(id) || phones[0];
    var nextId = target ? target.id : id;
    var top = screenStack[screenStack.length - 1];
    var prev = screenStack[screenStack.length - 2];

    if (!options.skipHistory && screenStack.length > 1 && prev === nextId && top !== nextId) {
      history.back();
      return;
    }

    closeAllDrawers();
    phones.forEach(function (phone) { phone.hidden = phone !== target; });
    if (target) {
      target.hidden = false;
      currentPhoneId = target.id;
      var scrollArea = target.querySelector('.scroll-body, .insp-scroll');
      if (scrollArea) scrollArea.scrollTop = 0;
      syncDrawerActive(target);
    }
    if (nextId === 'phoneMap') initLeafletMap();
    if (nextId === 'phoneFacility' || nextId === 'phoneDetail') showSampleLoading(nextId);
    if (nextId === 'phoneInspect' && typeof window.applyInspectDraftRecords === 'function') {
      window.applyInspectDraftRecords();
    }

    if (options.skipHistory) {
      var at = screenStack.lastIndexOf(currentPhoneId);
      screenStack = at >= 0 ? screenStack.slice(0, at + 1) : [currentPhoneId];
      return;
    }
    if (!screenStack.length || options.replaceHistory) {
      rememberScreen(currentPhoneId, 'replace');
      return;
    }
    if (screenStack[screenStack.length - 1] !== currentPhoneId) {
      rememberScreen(currentPhoneId, 'push');
    }
  }
  window.showPhone = showPhone;

  window.addEventListener('popstate', function (event) {
    var phone = event.state && event.state.pomsPhone;
    if (!phone || !document.getElementById(phone)) phone = 'phoneHome';
    showPhone(phone, { skipHistory: true });
  });

  /* ── 사이드 드로어 (로그아웃 없는 화면) ─── */
  var DRAWER_MENUS = [
    { id: 'phoneFacility', label: '시설물 조회', icon: 'drawer-ico-facility-ok.svg',
      subs: [{ label: '위치 기반', phone: 'phoneFacility', mode: 'location' }, { label: '키워드 기반', phone: 'phoneFacility', mode: 'keyword' }] },
    { id: 'phoneInspect', label: '정기안전점검', icon: 'drawer-ico-inspect-ok.svg', iconOn: 'drawer-ico-inspect-on.svg',
      subs: [{ label: '작성중', phone: 'phoneInspect', mode: 'draft' }, { label: '위치 기반', phone: 'phoneInspect', mode: 'location' }, { label: '키워드 기반', phone: 'phoneInspect', mode: 'keyword' }] },
    { id: 'phoneMap', label: '지도조회', icon: 'drawer-ico-map-ok.svg' }
  ];

  function closeAllDrawers() {
    document.querySelectorAll('.app-drawer.open, .app-drawer-dim.open').forEach(function (el) {
      el.classList.remove('open');
    });
  }

  function openDrawer(phoneInner) {
    if (!phoneInner) return;
    phoneInner.querySelector('.app-drawer-dim')?.classList.add('open');
    phoneInner.querySelector('.app-drawer')?.classList.add('open');
  }

  function closeDrawer(phoneInner) {
    if (!phoneInner) return;
    phoneInner.querySelector('.app-drawer-dim')?.classList.remove('open');
    phoneInner.querySelector('.app-drawer')?.classList.remove('open');
  }

  function syncDrawerActive(phone) {
    if (!phone) return;
    var activeId = phone.id;
    if (activeId === 'phoneNoticeDetail') activeId = 'phoneNotice';
    if (activeId === 'phoneDetail') activeId = 'phoneFacility';
    phone.querySelectorAll('.app-drawer__item[data-phone]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-phone') === activeId);
    });
    phone.querySelectorAll('.app-drawer__group').forEach(function (grp) {
      var item = grp.querySelector('.app-drawer__item[data-phone]');
      if (!item) return;
      if (item.getAttribute('data-phone') === activeId) grp.classList.add('is-open');
    });
  }

  function buildDrawerIco(item) {
    if (item.id === 'phoneFacility') {
      return '<span class="app-drawer__ico app-drawer__ico--facility" aria-hidden="true">' +
        '<img class="fig-leaf fig-leaf-a" src="assets/main/drawer-leaf/facility-a.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-b" src="assets/main/drawer-leaf/facility-b.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-c" src="assets/main/drawer-leaf/facility-c.svg" alt="">' +
      '</span>';
    }
    if (item.id === 'phoneMap') {
      return '<span class="app-drawer__ico app-drawer__ico--map" aria-hidden="true">' +
        '<img class="fig-leaf fig-leaf-a" src="assets/main/drawer-leaf/map-a.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-b" src="assets/main/drawer-leaf/map-b.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-c" src="assets/main/drawer-leaf/map-c.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-d" src="assets/main/drawer-leaf/map-d.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-e" src="assets/main/drawer-leaf/map-e.svg" alt="">' +
      '</span>';
    }
    if (item.id === 'phoneInspect') {
      return '<span class="app-drawer__ico app-drawer__ico--inspect" aria-hidden="true">' +
        '<img class="fig-leaf fig-leaf-a fig-off" src="assets/main/drawer-leaf/inspect-a.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-b fig-off" src="assets/main/drawer-leaf/inspect-b.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-c fig-off" src="assets/main/drawer-leaf/inspect-c.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-d fig-off" src="assets/main/drawer-leaf/inspect-c.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-a fig-on" src="assets/main/drawer-leaf/inspect-a-on.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-b fig-on" src="assets/main/drawer-leaf/inspect-b-on.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-c fig-on" src="assets/main/drawer-leaf/inspect-c.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-d fig-on" src="assets/main/drawer-leaf/inspect-c.svg" alt="">' +
      '</span>';
    }
    return '<span class="app-drawer__ico" aria-hidden="true"><img class="icon-single" src="assets/main/' + item.icon + '" alt="" width="22" height="22"></span>';
  }

  function buildDrawerCaret() {
    return '<span class="app-drawer__caret" aria-hidden="true">' +
      '<img class="is-off" src="assets/main/drawer-caret-down.svg" alt="" width="14" height="14">' +
      '<img class="is-on" src="assets/main/drawer-caret-up.svg" alt="" width="14" height="14">' +
    '</span>';
  }

  function buildDrawerHtml() {
    var items = DRAWER_MENUS.map(function (item) {
      var hasSub = !!(item.subs && item.subs.length);
      var showCaret = hasSub || !!item.caret;
      var row = '<button type="button" class="app-drawer__item" data-phone="' + item.id + '"' +
          (hasSub ? ' data-sub="1"' : '') + '>' +
        buildDrawerIco(item) +
        '<span class="app-drawer__label">' + item.label + '</span>' +
        (showCaret ? buildDrawerCaret() : '') +
      '</button>';
      if (!hasSub) return row;
      var subs = item.subs.map(function (sb) {
        return '<button type="button" class="app-drawer__sub" data-phone="' + sb.phone + '"' +
          (sb.mode ? ' data-mode="' + sb.mode + '"' : '') + '>' + sb.label + '</button>';
      }).join('');
      return '<div class="app-drawer__group">' + row +
        '<div class="app-drawer__subs">' + subs + '</div></div>';
    }).join('');
    return '<div class="app-drawer-dim" aria-hidden="true"></div>' +
      '<aside class="app-drawer" aria-label="전체 메뉴" aria-hidden="true">' +
        '<div class="app-drawer__head">' +
          '<div class="app-drawer__brandline">' +
            '<span class="app-drawer__logo">' +
              '<img class="app-drawer__logo-emblem" src="assets/main/drawer-mof-emblem.svg" alt="">' +
              '<img class="app-drawer__logo-text" src="assets/main/drawer-mof-text.svg" alt="해양수산부">' +
            '</span>' +
            '<button type="button" class="app-drawer__close" aria-label="메뉴 닫기">' +
              '<img src="assets/main/drawer-close.svg" alt="" width="19" height="19">' +
            '</button>' +
          '</div>' +
          '<div class="app-drawer__brand">' +
            '<div class="app-drawer__brand-sub"><strong>항만시설물</strong> 유지관리 시스템 모바일</div>' +
            '<div class="app-drawer__brand-title">항만시설 지킴이</div>' +
          '</div>' +
        '</div>' +
        '<nav class="app-drawer__nav">' + items + '</nav>' +
      '</aside>';
  }

  function initAppDrawers() {
    document.querySelectorAll('body > .phone').forEach(function (phone) {
      var inner = phone.querySelector('.phone-inner');
      if (!inner || inner.querySelector('.app-drawer')) return;

      var hd = inner.querySelector('.page-hd');
      var menuBtn = null;

      if (phone.id === 'phoneHome') {
        menuBtn = inner.querySelector('#homeMenuBtn');
      } else if (hd) {
        menuBtn = hd.querySelector('.page-hd__menu');
        if (!menuBtn) {
          menuBtn = document.createElement('button');
          menuBtn.type = 'button';
          menuBtn.className = 'page-hd__menu';
          menuBtn.title = '전체 메뉴';
          menuBtn.setAttribute('aria-label', '전체 메뉴 열기');
          menuBtn.innerHTML = '<i class="ti ti-menu-2"></i>';
          hd.appendChild(menuBtn);
        }
      }

      if (!menuBtn) return;

      var wrap = document.createElement('div');
      wrap.innerHTML = buildDrawerHtml();
      while (wrap.firstChild) inner.appendChild(wrap.firstChild);

      var dim = inner.querySelector('.app-drawer-dim');
      var drawer = inner.querySelector('.app-drawer');
      var closeBtn = inner.querySelector('.app-drawer__close');
      var logoutBtn = inner.querySelector('.app-drawer__logout');

      menuBtn.addEventListener('click', function () {
        syncDrawerActive(phone);
        openDrawer(inner);
        if (drawer) drawer.setAttribute('aria-hidden', 'false');
      });
      dim?.addEventListener('click', function () { closeDrawer(inner); });
      closeBtn?.addEventListener('click', function () { closeDrawer(inner); });
      logoutBtn?.addEventListener('click', function () {
        if (typeof window.pomsMobileLogout === 'function') {
          window.pomsMobileLogout();
          return;
        }
        window.location.href = 'mobile_login.html';
      });
      inner.querySelectorAll('.app-drawer__item[data-phone]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          /* 하위메뉴가 있으면 이동 대신 아코디언 토글 */
          if (btn.hasAttribute('data-sub')) {
            var grp = btn.parentElement;
            var wasOpen = grp.classList.contains('is-open');
            inner.querySelectorAll('.app-drawer__group.is-open').forEach(function (g) {
              g.classList.remove('is-open');
            });
            if (!wasOpen) grp.classList.add('is-open');
            return;
          }
          var target = btn.getAttribute('data-phone');
          closeDrawer(inner);
          if (target) showPhone(target);
        });
      });
      inner.querySelectorAll('.app-drawer__sub[data-phone]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-phone');
          closeDrawer(inner);
          if (target) showPhone(target);
        });
      });
    });
  }
  initAppDrawers();

  /* 외부 페이지에서 돌아올 대상 화면을 저장해 두고, 초기화가 끝난 뒤 복원 */
  var pendingReturnPhone = '';
  var pendingReturnFacility = '';
  try {
    pendingReturnPhone = sessionStorage.getItem('pomsReturnPhone') || '';
    pendingReturnFacility = sessionStorage.getItem('pomsReturnFacility') || '';
    sessionStorage.removeItem('pomsReturnPhone');
    sessionStorage.removeItem('pomsReturnFacility');
  } catch (e) { /* ignore */ }

  /* ── 시설물 기본/상세 데이터 ────────────── */
  var facilityInfoData = [
    { name: '남방파제', loc: '부산항 > 방파제', kind: '방파제', kindClass: '1종', date: '2026-03-15', grade: 'B', gradeTxt: '보통', status: '점검완료', image: 'assets/main/map-sheet-photo.jpg', port: '부산항(북항)', cargo: '-', agency: '부산지방해양수산청', built: '1988-11-30', struct: '케이슨식', open: '출입제한', berth: '-', repair: '2019', length: '1,004', spec: '혼성제', quake: '내진성능 확보', capacity: '-', lat: 35.083, lng: 129.052 },
    { name: '부산항 제1부두', loc: '부산항 > 북항', kind: '계류시설', kindClass: '2종', date: '2026-02-20', grade: 'A', gradeTxt: '양호', status: '점검완료', image: '../assets/sample-site-2.png', port: '부산항(북항)', cargo: '잡화', agency: '부산항만공사', built: '1912-08-15', struct: '중력식', open: '출입제한', berth: '#1,#2', repair: '2015', length: '793', spec: '콘크리트', quake: '내진성능 확보', capacity: '1만톤', lat: 35.104, lng: 129.040 },
    { name: '북항 물양장', loc: '부산항 > 북항', kind: '계류시설', kindClass: '3종', date: '2026-04-05', grade: 'B', gradeTxt: '보통', status: '점검예정', image: '../assets/sample-location.png', port: '부산항(북항)', cargo: '수산물', agency: '부산항만공사', built: '1975-05-20', struct: '중력식', open: '개방', berth: '-', repair: '2018', length: '420', spec: '블록식', quake: '해당없음', capacity: '소형선', lat: 35.094, lng: 129.061 },
    { name: '감천항 관리동', loc: '부산항 > 감천항', kind: '건축물', kindClass: '기타', date: '2026-01-18', grade: 'A', gradeTxt: '양호', status: '점검완료', image: '../assets/sample-section.png', port: '부산항(감천항)', cargo: '-', agency: '부산지방해양수산청', built: '1995-03-10', struct: 'RC조', open: '출입제한', berth: '-', repair: '2020', length: '-', spec: '지상 3층', quake: '내진성능 확보', capacity: '-', lat: 35.077, lng: 129.088 },
    { name: '북항 제1부두', loc: '포항항 > 북항', kind: '계류시설', kindClass: '1종', date: '2026-03-02', grade: 'A', gradeTxt: '양호', status: '점검완료', image: '../assets/sample-site-2.png', port: '포항항(북항)', cargo: '잡화', agency: '포항지방해양수산청', built: '1968-12-01', struct: '중력식', open: '출입제한', berth: '#1', repair: '2016', length: '620', spec: '콘크리트', quake: '내진성능 확보', capacity: '2만톤', lat: 36.045, lng: 129.378 },
    { name: '북방파제', loc: '포항항 > 북항', kind: '외곽시설', kindClass: '1종', date: '2026-02-18', grade: 'B', gradeTxt: '보통', status: '점검완료', image: '../assets/sample-site-1.png', port: '포항항(북항)', cargo: '-', agency: '포항지방해양수산청', built: '1979-06-25', struct: '혼성제', open: '출입제한', berth: '-', repair: '2017', length: '890', spec: '케이슨식', quake: '내진성능 확보', capacity: '-', lat: 36.052, lng: 129.392 },
    { name: '남항 물양장(1)', loc: '포항항 > 남항', kind: '계류시설', kindClass: '1종', date: '2026-01-30', grade: 'B', gradeTxt: '보통', status: '점검완료', image: '../assets/sample-location.png', port: '포항항(남항)', cargo: '수산물', agency: '포항지방해양수산청', built: '1982-04-14', struct: '중력식', open: '개방', berth: '-', repair: '2019', length: '350', spec: '블록식', quake: '해당없음', capacity: '소형선', lat: 36.032, lng: 129.371 },
    { name: '남항 물양장(2)', loc: '포항항 > 남항', kind: '계류시설', kindClass: '1종', date: '2026-02-02', grade: 'B', gradeTxt: '보통', status: '점검완료', image: '../assets/sample-location.png', port: '포항항(남항)', cargo: '수산물', agency: '포항지방해양수산청', built: '1985-09-02', struct: '중력식', open: '개방', berth: '-', repair: '2021', length: '310', spec: '블록식', quake: '해당없음', capacity: '소형선', lat: 36.030, lng: 129.369 },
    { name: '포항국제여객터미널', loc: '포항시 > 북구', kind: '건축물', kindClass: '1종', date: '2026-03-08', grade: 'A', gradeTxt: '양호', status: '점검완료', image: '../assets/sample-section.png', port: '포항항(북항)', cargo: '여객', agency: '포항지방해양수산청', built: '2018-07-01', struct: 'RC조', open: '개방', berth: '-', repair: '-', length: '-', spec: '지상 4층', quake: '내진성능 확보', capacity: '-', lat: 36.048, lng: 129.383 },
    { name: 'A계류시설', loc: '목포항 > 목포항', kind: '계류시설', kindClass: '기타', date: '2020-12-21', grade: 'B', gradeScore: '4.00', gradeTxt: '보통', status: '미점검', image: '../assets/sample-site-2.png', images: ['../assets/sample-site-2.png'], port: '목포항(목포항)', cargo: '컨테이너화물', agency: '목포지방해양수산청', built: '1997-12-22', struct: '중력식', open: '출입제한', berth: '#3,#4,#5', repair: '2017', length: '1,093', spec: '케이슨식', quake: '내진성능 확보', capacity: '5만톤', portClass: '국가관리무역항', tide: '중력식', lat: 34.803333, lng: 126.358333 },
    { id: 'b-outer', name: '파제제', loc: '목포항 > 목포항', kind: '외곽시설', kindClass: '기타', date: '2026-06-18', grade: 'A', gradeScore: '4.60', gradeTxt: '양호', status: '점검완료', image: '../assets/sample-site-1.png', images: ['../assets/sample-site-1.png', '../assets/sample-location.png'], port: '목포항(목포항)', cargo: '잡화', agency: '목포지방해양수산청', built: '2003-06-30', struct: '돌핀식', open: '출입제한', berth: '#1', repair: '2021', length: '180', spec: '강관파일', quake: '내진성능 확보', capacity: '3만톤', portClass: '국가관리무역항', tide: '돌핀식', lat: 34.805833, lng: 126.357778 },
    { id: 'mokpo-paje', name: '목포항 파제제', loc: '목포항 > 목포항', kind: '외곽시설', kindClass: '기타', date: '2026-04-16', grade: 'B', gradeScore: '4.10', gradeTxt: '보통', status: '입력누락', image: '../assets/sample-site-1.png', images: ['../assets/sample-site-1.png', '../assets/sample-section.png', '../assets/sample-site-2.png'], port: '목포항(목포항)', cargo: '-', agency: '목포지방해양수산청', built: '1994-11-08', struct: '혼성제', open: '출입제한', berth: '-', repair: '2019', length: '420', spec: '사석식', quake: '내진성능 확보', capacity: '-', portClass: '국가관리무역항', tide: '혼성제', lat: 34.806076, lng: 126.358921, viewer3d: '../assets/3d/3d_viewer3.html' }
  ];

  function getFacilityInfo(name) {
    var byId = facilityInfoData.find(function (item) { return item.id && item.id === name; });
    if (byId) return byId;
    return facilityInfoData.find(function (item) { return item.name === name; }) || facilityInfoData[0];
  }

  function facilityPhotos(item) {
    if (item.images && item.images.length) return item.images.slice();
    return [
      item.image || 'assets/main/map-sheet-photo.jpg',
      '../assets/sample-site-1.png',
      '../assets/sample-location.png',
      '../assets/sample-section.png'
    ];
  }

  /* ── 시설물 상세 화면 ───────────────────── */
  var currentDetailName = '';
  var detailReturnPhoneId = 'phoneFacility';

  function goBackFromDetail() {
    if (isInspRecordOpen()) {
      closeInspRecord();
      return;
    }
    var target = detailReturnPhoneId;
    if (!target || !document.getElementById(target)) target = 'phoneFacility';
    showPhone(target);
  }
  window.goBackFromDetail = goBackFromDetail;
  function openFacilityInfoByName(name) {
    var item = getFacilityInfo(name);

    if (currentPhoneId && currentPhoneId !== 'phoneDetail') {
      detailReturnPhoneId = currentPhoneId;
    }

    closeInspRecord();
    currentDetailName = item.name;
    document.getElementById('detailTitle').textContent = item.name;
    document.getElementById('detailSub').textContent = item.loc.replace(' > ', '·') + ' ' + item.kind;
    document.getElementById('detailKindBadge').textContent = item.kind;

    var rows = [
      { full: true, cells: [['시설물명', item.name]] },
      { cells: [['항명(세부항)', item.port], ['취급화물', item.cargo || '-']] },
      { cells: [['관리기관', item.agency], ['점검일(최근)', item.date]] },
      { cells: [['준공일자', item.built], ['구조형식', item.struct]] },
      { cells: [['항구분', item.portClass || '국가관리무역항'], ['시설개방여부', item.open]] },
      { cells: [['선석', item.berth || '-'], ['보수년도(최근)', item.repair || '-']] },
      { cells: [['연장(m)', item.length || '-'], ['기타상세 제원', item.spec || '-']] },
      { cells: [['종별', item.kindClass], ['내진설계 적용여부', item.quake]] },
      { cells: [['접안능력', item.capacity || '-'], ['비고', '-']] },
      { cells: [['상태등급', (item.grade || '-') + (item.gradeScore ? ' (' + item.gradeScore + ')' : '')], ['계획간만조석', item.tide || item.struct || '-']] }
    ];
    document.getElementById('detailGrid').innerHTML = rows.map(function (row) {
      var cellsHtml = row.cells.map(function (cell, idx) {
        var cls = row.full ? 'detail-cell' : (idx === 0 ? 'detail-cell detail-cell--left' : 'detail-cell detail-cell--right');
        return '<div class="' + cls + '"><span class="detail-cell__lbl">' + cell[0] + '</span><div class="detail-cell__val">' + cell[1] + '</div></div>';
      }).join('');
      return '<div class="detail-grid__row' + (row.full ? ' is-full' : '') + '">' + cellsHtml + '</div>';
    }).join('');

    document.getElementById('detailPhotoGrid').innerHTML = facilityPhotos(item).map(function (src, photoIndex) {
      return '<img src="' + src + '" alt="현장사진 ' + (photoIndex + 1) + '">';
    }).join('');

    /* 정기안전점검 이력 (제출/임시저장 + 과거 샘플) */
    detailHistData = collectInspHist(item);
    document.getElementById('detailInspHist').innerHTML = detailHistData.map(function (h, i) {
      return '<div class="ins-hist-item" onclick="openInspRecord(' + i + ')">' +
        '<div class="ins-hist-title">' + histPeriodTitle(h) + '</div>' +
        '<span class="ins-hist-date">' + histDateText(h) + '</span></div>';
    }).join('');

    activateDetailTab('info');
    showPhone('phoneDetail');
  }
  window.openFacilityInfoByName = openFacilityInfoByName;

  function openFacilityMapByName(name) {
    var item = getFacilityInfo(name);
    showPhone('phoneMap');
    setTimeout(function () {
      if (leafletMap && item.lat != null && item.lng != null) {
        leafletMap.setView([item.lat, item.lng], 15);
        leafletMap.invalidateSize();
      }
      renderMapSheet(item.id || item.name);
    }, 120);
  }
  window.openFacilityMapByName = openFacilityMapByName;

  function activateDetailTab(mode) {
    document.querySelectorAll('#detailTabs .seg-tab').forEach(function (tab) {
      tab.classList.toggle('is-active', tab.getAttribute('data-detail-tab') === mode);
    });
    document.getElementById('detailPanelInfo').hidden = mode !== 'info';
    document.getElementById('detailPanelPhoto').hidden = mode !== 'photo';
    document.getElementById('detailPanelInspect').hidden = mode !== 'inspect';
    document.getElementById('detailPanelPrecision').hidden = mode !== 'precision';
    if (mode === 'inspect') closeInspRecord();
  }
  document.querySelectorAll('#detailTabs .seg-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateDetailTab(tab.getAttribute('data-detail-tab'));
    });
  });

  /* 이력 목록 ↔ 개별 점검 기록(용역사 보고서 4탭) 전환 */
  var detailHistData = [];
  var detailHeaderBackup = { title: '', sub: '' };
  var inspRecordOpen = false;

  function histPeriodTitle(h) {
    var type = (h && h.checkType) || '';
    if (/하반기/.test(type)) return '정기안전점검(하반기)';
    if (/상반기/.test(type)) return '정기안전점검(상반기)';
    var m = parseInt(String((h && h.date) || '').replace(/\./g, '-').slice(5, 7), 10);
    return (m >= 7) ? '정기안전점검(하반기)' : '정기안전점검(상반기)';
  }
  function histDateText(h) {
    var d = String((h && h.date) || '');
    var m = d.match(/^\d{4}-\d{2}-\d{2}/);
    return m ? m[0] : d;
  }
  function histDateSortValue(h) {
    var raw = String((h && (h.date || h.at || h.writeDate)) || '').replace(/\./g, '-');
    var matched = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!matched) return 0;
    var t = Date.parse(matched[1] + '-' + matched[2] + '-' + matched[3] + 'T00:00:00');
    return isNaN(t) ? 0 : t;
  }
  function histPeriodRank(h) {
    return /하반기/.test(histPeriodTitle(h)) ? 1 : 0;
  }
  function histYearPeriodKey(h) {
    return String(histDateText(h) || '').slice(0, 4) + histPeriodTitle(h);
  }
  function bOuterSubmittedHist() {
    return [
      {
        date: '2026-06-18', name: '이책임', grade: '양호', status: '제출',
        checkType: '정기안전점검(상반기)',
        opinion: '상반기 정기안전점검 결과, 본체 및 기초부 상태는 양호하며 즉시 조치가 필요한 중대결함은 없음.',
        isNew: true, allGood: true, agency: '한국항만안전기술(주)', cost: '15,800',
        period: '2026-05-11 ~ 2026-06-18',
        result: '상반기 점검 결과 시설물 상태는 양호하며 일상 유지관리로 충분함.',
        repairPlan: '강관파일 피복 열화 구간에 대한 추적 관찰을 권고함.',
        joinName: '박참여', writer: '이책임', writeDate: '2026-06-18'
      }
    ];
  }
  function mergeBOuterHist(h) {
    if (!h) return h;
    var list = bOuterSubmittedHist();
    for (var i = 0; i < list.length; i++) {
      if (histYearPeriodKey(list[i]) !== histYearPeriodKey(h)) continue;
      return Object.assign({}, list[i], h, {
        name: (h.name && h.name !== '-') ? h.name : list[i].name,
        grade: (h.grade && h.grade !== '-') ? h.grade : list[i].grade,
        opinion: (h.opinion && h.opinion !== '-') ? h.opinion : list[i].opinion,
        status: h.status || list[i].status,
        checkType: h.checkType || list[i].checkType,
        isNew: true,
        allGood: true
      });
    }
    return h;
  }
  function collectInspHist(facility) {
    var firstYear = parseInt(String((facility && facility.date) || '').slice(0, 4), 10) || 2025;
    var savedRecords = (window.pomsInspectStore && window.pomsInspectStore.read()) || {};
    var saved = facility.id === 'mokpo-paje' ? null : savedRecords[facility.name];
    var list = [];
    var seen = {};
    function pushHist(h) {
      if (!h) return;
      var item = (facility.id === 'b-outer' || facility.name === 'A계류시설') ? mergeBOuterHist(h) : h;
      var key = histYearPeriodKey(item);
      if (seen[key]) return;
      seen[key] = true;
      list.push(item);
    }
    function pushSavedHist(entry) {
      if (!entry || (entry.status !== '제출' && entry.status !== '임시저장')) return;
      var view = entry.histView || {};
      pushHist(Object.assign({}, view, {
        date: entry.at, name: view.inspector || entry.inspector || '-', grade: view.gradeTxt || entry.grade || '-',
        status: entry.status, checkType: entry.checkType || view.title || '정기안전점검',
        opinion: view.result || entry.opinion || '-', isNew: true, fromSave: !!entry.histView
      }));
    }
    if (saved && saved.periods) {
      pushSavedHist(saved.periods['상반기']);
      pushSavedHist(saved.periods['하반기']);
    } else if (saved) {
      pushSavedHist(saved);
    }
    if (facility.id === 'b-outer' || facility.name === 'A계류시설') bOuterSubmittedHist().forEach(pushHist);
    [
      { date: facility.date, name: '홍길동', grade: facility.gradeTxt || '양호' },
      { date: (firstYear - 1) + '-06-18', name: '책임성명', grade: '양호' },
      { date: (firstYear - 2) + '-05-10', name: '김서울25', grade: '양호' },
      { date: (firstYear - 3) + '-04-22', name: '붕만식', grade: '양호' }
    ].forEach(pushHist);
    list.sort(function (a, b) {
      var diff = histDateSortValue(b) - histDateSortValue(a);
      if (diff) return diff;
      return histPeriodRank(b) - histPeriodRank(a);
    });
    return list;
  }
  function isInspRecordOpen() {
    return inspRecordOpen;
  }
  function escapeDetailHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function detailGridHtml(rows) {
    return '<div class="detail-grid">' + rows.map(function (row) {
      var cellsHtml = row.cells.map(function (cell, idx) {
        var cls = row.full ? 'detail-cell' : (idx === 0 ? 'detail-cell detail-cell--left' : 'detail-cell detail-cell--right');
        return '<div class="' + cls + '"><span class="detail-cell__lbl">' + escapeDetailHtml(cell[0]) + '</span><div class="detail-cell__val">' + escapeDetailHtml(cell[1]) + '</div></div>';
      }).join('');
      return '<div class="detail-grid__row' + (row.full ? ' is-full' : '') + '">' + cellsHtml + '</div>';
    }).join('') + '</div>';
  }
  function detailSecHdHtml(title) {
    return '<div class="detail-sec-hd"><img class="detail-sec-ico" src="assets/main/detail-info.svg" alt=""><b>' + escapeDetailHtml(title) + '</b></div>';
  }
  function inspNoteHtml(label, value) {
    return '<div class="insp-note"><span class="detail-cell__lbl">' + escapeDetailHtml(label) + '</span><div class="insp-note__val">' + escapeDetailHtml(value) + '</div></div>';
  }
  function resultBadgeClass(result) {
    if (result === '보통') return ' insp-result-badge--b';
    if (result === '불량' || result === '미흡') return ' insp-result-badge--c';
    return '';
  }
  function addDays(dateText, days) {
    var d = new Date(String(dateText || '').replace(/\./g, '-') + 'T00:00:00');
    if (isNaN(d.getTime())) return dateText || '-';
    d.setDate(d.getDate() + days);
    var m = String(d.getMonth() + 1);
    var day = String(d.getDate());
    if (m.length < 2) m = '0' + m;
    if (day.length < 2) day = '0' + day;
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function statusGradeFromText(grade) {
    var g = String(grade || '').trim();
    if (!g || g === '-') return '-';
    if (/양호|^A등급?$/i.test(g)) return '양호';
    if (/보통|^B등급?$/i.test(g)) return '보통';
    if (/불량|미흡|^C등급?$/i.test(g)) return '불량';
    return g;
  }
  var MOKPO_ORG = '목포지방해양수산청';
  function isMokpoFacility(facility) {
    var text = ((facility && facility.loc) || '') + ' ' + ((facility && facility.port) || '') + ' ' + ((facility && facility.name) || '');
    return text.indexOf('목포') !== -1;
  }
  function applyMokpoOrg(data, facility) {
    if (!data || !isMokpoFacility(facility)) return data;
    data.owner = MOKPO_ORG;
    data.writerOrg = MOKPO_ORG;
    data.leadOrg = MOKPO_ORG;
    data.joinOrg = MOKPO_ORG;
    (data.historyTechs || []).forEach(function (tech) { tech.org = MOKPO_ORG; });
    return data;
  }
  function summaryOpinionText(name, firstHalf) {
    if (name === '특기사항') {
      return firstHalf
        ? '폐기물·적치물 없음. 출입제한 구간은 현행 유지.'
        : '특기사항 없음. 상반기와 동일.';
    }
    if (name === '점검자 의견') {
      return firstHalf
        ? '전반적으로 양호하며 지속적인 유지·관찰이 필요함.'
        : '전반 양호. 지속 관찰 예정.';
    }
    return '';
  }
  function opinionHasContent(text) {
    var opinion = String(text == null ? '' : text).trim();
    return !!(opinion && opinion !== '-' && opinion !== '의견없음' && opinion !== '이상없음');
  }
  function withSummaryOpinions(data) {
    if (!data) return data;
    var firstHalf = String(data.title || '').indexOf('하반기') === -1;
    (data.groups || []).forEach(function (group) {
      if (group.title !== '종합의견') return;
      (group.items || []).forEach(function (item) {
        if (opinionHasContent(item.opinion)) return;
        var text = summaryOpinionText(item.name, firstHalf);
        if (text) item.opinion = text;
      });
    });
    return data;
  }
  function withSummaryFindings(raw, groups) {
    var list = (raw || []).slice();
    var names = {};
    list.forEach(function (item) { if (item && item.name) names[item.name] = true; });
    (groups || []).forEach(function (group) {
      if (group.title !== '종합의견') return;
      (group.items || []).forEach(function (item) {
        if (!item || !item.name || names[item.name]) return;
        names[item.name] = true;
        var opinion = String(item.opinion || '').trim();
        list.push({
          name: item.name,
          opinion: (!opinion || opinion === '-') ? '의견없음' : opinion,
          result: '',
          repair: '',
          photos: []
        });
      });
    });
    return list;
  }
  function buildInspReportData(h, facility) {
    facility = facility || {};
    if (h && h.fromSave) {
      var savedGrade = h.gradeTxt || h.grade || '-';
      var savedReport = applyMokpoOrg({
        fromSave: true,
        title: h.title || histPeriodTitle(h),
        date: h.date || h.writeDate || histDateText(h),
        period: h.period || '-',
        inspector: h.inspector || h.name || '-',
        gradeTxt: statusGradeFromText(savedGrade),
        statusGrade: statusGradeFromText(h.statusGrade || h.safetyGrade || savedGrade),
        safetyGrade: statusGradeFromText(h.safetyGrade || savedGrade),
        agency: h.agency || '-',
        cost: h.cost || '-',
        result: h.result || h.opinion || '-',
        repairPlan: h.repairPlan || '-',
        writer: h.writer || '-',
        writerOrg: h.writerOrg || '-',
        writerPos: h.writerPos || '-',
        writerPhone: h.writerPhone || '-',
        writeDate: h.writeDate || histDateText(h),
        joinName: h.joinName || '-',
        facilityName: h.facilityName || facility.name || '-',
        owner: h.owner || facility.agency || '-',
        built: h.built || facility.built || '-',
        kind: h.kind || facility.kind || '-',
        kindClass: h.kindClass || facility.kindClass || '-',
        struct: h.struct || facility.struct || '-',
        loc: h.loc || facility.port || facility.loc || '-',
        length: h.length || facility.length || '-',
        groups: h.groups || [],
        photos: h.photos || [],
        photoSrcs: h.photoSrcs || [],
        note: h.note || '-',
        agencyType: h.agencyType || '-',
        projectName: h.projectName || '-',
        reportPeriod: h.reportPeriod || h.period || '-',
        facilityType: h.facilityType || h.kind || '-',
        typeKind: h.typeKind || '-',
        typeClass: h.typeClass || h.kindClass || '-',
        location: h.location || '-',
        scale: h.scale || '-',
        defectMajor: h.defectMajor || '-',
        defectPublic: h.defectPublic || '-',
        reportResult: h.reportResult || h.result || '-',
        reportRepair: h.reportRepair || h.repairPlan || '-',
        checklistFindings: h.checklistFindings || [],
        historyTechs: h.historyTechs || [],
        reportTechs: h.reportTechs || [],
        publicUseYn: h.publicUseYn || ''
      }, facility);
      return withSummaryOpinions(savedReport);
    }
    var date = histDateText(h);
    var periodEnd = addDays(date, 18);
    var period = date + ' ~ ' + periodEnd;
    var title = histPeriodTitle(h);
    var firstHalf = title.indexOf('상반기') !== -1;
    var inspector = h.name || '홍길동';
    var gradeTxt = statusGradeFromText(h.grade || '양호');
    var statusGrade = gradeTxt === '-' ? '양호' : gradeTxt;
    var opinion = (h.opinion && h.opinion !== '-')
      ? h.opinion
      : (firstHalf
        ? '현재 안전상태는 정기 안전점검 실시 결과에 따른 상태등급이 ' + statusGrade + '에 해당함.'
        : '시설 전반이 양호하고 상반기 지적 구간의 추가 진행은 확인되지 않음.');
    var repairPlan = h.repairPlan || (firstHalf
      ? '경사/전도 구간 모니터링을 지속하고, 방충재 마모부는 차기 보수 시 교체 예정.'
      : '상반기 보수보강 계획에 따라 방충재 교체 후 이상 없음. 현 상태 유지.');
    var itemResult = function (name, fallback) {
      if (h.allGood) return fallback || '양호';
      if (!firstHalf) return fallback || '양호';
      if (name === '경사/전도' || name === '방충재') return '보통';
      return fallback || '양호';
    };
    var groups = [
      {
        title: '상부공 및 본체부',
        items: ['침하', '경사/전도', '활동', '파손', '균열', '박리', '마모/침식', '속채움재 유실', '이격'].map(function (name) {
          var result = itemResult(name);
          return {
            name: name,
            result: result,
            opinion: result === '보통' ? '경미한 변위가 확인되어 지속 관찰이 필요함.' : '-',
            repair: result === '보통' ? 'Y' : 'N',
            photos: result === '보통' ? 2 : (name === '침하' ? 1 : 0)
          };
        })
      },
      {
        title: '부대시설',
        items: ['방충재', '계선주', '차막이'].map(function (name) {
          var result = itemResult(name);
          return {
            name: name,
            result: result,
            opinion: result === '보통' ? '표면 마모가 진행되어 차기 교체를 권고함.' : '-',
            repair: result === '보통' ? 'Y' : 'N',
            photos: result === '보통' ? 2 : 0
          };
        })
      },
      {
        title: '기타',
        items: [
          { name: '공중이 이용하는 부위', result: '양호', opinion: '-', repair: 'N', photos: 0 },
          { name: '기타', result: '양호', opinion: '-', repair: 'N', photos: 0 }
        ]
      },
      {
        title: '종합의견',
        items: [
          { name: '특기사항', result: '양호', opinion: '-', repair: 'N', photos: 0 },
          { name: '점검자 의견', result: '양호', opinion: '-', repair: 'N', photos: 0 }
        ]
      }
    ];
    var photoSrcs = [
      facility.image || 'assets/main/map-sheet-photo.jpg',
      '../assets/sample-site-1.png',
      '../assets/sample-site-2.png',
      '../assets/sample-location.png',
      '../assets/sample-section.png'
    ];
    var loc = (facility.port || facility.loc || '-') + '';
    var joinName = h.joinName || (firstHalf ? '김점검' : '이참여');
    var writerOrg = h.writerOrg || facility.agency || '-';
    var writerPos = h.writerPos || '담당';
    var builtReport = applyMokpoOrg({
      title: title,
      date: date,
      period: h.period || period,
      inspector: inspector,
      gradeTxt: gradeTxt,
      statusGrade: statusGrade,
      safetyGrade: statusGrade,
      agency: h.agency || (h.isNew ? '모바일 등록' : '자체수행'),
      result: h.result || opinion,
      repairPlan: repairPlan,
      writer: h.writer || inspector,
      writerOrg: writerOrg,
      writerPos: writerPos,
      writerPhone: h.writerPhone || '-',
      writeDate: h.writeDate || addDays(date, -10),
      joinName: joinName,
      facilityName: facility.name,
      owner: facility.agency,
      built: facility.built,
      kind: facility.kind,
      kindClass: facility.kindClass,
      struct: facility.struct,
      loc: loc,
      length: facility.length || '-',
      groups: groups,
      photos: [
        { src: photoSrcs[0], caption: '상부공 및 본체부' },
        { src: photoSrcs[1], caption: '상부공 및 본체부' },
        { src: photoSrcs[2], caption: '부대시설' },
        { src: photoSrcs[3], caption: '부대시설' }
      ],
      photoSrcs: photoSrcs,
      note: h.note || (h.isNew ? ('모바일 ' + (h.status || '제출')) : '-'),
      agencyType: h.agencyType || '자체',
      projectName: h.projectName || title,
      reportPeriod: h.reportPeriod || period,
      facilityType: facility.kind,
      typeKind: facility.kind,
      typeClass: facility.kindClass,
      location: loc,
      scale: '연장 ' + (facility.length || '-') + 'm, 구조 ' + (facility.struct || '-'),
      defectMajor: h.defectMajor || '중대한 결함 없음',
      defectPublic: h.defectPublic || '없음',
      reportResult: h.result || opinion,
      reportRepair: repairPlan,
      historyTechs: [
        { role: '책임기술자', name: inspector, org: writerOrg, position: '책임기술자', signed: true, grade: '특급', period: h.period || period },
        { role: '참여기술자', name: joinName, org: h.agency || writerOrg, position: '참여기술자', signed: true, grade: '고급', period: h.period || period }
      ],
      reportTechs: [
        { role: '책임기술자', name: inspector, grade: '특급', period: h.period || period },
        { role: '참여기술자', name: joinName, grade: '고급', period: h.period || period }
      ]
    }, facility);
    return withSummaryOpinions(builtReport);
  }
  function inspAccHeadHtml(title, extra, open) {
    return '<button type="button" class="insp-acc__hd">' +
      '<span class="insp-acc__title">' + title + '</span>' + (extra || '') +
      '<img class="insp-acc__chev" src="assets/main/fac-angle-down.svg" alt="" width="14" height="14">' +
    '</button>';
  }
  function displayVal(v) {
    v = String(v == null ? '' : v).trim();
    return v || '-';
  }
  function signText(signed) {
    return signed ? '서명됨' : '-';
  }
  function renderHistoryTechCard(t, join) {
    return '<div class="insp-tech-card"><span class="insp-tech-role' + (join ? ' insp-tech-role--join' : '') + '">' +
      escapeDetailHtml(t.role || (join ? '참여기술자' : '책임기술자')) + '</span>' +
      detailGridHtml([
        { cells: [['소속', displayVal(t.org)], ['서명', signText(t.signed)]] },
        { cells: [['직위', displayVal(t.position)], ['성명', displayVal(t.name)]] },
        { full: true, cells: [['과업참여기간', displayVal(t.period)]] },
        { full: true, cells: [['기술등급', displayVal(t.grade)]] }
      ]) + '</div>';
  }
  function renderSavedTechCards(techs, mode) {
    if (!techs || !techs.length) return inspNoteHtml('기술자', '등록된 기술자가 없습니다.');
    if (mode !== 'report') {
      return techs.map(function (t) {
        return renderHistoryTechCard(t, /참여/.test(t.role || ''));
      }).join('');
    }
    return techs.map(function (t) {
      var join = /참여/.test(t.role || '');
      return '<div class="insp-tech-card"><span class="insp-tech-role' + (join ? ' insp-tech-role--join' : '') + '">' +
        escapeDetailHtml(t.role || '') + '</span>' + detailGridHtml([
          { cells: [['성명', displayVal(t.name)], ['구분', displayVal(t.role)]] },
          { full: true, cells: [['과업참여기간', displayVal(t.period)]] },
          { full: true, cells: [['기술등급', displayVal(t.grade)]] }
        ]) + '</div>';
    }).join('');
  }
  function historyLeadTechs(data) {
    var leads = (data.historyTechs || []).filter(function (t) { return !/참여/.test(t.role || ''); });
    if (leads.length) return leads;
    return [{
      role: '책임기술자',
      name: data.inspector,
      org: data.leadOrg || data.writerOrg || data.owner,
      position: data.leadPos || '책임기술자',
      signed: data.leadSigned
    }];
  }
  function historyJoinTechs(data) {
    var joins = (data.historyTechs || []).filter(function (t) { return /참여/.test(t.role || ''); });
    if (joins.length) return joins;
    if (data.fromSave || !data.joinName || data.joinName === '-') return [];
    return [{
      role: '참여기술자',
      name: data.joinName,
      org: data.joinOrg || data.agency,
      position: data.joinPos || '참여기술자',
      signed: data.joinSigned
    }];
  }
  function renderInspReportHistory(data) {
    var leads = historyLeadTechs(data);
    var joins = historyJoinTechs(data);
    return detailSecHdHtml('기본정보') +
      detailGridHtml([
        { cells: [['작성자', displayVal(data.writer)], ['소속', displayVal(data.writerOrg)]] },
        { cells: [['직위', displayVal(data.writerPos)], ['작성자 연락처', displayVal(data.writerPhone)]] },
        { full: true, cells: [['작성일', displayVal(data.writeDate)]] }
      ]) +
      detailSecHdHtml('정기안전점검이력') +
      detailGridHtml([
        { cells: [['점검구분', displayVal(data.title)], ['점검진단 기관명', displayVal(data.agency)]] },
        { full: true, cells: [['점검진단기간', displayVal(data.period)]] }
      ]) +
      detailSecHdHtml('책임기술자') +
      leads.map(function (t) { return renderHistoryTechCard(t, false); }).join('') +
      detailSecHdHtml('참여기술자') +
      (joins.length
        ? joins.map(function (t) { return renderHistoryTechCard(t, true); }).join('')
        : inspNoteHtml('참여기술자', '없음'));
  }
  function renderInspReportItems(data) {
    var statusGrade = data.statusGrade || data.gradeTxt || '-';
    var summary = detailSecHdHtml('정기안전점검표') +
      detailGridHtml([
        { cells: [['시설물명', displayVal(data.facilityName)], ['관리주체', displayVal(data.owner)]] },
        { cells: [['준공 년월일', displayVal(data.built)], ['최종점검 년월일', displayVal(data.date)]] }
      ]);
    var groups = data.groups || [];
    var groupsHtml = groups.length
      ? groups.map(function (group, gi) {
        var isSummaryGroup = group.title === '종합의견';
        var itemsHtml = (group.items || []).map(function (item, ii) {
          var photoList = findingPhotoList(item, data);
          var thumbs = photoList.length
            ? '<div class="insp-item-thumbs">' +
              photoList.map(function (src, n) {
                return '<button type="button" class="insp-photo-zoom" data-photo-src="' + escapeDetailHtml(src) + '" aria-label="' + escapeDetailHtml(item.name) + ' 사진 ' + (n + 1) + ' 크게 보기"><img src="' + escapeDetailHtml(src) + '" alt=""></button>';
              }).join('') +
            '</div>'
            : '';
          var rows = isSummaryGroup
            ? [{ full: true, cells: [['의견', displayVal(item.opinion)]] }]
            : [
              { cells: [['점검결과', displayVal(item.result)], ['보수필요여부', displayVal(item.repair)]] },
              { full: true, cells: [['의견', displayVal(item.opinion)]] }
            ];
          var extra = isSummaryGroup ? '' : '<span class="insp-result-badge' + resultBadgeClass(item.result) + '">' + escapeDetailHtml(item.result || '-') + '</span>';
          return '<div class="insp-acc insp-acc--item">' +
            inspAccHeadHtml(escapeDetailHtml(item.name), extra) +
            '<div class="insp-acc__body">' +
              detailGridHtml(rows) +
              (isSummaryGroup ? '' : (photoList.length ? inspNoteHtml('사진첨부', photoList.length + '개') + thumbs : inspNoteHtml('사진첨부', '0개'))) +
            '</div>' +
          '</div>';
        }).join('');
        return '<div class="insp-acc">' +
          inspAccHeadHtml(escapeDetailHtml(group.title)) +
          '<div class="insp-acc__body">' + itemsHtml + '</div>' +
        '</div>';
      }).join('')
      : inspNoteHtml('점검사항', '작성된 점검사항이 없습니다.');
    return summary + groupsHtml +
      detailSecHdHtml('상태등급') +
      plainDetailValHtml(statusGrade, 'detail-grid--grade');
  }
  function renderInspReportPhotos(data) {
    if (!data.photos || !data.photos.length) {
      return '<div class="insp-photo-head"><strong>' + escapeDetailHtml(data.facilityName) + '</strong><span>' + escapeDetailHtml(data.owner) + '</span></div>' +
        inspNoteHtml('사진대지', '첨부된 사진이 없습니다.');
    }
    return '<div class="insp-photo-head"><strong>' + escapeDetailHtml(data.facilityName) + '</strong><span>' + escapeDetailHtml(data.owner) + '</span></div>' +
      '<div class="insp-photo-grid">' +
        data.photos.map(function (photo) {
          return '<figure class="insp-photo-card"><img src="' + photo.src + '" alt="' + escapeDetailHtml(photo.caption) + '"><figcaption>' + escapeDetailHtml(photo.caption) + '</figcaption></figure>';
        }).join('') +
      '</div>';
  }
  function plainDetailValHtml(text, extraClass) {
    return '<div class="detail-grid' + (extraClass ? ' ' + extraClass : '') + '"><div class="detail-grid__row is-full"><div class="detail-cell"><div class="detail-cell__val">' +
      escapeDetailHtml(displayVal(text)) + '</div></div></div></div>';
  }
  var histChecklistFindings = [];
  var SAMPLE_FINDING_PHOTOS = [
    '../assets/sample-site-2.png',
    '../assets/sample-site-1.png',
    '../assets/sample-location.png',
    '../assets/sample-section.png'
  ];
  function pushPhotoSrc(list, src) {
    src = usablePhotoSrc(src);
    if (!src || list.indexOf(src) !== -1) return;
    list.push(src);
  }
  function usablePhotoSrc(src) {
    src = String(src || '').trim();
    if (!src || src.indexOf('blob:') === 0) return '';
    return src;
  }
  function reportPhotoSrcs(data) {
    var list = [];
    if (data && data.photoSrcs) data.photoSrcs.forEach(function (src) { pushPhotoSrc(list, src); });
    if (data && data.photos) {
      data.photos.forEach(function (photo) {
        pushPhotoSrc(list, typeof photo === 'string' ? photo : (photo && photo.src));
      });
    }
    return list;
  }
  function findingPhotoList(item, data) {
    var srcs = [];
    if (item && Array.isArray(item.photos)) {
      item.photos.forEach(function (photo) {
        if (typeof photo === 'string') pushPhotoSrc(srcs, photo);
        else if (photo && photo.src) pushPhotoSrc(srcs, photo.src);
      });
    }
    if (item && item.photoSrcs) item.photoSrcs.forEach(function (src) { pushPhotoSrc(srcs, src); });
    var count = item && typeof item.photos === 'number' ? item.photos : 0;
    if (!srcs.length && count > 0) {
      reportPhotoSrcs(data).slice(0, count).forEach(function (src) { pushPhotoSrc(srcs, src); });
    }
    if (data && data.fromSave) return srcs;
    var wantsPhoto = count > 0 || (item && (item.result === '보통' || item.result === '불량' || item.repair === 'Y'));
    if (!srcs.length && wantsPhoto) {
      var pool = reportPhotoSrcs(data);
      if (!pool.length) pool = SAMPLE_FINDING_PHOTOS;
      pool.slice(0, count > 0 ? count : 2).forEach(function (src) { pushPhotoSrc(srcs, src); });
    }
    return srcs;
  }
  function checklistItemPhotos(item, data) {
    var photos = findingPhotoList(item, data);
    var name = item && item.name;
    if (!name || !data) return photos;
    (data.groups || []).forEach(function (group) {
      (group.items || []).forEach(function (gItem) {
        if (!gItem || gItem === item || gItem.name !== name) return;
        var more = findingPhotoList(gItem, data);
        if (more.length > photos.length) photos = more;
      });
    });
    return photos;
  }
  function findingCarouselHtml(photos, name) {
    if (!photos || !photos.length) return '';
    var slides = photos.map(function (src, n) {
      return '<img src="' + escapeDetailHtml(src) + '" alt="' + escapeDetailHtml(name) + ' 사진 ' + (n + 1) + '" draggable="false">';
    }).join('');
    var dots = '';
    if (photos.length > 1) {
      dots = '<div class="hist-finding-sheet__fade"></div><div class="hist-finding-sheet__dots" role="tablist" aria-label="사진 넘기기">' +
        photos.map(function (_, n) {
          return '<button type="button" class="hist-finding-sheet__dot' + (n === 0 ? ' is-on' : '') + '" data-i="' + n + '" aria-label="' + (n + 1) + '번째 사진"></button>';
        }).join('') + '</div>';
    }
    return '<div class="hist-finding-sheet__track">' + slides + '</div>' + dots;
  }
  function bindFindingCarousel(photo, openPhoto) {
    var track = photo && photo.querySelector('.hist-finding-sheet__track');
    if (!track) return;
    var dots = photo.querySelectorAll('.hist-finding-sheet__dot');
    function indexOf() {
      var w = track.clientWidth || 1;
      return Math.max(0, Math.min(dots.length ? dots.length - 1 : 0, Math.round(track.scrollLeft / w)));
    }
    function syncDots() {
      var i = indexOf();
      dots.forEach(function (dot, n) { dot.classList.toggle('is-on', n === i); });
    }
    track.addEventListener('scroll', syncDots, { passive: true });
    if (photo.getAttribute('data-carousel') !== '1') {
      photo.setAttribute('data-carousel', '1');
      photo.addEventListener('click', function (e) {
        var dot = e.target.closest('.hist-finding-sheet__dot');
        var current = photo.querySelector('.hist-finding-sheet__track');
        if (!dot || !current) return;
        e.preventDefault();
        e.stopPropagation();
        var i = Number(dot.getAttribute('data-i') || 0);
        current.scrollTo({ left: i * (current.clientWidth || 0), behavior: 'smooth' });
      });
    }
    var drag = null;
    track.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      drag = { id: e.pointerId, x: e.clientX, sl: track.scrollLeft, moved: false };
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
    });
    track.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) {
        drag.moved = true;
        track.classList.add('is-dragging');
      }
      if (drag.moved) track.scrollLeft = drag.sl - dx;
    });
    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      if (drag.moved) {
        var w = track.clientWidth || 1;
        track.scrollTo({ left: Math.round(track.scrollLeft / w) * w, behavior: 'smooth' });
        track.setAttribute('data-dragged', '1');
      }
      track.classList.remove('is-dragging');
      drag = null;
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('click', function () {
      if (track.getAttribute('data-dragged') === '1') {
        track.removeAttribute('data-dragged');
        return;
      }
      var imgs = track.querySelectorAll('img');
      var img = imgs[indexOf()];
      if (img && openPhoto) openPhoto(img.getAttribute('src'));
    });
  }
  function checklistFindingsHtml(data, gridHtml, secHtml) {
    var raw = data.checklistFindings;
    if (!raw || !raw.length) {
      raw = (data.groups || []).reduce(function (acc, group) {
        if (group.title === '종합의견') return acc;
        (group.items || []).forEach(function (item) {
          if (item.result === '보통' || item.result === '불량' || item.repair === 'Y') acc.push(item);
        });
        return acc;
      }, []);
    }
    raw = withSummaryFindings(raw, data.groups);
    histChecklistFindings = (raw || []).map(function (item) {
      var photos = checklistItemPhotos(item, data);
      return {
        name: item.name || '-',
        opinion: item.opinion || '-',
        result: item.result || '-',
        repair: item.repair || 'N',
        photos: photos
      };
    });
    if (!histChecklistFindings.length) {
      return secHtml('체크리스트 결과') + plainDetailValHtml('해당항목없음');
    }
    return secHtml('체크리스트 결과') +
      '<div class="hist-finding-list">' +
      histChecklistFindings.map(function (item, i) {
        return '<button type="button" class="hist-finding-row" data-finding-idx="' + i + '" aria-label="' + escapeDetailHtml(item.name) + ' 상세 보기">' +
          '<span class="detail-cell__lbl">' + escapeDetailHtml(item.name) + '</span>' +
          '<span class="hist-finding-row__val">' + escapeDetailHtml(displayVal(item.opinion)) + '</span></button>';
      }).join('') +
      '</div>';
  }
  function reportTechList(data) {
    var techs = (data.reportTechs && data.reportTechs.length) ? data.reportTechs.slice() : [{ role: '책임기술자', name: data.inspector, grade: '특급', period: data.reportPeriod || data.period }];
    if (!(data.reportTechs && data.reportTechs.length) && data.joinName && data.joinName !== '-') {
      techs.push({ role: '참여기술자', name: data.joinName, grade: '고급', period: data.reportPeriod || data.period });
    }
    var hist = data.historyTechs || [];
    return techs.map(function (tech, i) {
      var src = null;
      for (var k = 0; k < hist.length; k++) {
        if ((hist[k].role || '') === (tech.role || '') && (!tech.name || hist[k].name === tech.name)) { src = hist[k]; break; }
      }
      if (!src && hist[i] && (hist[i].role || '') === (tech.role || '')) src = hist[i];
      if (!src) return tech;
      return Object.assign({}, tech, {
        name: src.name || tech.name,
        period: src.period || tech.period,
        grade: src.grade || tech.grade
      });
    });
  }
  function publicUseYnFromData(data) {
    if (!data) return '';
    if (data.publicUseYn) return data.publicUseYn;
    var groups = data.groups || [];
    for (var i = 0; i < groups.length; i++) {
      var items = groups[i].items || [];
      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        if (item.name !== '공중이 이용하는 부위') continue;
        if (item.publicYn) return item.publicYn;
        if (item.result === '무' || item.result === '유') return item.result;
      }
    }
    return '';
  }
  function reportResultStatusRows(data, valFn) {
    valFn = valFn || displayVal;
    var rows = [
      { full: true, cells: [['중대한 결함', valFn(data.defectMajor)]] }
    ];
    if (publicUseYnFromData(data) !== '무') {
      rows.push({ full: true, cells: [['공중이 이용하는 부위에 결함', valFn(data.defectPublic)]] });
    }
    rows.push(
      { full: true, cells: [['점검 주요결과', valFn(data.reportResult || data.result)]] },
      { full: true, cells: [['주요 보수·보강', valFn(data.reportRepair || data.repairPlan)]] }
    );
    return rows;
  }
  function renderInspReportResult(data) {
    var statusGrade = data.statusGrade || data.gradeTxt || '-';
    var scale = data.scale || ((data.length || data.struct) ? ('연장 ' + displayVal(data.length) + 'm, 구조 ' + displayVal(data.struct)) : '-');
    var noteText = displayVal(data.note === '-' ? '' : data.note);
    return detailSecHdHtml('일반 정보') +
      detailGridHtml([
        { cells: [['자체/대행 구분', displayVal(data.agencyType)], ['용역명', displayVal(data.projectName || data.title)]] },
        { full: true, cells: [['점검기간', displayVal(data.reportPeriod || data.period)]] },
        { cells: [['시설물구분', displayVal(data.facilityType || data.kind)], ['종류', displayVal(data.typeKind || data.kind)]] },
        { cells: [['종별', displayVal(data.typeClass || data.kindClass)], ['상태등급', displayVal(statusGrade)]] },
        { cells: [['준공일', displayVal(data.built)], ['시설물 위치', displayVal(data.location || data.loc)]] },
        { full: true, cells: [['시설물 규모', displayVal(scale)]] }
      ]) +
      checklistFindingsHtml(data, detailGridHtml, detailSecHdHtml) +
      detailSecHdHtml('점검 실시결과 현황') +
      detailGridHtml(reportResultStatusRows(data, displayVal)) +
      detailSecHdHtml('책임(참여)기술자 현황') +
      renderSavedTechCards(reportTechList(data), 'report') +
      detailSecHdHtml('참고사항') +
      plainDetailValHtml(noteText);
  }
  function fillInspReportPanels(h) {
    var facility = getFacilityInfo(currentDetailName);
    var data = buildInspReportData(h, facility);
    document.getElementById('inspReportPanelHistory').innerHTML = renderInspReportHistory(data);
    document.getElementById('inspReportPanelItems').innerHTML = renderInspReportItems(data);
    document.getElementById('inspReportPanelReport').innerHTML = renderInspReportResult(data);
  }
  function activateInspReportTab(mode) {
    if (mode === 'photos') mode = 'items';
    document.querySelectorAll('#detailReportTabs .seg-tab').forEach(function (tab) {
      tab.classList.toggle('is-active', tab.getAttribute('data-insp-report-tab') === mode);
    });
    document.getElementById('inspReportPanelHistory').hidden = mode !== 'history';
    document.getElementById('inspReportPanelItems').hidden = mode !== 'items';
    document.getElementById('inspReportPanelReport').hidden = mode !== 'report';
    var scroll = document.querySelector('#phoneDetail .scroll-body');
    if (scroll) scroll.scrollTop = 0;
  }
  document.querySelectorAll('#detailReportTabs .seg-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateInspReportTab(tab.getAttribute('data-insp-report-tab'));
    });
  });
  function openDetailPhoto(src) {
    var box = document.getElementById('detailPhotoLightbox');
    var img = document.getElementById('detailPhotoLightboxImg');
    if (!box || !img || !src) return;
    img.src = src;
    box.hidden = false;
    window.pomsBackLayer.opened('detailPhoto', closeDetailPhoto);
  }
  function closeDetailPhoto() {
    var box = document.getElementById('detailPhotoLightbox');
    if (box) box.hidden = true;
    window.pomsBackLayer.closedByUi('detailPhoto');
  }
  function openDetailFinding(item) {
    var sheet = document.getElementById('detailFindingSheet');
    var body = document.getElementById('detailFindingBody');
    var photo = document.getElementById('detailFindingPhoto');
    if (!sheet || !body || !item) return;
    function row(lbl, val) {
      return '<div class="hist-finding-sheet__row"><span class="lbl">' + escapeDetailHtml(lbl) + '</span><span class="val">' + val + '</span></div>';
    }
    var badge = '<span class="insp-result-badge' + resultBadgeClass(item.result) + '">' + escapeDetailHtml(item.result || '-') + '</span>';
    var opinionOnly = item.name === '특기사항' || item.name === '점검자 의견';
    body.innerHTML = '<div class="hist-finding-sheet__ttl">' + escapeDetailHtml(item.name) + '</div>' +
      (opinionOnly ? '' : row('점검결과', badge) + row('보수필요여부', escapeDetailHtml(item.repair || 'N'))) +
      row('의견', escapeDetailHtml(item.opinion || '-')) +
      (opinionOnly ? '' : row('사진첨부', escapeDetailHtml((item.photos ? item.photos.length : 0) + '개')));
    if (photo) {
      var has = !opinionOnly && item.photos && item.photos.length;
      photo.hidden = !has;
      photo.innerHTML = has ? findingCarouselHtml(item.photos, item.name) : '';
      if (has) bindFindingCarousel(photo, openDetailPhoto);
    }
    sheet.hidden = false;
    sheet.classList.add('is-open');
    window.pomsBackLayer.opened('detailFinding', closeDetailFinding);
  }
  function closeDetailFinding() {
    var sheet = document.getElementById('detailFindingSheet');
    if (!sheet) return;
    sheet.classList.remove('is-open');
    sheet.hidden = true;
    window.pomsBackLayer.closedByUi('detailFinding');
  }
  document.getElementById('inspHistRecordView').addEventListener('click', function (e) {
    var zoom = e.target.closest('.insp-photo-zoom');
    if (zoom) {
      openDetailPhoto(zoom.getAttribute('data-photo-src'));
      return;
    }
    var finding = e.target.closest('.hist-finding-row');
    if (finding) {
      openDetailFinding(histChecklistFindings[Number(finding.getAttribute('data-finding-idx'))]);
      return;
    }
    var hd = e.target.closest('.insp-acc__hd');
    if (!hd) return;
    var card = hd.parentElement;
    if (!card || !card.classList.contains('insp-acc')) return;
    card.classList.toggle('is-open');
  });
  document.getElementById('detailFindingSheet')?.addEventListener('click', function (e) {
    if (e.target.closest('[data-hist-finding-close]')) {
      closeDetailFinding();
      return;
    }
    if (e.target.closest('.hist-finding-sheet__dot')) return;
  });
  document.getElementById('detailPhotoLightbox')?.addEventListener('click', function (e) {
    if (e.target.id === 'detailPhotoLightbox' || e.target.closest('[data-hist-photo-close]')) closeDetailPhoto();
  });

  function openInspRecord(idx) {
    var h = detailHistData[idx];
    if (!h) return;
    var titleEl = document.getElementById('detailTitle');
    var subEl = document.getElementById('detailSub');
    detailHeaderBackup.title = titleEl.textContent;
    detailHeaderBackup.sub = subEl.textContent;
    titleEl.textContent = histPeriodTitle(h);
    subEl.textContent = (currentDetailName || '') + ' · ' + histDateText(h);
    fillInspReportPanels(h);
    activateInspReportTab('history');
    document.getElementById('phoneDetail').classList.add('is-insp-report');
    document.getElementById('detailTabs').hidden = true;
    document.getElementById('detailReportTabs').hidden = false;
    document.getElementById('inspHistListView').hidden = true;
    document.getElementById('inspHistRecordView').hidden = false;
    document.getElementById('detailReportFab')?.classList.remove('is-hidden');
    inspRecordOpen = true;
    window.pomsBackLayer.opened('inspRecord', closeInspRecord);
    var scroll = document.querySelector('#phoneDetail .scroll-body');
    if (scroll) scroll.scrollTop = 0;
  }
  function closeInspRecord() {
    var titleEl = document.getElementById('detailTitle');
    var subEl = document.getElementById('detailSub');
    if (inspRecordOpen && detailHeaderBackup.title) {
      titleEl.textContent = detailHeaderBackup.title;
      subEl.textContent = detailHeaderBackup.sub;
    }
    document.getElementById('phoneDetail').classList.remove('is-insp-report');
    document.getElementById('detailTabs').hidden = false;
    document.getElementById('detailReportTabs').hidden = true;
    document.getElementById('inspHistListView').hidden = false;
    document.getElementById('inspHistRecordView').hidden = true;
    document.getElementById('detailReportFab')?.classList.add('is-hidden');
    closeDetailPhoto();
    closeDetailFinding();
    inspRecordOpen = false;
    window.pomsBackLayer.closedByUi('inspRecord');
  }
  window.openInspRecord = openInspRecord;
  window.closeInspRecord = closeInspRecord;

  function reportPdfForFacility(kind, name) {
    var text = String(kind || '') + ' ' + String(name || '');
    if (text.indexOf('외곽') !== -1) return '부산남항 서구 방재호안 정밀안전점검용역_종합보고서-외곽.pdf';
    return '06. 정밀안전점검_부산항 신항 4부두(2-2단계)-계류.pdf';
  }
  function downloadFacilityReport(kind, name) {
    var file = reportPdfForFacility(kind, name);
    var a = document.createElement('a');
    a.href = 'assets/video/' + encodeURIComponent(file);
    a.download = file;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  document.getElementById('detailReportFab')?.addEventListener('click', function () {
    var info = getFacilityInfo(currentDetailName);
    downloadFacilityReport(info && info.kind, currentDetailName);
  });

  /* 점검 화면으로 이동 (돌아올 화면 기억) */
  function gotoInspect() {
    try {
      sessionStorage.setItem('pomsReturnPhone', currentPhoneId);
      if (currentPhoneId === 'phoneDetail' && currentDetailName) {
        sessionStorage.setItem('pomsReturnFacility', currentDetailName);
      }
    } catch (e) { /* ignore */ }
    window.location.href = 'mobile_inspect.html';
  }
  window.gotoInspect = gotoInspect;

  /* 정기안전점검 대상 시설물을 지정해서 점검 화면으로 이동 */
  var INSP_FACILITY_META = {
    'A계류시설': { loc: '목포항 > 목포항', kind: '계류시설', badge: '제출' },
    '파제제': { loc: '목포항 > 목포항', kind: '외곽시설', badge: '제출' }
  };
  function gotoInspectFacility(name) {
    var meta = INSP_FACILITY_META[name] || {};
    try {
      sessionStorage.setItem('pomsInspectFacility', JSON.stringify({
        name: name, loc: meta.loc || '', kind: meta.kind || '', badge: meta.badge || ''
      }));
      sessionStorage.setItem('pomsReturnPhone', 'phoneInspect');
    } catch (e) { /* ignore */ }
    window.location.href = 'mobile_inspect.html';
  }
  window.gotoInspectFacility = gotoInspectFacility;

  /* ── 홈: 동영상/매뉴얼 ─────────────────── */
  (function () {
    const videoBtn = document.getElementById('mobileVideoBtn');
    const manualBtn = document.getElementById('mobileManualBtn');
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('videoModalClose');
    const listEl = document.getElementById('videoModalList');
    const playerEl = document.getElementById('videoModalPlayer');
    const video = document.getElementById('safetyVideo');
    const titleEl = document.getElementById('videoModalTitle');
    const frame3d = document.getElementById('videoModal3d');
    const DEFAULT_TITLE = '안전점검 교육 동영상';
    const DRONE_VIDEO_SRC = 'https://assets.mixkit.co/videos/30125/30125-720.mp4';
    var playToken = 0;

    function playVideoSource(src, poster) {
      if (!video || !src) return;
      var token = ++playToken;
      video.pause();
      if (poster) video.poster = poster;
      else video.removeAttribute('poster');
      var encoded = encodeURI(src);
      function start() {
        if (token !== playToken) return;
        var playPromise = video.play();
        if (playPromise && playPromise.catch) playPromise.catch(function () {});
      }
      if (video.getAttribute('src') !== encoded) {
        video.src = encoded;
        video.load();
        video.addEventListener('loadeddata', function once() {
          video.removeEventListener('loadeddata', once);
          start();
        });
        return;
      }
      try { video.currentTime = 0; } catch (e) {}
      start();
    }

    function hide3dViewer() {
      modal?.classList.remove('is-3d');
      if (!frame3d) return;
      frame3d.hidden = true;
      frame3d.removeAttribute('src');
    }

    function mountVideoModal() {
      if (!modal) return;
      var activePhone = Array.prototype.find.call(document.querySelectorAll('body > .phone'), function (p) { return !p.hidden; });
      var host = activePhone && activePhone.querySelector('.phone-inner');
      if (host && modal.parentNode !== host) host.appendChild(modal);
    }
    function clearEducationSelection() {
      listEl?.querySelectorAll('.edu-video-card.is-active').forEach(function (card) {
        card.classList.remove('is-active');
      });
    }
    function showVideoList() {
      hide3dViewer();
      modal?.classList.remove('is-watching', 'is-map-video');
      if (playerEl) playerEl.hidden = true;
      clearEducationSelection();
      if (titleEl) titleEl.textContent = DEFAULT_TITLE;
      if (video) {
        video.pause();
        try { video.currentTime = 0; } catch (e) {}
      }
    }
    function showEducationVideo(card) {
      if (!card) return;
      hide3dViewer();
      modal?.classList.add('is-watching');
      modal?.classList.remove('is-map-video');
      if (playerEl) playerEl.hidden = false;
      clearEducationSelection();
      card.classList.add('is-active');
      var poster = card.querySelector('img')?.getAttribute('src') || '';
      var title = card.getAttribute('data-edu-title') || DEFAULT_TITLE;
      if (titleEl) titleEl.textContent = title;
      playVideoSource(card.getAttribute('data-src') || '', poster);
    }
    function showMapVideo(title) {
      hide3dViewer();
      modal?.classList.add('is-map-video');
      modal?.classList.remove('is-watching');
      if (playerEl) playerEl.hidden = false;
      clearEducationSelection();
      if (titleEl) titleEl.textContent = title || DEFAULT_TITLE;
      playVideoSource(DRONE_VIDEO_SRC, '');
    }
    function openVideoModal(title) {
      if (!modal) return;
      window.pomsBackLayer.opened('video', closeVideoModal);
      mountVideoModal();
      modal.hidden = false;
      if (typeof title === 'string' && title) showMapVideo(title);
      else showVideoList();
    }
    function open3dViewer(url, title) {
      if (!modal || !frame3d || !url) return;
      window.pomsBackLayer.opened('video', closeVideoModal);
      mountVideoModal();
      modal.hidden = false;
      modal.classList.add('is-3d');
      modal.classList.remove('is-watching', 'is-map-video');
      if (playerEl) playerEl.hidden = true;
      if (video) video.pause();
      clearEducationSelection();
      if (titleEl) titleEl.textContent = title || '3D 모델링';
      frame3d.hidden = false;
      if (frame3d.getAttribute('src') !== url) frame3d.src = url;
    }
    window.openVideoModal = openVideoModal;
    window.open3dViewer = open3dViewer;
    function closeVideoModal() {
      if (!modal) return;
      modal.hidden = true;
      if (video) video.pause();
      showVideoList();
      window.pomsBackLayer.closedByUi('video');
    }
    videoBtn?.addEventListener('click', () => openVideoModal());
    listEl?.querySelectorAll('.edu-video-card').forEach(function (card) {
      card.addEventListener('click', function () {
        showEducationVideo(card);
      });
    });
    closeBtn?.addEventListener('click', closeVideoModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) closeVideoModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && !modal.hidden) closeVideoModal(); });
    manualBtn?.addEventListener('click', function () {
      var href = 'assets/video/POMS-mobile-manual.pdf';
      var downloadName = '별권3. 팜플렛(모바일POMS).pdf';
      fetch(href).then(function (res) {
        if (!res.ok) throw new Error('manual missing');
        return res.blob();
      }).then(function (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = downloadName;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      }).catch(function () {
        var a = document.createElement('a');
        a.href = href;
        a.download = downloadName;
        a.rel = 'noopener';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    });
  })();

  /* ── 공용 결과 카드 렌더러 (스크린샷 스타일) ── */
  function facTagClass(kind) {
    if (kind.indexOf('계류') !== -1) return 'fac-tag--mooring';
    if (kind.indexOf('외곽') !== -1 || kind.indexOf('방파제') !== -1 || kind.indexOf('호안') !== -1) return 'fac-tag--outer';
    if (kind.indexOf('건축') !== -1 || kind.indexOf('터미널') !== -1) return 'fac-tag--building';
    return 'fac-tag--etc';
  }

  function renderFacCard(item, opts) {
    opts = opts || {};
    var right = opts.rightHtml || '';
    var aside = opts.asideHtml || '';
    var hideButton = opts.hideButton === true;
    var isMapAction = opts.action === 'map';
    var kindClass = item.type || item.kindClass || '';
    var btnLabel = isMapAction ? '' : '상세보기';
    var btnIcon = isMapAction ? '' : 'ti-chevron-right';
    var lookup = item.id || item.name;
    var btnHandler = isMapAction
      ? 'event.stopPropagation(); openFacilityMapByName(' + JSON.stringify(lookup) + ')'
      : 'event.stopPropagation(); openFacilityInfoByName(' + JSON.stringify(lookup) + ')';
    var tagsHtml =
      '<div class="fac-card__tags">' +
        '<span class="fac-tag ' + facTagClass(item.kind) + '">' + item.kind + '</span>' +
        (kindClass ? '<span class="fac-tag fac-tag--class">' + kindClass + '</span>' : '') + aside +
      '</div>';
    var moreBtn = hideButton ? '' :
      '<button type="button" class="fac-card__more" onclick=\'' + btnHandler + '\'>' +
        (isMapAction
              ? '<img class="fac-map-pin" src="assets/main/fac-map-pin.svg?v=3" alt="">'
          : btnLabel + ' <i class="ti ' + btnIcon + '"></i>') +
      '</button>';
    var cardHandler = opts.cardAction === 'inspect'
      ? 'gotoInspectFacility(' + JSON.stringify(item.name) + ')'
      : 'openFacilityInfoByName(' + JSON.stringify(lookup) + ')';
    return '<div class="fac-card" onclick=\'' + cardHandler + '\'>' +
      '<div class="fac-card__top"><span class="fac-card__crumb">' + item.loc + '</span>' + right + '</div>' +
      '<div class="fac-card__body">' +
        '<div class="fac-card__main">' +
          '<div class="fac-card__name">' + item.name + '</div>' +
          tagsHtml +
        '</div>' +
        moreBtn +
      '</div></div>';
  }

  /* 시연용 공통 시설물 3건 (시설물 조회·정기안전점검 위치/키워드 검색 공통) */
  var INSP_FACILITIES = [
    { loc: '목포항 > 목포항', name: 'A계류시설', kind: '계류시설', type: '기타', badge: '제출', badgeClass: 'insp-badge--submit',
      distance: '420m', distanceM: 420, facilityType: 'mooring',
      date: '2026-09-01', year: '2026', grade: 'B',
      agency: 'gyeongnam', port: 'mokpo', facilityKind: 'mooring', kindClass: 'etc', keywords: ['목포', '계류', 'A'] },
    { id: 'b-outer', loc: '목포항 > 목포항', name: '파제제', kind: '외곽시설', type: '기타', badge: '제출', badgeClass: 'insp-badge--submit',
      distance: '860m', distanceM: 860, facilityType: 'outer',
      date: '2026-08-20', year: '2025', grade: 'A',
      agency: 'gyeongnam', port: 'mokpo', facilityKind: 'outer', kindClass: 'etc', keywords: ['목포', '외곽', '파제제'] }
  ];

  /* ── 정기안전점검: 탭/검색 ─────────────── */
  (function () {
    var filterEl = document.getElementById('inspFilter');
    if (!filterEl) return;

    var panelDraft = document.getElementById('inspPanelDraft');
    var panelLocation = document.getElementById('inspPanelLocation');
    var panelKeyword = document.getElementById('inspPanelKeyword');
    var keywordInput = document.getElementById('inspKeywordInput');
    var keywordSearch = document.getElementById('inspKeywordSearch');
    var keywordCount = document.getElementById('inspKeywordCount');
    var keywordResults = document.getElementById('inspKeywordResults');
    var kwAgency = document.getElementById('inspKwAgency');
    var kwPort = document.getElementById('inspKwPort');
    var kwFacilityKind = document.getElementById('inspKwFacilityKind');
    var kwKindClass = document.getElementById('inspKwKindClass');
    var kwSort = document.getElementById('inspKwSort');
    var locDistance = document.getElementById('inspLocDistance');
    var locFacility = document.getElementById('inspLocFacility');
    var locConfirm = document.getElementById('inspLocConfirm');
    var locResults = document.getElementById('inspLocResults');

    var locationData = INSP_FACILITIES;
    var keywordData = INSP_FACILITIES;

    function renderInspCard(item, rightHtml, action) {
      return renderFacCard(item, {
        rightHtml: rightHtml,
        asideHtml: '<span class="insp-badge ' + item.badgeClass + '">' + item.badge + '</span>',
        action: action
      });
    }

    var inspLocationSearched = false;
    var inspKeywordSearched = false;

    function renderInspLocationList(items) {
      if (!locResults) return;
      if (!items.length) {
        locResults.innerHTML = '<div class="insp-empty">조건에 맞는 시설물이 없습니다.</div>';
        return;
      }
      locResults.innerHTML = items.map(function (item) {
        return renderFacCard(item, {
          rightHtml: '<span class="fac-card__dist">' + item.distance + '</span>',
          asideHtml: '<span class="insp-badge ' + item.badgeClass + '">' + item.badge + '</span>',
          hideButton: true,
          cardAction: 'inspect'
        });
      }).join('');
    }

    function renderInspKeywordList(items) {
      if (!keywordResults) return;
      if (keywordCount) keywordCount.innerHTML = '검색결과 총 <em>' + items.length + '</em>건';
      if (!items.length) {
        keywordResults.innerHTML = '<div class="insp-empty">검색 결과가 없습니다.</div>';
        return;
      }
      keywordResults.innerHTML = items.map(function (item) {
        return renderFacCard(item, {
          rightHtml: '<span class="fac-card__dist">' + item.date + '</span>',
          asideHtml: '<span class="insp-badge ' + item.badgeClass + '">' + item.badge + '</span>',
          hideButton: true,
          cardAction: 'inspect'
        });
      }).join('');
    }

    function showAllInspLocation() {
      inspLocationSearched = false;
      runLocationSearch();
    }

    function showAllInspKeyword() {
      inspKeywordSearched = false;
      var sortOrder = kwSort?.value || 'latest';
      var items = keywordData.slice().sort(function (a, b) {
        if (sortOrder === 'oldest') return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
      renderInspKeywordList(items);
    }

    function runLocationSearch() {
      if (!locResults) return;
      inspLocationSearched = true;
      var maxDist = Number(locDistance?.value || 500);
      var facilityType = locFacility?.value || '';
      var items = locationData.filter(function (item) {
        if (item.distanceM > maxDist) return false;
        if (facilityType && facilityType !== 'all' && item.facilityType !== facilityType) return false;
        return true;
      });
      renderInspLocationList(items);
    }

    function runKeywordSearch() {
      if (!keywordResults) return;
      inspKeywordSearched = true;
      var q = (keywordInput?.value || '').trim().toLowerCase();
      var agency = kwAgency?.value || '';
      var port = kwPort?.value || '';
      var facilityKind = kwFacilityKind?.value || '';
      var kindClass = kwKindClass?.value || '';
      var sortOrder = kwSort?.value || 'latest';

      var items = keywordData.filter(function (item) {
        if (agency && item.agency !== agency) return false;
        if (port && item.port !== port) return false;
        if (facilityKind && item.facilityKind !== facilityKind) return false;
        if (kindClass && item.kindClass !== kindClass) return false;
        if (!q || q === '전체') return true;
        var haystack = (item.name + ' ' + item.loc + ' ' + item.kind + ' ' + item.type + ' ' + item.keywords.join(' ')).toLowerCase();
        return haystack.indexOf(q) !== -1;
      });

      items.sort(function (a, b) {
        if (sortOrder === 'oldest') return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });

      renderInspKeywordList(items);
    }

    function activateInspMode(mode) {
      filterEl.querySelectorAll('.seg-tab').forEach(function (tab) {
        tab.classList.toggle('is-active', tab.getAttribute('data-insp-mode') === mode);
      });
      if (panelDraft) panelDraft.hidden = mode !== 'draft';
      if (panelLocation) panelLocation.hidden = mode !== 'location';
      if (panelKeyword) panelKeyword.hidden = mode !== 'keyword';

      if (mode === 'location') showAllInspLocation();
      if (mode === 'keyword') { showAllInspKeyword(); keywordInput?.focus(); }
      if (mode === 'draft') applyInspectDraftRecords();
    }

    filterEl.querySelectorAll('.seg-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        activateInspMode(tab.getAttribute('data-insp-mode') || 'draft');
      });
    });

    keywordSearch?.addEventListener('click', runKeywordSearch);
    kwSort?.addEventListener('change', function () {
      if (inspKeywordSearched) runKeywordSearch();
      else showAllInspKeyword();
    });
    keywordInput?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); runKeywordSearch(); }
    });
    locConfirm?.addEventListener('click', runLocationSearch);

    /* 점검 화면에서 제출/임시저장한 내역을 작성중 목록·배지에 반영 */
    function applyInspectDraftRecords() {
      var records = {};
      var flags = {};
      try { records = window.pomsInspectStore.read(); } catch (e) { records = {}; }
      try {
        flags = JSON.parse(localStorage.getItem('pomsInspectPeriodFlags') || sessionStorage.getItem('pomsInspectPeriodFlags') || '{}') || {};
      } catch (e) { flags = {}; }
      if (flags['B 외곽시설'] && !flags['파제제']) {
        flags['파제제'] = flags['B 외곽시설'];
        delete flags['B 외곽시설'];
      }
      if (flags['목포항 파제제'] && !flags['파제제']) {
        flags['파제제'] = flags['목포항 파제제'];
        delete flags['목포항 파제제'];
      }
      var bRec = records['파제제'];
      var bSecond = bRec && bRec.periods && bRec.periods['하반기'];
      if (bSecond && (bSecond.inspector === '최진단' || String(bSecond.at || '').indexOf('2025-11-12') === 0)) {
        delete bRec.periods['하반기'];
        if (bRec.periods && bRec.periods['상반기']) {
          bRec.status = bRec.periods['상반기'].status || bRec.status;
          bRec.inspector = bRec.periods['상반기'].inspector;
          bRec.checkType = bRec.periods['상반기'].checkType || '정기안전점검(상반기)';
          bRec.opinion = bRec.periods['상반기'].opinion;
          bRec.at = bRec.periods['상반기'].at;
        }
        try { window.pomsInspectStore.write(records); } catch (e) {}
        if (flags['파제제']) delete flags['파제제']['하반기'];
      }
      var BADGE = { '제출': 'insp-badge--submit', '임시저장': 'insp-badge--draft', '미제출': 'insp-badge--unsubmit' };
      var ITEM = { '제출': 'insp-item--done', '임시저장': 'insp-item--temp', '미제출': 'insp-item--progress' };
      var TRACK = { '제출': 'insp-track-full.svg', '임시저장': 'insp-track-half.svg', '미제출': 'insp-track-empty.svg' };
      function periodStatus(rec, label, name) {
        if (rec && rec.periods && rec.periods[label] && rec.periods[label].status) {
          return rec.periods[label].status;
        }
        if (flags[name] && flags[name][label]) return flags[name][label];
        if ((name === 'A계류시설' || name === '파제제') && label === '상반기') return '제출';
        if (rec && rec.checkType && rec.checkType.indexOf(label) !== -1) return rec.status || '';
        return '';
      }
      function overallStatus(rec, name) {
        var a = periodStatus(rec, '상반기', name);
        var b = periodStatus(rec, '하반기', name);
        if (a === '제출' || b === '제출' || (rec && rec.status === '제출')) return '제출';
        if (a === '임시저장' || b === '임시저장' || (rec && rec.status === '임시저장')) return '임시저장';
        return (rec && rec.status) || '';
      }
      function submittedCount(rec, name) {
        return (periodStatus(rec, '상반기', name) === '제출' ? 1 : 0) + (periodStatus(rec, '하반기', name) === '제출' ? 1 : 0);
      }

      /* 작성중 목록 */
      panelDraft?.querySelectorAll('.insp-item').forEach(function (item) {
        var name = item.querySelector('.insp-item__name')?.textContent.trim();
        var rec = records[name];
        var hasFlag = flags[name] && (flags[name]['상반기'] || flags[name]['하반기']);
        var defaultFirst = (name === 'A계류시설' || name === '파제제');
        if (!rec && !hasFlag && !defaultFirst) return;
        rec = rec || {};
        var status = overallStatus(rec, name);
        var doneN = submittedCount(rec, name);
        item.classList.remove('insp-item--done', 'insp-item--temp', 'insp-item--progress');
        item.classList.add(ITEM[status] || 'insp-item--progress');
        var badge = item.querySelector('.insp-badge');
        if (badge) {
          badge.className = 'insp-badge ' + (BADGE[status] || 'insp-badge--unsubmit');
          badge.textContent = status || '미제출';
        }
        var track = item.querySelector('.insp-track img');
        if (track) {
          var trackFile = TRACK[status] || 'insp-track-empty.svg';
          if (doneN >= 2) trackFile = 'insp-track-full.svg';
          else if (doneN === 1) trackFile = 'insp-track-half.svg';
          track.src = 'assets/main/' + trackFile;
        }
        item.querySelectorAll('.insp-status-bar__item').forEach(function (barItem) {
          var label = barItem.querySelector('.insp-status-bar__label')?.textContent.trim();
          var st = periodStatus(rec, label, name);
          var icon = barItem.querySelector('.insp-status-bar__icon');
          var img = icon && icon.querySelector('img');
          if (!icon) return;
          icon.classList.remove('is-pending', 'is-done', 'is-draft');
          if (st === '제출') {
            icon.classList.add('is-done');
            if (img) img.src = 'assets/main/insp-ico-check-fill.svg';
          } else if (st === '임시저장') {
            icon.classList.add('is-draft');
            if (img) img.src = 'assets/main/insp-ico-draft.svg';
          } else {
            icon.classList.add('is-pending');
            if (img) img.src = 'assets/main/insp-ico-empty.svg';
          }
        });
      });

      /* 위치기반·키워드 카드 데이터에도 상태 반영 */
      INSP_FACILITIES.forEach(function (f) {
        var rec = records[f.name];
        if (!rec && !(flags[f.name])) return;
        var status = overallStatus(rec || {}, f.name);
        if (!status) return;
        f.badge = status;
        f.badgeClass = BADGE[status] || f.badgeClass;
      });

      /* 미제출 건수: 6월 이후는 하반기, 그 전에는 상반기 미등록 */
      var alertMonth = new Date().getMonth() + 1;
      var alertLabel = alertMonth >= 6 ? '하반기' : '상반기';
      var pending = 0;
      panelDraft?.querySelectorAll('.insp-item').forEach(function (item) {
        var name = item.querySelector('.insp-item__name')?.textContent.trim();
        if (!name) return;
        if (periodStatus(records[name] || {}, alertLabel, name) !== '제출') pending++;
      });
      document.querySelectorAll('#phoneInspect .page-hd__badge').forEach(function (b) { b.textContent = pending; });
      var homeBadge = document.querySelector('#phoneHome .mi-count');
      if (homeBadge) homeBadge.textContent = pending;
    }
    window.applyInspectDraftRecords = applyInspectDraftRecords;
    applyInspectDraftRecords();
    window.addEventListener('pageshow', applyInspectDraftRecords);

    activateInspMode('draft');
  })();

  /* ── 시설물 조회: 탭/검색 ───────────────── */
  (function () {
    var filterEl = document.getElementById('facFilter');
    if (!filterEl) return;

    var panelLocation = document.getElementById('facPanelLocation');
    var panelKeyword = document.getElementById('facPanelKeyword');
    var locDistance = document.getElementById('facLocDistance');
    var locFacility = document.getElementById('facLocFacility');
    var locConfirm = document.getElementById('facLocConfirm');
    var locResults = document.getElementById('facLocResults');
    var locResultHd = document.getElementById('facLocResultHd');
    var locCount = document.getElementById('facLocCount');
    var keywordInput = document.getElementById('facKeywordInput');
    var keywordSearch = document.getElementById('facKeywordSearch');
    var keywordCount = document.getElementById('facKeywordCount');
    var keywordResults = document.getElementById('facKeywordResults');
    var kwAgency = document.getElementById('facKwAgency');
    var kwPort = document.getElementById('facKwPort');
    var kwFacilityKind = document.getElementById('facKwFacilityKind');
    var kwKindClass = document.getElementById('facKwKindClass');
    var kwSort = document.getElementById('facKwSort');

    var locationData = INSP_FACILITIES;
    var keywordData = INSP_FACILITIES;

    var facLocationSearched = false;
    var facKeywordSearched = false;

    function renderFacLocationList(items) {
      if (!locResults) return;
      if (locResultHd) locResultHd.hidden = false;
      if (locCount) locCount.textContent = items.length;
      if (!items.length) {
        locResults.innerHTML = '<div class="insp-empty">조건에 맞는 시설물이 없습니다.</div>';
        return;
      }
      locResults.innerHTML = items.map(function (item) {
        return renderFacCard(item, {
          rightHtml: '<span class="fac-card__dist">' + item.distance + '</span>',
          action: 'map'
        });
      }).join('');
    }

    function renderFacKeywordList(items) {
      if (!keywordResults) return;
      if (keywordCount) keywordCount.innerHTML = '총 <em>' + items.length + '</em>건';
      if (!items.length) {
        keywordResults.innerHTML = '<div class="insp-empty">검색 결과가 없습니다.</div>';
        return;
      }
      keywordResults.innerHTML = items.map(function (item) {
        return renderFacCard(item, {
          rightHtml: '<span class="fac-grade-pill fac-grade-pill--' + item.grade.toLowerCase() + '">' + item.grade + '등급</span>',
          hideButton: true
        });
      }).join('');
    }

    function showAllFacLocation() {
      facLocationSearched = false;
      renderFacLocationList(locationData.slice());
    }

    function showAllFacKeyword() {
      facKeywordSearched = false;
      var sortOrder = kwSort?.value || 'latest';
      var items = keywordData.slice().sort(function (a, b) {
        if (sortOrder === 'oldest') return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
      renderFacKeywordList(items);
    }

    function runFacLocationSearch() {
      if (!locResults) return;
      facLocationSearched = true;
      var maxDist = Number(locDistance?.value || 500);
      var facilityType = locFacility?.value || '';
      var items = locationData.filter(function (item) {
        if (item.distanceM > maxDist) return false;
        if (facilityType && facilityType !== 'all' && item.facilityType !== facilityType) return false;
        return true;
      });
      renderFacLocationList(items);
    }

    function runFacKeywordSearch() {
      if (!keywordResults) return;
      facKeywordSearched = true;
      var q = (keywordInput?.value || '').trim().toLowerCase();
      var agency = kwAgency?.value || '';
      var port = kwPort?.value || '';
      var facilityKind = kwFacilityKind?.value || '';
      var kindClass = kwKindClass?.value || '';
      var sortOrder = kwSort?.value || 'latest';

      var items = keywordData.filter(function (item) {
        if (agency && item.agency !== agency) return false;
        if (port && item.port !== port) return false;
        if (facilityKind && item.facilityKind !== facilityKind) return false;
        if (kindClass && item.kindClass !== kindClass) return false;
        if (!q || q === '전체') return true;
        var haystack = (item.name + ' ' + item.loc + ' ' + item.kind + ' ' + item.type + ' ' + item.keywords.join(' ')).toLowerCase();
        return haystack.indexOf(q) !== -1;
      });

      items.sort(function (a, b) {
        if (sortOrder === 'oldest') return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });

      renderFacKeywordList(items);
    }

    function activateFacMode(mode) {
      filterEl.querySelectorAll('.seg-tab').forEach(function (tab) {
        tab.classList.toggle('is-active', tab.getAttribute('data-fac-mode') === mode);
      });
      if (panelLocation) panelLocation.hidden = mode !== 'location';
      if (panelKeyword) panelKeyword.hidden = mode !== 'keyword';
      if (mode === 'location') showAllFacLocation();
      if (mode === 'keyword') { showAllFacKeyword(); keywordInput?.focus(); }
    }

    filterEl.querySelectorAll('.seg-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        activateFacMode(tab.getAttribute('data-fac-mode') || 'location');
      });
    });

    function showFacilityResultLoading(host, done) {
      if (!host) return;
      host.classList.add('is-sample-loading');
      host.innerHTML = '<div class="sample-result-loading" role="status" aria-label="검색 결과 로딩 중"><span class="sample-loading-spinner" aria-hidden="true"></span></div>';
      window.setTimeout(function () {
        host.classList.remove('is-sample-loading');
        done();
      }, 1000);
    }

    keywordSearch?.addEventListener('click', function () {
      showFacilityResultLoading(keywordResults, runFacKeywordSearch);
    });
    kwSort?.addEventListener('change', function () {
      if (facKeywordSearched) runFacKeywordSearch();
      else showAllFacKeyword();
    });
    keywordInput?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        showFacilityResultLoading(keywordResults, runFacKeywordSearch);
      }
    });
    locConfirm?.addEventListener('click', function () {
      if (locResultHd) locResultHd.hidden = false;
      if (locCount) locCount.textContent = '';
      showFacilityResultLoading(locResults, runFacLocationSearch);
    });

    activateFacMode('location');
  })();

  /* ── 지도 (Leaflet + OSM, 실패 시 폴백) ─── */
  var leafletMap = null;
  var leafletBase = null, leafletSat = null, satOn = false;
  var MAP_CENTER = [34.8054, 126.3601];

  var inspectColor = { '점검완료': '#22B573', '미점검': '#F5B301', '입력누락': '#E23B3B' };
  function inspectMarkerColor(name) {
    var info = getFacilityInfo(name);
    return inspectColor[info && info.status] || '#F5B301';
  }
  var mapMarkers = [
    {
      name: 'A계류시설',
      klass: '기타',
      color: '#22B573',
      line: [[34.803333, 126.358333], [34.802836, 126.357139], [34.802413, 126.356614], [34.802202, 126.356345]]
    },
    {
      id: 'b-outer',
      name: '파제제',
      klass: '기타',
      color: '#FF1F1F',
      line: [[34.805833, 126.357778], [34.805968, 126.357837], [34.806184, 126.360004]]
    }
  ];
  function markerKey(marker) {
    return (marker && marker.id) || (marker && marker.name) || '';
  }
  var DRONE_SITES = [
    { name: '인천항', lat: 37.4512, lng: 126.5928 },
    { name: '부산항', lat: 35.101, lng: 129.045 },
    { name: '울산항', lat: 35.4982, lng: 129.3865 },
    { name: '포항항', lat: 36.032, lng: 129.365 },
    { name: '여수항', lat: 34.74, lng: 127.74 },
    { name: '목포항', lat: 34.78, lng: 126.38 },
    { name: '속초항', lat: 38.21, lng: 128.59 },
    { name: '울릉항', lat: 37.484, lng: 130.872 },
    { name: '평택항', lat: 36.966, lng: 126.824 },
    { name: '군산항', lat: 35.968, lng: 126.563 },
    { name: 'A계류시설', lat: 34.802625, lng: 126.356877 }
  ];
  var facilityLayer = null;
  var droneLayer = null;
  var myLocMarker = null;
  var droneMode = false;
  /* 시설물 선은 목포북항 부두·파제제 위에 고정. 점은 그리지 않음 */

  function myLocationIconHtml() {
    return '<div class="myloc-pin" aria-hidden="true">' +
      '<svg viewBox="0 0 36 46" width="28" height="36">' +
        '<path d="M18 1.6C10.1 1.6 3.7 8 3.7 15.9 3.7 26.2 16.1 42.8 17.4 44.4c.3.4.9.4 1.2 0C19.9 42.8 32.3 26.2 32.3 15.9 32.3 8 25.9 1.6 18 1.6z" fill="#2F80ED" stroke="#1B4F9C" stroke-width="1.8"/>' +
        '<circle cx="18" cy="16.2" r="5.3" fill="#fff"/>' +
      '</svg></div>';
  }

  function markerLines(marker) {
    return (marker && marker.line) ? [marker.line] : [];
  }

  function bindFacilitySelect(layer, name) {
    layer.on('click', function (ev) {
      if (ev.originalEvent) {
        L.DomEvent.stopPropagation(ev.originalEvent);
        ev.originalEvent._stopped = true;
      }
      renderMapSheet(name);
    });
  }

  function showMyLocationMarker() {
    if (!leafletMap || typeof L === 'undefined') return;
    if (myLocMarker) leafletMap.removeLayer(myLocMarker);
    myLocMarker = L.marker(MAP_CENTER, {
      icon: L.divIcon({
        className: 'map-myloc-marker',
        html: myLocationIconHtml(),
        iconSize: [28, 36],
        iconAnchor: [14, 34]
      }),
      zIndexOffset: 900,
      interactive: false,
      keyboard: false
    }).addTo(leafletMap);
  }

  function viewer3dSites() {
    return facilityInfoData.filter(function (item) { return item && item.viewer3d && item.lat != null && item.lng != null; });
  }

  function dronePinIcon(kind) {
    return L.divIcon({
      className: 'map-drone-pin',
      html: '<div class="drone-pin' + (kind === '3d' ? ' drone-pin--3d' : '') + '"></div>',
      iconSize: [22, 22],
      iconAnchor: [4, 18]
    });
  }

  function showFacilityMarkers() {
    if (!leafletMap || typeof L === 'undefined') return;
    if (droneLayer) leafletMap.removeLayer(droneLayer);
    if (facilityLayer) leafletMap.removeLayer(facilityLayer);
    facilityLayer = L.layerGroup();
    mapMarkers.forEach(function (m) {
      markerLines(m).forEach(function (seg) {
        var lineOpt = { color: m.color || '#FF1F1F', lineCap: 'round', lineJoin: 'round', interactive: true };
        bindFacilitySelect(L.polyline(seg, Object.assign({}, lineOpt, {
          weight: 16, opacity: 0.01, className: 'facility-line-hit'
        })).addTo(facilityLayer), markerKey(m));
        bindFacilitySelect(L.polyline(seg, Object.assign({}, lineOpt, {
          weight: 5, opacity: 1, className: 'facility-line'
        })).addTo(facilityLayer), markerKey(m));
      });
    });
    facilityLayer.addTo(leafletMap);
  }

  function fitFacilityView() {
    if (!leafletMap) return;
    var points = [MAP_CENTER];
    mapMarkers.forEach(function (m) {
      var info = getFacilityInfo(markerKey(m));
      var near = Math.abs(info.lat - MAP_CENTER[0]) < 0.35 && Math.abs(info.lng - MAP_CENTER[1]) < 0.35;
      if (!near) return;
      points.push([info.lat, info.lng]);
      markerLines(m).forEach(function (seg) {
        seg.forEach(function (pt) { points.push(pt); });
      });
    });
    if (points.length < 2) {
      mapMarkers.forEach(function (m) {
        var info = getFacilityInfo(markerKey(m));
        points.push([info.lat, info.lng]);
      });
    }
    leafletMap.fitBounds(points, { padding: [36, 36], maxZoom: 16 });
  }

  function showDroneMarkers() {
    if (!leafletMap || typeof L === 'undefined') return;
    if (droneLayer) leafletMap.removeLayer(droneLayer);
    droneLayer = L.layerGroup();
    DRONE_SITES.forEach(function (site) {
      L.marker([site.lat, site.lng], { icon: dronePinIcon('drone') })
        .addTo(droneLayer)
        .on('click', function (ev) {
          if (ev.originalEvent) L.DomEvent.stopPropagation(ev.originalEvent);
          openVideoModal(site.name + ' 드론 영상');
        });
    });
    viewer3dSites().forEach(function (item) {
      L.marker([item.lat, item.lng], { icon: dronePinIcon('3d'), zIndexOffset: 500 })
        .addTo(droneLayer)
        .on('click', function (ev) {
          if (ev.originalEvent) L.DomEvent.stopPropagation(ev.originalEvent);
          open3dViewer(item.viewer3d, item.name + ' 3D');
        });
    });
    droneLayer.addTo(leafletMap);
    var bounds = DRONE_SITES.map(function (site) { return [site.lat, site.lng]; })
      .concat(viewer3dSites().map(function (item) { return [item.lat, item.lng]; }));
    leafletMap.fitBounds(bounds, { padding: [28, 28] });
  }

  function setDroneMode(on) {
    droneMode = !!on;
    var mapPhone = document.getElementById('phoneMap');
    if (mapPhone) mapPhone.classList.toggle('is-drone', droneMode);
    var btn = document.getElementById('mapDroneToggle');
    if (btn) {
      btn.classList.toggle('is-active', droneMode);
      btn.setAttribute('aria-pressed', droneMode ? 'true' : 'false');
    }
    closeMapSheet();
    if (typeof L === 'undefined' || !leafletMap) {
      buildFallbackMap(true);
      return;
    }
    if (droneMode) showDroneMarkers();
    else {
      showFacilityMarkers();
      fitFacilityView();
    }
  }

  function initLeafletMap() {
    var wrap = document.getElementById('leafletMap');
    if (!wrap) return;
    if (leafletMap) { setTimeout(function () { leafletMap.invalidateSize(); }, 60); return; }

    if (typeof L === 'undefined') { buildFallbackMap(); return; }

    leafletMap = L.map('leafletMap', { zoomControl: false, attributionControl: true }).setView(MAP_CENTER, 14);
    leafletBase = L.tileLayer('https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; OpenStreetMap'
    }).addTo(leafletMap);
    leafletSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19, attribution: 'Esri'
    });

    showFacilityMarkers();
    showMyLocationMarker();

    document.getElementById('mapZoomIn')?.addEventListener('click', function () { leafletMap.zoomIn(); });
    document.getElementById('mapZoomOut')?.addEventListener('click', function () { leafletMap.zoomOut(); });
    document.getElementById('mapMyLoc')?.addEventListener('click', function () {
      leafletMap.setView(MAP_CENTER, 15);
    });
    document.getElementById('mapDroneToggle')?.addEventListener('click', function () { setDroneMode(!droneMode); });
    document.getElementById('mapSatToggle')?.addEventListener('click', function () {
      satOn = !satOn;
      if (satOn) { leafletMap.removeLayer(leafletBase); leafletSat.addTo(leafletMap); }
      else { leafletMap.removeLayer(leafletSat); leafletBase.addTo(leafletMap); }
    });
    leafletMap.on('click', closeMapSheet);

    setTimeout(function () {
      leafletMap.invalidateSize();
      if (!droneMode) fitFacilityView();
    }, 60);
  }

  function buildFallbackMap(force) {
    var wrap = document.getElementById('leafletMap');
    if (!wrap || (wrap.dataset.fallback && !force)) return;
    wrap.dataset.fallback = '1';
    var html = '';
    if (droneMode) {
      var mediaSites = DRONE_SITES.map(function (site) {
        return { lat: site.lat, lng: site.lng, kind: 'drone', name: site.name };
      }).concat(viewer3dSites().map(function (item) {
        return { lat: item.lat, lng: item.lng, kind: '3d', name: item.name, url: item.viewer3d };
      }));
      var lats = mediaSites.map(function (site) { return site.lat; });
      var lngs = mediaSites.map(function (site) { return site.lng; });
      var minLat = Math.min.apply(null, lats);
      var maxLat = Math.max.apply(null, lats);
      var minLng = Math.min.apply(null, lngs);
      var maxLng = Math.max.apply(null, lngs);
      html = mediaSites.map(function (site) {
        var x = 10 + ((site.lng - minLng) / (maxLng - minLng || 1)) * 80;
        var y = 12 + ((maxLat - site.lat) / (maxLat - minLat || 1)) * 70;
        if (site.kind === '3d') {
          return '<button type="button" class="map-pin-fallback drone-pin--3d" style="left:' + x + '%;top:' + y + '%;background:#FF1F1F" data-3d-url="' + site.url + '" data-3d-name="' + site.name + '" aria-label="' + site.name + ' 3D"></button>';
        }
        return '<button type="button" class="map-pin-fallback" style="left:' + x + '%;top:' + y + '%;background:#1C6FFF" data-drone-name="' + site.name + '" aria-label="' + site.name + ' 드론 영상"></button>';
      }).join('');
    } else {
      var lats = [MAP_CENTER[0]];
      var lngs = [MAP_CENTER[1]];
      mapMarkers.forEach(function (m) {
        (m.line || []).forEach(function (pt) {
          lats.push(pt[0]);
          lngs.push(pt[1]);
        });
      });
      var minLat = Math.min.apply(null, lats);
      var maxLat = Math.max.apply(null, lats);
      var minLng = Math.min.apply(null, lngs);
      var maxLng = Math.max.apply(null, lngs);
      function xy(lat, lng) {
        var x = 12 + ((lng - minLng) / (maxLng - minLng || 1)) * 76;
        var y = 12 + ((maxLat - lat) / (maxLat - minLat || 1)) * 76;
        return x + ',' + y;
      }
      var lines = mapMarkers.map(function (m) {
        var points = (m.line || []).map(function (pt) { return xy(pt[0], pt[1]); }).join(' ');
        return '<polyline class="map-fallback-line" data-map-name="' + markerKey(m) + '" points="' + points + '" style="stroke:' + (m.color || '#FF1F1F') + '"></polyline>';
      }).join('');
      var my = xy(MAP_CENTER[0], MAP_CENTER[1]).split(',');
      html = '<svg class="map-fallback-lines" viewBox="0 0 100 100" preserveAspectRatio="none">' + lines + '</svg>' +
        '<div class="map-myloc-fallback" style="left:' + my[0] + '%;top:' + my[1] + '%">' + myLocationIconHtml() + '</div>';
    }
    wrap.innerHTML = html;
    wrap.querySelectorAll('[data-map-name]').forEach(function (btn) {
      btn.addEventListener('click', function () { renderMapSheet(btn.getAttribute('data-map-name')); });
    });
    wrap.querySelectorAll('[data-drone-name]').forEach(function (btn) {
      btn.addEventListener('click', function () { openVideoModal(btn.getAttribute('data-drone-name') + ' 드론 영상'); });
    });
    wrap.querySelectorAll('[data-3d-url]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        open3dViewer(btn.getAttribute('data-3d-url'), btn.getAttribute('data-3d-name') + ' 3D');
      });
    });
  }

  /* ── 지도 바텀시트 (스크린샷 3) ──────────── */
  function renderMapSheet(name) {
    var item = getFacilityInfo(name);
    var body = document.getElementById('mapSheetBody');
    var sheet = document.getElementById('mapFacilitySheet');
    if (!body || !sheet) return;
    var photos = facilityPhotos(item);
    var mediaBtns = '';
    if (item.name === 'A계류시설' || item.name === '파제제') {
      mediaBtns += '<button type="button" class="map-sheet__media-btn" onclick=\'openVideoModal(' + JSON.stringify(item.name + ' 드론 영상') + ')\'>드론</button>';
    }
    if (item.name === '파제제') {
      mediaBtns += '<button type="button" class="map-sheet__media-btn" onclick=\'open3dViewer(' + JSON.stringify('../assets/3d/3d_viewer3.html') + ',' + JSON.stringify(item.name + ' 3D') + ')\'>3D</button>';
    }
    var playBtn = mediaBtns
      ? '<span class="map-sheet__media">' + mediaBtns + '</span>'
      : (item.viewer3d
        ? '<button type="button" class="map-sheet__video-btn" aria-label="' + item.name + ' 3D 모델링" onclick=\'open3dViewer(' + JSON.stringify(item.viewer3d) + ',' + JSON.stringify(item.name + ' 3D') + ')\'><img src="assets/main/icon-play.svg" alt=""></button>'
        : '');
    var dotCount = photos.length < 2 ? 0 : (photos.length === 2 ? 2 : 3);
    var dotsHtml = '';
    if (dotCount) {
      dotsHtml = '<div class="map-sheet__dots" id="mapSheetDots">';
      for (var dotIndex = 0; dotIndex < dotCount; dotIndex++) {
        dotsHtml += '<span class="map-sheet__dot' + (dotIndex === 0 ? ' is-active' : '') + '"></span>';
      }
      dotsHtml += '</div>';
    }
    body.innerHTML =
      '<div class="map-sheet__photo-wrap" id="mapSheetPhotos">' +
        '<div class="map-sheet__photo-track">' +
          photos.map(function (src, photoIndex) {
            return '<img class="map-sheet__photo" src="' + src + '" alt="' + item.name + ' 현장사진 ' + (photoIndex + 1) + '" draggable="false" onerror="this.onerror=null;this.src=\'assets/main/map-sheet-photo.jpg\'">';
          }).join('') +
        '</div>' +
      '</div>' +
      dotsHtml +
      '<div class="map-sheet__body">' +
        '<div class="map-sheet__ttl-row">' +
          '<span class="map-sheet__title-icon"><img src="assets/main/map-sheet-title-icon.png" alt=""></span>' +
          '<span class="map-sheet__name">' + item.name + '</span>' +
          '<span class="map-sheet__crumb">' + item.loc + '</span>' +
          playBtn +
        '</div>' +
        '<div class="map-sheet__table">' +
          '<div class="map-sheet__row"><span class="lbl">시설물 구분</span><span class="val">' + item.kind + '</span></div>' +
          '<div class="map-sheet__row"><span class="lbl">최근 점검일</span><span class="val">' + item.date + '</span></div>' +
          '<div class="map-sheet__row"><span class="lbl">상태등급</span><span class="val">' + item.grade + ' <span class="grade-badge">' + item.gradeTxt + '</span></span></div>' +
          '<div class="map-sheet__row"><span class="lbl">점검상태</span><span class="val">' + item.status + '</span></div>' +
        '</div>' +
        '<div class="map-sheet__actions">' +
          '<button type="button" class="map-sheet__btn" onclick=\'openFacilityInfoByName(' + JSON.stringify(item.id || item.name) + ')\'>' +
            '상세보기' +
            '<span class="map-sheet__btn-chevron"><img src="assets/main/map-sheet-chevron-a.svg" alt=""></span>' +
          '</button>' +
        '</div>' +
      '</div>';
    sheet.classList.add('open');
    document.getElementById('mapWrap')?.classList.add('sheet-open');
    bindMapSheetPhotos(photos.length);
  }

  function mapSheetDotIndex(photoIndex, total) {
    var count = total === 2 ? 2 : 3;
    if (photoIndex <= 0) return 0;
    if (photoIndex >= total - 1) return count - 1;
    return 1;
  }

  function bindMapSheetPhotos(total) {
    var wrap = document.getElementById('mapSheetPhotos');
    var track = wrap && wrap.querySelector('.map-sheet__photo-track');
    var dots = document.getElementById('mapSheetDots');
    if (!wrap || !track || total < 2) return;
    var index = 0;
    var startX = 0;
    var delta = 0;
    var dragging = false;

    function paint(animate) {
      track.style.transition = animate ? 'transform .25s ease' : 'none';
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      var active = mapSheetDotIndex(index, total);
      if (!dots) return;
      dots.querySelectorAll('.map-sheet__dot').forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    wrap.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      delta = 0;
      if (wrap.setPointerCapture) wrap.setPointerCapture(e.pointerId);
    });
    wrap.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      delta = e.clientX - startX;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      if (delta <= -36 && index < total - 1) index += 1;
      else if (delta >= 36 && index > 0) index -= 1;
      paint(true);
    }
    wrap.addEventListener('pointerup', endDrag);
    wrap.addEventListener('pointercancel', endDrag);
    paint(false);
  }
  function closeMapSheet() {
    document.getElementById('mapFacilitySheet')?.classList.remove('open');
    document.getElementById('mapWrap')?.classList.remove('sheet-open');
  }
  document.getElementById('mapSheetHandle')?.addEventListener('click', closeMapSheet);

  /* ── 공지/문의 ──────────────────────────── */
  (function () {
    var notices = [
      { id: 'notice-1', category: '공지', title: '정기안전점검 시스템 점검안내', summary: '시스템 점검으로 인해 서비스가 일시 중단됩니다.', date: '2026-01-28 09:10', views: 135, comments: 1, body: '정기안전점검 시스템 안정화를 위한 점검이 진행됩니다.\n점검 시간 중 일부 기능 이용이 제한될 수 있습니다.' },
      { id: 'notice-2', category: '공지', title: '정기안전점검 시스템 점검안내', summary: '시스템 점검으로 인해 서비스가 일시 중단됩니다.', date: '2026-01-28 09:10', views: 135, comments: 1, body: '정기안전점검 시스템 안정화를 위한 점검이 진행됩니다.\n점검 시간 중 일부 기능 이용이 제한될 수 있습니다.' },
      { id: 'notice-3', category: '공지', title: '정기안전점검 시스템 점검안내', summary: '시스템 점검으로 인해 서비스가 일시 중단됩니다.', date: '2026-01-28 09:10', views: 135, comments: 1, body: '정기안전점검 시스템 안정화를 위한 점검이 진행됩니다.\n점검 시간 중 일부 기능 이용이 제한될 수 있습니다.' },
      { id: 'notice-4', category: '공지', title: '정기안전점검 시스템 점검안내', summary: '시스템 점검으로 인해 서비스가 일시 중단됩니다.', date: '2026-01-28 09:10', views: 135, comments: 1, body: '정기안전점검 시스템 안정화를 위한 점검이 진행됩니다.\n점검 시간 중 일부 기능 이용이 제한될 수 있습니다.' }
    ];

    var list = document.getElementById('noticeList');
    var category = document.getElementById('noticeCategory');
    var keyword = document.getElementById('noticeKeyword');

    function openNoticeDetail(id) {
      var item = notices.find(function (notice) { return notice.id === id; }) || notices[0];
      document.getElementById('noticeDetailCategory').textContent = item.category;
      document.getElementById('noticeDetailTitle').textContent = item.title;
      document.getElementById('noticeDetailDate').textContent = item.date;
      document.getElementById('noticeDetailViews').textContent = item.views;
      document.getElementById('noticeDetailBody').textContent = item.body;
      showPhone('phoneNoticeDetail');
    }
    window.openNoticeDetail = openNoticeDetail;

    function renderNotices() {
      if (!list) return;
      var q = (keyword?.value || '').trim();
      var selected = category?.value || '';
      var items = notices.filter(function (item) {
        if (selected && item.category !== selected) return false;
        if (!q) return true;
        return (item.title + ' ' + item.summary + ' ' + item.body).indexOf(q) !== -1;
      });
      list.innerHTML = items.map(function (item) {
        return '<article class="notice-list-card" onclick="openNoticeDetail(\'' + item.id + '\')">' +
          '<div class="notice-list-top">' +
            '<span class="notice-list-badge">' + item.category + '</span>' +
            '<time>' + item.date + '</time>' +
          '</div>' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + item.summary + '</p>' +
          '<div class="notice-list-bottom">' +
            '<span class="notice-meta"><img class="notice-meta-ico" src="assets/main/notice-views.svg" alt="" width="9" height="12"><span class="notice-meta__lbl">조회수</span> <b>' + item.views + '</b></span>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    document.getElementById('noticeSearch')?.addEventListener('click', renderNotices);
    category?.addEventListener('change', renderNotices);
    keyword?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); renderNotices(); }
    });
    renderNotices();
  })();

  /* ── 점검현황 ──────────────────────────── */
  (function () {
    var select = document.getElementById('statusAgencySelect');
    var panel = document.getElementById('statusList');
    if (!select || !panel) return;

    var rows = [
      { agency: '목포지방해양수산청', loc: '목포항 › 목포항', name: 'A계류시설', kind: '기타', type: '계류', badge: '제출', badgeClass: 'insp-badge--submit', status: 'done' },
      { agency: '목포지방해양수산청', loc: '목포항 › 목포항', name: '파제제', kind: '기타', type: '외곽', badge: '미제출', badgeClass: 'insp-badge--unsubmit', status: 'progress' }
    ];

    try {
      var savedRows = (window.pomsInspectStore && window.pomsInspectStore.read()) || {};
      var BADGE2 = { '제출': 'insp-badge--submit', '임시저장': 'insp-badge--draft', '미제출': 'insp-badge--unsubmit' };
      function demoPajeSubmit(slot) {
        return !!(slot && slot.status === '제출' && slot.inspector === '이책임' && String(slot.at || '').indexOf('2026-06-18') === 0);
      }
      rows.forEach(function (row) {
        var r = savedRows[row.name];
        var first = r && r.periods && r.periods['상반기'];
        var st = (first && first.status) || (r && r.status) || row.badge;
        if (row.name === '파제제') {
          if (first && first.status === '임시저장') st = '임시저장';
          else if (first && first.status === '제출' && !demoPajeSubmit(first)) st = '제출';
          else st = '미제출';
        } else if (row.name === 'A계류시설' && st !== '임시저장') {
          st = first && first.status ? first.status : '제출';
        }
        if (st) {
          row.badge = st;
          row.badgeClass = BADGE2[st] || 'insp-badge--unsubmit';
          row.status = st === '제출' ? 'done' : 'progress';
        }
      });
    } catch (e) {}
    function renderRows() {
      var selected = select.value;
      var items = rows.filter(function (row) { return row.agency === selected; });
      if (!items.length) {
        panel.innerHTML = '<div class="insp-empty">선택한 관리주체의 정기안전점검 목록이 없습니다.</div>';
        return;
      }
      panel.innerHTML = items.map(function (item) {
        return '<article class="status-card" onclick="gotoInspectFacility(' + JSON.stringify(item.name) + ')">' +
          '<div class="status-card__top">' +
            '<span class="status-card__loc">' + item.loc + '</span>' +
            '<span class="status-badge ' + item.badgeClass + '">' + item.badge + '</span>' +
          '</div>' +
          '<div class="status-card__name">' + item.name + '</div>' +
          '<div class="status-card__tags">' +
            '<span class="status-tag status-tag--kind">' + item.kind + '</span>' +
            '<span class="status-tag status-tag--type">' + item.type + '</span>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    select.addEventListener('change', renderRows);
    renderRows();
  })();

  /* 초기 화면 결정: 뒤로가기로 돌아온 기록, 외부 페이지에서 지정한 메뉴 순서로 복원 */
  function phoneFromLocation() {
    var statePhone = history.state && history.state.pomsPhone;
    if (statePhone && document.getElementById(statePhone)) return statePhone;
    var match = location.hash.match(/screen=([^&]+)/);
    if (!match) return '';
    try {
      var fromHash = decodeURIComponent(match[1]);
      if (document.getElementById(fromHash)) return fromHash;
    } catch (e) { /* ignore */ }
    return '';
  }

  if (pendingReturnPhone === 'phoneDetail' && pendingReturnFacility) {
    detailReturnPhoneId = 'phoneInspect';
    openFacilityInfoByName(pendingReturnFacility);
  } else if (pendingReturnPhone && document.getElementById(pendingReturnPhone)) {
    showPhone(pendingReturnPhone);
  } else {
    showPhone(phoneFromLocation() || 'phoneHome');
  }
