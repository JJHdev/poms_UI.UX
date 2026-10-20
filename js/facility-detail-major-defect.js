/**
 * 시설물 상세 — 중대결함 사후관리 목록
 */
(function () {
  const state = {
    page: 1,
    pageSize: 5,
  };

  function getDefects() {
    return (window.MajorDefectData && window.MajorDefectData.list) || [];
  }

  function escapeHtml(str) {
    return String(str ?? '')
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
    return Math.max(1, Math.ceil(getDefects().length / size));
  }

  function getPageItems(page, size) {
    const start = (page - 1) * size;
    return getDefects().slice(start, start + size);
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
    return `facility-major-defect-detail.html?${params.toString()}`;
  }

  function renderTableBody() {
    const tbody = document.getElementById('majorDefectListBody');
    if (!tbody) return;

    const items = getPageItems(state.page, state.pageSize);
    if (!items.length) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="detail-year-search__empty">중대결함 사후관리 기록이 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = items
      .map(
        (item, index) => `<tr class="is-clickable" tabindex="0" data-id="${item.id}" aria-selected="false">
          <td class="col-no" rowspan="2">${getRowNo(index)}</td>
          <td>${escapeHtml(displayValue(item.inspectionCategory))}</td>
          <td>${escapeHtml(displayValue(item.inspectionDate))}</td>
          <td>${escapeHtml(displayValue(item.defectPart))}</td>
          <td>${escapeHtml(displayValue(item.defectCategory))}</td>
          <td>${escapeHtml(displayValue(item.defectType))}</td>
        </tr>
        <tr class="is-clickable is-subrow" data-id="${item.id}">
          <td>${escapeHtml(displayValue(item.startDeadline))}</td>
          <td>${escapeHtml(displayValue(item.actionStartDate))}</td>
          <td>${escapeHtml(displayValue(item.completionDeadline))}</td>
          <td>${escapeHtml(displayValue(item.actionCompleteDate))}</td>
          <td>${escapeHtml(displayValue(item.actionStatus))}</td>
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
    const container = document.getElementById('majorDefectPagination');
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
    const el = document.getElementById('majorDefectTotalCount');
    if (el) el.innerHTML = `전체 <em>${getDefects().length}</em>건`;
  }

  function renderList() {
    renderTableBody();
    renderPagination();
    renderTotalCount();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('panel-major-defect');
    if (!panel) return;

    renderList();

    document.getElementById('majorDefectAddBtn')?.addEventListener('click', () => {
      window.location.href = buildDetailUrl(null);
    });
  });
})();
