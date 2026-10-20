/** 홈 > 시설물정보 모달 샘플 데이터 (2022.12 기준) */

const HOME_FACILITY_STATS = {
  baseline: '2022.12',
  groups: [
    {
      kind: '1종',
      facilities: {
        mooring: { national: 85, local: 105, port: 88 },
        outer: { national: 92, local: 95, port: 58 },
        building: { national: 44, local: 50, port: 28 },
        bridge: { national: 20, local: 24, port: 8 },
        other: { national: 11, local: 14, port: 10 },
      },
    },
    {
      kind: '2종',
      facilities: {
        mooring: { national: 52, local: 68, port: 48 },
        outer: { national: 58, local: 62, port: 32 },
        building: { national: 28, local: 32, port: 18 },
        bridge: { national: 12, local: 14, port: 6 },
        other: { national: 8, local: 10, port: 6 },
      },
    },
    {
      kind: '3종',
      facilities: {
        mooring: { national: 34, local: 42, port: 32 },
        outer: { national: 38, local: 36, port: 22 },
        building: { national: 18, local: 22, port: 12 },
        bridge: { national: 8, local: 10, port: 4 },
        other: { national: 5, local: 7, port: 4 },
      },
    },
    {
      kind: '기타',
      facilities: {
        mooring: { national: 18, local: 24, port: 16 },
        outer: { national: 16, local: 20, port: 12 },
        building: { national: 10, local: 12, port: 6 },
        bridge: { national: 4, local: 5, port: 3 },
        other: { national: 3, local: 4, port: 3 },
      },
    },
  ],
};
