/**
 * 자료수신 상세 페이지
 */
(() => {
  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function goList() {
    window.location.href = 'data-receive.html';
  }

  function renderComments(comments) {
    const rows = $('receiveCommentRows');
    if (!rows) return;
    if (!comments.length) {
      rows.innerHTML = '<tr><td colspan="3" class="is-empty">등록된 댓글이 없습니다.</td></tr>';
      return;
    }
    rows.innerHTML = comments.map((comment) => `
      <tr>
        <td>${escapeHtml(comment[0])}</td>
        <td class="is-left">${escapeHtml(comment[1])}</td>
        <td>${escapeHtml(comment[2])}</td>
      </tr>
    `).join('');
  }

  function init() {
    PomsSidebar.mount('#sidebar-root', { active: 'data-receive' });

    const id = new URLSearchParams(window.location.search).get('id');
    const item = DATA_RECEIVE_ITEMS[id];

    if (!item) {
      alert('자료를 찾을 수 없습니다.');
      goList();
      return;
    }

    const crumb = $('receiveDetailCrumb');
    if (crumb) crumb.textContent = item.subject;

    const org = $('receiveDetailOrg');
    const date = $('receiveDetailDate');
    const subject = $('receiveDetailSubject');
    const content = $('receiveDetailContent');
    const fileBtn = $('receiveDetailFile');

    if (org) org.value = item.org || '';
    if (date) date.value = item.date || '';
    if (subject) subject.value = item.subject || '';
    if (content) content.value = item.content || '';

    if (fileBtn) {
      if (item.file) {
        fileBtn.textContent = item.file;
        fileBtn.classList.remove('is-empty');
        fileBtn.setAttribute('aria-label', `${item.file} 다운로드`);
      } else {
        fileBtn.textContent = '첨부된 파일 없음';
        fileBtn.classList.add('is-empty');
        fileBtn.removeAttribute('aria-label');
      }
    }

    renderComments(item.comments || []);

    $('receiveDetailBackBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      goList();
    });
    $('receiveBackBottom')?.addEventListener('click', goList);

    fileBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.file) alert(`${item.file} 파일을 다운로드합니다. (샘플)`);
    });

    $('receiveDelete')?.addEventListener('click', () => {
      if (!confirm('선택한 자료를 삭제하시겠습니까?')) return;
      alert('삭제되었습니다. (샘플)');
      goList();
    });

    $('receiveCommentAdd')?.addEventListener('click', () => {
      const input = $('receiveCommentInput');
      const value = input?.value.trim();
      if (!value) {
        alert('댓글 내용을 입력하세요.');
        return;
      }
      const rows = $('receiveCommentRows');
      rows?.querySelector('.is-empty')?.closest('tr')?.remove();
      const today = new Date().toISOString().slice(0, 10);
      rows?.insertAdjacentHTML('beforeend', `
        <tr>
          <td>관리자</td>
          <td class="is-left">${escapeHtml(value)}</td>
          <td>${today}</td>
        </tr>
      `);
      input.value = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
