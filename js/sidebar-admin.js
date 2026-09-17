/**
 * POMS 관리자 상단 헤더 + GNB + 좌측 LNB + 뒤로/홈 (Figma 250:3327)
 * 사용: PomsSidebarAdmin.mount('#sidebar-root', { active: 'system-users' });
 * #sidebar-root가 있으면 페이지 경로로 자동 mount 됩니다.
 */
const PomsSidebarAdmin = (() => {
  const LOGO_EMBLEM = 'assets/service/main/figma/logo-emblem-light.svg';
  const LOGO_TEXT = 'assets/service/main/figma/logo-text-light.svg';
  const LOGOUT = 'assets/service/main/figma/icon-logout-dark.svg';
  const BACK_ICON = 'assets/main/facility-statistics/figma188/icon-angle-down-clean.svg';
  const HOME_ICON = 'assets/main/facility-statistics/figma188/icon-home-clean.svg';
  const ADMIN_HOME = 'admin-users.html';

  const MENU = [
    {
      id: 'user-log-manage',
      label: '사용자 관리',
      href: 'admin-users.html',
      children: [
        { id: 'system-users', label: '사용자 관리', href: 'admin-users.html' },
        { id: 'user-account', label: '사용자 계정 관리', href: 'user-account.html' },
      ],
    },
    {
      id: 'system',
      label: '시스템 관리',
      href: 'facility-management.html',
      children: [
        { id: 'system-facility', label: '시설물 관리', href: 'facility-management.html' },
        { id: 'maintenance-plan-manage', label: '유지관리계획 관리', href: 'maintenance-plan-manage.html' },
        { id: 'system-mooring', label: '기타 시설물 성능평가 관리', href: 'mooring-facility-management.html' },
        { id: 'system-location', label: '시설물 위치 현황 관리', href: 'facility-location-status.html' },
        { id: 'system-drone', label: '드론 영상관리', href: 'drone-video-management.html' },
        { id: 'system-engineer', label: '책임기술자 관리', href: 'responsible-engineer.html' },
      ],
    },
    {
      id: 'approval-manage',
      label: '승인/반려 관리',
      href: 'safety-report-approval.html',
      children: [
        { id: 'approval-report', label: '안전점검보고서 승인/반려', labelHtml: '안전점검보고서<br>승인/반려', href: 'safety-report-approval.html' },
        { id: 'approval-data', label: '자료처리 승인/반려', href: 'data-process-approval.html' },
        { id: 'approval-facility-change', label: '시설물 변경요청 관리', href: 'facility-change-approval.html' },
      ],
    },
    {
      id: 'vendor-manage',
      label: '용역사 관리',
      href: 'inspection-agency.html',
      children: [
        { id: 'vendor-agency', label: '안전점검기관', href: 'inspection-agency.html' },
        { id: 'vendor-inspection-result', label: '점검결과 등록관리', href: 'inspection-result-manage.html' },
        // { id: 'vendor-report-download', label: '용역사 보고서 다운로드 신청 관리', labelHtml: '용역사 보고서<br>다운로드 신청 관리', href: 'vendor-report-download.html' },
        { id: 'vendor-report-history', label: '보고서 제출이력', href: 'report-submit-history.html' },
      ],
    },
    {
      id: 'sms-manage',
      label: 'SMS 관리',
      href: 'sms-send.html',
      children: [
        { id: 'sms-send', label: '문자전송', href: 'sms-send.html' },
        { id: 'sms-reserve', label: '문자예약', href: 'sms-reserve.html' },
        { id: 'sms-contacts', label: '연락처관리', href: 'sms-contacts.html' },
        { id: 'sms-history', label: '발송이력', href: 'sms-history.html' },
      ],
    },
    {
      id: 'link-data',
      label: '연계 데이터 관리',
      href: 'fms-history.html',
      children: [{ id: 'link-fms', label: 'FMS 연계이력', href: 'fms-history.html' }],
    },
    {
      id: 'board',
      label: '게시판 관리',
      href: 'admin-notices.html',
      children: [
        { id: 'board-notice', label: '공지사항', href: 'admin-notices.html' },
        { id: 'board-schedule', label: '일정관리', href: 'schedule-manage.html' },
        { id: 'board-popup', label: '팝업관리', href: 'popup-manage.html' },
        { id: 'board', label: '게시판', href: 'board-manage.html'}
      ],
    },
  ];

  function menuHref(item) {
    return item.href || item.children?.[0]?.href || '#';
  }

  function isMenuActive(item, activeId) {
    if (item.id === activeId) return true;
    return Boolean(item.children?.some((child) => child.id === activeId));
  }

  /* [2026 GNB MEGA] 상단 메뉴 = 라벨 바 + 하단 전체 드롭다운(메가메뉴) */
  function renderNav(activeId) {
    return MENU.map((item) => {
      const active = isMenuActive(item, activeId);
      return `<div class="admin-gnb__item" data-menu="${item.id}"><a href="${menuHref(item)}" class="admin-chrome__link${active ? ' is-active' : ''}" data-menu="${item.id}"${active ? ' aria-current="page"' : ''}>${item.label}</a></div>`;
    }).join('');
  }

  function renderMega(activeId) {
    const resolved = resolveActiveId(activeId);
    const cols = MENU.map((item) => {
      const children = item.children?.length ? item.children : [{ id: item.id, label: item.label, href: menuHref(item) }];
      const links = children
        .map((child) => {
          const on = child.id === resolved;
          const wrap = Boolean(child.labelHtml);
          const text = child.labelHtml || child.label;
          return `<li class="admin-gnb__sub-item"><a href="${child.href}" class="admin-gnb__sub-link${on ? ' is-active' : ''}${wrap ? ' admin-gnb__sub-link--wrap' : ''}"${on ? ' aria-current="page"' : ''}>${text}</a></li>`;
        })
        .join('');
      return `<div class="admin-gnb__col" data-menu="${item.id}"><ul class="admin-gnb__sub">${links}</ul></div>`;
    }).join('');
    return `
          <div class="admin-gnb__mega" id="adminGnbMega">
            <div class="admin-chrome__inner admin-gnb__mega-inner">${cols}</div>
          </div>`;
  }

  function getUserDisplay() {
    if (typeof PomsAuth !== 'undefined') {
      return PomsAuth.getSidebarUser('한국항만협회 사용자');
    }
    return { name: '한국항만협회 사용자', avatar: '한' };
  }

  function render(activeId = 'system-users') {
    const user = getUserDisplay();
    return `
      <div class="admin-chrome" aria-label="관리자 상단 메뉴">
        <header class="admin-chrome__header">
          <div class="admin-chrome__inner">
            <a href="index.html" class="admin-chrome__brand" aria-label="항만시설물 유지관리시스템">
              <img class="admin-chrome__logo-emblem" src="${LOGO_EMBLEM}" alt="" width="34" height="34">
              <img class="admin-chrome__logo-text" src="${LOGO_TEXT}" alt="항만시설물 유지관리시스템" width="192" height="16">
            </a>
            <div class="admin-chrome__tools">
              <div class="admin-chrome__user">
                <span class="admin-chrome__avatar" aria-hidden="true">${user.avatar}</span>
                <span class="admin-chrome__user-name">${user.name}</span>
                <button type="button" class="admin-chrome__approval" id="apxBellBtn" aria-label="결재대기 목록 열기" aria-haspopup="dialog">
                  <span class="admin-chrome__approval-label">결재대기</span>
                  <span class="admin-chrome__approval-count" id="apxBellLabel">12</span>
                </button>
              </div>
              <a href="index.html?logout=1" class="admin-chrome__logout" aria-label="로그아웃">
                <img src="${LOGOUT}" alt="" width="18" height="18">
              </a>
            </div>
          </div>
        </header>
        <div class="admin-gnb-wrap" id="adminGnbWrap">
          <nav class="admin-chrome__nav admin-gnb" aria-label="관리자 메뉴">
            <div class="admin-chrome__inner admin-chrome__nav-inner admin-gnb__inner">
              ${renderNav(activeId)}
            </div>
          </nav>
          ${renderMega(activeId)}
        </div>
      </div>`;
  }

  function bindEvents() {
    /* [2026 GNB MEGA] hover / focus 시 전체 하위메뉴 패널 오픈 */
    const wrap = document.getElementById('adminGnbWrap');
    if (!wrap) return;
    let closeTimer = null;

    const open = () => {
      clearTimeout(closeTimer);
      wrap.classList.add('is-open');
    };
    const close = (delay = 0) => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => wrap.classList.remove('is-open'), delay);
    };

    wrap.addEventListener('mouseenter', open);
    wrap.addEventListener('mouseleave', () => close(120));
    wrap.addEventListener('focusin', open);
    wrap.addEventListener('focusout', (e) => {
      if (!wrap.contains(e.relatedTarget)) close(0);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close(0);
    });
  }

  /* ==================== 결재대기 드로어 (Figma 23:36027) ==================== */

  const APPROVAL_GROUPS = [
    {
      label: '승인/반려 관리',
      tabs: [
        { id: 'report', label: '안전점검보고서', page: 'safety-report-approval.html' },
        { id: 'data', label: '자료처리', page: 'data-process-approval.html' },
        { id: 'facility-change', label: '시설물 변경요청', page: 'facility-change-approval.html' },
      ],
    },
    {
      label: '용역사 관리',
      tabs: [
        { id: 'agency', label: '안전점검기관', page: 'inspection-agency.html' },
        { id: 'facility-apply', label: '시설물신청관리', page: 'inspection-result-manage.html' },
        { id: 'report-reg', label: '보고서등록관리', page: 'inspection-result-manage.html?tab=report' },
      ],
    },
  ];

  const APPROVAL_INBOX = {
    report: [
      { date: '2026-07-06', time: '14:20', facility: '광양항 배수갑문 및 배수펌프장', title: '정기안전점검(상반기) 결과보고서', org: '(주)청음', name: '김용역', status: 'writing' },
      { date: '2026-07-05', time: '10:02', facility: '포항항 물양장(1)', title: '정기안전점검(하반기) 결과보고서', org: '(주)청음', name: '박점검', status: 'writing' },
      { date: '2026-07-03', time: '15:33', facility: '부산항 북내항 남방파제', title: '정밀안전점검 결과보고서', org: '해양안전기술(주)', name: '이기술', status: 'writing' },
    ],
    data: [
      { date: '2026-07-06', time: '09:15', facility: '자료처리', title: '2026년 상반기 점검자료 일괄 업로드 승인 요청', org: '한국항만협회', name: '최담당', status: 'writing' },
      { date: '2026-07-04', time: '13:30', facility: '자료처리', title: '시설물 사진대지 자료 정정 요청', org: '포항지방해양수산청', name: '정주무', status: 'writing' },
    ],
    'facility-change': [
      { date: '2026-07-06', time: '09:41', facility: '구룡포항 호안', title: '관리주체변경이관', org: '경상북도', name: '홍길동', status: 'writing' },
      { date: '2026-07-06', time: '09:41', facility: '광양항 야적장', title: '시설물 일반정보 변경', org: '여수광양항만공사', name: '박기사', status: 'writing' },
    ],
    agency: [
      { date: '2026-07-05', time: '11:28', facility: '안전점검기관', title: '신규 등록 — (주)해양구조진단', org: '(주)해양구조진단', name: '오소장', status: 'writing' },
    ],
    'facility-apply': [
      { date: '2026-07-04', time: '15:07', facility: '울릉항 도동 연안여객터미널 외 2건', title: '대상시설물 신청', org: '(주)청음', name: '김용역', status: 'writing' },
    ],
    'report-reg': [
      { date: '2026-07-03', time: '10:52', facility: '묵호항 여객터미널(신)', title: '점검보고서 등록 승인 요청', org: '해양안전기술(주)', name: '박기술', status: 'writing' },
    ],
  };

  const APX_STATUS_LABEL = { writing: '작성중', requested: '요청중', approved: '승인', rejected: '반려' };
  const APX_CLOSE_ICON = 'assets/facility-change-approval/icon-close.png';

  let apxActiveTab = 'report';

  function apxPendingCount(tabId) {
    return (APPROVAL_INBOX[tabId] || []).filter((item) => item.status === 'writing' || item.status === 'requested').length;
  }

  function apxGroupCount(group) {
    return group.tabs.reduce((sum, tab) => sum + apxPendingCount(tab.id), 0);
  }

  function apxTotalPending() {
    return Object.keys(APPROVAL_INBOX).reduce((sum, key) => sum + apxPendingCount(key), 0);
  }

  function apxActiveTabMeta() {
    for (const group of APPROVAL_GROUPS) {
      const tab = group.tabs.find((t) => t.id === apxActiveTab);
      if (tab) return tab;
    }
    return null;
  }

  function apxChunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  function apxInjectStyle() {
    if (document.getElementById('apx-style')) return;
    const style = document.createElement('style');
    style.id = 'apx-style';
    style.textContent = `
      body:has(.apx-modal.is-open) #sidebar-root{z-index:1000}
      .apx-modal{position:fixed;inset:0;z-index:3000;font-family:"Noto Sans KR",system-ui,sans-serif;pointer-events:none}
      .apx-modal[hidden]{display:none!important}
      .apx-modal.is-open{pointer-events:auto}
      .apx-modal__backdrop{position:absolute;inset:0;background:rgba(0,0,0,.2);opacity:0;transition:opacity .22s ease}
      .apx-modal.is-open .apx-modal__backdrop{opacity:1}
      .apx-modal__panel{position:absolute;top:0;right:0;width:680px;max-width:100vw;height:min(980px,100vh);max-height:100vh;box-sizing:border-box;display:flex;flex-direction:column;background:#fff;border-radius:14px 0 0 14px;box-shadow:0 8px 16px rgba(0,0,0,.25),4px 4px 5px rgba(0,0,0,.15),4px 4px 7px rgba(0,0,0,.04);overflow:hidden;transform:translateX(100%);opacity:0;transition:opacity .22s ease,transform .22s ease}
      .apx-modal.is-open .apx-modal__panel{transform:translateX(0);opacity:1}
      .apx-modal__inner{display:flex;flex-direction:column;gap:24px;width:100%;min-height:0;flex:1 1 auto;padding-bottom:30px;box-sizing:border-box;overflow:auto}
      .apx-modal__head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;width:100%;flex-shrink:0;padding:30px 24px 20px;border-bottom:1px solid #ededed;border-radius:14px 0 0 0;box-sizing:border-box}
      .apx-modal__title{margin:0;font-size:24px;font-weight:600;letter-spacing:-.48px;color:#111;line-height:1.2}
      .apx-modal__close{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:1px solid rgba(255,255,255,.1);border-radius:999px;background:#dadae2;cursor:pointer;flex-shrink:0}
      .apx-modal__close img{display:block;width:16px;height:16px;object-fit:contain}
      .apx-modal__close:hover{background:#cbccd6}
      .apx-result{display:flex;flex-direction:column;gap:24px;width:100%;min-height:0;flex:1 1 auto;padding:0 24px;box-sizing:border-box}
      .apx-result__head{display:flex;align-items:center;gap:14px;width:100%}
      .apx-result__row{display:flex;align-items:flex-end;gap:6px;flex-shrink:0;white-space:nowrap}
      .apx-result__label{margin:0;font-size:16px;font-weight:600;letter-spacing:-.32px;line-height:1.2;color:#111}
      .apx-result__meta{margin:0;font-size:14px;font-weight:400;letter-spacing:-.28px;line-height:1.2;color:#6c788b}
      .apx-result__meta strong{font-weight:600;color:#1c6fff}
      .apx-result__hint{margin:0;flex:1 1 auto;min-width:0;font-size:14px;font-weight:400;line-height:1;color:#6c788b;text-align:right}
      .apx-cats{display:flex;flex-direction:column;gap:24px;width:100%}
      .apx-cat-group{display:flex;flex-direction:column;gap:10px;width:100%}
      .apx-cat-parent{display:flex;align-items:center;justify-content:space-between;width:100%;height:48px;padding:0 20px;box-sizing:border-box;border:1px solid #dadae2;border-radius:10px;background:#fff;color:#111;font-size:16px;font-weight:600;font-family:inherit;line-height:1.2;cursor:default;text-align:left}
      .apx-cat-parent__count{display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:auto;padding:4px 10px;box-sizing:border-box;border-radius:100px;background:#f6f9ff;color:#1c6fff;font-size:12px;font-weight:500;line-height:1.2;text-align:center}
      .apx-cat-row{display:flex;flex-wrap:nowrap;gap:10px;width:100%}
      .apx-tab{display:flex;align-items:center;justify-content:space-between;flex:1 1 0;min-width:0;height:48px;padding:0 14px;box-sizing:border-box;border:0;border-radius:10px;background:rgba(28,111,255,.04);color:#6c788b;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;white-space:nowrap;gap:6px}
      .apx-tab:hover{background:rgba(28,111,255,.08)}
      .apx-tab.on{background:linear-gradient(90deg,#1c6fff 0%,#114399 100%);color:#fff}
      .apx-tab__label{overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto;text-align:left}
      .apx-tab__count{display:inline-flex;align-items:center;justify-content:center;min-width:30px;padding:4px 10px;box-sizing:border-box;border-radius:100px;background:#fff;color:#6c788b;font-size:12px;font-weight:500;line-height:1.2;text-align:center;flex-shrink:0}
      .apx-tab.on .apx-tab__count{color:#1c6fff}
      .apx-divider{width:100%;height:0;border:0;border-top:1px solid #dadae2;margin:0}
      .apx-detail{display:flex;flex-direction:column;gap:14px;width:100%;min-height:0;flex:1 1 auto}
      .apx-detail__head{display:flex;align-items:flex-end;gap:6px;flex-wrap:wrap}
      .apx-detail__title{margin:0;font-size:16px;font-weight:600;letter-spacing:-.32px;line-height:1.2;color:#111}
      .apx-detail__meta{margin:0;font-size:14px;font-weight:400;letter-spacing:-.28px;line-height:1.2;color:#6c788b}
      .apx-detail__meta strong{font-weight:600;color:#1c6fff}
      .apx-table-wrap{width:100%;min-height:0;overflow:auto;flex:1 1 auto}
      .apx-table{width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed}
      .apx-table thead th{height:48px;padding:12px 10px 10px;box-sizing:border-box;background:rgba(28,111,255,.1);color:#111;font-size:14px;font-weight:500;line-height:normal;text-align:center;white-space:nowrap;border:1px solid #dadae2}
      .apx-table thead th:first-child{width:150px;border-radius:10px 0 0 0}
      .apx-table thead th.apx-th-content{text-align:center}
      .apx-table thead th:nth-child(3){width:100px}
      .apx-table thead th:last-child{width:100px;border-radius:0 10px 0 0}
      .apx-table tbody td{height:44px;padding:10px;box-sizing:border-box;border:1px solid #dadae2;vertical-align:middle;background:#fff;font-size:14px;font-weight:400;color:#333;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .apx-table tbody tr:last-child td:first-child{border-radius:0 0 0 10px}
      .apx-table tbody tr:last-child td:last-child{border-radius:0 0 10px 0}
      .apx-table tbody tr.apx-row{cursor:pointer}
      .apx-table tbody tr.apx-row:hover td{background:#f5f8fc}
      .apx-td-date{width:150px}
      .apx-td-content{text-align:left!important;padding-left:20px!important;padding-right:20px!important}
      .apx-td-content__facility{color:#1c6fff}
      .apx-td-requester{width:100px}
      .apx-td-status{width:100px}
      .apx-status{display:inline-flex;align-items:center;justify-content:center;min-width:50px;padding:4px 10px;border-radius:4px;background:rgba(239,201,75,.15);color:#d4a50a;font-size:12px;font-weight:500;line-height:1.2;white-space:nowrap;box-sizing:border-box}
      .apx-status.is-requested{background:rgba(239,201,75,.15);color:#d4a50a}
      .apx-status.is-approved{background:rgba(28,111,255,.04);color:#1c6fff}
      .apx-status.is-rejected{background:rgba(230,0,45,.04);color:#e6002d}
      .apx-empty{padding:40px 12px;text-align:center;color:#6c788b;font-size:14px;border:1px solid #dadae2;border-top:0;border-radius:0 0 10px 10px}
      @media (max-width:720px){
        .apx-modal__panel{width:100%;border-radius:0;height:100vh}
        .apx-result__head{flex-wrap:wrap}
        .apx-result__hint{text-align:left}
        .apx-cat-row{flex-wrap:nowrap}
        .apx-tab{flex:1 1 0;min-width:0;padding:0 10px}
      }
    `;
    document.head.appendChild(style);
  }

  function apxEnsureModal() {
    if (document.getElementById('apxModal')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="apx-modal" id="apxModal" hidden role="dialog" aria-modal="true" aria-labelledby="apxModalTitle">
        <div class="apx-modal__backdrop" data-apx-close aria-hidden="true"></div>
        <div class="apx-modal__panel">
          <div class="apx-modal__inner">
            <header class="apx-modal__head">
              <h3 class="apx-modal__title" id="apxModalTitle">결재대기 목록</h3>
              <button type="button" class="apx-modal__close" data-apx-close aria-label="닫기">
                <img src="${APX_CLOSE_ICON}" alt="" width="16" height="16">
              </button>
            </header>
            <div class="apx-result">
              <div class="apx-result__head">
                <div class="apx-result__row">
                  <p class="apx-result__label">조회결과</p>
                  <p class="apx-result__meta">총 <strong id="apxModalTotal">0</strong>건</p>
                </div>
                <p class="apx-result__hint">※ 카테고리를 클릭하면 해당 건의 상세를 확인할 수 있습니다.</p>
              </div>
              <div class="apx-cats" id="apxTabs"></div>
              <hr class="apx-divider" aria-hidden="true">
              <div class="apx-detail">
                <div class="apx-detail__head">
                  <p class="apx-detail__title" id="apxDetailTitle">안전점검보고서</p>
                  <p class="apx-detail__meta">총 <strong id="apxDetailCount">0</strong>건</p>
                </div>
                <div class="apx-table-wrap">
                  <table class="apx-table">
                    <thead>
                      <tr>
                        <th scope="col">요청일시</th>
                        <th scope="col" class="apx-th-content">요청내용</th>
                        <th scope="col">요청자</th>
                        <th scope="col">상태</th>
                      </tr>
                    </thead>
                    <tbody id="apxListBody"></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap.firstElementChild);

    document.querySelectorAll('[data-apx-close]').forEach((el) => {
      el.addEventListener('click', apxClose);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') apxClose();
    });
  }

  function apxRenderTabs() {
    const tabsEl = document.getElementById('apxTabs');
    if (!tabsEl) return;
    tabsEl.innerHTML = APPROVAL_GROUPS.map((group) => {
      const groupCount = apxGroupCount(group);
      const rows = apxChunk(group.tabs, group.tabs.length > 3 ? 2 : 3);
      return `
        <div class="apx-cat-group">
          <div class="apx-cat-parent">
            <span>${group.label}</span>
            <span class="apx-cat-parent__count">${groupCount}</span>
          </div>
          ${rows.map((row) => `
            <div class="apx-cat-row">
              ${row.map((tab) => {
                const count = apxPendingCount(tab.id);
                return `<button type="button" class="apx-tab${tab.id === apxActiveTab ? ' on' : ''}" data-apx-tab="${tab.id}">
                  <span class="apx-tab__label">${tab.label}</span>
                  <span class="apx-tab__count">${count}</span>
                </button>`;
              }).join('')}
            </div>
          `).join('')}
        </div>
      `;
    }).join('');

    tabsEl.querySelectorAll('[data-apx-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        apxActiveTab = btn.dataset.apxTab;
        apxRenderTabs();
        apxRenderList();
      });
    });
  }

  function apxRenderList() {
    const body = document.getElementById('apxListBody');
    const detailTitle = document.getElementById('apxDetailTitle');
    const detailCount = document.getElementById('apxDetailCount');
    if (!body) return;

    const meta = apxActiveTabMeta();
    const items = APPROVAL_INBOX[apxActiveTab] || [];
    if (detailTitle) detailTitle.textContent = meta ? meta.label : '';
    if (detailCount) detailCount.textContent = String(items.length);

    if (!items.length) {
      body.innerHTML = '<tr><td colspan="4" class="apx-empty">결재대기 항목이 없습니다.</td></tr>';
      return;
    }

    body.innerHTML = items.map((item) => {
      const statusCls = item.status === 'approved'
        ? ' is-approved'
        : item.status === 'rejected'
          ? ' is-rejected'
          : item.status === 'requested'
            ? ' is-requested'
            : '';
      return `
      <tr class="apx-row" title="클릭하면 해당 관리 페이지로 이동합니다.">
        <td class="apx-td-date">${item.date} ${item.time}</td>
        <td class="apx-td-content">
          <span class="apx-td-content__facility">[${item.facility}]</span> ${item.title}
        </td>
        <td class="apx-td-requester">${item.name}</td>
        <td class="apx-td-status">
          <span class="apx-status${statusCls}">${APX_STATUS_LABEL[item.status] || ''}</span>
        </td>
      </tr>`;
    }).join('');

    const page = meta ? meta.page : null;
    body.querySelectorAll('tr.apx-row').forEach((tr) => {
      tr.addEventListener('click', () => {
        if (page) window.location.href = page;
      });
    });
  }

  function apxUpdateCounts() {
    const total = apxTotalPending();
    const bellLabel = document.getElementById('apxBellLabel');
    if (bellLabel) bellLabel.textContent = String(total);
    const modalTotal = document.getElementById('apxModalTotal');
    if (modalTotal) modalTotal.textContent = String(total);
  }

  function apxRefresh() {
    apxRenderTabs();
    apxRenderList();
    apxUpdateCounts();
  }

  function apxOpen() {
    apxEnsureModal();
    apxRefresh();
    const modal = document.getElementById('apxModal');
    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
    });
  }

  function apxClose() {
    const modal = document.getElementById('apxModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    window.setTimeout(() => {
      if (!modal.classList.contains('is-open')) modal.hidden = true;
    }, 220);
  }

  function initApprovalInbox(root) {
    apxInjectStyle();
    apxUpdateCounts();
    root.querySelector('#apxBellBtn')?.addEventListener('click', apxOpen);
  }

  function ensureTopnavStyles() {
    if (document.querySelector('link[data-admin-topnav]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/admin-topnav.css';
    link.dataset.adminTopnav = '1';
    document.head.appendChild(link);
  }

  function ensureFlatStyles() {
    if (document.querySelector('link[data-admin-flat]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/admin-flat.css';
    link.dataset.adminFlat = '1';
    document.head.appendChild(link);
  }

  function ensurePretendard() {
    if (document.querySelector('link[data-admin-pretendard]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css';
    link.dataset.adminPretendard = '1';
    document.head.appendChild(link);
  }

  const ACTIVE_ALIASES = {
    'vendor-application': 'vendor-inspection-result',
    'vendor-report-reg': 'vendor-inspection-result',
    'archive-maintenance': 'maintenance-plan-manage',
  };

  const FILE_ALIASES = {
    'admin-users.html': 'system-users',
    'admin-user-detail.html': 'system-users',
    'user-account.html': 'user-account',
    'facility-management.html': 'system-facility',
    'facility-management-detail.html': 'system-facility',
    'facility-add.html': 'system-facility',
    'maintenance-plan-manage.html': 'maintenance-plan-manage',
    'maintenance-plan-manage-detail.html': 'maintenance-plan-manage',
    'maintenance-plan.html': 'maintenance-plan-manage',
    'maintenance-plan-detail.html': 'maintenance-plan-manage',
    'mooring-facility-management.html': 'system-mooring',
    'facility-location-status.html': 'system-location',
    'drone-video-management.html': 'system-drone',
    'drone-video-detail.html': 'system-drone',
    'responsible-engineer.html': 'system-engineer',
    'safety-report-approval.html': 'approval-report',
    'data-process-approval.html': 'approval-data',
    'facility-change-approval.html': 'approval-facility-change',
    'facility-change-approval-detail.html': 'approval-facility-change',
    'inspection-agency.html': 'vendor-agency',
    'inspection-result-manage.html': 'vendor-inspection-result',
    'vendor-application.html': 'vendor-inspection-result',
    'vendor-application-detail.html': 'vendor-inspection-result',
    'report-registration-manage.html': 'vendor-inspection-result',
    'report-registration-detail.html': 'vendor-inspection-result',
    'vendor-report-download.html': 'vendor-report-download',
    'report-submit-history.html': 'vendor-report-history',
    'report-submit-history-detail.html': 'vendor-report-history',
    'sms-send.html': 'sms-send',
    'sms-contact-picker.html': 'sms-send',
    'sms-reserve.html': 'sms-reserve',
    'sms-contacts.html': 'sms-contacts',
    'sms-history.html': 'sms-history',
    'fms-history.html': 'link-fms',
    'fms-history-detail.html': 'link-fms',
    'admin-notices.html': 'board-notice',
    'admin-notice-detail.html': 'board-notice',
    'admin-notice-edit.html': 'board-notice',
    'schedule-manage.html': 'board-schedule',
    'popup-manage.html': 'board-popup',
    'popup-detail.html': 'board-popup',
    'board-manage.html': 'board',
    'board-manage-plan.html': 'board',
    'board-manage-detail.html': 'board',
    'board-manage-edit.html': 'board',
  };

  /** 메뉴 목록 href와 다른 파일이어도 목록(뒤로가기 없음)으로 취급 */
  const LIST_EQUIVALENT_FILES = {
    'board-manage-plan.html': 'board-manage.html',
  };

  function currentFile() {
    return decodeURIComponent((location.pathname.split('/').pop() || '').toLowerCase());
  }

  function inferActiveId() {
    const file = currentFile();
    if (FILE_ALIASES[file]) return FILE_ALIASES[file];

    for (const item of MENU) {
      if ((item.href || '').toLowerCase() === file) return item.id;
      const child = item.children?.find((c) => (c.href || '').toLowerCase() === file);
      if (child) return child.id;
    }
    return 'system-users';
  }

  function resolveActiveId(activeId) {
    return ACTIVE_ALIASES[activeId] || activeId;
  }

  function findMenuGroup(activeId) {
    const resolved = resolveActiveId(activeId);
    return MENU.find((item) => isMenuActive(item, resolved)) || null;
  }

  function ensureFacilitySearchCss() {
    if (document.querySelector('link[href*="css/facility-search.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/facility-search.css';
    link.dataset.adminFacilitySearch = '1';
    document.head.appendChild(link);
  }

  function removeHorizontalSubTabs(root) {
    root
      .querySelectorAll('nav.admin-sub-tabs, nav.ua-sub-tabs, .fmd-sub-tabs, .fm-sub-tabs, .loc-sub-tabs')
      .forEach((el) => {
        if (el.closest('.fs-lnb')) return;
        el.remove();
      });
  }

  function renderPageLnb(group, activeId) {
    if (!group?.children?.length) return '';
    const resolved = resolveActiveId(activeId);
    const current = currentFile();
    const items = group.children
      .map((child) => {
        const hrefFile = (child.href || '').split('/').pop().toLowerCase();
        const active =
          child.id === resolved ||
          hrefFile === current ||
          FILE_ALIASES[current] === child.id;
        return `<a href="${child.href}" class="fs-lnb__item${active ? ' is-active' : ''}"${active ? ' aria-current="page"' : ''}>
            <span>${child.label}</span>
            <span class="fs-lnb__chevron" aria-hidden="true">›</span>
          </a>`;
      })
      .join('');
    return `<aside class="fs-lnb" aria-label="${group.label} 메뉴" data-poms-admin-lnb="1">
        <div class="fs-lnb__title">
          <h2 class="fs-lnb__title-text">${group.label}</h2>
        </div>
        <nav class="fs-lnb__nav" data-admin-sub-tabs="1" aria-label="${group.label} 하위 메뉴">
          ${items}
        </nav>
      </aside>`;
  }

  function syncExistingLnb(group, activeId) {
    const lnb = document.querySelector('.fs-lnb');
    if (!lnb || !group) return;
    const resolved = resolveActiveId(activeId);
    const current = currentFile();
    const title = lnb.querySelector('.fs-lnb__title-text');
    if (title) title.textContent = group.label;
    lnb.setAttribute('aria-label', `${group.label} 메뉴`);

    const nav = lnb.querySelector('.fs-lnb__nav');
    if (nav) {
      nav.innerHTML = group.children
        .map((child) => {
          const hrefFile = (child.href || '').split('/').pop().toLowerCase();
          const active =
            child.id === resolved ||
            hrefFile === current ||
            FILE_ALIASES[current] === child.id;
          return `<a href="${child.href}" class="fs-lnb__item${active ? ' is-active' : ''}"${active ? ' aria-current="page"' : ''}>
            <span>${child.label}</span>
            <span class="fs-lnb__chevron" aria-hidden="true">›</span>
          </a>`;
        })
        .join('');
      nav.setAttribute('data-admin-sub-tabs', '1');
      nav.setAttribute('aria-label', `${group.label} 하위 메뉴`);
    }
  }

  /** 페이지에 LNB가 없으면 main 콘텐츠를 fs-layout으로 감싸 주입 */
  function ensurePageLnb(activeId) {
    const group = findMenuGroup(activeId);
    if (!group?.children?.length) return;

    document.body.classList.add('facility-search-page');
    ensureFacilitySearchCss();

    const main = document.querySelector('main.main-content');
    if (!main) return;

    removeHorizontalSubTabs(main);

    if (document.querySelector('.fs-lnb')) {
      syncExistingLnb(group, activeId);
      return;
    }

    const existingLayout = main.querySelector(':scope > .fs-layout');
    if (existingLayout) {
      existingLayout.insertAdjacentHTML('afterbegin', renderPageLnb(group, activeId));
      const manage = existingLayout.querySelector(':scope > .fs-manage, :scope > .type3-page');
      if (manage && !manage.classList.contains('fs-manage')) manage.classList.add('fs-manage');
      return;
    }

    const layout = document.createElement('div');
    layout.className = 'fs-layout';
    layout.innerHTML = renderPageLnb(group, activeId);

    const manage = document.createElement('div');
    manage.className = 'fs-manage';
    while (main.firstChild) {
      manage.appendChild(main.firstChild);
    }
    layout.appendChild(manage);
    main.appendChild(layout);
  }

  function getListHref(activeId) {
    const group = findMenuGroup(activeId);
    const resolved = resolveActiveId(activeId);
    const child = group?.children?.find((item) => item.id === resolved);
    return child?.href || group?.href || ADMIN_HOME;
  }

  function getCrumbMeta(activeId) {
    const group = findMenuGroup(activeId);
    const resolved = resolveActiveId(activeId);
    const child = group?.children?.find((item) => item.id === resolved);
    const listHref = child?.href || group?.href || ADMIN_HOME;
    const listFile = (listHref || '').split('/').pop().toLowerCase();
    const file = currentFile();
    const isListEquivalent = LIST_EQUIVALENT_FILES[file] === listFile;
    const isDetail = Boolean(file && listFile && file !== listFile && !isListEquivalent);
    let currentLabel = child?.label || group?.label || '관리자';

    if (isDetail) {
      const existing = document.querySelector('.fmd-breadcrumb__current, .breadcrumb__current');
      const existingText = existing?.textContent?.trim();
      if (existingText) {
        currentLabel = existingText;
      } else {
        const title = document.title.split('|')[0].trim();
        currentLabel = title || `${child?.label || group?.label || ''} 상세`.trim();
      }
    }

    return {
      groupLabel: group?.label || '관리자',
      groupHref: group?.href || ADMIN_HOME,
      childLabel: child?.label || group?.label || '관리자',
      listHref,
      currentLabel,
      isDetail,
    };
  }

  function renderBreadcrumb(activeId) {
    const meta = getCrumbMeta(activeId);
    if (meta.isDetail) {
      return `<nav class="fmd-breadcrumb" aria-label="현재 위치" data-poms-admin-breadcrumb="1">
        <a href="${meta.groupHref}">${meta.groupLabel}</a>
        <span class="fmd-breadcrumb__sep" aria-hidden="true">&gt;</span>
        <a href="${meta.listHref}">${meta.childLabel}</a>
        <span class="fmd-breadcrumb__sep" aria-hidden="true">&gt;</span>
        <span class="fmd-breadcrumb__current">${meta.currentLabel}</span>
      </nav>`;
    }
    if (meta.groupLabel === meta.currentLabel) {
      return `<nav class="fmd-breadcrumb" aria-label="현재 위치" data-poms-admin-breadcrumb="1">
        <span class="fmd-breadcrumb__current">${meta.currentLabel}</span>
      </nav>`;
    }
    return `<nav class="fmd-breadcrumb" aria-label="현재 위치" data-poms-admin-breadcrumb="1">
      <a href="${meta.groupHref}">${meta.groupLabel}</a>
      <span class="fmd-breadcrumb__sep" aria-hidden="true">&gt;</span>
      <span class="fmd-breadcrumb__current">${meta.currentLabel}</span>
    </nav>`;
  }

  function renderCrumbRow(activeId) {
    const meta = getCrumbMeta(activeId);
    if (meta.isDetail) {
      return `${renderCrumbButtons()}${renderBreadcrumb(activeId)}`;
    }
    return renderBreadcrumb(activeId);
  }

  function renderCrumbButtons() {
    return `<button type="button" class="fmd-back-btn" data-poms-admin-back aria-label="이전으로">
        <img src="${BACK_ICON}" alt="" width="16" height="16">
      </button>`;
  }

  function bindCrumbBack(row, activeId) {
    const backBtn = row.querySelector('[data-poms-admin-back], .fmd-back-btn');
    if (!backBtn || backBtn.dataset.bound === '1') return;
    if (backBtn.tagName === 'A' && backBtn.getAttribute('href')) return;
    backBtn.dataset.bound = '1';
    const fallback = getListHref(activeId) || ADMIN_HOME;
    backBtn.addEventListener('click', () => {
      const ref = document.referrer;
      if (ref) {
        try {
          if (new URL(ref).origin === location.origin) {
            window.history.back();
            return;
          }
        } catch (_) {
          /* ignore invalid referrer */
        }
      }
      window.location.href = fallback;
    });
  }

  function ensureCrumbButtons(row, activeId) {
    row.querySelectorAll('.fmd-home-btn').forEach((el) => el.remove());
    if (!row.querySelector('.fmd-back-btn')) {
      row.insertAdjacentHTML(
        'afterbegin',
        `<button type="button" class="fmd-back-btn" data-poms-admin-back aria-label="이전으로">
        <img src="${BACK_ICON}" alt="" width="16" height="16">
      </button>`
      );
    }
    bindCrumbBack(row, activeId);
  }

  function removeCrumbButtons(row) {
    row.querySelectorAll('.fmd-back-btn, .fmd-home-btn').forEach((el) => el.remove());
  }

  function ensureCrumbBreadcrumb(row, activeId) {
    if (row.querySelector('.fmd-breadcrumb, .breadcrumb, .loc-breadcrumb, [aria-label="현재 위치"]')) {
      return;
    }
    row.insertAdjacentHTML('beforeend', renderBreadcrumb(activeId));
  }

  /** 목록: 브레드크럼만 / 상세: 뒤로가기 + 브레드크럼 (홈 버튼 없음) */
  function ensurePageCrumbNav(activeId) {
    const meta = getCrumbMeta(activeId);
    let row = document.querySelector('.fmd-crumb-row');

    if (!meta.isDetail) {
      if (row) {
        removeCrumbButtons(row);
        ensureCrumbBreadcrumb(row, activeId);
        return;
      }
      const host =
        document.querySelector('.fs-manage') ||
        document.querySelector('main.main-content');
      if (!host) return;
      row = document.createElement('div');
      row.className = 'fmd-crumb-row';
      row.dataset.pomsAdminCrumb = '1';
      row.innerHTML = renderBreadcrumb(activeId);
      host.insertBefore(row, host.firstChild);
      return;
    }

    if (row) {
      ensureCrumbButtons(row, activeId);
      ensureCrumbBreadcrumb(row, activeId);
      return;
    }

    const host =
      document.querySelector('.fs-manage') ||
      document.querySelector('main.main-content');
    if (!host) return;

    row = document.createElement('div');
    row.className = 'fmd-crumb-row';
    row.dataset.pomsAdminCrumb = '1';
    row.innerHTML = renderCrumbRow(activeId);
    host.insertBefore(row, host.firstChild);
    bindCrumbBack(row, activeId);
  }

  function applyFlatLayout(activeId) {
    ensureFlatStyles();
    ensurePretendard();
    const skipFlatClass =
      document.body.classList.contains('fcr-flat-page')
      || document.body.classList.contains('fmd-figma-page')
      || document.body.classList.contains('fcr-detail-flat-page');
    if (!skipFlatClass) {
      document.body.classList.add('admin-flat-page');
    }
    ensurePageLnb(activeId);
    ensurePageCrumbNav(activeId);
  }

  function mount(selector, options = {}) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    const activeId = options.active || inferActiveId();
    ensureTopnavStyles();
    document.body.classList.add('admin-topnav-layout');
    el.innerHTML = render(activeId);
    el.dataset.mounted = 'true';
    bindEvents();
    initApprovalInbox(el);
    applyFlatLayout(activeId);
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
