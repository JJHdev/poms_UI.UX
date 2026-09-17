/**
 * 시설물통계 — 분류 필터·표·막대·도넛 차트
 */
(() => {
  const MANAGE_KEYS = ['national', 'local', 'port', 'otherDept', 'civil'];
  const MANAGE_LABELS = {
    national: '국가관리',
    local: '지자체 관리',
    port: '항만공사',
    otherDept: '타부서',
    civil: '민유관리',
  };
  const FACILITY_ROWS = [
    { key: 'mooring', label: '계류시설' },
    { key: 'outer', label: '외곽시설' },
    { key: 'building', label: '건축물' },
    { key: 'bridge', label: '교량시설' },
    { key: 'other', label: '기타' },
  ];
  const FILTER_FACILITY_ROWS = [
    ...FACILITY_ROWS.slice(0, 1),
    { key: 'quay', label: '안벽시설' },
    ...FACILITY_ROWS.slice(1),
  ];
  const DONUT_COLORS = {
    national: '#0b1a2e',
    local: '#153e85',
    port: '#0b50d0',
    otherDept: '#f59e0b',
    civil: '#ec4899',
    mooring: '#3b82f6',
    quay: '#0ea5e9',
    outer: '#22c55e',
    building: '#f59e0b',
    bridge: '#8b5cf6',
    other: '#8c9aac',
    kind1: '#0b50d0',
    kind2: '#0b1a2e',
    kind3: '#efc94b',
    kindOther: '#8c9aac',
    a: '#5bbfb7',
    b: '#e76f5d',
    c: '#b5a8d6',
    d: '#c8d96e',
    e: '#c5d9e8',
    gradeOther: '#f0c14b',
  };

  const KIND_ROWS = [
    { key: 'kind1', label: '1종', match: '1종' },
    { key: 'kind2', label: '2종', match: '2종' },
    { key: 'kind3', label: '3종', match: '3종' },
    { key: 'kindOther', label: '기타', match: '기타' },
  ];

  const MAJOR_TITLES = {
    'facility-status': '시설물정보',
    'safety-grade': '상태등급',
    'safety-grade-by-kind': '상태등급(종별)',
    'service-years': '공용년수',
    'seismic-performance': '내진성능확보',
  };

  const CHART_MAJORS = new Set(['facility-status', 'safety-grade']);

  const GRADE_ROWS = [
    { key: 'a', label: 'A등급' },
    { key: 'b', label: 'B등급' },
    { key: 'c', label: 'C등급' },
    { key: 'd', label: 'D등급' },
    { key: 'e', label: 'E등급' },
    { key: 'other', label: '미확인' },
  ];
  const GRADE_BY_KIND_DETAIL_MANAGE_KEYS = ['national', 'local', 'port', 'otherDept', 'civil'];
  const GRADE_BY_KIND_DETAIL_FACILITY_COLUMNS = [
    { key: 'mooring', label: '계류시설', sourceLabels: ['계류시설'] },
    { key: 'outer', label: '외곽시설', sourceLabels: ['외곽시설'] },
    { key: 'traffic', label: '임항교통시설', sourceLabels: ['임항교통시설', '교량시설'] },
    { key: 'building', label: '건축물', sourceLabels: ['건축물'] },
    { key: 'other', label: '기타', sourceLabels: ['기타'] },
  ];
  const GRADE_BY_KIND_DETAIL_MANAGE_WEIGHTS = {
    national: 46,
    local: 18,
    port: 16,
    otherDept: 10,
    civil: 10,
  };

  const MIDDLE_TABLE_MODES = {
    overview: 'overview',
    detail: 'detail',
  };

  let facStatsSortColumn = -1;
  let facStatsSortDir = 'asc';
  let facStatsViewMode = 'facility';

  function formatCount(value) {
    return value > 0 ? value.toLocaleString('ko-KR') : '0';
  }

  const MANAGE_CHECKBOX_IDS = {
    national: 'facStatsManageNational',
    local: 'facStatsManageLocal',
    port: 'facStatsManagePort',
    otherDept: 'facStatsManageOtherDept',
    civil: 'facStatsManageCivil',
  };

  /** 중분류 상세 — 관리주체별 하위 항목 */
  const MANAGE_DETAIL_COLUMNS = {
    national: [
      { key: 'busan', label: '부산청' },
      { key: 'incheon', label: '인천청' },
      { key: 'yeosu', label: '여수청' },
      { key: 'masan', label: '마산청' },
      { key: 'ulsan', label: '울산청' },
      { key: 'donghae', label: '동해청' },
      { key: 'gunsan', label: '군산청' },
      { key: 'mokpo', label: '목포청' },
      { key: 'pohang', label: '포항청' },
      { key: 'pyeongtaek', label: '평택청' },
      { key: 'daesan', label: '대산청' },
      { key: 'subtotal', label: '소계' },
    ],
    local: [
      { key: 'busan', label: '부산' },
      { key: 'incheon', label: '인천' },
      { key: 'gyeonggi', label: '경기' },
      { key: 'gangwon', label: '강원' },
      { key: 'chungnam', label: '충남' },
      { key: 'jeonnam', label: '전남' },
      { key: 'gyeongbuk', label: '경북' },
      { key: 'gyeongnam', label: '경남' },
      { key: 'jeju', label: '제주' },
      { key: 'subtotal', label: '소계' },
    ],
    port: [
      { key: 'bpa', label: 'BPA' },
      { key: 'ipa', label: 'IPA' },
      { key: 'upa', label: 'UPA' },
      { key: 'ygpa', label: 'YGPA' },
      { key: 'subtotal', label: '소계' },
    ],
    otherDept: [
      { key: 'private', label: '민간' },
      { key: 'subtotal', label: '소계' },
    ],
    civil: [
      { key: 'private', label: '민간' },
      { key: 'subtotal', label: '소계' },
    ],
  };

  function getSelectedManageKeys() {
    const selected = MANAGE_KEYS.filter((key) => document.getElementById(MANAGE_CHECKBOX_IDS[key])?.checked);
    return selected.length ? selected : [...MANAGE_KEYS];
  }

  function getManageTotal(values, manageKey) {
    const raw = values?.[manageKey];
    if (raw && typeof raw === 'object') {
      return raw.subtotal ?? 0;
    }
    return Number(raw) || 0;
  }

  function expandManageDetail(total, manageKey) {
    const cols = MANAGE_DETAIL_COLUMNS[manageKey] ?? [];
    const itemKeys = cols.filter((col) => col.key !== 'subtotal').map((col) => col.key);
    const result = Object.fromEntries(cols.map((col) => [col.key, 0]));

    if (!total || !itemKeys.length) {
      return result;
    }

    if (itemKeys.length === 1) {
      result[itemKeys[0]] = total;
      result.subtotal = total;
      return result;
    }

    const weights = itemKeys.map((_, index) => itemKeys.length - index);
    const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
    let allocated = 0;

    itemKeys.forEach((key, index) => {
      if (index === itemKeys.length - 1) {
        result[key] = total - allocated;
      } else {
        const value = Math.floor((total * weights[index]) / weightSum);
        result[key] = value;
        allocated += value;
      }
    });
    result.subtotal = total;
    return result;
  }

  function getManageDetail(values, manageKey) {
    const raw = values?.[manageKey];
    if (raw && typeof raw === 'object') {
      return raw;
    }
    return expandManageDetail(Number(raw) || 0, manageKey);
  }

  function sumManageValues(values, manageKeys = getSelectedManageKeys()) {
    return manageKeys.reduce((total, key) => total + getManageTotal(values, key), 0);
  }

  function computeSubtotal(facilities, rowKeys, manageKeys = getSelectedManageKeys()) {
    const subtotal = Object.fromEntries(manageKeys.map((key) => [key, 0]));
    rowKeys.forEach((key) => {
      const values = facilities[key] ?? {};
      manageKeys.forEach((manageKey) => {
        subtotal[manageKey] += getManageTotal(values, manageKey);
      });
    });
    return subtotal;
  }

  function computeDetailSubtotal(facilities, rowKeys, manageKeys = getSelectedManageKeys()) {
    const subtotal = {};
    manageKeys.forEach((manageKey) => {
      MANAGE_DETAIL_COLUMNS[manageKey].forEach(({ key }) => {
        subtotal[`${manageKey}.${key}`] = 0;
      });
    });

    rowKeys.forEach((facilityKey) => {
      const values = facilities[facilityKey] ?? {};
      manageKeys.forEach((manageKey) => {
        const detail = getManageDetail(values, manageKey);
        MANAGE_DETAIL_COLUMNS[manageKey].forEach(({ key }) => {
          subtotal[`${manageKey}.${key}`] += detail[key] ?? 0;
        });
      });
    });

    return subtotal;
  }

  function renderCells(values, manageKeys = getSelectedManageKeys()) {
    const total = sumManageValues(values, manageKeys);
    const manageCells = manageKeys
      .map((key) => `<td>${formatCount(getManageTotal(values, key))}</td>`)
      .join('');
    return `<td>${formatCount(total)}</td>${manageCells}`;
  }

  function renderDetailCells(values, manageKeys = getSelectedManageKeys()) {
    const total = sumManageValues(values, manageKeys);
    const detailCells = manageKeys
      .flatMap((manageKey) => {
        const detail = getManageDetail(values, manageKey);
        return MANAGE_DETAIL_COLUMNS[manageKey].map(({ key }) => {
          const subtotalClass =
            key === 'subtotal' ? ' class="facility-stats-table__manage-col--subtotal"' : '';
          return `<td${subtotalClass}>${formatCount(detail[key] ?? 0)}</td>`;
        });
      })
      .join('');
    return `<td>${formatCount(total)}</td>${detailCells}`;
  }

  function renderDetailSubtotalCells(subtotal, manageKeys = getSelectedManageKeys()) {
    const total = manageKeys.reduce((sum, manageKey) => sum + (subtotal[`${manageKey}.subtotal`] ?? 0), 0);
    const detailCells = manageKeys
      .flatMap((manageKey) =>
        MANAGE_DETAIL_COLUMNS[manageKey].map(({ key }) => {
          const subtotalClass =
            key === 'subtotal' ? ' class="facility-stats-table__manage-col--subtotal"' : '';
          return `<td${subtotalClass}>${formatCount(subtotal[`${manageKey}.${key}`] ?? 0)}</td>`;
        })
      )
      .join('');
    return `<td>${formatCount(total)}</td>${detailCells}`;
  }

  function getFilters() {
    return {
      major: document.getElementById('facStatsMajorCategory')?.value || 'facility-status',
      middle: document.getElementById('facStatsMiddleCategory')?.value || 'overview',
      manageKeys: getSelectedManageKeys(),
    };
  }

  function onManageCategoryChange(target) {
    if (getSelectedManageKeys().length === 0) {
      target.checked = true;
      return;
    }
    refresh();
  }

  function aggregateOverviewTotals(data, manageKeys) {
    const rowKeys = FACILITY_ROWS.map((r) => r.key);
    const manage = Object.fromEntries(manageKeys.map((key) => [key, 0]));
    let total = 0;

    data.groups.forEach((group) => {
      rowKeys.forEach((key) => {
        const values = group.facilities[key] ?? {};
        manageKeys.forEach((mk) => {
          manage[mk] += getManageTotal(values, mk);
        });
        total += sumManageValues(values, manageKeys);
      });
    });

    return { manage, total, rowKeys };
  }

  function aggregateByKind(data, manageKeys) {
    const rowKeys = FACILITY_ROWS.map((r) => r.key);

    return KIND_ROWS.map(({ key, label, match }) => {
      const group = data.groups.find((g) => g.kind === match);
      let value = 0;
      if (group) {
        rowKeys.forEach((facilityKey) => {
          value += sumManageValues(group.facilities[facilityKey] ?? {}, manageKeys);
        });
      }
      return { key, label, value };
    });
  }

  function aggregateFacilityKindBreakdown(data, manageKeys) {
    return FACILITY_ROWS.map(({ key, label }) => {
      const segments = KIND_ROWS.map(({ key: kindKey, label: kindLabel, match }) => {
        const group = data.groups.find((g) => g.kind === match);
        const value = group ? sumManageValues(group.facilities[key] ?? {}, manageKeys) : 0;
        return { key: kindKey, label: kindLabel, value };
      });
      const total = segments.reduce((sum, seg) => sum + seg.value, 0);
      return { key, label, segments, total };
    }).filter((item) => item.total > 0);
  }

  function kindLegendHtml() {
    return `
      <ul class="fac-stats-kind-legend" aria-label="종별 범례">
        ${KIND_ROWS.map(
          ({ key, label }) => `
          <li>
            <span class="fac-stats-kind-legend__dot fac-stats-bar-group__bar--${key}"></span>
            <span>${label}</span>
          </li>`
        ).join('')}
      </ul>`;
  }

  function sumGrades(grades) {
    return GRADE_ROWS.reduce((sum, { key }) => sum + (grades[key] ?? 0), 0);
  }

  function isGroupHighlightColumn(groupLabel) {
    return groupLabel === '종류' || groupLabel === '종구분' || groupLabel === '상태등급' || groupLabel === '공용년수';
  }

  function groupColumnHeaderClass(groupLabel) {
    return isGroupHighlightColumn(groupLabel) ? 'facility-stats-table__kind-header' : '';
  }

  function groupRowHeaderClass(groupLabel) {
    return isGroupHighlightColumn(groupLabel)
      ? 'facility-stats-table__group facility-stats-table__kind-group'
      : 'facility-stats-table__group';
  }

  function buildGradeManageOverview(manageKeys) {
    const groups = GRADE_ROWS.map(({ key: gradeKey, label }) => {
      const facilities = Object.fromEntries(
        FACILITY_ROWS.map(({ key: facilityKey }) => {
          const manage = Object.fromEntries(manageKeys.map((mk) => [mk, 0]));

          FACILITY_STATS_OVERVIEW.groups.forEach((kindGroup) => {
            const overviewValues = kindGroup.facilities[facilityKey] ?? {};
            const gradeGroup = FACILITY_STATS_GRADE_OVERVIEW.groups.find((g) => g.kind === kindGroup.kind);
            const gradeValues = gradeGroup?.facilities[facilityKey] ?? {};
            const gradeCount = gradeValues[gradeKey] ?? 0;
            const gradeTotal = sumGrades(gradeValues);

            if (!gradeCount || !gradeTotal) return;

            manageKeys.forEach((manageKey) => {
              const manageValue = getManageTotal(overviewValues, manageKey);
              manage[manageKey] += Math.round((manageValue * gradeCount) / gradeTotal);
            });
          });

          return [facilityKey, manage];
        })
      );

      return { kind: label, facilities };
    });

    return {
      baseline: FACILITY_STATS_BASELINE,
      groups,
    };
  }

  function buildServiceYearsOverview(manageKeys) {
    const distributeByOverviewManage = (facilityKey, total) => {
      const overviewTotals = Object.fromEntries(manageKeys.map((key) => [key, 0]));
      FACILITY_STATS_OVERVIEW.groups.forEach((group) => {
        const values = group.facilities[facilityKey] ?? {};
        manageKeys.forEach((manageKey) => {
          overviewTotals[manageKey] += getManageTotal(values, manageKey);
        });
      });

      const overviewTotal = manageKeys.reduce((sum, manageKey) => sum + overviewTotals[manageKey], 0);
      let used = 0;
      return Object.fromEntries(
        manageKeys.map((manageKey, index) => {
          const count =
            index === manageKeys.length - 1 || !overviewTotal
              ? total - used
              : Math.round((total * overviewTotals[manageKey]) / overviewTotal);
          used += count;
          return [manageKey, count];
        })
      );
    };

    const groups = SERVICE_YEAR_ROWS.map(({ key: yearKey, label }) => {
      const facilities = Object.fromEntries(
        FACILITY_ROWS.map(({ key: facilityKey, label: facilityLabel }) => {
          const sourceRow = FACILITY_STATS_SERVICE_YEARS_BY_TYPE.find(
            (row) => (FACILITY_STATS_FACILITY_KEY_BY_LABEL[row.label] || 'other') === facilityKey
          );
          const total = sourceRow?.years[yearKey] ?? 0;
          return [facilityKey, distributeByOverviewManage(facilityKey, total)];
        })
      );
      return { kind: label, facilities };
    });

    return {
      baseline: FACILITY_STATS_BASELINE,
      groups,
    };
  }

  function sumYearBands(years) {
    return SERVICE_YEAR_ROWS.reduce((sum, { key }) => sum + (years[key] ?? 0), 0);
  }

  function sumSeismic(seismic) {
    return SEISMIC_ROWS.reduce((sum, { key }) => sum + (seismic[key] ?? 0), 0);
  }

  function renderSimpleMetricTable(config) {
    const { labelHeader, rows, metricRows, getMetrics, sumMetrics } = config;
    const tbody = document.getElementById('facStatsTableBody');
    const head = document.getElementById('facStatsTableHead');
    const table = document.getElementById('facStatsTable');
    if (!tbody || !head || !table) return;

    const isKindColumn = labelHeader === '종류' || labelHeader === '종구분';
    const isPortColumn = labelHeader === '항명';
    const labelHeaderClass = isKindColumn ? ' facility-stats-table__kind-header' : '';
    const labelCellClass = isKindColumn
      ? 'facility-stats-table__kind-cell is-left'
      : isPortColumn
        ? ''
        : 'is-left';

    table.classList.remove('facility-stats-table--by-port', 'facility-stats-table--by-type', 'facility-stats-table--detail', 'facility-stats-table--seismic');
    head.innerHTML = `
      <tr>
        <th scope="col" class="${labelHeaderClass.trim()}">${labelHeader}</th>
        ${metricRows.map((col) => `<th scope="col">${col.label}</th>`).join('')}
        <th scope="col">합계</th>
      </tr>`;

    const totals = Object.fromEntries(metricRows.map(({ key }) => [key, 0]));
    totals.total = 0;

    tbody.innerHTML = rows
      .map((row) => {
        const metrics = getMetrics(row);
        const total = sumMetrics(metrics);
        metricRows.forEach(({ key }) => {
          totals[key] += metrics[key] ?? 0;
        });
        totals.total += total;
        return `
          <tr>
            <td${labelCellClass ? ` class="${labelCellClass}"` : ''}>${row.label}</td>
            ${metricRows.map(({ key }) => `<td>${formatCount(metrics[key] ?? 0)}</td>`).join('')}
            <td>${formatCount(total)}</td>
          </tr>`;
      })
      .join('');

    tbody.innerHTML += `
      <tr class="facility-stats-table__total-row">
        <td${labelCellClass ? ` class="${labelCellClass}"` : ''}>합계</td>
        ${metricRows.map(({ key }) => `<td>${formatCount(totals[key])}</td>`).join('')}
        <td>${formatCount(totals.total)}</td>
      </tr>`;
  }

  function getGradeRows() {
    return FACILITY_STATS_GRADE_BY_TYPE;
  }

  function aggregateByGrade() {
    const rows = getGradeRows();
    return GRADE_ROWS.map(({ key, label }) => ({
      key,
      label,
      value: rows.reduce((sum, row) => sum + (row.grades[key] ?? 0), 0),
    }));
  }

  function aggregateFacilityGradeBreakdown() {
    return getGradeRows()
      .map(({ key, label, grades }) => {
        const segments = GRADE_ROWS.map(({ key: gradeKey, label: gradeLabel }) => ({
          key: gradeKey,
          label: gradeLabel,
          value: grades[gradeKey] ?? 0,
        }));
        return { key, label, segments, total: sumGrades(grades) };
      })
      .filter((item) => item.total > 0);
  }

  function gradeLegendHtml() {
    return `
      <ul class="fac-stats-kind-legend" aria-label="등급별 범례">
        ${GRADE_ROWS.map(
          ({ key, label }) => `
          <li>
            <span class="fac-stats-kind-legend__dot fac-stats-bar-group__bar--${key}"></span>
            <span>${label}</span>
          </li>`
        ).join('')}
      </ul>`;
  }

  function aggregatePortRows(manageKeys) {
    return FACILITY_STATS_BY_PORT.map((portRow) => {
      let total = 0;
      FILTER_FACILITY_ROWS.forEach(({ key }) => {
        total += sumManageValues(portRow[key] ?? {}, manageKeys);
      });
      return {
        port: portRow.port,
        total,
        facilities: portRow,
      };
    });
  }

  function setOverviewTableHead(manageKeys, groupLabel = '종류') {
    const head = document.getElementById('facStatsTableHead');
    const table = document.getElementById('facStatsTable');
    const colgroup = document.getElementById('facStatsTableColgroup');
    if (!head || !table) return;

    table.classList.remove('facility-stats-table--by-port', 'facility-stats-table--by-type', 'facility-stats-table--detail', 'facility-stats-table--seismic');
    const manageHeaders = manageKeys
      .map((key) => `<th rowspan="2" scope="col">${MANAGE_LABELS[key]}</th>`)
      .join('');

    head.innerHTML = `
      <tr>
        <th colspan="3" scope="colgroup">구분</th>
        ${manageHeaders}
      </tr>
      <tr>
        <th scope="col" class="${groupColumnHeaderClass(groupLabel)}">${groupLabel}</th>
        <th scope="col">시설구분</th>
        <th scope="col">개소</th>
      </tr>`;

    if (colgroup) {
      colgroup.innerHTML = `
        <col class="facility-stats-table__kind">
        <col class="facility-stats-table__type">
        <col class="facility-stats-table__count">
        ${manageKeys.map(() => '<col class="facility-stats-table__manage">').join('')}`;
    }
  }

  function renderOverviewTable(data, manageKeys, { groupLabel = '종류' } = {}) {
    const tbody = document.getElementById('facStatsTableBody');
    if (!tbody) return;

    setOverviewTableHead(manageKeys, groupLabel);
    const activeRows = FACILITY_ROWS;
    const rowCount = activeRows.length + 1;
    const grandTotal = Object.fromEntries(manageKeys.map((key) => [key, 0]));
    let grandTotalCount = 0;
    const rowGroupClass = groupRowHeaderClass(groupLabel);
    const totalLabel = groupLabel === '상태등급' ? '미확인' : '총계';

    const rows = data.groups.map((group) => {
      const subtotal = computeSubtotal(group.facilities, activeRows.map((r) => r.key), manageKeys);
      const subtotalCount = sumManageValues(subtotal, manageKeys);

      manageKeys.forEach((key) => {
        grandTotal[key] += subtotal[key];
      });
      grandTotalCount += subtotalCount;

      const [firstRow, ...restRows] = activeRows;
      const firstValues = group.facilities[firstRow.key] ?? {};

      const facilityRows = restRows
        .map(({ key, label }) => {
          const values = group.facilities[key] ?? {};
          return `
            <tr>
              <td>${label}</td>
              ${renderCells(values, manageKeys)}
            </tr>`;
        })
        .join('');

      return `
        <tr>
          <th rowspan="${rowCount}" scope="rowgroup" class="${rowGroupClass}">${group.kind}</th>
          <td>${firstRow.label}</td>
          ${renderCells(firstValues, manageKeys)}
        </tr>
        ${facilityRows}
        <tr class="facility-stats-table__subtotal-row">
          <td>소계</td>
          ${renderCells(subtotal, manageKeys)}
        </tr>`;
    });

    tbody.innerHTML =
      rows.join('') +
      `
      <tr class="facility-stats-table__total-row">
        <td colspan="2">${totalLabel}</td>
        <td>${formatCount(grandTotalCount)}</td>
        ${manageKeys.map((key) => `<td>${formatCount(grandTotal[key])}</td>`).join('')}
      </tr>`;
  }

  function setDetailOverviewTableHead(manageKeys, groupLabel = '종류') {
    const head = document.getElementById('facStatsTableHead');
    const table = document.getElementById('facStatsTable');
    const colgroup = document.getElementById('facStatsTableColgroup');
    if (!head || !table) return;

    table.classList.remove('facility-stats-table--by-port', 'facility-stats-table--by-type', 'facility-stats-table--detail');
    table.classList.add('facility-stats-table--detail');

    const groupHeaders = manageKeys
      .map((manageKey) => {
        const colCount = MANAGE_DETAIL_COLUMNS[manageKey].length;
        return `<th colspan="${colCount}" scope="colgroup" class="facility-stats-table__manage-group">${MANAGE_LABELS[manageKey]}</th>`;
      })
      .join('');

    const subHeaders = manageKeys
      .flatMap((manageKey) =>
        MANAGE_DETAIL_COLUMNS[manageKey].map(
          ({ label, key }) =>
            `<th scope="col" class="facility-stats-table__manage-col${key === 'subtotal' ? ' facility-stats-table__manage-col--subtotal' : ''}">${label}</th>`
        )
      )
      .join('');

    head.innerHTML = `
      <tr>
        <th colspan="3" scope="colgroup">구분</th>
        ${groupHeaders}
      </tr>
      <tr>
        <th scope="col" class="${groupColumnHeaderClass(groupLabel)}">${groupLabel}</th>
        <th scope="col">시설구분</th>
        <th scope="col">개소</th>
        ${subHeaders}
      </tr>`;

    if (colgroup) {
      const detailColCount = manageKeys.reduce(
        (count, manageKey) => count + MANAGE_DETAIL_COLUMNS[manageKey].length,
        0
      );
      colgroup.innerHTML = `
        <col class="facility-stats-table__kind">
        <col class="facility-stats-table__type">
        <col class="facility-stats-table__count">
        ${Array(detailColCount).fill('<col>').join('')}`;
    }
  }

  function renderOverviewDetailTable(data, manageKeys, { groupLabel = '종류' } = {}) {
    const tbody = document.getElementById('facStatsTableBody');
    if (!tbody) return;

    setDetailOverviewTableHead(manageKeys, groupLabel);
    const activeRows = FACILITY_ROWS;
    const rowKeys = activeRows.map((row) => row.key);
    const rowCount = activeRows.length + 1;
    const rowGroupClass = groupRowHeaderClass(groupLabel);
    const totalLabel = groupLabel === '상태등급' ? '미확인' : '총계';
    const grandDetail = {};
    manageKeys.forEach((manageKey) => {
      MANAGE_DETAIL_COLUMNS[manageKey].forEach(({ key }) => {
        grandDetail[`${manageKey}.${key}`] = 0;
      });
    });
    const rows = data.groups.map((group) => {
      const subtotal = computeDetailSubtotal(group.facilities, rowKeys, manageKeys);

      manageKeys.forEach((manageKey) => {
        MANAGE_DETAIL_COLUMNS[manageKey].forEach(({ key }) => {
          const compositeKey = `${manageKey}.${key}`;
          grandDetail[compositeKey] += subtotal[compositeKey] ?? 0;
        });
      });

      const [firstRow, ...restRows] = activeRows;
      const firstValues = group.facilities[firstRow.key] ?? {};

      const facilityRows = restRows
        .map(({ key, label }) => {
          const values = group.facilities[key] ?? {};
          return `
            <tr>
              <td>${label}</td>
              ${renderDetailCells(values, manageKeys)}
            </tr>`;
        })
        .join('');

      return `
        <tr>
          <th rowspan="${rowCount}" scope="rowgroup" class="${rowGroupClass}">${group.kind}</th>
          <td>${firstRow.label}</td>
          ${renderDetailCells(firstValues, manageKeys)}
        </tr>
        ${facilityRows}
        <tr class="facility-stats-table__subtotal-row">
          <td>소계</td>
          ${renderDetailSubtotalCells(subtotal, manageKeys)}
        </tr>`;
    });

    tbody.innerHTML =
      rows.join('') +
      `
      <tr class="facility-stats-table__total-row">
        <td colspan="2">${totalLabel}</td>
        ${renderDetailSubtotalCells(grandDetail, manageKeys)}
      </tr>`;
  }

  function setByPortTableHead() {
    const head = document.getElementById('facStatsTableHead');
    const table = document.getElementById('facStatsTable');
    if (!head || !table) return;

    table.classList.add('facility-stats-table--by-port');
    table.classList.remove('facility-stats-table--by-type', 'facility-stats-table--detail', 'facility-stats-table--seismic');
    head.innerHTML = `
      <tr>
        <th scope="col" rowspan="2">항명</th>
        <th scope="colgroup" colspan="${FILTER_FACILITY_ROWS.length}">시설구분</th>
        <th scope="col" rowspan="2">합계</th>
      </tr>
      <tr>
        ${FILTER_FACILITY_ROWS.map((r) => `<th scope="col">${r.label}</th>`).join('')}
      </tr>`;
  }

  function renderByPortTable(manageKeys) {
    const tbody = document.getElementById('facStatsTableBody');
    if (!tbody) return;

    setByPortTableHead();
    const portRows = aggregatePortRows(manageKeys);
    const colTotals = FILTER_FACILITY_ROWS.reduce((acc, { key }) => {
      acc[key] = 0;
      return acc;
    }, { total: 0 });

    tbody.innerHTML = portRows
      .map((row) => {
        let rowTotal = 0;
        const cells = FILTER_FACILITY_ROWS.map(({ key }) => {
          const values = row.facilities[key] ?? {};
          const count = sumManageValues(values, manageKeys);
          colTotals[key] += count;
          rowTotal += count;
          return `<td>${formatCount(count)}</td>`;
        }).join('');
        colTotals.total += rowTotal;
        return `
          <tr>
            <td>${row.port}</td>
            ${cells}
            <td>${formatCount(rowTotal)}</td>
          </tr>`;
      })
      .join('');

    tbody.innerHTML += `
      <tr class="facility-stats-table__total-row">
        <td>합계</td>
        ${FILTER_FACILITY_ROWS.map(({ key }) => `<td>${formatCount(colTotals[key])}</td>`).join('')}
        <td>${formatCount(colTotals.total)}</td>
      </tr>`;
  }

  function setByTypeTableHead(manageKeys) {
    const head = document.getElementById('facStatsTableHead');
    const table = document.getElementById('facStatsTable');
    if (!head || !table) return;

    table.classList.add('facility-stats-table--by-type');
    table.classList.remove('facility-stats-table--by-port', 'facility-stats-table--detail', 'facility-stats-table--seismic');
    const manageHeaders = manageKeys
      .map((key) => `<th rowspan="2" scope="col">${MANAGE_LABELS[key]}</th>`)
      .join('');

    head.innerHTML = `
      <tr>
        <th colspan="2" scope="colgroup">구분</th>
        <th rowspan="2" scope="col">개소</th>
        ${manageHeaders}
      </tr>
      <tr>
        <th scope="col">시설구분</th>
        <th scope="col" class="facility-stats-table__kind-header">종류</th>
      </tr>`;
  }

  function renderByTypeTable(data, manageKeys) {
    const tbody = document.getElementById('facStatsTableBody');
    if (!tbody) return;

    setByTypeTableHead(manageKeys);
    const activeRows = FILTER_FACILITY_ROWS;
    const grandTotal = Object.fromEntries(manageKeys.map((key) => [key, 0]));
    let grandTotalCount = 0;

    const html = activeRows
      .map(({ key, label }) => {
        const kindRows = data.groups
          .map((group) => {
            const values = group.facilities[key] ?? {};
            return { kind: group.kind, values };
          })
          .filter((item) => sumManageValues(item.values, manageKeys) > 0);

        if (!kindRows.length) return '';

        const subtotalFromGroups = Object.fromEntries(manageKeys.map((mk) => [mk, 0]));
        kindRows.forEach((item) => {
          manageKeys.forEach((mk) => {
            subtotalFromGroups[mk] += getManageTotal(item.values, mk);
          });
        });
        const subtotalCount = sumManageValues(subtotalFromGroups, manageKeys);

        manageKeys.forEach((mk) => {
          grandTotal[mk] += subtotalFromGroups[mk];
        });
        grandTotalCount += subtotalCount;

        const [first, ...rest] = kindRows;
        const restHtml = rest
          .map(
            (item) => `
            <tr>
              <td class="facility-stats-table__kind-cell">${item.kind}</td>
              ${renderCells(item.values, manageKeys)}
            </tr>`
          )
          .join('');

        return `
          <tr>
            <th rowspan="${kindRows.length + 1}" scope="rowgroup" class="facility-stats-table__group">${label}</th>
            <td class="facility-stats-table__kind-cell">${first.kind}</td>
            ${renderCells(first.values, manageKeys)}
          </tr>
          ${restHtml}
          <tr class="facility-stats-table__subtotal-row">
            <td>소계</td>
            ${renderCells(subtotalFromGroups, manageKeys)}
          </tr>`;
      })
      .join('');

    tbody.innerHTML =
      html +
      `
      <tr class="facility-stats-table__total-row">
        <td colspan="2">총계</td>
        <td>${formatCount(grandTotalCount)}</td>
        ${manageKeys.map((mk) => `<td>${formatCount(grandTotal[mk])}</td>`).join('')}
      </tr>`;
  }

  function renderGradeByTypeTable() {
    const tbody = document.getElementById('facStatsTableBody');
    const head = document.getElementById('facStatsTableHead');
    const table = document.getElementById('facStatsTable');
    if (!tbody || !head || !table) return;

    table.classList.remove('facility-stats-table--by-port', 'facility-stats-table--by-type', 'facility-stats-table--detail');
    head.innerHTML = `
      <tr>
        <th scope="col">시설구분</th>
        ${GRADE_ROWS.map((g) => `<th scope="col">${g.label}</th>`).join('')}
        <th scope="col">합계</th>
      </tr>`;

    const rows = getGradeRows();
    const totals = GRADE_ROWS.reduce((acc, { key }) => {
      acc[key] = 0;
      return acc;
    }, { total: 0 });

    tbody.innerHTML = rows
      .map((row) => {
        const total = sumGrades(row.grades);
        GRADE_ROWS.forEach(({ key }) => {
          totals[key] += row.grades[key] ?? 0;
        });
        totals.total += total;
        return `
          <tr>
            <td class="is-left">${row.label}</td>
            ${GRADE_ROWS.map(({ key }) => `<td>${formatCount(row.grades[key] ?? 0)}</td>`).join('')}
            <td>${formatCount(total)}</td>
          </tr>`;
      })
      .join('');

    tbody.innerHTML += `
      <tr class="facility-stats-table__total-row">
        <td class="is-left">합계</td>
        ${GRADE_ROWS.map(({ key }) => `<td>${formatCount(totals[key])}</td>`).join('')}
        <td>${formatCount(totals.total)}</td>
      </tr>`;
  }

  function renderGradeByPortTable() {
    const tbody = document.getElementById('facStatsTableBody');
    const head = document.getElementById('facStatsTableHead');
    const table = document.getElementById('facStatsTable');
    if (!tbody || !head || !table) return;

    table.classList.add('facility-stats-table--by-port');
    table.classList.remove('facility-stats-table--by-type', 'facility-stats-table--detail');
    head.innerHTML = `
      <tr>
        <th scope="col">항명</th>
        ${GRADE_ROWS.map((g) => `<th scope="col">${g.label}</th>`).join('')}
        <th scope="col">합계</th>
      </tr>`;

    const totals = GRADE_ROWS.reduce((acc, { key }) => {
      acc[key] = 0;
      return acc;
    }, { total: 0 });

    tbody.innerHTML = FACILITY_STATS_GRADE_BY_PORT.map((row) => {
      const total = sumGrades(row.grades);
      GRADE_ROWS.forEach(({ key }) => {
        totals[key] += row.grades[key] ?? 0;
      });
      totals.total += total;
      return `
        <tr>
          <td>${row.port}</td>
          ${GRADE_ROWS.map(({ key }) => `<td>${formatCount(row.grades[key] ?? 0)}</td>`).join('')}
          <td>${formatCount(total)}</td>
        </tr>`;
    }).join('');

    tbody.innerHTML += `
      <tr class="facility-stats-table__total-row">
        <td>합계</td>
        ${GRADE_ROWS.map(({ key }) => `<td>${formatCount(totals[key])}</td>`).join('')}
        <td>${formatCount(totals.total)}</td>
      </tr>`;
  }

  function renderGradeByKindTable() {
    renderGradeByKindOverviewTable();
  }

  function renderGradeByKindOverviewTable() {
    const tbody = document.getElementById('facStatsTableBody');
    const head = document.getElementById('facStatsTableHead');
    const table = document.getElementById('facStatsTable');
    const colgroup = document.getElementById('facStatsTableColgroup');
    if (!tbody || !head || !table) return;

    table.classList.add('facility-stats-table--by-type');
    table.classList.remove('facility-stats-table--by-port', 'facility-stats-table--detail');
    const facilityHeaderHtml = GRADE_BY_KIND_DETAIL_FACILITY_COLUMNS
      .map((column) => `<th scope="col">${column.label}</th>`)
      .join('');
    const manageHeaderHtml = GRADE_BY_KIND_DETAIL_MANAGE_KEYS
      .map(
        (manageKey) =>
          `<th colspan="${GRADE_BY_KIND_DETAIL_FACILITY_COLUMNS.length + 1}" scope="colgroup">${MANAGE_LABELS[manageKey]}</th>`
      )
      .join('');
    const manageSubHeaderHtml = GRADE_BY_KIND_DETAIL_MANAGE_KEYS
      .map(() => `${facilityHeaderHtml}<th scope="col">계</th>`)
      .join('');

    head.innerHTML = `
      <tr>
        <th rowspan="2" scope="col" class="facility-stats-table__kind-header">종별</th>
        <th rowspan="2" scope="col">등급</th>
        ${manageHeaderHtml}
      </tr>
      <tr>
        ${manageSubHeaderHtml}
      </tr>`;

    if (colgroup) {
      const manageColCount =
        GRADE_BY_KIND_DETAIL_MANAGE_KEYS.length * (GRADE_BY_KIND_DETAIL_FACILITY_COLUMNS.length + 1);
      colgroup.innerHTML = `
        <col class="facility-stats-table__kind">
        <col class="facility-stats-table__type">
        ${Array(manageColCount).fill('<col>').join('')}`;
    }

    const detailGradeRows = GRADE_ROWS.filter(({ key }) => key !== 'other');

    const distributeByManage = (value) => {
      const weights = GRADE_BY_KIND_DETAIL_MANAGE_KEYS.map(
        (manageKey) => GRADE_BY_KIND_DETAIL_MANAGE_WEIGHTS[manageKey] ?? 0
      );
      const weightTotal = weights.reduce((sum, weight) => sum + weight, 0) || 1;
      let used = 0;
      const distributed = {};
      GRADE_BY_KIND_DETAIL_MANAGE_KEYS.forEach((manageKey, index) => {
        const count =
          index === GRADE_BY_KIND_DETAIL_MANAGE_KEYS.length - 1
            ? value - used
            : Math.floor((value * weights[index]) / weightTotal);
        distributed[manageKey] = count;
        used += count;
      });
      return distributed;
    };

    const buildFacilityCounts = (group, gradeKey) => {
      const facilities = group?.facilities ?? [];
      return Object.fromEntries(
        GRADE_BY_KIND_DETAIL_FACILITY_COLUMNS.map((column) => {
          const value = column.sourceLabels.reduce((sum, label) => {
            const facility = facilities.find((item) => item.label === label);
            if (!facility) return sum;
            if (gradeKey === 'subtotal') return sum + sumGrades(facility.grades);
            return sum + (facility.grades[gradeKey] ?? 0);
          }, 0);
          return [column.key, value];
        })
      );
    };

    const formatStatsZero = (value) => Number(value || 0).toLocaleString('ko-KR');

    const renderGradeCells = (facilityCounts) =>
      GRADE_BY_KIND_DETAIL_MANAGE_KEYS
        .map((manageKey) => {
          const manageFacilityValues = GRADE_BY_KIND_DETAIL_FACILITY_COLUMNS.map((column) => {
            const distributed = distributeByManage(facilityCounts[column.key] ?? 0);
            return distributed[manageKey] ?? 0;
          });
          const subtotal = manageFacilityValues.reduce((sum, value) => sum + value, 0);
          return `${manageFacilityValues.map((value) => `<td>${formatStatsZero(value)}</td>`).join('')}<td>${formatStatsZero(subtotal)}</td>`;
        })
        .join('');

    const emptyFacilityCounts = () =>
      Object.fromEntries(GRADE_BY_KIND_DETAIL_FACILITY_COLUMNS.map((column) => [column.key, 0]));
    const addFacilityCounts = (target, source) => {
      GRADE_BY_KIND_DETAIL_FACILITY_COLUMNS.forEach((column) => {
        target[column.key] += source[column.key] ?? 0;
      });
    };
    const renderRowGroup = (groupLabel, rows, groupClass = '') =>
      rows
        .map(({ label, counts, isSubtotal }, index) => `
          <tr${isSubtotal ? ` class="${groupClass || 'facility-stats-table__subtotal-row'}"` : ''}>
            ${
              index === 0
                ? `<th rowspan="${rows.length}" scope="rowgroup" class="facility-stats-table__group facility-stats-table__kind-group">${groupLabel}</th>`
                : ''
            }
            <td>${label}</td>
            ${renderGradeCells(counts)}
          </tr>`)
        .join('');

    const totalCounts = emptyFacilityCounts();

    const knownKindHtml = FACILITY_STATS_GRADE_BY_KIND_DETAIL.map((group) => {
      const subtotalCounts = emptyFacilityCounts();
      const rows = detailGradeRows.map(({ key, label }) => {
        const counts = buildFacilityCounts(group, key);
        addFacilityCounts(subtotalCounts, counts);
        addFacilityCounts(totalCounts, counts);
        return { label, counts };
      });
      rows.push({ label: '소계', counts: subtotalCounts, isSubtotal: true });
      return renderRowGroup(group.kind, rows);
    }).join('');

    const unknownGradeSubtotal = emptyFacilityCounts();
    const unknownGradeRows = FACILITY_STATS_GRADE_BY_KIND_DETAIL.map((group) => {
      const counts = buildFacilityCounts(group, 'other');
      addFacilityCounts(unknownGradeSubtotal, counts);
      addFacilityCounts(totalCounts, counts);
      return { label: group.kind, counts };
    });
    unknownGradeRows.push({ label: '소계', counts: unknownGradeSubtotal, isSubtotal: true });

    const buildOtherFacilityCounts = (gradeKey) =>
      Object.fromEntries(
        GRADE_BY_KIND_DETAIL_FACILITY_COLUMNS.map((column) => {
          if (column.key !== 'other') return [column.key, 0];
          const value = FACILITY_STATS_GRADE_BY_KIND_DETAIL.reduce((sum, group) => {
            return (
              sum +
              (group.facilities ?? []).reduce((facilitySum, facility) => {
                if (facility.label !== '기타') return facilitySum;
                if (gradeKey === 'subtotal') return facilitySum + sumGrades(facility.grades);
                return facilitySum + (facility.grades[gradeKey] ?? 0);
              }, 0)
            );
          }, 0);
          return [column.key, value];
        })
      );
    const unknownKindSubtotal = emptyFacilityCounts();
    const unknownKindRows = [
      { label: '기타', counts: buildOtherFacilityCounts('subtotal') },
      ...detailGradeRows.map(({ key, label }) => {
        const counts = buildOtherFacilityCounts(key);
        addFacilityCounts(unknownKindSubtotal, counts);
        return { label, counts };
      }),
      { label: '소계', counts: unknownKindSubtotal, isSubtotal: true },
    ];

    const totalHtml = `
      <tr class="facility-stats-table__total-row">
        <th colspan="2" scope="row" class="facility-stats-table__group facility-stats-table__kind-group">계</th>
        ${renderGradeCells(totalCounts)}
      </tr>`;

    tbody.innerHTML =
      knownKindHtml +
      renderRowGroup('미확인', unknownGradeRows) +
      renderRowGroup('미확인', unknownKindRows) +
      totalHtml;
  }

  function renderGradeByKindDetailTable() {
    const tbody = document.getElementById('facStatsTableBody');
    const head = document.getElementById('facStatsTableHead');
    const table = document.getElementById('facStatsTable');
    const colgroup = document.getElementById('facStatsTableColgroup');
    if (!tbody || !head || !table) return;

    const manageKeys = getSelectedManageKeys();

    table.classList.remove('facility-stats-table--by-port', 'facility-stats-table--by-type');
    table.classList.add('facility-stats-table--detail');

    const groupHeaders = manageKeys
      .map((manageKey) => {
        const colCount = MANAGE_DETAIL_COLUMNS[manageKey].length;
        return `<th colspan="${colCount}" scope="colgroup" class="facility-stats-table__manage-group">${MANAGE_LABELS[manageKey]}</th>`;
      })
      .join('');
    const subHeaders = manageKeys
      .flatMap((manageKey) =>
        MANAGE_DETAIL_COLUMNS[manageKey].map(
          ({ label, key }) =>
            `<th scope="col" class="facility-stats-table__manage-col${key === 'subtotal' ? ' facility-stats-table__manage-col--subtotal' : ''}">${label}</th>`
        )
      )
      .join('');

    head.innerHTML = `
      <tr>
        <th rowspan="2" scope="col" class="facility-stats-table__kind-header">종별</th>
        <th rowspan="2" scope="col">등급</th>
        ${groupHeaders}
      </tr>
      <tr>
        ${subHeaders}
      </tr>`;

    if (colgroup) {
      const detailColCount = manageKeys.reduce(
        (count, manageKey) => count + MANAGE_DETAIL_COLUMNS[manageKey].length,
        0
      );
      colgroup.innerHTML = `
        <col class="facility-stats-table__kind">
        <col class="facility-stats-table__type">
        ${Array(detailColCount).fill('<col>').join('')}`;
    }

    const detailGradeRows = GRADE_ROWS.filter(({ key }) => key !== 'other');

    const sumVisibleGrades = (grades = {}) =>
      detailGradeRows.reduce((sum, { key }) => sum + (grades[key] ?? 0), 0);

    const getKindGradeTotal = (group, gradeKey) => {
      const facilities = group?.facilities ?? [];
      return facilities.reduce((sum, facility) => {
        if (gradeKey === 'subtotal') return sum + sumVisibleGrades(facility.grades);
        return sum + (facility.grades[gradeKey] ?? 0);
      }, 0);
    };

    const distributeByManage = (value) => {
      const weights = manageKeys.map((manageKey) => GRADE_BY_KIND_DETAIL_MANAGE_WEIGHTS[manageKey] ?? 0);
      const weightTotal = weights.reduce((sum, weight) => sum + weight, 0) || 1;
      let used = 0;
      const distributed = {};
      manageKeys.forEach((manageKey, index) => {
        const count =
          index === manageKeys.length - 1 ? value - used : Math.floor((value * weights[index]) / weightTotal);
        distributed[manageKey] = count;
        used += count;
      });
      return distributed;
    };

    const formatStatsZero = (value) => Number(value || 0).toLocaleString('ko-KR');

    const renderDetailGradeCells = (value) => {
      const manageTotals = distributeByManage(value);
      return manageKeys
        .flatMap((manageKey) => {
          const detail = expandManageDetail(manageTotals[manageKey] ?? 0, manageKey);
          return MANAGE_DETAIL_COLUMNS[manageKey].map(({ key }) => {
            const subtotalClass =
              key === 'subtotal' ? ' class="facility-stats-table__manage-col--subtotal"' : '';
            return `<td${subtotalClass}>${formatStatsZero(detail[key] ?? 0)}</td>`;
          });
        })
        .join('');
    };

    const renderRowGroup = (groupLabel, rows, groupClass = '') =>
      rows
        .map(({ label, value, isSubtotal }, index) => `
          <tr${isSubtotal ? ` class="${groupClass || 'facility-stats-table__subtotal-row'}"` : ''}>
            ${
              index === 0
                ? `<th rowspan="${rows.length}" scope="rowgroup" class="facility-stats-table__group facility-stats-table__kind-group">${groupLabel}</th>`
                : ''
            }
            <td>${label}</td>
            ${renderDetailGradeCells(value)}
          </tr>`)
        .join('');

    let grandTotal = 0;

    const knownKindHtml = FACILITY_STATS_GRADE_BY_KIND_DETAIL.map((group) => {
      let subtotal = 0;
      const rows = detailGradeRows.map(({ key, label }) => {
        const value = getKindGradeTotal(group, key);
        subtotal += value;
        grandTotal += value;
        return { label, value };
      });
      rows.push({ label: '소계', value: subtotal, isSubtotal: true });
      return renderRowGroup(group.kind, rows);
    }).join('');

    let unknownGradeSubtotal = 0;
    const unknownGradeRows = FACILITY_STATS_GRADE_BY_KIND_DETAIL.map((group) => {
      const value = getKindGradeTotal(group, 'other');
      unknownGradeSubtotal += value;
      grandTotal += value;
      return { label: group.kind, value };
    });
    unknownGradeRows.push({ label: '소계', value: unknownGradeSubtotal, isSubtotal: true });

    const getOtherFacilityGradeTotal = (gradeKey) =>
      FACILITY_STATS_GRADE_BY_KIND_DETAIL.reduce((sum, group) => {
        return (
          sum +
          (group.facilities ?? []).reduce((facilitySum, facility) => {
            if (facility.label !== '기타') return facilitySum;
            if (gradeKey === 'subtotal') return facilitySum + sumVisibleGrades(facility.grades);
            return facilitySum + (facility.grades[gradeKey] ?? 0);
          }, 0)
        );
      }, 0);
    const unknownKindSubtotal = detailGradeRows.reduce(
      (sum, { key }) => sum + getOtherFacilityGradeTotal(key),
      0
    );
    const unknownKindRows = [
      { label: '기타', value: getOtherFacilityGradeTotal('subtotal') },
      ...detailGradeRows.map(({ key, label }) => ({ label, value: getOtherFacilityGradeTotal(key) })),
      { label: '소계', value: unknownKindSubtotal, isSubtotal: true },
    ];

    const totalHtml = `
      <tr class="facility-stats-table__total-row">
        <th colspan="2" scope="row" class="facility-stats-table__group facility-stats-table__kind-group">계</th>
        ${renderDetailGradeCells(grandTotal)}
      </tr>`;

    tbody.innerHTML =
      knownKindHtml +
      renderRowGroup('미확인', unknownGradeRows) +
      renderRowGroup('미확인', unknownKindRows) +
      totalHtml;
  }

  function renderServiceYearsTable() {
    renderSimpleMetricTable({
      labelHeader: '시설구분',
      rows: FACILITY_STATS_SERVICE_YEARS_BY_TYPE.map((row) => ({
        label: row.label,
        years: row.years,
      })),
      metricRows: SERVICE_YEAR_ROWS,
      getMetrics: (row) => row.years,
      sumMetrics: sumYearBands,
    });
  }

  function renderServiceYearsByPortTable() {
    renderSimpleMetricTable({
      labelHeader: '항명',
      rows: FACILITY_STATS_SERVICE_YEARS_BY_PORT.map((row) => ({
        label: row.port,
        years: row.years,
      })),
      metricRows: SERVICE_YEAR_ROWS,
      getMetrics: (row) => row.years,
      sumMetrics: sumYearBands,
    });
  }

  function renderSeismicTable() {
    renderSeismicOverviewTable();
  }

  function renderSeismicByPortTable() {
    renderSeismicDetailTable();
  }

  function renderSeismicOverviewTable() {
    const tbody = document.getElementById('facStatsTableBody');
    const head = document.getElementById('facStatsTableHead');
    const table = document.getElementById('facStatsTable');
    const colgroup = document.getElementById('facStatsTableColgroup');
    if (!tbody || !head || !table) return;

    const manageKeys = getSelectedManageKeys();
    table.classList.remove('facility-stats-table--by-port', 'facility-stats-table--by-type', 'facility-stats-table--detail');
    table.classList.add('facility-stats-table--seismic');

    const manageHeaders = manageKeys
      .map((key) => `<th rowspan="2" scope="col">${MANAGE_LABELS[key]}</th>`)
      .join('');

    head.innerHTML = `
      <tr>
        <th colspan="3" scope="colgroup">구분</th>
        ${manageHeaders}
      </tr>
      <tr>
        <th scope="col" class="facility-stats-table__kind-header">시설구분</th>
        <th scope="col">내진현황</th>
        <th scope="col">개소</th>
      </tr>`;

    if (colgroup) {
      colgroup.innerHTML = `
        <col class="facility-stats-table__kind">
        <col class="facility-stats-table__type">
        <col class="facility-stats-table__count">
        ${manageKeys.map(() => '<col class="facility-stats-table__manage">').join('')}`;
    }

    const distributeByOverviewManage = (facilityKey, total) => {
      const overviewTotals = Object.fromEntries(manageKeys.map((key) => [key, 0]));
      FACILITY_STATS_OVERVIEW.groups.forEach((group) => {
        const values = group.facilities[facilityKey] ?? {};
        manageKeys.forEach((manageKey) => {
          overviewTotals[manageKey] += getManageTotal(values, manageKey);
        });
      });

      const overviewTotal = manageKeys.reduce((sum, manageKey) => sum + overviewTotals[manageKey], 0);
      let used = 0;
      return Object.fromEntries(
        manageKeys.map((manageKey, index) => {
          const count =
            index === manageKeys.length - 1 || !overviewTotal
              ? total - used
              : Math.round((total * overviewTotals[manageKey]) / overviewTotal);
          used += count;
          return [manageKey, count];
        })
      );
    };

    const facilityRows = [
      { key: 'total', label: '총계' },
      ...FACILITY_ROWS,
    ];
    const seismicRows = [...SEISMIC_ROWS, { key: 'subtotal', label: '소계' }];
    const getFacilitySeismicCount = (facilityKey, seismicKey) => {
      const sourceRows =
        facilityKey === 'total'
          ? FACILITY_STATS_SEISMIC_BY_TYPE
          : FACILITY_STATS_SEISMIC_BY_TYPE.filter(
              (row) => (FACILITY_STATS_FACILITY_KEY_BY_LABEL[row.label] || 'other') === facilityKey
            );
      return sourceRows.reduce((sum, row) => {
        if (seismicKey === 'subtotal') return sum + sumSeismic(row.seismic);
        return sum + (row.seismic[seismicKey] ?? 0);
      }, 0);
    };

    const html = facilityRows
      .map((facility) => {
        const rows = seismicRows.map(({ key, label }, index) => {
          const count = getFacilitySeismicCount(facility.key, key);
          const manage = distributeByOverviewManage(facility.key === 'total' ? 'other' : facility.key, count);

          return `
            <tr${key === 'subtotal' ? ' class="facility-stats-table__subtotal-row"' : ''}>
              ${
                index === 0
                  ? `<th rowspan="${seismicRows.length}" scope="rowgroup" class="facility-stats-table__group facility-stats-table__kind-group">${facility.label}</th>`
                  : ''
              }
              <td>${label}</td>
              <td>${formatCount(count)}</td>
              ${manageKeys.map((manageKey) => `<td>${formatCount(manage[manageKey] ?? 0)}</td>`).join('')}
            </tr>`;
        });
        return rows.join('');
      })
      .join('');

    tbody.innerHTML = html;
  }

  function renderSeismicDetailTable() {
    const tbody = document.getElementById('facStatsTableBody');
    const head = document.getElementById('facStatsTableHead');
    const table = document.getElementById('facStatsTable');
    const colgroup = document.getElementById('facStatsTableColgroup');
    if (!tbody || !head || !table) return;

    const manageKeys = getSelectedManageKeys();
    table.classList.remove('facility-stats-table--by-port', 'facility-stats-table--by-type');
    table.classList.add('facility-stats-table--detail', 'facility-stats-table--seismic');

    const groupHeaders = manageKeys
      .map((manageKey) => {
        const colCount = MANAGE_DETAIL_COLUMNS[manageKey].length;
        return `<th colspan="${colCount}" scope="colgroup" class="facility-stats-table__manage-group">${MANAGE_LABELS[manageKey]}</th>`;
      })
      .join('');
    const subHeaders = manageKeys
      .flatMap((manageKey) =>
        MANAGE_DETAIL_COLUMNS[manageKey].map(
          ({ label, key }) =>
            `<th scope="col" class="facility-stats-table__manage-col${key === 'subtotal' ? ' facility-stats-table__manage-col--subtotal' : ''}">${label}</th>`
        )
      )
      .join('');

    head.innerHTML = `
      <tr>
        <th rowspan="2" scope="col" class="facility-stats-table__kind-header">시설구분</th>
        <th rowspan="2" scope="col">내진현황</th>
        <th rowspan="2" scope="col">개소</th>
        ${groupHeaders}
      </tr>
      <tr>
        ${subHeaders}
      </tr>`;

    if (colgroup) {
      const detailColCount = manageKeys.reduce(
        (count, manageKey) => count + MANAGE_DETAIL_COLUMNS[manageKey].length,
        0
      );
      colgroup.innerHTML = `
        <col class="facility-stats-table__kind">
        <col class="facility-stats-table__type">
        <col class="facility-stats-table__count">
        ${Array(detailColCount).fill('<col>').join('')}`;
    }

    const facilityRows = [
      { key: 'total', label: '총계' },
      ...FACILITY_ROWS,
    ];
    const seismicRows = [...SEISMIC_ROWS, { key: 'subtotal', label: '소계' }];
    const getFacilitySeismicCount = (facilityKey, seismicKey) => {
      const sourceRows =
        facilityKey === 'total'
          ? FACILITY_STATS_SEISMIC_BY_TYPE
          : FACILITY_STATS_SEISMIC_BY_TYPE.filter(
              (row) => (FACILITY_STATS_FACILITY_KEY_BY_LABEL[row.label] || 'other') === facilityKey
            );
      return sourceRows.reduce((sum, row) => {
        if (seismicKey === 'subtotal') return sum + sumSeismic(row.seismic);
        return sum + (row.seismic[seismicKey] ?? 0);
      }, 0);
    };

    const distributeByOverviewManage = (facilityKey, total) => {
      const overviewTotals = Object.fromEntries(manageKeys.map((key) => [key, 0]));
      FACILITY_STATS_OVERVIEW.groups.forEach((group) => {
        const values = group.facilities[facilityKey] ?? {};
        manageKeys.forEach((manageKey) => {
          overviewTotals[manageKey] += getManageTotal(values, manageKey);
        });
      });
      const overviewTotal = manageKeys.reduce((sum, manageKey) => sum + overviewTotals[manageKey], 0);
      let used = 0;
      return Object.fromEntries(
        manageKeys.map((manageKey, index) => {
          const count =
            index === manageKeys.length - 1 || !overviewTotal
              ? total - used
              : Math.round((total * overviewTotals[manageKey]) / overviewTotal);
          used += count;
          return [manageKey, count];
        })
      );
    };

    const renderDetailCells = (facilityKey, count) => {
      const manageTotals = distributeByOverviewManage(facilityKey, count);
      return manageKeys
        .flatMap((manageKey) => {
          const detail = expandManageDetail(manageTotals[manageKey] ?? 0, manageKey);
          return MANAGE_DETAIL_COLUMNS[manageKey].map(({ key }) => {
            const subtotalClass =
              key === 'subtotal' ? ' class="facility-stats-table__manage-col--subtotal"' : '';
            return `<td${subtotalClass}>${formatCount(detail[key] ?? 0)}</td>`;
          });
        })
        .join('');
    };

    tbody.innerHTML = facilityRows
      .map((facility) =>
        seismicRows
          .map(({ key, label }, index) => {
            const count = getFacilitySeismicCount(facility.key, key);
            const distributeKey = facility.key === 'total' ? 'other' : facility.key;
            return `
            <tr${key === 'subtotal' ? ' class="facility-stats-table__subtotal-row"' : ''}>
              ${
                index === 0
                  ? `<th rowspan="${seismicRows.length}" scope="rowgroup" class="facility-stats-table__group facility-stats-table__kind-group">${facility.label}</th>`
                  : ''
              }
              <td>${label}</td>
              <td>${formatCount(count)}</td>
              ${renderDetailCells(distributeKey, count)}
            </tr>`;
          })
          .join('')
      )
      .join('');
  }

  function escapeCsv(text) {
    const value = String(text ?? '')
      .replace(/\u00a0/g, '')
      .trim();
    if (/[",\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  function tableRowToCsvCells(row) {
    const cells = [];
    [...row.cells].forEach((cell) => {
      const text = cell.textContent.replace(/\u00a0/g, '').trim();
      const colspan = cell.colSpan || 1;
      for (let index = 0; index < colspan; index += 1) {
        cells.push(escapeCsv(index === 0 ? text : ''));
      }
    });
    return cells;
  }

  function downloadTableExcel() {
    const table = document.getElementById('facStatsTable');
    if (!table) return;

    const filters = getFilters();
    const majorLabel = MAJOR_TITLES[filters.major] || '시설물통계';
    const middleLabel = filters.middle === 'detail' ? '상세' : '총괄';
    const lines = [
      ...table.querySelectorAll('thead tr'),
      ...table.querySelectorAll('tbody tr'),
    ].map((row) => tableRowToCsvCells(row).join(','));

    const csv = `\uFEFF${lines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `시설물통계_${majorLabel}_${middleLabel}_${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function finalizeFacStatsTable() {
    const tbody = document.getElementById('facStatsTableBody');
    const table = document.getElementById('facStatsTable');
    if (!tbody || !table) return;

    const hasRowspan = !!tbody.querySelector('th[rowspan]');
    const dataTrs = [...tbody.querySelectorAll('tr:not(.facility-stats-table__total-row):not(.facility-stats-table__subtotal-row)')];

    if (!hasRowspan && facStatsSortColumn >= 0) {
      const dir = facStatsSortDir === 'desc' ? -1 : 1;
      dataTrs.sort((a, b) => {
        const av = (a.cells[facStatsSortColumn]?.textContent || '').trim();
        const bv = (b.cells[facStatsSortColumn]?.textContent || '').trim();
        const an = Number(av.replace(/,/g, ''));
        const bn = Number(bv.replace(/,/g, ''));
        if (!Number.isNaN(an) && !Number.isNaN(bn) && av !== '' && bv !== '') return (an - bn) * dir;
        return av.localeCompare(bv, 'ko', { numeric: true }) * dir;
      });
      dataTrs.forEach((tr) => tbody.insertBefore(tr, tbody.querySelector('.facility-stats-table__total-row, .facility-stats-table__subtotal-row')));
    }

    if (hasRowspan) {
      dataTrs.forEach((tr) => { tr.hidden = false; });
    } else {
      dataTrs.forEach((tr) => { tr.hidden = false; });
    }

    updateResultCount();
    bindFacStatsSortHeaders(table, hasRowspan);
  }

  function updateResultCount() {
    const countEl = document.getElementById('facStatsResultCount');
    const tbody = document.getElementById('facStatsTableBody');
    if (!countEl || !tbody) return;
    const rows = tbody.querySelectorAll('tr:not(.facility-stats-table__total-row)');
    countEl.textContent = String(rows.length);
  }

  function setViewMode(mode) {
    facStatsViewMode = mode === 'manage' ? 'manage' : 'facility';
    document.querySelectorAll('.fac-stats-view-tab').forEach((tab) => {
      const active = tab.dataset.view === facStatsViewMode;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    refresh();
  }

  function bindFacStatsSortHeaders(table, hasRowspan) {
    if (hasRowspan) return;
    const head = table?.querySelector('thead');
    if (!head) return;

    head.querySelectorAll('th').forEach((th, index) => {
      const label = th.textContent.trim();
      if (!label || th.colSpan > 1 || th.rowSpan > 1) return;
      const active = facStatsSortColumn === index;
      const dirClass = active ? ` is-${facStatsSortDir}` : '';
      th.innerHTML = `<button type="button" class="system-sort${active ? ' is-active' : ''}${dirClass}" data-sort-key="${index}" aria-label="${label} 정렬"><span>${label}</span><i aria-hidden="true"></i></button>`;
    });

    head.querySelectorAll('[data-sort-key]').forEach((button) => {
      button.addEventListener('click', () => {
        const key = Number(button.getAttribute('data-sort-key'));
        if (facStatsSortColumn === key) {
          facStatsSortDir = facStatsSortDir === 'asc' ? 'desc' : 'asc';
        } else {
          facStatsSortColumn = key;
          facStatsSortDir = 'asc';
        }
        finalizeFacStatsTable();
      });
    });
  }

  function renderTable(filters) {
    const mode = MIDDLE_TABLE_MODES[filters.middle] || 'overview';

    if (filters.major === 'safety-grade') {
      const { manageKeys } = filters;
      const gradeOverview = buildGradeManageOverview(manageKeys);
      if (mode === 'detail') {
        renderOverviewDetailTable(gradeOverview, manageKeys, { groupLabel: '상태등급' });
        finalizeFacStatsTable();
        return;
      }
      renderOverviewTable(gradeOverview, manageKeys, { groupLabel: '상태등급' });
      finalizeFacStatsTable();
      return;
    }

    if (filters.major === 'safety-grade-by-kind') {
      if (mode === 'detail') {
        renderGradeByKindDetailTable();
        finalizeFacStatsTable();
        return;
      }
      renderGradeByKindOverviewTable();
      finalizeFacStatsTable();
      return;
    }

    if (filters.major === 'service-years') {
      const { manageKeys } = filters;
      const serviceYearsOverview = buildServiceYearsOverview(manageKeys);
      if (mode === 'detail') {
        renderOverviewDetailTable(serviceYearsOverview, manageKeys, { groupLabel: '공용년수' });
        finalizeFacStatsTable();
        return;
      }
      renderOverviewTable(serviceYearsOverview, manageKeys, { groupLabel: '공용년수' });
      finalizeFacStatsTable();
      return;
    }

    if (filters.major === 'seismic-performance') {
      if (mode === 'detail') {
        renderSeismicByPortTable();
        finalizeFacStatsTable();
        return;
      }
      renderSeismicTable();
      finalizeFacStatsTable();
      return;
    }

    if (filters.major === 'facility-status') {
      const { manageKeys } = filters;
      if (facStatsViewMode === 'manage') {
        renderByPortTable(manageKeys);
        finalizeFacStatsTable();
        return;
      }
      if (mode === 'detail') {
        renderOverviewDetailTable(FACILITY_STATS_OVERVIEW, manageKeys);
        finalizeFacStatsTable();
        return;
      }
      renderOverviewTable(FACILITY_STATS_OVERVIEW, manageKeys);
    }

    finalizeFacStatsTable();
  }

  function pctOfTotal(count, total) {
    if (!total) return 0;
    return Math.round((count / total) * 1000) / 10;
  }

  const BAR_CHART_AXIS_MAX = 400;
  const BAR_CHART_AXIS_STEP = 100;
  const BAR_CHART_AXIS_STEPS = BAR_CHART_AXIS_MAX / BAR_CHART_AXIS_STEP;

  function buildBarChartYAxisLabels() {
    const labels = [];
    for (let step = BAR_CHART_AXIS_STEPS; step >= 0; step -= 1) {
      labels.push(step * BAR_CHART_AXIS_STEP);
    }
    return labels;
  }

  function bindGroupedBarChartTooltips(chartRoot) {
    let floater = chartRoot.querySelector('.fac-stats-grouped-chart__floater');
    if (!floater) {
      floater = document.createElement('div');
      floater.className = 'fac-stats-grouped-chart__floater';
      floater.setAttribute('role', 'tooltip');
      floater.hidden = true;
      chartRoot.appendChild(floater);
    }

    const hide = () => {
      floater.hidden = true;
    };

    const moveFloater = (event) => {
      const bounds = chartRoot.getBoundingClientRect();
      const offset = 12;
      let left = event.clientX - bounds.left + offset;
      let top = event.clientY - bounds.top + offset;

      floater.hidden = false;
      const maxLeft = Math.max(8, bounds.width - floater.offsetWidth - 8);
      const maxTop = Math.max(8, bounds.height - floater.offsetHeight - 8);
      left = Math.max(8, Math.min(left, maxLeft));
      top = Math.max(8, Math.min(top, maxTop));

      floater.style.left = `${left}px`;
      floater.style.top = `${top}px`;
    };

    chartRoot.querySelectorAll('.fac-stats-bar-group').forEach((group) => {
      const source = group.querySelector('.fac-stats-bar-group__tooltip-source');
      if (!source) return;

      group.addEventListener('mouseenter', (event) => {
        floater.innerHTML = source.innerHTML;
        moveFloater(event);
      });
      group.addEventListener('mousemove', moveFloater);
      group.addEventListener('mouseleave', hide);
    });
  }

  function renderGroupedBarChart(groups, title, legendHtml = kindLegendHtml) {
    const container = document.getElementById('facStatsBarRows');
    const titleEl = document.getElementById('facStatsBarTitle');
    if (titleEl) titleEl.textContent = title;
    if (!container) return;

    const axisMax = BAR_CHART_AXIS_MAX;
    const yLabels = buildBarChartYAxisLabels();
    const maxSegmentCount = Math.max(...groups.map((group) => group.segments.length), 1);
    const gridLinesHtml = Array.from({ length: BAR_CHART_AXIS_STEPS }, (_, index) => {
      const topPct = (index / BAR_CHART_AXIS_STEPS) * 100;
      return `<span style="top:${topPct}%"></span>`;
    }).join('');

    const groupsHtml = groups
      .map((group) => {
        const tooltipRows = group.segments
          .filter((seg) => seg.value > 0)
          .map(
            (seg) => `
            <div class="fac-stats-bar-group__tooltip-row">
              <span>${seg.label}</span>
              <strong>${seg.value.toLocaleString('ko-KR')}</strong>
            </div>`
          )
          .join('');

        const barsHtml = group.segments
          .map((seg) => {
            const heightPct =
              axisMax && seg.value > 0 ? Math.min(100, (seg.value / axisMax) * 100) : 0;
            const minHeight = seg.value > 0 ? 2 : 0;
            const isEmpty = !seg.value;

            return `
              <div
                class="fac-stats-bar-group__bar-wrap${isEmpty ? ' is-empty' : ''}"
                style="height:${heightPct}%;min-height:${minHeight}px"
              >
                <div
                  class="fac-stats-bar-group__bar fac-stats-bar-group__bar--${seg.key}"
                  style="height:100%"
                  ${isEmpty ? 'aria-hidden="true"' : `role="img" aria-label="${seg.label} ${seg.value.toLocaleString('ko-KR')}"`}
                ></div>
              </div>`;
          })
          .join('');

        return `
          <div
            class="fac-stats-bar-group"
            role="listitem"
            aria-label="${group.label}"
            tabindex="0"
          >
            <div class="fac-stats-bar-group__bars">${barsHtml}</div>
            <div class="fac-stats-bar-group__tooltip-source" hidden>
              <p class="fac-stats-bar-group__tooltip-title">${group.label}</p>
              ${tooltipRows}
            </div>
          </div>`;
      })
      .join('');

    const labelsHtml = groups
      .map((group) => `<span class="fac-stats-grouped-chart__category">${group.label}</span>`)
      .join('');

    container.className = `fac-stats-grouped-chart${maxSegmentCount > 4 ? ' fac-stats-grouped-chart--dense' : ''}`;
    container.innerHTML = `
      ${legendHtml()}
      <div class="fac-stats-grouped-chart__body">
        <div class="fac-stats-grouped-chart__plot">
          <div class="fac-stats-grouped-chart__y-axis" aria-hidden="true">
            ${yLabels.map((label) => `<span>${label.toLocaleString('ko-KR')}</span>`).join('')}
          </div>
          <div class="fac-stats-grouped-chart__area">
            <div class="fac-stats-grouped-chart__plot-inner">
              <div class="fac-stats-grouped-chart__grid" aria-hidden="true">
                ${gridLinesHtml}
              </div>
              <div class="fac-stats-grouped-chart__groups">${groupsHtml}</div>
            </div>
            <div class="fac-stats-grouped-chart__categories">
              <div class="fac-stats-grouped-chart__categories-list">${labelsHtml}</div>
            </div>
          </div>
        </div>
      </div>`;

    bindGroupedBarChartTooltips(container);
  }

  function setChartsVisibility(show) {
    const charts = document.getElementById('facStatsCharts');
    if (!charts) return;
    charts.hidden = !show;
    if (!show) {
      charts.style.display = 'none';
      clearCharts();
      return;
    }
    charts.style.display = '';
  }

  function clearCharts() {
    const barContainer = document.getElementById('facStatsBarRows');
    const ring = document.getElementById('facStatsDonutRing');
    const totalEl = document.getElementById('facStatsDonutTotal');
    const legend = document.getElementById('facStatsDonutLegend');

    if (barContainer) {
      barContainer.className = '';
      barContainer.innerHTML = '';
    }
    if (ring) ring.style.background = '#e5e7eb';
    if (totalEl) totalEl.textContent = '0';
    if (legend) legend.innerHTML = '';
  }

  function renderBarChart(items, title) {
    const container = document.getElementById('facStatsBarRows');
    const titleEl = document.getElementById('facStatsBarTitle');
    if (titleEl) titleEl.textContent = title;
    if (!container) return;

    const max = Math.max(...items.map((item) => item.value), 1);
    container.innerHTML = items
      .map((item) => {
        const pct = pctOfTotal(item.value, items.reduce((s, i) => s + i.value, 0));
        const barPct = Math.min(100, Math.max(0, (item.value / max) * 100));
        return `
          <div class="fac-stats-bar-col" role="listitem">
            <span class="fac-stats-bar-col__meta">
              <strong>${item.value.toLocaleString('ko-KR')}</strong>
              (${pct.toFixed(1)}%)
            </span>
            <div class="fac-stats-bar-col__track" aria-hidden="true">
              <span class="fac-stats-bar-col__fill fac-stats-bar-col__fill--${item.key}" style="height:${barPct}%"></span>
            </div>
            <span class="fac-stats-bar-col__label">${item.label}</span>
          </div>`;
      })
      .join('');
  }

  function renderDonutChart(items, total, title) {
    const ring = document.getElementById('facStatsDonutRing');
    const totalEl = document.getElementById('facStatsDonutTotal');
    const legend = document.getElementById('facStatsDonutLegend');
    const titleEl = document.getElementById('facStatsDonutTitle');
    if (titleEl) titleEl.textContent = title;
    if (totalEl) totalEl.textContent = total.toLocaleString('ko-KR');

    const sum = items.reduce((s, item) => s + item.value, 0);
    if (ring) {
      if (!sum) {
        ring.style.background = '#e5e7eb';
      } else {
        let angle = 0;
        const stops = [];
        items.forEach((item) => {
          if (!item.value) return;
          const slice = (item.value / sum) * 360;
          const col =
            item.label === '미확인' ? DONUT_COLORS.gradeOther : DONUT_COLORS[item.key] || '#94a3b8';
          stops.push(`${col} ${angle}deg ${angle + slice}deg`);
          angle += slice;
        });
        ring.style.background =
          stops.length > 0 ? `conic-gradient(from -90deg, ${stops.join(', ')})` : '#e5e7eb';
      }
    }

    if (legend) {
      legend.innerHTML = items
        .map((item) => {
          const pct = pctOfTotal(item.value, sum || total);
          const color =
            item.label === '미확인' ? DONUT_COLORS.gradeOther : DONUT_COLORS[item.key] || '#8c9aac';
          return `
            <li>
              <span class="fac-stats-donut-legend__dot" style="background:${color}"></span>
              <span class="fac-stats-donut-legend__meta">
                <span class="fac-stats-donut-legend__label">${item.label}</span>
                <em class="fac-stats-donut-legend__pct">(${pct.toFixed(1)}%)</em>
              </span>
              <span class="fac-stats-donut-legend__line" aria-hidden="true"></span>
              <span class="fac-stats-donut-legend__count">${item.value.toLocaleString('ko-KR')}</span>
            </li>`;
        })
        .join('');
    }
  }

  function renderCharts(filters) {
    const showCharts = CHART_MAJORS.has(filters.major);
    setChartsVisibility(showCharts);
    if (!showCharts) return;

    if (filters.major === 'facility-status') {
      const { manageKeys } = filters;
      const facilityGroups = aggregateFacilityKindBreakdown(FACILITY_STATS_OVERVIEW, manageKeys);
      const kindItems = aggregateByKind(FACILITY_STATS_OVERVIEW, manageKeys);
      const kindTotal = kindItems.reduce((sum, item) => sum + item.value, 0);

      renderGroupedBarChart(facilityGroups, '종별통계', kindLegendHtml);
      renderDonutChart(kindItems, kindTotal, '종별통계');
      return;
    }

    if (filters.major === 'safety-grade') {
      const facilityGroups = aggregateFacilityGradeBreakdown();
      const gradeItems = aggregateByGrade();
      const gradeTotal = gradeItems.reduce((sum, item) => sum + item.value, 0);

      renderGroupedBarChart(facilityGroups, '상태등급 통계', gradeLegendHtml);
      renderDonutChart(gradeItems, gradeTotal, '상태등급 통계');
    }
  }

  function refresh() {
    const filters = getFilters();
    facStatsSortColumn = -1;
    facStatsSortDir = 'asc';
    renderTable(filters);
    renderCharts(filters);
  }

  function bindEvents() {
    document.getElementById('facStatsExcelBtn')?.addEventListener('click', downloadTableExcel);
    document.getElementById('facStatsSearchBtn')?.addEventListener('click', refresh);
    ['facStatsMajorCategory', 'facStatsMiddleCategory'].forEach((id) => {
      document.getElementById(id)?.addEventListener('change', refresh);
    });
    document.querySelectorAll('[name="manageCategory"]').forEach((el) => {
      el.addEventListener('change', (event) => onManageCategoryChange(event.target));
    });
    document.querySelectorAll('.fac-stats-view-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.view || 'facility';
        if (mode === facStatsViewMode) return;
        setViewMode(mode);
      });
    });
  }

  function init() {
    PomsSidebar.mount('#sidebar-root', { active: 'facility-stats' });

    bindEvents();
    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
