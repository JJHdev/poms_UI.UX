/** index.html 게시판 — 샘플 데이터 */
const RELATED_LAW_DATA = [
  { id: 15, category: 'decree', categoryLabel: '시행령', title: '1종 항만외곽시설물의 시설물 안전 및 유지관리에 관한 특별법 시행령 개정 안내', author: '해양수산부', date: '2026-05-08', views: 214 },
  { id: 14, category: 'decree', categoryLabel: '시행령', title: '2종 항만외곽시설물의 시설물 안전 및 유지관리에 관한 특별법 시행령 개정 안내', author: '해양수산부', date: '2026-05-08', views: 187 },
  { id: 13, category: 'law', categoryLabel: '법률', title: '산업입지 및 개발에 관한 법률 안내', author: '해양수산부', date: '2026-05-08', views: 156 },
  { id: 12, category: 'law', categoryLabel: '법률', title: '항만법 일부개정법률 시행 안내', author: '해양수산부', date: '2026-04-22', views: 298 },
  { id: 11, category: 'notice', categoryLabel: '고시', title: '항만시설 설계기준(KDS 64 10 00) 고시', author: '해양수산부', date: '2026-04-10', views: 342 },
  { id: 10, category: 'guide', categoryLabel: '지침', title: '항만시설 유지관리 업무 수행 지침', author: '한국항만협회', date: '2026-03-28', views: 265 },
  { id: 9, category: 'rule', categoryLabel: '규정', title: '항만시설 안전관리 규정 시행 안내', author: '해양수산부', date: '2026-03-15', views: 198 },
  { id: 8, category: 'decree', categoryLabel: '시행령', title: '시설물의 안전 및 유지관리에 관한 특별법 시행령 개정', author: '국토교통부', date: '2026-02-28', views: 421 },
  { id: 7, category: 'guide', categoryLabel: '지침', title: '콘크리트 구조물 유지관리 기준(2026 개정)', author: '한국항만협회', date: '2026-02-12', views: 176 },
  { id: 6, category: 'notice', categoryLabel: '고시', title: '항만시설물 정기안전점검 요령 고시', author: '해양수산부', date: '2026-01-30', views: 233 },
  { id: 5, category: 'law', categoryLabel: '법률', title: '해양환경관리법 관련 항만시설 적용 안내', author: '해양수산부', date: '2026-01-15', views: 145 },
  { id: 4, category: 'rule', categoryLabel: '규정', title: '항만시설물 성능평가 업무 규정', author: '해양수산부', date: '2025-12-20', views: 189 },
  { id: 3, category: 'guide', categoryLabel: '지침', title: '해양환경 보호를 위한 항만공사 지침', author: '해양수산부', date: '2025-12-05', views: 112 },
  { id: 2, category: 'decree', categoryLabel: '시행령', title: '항만법 시행령 일부개정령 고시', author: '해양수산부', date: '2025-11-18', views: 267 },
  { id: 1, category: 'notice', categoryLabel: '고시', title: '항만시설 기술용역 과업지침(안) 고시', author: '해양수산부', date: '2025-11-02', views: 98 },
];

const RELATED_LAW_DETAILS = {
  15: {
    title: '1종 항만외곽시설물의 시설물 안전 및 유지관리에 관한 특별법 시행령 개정 안내',
    author: '해양수산부',
    date: '2026-05-08 10:00',
    views: 214,
    period: '2026-05-08 ~',
    categoryLabel: '시행령',
    file: { name: '1종_특별법_시행령_개정.pdf', size: '428 KB' },
    body: `
      <p>1종 항만외곽시설물 관련 「시설물의 안전 및 유지관리에 관한 특별법 시행령」 개정 사항을 안내드립니다.</p>
      <div class="notice-block">
        <p class="notice-block__label">■ 주요 개정 내용</p>
        <ul class="notice-block__list">
          <li>1종 시설물 안전점검·진단 주기 명확화</li>
          <li>유지관리계획 수립·제출 절차 정비</li>
          <li>성능평가 결과 반영 기준 보완</li>
        </ul>
      </div>
      <p>자세한 내용은 첨부파일을 참고해 주시기 바랍니다.</p>
    `,
  },
  14: {
    title: '2종 항만외곽시설물의 시설물 안전 및 유지관리에 관한 특별법 시행령 개정 안내',
    author: '해양수산부',
    date: '2026-05-08 09:30',
    views: 187,
    period: '2026-05-08 ~',
    categoryLabel: '시행령',
    file: { name: '2종_특별법_시행령_개정.pdf', size: '396 KB' },
    body: `
      <p>2종 항만외곽시설물 관련 시행령 개정 사항을 안내드립니다.</p>
      <div class="notice-block">
        <p class="notice-block__label">■ 적용 대상</p>
        <ul class="notice-block__list">
          <li>2종 항만외곽시설물 관리주체</li>
          <li>정기안전점검·정밀안전진단 수행 기관</li>
        </ul>
      </div>
    `,
  },
  13: {
    title: '산업입지 및 개발에 관한 법률 안내',
    author: '해양수산부',
    date: '2026-05-08 09:00',
    views: 156,
    period: '2026-05-08 ~',
    categoryLabel: '법률',
    file: { name: '산업입지_및_개발에_관한_법률.pdf', size: '512 KB' },
    body: `
      <p>항만시설물 입지·개발과 관련된 「산업입지 및 개발에 관한 법률」 주요 내용을 안내드립니다.</p>
      <p>관련 업무 수행 시 첨부 법률 자료를 참고해 주시기 바랍니다.</p>
    `,
  },
};

const BOARD_TAB_LABELS = {
  law: '법/지침/규정',
  forms: '각종서식',
  software: '매뉴얼 등',
  plan: '기본계획평면도',
  materials: '안전점검 관련자료',
  etc: '기타',
};

const BOARD_TABS = [
  { id: 'law', label: BOARD_TAB_LABELS.law },
  { id: 'forms', label: BOARD_TAB_LABELS.forms },
  { id: 'software', label: BOARD_TAB_LABELS.software },
  { id: 'plan', label: BOARD_TAB_LABELS.plan },
  { id: 'materials', label: BOARD_TAB_LABELS.materials },
  { id: 'etc', label: BOARD_TAB_LABELS.etc },
];

const TITLE_STRIP_EXT_TABS = new Set(['law', 'forms', 'software']);

function stripFileExtension(fileName) {
  const name = String(fileName || '').trim();
  if (!name || name === '-') return name;
  return name.replace(/\.[^./\\]+$/, '');
}

function displayBoardTitle(fileName, tab) {
  if (TITLE_STRIP_EXT_TABS.has(tab)) return stripFileExtension(fileName);
  return String(fileName || '');
}

function mapTupleRows(tab, rows) {
  return rows.map((row, index) => ({
    id: `${tab}-${index + 1}`,
    tab,
    fileName: row[0],
    title: displayBoardTitle(row[0], tab),
    desc: row[1],
    writer: row[2],
    date: row[3],
    size: row[4],
    categoryLabel: BOARD_TAB_LABELS[tab],
    body: row[1],
  }));
}

function mapLawRows() {
  return RELATED_LAW_DATA.map((item) => {
    const detail = RELATED_LAW_DETAILS[item.id];
    const fileName = detail?.file?.name || `${item.title}.pdf`;
    const size = detail?.file?.size || '1.20 MB';
    const desc = detail
      ? String(detail.body || '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      : `${item.title} 관련 안내입니다.`;

    return {
      id: String(item.id),
      tab: 'law',
      fileName,
      title: item.title,
      desc,
      writer: item.author,
      date: item.date,
      size,
      categoryLabel: item.categoryLabel,
      views: item.views,
      body: detail?.body || `<p>${item.title} 관련 안내입니다.</p>`,
    };
  });
}

const BOARD_DATA = {
  law: mapLawRows(),
  forms: mapTupleRows('forms', [
    ['시설물 등록 신청서.hwp', '신규 항만시설물 등록 신청 시 사용하는 표준 서식입니다.', '김관리', '2024-05-03', '128 KB'],
    ['점검결과 보고서 양식.xlsx', '정기점검 결과를 제출하기 위한 엑셀 보고 양식입니다.', '박주임', '2024-04-18', '342 KB'],
    ['보수보강 실적 제출서.docx', '보수보강 실적 등록 및 제출에 사용하는 문서 서식입니다.', '최기술', '2024-04-02', '96 KB'],
    ['안전점검 사진대장.xlsx', '현장 사진 정리 및 제출용 사진대장 양식입니다.', '이담당', '2024-03-22', '512 KB'],
    ['유지관리계획 제출서.hwp', '연간 유지관리계획 제출을 위한 기본 서식입니다.', '김관리', '2024-03-08', '141 KB'],
    ['시설물 변경신청서.hwp', '시설물 제원 변경 및 관리정보 변경 신청서입니다.', '박주임', '2024-02-21', '118 KB'],
    ['점검자 명단 양식.xlsx', '점검 참여기술자 명단 작성용 양식입니다.', '최기술', '2024-02-05', '224 KB'],
    ['자료 제출 확인서.docx', '기관 자료 제출 확인에 사용하는 확인서 양식입니다.', '이담당', '2024-01-19', '84 KB'],
    ['업무협의 기록지.hwp', '유지관리 업무협의 내용 기록 서식입니다.', '김관리', '2024-01-08', '76 KB'],
    ['첨부파일 목록표.xlsx', '제출 첨부파일 목록을 정리하는 표준 양식입니다.', '박주임', '2023-12-26', '166 KB'],
  ]),
  software: mapTupleRows('software', [
    ['POMS 점검자료 변환도구.zip', '점검자료 엑셀 파일을 시스템 업로드 형식으로 변환하는 도구입니다.', '시스템', '2024-05-07', '18.2 MB'],
    ['도면 이미지 뷰어 설치파일.exe', '계획평면도 및 이미지 자료 확인용 뷰어 설치파일입니다.', '시스템', '2024-04-16', '42.1 MB'],
    ['모바일 점검앱 매뉴얼 패키지.zip', '모바일 점검앱 설치파일과 사용자 매뉴얼 묶음입니다.', '김관리', '2024-03-29', '24.8 MB'],
    ['좌표 변환 유틸리티.zip', '항만시설 위치 좌표 변환 보조 유틸리티입니다.', '최기술', '2024-03-11', '6.4 MB'],
    ['보고서 PDF 병합도구.zip', '여러 보고서 PDF를 하나로 병합하는 간단 도구입니다.', '시스템', '2024-02-27', '9.7 MB'],
    ['파일명 일괄정리 프로그램.zip', '제출자료 파일명을 표준 규칙으로 정리하는 프로그램입니다.', '이담당', '2024-02-08', '4.9 MB'],
    ['POMS 인증서 점검도구.exe', '로그인 인증서 상태를 확인하는 점검 도구입니다.', '시스템', '2024-01-25', '12.5 MB'],
    ['사진 압축 프로그램.zip', '현장 사진 용량을 일괄 압축하는 프로그램입니다.', '박주임', '2024-01-12', '7.2 MB'],
    ['브라우저 설정 가이드.zip', 'POMS 사용을 위한 브라우저 설정 파일 모음입니다.', '김관리', '2024-01-04', '3.8 MB'],
    ['데이터 검증 스크립트.zip', '업로드 전 기초 데이터 오류를 점검하는 스크립트입니다.', '최기술', '2023-12-19', '2.6 MB'],
  ]),
  plan: mapTupleRows('plan', [
    ['광주항 계획평면도.pdf', '광주항 기본계획평면도입니다.', '김관리', '2024-07-01', '2.40 MB'],
    ['부산항 계획평면도.pdf', '부산항 기본계획평면도입니다.', '이담당', '2024-06-28', '3.12 MB'],
    ['인천항 계획평면도.pdf', '인천항 기본계획평면도입니다.', '박주임', '2024-06-20', '2.86 MB'],
    ['광양항 계획평면도.pdf', '광양항 기본계획평면도입니다.', '최기술', '2024-06-12', '2.54 MB'],
    ['여수항 계획평면도.pdf', '여수항 기본계획평면도입니다.', '김관리', '2024-06-04', '1.98 MB'],
    ['목포항 계획평면도.pdf', '목포항 기본계획평면도입니다.', '이담당', '2024-05-27', '2.21 MB'],
    ['울산항 계획평면도.pdf', '울산항 기본계획평면도입니다.', '박주임', '2024-05-18', '2.67 MB'],
    ['평택당진항 계획평면도.pdf', '평택당진항 기본계획평면도입니다.', '최기술', '2024-05-09', '3.05 MB'],
    ['군산항 계획평면도.pdf', '군산항 기본계획평면도입니다.', '김관리', '2024-04-30', '1.76 MB'],
    ['마산항 계획평면도.pdf', '마산항 기본계획평면도입니다.', '이담당', '2024-04-21', '2.09 MB'],
  ]),
  materials: mapTupleRows('materials', [
    ['정기안전점검 수행 매뉴얼.pdf', '정기안전점검 수행 매뉴얼입니다.', '김관리', '2024-05-12', '1.80 MB'],
    ['정밀안전점검 현장 체크리스트.xlsx', '정밀안전점검 현장 체크리스트입니다.', '박주임', '2024-05-12', '452 KB'],
    ['항만시설 안전등급 판정 기준.pdf', '항만시설 안전등급 판정 기준입니다.', '이담당', '2024-05-12', '2.14 MB'],
    ['취약시설물 중점관리 안내.pdf', '취약시설물 중점관리 안내입니다.', '최기술', '2024-05-12', '1.36 MB'],
    ['점검결과 보고서 작성 예시.hwp', '점검결과 보고서 작성 예시입니다.', '김관리', '2024-05-12', '864 KB'],
    ['보수보강 조치계획 작성 가이드.pdf', '보수보강 조치계획 작성 가이드입니다.', '이담당', '2024-05-12', '1.52 MB'],
    ['안전점검 사진 촬영 기준.pdf', '안전점검 사진 촬영 기준입니다.', '박주임', '2024-05-12', '980 KB'],
    ['시설물별 주요 손상 유형.pdf', '시설물별 주요 손상 유형입니다.', '최기술', '2024-05-12', '2.08 MB'],
    ['점검자 교육자료.pdf', '점검자 교육자료입니다.', '김관리', '2024-05-12', '3.41 MB'],
    ['현장 안전관리 유의사항.pdf', '현장 안전관리 유의사항입니다.', '이담당', '2024-05-12', '724 KB'],
  ]),
  etc: mapTupleRows('etc', [
    ['항만시설물 교육자료.pdf', '항만시설물 유지관리 교육에 사용하는 공통 교육자료입니다.', '김관리', '2024-05-02', '8.12 MB'],
    ['FAQ 모음.pdf', 'POMS 사용 중 자주 묻는 질문과 답변 자료입니다.', '이담당', '2024-04-20', '1.34 MB'],
    ['업무 연락처 목록.xlsx', '기관별 유지관리 업무 담당자 연락처 목록입니다.', '박주임', '2024-04-05', '248 KB'],
    ['시스템 사용자 안내문.pdf', '신규 사용자 대상 시스템 이용 안내문입니다.', '시스템', '2024-03-19', '932 KB'],
    ['정기교육 일정표.xlsx', '2024년도 정기교육 일정표입니다.', '김관리', '2024-03-01', '154 KB'],
    ['현장점검 우수사례.pdf', '현장점검 및 유지관리 우수사례 참고자료입니다.', '최기술', '2024-02-16', '6.41 MB'],
    ['자료 제출 유의사항.pdf', '자료 제출 시 유의해야 할 항목을 정리한 안내자료입니다.', '이담당', '2024-02-02', '724 KB'],
    ['기관별 업무분장표.xlsx', '기관별 자료 등록 및 검토 업무분장표입니다.', '박주임', '2024-01-23', '311 KB'],
    ['용어 해설집.pdf', '항만시설물 관리 관련 주요 용어 해설집입니다.', '김관리', '2024-01-09', '2.08 MB'],
    ['회의자료.zip', '자료실 운영 개선 회의 참고자료입니다.', '시스템', '2023-12-22', '5.63 MB'],
  ]),
};

function getBoardRows(tab) {
  return BOARD_DATA[tab] ? [...BOARD_DATA[tab]] : [];
}

function getAllBoardRows() {
  return BOARD_TABS.flatMap((tab) => getBoardRows(tab.id));
}

function findBoardRow(id) {
  const raw = String(id ?? '').trim();
  if (!raw) return null;
  return getAllBoardRows().find((row) => row.id === raw) || null;
}

function toDetailData(row) {
  if (!row) return null;
  return {
    title: row.title,
    writer: row.writer,
    author: row.writer,
    date: row.date,
    size: row.size,
    fileName: row.fileName,
    desc: row.desc,
    categoryLabel: row.categoryLabel,
    tab: row.tab,
    body: row.body || row.desc || '',
    file: row.fileName ? { name: row.fileName, size: row.size } : null,
  };
}

function resolveBoardDetail(id) {
  const row = findBoardRow(id);
  return { listItem: row, data: toDetailData(row) };
}

function resolveRelatedLawDetail(id) {
  const numId = Number(id);
  if (Number.isFinite(numId) && numId > 0) {
    const listItem = RELATED_LAW_DATA.find((n) => n.id === numId);
    let data = RELATED_LAW_DETAILS[numId];
    if (!data && listItem) {
      data = {
        title: listItem.title,
        author: listItem.author,
        writer: listItem.author,
        date: `${listItem.date} 09:00`,
        views: listItem.views,
        period: '-',
        categoryLabel: listItem.categoryLabel,
        file: null,
        desc: `${listItem.title} 관련 안내입니다.`,
        body: `<p>${listItem.title} 관련 안내입니다.</p><p>자세한 내용은 관리자에게 문의해 주세요.</p>`,
      };
    }
    if (data) {
      return {
        listItem,
        data: {
          ...data,
          writer: data.author || data.writer,
          views: data.views ?? listItem?.views,
          categoryLabel: data.categoryLabel || listItem?.categoryLabel,
        },
      };
    }
  }

  const board = resolveBoardDetail(id);
  return board;
}

window.PomsRelatedLaws = {
  RELATED_LAW_DATA,
  BOARD_TABS,
  BOARD_TAB_LABELS,
  BOARD_DATA,
  getBoardRows,
  getAllBoardRows,
  displayBoardTitle,
  resolveBoardDetail,
  resolveRelatedLawDetail,
};
