/**
 * 연락처 선택 — 문자전송 수신자 추가 (모달 / 독립 페이지)
 */
(() => {
  const RETURN_URL = new URLSearchParams(window.location.search).get('return') || 'sms-send.html';
  const ALPHA_TABS = ['전체', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'A-Z', '0-9'];
  const modal = document.getElementById('smsContactPickerModal');
  const overlay = document.getElementById('smsContactPickerOverlay');
  const isModalMode = !!modal;

  function isDrawerOpen() {
    return !!modal?.classList.contains('is-open');
  }

  const state = {
  filters: { name: '', groupId: '', agency: '', position: '', alpha: '전체' },
  filtered: [],
  selectedIds: new Set(),
  page: 1,
  pageSize: 10,
  };

  let onImportCallback = null;

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function getInitial(name) {
    const ch = name.trim()[0];
    if (!ch) return '';
    if (/[0-9]/.test(ch)) return '0-9';
    if (/[a-zA-Z]/.test(ch)) return 'A-Z';
    const code = ch.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) return '';
    const initials = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const idx = Math.floor((code - 0xac00) / 588);
    const initial = initials[idx] || '';
    if (initial === 'ㄲ') return 'ㄱ';
    if (initial === 'ㄸ') return 'ㄷ';
    if (initial === 'ㅃ') return 'ㅂ';
    if (initial === 'ㅆ') return 'ㅅ';
    if (initial === 'ㅉ') return 'ㅈ';
    return initial;
  }

  function matchAlpha(name, alpha) {
    if (alpha === '전체') return true;
    const initial = getInitial(name);
    if (alpha === 'A-Z') return initial === 'A-Z';
    if (alpha === '0-9') return initial === '0-9';
    return initial === alpha;
  }

  function getGroupName(groupId) {
    return SmsContactsData.getGroupById(groupId)?.name || '-';
  }

  function applyFilters() {
    let list = SmsContactsData.getContacts();
    const { name, groupId, agency, position, alpha } = state.filters;

    if (groupId) list = list.filter((c) => c.groupId === groupId);
    if (name) list = list.filter((c) => c.name.includes(name));
    if (agency) list = list.filter((c) => c.agency === agency);
    if (position) list = list.filter((c) => c.position === position);
    list = list.filter((c) => matchAlpha(c.name, alpha));

    state.filtered = list;
    const maxPage = Math.max(1, Math.ceil(list.length / state.pageSize));
    if (state.page > maxPage) state.page = maxPage;
  }

  function getPageData() {
    const start = (state.page - 1) * state.pageSize;
    return state.filtered.slice(start, start + state.pageSize);
  }

  function totalPages() {
    return Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  }

  function updateSelectedCount() {
    const el = $('#pickerSelectedCount');
    if (el) el.textContent = state.selectedIds.size;
  }

  function renderAlphaTabs() {
    const wrap = $('#pickerAlphaTabs');
    if (!wrap) return;
    wrap.innerHTML = ALPHA_TABS.map((tab) => `
      <button type="button" class="sms-alpha-tab${state.filters.alpha === tab ? ' is-active' : ''}" data-alpha="${tab}">${tab}</button>
    `).join('');
  }

  function renderTable() {
    const tbody = $('#pickerContactBody');
    if (!tbody) return;

    const pageData = getPageData();
    if (!pageData.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="padding:28px;text-align:center;color:#6c788b;background:#fff;border-radius:10px;">연락처가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = pageData.map((row) => `
      <tr>
        <td class="col-check"><input type="checkbox" class="picker-row-check" data-id="${row.id}"${state.selectedIds.has(row.id) ? ' checked' : ''} aria-label="${row.name} 선택"></td>
        <td>${row.name}</td>
        <td>${row.phone}</td>
        <td>${row.agency}</td>
        <td>${row.position}</td>
        <td>${getGroupName(row.groupId)}</td>
      </tr>
    `).join('');

    const checkAll = $('#pickerCheckAll');
    if (checkAll) {
      const pageIds = pageData.map((r) => r.id);
      checkAll.checked = pageIds.length > 0 && pageIds.every((id) => state.selectedIds.has(id));
      checkAll.indeterminate = !checkAll.checked && pageIds.some((id) => state.selectedIds.has(id));
    }
  }

  function renderPagination() {
    PomsPaging.mount({
      paginationId: 'pickerContactPagination',
      totalRows: state.filtered.length,
      state,
      onChange: render,
    });
  }

  function render() {
    applyFilters();
    renderAlphaTabs();
    renderTable();
    renderPagination();
    updateSelectedCount();
  }

  function fillSelectOptions() {
    const groupSel = $('#pickerFilterGroup');
    const agencySel = $('#pickerFilterAgency');
    const positionSel = $('#pickerFilterPosition');

    if (groupSel) {
      const groups = SmsContactsData.getGroups();
      groupSel.innerHTML = '<option value="">전체</option>' + groups.map((g) => `<option value="${g.id}">${g.name}</option>`).join('');
    }
    if (agencySel) {
      agencySel.innerHTML = '<option value="">전체</option>' + SmsContactsData.AGENCIES.map((a) => `<option value="${a}">${a}</option>`).join('');
    }
    if (positionSel) {
      positionSel.innerHTML = '<option value="">전체</option>' + SmsContactsData.POSITIONS.map((p) => `<option value="${p}">${p}</option>`).join('');
    }
  }

  function resetPickerState() {
    state.filters = { name: '', groupId: '', agency: '', position: '', alpha: '전체' };
    state.selectedIds.clear();
    state.page = 1;
    state.pageSize = 10;

    if ($('#pickerFilterName')) $('#pickerFilterName').value = '';
    if ($('#pickerFilterGroup')) $('#pickerFilterGroup').value = '';
    if ($('#pickerFilterAgency')) $('#pickerFilterAgency').value = '';
    if ($('#pickerFilterPosition')) $('#pickerFilterPosition').value = '';
  }

  function buildImportList() {
    return SmsContactsData.getContactsByIds([...state.selectedIds]).map((c) => ({
      id: `r-${c.id}`,
      name: c.name,
      phone: c.phone,
    }));
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (overlay) {
      overlay.classList.remove('is-open');
      window.setTimeout(() => {
        if (!overlay.classList.contains('is-open')) overlay.hidden = true;
      }, 220);
    }
    document.body.style.overflow = '';
    onImportCallback = null;
  }

  function openModal(onImport) {
    if (!modal) return;
    onImportCallback = typeof onImport === 'function' ? onImport : null;
    resetPickerState();
    render();
    if (overlay) overlay.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay?.classList.add('is-open');
        modal.classList.add('is-open');
      });
    });
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#pickerFilterName')?.focus();
  }

  function submitSelection() {
    if (!state.selectedIds.size) {
      alert('추가할 연락처를 선택해 주세요.');
      return;
    }

    const list = buildImportList();

    if (isModalMode) {
      onImportCallback?.(list);
      closeModal();
      return;
    }

    SmsContactsData.setImportRecipients(list);
    window.location.href = RETURN_URL;
  }

  function cancelSelection() {
    if (isModalMode) {
      closeModal();
      return;
    }
    window.location.href = RETURN_URL;
  }

  function bindEvents() {
    $('#pickerFilterForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.filters.name = $('#pickerFilterName')?.value.trim() || '';
      state.filters.groupId = $('#pickerFilterGroup')?.value || '';
      state.filters.agency = $('#pickerFilterAgency')?.value || '';
      state.filters.position = $('#pickerFilterPosition')?.value || '';
      state.page = 1;
      render();
    });

    $('#pickerAlphaTabs')?.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-alpha]');
      if (!tab) return;
      state.filters.alpha = tab.dataset.alpha;
      state.page = 1;
      render();
    });

    $('#pickerContactBody')?.addEventListener('change', (e) => {
      const check = e.target.closest('.picker-row-check');
      if (!check) return;
      if (check.checked) state.selectedIds.add(check.dataset.id);
      else state.selectedIds.delete(check.dataset.id);
      updateSelectedCount();
      renderTable();
    });

    $('#pickerCheckAll')?.addEventListener('change', (e) => {
      getPageData().forEach((row) => {
        if (e.target.checked) state.selectedIds.add(row.id);
        else state.selectedIds.delete(row.id);
      });
      updateSelectedCount();
      renderTable();
    });

    $('#pickerCancelBtn')?.addEventListener('click', cancelSelection);
    $('#pickerSubmitBtn')?.addEventListener('click', submitSelection);

    document.querySelectorAll('[data-close-contact-picker]').forEach((el) => {
      el.addEventListener('click', cancelSelection);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isDrawerOpen()) cancelSelection();
    });
  }

  function init() {
    if (!isModalMode) {
      PomsSidebarAdmin.mount('#sidebar-root', { active: 'sms-send' });
      fillSelectOptions();
      bindEvents();
      render();
      return;
    }

    fillSelectOptions();
    bindEvents();
  }

  window.SmsContactPicker = {
    open: openModal,
    close: closeModal,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
