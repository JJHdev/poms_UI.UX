/**
 * 시설물 관리 상세 페이지 — 조회/수정/추가 (Figma 관리자페이지-시스템관리1)
 */
(() => {
  const state = {
    row: null,
    mode: 'view', // view | edit | add
  };

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function $$(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function goList() {
    window.location.href = 'facility-management.html';
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

  const BERTHING_RANGES = [
    '1,000톤 미만',
    '1,000~3,000톤',
    '3,000~5,000톤',
    '5,000~10,000톤',
    '10,000톤 이상',
  ];

  function parseBerthingCapacity(raw) {
    const text = String(raw || '').trim();
    if (BERTHING_RANGES.includes(text)) {
      return { range: text, value: '' };
    }
    const digits = text.replace(/[^\d.]/g, '');
    const num = digits ? Number(digits) : NaN;
    if (!Number.isFinite(num) || num <= 0) {
      return { range: '', value: digits || '' };
    }
    let range = '10,000톤 이상';
    if (num < 1000) range = '1,000톤 미만';
    else if (num < 3000) range = '1,000~3,000톤';
    else if (num < 5000) range = '3,000~5,000톤';
    else if (num < 10000) range = '5,000~10,000톤';
    return { range, value: String(Math.round(num)) };
  }

  function setBerthingCapacityFields(form, raw) {
    const parsed = parseBerthingCapacity(raw);
    const rangeSelect = form?.querySelector('select[name="berthingCapacityRange"]');
    if (rangeSelect) {
      ensureSelectOption(rangeSelect, parsed.range);
      rangeSelect.value = parsed.range;
    }
    setFormValue(form, 'berthingCapacity', parsed.value);
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

  function populateForm(row) {
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
    setFormValue(form, 'openStatusOuter', data.openStatus);
    setFormValue(form, 'berth', data.berth);
    setBerthingCapacityFields(form, data.berthingCapacity);
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

    syncTypeFields(data.facilityType);
  }

  function setTitles(mode) {
    const titles = {
      add: '시설물 추가',
      view: '시설물 상세',
      edit: '시설물 수정',
    };
    const text = titles[mode] || titles.view;
    const pageTitle = $('#facilityDetailPageTitle');
    const crumb = $('#facilityDetailCrumb');
    const panelTitle = $('#facilityAddPanelTitle');
    if (pageTitle) pageTitle.textContent = text;
    if (crumb) crumb.textContent = text;
    if (panelTitle) panelTitle.textContent = text;
    document.title = `${text} | POMS`;
  }

  function setFormEditable(editable) {
    const form = $('#facilityAddForm');
    const page = $('#facilityDetailPage');
    if (!form) return;

    page?.classList.toggle('is-readonly', !editable);

    form.querySelectorAll('input:not([type="file"]), select, textarea').forEach((field) => {
      if (field.classList.contains('is-disabled')) return;
      field.disabled = !editable;
    });

    form.querySelectorAll('.fac-add-file-picker__btn, .fmd-file-picker__btn, .btn-fac-file-delete').forEach((btn) => {
      btn.disabled = !editable;
    });
  }

  function updateActions() {
    const editBtn = $('#facAddEditBtn');
    const saveBtn = $('#facAddSaveBtn');
    if (!editBtn || !saveBtn) return;
    const isView = state.mode === 'view';
    editBtn.hidden = !isView;
    saveBtn.hidden = isView;
  }

  function applyMode() {
    const editable = state.mode === 'add' || state.mode === 'edit';
    setTitles(state.mode);
    setFormEditable(editable);
    updateActions();
  }

  function handleCancel() {
    if (state.mode === 'edit' && state.row) {
      state.mode = 'view';
      populateForm(state.row);
      applyMode();
      return;
    }
    goList();
  }

  function handleSave() {
    alert('시설물 정보가 저장되었습니다. (샘플)');
    if (state.mode === 'edit') {
      state.mode = 'view';
      applyMode();
      return;
    }
    goList();
  }

  function initFilePickers() {
    $$('.fmd-upload, .fmd-file-row').forEach((row) => {
      const input = row.querySelector('input[type="file"]');
      const btn = row.querySelector('.fac-add-file-picker__btn, .fmd-file-picker__btn, .fmd-upload__btn');
      const nameEl = row.querySelector('.fac-add-file-picker__name, .fmd-file-picker__name, .fmd-upload__name');
      const deleteBtn = row.querySelector('.btn-fac-file-delete, .fmd-upload__clear');
      const drop = row.querySelector('.fmd-upload__drop');
      const thumb = row.querySelector('.fmd-upload__thumb');
      let previewUrl = '';

      function clearPreview() {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          previewUrl = '';
        }
        if (thumb) {
          thumb.removeAttribute('src');
          thumb.hidden = true;
        }
      }

      function setFile(file) {
        const isImage = Boolean(file && file.type.startsWith('image/'));
        if (nameEl) {
          nameEl.textContent = file && !isImage ? file.name : '';
          nameEl.hidden = !file || isImage;
        }
        if (deleteBtn) deleteBtn.hidden = !file;
        row.classList.toggle('is-filled', Boolean(file));
        row.classList.toggle('has-thumb', isImage);

        clearPreview();
        if (isImage) {
          previewUrl = URL.createObjectURL(file);
          if (thumb) {
            thumb.src = previewUrl;
            thumb.hidden = false;
          }
        }
      }

      btn?.addEventListener('click', () => input?.click());
      input?.addEventListener('change', () => {
        setFile(input.files?.[0] || null);
      });
      deleteBtn?.addEventListener('click', () => {
        if (input) input.value = '';
        setFile(null);
      });

      if (!drop || !input) return;

      ['dragenter', 'dragover'].forEach((evt) => {
        drop.addEventListener(evt, (e) => {
          e.preventDefault();
          drop.classList.add('is-dragover');
        });
      });
      ['dragleave', 'drop'].forEach((evt) => {
        drop.addEventListener(evt, (e) => {
          e.preventDefault();
          drop.classList.remove('is-dragover');
        });
      });
      drop.addEventListener('drop', (e) => {
        const file = e.dataTransfer?.files?.[0];
        if (!file) return;
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        setFile(file);
      });
    });
  }

  function syncTypeFields(facilityType) {
    const type = facilityType || $('select[name="facilityType"]')?.value || '';
    $$('[data-fac-field]').forEach((el) => {
      el.classList.toggle('is-visible', el.dataset.facField === type);
    });
    $$('[data-fac-row]').forEach((el) => {
      el.classList.toggle('is-visible', el.dataset.facRow === type);
    });
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

  function initTypeFields() {
    const typeSelect = $('select[name="facilityType"]');
    typeSelect?.addEventListener('change', () => {
      syncTypeFields(typeSelect.value);
    });
  }

  function syncOpenStatusFields() {
    const os = $('input[name="openStatus"]');
    const os2 = $('input[name="openStatusOuter"]');
    if (!os || !os2) return;
    os2.value = os.value;
    os.addEventListener('input', () => { os2.value = os.value; });
    os2.addEventListener('input', () => { os.value = os2.value; });
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'system-facility' });

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const modeParam = params.get('mode');

    if (id) {
      state.row = FACILITY_MANAGEMENT_ROWS.find((row) => row.id === id) || null;
      state.mode = modeParam === 'edit' ? 'edit' : 'view';
    } else {
      state.mode = 'add';
    }

    if (id && !state.row) {
      alert('시설물 정보를 찾을 수 없습니다.');
      goList();
      return;
    }

    initFilePickers();
    initTypeFields();
    bindSelectToInput('agency', 'agencyDirectText');
    bindSelectToInput('structureType', 'structureDirectText');
    syncOpenStatusFields();

    $('#facilityDetailBackBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      goList();
    });
    $('#facAddCancelBtn')?.addEventListener('click', handleCancel);
    $('#facAddEditBtn')?.addEventListener('click', () => {
      state.mode = 'edit';
      applyMode();
    });
    $('#facAddSaveBtn')?.addEventListener('click', handleSave);

    if (state.row) {
      populateForm(state.row);
    } else {
      syncTypeFields($('select[name="facilityType"]')?.value);
    }
    applyMode();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
