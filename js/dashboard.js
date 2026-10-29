document.addEventListener('DOMContentLoaded', () => {
  const tabList = document.querySelector('.tabs');
  if (tabList) {
    const tabs = tabList.querySelectorAll('.tabs__btn');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
      });
    });
  }

  const boardTabs = document.getElementById('dash-board-tabs');
  if (!boardTabs) return;

  const tabButtons = boardTabs.querySelectorAll('.dash-tab-board__tab');
  const panels = boardTabs.querySelectorAll('.dash-tab-board__panel');
  const moreLink = document.getElementById('dash-tab-board-more');
  const moreUrls = {
    notice: 'archive-board.html',
    maint: 'archive-safety-materials.html',
  };

  function activateBoardTab(tabId) {
    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === tabId;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      const isActive = panel.id === `dash-panel-${tabId}`;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });

    if (moreLink && moreUrls[tabId]) {
      moreLink.href = moreUrls[tabId];
    }
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activateBoardTab(btn.dataset.tab);
    });
  });
});
