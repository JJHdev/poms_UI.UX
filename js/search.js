document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  const resetBtn = document.getElementById('resetBtn');
  const keywordInput = document.getElementById('facilityName');
  const resultCount = document.getElementById('resultCount');
  const tableBody = document.getElementById('resultTableBody');

  if (!form || !tableBody || typeof PomsUserTable === 'undefined') return;

  const PAGE_SIZE = 15;

  const TABLE_COLUMNS = [
    { key: 'name', label: '시설물명', className: 'col-name' },
    { key: 'agency', label: '관리주체', className: 'col-agency' },
    { key: 'address', label: '주소', className: 'col-address' },
    { key: 'type', label: '시설물 종류', className: 'col-type' },
    { key: 'classType', label: '종별', className: 'col-class' },
    { key: 'built', label: '준공연도', className: 'col-built' },
  ];

  const ALL_ROWS = [
    { id: 'south', name: '(구)연안여객터미널', agency: '부산항만공사', address: '부산광역시 중구 충장대로 206', type: '계류시설', classType: '1종', built: '2007-03-01' },
    { id: 'south', name: '국제여객터미널', agency: '부산항만공사', address: '부산광역시 동구 충장대로 206', type: '계류시설', classType: '1종', built: '2006-11-15' },
    { id: 'south', name: '부산항 제1부두', agency: '부산항만공사', address: '부산광역시 영도구 남항로 28', type: '안벽시설', classType: '1종', built: '2005-08-20' },
    { id: 'south', name: '인천항 크루즈터미널', agency: '인천항만공사', address: '인천광역시 중구 월미로 294', type: '계류시설', classType: '1종', built: '2019-04-10' },
    { id: 'gamman', name: '물양장(2)', agency: '여수광양항만공사', address: '전라남도 여수시 월남로 45', type: '계류시설', classType: '기타', built: '2007-03-01' },
    { id: 'sinseondae', name: '광양항 서부두', agency: '여수광양항만공사', address: '전라남도 광양시 항만로 120', type: '안벽시설', classType: '2종', built: '2010-06-30' },
    { id: 'sinseondae', name: '여수항 연안부두', agency: '여수광양항만공사', address: '전라남도 여수시 항만로 88', type: '계류시설', classType: '2종', built: '2008-12-05' },
    { id: 'north', name: '목포항 대불부두', agency: '여수광양항만공사', address: '전라남도 영암군 삼호읍 대불주거 1로', type: '안벽시설', classType: '기타', built: '2012-09-18' },
    { id: 'south', name: '평택당진항 부잔교', agency: '평택당진항만공사', address: '충청남도 당진시 석문면 통정로 97', type: '교량시설', classType: '1종', built: '2015-02-22' },
    { id: 'south', name: '울산항 일반부두', agency: '울산항만공사', address: '울산광역시 남구 장생포로 271', type: '안벽시설', classType: '1종', built: '2003-05-14' },
    { id: 'north', name: '부산항 북항 제2부두', agency: '부산항만공사', address: '부산광역시 동구 충장대로 120', type: '안벽시설', classType: '1종', built: '1998-07-22' },
    { id: 'south', name: '부산항 신항 1부두', agency: '부산항만공사', address: '경상남도 창원시 진해구 신항동로 45', type: '안벽시설', classType: '1종', built: '2011-03-18' },
    { id: 'south', name: '부산항 신항 2부두', agency: '부산항만공사', address: '경상남도 창원시 진해구 신항동로 78', type: '안벽시설', classType: '1종', built: '2012-11-09' },
    { id: 'gamman', name: '감만부두 컨테이너야드', agency: '부산항만공사', address: '부산광역시 남구 우암로 150', type: '야적시설', classType: '2종', built: '2001-09-30' },
    { id: 'sinseondae', name: '신선대부두', agency: '부산항만공사', address: '부산광역시 남구 신선로 365', type: '안벽시설', classType: '1종', built: '1995-12-01' },
    { id: 'south', name: '인천항 내항 1부두', agency: '인천항만공사', address: '인천광역시 중구 항동7가 1-17', type: '안벽시설', classType: '1종', built: '1987-04-15' },
    { id: 'south', name: '인천항 남항 물양장', agency: '인천항만공사', address: '인천광역시 중구 서해대로94번길 100', type: '계류시설', classType: '기타', built: '2004-08-21' },
    { id: 'south', name: '광양항 컨테이너부두', agency: '여수광양항만공사', address: '전라남도 광양시 도이키로 120', type: '안벽시설', classType: '1종', built: '1998-06-12' },
    { id: 'sinseondae', name: '광양항 중마부두', agency: '여수광양항만공사', address: '전라남도 광양시 중마동 항만로 55', type: '안벽시설', classType: '2종', built: '2009-01-28' },
    { id: 'north', name: '여수항 국동항 방파제', agency: '여수광양항만공사', address: '전라남도 여수시 국동 방파제로 12', type: '외곽시설', classType: '기타', built: '1992-10-05' },
    { id: 'south', name: '목포항 내항 여객부두', agency: '목포지방해양수산청', address: '전라남도 목포시 해안로 182', type: '계류시설', classType: '1종', built: '2000-03-17' },
    { id: 'north', name: '목포항 삼학도 방파제', agency: '목포지방해양수산청', address: '전라남도 목포시 삼학로 90', type: '외곽시설', classType: '2종', built: '1985-11-20' },
    { id: 'south', name: '평택당진항 서부두', agency: '평택당진항만공사', address: '경기도 평택시 포승읍 평택항만길 87', type: '안벽시설', classType: '1종', built: '2008-05-09' },
    { id: 'south', name: '평택당진항 동부두', agency: '평택당진항만공사', address: '충청남도 당진시 송악읍 고대공단1길 50', type: '안벽시설', classType: '1종', built: '2013-07-26' },
    { id: 'south', name: '울산항 온산부두', agency: '울산항만공사', address: '울산광역시 울주군 온산읍 산암로 90', type: '안벽시설', classType: '1종', built: '1999-02-11' },
    { id: 'gamman', name: '울산항 염포부두', agency: '울산항만공사', address: '울산광역시 북구 염포동 산 85', type: '안벽시설', classType: '2종', built: '2006-08-03' },
    { id: 'south', name: '군산항 내항 1부두', agency: '군산지방해양수산청', address: '전북특별자치도 군산시 해망로 180', type: '안벽시설', classType: '1종', built: '1991-06-19' },
    { id: 'north', name: '군산항 외항 컨테이너부두', agency: '군산지방해양수산청', address: '전북특별자치도 군산시 비응도동 129', type: '안벽시설', classType: '1종', built: '2004-12-28' },
    { id: 'south', name: '포항항 영일만신항', agency: '포항지방해양수산청', address: '경상북도 포항시 북구 흥해읍 영일만항로 100', type: '안벽시설', classType: '1종', built: '2012-04-16' },
    { id: 'sinseondae', name: '포항항 구항 물양장', agency: '포항지방해양수산청', address: '경상북도 포항시 북구 해안로 53', type: '계류시설', classType: '기타', built: '1978-09-08' },
    { id: 'south', name: '마산항 중앙부두', agency: '마산지방해양수산청', address: '경상남도 창원시 마산합포구 해안대로 200', type: '안벽시설', classType: '2종', built: '1989-01-25' },
    { id: 'north', name: '마산항 가포신항', agency: '마산지방해양수산청', address: '경상남도 창원시 마산합포구 가포신항로 1', type: '안벽시설', classType: '1종', built: '2010-10-14' },
    { id: 'south', name: '제주항 여객터미널', agency: '제주지방해양수산청', address: '제주특별자치도 제주시 임항로 111', type: '계류시설', classType: '1종', built: '2005-06-30' },
    { id: 'gamman', name: '서귀포항 방파제', agency: '제주지방해양수산청', address: '제주특별자치도 서귀포시 서귀동 728', type: '외곽시설', classType: '2종', built: '1996-03-12' },
    { id: 'south', name: '동해항 묵호부두', agency: '동해지방해양수산청', address: '강원특별자치도 동해시 묵호진동 2-1', type: '안벽시설', classType: '1종', built: '1983-08-07' },
  ];

  const state = PomsUserTable.createState({ pageSize: PAGE_SIZE });
  let filteredRows = [...ALL_ROWS];

  function escapeAttr(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;');
  }

  function setupTableHead() {
    const table = tableBody.closest('table');
    const thead = table?.querySelector('thead');
    if (!thead) return;

    let colgroup = table.querySelector('colgroup');
    if (!colgroup) {
      colgroup = document.createElement('colgroup');
      table.insertBefore(colgroup, thead);
    }
    colgroup.innerHTML = `
      <col class="col-no">
      ${TABLE_COLUMNS.map((column) => `<col class="${column.className || ''}">`).join('')}
    `;

    thead.innerHTML = `<tr>
      <th scope="col" class="col-no">번호</th>
      ${TABLE_COLUMNS.map((column) => `<th scope="col" class="${column.className || ''}">${column.label}</th>`).join('')}
    </tr>`;
  }

  function renderRows(list) {
    filteredRows = list;
    state.pageSize = PAGE_SIZE;
    const sorted = PomsUserTable.sortRows(list, state.sort.key, state.sort.dir, (row, key) => row[key]);
    const pageRows = PomsUserTable.slicePage(sorted, state.page, state.pageSize);
    const start = (state.page - 1) * state.pageSize;

    if (resultCount) resultCount.textContent = String(sorted.length);

    if (!sorted.length) {
      tableBody.innerHTML = '<tr><td colspan="7">조회된 시설물이 없습니다.</td></tr>';
    } else {
      tableBody.innerHTML = pageRows.map((row, index) => `
        <tr data-name="${escapeAttr(row.name)}" data-detail-id="${escapeAttr(row.id)}" class="is-clickable" tabindex="0">
          <td class="col-no">${start + index + 1}</td>
          <td>${escapeAttr(row.name)}</td>
          <td>${escapeAttr(row.agency)}</td>
          <td>${escapeAttr(row.address)}</td>
          <td>${escapeAttr(row.type)}</td>
          <td>${escapeAttr(row.classType)}</td>
          <td>${escapeAttr(row.built)}</td>
        </tr>
      `).join('');
    }

    tableBody.querySelectorAll('tr[data-detail-id]').forEach((row) => {
      const goDetail = () => {
        window.location.href = `facility-detail.html?id=${row.dataset.detailId}`;
      };
      row.addEventListener('click', goDetail);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goDetail();
        }
      });
    });

    PomsUserTable.mountFoot({
      paginationId: 'facilitySearchPagination',
      pageSizeId: null,
      state,
      totalRows: sorted.length,
      onChange: () => renderRows(filteredRows),
    });
  }

  function filterRows() {
    const keyword = keywordInput?.value.trim().toLowerCase() || '';
    const next = keyword
      ? ALL_ROWS.filter((row) => row.name.toLowerCase().includes(keyword))
      : [...ALL_ROWS];
    state.page = 1;
    renderRows(next);
  }

  const pageSizeSelect = document.getElementById('facilitySearchPageSize');
  if (pageSizeSelect) {
    pageSizeSelect.hidden = true;
    pageSizeSelect.setAttribute('aria-hidden', 'true');
    pageSizeSelect.value = String(PAGE_SIZE);
  }

  setupTableHead();
  renderRows(ALL_ROWS);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    filterRows();
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    state.page = 1;
    renderRows(ALL_ROWS);
  });
});
