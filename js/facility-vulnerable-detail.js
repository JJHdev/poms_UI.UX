/**
 * 취약시설물 중점관리 상세/등록 페이지
 */
(function () {
  const FACILITIES = {
    south: { name: '남방파제', location: '부산광역시 중구 항만로 · 부산항 북항' },
    gamman: { name: '감만부두 동측안벽', location: '부산광역시 중구 · 부산항 북항' },
    sinseondae: { name: '신선대부두', location: '부산광역시 중구 · 부산항 북항' },
    north: { name: '북방파제', location: '부산광역시 중구 항만로 · 부산항 북항' },
  };

  const FORM_FIELDS = [
    'vulnerableUsageRestriction',
    'vulnerableResidentNotice',
    'vulnerableRelatedInspection',
    'vulnerableActionPlanProgress',
    'vulnerableCreatedDate',
    'vulnerableAuthor',
  ];

  const EDIT_LOCKED_FIELDS = ['vulnerableAuthor', 'vulnerableCreatedDate'];
  const FMS_BLUE = '#1c6fff';

  const params = new URLSearchParams(window.location.search);
  const facilityId = params.get('facilityId') || 'south';
  const isAddMode = params.get('mode') === 'add';
  const recordId = !isAddMode && params.get('id') !== null ? Number(params.get('id')) : null;

  const state = {
    selectedId: recordId,
    detailMode: isAddMode ? 'add' : 'view',
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

  function listUrl() {
    const p = new URLSearchParams();
    if (facilityId) p.set('id', facilityId);
    p.set('tab', 'vulnerable');
    return `facility-detail.html?${p.toString()}`;
  }

  function applyFmsBlue(el) {
    el.style.setProperty('color', FMS_BLUE, 'important');
    el.style.setProperty('-webkit-text-fill-color', FMS_BLUE, 'important');
  }

  function clearFmsBlue(el) {
    el.style.removeProperty('color');
    el.style.removeProperty('-webkit-text-fill-color');
  }

  function renderStageTable(item) {
    const tbody = document.getElementById('vulnerableStageBody');
    if (!tbody) return;

    const stages = item?.stages || [];
    const isView = state.detailMode === 'view';
    const readonlyAttr = isView ? 'readonly' : '';

    if (!stages.length) {
      tbody.innerHTML = '<tr><td colspan="3">등록된 단계가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = stages
      .map(
        (s) => `<tr>
          <td><input type="text" class="prec-tech-input" value="${escapeHtml(s.stage)}" ${readonlyAttr}></td>
          <td><input type="text" class="prec-tech-input" value="${escapeHtml(s.period)}" ${readonlyAttr}></td>
          <td><input type="text" class="prec-tech-input" value="${escapeHtml(s.plan)}" ${readonlyAttr}></td>
        </tr>`
      )
      .join('');

    if (isView) {
      tbody.querySelectorAll('input').forEach(applyFmsBlue);
    }
  }

  function setFormFieldStates() {
    const form = document.getElementById('vulnerableDetailForm');
    if (!form) return;

    const isView = state.detailMode === 'view';
    const isAdd = state.detailMode === 'add';
    const isForm = isAdd || state.detailMode === 'edit';

    FORM_FIELDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const lockedInForm = isForm && EDIT_LOCKED_FIELDS.includes(id);
      const disabled = isView || lockedInForm;

      if (el.tagName === 'SELECT') {
        if (isView) {
          el.disabled = false;
          el.style.pointerEvents = 'none';
          applyFmsBlue(el);
        } else {
          el.disabled = disabled;
          el.style.pointerEvents = '';
          clearFmsBlue(el);
        }
        return;
      }

      if (el.type === 'date') {
        if (isView || lockedInForm) {
          el.disabled = false;
          el.readOnly = true;
          el.style.pointerEvents = 'none';
          applyFmsBlue(el);
        } else {
          el.disabled = false;
          el.readOnly = false;
          el.style.pointerEvents = '';
          clearFmsBlue(el);
        }
        return;
      }

      if (el.tagName === 'TEXTAREA') {
        el.readOnly = disabled;
        el.disabled = false;
        if (isView) applyFmsBlue(el);
        else clearFmsBlue(el);
        return;
      }

      el.readOnly = disabled;
      el.disabled = false;
      if (isView || lockedInForm) applyFmsBlue(el);
      else clearFmsBlue(el);
    });

    form.classList.toggle('is-readonly', isView);
    form.classList.toggle('is-form-mode', isForm);
    form.classList.toggle('is-edit-mode', state.detailMode === 'edit');
    form.classList.toggle('is-add-mode', isAdd);
  }

  function fillFormFields(item) {
    const data = item || (window.VulnerableData && window.VulnerableData.empty) || {};
    const map = {
      vulnerableUsageRestriction: data.usageRestriction ?? '',
      vulnerableResidentNotice: data.residentNotice ?? '',
      vulnerableRelatedInspection: data.relatedInspection || '',
      vulnerableActionPlanProgress: data.actionPlanProgress || '',
      vulnerableCreatedDate: data.createdDate || '',
      vulnerableAuthor: data.author || '',
    };

    Object.entries(map).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.value = value;
    });

    renderStageTable(item);
  }

  function loadRecord() {
    if (state.detailMode === 'add') {
      fillFormFields(window.VulnerableData.getAddDefaults());
      return true;
    }
    const item = window.VulnerableData.getById(state.selectedId);
    if (!item) return false;
    fillFormFields(item);
    return true;
  }

  function updateHeader() {
    const crumbEl = document.getElementById('vulnerableDetailCrumbCurrent');
    const text = state.detailMode === 'add'
      ? '취약시설물 중점관리 등록'
      : state.detailMode === 'edit'
        ? '취약시설물 중점관리 수정'
        : '취약시설물 중점관리 상세정보';
    if (crumbEl) crumbEl.textContent = text;
  }

  function toggleModeUI() {
    const source = document.getElementById('vulnerableModalSource');
    const isView = state.detailMode === 'view';
    const isForm = isFormMode();

    if (source) source.hidden = state.detailMode === 'add';
    document.getElementById('vulnerableEditBtn')?.toggleAttribute('hidden', !isView);
    document.getElementById('vulnerableSaveBtn')?.toggleAttribute('hidden', !isForm);
    document.getElementById('vulnerableFormCancelBtn')?.toggleAttribute('hidden', !isForm);
    document.getElementById('vulnerableDeleteBtn')?.toggleAttribute('hidden', !isView);

    document.body.classList.toggle('is-precision-form-mode', isForm);
    document.body.classList.toggle('is-precision-add-mode', state.detailMode === 'add');

    document.getElementById('vulnerableRelatedInspectionBtn')?.toggleAttribute('hidden', !isForm);
    document.getElementById('vulnerableRestrictionView')?.toggleAttribute('hidden', isForm);
    document.getElementById('vulnerableRestrictionEdit')?.toggleAttribute('hidden', !isForm);

    updateHeader();
    setFormFieldStates();
  }

  function init() {
    const facility = FACILITIES[facilityId] || FACILITIES.south;
    const nameEl = document.getElementById('vulnerableDetailFacilityName');
    const addressEl = document.getElementById('vulnerableDetailFacilityAddress');
    const portEl = document.getElementById('vulnerableDetailFacilityPort');
    const parts = String(facility.location || '').split(/\s*·\s*/);
    if (nameEl) nameEl.textContent = facility.name;
    if (addressEl) addressEl.textContent = parts[0] || facility.location || '';
    if (portEl) portEl.textContent = parts[1] || '';
    document.title = `${facility.name} | 취약시설물 중점관리 상세 | POMS`;

    const backHref = listUrl();
    document.querySelectorAll('[data-vulnerable-back]').forEach((el) => {
      el.setAttribute('href', backHref);
    });

    document.querySelectorAll('.precision-detail-page .detail-tabs__btn').forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab || 'vulnerable';
        const p = new URLSearchParams();
        if (facilityId) p.set('id', facilityId);
        p.set('tab', target);
        window.location.href = `facility-detail.html?${p.toString()}`;
      });
    });

    if (!isAddMode && !loadRecord()) {
      alert('해당 기록을 찾을 수 없습니다.');
      window.location.href = backHref;
      return;
    }
    if (isAddMode) loadRecord();

    toggleModeUI();

    document.getElementById('vulnerableEditBtn')?.addEventListener('click', () => {
      state.detailMode = 'edit';
      const item = window.VulnerableData.getById(state.selectedId);
      renderStageTable(item);
      toggleModeUI();
    });

    document.getElementById('vulnerableFormCancelBtn')?.addEventListener('click', () => {
      if (state.detailMode === 'add') {
        window.location.href = backHref;
        return;
      }
      state.detailMode = 'view';
      loadRecord();
      toggleModeUI();
    });

    document.getElementById('vulnerableDeleteBtn')?.addEventListener('click', () => {
      if (state.selectedId == null) return;
      if (!window.confirm('선택한 취약시설물 중점관리 기록을 삭제하시겠습니까?')) return;
      window.VulnerableData.remove(state.selectedId);
      alert('삭제되었습니다. (샘플)');
      window.location.href = backHref;
    });

    document.getElementById('vulnerableSaveBtn')?.addEventListener('click', () => {
      alert('취약시설물 중점관리 기록이 저장되었습니다. (샘플)');
      if (state.detailMode === 'edit' && state.selectedId != null) {
        state.detailMode = 'view';
        loadRecord();
        toggleModeUI();
      } else {
        window.location.href = backHref;
      }
    });

    document.getElementById('vulnerableRelatedInspectionBtn')?.addEventListener('click', () => {
      if (typeof window.openRepairRelatedInspectionModal === 'function') {
        window.openRepairRelatedInspectionModal('vulnerableRelatedInspection');
      }
    });

    document.getElementById('vulnerableRestrictionFileBtn')?.addEventListener('click', () => {
      document.getElementById('vulnerableRestrictionFile')?.click();
    });

    document.getElementById('vulnerableRestrictionFile')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const nameEl = document.getElementById('vulnerableRestrictionFileName');
      if (nameEl) nameEl.textContent = file.name;
      const preview = document.getElementById('vulnerableRestrictionPreview');
      if (preview) {
        preview.innerHTML = `<img class="vuln-fig-media" src="${URL.createObjectURL(file)}" alt="미리보기">`;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
