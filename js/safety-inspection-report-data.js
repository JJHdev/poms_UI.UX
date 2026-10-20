/** 안전점검보고서 샘플 데이터 */

const SAFETY_REPORT_DATA = [
  { year: '2020', agency: '부산지방해양수산청', port: '부산항', subPort: '감천항', classType: '2종', facilityType: '계류시설', name: '부산항 국민오일', inspectType: '정밀안전점검', downloadState: 'approved',
    history: [
      { type: '다운로드 신청', date: '2026-07-08 09:12', note: '' },
      { type: '승인', date: '2026-07-09 10:00', note: '' },
    ] },
  { year: '2020', agency: '여수지방해양수산청', port: '여수항', subPort: '여천항', classType: '1종', facilityType: '안벽시설', name: '여천항 안벽', inspectType: '정밀안전진단', downloadState: 'requested',
    history: [
      { type: '다운로드 신청', date: '2026-07-10 14:22', note: '' },
    ] },
  { year: '2020', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', classType: '1종', facilityType: '계류시설', name: '광양항 컨테이너부두', inspectType: '성능평가',
    history: [
      { type: '다운로드 신청', date: '2026-07-01 09:00', note: '' },
      { type: '반려', date: '2026-07-02 16:40', note: '증빙자료(공문) 미첨부로 반려합니다. 보완 후 재신청 바랍니다.' },
    ] },
  { year: '2020', agency: '인천항만공사', port: '인천항', subPort: '신항', classType: '1종', facilityType: '계류시설', name: '신항 컨테이너터미널', inspectType: '정밀안전점검' },
  { year: '2019', agency: '부산항만공사', port: '부산항', subPort: '남항', classType: '1종', facilityType: '건축물', name: '남항 크루즈터미널', inspectType: '정밀안전진단', downloadState: 'approved',
    history: [
      { type: '다운로드 신청', date: '2026-07-05 10:30', note: '' },
      { type: '승인', date: '2026-07-06 09:15', note: '' },
    ] },
  { year: '2019', agency: '부산지방해양수산청', port: '부산항', subPort: '북항', classType: '2종', facilityType: '외곽시설', name: '북항 방파제', inspectType: '성능평가' },
  { year: '2019', agency: '여수지방해양수산청', port: '거문도항', subPort: '거문도항', classType: '기타', facilityType: '계류시설', name: '거문도항 부두', inspectType: '정밀안전점검' },
  { year: '2018', agency: '인천항만공사', port: '인천항', subPort: '연안부두', classType: '1종', facilityType: '건축물', name: '인천항 크루즈터미널', inspectType: '정밀안전진단', downloadState: 'requested',
    history: [
      { type: '다운로드 신청', date: '2026-07-11 11:05', note: '' },
    ] },
  { year: '2018', agency: '경상북도', port: '구룡포항', subPort: '구룡포항', classType: '기타', facilityType: '안벽시설', name: '구룡포항 안벽', inspectType: '정밀안전점검' },
  { year: '2018', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', classType: '1종', facilityType: '계류시설', name: 'LPG부두', inspectType: '성능평가' },
  { year: '2017', agency: '부산지방해양수산청', port: '부산항', subPort: '남항', classType: '1종', facilityType: '계류시설', name: '부산항 제1부두', inspectType: '정밀안전진단', downloadState: 'approved',
    history: [
      { type: '다운로드 신청', date: '2026-07-03 08:50', note: '' },
      { type: '승인', date: '2026-07-03 15:20', note: '' },
    ] },
  { year: '2017', agency: '부산항만공사', port: '부산항', subPort: '북항', classType: '1종', facilityType: '교통시설', name: '신항 배후부지 접근로', inspectType: '정밀안전점검' },
  { year: '2016', agency: '여수지방해양수산청', port: '여수항', subPort: '여천항', classType: '기타', facilityType: '계류시설', name: '여천항 물양장', inspectType: '성능평가' },
  { year: '2016', agency: '인천항만공사', port: '인천항', subPort: '신항', classType: '1종', facilityType: '외곽시설', name: '신항 방파제', inspectType: '정밀안전진단' },
  { year: '2015', agency: '부산지방해양수산청', port: '부산항', subPort: '감천항', classType: '2종', facilityType: '계류시설', name: '물양장(1)', inspectType: '정밀안전점검' },
];
