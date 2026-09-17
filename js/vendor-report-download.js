/**
 * 용역사 보고서 다운로드 신청 관리
 * status: requested | approved | rejected
 */
(() => {
  const REQUESTS = [
    {
      manageCat: '기타 공공기관', agency: '타부처', port: '광양항', subPort: '광양항', facilityType: '외곽', facilityName: '배수갑문 및 배수펌프장',
      date: '2025-09-20', kind: '정기안전점검(상반기)', inspAgency: '(주)청음', inspector: '배수갑문테스트11', state: '양호', opinion: '배수갑문테스트11',
      requestedAt: '2026-07-05 10:22', requester: '김용역', company: '(주)청음',
      reason: '2026년 상반기 정기안전점검 결과 검토 및 보수보강 계획 수립 참고', status: 'requested', rejectReason: '',
    },
    {
      manageCat: '기타 공공기관', agency: '타부처', port: '광양항', subPort: '광양항', facilityType: '외곽', facilityName: '배수갑문 및 배수펌프장',
      date: '2025-09-19', kind: '보수보강', inspAgency: '(주)청음', inspector: '조사단위', state: '불량', opinion: '조사단위',
      requestedAt: '2026-07-04 15:40', requester: '김용역', company: '(주)청음',
      reason: '보수보강 실적 확인 및 후속 공사 계획 수립', status: 'approved', rejectReason: '',
    },
    {
      manageCat: '기타 공공기관', agency: '타부처', port: '광양항', subPort: '광양항', facilityType: '외곽', facilityName: '배수갑문 및 배수펌프장',
      date: '2025-09-17', kind: '정기안전점검(상반기)', inspAgency: '(주)청음', inspector: '테스트111', state: '보통', opinion: '테스트111',
      requestedAt: '2026-07-03 09:12', requester: '김용역', company: '(주)청음',
      reason: '점검 결과 대비 자료 확인', status: 'rejected', rejectReason: '신청 사유가 불충분합니다. 활용 목적을 구체적으로 작성해 재신청 바랍니다.',
    },
    {
      manageCat: '지방해양수산청', agency: '포항지방해양수산청', port: '포항항', subPort: '구항', facilityType: '계류', facilityName: '물양장(1)',
      date: '2025-04-11', kind: '정기안전점검(상반기)', inspAgency: '(주)청음', inspector: '박점검', state: '보통', opinion: '부분 보수 필요',
      requestedAt: '2026-07-01 11:05', requester: '이용역', company: '(주)청음',
      reason: '물양장 보수공사 발주 검토 자료', status: 'requested', rejectReason: '',
    },
    {
      manageCat: '항만공사', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', facilityType: '계류', facilityName: '컨테이너부두',
      date: '2025-08-08', kind: '성능평가', inspAgency: '한국항만기술', inspector: '정평가', state: '양호', opinion: '성능 기준 충족',
      requestedAt: '2026-06-28 16:31', requester: '박용역', company: '한국항만기술',
      reason: '성능평가 결과 대내 보고자료 작성', status: 'requested', rejectReason: '',
    },
    {
      manageCat: '지방해양수산청', agency: '부산지방해양수산청', port: '부산항', subPort: '북항', facilityType: '계류', facilityName: '제1부두',
      date: '2025-06-12', kind: '정기안전점검(하반기)', inspAgency: '(주)해양안전', inspector: '최점검', state: '양호', opinion: '이상 없음',
      requestedAt: '2026-06-25 09:40', requester: '최용역', company: '(주)해양안전',
      reason: '하반기 점검 보고서 검토', status: 'requested', rejectReason: '',
    },
    {
      manageCat: '지방해양수산청', agency: '인천지방해양수산청', port: '인천항', subPort: '내항', facilityType: '외곽', facilityName: '방파제 A',
      date: '2025-05-20', kind: '정밀안전진단', inspAgency: '항만진단원', inspector: '한진단', state: '보통', opinion: '균열 관찰',
      requestedAt: '2026-06-22 14:18', requester: '한용역', company: '항만진단원',
      reason: '정밀진단 결과 공유', status: 'approved', rejectReason: '',
    },
    {
      manageCat: '항만공사', agency: '부산항만공사', port: '부산항', subPort: '신항', facilityType: '계류', facilityName: '다목적부두',
      date: '2025-07-03', kind: '정기안전점검(상반기)', inspAgency: '(주)청음', inspector: '오점검', state: '양호', opinion: '양호',
      requestedAt: '2026-06-20 11:02', requester: '오용역', company: '(주)청음',
      reason: '신항 시설 점검자료 확인', status: 'requested', rejectReason: '',
    },
    {
      manageCat: '지방해양수산청', agency: '여수지방해양수산청', port: '여수항', subPort: '신북항', facilityType: '여객', facilityName: '여객터미널 접안시설',
      date: '2025-03-15', kind: '보수보강', inspAgency: '한국항만기술', inspector: '강보수', state: '불량', opinion: '보강 필요',
      requestedAt: '2026-06-18 16:55', requester: '강용역', company: '한국항만기술',
      reason: '보수보강 전후 비교', status: 'rejected', rejectReason: '관련 용역 범위 외 신청입니다.',
    },
    {
      manageCat: '기타 공공기관', agency: '해양경찰청', port: '동해항', subPort: '동해항', facilityType: '계류', facilityName: '경비함부두',
      date: '2025-10-01', kind: '정기안전점검(상반기)', inspAgency: '(주)해양안전', inspector: '윤점검', state: '보통', opinion: '도장 열화',
      requestedAt: '2026-06-15 10:11', requester: '윤용역', company: '(주)해양안전',
      reason: '점검결과 내부 보고', status: 'requested', rejectReason: '',
    },
    {
      manageCat: '지방해양수산청', agency: '군산지방해양수산청', port: '군산항', subPort: '내항', facilityType: '외곽', facilityName: '호안(2공구)',
      date: '2025-11-08', kind: '성능평가', inspAgency: '항만진단원', inspector: '서평가', state: '양호', opinion: '기준 충족',
      requestedAt: '2026-06-12 13:27', requester: '서용역', company: '항만진단원',
      reason: '성능평가 보고서 열람', status: 'approved', rejectReason: '',
    },
    {
      manageCat: '항만공사', agency: '울산항만공사', port: '울산항', subPort: '본항', facilityType: '계류', facilityName: '유조선부두',
      date: '2025-12-02', kind: '정기안전점검(하반기)', inspAgency: '(주)청음', inspector: '문점검', state: '보통', opinion: '방충재 마모',
      requestedAt: '2026-06-10 09:05', requester: '문용역', company: '(주)청음',
      reason: '하반기 점검 결과 검토', status: 'requested', rejectReason: '',
    },
  ];

  const STATUS_META = {
    requested: { label: '요청중', cls: 'sra-status--pending' },
    approved: { label: '승인', cls: 'sra-status--approved' },
    rejected: { label: '반려', cls: 'sra-status--rejected' },
  };

  const paging = { page: 1, pageSize: 10 };
  let rejectTarget = null;
  let viewRows = [...REQUESTS];

  const $ = (id) => document.getElementById(id);

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function statusHtml(status) {
    const meta = STATUS_META[status] || STATUS_META.requested;
    return `<span class="sra-status ${meta.cls}">${meta.label}</span>`;
  }

  function reportLabel(req) {
    return `${req.date} ${req.kind} 보고서`;
  }

  function populateSelect(id, values) {
    const select = $(id);
    if (!select) return;
    select.innerHTML = '<option value="">전체</option>' + [...new Set(values)]
      .map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`)
      .join('');
  }

  function applyFilters() {
    paging.page = 1;
    const name = $('fltName')?.value.trim().toLowerCase() || '';
    const port = $('fltPort')?.value || '';
    const subPort = $('fltSubPort')?.value || '';
    const kind = $('fltKind')?.value || '';
    const inspector = $('fltInspector')?.value.trim().toLowerCase() || '';
    viewRows = REQUESTS.filter((r) => {
      if (name && !r.facilityName.toLowerCase().includes(name)) return false;
      if (port && r.port !== port) return false;
      if (subPort && r.subPort !== subPort) return false;
      if (kind && r.kind !== kind) return false;
      if (inspector && !r.inspector.toLowerCase().includes(inspector)) return false;
      return true;
    });
    render();
  }

  function actionCell(req, index) {
    if (req.status === 'requested') {
      return `<span class="sra-actions">
        <button type="button" class="sra-tbl-btn sra-tbl-btn--approve" data-approve="${index}">승인</button>
        <button type="button" class="sra-tbl-btn sra-tbl-btn--reject" data-reject="${index}">반려</button>
      </span>`;
    }
    return '<span class="sra-done-label">처리완료</span>';
  }

  function render() {
    const body = $('vrdBody');
    const countEl = $('vrdResultCount');
    if (!body) return;
    if (countEl) countEl.textContent = String(viewRows.length);

    const total = viewRows.length;
    paging.page = window.PomsPaging
      ? PomsPaging.clampPage(paging.page, total, paging.pageSize)
      : Math.min(Math.max(paging.page, 1), Math.max(1, Math.ceil(total / paging.pageSize) || 1));

    const startIdx = (paging.page - 1) * paging.pageSize;
    const pageRows = viewRows.slice(startIdx, startIdx + paging.pageSize);

    if (!viewRows.length) {
      body.innerHTML = '<tr><td colspan="14">신청 내역이 없습니다.</td></tr>';
    } else {
      body.innerHTML = pageRows.map((r, pi) => {
        const i = startIdx + pi;
        return `
        <tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(r.requestedAt)}</td>
          <td>${escapeHtml(r.agency)}</td>
          <td>${escapeHtml(r.port)}</td>
          <td>${escapeHtml(r.subPort)}</td>
          <td>${escapeHtml(r.facilityType)}</td>
          <td class="is-left">${escapeHtml(r.facilityName)}</td>
          <td>${escapeHtml(r.date)}</td>
          <td>${escapeHtml(r.kind)}</td>
          <td>${escapeHtml(r.inspAgency)}</td>
          <td>${escapeHtml(r.state)}</td>
          <td>${statusHtml(r.status)}</td>
          <td><button type="button" class="sra-tbl-btn sra-tbl-btn--history" data-history="${i}">결재이력</button></td>
          <td>${actionCell(r, i)}</td>
        </tr>`;
      }).join('');
    }

    if (window.PomsPaging) {
      PomsPaging.mount({
        paginationId: 'vrdPaging',
        pageSizeId: 'vrdPageSize',
        totalRows: total,
        state: paging,
        onChange: () => {
          paging.pageSize = 10;
          render();
        },
      });
    }

    body.querySelectorAll('[data-approve]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const req = viewRows[Number(btn.dataset.approve)];
        if (!req) return;
        req.status = 'approved';
        render();
        alert(`${req.facilityName} ${reportLabel(req)} 다운로드 신청이 승인되었습니다.\n용역사에서 1회 다운로드할 수 있습니다. (샘플)`);
      });
    });

    body.querySelectorAll('[data-reject]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const req = viewRows[Number(btn.dataset.reject)];
        if (!req) return;
        openRejectModal(req);
      });
    });

    body.querySelectorAll('[data-history]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const req = viewRows[Number(btn.dataset.history)];
        if (!req) return;
        openHistoryDrawer(req);
      });
    });
  }

  function openRejectModal(req) {
    rejectTarget = req;
    $('vrdRejectSub').textContent = `${req.facilityName} · ${reportLabel(req)} · 신청자 ${req.requester}(${req.company})`;
    $('vrdRejectReason').value = '';
    $('vrdRejectModal').hidden = false;
    $('vrdRejectReason').focus();
  }

  function closeRejectModal() {
    rejectTarget = null;
    $('vrdRejectModal').hidden = true;
  }

  function historySteps(req) {
    const steps = [{
      title: '신청',
      by: `${req.requester} (${req.company})`,
      date: req.requestedAt,
      noteTag: '[신청]',
      noteText: req.reason || '-',
      type: '',
    }];
    if (req.status === 'approved') {
      steps.push({
        title: '승인',
        by: '관리자',
        date: req.requestedAt,
        noteTag: '[승인]',
        noteText: '신청 내용을 확인하여 승인 처리되었습니다. 용역사에서 1회 다운로드할 수 있습니다.',
        type: 'done',
      });
    }
    if (req.status === 'rejected') {
      steps.push({
        title: '반려',
        by: '관리자',
        date: req.requestedAt,
        noteTag: '[반려]',
        noteText: req.rejectReason || '-',
        type: 'reject',
      });
    }
    return steps;
  }

  function historyDrawerHtml(req) {
    const meta = STATUS_META[req.status] || STATUS_META.requested;
    const statusClass = req.status === 'approved'
      ? 'is-approved'
      : req.status === 'rejected'
        ? 'is-rejected'
        : 'is-requested';
    const rows = [
      ['시설명', req.facilityName],
      ['대상 보고서', `${req.date} ${req.kind}`],
      ['신청자', `${req.requester} (${req.company})`],
      ['처리상태', meta.label],
    ];

    return `
      <div class="fca-hist-block">
        <div class="fca-hist-summary">
          <span class="fca-hist-summary__icon-wrap" aria-hidden="true">
            <img class="fca-hist-summary__icon" src="assets/facility-change-approval/icon-history-doc.png" alt="" width="24" height="24">
          </span>
          <span class="fca-hist-summary__name">${escapeHtml(req.facilityName)}</span>
          <span class="fca-hist-summary__meta">
            <span class="fca-hist-summary__type">${escapeHtml(req.kind)}</span>
            <span class="fca-hist-summary__status ${statusClass}">${escapeHtml(meta.label)}</span>
          </span>
        </div>
        <div class="fca-hist-rows">
          ${rows.map(([label, value]) => `
            <div class="fca-hist-row">
              <div class="fca-hist-row__label">${escapeHtml(label)}</div>
              <div class="fca-hist-row__value">${escapeHtml(value)}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="fca-hist-steps">
        ${historySteps(req).map((step) => `
          <article class="fca-hist-card${step.type === 'reject' ? ' is-reject' : step.type === 'done' ? ' is-done' : ''}">
            <div class="fca-hist-card__head">
              <div class="fca-hist-card__left">
                <span class="fca-hist-card__badge">${escapeHtml(step.title)}</span>
                <span class="fca-hist-card__by">${escapeHtml(step.by)}</span>
              </div>
              <span class="fca-hist-card__date">${escapeHtml(step.date)}</span>
            </div>
            <div class="fca-hist-card__note">
              <span class="fca-hist-card__note-tag">${escapeHtml(step.noteTag)}</span>
              <span class="fca-hist-card__note-text">${escapeHtml(step.noteText)}</span>
            </div>
          </article>
        `).join('')}
      </div>`;
  }

  function openHistoryDrawer(req) {
    $('histDrawerBody').innerHTML = historyDrawerHtml(req);
    $('histDrawerOverlay').classList.add('is-open');
    const drawer = $('histDrawer');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeHistoryDrawer() {
    $('histDrawerOverlay').classList.remove('is-open');
    const drawer = $('histDrawer');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'vendor-report-download' });

    populateSelect('fltPort', REQUESTS.map((r) => r.port));
    populateSelect('fltSubPort', REQUESTS.map((r) => r.subPort));
    populateSelect('fltKind', ['정기안전점검(상반기)', '정기안전점검(하반기)', '성능평가', '보수보강', '정밀안전진단', '정밀안전점검']);

    $('vrdSearchForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      applyFilters();
    });
    $('fltResetBtn')?.addEventListener('click', () => {
      ['fltPort', 'fltSubPort', 'fltKind'].forEach((id) => { if ($(id)) $(id).value = ''; });
      ['fltName', 'fltInspector'].forEach((id) => { if ($(id)) $(id).value = ''; });
      applyFilters();
    });

    $('vrdRejectSubmit')?.addEventListener('click', () => {
      const reason = $('vrdRejectReason').value.trim();
      if (!reason) {
        alert('반려 사유를 입력하세요.');
        $('vrdRejectReason').focus();
        return;
      }
      if (rejectTarget) {
        rejectTarget.status = 'rejected';
        rejectTarget.rejectReason = reason;
      }
      closeRejectModal();
      render();
      alert('반려 처리되었습니다. 반려 사유가 결재이력에 기록됩니다. (샘플)');
    });

    document.querySelectorAll('[data-close-reject]').forEach((el) => {
      el.addEventListener('click', closeRejectModal);
    });
    document.querySelectorAll('[data-close-history]').forEach((el) => {
      el.addEventListener('click', closeHistoryDrawer);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (!$('vrdRejectModal').hidden) {
        closeRejectModal();
        return;
      }
      closeHistoryDrawer();
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
