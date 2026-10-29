(() => {
  const TAB_LABELS = BoardManageData.TAB_LABELS;

  const state = {
    tab: 'law',
    filtered: [],
    page: 1,
    pageSize: 10,
  };

  const $ = (id) => document.getElementById(id);

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function attachIconHtml() {
    return '<img src="assets/main/safety-report/icon-download.svg" alt="" width="16" height="16">';
  }

  function getFilteredRows() {
    const keyword = ($('boardManageKeyword')?.value || '').trim().toLowerCase();
    return BoardManageData.getRows(state.tab).filter((row) => {
      if (!keyword) return true;
      return row.desc.toLowerCase().includes(keyword)
        || BoardManageData.displayTitle(row).toLowerCase().includes(keyword);
    });
  }

  function downloadAttachment(fileName) {
    const name = String(fileName || '').trim();
    if (!name || name === '-') {
      alert('다운로드할 첨부파일이 없습니다.');
      return;
    }
    alert('첨부파일 다운로드 기능은 샘플입니다.');
  }

  function render() {
    const body = $('boardManageTableBody');
    if (!body) return;

    $('boardManageResultCount').textContent = String(state.filtered.length);

    if (!state.filtered.length) {
      body.innerHTML = '<tr><td colspan="7">조회된 자료가 없습니다.</td></tr>';
      PomsUserTable.mountFoot({
        paginationId: 'boardManagePagination',
        state,
        totalRows: 0,
        onChange: render,
      });
      return;
    }

    const rows = PomsUserTable.slicePage(state.filtered, state.page, state.pageSize);
    const start = (state.page - 1) * state.pageSize;
    body.innerHTML = rows.map((row, index) => {
      const title = BoardManageData.displayTitle(row);
      return `
        <tr data-row-id="${escapeHtml(row.id)}" class="is-clickable" tabindex="0">
          <td class="col-no">${start + index + 1}</td>
          <td class="col-title" title="${escapeHtml(title)}">${escapeHtml(title)}</td>
          <td class="col-desc">${escapeHtml(row.desc)}</td>
          <td class="col-writer">${escapeHtml(row.writer)}</td>
          <td class="col-date">${escapeHtml(row.date)}</td>
          <td class="col-file">
            <button
              type="button"
              class="archive-file-attach"
              data-file-name="${escapeHtml(row.fileName)}"
              aria-label="${escapeHtml(row.fileName)} 다운로드"
            >${attachIconHtml()}</button>
          </td>
          <td class="col-size">${escapeHtml(row.size)}</td>
        </tr>
      `;
    }).join('');

    body.querySelectorAll('.archive-file-attach').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        downloadAttachment(button.dataset.fileName);
      });
    });

    body.querySelectorAll('tr[data-row-id]').forEach((tr) => {
      const openDetail = () => {
        window.location.href = `board-manage-detail.html?id=${encodeURIComponent(tr.dataset.rowId)}`;
      };
      tr.addEventListener('click', openDetail);
      tr.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDetail();
        }
      });
    });

    PomsUserTable.mountFoot({
      paginationId: 'boardManagePagination',
      state,
      totalRows: state.filtered.length,
      onChange: render,
    });
  }

  function applyFilters() {
    state.filtered = getFilteredRows();
    state.page = 1;
    render();
  }

  function setTab(tab) {
    if (tab === 'plan') {
      window.location.href = 'board-manage-plan.html';
      return;
    }
    state.tab = TAB_LABELS[tab] ? tab : 'law';
    document.querySelectorAll('[data-board-tab]').forEach((button) => {
      const active = button.dataset.boardTab === state.tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    applyFilters();
  }

  function init() {
    if (typeof PomsSidebarAdmin !== 'undefined') {
      PomsSidebarAdmin.mount('#sidebar-root', { active: 'board' });
    }

    const initialTab = new URLSearchParams(window.location.search).get('tab');
    if (initialTab === 'plan') {
      window.location.replace('board-manage-plan.html');
      return;
    }
    if (TAB_LABELS[initialTab]) {
      state.tab = initialTab;
    }

    document.querySelectorAll('[data-board-tab]').forEach((button) => {
      button.addEventListener('click', () => setTab(button.dataset.boardTab));
    });

    $('boardManageSearchForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      applyFilters();
    });

    $('boardManageNewBtn')?.addEventListener('click', () => {
      window.location.href = `board-manage-edit.html?mode=insert&tab=${encodeURIComponent(state.tab)}`;
    });

    setTab(state.tab);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
