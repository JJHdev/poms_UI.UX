/**
 * 시설물신청관리 화면 스크립트
 */
(() => {
  const requests = [
    {
      no: 1,
      userId: 'kpha_safe01',
      companyName: '한국항만안전진단(주)',
      serviceName: '2026년 상반기 부산항 정기안전점검 용역',
      applyDate: '2026-06-08',
      useYn: 'Y',
      manageName: '부산지방해양수산청',
      contactName: '강민석',
      contactPosition: '시설주사',
      contactTel: '051-609-6321',
      files: {
        contract: '계약서.pdf',
        order: '과업지시서.hwp',
        etc: '기타자료.zip',
      },
      facilities: [
        ['국가관리항', '국가관리', '부산지방해양수산청', '부산해역', '부산항', '신항', '계류시설', '부산항 신항 3부두'],
        ['국가관리항', '국가관리', '부산지방해양수산청', '부산해역', '부산항', '웅동', '외곽시설', '웅동 준설토 투기장 외곽호안'],
        ['국가관리항', '국가관리', '부산지방해양수산청', '부산해역', '부산항', '북항', '여객시설', '국제여객터미널'],
      ],
      process: [
        ['시설물 신청', '용역사가 대상 시설물 3건을 신청했습니다.', '2026-06-08 09:20', 'done'],
        ['허가유무 저장', '관리자가 신청 시설물을 승인했습니다.', '2026-06-08 14:10', 'done'],
      ],
    },
    {
      no: 2,
      userId: 'marine_chk02',
      companyName: '해양구조기술단',
      serviceName: '인천항 연안여객터미널 정밀안전점검',
      applyDate: '2026-06-07',
      useYn: 'N',
      manageName: '인천지방해양수산청',
      contactName: '박정우',
      contactPosition: '시설사무관',
      contactTel: '032-880-6320',
      files: {
        contract: '계약서.pdf',
        order: '과업지시서.hwp',
        etc: '-',
      },
      facilities: [
        ['국가관리항', '국가관리', '인천지방해양수산청', '경인해역', '인천항', '연안', '여객시설', '연안여객터미널'],
        ['국가관리항', '국가관리', '인천지방해양수산청', '경인해역', '인천항', '남항', '계류시설', '제1국제여객터미널 안벽'],
      ],
      process: [
        ['시설물 신청', '용역사가 대상 시설물 2건을 신청했습니다.', '2026-06-07 10:15', 'done'],
        ['반려', '대상 시설물 확인 후 신청 건을 반려했습니다.', '2026-06-07 16:30', 'reject'],
      ],
    },
    {
      no: 3,
      userId: 'dfsafety03',
      companyName: '대한시설안전연구원',
      serviceName: '광양항 제품부두 보수정보 등록 용역',
      applyDate: '2026-06-06',
      useYn: 'Y',
      manageName: '여수지방해양수산청',
      contactName: '이서윤',
      contactPosition: '주무관',
      contactTel: '061-650-6151',
      files: {
        contract: '계약서.pdf',
        order: '-',
        etc: '-',
      },
      facilities: [
        ['국가관리항', '국가관리', '여수지방해양수산청', '광양해역', '광양항', '제품부두', '계류시설', '제품부두 선원회관'],
      ],
      process: [
        ['시설물 신청', '용역사가 대상 시설물 1건을 신청했습니다.', '2026-06-06 11:05', 'done'],
        ['허가유무 저장', '관리자가 신청 시설물을 승인했습니다.', '2026-06-06 15:40', 'done'],
      ],
    },
    {
      no: 4,
      userId: 'west_safe05',
      companyName: '서해안진단',
      serviceName: '목포항 항만시설물 정기안전점검',
      applyDate: '2026-06-02',
      useYn: 'Y',
      manageName: '목포지방해양수산청',
      contactName: '윤지호',
      contactPosition: '시설주사보',
      contactTel: '061-280-1725',
      files: {
        contract: '계약서.pdf',
        order: '과업지시서.hwp',
        etc: '사진대장.zip',
      },
      facilities: [
        ['국가관리항', '국가관리', '목포지방해양수산청', '목포해역', '목포항', '북항', '계류시설', '목포항 제4부두'],
        ['국가관리항', '국가관리', '목포지방해양수산청', '목포해역', '목포항', '북항', '외곽시설', '북항 방파제'],
      ],
      process: [
        ['시설물 신청', '용역사가 대상 시설물 2건을 신청했습니다.', '2026-06-02 09:35', 'done'],
        ['허가유무 저장', '관리자가 신청 시설물을 승인했습니다.', '2026-06-02 13:50', 'done'],
      ],
    },
  ];

  let selected = null;
  const pagingState = {
    page: 1,
    pageSize: 10,
  };

  const $ = (id) => document.getElementById(id);
  const tbody = $('requestTableBody');
  const pagination = $('requestPagination');
  const pageSizeSelect = $('requestPageSize');
  const listTotal = $('requestListTotal');
  const drawer = $('requestDrawer');
  const overlay = $('requestDrawerOverlay');
  const detailModal = $('requestDetailModal');

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '');
  }

  function permitLabel(useYn) {
    return useYn === 'Y' ? '승인' : '반려';
  }

  function permitClass(useYn) {
    return useYn === 'Y' ? 'ok' : 'error';
  }

  function fileText(fileName) {
    return fileName && fileName !== '-' ? escapeHtml(fileName) : '-';
  }

  function getPageSize() {
    return pagingState.pageSize || Number(pageSizeSelect?.value) || 10;
  }

  function renderTable() {
    const total = requests.length;
    const pageSize = getPageSize();
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    pagingState.page = Math.min(pagingState.page, totalPages);
    const start = total === 0 ? 0 : (pagingState.page - 1) * pageSize + 1;
    const end = Math.min(pagingState.page * pageSize, total);
    const pageRows = requests.slice(start ? start - 1 : 0, end);

    tbody.innerHTML = pageRows.map((item) => `
      <tr tabindex="0" data-user-id="${escapeHtml(item.userId)}" class="${selected?.userId === item.userId ? 'is-selected' : ''}">
        <td>${item.no}</td>
        <td>${escapeHtml(item.userId)}</td>
        <td>${escapeHtml(item.companyName)}</td>
        <td class="is-left">${escapeHtml(item.serviceName)}</td>
        <td>${escapeHtml(item.applyDate)}</td>
        <td><strong>${item.facilities.length}</strong></td>
      </tr>
    `).join('');

    $('requestResultText').innerHTML = `검색결과 <strong>${total}</strong>건`;
    if (listTotal) listTotal.textContent = total.toLocaleString();
    if (window.PomsPaging) {
      PomsPaging.mount({
        paginationId: 'requestPagination',
        pageSizeId: 'requestPageSize',
        totalRows: total,
        state: pagingState,
        onChange: renderTable,
      });
    } else {
      renderPagination(totalPages);
    }

    tbody.querySelectorAll('tr[data-user-id]').forEach((row) => {
      const select = () => {
        const item = requests.find((request) => request.userId === row.dataset.userId);
        if (!item) return;
        selected = item;
        renderTable();
        openRequestDetail(item);
      };
      row.addEventListener('click', select);
      row.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        select();
      });
    });
  }

  function renderPagination(totalPages) {
    if (!pagination) return;
    const maxButtons = 5;
    const currentPage = pagingState.page;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    const pages = [];
    for (let pageNo = start; pageNo <= end; pageNo += 1) pages.push(pageNo);

    pagination.innerHTML = `
      <button type="button" class="pagination__btn" data-page="first" aria-label="처음 페이지"${currentPage === 1 ? ' disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
      </button>
      <button type="button" class="pagination__btn" data-page="prev" aria-label="이전 페이지"${currentPage === 1 ? ' disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      ${pages.map((itemPage) => `<button type="button" class="pagination__btn${itemPage === currentPage ? ' is-active' : ''}" data-page="${itemPage}"${itemPage === currentPage ? ' aria-current="page"' : ''}>${itemPage}</button>`).join('')}
      <button type="button" class="pagination__btn" data-page="next" aria-label="다음 페이지"${currentPage === totalPages ? ' disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <button type="button" class="pagination__btn" data-page="last" aria-label="마지막 페이지"${currentPage === totalPages ? ' disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
      </button>`;

    pagination.querySelectorAll('[data-page]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.disabled) return;
        const action = button.dataset.page;
        if (action === 'first') pagingState.page = 1;
        else if (action === 'prev') pagingState.page = Math.max(1, pagingState.page - 1);
        else if (action === 'next') pagingState.page = Math.min(totalPages, pagingState.page + 1);
        else if (action === 'last') pagingState.page = totalPages;
        else pagingState.page = Number(action);
        renderTable();
      });
    });
  }

  function fillModalServiceInfo(item) {
    const detailSub = $('requestDetailSub');
    if (detailSub) detailSub.textContent = `${item.companyName} · ${item.userId} · 신청 ${item.facilities.length}개`;
    $('requestModalServiceName').textContent = item.serviceName;
    $('requestModalManageName').textContent = item.manageName;
    $('requestModalContactName').textContent = item.contactName;
    $('requestModalContactPosition').textContent = item.contactPosition;
    $('requestModalContactTel').textContent = item.contactTel;
    $('requestModalContractFile').innerHTML = fileText(item.files.contract);
    $('requestModalOrderFile').innerHTML = fileText(item.files.order);
    $('requestModalEtcFile').innerHTML = fileText(item.files.etc);
    $('requestModalUserId').value = item.userId;
    $('requestModalPermitStatus').value = item.useYn;
  }

  function fillModalFacilities(item) {
    $('requestModalFacilityCount').textContent = String(item.facilities.length);
    $('requestModalFacilityBody').innerHTML = item.facilities.map((facility, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(facility[0])}</td>
        <td>${escapeHtml(facility[1])}</td>
        <td class="is-left">${escapeHtml(facility[2])}</td>
        <td>${escapeHtml(facility[3])}</td>
        <td>${escapeHtml(facility[4])}</td>
        <td>${escapeHtml(facility[5])}</td>
        <td>${escapeHtml(facility[6])}</td>
        <td class="is-left">${escapeHtml(facility[7])}</td>
      </tr>
    `).join('');
  }

  function openRequestDetail(item) {
    fillModalFacilities(item);
    fillModalServiceInfo(item);
    detailModal.hidden = false;
    detailModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-mock-modal-open');
    $('requestDetailClose').focus({ preventScroll: true });
  }

  function closeRequestDetail() {
    detailModal.hidden = true;
    detailModal.setAttribute('aria-hidden', 'true');
    document.body.classList.toggle('is-mock-modal-open', drawer.classList.contains('is-open'));
  }

  function timelineHtml(item) {
    return `
      <dl class="mock-detail-list" style="margin-bottom:16px;">
        <div><dt>업체명</dt><dd>${escapeHtml(item.companyName)}</dd></div>
        <div><dt>용역명</dt><dd>${escapeHtml(item.serviceName)}</dd></div>
        <div><dt>사용자ID</dt><dd>${escapeHtml(item.userId)}</dd></div>
        <div><dt>허가유무</dt><dd>${permitLabel(item.useYn)}</dd></div>
      </dl>
      <ul class="mock-timeline">
        ${item.process.map(([label, desc, date, type], index) => `
          <li class="mock-timeline__item ${type === 'done' ? 'is-done' : type === 'reject' ? 'is-reject' : ''}">
            <span class="mock-timeline__dot">${index + 1}</span>
            <div class="mock-timeline__card">
              <p class="mock-timeline__title">${escapeHtml(label)}</p>
              <p class="mock-timeline__meta">${escapeHtml(desc)}<br>${escapeHtml(date)}</p>
            </div>
          </li>
        `).join('')}
      </ul>`;
  }

  function openProcessDrawer(item) {
    $('requestDrawerTitle').textContent = '결재이력 조회';
    $('requestDrawerSub').textContent = `${item.userId} · ${permitLabel(item.useYn)}`;
    $('requestDrawerBody').innerHTML = timelineHtml(item);
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-mock-modal-open');
  }

  function closeDrawer() {
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.toggle('is-mock-modal-open', detailModal && !detailModal.hidden);
  }

  function savePermit() {
    if (!selected) return;
    selected.useYn = $('requestModalPermitStatus').value;
    selected.process = [
      ['시설물 신청', `용역사가 대상 시설물 ${selected.facilities.length}건을 신청했습니다.`, `${selected.applyDate} 09:20`, 'done'],
      [permitLabel(selected.useYn), `관리자가 신청 건을 ${permitLabel(selected.useYn)} 처리했습니다.`, '2026-06-12 10:30', selected.useYn === 'Y' ? 'done' : 'reject'],
    ];
    fillModalServiceInfo(selected);
    renderTable();
  }

  $('requestModalProcessButton').addEventListener('click', () => {
    if (selected) openProcessDrawer(selected);
  });
  $('requestModalSaveButton').addEventListener('click', savePermit);
  $('requestDetailClose').addEventListener('click', closeRequestDetail);
  $('requestDetailCancel').addEventListener('click', closeRequestDetail);
  $('requestDetailOverlay').addEventListener('click', closeRequestDetail);
  $('requestDrawerClose').addEventListener('click', closeDrawer);
  $('requestDrawerCloseBottom').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  pageSizeSelect?.addEventListener('change', () => {
    pagingState.page = 1;
    pagingState.pageSize = Number(pageSizeSelect.value) || 10;
    renderTable();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
      return;
    }
    if (detailModal && !detailModal.hidden) closeRequestDetail();
  });

  renderTable();
})();
