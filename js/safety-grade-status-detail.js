/**
 * 안전등급현황 상세
 */
(() => {
  const DETAIL_PAGE_SIZE = 10;
  const GENERAL_KEYS = ['mooring', 'outer', 'pier'];

  // [샘플 보정] 데이터에 항명/세부항이 없어 관리주체명이 그대로 들어오는 기관 보정
  const PORT_FALLBACK = {
    '인천지방해양수산청': { port: '인천항', subPort: '신항' },
  };

  const state = {
    selectedPort: '',
    selectedDept: '',
    selectedGrade: '',
    categories: [...GENERAL_KEYS],
    mode: 'general',
    detailPage: 1,
    detailItems: [],
    detailFiltered: [],
  };

  function $(sel) {
    return document.querySelector(sel);
  }

  function params() {
    return new URLSearchParams(window.location.search);
  }

  function managementLabel() {
    return state.selectedDept ? `${state.selectedPort}(${state.selectedDept})` : state.selectedPort;
  }

  function gradeBadge(grade) {
    return grade && grade !== '-' ? grade : '-';
  }

  function uniqueValues(items, key) {
    return [...new Set(items.map((item) => item[key]).filter(Boolean))];
  }

  function populateSelect(id, values, label, selected = '') {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = [
      `<option value="">${label}</option>`,
      ...values.map((value) => `<option value="${value}">${value}</option>`),
    ].join('');
    select.value = values.includes(selected) ? selected : '';
  }

  function getDetailItems() {
    if (!state.selectedPort) return [];
    const portData = getPortDetails(state.selectedPort);
    const fb = PORT_FALLBACK[state.selectedPort] || {};
    const fix = (v, key) => (!v || v === state.selectedPort) ? (fb[key] || '-') : v;
    return state.categories.flatMap((cat) => (portData[cat] || []).map((item) => ({
      management: managementLabel(),
      port: fix(item.port || item.subPort, 'port'),
      subPort: fix(item.subPort, 'subPort'),
      category: item.category || '-',
      name: item.name || '-',
      grade: item.grade || '-',
      count: item.count || 1,
    })));
  }

  function syncDetailFilters(items, presetGrade = '') {
    populateSelect('gradeModalPort', uniqueValues(items, 'port'), '\uC804\uCCB4', '');
    populateSelect('gradeModalSubPort', uniqueValues(items, 'subPort'), '\uC804\uCCB4', '');
    populateSelect('gradeModalCategory', uniqueValues(items, 'category'), '\uC804\uCCB4', '');
    populateSelect('gradeModalGrade', uniqueValues(items, 'grade'), '\uC804\uCCB4', presetGrade);
    const name = document.getElementById('gradeModalName');
    if (name) name.value = '';
  }

  function filterDetailItems(items) {
    const port = $('#gradeModalPort')?.value || '';
    const subPort = $('#gradeModalSubPort')?.value || '';
    const category = $('#gradeModalCategory')?.value || '';
    const grade = $('#gradeModalGrade')?.value || '';
    const name = ($('#gradeModalName')?.value || '').trim();

    return items.filter((item) => {
      if (port && item.port !== port) return false;
      if (subPort && item.subPort !== subPort) return false;
      if (category && item.category !== category) return false;
      if (grade && item.grade !== grade) return false;
      if (name && !item.name.includes(name)) return false;
      return true;
    });
  }

  function setResultCount(count) {
    const el = document.getElementById('gradeDetailResultCount');
    if (el) el.textContent = Number(count || 0).toLocaleString();
  }

  function renderDetailPagination(totalRows) {
    const nav = document.getElementById('gradeDetailPagination');
    if (!nav) return;

    const totalPages = Math.max(1, Math.ceil(totalRows / DETAIL_PAGE_SIZE));
    if (state.detailPage > totalPages) state.detailPage = totalPages;
    if (state.detailPage < 1) state.detailPage = 1;

    const page = state.detailPage;
    const windowSize = 5;
    let start = Math.max(1, page - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);

    const pages = [];
    for (let i = start; i <= end; i += 1) pages.push(i);

    const arrowIcon = '<img src="assets/main/facility-search/arrow-right.svg" alt="" width="14" height="14">';
    const doubleIcon = '<img src="assets/main/facility-search/arrow-double-right.svg" alt="" width="14" height="14">';

    nav.hidden = totalRows === 0;
    nav.innerHTML = `
      <button type="button" class="pagination__btn" data-page-move="first" ${page <= 1 ? 'disabled' : ''} aria-label="\uCCAB \uD398\uC774\uC9C0">${doubleIcon}</button>
      <button type="button" class="pagination__btn" data-page-move="prev" ${page <= 1 ? 'disabled' : ''} aria-label="\uC774\uC804 \uD398\uC774\uC9C0">${arrowIcon}</button>
      ${pages.map((p) => `<button type="button" class="pagination__btn${p === page ? ' is-active' : ''}" data-page="${p}"${p === page ? ' aria-current="page"' : ''}>${p}</button>`).join('')}
      <button type="button" class="pagination__btn" data-page-move="next" ${page >= totalPages ? 'disabled' : ''} aria-label="\uB2E4\uC74C \uD398\uC774\uC9C0">${arrowIcon}</button>
      <button type="button" class="pagination__btn" data-page-move="last" ${page >= totalPages ? 'disabled' : ''} aria-label="\uB9C8\uC9C0\uB9C9 \uD398\uC774\uC9C0">${doubleIcon}</button>
    `;

    nav.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.detailPage = Number(btn.getAttribute('data-page'));
        renderDetailTable();
      });
    });
    nav.querySelector('[data-page-move="first"]')?.addEventListener('click', () => {
      if (page <= 1) return;
      state.detailPage = 1;
      renderDetailTable();
    });
    nav.querySelector('[data-page-move="prev"]')?.addEventListener('click', () => {
      if (page <= 1) return;
      state.detailPage = Math.max(1, page - 1);
      renderDetailTable();
    });
    nav.querySelector('[data-page-move="next"]')?.addEventListener('click', () => {
      if (page >= totalPages) return;
      state.detailPage = Math.min(totalPages, page + 1);
      renderDetailTable();
    });
    nav.querySelector('[data-page-move="last"]')?.addEventListener('click', () => {
      if (page >= totalPages) return;
      state.detailPage = totalPages;
      renderDetailTable();
    });
  }

  function renderDetailTable() {
    const tbody = $('#detailTableBody');
    if (!tbody) return;

    const filtered = state.detailFiltered;
    setResultCount(filtered.length);
    renderDetailPagination(filtered.length);

    const start = (state.detailPage - 1) * DETAIL_PAGE_SIZE;
    const pageRows = filtered.slice(start, start + DETAIL_PAGE_SIZE);

    tbody.innerHTML = pageRows.map((item, index) => `
      <tr>
        <td class="col-no">${start + index + 1}</td>
        <td>${item.management}</td>
        <td>${item.port}</td>
        <td>${item.subPort}</td>
        <td>${item.category}</td>
        <td class="is-left">${item.name}</td>
        <td>${gradeBadge(item.grade)}</td>
      </tr>
    `).join('') || '<tr><td colspan="7">\uC870\uD68C\uB41C \uC0C1\uC138 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</td></tr>';
  }

  function searchDetail() {
    state.detailFiltered = filterDetailItems(state.detailItems);
    state.detailPage = 1;
    renderDetailTable();
  }

  function resetDetail() {
    syncDetailFilters(state.detailItems, '');
    searchDetail();
  }

  function escapeCsv(value) {
    const text = String(value ?? '');
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  }

  function downloadDetailExcel() {
    const headers = [
      'No', '\uAD00\uB9AC\uC8FC\uCCB4', '\uD56D\uBA85', '\uC138\uBD80\uD56D', '\uC2DC\uC124\uBB3C \uAD6C\uBD84', '\uC2DC\uC124\uBB3C\uBA85', '\uC0C1\uD0DC\uB4F1\uAE09',
    ];
    const lines = state.detailFiltered.map((item, index) => [
      index + 1,
      item.management,
      item.port,
      item.subPort,
      item.category,
      item.name,
      item.grade,
    ].map(escapeCsv).join(','));
    const csv = `\uFEFF${headers.map(escapeCsv).join(',')}\n${lines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `\uC548\uC804\uB4F1\uAE09\uD604\uD669_\uC0C1\uC138_${managementLabel() || ''}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function loadFromQuery() {
    const q = params();
    state.selectedPort = q.get('port') || '';
    state.selectedDept = q.get('dept') || '';
    state.selectedGrade = q.get('grade') || '';
    state.mode = q.get('mode') === 'safety' ? 'safety' : 'general';

    const cats = (q.get('cats') || '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    if (state.mode === 'safety') {
      state.categories = ['safety'];
    } else if (cats.length) {
      state.categories = cats.filter((cat) => GENERAL_KEYS.includes(cat));
      if (!state.categories.length) state.categories = [...GENERAL_KEYS];
    } else {
      state.categories = [...GENERAL_KEYS];
    }

    const title = document.getElementById('detailTitleText');
    const crumb = document.getElementById('gradeDetailCrumb');
    if (title) title.textContent = managementLabel() || '';
    if (crumb) crumb.textContent = managementLabel() || '\uC0C1\uC138\uD604\uD669';

    if (!state.selectedPort) {
      state.detailItems = [];
      state.detailFiltered = [];
      renderDetailTable();
      return;
    }

    state.detailItems = getDetailItems();
    syncDetailFilters(state.detailItems, state.selectedGrade);
    state.detailFiltered = filterDetailItems(state.detailItems);
    state.detailPage = 1;
    renderDetailTable();
  }

  function init() {
    PomsSidebar.mount('#sidebar-root', { active: 'safety-grade' });

    document.getElementById('gradeDetailSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      searchDetail();
    });
    document.getElementById('gradeDetailSearchBtn')?.addEventListener('click', searchDetail);
    document.getElementById('gradeDetailResetBtn')?.addEventListener('click', resetDetail);
    document.getElementById('gradeDetailExcelBtn')?.addEventListener('click', downloadDetailExcel);

    loadFromQuery();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();