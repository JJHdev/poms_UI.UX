/**
 * index.html — 용역사 등록신청 / 회원가입 (Figma 259:3815)
 */
(() => {
  const ICON_HOME = 'assets/main/facility-statistics/figma188/icon-home-clean.svg';
  const ICON_TITLE = 'assets/figma-home/vendor-apply/icon-signup-title.svg';
  const ICON_CLOSE = 'assets/main/dashboard/map/Component%201-1.svg';
  const ICON_CANCEL = 'assets/figma-home/vendor-apply/icon-cancel.svg';
  const ICON_REGISTER = 'assets/figma-home/vendor-apply/icon-register-a.svg';
  const ICON_BULLET = 'assets/figma-home/vendor-apply/icon-bullet.svg';
  const ID_RE = /^[A-Za-z][A-Za-z0-9]{4,19}$/;
  const PW_RE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;
  const PHONE_RE = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;

  const TERMS_HTML = `
    <p class="cr-modal__text">항만시설물 유지관리시스템(POMS) 홈페이지 이용약관입니다. 용역사 등록신청 전에 아래 내용을 확인하시기 바랍니다.</p>
    <p class="cr-modal__text"><strong>제1조 (목적)</strong><br>본 약관은 항만시설물 유지관리시스템(이하 “시스템”)이 제공하는 용역사 계정 및 관련 서비스의 이용 조건과 절차, 이용자와 시스템 간의 권리·의무를 규정합니다.</p>
    <p class="cr-modal__text"><strong>제2조 (이용 신청)</strong><br>용역사 등록을 희망하는 자는 본 약관에 동의하고 신청 정보를 사실에 근거하여 입력해야 합니다. 허위 정보로 등록된 계정은 승인되지 않거나 이용이 제한될 수 있습니다.</p>
    <p class="cr-modal__text"><strong>제3조 (계정의 관리)</strong><br>아이디와 비밀번호에 관한 관리 책임은 신청자에게 있으며, 이를 제3자에게 양도·대여할 수 없습니다.</p>
    <p class="cr-modal__text"><strong>제4조 (서비스 이용)</strong><br>등록이 승인된 용역사는 대상 시설물 신청, 점검보고서 등록 등 시스템이 제공하는 업무를 관련 법령과 안내에 따라 이용해야 합니다.</p>
    <p class="cr-modal__text"><strong>제5조 (약관의 변경)</strong><br>시스템 운영 정책 또는 관계 법령 변경 시 약관이 개정될 수 있으며, 개정 내용은 홈페이지를 통해 안내합니다.</p>
  `;

  function textWeight(str) {
    let weight = 0;
    for (const ch of String(str || '')) {
      weight += /[\uAC00-\uD7A3]/.test(ch) ? 2 : 1;
    }
    return weight;
  }

  function fieldError(form, name, message) {
    const input = form.querySelector(`[name="${name}"]`);
    const error = form.querySelector(`[data-error-for="${name}"]`);
    const hint = form.querySelector(`[data-hint-for="${name}"]`);
    if (input) input.classList.toggle('is-invalid', !!message);
    if (error) {
      error.textContent = message || '';
      error.hidden = !message;
    }
    if (hint) hint.hidden = !!message;
  }

  function clearErrors(form) {
    form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
    form.querySelectorAll('.vendor-apply-field__error').forEach((el) => {
      el.textContent = '';
      el.hidden = true;
    });
    form.querySelectorAll('.vendor-apply-field__hint').forEach((el) => {
      el.hidden = false;
    });
  }

  function syncPasswordConfirm(form) {
    const password = form.password.value;
    const confirm = form.passwordConfirm.value;
    if (!confirm) {
      fieldError(form, 'passwordConfirm', '');
      return;
    }
    if (confirm !== password) {
      fieldError(form, 'passwordConfirm', '비밀번호가 일치하지 않습니다.');
    } else {
      fieldError(form, 'passwordConfirm', '');
    }
  }

  function validate(form, state) {
    clearErrors(form);
    const values = {
      userId: form.userId.value.trim(),
      password: form.password.value,
      passwordConfirm: form.passwordConfirm.value,
      orgName: form.orgName.value.trim(),
      position: form.position.value.trim(),
      managerName: form.managerName.value.trim(),
      phone: form.phone.value.trim(),
      terms: form.querySelector('input[name="termsAgree"]:checked')?.value || '',
    };

    let firstInvalid = null;

    if (!state.termsViewed) {
      firstInvalid = firstInvalid || form.querySelector('[data-open-modal="terms"]');
    } else if (values.terms !== 'agree') {
      firstInvalid = firstInvalid || form.querySelector('#vendorTermsAgree');
    }

    if (!ID_RE.test(values.userId)) {
      fieldError(form, 'userId', '영문자로 시작하는 5~20자 영문자 또는 숫자이어야 합니다.');
      firstInvalid = firstInvalid || form.userId;
    } else if (!state.idChecked || state.checkedId !== values.userId) {
      fieldError(form, 'userId', '아이디 중복확인을 진행해 주세요.');
      firstInvalid = firstInvalid || form.userId;
    }
    if (!PW_RE.test(values.password)) {
      fieldError(form, 'password', '문자, 숫자, 특수문자의 조합으로 8~20자로 입력해주세요.');
      firstInvalid = firstInvalid || form.password;
    }
    if (values.passwordConfirm !== values.password) {
      fieldError(form, 'passwordConfirm', '비밀번호가 일치하지 않습니다.');
      firstInvalid = firstInvalid || form.passwordConfirm;
    } else if (!PW_RE.test(values.passwordConfirm)) {
      fieldError(form, 'passwordConfirm', '문자, 숫자, 특수문자의 조합으로 8~20자로 입력해주세요.');
      firstInvalid = firstInvalid || form.passwordConfirm;
    }
    if (!values.orgName) {
      fieldError(form, 'orgName', '기관명을 입력해 주세요.');
      firstInvalid = firstInvalid || form.orgName;
    } else if (textWeight(values.orgName) > 50) {
      fieldError(form, 'orgName', '한글 25자, 영문 50자를 초과할 수 없습니다.');
      firstInvalid = firstInvalid || form.orgName;
    }
    if (!values.position) {
      fieldError(form, 'position', '직급(담당자)을 입력해 주세요.');
      firstInvalid = firstInvalid || form.position;
    } else if (textWeight(values.position) > 50) {
      fieldError(form, 'position', '한글 25자, 영문 50자를 초과할 수 없습니다.');
      firstInvalid = firstInvalid || form.position;
    }
    if (!values.managerName) {
      fieldError(form, 'managerName', '담당자명을 입력해 주세요.');
      firstInvalid = firstInvalid || form.managerName;
    } else if (textWeight(values.managerName) > 50) {
      fieldError(form, 'managerName', '한글 25자, 영문 50자를 초과할 수 없습니다.');
      firstInvalid = firstInvalid || form.managerName;
    }
    if (!values.phone) {
      fieldError(form, 'phone', '연락 가능한 담당자 연락처(전화번호)를 입력해 주세요.');
      firstInvalid = firstInvalid || form.phone;
    } else if (!PHONE_RE.test(values.phone)) {
      fieldError(form, 'phone', '연락처 형식을 확인해 주세요. 예: 010-1234-5678');
      firstInvalid = firstInvalid || form.phone;
    }

    return { ok: !firstInvalid, firstInvalid, values };
  }

  function setTermsEnabled(form, enabled) {
    form.querySelectorAll('input[name="termsAgree"]').forEach((input) => {
      input.disabled = !enabled;
    });
  }

  function openModal(root, type) {
    const modal = root.querySelector(`[data-vendor-modal="${type}"]`);
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add('cr-modal-open');
    modal.querySelector('.cr-modal__close')?.focus();
  }

  function closeModals(root) {
    root.querySelectorAll('[data-vendor-modal]').forEach((modal) => {
      modal.hidden = true;
    });
    document.body.classList.remove('cr-modal-open');
  }

  function bind(root) {
    const form = root.querySelector('#vendorApplyForm');
    if (!form) return;

    const state = { termsViewed: false, idChecked: false, checkedId: '' };
    setTermsEnabled(form, false);

    root.addEventListener('click', (event) => {
      const homeBtn = event.target.closest('[data-action="home"]');
      if (homeBtn) {
        event.preventDefault();
        if (typeof PomsHomeViews !== 'undefined') PomsHomeViews.showLanding();
        return;
      }

      const openBtn = event.target.closest('[data-open-modal]');
      if (openBtn) {
        const type = openBtn.getAttribute('data-open-modal');
        openModal(root, type);
        if (type === 'terms') {
          state.termsViewed = true;
          setTermsEnabled(form, true);
        }
        return;
      }

      if (event.target.closest('[data-close-vendor-modal]')) {
        closeModals(root);
      }
    });

    form.userId?.addEventListener('input', () => {
      state.idChecked = false;
      state.checkedId = '';
    });

    form.password?.addEventListener('input', () => syncPasswordConfirm(form));
    form.passwordConfirm?.addEventListener('input', () => syncPasswordConfirm(form));

    form.querySelector('[data-check-id]')?.addEventListener('click', () => {
      const userId = form.userId.value.trim();
      if (!ID_RE.test(userId)) {
        fieldError(form, 'userId', '영문자로 시작하는 5~20자 영문자 또는 숫자이어야 합니다.');
        form.userId.focus();
        return;
      }
      state.idChecked = true;
      state.checkedId = userId;
      fieldError(form, 'userId', '');
      alert('사용 가능한 아이디입니다. (샘플)');
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = validate(form, state);
      if (!result.ok) {
        if (!state.termsViewed) {
          alert('약관동의는 전문보기 후에 선택가능합니다.');
        } else if (result.values.terms !== 'agree') {
          alert('홈페이지 이용약관에 동의해야 등록신청이 가능합니다.');
        }
        if (typeof result.firstInvalid?.focus === 'function') result.firstInvalid.focus();
        return;
      }

      alert('용역사 등록신청이 접수되었습니다. 승인 후 로그인이 가능합니다. (샘플)');
      if (typeof PomsHomeViews !== 'undefined') PomsHomeViews.showLanding();
    });

    form.querySelector('[data-vendor-cancel]')?.addEventListener('click', () => {
      if (typeof PomsHomeViews !== 'undefined') PomsHomeViews.showLanding();
    });
  }

  function renderField(opts) {
    const {
      id,
      name,
      label,
      type = 'text',
      maxlength,
      autocomplete,
      placeholder = '',
      hint = '',
      withCheckId = false,
      hideHint = false,
    } = opts;

    return `
      <div class="vendor-apply-field${withCheckId ? ' vendor-apply-field--id' : ''}">
        <label class="vendor-apply-field__label" for="${id}">${label}</label>
        <div class="vendor-apply-field__control">
          <input
            type="${type}"
            id="${id}"
            name="${name}"
            maxlength="${maxlength}"
            autocomplete="${autocomplete}"
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            required
          >
          ${withCheckId ? '<button type="button" class="vendor-apply-btn vendor-apply-btn--outline" data-check-id>중복확인</button>' : ''}
        </div>
        <div class="vendor-apply-field__side">
          ${hint ? `<p class="vendor-apply-field__hint" data-hint-for="${name}"${hideHint ? ' hidden' : ''}>${hint}</p>` : ''}
          <p class="vendor-apply-field__error" data-error-for="${name}" hidden></p>
        </div>
      </div>
    `;
  }

  function render(bodyEl) {
    bodyEl.innerHTML = `
      <div class="vendor-apply">
        <header class="vendor-apply-crumb">
          <button type="button" class="vendor-apply-crumb__home" data-action="home" aria-label="홈으로">
            <img src="${ICON_HOME}" alt="" width="18" height="18">
          </button>
          <p class="vendor-apply-crumb__path">
            <span class="vendor-apply-crumb__parent">홈 &gt;</span>
            <span class="vendor-apply-crumb__current">회원가입</span>
          </p>
        </header>

        <div class="vendor-apply-heading">
          <span class="vendor-apply-heading__icon" aria-hidden="true">
            <img src="${ICON_TITLE}" alt="" width="24" height="24">
          </span>
          <h1 class="vendor-apply-heading__title">회원가입</h1>
        </div>

        <form class="vendor-apply-shell" id="vendorApplyForm" novalidate>
          <section class="vendor-apply-step" aria-labelledby="vendorTermsTitle">
            <div class="vendor-apply-step__bar">
              <span class="vendor-apply-step__badge">STEP. 01</span>
              <h2 class="vendor-apply-step__title" id="vendorTermsTitle">약관 및 고지사항</h2>
            </div>

            <div class="vendor-apply-terms-row">
              <div class="vendor-apply-terms-row__left">
                <p class="vendor-apply-terms-row__label">홈페이지 이용약관</p>
                <button type="button" class="vendor-apply-btn vendor-apply-btn--outline" data-open-modal="terms">전문보기</button>
                <p class="vendor-apply-terms-row__note">※ 약관동의는 전문보기 후에 선택가능합니다.</p>
              </div>
              <div class="vendor-apply-terms-row__radios" role="radiogroup" aria-label="홈페이지 이용약관 동의">
                <label class="vendor-apply-check">
                  <input type="radio" name="termsAgree" id="vendorTermsAgree" value="agree" disabled>
                  <span class="vendor-apply-check__box" aria-hidden="true"></span>
                  <span class="vendor-apply-check__label">동의합니다.</span>
                </label>
                <label class="vendor-apply-check">
                  <input type="radio" name="termsAgree" id="vendorTermsDisagree" value="disagree" disabled>
                  <span class="vendor-apply-check__box" aria-hidden="true"></span>
                  <span class="vendor-apply-check__label">동의하지 않습니다.</span>
                </label>
              </div>
            </div>

            <hr class="vendor-apply-divider" aria-hidden="true">

            <div class="vendor-apply-privacy">
              <p class="vendor-apply-privacy__label">개인정보수집 고지사항</p>
              <div class="vendor-apply-privacy__body">
                <p class="vendor-apply-privacy__lead">개인정보 보호법 개정에 따른 개인정보 수집에 관한 고지사항 안내</p>
                <div class="vendor-apply-privacy__guide">
                  <p class="vendor-apply-privacy__guide-title">개인정보 수집 · 이용 안내 (고지사항)</p>
                  <p class="vendor-apply-privacy__guide-text">항만시설물 유지관리시스템은 홈페이지 회원전용 서비스를 목적으로 아래의 개인정보를 개인정보 보호법 제 15조 제 1항 제 4호에 따라 서비스 계약의 이행을 위해 수집 · 이용하고자 합니다.</p>
                </div>
                <div class="vendor-apply-privacy__list-title">
                  <img src="${ICON_BULLET}" alt="" width="6" height="10">
                  <span>개인정보 수집 · 이용 내역</span>
                </div>
                <table class="vendor-apply-privacy__table">
                  <thead>
                    <tr>
                      <th scope="col">항목</th>
                      <th scope="col">수집 · 이용 목적</th>
                      <th scope="col">보유 · 이용기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span class="vendor-apply-privacy__req">(필수)</span> 아이디, 비밀번호, 업체명,<br>직급 담당자명, 연락처</td>
                      <td><strong class="vendor-apply-privacy__purpose">회원서비스 제공</strong></td>
                      <td>회원 탈퇴 시까지</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section class="vendor-apply-step" aria-labelledby="vendorApplyTitle">
            <div class="vendor-apply-step__bar">
              <span class="vendor-apply-step__badge">STEP. 02</span>
              <h2 class="vendor-apply-step__title" id="vendorApplyTitle">용역사 등록신청</h2>
            </div>

            <div class="vendor-apply-form">
              ${renderField({
                id: 'vendorUserId',
                name: 'userId',
                label: '아이디',
                maxlength: 20,
                autocomplete: 'username',
                hint: '※ 영문자로 시작하는 5~20자 영문자 또는 숫자이어야 합니다.',
                withCheckId: true,
              })}
              ${renderField({
                id: 'vendorPassword',
                name: 'password',
                label: '비밀번호',
                type: 'password',
                maxlength: 20,
                autocomplete: 'new-password',
                hint: '※ 문자, 숫자, 특수문자의 조합으로 8~20자로 입력해주세요.',
              })}
              ${renderField({
                id: 'vendorPasswordConfirm',
                name: 'passwordConfirm',
                label: '비밀번호 확인',
                type: 'password',
                maxlength: 20,
                autocomplete: 'new-password',
                hint: '',
                hideHint: true,
              })}

              <hr class="vendor-apply-divider" aria-hidden="true">

              ${renderField({
                id: 'vendorOrgName',
                name: 'orgName',
                label: '기관명',
                maxlength: 50,
                autocomplete: 'organization',
                hint: '※ 한글 25자, 영문 50자를 초과할 수 없습니다.',
              })}
              ${renderField({
                id: 'vendorPosition',
                name: 'position',
                label: '직급(담당자)',
                maxlength: 50,
                autocomplete: 'organization-title',
                hint: '※ 한글 25자, 영문 50자를 초과할 수 없습니다.',
              })}
              ${renderField({
                id: 'vendorManagerName',
                name: 'managerName',
                label: '담당자명',
                maxlength: 50,
                autocomplete: 'name',
                hint: '※ 한글 25자, 영문 50자를 초과할 수 없습니다.',
              })}
              ${renderField({
                id: 'vendorPhone',
                name: 'phone',
                label: '연락처',
                type: 'tel',
                maxlength: 13,
                autocomplete: 'tel',
                placeholder: '010-0000-0000',
                hint: '※ 연락 가능한 담당자 연락처(전화번호)를 입력해 주세요.',
              })}
            </div>
          </section>

          <hr class="vendor-apply-divider" aria-hidden="true">

          <div class="vendor-apply-footer">
            <button type="button" class="vendor-apply-footer__btn vendor-apply-footer__btn--cancel" data-vendor-cancel>
              <img src="${ICON_CANCEL}" alt="" width="18" height="18">
              취소
            </button>
            <button type="submit" class="vendor-apply-footer__btn vendor-apply-footer__btn--submit">
              <img src="${ICON_REGISTER}" alt="" width="18" height="18">
              등록하기
            </button>
          </div>
        </form>

        <div class="cr-modal vendor-apply-modal" data-vendor-modal="terms" hidden role="dialog" aria-modal="true" aria-labelledby="vendorTermsModalTitle">
          <div class="cr-modal__backdrop" data-close-vendor-modal></div>
          <div class="cr-modal__panel" role="document">
            <header class="cr-modal__head">
              <h2 class="cr-modal__title" id="vendorTermsModalTitle">홈페이지 이용약관</h2>
              <button type="button" class="cr-modal__close" data-close-vendor-modal aria-label="닫기">
                <img src="${ICON_CLOSE}" alt="" width="16" height="16">
              </button>
            </header>
            <div class="cr-modal__body">${TERMS_HTML}</div>
            <div class="cr-modal__foot">
              <button type="button" class="vendor-apply-btn vendor-apply-btn--solid" data-close-vendor-modal>확인</button>
            </div>
          </div>
        </div>
      </div>
    `;

    bind(bodyEl.querySelector('.vendor-apply'));
  }

  function open() {
    if (typeof PomsHomeViews === 'undefined') return;
    PomsHomeViews.showView({
      key: 'vendor-apply',
      title: '회원가입',
      isDetail: true,
      hideChrome: true,
      render,
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.PomsHomeVendorApply = { open };

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const root = document.querySelector('.vendor-apply');
      if (!root) return;
      const opened = root.querySelector('[data-vendor-modal]:not([hidden])');
      if (!opened) return;
      event.preventDefault();
      closeModals(root);
    });
  });
})();
