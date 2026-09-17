/**
 * 점검정보현황 — 탭 전환, 검색, 테이블·요약 렌더, 컬럼 정렬
 */
(() => {
  const TABS = ['system-inspection','overview', 'regular', 'precision', 'precision-diagnosis', 'perform-evaluation'];

  const TABLE_BODY_BY_TAB = {
    'system-inspection': 'systemInspectionTableBody',
    overview: 'overviewTableBody',
    plan: 'planTableBody',
    regular: 'regularTableBody',
    precision: 'precisionTableBody',
    'precision-diagnosis': 'diagnosisTableBody',
    'perform-evaluation': 'performEvaluationTableBody',
  };

  const GRADE_ORDER = { A: 1, B: 2, C: 3, D: 4, E: 5 };
  const CLASS_ORDER = { '1종': 1, '2종': 2, '3종': 3, 기타: 4 };
  const DEFAULT_SORT = { key: '__seq__', dir: 'asc' };

  const SYS_INSP_DETAIL_TYPES = [
    { key: 'regular', label: '정기안전점검' },
    { key: 'precision', label: '정밀안전점검' },
    { key: 'diagnosis', label: '정밀안전진단' },
    { key: 'eval', label: '성능평가' },
  ];

  const FACILITY_SCHEDULE_GROUPS = [
    { code: '100', prefix: 'regular', title: '정기안전점검' },
    { code: '202', prefix: 'precision', title: '정밀안전점검' },
    { code: '401', prefix: 'diagnosis', title: '정밀안전진단' },
    { code: '500', prefix: 'eval', title: '성능평가' },
  ];

  const PLAN_TYPE_KEYS = [
    { key: 'regular', label: '정기안전점검' },
    { key: 'detailed', label: '정밀안전점검' },
    { key: 'diagnosis', label: '정밀안전진단' },
    { key: 'performance', label: '성능평가' },
  ];
  const SYS_INSP_PAGE_SIZE = 10;
  const PERFORM_PAGE_SIZE = 10;
  const YEAR_LIST_PAGE_SIZE = 10;
  const OVERVIEW_DETAIL_PAGE_SIZE = 10;

  const OVERVIEW_DETAIL_TYPE_FIELDS = {
    plan: ['maintenancePlan'],
    regular: ['firstHalf', 'midYear', 'secondHalf'],
    precision: ['precision'],
    diagnosis: ['diagnosis'],
    eval: ['eval'],
  };

  const state = {
    activeTab: 'system-inspection',
    selectedSystemRow: null,
    selectedOverviewAgency: null,
    selectedOverviewType: '',
    selectedOverviewStatus: '',
    systemPage: 1,
    regularPage: 1,
    precisionPage: 1,
    diagnosisPage: 1,
    performPage: 1,
    overviewDetailPage: 1,
    planPage: 1,
    facilityAddOpen: false,
    facilityAddSelectedIds: new Set(),
    facilityAddPlans: {},
    planMeta: {
      status: '요청전',
      title: '2026년 군산지방해양수산청 항만시설 유지관리계획',
      reason: '',
      year: '2026',
      applyDate: '2026-08-04',
      agency: '군산지방해양수산청',
    },
    /** 반려 상태에서 재요청 클릭 후 수정 가능 모드 */
    planRejectEditMode: false,
    /** 점검년도별 결재상태·신청정보 (샘플) */
    planYearStates: {
      2026: {
        status: '요청전',
        title: '2026년 군산지방해양수산청 항만시설 유지관리계획',
        reason: '',
        applyDate: '2026-08-04',
      },
      2025: {
        status: '반려',
        title: '2025년 군산지방해양수산청 항만시설 유지관리계획',
        reason: '2025년도 정기안전점검 등 점검주기 도래에 따른 유지관리계획 신청',
        applyDate: '2025-07-18',
      },
      2024: {
        status: '승인',
        title: '2024년 군산지방해양수산청 항만시설 유지관리계획',
        reason: '2024년도 정기안전점검 등 점검주기 도래에 따른 유지관리계획 신청',
        applyDate: '2024-06-12',
      },
    },
    rows: {
      'system-inspection': [...INSP_STATUS_SYSTEM_INSPECTION],
      overview: [...INSP_STATUS_OVERVIEW],
      'overview-detail': [...INSP_STATUS_OVERVIEW_DETAIL],
      plan: typeof INSP_STATUS_PLAN_FACILITIES !== 'undefined' ? INSP_STATUS_PLAN_FACILITIES.map((row) => ({ ...row })) : [],
      regular: [...INSP_STATUS_REGULAR],
      precision: [...INSP_STATUS_PRECISION],
      'precision-diagnosis': [...INSP_STATUS_DIAGNOSIS],
      'perform-evaluation': [...INSP_STATUS_PERFORM_EVAL],
    },
    filtered: {
      'system-inspection': [...INSP_STATUS_SYSTEM_INSPECTION],
      overview: [...INSP_STATUS_OVERVIEW],
      'overview-detail': [],
      plan: typeof INSP_STATUS_PLAN_FACILITIES !== 'undefined' ? INSP_STATUS_PLAN_FACILITIES.map((row) => ({ ...row })) : [],
      regular: [...INSP_STATUS_REGULAR],
      precision: [...INSP_STATUS_PRECISION],
      'precision-diagnosis': [...INSP_STATUS_DIAGNOSIS],
      'perform-evaluation': [...INSP_STATUS_PERFORM_EVAL],
    },
    sort: {
      'system-inspection': { ...DEFAULT_SORT },
      overview: { ...DEFAULT_SORT },
      plan: { ...DEFAULT_SORT },
      regular: { ...DEFAULT_SORT },
      precision: { ...DEFAULT_SORT },
      'precision-diagnosis': { ...DEFAULT_SORT },
      'perform-evaluation': { ...DEFAULT_SORT },
    },
  };

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function isEmptyGrade(grade) {
    return grade == null || grade === '' || grade === '-' || grade === '—';
  }

  function gradeClass(grade) {
    const map = { A: 'a', B: 'b', C: 'c', D: 'd' };
    return `insp-grade insp-grade--${map[grade] || 'b'}`;
  }

  function formatGrade(grade) {
    return isEmptyGrade(grade) ? '-' : grade;
  }

  function formatExtension(value) {
    if (value == null || value === '' || value === '-') return '-';
    const num = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''));
    if (!Number.isFinite(num)) return String(value);
    return num.toLocaleString('ko-KR');
  }

  function regStatusClass(status) {
    if (status === '완료' || status === '등록' || status === '수립') return 'insp-reg insp-reg--ok';
    if (status === '예정') return 'insp-reg insp-reg--plan';
    if (status === '-' || status === '—' || !status) return 'insp-reg insp-reg--empty';
    return 'insp-reg insp-reg--no';
  }

  function renderRegularRoundCell(period, status) {
    const normalized = status === '—' ? '-' : (status || '-');
    if (normalized === '-') {
      return `<td class="col-round"><span class="insp-round-empty">-</span></td>`;
    }
    const periodHtml = period
      ? `<span class="insp-round-period">${period}</span>`
      : '';
    return `<td class="col-round">
      <div class="insp-round-cell">
        ${periodHtml}
        <span class="${regStatusClass(normalized)}">${normalized}</span>
      </div>
    </td>`;
  }

  function formatOverviewStatus(value) {
    if (value === '-') return '-';
    return `<span class="${regStatusClass(value)}">${value}</span>`;
  }

  function overviewRowHasUnregistered(row) {
    return [row.maintenancePlan, row.firstHalf, row.midYear, row.secondHalf, row.precision, row.diagnosis, row.eval]
      .some((value) => value === '미등록' || value === '미수립');
  }

  function overviewRowMatchesStatus(row, type, status) {
    if (!type) return true;
    const detailStatus = getOverviewDetailStatus(row, type);
    if (detailStatus === '대상아님') return false;
    if (!status) return true;
    return detailStatus === status;
  }

  function isUnregisteredConducted(value) {
    return value === '—' || value === '미등록';
  }

  function formatYearValue(value, tab) {
    if ((tab === 'precision' || tab === 'precision-diagnosis' || tab === 'perform-evaluation') && isUnregisteredConducted(value)) {
      return '<span class="insp-reg insp-reg--no">미등록</span>';
    }
    return value;
  }

  function compareValues(key, a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;

    if (key === 'grade') {
      const order = (g) => (isEmptyGrade(g) ? 99 : (GRADE_ORDER[g] || 98));
      return order(a) - order(b);
    }

    if (key === 'classType') {
      return (CLASS_ORDER[a] || 99) - (CLASS_ORDER[b] || 99);
    }

    if (key === 'firstHalf' || key === 'secondHalf' || key === 'round1Status' || key === 'round2Status' || key === 'round3Status' || key === 'yearPerform') {
      const regOrder = { 완료: 0, 등록: 0, 예정: 1, 미수행: 2, 미등록: 2, '-': 3, '—': 3 };
      return (regOrder[a] ?? 99) - (regOrder[b] ?? 99);
    }

    if (key === 'lastInspectDate') {
      const norm = (v) => (isUnregisteredConducted(v) ? '' : String(v));
      return norm(a).localeCompare(norm(b), 'ko', { numeric: true });
    }

    if (key === 'scheduled' || key === 'conducted') {
      const norm = (v) => (isUnregisteredConducted(v) ? '' : String(v));
      return norm(a).localeCompare(norm(b), 'ko', { numeric: true });
    }

    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    const numA = Number(a);
    const numB = Number(b);
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return numA - numB;
    }

    return String(a).localeCompare(String(b), 'ko', { numeric: true });
  }

  function formatSeqNo(index, total, tab) {
    const { key, dir } = state.sort[tab];
    if (key === '__seq__') {
      return dir === 'desc' ? total - index : index + 1;
    }
    return index + 1;
  }

  function getSortedRows(tab) {
    const rows = [...state.filtered[tab]];
    const { key, dir } = state.sort[tab];
    if (!key) return rows;

    if (key === '__seq__') {
      return dir === 'desc' ? [...rows].reverse() : rows;
    }

    const indexed = rows.map((row, index) => ({ row, index }));
    indexed.sort((a, b) => {
      const result = compareValues(key, a.row[key], b.row[key]);
      return dir === 'asc' ? result : -result;
    });

    return indexed.map((item) => item.row);
  }

  function gradeGroup(grade) {
    if (grade === 'A') return 'A';
    if (grade === 'D' || grade === 'E') return 'DE';
    return 'BC';
  }

  function formatRegularCycle(grade) {
    return gradeGroup(grade) === 'DE' ? '연 3회 이상' : '연 2회 이상';
  }

  function formatPrecisionCycle(grade) {
    const g = gradeGroup(grade);
    const buildingYears = { A: 4, BC: 3, DE: 2 };
    const otherYears = { A: 3, BC: 2, DE: 1 };
    return `건축물: ${buildingYears[g]}년에 1회 이상 / 건축물 외 시설물: ${otherYears[g]}년에 1회 이상`;
  }

  function formatDiagnosisCycle(grade) {
    const g = gradeGroup(grade);
    const years = { A: 6, BC: 5, DE: 4 };
    return `건축물: ${years[g]}년에 1회 이상 / 건축물 외 시설물: ${years[g]}년에 1회 이상`;
  }

  function formatEvalCycle() {
    return '5년에 1회 이상';
  }

  function getInspectionCycle(type, grade) {
    if (type === 'regular') return formatRegularCycle(grade);
    if (type === 'precision') return formatPrecisionCycle(grade);
    if (type === 'diagnosis') return formatDiagnosisCycle(grade);
    return formatEvalCycle();
  }

  function formatPlanYear(value) {
    if (value == null || value === '' || value === '—' || value === '-') return '-';
    return value;
  }

  function getSystemViewMode() {
    return document.querySelector('input[name="sysInspViewMode"]:checked')?.value || 'facility';
  }

  function getSystemCheckGroups() {
    const selected = $('#sysInspCheckType')?.value || '';
    if (!selected) return FACILITY_SCHEDULE_GROUPS;
    return FACILITY_SCHEDULE_GROUPS.filter((group) => group.code === selected);
  }

  function isPlanApplied(value) {
    return value != null && value !== '' && value !== '-' && value !== '—' && value !== '신청시기 전';
  }

  function isScheduleTarget(row, prefix) {
    return row[`${prefix}Target`] === true;
  }

  function isScheduleDone(row, prefix) {
    return isScheduleTarget(row, prefix) && isPlanApplied(row[`${prefix}PlanYear`]);
  }

  function getSystemProcessStatus(row, groups = getSystemCheckGroups()) {
    const targets = groups.filter((group) => isScheduleTarget(row, group.prefix));
    if (!targets.length) return 'DONE';
    return targets.some((group) => !isScheduleDone(row, group.prefix)) ? 'NEED' : 'DONE';
  }

  function getSystemProcessStatusName(status) {
    return status === 'NEED' ? '신청필요' : '신청완료';
  }

  function formatSystemProcessStatus(status) {
    const cls = status === 'NEED' ? 'insp-sys-proc insp-sys-proc--need' : 'insp-sys-proc insp-sys-proc--done';
    return `<span class="${cls}">${getSystemProcessStatusName(status)}</span>`;
  }

  function updateSystemSummary(rows) {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val.toLocaleString();
    };
    const groups = getSystemCheckGroups();
    set('sysInspCountTotal', rows.length);
    set('sysInspCountNeed', rows.filter((row) => getSystemProcessStatus(row, groups) === 'NEED').length);
    set('sysInspCountDone', rows.filter((row) => getSystemProcessStatus(row, groups) === 'DONE').length);
  }

  function setResultCount(id, count) {
    const el = document.getElementById(id);
    if (el) el.textContent = Number(count || 0).toLocaleString();
  }

  function getSystemPageSize() {
    return SYS_INSP_PAGE_SIZE;
  }

  function getPerformPageSize() {
    return PERFORM_PAGE_SIZE;
  }

  function getYearListPageSize() {
    return YEAR_LIST_PAGE_SIZE;
  }

  function getOverviewDetailPageSize() {
    return OVERVIEW_DETAIL_PAGE_SIZE;
  }

  function emptyTableRow(colspan) {
    return `<tr><td colspan="${colspan}" style="padding:24px;text-align:center;color:#6b7280;">검색 결과가 없습니다.</td></tr>`;
  }

  function renderInspListPagination(options) {
    const {
      navId,
      totalRows,
      page,
      pageSize,
      onNavigate,
    } = options;

    const nav = document.getElementById(navId);
    if (!nav) return page;

    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
    let currentPage = Math.min(Math.max(page, 1), totalPages);

    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    const arrowIcon = '<img src="assets/main/facility-search/arrow-right.svg" alt="" width="14" height="14">';
    const doubleIcon = '<img src="assets/main/facility-search/arrow-double-right.svg" alt="" width="14" height="14">';

    const pageButtons = [];
    for (let p = start; p <= end; p += 1) {
      pageButtons.push(
        `<button type="button" class="pagination__btn${p === currentPage ? ' is-active' : ''}" data-page="${p}"${p === currentPage ? ' aria-current="page"' : ''}>${p}</button>`
      );
    }

    nav.hidden = totalRows === 0;
    nav.innerHTML = `
      <button type="button" class="pagination__btn" data-page-move="first" aria-label="첫 페이지"${currentPage === 1 ? ' disabled' : ''}>${doubleIcon}</button>
      <button type="button" class="pagination__btn" data-page-move="prev" aria-label="이전 페이지"${currentPage === 1 ? ' disabled' : ''}>${arrowIcon}</button>
      ${pageButtons.join('')}
      <button type="button" class="pagination__btn" data-page-move="next" aria-label="다음 페이지"${currentPage === totalPages ? ' disabled' : ''}>${arrowIcon}</button>
      <button type="button" class="pagination__btn" data-page-move="last" aria-label="마지막 페이지"${currentPage === totalPages ? ' disabled' : ''}>${doubleIcon}</button>
    `;

    nav.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        onNavigate(Number(btn.dataset.page));
      });
    });
    nav.querySelector('[data-page-move="first"]')?.addEventListener('click', () => {
      if (currentPage === 1) return;
      onNavigate(1);
    });
    nav.querySelector('[data-page-move="prev"]')?.addEventListener('click', () => {
      if (currentPage <= 1) return;
      onNavigate(currentPage - 1);
    });
    nav.querySelector('[data-page-move="next"]')?.addEventListener('click', () => {
      if (currentPage >= totalPages) return;
      onNavigate(currentPage + 1);
    });
    nav.querySelector('[data-page-move="last"]')?.addEventListener('click', () => {
      if (currentPage === totalPages) return;
      onNavigate(totalPages);
    });

    return currentPage;
  }

  function renderSystemPagination(totalRows) {
    state.systemPage = renderInspListPagination({
      navId: 'sysInspPagination',
      totalRows,
      page: state.systemPage,
      pageSize: getSystemPageSize(),
      onNavigate: (nextPage) => {
        state.systemPage = nextPage;
        renderSystemInspectionTable();
      },
    });
  }

  function getSystemSortButton(key, label) {
    return `
      <button type="button" class="insp-status-sort" data-sort-key="${key}" aria-label="${label} 정렬">
        <span class="insp-status-sort__label">${label}</span>
        <span class="insp-status-sort__icon" aria-hidden="true"></span>
      </button>
    `;
  }

  function getFacilityType(row) {
    if (row.facilityType) return row.facilityType;
    const name = String(row.name || '');
    if (/방파제|호안/.test(name)) return '외곽시설';
    if (/터미널|창고|건축/.test(name)) return '건축물';
    if (/도로|교량|접안교/.test(name)) return '교통시설';
    if (/크레인|장비/.test(name)) return '기타';
    return '계류시설';
  }

  function updateDueSummary(rows) {
    const yearEl = $('#sysInspDueYear');
    const countEl = $('#sysInspDueCount');
    if (!yearEl && !countEl) return;
    const year = $('#sysInspYear')?.value || '2026';
    if (yearEl) yearEl.textContent = year || '2026';
    if (countEl) countEl.textContent = Number(rows.length || 0).toLocaleString();
  }

  function renderSystemColgroup(table) {
    if (!table) return;
    let colgroup = table.querySelector('colgroup');
    if (!colgroup) {
      colgroup = document.createElement('colgroup');
      table.insertBefore(colgroup, table.firstChild);
    }
    colgroup.innerHTML = `
      <col class="col-no" style="width:48px">
      <col class="col-agency" style="width:148px">
      <col class="col-flex">
      <col class="col-flex">
      <col class="col-type" style="width:88px">
      <col class="col-name" style="width:160px">
      <col class="col-class" style="width:56px">
      <col class="col-grade" style="width:68px">
      <col class="col-check">
      <col class="col-check">
      <col class="col-check">
      <col class="col-check">
    `;
  }

  function renderDueCheckCell(isOn) {
    if (isOn) {
      return `<td class="col-check is-on"><img class="insp-due-check" src="assets/main/inspection-status/icon-check-circle.svg" alt="해당" width="15" height="15"></td>`;
    }
    return `<td class="col-check insp-due-empty">-</td>`;
  }

  function renderSystemInspectionHeader() {
    const thead = $('#systemInspectionTableHead');
    if (!thead) return;
    renderSystemColgroup(thead.closest('table'));

    thead.innerHTML = `
      <tr>
        <th class="col-no" rowspan="2">${getSystemSortButton('__seq__', '연번')}</th>
        <th class="col-agency" rowspan="2">${getSystemSortButton('agency', '관리주체')}</th>
        <th rowspan="2">${getSystemSortButton('port', '항')}</th>
        <th rowspan="2">${getSystemSortButton('subPort', '세부항')}</th>
        <th class="col-type" rowspan="2">${getSystemSortButton('facilityType', '시설구분')}</th>
        <th class="col-name" rowspan="2">${getSystemSortButton('name', '시설물명')}</th>
        <th class="col-class" rowspan="2">${getSystemSortButton('classType', '종구분')}</th>
        <th class="col-grade" rowspan="2">${getSystemSortButton('grade', '시설등급')}</th>
        <th class="col-due-group" colspan="4">점검 대상 여부</th>
      </tr>
      <tr>
        <th class="col-check">${getSystemSortButton('regularTarget', '정기안전점검')}</th>
        <th class="col-check">${getSystemSortButton('precisionTarget', '정밀안전점검')}</th>
        <th class="col-check">${getSystemSortButton('diagnosisTarget', '정밀안전진단')}</th>
        <th class="col-check">${getSystemSortButton('evalTarget', '성능평가')}</th>
      </tr>
    `;
  }

  function sortRowsForTab(tab, rows) {
    const { key, dir } = state.sort[tab];
    if (!key) return rows;
    if (key === '__seq__') {
      return dir === 'desc' ? [...rows].reverse() : rows;
    }

    const indexed = rows.map((row, index) => ({ row, index }));
    indexed.sort((a, b) => {
      const left = key === 'facilityType' ? getFacilityType(a.row) : a.row[key];
      const right = key === 'facilityType' ? getFacilityType(b.row) : b.row[key];
      const result = compareValues(key, left, right);
      if (result === 0) return a.index - b.index;
      return dir === 'asc' ? result : -result;
    });

    return indexed.map((item) => item.row);
  }

  function buildSystemManageRows(rows, groups) {
    const map = new Map();
    rows.forEach((row) => {
      if (!map.has(row.agency)) {
        const summary = {
          agency: row.agency,
          totalCount: 0,
          needCount: 0,
          doneCount: 0,
        };
        FACILITY_SCHEDULE_GROUPS.forEach((group) => {
          summary[`${group.prefix}Target`] = 0;
          summary[`${group.prefix}Done`] = 0;
        });
        map.set(row.agency, summary);
      }

      const summary = map.get(row.agency);
      summary.totalCount += 1;
      if (getSystemProcessStatus(row, groups) === 'NEED') summary.needCount += 1;
      else summary.doneCount += 1;

      FACILITY_SCHEDULE_GROUPS.forEach((group) => {
        if (isScheduleTarget(row, group.prefix)) summary[`${group.prefix}Target`] += 1;
        if (isScheduleDone(row, group.prefix)) summary[`${group.prefix}Done`] += 1;
      });
    });

    return [...map.values()];
  }

  function getSystemDisplayRows() {
    return sortRowsForTab('system-inspection', state.filtered['system-inspection']);
  }

  function renderSystemInspectionTable() {
    const tbody = $('#systemInspectionTableBody');
    if (!tbody) return;

    renderSystemInspectionHeader();

    const allRows = getSystemDisplayRows();
    setResultCount('sysInspResultCount', allRows.length);
    updateDueSummary(allRows);
    const pageSize = getSystemPageSize();
    renderSystemPagination(allRows.length);

    const start = (state.systemPage - 1) * pageSize;
    const rows = allRows.slice(start, start + pageSize);

    tbody.innerHTML = rows.map((row, i) => `
      <tr class="insp-sys-row">
        <td class="col-no">${formatSeqNo(start + i, allRows.length, 'system-inspection')}</td>
        <td class="col-agency">${row.agency}</td>
        <td>${row.port}</td>
        <td>${row.subPort}</td>
        <td class="col-type">${getFacilityType(row)}</td>
        <td class="col-name">${row.name}</td>
        <td class="col-class">${row.classType}</td>
        <td class="col-grade">${formatGrade(row.grade)}</td>
        ${renderDueCheckCell(!!row.regularTarget)}
        ${renderDueCheckCell(!!row.precisionTarget)}
        ${renderDueCheckCell(!!row.diagnosisTarget)}
        ${renderDueCheckCell(!!row.evalTarget)}
      </tr>
    `).join('') || `
      <tr><td colspan="12" style="padding:24px;text-align:center;color:#6b7280;">검색 결과가 없습니다.</td></tr>
    `;
    updateSortHeaderUI('system-inspection');
  }

  function searchSystemInspection() {
    const agency = $('#sysInspAgency')?.value || '';
    const year = $('#sysInspYear')?.value || '';
    const port = $('#sysInspPort')?.value || '';
    const subPort = $('#sysInspSubPort')?.value || '';
    const classType = $('#sysInspClass')?.value || '';
    const name = ($('#sysInspName')?.value || '').trim();
    let rows = [...state.rows['system-inspection']];
    rows = filterByAgency(rows, agency);
    rows = filterByClass(rows, classType);
    if (port) rows = rows.filter((r) => r.port === port);
    if (subPort) rows = rows.filter((r) => r.subPort === subPort);
    if (year) {
      rows = rows.filter((row) =>
        FACILITY_SCHEDULE_GROUPS.some((group) => String(row[`${group.prefix}ScheduleYear`]) === year)
      );
    }
    if (name) rows = rows.filter((r) => r.name.includes(name));
    state.filtered['system-inspection'] = rows;
    state.systemPage = 1;
    renderSystemInspectionTable();
    updateSortHeaderUI('system-inspection');
  }

  function resetSystemInspectionTabState() {
    state.selectedSystemRow = null;
    state.systemPage = 1;
    renderSystemInspectionTable();
    const tableWrap = document.querySelector('[data-panel="system-inspection"] .insp-status-table-wrap');
    if (tableWrap) tableWrap.scrollTop = 0;
  }

  function resetSystemInspection() {
    ['sysInspAgency', 'sysInspYear', 'sysInspPort', 'sysInspSubPort', 'sysInspClass'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    const nameEl = document.getElementById('sysInspName');
    if (nameEl) nameEl.value = '';
    state.selectedSystemRow = null;
    searchSystemInspection();
  }

  function updatePerformSummary(rows) {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val.toLocaleString();
    };
    set('performSummaryTotal', rows.length);
    set('performSummaryTarget', rows.filter((r) => r.isEvalTarget).length);
    setResultCount('performResultCount', rows.length);
  }

  function searchPerformEvaluation() {
    const agency = $('#performAgency')?.value || '';
    const classType = $('#performClass')?.value || '';
    const name = $('#performName')?.value || '';
    let rows = [...state.rows['perform-evaluation']];
    rows = filterByAgency(rows, agency);
    rows = filterByClass(rows, classType);
    rows = filterByName(rows, name);
    state.filtered['perform-evaluation'] = rows;
    state.performPage = 1;
    updatePerformSummary(rows);
    renderPerformEvaluationTable();
    updateSortHeaderUI('perform-evaluation');
  }

  function resetPerformEvaluation() {
    ['performAgency', 'performYear', 'performClass'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    const nameEl = document.getElementById('performName');
    if (nameEl) nameEl.value = '';
    searchPerformEvaluation();
  }

  function isOverviewDetailPage() {
    return document.body.classList.contains('overview-detail-page');
  }

  function isMaintenancePlanManageList() {
    return document.body.classList.contains('maintenance-plan-manage-page') && !isOverviewDetailPage();
  }

  function applyOverviewDetailPageMeta(agency, type = '') {
    if (!isOverviewDetailPage() || !agency) return;
    const typeName = getOverviewTypeName(type);
    const crumb = document.getElementById('overviewDetailCrumb');
    const title = document.getElementById('overviewDetailTitle');
    if (title) title.textContent = typeName ? `${typeName} 상세` : '총괄표 상세';
    if (crumb) crumb.textContent = agency;
    document.title = `${agency} | 총괄표 상세 | POMS 관리자`;
  }

  function openOverviewDetail(agency, type = '', status = '') {
    if (!agency) return;
    if (isOverviewDetailPage()) {
      loadOverviewDetail(agency, type, status);
      return;
    }
    if (isMaintenancePlanManageList()) {
      const params = new URLSearchParams({
        agency,
        type,
        status,
        year: getOverviewYear(),
      });
      window.location.href = `maintenance-plan-manage-overview-detail.html?${params.toString()}`;
      return;
    }
    loadOverviewDetail(agency, type, status);
    renderOverviewTable();
  }

  function showOverviewDetailPanel(show) {
    if (isOverviewDetailPage()) return;
    const panel = $('#overviewDetailPanel');
    if (!panel) return;
    panel.hidden = !show;
    document.body.classList.toggle('insp-modal-open', show);
  }

  function closeOverviewDetailPanel() {
    if (isOverviewDetailPage()) {
      window.location.href = 'maintenance-plan-manage.html?tab=overview';
      return;
    }
    loadOverviewDetail(null);
    renderOverviewTable();
  }

  function updateOverviewDetailSummary(rows) {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val.toLocaleString();
    };
    const unregCount = rows.filter((row) => overviewRowHasUnregistered(row)).length;
    set('overviewDetailSummaryTotal', rows.length);
    set('overviewDetailSummaryUnreg', unregCount);
    set('overviewDetailSummaryReg', rows.length - unregCount);
  }

  function getOverviewTypeName(type) {
    const map = {
      plan: '유지관리계획',
      regular: '정기안전점검',
      precision: '정밀안전점검',
      diagnosis: '정밀안전진단',
      eval: '성능평가',
    };
    return map[type] || '';
  }

  function getOverviewStatusLabel(type, status) {
    if (!status) return '대상';
    if (type === 'plan' && status === '미수립') return '미수립';
    if (status === '미등록' || status === '미실시') return '미실시';
    return status;
  }

  function getOverviewDetailStatus(row, type) {
    if (type === 'plan') return row.maintenancePlan === '미수립' ? '미수립' : '수립';
    const fields = OVERVIEW_DETAIL_TYPE_FIELDS[type] || [];
    const values = fields.map((key) => row[key]).filter((value) => value !== '-');
    if (!values.length) return '대상아님';
    return values.some((value) => value === '미등록') ? '미실시' : '실시';
  }

  function getOverviewScheduledYear(row, type) {
    const map = {
      regular: 'regularScheduledYear',
      precision: 'precisionScheduledYear',
      diagnosis: 'diagnosisScheduledYear',
      eval: 'evalScheduledYear',
    };
    return row[map[type]] || '-';
  }

  function getOverviewFinalDate(row, type) {
    const map = {
      regular: 'regularFinalDate',
      precision: 'precisionFinalDate',
      diagnosis: 'diagnosisFinalDate',
      eval: 'evalFinalDate',
    };
    return row[map[type]] || '-';
  }

  function getOverviewMissingItems(row) {
    const labels = [
      ['regular', '정기안전점검'],
      ['precision', '정밀안전점검'],
      ['diagnosis', '정밀안전진단'],
      ['eval', '성능평가'],
    ];
    return labels
      .filter(([type]) => getOverviewDetailStatus(row, type) === '미실시')
      .map(([, label]) => label)
      .join(', ') || '-';
  }

  function getOverviewPlanRegisterStatus(row, type) {
    const status = getOverviewDetailStatus(row, type);
    if (status === '대상아님') return '대상아님';
    return status === '미실시' ? '-' : '등록';
  }

  function formatOverviewDetailStatus(value) {
    if (value === '미실시' || value === '미수립') {
      return `<span class="insp-reg insp-reg--no">${value}</span>`;
    }
    return value;
  }

  function configureOverviewDetailFilters(type) {
    const typeField = document.getElementById('overviewDetailTypeField');
    const statusField = document.getElementById('overviewDetailStatusField');
    if (typeField) typeField.hidden = true;
    if (statusField) statusField.hidden = type === 'plan';
  }

  function renderOverviewDetailHeader(type) {
    const thead = document.getElementById('overviewDetailTableHead');
    if (!thead) return;

    if (type === 'plan') {
      thead.innerHTML = `
        <tr>
          <th rowspan="2">연번</th>
          <th rowspan="2">관리주체</th>
          <th rowspan="2">항</th>
          <th rowspan="2">세부항</th>
          <th rowspan="2">시설물명</th>
          <th rowspan="2">종구분</th>
          <th rowspan="2">시설등급</th>
          <th rowspan="2">준공년도</th>
          <th colspan="4">계획 등록 현황</th>
        </tr>
        <tr>
          <th>정기</th>
          <th>정밀점검</th>
          <th>진단</th>
          <th>성능평가</th>
        </tr>
      `;
      return;
    }

    thead.innerHTML = `
      <tr>
        <th>연번</th>
        <th>관리주체</th>
        <th>항</th>
        <th>세부항</th>
        <th>시설물명</th>
        <th>종구분</th>
        <th>시설등급</th>
        <th>준공년도</th>
        <th>예정년도</th>
        <th>최종점검진단일</th>
        <th>상태</th>
      </tr>
    `;
  }

  function renderOverviewDetailPagination(totalRows) {
    const pageSize = getOverviewDetailPageSize();
    state.overviewDetailPage = renderInspListPagination({
      navId: 'overviewDetailPagination',
      totalRows,
      page: state.overviewDetailPage,
      pageSize,
      onNavigate: (nextPage) => {
        state.overviewDetailPage = nextPage;
        renderOverviewDetailTable();
      },
    });
  }

  function renderOverviewDetailTable() {
    const tbody = $('#overviewDetailTableBody');
    if (!tbody) return;

    const type = state.selectedOverviewType || 'regular';
    renderOverviewDetailHeader(type);
    const rows = state.filtered['overview-detail'];
    const pageSize = getOverviewDetailPageSize();
    renderOverviewDetailPagination(rows.length);

    const start = (state.overviewDetailPage - 1) * pageSize;
    const pageRows = rows.slice(start, start + pageSize);

    if (type === 'plan') {
      tbody.innerHTML = pageRows.map((row, i) => `
        <tr>
          <td class="col-no">${start + i + 1}</td>
          <td class="is-left">${row.agency}</td>
          <td>${row.port}</td>
          <td>${row.subPort}</td>
          <td class="is-left">${row.name}</td>
          <td>${row.classType}</td>
          <td>${formatGrade(row.grade)}</td>
          <td>${row.completionYear}</td>
          <td>${getOverviewPlanRegisterStatus(row, 'regular')}</td>
          <td>${getOverviewPlanRegisterStatus(row, 'precision')}</td>
          <td>${getOverviewPlanRegisterStatus(row, 'diagnosis')}</td>
          <td>${getOverviewPlanRegisterStatus(row, 'eval')}</td>
        </tr>
      `).join('') || `
        <tr><td colspan="12" style="padding:24px;text-align:center;color:#6b7280;">검색 결과가 없습니다.</td></tr>
      `;
      return;
    }

    tbody.innerHTML = pageRows.map((row, i) => `
      <tr>
        <td class="col-no">${start + i + 1}</td>
        <td class="is-left">${row.agency}</td>
        <td>${row.port}</td>
        <td>${row.subPort}</td>
        <td class="is-left">${row.name}</td>
        <td>${row.classType}</td>
        <td>${formatGrade(row.grade)}</td>
        <td>${row.completionYear}</td>
        <td>${getOverviewScheduledYear(row, type)}</td>
        <td>${getOverviewFinalDate(row, type)}</td>
        <td>${formatOverviewDetailStatus(getOverviewDetailStatus(row, type))}</td>
      </tr>
    `).join('') || `
      <tr><td colspan="11" style="padding:24px;text-align:center;color:#6b7280;">검색 결과가 없습니다.</td></tr>
    `;
  }

  function loadOverviewDetail(agency, type = '', status = '') {
    state.selectedOverviewAgency = agency;
    state.selectedOverviewType = type;
    state.selectedOverviewStatus = type === 'plan'
      ? status
      : (status === '미등록' ? '미실시' : status);
    const targetEl = $('#overviewDetailTarget');
    if (targetEl) {
      const typeName = getOverviewTypeName(type);
      const statusName = getOverviewStatusLabel(type, state.selectedOverviewStatus);
      if (!agency) {
        targetEl.textContent = '';
      } else if (typeName) {
        targetEl.textContent = `${agency} · ${typeName} ${statusName}`.trim();
      } else {
        targetEl.textContent = agency;
      }
    }

    if (!agency) {
      state.filtered['overview-detail'] = [];
      showOverviewDetailPanel(false);
      updateOverviewDetailSummary([]);
      renderOverviewDetailTable();
      return;
    }

    const typeEl = document.getElementById('overviewDetailType');
    const statusEl = document.getElementById('overviewDetailStatus');
    if (typeEl) typeEl.value = type;
    if (statusEl) statusEl.value = type === 'plan' ? '' : state.selectedOverviewStatus;
    configureOverviewDetailFilters(type);
    applyOverviewDetailPageMeta(agency, type);
    showOverviewDetailPanel(true);
    searchOverviewDetail(false);
  }

  function searchOverviewDetail(resetPage = true) {
    if (!state.selectedOverviewAgency) return;

    const name = ($('#overviewDetailName')?.value || '').trim();
    const typeEl = $('#overviewDetailType');
    const statusEl = $('#overviewDetailStatus');
    const type = state.selectedOverviewType || (typeEl ? typeEl.value : '');
    const status = type === 'plan'
      ? state.selectedOverviewStatus
      : (statusEl ? statusEl.value : state.selectedOverviewStatus);

    let rows = state.rows['overview-detail'].filter((row) => row.agency === state.selectedOverviewAgency);
    if (name) rows = rows.filter((row) => row.name.includes(name));
    if (type || status) {
      rows = rows.filter((row) => overviewRowMatchesStatus(row, type, status));
    }

    state.filtered['overview-detail'] = rows;
    if (resetPage) state.overviewDetailPage = 1;
    updateOverviewDetailSummary(rows);
    renderOverviewDetailTable();
  }

  function resetOverviewDetailFilters() {
    const nameEl = document.getElementById('overviewDetailName');
    const typeEl = document.getElementById('overviewDetailType');
    const statusEl = document.getElementById('overviewDetailStatus');
    if (nameEl) nameEl.value = '';
    if (isOverviewDetailPage()) {
      const params = new URLSearchParams(window.location.search);
      const type = params.get('type') || '';
      const status = params.get('status') || '';
      state.selectedOverviewType = type;
      state.selectedOverviewStatus = type === 'plan' ? status : (status === '미등록' ? '미실시' : status);
      if (typeEl) typeEl.value = type;
      if (statusEl) statusEl.value = type === 'plan' ? '' : state.selectedOverviewStatus;
    } else {
      if (typeEl) typeEl.selectedIndex = 0;
      if (statusEl) statusEl.selectedIndex = 0;
      state.selectedOverviewType = '';
      state.selectedOverviewStatus = '';
    }
    state.overviewDetailPage = 1;
    searchOverviewDetail(false);
  }

  function resetOverviewTabState() {
    state.selectedOverviewAgency = null;
    state.overviewDetailPage = 1;
    loadOverviewDetail(null);
    renderOverviewTable();
  }

  function downloadOverviewDetailExcel() {
    if (!state.selectedOverviewAgency) return;

    const rows = state.filtered['overview-detail'];
    const type = state.selectedOverviewType || 'regular';
    const common = ['연번', '관리주체', '항', '세부항', '시설물명', '종구분', '시설등급', '준공년도'];
    const headers = type === 'plan'
      ? [...common, '계획 등록 현황 정기', '계획 등록 현황 정밀점검', '계획 등록 현황 진단', '계획 등록 현황 성능평가']
      : [...common, '예정년도', '최종점검진단일', '상태'];

    const lines = rows.map((row, i) => {
      const base = [
        i + 1,
        row.agency,
        row.port,
        row.subPort,
        row.name,
        row.classType,
        exportGrade(row.grade),
        row.completionYear,
      ];

      if (type === 'plan') {
        return [
          ...base,
          getOverviewPlanRegisterStatus(row, 'regular'),
          getOverviewPlanRegisterStatus(row, 'precision'),
          getOverviewPlanRegisterStatus(row, 'diagnosis'),
          getOverviewPlanRegisterStatus(row, 'eval'),
        ].map(escapeCsv).join(',');
      }

      return [
        ...base,
        getOverviewScheduledYear(row, type),
        getOverviewFinalDate(row, type),
        getOverviewDetailStatus(row, type),
      ].map(escapeCsv).join(',');
    });

    const csv = `\uFEFF${headers.map(escapeCsv).join(',')}\n${lines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    const filePrefix = isOverviewDetailPage() || isMaintenancePlanManageList()
      ? '유지관리계획_총괄표_상세'
      : '점검정보현황_상세점검현황';
    link.download = `${filePrefix}_${state.selectedOverviewAgency}_${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function buildOverviewTotalRow(rows) {
    const sum = (key) => rows.reduce((acc, row) => acc + Number(row[key] || 0), 0);
    const planTarget = sum('planTarget');
    const planMissing = sum('planMissing');
    const regularTarget = sum('regularTarget');
    const regularMissing = sum('regularMissing');
    const precisionTarget = sum('precisionTarget');
    const precisionMissing = sum('precisionMissing');
    const diagnosisTarget = sum('diagnosisTarget');
    const diagnosisMissing = sum('diagnosisMissing');
    const evalTarget = sum('evalTarget');
    const evalMissing = sum('evalMissing');

    return {
      agency: '합계',
      total: sum('total'),
      planTarget,
      planMissing,
      planMissingRatio: calcOverviewRate(planMissing, planTarget),
      regularTarget,
      regularMissing,
      regularMissingRatio: calcOverviewRate(regularMissing, regularTarget),
      precisionTarget,
      precisionMissing,
      precisionMissingRatio: calcOverviewRate(precisionMissing, precisionTarget),
      diagnosisTarget,
      diagnosisMissing,
      diagnosisMissingRatio: calcOverviewRate(diagnosisMissing, diagnosisTarget),
      evalTarget,
      evalMissing,
      evalMissingRatio: calcOverviewRate(evalMissing, evalTarget),
    };
  }

  function renderOverviewMetricCells(row, clickable = true) {
    const metricCell = (value, type, status = '') => clickable
      ? `<td class="col-metric insp-overview-detail-cell" data-overview-agency="${row.agency}" data-overview-type="${type}" data-overview-status="${status}">${Number(value).toLocaleString()}</td>`
      : `<td class="col-metric">${Number(value).toLocaleString()}</td>`;

    return `
      <td class="col-total">${row.total.toLocaleString()}</td>
      <td class="col-metric">${row.planTarget.toLocaleString()}</td>
      ${metricCell(row.planMissing, 'plan', '미수립')}
      <td class="col-rate">${row.planMissingRatio.toFixed(1)}</td>
      ${metricCell(row.regularTarget, 'regular')}
      ${metricCell(row.regularMissing, 'regular', '미등록')}
      <td class="col-rate">${row.regularMissingRatio.toFixed(1)}</td>
      ${metricCell(row.precisionTarget, 'precision')}
      ${metricCell(row.precisionMissing, 'precision', '미등록')}
      <td class="col-rate">${row.precisionMissingRatio.toFixed(1)}</td>
      ${metricCell(row.diagnosisTarget, 'diagnosis')}
      ${metricCell(row.diagnosisMissing, 'diagnosis', '미등록')}
      <td class="col-rate">${row.diagnosisMissingRatio.toFixed(1)}</td>
      ${metricCell(row.evalTarget, 'eval')}
      ${metricCell(row.evalMissing, 'eval', '미등록')}
      <td class="col-rate">${row.evalMissingRatio.toFixed(1)}</td>
    `;
  }

  const OVERVIEW_CURRENT_YEAR = new Date().getFullYear();
  const OVERVIEW_FUTURE_YEARS = 5;
  const OVERVIEW_PAST_YEARS = 2;

  function getOverviewYear() {
    return document.getElementById('overviewYear')?.value || String(OVERVIEW_CURRENT_YEAR);
  }

  function overviewYearLabel(year) {
    return `${year}년 (${yearShort(year)}계획, ${yearShort(year - 1)}실적)`;
  }

  function fillOverviewYearOptions() {
    const select = document.getElementById('overviewYear');
    if (!select) return;
    const start = OVERVIEW_CURRENT_YEAR + OVERVIEW_FUTURE_YEARS;
    const end = OVERVIEW_CURRENT_YEAR - OVERVIEW_PAST_YEARS;
    const current = String(OVERVIEW_CURRENT_YEAR);
    const options = [];
    for (let year = start; year >= end; year -= 1) {
      options.push(`<option value="${year}"${String(year) === current ? ' selected' : ''}>${overviewYearLabel(year)}</option>`);
    }
    select.innerHTML = options.join('');
    select.value = current;
  }

  function yearShort(year) {
    return `'${String(year).slice(-2)}`;
  }

  function updateOverviewLabels() {
    const year = Number(getOverviewYear()) || OVERVIEW_CURRENT_YEAR;
    const prev = year - 1;
    const title = document.getElementById('overviewStepTitle');
    if (title && document.getElementById('overviewFilterForm')) {
      title.textContent = `${year}년 유지관리계획 총괄표 (${yearShort(year)}계획 · ${yearShort(prev)}실적)`;
    }
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    setText('overviewGroupPlan', `${yearShort(year)} 유지관리계획`);
    setText('overviewGroupRegular', `${yearShort(prev)} 정기안전점검`);
    setText('overviewGroupPrecision', `${yearShort(prev)} 정밀안전점검`);
    setText('overviewGroupDiagnosis', `${yearShort(prev)} 정밀안전진단`);
    setText('overviewGroupEval', `${yearShort(prev)} 성능평가`);
  }

  function searchOverview() {
    const agency = document.getElementById('overviewAgency')?.value || '';
    const keyword = (document.getElementById('overviewKeyword')?.value || '').trim().toLowerCase();
    const year = getOverviewYear();

    state.filtered.overview = state.rows.overview.filter((row) => {
      const title = (row.title || `${year}년 유지관리 계획(${row.port || ''})`).toLowerCase();
      const agencyText = (row.agency || '').toLowerCase();
      return (!agency || row.agency === agency)
        && (!keyword || title.includes(keyword) || agencyText.includes(keyword));
    });
    updateOverviewLabels();
    renderOverviewTable();
  }

  function resetOverview() {
    const form = document.getElementById('overviewFilterForm');
    if (form) form.reset();
    fillOverviewYearOptions();
    searchOverview();
  }

  function renderOverviewTable() {
    const tbody = $('#overviewTableBody');
    if (!tbody) return;

    const rows = getSortedRows('overview');
    tbody.innerHTML = rows.map((row, i) => {
      const selected = state.selectedOverviewAgency === row.agency;
      return `
        <tr class="insp-sys-row${selected ? ' is-selected' : ''}">
          <td class="col-no">${formatSeqNo(i, rows.length, 'overview')}</td>
          <td class="is-left col-agency">${row.agency}</td>
          ${renderOverviewMetricCells(row)}
        </tr>
      `;
    }).join('');

    const tfoot = document.getElementById('overviewTableFoot');
    if (tfoot) {
      const totalRow = buildOverviewTotalRow(rows);
      tfoot.innerHTML = rows.length
        ? `
          <tr class="insp-overview-total-row">
            <td colspan="2" class="col-agency">합계 (${rows.length}개 기관)</td>
            ${renderOverviewMetricCells(totalRow, false)}
          </tr>
        `
        : '';
    }

    tbody.querySelectorAll('.insp-overview-detail-cell').forEach((cell) => {
      cell.addEventListener('click', () => {
        openOverviewDetail(cell.dataset.overviewAgency, cell.dataset.overviewType, cell.dataset.overviewStatus);
      });
    });
  }

  function renderRegularTable() {
    const tbody = $('#regularTableBody');
    if (!tbody) return;

    const allRows = getSortedRows('regular');
    setResultCount('regularResultCount', allRows.length);
    const pageSize = getYearListPageSize();
    state.regularPage = renderInspListPagination({
      navId: 'regularPagination',
      totalRows: allRows.length,
      page: state.regularPage,
      pageSize,
      onNavigate: (nextPage) => {
        state.regularPage = nextPage;
        renderRegularTable();
      },
    });

    const start = (state.regularPage - 1) * pageSize;
    const rows = allRows.slice(start, start + pageSize);

    tbody.innerHTML = rows.map((row, i) => `
      <tr>
        <td class="col-no">${formatSeqNo(start + i, allRows.length, 'regular')}</td>
        <td class="is-left col-agency">${row.agency}</td>
        <td class="col-port">${row.port}</td>
        <td class="col-subport">${row.subPort}</td>
        <td class="is-left col-name">${row.name}</td>
        <td class="col-class">${row.classType}</td>
        <td class="col-grade">${formatGrade(row.grade)}</td>
        <td class="col-date">${row.lastInspectDate || '-'}</td>
        ${renderRegularRoundCell(row.round1Period, row.round1Status)}
        ${renderRegularRoundCell(row.round2Period, row.round2Status)}
        ${renderRegularRoundCell(row.round3Period, row.round3Status)}
      </tr>
    `).join('') || emptyTableRow(11);
  }

  function formatPrecisionDate(value) {
    if (isUnregisteredConducted(value)) {
      return '<span class="insp-reg insp-reg--no">미등록</span>';
    }
    return value || '-';
  }

  function formatPrecisionPerform(value) {
    const status = value || '-';
    return `<span class="${regStatusClass(status)}">${status}</span>`;
  }

  function renderFacilityPerformRows(tab, bodyId, paginationId, pageKey, resultCountId, getPageSize) {
    const tbody = document.getElementById(bodyId);
    if (!tbody) return;

    const allRows = getSortedRows(tab);
    if (resultCountId) setResultCount(resultCountId, allRows.length);

    const pageSize = typeof getPageSize === 'function' ? getPageSize() : getYearListPageSize();
    state[pageKey] = renderInspListPagination({
      navId: paginationId,
      totalRows: allRows.length,
      page: state[pageKey],
      pageSize,
      onNavigate: (nextPage) => {
        state[pageKey] = nextPage;
        renderFacilityPerformRows(tab, bodyId, paginationId, pageKey, resultCountId, getPageSize);
      },
    });

    const start = (state[pageKey] - 1) * pageSize;
    const rows = allRows.slice(start, start + pageSize);

    tbody.innerHTML = rows.map((row, i) => `
      <tr>
        <td class="col-no">${formatSeqNo(start + i, allRows.length, tab)}</td>
        <td class="col-agency is-left">${row.agency}</td>
        <td class="col-port">${row.port}</td>
        <td class="col-subport">${row.subPort}</td>
        <td class="col-name is-left">${row.name}</td>
        <td class="col-class">${row.classType}</td>
        <td class="col-grade">${formatGrade(row.grade)}</td>
        <td class="col-date">${formatPrecisionDate(row.lastInspectDate)}</td>
        <td class="col-perform">${formatPrecisionPerform(row.yearPerform)}</td>
      </tr>
    `).join('') || emptyTableRow(9);
  }

  function renderPrecisionTable() {
    renderFacilityPerformRows(
      'precision',
      'precisionTableBody',
      'precisionPagination',
      'precisionPage',
      'precisionResultCount',
      getYearListPageSize
    );
  }

  function renderDiagnosisTable() {
    renderFacilityPerformRows(
      'precision-diagnosis',
      'diagnosisTableBody',
      'diagnosisPagination',
      'diagnosisPage',
      'diagnosisResultCount',
      getYearListPageSize
    );
  }

  function renderPerformEvaluationTable() {
    renderFacilityPerformRows(
      'perform-evaluation',
      'performEvaluationTableBody',
      'performPagination',
      'performPage',
      'performResultCount',
      getPerformPageSize
    );
  }

  function isPlanPage() {
    return Boolean(document.getElementById('planTitleInput'))
      && !document.body.classList.contains('maintenance-plan-manage-page');
  }

  function isPlanLocked() {
    return state.planMeta.status === '승인';
  }

  function isPlanPending() {
    const status = state.planMeta.status;
    return status === '요청중' || status === '승인요청';
  }

  function isPlanRejected() {
    return state.planMeta.status === '반려';
  }

  /** 제목·신청사유·첨부파일 수정: 요청전, 또는 요청중/반려 + 계획수정(수정모드) */
  function canEditPlanContent() {
    const status = state.planMeta.status;
    if (status === '요청전') return true;
    if ((isPlanPending() || status === '반려') && state.planRejectEditMode) return true;
    return false;
  }

  function getPlanRequestButtonLabel() {
    if ((isPlanPending() || isPlanRejected()) && state.planRejectEditMode) return '수정요청';
    if (isPlanPending()) return '계획수정';
    if (isPlanRejected()) return '재요청';
    return '승인요청';
  }

  function escapePlanHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function planStatusClass(status) {
    if (status === '승인') return 'is-approved';
    if (status === '승인요청' || status === '요청중') return 'is-requested';
    if (status === '반려') return 'is-rejected';
    return 'is-before';
  }

  function defaultPlanYearState(year) {
    return {
      status: '요청전',
      title: `${year}년 군산지방해양수산청 항만시설 유지관리계획`,
      reason: '',
      applyDate: `${year}-01-01`,
    };
  }

  function getPlanYearState(year) {
    const key = String(year);
    if (!state.planYearStates[key]) {
      state.planYearStates[key] = defaultPlanYearState(key);
    }
    return state.planYearStates[key];
  }

  function saveCurrentPlanYearState() {
    const year = String(state.planMeta.year || '');
    if (!year) return;
    const titleEl = document.getElementById('planTitleInput');
    const reasonEl = document.getElementById('planReasonInput');
    state.planYearStates[year] = {
      status: state.planMeta.status,
      title: (titleEl?.value ?? state.planMeta.title) || '',
      reason: (reasonEl?.value ?? state.planMeta.reason) || '',
      applyDate: state.planMeta.applyDate,
    };
  }

  function applyPlanYearState(year) {
    const saved = getPlanYearState(year);
    state.planMeta.year = String(year);
    state.planMeta.status = saved.status;
    state.planMeta.title = saved.title;
    state.planMeta.reason = saved.reason;
    state.planMeta.applyDate = saved.applyDate;

    const titleEl = document.getElementById('planTitleInput');
    const reasonEl = document.getElementById('planReasonInput');
    const dateEl = document.getElementById('planDateValue');
    if (titleEl) titleEl.value = saved.title || '';
    if (reasonEl) reasonEl.value = saved.reason || '';
    if (dateEl) dateEl.textContent = saved.applyDate || '-';
  }

  function updatePlanStatusBadge() {
    const badge = document.getElementById('planStatusBadge');
    if (!badge) return;
    badge.textContent = state.planMeta.status;
    badge.classList.remove('is-approved', 'is-requested', 'is-rejected', 'is-before');
    badge.classList.add(planStatusClass(state.planMeta.status));
  }

  function syncPlanYearSelect() {
    const yearSelect = document.getElementById('planYearSelect');
    if (!yearSelect) return;
    const year = String(state.planMeta.year || '');
    if (year && ![...yearSelect.options].some((opt) => opt.value === year)) {
      const opt = document.createElement('option');
      opt.value = year;
      opt.textContent = year;
      yearSelect.appendChild(opt);
    }
    if (year) yearSelect.value = year;
  }

  function canTogglePlanChecks() {
    return canEditPlanContent();
  }

  function updatePlanFormLock() {
    const contentLocked = !canEditPlanContent();
    const approved = isPlanLocked();
    const pending = isPlanPending();
    const title = document.getElementById('planTitleInput');
    const reason = document.getElementById('planReasonInput');
    const file = document.getElementById('planFileInput');
    const fileBtn = document.querySelector('.insp-plan-file-btn');
    const yearSelect = document.getElementById('planYearSelect');
    const requestBtn = document.getElementById('planRequestBtn');
    const actions = document.querySelector('.insp-plan-actions');

    // 제목·신청사유·첨부파일: 요청전 / 계획수정·재요청 후만 수정
    if (title) title.disabled = contentLocked;
    if (reason) reason.disabled = contentLocked;
    if (file) file.disabled = contentLocked;
    if (fileBtn) fileBtn.classList.toggle('is-disabled', contentLocked);
    // 점검년도는 항상 변경 가능
    if (yearSelect) yearSelect.disabled = false;
    syncPlanYearSelect();

    // 승인: 결재이력 버튼만 노출
    if (requestBtn) {
      requestBtn.hidden = approved;
      requestBtn.setAttribute('aria-hidden', approved ? 'true' : 'false');
      requestBtn.disabled = approved;
      requestBtn.textContent = getPlanRequestButtonLabel();
    }
    if (actions) actions.classList.toggle('is-approved-only', approved);
  }

  function handlePlanYearChange() {
    const yearSelect = document.getElementById('planYearSelect');
    if (!yearSelect) return;
    const nextYear = yearSelect.value;
    if (!nextYear || nextYear === String(state.planMeta.year)) return;

    saveCurrentPlanYearState();
    state.planRejectEditMode = false;
    applyPlanYearState(nextYear);
    updatePlanStatusBadge();
    updatePlanFormLock();
    renderPlanTable();
  }

  function planCheckHtml(row, type, label) {
    if (canTogglePlanChecks()) {
      const checked = row[type] ? ' checked' : '';
      return `<input type="checkbox" class="insp-plan-check" data-plan-id="${escapePlanHtml(row.id)}" data-plan-type="${type}" aria-label="${escapePlanHtml(row.name)} ${escapePlanHtml(label)}"${checked}>`;
    }
    return row[type]
      ? `<img class="insp-due-check" src="assets/main/inspection-status/icon-check-circle.svg" alt="${escapePlanHtml(label)}" width="18" height="18">`
      : '';
  }

  function setPlanTypeChecked(id, type, checked) {
    [state.rows.plan, state.filtered.plan].forEach((list) => {
      const row = list.find((item) => item.id === id);
      if (row) row[type] = checked;
    });
  }

  function handlePlanTableChange(event) {
    if (!canTogglePlanChecks()) return;
    const checkbox = event.target.closest('input[data-plan-id][data-plan-type]');
    if (!checkbox) return;
    setPlanTypeChecked(checkbox.dataset.planId, checkbox.dataset.planType, checkbox.checked);
  }

  function renderPlanTable() {
    updatePlanStatusBadge();
    updatePlanFormLock();
    const tbody = document.getElementById('planTableBody');
    if (!tbody) return;

    const allRows = getSortedRows('plan');
    setResultCount('planResultCount', allRows.length);

    tbody.innerHTML = allRows.map((row, i) => `
      <tr>
        <td class="col-no">${formatSeqNo(i, allRows.length, 'plan')}</td>
        <td class="col-agency is-left">${escapePlanHtml(row.agency)}</td>
        <td class="col-port">${escapePlanHtml(row.port)}</td>
        <td class="col-subport">${escapePlanHtml(row.subPort)}</td>
        <td class="col-type">${escapePlanHtml(row.facilityType)}</td>
        <td class="col-class">${escapePlanHtml(row.classType)}</td>
        <td class="col-name is-left">${escapePlanHtml(row.name)}</td>
        ${PLAN_TYPE_KEYS.map((type) => `<td class="col-check">${planCheckHtml(row, type.key, type.label)}</td>`).join('')}
      </tr>
    `).join('') || emptyTableRow(11);
  }

  function searchPlan() {
    if (!isPlanPage()) return;
    state.filtered.plan = [...state.rows.plan];
    renderPlanTable();
  }

  function downloadPlanExcel() {
    const rows = getSortedRows('plan');
    const headers = ['번호', '관리주체', '항', '세부항', '시설구분', '종', '시설물명', '정기안전점검', '정밀안전점검', '정밀안전진단', '성능평가'];
    const lines = rows.map((row, i) => [
      i + 1,
      row.port,
      row.subPort,
      row.facilityType,
      row.classType,
      row.name,
      row.regular ? 'O' : '',
      row.detailed ? 'O' : '',
      row.diagnosis ? 'O' : '',
      row.performance ? 'O' : '',
    ].map(escapeCsv).join(','));
    const csv = `\uFEFF${headers.map(escapeCsv).join(',')}\n${lines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `유지관리계획_신청대상시설물_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function planHistoryHtml() {
    const meta = state.planMeta;
    const steps = [];
    if (meta.status !== '요청전') {
      steps.push({
        title: '신청',
        by: meta.agency,
        date: `${meta.applyDate} 09:20`,
        note: '유지관리계획을 등록하고 승인을 요청했습니다.',
      });
    }
    if (meta.status === '요청중' || meta.status === '승인요청') {
      steps.push({
        title: '요청중',
        by: '관리자',
        date: '-',
        note: '승인 대기 중입니다.',
      });
    }
    if (meta.status === '반려') {
      steps.push({
        title: '반려',
        by: '관리자',
        date: '-',
        note: '신청이 반려되었습니다. 보완 후 재요청할 수 있습니다.',
      });
    }

    const rowsHtml = [
      ['관리기관', meta.agency],
      ['제목', meta.title],
      ['점검년도', `${meta.year}년`],
      ['처리상태', meta.status],
    ].map(([label, value]) => `
      <div class="insp-plan-hist-row">
        <div class="insp-plan-hist-row__label">${escapePlanHtml(label)}</div>
        <div class="insp-plan-hist-row__value">${escapePlanHtml(value)}</div>
      </div>
    `).join('');

    const stepsHtml = steps.length
      ? steps.map((step) => `
          <article class="insp-plan-hist-card">
            <div class="insp-plan-hist-card__head">
              <div>
                <span class="insp-plan-hist-card__badge">${escapePlanHtml(step.title)}</span>
                <span class="insp-plan-hist-card__by">${escapePlanHtml(step.by)}</span>
              </div>
              <span class="insp-plan-hist-card__date">${escapePlanHtml(step.date)}</span>
            </div>
            <p class="insp-plan-hist-card__note">${escapePlanHtml(step.note)}</p>
          </article>
        `).join('')
      : '<p class="insp-plan-hist-empty">결재이력이 없습니다.</p>';

    return `
      <div class="insp-plan-hist-summary">
        <span class="insp-plan-hist-summary__name">${escapePlanHtml(meta.agency)}</span>
        <span class="insp-plan-status ${planStatusClass(meta.status)}">${escapePlanHtml(meta.status)}</span>
      </div>
      <div>${rowsHtml}</div>
      <div>${stepsHtml}</div>
    `;
  }

  function openPlanHistory() {
    closePlanAddPanel();
    const drawer = document.getElementById('planHistoryDrawer');
    const overlay = document.getElementById('planHistoryOverlay');
    const body = document.getElementById('planHistoryBody');
    if (!drawer) return;
    if (body) body.innerHTML = planHistoryHtml();
    overlay.hidden = false;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closePlanHistory() {
    const drawer = document.getElementById('planHistoryDrawer');
    const overlay = document.getElementById('planHistoryOverlay');
    if (overlay) overlay.hidden = true;
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  function fillPlanAddSelect(select, values) {
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">전체</option>' + values.map((value) => `<option value="${escapePlanHtml(value)}">${escapePlanHtml(value)}</option>`).join('');
    select.value = values.includes(current) ? current : '';
  }

  function getPlanAddPool() {
    const source = typeof INSP_STATUS_PLAN_ADD_FACILITIES !== 'undefined' ? INSP_STATUS_PLAN_ADD_FACILITIES : [];
    const selectedIds = new Set(state.rows.plan.map((item) => item.id));
    return source.filter((item) => !selectedIds.has(item.id));
  }

  function getFilteredPlanAddRows() {
    const port = document.getElementById('facilityAddPortFilter')?.value || '';
    const subport = document.getElementById('facilityAddSubportFilter')?.value || '';
    const type = document.getElementById('facilityAddTypeFilter')?.value || '';
    const keyword = document.getElementById('facilityAddKeyword')?.value.trim().toLowerCase() || '';

    return getPlanAddPool().filter((item) => {
      return (!port || item.port === port)
        && (!subport || item.subPort === subport)
        && (!type || item.facilityType === type)
        && (!keyword || item.name.toLowerCase().includes(keyword));
    });
  }

  function setPlanAddOptions() {
    const rowsToAdd = getPlanAddPool();
    fillPlanAddSelect(document.getElementById('facilityAddPortFilter'), [...new Set(rowsToAdd.map((item) => item.port))]);
    fillPlanAddSelect(document.getElementById('facilityAddSubportFilter'), [...new Set(rowsToAdd.map((item) => item.subPort))]);
    fillPlanAddSelect(document.getElementById('facilityAddTypeFilter'), [...new Set(rowsToAdd.map((item) => item.facilityType))]);
  }

  function findPlanAddPoolItem(id) {
    return getPlanAddPool().find((item) => item.id === id) || null;
  }

  function hasCheckedPlanAddPlans(plan) {
    return Boolean(plan?.detailed || plan?.diagnosis || plan?.performance);
  }

  function getPlanAddPlan(itemOrId) {
    const item = typeof itemOrId === 'string' ? findPlanAddPoolItem(itemOrId) : itemOrId;
    const id = typeof itemOrId === 'string' ? itemOrId : itemOrId.id;
    if (!state.facilityAddPlans[id]) {
      state.facilityAddPlans[id] = {
        regular: true,
        detailed: Boolean(item?.detailed),
        diagnosis: Boolean(item?.diagnosis),
        performance: Boolean(item?.performance),
      };
    }
    return state.facilityAddPlans[id];
  }

  function planAddPlanCheckboxHtml(item, type) {
    const plan = getPlanAddPlan(item);
    const checked = plan[type] ? ' checked' : '';
    const label = PLAN_TYPE_KEYS.find((entry) => entry.key === type)?.label || type;
    return `<input type="checkbox" data-add-plan-id="${escapePlanHtml(item.id)}" data-add-plan-type="${type}" aria-label="${escapePlanHtml(item.name)} ${escapePlanHtml(label)}"${checked}>`;
  }

  function renderPlanAddRows() {
    const panel = document.getElementById('facilityAddPanel');
    const overlay = document.getElementById('facilityAddOverlay');
    const tbody = document.getElementById('facilityAddTableBody');
    const count = document.getElementById('facilityAddCount');
    if (!panel || !tbody) return;

    if (state.facilityAddOpen) {
      panel.hidden = false;
      panel.removeAttribute('hidden');
      panel.setAttribute('aria-hidden', 'false');
      overlay?.removeAttribute('hidden');
      overlay && (overlay.hidden = false);
      panel.classList.add('is-open');
      overlay?.classList.add('is-open');
      document.body.classList.add('is-mock-modal-open');
    } else {
      panel.classList.remove('is-open');
      overlay?.classList.remove('is-open');
      panel.hidden = true;
      panel.setAttribute('hidden', '');
      panel.setAttribute('aria-hidden', 'true');
      if (overlay) overlay.hidden = true;
      overlay?.setAttribute('hidden', '');
      if (!document.getElementById('planHistoryDrawer')?.classList.contains('is-open')) {
        document.body.classList.remove('is-mock-modal-open');
      }
    }

    if (!state.facilityAddOpen) {
      tbody.innerHTML = '';
      if (count) count.textContent = '0';
      return;
    }

    const rowsToAdd = getFilteredPlanAddRows();
    if (count) count.textContent = String(rowsToAdd.length);
    tbody.innerHTML = rowsToAdd.length ? rowsToAdd.map((item) => {
      const selected = state.facilityAddSelectedIds.has(item.id);
      return `
      <tr>
        <td>
          <input type="checkbox" data-add-facility-id="${escapePlanHtml(item.id)}" aria-label="${escapePlanHtml(item.name)} 선택"${selected ? ' checked' : ''}>
        </td>
        <td>${escapePlanHtml(item.agency)}</td>
        <td>${escapePlanHtml(item.port)}</td>
        <td>${escapePlanHtml(item.subPort)}</td>
        <td>${escapePlanHtml(item.facilityType)}</td>
        <td>${escapePlanHtml(item.classType)}</td>
        <td>${escapePlanHtml(item.name)}</td>
        <td>${planAddPlanCheckboxHtml(item, 'detailed')}</td>
        <td>${planAddPlanCheckboxHtml(item, 'diagnosis')}</td>
        <td>${planAddPlanCheckboxHtml(item, 'performance')}</td>
      </tr>
    `;
    }).join('') : '<tr><td colspan="10">추가 가능한 시설물이 없습니다.</td></tr>';
  }

  function openPlanAddPanel() {
    if (!canEditPlanContent()) return;
    closePlanHistory();
    state.facilityAddOpen = true;
    state.facilityAddSelectedIds.clear();
    state.facilityAddPlans = {};
    getPlanAddPool().forEach((item) => {
      const plan = getPlanAddPlan(item);
      if (hasCheckedPlanAddPlans(plan)) {
        state.facilityAddSelectedIds.add(item.id);
      }
    });
    const keyword = document.getElementById('facilityAddKeyword');
    if (keyword) keyword.value = '';
    setPlanAddOptions();
    renderPlanAddRows();
    document.getElementById('facilityAddClose')?.focus({ preventScroll: true });
  }

  function closePlanAddPanel() {
    state.facilityAddOpen = false;
    state.facilityAddSelectedIds.clear();
    state.facilityAddPlans = {};
    renderPlanAddRows();
  }

  function registerPlanAddSelection() {
    if (!canEditPlanContent() || state.facilityAddSelectedIds.size === 0) return;
    const rowsToAdd = getPlanAddPool()
      .filter((item) => state.facilityAddSelectedIds.has(item.id))
      .map((item) => ({
        ...item,
        ...getPlanAddPlan(item.id),
        regular: true,
      }));
    state.rows.plan.unshift(...rowsToAdd);
    state.filtered.plan = [...state.rows.plan];
    state.planPage = 1;
    closePlanAddPanel();
    renderPlanTable();
  }

  function handlePlanAddTableChange(event) {
    const rowCheckbox = event.target.closest('input[type="checkbox"][data-add-facility-id]');
    if (rowCheckbox) {
      if (rowCheckbox.checked) {
        state.facilityAddSelectedIds.add(rowCheckbox.dataset.addFacilityId);
        getPlanAddPlan(rowCheckbox.dataset.addFacilityId);
      } else {
        const plan = getPlanAddPlan(rowCheckbox.dataset.addFacilityId);
        plan.regular = true;
        plan.detailed = false;
        plan.diagnosis = false;
        plan.performance = false;
        state.facilityAddSelectedIds.delete(rowCheckbox.dataset.addFacilityId);
      }
      renderPlanAddRows();
      return;
    }

    const planCheckbox = event.target.closest('input[type="checkbox"][data-add-plan-id][data-add-plan-type]');
    if (!planCheckbox || planCheckbox.disabled) return;
    const plan = getPlanAddPlan(planCheckbox.dataset.addPlanId);
    plan[planCheckbox.dataset.addPlanType] = planCheckbox.checked;
    if (hasCheckedPlanAddPlans(plan)) state.facilityAddSelectedIds.add(planCheckbox.dataset.addPlanId);
    else state.facilityAddSelectedIds.delete(planCheckbox.dataset.addPlanId);
    renderPlanAddRows();
  }

  function beginPlanRejectEdit() {
    if (!isPlanRejected() && !isPlanPending()) return;
    state.planRejectEditMode = true;
    updatePlanFormLock();
    renderPlanTable();
  }

  function handlePlanRequestClick() {
    // 요청중(계획수정) / 반려(재요청) 최초 클릭: 수정 모드 진입 (버튼은 수정요청으로 변경)
    if ((isPlanPending() || isPlanRejected()) && !state.planRejectEditMode) {
      beginPlanRejectEdit();
      return;
    }
    submitPlanApproval();
  }

  function submitPlanApproval() {
    if (!canEditPlanContent()) return;
    const titleEl = document.getElementById('planTitleInput');
    const reasonEl = document.getElementById('planReasonInput');
    const yearSelect = document.getElementById('planYearSelect');
    const title = (titleEl?.value || '').trim();
    const reason = (reasonEl?.value || '').trim();
    if (!title) {
      alert('제목을 입력하세요.');
      titleEl?.focus();
      return;
    }
    if (!reason) {
      alert('신청 사유를 입력하세요.');
      reasonEl?.focus();
      return;
    }
    const fileEl = document.getElementById('planFileInput');
    if (!state.planMeta.fileName && !(fileEl?.files?.length)) {
      alert('유지관리계획 파일을 첨부하세요.');
      fileEl?.focus();
      return;
    }
    if (fileEl?.files?.length) state.planMeta.fileName = fileEl.files[0].name;
    const fromRejectEdit = state.planRejectEditMode;
    state.planMeta.title = title;
    state.planMeta.reason = reason;
    if (yearSelect?.value) state.planMeta.year = yearSelect.value;
    state.planMeta.status = '요청중';
    state.planRejectEditMode = false;
    saveCurrentPlanYearState();
    updatePlanStatusBadge();
    updatePlanFormLock();
    renderPlanTable();
    alert(
      fromRejectEdit
        ? '유지관리계획 수정을 요청했습니다. (샘플)'
        : '유지관리계획 승인을 요청했습니다. (샘플)'
    );
  }

  function renderTable(tab) {
    if (tab === 'system-inspection') renderSystemInspectionTable();
    else if (tab === 'overview' || tab === 'plan') {
      if (isPlanPage()) renderPlanTable();
      else renderOverviewTable();
    }
    else if (tab === 'regular') renderRegularTable();
    else if (tab === 'precision') renderPrecisionTable();
    else if (tab === 'precision-diagnosis') renderDiagnosisTable();
    else if (tab === 'perform-evaluation') renderPerformEvaluationTable();
  }

  function renderAllTables() {
    TABS.forEach(renderTable);
  }

  function escapeCsv(value) {
    const text = String(value ?? '');
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  function downloadOverviewExcel() {
    const tab = 'overview';
    const rows = getSortedRows(tab);
    const headers = [
      '연번',
      '관리주체',
      '총시설수',
      '유지관리계획 대상',
      '유지관리계획 미수립',
      '유지관리계획 비율(%)',
      '정기안전점검 대상',
      '정기안전점검 미실시',
      '정기안전점검 비율(%)',
      '정밀안전점검 대상',
      '정밀안전점검 미실시',
      '정밀안전점검 비율(%)',
      '정밀안전진단 대상',
      '정밀안전진단 미실시',
      '정밀안전진단 비율(%)',
      '성능평가 대상',
      '성능평가 미실시',
      '성능평가 비율(%)',
    ];

    const toCsvLine = (row, seq) => [
      seq,
      row.agency,
      row.total,
      row.planTarget,
      row.planMissing,
      row.planMissingRatio.toFixed(1),
      row.regularTarget,
      row.regularMissing,
      row.regularMissingRatio.toFixed(1),
      row.precisionTarget,
      row.precisionMissing,
      row.precisionMissingRatio.toFixed(1),
      row.diagnosisTarget,
      row.diagnosisMissing,
      row.diagnosisMissingRatio.toFixed(1),
      row.evalTarget,
      row.evalMissing,
      row.evalMissingRatio.toFixed(1),
    ].map(escapeCsv).join(',');

    const lines = rows.map((row, i) => toCsvLine(row, formatSeqNo(i, rows.length, tab)));
    if (rows.length) lines.push(toCsvLine(buildOverviewTotalRow(rows), ''));

    const csv = `\uFEFF${headers.map(escapeCsv).join(',')}\n${lines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `점검정보현황_총괄표_${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportGrade(grade) {
    return isEmptyGrade(grade) ? '-' : grade;
  }

  function exportYearValue(value) {
    return isUnregisteredConducted(value) ? '미등록' : value;
  }

  function downloadSystemInspectionExcel() {
    const tab = 'system-inspection';
    const rows = getSystemDisplayRows();
    const headers = [
      '연번',
      '관리주체',
      '항',
      '세부항',
      '시설구분',
      '시설물명',
      '종구분',
      '시설등급',
      '정기안전점검',
      '정밀안전점검',
      '정밀안전진단',
      '성능평가',
    ];

    const yn = (v) => (v ? 'Y' : '-');
    const lines = rows.map((row, i) => [
      formatSeqNo(i, rows.length, tab),
      row.agency,
      row.port,
      row.subPort,
      getFacilityType(row),
      row.name,
      row.classType,
      exportGrade(row.grade),
      yn(row.regularTarget),
      yn(row.precisionTarget),
      yn(row.diagnosisTarget),
      yn(row.evalTarget),
    ].map(escapeCsv).join(','));

    downloadCsv('점검정보현황_점검진단도래', headers, lines);
  }

  function downloadCsv(fileLabel, headers, lines) {
    const csv = `\uFEFF${headers.map(escapeCsv).join(',')}\n${lines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `${fileLabel}_${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadRegularExcel() {
    const tab = 'regular';
    const rows = getSortedRows(tab);
    const headers = [
      '연번',
      '관리주체',
      '항',
      '세부항',
      '시설물명',
      '종구분',
      '안전등급',
      '최종 점검일',
      '1회차 시기',
      '1회차 상태',
      '2회차 시기',
      '2회차 상태',
      '3회차 시기',
      '3회차 상태',
    ];

    const lines = rows.map((row, i) => [
      formatSeqNo(i, rows.length, tab),
      row.agency,
      row.port,
      row.subPort,
      row.name,
      row.classType,
      exportGrade(row.grade),
      row.lastInspectDate || '-',
      row.round1Period || '-',
      row.round1Status || '-',
      row.round2Period || '-',
      row.round2Status || '-',
      row.round3Period || '-',
      row.round3Status || '-',
    ].map(escapeCsv).join(','));

    downloadCsv('점검정보현황_정기안전점검', headers, lines);
  }

  function downloadPrecisionStyleExcel(tab, fileLabel) {
    const rows = getSortedRows(tab);
    const headers = [
      '연번',
      '관리주체',
      '항',
      '세부항',
      '시설물명',
      '종구분',
      '안전등급',
      '최종 점검·진단일',
      '당해연도 수행',
    ];

    const lines = rows.map((row, i) => [
      formatSeqNo(i, rows.length, tab),
      row.agency,
      row.port,
      row.subPort,
      row.name,
      row.classType,
      exportGrade(row.grade),
      exportYearValue(row.lastInspectDate),
      row.yearPerform || '-',
    ].map(escapeCsv).join(','));

    downloadCsv(`점검정보현황_${fileLabel}`, headers, lines);
  }

  function downloadPrecisionExcel() {
    downloadPrecisionStyleExcel('precision', '정밀안전점검');
  }

  function downloadDiagnosisExcel() {
    downloadPrecisionStyleExcel('precision-diagnosis', '정밀안전진단');
  }

  function downloadPerformExcel() {
    downloadPrecisionStyleExcel('perform-evaluation', '성능평가');
  }

  function updateSortHeaderUI(tab) {
    const bodyId = TABLE_BODY_BY_TAB[tab];
    const table = document.getElementById(bodyId)?.closest('table');
    if (!table) return;

    const { key, dir } = state.sort[tab];
    table.querySelectorAll('.insp-status-sort').forEach((btn) => {
      const active = btn.dataset.sortKey === key;
      btn.classList.toggle('is-active', active);
      btn.classList.toggle('is-asc', active && dir === 'asc');
      btn.classList.toggle('is-desc', active && dir === 'desc');
      btn.setAttribute('aria-sort', active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }

  function updateAllSortHeaderUI() {
    Object.keys(TABLE_BODY_BY_TAB).forEach(updateSortHeaderUI);
  }

  function toggleSort(tab, key) {
    const current = state.sort[tab];
    if (current.key === key) {
      current.dir = current.dir === 'asc' ? 'desc' : 'asc';
    } else {
      current.key = key;
      current.dir = 'asc';
    }
    renderTable(tab);
    updateSortHeaderUI(tab);
  }

  function initSortHeaders() {
    Object.entries(TABLE_BODY_BY_TAB).forEach(([tab, bodyId]) => {
      const table = document.getElementById(bodyId)?.closest('table');
      if (!table) return;

      table.querySelectorAll('thead th[data-sort-key]').forEach((th) => {
        const key = th.dataset.sortKey;
        const label = th.textContent.trim();
        th.innerHTML = `
          <button type="button" class="insp-status-sort" data-sort-key="${key}" aria-label="${label} 정렬">
            <span class="insp-status-sort__label">${label}</span>
            <span class="insp-status-sort__icon" aria-hidden="true"></span>
          </button>
        `;
      });

      table.addEventListener('click', (e) => {
        const btn = e.target.closest('.insp-status-sort');
        if (!btn) return;
        toggleSort(tab, btn.dataset.sortKey);
      });
    });
  }

  function updateRegularSummary(rows) {
    const totalEl = $('#regularSummaryTotal');
    const missFirstEl = $('#regularSummaryMissFirst');
    const missSecondEl = $('#regularSummaryMissSecond');
    if (!totalEl) return;

    totalEl.textContent = rows.length.toLocaleString();
    missFirstEl.textContent = rows.filter((r) => r.round1Status === '미등록').length.toLocaleString();
    missSecondEl.textContent = rows.filter((r) => r.round2Status === '미등록').length.toLocaleString();
    setResultCount('regularResultCount', rows.length);
  }

  function updatePrecisionSummary(tab, totalId, targetId) {
    const rows = state.filtered[tab];
    const totalEl = document.getElementById(totalId);
    const targetEl = document.getElementById(targetId);
    if (!totalEl || !targetEl) return;

    totalEl.textContent = rows.length.toLocaleString();
    const pending = rows.filter((r) => isUnregisteredConducted(r.lastInspectDate)).length;
    targetEl.textContent = pending.toLocaleString();
    if (tab === 'precision') setResultCount('precisionResultCount', rows.length);
    if (tab === 'precision-diagnosis') setResultCount('diagnosisResultCount', rows.length);
  }

  function filterByAgency(rows, agency) {
    if (!agency) return rows;
    return rows.filter((r) => r.agency === agency);
  }

  function filterByClass(rows, classType) {
    if (!classType) return rows;
    return rows.filter((r) => r.classType === classType);
  }

  function filterByName(rows, name) {
    const q = String(name || '').trim();
    if (!q) return rows;
    return rows.filter((r) => String(r.name || '').includes(q));
  }

  function searchRegular() {
    const agency = $('#regularAgency')?.value || '';
    const classType = $('#regularClass')?.value || '';
    const name = $('#regularName')?.value || '';
    const vulnerableOnly = $('#regularVulnerable')?.checked;
    let rows = [...state.rows.regular];
    rows = filterByAgency(rows, agency);
    rows = filterByClass(rows, classType);
    rows = filterByName(rows, name);
    if (vulnerableOnly) rows = rows.filter((r) => r.vulnerable);
    state.filtered.regular = rows;
    state.regularPage = 1;
    updateRegularSummary(rows);
    renderRegularTable();
    updateSortHeaderUI('regular');
  }

  function searchPrecision() {
    const agency = $('#precisionAgency')?.value || '';
    const classType = $('#precisionClass')?.value || '';
    const name = $('#precisionName')?.value || '';
    let rows = [...state.rows.precision];
    rows = filterByAgency(rows, agency);
    rows = filterByClass(rows, classType);
    rows = filterByName(rows, name);
    state.filtered.precision = rows;
    state.precisionPage = 1;
    updatePrecisionSummary('precision', 'precisionSummaryTotal', 'precisionSummaryTarget');
    renderPrecisionTable();
    updateSortHeaderUI('precision');
  }

  function searchDiagnosis() {
    const agency = $('#diagnosisAgency')?.value || '';
    const classType = $('#diagnosisClass')?.value || '';
    const name = $('#diagnosisName')?.value || '';
    let rows = [...state.rows['precision-diagnosis']];
    rows = filterByAgency(rows, agency);
    rows = filterByClass(rows, classType);
    rows = filterByName(rows, name);
    state.filtered['precision-diagnosis'] = rows;
    state.diagnosisPage = 1;
    updatePrecisionSummary('precision-diagnosis', 'diagnosisSummaryTotal', 'diagnosisSummaryTarget');
    renderDiagnosisTable();
    updateSortHeaderUI('precision-diagnosis');
  }

  function resetRegular() {
    ['regularAgency', 'regularYear', 'regularClass'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    const nameEl = document.getElementById('regularName');
    if (nameEl) nameEl.value = '';
    const vulnerable = document.getElementById('regularVulnerable');
    if (vulnerable) vulnerable.checked = false;
    searchRegular();
  }

  function resetPrecision() {
    ['precisionAgency', 'precisionClass'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    const nameEl = document.getElementById('precisionName');
    if (nameEl) nameEl.value = '';
    searchPrecision();
  }

  function resetDiagnosis() {
    ['diagnosisAgency', 'diagnosisClass'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    const nameEl = document.getElementById('diagnosisName');
    if (nameEl) nameEl.value = '';
    searchDiagnosis();
  }

  const TAB_BTN_SELECTOR = '.insp-status-tabs__btn, .ua-account-tabs__btn';

  function setActiveTab(tab) {
    if (!document.querySelector(`[data-panel="${tab}"]`)) return;
    if (tab !== 'overview') closePlanAddPanel();
    state.activeTab = tab;

    document.querySelectorAll(TAB_BTN_SELECTOR).forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.tab === tab);
      btn.setAttribute('aria-selected', btn.dataset.tab === tab ? 'true' : 'false');
    });

    document.querySelectorAll('.insp-status-panel').forEach((panel) => {
      const active = panel.dataset.panel === tab;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });

    if (tab === 'system-inspection') {
      resetSystemInspectionTabState();
    } else if (tab === 'overview') {
      if (isPlanPage()) searchPlan();
      else {
        resetOverviewTabState();
        updateOverviewLabels();
      }
    }
  }

  function shouldInit() {
    return document.body.classList.contains('inspection-status-page')
      || document.body.classList.contains('maintenance-plan-manage-page');
  }

  function init() {
    if (
      document.body.classList.contains('inspection-status-page')
      && !document.body.classList.contains('maintenance-plan-manage-page')
      && typeof PomsSidebar !== 'undefined'
    ) {
      PomsSidebar.mount('#sidebar-root', { active: 'inspection-status' });
    }

    initSortHeaders();

    document.querySelectorAll(TAB_BTN_SELECTOR).forEach((btn) => {
      btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
    });

    document.querySelectorAll('[data-reset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.reset;
        if (tab === 'regular') resetRegular();
        else if (tab === 'precision') resetPrecision();
        else if (tab === 'precision-diagnosis') resetDiagnosis();
        else if (tab === 'system-inspection') resetSystemInspection();
        else if (tab === 'perform-evaluation') resetPerformEvaluation();
        else if (tab === 'overview-detail') resetOverviewDetailFilters();
        else if (tab === 'overview') resetOverview();
      });
    });

    document.querySelectorAll('[data-search]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.search;
        if (tab === 'regular') searchRegular();
        else if (tab === 'precision') searchPrecision();
        else if (tab === 'precision-diagnosis') searchDiagnosis();
        else if (tab === 'system-inspection') searchSystemInspection();
        else if (tab === 'perform-evaluation') searchPerformEvaluation();
        else if (tab === 'overview-detail') searchOverviewDetail();
        else if (tab === 'overview') searchOverview();
        else if (tab === 'plan') searchPlan();
      });
    });

    document.getElementById('overviewFilterForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      searchOverview();
    });

    document.getElementById('overviewDetailFilterForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      searchOverviewDetail();
    });

    document.getElementById('planExcelBtn')?.addEventListener('click', downloadPlanExcel);
    document.getElementById('planYearSelect')?.addEventListener('change', handlePlanYearChange);
    document.getElementById('planFileInput')?.addEventListener('change', (e) => {
      const nameEl = document.getElementById('planFileName');
      if (nameEl) nameEl.textContent = e.target.files?.[0]?.name || '선택된 파일 없음';
    });
    document.getElementById('planTableBody')?.addEventListener('change', handlePlanTableChange);
    document.getElementById('facilityAddSearchForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      renderPlanAddRows();
    });
    document.getElementById('facilityAddTableBody')?.addEventListener('change', handlePlanAddTableChange);
    document.getElementById('facilityAddCancel')?.addEventListener('click', closePlanAddPanel);
    document.getElementById('facilityAddClose')?.addEventListener('click', closePlanAddPanel);
    document.getElementById('facilityAddOverlay')?.addEventListener('click', closePlanAddPanel);
    document.getElementById('facilityAddRegister')?.addEventListener('click', registerPlanAddSelection);
    document.getElementById('planHistoryBtn')?.addEventListener('click', openPlanHistory);
    document.getElementById('planHistoryClose')?.addEventListener('click', closePlanHistory);
    document.getElementById('planHistoryOverlay')?.addEventListener('click', closePlanHistory);
    document.getElementById('planRequestBtn')?.addEventListener('click', handlePlanRequestClick);

    document.getElementById('overviewExcelBtn')?.addEventListener('click', downloadOverviewExcel);
    document.getElementById('overviewDetailExcelBtn')?.addEventListener('click', downloadOverviewDetailExcel);
    document.getElementById('precisionExcelBtn')?.addEventListener('click', downloadPrecisionExcel);
    document.getElementById('diagnosisExcelBtn')?.addEventListener('click', downloadDiagnosisExcel);
    document.getElementById('systemInspectionExcelBtn')?.addEventListener('click', downloadSystemInspectionExcel);
    document.getElementById('regularExcelBtn')?.addEventListener('click', downloadRegularExcel);
    document.getElementById('performExcelBtn')?.addEventListener('click', downloadPerformExcel);

    document.querySelectorAll('[data-overview-detail-close]').forEach((btn) => {
      btn.addEventListener('click', closeOverviewDetailPanel);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (state.facilityAddOpen) {
        closePlanAddPanel();
        return;
      }
      const history = document.getElementById('planHistoryDrawer');
      if (history?.classList.contains('is-open')) {
        closePlanHistory();
        return;
      }
      const panel = document.getElementById('overviewDetailPanel');
      if (!panel || panel.hidden) return;
      closeOverviewDetailPanel();
    });

    updateSystemSummary(state.filtered['system-inspection']);
    if (document.getElementById('performEvaluationTableBody')) {
      updatePerformSummary(state.filtered['perform-evaluation']);
    }
    if (document.getElementById('regularTableBody')) {
      updateRegularSummary(state.filtered.regular);
    }
    if (document.getElementById('precisionTableBody')) {
      updatePrecisionSummary('precision', 'precisionSummaryTotal', 'precisionSummaryTarget');
    }
    if (document.getElementById('diagnosisTableBody')) {
      updatePrecisionSummary('precision-diagnosis', 'diagnosisSummaryTotal', 'diagnosisSummaryTarget');
    }
    fillOverviewYearOptions();
    renderAllTables();
    updateOverviewLabels();
    if (isPlanPage()) searchPlan();
    updateAllSortHeaderUI();
    const params = new URLSearchParams(window.location.search);
    if (isOverviewDetailPage()) {
      const agency = params.get('agency');
      const yearEl = document.getElementById('overviewYear');
      if (yearEl && params.get('year')) yearEl.value = params.get('year');
      if (agency) {
        loadOverviewDetail(agency, params.get('type') || '', params.get('status') || '');
      } else {
        window.location.href = 'maintenance-plan-manage.html?tab=overview';
      }
      return;
    }
    const hashTab = (window.location.hash || '').replace(/^#/, '');
    const requestedTab = params.get('tab') || hashTab || 'system-inspection';
    setActiveTab(document.querySelector(`[data-panel="${requestedTab}"]`) ? requestedTab : 'system-inspection');
  }

  if (shouldInit()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
