/**
 * 보고서 제출이력 상세 — 제출 정보 / 신청내역 / 결재이력 드로어
 */
(() => {
  const histories = window.REPORT_SUBMIT_HISTORIES || [];
  let selected = null;

  const $ = (id) => document.getElementById(id);

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '');
  }

  function goList() {
    window.location.href = 'report-submit-history.html';
  }

  function statusClass(status) {
    const s = String(status || '');
    if (s.includes('반려')) return 'is-rejected';
    if (s.includes('완료') || s.includes('승인')) return 'is-approved';
    return 'is-requested';
  }

  function fillSummary(item) {
    $('historyDetailSub').textContent = `${item.userId} · ${item.serviceName} · ${item.status}`;
    $('historyUserId').textContent = item.userId;
    $('historyServiceName').textContent = item.serviceName;
    $('historyLastDate').textContent = item.lastDate;
    $('historyStatus').textContent = item.status;
    $('historyFacilityCount').textContent = String(item.facilities.length);
  }

  function renderFacilities(item) {
    const body = $('historyFacilityBody');
    if (!item.facilities.length) {
      body.innerHTML = '<tr><td colspan="12">신청내역이 없습니다.</td></tr>';
    } else {
      body.innerHTML = item.facilities.map((facility, index) => `
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
          <td>${escapeHtml(facility[8])}</td>
          <td>${escapeHtml(facility[9])}</td>
          <td>${escapeHtml(facility[10])}</td>
        </tr>
      `).join('');
    }
    $('historyFacilityMessage').textContent = `${item.serviceName} · ${item.facilities.length}건`;
  }

  function historyDrawerHtml(item) {
    const statusCls = statusClass(item.status);
    const rows = [
      ['아이디', item.userId],
      ['용역명', item.serviceName],
      ['신청개수', `${item.facilities.length}건`],
      ['진행단계', item.status],
    ];
    const steps = (item.approvals || []).map((row) => {
      const title = String(row[0] || '');
      const status = String(row[6] || '');
      const isReject = status.includes('반려') || title.includes('반려');
      const isApply = title.includes('신청') || title.includes('제출');
      const isApprove = !isReject && !isApply && (status.includes('완료') || status.includes('승인') || title.includes('승인'));
      return {
        title: isReject ? '반려' : isApply ? (title.includes('제출') ? '제출' : '신청') : isApprove ? (title.includes('승인') ? title : '승인') : title,
        by: row[4] || row[1] || '-',
        date: row[3] || '-',
        noteTag: isReject ? '[반려]' : isApply ? (title.includes('제출') ? '[제출]' : '[신청]') : isApprove ? '[승인]' : '[진행]',
        noteText: row[5] || '-',
        type: isReject ? 'reject' : isApprove ? 'done' : '',
      };
    });

    return `
      <div class="fca-hist-block">
        <div class="fca-hist-summary">
          <span class="fca-hist-summary__icon-wrap" aria-hidden="true">
            <img class="fca-hist-summary__icon" src="assets/facility-change-approval/icon-history-doc.png" alt="" width="24" height="24">
          </span>
          <span class="fca-hist-summary__name">${escapeHtml(item.serviceName)}</span>
          <span class="fca-hist-summary__meta">
            <span class="fca-hist-summary__type">제출이력</span>
            <span class="fca-hist-summary__status ${statusCls}">${escapeHtml(item.status)}</span>
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

  function openProcessDrawer() {
    if (!selected) return;
    $('historyDrawerBody').innerHTML = historyDrawerHtml(selected);
    $('historyDrawerOverlay').classList.add('is-open');
    const drawer = $('historyDrawer');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-mock-modal-open');
  }

  function closeDrawer() {
    $('historyDrawerOverlay').classList.remove('is-open');
    const drawer = $('historyDrawer');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-mock-modal-open');
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'vendor-report-history' });

    const id = new URLSearchParams(window.location.search).get('id');
    selected = histories.find((item) => item.serviceId === id) || null;

    if (!selected) {
      alert('제출이력을 찾을 수 없습니다.');
      goList();
      return;
    }

    document.title = `${selected.serviceName} | 보고서 제출이력 상세 | POMS`;
    fillSummary(selected);
    renderFacilities(selected);

    $('historyDetailBackBtn')?.addEventListener('click', goList);
    $('historyBackBottom')?.addEventListener('click', goList);
    $('historyProcessButton')?.addEventListener('click', openProcessDrawer);
    $('historyDrawerClose')?.addEventListener('click', closeDrawer);
    $('historyDrawerOverlay')?.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && $('historyDrawer').classList.contains('is-open')) closeDrawer();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
