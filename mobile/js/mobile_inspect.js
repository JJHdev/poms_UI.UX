/* ── 모바일 뒤로가기 = 열린 창 닫기 (사진 확대·시트·영상창 등) ──────────
   창을 열 때 방문 기록 1개를 넣고, 뒤로가기가 오면 맨 위 창만 닫음.
   X·바깥 클릭으로 닫으면 넣어 둔 기록을 되돌려 다음 뒤로가기가 정상 동작. */
window.pomsBackLayer = window.pomsBackLayer || (function () {
  var stack = [], skipPops = 0, pendingBack = 0, timer = null, closingFromBack = false;
  function find(id) { for (var i = stack.length - 1; i >= 0; i--) if (stack[i].id === id) return i; return -1; }
  function opened(id, closeFn) {
    if (find(id) >= 0) return;
    var st = Object.assign({}, history.state || {}, { pomsLayer: id });
    history.pushState(st, '', location.href);
    stack.push({ id: id, close: closeFn });
  }
  function closedByUi(id) {
    if (closingFromBack) return;
    var i = find(id);
    if (i < 0) return;
    stack.splice(i, 1);
    pendingBack++;
    if (!timer) timer = setTimeout(function () {
      timer = null;
      var n = pendingBack; pendingBack = 0;
      if (n > 0) { skipPops++; history.go(-n); }
    }, 0);
  }
  function discardAll() { stack = []; }          // 화면 이동 시: 기록은 두고 목록만 비움
  window.addEventListener('popstate', function (e) {
    if (skipPops > 0) { skipPops--; e.stopImmediatePropagation(); return; }
    if (!stack.length) return;
    var top = stack.pop();
    closingFromBack = true;
    try { top.close(); } finally { closingFromBack = false; }
    e.stopImmediatePropagation();
  });
  return { opened: opened, closedByUi: closedByUi, discardAll: discardAll };
})();

function toggleSection(key) {
  var card = document.getElementById('sec-' + key);
  var body = document.getElementById('body-' + key);
  var ic   = document.getElementById('ic-' + key);
  var isOpen = !body.classList.contains('hidden');
  var arrow = ic ? ic.querySelector('img') : null;

  if (isOpen) {
    body.classList.add('hidden');
    ic.classList.remove('open');
    if (card) card.classList.remove('is-open');
    if (arrow) arrow.style.transform = '';
  } else {
    body.classList.remove('hidden');
    ic.classList.add('open');
    if (card) card.classList.add('is-open');
    if (arrow) arrow.style.transform = 'rotate(180deg)';
  }
}

function createJoinTechEntry() {
  var entry = document.createElement('div');
  entry.className = 'tech-entry';
  entry.innerHTML =
    '<div class="row2 tech-entry__top">' +
      '<div class="field"><div class="field-lbl">소속</div><input class="field-inp" placeholder="입력하세요."></div>' +
      '<div class="field"><div class="field-lbl">서명</div><button type="button" class="sign-box" aria-label="서명"><img src="assets/main/checklist/pen.svg" alt="" width="18" height="18"></button></div>' +
    '</div>' +
    '<div class="field"><div class="field-lbl">직위</div><input class="field-inp" placeholder="직위를 입력하세요."></div>' +
    '<div class="field"><div class="field-lbl">성명</div><input class="field-inp" placeholder="이름을 입력하세요."></div>' +
    '<div class="field"><div class="field-lbl">과업참여기간</div><div class="period-range">' +
      '<div class="date-wrap"><input class="field-inp" type="date" aria-label="과업참여 시작일"><img class="cal-ic" src="assets/main/checklist/calendar.svg" alt="" width="16" height="18"></div>' +
      '<span class="period-range__sep" aria-hidden="true">~</span>' +
      '<div class="date-wrap"><input class="field-inp" type="date" aria-label="과업참여 종료일"><img class="cal-ic" src="assets/main/checklist/calendar.svg" alt="" width="16" height="18"></div>' +
    '</div></div>' +
    '<div class="field"><div class="field-lbl">기술등급</div><select class="field-sel"><option value="">선택</option><option>특급</option><option>고급</option><option>중급</option><option>초급</option></select></div>';
  return entry;
}

function getJoinTechAddButton() {
  return document.getElementById('btnAddJoinTechBottom');
}

function appendJoinTechEntry() {
  var list = document.getElementById('joinTechList');
  if (!list) return;
  var entry = createJoinTechEntry();
  var addBtn = getJoinTechAddButton();
  if (addBtn) list.insertBefore(entry, addBtn);
  else list.appendChild(entry);
  syncJoinTechActions();
  if (window.pomsSyncReportTechsFromHistory) window.pomsSyncReportTechsFromHistory(true, true);
}

function createTechDivider(mode) {
  var divider = document.createElement('div');
  divider.className = 'tech-divider';
  if (mode === 'add') {
    divider.innerHTML = '<button type="button" class="tech-divider__add" aria-label="점검자 추가"><i class="ti ti-plus"></i></button>';
    divider.querySelector('.tech-divider__add').addEventListener('click', appendJoinTechEntry);
  } else {
    divider.innerHTML = '<button type="button" class="tech-divider__del" aria-label="점검자 삭제"><i class="ti ti-minus"></i></button>';
    divider.querySelector('.tech-divider__del').addEventListener('click', function () {
      var prev = divider.previousElementSibling;
      if (prev && prev.classList.contains('tech-entry')) prev.remove();
      syncJoinTechActions();
      if (window.pomsSyncReportTechsFromHistory) window.pomsSyncReportTechsFromHistory(true, true);
    });
  }
  return divider;
}

function syncJoinTechActions() {
  var list = document.getElementById('joinTechList');
  var addBtn = document.getElementById('btnAddJoinTech');
  var bottomBtn = getJoinTechAddButton();
  if (!list) return;

  list.querySelectorAll('.tech-divider').forEach(function (el) { el.remove(); });
  list.querySelectorAll('.tech-entry__head').forEach(function (el) { el.remove(); });

  var entries = Array.prototype.slice.call(list.querySelectorAll('.tech-entry'));

  entries.forEach(function (entry) {
    entry.after(createTechDivider('del'));
  });

  if (bottomBtn) list.appendChild(bottomBtn);
  if (addBtn) addBtn.classList.toggle('is-hidden', entries.length >= 2);
  if (window.pomsSyncReportTechsFromHistory) window.pomsSyncReportTechsFromHistory(true, true);
}

document.getElementById('btnAddJoinTechBottom')?.addEventListener('click', appendJoinTechEntry);

syncJoinTechActions();

function saveInspectDraft() {
  if (!window.pomsSaveRecord || window.pomsSaveRecord('임시저장') !== true) return;
  alert('임시저장되었습니다.');
  try { sessionStorage.setItem('pomsReturnPhone', 'phoneInspect'); } catch (e) {}
  window.location.href = 'mobile_main.html';
}
document.getElementById('btnSaveDraft')?.addEventListener('click', saveInspectDraft);
document.getElementById('btnReportSaveDraft')?.addEventListener('click', saveInspectDraft);
document.getElementById('btnChecklistEdit')?.addEventListener('click', function () {
  if (window.pomsActivateInspectTab) window.pomsActivateInspectTab('history');
});
document.getElementById('btnReportEdit')?.addEventListener('click', function () {
  if (window.pomsActivateInspectTab) window.pomsActivateInspectTab('checklist');
});
document.getElementById('btnNextInspectStep')?.addEventListener('click', function () {
  var on = document.querySelector('#inspectTabBar .tab-item.active');
  var tab = on ? on.getAttribute('data-inspect-tab') : 'history';
  var next = tab === 'history' ? 'checklist' : 'report';
  if (window.pomsCanOpenInspectTab && !window.pomsCanOpenInspectTab(next)) return;
  if (window.pomsActivateInspectTab) window.pomsActivateInspectTab(next);
});

function downloadInspectReportHwp() {
  var facility = window.getInspectFacility ? window.getInspectFacility() : null;
  var kind = facility && facility.kind ? facility.kind : '';
  var name = facility && facility.name ? facility.name : '';
  var text = kind + ' ' + name;
  var file = text.indexOf('외곽') !== -1
    ? '부산남항 서구 방재호안 정밀안전점검용역_종합보고서-외곽.pdf'
    : '06. 정밀안전점검_부산항 신항 4부두(2-2단계)-계류.pdf';
  var a = document.createElement('a');
  a.href = 'assets/video/' + encodeURIComponent(file);
  a.download = file;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
function goBackAfterInspectSubmit() {
  if (history.length > 1) {
    history.back();
    return;
  }
  try { sessionStorage.setItem('pomsReturnPhone', 'phoneInspect'); } catch (e) {}
  window.location.href = 'mobile_main.html';
}
function finishInspectSubmit() {
  if (window.pomsSaveRecord && window.pomsSaveRecord('제출') === false) return;
  var modal = document.getElementById('reportDownloadModal');
  if (!modal) {
    goBackAfterInspectSubmit();
    return;
  }
  modal.hidden = false;
}
function openReportSubmitConfirm() {
  var modal = document.getElementById('reportSubmitConfirmModal');
  if (!modal) {
    finishInspectSubmit();
    return;
  }
  modal.hidden = false;
}
function closeReportSubmitConfirm() {
  var modal = document.getElementById('reportSubmitConfirmModal');
  if (modal) modal.hidden = true;
}
document.getElementById('reportSubmitConfirmYes')?.addEventListener('click', function () {
  closeReportSubmitConfirm();
  finishInspectSubmit();
});
document.getElementById('reportSubmitConfirmNo')?.addEventListener('click', closeReportSubmitConfirm);
document.getElementById('reportSubmitConfirmModal')?.addEventListener('click', function (e) {
  if (e.target && e.target.getAttribute('data-submit-confirm-dismiss') === '1') closeReportSubmitConfirm();
});
document.getElementById('reportDownloadYes')?.addEventListener('click', function () {
  downloadInspectReportHwp();
  window.setTimeout(goBackAfterInspectSubmit, 400);
});
document.getElementById('reportDownloadNo')?.addEventListener('click', goBackAfterInspectSubmit);

(function () {
  var phoneFrames = document.querySelectorAll('body > .phone');
  var introPhone = phoneFrames[0];
  var mainPhone = phoneFrames[1];
  var phone1ChecklistView = document.getElementById('phone1ChecklistView');
  var phone1ReportView = document.getElementById('phone1ReportView');
  var inspectChecklistView = document.getElementById('inspectChecklistView');
  var inspectReportView = document.getElementById('inspectReportView');
  var inspectHistoryView = document.getElementById('inspectHistoryView');

  function moveChildrenBefore(source, target) {
    if (!source || !target) return;
    var fragment = document.createDocumentFragment();
    while (source.firstChild) {
      fragment.appendChild(source.firstChild);
    }
    target.insertBefore(fragment, target.firstChild);
  }

  moveChildrenBefore(phone1ChecklistView, inspectHistoryView);
  /* 결과보고서는 아래 새 디자인을 그대로 사용하므로 기존 표 형태는 이동하지 않음 */
  if (phone1ReportView) phone1ReportView.innerHTML = '';
  if (introPhone) introPhone.hidden = true;
  if (mainPhone) mainPhone.hidden = false;
})();

(function () {
  var PEN = 'assets/main/checklist/pen.svg';
  var CHECK = 'assets/main/checklist/sign-check.svg';
  var modal = document.getElementById('signModal');
  var canvas = document.getElementById('signCanvas');
  if (!modal || !canvas) return;
  var ctx = canvas.getContext('2d');
  var currentBox = null;
  var drawing = false;
  var hasInk = false;
  var last = null;

  function setSignIcon(box, signed) {
    box.classList.toggle('is-signed', signed);
    box.setAttribute('aria-label', signed ? '서명됨, 다시 서명하기' : '서명');
    var img = box.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.alt = '';
      img.width = 18;
      img.height = 18;
      box.appendChild(img);
    }
    img.src = signed ? CHECK : PEN;
  }

  function resizeCanvas() {
    var wrap = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var w = wrap.clientWidth;
    var h = wrap.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0d1f35';
  }

  function prepareStroke() {
    var dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0d1f35';
  }

  function clearCanvas() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    prepareStroke();
    hasInk = false;
  }

  function loadImage(src, done) {
    if (!src || src.indexOf('data:') !== 0) { done(); return; }
    var img = new Image();
    img.onload = function () {
      var dpr = window.devicePixelRatio || 1;
      ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
      hasInk = true;
      done();
    };
    img.onerror = done;
    img.src = src;
  }

  function pos(e) {
    var rect = canvas.getBoundingClientRect();
    var src = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function startDraw(e) {
    e.preventDefault();
    drawing = true;
    last = pos(e);
  }
  function moveDraw(e) {
    if (!drawing) return;
    e.preventDefault();
    var p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last = p;
    hasInk = true;
  }
  function endDraw(e) {
    if (!drawing) return;
    e.preventDefault();
    drawing = false;
  }

  function openModal(box) {
    currentBox = box;
    modal.hidden = false;
    window.pomsBackLayer.opened('sign', closeModal);
    requestAnimationFrame(function () {
      resizeCanvas();
      clearCanvas();
      loadImage(box.dataset.sign || '', function () {});
    });
  }

  function closeModal() {
    modal.hidden = true;
    currentBox = null;
    drawing = false;
    window.pomsBackLayer.closedByUi('sign');
  }

  function canvasHasInk() {
    if (hasInk) return true;
    try {
      var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (var i = 3; i < data.length; i += 4) {
        if (data[i] > 8) return true;
      }
    } catch (e) { /* ignore */ }
    return false;
  }

  function saveModal() {
    if (!currentBox) return;
    if (!canvasHasInk()) {
      delete currentBox.dataset.sign;
      setSignIcon(currentBox, false);
      closeModal();
      return;
    }
    currentBox.dataset.sign = canvas.toDataURL('image/png');
    setSignIcon(currentBox, true);
    closeModal();
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', moveDraw);
  window.addEventListener('mouseup', endDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', moveDraw, { passive: false });
  canvas.addEventListener('touchend', endDraw, { passive: false });

  document.getElementById('signModalClear')?.addEventListener('click', clearCanvas);
  document.getElementById('signModalCancel')?.addEventListener('click', closeModal);
  document.getElementById('signModalClose')?.addEventListener('click', closeModal);
  document.getElementById('signModalSave')?.addEventListener('click', saveModal);
  modal.querySelector('[data-sign-dismiss]')?.addEventListener('click', closeModal);

  document.addEventListener('click', function (e) {
    var box = e.target.closest('.sign-box');
    if (!box || (!box.closest('#inspectChecklistView') && !box.closest('#inspectHistoryView'))) return;
    openModal(box);
  });
})();

window.pomsInspectStore = (function () {
  var KEY = 'pomsInspectRecords';
  var FLAG_KEY = 'pomsInspectPeriodFlags';
  function parse(raw) {
    try { return JSON.parse(raw || ''); } catch (e) { return null; }
  }
  function renameLegacy(records) {
    if (!records || typeof records !== 'object') return records;
    if (!records['파제제']) {
      if (records['목포항 파제제']) records['파제제'] = records['목포항 파제제'];
      else if (records['B 외곽시설']) records['파제제'] = records['B 외곽시설'];
    }
    delete records['B 외곽시설'];
    if (records['파제제']) delete records['목포항 파제제'];
    return records;
  }
  function read() {
    var local = parse(localStorage.getItem(KEY));
    if (local && typeof local === 'object') return renameLegacy(local);
    var sess = parse(sessionStorage.getItem(KEY));
    if (sess && typeof sess === 'object') return renameLegacy(sess);
    return {};
  }
  function writeFlags(records) {
    var flags = {};
    Object.keys(records || {}).forEach(function (name) {
      var rec = records[name] || {};
      var periods = rec.periods || {};
      var row = {};
      Object.keys(periods).forEach(function (k) {
        if (periods[k] && periods[k].status) row[k] = periods[k].status;
      });
      if (Object.keys(row).length) flags[name] = row;
    });
    try {
      var json = JSON.stringify(flags);
      localStorage.setItem(FLAG_KEY, json);
      sessionStorage.setItem(FLAG_KEY, json);
    } catch (e) {}
  }
  function lightenSnapshot(snap) {
    if (!snap || typeof snap !== 'object') return snap;
    var out = {};
    Object.keys(snap).forEach(function (key) {
      if (key === 'photos') {
        out.photos = (snap.photos || []).map(function (item) {
          if (typeof item === 'number') return item;
          if (Array.isArray(item)) return item.length;
          return 0;
        });
        return;
      }
      if (key === 'signs') {
        out.signs = (snap.signs || []).map(function (sign) {
          return sign ? '1' : '';
        });
        return;
      }
      out[key] = snap[key];
    });
    return out;
  }
  function lighten(records) {
    var copy = {};
    Object.keys(records || {}).forEach(function (name) {
      var rec = records[name] || {};
      copy[name] = {
        status: rec.status, inspector: rec.inspector, grade: rec.grade,
        checkType: rec.checkType, opinion: rec.opinion, at: rec.at, periods: {}
      };
      if (!rec.periods) return;
      Object.keys(rec.periods).forEach(function (k) {
        var slot = rec.periods[k] || {};
        copy[name].periods[k] = {
          status: slot.status, inspector: slot.inspector, grade: slot.grade,
          checkType: slot.checkType, opinion: slot.opinion, at: slot.at,
          snapshot: lightenSnapshot(slot.snapshot),
          histView: slot.histView || null
        };
      });
    });
    return copy;
  }
  function stripHeavy(records) {
    return lighten(records);
  }
  function slimHistView(view) {
    if (!view || typeof view !== 'object') return view || null;
    var copy = {};
    Object.keys(view).forEach(function (key) {
      if (key === 'photos' || key === 'photoSrcs') {
        copy[key] = [];
        return;
      }
      if (key === 'groups') {
        copy.groups = (view.groups || []).map(function (group) {
          return {
            title: group.title,
            items: (group.items || []).map(function (item) {
              var next = {};
              Object.keys(item || {}).forEach(function (k) {
                if (k === 'photoSrcs') next.photoSrcs = [];
                else if (k === 'photos' && Array.isArray(item.photos)) next.photos = [];
                else next[k] = item[k];
              });
              if (typeof next.photos === 'number') next.photos = 0;
              return next;
            })
          };
        });
        return;
      }
      if (key === 'checklistFindings') {
        copy.checklistFindings = (view.checklistFindings || []).map(function (item) {
          var next = {};
          Object.keys(item || {}).forEach(function (k) {
            next[k] = k === 'photos' ? [] : item[k];
          });
          return next;
        });
        return;
      }
      copy[key] = view[key];
    });
    return copy;
  }
  function slimPhotoHist(records) {
    var copy = lighten(records);
    Object.keys(copy).forEach(function (name) {
      var periods = copy[name].periods || {};
      Object.keys(periods).forEach(function (k) {
        if (periods[k] && periods[k].histView) periods[k].histView = slimHistView(periods[k].histView);
      });
    });
    return copy;
  }
  function metaOnly(records) {
    var meta = {};
    Object.keys(records || {}).forEach(function (name) {
      var rec = records[name] || {};
      meta[name] = {
        status: rec.status, inspector: rec.inspector, grade: rec.grade,
        checkType: rec.checkType, opinion: rec.opinion, at: rec.at, periods: {}
      };
      if (rec.periods) {
        Object.keys(rec.periods).forEach(function (k) {
          var p = rec.periods[k] || {};
          meta[name].periods[k] = {
            status: p.status, inspector: p.inspector, grade: p.grade,
            checkType: p.checkType, opinion: p.opinion, at: p.at,
            histView: slimHistView(p.histView)
          };
        });
      }
    });
    return meta;
  }
  function write(records) {
    var attempts = [lighten(records), slimPhotoHist(records), metaOnly(records)];
    var saved = null;
    for (var i = 0; i < attempts.length; i++) {
      try {
        saved = JSON.stringify(attempts[i]);
        localStorage.setItem(KEY, saved);
        break;
      } catch (e) { saved = null; }
    }
    if (saved) {
      try { sessionStorage.setItem(KEY, saved); } catch (e) {}
    }
    writeFlags(records);
  }
  return { read: read, write: write };
})();

(function () {
  var overlay = document.getElementById('infoOverlay');
  var fab = document.getElementById('infoFab');
  var detailHistData = [];
  var currentInfoFacility = null;
  var infoHeaderBackup = { title: '', sub: '' };
  var infoRecordOpen = false;

  var FACILITY_INFO = {
    'A계류시설': {
      name: 'A계류시설',
      loc: '목포항 > 목포항',
      kind: '계류시설',
      kindClass: '기타',
      itemType: '안벽',
      date: '2020-12-21',
      grade: 'B',
      gradeScore: '4.00',
      gradeTxt: '보통',
      tide: '중력식',
      image: '../assets/sample-site-2.png',
      port: '목포항(목포항)',
      cargo: '컨테이너화물',
      agency: '목포지방해양수산청',
      built: '1997-12-22',
      struct: '중력식',
      open: '출입제한',
      berth: '#3,#4,#5',
      repair: '2017',
      length: '1,093',
      spec: '케이슨식',
      quake: '내진성능 확보',
      capacity: '5만톤',
      portClass: '국가관리무역항'
    },
    '파제제': {
      name: '파제제',
      loc: '목포항 > 목포항',
      kind: '외곽시설',
      kindClass: '기타',
      itemType: '방파제',
      date: '2026-06-18',
      grade: 'A',
      gradeScore: '4.60',
      gradeTxt: '양호',
      tide: '돌핀식',
      image: '../assets/sample-site-1.png',
      port: '목포항(목포항)',
      cargo: '잡화',
      agency: '목포지방해양수산청',
      built: '2003-06-30',
      struct: '돌핀식',
      open: '출입제한',
      berth: '#1',
      repair: '2021',
      length: '180',
      spec: '강관파일',
      quake: '내진성능 확보',
      capacity: '3만톤',
      portClass: '국가관리무역항'
    }
  };

  function getCurrentFacility() {
    var name = '';
    try {
      var raw = sessionStorage.getItem('pomsInspectFacility');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.name) name = String(parsed.name).trim();
      }
    } catch (e) { /* ignore */ }
    if (!name) {
      var title = document.getElementById('inspectHdTitle');
      if (title) name = title.textContent.replace(/\s+/g, ' ').trim();
    }
    return FACILITY_INFO[name] || FACILITY_INFO['A계류시설'];
  }
  window.getInspectFacility = getCurrentFacility;

  function histPeriodTitle(h) {
    var type = (h && h.checkType) || '';
    if (/하반기/.test(type)) return '정기안전점검(하반기)';
    if (/상반기/.test(type)) return '정기안전점검(상반기)';
    var m = parseInt(String((h && h.date) || '').replace(/\./g, '-').slice(5, 7), 10);
    return (m >= 7) ? '정기안전점검(하반기)' : '정기안전점검(상반기)';
  }
  function histDateText(h) {
    var d = String((h && h.date) || '');
    var matched = d.match(/^\d{4}-\d{2}-\d{2}/);
    return matched ? matched[0] : d;
  }
  function histDateSortValue(h) {
    var raw = String((h && (h.date || h.at || h.writeDate)) || '').replace(/\./g, '-');
    var matched = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!matched) return 0;
    var t = Date.parse(matched[1] + '-' + matched[2] + '-' + matched[3] + 'T00:00:00');
    return isNaN(t) ? 0 : t;
  }
  function histPeriodRank(h) {
    return /하반기/.test(histPeriodTitle(h)) ? 1 : 0;
  }
  function histYearPeriodKey(h) {
    return String(histDateText(h) || '').slice(0, 4) + histPeriodTitle(h);
  }
  function bOuterSubmittedHist() {
    return [
      {
        date: '2026-06-18', name: '이책임', grade: '양호', status: '제출',
        checkType: '정기안전점검(상반기)',
        opinion: '상반기 정기안전점검 결과, 본체 및 기초부 상태는 양호하며 즉시 조치가 필요한 중대결함은 없음.',
        isNew: true, allGood: true, agency: '한국항만안전기술(주)', cost: '15,800',
        period: '2026-05-11 ~ 2026-06-18',
        result: '상반기 점검 결과 시설물 상태는 양호하며 일상 유지관리로 충분함.',
        repairPlan: '강관파일 피복 열화 구간에 대한 추적 관찰을 권고함.',
        joinName: '박참여', writer: '이책임', writeDate: '2026-06-18'
      }
    ];
  }
  function mergeBOuterHist(h) {
    if (!h) return h;
    var list = bOuterSubmittedHist();
    for (var i = 0; i < list.length; i++) {
      if (histYearPeriodKey(list[i]) !== histYearPeriodKey(h)) continue;
      return Object.assign({}, list[i], h, {
        name: (h.name && h.name !== '-') ? h.name : list[i].name,
        grade: (h.grade && h.grade !== '-') ? h.grade : list[i].grade,
        opinion: (h.opinion && h.opinion !== '-') ? h.opinion : list[i].opinion,
        status: h.status || list[i].status,
        checkType: h.checkType || list[i].checkType,
        isNew: true,
        allGood: true
      });
    }
    return h;
  }
  function collectInspHist(facility) {
    var firstYear = parseInt(String((facility && facility.date) || '').slice(0, 4), 10) || 2025;
    var savedRecords = (window.pomsInspectStore && window.pomsInspectStore.read()) || {};
    var saved = savedRecords[facility.name];
    var list = [];
    var seen = {};
    function pushHist(h) {
      if (!h) return;
      var item = (facility.name === '파제제' || facility.name === 'A계류시설') ? mergeBOuterHist(h) : h;
      var key = histYearPeriodKey(item);
      if (seen[key]) return;
      seen[key] = true;
      list.push(item);
    }
    function pushSavedHist(entry) {
      if (!entry || (entry.status !== '제출' && entry.status !== '임시저장')) return;
      var view = entry.histView || {};
      pushHist(Object.assign({}, view, {
        date: entry.at, name: view.inspector || entry.inspector || '-', grade: view.gradeTxt || entry.grade || '-',
        status: entry.status, checkType: entry.checkType || view.title || '정기안전점검',
        opinion: view.result || entry.opinion || '-', isNew: true, fromSave: !!entry.histView
      }));
    }
    if (saved && saved.periods) {
      pushSavedHist(saved.periods['상반기']);
      pushSavedHist(saved.periods['하반기']);
    } else if (saved) {
      pushSavedHist(saved);
    }
    if (facility.name === '파제제' || facility.name === 'A계류시설') bOuterSubmittedHist().forEach(pushHist);
    [
      { date: facility.date, name: '홍길동', grade: facility.gradeTxt || '양호' },
      { date: (firstYear - 1) + '-06-18', name: '책임성명', grade: '양호' },
      { date: (firstYear - 2) + '-05-10', name: '김서울25', grade: '양호' },
      { date: (firstYear - 3) + '-04-22', name: '붕만식', grade: '양호' }
    ].forEach(pushHist);
    list.sort(function (a, b) {
      var diff = histDateSortValue(b) - histDateSortValue(a);
      if (diff) return diff;
      return histPeriodRank(b) - histPeriodRank(a);
    });
    return list;
  }
  function escapeInfoHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function infoGridHtml(rows) {
    return '<div class="detail-grid">' + rows.map(function (row) {
      var cellsHtml = row.cells.map(function (cell, idx) {
        var cls = row.full ? 'detail-cell' : (idx === 0 ? 'detail-cell detail-cell--left' : 'detail-cell detail-cell--right');
        return '<div class="' + cls + '"><span class="detail-cell__lbl">' + escapeInfoHtml(cell[0]) + '</span><div class="detail-cell__val">' + escapeInfoHtml(cell[1]) + '</div></div>';
      }).join('');
      return '<div class="detail-grid__row' + (row.full ? ' is-full' : '') + '">' + cellsHtml + '</div>';
    }).join('') + '</div>';
  }
  function infoSecHdHtml(title) {
    return '<div class="detail-sec-hd"><img class="detail-sec-ico" src="assets/main/detail-info.svg" alt=""><b>' + escapeInfoHtml(title) + '</b></div>';
  }
  function infoNoteHtml(label, value) {
    return '<div class="insp-note"><span class="detail-cell__lbl">' + escapeInfoHtml(label) + '</span><div class="insp-note__val">' + escapeInfoHtml(value) + '</div></div>';
  }
  function resultBadgeClass(result) {
    if (result === '보통') return ' insp-result-badge--b';
    if (result === '불량' || result === '미흡') return ' insp-result-badge--c';
    return '';
  }
  function addDays(dateText, days) {
    var d = new Date(String(dateText || '').replace(/\./g, '-') + 'T00:00:00');
    if (isNaN(d.getTime())) return dateText || '-';
    d.setDate(d.getDate() + days);
    var m = String(d.getMonth() + 1);
    var day = String(d.getDate());
    if (m.length < 2) m = '0' + m;
    if (day.length < 2) day = '0' + day;
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function statusGradeFromText(grade) {
    var g = String(grade || '').trim();
    if (!g || g === '-') return '-';
    if (/양호|^A등급?$/i.test(g)) return '양호';
    if (/보통|^B등급?$/i.test(g)) return '보통';
    if (/불량|미흡|^C등급?$/i.test(g)) return '불량';
    return g;
  }
  window.statusGradeFromText = statusGradeFromText;
  var MOKPO_ORG = '목포지방해양수산청';
  function isMokpoFacility(facility) {
    var text = ((facility && facility.loc) || '') + ' ' + ((facility && facility.port) || '') + ' ' + ((facility && facility.name) || '');
    return text.indexOf('목포') !== -1;
  }
  function applyMokpoOrg(data, facility) {
    if (!data || !isMokpoFacility(facility)) return data;
    data.owner = MOKPO_ORG;
    data.writerOrg = MOKPO_ORG;
    data.leadOrg = MOKPO_ORG;
    data.joinOrg = MOKPO_ORG;
    (data.historyTechs || []).forEach(function (tech) { tech.org = MOKPO_ORG; });
    return data;
  }
  function summaryOpinionText(name, firstHalf) {
    if (name === '특기사항') {
      return firstHalf
        ? '폐기물·적치물 없음. 출입제한 구간은 현행 유지.'
        : '특기사항 없음. 상반기와 동일.';
    }
    if (name === '점검자 의견') {
      return firstHalf
        ? '전반적으로 양호하며 지속적인 유지·관찰이 필요함.'
        : '전반 양호. 지속 관찰 예정.';
    }
    return '';
  }
  function opinionHasContent(text) {
    var opinion = String(text == null ? '' : text).trim();
    return !!(opinion && opinion !== '-' && opinion !== '의견없음' && opinion !== '이상없음');
  }
  function withSummaryOpinions(data) {
    if (!data) return data;
    var firstHalf = String(data.title || '').indexOf('하반기') === -1;
    (data.groups || []).forEach(function (group) {
      if (group.title !== '종합의견') return;
      (group.items || []).forEach(function (item) {
        if (opinionHasContent(item.opinion)) return;
        var text = summaryOpinionText(item.name, firstHalf);
        if (text) item.opinion = text;
      });
    });
    return data;
  }
  function withSummaryFindings(raw, groups) {
    var list = (raw || []).slice();
    var names = {};
    list.forEach(function (item) { if (item && item.name) names[item.name] = true; });
    (groups || []).forEach(function (group) {
      if (group.title !== '종합의견') return;
      (group.items || []).forEach(function (item) {
        if (!item || !item.name || names[item.name]) return;
        names[item.name] = true;
        var opinion = String(item.opinion || '').trim();
        list.push({
          name: item.name,
          opinion: (!opinion || opinion === '-') ? '의견없음' : opinion,
          result: '',
          repair: '',
          photos: []
        });
      });
    });
    return list;
  }
  function buildInspReportData(h, facility) {
    facility = facility || {};
    if (h && h.fromSave) {
      var gradeTxt = h.gradeTxt || h.grade || '-';
      var savedReport = applyMokpoOrg({
        fromSave: true,
        title: h.title || histPeriodTitle(h),
        date: h.date || h.writeDate || histDateText(h),
        period: h.period || '-',
        inspector: h.inspector || h.name || '-',
        gradeTxt: statusGradeFromText(gradeTxt),
        statusGrade: statusGradeFromText(h.statusGrade || h.safetyGrade || gradeTxt),
        safetyGrade: statusGradeFromText(h.safetyGrade || gradeTxt),
        agency: h.agency || '-',
        cost: h.cost || '-',
        result: h.result || h.opinion || '-',
        repairPlan: h.repairPlan || '-',
        writer: h.writer || '-',
        writerOrg: h.writerOrg || '-',
        writerPos: h.writerPos || '-',
        writerPhone: h.writerPhone || '-',
        writeDate: h.writeDate || histDateText(h),
        joinName: h.joinName || '-',
        facilityName: h.facilityName || facility.name || '-',
        owner: h.owner || facility.agency || '-',
        built: h.built || facility.built || '-',
        kind: h.kind || facility.kind || '-',
        kindClass: h.kindClass || facility.kindClass || '-',
        struct: h.struct || facility.struct || '-',
        loc: h.loc || facility.port || facility.loc || '-',
        length: h.length || facility.length || '-',
        groups: h.groups || [],
        photos: h.photos || [],
        photoSrcs: h.photoSrcs || [],
        note: h.note || '-',
        agencyType: h.agencyType || '-',
        projectName: h.projectName || '-',
        reportPeriod: h.reportPeriod || h.period || '-',
        facilityType: h.facilityType || h.kind || '-',
        typeKind: h.typeKind || '-',
        typeClass: h.typeClass || h.kindClass || '-',
        location: h.location || '-',
        scale: h.scale || '-',
        defectMajor: h.defectMajor || '-',
        defectPublic: h.defectPublic || '-',
        reportResult: h.reportResult || h.result || '-',
        reportRepair: h.reportRepair || h.repairPlan || '-',
        checklistFindings: h.checklistFindings || [],
        historyTechs: h.historyTechs || [],
        reportTechs: h.reportTechs || [],
        publicUseYn: h.publicUseYn || ''
      }, facility);
      return withSummaryOpinions(savedReport);
    }
    var date = histDateText(h);
    var periodEnd = addDays(date, 18);
    var period = date + ' ~ ' + periodEnd;
    var title = histPeriodTitle(h);
    var firstHalf = title.indexOf('상반기') !== -1;
    var inspector = h.name || '홍길동';
    var gradeTxt = statusGradeFromText(h.grade || '양호');
    var statusGrade = gradeTxt === '-' ? '양호' : gradeTxt;
    var opinion = (h.opinion && h.opinion !== '-')
      ? h.opinion
      : (firstHalf
        ? '현재 안전상태는 정기 안전점검 실시 결과에 따른 상태등급이 ' + statusGrade + '에 해당함.'
        : '시설 전반이 양호하고 상반기 지적 구간의 추가 진행은 확인되지 않음.');
    var repairPlan = h.repairPlan || (firstHalf
      ? '경사/전도 구간 모니터링을 지속하고, 방충재 마모부는 차기 보수 시 교체 예정.'
      : '상반기 보수보강 계획에 따라 방충재 교체 후 이상 없음. 현 상태 유지.');
    var itemResult = function (name, fallback) {
      if (h.allGood) return fallback || '양호';
      if (!firstHalf) return fallback || '양호';
      if (name === '경사/전도' || name === '방충재') return '보통';
      return fallback || '양호';
    };
    var groups = [
      {
        title: '상부공 및 본체부',
        items: ['침하', '경사/전도', '활동', '파손', '균열', '박리', '마모/침식', '속채움재 유실', '이격'].map(function (name) {
          var result = itemResult(name);
          return {
            name: name,
            result: result,
            opinion: result === '보통' ? '경미한 변위가 확인되어 지속 관찰이 필요함.' : '-',
            repair: result === '보통' ? 'Y' : 'N',
            photos: result === '보통' ? 2 : (name === '침하' ? 1 : 0)
          };
        })
      },
      {
        title: '부대시설',
        items: ['방충재', '계선주', '차막이'].map(function (name) {
          var result = itemResult(name);
          return {
            name: name,
            result: result,
            opinion: result === '보통' ? '표면 마모가 진행되어 차기 교체를 권고함.' : '-',
            repair: result === '보통' ? 'Y' : 'N',
            photos: result === '보통' ? 2 : 0
          };
        })
      },
      {
        title: '기타',
        items: [
          { name: '공중이 이용하는 부위', result: '양호', opinion: '-', repair: 'N', photos: 0 },
          { name: '기타', result: '양호', opinion: '-', repair: 'N', photos: 0 }
        ]
      },
      {
        title: '종합의견',
        items: [
          { name: '특기사항', result: '양호', opinion: '-', repair: 'N', photos: 0 },
          { name: '점검자 의견', result: '양호', opinion: '-', repair: 'N', photos: 0 }
        ]
      }
    ];
    var photoSrcs = [
      facility.image || 'assets/main/map-sheet-photo.jpg',
      '../assets/sample-site-1.png',
      '../assets/sample-site-2.png',
      '../assets/sample-location.png',
      '../assets/sample-section.png'
    ];
    var loc = (facility.port || facility.loc || '-') + '';
    var joinName = h.joinName || (firstHalf ? '김점검' : '이참여');
    var writerOrg = h.writerOrg || facility.agency || '-';
    var writerPos = h.writerPos || '담당';
    var builtReport = applyMokpoOrg({
      title: title, date: date, period: h.period || period, inspector: inspector, gradeTxt: gradeTxt, statusGrade: statusGrade, safetyGrade: statusGrade,
      agency: h.agency || (h.isNew ? '모바일 등록' : '자체수행'),
      result: h.result || opinion, repairPlan: repairPlan,
      writer: h.writer || inspector, writerOrg: writerOrg, writerPos: writerPos,
      writerPhone: h.writerPhone || '-', writeDate: h.writeDate || addDays(date, -10),
      joinName: joinName, facilityName: facility.name, owner: facility.agency,
      built: facility.built, kind: facility.kind, kindClass: facility.kindClass, struct: facility.struct,
      loc: loc, length: facility.length || '-', groups: groups,
      photos: [
        { src: photoSrcs[0], caption: '상부공 및 본체부' },
        { src: photoSrcs[1], caption: '상부공 및 본체부' },
        { src: photoSrcs[2], caption: '부대시설' },
        { src: photoSrcs[3], caption: '부대시설' }
      ],
      photoSrcs: photoSrcs,
      note: h.note || (h.isNew ? ('모바일 ' + (h.status || '제출')) : '-'),
      agencyType: h.agencyType || '자체',
      projectName: h.projectName || title,
      reportPeriod: h.reportPeriod || period,
      facilityType: facility.kind, typeKind: facility.kind, typeClass: facility.kindClass,
      location: loc, scale: '연장 ' + (facility.length || '-') + 'm, 구조 ' + (facility.struct || '-'),
      defectMajor: h.defectMajor || '중대한 결함 없음',
      defectPublic: h.defectPublic || '없음',
      reportResult: h.result || opinion,
      reportRepair: repairPlan,
      historyTechs: [
        { role: '책임기술자', name: inspector, org: writerOrg, position: '책임기술자', signed: true, grade: '특급', period: h.period || period },
        { role: '참여기술자', name: joinName, org: h.agency || writerOrg, position: '참여기술자', signed: true, grade: '고급', period: h.period || period }
      ],
      reportTechs: [
        { role: '책임기술자', name: inspector, grade: '특급', period: h.period || period },
        { role: '참여기술자', name: joinName, grade: '고급', period: h.period || period }
      ]
    }, facility);
    return withSummaryOpinions(builtReport);
  }
  function inspAccHeadHtml(title, extra) {
    return '<button type="button" class="insp-acc__hd">' +
      '<span class="insp-acc__title">' + title + '</span>' + (extra || '') +
      '<img class="insp-acc__chev" src="assets/main/fac-angle-down.svg" alt="" width="14" height="14">' +
    '</button>';
  }
  function displayVal(v) {
    v = String(v == null ? '' : v).trim();
    return v || '-';
  }
  function signText(signed) {
    return signed ? '서명됨' : '-';
  }
  function renderHistoryTechCard(t, join) {
    return '<div class="insp-tech-card"><span class="insp-tech-role' + (join ? ' insp-tech-role--join' : '') + '">' +
      escapeInfoHtml(t.role || (join ? '참여기술자' : '책임기술자')) + '</span>' +
      infoGridHtml([
        { cells: [['소속', displayVal(t.org)], ['서명', signText(t.signed)]] },
        { cells: [['직위', displayVal(t.position)], ['성명', displayVal(t.name)]] },
        { full: true, cells: [['과업참여기간', displayVal(t.period)]] },
        { full: true, cells: [['기술등급', displayVal(t.grade)]] }
      ]) + '</div>';
  }
  function renderSavedTechCards(techs, mode) {
    if (!techs || !techs.length) return infoNoteHtml('기술자', '등록된 기술자가 없습니다.');
    if (mode !== 'report') {
      return techs.map(function (t) {
        return renderHistoryTechCard(t, /참여/.test(t.role || ''));
      }).join('');
    }
    return techs.map(function (t) {
      var join = /참여/.test(t.role || '');
      return '<div class="insp-tech-card"><span class="insp-tech-role' + (join ? ' insp-tech-role--join' : '') + '">' +
        escapeInfoHtml(t.role || '') + '</span>' + infoGridHtml([
          { cells: [['성명', displayVal(t.name)], ['구분', displayVal(t.role)]] },
          { full: true, cells: [['과업참여기간', displayVal(t.period)]] },
          { full: true, cells: [['기술등급', displayVal(t.grade)]] }
        ]) + '</div>';
    }).join('');
  }
  function historyLeadTechs(data) {
    var leads = (data.historyTechs || []).filter(function (t) { return !/참여/.test(t.role || ''); });
    if (leads.length) return leads;
    return [{
      role: '책임기술자',
      name: data.inspector,
      org: data.leadOrg || data.writerOrg || data.owner,
      position: data.leadPos || '책임기술자',
      signed: data.leadSigned
    }];
  }
  function historyJoinTechs(data) {
    var joins = (data.historyTechs || []).filter(function (t) { return /참여/.test(t.role || ''); });
    if (joins.length) return joins;
    if (data.fromSave || !data.joinName || data.joinName === '-') return [];
    return [{
      role: '참여기술자',
      name: data.joinName,
      org: data.joinOrg || data.agency,
      position: data.joinPos || '참여기술자',
      signed: data.joinSigned
    }];
  }
  function renderInspReportHistory(data) {
    var leads = historyLeadTechs(data);
    var joins = historyJoinTechs(data);
    return infoSecHdHtml('기본정보') +
      infoGridHtml([
        { cells: [['작성자', displayVal(data.writer)], ['소속', displayVal(data.writerOrg)]] },
        { cells: [['직위', displayVal(data.writerPos)], ['작성자 연락처', displayVal(data.writerPhone)]] },
        { full: true, cells: [['작성일', displayVal(data.writeDate)]] }
      ]) +
      infoSecHdHtml('정기안전점검이력') +
      infoGridHtml([
        { cells: [['점검구분', displayVal(data.title)], ['점검진단 기관명', displayVal(data.agency)]] },
        { full: true, cells: [['점검진단기간', displayVal(data.period)]] }
      ]) +
      infoSecHdHtml('책임기술자') +
      leads.map(function (t) { return renderHistoryTechCard(t, false); }).join('') +
      infoSecHdHtml('참여기술자') +
      (joins.length
        ? joins.map(function (t) { return renderHistoryTechCard(t, true); }).join('')
        : infoNoteHtml('참여기술자', '없음'));
  }
  function renderInspReportItems(data) {
    var statusGrade = data.statusGrade || data.gradeTxt || '-';
    var summary = infoSecHdHtml('정기안전점검표') +
      infoGridHtml([
        { cells: [['시설물명', displayVal(data.facilityName)], ['관리주체', displayVal(data.owner)]] },
        { cells: [['준공 년월일', displayVal(data.built)], ['최종점검 년월일', displayVal(data.date)]] }
      ]);
    var groups = data.groups || [];
    var groupsHtml = groups.length
      ? groups.map(function (group, gi) {
        var isSummaryGroup = group.title === '종합의견';
        var itemsHtml = (group.items || []).map(function (item, ii) {
          var photoList = infoFindingPhotoList(item, data);
          var thumbs = photoList.length
            ? '<div class="insp-item-thumbs">' +
              photoList.map(function (src, n) {
                return '<button type="button" class="insp-photo-zoom" data-photo-src="' + escapeInfoHtml(src) + '" aria-label="' + escapeInfoHtml(item.name) + ' 사진 ' + (n + 1) + ' 크게 보기"><img src="' + escapeInfoHtml(src) + '" alt=""></button>';
              }).join('') + '</div>'
            : '';
          var rows = isSummaryGroup
            ? [{ full: true, cells: [['의견', displayVal(item.opinion)]] }]
            : [
              { cells: [['점검결과', displayVal(item.result)], ['보수필요여부', displayVal(item.repair)]] },
              { full: true, cells: [['의견', displayVal(item.opinion)]] }
            ];
          var extra = isSummaryGroup ? '' : '<span class="insp-result-badge' + resultBadgeClass(item.result) + '">' + escapeInfoHtml(item.result || '-') + '</span>';
          return '<div class="insp-acc insp-acc--item">' +
            inspAccHeadHtml(escapeInfoHtml(item.name), extra) +
            '<div class="insp-acc__body">' +
              infoGridHtml(rows) +
              (isSummaryGroup ? '' : (photoList.length ? infoNoteHtml('사진첨부', photoList.length + '개') + thumbs : infoNoteHtml('사진첨부', '0개'))) +
            '</div></div>';
        }).join('');
        return '<div class="insp-acc">' +
          inspAccHeadHtml(escapeInfoHtml(group.title)) +
          '<div class="insp-acc__body">' + itemsHtml + '</div></div>';
      }).join('')
      : infoNoteHtml('점검사항', '작성된 점검사항이 없습니다.');
    return summary + groupsHtml +
      infoSecHdHtml('상태등급') +
      plainDetailValHtml(statusGrade, escapeInfoHtml, 'detail-grid--grade');
  }
  function renderInspReportPhotos(data) {
    if (!data.photos || !data.photos.length) {
      return '<div class="insp-photo-head"><strong>' + escapeInfoHtml(data.facilityName) + '</strong><span>' + escapeInfoHtml(data.owner) + '</span></div>' +
        infoNoteHtml('사진대지', '첨부된 사진이 없습니다.');
    }
    return '<div class="insp-photo-head"><strong>' + escapeInfoHtml(data.facilityName) + '</strong><span>' + escapeInfoHtml(data.owner) + '</span></div>' +
      '<div class="insp-photo-grid">' +
        data.photos.map(function (photo) {
          return '<figure class="insp-photo-card"><img src="' + photo.src + '" alt="' + escapeInfoHtml(photo.caption) + '"><figcaption>' + escapeInfoHtml(photo.caption) + '</figcaption></figure>';
        }).join('') +
      '</div>';
  }
  function plainDetailValHtml(text, escapeFn, extraClass) {
    return '<div class="detail-grid' + (extraClass ? ' ' + extraClass : '') + '"><div class="detail-grid__row is-full"><div class="detail-cell"><div class="detail-cell__val">' +
      escapeFn(displayVal(text)) + '</div></div></div></div>';
  }
  var infoChecklistFindings = [];
  var INFO_SAMPLE_PHOTOS = [
    '../assets/sample-site-2.png',
    '../assets/sample-site-1.png',
    '../assets/sample-location.png',
    '../assets/sample-section.png'
  ];
  function pushInfoPhoto(list, src) {
    src = usableInfoPhotoSrc(src);
    if (!src || list.indexOf(src) !== -1) return;
    list.push(src);
  }
  function usableInfoPhotoSrc(src) {
    src = String(src || '').trim();
    if (!src || src.indexOf('blob:') === 0) return '';
    return src;
  }
  function infoReportPhotoSrcs(data) {
    var list = [];
    if (data && data.photoSrcs) data.photoSrcs.forEach(function (src) { pushInfoPhoto(list, src); });
    if (data && data.photos) {
      data.photos.forEach(function (photo) {
        pushInfoPhoto(list, typeof photo === 'string' ? photo : (photo && photo.src));
      });
    }
    return list;
  }
  function infoFindingPhotoList(item, data) {
    var srcs = [];
    if (item && Array.isArray(item.photos)) {
      item.photos.forEach(function (photo) {
        if (typeof photo === 'string') pushInfoPhoto(srcs, photo);
        else if (photo && photo.src) pushInfoPhoto(srcs, photo.src);
      });
    }
    if (item && item.photoSrcs) item.photoSrcs.forEach(function (src) { pushInfoPhoto(srcs, src); });
    var count = item && typeof item.photos === 'number' ? item.photos : 0;
    if (!srcs.length && count > 0) {
      infoReportPhotoSrcs(data).slice(0, count).forEach(function (src) { pushInfoPhoto(srcs, src); });
    }
    if (data && data.fromSave) return srcs;
    var wantsPhoto = count > 0 || (item && (item.result === '보통' || item.result === '불량' || item.repair === 'Y'));
    if (!srcs.length && wantsPhoto) {
      var pool = infoReportPhotoSrcs(data);
      if (!pool.length) pool = INFO_SAMPLE_PHOTOS;
      pool.slice(0, count > 0 ? count : 2).forEach(function (src) { pushInfoPhoto(srcs, src); });
    }
    return srcs;
  }
  function checklistItemPhotos(item, data) {
    var photos = infoFindingPhotoList(item, data);
    var name = item && item.name;
    if (!name || !data) return photos;
    (data.groups || []).forEach(function (group) {
      (group.items || []).forEach(function (gItem) {
        if (!gItem || gItem === item || gItem.name !== name) return;
        var more = infoFindingPhotoList(gItem, data);
        if (more.length > photos.length) photos = more;
      });
    });
    return photos;
  }
  function findingCarouselHtml(photos, name) {
    if (!photos || !photos.length) return '';
    var slides = photos.map(function (src, n) {
      return '<img src="' + escapeInfoHtml(src) + '" alt="' + escapeInfoHtml(name) + ' 사진 ' + (n + 1) + '" draggable="false">';
    }).join('');
    var dots = '';
    if (photos.length > 1) {
      dots = '<div class="hist-finding-sheet__fade"></div><div class="hist-finding-sheet__dots" role="tablist" aria-label="사진 넘기기">' +
        photos.map(function (_, n) {
          return '<button type="button" class="hist-finding-sheet__dot' + (n === 0 ? ' is-on' : '') + '" data-i="' + n + '" aria-label="' + (n + 1) + '번째 사진"></button>';
        }).join('') + '</div>';
    }
    return '<div class="hist-finding-sheet__track">' + slides + '</div>' + dots;
  }
  function bindFindingCarousel(photo, openPhoto) {
    var track = photo && photo.querySelector('.hist-finding-sheet__track');
    if (!track) return;
    var dots = photo.querySelectorAll('.hist-finding-sheet__dot');
    function indexOf() {
      var w = track.clientWidth || 1;
      return Math.max(0, Math.min(dots.length ? dots.length - 1 : 0, Math.round(track.scrollLeft / w)));
    }
    function syncDots() {
      var i = indexOf();
      dots.forEach(function (dot, n) { dot.classList.toggle('is-on', n === i); });
    }
    track.addEventListener('scroll', syncDots, { passive: true });
    if (photo.getAttribute('data-carousel') !== '1') {
      photo.setAttribute('data-carousel', '1');
      photo.addEventListener('click', function (e) {
        var dot = e.target.closest('.hist-finding-sheet__dot');
        var current = photo.querySelector('.hist-finding-sheet__track');
        if (!dot || !current) return;
        e.preventDefault();
        e.stopPropagation();
        var i = Number(dot.getAttribute('data-i') || 0);
        current.scrollTo({ left: i * (current.clientWidth || 0), behavior: 'smooth' });
      });
    }
    var drag = null;
    track.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      drag = { id: e.pointerId, x: e.clientX, sl: track.scrollLeft, moved: false };
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
    });
    track.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) {
        drag.moved = true;
        track.classList.add('is-dragging');
      }
      if (drag.moved) track.scrollLeft = drag.sl - dx;
    });
    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      if (drag.moved) {
        var w = track.clientWidth || 1;
        track.scrollTo({ left: Math.round(track.scrollLeft / w) * w, behavior: 'smooth' });
        track.setAttribute('data-dragged', '1');
      }
      track.classList.remove('is-dragging');
      drag = null;
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('click', function () {
      if (track.getAttribute('data-dragged') === '1') {
        track.removeAttribute('data-dragged');
        return;
      }
      var imgs = track.querySelectorAll('img');
      var img = imgs[indexOf()];
      if (img && openPhoto) openPhoto(img.getAttribute('src'));
    });
  }
  function checklistFindingsHtml(data, gridHtml, secHtml, escapeFn) {
    var raw = data.checklistFindings;
    if (!raw || !raw.length) {
      raw = (data.groups || []).reduce(function (acc, group) {
        if (group.title === '종합의견') return acc;
        (group.items || []).forEach(function (item) {
          if (item.result === '보통' || item.result === '불량' || item.repair === 'Y') acc.push(item);
        });
        return acc;
      }, []);
    }
    raw = withSummaryFindings(raw, data.groups);
    infoChecklistFindings = (raw || []).map(function (item) {
      return {
        name: item.name || '-',
        opinion: item.opinion || '-',
        result: item.result || '-',
        repair: item.repair || 'N',
        photos: checklistItemPhotos(item, data)
      };
    });
    if (!infoChecklistFindings.length) {
      return secHtml('체크리스트 결과') + plainDetailValHtml('해당항목없음', escapeFn);
    }
    return secHtml('체크리스트 결과') +
      '<div class="hist-finding-list">' +
      infoChecklistFindings.map(function (item, i) {
        return '<button type="button" class="hist-finding-row" data-finding-idx="' + i + '" aria-label="' + escapeFn(item.name) + ' 상세 보기">' +
          '<span class="detail-cell__lbl">' + escapeFn(item.name) + '</span>' +
          '<span class="hist-finding-row__val">' + escapeFn(displayVal(item.opinion)) + '</span></button>';
      }).join('') +
      '</div>';
  }
  function reportTechList(data) {
    var techs = (data.reportTechs && data.reportTechs.length) ? data.reportTechs.slice() : [{ role: '책임기술자', name: data.inspector, grade: '특급', period: data.reportPeriod || data.period }];
    if (!(data.reportTechs && data.reportTechs.length) && data.joinName && data.joinName !== '-') {
      techs.push({ role: '참여기술자', name: data.joinName, grade: '고급', period: data.reportPeriod || data.period });
    }
    var hist = data.historyTechs || [];
    return techs.map(function (tech, i) {
      var src = null;
      for (var k = 0; k < hist.length; k++) {
        if ((hist[k].role || '') === (tech.role || '') && (!tech.name || hist[k].name === tech.name)) { src = hist[k]; break; }
      }
      if (!src && hist[i] && (hist[i].role || '') === (tech.role || '')) src = hist[i];
      if (!src) return tech;
      return Object.assign({}, tech, {
        name: src.name || tech.name,
        period: src.period || tech.period,
        grade: src.grade || tech.grade
      });
    });
  }
  function publicUseYnFromData(data) {
    if (!data) return '';
    if (data.publicUseYn) return data.publicUseYn;
    var groups = data.groups || [];
    for (var i = 0; i < groups.length; i++) {
      var items = groups[i].items || [];
      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        if (item.name !== '공중이 이용하는 부위') continue;
        if (item.publicYn) return item.publicYn;
        if (item.result === '무' || item.result === '유') return item.result;
      }
    }
    return '';
  }
  function reportResultStatusRows(data, valFn) {
    valFn = valFn || displayVal;
    var rows = [
      { full: true, cells: [['중대한 결함', valFn(data.defectMajor)]] }
    ];
    if (publicUseYnFromData(data) !== '무') {
      rows.push({ full: true, cells: [['공중이 이용하는 부위에 결함', valFn(data.defectPublic)]] });
    }
    rows.push(
      { full: true, cells: [['점검 주요결과', valFn(data.reportResult || data.result)]] },
      { full: true, cells: [['주요 보수·보강', valFn(data.reportRepair || data.repairPlan)]] }
    );
    return rows;
  }
  function renderInspReportResult(data) {
    var statusGrade = data.statusGrade || data.gradeTxt || '-';
    var scale = data.scale || ((data.length || data.struct) ? ('연장 ' + displayVal(data.length) + 'm, 구조 ' + displayVal(data.struct)) : '-');
    var noteText = displayVal(data.note === '-' ? '' : data.note);
    return infoSecHdHtml('일반 정보') +
      infoGridHtml([
        { cells: [['자체/대행 구분', displayVal(data.agencyType)], ['용역명', displayVal(data.projectName || data.title)]] },
        { full: true, cells: [['점검기간', displayVal(data.reportPeriod || data.period)]] },
        { cells: [['시설물구분', displayVal(data.facilityType || data.kind)], ['종류', displayVal(data.typeKind || data.kind)]] },
        { cells: [['종별', displayVal(data.typeClass || data.kindClass)], ['상태등급', displayVal(statusGrade)]] },
        { cells: [['준공일', displayVal(data.built)], ['시설물 위치', displayVal(data.location || data.loc)]] },
        { full: true, cells: [['시설물 규모', displayVal(scale)]] }
      ]) +
      checklistFindingsHtml(data, infoGridHtml, infoSecHdHtml, escapeInfoHtml) +
      infoSecHdHtml('점검 실시결과 현황') +
      infoGridHtml(reportResultStatusRows(data, displayVal)) +
      infoSecHdHtml('책임(참여)기술자 현황') +
      renderSavedTechCards(reportTechList(data), 'report') +
      infoSecHdHtml('참고사항') +
      plainDetailValHtml(noteText, escapeInfoHtml);
  }
  function fillInspReportPanels(h) {
    var data = buildInspReportData(h, currentInfoFacility || getCurrentFacility());
    document.getElementById('infoReportPanelHistory').innerHTML = renderInspReportHistory(data);
    document.getElementById('infoReportPanelItems').innerHTML = renderInspReportItems(data);
    document.getElementById('infoReportPanelReport').innerHTML = renderInspReportResult(data);
  }
  function activateInspReportTab(mode) {
    if (mode === 'photos') mode = 'items';
    document.querySelectorAll('#infoReportTabs .seg-tab').forEach(function (tab) {
      tab.classList.toggle('is-active', tab.getAttribute('data-insp-report-tab') === mode);
    });
    document.getElementById('infoReportPanelHistory').hidden = mode !== 'history';
    document.getElementById('infoReportPanelItems').hidden = mode !== 'items';
    document.getElementById('infoReportPanelReport').hidden = mode !== 'report';
    var panels = document.getElementById('infoPanels');
    if (panels) panels.scrollTop = 0;
  }

  function fillInfoDetail() {
    closeInspRecord();
    var facility = getCurrentFacility();
    currentInfoFacility = facility;
    document.getElementById('infoKindBadge').textContent = facility.kind;

    var rows = [
      { full: true, cells: [['시설물명', facility.name]] },
      { cells: [['항명(세부항)', facility.port], ['취급화물', facility.cargo || '-']] },
      { cells: [['관리기관', facility.agency], ['점검일(최근)', facility.date]] },
      { cells: [['준공일자', facility.built], ['구조형식', facility.struct]] },
      { cells: [['항구분', facility.portClass || '국가관리무역항'], ['시설개방여부', facility.open]] },
      { cells: [['선석', facility.berth || '-'], ['보수년도(최근)', facility.repair || '-']] },
      { cells: [['연장(m)', facility.length || '-'], ['기타상세 제원', facility.spec || '-']] },
      { cells: [['종별', facility.kindClass], ['내진설계 적용여부', facility.quake]] },
      { cells: [['접안능력', facility.capacity || '-'], ['비고', '-']] },
      { cells: [['상태등급', (facility.grade || '-') + (facility.gradeScore ? ' (' + facility.gradeScore + ')' : '')], ['계획간만조석', facility.tide || facility.struct || '-']] }
    ];
    document.getElementById('infoDetailGrid').innerHTML = rows.map(function (row) {
      var cellsHtml = row.cells.map(function (cell, idx) {
        var cls = row.full ? 'detail-cell' : (idx === 0 ? 'detail-cell detail-cell--left' : 'detail-cell detail-cell--right');
        return '<div class="' + cls + '"><span class="detail-cell__lbl">' + cell[0] + '</span><div class="detail-cell__val">' + cell[1] + '</div></div>';
      }).join('');
      return '<div class="detail-grid__row' + (row.full ? ' is-full' : '') + '">' + cellsHtml + '</div>';
    }).join('');

    document.getElementById('infoPhotoGrid').innerHTML =
      '<img src="' + facility.image + '" alt="현장사진 1">' +
      '<img src="../assets/sample-site-1.png" alt="현장사진 2">' +
      '<img src="../assets/sample-location.png" alt="현장사진 3">' +
      '<img src="../assets/sample-section.png" alt="현장사진 4">';

    detailHistData = collectInspHist(facility);
    document.getElementById('infoInspHist').innerHTML = detailHistData.map(function (h, i) {
      return '<div class="ins-hist-item" data-insp-idx="' + i + '">' +
        '<div class="ins-hist-title">' + histPeriodTitle(h) + '</div>' +
        '<span class="ins-hist-date">' + histDateText(h) + '</span></div>';
    }).join('');

    document.querySelectorAll('#infoInspHist .ins-hist-item').forEach(function (el) {
      el.addEventListener('click', function () {
        openInspRecord(Number(el.getAttribute('data-insp-idx')));
      });
    });
  }

  function activateDetailTab(mode) {
    document.querySelectorAll('#infoDetailTabs .seg-tab').forEach(function (tab) {
      tab.classList.toggle('is-active', tab.getAttribute('data-detail-tab') === mode);
    });
    document.getElementById('infoPanelInfo').hidden = mode !== 'info';
    document.getElementById('infoPanelPhoto').hidden = mode !== 'photo';
    document.getElementById('infoPanelInspect').hidden = mode !== 'inspect';
    document.getElementById('infoPanelPrecision').hidden = mode !== 'precision';
    if (mode === 'inspect') closeInspRecord();
    var panels = document.getElementById('infoPanels');
    if (panels) panels.scrollTop = 0;
  }

  function openInspRecord(idx) {
    var h = detailHistData[idx];
    if (!h) return;
    var titleEl = document.getElementById('inspectHdTitle');
    var subEl = document.getElementById('inspectHdSub');
    infoHeaderBackup.title = titleEl ? titleEl.textContent : '';
    infoHeaderBackup.sub = subEl ? subEl.textContent : '';
    if (titleEl) titleEl.textContent = histPeriodTitle(h);
    if (subEl) subEl.textContent = ((currentInfoFacility && currentInfoFacility.name) || '') + ' · ' + histDateText(h);
    fillInspReportPanels(h);
    activateInspReportTab('history');
    overlay.classList.add('is-insp-report');
    var inner = overlay.closest('.phone-inner');
    if (inner) inner.classList.add('is-insp-report');
    document.getElementById('infoDetailTabs').hidden = true;
    document.getElementById('infoReportTabs').hidden = false;
    document.getElementById('infoInspHistListView').hidden = true;
    document.getElementById('infoInspHistRecordView').hidden = false;
    document.getElementById('infoReportFab')?.classList.remove('is-hidden');
    infoRecordOpen = true;
    var panels = document.getElementById('infoPanels');
    if (panels) panels.scrollTop = 0;
    placeInfoOverlay();
  }

  function closeInspRecord() {
    var titleEl = document.getElementById('inspectHdTitle');
    var subEl = document.getElementById('inspectHdSub');
    if (infoRecordOpen && infoHeaderBackup.title && titleEl) {
      titleEl.textContent = infoHeaderBackup.title;
      if (subEl) subEl.textContent = infoHeaderBackup.sub;
    }
    if (overlay) overlay.classList.remove('is-insp-report');
    var inner = overlay && overlay.closest('.phone-inner');
    if (inner) inner.classList.remove('is-insp-report');
    var detailTabs = document.getElementById('infoDetailTabs');
    var reportTabs = document.getElementById('infoReportTabs');
    if (detailTabs) detailTabs.hidden = false;
    if (reportTabs) reportTabs.hidden = true;
    var listView = document.getElementById('infoInspHistListView');
    var recordView = document.getElementById('infoInspHistRecordView');
    if (listView) listView.hidden = false;
    if (recordView) recordView.hidden = true;
    document.getElementById('infoReportFab')?.classList.add('is-hidden');
    closeInfoPhoto();
    closeInfoFinding();
    infoRecordOpen = false;
    placeInfoOverlay();
  }

  function placeInfoOverlay() {
    var inner = overlay && overlay.closest('.phone-inner');
    if (!overlay || !inner) return;
    var hd = inner.querySelector(':scope > .page-hd');
    var nav = inner.querySelector(':scope > .inspect-bottom-nav');
    var innerTop = inner.getBoundingClientRect().top;
    overlay.style.top = hd ? Math.round(hd.getBoundingClientRect().bottom - innerTop) + 'px' : '0px';
    overlay.style.bottom = (nav ? nav.offsetHeight : 0) + 'px';
  }

  var infoHeaderBackup = null;
  function applyInfoHeader() {
    var facility = getCurrentFacility();
    var title = document.getElementById('inspectHdTitle');
    var sub = document.getElementById('inspectHdSub');
    var menu = document.querySelector('.phone-inner--inspect > .page-hd .page-hd__menu img');
    if (!infoHeaderBackup && title && sub) {
      infoHeaderBackup = {
        title: title.textContent,
        sub: sub.textContent,
        menu: menu ? menu.getAttribute('src') : ''
      };
    }
    if (title) title.textContent = facility.name || title.textContent;
    if (sub) {
      var loc = String(facility.loc || '').replace(/\s*>\s*/g, '·');
      sub.textContent = (loc + ' ' + (facility.kind || '')).trim();
    }
    if (menu) menu.setAttribute('src', 'assets/main/detail-menu.svg');
  }
  function restoreInfoHeader() {
    if (!infoHeaderBackup) return;
    var title = document.getElementById('inspectHdTitle');
    var sub = document.getElementById('inspectHdSub');
    var menu = document.querySelector('.phone-inner--inspect > .page-hd .page-hd__menu img');
    if (title) title.textContent = infoHeaderBackup.title;
    if (sub) sub.textContent = infoHeaderBackup.sub;
    if (menu && infoHeaderBackup.menu) menu.setAttribute('src', infoHeaderBackup.menu);
    infoHeaderBackup = null;
  }

  var inspectOverlayPushed = false;
  var ignoreInspectPop = false;

  function openInfoOverlay() {
    if (!overlay) return;
    fillInfoDetail();
    applyInfoHeader();
    activateDetailTab('info');
    var inner = overlay.closest('.phone-inner');
    if (inner) inner.classList.add('is-info-open');
    overlay.hidden = false;
    placeInfoOverlay();
    fab?.classList.add('is-hidden');
    document.getElementById('inspectFormFooter')?.classList.add('is-hidden');
    if (!inspectOverlayPushed) {
      history.pushState({ pomsInspectOverlay: 1 }, '');
      inspectOverlayPushed = true;
    }
  }

  function hideInfoOverlay() {
    if (!overlay) return;
    closeInspRecord();
    restoreInfoHeader();
    overlay.hidden = true;
    overlay.style.top = '';
    overlay.style.bottom = '';
    var inner = overlay.closest('.phone-inner');
    if (inner) inner.classList.remove('is-info-open');
    fab?.classList.remove('is-hidden');
    document.getElementById('inspectFormFooter')?.classList.remove('is-hidden');
  }

  function closeInfoOverlay() {
    hideInfoOverlay();
    if (!inspectOverlayPushed) return;
    inspectOverlayPushed = false;
    ignoreInspectPop = true;
    history.back();
  }

  window.addEventListener('popstate', function () {
    if (ignoreInspectPop) {
      ignoreInspectPop = false;
      return;
    }
    var recordView = document.getElementById('infoInspHistRecordView');
    if (overlay && !overlay.hidden && recordView && !recordView.hidden) {
      closeInspRecord();
      history.pushState({ pomsInspectOverlay: 1 }, '');
      inspectOverlayPushed = true;
      return;
    }
    if (overlay && !overlay.hidden) {
      inspectOverlayPushed = false;
      hideInfoOverlay();
    }
  });

  function handleInfoOverlayBack() {
    var recordView = document.getElementById('infoInspHistRecordView');
    if (recordView && !recordView.hidden) {
      closeInspRecord();
      return;
    }
    closeInfoOverlay();
  }

  document.querySelectorAll('#infoDetailTabs .seg-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateDetailTab(tab.getAttribute('data-detail-tab'));
    });
  });
  document.querySelectorAll('#infoReportTabs .seg-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateInspReportTab(tab.getAttribute('data-insp-report-tab'));
    });
  });
  function openInfoPhoto(src) {
    var box = document.getElementById('infoPhotoLightbox');
    var img = document.getElementById('infoPhotoLightboxImg');
    if (!box || !img || !src) return;
    img.src = src;
    box.hidden = false;
    window.pomsBackLayer.opened('infoPhoto', closeInfoPhoto);
  }
  function closeInfoPhoto() {
    var box = document.getElementById('infoPhotoLightbox');
    if (box) box.hidden = true;
    window.pomsBackLayer.closedByUi('infoPhoto');
  }
  function openInfoFinding(item) {
    var sheet = document.getElementById('infoFindingSheet');
    var body = document.getElementById('infoFindingBody');
    var photo = document.getElementById('infoFindingPhoto');
    if (!sheet || !body || !item) return;
    function row(lbl, val) {
      return '<div class="hist-finding-sheet__row"><span class="lbl">' + escapeInfoHtml(lbl) + '</span><span class="val">' + val + '</span></div>';
    }
    var badge = '<span class="insp-result-badge' + resultBadgeClass(item.result) + '">' + escapeInfoHtml(item.result || '-') + '</span>';
    var opinionOnly = item.name === '특기사항' || item.name === '점검자 의견';
    body.innerHTML = '<div class="hist-finding-sheet__ttl">' + escapeInfoHtml(item.name) + '</div>' +
      (opinionOnly ? '' : row('점검결과', badge) + row('보수필요여부', escapeInfoHtml(item.repair || 'N'))) +
      row('의견', escapeInfoHtml(item.opinion || '-')) +
      (opinionOnly ? '' : row('사진첨부', escapeInfoHtml((item.photos ? item.photos.length : 0) + '개')));
    if (photo) {
      var has = !opinionOnly && item.photos && item.photos.length;
      photo.hidden = !has;
      photo.innerHTML = has ? findingCarouselHtml(item.photos, item.name) : '';
      if (has) bindFindingCarousel(photo, openInfoPhoto);
    }
    sheet.hidden = false;
    sheet.classList.add('is-open');
    window.pomsBackLayer.opened('infoFinding', closeInfoFinding);
  }
  function closeInfoFinding() {
    var sheet = document.getElementById('infoFindingSheet');
    if (!sheet) return;
    sheet.classList.remove('is-open');
    sheet.hidden = true;
    window.pomsBackLayer.closedByUi('infoFinding');
  }
  document.getElementById('infoInspHistRecordView')?.addEventListener('click', function (e) {
    var zoom = e.target.closest('.insp-photo-zoom');
    if (zoom) {
      openInfoPhoto(zoom.getAttribute('data-photo-src'));
      return;
    }
    var finding = e.target.closest('.hist-finding-row');
    if (finding) {
      openInfoFinding(infoChecklistFindings[Number(finding.getAttribute('data-finding-idx'))]);
      return;
    }
    var hd = e.target.closest('.insp-acc__hd');
    if (!hd) return;
    var card = hd.parentElement;
    if (!card || !card.classList.contains('insp-acc')) return;
    card.classList.toggle('is-open');
  });
  document.getElementById('infoFindingSheet')?.addEventListener('click', function (e) {
    if (e.target.closest('[data-info-finding-close]')) {
      closeInfoFinding();
      return;
    }
    if (e.target.closest('.hist-finding-sheet__dot')) return;
  });
  document.getElementById('infoPhotoLightbox')?.addEventListener('click', function (e) {
    if (e.target.id === 'infoPhotoLightbox' || e.target.closest('[data-info-photo-close]')) closeInfoPhoto();
  });

  document.getElementById('infoReportFab')?.addEventListener('click', function () {
    if (typeof downloadInspectReportHwp === 'function') downloadInspectReportHwp();
  });

  document.getElementById('btnAddInspection')?.addEventListener('click', function () {
    closeInfoOverlay();
    if (window.activateInspectTab) window.activateInspectTab('checklist');
    var scroll = document.getElementById('inspectScroll');
    if (scroll) scroll.scrollTo({ top: 0, behavior: 'smooth' });
  });

  fab?.addEventListener('click', openInfoOverlay);
  var inspectBack = document.getElementById('inspectBackBtn');
  function goInspectBack() {
    if (overlay && !overlay.hidden) {
      handleInfoOverlayBack();
      return;
    }
    if (history.length > 1) {
      history.back();
      return;
    }
    try { sessionStorage.setItem('pomsReturnPhone', 'phoneInspect'); } catch (e) {}
    window.location.href = 'mobile_main.html';
  }
  inspectBack?.addEventListener('click', goInspectBack);
  inspectBack?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goInspectBack();
    }
  });

  overlay?.querySelectorAll('.info-bottom-nav .bn-item[data-go]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      try { sessionStorage.setItem('pomsReturnPhone', btn.getAttribute('data-go') || 'phoneHome'); } catch (e) {}
      window.location.href = 'mobile_main.html';
    });
  });

  if (window.location.hash === '#info') openInfoOverlay();
})();
(function () {
  var phone1TabBar = document.getElementById('phone1TabBar');
  var phone1ChecklistView = document.getElementById('phone1ChecklistView');
  var phone1ReportView = document.getElementById('phone1ReportView');
  var phone1Scroll = document.getElementById('phone1Scroll');
  var inspectTabBar = document.getElementById('inspectTabBar');
  var checklistView = document.getElementById('inspectChecklistView');
  var reportView = document.getElementById('inspectReportView');
  var historyView = document.getElementById('inspectHistoryView');
  var checklistFooter = document.getElementById('inspectChecklistFooter');
  var reportFooter = document.getElementById('inspectReportFooter');
  var formFooter = document.getElementById('inspectFormFooter');
  var inspectScroll = document.getElementById('inspectScroll');
  var infoFab = document.getElementById('infoFab');
  function syncTabBar(tabBar, tab) {
    if (!tabBar) return;
    tabBar.querySelectorAll('.tab-item').forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-inspect-tab') === tab);
    });
  }

  function closeChecklistDropdowns() {
    var view = document.getElementById('inspectChecklistView');
    if (!view) return;
    view.querySelectorAll('.check-group, .check-item').forEach(function (card) {
      card.classList.remove('is-open');
      var body = card.querySelector(':scope > .coll-body');
      if (body) body.classList.add('hidden');
      var ic = card.querySelector(':scope > .coll-hd .coll-ic');
      if (ic) ic.classList.remove('open');
      var arrow = ic && ic.querySelector('img');
      if (arrow) arrow.style.transform = '';
    });
  }

  function activateInspectTab(tab) {
    var isReport = tab === 'report';
    var isHistory = tab === 'history';
    var isChecklist = !isReport && !isHistory;
    var enteringChecklist = isChecklist && !!(checklistView && checklistView.hidden);

    if (phone1ChecklistView) phone1ChecklistView.hidden = !isChecklist;
    if (phone1ReportView) phone1ReportView.hidden = !isReport;
    if (checklistView) checklistView.hidden = !isChecklist;
    if (reportView) reportView.hidden = !isReport;
    if (historyView) historyView.hidden = !isHistory;

    checklistFooter?.classList.toggle('is-hidden', isReport);
    reportFooter?.classList.toggle('is-hidden', !isReport);
    document.getElementById('btnChecklistEdit')?.classList.toggle('is-hidden', !isChecklist);
    formFooter?.classList.toggle('is-hidden', false);
    infoFab?.classList.toggle('is-hidden', isReport);

    syncTabBar(phone1TabBar, tab);
    syncTabBar(inspectTabBar, tab);
    if (enteringChecklist) closeChecklistDropdowns();

    if (window.pomsCloseChecklistResultSheet) window.pomsCloseChecklistResultSheet();
    if (isReport && window.pomsSyncReportSafetyGrade) window.pomsSyncReportSafetyGrade();
    if (isReport && window.pomsSyncReportFromHistory) window.pomsSyncReportFromHistory();
    if (isReport && window.pomsSyncReportTechsFromHistory) window.pomsSyncReportTechsFromHistory(false, true);
    if (isReport && window.pomsSyncReportChecklistResults) window.pomsSyncReportChecklistResults();
    if (isReport && window.pomsSyncReportPublicDefectField) window.pomsSyncReportPublicDefectField();
    if (isReport && window.pomsSyncInspectorOpinionToReport) window.pomsSyncInspectorOpinionToReport(false);

    if (phone1Scroll) phone1Scroll.scrollTop = 0;
    if (inspectScroll) inspectScroll.scrollTop = 0;
  }

  function bindInspectTabs(tabBar) {
    if (!tabBar) return;
    tabBar.querySelectorAll('.tab-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var tab = item.getAttribute('data-inspect-tab');
        if (window.pomsCanOpenInspectTab && !window.pomsCanOpenInspectTab(tab)) return;
        activateInspectTab(tab);
      });
    });
  }
  window.pomsActivateInspectTab = activateInspectTab;

  bindInspectTabs(phone1TabBar);
  bindInspectTabs(inspectTabBar);
  activateInspectTab('history');

  document.getElementById('btnReportSubmit')?.addEventListener('click', function () {
    if (window.pomsInspectPeriodOpen && !window.pomsInspectPeriodOpen()) return;
    if (window.pomsValidateHistory && !window.pomsValidateHistory()) return;
    if (window.pomsValidateChecklistStep && !window.pomsValidateChecklistStep()) return;
    if (window.pomsValidateReport && !window.pomsValidateReport()) return;
    openReportSubmitConfirm();
  });

  (function initRptTechMouseDrag() {
    var wrap = document.querySelector('#inspectReportView .rpt-tech-wrap');
    if (!wrap) return;
    var dragging = false;
    var startX = 0;
    var startLeft = 0;

    wrap.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      if (e.target.closest('input, select, button, textarea, a, label')) return;
      dragging = true;
      startX = e.clientX;
      startLeft = wrap.scrollLeft;
      wrap.classList.add('is-dragging');
      e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      wrap.scrollLeft = startLeft - (e.clientX - startX);
    });

    window.addEventListener('mouseup', function () {
      if (!dragging) return;
      dragging = false;
      wrap.classList.remove('is-dragging');
    });

    wrap.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (wrap.scrollWidth <= wrap.clientWidth) return;
      wrap.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive: false });
  })();


  window.activateInspectTab = activateInspectTab;
  activateInspectTab('history');
})();

/* 사이드 드로어 (홈 화면과 동일) */
(function () {
  var DRAWER_MENUS = [
    { id: 'phoneFacility', label: '시설물 조회',
      subs: [{ label: '위치 기반', phone: 'phoneFacility', mode: 'location' }, { label: '키워드 기반', phone: 'phoneFacility', mode: 'keyword' }] },
    { id: 'phoneInspect', label: '정기안전점검',
      subs: [{ label: '작성중', phone: 'phoneInspect', mode: 'draft' }, { label: '위치 기반', phone: 'phoneInspect', mode: 'location' }, { label: '키워드 기반', phone: 'phoneInspect', mode: 'keyword' }] },
    { id: 'phoneMap', label: '지도조회' }
  ];

  function goMain(phoneId) {
    try { sessionStorage.setItem('pomsReturnPhone', phoneId || 'phoneHome'); } catch (e) {}
    window.location.href = 'mobile_main.html';
  }

  function buildDrawerIco(item) {
    if (item.id === 'phoneFacility') {
      return '<span class="app-drawer__ico app-drawer__ico--facility" aria-hidden="true">' +
        '<img class="fig-leaf fig-leaf-a" src="assets/main/drawer-leaf/facility-a.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-b" src="assets/main/drawer-leaf/facility-b.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-c" src="assets/main/drawer-leaf/facility-c.svg" alt="">' +
      '</span>';
    }
    if (item.id === 'phoneMap') {
      return '<span class="app-drawer__ico app-drawer__ico--map" aria-hidden="true">' +
        '<img class="fig-leaf fig-leaf-a" src="assets/main/drawer-leaf/map-a.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-b" src="assets/main/drawer-leaf/map-b.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-c" src="assets/main/drawer-leaf/map-c.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-d" src="assets/main/drawer-leaf/map-d.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-e" src="assets/main/drawer-leaf/map-e.svg" alt="">' +
      '</span>';
    }
    if (item.id === 'phoneInspect') {
      return '<span class="app-drawer__ico app-drawer__ico--inspect" aria-hidden="true">' +
        '<img class="fig-leaf fig-leaf-a fig-off" src="assets/main/drawer-leaf/inspect-a.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-b fig-off" src="assets/main/drawer-leaf/inspect-b.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-c fig-off" src="assets/main/drawer-leaf/inspect-c.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-d fig-off" src="assets/main/drawer-leaf/inspect-c.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-a fig-on" src="assets/main/drawer-leaf/inspect-a-on.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-b fig-on" src="assets/main/drawer-leaf/inspect-b-on.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-c fig-on" src="assets/main/drawer-leaf/inspect-c.svg" alt="">' +
        '<img class="fig-leaf fig-leaf-d fig-on" src="assets/main/drawer-leaf/inspect-c.svg" alt="">' +
      '</span>';
    }
    return '<span class="app-drawer__ico" aria-hidden="true"></span>';
  }

  function buildDrawerCaret() {
    return '<span class="app-drawer__caret" aria-hidden="true">' +
      '<img class="is-off" src="assets/main/drawer-caret-down.svg" alt="" width="14" height="14">' +
      '<img class="is-on" src="assets/main/drawer-caret-up.svg" alt="" width="14" height="14">' +
    '</span>';
  }

  function buildDrawerHtml() {
    var items = DRAWER_MENUS.map(function (item) {
      var hasSub = !!(item.subs && item.subs.length);
      var row = '<button type="button" class="app-drawer__item" data-phone="' + item.id + '"' +
          (hasSub ? ' data-sub="1"' : '') + '>' +
        buildDrawerIco(item) +
        '<span class="app-drawer__label">' + item.label + '</span>' +
        (hasSub ? buildDrawerCaret() : '') +
      '</button>';
      if (!hasSub) return row;
      var subs = item.subs.map(function (sb) {
        return '<button type="button" class="app-drawer__sub" data-phone="' + sb.phone + '"' +
          (sb.mode ? ' data-mode="' + sb.mode + '"' : '') + '>' + sb.label + '</button>';
      }).join('');
      return '<div class="app-drawer__group">' + row +
        '<div class="app-drawer__subs">' + subs + '</div></div>';
    }).join('');

    return '<div class="app-drawer-dim" aria-hidden="true"></div>' +
      '<aside class="app-drawer" aria-label="전체 메뉴" aria-hidden="true">' +
        '<div class="app-drawer__head">' +
          '<div class="app-drawer__brandline">' +
            '<span class="app-drawer__logo">' +
              '<img class="app-drawer__logo-emblem" src="assets/main/drawer-mof-emblem.svg" alt="">' +
              '<img class="app-drawer__logo-text" src="assets/main/drawer-mof-text.svg" alt="해양수산부">' +
            '</span>' +
            '<button type="button" class="app-drawer__close" aria-label="메뉴 닫기">' +
              '<img src="assets/main/drawer-close.svg" alt="" width="19" height="19">' +
            '</button>' +
          '</div>' +
          '<div class="app-drawer__brand">' +
            '<div class="app-drawer__brand-sub"><strong>항만시설물</strong> 유지관리 시스템 모바일</div>' +
            '<div class="app-drawer__brand-title">항만시설 지킴이</div>' +
          '</div>' +
        '</div>' +
        '<nav class="app-drawer__nav">' + items + '</nav>' +
      '</aside>';
  }

  function bindDrawer(host, pageHd) {
    if (!host || !pageHd || host.querySelector('.app-drawer')) return;

    var menuBtn = pageHd.querySelector('.page-hd__menu');
    if (!menuBtn) {
      menuBtn = document.createElement('button');
      menuBtn.type = 'button';
      menuBtn.className = 'page-hd__menu';
      menuBtn.title = '전체 메뉴';
      menuBtn.setAttribute('aria-label', '전체 메뉴 열기');
      menuBtn.innerHTML = '<img src="assets/main/checklist/menu.svg" alt="" width="20" height="20">';
      pageHd.appendChild(menuBtn);
    }

    var temp = document.createElement('div');
    temp.innerHTML = buildDrawerHtml();
    var dim = temp.querySelector('.app-drawer-dim');
    var drawer = temp.querySelector('.app-drawer');
    host.appendChild(dim);
    host.appendChild(drawer);

    function syncActive() {
      drawer.querySelectorAll('.app-drawer__item[data-phone]').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-phone') === 'phoneInspect');
      });
      drawer.querySelectorAll('.app-drawer__group').forEach(function (grp) {
        var item = grp.querySelector('.app-drawer__item[data-phone]');
        if (!item) return;
        if (item.getAttribute('data-phone') === 'phoneInspect') grp.classList.add('is-open');
      });
    }
    function openDrawer() {
      dim.classList.add('open');
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      syncActive();
    }
    function closeDrawer() {
      dim.classList.remove('open');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
    }

    menuBtn.addEventListener('click', openDrawer);
    dim.addEventListener('click', closeDrawer);
    drawer.querySelector('.app-drawer__close')?.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('.app-drawer__item[data-phone]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.hasAttribute('data-sub')) {
          var grp = btn.parentElement;
          var wasOpen = grp.classList.contains('is-open');
          drawer.querySelectorAll('.app-drawer__group.is-open').forEach(function (g) {
            g.classList.remove('is-open');
          });
          if (!wasOpen) grp.classList.add('is-open');
          return;
        }
        closeDrawer();
        goMain(btn.getAttribute('data-phone') || 'phoneHome');
      });
    });
    drawer.querySelectorAll('.app-drawer__sub[data-phone]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeDrawer();
        goMain(btn.getAttribute('data-phone') || 'phoneHome');
      });
    });
  }

  document.querySelectorAll('.phone-inner').forEach(function (inner) {
    var hd = inner.querySelector(':scope > .page-hd');
    if (hd) bindDrawer(inner, hd);
  });
})();

document.querySelectorAll('.inspect-bottom-nav .bn-item[data-go]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    try {
      sessionStorage.setItem('pomsReturnPhone', btn.getAttribute('data-go') || 'phoneHome');
    } catch (e) {}
    window.location.href = 'mobile_main.html';
  });
});


/* 점검항목 사진 다중 등록 / 미리보기 / 삭제 */
window.pomsBindPhotoUploads = function (root) {
  var scope = root || document;
  var blocks = scope.querySelectorAll ? scope.querySelectorAll('.photo-upload-block') : [];
  blocks.forEach(function (block) {
    if (block.dataset.photoBound) return;
    var button = block.querySelector('.photo-btn');
    var input = block.querySelector('.photo-input');
    var previewList = block.querySelector('.photo-preview-list');
    var photos = [];

    if (!button || !input || !previewList) return;
    block.dataset.photoBound = '1';

    function updateCount() {}

    function addPreview(file) {
      var url = URL.createObjectURL(file);
      var id = Date.now().toString(36) + Math.random().toString(36).slice(2);

      photos.push({
        id: id,
        file: file,
        url: url
      });

      var item = document.createElement('div');
      item.className = 'photo-preview-item';
      item.dataset.photoId = id;
      item.innerHTML =
        '<img src="' + url + '" alt="' + (file.name || '등록 사진').replace(/"/g, '&quot;') + '">' +
        '<button type="button" class="photo-preview-remove" aria-label="사진 삭제">×</button>';

      previewList.appendChild(item);

      updateCount();
    }

    button.addEventListener('click', function (e) {
      if (typeof window.pomsOpenPhotoSource === 'function') window.pomsOpenPhotoSource(input, button, e);
      else input.click();
    });

    input.addEventListener('change', function () {
      var files = Array.prototype.slice.call(input.files || []);

      files.forEach(function (file) {
        if (!file.type || !file.type.startsWith('image/')) return;
        addPreview(file);
      });

      /* 같은 파일을 다시 선택해도 change가 발생하도록 초기화 */
      input.value = '';
    });

    previewList.addEventListener('click', function (e) {
      var removeBtn = e.target.closest('.photo-preview-remove');
      if (!removeBtn) return;

      var item = removeBtn.closest('.photo-preview-item');
      if (!item) return;

      var id = item.dataset.photoId;
      var index = photos.findIndex(function (photo) {
        return photo.id === id;
      });

      if (index > -1) {
        URL.revokeObjectURL(photos[index].url);
        photos.splice(index, 1);
      }

      item.remove();
      updateCount();
    });

    /* 이후 저장 API 연결 시 block._photoFiles 로 파일 배열 사용 가능 */
    Object.defineProperty(block, '_photoFiles', {
      get: function () {
        return photos.map(function (photo) { return photo.file; });
      }
    });
  });
};
window.pomsBindPhotoUploads();

(function () {
  var sheet = document.getElementById('photoSourceSheet');
  var activeInput = null;
  if (!sheet) return;
  var card = sheet.querySelector('.photo-source-sheet__card');

  function closePhotoSource() {
    sheet.hidden = true;
    activeInput = null;
    window.pomsBackLayer.closedByUi('photoSource');
  }

  function placePhotoSource(anchor, ev) {
    var inner = sheet.closest('.phone-inner');
    if (!card || !inner) return;
    var innerRect = inner.getBoundingClientRect();
    var btnRect = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : null;
    var pad = 8;
    var gap = 4;
    var cardW = card.offsetWidth || 138;
    var cardH = card.offsetHeight || 102;
    var left = btnRect ? (btnRect.left - innerRect.left) : pad;
    if (ev && ev.clientX != null) left = ev.clientX - innerRect.left - 20;
    var limit = innerRect.height - pad;
    var footer = inner.querySelector('.form-footer');
    var nav = inner.querySelector('.inspect-bottom-nav');
    if (footer) limit = Math.min(limit, footer.getBoundingClientRect().top - innerRect.top - pad);
    if (nav) limit = Math.min(limit, nav.getBoundingClientRect().top - innerRect.top - pad);
    var top = pad;
    if (btnRect) {
      var below = btnRect.bottom - innerRect.top + gap;
      var above = btnRect.top - innerRect.top - cardH - gap;
      top = (below + cardH <= limit) ? below : (above >= pad ? above : below);
    } else if (ev && ev.clientY != null) {
      top = ev.clientY - innerRect.top + gap;
    }
    if (left + cardW > innerRect.width - pad) left = innerRect.width - pad - cardW;
    if (left < pad) left = pad;
    if (top < pad) top = pad;
    card.style.left = Math.round(left) + 'px';
    card.style.top = Math.round(top) + 'px';
  }

  function openPhotoPicker(input, source) {
    if (!input) return;
    if (source === 'camera') {
      input.setAttribute('accept', 'image/*');
      input.setAttribute('capture', 'environment');
      input.removeAttribute('multiple');
    } else if (source === 'file') {
      input.setAttribute('accept', 'image/*');
      input.removeAttribute('capture');
      input.setAttribute('multiple', '');
    } else {
      input.setAttribute('accept', 'image/*');
      input.removeAttribute('capture');
      input.setAttribute('multiple', '');
    }
    closePhotoSource();
    input.click();
  }

  window.pomsOpenPhotoSource = function (input, anchor, ev) {
    activeInput = input || null;
    sheet.hidden = false;
    window.pomsBackLayer.opened('photoSource', closePhotoSource);
    placePhotoSource(anchor, ev);
  };

  sheet.addEventListener('click', function (e) {
    if (e.target.closest('[data-photo-source-dismiss]')) {
      closePhotoSource();
      return;
    }
    var item = e.target.closest('[data-photo-source]');
    if (!item) return;
    openPhotoPicker(activeInput, item.getAttribute('data-photo-source'));
  });
})();


/* ═══ 시연용: 선택 시설물 헤더 반영 + 필수입력 검증 ═══ */
(function () {
  /* 메인에서 선택한 시설물을 헤더·점검표에 반영 */
  try {
    var raw = sessionStorage.getItem('pomsInspectFacility');
    if (raw) {
      var f = JSON.parse(raw);
      var t = document.getElementById('inspectHdTitle');
      var sub = document.getElementById('inspectHdSub');
      if (t && f.name) t.textContent = f.name;
      if (sub && f.loc) sub.textContent = f.loc + (f.kind ? ' ' + f.kind : '');
    }
  } catch (e) { /* ignore */ }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayStr() {
    var now = new Date();
    return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  }
  function nowStamp() {
    var now = new Date();
    return todayStr() + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
  }
  function setDefaultWriteDate(force) {
    var el = document.getElementById('inspectWriteDate');
    if (!el) return;
    if (!force && el.value) return;
    el.value = todayStr();
  }
  function fillChecklistFacilityFields() {
    var facility = typeof window.getInspectFacility === 'function' ? window.getInspectFacility() : null;
    if (!facility) return;
    var nameEl = document.getElementById('inspectFormName');
    var agencyEl = document.getElementById('inspectFormAgency');
    var builtEl = document.getElementById('inspectFormBuilt');
    var lastEl = document.getElementById('inspectFormLastInspect');
    if (nameEl) nameEl.value = facility.name || '';
    if (agencyEl) agencyEl.value = facility.agency || '';
    if (builtEl) builtEl.value = facility.built || '';
    if (lastEl) lastEl.value = facility.date || '';
  }
  function setLockedValue(id, value) {
    var el = document.getElementById(id);
    if (el) el.value = value || '';
  }
  function fillReportFacilityFields() {
    var facility = typeof window.getInspectFacility === 'function' ? window.getInspectFacility() : null;
    if (!facility) return;
    var kind = facility.kind || '';
    var type = facility.itemType || (/외곽/.test(kind) ? '방파제' : (/계류/.test(kind) ? '안벽' : (facility.spec || '')));
    var loc = String(facility.loc || '').replace(/\s*>\s*/g, ' ');
    var scale = facility.length ? ('연장 ' + facility.length + 'm') : '';
    var built = String(facility.built || '').replace(/-/g, '.');
    setLockedValue('reportFacilityKind', kind);
    setLockedValue('reportFacilityType', type);
    setLockedValue('reportFacilityClass', facility.kindClass || '기타');
    setLockedValue('reportFacilityLoc', loc);
    setLockedValue('reportFacilityScale', scale);
    setLockedValue('reportBuiltDate', built);
    var ownerEl = document.getElementById('reportOwnerName');
    if (ownerEl) ownerEl.textContent = facility.agency || '';
  }
  function syncReportFromHistory() {
    var typeSel = document.getElementById('inspectCheckType');
    setLockedValue('reportProjectName', typeSel && typeSel.value ? typeSel.value : '');
    var start = document.getElementById('inspDiagStart');
    var end = document.getElementById('inspDiagEnd');
    setLockedValue('reportPeriodStart', start ? start.value : '');
    setLockedValue('reportPeriodEnd', end ? end.value : '');
  }
  var reportMainResultTouched = false;
  function inspectorOpinionCard() {
    var cards = checklistCards();
    for (var i = 0; i < cards.length; i++) {
      if (collTitleName(cards[i].querySelector('.coll-title')) === '점검자 의견') return cards[i];
    }
    return null;
  }
  function inspectorOpinionValue() {
    var card = inspectorOpinionCard();
    var ta = card && card.querySelector('textarea.opinion-ta');
    return ta ? String(ta.value || '') : '';
  }
  function reportMainResultField() {
    var fields = document.querySelectorAll('#inspectReportView .report-field');
    for (var i = 0; i < fields.length; i++) {
      if (txt(fields[i].querySelector(':scope > label')) !== '점검 주요결과') continue;
      return fields[i].querySelector('textarea');
    }
    return null;
  }
  function syncInspectorOpinionToReport(fromChecklist) {
    if (applyingForm) return;
    if (!fromChecklist && reportMainResultTouched) return;
    var field = reportMainResultField();
    if (!field) return;
    field.value = inspectorOpinionValue();
    if (fromChecklist) reportMainResultTouched = false;
  }
  window.pomsSyncInspectorOpinionToReport = syncInspectorOpinionToReport;
  setDefaultWriteDate();
  fillChecklistFacilityFields();

  function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function collTitleName(el) {
    return txt(el).replace(/\s*(필수|\*)\s*$/g, '').trim();
  }
  function facilityName() {
    try {
      var raw = sessionStorage.getItem('pomsInspectFacility');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.name) return String(parsed.name).trim();
      }
    } catch (e) { /* ignore */ }
    return txt(document.getElementById('inspectHdTitle')) || 'A계류시설';
  }
  function periodKey(checkType) {
    return /하반기/.test(checkType || '') ? '하반기' : '상반기';
  }
  function periodLabel(key) {
    return key === '하반기' ? '정기안전점검(하반기)' : '정기안전점검(상반기)';
  }
  var MOORING_GROUPS = [
    {
      id: 'super',
      title: '상부공 및 본체부',
      items: [
        { name: '침하', chips: ['이상없음', '침하', '일부', '확인불가'] },
        { name: '경사/전도', chips: ['이상없음', '경사', '전도', '상부공', '본체부', '침하', '확인불가'] },
        { name: '활동', chips: ['이상없음', '활동', '상부공', '본체부', '침하', '확인불가'] },
        { name: '파손', chips: ['이상없음', '파손', '균열', '상부공', '접합부', '블록', '일부', '확인불가'] },
        { name: '균열', chips: ['이상없음', '파손', '균열', '상부공', '접합부', '블록', '일부', '확인불가'] },
        { name: '박리', chips: ['이상없음', '박리', '상부공', '본체부', '침하', '확인불가'] },
        { name: '마모/침식', chips: ['이상없음', '마모', '침식', '상부공', '본체부', '침하', '확인불가'] },
        { name: '속채움재 유실', chips: ['이상없음', '속채움재 유실', '상부공', '본체부', '침하', '확인불가'] },
        { name: '이격', chips: ['이상없음', '이격', '상부공', '접합부', '케이슨', '블록', '일부', '확인불가'] }
      ]
    },
    {
      id: 'aux',
      title: '부대시설',
      items: [
        { name: '방충재', chips: ['이상없음', '양호', '파손', '일부'] },
        { name: '계선주', chips: ['이상없음', '양호', '부식', '파손', '유실', '일부'] },
        { name: '차막이', chips: ['이상없음', '양호', '파손', '유실', '일부', '추락위험'] }
      ]
    },
    {
      id: 'etc',
      title: '기타',
      items: [
        { name: '공중이 이용하는 부위', yn: true, chips: ['이상없음', '공중이 이용하는 부위', '기타', '침하', '확인불가'] },
        { name: '기타', chips: ['이상없음', '일부', '파손', '보수필요', '설치필요'] }
      ]
    },
    {
      id: 'summary',
      title: '종합의견',
      items: [
        { name: '특기사항', noPhoto: true, chips: ['이상없음', '폐기물', '투기', '적치물', '추락위험', '재해취약기구', '정비사업', '대상시설', '점검', '민간인', '출입', '출입제한', '기능상실', '보수', '미사용'] },
        { name: '점검자 의견', noPhoto: true, chips: ['이상없음', '전반적', '양호', '지속적', '유지', '관찰', '예정', '점검', '보수', '복구', '대책', '방안', '마련', '설치', '제거', '필요'] }
      ]
    }
  ];
  var OUTER_ETC_GROUPS = [
    {
      id: 'super',
      title: '상부공 및 직립부',
      items: [
        { name: '침하', chips: ['이상없음', '침하', '일부', '확인불가'] },
        { name: '경사/전도', chips: ['이상없음', '경사', '전도', '상부공', '직립부', '침하', '확인불가'] },
        { name: '활동', chips: ['이상없음', '활동', '상부공', '직립부', '침하', '확인불가'] },
        { name: '파손', chips: ['이상없음', '파손', '균열', '상부공', '접합부', '블록', '일부', '확인불가'] },
        { name: '균열', chips: ['이상없음', '파손', '균열', '상부공', '접합부', '블록', '일부', '확인불가'] },
        { name: '박리', chips: ['이상없음', '박리', '상부공', '직립부', '침하', '확인불가'] },
        { name: '마모/침식', chips: ['이상없음', '마모', '침식', '상부공', '직립부', '침하', '확인불가'] },
        { name: '속채움재 유실', chips: ['이상없음', '속채움재 유실', '상부공', '직립부', '침하', '확인불가'] },
        { name: '블록 및 케이슨이격', chips: ['이상없음', '이격', '상부공', '접합부', '케이슨', '블록', '일부', '확인불가'] }
      ]
    },
    {
      id: 'slope',
      title: '사석경사면',
      items: [
        { name: '사면변화', chips: ['이상없음', '사면변화', '사석경사면', '침하', '확인불가'] },
        { name: '피복석 유실', chips: ['이상없음', '유실', '사석', '소파공', 'TTP', '시점부', '중앙부', '종점부', '일부', '확인불가'] }
      ]
    },
    {
      id: 'wave',
      title: '소파공',
      items: [
        { name: '교란 및 유실', chips: ['이상없음', '유실', '사석', '소파공', 'TTP', '시점부', '중앙부', '종점부', '일부', '확인불가'] },
        { name: '파손', chips: ['이상없음', '파손', '사석', '소파공', 'TTP', '시점부', '중앙부', '종점부', '일부', '확인불가'] }
      ]
    },
    {
      id: 'base',
      title: '기초부',
      items: [
        { name: '세굴', chips: ['이상없음', '세굴', '기초부', '침하', '확인불가'] },
        { name: '기초사석교란', chips: ['이상없음', '기초사석 교란', '기초부', '침하', '확인불가'] }
      ]
    },
    {
      id: 'aux',
      title: '부대시설',
      items: [
        { name: '계선주', chips: ['이상없음', '양호', '부식', '파손', '유실', '일부'] },
        { name: '차막이', chips: ['이상없음', '양호', '파손', '유실', '일부', '추락위험'] },
        { name: '방충재', chips: ['이상없음', '양호', '파손', '일부'] },
        { name: '등대', chips: ['이상없음', '등대', '부대시설', '침하', '확인불가'] }
      ]
    },
    {
      id: 'etc',
      title: '기타',
      items: [
        { name: '공중이 이용하는 부위', yn: true, chips: ['이상없음', '공중이 이용하는 부위', '기타', '침하', '확인불가'] },
        { name: '기타', chips: ['이상없음', '일부', '파손', '보수필요', '설치필요'] }
      ]
    },
    {
      id: 'summary',
      title: '종합의견',
      items: [
        { name: '특기사항', noPhoto: true, chips: ['이상없음', '폐기물', '투기', '적치물', '추락위험', '재해취약기구', '정비사업', '대상시설', '점검', '민간인', '출입', '출입제한', '기능상실', '보수', '미사용'] },
        { name: '점검자 의견', noPhoto: true, chips: ['이상없음', '전반적', '양호', '지속적', '유지', '관찰', '예정', '점검', '보수', '복구', '대책', '방안', '마련', '설치', '제거', '필요'] }
      ]
    }
  ];
  function isOuterEtcFacility() {
    return facilityName() === '파제제';
  }
  function outerItemTitle(item) {
    return typeof item === 'string' ? item : item.name;
  }
  function outerItemIsYn(item) {
    return !!(item && typeof item === 'object' && item.yn);
  }
  function outerItemChips(item) {
    var chips = (item && typeof item === 'object' && item.chips && item.chips.length)
      ? item.chips.slice()
      : ['이상없음', '확인불가'];
    chips = chips.map(function (c) { return c === '해당없음' ? '이상없음' : c; });
    var idx = chips.indexOf('이상없음');
    if (idx > 0) {
      chips.splice(idx, 1);
      chips.unshift('이상없음');
    }
    return chips;
  }
  function tagsRowClass(chips) {
    var n = (chips || []).length;
    if (n > 0 && n <= 3) return 'tags-row tags-fit-3';
    return 'tags-row tags-fit-4';
  }
  function collHeadHtml(key, title, open, extraTitle, reqLabel) {
    var rot = open ? ' style="transform:rotate(180deg)"' : '';
    return '<div class="coll-hd" onclick="toggleSection(\'' + key + '\')">' +
      '<span class="coll-title">' + title + (extraTitle || '') + '</span>' +
      (reqLabel || '') +
      '<div class="coll-ic' + (open ? ' open' : '') + '" id="ic-' + key + '"><img src="assets/main/checklist/angle-down.svg" alt="" width="13" height="7"' + rot + '></div>' +
    '</div>';
  }
  function photoBlockHtml() {
    return '<div class="photo-upload-block">' +
      '<button type="button" class="photo-btn" aria-label="사진 등록">' +
        '<img src="assets/main/checklist/camera.svg" alt="" width="18" height="15"> 사진 등록' +
      '</button>' +
      '<input type="file" class="photo-input" accept="image/*" multiple hidden>' +
      '<div class="photo-preview-list" aria-live="polite"></div>' +
    '</div>';
  }
  function itemFieldsHtml(chips, kind, ynName, opinionPlaceholder, opinionValue) {
    var chipHtml = (chips || []).map(function (c) {
      var wide = (c || '').replace(/\s+/g, '').length >= 6 ? ' is-wide' : '';
      return '<span class="tag-chip' + wide + '">' + c + '</span>';
    }).join('');
    var html = '';
    if (kind === 'publicUse') {
      html += '<div class="field public-use-yn-field">' +
        '<div class="field-lbl">유/무 <span class="req">*</span></div>' +
        '<div class="public-use-yn-row" role="radiogroup" aria-label="유/무">' +
          '<label><input type="radio" class="public-use-yn" name="' + ynName + '" value="유"> 유</label>' +
          '<label><input type="radio" class="public-use-yn" name="' + ynName + '" value="무" checked> 무</label>' +
        '</div></div>';
    }
    var detail = '<div class="field"><div class="field-lbl">구분</div><div class="' + tagsRowClass(chips) + '">' + chipHtml + '</div></div>' +
      '<div class="field"><div class="field-lbl">점검의견 내용 작성</div><textarea class="opinion-ta" placeholder="' + (opinionPlaceholder || '내용을 입력하세요') + '">' + (opinionValue || '') + '</textarea></div>';
    if (kind !== 'plain') {
      detail += photoBlockHtml();
      detail += '<div class="result-row">' +
        '<div class="result-field"><div class="result-lbl">점검결과</div><select class="inline-sel check-result-sel"><option value="">선택</option><option>양호</option><option>보통</option><option>불량</option></select></div>' +
        '<div class="result-field"><div class="result-lbl">보수필요여부</div><select class="inline-sel check-repair-sel"><option>N</option><option>Y</option></select></div>' +
      '</div>';
    }
    if (kind === 'publicUse') html += '<div class="public-use-detail hidden">' + detail + '</div>';
    else html += detail;
    return html;
  }
  function renderGroupedChecklist(wrap, groups, prefix) {
    if (!wrap || wrap.dataset.rendered === '1') return;
    wrap.innerHTML = (groups || []).map(function (group) {
      var gKey = prefix + '-' + group.id;
      var isSummaryGroup = group.title === '종합의견';
      var itemsHtml = group.items.map(function (item, ii) {
        var iKey = gKey + '-' + ii;
        var yn = outerItemIsYn(item);
        var title = outerItemTitle(item);
        var chips = outerItemChips(item);
        var kind = yn ? 'publicUse' : ((item && item.noPhoto) || isSummaryGroup ? 'plain' : '');
        var opinionPh = isSummaryGroup ? '의견없음' : '이상없음';
        return '<div class="coll-card check-item" id="sec-' + iKey + '"' + (yn ? ' data-yn="1"' : '') + (isSummaryGroup ? ' data-summary="1"' : '') + '>' +
          collHeadHtml(iKey, title, false, '') +
          '<div class="coll-body hidden" id="body-' + iKey + '">' + itemFieldsHtml(chips, kind, 'yn-' + iKey, opinionPh, '') + '</div>' +
        '</div>';
      }).join('');
      return '<div class="coll-card check-group" id="sec-' + gKey + '">' +
        collHeadHtml(gKey, group.title, false, '', '') +
        '<div class="coll-body check-group-body hidden" id="body-' + gKey + '">' + itemsHtml + '</div>' +
      '</div>';
    }).join('');
    wrap.dataset.rendered = '1';
    if (typeof window.pomsBindPhotoUploads === 'function') window.pomsBindPhotoUploads(wrap);
    bindPublicUseYn(wrap);
  }
  function syncChecklistByFacility() {
    var outer = isOuterEtcFacility();
    var def = document.getElementById('checklistDefault');
    var wrap = document.getElementById('checklistOuterEtc');
    if (outer) renderGroupedChecklist(wrap, OUTER_ETC_GROUPS, 'outer');
    else renderGroupedChecklist(def, MOORING_GROUPS, 'moor');
    if (def) def.hidden = !!outer;
    if (wrap) wrap.hidden = !outer;
  }
  function isHiddenControl(el) {
    if (!el) return true;
    var def = document.getElementById('checklistDefault');
    var outer = document.getElementById('checklistOuterEtc');
    if (def && def.hidden && def.contains(el)) return true;
    if (outer && outer.hidden && outer.contains(el)) return true;
    return false;
  }
  function formViews() {
    return [
      document.getElementById('inspectHistoryView'),
      document.getElementById('inspectChecklistView'),
      document.getElementById('inspectReportView')
    ].filter(Boolean);
  }
  function formControls() {
    var list = [];
    formViews().forEach(function (view) {
      view.querySelectorAll('input, select, textarea').forEach(function (el) {
        if (el.type === 'file' || isHiddenControl(el)) return;
        list.push(el);
      });
    });
    return list;
  }
  var SAMPLE_PHOTO_SRCS = [
    '../assets/sample-site-1.png',
    '../assets/sample-site-2.png',
    '../assets/sample-location.png',
    '../assets/sample-section.png'
  ];
  function sampleSrcsForCount(count, i) {
    var n = Math.max(0, Number(count) || 0);
    var srcs = [];
    for (var k = 0; k < n; k++) {
      srcs.push(SAMPLE_PHOTO_SRCS[(i + k) % SAMPLE_PHOTO_SRCS.length]);
    }
    return srcs;
  }
  function samplePhotoPair(i) {
    return sampleSrcsForCount(2, i);
  }
  function photoItemHtml(src) {
    return '<div class="photo-preview-item"><img src="' + src + '" alt="등록 사진"><button type="button" class="photo-preview-remove" aria-label="사진 삭제">×</button></div>';
  }
  function visiblePhotoLists() {
    var lists = [];
    formViews().forEach(function (view) {
      view.querySelectorAll('.photo-preview-list').forEach(function (list) {
        if (isHiddenControl(list)) return;
        lists.push(list);
      });
    });
    return lists;
  }
  function buildSamplePhotoSets() {
    return visiblePhotoLists().map(function (_, i) { return samplePhotoPair(i); });
  }
  function revokePhotoBlobs(list) {
    if (!list) return;
    list.querySelectorAll('img').forEach(function (img) {
      var src = img.getAttribute('src') || '';
      if (src.indexOf('blob:') === 0) {
        try { URL.revokeObjectURL(src); } catch (e) { /* ignore */ }
      }
    });
  }
  function applyPhotoSets(photoSets) {
    visiblePhotoLists().forEach(function (list, i) {
      var srcs = (photoSets && photoSets[i]) || [];
      revokePhotoBlobs(list);
      list.innerHTML = srcs.map(photoItemHtml).join('');
    });
  }
  function applySnapshotPhotos(snap) {
    var photoIdx = 0;
    formViews().forEach(function (view) {
      view.querySelectorAll('.photo-preview-list').forEach(function (list) {
        if (isHiddenControl(list)) return;
        var srcs = sampleSrcsForEntry((snap && snap.photos && snap.photos[photoIdx]) || 0, photoIdx);
        revokePhotoBlobs(list);
        list.innerHTML = srcs.map(photoItemHtml).join('');
        photoIdx += 1;
      });
    });
  }
  function fillSamplePhotos() {
    applyPhotoSets(buildSamplePhotoSets());
  }
  function photoCountOf(entry) {
    if (typeof entry === 'number') return entry;
    if (Array.isArray(entry)) return entry.length;
    return 0;
  }
  function sampleSrcsForEntry(entry, i) {
    var count = photoCountOf(entry);
    if (count <= 0) return [];
    if (Array.isArray(entry) && entry.length === count && entry.every(function (src) {
      return typeof src === 'string' && src.indexOf('data:') !== 0 && src.indexOf('blob:') !== 0 && src.indexOf('assets/sample-') >= 0;
    })) return entry;
    return sampleSrcsForCount(count, i);
  }
  function joinEntries() {
    var list = document.getElementById('joinTechList');
    return list ? Array.prototype.slice.call(list.querySelectorAll('.tech-entry')) : [];
  }
  function syncJoinCount(n) {
    n = Math.max(0, n || 0);
    var entries = joinEntries();
    while (entries.length < n) {
      if (typeof appendJoinTechEntry === 'function') appendJoinTechEntry();
      else break;
      entries = joinEntries();
    }
    while (entries.length > n) {
      var last = entries[entries.length - 1];
      var next = last.nextElementSibling;
      last.remove();
      if (next && next.classList.contains('tech-divider')) next.remove();
      if (typeof syncJoinTechActions === 'function') syncJoinTechActions();
      entries = joinEntries();
    }
  }
  var REPORT_JOIN_MAX = 8;
  function reportPeriodRangeHtml() {
    return '<div class="report-period-range report-period-range--locked">' +
      '<div class="report-date"><input type="date" aria-label="과업참여 시작일" readonly tabindex="-1"><img class="cal-ic" src="assets/main/checklist/calendar.svg" alt="" width="16" height="18"></div>' +
      '<span class="report-period-range__sep" aria-hidden="true">~</span>' +
      '<div class="report-date"><input type="date" aria-label="과업참여 종료일" readonly tabindex="-1"><img class="cal-ic" src="assets/main/checklist/calendar.svg" alt="" width="16" height="18"></div>' +
    '</div>';
  }
  function reportJoinEntries() {
    var list = document.getElementById('reportJoinTechList');
    return list ? Array.prototype.slice.call(list.querySelectorAll('.report-tech-card--join')) : [];
  }
  function createReportJoinTechCard() {
    var card = document.createElement('div');
    card.className = 'report-tech-card report-tech-card--join';
    card.innerHTML =
      '<div class="report-tech-row">' +
        '<div class="report-field report-field--grow"><label>성명</label><input class="is-readonly" type="text" placeholder="이름을 입력하세요." readonly tabindex="-1"></div>' +
        '<div class="report-field report-field--role"><label>구분</label><span class="report-role report-role--join">참여기술자</span></div>' +
      '</div>' +
      '<div class="report-tech-row">' +
        '<div class="report-field report-field--grow"><label>과업참여기간</label>' + reportPeriodRangeHtml() + '</div>' +
      '</div>' +
      '<div class="report-tech-row">' +
        '<div class="report-field report-field--grade report-field--grade-wide"><label>기술등급</label><select class="is-readonly" tabindex="-1"><option value="">선택</option><option>특급</option><option>고급</option><option>중급</option><option>초급</option></select></div>' +
      '</div>';
    return card;
  }
  function createReportJoinDivider() {
    var divider = document.createElement('div');
    divider.className = 'tech-divider';
    divider.innerHTML = '<button type="button" class="tech-divider__del" aria-label="참여기술자 삭제"><i class="ti ti-minus"></i></button>';
    divider.querySelector('.tech-divider__del').addEventListener('click', function () {
      var prev = divider.previousElementSibling;
      if (prev && prev.classList.contains('report-tech-card--join')) prev.remove();
      syncReportJoinTechActions();
    });
    return divider;
  }
  function syncReportJoinTechActions() {
    var list = document.getElementById('reportJoinTechList');
    var addBtn = document.getElementById('btnAddReportJoinTech');
    if (!list) return;
    list.querySelectorAll('.tech-divider').forEach(function (el) { el.remove(); });
    if (addBtn) addBtn.hidden = true;
    bindAllReportDateRanges();
  }
  function appendReportJoinTechEntry() {
    var list = document.getElementById('reportJoinTechList');
    if (!list || reportJoinEntries().length >= REPORT_JOIN_MAX) return;
    list.appendChild(createReportJoinTechCard());
    syncReportJoinTechActions();
  }
  function syncReportJoinCount(n) {
    n = Math.max(0, Math.min(REPORT_JOIN_MAX, n || 0));
    var entries = reportJoinEntries();
    while (entries.length < n) {
      appendReportJoinTechEntry();
      entries = reportJoinEntries();
    }
    while (entries.length > n) {
      var last = entries[entries.length - 1];
      var next = last.nextElementSibling;
      last.remove();
      if (next && next.classList.contains('tech-divider')) next.remove();
      entries = reportJoinEntries();
    }
    syncReportJoinTechActions();
  }
  function controlSnapKey(el, seen) {
    if (!el) return '';
    if (el.id) return 'id:' + el.id;
    if (el.name && (el.type === 'radio' || el.type === 'checkbox')) {
      return 'n:' + el.name + ':' + (el.value || '');
    }
    var view = el.closest('#inspectHistoryView') ? 'h' : (el.closest('#inspectChecklistView') ? 'c' : 'r');
    var wrap = el.closest('.field') || el.closest('.report-field') || el.closest('.result-field');
    if (!wrap && el.closest('.result-row')) wrap = el.parentElement;
    var label = '';
    if (el.type === 'radio' || el.type === 'checkbox') {
      if (el.classList.contains('public-use-yn')) label = '유/무:' + (el.value || '');
      else {
        var lab = el.closest('label');
        label = lab ? txt(lab).replace(/\s+/g, '') : 'check';
      }
    } else if (wrap) {
      var lbl = wrap.querySelector('.field-lbl, .result-lbl, :scope > label, label');
      label = lbl ? txt(lbl) : '';
    }
    var base = view + ':' + label + (el.type ? ':' + el.type : '');
    seen[base] = (seen[base] || 0) + 1;
    return base + '#' + seen[base];
  }
  function collectSnapshot() {
    var seen = {};
    var fields = formControls().map(function (el) {
      var key = controlSnapKey(el, seen);
      if (el.type === 'radio' || el.type === 'checkbox') return { t: 'c', on: !!el.checked, k: key };
      return { t: 'v', v: el.value, k: key };
    });
    var chips = [];
    formViews().forEach(function (view) {
      view.querySelectorAll('.tag-chip').forEach(function (chip) {
        if (isHiddenControl(chip)) return;
        chips.push(chip.classList.contains('on'));
      });
    });
    var signs = [];
    formViews().forEach(function (view) {
      view.querySelectorAll('.sign-box').forEach(function (box) {
        if (isHiddenControl(box)) return;
        signs.push(box.classList.contains('is-signed') || box.dataset.sign ? '1' : '');
      });
    });
    var photos = [];
    formViews().forEach(function (view) {
      view.querySelectorAll('.photo-preview-list').forEach(function (list) {
        if (isHiddenControl(list)) return;
        photos.push(list.querySelectorAll('img').length);
      });
    });
    return { joinCount: joinEntries().length, reportJoinCount: reportJoinEntries().length, fields: fields, chips: chips, signs: signs, photos: photos };
  }
  function applySign(box, dataUrl) {
    var img = box.querySelector('img');
    var signed = !!(dataUrl && dataUrl !== '0');
    if (signed) {
      box.dataset.sign = (typeof dataUrl === 'string' && dataUrl.indexOf('data:') === 0) ? dataUrl : '1';
      box.classList.add('is-signed');
      box.setAttribute('aria-label', '서명됨, 다시 서명하기');
      if (img) img.src = 'assets/main/checklist/sign-check.svg';
    } else {
      delete box.dataset.sign;
      box.classList.remove('is-signed');
      box.setAttribute('aria-label', '서명');
      if (img) img.src = 'assets/main/checklist/pen.svg';
    }
  }
  function formatPhone344(value) {
    var digits = String(value || '').replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return digits.slice(0, 3) + '-' + digits.slice(3);
    return digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
  }
  function writerPhoneInput() {
    return document.getElementById('inspectWriterPhone');
  }
  function syncWriterPhone(keepCursor) {
    var input = writerPhoneInput();
    if (!input) return;
    var old = input.value;
    var formatted = formatPhone344(old);
    if (old === formatted) return;
    var start = typeof input.selectionStart === 'number' ? input.selectionStart : formatted.length;
    var digitsBefore = old.slice(0, start).replace(/\D/g, '').length;
    input.value = formatted;
    if (!keepCursor || document.activeElement !== input) return;
    if (digitsBefore === 0) {
      input.setSelectionRange(0, 0);
      return;
    }
    var pos = 0;
    var seen = 0;
    while (pos < formatted.length && seen < digitsBefore) {
      if (/\d/.test(formatted.charAt(pos))) seen += 1;
      pos += 1;
    }
    input.setSelectionRange(pos, pos);
  }
  function syncReportSafetyGrade() {
    var src = document.getElementById('inspectSafetyGrade');
    var dest = document.getElementById('reportSafetyGrade');
    if (!dest) return;
    dest.value = src && src.value ? String(src.value).trim() : '';
  }
  function lockReportFixedFields() {
    document.querySelectorAll('input[name="reportAgencyType"]').forEach(function (radio) {
      radio.checked = radio.value === 'self';
      radio.tabIndex = -1;
    });
    syncReportSafetyGrade();
    fillReportFacilityFields();
    syncReportFromHistory();
  }
  window.pomsSyncReportSafetyGrade = syncReportSafetyGrade;
  window.pomsSyncReportFromHistory = syncReportFromHistory;

  function escapeReportHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function opinionHasContent(text) {
    var opinion = String(text == null ? '' : text).trim();
    return !!(opinion && opinion !== '-' && opinion !== '의견없음' && opinion !== '이상없음');
  }
  function collectReportChecklistFindings() {
    var items = [];
    checklistCards().forEach(function (card) {
      var summary = isSummaryCheckItem(card);
      if (!summary && card.getAttribute('data-yn') === '1') {
        var yn = card.querySelector('input.public-use-yn:checked');
        if (!yn || yn.value !== '유') return;
      }
      var resultSel = card.querySelector('.check-result-sel');
      var repairSel = card.querySelector('.check-repair-sel');
      var result = resultSel ? String(resultSel.value || '').trim() : '';
      var repair = repairSel ? String(repairSel.value || '').trim() : '';
      var name = collTitleName(card.querySelector('.coll-title'));
      var opinion = ((card.querySelector('textarea.opinion-ta') || {}).value || '').trim();
      if (summary) {
        if (!name) return;
        if (!opinion || opinion === '-') opinion = '의견없음';
        items.push({ name: name, opinion: opinion, result: '', repair: '', photos: [] });
        return;
      }
      if (result !== '보통' && result !== '불량' && repair !== 'Y') return;
      if (!opinion) opinion = '이상없음';
      if (!name) return;
      var photos = Array.prototype.map.call(card.querySelectorAll('.photo-preview-list img'), function (img) {
        return imageToDataUrl(img);
      }).filter(function (src) { return src && src.indexOf('blob:') !== 0; });
      items.push({ name: name, opinion: opinion, result: result || '-', repair: repair || 'N', photos: photos });
    });
    return items;
  }
  var reportChecklistFindingItems = [];
  function findingResultBadgeClass(result) {
    if (result === '보통') return ' crs-sheet__badge--b';
    if (result === '불량' || result === '미흡') return ' crs-sheet__badge--c';
    return '';
  }
  function renderSheetPhotoCarousel(item) {
    var photos = (item && item.photos) || [];
    if (!photos.length) return '';
    var slides = photos.map(function (src, n) {
      return '<img class="crs-photo__slide" src="' + escapeReportHtml(src) + '" alt="' + escapeReportHtml(item.name) + ' 사진 ' + (n + 1) + '" draggable="false" onerror="this.onerror=null;this.src=\'../assets/sample-site-2.png\'">';
    }).join('');
    var dots = '';
    if (photos.length > 1) {
      dots = '<div class="crs-photo__fade"></div><div class="crs-photo__dots" role="tablist" aria-label="사진 넘기기">' +
        photos.map(function (_, n) {
          return '<button type="button" class="crs-photo__dot' + (n === 0 ? ' is-on' : '') + '" data-i="' + n + '" aria-label="' + (n + 1) + '번째 사진"></button>';
        }).join('') + '</div>';
    }
    return '<div class="crs-photo__track">' + slides + '</div>' + dots;
  }
  function bindSheetPhotoCarousel(wrap) {
    var track = wrap && wrap.querySelector('.crs-photo__track');
    if (!track) return;
    var dots = wrap.querySelectorAll('.crs-photo__dot');
    function indexOf() {
      var w = track.clientWidth || 1;
      return Math.max(0, Math.round(track.scrollLeft / w));
    }
    function syncDots() {
      var i = indexOf();
      dots.forEach(function (dot, n) { dot.classList.toggle('is-on', n === i); });
    }
    track.addEventListener('scroll', syncDots, { passive: true });
    wrap.addEventListener('click', function (e) {
      var dot = e.target.closest('.crs-photo__dot');
      if (!dot) return;
      e.preventDefault();
      e.stopPropagation();
      var i = Number(dot.getAttribute('data-i') || 0);
      track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
    });
    var drag = null;
    track.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      drag = { id: e.pointerId, x: e.clientX, sl: track.scrollLeft, moved: false };
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
    });
    track.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) {
        drag.moved = true;
        track.classList.add('is-dragging');
      }
      if (drag.moved) track.scrollLeft = drag.sl - dx;
    });
    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      if (drag.moved) {
        var w = track.clientWidth || 1;
        track.scrollTo({ left: Math.round(track.scrollLeft / w) * w, behavior: 'smooth' });
      }
      track.classList.remove('is-dragging');
      drag = null;
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
  }
  function renderChecklistResultSheet(item) {
    if (!item) return '';
    var result = item.result || '-';
    var photoCount = (item.photos && item.photos.length) ? item.photos.length : 0;
    var opinionOnly = item.name === '특기사항' || item.name === '점검자 의견';
    var resultVal = '<span class="crs-sheet__badge' + findingResultBadgeClass(result) + '">' + escapeReportHtml(result) + '</span>';
    function sheetRow(lbl, val, extra) {
      return '<div class="crs-sheet__row' + (extra || '') + '"><span class="lbl">' + lbl + '</span><span class="val">' + val + '</span></div>';
    }
    return '<div class="crs-sheet">' +
      '<div class="crs-sheet__ttl">' +
        '<span class="crs-sheet__ico"><img src="assets/main/map-sheet-title-icon.svg" alt=""></span>' +
        '<span class="crs-sheet__name" id="checklistResultSheetTitle">' + escapeReportHtml(item.name) + '</span>' +
      '</div>' +
      '<div class="crs-sheet__table">' +
        (opinionOnly ? '' : sheetRow('점검결과', resultVal) + sheetRow('보수필요여부', escapeReportHtml(item.repair || 'N'))) +
        sheetRow('의견', escapeReportHtml(item.opinion || '-'), ' is-wrap') +
        (opinionOnly ? '' : sheetRow('사진첨부', escapeReportHtml(photoCount + '개'))) +
      '</div>' +
    '</div>';
  }
  function closeChecklistResultSheet() {
    var sheet = document.getElementById('checklistResultSheet');
    if (!sheet || sheet.hidden) return;
    window.pomsBackLayer.closedByUi('checklistResult');
    sheet.classList.remove('is-open');
    window.setTimeout(function () {
      if (!sheet.classList.contains('is-open')) sheet.hidden = true;
    }, 220);
  }
  function openChecklistResultSheet(item) {
    var sheet = document.getElementById('checklistResultSheet');
    var body = document.getElementById('checklistResultSheetBody');
    if (!sheet || !body || !item) return;
    var panel = sheet.querySelector('.checklist-result-sheet__panel');
    var photo = document.getElementById('checklistResultSheetPhoto');
    var hasPhoto = !!(item.photos && item.photos.length);
    if (panel) panel.classList.toggle('has-photo', hasPhoto);
    if (photo) {
      photo.hidden = !hasPhoto;
      photo.innerHTML = hasPhoto ? renderSheetPhotoCarousel(item) : '';
      if (hasPhoto) bindSheetPhotoCarousel(photo);
    }
    body.innerHTML = renderChecklistResultSheet(item);
    sheet.style.bottom = '';
    sheet.hidden = false;
    window.pomsBackLayer.opened('checklistResult', closeChecklistResultSheet);
    window.requestAnimationFrame(function () {
      sheet.classList.add('is-open');
    });
  }
  window.pomsCloseChecklistResultSheet = closeChecklistResultSheet;
  function syncReportChecklistResults() {
    var section = document.getElementById('reportChecklistResultsSection');
    var grid = document.getElementById('reportChecklistResults');
    if (!section || !grid) return;
    var items = collectReportChecklistFindings();
    reportChecklistFindingItems = items;
    section.hidden = false;
    if (!items.length) {
      grid.innerHTML = '<div class="report-checklist-results__empty">해당 항목 없음</div>';
      return;
    }
    grid.innerHTML = items.map(function (item, i) {
      return '<button type="button" class="detail-grid__row report-checklist-row" data-finding-idx="' + i + '" aria-label="' + escapeReportHtml(item.name) + ' 상세 보기">' +
        '<span class="detail-cell__lbl">' + escapeReportHtml(item.name) + '</span>' +
        '<div class="detail-cell__val">' + escapeReportHtml(item.opinion) + '</div>' +
      '</button>';
    }).join('');
  }
  function bindReportChecklistResultSheet() {
    var grid = document.getElementById('reportChecklistResults');
    var sheet = document.getElementById('checklistResultSheet');
    if (grid && !grid.dataset.findingBound) {
      grid.dataset.findingBound = '1';
      grid.addEventListener('click', function (e) {
        var row = e.target.closest('.report-checklist-row');
        if (!row) return;
        var idx = Number(row.getAttribute('data-finding-idx'));
        openChecklistResultSheet(reportChecklistFindingItems[idx]);
      });
    }
    if (sheet && !sheet.dataset.findingBound) {
      sheet.dataset.findingBound = '1';
      sheet.addEventListener('click', function (e) {
        if (e.target.closest('[data-checklist-result-dismiss]')) closeChecklistResultSheet();
      });
    }
  }
  window.pomsSyncReportChecklistResults = syncReportChecklistResults;

  var applyingForm = false;
  function applyFieldItem(el, item) {
    if (!el || !item) return;
    if (el.name === 'reportAgencyType') return;
    if (el.readOnly || el.classList.contains('is-readonly')) return;
    if (item.t === 'c') el.checked = !!item.on;
    else el.value = item.v == null ? '' : item.v;
  }
  function applySnapshot(snap) {
    if (!snap) return;
    applyingForm = true;
    syncJoinCount(snap.joinCount || 0);
    syncReportJoinCount(snap.reportJoinCount || 0);
    var controls = formControls();
    var snapFields = snap.fields || [];
    var hasKeys = snapFields.some(function (item) { return item && item.k; });
    if (hasKeys) {
      var byKey = {};
      snapFields.forEach(function (item) {
        if (item && item.k) byKey[item.k] = item;
      });
      var seen = {};
      controls.forEach(function (el) {
        var key = controlSnapKey(el, seen);
        applyFieldItem(el, byKey[key]);
      });
    } else if (snapFields.length === controls.length) {
      snapFields.forEach(function (item, i) {
        applyFieldItem(controls[i], item);
      });
    }
    /* 예전 스냅샷(필드 수 불일치)은 인덱스 복원 시 값이 밀리므로 적용하지 않음 */
    var chipIdx = 0;
    formViews().forEach(function (view) {
      view.querySelectorAll('.tag-chip').forEach(function (chip) {
        if (isHiddenControl(chip)) return;
        chip.classList.toggle('on', !!(snap.chips && snap.chips[chipIdx]));
        chipIdx += 1;
      });
    });
    clearChipOrders();
    var signIdx = 0;
    formViews().forEach(function (view) {
      view.querySelectorAll('.sign-box').forEach(function (box) {
        if (isHiddenControl(box)) return;
        applySign(box, (snap.signs && snap.signs[signIdx]) || '');
        signIdx += 1;
      });
    });
    applySnapshotPhotos(snap);
    fillChecklistFacilityFields();
    applyingForm = false;
    syncWriterPhone(false);
    bindAllReportDateRanges();
    lockReportFixedFields();
    bindPublicUseYn();
  }
  function readRecords() {
    return (window.pomsInspectStore && window.pomsInspectStore.read()) || {};
  }
  function persistRecords(records) {
    if (window.pomsInspectStore) window.pomsInspectStore.write(records);
  }
  function currentPeriod() {
    var sel = document.getElementById('inspectCheckType');
    return periodKey(sel ? sel.value : '');
  }
  function setCheckType(period) {
    var sel = document.getElementById('inspectCheckType');
    if (!sel) return;
    var label = periodLabel(period);
    sel.value = label;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === label) sel.options[i].setAttribute('selected', 'selected');
      else sel.options[i].removeAttribute('selected');
    }
  }
  function ensureRecord(records, name) {
    records[name] = records[name] || {};
    records[name].periods = records[name].periods || {};
    return records[name];
  }
  function controlValue(field) {
    if (!field) return '';
    var checked = field.querySelector('input[type="radio"]:checked');
    if (checked) {
      var lab = checked.closest('label');
      return lab ? txt(lab).replace(/\s+/g, ' ').trim() : '';
    }
    var dates = field.querySelectorAll('input[type="date"]');
    if (dates.length >= 2) {
      var a = (dates[0].value || '').trim();
      var b = (dates[1].value || '').trim();
      if (a && b) return a + ' ~ ' + b;
      return a || b || '';
    }
    if (dates.length === 1) return (dates[0].value || '').trim();
    var el = field.querySelector('select, textarea, input:not([type="radio"]):not([type="checkbox"]):not([type="file"])');
    if (!el) return '';
    var v = String(el.value || '').trim();
    if (el.tagName === 'SELECT' && (!v || /^(입력중|선택)/.test(v))) return '';
    return v;
  }
  function labeledValue(root, label) {
    if (!root) return '';
    var fields = root.querySelectorAll('.field, .report-field');
    for (var i = 0; i < fields.length; i++) {
      var lbl = fields[i].querySelector('.field-lbl, .result-lbl, :scope > label');
      if (txt(lbl) !== label) continue;
      return controlValue(fields[i]);
    }
    return '';
  }
  function reportLeadNameInput() {
    return document.querySelector('#inspectReportView .report-tech-card--lead .report-field--grow input[type="text"]');
  }
  function reportJoinNameInput(card) {
    return card ? card.querySelector('.report-field--grow input[type="text"]') : null;
  }
  function historyLeadName() {
    return labeledValue(document.getElementById('leadTechCard'), '성명')
      || labeledValue(secCardByTitle('정기안전점검이력'), '책임기술자명')
      || '';
  }
  function fillSyncedName(inp, value, force) {
    if (!inp) return;
    var locked = inp.readOnly || inp.classList.contains('is-readonly');
    if (locked || force || !inp.value.trim() || inp.getAttribute('data-synced') === '1') {
      inp.value = value || '';
      inp.setAttribute('data-synced', '1');
    }
  }
  function markUnsynced(inp) {
    if (inp) inp.setAttribute('data-synced', '0');
  }
  function syncWriterToLeadTech(force) {
    if (applyingForm) return;
    var writer = document.getElementById('inspectWriterName');
    var org = document.getElementById('inspectWriterOrg');
    var pos = document.getElementById('inspectWriterPos');
    var nameVal = writer ? writer.value.trim() : '';
    var orgVal = org ? org.value.trim() : '';
    var posVal = pos ? pos.value.trim() : '';
    fillSyncedName(document.getElementById('inspectHistLeadName'), nameVal, force);
    fillSyncedName(document.getElementById('leadTechName'), nameVal, force);
    fillSyncedName(document.getElementById('leadTechOrg'), orgVal, force);
    fillSyncedName(document.getElementById('leadTechPos'), posVal, force);
    function flagIfSame(srcId, destId) {
      var src = document.getElementById(srcId);
      var dest = document.getElementById(destId);
      if (!src || !dest) return;
      if ((src.value || '').trim() === (dest.value || '').trim()) dest.setAttribute('data-synced', '1');
    }
    flagIfSame('inspectWriterName', 'inspectHistLeadName');
    flagIfSame('inspectWriterName', 'leadTechName');
    flagIfSame('inspectWriterOrg', 'leadTechOrg');
    flagIfSame('inspectWriterPos', 'leadTechPos');
    syncReportTechsFromHistory(force);
  }
  function fieldByLabel(root, label) {
    if (!root) return null;
    var fields = root.querySelectorAll('.field, .report-field');
    for (var i = 0; i < fields.length; i++) {
      var lbl = fields[i].querySelector('.field-lbl, .result-lbl, :scope > label');
      if (txt(lbl) === label) return fields[i];
    }
    return null;
  }
  function splitPeriodText(text) {
    var parts = String(text || '').split('~').map(function (part) { return part.trim(); });
    return { start: parts[0] || '', end: parts.length > 1 ? parts[1] : '' };
  }
  function writeLockedPeriod(field, text, force) {
    if (!field) return;
    var period = splitPeriodText(text);
    if (!force && !period.start && !period.end) return;
    var dates = field.querySelectorAll('input[type="date"]');
    if (dates[0]) dates[0].value = period.start;
    if (dates[1]) dates[1].value = period.end;
  }
  function writeLockedGrade(field, grade, force) {
    if (!field) return;
    var el = field.querySelector('select, input');
    if (!el) return;
    if (!force && !grade) return;
    el.value = grade || '';
  }
  function techMeta(root) {
    return {
      name: labeledValue(root, '성명'),
      period: labeledValue(root, '과업참여기간'),
      grade: labeledValue(root, '기술등급')
    };
  }
  function syncReportTechsFromHistory(force, exactCount) {
    if (applyingForm) return;
    var lead = document.getElementById('leadTechCard');
    var leadMeta = techMeta(lead);
    fillSyncedName(reportLeadNameInput(), leadMeta.name || historyLeadName(), force);
    var leadCard = document.querySelector('#inspectReportView .report-tech-card--lead');
    if (leadCard) {
      writeLockedPeriod(fieldByLabel(leadCard, '과업참여기간'), leadMeta.period, force);
      writeLockedGrade(fieldByLabel(leadCard, '기술등급'), leadMeta.grade, force);
    }
    var metas = joinEntries().map(techMeta);
    if (exactCount) {
      syncReportJoinCount(metas.length);
    } else {
      while (reportJoinEntries().length < metas.length && reportJoinEntries().length < REPORT_JOIN_MAX) {
        appendReportJoinTechEntry();
      }
    }
    var cards = reportJoinEntries();
    metas.forEach(function (meta, i) {
      fillSyncedName(reportJoinNameInput(cards[i]), meta.name, force);
      if (!cards[i]) return;
      writeLockedPeriod(fieldByLabel(cards[i], '과업참여기간'), meta.period, force);
      writeLockedGrade(fieldByLabel(cards[i], '기술등급'), meta.grade, force);
    });
    syncReportJoinTechActions();
  }
  window.pomsSyncReportTechsFromHistory = syncReportTechsFromHistory;
  function secCardByTitle(title) {
    var views = [document.getElementById('inspectHistoryView'), document.getElementById('inspectChecklistView')];
    for (var v = 0; v < views.length; v++) {
      if (!views[v]) continue;
      var cards = views[v].querySelectorAll('.sec-card');
      for (var i = 0; i < cards.length; i++) {
        if (txt(cards[i].querySelector('.sec-hd-title')) === title) return cards[i];
      }
    }
    return null;
  }
  function collectReportFieldMap() {
    var map = {};
    document.querySelectorAll('#inspectReportView .report-field').forEach(function (field) {
      var label = txt(field.querySelector(':scope > label'));
      if (!label) return;
      if (!map[label]) map[label] = [];
      map[label].push(controlValue(field));
    });
    return map;
  }
  function histSafetyGrade(grade) {
    if (typeof window.statusGradeFromText === 'function') {
      return window.statusGradeFromText(grade);
    }
    var g = String(grade || '').trim();
    if (!g || g === '-') return '-';
    if (/양호|^A등급?$/i.test(g)) return '양호';
    if (/보통|^B등급?$/i.test(g)) return '보통';
    if (/불량|미흡|^C등급?$/i.test(g)) return '불량';
    return g;
  }
  function imageToDataUrl(img) {
    var src = img ? (img.getAttribute('src') || img.src || '') : '';
    if (!src || src.indexOf('data:') === 0) return src;
    if (src.indexOf('blob:') !== 0 && src.indexOf('assets/') !== -1) return src;
    if (!img.complete || !img.naturalWidth) return src.indexOf('blob:') === 0 ? '' : src;
    try {
      var max = 960;
      var scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      var canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.72);
    } catch (e) {
      return src.indexOf('blob:') === 0 ? '' : src;
    }
  }
  function collectHistView() {
    var facility = typeof window.getInspectFacility === 'function' ? window.getInspectFacility() : {};
    var info = secCardByTitle('기본정보');
    var hist = secCardByTitle('정기안전점검이력');
    var lead = document.getElementById('leadTechCard');
    var reportMap = collectReportFieldMap();
    var first = function (label) { return ((reportMap[label] || [])[0] || '').trim(); };
    var groups = [];
    var photos = [];
    var wrap = document.getElementById('checklistOuterEtc');
    if (!wrap || wrap.hidden) wrap = document.getElementById('checklistDefault');
    if (wrap) {
      wrap.querySelectorAll('.check-group').forEach(function (group) {
        var titleEl = group.querySelector(':scope > .coll-hd .coll-title');
        var groupTitle = collTitleName(titleEl);
        var items = [];
        group.querySelectorAll(':scope > .coll-body .check-item').forEach(function (item) {
          var name = collTitleName(item.querySelector(':scope > .coll-hd .coll-title'));
          var chips = Array.prototype.map.call(item.querySelectorAll('.tag-chip.on'), function (ch) {
            return ch.textContent.replace(/\s+/g, ' ').trim();
          }).filter(Boolean);
          var yn = item.querySelector('input.public-use-yn:checked');
          var resultSel = item.querySelector('.check-result-sel');
          var repairSel = item.querySelector('.check-repair-sel');
          var opinion = ((item.querySelector('textarea.opinion-ta') || {}).value || '').trim();
          var itemSrcs = Array.prototype.map.call(item.querySelectorAll('.photo-preview-list img'), function (img) {
            return imageToDataUrl(img);
          }).filter(function (src) { return src && src.indexOf('blob:') !== 0; });
          itemSrcs.forEach(function (src) {
            photos.push({ src: src, caption: (groupTitle || '') + ' · ' + name });
          });
          var isSummary = groupTitle === '종합의견';
          items.push({
            name: name,
            result: isSummary ? '' : ((resultSel && resultSel.value) || (chips.length ? chips.join(', ') : ((yn && yn.value) || '-'))),
            opinion: opinion || (isSummary ? '의견없음' : '이상없음'),
            repair: isSummary ? '' : (repairSel ? (repairSel.value || 'N') : 'N'),
            photos: itemSrcs.length,
            photoSrcs: itemSrcs,
            publicYn: yn ? yn.value : ''
          });
        });
        groups.push({ title: groupTitle, items: items });
      });
    }
    var isSigned = function (root) {
      var box = root && root.querySelector('.sign-box');
      return !!(box && (box.classList.contains('is-signed') || box.dataset.sign));
    };
    var historyTechs = [{
      role: '책임기술자',
      name: labeledValue(lead, '성명'),
      org: labeledValue(lead, '소속'),
      position: labeledValue(lead, '직위'),
      period: labeledValue(lead, '과업참여기간'),
      grade: labeledValue(lead, '기술등급'),
      signed: isSigned(lead)
    }];
    joinEntries().forEach(function (entry) {
      var joinNameVal = labeledValue(entry, '성명');
      if (!joinNameVal) return;
      historyTechs.push({
        role: '참여기술자',
        name: joinNameVal,
        org: labeledValue(entry, '소속'),
        position: labeledValue(entry, '직위'),
        period: labeledValue(entry, '과업참여기간'),
        grade: labeledValue(entry, '기술등급'),
        signed: isSigned(entry)
      });
    });
    var reportTechs = [];
    document.querySelectorAll('#inspectReportView .report-tech-card').forEach(function (card) {
      reportTechs.push({
        role: txt(card.querySelector('.report-role')),
        name: labeledValue(card, '성명'),
        grade: labeledValue(card, '기술등급'),
        period: labeledValue(card, '과업참여기간')
      });
    });
    var joinName = '';
    historyTechs.forEach(function (t) { if (!joinName && /참여/.test(t.role)) joinName = t.name; });
    var gradeEl = document.getElementById('inspectSafetyGrade');
    var gradeTxt = (gradeEl && gradeEl.value) || first('상태등급') || first('안전등급');
    return {
      title: (document.getElementById('inspectCheckType') || {}).value || labeledValue(hist, '점검구분'),
      writer: labeledValue(info, '작성자'),
      writerOrg: labeledValue(info, '소속'),
      writerPos: labeledValue(info, '직위'),
      writerPhone: labeledValue(info, '작성자 연락처'),
      writeDate: labeledValue(info, '작성일'),
      agency: labeledValue(hist, '점검진단 기관명'),
      period: labeledValue(hist, '점검진단기간'),
      inspector: labeledValue(lead, '성명'),
      gradeTxt: gradeTxt,
      statusGrade: histSafetyGrade(gradeTxt),
      safetyGrade: histSafetyGrade(gradeTxt),
      facilityName: (facility && facility.name) || labeledValue(document.getElementById('inspectChecklistView'), '시설물명'),
      owner: (facility && facility.agency) || labeledValue(document.getElementById('inspectChecklistView'), '관리주체'),
      built: (facility && facility.built) || labeledValue(document.getElementById('inspectChecklistView'), '준공 년월일'),
      date: labeledValue(document.getElementById('inspectChecklistView'), '최종점검 년월일') || labeledValue(info, '작성일'),
      kind: (facility && facility.kind) || first('시설물구분'),
      kindClass: (facility && facility.kindClass) || first('종별'),
      struct: facility && facility.struct,
      loc: (facility && (facility.port || facility.loc)) || first('시설물 위치'),
      length: facility && facility.length,
      agencyType: first('자체/대행 구분') || '자체',
      projectName: first('용역명'),
      reportPeriod: first('점검기간'),
      facilityType: first('시설물구분'),
      typeKind: first('종류'),
      typeClass: first('종별'),
      location: first('시설물 위치'),
      scale: first('시설물 규모'),
      defectMajor: first('중대한 결함') || '의견없음',
      defectPublic: publicUseYnValue() === '무' ? '' : (first('공중이 이용하는 부위에 결함') || '의견없음'),
      publicUseYn: publicUseYnValue(),
      reportResult: first('점검 주요결과') || '의견없음',
      reportRepair: first('주요 보수·보강') || '의견없음',
      note: first('내용') || '의견없음',
      checklistFindings: collectReportChecklistFindings(),
      groups: groups,
      photos: photos,
      photoSrcs: photos.map(function (photo) { return photo.src; }),
      historyTechs: historyTechs,
      reportTechs: reportTechs,
      joinName: joinName || '-'
    };
  }
  function savePeriodState(period, status) {
    fillDefaultOpinions();
    var records = readRecords();
    var name = facilityName();
    var rec = ensureRecord(records, name);
    var slot = rec.periods[period] || {};
    slot.snapshot = collectSnapshot();
    slot.histView = collectHistView();
    slot.checkType = periodLabel(period);
    var typeSel = document.getElementById('inspectCheckType');
    var typeIdx = formControls().indexOf(typeSel);
    if (typeIdx >= 0 && slot.snapshot.fields[typeIdx]) slot.snapshot.fields[typeIdx].v = slot.checkType;
    if (status) {
      var checklistView = document.getElementById('inspectChecklistView');
      var historyView = document.getElementById('inspectHistoryView');
      var pick = function (title, label) {
        var scopes = [historyView, checklistView].filter(Boolean);
        for (var s = 0; s < scopes.length; s++) {
          var card = Array.prototype.find.call(scopes[s].querySelectorAll('.sec-card'), function (c) {
            return txt(c.querySelector('.sec-hd-title')) === title;
          });
          if (!card) continue;
          var field = Array.prototype.find.call(card.querySelectorAll('.field'), function (f) {
            return txt(f.querySelector('.field-lbl')) === label;
          });
          var ctrl = field && field.querySelector('input, select, textarea');
          if (ctrl) return (ctrl.value || '').trim();
        }
        return '';
      };
      var opinions = checklistCards().map(function (c) {
        var t = collTitleName(c.querySelector('.coll-title'));
        var o = (c.querySelector('textarea.opinion-ta') || {}).value || '';
        var chips = Array.prototype.map.call(c.querySelectorAll('.tag-chip.on'), function (ch) { return ch.textContent.trim(); }).join(',');
        return o.trim() ? '[' + t + (chips ? '·' + chips : '') + '] ' + o.trim() : '';
      }).filter(Boolean).join(' / ');
      slot.status = status;
      slot.inspector = pick('책임기술자', '성명') || '-';
      slot.grade = (document.getElementById('inspectSafetyGrade') || {}).value || '-';
      slot.opinion = opinions || '-';
      slot.at = nowStamp();
      rec.status = status;
      rec.inspector = slot.inspector;
      rec.grade = slot.grade;
      rec.checkType = slot.checkType;
      rec.opinion = slot.opinion;
      rec.at = slot.at;
    }
    rec.periods[period] = slot;
    persistRecords(records);
    clearDefaultOpinionDisplay();
  }
  function snapshotHasWriter(snap) {
    return !!(snap && snap.fields && snap.fields[0] && String(snap.fields[0].v || '').trim());
  }
  function isPeriodSubmitted(period) {
    var name = facilityName();
    var key = period || currentPeriod();
    var rec = readRecords()[name];
    var slot = rec && rec.periods && rec.periods[key];
    return !!(slot && slot.status === '제출');
  }
  window.pomsIsSubmitted = function () { return isPeriodSubmitted(); };
  function bindPeriodRangePair(start, end) {
    if (!start || !end) return;
    function sync() {
      if (start.value) end.min = start.value;
      else end.removeAttribute('min');
      if (end.value) start.max = end.value;
      else start.removeAttribute('max');
      if (start.value && end.value && start.value > end.value) end.value = start.value;
    }
    if (!start.dataset.periodBound) {
      start.dataset.periodBound = '1';
      start.addEventListener('change', sync);
      end.addEventListener('change', sync);
    }
    sync();
  }
  function bindAllReportDateRanges() {
    document.querySelectorAll('#inspectReportView .report-period-range').forEach(function (wrap) {
      var dates = wrap.querySelectorAll('input[type="date"]');
      if (dates.length >= 2) bindPeriodRangePair(dates[0], dates[1]);
    });
  }
  function restorePeriod(period) {
    var rec = readRecords()[facilityName()];
    var slot = rec && rec.periods && rec.periods[period];
    var status = (slot && slot.status) || '';
    var snap = slot && slot.snapshot;
    var snapFields = snap && snap.fields ? snap.fields : [];
    var hasKeys = snapFields.some(function (item) { return item && item.k; });
    var controlsLen = formControls().length;
    var snapOk = !!(snap && (hasKeys || snapFields.length === controlsLen));
    var useDraft = status === '임시저장' && snapOk;
    applySnapshot((useDraft ? snap : blankSnapshot) || blankSnapshot);
    setCheckType(period);
    if (!useDraft) setDefaultWriteDate(true);
    else if (!snapshotHasWriter(snap)) setDefaultWriteDate();
    fillChecklistFacilityFields();
    if (useDraft) fillEmptyOpinionsFromChips();
    clearDefaultOpinionDisplay();
    bindPublicUseYn();
    bindAllReportDateRanges();
    lockReportFixedFields();
    syncWriterToLeadTech(false);
    syncReportTechsFromHistory(false, true);
    syncReportPublicDefectField();
    syncInspectPeriodOptions();
  }

  function seasonPeriodFromToday() {
    var now = new Date();
    return (now.getMonth() + 1) <= 5 ? '상반기' : '하반기';
  }
  function inspectPeriodOpen(period) {
    return period === '상반기' || period === '하반기';
  }
  // function inspectPeriodClosedMessage(period) {
  //   if (period === '상반기') return '정기안전점검(상반기)는 1월부터 8월까지 작성할 수 있습니다.';
  //   return '정기안전점검(하반기)는 6월부터 다음 해 2월까지 작성할 수 있습니다.';
  // }
  function syncInspectPeriodOptions() {
    var sel = document.getElementById('inspectCheckType');
    if (!sel) return;
    Array.prototype.forEach.call(sel.options, function (opt) {
      opt.disabled = !inspectPeriodOpen(periodKey(opt.value || opt.textContent));
    });
    var note = document.getElementById('inspectPeriodNote');
    // if (note) note.textContent = '상반기와 하반기 모두 작성할 수 있습니다.';
    if (!inspectPeriodOpen(currentPeriod())) {
      var fallback = inspectPeriodOpen('하반기') ? '하반기' : (inspectPeriodOpen('상반기') ? '상반기' : '');
      if (fallback) setCheckType(fallback);
    }
  }
  window.pomsInspectPeriodOpen = function () {
    var period = currentPeriod();
    if (inspectPeriodOpen(period)) return true;
    alert(inspectPeriodClosedMessage(period) + '\n기간 이후 작성, 등록이 필요한 경우 관리자에게 문의해 주세요.');
    return false;
  };

  syncChecklistByFacility();
  var blankSnapshot = collectSnapshot();
  var activePeriod = seasonPeriodFromToday();
  setCheckType(activePeriod);
  syncInspectPeriodOptions();
  document.getElementById('inspectSafetyGrade')?.addEventListener('change', syncReportSafetyGrade);
  lockReportFixedFields();
  bindReportChecklistResultSheet();

  function overlaySample(values) {
    var snap = JSON.parse(JSON.stringify(blankSnapshot));
    var seen = {};
    formControls().forEach(function (el, i) {
      var key = controlSnapKey(el, seen);
      if (!snap.fields[i]) {
        snap.fields[i] = (el.type === 'radio' || el.type === 'checkbox') ? { t: 'c', on: false, k: key } : { t: 'v', v: '', k: key };
      } else {
        snap.fields[i].k = key;
      }
      var view = el.closest('#inspectHistoryView') ? 'h' : (el.closest('#inspectChecklistView') ? 'c' : 'r');
      var wrap = el.closest('.field') || el.closest('.report-field') || el.closest('.result-field');
      if (!wrap && el.closest('.result-row')) wrap = el.parentElement;
      var label = '';
      if (el.type === 'radio' || el.type === 'checkbox') {
        if (el.classList.contains('public-use-yn')) label = '유/무:' + (el.value || '');
        else {
          var lab = el.closest('label');
          label = lab ? txt(lab).replace(/\s+/g, '') : 'check';
        }
      } else if (wrap) {
        var lbl = wrap.querySelector('.field-lbl, .result-lbl, :scope > label, label');
        label = lbl ? txt(lbl) : '';
      }
      var base = view + ':' + label;
      var labelSeen = overlaySample._labelSeen || (overlaySample._labelSeen = {});
      labelSeen[base] = (labelSeen[base] || 0) + 1;
      var sampleKey = base + '#' + labelSeen[base];
      if (!Object.prototype.hasOwnProperty.call(values, sampleKey)) return;
      var val = values[sampleKey];
      if (el.type === 'radio' || el.type === 'checkbox') snap.fields[i] = { t: 'c', on: !!val, k: key };
      else snap.fields[i] = { t: 'v', v: String(val), k: key };
    });
    overlaySample._labelSeen = null;
    if (values._chips) snap.chips = values._chips;
    snap.joinCount = joinEntries().length;
    snap.reportJoinCount = reportJoinEntries().length;
    return snap;
  }
  function applyLabeledValues(values) {
    applyingForm = true;
    var seen = {};
    formControls().forEach(function (el) {
      var view = el.closest('#inspectHistoryView') ? 'h' : (el.closest('#inspectChecklistView') ? 'c' : 'r');
      var wrap = el.closest('.field') || el.closest('.report-field') || el.closest('.result-field');
      if (!wrap && el.closest('.result-row')) wrap = el.parentElement;
      var label = '';
      if (el.type === 'radio' || el.type === 'checkbox') {
        if (el.classList.contains('public-use-yn')) label = '유/무:' + (el.value || '');
        else {
          var lab = el.closest('label');
          label = lab ? txt(lab).replace(/\s+/g, '') : 'check';
        }
      } else if (wrap) {
        var lbl = wrap.querySelector('.field-lbl, .result-lbl, :scope > label, label');
        label = lbl ? txt(lbl) : '';
      }
      var base = view + ':' + label;
      seen[base] = (seen[base] || 0) + 1;
      var key = base + '#' + seen[base];
      if (el.name === 'reportAgencyType') return;
      if (!Object.prototype.hasOwnProperty.call(values, key)) return;
      var val = values[key];
      if (el.type === 'radio' || el.type === 'checkbox') el.checked = !!val;
      else el.value = String(val);
    });
    if (values._chips) {
      var chipIdx = 0;
      formViews().forEach(function (view) {
        view.querySelectorAll('.tag-chip').forEach(function (chip) {
          if (isHiddenControl(chip)) return;
          chip.classList.toggle('on', !!values._chips[chipIdx]);
          chipIdx += 1;
        });
      });
      clearChipOrders();
    }
    applyingForm = false;
    syncWriterPhone(false);
    bindAllReportDateRanges();
    lockReportFixedFields();
    bindPublicUseYn();
  }
  function checklistCards() {
    var def = document.getElementById('checklistDefault');
    var outer = document.getElementById('checklistOuterEtc');
    var wrap = (outer && !outer.hidden) ? outer : ((def && !def.hidden) ? def : null);
    if (!wrap) return [];
    return Array.prototype.slice.call(wrap.querySelectorAll('.check-item'));
  }
  function chipText(chip) {
    return chip.textContent.replace(/\s+/g, ' ').trim();
  }
  function selectedChipTexts(card) {
    var onChips = Array.prototype.map.call(card.querySelectorAll('.tag-chip.on'), chipText).filter(Boolean);
    var order = card._chipOrder || [];
    var used = {};
    var out = [];
    order.forEach(function (text) {
      if (!used[text] && onChips.indexOf(text) !== -1) {
        used[text] = true;
        out.push(text);
      }
    });
    onChips.forEach(function (text) {
      if (!used[text]) out.push(text);
    });
    return out;
  }
  function clearChipOrders(root) {
    (root || document).querySelectorAll('.check-item').forEach(function (card) {
      delete card._chipOrder;
    });
  }
  function seedChipOrderFromOpinion(card) {
    if (card._chipOrder) return;
    var ta = card.querySelector('textarea.opinion-ta');
    var tags = allChipTexts(card).slice().sort(function (a, b) { return b.length - a.length; });
    var text = ((ta && ta.value) || '').replace(/\s+/g, ' ').trim();
    var found = [];
    var guard = 0;
    while (text && guard < 40) {
      guard += 1;
      var matched = '';
      for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        var at = text.length - tag.length;
        if (at >= 0 && text.slice(at) === tag && (at === 0 || text.charAt(at - 1) === ' ')) {
          matched = tag;
          break;
        }
      }
      if (!matched) break;
      found.unshift(matched);
      text = text.slice(0, text.length - matched.length).replace(/\s+$/g, '');
    }
    card._chipOrder = found;
  }
  function syncChipOrder(card, chip) {
    var text = chipText(chip);
    if (!text) return;
    var on = chip.classList.contains('on');
    if (card.classList.contains('check-item--exclusive')) {
      card._chipOrder = on ? [text] : [];
      return;
    }
    seedChipOrderFromOpinion(card);
    var order = card._chipOrder;
    var at = order.indexOf(text);
    if (at >= 0) order.splice(at, 1);
    if (on) order.push(text);
    var selectedNow = {};
    Array.prototype.forEach.call(card.querySelectorAll('.tag-chip.on'), function (c) {
      var label = chipText(c);
      if (label) selectedNow[label] = true;
    });
    card._chipOrder = order.filter(function (label) { return selectedNow[label]; });
  }
  function allChipTexts(card) {
    return Array.prototype.map.call(card.querySelectorAll('.tag-chip'), chipText).filter(Boolean);
  }
  function stripTrailingChipTexts(text, tags) {
    var t = (text || '').replace(/\s+$/g, '');
    var changed = true;
    while (changed && t) {
      changed = false;
      for (var i = 0; i < tags.length; i++) {
        var re = new RegExp('(?:^|\\s)' + tags[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
        if (re.test(t)) {
          t = t.replace(re, '').replace(/\s+$/g, '');
          changed = true;
          break;
        }
      }
    }
    return t;
  }
  function syncOpinionFromChips(card) {
    var ta = card.querySelector('textarea.opinion-ta');
    if (!ta) return;
    var selected = selectedChipTexts(card);
    var body = stripTrailingChipTexts(ta.value, allChipTexts(card));
    ta.value = [body, selected.join(' ')].filter(Boolean).join(' ');
  }
  function fillEmptyOpinionsFromChips() {
    checklistCards().forEach(function (card) {
      var ta = card.querySelector('textarea.opinion-ta');
      if (ta && !ta.value.trim()) syncOpinionFromChips(card);
    });
  }
  function isUsableTagChip(chip, view) {
    if (!chip || !view || !view.contains(chip) || view.hidden) return false;
    if (chip.closest('.hidden') || chip.closest('[hidden]')) return false;
    if (typeof isHiddenControl === 'function' && isHiddenControl(chip)) return false;
    return true;
  }
  function chipFromPoint(x, y, view) {
    if (!view || view.hidden || typeof x !== 'number' || typeof y !== 'number') return null;
    var stack = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [];
    var i;
    for (i = 0; i < stack.length; i++) {
      var chip = stack[i].closest ? stack[i].closest('.tag-chip') : null;
      if (isUsableTagChip(chip, view)) return chip;
    }
    var hit = document.elementFromPoint(x, y);
    var fallback = hit && hit.closest ? hit.closest('.tag-chip') : null;
    return isUsableTagChip(fallback, view) ? fallback : null;
  }
  function resolveTagChip(e, view) {
    if (!e || !view) return null;
    var t = e.target;
    var chip = (t && t.closest) ? t.closest('.tag-chip') : null;
    if (isUsableTagChip(chip, view)) return chip;
    return chipFromPoint(e.clientX, e.clientY, view);
  }
  function applyTagChipSelection(chip) {
    if (!chip) return;
    var card = chip.closest('.check-item');
    if (!card) return;
    if (card.classList.contains('check-item--exclusive')) {
      card.querySelectorAll('.tag-chip').forEach(function (c) { c.classList.remove('on'); });
      chip.classList.add('on');
    } else {
      chip.classList.toggle('on');
    }
    syncChipOrder(card, chip);
    syncOpinionFromChips(card);
    if (collTitleName(card.querySelector('.coll-title')) === '점검자 의견') syncInspectorOpinionToReport(true);
  }
  function bindChecklistTagChips() {
    var view = document.getElementById('inspectChecklistView');
    bindPublicUseYn();
    if (!view || view._chipDelegated) return;
    view._chipDelegated = true;

    var TAP_DRAG = 28;
    var press = null;
    var lastApplyAt = 0;
    var lastApplyChip = null;
    var swallowClick = false;
    var root = view.closest('.phone-inner') || view;

    function applyChip(chip) {
      if (!chip || applyingForm) return;
      var now = Date.now();
      if (lastApplyChip === chip && now - lastApplyAt < 80) return;
      lastApplyChip = chip;
      lastApplyAt = now;
      applyTagChipSelection(chip);
    }
    function clearPressCapture() {
      if (!press) return;
      if (press.captured && press.row) {
        try { press.row.releasePointerCapture(press.pointerId); } catch (err) {}
      }
      if (press.row) press.row.classList.remove('is-dragging');
    }

    root.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      var chip = resolveTagChip(e, view);
      var row = (chip && chip.closest('.tags-row')) || (e.target.closest ? e.target.closest('.tags-row') : null);
      if (row && !view.contains(row)) row = null;
      if (!chip && !row) {
        press = null;
        return;
      }
      press = {
        pointerId: e.pointerId,
        chip: chip,
        row: row,
        x: e.clientX,
        y: e.clientY,
        scroll: row ? row.scrollLeft : 0,
        dragged: false,
        captured: false,
        applied: false
      };
    }, true);

    root.addEventListener('pointermove', function (e) {
      if (!press || e.pointerId !== press.pointerId) return;
      var dx = e.clientX - press.x;
      var dy = e.clientY - press.y;
      if (press.dragged) {
        if (press.row) press.row.scrollLeft = press.scroll - dx;
        return;
      }
      if (!press.row || e.pointerType === 'touch') return;
      if (Math.abs(dx) < TAP_DRAG || Math.abs(dx) <= Math.abs(dy)) return;
      press.dragged = true;
      press.row.classList.add('is-dragging');
      try {
        press.row.setPointerCapture(e.pointerId);
        press.captured = true;
      } catch (err) {}
      press.row.scrollLeft = press.scroll - dx;
    }, true);

    function endPress(e) {
      if (!press || (e && e.pointerId !== press.pointerId)) return;
      var dx = e ? (e.clientX - press.x) : 0;
      var dy = e ? (e.clientY - press.y) : 0;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var chip = (e && resolveTagChip(e, view)) || press.chip;
      var isTap = !press.dragged && dist < TAP_DRAG;
      clearPressCapture();
      if (e && e.type === 'pointercancel') {
        press = null;
        swallowClick = false;
        return;
      }
      if (isTap && chip) {
        press.applied = true;
        applyChip(chip);
        swallowClick = true;
        if (e && !view.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();
        }
      } else {
        swallowClick = !!press.dragged;
      }
      press = null;
      setTimeout(function () { swallowClick = false; }, 80);
    }

    root.addEventListener('pointerup', endPress, true);
    root.addEventListener('pointercancel', endPress, true);
    root.addEventListener('click', function (e) {
      var chip = resolveTagChip(e, view);
      if (swallowClick) {
        if (chip || (e.target && e.target.closest && (e.target.closest('.info-fab') || e.target.closest('.form-footer')))) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
      if (applyingForm || !chip) return;
      applyChip(chip);
    }, true);
  }
  function publicUseYnValue() {
    var cards = checklistCards();
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute('data-yn') !== '1') continue;
      var yn = cards[i].querySelector('input.public-use-yn:checked');
      return yn ? yn.value : '';
    }
    return '';
  }
  function syncReportPublicDefectField() {
    var field = document.getElementById('reportPublicDefectField');
    if (!field) return;
    field.hidden = publicUseYnValue() === '무';
  }
  window.pomsSyncReportPublicDefectField = syncReportPublicDefectField;
  function syncPublicUseDetail(card) {
    if (!card || card.getAttribute('data-yn') !== '1') return;
    var detail = card.querySelector('.public-use-detail');
    if (!detail) return;
    var checked = card.querySelector('input.public-use-yn:checked');
    var show = !!(checked && checked.value === '유');
    detail.classList.toggle('hidden', !show);
    syncReportPublicDefectField();
  }
  function ensurePublicUseDefault(root) {
    (root || document).querySelectorAll('.check-item[data-yn="1"]').forEach(function (card) {
      var radios = card.querySelectorAll('input.public-use-yn');
      if (!radios.length || card.querySelector('input.public-use-yn:checked')) return;
      Array.prototype.forEach.call(radios, function (radio) {
        if (radio.value === '무') radio.checked = true;
      });
    });
  }
  function bindPublicUseYn(scope) {
    var root = scope || document.getElementById('inspectChecklistView');
    if (!root) return;
    ensurePublicUseDefault(root);
    root.querySelectorAll('.check-item[data-yn="1"]').forEach(function (card) {
      card.querySelectorAll('input.public-use-yn').forEach(function (radio) {
        if (radio.dataset.ynBound) return;
        radio.dataset.ynBound = '1';
        radio.addEventListener('change', function () {
          if (applyingForm) {
            syncPublicUseDetail(card);
            return;
          }
          syncPublicUseDetail(card);
        });
      });
      syncPublicUseDetail(card);
    });
  }
  function applyOuterEtcSampleChips() {
    var wrap = document.getElementById('checklistOuterEtc');
    if (!wrap || wrap.hidden) return;
    wrap.querySelectorAll('.check-item').forEach(function (card) {
      var chips = card.querySelectorAll('.tag-chip');
      chips.forEach(function (c) { c.classList.remove('on'); });
      if (chips[0]) chips[0].classList.add('on');
    });
  }
  function bOuterSample(period) {
    var first = period === '상반기';
    var namedOpinions = {
      '침하': first ? '상부 구조 침하는 경미하며 사용상 지장 없음.' : '상부공 상태 양호. 상반기 대비 추가 침하는 없음.',
      '경사/전도': first ? '경사·전도 변위는 허용범위 이내임.' : '경사 변위 안정. 전도 징후 없음.',
      '세굴': first ? '기초부 세굴 흔적 일부 확인, 구조 안전성에는 영향 없음.' : '기초부 세굴 진행 없음. 현 상태 유지 가능.',
      '공중이 이용하는 부위': first ? '공중이 이용하는 부위 없음.' : '공중 이용 부위 없음. 상반기와 동일.',
      '특기사항': first ? '폐기물·적치물 없음. 출입제한 구간은 현행 유지.' : '특기사항 없음. 상반기와 동일.',
      '점검자 의견': first ? '전반적으로 양호하며 지속적인 유지·관찰이 필요함.' : '전반 양호. 지속 관찰 예정.'
    };
    var values = {
      'h:작성자#1': first ? '김상반' : '박하반',
      'h:소속#1': '목포지방해양수산청',
      'h:직위#1': '책임기술자',
      'h:작성자 연락처#1': first ? '010-2222-1001' : '010-3333-2002',
      'h:작성일#1': first ? '2026-06-18' : '2025-11-12',
      'h:점검구분#1': periodLabel(period),
      'h:점검진단 기관명#1': first ? '한국항만안전기술(주)' : '마산항만기술단',
      'h:점검진단기간#1': first ? '2026-05-11' : '2025-10-08',
      'h:점검진단기간#2': first ? '2026-06-18' : '2025-11-12',
      'h:소속#2': '목포지방해양수산청',
      'h:직위#2': '책임기술자',
      'h:성명#1': first ? '김상반' : '박하반',
      'c:안전등급#1': '양호',
      'r:자체#1': true,
      'r:대행#1': false,
      'r:용역명#1': '정기안전점검 용역',
      'r:점검기간#1': first ? '2026-05-11' : '2025-10-08',
      'r:점검기간#2': first ? '2026-06-18' : '2025-11-12',
      'r:시설물구분#1': '외곽시설',
      'r:종류#1': '방파제',
      'r:종별#1': '기타',
      'r:안전등급#1': '양호',
      'r:준공일#1': '2003.06.30',
      'r:시설물 위치#1': '목포항 목포항',
      'r:시설물 규모#1': '연장 180m',
      'r:중대한 결함#1': '해당 없음',
      'r:공중이 이용하는 부위에 결함#1': '해당 없음',
      'r:점검 주요결과#1': first
        ? '상반기 점검 결과 시설물 상태는 양호하며 일상 유지관리로 충분함.'
        : '하반기 점검 결과 시설물 상태는 양호하며 상반기 대비 특이 변화 없음.',
      'r:주요 보수·보강#1': first
        ? '차기 하반기 점검 시 강관파일 피복 상태 재확인.'
        : '피복 열화 구간 지속 관찰, 즉시 보수는 불필요.',
      'r:성명#1': first ? '이책임' : '최진단',
      'r:과업참여기간#1': first ? '2026-05-11' : '2025-10-08',
      'r:과업참여기간#2': first ? '2026-06-18' : '2025-11-12',
      'r:기술등급#1': '특급',
      'r:성명#2': first ? '박참여' : '한참여',
      'r:과업참여기간#3': first ? '2026-05-11' : '2025-10-08',
      'r:과업참여기간#4': first ? '2026-06-18' : '2025-11-12',
      'r:기술등급#2': '고급',
      'r:성명#3': first ? '최점검' : '오점검',
      'r:과업참여기간#5': first ? '2026-05-20' : '2025-10-15',
      'r:과업참여기간#6': first ? '2026-06-18' : '2025-11-12',
      'r:기술등급#3': '중급',
      'r:내용#1': first ? '상반기 정기안전점검 제출 완료.' : '하반기 정기안전점검 제출 완료.',
      inspector: first ? '이책임' : '최진단',
      grade: '양호',
      opinion: first
        ? '[침하·유] 상부 구조 침하는 경미하며 사용상 지장 없음.'
        : '[침하·유] 상부공 상태 양호. 상반기 대비 추가 침하는 없음.',
      at: first ? '2026-06-18 16:40' : '2025-11-12 15:10'
    };
    var n = 0;
    OUTER_ETC_GROUPS.forEach(function (group) {
      group.items.forEach(function (item) {
        n += 1;
        var title = outerItemTitle(item);
        values['c:점검의견 내용 작성#' + n] = namedOpinions[title] || (first
          ? title + ' 상태 양호. 이상 없음.'
          : title + ' 상태 양호. 상반기 대비 변화 없음.');
        if (group.title !== '종합의견') {
          values['c:점검결과#' + n] = '양호';
          values['c:보수필요여부#' + n] = 'N';
        }
        if (outerItemIsYn(item)) {
          values['c:유/무:무#1'] = true;
        }
      });
    });
    return values;
  }
  function aMooringSample(period) {
    var first = period === '상반기';
    var namedOpinions = {
      '침하': first ? '상부 구조 침하는 경미하며 사용상 지장 없음.' : '상부공 상태 양호. 상반기 대비 추가 침하는 없음.',
      '경사/전도': first ? '경사·전도 변위는 허용범위 이내임.' : '경사 변위 안정. 전도 징후 없음.',
      '방충재': first ? '방충재 상태 양호. 일부 마모는 사용상 지장 없음.' : '방충재 상태 양호. 상반기 대비 변화 없음.',
      '계선주': first ? '계선주 고정 상태 양호.' : '계선주 상태 양호. 상반기와 동일.',
      '차막이': first ? '차막이 설치 상태 양호.' : '차막이 상태 양호. 상반기와 동일.',
      '공중이 이용하는 부위': first ? '공중이 이용하는 부위 없음.' : '공중 이용 부위 없음. 상반기와 동일.',
      '특기사항': first ? '폐기물·적치물 없음. 출입제한 구간은 현행 유지.' : '특기사항 없음. 상반기와 동일.',
      '점검자 의견': first ? '전반적으로 양호하며 지속적인 유지·관찰이 필요함.' : '전반 양호. 지속 관찰 예정.'
    };
    var values = {
      'h:작성자#1': first ? '김상반' : '박하반',
      'h:소속#1': '목포지방해양수산청',
      'h:직위#1': '책임기술자',
      'h:작성자 연락처#1': first ? '010-2222-1001' : '010-3333-2002',
      'h:작성일#1': first ? '2026-06-18' : '2025-11-12',
      'h:점검구분#1': periodLabel(period),
      'h:점검진단 기관명#1': first ? '한국항만안전기술(주)' : '마산항만기술단',
      'h:점검진단기간#1': first ? '2026-05-11' : '2025-10-08',
      'h:점검진단기간#2': first ? '2026-06-18' : '2025-11-12',
      'h:소속#2': '목포지방해양수산청',
      'h:직위#2': '책임기술자',
      'h:성명#1': first ? '김상반' : '박하반',
      'c:안전등급#1': '양호',
      'r:자체#1': true,
      'r:대행#1': false,
      'r:용역명#1': '정기안전점검 용역',
      'r:점검기간#1': first ? '2026-05-11' : '2025-10-08',
      'r:점검기간#2': first ? '2026-06-18' : '2025-11-12',
      'r:시설물구분#1': '계류시설',
      'r:종류#1': '안벽',
      'r:종별#1': '기타',
      'r:안전등급#1': '양호',
      'r:준공일#1': '1997.12.22',
      'r:시설물 위치#1': '목포항 목포항',
      'r:시설물 규모#1': '연장 1,093m',
      'r:중대한 결함#1': '해당 없음',
      'r:공중이 이용하는 부위에 결함#1': '해당 없음',
      'r:점검 주요결과#1': first
        ? '상반기 점검 결과 시설물 상태는 양호하며 일상 유지관리로 충분함.'
        : '하반기 점검 결과 시설물 상태는 양호하며 상반기 대비 특이 변화 없음.',
      'r:주요 보수·보강#1': first
        ? '차기 하반기 점검 시 방충재 마모 구간 재확인.'
        : '방충재 마모 구간 지속 관찰, 즉시 보수는 불필요.',
      'r:성명#1': first ? '이책임' : '최진단',
      'r:과업참여기간#1': first ? '2026-05-11' : '2025-10-08',
      'r:과업참여기간#2': first ? '2026-06-18' : '2025-11-12',
      'r:기술등급#1': '특급',
      'r:성명#2': first ? '박참여' : '한참여',
      'r:과업참여기간#3': first ? '2026-05-11' : '2025-10-08',
      'r:과업참여기간#4': first ? '2026-06-18' : '2025-11-12',
      'r:기술등급#2': '고급',
      'r:성명#3': first ? '최점검' : '오점검',
      'r:과업참여기간#5': first ? '2026-05-20' : '2025-10-15',
      'r:과업참여기간#6': first ? '2026-06-18' : '2025-11-12',
      'r:기술등급#3': '중급',
      'r:내용#1': first ? '상반기 정기안전점검 제출 완료.' : '하반기 정기안전점검 제출 완료.',
      inspector: first ? '이책임' : '최진단',
      grade: '양호',
      opinion: first
        ? '[침하·유] 상부 구조 침하는 경미하며 사용상 지장 없음.'
        : '[침하·유] 상부공 상태 양호. 상반기 대비 추가 침하는 없음.',
      at: first ? '2026-06-18 16:40' : '2025-11-12 15:10'
    };
    var n = 0;
    MOORING_GROUPS.forEach(function (group) {
      group.items.forEach(function (item) {
        n += 1;
        var title = outerItemTitle(item);
        values['c:점검의견 내용 작성#' + n] = namedOpinions[title] || (first
          ? title + ' 상태 양호. 이상 없음.'
          : title + ' 상태 양호. 상반기 대비 변화 없음.');
        if (group.title !== '종합의견') {
          values['c:점검결과#' + n] = '양호';
          values['c:보수필요여부#' + n] = 'N';
        }
        if (outerItemIsYn(item)) {
          values['c:유/무:무#1'] = true;
        }
      });
    });
    return values;
  }
  function snapshotHasMokpoOrg(snapshot) {
    var fields = snapshot && snapshot.fields;
    if (!fields || !fields.length) return false;
    var saw = false;
    for (var i = 0; i < fields.length; i++) {
      var key = String((fields[i] && fields[i].k) || '');
      if (key.indexOf('소속') === -1) continue;
      saw = true;
      if (fields[i].v !== '목포지방해양수산청') return false;
    }
    return saw;
  }
  function seedSampleFacilityRecords() {
    var name = facilityName();
    if (name !== '파제제' && name !== 'A계류시설') return;
    var records = readRecords();
    var rec = ensureRecord(records, name);
    var first = rec.periods && rec.periods['상반기'];
    var second = rec.periods && rec.periods['하반기'];
    var expected = formControls().length;
    var mismatch = first && first.snapshot && (first.snapshot.fields || []).length !== expected;
    var hasPhotos = first && first.snapshot && (first.snapshot.photos || []).some(function (p) {
      return photoCountOf(p) > 0;
    });
    var firstOk = first && first.status === '제출' && snapshotHasWriter(first.snapshot) && !mismatch && hasPhotos;
    var keepDraft = first && first.status === '임시저장';
    var orgOk = snapshotHasMokpoOrg(first && first.snapshot);
    function userWroteSlot(slot) {
      return !!(slot && slot.histView && (slot.histView.groups || []).length);
    }
    var sampleSecond = name === '파제제' && !userWroteSlot(second) && !!(second && (second.inspector === '최진단' || String(second.at || '').indexOf('2025-11-12') === 0));
    if ((userWroteSlot(first) || (firstOk && orgOk) || keepDraft) && !sampleSecond) return;
    if ((!firstOk || !orgOk) && !keepDraft) {
      var sample = name === '파제제' ? bOuterSample('상반기') : aMooringSample('상반기');
      var snap = overlaySample(sample);
      snap.photos = buildSamplePhotoSets();
      rec.periods['상반기'] = {
        snapshot: snap,
        checkType: periodLabel('상반기'),
        status: '제출',
        inspector: sample.inspector,
        grade: sample.grade,
        opinion: sample.opinion,
        at: sample.at
      };
    }
    if (sampleSecond) delete rec.periods['하반기'];
    rec.status = rec.periods['상반기'].status || '제출';
    rec.inspector = rec.periods['상반기'].inspector;
    rec.grade = rec.periods['상반기'].grade || '양호';
    rec.checkType = periodLabel('상반기');
    rec.opinion = rec.periods['상반기'].opinion;
    rec.at = rec.periods['상반기'].at;
    persistRecords(records);
  }
  seedSampleFacilityRecords();
  blankSnapshot = collectSnapshot();
  restorePeriod(activePeriod);
  bindChecklistTagChips();
  (function bindInspectorOpinionLink() {
    var view = document.getElementById('inspectChecklistView');
    if (view && !view.dataset.opinionLinkBound) {
      view.dataset.opinionLinkBound = '1';
      view.addEventListener('input', function (e) {
        var ta = e.target;
        if (!ta || !ta.classList || !ta.classList.contains('opinion-ta')) return;
        var card = ta.closest('.check-item');
        if (!card || collTitleName(card.querySelector('.coll-title')) !== '점검자 의견') return;
        syncInspectorOpinionToReport(true);
      });
    }
    var report = document.getElementById('inspectReportView');
    if (report && !report.dataset.mainResultBound) {
      report.dataset.mainResultBound = '1';
      report.addEventListener('input', function (e) {
        var ta = e.target;
        if (!ta || ta.tagName !== 'TEXTAREA') return;
        var field = ta.closest('.report-field');
        if (txt(field && field.querySelector(':scope > label')) !== '점검 주요결과') return;
        if (applyingForm) return;
        reportMainResultTouched = true;
      });
    }
  })();

  var writerPhone = writerPhoneInput();
  if (writerPhone && !writerPhone.dataset.phoneBound) {
    writerPhone.dataset.phoneBound = '1';
    writerPhone.addEventListener('input', function () {
      if (applyingForm) return;
      syncWriterPhone(true);
    });
    writerPhone.addEventListener('blur', function () {
      syncWriterPhone(false);
    });
    syncWriterPhone(false);
  }

  bindAllReportDateRanges();
  document.getElementById('btnAddReportJoinTech')?.addEventListener('click', appendReportJoinTechEntry);
  syncReportJoinTechActions();

  (function bindHistoryTechToReport() {
    var hist = document.getElementById('inspectHistoryView');
    if (hist && !hist.dataset.techSyncBound) {
      hist.dataset.techSyncBound = '1';
      hist.addEventListener('change', function (e) {
        var t = e.target;
        if (!t || (t.tagName !== 'INPUT' && t.tagName !== 'SELECT')) return;
        var field = t.closest('.field');
        var label = txt(field && field.querySelector('.field-lbl'));
        if (label === '과업참여기간' || label === '기술등급' || label === '성명') syncReportTechsFromHistory(true, false);
      });
      hist.addEventListener('input', function (e) {
        var t = e.target;
        if (!t || (t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA' && t.tagName !== 'SELECT')) return;
        if (t.id === 'inspectWriterName' || t.id === 'inspectWriterOrg' || t.id === 'inspectWriterPos') {
          syncWriterToLeadTech(false);
          return;
        }
        if (t.id === 'leadTechName' || t.id === 'leadTechOrg' || t.id === 'leadTechPos' || t.id === 'inspectHistLeadName') {
          markUnsynced(t);
        }
        var field = t.closest('.field');
        var label = txt(field && field.querySelector('.field-lbl'));
        if (label === '성명' || label === '책임기술자명' || label === '과업참여기간' || label === '기술등급') syncReportTechsFromHistory(true, false);
      });
    }
    var report = document.getElementById('inspectReportView');
    if (report && !report.dataset.techEditBound) {
      report.dataset.techEditBound = '1';
      report.addEventListener('input', function (e) {
        var t = e.target;
        if (!t || t.tagName !== 'INPUT') return;
        if (!t.closest('.report-tech-card')) return;
        var field = t.closest('.report-field');
        var lab = txt(field && field.querySelector('label'));
        if (lab === '성명') t.setAttribute('data-synced', '0');
      });
    }
    syncWriterToLeadTech(false);
    syncReportTechsFromHistory(false, true);
  })();

  document.getElementById('inspectCheckType')?.addEventListener('change', function () {
    if (applyingForm) return;
    var next = currentPeriod();
    if (!inspectPeriodOpen(next)) {
      alert(inspectPeriodClosedMessage(next) + '\n기간 이후 작성, 등록이 필요한 경우 관리자에게 문의해 주세요.');
      setCheckType(activePeriod);
      syncInspectPeriodOptions();
      return;
    }
    if (next === activePeriod) {
      syncReportFromHistory();
      return;
    }
    if (!isPeriodSubmitted(activePeriod)) savePeriodState(activePeriod);
    activePeriod = next;
    restorePeriod(activePeriod);
  });
  ['inspDiagStart', 'inspDiagEnd'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el || el.dataset.reportSyncBound) return;
    el.dataset.reportSyncBound = '1';
    el.addEventListener('change', function () {
      if (applyingForm) return;
      syncReportFromHistory();
    });
  });

  /* 제출/임시저장 내역을 로컬스토리지에 보관 → 이력·목록에 반영 */
  function isSummaryCheckItem(card) {
    if (!card) return false;
    if (card.getAttribute('data-summary') === '1') return true;
    var group = card.closest('.check-group');
    return collTitleName(group && group.querySelector(':scope > .coll-hd .coll-title')) === '종합의견';
  }
  function isReportDefaultOpinionSection(title) {
    title = String(title || '').replace(/\s+/g, ' ').trim();
    return title === '점검 실시결과' || title === '점검 실시결과 현황' || title === '참고사항';
  }
  function reportSectionTitle(sec) {
    var title = sec && sec.querySelector('.report-section__title b');
    return txt(title);
  }
  function isDefaultOpinionReportField(field) {
    if (!field) return false;
    var section = field.closest('.report-section');
    return isReportDefaultOpinionSection(reportSectionTitle(section));
  }
  function reportDefaultOpinionTextareas() {
    var list = [];
    var view = document.getElementById('inspectReportView');
    if (!view) return list;
    view.querySelectorAll('.report-section').forEach(function (sec) {
      var title = reportSectionTitle(sec);
      if (!isReportDefaultOpinionSection(title)) return;
      sec.querySelectorAll('.report-field textarea').forEach(function (ta) {
        var field = ta.closest('.report-field');
        if (field && field.hidden) return;
        list.push(ta);
      });
    });
    return list;
  }
  function fillDefaultOpinions() {
    syncReportPublicDefectField();
    checklistCards().forEach(function (card) {
      if (card.getAttribute('data-yn') === '1') {
        var yn = card.querySelector('input.public-use-yn:checked');
        if (!yn || yn.value !== '유') return;
      }
      var ta = card.querySelector('textarea.opinion-ta');
      if (ta && !String(ta.value || '').trim()) {
        ta.value = isSummaryCheckItem(card) ? '의견없음' : '이상없음';
      }
    });
    reportDefaultOpinionTextareas().forEach(function (ta) {
      if (ta && !String(ta.value || '').trim()) ta.value = '의견없음';
    });
  }
  function clearDefaultOpinionDisplay() {
    checklistCards().forEach(function (card) {
      var ta = card.querySelector('textarea.opinion-ta');
      if (!ta) return;
      var def = isSummaryCheckItem(card) ? '의견없음' : '이상없음';
      if (String(ta.value || '').trim() === def) ta.value = '';
    });
    reportDefaultOpinionTextareas().forEach(function (ta) {
      if (ta && String(ta.value || '').trim() === '의견없음') ta.value = '';
    });
  }
  window.pomsSaveRecord = function (status) {
    if (isPeriodSubmitted()) return;
    activePeriod = currentPeriod();
    if (!inspectPeriodOpen(activePeriod)) {
      alert(inspectPeriodClosedMessage(activePeriod) + '\n기간 이후 작성, 등록이 필요한 경우 관리자에게 문의해 주세요.');
      return false;
    }
    savePeriodState(activePeriod, status);
    try {
      var flags = {};
      try { flags = JSON.parse(localStorage.getItem('pomsInspectPeriodFlags') || sessionStorage.getItem('pomsInspectPeriodFlags') || '{}') || {}; } catch (e2) { flags = {}; }
      var name = facilityName();
      flags[name] = flags[name] || {};
      flags[name][activePeriod] = status;
      var json = JSON.stringify(flags);
      localStorage.setItem('pomsInspectPeriodFlags', json);
      sessionStorage.setItem('pomsInspectPeriodFlags', json);
    } catch (e) {}
    var rec = readRecords()[facilityName()];
    var slot = rec && rec.periods && rec.periods[activePeriod];
    if (slot && slot.snapshot) applySnapshotPhotos(slot.snapshot);
    return true;
  };
  function isEmptySelect(sel) {
    var v = (sel.value || '').trim();
    return !v || /^(입력중|선택)/.test(v);
  }
  function ctrlOf(field, selector) {
    return field.querySelector(selector);
  }

  function isLockedCtrl(el) {
    if (!el) return true;
    if (el.disabled || el.readOnly || el.classList.contains('is-readonly')) return true;
    if (el.type === 'file' || el.type === 'hidden' || el.type === 'radio' || el.type === 'checkbox' || el.type === 'button') return true;
    return false;
  }
  function isInspectTabPanel(el) {
    return !!(el && (el.id === 'inspectHistoryView' || el.id === 'inspectChecklistView' || el.id === 'inspectReportView'));
  }
  function isHiddenNode(el) {
    if (!el) return true;
    var node = el;
    while (node) {
      if (node.hidden && !isInspectTabPanel(node)) return true;
      node = node.parentElement;
    }
    return false;
  }

  /* 하단 버튼·메뉴에 가려진 높이를 빼서, 보이는 영역 기준으로 맞춘다. */
  function obscuredScrollBottom(scroller) {
    var scRect = scroller.getBoundingClientRect();
    var limit = scRect.bottom;
    var footer = document.getElementById('inspectFormFooter');
    if (footer && window.getComputedStyle(footer).display !== 'none') {
      limit = Math.min(limit, footer.getBoundingClientRect().top);
    }
    var nav = scroller.parentElement && scroller.parentElement.querySelector(':scope > .inspect-bottom-nav');
    if (nav && window.getComputedStyle(nav).display !== 'none') {
      limit = Math.min(limit, nav.getBoundingClientRect().top);
    }
    return Math.max(0, scRect.bottom - limit);
  }

  /* 아래에 내용이 보이는 화면 절반을 채우면 가운데, 맨 아래뿐이면 버튼 위에 붙인다. */
  function scrollValidationTarget(el) {
    var scroller = document.getElementById('inspectScroll');
    var target = el && el.closest ? (el.closest('.field, .report-field') || el) : el;
    if (!scroller || !target || !scroller.contains(target)) {
      if (target && target.scrollIntoView) target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      return;
    }
    var pad = 16;
    var scRect = scroller.getBoundingClientRect();
    var elRect = target.getBoundingClientRect();
    var viewH = scroller.clientHeight;
    var visibleH = Math.max(elRect.height + pad * 2, viewH - obscuredScrollBottom(scroller));
    var maxScroll = Math.max(0, scroller.scrollHeight - viewH);
    var top = elRect.top - scRect.top + scroller.scrollTop;
    var bottom = top + elRect.height;
    var roomBelow = scroller.scrollHeight - bottom;
    var centerGap = Math.max(0, (visibleH - elRect.height) / 2);
    var next = roomBelow < centerGap ? (bottom - visibleH + pad) : (top - centerGap);
    scroller.scrollTop = Math.max(0, Math.min(next, maxScroll));
  }

  /* 누락 항목으로 이동 + 안내 */
  function report(section, label, el, verb) {
    var card = el && el.closest('.coll-card');
    var group = el && el.closest('.check-group');
    function openColl(c) {
      if (!c || !c.id) return;
      var key = c.id.replace(/^sec-/, '');
      var body = document.getElementById('body-' + key);
      if (body && body.classList.contains('hidden') && typeof toggleSection === 'function') {
        toggleSection(key);
      }
    }
    openColl(group);
    openColl(card);
    alert('[' + section + '] ' + label + ' 항목을 ' + (verb || '입력') + '해주세요.');
    if (el && el.focus) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
    if (el) {
      scrollValidationTarget(el);
      window.requestAnimationFrame(function () { scrollValidationTarget(el); });
    }
    return false;
  }

  function validateSecCards(scope, tabToOpen) {
    if (!scope) return true;
    var cards = scope.querySelectorAll('.sec-card');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (isHiddenNode(card)) continue;
      var section = txt(card.querySelector('.sec-hd-title')) || '입력';
      var fields = card.querySelectorAll('.field');
      for (var j = 0; j < fields.length; j++) {
        var field = fields[j];
        if (isHiddenNode(field)) continue;
        var label = txt(field.querySelector('.field-lbl')) || section;
        var ctrls = field.querySelectorAll('input, select, textarea');
        for (var c = 0; c < ctrls.length; c++) {
          var el = ctrls[c];
          if (isLockedCtrl(el) || isHiddenNode(el)) continue;
          if (el.tagName === 'SELECT') {
            if (isEmptySelect(el)) {
              if (tabToOpen && window.pomsActivateInspectTab) window.pomsActivateInspectTab(tabToOpen);
              return report(section, label, el, '선택');
            }
          } else if (!String(el.value || '').trim()) {
            if (tabToOpen && window.pomsActivateInspectTab) window.pomsActivateInspectTab(tabToOpen);
            return report(section, label, el);
          }
        }
      }
    }
    return true;
  }

  function validateHistorySigns(stay) {
    var historyView = document.getElementById('inspectHistoryView');
    if (!historyView) return true;
    var signBoxes = historyView.querySelectorAll('.sign-box');
    for (var s = 0; s < signBoxes.length; s++) {
      var box = signBoxes[s];
      if (isHiddenNode(box)) continue;
      var signed = box.classList.contains('is-signed') || !!box.dataset.sign;
      if (signed) continue;
      var signCard = box.closest('.sec-card') || box.closest('.tech-entry');
      var signSection = txt(signCard && signCard.querySelector('.sec-hd-title')) || '점검이력정보';
      var signLabel = txt(box.closest('.field') && box.closest('.field').querySelector('.field-lbl')) || '서명';
      if (!stay && window.pomsActivateInspectTab) window.pomsActivateInspectTab('history');
      return report(signSection, signLabel, box, '저장');
    }
    return true;
  }

  window.pomsValidateHistory = function (stay) {
    if (!validateSecCards(document.getElementById('inspectHistoryView'), stay ? null : 'history')) return false;
    return validateHistorySigns(stay);
  };

  function inspectTabRank(tab) {
    if (tab === 'checklist') return 1;
    if (tab === 'report') return 2;
    return 0;
  }

  window.pomsCurrentInspectTab = function () {
    var on = document.querySelector('#inspectTabBar .tab-item.active');
    return on ? (on.getAttribute('data-inspect-tab') || 'history') : 'history';
  };

  /* 이전 탭은 항상 이동. 다음 탭은 앞 단계 작성이 끝나야 연다. */
  window.pomsCanOpenInspectTab = function (target) {
    var current = window.pomsCurrentInspectTab();
    if (!target || target === current) return true;
    if (inspectTabRank(target) <= inspectTabRank(current)) return true;
    if (!window.pomsValidateHistory(current === 'history')) return false;
    if (target === 'checklist') return true;
    if (current !== 'checklist' && window.pomsActivateInspectTab) window.pomsActivateInspectTab('checklist');
    return !!window.pomsValidateChecklistStep(true);
  };

  window.pomsValidateChecklistStep = function (stay) {
    var view = document.getElementById('inspectChecklistView');
    if (!view) return true;
    var colls = checklistCards();
    for (var k = 0; k < colls.length; k++) {
      var coll = colls[k];
      if (isHiddenNode(coll)) continue;
      var name = collTitleName(coll.querySelector('.coll-title')) || '점검항목';
      if (coll.getAttribute('data-yn') === '1') {
        var ynRadios = coll.querySelectorAll('input.public-use-yn');
        if (ynRadios.length && !coll.querySelector('input.public-use-yn:checked')) {
          if (!stay && window.pomsActivateInspectTab) window.pomsActivateInspectTab('checklist');
          return report(name, '유/무', ynRadios[0], '선택');
        }
      }
    }
    return validateSecCards(view, stay ? null : 'checklist');
  };

  /* ── 체크리스트 검증 ── */
  window.pomsValidateChecklist = function () {
    if (!window.pomsValidateHistory()) return false;
    return window.pomsValidateChecklistStep();
  };

  /* ── 결과보고서 검증 ── */
  window.pomsValidateReport = function () {
    var view = document.getElementById('inspectReportView');
    if (!view) return true;
    var sections = view.querySelectorAll('.report-section');
    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      var section = reportSectionTitle(sec) || '결과보고서';
      var fields = sec.querySelectorAll('.report-field');
      for (var j = 0; j < fields.length; j++) {
        var field = fields[j];
        if (field.hidden) continue;
        var label = txt(field.querySelector(':scope > label'));
        var inp = field.querySelector('input[type="text"]:not(.is-readonly):not([readonly])');
        var dates = field.querySelectorAll('input[type="date"]:not([readonly]):not(.is-readonly)');
        var sel = field.querySelector('select');
        var ta = field.querySelector('textarea');
        if (inp && !inp.value.trim()) return report(section, label, inp);
        for (var d = 0; d < dates.length; d++) {
          if (!dates[d].value) return report(section, label, dates[d], '선택');
        }
        if (sel && isEmptySelect(sel)) return report(section, label, sel, '선택');
        if (ta && !ta.value.trim()) {
          if (field.hidden || isDefaultOpinionReportField(field)) continue;
          return report(section, label, ta);
        }
      }
    }
    return true;
  };
})();

/* 모바일 브라우저: 하단 버튼을 눌러도 문서가 스크롤되며 메뉴가 밀리지 않게 한다. */
(function pinInspectBottom() {
  if (!window.matchMedia || !window.matchMedia('(max-width: 480px)').matches) return;

  var locking = false;

  function pin() {
    if (locking) return;
    if (!window.scrollX && !window.scrollY) return;
    locking = true;
    window.scrollTo(0, 0);
    locking = false;
  }

  window.addEventListener('resize', pin);
  window.addEventListener('orientationchange', function () {
    window.setTimeout(pin, 280);
  });
  window.addEventListener('scroll', pin, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', pin);
    window.visualViewport.addEventListener('scroll', function () {
      pin();
      if (window.visualViewport.offsetTop) window.scrollTo(0, 0);
    });
  }
  document.addEventListener('pointerup', function (e) {
    var t = e.target;
    if (!t || !t.closest || !t.closest('.form-footer, .inspect-bottom-nav')) return;
    pin();
    window.setTimeout(pin, 80);
    window.setTimeout(pin, 350);
  }, true);
  pin();
})();
