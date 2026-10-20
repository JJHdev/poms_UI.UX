/**
 * 자료처리 승인/반려 — 일괄갱신 업로드 신청 목록, 승인/반려 처리
 * 양식구분: 시설물 일반정보 | 정기안전점검 | 안전시설현황
 * status: pending(승인대기) | rejected(반려) | completed(처리완료)
 */
(() => {
  const REQUEST_ROWS = [
    { id: 'dp1', workType: '일괄갱신', formType: '시설물 일반정보', agency: '부산지방해양수산청', requester: '김항만 (부산청)', fileName: '시설물일반정보_부산청_20260706.xlsx', requestedAt: '2026-07-06 09:40', status: 'pending' },
    { id: 'dp2', workType: '일괄갱신', formType: '정기안전점검', agency: '부산항만공사', requester: '이보수 (BPA)', fileName: '정기안전점검_BPA_2026상반기.xlsx', requestedAt: '2026-07-06 08:55', status: 'pending' },
    { id: 'dp3', workType: '일괄갱신', formType: '안전시설현황', agency: '여수광양항만공사', requester: '박점검 (YGPA)', fileName: '안전시설현황_YGPA_20260705.xlsx', requestedAt: '2026-07-05 16:20', status: 'completed' },
    { id: 'dp4', workType: '일괄갱신', formType: '시설물 일반정보', agency: '인천항만공사', requester: '최시설 (IPA)', fileName: '시설물일반정보_IPA_20260705.xlsx', requestedAt: '2026-07-05 14:05', status: 'pending' },
    { id: 'dp5', workType: '일괄갱신', formType: '정기안전점검', agency: '여수지방해양수산청', requester: '정안전 (여수청)', fileName: '정기안전점검_여수청_20260704.xlsx', requestedAt: '2026-07-04 10:48', status: 'rejected' },
    { id: 'dp6', workType: '일괄갱신', formType: '안전시설현황', agency: '경상북도', requester: '한도청 (경북)', fileName: '안전시설현황_경북_20260703.xlsx', requestedAt: '2026-07-03 15:12', status: 'completed' },
    { id: 'dp7', workType: '일괄갱신', formType: '시설물 일반정보', agency: '부산항만공사', requester: '이보수 (BPA)', fileName: '시설물일반정보_BPA_20260702.xlsx', requestedAt: '2026-07-02 11:34', status: 'completed' },
    { id: 'dp8', workType: '일괄갱신', formType: '정기안전점검', agency: '인천항만공사', requester: '최시설 (IPA)', fileName: '정기안전점검_IPA_20260701.xlsx', requestedAt: '2026-07-01 17:03', status: 'completed' },
  ];

  const STATUS_META = {
    pending: { label: '승인대기', cls: 'sra-status--pending' },
    rejected: { label: '반려', cls: 'sra-status--rejected' },
    completed: { label: '처리완료', cls: 'sra-status--completed' },
  };

  const state = {
    rows: [...REQUEST_ROWS],
    filtered: [...REQUEST_ROWS],
    page: 1,
    pageSize: 10,
  };

  function $(sel) {
    return document.querySelector(sel);
  }

  function populateFilterSelects() {
    const el = document.getElementById('dataApprovalAgency');
    if (!el) return;
    el.innerHTML = `<option value="">전체</option>${[...new Set(state.rows.map((r) => r.agency))]
      .map((v) => `<option value="${v}">${v}</option>`)
      .join('')}`;
  }

  function filterRows() {
    const formType = $('#dataApprovalForm')?.value || '';
    const agency = $('#dataApprovalAgency')?.value || '';
    const status = $('#dataApprovalStatus')?.value || '';
    const fileName = ($('#dataApprovalFile')?.value || '').trim();

    state.filtered = state.rows.filter((row) => {
      if (formType && row.formType !== formType) return false;
      if (agency && row.agency !== agency) return false;
      if (status && row.status !== status) return false;
      if (fileName && !row.fileName.includes(fileName)) return false;
      return true;
    });
    state.page = 1;
  }

  function actionButtonsHtml(row) {
    if (row.status === 'pending') {
      return `<span class="sra-actions">
        <button type="button" class="sra-tbl-btn sra-tbl-btn--approve" data-action="approve" data-id="${row.id}">승인</button>
        <button type="button" class="sra-tbl-btn sra-tbl-btn--reject" data-action="reject" data-id="${row.id}">반려</button>
      </span>`;
    }
    return '<span class="sra-done-label">처리완료</span>';
  }

  function renderTable() {
    const tbody = $('#dataApprovalTableBody');
    const countEl = $('#dataApprovalResultCount');
    if (!tbody) return;

    if (countEl) countEl.textContent = state.filtered.length.toLocaleString();

    PomsUserTable.mountFoot({
      paginationId: 'dataApprovalPagination',
      state,
      totalRows: state.filtered.length,
      onChange: renderTable,
    });

    const pageRows = PomsUserTable.slicePage(state.filtered, state.page, state.pageSize);
    const start = (state.page - 1) * state.pageSize;

    if (!pageRows.length) {
      tbody.innerHTML = '<tr><td colspan="10" style="padding:24px;text-align:center;color:#6b7280;">자료처리 신청 내역이 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = pageRows.map((row, i) => {
      const meta = STATUS_META[row.status] || STATUS_META.pending;
      return `
      <tr${row.status === 'completed' ? ' class="is-completed"' : ''}>
        <td>${start + i + 1}</td>
        <td>${row.workType}</td>
        <td>${row.formType}</td>
        <td class="is-left" title="${row.agency}">${row.agency}</td>
        <td>${row.requester}</td>
        <td class="is-left" title="${row.fileName}">${row.fileName}</td>
        <td>${row.requestedAt}</td>
        <td><span class="sra-status ${meta.cls}">${meta.label}</span></td>
        <td><button type="button" class="sra-tbl-btn sra-tbl-btn--download" data-download-id="${row.id}">파일 다운로드</button></td>
        <td>${actionButtonsHtml(row)}</td>
      </tr>
    `;
    }).join('');

    tbody.querySelectorAll('[data-download-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = state.rows.find((item) => item.id === btn.dataset.downloadId);
        if (row) alert(`${row.fileName} 파일을 다운로드합니다. (샘플)`);
      });
    });

    tbody.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = state.rows.find((item) => item.id === btn.dataset.id);
        if (!row || row.status !== 'pending') return;
        if (btn.dataset.action === 'approve') {
          row.status = 'completed';
          alert(`${row.requester}의 [${row.formType}] 자료처리 신청이 승인되어 DB에 반영되었습니다. (처리완료)`);
        } else {
          row.status = 'rejected';
          alert(`${row.requester}의 [${row.formType}] 자료처리 신청을 반려했습니다. (샘플)`);
        }
        filterRows();
        renderTable();
      });
    });
  }

  function reset() {
    ['dataApprovalForm', 'dataApprovalAgency', 'dataApprovalStatus'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    const fileEl = $('#dataApprovalFile');
    if (fileEl) fileEl.value = '';
    filterRows();
    renderTable();
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'approval-data' });

    populateFilterSelects();

    $('#dataApprovalSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      filterRows();
      renderTable();
    });
    $('#dataApprovalResetBtn')?.addEventListener('click', reset);

    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
