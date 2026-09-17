const FACILITY_LOCATION_PORT_ROWS = [
  { id: 'p1', port: '부산항', seaArea: '남해', manageCategory: '국가계획항' },
  { id: 'p2', port: '인천항', seaArea: '서해', manageCategory: '국가계획항' },
  { id: 'p3', port: '광양항', seaArea: '남해', manageCategory: '국가계획항' },
  { id: 'p4', port: '여수항', seaArea: '남해', manageCategory: '국가계획항' },
  { id: 'p5', port: '울산항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'p6', port: '목포항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'p7', port: '마산항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'p8', port: '포항항', seaArea: '동해', manageCategory: '지방계획항' },
  { id: 'p9', port: '포항(북)', seaArea: '동해', manageCategory: '지방계획항' },
  { id: 'p10', port: '도동항', seaArea: '동해', manageCategory: '지방계획항' },
  { id: 'p11', port: '군산항', seaArea: '서해', manageCategory: '지방계획항' },
  { id: 'p12', port: '평택항', seaArea: '서해', manageCategory: '지방계획항' },
  { id: 'p13', port: '동해항', seaArea: '동해', manageCategory: '지방계획항' },
  { id: 'p14', port: '삼척항', seaArea: '동해', manageCategory: '지방계획항' },
  { id: 'p15', port: '속초항', seaArea: '동해', manageCategory: '지방계획항' },
  { id: 'p16', port: '제주항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'p17', port: '서귀포항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'p18', port: '통영항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'p19', port: '진해항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'p20', port: '창원항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'p21', port: '거제항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'p22', port: '보령항', seaArea: '서해', manageCategory: '지방계획항' },
  { id: 'p23', port: '당진항', seaArea: '서해', manageCategory: '지방계획항' },
  { id: 'p24', port: '태안항', seaArea: '서해', manageCategory: '지방계획항' },
];

const FACILITY_LOCATION_SUBPORT_ROWS = [
  { id: 'sp1', port: '부산항', subPort: '북항', seaArea: '남해', manageCategory: '국가계획항' },
  { id: 'sp2', port: '부산항', subPort: '남항', seaArea: '남해', manageCategory: '국가계획항' },
  { id: 'sp3', port: '부산항', subPort: '신항', seaArea: '남해', manageCategory: '국가계획항' },
  { id: 'sp4', port: '부산항', subPort: '감천항', seaArea: '남해', manageCategory: '국가계획항' },
  { id: 'sp5', port: '부산항', subPort: '다대포항', seaArea: '남해', manageCategory: '국가계획항' },
  { id: 'sp6', port: '인천항', subPort: '신항', seaArea: '서해', manageCategory: '국가계획항' },
  { id: 'sp7', port: '인천항', subPort: '연안부두', seaArea: '서해', manageCategory: '국가계획항' },
  { id: 'sp8', port: '인천항', subPort: '북항', seaArea: '서해', manageCategory: '국가계획항' },
  { id: 'sp9', port: '인천항', subPort: '남항', seaArea: '서해', manageCategory: '국가계획항' },
  { id: 'sp10', port: '광양항', subPort: '광양항', seaArea: '남해', manageCategory: '국가계획항' },
  { id: 'sp11', port: '여수항', subPort: '여천항', seaArea: '남해', manageCategory: '국가계획항' },
  { id: 'sp12', port: '여수항', subPort: '국동항', seaArea: '남해', manageCategory: '국가계획항' },
  { id: 'sp13', port: '울산항', subPort: '본항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'sp14', port: '울산항', subPort: '온산항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'sp15', port: '울산항', subPort: '미포항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'sp16', port: '목포항', subPort: '목포항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'sp17', port: '목포항', subPort: '대불항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'sp18', port: '마산항', subPort: '마산항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'sp19', port: '포항항', subPort: '영일만항', seaArea: '동해', manageCategory: '지방계획항' },
  { id: 'sp20', port: '포항항', subPort: '구항', seaArea: '동해', manageCategory: '지방계획항' },
  { id: 'sp21', port: '군산항', subPort: '군산항', seaArea: '서해', manageCategory: '지방계획항' },
  { id: 'sp22', port: '평택항', subPort: '평택항', seaArea: '서해', manageCategory: '지방계획항' },
  { id: 'sp23', port: '제주항', subPort: '제주항', seaArea: '남해', manageCategory: '지방계획항' },
  { id: 'sp24', port: '동해항', subPort: '동해항', seaArea: '동해', manageCategory: '지방계획항' },
];

const FACILITY_LOCATION_FACILITY_ROWS = [
  { id: 'f1', agency: '부산항만공사', port: '부산항', subPort: '북항', facilityType: '계류시설', name: '1부두 안벽' },
  { id: 'f2', agency: '부산항만공사', port: '부산항', subPort: '북항', facilityType: '계류시설', name: '2부두 계류장' },
  { id: 'f3', agency: '부산항만공사', port: '부산항', subPort: '남항', facilityType: '계류시설', name: '국제여객터미널' },
  { id: 'f4', agency: '부산항만공사', port: '부산항', subPort: '감천항', facilityType: '외곽시설', name: '감천방파제' },
  { id: 'f5', agency: '부산항만공사', port: '부산항', subPort: '신항', facilityType: '교통시설', name: '신항 배후부지 접근로' },
  { id: 'f6', agency: '인천항만공사', port: '인천항', subPort: '신항', facilityType: '계류시설', name: '신항 컨테이너터미널' },
  { id: 'f7', agency: '인천항만공사', port: '인천항', subPort: '연안부두', facilityType: '건축물', name: '인천항 크루즈터미널' },
  { id: 'f8', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', facilityType: '계류시설', name: 'LPG부두' },
  { id: 'f9', agency: '여수광양항만공사', port: '여수항', subPort: '여천항', facilityType: '계류시설', name: '여천항 물양장' },
  { id: 'f10', agency: '부산지방해양수산청', port: '부산항', subPort: '북항', facilityType: '외곽시설', name: '북항 방파제' },
  { id: 'f11', agency: '경상북도', port: '구룡포항', subPort: '구룡포항', facilityType: '계류시설', name: '구룡포항 부두' },
  { id: 'f12', agency: '여수지방해양수산청', port: '거문도항', subPort: '거문도항', facilityType: '기타', name: '거문도항 부두' },
  { id: 'f13', agency: '부산항만공사', port: '부산항', subPort: '남항', facilityType: '건축물', name: '남항 크루즈터미널' },
  { id: 'f14', agency: '여수광양항만공사', port: '광양항', subPort: '광양항', facilityType: '외곽시설', name: '광양항 방파제' },
  { id: 'f15', agency: '인천항만공사', port: '인천항', subPort: '신항', facilityType: '교통시설', name: '신항 도로교' },
];

const FACILITY_LOCATION_COORD_STORAGE_KEY = 'poms_facility_location_coords_v2';

const FACILITY_LOCATION_COORD_DEFAULTS = {
  p1: [
    { id: 'c-p1-1', subPort: '북항', coord: '35.1042, 129.0378', remark: '' },
  ],
  sp1: [
    { id: 'c-sp1-1', subPort: '북항', coord: '35.1045, 129.0721', remark: '' },
  ],
  f1: [
    { id: 'c-f1-1', subPort: '북항', coord: '35.1038, 129.0710', remark: '' },
  ],
  s1: [
    { id: 'c-s1-1', subPort: '신항', coord: '35.0512, 129.1284', remark: '' },
  ],
};

const FacilityLocationCoords = (() => {
  let store = {};

  function load() {
    try {
      const raw = sessionStorage.getItem(FACILITY_LOCATION_COORD_STORAGE_KEY);
      if (raw) {
        store = JSON.parse(raw);
        return;
      }
    } catch (_) { /* ignore */ }
    store = JSON.parse(JSON.stringify(FACILITY_LOCATION_COORD_DEFAULTS));
    save();
  }

  function save() {
    sessionStorage.setItem(FACILITY_LOCATION_COORD_STORAGE_KEY, JSON.stringify(store));
  }

  function getByParentId(parentId) {
    return (store[parentId] || []).map((item) => ({ ...item }));
  }

  function add(parentId, data) {
    if (!store[parentId]) store[parentId] = [];
    const item = {
      id: `c-${Date.now()}`,
      subPort: data.subPort || '',
      path: Array.isArray(data.path) ? data.path : [],
      coord: data.coord || (Array.isArray(data.path)
        ? data.path.map((point) => `${Number(point[0]).toFixed(6)}, ${Number(point[1]).toFixed(6)}`).join(' | ')
        : ''),
      remark: data.remark || '',
    };
    store[parentId].push(item);
    save();
    return item;
  }

  function remove(parentId, coordId) {
    if (!store[parentId]) return;
    store[parentId] = store[parentId].filter((item) => item.id !== coordId);
    save();
  }

  load();

  return { getByParentId, add, remove };
})();

const FACILITY_LOCATION_SECURITY_ROWS = [
  { id: 's1', port: '부산항', subPort: '신항', zoneName: '신항 보안구역 A', manageCategory: '국가계획항' },
  { id: 's2', port: '부산항', subPort: '북항', zoneName: '북항 보안구역 B', manageCategory: '국가계획항' },
  { id: 's3', port: '부산항', subPort: '남항', zoneName: '남항 보안구역', manageCategory: '국가계획항' },
  { id: 's4', port: '부산항', subPort: '감천항', zoneName: '감천항 보안구역', manageCategory: '국가계획항' },
  { id: 's5', port: '인천항', subPort: '신항', zoneName: '신항 보안구역', manageCategory: '국가계획항' },
  { id: 's6', port: '인천항', subPort: '연안부두', zoneName: '연안부두 보안구역', manageCategory: '국가계획항' },
  { id: 's7', port: '광양항', subPort: '광양항', zoneName: '광양항 보안구역', manageCategory: '국가계획항' },
  { id: 's8', port: '여수항', subPort: '여천항', zoneName: '여천항 보안구역', manageCategory: '국가계획항' },
  { id: 's9', port: '울산항', subPort: '울산항', zoneName: '울산항 보안구역', manageCategory: '지방계획항' },
  { id: 's10', port: '목포항', subPort: '목포항', zoneName: '목포항 보안구역', manageCategory: '지방계획항' },
  { id: 's11', port: '포항항', subPort: '포항항', zoneName: '포항항 보안구역', manageCategory: '지방계획항' },
  { id: 's12', port: '군산항', subPort: '군산항', zoneName: '군산항 보안구역', manageCategory: '지방계획항' },
  { id: 's13', port: '평택항', subPort: '평택항', zoneName: '평택항 보안구역', manageCategory: '지방계획항' },
  { id: 's14', port: '제주항', subPort: '제주항', zoneName: '제주항 보안구역', manageCategory: '지방계획항' },
  { id: 's15', port: '동해항', subPort: '동해항', zoneName: '동해항 보안구역', manageCategory: '지방계획항' },
];
