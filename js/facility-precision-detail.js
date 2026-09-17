/**
 * 정밀안전(진단)점검 상세/등록 페이지
 */
(function () {
  const FACILITIES = {
    south: { name: '남방파제', location: '부산광역시 중구 항만로 · 부산항 북항' },
    gamman: { name: '감만부두 동측안벽', location: '부산광역시 중구 · 부산항 북항' },
    sinseondae: { name: '신선대부두', location: '부산광역시 중구 · 부산항 북항' },
    north: { name: '북방파제', location: '부산광역시 중구 항만로 · 부산항 북항' },
  };

  const FORM_FIELDS = [
    'precisionCategory',
    'precisionPeriodStart',
    'precisionPeriodEnd',
    'precisionAgency',
    'precisionClassType',
    'precisionEngineer',
    'precisionCost',
    'precisionGrade',
    'precisionMainResult',
    'precisionRepairPlan',
    'precisionAuthor',
    'precisionCreatedDate',
  ];

  const EDIT_LOCKED_FIELDS = ['precisionClassType', 'precisionAuthor', 'precisionCreatedDate', 'precisionCost'];

  const params = new URLSearchParams(window.location.search);
  const facilityId = params.get('facilityId') || 'south';
  const isAddMode = params.get('mode') === 'add';
  const recordId = !isAddMode && params.get('id') !== null && params.get('id') !== ''
    ? Number(params.get('id'))
    : null;

  const state = {
    selectedId: recordId,
    detailMode: isAddMode ? 'add' : 'view',
    editingEngineers: [],
    editingDefects: [],
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isFormMode() {
    return state.detailMode === 'add' || state.detailMode === 'edit';
  }

  function isRegularInspection() {
    const category = document.getElementById('precisionCategory')?.value || '';
    return category.includes('정기안전');
  }

  function listUrl() {
    const p = new URLSearchParams();
    if (facilityId) p.set('id', facilityId);
    p.set('tab', 'precision');
    return `facility-detail.html?${p.toString()}`;
  }

  /* ===== 기술자 테이블 ===== */
  function renderEngineerTable() {
    const tbody = document.getElementById('precisionEngineerBody');
    if (!tbody) return;

    const isView = state.detailMode === 'view';
    const readonlyAttr = isView ? 'readonly' : '';
    const dateAttr = isView ? 'readonly style="pointer-events:none;"' : '';

    if (!state.editingEngineers.length) {
      const cols = isView ? 8 : 9;
      tbody.innerHTML = `<tr><td colspan="${cols}">등록된 기술자가 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = state.editingEngineers.map((eng, i) => `
      <tr>
        <td><input type="text" class="prec-tech-input" value="${escapeHtml(eng.role)}" data-eng="${i}" data-field="role" ${readonlyAttr}></td>
        <td><input type="text" class="prec-tech-input" value="${escapeHtml(eng.name)}" data-eng="${i}" data-field="name" ${readonlyAttr}></td>
        <td><input type="date" class="prec-tech-input" value="${escapeHtml(eng.birth)}" data-eng="${i}" data-field="birth" ${dateAttr}></td>
        <td><input type="date" class="prec-tech-input" value="${escapeHtml(eng.startDate)}" data-eng="${i}" data-field="startDate" ${dateAttr}></td>
        <td><input type="date" class="prec-tech-input" value="${escapeHtml(eng.endDate)}" data-eng="${i}" data-field="endDate" ${dateAttr}></td>
        <td><input type="text" class="prec-tech-input" value="${escapeHtml(eng.days)}" data-eng="${i}" data-field="days" ${readonlyAttr}></td>
        <td><input type="text" class="prec-tech-input" value="${escapeHtml(eng.rate)}" data-eng="${i}" data-field="rate" ${readonlyAttr}></td>
        <td><input type="text" class="prec-tech-input" value="${escapeHtml(eng.techGrade)}" data-eng="${i}" data-field="techGrade" ${readonlyAttr}></td>
        ${!isView ? `<td><button type="button" class="prec-tech-del-btn" data-remove-eng="${i}">행 삭제</button></td>` : ''}
      </tr>
    `).join('');

    if (isView) {
      tbody.querySelectorAll('input').forEach((el) => {
        el.style.setProperty('color', '#111', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#111', 'important');
      });
    }

    if (!isView) {
      tbody.querySelectorAll('[data-remove-eng]').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.editingEngineers.splice(Number(btn.dataset.removeEng), 1);
          renderEngineerTable();
        });
      });
    }

    tbody.querySelectorAll('[data-eng]').forEach((el) => {
      el.addEventListener('change', () => {
        const i = Number(el.dataset.eng);
        const field = el.dataset.field;
        if (state.editingEngineers[i] && field) state.editingEngineers[i][field] = el.value;
      });
    });
  }

  /* ===== 결함 테이블 ===== */
  function renderDefectTable() {
    const tbody = document.getElementById('precisionDefectBody');
    if (!tbody) return;

    const isView = state.detailMode === 'view';
    const readonlyAttr = isView ? 'readonly' : '';

    if (!state.editingDefects.length) {
      const cols = isView ? 3 : 4;
      tbody.innerHTML = `<tr><td colspan="${cols}">등록된 결함이 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = state.editingDefects.map((def, i) => `
      <tr>
        <td><input type="text" class="prec-tech-input" value="${escapeHtml(def.part)}" data-def="${i}" data-field="part" ${readonlyAttr}></td>
        <td><input type="text" class="prec-tech-input" value="${escapeHtml(def.defectCategory)}" data-def="${i}" data-field="defectCategory" ${readonlyAttr}></td>
        <td><input type="text" class="prec-tech-input" value="${escapeHtml(def.defectType)}" data-def="${i}" data-field="defectType" ${readonlyAttr}></td>
        ${!isView ? `<td><button type="button" class="prec-tech-del-btn" data-remove-def="${i}">행 삭제</button></td>` : ''}
      </tr>
    `).join('');

    if (isView) {
      tbody.querySelectorAll('input').forEach((el) => {
        el.style.setProperty('color', '#111', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#111', 'important');
      });
    }

    if (!isView) {
      tbody.querySelectorAll('[data-remove-def]').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.editingDefects.splice(Number(btn.dataset.removeDef), 1);
          updateCategoryPanels();
        });
      });
    }
  }

  /* ===== 카테고리에 따라 패널 보이기/숨기기 ===== */
  function updateCategoryPanels() {
    const isForm = isFormMode();

    const engineerWrap = document.getElementById('precisionEngineerWrap');
    const defectWrap = document.getElementById('precisionDefectWrap');
    const reportBtn = document.getElementById('precisionReportBtn');
    const engineerActions = document.getElementById('precisionEngineerActions');
    const defectActions = document.getElementById('precisionDefectActions');
    const engineerDeleteCol = document.getElementById('precisionEngineerDeleteCol');
    const defectDeleteCol = document.getElementById('precisionDefectDeleteCol');

    const hasDefects = state.editingDefects.some((d) =>
      String(d.part || '').trim()
      || String(d.defectCategory || '').trim()
      || String(d.defectType || '').trim()
    );

    if (engineerWrap) engineerWrap.hidden = false;
    if (reportBtn) reportBtn.hidden = false;
    if (defectWrap) {
      defectWrap.hidden = !hasDefects;
      defectWrap.style.display = hasDefects ? '' : 'none';
    }
    if (engineerActions) engineerActions.hidden = !isForm;
    if (defectActions) defectActions.hidden = !isForm;
    if (engineerDeleteCol) engineerDeleteCol.hidden = !isForm;
    if (defectDeleteCol) defectDeleteCol.hidden = !isForm;

    renderEngineerTable();
    renderDefectTable();
  }

  function setFormFieldStates() {
    const form = document.getElementById('precisionDetailForm');
    if (!form) return;

    const isView = state.detailMode === 'view';
    const isAdd = state.detailMode === 'add';
    const isForm = isAdd || state.detailMode === 'edit';

    FORM_FIELDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const lockedInForm = isForm && EDIT_LOCKED_FIELDS.includes(id);
      const disabled = isView || lockedInForm;

      const fmsColor = id === 'precisionCost' ? '#1c6fff' : '';

      if (el.tagName === 'SELECT') {
        if (isView) {
          el.disabled = false;
          el.style.pointerEvents = 'none';
          el.style.setProperty('color', fmsColor || '#111', 'important');
          el.style.setProperty('-webkit-text-fill-color', fmsColor || '#111', 'important');
        } else {
          el.disabled = disabled;
          el.style.pointerEvents = '';
          el.style.removeProperty('color');
          el.style.removeProperty('-webkit-text-fill-color');
        }
        return;
      }

      if (el.type === 'date') {
        if (isView) {
          el.disabled = false;
          el.readOnly = true;
          el.style.pointerEvents = 'none';
          el.style.setProperty('color', fmsColor || '#111', 'important');
          el.style.setProperty('-webkit-text-fill-color', fmsColor || '#111', 'important');
        } else {
          el.disabled = disabled;
          el.readOnly = lockedInForm;
          el.style.pointerEvents = lockedInForm ? 'none' : '';
          if (fmsColor && lockedInForm) {
            el.style.setProperty('color', fmsColor, 'important');
            el.style.setProperty('-webkit-text-fill-color', fmsColor, 'important');
          } else {
            el.style.removeProperty('color');
            el.style.removeProperty('-webkit-text-fill-color');
          }
        }
        return;
      }

      if (el.tagName === 'TEXTAREA') {
        el.readOnly = disabled;
        el.disabled = false;
        if (isView) {
          el.style.setProperty('color', fmsColor || '#111', 'important');
          el.style.setProperty('-webkit-text-fill-color', fmsColor || '#111', 'important');
        } else {
          el.style.removeProperty('color');
          el.style.removeProperty('-webkit-text-fill-color');
        }
        return;
      }

      el.readOnly = disabled;
      el.disabled = false;
      if (isView || (fmsColor && lockedInForm)) {
        el.style.setProperty('color', fmsColor || '#111', 'important');
        el.style.setProperty('-webkit-text-fill-color', fmsColor || '#111', 'important');
      } else {
        el.style.removeProperty('color');
        el.style.removeProperty('-webkit-text-fill-color');
      }
    });

    form.classList.toggle('is-readonly', isView);
    form.classList.toggle('is-form-mode', isForm);
    form.classList.toggle('is-edit-mode', state.detailMode === 'edit');
    form.classList.toggle('is-add-mode', isAdd);
  }

  function fillFormFields(item) {
    const data = item || (window.PrecisionInspectionData && window.PrecisionInspectionData.empty) || {};
    const map = {
      precisionCategory: data.category,
      precisionPeriodStart: data.periodStart,
      precisionPeriodEnd: data.periodEnd,
      precisionAgency: data.agency,
      precisionClassType: data.classType,
      precisionEngineer: data.engineer,
      precisionCost: data.cost === '-' ? '' : data.cost,
      precisionGrade: data.grade,
      precisionMainResult: data.mainResult,
      precisionRepairPlan: data.repairPlan,
      precisionAuthor: data.author,
      precisionCreatedDate: data.createdDate,
    };

    Object.entries(map).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.value = value || '';
    });

    state.editingEngineers = (data.engineers || []).map((e) => ({ ...e }));
    state.editingDefects = (data.defects || []).map((d) => ({ ...d }));
  }

  /** 등록(추가) 모드에서는 첨부파일을 비우고, 조회/편집에서는 샘플 파일명 복원 */
  function syncAttachmentSlots() {
    const isAdd = state.detailMode === 'add';
    document.querySelectorAll('.precision-file-slot').forEach((slot) => {
      const nameEl = slot.querySelector('.precision-file-slot__name');
      const input = slot.querySelector('input[type="file"]');
      if (!nameEl) return;
      if (!nameEl.dataset.defaultName) {
        nameEl.dataset.defaultName = (nameEl.textContent || '').trim();
      }
      if (input) input.value = '';
      if (isAdd) {
        nameEl.textContent = '';
        nameEl.classList.add('is-empty');
        nameEl.removeAttribute('href');
      } else {
        nameEl.textContent = nameEl.dataset.defaultName || '';
        nameEl.classList.remove('is-empty');
        if (!nameEl.getAttribute('href')) nameEl.setAttribute('href', '#');
      }
    });
  }

  function loadRecord() {
    if (state.detailMode === 'add') {
      fillFormFields(window.PrecisionInspectionData.getAddDefaults());
      syncAttachmentSlots();
      return true;
    }
    const item = window.PrecisionInspectionData.getById(state.selectedId);
    if (!item) return false;
    fillFormFields(item);
    syncAttachmentSlots();
    return true;
  }

  function updateHeader() {
    const crumbEl = document.getElementById('precisionDetailCrumbCurrent');
    const text = state.detailMode === 'add'
      ? '정밀안전(진단)점검 등록'
      : state.detailMode === 'edit'
        ? '정밀안전(진단)점검 수정'
        : '정밀안전(진단)점검 상세정보';
    if (crumbEl) crumbEl.textContent = text;
  }

  function toggleModeUI() {
    const source = document.getElementById('precisionModalSource');
    const editBtn = document.getElementById('precisionEditBtn');
    const saveBtn = document.getElementById('precisionSaveBtn');
    const formCancelBtn = document.getElementById('precisionFormCancelBtn');
    const deleteBtn = document.getElementById('precisionDeleteBtn');
    const isView = state.detailMode === 'view';
    const isAdd = state.detailMode === 'add';
    const isForm = isFormMode();

    if (source) source.hidden = false;
    document.body.classList.toggle('is-precision-form-mode', isForm);
    document.body.classList.toggle('is-precision-add-mode', isAdd);

    // 조회: 삭제하기 + 수정하기 / 수정·등록: 저장하기 + 취소
    if (editBtn) editBtn.hidden = !isView;
    if (deleteBtn) deleteBtn.hidden = !isView;
    if (saveBtn) saveBtn.hidden = !isForm;
    if (formCancelBtn) formCancelBtn.hidden = !isForm;

    updateHeader();
    setFormFieldStates();
    syncAttachmentSlots();
    updateCategoryPanels();
  }

  /* ===== 보수보강이행현황 테이블 ===== */
  let repairStatusSelectedIndex = -1;
  let repairStatusDetailOpen = false;
  const repairStatusPaging = { page: 1, pageSize: 4 };

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

  function downloadRepairDesignDoc(fileName) {
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

  function setRepairStatusDetailVisible(visible) {
    const detail = document.getElementById('repairStatusDetail');
    if (detail) detail.hidden = !visible;
  }

  function renderRepairStatusDetail(item) {
    const titleEl = document.getElementById('repairStatusDetailTitle');
    const gridEl = document.getElementById('repairStatusDetailGrid');
    if (!titleEl || !gridEl) return;

    if (!item) {
      titleEl.textContent = '보수보강 실적 상세';
      gridEl.innerHTML = '';
      setRepairStatusDetailVisible(false);
      return;
    }

    const note = parseRepairNote(item.note);
    titleEl.textContent = `${item.facilityName} - 보수보강 실적 상세`;

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
        ${field('공사명', note.projectName, 'repair-status-detail__field--wide')}
      </div>
      <div class="repair-status-detail__row">
        ${field('공사구분', item.constructionType)}
        ${field('공사기간', formatRepairPeriod(item.startDate, item.endDate))}
        ${field('관련점검진단', item.relatedInspection || '-')}
      </div>
      <div class="repair-status-detail__row">
        ${field('계약방법', item.contractMethod || '-')}
        ${field('설계자', note.designer)}
        ${field('시공자', note.contractor)}
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
        downloadRepairDesignDoc(btn.dataset.designDocDownload);
      });
    });

    setRepairStatusDetailVisible(true);
  }

  function renderRepairStatusPagination() {
    const data = window.PrecisionRepairStatusData || [];
    if (globalThis.PomsPaging?.renderPagination) {
      globalThis.PomsPaging.renderPagination(
        document.getElementById('repairStatusPagination'),
        repairStatusPaging,
        data.length,
        () => {
          renderRepairStatusTable();
        }
      );
      return;
    }

    const nav = document.getElementById('repairStatusPagination');
    if (nav) nav.innerHTML = '<button type="button" class="pagination__btn is-active" aria-current="page">1</button>';
  }

  function renderRepairStatusTable(selectedIndex) {
    const tbody = document.getElementById('repairStatusBody');
    if (!tbody) return;

    const data = window.PrecisionRepairStatusData || [];

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="10">등록된 보수보강 실적이 없습니다.</td></tr>';
      repairStatusSelectedIndex = -1;
      repairStatusDetailOpen = false;
      renderRepairStatusDetail(null);
      renderRepairStatusPagination();
      return;
    }

    if (Number.isFinite(selectedIndex) && selectedIndex >= 0 && selectedIndex < data.length) {
      if (repairStatusDetailOpen && repairStatusSelectedIndex === selectedIndex) {
        repairStatusSelectedIndex = -1;
        repairStatusDetailOpen = false;
      } else {
        repairStatusSelectedIndex = selectedIndex;
        repairStatusDetailOpen = true;
        repairStatusPaging.page = Math.floor(selectedIndex / repairStatusPaging.pageSize) + 1;
      }
    } else if (repairStatusSelectedIndex >= data.length) {
      repairStatusSelectedIndex = -1;
      repairStatusDetailOpen = false;
    }

    const size = repairStatusPaging.pageSize;
    const pageStart = (repairStatusPaging.page - 1) * size;
    const rows = data.slice(pageStart, pageStart + size);
    const noteOneLine = (note) => String(note || '').replace(/\n/g, ' ');
    const activeIndex = repairStatusDetailOpen ? repairStatusSelectedIndex : -1;

    tbody.innerHTML = rows.map((item, i) => {
      const index = pageStart + i;
      return `
      <tr class="${index === activeIndex ? 'is-active' : ''}" data-repair-row="${index}">
        <td>${escapeHtml(item.facilityName)}</td>
        <td>${escapeHtml(item.category)}</td>
        <td>${escapeHtml(item.constructionType)}</td>
        <td>${escapeHtml(item.startDate)}</td>
        <td>${escapeHtml(item.endDate)}</td>
        <td>${escapeHtml(item.part)}</td>
        <td>${escapeHtml(item.content)}</td>
        <td class="repair-status-table__cost">${escapeHtml(item.cost)}</td>
        <td class="repair-status-table__note" title="${escapeHtml(noteOneLine(item.note))}">${escapeHtml(noteOneLine(item.note))}</td>
        <td>
          <button type="button" class="repair-status-view-btn${index === activeIndex ? ' is-active' : ''}" data-repair-status-detail="${index}" aria-label="상세 보기" aria-pressed="${index === activeIndex ? 'true' : 'false'}">
            <img src="assets/main/facility-form/icon-search-blue.svg" alt="" width="16" height="16">
          </button>
        </td>
      </tr>`;
    }).join('');

    tbody.querySelectorAll('[data-repair-status-detail]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderRepairStatusTable(Number(btn.dataset.repairStatusDetail));
      });
    });

    if (repairStatusDetailOpen && repairStatusSelectedIndex >= 0) {
      renderRepairStatusDetail(data[repairStatusSelectedIndex] || null);
    } else {
      renderRepairStatusDetail(null);
    }
    renderRepairStatusPagination();
  }

  function init() {
    const facility = FACILITIES[facilityId] || FACILITIES.south;
    const nameEl = document.getElementById('precisionDetailFacilityName');
    const addressEl = document.getElementById('precisionDetailFacilityAddress');
    const portEl = document.getElementById('precisionDetailFacilityPort');
    const parts = String(facility.location || '').split(/\s*·\s*/);
    if (nameEl) nameEl.textContent = facility.name;
    if (addressEl) addressEl.textContent = parts[0] || facility.location || '';
    if (portEl) portEl.textContent = parts[1] || '';
    document.title = `${facility.name} | 정밀안전(진단)점검 상세 | POMS`;

    const backHref = listUrl();
    document.querySelectorAll('[data-precision-back]').forEach((el) => {
      el.setAttribute('href', backHref);
    });

    document.querySelectorAll('.precision-detail-page .detail-tabs__btn').forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab || 'precision';
        const p = new URLSearchParams();
        if (facilityId) p.set('id', facilityId);
        p.set('tab', target);
        window.location.href = `facility-detail.html?${p.toString()}`;
      });
    });

    if (!isAddMode && !loadRecord()) {
      alert('해당 점검 이력을 찾을 수 없습니다.');
      window.location.href = backHref;
      return;
    }
    if (isAddMode) loadRecord();

    toggleModeUI();

    document.getElementById('precisionCategory')?.addEventListener('change', () => {
      updateCategoryPanels();
    });

    document.getElementById('precisionEditBtn')?.addEventListener('click', () => {
      state.detailMode = 'edit';
      toggleModeUI();
    });

    document.getElementById('precisionFormCancelBtn')?.addEventListener('click', () => {
      if (state.detailMode === 'add') {
        window.location.href = backHref;
        return;
      }
      state.detailMode = 'view';
      loadRecord();
      toggleModeUI();
    });

    document.getElementById('precisionDeleteBtn')?.addEventListener('click', () => {
      if (state.selectedId == null) return;
      if (!window.confirm('선택한 점검 이력을 삭제하시겠습니까?')) return;
      window.PrecisionInspectionData.remove(state.selectedId);
      alert('삭제되었습니다. (샘플)');
      window.location.href = backHref;
    });

    document.getElementById('precisionSaveBtn')?.addEventListener('click', () => {
      alert('점검 정보가 저장되었습니다. (샘플)');
      if (state.detailMode === 'edit' && state.selectedId != null) {
        state.detailMode = 'view';
        loadRecord();
        toggleModeUI();
      } else {
        window.location.href = backHref;
      }
    });

    // 기술자 행 추가
    document.getElementById('precisionEngineerAddBtn')?.addEventListener('click', () => {
      state.editingEngineers.push({ role: '', name: '', birth: '', startDate: '', endDate: '', days: '', rate: '', techGrade: '' });
      renderEngineerTable();
    });

    // 결함 행 추가
    document.getElementById('precisionDefectAddBtn')?.addEventListener('click', () => {
      state.editingDefects.push({ part: '', defectCategory: '', defectType: '' });
      renderDefectTable();
    });

    // 보수보강이행현황 모달 열기/닫기 — 최초엔 목록만, 현황 아이콘 클릭 시 상세 표시
    document.getElementById('precisionRepairStatusBtn')?.addEventListener('click', () => {
      const modal = document.getElementById('repairStatusModal');
      if (!modal) return;
      repairStatusPaging.page = 1;
      repairStatusSelectedIndex = -1;
      repairStatusDetailOpen = false;
      renderRepairStatusTable();
      modal.hidden = false;
      document.body.classList.add('precision-report-modal-open');
    });

    document.querySelectorAll('[data-close-repair-status]').forEach((el) => {
      el.addEventListener('click', () => {
        const modal = document.getElementById('repairStatusModal');
        if (!modal) return;
        modal.hidden = true;
        repairStatusSelectedIndex = -1;
        repairStatusDetailOpen = false;
        setRepairStatusDetailVisible(false);
        document.body.classList.remove('precision-report-modal-open');
      });
    });

    // ESC 키 처리
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const repairStatusModal = document.getElementById('repairStatusModal');
      if (repairStatusModal && !repairStatusModal.hidden) {
        repairStatusModal.hidden = true;
        repairStatusSelectedIndex = -1;
        repairStatusDetailOpen = false;
        setRepairStatusDetailVisible(false);
        document.body.classList.remove('precision-report-modal-open');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
