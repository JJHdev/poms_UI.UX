/**
 * 보고서 상세(관리자) — 정밀안전(진단)점검 이력 폼 임베드
 * facility-precision-detail.js 를 관리자 상세페이지용으로 각색 (조회/수정/삭제, 추가 없음)
 */
(function () {
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

  const EDIT_LOCKED_FIELDS = ['precisionClassType', 'precisionAuthor', 'precisionCreatedDate'];

  // 점검구분에 따른 샘플 레코드: 정기안전점검(101/102) → 1, 그 외(성능평가/정밀안전진단/정밀안전점검) → 2
  function getRecordId() {
    const gbn = window.ReportDetailChckGbn || '';
    return (gbn === '101' || gbn === '102' || gbn === '100') ? 1 : 2;
  }

  const state = {
    detailMode: 'view',
    editingEngineers: [],
    editingDefects: [],
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isFormMode() {
    return state.detailMode === 'edit';
  }

  function isRegularInspection() {
    const category = $('precisionCategory')?.value || '';
    return category.includes('정기안전');
  }

  /* ===== 기술자 테이블 ===== */
  function renderEngineerTable() {
    const tbody = $('precisionEngineerBody');
    if (!tbody) return;

    const isView = state.detailMode === 'view';
    const readonlyAttr = isView ? 'readonly' : '';

    if (!state.editingEngineers.length) {
      const cols = isView ? 8 : 9;
      tbody.innerHTML = `<tr><td colspan="${cols}">등록된 기술자가 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = state.editingEngineers.map((eng, i) => `
      <tr>
        <td><input type="text" class="precision-modal__cell-input" value="${escapeHtml(eng.role)}" data-eng="${i}" data-field="role" ${readonlyAttr}></td>
        <td><input type="text" class="precision-modal__cell-input" value="${escapeHtml(eng.name)}" data-eng="${i}" data-field="name" ${readonlyAttr}></td>
        <td><input type="date" class="precision-modal__cell-input" value="${escapeHtml(eng.birth)}" data-eng="${i}" data-field="birth" ${isView ? 'readonly style="pointer-events:none;"' : ''}></td>
        <td><input type="date" class="precision-modal__cell-input" value="${escapeHtml(eng.startDate)}" data-eng="${i}" data-field="startDate" ${isView ? 'readonly style="pointer-events:none;"' : ''}></td>
        <td><input type="date" class="precision-modal__cell-input" value="${escapeHtml(eng.endDate)}" data-eng="${i}" data-field="endDate" ${isView ? 'readonly style="pointer-events:none;"' : ''}></td>
        <td><input type="text" class="precision-modal__cell-input" value="${escapeHtml(eng.days)}" data-eng="${i}" data-field="days" ${readonlyAttr}></td>
        <td><input type="text" class="precision-modal__cell-input" value="${escapeHtml(eng.rate)}" data-eng="${i}" data-field="rate" ${readonlyAttr}></td>
        <td><input type="text" class="precision-modal__cell-input" value="${escapeHtml(eng.techGrade)}" data-eng="${i}" data-field="techGrade" ${readonlyAttr}></td>
        ${!isView ? `<td><button type="button" class="btn-detail-outline btn-detail-outline--danger" data-remove-eng="${i}">삭제</button></td>` : ''}
      </tr>
    `).join('');

    if (isView) {
      tbody.querySelectorAll('input').forEach((el) => {
        el.style.setProperty('color', '#111827', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#111827', 'important');
      });
    } else {
      tbody.querySelectorAll('[data-remove-eng]').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.editingEngineers.splice(Number(btn.dataset.removeEng), 1);
          renderEngineerTable();
        });
      });
    }
  }

  /* ===== 결함 테이블 ===== */
  function renderDefectTable() {
    const tbody = $('precisionDefectBody');
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
        <td><input type="text" class="precision-modal__cell-input" value="${escapeHtml(def.part)}" data-def="${i}" data-field="part" ${readonlyAttr}></td>
        <td><input type="text" class="precision-modal__cell-input" value="${escapeHtml(def.defectCategory)}" data-def="${i}" data-field="defectCategory" ${readonlyAttr}></td>
        <td><input type="text" class="precision-modal__cell-input" value="${escapeHtml(def.defectType)}" data-def="${i}" data-field="defectType" ${readonlyAttr}></td>
        ${!isView ? `<td><button type="button" class="btn-detail-outline btn-detail-outline--danger" data-remove-def="${i}">삭제</button></td>` : ''}
      </tr>
    `).join('');

    if (isView) {
      tbody.querySelectorAll('input').forEach((el) => {
        el.style.setProperty('color', '#111827', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#111827', 'important');
      });
    } else {
      tbody.querySelectorAll('[data-remove-def]').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.editingDefects.splice(Number(btn.dataset.removeDef), 1);
          updateCategoryPanels();
        });
      });
    }
  }

  function updateCategoryPanels() {
    const isRegular = isRegularInspection();
    const isForm = isFormMode();

    const engineerWrap = $('precisionEngineerWrap');
    const defectWrap = $('precisionDefectWrap');
    const reportBtn = $('precisionReportBtn');
    const engineerActions = $('precisionEngineerActions');
    const defectActions = $('precisionDefectActions');
    const engineerDeleteCol = $('precisionEngineerDeleteCol');
    const defectDeleteCol = $('precisionDefectDeleteCol');

    const hasDefects = state.editingDefects.some((d) =>
      String(d.part || '').trim()
      || String(d.defectCategory || '').trim()
      || String(d.defectType || '').trim()
    );

    if (engineerWrap) engineerWrap.hidden = !isRegular;
    if (reportBtn) reportBtn.hidden = !isRegular;
    if (defectWrap) {
      defectWrap.hidden = !hasDefects;
      defectWrap.style.display = hasDefects ? '' : 'none';
    }
    // 첨부파일: 성능평가/정밀안전진단/정밀안전점검에서만 표시
    const filesWrap = $('precisionFilesWrap');
    if (filesWrap) filesWrap.hidden = isRegular;
    if (engineerActions) engineerActions.hidden = !isForm;
    if (defectActions) defectActions.hidden = !isForm;
    if (engineerDeleteCol) engineerDeleteCol.hidden = !isForm;
    if (defectDeleteCol) defectDeleteCol.hidden = !isForm;

    renderEngineerTable();
    renderDefectTable();
  }

  function setFormFieldStates() {
    const form = $('precisionDetailForm');
    if (!form) return;

    const isView = state.detailMode === 'view';
    const isForm = isFormMode();

    FORM_FIELDS.forEach((id) => {
      const el = $(id);
      if (!el) return;

      const lockedInForm = isForm && EDIT_LOCKED_FIELDS.includes(id);
      const disabled = isView || lockedInForm;

      if (el.tagName === 'SELECT' || el.type === 'date') {
        if (isView) {
          el.disabled = false;
          if (el.type === 'date') el.readOnly = true;
          el.style.pointerEvents = 'none';
          el.style.setProperty('color', '#111827', 'important');
          el.style.setProperty('-webkit-text-fill-color', '#111827', 'important');
        } else {
          el.disabled = disabled;
          if (el.type === 'date') el.readOnly = false;
          el.style.pointerEvents = '';
          el.style.removeProperty('color');
          el.style.removeProperty('-webkit-text-fill-color');
        }
        return;
      }

      el.readOnly = disabled;
      el.disabled = false;
      if (isView) {
        el.style.setProperty('color', '#111827', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#111827', 'important');
      } else {
        el.style.removeProperty('color');
        el.style.removeProperty('-webkit-text-fill-color');
      }
    });

    form.classList.toggle('is-readonly', isView);
    form.classList.toggle('is-form-mode', isForm);
    form.classList.toggle('is-edit-mode', state.detailMode === 'edit');
  }

  function fillFormFields(item) {
    const data = item || {};
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
      const el = $(id);
      if (el) el.value = value || '';
    });

    state.editingEngineers = (data.engineers || []).map((e) => ({ ...e }));
    state.editingDefects = (data.defects || []).map((d) => ({ ...d }));
  }

  function loadRecord() {
    const item = window.PrecisionInspectionData?.getById(getRecordId());
    if (!item) return false;
    fillFormFields(item);
    // 목록의 점검구분(성능평가/정밀안전진단/정밀안전점검)에 맞춰 구분 값 동기화
    const gbnNm = window.ReportDetailChckGbnNm || '';
    const categoryEl = $('precisionCategory');
    if (categoryEl && gbnNm && !gbnNm.includes('정기안전')) {
      if ([...categoryEl.options].some((o) => o.value === gbnNm)) categoryEl.value = gbnNm;
    }
    return true;
  }

  function toggleModeUI() {
    const source = $('precisionModalSource');
    const editBtn = $('precisionEditBtn');
    const saveBtn = $('precisionSaveBtn');
    const formCancelBtn = $('precisionFormCancelBtn');
    const deleteBtn = $('precisionDeleteBtn');
    const isView = state.detailMode === 'view';
    const isForm = isFormMode();

    if (source) source.hidden = false;
    document.body.classList.toggle('is-precision-form-mode', isForm);
    if (editBtn) editBtn.hidden = !isView;
    if (deleteBtn) deleteBtn.hidden = false;
    if (saveBtn) saveBtn.hidden = !isForm;
    if (formCancelBtn) formCancelBtn.hidden = !isForm;

    setFormFieldStates();
    updateCategoryPanels();
  }

  /* ===== 보수보강이행현황 모달 ===== */
  let repairStatusSelectedIndex = -1;
  let repairStatusDetailOpen = false;
  const repairStatusPaging = { page: 1, pageSize: 4 };

  function setRepairStatusDetailVisible(visible) {
    const detail = $('repairStatusDetail');
    if (detail) detail.hidden = !visible;
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

  function renderRepairStatusDetail(item) {
    const titleEl = $('repairStatusDetailTitle');
    const gridEl = $('repairStatusDetailGrid');
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
        $('repairStatusPagination'),
        repairStatusPaging,
        data.length,
        () => {
          renderRepairStatusTable();
        }
      );
      return;
    }
    const nav = $('repairStatusPagination');
    if (nav) nav.innerHTML = '<button type="button" class="pagination__btn is-active" aria-current="page">1</button>';
  }

  function renderRepairStatusTable(selectedIndex) {
    const tbody = $('repairStatusBody');
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
    // 이 페이지에 정기안전점검 이력 폼이 없으면 종료
    if (!$('precisionDetailForm')) return;

    if (!loadRecord()) return;
    toggleModeUI();

    $('precisionEditBtn')?.addEventListener('click', () => {
      state.detailMode = 'edit';
      toggleModeUI();
    });

    $('precisionFormCancelBtn')?.addEventListener('click', () => {
      state.detailMode = 'view';
      loadRecord();
      toggleModeUI();
    });

    $('precisionDeleteBtn')?.addEventListener('click', () => {
      if (!window.confirm('선택한 점검 이력을 삭제하시겠습니까?')) return;
      alert('삭제되었습니다. (샘플)');
      window.location.href = 'inspection-result-manage.html?tab=report';
    });

    $('precisionSaveBtn')?.addEventListener('click', () => {
      alert('점검 정보가 저장되었습니다. (샘플)');
      state.detailMode = 'view';
      toggleModeUI();
    });

    $('precisionEngineerAddBtn')?.addEventListener('click', () => {
      state.editingEngineers.push({ role: '', name: '', birth: '', startDate: '', endDate: '', days: '', rate: '', techGrade: '' });
      renderEngineerTable();
    });

    $('precisionDefectAddBtn')?.addEventListener('click', () => {
      state.editingDefects.push({ part: '', defectCategory: '', defectType: '' });
      renderDefectTable();
    });

    $('precisionCategory')?.addEventListener('change', updateCategoryPanels);

    $('precisionRepairStatusBtn')?.addEventListener('click', () => {
      const modal = $('repairStatusModal');
      if (!modal) return;
      repairStatusPaging.page = 1;
      repairStatusSelectedIndex = -1;
      repairStatusDetailOpen = false;
      renderRepairStatusTable();
      modal.hidden = false;
    });

    document.querySelectorAll('[data-close-repair-status]').forEach((el) => {
      el.addEventListener('click', () => {
        const modal = $('repairStatusModal');
        if (!modal) return;
        modal.hidden = true;
        repairStatusSelectedIndex = -1;
        repairStatusDetailOpen = false;
        setRepairStatusDetailVisible(false);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const modal = $('repairStatusModal');
      if (modal && !modal.hidden) {
        modal.hidden = true;
        repairStatusSelectedIndex = -1;
        repairStatusDetailOpen = false;
        setRepairStatusDetailVisible(false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
