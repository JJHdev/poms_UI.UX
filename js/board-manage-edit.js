/**
 * 관리자 - 게시판 등록/수정
 */
(() => {
  const params = new URLSearchParams(window.location.search);
  const isInsert = params.get('mode') === 'insert';
  const tabParam = params.get('tab');
  const id = params.get('id') || '';
  const data = isInsert
    ? BoardManageData.getInsertDefaults(tabParam)
    : BoardManageData.getById(id);

  let currentFile = data.fileName
    ? { name: data.fileName, size: data.size || '' }
    : null;

  const els = {
    category: document.getElementById('fieldCategory'),
    writer: document.getElementById('fieldWriter'),
    date: document.getElementById('fieldDate'),
    title: document.getElementById('fieldTitle'),
    content: document.getElementById('fieldContent'),
    attachList: document.getElementById('attachList'),
    fileInput: document.getElementById('fileInput'),
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function listHref() {
    const tab = els.category?.value || data.tab || 'law';
    return `board-manage.html?tab=${encodeURIComponent(tab)}`;
  }

  function goBack() {
    window.location.href = listHref();
  }

  function bindBackToList() {
    const backBtn = document.querySelector('.fmd-crumb-row .fmd-back-btn');
    if (!backBtn) return;
    const clone = backBtn.cloneNode(true);
    clone.setAttribute('aria-label', '목록으로');
    clone.addEventListener('click', () => {
      goBack();
    });
    backBtn.replaceWith(clone);
  }

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '1 KB';
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  function renderAttachList() {
    if (!els.attachList) return;
    if (!currentFile) {
      els.attachList.innerHTML = '<span class="ne-attach__empty">첨부된 파일이 없습니다.</span>';
      return;
    }
    const sizeLabel = currentFile.size ? ` (${escapeHtml(currentFile.size)})` : '';
    els.attachList.innerHTML = `
      <div class="ne-attach__file">
        <img src="assets/admin-notices/icon-attach.svg" alt="" width="16" height="16">
        <span class="ne-attach__name">${escapeHtml(currentFile.name)}${sizeLabel}</span>
        <button type="button" class="ne-attach__remove" aria-label="첨부 삭제">×</button>
      </div>`;
    els.attachList.querySelector('.ne-attach__remove')?.addEventListener('click', () => {
      currentFile = null;
      renderAttachList();
    });
  }

  function initPageChrome() {
    document.body.classList.toggle('is-insert', isInsert);

    const pageTitle = isInsert ? '게시글 등록' : '게시글 수정';
    const titleEl = document.getElementById('boardEditPageTitle');
    const saveText = document.getElementById('btnBoardSaveText');

    if (titleEl) titleEl.textContent = isInsert ? '게시글 등록' : '상세 내용 수정';
    if (saveText) saveText.textContent = isInsert ? '등록하기' : '수정하기';

    document.title = isInsert
      ? '게시글 등록 | POMS 관리자'
      : `${BoardManageData.displayTitle(data)} | 게시글 수정 | POMS 관리자`;
  }

  function initForm() {
    if (els.category) els.category.value = data.tab || 'law';
    if (els.writer) els.writer.value = data.writer || '';
    if (els.date) els.date.value = data.date || '';
    if (els.title) els.title.value = isInsert ? '' : BoardManageData.displayTitle(data);
    if (els.content) els.content.innerHTML = data.body || '';
    renderAttachList();
  }

  document.getElementById('btnBoardCancel')?.addEventListener('click', goBack);

  document.getElementById('btnAddFile')?.addEventListener('click', () => {
    els.fileInput?.click();
  });

  els.fileInput?.addEventListener('change', () => {
    const file = els.fileInput.files?.[0];
    if (!file) return;
    currentFile = { name: file.name, size: formatFileSize(file.size) };
    renderAttachList();
    els.fileInput.value = '';
  });

  document.getElementById('btnBoardSave')?.addEventListener('click', () => {
    if (!els.title?.value.trim()) {
      alert('제목을 입력하세요.');
      els.title?.focus();
      return;
    }
    if (!els.content?.textContent?.trim()) {
      alert('내용을 입력하세요.');
      els.content?.focus();
      return;
    }
    alert(isInsert ? '게시글이 등록되었습니다. (샘플)' : '게시글이 수정되었습니다. (샘플)');
    const tab = els.category?.value || data.tab || 'law';
    const nextId = data.id || `${tab}-1`;
    window.location.href = `board-manage-detail.html?id=${encodeURIComponent(nextId)}`;
  });

  document.getElementById('btnBoardDelete')?.addEventListener('click', () => {
    if (confirm('이 게시글을 삭제하시겠습니까? (샘플)')) {
      window.location.href = listHref();
    }
  });

  document.getElementById('boardEditForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  initPageChrome();
  initForm();

  if (typeof PomsSidebarAdmin !== 'undefined') {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'board' });
  }

  bindBackToList();
})();
