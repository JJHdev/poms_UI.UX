(function () {
  const TIMELINE_YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];

  const TIMELINE_ROWS = [
    {
      label: '점검구분',
      values: {
        2030: { text: '점검', accent: 'red' },
      },
    },
    {
      label: '상태등급',
      values: {
        2030: { text: '예정', accent: 'red' },
      },
    },
  ];

  const REGULAR_HISTORY = [
    { date: '2026-12-12 ~ 2026-12-12', cost: '0', grade: '양호', deadline: '2027-01-11' },
    { date: '2026-12-08 ~ 2026-12-12', cost: '0', grade: '보통', deadline: '2027-01-07' },
    { date: '2026-11-26 ~ 2026-12-12', cost: '0', grade: '보통', deadline: '2026-12-26' },
    { date: '2026-06-30 ~ 2026-12-12', cost: '0', grade: '보통', deadline: '2026-07-30' },
    { date: '2025-09-05 ~ 2026-12-12', cost: '0', grade: '보통', deadline: '2025-10-05' },
    { date: '2025-01-12 ~ 2026-12-12', cost: '0', grade: '보통', deadline: '2025-02-11' },
    { date: '2024-07-08 ~ 2026-12-12', cost: '0', grade: '양호', deadline: '2024-08-07' },
    { date: '2024-01-15 ~ 2026-12-12', cost: '0', grade: '보통', deadline: '2024-02-14' },
    { date: '2023-09-01 ~ 2026-12-12', cost: '0', grade: '양호', deadline: '2023-10-01' },
    { date: '2023-02-28 ~ 2026-12-12', cost: '0', grade: '보통', deadline: '2023-03-30' },
  ];

  const PRECISION_INSPECTION_HISTORY = [
    { date: '2026-12-09 ~ 2026-12-12', cost: '56,411', grade: 'B등급', deadline: '2027-01-08' },
    { date: '2026-12-23 ~ 2026-12-12', cost: '62,969', grade: '양호', deadline: '2027-01-22' },
  ];

  const PRECISION_DIAGNOSIS_HISTORY = [
    { date: '2026-12-14 ~ 2026-12-12', cost: '242,452', grade: '세부사업', deadline: '2027-01-13' },
  ];

  const PERFORMANCE_EVALUATION_HISTORY = [];

  function withLastAccent(items) {
    if (!items.length) return [];
    return items.map((item, index) => ({
      ...item,
      accent: index === items.length - 1,
    }));
  }

  function buildHistoryRows() {
    const regular = withLastAccent(REGULAR_HISTORY);
    const precisionInspection = withLastAccent(PRECISION_INSPECTION_HISTORY);
    const precisionDiagnosis = withLastAccent(PRECISION_DIAGNOSIS_HISTORY);
    const performanceEvaluation = withLastAccent(PERFORMANCE_EVALUATION_HISTORY);

    const rowCount = Math.max(
      regular.length,
      precisionInspection.length,
      precisionDiagnosis.length,
      performanceEvaluation.length
    );

    return Array.from({ length: rowCount }, (_, index) => ({
      regular: regular[index] || null,
      precisionInspection: precisionInspection[index] || null,
      precisionDiagnosis: precisionDiagnosis[index] || null,
      performanceEvaluation: performanceEvaluation[index] || null,
    }));
  }

  const HISTORY_LIST = buildHistoryRows();

  const state = {
    page: 1,
    pageSize: 10,
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getTotalPages(size) {
    return Math.max(1, Math.ceil(HISTORY_LIST.length / size));
  }

  function getPageItems(page, size) {
    const start = (page - 1) * size;
    return HISTORY_LIST.slice(start, start + size);
  }

  function getRowNo(index) {
    return (state.page - 1) * state.pageSize + index + 1;
  }

  function renderGroupCells(group) {
    if (!group) {
      return `
        <td class="col-date"></td>
        <td class="col-cost"></td>
        <td class="col-grade"></td>
      `;
    }

    const accentClass = group.accent ? ' history-cell--accent-red' : '';
    return `
      <td class="col-date${accentClass}">${escapeHtml(group.date)}</td>
      <td class="col-cost${accentClass}">${escapeHtml(group.cost)}</td>
      <td class="col-grade${accentClass}">${escapeHtml(group.grade)}</td>
    `;
  }

  function renderTimeline() {
    const theadRow = document.getElementById('historyTimelineHeadRow');
    const tbody = document.getElementById('historyTimelineBody');
    if (!theadRow || !tbody) return;

    theadRow.innerHTML = `
      <th scope="col">구분</th>
      ${TIMELINE_YEARS.map((year) => `<th scope="col">${year}</th>`).join('')}
    `;

    tbody.innerHTML = TIMELINE_ROWS.map((row) => {
      const cells = TIMELINE_YEARS.map((year) => {
        const entry = row.values[year];
        const text = entry ? entry.text : '-';
        const classes = [];
        if (text === '-') classes.push('is-empty');
        if (entry && entry.accent === 'red') classes.push('history-cell--accent-red');
        const classAttr = classes.length ? ` class="${classes.join(' ')}"` : '';
        return `<td${classAttr}>${escapeHtml(text)}</td>`;
      }).join('');

      return `<tr>
        <th scope="row">${escapeHtml(row.label)}</th>
        ${cells}
      </tr>`;
    }).join('');
  }

  function renderHistoryListBody() {
    const tbody = document.getElementById('historyListBody');
    if (!tbody) return;

    const items = getPageItems(state.page, state.pageSize);
    tbody.innerHTML = items
      .map(
        (item, index) => `<tr>
          <td class="col-no">${getRowNo(index)}</td>
          ${renderGroupCells(item.regular)}
          ${renderGroupCells(item.precisionInspection)}
          ${renderGroupCells(item.precisionDiagnosis)}
          ${renderGroupCells(item.performanceEvaluation)}
        </tr>`
      )
      .join('');
  }

  function renderHistoryListCount() {
    const el = document.getElementById('historyTotalCount');
    if (!el) return;
    el.innerHTML = `전체 <em>${HISTORY_LIST.length}</em>건`;
  }

  function renderHistoryListPagination() {
    const container = document.getElementById('historyListPagination');
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
          renderHistoryList();
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
          renderHistoryList();
        }
      });
    });
  }

  function renderHistoryList() {
    renderHistoryListCount();
    renderHistoryListBody();
    renderHistoryListPagination();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('panel-history')) return;

    renderTimeline();
    renderHistoryList();
  });
})();
