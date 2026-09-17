/**
 * 보고서 상세 페이지 — 보수정보/정기안전점검/긴급점검 유형별 표시, 승인/반려, 결재이력
 */
(() => {
  let selected = null;

  const $ = (id) => document.getElementById(id);

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '');
  }

  function goList() {
    window.location.href = 'inspection-result-manage.html?tab=report';
  }

  function statusClass(status) {
    if (status === '승인' || status === '완료') return 'ok';
    if (status === '반려') return 'reject';
    return 'wait';
  }

  function statusHtml(status) {
    return `<span class="report-reg-status report-reg-status--${statusClass(status)}">${escapeHtml(status)}</span>`;
  }

  function reportName(item) {
    return `${item.fcltyNm} ${item.chckGbnNm} 보고서`;
  }

  function formatPeriod(item) {
    return `${item.startDate} ~ ${item.endDate}`;
  }

  function setHidden(id, hidden) {
    const el = $(id);
    if (el) el.hidden = hidden;
  }

  function showTypeSection(item) {
    setHidden('reportRegSummarySection', false);
    setHidden('reportRegInfoSection', false);
    setHidden('repairInfoSection', item.chckGbn !== 'MNT');
    setHidden('precisionSection', item.chckGbn === 'MNT');
  }

  /* ---------- 보수보강 실적 (MNT) ---------- */

  const REPAIR_REGISTER = {
    workName: '2024년 광양항 (여수지역)',
    year: '2024',
    workType: '보수',
    startDate: '2024-05-16',
    endDate: '2025-02-15',
    relatedInspection: '정밀안전점검 (2022-05-19 ~ 2022-10-30)',
    contractMethod: '일반경쟁',
    designer: '한국구조물안전연구원',
    contractor: '(유)다미종합건설',
    engineer: '김은성이사',
    supervisor: '김은성이사',
    part: '방식커버',
    content: '방식커버 보수',
    cost: '17,500',
    seismic: '미실시',
    workNature: '성능개선',
    author: '이민형,황순기',
    createdDate: '2024-02-18',
    members: [
      { part: '콘크리트 바닥판', method: '단면보수공법', qty: '424', unit: '129', cost: '55,074' },
    ],
  };

  let repairEditMode = false;

  function repairInput(name, value, opts = {}) {
    const ro = repairEditMode ? '' : ' readonly';
    const type = opts.type || 'text';
    const style = opts.wide ? ' style="width:100%;max-width:none;"' : '';
    return `<input type="${type}" data-repair-field="${name}" value="${escapeHtml(value)}"${ro}${style}>`;
  }

  function renderRepairRegister() {
    const body = $('repairRegisterBody');
    if (!body) return;
    const d = REPAIR_REGISTER;

    body.innerHTML = `
      <table class="detail-form-table">
        <tbody>
          <tr>
            <th>공사명</th>
            <td>${repairInput('workName', d.workName, { wide: true })}</td>
            <th>점검년도</th>
            <td>${repairInput('year', d.year)}</td>
          </tr>
          <tr>
            <th>공사구분</th>
            <td>${repairInput('workType', d.workType)}</td>
            <th>공사기간</th>
            <td>
              <span class="form-inline">
                ${repairInput('startDate', d.startDate, { type: 'date' })}
                <span>~</span>
                ${repairInput('endDate', d.endDate, { type: 'date' })}
              </span>
            </td>
          </tr>
          <tr>
            <th>관련점검진단</th>
            <td>
              <span style="display:flex;align-items:center;gap:8px;">
                <input type="text" id="repairRelatedTargetInput" data-repair-field="relatedInspection" value="${escapeHtml(d.relatedInspection)}" readonly style="flex:1;min-width:0;width:auto;max-width:none;">
                ${repairEditMode ? '<button type="button" class="btn-doc-file" id="repairRelatedOpenBtn">등록</button>' : ''}
              </span>
            </td>
            <th>계약방법</th>
            <td>${repairInput('contractMethod', d.contractMethod)}</td>
          </tr>
          <tr>
            <th>설계자</th>
            <td>${repairInput('designer', d.designer)}</td>
            <th>시공자</th>
            <td>${repairInput('contractor', d.contractor)}</td>
          </tr>
          <tr>
            <th>책임기술자</th>
            <td>${repairInput('engineer', d.engineer)}</td>
            <th>공사감독</th>
            <td>${repairInput('supervisor', d.supervisor)}</td>
          </tr>
          <tr>
            <th>부위</th>
            <td>${repairInput('part', d.part)}</td>
            <th>공사내역</th>
            <td>${repairInput('content', d.content)}</td>
          </tr>
          <tr>
            <th>공사비</th>
            <td><span class="form-inline">${repairInput('cost', d.cost)}<span style="color:#374151;font-size:12.5px;">천원</span></span></td>
            <th>내진보강</th>
            <td>${repairInput('seismic', d.seismic)}</td>
          </tr>
          <tr>
            <th>공사성격</th>
            <td>${repairInput('workNature', d.workNature)}</td>
            <th>설계내역서</th>
            <td><button type="button" class="btn-doc-file" data-repair-file="설계내역서">설계내역서</button></td>
          </tr>
          <tr>
            <th>점검보고서</th>
            <td colspan="3"><button type="button" class="btn-doc-file" data-repair-file="점검보고서">점검보고서</button></td>
          </tr>
          <tr>
            <th>작성자</th>
            <td>${repairInput('author', d.author)}</td>
            <th>작성일</th>
            <td>${repairInput('createdDate', d.createdDate, { type: 'date' })}</td>
          </tr>
        </tbody>
      </table>

      <p class="detail-sub-title">공사부위/부재</p>
      <table class="detail-form-table">
        <thead>
          <tr>
            <th style="width:auto;text-align:center;">공사부위/부재</th>
            <th style="width:auto;text-align:center;">보수보강공법</th>
            <th style="width:auto;text-align:center;">수량</th>
            <th style="width:auto;text-align:center;">단위</th>
            <th style="width:auto;text-align:center;">공사비(천원)</th>
          </tr>
        </thead>
        <tbody>
          ${d.members.map((m, i) => `
            <tr>
              <td style="text-align:center;">${repairEditMode ? `<input type="text" data-member="${i}" data-field="part" value="${escapeHtml(m.part)}" style="width:100%;max-width:none;text-align:center;">` : escapeHtml(m.part)}</td>
              <td style="text-align:center;">${repairEditMode ? `<input type="text" data-member="${i}" data-field="method" value="${escapeHtml(m.method)}" style="width:100%;max-width:none;text-align:center;">` : escapeHtml(m.method)}</td>
              <td style="text-align:center;">${repairEditMode ? `<input type="text" data-member="${i}" data-field="qty" value="${escapeHtml(m.qty)}" style="width:100%;max-width:none;text-align:center;">` : escapeHtml(m.qty)}</td>
              <td style="text-align:center;">${repairEditMode ? `<input type="text" data-member="${i}" data-field="unit" value="${escapeHtml(m.unit)}" style="width:100%;max-width:none;text-align:center;">` : escapeHtml(m.unit)}</td>
              <td style="text-align:center;">${repairEditMode ? `<input type="text" data-member="${i}" data-field="cost" value="${escapeHtml(m.cost)}" style="width:100%;max-width:none;text-align:center;">` : escapeHtml(m.cost)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    body.querySelectorAll('[data-repair-file]').forEach((btn) => {
      btn.addEventListener('click', () => alert(`${btn.dataset.repairFile} 파일을 다운로드합니다. (샘플)`));
    });

    // 관련점검진단 등록 — 선택 모달 (편집 모드에서만 버튼 노출)
    body.querySelector('#repairRelatedOpenBtn')?.addEventListener('click', () => {
      window.openRepairRelatedInspectionModal?.('repairRelatedTargetInput');
    });
  }

  function collectRepairRegister() {
    const body = $('repairRegisterBody');
    if (!body) return;
    body.querySelectorAll('[data-repair-field]').forEach((input) => {
      REPAIR_REGISTER[input.dataset.repairField] = input.value;
    });
    body.querySelectorAll('[data-member]').forEach((input) => {
      const member = REPAIR_REGISTER.members[Number(input.dataset.member)];
      if (member) member[input.dataset.field] = input.value;
    });
  }

  function setRepairEditMode(edit) {
    repairEditMode = edit;
    const editBtn = $('repairEditBtn');
    const saveBtn = $('repairSaveBtn');
    const cancelBtn = $('repairCancelBtn');
    if (editBtn) editBtn.hidden = edit;
    if (saveBtn) saveBtn.hidden = !edit;
    if (cancelBtn) cancelBtn.hidden = !edit;
    renderRepairRegister();
  }

  /* ---------- 상세 채우기 ---------- */

  function fillDetail(item) {
    document.title = `${reportName(item)} | POMS`;
    $('reportRegDetailTitle').textContent = reportName(item);
    $('reportRegPanelTitle').textContent = reportName(item);
    $('reportRegDetailSub').textContent = `${item.manageNm} · ${item.serviceCompanyNm} (${item.userId})`;
    $('reportRegCompany').textContent = `${item.serviceCompanyNm} (${item.userId})`;
    $('reportRegCheckName').textContent = item.chckGbnNm;
    $('reportRegSubmitDate').textContent = item.chckDe;
    $('reportRegStatus').innerHTML = statusHtml(item.status);
    $('reportRegReportName').textContent = reportName(item);
    $('reportRegWriter').textContent = item.writer;
    $('reportRegCheckDate').textContent = item.chckDe;
    $('reportRegComment').textContent = item.comment;
    showTypeSection(item);
    if (item.chckGbn === 'MNT') renderRepairRegister();
  }

  /* ---------- 결재이력 / 승인·반려 ---------- */

  function statusClassFor(status) {
    const s = String(status || '');
    if (s.includes('반려')) return 'is-rejected';
    if (s.includes('승인') || s.includes('완료')) return 'is-approved';
    return 'is-requested';
  }

  function historyDrawerHtml(item) {
    const label = item.status || '-';
    const statusCls = statusClassFor(label);
    const rows = [
      ['시설물명', item.fcltyNm],
      ['점검구분', item.chckGbnNm],
      ['점검기관', `${item.serviceCompanyNm} (${item.userId})`],
      ['처리상태', label],
    ];
    const steps = (item.approvals || []).map((row) => {
      const status = String(row.status || '');
      const typeLabel = String(row.type || '');
      const isReject = status.includes('반려') || typeLabel.includes('반려');
      const isApply = typeLabel.includes('신청') || typeLabel.includes('제출');
      const isApprove = !isReject && !isApply && (status.includes('승인') || status.includes('완료'));
      return {
        title: isReject ? '반려' : isApply ? '신청' : isApprove ? '승인' : (row.type || status || '-'),
        by: row.reviewer || row.requester || '-',
        date: row.requestDate || '-',
        noteTag: isReject ? '[반려]' : isApply ? '[신청]' : isApprove ? '[승인]' : '[진행]',
        noteText: row.opinion || '-',
        type: isReject ? 'reject' : isApprove ? 'done' : '',
      };
    });

    return `
      <div class="fca-hist-block">
        <div class="fca-hist-summary">
          <span class="fca-hist-summary__icon-wrap" aria-hidden="true">
            <img class="fca-hist-summary__icon" src="assets/facility-change-approval/icon-history-doc.png" alt="" width="24" height="24">
          </span>
          <span class="fca-hist-summary__name">${escapeHtml(item.fcltyNm)}</span>
          <span class="fca-hist-summary__meta">
            <span class="fca-hist-summary__type">${escapeHtml(item.chckGbnNm)}</span>
            <span class="fca-hist-summary__status ${statusCls}">${escapeHtml(label)}</span>
          </span>
        </div>
        <div class="fca-hist-rows">
          ${rows.map(([rowLabel, value]) => `
            <div class="fca-hist-row">
              <div class="fca-hist-row__label">${escapeHtml(rowLabel)}</div>
              <div class="fca-hist-row__value">${escapeHtml(value)}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="fca-hist-steps">
        ${steps.map((step) => `
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

  function openProcess() {
    if (!selected) return;
    $('reportRegProcessBody').innerHTML = historyDrawerHtml(selected);
    const modal = $('reportRegProcessModal');
    const overlay = $('reportRegProcessOverlay');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    overlay?.classList.add('is-open');
    document.body.classList.add('is-mock-modal-open');
  }

  function closeProcess() {
    const modal = $('reportRegProcessModal');
    const overlay = $('reportRegProcessOverlay');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    overlay?.classList.remove('is-open');
    document.body.classList.remove('is-mock-modal-open');
  }

  function updateStatus(nextStatus) {
    if (!selected) return;
    selected.status = nextStatus;
    selected.comment = nextStatus === '승인'
      ? '관리자가 보고서 제출 내용을 승인했습니다.'
      : '관리자가 보고서 제출 내용을 반려했습니다.';
    selected.approvals.push({
      type: nextStatus,
      requester: selected.writer,
      company: selected.serviceCompanyNm,
      requestDate: '2026-07-06 10:00',
      reviewer: '관리자',
      opinion: selected.comment,
      status: nextStatus === '승인' ? '완료' : '반려',
    });
    fillDetail(selected);
    alert(`보고서가 ${nextStatus} 처리되었습니다. (샘플)`);
  }

  /* ---------- 초기화 ---------- */

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'vendor-inspection-result' });

    const id = new URLSearchParams(window.location.search).get('id');
    selected = REPORT_REGISTRATION_REPORTS.find((item) => item.checkId === id) || null;

    if (!selected) {
      alert('보고서 정보를 찾을 수 없습니다.');
      goList();
      return;
    }

    // 점검 이력 폼(임베드)에서 점검구분에 맞는 샘플 레코드를 로드하도록 공유
    window.ReportDetailChckGbn = selected.chckGbn;
    window.ReportDetailChckGbnNm = selected.chckGbnNm;

    fillDetail(selected);

    $('reportRegBackBtn')?.addEventListener('click', goList);
    $('reportRegBackBottom')?.addEventListener('click', goList);
    $('reportRegProcess')?.addEventListener('click', openProcess);
    $('reportRegApprove')?.addEventListener('click', () => updateStatus('승인'));
    $('reportRegReject')?.addEventListener('click', () => updateStatus('반려'));

    $('repairEditBtn')?.addEventListener('click', () => setRepairEditMode(true));
    $('repairCancelBtn')?.addEventListener('click', () => setRepairEditMode(false));
    $('repairSaveBtn')?.addEventListener('click', () => {
      collectRepairRegister();
      setRepairEditMode(false);
      alert('보수보강 실적이 저장되었습니다. (샘플)');
    });
    $('repairDeleteBtn')?.addEventListener('click', () => {
      if (!window.confirm('선택한 보수보강 실적을 삭제하시겠습니까?')) return;
      alert('삭제되었습니다. (샘플)');
      goList();
    });


    document.querySelectorAll('[data-report-process-close]').forEach((button) => {
      button.addEventListener('click', closeProcess);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const modal = $('reportRegProcessModal');
      if (modal && modal.classList.contains('is-open')) closeProcess();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
