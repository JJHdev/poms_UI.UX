(function () {
  const CHECK_TYPES = {
    '100': '정기안전점검',
    '202': '정밀안전점검',
    '401': '정밀안전진단',
  };

  let schedules = [
    {
      smsSchdlSn: '1',
      chckGbn: '100',
      schdlDe: '02-03',
      msg: '[해양수산부 항만기술안전과] 시설물안전법에 따라 2월 15일 까지 FMS에 {이번해}년 유지관리계획 입력 바랍니다.',
    },
    {
      smsSchdlSn: '2',
      chckGbn: '100',
      schdlDe: '02-10',
      msg: '[해양수산부 항만기술안전과] 시설물안전법에 따라 2월 15일 까지 {이번해}년 유지관리계획 입력 바랍니다.',
    },
    {
      smsSchdlSn: '3',
      chckGbn: '100',
      schdlDe: '06-07',
      msg: '[해양수산부 항만기술안전과] {관리주체}{이번해}년 상반기 정기안전점검 미점검 시설물 수는 {상반기정기점검}건입니다.',
    },
    {
      smsSchdlSn: '4',
      chckGbn: '401',
      schdlDe: '10-04',
      msg: '[해양수산부 항만기술안전과] {관리주체}{다음해}년 정밀안전진단 대상 시설물 수는 {다음해점검예정}건입니다.',
    },
    {
      smsSchdlSn: '5',
      chckGbn: '401',
      schdlDe: '10-04',
      msg: '[해양수산부 항만기술안전과] {관리주체}{지난해}년 정밀안전진단 미점검 시설물 수는 {지난해점검누락}건입니다.',
    },
    {
      smsSchdlSn: '6',
      chckGbn: '202',
      schdlDe: '10-11',
      msg: '[해양수산부 항만기술안전과] {관리주체}{지난해}년 정밀안전점검 미점검 시설물 수는 {지난해점검누락}건입니다.',
    },
    {
      smsSchdlSn: '7',
      chckGbn: '202',
      schdlDe: '10-11',
      msg: '[해양수산부 항만기술안전과] {관리주체}{다음해}년 정밀안전점검 대상 시설물 수는 {다음해점검예정}건입니다.',
    },
    {
      smsSchdlSn: '8',
      chckGbn: '100',
      schdlDe: '11-29',
      msg: '[해양수산부 항만기술안전과] {관리주체}{이번해}년 하반기 정기안전점검 미점검 시설물 수는 {하반기정기점검}건입니다.',
    },
    {
      smsSchdlSn: '9',
      chckGbn: '100',
      schdlDe: '12-13',
      msg: '[해양수산부 항만기술안전과] {관리주체}{이번해}년 하반기 정기안전점검 자료 제출 바랍니다.',
    },
    {
      smsSchdlSn: '10',
      chckGbn: '100',
      schdlDe: '12-27',
      msg: '[해양수산부 항만기술안전과] {관리주체}{이번해}년 하반기 정기안전점검 최종 확인 바랍니다.',
    },
  ];

  let selectedId = null;
  let mode = 'idle';

  const els = {};

  const state = {
    page: 1,
    pageSize: 10,
  };

  function init() {
    cacheElements();
    if (!els.body) return;

    PomsSidebarAdmin.mount('#sidebar-root', { active: 'sms-reserve' });
    bindEvents();
    renderList();
    setIdle();
  }

  function cacheElements() {
    els.body = document.getElementById('smsReserveBody');
    els.add = document.getElementById('smsReserveAdd');
    els.modal = document.getElementById('smsReserveModal');
    els.overlay = document.getElementById('smsReserveOverlay');
    els.form = document.getElementById('smsReserveForm');
    els.smsSchdlSn = document.getElementById('smsSchdlSn');
    els.chckGbn = document.getElementById('chckGbn');
    els.schdlDe = document.getElementById('inputSchdlDe');
    els.msg = document.getElementById('inputMsg');
    els.save = document.getElementById('smsReserveSave');
    els.delete = document.getElementById('smsReserveDelete');
    els.modeText = document.getElementById('smsReserveModeText');
    els.saveNote = document.getElementById('smsReserveSaveNote');
    els.closeButtons = document.querySelectorAll('[data-close-sms-reserve]');
  }

  function isDrawerOpen() {
    return !!els.modal?.classList.contains('is-open');
  }

  function bindEvents() {
    els.add?.addEventListener('click', setInsertMode);
    els.save?.addEventListener('click', saveSchedule);
    els.delete?.addEventListener('click', deleteSchedule);
    els.chckGbn?.addEventListener('change', updateGuide);
    els.schdlDe?.addEventListener('input', formatScheduleDate);
    els.closeButtons.forEach((button) => {
      button.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isDrawerOpen()) closeModal();
    });
  }

  function renderList() {
    const rows = [...schedules].sort(sortSchedule);
    const totalRows = rows.length;

    state.page = PomsPaging.clampPage(state.page, totalRows, state.pageSize);

    const start = (state.page - 1) * state.pageSize;
    const pageRows = rows.slice(start, start + state.pageSize);

    if (!rows.length) {
      els.body.innerHTML = '<tr><td class="sms-reserve-empty" colspan="4">조회된 내용이 없습니다.</td></tr>';
    } else {
      els.body.innerHTML = pageRows
        .map((item, index) => {
          const isSelected = item.smsSchdlSn === selectedId ? ' class="is-selected"' : '';
          return `
            <tr${isSelected} data-id="${escapeHtml(item.smsSchdlSn)}">
              <td>${start + index + 1}</td>
              <td>${escapeHtml(getCheckTypeName(item.chckGbn))}</td>
              <td>${escapeHtml(item.schdlDe)}</td>
              <td><span class="sms-reserve-message">${escapeHtml(item.msg)}</span></td>
            </tr>`;
        })
        .join('');
    }

    els.body.querySelectorAll('tr[data-id]').forEach((row) => {
      row.addEventListener('click', () => selectSchedule(row.dataset.id));
    });

    PomsPaging.mount({
      paginationId: 'smsReservePagination',
      totalRows,
      state,
      onChange: renderList,
    });
  }

  function selectSchedule(id) {
    const item = schedules.find((row) => row.smsSchdlSn === id);
    if (!item) return;

    selectedId = id;
    mode = 'update';
    els.smsSchdlSn.value = item.smsSchdlSn;
    els.chckGbn.value = item.chckGbn;
    els.schdlDe.value = item.schdlDe;
    els.msg.value = item.msg;
    els.delete.hidden = false;
    setFormDisabled(false);
    els.modeText.textContent = '선택한 예약문자를 수정하거나 삭제할 수 있습니다.';
    setSaveNote('');
    updateGuide();
    renderList();
    openModal();
  }

  function setIdle() {
    selectedId = null;
    mode = 'idle';
    els.form.reset();
    els.smsSchdlSn.value = '';
    els.delete.hidden = true;
    setFormDisabled(true);
    els.modeText.textContent = '목록에서 예약문자를 선택하거나 추가 버튼을 눌러 입력하세요.';
    setSaveNote('');
    updateGuide();
    closeModal();
    renderList();
  }

  function setInsertMode() {
    selectedId = null;
    mode = 'insert';
    els.form.reset();
    els.smsSchdlSn.value = '';
    els.delete.hidden = true;
    setFormDisabled(false);
    els.modeText.textContent = '새 문자예약을 입력하는 중입니다.';
    setSaveNote('');
    updateGuide();
    renderList();
    openModal();
    els.chckGbn.focus();
  }

  function saveSchedule() {
    if (mode === 'idle') return;

    const payload = {
      smsSchdlSn: els.smsSchdlSn.value || getNextId(),
      chckGbn: els.chckGbn.value,
      schdlDe: els.schdlDe.value.trim(),
      msg: els.msg.value.trim(),
    };

    if (mode === 'update' && selectedId) {
      schedules = schedules.map((item) => (item.smsSchdlSn === selectedId ? payload : item));
      selectedId = payload.smsSchdlSn;
      setSaveNote('수정되었습니다.');
    } else {
      schedules.push(payload);
      selectedId = payload.smsSchdlSn;
      mode = 'update';
      els.smsSchdlSn.value = payload.smsSchdlSn;
      els.delete.hidden = false;
      els.modeText.textContent = '선택한 예약문자를 수정하거나 삭제할 수 있습니다.';
      setSaveNote('등록되었습니다.');
    }

    renderList();
  }

  function deleteSchedule() {
    if (!selectedId) return;
    const ok = window.confirm('정말로 SMS 스케쥴을 삭제하시겠습니까?');
    if (!ok) return;

    schedules = schedules.filter((item) => item.smsSchdlSn !== selectedId);
    setIdle();
    setSaveNote('삭제되었습니다.');
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
    window.setTimeout(() => els.chckGbn?.focus(), 0);
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

  function setFormDisabled(disabled) {
    [els.chckGbn, els.schdlDe, els.msg, els.save].forEach((el) => {
      if (el) el.disabled = disabled;
    });
  }

  function updateGuide() {
    const value = els.chckGbn.value;
    document.querySelectorAll('[data-reserve-guide]').forEach((guide) => {
      const key = guide.dataset.reserveGuide;
      guide.hidden = !(key === value || (key === '202' && value === '401'));
    });
  }

  function formatScheduleDate(event) {
    const onlyDigits = event.target.value.replace(/\D/g, '').slice(0, 4);
    event.target.value = onlyDigits.length > 2 ? `${onlyDigits.slice(0, 2)}-${onlyDigits.slice(2)}` : onlyDigits;
  }

  function sortSchedule(a, b) {
    return (
      a.schdlDe.localeCompare(b.schdlDe) ||
      a.chckGbn.localeCompare(b.chckGbn) ||
      Number(a.smsSchdlSn) - Number(b.smsSchdlSn)
    );
  }

  function getNextId() {
    const max = schedules.reduce((acc, item) => Math.max(acc, Number(item.smsSchdlSn) || 0), 0);
    return String(max + 1);
  }

  function getCheckTypeName(code) {
    return CHECK_TYPES[code] || '-선택-';
  }

  function setSaveNote(message) {
    els.saveNote.textContent = message;
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
