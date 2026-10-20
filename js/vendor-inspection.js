/**
 * 점검보고서 등록 — 단계: 목록 → 이력 → 읽기 → 추가(편집)
 */
(() => {
  const RESULT_STATUS_OPTIONS = [
    { value: 'good', label: '양호' },
    { value: 'fair', label: '보통' },
    { value: 'poor', label: '불량' },
  ];

  const ITEM_TEMPLATE = [
    {
      category: '상부공 및 본체부',
      items: [
        { name: '침하', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
        { name: '경사/전도', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
        { name: '활동', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
        { name: '파손', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
        { name: '균열', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
        { name: '박리', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
        { name: '마모/침식', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
        { name: '속채움재 유실', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
        { name: '이격', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
        { name: '방충재', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
      ],
    },
    {
      category: '사석경사면',
      items: [
        { name: '사면변화', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
        { name: '피복석 유실', required: true, status: 'good', memo: '', opinion: '', maint: 'N' },
      ],
    },
  ];

  function cloneItemGroups(groups) {
    return JSON.parse(JSON.stringify(groups));
  }

  function emptyItemGroups() {
    return cloneItemGroups(ITEM_TEMPLATE);
  }

  const FACILITIES = [
    {
      id: 'ul1',
      no: 1,
      portClass: '국가관리',
      mgmtClass: '직접관리',
      agency: '울산항만공사',
      seaArea: '동해',
      portName: '울산항',
      subPort: '울산',
      facilityType: '계류',
      facility: '물양장(1)',
      status: '승인',
      detail: {
        name: '물양장(1)',
        owner: '포항지방해양수산청',
        surveyUnit: '',
        evalUnit: '',
        completed: '2026-03-12',
        lastInspection: '2026-03-12',
      },
    },
    {
      id: 'ul2',
      no: 2,
      portClass: '국가관리',
      mgmtClass: '직접관리',
      agency: '울산항만공사',
      seaArea: '동해',
      portName: '울산항',
      subPort: '울산',
      facilityType: '계류',
      facility: '울양장(2)',
      status: '승인',
      detail: {
        name: '울양장(2)',
        owner: '포항지방해양수산청',
        surveyUnit: '조사단위',
        evalUnit: '평가단위',
        completed: '2025.11.15',
        lastInspection: '2026.02.20',
      },
    },
    {
      id: 'south',
      no: 3,
      portClass: '국가관리',
      mgmtClass: '직접관리',
      agency: '부산항만공사',
      seaArea: '남해',
      portName: '부산항',
      subPort: '남항',
      facilityType: '외곽',
      facility: '남방파제',
      status: '승인',
      detail: {
        name: '남방파제',
        owner: '부산지방해양수산청',
        surveyUnit: '조사단위 A',
        evalUnit: '평가단위 B',
        completed: '2024.08.10',
        lastInspection: '2026.01.12',
      },
    },
    {
      id: 'f4',
      no: 4,
      portClass: '지방관리',
      mgmtClass: '위탁관리',
      agency: '여수광양항만공사',
      seaArea: '남해',
      portName: '여수항',
      subPort: '여수',
      facilityType: '계류',
      facility: '여수 제1부두',
      status: '승인',
      detail: {
        name: '여수 제1부두',
        owner: '여수지방해양수산청',
        surveyUnit: '조사단위',
        evalUnit: '평가단위',
        completed: '2023.05.20',
        lastInspection: '2025.12.01',
      },
    },
    {
      id: 'f5',
      no: 5,
      portClass: '국가관리',
      mgmtClass: '직접관리',
      agency: '인천항만공사',
      seaArea: '서해',
      portName: '인천항',
      subPort: '연안',
      facilityType: '외곽',
      facility: '연안 방파제',
      status: '승인',
      detail: {
        name: '연안 방파제',
        owner: '인천지방해양수산청',
        surveyUnit: '조사단위',
        evalUnit: '평가단위',
        completed: '2022.09.30',
        lastInspection: '2025.10.18',
      },
    },
    {
      id: 'f6',
      no: 6,
      portClass: '국가관리',
      mgmtClass: '직접관리',
      agency: '부산항만공사',
      seaArea: '남해',
      portName: '부산항',
      subPort: '북항',
      facilityType: '계류',
      facility: '북항 계류시설',
      status: '승인',
      detail: {
        name: '북항 계류시설',
        owner: '부산지방해양수산청',
        surveyUnit: '조사단위',
        evalUnit: '평가단위',
        completed: '2021.04.05',
        lastInspection: '2025.09.22',
      },
    },
  ];

  const INSPECTION_HISTORY = [
    {
      id: 'h1',
      date: '2026.03.03',
      agency: '한국항만협회',
      inspector: '김점검',
      condition: '양호',
      opinion: '특이사항 없음',
      attach: 1,
      status: 'draft',
      inspectionDate: '2026-03-03',
      specialNotes: '',
      inspectorOpinion: '특이사항 없음',
      items: (() => {
        const g = cloneItemGroups(ITEM_TEMPLATE);
        g[0].items[0].memo = '침하 경미';
        g[0].items[4].status = 'fair';
        g[0].items[4].memo = '균열 관찰';
        g[0].items[4].opinion = '추가 모니터링';
        g[0].items[4].maint = 'Y';
        return g;
      })(),
    },
    {
      id: 'h2',
      date: '2025.12.15',
      agency: '한국항만협회',
      inspector: '이안전',
      condition: '양호',
      opinion: '보수 권고',
      attach: 2,
      status: 'approved',
      inspectionDate: '2025-12-15',
      specialNotes: '남측 호안부 확인',
      inspectorOpinion: '보수 권고',
      items: cloneItemGroups(ITEM_TEMPLATE),
    },
    {
      id: 'h3',
      date: '2025.06.01',
      agency: '한국항만협회',
      inspector: '박정기',
      condition: '보통',
      opinion: '균열 확인',
      attach: 0,
      status: 'approved',
      inspectionDate: '2025-06-01',
      specialNotes: '',
      inspectorOpinion: '균열 확인',
      items: cloneItemGroups(ITEM_TEMPLATE),
    },
  ];

  /** @type {'list'|'history'|'view'|'edit'} */
  let phase = 'list';
  let selectedFacilityId = null;
  let selectedHistoryId = null;

  const vendorBody = document.querySelector('.vendor-page--inspection');
  const facilityBody = document.getElementById('facilityListBody');
  const historyBody = document.getElementById('inspectionHistoryBody');
  const facilityCount = document.getElementById('facilityCount');
  const detailRoot = document.getElementById('facilityDetail');
  const itemsBody = document.getElementById('inspectionItemsBody');
  const inspectionSplit = document.getElementById('inspectionSplit');
  const facilityDetailSection = document.getElementById('facilityDetailSection');
  const inspectionDetailSection = document.getElementById('inspectionDetailSection');
  const inspectionPageFooter = document.getElementById('inspectionPageFooter');
  const inspectionFacilityForm = document.getElementById('inspectionFacilityForm');
  const inspectionDateEl = document.getElementById('inspectionDate');
  const specialNotesEl = document.getElementById('specialNotes');
  const inspectorOpinionEl = document.getElementById('inspectorOpinion');
  const facilitySurveyUnitEl = document.getElementById('facilitySurveyUnit');
  const facilityEvalUnitEl = document.getElementById('facilityEvalUnit');
  const facilityCompletedEl = document.getElementById('facilityCompleted');
  const facilityLastInspectionEl = document.getElementById('facilityLastInspection');

  function formatDisplayDate(value) {
    if (!value) return '-';
    return String(value).replace(/\./g, '-');
  }

  function toInputDate(value) {
    if (!value) return '';
    return String(value).replace(/\./g, '-').slice(0, 10);
  }

  function statusLabel(value) {
    return RESULT_STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
  }

  function typeTag(type) {
    const isOuter = type === '외곽';
    const cls = isOuter ? 'tag-facility-type--outer' : 'tag-facility-type--mooring';
    return `<span class="tag-facility-type ${cls}">${type}</span>`;
  }

  function statusBadge(status) {
    if (status === 'draft') {
      return '<span class="status-text status-text--draft">임시저장</span>';
    }
    return '<span class="status-text status-text--approved">승인</span>';
  }

  function updatePhase() {
    if (!vendorBody) return;

    vendorBody.classList.remove('phase-list', 'phase-history', 'phase-view', 'phase-edit');
    vendorBody.classList.add(`phase-${phase}`);

    const showSplit = phase !== 'list';
    const showDetailPanel = phase === 'view';
    const showFacilityFormInTab = phase === 'edit';
    const showItems = phase === 'view' || phase === 'edit';
    const isEdit = phase === 'edit';

    if (inspectionSplit) inspectionSplit.hidden = !showSplit;
    if (facilityDetailSection) facilityDetailSection.hidden = !showDetailPanel;
    if (inspectionFacilityForm) inspectionFacilityForm.hidden = !showFacilityFormInTab;
    if (inspectionDetailSection) {
      inspectionDetailSection.hidden = !showItems;
      inspectionDetailSection.classList.toggle('is-readonly', phase === 'view');
    }
    if (inspectionPageFooter) inspectionPageFooter.hidden = true;
  }

  function renderFacilities() {
    if (!facilityBody) return;
    facilityBody.innerHTML = FACILITIES.map((f) => `
      <tr data-id="${f.id}" class="${f.id === selectedFacilityId ? 'is-selected' : ''}">
        <td>${f.no}</td>
        <td>${f.portClass}</td>
        <td>${f.mgmtClass}</td>
        <td>${f.agency}</td>
        <td>${f.seaArea}</td>
        <td>${f.portName}</td>
        <td>${f.subPort}</td>
        <td>${typeTag(f.facilityType)}</td>
        <td>${f.facility}</td>
        <td><span class="status-text status-text--approved">승인</span></td>
      </tr>
    `).join('');

    if (facilityCount) {
      facilityCount.innerHTML = `<em>${FACILITIES.length}</em>개 시설`;
    }
  }

  function renderHistory() {
    if (!historyBody) return;
    historyBody.innerHTML = INSPECTION_HISTORY.map((row) => `
      <tr data-history-id="${row.id}" class="is-clickable-history${row.id === selectedHistoryId ? ' is-selected' : ''}">
        <td>${row.date}</td>
        <td>${row.agency}</td>
        <td>${row.inspector}</td>
        <td>${row.condition}</td>
        <td>${row.opinion}</td>
        <td>${
          row.attach
            ? `<span class="attach-count">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                ${row.attach}
              </span>`
            : '-'
        }</td>
        <td>${statusBadge(row.status)}</td>
      </tr>
    `).join('');
  }

  function renderDetail() {
    const f = FACILITIES.find((x) => x.id === selectedFacilityId);
    if (!detailRoot || !f) {
      if (detailRoot) detailRoot.innerHTML = '';
      return;
    }
    const d = f.detail;
    detailRoot.innerHTML = `
      <dl class="facility-detail-list">
        <div><dt>시설명</dt><dd>${d.name}</dd></div>
        <div><dt>관리주체</dt><dd>${d.owner}</dd></div>
        <div><dt>조사단위</dt><dd>${d.surveyUnit}</dd></div>
        <div><dt>평가단위</dt><dd>${d.evalUnit}</dd></div>
        <div><dt>준공 년월일</dt><dd>${d.completed}</dd></div>
        <div><dt>최종점검 년월일</dt><dd>${d.lastInspection}</dd></div>
      </dl>`;
  }

  function renderFacilityFormInTab() {
    const f = FACILITIES.find((x) => x.id === selectedFacilityId);
    const nameEl = document.getElementById('formFacilityName');
    const ownerEl = document.getElementById('formFacilityOwner');

    if (!f) {
      if (nameEl) nameEl.textContent = '';
      if (ownerEl) ownerEl.textContent = '';
      if (facilitySurveyUnitEl) facilitySurveyUnitEl.value = '';
      if (facilityEvalUnitEl) facilityEvalUnitEl.value = '';
      if (facilityCompletedEl) facilityCompletedEl.value = '';
      if (facilityLastInspectionEl) facilityLastInspectionEl.value = '';
      return;
    }

    const d = f.detail;
    if (nameEl) nameEl.textContent = d.name;
    if (ownerEl) ownerEl.textContent = d.owner;
    if (facilitySurveyUnitEl) facilitySurveyUnitEl.value = d.surveyUnit || '';
    if (facilityEvalUnitEl) facilityEvalUnitEl.value = d.evalUnit || '';
    if (facilityCompletedEl) facilityCompletedEl.value = toInputDate(d.completed);
    if (facilityLastInspectionEl) facilityLastInspectionEl.value = toInputDate(d.lastInspection);
  }

  function resultSelectHtml(item, readOnly) {
    if (readOnly) {
      return `<div class="inspection-result-readonly">
        <span class="inspection-result-readonly__status">${statusLabel(item.status)}</span>
        <span class="inspection-result-readonly__memo">${item.memo || '-'}</span>
      </div>`;
    }
    const status = item.status || 'good';
    const options = RESULT_STATUS_OPTIONS.map(
      (o) => `<option value="${o.value}"${status === o.value ? ' selected' : ''}>${o.label}</option>`
    ).join('');
    return `<select class="inspection-result-select" aria-label="${item.name} 점검결과">${options}</select>`;
  }

  function maintSelectHtml(item, readOnly) {
    if (readOnly) {
      return `<span class="inspection-readonly-text">${item.maint || 'N'}</span>`;
    }
    const maint = item.maint || 'N';
    return `<select class="inspection-maint-select" aria-label="${item.name} 보수필요여부">
      <option value="N"${maint === 'N' ? ' selected' : ''}>N</option>
      <option value="Y"${maint === 'Y' ? ' selected' : ''}>Y</option>
    </select>`;
  }

  function renderInspectionItems(readOnly, groups) {
    if (!itemsBody) return;
    let html = '';
    groups.forEach((group) => {
      group.items.forEach((item, idx) => {
        const categoryCell =
          idx === 0
            ? `<td class="cell-category" rowspan="${group.items.length}">${group.category}</td>`
            : '';
        const requiredMark = item.required ? '<span class="required">*</span>' : '';

        const resultCell = readOnly
          ? resultSelectHtml(item, true)
          : `<div class="inspection-result-cell">
              ${resultSelectHtml(item, false)}
              <input type="text" class="inspection-result-memo" placeholder="점검자의견내용 작성" value="${item.memo || ''}" aria-label="${item.name} 점검자 의견">
            </div>`;

        const opinionCell = readOnly
          ? `<span class="inspection-readonly-text">${item.opinion || '-'}</span>`
          : `<textarea class="inspection-opinion-input" rows="2" placeholder="의견을 입력하세요." aria-label="${item.name} 의견">${item.opinion || ''}</textarea>`;

        const photoCell = readOnly
          ? `<span class="inspection-readonly-text">-</span>`
          : `<button type="button" class="btn-photo-add" aria-label="${item.name} 사진 추가">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              사진 추가
            </button>`;

        html += `
          <tr>
            ${categoryCell}
            <td class="inspection-item-name">${item.name}${requiredMark}</td>
            <td class="cell-result">${resultCell}</td>
            <td class="cell-opinion">${opinionCell}</td>
            <td class="cell-maint">${maintSelectHtml(item, readOnly)}</td>
            <td class="cell-photo">${photoCell}</td>
          </tr>`;
      });
    });
    itemsBody.innerHTML = html;
  }

  function fillExtraFields(extra) {
    if (inspectionDateEl) inspectionDateEl.value = extra.inspectionDate || '';
    if (specialNotesEl) specialNotesEl.value = extra.specialNotes || '';
    if (inspectorOpinionEl) inspectorOpinionEl.value = extra.inspectorOpinion || '';
  }

  function showHistoryView(history) {
    selectedHistoryId = history.id;
    phase = 'view';
    renderFacilities();
    renderHistory();
    renderDetail();
    renderInspectionItems(true, cloneItemGroups(history.items));
    fillExtraFields(history);
    updatePhase();
  }

  function showEditMode(groups, extra) {
    phase = 'edit';
    renderFacilities();
    renderHistory();
    renderFacilityFormInTab();
    renderInspectionItems(false, cloneItemGroups(groups));
    fillExtraFields(extra);
    updatePhase();
  }

  facilityBody?.addEventListener('click', (e) => {
    const row = e.target.closest('tr[data-id]');
    if (!row) return;
    selectedFacilityId = row.dataset.id;
    selectedHistoryId = null;
    phase = 'history';
    renderFacilities();
    renderHistory();
    renderDetail();
    updatePhase();
  });

  historyBody?.addEventListener('click', (e) => {
    const row = e.target.closest('tr[data-history-id]');
    if (!row || phase === 'list') return;
    const history = INSPECTION_HISTORY.find((h) => h.id === row.dataset.historyId);
    if (history) showHistoryView(history);
  });

  document.getElementById('btnAddInspection')?.addEventListener('click', () => {
    if (!selectedFacilityId) return;
    selectedHistoryId = null;
    renderHistory();
    const today = new Date().toISOString().slice(0, 10);
    showEditMode(emptyItemGroups(), {
      inspectionDate: today,
      specialNotes: '',
      inspectorOpinion: '',
    });
  });

  function bindTabs() {
    const tabs = document.querySelectorAll('.inspection-tab');
    const panels = {
      items: document.getElementById('panelItems'),
      photos: document.getElementById('panelPhotos'),
      report: document.getElementById('panelReport'),
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.tab;
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        Object.entries(panels).forEach(([id, panel]) => {
          if (!panel) return;
          const show = id === key;
          panel.classList.toggle('is-hidden', !show);
          panel.hidden = !show;
        });
      });
    });
  }

  function bindItemActions() {
    const onDraft = () => alert('임시저장되었습니다. (샘플)');
    const onSave = () => alert('점검사항이 저장되었습니다. (샘플)');

    document.getElementById('btnDraft')?.addEventListener('click', onDraft);
    document.getElementById('btnSubmit')?.addEventListener('click', () => {
      alert('점검보고서를 발주기관에 신청합니다. (샘플)');
    });
    document.getElementById('btnItemsDraft')?.addEventListener('click', onDraft);
    document.getElementById('btnItemsSave')?.addEventListener('click', onSave);
  }

  renderFacilities();
  renderHistory();
  updatePhase();
  bindTabs();
  bindItemActions();
})();
