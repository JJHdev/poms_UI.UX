/**
 * index.html — 자료실 공통 LNB/브레드크럼/상세 (Figma 259:5033, 259:5258)
 */
(function () {
  const ICON_HOME = 'assets/main/facility-statistics/figma188/icon-home-clean.svg';
  const ICON_BACK = 'assets/main/facility-statistics/figma188/icon-angle-down-clean.svg';
  const ICON_CHEVRON = 'assets/main/facility-search/figma224/icon-lnb-chevron.svg';
  const ICON_FILTER = 'assets/main/facility-statistics/figma188/icon-title-clean.svg';
  const ICON_TITLE = 'assets/main/facility-statistics/figma188/icon-title-clean.svg';
  const ICON_FILE = 'assets/main/safety-report/icon-download.svg';

  const MENU = [
    { key: 'notice', label: '공지사항', href: '#/notice' },
    { key: 'law', label: '게시판', href: '#/law' },
  ];

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDateOnly(value) {
    return String(value || '')
      .trim()
      .replace(/\s+\d{1,2}:\d{2}(:\d{2})?$/, '');
  }

  function formatFileSize(size) {
    return String(size || '').replace(/\s+/g, '');
  }

  function renderLnb(activeKey) {
    const items = MENU.map((item) => {
      const active = item.key === activeKey;
      return `
        <a class="home-facility-lnb__item${active ? ' is-active' : ''}"
           href="${item.href}"
           data-home-view="${item.key}"
           ${active ? 'aria-current="page"' : ''}>
          <span>${escapeHtml(item.label)}</span>
          <img class="home-facility-lnb__chevron" src="${ICON_CHEVRON}" alt="" width="16" height="16">
        </a>`;
    }).join('');

    return `
      <aside class="home-facility-lnb" aria-label="자료실 메뉴">
        <div class="home-facility-lnb__title">
          <span class="home-facility-lnb__title-text">자료실</span>
        </div>
        <nav class="home-facility-lnb__nav">${items}</nav>
      </aside>`;
  }

  function renderCrumb(currentLabel) {
    return `
      <header class="home-facility-crumb">
        <button type="button" class="home-facility-crumb__home" data-action="home" aria-label="홈으로">
          <img src="${ICON_HOME}" alt="" width="18" height="18">
        </button>
        <p class="home-facility-crumb__path">
          <span class="home-facility-crumb__parent">자료실 &gt;</span>
          <span class="home-facility-crumb__current">${escapeHtml(currentLabel)}</span>
        </p>
      </header>`;
  }

  function renderDetailCrumb(listLabel, detailLabel) {
    return `
      <header class="home-facility-crumb home-archive-detail-crumb">
        <div class="home-archive-detail-crumb__actions">
          <button type="button" class="home-archive-detail-crumb__back" data-action="back" aria-label="이전">
            <img src="${ICON_BACK}" alt="" width="16" height="16">
          </button>
          <button type="button" class="home-facility-crumb__home" data-action="home" aria-label="홈으로">
            <img src="${ICON_HOME}" alt="" width="18" height="18">
          </button>
        </div>
        <p class="home-facility-crumb__path">
          <span class="home-facility-crumb__parent">자료실 &gt; ${escapeHtml(listLabel)} &gt;</span>
          <span class="home-facility-crumb__current">${escapeHtml(detailLabel)}</span>
        </p>
      </header>`;
  }

  function renderSectionTitle(title) {
    return `
      <div class="home-archive-section-title">
        <span class="home-archive-section-title__icon" aria-hidden="true">
          <img src="${ICON_FILTER}" alt="" width="24" height="24">
        </span>
        <h2 class="home-archive-section-title__text">${escapeHtml(title)}</h2>
      </div>`;
  }

  /**
   * @param {object} opts
   * @param {string} opts.title
   * @param {boolean} [opts.showNew]
   * @param {string} opts.author
   * @param {string} opts.periodLabel
   * @param {string} opts.period
   * @param {string} opts.date
   * @param {string|number} opts.views
   * @param {string} opts.bodyHtml
   * @param {{name:string,size:string}|null} [opts.file]
   * @param {string} [opts.titleId]
   */
  function renderDetailPanel(opts) {
    const {
      title,
      showNew = false,
      author,
      periodLabel,
      period,
      date,
      views,
      bodyHtml,
      file,
      titleId = 'homeArchiveDetailTitle',
    } = opts;

    const newBadge = showNew
      ? '<span class="home-archive-board__new">NEW</span>'
      : '';

    const fileHtml = file
      ? `<a href="#" class="home-archive-detail__file-link" onclick="return false">
           <img src="${ICON_FILE}" alt="" width="16" height="16">
           <span>${escapeHtml(file.name)} (${escapeHtml(formatFileSize(file.size))})</span>
         </a>`
      : `<span class="home-archive-detail__file-empty">첨부된 파일 없음</span>`;

    return `
      <section class="home-archive-detail" aria-labelledby="${titleId}">
        <div class="home-archive-detail__heading">
          <span class="home-archive-section-title__icon" aria-hidden="true">
            <img src="${ICON_TITLE}" alt="" width="24" height="24">
          </span>
          <div class="home-archive-detail__title-wrap">
            <h1 class="home-archive-detail__title" id="${titleId}">${escapeHtml(title)}</h1>
            ${newBadge}
          </div>
        </div>

        <div class="home-archive-detail__panel">
          <div class="home-archive-detail__meta">
            <div class="home-archive-detail__meta-item home-archive-detail__meta-item--author">
              <div class="home-archive-detail__label">작성자</div>
              <div class="home-archive-detail__value">${escapeHtml(author)}</div>
            </div>
            <div class="home-archive-detail__meta-item home-archive-detail__meta-item--period">
              <div class="home-archive-detail__label">${escapeHtml(periodLabel)}</div>
              <div class="home-archive-detail__value">${escapeHtml(period || '-')}</div>
            </div>
            <div class="home-archive-detail__meta-item home-archive-detail__meta-item--date">
              <div class="home-archive-detail__label">작성일</div>
              <div class="home-archive-detail__value">${escapeHtml(formatDateOnly(date))}</div>
            </div>
            <div class="home-archive-detail__meta-item home-archive-detail__meta-item--views">
              <div class="home-archive-detail__label">조회수</div>
              <div class="home-archive-detail__value">${escapeHtml(views)}</div>
            </div>
          </div>

          <div class="home-archive-detail__content-label">내용</div>
          <div class="home-archive-detail__content">${bodyHtml || ''}</div>

          <div class="home-archive-detail__file">
            <div class="home-archive-detail__label">첨부파일</div>
            <div class="home-archive-detail__value home-archive-detail__value--file">${fileHtml}</div>
          </div>
        </div>
      </section>`;
  }

  function wrap({ activeKey, currentLabel, contentHtml }) {
    return `
      <div class="home-facility-layout home-archive-layout">
        ${renderLnb(activeKey)}
        <div class="home-facility-main home-archive-main">
          ${renderCrumb(currentLabel)}
          ${contentHtml}
        </div>
      </div>`;
  }

  function wrapDetail({ activeKey, listLabel, detailLabel, contentHtml }) {
    return `
      <div class="home-facility-layout home-archive-layout">
        ${renderLnb(activeKey)}
        <div class="home-facility-main home-archive-main">
          ${renderDetailCrumb(listLabel, detailLabel)}
          ${contentHtml}
        </div>
      </div>`;
  }

  window.PomsHomeArchiveShell = {
    MENU,
    wrap,
    wrapDetail,
    renderSectionTitle,
    renderDetailPanel,
    formatDateOnly,
    formatFileSize,
  };
})();
