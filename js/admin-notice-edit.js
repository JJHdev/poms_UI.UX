/**
 * 관리자 - 공지사항 수정/등록
 * (사용자 시설물 상세 등록 폼 톤)
 */
(() => {
  const params = new URLSearchParams(window.location.search);
  const isInsert = params.get('mode') === 'insert';
  const id = params.get('id') || '1';
  const data = isInsert
    ? {
        id: '',
        title: '',
        author: '관리자',
        date: '2026-06-27 09:00',
        modified: '2026-06-27 09:00',
        views: 0,
        pinned: false,
        visible: '노출',
        file: null,
        body: '',
      }
    : AdminNoticesData.getDetail(id);

  let currentFile = data.file ? { ...data.file } : null;

  const els = {
    no: document.getElementById('fieldNo'),
    title: document.getElementById('fieldTitle'),
    author: document.getElementById('fieldAuthor'),
    created: document.getElementById('fieldCreated'),
    modified: document.getElementById('fieldModified'),
    views: document.getElementById('fieldViews'),
    pinned: document.getElementById('fieldPinned'),
    visible: document.getElementById('fieldVisible'),
    content: document.getElementById('fieldContent'),
    attachList: document.getElementById('attachList'),
    fileInput: document.getElementById('fileInput'),
    pinBadge: document.getElementById('noticePinBadge'),
  };

  function goBack() {
    if (isInsert || !data.id) {
      window.location.href = 'admin-notices.html';
      return;
    }
    window.location.href = `admin-notice-detail.html?id=${data.id}`;
  }

  function syncPinBadge() {
    if (!els.pinBadge) return;
    els.pinBadge.hidden = els.pinned?.value !== 'Y';
  }

  function renderAttachList() {
    if (!els.attachList) return;
    if (!currentFile) {
      els.attachList.innerHTML = '<span class="ne-attach__empty">첨부된 파일이 없습니다.</span>';
      return;
    }
    els.attachList.innerHTML = `
      <div class="ne-attach__file">
        <img src="assets/admin-notices/icon-attach.svg" alt="" width="16" height="16">
        <span class="ne-attach__name">${currentFile.name} (${currentFile.size})</span>
        <button type="button" class="ne-attach__remove" aria-label="첨부 삭제">×</button>
      </div>`;
    els.attachList.querySelector('.ne-attach__remove')?.addEventListener('click', () => {
      currentFile = null;
      renderAttachList();
    });
  }

  function initPageChrome() {
    const pageTitle = isInsert ? '공지사항 등록' : '공지사항 수정';
    document.body.classList.toggle('is-insert', isInsert);
    const titleEl = document.getElementById('noticeEditPageTitle');
    const crumbEl = document.getElementById('noticeEditCrumb');
    if (titleEl) titleEl.textContent = pageTitle;
    if (crumbEl) crumbEl.textContent = pageTitle;
    document.title = isInsert ? '공지사항 등록 | POMS' : `${data.title} | 공지사항 수정 | POMS`;
  }

  function initForm() {
    if (els.no) els.no.value = String(data.id || '');
    if (els.title) els.title.value = data.title || '';
    if (els.author) els.author.value = data.author || '';
    if (els.created) els.created.value = data.date || '';
    if (els.modified) els.modified.value = data.modified || data.date || '';
    if (els.views) els.views.value = String(data.views ?? 0);
    if (els.pinned) els.pinned.value = data.pinned ? 'Y' : 'N';
    if (els.visible) els.visible.value = data.visible || '노출';
    if (els.content) els.content.innerHTML = data.body || '';
    syncPinBadge();
    renderAttachList();
  }

  function bindRte() {
    document.querySelectorAll('.notice-rte__btn[data-cmd]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        if (cmd === 'createLink') {
          const url = prompt('링크 URL을 입력하세요', 'https://');
          if (url) document.execCommand('createLink', false, url);
          return;
        }
        document.execCommand(cmd, false, null);
        els.content?.focus();
      });
    });

    const fontSize = document.getElementById('rteFontSize');
    fontSize?.addEventListener('change', () => {
      const size = fontSize.value.replace('pt', '');
      document.execCommand('fontSize', false, '4');
      const fontElements = els.content?.querySelectorAll('font[size]');
      fontElements?.forEach((el) => {
        el.removeAttribute('size');
        el.style.fontSize = `${size}pt`;
      });
    });
  }

  document.getElementById('noticeBackBtn')?.addEventListener('click', goBack);
  document.getElementById('btnNoticeCancel')?.addEventListener('click', goBack);

  document.getElementById('btnAddFile')?.addEventListener('click', () => {
    els.fileInput?.click();
  });

  els.fileInput?.addEventListener('change', () => {
    const file = els.fileInput.files?.[0];
    if (!file) return;
    const sizeKb = Math.max(1, Math.round(file.size / 1024));
    currentFile = { name: file.name, size: `${sizeKb} KB` };
    renderAttachList();
    els.fileInput.value = '';
  });

  els.pinned?.addEventListener('change', syncPinBadge);

  document.getElementById('btnNoticeSave')?.addEventListener('click', () => {
    if (!els.title?.value.trim()) {
      alert('제목을 입력하세요.');
      els.title?.focus();
      return;
    }
    alert('공지사항이 저장되었습니다. (샘플)');
    window.location.href = `admin-notice-detail.html?id=${data.id || 51}`;
  });

  document.getElementById('btnNoticeDelete')?.addEventListener('click', () => {
    if (confirm('이 공지사항을 삭제하시겠습니까? (샘플)')) {
      window.location.href = 'admin-notices.html';
    }
  });

  document.getElementById('noticeEditForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  initPageChrome();
  initForm();
  bindRte();
})();
