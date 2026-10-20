/**
 * index.html — 공지사항 in-page view (type3 사용자 페이지 디자인)
 */
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('homeNoticeBoard');
    const moreBtn = document.getElementById('homeNoticeMoreBtn');
    const panel = document.getElementById('homeSubPanel');
    const bodyEl = document.getElementById('homeSubBody');

    if (!board || !bodyEl || typeof PomsNotices === 'undefined' || typeof PomsHomeViews === 'undefined') {
      return;
    }

    const PAGE_SIZE = 10;
    let listSearch = { scope: 'all', keyword: '' };
    let listPage = 1;
    let isDetail = false;

    const LIST_LABEL = '공지사항';
    const ARROW = 'assets/main/facility-search/arrow-right.svg';
    const ARROW_DOUBLE = 'assets/main/facility-search/arrow-double-right.svg';
    const ICON_SEARCH = 'assets/main/facility-statistics/figma188/icon-search-clean.svg';
    const ICON_RESET = 'assets/main/facility-search/icon-reset.svg';
    const ICON_BAR = 'assets/main/facility-statistics/figma188/icon-section-bar-clean.svg';
    const ICON_TITLE = 'assets/main/facility-statistics/figma188/icon-title-clean.svg';
    const ICON_BACK = 'assets/main/facility-statistics/figma188/icon-angle-down-clean.svg';
    const ICON_HOME = 'assets/main/facility-statistics/figma188/icon-home-clean.svg';
    const ICON_FILE = 'assets/main/facility-form/icon-file.svg';

    const SCOPE_OPTIONS = [
      { value: 'all', label: '전체' },
      { value: 'title', label: '제목' },
      { value: 'author', label: '작성자' },
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

    function filterNotices() {
      let list = PomsNotices.NOTICE_DATA || [];
      const q = listSearch.keyword.trim().toLowerCase();
      if (!q) return list;

      return list.filter((item) => {
        const title = String(item.title || '').toLowerCase();
        const author = String(item.author || '').toLowerCase();
        if (listSearch.scope === 'title') return title.includes(q);
        if (listSearch.scope === 'author') return author.includes(q);
        return title.includes(q) || author.includes(q);
      });
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

    function renderBoardRows(list) {
      const { items, start } = getPageItems(list);

      if (!list.length) {
        return `<li class="home-archive-board__empty">검색 결과가 없습니다.</li>`;
      }

      return items
        .map((item, index) => {
          const no = String(start + index + 1).padStart(2, '0');
          const newBadge = item.notice
            ? '<span class="home-archive-board__new">NEW</span>'
            : '';
          return `
          <li>
            <button type="button" class="home-archive-board__row" data-notice-id="${item.id}">
              <span class="home-archive-board__main">
                <span class="home-archive-board__no">${no}</span>
                <span class="home-archive-board__title-group">
                  <span class="home-archive-board__title">${item.title}</span>
                  ${newBadge}
                </span>
              </span>
              <span class="home-archive-board__date">${item.date}</span>
            </button>
          </li>`;
        })
        .join('');
    }

    function renderPagination(total) {
      const totalPages = getTotalPages(total);
      const maxButtons = Math.min(totalPages, 5);
      const pages = Array.from({ length: maxButtons }, (_, i) => i + 1);

      return `
        <div class="type3-results-foot">
          <nav class="pagination" id="homeNoticePagination" aria-label="공지사항 페이지">
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
      const nav = bodyEl.querySelector('#homeNoticePagination');
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
      const form = bodyEl.querySelector('#homeNoticeSearchForm');
      const scopeSelect = bodyEl.querySelector('#homeNoticeSearchScope');
      const keywordInput = bodyEl.querySelector('#homeNoticeSearchKeyword');
      const resetBtn = bodyEl.querySelector('#homeNoticeResetBtn');

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
      const filtered = filterNotices();
      const escapedKeyword = escapeAttr(listSearch.keyword);
      const scopeOptions = SCOPE_OPTIONS.map(
        (opt) => `<option value="${opt.value}"${listSearch.scope === opt.value ? ' selected' : ''}>${opt.label}</option>`
      ).join('');

      const shell = window.PomsHomeArchiveShell;
      const contentHtml = `
        ${shell?.renderSectionTitle ? shell.renderSectionTitle('검색조건') : '<h2 class="home-archive-section-title__text">검색조건</h2>'}
        <section class="type3-filter-strip home-archive-filter" aria-label="검색조건">
          <form class="type3-filter type3-filter--strip" id="homeNoticeSearchForm" novalidate>
            <div class="type3-filter__fields">
              <div class="type3-field home-archive-field--scope">
                <label for="homeNoticeSearchScope">검색구분</label>
                <select id="homeNoticeSearchScope" name="searchScope">${scopeOptions}</select>
              </div>
              <div class="type3-field type3-field--grow">
                <label for="homeNoticeSearchKeyword">제목</label>
                <input type="text" id="homeNoticeSearchKeyword" name="keyword" value="${escapedKeyword}" placeholder="검색어를 입력하세요." autocomplete="off">
              </div>
            </div>
            <div class="type3-filter-actions">
              <button type="submit" class="type3-btn type3-btn--search home-archive-btn-search" id="homeNoticeSearchBtn">
                <img src="${ICON_SEARCH}" alt="" width="18" height="18">
                검색하기
              </button>
              <button type="button" class="type3-btn type3-btn--reset" id="homeNoticeResetBtn">
                <img src="${ICON_RESET}" alt="" width="18" height="18">
                초기화
              </button>
            </div>
          </form>
        </section>

        <section class="home-archive-results" aria-labelledby="homeNoticeResultTitle">
          <div class="home-archive-results__head">
            <span class="type3-results__bar-icon" aria-hidden="true">
              <img src="${ICON_BAR}" alt="" width="14" height="14">
            </span>
            <h2 id="homeNoticeResultTitle" class="home-archive-results__label">검색결과</h2>
            <p class="home-archive-results__meta">총 <strong>${filtered.length}</strong>건</p>
          </div>
          <ul class="home-archive-board" aria-label="공지사항 목록">
            ${renderBoardRows(filtered)}
          </ul>
          ${renderPagination(filtered.length)}
        </section>
      `;

      bodyEl.innerHTML = shell?.wrap
        ? shell.wrap({ activeKey: 'notice', currentLabel: LIST_LABEL, contentHtml })
        : contentHtml;

      bindListSearch();
      bindPagination(filtered.length);
    }

    function renderDetail(id) {
      const { data, listItem } = PomsNotices.resolveNoticeDetail(id);
      const shell = window.PomsHomeArchiveShell;
      const showNew = Boolean(listItem?.notice || data?.notice);
      const contentHtml = shell?.renderDetailPanel
        ? shell.renderDetailPanel({
            title: data.title,
            showNew,
            author: data.author,
            periodLabel: '공지기간',
            period: data.period,
            date: data.date,
            views: data.views,
            bodyHtml: data.body || '',
            file: data.file || null,
            titleId: 'homeNoticeDetailTitle',
          })
        : '';

      bodyEl.innerHTML = shell?.wrapDetail
        ? shell.wrapDetail({
            activeKey: 'notice',
            listLabel: LIST_LABEL,
            detailLabel: '공지사항 상세',
            contentHtml,
          })
        : contentHtml;
    }

    function openDetail(id) {
      isDetail = true;
      PomsHomeViews.showView({
        key: 'notice',
        title: '공지사항 상세',
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
        key: 'notice',
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

      const row = e.target.closest('[data-notice-id]');
      if (row && !row.closest('.detail-shell')) {
        e.preventDefault();
        openDetail(Number(row.dataset.noticeId));
      }
    });

    bodyEl.addEventListener('keydown', (e) => {
      const row = e.target.closest('[data-notice-id]');
      if (!row || row.closest('.detail-shell')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetail(Number(row.dataset.noticeId));
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || PomsHomeViews.getCurrentKey() !== 'notice') return;
      if (isDetail || panel?.classList.contains('is-detail')) {
        openList(false);
      } else {
        PomsHomeViews.showLanding();
      }
    });

    moreBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      openList(true);
    });

    board.querySelectorAll('.board__link[data-notice-id]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openDetail(Number(el.dataset.noticeId));
      });
    });

    window.PomsHomeNotice = { openList, openDetail };
  });
})();
