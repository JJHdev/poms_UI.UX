/**
 * 지도: 홈 인라인 · 크게보기(전체화면) · 시설물 상세(지도로 보기) 공통
 * 목록 선택 → 지도 마커 + 이동 →「상세 보기」로 상세 페이지 이동
 */
(function () {
  /* 홈 대시보드 검색결과 — Figma 224:4988 순서·문구 */
  const SAMPLE_FACILITIES = [
    {
      id: 'F-10231',
      name: '남방파제',
      lat: 35.0942,
      lng: 129.0378,
      type: '2',
      typeLabel: '2종',
      port: 'busan-n',
      portLabel: '부산항 북항',
      grade: 'C',
      gradeLabel: 'C등급',
      kindLabel: '외곽시설',
    },
    {
      id: 'F-10402',
      name: '컨테이너부두 3선',
      lat: 35.1045,
      lng: 129.0721,
      type: '1',
      typeLabel: '1종',
      port: 'busan-n',
      portLabel: '부산항 북항',
      grade: 'C',
      gradeLabel: 'C등급',
      kindLabel: '계선시설',
    },
    {
      id: 'F-22011',
      name: '신항 서컨테이너 7부두',
      lat: 35.0512,
      lng: 129.1284,
      type: '1',
      typeLabel: '1종',
      port: 'busan-s',
      portLabel: '부산항 신항',
      grade: 'B',
      gradeLabel: 'B등급',
      kindLabel: '계선시설',
    },
    {
      id: 'F-10403',
      name: '북항 컨테이너부두 3선',
      lat: 35.1062,
      lng: 129.0688,
      type: '1',
      typeLabel: '1종',
      port: 'busan-n',
      portLabel: '부산항 북항',
      grade: 'B',
      gradeLabel: 'B등급',
      kindLabel: '계선시설',
    },
    {
      id: 'F-30876',
      name: '을숙도 잔교',
      lat: 35.1178,
      lng: 129.0216,
      type: '3',
      typeLabel: '3종',
      port: 'busan-n',
      portLabel: '부산항 북항',
      grade: 'A',
      gradeLabel: 'A등급',
      kindLabel: '교량',
    },
    {
      id: 'F-41005',
      name: '인천항 연안여객선터미널',
      lat: 37.4512,
      lng: 126.5928,
      type: '2',
      typeLabel: '2종',
      port: 'incheon',
      portLabel: '인천항',
      grade: 'B',
      gradeLabel: 'B등급',
      kindLabel: '여객시설',
    },
    {
      id: 'F-51288',
      name: '울산항 원유부두',
      lat: 35.4982,
      lng: 129.3865,
      type: '1',
      typeLabel: '1종',
      port: 'ulsan',
      portLabel: '울산항',
      grade: 'B',
      gradeLabel: 'B등급',
      kindLabel: '계선시설',
    },
    {
      id: 'F-62301',
      name: '부산항 북항 방조제',
      lat: 35.0989,
      lng: 129.0455,
      type: 'etc',
      typeLabel: '기타',
      port: 'busan-n',
      portLabel: '부산항 북항',
      grade: 'D',
      gradeLabel: 'D등급',
      kindLabel: '외곽시설',
    },
    {
      id: 'F-10299',
      name: '가덕도 연륙교 접속로',
      lat: 35.0468,
      lng: 129.1342,
      type: '2',
      typeLabel: '2종',
      port: 'busan-s',
      portLabel: '부산항 신항',
      grade: 'C',
      gradeLabel: 'C등급',
      kindLabel: '교량',
    },
  ];

  const GRADE_MARK_COLORS = {
    A: '#22c55e',
    B: '#3b82f6',
    C: '#eab308',
    D: '#ef4444',
    E: '#7c3aed',
  };

  /* Mixkit — Aerial view of the container port in Busan (free stock) */
  const DRONE_SAMPLE_VIDEO =
    'https://assets.mixkit.co/videos/30125/30125-720.mp4';

  const DRONE_VIDEO_SITES = [
    {
      id: 'drone-incheon', name: '인천항', lat: 37.4512, lng: 126.5928, videoUrl: DRONE_SAMPLE_VIDEO,
      videos: [
        { year: 2025, writer: '김관리', registeredAt: '2025-03-12' },
        { year: 2024, writer: '이담당', registeredAt: '2024-05-10' },
        { year: 2023, writer: '박주무', registeredAt: '2023-10-15' },
      ],
    },
    {
      id: 'drone-busan', name: '부산항', lat: 35.101, lng: 129.045, videoUrl: DRONE_SAMPLE_VIDEO,
      videos: [
        { year: 2025, writer: '최관리', registeredAt: '2025-02-20' },
        { year: 2024, writer: '정담당', registeredAt: '2024-06-12' },
        { year: 2023, writer: '한주무', registeredAt: '2023-11-08' },
      ],
    },
    {
      id: 'drone-ulsan', name: '울산항', lat: 35.4982, lng: 129.3865, videoUrl: DRONE_SAMPLE_VIDEO,
      videos: [
        { year: 2025, writer: '오관리', registeredAt: '2025-01-18' },
        { year: 2024, writer: '윤담당', registeredAt: '2024-04-22' },
        { year: 2023, writer: '강주무', registeredAt: '2023-09-05' },
      ],
    },
    {
      id: 'drone-pohang', name: '포항항', lat: 36.032, lng: 129.365, videoUrl: DRONE_SAMPLE_VIDEO,
      videos: [
        { year: 2025, writer: '서관리', registeredAt: '2025-04-02' },
        { year: 2024, writer: '남담당', registeredAt: '2024-07-01' },
        { year: 2023, writer: '임주무', registeredAt: '2023-12-20' },
      ],
    },
    {
      id: 'drone-yeosu', name: '여수항', lat: 34.74, lng: 127.74, videoUrl: DRONE_SAMPLE_VIDEO,
      videos: [
        { year: 2025, writer: '조관리', registeredAt: '2025-03-28' },
        { year: 2024, writer: '배담당', registeredAt: '2024-03-18' },
        { year: 2023, writer: '유주무', registeredAt: '2023-08-14' },
      ],
    },
    {
      id: 'drone-mokpo', name: '목포항', lat: 34.78, lng: 126.38, videoUrl: DRONE_SAMPLE_VIDEO,
      videos: [
        { year: 2025, writer: '문관리', registeredAt: '2025-05-09' },
        { year: 2024, writer: '신담당', registeredAt: '2024-08-03' },
        { year: 2023, writer: '송주무', registeredAt: '2023-07-21' },
      ],
    },
    {
      id: 'drone-sokcho', name: '속초항', lat: 38.21, lng: 128.59, videoUrl: DRONE_SAMPLE_VIDEO,
      videos: [
        { year: 2025, writer: '황관리', registeredAt: '2025-02-11' },
        { year: 2024, writer: '안담당', registeredAt: '2024-09-17' },
        { year: 2023, writer: '전주무', registeredAt: '2023-06-30' },
      ],
    },
    {
      id: 'drone-ulleung', name: '울릉항', lat: 37.484, lng: 130.872, videoUrl: DRONE_SAMPLE_VIDEO,
      videos: [
        { year: 2025, writer: '고관리', registeredAt: '2025-04-25' },
        { year: 2024, writer: '문담당', registeredAt: '2024-05-28' },
        { year: 2023, writer: '양주무', registeredAt: '2023-10-02' },
      ],
    },
    {
      id: 'drone-pyongtaek', name: '평택항', lat: 36.966, lng: 126.824, videoUrl: DRONE_SAMPLE_VIDEO,
      videos: [
        { year: 2025, writer: '노관리', registeredAt: '2025-01-30' },
        { year: 2024, writer: '하담당', registeredAt: '2024-02-28' },
        { year: 2023, writer: '곽주무', registeredAt: '2023-11-19' },
      ],
    },
    {
      id: 'drone-gunsan', name: '군산항', lat: 35.968, lng: 126.563, videoUrl: DRONE_SAMPLE_VIDEO,
      videos: [
        { year: 2025, writer: '성관리', registeredAt: '2025-06-05' },
        { year: 2024, writer: '차담당', registeredAt: '2024-10-08' },
        { year: 2023, writer: '주주무', registeredAt: '2023-09-26' },
      ],
    },
  ];

  const DRONE_VIDEO_YEARS = [2025, 2024, 2023];

  let droneVideoModalEl = null;
  let droneVideoPlayer = null;
  let droneVideoTitleEl = null;
  let droneVideoYearSelect = null;
  let droneVideoWriterEl = null;
  let droneVideoDateEl = null;
  let droneVideoCurrentSite = null;
  let droneVideoLastFocus = /** @type {HTMLElement | null} */ (null);

  function getSiteVideos(site) {
    if (Array.isArray(site?.videos) && site.videos.length) {
      return site.videos
        .map((entry) => ({
          year: Number(entry.year),
          writer: entry.writer || '-',
          registeredAt: entry.registeredAt || '-',
          url: entry.url || site.videoUrl || DRONE_SAMPLE_VIDEO,
        }))
        .filter((entry) => entry.year)
        .sort((a, b) => b.year - a.year);
    }
    const years = site?.years || DRONE_VIDEO_YEARS;
    return years.map((year) => ({
      year: Number(year),
      writer: site?.writer || '관리자',
      registeredAt: site?.registeredAt || `${year}-01-01`,
      url: site?.videoUrl || DRONE_SAMPLE_VIDEO,
    }));
  }

  function updateDroneVideoMeta(video) {
    if (droneVideoWriterEl) droneVideoWriterEl.textContent = video?.writer || '-';
    if (droneVideoDateEl) droneVideoDateEl.textContent = video?.registeredAt || '-';
  }

  function ensureDroneVideoModal() {
    if (droneVideoModalEl) return;

    droneVideoModalEl = document.createElement('div');
    droneVideoModalEl.id = 'drone-video-modal';
    droneVideoModalEl.className = 'drone-video-modal';
    droneVideoModalEl.setAttribute('role', 'dialog');
    droneVideoModalEl.setAttribute('aria-modal', 'true');
    droneVideoModalEl.setAttribute('aria-hidden', 'true');
    droneVideoModalEl.setAttribute('aria-labelledby', 'drone-video-modal-title');
    droneVideoModalEl.innerHTML = `
      <div class="drone-video-modal__backdrop" data-close-drone-video tabindex="-1" aria-hidden="true"></div>
      <div class="drone-video-modal__panel">
        <header class="drone-video-modal__head">
          <div class="drone-video-modal__head-main">
            <h2 id="drone-video-modal-title" class="drone-video-modal__title">드론 영상</h2>
          </div>
          <button type="button" class="drone-video-modal__close" data-close-drone-video aria-label="드론 영상 닫기">
            <img src="assets/main/dashboard/map/Component%201-1.svg" alt="" width="16" height="16">
          </button>
        </header>
        <div class="drone-video-modal__stack">
          <div class="drone-video-modal__years">
            <div class="drone-video-modal__meta-item">
              <label for="drone-video-year-select">촬영연도</label>
              <select id="drone-video-year-select" aria-label="촬영연도 선택"></select>
            </div>
            <div class="drone-video-modal__meta-item">
              <span class="drone-video-modal__meta-label">작성자</span>
              <span class="drone-video-modal__meta-value" id="drone-video-writer">-</span>
            </div>
            <div class="drone-video-modal__meta-item">
              <span class="drone-video-modal__meta-label">등록날짜</span>
              <span class="drone-video-modal__meta-value" id="drone-video-date">-</span>
            </div>
          </div>
          <div class="drone-video-modal__body">
            <video id="drone-video-player" class="drone-video-modal__video" controls playsinline preload="metadata">
              브라우저가 동영상 재생을 지원하지 않습니다.
            </video>
          </div>
        </div>
      </div>`;
    document.body.appendChild(droneVideoModalEl);

    droneVideoPlayer = /** @type {HTMLVideoElement | null} */ (
      droneVideoModalEl.querySelector('#drone-video-player')
    );
    droneVideoTitleEl = droneVideoModalEl.querySelector('#drone-video-modal-title');
    droneVideoYearSelect = droneVideoModalEl.querySelector('#drone-video-year-select');
    droneVideoWriterEl = droneVideoModalEl.querySelector('#drone-video-writer');
    droneVideoDateEl = droneVideoModalEl.querySelector('#drone-video-date');

    droneVideoYearSelect?.addEventListener('change', () => {
      if (!droneVideoPlayer || !droneVideoCurrentSite) return;
      const videos = getSiteVideos(droneVideoCurrentSite);
      const selected = videos.find((entry) => String(entry.year) === droneVideoYearSelect.value) || videos[0];
      updateDroneVideoMeta(selected);
      droneVideoPlayer.src = selected?.url || droneVideoCurrentSite.videoUrl || DRONE_SAMPLE_VIDEO;
      droneVideoPlayer.load();
      droneVideoPlayer.play().catch(() => {});
    });

    droneVideoModalEl.querySelectorAll('[data-close-drone-video]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        closeDroneVideoModal();
      });
    });
  }

  function openDroneVideoModal(site) {
    ensureDroneVideoModal();
    if (!droneVideoModalEl || !droneVideoPlayer) return;

    droneVideoLastFocus = /** @type {HTMLElement | null} */ (document.activeElement);
    droneVideoCurrentSite = site;
    if (droneVideoTitleEl) droneVideoTitleEl.textContent = `${site.name} 드론 영상`;

    const videos = getSiteVideos(site);
    const start = videos[0];

    if (droneVideoYearSelect) {
      droneVideoYearSelect.innerHTML = videos
        .map((entry, i) => `<option value="${entry.year}"${i === 0 ? ' selected' : ''}>${entry.year}년</option>`)
        .join('');
    }
    updateDroneVideoMeta(start);

    droneVideoPlayer.src = start?.url || site.videoUrl || DRONE_SAMPLE_VIDEO;
    droneVideoPlayer.load();

    droneVideoModalEl.classList.add('is-open');
    droneVideoModalEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drone-video-modal-open');

    window.setTimeout(() => {
      droneVideoPlayer?.play().catch(() => {});
      droneVideoModalEl?.querySelector('.drone-video-modal__close')?.focus({ preventScroll: true });
    }, 60);
  }

  function closeDroneVideoModal() {
    if (!droneVideoModalEl) return;

    droneVideoPlayer?.pause();
    if (droneVideoPlayer) {
      droneVideoPlayer.removeAttribute('src');
      droneVideoPlayer.load();
    }

    droneVideoModalEl.classList.remove('is-open');
    droneVideoModalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drone-video-modal-open');

    const prev = droneVideoLastFocus;
    droneVideoLastFocus = null;
    prev?.focus({ preventScroll: true });
  }

  function isDroneVideoModalOpen() {
    return droneVideoModalEl?.classList.contains('is-open') ?? false;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function createDroneMarkerIcon(name) {
    return L.divIcon({
      className: 'map-drone-marker-wrap',
      html: `<div class="map-drone-marker">
        <span class="map-drone-marker__dot" aria-hidden="true"></span>
        <span class="map-drone-marker__name">${escapeHtml(name)}</span>
      </div>`,
      iconSize: [0, 0],
      iconAnchor: [7, 7],
    });
  }

  function norm(s) {
    return String(s || '')
      .trim()
      .toLowerCase();
  }

  function filterFacilities(typeVal, portVal, query) {
    const q = norm(query);
    return SAMPLE_FACILITIES.filter((row) => {
      if (typeVal && row.type !== typeVal) return false;
      if (portVal && row.port !== portVal) return false;
      if (!q) return true;
      return (
        norm(row.name).includes(q) ||
        norm(row.id).includes(q) ||
        norm(row.portLabel).includes(q)
      );
    });
  }

  function parseBboxFromEmbedUrl(src) {
    if (!src) return null;
    try {
      const url = new URL(src, window.location.href);
      const raw = url.searchParams.get('bbox');
      if (!raw) return null;
      const [w, s, e, n] = raw.split(/%2C|,/).map((x) => Number(decodeURIComponent(x)));
      if ([w, s, e, n].some((x) => Number.isNaN(x))) return null;
      return { west: w, south: s, east: e, north: n };
    } catch {
      return null;
    }
  }

  function facilityById(id) {
    return SAMPLE_FACILITIES.find((r) => r.id === id) ?? null;
  }

  function gradeModifier(g) {
    const key = String(g || '').toUpperCase();
    if (key === 'A') return 'a';
    if (key === 'B') return 'b';
    if (key === 'C') return 'c';
    if (key === 'D') return 'd';
    if (key === 'E') return 'e';
    return 'b';
  }

  function gradeMarkerColor(grade) {
    const g = String(grade || 'B').toUpperCase();
    return GRADE_MARK_COLORS[g] || GRADE_MARK_COLORS.B;
  }

  /**
   * @param {{
   *   mapRoot: HTMLElement,
   *   form: HTMLFormElement | null,
   *   filterType: HTMLSelectElement | null,
   *   filterPort: HTMLSelectElement | null,
   *   searchInput: HTMLInputElement | null,
   *   resultList: HTMLUListElement,
   *   resultCount: HTMLElement | null,
   *   resultEmpty: HTMLElement | null,
   *   detailBtn: HTMLButtonElement | null,
   *   embedSrc: string,
   *   onSameFacilityDetail?: () => void,
   * }} config
   */
  function createMapPanel(config) {
    const {
      mapRoot,
      form,
      filterType,
      filterPort,
      searchInput,
      resultList,
      resultCount,
      resultEmpty,
      detailBtn,
      embedSrc,
      onSameFacilityDetail,
    } = config;

    let mapInstance = null;
    let selectionMarker = null;
    let selectedFacilityId = /** @type {string | null} */ (null);
    let droneLayer = null;
    let droneVisible = false;
    let mapToolsMounted = false;
    let activeMapTool = /** @type {string | null} */ (null);

    const mapFrame = mapRoot.parentElement;

    const MAP_TOOL_BUTTONS = [
      {
        id: 'move',
        label: '이동',
        icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
          <path d="m8 8-2-2M16 8l2-2M8 16l-2 2M16 16l2 2"/>
        </svg>`,
      },
      {
        id: 'distance',
        label: '거리',
        icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <path d="M3 21l8-8"/>
          <path d="M14 3l7 7"/>
          <path d="M3 21h5"/>
          <path d="M14 3v5"/>
          <path d="M16 16h5v5"/>
        </svg>`,
      },
      {
        id: 'area',
        label: '면적',
        icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="1"/>
          <circle cx="5" cy="5" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="19" cy="5" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="19" cy="19" r="1.5" fill="currentColor" stroke="none"/>
        </svg>`,
      },
      {
        id: 'satellite',
        label: '위성',
        icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <path d="M4 4l4 10 10 4-4-10L4 4z"/>
          <path d="M14 14l6 6"/>
          <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none"/>
        </svg>`,
      },
      {
        id: 'drone',
        label: '드론영상',
        icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"/>
          <circle cx="12" cy="11" r="2.25" fill="currentColor" stroke="none"/>
        </svg>`,
      },
    ];

    function mountMapTools() {
      if (mapToolsMounted || !mapFrame) return;
      /* 홈 대시보드: Figma 흰 툴바(.dash-map-tools)가 이미 있음 — 회색 레거시 툴바 중복 방지 */
      if (mapFrame.querySelector('.dash-map-tools')) {
        mapToolsMounted = true;
        return;
      }
      mapToolsMounted = true;

      const controls = document.createElement('div');
      controls.className = 'map-map-tools';
      controls.innerHTML = MAP_TOOL_BUTTONS.map(
        (tool) =>
          `<div class="map-map-tools__row" data-tool="${tool.id}">
            <span class="map-map-tools__label">${tool.label}</span>
            <button type="button" class="map-map-tools__btn" data-tool-btn="${tool.id}" title="${tool.label}" aria-label="${tool.label}" aria-pressed="false">
              ${tool.icon}
            </button>
          </div>`
      ).join('');
      mapFrame.appendChild(controls);

      controls.querySelectorAll('[data-tool-btn]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const toolId = btn.getAttribute('data-tool-btn');
          if (!toolId) return;
          setActiveMapTool(activeMapTool === toolId ? null : toolId);
        });
      });
    }

    function setActiveMapTool(toolId) {
      activeMapTool = toolId;

      mapFrame?.querySelectorAll('.map-map-tools__row').forEach((row) => {
        const id = row.getAttribute('data-tool');
        const isActive = id === activeMapTool;
        row.classList.toggle('is-active', isActive);
        row.querySelector('[data-tool-btn]')?.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      mapFrame?.querySelectorAll('.dash-map-tools [data-map-tool]').forEach((btn) => {
        const id = btn.getAttribute('data-map-tool');
        const isActive = id === activeMapTool;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      const showDrone = activeMapTool === 'drone';
      if (showDrone !== droneVisible) {
        droneVisible = showDrone;
        updateDroneLayer();
        if (showDrone) fitDroneBounds();
      }
    }

    function toggleMapTool(toolId) {
      if (!toolId) return;
      setActiveMapTool(activeMapTool === toolId ? null : toolId);
    }

    function updateDroneLayer() {
      ensureMapInitialized();
      if (!mapInstance) return;

      if (!droneLayer) {
        droneLayer = L.layerGroup();
      }
      droneLayer.clearLayers();

      if (!droneVisible) {
        mapInstance.removeLayer(droneLayer);
        return;
      }

      DRONE_VIDEO_SITES.forEach((site) => {
        const marker = L.marker([site.lat, site.lng], {
          icon: createDroneMarkerIcon(site.name),
        });
        marker.on('click', () => {
          openDroneVideoModal(site);
        });
        droneLayer.addLayer(marker);
      });

      droneLayer.addTo(mapInstance);
    }

    function fitDroneBounds() {
      ensureMapInitialized();
      if (!mapInstance || !droneLayer) return;
      const layers = droneLayer.getLayers();
      if (!layers.length) return;
      const bounds = L.featureGroup(layers).getBounds();
      if (bounds.isValid()) {
        mapInstance.fitBounds(bounds.pad(0.12), { maxZoom: 8 });
      }
    }

    function clearMapSelection() {
      selectedFacilityId = null;
      if (selectionMarker && mapInstance) {
        mapInstance.removeLayer(selectionMarker);
        selectionMarker = null;
      }
      resultList.querySelectorAll('.map-result-list__link').forEach((el) => {
        el.classList.remove('is-selected');
        el.removeAttribute('aria-current');
      });
      if (detailBtn) {
        detailBtn.disabled = true;
        detailBtn.setAttribute('aria-disabled', 'true');
      }
    }

    function ensureMapInitialized() {
      if (mapInstance) {
        mapInstance.invalidateSize();
        return;
      }
      mountMapTools();
      const b = parseBboxFromEmbedUrl(embedSrc);
      const hasDashTools = Boolean(mapFrame?.querySelector('.dash-map-tools'));
      mapInstance = L.map(mapRoot, {
        zoomControl: false,
        scrollWheelZoom: true,
      });
      /* 홈은 Figma +/- 버튼 사용 — Leaflet 기본 줌 컨트롤 숨김 */
      if (!hasDashTools) {
        L.control.zoom({ position: 'topright' }).addTo(mapInstance);
      }
      L.tileLayer('https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noreferrer">OpenStreetMap</a>',
      }).addTo(mapInstance);

      if (b) {
        mapInstance.fitBounds(
          [
            [b.south, b.west],
            [b.north, b.east],
          ],
          { padding: [24, 24], maxZoom: 14 }
        );
      } else {
        mapInstance.setView([35.108, 129.041], 12);
      }
      mapInstance.invalidateSize();
    }

    function selectFacilityOnMap(row) {
      ensureMapInitialized();

      clearMapSelection();
      selectedFacilityId = row.id;

      const btn = resultList.querySelector(`button.map-result-list__link[data-facility-id="${row.id}"]`);
      if (btn) {
        btn.classList.add('is-selected');
        btn.setAttribute('aria-current', 'true');
      }

      if (detailBtn) {
        detailBtn.disabled = false;
        detailBtn.removeAttribute('aria-disabled');
      }

      if (!mapInstance) return;

      selectionMarker = L.circleMarker([row.lat, row.lng], {
        radius: 10,
        stroke: true,
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillColor: gradeMarkerColor(row.grade),
        fillOpacity: 0.95,
      }).addTo(mapInstance);

      const targetZoom = Math.max(mapInstance.getZoom(), 15);
      mapInstance.flyTo([row.lat, row.lng], targetZoom, { duration: 0.55 });
    }

    function updateCardsScrollbar() {
      if (!resultList.classList.contains('dash-map-cards')) return;
      const track = document.querySelector('.dash-map-results__scroll');
      const thumb = document.querySelector('.dash-map-results__scroll-thumb');
      if (!track || !thumb) return;

      const maxScroll = resultList.scrollWidth - resultList.clientWidth;
      if (maxScroll <= 0) {
        thumb.style.width = '100%';
        thumb.style.left = '0';
        track.hidden = false;
        return;
      }

      const ratio = resultList.clientWidth / resultList.scrollWidth;
      const thumbW = Math.max(40, track.clientWidth * ratio);
      const maxLeft = track.clientWidth - thumbW;
      const left = (resultList.scrollLeft / maxScroll) * maxLeft;
      thumb.style.width = `${thumbW}px`;
      thumb.style.left = `${left}px`;
      track.hidden = false;
    }

    function bindCardsScrollbar() {
      if (!resultList.classList.contains('dash-map-cards')) return;
      const track = document.querySelector('.dash-map-results__scroll');
      if (!track || track.dataset.bound) return;
      track.dataset.bound = '1';

      resultList.addEventListener('scroll', updateCardsScrollbar, { passive: true });

      track.addEventListener('click', (e) => {
        const rect = track.getBoundingClientRect();
        const maxScroll = resultList.scrollWidth - resultList.clientWidth;
        if (maxScroll <= 0) return;
        const x = e.clientX - rect.left;
        const ratio = x / rect.width;
        resultList.scrollLeft = ratio * maxScroll;
      });

      window.addEventListener('resize', updateCardsScrollbar);
    }

    function renderResults(rows) {
      const isDashCards = resultList.classList.contains('dash-map-cards');
      const displayRows = isDashCards ? rows.slice(0, 4) : rows;
      clearMapSelection();
      resultList.innerHTML = '';
      if (resultEmpty) resultEmpty.hidden = displayRows.length > 0;
      if (resultCount) {
        const format = resultCount.getAttribute('data-count-format');
        const count = isDashCards ? displayRows.length : rows.length;
        resultCount.textContent =
          format === 'number' ? String(count) : `${count}건`;
      }

      const useCards =
        resultList.classList.contains('dash-map-cards') ||
        resultList.classList.contains('map-modal__cards');
      const chevron = `<span class="map-result-list__chevron" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </span>`;

      displayRows.forEach((row) => {
        const gMod = gradeModifier(row.grade);
        const li = document.createElement('li');
        if (useCards) {
          li.className = 'dash-map-card map-result-list__item';
          li.innerHTML = `
            <button
              type="button"
              class="dash-map-card__btn map-result-list__link"
              data-facility-id="${row.id}"
              aria-label="${row.name}, 지도에서 위치 보기"
            >
              <div class="dash-map-card__top">
                <span class="dash-map-card__name">${row.name}</span>
                <span class="dash-map-card__id">${row.id}</span>
              </div>
              <div class="dash-map-card__bottom">
                <span class="dash-map-card__grade dash-map-card__grade--${gMod}">${row.gradeLabel}</span>
                <div class="dash-map-card__meta">
                  <span class="dash-map-card__kind">${row.kindLabel}</span>
                  <span class="dash-map-card__port">${row.portLabel}</span>
                </div>
              </div>
            </button>`;
        } else {
          li.className = 'map-result-list__item';
          li.innerHTML = `
            <button
              type="button"
              class="map-result-list__link"
              data-facility-id="${row.id}"
              aria-label="${row.name}, 지도에서 위치 보기"
            >
              <div class="map-result-list__main">
                <span class="map-result-list__name">${row.name}</span>
                <span class="map-result-list__meta">
                  <span class="map-result-list__grade map-result-list__grade--${gMod}">${row.gradeLabel}</span>
                  <span class="map-result-list__kind">${row.kindLabel}</span>
                  <span class="map-result-list__port">${row.portLabel}</span>
                </span>
                <span class="map-result-list__id">${row.id}</span>
              </div>
              ${chevron}
            </button>`;
        }
        resultList.appendChild(li);
      });

      bindCardsScrollbar();
      window.requestAnimationFrame(() => {
        updateCardsScrollbar();
        if (displayRows.length > 0) {
          selectFacilityOnMap(displayRows[0]);
        }
      });
    }

    function runSearch() {
      const typeVal = filterType?.value ?? '';
      const portVal = filterPort?.value ?? '';
      const q = searchInput?.value ?? '';
      const rows = filterFacilities(typeVal, portVal, q);
      renderResults(rows);
    }

    function resetFilters() {
      if (filterType) filterType.value = '';
      if (filterPort) filterPort.value = '';
      if (searchInput) searchInput.value = '';
    }

    function goToDetail(facilityId) {
      const id = facilityId || selectedFacilityId;
      if (!id) return;
      if (document.getElementById('viewOnMapBtn')) {
        const paramId = new URLSearchParams(window.location.search).get('id') || 'F-10231';
        if (id === paramId) {
          onSameFacilityDetail?.();
          return;
        }
      }
      window.location.href = `facility-detail.html?id=${encodeURIComponent(id)}`;
    }

    resultList.addEventListener('click', (e) => {
      const el = /** @type HTMLElement|null */ (e.target instanceof Element ? e.target.closest('button[data-facility-id]') : null);
      if (!el) return;
      const id = el.getAttribute('data-facility-id');
      if (!id) return;
      const row = facilityById(id);
      if (row) selectFacilityOnMap(row);
    });

    resultList.addEventListener('dblclick', (e) => {
      const el = /** @type HTMLElement|null */ (e.target instanceof Element ? e.target.closest('button[data-facility-id]') : null);
      if (!el) return;
      const id = el.getAttribute('data-facility-id');
      if (id) goToDetail(id);
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      runSearch();
    });

    filterType?.addEventListener('change', () => runSearch());
    filterPort?.addEventListener('change', () => runSearch());

    detailBtn?.addEventListener('click', () => {
      if (!selectedFacilityId) {
        const first = resultList.querySelector('button[data-facility-id]');
        const id = first?.getAttribute('data-facility-id');
        if (id) goToDetail(id);
        return;
      }
      goToDetail(selectedFacilityId);
    });

    return {
      runSearch,
      resetFilters,
      ensureMapInitialized,
      invalidateSize: () => mapInstance?.invalidateSize(),
      zoomIn: () => {
        ensureMapInitialized();
        mapInstance?.zoomIn();
      },
      zoomOut: () => {
        ensureMapInitialized();
        mapInstance?.zoomOut();
      },
      toggleMapTool,
      setActiveMapTool,
      getSelectedFacilityId: () => selectedFacilityId,
      selectFacilityById: (id) => {
        const row = facilityById(id);
        if (row) selectFacilityOnMap(row);
      },
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof L === 'undefined') return;

    const widget =
      document.querySelector('.home-widget--map[data-map-embed-src]') ||
      document.querySelector('.dash-map-hero[data-map-embed-src]') ||
      document.querySelector('.dash-map-block[data-map-embed-src]');
    const embedSrc =
      document.getElementById('facility-map-modal')?.getAttribute('data-map-embed-src') ||
      widget?.dataset.mapEmbedSrc ||
      '';

    const inlineMapRoot = document.getElementById('facility-map-leaflet-inline');
    const inlinePanel =
      inlineMapRoot && document.getElementById('dash-map-result-list')
        ? createMapPanel({
            mapRoot: inlineMapRoot,
            form: /** @type {HTMLFormElement|null} */ (document.getElementById('dash-map-form')),
            filterType: /** @type {HTMLSelectElement|null} */ (document.getElementById('dash-map-filter-type')),
            filterPort: /** @type {HTMLSelectElement|null} */ (document.getElementById('dash-map-filter-port')),
            searchInput: /** @type {HTMLInputElement|null} */ (document.getElementById('dash-map-search-input')),
            resultList: /** @type {HTMLUListElement} */ (document.getElementById('dash-map-result-list')),
            resultCount: document.getElementById('dash-map-result-count'),
            resultEmpty: document.getElementById('dash-map-result-empty'),
            detailBtn: /** @type {HTMLButtonElement|null} */ (document.getElementById('dash-map-detail-btn')),
            embedSrc,
          })
        : null;

    const modal = document.getElementById('facility-map-modal');
    const modalMapRoot = document.getElementById('facility-map-leaflet');
    let closeModalRef = () => {};

    const modalPanel =
      modal && modalMapRoot && document.getElementById('map-result-list')
        ? createMapPanel({
            mapRoot: modalMapRoot,
            form: /** @type {HTMLFormElement|null} */ (document.getElementById('facility-map-modal-form')),
            filterType: /** @type {HTMLSelectElement|null} */ (document.getElementById('map-filter-type')),
            filterPort: /** @type {HTMLSelectElement|null} */ (document.getElementById('map-filter-port')),
            searchInput: /** @type {HTMLInputElement|null} */ (document.getElementById('map-search-input')),
            resultList: /** @type {HTMLUListElement} */ (document.getElementById('map-result-list')),
            resultCount: document.getElementById('map-result-count'),
            resultEmpty: document.getElementById('map-result-empty'),
            detailBtn: /** @type {HTMLButtonElement|null} */ (document.getElementById('map-modal-detail-btn')),
            embedSrc,
            onSameFacilityDetail: () => {
              closeModalRef();
              document.querySelector('.facility-summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            },
          })
        : null;

    if (!inlinePanel && !modalPanel) return;

    const btnOpenModal = document.getElementById('facility-map-open-modal');
    const btnViewOnMap = document.getElementById('viewOnMapBtn');
    const btnClose =
      modal?.querySelector('.map-modal__detail-head [data-close-map-modal]') ||
      modal?.querySelector('.map-modal__side-close') ||
      modal?.querySelector('.map-modal__toolbar-btn--close');
    const filterType = document.getElementById('map-filter-type');
    const filterPort = document.getElementById('map-filter-port');
    const searchInput = document.getElementById('map-search-input');

    let lastFocus = null;
    let defaultTitle = '';
    let defaultSubtitle = '';

    const titleEl = document.getElementById('facility-map-modal-title');
    const subtitleEl = document.getElementById('facility-map-modal-subtitle');

    function cacheDefaultTitles() {
      if (titleEl && !defaultTitle) defaultTitle = titleEl.textContent.trim();
      if (subtitleEl && !defaultSubtitle) defaultSubtitle = subtitleEl.textContent.trim();
    }

    function buildDetailSubtitleHtml() {
      const parts = Array.from(document.querySelectorAll('.facility-summary__location'))
        .map((el) => el.textContent.trim())
        .filter(Boolean);
      if (!parts.length) return null;
      return parts
        .map((text, i) => {
          const sep =
            i > 0 ? '<span class="map-modal__detail-subtitle-sep" aria-hidden="true"></span>' : '';
          return `${sep}${escapeHtml(text)}`;
        })
        .join('');
    }

    function applyModalContext(context) {
      cacheDefaultTitles();
      if (context === 'detail') {
        const name = document.getElementById('facilityName')?.textContent?.trim();
        const subtitleHtml = buildDetailSubtitleHtml();
        if (titleEl) titleEl.textContent = name ? `${name} 위치` : defaultTitle;
        if (subtitleEl) {
          if (subtitleHtml) subtitleEl.innerHTML = subtitleHtml;
          else subtitleEl.textContent = defaultSubtitle;
        }
        if (searchInput && name) searchInput.value = name;
        if (filterType) filterType.value = '';
        if (filterPort) filterPort.value = '';
      } else {
        if (titleEl) titleEl.textContent = defaultTitle;
        if (subtitleEl) subtitleEl.textContent = defaultSubtitle;
        modalPanel?.resetFilters();
      }
    }

    function openModal(options = {}) {
      if (!modal || !modalPanel) return;
      const ctx = options.context === 'detail' ? 'detail' : 'home';
      const fullscreen = options.fullscreen === true;

      modal.classList.remove('map-modal--map-only', 'map-modal--fullscreen');
      if (fullscreen) {
        modal.classList.add('map-modal--fullscreen');
      }

      applyModalContext(ctx);
      lastFocus = /** @type {HTMLElement|null} */ (document.activeElement);
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('map-modal-open');
      modalPanel.runSearch();

      window.setTimeout(() => {
        modalPanel.ensureMapInitialized();
        modalPanel.invalidateSize();
        btnClose?.focus({ preventScroll: true });
      }, 80);
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('is-open', 'map-modal--map-only', 'map-modal--fullscreen');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('map-modal-open');
      const prev = lastFocus;
      lastFocus = null;
      prev?.focus({ preventScroll: true });
    }

    closeModalRef = closeModal;

    btnOpenModal?.addEventListener('click', () => openModal({ context: 'home', fullscreen: true }));
    btnViewOnMap?.addEventListener('click', () => openModal({ context: 'detail' }));

    modal?.querySelectorAll('[data-close-map-modal]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (isDroneVideoModalOpen()) {
        closeDroneVideoModal();
        return;
      }
      if (!modal?.classList.contains('is-open')) return;
      closeModal();
    });

    if (inlinePanel) {
      inlinePanel.runSearch();
      window.setTimeout(() => {
        inlinePanel.ensureMapInitialized();
        inlinePanel.invalidateSize();
      }, 120);

      document.querySelectorAll('.dash-map-hero .dash-map-tools [data-map-tool]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const tool = btn.getAttribute('data-map-tool');
          if (!tool) return;
          if (tool === 'zoom-in') {
            inlinePanel.zoomIn();
            return;
          }
          if (tool === 'zoom-out') {
            inlinePanel.zoomOut();
            return;
          }
          inlinePanel.toggleMapTool(tool);
        });
      });
    }

    if (modalPanel) {
      document.querySelectorAll('#facility-map-modal .dash-map-tools [data-map-tool]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const tool = btn.getAttribute('data-map-tool');
          if (!tool) return;
          if (tool === 'zoom-in') {
            modalPanel.zoomIn();
            return;
          }
          if (tool === 'zoom-out') {
            modalPanel.zoomOut();
            return;
          }
          modalPanel.toggleMapTool(tool);
        });
      });
    }
  });
})();
