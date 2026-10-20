(() => {
  const BASE_ROWS = [
    ['정기안전점검 수행 매뉴얼', '정기안전점검 수행 매뉴얼', '정기안전점검_수행_매뉴얼.pdf', '2024-05-12'],
    ['정밀안전점검 현장 체크리스트', '정밀안전점검 현장 체크리스트', '정밀안전점검_체크리스트.xlsx', '2024-05-12'],
    ['항만시설 안전등급 판정 기준', '항만시설 안전등급 판정 기준', '안전등급_판정기준.pdf', '2024-05-12'],
    ['취약시설물 중점관리 안내', '취약시설물 중점관리 안내', '취약시설물_중점관리_안내.pdf', '2024-05-12'],
    ['점검결과 보고서 작성 예시', '점검결과 보고서 작성 예시', '점검결과_보고서_작성예시.hwp', '2024-05-12'],
    ['보수보강 조치계획 작성 가이드', '보수보강 조치계획 작성 가이드', '보수보강_조치계획_가이드.pdf', '2024-05-12'],
    ['안전점검 사진 촬영 기준', '안전점검 사진 촬영 기준', '안전점검_사진촬영_기준.pdf', '2024-05-12'],
    ['시설물별 주요 손상 유형', '시설물별 주요 손상 유형', '시설물별_주요손상유형.pdf', '2024-05-12'],
    ['점검자 교육자료', '점검자 교육자료', '점검자_교육자료.pdf', '2024-05-12'],
    ['현장 안전관리 유의사항', '현장 안전관리 유의사항', '현장_안전관리_유의사항.pdf', '2024-05-12'],
    ['점검 장비 운용 안내', '점검 장비 운용 안내', '점검장비_운용안내.pdf', '2024-05-12'],
    ['계절별 안전점검 참고자료', '계절별 안전점검 참고자료', '계절별_안전점검_참고자료.pdf', '2024-05-12'],
  ];

  const ROWS = (() => {
    const rows = [];
    for (let i = 0; i < 91; i += 1) {
      const base = BASE_ROWS[i % BASE_ROWS.length];
      rows.push({
        id: `m${i + 1}`,
        title: base[0],
        desc: base[1],
        attachment: base[2],
        date: base[3],
      });
    }
    return rows;
  })();

  const MODE_TITLE = {
    view: '자료 상세',
    edit: '자료 수정',
    create: '자료 등록',
  };

  const $ = (selector, root = document) => root.querySelector(selector);

  const state = {
    filtered: [...ROWS],
    page: 1,
    pageSize: 10,
  };

  let editingRow = null;
  let modalMode = 'view';

  function setModalMode(mode) {
    modalMode = mode;
    const panel = $('#archiveModalPanel');
    const title = $('#archiveModalTitle');
    const editBtn = $('#archiveModalEditBtn');
    const saveBtn = $('#archiveModalSaveBtn');
    const titleInput = $('#modalTitle');
    const descInput = $('#modalDesc');
    const titleView = $('#modalTitleView');
    const descView = $('#modalDescView');
    const fileEditWrap = $('#modalFileEditWrap');
    const fileView = $('#modalFileView');

    if (panel) panel.dataset.mode = mode;
    if (title) title.textContent = MODE_TITLE[mode] || MODE_TITLE.view;

    const isView = mode === 'view';
    if (editBtn) editBtn.hidden = !isView;
    if (saveBtn) saveBtn.hidden = isView;

    if (titleInput) titleInput.hidden = isView;
    if (descInput) descInput.hidden = isView;
    if (fileEditWrap) fileEditWrap.hidden = isView;
    if (titleView) titleView.hidden = !isView;
    if (descView) descView.hidden = !isView;
    if (fileView) fileView.hidden = !isView;
  }

  function fillModalFields(row) {
    const titleVal = row?.title || '';
    const descVal = row?.desc || '';
    const fileName = row?.attachment || '';

    $('#modalTitle').value = titleVal;
    $('#modalDesc').value = descVal;
    $('#modalFile').value = '';

    const titleView = $('#modalTitleView');
    const descView = $('#modalDescView');
    const fileViewName = $('#modalFileViewName');
    const fileNameEl = $('#modalFileNameText');
    const sub = $('#archiveModalSub');

    if (titleView) titleView.textContent = titleVal || '-';
    if (descView) descView.textContent = descVal || '-';
    if (fileViewName) fileViewName.textContent = fileName || '-';
    if (sub) sub.textContent = row?.date ? `등록일자 ${row.date}` : '';

    const fileViewBtn = $('#modalFileView');
    if (fileViewBtn) {
      fileViewBtn.setAttribute('aria-label', fileName ? `${fileName} 다운로드` : '첨부파일 없음');
      fileViewBtn.disabled = !fileName || fileName === '-';
    }

    if (fileNameEl) {
      fileNameEl.textContent = fileName || '파일을 선택해주세요.';
      fileNameEl.style.color = fileName ? '#0f1f38' : '#6b7280';
    }
  }

  function getRowById(id) {
    if (!id) return null;
    return ROWS.find((row) => row.id === id) || null;
  }

  function openDetail(row) {
    if (!row) return;
    window.location.href = `archive-safety-materials-detail.html?id=${encodeURIComponent(row.id)}`;
  }

  function openCreate() {
    editingRow = null;
    fillModalFields(null);
    setModalMode('create');
    const modal = $('#archiveModal');
    if (modal) modal.hidden = false;
  }

  function openEdit() {
    if (!editingRow) return;
    fillModalFields(editingRow);
    setModalMode('edit');
  }

  function closeModal() {
    const modal = $('#archiveModal');
    if (modal) modal.hidden = true;
    editingRow = null;
    modalMode = 'view';
  }

  function handleCancel() {
    if (modalMode === 'edit' && editingRow) {
      fillModalFields(editingRow);
      setModalMode('view');
      return;
    }
    closeModal();
  }

  function saveModal() {
    const titleVal = $('#modalTitle').value.trim();
    const desc = $('#modalDesc').value.trim();
    const fileInput = $('#modalFile');
    const file = fileInput?.files[0];
    const attachment = file?.name || editingRow?.attachment || '';

    if (!titleVal) { alert('제목을 입력하세요.'); return; }
    if (!desc) { alert('내용을 입력하세요.'); return; }

    const today = new Date().toISOString().slice(0, 10);

    if (editingRow) {
      const idx = ROWS.findIndex((r) => r.id === editingRow.id);
      if (idx !== -1) {
        ROWS[idx].title = titleVal;
        ROWS[idx].desc = desc;
        if (attachment) ROWS[idx].attachment = attachment;
        ROWS[idx].date = today;
        editingRow = ROWS[idx];
      }
      fillModalFields(editingRow);
      setModalMode('view');
      applyFilters();
      return;
    }

    ROWS.unshift({
      id: `m${Date.now()}`,
      title: titleVal,
      desc,
      attachment: attachment || '-',
      date: today,
    });

    closeModal();
    applyFilters();
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function downloadAttachment(fileName) {
    const name = String(fileName || '').trim();
    if (!name || name === '-') {
      alert('다운로드할 첨부파일이 없습니다.');
      return;
    }
    alert('첨부파일 다운로드 기능은 샘플입니다.');
  }

  function attachIconHtml() {
    return `<img src="assets/main/safety-report/icon-download.svg" alt="" width="16" height="16">`;
  }

  function renderTable() {
    const tbody = $('#archiveMaterialsTableBody');
    const total = $('#archiveMaterialsTotal');
    if (!tbody) return;

    total.textContent = String(state.filtered.length);

    if (!state.filtered.length) {
      tbody.innerHTML = '<tr><td colspan="5">조회된 자료가 없습니다.</td></tr>';
      PomsUserTable.mountFoot({
        paginationId: 'archiveMaterialsPagination',
        state,
        totalRows: 0,
        onChange: renderTable,
      });
      return;
    }

    const rows = PomsUserTable.slicePage(state.filtered, state.page, state.pageSize);
    const start = (state.page - 1) * state.pageSize;
    tbody.innerHTML = rows.map((row, index) => `
      <tr data-row-id="${row.id}" class="is-clickable">
        <td class="col-no">${start + index + 1}</td>
        <td class="col-title" title="${escapeHtml(row.title)}">${escapeHtml(row.title)}</td>
        <td class="col-desc">${escapeHtml(row.desc)}</td>
        <td class="col-file">
          <button
            type="button"
            class="archive-file-attach"
            data-file-name="${escapeHtml(row.attachment)}"
            aria-label="${escapeHtml(row.attachment)} 다운로드"
          >${attachIconHtml()}</button>
        </td>
        <td class="col-date">${escapeHtml(row.date)}</td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.archive-file-attach').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadAttachment(button.dataset.fileName);
      });
    });

    tbody.querySelectorAll('tr[data-row-id]').forEach((tr) => {
      tr.addEventListener('click', () => {
        const row = state.filtered.find((r) => r.id === tr.dataset.rowId)
          || ROWS.find((r) => r.id === tr.dataset.rowId);
        if (row) openDetail(row);
      });
    });

    PomsUserTable.mountFoot({
      paginationId: 'archiveMaterialsPagination',
      state,
      totalRows: state.filtered.length,
      onChange: renderTable,
    });
  }

  function applyFilters() {
    const keyword = ($('#archiveMaterialsKeyword')?.value || '').trim().toLowerCase();

    state.filtered = ROWS.filter((row) => {
      if (!keyword) return true;
      return [row.title, row.desc, row.attachment]
        .some((value) => String(value || '').toLowerCase().includes(keyword));
    });
    state.page = 1;
    renderTable();
  }

  function bindEvents() {
    $('#archiveMaterialsSearchForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      applyFilters();
    });

    $('#archiveModalCloseBtn')?.addEventListener('click', closeModal);
    $('#archiveModalBackdrop')?.addEventListener('click', closeModal);
    $('#archiveModalCancelBtn')?.addEventListener('click', handleCancel);
    $('#archiveModalEditBtn')?.addEventListener('click', openEdit);
    $('#archiveModalSaveBtn')?.addEventListener('click', saveModal);

    $('#modalFileBrowseBtn')?.addEventListener('click', () => {
      $('#modalFile')?.click();
    });

    $('#modalFileView')?.addEventListener('click', () => {
      const name = $('#modalFileViewName')?.textContent?.trim()
        || editingRow?.attachment
        || '';
      downloadAttachment(name);
    });

    $('#modalFile')?.addEventListener('change', (e) => {
      const name = e.target.files[0]?.name;
      const el = $('#modalFileNameText');
      if (el) {
        el.textContent = name || editingRow?.attachment || '파일을 선택해주세요.';
        el.style.color = (name || editingRow?.attachment) ? '#0f1f38' : '#6b7280';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !$('#archiveModal')?.hidden) closeModal();
    });
  }

  function initMaterialsDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const row = getRowById(id);

    if (!row) {
      alert('자료를 찾을 수 없습니다.');
      window.location.href = 'archive-safety-materials.html';
      return;
    }

    document.title = `${row.title} | 안전점검 관련자료 상세 | POMS`;

    const setValue = (elId, value) => {
      const el = document.getElementById(elId);
      if (el) el.value = value ?? '';
    };

    const crumb = document.getElementById('materialsDetailCrumb');
    if (crumb) crumb.textContent = row.title;

    setValue('materialsDetailTitle', row.title);
    setValue('materialsDetailDate', row.date);

    const descEl = document.getElementById('materialsDetailDesc');
    if (descEl) descEl.textContent = row.desc || '-';

    const fileBtn = document.getElementById('materialsDetailFile');
    if (fileBtn) {
      if (row.attachment && row.attachment !== '-') {
        fileBtn.textContent = row.attachment;
        fileBtn.classList.remove('is-empty');
        fileBtn.addEventListener('click', (e) => {
          e.preventDefault();
          downloadAttachment(row.attachment);
        });
      } else {
        fileBtn.textContent = '첨부된 파일 없음';
        fileBtn.classList.add('is-empty');
      }
    }

    document.getElementById('materialsDetailBackBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'archive-safety-materials.html';
    });

    PomsSidebar.mount('#sidebar-root', { active: 'archive-law' });
  }

  function initListPage() {
    PomsSidebar.mount('#sidebar-root', { active: 'archive-law' });
    bindEvents();
    applyFilters();

    const openTarget = new URLSearchParams(window.location.search).get('open');
    if (openTarget) {
      const row = ROWS.find((r) => r.title === openTarget);
      if (row) openDetail(row);
    }
  }

  function init() {
    if (document.getElementById('materialsDetailTitle')) {
      initMaterialsDetail();
      return;
    }
    initListPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
