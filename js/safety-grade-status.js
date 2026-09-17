/**
 * 안전등급현황
 */
(() => {
  const CAT_MAP = {
    mooring: 'catMooring',
    outer: 'catOuter',
    pier: 'catPier',
    safety: 'catSafety',
  };

  const GENERAL_KEYS = ['mooring', 'outer', 'pier'];

  // [정비과/개발과 분리 샘플] 부산청·인천청은 부서별 2행으로 표출
  // ※ 실제 적용 시에는 데이터(GRADE_SUMMARY_*)에 dept 필드를 넣고 이 블록은 제거
  const DEPT_SPLIT = {
    '부산지방해양수산청': ['정비과', '개발과'],
    '인천지방해양수산청': ['정비과', '개발과'],
  };
  const DEPT_SAMPLE = {
    general: { '인천지방해양수산청': { A: 39, B: 60, C: 26, D: 8, E: 1, other: 3 } },
    safety: { '인천지방해양수산청': { good: 41, normal: 22, poor: 9 } },
  };

  // 샘플 표가 길어져서 제외하는 관리주체 (데이터 파일 정리 시 이 목록도 제거)
  const SAMPLE_EXCLUDE = ['울릉군', '경상북도', '마산지방해양수산청', '동해지방해양수산청'];

  function splitByDept(rows, mode) {
    const src = rows.filter((r) => !SAMPLE_EXCLUDE.includes(r.port));
    Object.keys(DEPT_SPLIT).forEach((port) => {
      if (!src.some((r) => r.port === port) && DEPT_SAMPLE[mode]?.[port]) {
        const idx = src.findIndex((r) => r.port === '부산지방해양수산청');
        src.splice(idx >= 0 ? idx + 1 : src.length, 0, { port, ...DEPT_SAMPLE[mode][port] });
      }
    });
    const out = [];
    src.forEach((row) => {
      const depts = DEPT_SPLIT[row.port];
      if (!depts) { out.push(row); return; }
      const keys = Object.keys(row).filter((k) => typeof row[k] === 'number');
      const first = { port: row.port, dept: depts[0] };
      const second = { port: row.port, dept: depts[1] };
      keys.forEach((k) => {
        first[k] = Math.round(row[k] * 0.6);
        second[k] = row[k] - first[k];
      });
      out.push(first, second);
    });
    return out;
  }

  function rowKey(row) {
    return row.dept ? `${row.port}|${row.dept}` : row.port;
  }

  function rowLabel(row) {
    return row.dept ? `${row.port}(${row.dept})` : row.port;
  }

  const state = {
    mode: 'general',
    categories: ['mooring', 'outer', 'pier'],
    selectedPort: null,
    selectedGrade: '',
    summaryRows: splitByDept(GRADE_SUMMARY_GENERAL, 'general'),
  };

  function $(sel) {
    return document.querySelector(sel);
  }

  function isSafetyMode() {
    return $('#catSafety')?.checked === true;
  }

  function isEmptyMode() {
    return !isSafetyMode() && getCheckedCategories().length === 0;
  }

  function getCheckedCategories() {
    if (isSafetyMode()) return ['safety'];
    return GENERAL_KEYS.filter((key) => document.getElementById(CAT_MAP[key])?.checked);
  }

  function setResultCount(count) {
    const el = document.getElementById('gradeResultCount');
    if (el) el.textContent = Number(count || 0).toLocaleString();
  }

  function applyCategoryState() {
    if (isSafetyMode()) {
      GENERAL_KEYS.forEach((key) => {
        const el = document.getElementById(CAT_MAP[key]);
        if (el) el.checked = false;
      });
      state.mode = 'safety';
      state.categories = ['safety'];
      state.summaryRows = splitByDept(GRADE_SUMMARY_SAFETY, 'safety');
      return;
    }

    state.categories = GENERAL_KEYS.filter((key) => document.getElementById(CAT_MAP[key])?.checked);

    if (state.categories.length === 0) {
      state.mode = 'empty';
      state.summaryRows = [];
      return;
    }

    state.mode = 'general';
    state.summaryRows = splitByDept(GRADE_SUMMARY_GENERAL, 'general');
  }

  function onCategoryChange(target) {
    const safetyEl = $('#catSafety');

    if (target.id === 'catSafety' && target.checked) {
      GENERAL_KEYS.forEach((key) => {
        const el = document.getElementById(CAT_MAP[key]);
        if (el) el.checked = false;
      });
    } else if (target.id !== 'catSafety') {
      if (safetyEl) safetyEl.checked = false;
    }
  }

  function runSearch() {
    applyCategoryState();
    state.selectedPort = null;
    state.selectedGrade = '';
    renderSummary();
  }

  function openDetail(port, grade = '', dept = '') {
    if (!port) return;
    const cats = getCheckedCategories().join(',');
    const mode = isSafetyMode() ? 'safety' : 'general';
    const q = new URLSearchParams();
    q.set('port', port);
    if (dept) q.set('dept', dept);
    if (grade) q.set('grade', grade);
    q.set('cats', cats);
    q.set('mode', mode);
    location.href = `safety-grade-status-detail.html?${q.toString()}`;
  }

  function calcGeneralTotal(rows) {
    return rows.reduce(
      (acc, row) => {
        acc.A += row.A;
        acc.B += row.B;
        acc.C += row.C;
        acc.D += row.D;
        acc.E += row.E;
        acc.other += row.other;
        acc.total += row.A + row.B + row.C + row.D + row.E + row.other;
        return acc;
      },
      { A: 0, B: 0, C: 0, D: 0, E: 0, other: 0, total: 0 },
    );
  }

  function calcSafetyTotal(rows) {
    return rows.reduce(
      (acc, row) => {
        acc.good += row.good;
        acc.normal += row.normal;
        acc.poor += row.poor;
        acc.total += row.good + row.normal + row.poor;
        return acc;
      },
      { good: 0, normal: 0, poor: 0, total: 0 },
    );
  }

  function renderSummaryHead() {
    const title = $('#summaryTitle');
    const note = $('#safetyGradeNote');
    const head = $('#summaryTableHead');

    if (isEmptyMode()) {
      if (title) title.textContent = '관리주체별 상태등급 현황';
      note?.setAttribute('hidden', '');
      if (head) {
        head.innerHTML = `
          <tr>
            <th scope="col" rowspan="2">관리주체</th>
            <th scope="colgroup" colspan="6">상태등급</th>
            <th scope="col" rowspan="2">계</th>
          </tr>
          <tr>
            <th scope="col">A 등급</th>
            <th scope="col">B 등급</th>
            <th scope="col">C 등급</th>
            <th scope="col">D 등급</th>
            <th scope="col">E 등급</th>
            <th scope="col">미부여</th>
          </tr>
        `;
      }
    } else if (isSafetyMode()) {
      if (title) title.textContent = '관리주체별 상태등급 현황 (안전시설)';
      note?.removeAttribute('hidden');
      if (head) {
        head.innerHTML = `
          <tr>
            <th scope="col" rowspan="2">관리주체</th>
            <th scope="colgroup" colspan="3">상태등급</th>
            <th scope="col" rowspan="2">계</th>
          </tr>
          <tr>
            <th scope="col">양호</th>
            <th scope="col">보통</th>
            <th scope="col">불량</th>
          </tr>
        `;
      }
    } else {
      if (title) title.textContent = '관리주체별 상태등급 현황 (일반시설)';
      note?.setAttribute('hidden', '');
      if (head) {
        head.innerHTML = `
          <tr>
            <th scope="col" rowspan="2">관리주체</th>
            <th scope="colgroup" colspan="6">상태등급</th>
            <th scope="col" rowspan="2">계</th>
          </tr>
          <tr>
            <th scope="col">A 등급</th>
            <th scope="col">B 등급</th>
            <th scope="col">C 등급</th>
            <th scope="col">D 등급</th>
            <th scope="col">E 등급</th>
            <th scope="col">미부여</th>
          </tr>
        `;
      }
    }
  }

  function renderSummary() {
    renderSummaryHead();
    const tbody = $('#summaryTableBody');
    const tfoot = $('#summaryTableFoot');
    if (!tbody || !tfoot) return;

    if (isEmptyMode()) {
      tbody.innerHTML = '<tr><td colspan="8" class="grade-empty-cell">항목구분을 선택해 주세요.</td></tr>';
      tfoot.innerHTML = '';
      setResultCount(0);
      return;
    }

    const rows = state.summaryRows;
    setResultCount(rows.length);

    tbody.innerHTML = rows.map((row) => {
      const selected = state.selectedPort === rowKey(row) ? ' is-selected' : '';
      const deptAttr = row.dept ? ` data-dept="${row.dept}"` : '';
      if (isSafetyMode()) {
        const total = row.good + row.normal + row.poor;
        return `
          <tr class="is-clickable${selected}" data-port="${row.port}"${deptAttr}>
            <td class="col-port" data-grade-all>${rowLabel(row)}</td>
            <td class="grade-click-cell" data-grade="양호">${row.good}</td>
            <td class="grade-click-cell" data-grade="보통">${row.normal}</td>
            <td class="grade-click-cell" data-grade="불량">${row.poor}</td>
            <td class="grade-click-cell" data-grade-all>${total}</td>
          </tr>
        `;
      }
      const total = row.A + row.B + row.C + row.D + row.E + row.other;
      return `
        <tr class="is-clickable${selected}" data-port="${row.port}"${deptAttr}>
          <td class="col-port" data-grade-all>${rowLabel(row)}</td>
          <td class="grade-click-cell" data-grade="A">${row.A}</td>
          <td class="grade-click-cell" data-grade="B">${row.B}</td>
          <td class="grade-click-cell" data-grade="C">${row.C}</td>
          <td class="grade-click-cell" data-grade="D">${row.D}</td>
          <td class="grade-click-cell" data-grade="E">${row.E}</td>
          <td class="grade-click-cell" data-grade="기타">${row.other}</td>
          <td class="grade-click-cell" data-grade-all>${total}</td>
        </tr>
      `;
    }).join('');

    if (isSafetyMode()) {
      const t = calcSafetyTotal(rows);
      tfoot.innerHTML = `
        <tr class="grade-total-row">
          <td class="col-port">계</td>
          <td>${t.good}</td>
          <td>${t.normal}</td>
          <td>${t.poor}</td>
          <td>${t.total}</td>
        </tr>
      `;
    } else {
      const t = calcGeneralTotal(rows);
      tfoot.innerHTML = `
        <tr class="grade-total-row">
          <td class="col-port">계</td>
          <td>${t.A}</td>
          <td>${t.B}</td>
          <td>${t.C}</td>
          <td>${t.D}</td>
          <td>${t.E}</td>
          <td>${t.other}</td>
          <td>${t.total}</td>
        </tr>
      `;
    }

    tbody.querySelectorAll('[data-grade], [data-grade-all]').forEach((cell) => {
      cell.addEventListener('click', () => {
        const tr = cell.closest('tr[data-port]');
        if (!tr) return;
        const grade = cell.hasAttribute('data-grade-all') ? '' : (cell.getAttribute('data-grade') || '');
        openDetail(tr.dataset.port, grade, tr.dataset.dept || '');
      });
    });
  }

  function escapeCsv(value) {
    const text = String(value ?? '');
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  }

  function downloadCsv(filename, headers, lines) {
    const csv = `\uFEFF${headers.map(escapeCsv).join(',')}\n${lines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadSummaryExcel() {
    const rows = state.summaryRows;
    if (isSafetyMode()) {
      const headers = ['관리주체', '양호', '보통', '불량', '계'];
      const lines = rows.map((row) => [
        rowLabel(row),
        row.good,
        row.normal,
        row.poor,
        row.good + row.normal + row.poor,
      ].map(escapeCsv).join(','));
      downloadCsv('안전등급현황_안전시설', headers, lines);
      return;
    }

    const headers = ['관리주체', 'A', 'B', 'C', 'D', 'E', '기타', '계'];
    const lines = rows.map((row) => [
      rowLabel(row),
      row.A,
      row.B,
      row.C,
      row.D,
      row.E,
      row.other,
      row.A + row.B + row.C + row.D + row.E + row.other,
    ].map(escapeCsv).join(','));
    downloadCsv('안전등급현황_일반시설', headers, lines);
  }

  function init() {
    PomsSidebar.mount('#sidebar-root', { active: 'safety-grade' });

    Object.entries(CAT_MAP).forEach(([, id]) => {
      const el = document.getElementById(id);
      el?.addEventListener('change', (e) => onCategoryChange(e.target));
    });

    document.getElementById('gradeSearchBtn')?.addEventListener('click', runSearch);
    document.getElementById('gradeExcelBtn')?.addEventListener('click', downloadSummaryExcel);

    applyCategoryState();
    renderSummary();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
