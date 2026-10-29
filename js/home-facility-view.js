/**
 * index.html — 항만시설물 정보 (Figma 259:4067)
 */
(function () {
  function renderFacilityPage(bodyEl) {
    const baselineDate =
      (typeof HOME_FACILITY_STATS !== 'undefined' && HOME_FACILITY_STATS.baselineDate) ||
      (typeof HOME_FACILITY_STATS !== 'undefined' && HOME_FACILITY_STATS.baseline
        ? String(HOME_FACILITY_STATS.baseline).replace(/^(\d{4})\.(\d{2})$/, '$1-$2-27')
        : '2022-12-27');

    bodyEl.innerHTML = `
      <div class="home-facility-layout">
        <aside class="home-facility-lnb" aria-label="항만시설물 정보 메뉴">
          <div class="home-facility-lnb__title">
            <span class="home-facility-lnb__title-text">항만시설물 정보</span>
          </div>
          <nav class="home-facility-lnb__nav">
            <a class="home-facility-lnb__item is-active" href="#/facility" data-home-view="facility" aria-current="page">
              <span>시설물 정보</span>
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
              <span class="home-facility-crumb__parent">항만시설물 정보 &gt;</span>
              <span class="home-facility-crumb__current">시설물 정보</span>
            </p>
          </header>

          <div class="home-facility-heading">
            <div class="home-facility-heading__left">
              <span class="home-facility-heading__icon" aria-hidden="true">
                <img src="assets/main/facility-statistics/figma188/icon-title-clean.svg" alt="" width="24" height="24">
              </span>
              <h1 class="home-facility-heading__title">시설물 정보</h1>
              <div class="home-facility-heading__meta">
                <span class="home-facility-heading__desc">항만 · 연안 시설물 조회</span>
                <span class="home-facility-heading__badge">항만시설물 통계</span>
              </div>
            </div>
            <div class="home-facility-heading__baseline">
              <span class="home-facility-heading__baseline-label">기준일</span>
              <span class="home-facility-heading__baseline-date" id="facilityStatsBaseline">${baselineDate}</span>
            </div>
          </div>

          <section class="home-facility-table-panel" aria-label="시설물정보 통계">
            <div class="facility-stats-modal--figma facility-stats-modal--home-page">
              <div class="facility-stats-table-wrap">
                <table class="facility-stats-table" aria-label="시설물정보 통계">
                <colgroup>
                  <col class="facility-stats-table__kind">
                  <col class="facility-stats-table__type">
                  <col class="facility-stats-table__count">
                  <col>
                  <col>
                  <col>
                </colgroup>
                <thead>
                  <tr>
                    <th colspan="3" scope="colgroup">구분</th>
                    <th rowspan="2" scope="col">국가관리</th>
                    <th rowspan="2" scope="col">지자체 관리</th>
                    <th rowspan="2" scope="col">항만공사</th>
                  </tr>
                  <tr>
                    <th scope="col">종류</th>
                    <th scope="col">시설구분</th>
                    <th scope="col">개소</th>
                  </tr>
                </thead>
                <tbody id="facilityStatsTableBody"></tbody>
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

    if (window.PomsHomeFacilityStats?.render) {
      window.PomsHomeFacilityStats.render();
    }
  }

  function open() {
    if (typeof PomsHomeViews === 'undefined') return;
    PomsHomeViews.showView({
      key: 'facility',
      title: '시설물 정보',
      isDetail: false,
      hideChrome: true,
      render: renderFacilityPage,
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || PomsHomeViews?.getCurrentKey() !== 'facility') return;
      PomsHomeViews.showLanding();
    });

    window.PomsHomeFacility = { open };
  });
})();
