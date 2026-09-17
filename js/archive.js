/** index.html 공지사항 영역에 표시되는 항목 ID */
const INDEX_NOTICE_IDS = [26, 24, 23];
const NOTICE_STORAGE_KEY = 'poms-notice-extra';

const NOTICE_DATA = [
  { id: 26, notice: true, title: '2026년 항만시설물 유지관리 시스템 개선 안내', author: '관리자', date: '2026-05-08', views: 156 },
  { id: 25, notice: true, title: 'POMS 시스템 점검 안내 (04/28)', author: '관리자', date: '2026-04-22', views: 124 },
  { id: 24, notice: true, title: '항만시설물 유지관리 교육(2기) 안내', author: '관리자', date: '2026-05-08', views: 98 },
  { id: 23, notice: false, title: '2026년 시스템 사업자평가 대상 안내', author: '관리자', date: '2026-05-08', views: 76 },
  { id: 22, notice: false, title: '항만시설물 안전점검 일정 공지', author: '관리자', date: '2026-04-05', views: 65 },
  { id: 21, notice: false, title: 'POMS 모바일 앱 업데이트 안내', author: '관리자', date: '2026-03-28', views: 112 },
  { id: 20, notice: false, title: '2026년 1분기 시설물 통계 공개', author: '관리자', date: '2026-03-20', views: 89 },
  { id: 19, notice: false, title: '개인정보처리방침 개정 안내', author: '관리자', date: '2026-03-15', views: 54 },
  { id: 18, notice: false, title: '항만시설물 유지관리 매뉴얼 배포', author: '관리자', date: '2026-03-08', views: 143 },
  { id: 17, notice: false, title: '설 연휴 고객센터 운영 안내', author: '관리자', date: '2026-02-25', views: 67 },
  { id: 16, notice: false, title: '시스템 로그인 정책 변경 안내', author: '관리자', date: '2026-02-18', views: 201 },
];

const NOTICE_DETAILS = {
  26: {
    title: '2026년 항만시설물 유지관리 시스템 개선 안내',
    author: '관리자',
    date: '2026-05-08 10:00',
    views: 156,
    period: '2026-05-08 ~ 2026-12-31',
    file: { name: 'POMS_시스템_개선_안내.pdf', size: '312 KB' },
    body: `
      <p>안녕하세요. 해양수산부 POMS 운영팀입니다.</p>
      <p>2026년 항만시설물 유지관리 시스템(POMS) 기능 개선 작업이 완료되어 안내드립니다.</p>
      <div class="notice-block">
        <p class="notice-block__label">■ 주요 개선 사항</p>
        <ul class="notice-block__list">
          <li>시설물 통합검색·지도 연동 기능 개선</li>
          <li>점검정보현황 조회 화면 사용성 향상</li>
          <li>모바일 정기안전점검 결과보고서 기능 추가</li>
        </ul>
      </div>
      <div class="notice-block">
        <p class="notice-block__label">■ 적용 일시</p>
        <p class="notice-block__text">2026년 5월 8일(목)부터 순차 적용</p>
      </div>
      <p>이용 중 문의사항은 고객센터(02-2165-0146)로 연락해 주시기 바랍니다.</p>
    `,
  },
  24: {
    title: '항만시설물 유지관리 교육(2기) 안내',
    author: '관리자',
    date: '2026-05-08 09:30',
    views: 98,
    period: '2026-05-20 ~ 2026-05-22',
    file: { name: '유지관리_교육_2기_안내.hwp', size: '128 KB' },
    body: `
      <p>항만시설물 유지관리 교육 2기 참가 신청을 받습니다.</p>
      <div class="notice-block">
        <p class="notice-block__label">■ 교육 일정</p>
        <p class="notice-block__text">2026년 5월 20일(화) ~ 22일(목), 3일간</p>
      </div>
      <div class="notice-block">
        <p class="notice-block__label">■ 교육 대상</p>
        <ul class="notice-block__list">
          <li>항만시설물 관리·점검 담당자</li>
          <li>POMS 시스템 운영 담당자</li>
        </ul>
      </div>
      <div class="notice-block">
        <p class="notice-block__label">■ 신청 방법</p>
        <p class="notice-block__text">POMS 자료실 &gt; 교육신청 양식 다운로드 후 이메일 접수</p>
      </div>
    `,
  },
  23: {
    title: '2026년 시스템 사업자평가 대상 안내',
    author: '관리자',
    date: '2026-05-08 09:00',
    views: 76,
    period: '2026-06-01 ~ 2026-06-30',
    file: null,
    body: `
      <p>2026년 POMS 운영 사업자평가 대상 및 일정을 안내드립니다.</p>
      <div class="notice-block">
        <p class="notice-block__label">■ 평가 대상</p>
        <ul class="notice-block__list">
          <li>2025년 ~ 2026년 POMS 운영·유지관리 용역 수행 기관</li>
        </ul>
      </div>
      <div class="notice-block">
        <p class="notice-block__label">■ 평가 기간</p>
        <p class="notice-block__text">2026년 6월 1일 ~ 6월 30일</p>
      </div>
      <p>평가 항목 및 제출 서류는 첨부 자료를 참고해 주시기 바랍니다.</p>
    `,
  },
  25: {
    title: '시스템 점검 안내 (6/10)',
    author: '관리자',
    date: '2025-06-02 09:30',
    views: 235,
    period: '2025-06-10 00:00 ~ 2025-06-10 06:00',
    file: { name: '시스템_점검_안내문.pdf', size: '245 KB' },
    body: `
      <p>안녕하세요. 해양수산부 POMS 운영팀입니다.</p>
      <p>보다 안정적인 서비스 제공을 위해 아래와 같이 시스템 점검을 실시할 예정입니다. 점검 시간 동안에는 서비스 이용이 일시 중단되오니 양해 부탁드립니다.</p>
      <div class="notice-block">
        <p class="notice-block__label">■ 점검 일시</p>
        <p class="notice-block__text">2025년 6월 10일(화) 00:00 ~ 06:00 (6시간)</p>
      </div>
      <div class="notice-block">
        <p class="notice-block__label">■ 점검 내용</p>
        <ul class="notice-block__list">
          <li>서버 장비 점검 및 시스템 최적화</li>
          <li>데이터베이스 성능 개선</li>
        </ul>
      </div>
      <div class="notice-block">
        <p class="notice-block__label">■ 영향 서비스</p>
        <ul class="notice-block__list">
          <li>POMS 전체 서비스 (로그인, 자료 조회·등록 등)</li>
        </ul>
      </div>
      <p>이용에 불편을 드려 죄송하며, 더 나은 서비스로 보답하겠습니다.</p>
      <p>감사합니다.</p>
    `,
  },
};

function loadExtraNotices() {
  try {
    const raw = sessionStorage.getItem(NOTICE_STORAGE_KEY);
    if (!raw) return { list: [], details: {} };
    const parsed = JSON.parse(raw);
    return {
      list: Array.isArray(parsed.list) ? parsed.list : [],
      details: parsed.details && typeof parsed.details === 'object' ? parsed.details : {},
    };
  } catch {
    return { list: [], details: {} };
  }
}

function saveExtraNotice(listItem, detail) {
  const extra = loadExtraNotices();
  extra.list = [listItem, ...extra.list.filter((item) => item.id !== listItem.id)];
  extra.details[listItem.id] = detail;
  sessionStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(extra));
}

function mergeExtraNotices() {
  const extra = loadExtraNotices();
  extra.list.forEach((item) => {
    if (!NOTICE_DATA.some((n) => n.id === item.id)) {
      NOTICE_DATA.unshift(item);
    }
  });
  Object.keys(extra.details).forEach((key) => {
    NOTICE_DETAILS[Number(key)] = extra.details[key];
  });
}

mergeExtraNotices();

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('noticeTableBody');
  if (tableBody) initNoticeList();

  if (document.getElementById('noticeDetailBody')) initNoticeDetail();
  if (document.getElementById('noticeRegisterForm')) initNoticeRegister();
});

function initNoticeList() {
  const tableBody = document.getElementById('noticeTableBody');
  const searchInput = document.getElementById('noticeSearch');
  const searchForm = document.getElementById('noticeSearchForm');
  const resetBtn = document.getElementById('noticeResetBtn');
  const registerBtn = document.getElementById('noticeRegisterBtn');
  const resultCount = document.getElementById('noticeResultCount');
  const listState = PomsUserTable.createState();
  let currentList = [...NOTICE_DATA];

  const columns = [
    { key: 'id', label: '번호' },
    { key: 'title', label: '제목' },
    { key: 'author', label: '작성자' },
    { key: 'date', label: '작성일' },
    { key: 'views', label: '조회수' },
  ];

  function setupTableHead() {
    const thead = tableBody?.closest('table')?.querySelector('thead');
    if (!thead) return;
    thead.innerHTML = `<tr>${columns.map((column) => `<th scope="col" class="col-${column.key === 'id' ? 'no' : column.key}">${column.label}</th>`).join('')}</tr>`;
  }

  function updateResultCount(total) {
    if (resultCount) resultCount.textContent = total.toLocaleString();
  }

  function renderRows(list) {
    currentList = list;
    const sorted = [...list];
    const pageRows = PomsUserTable.slicePage(sorted, listState.page, listState.pageSize);
    const start = (listState.page - 1) * listState.pageSize;

    updateResultCount(sorted.length);

    if (!sorted.length) {
      tableBody.innerHTML = '<tr><td colspan="5">조회된 공지가 없습니다.</td></tr>';
    } else {
      tableBody.innerHTML = pageRows
        .map(
          (item, index) => `
      <tr class="is-clickable" data-notice-id="${item.id}" tabindex="0">
        <td class="col-no">${start + index + 1}</td>
        <td class="col-title">
          <span class="notice-title-link">${item.title}</span>
          ${item.notice ? '<span class="notice-badge">공지</span>' : ''}
        </td>
        <td class="col-author">${item.author}</td>
        <td class="col-date">${item.date}</td>
        <td class="col-views">${item.views}</td>
      </tr>`
        )
        .join('');
    }

    tableBody.querySelectorAll('tr[data-notice-id]').forEach((row) => {
      const go = () => {
        window.location.href = `notice-detail.html?id=${row.dataset.noticeId}`;
      };
      row.addEventListener('click', go);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go();
        }
      });
    });

    PomsUserTable.mountFoot({
      paginationId: 'noticePagination',
      state: listState,
      totalRows: sorted.length,
      onChange: () => renderRows(currentList),
    });
  }

  function filterList() {
    const q = searchInput?.value.trim().toLowerCase() || '';
    const filtered = q
      ? NOTICE_DATA.filter((n) => n.title.toLowerCase().includes(q))
      : [...NOTICE_DATA];
    listState.page = 1;
    renderRows(filtered);
  }

  setupTableHead();
  renderRows(NOTICE_DATA);

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    filterList();
  });

  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    filterList();
  });

  registerBtn?.addEventListener('click', () => {
    window.location.href = 'notice-register.html';
  });

  PomsSidebar.mount('#sidebar-root', { active: 'archive-notice' });
}

function initNoticeDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id')) || 25;
  const { data } = resolveNoticeDetail(id);

  document.title = `${data.title} | 공지사항 상세 | POMS`;

  const goList = () => {
    window.location.href = 'archive.html';
  };

  const setValue = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value ?? '';
  };

  const crumb = document.getElementById('noticeDetailCrumb');
  if (crumb) crumb.textContent = data.title;

  setValue('noticeDetailSubject', data.title);
  setValue('noticeDetailAuthor', data.author);
  setValue('noticeDetailDate', data.date);
  setValue('noticeDetailViews', String(data.views ?? ''));
  setValue('noticeDetailPeriod', data.period || '-');

  const bodyEl = document.getElementById('noticeDetailBody');
  if (bodyEl) {
    bodyEl.innerHTML = data.body || '<p>등록된 내용이 없습니다.</p>';
  }

  const fileLink = document.getElementById('noticeDetailFile');
  if (fileLink) {
    if (data.file) {
      fileLink.textContent = `${data.file.name} (${data.file.size})`;
      fileLink.classList.remove('is-empty');
      fileLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`${data.file.name} 파일을 다운로드합니다. (샘플)`);
      });
    } else {
      fileLink.textContent = '첨부된 파일 없음';
      fileLink.classList.add('is-empty');
      fileLink.removeAttribute('href');
    }
  }

  document.getElementById('noticeDetailBackBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    goList();
  });

  PomsSidebar.mount('#sidebar-root', { active: 'archive-notice' });
}

function initNoticeRegister() {
  const form = document.getElementById('noticeRegisterForm');
  const dateInput = document.getElementById('noticeRegisterDate');
  const fileInput = document.getElementById('noticeRegisterFileInput');
  const fileBtn = document.getElementById('noticeRegisterFileBtn');
  const fileName = document.getElementById('noticeRegisterFileName');

  const goList = () => {
    window.location.href = 'archive.html';
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  if (dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;

  fileBtn?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (fileName) fileName.textContent = file ? file.name : '선택된 파일 없음';
  });

  document.getElementById('noticeRegisterBackBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    goList();
  });

  document.getElementById('noticeRegisterCancelBtn')?.addEventListener('click', goList);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('noticeRegisterSubject')?.value.trim() || '';
    const body = document.getElementById('noticeRegisterBody')?.value.trim() || '';
    if (!subject) {
      alert('제목을 입력해 주세요.');
      document.getElementById('noticeRegisterSubject')?.focus();
      return;
    }
    if (!body) {
      alert('내용을 입력해 주세요.');
      document.getElementById('noticeRegisterBody')?.focus();
      return;
    }

    const nextId = Math.max(...NOTICE_DATA.map((n) => n.id)) + 1;
    const author = document.getElementById('noticeRegisterAuthor')?.value.trim() || '관리자';
    const period = document.getElementById('noticeRegisterPeriod')?.value.trim() || '-';
    const file = fileInput?.files?.[0];

    const listItem = {
      id: nextId,
      notice: true,
      title: subject,
      author,
      date: dateInput?.value || `${yyyy}-${mm}-${dd}`,
      views: 0,
    };
    const detail = {
      title: subject,
      author,
      date: `${dateInput?.value || `${yyyy}-${mm}-${dd}`} 09:00`,
      views: 0,
      period,
      file: file ? { name: file.name, size: `${Math.max(1, Math.round(file.size / 1024))} KB` } : null,
      body: body
        .split(/\n+/)
        .filter(Boolean)
        .map((line) => `<p>${line}</p>`)
        .join('') || `<p>${body}</p>`,
    };

    saveExtraNotice(listItem, detail);
    NOTICE_DATA.unshift(listItem);
    NOTICE_DETAILS[nextId] = detail;

    alert('공지사항이 등록되었습니다.');
    window.location.href = `notice-detail.html?id=${nextId}`;
  });

  PomsSidebar.mount('#sidebar-root', { active: 'archive-notice' });
}

function resolveNoticeDetail(id) {
  const numId = Number(id);
  const listItem = NOTICE_DATA.find((n) => n.id === numId);

  let data = NOTICE_DETAILS[numId];
  if (!data && listItem) {
    data = {
      title: listItem.title,
      author: listItem.author,
      date: `${listItem.date} 09:00`,
      views: listItem.views,
      period: '-',
      file: null,
      body: `<p>${listItem.title}에 대한 공지 내용입니다.</p><p>자세한 사항은 관리자에게 문의해 주세요.</p>`,
    };
  }

  return {
    listItem,
    data: data || NOTICE_DETAILS[25],
  };
}

window.PomsNotices = {
  INDEX_NOTICE_IDS,
  NOTICE_DATA,
  resolveNoticeDetail,
};
