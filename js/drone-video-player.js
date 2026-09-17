/**
 * 드론 영상 재생 팝업 (사용자 지도 팝업과 동일한 스타일 재사용)
 * 사용: DroneVideoPlayer.open({ title, years: [{ year, url }], selectedYear })
 *       years 미지정 시 url 단일 재생
 */
const DroneVideoPlayer = (() => {
  /* Mixkit — Aerial view of the container port in Busan (free stock) */
  const SAMPLE_URL = 'https://assets.mixkit.co/videos/30125/30125-720.mp4';
  const DEFAULT_YEARS = [2025, 2024, 2023];

  let modalEl = null;
  let playerEl = null;
  let titleEl = null;
  let yearsWrapEl = null;
  let yearSelectEl = null;
  let currentYears = [];
  let lastFocus = null;

  function ensureModal() {
    if (modalEl) return;

    modalEl = document.createElement('div');
    modalEl.id = 'drone-video-modal';
    modalEl.className = 'drone-video-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.setAttribute('aria-labelledby', 'drone-video-modal-title');
    modalEl.innerHTML = `
      <div class="drone-video-modal__backdrop" data-close-drone-video tabindex="-1" aria-hidden="true"></div>
      <div class="drone-video-modal__panel">
        <header class="drone-video-modal__head">
          <div class="drone-video-modal__head-main">
            <h2 id="drone-video-modal-title" class="drone-video-modal__title">드론 영상</h2>
          </div>
          <button type="button" class="drone-video-modal__close" data-close-drone-video aria-label="드론 영상 닫기">
            <img src="assets/main/dashboard/map/Component%201-1.svg" alt="" width="16" height="16">
          </button>
        </header>
        <div class="drone-video-modal__stack">
          <div class="drone-video-modal__years" id="drone-video-years" hidden>
            <label for="drone-video-year-select">촬영연도</label>
            <select id="drone-video-year-select" aria-label="촬영연도 선택"></select>
          </div>
          <div class="drone-video-modal__body">
            <video id="drone-video-player" class="drone-video-modal__video" controls playsinline preload="metadata"></video>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);

    playerEl = modalEl.querySelector('#drone-video-player');
    titleEl = modalEl.querySelector('#drone-video-modal-title');
    yearsWrapEl = modalEl.querySelector('#drone-video-years');
    yearSelectEl = modalEl.querySelector('#drone-video-year-select');

    yearSelectEl?.addEventListener('change', () => {
      const item = currentYears.find((entry) => String(entry.year) === yearSelectEl.value);
      if (!item || !playerEl) return;
      playerEl.src = item.url || SAMPLE_URL;
      playerEl.load();
      playerEl.play().catch(() => {});
    });

    modalEl.querySelectorAll('[data-close-drone-video]').forEach((el) => {
      el.addEventListener('click', close);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modalEl?.classList.contains('is-open')) close();
    });
  }

  function normalizeYears(years) {
    if (!Array.isArray(years) || !years.length) return [];
    return years
      .map((entry) => (typeof entry === 'object'
        ? { year: Number(entry.year), url: entry.url || SAMPLE_URL }
        : { year: Number(entry), url: SAMPLE_URL }))
      .filter((entry) => entry.year)
      .sort((a, b) => b.year - a.year);
  }

  function open({ title, url, years, selectedYear } = {}) {
    ensureModal();
    if (!modalEl || !playerEl) return;

    lastFocus = document.activeElement;
    if (titleEl) titleEl.textContent = title || '드론 영상';

    currentYears = normalizeYears(years);
    let startUrl = url || SAMPLE_URL;

    if (currentYears.length && yearsWrapEl && yearSelectEl) {
      const startYear = currentYears.some((entry) => entry.year === Number(selectedYear))
        ? Number(selectedYear)
        : currentYears[0].year;

      yearSelectEl.innerHTML = currentYears
        .map((entry) => `<option value="${entry.year}"${entry.year === startYear ? ' selected' : ''}>${entry.year}년</option>`)
        .join('');
      yearsWrapEl.hidden = false;
      startUrl = currentYears.find((entry) => entry.year === startYear)?.url || startUrl;
    } else if (yearsWrapEl) {
      yearsWrapEl.hidden = true;
    }

    playerEl.src = startUrl;
    playerEl.load();

    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drone-video-modal-open');

    requestAnimationFrame(() => {
      playerEl?.play().catch(() => {});
      modalEl?.querySelector('.drone-video-modal__close')?.focus({ preventScroll: true });
    });
  }

  function close() {
    if (!modalEl) return;

    playerEl?.pause();
    if (playerEl) {
      playerEl.removeAttribute('src');
      playerEl.load();
    }

    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drone-video-modal-open');

    if (lastFocus?.focus) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }

  return { open, close, SAMPLE_URL, DEFAULT_YEARS };
})();
