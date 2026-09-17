/**
 * 정밀진단 실적 — 정기안전점검표 모달
 */
(function () {
  const REPORT_CATEGORIES = [
    {
      name: '상부공 및 직립부',
      items: [
        { name: '침하', result: '양호', opinion: true, repair: 'Y', photos: 0 },
        { name: '경사/전도', result: '양호', opinion: true, repair: 'Y', photos: 0 },
        { name: '정수압', result: '양호', opinion: true, repair: 'Y', photos: 0 },
        { name: '표면 손상', result: '양호', opinion: true, repair: 'Y', photos: 0 },
        { name: '균열', result: '양호', opinion: true, repair: 'Y', photos: 0 },
        { name: '부식', result: '양호', opinion: true, repair: 'Y', photos: 0 },
        { name: '박락', result: '양호', opinion: true, repair: 'Y', photos: 0 },
        { name: '벌어짐', result: '양호', opinion: true, repair: 'Y', photos: 0 },
        { name: '침식/사석유실', result: '양호', opinion: true, repair: 'Y', photos: 0 },
      ],
    },
    {
      name: '사석 경사면',
      items: [
        { name: '경사변화', result: '양호', opinion: true, repair: 'Y', photos: 0 },
        { name: '사석유실', result: '양호', opinion: true, repair: 'Y', photos: 0 },
      ],
    },
  ];

  const REPORT_FOOTER = [
    { label: '점검일자', value: '2026-04-09' },
    { label: '특이사항', value: '-' },
    { label: '점검자의견', value: '-' },
  ];

  const REPORT_PHOTOS = [
    { src: 'assets/main/facility-search/detail/media-site-1.png', caption: '상부공 및 직립부', meta: '침하 · 양호' },
    { src: 'assets/main/facility-search/detail/media-site-2.png', caption: '상부공 및 직립부', meta: '경사/전도 · 양호' },
    { src: 'assets/main/facility-search/detail/media-section.png', caption: '사석 경사면', meta: '사석유실 · 양호' },
    { src: 'assets/main/facility-search/detail/media-location.png', caption: '전경', meta: '시설물 전경' },
  ];

  const RESULT_REPORT = {
    general: [
      ['대행/자체', '자체', '점검기간', '2026.03.03~2026.03.03'],
      ['용역명', '-', '대표자', '-'],
      ['관리주체명', '경상북도', '계약방법', '-'],
      ['공동수급', '-', '종류', '남방파제'],
      ['시설물 구분', '-', '준공일', '2007.01.01'],
      ['종별', '-', '안전등급', '-'],
      ['점검금액(천원)', '-', '시설물 규모', '-'],
      ['시설물 위치', '37394 경상북도', null, null],
    ],
    majorDefect: '-',
    publicDefect: '-',
    mainResult: '경사/전도에 주의가 필요하며, 전반적으로 보통 수준의 상태를 유지하고 있음',
    repairPlan: '주요 보수보강 내용',
    reference: '참고사항 내용',
    engineers: [
      { role: '책임기술자', name: '홍길동', period: '2024.05.11 ~ 2025.06.11', grade: '책임기술자' },
      { role: '참여기술자', name: '홍길동', period: '2024.05.11 ~ 2025.06.11', grade: '참여기술자' },
      { role: '참여기술자', name: '홍길동', period: '2024.05.11 ~ 2025.06.11', grade: '참여기술자' },
      { role: '참여기술자', name: '홍길동', period: '2024.05.11 ~ 2025.06.11', grade: '참여기술자' },
    ],
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getInfoTableValue(label) {
    const rows = document.querySelectorAll('#panel-general .info-table tbody tr');
    for (const row of rows) {
      const cells = row.querySelectorAll('th, td');
      for (let i = 0; i < cells.length - 1; i += 2) {
        if (cells[i].textContent.trim() === label) {
          return cells[i + 1].textContent.trim() || '-';
        }
      }
    }
    return '-';
  }

  function fillBasicInfo() {
    const facilityName = document.getElementById('precisionDetailFacilityName')?.textContent.trim()
      || document.getElementById('facilityName')?.textContent.trim()
      || '남방파제';
    const map = {
      precisionReportFacilityName: facilityName,
      precisionReportOwner: getInfoTableValue('관리구분'),
      precisionReportSurveyUnit: '-',
      precisionReportEvalUnit: '-',
      precisionReportCompletedDate: '2026.02.14',
      precisionReportLastInspectionDate: '2026.02.25',
    };

    Object.entries(map).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });

    const photoFacility = document.getElementById('precisionReportPhotoFacility');
    const photoOwner = document.getElementById('precisionReportPhotoOwner');
    if (photoFacility) photoFacility.textContent = facilityName;
    if (photoOwner) photoOwner.textContent = map.precisionReportOwner;
  }

  let isEditMode = false;
  let editingCategories = null;
  let editingFooter = null;
  let editingPhotos = null;
  let editingResultReport = null;

  function cloneCategories() {
    return REPORT_CATEGORIES.map((cat) => ({ ...cat, items: cat.items.map((it) => ({ ...it })) }));
  }

  function getActiveCategories() {
    return isEditMode && editingCategories ? editingCategories : REPORT_CATEGORIES;
  }

  function getActiveFooter() {
    return isEditMode && editingFooter ? editingFooter : REPORT_FOOTER;
  }

  function getActivePhotos() {
    return isEditMode && editingPhotos ? editingPhotos : REPORT_PHOTOS;
  }

  function getActiveResultReport() {
    return isEditMode && editingResultReport ? editingResultReport : RESULT_REPORT;
  }

  function clonePhotos() {
    return REPORT_PHOTOS.map((photo) => ({ ...photo }));
  }

  function cloneResultReport() {
    return {
      general: RESULT_REPORT.general.map((row) => [...row]),
      majorDefect: RESULT_REPORT.majorDefect,
      publicDefect: RESULT_REPORT.publicDefect,
      mainResult: RESULT_REPORT.mainResult,
      repairPlan: RESULT_REPORT.repairPlan,
      reference: RESULT_REPORT.reference,
      engineers: RESULT_REPORT.engineers.map((row) => ({ ...row })),
    };
  }

  const FMS_GENERAL_LABELS = new Set([
    '관리주체명',
    '종류',
    '시설물 구분',
    '종별',
    '준공일',
    '안전등급',
    '시설물 규모',
    '시설물 위치',
  ]);

  function isFmsGeneralLabel(label) {
    return FMS_GENERAL_LABELS.has(label);
  }

  function renderTextControl(value, attrString, source = 'poms') {
    const isPoms = source !== 'fms';
    if (!isEditMode || !isPoms) {
      return `<span class="precision-report-result__value is-${isPoms ? 'poms' : 'fms'}">${escapeHtml(value)}</span>`;
    }
    return `<input type="text" class="precision-report-edit-input is-poms" ${attrString} value="${escapeHtml(value)}">`;
  }

  function toDateInputValue(value) {
    const digits = String(value || '').replace(/\D/g, '');
    if (digits.length < 8) return '';
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }

  function formatDotDate(iso) {
    return iso ? String(iso).replace(/-/g, '.') : '';
  }

  function parsePeriod(value) {
    const parts = String(value || '').split(/\s*[~～]\s*/);
    return {
      start: toDateInputValue(parts[0]),
      end: toDateInputValue(parts[1] || ''),
    };
  }

  function renderDateControl(isoValue, attrString, displayValue) {
    const shown = displayValue != null ? displayValue : isoValue;
    return `<span class="precision-report-date">
      <span class="precision-report-date__text">${escapeHtml(shown || '')}</span>
      <input type="date" class="precision-report-edit-date" ${attrString} value="${escapeHtml(isoValue)}">
      <button type="button" class="precision-report-date__btn" aria-label="날짜 선택">
        <img src="assets/sms-send/icon-calendar.svg" alt="" width="16" height="16">
      </button>
    </span>`;
  }

  function renderPeriodControl(value, startAttrs, endAttrs, tight) {
    const period = parsePeriod(value);
    return `<span class="precision-report-period${tight ? ' is-tight' : ''}">
      ${renderDateControl(period.start, startAttrs, formatDotDate(period.start))}
      <span class="precision-report-period__sep">~</span>
      ${renderDateControl(period.end, endAttrs, formatDotDate(period.end))}
    </span>`;
  }

  function syncDateText(input) {
    const text = input.closest('.precision-report-date')?.querySelector('.precision-report-date__text');
    if (!text) return;
    text.textContent = input.closest('.precision-report-period')
      ? formatDotDate(input.value)
      : input.value;
  }

  function bindDatePickerButtons(root) {
    root?.querySelectorAll('.precision-report-date__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement?.querySelector('input[type="date"]');
        if (!input) return;
        if (typeof input.showPicker === 'function') input.showPicker();
        else input.focus();
      });
    });

    root?.querySelectorAll('input.precision-report-edit-date').forEach((input) => {
      input.addEventListener('change', () => syncDateText(input));
      input.addEventListener('input', () => syncDateText(input));
    });
  }

  function joinPeriod(startIso, endIso, tight) {
    const start = formatDotDate(startIso);
    const end = formatDotDate(endIso);
    if (!start && !end) return '';
    if (!end) return start;
    return tight ? `${start}~${end}` : `${start} ~ ${end}`;
  }

  function renderOpinionCell(hasOpinion) {
    if (!hasOpinion) return '-';
    return '<button type="button" class="precision-report-opinion-link">의견</button>';
  }

  function renderResultCell(item, catIndex, itemIndex, value) {
    if (!isEditMode) {
      return `<td class="precision-report-items-table__repair">${item.result === value ? 'O' : ''}</td>`;
    }
    const name = `report-result-${catIndex}-${itemIndex}`;
    const checked = item.result === value ? 'checked' : '';
    return `<td class="precision-report-items-table__repair">
      <input type="radio" name="${name}" value="${escapeHtml(value)}" ${checked} data-cat="${catIndex}" data-item="${itemIndex}" data-field="result" aria-label="${escapeHtml(value)}">
    </td>`;
  }

  function renderRepairCell(item, catIndex, itemIndex) {
    if (!isEditMode) {
      return `<td class="precision-report-items-table__repair">${escapeHtml(item.repair)}</td>`;
    }
    return `<td class="precision-report-items-table__repair">
      <select class="precision-report-edit-select" data-cat="${catIndex}" data-item="${itemIndex}" data-field="repair" aria-label="보수 필요여부">
        <option value="Y" ${item.repair === 'Y' ? 'selected' : ''}>Y</option>
        <option value="N" ${item.repair === 'N' ? 'selected' : ''}>N</option>
      </select>
    </td>`;
  }

  function renderItemsTable() {
    const tbody = document.getElementById('precisionReportItemsBody');
    if (!tbody) return;

    const categories = getActiveCategories();

    const itemRows = categories.flatMap((category, catIndex) =>
      category.items.map((item, itemIndex) => {
        const groupCell =
          itemIndex === 0
            ? `<th scope="rowgroup" rowspan="${category.items.length}" class="precision-report-items-table__group">${escapeHtml(category.name)}</th>`
            : '';

        return `<tr>
          ${groupCell}
          <th scope="row" class="precision-report-items-table__item">${escapeHtml(item.name)}</th>
          ${renderResultCell(item, catIndex, itemIndex, '양호')}
          ${renderResultCell(item, catIndex, itemIndex, '보통')}
          ${renderResultCell(item, catIndex, itemIndex, '불량')}
          <td>${renderOpinionCell(item.opinion)}</td>
          ${renderRepairCell(item, catIndex, itemIndex)}
          <td>${escapeHtml(item.photos)}개</td>
        </tr>`;
      })
    );

    const footer = getActiveFooter();
    const footerRows = footer.map((row, footerIndex) => {
      let valueHtml = escapeHtml(row.value);
      if (isEditMode) {
        valueHtml =
          row.label === '점검일자'
            ? renderDateControl(toDateInputValue(row.value), `data-footer="${footerIndex}"`, row.value)
            : `<input type="text" class="precision-report-edit-input" data-footer="${footerIndex}" value="${escapeHtml(row.value)}">`;
      }
      return `<tr>
        <th scope="row" class="precision-report-items-table__footer-label">${escapeHtml(row.label)}</th>
        <td colspan="7" class="precision-report-items-table__footer-value">${valueHtml}</td>
      </tr>`;
    });

    tbody.innerHTML = itemRows.join('') + footerRows.join('');

    if (isEditMode) bindEditableItemEvents();
  }

  function bindEditableItemEvents() {
    const tbody = document.getElementById('precisionReportItemsBody');
    if (!tbody) return;

    tbody.querySelectorAll('[data-cat][data-item][data-field]').forEach((el) => {
      el.addEventListener('change', () => {
        const catIndex = Number(el.dataset.cat);
        const itemIndex = Number(el.dataset.item);
        const field = el.dataset.field;
        const target = editingCategories?.[catIndex]?.items?.[itemIndex];
        if (!target) return;
        target[field] = el.value;
      });
    });

    tbody.querySelectorAll('[data-footer]').forEach((el) => {
      const handler = () => {
        const footerIndex = Number(el.dataset.footer);
        const target = editingFooter?.[footerIndex];
        if (!target) return;
        target.value = el.value;
      };
      el.addEventListener('input', handler);
      el.addEventListener('change', handler);
    });

    bindDatePickerButtons(tbody);
  }

  function toggleReportEditUI() {
    document.getElementById('precisionReportEditBtn')?.toggleAttribute('hidden', isEditMode);
    document.getElementById('precisionReportSaveBtn')?.toggleAttribute('hidden', !isEditMode);
    document.getElementById('precisionReportCancelBtn')?.toggleAttribute('hidden', !isEditMode);
    document.getElementById('precisionReportDownloadBtn')?.toggleAttribute('hidden', isEditMode);
    document.getElementById('precisionReportModal')?.classList.toggle('is-editing', isEditMode);
  }

  function enterEditMode() {
    isEditMode = true;
    editingCategories = cloneCategories();
    editingFooter = REPORT_FOOTER.map((row) => ({ ...row }));
    editingPhotos = clonePhotos();
    editingResultReport = cloneResultReport();
    renderItemsTable();
    renderPhotos();
    renderResultReport();
    toggleReportEditUI();
  }

  function exitEditMode(commit) {
    if (commit) {
      if (editingCategories && editingFooter) {
        editingCategories.forEach((cat, i) => {
          if (REPORT_CATEGORIES[i]) REPORT_CATEGORIES[i].items = cat.items;
        });
        editingFooter.forEach((row, i) => {
          if (REPORT_FOOTER[i]) REPORT_FOOTER[i].value = row.value;
        });
      }
      if (editingPhotos) {
        REPORT_PHOTOS.splice(0, REPORT_PHOTOS.length, ...editingPhotos.map((photo) => ({ ...photo })));
      }
      if (editingResultReport) {
        RESULT_REPORT.general = editingResultReport.general.map((row) => [...row]);
        RESULT_REPORT.majorDefect = editingResultReport.majorDefect;
        RESULT_REPORT.publicDefect = editingResultReport.publicDefect;
        RESULT_REPORT.mainResult = editingResultReport.mainResult;
        RESULT_REPORT.repairPlan = editingResultReport.repairPlan;
        RESULT_REPORT.reference = editingResultReport.reference;
        RESULT_REPORT.engineers = editingResultReport.engineers.map((row) => ({ ...row }));
      }
    }
    isEditMode = false;
    editingCategories = null;
    editingFooter = null;
    editingPhotos = null;
    editingResultReport = null;
    renderItemsTable();
    renderPhotos();
    renderResultReport();
    toggleReportEditUI();
  }

  function renderGeneralValue(label, value, rowIndex, colIndex) {
    const source = isFmsGeneralLabel(label) ? 'fms' : 'poms';
    if (label === '점검기간' && isEditMode && source === 'poms') {
      return renderPeriodControl(
        value,
        `data-general-row="${rowIndex}" data-general-col="${colIndex}" data-period-part="start"`,
        `data-general-row="${rowIndex}" data-general-col="${colIndex}" data-period-part="end"`,
        true
      );
    }
    return renderTextControl(value, `data-general-row="${rowIndex}" data-general-col="${colIndex}"`, source);
  }

  function renderResultReportGridRows(rows) {
    return rows
      .map(([label1, value1, label2, value2], rowIndex) => {
        const source1 = isFmsGeneralLabel(label1) ? 'fms' : 'poms';
        if (label2 == null) {
          return `<tr>
            <th>${escapeHtml(label1)}</th>
            <td colspan="3" class="is-${source1}">${renderGeneralValue(label1, value1, rowIndex, 1)}</td>
          </tr>`;
        }
        const source2 = isFmsGeneralLabel(label2) ? 'fms' : 'poms';
        return `<tr>
          <th>${escapeHtml(label1)}</th>
          <td class="is-${source1}">${renderGeneralValue(label1, value1, rowIndex, 1)}</td>
          <th>${escapeHtml(label2)}</th>
          <td class="is-${source2}">${renderGeneralValue(label2, value2, rowIndex, 3)}</td>
        </tr>`;
      })
      .join('');
  }

  function renderPhotos() {
    const grid = document.getElementById('precisionReportPhotosGrid');
    if (!grid) return;

    const photos = getActivePhotos();
    const cards = photos.map((photo, index) => {
      if (!isEditMode) {
        return `<article class="precision-report-photo-card">
          <div class="precision-report-photo-card__frame">
            <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.caption)}">
          </div>
          <div class="precision-report-photo-card__body">
            <div class="precision-report-photo-card__caption">${escapeHtml(photo.caption)}</div>
            <div class="precision-report-photo-card__meta">${escapeHtml(photo.meta)}</div>
          </div>
        </article>`;
      }

      return `<article class="precision-report-photo-card is-editing">
        <div class="precision-report-photo-card__frame">
          ${photo.src
            ? `<img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.caption)}">`
            : '<span class="precision-report-photo-card__empty">사진 없음</span>'}
          <label class="precision-report-photo-card__replace">
            <input type="file" accept="image/*" hidden data-photo-file="${index}">
            변경
          </label>
          <button type="button" class="precision-report-photo-card__remove" data-photo-remove="${index}">삭제</button>
        </div>
        <div class="precision-report-photo-card__body">
          <input type="text" class="precision-report-edit-input" data-photo-index="${index}" data-photo-field="caption" value="${escapeHtml(photo.caption)}" aria-label="부위">
          <input type="text" class="precision-report-edit-input" data-photo-index="${index}" data-photo-field="meta" value="${escapeHtml(photo.meta)}" aria-label="항목">
        </div>
      </article>`;
    });

    if (isEditMode) {
      cards.push(`<button type="button" class="precision-report-photo-add" id="precisionReportPhotoAdd">
        <span aria-hidden="true">+</span>사진 추가
      </button>`);
    }

    grid.innerHTML = cards.join('');
    if (isEditMode) bindPhotoEditEvents();
  }

  function bindPhotoEditEvents() {
    const grid = document.getElementById('precisionReportPhotosGrid');
    if (!grid) return;

    grid.querySelectorAll('[data-photo-field]').forEach((input) => {
      input.addEventListener('input', () => {
        const index = Number(input.dataset.photoIndex);
        const field = input.dataset.photoField;
        if (!editingPhotos?.[index] || !field) return;
        editingPhotos[index][field] = input.value;
      });
    });

    grid.querySelectorAll('[data-photo-file]').forEach((input) => {
      input.addEventListener('change', () => {
        const file = input.files?.[0];
        const index = Number(input.dataset.photoFile);
        if (!file || !editingPhotos?.[index]) return;
        editingPhotos[index].src = URL.createObjectURL(file);
        renderPhotos();
      });
    });

    grid.querySelectorAll('[data-photo-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.photoRemove);
        if (!editingPhotos || Number.isNaN(index)) return;
        editingPhotos.splice(index, 1);
        renderPhotos();
      });
    });

    document.getElementById('precisionReportPhotoAdd')?.addEventListener('click', () => {
      const picker = document.createElement('input');
      picker.type = 'file';
      picker.accept = 'image/*';
      picker.addEventListener('change', () => {
        const file = picker.files?.[0];
        if (!file || !editingPhotos) return;
        editingPhotos.push({
          src: URL.createObjectURL(file),
          caption: '',
          meta: '',
        });
        renderPhotos();
      });
      picker.click();
    });
  }

  function bindResultReportEditEvents() {
    const panel = document.getElementById('precisionReportPanelReport');
    if (!panel || !editingResultReport) return;

    panel.querySelectorAll('[data-general-row]').forEach((input) => {
      if (input.dataset.periodPart) return;
      input.addEventListener('input', () => {
        const rowIndex = Number(input.dataset.generalRow);
        const colIndex = Number(input.dataset.generalCol);
        if (!editingResultReport.general[rowIndex]) return;
        editingResultReport.general[rowIndex][colIndex] = input.value;
      });
    });

    panel.querySelectorAll('[data-report-field]').forEach((input) => {
      input.addEventListener('input', () => {
        const field = input.dataset.reportField;
        if (!field) return;
        editingResultReport[field] = input.value;
      });
    });

    panel.querySelectorAll('[data-eng-field]').forEach((input) => {
      if (input.dataset.periodPart) return;
      input.addEventListener('input', () => {
        const index = Number(input.dataset.eng);
        const field = input.dataset.engField;
        if (!editingResultReport.engineers[index] || !field) return;
        editingResultReport.engineers[index][field] = input.value;
      });
    });

    panel.querySelectorAll('[data-period-part]').forEach((input) => {
      input.addEventListener('change', () => {
        const wrap = input.closest('.precision-report-period');
        const start = wrap?.querySelector('[data-period-part="start"]')?.value || '';
        const end = wrap?.querySelector('[data-period-part="end"]')?.value || '';
        const tight = wrap?.classList.contains('is-tight');
        const joined = joinPeriod(start, end, tight);

        if (input.dataset.generalRow != null) {
          const rowIndex = Number(input.dataset.generalRow);
          const colIndex = Number(input.dataset.generalCol);
          if (editingResultReport.general[rowIndex]) {
            editingResultReport.general[rowIndex][colIndex] = joined;
          }
          return;
        }

        if (input.dataset.engField === 'period') {
          const index = Number(input.dataset.eng);
          if (editingResultReport.engineers[index]) {
            editingResultReport.engineers[index].period = joined;
          }
        }
      });
    });

    bindDatePickerButtons(panel);

    panel.querySelectorAll('[data-remove-eng]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.removeEng);
        if (!editingResultReport.engineers[index]) return;
        editingResultReport.engineers.splice(index, 1);
        renderResultReport();
      });
    });
  }

  function renderResultReport() {
    const panel = document.getElementById('precisionReportPanelReport');
    if (!panel) return;

    const report = getActiveResultReport();
    const engineerRows = report.engineers.length
      ? report.engineers
          .map((row, index) => `<tr>
        <td class="is-poms">${renderTextControl(row.role, `data-eng="${index}" data-eng-field="role"`, 'poms')}</td>
        <td class="is-poms">${renderTextControl(row.name, `data-eng="${index}" data-eng-field="name"`, 'poms')}</td>
        <td class="is-poms">${
          isEditMode
            ? renderPeriodControl(
                row.period,
                `data-eng="${index}" data-eng-field="period" data-period-part="start"`,
                `data-eng="${index}" data-eng-field="period" data-period-part="end"`
              )
            : renderTextControl(row.period, `data-eng="${index}" data-eng-field="period"`, 'poms')
        }</td>
        <td class="is-poms">${renderTextControl(row.grade, `data-eng="${index}" data-eng-field="grade"`, 'poms')}</td>
        ${isEditMode ? `<td><button type="button" class="precision-report-result__tech-del" data-remove-eng="${index}">행 삭제</button></td>` : ''}
      </tr>`)
          .join('')
      : `<tr><td colspan="${isEditMode ? 5 : 4}">등록된 기술자가 없습니다.</td></tr>`;

    const referenceInner = isEditMode
      ? `<textarea class="precision-report-edit-textarea" data-report-field="reference">${escapeHtml(report.reference)}</textarea>`
      : escapeHtml(report.reference);

    panel.innerHTML = `
  <div class="precision-report-result">
    <div class="precision-report-modal__panel-hd">
      <div class="precision-report-modal__panel-title">가. 일반현황</div>
    </div>
    <div class="precision-report-modal__panel-bd">
      <div class="precision-report-result__general-wrap">
        <table class="precision-report-result__general">
          <colgroup>
            <col class="col-lbl">
            <col class="col-val">
            <col class="col-lbl">
            <col class="col-val">
          </colgroup>
          <tbody>
            ${renderResultReportGridRows(report.general)}
          </tbody>
        </table>
      </div>

      <section class="precision-report-result__section">
        <div class="precision-report-modal__panel-title">나. 점검 실시결과 현황</div>
        <div class="precision-report-result__outcome">
          <div class="precision-report-result__group">중대한 결함 등</div>
          <div class="precision-report-result__olbl">중대한 결함</div>
          <div class="precision-report-result__ofield is-poms">${renderTextControl(report.majorDefect, 'data-report-field="majorDefect"', 'poms')}</div>
          <div class="precision-report-result__olbl">공중이 이용하는 부위에 결함</div>
          <div class="precision-report-result__ofield is-poms">${renderTextControl(report.publicDefect, 'data-report-field="publicDefect"', 'poms')}</div>
          <div class="precision-report-result__olbl precision-report-result__olbl--wide">주요 점검 결과</div>
          <div class="precision-report-result__ofield precision-report-result__ofield--wide is-poms">${renderTextControl(report.mainResult, 'data-report-field="mainResult"', 'poms')}</div>
          <div class="precision-report-result__olbl precision-report-result__olbl--wide">주요 보수보강 계획</div>
          <div class="precision-report-result__ofield precision-report-result__ofield--wide is-poms">${renderTextControl(report.repairPlan, 'data-report-field="repairPlan"', 'poms')}</div>
        </div>
      </section>

      <section class="precision-report-result__section">
        <div class="precision-report-modal__panel-title">다. 책임(참여)기술자 현황</div>
        <div class="precision-report-result__tech-wrap">
          <table class="precision-report-result__tech">
            <thead>
              <tr>
                <th>구분</th>
                <th>성명</th>
                <th>과업 참여기간</th>
                <th>기술등급</th>
                ${isEditMode ? '<th></th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${engineerRows}
            </tbody>
          </table>
        </div>
      </section>

      <section class="precision-report-result__section">
        <div class="precision-report-modal__panel-title">라. 참고사항</div>
        <div class="precision-report-result__ref is-poms">${referenceInner}</div>
      </section>
    </div>
  </div>`;

    if (isEditMode) bindResultReportEditEvents();
  }

  function setReportTab(tabId) {
    const tabs = document.querySelectorAll('[data-report-tab]');
    const panels = {
      items: document.getElementById('precisionReportPanelItems'),
      photos: document.getElementById('precisionReportPanelPhotos'),
      report: document.getElementById('precisionReportPanelReport'),
    };

    tabs.forEach((tab) => {
      const active = tab.dataset.reportTab === tabId;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    Object.entries(panels).forEach(([key, panel]) => {
      if (!panel) return;
      const active = key === tabId;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  }

  function lockReportModalToItemsSize() {
    const panel = document.querySelector('#precisionReportModal .precision-report-modal__panel');
    if (!panel) return;
    panel.style.height = 'auto';
    const height = Math.ceil(panel.getBoundingClientRect().height);
    if (height > 0) panel.style.height = `${height}px`;
  }

  function unlockReportModalSize() {
    const panel = document.querySelector('#precisionReportModal .precision-report-modal__panel');
    if (panel) panel.style.height = '';
  }

  function openReportModal() {
    const modal = document.getElementById('precisionReportModal');
    if (!modal) return;

    isEditMode = false;
    editingCategories = null;
    editingFooter = null;
    editingPhotos = null;
    editingResultReport = null;

    fillBasicInfo();
    renderItemsTable();
    renderPhotos();
    renderResultReport();
    toggleReportEditUI();
    unlockReportModalSize();
    setReportTab('items');
    modal.hidden = false;
    document.body.classList.add('precision-report-modal-open');
    requestAnimationFrame(() => {
      requestAnimationFrame(lockReportModalToItemsSize);
    });
  }

  function closeReportModal() {
    const modal = document.getElementById('precisionReportModal');
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    unlockReportModalSize();
    document.body.classList.remove('precision-report-modal-open');
  }

  function init() {
    const reportBtn = document.getElementById('precisionReportBtn');
    if (!reportBtn) return;

    reportBtn.addEventListener('click', openReportModal);

    document.querySelectorAll('[data-close-report-modal]').forEach((el) => {
      el.addEventListener('click', closeReportModal);
    });

    document.querySelectorAll('[data-report-tab]').forEach((tab) => {
      tab.addEventListener('click', () => setReportTab(tab.dataset.reportTab));
    });

    document.getElementById('precisionReportDownloadBtn')?.addEventListener('click', () => {
      alert('보고서 다운로드 (샘플)');
    });

    document.getElementById('precisionReportEditBtn')?.addEventListener('click', () => {
      enterEditMode();
    });

    document.getElementById('precisionReportSaveBtn')?.addEventListener('click', () => {
      exitEditMode(true);
      alert('정기안전점검표가 저장되었습니다. (샘플)');
    });

    document.getElementById('precisionReportCancelBtn')?.addEventListener('click', () => {
      exitEditMode(false);
    });

    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('precisionReportModal');
      if (e.key !== 'Escape' || !modal || modal.hidden) return;
      if (isEditMode) {
        exitEditMode(false);
        return;
      }
      closeReportModal();
    });
  }

  window.openPrecisionReportModal = openReportModal;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
