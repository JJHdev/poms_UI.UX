/**
 * 통계처리 업로드 흐름
 */
(() => {
  const work = document.getElementById('statsWork');
  const excelFile = document.getElementById('statsExcelFile');
  const excelBtn = document.getElementById('statsExcelBtn');
  const excelName = document.getElementById('statsExcelName');
  const upload = document.getElementById('statsUpload');
  const result = document.getElementById('statsResult');

  function setResult(message, type = 'info') {
    if (!result) return;
    result.className = `dp-result-box dp-result-box--${type}`;
    result.textContent = message;
  }

  function fileLabel() {
    if (!excelName) return;
    const file = excelFile?.files?.[0];
    excelName.textContent = file ? file.name : '선택된 파일 없음';
  }

  function setExcelEnabled(enabled) {
    if (excelFile) excelFile.disabled = !enabled;
    if (excelBtn) excelBtn.disabled = !enabled;
  }

  function validateExcel() {
    const value = excelFile?.value.toLowerCase() || '';
    if (!value) return true;
    if (!value.endsWith('.xlsx')) {
      excelFile.value = '';
      fileLabel();
      setResult('엑셀파일은 .xlsx 파일만 선택할 수 있습니다.', 'warn');
      return false;
    }
    return true;
  }

  excelBtn?.addEventListener('click', () => {
    if (!excelFile?.disabled) excelFile.click();
  });

  work?.addEventListener('change', () => {
    if (excelFile) {
      excelFile.value = '';
      fileLabel();
    }
    setExcelEnabled(Boolean(work.value));

    if (!work.value) {
      setResult('작업구분을 선택하세요.');
      return;
    }

    setResult(`${work.selectedOptions[0].textContent} 통계처리에 사용할 엑셀파일을 선택하세요.`);
  });

  excelFile?.addEventListener('change', () => {
    if (validateExcel()) {
      fileLabel();
      setResult('엑셀파일이 선택되었습니다.');
    }
  });

  upload?.addEventListener('click', () => {
    if (!work?.value) {
      setResult('작업구분을 선택해 주세요.', 'warn');
      return;
    }
    if (!excelFile?.value) {
      setResult('엑셀파일을 선택해 주세요.', 'warn');
      return;
    }

    setResult('파일 업로드 후 서버에서 반환한 처리결과가 이 영역에 표시됩니다.', 'success');
  });

  setResult('작업구분을 선택하고 엑셀파일을 업로드하면 처리결과가 표시됩니다.');
  PomsSidebar.mount('#sidebar-root', { active: 'stats-process' });
})();
