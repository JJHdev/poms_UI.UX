/**
 * 사용자 페이지 테이블 — 정렬·페이징 공통
 */
const PomsUserTable = (() => {
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const DEFAULT_PAGE_SIZE = 10;

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function createState(overrides = {}) {
    return {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      sort: { key: '', dir: 'asc' },
      ...overrides,
    };
  }

  function pageCount(totalRows, pageSize = DEFAULT_PAGE_SIZE) {
    return Math.max(1, Math.ceil(totalRows / pageSize));
  }

  function clampPage(page, totalRows, pageSize = DEFAULT_PAGE_SIZE) {
    return Math.min(Math.max(page, 1), pageCount(totalRows, pageSize));
  }

  function slicePage(rows, page, pageSize = DEFAULT_PAGE_SIZE) {
    const start = (clampPage(page, rows.length, pageSize) - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }

  function compareValues(a, b) {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a ?? '').localeCompare(String(b ?? ''), 'ko', { numeric: true });
  }

  function sortRows(rows, sortKey, sortDir, getValue) {
    if (!sortKey) return [...rows];
    const dir = sortDir === 'desc' ? -1 : 1;
    return [...rows].sort((a, b) => compareValues(getValue(a, sortKey), getValue(b, sortKey)) * dir);
  }

  function toggleSort(state, key) {
    if (!key) return;
    if (state.sort.key === key) {
      state.sort.dir = state.sort.dir === 'asc' ? 'desc' : 'asc';
    } else {
      state.sort = { key, dir: 'asc' };
    }
    state.page = 1;
  }

  function sortButton(label, key, sort) {
    const active = sort.key === key;
    const dirClass = active ? ` is-${sort.dir}` : '';
    return `<button type="button" class="system-sort${active ? ' is-active' : ''}${dirClass}" data-sort-key="${escapeHtml(key)}" aria-label="${escapeHtml(label)} 정렬"><span>${escapeHtml(label)}</span><i aria-hidden="true"></i></button>`;
  }

  function bindSort(container, state, onSort) {
    if (!container) return;
    container.querySelectorAll('[data-sort-key]').forEach((button) => {
      button.addEventListener('click', () => {
        toggleSort(state, button.getAttribute('data-sort-key'));
        onSort();
      });
    });
  }

  function pageSizeOptionsHTML(selected = DEFAULT_PAGE_SIZE) {
    return PAGE_SIZE_OPTIONS.map((size) => (
      `<option value="${size}"${size === Number(selected) ? ' selected' : ''}>${size} / page</option>`
    )).join('');
  }

  function syncPageSizeSelect(select, state) {
    if (!select) return;
    if (!select.options.length) {
      select.innerHTML = pageSizeOptionsHTML(state.pageSize);
    } else {
      select.value = String(state.pageSize || DEFAULT_PAGE_SIZE);
    }
  }

  function bindPageSize(select, state, onChange) {
    if (!select) return;
    syncPageSizeSelect(select, state);
    select.addEventListener('change', () => {
      state.pageSize = Number(select.value) || DEFAULT_PAGE_SIZE;
      state.page = 1;
      onChange();
    });
  }

  function renderPagination(nav, state, totalRows, onChange) {
    if (!nav) return;
    const totalPages = pageCount(totalRows, state.pageSize);
    state.page = clampPage(state.page, totalRows, state.pageSize);

    const maxVisible = 5;
    let startPage = Math.max(1, state.page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    startPage = Math.max(1, endPage - maxVisible + 1);

    const pages = [];
    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    const arrowIcon = '<img src="assets/main/facility-search/arrow-right.svg" alt="" width="14" height="14">';
    const doubleIcon = '<img src="assets/main/facility-search/arrow-double-right.svg" alt="" width="14" height="14">';

    nav.innerHTML = `
      <button type="button" class="pagination__btn" data-page-move="first" ${state.page === 1 ? 'disabled' : ''} aria-label="첫 페이지">${doubleIcon}</button>
      <button type="button" class="pagination__btn" data-page-move="prev" ${state.page === 1 ? 'disabled' : ''} aria-label="이전 페이지">${arrowIcon}</button>
      ${pages.map((page) => `<button type="button" class="pagination__btn${page === state.page ? ' is-active' : ''}" data-page="${page}"${page === state.page ? ' aria-current="page"' : ''}>${page}</button>`).join('')}
      <button type="button" class="pagination__btn" data-page-move="next" ${state.page === totalPages ? 'disabled' : ''} aria-label="다음 페이지">${arrowIcon}</button>
      <button type="button" class="pagination__btn" data-page-move="last" ${state.page === totalPages ? 'disabled' : ''} aria-label="마지막 페이지">${doubleIcon}</button>
    `;

    nav.querySelectorAll('[data-page]').forEach((button) => {
      button.addEventListener('click', () => {
        state.page = Number(button.getAttribute('data-page'));
        onChange();
      });
    });
    nav.querySelector('[data-page-move="first"]')?.addEventListener('click', () => {
      state.page = 1;
      onChange();
    });
    nav.querySelector('[data-page-move="prev"]')?.addEventListener('click', () => {
      state.page -= 1;
      onChange();
    });
    nav.querySelector('[data-page-move="next"]')?.addEventListener('click', () => {
      state.page += 1;
      onChange();
    });
    nav.querySelector('[data-page-move="last"]')?.addEventListener('click', () => {
      state.page = totalPages;
      onChange();
    });
  }

  function mountFoot({ paginationId, pageSizeId, state, totalRows, onChange }) {
    const nav = document.getElementById(paginationId);
    const select = pageSizeId ? document.getElementById(pageSizeId) : null;
    renderPagination(nav, state, totalRows, onChange);
    if (select && !select.dataset.bound) {
      bindPageSize(select, state, onChange);
      select.dataset.bound = 'true';
    } else if (select) {
      syncPageSizeSelect(select, state);
    }
  }

  function applyHeaderSort(thead, columns, sort) {
    if (!thead || !columns?.length) return;
    thead.innerHTML = `<tr>${columns.map((column) => {
      const classAttr = column.className ? ` class="${column.className}"` : '';
      if (column.sortable === false || !column.key) {
        return `<th scope="col"${classAttr}>${escapeHtml(column.label)}</th>`;
      }
      return `<th scope="col"${classAttr}>${sortButton(column.label, column.key, sort)}</th>`;
    }).join('')}</tr>`;
  }

  return {
    DEFAULT_PAGE_SIZE,
    PAGE_SIZE_OPTIONS,
    escapeHtml,
    createState,
    pageCount,
    clampPage,
    slicePage,
    sortRows,
    toggleSort,
    sortButton,
    bindSort,
    pageSizeOptionsHTML,
    syncPageSizeSelect,
    bindPageSize,
    renderPagination,
    mountFoot,
    applyHeaderSort,
  };
})();
