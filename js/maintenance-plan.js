const MAINTENANCE_ROWS = [
  {
    no: 1,
    year: '2026',
    title: '2026년 유지관리 계획(부산청)',
    file: true,
    date: '2026-01-15',
    status: '반려',
    content: '',
    facilities: [
      { name: '제1부두 계류시설', inspect: '정밀안전점검' },
      { name: '여수 방파제', inspect: '정밀안전점검' },
      { name: '신항 제2선석', inspect: '성능평가' },
    ],
  },
  { no: 2, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-14', status: '승인', content: '' },
  { no: 3, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-13', status: '대기중', content: '' },
  { no: 4, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-12', status: '승인', content: '' },
  { no: 5, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-11', status: '대기중', content: '' },
  { no: 6, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-10', status: '반려', content: '' },
  { no: 7, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-09', status: '승인', content: '' },
  { no: 8, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-08', status: '대기중', content: '' },
  { no: 9, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-07', status: '승인', content: '' },
  { no: 10, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-06', status: '반려', content: '' },
  { no: 11, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-05', status: '승인', content: '' },
  { no: 12, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-04', status: '대기중', content: '' },
  { no: 13, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-03', status: '승인', content: '' },
  { no: 14, year: '2026', title: '2026년 유지관리 계획(부산청)', file: true, date: '2026-01-02', status: '반려', content: '' },
];

const FACILITY_ROWS = [
  { name: '제1부두 계류시설', port: '1항', subport: '계선시설', category: '계류' },
  { name: '남항 화물터미널 창고', port: '2항', subport: '건축물', category: '건축물' },
  { name: '여수 방파제', port: '2항', subport: '외곽시설', category: '외곽시설' },
  { name: '크레인 설비 A-12', port: '3항', subport: '장비', category: '장비' },
  { name: '신항 제2선석', port: '1항', subport: '계선시설', category: '계류' },
  { name: '항만 컨테이너 터미널', port: '2항', subport: '건축물', category: '건축물' },
  { name: '복합 창고', port: '2항', subport: '교량', category: '교량' },
  { name: '이튼 크레인 3호기', port: '-', subport: '장비', category: '장비' },
  { name: '영도 해양관측소', port: '1항', subport: '외곽시설', category: '외곽시설' },
  { name: '부산항 동력관리소', port: '3항', subport: '건축물', category: '건축물' },
];

const PAGE_SIZE = 10;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('maintenanceTableBody')) initMaintenanceOverview();
  if (document.getElementById('maintenancePlanDetailBody')) initMaintenanceDetailFallback();
});

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function statusClass(status) {
  if (status === '승인') return 'maintenance-status--ok';
  if (status === '반려') return 'maintenance-status--error';
  return 'maintenance-status--wait';
}

function parseInspectValues(item) {
  if (Array.isArray(item.inspects)) return item.inspects;
  return String(item.inspect || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function initMaintenanceOverview() {
  const state = {
    filteredRows: [...MAINTENANCE_ROWS],
    selectedRow: null,
    isAddMode: false,
    selectedFacilities: [],
  };

  const els = {
    filterForm: document.getElementById('maintenanceFilterForm'),
    filterYear: document.getElementById('filterYear'),
    filterStatus: document.getElementById('filterStatus'),
    filterTitle: document.getElementById('filterTitle'),
    reset: document.getElementById('maintenanceResetBtn'),
    tableBody: document.getElementById('maintenanceTableBody'),
    totalCount: document.getElementById('maintenanceTotalCount'),
    resultCount: document.getElementById('maintenanceResultCount'),
    pageInfo: document.getElementById('maintenancePageInfo'),
    range: document.getElementById('maintenanceRange'),
    totalLabel: document.getElementById('maintenanceTotalLabel'),
    add: document.getElementById('maintenanceAddBtn'),
    summary: document.getElementById('maintenanceSummaryBtn'),
    detailPanel: document.getElementById('maintenanceDetailPanel'),
    detailSub: document.getElementById('maintenanceDetailSub'),
    modeBadge: document.getElementById('maintenanceModeBadge'),
    detailYear: document.getElementById('detailYear'),
    detailTitle: document.getElementById('detailTitle'),
    detailContent: document.getElementById('detailContent'),
    detailFileText: document.getElementById('detailFileText'),
    facilitySelectionText: document.getElementById('facilitySelectionText'),
    facilityRegister: document.getElementById('facilityRegisterBtn'),
    approvalHistory: document.getElementById('approvalHistoryBtn'),
    submit: document.getElementById('submitPlanBtn'),
    delete: document.getElementById('deletePlanBtn'),
    facilityOverlay: document.getElementById('facilityOverlay'),
    facilityClose: document.getElementById('facilityCloseBtn'),
    facilityCancel: document.getElementById('facilityCancelBtn'),
    facilityAdd: document.getElementById('facilityAddBtn'),
    facilityReset: document.getElementById('facilityResetBtn'),
    facilityForm: document.getElementById('facilityFilterForm'),
    facilityCheckAll: document.getElementById('facilityCheckAll'),
    facilityBody: document.getElementById('facilityTableBody'),
  };

  function renderTable() {
    const visibleRows = state.filteredRows.slice(0, PAGE_SIZE);
    els.tableBody.innerHTML = visibleRows.map((row, index) => `
      <tr class="is-clickable${state.selectedRow?.no === row.no ? ' is-selected' : ''}" data-no="${row.no}" tabindex="0">
        <td class="col-no">${index + 1}</td>
        <td class="col-year">${escapeHtml(row.year)}</td>
        <td class="col-title"><span class="notice-title-link">${escapeHtml(row.title)}</span></td>
        <td class="col-file">${row.file ? `<span class="maintenance-file-icon" aria-label="첨부파일 있음">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </span>` : '-'}</td>
        <td class="col-date">${escapeHtml(row.date)}</td>
        <td class="col-status"><span class="maintenance-status ${statusClass(row.status)}">${escapeHtml(row.status)}</span></td>
      </tr>
    `).join('');

    const count = state.filteredRows.length;
    els.totalCount.textContent = String(MAINTENANCE_ROWS.length);
    els.resultCount.textContent = String(count);
    els.pageInfo.textContent = `(1/${Math.max(1, Math.ceil(count / PAGE_SIZE))})`;
    els.range.textContent = count ? `1-${Math.min(PAGE_SIZE, count)}` : '0-0';
    els.totalLabel.textContent = String(count);
  }

  function applyFilters() {
    const year = els.filterYear.value;
    const status = els.filterStatus.value;
    const title = els.filterTitle.value.trim().toLowerCase();

    state.filteredRows = MAINTENANCE_ROWS.filter((row) => {
      const yearMatched = !year || row.year === year;
      const statusMatched = !status || row.status === status;
      const titleMatched = !title || row.title.toLowerCase().includes(title);
      return yearMatched && statusMatched && titleMatched;
    });
    renderTable();
  }

  function updateFacilitySelectionText() {
    const count = state.selectedFacilities.length;
    els.facilitySelectionText.textContent = count ? `선택 시설물 ${count}건` : '선택된 시설물이 없습니다.';
  }

  function showDetailPanel() {
    els.detailPanel.hidden = false;
    els.detailPanel.classList.add('is-visible');
  }

  function fillDetail(row) {
    state.selectedRow = row;
    state.isAddMode = false;
    state.selectedFacilities = row.facilities ? row.facilities.map((item) => ({ ...item })) : [];
    els.detailYear.value = row.year;
    els.detailTitle.value = row.title;
    els.detailContent.value = row.content || '';
    els.detailFileText.value = row.file ? `${row.title}.xlsx` : '';
    els.detailSub.textContent = `${row.date} 등록 · ${row.status}`;
    els.modeBadge.textContent = '조회';
    els.submit.textContent = row.status === '반려' ? '재신청' : '신청';
    els.delete.style.display = '';
    updateFacilitySelectionText();
    showDetailPanel();
    renderTable();
  }

  function clearDetailForAdd() {
    state.selectedRow = null;
    state.isAddMode = true;
    state.selectedFacilities = [];
    els.detailYear.value = els.filterYear.value || '2026';
    els.detailTitle.value = '';
    els.detailContent.value = '';
    els.detailFileText.value = '';
    els.detailSub.textContent = '신규 유지관리계획 신청 내용을 입력합니다.';
    els.modeBadge.textContent = '신규';
    els.submit.textContent = '신청';
    els.delete.style.display = 'none';
    updateFacilitySelectionText();
    showDetailPanel();
    renderTable();
    els.detailTitle.focus();
  }

  function renderFacilities() {
    const byName = new Map(state.selectedFacilities.map((item) => [item.name, parseInspectValues(item)]));
    els.facilityBody.innerHTML = FACILITY_ROWS.map((row) => {
      const selectedInspects = byName.get(row.name) || [];
      const rowChecked = selectedInspects.length > 0;
      return `
        <tr>
          <td><input type="checkbox" class="facility-row-check" ${rowChecked ? 'checked' : ''} aria-label="${escapeHtml(row.name)} 선택"></td>
          <td class="facility-name">${escapeHtml(row.name)}</td>
          <td>${escapeHtml(row.port)}</td>
          <td>${escapeHtml(row.subport)}</td>
          <td>${escapeHtml(row.category)}</td>
          <td>
            <div class="inspection-types${rowChecked ? '' : ' is-disabled'}">
              ${['정밀안전점검', '정밀안전진단', '성능평가'].map((type) => `
                <label><input type="checkbox" value="${type}" ${selectedInspects.includes(type) ? 'checked' : ''} ${rowChecked ? '' : 'disabled'}>${type}</label>
              `).join('')}
            </div>
          </td>
        </tr>
      `;
    }).join('');
    updateFacilityCheckAll();
  }

  function updateFacilityCheckAll() {
    const checks = [...els.facilityBody.querySelectorAll('.facility-row-check')];
    const checked = checks.filter((input) => input.checked).length;
    els.facilityCheckAll.checked = checks.length > 0 && checked === checks.length;
    els.facilityCheckAll.indeterminate = checked > 0 && checked < checks.length;
  }

  function setFacilityRowEnabled(row, enabled) {
    row.querySelectorAll('.inspection-types input').forEach((input) => {
      input.disabled = !enabled;
      if (!enabled) input.checked = false;
    });
    row.querySelector('.inspection-types')?.classList.toggle('is-disabled', !enabled);
  }

  function collectSelectedFacilities() {
    const selected = [];
    els.facilityBody.querySelectorAll('tr').forEach((row) => {
      const rowCheck = row.querySelector('.facility-row-check');
      if (!rowCheck?.checked) return;
      const inspects = [...row.querySelectorAll('.inspection-types input:checked')].map((input) => input.value);
      if (!inspects.length) return;
      selected.push({
        name: row.querySelector('.facility-name')?.textContent.trim() || '',
        inspect: inspects.join(', '),
        inspects,
      });
    });
    return selected;
  }

  function openFacilityModal() {
    renderFacilities();
    els.facilityOverlay.classList.remove('is-hidden');
    els.facilityOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeFacilityModal() {
    els.facilityOverlay.classList.add('is-hidden');
    els.facilityOverlay.setAttribute('aria-hidden', 'true');
  }

  els.filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });

  els.reset.addEventListener('click', () => {
    els.filterYear.value = '2026';
    els.filterStatus.value = '';
    els.filterTitle.value = '';
    applyFilters();
  });

  els.tableBody.addEventListener('click', (event) => {
    const rowEl = event.target.closest('tr[data-no]');
    if (!rowEl) return;
    const row = MAINTENANCE_ROWS.find((item) => item.no === Number(rowEl.dataset.no));
    if (row) fillDetail(row);
  });

  els.tableBody.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const rowEl = event.target.closest('tr[data-no]');
    if (!rowEl) return;
    event.preventDefault();
    const row = MAINTENANCE_ROWS.find((item) => item.no === Number(rowEl.dataset.no));
    if (row) fillDetail(row);
  });

  els.add.addEventListener('click', clearDetailForAdd);
  els.summary.addEventListener('click', () => {
    if (els.detailPanel.hidden) clearDetailForAdd();
    els.detailSub.textContent = '유지관리계획 총괄표를 확인합니다.';
  });
  els.facilityRegister.addEventListener('click', openFacilityModal);
  els.approvalHistory.addEventListener('click', () => {
    els.detailSub.textContent = '결재이력을 확인합니다.';
  });
  els.submit.addEventListener('click', () => {
    els.detailSub.textContent = state.isAddMode ? '신청되었습니다.' : `${els.submit.textContent} 처리되었습니다.`;
  });
  els.delete.addEventListener('click', () => {
    els.detailSub.textContent = '삭제 처리되었습니다.';
  });

  els.facilityClose.addEventListener('click', closeFacilityModal);
  els.facilityCancel.addEventListener('click', closeFacilityModal);
  els.facilityOverlay.addEventListener('click', (event) => {
    if (event.target === els.facilityOverlay) closeFacilityModal();
  });
  els.facilityReset.addEventListener('click', () => {
    document.getElementById('facilityPort').selectedIndex = 0;
    document.getElementById('facilitySubport').selectedIndex = 0;
    document.getElementById('facilityCategory').selectedIndex = 0;
    document.getElementById('facilityKeyword').value = '';
  });
  els.facilityForm.addEventListener('submit', (event) => event.preventDefault());
  els.facilityCheckAll.addEventListener('change', () => {
    els.facilityBody.querySelectorAll('tr').forEach((row) => {
      const checkbox = row.querySelector('.facility-row-check');
      checkbox.checked = els.facilityCheckAll.checked;
      setFacilityRowEnabled(row, checkbox.checked);
    });
    updateFacilityCheckAll();
  });
  els.facilityBody.addEventListener('change', (event) => {
    const rowCheck = event.target.closest('.facility-row-check');
    if (rowCheck) {
      setFacilityRowEnabled(rowCheck.closest('tr'), rowCheck.checked);
      updateFacilityCheckAll();
    }
  });
  els.facilityAdd.addEventListener('click', () => {
    state.selectedFacilities = collectSelectedFacilities();
    if (!state.isAddMode && state.selectedRow) state.selectedRow.facilities = state.selectedFacilities;
    updateFacilitySelectionText();
    closeFacilityModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!els.facilityOverlay.classList.contains('is-hidden')) closeFacilityModal();
  });

  renderTable();
}

function initMaintenanceDetailFallback() {
  const titleEl = document.getElementById('maintenanceDetailTitle');
  const bodyEl = document.getElementById('maintenancePlanDetailBody');
  if (titleEl) {
    titleEl.innerHTML = '<span class="notice-detail-title__text">2026년 유지관리 계획(부산청)</span>';
  }
  if (bodyEl) {
    bodyEl.innerHTML = '<p>유지관리계획 총괄 화면에서 선택한 계획의 상세 내용을 확인합니다.</p>';
  }
}
