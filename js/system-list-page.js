/**
 * 검색·테이블 목록 페이지 공통 초기화
 */
const SystemListPage = (() => {
  function $(sel) {
    return document.querySelector(sel);
  }

  function init(config) {
    const state = {
      rows: [...config.rows],
      filtered: [...config.rows],
      selectedIndex: -1,
      tabValue: config.tab?.defaultValue || '',
    page: 1,
    pageSize: (config.pagination?.pageSizeByTab && config.tab?.defaultValue != null
      && config.pagination.pageSizeByTab[config.tab.defaultValue] != null)
      ? config.pagination.pageSizeByTab[config.tab.defaultValue]
      : (config.pagination?.pageSize || 10),
    sort: { key: '', dir: 'asc' },
    };
    const mapState = {
      map: null,
      markers: [],
      selectedMarker: null,
    };

    const fallbackCoords = [
      [35.095, 129.036],
      [35.105, 129.071],
      [34.901, 127.681],
      [37.456, 126.592],
      [34.031, 127.307],
      [35.985, 128.398],
      [35.076, 129.018],
      [35.118, 129.024],
    ];

    function rowCoords(row, index) {
      if (typeof row.lat === 'number' && typeof row.lng === 'number') {
        return [row.lat, row.lng];
      }
      return fallbackCoords[index % fallbackCoords.length];
    }

    function mapKind(row) {
      const text = `${row.facilityType || ''} ${row.classType || ''} ${row.name || ''}`;
      if (text.includes('계류') || text.includes('부두')) return 'mooring';
      if (text.includes('외곽') || text.includes('방파') || text.includes('호안')) return 'outer';
      return 'other';
    }

    function markerHtml(kind, selected, index) {
      return `<span class="system-map-marker system-map-marker--${kind}${selected ? ' system-map-marker--selected' : ''}">${index + 1}</span>`;
    }

    function markerIcon(kind, selected, index) {
      if (typeof L === 'undefined') return null;
      return L.divIcon({
        className: '',
        html: markerHtml(kind, selected, index),
        iconSize: selected ? [34, 34] : [28, 28],
        iconAnchor: selected ? [17, 17] : [14, 14],
      });
    }

    function ensureMap() {
      if (!config.map || typeof L === 'undefined') return null;
      const mapRoot = $(config.map.rootId);
      if (!mapRoot) return null;
      if (mapState.map) {
        mapState.map.invalidateSize();
        return mapState.map;
      }

      mapState.map = L.map(mapRoot, {
        zoomControl: true,
        scrollWheelZoom: true,
      });
      L.tileLayer('https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(mapState.map);
      mapState.map.setView(config.map.center || [35.108, 129.041], config.map.zoom || 11);
      setTimeout(() => mapState.map?.invalidateSize(), 0);
      return mapState.map;
    }

    function renderMap() {
      const map = ensureMap();
      if (!map) return;

      mapState.markers.forEach((marker) => marker.remove());
      mapState.markers = [];

      state.filtered.forEach((row, index) => {
        const coords = rowCoords(row, index);
        const kind = mapKind(row);
        const selected = index === state.selectedIndex;
        const icon = markerIcon(kind, selected, index);
        const marker = L.marker(coords, icon ? { icon } : undefined).addTo(map);
        marker.on('click', () => selectRow(index, { fromMap: true }));
        marker.bindTooltip(row.name || '', { direction: 'top', offset: [0, -12] });
        mapState.markers.push(marker);
      });

      if (state.filtered.length) {
        const bounds = L.latLngBounds(state.filtered.map((row, index) => rowCoords(row, index)));
        if (bounds.isValid()) map.fitBounds(bounds.pad(0.18), { maxZoom: config.map.maxZoom || 12 });
      }
    }

    function moveMapToRow(index) {
      const map = ensureMap();
      const row = state.filtered[index];
      if (!map || !row) return;
      const coords = rowCoords(row, index);
      map.flyTo(coords, Math.max(map.getZoom(), config.map?.selectZoom || 14), { duration: 0.45 });
    }

    function selectRow(index, options = {}) {
      if (index < 0 || index >= state.filtered.length) return;
      state.selectedIndex = index;
      state.page = Math.floor(index / pageSize()) + 1;
      renderTable();
      if (!options.skipMove) moveMapToRow(index);
      if (options.fromMap) {
        const tbody = $(config.tableBodyId);
        tbody?.querySelector(`tr[data-row-index="${index}"]`)?.scrollIntoView({ block: 'nearest' });
      }
      config.onRowSelect?.(state.filtered[index], index, state);
    }

    function filterRows() {
      const rows = state.rows.filter((row) => {
        if (config.tab?.key && state.tabValue && row[config.tab.key] !== state.tabValue) {
          return false;
        }
        for (const filter of config.filters) {
          if (filter.tabs && !filter.tabs.includes(state.tabValue)) continue;
          const el = $(filter.id);
          const value = (el?.value || '').trim();
          if (!value) continue;

          if (filter.type === 'text') {
            if (!String(row[filter.key] || '').includes(value)) return false;
          } else if (row[filter.key] !== value) {
            return false;
          }
        }
        return true;
      });
      return sortRows(rows);
    }

    function currentColumns() {
      return config.tabColumns?.[state.tabValue] || config.columns || [];
    }

    function sortValue(row, column) {
      if (!column) return '';
      if (column.sortValue) return column.sortValue(row);
      return row[column.sortKey || column.key] ?? '';
    }

    function sortRows(rows) {
      const columns = currentColumns();
      const column = columns.find((item) => (item.sortKey || item.key) === state.sort.key);
      if (!column) return rows;
      const dir = state.sort.dir === 'desc' ? -1 : 1;
      return [...rows].sort((a, b) => {
        const av = sortValue(a, column);
        const bv = sortValue(b, column);
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
        return String(av).localeCompare(String(bv), 'ko', { numeric: true }) * dir;
      });
    }

    function toggleSort(key) {
      if (!key) return;
      if (state.sort.key === key) {
        state.sort.dir = state.sort.dir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort = { key, dir: 'asc' };
      }
      state.filtered = sortRows(state.filtered);
      state.page = 1;
      state.selectedIndex = -1;
      renderTable();
    }

  function pageSize() {
    const select = config.pagination?.pageSizeId ? $(config.pagination.pageSizeId) : null;
    if (select?.value) return Number(select.value) || resolvePageSize();
    return state.pageSize || resolvePageSize();
  }

  function resolvePageSize() {
    const byTab = config.pagination?.pageSizeByTab;
    if (byTab && state.tabValue != null && byTab[state.tabValue] != null) {
      return Number(byTab[state.tabValue]) || config.pagination?.pageSize || 10;
    }
    return config.pagination?.pageSize || 10;
  }

    function pageCount() {
      return Math.max(1, Math.ceil(state.filtered.length / pageSize()));
    }

    function clampPage() {
      state.page = Math.min(Math.max(state.page, 1), pageCount());
    }

    function currentPageRows() {
      const size = pageSize();
      const start = (state.page - 1) * size;
      return state.filtered.slice(start, start + size).map((row, offset) => ({
        row,
        index: start + offset,
      }));
    }

    function renderTableHead(columns) {
      const tbody = $(config.tableBodyId);
      const table = tbody?.closest('table');
      const thead = table?.querySelector('thead');
      if (!thead || !columns.length) return;
      if (!columns.some((column) => column.header || column.group)) return;

      const hasGroup = columns.some((column) => column.group);
      table?.classList.toggle('has-group-header', hasGroup);

      const renderHeaderContent = (column) => {
        const label = column.header || '';
        const display = column.headerHtml || label;
        const key = column.sortKey || column.key;
        if (column.sortable === false || !key) return display;
        const active = state.sort.key === key;
        const dirClass = active ? ` is-${state.sort.dir}` : '';
        return `<button type="button" class="system-sort${active ? ' is-active' : ''}${dirClass}" data-sort-key="${key}" aria-label="${label} 정렬"><span>${display}</span><i aria-hidden="true"></i></button>`;
      };

      const thClass = (column, extra = '') => {
        const cls = [column.className, extra].filter(Boolean).join(' ').trim();
        return cls ? ` class="${cls}"` : '';
      };

      if (!hasGroup) {
        thead.innerHTML = `<tr>${columns.map((column) => `<th scope="col"${thClass(column)}>${renderHeaderContent(column)}</th>`).join('')}</tr>`;
        bindSortButtons(thead);
        return;
      }

      const firstRow = [];
      const secondRow = [];
      for (let i = 0; i < columns.length; i += 1) {
        const column = columns[i];
        if (!column.group) {
          firstRow.push(`<th scope="col" rowspan="2"${thClass(column)}>${renderHeaderContent(column)}</th>`);
          continue;
        }

        let span = 1;
        while (columns[i + span]?.group === column.group) span += 1;
        firstRow.push(`<th scope="col" colspan="${span}"${thClass(column, 'special-col-inspect-group')}>${column.group}</th>`);
        for (let j = 0; j < span; j += 1) {
          secondRow.push(`<th scope="col"${thClass(columns[i + j])}>${renderHeaderContent(columns[i + j])}</th>`);
        }
        i += span - 1;
      }

      thead.innerHTML = `<tr>${firstRow.join('')}</tr><tr>${secondRow.join('')}</tr>`;
      bindSortButtons(thead);
    }

    function bindSortButtons(thead) {
      thead.querySelectorAll('[data-sort-key]').forEach((button) => {
        button.addEventListener('click', () => toggleSort(button.getAttribute('data-sort-key')));
      });
    }

    function renderSummary() {
      const summaryEl = config.summaryId ? $(config.summaryId) : null;
      if (!summaryEl || !config.summary?.render) return;
      summaryEl.innerHTML = config.summary.render(state.filtered, state.tabValue);
    }

    function renderPagination() {
      const paginationEl = config.pagination?.rootId ? $(config.pagination.rootId) : null;
      if (!paginationEl) return;

      clampPage();
      if (typeof PomsUserTable !== 'undefined') {
        const pageSizeId = config.pagination?.pageSizeId
          ? config.pagination.pageSizeId.replace('#', '')
          : null;
        PomsUserTable.mountFoot({
          paginationId: paginationEl.id,
          pageSizeId,
          state,
          totalRows: state.filtered.length,
          onChange: renderTable,
        });
        return;
      }

      const totalPages = pageCount();
      const pages = [];
      for (let page = 1; page <= Math.min(totalPages, 5); page += 1) pages.push(page);
      paginationEl.innerHTML = `
        <button type="button" class="pagination__btn" data-page-move="first" ${state.page === 1 ? 'disabled' : ''} aria-label="첫 페이지">&laquo;</button>
        <button type="button" class="pagination__btn" data-page-move="prev" ${state.page === 1 ? 'disabled' : ''} aria-label="이전 페이지">&lsaquo;</button>
        ${pages.map((page) => `
          <button type="button" class="pagination__btn${page === state.page ? ' is-active' : ''}" data-page="${page}" aria-current="${page === state.page ? 'page' : 'false'}">${page}</button>
        `).join('')}
        <button type="button" class="pagination__btn" data-page-move="next" ${state.page === totalPages ? 'disabled' : ''} aria-label="다음 페이지">&rsaquo;</button>
        <button type="button" class="pagination__btn" data-page-move="last" ${state.page === totalPages ? 'disabled' : ''} aria-label="마지막 페이지">&raquo;</button>
      `;

      paginationEl.querySelectorAll('[data-page]').forEach((button) => {
        button.addEventListener('click', () => {
          state.page = Number(button.getAttribute('data-page'));
          renderTable();
        });
      });
      paginationEl.querySelector('[data-page-move="first"]')?.addEventListener('click', () => {
        state.page = 1;
        renderTable();
      });
      paginationEl.querySelector('[data-page-move="prev"]')?.addEventListener('click', () => {
        state.page -= 1;
        renderTable();
      });
      paginationEl.querySelector('[data-page-move="next"]')?.addEventListener('click', () => {
        state.page += 1;
        renderTable();
      });
      paginationEl.querySelector('[data-page-move="last"]')?.addEventListener('click', () => {
        state.page = totalPages;
        renderTable();
      });
    }

    function renderTable() {
      const tbody = $(config.tableBodyId);
      const countEl = $(config.countId);
      const columns = currentColumns();

      if (countEl) countEl.textContent = state.filtered.length.toLocaleString();
      if (!tbody) return;

      renderTableHead(columns);
      renderSummary();
      renderPagination();

      tbody.innerHTML = currentPageRows()
        .map(({ row, index }) => {
          const cells = columns
            .map((column) => {
              const className = column.className ? ` class="${column.className}"` : '';
              const content = column.render
                ? column.render(row, index, state.filtered)
                : (row[column.key] ?? '');
              return `<td${className}>${content}</td>`;
            })
            .join('');
          const selectedClass = index === state.selectedIndex ? ' class="is-selected"' : '';
          return `<tr${selectedClass} data-row-index="${index}" tabindex="0">${cells}</tr>`;
        })
        .join('');

      if (!state.filtered.length) {
        tbody.innerHTML = `<tr><td colspan="${columns.length}">조회된 데이터가 없습니다.</td></tr>`;
      }

      tbody.querySelectorAll('tr[data-row-index]').forEach((tr) => {
        tr.addEventListener('click', () => selectRow(Number(tr.getAttribute('data-row-index'))));
        tr.addEventListener('dblclick', () => {
          const index = Number(tr.getAttribute('data-row-index'));
          config.onRowDblClick?.(state.filtered[index], index, state);
        });
        tr.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          selectRow(Number(tr.getAttribute('data-row-index')));
        });
      });
      
      config.afterRender?.(tbody, state.filtered);
      config.onStateChange?.(state);
      renderMap();
    }

    function search() {
      state.filtered = filterRows();
      state.page = 1;
      state.selectedIndex = -1;
      renderTable();
    }

    function reset() {
      config.filters.forEach((filter) => {
        const el = $(filter.id);
        if (!el) return;
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      updateTabs();
      updateFilterPanel();
      state.filtered = [...state.rows];
      state.filtered = filterRows();
      state.page = 1;
      state.selectedIndex = -1;
      renderTable();
    }

    function updateTabs() {
      if (!config.tab?.selector) return;
      document.querySelectorAll(config.tab.selector).forEach((tab) => {
        const isActive = tab.getAttribute('data-system-tab') === state.tabValue;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    function updateFilterPanel() {
      if (!config.tab?.filterTabs?.length || !config.formId) return;
      const form = $(config.formId);
      const panel = form?.closest('.special-filter-panel, .safety-report-panel');
      const showFilters = config.tab.filterTabs.includes(state.tabValue);
      panel?.classList.toggle('is-filter-hidden', !showFilters);
      config.filters.forEach((filter) => {
        const el = $(filter.id);
        const field = el?.closest('.special-field, .safety-report-field');
        const active = !filter.tabs || filter.tabs.includes(state.tabValue);
        field?.toggleAttribute('hidden', !active || !showFilters);
      });
      form?.querySelector('.special-filter-actions, .safety-report-actions')?.toggleAttribute('hidden', !showFilters);
      requestAnimationFrame(() => {
        mapState.map?.invalidateSize();
      });
    }

    function bindTabs() {
      if (!config.tab?.selector) return;
      document.querySelectorAll(config.tab.selector).forEach((tab) => {
        tab.addEventListener('click', () => {
          state.tabValue = tab.getAttribute('data-system-tab') || '';
          state.pageSize = resolvePageSize();
          updateTabs();
          updateFilterPanel();
          search();
        });
      });
      updateTabs();
      updateFilterPanel();
    }

    PomsSidebar.mount('#sidebar-root', { active: config.sidebarActive });

    bindTabs();
    if (config.pagination?.pageSizeId && typeof PomsUserTable !== 'undefined') {
      PomsUserTable.bindPageSize($(config.pagination.pageSizeId), state, renderTable);
    }
    $(config.resetBtnId)?.addEventListener('click', reset);
    $(config.searchBtnId)?.addEventListener('click', search);
    $(config.formId)?.addEventListener('submit', (e) => {
      e.preventDefault();
      search();
    });

    state.filtered = filterRows();
    state.selectedIndex = -1;
    renderTable();

    const api = {
      state,
      refresh() {
        state.filtered = filterRows();
        state.page = 1;
        state.selectedIndex = -1;
        renderTable();
      },
      setRows(rows) {
        state.rows = [...rows];
        this.refresh();
      },
      invalidateMap() {
        mapState.map?.invalidateSize();
      },
    };
    config.onReady?.(api, state);
    return api;
  }

  return { init };
})();
