/**
 * 팝업관리 상세 화면 스크립트
 * 상세 보기 / 수정 모드 전환 지원
 */
(() => {
  const today = '2026-06-11';
  const titles = [
    '상반기 정기점검 자료 제출 안내',
    'POMS 시스템 점검 안내',
    '2026년 유지관리계획 등록 안내',
    '항만시설물 안전점검 일정 공지',
    'POMS 모바일 앱 업데이트 안내',
    '개인정보처리방침 개정 안내',
    '설 연휴 고객센터 운영 안내',
    '시스템 로그인 정책 변경 안내',
  ];

  const popups = [];
  for (let i = 1; i <= 28; i++) {
    const offset = i - 1;
    const startDay = String((offset % 20) + 1).padStart(2, '0');
    const endDay = String((offset % 20) + 8).padStart(2, '0');
    const month = String(((offset % 3) + 5)).padStart(2, '0');
    const useYn = i % 6 === 0 ? '미노출' : '노출';
    popups.push({
      id: i,
      title: titles[offset % titles.length],
      start: `2026-${month}-${startDay}`,
      end: `2026-${month}-${endDay}`,
      useYn,
      width: String(480 + (i % 4) * 20),
      image: i % 3 === 0 ? '있음' : '없음',
      link: i % 2 === 0 ? '/notice' : '/main',
      content: `${titles[offset % titles.length]} 관련 안내입니다.`,
    });
  }

  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode') || 'detail';
  const id = Number(params.get('id')) || 1;
  const source = popups.find((popup) => popup.id === id) || popups[0];

  let current = mode === 'insert'
    ? {
        id: null,
        title: '',
        start: '2026-06-24',
        end: '2026-06-30',
        useYn: '노출',
        width: '520',
        image: '없음',
        link: '',
        content: '',
      }
    : { ...source };

  let editSnapshot = null;
  let isEditing = mode === 'insert';

  const fields = {
    title: $('popupTitleInput'),
    start: $('popupStartInput'),
    end: $('popupEndInput'),
    status: $('popupStatusInput'),
    width: $('popupWidthInput'),
    image: $('popupImageInput'),
    link: $('popupLinkInput'),
    content: $('popupContentInput'),
  };

  const preview = {
    modal: $('popupPreviewModal'),
    window: $('popupPreviewWindow'),
    image: $('popupPreviewImage'),
    title: $('popupPreviewTitle'),
    content: $('popupPreviewContent'),
    status: $('popupPreviewStatus'),
    link: $('popupPreviewLink'),
  };

  const state = {
    imageFile: current.image === '있음'
      ? { name: '팝업_이미지.png', size: '245 KB' }
      : null,
    popupType: current.image === '있음' ? 'image' : 'text',
  };

  function escapeHtml(value) {
    return window.PomsMock?.escapeHtml(value) || String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getDisplayStatus(values) {
    if (values.useYn === '미노출') return '미노출';
    if (values.start > today) return '예약';
    if (values.end < today) return '종료';
    return '게시중';
  }

  function readForm() {
    return {
      id: current.id,
      title: fields.title?.value.trim() || '신규 팝업 제목',
      start: fields.start?.value || '',
      end: fields.end?.value || '',
      useYn: fields.status?.value || '노출',
      width: fields.width?.value || '520',
      image: state.imageFile ? '있음' : '없음',
      link: fields.link?.value.trim() || '',
      content: fields.content?.textContent.trim() || '',
    };
  }

  function setForm(values) {
    if (fields.title) fields.title.value = values.title || '';
    if (fields.start) fields.start.value = values.start || '';
    if (fields.end) fields.end.value = values.end || '';
    if (fields.status) fields.status.value = values.useYn || '노출';
    if (fields.width) fields.width.value = values.width || '520';
    if (fields.link) fields.link.value = values.link || '';
    if (fields.content) {
      fields.content.innerHTML = values.content
        ? `<p>${escapeHtml(values.content)}</p>`
        : '';
    }

    state.popupType = values.image === '있음' ? 'image' : 'text';
    const typeSelect = $('popupTypeSelect');
    if (typeSelect) typeSelect.value = state.popupType;
  }

  function renderDetail(values = current) {
    const displayStatus = getDisplayStatus(values);

    if ($('popupDetailTitle')) {
      $('popupDetailTitle').textContent = values.title || '팝업 상세';
    }
    if ($('popupTypeText')) {
      $('popupTypeText').textContent = state.popupType === 'image' ? '이미지 팝업' : '텍스트 팝업';
    }
    if ($('popupStartText')) $('popupStartText').textContent = values.start || '-';
    if ($('popupEndText')) $('popupEndText').textContent = values.end || '-';
    if ($('popupVisibleText')) $('popupVisibleText').textContent = values.useYn || '-';
    if ($('popupWidthText')) $('popupWidthText').textContent = values.width || '-';

    const linkText = $('popupLinkText');
    if (linkText) {
      linkText.textContent = values.link || '-';
      linkText.href = values.link || '#';
    }

    const contentText = $('popupContentText');
    if (contentText) {
      contentText.innerHTML = values.content
        ? `<p>${escapeHtml(values.content)}</p>`
        : '<p>-</p>';
    }

    const badge = $('popupStatusBadge');
    if (badge) {
      badge.hidden = false;
      badge.textContent = displayStatus;
    }

    const note = $('popupFormNote');
    if (note) {
      note.textContent = `너비 ${values.width}px 기준. ${values.useYn === '미노출' ? '현재 미노출 상태입니다.' : '게시 기간에 맞춰 노출됩니다.'}`;
    }

    renderImageRow();
    updatePreview(values);
  }

  function renderImageRow() {
    const imageRow = $('popupImageRow');
    if (!imageRow) return;

    imageRow.hidden = state.popupType !== 'image';

    const text = $('popupImageText');
    if (text) {
      if (state.imageFile) {
        text.innerHTML = `
          <span class="pd-image-view-file">
            <img src="assets/admin-notices/icon-attach.svg" alt="" width="15" height="15">
            <span>${escapeHtml(state.imageFile.name)} (${escapeHtml(state.imageFile.size)})</span>
          </span>
        `;
      } else {
        text.innerHTML = '<span class="pd-image-empty">첨부된 이미지가 없습니다.</span>';
      }
    }

    const list = $('popupImageAttachList');
    if (!list) return;

    if (!state.imageFile) {
      list.innerHTML = '<span class="ne-attach__empty">첨부된 이미지가 없습니다.</span>';
      return;
    }

    list.innerHTML = `
      <div class="ne-attach__file">
        <img src="assets/admin-notices/icon-attach.svg" alt="" width="16" height="16">
        <span class="ne-attach__name">${escapeHtml(state.imageFile.name)} (${escapeHtml(state.imageFile.size)})</span>
        <button type="button" class="ne-attach__remove" aria-label="이미지 삭제">×</button>
      </div>
    `;

    list.querySelector('.ne-attach__remove')?.addEventListener('click', () => {
      state.imageFile = null;
      if (fields.image) fields.image.value = '';
      renderImageRow();
      updatePreview(readForm());
    });
  }

  function updatePreview(values = readForm()) {
    if (!preview.modal) return;

    const isImageType = state.popupType === 'image';

    if (preview.window) {
      preview.window.style.maxWidth = `${Math.min(Number(values.width) || 720, 820)}px`;
    }

    if (preview.image) {
      if (isImageType) {
        preview.image.style.display = 'flex';
        preview.image.innerHTML = state.imageFile
          ? `이미지 영역<br>너비 ${escapeHtml(values.width)}px 기준`
          : '등록된 이미지가 없습니다.';
      } else {
        preview.image.style.display = 'none';
      }
    }

    if (preview.content) {
      preview.content.style.display = isImageType ? 'none' : '';
      preview.content.textContent = values.content || '팝업 설명을 입력하면 이 영역에 표시됩니다.';
    }

    if (preview.title) preview.title.textContent = values.title || '팝업 제목';
    if (preview.status) preview.status.textContent = values.useYn || '노출';
    if (preview.link) preview.link.textContent = values.link ? '새 창 링크' : '링크 없음';
  }

  function setEditing(nextEditing) {
    isEditing = nextEditing;
    document.body.classList.toggle('is-editing', isEditing);

    const saveText = $('popupSaveText');
    if (saveText) saveText.textContent = isEditing ? '수정하기' : '수정하기';

    const crumb = $('popupDetailCrumb');
    if (crumb) crumb.textContent = isEditing ? '팝업 수정' : '팝업 상세';

    document.title = `${isEditing ? '팝업 수정' : '팝업 상세'} | POMS 관리자`;

    if (isEditing) {
      setForm(current);
      fields.title?.focus();
    }
  }

  function beginEdit() {
    editSnapshot = {
      current: { ...current },
      popupType: state.popupType,
      imageFile: state.imageFile ? { ...state.imageFile } : null,
    };
    setEditing(true);
  }

  function cancelEdit() {
    if (editSnapshot) {
      current = { ...editSnapshot.current };
      state.popupType = editSnapshot.popupType;
      state.imageFile = editSnapshot.imageFile ? { ...editSnapshot.imageFile } : null;
    }
    setForm(current);
    renderDetail(current);
    setEditing(false);
    editSnapshot = null;
  }

  function saveEdit() {
    current = readForm();
    current.image = state.imageFile ? '있음' : '없음';

    renderDetail(current);
    setEditing(false);
    editSnapshot = null;

    window.alert('팝업이 저장되었습니다. (샘플)');
  }

  function openPreviewModal() {
    updatePreview(isEditing ? readForm() : current);
    preview.modal.hidden = false;
    document.body.classList.add('is-mock-modal-open');
    preview.modal.querySelector('.mock-modal__close')?.focus({ preventScroll: true });
  }

  function closePreviewModal() {
    preview.modal.hidden = true;
    document.body.classList.remove('is-mock-modal-open');
  }

  function goList() {
    window.location.href = 'popup-manage.html';
  }

  $('popupBack')?.addEventListener('click', goList);

  $('popupCancel')?.addEventListener('click', cancelEdit);

  $('popupSave')?.addEventListener('click', () => {
    if (isEditing) {
      saveEdit();
    } else {
      beginEdit();
    }
  });

  $('popupDelete')?.addEventListener('click', () => {
    const note = $('popupFormNote');
    if (note) note.textContent = '팝업이 삭제된 것으로 표시했습니다. (목업)';
  });

  $('popupPreviewOpen')?.addEventListener('click', openPreviewModal);

  document.querySelectorAll('[data-popup-preview-close]').forEach((el) => {
    el.addEventListener('click', closePreviewModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && preview.modal?.hidden === false) {
      closePreviewModal();
    }
  });

  fields.image?.addEventListener('change', () => {
    const file = fields.image.files?.[0];
    if (!file) return;
    const sizeKb = Math.max(1, Math.round(file.size / 1024));
    state.imageFile = { name: file.name, size: `${sizeKb} KB` };
    renderImageRow();
    updatePreview(readForm());
  });

  $('popupImageButton')?.addEventListener('click', () => {
    fields.image?.click();
  });

  Object.values(fields).forEach((field) => {
    if (!field || field.type === 'file') return;
    field.addEventListener('input', () => updatePreview(readForm()));
    field.addEventListener('change', () => updatePreview(readForm()));
  });

  $('popupTypeSelect')?.addEventListener('change', (event) => {
    state.popupType = event.target.value;
    renderImageRow();
    updatePreview(readForm());
  });



  setForm(current);
  renderDetail(current);
  setEditing(isEditing);
})();
