/**
 * 안전점검보고서 승인/반려 — 다운로드 신청 목록, 승인/반려 처리(1회), 결재이력
 * status: pending(승인대기) | approved(승인) | rejected(반려) | downloaded(다운로드 완료)
 */
(() => {
  const REQUEST_ROWS = [
    { id: 'r1', year: '2026', agency: '부산지방해양수산청', name: '감천항 부두', inspectType: '정밀안전점검', requester: '김항만 (부산청)', requestedAt: '2026-07-06 09:12', status: 'pending' },
    { id: 'r2', year: '2026', agency: '부산항만공사', name: '남항 크루즈터미널', inspectType: '정기안전점검', requester: '이보수 (BPA)', requestedAt: '2026-07-06 08:47', status: 'pending' },
    { id: 'r3', year: '2025', agency: '여수광양항만공사', name: 'LPG부두', inspectType: '정밀안전진단', requester: '박점검 (YGPA)', requestedAt: '2026-07-05 17:30', status: 'approved', processedAt: '2026-07-06 10:20' },
    { id: 'r4', year: '2025', agency: '인천항만공사', name: '신항 컨테이너터미널', inspectType: '정기안전점검', requester: '최시설 (IPA)', requestedAt: '2026-07-05 15:02', status: 'pending' },
    { id: 'r5', year: '2025', agency: '여수지방해양수산청', name: '여천항 물양장', inspectType: '정밀안전점검', requester: '정안전 (여수청)', requestedAt: '2026-07-04 11:26', status: 'rejected', processedAt: '2026-07-05 09:10', rejectReason: '신청 대상 보고서가 확정 전입니다. 확정 후 재신청 바랍니다.' },
    { id: 'r6', year: '2024', agency: '부산항만공사', name: '북항 방파제', inspectType: '성능평가', requester: '이보수 (BPA)', requestedAt: '2026-07-03 14:55', status: 'downloaded', processedAt: '2026-07-03 16:30', downloadedAt: '2026-07-04 09:05' },
    { id: 'r7', year: '2024', agency: '경상북도', name: '구룡포항 부두', inspectType: '정기안전점검', requester: '한도청 (경북)', requestedAt: '2026-07-02 10:18', status: 'downloaded', processedAt: '2026-07-02 13:40', downloadedAt: '2026-07-02 15:12' },
    { id: 'r8', year: '2024', agency: '인천항만공사', name: '인천항 크루즈터미널', inspectType: '정밀안전점검', requester: '최시설 (IPA)', requestedAt: '2026-07-01 16:41', status: 'approved', processedAt: '2026-07-02 09:00' },
  ];

  const STATUS_META = {
    pending: { label: '승인대기', cls: 'sra-status--pending' },
    approved: { label: '승인', cls: 'sra-status--approved' },
    rejected: { label: '반려', cls: 'sra-status--rejected' },
    downloaded: { label: '다운로드 완료', cls: 'sra-status--downloaded' },
  };

  const state = {
    rows: [...REQUEST_ROWS],
    filtered: [...REQUEST_ROWS],
    page: 1,
    pageSize: 10,
  };

  let rejectTarget = null;

  function $(sel) {
    return document.querySelector(sel);
  }

  function nowStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function populateFilterSelects() {
    const fill = (id, values) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = `<option value="">전체</option>${[...new Set(values)]
        .map((v) => `<option value="${v}">${v}</option>`)
        .join('')}`;
    };
    fill('approvalYear', state.rows.map((r) => r.year).sort().reverse());
    fill('approvalAgency', state.rows.map((r) => r.agency));
  }

  function filterRows() {
    const year = $('#approvalYear')?.value || '';
    const agency = $('#approvalAgency')?.value || '';
    const status = $('#approvalStatus')?.value || '';
    const name = ($('#approvalName')?.value || '').trim();

    state.filtered = state.rows.filter((row) => {
      if (year && row.year !== year) return false;
      if (agency && row.agency !== agency) return false;
      if (status && row.status !== status) return false;
      if (name && !row.name.includes(name)) return false;
      return true;
    });
    state.page = 1;
  }

  // 승인/반려는 1회만: 승인대기일 때만 버튼, 처리된 뒤에는 '처리완료'
  function actionButtonsHtml(row) {
    if (row.status === 'pending') {
      return `<span class="sra-actions">
        <button type="button" class="sra-tbl-btn sra-tbl-btn--approve" data-action="approve" data-id="${row.id}">승인</button>
        <button type="button" class="sra-tbl-btn sra-tbl-btn--reject" data-action="reject" data-id="${row.id}">반려</button>
      </span>`;
    }
    return '<span class="sra-done-label">처리완료</span>';
  }

  function renderTable() {
    const tbody = $('#approvalTableBody');
    const countEl = $('#approvalResultCount');
    if (!tbody) return;

    if (countEl) countEl.textContent = state.filtered.length.toLocaleString();

    PomsUserTable.mountFoot({
      paginationId: 'approvalPagination',
      state,
      totalRows: state.filtered.length,
      onChange: renderTable,
    });

    const pageRows = PomsUserTable.slicePage(state.filtered, state.page, state.pageSize);
    const start = (state.page - 1) * state.pageSize;

    if (!pageRows.length) {
      tbody.innerHTML = '<tr><td colspan="11" style="padding:24px;text-align:center;color:#6b7280;">다운로드 신청 내역이 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = pageRows.map((row, i) => {
      const meta = STATUS_META[row.status] || STATUS_META.pending;
      return `
        <tr${row.status === 'downloaded' ? ' class="is-downloaded"' : ''}>
          <td>${start + i + 1}</td>
          <td>${row.year}</td>
          <td class="is-left">${row.agency}</td>
          <td class="is-left">${row.name}</td>
          <td>${row.inspectType}</td>
          <td>${row.requester}</td>
          <td>${row.requestedAt}</td>
          <td><span class="sra-status ${meta.cls}">${meta.label}</span></td>
          <td><button type="button" class="sra-tbl-btn sra-tbl-btn--download" data-download-id="${row.id}">보고서 다운로드</button></td>
          <td>${actionButtonsHtml(row)}</td>
          <td><button type="button" class="sra-tbl-btn sra-tbl-btn--history" data-history-id="${row.id}">결재이력</button></td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-download-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = state.rows.find((item) => item.id === btn.dataset.downloadId);
        if (row) alert(`${row.name} 보고서를 다운로드합니다. (샘플)`);
      });
    });

    tbody.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = state.rows.find((item) => item.id === btn.dataset.id);
        if (!row || row.status !== 'pending') return;
        if (btn.dataset.action === 'approve') {
          if (!window.confirm('정말 승인하시겠습니까?')) return;
          row.status = 'approved';
          row.processedAt = nowStamp();
          filterRows();
          renderTable();
        } else {
          openRejectModal(row);
        }
      });
    });

    tbody.querySelectorAll('[data-history-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = state.rows.find((item) => item.id === btn.dataset.historyId);
        if (row) openHistoryDrawer(row);
      });
    });
  }

  /* ---------- 반려 팝업 ---------- */
  function openRejectModal(row) {
    rejectTarget = row;
    const sub = $('#sraRejectSub');
    if (sub) sub.textContent = `[${row.inspectType}] ${row.name} · 신청자 ${row.requester}`;
    const reason = $('#sraRejectReason');
    if (reason) reason.value = '';
    const modal = $('#sraRejectModal');
    if (modal) modal.hidden = false;
    reason?.focus();
  }

  function closeRejectModal() {
    rejectTarget = null;
    const modal = $('#sraRejectModal');
    if (modal) modal.hidden = true;
  }

  function bindRejectModal() {
    $('#sraRejectSubmit')?.addEventListener('click', () => {
      const reason = ($('#sraRejectReason')?.value || '').trim();
      if (!reason) {
        alert('반려 사유를 입력하세요.');
        $('#sraRejectReason')?.focus();
        return;
      }
      if (rejectTarget) {
        rejectTarget.status = 'rejected';
        rejectTarget.rejectReason = reason;
        rejectTarget.processedAt = nowStamp();
      }
      closeRejectModal();
      filterRows();
      renderTable();
      alert('반려 처리되었습니다. 반려 사유가 결재이력에 기록됩니다. (샘플)');
    });
    document.querySelectorAll('[data-close-reject]').forEach((el) => el.addEventListener('click', closeRejectModal));
  }

  /* ---------- 결재이력 드로어 (Figma 23:36140) ---------- */
  function historySteps(row) {
    const steps = [{
      title: '다운로드 신청',
      by: row.requester,
      date: row.requestedAt,
      noteTag: `[${row.inspectType}]`,
      noteText: `${row.name} 보고서 다운로드 신청`,
      type: '',
    }];
    if (row.status === 'approved' || row.status === 'downloaded') {
      steps.push({
        title: '승인',
        by: '관리자',
        date: row.processedAt || '-',
        noteTag: '[승인]',
        noteText: '다운로드 신청이 승인되었습니다.',
        type: 'done',
      });
    }
    if (row.status === 'rejected') {
      steps.push({
        title: '반려',
        by: '관리자',
        date: row.processedAt || '-',
        noteTag: '[반려]',
        noteText: row.rejectReason || '-',
        type: 'reject',
      });
    }
    if (row.status === 'downloaded') {
      steps.push({
        title: '다운로드 완료',
        by: row.requester,
        date: row.downloadedAt || '-',
        noteTag: '[다운로드]',
        noteText: '보고서 다운로드 완료',
        type: 'done',
      });
    }
    return steps;
  }

  function historyDrawerHtml(row) {
    const meta = STATUS_META[row.status] || STATUS_META.pending;
    const statusClass = `is-${row.status || 'pending'}`;
    const rows = [
      ['점검구분', row.inspectType],
      ['시설명', row.name],
      ['신청자', row.requester],
      ['처리상태', meta.label],
    ];

    return `
      <div class="sra-hist-block">
        <div class="sra-hist-summary">
          <span class="sra-hist-summary__icon-wrap" aria-hidden="true">
            <img class="sra-hist-summary__icon" src="assets/safety-report-approval/icon-history-doc.svg" alt="" width="24" height="24">
          </span>
          <span class="sra-hist-summary__name">${row.name}</span>
          <span class="sra-hist-summary__meta">
            <span class="sra-hist-summary__type">${row.inspectType}</span>
            <span class="sra-hist-summary__status ${statusClass}">${meta.label}</span>
          </span>
        </div>
        <div class="sra-hist-rows">
          ${rows.map(([label, value]) => `
            <div class="sra-hist-row">
              <div class="sra-hist-row__label">${label}</div>
              <div class="sra-hist-row__value">${value}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="sra-hist-steps">
        ${historySteps(row).map((step) => `
          <article class="sra-hist-card${step.type === 'reject' ? ' is-reject' : step.type === 'done' ? ' is-done' : ''}">
            <div class="sra-hist-card__head">
              <div class="sra-hist-card__left">
                <span class="sra-hist-card__badge">${step.title}</span>
                <span class="sra-hist-card__by">${step.by}</span>
              </div>
              <span class="sra-hist-card__date">${step.date}</span>
            </div>
            <div class="sra-hist-card__note">
              <span class="sra-hist-card__note-tag">${step.noteTag}</span>
              <span class="sra-hist-card__note-text">${step.noteText}</span>
            </div>
          </article>
        `).join('')}
      </div>`;
  }

  function openHistoryDrawer(row) {
    const body = $('#histDrawerBody');
    if (body) body.innerHTML = historyDrawerHtml(row);
    $('#histDrawerOverlay')?.classList.add('is-open');
    const drawer = $('#histDrawer');
    if (drawer) {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeHistoryDrawer() {
    $('#histDrawerOverlay')?.classList.remove('is-open');
    const drawer = $('#histDrawer');
    if (drawer) {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    }
  }

  function bindHistoryDrawer() {
    document.querySelectorAll('[data-close-history]').forEach((el) => el.addEventListener('click', closeHistoryDrawer));
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const rejectModal = $('#sraRejectModal');
      if (rejectModal && !rejectModal.hidden) { closeRejectModal(); return; }
      closeHistoryDrawer();
    });
  }

  function reset() {
    ['approvalYear', 'approvalAgency', 'approvalStatus'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    const nameEl = $('#approvalName');
    if (nameEl) nameEl.value = '';
    filterRows();
    renderTable();
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'approval-report' });

    populateFilterSelects();

    $('#approvalSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      filterRows();
      renderTable();
    });
    $('#approvalResetBtn')?.addEventListener('click', reset);

    bindRejectModal();
    bindHistoryDrawer();

    renderTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
