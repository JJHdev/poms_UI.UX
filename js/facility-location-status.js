/**
 * 시설물 위치 현황 관리 — 탭, 검색, 목록·페이지네이션
 */
(() => {
  const TAB_CONFIG = {
    port: {
      label: '항명',
      placeholder: '항명을 입력하세요.',
      filterKey: 'port',
      rows: [...FACILITY_LOCATION_PORT_ROWS],
      columns: [
        { key: 'port', label: '항' },
        { key: 'seaArea', label: '해역' },
        { key: 'manageCategory', label: '관리구분' },
      ],
    },
    subport: {
      label: '세부항명',
      placeholder: '세부항명을 입력하세요.',
      filterKey: 'subPort',
      rows: [...FACILITY_LOCATION_SUBPORT_ROWS],
      columns: [
        { key: 'port', label: '항' },
        { key: 'subPort', label: '세부항' },
        { key: 'seaArea', label: '해역' },
        { key: 'manageCategory', label: '관리구분' },
      ],
    },
    facility: {
      label: '시설물명',
      placeholder: '시설물명을 입력하세요.',
      filterKey: 'name',
      rows: [...FACILITY_LOCATION_FACILITY_ROWS],
      columns: [
        { key: 'agency', label: '관리기관', className: 'col-agency' },
        { key: 'port', label: '항', className: 'col-port' },
        { key: 'subPort', label: '세부항', className: 'col-subport' },
        { key: 'facilityType', label: '시설구분', className: 'col-type' },
        { key: 'name', label: '시설물명', className: 'col-name' },
      ],
    },
    security: {
      label: '보안지역',
      placeholder: '보안지역을 입력하세요.',
      filterKey: 'zoneName',
      rows: [...FACILITY_LOCATION_SECURITY_ROWS],
      columns: [
        { key: 'port', label: '항', className: 'col-port' },
        { key: 'subPort', label: '세부항', className: 'col-subport' },
        { key: 'zoneName', label: '보안지역', className: 'col-zone' },
        { key: 'manageCategory', label: '관리구분', className: 'col-manage' },
      ],
    },
  };

  const PAGE_SIZE = 15;

  const state = {
    tab: 'port',
    keyword: '',
    page: 1,
    pageSize: PAGE_SIZE,
    filtered: [...FACILITY_LOCATION_PORT_ROWS],
    selectedRow: null,
  };

  const mapState = {
    instance: null,
    marker: null,
    pendingCoord: null,
    subPortName: '',
    mainMap: null,
    mainMarkers: [],
    polylines: [],
    previewLine: null,
    pendingLatLngs: [],
    selectedMarker: null,
    isPickingCoordinate: false,
  };

  const PORT_COORDS = {
    부산항: [35.1042, 129.0378],
    인천항: [37.456, 126.592],
    광양항: [34.901, 127.681],
    여수항: [34.731, 127.729],
    울산항: [35.501, 129.387],
    목포항: [34.779, 126.386],
    포항항: [36.031, 129.365],
    군산항: [35.968, 126.638],
    제주항: [33.513, 126.521],
    구룡포항: [35.985, 129.398],
    거문도항: [34.031, 127.307],
  };

  const fallbackCoords = [
    [35.095, 129.036],
    [35.105, 129.071],
    [34.901, 127.681],
    [37.456, 126.592],
    [34.031, 127.307],
    [35.985, 129.398],
  ];

  function rowCoords(row, index) {
    if (typeof row.lat === 'number' && typeof row.lng === 'number') {
      return [row.lat, row.lng];
    }
    if (row.port && PORT_COORDS[row.port]) {
      const base = PORT_COORDS[row.port];
      const offset = (index % 5) * 0.004;
      return [base[0] + offset, base[1] + offset];
    }
    return fallbackCoords[index % fallbackCoords.length];
  }

  function mapKind(row) {
    const text = `${row.facilityType || ''} ${row.zoneName || ''} ${row.name || ''}`;
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

  function ensureMainMap() {
    if (typeof L === 'undefined') return null;
    const mapRoot = $('#locStatusMap');
    if (!mapRoot) return null;
    if (mapState.mainMap) {
      mapState.mainMap.invalidateSize();
      return mapState.mainMap;
    }
    mapState.mainMap = L.map(mapRoot, { zoomControl: false, scrollWheelZoom: true });
    L.tileLayer('https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapState.mainMap);
    mapState.mainMap.on('click', handleMainMapClick);
    mapState.mainMap.on('mousemove', handleMainMapMouseMove);
    mapState.mainMap.on('dblclick', handleMainMapDoubleClick);
    mapState.mainMap.setView([35.108, 129.041], 11);
    setTimeout(() => mapState.mainMap?.invalidateSize(), 0);
    return mapState.mainMap;
  }

  function parseLatLngText(text) {
    const parts = String(text || '').split(',').map((part) => Number(part.trim()));
    if (parts.length >= 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
      return [parts[0], parts[1]];
    }
    return null;
  }

  function parsePolylineItem(item) {
    if (Array.isArray(item?.path) && item.path.length) {
      return item.path
        .map((point) => (Array.isArray(point) && point.length >= 2 ? [Number(point[0]), Number(point[1])] : null))
        .filter((point) => point && Number.isFinite(point[0]) && Number.isFinite(point[1]));
    }
    return String(item?.coord || '').split('|').map(parseLatLngText).filter(Boolean);
  }

  function serializePolylinePath(path) {
    return path.map(([lat, lng]) => `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`).join(' | ');
  }

  function getRowPolylines(row) {
    if (!row) return [];
    return FacilityLocationCoords.getByParentId(row.id).map(parsePolylineItem).filter((path) => path.length);
  }

  function drawPathLayer(map, path, selected, picking, row) {
    if (path.length >= 2) {
      const line = L.polyline(path, { ...polylineStyle(selected), interactive: !picking }).addTo(map);
      if (!picking) {
        line.on('click', () => selectRow(row, { fromMap: true }));
      }
      line.bindTooltip(getRowDisplayName(row) || '', { direction: 'top', sticky: true });
      mapState.polylines.push(line);
      return path;
    }

    const dot = L.circleMarker(path[0], {
      radius: 5,
      color: selected ? '#1c6fff' : '#6c788b',
      weight: 2,
      fillColor: '#fff',
      fillOpacity: 1,
      interactive: !picking,
    }).addTo(map);
    if (!picking) {
      dot.on('click', () => selectRow(row, { fromMap: true }));
    }
    dot.bindTooltip(getRowDisplayName(row) || '', { direction: 'top' });
    mapState.polylines.push(dot);
    return path;
  }

  function polylineStyle(selected) {
    return {
      color: selected ? '#1c6fff' : '#6c788b',
      weight: selected ? 4 : 3,
      opacity: selected ? 0.95 : 0.75,
      lineJoin: 'round',
      lineCap: 'round',
    };
  }

  function clearMapLayers() {
    mapState.mainMarkers.forEach((marker) => marker.remove());
    mapState.mainMarkers = [];
    mapState.polylines.forEach((line) => line.remove());
    mapState.polylines = [];
  }

  function renderMainMap(options = {}) {
    const map = ensureMainMap();
    if (!map) return;

    clearMapLayers();

    const picking = mapState.isPickingCoordinate;
    const bounds = [];

    state.filtered.forEach((row, index) => {
      const selected = state.selectedRow?.id === row.id;
      const paths = getRowPolylines(row);
      const kind = mapKind(row);

      if (paths.length) {
        paths.forEach((path) => {
          const used = drawPathLayer(map, path, selected, picking, row);
          used.forEach((latlng) => bounds.push(latlng));
        });
      } else {
        const coords = rowCoords(row, index);
        const icon = markerIcon(kind, selected, index);
        const marker = L.marker(coords, {
          icon: icon || undefined,
          interactive: !picking,
        }).addTo(map);
        if (!picking) {
          marker.on('click', () => selectRow(row, { fromMap: true }));
        }
        marker.bindTooltip(getRowDisplayName(row) || '', { direction: 'top', offset: [0, -12] });
        mapState.mainMarkers.push(marker);
        bounds.push(coords);
      }

      if (picking && selected && mapState.pendingLatLngs.length) {
        drawPathLayer(map, mapState.pendingLatLngs, true, true, row);
        mapState.pendingLatLngs.forEach((latlng) => bounds.push(latlng));
      }
    });

    const shouldFit = options.fit !== false && !picking;
    if (shouldFit && bounds.length) {
      const latLngBounds = L.latLngBounds(bounds);
      if (latLngBounds.isValid()) map.fitBounds(latLngBounds.pad(0.18), { maxZoom: 12 });
    }
  }

  function updateCreateButton() {
    const btn = $('#locCoordCreateBtn');
    const label = $('#locCoordCreateLabel');
    if (label) label.textContent = mapState.isPickingCoordinate ? '생성완료' : '좌표생성';
    btn?.classList.toggle('is-picking', mapState.isPickingCoordinate);
  }

  function clearPreviewLine() {
    if (mapState.previewLine) {
      mapState.previewLine.remove();
      mapState.previewLine = null;
    }
  }

  function setCoordinatePicking(enabled) {
    mapState.isPickingCoordinate = enabled;
    document.querySelector('.loc-map-content')?.classList.toggle('is-coordinate-picking', enabled);
    updateCreateButton();
    if (mapState.mainMap) {
      if (enabled) mapState.mainMap.doubleClickZoom.disable();
      else mapState.mainMap.doubleClickZoom.enable();
    }
    if (!enabled) {
      mapState.pendingLatLngs = [];
      clearPreviewLine();
    }
    renderMainMap({ fit: false });
  }

  function finishPolylineDraft() {
    if (!state.selectedRow) {
      setCoordinatePicking(false);
      return;
    }
    if (mapState.pendingLatLngs.length < 2) {
      alert('선을 만들려면 지도를 두 곳 이상 클릭하세요.');
      return;
    }

    const path = mapState.pendingLatLngs.map(([lat, lng]) => [lat, lng]);
    FacilityLocationCoords.add(state.selectedRow.id, {
      subPort: getRowSubPort(state.selectedRow),
      path,
      coord: serializePolylinePath(path),
      remark: '',
    });
    mapState.pendingLatLngs = [];
    clearPreviewLine();
    setCoordinatePicking(false);
    renderCoordPanel();
    renderMainMap({ fit: false });
  }

  function handleMainMapClick(e) {
    if (!mapState.isPickingCoordinate || !state.selectedRow) return;
    L.DomEvent.stop(e);
    mapState.pendingLatLngs.push([e.latlng.lat, e.latlng.lng]);
    renderMainMap({ fit: false });
  }

  function handleMainMapMouseMove(e) {
    if (!mapState.isPickingCoordinate || !state.selectedRow || !mapState.mainMap) return;
    if (!mapState.pendingLatLngs.length) {
      clearPreviewLine();
      return;
    }

    const preview = [...mapState.pendingLatLngs, [e.latlng.lat, e.latlng.lng]];
    if (mapState.previewLine) {
      mapState.previewLine.setLatLngs(preview);
      return;
    }
    mapState.previewLine = L.polyline(preview, {
      color: '#1c6fff',
      weight: 4,
      opacity: 0.7,
      dashArray: '7 6',
      interactive: false,
    }).addTo(mapState.mainMap);
  }

  function handleMainMapDoubleClick(e) {
    if (!mapState.isPickingCoordinate) return;
    L.DomEvent.stop(e);
    finishPolylineDraft();
  }

  function toggleCoordinatePicking() {
    if (!state.selectedRow) {
      alert('목록에서 항목을 선택해 주세요.');
      return;
    }
    if (mapState.isPickingCoordinate) {
      finishPolylineDraft();
      return;
    }
    mapState.pendingLatLngs = [];
    setCoordinatePicking(true);
    moveMapToRow(state.selectedRow);
  }

  function moveMapToRow(row) {
    const map = ensureMainMap();
    if (!map || !row) return;
    const index = state.filtered.findIndex((item) => item.id === row.id);
    const coords = rowCoords(row, Math.max(index, 0));
    map.flyTo(coords, Math.max(map.getZoom(), 14), { duration: 0.45 });
  }

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function getTabConfig() {
    return TAB_CONFIG[state.tab];
  }

  function getAllRows() {
    return getTabConfig().rows;
  }

  function filterRows() {
    const config = getTabConfig();
    const keyword = state.keyword.trim().toLowerCase();

    state.filtered = config.rows.filter((row) => {
      if (!keyword) return true;
      const value = String(row[config.filterKey] ?? '').toLowerCase();
      return value.includes(keyword);
    });

    state.page = 1;
  }

  function updateSearchField() {
    const config = getTabConfig();
    const label = $('#locSearchLabel');
    const input = $('#locSearchKeyword');
    if (label) label.textContent = config.label;
    if (input) {
      input.placeholder = config.placeholder;
      input.value = state.keyword;
    }
  }

  function renderAll() {
    state.pageSize = PAGE_SIZE;
    updateSearchField();
    renderTableHead();
    updateCount();
    renderTable();
    renderPagination();
    renderMainMap();
  }

  function getTotalPages() {
    return Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  }

  function getPageRows() {
    const start = (state.page - 1) * state.pageSize;
    return state.filtered.slice(start, start + state.pageSize);
  }

  function renderTableHead() {
    const thead = $('#locTableHead');
    if (!thead) return;

    const columns = getTabConfig().columns;
    const wrap = document.querySelector('.loc-results-panel .loc-table-wrap');
    if (wrap) wrap.dataset.tab = state.tab;

    thead.innerHTML = `
      <tr>
        <th scope="col" class="col-no">번호</th>
        ${columns.map((col) => `<th scope="col"${col.className ? ` class="${col.className}"` : ''}>${col.label}</th>`).join('')}
      </tr>
    `;

    syncFacilityColWidths();
    syncSecurityColWidths();
  }

  function measureTextPx(text, font) {
    const canvas = measureTextPx._canvas || (measureTextPx._canvas = document.createElement('canvas'));
    const ctx = canvas.getContext('2d');
    if (!ctx) return String(text || '').length * 13;
    ctx.font = font;
    return Math.ceil(ctx.measureText(String(text || '')).width);
  }

  function getTableMeasureFont(wrap) {
    const sample = wrap.querySelector('.loc-table') || wrap;
    const styles = window.getComputedStyle(sample);
    return {
      font: `${styles.fontWeight || '400'} ${styles.fontSize || '14px'} ${styles.fontFamily || '"Pretendard", "Noto Sans KR", sans-serif'}`,
      headerFont: `500 ${styles.fontSize || '14px'} ${styles.fontFamily || '"Pretendard", "Noto Sans KR", sans-serif'}`,
    };
  }

  function fitColWidth(rows, headerLabel, getter, font, headerFont, pad = 12) {
    const contentMax = rows.reduce((max, row) => Math.max(max, measureTextPx(getter(row), font)), 0);
    const headerMax = measureTextPx(headerLabel, headerFont);
    return Math.max(contentMax, headerMax) + pad;
  }

  /** 시설물 탭: 항·세부항·관리기관·시설구분을 최장 텍스트 너비에 맞춤 */
  function syncFacilityColWidths() {
    const wrap = document.querySelector('.loc-results-panel .loc-table-wrap');
    if (!wrap) return;

    if (state.tab !== 'facility') {
      ['--col-agency', '--col-port', '--col-subport', '--col-type'].forEach((key) => {
        wrap.style.removeProperty(key);
      });
      return;
    }

    const { font, headerFont } = getTableMeasureFont(wrap);
    const rows = getAllRows();

    wrap.style.setProperty('--col-agency', `${fitColWidth(rows, '관리기관', (r) => r.agency, font, headerFont)}px`);
    wrap.style.setProperty('--col-port', `${fitColWidth(rows, '항', (r) => r.port, font, headerFont)}px`);
    wrap.style.setProperty('--col-subport', `${fitColWidth(rows, '세부항', (r) => r.subPort, font, headerFont)}px`);
    wrap.style.setProperty('--col-type', `${fitColWidth(rows, '시설구분', (r) => r.facilityType, font, headerFont)}px`);
  }

  /** 보안지역 탭: 번호·항·세부항·관리구분은 글자 폭에 맞추고 보안지역을 넓게 */
  function syncSecurityColWidths() {
    const wrap = document.querySelector('.loc-results-panel .loc-table-wrap');
    if (!wrap) return;

    if (state.tab !== 'security') {
      ['--sec-col-no', '--sec-col-port', '--sec-col-subport', '--sec-col-manage'].forEach((key) => {
        wrap.style.removeProperty(key);
      });
      return;
    }

    const { font, headerFont } = getTableMeasureFont(wrap);
    const rows = getAllRows();
    const maxNo = String(Math.max(rows.length, 10));

    wrap.style.setProperty('--sec-col-no', `${Math.max(measureTextPx(maxNo, font), measureTextPx('번호', headerFont)) + 12}px`);
    wrap.style.setProperty('--sec-col-port', `${fitColWidth(rows, '항', (r) => r.port, font, headerFont, 10)}px`);
    wrap.style.setProperty('--sec-col-subport', `${fitColWidth(rows, '세부항', (r) => r.subPort, font, headerFont, 10)}px`);
    wrap.style.setProperty('--sec-col-manage', `${fitColWidth(rows, '관리구분', (r) => r.manageCategory, font, headerFont, 10)}px`);
  }

  function getRowDisplayName(row) {
    if (!row) return '';
    if (state.tab === 'facility') return row.name;
    if (state.tab === 'security') return row.zoneName;
    if (state.tab === 'subport') return `${row.port} · ${row.subPort}`;
    return row.port;
  }

  function getRowSubPort(row) {
    if (!row) return '';
    return row.subPort || row.port || '';
  }

  function formatSubPortCoord(index) {
    return `폴리라인 #${index + 1}`;
  }

  function clearSelection() {
    state.selectedRow = null;
    setCoordinatePicking(false);
    renderCoordPanel();
  }

  function selectRow(row, options = {}) {
    state.selectedRow = row;
    renderTable();
    renderCoordPanel();
    renderMainMap();
    if (!options.fromMap) moveMapToRow(row);
    if (options.fromMap) {
      const tbody = $('#locTableBody');
      tbody?.querySelector(`tr[data-row-id="${row.id}"]`)?.scrollIntoView({ block: 'nearest' });
    }
  }

  function renderCoordPanel() {
    const panel = $('#locCoordPanel');
    const targetEl = $('#locCoordTarget');
    const tbody = $('#locCoordBody');
    if (!panel || !tbody) return;

    if (!state.selectedRow) {
      panel.hidden = true;
      tbody.innerHTML = '';
      return;
    }

    panel.hidden = false;
    if (targetEl) targetEl.textContent = `(${getRowDisplayName(state.selectedRow)})`;

    const coords = FacilityLocationCoords.getByParentId(state.selectedRow.id);
    if (!coords.length) {
      tbody.innerHTML = `
        <tr class="loc-coord-empty">
          <td colspan="2">등록된 좌표가 없습니다.</td>
        </tr>`;
      return;
    }

    tbody.innerHTML = coords.map((item, index) => `
      <tr>
        <td class="loc-coord-cell-coord">${formatSubPortCoord(index)}</td>
        <td class="loc-coord-cell-remark">
          <button type="button" class="btn-loc-coord-delete" data-coord-delete="${item.id}">삭제</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-coord-delete]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!confirm('폴리라인을 삭제하시겠습니까?')) return;
        FacilityLocationCoords.remove(state.selectedRow.id, btn.dataset.coordDelete);
        renderCoordPanel();
        renderMainMap({ fit: false });
      });
    });
  }

  function setTableRowCount(count) {
    const wrap = document.querySelector('.loc-results-panel .loc-table-wrap');
    if (wrap) wrap.style.setProperty('--loc-row-count', String(Math.max(count, 1)));
  }

  function renderTable() {
    const tbody = $('#locTableBody');
    if (!tbody) return;

    const columns = getTabConfig().columns;
    const rows = getPageRows();
    const startNo = (state.page - 1) * state.pageSize;
    const colSpan = columns.length + 1;

    setTableRowCount(rows.length);

    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="${colSpan}" style="padding:24px;text-align:center;color:#6b7280;">검색 결과가 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = rows.map((row, i) => {
      const selected = state.selectedRow?.id === row.id ? ' is-selected' : '';
      return `
      <tr class="is-clickable${selected}" data-row-id="${row.id}" tabindex="0" role="button" aria-label="${getRowDisplayName(row)} 선택">
        <td class="col-no">${startNo + i + 1}</td>
        ${columns.map((col) => {
          const cls = col.className ? ` class="${col.className}"` : '';
          return `<td${cls}>${row[col.key] ?? ''}</td>`;
        }).join('')}
      </tr>`;
    }).join('');

    tbody.querySelectorAll('tr[data-row-id]').forEach((tr) => {
      const activate = () => {
        const row = state.filtered.find((item) => item.id === tr.dataset.rowId)
          || getAllRows().find((item) => item.id === tr.dataset.rowId);
        if (row) selectRow(row);
      };
      tr.addEventListener('click', activate);
      tr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });
  }

  function renderPagination() {
    if (!globalThis.PomsPaging) return;
    PomsPaging.mount({
      paginationId: 'locPagination',
      totalRows: state.filtered.length,
      state,
      onChange: () => {
        renderTable();
        renderPagination();
      },
    });
  }

  function updateCount() {
    const countEl = $('#locResultCount');
    if (countEl) countEl.textContent = state.filtered.length.toLocaleString();
  }

  function destroyMap() {
    if (mapState.instance) {
      mapState.instance.remove();
      mapState.instance = null;
    }
    mapState.marker = null;
    mapState.pendingCoord = null;
  }

  function closeMapModal() {
    const modal = $('#locMapModal');
    if (modal) modal.hidden = true;
    destroyMap();
  }

  function openMapModal() {
    toggleCoordinatePicking();
    return;

    const modal = $('#locMapModal');
    const saveBtn = $('#locMapSaveBtn');

    mapState.subPortName = getRowSubPort(state.selectedRow);
    if (saveBtn) saveBtn.disabled = true;
    mapState.pendingCoord = null;

    if (modal) modal.hidden = false;

    window.requestAnimationFrame(() => {
      const mapRoot = $('#locMapCanvas');
      if (!mapRoot || typeof L === 'undefined') return;

      destroyMap();
      mapState.instance = L.map(mapRoot, {
        center: [35.1042, 129.0378],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer('https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(mapState.instance);

      mapState.instance.on('click', (e) => {
        const { lat, lng } = e.latlng;
        mapState.pendingCoord = { lat, lng };
        if (saveBtn) saveBtn.disabled = false;

        if (mapState.marker) mapState.marker.setLatLng(e.latlng);
        else {
          mapState.marker = L.marker(e.latlng).addTo(mapState.instance);
        }
      });

      mapState.instance.invalidateSize();
    });
  }

  function saveMapCoordinate() {
    if (!state.selectedRow || !mapState.pendingCoord) return;

    const subPort = mapState.subPortName || getRowSubPort(state.selectedRow);
    const { lat, lng } = mapState.pendingCoord;

    FacilityLocationCoords.add(state.selectedRow.id, {
      subPort,
      coord: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      remark: '',
    });

    closeMapModal();
    renderCoordPanel();
  }

  function switchTab(tab) {
    if (!TAB_CONFIG[tab] || state.tab === tab) return;
    state.tab = tab;
    state.keyword = '';
    state.filtered = [...getAllRows()];
    state.page = 1;
    clearSelection();

    document.querySelectorAll('.loc-status-tabs__btn').forEach((btn) => {
      const isActive = btn.dataset.tab === tab;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    renderAll();
  }

  function search() {
    state.keyword = $('#locSearchKeyword')?.value || '';
    clearSelection();
    filterRows();
    renderAll();
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'system-location' });

    document.querySelectorAll('.loc-status-tabs__btn').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    $('#locSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      search();
    });

    $('#locPageSize')?.addEventListener('change', () => {
      state.pageSize = PAGE_SIZE;
      state.page = 1;
      clearSelection();
      renderAll();
    });

    $('#locMapZoomIn')?.addEventListener('click', () => mapState.mainMap?.zoomIn());
    $('#locMapZoomOut')?.addEventListener('click', () => mapState.mainMap?.zoomOut());

    $('#locCoordCreateBtn')?.addEventListener('click', openMapModal);
    $('#locMapSaveBtn')?.addEventListener('click', saveMapCoordinate);
    document.querySelectorAll('[data-close-loc-map]').forEach((el) => {
      el.addEventListener('click', closeMapModal);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mapState.isPickingCoordinate) {
        setCoordinatePicking(false);
      }
    });

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        mapState.mainMap?.invalidateSize();
        mapState.instance?.invalidateSize();
      }, 120);
    });

    state.filtered = [...getAllRows()];
    state.pageSize = PAGE_SIZE;
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
