/** 메인 — 동영상 교육자료 샘플 데이터 (index.html #heroGuideBtn 팝업) */

/** 샘플 영상 — 드론 영상 팝업(drone-video-player.js)과 동일한 Mixkit 무료 스톡 영상. 실제 서비스 시 각 항목 src를 교체 */
const EDUCATION_VIDEO_SAMPLE_URL = 'https://assets.mixkit.co/videos/30125/30125-720.mp4';

const EDUCATION_VIDEO_ROWS = [
  {
    id: 'e1',
    title: 'POMS 시스템 소개 및 로그인 안내',
    desc: '항만시설물 유지관리시스템(POMS)의 목적과 주요 메뉴 구성, 로그인·권한 신청 절차를 안내합니다.',
    duration: '05:20',
    registeredAt: '2026-03-02',
    src: EDUCATION_VIDEO_SAMPLE_URL,
  },
  {
    id: 'e2',
    title: '시설물 통합검색 · 상세정보 조회 방법',
    desc: '관리기관/항/세부항 조건으로 시설물을 검색하고, 상세 탭(일반정보·안전점검실적 등)을 확인하는 방법입니다.',
    duration: '08:45',
    registeredAt: '2026-03-02',
    src: EDUCATION_VIDEO_SAMPLE_URL,
  },
  {
    id: 'e3',
    title: '안전점검 결과 등록 및 보고서 제출',
    desc: '점검기관 담당자가 점검 결과를 등록하고 보고서를 제출·수정하는 전체 흐름을 설명합니다.',
    duration: '12:10',
    registeredAt: '2026-03-15',
    src: EDUCATION_VIDEO_SAMPLE_URL,
  },
  {
    id: 'e4',
    title: '보수보강 실적 등록 방법',
    desc: '보수보강 공사 실적을 등록하고 첨부파일(도면·사진)을 업로드하는 방법입니다.',
    duration: '06:30',
    registeredAt: '2026-04-01',
    src: EDUCATION_VIDEO_SAMPLE_URL,
  },
  {
    id: 'e5',
    title: '모바일 앱 "항만시설 지킴이" 사용법',
    desc: '현장에서 모바일 앱으로 시설물을 조회하고 점검 사진을 등록하는 방법을 안내합니다.',
    duration: '07:15',
    registeredAt: '2026-04-20',
    src: EDUCATION_VIDEO_SAMPLE_URL,
  },
  {
    id: 'e6',
    title: '대가산정 기능 활용 가이드',
    desc: '기본대가·직접경비·추가조사비 입력과 대가산출서 출력 방법을 설명합니다.',
    duration: '09:40',
    registeredAt: '2026-05-11',
    src: EDUCATION_VIDEO_SAMPLE_URL,
  },
];
