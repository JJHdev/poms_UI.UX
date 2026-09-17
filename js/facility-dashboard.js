/**
 * 홈 대시보드: 시설 유형 선택 → 안전등급 행 막대·도넛·범례 갱신
 */
(function () {
  const DATA = {
    type1: {
      shortTitle: '1종 시설물',
      total: 332,
      grades: { a: 82, b: 118, c: 92, d: 32, e: 8 },
    },
    type2: {
      shortTitle: '2종 시설물',
      total: 332,
      grades: { a: 113, b: 120, c: 70, d: 22, e: 7 },
    },
    type3: {
      shortTitle: '3종 시설물',
      total: 332,
      grades: { a: 82, b: 111, c: 84, d: 43, e: 12 },
    },
    other: {
      shortTitle: '기타 시설물',
      total: 332,
      grades: { a: 113, b: 109, c: 72, d: 30, e: 8 },
    },
    all: {
      shortTitle: '전체',
      total: 1636,
      grades: { a: 245, b: 523, c: 312, d: 45, e: 12 },
      /** 목업과 동일한 표시용 비율(분모 1,636) */
      pctDisplay: { a: '15.0', b: '32.0', c: '19.1', d: '2.7', e: '0.7' },
    },
  };

  const GRADE_KEYS = /** @type {const} */ (['a', 'b', 'c', 'd', 'e']);
  const GRADE_LABEL = { a: 'A등급', b: 'B등급', c: 'C등급', d: 'D등급', e: 'E등급' };
  const GRADE_SUB = { a: '양호', b: '보통', c: '주의', d: '심각', e: '위험' };
  const DONUT_COL = { a: '#1c6fff', b: '#00cfe6', c: '#00d941', d: '#ffca1c', e: '#de0000' };

  function pctOfTotal(count, facilityTotal) {
    if (!facilityTotal) return 0;
    return Math.round((count / facilityTotal) * 1000) / 10;
  }

  function sumGrades(grades) {
    return GRADE_KEYS.reduce((s, k) => s + (grades[k] ?? 0), 0);
  }

  function updateGradeRows(container, grades, facilityTotal, pctOverride) {
    if (!container) return;
    container.innerHTML = '';
    GRADE_KEYS.forEach((k, index) => {
      const n = grades[k] ?? 0;
      const p =
        pctOverride?.[k] != null
          ? parseFloat(pctOverride[k], 10)
          : pctOfTotal(n, facilityTotal);
      const pStr = pctOverride?.[k] != null ? pctOverride[k] : p.toFixed(1);
      const barPct = Math.min(100, Math.max(0, p));

      const row = document.createElement('div');
      row.className = `dash-grade-row dash-grade-row--${k}`;
      row.setAttribute('role', 'listitem');
      row.innerHTML = `
        <div class="dash-grade-row__head">
          <div class="dash-grade-row__left">
            <span class="dash-grade-row__name">${GRADE_LABEL[k]}</span>
            <span class="dash-grade-row__badge dash-grade-row__badge--${k}">${GRADE_SUB[k]}</span>
          </div>
          <div class="dash-grade-row__meta">
            <span class="dash-grade-row__count">${n.toLocaleString('ko-KR')}</span>
            <span class="dash-grade-row__pct">(${pStr}%)</span>
          </div>
        </div>
        <div class="dash-grade-row__track" aria-hidden="true">
          <span class="dash-grade-row__fill dash-grade-row__fill--${k}" style="width:${barPct}%"></span>
        </div>`;
      container.appendChild(row);

      if (index < GRADE_KEYS.length - 1) {
        const divider = document.createElement('div');
        divider.className = 'dash-grade-row__divider';
        divider.setAttribute('aria-hidden', 'true');
        container.appendChild(divider);
      }
    });
  }

  function updateDonut(grades, facilityTotal, pctOverride) {
    const ring = document.getElementById('dash-donut-ring');
    const totalEl = document.getElementById('dash-donut-total');
    const legend = document.getElementById('dash-donut-legend');
    if (totalEl) totalEl.textContent = facilityTotal.toLocaleString('ko-KR');

    const totalGrades = sumGrades(grades);
    if (ring) {
      if (!totalGrades) {
        ring.style.background = '#e5e7eb';
      } else {
        let angle = 0;
        const stops = [];
        GRADE_KEYS.forEach((k) => {
          const n = grades[k] ?? 0;
          const slice = (n / totalGrades) * 360;
          if (slice <= 0) return;
          const col = DONUT_COL[k];
          stops.push(`${col} ${angle}deg ${angle + slice}deg`);
          angle += slice;
        });
        ring.style.background =
          stops.length > 0 ? `conic-gradient(from -90deg, ${stops.join(', ')})` : '#e5e7eb';
      }
    }

    if (legend) {
      legend.innerHTML = '';
      GRADE_KEYS.forEach((k) => {
        const n = grades[k] ?? 0;
        const pNum =
          pctOverride?.[k] != null ? parseFloat(pctOverride[k], 10) : pctOfTotal(n, facilityTotal);
        const pLabel = pctOverride?.[k] != null ? pctOverride[k] : pNum.toFixed(1);
        const li = document.createElement('li');
        li.innerHTML = `<span class="dash-donut-legend__dot dash-donut-legend__dot--${k}"></span>
          <span class="dash-donut-legend__name">${GRADE_LABEL[k]} <em>(${pLabel}%)</em></span>
          <span class="dash-donut-legend__count">${n.toLocaleString('ko-KR')}</span>`;
        legend.appendChild(li);
      });
    }
  }

  function applyBundle(bundle) {
    const rows = document.getElementById('dash-grade-rows');
    const scope = document.getElementById('safety-panel-scope');
    if (scope) {
      scope.textContent = `${bundle.shortTitle} ${bundle.total.toLocaleString('ko-KR')} 개소`;
    }
    const pctOvr = bundle.pctDisplay;
    updateGradeRows(rows, bundle.grades, bundle.total, pctOvr);
    updateDonut(bundle.grades, bundle.total, pctOvr);
  }

  function setActive(btn, group) {
    group.querySelectorAll('.facility-type-btn').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function tickClock() {
    const el = document.getElementById('dash-clock');
    if (!el) return;
    const d = new Date();
    const wk = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    el.textContent = `${y}.${mo}.${day} (${wk}) ${h}:${mi}`;
    el.setAttribute('datetime', d.toISOString());
  }

  function rowTotal(row) {
    return (row.national ?? 0) + (row.local ?? 0) + (row.port ?? 0);
  }

  function renderFacilityInfoTable() {
    const tbody = document.getElementById('facility-info-modal-tbody');
    if (!tbody || typeof FACILITY_INFO_MODAL_DATA === 'undefined') return;

    const data = FACILITY_INFO_MODAL_DATA;
    tbody.innerHTML = '';

    data.categories.forEach((category) => {
      const dataRows = category.rows.filter((row) => !row.isSubtotal);
      const subtotalRow = category.rows.find((row) => row.isSubtotal);

      dataRows.forEach((row, index) => {
        const tr = document.createElement('tr');
        const kindCell =
          index === 0
            ? `<th scope="rowgroup" rowspan="${dataRows.length}">${category.kind}</th>`
            : '';
        tr.innerHTML = `
          ${kindCell}
          <td>${row.facilityType}</td>
          <td>${rowTotal(row).toLocaleString('ko-KR')}</td>
          <td>${(row.national ?? 0).toLocaleString('ko-KR')}</td>
          <td>${(row.local ?? 0).toLocaleString('ko-KR')}</td>
          <td>${(row.port ?? 0).toLocaleString('ko-KR')}</td>`;
        tbody.appendChild(tr);
      });

      if (subtotalRow) {
        const tr = document.createElement('tr');
        tr.className = 'dash-facility-info-table__subtotal';
        tr.innerHTML = `
          <td></td>
          <td>${subtotalRow.facilityType}</td>
          <td>${rowTotal(subtotalRow).toLocaleString('ko-KR')}</td>
          <td>${(subtotalRow.national ?? 0).toLocaleString('ko-KR')}</td>
          <td>${(subtotalRow.local ?? 0).toLocaleString('ko-KR')}</td>
          <td>${(subtotalRow.port ?? 0).toLocaleString('ko-KR')}</td>`;
        tbody.appendChild(tr);
      }
    });

    const total = data.grandTotal;
    const totalRow = document.createElement('tr');
    totalRow.className = 'dash-facility-info-table__grand-total';
    totalRow.innerHTML = `
      <th scope="row" colspan="2">총계</th>
      <td>${(total.total ?? 0).toLocaleString('ko-KR')}</td>
      <td>${(total.national ?? 0).toLocaleString('ko-KR')}</td>
      <td>${(total.local ?? 0).toLocaleString('ko-KR')}</td>
      <td>${(total.port ?? 0).toLocaleString('ko-KR')}</td>`;
    tbody.appendChild(totalRow);
  }

  function openFacilityInfoModal() {
    const modal = document.getElementById('facility-info-modal');
    if (!modal) return;
    renderFacilityInfoTable();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('dash-facility-modal-open');
    modal.querySelector('.dash-facility-modal__close')?.focus();
  }

  function closeFacilityInfoModal() {
    const modal = document.getElementById('facility-info-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('dash-facility-modal-open');
  }

  function initFacilityInfoModal() {
    const modal = document.getElementById('facility-info-modal');
    if (!modal) return;

    modal.querySelectorAll('[data-close-facility-info-modal]').forEach((el) => {
      el.addEventListener('click', closeFacilityInfoModal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeFacilityInfoModal();
      }
    });

    const title = document.getElementById('facility-info-modal-title');
    if (title && typeof FACILITY_INFO_MODAL_DATA !== 'undefined') {
      title.textContent = `시설물정보 (${FACILITY_INFO_MODAL_DATA.baseDate} 기준)`;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const group = document.getElementById('facility-type-group');
    if (group) {
      group.querySelectorAll('.facility-type-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.facilityType;
          const bundle = DATA[key];
           if (!bundle) return;
          setActive(btn, group);
          applyBundle(bundle);
        });
      });

      const defaultBtn =
        group.querySelector('.facility-type-btn.is-active') || group.querySelector('.facility-type-btn');
      if (defaultBtn) {
        const key = defaultBtn.dataset.facilityType;
        const bundle = DATA[key];
        if (bundle) {
          setActive(defaultBtn, group);
          applyBundle(bundle);
        }
      }
    }

    tickClock();
    window.setInterval(tickClock, 30000);
    initFacilityInfoModal();

    const inspectTabBtns = document.querySelectorAll('[data-inspect-tab]');
    const inspectPanels = document.querySelectorAll('.dash-inspect-panel__body[role="tabpanel"]');
    inspectTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-inspect-tab');
        inspectTabBtns.forEach((b) => {
          const on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        inspectPanels.forEach((panel) => {
          const on = panel.id === `dash-inspect-panel-${key}`;
          panel.classList.toggle('is-active', on);
          panel.hidden = !on;
        });
      });
    });

  });
})();
