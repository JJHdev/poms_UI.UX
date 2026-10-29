/**
 * 사용자계정 관리 — 사용자 관리 플랫 레이아웃
 */
(() => {
  const columns = {
    privacy: [
      { label: '번호', className: 'col-no' },
      { label: '처리한 정보주체 정보', className: 'col-subject' },
      { label: '접속지 정보', className: 'col-ip' },
      { label: '아이디', className: 'col-id' },
      { label: '접속 일시', className: 'col-datetime' },
      { label: '수행업무', className: 'col-work' },
    ],
    history: [
      { label: '번호', className: 'col-no' },
      { label: '계정명', className: 'col-id' },
      { label: '접속자 IP', className: 'col-ip' },
      { label: '접속 메뉴', className: 'col-menu' },
      { label: '접속 일자', className: 'col-datetime' },
    ],
    access: [
      { label: '번호', className: 'col-no' },
      { label: '접속 일자', className: 'col-datetime' },
      { label: '접속자 수', className: 'col-count' },
    ],
  };

  const rows = {
    privacy: [
      ['1', 'jc010', '192.168.10.25', 'admin01', '2026-06-08 09:42:13', '계정목록조회'],
      ['2', 'kpha07', '192.168.10.31', 'admin01', '2026-06-08 09:38:04', '사용자계정수정'],
      ['3', 'new204', '192.168.10.25', 'admin01', '2026-06-08 09:17:55', '사용자계정생성'],
      ['4', 'lock05', '192.168.11.18', 'sysadmin', '2026-06-07 17:51:22', '계정비밀번호변경'],
      ['5', 'off06', '192.168.11.20', 'sysadmin', '2026-06-07 16:33:10', '계정로그인횟수초기화'],
      ['6', 'ven008', '192.168.10.44', 'admin01', '2026-06-07 15:11:47', '사용자구분정보조회'],
      ['7', 'audit23', '192.168.10.12', 'admin02', '2026-06-07 14:06:02', '계정ID중복조회'],
      ['8', 'temp19', '192.168.10.19', 'admin02', '2026-06-07 13:22:18', '사용자계정삭제'],
      ['9', 'user38', '192.168.10.38', 'admin01', '2026-06-06 11:42:01', '사용자계정수정'],
      ['10', 'user42', '192.168.10.42', 'admin01', '2026-06-06 10:25:33', '계정목록조회'],
      ['11', 'mgr11', '192.168.10.51', 'admin01', '2026-06-06 09:58:12', '사용자계정생성'],
      ['12', 'ops12', '192.168.11.22', 'sysadmin', '2026-06-05 18:21:44', '계정비밀번호변경'],
      ['13', 'qa013', '192.168.10.63', 'admin02', '2026-06-05 16:04:09', '계정목록조회'],
      ['14', 'dev14', '192.168.10.70', 'admin01', '2026-06-05 14:33:27', '사용자계정수정'],
      ['15', 'sec15', '192.168.11.30', 'sysadmin', '2026-06-05 11:12:55', '계정로그인횟수초기화'],
      ['16', 'log16', '192.168.10.81', 'admin02', '2026-06-04 17:48:03', '사용자계정삭제'],
      ['17', 'chk17', '192.168.10.88', 'admin01', '2026-06-04 15:09:41', '계정목록조회'],
      ['18', 'mon18', '192.168.11.41', 'sysadmin', '2026-06-04 10:27:18', '사용자계정생성'],
    ],
    history: [
      ['1', 'admin01', '192.168.10.25', '시스템관리 > 사용자관리', '2026-06-08 09:43:01'],
      ['2', 'admin01', '192.168.10.25', '시스템관리 > 사용자계정 관리', '2026-06-08 09:42:13'],
      ['3', 'sysadmin', '192.168.11.18', '게시판관리 > 공지사항', '2026-06-07 17:55:34'],
      ['4', 'admin02', '192.168.10.12', '연계데이터관리 > FMS 연계이력', '2026-06-07 14:16:40'],
      ['5', 'admin01', '192.168.10.25', '시스템관리 > 자료수신', '2026-06-07 10:34:29'],
      ['6', 'sysadmin', '192.168.11.18', '시스템관리 > 통계처리', '2026-06-06 18:04:11'],
      ['7', 'admin02', '192.168.10.12', '게시판관리 > 팝업관리', '2026-06-06 13:21:58'],
      ['8', 'admin01', '192.168.10.25', '시스템관리 > 자료처리', '2026-06-06 11:02:31'],
      ['9', 'admin01', '192.168.10.25', '시스템관리 > 사용자관리', '2026-06-05 16:44:12'],
      ['10', 'admin02', '192.168.10.12', '게시판관리 > FAQ', '2026-06-05 14:18:07'],
      ['11', 'sysadmin', '192.168.11.18', '연계데이터관리 > 자료수신', '2026-06-05 11:03:55'],
      ['12', 'admin01', '192.168.10.25', '시스템관리 > 통계처리', '2026-06-04 17:29:40'],
      ['13', 'admin02', '192.168.10.12', '시스템관리 > 사용자계정 관리', '2026-06-04 15:51:22'],
      ['14', 'sysadmin', '192.168.11.18', '게시판관리 > 공지사항', '2026-06-04 13:07:14'],
      ['15', 'admin01', '192.168.10.25', '시스템관리 > 자료수신', '2026-06-03 10:36:48'],
      ['16', 'admin02', '192.168.10.12', '연계데이터관리 > FMS 연계이력', '2026-06-03 09:14:05'],
    ],
    access: [
      ['1', '2026-06', '4,238명'],
      ['2', '2026-05', '3,770명'],
      ['3', '2026-04', '3,487명'],
      ['4', '2026-03', '3,581명'],
      ['5', '2026-02', '3,389명'],
      ['6', '2026-01', '3,534명'],
      ['7', '2025-12', '3,612명'],
      ['8', '2025-11', '3,498명'],
      ['9', '2025-10', '3,721명'],
      ['10', '2025-09', '3,455명'],
      ['11', '2025-08', '3,390명'],
      ['12', '2025-07', '3,508명'],
      ['13', '2025-06', '3,644명'],
      ['14', '2025-05', '3,412명'],
      ['15', '2025-04', '3,377명'],
      ['16', '2025-03', '3,291명'],
    ],
  };

  const state = {
    tab: 'privacy',
    page: 1,
    pageSize: 15,
    filtered: [...rows.privacy],
  };

  const tableHead = document.getElementById('accountTableHead');
  const tableBody = document.getElementById('accountTableBody');
  const resultCount = document.getElementById('accountResultCount');

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function getFilterKeyword() {
    const panel = document.querySelector(`[data-filter-panel="${state.tab}"]`);
    return Array.from(panel?.querySelectorAll('input[type="text"], select') || [])
      .map((el) => (el.value || '').trim())
      .filter(Boolean);
  }

  function applyFilter() {
    const filters = getFilterKeyword();
    const source = rows[state.tab];
    state.filtered = filters.length
      ? source.filter((row) => filters.every((filter) => row.join(' ').includes(filter)))
      : [...source];
    state.page = 1;
    render();
  }

  function renderHead() {
    const table = tableHead?.closest('table');
    if (table) {
      table.classList.toggle('ua-account-table--access', state.tab === 'access');
      table.classList.toggle('ua-account-table--history', state.tab === 'history');
      table.classList.toggle('ua-account-table--privacy', state.tab === 'privacy');
    }

    tableHead.innerHTML = `<tr>${columns[state.tab]
      .map((column) => `<th scope="col" class="${column.className}">${column.label}</th>`)
      .join('')}</tr>`;
  }

  function renderRows() {
    const start = (state.page - 1) * state.pageSize;
    const pageRows = state.filtered.slice(start, start + state.pageSize);
    const cols = columns[state.tab];

    tableBody.innerHTML = pageRows
      .map((row, idx) => {
        const cells = row.map((cell, index) => {
          const className = cols[index]?.className || '';
          const display = index === 0 ? String(start + idx + 1) : escapeHtml(cell);
          return `<td class="${className}">${display}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    if (resultCount) resultCount.textContent = String(state.filtered.length);
  }

  function renderPagination() {
    PomsPaging.mount({
      paginationId: 'accountPagination',
      totalRows: state.filtered.length,
      state,
      onChange: () => {
        render();
      },
    });
  }

  function render() {
    const total = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
    if (state.page > total) state.page = total;
    renderHead();
    renderRows();
    renderPagination();
  }

  document.querySelectorAll('.ua-account-tabs__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (!tab || tab === state.tab) return;

      state.tab = tab;
      state.page = 1;
      state.filtered = [...rows[tab]];

      document.querySelectorAll('.ua-account-tabs__btn').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      document.querySelectorAll('[data-filter-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.filterPanel !== tab;
      });

      render();
    });
  });

  document.querySelectorAll('[data-filter-panel]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilter();
    });
  });

  document.querySelectorAll('[data-search]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      applyFilter();
    });
  });

  document.querySelectorAll('[data-reset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = document.querySelector(`[data-filter-panel="${state.tab}"]`);
      panel?.querySelectorAll('input[type="text"]').forEach((el) => {
        el.value = '';
      });
      panel?.querySelectorAll('select').forEach((el) => {
        el.selectedIndex = el.id === 'accessPeriod' ? 1 : 0;
      });
      applyFilter();
    });
  });

  document.getElementById('btnAccountExcel')?.addEventListener('click', () => {
    alert('엑셀 다운로드는 연동 후 제공됩니다.');
  });

  render();
})();
