/**
 * POMS 모바일 사이드 드로어
 */
(() => {
  const drawer = document.getElementById('mobileDrawer');
  const panel = document.getElementById('mobileDrawerPanel');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  const menuBtn = document.getElementById('mobileMenuBtn');
  const dateEl = document.getElementById('mobileDrawerDate');

  if (!drawer || !menuBtn) return;

  const syncDrawerLayout = () => {
    const app = document.querySelector('.mobile-app');
    const header = document.querySelector('.mobile-header');
    const bottomBar = document.querySelector('.mobile-bottom-nav, .mobile-subnav, .mobile-form__footer');

    if (header) {
      document.documentElement.style.setProperty('--mobile-header-h', `${header.offsetHeight}px`);
    }

    const drawerOpen = document.body.classList.contains('mobile-drawer-open');
    document.documentElement.style.setProperty(
      '--mobile-bottom-bar-h',
      drawerOpen || !bottomBar ? '0px' : `${bottomBar.offsetHeight}px`
    );

    if (!app) {
      drawer.style.cssText = '';
      return;
    }

    if (window.innerWidth >= 431) {
      const rect = app.getBoundingClientRect();
      drawer.style.inset = 'auto';
      drawer.style.top = `${rect.top}px`;
      drawer.style.left = `${rect.left}px`;
      drawer.style.width = `${rect.width}px`;
      drawer.style.height = `${rect.height}px`;
    } else {
      drawer.style.inset = '0';
      drawer.style.top = '';
      drawer.style.left = '';
      drawer.style.width = '';
      drawer.style.height = '';
    }
  };

  syncDrawerLayout();
  window.addEventListener('resize', syncDrawerLayout);

  if (dateEl) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    dateEl.textContent = `${y}.${m}.${d}`;
  }

  const onScroll = () => {
    if (drawer.classList.contains('is-open')) syncDrawerLayout();
  };

  const open = () => {
    document.body.classList.add('mobile-drawer-open');
    syncDrawerLayout();
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', '메뉴 닫기');
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  const close = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', '메뉴 열기');
    document.body.classList.remove('mobile-drawer-open');
    syncDrawerLayout();
    window.removeEventListener('scroll', onScroll);
    menuBtn.focus();
  };

  const toggle = () => {
    if (drawer.classList.contains('is-open')) close();
    else open();
  };

  menuBtn.addEventListener('click', toggle);
  backdrop?.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });

  panel?.querySelectorAll('.mobile-drawer__link[data-mobile-soon]').forEach((link) => {
    link.addEventListener('click', () => close());
  });
})();
