/** 특별관리시설 샘플 데이터 */

const SPECIAL_FACILITY_ROWS = [
  { category: 'multi', year: '2024', kindType: '2종', agency: '부산지방해양수산청', port: '부산항', subPort: '감천항', facilityType: '여객부두', name: '감천여객부두', reason: '노후·열화 우려', designatedAt: '2024-03-15' },
  { category: 'multi', year: '2025', kindType: '1종', agency: '부산항만공사', port: '부산항', subPort: '북항', facilityType: '여객터미널', name: '부산항 여객터미널', reason: '구조적 결함 발생', designatedAt: '2025-01-08' },
  { category: 'multi', year: '2025', kindType: '2종', agency: '인천항만공사', port: '인천항', subPort: '연안부두', facilityType: '여객터미널', name: '인천항 연안여객터미널', reason: '이용객 밀집', designatedAt: '2025-02-11' },
  { category: 'multi', year: '2024', kindType: '3종', agency: '여수지방해양수산청', port: '여수항', subPort: '여수항', facilityType: '여객부두', name: '여수항 여객부두', reason: '정기 점검 대상', designatedAt: '2024-04-21' },
  { category: 'multi', year: '2023', kindType: '기타', agency: '경상북도', port: '울릉항', subPort: '사동항', facilityType: '여객터미널', name: '울릉 사동여객터미널', reason: '도서 여객 집중', designatedAt: '2023-10-05' },
  { category: 'multi', year: '2025', kindType: '2종', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', facilityType: '여객부두', name: '광양항 여객부두', reason: '운영 안전관리', designatedAt: '2025-05-13' },
  { category: 'multi', year: '2024', kindType: '1종', agency: '목포지방해양수산청', port: '목포항', subPort: '북항', facilityType: '여객터미널', name: '목포항 여객터미널', reason: '노후 설비 관리', designatedAt: '2024-06-03' },
  { category: 'multi', year: '2023', kindType: '3종', agency: '부산항만공사', port: '부산항', subPort: '국제여객부두', facilityType: '여객부두', name: '국제여객부두', reason: '이용객 밀집', designatedAt: '2023-08-19' },
  { category: 'multi', year: '2025', kindType: '2종', agency: '인천항만공사', port: '인천항', subPort: '국제여객부두', facilityType: '여객부두', name: '인천항 국제여객부두', reason: '이용객 밀집', designatedAt: '2025-03-22' },
  { category: 'multi', year: '2024', kindType: '기타', agency: '여수지방해양수산청', port: '거문도항', subPort: '거문도항', facilityType: '여객터미널', name: '거문도 여객터미널', reason: '도서 여객 집중', designatedAt: '2024-11-15' },
  { category: 'multi', year: '2023', kindType: '2종', agency: '경상북도', port: '구룡포항', subPort: '구룡포항', facilityType: '여객부두', name: '구룡포항 여객부두', reason: '정기 점검 대상', designatedAt: '2023-12-02' },
  { category: 'multi', year: '2025', kindType: '1종', agency: '울산항만공사', port: '울산항', subPort: '본항', facilityType: '여객터미널', name: '울산항 여객터미널', reason: '이용객 밀집', designatedAt: '2025-01-20' },
  { category: 'multi', year: '2024', kindType: '2종', agency: '포항지방해양수산청', port: '포항항', subPort: '구항', facilityType: '여객부두', name: '포항항 여객부두', reason: '노후·열화 우려', designatedAt: '2024-02-14' },
  { category: 'multi', year: '2025', kindType: '3종', agency: '군산지방해양수산청', port: '군산항', subPort: '내항', facilityType: '여객터미널', name: '군산항 여객터미널', reason: '운영 안전관리', designatedAt: '2025-03-05' },
  { category: 'multi', year: '2023', kindType: '2종', agency: '동해지방해양수산청', port: '동해항', subPort: '묵호항', facilityType: '여객부두', name: '묵호항 여객부두', reason: '정기 점검 대상', designatedAt: '2023-07-28' },
  { category: 'multi', year: '2024', kindType: '1종', agency: '평택지방해양수산청', port: '평택당진항', subPort: '평택항', facilityType: '여객터미널', name: '평택항 여객터미널', reason: '이용객 밀집', designatedAt: '2024-05-09' },
  { category: 'multi', year: '2025', kindType: '기타', agency: '제주특별자치도', port: '제주항', subPort: '내항', facilityType: '여객부두', name: '제주항 제1여객부두', reason: '도서 여객 집중', designatedAt: '2025-04-16' },
  { category: 'multi', year: '2024', kindType: '2종', agency: '제주특별자치도', port: '제주항', subPort: '외항', facilityType: '여객터미널', name: '제주항 국제여객터미널', reason: '이용객 밀집', designatedAt: '2024-08-22' },
  { category: 'multi', year: '2023', kindType: '3종', agency: '마산지방해양수산청', port: '마산항', subPort: '중앙부두', facilityType: '여객부두', name: '마산항 여객부두', reason: '노후 설비 관리', designatedAt: '2023-11-30' },
  { category: 'multi', year: '2025', kindType: '2종', agency: '부산지방해양수산청', port: '부산항', subPort: '다대포항', facilityType: '여객터미널', name: '다대포 여객터미널', reason: '구조적 결함 발생', designatedAt: '2025-06-02' },
  { category: 'multi', year: '2024', kindType: '1종', agency: '인천항만공사', port: '인천항', subPort: '북항', facilityType: '여객부두', name: '인천항 북항여객부두', reason: '운영 안전관리', designatedAt: '2024-09-18' },
  { category: 'multi', year: '2023', kindType: '기타', agency: '여수지방해양수산청', port: '여수항', subPort: '신항', facilityType: '여객터미널', name: '여수항 신항여객터미널', reason: '이용객 밀집', designatedAt: '2023-05-12' },
  { category: 'multi', year: '2025', kindType: '2종', agency: '목포지방해양수산청', port: '목포항', subPort: '내항', facilityType: '여객부두', name: '목포항 내항여객부두', reason: '정기 점검 대상', designatedAt: '2025-07-01' },
  { category: 'multi', year: '2024', kindType: '3종', agency: '울산항만공사', port: '울산항', subPort: '온산항', facilityType: '여객터미널', name: '온산항 여객터미널', reason: '노후·열화 우려', designatedAt: '2024-12-20' },
  { category: 'multi', year: '2023', kindType: '2종', agency: '포항지방해양수산청', port: '포항항', subPort: '신항', facilityType: '여객부두', name: '포항신항 여객부두', reason: '도서 여객 집중', designatedAt: '2023-04-08' },
  { category: 'multi', year: '2025', kindType: '1종', agency: '부산항만공사', port: '부산항', subPort: '영도', facilityType: '여객터미널', name: '영도 여객터미널', reason: '이용객 밀집', designatedAt: '2025-08-11' },
  { category: 'multi', year: '2024', kindType: '2종', agency: '동해지방해양수산청', port: '속초항', subPort: '속초항', facilityType: '여객부두', name: '속초항 여객부두', reason: '운영 안전관리', designatedAt: '2024-01-25' },
  { category: 'multi', year: '2023', kindType: '기타', agency: '군산지방해양수산청', port: '군산항', subPort: '외항', facilityType: '여객터미널', name: '군산항 외항여객터미널', reason: '정기 점검 대상', designatedAt: '2023-09-14' },
  { category: 'multi', year: '2025', kindType: '3종', agency: '평택지방해양수산청', port: '평택당진항', subPort: '당진항', facilityType: '여객부두', name: '당진항 여객부두', reason: '노후 설비 관리', designatedAt: '2025-02-28' },
  { category: 'multi', year: '2024', kindType: '2종', agency: '마산지방해양수산청', port: '통영항', subPort: '통영항', facilityType: '여객터미널', name: '통영항 여객터미널', reason: '도서 여객 집중', designatedAt: '2024-10-07' },
  { category: 'multi', year: '2023', kindType: '1종', agency: '여수광양항만공사', port: '여수항', subPort: '국동항', facilityType: '여객부두', name: '국동항 여객부두', reason: '이용객 밀집', designatedAt: '2023-06-19' },
  { category: 'vulnerable', year: '2023', kindType: '2종', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', facilityType: '계류시설', name: 'LPG부두', reason: '집중관리 대상', designatedAt: '2023-11-22', grade: 'C', inspectionFirstHalf: '완료', inspectionSecondHalf: '예정', inspectionCount: 1 },
  { category: 'vulnerable', year: '2024', kindType: '3종', agency: '인천항만공사', port: '인천항', subPort: '신항', facilityType: '외곽시설', name: '신항 방파제', reason: '침하·변형 지속', designatedAt: '2024-07-04', grade: 'D', inspectionFirstHalf: '완료', inspectionSecondHalf: '완료', inspectionCount: 2 },
  { category: 'vulnerable', year: '2025', kindType: '2종', agency: '부산항만공사', port: '부산항', subPort: '북항', facilityType: '계류시설', name: '북항 제2부두', reason: '노후화 진행', designatedAt: '2025-01-19', grade: 'E', inspectionFirstHalf: '완료', inspectionSecondHalf: '예정', inspectionCount: 1 },
  { category: 'vulnerable', year: '2024', kindType: '기타', agency: '여수지방해양수산청', port: '거문도항', subPort: '거문도항', facilityType: '계류시설', name: '거문도 물양장', reason: '균열 확인', designatedAt: '2024-02-28', grade: 'D', inspectionFirstHalf: '완료', inspectionSecondHalf: '완료', inspectionCount: 2 },
  { category: 'vulnerable', year: '2023', kindType: '3종', agency: '경상북도', port: '구룡포항', subPort: '구룡포항', facilityType: '외곽시설', name: '구룡포 방파제', reason: '침하 우려', designatedAt: '2023-09-10', grade: 'C', inspectionFirstHalf: '완료', inspectionSecondHalf: '완료', inspectionCount: 2 },
  { category: 'vulnerable', year: '2025', kindType: '1종', agency: '인천항만공사', port: '인천항', subPort: '남항', facilityType: '계류시설', name: '남항 안벽', reason: '내구성 저하', designatedAt: '2025-04-07', grade: 'D', inspectionFirstHalf: '예정', inspectionSecondHalf: '예정', inspectionCount: 0 },
  { category: 'vulnerable', year: '2024', kindType: '2종', agency: '목포지방해양수산청', port: '목포항', subPort: '대불부두', facilityType: '계류시설', name: '대불부두 안벽', reason: '열화 확인', designatedAt: '2024-05-21', grade: 'E', inspectionFirstHalf: '완료', inspectionSecondHalf: '완료', inspectionCount: 2 },
  { category: 'vulnerable', year: '2023', kindType: '기타', agency: '부산지방해양수산청', port: '부산항', subPort: '감천항', facilityType: '외곽시설', name: '감천항 호안', reason: '변형 지속', designatedAt: '2023-03-16', grade: 'D', inspectionFirstHalf: '완료', inspectionSecondHalf: '예정', inspectionCount: 1 },
  { category: 'vulnerable', year: '2025', kindType: '3종', agency: '여수광양항만공사', port: '광양항', subPort: '중마부두', facilityType: '계류시설', name: '중마부두', reason: '집중관리 대상', designatedAt: '2025-06-14', grade: 'C', inspectionFirstHalf: '예정', inspectionSecondHalf: '예정', inspectionCount: 0 },
  { category: 'vulnerable', year: '2024', kindType: '2종', agency: '부산항만공사', port: '부산항', subPort: '신항', facilityType: '외곽시설', name: '신항 호안', reason: '균열 확인', designatedAt: '2024-12-09', grade: 'D', inspectionFirstHalf: '완료', inspectionSecondHalf: '예정', inspectionCount: 1 },
  { category: 'seismic', year: '2025', kindType: '2종', agency: '여수지방해양수산청', port: '거문도항', subPort: '거문도항', facilityType: '계류시설', name: '거문도항 부두', reason: '출입통제 필요', designatedAt: '2025-02-18', grade: 'D', inspectionFirstHalf: '완료', inspectionSecondHalf: '예정', inspectionCount: 1 },
  { category: 'seismic', year: '2024', kindType: '기타', agency: '경상북도', port: '구룡포항', subPort: '구룡포항', facilityType: '계류시설', name: '구룡포항 부두', reason: '출입통제구역 지정', designatedAt: '2024-09-30', grade: 'C', inspectionFirstHalf: '예정', inspectionSecondHalf: '예정', inspectionCount: 0 },
  { category: 'seismic', year: '2025', kindType: '1종', agency: '부산항만공사', port: '부산항', subPort: '신항', facilityType: '계류시설', name: '신항 컨테이너부두', reason: '출입통제 운영', designatedAt: '2025-02-25', grade: 'D', inspectionFirstHalf: '완료', inspectionSecondHalf: '예정', inspectionCount: 1 },
  { category: 'seismic', year: '2024', kindType: '2종', agency: '인천항만공사', port: '인천항', subPort: '연안부두', facilityType: '계류시설', name: '연안부두 안벽', reason: '출입통제구역 지정', designatedAt: '2024-03-17', grade: 'E', inspectionFirstHalf: '완료', inspectionSecondHalf: '완료', inspectionCount: 2 },
  { category: 'seismic', year: '2023', kindType: '3종', agency: '목포지방해양수산청', port: '목포항', subPort: '북항', facilityType: '계류시설', name: '북항 물양장', reason: '출입통제 필요', designatedAt: '2023-08-01', grade: 'D', inspectionFirstHalf: '완료', inspectionSecondHalf: '예정', inspectionCount: 1 },
  { category: 'seismic', year: '2025', kindType: '기타', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', facilityType: '계류시설', name: '광양항 일반부두', reason: '출입통제 운영', designatedAt: '2025-04-03', grade: 'C', inspectionFirstHalf: '예정', inspectionSecondHalf: '예정', inspectionCount: 0 },
  { category: 'seismic', year: '2024', kindType: '2종', agency: '부산지방해양수산청', port: '부산항', subPort: '감천항', facilityType: '외곽시설', name: '감천항 방파제', reason: '출입통제구역 지정', designatedAt: '2024-10-11', grade: 'D', inspectionFirstHalf: '완료', inspectionSecondHalf: '완료', inspectionCount: 2 },
  { category: 'seismic', year: '2023', kindType: '3종', agency: '경상북도', port: '구룡포항', subPort: '구룡포항', facilityType: '외곽시설', name: '구룡포항 호안', reason: '출입통제 확인', designatedAt: '2023-06-20', grade: 'C', inspectionFirstHalf: '완료', inspectionSecondHalf: '완료', inspectionCount: 2 },
  { category: 'seismic', year: '2025', kindType: '2종', agency: '인천항만공사', port: '인천항', subPort: '신항', facilityType: '외곽시설', name: '신항 방파호안', reason: '출입통제 운영', designatedAt: '2025-05-08', grade: 'E', inspectionFirstHalf: '완료', inspectionSecondHalf: '예정', inspectionCount: 1 },
  { category: 'seismic', year: '2024', kindType: '1종', agency: '부산항만공사', port: '부산항', subPort: '북항', facilityType: '계류시설', name: '북항 재개발부두', reason: '출입통제구역 지정', designatedAt: '2024-07-18', grade: 'D', inspectionFirstHalf: '완료', inspectionSecondHalf: '완료', inspectionCount: 2 },
];

const SPECIAL_MULTI_COLUMNS = [
  { key: 'no', header: '연번', className: 'col-no', sortable: false, render: (_row, index) => index + 1 },
  { key: 'port', header: '항명', className: 'special-col-port' },
  { key: 'subPort', header: '세부항명', className: 'special-col-subport' },
  { key: 'facilityType', header: '구분', className: 'special-col-type' },
  { key: 'name', header: '시설명', className: 'is-left special-col-name' },
];

const SPECIAL_MANAGEMENT_COLUMNS = [
  { key: 'no', header: '연번', className: 'col-no', sortable: false, render: (_row, index) => index + 1 },
  { key: 'agency', header: '관리주체', className: 'is-left special-col-agency' },
  { key: 'port', header: '항', className: 'special-col-port' },
  { key: 'subPort', header: '세부항', className: 'special-col-subport' },
  { key: 'name', header: '시설물명', className: 'is-left special-col-name' },
  { key: 'kindType', header: '종구분', className: 'special-col-kind' },
  { key: 'grade', header: '안전등급', headerHtml: '안전<br>등급', className: 'special-col-grade' },
  { key: 'inspectionFirstHalf', header: '상반기', group: '안전점검', className: 'special-col-inspect' },
  { key: 'inspectionSecondHalf', header: '하반기', group: '안전점검', className: 'special-col-inspect' },
  { key: 'inspectionCount', header: '점검횟수', headerHtml: '점검<br>횟수', className: 'special-col-count' },
];

function specialSummaryItem(label, value) {
  return `${label} ${value.toLocaleString()}개소`;
}

const SPECIAL_FACILITY_PAGE_CONFIG = {
  sidebarActive: 'special-facility',
  rows: SPECIAL_FACILITY_ROWS,
  formId: '#specialFacilitySearchForm',
  resetBtnId: '#specialFacilityResetBtn',
  searchBtnId: '#specialFacilitySearchBtn',
  tableBodyId: '#specialFacilityTableBody',
  countId: '#specialFacilityResultCount',
  summaryId: '#specialFacilitySummary',
  tab: {
    selector: '[data-system-tab]',
    key: 'category',
    defaultValue: 'multi',
    filterTabs: ['vulnerable', 'seismic'],
  },
  map: {
    rootId: '#specialFacilityMap',
    center: [35.108, 129.041],
    zoom: 11,
    selectZoom: 14,
  },
  filters: [
    { id: '#specialAgency', key: 'agency', tabs: ['vulnerable', 'seismic'] },
    { id: '#specialPort', key: 'year', tabs: ['vulnerable', 'seismic'] },
    { id: '#specialFacilityName', key: 'kindType', tabs: ['vulnerable', 'seismic'] },
  ],
  pagination: {
    rootId: '#specialFacilityPagination',
    pageSize: 12,
    pageSizeByTab: {
      multi: 12,
      vulnerable: 12,
      seismic: 12,
    },
  },
  summary: {
    render(rows, tabValue) {
      const total = `총 <strong>${rows.length.toLocaleString()}</strong>건`;
      if (tabValue === 'multi') {
        return [
          total,
          specialSummaryItem('여객부두', rows.filter((row) => row.facilityType === '여객부두').length),
          specialSummaryItem('여객터미널', rows.filter((row) => row.facilityType === '여객터미널').length),
        ].join(' · ');
      }

      return [
        total,
        specialSummaryItem('D등급', rows.filter((row) => row.grade === 'D').length),
        specialSummaryItem('E등급', rows.filter((row) => row.grade === 'E').length),
      ].join(' · ');
    },
  },
  columns: SPECIAL_MULTI_COLUMNS,
  tabColumns: {
    multi: SPECIAL_MULTI_COLUMNS,
    vulnerable: SPECIAL_MANAGEMENT_COLUMNS,
    seismic: SPECIAL_MANAGEMENT_COLUMNS,
  },
};
