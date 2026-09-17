/**
 * 시설물 변경요청 관리 — Figma 166:5114
 * 행 클릭 시 facility-change-approval-detail.html?id= 로 이동
 */
(() => {
  const REQUESTS = typeof FACILITY_CHANGE_REQUESTS !== 'undefined' ? FACILITY_CHANGE_REQUESTS : [];
  const STATUS_META = {
    requested: { label: '요청중', cls: 'fca-status--requested' },
    approved: { label: '승인', cls: 'fca-status--approved' },
    rejected: { label: '반려', cls: 'fca-status--rejected' },
  };

  const state = {
    filtered: [...REQUESTS],
    page: 1,
    pageSize: 10,
  };

  const DEM_ROWS = REQUESTS.filter((r) => r.type === '시설물 삭제');

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function populateSelect(id, values) {
    const select = $(id);
    if (!select) return;
    select.innerHTML = '<option value="">전체</option>'
      + [...new Set(values)].map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
  }

  function formatDate(value) {
    return String(value || '').slice(0, 10);
  }

  function matchFilters(row, ids) {
    const agency = $(ids.agency)?.value || '';
    const port = $(ids.port)?.value || '';
    const subPort = $(ids.subPort)?.value || '';
    const name = $(ids.name)?.value.trim().toLowerCase() || '';
    const type = $(ids.type)?.value || '';
    const dateFrom = $(ids.dateFrom)?.value || '';
    const dateTo = $(ids.dateTo)?.value || '';
    const reqDate = formatDate(row.requestedAt);

    if (agency && row.agency !== agency) return false;
    if (port && row.port !== port) return false;
    if (subPort && row.subPort !== subPort) return false;
    if (name && !(row.facilityName || '').toLowerCase().includes(name)) return false;
    if (type && row.type !== type) return false;
    if (dateFrom && reqDate < dateFrom) return false;
    if (dateTo && reqDate > dateTo) return false;
    return true;
  }

  const APPROVAL_FILTER_IDS = {
    agency: 'fltAgency',
    port: 'fltPort',
    subPort: 'fltSubPort',
    name: 'fltName',
    type: 'fltType',
    dateFrom: 'fltDateFrom',
    dateTo: 'fltDateTo',
  };

  const DEMOLISH_FILTER_IDS = {
    agency: 'demAgency',
    port: 'demPort',
    subPort: 'demSubPort',
    name: 'demName',
    type: 'demType',
    dateFrom: 'demDateFrom',
    dateTo: 'demDateTo',
  };

  function applyFilters() {
    state.page = 1;
    state.filtered = REQUESTS.filter((row) => matchFilters(row, APPROVAL_FILTER_IDS));
    render();
  }

  function statusHtml(status) {
    const meta = STATUS_META[status] || STATUS_META.requested;
    return `<span class="fca-status ${meta.cls}">${meta.label}</span>`;
  }

  function renderPagination() {
    if (typeof PomsUserTable !== 'undefined' && PomsUserTable.mountFoot) {
      PomsUserTable.mountFoot({
        paginationId: 'fcaPagination',
        state,
        totalRows: state.filtered.length,
        onChange: render,
      });
      return;
    }

    const nav = $('fcaPagination');
    if (!nav) return;
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
    const page = Math.min(Math.max(state.page, 1), totalPages);
    state.page = page;
    const maxButtons = Math.min(totalPages, 5);
    const pages = Array.from({ length: maxButtons }, (_, i) => i + 1);

    nav.innerHTML = `
      <button type="button" class="pagination__btn" data-page-move="first" aria-label="첫 페이지"${page === 1 ? ' disabled' : ''}></button>
      <button type="button" class="pagination__btn" data-page-move="prev" aria-label="이전 페이지"${page === 1 ? ' disabled' : ''}></button>
      ${pages.map((p) => `
        <button type="button" class="pagination__btn${p === page ? ' is-active' : ''}" data-page="${p}"${p === page ? ' aria-current="page"' : ''}>${p}</button>
      `).join('')}
      <button type="button" class="pagination__btn" data-page-move="next" aria-label="다음 페이지"${page === totalPages ? ' disabled' : ''}></button>
      <button type="button" class="pagination__btn" data-page-move="last" aria-label="마지막 페이지"${page === totalPages ? ' disabled' : ''}></button>
    `;

    nav.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.page = Number(btn.getAttribute('data-page'));
        render();
      });
    });
    nav.querySelector('[data-page-move="first"]')?.addEventListener('click', () => {
      if (state.page === 1) return;
      state.page = 1;
      render();
    });
    nav.querySelector('[data-page-move="prev"]')?.addEventListener('click', () => {
      if (state.page <= 1) return;
      state.page -= 1;
      render();
    });
    nav.querySelector('[data-page-move="next"]')?.addEventListener('click', () => {
      if (state.page >= totalPages) return;
      state.page += 1;
      render();
    });
    nav.querySelector('[data-page-move="last"]')?.addEventListener('click', () => {
      if (state.page === totalPages) return;
      state.page = totalPages;
      render();
    });
  }

  function getPageRows() {
    if (typeof PomsUserTable !== 'undefined' && PomsUserTable.slicePage) {
      return PomsUserTable.slicePage(state.filtered, state.page, state.pageSize);
    }
    const start = (state.page - 1) * state.pageSize;
    return state.filtered.slice(start, start + state.pageSize);
  }

  function render() {
    const body = $('fcaBody');
    const countEl = $('fcaResultCount');
    if (countEl) countEl.textContent = String(state.filtered.length);

    renderPagination();

    const pageRows = getPageRows();
    const startIdx = (state.page - 1) * state.pageSize;

    if (!body) return;

    if (!state.filtered.length) {
      body.innerHTML = '<tr><td colspan="13">변경요청 내역이 없습니다.</td></tr>';
      return;
    }

    body.innerHTML = pageRows.map((r, pi) => {
      const i = startIdx + pi;
      return `
        <tr data-id="${escapeHtml(r.id)}" title="클릭하면 변경 전/후 비교 상세로 이동합니다.">
          <td>${i + 1}</td>
          <td>${escapeHtml(formatDate(r.requestedAt))}</td>
          <td>${escapeHtml(r.type)}</td>
          <td>${escapeHtml(r.manageCat)}</td>
          <td>${escapeHtml(r.agency)}</td>
          <td>${escapeHtml(r.port)}</td>
          <td>${escapeHtml(r.subPort)}</td>
          <td>${escapeHtml(r.facilityType)}</td>
          <td>${escapeHtml(r.facilityName)}</td>
          <td>${escapeHtml(r.requester)}</td>
          <td class="col-reason" title="${escapeHtml(r.reason)}">${escapeHtml(r.reason)}</td>
          <td>${statusHtml(r.status)}</td>
          <td><button type="button" class="fca-hist-btn" data-history="${escapeHtml(r.id)}">결재이력</button></td>
        </tr>`;
    }).join('');

    body.querySelectorAll('tr[data-id]').forEach((tr) => {
      tr.addEventListener('click', (event) => {
        if (event.target.closest('button')) return;
        window.location.href = `facility-change-approval-detail.html?id=${encodeURIComponent(tr.dataset.id)}&source=approval`;
      });
    });

    body.querySelectorAll('[data-history]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const req = REQUESTS.find((r) => String(r.id) === String(btn.dataset.history));
        if (req) openHistoryDrawer(req);
      });
    });
  }

  function historySteps(req) {
    const requestStep = {
      title: '변경요청',
      name: req.requester,
      org: req.org,
      date: req.requestedAt,
      noteTag: `[${req.type}]`,
      noteText: req.reason,
      type: '',
    };

    const steps = [];
    if (req.status === 'approved') {
      steps.push({
        title: '승인완료',
        name: req.requester,
        org: req.org,
        date: req.requestedAt,
        noteTag: `[${req.type}]`,
        noteText: req.reason,
        type: 'done',
      });
    }
    if (req.status === 'rejected') {
      steps.push({
        title: '반려',
        name: '관리자',
        org: '',
        date: req.requestedAt,
        noteTag: '[반려]',
        noteText: req.rejectReason || '-',
        type: 'reject',
      });
    }
    steps.push(requestStep);
    return steps;
  }

  function historyDrawerHtml(req) {
    const meta = STATUS_META[req.status] || STATUS_META.requested;
    const statusClass = `is-${req.status || 'requested'}`;
    const rows = [
      ['요청 구분', req.type],
      ['시설물명', req.facilityName],
      ['요청자', req.requester],
      ['처리상태', meta.label],
    ];

    return `
      <div class="fca-hist-block">
        <div class="fca-hist-summary">
          <span class="fca-hist-summary__icon-wrap" aria-hidden="true">
            <img class="fca-hist-summary__icon" src="assets/facility-change-approval/icon-history-doc.png" alt="" width="24" height="24">
          </span>
          <span class="fca-hist-summary__name">${escapeHtml(req.facilityName)}</span>
          <span class="fca-hist-summary__meta">
            <span class="fca-hist-summary__type">${escapeHtml(req.type)}</span>
            <span class="fca-hist-summary__status ${statusClass}">${escapeHtml(meta.label)}</span>
          </span>
        </div>
        <div class="fca-hist-rows">
          ${rows.map(([label, value]) => `
            <div class="fca-hist-row">
              <div class="fca-hist-row__label">${escapeHtml(label)}</div>
              <div class="fca-hist-row__value">${escapeHtml(value)}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="fca-hist-steps">
        ${historySteps(req).map((step) => `
          <article class="fca-hist-card${step.type === 'reject' ? ' is-reject' : step.type === 'done' ? ' is-done' : ''}">
            <div class="fca-hist-card__head">
              <div class="fca-hist-card__left">
                <span class="fca-hist-card__badge">${escapeHtml(step.title)}</span>
                <span class="fca-hist-card__by">${escapeHtml(step.name)}${step.org ? `<span class="fca-hist-card__org">(${escapeHtml(step.org)})</span>` : ''}</span>
              </div>
              <span class="fca-hist-card__date">${escapeHtml(step.date)}</span>
            </div>
            <div class="fca-hist-card__note">
              <span class="fca-hist-card__note-tag">${escapeHtml(step.noteTag)}</span>
              <span class="fca-hist-card__note-text">${escapeHtml(step.noteText)}</span>
            </div>
          </article>
        `).join('')}
      </div>`;
  }

  function openHistoryDrawer(req) {
    const body = $('histDrawerBody');
    const overlay = $('histDrawerOverlay');
    const drawer = $('histDrawer');
    if (!body || !drawer) return;
    body.innerHTML = historyDrawerHtml(req);
    overlay?.classList.add('is-open');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeHistoryDrawer() {
    $('histDrawerOverlay')?.classList.remove('is-open');
    const drawer = $('histDrawer');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  function demolishFiltered() {
    return DEM_ROWS.filter((row) => matchFilters(row, DEMOLISH_FILTER_IDS));
  }

  function renderDemolish() {
    const body = $('fcaDemBody');
    if (!body) return;
    const rows = demolishFiltered();
    const countEl = $('fcaDemCount');
    if (countEl) countEl.textContent = String(rows.length);

    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="9">시설물 철거(삭제) 요청이 없습니다.</td></tr>';
      return;
    }

    body.innerHTML = rows.map((r, i) => `
      <tr data-id="${escapeHtml(r.id)}" title="클릭하면 변경 전(마지막) 데이터를 확인합니다.">
        <td>${i + 1}</td>
        <td>${escapeHtml(formatDate(r.requestedAt))}</td>
        <td>${escapeHtml(r.agency)}</td>
        <td>${escapeHtml(r.port)}</td>
        <td>${escapeHtml(r.subPort)}</td>
        <td>${escapeHtml(r.facilityType)}</td>
        <td>${escapeHtml(r.facilityName)}</td>
        <td>${escapeHtml(r.requester)}</td>
        <td class="col-reason" title="${escapeHtml(r.reason)}">${escapeHtml(r.reason)}</td>
      </tr>
    `).join('');

    body.querySelectorAll('tr[data-id]').forEach((tr) => {
      tr.addEventListener('click', () => {
        window.location.href = `facility-change-approval-detail.html?id=${encodeURIComponent(tr.dataset.id)}&source=demolish`;
      });
    });
  }

  function initTabs() {
    document.querySelectorAll('[data-fca-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-fca-tab]').forEach((t) => {
          const active = t === btn;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        document.querySelectorAll('[data-fca-panel]').forEach((panel) => {
          const active = panel.dataset.fcaPanel === btn.dataset.fcaTab;
          panel.classList.toggle('is-active', active);
          panel.hidden = !active;
        });
      });
    });
  }

  function init() {
    if (typeof PomsSidebarAdmin !== 'undefined') {
      PomsSidebarAdmin.mount('#sidebar-root', { active: 'approval-facility-change' });
    }

    initTabs();

    document.querySelectorAll('[data-close-history]').forEach((el) => {
      el.addEventListener('click', closeHistoryDrawer);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeHistoryDrawer();
    });

    populateSelect('fltAgency', REQUESTS.map((r) => r.agency));
    populateSelect('fltPort', REQUESTS.map((r) => r.port));
    populateSelect('fltSubPort', REQUESTS.map((r) => r.subPort));
    populateSelect('demAgency', DEM_ROWS.map((r) => r.agency));
    populateSelect('demPort', DEM_ROWS.map((r) => r.port));
    populateSelect('demSubPort', DEM_ROWS.map((r) => r.subPort));

    $('fcaSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
    });

    $('fltResetBtn')?.addEventListener('click', () => {
      $('fcaSearchForm')?.reset();
      state.filtered = [...REQUESTS];
      state.page = 1;
      render();
    });

    $('demSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      renderDemolish();
    });

    $('demResetBtn')?.addEventListener('click', () => {
      $('demSearchForm')?.reset();
      renderDemolish();
    });

    render();
    renderDemolish();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
