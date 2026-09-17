/**
 * 보수보강 실적 상세/등록 페이지
 */
(function () {
  const FACILITIES = {
    south: { name: '남방파제', location: '부산광역시 중구 항만로 · 부산항 북항' },
    gamman: { name: '감만부두 동측안벽', location: '부산광역시 중구 · 부산항 북항' },
    sinseondae: { name: '신선대부두', location: '부산광역시 중구 · 부산항 북항' },
    north: { name: '북방파제', location: '부산광역시 중구 항만로 · 부산항 북항' },
  };

  const FORM_FIELDS = [
    'repairProjectName',
    'repairInspectionYear',
    'repairConstructionType',
    'repairPeriodStart',
    'repairPeriodEnd',
    'repairRelatedInspection',
    'repairContractMethod',
    'repairDesigner',
    'repairContractor',
    'repairEngineer',
    'repairSupervisor',
    'repairPart',
    'repairDetails',
    'repairCost',
    'repairSeismicReinforcement',
    'repairProjectNature',
    'repairAuthor',
    'repairCreatedDate',
  ];

  const EDIT_LOCKED_FIELDS = ['repairAuthor', 'repairCreatedDate'];

  const params = new URLSearchParams(window.location.search);
  const facilityId = params.get('facilityId') || 'south';
  const isAddMode = params.get('mode') === 'add';
  const recordId = !isAddMode && params.get('id') !== null ? Number(params.get('id')) : null;

  const state = {
    selectedId: recordId,
    detailMode: isAddMode ? 'add' : 'view',
    editingParts: [],
    designSpecFileName: '',
    designSpecFileName2: '',
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
    p.set('tab', 'repair');
    return `facility-detail.html?${p.toString()}`;
  }

  function setFormFieldStates() {
    const form = document.getElementById('repairDetailForm');
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
          el.style.setProperty('color', '#1c6fff', 'important');
          el.style.setProperty('-webkit-text-fill-color', '#1c6fff', 'important');
        } else {
          el.disabled = disabled;
          el.style.pointerEvents = '';
          el.style.removeProperty('color');
          el.style.removeProperty('-webkit-text-fill-color');
        }
        return;
      }

      if (el.type === 'date') {
        if (isView || lockedInForm) {
          el.disabled = false;
          el.readOnly = true;
          el.style.pointerEvents = 'none';
          el.style.setProperty('color', '#1c6fff', 'important');
          el.style.setProperty('-webkit-text-fill-color', '#1c6fff', 'important');
        } else {
          el.disabled = false;
          el.readOnly = false;
          el.style.pointerEvents = '';
          el.style.removeProperty('color');
          el.style.removeProperty('-webkit-text-fill-color');
        }
        return;
      }

      if (el.tagName === 'TEXTAREA') {
        el.readOnly = disabled;
        el.disabled = false;
        if (isView) {
          el.style.setProperty('color', '#1c6fff', 'important');
          el.style.setProperty('-webkit-text-fill-color', '#1c6fff', 'important');
        } else {
          el.style.removeProperty('color');
          el.style.removeProperty('-webkit-text-fill-color');
        }
        return;
      }

      el.readOnly = disabled;
      el.disabled = false;
      if (isView || lockedInForm) {
        el.style.setProperty('color', '#1c6fff', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#1c6fff', 'important');
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

  function syncEditingPartsFromInputs() {
    const tbody = document.getElementById('repairPartsBody');
    if (!tbody) return;

    state.editingParts = Array.from(tbody.querySelectorAll('tr[data-part-row]')).map((row) => ({
      part: row.querySelector('[data-field="part"]')?.value || '',
      method: row.querySelector('[data-field="method"]')?.value || '',
      quantity: row.querySelector('[data-field="quantity"]')?.value || '',
      unit: row.querySelector('[data-field="unit"]')?.value || '',
      cost: row.querySelector('[data-field="cost"]')?.value || '',
    }));
  }

  function bindPartsRowEvents() {
    const tbody = document.getElementById('repairPartsBody');
    if (!tbody) return;

    tbody.querySelectorAll('.prec-tech-input').forEach((input) => {
      input.addEventListener('input', syncEditingPartsFromInputs);
    });

    tbody.querySelectorAll('[data-part-delete]').forEach((btn) => {
      btn.addEventListener('click', () => {
        syncEditingPartsFromInputs();
        const index = Number(btn.dataset.partDelete);
        if (Number.isNaN(index)) return;
        state.editingParts.splice(index, 1);
        renderPartsTable();
      });
    });
  }

  function renderPartsTable() {
    const tbody = document.getElementById('repairPartsBody');
    if (!tbody) return;

    const editable = isFormMode();
    const isView = state.detailMode === 'view';
    const parts = state.editingParts;
    const readonlyAttr = isView ? 'readonly' : '';

    if (!parts.length) {
      tbody.innerHTML = `<tr><td colspan="${editable ? 6 : 5}">${
        editable ? '행 추가 버튼으로 공사부위/부재를 등록하세요.' : '등록된 공사부위/부재가 없습니다.'
      }</td></tr>`;
      return;
    }

    tbody.innerHTML = parts
      .map(
        (row, index) => `<tr data-part-row="${index}">
          <td><input type="text" class="prec-tech-input" data-field="part" value="${escapeHtml(row.part)}" ${readonlyAttr}></td>
          <td><input type="text" class="prec-tech-input" data-field="method" value="${escapeHtml(row.method)}" ${readonlyAttr}></td>
          <td><input type="text" class="prec-tech-input" data-field="quantity" value="${escapeHtml(row.quantity)}" ${readonlyAttr}></td>
          <td><input type="text" class="prec-tech-input" data-field="unit" value="${escapeHtml(row.unit)}" ${readonlyAttr}></td>
          <td><input type="text" class="prec-tech-input" data-field="cost" value="${escapeHtml(row.cost)}" ${readonlyAttr}></td>
          ${editable ? `<td><button type="button" class="prec-tech-del-btn" data-part-delete="${index}">행 삭제</button></td>` : ''}
        </tr>`
      )
      .join('');

    if (isView) {
      tbody.querySelectorAll('input').forEach((el) => {
        el.style.setProperty('color', '#1c6fff', 'important');
        el.style.setProperty('-webkit-text-fill-color', '#1c6fff', 'important');
      });
    }

    if (editable) bindPartsRowEvents();
  }

  function updateDesignSpecFileName() {
    const nameEl = document.getElementById('repairDesignSpecName');
    if (nameEl) {
      const label = state.designSpecFileName || '설계내역서.pdf (540KB)';
      nameEl.textContent = label;
      nameEl.classList.toggle('is-empty', !state.designSpecFileName && state.detailMode === 'add');
    }
    const nameEl2 = document.getElementById('repairReportName');
    if (nameEl2) {
      const label2 = state.designSpecFileName2 || '점검보고서.pdf (540KB)';
      nameEl2.textContent = label2;
      nameEl2.classList.toggle('is-empty', !state.designSpecFileName2 && state.detailMode === 'add');
    }
  }

  function fillFormFields(item) {
    const data = item || (window.RepairData && window.RepairData.empty) || {};
    const map = {
      repairProjectName: data.projectName,
      repairInspectionYear: data.inspectionYear ?? '',
      repairConstructionType: data.constructionType ?? '',
      repairPeriodStart: data.periodStart,
      repairPeriodEnd: data.periodEnd,
      repairRelatedInspection: data.relatedInspection,
      repairContractMethod: data.contractMethod,
      repairDesigner: data.designer,
      repairContractor: data.contractor,
      repairEngineer: data.engineer,
      repairSupervisor: data.supervisor,
      repairPart: data.area,
      repairDetails: data.details,
      repairCost: data.cost === '-' ? '' : data.cost,
      repairSeismicReinforcement: data.seismicReinforcement ?? '',
      repairProjectNature: data.projectNature ?? '',
      repairAuthor: data.author,
      repairCreatedDate: data.createdDate,
    };

    Object.entries(map).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.value = value || '';
    });

    state.editingParts = (data.parts || []).map((row) => ({ ...row }));
    state.designSpecFileName = data.designSpecFileName || '';
    state.designSpecFileName2 = data.designSpecFileName2 || '';
    renderPartsTable();
    updateDesignSpecFileName();
  }

  function loadRecord() {
    if (state.detailMode === 'add') {
      fillFormFields(window.RepairData.getAddDefaults());
      return true;
    }
    const item = window.RepairData.getById(state.selectedId);
    if (!item) return false;
    fillFormFields(item);
    return true;
  }

  function updateHeader() {
    const crumbEl = document.getElementById('repairDetailCrumbCurrent');
    const text = state.detailMode === 'add'
      ? '보수보강 실적 등록'
      : state.detailMode === 'edit'
        ? '보수보강 실적 수정'
        : '보수보강 실적 상세정보';
    if (crumbEl) crumbEl.textContent = text;
  }

  function toggleModeUI() {
    const source = document.getElementById('repairModalSource');
    const editBtn = document.getElementById('repairEditBtn');
    const saveBtn = document.getElementById('repairSaveBtn');
    const formCancelBtn = document.getElementById('repairFormCancelBtn');
    const deleteBtn = document.getElementById('repairDeleteBtn');
    const isView = state.detailMode === 'view';
    const isForm = isFormMode();

    if (source) source.hidden = state.detailMode === 'add';
    if (editBtn) editBtn.hidden = !isView;
    if (deleteBtn) deleteBtn.hidden = !isView;
    if (saveBtn) saveBtn.hidden = !isForm;
    if (formCancelBtn) formCancelBtn.hidden = !isForm;

    document.body.classList.toggle('is-precision-form-mode', isForm);
    document.body.classList.toggle('is-precision-add-mode', state.detailMode === 'add');

    document.getElementById('repairRelatedInspectionBtn')?.toggleAttribute('hidden', !isForm);
    document.getElementById('repairPartsActions')?.toggleAttribute('hidden', !isForm);
    document.getElementById('repairPartsDeleteCol')?.toggleAttribute('hidden', !isForm);

    updateHeader();
    setFormFieldStates();
    renderPartsTable();
  }

  function init() {
    const facility = FACILITIES[facilityId] || FACILITIES.south;
    const nameEl = document.getElementById('repairDetailFacilityName');
    const addressEl = document.getElementById('repairDetailFacilityAddress');
    const portEl = document.getElementById('repairDetailFacilityPort');
    const parts = String(facility.location || '').split(/\s*·\s*/);
    if (nameEl) nameEl.textContent = facility.name;
    if (addressEl) addressEl.textContent = parts[0] || facility.location || '';
    if (portEl) portEl.textContent = parts[1] || '';
    document.title = `${facility.name} | 보수보강 실적 상세 | POMS`;

    const backHref = listUrl();
    document.querySelectorAll('[data-repair-back]').forEach((el) => {
      el.setAttribute('href', backHref);
    });

    document.querySelectorAll('.precision-detail-page .detail-tabs__btn').forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab || 'repair';
        const p = new URLSearchParams();
        if (facilityId) p.set('id', facilityId);
        p.set('tab', target);
        window.location.href = `facility-detail.html?${p.toString()}`;
      });
    });

    if (!isAddMode && !loadRecord()) {
      alert('해당 보수보강 실적을 찾을 수 없습니다.');
      window.location.href = backHref;
      return;
    }
    if (isAddMode) loadRecord();

    toggleModeUI();

    document.getElementById('repairEditBtn')?.addEventListener('click', () => {
      state.detailMode = 'edit';
      toggleModeUI();
    });

    document.getElementById('repairFormCancelBtn')?.addEventListener('click', () => {
      if (state.detailMode === 'add') {
        window.location.href = backHref;
        return;
      }
      state.detailMode = 'view';
      loadRecord();
      toggleModeUI();
    });

    document.getElementById('repairDeleteBtn')?.addEventListener('click', () => {
      if (state.selectedId == null) return;
      if (!window.confirm('선택한 보수보강 실적을 삭제하시겠습니까?')) return;
      window.RepairData.remove(state.selectedId);
      alert('삭제되었습니다. (샘플)');
      window.location.href = backHref;
    });

    document.getElementById('repairSaveBtn')?.addEventListener('click', () => {
      alert('보수보강 실적이 저장되었습니다. (샘플)');
      if (state.detailMode === 'edit' && state.selectedId != null) {
        state.detailMode = 'view';
        loadRecord();
        toggleModeUI();
      } else {
        window.location.href = backHref;
      }
    });

    document.querySelectorAll('#repairFilesWrap .precision-file-slot').forEach((slot) => {
      const input = slot.querySelector('input[type="file"]');
      const nameEl = slot.querySelector('.precision-file-slot__name');
      slot.querySelector('.precision-file-slot__upload')?.addEventListener('click', () => input?.click());
      input?.addEventListener('change', () => {
        const file = input.files && input.files[0];
        if (!file) return;
        if (slot.dataset.pdfOnly === '1' && !/\.pdf$/i.test(file.name)) {
          alert('점검보고서는 PDF 파일만 업로드 가능합니다.');
          input.value = '';
          return;
        }
        const prevName = nameEl && !nameEl.classList.contains('is-empty')
          ? (nameEl.textContent || '').trim()
          : '';
        if (nameEl) {
          nameEl.textContent = file.name;
          nameEl.classList.remove('is-empty');
          if (!nameEl.getAttribute('href')) nameEl.setAttribute('href', '#');
        }
        if (slot.id === 'repairDesignSpecSlot') state.designSpecFileName = file.name;
        if (slot.id === 'repairReportSlot') state.designSpecFileName2 = file.name;
        if (prevName) {
          alert(`기존 파일(${prevName})이 "${file.name}" 파일로 대체되었습니다. (샘플)`);
        } else {
          alert(`"${file.name}" 파일이 첨부되었습니다. (샘플)`);
        }
        input.value = '';
      });
      nameEl?.addEventListener('click', (e) => {
        e.preventDefault();
        if (nameEl.classList.contains('is-empty') || !(nameEl.textContent || '').trim()) return;
        if (slot.dataset.pdfOnly === '1') {
          alert('안전점검보고서에서 신청하여 승인 후 다운로드가 가능합니다.');
        } else {
          alert('다운로드 권한이 없습니다.');
        }
      });
    });

    document.getElementById('repairPartsAddBtn')?.addEventListener('click', () => {
      syncEditingPartsFromInputs();
      state.editingParts.push({ part: '', method: '', quantity: '', unit: '', cost: '' });
      renderPartsTable();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
