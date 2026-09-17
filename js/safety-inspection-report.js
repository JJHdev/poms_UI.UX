/**
 * 안전점검보고서 — 검색/초기화, 테이블 렌더
 */
(() => {
  const TABLE_COLUMNS = [
    { key: 'year', label: '점검년도' },
    { key: 'agency', label: '관리기관' },
    { key: 'port', label: '항명' },
    { key: 'subPort', label: '세부항명' },
    { key: 'classType', label: '종구분' },
    { key: 'facilityType', label: '시설구분' },
    { key: 'name', label: '시설명' },
    { key: 'inspectType', label: '점검구분' },
  ];

  const state = {
    rows: [...SAFETY_REPORT_DATA],
    filtered: [...SAFETY_REPORT_DATA],
    page: 1,
    pageSize: 10,
    sort: { key: '', dir: 'asc' },
    requestTarget: null,
  };

  function $(sel) {
    return document.querySelector(sel);
  }

  function filterRows() {
    const year = $('#reportYear')?.value || '';
    const agency = $('#reportAgency')?.value || '';
    const facilityType = $('#reportFacilityType')?.value || '';
    const classType = $('#reportClassType')?.value || '';
    const port = $('#reportPort')?.value || '';
    const subPort = $('#reportSubPort')?.value || '';
    const inspectType = $('#reportInspectType')?.value || '';
    const name = ($('#reportFacilityName')?.value || '').trim();

    return state.rows.filter((row) => {
      if (year && row.year !== year) return false;
      if (agency && row.agency !== agency) return false;
      if (facilityType && row.facilityType !== facilityType) return false;
      if (classType && row.classType !== classType) return false;
      if (port && row.port !== port) return false;
      if (subPort && row.subPort !== subPort) return false;
      if (inspectType && row.inspectType !== inspectType) return false;
      if (name && !row.name.includes(name)) return false;
      return true;
    });
  }

  function sortFilteredRows(rows) {
    return PomsUserTable.sortRows(rows, state.sort.key, state.sort.dir, (row, key) => row[key]);
  }

  function setupTableHead() {
    const thead = $('#reportTableBody')?.closest('table')?.querySelector('thead');
    if (!thead) return;
    thead.innerHTML = `<tr>
      <th scope="col" class="col-no">번호</th>
      <th scope="col" class="col-year">점검년도</th>
      <th scope="col" class="col-agency">관리기관</th>
      <th scope="col" class="col-port">항명</th>
      <th scope="col" class="col-subport">세부항명</th>
      <th scope="col" class="col-class">종구분</th>
      <th scope="col" class="col-ftype">시설구분</th>
      <th scope="col" class="col-name">시설명</th>
      <th scope="col" class="col-itype">점검구분</th>
      <th scope="col" class="col-report">보고서</th>
      <th scope="col" class="col-request">다운로드 신청</th>
      <th scope="col" class="col-history">결재이력</th>
    </tr>`;
  }

  function updateResultCount() {
    const el = $('#reportResultCount');
    if (el) el.textContent = state.filtered.length.toLocaleString();
  }

  function renderTable() {
    const tbody = $('#reportTableBody');
    if (!tbody) return;

    updateResultCount();

    if (!state.filtered.length) {
      tbody.innerHTML = '<tr><td colspan="12">조회된 데이터가 없습니다.</td></tr>';
      PomsUserTable.mountFoot({
        paginationId: 'reportPagination',
        state,
        totalRows: 0,
        onChange: renderTable,
      });
      return;
    }

    const rows = PomsUserTable.slicePage(state.filtered, state.page, state.pageSize);
    const start = (state.page - 1) * state.pageSize;

    const reportCell = (row, idx) => {
      if (row.downloadState === 'approved') {
        return `<button type="button" class="safety-report-download-btn" data-report="${idx}">
          <img src="assets/main/safety-report/icon-download.svg" alt="" width="16" height="16">
          다운로드
        </button>`;
      }
      return `<button type="button" class="safety-report-view-btn" data-report="${idx}">
        <img src="assets/main/safety-report/icon-preview.svg" alt="" width="16" height="16">
        미리보기
      </button>`;
    };

    const requestLabel = (row) => {
      if (row.downloadState === 'approved') return '승인완료';
      if (row.downloadState === 'requested') return '신청완료';
      return '다운로드 신청';
    };
    const requestClass = (row) => {
      if (row.downloadState === 'approved') return ' is-approved-done';
      if (row.downloadState === 'requested') return ' is-requested';
      return '';
    };

    tbody.innerHTML = rows.map((row, i) => `
      <tr>
        <td class="col-no">${start + i + 1}</td>
        <td class="col-year">${row.year}</td>
        <td class="col-agency">${row.agency}</td>
        <td class="col-port">${row.port}</td>
        <td class="col-subport">${row.subPort}</td>
        <td class="col-class">${row.classType}</td>
        <td class="col-ftype">${row.facilityType}</td>
        <td class="col-name" title="${row.name}">${row.name}</td>
        <td class="col-itype">${row.inspectType}</td>
        <td class="col-report">${reportCell(row, start + i)}</td>
        <td class="col-request">
          <button
            type="button"
            class="safety-report-request-btn${requestClass(row)}"
            data-report="${start + i}"
          >${requestLabel(row)}</button>
        </td>
        <td class="col-history"><button type="button" class="safety-report-history-btn" data-report="${start + i}">결재이력</button></td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.safety-report-download-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = state.filtered[Number(btn.dataset.report)];
        if (!row) return;
        alert(`${row.name} 보고서를 다운로드합니다. (샘플)`);
        pushHistory(row, '다운로드 완료', '');
        row.downloadState = '';
        renderTable();
      });
    });

    tbody.querySelectorAll('.safety-report-view-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = state.filtered[Number(btn.dataset.report)];
        if (!row) return;
        openReportView(row);
      });
    });

    tbody.querySelectorAll('.safety-report-request-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = state.filtered[Number(btn.dataset.report)];
        if (!row) return;
        if (row.downloadState === 'approved') {
          alert('승인 완료된 보고서입니다. [다운로드] 버튼으로 다운로드하세요.');
          return;
        }
        if (row.downloadState === 'requested') {
          alert('이미 다운로드 신청되었습니다. 승인 대기 중입니다.');
          return;
        }
        openReportRequest(row);
      });
    });

    tbody.querySelectorAll('.safety-report-history-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = state.filtered[Number(btn.dataset.report)];
        if (!row) return;
        openReportHistory(row);
      });
    });

    PomsUserTable.mountFoot({
      paginationId: 'reportPagination',
      state,
      totalRows: state.filtered.length,
      onChange: renderTable,
    });
  }

  /* ===== 결재이력 ===== */
  function nowStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function pushHistory(row, type, note) {
    if (!Array.isArray(row.history)) row.history = [];
    row.history.push({ type, date: nowStamp(), note: note || '' });
  }

  function openReportHistory(row) {
    const modal = $('#reportHistoryModal');
    if (!modal) return;

    const sub = $('#reportHistorySub');
    if (sub) sub.textContent = `${row.name} — ${row.inspectType}`;

    const body = $('#reportHistoryBody');
    if (body) {
      const items = Array.isArray(row.history) ? row.history : [];
      if (!items.length) {
        body.innerHTML = '<tr><td colspan="3" class="empty">결재이력이 없습니다.</td></tr>';
      } else {
        body.innerHTML = items.map((h) => `
          <tr>
            <td class="${h.type === '반려' ? 'is-reject' : ''}">${h.type}</td>
            <td>${h.date}</td>
            <td class="is-left">${h.note ? escapeHtml(h.note) : '-'}</td>
          </tr>
        `).join('');
      }
    }
    modal.hidden = false;
  }

  function closeReportHistory() {
    const modal = $('#reportHistoryModal');
    if (modal) modal.hidden = true;
  }

  function bindReportHistory() {
    document.querySelectorAll('[data-close-report-history]').forEach((el) => {
      el.addEventListener('click', closeReportHistory);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ===== 다운로드 신청 모달 ===== */
  function openReportRequest(row) {
    const modal = $('#reportRequestModal');
    if (!modal) return;
    state.requestTarget = row;
    const sub = $('#reportRequestSub');
    if (sub) sub.textContent = `${row.name} — ${row.inspectType}`;
    const reason = $('#reportRequestReason');
    if (reason) reason.value = '';
    modal.hidden = false;
    reason?.focus();
  }

  function closeReportRequest() {
    const modal = $('#reportRequestModal');
    if (modal) modal.hidden = true;
    state.requestTarget = null;
    const reason = $('#reportRequestReason');
    if (reason) reason.value = '';
  }

  function submitReportRequest() {
    const row = state.requestTarget;
    if (!row) return;
    const reason = ($('#reportRequestReason')?.value || '').trim();
    if (!reason) {
      alert('신청이유를 입력해 주세요.');
      $('#reportRequestReason')?.focus();
      return;
    }
    row.downloadState = 'requested';
    pushHistory(row, '다운로드 신청', reason);
    closeReportRequest();
    alert('관리자에게 다운로드 신청되었습니다.');
    renderTable();
  }

  function bindReportRequest() {
    document.querySelectorAll('[data-close-report-request]').forEach((el) => {
      el.addEventListener('click', closeReportRequest);
    });
    $('#reportRequestSubmitBtn')?.addEventListener('click', submitReportRequest);
  }

  /* ===== 보고서 VIEW 모달 ===== */
  /* Chromium PDF 뷰어: toolbar=0 으로 다운로드·인쇄 버튼 포함 도구모음 숨김 */
  const REPORT_PREVIEW_SRC =
    'files/safety-report-sample.pdf#toolbar=0&navpanes=0';

  function isReportViewOpen() {
    const modal = $('#reportViewModal');
    return Boolean(modal && !modal.hidden);
  }

  function openReportView(row) {
    const modal = $('#reportViewModal');
    if (!modal) return;
    const titleEl = $('#reportViewTitle');
    if (titleEl) titleEl.textContent = `보고서 VIEW — ${row.name} (${row.inspectType})`;
    const frame = $('#reportViewFrame');
    if (frame) frame.src = REPORT_PREVIEW_SRC;
    modal.hidden = false;
  }

  function closeReportView() {
    const modal = $('#reportViewModal');
    if (modal) modal.hidden = true;
    const frame = $('#reportViewFrame');
    if (frame) frame.src = '';
  }

  function bindReportView() {
    document.querySelectorAll('[data-close-report-view]').forEach((el) => {
      el.addEventListener('click', closeReportView);
    });

    document.addEventListener('keydown', (e) => {
      if (!isReportViewOpen()) return;
      const key = e.key?.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (key === 'p' || key === 's')) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  function syncSelectPlaceholders() {
    document.querySelectorAll('.safety-report-filter select').forEach((sel) => {
      sel.classList.toggle('is-placeholder', !sel.value);
    });
  }

  function search() {
    state.filtered = sortFilteredRows(filterRows());
    state.page = 1;
    setupTableHead();
    renderTable();
  }

  function reset() {
    ['reportYear', 'reportAgency', 'reportFacilityType', 'reportClassType', 'reportPort', 'reportSubPort', 'reportInspectType'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    const nameInput = $('#reportFacilityName');
    if (nameInput) nameInput.value = '';
    syncSelectPlaceholders();
    state.filtered = sortFilteredRows([...state.rows]);
    state.page = 1;
    setupTableHead();
    renderTable();
  }

  function init() {
    PomsSidebar.mount('#sidebar-root', { active: 'archive-report' });

    $('#reportResetBtn')?.addEventListener('click', reset);
    $('#reportSearchBtn')?.addEventListener('click', search);
    $('#reportSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      search();
    });
    document.querySelectorAll('.safety-report-filter select').forEach((sel) => {
      sel.addEventListener('change', syncSelectPlaceholders);
    });
    syncSelectPlaceholders();

    bindReportView();
    bindReportHistory();
    bindReportRequest();
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const requestModal = $('#reportRequestModal');
      if (requestModal && !requestModal.hidden) {
        closeReportRequest();
        return;
      }
      const historyModal = $('#reportHistoryModal');
      if (historyModal && !historyModal.hidden) {
        closeReportHistory();
        return;
      }
      const viewModal = $('#reportViewModal');
      if (viewModal && !viewModal.hidden) closeReportView();
    });
    setupTableHead();
    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
