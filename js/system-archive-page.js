document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('archiveMatTableBody')) initSystemArchiveList();
  if (document.getElementById('archiveMatDetailSubject')) initSystemArchiveDetail();
});

function initSystemArchiveList() {
  const tableBody = document.getElementById('archiveMatTableBody');
  const searchInput = document.getElementById('archiveMatSearch');
  const searchForm = document.getElementById('archiveMatSearchForm');
  const resetBtn = document.getElementById('archiveMatResetBtn');
  const resultCount = document.getElementById('archiveMatResultCount');
  const listState = PomsUserTable.createState();
  const sourceData = PomsArchiveMaterials.ARCHIVE_MATERIAL_DATA;
  let currentList = [...sourceData];

  function updateResultCount(total) {
    if (resultCount) resultCount.textContent = total.toLocaleString();
  }

  function renderRows(list) {
    currentList = list;
    const sorted = [...list];
    const pageRows = PomsUserTable.slicePage(sorted, listState.page, listState.pageSize);
    const start = (listState.page - 1) * listState.pageSize;

    updateResultCount(sorted.length);

    if (!sorted.length) {
      tableBody.innerHTML = '<tr><td colspan="6">조회된 자료가 없습니다.</td></tr>';
    } else {
      tableBody.innerHTML = pageRows
        .map(
          (item, index) => `
      <tr class="is-clickable" data-archive-mat-id="${item.id}" tabindex="0">
        <td class="col-no">${start + index + 1}</td>
        <td class="col-category">${item.categoryLabel}</td>
        <td class="col-title">
          <span class="notice-title-link">${item.title}</span>
        </td>
        <td class="col-author">${item.author}</td>
        <td class="col-date">${item.date}</td>
        <td class="col-views">${item.views}</td>
      </tr>`
        )
        .join('');
    }

    tableBody.querySelectorAll('tr[data-archive-mat-id]').forEach((row) => {
      const go = () => {
        window.location.href = `system-archive-detail.html?id=${row.dataset.archiveMatId}`;
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
      paginationId: 'archiveMatPagination',
      state: listState,
      totalRows: sorted.length,
      onChange: () => renderRows(currentList),
    });
  }

  function filterList() {
    const q = searchInput?.value.trim().toLowerCase() || '';
    const filtered = q
      ? sourceData.filter((n) => n.title.toLowerCase().includes(q))
      : [...sourceData];
    listState.page = 1;
    renderRows(filtered);
  }

  renderRows(sourceData);

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    filterList();
  });

  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    filterList();
  });

  PomsSidebar.mount('#sidebar-root', { active: 'archive-law' });
}

function initSystemArchiveDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id')) || 31;
  const { data } = PomsArchiveMaterials.resolveArchiveMaterialDetail(id);

  document.title = `${data.title} | 시스템 자료 상세 | POMS`;

  const goList = () => {
    window.location.href = 'system-archive.html';
  };

  const setValue = (elId, value) => {
    const el = document.getElementById(elId);
    if (el) el.value = value ?? '';
  };

  const crumb = document.getElementById('archiveMatDetailCrumb');
  if (crumb) crumb.textContent = data.title;

  setValue('archiveMatDetailSubject', data.title);
  setValue('archiveMatDetailAuthor', data.author);
  setValue('archiveMatDetailDate', data.date);
  setValue('archiveMatDetailViews', String(data.views ?? ''));
  setValue('archiveMatDetailPeriod', data.period || '-');
  setValue('archiveMatDetailCategory', data.categoryLabel || '-');

  const bodyEl = document.getElementById('archiveMatDetailBody');
  if (bodyEl) {
    bodyEl.innerHTML = data.body || '<p>등록된 내용이 없습니다.</p>';
  }

  const fileBtn = document.getElementById('archiveMatDetailFile');
  if (fileBtn) {
    if (data.file) {
      fileBtn.textContent = `${data.file.name} (${data.file.size})`;
      fileBtn.addEventListener('click', () => {
        alert(`${data.file.name} 파일을 다운로드합니다. (샘플)`);
      });
    } else {
      fileBtn.textContent = '첨부파일 없음';
      fileBtn.disabled = true;
    }
  }

  document.getElementById('archiveMatDetailBackBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    goList();
  });

  PomsSidebar.mount('#sidebar-root', { active: 'archive-law' });
}
