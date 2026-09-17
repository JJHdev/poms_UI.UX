(() => {
  const $ = (id) => document.getElementById(id);

  const FIELD_LABELS = [
    ['name', '시설물명'],
    ['address', '주소'],
    ['fmsId', 'FMS_ID'],
    ['manageType', '관리구분'],
    ['agency', '관리기관'],
    ['port', '항명'],
    ['subPort', '세부항명'],
    ['completionDate', '준공일자'],
    ['classType', '종별'],
    ['facilityType', '시설구분'],
    ['facilityFormat', '시설형식'],
    ['structureType', '구조형식'],
    ['length', '연장(m)'],
    ['otherSpec', '기타상세제원'],
    ['openStatus', '개방여부'],
    ['berth', '선석'],
    ['berthingCapacity', '접안능력'],
    ['cargo', '취급화물'],
    ['seismic', '내진설계 적용여부'],
    ['managerOpinion', '관리자의견'],
    ['depthMin', '전면수심(최소)(m)'],
    ['depthMax', '전면수심(최대)(m)'],
    ['loadMin', '상세하중(최소)(ton/㎡)'],
    ['loadMax', '상세하중(최대)(ton/㎡)'],
    ['coordinates', '좌표'],
    ['dms', '도분초(DMS)'],
    ['remarks', '비고'],
  ];

  const STATUS_BADGE = {
    requested: '<span class="fcd-badge fcd-badge--requested">요청중</span>',
    approved: '<span class="fcd-badge fcd-badge--approved">승인</span>',
    rejected: '<span class="fcd-badge fcd-badge--rejected">반려</span>',
  };

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
      seismic: row.seismic === 'Y' ? '적용' : '미적용',
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

  function goList() {
    window.location.href = 'facility-change-approval.html';
  }

  const params = new URLSearchParams(window.location.search);
  const reqId = Number(params.get('id'));
  const source = params.get('source') || 'approval';
  const request = FACILITY_CHANGE_REQUESTS.find((r) => r.id === reqId) || null;
  const facilityRow = request ? FACILITY_MANAGEMENT_ROWS.find((r) => r.id === request.facilityId) : null;

  PomsSidebarAdmin.mount('#sidebar-root', { active: 'approval-facility-change' });

  if (!request || !facilityRow) {
    alert('변경요청 정보를 찾을 수 없습니다.');
    goList();
    return;
  }

  $('fcdCrumb').textContent = `${request.facilityName} 변경요청`;

  function renderMeta() {
    const evidenceValue = request.evidence
      ? `<a href="#" onclick="alert('증빙자료를 다운로드합니다. (샘플)');return false;">${request.evidence}</a>`
      : '<span class="fcd-meta__value--muted">첨부 없음</span>';
    const showEvidence = request.type !== '시설물 일반정보 변경';
    const rejectRow = request.status === 'rejected'
      ? `<tr><th scope="row">반려 사유</th><td colspan="3"><span class="fcd-meta__value--reject">${request.rejectReason || '-'}</span></td></tr>`
      : '';

    $('fcdMeta').innerHTML = [
      `<tr>
        <th scope="row">요청 구분</th><td>${request.type}</td>
        <th scope="row">요청일시</th><td>${request.requestedAt}</td>
      </tr>`,
      `<tr>
        <th scope="row">요청자</th><td>${request.requester} (${request.org})</td>
        <th scope="row">처리상태</th><td>${STATUS_BADGE[request.status] || ''}</td>
      </tr>`,
      showEvidence
        ? `<tr>
            <th scope="row">변경일자</th><td>${request.changeDate || '-'}</td>
            <th scope="row">증빙자료</th><td>${evidenceValue}</td>
          </tr>`
        : `<tr>
            <th scope="row">변경일자</th><td colspan="3">${request.changeDate || '-'}</td>
          </tr>`,
      `<tr>
        <th scope="row">요청 사유</th><td colspan="3">${request.reason}</td>
      </tr>`,
      rejectRow,
    ].join('');
  }

  function renderCompare() {
    const before = buildFacilityFormData(facilityRow);
    const isDelete = request.type === '시설물 삭제';
    const isTransfer = request.type === '관리주체변경이관';
    $('fcdDeleteBanner').classList.toggle('show', isDelete);

    if (isTransfer) {
      const beforeAgency = before.agency || '-';
      const afterAgency = request.changes.agency || '-';
      $('fcdCompareBody').innerHTML = `
        <tr class="changed">
          <td class="item">관리기관</td>
          <td>${beforeAgency}</td>
          <td class="after">${afterAgency}</td>
          <td class="c"><span class="chg-mark">변경</span></td>
        </tr>
      `;
      return;
    }

    $('fcdCompareBody').innerHTML = FIELD_LABELS.map(([key, label]) => {
      const beforeValue = before[key] || '-';
      const lockedField = !isDelete && key === 'agency';
      const changed = !isDelete && !lockedField && Object.prototype.hasOwnProperty.call(request.changes, key);
      const afterValue = isDelete ? '—' : (changed ? (request.changes[key] || '-') : beforeValue);
      return `
        <tr class="${changed ? 'changed' : ''}">
          <td class="item">${label}</td>
          <td>${beforeValue}</td>
          <td class="after"${lockedField ? ' style="color:#9aa3b2"' : ''}>${afterValue}</td>
          <td class="c">${changed ? '<span class="chg-mark">변경</span>' : '<span class="no-mark">—</span>'}</td>
        </tr>
      `;
    }).join('');
  }

  function updateFooter() {
    const foot = $('fcdFooter');
    if (!foot) return;
    const show = request.status === 'requested';
    foot.hidden = !show;
    $('fcdRejectBtn').hidden = !show;
    $('fcdApproveBtn').hidden = !show;
  }

  /* ---------- 시설물 정보 탭 — facility-detail.html 을 임베드해 탭 내용만 표시 ----------
     각 탭은 facility-detail.html?id=south&tab=<key>&embed=1 을 iframe 으로 로드한다.
     조회 전용: 목록 행 클릭으로 상세 모달/다른 페이지에 진입하지 않는다. */
  function renderFacilityInfo() {
    const INFO_TABS = [
      ['일반정보', 'general'],
      ['안전점검실적', 'precision'],
      ['보수보강실적', 'repair'],
      ['취약시설물 중점관리', 'vulnerable'],
      ['중대결함 사후관리', 'major-defect'],
      ['이력정보', 'history'],
      ['안전시설현황', 'safety'],
      ['대가산정', 'calculrate'],
    ];
    const tabsEl = $('fcdInfoTabs');
    const bodyEl = $('fcdInfoBody');
    const frames = {};

    function frameHtml(key) {
      return `<iframe src="facility-detail.html?id=south&tab=${key}&embed=1" title="시설물 정보 — ${key}"></iframe>`;
    }

    function showTab(index) {
      const key = INFO_TABS[index][1];
      if (!frames[key]) frames[key] = frameHtml(key);
      bodyEl.innerHTML = frames[key];
    }

    tabsEl.innerHTML = INFO_TABS.map(([label], i) => `<button type="button" class="fcd-info-tabs__btn${i === 0 ? ' is-active' : ''}" data-info-tab="${i}">${label}</button>`).join('');
    showTab(0);
    tabsEl.querySelectorAll('[data-info-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        tabsEl.querySelectorAll('[data-info-tab]').forEach((t) => t.classList.toggle('is-active', t === btn));
        showTab(Number(btn.dataset.infoTab));
      });
    });
  }

  $('fcdBackBtn').addEventListener('click', goList);

  $('fcdApproveBtn').addEventListener('click', () => {
    request.status = 'approved';
    alert(`[${request.type}] ${request.facilityName} 변경요청이 승인되었습니다. (샘플)`);
    renderMeta();
    updateFooter();
  });

  function closeRejectModal() {
    $('fcdRejectModal').hidden = true;
  }

  $('fcdRejectBtn').addEventListener('click', () => {
    $('fcdRejectReason').value = '';
    $('fcdRejectModal').hidden = false;
    $('fcdRejectReason').focus();
  });

  $('fcdRejectSubmit').addEventListener('click', () => {
    const reason = $('fcdRejectReason').value.trim();
    if (!reason) {
      alert('반려 사유를 입력하세요.');
      $('fcdRejectReason').focus();
      return;
    }
    request.status = 'rejected';
    request.rejectReason = reason;
    closeRejectModal();
    alert('반려 처리되었습니다. 반려 사유가 결재이력에 기록됩니다. (샘플)');
    renderMeta();
    updateFooter();
  });

  document.querySelectorAll('[data-close-reject]').forEach((el) => el.addEventListener('click', closeRejectModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeRejectModal();
  });

  renderMeta();

  // 어느 탭에서 상세로 들어왔는지에 따라 섹션을 확실하게 분리
  // hidden 속성만 쓰면 기존 CSS의 display 규칙에 의해 다시 보일 수 있으므로
  // display:none !important 까지 직접 적용한다.
  const facilityInfoCard = $('fcdFacilityInfoCard');
  const compareCard = $('fcdCompareCard');

  function hideSection(el) {
    if (!el) return;
    el.hidden = true;
    el.style.setProperty('display', 'none', 'important');
  }

  function showSection(el) {
    if (!el) return;
    el.hidden = false;
    el.style.removeProperty('display');
  }

  if (source === 'demolish') {
    // 시설물 철거 상세
    showSection(facilityInfoCard);
    hideSection(compareCard);
    renderFacilityInfo();
  } else {
    // 변경요청 승인/반려 상세
    hideSection(facilityInfoCard);
    showSection(compareCard);
    renderCompare();
  }

  updateFooter();
})();
