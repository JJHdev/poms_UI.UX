/**
 * 홈 > 안전등급 현황: 표 렌더링 (페이지·in-page view 공용)
 */
(function () {
  const FACILITY_KEYS = ['outer', 'mooring', 'building', 'traffic', 'other'];
  const GRADE_ROWS = [
    { key: 'subtotal', label: '소계', isSubtotal: true },
    { key: 'A', label: 'A' },
    { key: 'B', label: 'B' },
    { key: 'C', label: 'C' },
    { key: 'D', label: 'D' },
    { key: 'E', label: 'E' },
    { key: 'none', label: '미실시' },
  ];

  function sumFacilityValues(values) {
    return FACILITY_KEYS.reduce((total, key) => total + (values[key] ?? 0), 0);
  }

  function computeSubtotal(grades) {
    const subtotal = {};
    FACILITY_KEYS.forEach((key) => {
      subtotal[key] = ['A', 'B', 'C', 'D', 'E', 'none'].reduce(
        (sum, gradeKey) => sum + (grades[gradeKey]?.[key] ?? 0),
        0
      );
    });
    return subtotal;
  }

  function formatCount(value) {
    return value > 0 ? value.toLocaleString('ko-KR') : '\u00a0';
  }

  function renderCells(values) {
    const cells = FACILITY_KEYS.map((key) => `<td>${formatCount(values[key] ?? 0)}</td>`).join('');
    return `${cells}<td>${formatCount(sumFacilityValues(values))}</td>`;
  }

  function renderTableBody(tbody, data) {
    if (!tbody || !data?.groups?.length) return;

    const grandTotal = {};
    FACILITY_KEYS.forEach((key) => {
      grandTotal[key] = 0;
    });

    const rows = data.groups.map((group, groupIndex) => {
      const subtotal = computeSubtotal(group.grades);
      FACILITY_KEYS.forEach((key) => {
        grandTotal[key] += subtotal[key] ?? 0;
      });
      const isLastGroup = groupIndex === data.groups.length - 1;

      return GRADE_ROWS.map((rowDef, index) => {
        const values =
          rowDef.key === 'subtotal' ? subtotal : group.grades[rowDef.key] ?? {};
        const kindCell =
          index === 0
            ? `<th rowspan="${GRADE_ROWS.length}" scope="rowgroup" class="facility-stats-table__group">${group.kind}</th>`
            : '';
        const isGroupEnd = index === GRADE_ROWS.length - 1 && !isLastGroup;
        const rowClass = [
          rowDef.isSubtotal ? 'facility-stats-table__subtotal-row' : '',
          index === 0 ? 'facility-stats-table__group-start' : '',
          isGroupEnd ? 'facility-stats-table__group-end' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return `
          <tr${rowClass ? ` class="${rowClass}"` : ''}>
            ${kindCell}
            <td>${rowDef.label}</td>
            ${renderCells(values)}
          </tr>
        `;
      }).join('');
    });

    tbody.innerHTML =
      `
      <tr class="facility-stats-table__total-row">
        <td colspan="2">합계</td>
        ${renderCells(grandTotal)}
      </tr>
    ` + rows.join('');
  }

  function initSafetyGradeStatsTable() {
    const tbody = document.getElementById('safetyGradeStatsTableBody');
    const baseline = document.getElementById('safetyGradeStatsBaseline');

    if (typeof HOME_SAFETY_GRADE_STATS === 'undefined') return;

    if (baseline) {
      const inHomeSafety = Boolean(baseline.closest('.home-facility-layout'));
      const raw = HOME_SAFETY_GRADE_STATS.baseline || '';
      baseline.textContent = inHomeSafety
        ? String(raw)
            .replace(/^(\d{4})\.(\d{2})\.(\d{2})$/, '$1-$2-$3')
            .replace(/^(\d{4})\.(\d{2})$/, '$1-$2-01')
        : `${HOME_SAFETY_GRADE_STATS.baseline} 기준`;
    }
    renderTableBody(tbody, HOME_SAFETY_GRADE_STATS);
  }

  window.PomsHomeSafetyGradeStats = { render: initSafetyGradeStatsTable };

  document.addEventListener('DOMContentLoaded', initSafetyGradeStatsTable);
})();
