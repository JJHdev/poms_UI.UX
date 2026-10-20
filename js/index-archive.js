/**
 * index.html — 시스템 자료실 in-page view (type3 사용자 페이지 디자인)
 */
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('homeSubPanel');
    const bodyEl = document.getElementById('homeSubBody');

    if (!bodyEl || typeof PomsArchiveMaterials === 'undefined' || typeof PomsHomeViews === 'undefined') {
      return;
    }

    const PAGE_SIZE = 15;
    let listSearch = { scope: 'all', keyword: '' };
    let listPage = 1;
    let isDetail = false;

    const LIST_LABEL = '시스템 자료실';
    const ARROW = 'assets/main/facility-search/arrow-right.svg';
    const ARROW_DOUBLE = 'assets/main/facility-search/arrow-double-right.svg';
    const ICON_SEARCH = 'assets/main/facility-statistics/figma188/icon-search-clean.svg';
    const ICON_RESET = 'assets/main/facility-search/icon-reset.svg';
    const ICON_BAR = 'assets/main/facility-statistics/figma188/icon-section-bar-clean.svg';
    const ICON_TITLE = 'assets/main/facility-statistics/figma188/icon-title-clean.svg';
    const ICON_BACK = 'assets/main/facility-statistics/figma188/icon-angle-down-clean.svg';
    const ICON_HOME = 'assets/main/facility-statistics/figma188/icon-home-clean.svg';
    const ICON_FILE = 'assets/main/facility-form/icon-file.svg';

    const CATEGORY_OPTIONS = [
      { value: 'all', label: '전체' },
      { value: 'guide', label: '지침' },
      { value: 'manual', label: '매뉴얼' },
      { value: 'form', label: '양식' },
      { value: 'template', label: '서식' },
    ];

    function escapeAttr(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
    }

    function formatFileSize(size) {
      return String(size || '').replace(/\s+/g, '');
    }

    function filterMaterials() {
      let list = PomsArchiveMaterials.ARCHIVE_MATERIAL_DATA;

      if (listSearch.scope !== 'all') {
        list = list.filter((item) => item.category === listSearch.scope);
      }

      const q = listSearch.keyword.trim().toLowerCase();
      if (q) {
        list = list.filter((item) => item.title.toLowerCase().includes(q));
      }

      return list;
    }

    function getTotalPages(total) {
      return Math.max(1, Math.ceil(total / PAGE_SIZE));
    }

    function getPageItems(list) {
      const totalPages = getTotalPages(list.length);
      if (listPage > totalPages) listPage = totalPages;
      if (listPage < 1) listPage = 1;
      const start = (listPage - 1) * PAGE_SIZE;
      return {
        items: list.slice(start, start + PAGE_SIZE),
        start,
        totalPages,
      };
    }

    function renderTableRows(list) {
      const { items, start } = getPageItems(list);

      if (!list.length) {
        return `
          <tr>
            <td colspan="6" class="type3-empty">검색 결과가 없습니다.</td>
          </tr>`;
      }

      return items
        .map(
          (item, index) => `
          <tr class="is-clickable" data-archive-id="${item.id}" tabindex="0">
            <td class="col-no">${start + index + 1}</td>
            <td class="col-category">${item.categoryLabel}</td>
            <td class="col-title">${item.title}</td>
            <td class="col-author">${item.author}</td>
            <td class="col-date">${item.date}</td>
            <td class="col-views">${item.views}</td>
          </tr>`
        )
        .join('');
    }

    function renderPagination(total) {
      const totalPages = getTotalPages(total);
      const maxButtons = Math.min(totalPages, 5);
      const pages = Array.from({ length: maxButtons }, (_, i) => i + 1);

      return `
        <div class="type3-results-foot">
          <nav class="pagination" id="homeArchivePagination" aria-label="시스템 자료실 페이지">
            <button type="button" class="pagination__btn" data-page-move="first" aria-label="첫 페이지" ${listPage === 1 ? 'disabled' : ''}>
              <img src="${ARROW_DOUBLE}" alt="" width="14" height="14">
            </button>
            <button type="button" class="pagination__btn" data-page-move="prev" aria-label="이전 페이지" ${listPage === 1 ? 'disabled' : ''}>
              <img src="${ARROW}" alt="" width="14" height="14">
            </button>
            ${pages
              .map(
                (page) =>
                  `<button type="button" class="pagination__btn${page === listPage ? ' is-active' : ''}" data-page="${page}"${page === listPage ? ' aria-current="page"' : ''}>${page}</button>`
              )
              .join('')}
            ${
              totalPages > 5
                ? `<button type="button" class="pagination__btn${totalPages === listPage ? ' is-active' : ''}" data-page="${totalPages}">${totalPages}</button>`
                : ''
            }
            <button type="button" class="pagination__btn" data-page-move="next" aria-label="다음 페이지" ${listPage === totalPages ? 'disabled' : ''}>
              <img src="${ARROW}" alt="" width="14" height="14">
            </button>
            <button type="button" class="pagination__btn" data-page-move="last" aria-label="마지막 페이지" ${listPage === totalPages ? 'disabled' : ''}>
              <img src="${ARROW_DOUBLE}" alt="" width="14" height="14">
            </button>
          </nav>
        </div>
      `;
    }

    function bindPagination(total) {
      const nav = bodyEl.querySelector('#homeArchivePagination');
      if (!nav) return;
      const totalPages = getTotalPages(total);

      nav.querySelectorAll('[data-page]').forEach((btn) => {
        btn.addEventListener('click', () => {
          listPage = Number(btn.getAttribute('data-page'));
          refreshList();
        });
      });
      nav.querySelector('[data-page-move="first"]')?.addEventListener('click', () => {
        listPage = 1;
        refreshList();
      });
      nav.querySelector('[data-page-move="prev"]')?.addEventListener('click', () => {
        listPage = Math.max(1, listPage - 1);
        refreshList();
      });
      nav.querySelector('[data-page-move="next"]')?.addEventListener('click', () => {
        listPage = Math.min(totalPages, listPage + 1);
        refreshList();
      });
      nav.querySelector('[data-page-move="last"]')?.addEventListener('click', () => {
        listPage = totalPages;
        refreshList();
      });
    }

    function bindListSearch() {
      const form = bodyEl.querySelector('#homeArchiveSearchForm');
      const scopeSelect = bodyEl.querySelector('#homeArchiveSearchScope');
      const keywordInput = bodyEl.querySelector('#homeArchiveSearchKeyword');
      const resetBtn = bodyEl.querySelector('#homeArchiveResetBtn');

      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        listSearch.scope = scopeSelect?.value || 'all';
        listSearch.keyword = keywordInput?.value || '';
        listPage = 1;
        refreshList();
      });

      resetBtn?.addEventListener('click', () => {
        listSearch = { scope: 'all', keyword: '' };
        listPage = 1;
        refreshList();
      });
    }

    function refreshList() {
      const filtered = filterMaterials();
      const escapedKeyword = escapeAttr(listSearch.keyword);
      const scopeOptions = CATEGORY_OPTIONS.map(
        (opt) => `<option value="${opt.value}"${listSearch.scope === opt.value ? ' selected' : ''}>${opt.label}</option>`
      ).join('');

      const shell = window.PomsHomeArchiveShell;
      const contentHtml = `
        ${shell?.renderSectionTitle ? shell.renderSectionTitle('검색조건') : ''}
        <section class="type3-filter-strip home-archive-filter" aria-label="검색조건">
          <form class="type3-filter type3-filter--strip" id="homeArchiveSearchForm" novalidate>
            <div class="type3-filter__fields">
              <div class="type3-field home-archive-field--scope">
                <label for="homeArchiveSearchScope">검색구분</label>
                <select id="homeArchiveSearchScope" name="searchScope">${scopeOptions}</select>
              </div>
              <div class="type3-field type3-field--grow">
                <label for="homeArchiveSearchKeyword">제목</label>
                <input type="text" id="homeArchiveSearchKeyword" name="keyword" value="${escapedKeyword}" placeholder="검색어를 입력하세요." autocomplete="off">
              </div>
            </div>
            <div class="type3-filter-actions">
              <button type="submit" class="type3-btn type3-btn--search home-archive-btn-search">
                <img src="${ICON_SEARCH}" alt="" width="18" height="18">
                검색하기
              </button>
              <button type="button" class="type3-btn type3-btn--reset" id="homeArchiveResetBtn">
                <img src="${ICON_RESET}" alt="" width="18" height="18">
                초기화
              </button>
            </div>
          </form>
        </section>

        <section class="home-archive-results" aria-labelledby="homeArchiveResultTitle">
          <div class="home-archive-results__head">
            <span class="type3-results__bar-icon" aria-hidden="true">
              <img src="${ICON_BAR}" alt="" width="14" height="14">
            </span>
            <h2 id="homeArchiveResultTitle" class="home-archive-results__label">검색결과</h2>
            <p class="home-archive-results__meta">총 <strong>${filtered.length}</strong>건</p>
          </div>
          <div class="home-archive-table-wrap">
            <table class="home-archive-data-table" aria-label="시스템 자료실 조회결과">
              <colgroup>
                <col class="home-archive-data-table__no">
                <col class="home-archive-data-table__category">
                <col class="home-archive-data-table__title">
                <col class="home-archive-data-table__author">
                <col class="home-archive-data-table__date">
                <col class="home-archive-data-table__views">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">번호</th>
                  <th scope="col">구분</th>
                  <th scope="col">제목</th>
                  <th scope="col">작성자</th>
                  <th scope="col">작성일</th>
                  <th scope="col">조회수</th>
                </tr>
              </thead>
              <tbody>${renderTableRows(filtered)}</tbody>
            </table>
          </div>
          ${renderPagination(filtered.length)}
        </section>
      `;

      bodyEl.innerHTML = shell?.wrap
        ? shell.wrap({ activeKey: 'archive', currentLabel: LIST_LABEL, contentHtml })
        : contentHtml;

      bindListSearch();
      bindPagination(filtered.length);
    }

    function renderDetail(id) {
      const { data } = PomsArchiveMaterials.resolveArchiveMaterialDetail(id);
      const shell = window.PomsHomeArchiveShell;
      const contentHtml = shell?.renderDetailPanel
        ? shell.renderDetailPanel({
            title: data.title,
            author: data.author,
            periodLabel: '게시기간',
            period: data.period,
            date: data.date,
            views: data.views,
            bodyHtml: data.body || '',
            file: data.file || null,
            titleId: 'homeArchiveDetailTitle',
          })
        : '';

      bodyEl.innerHTML = shell?.wrapDetail
        ? shell.wrapDetail({
            activeKey: 'archive',
            listLabel: LIST_LABEL,
            detailLabel: '시스템 자료실 상세',
            contentHtml,
          })
        : contentHtml;
    }

    function openDetail(id) {
      isDetail = true;
      PomsHomeViews.showView({
        key: 'archive',
        title: '시스템 자료실 상세',
        listLabel: LIST_LABEL,
        isDetail: true,
        hideChrome: true,
        id: String(id),
        render: () => renderDetail(id),
      });
    }

    function openList(resetSearch = false) {
      if (resetSearch) {
        listSearch = { scope: 'all', keyword: '' };
        listPage = 1;
      }
      isDetail = false;
      PomsHomeViews.showView({
        key: 'archive',
        title: LIST_LABEL,
        listLabel: LIST_LABEL,
        isDetail: false,
        hideChrome: true,
        render: () => refreshList(),
      });
    }

    bodyEl.addEventListener('click', (e) => {
      const homeBtn = e.target.closest('[data-action="home"]');
      if (homeBtn) {
        e.preventDefault();
        PomsHomeViews.showLanding();
        return;
      }

      const backBtn = e.target.closest('[data-action="back"]');
      if (backBtn) {
        e.preventDefault();
        openList(false);
        return;
      }

      const row = e.target.closest('tr[data-archive-id]');
      if (row) {
        e.preventDefault();
        openDetail(Number(row.dataset.archiveId));
      }
    });

    bodyEl.addEventListener('keydown', (e) => {
      const row = e.target.closest('tr[data-archive-id]');
      if (!row) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetail(Number(row.dataset.archiveId));
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || PomsHomeViews.getCurrentKey() !== 'archive') return;
      if (isDetail || panel?.classList.contains('is-detail')) {
        openList(false);
      } else {
        PomsHomeViews.showLanding();
      }
    });

    window.PomsHomeArchive = { openList, openDetail };
  });
})();
