/**
 * 제 3종 항만시설물 — 목록 / 실태조사 현황
 */
(() => {
  const Data = window.Type3SurveyData;
  if (!Data) return;

  const { SURVEYS, REPORT_QUESTIONS, getReport } = Data;

  const state = {
    surveyFiltered: [...SURVEYS],
    surveyPage: PomsUserTable.createState(),
    surveyKeyword: '',
    surveyKeywordField: 'name',
    surveyFacilityType: '',
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getSurveyFacilityNames(row) {
    return Array.isArray(row.facilityNames) ? row.facilityNames : [];
  }

  function getSurveyFacilityTypes(row) {
    return Array.isArray(row.facilityTypes) ? row.facilityTypes : [];
  }

  function formatMatchListCell(values, matchValue) {
    const list = values.length ? values : [];
    if (!list.length) return '-';

    const kw = (matchValue || '').trim().toLowerCase();
    const matched = [];
    const rest = [];
    list.forEach((value) => {
      if (kw && value.toLowerCase().includes(kw)) matched.push(value);
      else rest.push(value);
    });

    const ordered = kw ? [...matched, ...rest] : list;
    const defaultVisible = 2;
    const visibleLimit = kw ? Math.max(matched.length, defaultVisible) : defaultVisible;
    const visible = ordered.slice(0, Math.min(visibleLimit, ordered.length));
    const hasMore = ordered.length > visible.length;

    const parts = visible.map((value) => {
      const isMatch = kw && value.toLowerCase().includes(kw);
      const text = escapeHtml(value);
      return isMatch ? `<span class="type3-facility-match">${text}</span>` : text;
    });

    if (hasMore) parts.push('<span class="type3-facility-more">...</span>');
    return parts.join(', ');
  }

  function openSurveyDetail(surveyId) {
    location.href = `type3-survey-detail.html?id=${encodeURIComponent(surveyId)}`;
  }

  function openCreateView() {
    location.href = 'type3-survey-create.html';
  }

  function searchSurveys() {
    const agency = $('type3SurveyAgency')?.value || '';
    const facilityType = $('type3SurveyFacilityType')?.value || '';
    const status = $('type3SurveyStatus')?.value || '';
    const keywordField = $('type3SurveyKeywordField')?.value || 'name';
    const keyword = ($('type3SurveyKeyword')?.value || '').trim();

    state.surveyKeyword = keyword;
    state.surveyKeywordField = keywordField;
    state.surveyFacilityType = facilityType;

    state.surveyFiltered = SURVEYS.filter((row) => {
      if (agency && row.agency !== agency) return false;
      if (status && row.status !== status) return false;
      if (facilityType) {
        const types = getSurveyFacilityTypes(row);
        if (!types.includes(facilityType)) return false;
      }
      if (keyword && keywordField === 'manageNo' && !row.manageNo.includes(keyword)) return false;
      if (keyword && keywordField === 'name') {
        const names = getSurveyFacilityNames(row);
        const hit = names.some((name) => name.includes(keyword));
        if (!hit) return false;
      }
      return true;
    });
    state.surveyPage.page = 1;
    renderSurveyTable();
  }

  function renderSurveyTable() {
    const tbody = $('type3SurveyTableBody');
    if (!tbody) return;

    const rows = state.surveyFiltered;
    const totalEl = $('type3SurveyTotal');
    if (totalEl) totalEl.textContent = rows.length.toLocaleString();

    PomsUserTable.mountFoot({
      paginationId: 'type3SurveyPagination',
      state: state.surveyPage,
      totalRows: rows.length,
      onChange: renderSurveyTable,
    });

    const pageRows = PomsUserTable.slicePage(rows, state.surveyPage.page, state.surveyPage.pageSize);
    const start = (state.surveyPage.page - 1) * state.surveyPage.pageSize;
    const nameKeyword = state.surveyKeywordField === 'name' ? state.surveyKeyword : '';
    const typeKeyword = state.surveyFacilityType;

    tbody.innerHTML = pageRows.map((row, i) => `
      <tr class="type3-survey-row" tabindex="0" data-survey-id="${row.id}">
        <td class="col-no">${start + i + 1}</td>
        <td class="col-manage-no">${escapeHtml(row.manageNo)}</td>
        <td class="col-agency"><strong>${escapeHtml(row.agency)}</strong></td>
        <td class="col-period">${escapeHtml(row.period)}</td>
        <td class="col-dept">${escapeHtml(row.department)}</td>
        <td class="col-manager">${escapeHtml(row.manager)}</td>
        <td class="type3-col-facilities is-left">${formatMatchListCell(getSurveyFacilityNames(row), nameKeyword)}</td>
        <td class="type3-col-types is-left">${formatMatchListCell(getSurveyFacilityTypes(row), typeKeyword)}</td>
        <td class="col-facility-count">${row.facilityCount}</td>
        <td class="col-status">${escapeHtml(row.status)}</td>
      </tr>
    `).join('') || '<tr><td colspan="10" style="padding:24px;text-align:center;color:#6b7280;">조회된 실태조사가 없습니다.</td></tr>';

    tbody.querySelectorAll('.type3-survey-row').forEach((tr) => {
      const open = () => openSurveyDetail(tr.dataset.surveyId);
      tr.addEventListener('click', open);
      tr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });
  }

  /* ---------- 실태조사 결과 팝업 ---------- */

  const GRADE_COLS = ['a', 'b', 'c', 'd', 'e', 'none'];
  const CHECK = '<span class="type3-report-check" aria-hidden="true">✔</span>';

  function openReport({ name, manageNo, date }) {
    const modal = $('type3ReportModal');
    if (!modal) return;
    const report = getReport(name, manageNo, date);

    $('type3ReportName').textContent = name;
    $('type3ReportType').textContent = report.facilityType;
    $('type3ReportDate').textContent = report.date;
    $('type3ReportAssignee').textContent = report.assignee || '';
    $('type3ReportOwner').textContent = report.ownerContact
      ? `${report.owner} - 담당자 : ( ${report.ownerContact} )`
      : report.owner;
    $('type3ReportEngineer').textContent = `성명 : ${report.engineer.name}    소속 : ${report.engineer.org}    연락처 : ${report.engineer.contact}`;
    $('type3ReportScore').textContent = report.score;
    $('type3ReportSafety').textContent = report.safety;
    $('type3ReportSafety').classList.toggle('is-warn', report.safety !== '양호');
    $('type3ReportUrgent').textContent = report.urgent;
    $('type3ReportDefect').textContent = report.majorDefect;
    $('type3ReportDiagnosis').textContent = report.diagnosis;
    $('type3ReportAction').textContent = report.action;
    $('type3ReportOpinion').textContent = report.opinion;

    const sub = $('type3ReportModalSub');
    if (sub) sub.textContent = name;

    const evalBody = $('type3ReportEvalBody');
    if (evalBody) {
      evalBody.innerHTML = report.rows.map((row, i) => `
        <tr>
          <td class="is-left type3-report-eval__item">${REPORT_QUESTIONS[i]}</td>
          <td class="is-left type3-report-eval__opinion">${row.opinion}</td>
          <td>${row.repair ? CHECK : ''}</td>
          ${GRADE_COLS.map((grade) => `<td>${row.grade === grade ? CHECK : ''}</td>`).join('')}
        </tr>
      `).join('');
    }

    modal.hidden = false;
    document.body.classList.add('insp-modal-open');
  }

  function closeReport() {
    const modal = $('type3ReportModal');
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('insp-modal-open');
  }

  /* ---------- 실태조사 현황 탭 ---------- */

  const STATUS_ROWS = [
    { name: '1부두 창고', type: '기타건축물', agency: '해양수산부', owner: '군산지방해양수산청', assignee: '', count: 2, lastDate: '2023-05-02', lastResult: '주의관찰', lastNo: '2023', builtYear: '1979', designated: '미지정', engineer: '이남규', score: '5.4', status: '조사완료' },
    { name: '1부두 창고', type: '기타건축물', agency: '해양수산부', owner: '군산지방해양수산청', assignee: '', count: 1, lastDate: '2025-08-19', lastResult: '주의관찰', lastNo: '2025', builtYear: '1979', designated: '미지정', engineer: '이남규', score: '7.57', status: '조사완료' },
    { name: '4부두물양장(동빈)', type: '기타토목시설', agency: '해양수산부', owner: '포항지방해양수산청', assignee: '', count: 2, lastDate: '2023-04-28', lastResult: '양호', lastNo: '2023', builtYear: '1992', designated: '미지정', engineer: '배예빈', score: '90', status: '조사완료' },
    { name: 'SK부두', type: '기타토목시설', agency: '해양수산부', owner: '마산지방해양수산청', assignee: '', count: 1, lastDate: '2025-07-21', lastResult: '주의관찰', lastNo: '2025', builtYear: '1983', designated: '미지정', engineer: '이남규', score: '6.2', status: '조사완료' },
    { name: 'SK부두', type: '기타토목시설', agency: '해양수산부', owner: '마산지방해양수산청', assignee: '', count: 2, lastDate: '2023-05-03', lastResult: '주의관찰', lastNo: '2023', builtYear: '1983', designated: '미지정', engineer: '배예빈', score: '5.8', status: '조사완료' },
    { name: '감천항 도류제', type: '기타토목시설', agency: '부산지방해양수산청', owner: '부산지방해양수산청', assignee: '', count: 1, lastDate: '2024-05-17', lastResult: '주의관찰', lastNo: '2024', builtYear: '2013', designated: '미지정', engineer: '이남규', score: '6.5', status: '조사완료' },
    { name: '갑문 북방파제', type: '기타토목시설', agency: '해양수산부', owner: '인천지방해양수산청', assignee: '', count: 1, lastDate: '2025-07-30', lastResult: '주의관찰', lastNo: '2025', builtYear: '1977', designated: '미지정', engineer: '이남규', score: '6.1', status: '조사완료' },
    { name: '갑문 북방파제', type: '기타토목시설', agency: '해양수산부', owner: '인천지방해양수산청', assignee: '', count: 2, lastDate: '2023-05-26', lastResult: '주의관찰', lastNo: '2023', builtYear: '1977', designated: '미지정', engineer: '배예빈', score: '5.9', status: '조사완료' },
    { name: '고대부두 1번선석', type: '기타토목시설', agency: '해양수산부', owner: '평택지방해양수산청', assignee: '', count: 2, lastDate: '2022-07-26', lastResult: '주의관찰', lastNo: '2022', builtYear: '1997', designated: '미지정', engineer: '이남규', score: '6.0', status: '조사완료' },
    { name: '국제2잔교', type: '기타토목시설', agency: '인천항만공사', owner: '인천항만공사', assignee: '', count: 1, lastDate: '2025-08-21', lastResult: '주의관찰', lastNo: '2025', builtYear: '1995', designated: '미지정', engineer: '이남규', score: '6.4', status: '조사중' },
    { name: '물양장(당섬)', type: '기타토목시설', agency: '해양수산부', owner: '인천지방해양수산청', assignee: '', count: 1, lastDate: '2025-09-18', lastResult: '양호', lastNo: '2025', builtYear: '1995', designated: '미지정', engineer: '배예빈', score: '8.2', status: '조사완료' },
    { name: '송도부두(1)', type: '기타토목시설', agency: '해양수산부', owner: '포항지방해양수산청', assignee: '', count: 1, lastDate: '2025-07-03', lastResult: '양호', lastNo: '2025', builtYear: '1984', designated: '미지정', engineer: '배예빈', score: '8.5', status: '조사완료' },
  ];

  const HISTORY_OVERRIDES = {
    '1부두 창고': [
      { manageNo: '2023', date: '2023-05-02', assignee: '', engineer: '이남규', score: '5.4', safety: '주의관찰', urgent: '', diagnosis: '', action: '', defect: '', status: '조사완료' },
      { manageNo: '2020', date: '2020-12-14', assignee: '', engineer: '배예빈', score: '90', safety: '양호', urgent: '', diagnosis: '', action: '', defect: '', status: '조사완료' },
    ],
  };

  const statusState = {
    filtered: [...STATUS_ROWS],
    page: PomsUserTable.createState(),
    selectedName: '',
  };

  function getHistoryRows(name) {
    if (HISTORY_OVERRIDES[name]) return HISTORY_OVERRIDES[name];
    return STATUS_ROWS
      .filter((row) => row.name === name)
      .map((row) => ({
        manageNo: row.lastNo,
        date: row.lastDate,
        assignee: row.assignee,
        engineer: row.engineer,
        score: row.score,
        safety: row.lastResult,
        urgent: '',
        diagnosis: '',
        action: '',
        defect: '',
        status: '조사완료',
      }));
  }

  function searchStatus() {
    const agency = $('type3StatusAgency')?.value || '';
    const type = $('type3StatusFacilityType')?.value || '';
    const progress = $('type3StatusProgress')?.value || '';
    const keywordField = $('type3StatusKeywordField')?.value || 'name';
    const keyword = ($('type3StatusKeyword')?.value || '').trim();

    statusState.filtered = STATUS_ROWS.filter((row) => {
      if (agency && row.agency !== agency) return false;
      if (type && row.type !== type) return false;
      if (progress && row.status !== progress) return false;
      if (keyword && keywordField === 'manageNo' && !(row.lastNo || '').includes(keyword)) return false;
      if (keyword && keywordField === 'name' && !(row.name || '').includes(keyword)) return false;
      return true;
    });
    statusState.page.page = 1;
    hideHistory();
    renderStatusTable();
  }

  function renderStatusTable() {
    const tbody = $('type3StatusTableBody');
    if (!tbody) return;

    const rows = statusState.filtered;
    const totalEl = $('type3StatusTotal');
    if (totalEl) totalEl.textContent = rows.length.toLocaleString();

    PomsUserTable.mountFoot({
      paginationId: 'type3StatusPagination',
      state: statusState.page,
      totalRows: rows.length,
      onChange: renderStatusTable,
    });

    const pageRows = PomsUserTable.slicePage(rows, statusState.page.page, statusState.page.pageSize);
    const start = (statusState.page.page - 1) * statusState.page.pageSize;

    tbody.innerHTML = pageRows.map((row, i) => {
      const selected = statusState.selectedName === row.name ? ' is-selected' : '';
      return `
        <tr class="type3-status-row${selected}" data-facility-name="${row.name}">
          <td class="col-no">${start + i + 1}</td>
          <td><a href="#" class="type3-facility-link" data-status-name="${row.name}">${row.name}</a></td>
          <td>${row.type}</td>
          <td>${row.owner}</td>
          <td class="col-assignee">${row.assignee}</td>
          <td>${row.count}</td>
          <td>${row.lastDate}</td>
          <td>${row.lastResult}</td>
          <td>${row.lastNo}</td>
          <td class="col-built">${row.builtYear}</td>
          <td>${row.designated}</td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="11" style="padding:24px;text-align:center;color:#6b7280;">조회된 시설물이 없습니다.</td></tr>';

    tbody.querySelectorAll('[data-status-name]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        selectStatusFacility(link.dataset.statusName);
      });
    });
  }

  function hideHistory() {
    statusState.selectedName = '';
    const section = $('type3HistorySection');
    if (section) section.hidden = true;
  }

  function selectStatusFacility(name) {
    statusState.selectedName = name;
    renderStatusTable();

    const section = $('type3HistorySection');
    const title = $('type3HistoryTitle');
    if (title) title.textContent = name;
    if (section) section.hidden = false;
    renderHistoryTable();
    section?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderHistoryTable() {
    const tbody = $('type3HistoryTableBody');
    if (!tbody || !statusState.selectedName) return;

    const rows = getHistoryRows(statusState.selectedName);
    tbody.innerHTML = rows.map((row, i) => `
      <tr>
        <td class="col-no">${i + 1}</td>
        <td>${row.manageNo}</td>
        <td>${row.date}</td>
        <td>${row.assignee}</td>
        <td>${row.engineer}</td>
        <td>${row.score}</td>
        <td>${row.safety}</td>
        <td>${row.urgent}</td>
        <td>${row.diagnosis}</td>
        <td>${row.action}</td>
        <td>${row.defect}</td>
        <td>${row.status}</td>
        <td><button type="button" class="type3-select-btn" data-history-no="${row.manageNo}" data-history-date="${row.date}">선택</button></td>
      </tr>
    `).join('') || '<tr><td colspan="13" style="padding:24px;text-align:center;color:#6b7280;">조회된 이력이 없습니다.</td></tr>';

    tbody.querySelectorAll('.type3-select-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        openReport({
          name: statusState.selectedName,
          manageNo: btn.dataset.historyNo,
          date: btn.dataset.historyDate,
        });
      });
    });
  }

  function escapeCsvValue(value) {
    const text = String(value ?? '');
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function downloadCsvFile(fileLabel, headers, lines) {
    const csv = `\uFEFF${headers.map(escapeCsvValue).join(',')}\n${lines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `${fileLabel}_${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadStatusExcel() {
    const headers = ['No', '시설물명', '시설물종류', '관리주체', '조사담당자', '조사횟수', '최근조사일', '최근조사결과', '최근조사번호', '준공일', '지정유무'];
    const lines = statusState.filtered.map((row, i) => [
      i + 1, row.name, row.type, row.owner, row.assignee, row.count,
      row.lastDate, row.lastResult, row.lastNo, row.builtYear, row.designated,
    ].map(escapeCsvValue).join(','));
    downloadCsvFile('3종시설물_실태조사현황', headers, lines);
  }

  function downloadHistoryExcel() {
    if (!statusState.selectedName) return;
    const headers = ['No', '관리번호', '조사일자', '조사담당자', '책임기술자', '점수', '안전상태', '긴급안전점검', '정밀안전진단', '안전조치', '중대결함', '상태'];
    const lines = getHistoryRows(statusState.selectedName).map((row, i) => [
      i + 1, row.manageNo, row.date, row.assignee, row.engineer, row.score,
      row.safety, row.urgent, row.diagnosis, row.action, row.defect, row.status,
    ].map(escapeCsvValue).join(','));
    downloadCsvFile(`3종시설물_실태조사이력_${statusState.selectedName}`, headers, lines);
  }

  function setActiveTab(tab) {
    document.querySelectorAll('.insp-status-tabs__btn').forEach((btn) => {
      const active = btn.dataset.tab === tab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('.insp-status-panel').forEach((panel) => {
      const active = panel.dataset.panel === tab;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  }

  function init() {
    PomsSidebar.mount('#sidebar-root', { active: 'type3-port' });

    document.querySelectorAll('.insp-status-tabs__btn').forEach((btn) => {
      btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
    });

    const params = new URLSearchParams(location.search);
    const initialTab = params.get('tab');
    if (initialTab === 'survey-status' || initialTab === 'survey') {
      setActiveTab(initialTab);
    }

    $('type3SurveySearchBtn')?.addEventListener('click', searchSurveys);
    $('type3SurveyKeyword')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchSurveys();
    });
    $('type3SurveyAddBtn')?.addEventListener('click', openCreateView);

    $('type3StatusSearchBtn')?.addEventListener('click', searchStatus);
    $('type3StatusKeyword')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchStatus();
    });
    $('type3StatusExcelBtn')?.addEventListener('click', downloadStatusExcel);
    $('type3HistoryExcelBtn')?.addEventListener('click', downloadHistoryExcel);

    document.querySelectorAll('[data-close-type3-report]').forEach((el) => {
      el.addEventListener('click', closeReport);
    });
    document.addEventListener('keydown', (e) => {
      const modal = $('type3ReportModal');
      if (e.key === 'Escape' && modal && !modal.hidden) closeReport();
    });
    $('type3ReportPrintBtn')?.addEventListener('click', () => window.print());

    renderSurveyTable();
    renderStatusTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
