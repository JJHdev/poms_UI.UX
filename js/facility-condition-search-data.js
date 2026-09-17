(function (global) {
  const RESULT_COLUMNS = [
    { id: 'agency', label: '관리주체' },
    { id: 'port', label: '항명' },
    { id: 'subPort', label: '세부항명' },
    { id: 'name', label: '시설물명' },
  ];

  /* Figma 187:5662 STEP.03 기본 선택 순서 */
  const DEFAULT_SELECTED = [
    'port',
    'facilityClass',
    'surchargeLoad',
    'buildingArea',
    'floors',
    'length',
    'disasterProject',
  ];

  const OUTPUT_FIELDS = [
    { id: 'agency', label: '관리주체' },
    { id: 'port', label: '항명' },
    { id: 'subPort', label: '세부항명' },
    { id: 'name', label: '시설물명' },
    { id: 'manageCategory', label: '관리구분' },
    { id: 'facilityType', label: '시설구분' },
    { id: 'facilityClass', label: '시설종별' },
    { id: 'facilityForm', label: '시설형식' },
    { id: 'structureType', label: '대표구조형식' },
    { id: 'otherSpecs', label: '기타상세제원' },
    { id: 'length', label: '연장' },
    { id: 'berthNo', label: '선석번호' },
    { id: 'berthingCapacity', label: '접안능력' },
    { id: 'completionDate', label: '준공일자' },
    { id: 'grade', label: '상태등급' },
    { id: 'conditionIndex', label: '상태지수' },
    { id: 'seismic', label: '내진설계적용여부' },
    { id: 'frontDepthPlan', label: '전면수심계획' },
    { id: 'surchargeLoad', label: '상재하중' },
    // { id: 'disasterProject', label: '재해취약지구사업' },
    { id: 'buildingArea', label: '건축연면적' },
    { id: 'designLoad', label: '설계하중' },
    { id: 'mainUsage', label: '주용도' },
    { id: 'floors', label: '층수' },
  ];

  const DETAIL_GROUPS = [
    {
      title: '건축물',
      fields: [
        'agency', 'port', 'subPort', 'name',
        'completionDate', 'manageCategory', 'facilityType', 'facilityClass',
        'facilityForm', 'structureType', 'otherSpecs',
        'length', 'berthNo', 'berthingCapacity', 'grade',
        'conditionIndex', 'seismic', 'frontDepthPlan', 'surchargeLoad', 'disasterProject',
      ],
    },
    {
      title: '임항교통시설',
      fields: ['buildingArea', 'designLoad'],
    },
    {
      title: '건축물',
      fields: ['mainUsage', 'floors'],
    },
  ];

  const ICONS = {
    drag: 'assets/main/facility-condition-search/Group%20239760.svg',
    close: 'assets/main/facility-condition-search/Group%20239758.svg',
    closeChip: 'assets/main/facility-condition-search/Group%20239758-1.svg',
  };

  const SAMPLE_DATA = [
    { id: 'gamcheon', facilityId: 'POMS-2007001', agency: '부산지방해양수산청', port: '부산항', subPort: '감천항', name: '물양장(1)', manageCategory: '국가관리', facilityType: '계류시설', facilityClass: '기타', classType: '기타', facilityForm: '잔교식', structureType: 'RC잔교', length: '120m', berthNo: 'G-1', berthingCapacity: '500DWT', completionDate: '2007-06-15', year: '2007', grade: 'B', conditionIndex: '0.82', seismic: '미적용', frontDepthPlan: '-5.0m', surchargeLoad: '1.0t/㎡', buildingArea: '850㎡', designLoad: '-', disasterProject: '해당', mainUsage: '물양장', floors: '1', otherSpecs: '-' },
    { id: 'gamcheon', facilityId: 'POMS-2008002', agency: '부산지방해양수산청', port: '부산항', subPort: '감천항', name: '물양장(2)', manageCategory: '국가관리', facilityType: '계류시설', facilityClass: '기타', classType: '기타', facilityForm: '잔교식', structureType: 'RC잔교', length: '85m', berthNo: 'G-2', berthingCapacity: '300DWT', completionDate: '2008-03-20', year: '2008', grade: 'B', conditionIndex: '0.79', seismic: '미적용', frontDepthPlan: '-4.5m', surchargeLoad: '1.0t/㎡' },
    { id: 'gamcheon', facilityId: 'POMS-2005003', agency: '부산지방해양수산청', port: '부산항', subPort: '감천항', name: '감천항 부두', manageCategory: '국가관리', facilityType: '안벽시설', facilityClass: '2종', classType: '2종', facilityForm: '중력식', structureType: '케이슨', length: '250m', berthNo: 'G-3', berthingCapacity: '5,000DWT', completionDate: '2005-11-02', year: '2005', grade: 'C', conditionIndex: '0.61', seismic: '미적용', frontDepthPlan: '-9.0m', surchargeLoad: '3.0t/㎡' },
    { id: 'south', facilityId: 'POMS-2006004', agency: '부산지방해양수산청', port: '부산항', subPort: '남항', name: '국제여객터미널', manageCategory: '국가관리', facilityType: '계류시설', facilityClass: '1종', classType: '1종', facilityForm: '잔교식', structureType: '강관파일', length: '320m', berthNo: 'S-1', berthingCapacity: '50,000GT', completionDate: '2006-08-18', year: '2006', grade: 'A', conditionIndex: '0.91', seismic: '적용', frontDepthPlan: '-11.0m', surchargeLoad: '2.5t/㎡' },
    { id: 'south', facilityId: 'POMS-2005005', agency: '부산지방해양수산청', port: '부산항', subPort: '남항', name: '부산항 제1부두', manageCategory: '국가관리', facilityType: '안벽시설', facilityClass: '1종', classType: '1종', facilityForm: '중력식', structureType: '블록식', length: '400m', berthNo: 'S-2', berthingCapacity: '20,000DWT', completionDate: '2005-04-12', year: '2005', grade: 'B', conditionIndex: '0.77', seismic: '미적용', frontDepthPlan: '-12.0m', surchargeLoad: '4.0t/㎡' },
    { id: 'north', facilityId: 'POMS-2018006', agency: '부산지방해양수산청', port: '부산항', subPort: '북항', name: '북항 방파제', manageCategory: '국가관리', facilityType: '외곽시설', facilityClass: '2종', classType: '2종', facilityForm: '혼성제', structureType: '케이슨방파제', length: '1,250m', berthNo: '-', berthingCapacity: '-', completionDate: '2018-12-05', year: '2018', grade: 'B', conditionIndex: '0.84', seismic: '적용', frontDepthPlan: '-', surchargeLoad: '-' },
    { id: 'north', facilityId: 'POMS-2007007', agency: '부산지방해양수산청', port: '부산항', subPort: '북항', name: '남방파제', manageCategory: '국가관리', facilityType: '외곽시설', facilityClass: '2종', classType: '2종', facilityForm: '혼성제', structureType: '사석방파제', length: '980m', berthNo: '-', berthingCapacity: '-', completionDate: '2007-09-28', year: '2007', grade: 'B', conditionIndex: '0.80', seismic: '적용', frontDepthPlan: '-', surchargeLoad: '-' },
    { id: 'yeosu', facilityId: 'POMS-2004008', agency: '여수지방해양수산청', port: '여수항', subPort: '여천항', name: '여천항 물양장', manageCategory: '국가관리', facilityType: '계류시설', facilityClass: '기타', classType: '기타', facilityForm: '잔교식', structureType: 'RC잔교', length: '95m', berthNo: 'Y-1', berthingCapacity: '200DWT', completionDate: '2004-05-30', year: '2004', grade: 'C', conditionIndex: '0.58', seismic: '미적용', frontDepthPlan: '-4.0m', surchargeLoad: '0.8t/㎡' },
    { id: 'yeosu', facilityId: 'POMS-2010009', agency: '여수지방해양수산청', port: '여수항', subPort: '여천항', name: '여천항 접안시설', manageCategory: '국가관리', facilityType: '계류시설', facilityClass: '2종', classType: '2종', facilityForm: '잔교식', structureType: '강관파일', length: '180m', berthNo: 'Y-2', berthingCapacity: '3,000DWT', completionDate: '2010-07-14', year: '2010', grade: 'B', conditionIndex: '0.75', seismic: '적용', frontDepthPlan: '-8.0m', surchargeLoad: '2.0t/㎡' },
    { id: 'geomundo', facilityId: 'POMS-2003010', agency: '여수지방해양수산청', port: '거문도항', subPort: '거문도항', name: '화물부두 물양장', manageCategory: '국가관리', facilityType: '계류시설', facilityClass: '기타', classType: '기타', facilityForm: '잔교식', structureType: 'RC잔교', length: '70m', berthNo: 'GM-1', berthingCapacity: '150DWT', completionDate: '2003-10-08', year: '2003', grade: 'C', conditionIndex: '0.55', seismic: '미적용', frontDepthPlan: '-3.5m', surchargeLoad: '0.5t/㎡' },
    { id: 'geomundo', facilityId: 'POMS-2002011', agency: '여수지방해양수산청', port: '거문도항', subPort: '거문도항', name: '거문도항 부두', manageCategory: '국가관리', facilityType: '안벽시설', facilityClass: '기타', classType: '기타', facilityForm: '중력식', structureType: '블록식', length: '110m', berthNo: 'GM-2', berthingCapacity: '1,000DWT', completionDate: '2002-02-21', year: '2002', grade: 'C', conditionIndex: '0.52', seismic: '미적용', frontDepthPlan: '-6.0m', surchargeLoad: '1.5t/㎡' },
    { id: 'gyeongyang', facilityId: 'POMS-2012012', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', name: 'LPG부두', manageCategory: '항만공사', facilityType: '계류시설', facilityClass: '1종', classType: '1종', facilityForm: '잔교식', structureType: '강관파일', length: '280m', berthNo: 'GY-LPG', berthingCapacity: '80,000DWT', completionDate: '2012-06-01', year: '2012', grade: 'A', conditionIndex: '0.93', seismic: '적용', frontDepthPlan: '-14.0m', surchargeLoad: '3.5t/㎡' },
    { id: 'gyeongyang', facilityId: 'POMS-2010013', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', name: '광양항 서부두', manageCategory: '항만공사', facilityType: '안벽시설', facilityClass: '2종', classType: '2종', facilityForm: '중력식', structureType: '케이슨', length: '350m', berthNo: 'GY-W1', berthingCapacity: '30,000DWT', completionDate: '2010-09-17', year: '2010', grade: 'B', conditionIndex: '0.78', seismic: '적용', frontDepthPlan: '-13.0m', surchargeLoad: '4.0t/㎡' },
    { id: 'gyeongyang', facilityId: 'POMS-2015014', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', name: '컨테이너부두', manageCategory: '항만공사', facilityType: '계류시설', facilityClass: '1종', classType: '1종', facilityForm: '잔교식', structureType: '강관파일', length: '600m', berthNo: 'GY-C1', berthingCapacity: '50,000TEU', completionDate: '2015-03-25', year: '2015', grade: 'A', conditionIndex: '0.95', seismic: '적용', frontDepthPlan: '-16.0m', surchargeLoad: '5.0t/㎡' },
    { id: 'gamman', facilityId: 'POMS-2007015', agency: '여수광양항만공사', port: '여수항', subPort: '감만항', name: '물양장(2)', manageCategory: '항만공사', facilityType: '계류시설', facilityClass: '기타', classType: '기타', facilityForm: '잔교식', structureType: 'RC잔교', length: '60m', berthNo: 'GMN-2', berthingCapacity: '100DWT', completionDate: '2007-01-19', year: '2007', grade: 'C', conditionIndex: '0.57', seismic: '미적용', frontDepthPlan: '-3.0m', surchargeLoad: '0.5t/㎡' },
    { id: 'gamman', facilityId: 'POMS-2011016', agency: '여수광양항만공사', port: '여수항', subPort: '감만항', name: '감만항 접안시설', manageCategory: '항만공사', facilityType: '계류시설', facilityClass: '2종', classType: '2종', facilityForm: '잔교식', structureType: '강관파일', length: '150m', berthNo: 'GMN-1', berthingCapacity: '2,000DWT', completionDate: '2011-11-08', year: '2011', grade: 'C', conditionIndex: '0.63', seismic: '미적용', frontDepthPlan: '-7.0m', surchargeLoad: '1.5t/㎡' },
    { id: 'sinseondae', facilityId: 'POMS-2008017', agency: '여수광양항만공사', port: '여수항', subPort: '신선대', name: '여수항 연안부두', manageCategory: '항만공사', facilityType: '계류시설', facilityClass: '2종', classType: '2종', facilityForm: '잔교식', structureType: '강관파일', length: '210m', berthNo: 'SS-1', berthingCapacity: '5,000DWT', completionDate: '2008-05-22', year: '2008', grade: 'B', conditionIndex: '0.76', seismic: '적용', frontDepthPlan: '-8.5m', surchargeLoad: '2.0t/㎡' },
    { id: 'incheon', facilityId: 'POMS-2020018', agency: '인천항만공사', port: '인천항', subPort: '신항', name: '신항 컨테이너터미널', manageCategory: '항만공사', facilityType: '계류시설', facilityClass: '1종', classType: '1종', facilityForm: '잔교식', structureType: '강관파일', length: '1,100m', berthNo: 'IC-NCT', berthingCapacity: '14,000TEU', completionDate: '2020-04-10', year: '2020', grade: 'A', conditionIndex: '0.97', seismic: '적용', frontDepthPlan: '-18.0m', surchargeLoad: '6.0t/㎡' },
    { id: 'incheon', facilityId: 'POMS-2019019', agency: '인천항만공사', port: '인천항', subPort: '연안부두', name: '인천항 크루즈터미널', manageCategory: '항만공사', facilityType: '계류시설', facilityClass: '1종', classType: '1종', facilityForm: '잔교식', structureType: '강관파일', length: '360m', berthNo: 'IC-CR', berthingCapacity: '100,000GT', completionDate: '2019-08-30', year: '2019', grade: 'A', conditionIndex: '0.94', seismic: '적용', frontDepthPlan: '-12.0m', surchargeLoad: '2.0t/㎡' },
    { id: 'guryongpo', facilityId: 'POMS-2001020', agency: '경상북도', port: '구룡포항', subPort: '구룡포항', name: '물양장(1)', manageCategory: '지자체', facilityType: '계류시설', facilityClass: '기타', classType: '기타', facilityForm: '잔교식', structureType: 'RC잔교', length: '55m', berthNo: 'GR-1', berthingCapacity: '80DWT', completionDate: '2001-12-03', year: '2001', grade: 'C', conditionIndex: '0.50', seismic: '미적용', frontDepthPlan: '-3.0m', surchargeLoad: '0.5t/㎡' },
    { id: 'guryongpo', facilityId: 'POMS-1999021', agency: '경상북도', port: '구룡포항', subPort: '구룡포항', name: '안벽', manageCategory: '지자체', facilityType: '안벽시설', facilityClass: '기타', classType: '기타', facilityForm: '중력식', structureType: '블록식', length: '130m', berthNo: 'GR-2', berthingCapacity: '800DWT', completionDate: '1999-07-11', year: '1999', grade: 'C', conditionIndex: '0.48', seismic: '미적용', frontDepthPlan: '-5.5m', surchargeLoad: '1.0t/㎡' },
    { id: 'guryongpo', facilityId: 'POMS-2006022', agency: '경상북도', port: '구룡포항', subPort: '구룡포항', name: '구룡포항 부두', manageCategory: '지자체', facilityType: '안벽시설', facilityClass: '기타', classType: '기타', facilityForm: '중력식', structureType: '케이슨', length: '160m', berthNo: 'GR-3', berthingCapacity: '1,500DWT', completionDate: '2006-10-25', year: '2006', grade: 'B', conditionIndex: '0.72', seismic: '미적용', frontDepthPlan: '-7.0m', surchargeLoad: '1.5t/㎡' },
    { id: 'mokpo', facilityId: 'POMS-2012023', agency: '여수광양항만공사', port: '목포항', subPort: '대불', name: '목포항 대불부두', manageCategory: '항만공사', facilityType: '안벽시설', facilityClass: '기타', classType: '기타', facilityForm: '중력식', structureType: '케이슨', length: '220m', berthNo: 'MP-1', berthingCapacity: '10,000DWT', completionDate: '2012-02-14', year: '2012', grade: 'C', conditionIndex: '0.66', seismic: '미적용', frontDepthPlan: '-10.0m', surchargeLoad: '3.0t/㎡' },
    { id: 'busan', facilityId: 'POMS-2016024', agency: '부산항만공사', port: '부산항', subPort: '북항', name: '신항 배후부지 접근로', manageCategory: '항만공사', facilityType: '교량시설', facilityClass: '1종', classType: '1종', facilityForm: 'PSC빔', structureType: 'PSC거더교', length: '480m', berthNo: '-', berthingCapacity: '-', completionDate: '2016-05-09', year: '2016', grade: 'A', conditionIndex: '0.90', seismic: '적용', frontDepthPlan: '-', surchargeLoad: '-', designLoad: 'DB-24', mainUsage: '도로', floors: '-' },
    { id: 'busan', facilityId: 'POMS-2017025', agency: '부산항만공사', port: '부산항', subPort: '남항', name: '남항 크루즈터미널', manageCategory: '항만공사', facilityType: '계류시설', facilityClass: '1종', classType: '1종', facilityForm: '잔교식', structureType: '강관파일', length: '340m', berthNo: 'BN-CR', berthingCapacity: '120,000GT', completionDate: '2017-09-01', year: '2017', grade: 'A', conditionIndex: '0.92', seismic: '적용', frontDepthPlan: '-12.5m', surchargeLoad: '2.0t/㎡' },
    { id: 'ulsan', facilityId: 'POMS-2014026', agency: '울산항만공사', port: '울산항', subPort: '본항', name: '울산항 본항부두', manageCategory: '항만공사', facilityType: '안벽시설', facilityClass: '1종', classType: '1종', facilityForm: '중력식', structureType: '케이슨', length: '420m', berthNo: 'UL-1', berthingCapacity: '50,000DWT', completionDate: '2014-11-20', year: '2014', grade: 'B', conditionIndex: '0.81', seismic: '적용', frontDepthPlan: '-14.0m', surchargeLoad: '4.5t/㎡' },
    { id: 'ulsan', facilityId: 'POMS-2013027', agency: '울산항만공사', port: '울산항', subPort: '온산항', name: '온산항 석유화학부두', manageCategory: '항만공사', facilityType: '계류시설', facilityClass: '1종', classType: '1종', facilityForm: '잔교식', structureType: '강관파일', length: '260m', berthNo: 'UL-OS', berthingCapacity: '40,000DWT', completionDate: '2013-06-07', year: '2013', grade: 'B', conditionIndex: '0.83', seismic: '적용', frontDepthPlan: '-13.5m', surchargeLoad: '3.0t/㎡' },
    { id: 'pohang', facilityId: 'POMS-2009028', agency: '경상북도', port: '포항항', subPort: '영일만항', name: '영일만항 다목적부두', manageCategory: '지자체', facilityType: '안벽시설', facilityClass: '2종', classType: '2종', facilityForm: '중력식', structureType: '케이슨', length: '300m', berthNo: 'PH-1', berthingCapacity: '20,000DWT', completionDate: '2009-08-16', year: '2009', grade: 'B', conditionIndex: '0.74', seismic: '적용', frontDepthPlan: '-11.0m', surchargeLoad: '3.5t/㎡' },
    { id: 'pohang', facilityId: 'POMS-2011029', agency: '경상북도', port: '포항항', subPort: '구항', name: '포항구항 물양장', manageCategory: '지자체', facilityType: '계류시설', facilityClass: '기타', classType: '기타', facilityForm: '잔교식', structureType: 'RC잔교', length: '90m', berthNo: 'PH-G', berthingCapacity: '200DWT', completionDate: '2011-03-04', year: '2011', grade: 'C', conditionIndex: '0.60', seismic: '미적용', frontDepthPlan: '-4.0m', surchargeLoad: '0.8t/㎡' },
    { id: 'jeju', facilityId: 'POMS-2018030', agency: '제주특별자치도', port: '제주항', subPort: '내항', name: '제주항 여객부두', manageCategory: '지자체', facilityType: '계류시설', facilityClass: '1종', classType: '1종', facilityForm: '잔교식', structureType: '강관파일', length: '290m', berthNo: 'JJ-1', berthingCapacity: '15,000GT', completionDate: '2018-01-25', year: '2018', grade: 'A', conditionIndex: '0.89', seismic: '적용', frontDepthPlan: '-9.0m', surchargeLoad: '2.0t/㎡' },
  ];

  const MULTI_FIELD_LABELS = {
    agency: '관리주체',
    port: '항',
    subPort: '세부항',
    facilityType: '시설구분',
    classType: '종별구분',
    seismic: '내진설계적용여부',
    grade: '상태등급',
  };

  const MULTI_FIELD_SOURCE_MAP = {
    agency: 'filterAgency',
    port: 'filterPort',
    subPort: 'filterSubPort',
    facilityType: 'filterFacilityType',
    classType: 'filterClassType',
    seismic: 'filterSeismic',
    grade: 'filterGrade',
  };

  global.PomsConditionData = {
    RESULT_COLUMNS,
    DEFAULT_SELECTED,
    OUTPUT_FIELDS,
    DETAIL_GROUPS,
    ICONS,
    SAMPLE_DATA,
    MULTI_FIELD_LABELS,
    MULTI_FIELD_SOURCE_MAP,
    STORAGE_KEY: 'poms.conditionSearch.query',
  };
})(window);