document.addEventListener('DOMContentLoaded', () => {
  const pwInput = document.getElementById('userPw');
  const toggleBtn = document.getElementById('togglePw');
  const loginForm = document.getElementById('loginForm');
  const saveIdCheckbox = document.getElementById('saveId');
  const userIdInput = document.getElementById('userId');
  const loginMessage = document.getElementById('loginMessage');

  const SAVED_ID_KEY = 'poms_saved_id';

  if (typeof PomsAuth !== 'undefined' && new URLSearchParams(window.location.search).has('logout')) {
    PomsAuth.logout();
    window.history.replaceState({}, '', 'index.html');
  }

  if (userIdInput && saveIdCheckbox) {
    const savedId = localStorage.getItem(SAVED_ID_KEY);
    if (savedId) {
      userIdInput.value = savedId;
      saveIdCheckbox.checked = true;
    }
  }

  if (toggleBtn && pwInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = pwInput.type === 'password';
      pwInput.type = isPassword ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', isPassword ? '비밀번호 숨기기' : '비밀번호 표시');
    });
  }

  const clearLoginMessage = () => {
    if (!loginMessage) return;
    loginMessage.hidden = true;
    loginMessage.textContent = '';
  };

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearLoginMessage();

      const userId = userIdInput?.value.trim() || '';
      const password = pwInput?.value || '';

      if (saveIdCheckbox?.checked && userId) {
        localStorage.setItem(SAVED_ID_KEY, userId);
      } else {
        localStorage.removeItem(SAVED_ID_KEY);
      }

      if (typeof PomsAuth !== 'undefined' && userId && password) {
        PomsAuth.login(userId, password);
      }

      window.location.href = 'facility.html';
    });
  }

  // 동영상 교육자료 버튼(#heroGuideBtn) 클릭 처리는 js/education-video-modal.js 로 이동
});
