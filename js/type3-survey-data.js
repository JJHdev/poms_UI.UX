/**
 * 제 3종 항만시설물 — 실태조사 공유 샘플 데이터
 */
window.Type3SurveyData = (() => {
  const FACILITY_POOL = [
    { name: '1부두 창고', type: '기타건축물' },
    { name: 'SK부두', type: '기타토목시설' },
    { name: '갑문 북방파제', type: '기타토목시설' },
    { name: '국제2잔교', type: '기타토목시설' },
    { name: '물양장(당섬)', type: '기타토목시설' },
    { name: '물양장(본도)', type: '기타토목시설' },
    { name: '상왕등도 물양장', type: '기타토목시설' },
    { name: '송도부두(1)', type: '기타토목시설' },
    { name: '수협 T형 돌제', type: '기타토목시설' },
    { name: '수협 어선계류장', type: '기타토목시설' },
    { name: '여객선터미널 창고', type: '기타건축물' },
    { name: '연안부두 물양장', type: '기타토목시설' },
    { name: '외항 방파호안', type: '기타토목시설' },
    { name: '4부두물양장(동빈)', type: '기타토목시설' },
    { name: '감천항 도류제', type: '기타토목시설' },
    { name: '고대부두 1번선석', type: '기타토목시설' },
  ];

  function pickFacilities(count, offset) {
    const items = [];
    for (let i = 0; i < count; i += 1) {
      items.push(FACILITY_POOL[(offset + i) % FACILITY_POOL.length]);
    }
    return {
      facilityNames: items.map((item) => item.name),
      facilityTypes: [...new Set(items.map((item) => item.type))],
    };
  }

  const SURVEYS = [
    { id: 's2025', manageNo: '2025', agency: '해양수산부', period: '2025-12-01 ~ 2025-12-31', department: '항만기술안전과', manager: '최수민', managerContact: '044-200-5956, choism1@korea.kr', facilityCount: 13, ...pickFacilities(13, 0), status: '조사완료', file: '2025년 제 3종 항만시설물 지정을 위한 실태조사 기본계획.hwpx' },
    { id: 's2024', manageNo: '2024', agency: '해양수산부', period: '2024-12-01 ~ 2024-12-31', department: '항만기술안전과', manager: '최준호', managerContact: '044-200-5957, choijh@korea.kr', facilityCount: 15, ...pickFacilities(15, 2), status: '조사완료', file: '2024년 제 3종 항만시설물 지정을 위한 실태조사 기본계획.hwpx' },
    { id: 's2023', manageNo: '2023', agency: '해양수산부', period: '2023-12-01 ~ 2023-12-31', department: '항만기술안전과', manager: '최준호', managerContact: '044-200-5957, choijh@korea.kr', facilityCount: 11, ...pickFacilities(11, 4), status: '조사완료', file: '2023년 제 3종 항만시설물 지정을 위한 실태조사 기본계획.hwpx' },
    { id: 's2022', manageNo: '2022', agency: '해양수산부', period: '2022-12-01 ~ 2022-12-30', department: '항만기술안전과', manager: '최준호', managerContact: '044-200-5957, choijh@korea.kr', facilityCount: 16, ...pickFacilities(16, 1), status: '조사완료', file: '2022년 제 3종 항만시설물 지정을 위한 실태조사 기본계획.hwpx' },
    { id: 's2021', manageNo: '2021', agency: '해양수산부', period: '2021-12-01 ~ 2021-12-31', department: '항만기술안전과', manager: '김슬기', managerContact: '044-200-5958, kimsk@korea.kr', facilityCount: 22, ...pickFacilities(22, 3), status: '조사완료', file: '2021년 제 3종 항만시설물 지정을 위한 실태조사 기본계획.hwpx' },
    { id: 's2020', manageNo: '2020', agency: '해양수산부', period: '2020-12-01 ~ 2020-12-31', department: '항만기술안전과', manager: '김슬기', managerContact: '044-200-5958, kimsk@korea.kr', facilityCount: 37, ...pickFacilities(37, 5), status: '조사완료', file: '2020년 제 3종 항만시설물 지정을 위한 실태조사 기본계획.hwpx' },
    { id: 's2019', manageNo: '2019', agency: '해양수산부', period: '2019-12-01 ~ 2019-12-31', department: '항만기술안전과', manager: '박민재', managerContact: '044-200-5959, parkminj@korea.kr', facilityCount: 28, ...pickFacilities(28, 6), status: '조사완료', file: '2019년 제 3종 항만시설물 지정을 위한 실태조사 기본계획.hwpx' },
    { id: 's2018', manageNo: '2018', agency: '해양수산부', period: '2018-12-01 ~ 2018-12-28', department: '항만기술안전과', manager: '박민재', managerContact: '044-200-5959, parkminj@korea.kr', facilityCount: 19, ...pickFacilities(19, 7), status: '조사완료', file: '2018년 제 3종 항만시설물 지정을 위한 실태조사 기본계획.hwpx' },
    { id: 's2017', manageNo: '2017', agency: '해양수산부', period: '2017-12-01 ~ 2017-12-29', department: '항만기술안전과', manager: '이하늘', managerContact: '044-200-5960, leehaneul@korea.kr', facilityCount: 24, ...pickFacilities(24, 8), status: '조사완료', file: '2017년 제 3종 항만시설물 지정을 위한 실태조사 기본계획.hwpx' },
    { id: 's2016', manageNo: '2016', agency: '해양수산부', period: '2016-12-01 ~ 2016-12-30', department: '항만기술안전과', manager: '이하늘', managerContact: '044-200-5960, leehaneul@korea.kr', facilityCount: 18, ...pickFacilities(18, 9), status: '조사완료', file: '2016년 제 3종 항만시설물 지정을 위한 실태조사 기본계획.hwpx' },
    { id: 's2026', manageNo: '2026', agency: '해양수산부', period: '2026-03-01 ~ 2026-12-31', department: '항만기술안전과', manager: '최수민', managerContact: '044-200-5956, choism1@korea.kr', facilityCount: 8, ...pickFacilities(8, 0), status: '조사중', file: '2026년 제 3종 항만시설물 지정을 위한 실태조사 기본계획.hwpx' },
    { id: 's2026b', manageNo: '2026-02', agency: '해양수산부', period: '2026-01-15 ~ 2026-06-30', department: '항만기술안전과', manager: '정수연', managerContact: '044-200-5961, jungsy@korea.kr', facilityCount: 5, ...pickFacilities(5, 10), status: '조사중', file: '2026년 상반기 제 3종 항만시설물 실태조사 계획.hwpx' },
  ];

  const FACILITIES = [
    { name: '1부두 창고', type: '기타건축물', scale: '지상 1층 / 1,240㎡', address: '전북특별자치도 군산시 소룡동 11', builtYear: '1979', owner: '군산지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-08-19', inputState: '입력완료', assignState: '지정완료' },
    { name: 'SK부두', type: '기타토목시설', scale: '', address: '경상남도 창원시 마산합포구 가포동 604', builtYear: '1983', owner: '마산지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-07-21', inputState: '입력완료', assignState: '지정완료' },
    { name: '갑문 북방파제', type: '기타토목시설', scale: '', address: '인천광역시 중구 북성동1가 120', builtYear: '1977', owner: '인천지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-07-30', inputState: '입력완료', assignState: '지정완료' },
    { name: '국제2잔교', type: '기타토목시설', scale: '', address: '인천광역시 중구 항동7가 85-81', builtYear: '1995', owner: '인천항만공사', note: 'FMS', assignee: '', surveyDate: '2025-08-21', inputState: '입력완료', assignState: '지정완료' },
    { name: '물양장(당섬)', type: '기타토목시설', scale: '', address: '인천광역시 옹진군 연평면 연평리 497-4', builtYear: '1995', owner: '인천지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-09-18', inputState: '입력완료', assignState: '지정완료' },
    { name: '물양장(본도)', type: '기타토목시설', scale: '', address: '인천광역시 옹진군 연평면 연평리 493-3', builtYear: '1995', owner: '인천지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-09-18', inputState: '입력완료', assignState: '지정완료' },
    { name: '상왕등도 물양장', type: '기타토목시설', scale: '', address: '전북특별자치도 부안군 위도면 상왕등길 5', builtYear: '1993', owner: '군산지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-09-11', inputState: '입력완료', assignState: '지정완료' },
    { name: '송도부두(1)', type: '기타토목시설', scale: '', address: '경상북도 포항시 남구 송도동 253-109', builtYear: '1984', owner: '포항지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-07-03', inputState: '입력완료', assignState: '지정완료' },
    { name: '수협 T형 돌제', type: '기타토목시설', scale: '', address: '경상남도 창원시 마산합포구 오동동 323-8', builtYear: '1994', owner: '마산지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-07-21', inputState: '입력완료', assignState: '지정완료' },
    { name: '수협 어선계류장', type: '기타토목시설', scale: '', address: '경상남도 창원시 마산합포구 오동동 323-8', builtYear: '1994', owner: '마산지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-07-21', inputState: '입력완료', assignState: '지정완료' },
    { name: '여객선터미널 창고', type: '기타건축물', scale: '지상 1층 / 860㎡', address: '전라남도 목포시 항동 6-26', builtYear: '1988', owner: '목포지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-08-05', inputState: '입력완료', assignState: '지정완료' },
    { name: '연안부두 물양장', type: '기타토목시설', scale: '', address: '인천광역시 중구 항동7가 27-1', builtYear: '1990', owner: '인천지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-08-28', inputState: '입력완료', assignState: '지정완료' },
    { name: '외항 방파호안', type: '기타토목시설', scale: '', address: '경상북도 포항시 북구 항구동 58-1', builtYear: '1986', owner: '포항지방해양수산청', note: 'FMS', assignee: '', surveyDate: '2025-09-02', inputState: '입력완료', assignState: '지정완료' },
  ];

  const STEP_META = {
    target: {
      badge: 'STEP. 01',
      stepLabel: '대상시설물 선정',
      title: '대상시설물 목록',
      stateLabel: '입력상태',
      stateOptions: ['입력대기', '입력완료'],
      ownerLabel: '관리주체',
      guide: false,
      columns: ['번호', '시설물명', '시설물종류', '시설물규모', '소재지', '준공일', '관리주체', '비고'],
    },
    assign: {
      badge: 'STEP. 02',
      stepLabel: '담당자 지정',
      title: '담당자 지정 목록',
      stateLabel: '지정상태',
      stateOptions: ['지정대기', '지정완료'],
      ownerLabel: '담당자',
      guide: false,
      columns: ['번호', '시설물명', '조사담당자', '시설물종류', '소재지', '준공일', '관리주체', '시설물규모'],
    },
    conduct: {
      badge: 'STEP. 03',
      stepLabel: '실태조사 실시',
      title: '실태조사 목록',
      stateLabel: '입력상태',
      stateOptions: ['조사대기', '조사완료'],
      ownerLabel: '담당자',
      guide: true,
      columns: ['번호', '시설물명', '담당자', '실태조사일', '시설물종류', '소재지', '준공일', '관리주체'],
    },
  };

  const CREATE_STEP_META = {
    target: { title: '대상시설물 선정', guide: '실태조사 대상 시설물을 체크하여 선택하세요.' },
    assign: { title: '담당자 지정', guide: '선택한 시설물별로 조사담당자를 입력하세요.' },
    conduct: { title: '실태조사 실시', guide: '시설물별 실태조사일을 입력하세요.' },
  };

  const REPORT_QUESTIONS = [
    '1. 시설물 주변의 지반 침하 또는 이로 인한 건물의 기울음, 균열 상태',
    '2. 구조부재의 균열, 누수 상태',
    '3. 구조부재의 변형(처짐, 기울음, 단면손실 등) 상태',
    '4. 구조부재의 철근 부식, 노출 또는 콘크리트 박리·박락 상태',
    '5. 철골부재의 접합부 상태(볼트 풀림, 누락, 탈락, 용접불량)',
    '6. 철골부재의 변형(기울음, 좌굴 등) 상태',
    '7. 철골부재의 부식 또는 부재 미시공, 단면손실 상태',
  ];

  const REPORTS = {
    '1부두 창고|2025': {
      date: '2025-08-19',
      facilityType: '[기타건축물] 기타 안전관리가 필요한 것으로 인정하는 건축물',
      assignee: '',
      owner: '군산지방해양수산청',
      ownerContact: '063-441-2282, 010-6228-1509',
      engineer: { name: '이남규', org: '(주)한국국토안전연구원', contact: '010-3558-2890' },
      rows: [
        { opinion: '부등침하 및 침하 흔적 없음.', repair: false, grade: 'b' },
        { opinion: '지붕 누수 흔적 없음', repair: false, grade: 'b' },
        { opinion: '철골부재 변형 없음', repair: false, grade: 'b' },
        { opinion: '콘크리트 캐노피 일부 철근 노출 조사됨', repair: true, grade: 'c' },
        { opinion: '접합부 상태 양호', repair: false, grade: 'b' },
        { opinion: '철골부재 변형 없음', repair: false, grade: 'b' },
        { opinion: '철골부재 변형 없음', repair: false, grade: 'b' },
      ],
      score: '7.57',
      safety: '주의관찰',
      urgent: '불필요',
      majorDefect: '없음',
      diagnosis: '불필요',
      action: '불필요',
      opinion: '철골조의 건물에서 철골부재는 하중에 의한 변형이나 접합부가 양호하며, 지반 상태 또한 부등침하나 구조체의 침하로 인한 주변 지반의 이격이 없는 양호한 상태이나, 일부 콘크리트 캐노피에서 콘크리트 박리로 인한 철근노출이 조사되어 철근 부식으로 인한 인접 콘크리트의 추가적인 박리 방지를 위해 보수가 필요한 것으로 판단됨',
    },
    '1부두 창고|2023': {
      date: '2023-05-02',
      facilityType: '[기타건축물] 기타 안전관리가 필요한 것으로 인정하는 건축물',
      assignee: '',
      owner: '군산지방해양수산청',
      ownerContact: '063-441-2282, 010-6228-1509',
      engineer: { name: '이남규', org: '한국국토안전연구원', contact: '—' },
      rows: [
        { opinion: '침하 및 기울음 등 특이사항 없음', repair: false, grade: 'b' },
        { opinion: '구조부재 중 특이사항 없음', repair: false, grade: 'c' },
        { opinion: '내부 장비 운행 중 충돌의 영향으로 일부 지붕층 2차 부재(철골보)에 변형 및 브레이스의 파단 발생', repair: false, grade: 'c' },
        { opinion: '테두리 보의 피복 박락으로 철근노출 및 캐노피 하부 철근 노출', repair: true, grade: 'd' },
        { opinion: '볼트 및 용접부에 특이사항 없음', repair: false, grade: 'c' },
        { opinion: '주철골부재의 변형 없이 양호', repair: false, grade: 'b' },
        { opinion: '심각한 부식은 없으나 경과년수의 증가로 인한 철골 기둥 하부의 도장 노후화 확인됨', repair: true, grade: 'c' },
      ],
      score: '5.4',
      safety: '주의관찰',
      urgent: '불필요',
      majorDefect: '없음',
      diagnosis: '불필요',
      action: '불필요',
      opinion: '-2차 철골부재의 변형 및 지붕 브레이스 탈락 및 테두리보의 피복박락으로 인한 철근 노출이 확인\n-일부 캐노피(캔틸레버 슬래브)하부 철근 노출이 확인\n-현장조사에 따른 종합점수는 5.4로 안전상태는 주의관찰 상태로 평가됨',
    },
  };

  function buildDefaultReport(name, date) {
    const facility = FACILITIES.find((row) => row.name === name);
    const isBuilding = facility?.type === '기타건축물';
    return {
      date: date || facility?.surveyDate || '',
      facilityType: isBuilding
        ? '[기타건축물] 기타 안전관리가 필요한 것으로 인정하는 건축물'
        : '[기타토목시설] 기타 안전관리가 필요한 것으로 인정하는 토목시설',
      assignee: '',
      owner: facility?.owner || '',
      ownerContact: '',
      engineer: { name: '이남규', org: '(주)한국국토안전연구원', contact: '010-3558-2890' },
      rows: REPORT_QUESTIONS.map(() => ({ opinion: '특이사항 없음', repair: false, grade: 'b' })),
      score: '8.0',
      safety: '양호',
      urgent: '불필요',
      majorDefect: '없음',
      diagnosis: '불필요',
      action: '불필요',
      opinion: '전반적으로 구조부재 및 접합부 상태가 양호하며 특이사항이 조사되지 않음.',
    };
  }

  function getReport(name, manageNo, date) {
    return REPORTS[`${name}|${manageNo}`] || buildDefaultReport(name, date);
  }

  function getSurvey(id) {
    return SURVEYS.find((row) => row.id === id) || null;
  }

  return {
    SURVEYS,
    FACILITIES,
    STEP_META,
    CREATE_STEP_META,
    REPORT_QUESTIONS,
    getSurvey,
    getReport,
  };
})();
