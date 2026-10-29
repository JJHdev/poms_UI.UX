/**
 * POMS 모바일 로그인
 */
(() => {
  if (typeof PomsAuth !== 'undefined' && new URLSearchParams(window.location.search).has('logout')) {
    PomsAuth.logout();
    window.history.replaceState({}, '', 'login.html');
  }

  const STORAGE_KEY = 'pomsMobileSavedId';
  const form = document.getElementById('mobileLoginForm');
  const userId = document.getElementById('mobileUserId');
  const userPw = document.getElementById('mobileUserPw');
  const saveId = document.getElementById('mobileSaveId');
  const loginMessage = document.getElementById('mobileLoginMessage');

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && userId) {
    userId.value = saved;
    if (saveId) saveId.checked = true;
  }

  const showError = (message) => {
    if (loginMessage) {
      loginMessage.hidden = false;
      loginMessage.className = 'mobile-login__message is-error';
      loginMessage.textContent = message;
      return;
    }
    alert(message);
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (typeof PomsAuth === 'undefined') {
      showError('로그인 모듈을 불러오지 못했습니다.');
      return;
    }

    const id = userId?.value.trim() || '';
    const pw = userPw?.value || '';

    if (!id) {
      showError('아이디를 입력해주세요.');
      userId?.focus();
      return;
    }

    const result = PomsAuth.login(id, pw);
    if (!result.ok) {
      showError(result.message);
      userPw?.focus();
      return;
    }

    if (result.role !== 'user') {
      PomsAuth.logout();
      showError('모바일은 사용자(user01) 계정만 로그인할 수 있습니다.');
      return;
    }

    if (saveId?.checked) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    window.location.href = 'home.html';
  });
})();
