/**
 * 일정관리 화면 스크립트
 */
(() => {
  const schedules = {
    s01: {
      title: '등록일 기준 로그 조회',
      calendarId: '3',
      category: 'time',
      location: 'POMS',
      start: '2026-08-03T09:00',
      end: '2026-08-03T18:00',
    },
    s02: {
      title: '정기점검 마감',
      calendarId: '2',
      category: 'allday',
      location: 'POMS',
      start: '2026-08-03T00:00',
      end: '2026-08-03T23:59',
    },
    s03: {
      title: '정기점검 마감',
      calendarId: '2',
      category: 'allday',
      location: 'POMS',
      start: '2026-08-11T00:00',
      end: '2026-08-12T23:59',
    },
  };

  const calendarLabels = {
    1: '일반',
    2: '긴급',
    3: '긴급',
    4: '긴급',
  };

  const fields = {
    title: document.getElementById('scheduleTitleInput'),
    calendar: document.getElementById('scheduleCalendarInput'),
    category: document.getElementById('scheduleCategoryInput'),
    location: document.getElementById('scheduleLocationInput'),
    start: document.getElementById('scheduleStartInput'),
    end: document.getElementById('scheduleEndInput'),
  };
  const drawer = document.getElementById('scheduleDrawer');
  const overlay = document.getElementById('scheduleDrawerOverlay');
  const drawerTitle = document.getElementById('scheduleDrawerTitle');
  const drawerSub = document.getElementById('scheduleDrawerSub');
  const drawerMessage = document.getElementById('scheduleDrawerMessage');

  function openDrawer() {
    overlay?.classList.add('is-open');
    drawer?.classList.add('is-open');
    drawer?.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    overlay?.classList.remove('is-open');
    drawer?.classList.remove('is-open');
    drawer?.setAttribute('aria-hidden', 'true');
  }

  function calendarName(id) {
    return calendarLabels[id] || '일반';
  }

  function fill(schedule, mode = 'edit') {
    fields.title.value = schedule.title;
    fields.calendar.value = schedule.calendarId;
    fields.category.value = schedule.category;
    fields.location.value = schedule.location;
    fields.start.value = schedule.start;
    fields.end.value = schedule.end;
    drawerTitle.textContent = mode === 'new' ? '일정 등록' : '일정 상세/수정';
    drawerSub.textContent =
      mode === 'new'
        ? '신규 일정을 입력합니다.'
        : `${calendarName(schedule.calendarId)} · ${schedule.start.replace('T', ' ')}`;
    drawerMessage.textContent =
      mode === 'new'
        ? '신규 일정은 저장 시 캘린더에 표시됩니다.'
        : '선택한 일정 정보를 확인하고 수정합니다.';
    document.getElementById('scheduleDelete').hidden = mode === 'new';
    openDrawer();
  }

  document.querySelectorAll('[data-schedule-id]').forEach((eventEl) => {
    eventEl.addEventListener('click', () => {
      const schedule = schedules[eventEl.dataset.scheduleId];
      if (schedule) fill(schedule);
    });
  });

  document.querySelectorAll('.calendar-check input').forEach((input) => {
    input.addEventListener('change', () => {
      if (input.value === 'all') {
        document.querySelectorAll('.calendar-check input:not([value="all"])').forEach((item) => {
          item.checked = input.checked;
        });
      }
      drawerMessage.textContent = '선택한 캘린더만 화면에 표시합니다.';
    });
  });

  document.getElementById('scheduleNew')?.addEventListener('click', () => {
    fill(
      {
        title: '',
        calendarId: '1',
        category: 'time',
        location: '',
        start: '2026-08-20T09:00',
        end: '2026-08-20T18:00',
      },
      'new'
    );
  });

  document.getElementById('scheduleToday')?.addEventListener('click', () => {
    document.getElementById('scheduleRange').textContent = '2026년 8월';
  });

  document.getElementById('schedulePrev')?.addEventListener('click', () => {
    document.getElementById('scheduleRange').textContent = '2026년 7월';
  });

  document.getElementById('scheduleNext')?.addEventListener('click', () => {
    document.getElementById('scheduleRange').textContent = '2026년 9월';
  });

  document.getElementById('scheduleDelete')?.addEventListener('click', () => {
    drawerMessage.textContent = '선택한 일정을 삭제 처리했습니다.';
  });

  document.getElementById('scheduleSave')?.addEventListener('click', () => {
    drawerMessage.textContent = '저장되었습니다.';
  });

  document.getElementById('scheduleDrawerClose')?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
})();
