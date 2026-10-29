/**
 * 보수보강 실적 — 관련 점검진단 선택 모달
 */
(function () {
  const RELATED_INSPECTIONS = [
    {
      id: 1,
      agency: '경상북도',
      port: '포항항',
      subPort: '남방파제',
      facilityType: '외곽시설',
      facilityName: '남방파제',
      inspectionDate: '2022-10-30',
      periodStart: '2022-05-19',
      periodEnd: '2022-10-30',
      inspectionType: '정밀안전점검',
      grade: 'B등급',
      surveyAgency: '한국구조물안전연구원',
      defectCategory: '중대결함',
      defectType: '시설물의 철근 콘크리트의 염해',
      defectPart: '상부슬래브',
    },
    {
      id: 2,
      agency: '경상북도',
      port: '포항항',
      subPort: '남방파제',
      facilityType: '외곽시설',
      facilityName: '남방파제',
      inspectionDate: '2024-07-03',
      periodStart: '2024-07-03',
      periodEnd: '2024-07-03',
      inspectionType: '정기안전점검(하반기)',
      grade: 'B등급',
      surveyAgency: '경상북도(자체점검)',
      defectCategory: '중대결함',
      defectType: '시설물의 철근 콘크리트의 염해',
      defectPart: '상부슬래브',
    },
    {
      id: 3,
      agency: '경상북도',
      port: '포항항',
      subPort: '남방파제',
      facilityType: '외곽시설',
      facilityName: '남방파제',
      inspectionDate: '2024-10-22',
      periodStart: '2024-10-22',
      periodEnd: '2024-10-22',
      inspectionType: '정기안전점검(상반기)',
      grade: 'B등급',
      surveyAgency: '경상북도(자체점검)',
      defectCategory: '중대결함',
      defectType: '시설물의 철근 콘크리트의 염해',
      defectPart: '상부슬래브',
    },
    {
      id: 4,
      agency: '경상북도',
      port: '포항항',
      subPort: '남방파제',
      facilityType: '외곽시설',
      facilityName: '남방파제',
      inspectionDate: '2021-08-20',
      periodStart: '2021-01-01',
      periodEnd: '2021-08-20',
      inspectionType: '정밀안전진단',
      grade: 'C등급',
      surveyAgency: '동해엔지니어링',
      defectCategory: '중대결함',
      defectType: '시설물의 철근 콘크리트의 염해',
      defectPart: '상부슬래브',
    },
    {
      id: 5,
      agency: '부산광역시',
      port: '부산항',
      subPort: '북항',
      facilityType: '외곽시설',
      facilityName: '북방파제',
      inspectionDate: '2023-06-15',
      periodStart: '2023-06-15',
      periodEnd: '2023-06-15',
      inspectionType: '정기안전점검(상반기)',
      grade: 'A등급',
      surveyAgency: '부산시설공단',
      defectCategory: '중대결함',
      defectType: '시설물의 철근 콘크리트의 염해',
      defectPart: '상부슬래브',
    },
    {
      id: 6,
      agency: '여수광양항만공사',
      port: '광양항',
      subPort: '광양항',
      facilityType: '계류시설',
      facilityName: '컨테이너부두',
      inspectionDate: '2022-11-10',
      periodStart: '2022-03-01',
      periodEnd: '2022-11-10',
      inspectionType: '정밀안전점검',
      grade: 'B등급',
      surveyAgency: '한국항만기술',
      defectCategory: '중대결함',
      defectType: '시설물의 철근 콘크리트의 염해',
      defectPart: '상부슬래브',
    },
    {
      id: 7,
      agency: '경상북도',
      port: '포항항',
      subPort: '남방파제',
      facilityType: '외곽시설',
      facilityName: '남방파제',
      inspectionDate: '2023-03-18',
      periodStart: '2023-03-18',
      periodEnd: '2023-03-18',
      inspectionType: '정기안전점검(상반기)',
      grade: 'B등급',
      surveyAgency: '경상북도(자체점검)',
      defectCategory: '일반결함',
      defectType: '콘크리트 표면 균열',
      defectPart: '케이슨',
    },
    {
      id: 8,
      agency: '경상북도',
      port: '포항항',
      subPort: '남방파제',
      facilityType: '외곽시설',
      facilityName: '남방파제',
      inspectionDate: '2023-09-12',
      periodStart: '2023-09-12',
      periodEnd: '2023-09-12',
      inspectionType: '정기안전점검(하반기)',
      grade: 'B등급',
      surveyAgency: '경상북도(자체점검)',
      defectCategory: '일반결함',
      defectType: '피복 탈락',
      defectPart: '상부슬래브',
    },
    {
      id: 9,
      agency: '부산광역시',
      port: '부산항',
      subPort: '북항',
      facilityType: '외곽시설',
      facilityName: '남방파제',
      inspectionDate: '2022-04-08',
      periodStart: '2022-04-01',
      periodEnd: '2022-04-08',
      inspectionType: '긴급점검',
      grade: 'C등급',
      surveyAgency: '한국구조물안전연구원',
      defectCategory: '중대결함',
      defectType: '철근 노출',
      defectPart: '본체',
    },
    {
      id: 10,
      agency: '경상북도',
      port: '포항항',
      subPort: '남방파제',
      facilityType: '외곽시설',
      facilityName: '남방파제',
      inspectionDate: '2020-12-15',
      periodStart: '2020-06-01',
      periodEnd: '2020-12-15',
      inspectionType: '정밀안전점검',
      grade: 'B등급',
      surveyAgency: '한국항만기술',
      defectCategory: '중대결함',
      defectType: '시설물의 철근 콘크리트의 염해',
      defectPart: '상부슬래브',
    },
    {
      id: 11,
      agency: '경상북도',
      port: '포항항',
      subPort: '남방파제',
      facilityType: '외곽시설',
      facilityName: '남방파제',
      inspectionDate: '2019-11-20',
      periodStart: '2019-05-01',
      periodEnd: '2019-11-20',
      inspectionType: '정밀안전진단',
      grade: 'C등급',
      surveyAgency: '동해엔지니어링',
      defectCategory: '중대결함',
      defectType: '단면 손상',
      defectPart: '케이슨',
    },
    {
      id: 12,
      agency: '여수광양항만공사',
      port: '여수항',
      subPort: '남항',
      facilityType: '계류시설',
      facilityName: '남항안벽',
      inspectionDate: '2024-02-14',
      periodStart: '2024-02-14',
      periodEnd: '2024-02-14',
      inspectionType: '정기안전점검(상반기)',
      grade: 'A등급',
      surveyAgency: '여수광양항만공사',
      defectCategory: '일반결함',
      defectType: '도장 열화',
      defectPart: '계선주',
    },
    {
      id: 13,
      agency: '부산광역시',
      port: '부산항',
      subPort: '북항',
      facilityType: '외곽시설',
      facilityName: '북방파제',
      inspectionDate: '2021-05-30',
      periodStart: '2021-01-10',
      periodEnd: '2021-05-30',
      inspectionType: '정밀안전점검',
      grade: 'B등급',
      surveyAgency: '한국구조물안전연구원',
      defectCategory: '중대결함',
      defectType: '시설물의 철근 콘크리트의 염해',
      defectPart: '본체',
    },
    {
      id: 14,
      agency: '경상북도',
      port: '포항항',
      subPort: '남방파제',
      facilityType: '외곽시설',
      facilityName: '남방파제',
      inspectionDate: '2025-03-05',
      periodStart: '2025-03-05',
      periodEnd: '2025-03-05',
      inspectionType: '정기안전점검(상반기)',
      grade: 'B등급',
      surveyAgency: '경상북도(자체점검)',
      defectCategory: '일반결함',
      defectType: '표면 마모',
      defectPart: '상부슬래브',
    },
    {
      id: 15,
      agency: '경상북도',
      port: '포항항',
      subPort: '남방파제',
      facilityType: '외곽시설',
      facilityName: '남방파제',
      inspectionDate: '2025-09-18',
      periodStart: '2025-09-18',
      periodEnd: '2025-09-18',
      inspectionType: '정기안전점검(하반기)',
      grade: 'B등급',
      surveyAgency: '경상북도(자체점검)',
      defectCategory: '중대결함',
      defectType: '시설물의 철근 콘크리트의 염해',
      defectPart: '상부슬래브',
    },
  ];

  let filteredItems = [...RELATED_INSPECTIONS];
  const paging = { page: 1, pageSize: 10 };

  let targetInputId = 'repairRelatedInspection';
  let selectCallback = null;

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatRelatedLabel(item) {
    if (item.periodStart && item.periodEnd && item.periodStart !== item.periodEnd) {
      return `${item.inspectionType} (${item.periodStart} ~ ${item.periodEnd})`;
    }
    return `${item.inspectionType} (${item.inspectionDate})`;
  }

  function getSearchFilters() {
    return {
      agency: document.getElementById('repairRelatedAgency')?.value.trim() || '',
      port: document.getElementById('repairRelatedPort')?.value.trim() || '',
      subPort: document.getElementById('repairRelatedSubPort')?.value.trim() || '',
      facilityType: document.getElementById('repairRelatedFacilityType')?.value.trim() || '',
      facilityName: document.getElementById('repairRelatedFacilityName')?.value.trim() || '',
    };
  }

  function filterItems(filters) {
    return RELATED_INSPECTIONS.filter((item) => {
      if (filters.agency && item.agency !== filters.agency) return false;
      if (filters.port && item.port !== filters.port) return false;
      if (filters.subPort && item.subPort !== filters.subPort) return false;
      if (filters.facilityType && item.facilityType !== filters.facilityType) return false;
      if (filters.facilityName && !item.facilityName.includes(filters.facilityName)) return false;
      return true;
    });
  }

  function getTotalPages() {
    return Math.max(1, Math.ceil(filteredItems.length / paging.pageSize));
  }

  function renderRelatedPagination() {
    const container = document.getElementById('repairRelatedPagination');
    if (!container) return;

    if (globalThis.PomsPaging?.renderPagination) {
      globalThis.PomsPaging.renderPagination(container, paging, filteredItems.length, () => {
        renderRelatedList();
      });
      return;
    }

    const totalPages = getTotalPages();
    const maxButtons = 5;
    const startPage = Math.max(1, Math.min(paging.page - 2, totalPages - maxButtons + 1));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);
    const pages = [];
    for (let i = startPage; i <= endPage; i += 1) pages.push(i);

    container.innerHTML = `
      <button type="button" class="pagination__btn" data-page-move="first" aria-label="첫 페이지" ${paging.page === 1 ? 'disabled' : ''}></button>
      <button type="button" class="pagination__btn" data-page-move="prev" aria-label="이전 페이지" ${paging.page === 1 ? 'disabled' : ''}></button>
      ${pages
        .map(
          (n) =>
            `<button type="button" class="pagination__btn${n === paging.page ? ' is-active' : ''}" data-page="${n}" aria-label="${n}페이지" aria-current="${n === paging.page ? 'page' : 'false'}">${n}</button>`
        )
        .join('')}
      <button type="button" class="pagination__btn" data-page-move="next" aria-label="다음 페이지" ${paging.page === totalPages ? 'disabled' : ''}></button>
      <button type="button" class="pagination__btn" data-page-move="last" aria-label="마지막 페이지" ${paging.page === totalPages ? 'disabled' : ''}></button>
    `;

    container.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = Number(btn.dataset.page);
        if (next !== paging.page) {
          paging.page = next;
          renderRelatedList();
        }
      });
    });

    container.querySelectorAll('[data-page-move]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.pageMove;
        let next = paging.page;
        if (action === 'first') next = 1;
        else if (action === 'prev') next = Math.max(1, paging.page - 1);
        else if (action === 'next') next = Math.min(totalPages, paging.page + 1);
        else if (action === 'last') next = totalPages;
        if (next !== paging.page) {
          paging.page = next;
          renderRelatedList();
        }
      });
    });
  }

  function renderRelatedList() {
    const tbody = document.getElementById('repairRelatedListBody');
    if (!tbody) return;

    const totalPages = getTotalPages();
    if (paging.page > totalPages) paging.page = totalPages;

    if (!filteredItems.length) {
      tbody.innerHTML =
        '<tr><td colspan="8" class="repair-related-table__empty">검색 결과가 없습니다.</td></tr>';
      renderRelatedPagination();
      return;
    }

    const start = (paging.page - 1) * paging.pageSize;
    const pageItems = filteredItems.slice(start, start + paging.pageSize);

    tbody.innerHTML = pageItems
      .map(
        (item, index) => `<tr class="is-clickable" tabindex="0" data-related-id="${item.id}" aria-selected="false">
          <td class="col-no">${start + index + 1}</td>
          <td>${escapeHtml(item.inspectionDate)}</td>
          <td>${escapeHtml(item.inspectionType)}</td>
          <td>${escapeHtml(item.grade)}</td>
          <td>${escapeHtml(item.surveyAgency)}</td>
          <td>${escapeHtml(item.defectPart || '-')}</td>
          <td>${escapeHtml(item.defectCategory || '-')}</td>
          <td>${escapeHtml(item.defectType || '-')}</td>
        </tr>`
      )
      .join('');

    tbody.querySelectorAll('tr.is-clickable').forEach((row) => {
      const selectRow = () => {
        const item = RELATED_INSPECTIONS.find((rowData) => rowData.id === Number(row.dataset.relatedId));
        if (!item) return;
        const input = document.getElementById(targetInputId);
        if (input) input.value = formatRelatedLabel(item);
        if (selectCallback) selectCallback(item);
        selectCallback = null;
        closeRelatedInspectionModal();
      };
      row.addEventListener('click', selectRow);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectRow();
        }
      });
    });

    renderRelatedPagination();
  }

  function getCurrentFacilityName() {
    const ids = [
      'facilityName',
      'repairDetailFacilityName',
      'vulnerableDetailFacilityName',
      'majorDefectDetailFacilityName',
      'precisionDetailFacilityName',
    ];
    for (const id of ids) {
      const text = document.getElementById(id)?.textContent.trim();
      if (text) return text;
    }
    return '';
  }

  function resetSearchForm() {
    const form = document.getElementById('repairRelatedSearchForm');
    form?.reset();
    const facilityName = getCurrentFacilityName();
    const facilityInput = document.getElementById('repairRelatedFacilityName');
    if (facilityInput && facilityName) facilityInput.value = facilityName;
  }

  function runSearch() {
    filteredItems = filterItems(getSearchFilters());
    paging.page = 1;
    renderRelatedList();
  }

  function openRelatedInspectionModal(inputId, onSelect) {
    targetInputId = inputId || 'repairRelatedInspection';
    selectCallback = typeof onSelect === 'function' ? onSelect : null;
    const modal = document.getElementById('repairRelatedInspectionModal');
    if (!modal) return;

    resetSearchForm();
    paging.page = 1;
    filteredItems = filterItems(getSearchFilters());
    renderRelatedList();
    modal.hidden = false;
    document.body.classList.add('repair-related-modal-open');
  }

  function closeRelatedInspectionModal() {
    const modal = document.getElementById('repairRelatedInspectionModal');
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.body.classList.remove('repair-related-modal-open');
  }

  function init() {
    if (!document.getElementById('repairRelatedInspectionModal')) return;

    document.getElementById('repairRelatedInspectionBtn')?.addEventListener('click', openRelatedInspectionModal);

    document.getElementById('repairRelatedSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      runSearch();
    });

    document.getElementById('repairRelatedResetBtn')?.addEventListener('click', () => {
      resetSearchForm();
      runSearch();
    });

    document.querySelectorAll('[data-close-related-inspection-modal]').forEach((el) => {
      el.addEventListener('click', closeRelatedInspectionModal);
    });

    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('repairRelatedInspectionModal');
      if (e.key === 'Escape' && modal && !modal.hidden) {
        e.stopPropagation();
        closeRelatedInspectionModal();
      }
    });
  }

  window.openRepairRelatedInspectionModal = openRelatedInspectionModal;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
