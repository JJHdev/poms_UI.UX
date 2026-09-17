/** 시설물통계 샘플 데이터 (2022.12 기준) */

const FACILITY_STATS_BASELINE = '2022.12';

/** 로그인 시설물정보 모달과 동일한 구조 (+ 타부서·민유관리) */
const FACILITY_STATS_OVERVIEW = {
  baseline: FACILITY_STATS_BASELINE,
  groups: [
    {
      kind: '1종',
      facilities: {
        mooring: { national: 85, local: 105, port: 88, otherDept: 14, civil: 10 },
        quay: { national: 28, local: 32, port: 22, otherDept: 6, civil: 4 },
        outer: { national: 92, local: 95, port: 58, otherDept: 12, civil: 8 },
        building: { national: 44, local: 50, port: 28, otherDept: 8, civil: 6 },
        bridge: { national: 20, local: 24, port: 8, otherDept: 4, civil: 3 },
        other: { national: 11, local: 14, port: 10, otherDept: 3, civil: 2 },
      },
    },
    {
      kind: '2종',
      facilities: {
        mooring: { national: 52, local: 68, port: 48, otherDept: 10, civil: 7 },
        quay: { national: 18, local: 22, port: 14, otherDept: 4, civil: 3 },
        outer: { national: 58, local: 62, port: 32, otherDept: 8, civil: 6 },
        building: { national: 28, local: 32, port: 18, otherDept: 5, civil: 4 },
        bridge: { national: 12, local: 14, port: 6, otherDept: 3, civil: 2 },
        other: { national: 8, local: 10, port: 6, otherDept: 2, civil: 2 },
      },
    },
    {
      kind: '3종',
      facilities: {
        mooring: { national: 34, local: 42, port: 32, otherDept: 6, civil: 5 },
        quay: { national: 12, local: 14, port: 10, otherDept: 3, civil: 2 },
        outer: { national: 38, local: 36, port: 22, otherDept: 5, civil: 4 },
        building: { national: 18, local: 22, port: 12, otherDept: 4, civil: 3 },
        bridge: { national: 8, local: 10, port: 4, otherDept: 2, civil: 1 },
        other: { national: 5, local: 7, port: 4, otherDept: 2, civil: 1 },
      },
    },
    {
      kind: '기타',
      facilities: {
        mooring: { national: 18, local: 24, port: 16, otherDept: 4, civil: 3 },
        quay: { national: 6, local: 8, port: 5, otherDept: 2, civil: 1 },
        outer: { national: 16, local: 20, port: 12, otherDept: 3, civil: 2 },
        building: { national: 10, local: 12, port: 6, otherDept: 2, civil: 2 },
        bridge: { national: 4, local: 5, port: 3, otherDept: 1, civil: 1 },
        other: { national: 3, local: 4, port: 3, otherDept: 1, civil: 1 },
      },
    },
  ],
};

/** 항별 현황 (관리주체별 합계) */
const FACILITY_STATS_BY_PORT = [
  {
    port: '부산항',
    mooring: { national: 42, local: 58, port: 48, otherDept: 8, civil: 6 },
    quay: { national: 14, local: 18, port: 12, otherDept: 3, civil: 2 },
    outer: { national: 38, local: 44, port: 28, otherDept: 6, civil: 4 },
    building: { national: 22, local: 26, port: 14, otherDept: 4, civil: 3 },
    bridge: { national: 10, local: 12, port: 5, otherDept: 2, civil: 1 },
    other: { national: 6, local: 8, port: 5, otherDept: 2, civil: 1 },
  },
  {
    port: '인천항',
    mooring: { national: 36, local: 48, port: 38, otherDept: 6, civil: 5 },
    quay: { national: 14, local: 18, port: 12, otherDept: 3, civil: 2 },
    outer: { national: 32, local: 36, port: 22, otherDept: 5, civil: 4 },
    building: { national: 18, local: 22, port: 12, otherDept: 3, civil: 2 },
    bridge: { national: 8, local: 10, port: 4, otherDept: 2, civil: 1 },
    other: { national: 5, local: 7, port: 4, otherDept: 1, civil: 1 },
  },
  {
    port: '광양항',
    mooring: { national: 28, local: 34, port: 28, otherDept: 5, civil: 4 },
    quay: { national: 10, local: 12, port: 8, otherDept: 2, civil: 2 },
    outer: { national: 26, local: 28, port: 18, otherDept: 4, civil: 3 },
    building: { national: 14, local: 16, port: 10, otherDept: 3, civil: 2 },
    bridge: { national: 6, local: 8, port: 3, otherDept: 1, civil: 1 },
    other: { national: 4, local: 5, port: 3, otherDept: 1, civil: 1 },
  },
  {
    port: '여수항',
    mooring: { national: 24, local: 30, port: 24, otherDept: 4, civil: 3 },
    quay: { national: 8, local: 10, port: 6, otherDept: 2, civil: 1 },
    outer: { national: 22, local: 24, port: 16, otherDept: 3, civil: 2 },
    building: { national: 12, local: 14, port: 8, otherDept: 2, civil: 2 },
    bridge: { national: 5, local: 6, port: 2, otherDept: 1, civil: 1 },
    other: { national: 3, local: 4, port: 2, otherDept: 1, civil: 0 },
  },
  {
    port: '군산항',
    mooring: { national: 18, local: 22, port: 18, otherDept: 3, civil: 2 },
    quay: { national: 6, local: 8, port: 5, otherDept: 1, civil: 1 },
    outer: { national: 16, local: 18, port: 12, otherDept: 2, civil: 2 },
    building: { national: 10, local: 12, port: 6, otherDept: 2, civil: 1 },
    bridge: { national: 4, local: 5, port: 2, otherDept: 1, civil: 0 },
    other: { national: 3, local: 3, port: 2, otherDept: 1, civil: 0 },
  },
  {
    port: '목포항',
    mooring: { national: 16, local: 20, port: 16, otherDept: 3, civil: 2 },
    quay: { national: 5, local: 6, port: 4, otherDept: 1, civil: 1 },
    outer: { national: 14, local: 16, port: 10, otherDept: 2, civil: 1 },
    building: { national: 8, local: 10, port: 6, otherDept: 1, civil: 1 },
    bridge: { national: 3, local: 4, port: 2, otherDept: 1, civil: 0 },
    other: { national: 2, local: 3, port: 2, otherDept: 0, civil: 1 },
  },
];

const FACILITY_STATS_FACILITY_KEY_BY_LABEL = {
  계류시설: 'mooring',
  안벽시설: 'quay',
  외곽시설: 'outer',
  건축물: 'building',
  교량시설: 'bridge',
  기타: 'other',
};

/** 시설구분별 상태등급 현황 */
const FACILITY_STATS_GRADE_BY_TYPE = [
  { key: 'mooring', label: '계류시설', grades: { a: 35, b: 530, c: 42, d: 4, e: 1, other: 86 } },
  { key: 'quay', label: '안벽시설', grades: { a: 18, b: 72, c: 28, d: 6, e: 2, other: 14 } },
  { key: 'outer', label: '외곽시설', grades: { a: 48, b: 210, c: 65, d: 12, e: 4, other: 38 } },
  { key: 'building', label: '건축물', grades: { a: 22, b: 95, c: 38, d: 8, e: 3, other: 18 } },
  { key: 'bridge', label: '교량시설', grades: { a: 10, b: 42, c: 18, d: 4, e: 1, other: 8 } },
  { key: 'other', label: '기타', grades: { a: 8, b: 32, c: 14, d: 3, e: 1, other: 6 } },
];

/** 항별 상태등급 현황 */
const FACILITY_STATS_GRADE_BY_PORT = [
  { port: '부산항', grades: { a: 42, b: 58, c: 48, d: 18, e: 6, other: 3 } },
  { port: '인천항', grades: { a: 36, b: 48, c: 38, d: 14, e: 5, other: 2 } },
  { port: '광양항', grades: { a: 28, b: 34, c: 28, d: 10, e: 4, other: 2 } },
  { port: '여수항', grades: { a: 24, b: 30, c: 24, d: 8, e: 3, other: 1 } },
  { port: '군산항', grades: { a: 18, b: 22, c: 18, d: 6, e: 2, other: 1 } },
  { port: '목포항', grades: { a: 16, b: 20, c: 16, d: 5, e: 2, other: 1 } },
];

/** 종별 상태등급 현황 */
const FACILITY_STATS_GRADE_BY_KIND = [
  { kind: '1종', grades: { a: 62, b: 248, c: 118, d: 28, e: 8, other: 42 } },
  { kind: '2종', grades: { a: 38, b: 156, c: 82, d: 18, e: 5, other: 24 } },
  { kind: '3종', grades: { a: 22, b: 88, c: 48, d: 10, e: 3, other: 14 } },
  { kind: '기타', grades: { a: 12, b: 42, c: 22, d: 6, e: 2, other: 8 } },
];

/** 종별 상태등급 상세 (시설구분별) — GRADE_OVERVIEW 생성에 사용 */
const FACILITY_STATS_GRADE_BY_KIND_DETAIL = [
  {
    kind: '1종',
    facilities: [
      { label: '계류시설', grades: { a: 18, b: 82, c: 32, d: 8, e: 2, other: 12 } },
      { label: '외곽시설', grades: { a: 22, b: 68, c: 28, d: 6, e: 2, other: 10 } },
      { label: '건축물', grades: { a: 12, b: 48, c: 24, d: 6, e: 2, other: 8 } },
      { label: '교량시설', grades: { a: 6, b: 28, c: 18, d: 4, e: 1, other: 6 } },
      { label: '기타', grades: { a: 4, b: 22, c: 16, d: 4, e: 1, other: 6 } },
    ],
  },
  {
    kind: '2종',
    facilities: [
      { label: '계류시설', grades: { a: 12, b: 52, c: 28, d: 6, e: 2, other: 8 } },
      { label: '외곽시설', grades: { a: 10, b: 42, c: 22, d: 4, e: 1, other: 6 } },
      { label: '건축물', grades: { a: 8, b: 32, c: 16, d: 4, e: 1, other: 5 } },
      { label: '교량시설', grades: { a: 4, b: 18, c: 10, d: 2, e: 1, other: 3 } },
      { label: '기타', grades: { a: 4, b: 12, c: 6, d: 2, e: 0, other: 2 } },
    ],
  },
  {
    kind: '3종',
    facilities: [
      { label: '계류시설', grades: { a: 8, b: 28, c: 16, d: 4, e: 1, other: 5 } },
      { label: '외곽시설', grades: { a: 6, b: 24, c: 12, d: 2, e: 1, other: 4 } },
      { label: '건축물', grades: { a: 4, b: 18, c: 10, d: 2, e: 1, other: 3 } },
      { label: '교량시설', grades: { a: 2, b: 10, c: 6, d: 1, e: 0, other: 1 } },
      { label: '기타', grades: { a: 2, b: 8, c: 4, d: 1, e: 0, other: 1 } },
    ],
  },
  {
    kind: '기타',
    facilities: [
      { label: '계류시설', grades: { a: 4, b: 14, c: 8, d: 2, e: 1, other: 3 } },
      { label: '외곽시설', grades: { a: 3, b: 12, c: 6, d: 2, e: 0, other: 2 } },
      { label: '건축물', grades: { a: 2, b: 8, c: 4, d: 1, e: 0, other: 2 } },
      { label: '교량시설', grades: { a: 1, b: 4, c: 2, d: 1, e: 0, other: 1 } },
      { label: '기타', grades: { a: 2, b: 4, c: 2, d: 0, e: 1, other: 0 } },
    ],
  },
];

/** 종별·시설구분별 상태등급 (차트·기타 집계용) */
const FACILITY_STATS_GRADE_OVERVIEW = {
  baseline: FACILITY_STATS_BASELINE,
  groups: FACILITY_STATS_GRADE_BY_KIND_DETAIL.map((group) => ({
    kind: group.kind,
    facilities: Object.fromEntries(
      group.facilities.map((facility) => [
        FACILITY_STATS_FACILITY_KEY_BY_LABEL[facility.label] || 'other',
        { ...facility.grades },
      ])
    ),
  })),
};

const SERVICE_YEAR_ROWS = [
  { key: 'under10', label: '10년미만' },
  { key: 'under20', label: '20년미만' },
  { key: 'under30', label: '30년미만' },
  { key: 'under40', label: '40년미만' },
  { key: 'over40', label: '40년 이상' },
  { key: 'unknownYear', label: '년도미상' },
];

/** 시설구분별 공용년수 */
const FACILITY_STATS_SERVICE_YEARS_BY_TYPE = [
  { label: '계류시설', years: { under10: 42, under20: 86, under30: 124, under40: 40, over40: 22, unknownYear: 6 } },
  { label: '외곽시설', years: { under10: 28, under20: 62, under30: 98, under40: 30, over40: 18, unknownYear: 4 } },
  { label: '건축물', years: { under10: 18, under20: 38, under30: 54, under40: 18, over40: 11, unknownYear: 3 } },
  { label: '교량시설', years: { under10: 8, under20: 16, under30: 22, under40: 7, over40: 4, unknownYear: 1 } },
  { label: '기타', years: { under10: 6, under20: 12, under30: 18, under40: 5, over40: 3, unknownYear: 0 } },
];

/** 항별 공용년수 */
const FACILITY_STATS_SERVICE_YEARS_BY_PORT = [
  { port: '부산항', years: { under10: 28, under20: 52, under30: 78, under40: 24, over40: 14, unknownYear: 4 } },
  { port: '인천항', years: { under10: 22, under20: 44, under30: 62, under40: 20, over40: 11, unknownYear: 3 } },
  { port: '광양항', years: { under10: 18, under20: 32, under30: 48, under40: 15, over40: 9, unknownYear: 2 } },
  { port: '여수항', years: { under10: 14, under20: 28, under30: 38, under40: 12, over40: 7, unknownYear: 1 } },
  { port: '군산항', years: { under10: 10, under20: 18, under30: 26, under40: 8, over40: 5, unknownYear: 1 } },
  { port: '목포항', years: { under10: 8, under20: 14, under30: 20, under40: 7, over40: 4, unknownYear: 1 } },
];

const SEISMIC_ROWS = [
  { key: 'designed', label: '내진설계적용' },
  { key: 'secured', label: '내진성능확보' },
  { key: 'inProgress', label: '내진성능확보추진중' },
  { key: 'unsecured', label: '내진성능미확보' },
];

/** 시설구분별 내진성능확보 */
const FACILITY_STATS_SEISMIC_BY_TYPE = [
  { label: '계류시설', seismic: { designed: 96, secured: 90, inProgress: 48, unsecured: 86 } },
  { label: '외곽시설', seismic: { designed: 70, secured: 72, inProgress: 36, unsecured: 62 } },
  { label: '건축물', seismic: { designed: 42, secured: 46, inProgress: 20, unsecured: 34 } },
  { label: '교량시설', seismic: { designed: 18, secured: 20, inProgress: 8, unsecured: 12 } },
  { label: '기타', seismic: { designed: 10, secured: 14, inProgress: 6, unsecured: 14 } },
];

/** 항별 내진성능확보 */
const FACILITY_STATS_SEISMIC_BY_PORT = [
  { port: '부산항', seismic: { designed: 54, secured: 58, inProgress: 34, unsecured: 54 } },
  { port: '인천항', seismic: { designed: 48, secured: 48, inProgress: 24, unsecured: 42 } },
  { port: '광양항', seismic: { designed: 34, secured: 38, inProgress: 18, unsecured: 32 } },
  { port: '여수항', seismic: { designed: 28, secured: 30, inProgress: 14, unsecured: 28 } },
  { port: '군산항', seismic: { designed: 20, secured: 22, inProgress: 10, unsecured: 16 } },
  { port: '목포항', seismic: { designed: 18, secured: 18, inProgress: 8, unsecured: 10 } },
];
