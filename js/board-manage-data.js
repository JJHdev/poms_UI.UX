/**
 * 관리자 게시판 데이터 (목록·상세·등록/수정 공용)
 */
const BoardManageData = (() => {
  const TAB_LABELS = {
    law: '법/지침/규정',
    forms: '각종서식',
    software: '매뉴얼 등',
    plan: '기본계획평면도',
    materials: '안전점검 관련자료',
    etc: '기타',
  };

  const TAB_ORDER = ['law', 'forms', 'software', 'plan', 'materials', 'etc'];

  const RAW = {
    law: (() => {
      const base = [
        ['항만법 시행령 고시문.pdf', '항만법 시행령 일부개정령(2024.05.10) 관련 고시문입니다.', '김관리', '2024-05-10', '1.28 MB'],
        ['항만시설 유지관리 지침_v2.0.pdf', '항만시설 유지관리 업무 수행 지침 개정(2024.04.01) 내용입니다.', '이담당', '2024-04-01', '2.45 MB'],
        ['시설물 안전점검 요령.pdf', '항만시설물 정기점검 및 안전점검 요령 절차 안내입니다.', '박주임', '2024-03-25', '856 KB'],
        ['콘크리트 구조물 유지관리 기준.hwp', '콘크리트 구조물의 유지관리 기준(2023년 개정) 문서입니다.', '최기술', '2024-03-12', '3.12 MB'],
        ['항만시설 설계기준(2023).pdf', '항만시설 설계기준(KDS 64 10 00:2023) 최신본입니다.', '김관리', '2024-02-20', '5.67 MB'],
        ['해양환경 보호지침.pdf', '항만 공사 시 해양환경 보호를 위한 지침 자료입니다.', '이담당', '2024-02-15', '1.05 MB'],
        ['시설물 점검 체크리스트.xlsx', '항만시설물 점검 항목별 체크리스트 양식입니다.', '박주임', '2024-01-30', '452 KB'],
        ['기술용역 과업지침(안).pdf', '항만시설 기술용역 과업지침(안) 자료입니다.', '최기술', '2024-01-18', '2.33 MB'],
        ['항만시설 안전관리 규정.pdf', '항만시설 안전관리 규정(시행일: 2024.01.01) 내용입니다.', '김관리', '2024-01-05', '1.91 MB'],
        ['기타 시설물 관리 사례집.pdf', '항만시설물 유지관리 우수사례 모음집입니다.', '이담당', '2023-12-28', '4.03 MB'],
      ];
      const rows = [];
      for (let i = 0; i < 91; i += 1) {
        rows.push(base[i % base.length]);
      }
      return rows;
    })(),
    forms: [
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
    ],
    software: [
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
    ],
    plan: [
      ['항만 기본계획 평면도 자료.zip', '항만 기본계획 관련 평면도 자료입니다.', '관리자', '2026-08-10', '24.7 MB'],
    ],
    materials: [
      ['안전점검 참고자료.pdf', '시설물 안전점검 시 참고할 수 있는 자료입니다.', '관리자', '2026-08-07', '3.5 MB'],
    ],
    etc: [
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
    ],
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function stripFileExtension(fileName) {
    return String(fileName || '').replace(/\.[^./\\]+$/, '');
  }

  function tabFromId(id) {
    const raw = String(id || '');
    const tab = raw.split('-')[0];
    return TAB_LABELS[tab] ? tab : 'law';
  }

  function toPost(tab, row, index) {
    const fileName = row[0];
    const desc = row[1];
    return {
      id: `${tab}-${index + 1}`,
      tab,
      title: stripFileExtension(fileName),
      fileName,
      desc,
      writer: row[2],
      date: row[3],
      size: row[4],
      category: TAB_LABELS[tab] || tab,
      body: `<p>${escapeHtml(desc)}</p>`,
    };
  }

  const TITLE_STRIP_EXT_TABS = new Set(['law', 'forms', 'software']);

  function displayTitle(post, tab) {
    const fileName = post && typeof post === 'object'
      ? (post.fileName || post.title || '')
      : String(post || '');
    const key = post && typeof post === 'object' ? post.tab : tab;
    if (TITLE_STRIP_EXT_TABS.has(key)) return stripFileExtension(fileName);
    return String(fileName || '');
  }

  function getRows(tab) {
    const key = TAB_LABELS[tab] ? tab : 'law';
    return (RAW[key] || []).map((row, index) => toPost(key, row, index));
  }

  function getById(id) {
    const tab = tabFromId(id);
    const rows = getRows(tab);
    return rows.find((row) => row.id === String(id)) || rows[0] || {
      id: String(id || 'law-1'),
      tab: 'law',
      title: '게시글',
      fileName: '',
      desc: '',
      writer: '관리자',
      date: '2026-08-20',
      size: '',
      category: TAB_LABELS.law,
      body: '<p>게시글 상세 내용입니다.</p>',
    };
  }

  function getInsertDefaults(tab) {
    const key = TAB_LABELS[tab] ? tab : 'law';
    return {
      id: '',
      tab: key,
      title: '',
      fileName: '',
      desc: '',
      writer: '관리자',
      date: '2026-08-20',
      size: '',
      category: TAB_LABELS[key],
      body: '',
    };
  }

  return {
    TAB_LABELS,
    TAB_ORDER,
    getRows,
    getById,
    getInsertDefaults,
    tabFromId,
    displayTitle,
  };
})();
