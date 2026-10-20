/**
 * 관리자 - 공지사항
 */
(() => {
  const NOTICES = [];
  const titles = [
    'POMS 시스템 점검 안내',
    '2026년 항만시설물 유지관리 교육 안내',
    '시스템 사업자평가 대상 안내',
    '항만시설물 안전점검 일정 공지',
    'POMS 모바일 앱 업데이트 안내',
    '2026년 1분기 시설물 통계 공개',
    '개인정보처리방침 개정 안내',
    '항만시설물 유지관리 매뉴얼 배포',
    '설 연휴 고객센터 운영 안내',
    '시스템 로그인 정책 변경 안내',
  ];

  for (let i = 1; i <= 50; i++) {
    const pinned = i % 7 === 0 || i === 1 || i === 3;
    const titleBase = titles[(i - 1) % titles.length];
    NOTICES.push({
      id: i,
      title: titleBase,
      created: `2026-0${((i % 5) + 1)}-${String((i % 27) + 1).padStart(2, '0')}`,
      modified: `2026-0${((i % 5) + 1)}-${String((i % 25) + 2).padStart(2, '0')}`,
      author: i % 4 === 0 ? '관리자' : `담당자${(i % 10) + 1}`,
      views: 50 + i * 7,
      pinned,
      visible: i % 5 === 0 ? '미노출' : '노출',
      content: '공지 제목, 내용, 노출여부, 첨부파일을 입력하고 관리합니다.',
      file: i % 4 === 0 ? 'poms_notice_attach.pdf' : '',
    });
  }

  const pagingState = {
    page: 1,
    pageSize: 10,
  };
  let filtered = [...NOTICES];
  const tbody = document.getElementById('noticeAdminBody');
  const searchInput = document.getElementById('noticeAdminSearch');

  function getPageData() {
    const start = (pagingState.page - 1) * pagingState.pageSize;
    return filtered.slice(start, start + pagingState.pageSize);
  }

  function totalPages() {
    return Math.max(1, Math.ceil(filtered.length / pagingState.pageSize));
  }

  function rowStatus(n) {
    if (n.visible === '미노출') {
      return '-';
    }
    return '<span class="notice-stat-badge">노출</span>';
  }

  function renderTable() {
    const rows = getPageData();
    const countEl = document.getElementById('noticeResultCount');
    if (countEl) countEl.textContent = String(filtered.length);
    if (!tbody) return;

    tbody.innerHTML = rows.map((n) => {
      const pinLabel = n.pinned
        ? '<span class="notice-pin-text">고정</span>'
        : '<span class="notice-pin-text is-off">-</span>';
      return `
        <tr class="is-clickable" data-notice-id="${n.id}">
          <td>${n.id}</td>
          <td class="notice-title-cell">${n.title}</td>
          <td>${n.created}</td>
          <td>${n.modified}</td>
          <td>${n.author}</td>
          <td>${pinLabel}</td>
          <td>${rowStatus(n)}</td>
        </tr>`;
    }).join('');

    tbody.querySelectorAll('tr[data-notice-id]').forEach((row) => {
      row.addEventListener('click', () => {
        const notice = NOTICES.find((item) => item.id === Number(row.dataset.noticeId));
        if (!notice) return;
        window.location.href = `admin-notice-detail.html?id=${notice.id}`;
      });
    });
  }

  function renderPagination() {
    PomsPaging.mount({
      paginationId: 'noticePagination',
      totalRows: filtered.length,
      state: pagingState,
      onChange: () => {
        render();
      },
    });
  }

  function applyFilter() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    filtered = q
      ? NOTICES.filter((n) => n.title.toLowerCase().includes(q) || n.author.toLowerCase().includes(q) || String(n.id).includes(q))
      : [...NOTICES];
    pagingState.page = 1;
    render();
  }

  function resetFilter() {
    if (searchInput) searchInput.value = '';
    applyFilter();
  }

  function render() {
    if (pagingState.page > totalPages()) pagingState.page = totalPages();
    renderTable();
    renderPagination();
  }

  document.getElementById('noticeSearchForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilter();
  });

  document.getElementById('noticeResetBtn')?.addEventListener('click', resetFilter);

  document.getElementById('btnNoticeInsert')?.addEventListener('click', () => {
    window.location.href = 'admin-notice-edit.html?mode=insert';
  });

  render();
})();
