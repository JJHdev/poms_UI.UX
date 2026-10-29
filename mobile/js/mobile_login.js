(function () {
  var vv = window.visualViewport;
  if (!vv) return;
  var ua = navigator.userAgent || '';
  var iOS = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!iOS) return;
  var syncing = false;
  function sync() {
    var zoomed = vv.scale > 1.01;
    document.documentElement.classList.toggle('is-ios-zoomed', zoomed);
    if (!zoomed || syncing) return;
    var x = vv.offsetLeft || 0;
    var y = vv.offsetTop || 0;
    if (Math.abs(window.scrollX - x) < 1 && Math.abs(window.scrollY - y) < 1) return;
    syncing = true;
    window.scrollTo(x, y);
    syncing = false;
  }
  vv.addEventListener('resize', sync);
  vv.addEventListener('scroll', sync);
})();

(function () {
  var AUTH_KEY = 'poms_mobile_auth';
  var SAVED_ID_KEY = 'poms_mobile_saved_id';
  var DEMO_ACCOUNTS = { test: 'test' };
  for (var n = 1; n <= 50; n++) {
    var demoId = 'test' + (n < 10 ? '0' : '') + n;
    DEMO_ACCOUNTS[demoId] = demoId;
  }

  function isDemoAccount(id, pw) {
    return DEMO_ACCOUNTS[id] === pw;
  }

  function showLoginError(message) {
    var el = document.getElementById('loginError');
    if (!el) {
      alert(message);
      return;
    }
    el.hidden = false;
    el.textContent = message;
  }

  function clearLoginError() {
    var el = document.getElementById('loginError');
    if (!el) return;
    el.hidden = true;
    el.textContent = '';
  }

  window.togglePassword = function () {
    var input = document.getElementById('password');
    var icon = document.getElementById('passwordIcon');
    if (!input) return;
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    if (icon) icon.className = show ? 'ti ti-eye-off' : 'ti ti-eye';
  };

  window.findPassword = function () {
    alert('데모 계정입니다.\n아이디: test 또는 test01~test50\n비밀번호: 아이디와 동일');
  };

  window.submitMobileLogin = function () {
    var idInput = document.getElementById('userId');
    var pwInput = document.getElementById('password');
    var saveId = document.getElementById('saveId');
    var id = (idInput && idInput.value ? idInput.value : '').trim();
    var pw = pwInput && pwInput.value ? pwInput.value : '';

    clearLoginError();

    if (!id || !pw) {
      showLoginError('아이디와 비밀번호를 입력해주세요.');
      if (!id && idInput) idInput.focus();
      else if (pwInput) pwInput.focus();
      return;
    }

    if (!isDemoAccount(id, pw)) {
      showLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
      if (pwInput) pwInput.focus();
      return;
    }

    if (saveId && saveId.checked) {
      localStorage.setItem(SAVED_ID_KEY, id);
    } else {
      localStorage.removeItem(SAVED_ID_KEY);
    }

    sessionStorage.setItem(AUTH_KEY, JSON.stringify({
      id: id,
      loginAt: Date.now()
    }));

    window.location.replace('mobile_main.html');   // 로그인 화면을 방문 기록에 남기지 않음 (뒤로가기로 안 돌아옴)
  };

  // 이미 로그인한 상태로 로그인 화면이 열리면 (뒤로가기·캐시 포함) 바로 메인으로
  window.addEventListener('pageshow', function () {
    try { if (sessionStorage.getItem(AUTH_KEY)) window.location.replace('mobile_main.html'); } catch (e) {}
  });

  document.addEventListener('DOMContentLoaded', function () {
    var idInput = document.getElementById('userId');
    var pwInput = document.getElementById('password');
    var saveId = document.getElementById('saveId');
    var saved = localStorage.getItem(SAVED_ID_KEY);

    if (saved && idInput) {
      idInput.value = saved;
      if (saveId) saveId.checked = true;
    }

    [idInput, pwInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.submitMobileLogin();
        }
      });
    });
  });
})();
