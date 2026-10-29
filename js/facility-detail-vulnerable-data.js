/**
 * 취약시설물 중점관리 — 공용 데이터
 * facility-detail.html(목록)과 facility-vulnerable-detail.html(상세)에서 함께 참조한다.
 */
(function () {
  const VULNERABLE_RECORDS = [
    {
      id: 1,
      createdDate: '2025-03-12',
      author: '홍길동',
      actionPlanProgress:
        '보수보강 진행중 (2021.05.03 ~ 2024.12.31)\n총 중량 2.5톤 초과 차량에 대한 통행 제한 실시 중 - 낙포부두 2~5번선석 통행차량 제한 (2019.5.1 통행제한)',
      usageRestriction: '일부 사용제한',
      residentNotice: '위험표지, 방송 및 인터넷을 통한 주민공지',
      relatedInspection: '정밀안전점검 (2022-05-19 ~ 2022-10-30)',
      stages: [
        { stage: '보수보강 진행중', period: '2022-05.01 ~ 2023-04.01', plan: '정밀안전점검 실시 및 보수보강 계획 수립' },
      ],
    },
    {
      id: 2,
      createdDate: '2024-01-23',
      author: '홍길동',
      actionPlanProgress:
        '보수보강 진행중 (2021.05.03 ~ 2024.12.31)\n총 중량 2.5톤 초과 차량에 대한 통행 제한 실시 중 - 낙포부두 2~5번선석 통행차량 제한 (2019.5.1 통행제한)',
      usageRestriction: '일부 사용제한',
      residentNotice: '위험표지, 방송 및 인터넷을 통한 주민공지',
      relatedInspection: '정기안전점검(하반기) (2023-06-15)',
      stages: [
        { stage: '보수보강 진행중', period: '2022-05.01 ~ 2023-04.01', plan: '정밀안전점검 실시 및 보수보강 계획 수립' },
      ],
    },
    {
      id: 3,
      createdDate: '2023-06-30',
      author: '홍길동',
      actionPlanProgress:
        '보수보강 진행중 (2021.05.03 ~ 2024.12.31)\n총 중량 2.5톤 초과 차량에 대한 통행 제한 실시 중 - 낙포부두 2~5번선석 통행차량 제한 (2019.5.1 통행제한)',
      usageRestriction: '일부 사용제한',
      residentNotice: '위험표지, 방송 및 인터넷을 통한 주민공지',
      relatedInspection: '정밀안전진단 (2021-01-01 ~ 2021-08-20)',
      stages: [
        { stage: '보수보강 진행중', period: '2022-05.01 ~ 2023-04.01', plan: '정밀안전점검 실시 및 보수보강 계획 수립' },
      ],
    },
    {
      id: 4,
      createdDate: '2025-08-15',
      author: '김관리',
      actionPlanProgress: '사용제한 조치 유지 및 모니터링 강화\n통행차량 하중 제한 지속',
      usageRestriction: '일부 사용제한',
      residentNotice: '위험표지 설치',
      relatedInspection: '정기안전점검(상반기) (2025-02-10)',
      stages: [
        { stage: '모니터링', period: '2025-03.01 ~ 2025-12.31', plan: '주기적 변위·균열 계측' },
      ],
    },
    {
      id: 5,
      createdDate: '2025-05-20',
      author: '봉만식',
      actionPlanProgress: '보수보강 계획 수립 완료, 착수 예정',
      usageRestriction: '전면 사용제한',
      residentNotice: '방송 및 안내문 게시',
      relatedInspection: '정밀안전점검 (2024-09-01 ~ 2024-12-20)',
      stages: [
        { stage: '계획수립', period: '2025-01.01 ~ 2025-04.30', plan: '보수보강 설계 및 예산 확보' },
      ],
    },
    {
      id: 6,
      createdDate: '2024-11-08',
      author: '이담당',
      actionPlanProgress: '긴급보수 완료 후 중점관리 지속',
      usageRestriction: '일부 사용제한',
      residentNotice: '위험표지, 인터넷 공지',
      relatedInspection: '정기안전점검(하반기) (2024-09-15)',
      stages: [
        { stage: '보수완료', period: '2024-10.01 ~ 2024-11.15', plan: '긴급보수 후 경과 관찰' },
      ],
    },
    {
      id: 7,
      createdDate: '2024-07-22',
      author: '홍길동',
      actionPlanProgress: '기초부 세굴 구간 중점관리\n사석보충 공사 진행중',
      usageRestriction: '일부 사용제한',
      residentNotice: '위험표지',
      relatedInspection: '정밀안전진단 (2023-03-01 ~ 2023-08-30)',
      stages: [
        { stage: '보수보강 진행중', period: '2024-05.01 ~ 2024-12.31', plan: '사석보충 및 toe 보강' },
      ],
    },
    {
      id: 8,
      createdDate: '2024-04-10',
      author: '김관리',
      actionPlanProgress: '염해 손상 구간 중점관리',
      usageRestriction: '사용제한 없음',
      residentNotice: '안내문 게시',
      relatedInspection: '정기안전점검(상반기) (2024-01-20)',
      stages: [
        { stage: '모니터링', period: '2024-02.01 ~ 2024-12.31', plan: '염해 진행도 점검' },
      ],
    },
    {
      id: 9,
      createdDate: '2023-12-05',
      author: '봉만식',
      actionPlanProgress: '상부슬래브 균열 중점관리 및 보수계획 수립',
      usageRestriction: '일부 사용제한',
      residentNotice: '위험표지, 방송',
      relatedInspection: '정밀안전점검 (2023-05-10 ~ 2023-10-15)',
      stages: [
        { stage: '계획수립', period: '2023-11.01 ~ 2024-03.31', plan: '균열보수 설계' },
      ],
    },
    {
      id: 10,
      createdDate: '2023-09-18',
      author: '이담당',
      actionPlanProgress: '방호벽 손상 구간 통행제한 유지',
      usageRestriction: '일부 사용제한',
      residentNotice: '위험표지',
      relatedInspection: '정기안전점검(하반기) (2023-08-01)',
      stages: [
        { stage: '사용제한', period: '2023-08.15 ~ 2024-06.30', plan: '방호벽 보수 전까지 통행제한' },
      ],
    },
    {
      id: 11,
      createdDate: '2023-03-28',
      author: '홍길동',
      actionPlanProgress: '방식커버 열화 구간 중점관리',
      usageRestriction: '사용제한 없음',
      residentNotice: '인터넷 공지',
      relatedInspection: '정기안전점검(상반기) (2023-02-15)',
      stages: [
        { stage: '모니터링', period: '2023-03.01 ~ 2023-12.31', plan: '방식성능 점검' },
      ],
    },
    {
      id: 12,
      createdDate: '2022-10-14',
      author: '김관리',
      actionPlanProgress: '직립부 박리·박락 중점관리',
      usageRestriction: '일부 사용제한',
      residentNotice: '위험표지, 안내문',
      relatedInspection: '정밀안전점검 (2022-04-01 ~ 2022-09-30)',
      stages: [
        { stage: '보수보강 진행중', period: '2022-10.01 ~ 2023-06.30', plan: '표면보수 공사' },
      ],
    },
    {
      id: 13,
      createdDate: '2022-06-02',
      author: '봉만식',
      actionPlanProgress: '차막이·계선주 손상 중점관리',
      usageRestriction: '일부 사용제한',
      residentNotice: '방송 및 안내문',
      relatedInspection: '정기안전점검(하반기) (2022-05-20)',
      stages: [
        { stage: '계획수립', period: '2022-06.01 ~ 2022-09.30', plan: '시설물 교체 계획' },
      ],
    },
    {
      id: 14,
      createdDate: '2021-11-25',
      author: '이담당',
      actionPlanProgress: '기초부 침하 관측 및 중점관리',
      usageRestriction: '전면 사용제한',
      residentNotice: '위험표지, 방송, 인터넷 공지',
      relatedInspection: '정밀안전진단 (2021-01-01 ~ 2021-08-20)',
      stages: [
        { stage: '사용제한', period: '2021-09.01 ~ 2022-12.31', plan: '침하 안정화 확인 후 제한 해제 검토' },
      ],
    },
    {
      id: 15,
      createdDate: '2021-04-07',
      author: '홍길동',
      actionPlanProgress: '노후 조명·전기시설 중점관리',
      usageRestriction: '사용제한 없음',
      residentNotice: '안내문 게시',
      relatedInspection: '정기안전점검(상반기) (2021-02-28)',
      stages: [
        { stage: '모니터링', period: '2021-03.01 ~ 2021-12.31', plan: '전기안전점검 병행' },
      ],
    },
  ];

  const EMPTY_RECORD = {
    createdDate: '',
    author: '',
    actionPlanProgress: '',
    usageRestriction: '',
    residentNotice: '',
    relatedInspection: '',
    stages: [],
  };

  function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getAddDefaults() {
    return {
      ...EMPTY_RECORD,
      createdDate: getTodayDateString(),
      author: '홍길동',
    };
  }

  window.VulnerableData = {
    list: VULNERABLE_RECORDS,
    empty: EMPTY_RECORD,
    getById(id) {
      return VULNERABLE_RECORDS.find((row) => row.id === id);
    },
    remove(id) {
      const index = VULNERABLE_RECORDS.findIndex((row) => row.id === id);
      if (index >= 0) VULNERABLE_RECORDS.splice(index, 1);
      return index >= 0;
    },
    getAddDefaults,
  };
})();
