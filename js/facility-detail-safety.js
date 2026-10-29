/**
 * 시설물 상세 — 안전시설현황
 * 구분 > 종류(소분류) > 항목 계층 구조를 셀 병합으로 렌더링하고,
 * 수정 버튼으로 제원/설치량/비고 값을 편집할 수 있도록 한다.
 */
(function () {
  const SAFETY_STRUCTURE = [
    {
      group: '피해예방시설',
      kinds: [
        { kind: '추락방지', items: ['안전난간', '파라펫', '차막이'] },
        { kind: '진입방지', items: ['울타리', '출입문', '볼라드'] },
        { kind: '시인성', items: ['조명시설'] },
      ],
    },
    {
      group: '위험안내시설',
      items: ['경고표지판', '안내표지판', '스피커', 'CCTV'],
    },
    {
      group: '긴급대응시설',
      items: ['인명구조함', '구명사다리'],
    },
    {
      group: '기타 안전시설',
      items: ['표지판', '표시선', '위험경고판', '로고젝터', '표지벙'],
    },
  ];

  function buildRows() {
    const rows = [];
    SAFETY_STRUCTURE.forEach((groupDef) => {
      const groupRows = [];
      if (groupDef.kinds) {
        groupDef.kinds.forEach((kindDef) => {
          kindDef.items.forEach((item, idx) => {
            groupRows.push({
              flat: false,
              kind: kindDef.kind,
              kindSpan: kindDef.items.length,
              showKind: idx === 0,
              item,
            });
          });
        });
      } else {
        groupDef.items.forEach((item) => {
          groupRows.push({
            flat: true,
            kind: item,
            kindSpan: 1,
            showKind: true,
            item: null,
          });
        });
      }
      groupRows.forEach((row, idx) => {
        rows.push({
          ...row,
          group: groupDef.group,
          groupSpan: groupRows.length,
          showGroup: idx === 0,
        });
      });
    });
    return rows;
  }

  const ROWS = buildRows();

  const state = {
    editing: false,
    values: ROWS.map(() => ({ spec: '', qty: '', remark: '' })),
    snapshot: null,
  };

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderValueCell(rowIndex, field) {
    const value = state.values[rowIndex][field];
    if (state.editing) {
      return `<td class="safety-facility-table__value safety-facility-table__value--edit">
        <input type="text" class="safety-edit-input" data-row="${rowIndex}" data-field="${field}" value="${escapeHtml(value)}">
      </td>`;
    }
    const emptyClass = value ? '' : ' is-empty';
    return `<td class="safety-facility-table__value${emptyClass}">${escapeHtml(value || '-')}</td>`;
  }

  function renderTable() {
    const tbody = document.getElementById('safetyFacilityBody');
    if (!tbody) return;

    tbody.innerHTML = ROWS.map((row, index) => {
      let html = '<tr>';
      if (index === 0) {
        html += `<th scope="rowgroup" class="safety-facility-table__label safety-facility-table__label--root" rowspan="${ROWS.length}">안전시설물구분</th>`;
      }
      if (row.showGroup) {
        html += `<th scope="rowgroup" class="safety-facility-table__label safety-facility-table__label--group" rowspan="${row.groupSpan}">${escapeHtml(row.group)}</th>`;
      }
      if (row.flat) {
        html += `<th scope="row" class="safety-facility-table__label safety-facility-table__label--kind" colspan="2">${escapeHtml(row.kind)}</th>`;
      } else {
        if (row.showKind) {
          html += `<th scope="row" class="safety-facility-table__label safety-facility-table__label--kind" rowspan="${row.kindSpan}">${escapeHtml(row.kind)}</th>`;
        }
        html += `<th scope="row" class="safety-facility-table__label safety-facility-table__label--item">${escapeHtml(row.item)}</th>`;
      }
      html += renderValueCell(index, 'spec');
      html += renderValueCell(index, 'qty');
      html += renderValueCell(index, 'remark');
      html += '</tr>';
      return html;
    }).join('');
  }

  function toggleActionButtons() {
    const editBtn = document.getElementById('safetyEditBtn');
    const saveBtn = document.getElementById('safetySaveBtn');
    const cancelBtn = document.getElementById('safetyCancelBtn');
    if (editBtn) editBtn.hidden = state.editing;
    if (saveBtn) saveBtn.hidden = !state.editing;
    if (cancelBtn) cancelBtn.hidden = !state.editing;
  }

  function enterEditMode() {
    state.snapshot = state.values.map((v) => ({ ...v }));
    state.editing = true;
    renderTable();
    toggleActionButtons();
  }

  function collectInputValues() {
    document.querySelectorAll('#safetyFacilityBody .safety-edit-input').forEach((input) => {
      const rowIndex = Number(input.dataset.row);
      const field = input.dataset.field;
      if (!Number.isNaN(rowIndex) && state.values[rowIndex]) {
        state.values[rowIndex][field] = input.value.trim();
      }
    });
  }

  function exitEditMode(commit) {
    if (commit) {
      collectInputValues();
    } else if (state.snapshot) {
      state.values = state.snapshot;
    }
    state.snapshot = null;
    state.editing = false;
    renderTable();
    toggleActionButtons();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('safetyFacilityBody')) return;

    renderTable();
    toggleActionButtons();

    document.getElementById('safetyEditBtn')?.addEventListener('click', enterEditMode);
    document.getElementById('safetySaveBtn')?.addEventListener('click', () => {
      exitEditMode(true);
      alert('안전시설현황이 저장되었습니다.');
    });
    document.getElementById('safetyCancelBtn')?.addEventListener('click', () => {
      exitEditMode(false);
    });
  });
})();
