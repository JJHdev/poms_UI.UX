/**
 * 점검결과 등록관리 — 시설물신청관리 / 보고서 등록관리 통합 목록 (탭)
 * 행 클릭 시 각 상세페이지로 이동
 */
(() => {
  const $ = (id) => document.getElementById(id);

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- 탭 ---------- */

  function setActiveTab(tab) {
    document.querySelectorAll('[data-tab]').forEach((btn) => {
      const active = btn.dataset.tab === tab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('[data-panel]').forEach((panel) => {
      const on = panel.dataset.panel === tab;
      panel.hidden = !on;
      panel.classList.toggle('is-active', on);
    });
  }

  /* ---------- 시설물신청관리 목록 ---------- */

  const requestPaging = { page: 1, pageSize: 10 };

  function renderRequestTable() {
    const tbody = $('requestTableBody');
    if (!tbody) return;
    const rows = VENDOR_APPLICATION_REQUESTS;
    const start = (requestPaging.page - 1) * requestPaging.pageSize;
    const pageRows = rows.slice(start, start + requestPaging.pageSize);

    if ($('requestResultCount')) {
      $('requestResultCount').textContent = String(rows.length);
    }

    tbody.innerHTML = pageRows.map((item) => `
      <tr tabindex="0" data-user-id="${escapeHtml(item.userId)}" class="is-clickable" role="button" aria-label="${escapeHtml(item.serviceName)} 상세 보기">
        <td class="col-no">${item.no}</td>
        <td class="col-id">${escapeHtml(item.userId)}</td>
        <td class="col-org">${escapeHtml(item.companyName)}</td>
        <td class="col-name is-left">${escapeHtml(item.serviceName)}</td>
        <td class="col-login">${escapeHtml(item.applyDate)}</td>
        <td class="col-yn"><strong>${item.facilities.length}</strong></td>
      </tr>
    `).join('');

    PomsPaging.mount({
      paginationId: 'requestPagination',
      pageSizeId: 'requestPageSize',
      totalRows: rows.length,
      state: requestPaging,
      onChange: () => {
        requestPaging.pageSize = 10;
        renderRequestTable();
      },
    });

    tbody.querySelectorAll('tr[data-user-id]').forEach((row) => {
      const go = () => {
        window.location.href = `vendor-application-detail.html?id=${encodeURIComponent(row.dataset.userId)}`;
      };
      row.addEventListener('click', go);
      row.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        go();
      });
    });
  }

  /* ---------- 보고서 등록관리 목록 ---------- */

  const reportPaging = { page: 1, pageSize: 10 };
  let reportFiltered = [...REPORT_REGISTRATION_REPORTS];

  function renderReportTable() {
    const tbody = $('reportRegTableBody');
    if (!tbody) return;
    const start = (reportPaging.page - 1) * reportPaging.pageSize;
    const pageRows = reportFiltered.slice(start, start + reportPaging.pageSize);

    if ($('reportRegResultCount')) {
      $('reportRegResultCount').textContent = String(reportFiltered.length);
    }

    if (!reportFiltered.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="is-empty">조회된 내용이 없습니다.</td></tr>';
    } else {
      tbody.innerHTML = pageRows.map((item) => `
        <tr tabindex="0" data-check-id="${escapeHtml(item.checkId)}" class="is-clickable" role="button" aria-label="${escapeHtml(item.fcltyNm)} 상세 보기">
          <td class="col-no">${item.seqNo}</td>
          <td class="col-org is-left">${escapeHtml(item.manageNm)}</td>
          <td class="col-port">${escapeHtml(item.portNm)}</td>
          <td class="col-subport">${escapeHtml(item.subportNm)}</td>
          <td class="col-fname is-left">${escapeHtml(item.fcltyNm)}</td>
          <td class="col-class">${escapeHtml(item.asortNm)}</td>
          <td class="col-ftype">${escapeHtml(item.fcltyGbnNm)}</td>
          <td class="col-agency">${escapeHtml(item.serviceCompanyNm)} (${escapeHtml(item.userId)})</td>
          <td class="col-check">${escapeHtml(item.chckGbnNm)}</td>
        </tr>
      `).join('');
    }

    PomsPaging.mount({
      paginationId: 'reportRegPagination',
      pageSizeId: 'reportRegPageSize',
      totalRows: reportFiltered.length,
      state: reportPaging,
      onChange: () => {
        reportPaging.pageSize = 10;
        renderReportTable();
      },
    });

    tbody.querySelectorAll('tr[data-check-id]').forEach((row) => {
      const go = () => {
        window.location.href = `report-registration-detail.html?id=${encodeURIComponent(row.dataset.checkId)}`;
      };
      row.addEventListener('click', go);
      row.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        go();
      });
    });
  }

  function populateReportPortFilters() {
    const fill = (id, values) => {
      const el = $(id);
      if (!el) return;
      el.innerHTML = `<option value="">전체</option>${[...new Set(values)]
        .map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`)
        .join('')}`;
    };
    fill('reportRegPortFilter', REPORT_REGISTRATION_REPORTS.map((r) => r.portNm));
    fill('reportRegSubPortFilter', REPORT_REGISTRATION_REPORTS.map((r) => r.subportNm));
  }

  function applyReportFilter() {
    const manageId = $('reportRegManageFilter')?.value || '';
    const port = $('reportRegPortFilter')?.value || '';
    const subPort = $('reportRegSubPortFilter')?.value || '';
    const checkGbn = $('reportRegCheckFilter')?.value || '';
    reportFiltered = REPORT_REGISTRATION_REPORTS.filter((item) => {
      if (manageId && item.manageId !== manageId) return false;
      if (port && item.portNm !== port) return false;
      if (subPort && item.subportNm !== subPort) return false;
      if (checkGbn && item.chckGbn !== checkGbn) return false;
      return true;
    });
    reportPaging.page = 1;
    renderReportTable();
  }

  function resetReportFilter() {
    ['reportRegManageFilter', 'reportRegPortFilter', 'reportRegSubPortFilter', 'reportRegCheckFilter'].forEach((id) => {
      if ($(id)) $(id).value = '';
    });
    applyReportFilter();
  }

  /* ---------- 초기화 ---------- */

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'vendor-inspection-result' });

    document.querySelectorAll('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
    });

    $('reportSearchForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      applyReportFilter();
    });
    $('reportRegReset')?.addEventListener('click', resetReportFilter);

    const tab = new URLSearchParams(window.location.search).get('tab');
    if (tab === 'report') setActiveTab('report');

    populateReportPortFilters();
    renderRequestTable();
    renderReportTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
