/** 점검표 체크리스트 샘플 (중력식) */
const MOBILE_CHECKLIST_GROUPS = [
  {
    id: 'super',
    title: '상부공 및 본체부',
    open: true,
    items: [
      {
        id: 'subsidence',
        title: '침하',
        open: true,
        toggles: ['침하', '중앙부', '접합부', '해당없음'],
        activeToggle: 0,
      },
      { id: 'tilt', title: '경사/전도', open: false },
      { id: 'damage', title: '파손', open: false },
      { id: 'crack', title: '균열', open: false },
      { id: 'peel', title: '박리', open: false },
      { id: 'fill', title: '속채움재 유실', open: false },
      { id: 'gap', title: '이격', open: false },
    ],
  },
  { id: 'aux', title: '부대시설', open: false, items: [] },
  { id: 'etc', title: '기타', open: false, items: [] },
  { id: 'opinion', title: '종합의견', open: false, items: [] },
];
