/**
 * 시설물 정보변경 요청 — 기타시설물 목록 (사용자 페이지)
 * 행 클릭 시 facility-change-request-detail.html?id= 로 이동
 */
(() => {
  const BASE_ROWS = FACILITY_MANAGEMENT_ROWS.filter((row) => row.facilityType === '기타');

  const state = {
    filtered: [...BASE_ROWS],
    page: 1,
    pageSize: 10,
  };

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function populateFilterSelect(selectId, values) {
    const select = $(selectId);
    if (!select) return;
    const unique = [...new Set(values)];
    select.innerHTML = '<option value="">전체</option>' + unique.map((v) => `<option value="${v}">${v}</option>`).join('');
  }

  function filterRows() {
    const agency = $('#filterAgency')?.value || '';
    const port = $('#filterPort')?.value || '';
    const subPort = $('#filterSubPort')?.value || '';
    const keyword = $('#filterFacilityName')?.value.trim().toLowerCase() || '';

    state.filtered = BASE_ROWS.filter((row) => {
      if (agency && row.agency !== agency) return false;
      if (port && row.port !== port) return false;
      if (subPort && row.subPort !== subPort) return false;
      if (keyword && !row.name.toLowerCase().includes(keyword)) return false;
      return true;
    });

    state.page = 1;
  }

  function getTotalPages() {
    return Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  }

  function getPageRows() {
    const start = (state.page - 1) * state.pageSize;
    return state.filtered.slice(start, start + state.pageSize);
  }

  function updateCount() {
    const countEl = $('#facilityResultCount');
    if (countEl) countEl.textContent = state.filtered.length.toLocaleString();
  }

  function renderTable() {
    const tbody = $('#facilityTableBody');
    if (!tbody) return;

    const rows = getPageRows();
    const startNo = (state.page - 1) * state.pageSize;

    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="10">검색 결과가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = rows.map((row, i) => `
      <tr class="is-clickable" data-id="${row.id}" tabindex="0">
        <td class="col-no">${startNo + i + 1}</td>
        <td class="col-port-cat">${row.portCategory}</td>
        <td class="col-manage" hidden>${row.manageCategory}</td>
        <td class="col-agency">${row.agency}</td>
        <td class="col-sea" hidden>${row.seaArea}</td>
        <td class="col-port">${row.port}</td>
        <td class="col-subport">${row.subPort}</td>
        <td class="col-type">${row.facilityType}</td>
        <td class="col-name is-left">${row.name}</td>
        <td class="col-history"><button type="button" class="fcr-hist-btn" data-fcr-history="${row.id}">결재이력</button></td>
      </tr>
    `).join('');

    tbody.querySelectorAll('tr.is-clickable').forEach((tr) => {
      const open = (event) => {
        if (event?.target?.closest('button')) return;
        window.location.href = `facility-change-request-detail.html?id=${encodeURIComponent(tr.dataset.id)}`;
      };
      tr.addEventListener('click', open);
      tr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(e);
        }
      });
    });

    tbody.querySelectorAll('[data-fcr-history]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = BASE_ROWS.find((r) => r.id === btn.dataset.fcrHistory);
        if (row) openHistoryModal(row);
      });
    });
  }

  /* ---------- 결재이력 팝업 ---------- */
  const STATUS_LABEL = { requested: '요청중', approved: '승인', rejected: '반려' };
  const STATUS_CLASS = {
    요청중: 'status-requested',
    승인: 'status-approved',
    반려: 'status-rejected',
  };

  function historyRowsFor(facilityId) {
    if (typeof FACILITY_CHANGE_REQUESTS === 'undefined') return [];
    const rows = [];
    FACILITY_CHANGE_REQUESTS.filter((req) => req.facilityId === facilityId).forEach((req) => {
      rows.push(['요청', req.requester, req.org, req.requestedAt, '-', `[${req.type}] ${req.reason}`, STATUS_LABEL.requested]);
      if (req.status === 'approved') {
        rows.push(['승인', req.requester, req.org, req.requestedAt, '관리자', '승인 처리되었습니다.', STATUS_LABEL.approved]);
      }
      if (req.status === 'rejected') {
        rows.push(['반려', req.requester, req.org, req.requestedAt, '관리자', req.rejectReason || '-', STATUS_LABEL.rejected]);
      }
    });
    return rows;
  }

  const HIST_PAGE_SIZE = 10;
  let histRowsData = [];
  let histPage = 1;

  function renderHistoryList() {
    const body = $('#fcrHistoryBody');
    const paging = $('#fcrHistoryPaging');
    if (!body) return;
    const totalPages = Math.max(1, Math.ceil(histRowsData.length / HIST_PAGE_SIZE));
    if (histPage > totalPages) histPage = totalPages;
    const slice = histRowsData.slice((histPage - 1) * HIST_PAGE_SIZE, histPage * HIST_PAGE_SIZE);

    if (!histRowsData.length) {
      body.innerHTML = '<tr><td colspan="7" class="empty">결재이력이 없습니다.</td></tr>';
    } else {
      body.innerHTML = slice
        .map((r) => {
          const statusClass = STATUS_CLASS[r[6]] || '';
          return `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td class="l">${r[5]}</td><td class="${statusClass}">${r[6]}</td></tr>`;
        })
        .join('');
    }

    if (!paging) return;
    if (totalPages <= 1) {
      paging.innerHTML = '';
      paging.hidden = true;
    } else {
      paging.hidden = false;
      const arrowIcon = '<img src="assets/main/facility-search/arrow-right.svg" alt="" width="14" height="14">';
      const doubleIcon = '<img src="assets/main/facility-search/arrow-double-right.svg" alt="" width="14" height="14">';
      const maxVisible = 5;
      let startPage = Math.max(1, histPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);
      startPage = Math.max(1, endPage - maxVisible + 1);
      const pages = [];
      for (let p = startPage; p <= endPage; p += 1) pages.push(p);

      paging.innerHTML = `
        <button type="button" class="pagination__btn" data-hist-pg="first" ${histPage === 1 ? 'disabled' : ''} aria-label="첫 페이지">${doubleIcon}</button>
        <button type="button" class="pagination__btn" data-hist-pg="prev" ${histPage === 1 ? 'disabled' : ''} aria-label="이전 페이지">${arrowIcon}</button>
        ${pages.map((p) => `<button type="button" class="pagination__btn${p === histPage ? ' is-active' : ''}" data-hist-pg="${p}"${p === histPage ? ' aria-current="page"' : ''}>${p}</button>`).join('')}
        <button type="button" class="pagination__btn" data-hist-pg="next" ${histPage === totalPages ? 'disabled' : ''} aria-label="다음 페이지">${arrowIcon}</button>
        <button type="button" class="pagination__btn" data-hist-pg="last" ${histPage === totalPages ? 'disabled' : ''} aria-label="마지막 페이지">${doubleIcon}</button>
      `;
      paging.querySelectorAll('[data-hist-pg]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const v = btn.dataset.histPg;
          if (v === 'first') histPage = 1;
          else if (v === 'prev') histPage = Math.max(1, histPage - 1);
          else if (v === 'next') histPage = Math.min(totalPages, histPage + 1);
          else if (v === 'last') histPage = totalPages;
          else histPage = Number(v);
          renderHistoryList();
        });
      });
    }
  }

  function openHistoryModal(row) {
    const modal = $('#fcrHistoryModal');
    if (!modal) return;
    const sub = $('#fcrHistorySub');
    if (sub) sub.textContent = `${row.name} — ${row.agency} / ${row.port} / ${row.subPort}`;
    histRowsData = historyRowsFor(row.id);
    histPage = 1;
    renderHistoryList();
    modal.hidden = false;
  }

  function closeHistoryModal() {
    const modal = $('#fcrHistoryModal');
    if (modal) modal.hidden = true;
  }

  function renderPagination() {
    const nav = $('#facilityPagination');
    if (!nav) return;

    const totalPages = getTotalPages();
    const page = Math.min(Math.max(state.page, 1), totalPages);
    state.page = page;

    const maxButtons = Math.min(totalPages, 5);
    const pages = Array.from({ length: maxButtons }, (_, index) => index + 1);
    const arrowIcon = '<img src="assets/main/facility-search/arrow-right.svg" alt="" width="14" height="14">';
    const doubleIcon = '<img src="assets/main/facility-search/arrow-double-right.svg" alt="" width="14" height="14">';

    nav.innerHTML = `
      <button type="button" class="pagination__btn" data-page-move="first" aria-label="첫 페이지"${page === 1 ? ' disabled' : ''}>${doubleIcon}</button>
      <button type="button" class="pagination__btn" data-page-move="prev" aria-label="이전 페이지"${page === 1 ? ' disabled' : ''}>${arrowIcon}</button>
      ${pages.map((p) => `
        <button type="button" class="pagination__btn${p === page ? ' is-active' : ''}" data-page="${p}"${p === page ? ' aria-current="page"' : ''}>${p}</button>
      `).join('')}
      ${totalPages > 5 ? `<button type="button" class="pagination__btn${totalPages === page ? ' is-active' : ''}" data-page="${totalPages}">${totalPages}</button>` : ''}
      <button type="button" class="pagination__btn" data-page-move="next" aria-label="다음 페이지"${page === totalPages ? ' disabled' : ''}>${arrowIcon}</button>
      <button type="button" class="pagination__btn" data-page-move="last" aria-label="마지막 페이지"${page === totalPages ? ' disabled' : ''}>${doubleIcon}</button>
    `;

    nav.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.page = Number(btn.getAttribute('data-page'));
        renderAll();
      });
    });
    nav.querySelector('[data-page-move="first"]')?.addEventListener('click', () => {
      if (state.page === 1) return;
      state.page = 1;
      renderAll();
    });
    nav.querySelector('[data-page-move="prev"]')?.addEventListener('click', () => {
      if (state.page <= 1) return;
      state.page -= 1;
      renderAll();
    });
    nav.querySelector('[data-page-move="next"]')?.addEventListener('click', () => {
      if (state.page >= totalPages) return;
      state.page += 1;
      renderAll();
    });
    nav.querySelector('[data-page-move="last"]')?.addEventListener('click', () => {
      if (state.page === totalPages) return;
      state.page = totalPages;
      renderAll();
    });
  }

  function renderAll() {
    updateCount();
    renderTable();
    renderPagination();
  }

  function init() {
    PomsSidebar.mount('#sidebar-root', { active: 'facility-change-request' });

    document.querySelectorAll('[data-close-fcr-history]').forEach((el) => {
      el.addEventListener('click', closeHistoryModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeHistoryModal();
    });

    populateFilterSelect('#filterAgency', BASE_ROWS.map((row) => row.agency));
    populateFilterSelect('#filterPort', BASE_ROWS.map((row) => row.port));
    populateFilterSelect('#filterSubPort', BASE_ROWS.map((row) => row.subPort));

    $('#facilitySearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      filterRows();
      renderAll();
    });

    $('#facilityResetBtn')?.addEventListener('click', () => {
      $('#facilitySearchForm')?.reset();
      state.filtered = [...BASE_ROWS];
      state.page = 1;
      renderAll();
    });

    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
