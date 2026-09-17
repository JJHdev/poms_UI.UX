document.addEventListener('DOMContentLoaded', () => {
  
  const tabs = document.querySelectorAll('.detail-tabs__btn');
  const panels = document.querySelectorAll('.detail-tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach((panel) => {
        const isTarget = panel.id === `panel-${target}`;
        panel.classList.toggle('is-active', isTarget);
        panel.hidden = !isTarget;
      });
    });
  });

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const facilities = {
    south: { name: '남방파제', location: '부산광역시 중구 항만로 · 부산항 북항' },
    gamman: { name: '감만부두 동측안벽', location: '부산광역시 중구 · 부산항 북항' },
    sinseondae: { name: '신선대부두', location: '부산광역시 중구 · 부산항 북항' },
    north: { name: '북방파제', location: '부산광역시 중구 항만로 · 부산항 북항' },
  };

  if (id && facilities[id]) {
    const data = facilities[id];
    const titleEl = document.getElementById('facilityName');
    const locationEl = document.querySelector('.facility-summary__location');
    if (titleEl) titleEl.textContent = data.name;
    if (locationEl) locationEl.textContent = data.location;
    document.title = `${data.name} | 시설물 상세정보 | POMS`;

    document.querySelectorAll('.info-field__value[data-field="name"], .info-table td[data-field="name"]').forEach((el) => {
      el.textContent = data.name;
    });
    const nameCell = document.querySelector('#panel-general .info-table td');
    if (nameCell && !nameCell.hasAttribute('data-field')) nameCell.textContent = data.name;
  }

  const initialTab = params.get('tab');
  if (initialTab) {
    const targetTab = document.querySelector(`.detail-tabs__btn[data-tab="${initialTab}"]`);
    if (targetTab) targetTab.click();
  }
});


