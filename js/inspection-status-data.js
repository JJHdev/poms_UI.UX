/** 점검정보현황 샘플 데이터 */

/** 총괄표 대상시설물: 정기=총시설수(연간 전체), 정밀≈2~3년 주기, 진단≈5~6년 주기, 성능평가≈5년 주기 */
function calcOverviewRate(count, target) {
  if (!target) return 0;
  return Math.round((count / target) * 1000) / 10;
}

const INSP_STATUS_OVERVIEW = [
  { agency: '인천지방해양수산청', port: '인천항', total: 214, planMissing: 11, regularCount: 198, precisionTarget: 64, precisionCount: 57, diagnosisTarget: 26, diagnosisCount: 21, evalTarget: 42, evalCount: 36 },
  { agency: '마산지방해양수산청', port: '마산항', total: 96, planMissing: 4, regularCount: 90, precisionTarget: 31, precisionCount: 28, diagnosisTarget: 14, diagnosisCount: 11, evalTarget: 22, evalCount: 19 },
  { agency: '여수지방해양수산청', port: '여수항', total: 142, planMissing: 7, regularCount: 131, precisionTarget: 44, precisionCount: 39, diagnosisTarget: 18, diagnosisCount: 15, evalTarget: 30, evalCount: 26 },
  { agency: '목포지방해양수산청', port: '목포항', total: 118, planMissing: 6, regularCount: 109, precisionTarget: 37, precisionCount: 32, diagnosisTarget: 16, diagnosisCount: 13, evalTarget: 25, evalCount: 21 },
  { agency: '군산지방해양수산청', port: '군산항', total: 188, planMissing: 8, regularCount: 176, precisionTarget: 58, precisionCount: 51, diagnosisTarget: 22, diagnosisCount: 17, evalTarget: 38, evalCount: 33 },
  { agency: '동해지방해양수산청', port: '동해항', total: 87, planMissing: 3, regularCount: 82, precisionTarget: 27, precisionCount: 24, diagnosisTarget: 12, diagnosisCount: 10, evalTarget: 18, evalCount: 16 },
  { agency: '울산항만공사', port: '울산항', total: 156, planMissing: 5, regularCount: 149, precisionTarget: 49, precisionCount: 45, diagnosisTarget: 20, diagnosisCount: 17, evalTarget: 33, evalCount: 30 },
  { agency: '포항지방해양수산청', port: '포항항', total: 104, planMissing: 5, regularCount: 97, precisionTarget: 33, precisionCount: 29, diagnosisTarget: 15, diagnosisCount: 12, evalTarget: 23, evalCount: 20 },
  { agency: '부산지방해양수산청', port: '부산항', total: 176, planMissing: 9, regularCount: 164, precisionTarget: 55, precisionCount: 48, diagnosisTarget: 21, diagnosisCount: 16, evalTarget: 36, evalCount: 31 },
  { agency: '부산항만공사', port: '부산항', total: 203, planMissing: 6, regularCount: 194, precisionTarget: 62, precisionCount: 57, diagnosisTarget: 24, diagnosisCount: 21, evalTarget: 41, evalCount: 37 },
  { agency: '여수광양항만공사', port: '광양항', total: 167, planMissing: 7, regularCount: 157, precisionTarget: 52, precisionCount: 47, diagnosisTarget: 19, diagnosisCount: 16, evalTarget: 34, evalCount: 30 },
  { agency: '인천항만공사', port: '인천항', total: 191, planMissing: 8, regularCount: 181, precisionTarget: 59, precisionCount: 53, diagnosisTarget: 23, diagnosisCount: 19, evalTarget: 39, evalCount: 35 },
  { agency: '평택지방해양수산청', port: '평택항', total: 79, planMissing: 3, regularCount: 74, precisionTarget: 24, precisionCount: 21, diagnosisTarget: 11, diagnosisCount: 9, evalTarget: 16, evalCount: 14 },
  { agency: '대산지방해양수산청', port: '대산항', total: 68, planMissing: 2, regularCount: 64, precisionTarget: 21, precisionCount: 19, diagnosisTarget: 9, diagnosisCount: 8, evalTarget: 14, evalCount: 12 },
  { agency: '울산지방해양수산청', port: '울산항', total: 91, planMissing: 4, regularCount: 85, precisionTarget: 28, precisionCount: 25, diagnosisTarget: 13, diagnosisCount: 11, evalTarget: 19, evalCount: 17 },
].map((row) => ({
  ...row,
  year: '2026',
  title: `2026년 유지관리 계획(${row.port})`,
  planTarget: row.total,
  planMissingRatio: calcOverviewRate(row.planMissing, row.total),
  regularTarget: row.total,
  regularMissing: row.total - row.regularCount,
  regularMissingRatio: calcOverviewRate(row.total - row.regularCount, row.total),
  precisionMissing: row.precisionTarget - row.precisionCount,
  precisionMissingRatio: calcOverviewRate(row.precisionTarget - row.precisionCount, row.precisionTarget),
  diagnosisMissing: row.diagnosisTarget - row.diagnosisCount,
  diagnosisMissingRatio: calcOverviewRate(row.diagnosisTarget - row.diagnosisCount, row.diagnosisTarget),
  evalMissing: row.evalTarget - row.evalCount,
  evalMissingRatio: calcOverviewRate(row.evalTarget - row.evalCount, row.evalTarget),
}));

const INSP_STATUS_OVERVIEW_DETAIL_TEMPLATES = {
  registered: [
    {
      name: '내항 물양장',
      classType: '기타',
      firstHalf: '등록',
      midYear: '-',
      secondHalf: '등록',
      precision: '등록',
      diagnosis: '등록',
      eval: '등록',
    },
    {
      name: '제1부두 계류시설',
      classType: '1종',
      firstHalf: '등록',
      midYear: '-',
      secondHalf: '등록',
      precision: '등록',
      diagnosis: '등록',
      eval: '등록',
    },
    {
      name: '국제여객부두',
      classType: '1종',
      firstHalf: '등록',
      midYear: '등록',
      secondHalf: '등록',
      precision: '등록',
      diagnosis: '등록',
      eval: '등록',
    },
    {
      name: '양곡부두',
      classType: '1종',
      firstHalf: '등록',
      midYear: '-',
      secondHalf: '등록',
      precision: '등록',
      diagnosis: '-',
      eval: '등록',
    },
  ],
  mixed: [
    {
      name: '자동차부두',
      classType: '1종',
      firstHalf: '등록',
      midYear: '-',
      secondHalf: '미등록',
      precision: '등록',
      diagnosis: '미등록',
      eval: '등록',
    },
    {
      name: '제2부두',
      classType: '1종',
      firstHalf: '등록',
      midYear: '등록',
      secondHalf: '등록',
      precision: '미등록',
      diagnosis: '등록',
      eval: '등록',
    },
    {
      name: '모래부두',
      classType: '기타',
      firstHalf: '미등록',
      midYear: '-',
      secondHalf: '등록',
      precision: '등록',
      diagnosis: '등록',
      eval: '-',
    },
    {
      name: '물양장(2)',
      classType: '기타',
      firstHalf: '등록',
      midYear: '-',
      secondHalf: '미등록',
      precision: '미등록',
      diagnosis: '등록',
      eval: '등록',
    },
    {
      name: '잡화부두',
      classType: '기타',
      firstHalf: '등록',
      midYear: '미등록',
      secondHalf: '등록',
      precision: '등록',
      diagnosis: '등록',
      eval: '미등록',
    },
    {
      name: '부잔교',
      classType: '기타',
      firstHalf: '등록',
      midYear: '-',
      secondHalf: '등록',
      precision: '등록',
      diagnosis: '미등록',
      eval: '-',
    },
  ],
  unregistered: [
    {
      name: '호안',
      classType: '2종',
      firstHalf: '미등록',
      midYear: '미등록',
      secondHalf: '미등록',
      precision: '미등록',
      diagnosis: '미등록',
      eval: '미등록',
    },
    {
      name: '방파제',
      classType: '기타',
      firstHalf: '미등록',
      midYear: '-',
      secondHalf: '미등록',
      precision: '미등록',
      diagnosis: '미등록',
      eval: '미등록',
    },
  ],
};

const INSP_STATUS_OVERVIEW_DETAIL_UNREG_COUNTS = {
  '군산지방해양수산청': 39,
};

function calcOverviewInspectRate(row) {
  const fields = [row.maintenancePlan, row.firstHalf, row.midYear, row.secondHalf, row.precision, row.diagnosis, row.eval];
  const applicable = fields.filter((value) => value !== '-');
  if (!applicable.length) return 0;
  const registered = applicable.filter((value) => value === '등록' || value === '수립').length;
  return Math.round((registered / applicable.length) * 1000) / 10;
}

function overviewDetailHasUnregistered(row) {
  return [row.maintenancePlan, row.firstHalf, row.midYear, row.secondHalf, row.precision, row.diagnosis, row.eval]
    .some((value) => value === '미등록' || value === '미수립');
}

function buildOverviewDetailSequence(total, unregCount) {
  const sequence = new Array(total).fill('registered');
  const mixedSlots = Math.min(
    INSP_STATUS_OVERVIEW_DETAIL_TEMPLATES.mixed.length * 3,
    unregCount,
  );
  const fullUnregSlots = unregCount - mixedSlots;

  let assigned = 0;
  const placeAt = (type, count) => {
    if (!count) return;
    const step = total / count;
    for (let i = 0; i < count; i += 1) {
      let idx = Math.min(total - 1, Math.round(i * step + step / 2));
      while (idx < total && sequence[idx] !== 'registered') idx += 1;
      if (idx >= total) {
        idx = sequence.findIndex((value) => value === 'registered');
      }
      if (idx === -1) break;
      sequence[idx] = type;
      assigned += 1;
    }
  };

  placeAt('mixed', mixedSlots);
  placeAt('unregistered', fullUnregSlots);

  for (let i = 0; i < total && assigned < unregCount; i += 1) {
    if (sequence[i] === 'registered') {
      sequence[i] = i % 2 === 0 ? 'mixed' : 'unregistered';
      assigned += 1;
    }
  }

  return sequence;
}

function buildOverviewDetailRows() {
  const rows = [];
  let seq = 1;
  const portPairs = [
    { port: '군산항', subPort: '내항' },
    { port: '군산항', subPort: '외항' },
    { port: '장항항', subPort: '내항' },
    { port: '장항항', subPort: '외항' },
    { port: '상왕등도항', subPort: '상왕등도항' },
  ];
  const grades = ['-', 'A', 'B', 'C', 'D', 'E'];

  INSP_STATUS_OVERVIEW.forEach((overview) => {
    const unregTarget = INSP_STATUS_OVERVIEW_DETAIL_UNREG_COUNTS[overview.agency]
      ?? Math.round(overview.total * 0.21);
    const sequence = buildOverviewDetailSequence(overview.total, unregTarget);
    const counters = { registered: 0, mixed: 0, unregistered: 0 };

    for (let i = 0; i < overview.total; i += 1) {
      const kind = sequence[i];
      const templates = INSP_STATUS_OVERVIEW_DETAIL_TEMPLATES[kind];
      const template = templates[counters[kind] % templates.length];
      counters[kind] += 1;

      const duplicate = Math.floor(i / templates.length);
      const meta = portPairs[(seq - 1) % portPairs.length];
      const row = {
        ...JSON.parse(JSON.stringify(template)),
        id: `od${seq}`,
        agency: overview.agency,
        port: meta.port,
        subPort: meta.subPort,
        name: duplicate > 0 ? `${template.name} (${duplicate + 1})` : template.name,
        grade: grades[(seq + 1) % grades.length],
        completionYear: 1988 + (seq % 35),
        regularScheduledYear: 2026,
        precisionScheduledYear: 2026,
        diagnosisScheduledYear: 2026 + (seq % 2),
        evalScheduledYear: 2026 + (seq % 3),
        regularFinalDate: template.firstHalf === '등록' && template.secondHalf === '등록' ? '2025-12-15' : '-',
        precisionFinalDate: template.precision === '등록' ? '2025-10-20' : '-',
        diagnosisFinalDate: template.diagnosis === '등록' ? '2025-09-30' : '-',
        evalFinalDate: template.eval === '등록' ? '2025-11-05' : '-',
        maintenancePlan: kind === 'registered' || i % 4 !== 0 ? '수립' : '미수립',
        inspectRate: 0,
      };
      row.inspectRate = calcOverviewInspectRate(row);
      rows.push(row);
      seq += 1;
    }
  });

  return rows;
}

const INSP_STATUS_OVERVIEW_DETAIL = buildOverviewDetailRows();

const INSP_STATUS_REGULAR = [
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '내항 물양장', classType: '기타', grade: 'C', lastInspectDate: '2026-05-20', round1Period: '상반기', round1Status: '완료', round2Period: '하반기', round2Status: '예정', round3Period: '건기', round3Status: '예정', vulnerable: false },
  { agency: '군산지방해양수산청', port: '장항항', subPort: '내항', name: '모래부두', classType: '기타', grade: 'B', lastInspectDate: '2026-05-14', round1Period: '상반기', round1Status: '완료', round2Period: '하반기', round2Status: '예정', round3Period: '건기', round3Status: '예정', vulnerable: false },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '제1부두 계류시설', classType: '1종', grade: 'A', lastInspectDate: '2026-03-20', round1Period: '해빙기', round1Status: '완료', round2Period: '우기', round2Status: '미등록', round3Period: '건기', round3Status: '예정', vulnerable: true },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '외항', name: '자동차부두', classType: '1종', grade: 'A', lastInspectDate: '2026-03-15', round1Period: '해빙기', round1Status: '완료', round2Period: '우기', round2Status: '미등록', round3Period: '건기', round3Status: '예정', vulnerable: true },
  { agency: '군산지방해양수산청', port: '상왕등도항', subPort: '상왕등도항', name: '물양장', classType: '기타', grade: 'B', lastInspectDate: '2026-05-10', round1Period: '상반기', round1Status: '완료', round2Period: '하반기', round2Status: '예정', round3Period: '', round3Status: '-', vulnerable: false },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '국제여객부두', classType: '1종', grade: 'A', lastInspectDate: '2026-03-12', round1Period: '해빙기', round1Status: '완료', round2Period: '우기', round2Status: '미등록', round3Period: '건기', round3Status: '예정', vulnerable: false },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '제2부두', classType: '1종', grade: 'B', lastInspectDate: '2026-04-02', round1Period: '상반기', round1Status: '완료', round2Period: '하반기', round2Status: '예정', round3Period: '', round3Status: '-', vulnerable: false },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '외항', name: '양곡부두', classType: '1종', grade: 'A', lastInspectDate: '2026-03-08', round1Period: '해빙기', round1Status: '완료', round2Period: '우기', round2Status: '완료', round3Period: '건기', round3Status: '예정', vulnerable: false },
  { agency: '군산지방해양수산청', port: '상왕등도항', subPort: '상왕등도항', name: '방파제', classType: '기타', grade: 'C', lastInspectDate: '2026-05-02', round1Period: '상반기', round1Status: '미등록', round2Period: '하반기', round2Status: '예정', round3Period: '', round3Status: '-', vulnerable: true },
  { agency: '군산지방해양수산청', port: '장항항', subPort: '외항', name: '잡화부두', classType: '기타', grade: 'B', lastInspectDate: '2026-04-28', round1Period: '상반기', round1Status: '완료', round2Period: '하반기', round2Status: '예정', round3Period: '', round3Status: '-', vulnerable: false },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '물양장(2)', classType: '기타', grade: 'B', lastInspectDate: '2026-04-12', round1Period: '상반기', round1Status: '완료', round2Period: '하반기', round2Status: '예정', round3Period: '', round3Status: '-', vulnerable: false },
  { agency: '군산지방해양수산청', port: '장항항', subPort: '장항항', name: '호안', classType: '2종', grade: 'C', lastInspectDate: '2026-04-05', round1Period: '상반기', round1Status: '미등록', round2Period: '하반기', round2Status: '예정', round3Period: '', round3Status: '-', vulnerable: true },
];

const INSP_STATUS_PRECISION = [
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '내항 물양장', classType: '기타', grade: 'B', lastInspectDate: '2026', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '외항', name: '물양장', classType: '기타', grade: 'B', lastInspectDate: '2026', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '상왕등도항', subPort: '상왕등도항', name: '물양장', classType: '기타', grade: 'C', lastInspectDate: '2026', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '물양장(2)', classType: '기타', grade: 'B', lastInspectDate: '2026', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '상왕등도항', subPort: '상왕등도항', name: '부잔교', classType: '기타', grade: 'B', lastInspectDate: '2026', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '장항항', subPort: '장항항', name: '호안', classType: '2종', grade: 'C', lastInspectDate: '미등록', yearPerform: '미수행' },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '제1부두 계류시설', classType: '1종', grade: 'A', lastInspectDate: '2025', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '장항항', subPort: '내항', name: '모래부두', classType: '기타', grade: 'B', lastInspectDate: '2024', yearPerform: '미수행' },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '외항', name: '자동차부두', classType: '1종', grade: 'A', lastInspectDate: '2025', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '국제여객부두', classType: '1종', grade: 'A', lastInspectDate: '미등록', yearPerform: '미수행' },
];

const INSP_STATUS_SYSTEM_TEMPLATES = [
  {
    agency: '책임관리자',
    port: '광양항',
    subPort: '광양항',
    name: '물양장(2)',
    classType: '2종',
    grade: 'B',
    extension: 290,
    regularTarget: true,
    regularScheduleYear: 2025,
    regularPlanYear: '-',
    precisionTarget: false,
    precisionScheduleYear: 2026,
    precisionPlanYear: '신청시기 전',
    diagnosisTarget: false,
    diagnosisScheduleYear: 2030,
    diagnosisPlanYear: '신청시기 전',
    evalTarget: false,
    evalScheduleYear: 2029,
    evalPlanYear: '신청시기 전',
  },
  {
    agency: '책임관리자',
    port: '광양항',
    subPort: '광양항',
    name: '물양장(2)',
    classType: '2종',
    grade: 'B',
    extension: 290,
    regularTarget: true,
    regularScheduleYear: 2025,
    regularPlanYear: '-',
    precisionTarget: true,
    precisionScheduleYear: 2026,
    precisionPlanYear: '신청시기 전',
    diagnosisTarget: true,
    diagnosisScheduleYear: 2030,
    diagnosisPlanYear: '신청시기 전',
    evalTarget: true,
    evalScheduleYear: 2029,
    evalPlanYear: '신청시기 전',
  },
  {
    agency: '책임관리자',
    port: '서울항',
    subPort: '-',
    name: 'test',
    classType: '2종',
    grade: '-',
    extension: 21421,
    regularTarget: true,
    regularScheduleYear: 2025,
    regularPlanYear: '-',
    precisionTarget: true,
    precisionScheduleYear: 2025,
    precisionPlanYear: '-',
    diagnosisTarget: false,
    diagnosisScheduleYear: 2030,
    diagnosisPlanYear: '신청시기 전',
    evalTarget: false,
    evalScheduleYear: '-',
    evalPlanYear: '-',
  },
  {
    agency: '한국수자원공사',
    port: '경인항',
    subPort: '경인항(김포)',
    name: '김포여객터미널',
    classType: '2종',
    grade: 'A',
    extension: 5630,
    regularTarget: true,
    regularScheduleYear: 2025,
    regularPlanYear: 2025,
    precisionTarget: false,
    precisionScheduleYear: 2028,
    precisionPlanYear: '신청시기 전',
    diagnosisTarget: false,
    diagnosisScheduleYear: 2030,
    diagnosisPlanYear: '신청시기 전',
    evalTarget: false,
    evalScheduleYear: 2027,
    evalPlanYear: '신청시기 전',
  },
  {
    agency: '한국수자원공사',
    port: '경인항',
    subPort: '경인항(인천)',
    name: '아라1잔교',
    classType: '기타',
    grade: '-',
    extension: 40,
    regularTarget: true,
    regularScheduleYear: 2025,
    regularPlanYear: '-',
    precisionTarget: false,
    precisionScheduleYear: 2026,
    precisionPlanYear: '신청시기 전',
    diagnosisTarget: false,
    diagnosisScheduleYear: 2029,
    diagnosisPlanYear: '신청시기 전',
    evalTarget: false,
    evalScheduleYear: 2028,
    evalPlanYear: '신청시기 전',
  },
  {
    agency: '한국수자원공사',
    port: '경인항',
    subPort: '경인항(인천)',
    name: '아라2잔교',
    classType: '기타',
    grade: '-',
    extension: 1738,
    regularTarget: true,
    regularScheduleYear: 2025,
    regularPlanYear: '-',
    precisionTarget: false,
    precisionScheduleYear: 2028,
    precisionPlanYear: '신청시기 전',
    diagnosisTarget: false,
    diagnosisScheduleYear: 2030,
    diagnosisPlanYear: '신청시기 전',
    evalTarget: false,
    evalScheduleYear: 2027,
    evalPlanYear: '신청시기 전',
  },
  {
    agency: '부산지방해양수산청',
    port: '부산항',
    subPort: '북항',
    name: '북항방파제',
    classType: '2종',
    grade: 'B',
    extension: 210,
    regularTarget: true,
    regularScheduleYear: 2026,
    regularPlanYear: 2026,
    precisionTarget: true,
    precisionScheduleYear: 2026,
    precisionPlanYear: '-',
    diagnosisTarget: false,
    diagnosisScheduleYear: 2031,
    diagnosisPlanYear: '신청시기 전',
    evalTarget: false,
    evalScheduleYear: 2030,
    evalPlanYear: '신청시기 전',
  },
  {
    agency: '부산항만공사',
    port: '부산항',
    subPort: '남항',
    name: '부산항 제1부두',
    classType: '1종',
    grade: 'A',
    extension: 430,
    regularTarget: true,
    regularScheduleYear: 2026,
    regularPlanYear: 2026,
    precisionTarget: true,
    precisionScheduleYear: 2026,
    precisionPlanYear: 2026,
    diagnosisTarget: false,
    diagnosisScheduleYear: 2029,
    diagnosisPlanYear: '신청시기 전',
    evalTarget: true,
    evalScheduleYear: 2026,
    evalPlanYear: 2026,
  },
  {
    agency: '인천항만공사',
    port: '인천항',
    subPort: '신항',
    name: '신항 컨테이너터미널',
    classType: '1종',
    grade: 'A',
    extension: 860,
    regularTarget: true,
    regularScheduleYear: 2026,
    regularPlanYear: '-',
    precisionTarget: true,
    precisionScheduleYear: 2026,
    precisionPlanYear: '-',
    diagnosisTarget: true,
    diagnosisScheduleYear: 2026,
    diagnosisPlanYear: '-',
    evalTarget: true,
    evalScheduleYear: 2026,
    evalPlanYear: '-',
  },
  {
    agency: '여수광양항만공사',
    port: '광양항',
    subPort: '광양항',
    name: '1단계 컨테이너부두(중력식)',
    classType: '2종',
    grade: 'B',
    extension: 640,
    regularTarget: true,
    regularScheduleYear: 2025,
    regularPlanYear: 2025,
    precisionTarget: true,
    precisionScheduleYear: 2025,
    precisionPlanYear: 2025,
    diagnosisTarget: true,
    diagnosisScheduleYear: 2025,
    diagnosisPlanYear: 2025,
    evalTarget: true,
    evalScheduleYear: 2025,
    evalPlanYear: 2025,
  },
  {
    agency: '여수지방해양수산청',
    port: '여수항',
    subPort: '여천항',
    name: '여천항 물양장',
    classType: '기타',
    grade: 'C',
    extension: 145,
    regularTarget: true,
    regularScheduleYear: 2026,
    regularPlanYear: 2026,
    precisionTarget: false,
    precisionScheduleYear: 2027,
    precisionPlanYear: '신청시기 전',
    diagnosisTarget: false,
    diagnosisScheduleYear: 2030,
    diagnosisPlanYear: '신청시기 전',
    evalTarget: true,
    evalScheduleYear: 2026,
    evalPlanYear: '-',
  },
  {
    agency: '경상북도',
    port: '구룡포항',
    subPort: '구룡포항',
    name: '구룡포항 부두',
    classType: '기타',
    grade: 'D',
    extension: 120,
    regularTarget: true,
    regularScheduleYear: 2026,
    regularPlanYear: '-',
    precisionTarget: true,
    precisionScheduleYear: 2026,
    precisionPlanYear: '-',
    diagnosisTarget: false,
    diagnosisScheduleYear: 2030,
    diagnosisPlanYear: '신청시기 전',
    evalTarget: false,
    evalScheduleYear: 2029,
    evalPlanYear: '신청시기 전',
  },
  {
    agency: '부산지방해양수산청',
    port: '부산항',
    subPort: '감천항',
    name: '감천방파제',
    classType: '2종',
    grade: 'E',
    extension: 280,
    regularTarget: true,
    regularScheduleYear: 2025,
    regularPlanYear: 2025,
    precisionTarget: true,
    precisionScheduleYear: 2025,
    precisionPlanYear: 2025,
    diagnosisTarget: true,
    diagnosisScheduleYear: 2025,
    diagnosisPlanYear: 2025,
    evalTarget: true,
    evalScheduleYear: 2026,
    evalPlanYear: '-',
  },
];

function buildSystemInspectionRows() {
  const rows = [];
  const total = 91;

  for (let i = 1; i <= total; i += 1) {
    const template = INSP_STATUS_SYSTEM_TEMPLATES[(i - 1) % INSP_STATUS_SYSTEM_TEMPLATES.length];
    const duplicate = Math.floor((i - 1) / INSP_STATUS_SYSTEM_TEMPLATES.length);
    const base = JSON.parse(JSON.stringify(template));

    rows.push({
      ...base,
      id: `si${i}`,
      name: duplicate > 0 ? `${template.name} (${duplicate + 1})` : template.name,
    });
  }

  return rows;
}

const INSP_STATUS_SYSTEM_INSPECTION = buildSystemInspectionRows().map((row, index) => {
  const gunsanFacilities = [
    { port: '군산항', subPort: '내항', name: '물양장(2)', classType: '2종', grade: 'B', extension: 290 },
    { port: '군산항', subPort: '내항', name: '제1부두 계류시설', classType: '1종', grade: 'A', extension: 420 },
    { port: '군산항', subPort: '외항', name: '자동차부두', classType: '1종', grade: 'A', extension: 560 },
    { port: '장항항', subPort: '내항', name: '모래부두', classType: '기타', grade: 'B', extension: 180 },
    { port: '장항항', subPort: '외항', name: '잡화부두', classType: '기타', grade: 'B', extension: 210 },
    { port: '상왕등도항', subPort: '상왕등도항', name: '물양장', classType: '기타', grade: 'B', extension: 95 },
    { port: '상왕등도항', subPort: '상왕등도항', name: '부잔교', classType: '기타', grade: 'B', extension: 40 },
    { port: '장항항', subPort: '장항항', name: '호안', classType: '2종', grade: 'C', extension: 320 },
    { port: '군산항', subPort: '내항', name: '국제여객부두', classType: '1종', grade: 'A', extension: 640 },
    { port: '군산항', subPort: '외항', name: '양곡부두', classType: '1종', grade: 'A', extension: 510 },
    { port: '상왕등도항', subPort: '상왕등도항', name: '방파제', classType: '기타', grade: 'C', extension: 280 },
  ];
  const facility = gunsanFacilities[index % gunsanFacilities.length];
  const duplicate = Math.floor(index / gunsanFacilities.length);
  return {
    ...row,
    agency: '군산지방해양수산청',
    port: facility.port,
    subPort: facility.subPort,
    name: duplicate > 0 ? `${facility.name} (${duplicate + 1})` : facility.name,
    classType: facility.classType,
    grade: facility.grade,
    extension: facility.extension,
  };
});

const INSP_STATUS_DIAGNOSIS = [
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '내항 물양장', classType: '기타', grade: 'B', lastInspectDate: '2026', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '외항', name: '물양장', classType: '기타', grade: 'B', lastInspectDate: '2026', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '상왕등도항', subPort: '상왕등도항', name: '물양장', classType: '기타', grade: 'C', lastInspectDate: '2025', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '물양장(2)', classType: '기타', grade: 'B', lastInspectDate: '2024', yearPerform: '미수행' },
  { agency: '군산지방해양수산청', port: '상왕등도항', subPort: '상왕등도항', name: '부잔교', classType: '기타', grade: 'B', lastInspectDate: '2026', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '장항항', subPort: '장항항', name: '호안', classType: '2종', grade: 'C', lastInspectDate: '미등록', yearPerform: '미수행' },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '제1부두 계류시설', classType: '1종', grade: 'A', lastInspectDate: '2025', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '장항항', subPort: '내항', name: '모래부두', classType: '기타', grade: 'B', lastInspectDate: '2024', yearPerform: '완료' },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '외항', name: '자동차부두', classType: '1종', grade: 'A', lastInspectDate: '2023', yearPerform: '미수행' },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '국제여객부두', classType: '1종', grade: 'A', lastInspectDate: '미등록', yearPerform: '미수행' },
];

const INSP_STATUS_PERFORM_TEMPLATES = [
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '내항 물양장', classType: '기타', grade: 'B', lastInspectDate: '2026', yearPerform: '완료', isEvalTarget: true },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '외항', name: '물양장', classType: '기타', grade: 'B', lastInspectDate: '2026', yearPerform: '완료', isEvalTarget: true },
  { agency: '군산지방해양수산청', port: '상왕등도항', subPort: '상왕등도항', name: '물양장', classType: '기타', grade: 'C', lastInspectDate: '2025', yearPerform: '완료', isEvalTarget: true },
  { agency: '군산지방해양수산청', port: '장항항', subPort: '장항항', name: '호안', classType: '2종', grade: 'C', lastInspectDate: '미등록', yearPerform: '미수행', isEvalTarget: true },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '제1부두 계류시설', classType: '1종', grade: 'A', lastInspectDate: '2024', yearPerform: '완료', isEvalTarget: true },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '외항', name: '자동차부두', classType: '1종', grade: 'A', lastInspectDate: '미등록', yearPerform: '미수행', isEvalTarget: true },
  { agency: '군산지방해양수산청', port: '장항항', subPort: '내항', name: '모래부두', classType: '기타', grade: 'B', lastInspectDate: '2024', yearPerform: '완료', isEvalTarget: false },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '내항', name: '국제여객부두', classType: '1종', grade: 'A', lastInspectDate: '미등록', yearPerform: '미수행', isEvalTarget: true },
  { agency: '군산지방해양수산청', port: '군산항', subPort: '외항', name: '양곡부두', classType: '1종', grade: 'A', lastInspectDate: '2023', yearPerform: '완료', isEvalTarget: false },
  { agency: '군산지방해양수산청', port: '상왕등도항', subPort: '상왕등도항', name: '부잔교', classType: '기타', grade: 'B', lastInspectDate: '2025', yearPerform: '완료', isEvalTarget: true },
];

function buildPerformEvaluationRows() {
  const rows = [];
  const total = 1248;
  const targetCount = 256;

  for (let i = 1; i <= total; i += 1) {
    const template = INSP_STATUS_PERFORM_TEMPLATES[(i - 1) % INSP_STATUS_PERFORM_TEMPLATES.length];
    const duplicate = Math.floor((i - 1) / INSP_STATUS_PERFORM_TEMPLATES.length);
    rows.push({
      ...JSON.parse(JSON.stringify(template)),
      id: `pe${i}`,
      isEvalTarget: i <= targetCount,
      name: duplicate > 0 ? `${template.name} (${duplicate + 1})` : template.name,
    });
  }

  return rows;
}

const INSP_STATUS_PERFORM_EVAL = buildPerformEvaluationRows();

/** 사용자 점검정보현황 — 유지관리계획 관리 신청 대상시설물 */
const INSP_STATUS_PLAN_FACILITIES = [
  { id: 'plan-1', agency: '군산지방해양수산청', port: '군산항', subPort: '내항', facilityType: '계선시설', classType: '기타', name: '내항 물양장', regular: true, detailed: true, diagnosis: false, performance: false, year: '2026' },
  { id: 'plan-2', agency: '군산지방해양수산청', port: '장항항', subPort: '내항', facilityType: '계류', classType: '기타', name: '모래부두', regular: true, detailed: true, diagnosis: false, performance: false, year: '2026' },
  { id: 'plan-3', agency: '군산지방해양수산청', port: '군산항', subPort: '내항', facilityType: '계류', classType: '1종', name: '제1부두 계류시설', regular: true, detailed: true, diagnosis: true, performance: false, year: '2026' },
  { id: 'plan-4', agency: '군산지방해양수산청', port: '군산항', subPort: '외항', facilityType: '계류', classType: '1종', name: '자동차부두', regular: true, detailed: true, diagnosis: false, performance: false, year: '2026' },
  { id: 'plan-5', agency: '군산지방해양수산청', port: '상왕등도항', subPort: '상왕등도항', facilityType: '계선시설', classType: '기타', name: '물양장', regular: true, detailed: false, diagnosis: false, performance: false, year: '2026' },
  { id: 'plan-6', agency: '군산지방해양수산청', port: '군산항', subPort: '내항', facilityType: '계류', classType: '1종', name: '국제여객부두', regular: true, detailed: true, diagnosis: true, performance: true, year: '2026' },
  { id: 'plan-7', agency: '군산지방해양수산청', port: '군산항', subPort: '내항', facilityType: '계류', classType: '1종', name: '제2부두', regular: true, detailed: true, diagnosis: false, performance: false, year: '2026' },
  { id: 'plan-8', agency: '군산지방해양수산청', port: '군산항', subPort: '외항', facilityType: '계류', classType: '1종', name: '양곡부두', regular: true, detailed: true, diagnosis: false, performance: true, year: '2026' },
  { id: 'plan-9', agency: '군산지방해양수산청', port: '상왕등도항', subPort: '상왕등도항', facilityType: '외곽시설', classType: '기타', name: '방파제', regular: true, detailed: false, diagnosis: true, performance: false, year: '2026' },
  { id: 'plan-10', agency: '군산지방해양수산청', port: '장항항', subPort: '외항', facilityType: '계류', classType: '기타', name: '잡화부두', regular: true, detailed: false, diagnosis: false, performance: false, year: '2026' },
  { id: 'plan-11', agency: '군산지방해양수산청', port: '군산항', subPort: '내항', facilityType: '계선시설', classType: '기타', name: '물양장(2)', regular: true, detailed: true, diagnosis: false, performance: false, year: '2026' },
  { id: 'plan-12', agency: '군산지방해양수산청', port: '장항항', subPort: '장항항', facilityType: '외곽시설', classType: '2종', name: '호안', regular: true, detailed: false, diagnosis: true, performance: false, year: '2026' },
];

/** 유지관리계획 시설물 추가 드로어 후보 (이미 선택된 ID는 화면에서 제외) */
const INSP_STATUS_PLAN_ADD_FACILITIES = (() => {
  const ports = [
    { port: '군산항', subPorts: ['내항', '외항'] },
    { port: '장항항', subPorts: ['내항', '외항', '장항항'] },
    { port: '상왕등도항', subPorts: ['상왕등도항'] },
  ];
  const baseNames = [
    '전력실',
    '크레인 레일',
    '보안초소',
    '전천후 야적장',
    '배후단지 연결로',
    '항만 조명탑',
    '소화펌프실',
    '계류 안전난간',
    '제1부두 계류시설',
    '제2부두 계류시설',
  ];
  const types = ['부대시설', '장비', '부대시설', '부대시설', '연결시설', '역무시설', '부대시설', '계류', '개선시설', '계선시설'];
  const total = 81;

  return Array.from({ length: total }, (_, index) => {
    const p = ports[index % ports.length];
    return {
      id: `plan-add-${index}`,
      agency: '군산지방해양수산청',
      port: p.port,
      subPort: p.subPorts[index % p.subPorts.length],
      facilityType: types[index % types.length],
      classType: index % 5 === 0 ? '1종' : '기타',
      name: `${p.port} ${baseNames[index % baseNames.length]}${index >= baseNames.length ? ` ${String(index + 1).padStart(2, '0')}` : ''}`,
      regular: true,
      detailed: index % 3 !== 0,
      diagnosis: index % 4 === 0,
      performance: index % 5 === 0,
      year: '2026',
    };
  });
})();
