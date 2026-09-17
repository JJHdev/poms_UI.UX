/**
 * 시설물 추가 — 섹션 접기, 파일 선택, 저장/취소
 */
(() => {
  function initSections() {
    document.querySelectorAll('.fac-add-section__head').forEach((btn) => {
      btn.addEventListener('click', () => {
        const section = btn.closest('.fac-add-section');
        if (!section) return;
        section.classList.toggle('is-collapsed');
        btn.setAttribute('aria-expanded', section.classList.contains('is-collapsed') ? 'false' : 'true');
      });
    });
  }

  function initFilePickers() {
    document.querySelectorAll('.fac-add-file-row').forEach((row) => {
      const input = row.querySelector('input[type="file"]');
      const btn = row.querySelector('.fac-add-file-picker__btn');
      const nameEl = row.querySelector('.fac-add-file-picker__name');
      const deleteBtn = row.querySelector('.btn-fac-file-delete');

      btn?.addEventListener('click', () => input?.click());
      input?.addEventListener('change', () => {
        const file = input.files?.[0];
        if (nameEl) nameEl.textContent = file ? file.name : '선택된 파일 없음';
      });
      deleteBtn?.addEventListener('click', () => {
        if (input) input.value = '';
        if (nameEl) nameEl.textContent = '선택된 파일 없음';
      });
    });
  }

  function initActions() {
    document.getElementById('facAddCancelBtn')?.addEventListener('click', () => {
      window.location.href = 'facility-management.html?add=1';
    });
    document.getElementById('facAddSaveBtn')?.addEventListener('click', () => {
      alert('시설물 정보가 저장되었습니다. (샘플)');
      window.location.href = 'facility-management.html';
    });
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'system-facility' });
    initSections();
    initFilePickers();
    initActions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
