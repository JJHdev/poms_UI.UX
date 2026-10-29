/**
 * 책임기술자 관리 — 검색, 목록, 페이징, 상세 페이지 이동
 */
(() => {
  const state = {
    rows: RESPONSIBLE_ENGINEER_ROWS.map((row) => ({ ...row })),
    filtered: [],
    page: 1,
    pageSize: 10,
    sortKey: '',
    sortDir: 'asc',
  };

  const SORT_COLUMNS = [
    { key: 'organization' },
    { key: 'name' },
    { key: 'department' },
    { key: 'category' },
    { key: 'field' },
    { key: 'career' },
    { key: 'eduStatus' },
    { key: 'eduDate' },
    { key: 'association' },
    { key: 'grade' },
    { key: 'fileName' },
  ];

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function goDetail(id) {
    const url = id
      ? `responsible-engineer-detail.html?id=${encodeURIComponent(id)}`
      : 'responsible-engineer-detail.html';
    window.location.href = url;
  }

  function attachFileHtml(fileName) {
    if (!fileName) return '-';
    return `<span class="engineer-file-attach" title="${fileName}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
      <span class="engineer-file-attach__name">${fileName}</span>
    </span>`;
  }

  function filterRows() {
    const name = $('#engineerSearchName')?.value.trim() || '';
    const department = $('#engineerSearchDept')?.value || '';
    const category = $('#engineerSearchCategory')?.value || '';
    const field = $('#engineerSearchField')?.value || '';
    const eduStatus = $('#engineerSearchEdu')?.value || '';
    const grade = $('#engineerSearchGrade')?.value || '';

    state.filtered = state.rows.filter((row) => {
      if (name && !row.name.includes(name)) return false;
      if (department && row.department !== department) return false;
      if (category && row.category !== category) return false;
      if (field && row.field !== field) return false;
      if (eduStatus && row.eduStatus !== eduStatus) return false;
      if (grade && row.grade !== grade) return false;
      return true;
    });
    sortRows();
    state.page = 1;
  }

  function compareValue(a, b) {
    return String(a ?? '').trim().localeCompare(String(b ?? '').trim(), 'ko', {
      numeric: true,
      sensitivity: 'base',
    });
  }

  function sortRows() {
    if (!state.sortKey) return;
    const dir = state.sortDir === 'desc' ? -1 : 1;
    state.filtered.sort((a, b) => compareValue(a[state.sortKey], b[state.sortKey]) * dir);
  }

  function enhanceSortableHeaders() {
    const headRow = document.querySelector('.engineer-table thead tr');
    if (!headRow) return;

    Array.from(headRow.children).slice(1).forEach((th, index) => {
      const config = SORT_COLUMNS[index];
      if (!config) return;
      const label = th.textContent.trim();
      th.innerHTML = `<button type="button" class="system-sort" data-engineer-sort="${config.key}"><span>${label}</span><i aria-hidden="true"></i></button>`;
    });
  }

  function updateSortHeaders() {
    document.querySelectorAll('[data-engineer-sort]').forEach((btn) => {
      const active = btn.getAttribute('data-engineer-sort') === state.sortKey;
      btn.classList.toggle('is-asc', active && state.sortDir === 'asc');
      btn.classList.toggle('is-desc', active && state.sortDir === 'desc');
      btn.setAttribute('aria-sort', active ? (state.sortDir === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }

  function pageCount() {
    return Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  }

  function getPageRows() {
    const start = (state.page - 1) * state.pageSize;
    return state.filtered.slice(start, start + state.pageSize);
  }

  function renderTable() {
    const tbody = $('#engineerTableBody');
    const countEl = $('#engineerResultCount');
    if (!tbody) return;

    if (countEl) countEl.textContent = state.filtered.length.toLocaleString();

    const pageRows = getPageRows();
    if (!pageRows.length) {
      tbody.innerHTML = '<tr><td colspan="12">조회된 데이터가 없습니다.</td></tr>';
      renderPagination();
      updateSortHeaders();
      return;
    }

    const startNo = (state.page - 1) * state.pageSize;
    tbody.innerHTML = pageRows.map((row, index) => `
      <tr data-id="${row.id}" tabindex="0" role="link">
        <td class="col-no">${startNo + index + 1}</td>
        <td>${row.organization}</td>
        <td class="col-name"><button type="button" class="engineer-name-link" data-open-engineer="${row.id}">${row.name}</button></td>
        <td>${row.department || '-'}</td>
        <td>${row.category}</td>
        <td>${row.field || '-'}</td>
        <td>${row.career || '-'}</td>
        <td>${row.eduStatus || '-'}</td>
        <td>${row.eduDate || '-'}</td>
        <td>${row.association || '-'}</td>
        <td>${row.grade || '-'}</td>
        <td>${attachFileHtml(row.fileName)}</td>
      </tr>
    `).join('');

    tbody.querySelectorAll('tr[data-id]').forEach((tr) => {
      const open = () => goDetail(tr.getAttribute('data-id'));
      tr.addEventListener('click', open);
      tr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });

    renderPagination();
    updateSortHeaders();
  }

  function renderPagination() {
    const el = $('#engineerPagination');
    if (!el) return;

    const total = pageCount();
    state.page = Math.min(Math.max(state.page, 1), total);

    const pages = [];
    for (let p = 1; p <= Math.min(total, 5); p += 1) pages.push(p);

    el.innerHTML = `
      <button type="button" class="pagination__btn" data-page-move="first" ${state.page === 1 ? 'disabled' : ''} aria-label="첫 페이지">&laquo;</button>
      <button type="button" class="pagination__btn" data-page-move="prev" ${state.page === 1 ? 'disabled' : ''} aria-label="이전 페이지">&lsaquo;</button>
      ${pages.map((p) => `<button type="button" class="pagination__btn${p === state.page ? ' is-active' : ''}" data-page="${p}">${p}</button>`).join('')}
      <button type="button" class="pagination__btn" data-page-move="next" ${state.page === total ? 'disabled' : ''} aria-label="다음 페이지">&rsaquo;</button>
      <button type="button" class="pagination__btn" data-page-move="last" ${state.page === total ? 'disabled' : ''} aria-label="마지막 페이지">&raquo;</button>
    `;

    el.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.page = Number(btn.getAttribute('data-page'));
        renderTable();
      });
    });
    el.querySelector('[data-page-move="first"]')?.addEventListener('click', () => { state.page = 1; renderTable(); });
    el.querySelector('[data-page-move="prev"]')?.addEventListener('click', () => { state.page -= 1; renderTable(); });
    el.querySelector('[data-page-move="next"]')?.addEventListener('click', () => { state.page += 1; renderTable(); });
    el.querySelector('[data-page-move="last"]')?.addEventListener('click', () => { state.page = total; renderTable(); });
  }

  function bindEvents() {
    $('#engineerSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      filterRows();
      renderTable();
    });

    $('#engineerResetBtn')?.addEventListener('click', () => {
      $('#engineerSearchForm')?.reset();
      filterRows();
      renderTable();
    });

    $('#engineerAddBtn')?.addEventListener('click', () => goDetail());

    document.querySelectorAll('[data-engineer-sort]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-engineer-sort');
        if (!key) return;
        if (state.sortKey === key) {
          state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortKey = key;
          state.sortDir = 'asc';
        }
        sortRows();
        state.page = 1;
        renderTable();
      });
    });
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'system-engineer' });
    state.filtered = [...state.rows];
    enhanceSortableHeaders();
    bindEvents();
    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
