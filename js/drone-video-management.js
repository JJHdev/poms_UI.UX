/**
 * 드론 영상관리 — 검색, 목록, 페이징, 팝업 CRUD
 */
(() => {
  const state = {
    rows: DRONE_VIDEO_ROWS.map((row) => ({ ...row, facilities: [...row.facilities] })),
    filtered: [],
    page: 1,
    pageSize: 10,
    selectedId: null,
    drawerMode: 'add',
    isEditing: false,
    pendingFile: null,
  };

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function getFacilityById(id) {
    return DRONE_FACILITY_OPTIONS.find((item) => item.id === id) || null;
  }

  function filterRows() {
    const title = $('#droneSearchTitle')?.value.trim() || '';
    const content = $('#droneSearchContent')?.value.trim() || '';

    state.filtered = state.rows.filter((row) => {
      if (title && !row.title.includes(title)) return false;
      if (content && !row.content.includes(content)) return false;
      return true;
    });
    state.page = 1;
  }

  function pageCount() {
    return Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  }

  function getPageRows() {
    const start = (state.page - 1) * state.pageSize;
    return state.filtered.slice(start, start + state.pageSize);
  }

  function findRow(id) {
    return state.rows.find((row) => row.id === id) || null;
  }

  function attachFileHtml(fileName) {
    if (!fileName) return '-';
    return `<span class="drone-file-attach"><img src="assets/main/archive-safety/icon-file.svg" alt="" width="18" height="18"><span>${fileName}</span></span>`;
  }

  function renderTable() {
    const tbody = $('#droneVideoTableBody');
    const countEl = $('#droneVideoResultCount');
    if (!tbody) return;

    if (countEl) countEl.textContent = state.filtered.length.toLocaleString();

    const pageRows = getPageRows();
    const startNo = (state.page - 1) * state.pageSize;

    if (!pageRows.length) {
      tbody.innerHTML = '<tr><td colspan="5">조회된 데이터가 없습니다.</td></tr>';
      renderPagination();
      return;
    }

    tbody.innerHTML = pageRows.map((row, idx) => `
      <tr data-id="${row.id}">
        <td class="col-no">${startNo + idx + 1}</td>
        <td class="col-title col-title-link"><button type="button" data-open-drone="${row.id}">${row.title}</button></td>
        <td class="col-attach">${attachFileHtml(row.fileName)}</td>
        <td class="col-date">${row.registeredAt}</td>
        <td class="col-play"><button type="button" class="drone-play-btn" data-play-drone="${row.id}">영상재생</button></td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-open-drone]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.location.href = `drone-video-detail.html?id=${encodeURIComponent(btn.getAttribute('data-open-drone'))}`;
      });
    });

    tbody.querySelectorAll('[data-play-drone]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = findRow(btn.getAttribute('data-play-drone'));
        if (!row) return;
        const facilitySet = new Set(row.facilities || []);
        const years = new Set(
          state.rows
            .filter((item) => item.filmYear && (item.facilities || []).some((f) => facilitySet.has(f)))
            .map((item) => item.filmYear)
        );
        if (row.filmYear) years.add(row.filmYear);
        if (years.size < 2 && row.filmYear) {
          years.add(row.filmYear - 1);
          years.add(row.filmYear - 2);
        }
        DroneVideoPlayer.open({
          title: row.title,
          years: [...years],
          selectedYear: row.filmYear,
        });
      });
    });

    renderPagination();
  }

  function renderPagination() {
    const el = $('#droneVideoPagination');
    if (!el) return;

    const total = pageCount();
    state.page = Math.min(Math.max(state.page, 1), total);

    const pages = [];
    for (let p = 1; p <= Math.min(total, 5); p += 1) pages.push(p);

    el.innerHTML = `
      <button type="button" class="pagination__btn" data-page-move="first" ${state.page === 1 ? 'disabled' : ''} aria-label="첫 페이지">&laquo;</button>
      <button type="button" class="pagination__btn" data-page-move="prev" ${state.page === 1 ? 'disabled' : ''} aria-label="이전 페이지">&lsaquo;</button>
      ${pages.map((p) => `<button type="button" class="pagination__btn${p === state.page ? ' is-active' : ''}" data-page="${p}">${p}</button>`).join('')}
      <button type="button" class="pagination__btn" data-page-move="next" ${state.page === total ? 'disabled' : ''} aria-label="다음 페이지">&rsaquo;</button>
      <button type="button" class="pagination__btn" data-page-move="last" ${state.page === total ? 'disabled' : ''} aria-label="마지막 페이지">&raquo;</button>
    `;

    el.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.page = Number(btn.getAttribute('data-page'));
        renderTable();
      });
    });
    el.querySelector('[data-page-move="first"]')?.addEventListener('click', () => { state.page = 1; renderTable(); });
    el.querySelector('[data-page-move="prev"]')?.addEventListener('click', () => { state.page -= 1; renderTable(); });
    el.querySelector('[data-page-move="next"]')?.addEventListener('click', () => { state.page += 1; renderTable(); });
    el.querySelector('[data-page-move="last"]')?.addEventListener('click', () => { state.page = total; renderTable(); });
  }

  function fillSelect(select, options, current) {
    if (!select) return;
    select.innerHTML = `<option value="">선택</option>${options.map((v) => `<option value="${v}">${v}</option>`).join('')}`;
    select.value = options.includes(current) ? current : '';
  }

  function fillFacilitySelect(agency, port, subPort, currentId) {
    const select = $('#droneFormFacility');
    if (!select) return;

    const filtered = DRONE_FACILITY_OPTIONS.filter((item) => {
      if (agency && item.agency !== agency) return false;
      if (port && item.port !== port) return false;
      if (subPort && item.subPort !== subPort) return false;
      return true;
    });

    select.innerHTML = `<option value="">선택</option>${filtered.map((item) => `<option value="${item.id}">${item.name}</option>`).join('')}`;
    select.value = filtered.some((item) => item.id === currentId) ? currentId : '';
  }

  function syncFormSelects(values = {}) {
    const agencies = [...new Set(DRONE_FACILITY_OPTIONS.map((item) => item.agency))];
    fillSelect($('#droneFormAgency'), agencies, values.agency || '');

    const portRows = DRONE_FACILITY_OPTIONS.filter((item) => !values.agency || item.agency === values.agency);
    const ports = [...new Set(portRows.map((item) => item.port))];
    fillSelect($('#droneFormPort'), ports, values.port || '');

    const subPortRows = portRows.filter((item) => !values.port || item.port === values.port);
    const subPorts = [...new Set(subPortRows.map((item) => item.subPort))];
    fillSelect($('#droneFormSubPort'), subPorts, values.subPort || '');

    fillFacilitySelect(values.agency, values.port, values.subPort, values.facilityId || '');
  }

  function isFormEditable() {
    return state.drawerMode === 'add' || state.isEditing;
  }

  function resetFilePicker(savedName) {
    const input = $('#droneFormFile');
    if (input) input.value = '';
    state.pendingFile = null;
    const nameEl = $('#droneFormFileName');
    if (nameEl) nameEl.textContent = savedName || '선택된 파일 없음';
  }

  function updateFileDisplay(row) {
    const upload = $('#droneFormFileUpload');
    const view = $('#droneFormFileView');
    const fileName = state.pendingFile?.name || row?.fileName || '';

    if (!isFormEditable() && fileName) {
      if (upload) upload.hidden = true;
      if (view) {
        view.hidden = false;
        $('#droneFormFileViewName').textContent = fileName;
        $('#droneFormFileViewSize').textContent = row?.fileSize || '';
      }
    } else {
      if (view) view.hidden = true;
      if (upload) upload.hidden = !isFormEditable();
      const nameEl = $('#droneFormFileName');
      if (nameEl) {
        nameEl.textContent = state.pendingFile?.name || row?.fileName || '선택된 파일 없음';
      }
    }
  }

  function setFormDisabled(disabled) {
    $('#droneForm')?.querySelectorAll('input:not([type="file"]), select, textarea').forEach((el) => {
      el.disabled = disabled;
    });
    $('#droneFormFileBtn')?.toggleAttribute('disabled', disabled);
    $('#droneFormFileDelete')?.toggleAttribute('disabled', disabled);
    updateFileDisplay(findRow(state.selectedId));
    updateDetailFieldVisibility();
  }

  function updateDetailFieldVisibility() {
    const yearField = $('#droneFormYear')?.closest('.crud-form-field');
    const registeredField = $('#droneFormRegisteredWrap');
    const hideViewOnlyFields = state.drawerMode !== 'add' && !state.isEditing;
    if (yearField) yearField.hidden = hideViewOnlyFields;
    if (registeredField) registeredField.hidden = true;
  }

  function updateDrawerButtons() {
    const saveBtn = $('#droneSaveBtn');
    const editBtn = $('#droneEditBtn');
    const deleteBtn = $('#droneDeleteBtn');

    if (isFormEditable()) {
      saveBtn.hidden = false;
      editBtn.hidden = true;
      deleteBtn.hidden = true;
    } else {
      saveBtn.hidden = true;
      editBtn.hidden = false;
      deleteBtn.hidden = false;
    }
  }

  function populateForm(row) {
    const form = $('#droneForm');
    if (!form) return;

    state.pendingFile = null;

    if (!row) {
      form.reset();
      syncFormSelects();
      resetFilePicker();
      updateFileDisplay(null);
      $('#droneFormRegisteredWrap').hidden = true;
      return;
    }

    const primaryFacility = getFacilityById(row.facilities[0]);
    syncFormSelects({
      agency: primaryFacility?.agency || '',
      port: primaryFacility?.port || '',
      subPort: primaryFacility?.subPort || '',
      facilityId: row.facilities[0] || '',
    });

    $('#droneFormTitle').value = row.title;
    $('#droneFormContent').value = row.content;
    $('#droneFormYear').value = row.filmYear || '';

    const regWrap = $('#droneFormRegisteredWrap');
    const regInput = $('#droneFormRegistered');
    if (regWrap && regInput) {
      regWrap.hidden = true;
      regInput.value = row.registeredAt || '';
    }

    resetFilePicker(row.fileName);
    updateFileDisplay(row);
  }

  function openDrawer(mode, id = null) {
    state.drawerMode = mode;
    state.selectedId = id;
    state.isEditing = mode === 'add';

    const drawer = $('#droneDrawer');
    const title = $('#droneDrawerTitle');
    const subtitle = $('#droneDrawerSubtitle');

    if (mode === 'add') {
      title.textContent = '드론 영상 등록';
      subtitle.textContent = '';
      populateForm(null);
      setFormDisabled(false);
    } else {
      const row = findRow(id);
      if (!row) return;
      title.textContent = '선택한 드론 영상 상세';
      subtitle.textContent = '상세보기';
      populateForm(row);
      setFormDisabled(!state.isEditing);
    }

    updateDrawerButtons();
    updateDetailFieldVisibility();
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-mock-modal-open');
    requestAnimationFrame(() => {
      drawer.classList.add('is-open');
      drawer.querySelector('.crud-drawer__close')?.focus({ preventScroll: true });
    });
  }

  function closeDrawer() {
    const drawer = $('#droneDrawer');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      drawer.hidden = true;
      document.body.classList.remove('is-mock-modal-open');
      state.selectedId = null;
      state.isEditing = false;
      state.pendingFile = null;
    }, 180);
  }

  function collectFormData() {
    const agency = $('#droneFormAgency')?.value || '';
    const port = $('#droneFormPort')?.value || '';
    const subPort = $('#droneFormSubPort')?.value || '';
    const facilityId = $('#droneFormFacility')?.value || '';
    const title = $('#droneFormTitle')?.value.trim() || '';
    const content = $('#droneFormContent')?.value.trim() || '';
    const filmYear = Number($('#droneFormYear')?.value) || null;

    if (!agency || !port || !subPort || !facilityId || !title) {
      alert('필수 항목을 입력해 주세요.');
      return null;
    }

    const fileName = state.pendingFile?.name || findRow(state.selectedId)?.fileName || '';
    const fileSize = state.pendingFile
      ? `${Math.round(state.pendingFile.size / 1024 / 1024)} MB`
      : (findRow(state.selectedId)?.fileSize || '');

    return {
      title,
      content,
      filmYear,
      fileName,
      fileSize,
      facilities: [facilityId],
    };
  }

  function saveRow() {
    const data = collectFormData();
    if (!data) return;

    const now = new Date();
    const registeredAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (state.drawerMode === 'add') {
      state.rows.unshift({
        id: `d${Date.now()}`,
        ...data,
        registeredAt,
      });
    } else if (state.selectedId) {
      const row = findRow(state.selectedId);
      if (row) {
        Object.assign(row, {
          ...data,
          fileName: data.fileName || row.fileName,
          fileSize: data.fileSize || row.fileSize,
        });
      }
    }

    state.filtered = [...state.rows];
    filterRows();
    renderTable();
    closeDrawer();
    alert('저장되었습니다.');
  }

  function deleteRow() {
    if (!state.selectedId || !confirm('선택한 드론 영상을 삭제하시겠습니까?')) return;
    state.rows = state.rows.filter((row) => row.id !== state.selectedId);
    state.filtered = [...state.rows];
    filterRows();
    renderTable();
    closeDrawer();
    alert('삭제되었습니다.');
  }

  function initFilePicker() {
    const input = $('#droneFormFile');
    $('#droneFormFileBtn')?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', () => {
      state.pendingFile = input.files?.[0] || null;
      updateFileDisplay(findRow(state.selectedId));
    });
    $('#droneFormFileDelete')?.addEventListener('click', () => {
      resetFilePicker();
      updateFileDisplay(findRow(state.selectedId));
    });
    $('#droneFormDownloadBtn')?.addEventListener('click', () => {
      const row = findRow(state.selectedId);
      const name = row?.fileName;
      if (name) alert(`${name} 파일을 다운로드합니다. (샘플)`);
    });
  }

  function bindEvents() {
    $('#droneVideoSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      filterRows();
      renderTable();
    });

    $('#droneVideoResetBtn')?.addEventListener('click', () => {
      $('#droneSearchTitle').value = '';
      $('#droneSearchContent').value = '';
      state.filtered = [...state.rows];
      state.page = 1;
      renderTable();
    });

    $('#dronePageSize')?.addEventListener('change', (e) => {
      state.pageSize = Number(e.target.value) || 10;
      state.page = 1;
      renderTable();
    });

    $('#droneAddBtn')?.addEventListener('click', () => {
      window.location.href = 'drone-video-detail.html';
    });

    document.querySelectorAll('[data-drone-drawer-close]').forEach((el) => {
      el.addEventListener('click', closeDrawer);
    });

    $('#droneSaveBtn')?.addEventListener('click', saveRow);

    $('#droneEditBtn')?.addEventListener('click', () => {
      state.isEditing = true;
      setFormDisabled(false);
      updateDrawerButtons();
      updateDetailFieldVisibility();
      $('#droneDrawerTitle').textContent = '드론 영상 수정';
    });

    $('#droneDeleteBtn')?.addEventListener('click', deleteRow);

    document.addEventListener('keydown', (event) => {
      const drawer = $('#droneDrawer');
      if (event.key === 'Escape' && drawer && !drawer.hidden) {
        closeDrawer();
      }
    });

    $('#droneFormAgency')?.addEventListener('change', () => {
      syncFormSelects({ agency: $('#droneFormAgency').value });
    });
    $('#droneFormPort')?.addEventListener('change', () => {
      syncFormSelects({
        agency: $('#droneFormAgency').value,
        port: $('#droneFormPort').value,
      });
    });
    $('#droneFormSubPort')?.addEventListener('change', () => {
      syncFormSelects({
        agency: $('#droneFormAgency').value,
        port: $('#droneFormPort').value,
        subPort: $('#droneFormSubPort').value,
      });
    });
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'system-drone' });
    state.filtered = [...state.rows];
    initFilePicker();
    bindEvents();
    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
