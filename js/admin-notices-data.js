/**
 * 관리자 공지사항 데이터 (목록·상세 공용)
 */
const AdminNoticesData = (() => {
  const DETAILS = {
    25: {
      title: '시스템 점검 안내 (6/10)',
      author: '관리자',
      date: '2025-06-02 10:30',
      modified: '2025-06-02 11:15',
      views: 235,
      pinned: true,
      visible: '노출',
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
    50: {
      title: '시스템 점검 안내 (6/10)',
      author: '관리자',
      date: '2025-06-02 10:30',
      modified: '2025-06-02 11:15',
      views: 235,
      pinned: true,
      visible: '노출',
      file: { name: '점검안내_2026.pdf', size: '312 KB' },
      body: `<p>시스템 점검 관련 중요 공지입니다. 점검 일정을 확인해 주세요.</p>`,
    },
    48: {
      title: '2026년 항만시설물 유지관리 교육 안내',
      author: '관리자',
      date: '2026-05-10 14:30',
      modified: '2026-05-11 09:00',
      views: 198,
      pinned: true,
      visible: '노출',
      file: null,
      body: `<p>교육 일정 및 신청 방법을 안내드립니다.</p>`,
    },
  };

  function getDetail(id) {
    const numId = Number(id) || 1;
    if (DETAILS[numId]) return { id: numId, ...DETAILS[numId] };

    return {
      id: numId,
      title: `공지사항 #${numId}`,
      author: '관리자',
      date: '2026-01-15 09:00',
      modified: '2026-01-16 10:00',
      views: 50 + numId,
      pinned: numId % 3 !== 0,
      visible: numId % 5 === 0 ? '미노출' : '노출',
      file: { name: 'POMS_운영관리_지침.pdf', size: '540KB' },
      body: `<p>공지 번호 ${numId}에 대한 상세 내용입니다.</p><p></p><p>관리자에서 등록·수정할 수 있습니다.</p>`,
    };
  }

  return { getDetail };
})();
