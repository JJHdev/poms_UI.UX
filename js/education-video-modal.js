/**
 * 메인 — 동영상 교육자료 팝업
 * - #heroGuideBtn 클릭 시 열림
 * - 드론 영상 팝업(css/drone-video-player.css)의 .drone-video-modal 스타일을 재사용하고,
 *   우측에 재생목록을 추가한 형태 (css/education-video-modal.css)
 * - 데이터: js/education-video-data.js (EDUCATION_VIDEO_ROWS)
 */
const EducationVideoModal = (() => {
  let root = null;
  let videoEl = null;
  let listEl = null;
  let titleEl = null;
  let descEl = null;
  let metaEl = null;
  let currentId = null;
  let lastFocus = null;

  function rows() {
    return typeof EDUCATION_VIDEO_ROWS !== 'undefined' ? EDUCATION_VIDEO_ROWS : [];
  }

  function build() {
    if (root) return root;
    root = document.createElement('div');
    root.className = 'drone-video-modal edu-video-modal';
    root.id = 'educationVideoModal';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = `
      <div class="drone-video-modal__backdrop" data-edu-close></div>
      <div class="drone-video-modal__panel edu-video-modal__panel" role="dialog" aria-modal="true" aria-labelledby="educationVideoModalTitle">
        <div class="drone-video-modal__head">
          <div class="drone-video-modal__head-main">
            <h2 class="drone-video-modal__title" id="educationVideoModalTitle">동영상 교육자료</h2>
            <span class="edu-video-modal__count">총 <strong>${rows().length}</strong>편</span>
          </div>
          <button type="button" class="drone-video-modal__close" data-edu-close aria-label="닫기">
            <img src="assets/main/dashboard/map/Component%201-1.svg" alt="" width="16" height="16">
          </button>
        </div>
        <div class="edu-video-modal__layout">
          <div class="edu-video-modal__player">
            <div class="drone-video-modal__body edu-video-modal__body">
              <video class="drone-video-modal__video edu-video-modal__video" controls playsinline preload="metadata"></video>
            </div>
            <div class="edu-video-modal__info">
              <h3 class="edu-video-modal__info-title"></h3>
              <p class="edu-video-modal__info-desc"></p>
              <p class="edu-video-modal__info-meta"></p>
            </div>
          </div>
          <aside class="edu-video-modal__list" aria-label="교육자료 목록">
            <div class="edu-video-modal__list-head">재생목록</div>
            <ul class="edu-video-modal__items"></ul>
          </aside>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    videoEl = root.querySelector('.edu-video-modal__video');
    listEl = root.querySelector('.edu-video-modal__items');
    titleEl = root.querySelector('.edu-video-modal__info-title');
    descEl = root.querySelector('.edu-video-modal__info-desc');
    metaEl = root.querySelector('.edu-video-modal__info-meta');

    root.querySelectorAll('[data-edu-close]').forEach((el) => el.addEventListener('click', close));
    listEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-edu-id]');
      if (btn) select(btn.dataset.eduId, true);
    });
    videoEl.addEventListener('ended', () => {
      const list = rows();
      const idx = list.findIndex((r) => r.id === currentId);
      if (idx > -1 && idx < list.length - 1) select(list[idx + 1].id, true);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('is-open')) close();
    });

    renderList();
    return root;
  }

  function renderList() {
    listEl.innerHTML = rows().map((r, i) => `
      <li class="edu-video-modal__item${r.id === currentId ? ' is-active' : ''}">
        <button type="button" class="edu-video-modal__item-btn" data-edu-id="${r.id}">
          <span class="edu-video-modal__item-no">${String(i + 1).padStart(2, '0')}</span>
          <span class="edu-video-modal__item-text">
            <span class="edu-video-modal__item-title">${r.title}</span>
            <span class="edu-video-modal__item-sub">${r.duration || ''}${r.registeredAt ? ' · ' + r.registeredAt : ''}</span>
          </span>
        </button>
      </li>
    `).join('');
  }

  function select(id, autoplay) {
    const row = rows().find((r) => r.id === id);
    if (!row) return;
    currentId = id;
    videoEl.src = row.src || EDUCATION_VIDEO_SAMPLE_URL;
    videoEl.load();
    titleEl.textContent = row.title;
    descEl.textContent = row.desc || '';
    metaEl.textContent = [row.duration && `재생시간 ${row.duration}`, row.registeredAt && `등록일 ${row.registeredAt}`].filter(Boolean).join('  |  ');
    listEl.querySelectorAll('.edu-video-modal__item').forEach((li) => {
      li.classList.toggle('is-active', li.querySelector('[data-edu-id]').dataset.eduId === id);
    });
    const active = listEl.querySelector('.edu-video-modal__item.is-active');
    if (active) active.scrollIntoView({ block: 'nearest' });
    if (autoplay) videoEl.play().catch(() => { /* 자동재생 차단 시 무시 */ });
  }

  function open(id) {
    build();
    lastFocus = document.activeElement;
    const list = rows();
    if (!list.length) { alert('등록된 교육자료가 없습니다.'); return; }
    select(id || list[0].id, false);
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drone-video-modal-open');
    root.querySelector('.drone-video-modal__close').focus();
  }

  function close() {
    if (!root) return;
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drone-video-modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('heroGuideBtn');
    if (btn) btn.addEventListener('click', () => open());
  });

  return { open, close };
})();
