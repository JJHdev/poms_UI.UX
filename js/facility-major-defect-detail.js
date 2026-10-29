/**
 * 중대결함 사후관리 상세/등록 페이지
 */
(function () {
  const FACILITIES = {
    south: { name: '남방파제', location: '부산광역시 중구 항만로 · 부산항 북항' },
    gamman: { name: '감만부두 동측안벽', location: '부산광역시 중구 · 부산항 북항' },
    sinseondae: { name: '신선대부두', location: '부산광역시 중구 · 부산항 북항' },
    north: { name: '북방파제', location: '부산광역시 중구 항만로 · 부산항 북항' },
  };

  const EDIT_LOCKED_FIELDS = [
    'majorDefectFacilityName',
    'majorDefectManagementEntity',
    'majorDefectFacilityClass',
    'majorDefectInspectionPeriod',
    'majorDefectInspectionCost',
    'majorDefectInspectionAgency',
    'majorDefectResponsibleEngineer',
    'majorDefectSafetyGrade',
    'majorDefectActionStatus',
  ];

  const INSPECTION_CATEGORY_FIELD = 'majorDefectInspectionCategory';

  const FORM_FIELDS = [
    'majorDefectFacilityName',
    'majorDefectManagementEntity',
    'majorDefectFacilityClass',
    'majorDefectInspectionCategory',
    'majorDefectInspectionPeriod',
    'majorDefectInspectionCost',
    'majorDefectInspectionAgency',
    'majorDefectResponsibleEngineer',
    'majorDefectSafetyGrade',
    'majorDefectDefectCategory',
    'majorDefectDefectType',
    'majorDefectDefectPart',
    'majorDefectActionStatus',
  ];

  const VIEW_BLUE = '#1c6fff';

  const params = new URLSearchParams(window.location.search);
  const facilityId = params.get('facilityId') || 'south';
  const isAddMode = params.get('mode') === 'add';
  const recordId = !isAddMode && params.get('id') !== null ? Number(params.get('id')) : null;

  const state = {
    selectedId: recordId,
    detailMode: isAddMode ? 'add' : 'view',
    editingStages: [],
  };

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isFormMode() {
    return state.detailMode === 'add' || state.detailMode === 'edit';
  }

  function listUrl() {
    const p = new URLSearchParams();
    if (facilityId) p.set('id', facilityId);
    p.set('tab', 'major-defect');
    return `facility-detail.html?${p.toString()}`;
  }

  function currentFacilityName() {
    const facility = FACILITIES[facilityId];
    return facility ? facility.name : '';
  }

  function formatRelatedLabel(item) {
    if (item.periodStart && item.periodEnd && item.periodStart !== item.periodEnd) {
      return `${item.inspectionType} (${item.periodStart} ~ ${item.periodEnd})`;
    }
    return `${item.inspectionType} (${item.inspectionDate})`;
  }

  function handleRelatedInspectionSelect(item) {
    const categoryEl = document.getElementById(INSPECTION_CATEGORY_FIELD);
    if (categoryEl) categoryEl.value = formatRelatedLabel(item);

    const periodEl = document.getElementById('majorDefectInspectionPeriod');
    if (periodEl) {
      if (item.periodStart && item.periodEnd && item.periodStart !== item.periodEnd) {
        periodEl.value = `${item.periodStart} ~ ${item.periodEnd}`;
      } else {
        periodEl.value = item.inspectionDate || item.periodStart || '';
      }
    }

    const agencyEl = document.getElementById('majorDefectInspectionAgency');
    if (agencyEl) agencyEl.value = item.surveyAgency || '';

    const gradeEl = document.getElementById('majorDefectSafetyGrade');
    if (gradeEl) gradeEl.value = item.grade || '';

    const facilityEl = document.getElementById('majorDefectFacilityName');
    if (facilityEl) {
      facilityEl.value = item.facilityName || currentFacilityName();
    }

    const defectCategoryEl = document.getElementById('majorDefectDefectCategory');
    if (defectCategoryEl) defectCategoryEl.value = item.defectCategory || '';

    const defectTypeEl = document.getElementById('majorDefectDefectType');
    if (defectTypeEl) defectTypeEl.value = item.defectType || '';

    const defectPartEl = document.getElementById('majorDefectDefectPart');
    if (defectPartEl) defectPartEl.value = item.defectPart || '';
  }

  /* ===== 보수보강실적 모달 (안전점검실적 보수보강이행현황과 동일 UI) ===== */
  let repairSelectedIndex = -1;
  let repairDetailOpen = false;
  const repairPaging = { page: 1, pageSize: 4 };

  function getRepairData() {
    return (window.MajorDefectData && window.MajorDefectData.repairData) || [];
  }

  function parseRepairNote(note) {
    const parts = String(note || '').split('\n');
    return {
      projectName: (parts[0] || '').replace(/^공사명\s*:\s*/, '') || '-',
      designer: (parts[1] || '').replace(/^설계자\s*:\s*/, '') || '-',
      contractor: (parts[2] || '').replace(/^시공자\s*:\s*/, '') || '-',
    };
  }

  function formatRepairPeriod(startDate, endDate) {
    const fmt = (v) => String(v || '').replace(/-/g, '.');
    if (!startDate && !endDate) return '-';
    return `${fmt(startDate)} ~ ${fmt(endDate)}`;
  }

  function downloadDesignDoc(fileName) {
    const name = String(fileName || '').trim();
    if (!name || name === '-') return;
    const safeName = name.includes('.') ? name : `${name}.pdf`;
    const blob = new Blob(
      [`POMS 샘플 설계내역서\n파일명: ${safeName}\n`],
      { type: 'application/octet-stream' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = safeName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function setRepairDetailVisible(visible) {
    const detail = document.getElementById('majorDefectRepairDetail');
    if (detail) detail.hidden = !visible;
  }

  function renderRepairDetail(item) {
    const titleEl = document.getElementById('majorDefectRepairDetailTitle');
    const gridEl = document.getElementById('majorDefectRepairDetailGrid');
    if (!titleEl || !gridEl) return;

    if (!item) {
      titleEl.textContent = '보수보강 실적 상세';
      gridEl.innerHTML = '';
      setRepairDetailVisible(false);
      return;
    }

    const note = parseRepairNote(item.note);
    const projectName = item.projectName || note.projectName;
    const designer = item.designer || note.designer;
    const contractor = item.contractor || note.contractor;
    titleEl.textContent = `${item.facilityName || currentFacilityName()} - 보수보강 실적 상세`;

    const field = (label, value, extraClass = '') => `
      <div class="repair-status-detail__field${extraClass ? ` ${extraClass}` : ''}">
        <span class="repair-status-detail__lbl">${escapeHtml(label)}</span>
        <span class="repair-status-detail__val">${escapeHtml(value || '-')}</span>
      </div>`;

    const designDoc = String(item.designDoc || '').trim();
    const hasDesignDoc = designDoc && designDoc !== '-';
    const designDocLabel = hasDesignDoc && !/\(\s*\d/.test(designDoc) ? `${designDoc} (540KB)` : designDoc;
    const designDocField = `
      <div class="repair-status-detail__field repair-status-detail__field--rest">
        <span class="repair-status-detail__lbl">설계내역서</span>
        <span class="repair-status-detail__val">
          ${
            hasDesignDoc
              ? `<a href="#" class="repair-status-detail__file" data-design-doc-download="${escapeHtml(designDoc)}">
                  <img src="assets/main/facility-form/icon-file.svg" alt="" width="18" height="18">
                  <span>${escapeHtml(designDocLabel)}</span>
                </a>`
              : '-'
          }
        </span>
      </div>`;

    gridEl.innerHTML = `
      <div class="repair-status-detail__row repair-status-detail__row--full">
        ${field('공사명', projectName, 'repair-status-detail__field--wide')}
      </div>
      <div class="repair-status-detail__row">
        ${field('공사구분', item.constructionType)}
        ${field('공사기간', formatRepairPeriod(item.startDate, item.endDate))}
        ${field('관련점검진단', item.relatedInspection || '-')}
      </div>
      <div class="repair-status-detail__row">
        ${field('계약방법', item.contractMethod || '-')}
        ${field('설계자', designer)}
        ${field('시공자', contractor)}
      </div>
      <div class="repair-status-detail__row">
        ${field('책임기술자', item.leadEngineer || '-')}
        ${field('공사감독', item.supervisor || '-')}
        ${field('부위', item.part)}
      </div>
      <div class="repair-status-detail__row">
        ${field('공사내역', item.content)}
        ${field('공사비', item.cost ? `${item.cost} 천원` : '-')}
        ${field('내진보강', item.seismic || '-')}
      </div>
      <div class="repair-status-detail__row repair-status-detail__row--tail">
        ${field('공사성격', item.nature || '-', 'repair-status-detail__field--third')}
        ${designDocField}
      </div>
    `;

    gridEl.querySelectorAll('[data-design-doc-download]').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        downloadDesignDoc(btn.dataset.designDocDownload);
      });
    });

    setRepairDetailVisible(true);
  }

  function renderRepairPagination() {
    const data = getRepairData();
    if (globalThis.PomsPaging?.renderPagination) {
      globalThis.PomsPaging.renderPagination(
        document.getElementById('majorDefectRepairPagination'),
        repairPaging,
        data.length,
        () => {
          renderRepairTable();
        }
      );
      return;
    }

    const nav = document.getElementById('majorDefectRepairPagination');
    if (nav) nav.innerHTML = '<button type="button" class="pagination__btn is-active" aria-current="page">1</button>';
  }

  function renderRepairTable(selectedIndex) {
    const tbody = document.getElementById('majorDefectRepairBody');
    if (!tbody) return;

    const data = getRepairData();

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="10">등록된 보수보강 실적이 없습니다.</td></tr>';
      repairSelectedIndex = -1;
      repairDetailOpen = false;
      renderRepairDetail(null);
      renderRepairPagination();
      return;
    }

    if (Number.isFinite(selectedIndex) && selectedIndex >= 0 && selectedIndex < data.length) {
      if (repairDetailOpen && repairSelectedIndex === selectedIndex) {
        repairSelectedIndex = -1;
        repairDetailOpen = false;
      } else {
        repairSelectedIndex = selectedIndex;
        repairDetailOpen = true;
        repairPaging.page = Math.floor(selectedIndex / repairPaging.pageSize) + 1;
      }
    } else if (repairSelectedIndex >= data.length) {
      repairSelectedIndex = -1;
      repairDetailOpen = false;
    }

    const size = repairPaging.pageSize;
    const pageStart = (repairPaging.page - 1) * size;
    const rows = data.slice(pageStart, pageStart + size);
    const noteOneLine = (note) => String(note || '').replace(/\n/g, ' ');
    const activeIndex = repairDetailOpen ? repairSelectedIndex : -1;

    tbody.innerHTML = rows
      .map((item, i) => {
        const index = pageStart + i;
        return `
      <tr class="${index === activeIndex ? 'is-active' : ''}" data-repair-row="${index}">
        <td>${escapeHtml(item.facilityName || currentFacilityName())}</td>
        <td>${escapeHtml(item.category || '보수보강 실시')}</td>
        <td>${escapeHtml(item.constructionType)}</td>
        <td>${escapeHtml(item.startDate)}</td>
        <td>${escapeHtml(item.endDate)}</td>
        <td>${escapeHtml(item.part)}</td>
        <td>${escapeHtml(item.content)}</td>
        <td class="repair-status-table__cost">${escapeHtml(item.cost)}</td>
        <td class="repair-status-table__note" title="${escapeHtml(noteOneLine(item.note))}">${escapeHtml(noteOneLine(item.note))}</td>
        <td>
          <button type="button" class="repair-status-view-btn${index === activeIndex ? ' is-active' : ''}" data-md-repair-detail="${index}" aria-label="상세 보기" aria-pressed="${index === activeIndex ? 'true' : 'false'}">
            <img src="assets/main/facility-form/icon-search-blue.svg" alt="" width="16" height="16">
          </button>
        </td>
      </tr>`;
      })
      .join('');

    tbody.querySelectorAll('[data-md-repair-detail]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderRepairTable(Number(btn.dataset.mdRepairDetail));
      });
    });

    if (repairDetailOpen && repairSelectedIndex >= 0) {
      renderRepairDetail(data[repairSelectedIndex] || null);
    } else {
      renderRepairDetail(null);
    }
    renderRepairPagination();
  }

  function openRepairModal() {
    const modal = document.getElementById('majorDefectRepairModal');
    if (!modal) return;
    repairSelectedIndex = -1;
    repairDetailOpen = false;
    repairPaging.page = 1;
    renderRepairTable();
    modal.hidden = false;
  }

  function closeRepairModal() {
    const modal = document.getElementById('majorDefectRepairModal');
    if (!modal) return;
    modal.hidden = true;
    repairSelectedIndex = -1;
    repairDetailOpen = false;
    renderRepairDetail(null);
  }

  function syncEditingStagesFromInputs() {
    const tbody = document.getElementById('majorDefectActionBody');
    if (!tbody) return;
    tbody.querySelectorAll('[data-stage][data-field]').forEach((input) => {
      const index = Number(input.dataset.stage);
      const field = input.dataset.field;
      if (Number.isNaN(index) || !field || !state.editingStages[index]) return;
      state.editingStages[index][field] = input.value;
    });
  }

  function renderActionTable() {
    const tbody = document.getElementById('majorDefectActionBody');
    if (!tbody) return;

    const editable = isFormMode();

    if (!editable) {
      tbody.innerHTML = state.editingStages
        .map(
          (stage, index) => `<tr>
            <th scope="row">${escapeHtml(stage.stage)}</th>
            <td>
              <div class="md-action-table__date-cell">
                ${stage.deadlineDate ? `<input type="text" class="md-action-table__input md-action-table__input--date-view" value="${escapeHtml(stage.deadlineDate)}" readonly>` : ''}
                ${stage.deadlineNote ? `<span class="md-action-table__date-note">${escapeHtml(stage.deadlineNote)}</span>` : ''}
              </div>
            </td>
            <td>
              <div class="md-action-table__date-cell">
                ${stage.actionDate ? `<input type="text" class="md-action-table__input md-action-table__input--date-view" value="${escapeHtml(stage.actionDate)}" readonly>` : ''}
                ${stage.dateNote ? `<span class="md-action-table__date-note">${escapeHtml(stage.dateNote)}</span>` : ''}
              </div>
            </td>
            <td><input type="text" class="md-action-table__input" data-stage="${index}" data-field="content" value="${escapeHtml(stage.content)}" readonly></td>
          </tr>`
        )
        .join('');
      return;
    }

    tbody.innerHTML = state.editingStages
      .map(
        (stage, index) => {
          const locked = stage.stage === '계획';
          return `<tr>
            <th scope="row">${escapeHtml(stage.stage)}</th>
            <td>
              <div class="md-action-table__date-cell">
                ${locked
                  ? `<input type="text" class="md-action-table__input md-action-table__input--date-view" value="${escapeHtml(stage.deadlineDate || '')}" readonly>`
                  : `<input type="date" class="md-action-table__date-input" data-stage="${index}" data-field="deadlineDate" value="${escapeHtml(stage.deadlineDate || '')}">`
                }
                ${stage.deadlineNote ? `<span class="md-action-table__date-note">${escapeHtml(stage.deadlineNote)}</span>` : ''}
              </div>
            </td>
            <td>
              <div class="md-action-table__date-cell">
                ${locked
                  ? `<input type="text" class="md-action-table__input md-action-table__input--date-view" value="${escapeHtml(stage.actionDate || '')}" readonly>`
                  : `<input type="date" class="md-action-table__date-input" data-stage="${index}" data-field="actionDate" value="${escapeHtml(stage.actionDate || '')}">`
                }
                ${stage.dateNote ? `<span class="md-action-table__date-note">${escapeHtml(stage.dateNote)}</span>` : ''}
              </div>
            </td>
            <td><input type="text" class="md-action-table__input" data-stage="${index}" data-field="content" value="${escapeHtml(stage.content)}"></td>
          </tr>`;
        }
      )
      .join('');
  }

  function setFormFieldStates() {
    const form = document.getElementById('majorDefectDetailForm');
    if (!form) return;

    const isView = state.detailMode === 'view';
    const isAdd = state.detailMode === 'add';
    const isForm = isAdd || state.detailMode === 'edit';

    FORM_FIELDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const lockedInForm = isForm && EDIT_LOCKED_FIELDS.includes(id);
      const isCategoryField = id === INSPECTION_CATEGORY_FIELD;

      if (isView || lockedInForm) {
        el.style.setProperty('color', VIEW_BLUE, 'important');
        el.style.setProperty('-webkit-text-fill-color', VIEW_BLUE, 'important');
      } else {
        el.style.removeProperty('color');
        el.style.removeProperty('-webkit-text-fill-color');
      }

      if (isCategoryField) {
        el.readOnly = true;
        el.disabled = false;
        return;
      }

      el.readOnly = isView || lockedInForm;
      el.disabled = false;
    });

    form.querySelectorAll('.md-action-table__input').forEach((input) => {
      input.readOnly = isView;
      input.disabled = false;
      if (isView) {
        input.style.setProperty('color', VIEW_BLUE, 'important');
        input.style.setProperty('-webkit-text-fill-color', VIEW_BLUE, 'important');
      } else {
        input.style.removeProperty('color');
        input.style.removeProperty('-webkit-text-fill-color');
      }
    });

    form.querySelectorAll('.md-action-table__date-input').forEach((input) => {
      input.disabled = isView;
      input.readOnly = false;
      input.style.removeProperty('color');
      input.style.removeProperty('-webkit-text-fill-color');
    });

    form.querySelectorAll('.md-action-table__input--date-view').forEach((input) => {
      input.style.setProperty('color', VIEW_BLUE, 'important');
      input.style.setProperty('-webkit-text-fill-color', VIEW_BLUE, 'important');
    });

    const statusEl = document.getElementById('majorDefectActionStatus');
    if (statusEl) {
      statusEl.readOnly = isView || isForm;
      if (isView || isForm) {
        statusEl.style.setProperty('color', VIEW_BLUE, 'important');
        statusEl.style.setProperty('-webkit-text-fill-color', VIEW_BLUE, 'important');
      } else {
        statusEl.style.removeProperty('color');
        statusEl.style.removeProperty('-webkit-text-fill-color');
      }
    }

    form.classList.toggle('is-readonly', isView);
    form.classList.toggle('is-form-mode', isForm);
    form.classList.toggle('is-edit-mode', state.detailMode === 'edit');
    form.classList.toggle('is-add-mode', isAdd);
  }

  function fillFormFields(item) {
    const data = item || (window.MajorDefectData && window.MajorDefectData.empty) || {};
    const map = {
      majorDefectFacilityName: data.facilityName || '',
      majorDefectManagementEntity: data.managementEntity || '',
      majorDefectFacilityClass: data.facilityClass || '',
      majorDefectInspectionCategory: data.inspectionCategoryFull || '',
      majorDefectInspectionPeriod: data.inspectionPeriod || '',
      majorDefectInspectionCost: data.inspectionCost || '',
      majorDefectInspectionAgency: data.inspectionAgency || '',
      majorDefectResponsibleEngineer: data.responsibleEngineer || '',
      majorDefectSafetyGrade: data.safetyGrade || '',
      majorDefectDefectCategory: data.defectCategory || '',
      majorDefectDefectType: data.defectType || '',
      majorDefectDefectPart: data.defectPart || '',
      majorDefectActionStatus: data.actionStatus || '',
    };

    Object.entries(map).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.value = value;
    });

    const normalize = (window.MajorDefectData && window.MajorDefectData.normalizeActionStages) || ((s) => s || []);
    state.editingStages = normalize(data.actionStages).map((row) => ({ ...row }));
  }

  function loadRecord() {
    if (state.detailMode === 'add') {
      fillFormFields(window.MajorDefectData.getAddDefaults(currentFacilityName()));
      return true;
    }
    const item = window.MajorDefectData.getById(state.selectedId);
    if (!item) return false;
    fillFormFields(item);
    return true;
  }

  function updateHeader() {
    const crumbEl = document.getElementById('majorDefectDetailCrumbCurrent');
    const text = state.detailMode === 'add'
      ? '중대결함 사후관리 등록'
      : state.detailMode === 'edit'
        ? '중대결함 사후관리 수정'
        : '중대결함 사후관리 상세정보';
    if (crumbEl) crumbEl.textContent = text;
  }

  function toggleModeUI() {
    const source = document.getElementById('majorDefectModalSource');
    const isView = state.detailMode === 'view';
    const isForm = isFormMode();

    const editBtn = document.getElementById('majorDefectEditBtn');
    const saveBtn = document.getElementById('majorDefectSaveBtn');
    const formCancelBtn = document.getElementById('majorDefectFormCancelBtn');
    const deleteBtn = document.getElementById('majorDefectDeleteBtn');
    const repairBtn = document.getElementById('majorDefectRepairStatusBtn');

    if (source) source.hidden = state.detailMode === 'add';
    editBtn?.toggleAttribute('hidden', !isView);
    saveBtn?.toggleAttribute('hidden', !isForm);
    formCancelBtn?.toggleAttribute('hidden', !isForm);
    deleteBtn?.toggleAttribute('hidden', !isView);
    repairBtn?.toggleAttribute('hidden', state.detailMode === 'add');

    document.body.classList.toggle('is-precision-form-mode', isForm);
    document.body.classList.toggle('is-precision-add-mode', state.detailMode === 'add');

    document.getElementById('majorDefectInspectionCategoryBtn')?.toggleAttribute('hidden', !isForm);

    updateHeader();
    renderActionTable();
    setFormFieldStates();
  }

  function init() {
    const facility = FACILITIES[facilityId] || FACILITIES.south;
    const nameEl = document.getElementById('majorDefectDetailFacilityName');
    const addressEl = document.getElementById('majorDefectDetailFacilityAddress');
    const portEl = document.getElementById('majorDefectDetailFacilityPort');
    const parts = String(facility.location || '').split(/\s*·\s*/);
    if (nameEl) nameEl.textContent = facility.name;
    if (addressEl) addressEl.textContent = parts[0] || facility.location || '';
    if (portEl) portEl.textContent = parts[1] || '';
    document.title = `${facility.name} | 중대결함 사후관리 상세 | POMS`;

    const backHref = listUrl();
    document.querySelectorAll('[data-major-defect-back]').forEach((el) => {
      el.setAttribute('href', backHref);
    });

    document.querySelectorAll('.precision-detail-page .detail-tabs__btn').forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab || 'major-defect';
        const p = new URLSearchParams();
        if (facilityId) p.set('id', facilityId);
        p.set('tab', target);
        window.location.href = `facility-detail.html?${p.toString()}`;
      });
    });

    if (!isAddMode && !loadRecord()) {
      alert('해당 중대결함 사후관리 기록을 찾을 수 없습니다.');
      window.location.href = backHref;
      return;
    }
    if (isAddMode) loadRecord();

    toggleModeUI();

    document.getElementById('majorDefectEditBtn')?.addEventListener('click', () => {
      state.detailMode = 'edit';
      toggleModeUI();
    });

    document.getElementById('majorDefectFormCancelBtn')?.addEventListener('click', () => {
      if (state.detailMode === 'add') {
        window.location.href = backHref;
        return;
      }
      state.detailMode = 'view';
      loadRecord();
      toggleModeUI();
    });

    document.getElementById('majorDefectDeleteBtn')?.addEventListener('click', () => {
      if (state.selectedId == null) return;
      if (!window.confirm('선택한 중대결함 사후관리 기록을 삭제하시겠습니까?')) return;
      window.MajorDefectData.remove(state.selectedId);
      alert('삭제되었습니다. (샘플)');
      window.location.href = backHref;
    });

    document.getElementById('majorDefectSaveBtn')?.addEventListener('click', () => {
      syncEditingStagesFromInputs();
      alert('중대결함 사후관리 기록이 저장되었습니다. (샘플)');
      if (state.detailMode === 'edit' && state.selectedId != null) {
        state.detailMode = 'view';
        loadRecord();
        toggleModeUI();
      } else {
        window.location.href = backHref;
      }
    });

    document.getElementById('majorDefectInspectionCategoryBtn')?.addEventListener('click', () => {
      if (typeof window.openRepairRelatedInspectionModal === 'function') {
        window.openRepairRelatedInspectionModal(
          INSPECTION_CATEGORY_FIELD,
          handleRelatedInspectionSelect
        );
      }
    });

    // 보수보강실적 모달 열기/닫기 — 최초엔 목록만, 현황 아이콘 클릭 시 상세 표시
    document.getElementById('majorDefectRepairStatusBtn')?.addEventListener('click', openRepairModal);

    document.querySelectorAll('[data-close-major-defect-repair]').forEach((el) => {
      el.addEventListener('click', closeRepairModal);
    });

    // ESC 키 처리
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const repairModal = document.getElementById('majorDefectRepairModal');
      if (repairModal && !repairModal.hidden) {
        closeRepairModal();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
