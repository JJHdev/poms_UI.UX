/**
 * 관리자 - 사용자 상세 (보기 / 수정 모드)
 */
(() => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id') || 'jc010';
  let user = AdminUsersData.getById(userId);
  let isEditing = false;
  let draft = null;

  const page = document.getElementById('userDetailPage');

  /** 활성 시 위험(빨간) 스타일을 쓸 토글 값 */
  const TOGGLE_DANGER_VALUE = {
    toggleUse: 'N',
    toggleLock: 'Y',
  };

  function usageBadgeHtml(u) {
    const cls = u.usage === 'admin' ? 'badge-usage--admin' : 'badge-usage--active';
    return `<span class="badge-usage ${cls}">${u.usageLabel}</span>`;
  }

  function setToggle(groupId, value) {
    const group = document.getElementById(groupId);
    const dangerVal = TOGGLE_DANGER_VALUE[groupId];
    if (!group) return;
    group.querySelectorAll('.toggle-group__btn').forEach((btn) => {
      const active = btn.dataset.value === value;
      btn.classList.toggle('is-active', active);
      btn.classList.toggle(
        'is-active--danger',
        active && dangerVal != null && btn.dataset.value === dangerVal
      );
    });
  }

  function getToggleValue(groupId) {
    const active = document.querySelector(`#${groupId} .toggle-group__btn.is-active`);
    return active?.dataset.value || 'N';
  }

  function bindToggle(groupId) {
    const group = document.getElementById(groupId);
    const dangerVal = TOGGLE_DANGER_VALUE[groupId];
    group?.querySelectorAll('.toggle-group__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!isEditing) return;
        group.querySelectorAll('.toggle-group__btn').forEach((b) => {
          b.classList.remove('is-active', 'is-active--danger');
        });
        btn.classList.add('is-active');
        if (dangerVal != null && btn.dataset.value === dangerVal) {
          btn.classList.add('is-active--danger');
        }
      });
    });
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function syncInputsFromUser(u) {
    const map = {
      fieldIdInput: u.id,
      fieldDisplayNameInput: u.displayName,
      fieldIpInput: u.userIp,
      fieldOrgInput: u.org,
      fieldDeptInput: u.department,
      fieldPositionInput: u.position,
    };
    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val ?? '';
    });
    const pw = document.getElementById('fieldPasswordInput');
    if (pw) pw.value = '**********';
    setToggle('toggleUse', u.useYn);
    setToggle('toggleLock', u.lockYn);
  }

  function renderView() {
    document.title = `${user.displayName} | 사용자 상세 | POMS`;

    setText('summaryAvatar', user.avatar);
    setText('summaryName', user.displayName);
    setText('summaryId', user.id);
    setText('summaryOrg', user.org);
    setText('statUsage', user.usageLabel);
    setText('statLock', AdminUsersData.lockLabel(user.lockYn));
    setText('statLastLogin', user.lastLogin);
    setText('statJoinDate', user.joinDate);

    setText('fieldId', user.id);
    setText('fieldDisplayName', user.displayName);
    setText('fieldPasswordView', '**********');
    setText('fieldIp', user.userIp);
    setText('fieldOrg', user.org);
    setText('fieldDept', user.department);
    setText('fieldPosition', user.position);
    setText('fieldLastLogin', user.lastLogin);
    setText('fieldJoinDate', user.joinDate);
    setText('fieldLoginCount', `${user.loginCount.toLocaleString()}회`);

    const badgeEl = document.getElementById('fieldUsageBadge');
    if (badgeEl) badgeEl.innerHTML = usageBadgeHtml(user);

    setToggle('toggleUse', user.useYn);
    setToggle('toggleLock', user.lockYn);
    syncInputsFromUser(user);
  }

  function setEditing(editing) {
    isEditing = editing;
    page?.classList.toggle('is-editing', editing);

    const title = document.getElementById('pageTitle');
    const breadcrumb = document.getElementById('breadcrumbCurrent');
    if (title) title.textContent = editing ? '사용자 상세 (수정)' : '사용자 상세';
    if (breadcrumb) breadcrumb.textContent = editing ? '사용자 상세 (수정)' : '사용자 상세';
    document.title = editing
      ? `${user.displayName} | 사용자 상세 (수정) | POMS`
      : `${user.displayName} | 사용자 상세 | POMS`;

    document.getElementById('btnEdit')?.toggleAttribute('hidden', editing);
    document.getElementById('btnSave')?.toggleAttribute('hidden', !editing);
    document.getElementById('btnCancel')?.toggleAttribute('hidden', !editing);

    if (editing) {
      draft = { ...user };
      syncInputsFromUser(user);
    } else {
      draft = null;
      renderView();
    }
  }

  function collectDraft() {
    return {
      ...user,
      id: document.getElementById('fieldIdInput')?.value.trim() || user.id,
      displayName: document.getElementById('fieldDisplayNameInput')?.value.trim() || user.displayName,
      userIp: document.getElementById('fieldIpInput')?.value.trim() || user.userIp,
      org: document.getElementById('fieldOrgInput')?.value.trim() || user.org,
      department: document.getElementById('fieldDeptInput')?.value.trim() || user.department,
      position: document.getElementById('fieldPositionInput')?.value.trim() || user.position,
      useYn: getToggleValue('toggleUse'),
      lockYn: getToggleValue('toggleLock'),
    };
  }

  bindToggle('toggleUse');
  bindToggle('toggleLock');

  document.getElementById('btnPasswordReset')?.addEventListener('click', () => {
    if (!isEditing) return;
    if (confirm(`${user.displayName}(${user.id}) 비밀번호를 초기화하시겠습니까? (샘플)`)) {
      alert('비밀번호가 초기화되었습니다. (샘플)');
    }
  });

  document.getElementById('btnEdit')?.addEventListener('click', () => {
    setEditing(true);
  });

  document.getElementById('btnCancel')?.addEventListener('click', () => {
    if (draft) user = { ...draft };
    setEditing(false);
  });

  document.getElementById('btnSave')?.addEventListener('click', () => {
    user = collectDraft();
    user.avatar = user.displayName.charAt(0) || user.avatar;
    alert('저장되었습니다. (샘플)');
    setEditing(false);
  });

  document.getElementById('btnDelete')?.addEventListener('click', () => {
    if (confirm(`${user.displayName} 사용자를 삭제하시겠습니까? (샘플)`)) {
      window.location.href = 'admin-users.html';
    }
  });

  renderView();
  setEditing(false);
})();
