/**
 * POMS 공통 푸터 (관련 사이트 + 주소/저작권)
 * 자동 mount. 이미 .site-footer 가 있으면 건너뜁니다.
 */
const PomsSiteFooter = (() => {
  const GROUPS = typeof RELATED_SITES_GROUPS !== 'undefined' ? RELATED_SITES_GROUPS : [
    {
      id: 'mof',
      label: '해양수산부 기관 사이트',
      items: [
        { name: '해양수산부', url: '#' },
        { name: '부산지방해양수산청', url: '#' },
        { name: '인천지방해양수산청', url: '#' },
        { name: '여수지방해양수산청', url: '#' },
        { name: '마산지방해양수산청', url: '#' },
        { name: '동해지방해양수산청', url: '#' },
        { name: '군산지방해양수산청', url: '#' },
        { name: '목포지방해양수산청', url: '#' },
        { name: '포항지방해양수산청', url: '#' },
        { name: '평택지방해양수산청', url: '#' },
        { name: '울산지방해양수산청', url: '#' },
        { name: '대산지방해양수산청', url: '#' },
      ],
    },
    {
      id: 'gov',
      label: '지자체 및 공공기관 사이트',
      items: [
        { name: '부산광역시', url: '#' },
        { name: '강원도 환동해본부', url: '#' },
        { name: '충청남도', url: '#' },
        { name: '전라남도', url: '#' },
        { name: '경상남도', url: '#' },
        { name: '제주특별자치도', url: '#' },
        { name: '부산항만공사(BPA)', url: '#' },
        { name: '인천항만공사(IPA)', url: '#' },
        { name: '여수광양항만공사(UPA)', url: '#' },
        { name: '울산항만공사(YGPA)', url: '#' },
      ],
    },
    {
      id: 'etc',
      label: '기타 관련기관 사이트',
      items: [
        { name: '한국건설기술인협회', url: '#' },
        { name: '시설물통합정보관리시스템(FMS)', url: '#' },
        { name: '국토안전관리원 인재교육센터', url: '#' },
        { name: '한국어촌어항공단', url: '#' },
        { name: '해운항만물류정보시스템', url: '#' },
      ],
    },
    {
      id: 'port',
      label: '항만협회 관련 사이트',
      items: [
        { name: '한국항만협회', url: '#' },
        { name: '항만건설사업정보시스템', url: '#' },
        { name: '항만기술기준정보시스템', url: '#' },
        { name: '항만시설장비관리시스템', url: '#' },
        { name: '해외항만개발정보시스템', url: '#' },
        { name: '전국파랑관측자료제공시스템', url: '#' },
        { name: '항만지진계측시스템', url: '#' },
      ],
    },
  ];

  function assetBase() {
    const script = document.currentScript || document.querySelector('script[src*="site-footer.js"]');
    if (script?.src) {
      return script.src.replace(/js\/site-footer\.js(?:\?.*)?$/i, '');
    }
    const path = (location.pathname || '').replace(/\\/g, '/');
    if (/\/mobile\//.test(path) || /\/assets\//.test(path)) return '../';
    return '';
  }

  function shouldSkip() {
    const params = new URLSearchParams(location.search);
    if (params.get('embed') === '1' || params.get('popup') === '1') return true;
    if (/\/mobile\//i.test(location.pathname || '')) return true;
    if (document.body?.classList.contains('is-embed')) return true;
    if (document.querySelector('.site-footer') && !document.querySelector('.poms-site-footer')) return true;
    if (document.querySelector('.poms-site-footer')) return true;
    return false;
  }

  function injectCss(base) {
    if (document.querySelector('link[data-poms-site-footer]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${base}css/site-footer.css`;
    link.dataset.pomsSiteFooter = '1';
    document.head.appendChild(link);
  }

  function bindSelects(root) {
    root.querySelectorAll('.related-sites-bar__select').forEach((select) => {
      select.addEventListener('change', () => {
        if (!select.value) return;
        const [groupId, indexText] = select.value.split(':');
        const group = GROUPS.find((g) => g.id === groupId);
        const item = group?.items[Number(indexText)];
        select.selectedIndex = 0;
        if (!item) return;
        if (item.url && item.url !== '#') {
          window.open(item.url, '_blank', 'noopener');
        } else {
          alert(`${item.name} 사이트로 이동합니다. (URL 연결 예정)`);
        }
      });
    });
  }

  function render(base) {
    const selects = GROUPS.map((group) => `
      <label class="related-sites-bar__field">
        <span class="sr-only">${group.label}</span>
        <select class="related-sites-bar__select" data-group="${group.id}" aria-label="${group.label}">
          <option value="">${group.label}</option>
          ${group.items.map((item, index) => `<option value="${group.id}:${index}">${item.name}</option>`).join('')}
        </select>
      </label>
    `).join('');

    return `
      <div class="related-sites-bar" aria-label="관련 사이트">
        <div class="related-sites-bar__inner">
          <strong class="related-sites-bar__title">관련 사이트</strong>
          <div class="related-sites-bar__selects">${selects}</div>
        </div>
      </div>
      <footer class="site-footer">
        <div class="site-footer__inner">
          <a href="#" class="site-footer__logo" aria-label="해양수산부">
            <img src="${base}assets/Layer_1.svg" alt="해양수산부" class="site-footer__logo-img site-footer__logo-img--full" width="134" height="38">
          </a>
          <div class="site-footer__info">
            <p class="site-footer__address">본관 : (48789) 부산광역시 동구 중앙대로 361번길 14(수정동) 아이엠빌딩 해양수산부</p>
            <p class="site-footer__address">별관 : (48728) 부산광역시 동구 중앙대로 360(수정동) 협성타워 해양수산부</p>
            <p class="site-footer__copy">Copyright © Ministry of Oceans and Fisheries. All rights reserved.</p>
          </div>
          <div class="site-footer__links">
            <a href="${base}privacy-policy.html" class="site-footer__privacy">개인정보처리방침</a>
            <a href="#" class="site-footer__terms" hidden>이용약관</a>
          </div>
        </div>
      </footer>
    `;
  }

  function mount() {
    if (shouldSkip()) return;
    const base = assetBase();
    injectCss(base);

    const wrap = document.createElement('div');
    wrap.className = 'poms-site-footer';
    wrap.innerHTML = render(base);
    document.body.appendChild(wrap);
    bindSelects(wrap);
  }

  function boot() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mount);
    } else {
      mount();
    }
  }

  boot();
  return { mount };
})();
