/**
 * 시설물 상세 — 정기안전점검 목록 / 선택 시 분할 상세 화면
 */
(function () {
  const INSPECTIONS = [
    { id: 1, date: '2026-05-18', agency: '시스템관리자', inspector: '-', status: '-', opinion: '-' },
    { id: 2, date: '2026-05-18', agency: '시스템관리자', inspector: '-', status: '-', opinion: '-' },
    { id: 3, date: '2026-05-18', agency: '시스템관리자', inspector: '-', status: '-', opinion: '-' },
    { id: 4, date: '2024-10-22', agency: '경상북도(자체점검)', inspector: '신수용', status: '양호', opinion: '전반적으로 양호함', surveyUnit: '남방파제 1구간', evalUnit: '남방파제 전체', completedDate: '2007-01-01', lastInspectionDate: '2024-10-22' },
    { id: 5, date: '2024-10-10', agency: '자체점검', inspector: '-', status: '-', opinion: '-', surveyUnit: '남방파제 2구간', evalUnit: '남방파제 전체', completedDate: '2007-01-01', lastInspectionDate: '2024-10-10' },
    { id: 6, date: '2024-07-03', agency: '경상북도(자체점검)', inspector: '항만개발팀장 외 1', status: '양호', opinion: '이상없음', surveyUnit: '남방파제 전체', evalUnit: '남방파제 전체', completedDate: '2007-01-01', lastInspectionDate: '2024-07-03' },
    { id: 7, date: '2023-07-10', agency: '-', inspector: '-', status: '-', opinion: '-' },
    { id: 8, date: '2021-07-13', agency: '자체점검', inspector: '-', status: '-', opinion: '-' },
    { id: 9, date: '2019-01-21', agency: '경상북도(자체점검)', inspector: '-', status: '-', opinion: '-' },
    { id: 10, date: '2017-01-18', agency: '경상북도(자체점검)', inspector: '-', status: '-', opinion: '특이사항없음' },
    { id: 11, date: '2016-03-12', agency: '경상북도(자체점검)', inspector: '김점검', status: '양호', opinion: '특이사항 없음' },
    { id: 12, date: '2015-08-05', agency: '자체점검', inspector: '-', status: '-', opinion: '-' },
    { id: 13, date: '2014-11-20', agency: '경상북도(자체점검)', inspector: '이관리', status: '양호', opinion: '양호' },
    { id: 14, date: '2013-06-14', agency: '경상북도(자체점검)', inspector: '-', status: '-', opinion: '-' },
    { id: 15, date: '2012-02-08', agency: '자체점검', inspector: '박담당', status: '양호', opinion: '이상 없음' },
  ];

  const RESULT_OPTIONS = [
    { value: 'good', label: '양호' },
    { value: 'normal', label: '보통' },
    { value: 'bad', label: '불량' },
    { value: 'na', label: '해당없음' },
  ];

  const ITEM_CATEGORIES = [
    {
      id: 'super',
      label: '상부공 및 직립부 (9건)',
      title: '상부공 및 직립부',
      items: [
        { id: 'super-1', name: '침하', en: 'Settlement', status: 'good', photos: 0, memo: '' },
        { id: 'super-2', name: '파손', en: 'Damage', status: 'normal', photos: 0, memo: '' },
        { id: 'super-3', name: '균열', en: 'Cracks', status: 'good', photos: 0, memo: '' },
        { id: 'super-4', name: '박리', en: 'Spalling', status: 'good', photos: 0, memo: '' },
        { id: 'super-5', name: '이격', en: 'Gap', status: 'good', photos: 0, memo: '' },
        { id: 'super-6', name: '경사/전도', en: 'Tilt', status: 'good', photos: 0, memo: '' },
      ],
    },
    {
      id: 'slope',
      label: '사석 경사면 (2건)',
      title: '사석 경사면',
      items: [
        { id: 'slope-1', name: '세굴', en: 'Scour', status: 'good', photos: 0, memo: '' },
        { id: 'slope-2', name: '침식', en: 'Erosion', status: 'normal', photos: 0, memo: '' },
      ],
    },
    {
      id: 'toe',
      label: '저부 및 기초 (3건)',
      title: '저부 및 기초',
      items: [
        { id: 'toe-1', name: '세굴', en: 'Scour', status: 'good', photos: 0, memo: '' },
        { id: 'toe-2', name: '침하', en: 'Settlement', status: 'good', photos: 0, memo: '' },
        { id: 'toe-3', name: '균열', en: 'Cracks', status: 'good', photos: 0, memo: '' },
      ],
    },
    {
      id: 'aux',
      label: '부대시설 (1건)',
      title: '부대시설',
      items: [{ id: 'aux-1', name: '부식', en: 'Corrosion', status: 'good', photos: 0, memo: '' }],
    },
  ];

  const EMPTY_INSPECTION = {
    date: '-',
    agency: '-',
    inspector: '-',
    status: '-',
    opinion: '-',
    surveyUnit: '-',
    evalUnit: '-',
    completedDate: '-',
    lastInspectionDate: '-',
  };

  function formatYearMonthDay(value) {
    if (value == null || value === '' || value === '-') return '-';
    const text = String(value).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
    const yearMatch = text.match(/(\d{4})/);
    return yearMatch ? `${yearMatch[1]}-01-01` : text;
  }

  function getCompletedDateFromInfo(item) {
    if (item?.completedDate && item.completedDate !== '-') {
      return formatYearMonthDay(item.completedDate);
    }
    return formatYearMonthDay(getInfoTableValue('준공년도'));
  }

  function getRegularDetailSummaryFields(item) {
    const data = item || EMPTY_INSPECTION;
    const recentInspection = getInfoTableValue('점검일(최근)');
    const facilityName = document.getElementById('facilityName')?.textContent.trim() || '-';
    const withFallback = (value, fallback) => (value && value !== '-' ? value : fallback);

    return [
      { label: '시설물명', value: facilityName },
      { label: '관리주체', value: getInfoTableValue('관리구분') },
      { label: '조사단위', value: withFallback(data.surveyUnit, `${facilityName} 1구간`) },
      { label: '평가단위', value: withFallback(data.evalUnit, `${facilityName} 전체`) },
      { label: '준공년월일', value: getCompletedDateFromInfo(data) },
      {
        label: '최종점검 년월일',
        value: formatYearMonthDay(data.lastInspectionDate || data.date || recentInspection),
      },
    ];
  }

  function buildResultReport(item) {
    const facilityName = document.getElementById('facilityName')?.textContent.trim() || '남방파제';
    const date = item?.date && item.date !== '-' ? item.date : '2026-02-20';
    const period = `${date} ~ ${date}`;
    const year = date.slice(0, 4);
    const mainResult =
      item?.opinion && item.opinion !== '-'
        ? item.opinion
        : '경사/전도에 주의가 필요하며, 전반적으로 보통 수준의 상태를 유지하고 있음';

    return {
      general: [
        ['대행/자체', '대행', '점검기간', period],
        ['용역명', `${year}년 정기안전점검 용역`, '대표자', ''],
        ['관리주체명', '부산광역시 중구', '계약방법', '수의계약'],
        ['공동수급', '-', '종류', facilityName],
        ['시설물 구분', '외곽시설', '준공일', '1998-12-30'],
        ['종별', '방파제', '안전등급', 'B등급'],
        ['점검금액(천원)', '12,500', '시설물 규모', '연장 350m, 폭 12m'],
        ['시설물 위치', '부산광역시 중구 항만로 1', null, null],
      ],
      majorDefect: '중대한 결함 없음',
      publicDefect: '없음',
      mainResult,
      mainRepairPlan: '경사/전도 보완 필요, 균열부 모니터링 및 보수 예정',
      engineers: [
        { role: '책임기술자', name: '홍길동', period, grade: '특급' },
        { role: '참여기술자', name: '김철수', period, grade: '고급' },
      ],
      notes: '없음',
    };
  }

  function renderResultReportGridRows(rows) {
    return rows
      .map(([label1, value1, label2, value2]) => {
        if (label2 == null) {
          return `<tr>
            <th scope="row">${escapeHtml(label1)}</th>
            <td colspan="3">${escapeHtml(value1)}</td>
          </tr>`;
        }
        return `<tr>
          <th scope="row">${escapeHtml(label1)}</th>
          <td>${escapeHtml(value1)}</td>
          <th scope="row">${escapeHtml(label2)}</th>
          <td>${escapeHtml(value2)}</td>
        </tr>`;
      })
      .join('');
  }

  function renderResultReport(item) {
    const panel = document.getElementById('regularDetailPanelReport');
    if (!panel) return;

    if (!item || isFormMode()) {
      panel.innerHTML = '<p class="regular-detail__placeholder">등록된 결과보고서가 없습니다.</p>';
      return;
    }

    const report = buildResultReport(item);
    const engineerRows = report.engineers
      .map(
        (row) =>
          `<tr>
            <td>${escapeHtml(row.role)}</td>
            <td>${escapeHtml(row.name)}</td>
            <td>${escapeHtml(row.period)}</td>
            <td>${escapeHtml(row.grade)}</td>
          </tr>`
      )
      .join('');
    const emptyEngineerRows = Array.from({ length: 2 })
      .map(() => '<tr><td>&nbsp;</td><td></td><td></td><td></td></tr>')
      .join('');

    panel.innerHTML = `
      <div class="regular-result-report">
        <section class="regular-result-report__section">
          <h4 class="regular-result-report__heading">가. 일반현황</h4>
          <table class="regular-result-report__grid">
            <tbody>${renderResultReportGridRows(report.general)}</tbody>
          </table>
        </section>

        <section class="regular-result-report__section">
          <h4 class="regular-result-report__heading">나. 점검 실시결과 현황</h4>
          <table class="regular-result-report__grid regular-result-report__grid--result">
            <tbody>
              <tr>
                <th scope="row" rowspan="2">중대한 결함 등</th>
                <th scope="row">중대한 결함</th>
                <td>${escapeHtml(report.majorDefect)}</td>
              </tr>
              <tr>
                <th scope="row">공중이용하는부위에 결함</th>
                <td>${escapeHtml(report.publicDefect)}</td>
              </tr>
              <tr>
                <th scope="row" colspan="2">주요 점검 결과</th>
                <td class="regular-result-report__cell--multiline">${escapeHtml(report.mainResult)}</td>
              </tr>
              <tr>
                <th scope="row" colspan="2">주요 보수·보강 계획</th>
                <td class="regular-result-report__cell--multiline">${escapeHtml(report.mainRepairPlan)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="regular-result-report__section">
          <h4 class="regular-result-report__heading">다. 책임(참여)기술자 현황</h4>
          <div class="detail-table-wrap">
            <table class="inspection-table regular-result-report__data-table">
              <thead>
                <tr>
                  <th scope="col">구분</th>
                  <th scope="col">성명</th>
                  <th scope="col">과업 참여기간</th>
                  <th scope="col">기술등급</th>
                </tr>
              </thead>
              <tbody>${engineerRows}${emptyEngineerRows}</tbody>
            </table>
          </div>
        </section>

        <section class="regular-result-report__section">
          <h4 class="regular-result-report__heading">라. 참고사항</h4>
          <div class="regular-result-report__notes">${escapeHtml(report.notes)}</div>
        </section>
      </div>`;
  }

  function renderPhotosPanel(empty) {
    const photosPanel = document.getElementById('regularDetailPanelPhotos');
    if (!photosPanel) return;
    photosPanel.innerHTML = empty
      ? '<p class="regular-detail__placeholder">등록된 사진이 없습니다.</p>'
      : '<p class="regular-detail__placeholder">사진대지가 표시됩니다.</p>';
  }

  function renderResultReportPlaceholder() {
    const panel = document.getElementById('regularDetailPanelReport');
    if (panel) {
      panel.innerHTML = '<p class="regular-detail__placeholder">결과보고서가 표시됩니다.</p>';
    }
  }

  const state = {
    pageSize: 10,
    splitPageSize: 10,
    page: 1,
    splitPage: 1,
    selectedId: null,
    detailMode: null,
    activeCategoryId: ITEM_CATEGORIES[0].id,
  };

  function isFormMode() {
    return state.detailMode === 'edit' || state.detailMode === 'add';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getTotalPages(size) {
    return Math.max(1, Math.ceil(INSPECTIONS.length / size));
  }

  function getPageItems(page, size) {
    const start = (page - 1) * size;
    return INSPECTIONS.slice(start, start + size);
  }

  function renderTableBody(tbody, page, size, selectedId, onSelect) {
    if (!tbody) return;
    const items = getPageItems(page, size);
    const startNo = (page - 1) * size;

    tbody.innerHTML = items
      .map((item, idx) => {
        const no = startNo + idx + 1;
        const selected = item.id === selectedId ? ' is-selected' : '';
        const statusClass = item.status === '양호' ? ' is-status-good' : '';
        return `<tr class="is-clickable${selected}" tabindex="0" data-id="${item.id}" aria-selected="${item.id === selectedId ? 'true' : 'false'}">
          <td class="col-no">${no}</td>
          <td>${escapeHtml(item.date)}</td>
          <td>${escapeHtml(item.agency)}</td>
          <td>${escapeHtml(item.inspector)}</td>
          <td class="${statusClass.trim()}">${escapeHtml(item.status)}</td>
          <td>${escapeHtml(item.opinion)}</td>
        </tr>`;
      })
      .join('');

    tbody.querySelectorAll('tr.is-clickable').forEach((row) => {
      const openDetail = () => {
        const id = Number(row.dataset.id);
        onSelect(id);
      };
      row.addEventListener('click', openDetail);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail();
        }
      });
    });
  }

  function renderPagination(container, page, size, onChange) {
    if (!container) return;
    const totalPages = getTotalPages(size);
    const pages = [];

    for (let i = 1; i <= Math.min(totalPages, 5); i += 1) {
      pages.push(i);
    }

    container.innerHTML = `
      <button type="button" class="pagination__btn" data-page="first" aria-label="첫 페이지" ${page === 1 ? 'disabled' : ''}>&laquo;</button>
      <button type="button" class="pagination__btn" data-page="prev" aria-label="이전 페이지" ${page === 1 ? 'disabled' : ''}>&lsaquo;</button>
      ${pages
        .map(
          (n) =>
            `<button type="button" class="pagination__btn${n === page ? ' is-active' : ''}" data-page="${n}" aria-label="${n}페이지" aria-current="${n === page ? 'page' : 'false'}">${n}</button>`
        )
        .join('')}
      <button type="button" class="pagination__btn" data-page="next" aria-label="다음 페이지" ${page === totalPages ? 'disabled' : ''}>&rsaquo;</button>
      <button type="button" class="pagination__btn" data-page="last" aria-label="마지막 페이지" ${page === totalPages ? 'disabled' : ''}>&raquo;</button>
    `;

    container.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.page;
        let next = page;
        if (action === 'first') next = 1;
        else if (action === 'prev') next = Math.max(1, page - 1);
        else if (action === 'next') next = Math.min(totalPages, page + 1);
        else if (action === 'last') next = totalPages;
        else next = Number(action);
        if (next !== page) onChange(next);
      });
    });
  }

  function renderListView() {
    renderTableBody(
      document.getElementById('regularListBody'),
      state.page,
      state.pageSize,
      null,
      openDetailView
    );
    renderPagination(document.getElementById('regularPagination'), state.page, state.pageSize, (p) => {
      state.page = p;
      renderListView();
    });
  }

  function renderSplitList() {
    renderTableBody(
      document.getElementById('regularSplitListBody'),
      state.splitPage,
      state.splitPageSize,
      state.selectedId,
      selectInspection
    );
    renderPagination(
      document.getElementById('regularSplitPagination'),
      state.splitPage,
      state.splitPageSize,
      (p) => {
        state.splitPage = p;
        renderSplitList();
      }
    );
  }

  function getInfoTableValue(label) {
    const th = Array.from(document.querySelectorAll('.info-table th')).find(
      (el) => el.textContent.trim() === label
    );
    return th?.nextElementSibling?.textContent.trim() || '-';
  }

  function renderFacilityFormMeta() {
    const nameEl = document.getElementById('regularFacilityName');
    const ownerEl = document.getElementById('regularFacilityOwner');
    if (nameEl) {
      nameEl.textContent = document.getElementById('facilityName')?.textContent.trim() || '-';
    }
    if (ownerEl) {
      ownerEl.textContent = getInfoTableValue('관리구분');
    }
  }

  function renderDetailSummary(item) {
    const el = document.getElementById('regularDetailSummary');
    if (!el) return;
    const fields = getRegularDetailSummaryFields(item);
    el.innerHTML = fields
      .map(
        (f) => `<div class="regular-summary-card">
          <span class="regular-summary-card__label">${f.label}</span>
          <span class="regular-summary-card__value">${escapeHtml(f.value)}</span>
        </div>`
      )
      .join('');
  }

  function statusLabel(status) {
    return RESULT_OPTIONS.find((o) => o.value === status)?.label || '-';
  }

  function renderItemsNav() {
    const nav = document.getElementById('regularItemsNav');
    if (!nav) return;
    nav.innerHTML = ITEM_CATEGORIES.map(
      (cat) =>
        `<button type="button" class="regular-items-nav__btn${cat.id === state.activeCategoryId ? ' is-active' : ''}" data-category="${cat.id}">${escapeHtml(cat.label)}</button>`
    ).join('');

    nav.querySelectorAll('[data-category]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.activeCategoryId = btn.dataset.category;
        renderItemsNav();
        renderItemsGrid();
      });
    });
  }

  function renderViewItemCard(item) {
    const statusClass = item.status === 'normal' ? ' is-normal' : '';
    return `<article class="regular-item-card">
      <h4 class="regular-item-card__title">${escapeHtml(item.name)}<em>${escapeHtml(item.en)}</em></h4>
      <span class="regular-item-card__status${statusClass}">${statusLabel(item.status)}</span>
      <p class="regular-item-card__photos">사진 ${item.photos}개</p>
    </article>`;
  }

  function renderEditItemCard(item) {
    return `<article class="regular-item-card regular-item-card--edit" data-item-id="${item.id}">
      <h4 class="regular-item-card__title">${escapeHtml(item.name)}<em>${escapeHtml(item.en)}</em></h4>
      <input type="text" class="regular-item-card__memo" value="${escapeHtml(item.memo || '')}" placeholder="의견 입력" aria-label="${escapeHtml(item.name)} 의견">
      <div class="regular-item-card__photo-row">
        <button type="button" class="btn-photo-add regular-item-card__photo-btn" data-item-id="${item.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          사진 추가
        </button>
        <input type="file" class="regular-item-card__file" data-item-id="${item.id}" accept="image/*" multiple hidden>
        <p class="regular-item-card__photos">사진 <span class="regular-item-card__photo-count">${item.photos}</span>개</p>
      </div>
    </article>`;
  }

  function bindEditItemEvents() {
    const grid = document.getElementById('regularItemsGrid');
    if (!grid || !isFormMode()) return;

    grid.querySelectorAll('.regular-item-card__photo-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.itemId;
        grid.querySelector(`.regular-item-card__file[data-item-id="${id}"]`)?.click();
      });
    });

    grid.querySelectorAll('.regular-item-card__file').forEach((input) => {
      input.addEventListener('change', () => {
        const id = input.dataset.itemId;
        const count = input.files?.length || 0;
        if (!count) return;
        const item = findItemById(id);
        if (item) item.photos += count;
        const card = grid.querySelector(`.regular-item-card[data-item-id="${id}"]`);
        const countEl = card?.querySelector('.regular-item-card__photo-count');
        if (countEl && item) countEl.textContent = String(item.photos);
        input.value = '';
      });
    });

    grid.querySelectorAll('.regular-item-card__memo').forEach((input) => {
      input.addEventListener('input', () => {
        const card = input.closest('.regular-item-card');
        const item = findItemById(card?.dataset.itemId);
        if (item) item.memo = input.value;
      });
    });
  }

  function findItemById(id) {
    for (const cat of ITEM_CATEGORIES) {
      const item = cat.items.find((i) => i.id === id);
      if (item) return item;
    }
    return null;
  }

  function renderItemsGrid() {
    const grid = document.getElementById('regularItemsGrid');
    const title = document.getElementById('regularItemsCategoryTitle');
    const category = ITEM_CATEGORIES.find((c) => c.id === state.activeCategoryId) || ITEM_CATEGORIES[0];
    if (title) title.textContent = category.title;
    if (!grid) return;

    grid.innerHTML = category.items
      .map((item) => (isFormMode() ? renderEditItemCard(item) : renderViewItemCard(item)))
      .join('');

    bindEditItemEvents();
  }

  function toggleDetailModeUI() {
    const detail = document.getElementById('regularSplitDetail');
    const metaForm = document.getElementById('regularMetaForm');
    const title = document.getElementById('regularDetailTitle');
    const actionsView = document.getElementById('regularDetailActionsView');
    const actionsForm = document.getElementById('regularDetailActionsForm');
    const detailLink = document.getElementById('regularItemsDetailLink');

    detail?.classList.toggle('is-form-mode', isFormMode());
    if (metaForm) metaForm.hidden = !isFormMode();
    if (actionsView) actionsView.hidden = isFormMode();
    if (actionsForm) actionsForm.hidden = !isFormMode();
    if (detailLink) detailLink.hidden = isFormMode();

    if (title) {
      if (state.detailMode === 'add') title.textContent = '정기안전점검 등록';
      else if (state.detailMode === 'edit') title.textContent = '정기안전점검 수정';
      else title.textContent = '정기안전점검 상세';
    }

    if (isFormMode()) renderFacilityFormMeta();
  }

  function resetAddFormFields() {
    const survey = document.getElementById('regularSurveyUnit');
    const evalUnit = document.getElementById('regularEvalUnit');
    const completed = document.getElementById('regularCompletedDate');
    const lastInspection = document.getElementById('regularLastInspectionDate');
    if (survey) survey.value = '';
    if (evalUnit) evalUnit.value = '';
    if (completed) completed.value = '2007-01-01';
    if (lastInspection) lastInspection.value = '2024-07-03';

    ITEM_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        item.status = 'good';
        item.photos = 0;
        item.memo = '';
      });
    });
  }

  function renderEmptyDetailPanels() {
    renderPhotosPanel(true);
    renderResultReport(null);
  }

  function restoreDetailPanelShells() {
    renderPhotosPanel(false);
    renderResultReportPlaceholder();
  }

  function setDetailTabActive(key) {
    const tabs = document.querySelectorAll('[data-regular-detail-tab]');
    const panels = {
      items: document.getElementById('regularDetailPanelItems'),
      photos: document.getElementById('regularDetailPanelPhotos'),
      report: document.getElementById('regularDetailPanelReport'),
    };
    tabs.forEach((tab) => {
      const on = tab.dataset.regularDetailTab === key;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    Object.entries(panels).forEach(([k, panel]) => {
      if (!panel) return;
      const on = k === key;
      panel.classList.toggle('is-active', on);
      panel.hidden = !on;
    });
  }

  function renderDetail(item) {
    renderDetailSummary(isFormMode() ? null : item);
    toggleDetailModeUI();
    renderItemsNav();
    renderItemsGrid();
    if (isFormMode()) {
      renderPhotosPanel(true);
      renderResultReport(null);
    } else {
      renderPhotosPanel(false);
      renderResultReport(item);
    }
    setDetailTabActive('items');
  }

  function showSplitView() {
    document.getElementById('regularListView').hidden = true;
    document.getElementById('regularSplitView').hidden = false;
  }

  function openDetailView(id) {
    const item = INSPECTIONS.find((row) => row.id === id);
    if (!item) return;

    state.detailMode = 'view';
    state.selectedId = id;
    const itemIndex = INSPECTIONS.findIndex((row) => row.id === id);
    state.splitPage = Math.floor(itemIndex / state.splitPageSize) + 1;

    showSplitView();
    renderSplitList();
    renderDetail(item);
  }

  function openEditView() {
    if (!state.selectedId) return;
    const item = INSPECTIONS.find((row) => row.id === state.selectedId);
    if (!item) return;

    state.detailMode = 'edit';
    resetAddFormFields();
    showSplitView();
    renderSplitList();
    renderDetail(item);
  }

  function openAddView() {
    state.detailMode = 'add';
    state.selectedId = null;
    state.activeCategoryId = ITEM_CATEGORIES[0].id;
    resetAddFormFields();

    showSplitView();
    renderSplitList();
    renderDetail(null);
  }

  function selectInspection(id) {
    openDetailView(id);
  }

  function bindDetailTabs() {
    const tabs = document.querySelectorAll('[data-regular-detail-tab]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        setDetailTabActive(tab.dataset.regularDetailTab);
      });
    });
  }

  function resetToListView() {
    state.selectedId = null;
    state.detailMode = null;
    document.getElementById('regularSplitView').hidden = true;
    document.getElementById('regularListView').hidden = false;
    renderPhotosPanel(false);
    renderResultReportPlaceholder();
    renderListView();
  }

  function cancelFormMode() {
    if (state.detailMode === 'add') {
      resetToListView();
      return;
    }
    if (state.detailMode === 'edit' && state.selectedId) {
      openDetailView(state.selectedId);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('panel-regular');
    if (!panel) return;

    const pageSizeEl = document.getElementById('regularPageSize');
    const splitPageSizeEl = document.getElementById('regularSplitPageSize');

    pageSizeEl?.addEventListener('change', () => {
      state.pageSize = Number(pageSizeEl.value) || 10;
      state.page = 1;
      renderListView();
    });

    splitPageSizeEl?.addEventListener('change', () => {
      state.splitPageSize = Number(splitPageSizeEl.value) || 10;
      state.splitPage = 1;
      renderSplitList();
    });

    bindDetailTabs();
    renderListView();

    document.getElementById('regularAddBtn')?.addEventListener('click', openAddView);
    document.getElementById('regularSplitAddBtn')?.addEventListener('click', openAddView);
    document.getElementById('regularEditBtn')?.addEventListener('click', openEditView);
    document.getElementById('regularViewCancelBtn')?.addEventListener('click', resetToListView);
    document.getElementById('regularFormCancelBtn')?.addEventListener('click', cancelFormMode);
    document.getElementById('regularExcelBtn')?.addEventListener('click', () => {
      alert('엑셀 다운로드 (샘플)');
    });
    document.getElementById('regularSaveBtn')?.addEventListener('click', () => {
      alert('점검 정보가 저장되었습니다. (샘플)');
      if (state.detailMode === 'edit' && state.selectedId) {
        openDetailView(state.selectedId);
      } else {
        resetToListView();
      }
    });

    document.querySelectorAll('.detail-tabs__btn').forEach((tab) => {
      tab.addEventListener('click', () => {
        if (tab.dataset.tab !== 'regular') resetToListView();
      });
    });
  });
})();
