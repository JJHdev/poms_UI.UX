/**
 * 시설물 상세 — 대가산정
 * 서브탭 전환 + 조정율/추가조사비 행 추가·삭제를 담당한다.
 */
(function () {
  function initSubtabs() {
    const tabs = document.querySelectorAll('.calc-subtabs__btn');
    const panels = document.querySelectorAll('.calc-subpanel');
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.subtab;

        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        panels.forEach((panel) => {
          const isTarget = panel.id === `calc-${target}`;
          panel.classList.toggle('is-active', isTarget);
          panel.hidden = !isTarget;
        });
      });
    });
  }

  function bindRowDelete(container) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.calc-row-delete');
      if (!btn) return;
      const row = btn.closest('tr');
      const tbody = row?.parentElement;
      if (row && tbody && tbody.children.length > 1) {
        row.remove();
      }
    });
  }

  function initAdjustTable() {
    const table = document.getElementById('calcAdjustTable');
    const body = document.getElementById('calcAdjustBody');
    const addBtn = document.getElementById('calcAdjustAddBtn');
    if (!table || !body || !addBtn) return;

    bindRowDelete(body);

    addBtn.addEventListener('click', () => {
      const templateRow = body.querySelector('tr');
      if (!templateRow) return;
      const newRow = templateRow.cloneNode(true);
      newRow.querySelectorAll('input').forEach((input) => {
        input.value = '';
        if (input.placeholder === '0') input.placeholder = '0';
      });
      newRow.querySelectorAll('select').forEach((select) => { select.selectedIndex = 0; });
      body.appendChild(newRow);
    });
  }

  function initSurveyTable() {
    const body = document.getElementById('calcSurveyBody');
    const addBtn = document.getElementById('calcSurveyAddBtn');
    if (!body || !addBtn) return;

    bindRowDelete(body);

    addBtn.addEventListener('click', () => {
      const templateRow = body.querySelector('tr');
      if (!templateRow) return;
      const newRow = templateRow.cloneNode(true);
      newRow.querySelectorAll('input').forEach((input) => { input.value = ''; });
      body.appendChild(newRow);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('panel-calculrate')) return;

    initSubtabs();
    initAdjustTable();
    initSurveyTable();
  });
})();
