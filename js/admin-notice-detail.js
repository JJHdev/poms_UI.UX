/**
 * 관리자 - 공지사항 상세
 */
(() => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '1';
  const data = AdminNoticesData.getDetail(id);

  function render() {
    document.title = `${data.title} | 공지사항 상세 | POMS`;

    const titleEl = document.getElementById('noticeDetailTitle');
    if (titleEl) titleEl.textContent = data.title || `공지사항 #${data.id}`;

    const badge = document.getElementById('noticePinBadge');
    if (badge) badge.hidden = !data.pinned;

    const setText = (sel, text) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = text;
    };

    setText('[data-field="author"]', data.author);
    setText('[data-field="date"]', data.date);
    setText('[data-field="views"]', String(data.views));
    setText('[data-field="pinned"]', data.pinned ? '고정' : '-');
    setText('[data-field="visible"]', data.visible || '노출');

    const attachRow = document.getElementById('noticeAttachRow');
    const attach = document.getElementById('noticeAttach');
    const attachText = document.getElementById('noticeAttachText');

    if (data.file && attach && attachText) {
      attachRow?.classList.remove('is-empty');
      attach.href = '#';
      attachText.textContent = `${data.file.name} (${data.file.size})`;
    } else if (attachRow && attachText) {
      attachRow.classList.add('is-empty');
      attachText.textContent = '첨부파일 없음';
      if (attach) attach.removeAttribute('href');
    }

    const bodyEl = document.getElementById('noticeDetailBody');
    if (bodyEl && data.body) bodyEl.innerHTML = data.body;
  }

  document.getElementById('noticeBackBtn')?.addEventListener('click', () => {
    window.location.href = 'admin-notices.html';
  });

  document.getElementById('btnNoticeEdit')?.addEventListener('click', () => {
    window.location.href = `admin-notice-edit.html?id=${data.id}`;
  });

  document.getElementById('btnNoticeDelete')?.addEventListener('click', () => {
    if (confirm('이 공지사항을 삭제하시겠습니까? (샘플)')) {
      window.location.href = 'admin-notices.html';
    }
  });

  render();
})();
