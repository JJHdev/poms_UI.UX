/**
 * 드론 영상 상세 페이지 — 조회/수정/삭제/등록 + 동영상 재생
 */
(() => {
  const state = {
    row: null,
    mode: 'view', // view | edit | add
    pendingFile: null,
  };

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function goList() {
    window.location.href = 'drone-video-management.html';
  }

  function getFacilityById(id) {
    return DRONE_FACILITY_OPTIONS.find((item) => item.id === id) || null;
  }

  function isEditable() {
    return state.mode === 'add' || state.mode === 'edit';
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

  function updateFileDisplay() {
    const upload = $('#droneFormFileUpload');
    const view = $('#droneFormFileView');
    const fileName = state.pendingFile?.name || state.row?.fileName || '';
    const editable = isEditable();

    if (!editable && fileName) {
      if (upload) upload.hidden = true;
      if (view) {
        view.hidden = false;
        const nameEl = $('#droneFormFileViewName');
        const sizeEl = $('#droneFormFileViewSize');
        if (nameEl) nameEl.textContent = fileName;
        if (sizeEl) sizeEl.textContent = state.row?.fileSize || '';
      }
    } else {
      if (view) view.hidden = true;
      if (upload) upload.hidden = !editable;
      const nameEl = $('#droneFormFileName');
      if (nameEl) nameEl.textContent = fileName || '선택된 파일 없음';
    }
  }

  function setTitles() {
    const titles = {
      add: '드론 영상 등록',
      view: '드론 영상 상세',
      edit: '드론 영상 수정',
    };
    const text = titles[state.mode] || titles.view;
    const pageTitle = $('#droneDetailPageTitle');
    const crumb = $('#droneDetailCrumb');
    if (pageTitle) pageTitle.textContent = text;
    if (crumb) crumb.textContent = text;
    document.title = `${text} | POMS`;
  }

  function syncContentTextarea() {
    const el = $('#droneFormContent');
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(96, Math.min(el.scrollHeight, 140))}px`;
  }

  function applyMode() {
    const editable = isEditable();
    const isView = state.mode === 'view';
    const isAdd = state.mode === 'add';
    const form = $('#droneForm');

    form?.querySelectorAll('.fmd-input, .fmd-select, .fmd-textarea').forEach((el) => {
      if (el.id === 'droneFormRegistered') {
        el.readOnly = true;
        el.disabled = false;
        return;
      }

      if (el.tagName === 'SELECT') {
        el.disabled = !editable;
        if (isView) {
          el.disabled = false;
          el.style.pointerEvents = 'none';
        } else {
          el.style.pointerEvents = '';
        }
        return;
      }

      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        el.readOnly = !editable;
        el.disabled = false;
      }
    });

    const content = $('#droneFormContent');
    if (content) {
      content.style.removeProperty('color');
      content.style.removeProperty('-webkit-text-fill-color');
    }

    $('#droneFormFileBtn')?.toggleAttribute('disabled', !editable);
    $('#droneFormFileDelete')?.toggleAttribute('disabled', !editable);

    const regTh = $('#droneFormRegisteredTh');
    const regWrap = $('#droneFormRegisteredWrap');
    const yearTd = $('#droneFormYearTd');
    [regTh, regWrap].forEach((el) => {
      if (!el) return;
      el.hidden = isAdd;
      if (isAdd) el.setAttribute('hidden', '');
      else el.removeAttribute('hidden');
    });
    if (yearTd) yearTd.colSpan = isAdd ? 3 : 1;

    const cancelBtn = $('#droneCancelBtn');
    const saveBtn = $('#droneSaveBtn');
    const editBtn = $('#droneEditBtn');
    const deleteBtn = $('#droneDeleteBtn');

    // 등록: 취소·저장 / 상세: 수정·삭제 / 수정: 저장·취소
    const setHidden = (el, hide) => {
      if (!el) return;
      el.hidden = hide;
      if (hide) el.setAttribute('hidden', '');
      else el.removeAttribute('hidden');
    };
    setHidden(cancelBtn, isView);
    setHidden(saveBtn, isView);
    setHidden(editBtn, !isView);
    setHidden(deleteBtn, !isView);

    form?.classList.toggle('is-readonly', isView);
    form?.classList.toggle('is-edit-mode', state.mode === 'edit');
    form?.classList.toggle('is-add-mode', isAdd);
    document.body.classList.toggle('is-readonly', isView);

    setTitles();
    updateFileDisplay();
    syncContentTextarea();
  }

  function populateForm() {
    state.pendingFile = null;
    const row = state.row;

    if (!row) {
      $('#droneForm')?.reset();
      syncFormSelects();
      updateFileDisplay();
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
    $('#droneFormRegistered').value = row.registeredAt || '';
    updateFileDisplay();
    syncContentTextarea();
  }

  function handleCancel() {
    if (state.mode === 'edit' && state.row) {
      state.mode = 'view';
      populateForm();
      applyMode();
      return;
    }
    goList();
  }

  function handleSave() {
    const title = $('#droneFormTitle')?.value.trim() || '';
    const agency = $('#droneFormAgency')?.value || '';
    const port = $('#droneFormPort')?.value || '';
    const subPort = $('#droneFormSubPort')?.value || '';
    const facilityId = $('#droneFormFacility')?.value || '';

    if (!agency || !port || !subPort || !facilityId || !title) {
      alert('필수 항목을 입력해 주세요.');
      return;
    }

    alert('저장되었습니다. (샘플)');
    if (state.mode === 'edit') {
      state.mode = 'view';
      applyMode();
      return;
    }
    goList();
  }

  function handleDelete() {
    if (!confirm('선택한 드론 영상을 삭제하시겠습니까?')) return;
    alert('삭제되었습니다. (샘플)');
    goList();
  }

  function getRowYears(row) {
    if (!row) return DroneVideoPlayer.DEFAULT_YEARS;
    // 같은 시설물을 촬영한 다른 영상들의 촬영연도 수집
    const facilitySet = new Set(row.facilities || []);
    const years = new Set(
      DRONE_VIDEO_ROWS
        .filter((item) => item.filmYear && (item.facilities || []).some((f) => facilitySet.has(f)))
        .map((item) => item.filmYear)
    );
    if (row.filmYear) years.add(row.filmYear);
    // 연도가 1개뿐이면 이전 연도 샘플 추가
    if (years.size < 2 && row.filmYear) {
      years.add(row.filmYear - 1);
      years.add(row.filmYear - 2);
    }
    return [...years];
  }

  function playVideo() {
    const preview = $('#dronePreviewVideo');
    preview?.pause();

    DroneVideoPlayer.open({
      title: state.row?.title || '드론 영상',
      years: getRowYears(state.row),
      selectedYear: state.row?.filmYear,
    });
  }

  function setupPreviewPanel() {
    const video = $('#dronePreviewVideo');
    const empty = $('#dronePreviewEmpty');
    const nameEl = $('#dronePreviewFileName');
    const sizeEl = $('#dronePreviewFileSize');
    const hasVideo = Boolean(state.row?.fileName) || Boolean(state.pendingFile);

    if (video) {
      video.hidden = !hasVideo;
      if (hasVideo) {
        if (state.pendingFile) {
          video.src = URL.createObjectURL(state.pendingFile);
        } else {
          video.src = DroneVideoPlayer.SAMPLE_URL;
        }
        video.load();
      } else {
        video.removeAttribute('src');
      }
    }
    if (empty) empty.hidden = hasVideo;
    if (nameEl) nameEl.textContent = state.pendingFile?.name || state.row?.fileName || '';
    if (sizeEl) {
      sizeEl.textContent = state.pendingFile
        ? `${Math.round(state.pendingFile.size / 1024)} KB`
        : (state.row?.fileSize || '');
    }
  }

  function initFilePicker() {
    const input = $('#droneFormFile');
    const drop = $('#droneFormFileDrop');
    $('#droneFormFileBtn')?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', () => {
      state.pendingFile = input.files?.[0] || null;
      updateFileDisplay();
      setupPreviewPanel();
    });
    $('#droneFormFileDelete')?.addEventListener('click', () => {
      if (input) input.value = '';
      state.pendingFile = null;
      updateFileDisplay();
      setupPreviewPanel();
    });
    $('#droneFormDownloadBtn')?.addEventListener('click', () => {
      const name = state.row?.fileName;
      if (name) alert(`${name} 파일을 다운로드합니다. (샘플)`);
    });
    $('#droneFormPlayBtn')?.addEventListener('click', playVideo);

    drop?.addEventListener('dragover', (e) => {
      if (!isEditable()) return;
      e.preventDefault();
      drop.classList.add('is-dragover');
    });
    drop?.addEventListener('dragleave', () => drop.classList.remove('is-dragover'));
    drop?.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('is-dragover');
      if (!isEditable()) return;
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      state.pendingFile = file;
      updateFileDisplay();
      setupPreviewPanel();
    });
  }

  function bindSelectSync() {
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

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
      state.row = DRONE_VIDEO_ROWS.find((row) => row.id === id) || null;
      state.mode = 'view';
      if (!state.row) {
        alert('드론 영상 정보를 찾을 수 없습니다.');
        goList();
        return;
      }
    } else {
      state.mode = 'add';
    }

    $('#droneFormContent')?.addEventListener('input', syncContentTextarea);

    initFilePicker();
    bindSelectSync();
    $('#droneFormContent')?.addEventListener('input', syncContentTextarea);

    $('#droneDetailBackBtn')?.addEventListener('click', goList);
    $('#droneCancelBtn')?.addEventListener('click', handleCancel);
    $('#droneEditBtn')?.addEventListener('click', () => {
      state.mode = 'edit';
      applyMode();
    });
    $('#droneDeleteBtn')?.addEventListener('click', handleDelete);
    $('#droneSaveBtn')?.addEventListener('click', handleSave);

    populateForm();
    applyMode();
    setupPreviewPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
