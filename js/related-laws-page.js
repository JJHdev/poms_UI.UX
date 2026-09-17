document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('archiveBoardTableBody') || document.getElementById('lawTableBody')) {
    initRelatedLawsList();
  }
  if (document.getElementById('boardDetailTitle') || document.getElementById('lawDetailSubject')) {
    initRelatedLawDetail();
  }
});

function initRelatedLawsList() {
  const tableBody = document.getElementById('archiveBoardTableBody') || document.getElementById('lawTableBody');
  const searchInput = document.getElementById('archiveBoardContent') || document.getElementById('lawSearch');
  const searchForm = document.getElementById('archiveBoardSearchForm') || document.getElementById('lawSearchForm');
  const resultCount = document.getElementById('archiveBoardTotal') || document.getElementById('lawResultCount');
  const paginationId = document.getElementById('archiveBoardPagination') ? 'archiveBoardPagination' : 'lawPagination';
  const listState = PomsUserTable.createState();
  let currentTab = 'law';
  let currentList = [];

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

  function updateResultCount(total) {
    if (resultCount) resultCount.textContent = total.toLocaleString();
  }

  function sourceRows() {
    return typeof PomsRelatedLaws.getBoardRows === 'function'
      ? PomsRelatedLaws.getBoardRows(currentTab)
      : PomsRelatedLaws.RELATED_LAW_DATA;
  }

  function renderRows(list) {
    currentList = list;
    const pageRows = PomsUserTable.slicePage(list, listState.page, listState.pageSize);
    const start = (listState.page - 1) * listState.pageSize;

    updateResultCount(list.length);

    if (!list.length) {
      tableBody.innerHTML = '<tr><td colspan="7">조회된 자료가 없습니다.</td></tr>';
    } else {
      tableBody.innerHTML = pageRows
        .map(
          (item, index) => `
      <tr class="is-clickable" data-row-id="${escapeHtml(item.id)}" tabindex="0">
        <td class="col-no">${start + index + 1}</td>
        <td class="col-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</td>
        <td class="col-desc" title="${escapeHtml(item.desc)}">${escapeHtml(item.desc)}</td>
        <td class="col-writer">${escapeHtml(item.writer)}</td>
        <td class="col-date">${escapeHtml(item.date)}</td>
        <td class="col-file">
          <button
            type="button"
            class="archive-file-attach"
            data-file-name="${escapeHtml(item.fileName)}"
            aria-label="${escapeHtml(item.fileName)} 다운로드"
          >${attachIconHtml()}</button>
        </td>
        <td class="col-size">${escapeHtml(item.size)}</td>
      </tr>`
        )
        .join('');
    }

    tableBody.querySelectorAll('.archive-file-attach').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const name = button.dataset.fileName || '';
        if (!name || name === '-') {
          alert('다운로드할 첨부파일이 없습니다.');
          return;
        }
        alert('첨부파일 다운로드 기능은 샘플입니다.');
      });
    });

    tableBody.querySelectorAll('tr[data-row-id]').forEach((row) => {
      const go = () => {
        window.location.href = `related-law-detail.html?id=${encodeURIComponent(row.dataset.rowId)}`;
      };
      row.addEventListener('click', go);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go();
        }
      });
    });

    PomsUserTable.mountFoot({
      paginationId,
      state: listState,
      totalRows: list.length,
      onChange: () => renderRows(currentList),
    });
  }

  function filterList() {
    const q = searchInput?.value.trim().toLowerCase() || '';
    const source = sourceRows();
    const filtered = q
      ? source.filter((item) => {
          const title = String(item.title || '').toLowerCase();
          const desc = String(item.desc || '').toLowerCase();
          const writer = String(item.writer || '').toLowerCase();
          return title.includes(q) || desc.includes(q) || writer.includes(q);
        })
      : [...source];
    listState.page = 1;
    renderRows(filtered);
  }

  function setTab(tab) {
    currentTab = tab;
    document.querySelectorAll('[data-board-tab]').forEach((button) => {
      const active = button.dataset.boardTab === tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    filterList();
  }

  filterList();

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    filterList();
  });

  document.querySelectorAll('[data-board-tab]').forEach((button) => {
    button.addEventListener('click', () => setTab(button.dataset.boardTab));
  });

  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get('tab');
  if (tabParam && PomsRelatedLaws.BOARD_TAB_LABELS?.[tabParam]) {
    setTab(tabParam);
  }

  PomsSidebar.mount('#sidebar-root', { active: 'archive-law' });
}

function initRelatedLawDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '15';
  const resolved = typeof PomsRelatedLaws.resolveBoardDetail === 'function'
    ? PomsRelatedLaws.resolveBoardDetail(id)
    : PomsRelatedLaws.resolveRelatedLawDetail(id);
  const { data, listItem } = resolved;

  if (!data) {
    window.location.href = 'related-laws.html';
    return;
  }

  const titleText = data.title || '';
  const categoryLabel = data.categoryLabel || '게시판';
  const listUrl = listItem?.tab
    ? `related-laws.html?tab=${encodeURIComponent(listItem.tab)}`
    : 'related-laws.html';

  document.title = `${titleText} | 게시판 상세 | POMS`;

  const goList = () => {
    window.location.href = listUrl;
  };

  const setValue = (elId, value) => {
    const el = document.getElementById(elId);
    if (el) el.value = value ?? '';
  };

  const crumb = document.getElementById('boardDetailCrumb') || document.getElementById('lawDetailCrumb');
  if (crumb) crumb.textContent = titleText;

  const sectionTitle = document.getElementById('boardDetailSectionTitle') || document.getElementById('lawDetailSectionTitle');
  if (sectionTitle) sectionTitle.textContent = `${categoryLabel} 상세`;

  const listLink = document.getElementById('boardDetailListLink');
  if (listLink) {
    listLink.href = listUrl;
    listLink.textContent = '게시판';
  }

  setValue('boardDetailCategory', categoryLabel);
  setValue('boardDetailTitle', titleText);
  setValue('boardDetailWriter', data.writer || data.author || '');
  setValue('boardDetailDate', data.date || '');
  setValue('boardDetailSize', data.size || data.file?.size || '-');
  setValue('lawDetailSubject', titleText);
  setValue('lawDetailAuthor', data.writer || data.author || '');
  setValue('lawDetailDate', data.date || '');
  setValue('lawDetailCategory', categoryLabel);

  const descEl = document.getElementById('boardDetailDesc') || document.getElementById('lawDetailBody');
  if (descEl) {
    const plain = String(data.desc || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    descEl.textContent = plain || '-';
  }

  const fileBtn = document.getElementById('boardDetailFile') || document.getElementById('lawDetailFile');
  if (fileBtn) {
    if (data.file) {
      fileBtn.textContent = `${data.file.name} (${data.file.size})`;
      fileBtn.classList?.remove('is-empty');
      fileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`${data.file.name} 파일을 다운로드합니다. (샘플)`);
      });
    } else {
      fileBtn.textContent = '첨부된 파일 없음';
      fileBtn.classList?.add('is-empty');
    }
  }

  document.getElementById('boardDetailBackBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    goList();
  });
  document.getElementById('lawDetailBackBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    goList();
  });

  PomsSidebar.mount('#sidebar-root', { active: 'archive-law' });
}
