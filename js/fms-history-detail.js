/**
 * FMS 연계 상세 — 시스템 관리 상세(fmd-section / fmd-row) 패턴
 * mode: view | history | match
 */
(() => {
  const rows = window.FMS_LINK_ROWS || [];
  const candidateFacilities = window.FMS_CANDIDATE_FACILITIES || [];
  const listTabColumns = window.FMS_LIST_TAB_COLUMNS || {};
  const listTabRows = window.FMS_LIST_TAB_ROWS || {};

  const schema = window.PomsFmsSchema || { tabs: ['기본현황'], detail: {}, history: {} };

  const params = new URLSearchParams(window.location.search);
  const fmsNo = params.get('no') || '';
  const mode = ['view', 'history', 'match'].includes(params.get('mode')) ? params.get('mode') : 'view';

  const activeRow = rows.find((row) => row.fmsNo === fmsNo) || null;

  const tabWrap = document.getElementById('fmsTabs');
  const content = document.getElementById('fmsTabContent');

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '');
  }

  function goList() {
    window.location.href = 'fms-history.html';
  }

  function matchingText(row) {
    return row.pomsName ? '매칭' : '비매칭';
  }

  function valueFor(label, row, isHistory) {
    const baseValues = {
      번호: '1',
      시설물번호: row.fmsNo,
      시설물명: row.fmsName,
      등록일자: row.date,
      수정일자: row.date,
      변경날자: row.date,
    };
    if (isHistory && label === '변경날자') return row.date;
    return baseValues[label] || '-';
  }

  function renderFieldRows(fields, row, isHistory, cols = 4) {
    const chunks = [];
    for (let i = 0; i < fields.length; i += cols) {
      chunks.push(fields.slice(i, i + cols));
    }
    return chunks.map((chunk) => `
      <div class="fmd-row">
        ${chunk.map((label) => `
          <div class="fmd-field">
            <span class="fmd-label">${escapeHtml(label)}</span>
            <span class="fmd-control">
              <input type="text" class="fmd-input" value="${escapeHtml(valueFor(label, row, isHistory))}" readonly>
            </span>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  function renderListTable(tab) {
    const columns = listTabColumns[tab] || [];
    const rowsData = listTabRows[tab] || [];
    return `
      <div class="fms-detail-table-shell">
        <table class="fms-detail-table" aria-label="${escapeHtml(tab)}">
          <thead>
            <tr>${columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rowsData.length
              ? rowsData.map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value || '-')}</td>`).join('')}</tr>`).join('')
              : `<tr><td colspan="${Math.max(columns.length, 1)}" class="is-empty">조회된 내용이 없습니다.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderSpecTable(row) {
    if (row.fmsNo.startsWith('HM')) {
      return `
        <div class="fms-detail-table-shell">
          <table class="fms-spec-table" aria-label="상세제원">
            <tr>
              <th>최대계류선박규모</th><th>계류시설연장</th><th>천단고</th><th>수심</th><th>케이슨식유무</th><th>L형블럭식유무</th><th>셀룰러블럭식유무</th><th>현장타설식유무</th>
            </tr>
            <tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
            <tr>
              <th colspan="3">말뚝식구경</th><th rowspan="2">원통식유무</th><th rowspan="2">교각식유무</th><th rowspan="2">널말뚝식_규격</th><th rowspan="2">기타형식</th><th rowspan="2">해역코드</th>
            </tr>
            <tr><th>말뚝식구경</th><th>말뚝식연장</th><th>말뚝식본수</th></tr>
            <tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
            <tr><th>항만구분</th><th>항만명</th><th>구조형식</th><th>부두폭</th><th>배면매립부길이</th><th>해저송유관길이</th><th colspan="2">기타상세제원</th></tr>
            <tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td colspan="2">-</td></tr>
          </table>
        </div>
      `;
    }

    if (!row.fmsNo.startsWith('HB')) {
      return `
        <div class="fms-detail-block">
          ${renderFieldRows((schema.detail.상세제원 || []).slice(0, 36), row, false, 4)}
          <p class="fms-detail-note">선택 시설물 유형에 맞는 상세제원 항목을 확인합니다.</p>
        </div>
      `;
    }

    return `
      <div class="fms-detail-table-shell">
        <table class="fms-spec-table" aria-label="상세제원">
          <tr>
            <th colspan="2" rowspan="2">방파제/파제제/호안</th>
            <th rowspan="2">허용월파량(호안)</th>
            <th colspan="3">설계파</th>
            <th colspan="2">수심</th>
          </tr>
          <tr><th>파고</th><th>파향</th><th>주기</th><th>최대</th><th>최소</th></tr>
          <tr><td colspan="2">호안</td><td>.00001</td><td>1.4</td><td>S</td><td>14</td><td>-3</td><td>-5.7</td></tr>
          <tr>
            <th colspan="2">조위</th>
            <th rowspan="2">D.L_EL과표고차</th>
            <th rowspan="2">D.L_기준항만</th>
            <th colspan="2">형식분류</th>
            <th rowspan="2">마루높이</th>
            <th rowspan="2">사면경사</th>
          </tr>
          <tr><th>약최고고조위</th><th>평균해면</th><th>목적</th><th>구조</th></tr>
          <tr><td>1.906</td><td>0.953</td><td>0</td><td>-</td><td>가호안</td><td>사석식호안</td><td>7.5</td><td>1:1.5</td></tr>
          <tr>
            <th rowspan="2">주요 구조물 설계기준 강도</th>
            <th colspan="2">방파제,파제제(연장)</th>
            <th colspan="2">방파제,파제제(상치공 폭)</th>
            <th rowspan="2">호안_연장</th>
            <th colspan="2">호안(상치공)</th>
          </tr>
          <tr><th>제간부</th><th>제두부</th><th>제간부</th><th>제두부</th><th>규격</th><th>형상</th></tr>
          <tr><td>-</td><td>210</td><td>20</td><td>5</td><td>6.5</td><td>2816</td><td>-</td><td>-</td></tr>
          <tr>
            <th colspan="2">피복재제원</th>
            <th colspan="3">제체제원</th>
            <th rowspan="2">기초처리공</th>
            <th colspan="2">배후지(호안)</th>
          </tr>
          <tr><th>제간부</th><th>제두부</th><th>블록식</th><th>케이슨식</th><th>기타</th><th>매립고</th><th>이용조건/배수시설</th></tr>
          <tr><td>-</td><td>-</td><td>-</td><td>-</td><td>사석경사제(0.001~0.3m³/EA)</td><td>10m이하:강제치환공<br>10m이상:SCP,PBD</td><td>-</td><td>-</td></tr>
          <tr>
            <th colspan="4">간이접안시설</th>
            <th colspan="2">항로표지시설(방파제,파제제)</th>
            <th colspan="2" rowspan="2">기타상세제원</th>
          </tr>
          <tr><th>위치</th><th>대상선박규모</th><th>방충재</th><th>계선주</th><th>형식</th><th>구조</th></tr>
          <tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td colspan="2">-</td></tr>
        </table>
      </div>
    `;
  }

  function renderTabs(active) {
    tabWrap.hidden = false;
    tabWrap.innerHTML = schema.tabs.map((tab) => (
      `<button type="button" class="ua-account-tabs__btn${tab === active ? ' is-active' : ''}" data-tab="${escapeHtml(tab)}">${escapeHtml(tab)}</button>`
    )).join('');
  }

  function historySearchHtml() {
    return `
      <div class="fms-search-block">
        <div class="fmd-row fms-search-row">
          <div class="fmd-field fmd-field--range">
            <span class="fmd-label">변경일자</span>
            <span class="fmd-control fms-date-range">
              <input type="date" class="fmd-input" id="fmsHistDateFrom" value="2026-05-01" aria-label="변경일자 시작">
              <em>~</em>
              <input type="date" class="fmd-input" id="fmsHistDateTo" value="${escapeHtml(activeRow.date)}" aria-label="변경일자 종료">
            </span>
          </div>
          <div class="fmd-field">
            <label class="fmd-label" for="fmsHistAuthor">변경자</label>
            <span class="fmd-control">
              <input type="text" class="fmd-input" id="fmsHistAuthor" value="FMS">
            </span>
          </div>
          <div class="fmd-field">
            <label class="fmd-label" for="fmsHistType">변경구분</label>
            <span class="fmd-control">
              <select class="fmd-select" id="fmsHistType">
                <option>전체</option>
                <option>등록</option>
                <option>수정</option>
                <option>삭제</option>
              </select>
            </span>
          </div>
          <div class="fmd-field fms-search-actions">
            <span class="fmd-label" aria-hidden="true">&nbsp;</span>
            <span class="fmd-control fms-search-actions__btns">
              <button type="button" class="fmd-btn fmd-btn--edit" id="fmsHistSearch">
                <img src="assets/main/facility-statistics/icon-search.svg" alt="" width="18" height="18">
                검색하기
              </button>
              <button type="button" class="fmd-btn fmd-btn--cancel" id="fmsHistReset">
                <img src="assets/main/facility-search/icon-reset.svg" alt="" width="18" height="18">
                초기화
              </button>
            </span>
          </div>
        </div>
      </div>
    `;
  }

  function bindHistoryFilters() {
    content.querySelector('#fmsHistSearch')?.addEventListener('click', () => {
      alert('현재 조건으로 조회했습니다. (샘플)');
    });
    content.querySelector('#fmsHistReset')?.addEventListener('click', () => {
      const from = content.querySelector('#fmsHistDateFrom');
      const to = content.querySelector('#fmsHistDateTo');
      const author = content.querySelector('#fmsHistAuthor');
      const type = content.querySelector('#fmsHistType');
      if (from) from.value = '2026-05-01';
      if (to) to.value = activeRow.date;
      if (author) author.value = 'FMS';
      if (type) type.selectedIndex = 0;
    });
  }

  function renderHistoryContent(tab) {
    const fields = schema.history[tab] || [];
    const rowsData = [0, 1, 2].map((index) => fields.map((field) => {
      if (field === '번호') return String(index + 1);
      if (field === '변경날자') return index === 0 ? activeRow.date : `2026-05-${String(20 - index).padStart(2, '0')}`;
      if (field === '변경자') return 'FMS';
      return valueFor(field, activeRow, true);
    }));
    content.innerHTML = `
      <div class="fms-detail-block">
        ${historySearchHtml()}
        <div class="fms-results-head">
          <h3 class="fms-results-head__label">검색결과</h3>
          <p class="fms-results-head__meta">총 <strong>${rowsData.length}</strong>건</p>
        </div>
        <div class="fms-detail-table-shell">
          <table class="fms-detail-table" aria-label="${escapeHtml(tab)} 변경이력">
            <thead>
              <tr>${fields.map((field) => `<th scope="col">${escapeHtml(field)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rowsData.map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    bindHistoryFilters();
  }

  function renderContent(tab) {
    if (mode === 'history') {
      renderHistoryContent(tab);
      return;
    }

    const fields = schema.detail[tab] || [];

    if (tab === '상세제원') {
      content.innerHTML = `<div class="fms-detail-block">${renderSpecTable(activeRow)}</div>`;
      return;
    }

    if (listTabColumns[tab]) {
      content.innerHTML = `<div class="fms-detail-block">${renderListTable(tab)}</div>`;
      return;
    }

    content.innerHTML = `
      <div class="fms-detail-block">
        ${fields.length
          ? renderFieldRows(fields, activeRow, false, 4)
          : '<p class="fms-detail-note">표시할 항목이 없습니다.</p>'}
        <p class="fms-detail-note">값이 없는 항목은 '-'로 표시합니다.</p>
      </div>
    `;
  }

  function renderMatchContent() {
    tabWrap.hidden = true;
    tabWrap.innerHTML = '';
    document.body.classList.add('is-match-mode');
    const sub = $('fmsDetailSub');
    if (sub) sub.hidden = true;

    content.innerHTML = `
      <div class="fms-detail-block">
        <div class="fms-search-block">
          <div class="fmd-row fms-search-row">
            <div class="fmd-field">
              <label class="fmd-label" for="fmsMatchAgency">관리기관</label>
              <span class="fmd-control">
                <input type="text" class="fmd-input" id="fmsMatchAgency" value="해양수산부">
              </span>
            </div>
            <div class="fmd-field">
              <label class="fmd-label" for="fmsMatchName">시설물명</label>
              <span class="fmd-control">
                <input type="text" class="fmd-input" id="fmsMatchName" value="${escapeHtml(activeRow.fmsName)}">
              </span>
            </div>
            <div class="fmd-field">
              <label class="fmd-label" for="fmsMatchStatus">매칭상태</label>
              <span class="fmd-control">
                <select class="fmd-select" id="fmsMatchStatus">
                  <option>${matchingText(activeRow)}</option>
                  <option>전체</option>
                  <option>매칭</option>
                  <option>비매칭</option>
                </select>
              </span>
            </div>
            <div class="fmd-field fms-search-actions">
              <span class="fmd-label" aria-hidden="true">&nbsp;</span>
              <span class="fmd-control fms-search-actions__btns">
                <button type="button" class="fmd-btn fmd-btn--edit" id="fmsMatchSearch">
                  <img src="assets/main/facility-statistics/icon-search.svg" alt="" width="18" height="18">
                  검색하기
                </button>
                <button type="button" class="fmd-btn fmd-btn--cancel" id="fmsMatchReset">
                  <img src="assets/main/facility-search/icon-reset.svg" alt="" width="18" height="18">
                  초기화
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="fms-results-head">
          <h3 class="fms-results-head__label">검색결과</h3>
          <p class="fms-results-head__meta">총 <strong id="fmsMatchCount">${candidateFacilities.length}</strong>건</p>
        </div>

        <div class="fms-detail-table-shell">
          <table class="fms-detail-table fms-match-table" aria-label="POMS 시설물 목록">
            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">항만구분</th>
                <th scope="col">관리구분</th>
                <th scope="col">관리기관</th>
                <th scope="col">해역</th>
                <th scope="col">항명</th>
                <th scope="col">세부항명</th>
                <th scope="col">시설구분</th>
                <th scope="col">시설명</th>
                <th scope="col">FMS등록</th>
                <th scope="col">등록</th>
              </tr>
            </thead>
            <tbody>
              ${candidateFacilities.map((item, index) => `
                <tr>
                  ${item.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}
                  <td>
                    <button type="button" class="sra-tbl-btn sra-tbl-btn--approve" data-action="apply-match" data-candidate-index="${index}">등록</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    content.querySelector('#fmsMatchSearch')?.addEventListener('click', () => {
      alert('현재 조건으로 조회했습니다. (샘플)');
    });
    content.querySelector('#fmsMatchReset')?.addEventListener('click', () => {
      const agency = content.querySelector('#fmsMatchAgency');
      const name = content.querySelector('#fmsMatchName');
      const status = content.querySelector('#fmsMatchStatus');
      if (agency) agency.value = '해양수산부';
      if (name) name.value = activeRow.fmsName;
      if (status) status.selectedIndex = 0;
    });
  }

  function init() {
    PomsSidebarAdmin.mount('#sidebar-root', { active: 'link-fms' });

    if (!activeRow) {
      alert('FMS 연계 정보를 찾을 수 없습니다.');
      goList();
      return;
    }

    const titles = {
      view: 'FMS 시설물 상세 정보',
      history: 'FMS 시설물 변경이력',
      match: 'POMS 시설물 목록 매칭',
    };
    const badges = { view: '데이터보기', history: '변경이력', match: '등록' };

    $('fmsDetailPageTitle').textContent = titles[mode];
    $('fmsDetailCrumb').textContent = titles[mode];
    $('fmsModeBadge').textContent = badges[mode];
    $('fmsDetailSub').textContent = `${activeRow.fmsNo} · ${activeRow.fmsName}`;
    document.title = `${titles[mode]} | POMS`;

    if (mode === 'history') {
      document.body.classList.add('is-history-mode');
      const icon = $('fmsSectionIcon');
      if (icon) icon.src = 'assets/main/facility-search/icon-condition.svg';
    }

    $('fmsDetailBackBtn')?.addEventListener('click', goList);

    if (mode === 'match') {
      renderMatchContent();
    } else {
      renderTabs(schema.tabs[0]);
      renderContent(schema.tabs[0]);
    }

    tabWrap.addEventListener('click', (event) => {
      const tabBtn = event.target.closest('[data-tab]');
      if (!tabBtn) return;
      renderTabs(tabBtn.dataset.tab);
      renderContent(tabBtn.dataset.tab);
    });

    content.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-action="apply-match"]');
      if (!btn) return;
      const candidate = candidateFacilities[Number(btn.dataset.candidateIndex)];
      if (!candidate) return;
      activeRow.pomsName = candidate[8];
      alert(`${activeRow.fmsNo} 시설물을 ${candidate[8]} 시설물과 매칭했습니다. (샘플)`);
      goList();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
