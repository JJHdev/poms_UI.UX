/**
 * 연락처 관리 — 그룹·연락처 목록, 모달, 일괄 이동
 */
(() => {
  const ALPHA_TABS = ['전체', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'A-Z', '0-9'];

  const state = {
    selectedGroupId: 'all',
    filters: { name: '', group: '', agency: '', position: '', assigned: '', alpha: '전체' },
    filtered: [],
    selectedIds: new Set(),
    currentPage: 1,
    pageSize: 10,
    editingGroupId: null,
    editingContactId: null,
  };

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

  function applyFilters() {
    let list = SmsContactsData.getContacts();

    if (state.selectedGroupId !== 'all') {
      list = list.filter((c) => c.groupId === state.selectedGroupId);
    }

    const { name, group, agency, position, assigned, alpha } = state.filters;
    if (name) list = list.filter((c) => c.name.includes(name));
    if (group) list = list.filter((c) => c.groupId === group);
    if (agency) list = list.filter((c) => c.agency === agency);
    if (position) list = list.filter((c) => c.position === position);
    if (assigned === 'yes') list = list.filter((c) => c.assigned);
    if (assigned === 'no') list = list.filter((c) => !c.assigned);
    list = list.filter((c) => matchAlpha(c.name, alpha));

    state.filtered = list;
    const maxPage = Math.max(1, Math.ceil(list.length / state.pageSize));
    if (state.currentPage > maxPage) state.currentPage = maxPage;
  }

  function getPageData() {
    const start = (state.currentPage - 1) * state.pageSize;
    return state.filtered.slice(start, start + state.pageSize);
  }

  function totalPages() {
    return Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  }

  function closeAllGroupMenus() {
    document.querySelectorAll('.sms-group-menu').forEach((el) => {
      el.hidden = true;
    });
  }

  function renderGroups() {
    const listEl = $('#smsGroupList');
    if (!listEl) return;

    const groups = SmsContactsData.getGroups();
    const total = SmsContactsData.getTotalCount();

    const allItem = `
      <li class="sms-group-item${state.selectedGroupId === 'all' ? ' is-active' : ''}" data-group-id="all">
        <span class="sms-group-item__name">전체</span>
        <span class="sms-group-item__count">${total}</span>
      </li>`;

    const groupItems = groups.map((g) => `
      <li class="sms-group-item${state.selectedGroupId === g.id ? ' is-active' : ''}" data-group-id="${g.id}">
        <span class="sms-group-item__name">${g.name}</span>
        <span class="sms-group-item__count">${g.count}</span>
        <div class="sms-group-item__menu">
          <button type="button" class="sms-group-item__menu-btn" data-group-menu="${g.id}" aria-label="${g.name} 메뉴">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
          </button>
          <ul class="sms-group-menu" id="groupMenu-${g.id}" hidden>
            <li><button type="button" data-group-edit="${g.id}">수정</button></li>
            <li><button type="button" class="is-danger" data-group-delete="${g.id}">삭제</button></li>
          </ul>
        </div>
      </li>`).join('');

    listEl.innerHTML = allItem + groupItems;

    const label = state.selectedGroupId === 'all'
      ? '전체'
      : (SmsContactsData.getGroupById(state.selectedGroupId)?.name || '전체');
    const labelEl = $('#smsContactGroupLabel');
    if (labelEl) labelEl.textContent = label;

    /* 검색조건의 그룹 셀렉트도 항상 최신 목록으로 유지 */
    const groupFilter = $('#filterGroup');
    if (groupFilter) {
      const keep = state.filters.group;
      groupFilter.innerHTML = '<option value="">전체</option>'
        + groups.map((g) => `<option value="${g.id}">${g.name}</option>`).join('');
      groupFilter.value = keep && SmsContactsData.getGroupById(keep) ? keep : '';
      state.filters.group = groupFilter.value;
    }
  }

  function renderAlphaTabs() {
    const wrap = $('#smsAlphaTabs');
    if (!wrap) return;
    wrap.innerHTML = ALPHA_TABS.map((tab) => `
      <button type="button" class="sms-alpha-tab${state.filters.alpha === tab ? ' is-active' : ''}" data-alpha="${tab}" role="tab" aria-selected="${state.filters.alpha === tab}">${tab}</button>
    `).join('');
  }

  function renderTable() {
    const tbody = $('#smsContactBody');
    if (!tbody) return;

    const pageData = getPageData();

    if (!pageData.length) {
      tbody.innerHTML = '<tr class="sms-contacts-empty"><td colspan="7">연락처가 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = pageData.map((row) => `
      <tr>
        <td class="col-check"><input type="checkbox" class="sms-row-check" data-id="${row.id}"${state.selectedIds.has(row.id) ? ' checked' : ''} aria-label="${row.name} 선택"></td>
        <td class="col-name">${row.name}</td>
        <td class="col-phone">${row.phone}</td>
        <td class="col-agency">${row.agency}</td>
        <td class="col-position">${row.position}</td>
        <td class="col-assigned">${row.assigned ? '담당' : '미담당'}</td>
        <td class="col-action">
          <div class="sms-contacts-actions">
            <button type="button" class="btn-row-edit" data-edit="${row.id}" aria-label="${row.name} 수정">수정</button>
            <button type="button" class="btn-row-del" data-delete="${row.id}" aria-label="${row.name} 삭제">삭제</button>
          </div>
        </td>
      </tr>
    `).join('');

    const checkAll = $('#smsCheckAll');
    if (checkAll) {
      const pageIds = pageData.map((r) => r.id);
      checkAll.checked = pageIds.length > 0 && pageIds.every((id) => state.selectedIds.has(id));
      checkAll.indeterminate = !checkAll.checked && pageIds.some((id) => state.selectedIds.has(id));
    }
  }

  function renderPagination() {
    const nav = $('#smsContactPagination');
    if (!nav) return;

    state.page = state.currentPage;
    PomsPaging.mount({
      paginationId: 'smsContactPagination',
      totalRows: state.filtered.length,
      state,
      onChange: () => {
        state.currentPage = state.page;
        render();
      },
    });
  }

  function updateBulkBar() {
    const count = state.selectedIds.size;

    const inlineCount = $('#smsBulkCountInline');
    const moveTopBtn = $('#btnBulkMoveTop');
    if (inlineCount) inlineCount.textContent = count;
    if (moveTopBtn) moveTopBtn.disabled = count === 0;

    /* 구버전 하단 벌크바가 남아 있을 경우 대비 */
    const countEl = $('#smsBulkCount');
    const moveBtn = $('#btnBulkMove');
    const addBtn = $('#btnBulkAdd');
    if (countEl) countEl.textContent = count;
    if (moveBtn) moveBtn.disabled = count === 0;
    if (addBtn) addBtn.disabled = count === 0;
  }

  function render() {
    applyFilters();
    renderGroups();
    renderAlphaTabs();
    renderTable();
    renderPagination();
    updateBulkBar();
  }

  function fillSelectOptions() {
    const agencyFilter = $('#filterAgency');
    const positionFilter = $('#filterPosition');
    const agencyModal = $('#contactModalAgency');
    const positionModal = $('#contactModalPosition');

    const agencyOpts = SmsContactsData.AGENCIES.map((a) => `<option value="${a}">${a}</option>`).join('');
    const positionOpts = SmsContactsData.POSITIONS.map((p) => `<option value="${p}">${p}</option>`).join('');

    if (agencyFilter) agencyFilter.innerHTML = `<option value="">전체</option>${agencyOpts}`;
    if (positionFilter) positionFilter.innerHTML = `<option value="">전체</option>${positionOpts}`;
    if (agencyModal) agencyModal.innerHTML = agencyOpts;
    if (positionModal) positionModal.innerHTML = positionOpts;
  }

  function fillGroupSelect(selectEl, includeEmpty = false) {
    if (!selectEl) return;
    const groups = SmsContactsData.getGroups();
    const empty = includeEmpty ? '<option value="">선택</option>' : '';
    selectEl.innerHTML = empty + groups.map((g) => `<option value="${g.id}">${g.name}</option>`).join('');
  }

  function openModal(id) {
    const modal = $(id);
    if (modal) modal.hidden = false;
  }

  function closeModal(id) {
    const modal = $(id);
    if (modal) modal.hidden = true;
  }

  function closeAllModals() {
    document.querySelectorAll('.sms-modal').forEach((m) => {
      m.hidden = true;
    });
  }

  function openGroupModal(groupId = null) {
    state.editingGroupId = groupId;
    const title = $('#groupModalTitle');
    const input = $('#groupModalName');
    if (title) title.textContent = groupId ? '그룹 수정' : '그룹 추가';
    if (input) {
      input.value = groupId ? (SmsContactsData.getGroupById(groupId)?.name || '') : '';
      input.focus();
    }
    openModal('#groupModal');
  }

  function openContactModal(contactId = null) {
    state.editingContactId = contactId;
    const title = $('#contactModalTitle');
    const contact = contactId ? SmsContactsData.getContacts().find((c) => c.id === contactId) : null;

    if (title) title.textContent = contactId ? '연락처 수정' : '연락처 추가';

    $('#contactModalName').value = contact?.name || '';
    $('#contactModalPhone').value = contact?.phone || '';
    $('#contactModalAgency').value = contact?.agency || SmsContactsData.AGENCIES[0];
    $('#contactModalPosition').value = contact?.position || SmsContactsData.POSITIONS[0];

    fillGroupSelect($('#contactModalGroup'));
    const defaultGroup = state.selectedGroupId !== 'all' ? state.selectedGroupId : SmsContactsData.getGroups()[0]?.id;
    $('#contactModalGroup').value = contact?.groupId || defaultGroup || '';

    const assigned = contact ? (contact.assigned ? 'yes' : 'no') : 'yes';
    document.querySelector(`input[name="contactAssigned"][value="${assigned}"]`)?.click();

    openModal('#contactModal');
  }

  function openMoveModal() {
    if (!state.selectedIds.size) {
      alert('이동할 연락처를 선택해 주세요.');
      return;
    }
    fillGroupSelect($('#moveModalGroup'));
    openModal('#moveModal');
  }

  function bindEvents() {
    $('#btnGroupAdd')?.addEventListener('click', () => openGroupModal());

    $('#groupModalForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#groupModalName')?.value.trim();
      if (!name) {
        alert('그룹명을 입력해 주세요.');
        return;
      }
      if (state.editingGroupId) {
        SmsContactsData.updateGroup(state.editingGroupId, name);
      } else {
        SmsContactsData.addGroup(name);
      }
      closeModal('#groupModal');
      render();
    });

    $('#contactModalForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: $('#contactModalName')?.value.trim(),
        phone: $('#contactModalPhone')?.value.trim(),
        agency: $('#contactModalAgency')?.value,
        position: $('#contactModalPosition')?.value,
        groupId: $('#contactModalGroup')?.value,
        assigned: document.querySelector('input[name="contactAssigned"]:checked')?.value === 'yes',
      };
      if (!data.name || !data.phone) {
        alert('이름과 전화번호를 입력해 주세요.');
        return;
      }
      if (state.editingContactId) {
        SmsContactsData.updateContact(state.editingContactId, data);
      } else {
        SmsContactsData.addContact(data);
      }
      closeModal('#contactModal');
      render();
    });

    $('#moveModalForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const groupId = $('#moveModalGroup')?.value;
      if (!groupId) {
        alert('이동할 그룹을 선택해 주세요.');
        return;
      }
      SmsContactsData.moveContactsToGroup([...state.selectedIds], groupId);
      state.selectedIds.clear();
      closeModal('#moveModal');
      render();
    });

    document.querySelectorAll('[data-close-modal]').forEach((el) => {
      el.addEventListener('click', closeAllModals);
    });

    $('#smsGroupList')?.addEventListener('click', (e) => {
      const menuBtn = e.target.closest('[data-group-menu]');
      if (menuBtn) {
        e.stopPropagation();
        const id = menuBtn.dataset.groupMenu;
        const menu = $(`#groupMenu-${id}`);
        const wasOpen = menu && !menu.hidden;
        closeAllGroupMenus();
        if (menu && !wasOpen) menu.hidden = false;
        return;
      }

      const editBtn = e.target.closest('[data-group-edit]');
      if (editBtn) {
        closeAllGroupMenus();
        openGroupModal(editBtn.dataset.groupEdit);
        return;
      }

      const deleteBtn = e.target.closest('[data-group-delete]');
      if (deleteBtn) {
        closeAllGroupMenus();
        if (confirm('그룹을 삭제하시겠습니까? 소속 연락처는 기타 기관으로 이동됩니다.')) {
          SmsContactsData.deleteGroup(deleteBtn.dataset.groupDelete);
          if (state.selectedGroupId === deleteBtn.dataset.groupDelete) {
            state.selectedGroupId = 'all';
          }
          render();
        }
        return;
      }

      const item = e.target.closest('.sms-group-item');
      if (item?.dataset.groupId && !e.target.closest('.sms-group-item__menu')) {
        state.selectedGroupId = item.dataset.groupId;
        state.currentPage = 1;
        state.selectedIds.clear();
        render();
      }
    });

    document.addEventListener('click', () => closeAllGroupMenus());

    $('#smsContactFilterForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.filters.name = $('#filterName')?.value.trim() || '';
      state.filters.group = $('#filterGroup')?.value || '';
      state.filters.agency = $('#filterAgency')?.value || '';
      state.filters.position = $('#filterPosition')?.value || '';
      state.filters.assigned = $('#filterAssigned')?.value || '';
      state.currentPage = 1;
      render();
    });

    $('#smsAlphaTabs')?.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-alpha]');
      if (!tab) return;
      state.filters.alpha = tab.dataset.alpha;
      state.currentPage = 1;
      render();
    });

    $('#smsContactBody')?.addEventListener('change', (e) => {
      const check = e.target.closest('.sms-row-check');
      if (!check) return;
      if (check.checked) state.selectedIds.add(check.dataset.id);
      else state.selectedIds.delete(check.dataset.id);
      updateBulkBar();
      renderTable();
    });

    $('#smsCheckAll')?.addEventListener('change', (e) => {
      getPageData().forEach((row) => {
        if (e.target.checked) state.selectedIds.add(row.id);
        else state.selectedIds.delete(row.id);
      });
      renderTable();
      updateBulkBar();
    });

    $('#smsContactBody')?.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-edit]');
      if (editBtn) {
        openContactModal(editBtn.dataset.edit);
        return;
      }
      const deleteBtn = e.target.closest('[data-delete]');
      if (deleteBtn) {
        if (confirm('연락처를 삭제하시겠습니까?')) {
          SmsContactsData.deleteContact(deleteBtn.dataset.delete);
          state.selectedIds.delete(deleteBtn.dataset.delete);
          render();
        }
      }
    });

    $('#btnContactAdd')?.addEventListener('click', () => openContactModal());
    $('#btnBulkMoveTop')?.addEventListener('click', openMoveModal);
    $('#btnBulkMove')?.addEventListener('click', openMoveModal);
    $('#btnBulkAdd')?.addEventListener('click', () => {
      if (!state.selectedIds.size) {
        alert('추가할 연락처를 선택해 주세요.');
        return;
      }
      const list = SmsContactsData.getContactsByIds([...state.selectedIds]).map((c) => ({
        id: `r-${c.id}`,
        name: c.name,
        phone: c.phone,
      }));
      SmsContactsData.setImportRecipients(list);
      window.location.href = 'sms-send.html';
    });

  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'sms-contacts' });
    fillSelectOptions();
    bindEvents();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
