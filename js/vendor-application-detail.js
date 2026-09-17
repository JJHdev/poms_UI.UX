/**
 * 시설물신청 상세 페이지 — 허가유무 저장, 결재이력 드로어
 */
(() => {
  const $ = (id) => document.getElementById(id);
  const PAGE_SIZE = 10;
  let selected = null;
  const facilityPaging = { page: 1, pageSize: PAGE_SIZE };

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '');
  }

  function goList() {
    window.location.href = 'inspection-result-manage.html';
  }

  function permitLabel(useYn) {
    return useYn === 'Y' ? '승인' : '반려';
  }

  function statusClass(useYn) {
    return useYn === 'Y' ? 'is-approved' : 'is-rejected';
  }

  function fileText(fileName) {
    return fileName && fileName !== '-' ? escapeHtml(fileName) : '-';
  }

  function fillServiceInfo(item) {
    $('requestDetailSub').textContent = `${item.companyName} · ${item.userId} · 신청 ${item.facilities.length}개`;
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

  function fillFacilities() {
    if (!selected) return;

    const facilities = selected.facilities || [];
    const total = facilities.length;
    $('requestModalFacilityCount').textContent = String(total);

    const tbody = $('requestModalFacilityBody');
    const foot = $('requestFacilityFoot');

    if (!total) {
      tbody.innerHTML = '<tr><td colspan="9">신청된 시설물이 없습니다.</td></tr>';
      if (foot) foot.hidden = true;
      return;
    }

    facilityPaging.pageSize = PAGE_SIZE;
    facilityPaging.page = PomsPaging.clampPage(facilityPaging.page, total, PAGE_SIZE);
    const start = (facilityPaging.page - 1) * PAGE_SIZE;
    const pageRows = facilities.slice(start, start + PAGE_SIZE);

    tbody.innerHTML = pageRows.map((facility, index) => `
      <tr>
        <td>${start + index + 1}</td>
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

    if (foot) foot.hidden = total <= PAGE_SIZE;

    if (total > PAGE_SIZE) {
      PomsPaging.mount({
        paginationId: 'requestFacilityPagination',
        pageSizeId: 'requestFacilityPageSize',
        totalRows: total,
        state: facilityPaging,
        onChange: fillFacilities,
      });
    }
  }

  function historyDrawerHtml(item) {
    const label = permitLabel(item.useYn);
    const statusCls = statusClass(item.useYn);
    const rows = [
      ['업체명', item.companyName],
      ['용역명', item.serviceName],
      ['사용자ID', item.userId],
      ['허가유무', label],
    ];
    const steps = (item.process || []).map(([stepLabel, desc, date, type]) => {
      const isReject = type === 'reject' || String(stepLabel).includes('반려');
      const isApply = String(stepLabel).includes('신청');
      const isApprove = !isReject && !isApply && (type === 'done' || String(stepLabel).includes('승인'));
      return {
        title: isReject ? '반려' : isApply ? '신청' : isApprove ? '승인' : stepLabel,
        by: isReject || isApprove ? '관리자' : item.companyName,
        date,
        noteTag: isReject ? '[반려]' : isApply ? '[신청]' : '[승인]',
        noteText: desc,
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
            <span class="fca-hist-summary__type">시설물 신청</span>
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

  function openProcessDrawer() {
    if (!selected) return;
    $('requestDrawerBody').innerHTML = historyDrawerHtml(selected);
    $('requestDrawerOverlay').classList.add('is-open');
    const drawer = $('requestDrawer');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-mock-modal-open');
  }

  function closeDrawer() {
    $('requestDrawerOverlay').classList.remove('is-open');
    const drawer = $('requestDrawer');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-mock-modal-open');
  }

  function savePermit() {
    if (!selected) return;
    selected.useYn = $('requestModalPermitStatus').value;
    selected.process = [
      ['시설물 신청', `용역사가 대상 시설물 ${selected.facilities.length}건을 신청했습니다.`, `${selected.applyDate} 09:20`, 'done'],
      [permitLabel(selected.useYn), `관리자가 신청 건을 ${permitLabel(selected.useYn)} 처리했습니다.`, '2026-06-12 10:30', selected.useYn === 'Y' ? 'done' : 'reject'],
    ];
    fillServiceInfo(selected);
    alert(`허가유무가 [${permitLabel(selected.useYn)}](으)로 저장되었습니다. (샘플)`);
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'vendor-inspection-result' });

    const id = new URLSearchParams(window.location.search).get('id');
    selected = VENDOR_APPLICATION_REQUESTS.find((item) => item.userId === id) || null;

    if (!selected) {
      alert('신청 정보를 찾을 수 없습니다.');
      goList();
      return;
    }

    fillServiceInfo(selected);
    facilityPaging.page = 1;
    fillFacilities();

    $('requestDetailBackBtn')?.addEventListener('click', goList);
    $('requestBackBottom')?.addEventListener('click', goList);
    $('requestModalSaveButton')?.addEventListener('click', savePermit);
    $('requestModalProcessButton')?.addEventListener('click', openProcessDrawer);
    $('requestDrawerClose')?.addEventListener('click', closeDrawer);
    $('requestDrawerOverlay')?.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && $('requestDrawer').classList.contains('is-open')) closeDrawer();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
