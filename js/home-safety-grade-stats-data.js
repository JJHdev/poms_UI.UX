/** 홈 > 안전등급 현황 모달 샘플 데이터 (2026.06.01 기준) */

const HOME_SAFETY_GRADE_STATS = {
  baseline: '2026.06.01',
  groups: [
    {
      kind: '1종',
      grades: {
        A: { outer: 52, mooring: 38, building: 21, traffic: 9, other: 6 },
        B: { outer: 68, mooring: 45, building: 28, traffic: 12, other: 8 },
        C: { outer: 35, mooring: 22, building: 14, traffic: 6, other: 4 },
        D: { outer: 18, mooring: 11, building: 7, traffic: 3, other: 2 },
        E: { outer: 8, mooring: 5, building: 3, traffic: 1, other: 1 },
        none: { outer: 12, mooring: 8, building: 5, traffic: 2, other: 3 },
      },
    },
    {
      kind: '2종',
      grades: {
        A: { outer: 41, mooring: 29, building: 16, traffic: 7, other: 5 },
        B: { outer: 55, mooring: 36, building: 22, traffic: 10, other: 7 },
        C: { outer: 28, mooring: 18, building: 11, traffic: 5, other: 3 },
        D: { outer: 14, mooring: 9, building: 5, traffic: 2, other: 2 },
        E: { outer: 6, mooring: 4, building: 2, traffic: 1, other: 1 },
        none: { outer: 9, mooring: 6, building: 4, traffic: 2, other: 2 },
      },
    },
    {
      kind: '3종',
      grades: {
        A: { outer: 24, mooring: 17, building: 9, traffic: 4, other: 3 },
        B: { outer: 32, mooring: 21, building: 13, traffic: 6, other: 4 },
        C: { outer: 16, mooring: 10, building: 6, traffic: 3, other: 2 },
        D: { outer: 8, mooring: 5, building: 3, traffic: 1, other: 1 },
        E: { outer: 3, mooring: 2, building: 1, traffic: 0, other: 1 },
        none: { outer: 5, mooring: 3, building: 2, traffic: 1, other: 1 },
      },
    },
    {
      kind: '기타',
      grades: {
        A: { outer: 11, mooring: 8, building: 4, traffic: 2, other: 2 },
        B: { outer: 15, mooring: 10, building: 6, traffic: 3, other: 2 },
        C: { outer: 8, mooring: 5, building: 3, traffic: 1, other: 1 },
        D: { outer: 4, mooring: 2, building: 1, traffic: 1, other: 1 },
        E: { outer: 2, mooring: 1, building: 1, traffic: 0, other: 0 },
        none: { outer: 3, mooring: 2, building: 1, traffic: 1, other: 1 },
      },
    },
  ],
};
