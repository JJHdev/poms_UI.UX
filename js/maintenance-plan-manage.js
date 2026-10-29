(() => {
  const PLAN_TYPES = ['regular', 'detailed', 'diagnosis', 'performance'];
  const PLAN_TYPE_LABELS = {
    regular: '정기안전점검',
    detailed: '정밀안전점검',
    diagnosis: '정밀안전진단',
    performance: '성능평가',
  };

  const OWNER_PLAN_META = {
    인천지방해양수산청: { port: '인천항' },
    마산지방해양수산청: { port: '마산항' },
    여수지방해양수산청: { port: '여수항' },
    목포지방해양수산청: { port: '목포항' },
    군산지방해양수산청: { port: '군산항' },
    동해지방해양수산청: { port: '동해항' },
    한국수자원공사: { port: '아라뱃길' },
    울산항만공사: { port: '울산항' },
    포항지방해양수산청: { port: '포항항' },
    부산지방해양수산청: { port: '부산항' },
    부산항만공사: { port: '부산항' },
    여수광양항만공사: { port: '광양항' },
    인천항만공사: { port: '인천항' },
    평택지방해양수산청: { port: '평택항' },
    대산지방해양수산청: { port: '대산항' },
    울산지방해양수산청: { port: '울산항' },
  };

  const baseFacilities = [
    { agency: '인천지방해양수산청', port: '인천항', subport: '신항', facilityType: '개선시설', kind: '1종', name: '제1부두 계류시설', regular: true, detailed: true, diagnosis: false, performance: false, year: '2026' },
    { agency: '인천지방해양수산청', port: '인천항', subport: '신항', facilityType: '계류', kind: '1종', name: '제2부두 계류시설', regular: true, detailed: true, diagnosis: false, performance: false, year: '2026' },
    { agency: '인천지방해양수산청', port: '인천항', subport: '북항', facilityType: '건축물', kind: '2종', name: '컨테이너 터미널 창고', regular: true, detailed: true, diagnosis: false, performance: false, year: '2026' },
    { agency: '인천지방해양수산청', port: '인천항', subport: '북항', facilityType: '외곽시설', kind: '2종', name: '방파제', regular: true, detailed: false, diagnosis: true, performance: false, year: '2026' },
    { agency: '인천지방해양수산청', port: '인천항', subport: '감만', facilityType: '장비', kind: '기타', name: '크레인 설비 A-12', regular: true, detailed: false, diagnosis: false, performance: true, year: '2026' },
    { agency: '인천지방해양수산청', port: '인천항', subport: '신항', facilityType: '교량', kind: '2종', name: '접안교', regular: true, detailed: true, diagnosis: false, performance: false, year: '2026' },
  ];

  const rows = [
    { no: 1, owner: '인천지방해양수산청', date: '2026-01-15', year: '2026', title: '2026년 유지관리 계획(부산항)', status: '승인' },
    { no: 2, owner: '마산지방해양수산청', date: '2026-01-14', year: '2026', title: '2026년 유지관리 계획(부산항)', status: '승인요청' },
    { no: 3, owner: '여수지방해양수산청', date: '', year: '2026', title: '', status: '미등록' },
    { no: 4, owner: '목포지방해양수산청', date: '2026-01-12', year: '2026', title: '2026년 유지관리 계획(인천항)', status: '승인', port: '인천항' },
    { no: 5, owner: '군산지방해양수산청', date: '2026-01-11', year: '2026', title: '2026년 유지관리 계획(여수항)', status: '반려', port: '여수항' },
    { no: 6, owner: '동해지방해양수산청', date: '', year: '2026', title: '', status: '미등록', port: '울산항' },
    { no: 7, owner: '울산항만공사', date: '2026-01-08', year: '2026', title: '2026년 유지관리 계획(평택항)', status: '승인', port: '평택항' },
    { no: 8, owner: '포항지방해양수산청', date: '', year: '2026', title: '', status: '미등록', port: '마산항' },
    { no: 9, owner: '부산지방해양수산청', date: '2026-01-06', year: '2026', title: '2026년 유지관리 계획(동해항)', status: '승인요청', port: '동해항' },
    { no: 10, owner: '부산항만공사', date: '2026-01-05', year: '2026', title: '2026년 유지관리 계획(군산항)', status: '승인', port: '군산항' },
    { no: 11, owner: '여수광양항만공사', date: '2026-01-04', year: '2026', title: '2026년 유지관리 계획(목포항)', status: '반려', port: '목포항' },
    { no: 12, owner: '인천항만공사', date: '', year: '2026', title: '', status: '미등록', port: '보령항' },
    { no: 13, owner: '평택지방해양수산청', date: '2026-01-02', year: '2026', title: '2026년 유지관리 계획(제주항)', status: '승인', port: '제주항' },
    { no: 14, owner: '대산지방해양수산청', date: '2026-01-01', year: '2026', title: '2026년 유지관리 계획(완도항)', status: '승인요청', port: '완도항' },
    { no: 15, owner: '울산지방해양수산청', date: '', year: '2026', title: '', status: '미등록', port: '서산항' },
  ].map((row) => {
    const meta = OWNER_PLAN_META[row.owner] || {};
    const port = meta.port || row.port || extractPort(row.title) || '항만';
    const title = `${row.year}년 유지관리 계획(${port})`;
    const content = row.content || (row.status !== '미등록' ? `${row.year}년도 ${row.owner} 소관 ${port} 항만시설물에 대한 정기안전점검 계획입니다.` : '');
    return {
      ...row,
      port,
      title,
      summaryTitle: row.summaryTitle || `${row.year}년 ${row.owner} ${port} 항만시설 유지관리계획(정기안전점검)`,
      content,
      facilities: buildFacilities(port, row.year, row.owner),
    };
  });

  const state = {
    selected: null,
    filteredRows: [...rows],
    filteredFacilities: [],
    facilityPaging: {
      page: 1,
      pageSize: 6,
    },
    facilityAddOpen: false,
    facilityAddSelectedIds: new Set(),
    facilityAddPlans: {},
    editMode: false,
    snapshot: null,
  };

  const els = {
    form: document.getElementById('planFilterForm'),
    owner: document.getElementById('planOwner'),
    keyword: document.getElementById('planKeyword'),
    year: document.getElementById('planYear'),
    statusFilter: document.getElementById('planStatusFilter'),
    reset: document.getElementById('planReset'),
    tbody: document.getElementById('planTableBody'),
    resultCount: document.getElementById('planResultCount'),
    facilityOverlay: document.getElementById('facilityDrawerOverlay'),
    facilityDrawer: document.getElementById('facilityDrawer'),
    facilityClose: document.getElementById('facilityDrawerClose'),
    facilityCancel: document.getElementById('facilityDrawerCancel'),
    facilityDone: document.getElementById('facilityDrawerDone'),
    facilityCount: document.getElementById('facilityCount'),
    facilityTbody: document.getElementById('facilityTableBody'),
    facilityPagination: document.getElementById('facilityPagination'),
    facilityPageSize: document.getElementById('facilityPageSize'),
    facilityAddOpenBtn: document.getElementById('facilityAddOpen'),
    facilityAddPanel: document.getElementById('facilityAddPanel'),
    facilityAddOverlay: document.getElementById('facilityAddOverlay'),
    facilityAddClose: document.getElementById('facilityAddClose'),
    facilityAddSearchForm: document.getElementById('facilityAddSearchForm'),
    facilityAddPortFilter: document.getElementById('facilityAddPortFilter'),
    facilityAddSubportFilter: document.getElementById('facilityAddSubportFilter'),
    facilityAddTypeFilter: document.getElementById('facilityAddTypeFilter'),
    facilityAddKeyword: document.getElementById('facilityAddKeyword'),
    facilityAddCount: document.getElementById('facilityAddCount'),
    facilityAddTbody: document.getElementById('facilityAddTableBody'),
    facilityAddCancel: document.getElementById('facilityAddCancel'),
    facilityAddRegister: document.getElementById('facilityAddRegister'),
    facilitySummaryTitle: document.getElementById('facilitySummaryTitle'),
    facilitySummaryContent: document.getElementById('facilitySummaryContent'),
    facilitySummaryYear: document.getElementById('facilitySummaryYear'),
    facilitySummaryDate: document.getElementById('facilitySummaryDate'),
    facilitySummaryStatus: document.getElementById('facilitySummaryStatus'),
    planHistoryBtn: document.getElementById('planHistoryBtn'),
    planRegisterBtn: document.getElementById('planRegisterBtn'),
    planApproveBtn: document.getElementById('planApproveBtn'),
    planRejectBtn: document.getElementById('planRejectBtn'),
    planHistoryOverlay: document.getElementById('planHistoryOverlay'),
    planHistoryDrawer: document.getElementById('planHistoryDrawer'),
    planHistoryClose: document.getElementById('planHistoryClose'),
    planHistoryBody: document.getElementById('planHistoryBody'),
    facilityEditMessage: document.getElementById('facilityEditMessage'),
    facilityFilterForm: document.getElementById('facilityFilterForm'),
    facilityPortFilter: document.getElementById('facilityPortFilter'),
    facilitySubportFilter: document.getElementById('facilitySubportFilter'),
    facilityTypeFilter: document.getElementById('facilityTypeFilter'),
    facilityKindFilter: document.getElementById('facilityKindFilter'),
    facilityCheckFilter: document.getElementById('facilityCheckFilter'),
    facilityYearFilter: document.getElementById('facilityYearFilter'),
    facilityNameFilter: document.getElementById('facilityNameFilter'),
    facilityFilterReset: document.getElementById('facilityFilterReset'),
  };

  function isUnregistered(status) {
    return status === '미등록';
  }

  function statusClass(status) {
    if (status === '승인') return 'is-approved';
    if (status === '승인요청') return 'is-requested';
    if (status === '반려') return 'is-rejected';
    return 'is-unregistered';
  }

  function extractPort(title) {
    const match = title.match(/\(([^)]+)\)/);
    return match ? match[1] : '';
  }

  function buildFacilities(port, year, owner) {
    const subports = getSubports(port);
    const extras = [
      { facilityType: '부대시설', kind: '기타', name: '전력실', regular: true, detailed: false, diagnosis: false, performance: false },
      { facilityType: '장비', kind: '기타', name: '크레인 레일', regular: true, detailed: true, diagnosis: false, performance: false },
      { facilityType: '부대시설', kind: '2종', name: '보안초소', regular: true, detailed: false, diagnosis: false, performance: true },
      { facilityType: '부대시설', kind: '기타', name: '전천후 야적장', regular: true, detailed: true, diagnosis: false, performance: false },
      { facilityType: '연결시설', kind: '2종', name: '배후단지 연결로', regular: true, detailed: true, diagnosis: true, performance: false },
      { facilityType: '역무시설', kind: '기타', name: '항만 조명탑', regular: true, detailed: false, diagnosis: false, performance: false },
      { facilityType: '부대시설', kind: '1종', name: '소화펌프실', regular: true, detailed: true, diagnosis: false, performance: false },
      { facilityType: '계류', kind: '기타', name: '계류 안전난간', regular: true, detailed: false, diagnosis: false, performance: false },
      { facilityType: '계선시설', kind: '2종', name: '제3부두 계류시설', regular: true, detailed: true, diagnosis: false, performance: true },
      { facilityType: '건축물', kind: '기타', name: '항무사무소', regular: true, detailed: false, diagnosis: false, performance: false },
    ];
    const templates = [
      ...baseFacilities.map((item, index) => ({
        facilityType: item.facilityType,
        kind: item.kind,
        name: [
          '제1부두 계류시설',
          '제2부두 계류시설',
          '여객터미널 창고',
          '외곽 방파제',
          '크레인 설비 A-12',
          '접안교',
        ][index] || item.name,
        regular: item.regular,
        detailed: item.detailed,
        diagnosis: item.diagnosis,
        performance: item.performance,
      })),
      ...extras,
    ];

    return templates.map((item, index) => ({
      ...item,
      id: `${port}-${index}`,
      port,
      subport: subports[index % subports.length],
      name: `${port} ${item.name}`,
      year,
      agency: owner,
    }));
  }

  function buildFacilityAddCandidates(port, year, owner, no) {
    const subports = getSubports(port);
    const baseNames = [
      `${port} 전력실`,
      `${port} 크레인 레일`,
      `${port} 보안초소`,
      `${port} 전천후 야적장`,
      `${port} 배후단지 연결로`,
      `${port} 항만 조명탑`,
      `${port} 소화펌프실`,
      `${port} 계류 안전난간`,
      `${port} 제1부두 계류시설`,
      `${port} 제2부두 계류시설`,
    ];
    const types = ['부대시설', '장비', '부대시설', '부대시설', '연결시설', '역무시설', '부대시설', '계류', '개선시설', '계선시설'];
    const total = 81;

    return Array.from({ length: total }, (_, index) => {
      const basePlan = baseFacilities[index % baseFacilities.length];
      return {
        id: `${port}-add-${no}-${index}`,
        agency: owner,
        port,
        subport: subports[index % subports.length],
        facilityType: types[index % types.length],
        kind: index % 5 === 0 ? '1종' : '기타',
        name: `${baseNames[index % baseNames.length]}${index >= baseNames.length ? ` ${String(index + 1).padStart(2, '0')}` : ''}`,
        regular: true,
        detailed: Boolean(basePlan?.detailed),
        diagnosis: Boolean(basePlan?.diagnosis),
        performance: Boolean(basePlan?.performance),
        year,
      };
    });
  }

  function getSubports(port) {
    const normalized = port.replace('항', '');
    if (port === '아라뱃길') return ['김포터미널', '인천터미널', '항로구간'];
    return [`${normalized}본항`, `${normalized}신항`, `${normalized}외항`];
  }

  function clonePlan(row) {
    return JSON.parse(JSON.stringify(row));
  }

  function restorePlan(target, source) {
    Object.keys(target).forEach((key) => delete target[key]);
    Object.assign(target, clonePlan(source));
  }

  function prepareUnregisteredPlan(row) {
    row.facilities.forEach((item) => {
      if (item.kind !== '기타') return;
      PLAN_TYPES.forEach((type) => {
        item[type] = false;
      });
    });
  }

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '');
  }

  // 상세 페이지 모드 — maintenance-plan-manage-detail.html
  const DETAIL_NO = new URLSearchParams(window.location.search).get('no');
  const DETAIL_MODE = document.body.classList.contains('plan-detail-page');

  function hasAnyPlan(item) {
    return PLAN_TYPES.some((type) => Boolean(item[type]));
  }

  function renderTable() {
    if (!els.tbody) return;
    els.tbody.innerHTML = state.filteredRows.map((row) => `
      <tr tabindex="0" data-no="${row.no}" class="is-clickable${state.selected?.no === row.no ? ' is-selected' : ''}">
        <td class="col-no">${row.no}</td>
        <td>${escapeHtml(row.owner)}</td>
        <td>${escapeHtml(row.date)}</td>
        <td>${escapeHtml(row.year)}</td>
        <td class="col-title">${escapeHtml(row.title)}</td>
        <td class="col-status"><span class="mpm-status ${statusClass(row.status)}">${escapeHtml(row.status)}</span></td>
      </tr>
    `).join('');

    const count = state.filteredRows.length;
    if (els.resultCount) els.resultCount.textContent = String(count);
  }

  function findRow(no) {
    return rows.find((row) => row.no === Number(no));
  }

  function fillSelect(select, values) {
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">전체</option>' + values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
    select.value = values.includes(current) ? current : '';
  }

  function setFacilityFilterOptions(row) {
    fillSelect(els.facilityPortFilter, [...new Set(row.facilities.map((item) => item.port))]);
    fillSelect(els.facilitySubportFilter, [...new Set(row.facilities.map((item) => item.subport))]);
    fillSelect(els.facilityTypeFilter, [...new Set(row.facilities.map((item) => item.facilityType))]);
    fillSelect(els.facilityKindFilter, [...new Set(row.facilities.map((item) => item.kind))]);
    fillSelect(els.facilityYearFilter, [...new Set(row.facilities.map((item) => item.year))]);
  }

  function applyFacilityFilter() {
    const row = state.selected;
    if (!row) return;
    const port = els.facilityPortFilter?.value || '';
    const subport = els.facilitySubportFilter?.value || '';
    const facilityType = els.facilityTypeFilter?.value || '';
    const kind = els.facilityKindFilter?.value || '';
    const checkType = els.facilityCheckFilter?.value || '';
    const year = els.facilityYearFilter?.value || '';
    const name = els.facilityNameFilter?.value.trim().toLowerCase() || '';

    state.filteredFacilities = row.facilities.filter((item) => {
      const checkMatched = !checkType || Boolean(item[checkType]);
      return (!port || item.port === port)
        && (!subport || item.subport === subport)
        && (!facilityType || item.facilityType === facilityType)
        && (!kind || item.kind === kind)
        && (!year || item.year === year)
        && (!name || item.name.toLowerCase().includes(name))
        && checkMatched;
    });
    renderFacilityRows();
  }

  function getFacilityAddPool(row) {
    if (!row) return [];
    if (!row.facilityAddPool) {
      row.facilityAddPool = buildFacilityAddCandidates(row.port, row.year, row.owner, row.no);
    }
    const selectedIds = new Set(row.facilities.map((item) => item.id));
    return row.facilityAddPool.filter((item) => !selectedIds.has(item.id));
  }

  function getFilteredFacilityAddRows() {
    const port = els.facilityAddPortFilter?.value || '';
    const subport = els.facilityAddSubportFilter?.value || '';
    const type = els.facilityAddTypeFilter?.value || '';
    const keyword = els.facilityAddKeyword?.value.trim().toLowerCase() || '';

    return getFacilityAddPool(state.selected).filter((item) => {
      return (!port || item.port === port)
        && (!subport || item.subport === subport)
        && (!type || item.facilityType === type)
        && (!keyword || item.name.toLowerCase().includes(keyword));
    });
  }

  function setFacilityAddOptions() {
    const rowsToAdd = getFacilityAddPool(state.selected);
    fillSelect(els.facilityAddPortFilter, [...new Set(rowsToAdd.map((item) => item.port))]);
    fillSelect(els.facilityAddSubportFilter, [...new Set(rowsToAdd.map((item) => item.subport))]);
    fillSelect(els.facilityAddTypeFilter, [...new Set(rowsToAdd.map((item) => item.facilityType))]);
  }

  function findFacilityAddPoolItem(id) {
    return getFacilityAddPool(state.selected).find((item) => item.id === id) || null;
  }

  function hasCheckedFacilityAddPlans(plan) {
    return Boolean(plan?.detailed || plan?.diagnosis || plan?.performance);
  }

  function getFacilityAddPlan(itemOrId) {
    const item = typeof itemOrId === 'string' ? findFacilityAddPoolItem(itemOrId) : itemOrId;
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

  function facilityAddPlanCheckboxHtml(item, type, enabled) {
    const plan = getFacilityAddPlan(item);
    const checked = plan[type] ? ' checked' : '';
    const disabled = '';
    return `<input type="checkbox" data-add-plan-id="${escapeHtml(item.id)}" data-add-plan-type="${type}" aria-label="${escapeHtml(item.name)} ${PLAN_TYPE_LABELS[type]}"${checked}${disabled}>`;
  }

  function renderFacilityAddRows() {
    if (!els.facilityAddPanel || !els.facilityAddTbody) return;

    if (state.facilityAddOpen) {
      els.facilityAddPanel.hidden = false;
      els.facilityAddPanel.removeAttribute('hidden');
      els.facilityAddPanel.setAttribute('aria-hidden', 'false');
      els.facilityAddOverlay?.removeAttribute('hidden');
      els.facilityAddPanel.classList.add('is-open');
      els.facilityAddOverlay?.classList.add('is-open');
      document.body.classList.add('is-mock-modal-open');
    } else {
      els.facilityAddPanel.classList.remove('is-open');
      els.facilityAddOverlay?.classList.remove('is-open');
      els.facilityAddPanel.hidden = true;
      els.facilityAddPanel.setAttribute('hidden', '');
      els.facilityAddPanel.setAttribute('aria-hidden', 'true');
      els.facilityAddOverlay?.setAttribute('hidden', '');
      if (!els.planHistoryDrawer?.classList.contains('is-open')) {
        document.body.classList.remove('is-mock-modal-open');
      }
    }
    if (els.facilityAddOpenBtn) {
      els.facilityAddOpenBtn.hidden = state.facilityAddOpen;
    }

    if (!state.facilityAddOpen) {
      els.facilityAddTbody.innerHTML = '';
      if (els.facilityAddCount) els.facilityAddCount.textContent = '0';
      return;
    }

    const rowsToAdd = state.selected ? getFilteredFacilityAddRows() : [];
    if (els.facilityAddCount) els.facilityAddCount.textContent = String(rowsToAdd.length);
    els.facilityAddTbody.innerHTML = rowsToAdd.length ? rowsToAdd.map((item) => {
      const selected = state.facilityAddSelectedIds.has(item.id);
      return `
      <tr>
        <td>
          <input type="checkbox" data-add-facility-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.name)} 선택"${selected ? ' checked' : ''}>
        </td>
        <td>${escapeHtml(item.agency)}</td>
        <td>${escapeHtml(item.port)}</td>
        <td>${escapeHtml(item.subport)}</td>
        <td>${escapeHtml(item.facilityType)}</td>
        <td>${escapeHtml(item.kind)}</td>
        <td>${escapeHtml(item.name)}</td>
        <td>${facilityAddPlanCheckboxHtml(item, 'detailed', selected)}</td>
        <td>${facilityAddPlanCheckboxHtml(item, 'diagnosis', selected)}</td>
        <td>${facilityAddPlanCheckboxHtml(item, 'performance', selected)}</td>
      </tr>
    `;
    }).join('') : '<tr><td colspan="10">추가 가능한 시설물이 없습니다.</td></tr>';
  }

  function openFacilityAddPanel() {
    if (!state.selected) return;
    if (!state.editMode) {
      state.editMode = true;
      state.snapshot = state.snapshot || clonePlan(state.selected);
      renderSummary(state.selected);
      renderFacilityRows();
      updateFacilityButtons();
    }
    state.facilityAddOpen = true;
    state.facilityAddSelectedIds.clear();
    state.facilityAddPlans = {};
    getFacilityAddPool(state.selected).forEach((item) => {
      const plan = getFacilityAddPlan(item);
      if (hasCheckedFacilityAddPlans(plan)) {
        state.facilityAddSelectedIds.add(item.id);
      }
    });
    if (els.facilityAddKeyword) els.facilityAddKeyword.value = '';
    setFacilityAddOptions();
    renderFacilityAddRows();
    els.facilityAddClose?.focus({ preventScroll: true });
  }

  function closeFacilityAddPanel() {
    state.facilityAddOpen = false;
    state.facilityAddSelectedIds.clear();
    state.facilityAddPlans = {};
    renderFacilityAddRows();
  }

  function registerFacilityAddSelection() {
    if (!state.selected || state.facilityAddSelectedIds.size === 0) return;
    const rowsToAdd = getFacilityAddPool(state.selected)
      .filter((item) => state.facilityAddSelectedIds.has(item.id))
      .map((item) => ({
        ...item,
        ...getFacilityAddPlan(item.id),
      }));
    state.selected.facilities.unshift(...rowsToAdd);
    state.facilityPaging.page = 1;
    closeFacilityAddPanel();
    renderFacilityRows();
  }

  function canEditFacilityCheck(item) {
    if (!state.editMode) return false;
    return DETAIL_MODE || item.kind === '기타';
  }

  function checkboxHtml(item, type) {
    if (canEditFacilityCheck(item)) {
      const checked = item[type] ? ' checked' : '';
      return `<input type="checkbox" data-id="${escapeHtml(item.id)}" data-type="${type}" aria-label="${escapeHtml(item.name)} ${PLAN_TYPE_LABELS[type]}"${checked}>`;
    }
    return item[type]
      ? `<img class="mpd-check-icon" src="assets/main/inspection-status/icon-check-circle.svg" alt="${escapeHtml(PLAN_TYPE_LABELS[type])}" width="18" height="18">`
      : '';
  }

  function renderFacilityRows() {
    if (!state.selected || !els.facilityTbody) return;
    const row = state.selected;
    const rowsToRender = row.facilities;
    const selectedCount = row.facilities.length;
    if (els.facilityCount) els.facilityCount.textContent = String(selectedCount);

    let start = 0;
    let pageRows = rowsToRender;
    if (!DETAIL_MODE) {
      const paging = state.facilityPaging;
      paging.pageSize = paging.pageSize || 6;
      if (globalThis.PomsPaging) {
        paging.page = PomsPaging.clampPage(paging.page, rowsToRender.length, paging.pageSize);
      }
      start = (paging.page - 1) * paging.pageSize;
      pageRows = rowsToRender.slice(start, start + paging.pageSize);
    }

    els.facilityTbody.innerHTML = pageRows.map((item, index) => `
      <tr class="${canEditFacilityCheck(item) ? 'is-editable' : 'is-locked'}">
        ${DETAIL_MODE ? `<td class="col-no">${start + index + 1}</td>` : ''}
        <td>${escapeHtml(item.agency)}</td>
        <td>${escapeHtml(item.port)}</td>
        <td>${escapeHtml(item.subport)}</td>
        <td>${escapeHtml(item.facilityType)}</td>
        <td>${escapeHtml(item.kind)}</td>
        <td>${escapeHtml(item.name)}</td>
        <td>${checkboxHtml(item, 'regular')}</td>
        <td>${checkboxHtml(item, 'detailed')}</td>
        <td>${checkboxHtml(item, 'diagnosis')}</td>
        <td>${checkboxHtml(item, 'performance')}</td>
      </tr>
    `).join('');

    if (!DETAIL_MODE) {
      globalThis.PomsPaging?.mount({
        paginationId: 'facilityPagination',
        pageSizeId: 'facilityPageSize',
        totalRows: rowsToRender.length,
        state: state.facilityPaging,
        onChange: renderFacilityRows,
      });
    }
  }

  function hasActiveFacilityFilter() {
    return Boolean(
      els.facilityPortFilter?.value
      || els.facilitySubportFilter?.value
      || els.facilityTypeFilter?.value
      || els.facilityKindFilter?.value
      || els.facilityCheckFilter?.value
      || els.facilityYearFilter?.value
      || els.facilityNameFilter?.value.trim()
    );
  }

  function renderSummary(row) {
    const editable = state.editMode;
    if (els.facilitySummaryTitle) {
      els.facilitySummaryTitle.innerHTML = editable
        ? `<input type="text" id="facilityTitleInput" value="${escapeHtml(row.summaryTitle)}">`
        : `<span class="mock-readonly-text">${escapeHtml(row.summaryTitle)}</span>`;
    }
    if (els.facilitySummaryContent) {
      els.facilitySummaryContent.innerHTML = editable
        ? `<input type="text" id="facilityContentInput" value="${escapeHtml(row.content || '')}">`
        : `<span class="mock-readonly-text">${escapeHtml(row.content || '-')}</span>`;
    }
    if (els.facilitySummaryYear) {
      els.facilitySummaryYear.innerHTML = editable
        ? `<input type="text" id="facilityYearInput" value="${escapeHtml(row.year)}" readonly>`
        : `<span class="mock-readonly-text">${escapeHtml(row.year)}${row.year ? '년' : ''}</span>`;
    }
    if (els.facilitySummaryDate) {
      const date = isUnregistered(row.status) ? '' : row.date;
      els.facilitySummaryDate.innerHTML = editable
        ? `<input type="text" id="facilityDateInput" value="${escapeHtml(date)}" readonly>`
        : `<span class="mock-readonly-text">${escapeHtml(date || '-')}</span>`;
    }
    if (els.facilitySummaryStatus) {
      els.facilitySummaryStatus.innerHTML = `<span class="mpm-status ${statusClass(row.status)}">${escapeHtml(row.status || '-')}</span>`;
    }
  }

  function openFacilityDrawer(row) {
    if (!DETAIL_MODE) {
      goDetail(row.no);
      return;
    }
    if (isUnregistered(row.status)) prepareUnregisteredPlan(row);
    state.selected = row;
    state.filteredFacilities = [...row.facilities];
    state.facilityPaging.page = 1;
    state.facilityAddOpen = false;
    state.facilityAddSelectedIds.clear();
    state.editMode = DETAIL_MODE ? false : isUnregistered(row.status);
    state.snapshot = clonePlan(row);
    renderTable();
    if (document.getElementById('facilityDrawerTitle')) {
      document.getElementById('facilityDrawerTitle').textContent = '선택한 시설물 확인';
    }
    if (document.getElementById('facilityDrawerSub')) {
      document.getElementById('facilityDrawerSub').textContent = isUnregistered(row.status)
        ? '미등록 유지관리계획입니다. 기타 시설물의 점검 종류와 제목, 내용을 입력하세요.'
        : '등록된 유지관리계획입니다. 수정 버튼을 누르면 기타 시설물과 제목, 내용을 수정할 수 있습니다.';
    }
    setFacilityFilterOptions(row);
    if (els.facilityCheckFilter) els.facilityCheckFilter.value = '';
    if (els.facilityNameFilter) els.facilityNameFilter.value = '';
    renderSummary(row);
    renderFacilityRows();
    renderFacilityAddRows();
    if (els.facilityEditMessage) {
      els.facilityEditMessage.hidden = false;
      els.facilityEditMessage.textContent = isUnregistered(row.status)
        ? '미등록 건은 기타 시설물이 선택되지 않은 상태로 시작합니다. 등록일자는 비어 있으며 점검년도는 변경할 수 없습니다.'
        : '읽기 모드입니다. 수정 버튼을 누르면 기타 시설물의 체크박스와 제목, 내용만 수정할 수 있습니다.';
    }
    updateFacilityButtons();
    if (!els.facilityDrawer) return;
    els.facilityDrawer.hidden = false;
    els.facilityDrawer.setAttribute('aria-hidden', 'false');
    updateModalLock();
    els.facilityClose?.focus({ preventScroll: true });
  }

  function closeFacilityDrawer() {
    if (DETAIL_MODE) {
      window.location.href = 'maintenance-plan-manage.html?tab=plan';
      return;
    }
    if (!els.facilityDrawer) return;
    els.facilityDrawer.hidden = true;
    els.facilityDrawer.setAttribute('aria-hidden', 'true');
    state.editMode = false;
    state.snapshot = null;
    closeFacilityAddPanel();
    updateModalLock();
  }

  function updateDetailStatusBadge(row) {
    const badge = document.getElementById('planDetailStatusBadge');
    if (!badge || !row) return;
    badge.textContent = row.status || '';
    badge.hidden = !row.status;
    badge.classList.toggle('is-unregistered', isUnregistered(row.status));
    badge.classList.toggle('is-approved', row.status === '승인');
    badge.classList.toggle('is-requested', row.status === '승인요청');
    badge.classList.toggle('is-rejected', row.status === '반려');
  }

  function updateFacilityButtons() {
    const requested = state.selected?.status === '승인요청';
    if (els.planApproveBtn) els.planApproveBtn.hidden = !requested;
    if (els.planRejectBtn) els.planRejectBtn.hidden = !requested;
    updateRegisterSaveButton();
  }

  function updateRegisterSaveButton() {
    const btn = els.planRegisterBtn;
    if (!btn || !DETAIL_MODE) return;
    const saving = Boolean(state.editMode);
    btn.classList.toggle('mpd-btn--register', !saving);
    btn.classList.toggle('mpd-btn--save', saving);
    btn.innerHTML = saving
      ? `<span class="mpd-btn__icon"><img src="assets/main/facility-management/icon-save.svg" alt="" width="14" height="14"></span>저장`
      : `<span class="mpd-btn__icon"><img src="assets/admin-notices/icon-edit.svg" alt="" width="14" height="14"></span>계획등록`;
  }

  function enterPlanRegisterMode() {
    if (!state.selected || state.editMode) return;
    state.editMode = true;
    state.snapshot = state.snapshot || clonePlan(state.selected);
    renderSummary(state.selected);
    renderFacilityRows();
    updateFacilityButtons();
  }

  function setEditMode(enabled) {
    state.editMode = enabled;
    if (!enabled) closeFacilityAddPanel();
    renderSummary(state.selected);
    renderFacilityRows();
    renderFacilityAddRows();
    updateFacilityButtons();
    if (els.facilityEditMessage) {
      els.facilityEditMessage.hidden = false;
      els.facilityEditMessage.textContent = enabled
        ? '수정 모드입니다. 기타 시설물의 체크박스와 제목, 내용을 수정할 수 있습니다.'
        : '읽기 모드입니다. 수정 버튼을 누르면 기타 시설물의 체크박스와 제목, 내용을 수정할 수 있습니다.';
    }
  }

  function updateModalLock() {
    if (DETAIL_MODE) return;
    document.body.classList.toggle('is-mock-modal-open', Boolean(els.facilityDrawer && !els.facilityDrawer.hidden));
  }

  function validatePlans(row) {
    const invalidLocked = row.facilities.find((item) => item.kind !== '기타' && !hasAnyPlan(item));
    if (invalidLocked) {
      return `${invalidLocked.name}은 최소 1개 이상의 점검 항목이 선택되어 있어야 합니다.`;
    }
    return '';
  }

  function saveFacilityPlan() {
    const row = state.selected;
    if (!row) return;
    const error = validatePlans(row);
    if (error) {
      if (els.facilityEditMessage) els.facilityEditMessage.textContent = error;
      else alert(error);
      return;
    }
    const titleInput = document.getElementById('facilityTitleInput');
    const contentInput = document.getElementById('facilityContentInput');
    if (titleInput) row.summaryTitle = titleInput.value.trim() || row.summaryTitle;
    if (contentInput) row.content = contentInput.value.trim() || '';
    row.title = row.summaryTitle;
    if (isUnregistered(row.status)) {
      row.status = '승인요청';
      row.date = row.date || new Date().toISOString().slice(0, 10);
    }
    state.snapshot = clonePlan(row);
    state.editMode = false;
    closeFacilityAddPanel();
    renderTable();
    renderSummary(row);
    renderFacilityRows();
    updateDetailStatusBadge(row);
    updateFacilityButtons();
    if (els.facilityEditMessage) els.facilityEditMessage.textContent = '저장되었습니다.';
    alert('계획이 등록되었습니다. (샘플)');
  }

  function applyPlanStatus(status, message) {
    const row = state.selected;
    if (!row || row.status !== '승인요청') return;
    row.status = status;
    state.snapshot = clonePlan(row);
    renderTable();
    renderSummary(row);
    updateDetailStatusBadge(row);
    updateFacilityButtons();
    alert(message);
  }

  function historyDrawerHtml(row) {
    const steps = [];
    if (!isUnregistered(row.status)) {
      steps.push({
        title: '신청',
        by: row.owner,
        date: row.date ? `${row.date} 09:20` : '-',
        noteTag: '[신청]',
        noteText: '유지관리계획을 등록하고 승인을 요청했습니다.',
        type: '',
      });
    }
    if (row.status === '승인') {
      steps.push({
        title: '승인',
        by: '관리자',
        date: row.date ? `${row.date} 14:30` : '-',
        noteTag: '[승인]',
        noteText: '유지관리계획이 승인되었습니다.',
        type: 'done',
      });
    } else if (row.status === '반려') {
      steps.push({
        title: '반려',
        by: '관리자',
        date: row.date ? `${row.date} 14:30` : '-',
        noteTag: '[반려]',
        noteText: '보완 후 재요청 바랍니다.',
        type: 'reject',
      });
    } else if (row.status === '승인요청') {
      steps.push({
        title: '요청중',
        by: '관리자',
        date: '-',
        noteTag: '[진행]',
        noteText: '승인 대기 중입니다.',
        type: '',
      });
    }

    const rowsHtml = [
      ['관리기관', row.owner],
      ['제목', row.summaryTitle || row.title],
      ['점검년도', row.year ? `${row.year}년` : '-'],
      ['처리상태', row.status || '-'],
    ].map(([label, value]) => `
      <div class="fca-hist-row">
        <div class="fca-hist-row__label">${escapeHtml(label)}</div>
        <div class="fca-hist-row__value">${escapeHtml(value)}</div>
      </div>
    `).join('');

    const stepsHtml = steps.length
      ? steps.map((step) => `
          <article class="fca-hist-card${step.type === 'reject' ? ' is-reject' : step.type === 'done' ? ' is-done' : ''}">
            <div class="fca-hist-card__head">
              <div class="fca-hist-card__left">
                <span class="fca-hist-card__badge">${escapeHtml(step.title)}</span>
                <span class="fca-hist-card__by">${escapeHtml(step.by)}</span>
              </div>
              <span class="fca-hist-card__date">${escapeHtml(step.date)}</span>
            </div>
            <div class="fca-hist-card__note">
              <span class="fca-hist-card__note-tag">${escapeHtml(step.noteTag)}</span>
              <span class="fca-hist-card__note-text">${escapeHtml(step.noteText)}</span>
            </div>
          </article>
        `).join('')
      : '<p class="fca-hist-empty">결재이력이 없습니다.</p>';

    return `
      <div class="fca-hist-block">
        <div class="fca-hist-summary">
          <span class="fca-hist-summary__icon-wrap" aria-hidden="true">
            <img class="fca-hist-summary__icon" src="assets/facility-change-approval/icon-history-doc.png" alt="" width="24" height="24">
          </span>
          <span class="fca-hist-summary__name">${escapeHtml(row.owner)}</span>
          <span class="fca-hist-summary__meta">
            <span class="fca-hist-summary__type">${escapeHtml(row.year ? `${row.year}년` : '')}</span>
            <span class="fca-hist-summary__status ${statusClass(row.status)}">${escapeHtml(row.status || '-')}</span>
          </span>
        </div>
        <div class="fca-hist-rows">${rowsHtml}</div>
      </div>
      <div class="fca-hist-steps">${stepsHtml}</div>`;
  }

  function openHistoryDrawer() {
    if (!state.selected || !els.planHistoryDrawer) return;
    if (els.planHistoryBody) els.planHistoryBody.innerHTML = historyDrawerHtml(state.selected);
    document.body.classList.add('is-mock-modal-open');
    els.planHistoryOverlay?.classList.add('is-open');
    els.planHistoryDrawer.classList.add('is-open');
    els.planHistoryDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeHistoryDrawer() {
    els.planHistoryOverlay?.classList.remove('is-open');
    if (!els.planHistoryDrawer) return;
    els.planHistoryDrawer.classList.remove('is-open');
    els.planHistoryDrawer.setAttribute('aria-hidden', 'true');
    if (!state.facilityAddOpen) {
      document.body.classList.remove('is-mock-modal-open');
    }
  }

  function cancelFacilityPlan() {
    if (!state.editMode) {
      closeFacilityDrawer();
      return;
    }
    if (state.selected && state.snapshot) restorePlan(state.selected, state.snapshot);
    if (isUnregistered(state.selected?.status)) {
      closeFacilityDrawer();
      renderTable();
      return;
    }
    state.filteredFacilities = [...state.selected.facilities];
    setEditMode(false);
    renderTable();
  }

  function applyFilter() {
    const owner = els.owner?.value || '';
    const keyword = els.keyword?.value.trim().toLowerCase() || '';
    const year = els.year?.value || '';
    const status = els.statusFilter?.value || '';

    state.filteredRows = rows.filter((row) => {
      return (!owner || row.owner === owner)
        && (!keyword || row.title.toLowerCase().includes(keyword))
        && (!year || row.year === year)
        && (!status || row.status === status);
    });
    renderTable();
  }

  els.form?.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilter();
  });

  els.reset?.addEventListener('click', () => {
    window.setTimeout(applyFilter, 0);
  });

  function goDetail(no) {
    window.location.href = `maintenance-plan-manage-detail.html?no=${encodeURIComponent(no)}`;
  }

  els.tbody?.addEventListener('click', (event) => {
    const rowEl = event.target.closest('tr[data-no]');
    if (!rowEl) return;
    goDetail(rowEl.dataset.no);
  });

  els.tbody?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const rowEl = event.target.closest('tr[data-no]');
    if (!rowEl) return;
    event.preventDefault();
    goDetail(rowEl.dataset.no);
  });

  els.facilityTbody?.addEventListener('change', (event) => {
    const checkbox = event.target.closest('input[type="checkbox"][data-id][data-type]');
    if (!checkbox || !state.selected) return;
    const facility = state.selected.facilities.find((item) => item.id === checkbox.dataset.id);
    if (!facility || !canEditFacilityCheck(facility)) return;
    facility[checkbox.dataset.type] = checkbox.checked;
    if (!DETAIL_MODE) renderFacilityRows();
  });

  els.facilityAddOpenBtn?.addEventListener('click', openFacilityAddPanel);

  els.facilityAddSearchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    renderFacilityAddRows();
  });

  els.facilityAddTbody?.addEventListener('change', (event) => {
    const rowCheckbox = event.target.closest('input[type="checkbox"][data-add-facility-id]');
    if (rowCheckbox) {
      if (rowCheckbox.checked) {
        state.facilityAddSelectedIds.add(rowCheckbox.dataset.addFacilityId);
        getFacilityAddPlan(rowCheckbox.dataset.addFacilityId);
      } else {
        const plan = getFacilityAddPlan(rowCheckbox.dataset.addFacilityId);
        plan.regular = true;
        plan.detailed = false;
        plan.diagnosis = false;
        plan.performance = false;
        state.facilityAddSelectedIds.delete(rowCheckbox.dataset.addFacilityId);
      }
      renderFacilityAddRows();
      return;
    }

    const planCheckbox = event.target.closest('input[type="checkbox"][data-add-plan-id][data-add-plan-type]');
    if (!planCheckbox || planCheckbox.disabled) return;
    const plan = getFacilityAddPlan(planCheckbox.dataset.addPlanId);
    plan[planCheckbox.dataset.addPlanType] = planCheckbox.checked;
    if (hasCheckedFacilityAddPlans(plan)) state.facilityAddSelectedIds.add(planCheckbox.dataset.addPlanId);
    else state.facilityAddSelectedIds.delete(planCheckbox.dataset.addPlanId);
    renderFacilityAddRows();
  });

  els.facilityAddCancel?.addEventListener('click', closeFacilityAddPanel);
  els.facilityAddClose?.addEventListener('click', closeFacilityAddPanel);
  els.facilityAddOverlay?.addEventListener('click', closeFacilityAddPanel);
  els.facilityAddRegister?.addEventListener('click', registerFacilityAddSelection);

  els.facilityFilterForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFacilityFilter();
  });

  els.facilityFilterReset?.addEventListener('click', () => {
    [els.facilityPortFilter, els.facilitySubportFilter, els.facilityTypeFilter, els.facilityKindFilter, els.facilityCheckFilter, els.facilityYearFilter].forEach((select) => {
      if (select) select.value = '';
    });
    if (els.facilityNameFilter) els.facilityNameFilter.value = '';
    applyFacilityFilter();
  });

  els.facilityClose?.addEventListener('click', cancelFacilityPlan);
  els.facilityCancel?.addEventListener('click', cancelFacilityPlan);
  els.facilityDone?.addEventListener('click', saveFacilityPlan);
  els.facilityOverlay?.addEventListener('click', cancelFacilityPlan);

  els.planHistoryBtn?.addEventListener('click', openHistoryDrawer);
  els.planHistoryClose?.addEventListener('click', closeHistoryDrawer);
  els.planHistoryOverlay?.addEventListener('click', closeHistoryDrawer);
  els.planRegisterBtn?.addEventListener('click', () => {
    if (DETAIL_MODE) {
      if (state.editMode) saveFacilityPlan();
      else enterPlanRegisterMode();
      return;
    }
    openFacilityAddPanel();
  });
  els.planApproveBtn?.addEventListener('click', () => {
    applyPlanStatus('승인', '승인 처리되었습니다. (샘플)');
  });
  els.planRejectBtn?.addEventListener('click', () => {
    applyPlanStatus('반려', '반려 처리되었습니다. 반려 사유가 결재이력에 기록됩니다. (샘플)');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.facilityAddOpen) {
      closeFacilityAddPanel();
      return;
    }
    if (event.key === 'Escape' && els.planHistoryDrawer?.classList.contains('is-open')) {
      closeHistoryDrawer();
      return;
    }
    if (DETAIL_MODE) return;
    if (event.key === 'Escape') cancelFacilityPlan();
  });

  renderTable();

  if (DETAIL_MODE) {
    const detailRow = findRow(DETAIL_NO);
    if (detailRow) {
      openFacilityDrawer(detailRow);
      const pageTitle = document.getElementById('planDetailOwnerTitle') || document.querySelector('.page-title');
      if (pageTitle) pageTitle.textContent = detailRow.owner;
      const crumb = document.getElementById('planDetailCrumb');
      if (crumb) crumb.textContent = detailRow.title || `${detailRow.year}년 유지관리계획`;
      const badge = document.getElementById('planDetailStatusBadge');
      if (badge) updateDetailStatusBadge(detailRow);
      document.title = `${detailRow.owner} | 유지관리계획 상세 | POMS 관리자`;
    } else {
      alert('유지관리계획 정보를 찾을 수 없습니다.');
      window.location.href = 'maintenance-plan-manage.html?tab=plan';
    }
  }
})();
