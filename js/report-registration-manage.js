/**
 * 보고서 등록관리 화면 스크립트
 */
(() => {
  const reports = [
    {
      seqNo: 1,
      manageId: 'BS',
      manageNm: '부산지방해양수산청',
      portNm: '부산항',
      subportNm: '감천항',
      fcltyNm: '감천항 방파제',
      asortNm: '기타',
      fcltyGbnNm: '외곽시설',
      serviceCompanyNm: '한국항만안전진단',
      userId: 'safe01',
      checkId: '202606001',
      chckGbn: '100',
      chckGbnNm: '정기안전점검',
      chckDe: '2026-06-11',
      status: '승인대기',
      writer: '김민재',
      comment: '상반기 정기안전점검 결과보고서가 제출되었습니다.',
      repairs: [
        {
          year: '2025',
          workName: '감천항 방파제 피복석 보강공사',
          part: '남측 방파제 사면',
          content: '유실 피복석 보충 및 세굴부 단면 보강',
          startDate: '2025-04-01',
          endDate: '2025-06-30',
          contractor: '부산해양건설',
        },
      ],
      approvals: [
        { type: '보고서 제출', requester: '김민재', company: '한국항만안전진단', requestDate: '2026-06-11 09:20', reviewer: '이서연', opinion: '보고서 제출 접수', status: '완료' },
        { type: '관리자 검토', requester: '김민재', company: '한국항만안전진단', requestDate: '2026-06-11 10:00', reviewer: '이서연', opinion: '검토 대기 중', status: '대기' },
      ],
      regular: {
        facility: {
          facilityType: '디버트 석재지제',
          manager: '부산지방해양수산청',
          office: '111',
          period: '222',
          completionDate: '2015-12-14',
          lastInspectionDate: '2026-06-17',
        },
        items: [
          ['상부공 및 덮개', '침하', '33', '미비'],
          ['상부공 및 덮개', '경사/전도', '44', '미비'],
          ['상부공 및 덮개', '활동', '55', '미비'],
          ['상부공 및 덮개', '파손', '66', '미비'],
          ['상부공 및 덮개', '균열', '77', '미비'],
          ['상부공 및 덮개', '박리', '88', '미비'],
          ['상부공 및 덮개', '마모/마식', '99', '미비'],
          ['상부공 및 덮개', '속채움재 유실', '00', '미비'],
          ['상부공 및 덮개', '블록 및 케이슨 이격', '11', '미비'],
          ['사석 경사면', '사면변형', '22', '미비'],
          ['사석 경사면', '피복석 유실', '33', '미비'],
          ['소파공', '콘크릿 유실', '4', '미비'],
          ['소파공', '파손', '55', '미비'],
          ['기초부', '세굴', '66', '미비'],
          ['기초부', '기초사석 고착', '77', '미비'],
          ['부대시설', '계단부', '88', '미비'],
          ['부대시설', '차막이', '99', '미비'],
          ['부대시설', '방충재', '00', '미비'],
          ['부대시설', '등대', '11', '미비'],
        ],
        summary: [
          ['가. 일반현황', '대상시설', '지제', '점검기간', '2026-06-03'],
          ['가. 일반현황', '용역명', '해당없음', '대표자', '해당없음'],
          ['가. 일반현황', '관리주체명', '11', '계약방법', '해당없음'],
          ['가. 일반현황', '공동수급', '해당없음', '계약형태', '해당없음'],
          ['가. 일반현황', '시설물 구분', '33', '용역명', '44'],
          ['가. 일반현황', '종별', '55', '준공일', '2026-06-19'],
          ['가. 일반현황', '점검금액(천원)', '123.00', '안전등급', '55'],
          ['가. 일반현황', '시설물 위치', '66', '시설물 규모', '77'],
        ],
        diagnostics: [
          ['나. 점검 실시결과 현황', '중대현 현황', '중대한 결함', '1'],
          ['나. 점검 실시결과 현황', '중대현 현황', '중공이용하는부위에 균열', '2'],
          ['나. 점검 실시결과 현황', '주요 점검 결과', '', '3'],
          ['나. 점검 실시결과 현황', '주요 보수·보강 계획', '', '4'],
        ],
        engineers: [
          ['5', '6', '7', '8'],
          ['9', '1', '2', '3'],
        ],
        notes: '123',
      },
    },
    {
      seqNo: 2,
      manageId: 'YS',
      manageNm: '여수지방해양수산청',
      portNm: '광양항',
      subportNm: '제품부두',
      fcltyNm: '제품부두 원유돌핀',
      asortNm: '기타',
      fcltyGbnNm: '계류시설',
      serviceCompanyNm: '대한시설안전연구원',
      userId: 'dfsafety03',
      checkId: '202606003',
      chckGbn: 'MNT',
      chckGbnNm: '보수정보',
      chckDe: '2026-06-07',
      status: '승인',
      writer: '이도윤',
      comment: '보수정보 등록 내용이 승인되었습니다.',
      repairs: [
        {
          year: '2026',
          workName: '원유돌핀 접안부 보수공사',
          part: '돌핀 상부 콘크리트',
          content: '균열 보수, 단면 복구, 표면 보호재 도포',
          startDate: '2026-02-01',
          endDate: '2026-04-20',
          contractor: '광양항만보수',
        },
      ],
      approvals: [
        { type: '보수정보 제출', requester: '이도윤', company: '대한시설안전연구원', requestDate: '2026-06-07 10:30', reviewer: '정하늘', opinion: '보수정보 등록 접수', status: '완료' },
        { type: '승인', requester: '이도윤', company: '대한시설안전연구원', requestDate: '2026-06-07 16:20', reviewer: '정하늘', opinion: '제출 내용 승인', status: '완료' },
      ],
      regular: null,
    },
    {
      seqNo: 3,
      manageId: 'BS',
      manageNm: '부산지방해양수산청',
      portNm: '부산항',
      subportNm: '신항',
      fcltyNm: '신항 방파제',
      asortNm: '1종',
      fcltyGbnNm: '외곽시설',
      serviceCompanyNm: '긴급안전기술',
      userId: 'urgent01',
      checkId: '202606004',
      chckGbn: '400',
      chckGbnNm: '긴급점검',
      chckDe: '2026-06-02',
      status: '승인대기',
      writer: '최지훈',
      comment: '긴급점검 결과가 제출되었습니다.',
      repairs: [],
      emergency: {
        year: '2026',
        type: '긴급점검',
        date: '2026-06-02',
        grade: 'A',
        period: '12',
        report: '●',
        score: '',
        agency: '',
        manager: '',
        appendices: ['', '', '', '', ''],
      },
      approvals: [
        { type: '긴급점검 제출', requester: '최지훈', company: '긴급안전기술', requestDate: '2026-06-02 13:10', reviewer: '관리자', opinion: '긴급점검 접수', status: '대기' },
      ],
    },
  ];

  let filtered = [...reports];
  let selected = null;
  const pagingState = { page: 1, pageSize: 10 };
  const approvalPagingState = { page: 1, pageSize: 5 };

  const $ = (id) => document.getElementById(id);
  const tbody = $('reportRegTableBody');
  const detailModal = $('reportRegDetailModal');
  const processModal = $('reportRegProcessModal');
  const repairFormModal = $('repairFormModal');

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '');
  }

  function statusClass(status) {
    if (status === '승인' || status === '완료') return 'ok';
    if (status === '반려') return 'reject';
    return 'wait';
  }

  function statusHtml(status) {
    return `<span class="report-reg-status report-reg-status--${statusClass(status)}">${escapeHtml(status)}</span>`;
  }

  function syncBodyLock() {
    const opened = [detailModal, processModal, repairFormModal].some((modal) => modal && !modal.hidden);
    document.body.classList.toggle('is-mock-modal-open', opened);
  }

  function reportName(item) {
    return `${item.fcltyNm} ${item.chckGbnNm} 보고서`;
  }

  function formatPeriod(item) {
    return `${item.startDate} ~ ${item.endDate}`;
  }

  function setHidden(id, hidden) {
    const el = $(id);
    if (el) el.hidden = hidden;
  }

  function showTypeSection(item) {
    const isRepair = item.chckGbn === 'MNT';
    const isRegular = item.chckGbn === '100';
    const isEmergency = item.chckGbn === '400';

    setHidden('reportRegSummarySection', isRepair);
    setHidden('reportRegInfoSection', isRepair);
    setHidden('repairInfoSection', !isRepair);
    setHidden('regularInspectionSection', !isRegular);
    setHidden('emergencyInspectionSection', !isEmergency);
  }

  function renderTable() {
    const pageRows = filtered.slice((pagingState.page - 1) * pagingState.pageSize, pagingState.page * pagingState.pageSize);

    tbody.innerHTML = pageRows.map((item) => `
      <tr tabindex="0" data-check-id="${escapeHtml(item.checkId)}" class="${selected?.checkId === item.checkId ? 'is-selected' : ''}">
        <td>${item.seqNo}</td>
        <td class="is-left">${escapeHtml(item.manageNm)}</td>
        <td>${escapeHtml(item.portNm)}</td>
        <td>${escapeHtml(item.subportNm)}</td>
        <td class="is-left">${escapeHtml(item.fcltyNm)}</td>
        <td>${escapeHtml(item.asortNm)}</td>
        <td>${escapeHtml(item.fcltyGbnNm)}</td>
        <td>${escapeHtml(item.serviceCompanyNm)} (${escapeHtml(item.userId)})</td>
        <td>${escapeHtml(item.chckGbnNm)}</td>
      </tr>
    `).join('');

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="is-empty">조회된 내용이 없습니다.</td></tr>';
    }

    $('reportRegResultText').innerHTML = `검색결과 <strong>${filtered.length}</strong>건`;
    PomsPaging.mount({
      paginationId: 'reportRegPagination',
      pageSizeId: 'reportRegPageSize',
      totalRows: filtered.length,
      state: pagingState,
      onChange: renderTable,
    });

    tbody.querySelectorAll('tr[data-check-id]').forEach((row) => {
      row.addEventListener('click', () => {
        const item = reports.find((report) => report.checkId === row.dataset.checkId);
        if (!item) return;
        selected = item;
        renderTable();
        fillDetail(item);
        openDetail();
      });
    });
  }

  function renderRepairs(item) {
    const rows = item.repairs.map((repair, index) => `
      <tr>
        <td>${escapeHtml(repair.year)}</td>
        <td class="is-left">${escapeHtml(repair.workName)}</td>
        <td>${escapeHtml(repair.part)}</td>
        <td class="is-left">${escapeHtml(repair.content)}</td>
        <td>${escapeHtml(formatPeriod(repair))}</td>
        <td>${escapeHtml(repair.contractor)}</td>
        <td><button type="button" class="mock-row-btn mock-no-icon" data-repair-edit="${index}">편집</button></td>
      </tr>
    `).join('');
    $('repairInfoBody').innerHTML = rows || '<tr><td colspan="7" class="is-empty">등록된 보수정보가 없습니다.</td></tr>';
    $('repairInfoBody').querySelectorAll('[data-repair-edit]').forEach((button) => {
      button.addEventListener('click', () => openRepairForm(Number(button.dataset.repairEdit)));
    });
  }

  function emptyRepair() {
    return {
      year: new Date().getFullYear(),
      workName: '',
      part: '',
      content: '',
      startDate: '',
      endDate: '',
      contractor: '',
    };
  }

  function renderRepairContent(item) {
    const rows = item.repairs.map((repair, index) => `
      <tr data-repair-row="${index}">
        <td>${escapeHtml(repair.year)}</td>
        <td class="is-left">${escapeHtml(repair.workName)}</td>
        <td>${escapeHtml(repair.part)}</td>
        <td class="is-left">${escapeHtml(repair.content)}</td>
        <td>${escapeHtml(formatPeriod(repair))}</td>
        <td>${escapeHtml(repair.contractor)}</td>
      </tr>
    `).join('');
    $('repairInfoBody').innerHTML = rows || '<tr><td colspan="6" class="is-empty">등록된 보수정보가 없습니다.</td></tr>';
    $('repairInfoBody').querySelectorAll('[data-repair-row]').forEach((row) => {
      row.addEventListener('click', () => fillRepairInlineForm(Number(row.dataset.repairRow)));
    });
    fillRepairInlineForm(item.repairs.length ? 0 : -1);
  }

  function fillRepairInlineForm(index = -1) {
    if (!selected) return;
    const repair = selected.repairs[index] || emptyRepair();
    $('repairInlineEditIndex').value = String(index);
    $('repairInlineYear').value = repair.year;
    $('repairInlineWorkName').value = repair.workName;
    $('repairInlinePart').value = repair.part;
    $('repairInlineContent').value = repair.content;
    $('repairInlineStartDate').value = repair.startDate;
    $('repairInlineEndDate').value = repair.endDate;
    $('repairInlineContractor').value = repair.contractor;
    $('repairInlineDelete').disabled = index < 0;
    $('repairInfoBody').querySelectorAll('[data-repair-row]').forEach((row) => {
      row.classList.toggle('is-selected', Number(row.dataset.repairRow) === index);
    });
  }

  function saveRepairInline(event) {
    event.preventDefault();
    if (!selected) return;
    const repair = {
      year: $('repairInlineYear').value,
      workName: $('repairInlineWorkName').value.trim(),
      part: $('repairInlinePart').value.trim(),
      content: $('repairInlineContent').value.trim(),
      startDate: $('repairInlineStartDate').value,
      endDate: $('repairInlineEndDate').value,
      contractor: $('repairInlineContractor').value.trim(),
    };
    const index = Number($('repairInlineEditIndex').value);
    if (index >= 0) selected.repairs[index] = repair;
    else selected.repairs.push(repair);
    renderRepairContent(selected);
  }

  function deleteRepairInline() {
    if (!selected) return;
    const index = Number($('repairInlineEditIndex').value);
    if (index < 0) return;
    selected.repairs.splice(index, 1);
    renderRepairContent(selected);
  }

  function renderNavyRows(rows) {
    return rows.map((row) => `
      <tr>
        ${row.length % 2 === 1
          ? `<th>${escapeHtml(row[0])}</th>${row.slice(1).map((cell, index) => `<${index % 2 === 0 ? 'th' : 'td'}>${escapeHtml(cell)}</${index % 2 === 0 ? 'th' : 'td'}>`).join('')}`
          : row.map((cell, index) => `<${index % 2 === 0 ? 'th' : 'td'}>${escapeHtml(cell)}</${index % 2 === 0 ? 'th' : 'td'}>`).join('')}
      </tr>
    `).join('');
  }

  function renderRegularInspection(item) {
    if (item.chckGbn !== '100') return;
    const data = item.regular || reports[0].regular;
    $('regularItemsPanel').innerHTML = `
      <table class="report-reg-navy-table">
        <tbody>${renderNavyRows([
          ['시설물명', data.facility.facilityType, '관리주체', data.facility.manager],
          ['조사단위', data.facility.office, '평가단위', data.facility.period],
          ['준공 연월일', data.facility.completionDate, '최종점검 연월일', data.facility.lastInspectionDate],
        ])}</tbody>
      </table>
      <table class="report-reg-navy-table report-reg-navy-table--items">
        <thead>
          <tr><th>구분</th><th>점검항목</th><th>상세 결과</th><th>사진첨부</th></tr>
        </thead>
        <tbody>
          ${data.items.map(([group, name, result, photo]) => `
            <tr>
              <th>${escapeHtml(group)}</th>
              <th>${escapeHtml(name)}</th>
              <td>${escapeHtml(result)}</td>
              <td>${escapeHtml(photo)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <table class="report-reg-navy-table">
        <tbody>${renderNavyRows([
          ['점검일자', '2026-05-26'],
          ['상태', '양호'],
          ['특이사항', '44'],
          ['점검자의견', '55'],
          ['조치계획', '66'],
          ['책임기술자', '소속', '77', '직위', '88', '이름', '99'],
          ['참여기술자', '소속', '11', '직위', '22', '이름', '33'],
        ])}</tbody>
      </table>
    `;

    $('regularResultPanel').innerHTML = `
      <table class="report-reg-navy-table"><tbody>${renderNavyRows(data.summary)}</tbody></table>
      <table class="report-reg-navy-table"><tbody>${renderNavyRows(data.diagnostics)}</tbody></table>
      <table class="report-reg-navy-table">
        <thead><tr><th>구분</th><th>성명</th><th>계약 참여기간</th><th>기술등급</th></tr></thead>
        <tbody>${data.engineers.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
      <table class="report-reg-navy-table"><thead><tr><th>라. 참고사항</th></tr></thead><tbody><tr><td>${escapeHtml(data.notes)}</td></tr></tbody></table>
    `;
  }

  function renderRegularInspection(item) {
    if (item.chckGbn !== '100') return;
    const checkRows = [
      ['상부공 및 본체부', '침하'], ['', '경사/전도'], ['', '활동'], ['', '파손'], ['', '균열'], ['', '박리'], ['', '마모/침식'], ['', '속채움재 유실'], ['', '이격'],
      ['부대시설', '방충재'], ['', '계선주'], ['', '차막이'],
      ['기타', '공중이 이용하는 부위'], ['', '공중이용부위(유무)'], ['', '공중이용부위(보수여부)'],
    ];

    $('regularItemsPanel').innerHTML = `
      <div class="regular-report-form">
        <div class="regular-meta-grid">
          <div class="regular-label"><span class="req">*</span>시설물명</div><div class="regular-value">물양장(1)</div>
          <div class="regular-label"><span class="req">*</span>관리주체</div><div class="regular-value">포항지방해양수산청</div>
          <div class="regular-label">조사단위</div><div class="regular-value">-</div>
          <div class="regular-label">평가단위</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>준공 년월일</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>최종점검 년월일</div><div class="regular-value">-</div>
        </div>
        <table class="regular-check-table">
          <thead><tr><th>구분</th><th>점검항목</th><th>점검 결과</th><th>사진첨부</th></tr></thead>
          <tbody>
            ${checkRows.map(([group, name]) => `
              <tr>
                <td>${escapeHtml(group)}</td>
                <td>${escapeHtml(name)}</td>
                <td>-</td>
                <td><button type="button" class="mock-row-btn mock-no-icon">등록</button> <span class="regular-photo-count">0개</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="regular-summary-grid">
          <div class="regular-label"><span class="req">*</span>점검일자</div><div class="regular-value">2026-03-03</div>
          <div class="regular-label"><span class="req">*</span>상태</div><div class="regular-value">양호</div>
          <div class="regular-label">특이사항</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>점검자의견</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>조치계획</div><div class="regular-value">-</div>
        </div>
        <div class="regular-subtitle"><span class="req">*</span>책임기술자</div>
        <table class="regular-check-table regular-tech-table">
          <thead><tr><th>소속</th><th>직위</th><th>이름</th></tr></thead>
          <tbody><tr><td>-</td><td>-</td><td>-</td></tr></tbody>
        </table>
        <div class="regular-subtitle">참여기술자</div>
        <table class="regular-check-table regular-tech-table">
          <thead><tr><th>소속</th><th>직위</th><th>이름</th></tr></thead>
          <tbody><tr><td>-</td><td>-</td><td>-</td></tr></tbody>
        </table>
      </div>
    `;

    $('regularPhotosPanel').innerHTML = `
      <div class="regular-photo-panel">
        <div class="regular-photo-head">
          <strong>물양장(1)</strong>
          <span>포항지방해양수산청</span>
        </div>
        <div class="regular-photo-grid">
          <figure>
            <img src="assets/sample-site-1.png" alt="상부공 및 본체부 사진">
            <figcaption>상부공 및 본체부</figcaption>
          </figure>
          <figure>
            <img src="assets/sample-site-2.png" alt="상부공 및 본체부 사진">
            <figcaption>상부공 및 본체부</figcaption>
          </figure>
        </div>
      </div>
    `;

    $('regularResultPanel').innerHTML = `
      <div class="regular-report-form">
        <div class="regular-subtitle">일반현황</div>
        <div class="regular-meta-grid">
          <div class="regular-label">대행/자체</div><div class="regular-value">자체</div>
          <div class="regular-label"><span class="req">*</span>용역명</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>점검기간</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>관리주체명</div><div class="regular-value">포항지방해양수산청</div>
          <div class="regular-label"><span class="req">*</span>대표자</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>공동수급</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>계약방법</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>시설물 구분</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>종류</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>종별</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>준공일</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>점검금액(천원)</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>안전등급</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>시설물 위치</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>시설물 규모</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>시설물명</div><div class="regular-value">물양장(1)</div>
        </div>
        <div class="regular-subtitle">점검 실시결과 현황</div>
        <div class="regular-result-grid">
          <div class="regular-label"><span class="req">*</span>중대한 결함 유무</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>공중이 이용하는 부위에 결함</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>주요 점검 결과</div><div class="regular-value">-</div>
          <div class="regular-label"><span class="req">*</span>주요 보수ㆍ보강 계획</div><div class="regular-value">-</div>
        </div>
        <div class="regular-subtitle">책임(참여)기술자 현황</div>
        <table class="regular-check-table regular-tech-table">
          <thead><tr><th>구분</th><th>성명</th><th>과업참여기간</th><th>기술등급</th></tr></thead>
          <tbody><tr><td colspan="4">등록된 기술자가 없습니다.</td></tr></tbody>
        </table>
        <div class="regular-subtitle">참고사항</div>
        <div class="regular-reference">-</div>
      </div>
    `;
  }

  function renderEmergencyInspection(item) {
    if (item.chckGbn !== '400') return;
    const data = item.emergency;
    $('emergencyInfoBody').innerHTML = `
      <tr>
        <td>${escapeHtml(data.date)}</td>
        <td>${escapeHtml(data.type)}</td>
        <td>${escapeHtml(data.grade)}</td>
        <td>${escapeHtml(data.period)}</td>
        <td>${escapeHtml(data.report)}</td>
        ${data.appendices.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}
      </tr>
    `;
    $('emergencyYear').value = data.year || '';
    $('emergencyType').value = data.type || '긴급점검';
    $('emergencyGrade').value = data.grade || 'A';
    $('emergencyScore').value = data.score || '';
    $('emergencyDate').value = data.date || '';
    $('emergencyAgency').value = data.agency || '';
    $('emergencyManager').value = data.manager || '';
  }

  function saveEmergency(event) {
    event.preventDefault();
    if (!selected?.emergency) return;
    selected.emergency.year = $('emergencyYear').value;
    selected.emergency.type = $('emergencyType').value;
    selected.emergency.grade = $('emergencyGrade').value;
    selected.emergency.score = $('emergencyScore').value;
    selected.emergency.date = $('emergencyDate').value;
    selected.emergency.agency = $('emergencyAgency').value.trim();
    selected.emergency.manager = $('emergencyManager').value.trim();
    renderEmergencyInspection(selected);
  }

  function showTypeSection(item) {
    setHidden('reportRegSummarySection', true);
    setHidden('reportRegInfoSection', true);
    setHidden('repairInfoSection', item.chckGbn !== 'MNT');
    setHidden('regularInspectionSection', item.chckGbn !== '100');
    setHidden('emergencyInspectionSection', item.chckGbn !== '400');
  }

  function openRepairEditor(index = -1) {
    fillRepairInlineForm(index);
    $('repairInlineForm').hidden = false;
  }

  function renderRepairContent(item) {
    const rows = item.repairs.map((repair, index) => `
      <tr data-repair-row="${index}">
        <td>${escapeHtml(repair.year)}</td>
        <td class="is-left">${escapeHtml(repair.workName)}</td>
        <td>${escapeHtml(repair.part)}</td>
        <td class="is-left">${escapeHtml(repair.content)}</td>
        <td>${escapeHtml(formatPeriod(repair))}</td>
        <td>${escapeHtml(repair.contractor)}</td>
      </tr>
    `).join('');
    $('repairInfoBody').innerHTML = rows || '<tr><td colspan="6" class="is-empty">등록된 보수정보가 없습니다.</td></tr>';
    $('repairInlineForm').hidden = true;
    $('repairInfoBody').querySelectorAll('[data-repair-row]').forEach((row) => {
      row.addEventListener('click', () => {
        $('repairInfoBody').querySelectorAll('[data-repair-row]').forEach((itemRow) => itemRow.classList.remove('is-selected'));
        row.classList.add('is-selected');
        $('repairInlineEditIndex').value = row.dataset.repairRow;
      });
    });
    $('repairInlineEditIndex').value = item.repairs.length ? '0' : '-1';
  }

  function saveRepairInline(event) {
    event.preventDefault();
    if (!selected) return;
    const repair = {
      year: $('repairInlineYear').value,
      workName: $('repairInlineWorkName').value.trim(),
      part: $('repairInlinePart').value.trim(),
      content: $('repairInlineContent').value.trim(),
      startDate: $('repairInlineStartDate').value,
      endDate: $('repairInlineEndDate').value,
      contractor: $('repairInlineContractor').value.trim(),
    };
    const index = Number($('repairInlineEditIndex').value);
    if (index >= 0) selected.repairs[index] = repair;
    else selected.repairs.push(repair);
    renderRepairContent(selected);
  }

  function deleteRepairInline() {
    if (!selected) return;
    const index = Number($('repairInlineEditIndex').value);
    if (index < 0) return;
    selected.repairs.splice(index, 1);
    renderRepairContent(selected);
  }

  function openEmergencyEditor() {
    if (!selected?.emergency) return;
    renderEmergencyInspection(selected);
    $('emergencyForm').hidden = false;
  }

  function renderEmergencyInspection(item) {
    if (item.chckGbn !== '400') return;
    const data = item.emergency;
    $('emergencyInfoBody').innerHTML = `
      <tr>
        <td>${escapeHtml(data.date)}</td>
        <td>${escapeHtml(data.type)}</td>
        <td>${escapeHtml(data.grade)}</td>
        <td>${escapeHtml(data.period)}</td>
        <td>${escapeHtml(data.report)}</td>
        ${data.appendices.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}
      </tr>
    `;
    $('emergencyYear').value = data.year || '';
    $('emergencyType').value = data.type || '긴급점검';
    $('emergencyGrade').value = data.grade || 'A';
    $('emergencyScore').value = data.score || '';
    $('emergencyDate').value = data.date || '';
    $('emergencyAgency').value = data.agency || '';
    $('emergencyManager').value = data.manager || '';
    $('emergencyForm').hidden = true;
  }

  function saveEmergency(event) {
    event.preventDefault();
    if (!selected?.emergency) return;
    selected.emergency.year = $('emergencyYear').value;
    selected.emergency.type = $('emergencyType').value;
    selected.emergency.grade = $('emergencyGrade').value;
    selected.emergency.score = $('emergencyScore').value;
    selected.emergency.date = $('emergencyDate').value;
    selected.emergency.agency = $('emergencyAgency').value.trim();
    selected.emergency.manager = $('emergencyManager').value.trim();
    renderEmergencyInspection(selected);
  }

  function renderRegularInspection(item) {
    if (item.chckGbn !== '100') return;
    const checkRows = [
      ['상부공 및 본체부', '침하', '11', '1'], ['', '경사/전도', '22', '2'], ['', '활동', '33', '3'], ['', '파손', '44', '4'], ['', '균열', '55', '5'], ['', '박리', '66', '6'], ['', '마모/침식', '77', '7'], ['', '속채움재 유실', '88', '8'], ['', '이격', '99', '9'],
      ['부대시설', '방충재', '10', '1'], ['', '계선주', '20', '2'], ['', '차막이', '30', '3'],
      ['기타', '공중이 이용하는 부위', '40', '4'], ['', '공중이용부위(유무)', '50', '5'], ['', '공중이용부위(보수여부)', '60', '6'],
    ];

    $('regularItemsPanel').innerHTML = `
      <div class="regular-report-form">
        <div class="regular-meta-grid">
          <div class="regular-label"><span class="req">*</span>시설물명</div><div class="regular-value">101</div>
          <div class="regular-label"><span class="req">*</span>관리주체</div><div class="regular-value">102</div>
          <div class="regular-label">조사단위</div><div class="regular-value">103</div>
          <div class="regular-label">평가단위</div><div class="regular-value">104</div>
          <div class="regular-label"><span class="req">*</span>준공 년월일</div><div class="regular-value">105</div>
          <div class="regular-label"><span class="req">*</span>최종점검 년월일</div><div class="regular-value">106</div>
        </div>
        <table class="regular-check-table">
          <thead><tr><th>구분</th><th>점검항목</th><th>점검 결과</th><th>사진첨부</th></tr></thead>
          <tbody>${checkRows.map(([group, name, result, photo]) => `
            <tr><td>${escapeHtml(group)}</td><td>${escapeHtml(name)}</td><td>${escapeHtml(result)}</td><td>${escapeHtml(photo)}</td></tr>
          `).join('')}</tbody>
        </table>
        <div class="regular-summary-grid">
          <div class="regular-label"><span class="req">*</span>점검일자</div><div class="regular-value">20260303</div>
          <div class="regular-label"><span class="req">*</span>상태</div><div class="regular-value">1</div>
          <div class="regular-label">특이사항</div><div class="regular-value">2</div>
          <div class="regular-label"><span class="req">*</span>점검자의견</div><div class="regular-value">3</div>
          <div class="regular-label"><span class="req">*</span>조치계획</div><div class="regular-value">4</div>
        </div>
        <div class="regular-subtitle"><span class="req">*</span>책임기술자</div>
        <table class="regular-check-table regular-tech-table"><thead><tr><th>소속</th><th>직위</th><th>이름</th></tr></thead><tbody><tr><td>11</td><td>22</td><td>33</td></tr></tbody></table>
        <div class="regular-subtitle">참여기술자</div>
        <table class="regular-check-table regular-tech-table"><thead><tr><th>소속</th><th>직위</th><th>이름</th></tr></thead><tbody><tr><td>44</td><td>55</td><td>66</td></tr></tbody></table>
      </div>`;

    $('regularPhotosPanel').innerHTML = `
      <div class="regular-photo-panel">
        <div class="regular-photo-head"><strong>101</strong><span>102</span></div>
        <div class="regular-photo-grid">
          <figure><img src="assets/sample-site-1.png" alt="점검 사진 1"><figcaption>11</figcaption></figure>
          <figure><img src="assets/sample-site-2.png" alt="점검 사진 2"><figcaption>22</figcaption></figure>
        </div>
      </div>`;

    $('regularResultPanel').innerHTML = `
      <div class="regular-report-form">
        <div class="regular-subtitle">일반현황</div>
        <div class="regular-meta-grid">
          <div class="regular-label">대행/자체</div><div class="regular-value">1</div>
          <div class="regular-label"><span class="req">*</span>용역명</div><div class="regular-value">2</div>
          <div class="regular-label"><span class="req">*</span>점검기간</div><div class="regular-value">3</div>
          <div class="regular-label"><span class="req">*</span>관리주체명</div><div class="regular-value">4</div>
          <div class="regular-label"><span class="req">*</span>대표자</div><div class="regular-value">5</div>
          <div class="regular-label"><span class="req">*</span>공동수급</div><div class="regular-value">6</div>
          <div class="regular-label"><span class="req">*</span>계약방법</div><div class="regular-value">7</div>
          <div class="regular-label"><span class="req">*</span>시설물 구분</div><div class="regular-value">8</div>
          <div class="regular-label"><span class="req">*</span>종류</div><div class="regular-value">9</div>
          <div class="regular-label"><span class="req">*</span>종별</div><div class="regular-value">10</div>
          <div class="regular-label"><span class="req">*</span>준공일</div><div class="regular-value">11</div>
          <div class="regular-label"><span class="req">*</span>점검금액(천원)</div><div class="regular-value">12</div>
          <div class="regular-label"><span class="req">*</span>안전등급</div><div class="regular-value">13</div>
          <div class="regular-label"><span class="req">*</span>시설물 위치</div><div class="regular-value">14</div>
          <div class="regular-label"><span class="req">*</span>시설물 규모</div><div class="regular-value">15</div>
          <div class="regular-label"><span class="req">*</span>시설물명</div><div class="regular-value">16</div>
        </div>
        <div class="regular-subtitle">점검 실시결과 현황</div>
        <div class="regular-result-grid">
          <div class="regular-label"><span class="req">*</span>중대한 결함 유무</div><div class="regular-value">21</div>
          <div class="regular-label"><span class="req">*</span>공중이 이용하는 부위에 결함</div><div class="regular-value">22</div>
          <div class="regular-label"><span class="req">*</span>주요 점검 결과</div><div class="regular-value">23</div>
          <div class="regular-label"><span class="req">*</span>주요 보수ㆍ보강 계획</div><div class="regular-value">24</div>
        </div>
        <div class="regular-subtitle">책임(참여)기술자 현황</div>
        <table class="regular-check-table regular-tech-table"><thead><tr><th>구분</th><th>성명</th><th>과업참여기간</th><th>기술등급</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td><td>4</td></tr></tbody></table>
        <div class="regular-subtitle">참고사항</div>
        <div class="regular-reference">123</div>
      </div>`;
  }

  function fillDetail(item) {
    $('reportRegDetailTitle').textContent = reportName(item);
    $('reportRegDetailSub').textContent = `${item.manageNm} · ${item.serviceCompanyNm} (${item.userId})`;
    $('reportRegCompany').textContent = `${item.serviceCompanyNm} (${item.userId})`;
    $('reportRegCheckName').textContent = item.chckGbnNm;
    $('reportRegSubmitDate').textContent = item.chckDe;
    $('reportRegStatus').innerHTML = statusHtml(item.status);
    $('reportRegReportName').textContent = reportName(item);
    $('reportRegWriter').textContent = item.writer;
    $('reportRegCheckDate').textContent = item.chckDe;
    $('reportRegComment').textContent = item.comment;
    showTypeSection(item);
    renderRepairContent(item);
    renderRegularInspection(item);
    renderEmergencyInspection(item);
  }

  function openDetail() {
    detailModal.hidden = false;
    detailModal.setAttribute('aria-hidden', 'false');
    syncBodyLock();
    window.setTimeout(() => $('reportRegProcess')?.focus(), 0);
  }

  function closeDetail() {
    detailModal.hidden = true;
    detailModal.setAttribute('aria-hidden', 'true');
    syncBodyLock();
  }

  function renderApprovalHistory() {
    if (!selected) return;
    const rows = selected.approvals;
    const pageRows = rows.slice((approvalPagingState.page - 1) * approvalPagingState.pageSize, approvalPagingState.page * approvalPagingState.pageSize);
    $('reportRegProcessBody').innerHTML = pageRows.map((row) => `
      <tr>
        <td>${escapeHtml(row.type)}</td>
        <td>${escapeHtml(row.requester)}</td>
        <td class="is-left">${escapeHtml(row.company)}</td>
        <td>${escapeHtml(row.requestDate)}</td>
        <td>${escapeHtml(row.reviewer)}</td>
        <td class="is-left">${escapeHtml(row.opinion)}</td>
        <td>${statusHtml(row.status)}</td>
      </tr>
    `).join('');
    PomsPaging.mount({
      paginationId: 'reportRegProcessPagination',
      pageSizeId: 'reportRegProcessPageSize',
      totalRows: rows.length,
      state: approvalPagingState,
      onChange: renderApprovalHistory,
    });
  }

  function openProcess() {
    if (!selected) return;
    approvalPagingState.page = 1;
    $('reportRegProcessSub').textContent = `${selected.serviceCompanyNm} · ${selected.chckGbnNm}`;
    renderApprovalHistory();
    processModal.hidden = false;
    processModal.setAttribute('aria-hidden', 'false');
    syncBodyLock();
    window.setTimeout(() => processModal.querySelector('[data-report-process-close]')?.focus(), 0);
  }

  function closeProcess() {
    processModal.hidden = true;
    processModal.setAttribute('aria-hidden', 'true');
    syncBodyLock();
  }

  function openRepairForm(index = -1) {
    if (!selected) return;
    const repair = selected.repairs[index] || {
      year: new Date().getFullYear(),
      workName: '',
      part: '',
      content: '',
      startDate: '',
      endDate: '',
      contractor: '',
    };
    $('repairFormTitle').textContent = index >= 0 ? '보수정보 편집' : '보수정보 추가';
    $('repairEditIndex').value = String(index);
    $('repairYear').value = repair.year;
    $('repairWorkName').value = repair.workName;
    $('repairPart').value = repair.part;
    $('repairContent').value = repair.content;
    $('repairStartDate').value = repair.startDate;
    $('repairEndDate').value = repair.endDate;
    $('repairContractor').value = repair.contractor;
    repairFormModal.hidden = false;
    repairFormModal.setAttribute('aria-hidden', 'false');
    syncBodyLock();
    window.setTimeout(() => $('repairYear')?.focus(), 0);
  }

  function closeRepairForm() {
    repairFormModal.hidden = true;
    repairFormModal.setAttribute('aria-hidden', 'true');
    syncBodyLock();
  }

  function saveRepair(event) {
    event.preventDefault();
    if (!selected) return;
    const repair = {
      year: $('repairYear').value,
      workName: $('repairWorkName').value.trim(),
      part: $('repairPart').value.trim(),
      content: $('repairContent').value.trim(),
      startDate: $('repairStartDate').value,
      endDate: $('repairEndDate').value,
      contractor: $('repairContractor').value.trim(),
    };
    const index = Number($('repairEditIndex').value);
    if (index >= 0) selected.repairs[index] = repair;
    else selected.repairs.push(repair);
    renderRepairs(selected);
    closeRepairForm();
  }

  function applyFilter() {
    const manageId = $('reportRegManageFilter').value;
    const checkGbn = $('reportRegCheckFilter').value;
    filtered = reports.filter((item) => {
      const manageMatched = !manageId || item.manageId === manageId;
      const checkMatched = !checkGbn || item.chckGbn === checkGbn;
      return manageMatched && checkMatched;
    });
    pagingState.page = 1;
    selected = null;
    renderTable();
  }

  function updateStatus(nextStatus) {
    if (!selected) return;
    selected.status = nextStatus;
    selected.comment = nextStatus === '승인'
      ? '관리자가 보고서 제출 내용을 승인했습니다.'
      : '관리자가 보고서 제출 내용을 반려했습니다.';
    selected.approvals.push({
      type: nextStatus,
      requester: selected.writer,
      company: selected.serviceCompanyNm,
      requestDate: '2026-06-12 10:00',
      reviewer: '관리자',
      opinion: selected.comment,
      status: nextStatus === '승인' ? '완료' : '반려',
    });
    fillDetail(selected);
    renderTable();
  }

  $('reportRegSearch').addEventListener('click', applyFilter);
  $('reportRegProcess').addEventListener('click', openProcess);
  $('reportRegApprove').addEventListener('click', () => updateStatus('승인'));
  $('reportRegReject').addEventListener('click', () => updateStatus('반려'));
  $('repairInlineAdd')?.addEventListener('click', () => openRepairEditor(-1));
  $('repairInlineEdit')?.addEventListener('click', () => openRepairEditor(Number($('repairInlineEditIndex').value || 0)));
  $('repairInlineCancel')?.addEventListener('click', () => {
    $('repairInlineForm').hidden = true;
  });
  $('repairInlineDelete')?.addEventListener('click', deleteRepairInline);
  $('repairInlineForm')?.addEventListener('submit', saveRepairInline);
  $('emergencyAddButton')?.addEventListener('click', openEmergencyEditor);
  $('emergencyEditButton')?.addEventListener('click', openEmergencyEditor);
  $('emergencyCancelButton')?.addEventListener('click', () => {
    $('emergencyForm').hidden = true;
  });
  $('emergencyForm')?.addEventListener('submit', saveEmergency);
  $('regularDownloadButton')?.addEventListener('click', () => alert('보고서 다운로드를 시작합니다. (샘플)'));
  $('regularEditButton')?.addEventListener('click', () => alert('정기안전점검 보고서를 편집합니다. (샘플)'));
  $('regularCancelButton')?.addEventListener('click', () => fillDetail(selected));
  $('repairForm')?.addEventListener('submit', saveRepair);

  detailModal.querySelectorAll('[data-report-reg-close]').forEach((button) => {
    button.addEventListener('click', closeDetail);
  });
  processModal.querySelectorAll('[data-report-process-close]').forEach((button) => {
    button.addEventListener('click', closeProcess);
  });
  repairFormModal.querySelectorAll('[data-repair-form-close]').forEach((button) => {
    button.addEventListener('click', closeRepairForm);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (repairFormModal && !repairFormModal.hidden) return closeRepairForm();
    if (processModal && !processModal.hidden) return closeProcess();
    if (detailModal && !detailModal.hidden) closeDetail();
  });

  document.querySelectorAll('[data-regular-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.regularTab;
      document.querySelectorAll('[data-regular-tab]').forEach((button) => {
        const active = button === tab;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      document.querySelectorAll('[data-regular-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.regularPanel !== key;
      });
    });
  });

  renderTable();
})();
