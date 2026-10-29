/**
 * 문자전송 — 메시지 작성, 수신자, 발송 설정
 */
(() => {
  const state = {
    recipients: [
      { id: 'r1', name: '박관리', phone: '010-1234-5678' },
      { id: 'r2', name: '이과장', phone: '010-9876-5432' },
      { id: 'r3', name: '최이사', phone: '010-5678-1234' },
      { id: 'r4', name: '한국항', phone: '02-1234-5678' },
    ],
  };

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function renderRecipients() {
    const tbody = $('#smsRecipientBody');
    if (!tbody) return;

    if (!state.recipients.length) {
      tbody.innerHTML = '<tr class="sms-recipient-empty"><td colspan="4">수신자가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = state.recipients.map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${row.name}</td>
        <td>${row.phone}</td>
        <td>
          <button type="button" class="btn-sms-delete" data-id="${row.id}" aria-label="${row.name} 삭제">
            <img src="assets/sms-send/icon-delete.svg" alt="" width="18" height="18">
            삭제
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-sms-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.recipients = state.recipients.filter((row) => row.id !== btn.dataset.id);
        renderRecipients();
      });
    });
  }

  function addRecipient() {
    const name = $('#smsAddName')?.value.trim() || '';
    const phone = $('#smsAddPhone')?.value.trim() || '';

    if (!name || !phone) {
      alert('이름과 전화번호를 입력해 주세요.');
      return;
    }

    state.recipients.push({
      id: `r${Date.now()}`,
      name,
      phone,
    });

    if ($('#smsAddName')) $('#smsAddName').value = '';
    if ($('#smsAddPhone')) $('#smsAddPhone').value = '';
    renderRecipients();
  }

  function resetForm() {
    const textarea = $('#smsMessage');
    if (textarea) textarea.value = '';
  }

  function toggleScheduleInputs() {
    const isScheduled = document.querySelector('input[name="sendType"]:checked')?.value === 'scheduled';
    const dateInput = $('#smsScheduleDate');
    const timeInput = $('#smsScheduleTime');
    if (dateInput) dateInput.disabled = !isScheduled;
    if (timeInput) timeInput.disabled = !isScheduled;
  }

  function sendMessage() {
    const message = $('#smsMessage')?.value.trim() || '';
    if (!message) {
      alert('메시지 내용을 입력해 주세요.');
      return;
    }
    if (!state.recipients.length) {
      alert('수신자를 추가해 주세요.');
      return;
    }

    const sendType = document.querySelector('input[name="sendType"]:checked')?.value;
    if (sendType === 'scheduled') {
      const date = $('#smsScheduleDate')?.value;
      const time = $('#smsScheduleTime')?.value;
      if (!date || !time) {
        alert('예약 발송 일시를 선택해 주세요.');
        return;
      }
      alert(`문자가 예약되었습니다. (샘플)\n수신자 ${state.recipients.length}명`);
      return;
    }

    alert(`문자가 발송되었습니다. (샘플)\n수신자 ${state.recipients.length}명`);
  }

  function mergeImportedRecipients(imported) {
    if (!imported?.length) return;

    imported.forEach((row) => {
      const exists = state.recipients.some((r) => r.phone === row.phone);
      if (!exists) state.recipients.push(row);
    });
    renderRecipients();
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'sms-send' });

    mergeImportedRecipients(SmsContactsData.consumeImportRecipients());

    $('#smsResetBtn')?.addEventListener('click', resetForm);
    $('#smsAddRowBtn')?.addEventListener('click', addRecipient);
    $('#smsImportBtn')?.addEventListener('click', () => {
      if (window.SmsContactPicker) {
        SmsContactPicker.open(mergeImportedRecipients);
        return;
      }
      window.location.href = 'sms-contact-picker.html?return=sms-send.html';
    });
    $('#smsSendBtn')?.addEventListener('click', sendMessage);

    document.querySelectorAll('input[name="sendType"]').forEach((radio) => {
      radio.addEventListener('change', toggleScheduleInputs);
    });

    renderRecipients();
    toggleScheduleInputs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
