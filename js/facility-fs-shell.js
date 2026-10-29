/* 시설물 상세 계열 — Figma 224 LNB + 헤더 아이콘 셸 */
(function () {
  const LNB_HTML = `
    <aside class="fs-lnb" aria-label="시설물 정보 메뉴">
      <div class="fs-lnb__title">
        <span class="fs-lnb__title-text">시설물 정보</span>
      </div>
      <nav class="fs-lnb__nav">
        <a class="fs-lnb__item is-active" href="facility-search.html" aria-current="page">
          <span>시설물 통합검색</span>
          <span class="fs-lnb__chevron ico-angle ico-angle--right" aria-hidden="true">
            <span class="ico-angle__vec">
              <img src="assets/main/facility-search/detail/figma224/icon-angle-down-lnb.svg" alt="">
            </span>
          </span>
        </a>
        <a class="fs-lnb__item" href="facility-condition-search.html">
          <span>시설물 조건검색</span>
          <span class="fs-lnb__chevron ico-angle ico-angle--right" aria-hidden="true">
            <span class="ico-angle__vec">
              <img src="assets/main/facility-search/detail/figma224/icon-angle-down-lnb.svg" alt="">
            </span>
          </span>
        </a>
      </nav>
    </aside>`;

  function ensureFacilitySearchCss() {
    if (document.querySelector('link[href="css/facility-search.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/facility-search.css';
    const anchor =
      document.querySelector('link[href="css/facility-detail.css"]') ||
      document.querySelector('link[href="css/search.css"]');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(link, anchor);
    } else {
      document.head.appendChild(link);
    }
  }

  function wrapLayout(main) {
    if (main.querySelector(':scope > .fs-layout')) return;

    const layout = document.createElement('div');
    layout.className = 'fs-layout';
    layout.innerHTML = LNB_HTML;

    const content = document.createElement('div');
    content.className = 'fd-content';

    while (main.firstChild) {
      content.appendChild(main.firstChild);
    }

    layout.appendChild(content);
    main.appendChild(layout);
  }

  function upgradeHeader(main) {
    const header = main.querySelector('.page-header');
    if (!header || header.querySelector('.page-header__nav')) return;

    const back = header.querySelector('a.btn-back');
    const backHref = back?.getAttribute('href') || 'facility-detail.html';
    const backAttrs = [];
    if (back) {
      Array.from(back.attributes).forEach((attr) => {
        if (attr.name === 'href' || attr.name === 'class' || attr.name === 'aria-label') return;
        backAttrs.push(`${attr.name}="${attr.value}"`);
      });
    }

    const home = header.querySelector('a.page-header__home');
    const crumb = header.querySelector('nav.breadcrumb');

    const nav = document.createElement('div');
    nav.className = 'page-header__nav';
    nav.innerHTML = `
        <a href="${backHref}" class="btn-back" aria-label="목록으로"${backAttrs.length ? ' ' + backAttrs.join(' ') : ''}>
          <span class="ico-angle" aria-hidden="true">
            <span class="ico-angle__vec">
              <img src="assets/main/facility-search/detail/figma224/icon-angle-down.svg" alt="">
            </span>
          </span>
        </a>
        <a href="facility.html" class="page-header__home" aria-label="시설물 정보 홈">
          <span class="page-header__home-icon" aria-hidden="true">
            <span class="page-header__home-icon-roof"><img src="assets/main/facility-search/detail/figma224/icon-home-roof.svg" alt=""></span>
            <span class="page-header__home-icon-body"><img src="assets/main/facility-search/detail/figma224/icon-home-body.svg" alt=""></span>
            <span class="page-header__home-icon-door"><img src="assets/main/facility-search/detail/figma224/icon-home-door.svg" alt=""></span>
          </span>
        </a>`;

    back?.remove();
    home?.remove();
    header.insertBefore(nav, crumb || header.firstChild);
  }

  function upgradeSummaryIcon(main) {
    const icon = main.querySelector('.facility-summary__icon');
    if (!icon || icon.querySelector('.facility-summary__icon-inner')) return;
    icon.innerHTML = `
          <span class="facility-summary__icon-inner">
            <span class="facility-summary__icon-base"><img src="assets/main/facility-search/detail/figma224/icon-facility-base.svg" alt=""></span>
            <span class="facility-summary__icon-line facility-summary__icon-line--base"><img src="assets/main/facility-search/detail/figma224/icon-facility-v7.svg" alt=""></span>
            <span class="facility-summary__icon-dot facility-summary__icon-dot--1"><img src="assets/main/facility-search/detail/figma224/icon-facility-v8.svg" alt=""></span>
            <span class="facility-summary__icon-dot facility-summary__icon-dot--2"><img src="assets/main/facility-search/detail/figma224/icon-facility-v8.svg" alt=""></span>
            <span class="facility-summary__icon-dot facility-summary__icon-dot--3"><img src="assets/main/facility-search/detail/figma224/icon-facility-v8.svg" alt=""></span>
            <span class="facility-summary__icon-dot facility-summary__icon-dot--4"><img src="assets/main/facility-search/detail/figma224/icon-facility-v8.svg" alt=""></span>
            <span class="facility-summary__icon-dot facility-summary__icon-dot--5"><img src="assets/main/facility-search/detail/figma224/icon-facility-v8.svg" alt=""></span>
            <span class="facility-summary__icon-dot facility-summary__icon-dot--6"><img src="assets/main/facility-search/detail/figma224/icon-facility-v8.svg" alt=""></span>
            <span class="facility-summary__icon-frame"><img src="assets/main/facility-search/detail/figma224/icon-facility-v9.svg" alt=""></span>
          </span>`;
  }

  function upgradeMetaDivider(main) {
    main.querySelectorAll('.facility-summary__meta-divider').forEach((el) => {
      if (el.querySelector('img')) return;
      el.innerHTML =
        '<img src="assets/main/facility-search/detail/figma224/icon-meta-divider.svg" alt="" width="1" height="10">';
    });
  }

  function apply() {
    if (
      document.documentElement.classList.contains('is-embed') ||
      document.body.classList.contains('is-embed')
    ) {
      return;
    }

    const main = document.querySelector('body.facility-detail-page .main-content');
    if (!main) return;
    ensureFacilitySearchCss();
    upgradeHeader(main);
    upgradeSummaryIcon(main);
    upgradeMetaDivider(main);
    wrapLayout(main);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
