/**
 * 관리자 - 게시판 상세 (사용자 게시판 상세와 동일 폼)
 */
(() => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'law-1';
  const data = BoardManageData.getById(id);
  const titleText = BoardManageData.displayTitle(data);
  const listHref = `board-manage.html?tab=${encodeURIComponent(data.tab)}`;

  function setValue(elId, value) {
    const el = document.getElementById(elId);
    if (el) el.value = value ?? '';
  }

  function render() {
    document.title = `${titleText} | 게시글 상세 | POMS 관리자`;

    const sectionTitle = document.getElementById('boardDetailSectionTitle');
    if (sectionTitle) sectionTitle.textContent = `${data.category} 상세`;

    setValue('boardDetailCategory', data.category);
    setValue('boardDetailTitle', titleText);
    setValue('boardDetailWriter', data.writer);
    setValue('boardDetailDate', data.date);
    setValue('boardDetailSize', data.size);

    const descEl = document.getElementById('boardDetailDesc');
    if (descEl) descEl.textContent = data.desc || '-';

    const fileBtn = document.getElementById('boardDetailFile');
    if (fileBtn) {
      if (data.fileName) {
        fileBtn.textContent = data.size ? `${data.fileName} (${data.size})` : data.fileName;
        fileBtn.classList.remove('is-empty');
        fileBtn.addEventListener('click', (event) => {
          event.preventDefault();
          alert('첨부파일 다운로드 기능은 샘플입니다.');
        });
      } else {
        fileBtn.textContent = '첨부된 파일 없음';
        fileBtn.classList.add('is-empty');
      }
    }
  }

  function goList() {
    window.location.href = listHref;
  }

  function bindBackToList() {
    const backBtn = document.querySelector('.fmd-crumb-row .fmd-back-btn');
    if (!backBtn) return;
    const clone = backBtn.cloneNode(true);
    clone.setAttribute('aria-label', '목록으로');
    clone.addEventListener('click', () => {
      goList();
    });
    backBtn.replaceWith(clone);
  }

  document.getElementById('btnBoardEdit')?.addEventListener('click', () => {
    window.location.href = `board-manage-edit.html?id=${encodeURIComponent(data.id)}`;
  });

  document.getElementById('btnBoardDelete')?.addEventListener('click', () => {
    if (confirm('이 게시글을 삭제하시겠습니까? (샘플)')) {
      goList();
    }
  });

  render();

  if (typeof PomsSidebarAdmin !== 'undefined') {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'board' });
  }

  bindBackToList();
})();
