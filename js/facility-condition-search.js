(function () {
  const Data = window.PomsConditionData;
  if (!Data) return;

  const {
    DEFAULT_SELECTED,
    OUTPUT_FIELDS,
    DETAIL_GROUPS,
    ICONS,
    MULTI_FIELD_LABELS,
    MULTI_FIELD_SOURCE_MAP,
    STORAGE_KEY,
  } = Data;

  const state = {
    selectedColumns: [...DEFAULT_SELECTED],
    dragId: null,
    multiConditions: [],
  };

  function getFieldMeta(id) {
    return OUTPUT_FIELDS.find((field) => field.id === id);
  }

  function renderCheckLabel(fieldId) {
    const meta = getFieldMeta(fieldId);
    if (!meta) return '';
    const checked = state.selectedColumns.includes(fieldId) ? ' checked' : '';
    return `<label class="condition-check">
      <input type="checkbox" data-field-id="${fieldId}"${checked}>
      <span class="condition-check__box" aria-hidden="true"></span>
      <span class="condition-check__label">${meta.label}</span>
    </label>`;
  }

  function renderDetailGroup(group, compact) {
    const checks = group.fields.map(renderCheckLabel).join('');
    const compactClass = compact ? ' condition-detail-group--compact' : '';
    return `<div class="condition-detail-group${compactClass}">
      <h4 class="condition-detail-group__title">${group.title}</h4>
      <div class="condition-check-grid">${checks}</div>
    </div>`;
  }

  function renderDetailCheckboxes() {
    const container = document.getElementById('conditionDetailGroups');
    if (!container) return;

    const [primary, ...rest] = DETAIL_GROUPS;
    const splitHtml = rest.length
      ? `<div class="condition-detail-groups__split">${rest.map((group) => renderDetailGroup(group, true)).join('')}</div>`
      : '';

    container.innerHTML = `${renderDetailGroup(primary, false)}${splitHtml}`;

    container.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.addEventListener('change', () => {
        const fieldId = input.dataset.fieldId;
        if (input.checked) {
          if (!state.selectedColumns.includes(fieldId)) state.selectedColumns.push(fieldId);
        } else {
          state.selectedColumns = state.selectedColumns.filter((id) => id !== fieldId);
        }
        renderOutputList();
      });
    });
  }

  function syncDetailCheckboxes() {
    document.querySelectorAll('#conditionDetailGroups input[type="checkbox"]').forEach((input) => {
      input.checked = state.selectedColumns.includes(input.dataset.fieldId);
    });
  }

  function renderOutputList() {
    const list = document.getElementById('conditionOutputList');
    if (!list) return;

    if (!state.selectedColumns.length) {
      list.innerHTML = '<p class="condition-output-empty">STEP 02에서 출력 항목을 선택하세요.</p>';
      return;
    }

    list.innerHTML = state.selectedColumns
      .map((fieldId, index) => {
        const meta = getFieldMeta(fieldId);
        if (!meta) return '';
        return `<li class="condition-output-item" draggable="true" data-field-id="${fieldId}">
          <div class="condition-output-item__main">
            <span class="condition-output-item__handle" aria-hidden="true">
              <img src="${ICONS.drag}" alt="" width="14" height="14">
            </span>
            <span class="condition-output-item__order">${index + 1}.</span>
            <span class="condition-output-item__label">${meta.label}</span>
          </div>
          <button type="button" class="condition-output-item__remove" data-remove-field="${fieldId}" aria-label="${meta.label} 제거">
            <img src="${ICONS.close}" alt="" width="10" height="10">
          </button>
        </li>`;
      })
      .join('');

    list.querySelectorAll('.condition-output-item').forEach((item) => {
      item.addEventListener('dragstart', () => {
        state.dragId = item.dataset.fieldId;
        item.classList.add('is-dragging');
      });
      item.addEventListener('dragend', () => {
        state.dragId = null;
        item.classList.remove('is-dragging');
      });
      item.addEventListener('dragover', (e) => e.preventDefault());
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetId = item.dataset.fieldId;
        if (!state.dragId || state.dragId === targetId) return;
        const from = state.selectedColumns.indexOf(state.dragId);
        const to = state.selectedColumns.indexOf(targetId);
        if (from < 0 || to < 0) return;
        state.selectedColumns.splice(from, 1);
        state.selectedColumns.splice(to, 0, state.dragId);
        renderOutputList();
        syncDetailCheckboxes();
      });
    });

    list.querySelectorAll('[data-remove-field]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedColumns = state.selectedColumns.filter((id) => id !== btn.dataset.removeField);
        renderOutputList();
        syncDetailCheckboxes();
      });
    });
  }

  function renderMultiConditionList() {
    const list = document.getElementById('multiConditionList');
    if (!list) return;

    if (!state.multiConditions.length) {
      list.innerHTML = '<p class="condition-multi__empty">위에서 검색조건을 선택하세요.</p>';
      return;
    }

    list.innerHTML = Object.keys(MULTI_FIELD_LABELS)
      .map((field) => {
        const values = state.multiConditions.filter((cond) => cond.field === field);
        if (!values.length) return '';
        const chips = values
          .map((cond) => `
            <span class="condition-multi-chip">
              <span class="condition-multi-chip__label">${cond.value}</span>
              <button type="button" class="condition-multi-chip__remove" data-remove-field="${cond.field}" data-remove-value="${cond.value}" aria-label="${MULTI_FIELD_LABELS[field]} ${cond.value} 조건 삭제">
                <img src="${ICONS.closeChip}" alt="" width="10" height="10">
              </button>
            </span>`)
          .join('');
        return `<div class="condition-multi-group">
          <span class="condition-multi-group__label">${MULTI_FIELD_LABELS[field]}</span>
          <div class="condition-multi-group__chips">${chips}</div>
        </div>`;
      })
      .join('');

    list.querySelectorAll('[data-remove-field]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.multiConditions = state.multiConditions.filter(
          (cond) => !(cond.field === btn.dataset.removeField && cond.value === btn.dataset.removeValue)
        );
        renderMultiConditionList();
      });
    });
  }

  function syncSelectValueClass(select) {
    if (!select) return;
    select.classList.toggle('has-value', Boolean(select.value));
  }

  function initSelectValueClasses() {
    document.querySelectorAll('.condition-field select').forEach((select) => {
      syncSelectValueClass(select);
      select.addEventListener('change', () => syncSelectValueClass(select));
    });
  }

  function initConditionSelectSync() {
    Object.entries(MULTI_FIELD_SOURCE_MAP).forEach(([field, selectId]) => {
      const select = document.getElementById(selectId);
      if (!select) return;
      select.addEventListener('change', () => {
        const value = select.value;
        if (!value) {
          syncSelectValueClass(select);
          return;
        }
        const exists = state.multiConditions.some((cond) => cond.field === field && cond.value === value);
        if (!exists) {
          state.multiConditions.push({ field, value });
          renderMultiConditionList();
        }
        select.value = '';
        syncSelectValueClass(select);
      });
    });
  }

  function collectQuery() {
    return {
      selectedColumns: [...state.selectedColumns],
      multiConditions: state.multiConditions.map((c) => ({ ...c })),
      filters: {
        agency: document.getElementById('filterAgency')?.value || '',
        port: document.getElementById('filterPort')?.value || '',
        subPort: document.getElementById('filterSubPort')?.value || '',
        facilityType: document.getElementById('filterFacilityType')?.value || '',
        classType: document.getElementById('filterClassType')?.value || '',
        yearFrom: document.getElementById('filterYearFrom')?.value || '',
        yearTo: document.getElementById('filterYearTo')?.value || '',
        seismic: document.getElementById('filterSeismic')?.value || '',
        grade: document.getElementById('filterGrade')?.value || '',
        name: document.getElementById('filterName')?.value.trim() || '',
      },
    };
  }

  function resetForm() {
    document.getElementById('conditionSearchForm')?.reset();
    state.selectedColumns = [...DEFAULT_SELECTED];
    state.multiConditions = [];
    document.querySelectorAll('.condition-field select').forEach(syncSelectValueClass);
    renderDetailCheckboxes();
    renderOutputList();
    renderMultiConditionList();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('conditionSearchForm')) return;

    renderDetailCheckboxes();
    renderOutputList();
    initSelectValueClasses();
    initConditionSelectSync();
    renderMultiConditionList();

    document.getElementById('conditionSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!state.selectedColumns.length) {
        alert('STEP 02에서 출력 항목을 하나 이상 선택하세요.');
        return;
      }
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(collectQuery()));
      } catch (_) {
        /* ignore quota */
      }
      window.location.href = 'facility-condition-result.html';
    });

    document.getElementById('conditionResetBtn')?.addEventListener('click', resetForm);

    document.querySelectorAll('.condition-range__picker').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.getAttribute('data-date-target') || '');
        if (!input) return;
        if (typeof input.showPicker === 'function') {
          try {
            input.showPicker();
            return;
          } catch (_) {
            /* fall through */
          }
        }
        input.focus();
        input.click();
      });
    });
  });
})();
