/** 홈 > 시설물 정보 요약 모달 표 데이터 (2022.12 기준 목업) */
const FACILITY_INFO_MODAL_DATA = {
  baseDate: '2022.12',
  categories: [
    {
      kind: '1종',
      rows: [
        { facilityType: '계류시설', national: 42, local: 26, port: 312 },
        { facilityType: '외곽시설', national: 5, local: 14, port: 14 },
        { facilityType: '건축물', national: 0, local: 8, port: 48 },
        { facilityType: '교통시설', national: 1, local: 1, port: 0 },
        { facilityType: '기타', national: 0, local: 6, port: 8 },
        { facilityType: '소계', national: 48, local: 55, port: 382, isSubtotal: true },
      ],
    },
    {
      kind: '2종',
      rows: [
        { facilityType: '계류시설', national: 12, local: 18, port: 198 },
        { facilityType: '외곽시설', national: 3, local: 9, port: 22 },
        { facilityType: '건축물', national: 2, local: 11, port: 36 },
        { facilityType: '교통시설', national: 0, local: 2, port: 4 },
        { facilityType: '기타', national: 1, local: 4, port: 6 },
        { facilityType: '소계', national: 18, local: 44, port: 266, isSubtotal: true },
      ],
    },
    {
      kind: '3종',
      rows: [
        { facilityType: '계류시설', national: 8, local: 10, port: 142 },
        { facilityType: '외곽시설', national: 2, local: 6, port: 18 },
        { facilityType: '건축물', national: 1, local: 5, port: 28 },
        { facilityType: '교통시설', national: 0, local: 1, port: 3 },
        { facilityType: '기타', national: 0, local: 2, port: 5 },
        { facilityType: '소계', national: 11, local: 24, port: 196, isSubtotal: true },
      ],
    },
    {
      kind: '기타',
      rows: [
        { facilityType: '계류시설', national: 4, local: 0, port: 0 },
        { facilityType: '외곽시설', national: 0, local: 0, port: 0 },
        { facilityType: '건축물', national: 0, local: 0, port: 0 },
        { facilityType: '교통시설', national: 0, local: 0, port: 0 },
        { facilityType: '기타', national: 0, local: 0, port: 319 },
        { facilityType: '소계', national: 4, local: 0, port: 319, isSubtotal: true },
      ],
    },
  ],
  grandTotal: { national: 81, local: 123, port: 1163, total: 1636 },
};
