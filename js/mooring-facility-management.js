/**
 * 계류시설 관리 — 기타시설물 목록 + 접안능력구간 선택 + 구간 필터
 */
(() => {
  const BERTHING_RANGES = [
    '1,000톤 미만',
    '1,000~3,000톤',
    '3,000~5,000톤',
    '5,000~10,000톤',
    '10,000톤 이상',
  ];

  const MOORING_ROWS = [
    { id: 'm1', name: '감천항 소형선 부잔교', agency: '부산지방해양수산청', port: '부산항', subPort: '감천항', address: '부산광역시 사하구 감천항로 231', classType: '기타', builtYear: '2004-05-20', berthingRange: '1,000톤 미만' },
    { id: 'm2', name: '남항 어선 물양장', agency: '부산지방해양수산청', port: '부산항', subPort: '남항', address: '부산광역시 영도구 남항로 12', classType: '기타', builtYear: '2001-11-08', berthingRange: '1,000~3,000톤' },
    { id: 'm3', name: '북항 관공선 계류장', agency: '부산항만공사', port: '부산항', subPort: '북항', address: '부산광역시 동구 충장대로 206', classType: '기타', builtYear: '2010-03-15', berthingRange: '' },
    { id: 'm4', name: '여천항 소형 물양장', agency: '여수지방해양수산청', port: '여수항', subPort: '여천항', address: '전라남도 여수시 여천항길 55', classType: '기타', builtYear: '2003-07-01', berthingRange: '3,000~5,000톤' },
    { id: 'm5', name: '거문도항 선착장', agency: '여수지방해양수산청', port: '거문도항', subPort: '거문도항', address: '전라남도 여수시 삼산면 거문리 120', classType: '기타', builtYear: '1999-04-22', berthingRange: '' },
    { id: 'm6', name: '광양항 예선 계류장', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', address: '전라남도 광양시 항만대로 465', classType: '기타', builtYear: '2012-10-30', berthingRange: '5,000~10,000톤' },
    { id: 'm7', name: '연안부두 소형선 접안시설', agency: '인천지방해양수산청', port: '인천항', subPort: '연안부두', address: '인천광역시 중구 연안부두로 70', classType: '기타', builtYear: '2008-02-18', berthingRange: '' },
    { id: 'm8', name: '신항 작업선 선류장', agency: '인천항만공사', port: '인천항', subPort: '신항', address: '인천광역시 연수구 송도국제대로 396', classType: '기타', builtYear: '2018-09-05', berthingRange: '' },
    { id: 'm9', name: '구룡포항 어선 물양장', agency: '경상북도', port: '구룡포항', subPort: '구룡포항', address: '경상북도 포항시 남구 구룡포읍 호미로 221', classType: '기타', builtYear: '1997-06-11', berthingRange: '1,000톤 미만' },
    { id: 'm10', name: '구룡포항 방파제 선착부', agency: '경상북도', port: '구룡포항', subPort: '구룡포항', address: '경상북도 포항시 남구 구룡포읍 병포리 55', classType: '기타', builtYear: '2002-12-03', berthingRange: '' },
    { id: 'm11', name: '남항 유람선 승강장', agency: '부산항만공사', port: '부산항', subPort: '남항', address: '부산광역시 서구 남부민동 690-3', classType: '기타', builtYear: '2015-05-27', berthingRange: '' },
    { id: 'm12', name: '여수항 도선 계류시설', agency: '여수광양항만공사', port: '여수항', subPort: '연안부두', address: '전라남도 여수시 어항단지로 41', classType: '기타', builtYear: '2006-08-14', berthingRange: '10,000톤 이상' },
  ];

  const state = {
    rows: [...MOORING_ROWS],
    filtered: [...MOORING_ROWS],
    page: 1,
    pageSize: 10,
  };

  const pending = {};

  function $(sel) {
    return document.querySelector(sel);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function populateFilterSelects() {
    const fill = (id, values) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = `<option value="">전체</option>${[...new Set(values)]
        .map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`)
        .join('')}`;
    };
    fill('mooringAgency', state.rows.map((r) => r.agency));
    fill('mooringPort', state.rows.map((r) => r.port));
    fill('mooringSubPort', state.rows.map((r) => r.subPort));
  }

  function filterRows() {
    const agency = $('#mooringAgency')?.value || '';
    const port = $('#mooringPort')?.value || '';
    const subPort = $('#mooringSubPort')?.value || '';
    const classType = $('#mooringClass')?.value || '';
    const capacity = $('#mooringCapacity')?.value || '';
    const name = ($('#mooringName')?.value || '').trim();

    state.filtered = state.rows.filter((row) => {
      if (agency && row.agency !== agency) return false;
      if (port && row.port !== port) return false;
      if (subPort && row.subPort !== subPort) return false;
      if (classType && row.classType !== classType) return false;
      if (capacity === 'NONE' && row.berthingRange) return false;
      if (capacity && capacity !== 'NONE' && row.berthingRange !== capacity) return false;
      if (name && !row.name.includes(name)) return false;
      return true;
    });
    state.page = 1;
  }

  function berthingValue(row) {
    return Object.prototype.hasOwnProperty.call(pending, row.id) ? pending[row.id] : row.berthingRange;
  }

  function rangeSelectHtml(row) {
    const current = berthingValue(row);
    const options = [
      `<option value=""${current ? '' : ' selected'}>선택</option>`,
      ...BERTHING_RANGES.map((range) => (
        `<option value="${escapeHtml(range)}"${current === range ? ' selected' : ''}>${escapeHtml(range)}</option>`
      )),
    ];
    return `
      <select class="mooring-capacity-select" name="mooring-cap-${escapeHtml(row.id)}" aria-label="${escapeHtml(row.name)} 접안능력구간">
        ${options.join('')}
      </select>
    `;
  }

  function renderTable() {
    const tbody = $('#mooringTableBody');
    const countEl = $('#mooringResultCount');
    if (!tbody) return;

    if (countEl) countEl.textContent = state.filtered.length.toLocaleString();

    state.pageSize = state.pageSize || 10;
    if (globalThis.PomsPaging) {
      state.page = PomsPaging.clampPage(state.page, state.filtered.length, state.pageSize);
      PomsPaging.mount({
        paginationId: 'mooringPagination',
        pageSizeId: 'mooringPageSize',
        totalRows: state.filtered.length,
        state,
        onChange: renderTable,
      });
    }

    const start = (state.page - 1) * state.pageSize;
    const pageRows = state.filtered.slice(start, start + state.pageSize);

    if (!pageRows.length) {
      tbody.innerHTML = '<tr><td colspan="10">조회된 시설물이 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = pageRows.map((row, i) => `
      <tr data-id="${escapeHtml(row.id)}">
        <td>${start + i + 1}</td>
        <td title="${escapeHtml(row.name)}">${escapeHtml(row.name)}</td>
        <td>${escapeHtml(row.agency)}</td>
        <td>${escapeHtml(row.port)}</td>
        <td>${escapeHtml(row.subPort)}</td>
        <td title="${escapeHtml(row.address)}">${escapeHtml(row.address)}</td>
        <td>기타</td>
        <td>${escapeHtml(row.classType)}</td>
        <td>${escapeHtml(row.builtYear)}</td>
        <td class="col-mooring">${rangeSelectHtml(row)}</td>
      </tr>
    `).join('');
  }

  function onTableChange(event) {
    const select = event.target.closest('select[name^="mooring-cap-"]');
    if (!select) return;
    const tr = select.closest('tr');
    const row = state.rows.find((item) => item.id === tr?.dataset.id);
    if (!row) return;
    pending[row.id] = select.value;
  }

  function save() {
    const ids = Object.keys(pending);
    if (!ids.length) {
      alert('변경된 내용이 없습니다.');
      return;
    }

    ids.forEach((id) => {
      const row = state.rows.find((item) => item.id === id);
      if (row) row.berthingRange = pending[id];
      delete pending[id];
    });

    alert('접안능력구간 정보가 저장되었습니다.');
    if ($('#mooringCapacity')?.value) filterRows();
    renderTable();
  }

  function reset() {
    ['mooringAgency', 'mooringPort', 'mooringSubPort', 'mooringClass', 'mooringCapacity'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    const nameEl = $('#mooringName');
    if (nameEl) nameEl.value = '';
    filterRows();
    renderTable();
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'system-mooring' });

    populateFilterSelects();

    $('#mooringSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      filterRows();
      renderTable();
    });
    $('#mooringResetBtn')?.addEventListener('click', reset);
    $('#mooringTableBody')?.addEventListener('change', onTableChange);
    $('#mooringSaveBtn')?.addEventListener('click', save);

    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
