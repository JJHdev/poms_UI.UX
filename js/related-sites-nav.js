/**
 * 로그인 페이지 푸터 — 관련 사이트 셀렉트 바
 * 항목 선택 시 새 창으로 이동합니다. (url이 '#'이면 샘플 안내)
 */
(() => {
  const wrap = document.getElementById('relatedSitesFooter');
  if (!wrap || typeof RELATED_SITES_GROUPS === 'undefined') return;

  wrap.innerHTML = RELATED_SITES_GROUPS.map((group) => `
    <label class="related-sites-bar__field">
      <span class="sr-only">${group.label}</span>
      <select class="related-sites-bar__select" data-group="${group.id}" aria-label="${group.label}">
        <option value="">${group.label}</option>
        ${group.items.map((item, index) => `<option value="${group.id}:${index}">${item.name}</option>`).join('')}
      </select>
    </label>
  `).join('');

  wrap.querySelectorAll('.related-sites-bar__select').forEach((select) => {
    select.addEventListener('change', () => {
      if (!select.value) return;
      const [groupId, indexText] = select.value.split(':');
      const group = RELATED_SITES_GROUPS.find((g) => g.id === groupId);
      const item = group?.items[Number(indexText)];
      select.selectedIndex = 0;
      if (!item) return;
      if (item.url && item.url !== '#') {
        window.open(item.url, '_blank', 'noopener');
      } else {
        alert(`${item.name} 사이트로 이동합니다. (URL 연결 예정)`);
      }
    });
  });
})();
