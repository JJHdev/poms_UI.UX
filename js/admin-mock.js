/**
 * 관리자 공통 목업 스크립트
 * 페이지별 업무 흐름은 각 페이지 JS에서 처리한다.
 */
(() => {
  const iconMap = {
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
  };

  const iconTargets = [
    '.btn-excel',
    '.btn-user-add',
    '.btn-admin-search',
    '.btn-admin-reset',
    '.mock-primary-action',
    '.mock-upload-action',
    '.mock-search-action',
    '.mock-reset-action',
  ].join(',');

  function iconSvg(type) {
    return `<span class="mock-btn-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">${iconMap[type]}</svg></span>`;
  }

  function getIconType(btn) {
    const text = btn.textContent.trim();
    if (btn.classList.contains('btn-excel') || text.includes('다운로드') || text.includes('양식')) return 'download';
    if (btn.classList.contains('btn-user-add') || text.includes('신규') || text.includes('등록')) return 'plus';
    if (text.includes('업로드')) return 'upload';
    if (text.includes('검색')) return 'search';
    if (text.includes('초기화') || text.includes('선택 취소')) return 'reset';
    return 'save';
  }

  function enhanceButtons(root = document) {
    root.querySelectorAll(iconTargets).forEach((btn) => {
      const text = btn.textContent.trim();
      if (
        btn.closest('table')
        || btn.classList.contains('btn-admin-search')
        || btn.classList.contains('pagination__btn')
        || btn.classList.contains('mock-row-btn')
        || btn.classList.contains('mock-no-icon')
        || btn.closest('.mock-drawer__foot')
        || text.includes('댓글')
        || text.includes('검색')
        || ['닫기', '삭제', '결재이력', '< 이전', '다음 >'].includes(text)
        || btn.querySelector('svg')
      ) return;
      const type = getIconType(btn);
      if (!iconMap[type]) return;
      btn.insertAdjacentHTML('afterbegin', iconSvg(type));
    });
  }

  function bindFilterReset(root = document) {
    root.querySelectorAll('[data-reset-filter]').forEach((btn) => {
      if (btn.dataset.resetBound === 'true') return;
      btn.dataset.resetBound = 'true';
      btn.addEventListener('click', () => {
        const filter = btn.closest('.mock-filter, .notice-admin-toolbar, form');
        filter?.querySelectorAll('input, select').forEach((el) => {
          if (el.tagName === 'SELECT') el.selectedIndex = 0;
          else if (el.type !== 'date' && el.type !== 'month') el.value = '';
        });
      });
    });
  }

  function selectTableRow(row) {
    const tbody = row.closest('tbody');
    tbody?.querySelectorAll('tr').forEach((el) => el.classList.remove('is-selected'));
    row.classList.add('is-selected');
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  enhanceButtons();
  bindFilterReset();

  window.PomsMock = {
    bindFilterReset,
    enhanceButtons,
    escapeHtml,
    selectTableRow,
  };
})();
