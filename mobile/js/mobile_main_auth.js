(function () {
  var KEY = 'poms_mobile_auth';
  window.pomsMobileLogout = function () {
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    ['pomsInspectRecords', 'pomsInspectPeriodFlags'].forEach(function (storageKey) {
      try { localStorage.removeItem(storageKey); } catch (e) {}
      try { sessionStorage.removeItem(storageKey); } catch (e) {}
    });
    window.location.replace('mobile_login.html');   // 로그아웃 후 뒤로가기로 메인이 안 뜨게
  };
  try {
    var raw = sessionStorage.getItem(KEY);
    var session = raw ? JSON.parse(raw) : null;
    if (!session || session.id !== 'test') {
      window.location.replace('mobile_login.html');
    }
  } catch (e) {
    window.location.replace('mobile_login.html');
  }
})();
