/** 안전등급현황 샘플 데이터 */

const GRADE_SUMMARY_GENERAL = [
  { port: '부산지방해양수산청', A: 42, B: 68, C: 31, D: 8, E: 2, other: 4 },
  { port: '여수지방해양수산청', A: 26, B: 47, C: 22, D: 6, E: 1, other: 3 },
  { port: '여수광양항만공사', A: 35, B: 52, C: 19, D: 4, E: 0, other: 2 },
  { port: '인천항만공사', A: 31, B: 44, C: 18, D: 5, E: 1, other: 1 },
  { port: '부산항만공사', A: 29, B: 39, C: 14, D: 3, E: 0, other: 2 },
  { port: '경상북도', A: 12, B: 21, C: 11, D: 4, E: 1, other: 0 },
  { port: '울산항만공사', A: 22, B: 33, C: 15, D: 3, E: 1, other: 1 },
  { port: '목포지방해양수산청', A: 18, B: 29, C: 16, D: 5, E: 2, other: 2 },
  { port: '군산지방해양수산청', A: 15, B: 27, C: 12, D: 4, E: 1, other: 1 },
  { port: '동해지방해양수산청', A: 14, B: 24, C: 13, D: 3, E: 0, other: 2 },
  { port: '포항지방해양수산청', A: 17, B: 25, C: 10, D: 2, E: 1, other: 1 },
  { port: '평택지방해양수산청', A: 20, B: 30, C: 14, D: 4, E: 0, other: 2 },
  { port: '마산지방해양수산청', A: 13, B: 22, C: 11, D: 3, E: 1, other: 0 },
  { port: '제주특별자치도', A: 16, B: 28, C: 12, D: 5, E: 1, other: 1 },
  { port: '울릉군', A: 8, B: 14, C: 9, D: 2, E: 0, other: 1 },
];

const GRADE_SUMMARY_SAFETY = [
  { port: '부산지방해양수산청', good: 74, normal: 24, poor: 4 },
  { port: '여수지방해양수산청', good: 48, normal: 18, poor: 3 },
  { port: '여수광양항만공사', good: 56, normal: 16, poor: 2 },
  { port: '인천항만공사', good: 43, normal: 15, poor: 3 },
  { port: '부산항만공사', good: 39, normal: 12, poor: 1 },
  { port: '경상북도', good: 19, normal: 9, poor: 2 },
  { port: '울산항만공사', good: 34, normal: 11, poor: 2 },
  { port: '목포지방해양수산청', good: 28, normal: 10, poor: 3 },
  { port: '군산지방해양수산청', good: 25, normal: 8, poor: 2 },
  { port: '동해지방해양수산청', good: 22, normal: 9, poor: 1 },
  { port: '포항지방해양수산청', good: 27, normal: 7, poor: 2 },
  { port: '평택지방해양수산청', good: 31, normal: 10, poor: 1 },
  { port: '마산지방해양수산청', good: 21, normal: 8, poor: 2 },
  { port: '제주특별자치도', good: 29, normal: 11, poor: 2 },
  { port: '울릉군', good: 12, normal: 5, poor: 1 },
];

const GRADE_DETAILS = {
  강구항: {
    mooring: [
      { subPort: '강구항', category: '계류시설', name: '1부두 안벽', grade: 'A' },
      { subPort: '강구항', category: '계류시설', name: '2부두 계류장', grade: 'B' },
      { subPort: '강구항', category: '계류시설', name: '물양장', grade: 'C' },
      { subPort: '강구항', category: '계류시설', name: '3부두 선착장', grade: 'B' },
      { subPort: '강구항', category: '계류시설', name: '어선부두', grade: 'C' },
    ],
    outer: [
      { subPort: '강구항', category: '외곽시설', name: '동방파제', grade: 'B' },
      { subPort: '강구항', category: '외곽시설', name: '서방파제', grade: 'A' },
      { subPort: '강구항', category: '외곽시설', name: '호안', grade: 'C' },
      { subPort: '강구항', category: '외곽시설', name: '감천방파제', grade: 'B' },
    ],
    pier: [
      { subPort: '강구항', category: '부두포장', name: '북부두 포장', grade: 'B' },
      { subPort: '강구항', category: '부두포장', name: '남부두 포장', grade: 'C' },
    ],
    safety: [
      { subPort: '강구항', category: '안전시설', name: '계단식 호안', grade: '양호' },
      { subPort: '강구항', category: '안전시설', name: '안전난간', grade: '보통' },
      { subPort: '강구항', category: '안전시설', name: '소화설비', grade: '양호' },
    ],
  },
  강진항: {
    mooring: [
      { subPort: '강진항', category: '계류시설', name: '강진항 부두', grade: 'B' },
      { subPort: '강진항', category: '계류시설', name: '강진항 선착장', grade: 'C' },
    ],
    outer: [
      { subPort: '강진항', category: '외곽시설', name: '방파제', grade: 'B' },
    ],
    pier: [
      { subPort: '강진항', category: '부두포장', name: '부두포장(1)', grade: 'C' },
    ],
    safety: [
      { subPort: '강진항', category: '안전시설', name: '경고표지', grade: '양호' },
      { subPort: '강진항', category: '안전시설', name: '조명시설', grade: '불량' },
    ],
  },
  군산항: {
    mooring: [
      { subPort: '군산항', category: '계류시설', name: '1부두', grade: 'A' },
      { subPort: '군산항', category: '계류시설', name: '2부두', grade: 'B' },
      { subPort: '군산항', category: '계류시설', name: '컨테이너부두', grade: 'A' },
      { subPort: '군산항', category: '계류시설', name: '잡화부두', grade: 'B' },
      { subPort: '군산항', category: '계류시설', name: '어선부두', grade: 'C' },
    ],
    outer: [
      { subPort: '군산항', category: '외곽시설', name: '신항 방파제', grade: 'B' },
      { subPort: '군산항', category: '외곽시설', name: '호안', grade: 'C' },
      { subPort: '군산항', category: '외곽시설', name: '구항 방파제', grade: 'B' },
      { subPort: '군산항', category: '외곽시설', name: '남호안', grade: 'D' },
    ],
    pier: [
      { subPort: '군산항', category: '부두포장', name: '신항 포장', grade: 'B' },
      { subPort: '군산항', category: '부두포장', name: '구항 포장', grade: 'D' },
      { subPort: '군산항', category: '부두포장', name: '연안 포장', grade: 'C' },
    ],
    safety: [
      { subPort: '군산항', category: '안전시설', name: '안전울타리', grade: '양호' },
      { subPort: '군산항', category: '안전시설', name: '비상계단', grade: '보통' },
    ],
  },
  목포항: {
    mooring: [
      { subPort: '목포항', category: '계류시설', name: '북항 부두', grade: 'A' },
      { subPort: '목포항', category: '계류시설', name: '연안부두', grade: 'B' },
    ],
    outer: [
      { subPort: '목포항', category: '외곽시설', name: '방파제', grade: 'B' },
    ],
    pier: [
      { subPort: '목포항', category: '부두포장', name: '여객터미널 포장', grade: 'A' },
    ],
    safety: [
      { subPort: '목포항', category: '안전시설', name: '소방펌프', grade: '양호' },
      { subPort: '목포항', category: '안전시설', name: '안전표지판', grade: '양호' },
    ],
  },
};

function buildDefaultDetails(port) {
  const agencyPortMap = {
    부산지방해양수산청: ['부산항', '북항'],
    여수지방해양수산청: ['여수항', '여천항'],
    여수광양항만공사: ['광양항', '광양항'],
    인천항만공사: ['인천항', '신항'],
    부산항만공사: ['부산항', '남항'],
    경상북도: ['구룡포항', '구룡포항'],
    울산항만공사: ['울산항', '본항'],
    목포지방해양수산청: ['목포항', '북항'],
    군산지방해양수산청: ['군산항', '내항'],
    동해지방해양수산청: ['동해항', '묵호항'],
    포항지방해양수산청: ['포항항', '구항'],
    평택지방해양수산청: ['평택당진항', '평택항'],
    마산지방해양수산청: ['마산항', '중앙부두'],
    제주특별자치도: ['제주항', '내항'],
    울릉군: ['울릉항', '사동항'],
  };
  const [mainPort, subPort] = agencyPortMap[port] || [port, port];
  const grades = ['A', 'B', 'C', 'D', 'E'];
  const mooring = Array.from({ length: 12 }, (_, i) => ({
    port: mainPort,
    subPort,
    category: '계류시설',
    name: `${mainPort} 계류시설 ${i + 1}`,
    grade: grades[i % grades.length],
  }));
  const outer = Array.from({ length: 10 }, (_, i) => ({
    port: mainPort,
    subPort,
    category: '외곽시설',
    name: `${mainPort} 외곽시설 ${i + 1}`,
    grade: grades[(i + 1) % grades.length],
  }));
  const pier = Array.from({ length: 8 }, (_, i) => ({
    port: mainPort,
    subPort,
    category: '부두포장',
    name: `${mainPort} 부두포장 ${i + 1}`,
    grade: grades[(i + 2) % grades.length],
  }));
  const safetyGrades = ['양호', '보통', '불량'];
  const safety = Array.from({ length: 12 }, (_, i) => ({
    port: mainPort,
    subPort,
    category: '안전시설',
    name: `${mainPort} 안전시설 ${i + 1}`,
    grade: safetyGrades[i % safetyGrades.length],
  }));
  return { mooring, outer, pier, safety };
}

function getPortDetails(port) {
  return GRADE_DETAILS[port] || buildDefaultDetails(port);
}
