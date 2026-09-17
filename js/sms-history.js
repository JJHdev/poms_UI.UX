(function () {
  const logs = [
    {
      smsId: '12018',
      msgId: 'POMS-20260624-001',
      message: '[해양수산부 항만기술안전과] 시설물안전법에 따라 2월 15일 까지 FMS에 2026년 유지관리계획 입력 바랍니다.',
      recieverNm: '부산지방해양수산청',
      recieverPn: '010-1234-5678',
      callerNm: 'POMS',
      callerPn: '044-000-0000',
      insertDe: '2026-06-24',
      reservationDe: '-',
      smsType: '즉시',
      resultCode: '0000',
      errMsg: '',
    },
    {
      smsId: '12017',
      msgId: 'POMS-20260624-001',
      message: '[해양수산부 항만기술안전과] 시설물안전법에 따라 2월 15일 까지 FMS에 2026년 유지관리계획 입력 바랍니다.',
      recieverNm: '인천항만공사',
      recieverPn: '010-2222-5678',
      callerNm: 'POMS',
      callerPn: '044-000-0000',
      insertDe: '2026-06-24',
      reservationDe: '-',
      smsType: '즉시',
      resultCode: '0000',
      errMsg: '',
    },
    {
      smsId: '12015',
      msgId: null,
      message: '[해양수산부 항만기술안전과] 관리주체별 하반기 정기안전점검 자료 제출 바랍니다.',
      recieverNm: '울산항만공사',
      recieverPn: '010-4444-5678',
      callerNm: 'POMS',
      callerPn: '044-000-0000',
      insertDe: '2026-06-21',
      reservationDe: '2026-06-24',
      smsType: '예약',
      resultCode: '',
      errMsg: '',
    },
    {
      smsId: '12014',
      msgId: 'POMS-20260613-001',
      message: '[해양수산부 항만기술안전과] 2026년 상반기 정기안전점검 미점검 시설물 확인 바랍니다.',
      recieverNm: '목포지방해양수산청',
      recieverPn: '010-5555-5678',
      callerNm: 'POMS',
      callerPn: '044-000-0000',
      insertDe: '2026-06-13',
      reservationDe: '-',
      smsType: '즉시',
      resultCode: '0000',
      errMsg: '',
    },
    {
      smsId: '12013',
      msgId: 'POMS-20260613-001',
      message: '[해양수산부 항만기술안전과] 2026년 상반기 정기안전점검 미점검 시설물 확인 바랍니다.',
      recieverNm: '여수광양항만공사',
      recieverPn: '010-6666-5678',
      callerNm: 'POMS',
      callerPn: '044-000-0000',
      insertDe: '2026-06-13',
      reservationDe: '-',
      smsType: '즉시',
      resultCode: '0000',
      errMsg: '',
    },
    {
      smsId: '12012',
      msgId: 'POMS-20260531-003',
      message: '[해양수산부 항만기술안전과] 정밀안전진단 대상 시설물 자료 확인 바랍니다.',
      recieverNm: '평택지방해양수산청',
      recieverPn: '010-7777-5678',
      callerNm: 'POMS',
      callerPn: '044-000-0000',
      insertDe: '2026-05-31',
      reservationDe: '-',
      smsType: '즉시',
      resultCode: '0000',
      errMsg: '',
    },
  ];

  let filteredLogs = [...logs];
  let selectedDate = '';
  const pagingState = {
    page: 1,
    pageSize: 10,
  };

  const els = {};

  function init() {
    cacheElements();
    if (!els.body) return;

    PomsSidebarAdmin.mount('#sidebar-root', { active: 'sms-history' });
    setDefaultDates();
    bindEvents();
    applySearch();
  }

  function cacheElements() {
    els.form = document.getElementById('smsHistorySearchForm');
    els.startDate = document.getElementById('startDate');
    els.endDate = document.getElementById('endDate');
    els.body = document.getElementById('smsHistoryBody');
    els.resultCount = document.getElementById('smsHistoryResultCount');
    els.modal = document.getElementById('smsHistoryModal');
    els.overlay = document.getElementById('smsHistoryOverlay');
    els.detailTitle = document.getElementById('smsHistoryDetailTitle');
    els.detailDesc = document.getElementById('smsHistoryDetailDesc');
    els.detailSummary = document.getElementById('smsHistoryDetailSummary');
    els.detailBody = document.getElementById('smsHistoryDetailBody');
    els.closeButtons = document.querySelectorAll('[data-close-sms-history]');
  }

  function isDrawerOpen() {
    return !!els.modal?.classList.contains('is-open');
  }

  function bindEvents() {
    els.form.addEventListener('submit', (event) => {
      event.preventDefault();
      applySearch();
    });

    els.closeButtons.forEach((button) => {
      button.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isDrawerOpen()) closeModal();
    });
  }

  function setDefaultDates() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    els.startDate.value = toDateInputValue(start);
    els.endDate.value = toDateInputValue(now);
  }

  function applySearch() {
    const start = els.startDate.value;
    const end = els.endDate.value;

    filteredLogs = logs.filter((item) => {
      return (!start || item.insertDe >= start) && (!end || item.insertDe <= end);
    });

    selectedDate = '';
    pagingState.page = 1;
    renderList();
  }

  function renderList() {
    const groups = groupByInsertDate(filteredLogs);
    const pageGroups = groups.slice((pagingState.page - 1) * pagingState.pageSize, pagingState.page * pagingState.pageSize);
    const start = (pagingState.page - 1) * pagingState.pageSize;

    if (els.resultCount) els.resultCount.textContent = String(groups.length);

    if (!groups.length) {
      els.body.innerHTML = '<tr><td class="sms-history-empty" colspan="4">조회된 내용이 없습니다.</td></tr>';
      renderPagination(0);
      return;
    }

    els.body.innerHTML = pageGroups
      .map((group, index) => {
        const first = group.items[0];
        const selectedClass = group.insertDe === selectedDate ? ' class="is-selected"' : '';
        return `
          <tr${selectedClass} data-insert-date="${escapeHtml(group.insertDe)}">
            <td>${start + index + 1}</td>
            <td>${escapeHtml(group.insertDe)}</td>
            <td>${escapeHtml(first.reservationDe || '-')}</td>
            <td><span class="sms-history-message">${formatMessageHtml(first.message)}</span></td>
          </tr>`;
      })
      .join('');

    els.body.querySelectorAll('tr[data-insert-date]').forEach((row) => {
      row.addEventListener('click', () => openDetail(row.dataset.insertDate));
    });
    renderPagination(groups.length);
  }

  function renderPagination(totalRows) {
    PomsPaging.mount({
      paginationId: 'smsHistoryPagination',
      totalRows,
      state: pagingState,
      onChange: renderList,
    });
  }

  function openDetail(insertDe) {
    selectedDate = insertDe;
    const items = filteredLogs
      .filter((item) => item.insertDe === insertDe)
      .sort((a, b) => Number(b.smsId) - Number(a.smsId));

    if (!items.length) return;

    const first = items[0];
    els.detailTitle.textContent = `발송이력 상세 - ${insertDe}`;
    els.detailDesc.textContent = '동일 등록일로 묶인 수신자별 발송 로그입니다.';
    els.detailSummary.innerHTML = `
      <span><strong>등록일</strong> ${escapeHtml(insertDe)}</span>
      <span><strong>예약전송</strong> ${escapeHtml(first.reservationDe || '-')}</span>
      <span><strong>수신자</strong> ${items.length}건</span>`;

    els.detailBody.innerHTML = items
      .map((item) => `
        <tr>
          <td>${escapeHtml(item.recieverNm)}</td>
          <td>${escapeHtml(item.recieverPn)}</td>
          <td>${escapeHtml(item.msgId || '-')}</td>
          <td><span class="sms-history-detail-message">${formatMessageHtml(item.message)}</span></td>
        </tr>`)
      .join('');

    renderList();
    openModal();
  }

  function openModal() {
    if (!els.modal) return;
    if (els.overlay) els.overlay.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        els.overlay?.classList.add('is-open');
        els.modal.classList.add('is-open');
      });
    });
    els.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!els.modal) return;
    els.modal.classList.remove('is-open');
    els.modal.setAttribute('aria-hidden', 'true');
    if (els.overlay) {
      els.overlay.classList.remove('is-open');
      window.setTimeout(() => {
        if (!els.overlay.classList.contains('is-open')) els.overlay.hidden = true;
      }, 220);
    }
    document.body.style.overflow = '';
  }

  function groupByInsertDate(items) {
    const map = new Map();

    [...items]
      .sort((a, b) => Number(b.smsId) - Number(a.smsId))
      .forEach((item) => {
        if (!map.has(item.insertDe)) {
          map.set(item.insertDe, []);
        }
        map.get(item.insertDe).push(item);
      });

    return Array.from(map, ([insertDe, groupItems]) => ({
      insertDe,
      items: groupItems,
    })).sort((a, b) => b.insertDe.localeCompare(a.insertDe));
  }

  function toDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatMessageHtml(message) {
    const text = String(message ?? '');
    const match = text.match(/^(\[[^\]]+\])\s*(.*)$/);
    if (!match) {
      return `<span class="sms-history-message__body">${escapeHtml(text)}</span>`;
    }
    return (
      `<span class="sms-history-message__prefix">${escapeHtml(match[1])}</span>` +
      (match[2] ? ` <span class="sms-history-message__body">${escapeHtml(match[2])}</span>` : '')
    );
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
