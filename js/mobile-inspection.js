/**

 * POMS 모바일 — 정기안전점검 목록

 */

(() => {

  const listEl = document.getElementById('mobileInspList');

  const countEl = document.getElementById('mobileInspCount');

  const filters = document.querySelectorAll('.mobile-insp__filter');

  const subnavItems = document.querySelectorAll('.mobile-subnav__item');

  const filtersWrap = document.getElementById('mobileInspFilters');

  const panelList = document.getElementById('mobileInspPanelList');

  const panelLocation = document.getElementById('mobileInspPanelLocation');

  const panelKeyword = document.getElementById('mobileInspPanelKeyword');

  const keywordInput = document.getElementById('mobileInspKeywordInput');

  const keywordSearchBtn = document.getElementById('mobileInspKeywordSearch');
  const keywordListEl = document.getElementById('mobileInspKeywordList');
  const keywordCountEl = document.getElementById('mobileInspKeywordCount');
  const kwAgencySel = document.getElementById('mobileInspKwAgency');
  const kwPortSel = document.getElementById('mobileInspKwPort');
  const kwFacilityKindSel = document.getElementById('mobileInspKwFacilityKind');
  const kwKindClassSel = document.getElementById('mobileInspKwKindClass');
  const kwSortSel = document.getElementById('mobileInspKwSort');

  const locDistanceSel = document.getElementById('mobileInspLocDistance');
  const locFacilitySel = document.getElementById('mobileInspLocFacility');
  const locConfirmBtn = document.getElementById('mobileInspLocConfirm');



  if (!listEl || typeof MOBILE_INSPECTION_ITEMS === 'undefined') return;



  let activeFilter = 'all';

  let activeSubnav = 'progress';

  let locationSearched = false;

  let keywordSearched = false;



  const badgeLabel = {

    submit: '제출',

    unsubmit: '미제출',

    draft: '임시저장',

  };



  const statusIcon = {

    submit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>`,

    draft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,

    unsubmit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 12h12"/></svg>`,

    empty: '',

  };



  const filterItems = () => {

    if (activeFilter === 'all') return MOBILE_INSPECTION_ITEMS;

    return MOBILE_INSPECTION_ITEMS.filter((item) => item.status === activeFilter);

  };



  const renderPeriodBar = (periods) => {

    if (!periods?.length) return '';



    return `

      <div class="mobile-insp-card__status-bar">

        ${periods

          .map(

            ({ label, state }) => `

          <div class="mobile-insp-card__status-item">

            <span class="mobile-insp-card__status-icon mobile-insp-card__status-icon--${state}">${statusIcon[state] || statusIcon.unsubmit}</span>

            <span class="mobile-insp-card__status-label">${label}</span>

          </div>`

          )

          .join('')}

      </div>`;

  };



  const renderCard = (item, options = {}) => {

    const badgeKey = item.badge || (item.status === 'done' ? 'submit' : 'unsubmit');

    const vulnerableTag = item.vulnerable

      ? '<span class="mobile-insp-card__tag mobile-insp-card__tag--vulnerable">취약</span>'

      : '';

    const distBadge = options.distance

      ? `<span class="mobile-insp-card__dist">${options.distance}</span>`

      : `<span class="mobile-insp-card__badge mobile-insp-card__badge--${badgeKey}">${badgeLabel[badgeKey]}</span>`;



    return `

      <li>

        <a href="inspection-form.html?id=${item.id}" class="mobile-insp-card mobile-insp-card--${item.status}" data-insp-id="${item.id}">

          <p class="mobile-insp-card__location">${item.location}</p>

          <div class="mobile-insp-card__head">

            <h2 class="mobile-insp-card__name">${item.name}</h2>

            ${distBadge}

          </div>

          <div class="mobile-insp-card__tags">

            ${vulnerableTag}

            <span class="mobile-insp-card__tag">${item.kind}</span>

            <span class="mobile-insp-card__tag mobile-insp-card__tag--type">${item.type}</span>

          </div>

          ${renderPeriodBar(item.periods)}

          <div class="mobile-insp-card__track" aria-hidden="true"><span class="mobile-insp-card__track-fill"></span></div>

        </a>

      </li>`;

  };



  const renderList = () => {

    const items = filterItems();

    if (countEl) countEl.textContent = `총 ${items.length}건`;



    if (!items.length) {

      listEl.innerHTML = '<li class="mobile-insp__empty">해당하는 점검 항목이 없습니다.</li>';

      return;

    }



    listEl.innerHTML = items.map((item) => renderCard(item)).join('');

  };



  const renderLocationCard = (item) => {
    const badgeKey = item.badge || 'unsubmit';
    const highlight = item.highlight ? ' mobile-insp-loc-card--highlight' : '';

    return `
      <li>
        <a href="inspection-form.html?id=${item.id}" class="mobile-insp-loc-card${highlight}">
          <div class="mobile-insp-loc-card__main">
            <div class="mobile-insp-loc-card__breadcrumb">${item.location}</div>
            <div class="mobile-insp-loc-card__name">${item.name}</div>
            <div class="mobile-insp-loc-card__tags">
              <span class="mobile-insp-loc-tag">${item.kind}</span>
              <span class="mobile-insp-loc-tag">${item.type}</span>
            </div>
          </div>
          <div class="mobile-insp-loc-card__aside">
            <span class="mobile-insp-card__badge mobile-insp-card__badge--${badgeKey}">${badgeLabel[badgeKey]}</span>
            <span class="mobile-insp-loc-card__dist">${item.distance}</span>
          </div>
        </a>
      </li>`;
  };

  const clearNearby = () => {
    const nearbyList = document.getElementById('mobileInspNearbyList');
    if (nearbyList) nearbyList.innerHTML = '';
    locationSearched = false;
  };

  const clearKeywordResults = () => {
    if (keywordListEl) keywordListEl.innerHTML = '';
    if (keywordCountEl) keywordCountEl.textContent = '검색 결과';
    keywordSearched = false;
  };

  const renderNearby = () => {
    const nearbyList = document.getElementById('mobileInspNearbyList');
    if (!nearbyList || typeof MOBILE_INSPECTION_NEARBY === 'undefined') return;

    locationSearched = true;

    const maxDist = Number(locDistanceSel?.value || 500);
    const facilityType = locFacilitySel?.value || '';

    const items = MOBILE_INSPECTION_NEARBY.filter((item) => {
      if (item.distanceM > maxDist) return false;
      if (facilityType && facilityType !== 'all' && item.facilityType !== facilityType) return false;
      return true;
    });

    if (!items.length) {
      nearbyList.innerHTML = '<li class="mobile-insp__empty">조건에 맞는 시설물이 없습니다.</li>';
      return;
    }

    nearbyList.innerHTML = items.map((item) => renderLocationCard(item)).join('');
  };



  const renderKeywordCard = (item) => {
    const badgeKey = item.badge || 'unsubmit';
    return `
      <li>
        <a href="inspection-form.html?id=${item.id}" class="mobile-insp-kw-card">
          <div class="mobile-insp-kw-card__main">
            <div class="mobile-insp-kw-card__breadcrumb">${item.location}</div>
            <div class="mobile-insp-kw-card__name">${item.name}</div>
            <div class="mobile-insp-kw-card__tags">
              <span class="mobile-insp-kw-tag">${item.kind}</span>
              <span class="mobile-insp-kw-tag">${item.type}</span>
            </div>
          </div>
          <div class="mobile-insp-kw-card__aside">
            <span class="mobile-insp-card__badge mobile-insp-card__badge--${badgeKey}">${badgeLabel[badgeKey]}</span>
            <span class="mobile-insp-kw-card__date">${item.date}</span>
          </div>
        </a>
      </li>`;
  };

  const renderKeywordResults = () => {
    if (!keywordListEl || typeof MOBILE_INSPECTION_KEYWORD === 'undefined') return;

    keywordSearched = true;

    const q = String(keywordInput?.value || '').trim().toLowerCase();
    const agency = kwAgencySel?.value || '';
    const port = kwPortSel?.value || '';
    const facilityKind = kwFacilityKindSel?.value || '';
    const kindClass = kwKindClassSel?.value || '';

    let items = MOBILE_INSPECTION_KEYWORD.filter((item) => {
      if (agency && item.agency !== agency) return false;
      if (port && item.port !== port) return false;
      if (facilityKind && item.facilityKind !== facilityKind) return false;
      if (kindClass && item.kindClass !== kindClass) return false;
      if (!q || q === '전체') return true;
      const haystack = [item.name, item.location, item.kind, item.type, ...(item.keywords || [])].join(' ').toLowerCase();
      return haystack.includes(q);
    });

    const sortOrder = kwSortSel?.value || 'latest';
    items = items.slice().sort((a, b) => {
      if (sortOrder === 'oldest') return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });

    if (keywordCountEl) {
      keywordCountEl.textContent = items.length ? `검색 결과 ${items.length}건` : '검색 결과 0건';
    }

    if (!items.length) {
      keywordListEl.innerHTML = '<li class="mobile-insp__empty">검색 결과가 없습니다.</li>';
      return;
    }

    keywordListEl.innerHTML = items.map((item) => renderKeywordCard(item)).join('');
  };



  const setSubnav = (mode) => {

    activeSubnav = mode;



    subnavItems.forEach((btn) => {

      btn.classList.toggle('mobile-subnav__item--active', btn.dataset.subnav === mode);

    });



    const isProgress = mode === 'progress';

    filtersWrap?.classList.toggle('is-hidden', !isProgress);

    if (panelList) panelList.hidden = !isProgress;

    if (panelLocation) panelLocation.hidden = mode !== 'location';

    if (panelKeyword) panelKeyword.hidden = mode !== 'search';



    if (mode === 'progress') {

      if (countEl) countEl.hidden = false;

      renderList();

      return;

    }



    if (countEl) countEl.hidden = true;



    if (mode === 'location') {
      clearNearby();
      return;
    }

    if (mode === 'search') {
      clearKeywordResults();
      keywordInput?.focus();
    }

  };



  filters.forEach((btn) => {

    btn.addEventListener('click', () => {

      activeFilter = btn.dataset.filter || 'all';

      filters.forEach((b) => {

        b.classList.toggle('is-active', b === btn);

        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');

      });

      setSubnav('progress');

    });

  });



  subnavItems.forEach((btn) => {

    btn.addEventListener('click', () => {

      const mode = btn.dataset.subnav || 'progress';



      if (mode === 'progress') {

        activeFilter = 'progress';

        filters.forEach((b) => {

          const on = b.dataset.filter === 'progress';

          b.classList.toggle('is-active', on);

          b.setAttribute('aria-selected', on ? 'true' : 'false');

        });

      }



      setSubnav(mode);

    });

  });



  keywordSearchBtn?.addEventListener('click', renderKeywordResults);
  kwSortSel?.addEventListener('change', () => {
    if (keywordSearched) renderKeywordResults();
  });
  keywordInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      renderKeywordResults();
    }
  });



  locConfirmBtn?.addEventListener('click', renderNearby);



  setSubnav('progress');

})();


