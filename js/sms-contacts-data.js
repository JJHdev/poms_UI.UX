/**
 * SMS 연락처 — 그룹·연락처 샘플 데이터 (공유)
 */
const SmsContactsData = (() => {
  const STORAGE_KEY = 'poms_sms_contacts_v1';

  const defaultGroups = [
    { id: 'g-busan', name: '부산청 담당자' },
    { id: 'g-incheon', name: '인천청 담당자' },
    { id: 'g-ulsan', name: '울산청 담당자' },
    { id: 'g-pohang', name: '포항청 담당자' },
    { id: 'g-yeosu', name: '여수청 담당자' },
    { id: 'g-etc', name: '기타 기관' },
  ];

  const defaultContacts = [
    { id: 'c1', name: '김민수', phone: '010-1234-5678', agency: '부산지방해양수산청', position: '주무관', assigned: true, groupId: 'g-busan' },
    { id: 'c2', name: '이영희', phone: '010-2345-6789', agency: '부산지방해양수산청', position: '주사', assigned: true, groupId: 'g-busan' },
    { id: 'c3', name: '박철수', phone: '010-3456-7890', agency: '인천지방해양수산청', position: '주무관', assigned: false, groupId: 'g-incheon' },
    { id: 'c4', name: '최지현', phone: '010-4567-8901', agency: '인천지방해양수산청', position: '주사', assigned: true, groupId: 'g-incheon' },
    { id: 'c5', name: '정대호', phone: '010-5678-9012', agency: '울산지방해양수산청', position: '주무관', assigned: true, groupId: 'g-ulsan' },
    { id: 'c6', name: '한소영', phone: '010-6789-0123', agency: '울산지방해양수산청', position: '주사', assigned: false, groupId: 'g-ulsan' },
    { id: 'c7', name: '오준석', phone: '010-7890-1234', agency: '포항지방해양수산청', position: '주무관', assigned: true, groupId: 'g-pohang' },
    { id: 'c8', name: '윤서연', phone: '010-8901-2345', agency: '여수지방해양수산청', position: '주사', assigned: true, groupId: 'g-yeosu' },
    { id: 'c9', name: '강동원', phone: '010-9012-3456', agency: '여수지방해양수산청', position: '주무관', assigned: false, groupId: 'g-yeosu' },
    { id: 'c10', name: '임하늘', phone: '010-0123-4567', agency: '기타기관', position: '주사', assigned: true, groupId: 'g-etc' },
    { id: 'c11', name: '송미래', phone: '010-1122-3344', agency: '부산지방해양수산청', position: '주무관', assigned: true, groupId: 'g-busan' },
    { id: 'c12', name: '류태준', phone: '010-2233-4455', agency: '인천지방해양수산청', position: '주사', assigned: false, groupId: 'g-incheon' },
    { id: 'c13', name: '배수진', phone: '010-3344-5566', agency: '울산지방해양수산청', position: '주무관', assigned: true, groupId: 'g-ulsan' },
    { id: 'c14', name: '홍길동', phone: '010-4455-6677', agency: '포항지방해양수산청', position: '주사', assigned: true, groupId: 'g-pohang' },
    { id: 'c15', name: 'Alice Kim', phone: '010-5566-7788', agency: '여수지방해양수산청', position: '주무관', assigned: false, groupId: 'g-yeosu' },
    { id: 'c16', name: '123테스트', phone: '010-6677-8899', agency: '기타기관', position: '주사', assigned: true, groupId: 'g-etc' },
    { id: 'c17', name: '나동혁', phone: '010-7788-9900', agency: '부산지방해양수산청', position: '주무관', assigned: true, groupId: 'g-busan' },
    { id: 'c18', name: '도경수', phone: '010-8899-0011', agency: '인천지방해양수산청', position: '주사', assigned: true, groupId: 'g-incheon' },
    { id: 'c19', name: '마서준', phone: '010-9900-1122', agency: '울산지방해양수산청', position: '주무관', assigned: false, groupId: 'g-ulsan' },
    { id: 'c20', name: '백지민', phone: '010-1010-2020', agency: '포항지방해양수산청', position: '주사', assigned: true, groupId: 'g-pohang' },
  ];

  let groups = [];
  let contacts = [];

  function load() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        groups = parsed.groups || [...defaultGroups];
        contacts = parsed.contacts || [...defaultContacts];
        return;
      }
    } catch (_) { /* ignore */ }
    groups = defaultGroups.map((g) => ({ ...g }));
    contacts = defaultContacts.map((c) => ({ ...c }));
    save();
  }

  function save() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ groups, contacts }));
  }

  function getGroups() {
    return groups.map((g) => ({ ...g, count: contacts.filter((c) => c.groupId === g.id).length }));
  }

  function getTotalCount() {
    return contacts.length;
  }

  function getContacts() {
    return contacts.map((c) => ({ ...c }));
  }

  function getGroupById(id) {
    return groups.find((g) => g.id === id) || null;
  }

  function addGroup(name) {
    const id = `g-${Date.now()}`;
    groups.push({ id, name });
    save();
    return id;
  }

  function updateGroup(id, name) {
    const group = groups.find((g) => g.id === id);
    if (!group) return false;
    group.name = name;
    save();
    return true;
  }

  function deleteGroup(id) {
    groups = groups.filter((g) => g.id !== id);
    contacts.forEach((c) => {
      if (c.groupId === id) c.groupId = 'g-etc';
    });
    if (!groups.some((g) => g.id === 'g-etc')) {
      groups.push({ id: 'g-etc', name: '기타 기관' });
    }
    save();
  }

  function addContact(data) {
    const id = `c-${Date.now()}`;
    contacts.push({
      id,
      name: data.name,
      phone: data.phone,
      agency: data.agency,
      position: data.position,
      assigned: data.assigned,
      groupId: data.groupId,
    });
    save();
    return id;
  }

  function updateContact(id, data) {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return false;
    Object.assign(contact, data);
    save();
    return true;
  }

  function deleteContact(id) {
    contacts = contacts.filter((c) => c.id !== id);
    save();
  }

  function moveContactsToGroup(contactIds, groupId) {
    contacts.forEach((c) => {
      if (contactIds.includes(c.id)) c.groupId = groupId;
    });
    save();
  }

  function getContactsByIds(ids) {
    return contacts.filter((c) => ids.includes(c.id)).map((c) => ({ ...c }));
  }

  const IMPORT_KEY = 'poms_sms_import_recipients';

  function setImportRecipients(list) {
    sessionStorage.setItem(IMPORT_KEY, JSON.stringify(list));
  }

  function consumeImportRecipients() {
    try {
      const raw = sessionStorage.getItem(IMPORT_KEY);
      if (!raw) return null;
      sessionStorage.removeItem(IMPORT_KEY);
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  load();

  return {
    getGroups,
    getTotalCount,
    getContacts,
    getGroupById,
    addGroup,
    updateGroup,
    deleteGroup,
    addContact,
    updateContact,
    deleteContact,
    moveContactsToGroup,
    getContactsByIds,
    setImportRecipients,
    consumeImportRecipients,
    AGENCIES: ['부산지방해양수산청', '인천지방해양수산청', '울산지방해양수산청', '포항지방해양수산청', '여수지방해양수산청', '기타기관'],
    POSITIONS: ['주무관', '주사', '과장', '팀장'],
  };
})();
