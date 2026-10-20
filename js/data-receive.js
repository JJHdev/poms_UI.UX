/**
 * 자료수신 목록 — 검색/페이징/상세 이동
 */
(() => {
  const PAGE_SIZE = 10;
  const note = document.getElementById('receiveNote');
  const tbody = document.getElementById('receiveTableBody');
  const countEl = document.getElementById('receiveResultCount');

  const state = {
    filtered: typeof getDataReceiveList === 'function' ? getDataReceiveList() : [],
    page: typeof PomsUserTable !== 'undefined'
      ? PomsUserTable.createState({ pageSize: PAGE_SIZE })
      : { page: 1, pageSize: PAGE_SIZE },
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function applyFilter() {
    const gbn = document.getElementById('receiveSearchGbn')?.value || 'subject';
    const keyword = (document.getElementById('receiveKeyword')?.value || '').trim();
    const all = typeof getDataReceiveList === 'function' ? getDataReceiveList() : [];

    state.filtered = all.filter((row) => {
      if (!keyword) return true;
      if (gbn === 'contents') return (row.content || '').includes(keyword);
      return (row.subject || '').includes(keyword);
    });
    state.page.page = 1;
    renderTable();
  }

  function renderTable() {
    if (!tbody) return;
    const rows = state.filtered;
    if (countEl) countEl.textContent = String(rows.length);

    if (typeof PomsUserTable !== 'undefined') {
      PomsUserTable.mountFoot({
        paginationId: 'receivePagination',
        state: state.page,
        totalRows: rows.length,
        onChange: renderTable,
      });
    }

    const pageSize = state.page.pageSize || PAGE_SIZE;
    const pageRows = typeof PomsUserTable !== 'undefined'
      ? PomsUserTable.slicePage(rows, state.page.page, pageSize)
      : rows.slice(0, pageSize);
    const start = (state.page.page - 1) * pageSize;

    if (!pageRows.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="is-empty">검색결과가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = pageRows.map((row, i) => `
      <tr data-receive-id="${escapeHtml(row.id)}" class="is-clickable">
        <td class="col-no">${start + i + 1}</td>
        <td>${escapeHtml(row.org)}</td>
        <td class="col-subject">${escapeHtml(row.subject)}</td>
        <td class="col-file"><button type="button" class="fcr-hist-btn" data-file-download>다운로드</button></td>
        <td>${escapeHtml(row.date)}</td>
      </tr>
    `).join('');
  }

  function bindTableEvents() {
    tbody?.addEventListener('click', (event) => {
      const downloadBtn = event.target.closest('[data-file-download]');
      if (downloadBtn) {
        event.stopPropagation();
        const row = downloadBtn.closest('[data-receive-id]');
        const item = DATA_RECEIVE_ITEMS?.[row?.dataset.receiveId];
        if (item) alert(`${item.file} 파일을 다운로드합니다. (샘플)`);
        return;
      }

      const row = event.target.closest('[data-receive-id]');
      if (!row) return;
      window.location.href = `data-receive-detail.html?id=${encodeURIComponent(row.dataset.receiveId)}`;
    });
  }

  PomsSidebar.mount('#sidebar-root', { active: 'data-receive' });
  bindTableEvents();
  renderTable();

  document.getElementById('receiveSearchGbn')?.addEventListener('change', (event) => {
    const keyword = document.getElementById('receiveKeyword');
    if (keyword) {
      keyword.value = '';
      keyword.placeholder = `${event.target.options[event.target.selectedIndex].textContent}을 입력하세요.`;
    }
  });

  document.getElementById('receiveSearch')?.addEventListener('click', () => {
    applyFilter();
    if (note) note.textContent = '※ 현재 검색 조건으로 유지관리 자료를 조회합니다.';
  });

  document.getElementById('receiveSearchForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementById('receiveSearch')?.click();
  });

  document.getElementById('receiveKeyword')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById('receiveSearch')?.click();
    }
  });

  document.getElementById('receiveReset')?.addEventListener('click', () => {
    const searchGbn = document.getElementById('receiveSearchGbn');
    const keyword = document.getElementById('receiveKeyword');
    if (searchGbn) searchGbn.value = 'subject';
    if (keyword) {
      keyword.value = '';
      keyword.placeholder = '제목을 입력하세요.';
    }
    if (note) note.textContent = '※ 행을 선택하면 상세페이지에서 제목, 내용, 첨부파일, 댓글을 확인합니다.';
    state.filtered = typeof getDataReceiveList === 'function' ? getDataReceiveList() : [];
    state.page.page = 1;
    renderTable();
  });
})();
