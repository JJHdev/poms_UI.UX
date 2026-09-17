/**
 * 시설물 상세 — 취약시설물 중점관리 목록
 */
(function () {
  const state = {
    page: 1,
    pageSize: 10,
  };

  function getRecords() {
    return (window.VulnerableData && window.VulnerableData.list) || [];
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function displayValue(value) {
    if (value === null || value === undefined || value === '') return '-';
    return value;
  }

  function getTotalPages(size) {
    return Math.max(1, Math.ceil(getRecords().length / size));
  }

  function getPageItems(page, size) {
    const start = (page - 1) * size;
    return getRecords().slice(start, start + size);
  }

  function getRowNo(index) {
    return (state.page - 1) * state.pageSize + index + 1;
  }

  function getFacilityId() {
    return new URLSearchParams(window.location.search).get('id') || 'south';
  }

  function buildDetailUrl(id) {
    const params = new URLSearchParams();
    const facilityId = getFacilityId();
    if (facilityId) params.set('facilityId', facilityId);
    if (id === null) params.set('mode', 'add');
    else params.set('id', id);
    return `facility-vulnerable-detail.html?${params.toString()}`;
  }

  function renderTableBody() {
    const tbody = document.getElementById('vulnerableListBody');
    if (!tbody) return;

    const items = getPageItems(state.page, state.pageSize);
    if (!items.length) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="detail-year-search__empty">취약시설물 중점관리 기록이 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = items
      .map(
        (item, index) => `<tr class="is-clickable" tabindex="0" data-id="${item.id}" aria-selected="false">
          <td class="col-no">${getRowNo(index)}</td>
          <td>${escapeHtml(displayValue(item.createdDate))}</td>
          <td>${escapeHtml(displayValue(item.author))}</td>
          <td class="is-left" title="${escapeHtml(displayValue(item.actionPlanProgress))}">${escapeHtml(displayValue(item.actionPlanProgress))}</td>
          <td>${escapeHtml(displayValue(item.usageRestriction))}</td>
          <td>${escapeHtml(displayValue(item.residentNotice))}</td>
        </tr>`
      )
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
    });
  }

  function renderPagination() {
    const container = document.getElementById('vulnerablePagination');
    if (!container) return;

    const totalPages = getTotalPages(state.pageSize);
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i += 1) pages.push(i);

    container.innerHTML = `
      <button type="button" class="pagination__btn" data-page-move="first" aria-label="첫 페이지" ${state.page === 1 ? 'disabled' : ''}></button>
      <button type="button" class="pagination__btn" data-page-move="prev" aria-label="이전 페이지" ${state.page === 1 ? 'disabled' : ''}></button>
      ${pages
        .map(
          (n) =>
            `<button type="button" class="pagination__btn${n === state.page ? ' is-active' : ''}" data-page="${n}" aria-label="${n}페이지" aria-current="${n === state.page ? 'page' : 'false'}">${n}</button>`
        )
        .join('')}
      <button type="button" class="pagination__btn" data-page-move="next" aria-label="다음 페이지" ${state.page === totalPages ? 'disabled' : ''}></button>
      <button type="button" class="pagination__btn" data-page-move="last" aria-label="마지막 페이지" ${state.page === totalPages ? 'disabled' : ''}></button>
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
    const el = document.getElementById('vulnerableTotalCount');
    if (el) el.innerHTML = `전체 <em>${getRecords().length}</em>건`;
  }

  function renderList() {
    renderTableBody();
    renderPagination();
    renderTotalCount();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('panel-vulnerable');
    if (!panel) return;

    renderList();

    document.getElementById('vulnerableAddBtn')?.addEventListener('click', () => {
      window.location.href = buildDetailUrl(null);
    });
  });
})();
