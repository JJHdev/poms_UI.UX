/**
 * POMS 모바일 — 점검 입력 폼
 */
(() => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '1';
  const item = typeof MOBILE_INSPECTION_ITEMS !== 'undefined'
    ? MOBILE_INSPECTION_ITEMS.find((i) => i.id === id) || MOBILE_INSPECTION_ITEMS[0]
    : null;

  const facilityName = document.getElementById('formFacilityName');
  const facilityManager = document.getElementById('formFacilityManager');
  const formTypeLabel = document.getElementById('formTypeLabel');
  const checklistRoot = document.getElementById('mobileChecklistRoot');
  const tabs = document.querySelectorAll('.mobile-form__tab');
  const panels = document.querySelectorAll('.mobile-form__panel');
  const techList = document.getElementById('mobileTechList');
  const addTechBtn = document.getElementById('mobileAddTech');

  if (item) {
    if (facilityName) facilityName.textContent = item.name;
    if (facilityManager) facilityManager.textContent = item.manager || '광양지방해양수산청';
    if (formTypeLabel) formTypeLabel.textContent = `정기안전점검표 · ${item.formType || '중력식'}`;
    document.title = `${item.name} | POMS 모바일`;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.panel;
      tabs.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      panels.forEach((p) => {
        p.classList.toggle('is-active', p.id === target);
      });
    });
  });

  const el = (tag, className, html) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html) node.innerHTML = html;
    return node;
  };

  const renderChecklist = () => {
    if (!checklistRoot || typeof MOBILE_CHECKLIST_GROUPS === 'undefined') return;
    checklistRoot.innerHTML = '';

    MOBILE_CHECKLIST_GROUPS.forEach((group) => {
      const acc = el('div', `mobile-acc${group.open ? ' is-open' : ''}`);
      const head = el('button', 'mobile-acc__head');
      head.type = 'button';
      head.dataset.accGroup = '';
      head.innerHTML = `${group.title}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
      head.addEventListener('click', () => acc.classList.toggle('is-open'));

      const body = el('d' + 'iv', 'mobile-acc__body');
      if (!group.items.length) {
        body.innerHTML = '<p style="padding:14px 16px;margin:0;font-size:13px;color:#6b7280">항목 없음 (샘플)</p>';
      } else {
        group.items.forEach((sub) => {
          const itemWrap = el('div', `mobile-acc-item${sub.open ? ' is-open' : ''}`);
          const itemHead = el('button', 'mobile-acc-item__head');
          itemHead.type = 'button';
          itemHead.innerHTML = `<span class="mobile-acc-item__dot" aria-hidden="true"></span>${sub.title}`;
          itemHead.addEventListener('click', () => itemWrap.classList.toggle('is-open'));
          itemWrap.appendChild(itemHead);

          if (sub.open) {
            const itemBody = el('div', 'mobile-acc-item__body');
            const photoBtn = el('button', 'mobile-acc-item__photo');
            photoBtn.type = 'button';
            photoBtn.setAttribute('aria-label', '사진 추가');
            photoBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>추가';
            photoBtn.addEventListener('click', () => alert('사진 촬영/앨범은 샘플에서 준비 중입니다.'));

            const toggles = el('div', 'mobile-acc-item__toggles');
            (sub.toggles || []).forEach((label, i) => {
              const tbtn = el('button', `mobile-acc-item__toggle${i === (sub.activeToggle ?? 0) ? ' is-active' : ''}`);
              tbtn.type = 'button';
              tbtn.textContent = label;
              tbtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggles.querySelectorAll('.mobile-acc-item__toggle').forEach((b) => b.classList.remove('is-active'));
                tbtn.classList.add('is-active');
              });
              toggles.appendChild(tbtn);
            });

            const note = document.createElement('textarea');
            note.className = 'mobile-form__textarea';
            note.rows = 4;
            note.placeholder = '비고를 입력하세요';

            itemBody.append(photoBtn, toggles, note);
            itemWrap.appendChild(itemBody);
          }
          body.appendChild(itemWrap);
        });
      }

      acc.append(head, body);
      checklistRoot.appendChild(acc);
    });
  };

  const bindSignPads = (root) => {
    root?.querySelectorAll('.mobile-form__sign').forEach((pad) => {
      pad.addEventListener('click', () => alert('서명 패드는 샘플에서 준비 중입니다.'));
    });
  };

  const createTechCard = (type, canDelete) => {
    const isLead = type === 'lead';
    const wrap = el('div', 'mobile-form__tech-card');
    if (canDelete) {
      const del = el('button', 'mobile-form__tech-delete');
      del.type = 'button';
      del.textContent = '점검자 삭제';
      del.addEventListener('click', () => {
        if (confirm('해당 점검자를 삭제하시겠습니까?')) wrap.remove();
      });
      wrap.appendChild(del);
    }

    const badge = el('span', 'mobile-form__badge');
    badge.textContent = isLead ? '책임기술자' : '참여 기술사';
    wrap.appendChild(badge);

    const fields = [
      { label: '소속', req: true, options: ['', '한국항만협회'] },
      { label: '직위', req: true, options: ['', '기술사', '기술자'] },
      { label: '성별', req: false, options: ['', '남', '여'] },
    ];

    fields.forEach((f) => {
      const field = el('div', 'mobile-form__field');
      const label = document.createElement('label');
      label.className = 'mobile-form__label';
      label.innerHTML = `${f.label}${f.req ? '<span class="req">*</span>' : ''}`;
      const select = document.createElement('select');
      select.className = 'mobile-form__select';
      f.options.forEach((opt, i) => {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = i === 0 ? '선택하세요' : opt;
        select.appendChild(o);
      });
      field.append(label, select);
      wrap.appendChild(field);
    });

    const signField = el('div', 'mobile-form__field');
    signField.innerHTML = '<label class="mobile-form__label">서명<span class="req">*</span></label>';
    const signBtn = el('button', 'mobile-form__sign');
    signBtn.type = 'button';
    signBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>서명란을 터치하여 서명하세요.';
    signField.appendChild(signBtn);
    wrap.appendChild(signField);

    bindSignPads(wrap);
    return wrap;
  };

  if (techList) {
    techList.appendChild(createTechCard('lead', false));
    techList.appendChild(createTechCard('join', true));
  }

  addTechBtn?.addEventListener('click', () => {
    techList?.appendChild(createTechCard('join', true));
  });

  document.getElementById('formSaveDraft')?.addEventListener('click', () => {
    alert('임시저장되었습니다. (샘플)');
  });

  document.getElementById('formSubmit')?.addEventListener('click', () => {
    alert('제출되었습니다. (샘플)');
    window.location.href = 'inspection.html';
  });

  renderChecklist();
})();
