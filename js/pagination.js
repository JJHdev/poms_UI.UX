globalThis.PomsPaging = (() => {
  const DEFAULT_PAGE_SIZE = 10;
  const ARROW = 'assets/main/facility-search/arrow-right.svg';
  const ARROW_DOUBLE = 'assets/main/facility-search/arrow-double-right.svg';

  function totalPages(totalRows, pageSize) {
    return Math.max(1, Math.ceil(totalRows / (pageSize || DEFAULT_PAGE_SIZE)));
  }

  function clampPage(page, totalRows, pageSize) {
    return Math.min(Math.max(page || 1, 1), totalPages(totalRows, pageSize));
  }

  function renderSummary(summary, state, totalRows) {
    if (!summary) return;
    const pageSize = state.pageSize || DEFAULT_PAGE_SIZE;
    const start = totalRows === 0 ? 0 : (state.page - 1) * pageSize + 1;
    const end = Math.min(state.page * pageSize, totalRows);
    summary.innerHTML = `<strong>${start}-${end}</strong> / ${totalRows}건`;
  }

  function renderPagination(nav, state, totalRows, onChange) {
    if (!nav) return;

    const pageSize = state.pageSize || DEFAULT_PAGE_SIZE;
    const total = totalPages(totalRows, pageSize);
    state.page = clampPage(state.page, totalRows, pageSize);

    const maxVisible = 5;
    let startPage = Math.max(1, state.page - 2);
    let endPage = Math.min(total, startPage + maxVisible - 1);
    startPage = Math.max(1, endPage - maxVisible + 1);

    const pages = [];
    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    nav.innerHTML = `
      <button type="button" class="pagination__btn" data-page-move="first" aria-label="처음 페이지"${state.page === 1 ? ' disabled' : ''}>
        <img src="${ARROW_DOUBLE}" alt="" width="14" height="14">
      </button>
      <button type="button" class="pagination__btn" data-page-move="prev" aria-label="이전 페이지"${state.page === 1 ? ' disabled' : ''}>
        <img src="${ARROW}" alt="" width="14" height="14">
      </button>
      ${pages.map((page) => `<button type="button" class="pagination__btn${page === state.page ? ' is-active' : ''}" data-page="${page}"${page === state.page ? ' aria-current="page"' : ''}>${page}</button>`).join('')}
      ${endPage < total ? `<span class="pagination__ellipsis">...</span><button type="button" class="pagination__btn" data-page="${total}">${total}</button>` : ''}
      <button type="button" class="pagination__btn" data-page-move="next" aria-label="다음 페이지"${state.page === total ? ' disabled' : ''}>
        <img src="${ARROW}" alt="" width="14" height="14">
      </button>
      <button type="button" class="pagination__btn" data-page-move="last" aria-label="마지막 페이지"${state.page === total ? ' disabled' : ''}>
        <img src="${ARROW_DOUBLE}" alt="" width="14" height="14">
      </button>
    `;

    nav.querySelectorAll('[data-page]').forEach((button) => {
      button.addEventListener('click', () => {
        state.page = Number(button.dataset.page);
        onChange?.(state);
      });
    });

    nav.querySelectorAll('[data-page-move]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.pageMove;
        if (action === 'first') state.page = 1;
        if (action === 'prev') state.page = Math.max(1, state.page - 1);
        if (action === 'next') state.page = Math.min(total, state.page + 1);
        if (action === 'last') state.page = total;
        onChange?.(state);
      });
    });
  }

  function bindPageSize(select, state, onChange) {
    if (!select || select.dataset.pomsPagingBound === 'true') return;
    select.value = String(state.pageSize || DEFAULT_PAGE_SIZE);
    select.addEventListener('change', () => {
      state.pageSize = Number(select.value) || DEFAULT_PAGE_SIZE;
      state.page = 1;
      onChange?.(state);
    });
    select.dataset.pomsPagingBound = 'true';
  }

  function mount({ paginationId, summaryId, pageSizeId, totalRows, state, onChange }) {
    if (!state) return;
    state.pageSize = state.pageSize || DEFAULT_PAGE_SIZE;
    state.page = clampPage(state.page, totalRows, state.pageSize);

    bindPageSize(document.getElementById(pageSizeId), state, onChange);
    renderSummary(document.getElementById(summaryId), state, totalRows);
    renderPagination(document.getElementById(paginationId), state, totalRows, onChange);
  }

  function mountStatic({ paginationId, summaryId, pageSizeId, bodyId, rowSelector = 'tr', state }) {
    const body = document.getElementById(bodyId);
    if (!body) return;

    const pagingState = state || {
      page: 1,
      pageSize: Number(document.getElementById(pageSizeId)?.value) || DEFAULT_PAGE_SIZE,
    };

    function render() {
      const rows = Array.from(body.querySelectorAll(rowSelector));
      pagingState.pageSize = pagingState.pageSize || DEFAULT_PAGE_SIZE;
      pagingState.page = clampPage(pagingState.page, rows.length, pagingState.pageSize);

      const start = (pagingState.page - 1) * pagingState.pageSize;
      const end = start + pagingState.pageSize;
      rows.forEach((row, index) => {
        row.hidden = index < start || index >= end;
      });

      mount({
        paginationId,
        summaryId,
        pageSizeId,
        totalRows: rows.length,
        state: pagingState,
        onChange: render,
      });
    }

    render();
  }

  return {
    mount,
    mountStatic,
    renderPagination,
    renderSummary,
    clampPage,
    totalPages,
  };
})();
