/** 시설물 조회 — 위치기반 샘플 */
const MOBILE_FACILITY_NEARBY = [
  { id: 'f-loc-1', distance: '320m', distanceM: 320, facilityType: 'mooring', location: '포항항 > 북항', name: '북항 제1부두', kind: '계류시설', type: '1종' },
  { id: 'f-loc-2', distance: '450m', distanceM: 450, facilityType: 'outer', location: '포항항 > 북항', name: '북방파제', kind: '외곽시설', type: '2종', highlight: true },
  { id: 'f-loc-3', distance: '480m', distanceM: 480, facilityType: 'mooring', location: '포항항 > 남항', name: '남항 물양장(1)', kind: '계류시설', type: '2종' },
  { id: 'f-loc-4', distance: '510m', distanceM: 510, facilityType: 'building', location: '포항시 > 북구', name: '포항국제여객터미널', kind: '건축물', type: '1종' },
  { id: 'f-loc-5', distance: '620m', distanceM: 620, facilityType: 'outer', location: '포항항 > 신항', name: '신항 호안', kind: '외곽시설', type: '2종' },
  { id: 'f-loc-6', distance: '700m', distanceM: 700, facilityType: 'mooring', location: '포항항 > 신항', name: '신항 컨테이너부두', kind: '계류시설', type: '1종' },
  { id: 'f-loc-7', distance: '380m', distanceM: 380, facilityType: 'transport', location: '포항항 > 신항', name: '신항 접근교', kind: '교통시설', type: '1종' },
  { id: 'f-loc-8', distance: '550m', distanceM: 550, facilityType: 'etc', location: '포항항 > 남항', name: '남항 부대시설', kind: '기타', type: '기타' },
];

/** 시설물 조회 — 키워드 샘플 */
const MOBILE_FACILITY_KEYWORD = [
  { id: 'f-kw-1', agency: 'pohang', port: 'pohang', facilityKind: 'mooring', kindClass: '1', location: '포항항 > 북항', name: '북항 제1부두', kind: '계류시설', type: '1종 / 계류', grade: 'A', year: '2008', keywords: ['포항', '부두'] },
  { id: 'f-kw-2', agency: 'pohang', port: 'pohang', facilityKind: 'breakwater', kindClass: '2', location: '포항항 > 북항', name: '북방파제', kind: '방파제', type: '2종 / 방파제', grade: 'B', year: '2012', keywords: ['포항', '방파제'] },
  { id: 'f-kw-3', agency: 'pohang', port: 'pohang', facilityKind: 'mooring', kindClass: '2', location: '포항항 > 남항', name: '남항 물양장(1)', kind: '계류시설', type: '2종 / 계류', grade: 'B', year: '2005', keywords: ['포항', '물양장'] },
  { id: 'f-kw-4', agency: 'pohang', port: 'pohang', facilityKind: 'building', kindClass: '1', location: '포항시 > 북구', name: '포항국제여객터미널', kind: '건축물', type: '1종 / 건축물', grade: 'A', year: '2018', keywords: ['포항', '터미널'] },
  { id: 'f-kw-5', agency: 'gyeongnam', port: 'gyeongyang', facilityKind: 'mooring', kindClass: '2', location: '광양항 > 광양항', name: '1단계 컨테이너부두(중력식)', kind: '계류시설', type: '2종 / 계류', grade: 'A', year: '2010', keywords: ['광양', '컨테이너'] },
  { id: 'f-kw-6', agency: 'busan', port: 'busan', facilityKind: 'mooring', kindClass: '2', location: '부산광역시 > 남구', name: '부산항 제1부두', kind: '계류시설', type: '2종 / 계류', grade: 'B', year: '2006', keywords: ['부산', '부두'] },
  { id: 'f-kw-7', agency: 'busan', port: 'busan', facilityKind: 'breakwater', kindClass: '2', location: '부산광역시 > 영도구', name: '남방파제', kind: '방파제', type: '2종 / 방파제', grade: 'B', year: '2007', keywords: ['부산', '방파제'] },
  { id: 'f-kw-8', agency: 'incheon', port: 'incheon', facilityKind: 'mooring', kindClass: '1', location: '인천항 > 인천항', name: '갑문식 하역시설', kind: '계류시설', type: '1종 / 계류', grade: 'A', year: '2015', keywords: ['인천', '하역'] },
];
