/**
 * 관리자 사용자 관리 (Figma 196:2890 / 팝업 196:3342)
 */
(() => {
  const USERS = AdminUsersData.getAll();

  let filtered = [...USERS];
  const pagingState = {
    page: 1,
    pageSize: 15,
  };
  let drawerMode = 'edit';
  let currentUser = USERS[0];

  const tbody = document.getElementById('uaTableBody');
  const nameFilter = document.getElementById('uaUserName');
  const useYnFilter = document.getElementById('uaUseYn');
  const usageFilter = document.getElementById('uaUseGbn');
  const lockFilter = document.getElementById('uaLockYn');
  const searchForm = document.getElementById('uaSearchForm');
  const resetBtn = document.getElementById('uaResetBtn');
  const drawer = document.getElementById('userDrawer');
  const overlay = document.getElementById('userDrawerOverlay');

  const drawerFields = {
    name: document.getElementById('drawerUserName'),
    id: document.getElementById('drawerUserId'),
    password: document.getElementById('drawerUserPassword'),
    org: document.getElementById('drawerUserOrg'),
    userIp: document.getElementById('drawerUserIp'),
    phone1: document.getElementById('drawerUserPhone1'),
    phone2: document.getElementById('drawerUserPhone2'),
    phone3: document.getElementById('drawerUserPhone3'),
    usage: document.getElementById('drawerUserUsage'),
    useYn: document.getElementById('drawerUserUseYn'),
  };

  function getPageData() {
    const start = (pagingState.page - 1) * pagingState.pageSize;
    return filtered.slice(start, start + pagingState.pageSize);
  }

  function totalPages() {
    return Math.max(1, Math.ceil(filtered.length / pagingState.pageSize));
  }

  function splitPhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.length >= 10) {
      return [digits.slice(0, 3), digits.slice(3, digits.length - 4), digits.slice(-4)];
    }
    const parts = String(phone || '').split('-').map((part) => part.trim());
    return [parts[0] || '', parts[1] || '', parts[2] || ''];
  }

  function joinPhone() {
    const parts = [
      drawerFields.phone1?.value.trim() || '',
      drawerFields.phone2?.value.trim() || '',
      drawerFields.phone3?.value.trim() || '',
    ].filter(Boolean);
    return parts.join('-');
  }

  function ensureOrgOption(org) {
    if (!drawerFields.org || !org) return;
    const exists = Array.from(drawerFields.org.options).some((opt) => opt.value === org);
    if (!exists) {
      const option = document.createElement('option');
      option.value = org;
      option.textContent = org;
      drawerFields.org.appendChild(option);
    }
  }

  function ensureIpOption(ip) {
    if (!drawerFields.userIp || !ip) return;
    const exists = Array.from(drawerFields.userIp.options).some((opt) => opt.value === ip);
    if (!exists) {
      const option = document.createElement('option');
      option.value = ip;
      option.textContent = ip;
      drawerFields.userIp.appendChild(option);
    }
  }

  function populateOrgOptions() {
    if (!drawerFields.org) return;
    const orgs = [...new Set(USERS.map((user) => user.org).filter(Boolean))].sort();
    drawerFields.org.innerHTML = '<option value="">전체</option>';
    orgs.forEach((org) => {
      const option = document.createElement('option');
      option.value = org;
      option.textContent = org;
      drawerFields.org.appendChild(option);
    });
  }

  function populateIpOptions() {
    if (!drawerFields.userIp) return;
    const ips = [...new Set(USERS.map((user) => user.userIp).filter(Boolean))].sort();
    drawerFields.userIp.innerHTML = '<option value="">전체</option>';
    ips.forEach((ip) => {
      const option = document.createElement('option');
      option.value = ip;
      option.textContent = ip;
      drawerFields.userIp.appendChild(option);
    });
  }

  function fillDrawer(user) {
    const detail = user?.id ? AdminUsersData.getById(user.id) : user;
    const [p1, p2, p3] = splitPhone(detail?.phone || '');

    drawerFields.name.value = detail?.name || '';
    drawerFields.id.value = detail?.id || '';
    drawerFields.password.value = '';
    ensureOrgOption(detail?.org || '');
    drawerFields.org.value = detail?.org || '';
    ensureIpOption(detail?.userIp || '');
    drawerFields.userIp.value = detail?.userIp || '';
    if (drawerFields.phone1) drawerFields.phone1.value = p1;
    if (drawerFields.phone2) drawerFields.phone2.value = p2;
    if (drawerFields.phone3) drawerFields.phone3.value = p3;
    drawerFields.usage.value = detail?.usage || '';
    drawerFields.useYn.value = detail?.useYn || '';
  }

  function openDrawer(user, mode = 'edit') {
    drawerMode = mode;
    currentUser = user || null;
    fillDrawer(user);
    document.getElementById('userDrawerTitle').textContent = mode === 'insert' ? '사용자 등록' : '사용자 상세/수정';
    document.getElementById('userDrawerMessage').textContent = mode === 'insert'
      ? '※ 사용자ID 중복확인 후 저장합니다.'
      : '※ 사용자 정보 확인 후 저장하거나 삭제처리합니다.';
    document.getElementById('userDrawerDelete').hidden = mode === 'insert';
    document.getElementById('userIdCheck').hidden = mode !== 'insert';
    document.getElementById('userPasswordReset').hidden = mode === 'insert';
    drawerFields.id.disabled = mode !== 'insert';
    drawer?.classList.add('is-open');
    overlay?.classList.add('is-open');
    drawer?.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    drawer?.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    drawer?.setAttribute('aria-hidden', 'true');
  }

  function bindRowDrawer() {
    tbody?.querySelectorAll('tr[data-user-id]').forEach((row) => {
      const open = () => {
        const user = USERS.find((item) => item.id === row.dataset.userId);
        if (!user) return;
        tbody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('is-selected'));
        row.classList.add('is-selected');
        openDrawer(user, 'edit');
      };
      row.addEventListener('click', open);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });
  }

  function renderTable() {
    if (!tbody) return;
    const pageData = getPageData();
    const startNo = (pagingState.page - 1) * pagingState.pageSize;
    const resultCountEl = document.getElementById('uaResultCount');
    if (resultCountEl) resultCountEl.textContent = String(filtered.length);

    tbody.innerHTML = pageData
      .map((u, idx) => {
        const no = startNo + idx + 1;
        return `
        <tr data-user-id="${u.id}" class="is-clickable" tabindex="0" role="button" aria-label="${u.name} 상세 보기">
          <td class="col-no">${no}</td>
          <td class="col-name">${u.name}</td>
          <td class="col-id">${u.id}</td>
          <td class="col-org">${u.org}</td>
          <td class="col-phone">${u.phone}</td>
          <td class="col-usage">${u.usageLabel}</td>
          <td class="col-login">${u.lastLogin}</td>
          <td class="col-yn">${u.useYn}</td>
          <td class="col-yn">${u.lockYn}</td>
        </tr>`;
      })
      .join('');

    bindRowDrawer();
  }

  function renderPagination() {
    PomsPaging.mount({
      paginationId: 'uaPagination',
      totalRows: filtered.length,
      state: pagingState,
      onChange: () => {
        render();
      },
    });
  }

  function applyFilter() {
    const name = nameFilter?.value || '';
    const useYn = useYnFilter?.value || '';
    const usage = usageFilter?.value || '';
    const lockYn = lockFilter?.value || '';
    filtered = USERS.filter((u) => {
      const nameMatched = !name || u.name === name;
      const useYnMatched = !useYn || u.useYn === useYn;
      const usageMatched = !usage || u.usage === usage;
      const lockMatched = !lockYn || u.lockYn === lockYn;
      return nameMatched && useYnMatched && usageMatched && lockMatched;
    });
    pagingState.page = 1;
    render();
  }

  function render() {
    if (pagingState.page > totalPages()) pagingState.page = totalPages();
    renderTable();
    renderPagination();
  }

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilter();
  });

  resetBtn?.addEventListener('click', () => {
    if (nameFilter) nameFilter.value = '';
    if (useYnFilter) useYnFilter.value = '';
    if (usageFilter) usageFilter.value = '';
    if (lockFilter) lockFilter.value = '';
    applyFilter();
  });

  document.getElementById('uaRegisterBtn')?.addEventListener('click', () => {
    openDrawer({
      name: '',
      displayName: '',
      id: '',
      org: '',
      userIp: '',
      phone: '',
      usage: '',
      usageLabel: '',
      useYn: 'Y',
      lockYn: 'N',
      lastLogin: '',
    }, 'insert');
  });

  document.getElementById('userDrawerClose')?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  document.getElementById('userDrawerSave')?.addEventListener('click', () => {
    const phone = joinPhone();
    const target = drawerMode === 'insert'
      ? {
          name: drawerFields.name.value || '신규사용자',
          displayName: drawerFields.name.value || '신규사용자',
          id: drawerFields.id.value || `user${USERS.length + 1}`,
          joinDate: '2026-06-10',
          loginCount: 0,
          avatar: (drawerFields.name.value || '신').charAt(0),
          lockYn: 'N',
        }
      : currentUser;
    if (!target) return;

    target.name = drawerFields.name.value || target.name || '사용자';
    target.displayName = target.name;
    target.id = drawerFields.id.value || target.id;
    target.org = drawerFields.org.value || '-';
    target.userIp = drawerFields.userIp.value || '-';
    target.phone = phone || '-';
    target.usage = drawerFields.usage.value || target.usage || '9';
    target.usageLabel = AdminUsersData.usageLabel(target.usage) || target.usageLabel || '';
    target.useYn = drawerFields.useYn.value || 'Y';
    target.lockYn = target.lockYn || 'N';
    target.lastLogin = target.lastLogin || '-';

    if (drawerMode === 'insert') {
      USERS.unshift(target);
      populateOrgOptions();
      populateIpOptions();
    }
    pagingState.page = 1;
    applyFilter();
    openDrawer(target, 'edit');
    document.getElementById('userDrawerMessage').textContent = '※ 저장되었습니다.';
  });

  document.getElementById('userDrawerDelete')?.addEventListener('click', () => {
    if (!currentUser) return;
    currentUser.useYn = 'N';
    applyFilter();
    openDrawer(currentUser, 'edit');
    document.getElementById('userDrawerMessage').textContent = '※ 사용여부를 N으로 변경했습니다.';
  });

  document.getElementById('userIdCheck')?.addEventListener('click', () => {
    const exists = USERS.some((user) => user.id === drawerFields.id.value);
    document.getElementById('userDrawerMessage').textContent = exists
      ? '※ 이미 존재하는 ID입니다.'
      : '※ 사용 가능한 ID입니다.';
  });

  document.getElementById('userPasswordReset')?.addEventListener('click', () => {
    document.getElementById('userDrawerMessage').textContent = drawerFields.password.value
      ? '※ 사용자 암호가 수정되었습니다.'
      : '※ 새 비밀번호를 입력한 뒤 암호 재설정을 실행합니다.';
  });

  populateOrgOptions();
  populateIpOptions();
  render();
})();
