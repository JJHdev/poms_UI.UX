/**
 * 제 3종 항만시설물 — 실태조사 등록
 */
(() => {
  const Data = window.Type3SurveyData;
  if (!Data || typeof PomsUserTable === 'undefined') return;

  const { SURVEYS, FACILITIES, CREATE_STEP_META } = Data;

  /* no, name, type, scale, address, year, owner, note — 번호/준공일/비고↓ 시설물명·규모·관리주체↑ */
  const COL_W = [60, 160, 120, 160, 400, 100, 160, 100];

  const createState = {
    step: 'target',
    selected: new Set(),
    assignments: {},
    surveyDates: {},
    page: PomsUserTable.createState({ pageSize: 10 }),
  };

  function $(id) {
    return document.getElementById(id);
  }

  function goList() {
    location.href = 'type3-port-facility.html';
  }

  function setCols(widths) {
    const colgroup = $('type3CreateTableCols');
    if (!colgroup) return;
    const sum = widths.reduce((a, b) => a + b, 0);
    colgroup.innerHTML = widths
      .map((w) => `<col class="col-w${w}" style="width:calc(${w} / ${sum} * 100%)">`)
      .join('');
  }

  function resetFilePicker() {
    const input = $('type3CreateFile');
    const nameEl = $('type3CreateFileName');
    if (input) input.value = '';
    if (nameEl) nameEl.textContent = '파일을 선택하세요';
  }

  function openCreateView() {
    createState.step = 'target';
    createState.selected = new Set();
    createState.assignments = {};
    createState.surveyDates = {};
    createState.page = PomsUserTable.createState({ pageSize: 10 });

    const nums = SURVEYS
      .map((s) => parseInt(String(s.manageNo), 10))
      .filter((n) => Number.isFinite(n));
    const nextNo = String((nums.length ? Math.max(...nums) : new Date().getFullYear()) + 1);
    $('type3CreateManageNo').value = nextNo;
    $('type3CreateDept').value = '항만기술안전과';
    $('type3CreateManager').value = '';
    $('type3CreatePeriodFrom').value = `${nextNo}-12-01`;
    $('type3CreatePeriodTo').value = `${nextNo}-12-31`;
    $('type3CreateStatus').value = '조사중';
    resetFilePicker();

    setCreateStep('target');
    window.scrollTo({ top: 0 });
  }

  function setCreateStep(step) {
    if (!CREATE_STEP_META[step]) return;
    createState.step = step;
    createState.page.page = 1;
    const meta = CREATE_STEP_META[step];

    document.querySelectorAll('[data-create-step]').forEach((btn) => {
      const active = btn.dataset.createStep === step;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    const title = $('type3CreateStepTitle');
    if (title) title.textContent = meta.title;
    const guide = $('type3CreateGuide');
    if (guide) guide.textContent = meta.guide ? `※ ${meta.guide}` : '';
    const bulk = $('type3CreateBulk');
    if (bulk) bulk.hidden = step !== 'assign';

    renderCreateTable();
  }

  function updateCreateSelectedCount() {
    const el = $('type3CreateSelectedCount');
    if (el) el.textContent = String(createState.selected.size);
  }

  function getCreateSelectedFacilities() {
    return FACILITIES.filter((row) => createState.selected.has(row.name));
  }

  function mountCreatePagination(totalRows) {
    PomsUserTable.mountFoot({
      paginationId: 'type3CreatePagination',
      state: createState.page,
      totalRows,
      onChange: renderCreateTable,
    });
  }

  function renderCreateTable() {
    const thead = $('type3CreateTableHead');
    const tbody = $('type3CreateTableBody');
    if (!thead || !tbody) return;

    updateCreateSelectedCount();
    const step = createState.step;

    if (step === 'target') {
      setCols([48, ...COL_W]);
      const allChecked = FACILITIES.length > 0 && FACILITIES.every((row) => createState.selected.has(row.name));
      thead.innerHTML = `<tr>
        <th scope="col" class="type3-col-check"><input type="checkbox" id="type3CreateCheckAll" aria-label="전체 선택"${allChecked ? ' checked' : ''}></th>
        <th scope="col" class="col-no">번호</th>
        <th scope="col" class="col-name">시설물명</th>
        <th scope="col" class="col-type">시설물종류</th>
        <th scope="col" class="col-scale">시설물규모</th>
        <th scope="col" class="col-address">소재지</th>
        <th scope="col" class="col-year">준공일</th>
        <th scope="col" class="col-owner">관리주체</th>
        <th scope="col" class="col-note">비고</th>
      </tr>`;

      mountCreatePagination(FACILITIES.length);
      const pageRows = PomsUserTable.slicePage(FACILITIES, createState.page.page, createState.page.pageSize);
      const start = (createState.page.page - 1) * createState.page.pageSize;

      tbody.innerHTML = pageRows.map((row, i) => `
        <tr>
          <td class="type3-col-check"><input type="checkbox" data-create-check="${row.name}"${createState.selected.has(row.name) ? ' checked' : ''} aria-label="${row.name} 선택"></td>
          <td class="col-no">${start + i + 1}</td>
          <td class="col-name is-name"><span class="type3-name-cell">${row.name}</span></td>
          <td class="col-type">${row.type}</td>
          <td class="col-scale">${row.scale}</td>
          <td class="col-address">${row.address}</td>
          <td class="col-year">${row.builtYear}</td>
          <td class="col-owner">${row.owner}</td>
          <td class="col-note">${row.note}</td>
        </tr>
      `).join('');

      $('type3CreateCheckAll')?.addEventListener('change', (e) => {
        if (e.target.checked) {
          FACILITIES.forEach((row) => createState.selected.add(row.name));
        } else {
          createState.selected.clear();
        }
        renderCreateTable();
      });

      tbody.querySelectorAll('[data-create-check]').forEach((input) => {
        input.addEventListener('change', () => {
          if (input.checked) createState.selected.add(input.dataset.createCheck);
          else createState.selected.delete(input.dataset.createCheck);
          updateCreateSelectedCount();
          const checkAll = $('type3CreateCheckAll');
          if (checkAll) checkAll.checked = FACILITIES.every((row) => createState.selected.has(row.name));
        });
      });
      return;
    }

    const rows = getCreateSelectedFacilities();

    if (step === 'assign') {
      setCols([60, 160, 140, 120, 400, 100, 160]);
      thead.innerHTML = `<tr>
        <th scope="col" class="col-no">번호</th>
        <th scope="col" class="col-name">시설물명</th>
        <th scope="col" class="col-assignee">조사담당자</th>
        <th scope="col" class="col-type">시설물종류</th>
        <th scope="col" class="col-address">소재지</th>
        <th scope="col" class="col-year">준공일</th>
        <th scope="col" class="col-owner">관리주체</th>
      </tr>`;

      mountCreatePagination(rows.length);
      const pageRows = PomsUserTable.slicePage(rows, createState.page.page, createState.page.pageSize);
      const start = (createState.page.page - 1) * createState.page.pageSize;

      tbody.innerHTML = pageRows.map((row, i) => `
        <tr>
          <td class="col-no">${start + i + 1}</td>
          <td class="col-name is-name"><span class="type3-name-cell">${row.name}</span></td>
          <td class="col-assignee"><input type="text" class="type3-cell-input" data-assign-name="${row.name}" value="${createState.assignments[row.name] || ''}" placeholder="담당자명"></td>
          <td class="col-type">${row.type}</td>
          <td class="col-address">${row.address}</td>
          <td class="col-year">${row.builtYear}</td>
          <td class="col-owner">${row.owner}</td>
        </tr>
      `).join('') || '<tr><td colspan="7" class="type3-empty-cell">STEP 01에서 대상시설물을 먼저 선택하세요.</td></tr>';

      tbody.querySelectorAll('[data-assign-name]').forEach((input) => {
        input.addEventListener('input', () => {
          createState.assignments[input.dataset.assignName] = input.value.trim();
        });
      });
      return;
    }

    setCols([60, 160, 120, 140, 120, 400, 160]);
    thead.innerHTML = `<tr>
      <th scope="col" class="col-no">번호</th>
      <th scope="col" class="col-name">시설물명</th>
      <th scope="col" class="col-assignee">담당자</th>
      <th scope="col" class="col-date">실태조사일</th>
      <th scope="col" class="col-type">시설물종류</th>
      <th scope="col" class="col-address">소재지</th>
      <th scope="col" class="col-owner">관리주체</th>
    </tr>`;

    mountCreatePagination(rows.length);
    const pageRows = PomsUserTable.slicePage(rows, createState.page.page, createState.page.pageSize);
    const start = (createState.page.page - 1) * createState.page.pageSize;

    tbody.innerHTML = pageRows.map((row, i) => `
      <tr>
        <td class="col-no">${start + i + 1}</td>
        <td class="col-name is-name"><span class="type3-name-cell">${row.name}</span></td>
        <td class="col-assignee">${createState.assignments[row.name] || ''}</td>
        <td class="col-date"><input type="date" class="type3-cell-input" data-survey-name="${row.name}" value="${createState.surveyDates[row.name] || ''}"></td>
        <td class="col-type">${row.type}</td>
        <td class="col-address">${row.address}</td>
        <td class="col-owner">${row.owner}</td>
      </tr>
    `).join('') || '<tr><td colspan="7" class="type3-empty-cell">STEP 01에서 대상시설물을 먼저 선택하세요.</td></tr>';

    tbody.querySelectorAll('[data-survey-name]').forEach((input) => {
      input.addEventListener('change', () => {
        createState.surveyDates[input.dataset.surveyName] = input.value;
      });
    });
  }

  function applyBulkAssignee() {
    const value = ($('type3BulkAssignee')?.value || '').trim();
    if (!value) {
      alert('담당자명을 입력하세요.');
      return;
    }
    createState.selected.forEach((name) => {
      createState.assignments[name] = value;
    });
    renderCreateTable();
  }

  function saveCreateSurvey() {
    if (!createState.selected.size) {
      alert('STEP 01에서 대상시설물을 1건 이상 선택하세요.');
      setCreateStep('target');
      return;
    }

    const manageNo = $('type3CreateManageNo')?.value || '';
    alert(`관리번호 ${manageNo} 실태조사가 등록되었습니다. (샘플)`);
    location.href = 'type3-port-facility.html';
  }

  function initFilePicker() {
    const input = $('type3CreateFile');
    const btn = $('type3CreateFileBtn');
    const nameEl = $('type3CreateFileName');
    if (!input || !btn || !nameEl) return;

    btn.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      nameEl.textContent = file ? file.name : '파일을 선택하세요';
    });
  }

  function init() {
    PomsSidebar.mount('#sidebar-root', { active: 'type3-port' });

    initFilePicker();
    openCreateView();

    document.querySelectorAll('[data-create-step]').forEach((btn) => {
      btn.addEventListener('click', () => setCreateStep(btn.dataset.createStep));
    });

    $('type3CreateCancelBtn')?.addEventListener('click', goList);
    $('type3CreateSaveBtn')?.addEventListener('click', saveCreateSurvey);
    $('type3BulkApplyBtn')?.addEventListener('click', applyBulkAssignee);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
