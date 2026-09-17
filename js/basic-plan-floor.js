(() => {
  const isAdmin = document.body.classList.contains('board-manage-plan-page');

  const PORT_OPTIONS = [
    '광주항', '공진항', '거문도항', '장항항', '고현항', '굴업항',
    '구룡포항', '군산항', '마산항', '목포항', '부산항', '여수항',
    '광양항', '인천항',
  ];

  const SAMPLE_IMAGE = 'assets/basic-plan-floor-mockup.png';

  function buildInitialRows() {
    const rows = [];
    for (let i = 0; i < 91; i += 1) {
      const day = String((i % 28) + 1).padStart(2, '0');
      rows.push({
        id: `p${i + 1}`,
        port: '광주항',
        title: '광주항 계획평면도',
        date: `2024-07-${day}`,
        imageUrl: SAMPLE_IMAGE,
      });
    }
    return rows;
  }

  const initialRows = buildInitialRows();

  const state = {
    rows: [...initialRows],
    filtered: [...initialRows],
    selectedId: null,
    mode: 'idle', // idle | view | edit | add
    pendingFile: null,
    pendingPreviewUrl: null,
    page: 1,
    pageSize: 15,
    sort: { key: '', dir: 'asc' },
  };

  const $ = (selector, root = document) => root.querySelector(selector);

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function findRow(id) {
    return state.rows.find((row) => row.id === id) || null;
  }

  function syncSearchPlaceholder() {
    const sel = $('#planFloorSearchPort');
    if (sel) sel.classList.toggle('is-placeholder', !sel.value);
  }

  function populatePortSelects() {
    const optionsHtml = PORT_OPTIONS.map((port) => `<option value="${escapeHtml(port)}">${escapeHtml(port)}</option>`).join('');
    const searchSelect = $('#planFloorSearchPort');
    const formSelect = $('#planFloorPort');

    if (searchSelect) {
      searchSelect.innerHTML = `<option value="">전체</option>${optionsHtml}`;
      syncSearchPlaceholder();
    }
    if (formSelect) formSelect.innerHTML = `<option value="">선택</option>${optionsHtml}`;
  }

  function sortFilteredRows(rows) {
    return PomsUserTable.sortRows(rows, state.sort.key, state.sort.dir, (row, key) => row[key]);
  }

  function setupTableHead() {
    const thead = $('#planFloorTableBody')?.closest('table')?.querySelector('thead');
    if (!thead) return;
    thead.innerHTML = `<tr>
      <th scope="col" class="col-no">번호</th>
      <th scope="col" class="col-title">제목</th>
      <th scope="col" class="col-date">등록일자</th>
      ${isAdmin ? '<th scope="col" class="col-action">관리</th>' : ''}
    </tr>`;
  }

  function renderTable() {
    const tbody = $('#planFloorTableBody');
    const count = $('#planFloorResultCount');
    if (!tbody) return;
    if (count) count.textContent = String(state.filtered.length);

    if (!state.filtered.length) {
      tbody.innerHTML = `<tr><td colspan="${isAdmin ? 4 : 3}">조회된 데이터가 없습니다.</td></tr>`;
      PomsUserTable.mountFoot({
        paginationId: 'planFloorPagination',
        state,
        totalRows: 0,
        onChange: renderTable,
      });
      return;
    }

    const rows = PomsUserTable.slicePage(state.filtered, state.page, state.pageSize);
    const start = (state.page - 1) * state.pageSize;
    tbody.innerHTML = rows.map((row, index) => `
      <tr data-id="${escapeHtml(row.id)}" class="is-clickable${row.id === state.selectedId ? ' is-selected' : ''}" tabindex="0">
        <td class="col-no">${start + index + 1}</td>
        <td class="col-title" title="${escapeHtml(row.title)}">${escapeHtml(row.title)}</td>
        <td class="col-date">${escapeHtml(row.date || '-')}</td>
        ${isAdmin ? `
        <td class="col-action">
          <div class="plan-floor-row-actions">
            <button type="button" class="plan-floor-row-btn" data-edit-plan="${escapeHtml(row.id)}">수정</button>
            <button type="button" class="plan-floor-row-btn plan-floor-row-btn--danger" data-delete-plan="${escapeHtml(row.id)}">삭제</button>
          </div>
        </td>` : ''}
      </tr>
    `).join('');

    tbody.querySelectorAll('tr[data-id]').forEach((tr) => {
      tr.addEventListener('click', () => {
        openDetail('view', tr.dataset.id);
      });
    });

    if (isAdmin) {
      tbody.querySelectorAll('[data-edit-plan]').forEach((btn) => {
        btn.addEventListener('click', (event) => {
          event.stopPropagation();
          openDetail('edit', btn.dataset.editPlan);
        });
      });

      tbody.querySelectorAll('[data-delete-plan]').forEach((btn) => {
        btn.addEventListener('click', (event) => {
          event.stopPropagation();
          deleteRow(btn.dataset.deletePlan);
        });
      });
    }

    PomsUserTable.mountFoot({
      paginationId: 'planFloorPagination',
      state,
      totalRows: state.filtered.length,
      onChange: renderTable,
    });
  }

  function clearPendingFile() {
    if (state.pendingPreviewUrl) URL.revokeObjectURL(state.pendingPreviewUrl);
    state.pendingFile = null;
    state.pendingPreviewUrl = null;
    const fileInput = $('#planFloorFile');
    if (fileInput) fileInput.value = '';
  }

  function updateImagePreview(imageUrl, target = 'view') {
    const isEdit = target === 'edit';
    const img = $(isEdit ? '#planFloorEditPreviewImage' : '#planFloorPreviewImage');
    const empty = $(isEdit ? '#planFloorEditPreviewEmpty' : '#planFloorPreviewEmpty');
    if (!img || !empty) return;

    if (imageUrl) {
      img.src = imageUrl;
      img.hidden = false;
      empty.hidden = true;
    } else {
      img.removeAttribute('src');
      img.hidden = true;
      empty.hidden = false;
    }
  }

  function fillForm(row) {
    const port = $('#planFloorPort');
    if (port) port.value = row?.port || '';
    const fileName = $('#planFloorFileName');
    if (fileName) fileName.textContent = '선택된 파일 없음';
    clearPendingFile();
    updateImagePreview(row?.imageUrl || null, 'edit');
  }

  function showDetailPanel(show) {
    const detail = $('#planFloorDetail');
    const empty = $('#planFloorDetailEmpty');
    const panel = $('#planFloorDetailPanel');

    if (detail) detail.classList.toggle('is-open', !!show);
    if (empty) empty.hidden = !!show;
    if (panel) panel.hidden = !show;
  }

  function updateModeUi() {
    const isAdd = state.mode === 'add';
    const isEdit = state.mode === 'edit';
    const isView = state.mode === 'view';

    const viewEl = $('#planFloorDetailView');
    const formEl = $('#planFloorForm');
    const footer = $('#planFloorDetailFooter');
    const panel = $('#planFloorDetailPanel');

    if (viewEl) viewEl.hidden = !(isView);
    if (formEl) formEl.hidden = !(isAdd || isEdit);
    if (footer) footer.hidden = !(isAdd || isEdit);

    panel?.classList.toggle('is-add-mode', isAdd);
    panel?.classList.toggle('is-edit-mode', isEdit);
    panel?.classList.toggle('is-view-mode', isView);
  }

  function openDetail(mode, id = null) {
    state.mode = mode;
    state.selectedId = mode === 'add' ? null : id;

    showDetailPanel(true);

    const title = $('#planFloorDetailTitle');
    const sub = $('#planFloorDetailSub');
    const row = mode === 'add' ? null : findRow(id);

    if (mode === 'add') {
      if (title) title.textContent = '계획평면도 등록';
      if (sub) sub.textContent = '';
      fillForm(null);
      updateImagePreview(null, 'edit');
    } else {
      if (!row) {
        showDetailPanel(false);
        state.mode = 'idle';
        state.selectedId = null;
        return;
      }
      if (title) title.textContent = mode === 'edit' ? '계획평면도 수정' : row.port;
      if (sub) sub.textContent = mode === 'edit' ? row.title : row.title;
      fillForm(row);
      if (mode === 'view') updateImagePreview(row.imageUrl || null, 'view');
      else updateImagePreview(row.imageUrl || null, 'edit');
    }

    updateModeUi();
    renderTable();
  }

  function closeDetail() {
    state.mode = 'idle';
    state.selectedId = null;
    clearPendingFile();
    showDetailPanel(false);
    renderTable();
  }

  function applyFilters() {
    const port = $('#planFloorSearchPort')?.value.trim() || '';
    const rows = state.rows.filter((row) => !port || row.port === port);
    state.filtered = sortFilteredRows(rows);
    state.page = 1;
    setupTableHead();

    const stillSelected = state.selectedId && state.filtered.some((row) => row.id === state.selectedId);
    if (!stillSelected) {
      state.selectedId = null;
      if (state.mode === 'view' || state.mode === 'edit') {
        state.mode = 'idle';
        clearPendingFile();
        showDetailPanel(false);
      }
    }

    renderTable();
  }

  function handleFileSelect(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 등록할 수 있습니다.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('10MB 미만의 파일만 등록할 수 있습니다.');
      return;
    }

    clearPendingFile();
    state.pendingFile = file;
    state.pendingPreviewUrl = URL.createObjectURL(file);
    $('#planFloorFileName').textContent = file.name;
    updateImagePreview(state.pendingPreviewUrl, 'edit');
  }

  function saveRow() {
    const port = $('#planFloorPort')?.value.trim() || '';
    if (!port) {
      alert('항을 선택해 주세요.');
      return;
    }

    const title = `${port} 계획평면도`;

    if (state.mode === 'add') {
      if (!state.pendingFile) {
        alert('계획평면도 이미지를 첨부해 주세요.');
        return;
      }
      const row = {
        id: `p${Date.now()}`,
        port,
        title,
        date: new Date().toISOString().slice(0, 10),
        imageUrl: state.pendingPreviewUrl,
      };
      state.pendingPreviewUrl = null;
      state.pendingFile = null;
      state.rows.unshift(row);
      state.selectedId = row.id;
    } else if (state.selectedId) {
      const row = findRow(state.selectedId);
      if (row) {
        row.port = port;
        row.title = title;
        if (state.pendingFile && state.pendingPreviewUrl) {
          row.imageUrl = state.pendingPreviewUrl;
          state.pendingPreviewUrl = null;
          state.pendingFile = null;
        }
      }
    }

    applyFilters();
    openDetail('view', state.selectedId);
    alert('저장되었습니다.');
  }

  function deleteRow(id = state.selectedId) {
    if (!id || !confirm('선택한 계획평면도를 삭제하시겠습니까?')) return;
    const wasSelected = state.selectedId === id;
    state.rows = state.rows.filter((row) => row.id !== id);
    if (wasSelected) closeDetail();
    applyFilters();
  }

  /* ---------- 이미지 뷰어 ---------- */

  const viewer = {
    scale: 1,
    tx: 0,
    ty: 0,
    dragging: false,
    startX: 0,
    startY: 0,
    MIN: 0.2,
    MAX: 5,
  };

  function applyViewerTransform() {
    const img = $('#planFloorViewerImage');
    const label = $('#planFloorZoomLabel');
    if (img) img.style.transform = `translate(${viewer.tx}px, ${viewer.ty}px) scale(${viewer.scale})`;
    if (label) label.textContent = `${Math.round(viewer.scale * 100)}%`;
  }

  function setViewerScale(next) {
    viewer.scale = Math.min(viewer.MAX, Math.max(viewer.MIN, next));
    applyViewerTransform();
  }

  function resetViewer() {
    viewer.scale = 1;
    viewer.tx = 0;
    viewer.ty = 0;
    applyViewerTransform();
  }

  function openImageViewer(src, title) {
    const modal = $('#planFloorImageViewer');
    const img = $('#planFloorViewerImage');
    const titleEl = $('#planFloorViewerTitle');
    if (!modal || !img) return;

    img.src = src;
    if (titleEl) titleEl.textContent = title || '계획평면도';
    resetViewer();
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeImageViewer() {
    const modal = $('#planFloorImageViewer');
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    viewer.dragging = false;
    document.body.style.overflow = '';
  }

  function bindImageViewer() {
    $('#planFloorPreviewWrap')?.addEventListener('click', (event) => {
      if (state.mode !== 'view') return;
      const img = event.target.closest('img');
      if (img?.src) openImageViewer(img.src, $('#planFloorDetailSub')?.textContent || '계획평면도');
    });

    document.querySelectorAll('[data-plan-viewer-close]').forEach((el) => {
      el.addEventListener('click', closeImageViewer);
    });

    $('#planFloorZoomInBtn')?.addEventListener('click', () => setViewerScale(viewer.scale * 1.25));
    $('#planFloorZoomOutBtn')?.addEventListener('click', () => setViewerScale(viewer.scale / 1.25));
    $('#planFloorZoomResetBtn')?.addEventListener('click', resetViewer);

    const body = $('#planFloorViewerBody');
    const img = $('#planFloorViewerImage');
    if (!body || !img) return;

    body.addEventListener('wheel', (event) => {
      event.preventDefault();
      setViewerScale(event.deltaY < 0 ? viewer.scale * 1.1 : viewer.scale / 1.1);
    }, { passive: false });

    img.addEventListener('mousedown', (event) => {
      event.preventDefault();
      viewer.dragging = true;
      viewer.startX = event.clientX - viewer.tx;
      viewer.startY = event.clientY - viewer.ty;
      img.classList.add('is-dragging');
    });

    document.addEventListener('mousemove', (event) => {
      if (!viewer.dragging) return;
      viewer.tx = event.clientX - viewer.startX;
      viewer.ty = event.clientY - viewer.startY;
      applyViewerTransform();
    });

    document.addEventListener('mouseup', () => {
      viewer.dragging = false;
      img.classList.remove('is-dragging');
    });

    img.addEventListener('dblclick', () => {
      if (viewer.scale === 1 && !viewer.tx && !viewer.ty) setViewerScale(2);
      else resetViewer();
    });
  }

  function bindAdminTabs() {
    if (!isAdmin) return;
    document.querySelectorAll('[data-board-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        const tab = button.dataset.boardTab;
        if (tab === 'plan') return;
        window.location.href = `board-manage.html?tab=${encodeURIComponent(tab)}`;
      });
    });
  }

  function bindEvents() {
    $('#planFloorSearchForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      applyFilters();
    });

    $('#planFloorSearchPort')?.addEventListener('change', syncSearchPlaceholder);

    $('#planFloorAddBtn')?.addEventListener('click', () => openDetail('add'));
    $('#planFloorSaveBtn')?.addEventListener('click', saveRow);
    $('#planFloorCancelBtn')?.addEventListener('click', () => {
      if (state.mode === 'edit' && state.selectedId) {
        openDetail('view', state.selectedId);
        return;
      }
      closeDetail();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (!$('#planFloorImageViewer')?.hidden) {
        closeImageViewer();
        return;
      }
      if (state.mode === 'edit' && state.selectedId) {
        openDetail('view', state.selectedId);
        return;
      }
      if (state.mode === 'add' || state.mode === 'edit') {
        closeDetail();
      }
    });

    $('#planFloorFileBtn')?.addEventListener('click', () => {
      $('#planFloorFile')?.click();
    });

    $('#planFloorFile')?.addEventListener('change', (event) => {
      handleFileSelect(event.target.files?.[0]);
    });

    $('#planFloorFileDelete')?.addEventListener('click', () => {
      clearPendingFile();
      const row = findRow(state.selectedId);
      if (state.mode === 'edit' && row) {
        updateImagePreview(row.imageUrl || null, 'edit');
      } else {
        updateImagePreview(null, 'edit');
      }
      const nameEl = $('#planFloorFileName');
      if (nameEl) nameEl.textContent = '선택된 파일 없음';
    });

    const dropZone = $('#planFloorFileDrop');
    dropZone?.addEventListener('dragover', (event) => {
      event.preventDefault();
      dropZone.classList.add('is-dragover');
    });
    dropZone?.addEventListener('dragleave', () => {
      dropZone.classList.remove('is-dragover');
    });
    dropZone?.addEventListener('drop', (event) => {
      event.preventDefault();
      dropZone.classList.remove('is-dragover');
      handleFileSelect(event.dataTransfer?.files?.[0]);
    });
  }

  function init() {
    if (isAdmin && typeof PomsSidebarAdmin !== 'undefined') {
      PomsSidebarAdmin.mount('#sidebar-root', { active: 'board' });
    } else {
      PomsSidebar.mount('#sidebar-root', { active: 'archive-law' });
    }
    bindAdminTabs();
    populatePortSelects();
    bindEvents();
    bindImageViewer();
    setupTableHead();
    showDetailPanel(false);
    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
