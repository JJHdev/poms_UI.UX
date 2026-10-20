/**
 * POMS 모바일 공통
 */
(() => {
  document.querySelectorAll('[data-mobile-soon]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (el.getAttribute('href') === '#') {
        e.preventDefault();
        alert('해당 화면은 샘플에서 준비 중입니다.');
      }
    });
  });
})();
