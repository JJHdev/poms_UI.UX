(() => {
  function toggleView(id) {
    const element = document.getElementById(id);
    if (!element) return;
    const hidden = element.style.display === 'none' || element.style.display === '';
    element.style.display = hidden ? 'block' : 'none';
  }

  function downloadFile(fileName) {
    alert(`${fileName || '파일'} 다운로드 기능은 샘플입니다.`);
  }

  function changePolicy() {
    const select = document.getElementById('policySelect');
    if (!select || select.value === 'newPolicy') return;
    alert('이전 방침 보기는 샘플입니다. 현재 방침을 표시합니다.');
    select.value = 'newPolicy';
  }

  window.toggleView = toggleView;
  window.downloadFile = downloadFile;
  window.changePolicy = changePolicy;

  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });
  });
})();
