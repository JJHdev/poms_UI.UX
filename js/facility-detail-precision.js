(function () {
  const state = {
    page: 1,
    pageSize: 5,
    year: String(new Date().getFullYear()),
  };

  function getInspections() {
    return (window.PrecisionInspectionData && window.PrecisionInspectionData.list) || [];
  }

  function getItemYear(item) {
    if (item.filterYear) return String(item.filterYear);
    const source = item.periodStart || item.periodEnd || item.createdDate || '';
    const match = String(source).match(/^(\d{4})/);
    return match ? match[1] : '';
  }

  function getYearOptions() {
    const currentYear = new Date().getFullYear();
    const dataYears = getInspections().map(getItemYear).map(Number).filter(Boolean);
    const oldest = dataYears.length ? Math.min(...dataYears) : currentYear - 20;
    const minYear = Math.min(oldest, currentYear - 10);
    const years = [];
    for (let y = currentYear; y >= minYear; y -= 1) years.push(String(y));
    return years;
  }

  function getFilteredInspections() {
    const all = getInspections();
    if (!state.year) return all;
    return all.filter((item) => getItemYear(item) === state.year);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatPeriod(item) {
    if (!item.periodStart && !item.periodEnd) return '-';
    return `${item.periodStart || '-'} ~ ${item.periodEnd || '-'}`;
  }

  function displayValue(value) {
    if (value === null || value === undefined || value === '') return '-';
    return value;
  }

  function truncateText(text, max = 48) {
    const value = String(text || '');
    if (value.length <= max) return escapeHtml(value);
    return `${escapeHtml(value.slice(0, max))}…`;
  }

  function getTotalPages(size) {
    return Math.max(1, Math.ceil(getFilteredInspections().length / size));
  }

  function getPageItems(page, size) {
    const start = (page - 1) * size;
    return getFilteredInspections().slice(start, start + size);
  }

  function getRowNo(index) {
    return (state.page - 1) * state.pageSize + index + 1;
  }

  function getFacilityId() {
    return new URLSearchParams(window.location.search).get('id') || 'south';
  }

  function buildDetailUrl(id) {
    const params = new URLSearchParams();
    params.set('facilityId', getFacilityId());
    if (id === null) params.set('mode', 'add');
    else params.set('id', id);
    return `facility-precision-detail.html?${params.toString()}`;
  }

  function populateYearFilter() {
    const select = document.getElementById('precisionYearFilter');
    if (!select) return;

    const years = getYearOptions();

    select.innerHTML = [
      '<option value="">전체</option>',
      ...years.map((year) => `<option value="${year}">${year}년</option>`),
    ].join('');

    if (state.year && years.includes(state.year)) select.value = state.year;
    else {
      state.year = '';
      select.value = '';
    }
  }

  /* ===== 목록 테이블 ===== */
  function renderTableBody() {
    const tbody = document.getElementById('precisionListBody');
    if (!tbody) return;

    const items = getPageItems(state.page, state.pageSize);
    if (!items.length) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="detail-year-search__empty">선택한 연도의 안전점검실적이 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = items
      .map((item, index) => {
        const gradeClass =
          item.grade.includes('A') || item.grade.includes('B') ? ' is-grade-good' : '';
        return `<tr class="is-clickable" tabindex="0" data-id="${item.id}" aria-selected="false">
          <td class="col-no" rowspan="2">${getRowNo(index)}</td>
          <td title="${escapeHtml(item.category)}">${escapeHtml(item.category)}</td>
          <td title="${escapeHtml(item.agency)}">${escapeHtml(item.agency)}</td>
          <td title="${escapeHtml(displayValue(item.cost))}">${escapeHtml(displayValue(item.cost))}</td>
          <td class="is-left" title="${escapeHtml(item.mainResult)}">${escapeHtml(item.mainResult)}</td>
          <td>${escapeHtml(item.createdDate)}</td>
        </tr>
        <tr class="is-clickable is-subrow" data-id="${item.id}">
          <td title="${escapeHtml(formatPeriod(item))}">${escapeHtml(formatPeriod(item))}</td>
          <td title="${escapeHtml(item.engineer)}">${escapeHtml(item.engineer)}</td>
          <td class="${gradeClass.trim()}" title="${escapeHtml(item.grade)}">${escapeHtml(item.grade)}</td>
          <td class="is-left" title="${escapeHtml(item.repairPlan)}">${escapeHtml(item.repairPlan)}</td>
          <td title="${escapeHtml(item.author)}">${escapeHtml(item.author)}</td>
        </tr>`;
      })
      .join('');

    tbody.querySelectorAll('tr.is-clickable').forEach((row) => {
      const goToDetail = () => {
        window.location.href = buildDetailUrl(Number(row.dataset.id));
      };
      row.addEventListener('click', goToDetail);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToDetail();
        }
      });

      row.addEventListener('mouseenter', () => {
        tbody.querySelectorAll(`tr[data-id="${row.dataset.id}"]`).forEach((tr) => {
          tr.classList.add('is-hovered');
        });
      });
      row.addEventListener('mouseleave', () => {
        tbody.querySelectorAll(`tr[data-id="${row.dataset.id}"]`).forEach((tr) => {
          tr.classList.remove('is-hovered');
        });
      });
    });
  }

  function renderPagination() {
    const container = document.getElementById('precisionPagination');
    if (!container) return;

    const totalPages = getTotalPages(state.pageSize);
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i += 1) pages.push(i);

    const arrowIcon = '<img src="assets/main/facility-search/arrow-right.svg" alt="" width="14" height="14">';
    const doubleIcon = '<img src="assets/main/facility-search/arrow-double-right.svg" alt="" width="14" height="14">';

    container.innerHTML = `
      <button type="button" class="pagination__btn" data-page-move="first" aria-label="첫 페이지" ${state.page === 1 ? 'disabled' : ''}>${doubleIcon}</button>
      <button type="button" class="pagination__btn" data-page-move="prev" aria-label="이전 페이지" ${state.page === 1 ? 'disabled' : ''}>${arrowIcon}</button>
      ${pages
        .map(
          (n) =>
            `<button type="button" class="pagination__btn${n === state.page ? ' is-active' : ''}" data-page="${n}" aria-label="${n}페이지" aria-current="${n === state.page ? 'page' : 'false'}">${n}</button>`
        )
        .join('')}
      <button type="button" class="pagination__btn" data-page-move="next" aria-label="다음 페이지" ${state.page === totalPages ? 'disabled' : ''}>${arrowIcon}</button>
      <button type="button" class="pagination__btn" data-page-move="last" aria-label="마지막 페이지" ${state.page === totalPages ? 'disabled' : ''}>${doubleIcon}</button>
    `;

    container.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = Number(btn.dataset.page);
        if (next !== state.page) {
          state.page = next;
          renderList();
        }
      });
    });
    container.querySelectorAll('[data-page-move]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.pageMove;
        let next = state.page;
        if (action === 'first') next = 1;
        else if (action === 'prev') next = Math.max(1, state.page - 1);
        else if (action === 'next') next = Math.min(totalPages, state.page + 1);
        else if (action === 'last') next = totalPages;
        if (next !== state.page) {
          state.page = next;
          renderList();
        }
      });
    });
  }

  function renderTotalCount() {
    const el = document.getElementById('precisionTotalCount');
    if (!el) return;
    const count = getFilteredInspections().length;
    el.innerHTML = `전체 <em>${count}</em>건`;
  }

  function renderList() {
    const totalPages = getTotalPages(state.pageSize);
    if (state.page > totalPages) state.page = totalPages;
    renderTableBody();
    renderPagination();
    renderTotalCount();
  }

  function applyYearFilter(year) {
    state.year = year || '';
    state.page = 1;
    renderList();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('panel-precision');
    if (!panel) return;

    populateYearFilter();
    renderList();

    document.getElementById('precisionAddBtn')?.addEventListener('click', () => {
      window.location.href = buildDetailUrl(null);
    });

    const select = document.getElementById('precisionYearFilter');
    select?.addEventListener('change', () => {
      applyYearFilter(select.value || '');
    });
  });
})();
