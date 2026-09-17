/** 3종 항만시설물 샘플 데이터 */

const TYPE3_PORT_FACILITY_ROWS = [
  { category: 'status', port: '부산항', subPort: '감천항', facilityType: '외곽시설', name: '감천방파제', lat: 35.055, lng: 129.003 },
  { category: 'status', port: '부산항', subPort: '북항', facilityType: '외곽시설', name: '북항 방파제', lat: 35.105, lng: 129.071 },
  { category: 'status', port: '여수항', subPort: '여천항', facilityType: '계류시설', name: '여천항 물양장', lat: 34.753, lng: 127.746 },
  { category: 'status', port: '구룡포항', subPort: '구룡포항', facilityType: '계류시설', name: '구룡포항 부두', lat: 35.985, lng: 129.56 },
  { category: 'status', port: '거문도항', subPort: '거문도항', facilityType: '계류시설', name: '거문도항 부두', lat: 34.031, lng: 127.307 },
  { category: 'status', port: '인천항', subPort: '연안부두', facilityType: '외곽시설', name: '연안부두 호안', lat: 37.456, lng: 126.592 },
  { category: 'status', port: '목포항', subPort: '북항', facilityType: '계류시설', name: '북항 물양장', lat: 34.795, lng: 126.388 },
  { category: 'status', port: '광양항', subPort: '광양항', facilityType: '계류시설', name: '광양항 일반부두', lat: 34.901, lng: 127.681 },
  { category: 'status', port: '부산항', subPort: '신항', facilityType: '외곽시설', name: '신항 방파호안', lat: 35.076, lng: 128.814 },
  { category: 'status', port: '인천항', subPort: '신항', facilityType: '계류시설', name: '신항 관리부두', lat: 37.345, lng: 126.596 },
  { category: 'status', port: '울산항', subPort: '장생포항', facilityType: '계류시설', name: '장생포 물양장', lat: 35.506, lng: 129.365 },
  { category: 'status', port: '포항항', subPort: '영일만항', facilityType: '외곽시설', name: '영일만 방파제', lat: 36.103, lng: 129.44 },
  { category: 'notice', id: 'notice-001', facilityName: '감천방파제', noticeNo: '제2025-18호', noticeDate: '2025-03-14', agency: '부산지방해양수산청', department: '항만건설과', manager: '김민준', status: '고시', noticeFile: '3종항만시설_감천방파제.pdf' },
  { category: 'notice', id: 'notice-002', facilityName: '북항 방파제', noticeNo: '제2025-27호', noticeDate: '2025-04-02', agency: '부산항만공사', department: '시설관리부', manager: '이서연', status: '고시', noticeFile: '3종항만시설_북항방파제.pdf' },
  { category: 'notice', id: 'notice-003', facilityName: '여천항 물양장', noticeNo: '제2024-91호', noticeDate: '2024-12-18', agency: '여수지방해양수산청', department: '항만물류과', manager: '박도윤', status: '변경', noticeFile: '3종항만시설_여천항물양장.pdf' },
  { category: 'notice', id: 'notice-004', facilityName: '구룡포항 부두', noticeNo: '제2024-73호', noticeDate: '2024-09-25', agency: '경상북도', department: '해양항만과', manager: '최하은', status: '고시', noticeFile: '3종항만시설_구룡포항부두.pdf' },
  { category: 'notice', id: 'notice-005', facilityName: '거문도항 부두', noticeNo: '제2024-58호', noticeDate: '2024-07-11', agency: '여수지방해양수산청', department: '항만건설과', manager: '정지후', status: '해제', noticeFile: '3종항만시설_거문도항부두.pdf' },
  { category: 'notice', id: 'notice-006', facilityName: '연안부두 호안', noticeNo: '제2024-41호', noticeDate: '2024-05-22', agency: '인천항만공사', department: '시설안전팀', manager: '한소율', status: '고시', noticeFile: '3종항만시설_연안부두호안.pdf' },
  { category: 'notice', id: 'notice-007', facilityName: '북항 물양장', noticeNo: '제2023-88호', noticeDate: '2023-11-08', agency: '목포지방해양수산청', department: '항만물류과', manager: '오지민', status: '변경', noticeFile: '3종항만시설_북항물양장.pdf' },
  { category: 'notice', id: 'notice-008', facilityName: '광양항 일반부두', noticeNo: '제2023-67호', noticeDate: '2023-08-30', agency: '여수광양항만공사', department: '항만시설부', manager: '강도현', status: '고시', noticeFile: '3종항만시설_광양항일반부두.pdf' },
  { category: 'notice', id: 'notice-009', facilityName: '신항 방파호안', noticeNo: '제2023-45호', noticeDate: '2023-06-19', agency: '부산항만공사', department: '시설관리부', manager: '윤서아', status: '고시', noticeFile: '3종항만시설_신항방파호안.pdf' },
  { category: 'notice', id: 'notice-010', facilityName: '신항 관리부두', noticeNo: '제2023-22호', noticeDate: '2023-03-07', agency: '인천항만공사', department: '시설안전팀', manager: '문태오', status: '변경', noticeFile: '3종항만시설_신항관리부두.pdf' },
  { category: 'notice', id: 'notice-011', facilityName: '장생포 물양장', noticeNo: '제2022-64호', noticeDate: '2022-10-13', agency: '울산항만공사', department: '항만시설팀', manager: '신유나', status: '고시', noticeFile: '3종항만시설_장생포물양장.pdf' },
  { category: 'notice', id: 'notice-012', facilityName: '영일만 방파제', noticeNo: '제2022-39호', noticeDate: '2022-07-04', agency: '포항지방해양수산청', department: '항만건설과', manager: '배준서', status: '고시', noticeFile: '3종항만시설_영일만방파제.pdf' },
];

const TYPE3_STATUS_COLUMNS = [
  { key: 'no', header: '연번', className: 'col-no', sortable: false, render: (_row, index) => index + 1 },
  { key: 'port', header: '항명' },
  { key: 'subPort', header: '세부항명' },
  { key: 'facilityType', header: '구분' },
  { key: 'name', header: '시설명', className: 'is-left' },
];

const TYPE3_NOTICE_COLUMNS = [
  { key: 'no', header: '연번', className: 'col-no', sortable: false, render: (_row, index) => index + 1 },
  { key: 'noticeNo', header: '고시번호' },
  { key: 'noticeDate', header: '고시일자' },
  { key: 'agency', header: '지정기관', className: 'is-left' },
  { key: 'department', header: '담당부서' },
  { key: 'manager', header: '담당자' },
  { key: 'noticeFile', header: '고시문', className: 'is-left type3-col-notice-file' },
];

const TYPE3_PORT_FACILITY_PAGE_CONFIG = {
  sidebarActive: 'type3-port',
  rows: TYPE3_PORT_FACILITY_ROWS,
  formId: '#type3PortSearchForm',
  resetBtnId: '#type3PortResetBtn',
  searchBtnId: '#type3PortSearchBtn',
  tableBodyId: '#type3PortTableBody',
  countId: '#type3PortResultCount',
  summaryId: '#type3PortSummary',
  tab: {
    selector: '[data-system-tab]',
    key: 'category',
    defaultValue: 'status',
  },
  map: {
    rootId: '#type3PortMap',
    center: [35.108, 129.041],
    zoom: 11,
    selectZoom: 14,
  },
  filters: [
    { id: '#type3FacilityName', key: 'name', type: 'text', tabs: ['status'] },
    { id: '#type3FacilityName', key: 'facilityName', type: 'text', tabs: ['notice'] },
  ],
  pagination: {
    rootId: '#type3PortPagination',
    pageSizeId: '#type3PortPageSize',
    pageSize: 10,
  },
  summary: {
    render(rows) {
      return `총 ${rows.length.toLocaleString()}건`;
    },
  },
  columns: TYPE3_STATUS_COLUMNS,
  tabColumns: {
    status: TYPE3_STATUS_COLUMNS,
    notice: TYPE3_NOTICE_COLUMNS,
  },
  onRowSelect(row, _index, state) {
    if (state.tabValue === 'notice') {
      window.Type3NoticeEditor?.open(row);
    }
  },
};
