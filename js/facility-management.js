/**
 * 시설물 관리 — 검색/초기화, 목록·페이지네이션, 엑셀 다운로드, 상세/추가 패널
 */
(() => {
  const FACILITY_TYPES = ['계류시설', '외곽시설', '건축물', '교통시설', '기타'];

  const state = {
    rows: [...FACILITY_MANAGEMENT_ROWS],
    filtered: [...FACILITY_MANAGEMENT_ROWS],
    page: 1,
    pageSize: 10,
    selectedId: null,
    panelMode: 'add',
  };

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function escapeCsv(value) {
    const text = String(value ?? '');
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  }

  function getSelectedTypes() {
    return FACILITY_TYPES.filter((type) => {
      const el = document.querySelector(`input[name="facilityType"][value="${type}"]`);
      return el?.checked;
    });
  }

  function filterRows() {
    const agency = $('#filterAgency')?.value || '';
    const port = $('#filterPort')?.value || '';
    const seaArea = $('#filterSeaArea')?.value || '';
    const keyword = $('#filterFacilityName')?.value.trim().toLowerCase() || '';
    const types = getSelectedTypes();

    state.filtered = state.rows.filter((row) => {
      if (agency && row.agency !== agency) return false;
      if (port && row.port !== port) return false;
      if (seaArea && row.seaArea !== seaArea) return false;
      if (types.length && !types.includes(row.facilityType)) return false;
      if (keyword && !row.name.toLowerCase().includes(keyword)) return false;
      return true;
    });

    state.page = 1;
  }

  function getTotalPages() {
    return Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  }

  function getPageRows() {
    const start = (state.page - 1) * state.pageSize;
    return state.filtered.slice(start, start + state.pageSize);
  }

  function findRowById(id) {
    return state.rows.find((row) => row.id === id) || null;
  }

  function buildFacilityFormData(row) {
    const idNum = row.id.replace(/\D/g, '').padStart(4, '0');
    const classType = row.classType
      || (row.facilityType === '건축물' ? '1종' : row.facilityType === '기타' ? '기타' : '2종');

    return {
      name: row.name,
      address: row.address || `${row.seaArea}권 ${row.port} ${row.subPort}`,
      fmsId: row.fmsId || `FMS-${idNum}`,
      manageType: row.manageCategory === '위탁관리' ? '위탁관리' : '직접관리',
      agency: row.agency,
      port: row.port,
      subPort: row.subPort,
      completionDate: row.completionDate || '2007-01-01',
      classType,
      facilityType: row.facilityType,
      facilityFormat: row.facilityFormat || (row.facilityType === '외곽시설' ? '중력식' : '기타'),
      structureType: row.structureType || '철근콘크리트',
      length: row.length || '164',
      otherSpec: row.otherSpec || '',
      openStatus: row.openStatus || '개방',
      berth: row.berth || '',
      berthingCapacity: row.berthingCapacity || '',
      cargo: row.cargo || '',
      seismic: row.seismic || 'N',
      managerOpinion: row.managerOpinion || '',
      depthMin: row.depthMin || '',
      depthMax: row.depthMax || '',
      loadMin: row.loadMin || '',
      loadMax: row.loadMax || '',
      coordinates: row.coordinates || '',
      dms: row.dms || '',
      remarks: row.remarks || '',
    };
  }

  function ensureSelectOption(select, value) {
    if (!select || !value) return;
    const exists = Array.from(select.options).some((option) => option.value === value);
    if (!exists) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    }
    select.value = value;
  }

  function setFormValue(form, name, value) {
    const field = form?.elements.namedItem(name);
    if (!field) return;
    field.value = value ?? '';
  }

  function setAgencyFields(form, agency) {
    const select = form?.querySelector('select[name="agency"]');
    const direct = form?.querySelector('input[name="agencyDirectText"]');
    const match = select
      ? Array.from(select.options).find((option) => option.value === agency)
      : null;

    if (match && select) {
      select.value = agency;
      if (direct) direct.value = match.textContent.trim();
      return;
    }

    if (select) select.value = '';
    if (direct) direct.value = agency || '';
  }

  function populateAddForm(row) {
    const form = $('#facilityAddForm');
    if (!form || !row) return;

    const data = buildFacilityFormData(row);

    setFormValue(form, 'name', data.name);
    setFormValue(form, 'address', data.address);
    setFormValue(form, 'fmsId', data.fmsId);
    setFormValue(form, 'manageType', data.manageType);
    setAgencyFields(form, data.agency);
    ensureSelectOption(form.querySelector('select[name="port"]'), data.port);
    ensureSelectOption(form.querySelector('select[name="subPort"]'), data.subPort);
    setFormValue(form, 'completionDate', data.completionDate);
    setFormValue(form, 'classType', data.classType);
    setFormValue(form, 'facilityType', data.facilityType);
    setFormValue(form, 'facilityFormat', data.facilityFormat);
    setFormValue(form, 'structureType', data.structureType);
    setFormValue(form, 'structureDirectText', '');
    setFormValue(form, 'length', data.length);
    setFormValue(form, 'otherSpec', data.otherSpec);
    setFormValue(form, 'openStatus', data.openStatus);
    setFormValue(form, 'berth', data.berth);
    setFormValue(form, 'berthingCapacity', data.berthingCapacity);
    setFormValue(form, 'cargo', data.cargo);
    setFormValue(form, 'seismic', data.seismic);
    setFormValue(form, 'managerOpinion', data.managerOpinion);
    setFormValue(form, 'depthMin', data.depthMin);
    setFormValue(form, 'depthMax', data.depthMax);
    setFormValue(form, 'loadMin', data.loadMin);
    setFormValue(form, 'loadMax', data.loadMax);
    setFormValue(form, 'coordinates', data.coordinates);
    setFormValue(form, 'dms', data.dms);
    setFormValue(form, 'remarks', data.remarks);
  }

  function setPanelTitle(mode) {
    const titleEl = $('#facilityAddPanelTitle');
    const panel = $('#facilityAddPanel');
    const titles = {
      add: '시설물 추가',
      view: '시설물 상세',
      edit: '시설물 수정',
    };
    const labels = {
      add: '시설물 추가',
      view: '시설물 상세',
      edit: '시설물 수정',
    };

    if (titleEl) titleEl.textContent = titles[mode] || titles.add;
    if (panel) panel.setAttribute('aria-label', labels[mode] || labels.add);
  }

  function setFormEditable(editable) {
    const form = $('#facilityAddForm');
    const panel = $('#facilityAddPanel');
    if (!form) return;

    panel?.classList.toggle('is-readonly', !editable);

    form.querySelectorAll('input:not([readonly]), select, textarea').forEach((field) => {
      if (field.classList.contains('is-disabled')) return;
      field.disabled = !editable;
    });

    form.querySelectorAll('.fac-add-file-picker__btn, .btn-fac-file-delete').forEach((btn) => {
      btn.disabled = !editable;
    });
  }

  function updatePanelActions() {
    const editBtn = $('#facAddEditBtn');
    const saveBtn = $('#facAddSaveBtn');
    if (!editBtn || !saveBtn) return;

    const isView = state.panelMode === 'view';
    editBtn.hidden = !isView;
    saveBtn.hidden = isView;
  }

  function applyPanelMode() {
    const editable = state.panelMode === 'add' || state.panelMode === 'edit';
    setPanelTitle(state.panelMode);
    setFormEditable(editable);
    updatePanelActions();
  }

  function updateCount() {
    const countEl = $('#facilityResultCount');
    if (countEl) countEl.textContent = state.filtered.length.toLocaleString();
  }

  function renderTable() {
    const tbody = $('#facilityTableBody');
    if (!tbody) return;

    const rows = getPageRows();
    const startNo = (state.page - 1) * state.pageSize;

    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="is-left" style="padding:24px;text-align:center;color:#6b7280;">검색 결과가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = rows.map((row, i) => `
      <tr class="is-clickable${state.selectedId === row.id ? ' is-selected' : ''}" data-id="${row.id}" tabindex="0">
        <td class="col-no">${startNo + i + 1}</td>
        <td>${row.portCategory}</td>
        <td>${row.manageCategory}</td>
        <td class="is-left">${row.agency}</td>
        <td>${row.seaArea}</td>
        <td>${row.port}</td>
        <td>${row.subPort}</td>
        <td>${row.facilityType}</td>
        <td class="is-left">${row.name}</td>
      </tr>
    `).join('');

    tbody.querySelectorAll('tr.is-clickable').forEach((tr) => {
      const open = () => {
        const row = findRowById(tr.dataset.id);
        if (!row) return;
        openFacilityDetail(row);
      };
      tr.addEventListener('click', open);
      tr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });
  }

  function renderPagination() {
    if (!globalThis.PomsPaging) return;
    PomsPaging.mount({
      paginationId: 'facilityPagination',
      totalRows: state.filtered.length,
      state,
      onChange: () => {
        renderTable();
        renderPagination();
      },
    });
  }

  function renderAll() {
    updateCount();
    renderTable();
    renderPagination();
  }

  function downloadCsv(filename, rows) {
    const headers = [
      '번호', '항만구분', '관리구분', '관리기관', '해역', '항명', '세부항명', '시설구분', '시설물명',
    ];
    const lines = rows.map((row, i) => [
      i + 1,
      row.portCategory,
      row.manageCategory,
      row.agency,
      row.seaArea,
      row.port,
      row.subPort,
      row.facilityType,
      row.name,
    ].map(escapeCsv).join(','));

    const csv = `\uFEFF${headers.map(escapeCsv).join(',')}\n${lines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function search() {
    filterRows();
    renderAll();
  }

  function reset() {
    const form = $('#facilitySearchForm');
    form?.reset();
    state.filtered = [...state.rows];
    state.page = 1;
    renderAll();
  }

  function initAddFilePickers() {
    document.querySelectorAll('.fac-add-file-row').forEach((row) => {
      const input = row.querySelector('input[type="file"]');
      const btn = row.querySelector('.fac-add-file-picker__btn');
      const nameEl = row.querySelector('.fac-add-file-picker__name');
      const deleteBtn = row.querySelector('.btn-fac-file-delete');

      btn?.addEventListener('click', () => input?.click());
      input?.addEventListener('change', () => {
        const file = input.files?.[0];
        if (nameEl) nameEl.textContent = file ? file.name : '선택된 파일 없음';
      });
      deleteBtn?.addEventListener('click', () => {
        if (input) input.value = '';
        if (nameEl) nameEl.textContent = '선택된 파일 없음';
      });
    });
  }

  function resetAddForm() {
    const form = $('#facilityAddForm');
    form?.reset();
    setFormValue(form, 'agencyDirectText', '');
    setFormValue(form, 'structureDirectText', '');
    document.querySelectorAll('.fac-add-file-picker__name').forEach((el) => {
      el.textContent = '선택된 파일 없음';
    });
  }

  function showAddPanel() {
    const panel = $('#facilityAddPanel');
    if (!panel) return;
    panel.hidden = false;
    document.body.classList.add('is-mock-modal-open');
  }

  function hideAddPanel() {
    const panel = $('#facilityAddPanel');
    if (!panel) return;
    panel.hidden = true;
    state.selectedId = null;
    state.panelMode = 'add';
    resetAddForm();
    applyPanelMode();
    document.body.classList.remove('is-mock-modal-open');
    renderTable();
  }

  function openAddPanel() {
    window.location.href = 'facility-management-detail.html?mode=add';
  }

  function openFacilityDetail(row) {
    window.location.href = `facility-management-detail.html?id=${encodeURIComponent(row.id)}`;
  }

  function enterEditMode() {
    if (!state.selectedId) return;
    state.panelMode = 'edit';
    applyPanelMode();
  }

  function cancelEditMode() {
    const row = findRowById(state.selectedId);
    if (!row) {
      hideAddPanel();
      return;
    }
    state.panelMode = 'view';
    populateAddForm(row);
    applyPanelMode();
  }

  function handleCancel() {
    if (state.panelMode === 'edit') {
      cancelEditMode();
      return;
    }
    hideAddPanel();
  }

  function handleSave() {
    if (state.panelMode === 'edit') {
      alert('시설물 정보가 저장되었습니다. (샘플)');
      state.panelMode = 'view';
      applyPanelMode();
      return;
    }

    alert('시설물 정보가 저장되었습니다. (샘플)');
    hideAddPanel();
  }

  function bindSelectToInput(selectName, inputName) {
    const form = $('#facilityAddForm');
    const select = form?.querySelector(`select[name="${selectName}"]`);
    const input = form?.querySelector(`input[name="${inputName}"]`);
    if (!select || !input) return;

    select.addEventListener('change', () => {
      const option = select.selectedOptions[0];
      input.value = select.value && option ? option.textContent.trim() : '';
    });
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'system-facility' });

    $('#facilitySearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      search();
    });

    $('#facilityResetBtn')?.addEventListener('click', reset);
    $('#facilityAddBtn')?.addEventListener('click', openAddPanel);
    $('#facilityExcelResultBtn')?.addEventListener('click', () => {
      const date = new Date().toISOString().slice(0, 10);
      downloadCsv(`시설물관리_검색결과_${date}.csv`, state.filtered);
    });
    $('#facilityExcelAllBtn')?.addEventListener('click', () => {
      const date = new Date().toISOString().slice(0, 10);
      downloadCsv(`시설물관리_전체_${date}.csv`, state.rows);
    });

    renderAll();

    if (new URLSearchParams(window.location.search).get('add') === '1') {
      window.location.replace('facility-management-detail.html?mode=add');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
