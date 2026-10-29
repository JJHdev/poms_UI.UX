/**
 * FMS 연계이력 — 목록 (등록/데이터보기/변경이력은 상세페이지 이동, 삭제는 알림)
 */
(() => {
  const rows = window.FMS_LINK_ROWS || [];

  const body = document.getElementById('fmsLinkBody');
  const countEl = document.getElementById('fmsResultCount');
  const pagingState = { page: 1, pageSize: 10 };

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '');
  }

  function goDetail(fmsNo, mode) {
    window.location.href = `fms-history-detail.html?no=${encodeURIComponent(fmsNo)}&mode=${mode}`;
  }

  function renderRows() {
    const pageRows = rows.slice((pagingState.page - 1) * pagingState.pageSize, pagingState.page * pagingState.pageSize);

    if (countEl) countEl.textContent = String(rows.length);

    body.innerHTML = pageRows.map((row) => `
      <tr data-fms-no="${escapeHtml(row.fmsNo)}">
        <td>${row.no}</td>
        <td>${escapeHtml(row.fmsNo)}</td>
        <td title="${escapeHtml(row.fmsName)}">${escapeHtml(row.fmsName)}</td>
        <td title="${escapeHtml(row.pomsName || '-')}">${escapeHtml(row.pomsName || '-')}</td>
        <td>
          <span class="sra-actions">
            <button type="button" class="sra-tbl-btn sra-tbl-btn--approve" data-action="match">등록</button>
            <button type="button" class="sra-tbl-btn sra-tbl-btn--reject" data-action="delete">삭제</button>
          </span>
        </td>
        <td><button type="button" class="sra-tbl-btn sra-tbl-btn--history" data-action="view">데이터보기</button></td>
        <td><button type="button" class="sra-tbl-btn sra-tbl-btn--history" data-action="history">변경이력</button></td>
        <td>${escapeHtml(row.date)}</td>
      </tr>
    `).join('');

    PomsPaging.mount({
      paginationId: 'fmsPagination',
      summaryId: 'fmsSummary',
      pageSizeId: 'fmsPageSize',
      totalRows: rows.length,
      state: pagingState,
      onChange: renderRows,
    });
  }

  body.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    const tr = event.target.closest('tr[data-fms-no]');
    if (!btn || !tr) return;
    const row = rows.find((item) => item.fmsNo === tr.dataset.fmsNo);
    if (!row) return;

    const action = btn.dataset.action;
    if (action === 'view') goDetail(row.fmsNo, 'view');
    else if (action === 'history') goDetail(row.fmsNo, 'history');
    else if (action === 'match') goDetail(row.fmsNo, 'match');
    else if (action === 'delete') {
      if (!window.confirm('POMS 시설물 매칭을 삭제하시겠습니까?')) return;
      row.pomsName = '';
      renderRows();
      alert('POMS 시설물 매칭이 삭제되었습니다.');
    }
  });

  document.querySelector('[data-fms-action="search"]')?.addEventListener('click', (event) => {
    event.preventDefault();
    alert('현재 조건으로 조회했습니다. (샘플)');
  });

  document.getElementById('fmsSearchForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('현재 조건으로 조회했습니다. (샘플)');
  });

  document.querySelector('[data-fms-action="excel"]')?.addEventListener('click', () => {
    alert('현재 FMS 연계 목록을 엑셀로 내려받습니다. (샘플)');
  });

  document.querySelector('[data-fms-action="reset"]')?.addEventListener('click', () => {
    const facility = document.getElementById('fmsFacilityFilter');
    const match = document.getElementById('fmsMatchFilter');
    const no = document.getElementById('fmsNoFilter');
    const from = document.getElementById('fmsDateFrom');
    const to = document.getElementById('fmsDateTo');
    if (facility) facility.value = '';
    if (match) match.value = '';
    if (no) no.value = '';
    if (from) from.value = '2026-05-01';
    if (to) to.value = '2026-05-24';
  });

  renderRows();
})();
