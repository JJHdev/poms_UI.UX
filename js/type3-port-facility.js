(() => {
  let pageApi = null;

  function $(id) {
    return document.getElementById(id);
  }

  function noticeRows() {
    return TYPE3_PORT_FACILITY_ROWS.filter((row) => row.category === 'notice');
  }

  function updateAddButton(state) {
    const addBtn = $('type3NoticeAddBtn');
    if (!addBtn) return;
    const show = state.tabValue === 'notice';
    addBtn.hidden = !show;
    addBtn.style.display = show ? '' : 'none';
  }

  function updateTableMode(state) {
    const table = $('type3PortTableBody')?.closest('table');
    table?.classList.toggle('is-notice-tab', state.tabValue === 'notice');
  }

  function updatePageState(state) {
    updateAddButton(state);
    updateTableMode(state);
  }

  function closeModal() {
    const modal = $('type3NoticeModal');
    if (modal) modal.hidden = true;
  }

  function setFormEditable(editable) {
    [
      'type3NoticeNo',
      'type3NoticeDate',
      'type3NoticeAgency',
      'type3NoticeDepartment',
      'type3NoticeManager',
      'type3NoticeStatus',
      'type3NoticeFile',
    ].forEach((id) => {
      const field = $(id);
      if (field) field.disabled = !editable;
    });
    const saveBtn = $('type3NoticeSaveBtn');
    const editBtn = $('type3NoticeEditBtn');
    if (saveBtn) saveBtn.hidden = !editable;
    if (editBtn) editBtn.hidden = editable;
  }

  function fillForm(row = {}) {
    $('type3NoticeId').value = row.id || '';
    $('type3NoticeNo').value = row.noticeNo || '';
    $('type3NoticeDate').value = row.noticeDate || '';
    $('type3NoticeAgency').value = row.agency || '';
    $('type3NoticeDepartment').value = row.department || '';
    $('type3NoticeManager').value = row.manager || '';
    $('type3NoticeStatus').value = row.status || '';
    $('type3NoticeFile').value = '';
  }

  function openModal(row, options = {}) {
    const modal = $('type3NoticeModal');
    const title = $('type3NoticeModalTitle');
    const cancelBtn = $('type3NoticeCancelBtn');
    if (!modal) return;
    fillForm(row);
    const isEditTarget = Boolean(row?.id);
    const editable = options.editable ?? !isEditTarget;
    if (title) {
      title.textContent = isEditTarget
        ? (editable ? '고시현황 수정' : '고시현황 상세')
        : '고시현황 추가';
    }
    if (cancelBtn) cancelBtn.textContent = editable ? '취소' : '닫기';
    setFormEditable(editable);
    modal.hidden = false;
    (editable ? $('type3NoticeNo') : $('type3NoticeEditBtn'))?.focus();
  }

  function formValue(id) {
    return $(id)?.value.trim() || '';
  }

  function saveNotice(event) {
    event.preventDefault();
    const id = formValue('type3NoticeId');
    const file = $('type3NoticeFile')?.files?.[0];
    const existing = id ? TYPE3_PORT_FACILITY_ROWS.find((row) => row.id === id) : null;
    const row = {
      category: 'notice',
      id: id || `notice-${Date.now()}`,
      facilityName: existing?.facilityName || '',
      noticeNo: formValue('type3NoticeNo'),
      noticeDate: formValue('type3NoticeDate'),
      agency: formValue('type3NoticeAgency'),
      department: formValue('type3NoticeDepartment'),
      manager: formValue('type3NoticeManager'),
      status: formValue('type3NoticeStatus'),
      noticeFile: file?.name || existing?.noticeFile || '',
    };

    if (existing) {
      Object.assign(existing, row);
    } else {
      TYPE3_PORT_FACILITY_ROWS.push(row);
    }

    closeModal();
    pageApi?.setRows(TYPE3_PORT_FACILITY_ROWS);
  }

  function bindNoticeEditor() {
    window.Type3NoticeEditor = { open: openModal };
    $('type3NoticeAddBtn')?.addEventListener('click', () => openModal());
    $('type3NoticeForm')?.addEventListener('submit', saveNotice);
    $('type3NoticeEditBtn')?.addEventListener('click', () => {
      const id = formValue('type3NoticeId');
      const row = TYPE3_PORT_FACILITY_ROWS.find((item) => item.id === id);
      openModal(row, { editable: true });
    });
    $('type3NoticeCancelBtn')?.addEventListener('click', closeModal);
    $('type3NoticeCloseBtn')?.addEventListener('click', closeModal);
    $('type3NoticeModal')?.addEventListener('click', (event) => {
      if (event.target === $('type3NoticeModal')) closeModal();
    });
  }

  function init() {
    bindNoticeEditor();
    TYPE3_PORT_FACILITY_PAGE_CONFIG.onStateChange = updatePageState;
    TYPE3_PORT_FACILITY_PAGE_CONFIG.onReady = (api, state) => {
      pageApi = api;
      updatePageState(state);
    };
    pageApi = SystemListPage.init(TYPE3_PORT_FACILITY_PAGE_CONFIG);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
