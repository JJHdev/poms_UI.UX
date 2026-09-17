(() => {
  function escapeCsvValue(value) {
    const text = String(value ?? '');
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function downloadCsvFile(fileLabel, headers, lines) {
    const csv = `\uFEFF${headers.map(escapeCsvValue).join(',')}\n${lines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `${fileLabel}_${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadAccessControlExcel(rows) {
    const headers = [
      '\uC5F0\uBC88', '\uAD00\uB9AC\uC8FC\uCCB4', '\uD56D', '\uC138\uBD80\uD56D', '\uC2DC\uC124\uBB3C\uBA85', '\uC885\uAD6C\uBD84', '\uC548\uC804\uB4F1\uAE09',
      '\uC0C1\uBC18\uAE30', '\uD558\uBC18\uAE30', '\uC810\uAC80\uD69F\uC218', '\uC9C0\uC815\uC0AC\uC720', '\uC9C0\uC815\uC77C',
    ];
    const lines = rows.map((row, i) => [
      i + 1,
      row.agency,
      row.port,
      row.subPort,
      row.name,
      row.kindType,
      row.grade,
      row.inspectionFirstHalf,
      row.inspectionSecondHalf,
      row.inspectionCount,
      row.reason,
      row.designatedAt,
    ].map(escapeCsvValue).join(','));
    downloadCsvFile('\uD2B9\uBCC4\uAD00\uB9AC\uC2DC\uC124_\uCD9C\uC785\uD1B5\uC81C\uAD6C\uC5ED', headers, lines);
  }

  function syncExcelButton(tabValue) {
    const excelBtn = document.getElementById('specialFacilityExcelBtn');
    const side = document.querySelector('.special-results__side');
    const show = tabValue === 'seismic';

    if (excelBtn) {
      excelBtn.hidden = !show;
      excelBtn.style.display = show ? '' : 'none';
    }
    if (side) {
      side.hidden = !show;
      side.style.display = show ? 'flex' : 'none';
    }
  }

  function init() {
    SPECIAL_FACILITY_PAGE_CONFIG.onRowDblClick = () => {
      location.href = 'facility-detail.html?id=south';
    };

    SPECIAL_FACILITY_PAGE_CONFIG.onReady = (api, state) => {
      const excelBtn = document.getElementById('specialFacilityExcelBtn');

      syncExcelButton(state.tabValue);

      document.querySelectorAll('[data-system-tab]').forEach((tab) => {
        tab.addEventListener('click', () => {
          // SystemListPage updates tabValue in its own click handler first
          setTimeout(() => {
            syncExcelButton(state.tabValue);
            api?.invalidateMap?.();
          }, 0);
        });
      });

      excelBtn?.addEventListener('click', () => {
        if (state.tabValue !== 'seismic') return;
        downloadAccessControlExcel(state.filtered);
      });

      requestAnimationFrame(() => api?.invalidateMap?.());
    };

    SystemListPage.init(SPECIAL_FACILITY_PAGE_CONFIG);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();