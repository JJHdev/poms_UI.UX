/**
 * 자료처리 업로드 흐름
 */
(() => {
  const template = document.getElementById('processTemplate');
  const excelFile = document.getElementById('processExcelFile');
  const attachFile = document.getElementById('processAttachFile');
  const excelBtn = document.getElementById('processExcelBtn');
  const attachBtn = document.getElementById('processAttachBtn');
  const excelName = document.getElementById('processExcelName');
  const attachName = document.getElementById('processAttachName');
  const download = document.getElementById('processTemplateDownload');
  const upload = document.getElementById('processUpload');
  const result = document.getElementById('processResult');

  const templates = [
    { value: 'E20', label: '시설물 일반정보', kind: 'excel' },
    { value: 'E21', label: '정기안전점검', kind: 'excel' },
    { value: 'E22', label: '안전시설현황', kind: 'excel' },
  ];

  function setResult(message, type = 'info') {
    if (!result) return;
    result.className = `dp-result-box dp-result-box--${type}`;
    result.textContent = message;
  }

  function fileLabel(input, nameEl) {
    if (!nameEl) return;
    const file = input?.files?.[0];
    nameEl.textContent = file ? file.name : '선택된 파일 없음';
  }

  function setFileEnabled(input, btn, enabled) {
    if (input) input.disabled = !enabled;
    if (btn) btn.disabled = !enabled;
  }

  function resetFiles() {
    if (excelFile) {
      excelFile.value = '';
      fileLabel(excelFile, excelName);
    }
    if (attachFile) {
      attachFile.value = '';
      fileLabel(attachFile, attachName);
    }
    setFileEnabled(excelFile, excelBtn, false);
    setFileEnabled(attachFile, attachBtn, false);
    if (download) download.disabled = true;
  }

  function populateTemplates() {
    if (!template) return;
    template.innerHTML = '<option value="">선택</option>';
    templates.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      option.dataset.kind = item.kind;
      template.append(option);
    });
    template.disabled = false;
  }

  function selectedTemplateKind() {
    return template?.selectedOptions[0]?.dataset.kind || '';
  }

  function validateExtension(input, nameEl, allowedExt, label) {
    const value = input.value.toLowerCase();
    if (!value) return true;
    if (!value.endsWith(allowedExt)) {
      input.value = '';
      fileLabel(input, nameEl);
      setResult(`${label}은 ${allowedExt} 파일만 선택할 수 있습니다.`, 'warn');
      return false;
    }
    return true;
  }

  excelBtn?.addEventListener('click', () => {
    if (!excelFile?.disabled) excelFile.click();
  });

  attachBtn?.addEventListener('click', () => {
    if (!attachFile?.disabled) attachFile.click();
  });

  // 양식구분 선택 시 파일 영역 활성화
  populateTemplates();
  setResult('작업구분과 양식구분을 선택하고 파일을 업로드하면 처리결과가 표시됩니다.');

  template?.addEventListener('change', () => {
    resetFiles();
    const kind = selectedTemplateKind();
    if (!kind) {
      setResult('양식구분을 선택하세요.');
      return;
    }

    setFileEnabled(excelFile, excelBtn, true);
    setFileEnabled(attachFile, attachBtn, kind === 'file');
    if (download) download.disabled = false;
    setResult('양식을 내려받아 작성한 뒤 파일을 선택하세요.');
  });

  excelFile?.addEventListener('change', () => {
    if (validateExtension(excelFile, excelName, '.xlsx', '엑셀파일')) {
      fileLabel(excelFile, excelName);
      setResult('엑셀파일이 선택되었습니다.');
    }
  });

  attachFile?.addEventListener('change', () => {
    if (validateExtension(attachFile, attachName, '.tar', '첨부파일')) {
      fileLabel(attachFile, attachName);
      setResult('첨부파일이 선택되었습니다.');
    }
  });

  download?.addEventListener('click', () => {
    if (!template?.value) {
      setResult('양식구분을 먼저 선택하세요.', 'warn');
      return;
    }
    setResult(`${template.selectedOptions[0].textContent} 양식을 내려받습니다.`);
  });

  upload?.addEventListener('click', () => {
    if (!template?.value) {
      setResult('양식구분을 선택해 주세요.', 'warn');
      return;
    }
    if (!excelFile?.value) {
      setResult('엑셀파일을 선택해 주세요.', 'warn');
      return;
    }
    if (selectedTemplateKind() === 'file' && !attachFile?.value) {
      setResult('첨부파일을 선택해 주세요.', 'warn');
      return;
    }

    setResult('파일 업로드 후 관리자가 확인하여 승인 시 해당 내용이 등록됩니다.', 'success');
  });

  PomsSidebar.mount('#sidebar-root', { active: 'data-process' });
})();
