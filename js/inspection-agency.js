/**
 * 안전점검기관 화면 스크립트
 * — 목록: 사용자 관리(FCR) 패턴 / 상세: ua-drawer / 결재이력: sra-drawer
 */
(() => {
  const agencies = [
    {
      no: 1,
      company: '한국항만안전진단㈜',
      userName: '김민준',
      userId: 'kpha_safe01',
      position: '책임기술자',
      tel: '02-2165-0416',
      connectDate: '2026-06-08',
      useYn: 'Y',
      applyDate: '2026-05-21',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-05-20 09:14', 'done'],
        ['검토', '해양수산부 담당자 검토', '2026-05-20 15:30', 'done'],
        ['승인', '안전점검기관 사용권한 승인', '2026-05-21 10:05', 'done'],
      ],
    },
    {
      no: 2,
      company: '해양구조기술단',
      userName: '박서연',
      userId: 'marine_chk02',
      position: '과장',
      tel: '051-441-2080',
      connectDate: '2026-06-07',
      useYn: 'R',
      applyDate: '2026-06-06',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-06-06 11:20', 'done'],
        ['검토', '담당자 서류 확인 중', '2026-06-07 09:10', 'wait'],
      ],
    },
    {
      no: 3,
      company: '대한시설안전연구원',
      userName: '이도윤',
      userId: 'dfsafety03',
      position: '부장',
      tel: '032-885-7721',
      connectDate: '2026-06-05',
      useYn: 'Y',
      applyDate: '2026-05-13',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-05-12 14:31', 'done'],
        ['검토', '기관 정보 및 담당자 연락처 확인', '2026-05-13 09:40', 'done'],
        ['승인', '사용권한 승인', '2026-05-13 10:12', 'done'],
      ],
    },
    {
      no: 4,
      company: '부산항만점검센터',
      userName: '최하린',
      userId: 'busan_ins04',
      position: '대리',
      tel: '051-999-3100',
      connectDate: '-',
      useYn: 'N',
      applyDate: '2026-06-01',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-06-01 13:05', 'done'],
        ['검토', '필수 연락처 누락 확인', '2026-06-01 15:21', 'done'],
        ['반려', '기관 증빙자료 보완 필요', '2026-06-02 09:00', 'reject'],
      ],
    },
    {
      no: 5,
      company: '서해안전진단',
      userName: '정우진',
      userId: 'west_safe05',
      position: '팀장',
      tel: '061-650-6151',
      connectDate: '2026-06-03',
      useYn: 'Y',
      applyDate: '2026-04-29',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-04-28 10:18', 'done'],
        ['승인', '사용권한 승인', '2026-04-29 16:24', 'done'],
      ],
    },
    {
      no: 6,
      company: '동해항만기술',
      userName: '한소율',
      userId: 'east_port06',
      position: '과장',
      tel: '033-660-8120',
      connectDate: '2026-06-02',
      useYn: 'Y',
      applyDate: '2026-05-02',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-05-01 11:00', 'done'],
        ['승인', '사용권한 승인', '2026-05-02 09:40', 'done'],
      ],
    },
    {
      no: 7,
      company: '남해시설진단',
      userName: '오세진',
      userId: 'south_fac07',
      position: '대리',
      tel: '055-240-3311',
      connectDate: '2026-06-01',
      useYn: 'R',
      applyDate: '2026-05-30',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-05-30 14:20', 'done'],
        ['검토', '서류 보완 요청', '2026-05-31 10:00', 'wait'],
      ],
    },
    {
      no: 8,
      company: '항만구조엔지니어링',
      userName: '윤채원',
      userId: 'porteng08',
      position: '책임기술자',
      tel: '02-701-4455',
      connectDate: '2026-05-28',
      useYn: 'Y',
      applyDate: '2026-05-10',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-05-09 09:10', 'done'],
        ['승인', '사용권한 승인', '2026-05-10 15:00', 'done'],
      ],
    },
    {
      no: 9,
      company: '인천해양점검',
      userName: '배준호',
      userId: 'icn_chk09',
      position: '팀장',
      tel: '032-770-2200',
      connectDate: '-',
      useYn: 'N',
      applyDate: '2026-05-25',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-05-25 16:40', 'done'],
        ['반려', '자격요건 미충족', '2026-05-26 11:20', 'reject'],
      ],
    },
    {
      no: 10,
      company: '울산항만안전',
      userName: '신유진',
      userId: 'ulsan_safe10',
      position: '과장',
      tel: '052-228-9100',
      connectDate: '2026-05-22',
      useYn: 'Y',
      applyDate: '2026-05-08',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-05-07 13:00', 'done'],
        ['승인', '사용권한 승인', '2026-05-08 10:30', 'done'],
      ],
    },
    {
      no: 11,
      company: '군산시설안전',
      userName: '임도현',
      userId: 'guns_safe11',
      position: '부장',
      tel: '063-460-5500',
      connectDate: '2026-05-20',
      useYn: 'Y',
      applyDate: '2026-04-18',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-04-17 09:50', 'done'],
        ['승인', '사용권한 승인', '2026-04-18 14:15', 'done'],
      ],
    },
    {
      no: 12,
      company: '포항항만진단',
      userName: '권미래',
      userId: 'pohang_dx12',
      position: '대리',
      tel: '054-240-7700',
      connectDate: '2026-05-18',
      useYn: 'R',
      applyDate: '2026-05-17',
      process: [
        ['신청', '기관 담당자 계정 신청', '2026-05-17 11:30', 'done'],
        ['검토', '담당자 확인 중', '2026-05-18 09:00', 'wait'],
      ],
    },
  ];

  let filtered = [...agencies];
  let selected = null;
  const pagingState = {
    page: 1,
    pageSize: 10,
  };

  const $ = (id) => document.getElementById(id);
  const tbody = $('agencyTableBody');
  const resultCount = $('agencyResultCount');
  const message = $('agencyMessage');
  const detailModal = $('agencyDetailModal');
  const detailOverlay = $('agencyDetailOverlay');
  const historyDrawer = $('agencyDrawer');
  const historyOverlay = $('agencyDrawerOverlay');
  const searchForm = $('agencySearchForm');

  const fields = {
    selectedId: $('agencySelectedId'),
    userId: $('agencyUserId'),
    userName: $('agencyUserName'),
    position: $('agencyPosition'),
    company: $('agencyCompanyName'),
    tel1: $('agencyTel1'),
    tel2: $('agencyTel2'),
    tel3: $('agencyTel3'),
    useYn: $('agencyUseYn'),
    connectDate: $('agencyConnectDate'),
  };

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function statusText(useYn) {
    if (useYn === 'Y') return '승인';
    if (useYn === 'N') return '반려';
    return '요청중';
  }

  function statusClass(useYn) {
    if (useYn === 'Y') return 'is-approved';
    if (useYn === 'N') return 'is-rejected';
    return 'is-requested';
  }

  function statusChipClass(useYn) {
    if (useYn === 'Y') return 'agency-status--approved';
    if (useYn === 'N') return 'agency-status--rejected';
    return 'agency-status--requested';
  }

  function splitPhone(phone) {
    const parts = String(phone || '').split('-').map((part) => part.trim()).filter(Boolean);
    if (parts.length === 3) return parts;
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.startsWith('02') && digits.length >= 9) {
      return ['02', digits.slice(2, digits.length - 4), digits.slice(-4)];
    }
    if (digits.length >= 10) {
      return [digits.slice(0, 3), digits.slice(3, digits.length - 4), digits.slice(-4)];
    }
    return [parts[0] || '', parts[1] || '', parts[2] || ''];
  }

  function joinPhone() {
    const parts = [
      fields.tel1?.value.trim() || '',
      fields.tel2?.value.trim() || '',
      fields.tel3?.value.trim() || '',
    ].filter(Boolean);
    return parts.join('-');
  }

  function isOpen(el) {
    return Boolean(el && el.classList.contains('is-open'));
  }

  function setDrawerOpen(target, overlayEl, open) {
    if (!target) return;
    target.classList.toggle('is-open', open);
    target.setAttribute('aria-hidden', open ? 'false' : 'true');
    overlayEl?.classList.toggle('is-open', open);
  }

  function fillDetail(item) {
    if (!item) return;
    const [p1, p2, p3] = splitPhone(item.tel);
    fields.selectedId.value = item.userId;
    fields.userId.value = item.userId;
    fields.userName.value = item.userName;
    fields.position.value = item.position;
    fields.company.value = item.company;
    if (fields.tel1) fields.tel1.value = p1;
    if (fields.tel2) fields.tel2.value = p2;
    if (fields.tel3) fields.tel3.value = p3;
    fields.useYn.value = item.useYn;
    if (fields.connectDate) fields.connectDate.value = item.connectDate || '-';
    $('agencyDetailTitle').textContent = '기관 상세/수정';
    if (message) {
      message.textContent = '※ 기관 정보 확인 후 저장하거나 삭제처리합니다.';
    }
  }

  function openDetailModal(item) {
    selected = item;
    fillDetail(item);
    setDrawerOpen(detailModal, detailOverlay, true);
    window.setTimeout(() => fields.userName?.focus(), 0);
  }

  function closeDetailModal() {
    setDrawerOpen(detailModal, detailOverlay, false);
  }

  function bindRowDrawer() {
    tbody?.querySelectorAll('tr[data-user-id]').forEach((row) => {
      const open = () => {
        const item = agencies.find((agency) => agency.userId === row.dataset.userId);
        if (!item) return;
        tbody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('is-selected'));
        row.classList.add('is-selected');
        openDetailModal(item);
      };
      row.addEventListener('click', open);
      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });
  }

  function renderTable() {
    if (!tbody) return;
    const pageRows = filtered.slice(
      (pagingState.page - 1) * pagingState.pageSize,
      pagingState.page * pagingState.pageSize,
    );

    if (resultCount) resultCount.textContent = String(filtered.length);

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="is-empty">조회된 내용이 없습니다.</td></tr>';
    } else {
      tbody.innerHTML = pageRows.map((item) => `
        <tr tabindex="0" data-user-id="${escapeHtml(item.userId)}" class="is-clickable${selected?.userId === item.userId ? ' is-selected' : ''}" role="button" aria-label="${escapeHtml(item.company)} 상세 보기">
          <td class="col-no">${item.no}</td>
          <td class="col-org is-left">${escapeHtml(item.company)}</td>
          <td class="col-name">${escapeHtml(item.userName)} (${escapeHtml(item.userId)})</td>
          <td class="col-usage">${escapeHtml(item.position)}</td>
          <td class="col-phone">${escapeHtml(item.tel)}</td>
          <td class="col-login">${escapeHtml(item.connectDate)}</td>
          <td class="col-yn"><span class="agency-status ${statusChipClass(item.useYn)}">${statusText(item.useYn)}</span></td>
        </tr>
      `).join('');
    }

    PomsPaging.mount({
      paginationId: 'agencyPagination',
      pageSizeId: 'agencyPageSize',
      totalRows: filtered.length,
      state: pagingState,
      onChange: () => {
        pagingState.pageSize = 10;
        renderTable();
      },
    });

    bindRowDrawer();
  }

  function applyFilter() {
    const company = $('agencyCompanyFilter')?.value.trim() || '';
    const manager = $('agencyManagerFilter')?.value.trim() || '';
    const status = $('agencyStatusFilter')?.value || '';
    filtered = agencies.filter((item) => {
      const companyMatched = !company || item.company.includes(company);
      const managerMatched = !manager || item.userName.includes(manager) || item.userId.includes(manager);
      const statusMatched = !status || item.useYn === status;
      return companyMatched && managerMatched && statusMatched;
    });
    pagingState.page = 1;
    renderTable();
  }

  function saveDetail() {
    if (!selected) return;
    selected.userName = fields.userName.value.trim() || selected.userName;
    selected.position = fields.position.value.trim() || selected.position;
    selected.company = fields.company.value.trim() || selected.company;
    selected.tel = joinPhone() || selected.tel;
    selected.useYn = fields.useYn.value;
    selected.process.push([
      statusText(selected.useYn),
      selected.useYn === 'Y' ? '사용권한 승인 저장' : selected.useYn === 'N' ? '사용권한 반려 저장' : '요청중 상태 저장',
      '2026-06-09 10:00',
      selected.useYn === 'Y' ? 'done' : selected.useYn === 'N' ? 'reject' : 'wait',
    ]);
    renderTable();
    fillDetail(selected);
    if (message) message.textContent = `※ 저장되었습니다. 현재 상태: ${statusText(selected.useYn)}`;
  }

  function deleteDetail() {
    if (!selected) return;
    selected.useYn = 'N';
    selected.process.push(['삭제', '사용자 삭제 전 반려/미사용 처리', '2026-06-09 10:05', 'reject']);
    renderTable();
    fillDetail(selected);
    if (message) message.textContent = '※ 선택한 기관을 미사용(반려) 상태로 변경했습니다.';
  }

  function historyDrawerHtml(item) {
    const label = statusText(item.useYn);
    const statusCls = statusClass(item.useYn);
    const rows = [
      ['기관명', item.company],
      ['담당자', `${item.userName} (${item.userId})`],
      ['신청일', item.applyDate],
      ['처리상태', label],
    ];
    const steps = item.process.map(([stepLabel, desc, date, type]) => ({
      title: stepLabel,
      by: type === 'reject' ? '관리자' : type === 'done' ? '관리자' : item.userName,
      date,
      noteTag: type === 'reject' ? '[반려]' : type === 'done' ? '[처리]' : '[신청]',
      noteText: desc,
      type: type === 'reject' ? 'reject' : type === 'done' ? 'done' : '',
    }));

    return `
      <div class="sra-hist-block">
        <div class="sra-hist-summary">
          <span class="sra-hist-summary__icon-wrap" aria-hidden="true">
            <img class="sra-hist-summary__icon" src="assets/safety-report-approval/icon-history-doc.svg" alt="" width="24" height="24">
          </span>
          <span class="sra-hist-summary__name">${escapeHtml(item.company)}</span>
          <span class="sra-hist-summary__meta">
            <span class="sra-hist-summary__type">계정 신청</span>
            <span class="sra-hist-summary__status ${statusCls}">${escapeHtml(label)}</span>
          </span>
        </div>
        <div class="sra-hist-rows">
          ${rows.map(([rowLabel, value]) => `
            <div class="sra-hist-row">
              <div class="sra-hist-row__label">${escapeHtml(rowLabel)}</div>
              <div class="sra-hist-row__value">${escapeHtml(value)}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="sra-hist-steps">
        ${steps.map((step) => `
          <article class="sra-hist-card${step.type === 'reject' ? ' is-reject' : step.type === 'done' ? ' is-done' : ''}">
            <div class="sra-hist-card__head">
              <div class="sra-hist-card__left">
                <span class="sra-hist-card__badge">${escapeHtml(step.title)}</span>
                <span class="sra-hist-card__by">${escapeHtml(step.by)}</span>
              </div>
              <span class="sra-hist-card__date">${escapeHtml(step.date)}</span>
            </div>
            <div class="sra-hist-card__note">
              <span class="sra-hist-card__note-tag">${escapeHtml(step.noteTag)}</span>
              <span class="sra-hist-card__note-text">${escapeHtml(step.noteText)}</span>
            </div>
          </article>
        `).join('')}
      </div>`;
  }

  function openHistoryDrawer() {
    if (!selected) return;
    $('agencyDrawerBody').innerHTML = historyDrawerHtml(selected);
    setDrawerOpen(historyDrawer, historyOverlay, true);
    window.setTimeout(() => $('agencyDrawerClose')?.focus(), 0);
  }

  function closeHistoryDrawer() {
    setDrawerOpen(historyDrawer, historyOverlay, false);
  }

  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilter();
  });

  $('agencyReset')?.addEventListener('click', () => {
    if ($('agencyCompanyFilter')) $('agencyCompanyFilter').value = '';
    if ($('agencyManagerFilter')) $('agencyManagerFilter').value = '';
    if ($('agencyStatusFilter')) $('agencyStatusFilter').value = '';
    applyFilter();
  });

  $('agencySave')?.addEventListener('click', saveDetail);
  $('agencyDelete')?.addEventListener('click', deleteDetail);
  $('agencyProcessHistory')?.addEventListener('click', openHistoryDrawer);

  document.querySelectorAll('[data-agency-history-close]').forEach((el) => {
    el.addEventListener('click', closeHistoryDrawer);
  });
  document.querySelectorAll('[data-agency-detail-close]').forEach((el) => {
    el.addEventListener('click', closeDetailModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (isOpen(historyDrawer)) {
      closeHistoryDrawer();
      return;
    }
    if (isOpen(detailModal)) closeDetailModal();
  });

  renderTable();
})();
