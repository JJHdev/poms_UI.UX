/**
 * 책임기술자 상세 페이지 — 조회/수정/삭제/등록
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
    window.location.href = 'responsible-engineer.html';
  }

  function isEditable() {
    return state.mode === 'add' || state.mode === 'edit';
  }

  function setHidden(el, hide) {
    if (!el) return;
    el.hidden = hide;
    if (hide) el.setAttribute('hidden', '');
    else el.removeAttribute('hidden');
  }

  function updateFileDisplay() {
    const upload = $('#engineerFormFileUpload');
    const view = $('#engineerFormFileView');
    const fileName = state.pendingFile?.name || state.row?.fileName || '';
    const editable = isEditable();

    if (!editable && fileName) {
      if (upload) upload.hidden = true;
      if (view) {
        view.hidden = false;
        const nameEl = $('#engineerFormFileViewName');
        if (nameEl) nameEl.textContent = fileName;
      }
    } else {
      if (view) view.hidden = true;
      if (upload) upload.hidden = !editable;
      const nameEl = $('#engineerFormFileName');
      if (nameEl) nameEl.textContent = fileName || '선택된 파일 없음';
    }
  }

  function setTitles() {
    const titles = {
      add: '책임기술자 등록',
      view: '책임기술자 상세',
      edit: '책임기술자 수정',
    };
    const text = titles[state.mode] || titles.view;
    const pageTitle = $('#engineerDetailPageTitle');
    const crumb = $('#engineerDetailCrumb');
    if (pageTitle) pageTitle.textContent = text;
    if (crumb) crumb.textContent = text;
    document.title = `${text} | POMS`;
  }

  function applyMode() {
    const editable = isEditable();
    const isView = state.mode === 'view';
    const isAdd = state.mode === 'add';
    const form = $('#engineerForm');

    form?.querySelectorAll('.fmd-input, .fmd-select').forEach((el) => {
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
      el.readOnly = !editable;
      el.disabled = false;
    });

    $('#engineerFormFileBtn')?.toggleAttribute('disabled', !editable);
    $('#engineerFormFileDelete')?.toggleAttribute('disabled', !editable);

    setHidden($('#engineerCancelBtn'), isView);
    setHidden($('#engineerSaveBtn'), isView);
    setHidden($('#engineerEditBtn'), !isView);
    setHidden($('#engineerDeleteBtn'), !isView || isAdd);

    form?.classList.toggle('is-readonly', isView);
    form?.classList.toggle('is-edit-mode', state.mode === 'edit');
    form?.classList.toggle('is-add-mode', isAdd);

    setTitles();
    updateFileDisplay();
  }

  function populateForm() {
    state.pendingFile = null;
    const row = state.row;
    const form = $('#engineerForm');
    if (!form) return;

    if (!row) {
      form.reset();
      updateFileDisplay();
      return;
    }

    $('#engineerFormName').value = row.name || '';
    $('#engineerFormOrg').value = row.organization || '';
    $('#engineerFormDept').value = row.department || '';
    $('#engineerFormCategory').value = row.category || '';
    $('#engineerFormField').value = row.field || '';
    $('#engineerFormCareer').value = row.career || '';
    $('#engineerFormEduStatus').value = row.eduStatus || '';
    $('#engineerFormEduDate').value = row.eduDate || '';
    $('#engineerFormAssociation').value = row.association || '';
    $('#engineerFormGrade').value = row.grade || '';
    updateFileDisplay();
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
    const name = $('#engineerFormName')?.value.trim() || '';
    const organization = $('#engineerFormOrg')?.value.trim() || '';
    const category = $('#engineerFormCategory')?.value || '';

    if (!name || !organization || !category) {
      alert('필수 항목(성명, 소속, 구분)을 입력해 주세요.');
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
    if (!confirm('선택한 책임기술자 정보를 삭제하시겠습니까?')) return;
    alert('삭제되었습니다. (샘플)');
    goList();
  }

  function initFilePicker() {
    const input = $('#engineerFormFile');
    const drop = $('#engineerFormFileDrop');
    $('#engineerFormFileBtn')?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', () => {
      state.pendingFile = input.files?.[0] || null;
      updateFileDisplay();
    });
    $('#engineerFormFileDelete')?.addEventListener('click', () => {
      if (input) input.value = '';
      state.pendingFile = null;
      if (state.row) state.row.fileName = '';
      updateFileDisplay();
    });
    $('#engineerFormDownloadBtn')?.addEventListener('click', () => {
      const name = state.pendingFile?.name || state.row?.fileName;
      if (name) alert(`${name} 파일을 다운로드합니다. (샘플)`);
    });

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
    });
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'system-engineer' });

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
      state.row = RESPONSIBLE_ENGINEER_ROWS.find((row) => row.id === id) || null;
      state.mode = 'view';
      if (!state.row) {
        alert('책임기술자 정보를 찾을 수 없습니다.');
        goList();
        return;
      }
    } else {
      state.mode = 'add';
    }

    initFilePicker();
    $('#engineerDetailBackBtn')?.addEventListener('click', goList);
    $('#engineerCancelBtn')?.addEventListener('click', handleCancel);
    $('#engineerEditBtn')?.addEventListener('click', () => {
      state.mode = 'edit';
      applyMode();
    });
    $('#engineerDeleteBtn')?.addEventListener('click', handleDelete);
    $('#engineerSaveBtn')?.addEventListener('click', handleSave);

    populateForm();
    applyMode();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
