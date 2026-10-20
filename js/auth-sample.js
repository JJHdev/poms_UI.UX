/**
 * POMS 샘플 로그인 (데모용 — 실제 인증 아님)
 */
const PomsAuth = (() => {
  const SESSION_KEY = 'poms_sample_session';

  /** @type {{ id: string, password: string, role: 'user'|'vendor'|'admin', name: string, redirect: string }[]} */
  const ACCOUNTS = [
    {
      id: 'poms2015',
      password: 'port2021*',
      role: 'user',
      name: '한국항만협회 사용자',
      redirect: 'facility-search.html',
    },
    {
      id: 'service2',
      password: 'port2021*',
      role: 'vendor',
      name: '한국항만협회 용역사',
      redirect: 'vendor-application.html',
    },
    {
      id: 'admin1',
      password: 'port2021*',
      role: 'admin',
      name: '시스템 관리자',
      redirect: 'admin-users.html',
    },
  ];

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function login(userId, password) {
    const id = String(userId || '').trim().toLowerCase();
    const pw = String(password || '');

    if (!id || !pw) {
      return { ok: false, message: '아이디와 비밀번호를 입력해주세요.' };
    }

    const account = ACCOUNTS.find((a) => a.id.toLowerCase() === id && a.password === pw);
    if (!account) {
      return { ok: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
    }

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        userId: account.id,
        role: account.role,
        name: account.name,
        loginAt: Date.now(),
      })
    );

    return { ok: true, redirect: account.redirect, role: account.role, name: account.name };
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function isLoggedIn() {
    return !!getSession();
  }

  function getSidebarUser(fallbackName = '게스트') {
    const session = getSession();
    const name = session?.name || fallbackName;
    return {
      name,
      avatar: name.charAt(0) || '?',
    };
  }

  return {
    ACCOUNTS,
    getSession,
    getSidebarUser,
    login,
    logout,
    isLoggedIn,
  };
})();
