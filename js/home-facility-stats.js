/**
 * 홈 > 시설물정보: 표 렌더링 (페이지·모달 공용)
 */
(function () {
  const MANAGE_KEYS = ['national', 'local', 'port'];
  const FACILITY_ROWS = [
    { key: 'mooring', label: '계류시설' },
    { key: 'outer', label: '외곽시설' },
    { key: 'building', label: '건축물' },
    { key: 'bridge', label: '교량시설' },
    { key: 'other', label: '기타' },
  ];

  function sumManageValues(values) {
    return MANAGE_KEYS.reduce((total, key) => total + (values[key] ?? 0), 0);
  }

  function computeSubtotal(facilities) {
    const subtotal = { national: 0, local: 0, port: 0 };
    FACILITY_ROWS.forEach(({ key }) => {
      const values = facilities[key] ?? {};
      MANAGE_KEYS.forEach((manageKey) => {
        subtotal[manageKey] += values[manageKey] ?? 0;
      });
    });
    return subtotal;
  }

  function formatCount(value) {
    return value > 0 ? value.toLocaleString('ko-KR') : '\u00a0';
  }

  function renderCells(values) {
    const total = sumManageValues(values);
    const manageCells = MANAGE_KEYS.map((key) => `<td>${formatCount(values[key] ?? 0)}</td>`).join('');
    return `<td>${formatCount(total)}</td>${manageCells}`;
  }

  function renderTableBody(tbody, data) {
    if (!tbody || !data?.groups?.length) return;

    const grandTotal = { national: 0, local: 0, port: 0 };

    const rows = data.groups.map((group, groupIndex) => {
      const subtotal = computeSubtotal(group.facilities);
      MANAGE_KEYS.forEach((key) => {
        grandTotal[key] += subtotal[key];
      });

      const [firstRow, ...restRows] = FACILITY_ROWS;
      const firstValues = group.facilities[firstRow.key] ?? {};
      const isLastGroup = groupIndex === data.groups.length - 1;

      const facilityRows = restRows
        .map(({ key, label }) => {
          const values = group.facilities[key] ?? {};
          return `
            <tr>
              <td>${label}</td>
              ${renderCells(values)}
            </tr>
          `;
        })
        .join('');

      return `
        <tr class="facility-stats-table__group-start">
          <th rowspan="6" scope="rowgroup" class="facility-stats-table__group">${group.kind}</th>
          <td>${firstRow.label}</td>
          ${renderCells(firstValues)}
        </tr>
        ${facilityRows}
        <tr class="facility-stats-table__subtotal-row${isLastGroup ? '' : ' facility-stats-table__group-end'}">
          <td>소계</td>
          ${renderCells(subtotal)}
        </tr>
      `;
    });

    const grandTotalCount = sumManageValues(grandTotal);

    tbody.innerHTML =
      rows.join('') +
      `
      <tr class="facility-stats-table__total-row">
        <td colspan="2">총계</td>
        <td>${formatCount(grandTotalCount)}</td>
        ${MANAGE_KEYS.map((key) => `<td>${formatCount(grandTotal[key])}</td>`).join('')}
      </tr>
    `;
  }

  function initFacilityStatsTable() {
    const tbody = document.getElementById('facilityStatsTableBody');
    const baseline = document.getElementById('facilityStatsBaseline');

    if (typeof HOME_FACILITY_STATS === 'undefined') return;

    if (baseline) {
      const inHomeFacility = Boolean(baseline.closest('.home-facility-layout'));
      const raw = HOME_FACILITY_STATS.baselineDate || HOME_FACILITY_STATS.baseline || '';
      baseline.textContent = inHomeFacility
        ? String(raw).replace(/^(\d{4})\.(\d{2})$/, '$1-$2-27')
        : `${HOME_FACILITY_STATS.baseline} 기준`;
    }
    renderTableBody(tbody, HOME_FACILITY_STATS);
  }

  window.PomsHomeFacilityStats = { render: initFacilityStatsTable };

  document.addEventListener('DOMContentLoaded', initFacilityStatsTable);
})();
