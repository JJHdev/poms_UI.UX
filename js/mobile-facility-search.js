(() => {
  const subnavItems = document.querySelectorAll('.mobile-insp__filter[data-fac-mode]');
  const panelLocation = document.getElementById('mobileFacPanelLocation');
  const panelKeyword = document.getElementById('mobileFacPanelKeyword');

  const keywordInput = document.getElementById('mobileFacKeywordInput');
  const keywordSearchBtn = document.getElementById('mobileFacKeywordSearch');
  const keywordListEl = document.getElementById('mobileFacKeywordList');
  const keywordCountEl = document.getElementById('mobileFacKeywordCount');
  const kwAgencySel = document.getElementById('mobileFacKwAgency');
  const kwPortSel = document.getElementById('mobileFacKwPort');
  const kwFacilityKindSel = document.getElementById('mobileFacKwFacilityKind');
  const kwKindClassSel = document.getElementById('mobileFacKwKindClass');
  const kwSortSel = document.getElementById('mobileFacKwSort');

  const locDistanceSel = document.getElementById('mobileFacLocDistance');
  const locFacilitySel = document.getElementById('mobileFacLocFacility');
  const locConfirmBtn = document.getElementById('mobileFacLocConfirm');
  const nearbyList = document.getElementById('mobileFacNearbyList');

  if (!panelLocation || typeof MOBILE_FACILITY_NEARBY === 'undefined') return;

  let activeMode = 'location';

  let locationSearched = false;

  let keywordSearched = false;

  const detailHref = '../facility-detail.html';

  const clearNearby = () => {
    if (nearbyList) nearbyList.innerHTML = '';
    locationSearched = false;
  };

  const clearKeywordResults = () => {
    if (keywordListEl) keywordListEl.innerHTML = '';
    if (keywordCountEl) keywordCountEl.textContent = '검색 결과';
    keywordSearched = false;
  };

  const renderLocationCard = (item) => {
    const highlight = item.highlight ? ' mobile-insp-loc-card--highlight' : '';
    return `
      <li>
        <a href="${detailHref}" class="mobile-insp-loc-card${highlight}">
          <div class="mobile-insp-loc-card__main">
            <div class="mobile-insp-loc-card__breadcrumb">${item.location}</div>
            <div class="mobile-insp-loc-card__name">${item.name}</div>
            <div class="mobile-insp-loc-card__tags">
              <span class="mobile-insp-loc-tag">${item.kind}</span>
              <span class="mobile-insp-loc-tag">${item.type}</span>
            </div>
          </div>
          <div class="mobile-insp-loc-card__aside">
            <span class="mobile-insp-loc-card__dist">${item.distance}</span>
          </div>
        </a>
      </li>`;
  };

  const renderKeywordCard = (item) => {
    return `
      <li>
        <a href="${detailHref}" class="mobile-insp-kw-card">
          <div class="mobile-insp-kw-card__main">
            <div class="mobile-insp-kw-card__breadcrumb">${item.location}</div>
            <div class="mobile-insp-kw-card__name">${item.name}</div>
            <div class="mobile-insp-kw-card__tags">
              <span class="mobile-insp-kw-tag">${item.kind}</span>
              <span class="mobile-insp-kw-tag">${item.type}</span>
            </div>
          </div>
          <div class="mobile-insp-kw-card__aside">
            <span class="mobile-fac-grade mobile-fac-grade--${item.grade.toLowerCase()}">${item.grade}등급</span>
            <span class="mobile-insp-kw-card__date">${item.year}</span>
          </div>
        </a>
      </li>`;
  };

  const renderNearby = () => {
    if (!nearbyList) return;

    locationSearched = true;

    const maxDist = Number(locDistanceSel?.value || 500);
    const facilityType = locFacilitySel?.value || '';

    const items = MOBILE_FACILITY_NEARBY.filter((item) => {
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

  const renderKeywordResults = () => {
    if (!keywordListEl || typeof MOBILE_FACILITY_KEYWORD === 'undefined') return;

    keywordSearched = true;

    const q = String(keywordInput?.value || '').trim().toLowerCase();
    const agency = kwAgencySel?.value || '';
    const port = kwPortSel?.value || '';
    const facilityKind = kwFacilityKindSel?.value || '';
    const kindClass = kwKindClassSel?.value || '';

    let items = MOBILE_FACILITY_KEYWORD.filter((item) => {
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
      if (sortOrder === 'oldest') return a.year.localeCompare(b.year);
      return b.year.localeCompare(a.year);
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

  const activateMode = (mode) => {
    activeMode = mode;
    subnavItems.forEach((btn) => {
      const isActive = btn.dataset.facMode === mode;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    if (panelLocation) panelLocation.hidden = mode !== 'location';
    if (panelKeyword) panelKeyword.hidden = mode !== 'keyword';
    if (mode === 'location') clearNearby();
    if (mode === 'keyword') {
      clearKeywordResults();
      keywordInput?.focus();
    }
  };

  subnavItems.forEach((btn) => {
    btn.addEventListener('click', () => activateMode(btn.dataset.facMode || 'location'));
  });

  locConfirmBtn?.addEventListener('click', renderNearby);
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

  activateMode('location');
})();
