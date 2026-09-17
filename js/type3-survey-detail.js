/**
 * 제 3종 항만시설물 — 실태조사 상세
 */
(() => {
  const Data = window.Type3SurveyData;
  if (!Data) return;

  const { FACILITIES, STEP_META, REPORT_QUESTIONS, getSurvey, getReport } = Data;

  const state = {
    selectedSurvey: null,
    step: 'target',
    stepFiltered: [...FACILITIES],
    stepPage: PomsUserTable.createState({ pageSize: 10 }),
  };

  const GRADE_COLS = ['a', 'b', 'c', 'd', 'e', 'none'];
  const CHECK = '<span class="type3-report-check" aria-hidden="true">✔</span>';

  function $(id) {
    return document.getElementById(id);
  }

  function goList() {
    location.href = 'type3-port-facility.html';
  }

  function fillSurveyInfo(survey) {
    state.selectedSurvey = survey;

    $('type3InfoAgency').textContent = survey.agency;
    $('type3InfoManager').textContent = `${survey.department} ${survey.manager} (${survey.managerContact})`;
    $('type3InfoManageNo').textContent = survey.manageNo;
    $('type3InfoPeriod').textContent = survey.period;
    $('type3InfoStatus').textContent = survey.status;

    const breadcrumb = $('type3DetailBreadcrumb');
    if (breadcrumb) breadcrumb.textContent = `관리번호 ${survey.manageNo}`;

    const fileName = $('type3InfoFileName');
    if (fileName) fileName.textContent = survey.file;
    else if ($('type3InfoFile')) $('type3InfoFile').textContent = survey.file;
  }

  function setStep(step) {
    if (!STEP_META[step]) return;
    state.step = step;
    const meta = STEP_META[step];

    document.querySelectorAll('[data-survey-step]').forEach((btn) => {
      const active = btn.dataset.surveyStep === step;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    const listTitle = $('type3StepListTitle');
    if (listTitle) listTitle.textContent = meta.title;

    const stateLabel = $('type3StepStateLabel');
    if (stateLabel) stateLabel.textContent = meta.stateLabel;
    const stateSelect = $('type3StepState');
    if (stateSelect) {
      stateSelect.innerHTML = `<option value="">전체</option>${meta.stateOptions
        .map((opt) => `<option value="${opt}">${opt}</option>`)
        .join('')}`;
    }

    const ownerLabel = $('type3StepOwnerLabel');
    if (ownerLabel) ownerLabel.textContent = meta.ownerLabel;
    const ownerInput = $('type3StepOwner');
    if (ownerInput) ownerInput.value = '';

    const guideNote = $('type3StepGuideNote');
    if (guideNote) guideNote.hidden = !meta.guide;

    const keyword = $('type3StepKeyword');
    if (keyword) keyword.value = '';

    state.stepFiltered = [...FACILITIES];
    state.stepPage = PomsUserTable.createState({ pageSize: 10 });
    renderStepTable();
  }

  function searchStepFacilities() {
    const type = $('type3StepFacilityType')?.value || '';
    const yearFrom = Number($('type3StepYearFrom')?.value || 0);
    const yearTo = Number($('type3StepYearTo')?.value || 9999);
    const keywordField = $('type3StepKeywordField')?.value || 'name';
    const keyword = ($('type3StepKeyword')?.value || '').trim();
    const owner = ($('type3StepOwner')?.value || '').trim();

    state.stepFiltered = FACILITIES.filter((row) => {
      if (type && row.type !== type) return false;
      const year = Number(row.builtYear);
      if (yearFrom && year < yearFrom) return false;
      if (yearTo !== 9999 && yearTo && year > yearTo) return false;
      if (keyword && !(row[keywordField] || '').includes(keyword)) return false;
      if (owner) {
        const target = state.step === 'target' ? row.owner : (row.assignee || '');
        if (!target.includes(owner)) return false;
      }
      return true;
    });
    state.stepPage.page = 1;
    renderStepTable();
  }

  /* Figma 195:4089 column widths (sum 1260) — applied by index for all STEPs */
  /* no↓ name↑ type scale↑ address year↓ owner↑ note↓ */
  const STEP_COL_WIDTHS = [60, 160, 120, 160, 400, 100, 160, 100];
  const STEP_COL_CLASS = {
    번호: 'col-no',
    시설물명: 'col-name',
    시설물종류: 'col-type',
    시설물규모: 'col-scale',
    소재지: 'col-address',
    준공일: 'col-year',
    관리주체: 'col-owner',
    비고: 'col-note',
    조사담당자: 'col-assignee',
    담당자: 'col-assignee',
    실태조사일: 'col-date',
  };

  function colClassFor(label, index) {
    return STEP_COL_CLASS[label] || `col-i${index}`;
  }

  function renderStepTable() {
    const thead = $('type3StepTableHead');
    const tbody = $('type3StepTableBody');
    const colgroup = $('type3StepTableCols');
    if (!thead || !tbody) return;

    const meta = STEP_META[state.step];
    if (colgroup) {
      colgroup.innerHTML = meta.columns
        .map((_, i) => {
          const w = STEP_COL_WIDTHS[i] || STEP_COL_WIDTHS[STEP_COL_WIDTHS.length - 1];
          return `<col class="col-w${w}" style="width:calc(${w} / 1260 * 100%)">`;
        })
        .join('');
    }

    thead.innerHTML = `<tr>${meta.columns
      .map((label, i) => `<th scope="col" class="${colClassFor(label, i)}">${label}</th>`)
      .join('')}</tr>`;

    const rows = state.stepFiltered;
    const totalEl = $('type3StepTotal');
    if (totalEl) totalEl.textContent = rows.length.toLocaleString();

    PomsUserTable.mountFoot({
      paginationId: 'type3StepPagination',
      state: state.stepPage,
      totalRows: rows.length,
      onChange: renderStepTable,
    });

    const pageRows = PomsUserTable.slicePage(rows, state.stepPage.page, state.stepPage.pageSize);
    const start = (state.stepPage.page - 1) * state.stepPage.pageSize;

    tbody.innerHTML = pageRows.map((row, i) => {
      const no = start + i + 1;
      if (state.step === 'assign') {
        return `<tr>
          <td class="col-no">${no}</td>
          <td class="col-name is-name"><span class="type3-name-cell">${row.name}</span></td>
          <td class="col-assignee">${row.assignee || ''}</td>
          <td class="col-type">${row.type}</td>
          <td class="col-address">${row.address}</td>
          <td class="col-year">${row.builtYear}</td>
          <td class="col-owner">${row.owner}</td>
          <td class="col-scale">${row.scale}</td>
        </tr>`;
      }
      if (state.step === 'conduct') {
        return `<tr>
          <td class="col-no">${no}</td>
          <td class="col-name is-name"><a href="#" class="type3-facility-link" data-facility-name="${row.name}">${row.name}</a></td>
          <td class="col-assignee">${row.assignee || ''}</td>
          <td class="col-date">${row.surveyDate}</td>
          <td class="col-type">${row.type}</td>
          <td class="col-address">${row.address}</td>
          <td class="col-year">${row.builtYear}</td>
          <td class="col-owner">${row.owner}</td>
        </tr>`;
      }
      return `<tr>
        <td class="col-no">${no}</td>
        <td class="col-name is-name"><span class="type3-name-cell">${row.name}</span></td>
        <td class="col-type">${row.type}</td>
        <td class="col-scale">${row.scale}</td>
        <td class="col-address">${row.address}</td>
        <td class="col-year">${row.builtYear}</td>
        <td class="col-owner">${row.owner}</td>
        <td class="col-note">${row.note}</td>
      </tr>`;
    }).join('') || `<tr><td colspan="${meta.columns.length}" style="padding:24px;text-align:center;color:#6b7280;">조회된 시설물이 없습니다.</td></tr>`;

    tbody.querySelectorAll('.type3-facility-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const name = link.dataset.facilityName;
        const facility = FACILITIES.find((row) => row.name === name);
        openReport({
          name,
          manageNo: state.selectedSurvey?.manageNo || '2025',
          date: facility?.surveyDate || '',
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

  function downloadStepExcel() {
    const meta = STEP_META[state.step];
    const rows = state.stepFiltered;

    const lines = rows.map((row, i) => {
      if (state.step === 'assign') {
        return [i + 1, row.name, row.assignee || '', row.type, row.address, row.builtYear, row.owner, row.scale];
      }
      if (state.step === 'conduct') {
        return [i + 1, row.name, row.assignee || '', row.surveyDate, row.type, row.address, row.builtYear, row.owner];
      }
      return [i + 1, row.name, row.type, row.scale, row.address, row.builtYear, row.owner, row.note];
    }).map((cells) => cells.map(escapeCsvValue).join(','));

    downloadCsvFile(`3종시설물_실태조사_${meta.title}`, meta.columns, lines);
  }

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

  function populateYearSelects() {
    const years = [...new Set(FACILITIES.map((row) => row.builtYear))].sort();
    const options = years.map((year) => `<option value="${year}">${year}</option>`).join('');
    ['type3StepYearFrom', 'type3StepYearTo'].forEach((id) => {
      const el = $(id);
      if (el) el.innerHTML = `<option value="">전체</option>${options}`;
    });
  }

  function init() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const survey = (id && getSurvey(id)) || getSurvey('s2025') || (window.Type3SurveyData?.SURVEYS || [])[0] || null;
    if (!survey) {
      goList();
      return;
    }
    if (!id || id !== survey.id) {
      const url = new URL(location.href);
      url.searchParams.set('id', survey.id);
      history.replaceState(null, '', url);
    }

    PomsSidebar.mount('#sidebar-root', { active: 'type3-port' });

    fillSurveyInfo(survey);
    populateYearSelects();

    document.querySelectorAll('[data-survey-step]').forEach((btn) => {
      btn.addEventListener('click', () => setStep(btn.dataset.surveyStep));
    });

    $('type3StepSearchBtn')?.addEventListener('click', searchStepFacilities);
    $('type3StepKeyword')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchStepFacilities();
    });
    $('type3StepExcelBtn')?.addEventListener('click', downloadStepExcel);
    $('type3InfoFile')?.addEventListener('click', (e) => e.preventDefault());

    document.querySelectorAll('[data-close-type3-report]').forEach((el) => {
      el.addEventListener('click', closeReport);
    });
    document.addEventListener('keydown', (e) => {
      const modal = $('type3ReportModal');
      if (e.key === 'Escape' && modal && !modal.hidden) closeReport();
    });
    $('type3ReportPrintBtn')?.addEventListener('click', () => window.print());

    setStep('target');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
