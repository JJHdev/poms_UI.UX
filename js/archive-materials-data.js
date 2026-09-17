/** index.html 시스템 자료실 모달 — 샘플 데이터 (Figma 138:6779) */
const ARCHIVE_MATERIAL_DATA = [
  { id: 31, category: 'guide', categoryLabel: '지침', title: 'POMS 운영·관리 지침', author: '해양수산부', date: '2026-04-15', views: 328 },
  { id: 30, category: 'manual', categoryLabel: '매뉴얼', title: '항만시설물 유지관리 매뉴얼', author: '한국항만협회', date: '2026-04-08', views: 512 },
  { id: 29, category: 'manual', categoryLabel: '매뉴얼', title: '정기안전점검 실시 매뉴얼', author: '해양수산부', date: '2026-03-28', views: 328 },
  { id: 28, category: 'form', categoryLabel: '양식', title: '시설물 등록·변경 신청 양식', author: '관리자', date: '2026-04-08', views: 276 },
  { id: 27, category: 'form', categoryLabel: '양식', title: '점검결과 보고 양식(정기안전점검)', author: '관리자', date: '2026-04-08', views: 352 },
  { id: 26, category: 'template', categoryLabel: '서식', title: '유지관리계획서 작성 서식', author: '해양수산부', date: '2026-04-08', views: 762 },
  { id: 25, category: 'template', categoryLabel: '서식', title: '안전등급 평가 결과보고 서식', author: '한국항만협회', date: '2026-04-08', views: 141 },
  { id: 24, category: 'guide', categoryLabel: '지침', title: '항만시설물 안전점검 지침', author: '해양수산부', date: '2026-04-08', views: 522 },
  { id: 23, category: 'manual', categoryLabel: '매뉴얼', title: 'POMS 모바일 앱 사용 매뉴얼', author: '관리자', date: '2026-04-08', views: 235 },
  { id: 22, category: 'form', categoryLabel: '양식', title: '교육·세미나 참가 신청 양식', author: '관리자', date: '2026-04-08', views: 642 },
  { id: 21, category: 'guide', categoryLabel: '지침', title: '시설물 정보 보안 관리 지침', author: '해양수산부', date: '2026-01-08', views: 156 },
  { id: 20, category: 'manual', categoryLabel: '매뉴얼', title: '정밀안전진단 업무 매뉴얼', author: '한국항만협회', date: '2025-12-20', views: 203 },
  { id: 19, category: 'template', categoryLabel: '서식', title: '취약시설물 지정 신청 서식', author: '관리자', date: '2025-12-12', views: 88 },
  { id: 18, category: 'form', categoryLabel: '양식', title: '보수보강 실적 등록 양식', author: '관리자', date: '2025-11-28', views: 141 },
  { id: 17, category: 'guide', categoryLabel: '지침', title: '항만시설물 성능평가 지침', author: '해양수산부', date: '2025-11-10', views: 267 },
];

const ARCHIVE_MATERIAL_DETAILS = {
  31: {
    title: 'POMS 운영·관리 지침',
    author: '해양수산부',
    date: '2026-04-15 10:00',
    views: 328,
    period: '2026-04-15 ~',
    categoryLabel: '지침',
    file: { name: 'POMS_운영관리_지침.pdf', size: '540 KB' },
    body: `
      <p>POMS(항만시설물 유지관리 시스템) 운영·관리에 관한 기본 지침입니다.</p>
      <div class="notice-block">
        <p class="notice-block__label">■ 주요 내용</p>
        <ul class="notice-block__list">
          <li>시스템 이용 대상 및 역할</li>
          <li>시설물 정보 등록·관리 원칙</li>
          <li>점검·진단 결과 입력 및 보고 절차</li>
        </ul>
      </div>
      <p>첨부파일을 참고하시기 바랍니다.</p>
    `,
  },
  30: {
    title: '항만시설물 유지관리 매뉴얼',
    author: '한국항만협회',
    date: '2026-04-08 09:30',
    views: 512,
    period: '2026-04-08 ~',
    categoryLabel: '매뉴얼',
    file: { name: '항만시설물_유지관리_매뉴얼.pdf', size: '1.2 MB' },
    body: `
      <p>항만시설물의 유지관리 업무 수행을 위한 표준 매뉴얼입니다.</p>
      <div class="notice-block">
        <p class="notice-block__label">■ 구성</p>
        <ul class="notice-block__list">
          <li>시설물 분류 및 관리체계</li>
          <li>정기·수시 점검 방법</li>
          <li>보수·보강 의사결정 기준</li>
        </ul>
      </div>
    `,
  },
};

function resolveArchiveMaterialDetail(id) {
  const numId = Number(id);
  const listItem = ARCHIVE_MATERIAL_DATA.find((n) => n.id === numId);

  let data = ARCHIVE_MATERIAL_DETAILS[numId];
  if (!data && listItem) {
    data = {
      title: listItem.title,
      author: listItem.author,
      date: `${listItem.date} 09:00`,
      views: listItem.views,
      period: '-',
      categoryLabel: listItem.categoryLabel,
      file: null,
      body: `<p>${listItem.title} 자료입니다.</p><p>자세한 내용은 관리자에게 문의해 주세요.</p>`,
    };
  }

  return {
    listItem,
    data: data || ARCHIVE_MATERIAL_DETAILS[31],
  };
}

window.PomsArchiveMaterials = {
  ARCHIVE_MATERIAL_DATA,
  resolveArchiveMaterialDetail,
};
