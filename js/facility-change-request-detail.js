/**
 * 시설물 정보변경 요청 상세 — 기존 정보를 모두 수정 가능한 상태로 표시하고
 * 시설물 정보변경 구분을 선택해 관리자에게 승인 요청을 전송 (사용자 페이지)
 */
(() => {
  const state = { row: null };

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function goList() {
    window.location.href = 'facility-change-request.html';
  }

  function buildFacilityFormData(row) {
    const idNum = row.id.replace(/\D/g, '').padStart(4, '0');
    const classType = row.classType
      || (row.facilityType === '건축물' ? '1종' : row.facilityType === '기타' ? '기타' : '2종');

    return {
      name: row.name,
      address: row.address || `${row.seaArea}권 ${row.port} ${row.subPort}`,
      fmsId: row.fmsId || `FMS-${idNum}`,
      manageType: row.manageCategory === '위탁관리' ? '위탁관리' : '직접관리',
      agency: row.agency,
      port: row.port,
      subPort: row.subPort,
      completionDate: row.completionDate || '2007-01-01',
      classType,
      facilityType: row.facilityType,
      facilityFormat: row.facilityFormat || '기타',
      structureType: row.structureType || '철근콘크리트',
      length: row.length || '164',
      otherSpec: row.otherSpec || '',
      openStatus: row.openStatus || '개방',
      berth: row.berth || '',
      berthingCapacity: row.berthingCapacity || '',
      cargo: row.cargo || '',
      seismic: row.seismic || 'N',
      managerOpinion: row.managerOpinion || '',
      depthMin: row.depthMin || '',
      depthMax: row.depthMax || '',
      loadMin: row.loadMin || '',
      loadMax: row.loadMax || '',
      coordinates: row.coordinates || '',
      dms: row.dms || '',
      remarks: row.remarks || '',
    };
  }

  function ensureSelectOption(select, value) {
    if (!select || !value) return;
    const exists = Array.from(select.options).some((option) => option.value === value);
    if (!exists) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    }
    select.value = value;
  }

  function setFormValue(form, name, value) {
    const field = form?.elements.namedItem(name);
    if (!field) return;
    field.value = value ?? '';
  }

  function setAgencyFields(form, agency) {
    const select = form?.querySelector('select[name="agency"]');
    const direct = form?.querySelector('input[name="agencyDirectText"]');
    const match = select
      ? Array.from(select.options).find((option) => option.value === agency)
      : null;

    if (match && select) {
      select.value = agency;
      if (direct) direct.value = match.textContent.trim();
      return;
    }

    if (select) select.value = '';
    if (direct) direct.value = agency || '';
  }

  function populateForm(row) {
    const form = $('#facilityAddForm');
    if (!form || !row) return;

    const data = buildFacilityFormData(row);

    setFormValue(form, 'name', data.name);
    setFormValue(form, 'address', data.address);
    setFormValue(form, 'fmsId', data.fmsId);
    setFormValue(form, 'manageType', data.manageType);
    setAgencyFields(form, data.agency);
    ensureSelectOption(form.querySelector('select[name="port"]'), data.port);
    ensureSelectOption(form.querySelector('select[name="subPort"]'), data.subPort);
    setFormValue(form, 'completionDate', data.completionDate);
    setFormValue(form, 'classType', data.classType);
    setFormValue(form, 'facilityType', data.facilityType);
    setFormValue(form, 'facilityFormat', data.facilityFormat);
    setFormValue(form, 'structureType', data.structureType);
    setFormValue(form, 'structureDirectText', '');
    setFormValue(form, 'length', data.length);
    setFormValue(form, 'otherSpec', data.otherSpec);
    setFormValue(form, 'openStatus', data.openStatus);
    setFormValue(form, 'berth', data.berth);
    setFormValue(form, 'berthingCapacity', data.berthingCapacity);
    setFormValue(form, 'cargo', data.cargo);
    setFormValue(form, 'seismic', data.seismic);
    setFormValue(form, 'managerOpinion', data.managerOpinion);
    setFormValue(form, 'depthMin', data.depthMin);
    setFormValue(form, 'depthMax', data.depthMax);
    setFormValue(form, 'loadMin', data.loadMin);
    setFormValue(form, 'loadMax', data.loadMax);
    setFormValue(form, 'coordinates', data.coordinates);
    setFormValue(form, 'dms', data.dms);
    setFormValue(form, 'remarks', data.remarks);
  }

  function initFilePickers() {
    document.querySelectorAll('.fac-add-file-row').forEach((row) => {
      const input = row.querySelector('input[type="file"]');
      const btn = row.querySelector('.fac-add-file-picker__btn');
      const nameEl = row.querySelector('.fac-add-file-picker__name');
      const deleteBtn = row.querySelector('.btn-fac-file-delete');

      btn?.addEventListener('click', () => input?.click());
      input?.addEventListener('change', () => {
        const file = input.files?.[0];
        if (nameEl) nameEl.textContent = file ? file.name : '선택된 파일 없음';
      });
      deleteBtn?.addEventListener('click', () => {
        if (input) input.value = '';
        if (nameEl) nameEl.textContent = '선택된 파일 없음';
      });
    });
  }

  function bindSelectToInput(selectName, inputName) {
    const form = $('#facilityAddForm');
    const select = form?.querySelector(`select[name="${selectName}"]`);
    const input = form?.querySelector(`input[name="${inputName}"]`);
    if (!select || !input) return;

    select.addEventListener('change', () => {
      const option = select.selectedOptions[0];
      input.value = select.value && option ? option.textContent.trim() : '';
    });
  }

  /* ---------- 변경 요청 사유 작성 팝업 ---------- */
  /* ---------- 정보변경 구분에 따른 표시 제어 ----------
     선택 전: 아무것도 표시 안 함
     시설물 일반정보 변경: 전체 폼 표시
     관리주체변경이관: 관리기관 변경 전/후만 표시
     시설물 삭제: 아무것도 표시 안 함 */
  function setHidden(el, hide) {
    if (!el) return;
    if (hide) {
      el.setAttribute('hidden', '');
      el.style.display = 'none';
    } else {
      el.removeAttribute('hidden');
      el.style.display = '';
    }
  }

  function applyChangeType() {
    const type = $('#changeRequestType')?.value || '';
    const showFull = type === '시설물 일반정보 변경';
    const mainGrid = document.querySelector('#facilityAddForm .fac-add-grid:not(#crTransferSection):not(#crDateSection):not(#crEvidenceSection):not(#crReasonSection)');
    const filesSection = document.querySelector('#facilityAddForm .fac-add-files');
    const transferSection = $('#crTransferSection');
    const requestCard = $('#crRequestCard');
    const dateSection = $('#crDateSection');
    const evidenceSection = $('#crEvidenceSection');
    const reasonSection = $('#crReasonSection');

    setHidden(mainGrid, !showFull);
    setHidden(filesSection, !showFull);
    setHidden(transferSection, type !== '관리주체변경이관');
    setHidden(requestCard, !type);
    setHidden(dateSection, !type);
    setHidden(reasonSection, !type);

    // 증빙자료: 관리주체변경이관 = 필수, 시설물 삭제 = 선택, 일반정보 변경 = 숨김
    const showEvidence = type === '관리주체변경이관' || type === '시설물 삭제';
    setHidden(evidenceSection, !showEvidence);
    const evidenceReq = $('#crEvidenceReq');
    const evidenceHint = $('#crEvidenceHint');
    if (evidenceReq) evidenceReq.style.display = type === '관리주체변경이관' ? '' : 'none';
    if (evidenceHint) {
      if (type === '관리주체변경이관') {
        evidenceHint.textContent = '* 공문 및 인계인수서 등 증빙자료 필요';
        evidenceHint.style.color = '#E24B4A';
      } else {
        evidenceHint.textContent = '(선택) 증빙자료가 있으면 첨부하세요.';
        evidenceHint.style.color = '#6b7280';
      }
    }

    if (type === '관리주체변경이관') {
      const before = $('#crTransferBefore');
      if (before) before.value = state.row?.agency || '';
    }

    // 일반정보 변경 시 관리기관은 수정 불가(회색)
    if (showFull) {
      const agencySelect = document.querySelector('#facilityAddForm select[name="agency"]');
      const agencyDirect = document.querySelector('#facilityAddForm input[name="agencyDirectText"]');
      [agencySelect, agencyDirect].forEach((el) => {
        if (!el) return;
        el.disabled = true;
        el.classList.add('is-locked');
      });
    }
  }

  function handleRequest() {
    const type = $('#changeRequestType')?.value || '';
    if (!type) {
      alert('시설물 정보변경 구분을 선택하세요.');
      $('#changeRequestType')?.focus();
      return;
    }
    if (type === '관리주체변경이관' && !$('#crTransferAfter')?.value) {
      alert('변경 후 관리기관을 선택하세요.');
      $('#crTransferAfter')?.focus();
      return;
    }
    if (type === '관리주체변경이관' && !$('#crEvidenceFile')?.files?.length) {
      alert('증빙자료(공문·인계인수서 등)를 첨부하세요.');
      return;
    }
    const reason = $('#crChangeReason')?.value.trim() || '';
    if (!reason) {
      alert('변경요청 사유를 입력하세요.');
      $('#crChangeReason')?.focus();
      return;
    }

    if (!window.confirm(`[${type}] 요청으로 진행하시겠습니까?`)) return;

    alert(`[${type}] 요청이 관리자에게 전송되었습니다.\n관리자가 확인 후 승인/반려 처리합니다. (샘플)`);
    goList();
  }

  function init() {
    PomsSidebar.mount('#sidebar-root', { active: 'facility-change-request' });

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    state.row = id ? (FACILITY_MANAGEMENT_ROWS.find((row) => row.id === id) || null) : null;

    if (!state.row) {
      alert('시설물 정보를 찾을 수 없습니다.');
      goList();
      return;
    }

    const crumb = $('#facilityDetailCrumb');
    if (crumb) crumb.textContent = state.row.name;

    initFilePickers();
    bindSelectToInput('agency', 'agencyDirectText');
    bindSelectToInput('structureType', 'structureDirectText');

    $('#facilityDetailBackBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      goList();
    });
    $('#facCancelBtn')?.addEventListener('click', goList);
    $('#facRequestApprovalBtn')?.addEventListener('click', handleRequest);

    populateForm(state.row);

    $('#changeRequestType')?.addEventListener('change', applyChangeType);
    applyChangeType();

    // 증빙자료 파일 선택
    $('#crEvidenceBtn')?.addEventListener('click', () => $('#crEvidenceFile')?.click());
    $('#crEvidenceFile')?.addEventListener('change', () => {
      const nameEl = $('#crEvidenceName');
      const file = $('#crEvidenceFile')?.files?.[0];
      if (nameEl) nameEl.textContent = file ? file.name : '선택된 파일 없음';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
