/* --- Statisk testdata & datumhjälpare för Delad Vårdnad --- */

export const SWEDISH_MONTHS = [
  'Januari',
  'Februari',
  'Mars',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'Augusti',
  'September',
  'Oktober',
  'November',
  'December',
];

export const SWEDISH_WEEKDAYS_LONG = [
  'Söndag',
  'Måndag',
  'Tisdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Lördag',
];

export const SWEDISH_WEEKDAYS_SHORT = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

export const EVENT_CATEGORIES = [
  'VAB',
  'Vård',
  'Förskola',
  'Skola',
  'Kalas',
  'Högtid',
  'Fritidsaktivitet',
];

export const COLOR_SWATCHES = [
  { key: 'pink', label: 'Rosa' },
  { key: 'purple', label: 'Lila' },
  { key: 'amber', label: 'Gul' },
  { key: 'mint', label: 'Mintgrön' },
  { key: 'sage', label: 'Salviagrön' },
  { key: 'sand', label: 'Sandfärg' },
  { key: 'sky', label: 'Himmelsblå' },
  { key: 'slate', label: 'Skiffer' },
];

export const INITIAL_GUARDIANS = [
  {
    id: 'mamma',
    name: 'Mamma',
    initial: 'M',
    defaultColorKey: 'sage',
  },
  {
    id: 'pappa',
    name: 'Pappa',
    initial: 'P',
    defaultColorKey: 'sand',
  },
];

export const INITIAL_CHILDREN = [
  {
    id: 'elsa',
    name: 'Elsa',
    initial: 'E',
    defaultColorKey: 'pink',
  },
  {
    id: 'noah',
    name: 'Noah',
    initial: 'N',
    defaultColorKey: 'purple',
  },
];

/* Färginställningar sparas separat per vårdnadshavares egen vy */
export const INITIAL_COLOR_PREFERENCES = {
  mamma: {
    mamma: 'sage',
    pappa: 'sand',
    elsa: 'pink',
    noah: 'purple',
    both: 'sky',
  },
  pappa: {
    mamma: 'sage',
    pappa: 'sand',
    elsa: 'pink',
    noah: 'purple',
    both: 'sky',
  },
};

export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'Utvecklingssamtal',
    date: '2026-11-10',
    time: '14:00-14:45',
    isAllDay: false,
    childId: 'noah',
    isHandover: false,
    handoverParent: null,
    category: 'Skola',
    location: 'Solbacka skola',
    description: 'Samtal med klassläraren i rum 2B.',
    isRegistered: false,
    status: 'approved',
    createdBy: 'mamma',
    checklist: [],
    comments: [],
  },
  {
    id: 'evt-2',
    title: 'Hämta barnen på förskolan',
    date: '2026-11-13',
    time: '16:30',
    isAllDay: false,
    childId: 'both',
    isHandover: true,
    handoverParent: 'pappa',
    category: 'Förskola',
    location: 'Framtidens Förskola',
    description: 'Överlämning inför helgen hos Pappa.',
    isRegistered: false,
    status: 'approved',
    createdBy: 'mamma',
    checklist: [
      { id: 'chk-2-1', text: 'Fotbollsskor', done: true },
      { id: 'chk-2-2', text: 'Skolväska', done: true },
      { id: 'chk-2-3', text: 'Gosedjur', done: true },
    ],
    comments: [],
  },
  {
    id: 'evt-3',
    title: 'Tandläkare',
    date: '2026-11-19',
    time: '09:00',
    isAllDay: false,
    childId: 'both',
    isHandover: false,
    handoverParent: null,
    category: 'Vård',
    location: 'Galaxen',
    description: 'Årlig kontroll för båda barnen.',
    isRegistered: true,
    status: 'approved',
    createdBy: 'pappa',
    checklist: [],
    comments: [],
  },
  {
    id: 'evt-4',
    title: 'Fotboll',
    date: '2026-11-19',
    time: '17:00',
    isAllDay: false,
    childId: 'elsa',
    isHandover: false,
    handoverParent: null,
    category: 'Fritidsaktivitet',
    location: 'Arenan',
    description: 'Träning med laget på plan 2.',
    isRegistered: true,
    status: 'approved',
    createdBy: 'mamma',
    checklist: [
      { id: 'chk-4-1', text: 'Benskydd', done: true },
      { id: 'chk-4-2', text: 'Vattenflaska', done: true },
    ],
    comments: [],
  },
  {
    id: 'evt-5',
    title: 'Fotboll',
    date: '2026-11-25',
    time: '17:00',
    isAllDay: false,
    childId: 'elsa',
    isHandover: false,
    handoverParent: null,
    category: 'Fritidsaktivitet',
    location: 'Arenan',
    description: 'Extra träning inför helgens match. Kan du köra eller möta upp?',
    isRegistered: true,
    status: 'pending',
    createdBy: 'pappa',
    checklist: [
      { id: 'chk-5-1', text: 'Fotbollsskor', done: false },
      { id: 'chk-5-2', text: 'Vattenflaska', done: false },
    ],
    comments: [],
  },
  {
    id: 'evt-6',
    title: 'Hämta Elsa och Noah på förskolan',
    date: '2026-11-27',
    time: '06:30-16:30',
    isAllDay: false,
    childId: 'both',
    isHandover: true,
    handoverParent: 'mamma',
    category: 'Förskola',
    location: 'Framtidens förskola',
    description: 'Bytesdag och hämtning innan helgen.',
    isRegistered: false,
    status: 'approved',
    createdBy: 'mamma',
    checklist: [
      { id: 'chk-6-1', text: 'Skridskor', done: true },
      { id: 'chk-6-2', text: 'Overall', done: true },
      { id: 'chk-6-3', text: 'Hjälm', done: false },
    ],
    comments: [
      {
        id: 'cmt-6-1',
        authorId: 'pappa',
        timestamp: '2026-11-25 15:33',
        text: 'Har inte hittat Noahs hjälm, kolla gärna en extra gång hos dig. Jag letar vidare.',
      },
    ],
  },
  {
    id: 'evt-7',
    title: 'Fotboll',
    date: '2026-11-27',
    time: '17:00',
    isAllDay: false,
    childId: 'elsa',
    isHandover: false,
    handoverParent: null,
    category: 'Fritidsaktivitet',
    location: 'Arenan',
    description: 'Fredagsträning efter hämtning.',
    isRegistered: true,
    status: 'approved',
    createdBy: 'mamma',
    checklist: [],
    comments: [],
  },
  {
    id: 'evt-8',
    title: 'Kalas hos Alma',
    date: '2026-11-29',
    time: '13:00-15:00',
    isAllDay: false,
    childId: 'elsa',
    isHandover: false,
    handoverParent: null,
    category: 'Kalas',
    location: 'Parkvägen 14',
    description: 'Present ligger i hallen hos Pappa.',
    isRegistered: true,
    status: 'approved',
    createdBy: 'pappa',
    checklist: [
      { id: 'chk-8-1', text: 'Present', done: true },
    ],
    comments: [],
  },
  {
    id: 'evt-9',
    title: 'Luciafirande',
    date: '2026-12-11',
    time: '08:15-09:15',
    isAllDay: false,
    childId: 'both',
    isHandover: false,
    handoverParent: null,
    category: 'Högtid',
    location: 'Framtidens förskola',
    description: 'Båda vårdnadshavare välkomna på gården.',
    isRegistered: false,
    status: 'pending',
    createdBy: 'mamma',
    checklist: [
      { id: 'chk-9-1', text: 'Lucialinne', done: false },
      { id: 'chk-9-2', text: 'Tomteluva', done: false },
    ],
    comments: [],
  },
];

/* --- Datum- och schemahjälpare --- */

export function parseDateISO(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getISOWeekNumber(date) {
  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
  const week1 = new Date(temp.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((temp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
}

export function formatSwedishDayTitle(dateStr) {
  const date = parseDateISO(dateStr);
  const weekday = SWEDISH_WEEKDAYS_LONG[date.getDay()];
  const day = date.getDate();
  const month = SWEDISH_MONTHS[date.getMonth()];
  return `${weekday} ${day} ${month}`;
}

/**
 * Beräknar vilken vårdnadshavare som har barnet ett visst datum.
 * Returnerar { type: 'single', owner: 'mamma' | 'pappa' }
 * eller { type: 'handover', from: 'mamma' | 'pappa', to: 'mamma' | 'pappa' }.
 */
export function getCustodyForDate(dateStr, pattern = 'alternating-weeks') {
  const date = parseDateISO(dateStr);
  // Referensdatum: Fredag 2026-10-30 (v.44, bytesdag från Mamma till Pappa)
  const anchor = new Date(2026, 9, 30);
  const diffDays = Math.round((date.getTime() - anchor.getTime()) / 86400000);

  if (pattern === 'alternating-weekends') {
    // Varannan helg: Pappa har barnet fre em -> sön em jämna veckor (t.ex. v.44, v.46, v.48)
    const weekNum = getISOWeekNumber(date);
    const dayOfWeek = date.getDay(); // 0=Sön, 5=Fre, 6=Lör
    const isEvenWeek = weekNum % 2 === 0;
    if (isEvenWeek) {
      if (dayOfWeek === 5) {
        return { type: 'handover', from: 'mamma', to: 'pappa' };
      }
      if (dayOfWeek === 6) {
        return { type: 'single', owner: 'pappa' };
      }
      if (dayOfWeek === 0) {
        return { type: 'handover', from: 'pappa', to: 'mamma' };
      }
    }
    return { type: 'single', owner: 'mamma' };
  }

  // Standard: Varannan vecka (fredag till fredag)
  // Cykel på 14 dagar från 2026-10-30:
  // Dag 0 (Fre): Mamma -> Pappa
  // Dag 1..6 (Lör-Tor): Pappa
  // Dag 7 (Fre): Pappa -> Mamma
  // Dag 8..13 (Lör-Tor): Mamma
  const cycleDay = ((diffDays % 14) + 14) % 14;
  if (cycleDay === 0) {
    return { type: 'handover', from: 'mamma', to: 'pappa' };
  }
  if (cycleDay >= 1 && cycleDay <= 6) {
    return { type: 'single', owner: 'pappa' };
  }
  if (cycleDay === 7) {
    return { type: 'handover', from: 'pappa', to: 'mamma' };
  }
  return { type: 'single', owner: 'mamma' };
}

export function getMonthCalendarWeeks(year, monthIndex) {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7; // Måndag = 0
  const gridStart = new Date(year, monthIndex, 1 - startDayOffset);

  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  const endDayOffset = 6 - ((lastDayOfMonth.getDay() + 6) % 7);
  const gridEnd = new Date(year, monthIndex + 1, lastDayOfMonth.getDate() + endDayOffset);

  const weeks = [];
  const cursor = new Date(gridStart.getTime());

  while (cursor <= gridEnd && weeks.length < 6) {
    const weekDays = [];
    const weekNumber = getISOWeekNumber(cursor);
    for (let i = 0; i < 7; i += 1) {
      weekDays.push({
        date: new Date(cursor.getTime()),
        dateISO: toDateISO(cursor),
        dayNumber: cursor.getDate(),
        inCurrentMonth: cursor.getMonth() === monthIndex,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push({ weekNumber, days: weekDays });
  }

  return weeks;
}

export function getWeekDaysFromDate(dateStr, dayCount = 5) {
  const date = parseDateISO(dateStr);
  const mondayOffset = (date.getDay() + 6) % 7;
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - mondayOffset);
  const weekNumber = getISOWeekNumber(monday);
  const days = [];
  for (let i = 0; i < dayCount; i += 1) {
    const current = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    days.push({
      date: current,
      dateISO: toDateISO(current),
      dayNumber: current.getDate(),
      weekdayShort: SWEDISH_WEEKDAYS_SHORT[i],
      weekdayLong: SWEDISH_WEEKDAYS_LONG[current.getDay()],
    });
  }
  return { weekNumber, days };
}

export function getCustodyClassName(custody) {
  if (!custody) return 'custody-mamma';
  if (custody.type === 'handover') {
    return custody.from === 'mamma' ? 'custody-mamma-to-pappa' : 'custody-pappa-to-mamma';
  }
  return custody.owner === 'mamma' ? 'custody-mamma' : 'custody-pappa';
}

/**
 * Kontrollerar om en Bytesdag/Överlämning på ett givet datum bryter ordinarie umgängesschema.
 */
export function isScheduleBreakingHandover(dateStr, handoverParent, pattern = 'alternating-weeks') {
  if (!dateStr) return false;
  const base = getCustodyForDate(dateStr, pattern);
  if (base.type === 'handover' && base.to === handoverParent) {
    return false;
  }
  return true;
}

/**
 * Beräknar effektiv vårdnad för ett enskilt barn ett givet datum, inklusive godkända avvikande byten
 * samt flagga för om ett förslag på byte inväntar godkännande.
 */
export function getChildCustodyForDate(
  dateStr,
  childId,
  pattern = 'alternating-weeks',
  events = []
) {
  const base = getCustodyForDate(dateStr, pattern);

  const matchingOverrides = events.filter(
    (evt) =>
      evt.isHandover &&
      evt.returnDate &&
      (evt.childId === 'both' || evt.childId === childId) &&
      dateStr >= evt.date &&
      dateStr <= evt.returnDate
  );

  const pendingOverrides = matchingOverrides.filter((evt) => evt.status === 'pending');
  const approvedOverrides = matchingOverrides.filter((evt) => evt.status === 'approved');
  const hasPendingOverride = pendingOverrides.length > 0;

  if (approvedOverrides.length > 0) {
    const ov = approvedOverrides[approvedOverrides.length - 1];
    const startBase = getCustodyForDate(ov.date, pattern);
    const defaultFrom =
      startBase.type === 'single'
        ? startBase.owner
        : startBase.from;
    const toParent = ov.handoverParent || (defaultFrom === 'mamma' ? 'pappa' : 'mamma');
    const fromParent =
      ov.fromParent ||
      (defaultFrom === toParent ? (toParent === 'mamma' ? 'pappa' : 'mamma') : defaultFrom);

    if (ov.date === ov.returnDate) {
      return {
        custody: { type: 'handover', from: fromParent, to: toParent, isSameDayReturn: true },
        hasPendingOverride,
        pendingOverrides,
        activeOverride: ov,
      };
    }

    if (dateStr === ov.date) {
      return {
        custody: { type: 'handover', from: fromParent, to: toParent },
        hasPendingOverride,
        pendingOverrides,
        activeOverride: ov,
      };
    }

    if (dateStr === ov.returnDate) {
      return {
        custody: { type: 'handover', from: toParent, to: fromParent },
        hasPendingOverride,
        pendingOverrides,
        activeOverride: ov,
      };
    }

    return {
      custody: { type: 'single', owner: toParent },
      hasPendingOverride,
      pendingOverrides,
      activeOverride: ov,
    };
  }

  return {
    custody: base,
    hasPendingOverride,
    pendingOverrides,
    activeOverride: null,
  };
}

function custodySignature(custody) {
  if (custody.type === 'handover') {
    return `handover-${custody.from}-${custody.to}-${Boolean(custody.isSameDayReturn)}`;
  }
  return `single-${custody.owner}`;
}

export function formatCustodyLabel(custody, guardians) {
  const mammaName = guardians.find((g) => g.id === 'mamma')?.name || 'Mamma';
  const pappaName = guardians.find((g) => g.id === 'pappa')?.name || 'Pappa';
  if (custody.isSameDayReturn) {
    return 'Bytesdag & Överlämning (samma dag)';
  }
  if (custody.type === 'handover') {
    return 'Bytesdag & Överlämning';
  }
  return custody.owner === 'mamma'
    ? `Hos ${mammaName.toLowerCase()}`
    : `Hos ${pappaName.toLowerCase()}`;
}

/**
 * Returnerar samlad visningsstruktur för en dag i kalender/modal/listvy.
 * Om syskon befinner sig hos olika vårdnadshavare under "Båda" returneras mode: 'split-children'.
 */
export function getDisplayCustodyForDate(
  dateStr,
  selectedChildFilter,
  childrenProfiles,
  guardians,
  pattern = 'alternating-weeks',
  events = []
) {
  if (selectedChildFilter !== 'both' || !childrenProfiles || childrenProfiles.length === 0) {
    const targetChild = selectedChildFilter === 'both' ? 'both' : selectedChildFilter;
    const res = getChildCustodyForDate(dateStr, targetChild, pattern, events);
    return {
      mode: 'single-custody',
      custody: res.custody,
      hasPendingOverride: res.hasPendingOverride,
      label: formatCustodyLabel(res.custody, guardians),
      childCustodies: [],
    };
  }

  const perChild = childrenProfiles.map((child) => ({
    child,
    ...getChildCustodyForDate(dateStr, child.id, pattern, events),
  }));

  const hasPendingOverride = perChild.some((item) => item.hasPendingOverride);
  const firstSig = custodySignature(perChild[0].custody);
  const allSame = perChild.every((item) => custodySignature(item.custody) === firstSig);

  if (allSame) {
    return {
      mode: 'single-custody',
      custody: perChild[0].custody,
      hasPendingOverride,
      label: formatCustodyLabel(perChild[0].custody, guardians),
      childCustodies: perChild,
    };
  }

  const splitLabel = perChild
    .map((item) => `${item.child.name}: ${formatCustodyLabel(item.custody, guardians)}`)
    .join(' · ');

  return {
    mode: 'split-children',
    custody: perChild[0].custody,
    hasPendingOverride,
    label: splitLabel,
    childCustodies: perChild,
  };
}

