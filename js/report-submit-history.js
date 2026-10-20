/**
 * 보고서 제출이력 — 목록 (행 클릭 시 상세페이지 이동)
 */
(() => {
  const histories = window.REPORT_SUBMIT_HISTORIES || [];

  let filtered = [...histories];
  const pagingState = { page: 1, pageSize: 10 };

  const $ = (id) => document.getElementById(id);
  const tbody = $('historyTableBody');

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isStage1Done(item) {
    return item.status === '보고서제출 진행' || item.status === '보고서제출 완료';
  }

  function isStage2Done(item) {
    return item.status === '보고서제출 완료';
  }

  function stageMark(done) {
    if (done) {
      return `<span class="history-stage is-done" aria-label="완료">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>
      </span>`;
    }
    return '<span class="history-stage" aria-label="미완료"></span>';
  }

  function renderTable() {
    if (!tbody) return;
    const pageRows = filtered.slice(
      (pagingState.page - 1) * pagingState.pageSize,
      pagingState.page * pagingState.pageSize,
    );

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="8">조회된 내용이 없습니다.</td></tr>';
    } else {
      tbody.innerHTML = pageRows.map((item) => `
        <tr tabindex="0" data-service-id="${escapeHtml(item.serviceId)}">
          <td>${item.no}</td>
          <td>${escapeHtml(item.userId)}</td>
          <td class="is-left">${escapeHtml(item.serviceName)}</td>
          <td>${escapeHtml(item.lastDate)}</td>
          <td><strong>${item.facilities.length}</strong></td>
          <td>${stageMark(isStage1Done(item))}</td>
          <td>${stageMark(isStage2Done(item))}</td>
          <td>${escapeHtml(item.status)}</td>
        </tr>
      `).join('');
    }

    const resultText = $('historyResultText');
    if (resultText) resultText.innerHTML = `총 <strong>${filtered.length}</strong>건`;

    PomsPaging.mount({
      paginationId: 'historyPagination',
      pageSizeId: 'historyPageSize',
      totalRows: filtered.length,
      state: pagingState,
      onChange: () => {
        pagingState.pageSize = 10;
        renderTable();
      },
    });

    tbody.querySelectorAll('tr[data-service-id]').forEach((row) => {
      const go = () => {
        window.location.href = `report-submit-history-detail.html?id=${encodeURIComponent(row.dataset.serviceId)}`;
      };
      row.addEventListener('click', go);
      row.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        go();
      });
    });
  }

  function populatePortFilters() {
    const ports = new Set();
    const subPorts = new Set();
    histories.forEach((item) => {
      item.facilities.forEach((row) => {
        if (row[4]) ports.add(row[4]);
        if (row[5]) subPorts.add(row[5]);
      });
    });
    const fill = (id, values) => {
      const el = $(id);
      if (!el) return;
      el.innerHTML = `<option value="">전체</option>${[...values]
        .map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`)
        .join('')}`;
    };
    fill('historyPortFilter', ports);
    fill('historySubPortFilter', subPorts);
  }

  function applyFilter() {
    const user = $('historyUserFilter')?.value.trim() || '';
    const service = $('historyServiceFilter')?.value.trim() || '';
    const port = $('historyPortFilter')?.value || '';
    const subPort = $('historySubPortFilter')?.value || '';
    const facility = $('historyFacilityFilter')?.value.trim() || '';
    filtered = histories.filter((item) => {
      const userMatched = !user || item.userId.includes(user);
      const serviceMatched = !service || item.serviceName.includes(service);
      const portMatched = !port || item.facilities.some((row) => row[4] === port);
      const subPortMatched = !subPort || item.facilities.some((row) => row[5] === subPort);
      const facilityMatched = !facility || item.facilities.some((row) => row.join(' ').includes(facility));
      return userMatched && serviceMatched && portMatched && subPortMatched && facilityMatched;
    });
    pagingState.page = 1;
    renderTable();
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'vendor-report-history' });

    $('historySearchForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      applyFilter();
    });
    $('historyReset')?.addEventListener('click', () => {
      if ($('historyUserFilter')) $('historyUserFilter').value = '';
      if ($('historyServiceFilter')) $('historyServiceFilter').value = '';
      if ($('historyFacilityFilter')) $('historyFacilityFilter').value = '';
      const portFilter = $('historyPortFilter');
      const subPortFilter = $('historySubPortFilter');
      if (portFilter) portFilter.selectedIndex = 0;
      if (subPortFilter) subPortFilter.selectedIndex = 0;
      applyFilter();
    });

    populatePortFilters();
    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
