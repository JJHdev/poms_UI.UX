(() => {
  const DATA = {
    law: (() => {
      const base = [
        ['항만법 시행령 고시문.pdf', '항만법 시행령 일부개정령(2024.05.10) 관련 고시문입니다.', '김관리', '2024-05-10', '1.28 MB'],
        ['항만시설 유지관리 지침_v2.0.pdf', '항만시설 유지관리 업무 수행 지침 개정(2024.04.01) 내용입니다.', '이담당', '2024-04-01', '2.45 MB'],
        ['시설물 안전점검 요령.pdf', '항만시설물 정기점검 및 안전점검 요령 절차 안내입니다.', '박주임', '2024-03-25', '856 KB'],
        ['콘크리트 구조물 유지관리 기준.hwp', '콘크리트 구조물의 유지관리 기준(2023년 개정) 문서입니다.', '최기술', '2024-03-12', '3.12 MB'],
        ['항만시설 설계기준(2023).pdf', '항만시설 설계기준(KDS 64 10 00:2023) 최신본입니다.', '김관리', '2024-02-20', '5.67 MB'],
        ['해양환경 보호지침.pdf', '항만 공사 시 해양환경 보호를 위한 지침 자료입니다.', '이담당', '2024-02-15', '1.05 MB'],
        ['시설물 점검 체크리스트.xlsx', '항만시설물 점검 항목별 체크리스트 양식입니다.', '박주임', '2024-01-30', '452 KB'],
        ['기술용역 과업지침(안).pdf', '항만시설 기술용역 과업지침(안) 자료입니다.', '최기술', '2024-01-18', '2.33 MB'],
        ['항만시설 안전관리 규정.pdf', '항만시설 안전관리 규정(시행일: 2024.01.01) 내용입니다.', '김관리', '2024-01-05', '1.91 MB'],
        ['기타 시설물 관리 사례집.pdf', '항만시설물 유지관리 우수사례 모음집입니다.', '이담당', '2023-12-28', '4.03 MB'],
      ];
      const rows = [];
      for (let i = 0; i < 91; i += 1) {
        rows.push(base[i % base.length]);
      }
      return rows;
    })(),
    forms: [
      ['시설물 등록 신청서.hwp', '신규 항만시설물 등록 신청 시 사용하는 표준 서식입니다.', '김관리', '2024-05-03', '128 KB'],
      ['점검결과 보고서 양식.xlsx', '정기점검 결과를 제출하기 위한 엑셀 보고 양식입니다.', '박주임', '2024-04-18', '342 KB'],
      ['보수보강 실적 제출서.docx', '보수보강 실적 등록 및 제출에 사용하는 문서 서식입니다.', '최기술', '2024-04-02', '96 KB'],
      ['안전점검 사진대장.xlsx', '현장 사진 정리 및 제출용 사진대장 양식입니다.', '이담당', '2024-03-22', '512 KB'],
      ['유지관리계획 제출서.hwp', '연간 유지관리계획 제출을 위한 기본 서식입니다.', '김관리', '2024-03-08', '141 KB'],
      ['시설물 변경신청서.hwp', '시설물 제원 변경 및 관리정보 변경 신청서입니다.', '박주임', '2024-02-21', '118 KB'],
      ['점검자 명단 양식.xlsx', '점검 참여기술자 명단 작성용 양식입니다.', '최기술', '2024-02-05', '224 KB'],
      ['자료 제출 확인서.docx', '기관 자료 제출 확인에 사용하는 확인서 양식입니다.', '이담당', '2024-01-19', '84 KB'],
      ['업무협의 기록지.hwp', '유지관리 업무협의 내용 기록 서식입니다.', '김관리', '2024-01-08', '76 KB'],
      ['첨부파일 목록표.xlsx', '제출 첨부파일 목록을 정리하는 표준 양식입니다.', '박주임', '2023-12-26', '166 KB'],
    ],
    software: [
      ['POMS 점검자료 변환도구.zip', '점검자료 엑셀 파일을 시스템 업로드 형식으로 변환하는 도구입니다.', '시스템', '2024-05-07', '18.2 MB'],
      ['도면 이미지 뷰어 설치파일.exe', '계획평면도 및 이미지 자료 확인용 뷰어 설치파일입니다.', '시스템', '2024-04-16', '42.1 MB'],
      ['모바일 점검앱 매뉴얼 패키지.zip', '모바일 점검앱 설치파일과 사용자 매뉴얼 묶음입니다.', '김관리', '2024-03-29', '24.8 MB'],
      ['좌표 변환 유틸리티.zip', '항만시설 위치 좌표 변환 보조 유틸리티입니다.', '최기술', '2024-03-11', '6.4 MB'],
      ['보고서 PDF 병합도구.zip', '여러 보고서 PDF를 하나로 병합하는 간단 도구입니다.', '시스템', '2024-02-27', '9.7 MB'],
      ['파일명 일괄정리 프로그램.zip', '제출자료 파일명을 표준 규칙으로 정리하는 프로그램입니다.', '이담당', '2024-02-08', '4.9 MB'],
      ['POMS 인증서 점검도구.exe', '로그인 인증서 상태를 확인하는 점검 도구입니다.', '시스템', '2024-01-25', '12.5 MB'],
      ['사진 압축 프로그램.zip', '현장 사진 용량을 일괄 압축하는 프로그램입니다.', '박주임', '2024-01-12', '7.2 MB'],
      ['브라우저 설정 가이드.zip', 'POMS 사용을 위한 브라우저 설정 파일 모음입니다.', '김관리', '2024-01-04', '3.8 MB'],
      ['데이터 검증 스크립트.zip', '업로드 전 기초 데이터 오류를 점검하는 스크립트입니다.', '최기술', '2023-12-19', '2.6 MB'],
    ],
    etc: [
      ['항만시설물 교육자료.pdf', '항만시설물 유지관리 교육에 사용하는 공통 교육자료입니다.', '김관리', '2024-05-02', '8.12 MB'],
      ['FAQ 모음.pdf', 'POMS 사용 중 자주 묻는 질문과 답변 자료입니다.', '이담당', '2024-04-20', '1.34 MB'],
      ['업무 연락처 목록.xlsx', '기관별 유지관리 업무 담당자 연락처 목록입니다.', '박주임', '2024-04-05', '248 KB'],
      ['시스템 사용자 안내문.pdf', '신규 사용자 대상 시스템 이용 안내문입니다.', '시스템', '2024-03-19', '932 KB'],
      ['정기교육 일정표.xlsx', '2024년도 정기교육 일정표입니다.', '김관리', '2024-03-01', '154 KB'],
      ['현장점검 우수사례.pdf', '현장점검 및 유지관리 우수사례 참고자료입니다.', '최기술', '2024-02-16', '6.41 MB'],
      ['자료 제출 유의사항.pdf', '자료 제출 시 유의해야 할 항목을 정리한 안내자료입니다.', '이담당', '2024-02-02', '724 KB'],
      ['기관별 업무분장표.xlsx', '기관별 자료 등록 및 검토 업무분장표입니다.', '박주임', '2024-01-23', '311 KB'],
      ['용어 해설집.pdf', '항만시설물 관리 관련 주요 용어 해설집입니다.', '김관리', '2024-01-09', '2.08 MB'],
      ['회의자료.zip', '자료실 운영 개선 회의 참고자료입니다.', '시스템', '2023-12-22', '5.63 MB'],
    ],
  };

  const TAB_LABELS = {
    law: '법/지침/규정',
    forms: '각종서식',
    software: '매뉴얼 등',
    etc: '기타',
  };

  /** 제목에서 확장자(. 이하)를 숨길 탭 */
  const TITLE_STRIP_EXT_TABS = new Set(['law', 'forms', 'software']);

  function stripFileExtension(fileName) {
    const name = String(fileName || '').trim();
    if (!name || name === '-') return name;
    return name.replace(/\.[^./\\]+$/, '');
  }

  function displayTitle(fileName, tab = state.tab) {
    if (TITLE_STRIP_EXT_TABS.has(tab)) return stripFileExtension(fileName);
    return String(fileName || '');
  }

  const BOARD_COLUMNS = [
    { key: 'title', label: '제목', className: 'col-title' },
    { key: 'desc', label: '내용', className: 'col-desc' },
    { key: 'writer', label: '등록자', className: 'col-writer' },
    { key: 'date', label: '등록일', className: 'col-date' },
    { key: 'file', label: '첨부파일', className: 'col-file' },
    { key: 'size', label: '파일크기', className: 'col-size' },
  ];

  const MODE_TITLE = {
    view: '자료 상세',
    edit: '자료 수정',
    create: '자료 등록',
  };

  const $ = (selector, root = document) => root.querySelector(selector);

  const state = {
    tab: 'law',
    filtered: [],
    page: 1,
    pageSize: 10,
  };

  let editingRow = null;
  let modalMode = 'view';

  function rowsForTab(tab) {
    return DATA[tab].map((row, index) => ({
      id: `${tab}-${index + 1}`,
      fileName: row[0],
      desc: row[1],
      writer: row[2],
      date: row[3],
      size: row[4],
      _index: index,
    }));
  }

  /* ══════════════════════════
     모달 (상세 / 수정 / 등록)
     ══════════════════════════ */
  function setModalMode(mode) {
    modalMode = mode;
    const panel = $('#archiveModalPanel');
    const title = $('#archiveModalTitle');
    const editBtn = $('#archiveModalEditBtn');
    const saveBtn = $('#archiveModalSaveBtn');
    const descInput = $('#modalDesc');
    const descView = $('#modalDescView');
    const fileEditWrap = $('#modalFileEditWrap');
    const fileView = $('#modalFileView');
    const metaFields = $('#modalMetaFields');

    if (panel) panel.dataset.mode = mode;
    if (title) title.textContent = MODE_TITLE[mode] || MODE_TITLE.view;

    const isView = mode === 'view';
    if (editBtn) editBtn.hidden = !isView;
    if (saveBtn) saveBtn.hidden = isView;

    if (descInput) descInput.hidden = isView;
    if (fileEditWrap) fileEditWrap.hidden = isView;
    if (descView) descView.hidden = !isView;
    if (fileView) fileView.hidden = !isView;
    if (metaFields) metaFields.hidden = !isView;
  }

  function fillModalFields(row) {
    const descVal = row?.desc || '';
    const fileName = row?.fileName || '';

    $('#modalDesc').value = descVal;
    $('#modalFile').value = '';

    const descView = $('#modalDescView');
    const fileViewName = $('#modalFileViewName');
    const fileNameEl = $('#modalFileNameText');
    const subCategory = $('#modalSubCategory');
    const subDivider = $('#modalSubDivider');
    const subDate = $('#modalSubDate');
    const writerView = $('#modalWriterView');
    const dateView = $('#modalDateView');
    const sizeView = $('#modalSizeView');

    const tabLabel = document.querySelector(`[data-board-tab="${state.tab}"].is-active`)?.textContent?.trim()
      || '';
    const sizeVal = row?.size || '';

    if (descView) descView.textContent = descVal || '-';
    if (fileViewName) {
      fileViewName.textContent = fileName
        ? (sizeVal ? `${fileName} (${sizeVal})` : fileName)
        : '-';
    }
    if (writerView) writerView.textContent = row?.writer || '-';
    if (dateView) dateView.textContent = row?.date || '-';
    if (sizeView) sizeView.textContent = sizeVal || '-';

    if (subCategory) subCategory.textContent = tabLabel;
    if (subDate) {
      subDate.textContent = row?.date ? `등록일 ${row.date}` : '';
    }
    if (subDivider) subDivider.hidden = !(tabLabel && row?.date);

    const fileViewBtn = $('#modalFileView');
    if (fileViewBtn) {
      fileViewBtn.setAttribute('aria-label', fileName ? `${fileName} 다운로드` : '첨부파일 없음');
      fileViewBtn.disabled = !fileName || fileName === '-';
    }

    if (fileNameEl) {
      fileNameEl.textContent = fileName || '파일을 선택해주세요.';
      fileNameEl.style.color = fileName ? '#0f1f38' : '#6b7280';
    }
  }

  function openDetail(row) {
    if (!row) return;
    window.location.href = `archive-board-detail.html?id=${encodeURIComponent(row.id)}`;
  }

  function openCreate() {
    editingRow = null;
    fillModalFields(null);
    setModalMode('create');
    const modal = $('#archiveModal');
    if (modal) modal.hidden = false;
  }

  function openEdit() {
    if (!editingRow) return;
    fillModalFields(editingRow);
    setModalMode('edit');
  }

  function closeModal() {
    const modal = $('#archiveModal');
    if (modal) modal.hidden = true;
    editingRow = null;
    modalMode = 'view';
  }

  function handleCancel() {
    if (modalMode === 'edit' && editingRow) {
      fillModalFields(editingRow);
      setModalMode('view');
      return;
    }
    closeModal();
  }

  function saveModal() {
    const desc = $('#modalDesc').value.trim();
    const fileInput = $('#modalFile');
    const file = fileInput?.files[0];
    const fileName = file?.name || editingRow?.fileName || '';
    const size = file
      ? `${(file.size / 1024).toFixed(0)} KB`
      : (editingRow?.size || '-');

    if (!desc) { alert('내용을 입력하세요.'); return; }

    const today = new Date().toISOString().slice(0, 10);
    const writer = editingRow?.writer || '사용자';

    if (editingRow) {
      const arr = DATA[state.tab];
      const idx = arr.findIndex((r) => r[0] === editingRow.fileName && r[1] === editingRow.desc);
      if (idx !== -1) {
        arr[idx] = [fileName || arr[idx][0], desc, writer || arr[idx][2], today, size || arr[idx][4]];
        editingRow = {
          ...editingRow,
          fileName: arr[idx][0],
          desc: arr[idx][1],
          writer: arr[idx][2],
          date: arr[idx][3],
          size: arr[idx][4],
        };
      }
      fillModalFields(editingRow);
      setModalMode('view');
      applyFilters();
      return;
    }

    DATA[state.tab].unshift([fileName || '첨부파일.pdf', desc, writer, today, size || '-']);
    closeModal();
    applyFilters();
  }

  function getRowById(id) {
    if (!id) return null;
    for (const tab of Object.keys(DATA)) {
      const rows = rowsForTab(tab);
      const found = rows.find((row) => row.id === id);
      if (found) return { ...found, tab };
    }
    return null;
  }

  function downloadAttachment(fileName) {
    const name = String(fileName || '').trim();
    if (!name || name === '-') {
      alert('다운로드할 첨부파일이 없습니다.');
      return;
    }
    alert('첨부파일 다운로드 기능은 샘플입니다.');
  }

  /* ══════════════════════════
     테이블
     ══════════════════════════ */
  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function attachIconHtml() {
    return `<img src="assets/main/safety-report/icon-download.svg" alt="" width="16" height="16">`;
  }

  function setupTableHead() {
    const thead = $('#archiveBoardTableBody')?.closest('table')?.querySelector('thead');
    if (!thead) return;
    thead.innerHTML = `<tr>
      <th scope="col" class="col-no">번호</th>
      ${BOARD_COLUMNS.map((column) => `<th scope="col" class="${column.className}">${column.label}</th>`).join('')}
    </tr>`;
  }

  function renderTable() {
    const tbody = $('#archiveBoardTableBody');
    const total = $('#archiveBoardTotal');
    if (!tbody) return;
    if (total) total.textContent = String(state.filtered.length);

    if (!state.filtered.length) {
      tbody.innerHTML = '<tr><td colspan="7">조회된 자료가 없습니다.</td></tr>';
      PomsUserTable.mountFoot({
        paginationId: 'archiveBoardPagination',
        state,
        totalRows: 0,
        onChange: renderTable,
      });
      return;
    }

    const rows = PomsUserTable.slicePage(state.filtered, state.page, state.pageSize);
    const start = (state.page - 1) * state.pageSize;
    tbody.innerHTML = rows.map((row, index) => `
      <tr data-row-id="${row.id}" class="is-clickable">
        <td class="col-no">${start + index + 1}</td>
        <td class="col-title" title="${escapeHtml(displayTitle(row.fileName))}">${escapeHtml(displayTitle(row.fileName))}</td>
        <td class="col-desc">${escapeHtml(row.desc)}</td>
        <td class="col-writer">${escapeHtml(row.writer)}</td>
        <td class="col-date">${escapeHtml(row.date)}</td>
        <td class="col-file">
          <button
            type="button"
            class="archive-file-attach"
            data-file-name="${escapeHtml(row.fileName)}"
            aria-label="${escapeHtml(row.fileName)} 다운로드"
          >${attachIconHtml()}</button>
        </td>
        <td class="col-size">${escapeHtml(row.size)}</td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.archive-file-attach').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadAttachment(button.dataset.fileName);
      });
    });

    tbody.querySelectorAll('tr[data-row-id]').forEach((tr) => {
      tr.addEventListener('click', () => {
        const row = state.filtered.find((r) => r.id === tr.dataset.rowId);
        if (row) openDetail(row);
      });
    });

    PomsUserTable.mountFoot({
      paginationId: 'archiveBoardPagination',
      state,
      totalRows: state.filtered.length,
      onChange: renderTable,
    });
  }

  function applyFilters() {
    const content = ($('#archiveBoardContent')?.value || '').trim().toLowerCase();
    const rows = rowsForTab(state.tab).filter((row) => {
      if (content && !row.desc.toLowerCase().includes(content)) return false;
      return true;
    });
    state.filtered = rows;
    state.page = 1;
    setupTableHead();
    renderTable();
  }

  function setTab(tab) {
    if (tab === 'plan') {
      window.location.href = 'basic-plan-floor.html';
      return;
    }
    if (tab === 'materials') {
      window.location.href = 'archive-safety-materials.html';
      return;
    }
    state.tab = tab;
    document.querySelectorAll('[data-board-tab]').forEach((button) => {
      const active = button.dataset.boardTab === tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    applyFilters();
  }

  function bindEvents() {
    $('#archiveBoardSearchForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      applyFilters();
    });

    document.querySelectorAll('[data-board-tab]').forEach((button) => {
      button.addEventListener('click', () => setTab(button.dataset.boardTab));
    });

    $('#archiveModalCloseBtn')?.addEventListener('click', closeModal);
    $('#archiveModalBackdrop')?.addEventListener('click', closeModal);
    $('#archiveModalCancelBtn')?.addEventListener('click', handleCancel);
    $('#archiveModalEditBtn')?.addEventListener('click', openEdit);
    $('#archiveModalSaveBtn')?.addEventListener('click', saveModal);

    $('#modalFileBrowseBtn')?.addEventListener('click', () => {
      $('#modalFile')?.click();
    });

    $('#modalFileView')?.addEventListener('click', () => {
      const name = $('#modalFileViewName')?.textContent?.trim()
        || editingRow?.fileName
        || '';
      downloadAttachment(name);
    });

    $('#modalFile')?.addEventListener('change', (e) => {
      const name = e.target.files[0]?.name;
      const el = $('#modalFileNameText');
      if (el) {
        el.textContent = name || editingRow?.fileName || '파일을 선택해주세요.';
        el.style.color = (name || editingRow?.fileName) ? '#0f1f38' : '#6b7280';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !$('#archiveModal')?.hidden) closeModal();
    });
  }

  function initBoardDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const row = getRowById(id);

    if (!row) {
      alert('자료를 찾을 수 없습니다.');
      window.location.href = 'archive-board.html';
      return;
    }

    const listUrl = `archive-board.html?tab=${encodeURIComponent(row.tab)}`;
    const titleText = displayTitle(row.fileName, row.tab);
    const categoryLabel = TAB_LABELS[row.tab] || row.tab || '게시판';

    document.title = `${titleText} | 게시판 상세 | POMS`;

    const setValue = (elId, value) => {
      const el = document.getElementById(elId);
      if (el) el.value = value ?? '';
    };

    const sectionTitle = document.getElementById('boardDetailSectionTitle');
    if (sectionTitle) sectionTitle.textContent = `${categoryLabel} 상세`;

    const crumb = document.getElementById('boardDetailCrumb');
    if (crumb) crumb.textContent = titleText;

    const listLink = document.getElementById('boardDetailListLink');
    if (listLink) {
      listLink.href = listUrl;
      listLink.textContent = '게시판';
    }

    const backBtn = document.getElementById('boardDetailBackBtn');
    if (backBtn) backBtn.setAttribute('href', listUrl);

    setValue('boardDetailCategory', categoryLabel);
    setValue('boardDetailTitle', titleText);
    setValue('boardDetailWriter', row.writer);
    setValue('boardDetailDate', row.date);
    setValue('boardDetailSize', row.size);

    const descEl = document.getElementById('boardDetailDesc');
    if (descEl) descEl.textContent = row.desc || '-';

    const fileBtn = document.getElementById('boardDetailFile');
    if (fileBtn) {
      if (row.fileName) {
        fileBtn.textContent = row.size ? `${row.fileName} (${row.size})` : row.fileName;
        fileBtn.classList.remove('is-empty');
        fileBtn.addEventListener('click', (e) => {
          e.preventDefault();
          downloadAttachment(row.fileName);
        });
      } else {
        fileBtn.textContent = '첨부된 파일 없음';
        fileBtn.classList.add('is-empty');
      }
    }

    document.getElementById('boardDetailBackBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = listUrl;
    });

    PomsSidebar.mount('#sidebar-root', { active: 'archive-law' });
  }

  function initListPage() {
    PomsSidebar.mount('#sidebar-root', { active: 'archive-law' });
    bindEvents();

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'plan') {
      window.location.replace('basic-plan-floor.html');
      return;
    }
    if (tabParam === 'materials') {
      window.location.replace('archive-safety-materials.html');
      return;
    }
    if (tabParam && TAB_LABELS[tabParam]) {
      setTab(tabParam);
    } else {
      applyFilters();
    }

    const openTarget = params.get('open');
    if (openTarget) {
      for (const tab of Object.keys(DATA)) {
        const idx = DATA[tab].findIndex((r) => r[0] === openTarget);
        if (idx !== -1) {
          setTab(tab);
          const row = rowsForTab(tab)[idx];
          if (row) openDetail(row);
          break;
        }
      }
    }
  }

  function init() {
    if (document.getElementById('boardDetailTitle')) {
      initBoardDetail();
      return;
    }
    initListPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
