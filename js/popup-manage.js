/**
 * 팝업관리 화면 스크립트
 */
(() => {
  const today = '2026-06-11';
  const titles = [
    '상반기 정기점검 자료 제출 안내',
    'POMS 시스템 점검 안내',
    '2026년 유지관리계획 등록 안내',
    '항만시설물 안전점검 일정 공지',
    'POMS 모바일 앱 업데이트 안내',
    '개인정보처리방침 개정 안내',
    '설 연휴 고객센터 운영 안내',
    '시스템 로그인 정책 변경 안내',
  ];

  const popups = [];
  for (let i = 1; i <= 28; i++) {
    const offset = i - 1;
    const startDay = String((offset % 20) + 1).padStart(2, '0');
    const endDay = String((offset % 20) + 8).padStart(2, '0');
    const month = String(((offset % 3) + 5)).padStart(2, '0');
    const useYn = i % 6 === 0 ? '미노출' : '노출';
    popups.push({
      id: i,
      title: titles[offset % titles.length],
      start: `2026-${month}-${startDay}`,
      end: `2026-${month}-${endDay}`,
      useYn,
      width: String(480 + (i % 4) * 20),
      image: i % 3 === 0 ? '있음' : '없음',
      link: i % 2 === 0 ? '/notice' : '/main',
      content: `${titles[offset % titles.length]} 관련 안내입니다.`,
    });
  }

  const tableBody = document.getElementById('popupTableBody');
  const statusFilter = document.getElementById('popupStatusFilter');
  const keywordFilter = document.getElementById('popupKeywordFilter');
  const searchForm = document.getElementById('popupSearchForm');
  const resetBtn = document.getElementById('popupResetBtn');
  const newBtn = document.getElementById('popupNew');

  const state = {
    filtered: [...popups],
    page: 1,
    pageSize: 10,
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getDisplayStatus(popup) {
    if (popup.useYn === '미노출') return '미노출';
    if (popup.start > today) return '예약';
    if (popup.end < today) return '종료';
    return '게시중';
  }

  function statusText(status) {
    if (status === '게시중') {
      return '<span class="popup-stat-text">게시중</span>';
    }
    if (status === '예약') {
      return '<span class="popup-stat-text popup-stat-text--wait">예약</span>';
    }
    if (status === '종료') {
      return '<span class="popup-stat-text popup-stat-text--ended">종료</span>';
    }
    return '<span class="popup-stat-text popup-stat-text--off">미노출</span>';
  }

  function goDetail(id, mode = 'detail') {
    const params = new URLSearchParams();
    if (id) params.set('id', id);
    if (mode !== 'detail') params.set('mode', mode);
    window.location.href = `popup-detail.html?${params.toString()}`;
  }

  function renderList() {
    if (!tableBody) return;
    const pageRows = state.filtered.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    const countEl = document.getElementById('popupResultCount');
    if (countEl) countEl.textContent = String(state.filtered.length);

    if (!pageRows.length) {
      tableBody.innerHTML = '<tr><td colspan="5" class="is-empty">조회된 팝업이 없습니다.</td></tr>';
    } else {
      tableBody.innerHTML = pageRows.map((popup) => {
        const status = getDisplayStatus(popup);
        const imageLabel = popup.image === '있음'
          ? '<span class="popup-image-text">있음</span>'
          : '<span class="popup-image-text is-off">없음</span>';
        return `
          <tr class="is-clickable" tabindex="0" data-popup-id="${popup.id}">
            <td>${popup.id}</td>
            <td class="popup-title-cell">${escapeHtml(popup.title)}</td>
            <td>${popup.start} ~ ${popup.end}</td>
            <td>${statusText(status)}</td>
            <td>${imageLabel}</td>
          </tr>
        `;
      }).join('');
    }

    PomsPaging.mount({
      paginationId: 'popupPagination',
      totalRows: state.filtered.length,
      state,
      onChange: renderList,
    });
    bindRows();
  }

  function bindRows() {
    tableBody.querySelectorAll('tr[data-popup-id]').forEach((row) => {
      const popupId = Number(row.dataset.popupId);
      const open = () => goDetail(popupId);
      row.addEventListener('click', open);
      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });
  }

  function applyFilter() {
    const status = statusFilter?.value || '전체';
    const keyword = (keywordFilter?.value || '').trim();
    state.filtered = popups.filter((popup) => {
      const display = getDisplayStatus(popup);
      const statusMatched = status === '전체' || display === status;
      const keywordMatched = !keyword || popup.title.includes(keyword);
      return statusMatched && keywordMatched;
    });
    state.page = 1;
    renderList();
  }

  function resetFilter() {
    if (statusFilter) statusFilter.value = '전체';
    if (keywordFilter) keywordFilter.value = '';
    applyFilter();
  }

  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilter();
  });
  resetBtn?.addEventListener('click', resetFilter);
  newBtn?.addEventListener('click', () => goDetail(null, 'insert'));

  renderList();
})();
