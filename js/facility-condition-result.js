(function () {
  const Data = window.PomsConditionData;
  if (!Data || typeof PomsUserTable === 'undefined') return;

  const {
    RESULT_COLUMNS,
    DEFAULT_SELECTED,
    OUTPUT_FIELDS,
    SAMPLE_DATA,
    STORAGE_KEY,
  } = Data;

  const state = {
    page: 1,
    pageSize: 10,
    sort: { key: '', dir: 'asc' },
    filtered: [...SAMPLE_DATA],
    displayRows: [...SAMPLE_DATA],
    selectedColumns: [...DEFAULT_SELECTED],
    columnFilters: {},
    selectedRowId: '',
    multiConditions: [],
    filters: {
      agency: '',
      port: '',
      subPort: '',
      facilityType: '',
      classType: '',
      yearFrom: '',
      yearTo: '',
      seismic: '',
      grade: '',
      name: '',
    },
  };

  function getFieldMeta(id) {
    return OUTPUT_FIELDS.find((field) => field.id === id);
  }

  function renderGradeBadge(grade) {
    const key = String(grade || '').toLowerCase();
    return `<span class="condition-grade-badge condition-grade-badge--${key}">${grade}</span>`;
  }

  function renderCell(fieldId, row) {
    if (fieldId === 'grade') return renderGradeBadge(row.grade);
    if (fieldId === 'facilityClass') return row.facilityClass ?? row.classType ?? '';
    if (fieldId === 'completionDate') return row.completionDate ?? row.year ?? '';
    return row[fieldId] ?? '';
  }

  function getResultColumns() {
    return state.selectedColumns.length
      ? state.selectedColumns.map((id) => getFieldMeta(id)).filter(Boolean)
      : RESULT_COLUMNS;
  }

  function applyColumnFilters(rows) {
    const cols = getResultColumns();
    return rows.filter((row) =>
      cols.every(({ id }) => {
        const keyword = (state.columnFilters[id] || '').trim().toLowerCase();
        if (!keyword) return true;
        return String(row[id] || '').toLowerCase().includes(keyword);
      })
    );
  }

  function applyResultCategoryFilter(rows) {
    const minor = document.getElementById('resultMinorCategory')?.value || '';
    if (!minor) return rows;

    const typeMap = {
      mooring: '계류시설',
      quay: '안벽시설',
      outer: '외곽시설',
      bridge: '교량시설',
    };
    const facilityType = typeMap[minor];
    if (!facilityType) return rows;
    return rows.filter((row) => row.facilityType === facilityType);
  }

  function buildFieldValueSet(singleValue, field) {
    const set = new Set();
    if (singleValue) set.add(singleValue);
    state.multiConditions.forEach((cond) => {
      if (cond.field === field) set.add(cond.value);
    });
    return set;
  }

  function filterData() {
    const f = state.filters;
    const yearFrom = f.yearFrom ? Number(f.yearFrom.slice(0, 4)) : null;
    const yearTo = f.yearTo ? Number(f.yearTo.slice(0, 4)) : null;
    const name = (f.name || '').trim().toLowerCase();

    const agencySet = buildFieldValueSet(f.agency, 'agency');
    const portSet = buildFieldValueSet(f.port, 'port');
    const subPortSet = buildFieldValueSet(f.subPort, 'subPort');
    const facilityTypeSet = buildFieldValueSet(f.facilityType, 'facilityType');
    const classTypeSet = buildFieldValueSet(f.classType, 'classType');
    const seismicSet = buildFieldValueSet(f.seismic, 'seismic');
    const gradeSet = buildFieldValueSet(f.grade, 'grade');

    state.filtered = SAMPLE_DATA.filter((row) => {
      if (agencySet.size && !agencySet.has(row.agency)) return false;
      if (portSet.size && !portSet.has(row.port)) return false;
      if (subPortSet.size && !subPortSet.has(row.subPort)) return false;
      if (facilityTypeSet.size && !facilityTypeSet.has(row.facilityType)) return false;
      if (classTypeSet.size && !classTypeSet.has(row.classType)) return false;
      if (seismicSet.size && !seismicSet.has(row.seismic)) return false;
      if (gradeSet.size && !gradeSet.has(row.grade)) return false;
      const year = Number(row.year);
      if (yearFrom != null && year < yearFrom) return false;
      if (yearTo != null && year > yearTo) return false;
      if (name && !row.name.toLowerCase().includes(name)) return false;
      return true;
    });

    state.page = 1;
    state.selectedRowId = '';
    state.displayRows = applyColumnFilters(applyResultCategoryFilter(state.filtered));
  }

  function getSortedDisplayRows() {
    const rows = applyColumnFilters(applyResultCategoryFilter(state.filtered));
    return PomsUserTable.sortRows(rows, state.sort.key, state.sort.dir, (row, key) => row[key]);
  }

  function renderTableHead() {
    const headRow = document.getElementById('conditionTableHead');
    const filterRow = document.getElementById('conditionTableFilterRow');
    if (!headRow || !filterRow) return;

    filterRow.classList.add('condition-table-filter-row');

    const cols = getResultColumns();
    headRow.innerHTML = `<th scope="col" class="col-no" rowspan="2">번호</th>${cols
      .map(({ id, label }) => `<th scope="col">${PomsUserTable.sortButton(label, id, state.sort)}</th>`)
      .join('')}`;

    PomsUserTable.bindSort(headRow, state, () => {
      state.page = 1;
      renderTableBody();
      renderTableHead();
      renderPagination();
    });

    const filters = cols
      .map(({ id, label }) => {
        const value = state.columnFilters[id] || '';
        return `<th scope="col" class="condition-table-filter">
          <div class="condition-table-filter__inner">
            <input type="text" class="condition-table-filter__input" data-filter-col="${id}" value="${value}" placeholder="${label}" aria-label="${label} 필터">
            <button type="button" class="condition-table-filter__clear" data-clear-col="${id}" aria-label="${label} 필터 지우기"${value ? '' : ' hidden'}>&times;</button>
          </div>
        </th>`;
      })
      .join('');

    filterRow.innerHTML = filters;

    filterRow.querySelectorAll('.condition-table-filter__input').forEach((input) => {
      input.addEventListener('input', () => {
        state.columnFilters[input.dataset.filterCol] = input.value;
        state.page = 1;
        state.displayRows = applyColumnFilters(applyResultCategoryFilter(state.filtered));
        renderTableBody();
        renderPagination();
        const clearBtn = filterRow.querySelector(`[data-clear-col="${input.dataset.filterCol}"]`);
        if (clearBtn) clearBtn.hidden = !input.value;
      });
    });

    filterRow.querySelectorAll('[data-clear-col]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const col = btn.dataset.clearCol;
        state.columnFilters[col] = '';
        const input = filterRow.querySelector(`[data-filter-col="${col}"]`);
        if (input) input.value = '';
        btn.hidden = true;
        state.page = 1;
        state.displayRows = applyColumnFilters(applyResultCategoryFilter(state.filtered));
        renderTableBody();
        renderPagination();
      });
    });
  }

  function renderTableBody() {
    const tbody = document.getElementById('conditionTableBody');
    const countEl = document.getElementById('conditionResultCount');
    if (!tbody) return;

    state.displayRows = getSortedDisplayRows();
    const total = state.displayRows.length;
    if (countEl) countEl.textContent = String(total);

    const start = (state.page - 1) * state.pageSize;
    const pageItems = state.displayRows.slice(start, start + state.pageSize);
    const cols = getResultColumns();

    if (!pageItems.length) {
      tbody.innerHTML = `<tr><td colspan="${cols.length + 1}">검색 결과가 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = pageItems
      .map((row, index) => {
        const no = start + index + 1;
        const cells = cols.map(({ id }) => `<td>${renderCell(id, row)}</td>`).join('');
        const selected = state.selectedRowId === row.facilityId ? ' is-selected' : '';
        return `<tr class="is-clickable${selected}" tabindex="0" data-detail-id="${row.id}" data-facility-id="${row.facilityId}" data-name="${row.name}" aria-selected="${selected ? 'true' : 'false'}">
          <td class="col-no">${no}</td>
          ${cells}
        </tr>`;
      })
      .join('');

    tbody.querySelectorAll('tr.is-clickable').forEach((tr) => {
      const goDetail = () => {
        window.location.href = `facility-detail.html?id=${tr.dataset.detailId}`;
      };
      tr.addEventListener('click', goDetail);
      tr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goDetail();
        }
      });
    });
  }

  function renderPagination() {
    PomsUserTable.mountFoot({
      paginationId: 'conditionPagination',
      pageSizeId: null,
      state,
      totalRows: state.displayRows.length,
      onChange: () => {
        renderTableBody();
        renderPagination();
      },
    });
  }

  function renderTable() {
    renderTableHead();
    renderTableBody();
    renderPagination();
  }

  function refreshResultRows() {
    state.displayRows = applyColumnFilters(applyResultCategoryFilter(state.filtered));
    state.page = 1;
    state.selectedRowId = '';
    renderTable();
  }

  function loadQuery() {
    let query = null;
    try {
      query = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    } catch (_) {
      query = null;
    }

    if (!query) {
      state.selectedColumns = [...DEFAULT_SELECTED];
      state.multiConditions = [];
      state.filters = {
        agency: '', port: '', subPort: '', facilityType: '', classType: '',
        yearFrom: '', yearTo: '', seismic: '', grade: '', name: '',
      };
      return;
    }

    state.selectedColumns = Array.isArray(query.selectedColumns) && query.selectedColumns.length
      ? query.selectedColumns
      : [...DEFAULT_SELECTED];
    state.multiConditions = Array.isArray(query.multiConditions) ? query.multiConditions : [];
    state.filters = { ...state.filters, ...(query.filters || {}) };
    state.columnFilters = {};
    state.selectedColumns.forEach((id) => {
      state.columnFilters[id] = '';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('conditionTableBody')) return;

    loadQuery();
    filterData();
    renderTable();

    document.getElementById('conditionResultsFilterForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      refreshResultRows();
    });

    document.getElementById('conditionResultsSearchBtn')?.addEventListener('click', () => {
      refreshResultRows();
    });

    document.getElementById('conditionDownloadBtn')?.addEventListener('click', () => {
      alert('엑셀 다운로드 (샘플)');
    });
  });
})();
