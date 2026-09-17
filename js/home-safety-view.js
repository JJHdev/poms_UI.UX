/**
 * index.html — 안전등급 현황 (항만시설물 정보와 동일 레이아웃)
 */
(function () {
  function formatBaselineDate(raw) {
    if (!raw) return '2026-06-01';
    return String(raw)
      .replace(/^(\d{4})\.(\d{2})\.(\d{2})$/, '$1-$2-$3')
      .replace(/^(\d{4})\.(\d{2})$/, '$1-$2-01');
  }

  function renderSafetyPage(bodyEl) {
    const baselineDate = formatBaselineDate(
      typeof HOME_SAFETY_GRADE_STATS !== 'undefined' ? HOME_SAFETY_GRADE_STATS.baseline : ''
    );

    bodyEl.innerHTML = `
      <div class="home-facility-layout">
        <aside class="home-facility-lnb" aria-label="안전등급 현황 메뉴">
          <div class="home-facility-lnb__title">
            <span class="home-facility-lnb__title-text">안전등급 현황</span>
          </div>
          <nav class="home-facility-lnb__nav">
            <a class="home-facility-lnb__item is-active" href="#/safety" data-home-view="safety" aria-current="page">
              <span>안전등급현황</span>
              <img class="home-facility-lnb__chevron" src="assets/main/facility-search/figma224/icon-lnb-chevron.svg" alt="" width="16" height="16">
            </a>
          </nav>
        </aside>

        <div class="home-facility-main">
          <header class="home-facility-crumb">
            <button type="button" class="home-facility-crumb__home" data-action="home" aria-label="홈으로">
              <img src="assets/main/facility-statistics/figma188/icon-home-clean.svg" alt="" width="18" height="18">
            </button>
            <p class="home-facility-crumb__path">
              <span class="home-facility-crumb__parent">안전등급 현황 &gt;</span>
              <span class="home-facility-crumb__current">안전등급현황</span>
            </p>
          </header>

          <div class="home-facility-heading">
            <div class="home-facility-heading__left">
              <span class="home-facility-heading__icon" aria-hidden="true">
                <img src="assets/main/facility-statistics/figma188/icon-title-clean.svg" alt="" width="24" height="24">
              </span>
              <h1 class="home-facility-heading__title">안전등급현황</h1>
              <div class="home-facility-heading__meta">
                <span class="home-facility-heading__desc">항만시설물 안전등급 조회</span>
                <span class="home-facility-heading__badge">항만시설물 통계</span>
              </div>
            </div>
            <div class="home-facility-heading__baseline">
              <span class="home-facility-heading__baseline-label">기준일</span>
              <span class="home-facility-heading__baseline-date" id="safetyGradeStatsBaseline">${baselineDate}</span>
            </div>
          </div>

          <section class="home-facility-table-panel" aria-label="안전등급현황 통계">
            <div class="facility-stats-modal--figma facility-stats-modal--home-page">
              <div class="facility-stats-table-wrap">
                <table class="facility-stats-table facility-stats-table--safety-grade" aria-label="안전등급현황 통계">
                  <colgroup>
                    <col class="facility-stats-table__kind">
                    <col class="facility-stats-table__grade">
                    <col>
                    <col>
                    <col>
                    <col>
                    <col>
                    <col class="facility-stats-table__total">
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">종류</th>
                      <th scope="col">등급</th>
                      <th scope="col">외곽시설</th>
                      <th scope="col">계류시설</th>
                      <th scope="col">건축물</th>
                      <th scope="col">교량시설</th>
                      <th scope="col">기타</th>
                      <th scope="col">합계</th>
                    </tr>
                  </thead>
                  <tbody id="safetyGradeStatsTableBody"></tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;

    bodyEl.querySelector('[data-action="home"]')?.addEventListener('click', (event) => {
      event.preventDefault();
      PomsHomeViews?.showLanding();
    });

    if (window.PomsHomeSafetyGradeStats?.render) {
      window.PomsHomeSafetyGradeStats.render();
    }
  }

  function open() {
    if (typeof PomsHomeViews === 'undefined') return;
    PomsHomeViews.showView({
      key: 'safety',
      title: '안전등급현황',
      isDetail: false,
      hideChrome: true,
      render: renderSafetyPage,
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || PomsHomeViews?.getCurrentKey() !== 'safety') return;
      PomsHomeViews.showLanding();
    });

    window.PomsHomeSafety = { open };
  });
})();
