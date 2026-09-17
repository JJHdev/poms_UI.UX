/**
 * index.html — 게시판 in-page view (사용자 페이지 archive-board와 동일 레이아웃)
 */
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('homeLawBoard');
    const moreBtn = document.getElementById('homeLawMoreBtn');
    const panel = document.getElementById('homeSubPanel');
    const bodyEl = document.getElementById('homeSubBody');

    if (!board || !bodyEl || typeof PomsRelatedLaws === 'undefined' || typeof PomsHomeViews === 'undefined') {
      return;
    }

    const PAGE_SIZE = 10;
    const LIST_LABEL = '게시판';
    const ARROW = 'assets/main/facility-search/arrow-right.svg';
    const ARROW_DOUBLE = 'assets/main/facility-search/arrow-double-right.svg';
    const ICON_SEARCH = 'assets/main/facility-statistics/figma188/icon-search-clean.svg';
    const ICON_BAR = 'assets/main/facility-statistics/figma188/icon-section-bar-clean.svg';
    const ICON_TITLE = 'assets/main/facility-statistics/figma188/icon-title-clean.svg';
    const ICON_FILE = 'assets/main/facility-form/icon-file.svg';
    const ICON_ATTACH = 'assets/main/safety-report/icon-download.svg';

    const BOARD_TABS = PomsRelatedLaws.BOARD_TABS || [
      { id: 'law', label: '법/지침/규정' },
      { id: 'forms', label: '각종서식' },
      { id: 'software', label: '매뉴얼 등' },
      { id: 'plan', label: '기본계획평면도' },
      { id: 'materials', label: '안전점검 관련자료' },
      { id: 'etc', label: '기타' },
    ];

    let currentTab = 'law';
    let listKeyword = '';
    let listPage = 1;
    let isDetail = false;

    function escapeHtml(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/'/g, '&#39;');
    }

    function getRows() {
      if (typeof PomsRelatedLaws.getBoardRows === 'function') {
        return PomsRelatedLaws.getBoardRows(currentTab);
      }
      return PomsRelatedLaws.RELATED_LAW_DATA || [];
    }

    function filterRows() {
      const q = listKeyword.trim().toLowerCase();
      const source = getRows();
      if (!q) return source;
      return source.filter((item) => {
        const title = String(item.title || '').toLowerCase();
        const desc = String(item.desc || '').toLowerCase();
        const writer = String(item.writer || item.author || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || writer.includes(q);
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

    function attachIconHtml() {
      return `<img src="${ICON_ATTACH}" alt="" width="16" height="16">`;
    }

    function renderTableRows(list) {
      const { items, start } = getPageItems(list);

      if (!list.length) {
        return `
          <tr>
            <td colspan="7" class="type3-empty">조회된 자료가 없습니다.</td>
          </tr>`;
      }

      return items
        .map(
          (item, index) => `
          <tr class="is-clickable" data-board-id="${escapeHtml(item.id)}" tabindex="0">
            <td class="col-no">${start + index + 1}</td>
            <td class="col-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</td>
            <td class="col-desc" title="${escapeHtml(item.desc)}">${escapeHtml(item.desc)}</td>
            <td class="col-writer">${escapeHtml(item.writer || item.author || '')}</td>
            <td class="col-date">${escapeHtml(item.date)}</td>
            <td class="col-file">
              <button
                type="button"
                class="archive-file-attach"
                data-file-name="${escapeHtml(item.fileName || '')}"
                aria-label="${escapeHtml(item.fileName || item.title || '')} 다운로드"
              >${attachIconHtml()}</button>
            </td>
            <td class="col-size">${escapeHtml(item.size || '-')}</td>
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
          <nav class="pagination" id="homeLawPagination" aria-label="게시판 페이지">
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

    function renderTabs() {
      return `
        <div class="archive-board-tabs" role="tablist" aria-label="자료 구분">
          ${BOARD_TABS.map(
            (tab) => `
            <button
              type="button"
              class="archive-board-tabs__btn${tab.id === currentTab ? ' is-active' : ''}"
              data-board-tab="${tab.id}"
              role="tab"
              aria-selected="${tab.id === currentTab ? 'true' : 'false'}"
            >${escapeHtml(tab.label)}</button>`
          ).join('')}
        </div>`;
    }

    function bindPagination(total) {
      const nav = bodyEl.querySelector('#homeLawPagination');
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

    function bindListControls() {
      const form = bodyEl.querySelector('#homeLawSearchForm');
      const keywordInput = bodyEl.querySelector('#homeLawSearchKeyword');

      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        listKeyword = keywordInput?.value || '';
        listPage = 1;
        refreshList();
      });

      bodyEl.querySelectorAll('[data-board-tab]').forEach((button) => {
        button.addEventListener('click', () => {
          const tab = button.dataset.boardTab;
          if (!tab || tab === currentTab) return;
          currentTab = tab;
          listPage = 1;
          refreshList();
        });
      });

      bodyEl.querySelectorAll('.archive-file-attach').forEach((button) => {
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
    }

    function refreshList() {
      const filtered = filterRows();
      const escapedKeyword = escapeHtml(listKeyword);
      const shell = window.PomsHomeArchiveShell;

      const contentHtml = `
        ${renderTabs()}
        <section class="type3-filter-strip home-archive-filter" aria-label="검색조건">
          <form class="type3-filter type3-filter--strip" id="homeLawSearchForm" novalidate>
            <div class="type3-filter__fields">
              <div class="type3-field type3-field--grow">
                <label for="homeLawSearchKeyword">내용</label>
                <input type="text" id="homeLawSearchKeyword" name="content" value="${escapedKeyword}" placeholder="내용을 입력해주세요." autocomplete="off">
              </div>
            </div>
            <div class="type3-filter-actions">
              <button type="submit" class="type3-btn type3-btn--search home-archive-btn-search">
                <img src="${ICON_SEARCH}" alt="" width="18" height="18">
                검색하기
              </button>
            </div>
          </form>
        </section>

        <section class="type3-results-panel" aria-labelledby="homeLawResultTitle">
          <div class="type3-results__head">
            <div class="type3-results__count">
              <span class="type3-results__bar-icon" aria-hidden="true">
                <img src="${ICON_BAR}" alt="" width="14" height="14">
              </span>
              <h2 id="homeLawResultTitle" class="type3-results__label">조회결과</h2>
              <p class="type3-results__meta">총 <strong>${filtered.length}</strong>건</p>
            </div>
            <div class="type3-results__side">
              <p class="type3-list-guide-note">※ 행을 클릭하면 자료 상세로 이동합니다.</p>
            </div>
          </div>
          <div class="type3-table-wrap">
            <table class="type3-table archive-board-table" aria-label="게시판 조회결과">
              <thead>
                <tr>
                  <th scope="col" class="col-no">번호</th>
                  <th scope="col" class="col-title">제목</th>
                  <th scope="col" class="col-desc">내용</th>
                  <th scope="col" class="col-writer">등록자</th>
                  <th scope="col" class="col-date">등록일</th>
                  <th scope="col" class="col-file">첨부파일</th>
                  <th scope="col" class="col-size">파일크기</th>
                </tr>
              </thead>
              <tbody>${renderTableRows(filtered)}</tbody>
            </table>
          </div>
          ${renderPagination(filtered.length)}
        </section>
      `;

      bodyEl.innerHTML = shell?.wrap
        ? shell.wrap({ activeKey: 'law', currentLabel: LIST_LABEL, contentHtml })
        : contentHtml;

      bindListControls();
      bindPagination(filtered.length);
    }

    function resolveDetail(id) {
      if (typeof PomsRelatedLaws.resolveBoardDetail === 'function') {
        const board = PomsRelatedLaws.resolveBoardDetail(id);
        if (board?.data) return board;
      }
      return PomsRelatedLaws.resolveRelatedLawDetail(id);
    }

    function renderDetail(id) {
      const { data, listItem } = resolveDetail(id);
      if (!data) return;

      const categoryLabel = data.categoryLabel || listItem?.categoryLabel || '게시판';
      const titleText = data.title || '';
      const writer = data.writer || data.author || '-';
      const date = String(data.date || '').replace(/\s+\d{1,2}:\d{2}(:\d{2})?$/, '');
      const size = data.size || data.file?.size || '-';
      const plainDesc = String(data.desc || data.body || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const fileName = data.file?.name || data.fileName || '';
      const fileLabel = fileName
        ? size && size !== '-'
          ? `${fileName} (${size})`
          : fileName
        : '첨부된 파일 없음';
      const fileClass = fileName ? '' : ' is-empty';
      const shell = window.PomsHomeArchiveShell;

      const contentHtml = `
        <div class="detail-shell home-board-detail">
          <section class="detail-section" aria-labelledby="homeLawDetailSectionTitle">
            <div class="detail-section__head">
              <div class="type3-section-title">
                <span class="type3-section-title__icon" aria-hidden="true">
                  <img src="${ICON_TITLE}" alt="" width="24" height="24">
                </span>
                <h3 class="detail-section__title" id="homeLawDetailSectionTitle">${escapeHtml(categoryLabel)} 상세</h3>
              </div>
              <p class="detail-section__note">※ 자료의 제목·내용·첨부파일을 확인합니다.</p>
            </div>

            <div class="fac-add-body notice-detail-body">
              <div class="fac-add-grid notice-detail-grid">
                <div class="fac-add-field fac-add-field--full">
                  <div class="fac-add-field__label">구분</div>
                  <div class="fac-add-field__control">
                    <input type="text" class="fac-add-input" value="${escapeHtml(categoryLabel)}" readonly>
                  </div>
                </div>

                <div class="fac-add-field fac-add-field--full">
                  <div class="fac-add-field__label">제목</div>
                  <div class="fac-add-field__control">
                    <input type="text" class="fac-add-input" value="${escapeHtml(titleText)}" readonly>
                  </div>
                </div>

                <div class="fac-add-field">
                  <div class="fac-add-field__label">등록자</div>
                  <div class="fac-add-field__control">
                    <input type="text" class="fac-add-input" value="${escapeHtml(writer)}" readonly>
                  </div>
                </div>
                <div class="fac-add-field">
                  <div class="fac-add-field__label">등록일</div>
                  <div class="fac-add-field__control">
                    <input type="text" class="fac-add-input" value="${escapeHtml(date)}" readonly>
                  </div>
                </div>
                <div class="fac-add-field fac-add-field--full">
                  <div class="fac-add-field__label">파일크기</div>
                  <div class="fac-add-field__control">
                    <input type="text" class="fac-add-input" value="${escapeHtml(size)}" readonly>
                  </div>
                </div>

                <div class="fac-add-field fac-add-field--full notice-detail-field--content">
                  <div class="fac-add-field__label">내용</div>
                  <div class="fac-add-field__control">
                    <div class="fac-add-input notice-detail-content">${escapeHtml(plainDesc || '-')}</div>
                  </div>
                </div>

                <div class="fac-add-field fac-add-field--full">
                  <div class="fac-add-field__label">첨부파일</div>
                  <div class="fac-add-field__control notice-detail-file">
                    <div class="notice-file-picker">
                      <img src="${ICON_FILE}" alt="" width="18" height="18">
                      <a href="#" class="notice-file-link${fileClass}" data-board-file="${escapeHtml(fileName)}">${escapeHtml(fileLabel)}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      `;

      bodyEl.innerHTML = shell?.wrapDetail
        ? shell.wrapDetail({
            activeKey: 'law',
            listLabel: LIST_LABEL,
            detailLabel: titleText || '게시판 상세',
            contentHtml,
          })
        : contentHtml;

      if (listItem?.tab) currentTab = listItem.tab;
    }

    function openDetail(id) {
      const resolved = resolveDetail(id);
      if (!resolved?.data) return;
      isDetail = true;
      PomsHomeViews.showView({
        key: 'law',
        title: '게시판 상세',
        listLabel: LIST_LABEL,
        isDetail: true,
        hideChrome: true,
        id: String(id),
        render: () => renderDetail(id),
      });
    }

    function openList(resetSearch = false) {
      if (resetSearch) {
        listKeyword = '';
        listPage = 1;
        currentTab = 'law';
      }
      isDetail = false;
      PomsHomeViews.showView({
        key: 'law',
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

      const fileLink = e.target.closest('[data-board-file]');
      if (fileLink) {
        e.preventDefault();
        const name = fileLink.getAttribute('data-board-file') || '';
        if (!name) return;
        alert('첨부파일 다운로드 기능은 샘플입니다.');
        return;
      }

      const row = e.target.closest('tr[data-board-id]');
      if (row) {
        e.preventDefault();
        openDetail(row.dataset.boardId);
      }
    });

    bodyEl.addEventListener('keydown', (e) => {
      const row = e.target.closest('tr[data-board-id]');
      if (!row) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetail(row.dataset.boardId);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || PomsHomeViews.getCurrentKey() !== 'law') return;
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

    board.querySelectorAll('.board__link[data-law-id]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openDetail(el.dataset.lawId);
      });
    });

    window.PomsHomeLaw = { openList, openDetail };
  });
})();
