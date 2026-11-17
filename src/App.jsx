/* ==========================================================================
   Delad Vårdnad — Huvudapplikation (App.jsx)
   ========================================================================== */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  List,
  Menu,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import {
  INITIAL_CHILDREN,
  INITIAL_COLOR_PREFERENCES,
  INITIAL_EVENTS,
  INITIAL_GUARDIANS,
  SWEDISH_MONTHS,
  getISOWeekNumber,
  parseDateISO,
  toDateISO,
} from './data/mockData';
import SideDrawer from './components/SideDrawer';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import ListView from './components/ListView';
import DayDetailModal from './components/DayDetailModal';
import EventDetailModal from './components/EventDetailModal';
import EventForm from './components/EventForm';
import ProfilesView from './components/ProfilesView';
import SearchView from './components/SearchView';
import {
  HelpView,
  LogoutScreen,
  NotificationsView,
  SettingsView,
} from './components/SecondaryViews';

function loadPersistedState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`Kunde inte läsa ${key} från localStorage:`, err);
  }
  return fallback;
}

export default function App() {
  /* --- Centralt applikationstillstånd med localStorage-persistens --- */
  const [activeUser, setActiveUser] = useState(() =>
    loadPersistedState('delad_vardnad_active_user', 'mamma')
  );
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [custodyPattern, setCustodyPattern] = useState(() =>
    loadPersistedState('delad_vardnad_custody_pattern', 'alternating-weeks')
  );

  const [guardians, setGuardians] = useState(() =>
    loadPersistedState('delad_vardnad_guardians', INITIAL_GUARDIANS)
  );
  const [childrenProfiles, setChildrenProfiles] = useState(() =>
    loadPersistedState('delad_vardnad_children', INITIAL_CHILDREN)
  );
  const [colorPreferences, setColorPreferences] = useState(() =>
    loadPersistedState('delad_vardnad_color_prefs', INITIAL_COLOR_PREFERENCES)
  );
  const [events, setEvents] = useState(() =>
    loadPersistedState('delad_vardnad_events', INITIAL_EVENTS)
  );

  /* --- Spara tillstånd till localStorage vid ändringar --- */
  useEffect(() => {
    try {
      localStorage.setItem('delad_vardnad_active_user', JSON.stringify(activeUser));
    } catch (err) {
      console.warn('Kunde inte spara activeUser:', err);
    }
  }, [activeUser]);

  useEffect(() => {
    try {
      localStorage.setItem('delad_vardnad_custody_pattern', JSON.stringify(custodyPattern));
    } catch (err) {
      console.warn('Kunde inte spara custodyPattern:', err);
    }
  }, [custodyPattern]);

  useEffect(() => {
    try {
      localStorage.setItem('delad_vardnad_guardians', JSON.stringify(guardians));
    } catch (err) {
      console.warn('Kunde inte spara guardians:', err);
    }
  }, [guardians]);

  useEffect(() => {
    try {
      localStorage.setItem('delad_vardnad_children', JSON.stringify(childrenProfiles));
    } catch (err) {
      console.warn('Kunde inte spara childrenProfiles:', err);
    }
  }, [childrenProfiles]);

  useEffect(() => {
    try {
      localStorage.setItem('delad_vardnad_color_prefs', JSON.stringify(colorPreferences));
    } catch (err) {
      console.warn('Kunde inte spara colorPreferences:', err);
    }
  }, [colorPreferences]);

  useEffect(() => {
    try {
      localStorage.setItem('delad_vardnad_events', JSON.stringify(events));
    } catch (err) {
      console.warn('Kunde inte spara events:', err);
    }
  }, [events]);

  const handleResetDemoData = () => {
    try {
      localStorage.removeItem('delad_vardnad_events');
      localStorage.removeItem('delad_vardnad_guardians');
      localStorage.removeItem('delad_vardnad_children');
      localStorage.removeItem('delad_vardnad_color_prefs');
      localStorage.removeItem('delad_vardnad_custody_pattern');
      localStorage.removeItem('delad_vardnad_active_user');
    } catch (err) {
      console.warn('Kunde inte rensa localStorage:', err);
    }
    setEvents(INITIAL_EVENTS);
    setGuardians(INITIAL_GUARDIANS);
    setChildrenProfiles(INITIAL_CHILDREN);
    setColorPreferences(INITIAL_COLOR_PREFERENCES);
    setCustodyPattern('alternating-weeks');
    setActiveUser('mamma');
  };

  /* --- Navigations- och vytillstånd --- */
  const [activePage, setActivePage] = useState('calendar'); // calendar | profiles | notifications | settings | help | search
  const [calendarView, setCalendarView] = useState('month'); // month | week | list
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 10 = November 2026
  const [weekAnchorISO, setWeekAnchorISO] = useState('2026-11-23'); // v.48
  const [selectedChildFilter, setSelectedChildFilter] = useState('both');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPeriodPickerOpen, setIsPeriodPickerOpen] = useState(false);
  const periodPickerRef = useRef(null);

  /* --- Modal- och formulärtillstånd --- */
  const [selectedDayISO, setSelectedDayISO] = useState(null);
  const [detailModalState, setDetailModalState] = useState({
    eventId: null,
    focusComment: false,
  });
  const [formState, setFormState] = useState({
    isOpen: false,
    initialDateISO: '2026-11-25',
    editingEvent: null,
  });

  useEffect(() => {
    if (!isPeriodPickerOpen) return undefined;
    const handleOutside = (event) => {
      if (periodPickerRef.current && !periodPickerRef.current.contains(event.target)) {
        setIsPeriodPickerOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsPeriodPickerOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isPeriodPickerOpen]);

  /* --- Färguppslag per aktiv vårdnadshavares konto --- */
  const getGuardianColorKey = (guardianId) => {
    const userPrefs = colorPreferences[activeUser] || {};
    if (userPrefs[guardianId]) return userPrefs[guardianId];
    return guardians.find((g) => g.id === guardianId)?.defaultColorKey || 'sage';
  };

  const getChildColorKey = (childId) => {
    const userPrefs = colorPreferences[activeUser] || {};
    if (userPrefs[childId]) return userPrefs[childId];
    if (childId === 'both') return 'sky';
    return childrenProfiles.find((c) => c.id === childId)?.defaultColorKey || 'pink';
  };

  /* --- Antal obehandlade aktiviteter för aktiv användare --- */
  const pendingCount = useMemo(
    () =>
      events.filter(
        (evt) => evt.status === 'pending' && evt.createdBy !== activeUser
      ).length,
    [events, activeUser]
  );

  const mammaProfile = guardians.find((g) => g.id === 'mamma');
  const pappaProfile = guardians.find((g) => g.id === 'pappa');
  const detailEvent = events.find((evt) => evt.id === detailModalState.eventId) || null;

  /* --- Periodnavigering (Månad eller Vecka) --- */
  const handlePrevPeriod = () => {
    if (calendarView === 'week') {
      const d = parseDateISO(weekAnchorISO);
      d.setDate(d.getDate() - 7);
      setWeekAnchorISO(toDateISO(d));
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
      return;
    }
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextPeriod = () => {
    if (calendarView === 'week') {
      const d = parseDateISO(weekAnchorISO);
      d.setDate(d.getDate() + 7);
      setWeekAnchorISO(toDateISO(d));
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
      return;
    }
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectMonthYear = (year, monthIdx) => {
    setCurrentYear(year);
    setCurrentMonth(monthIdx);
    const nextAnchor = `${year}-${String(monthIdx + 1).padStart(2, '0')}-01`;
    setWeekAnchorISO(nextAnchor);
    setIsPeriodPickerOpen(false);
  };

  /* --- Aktivitetshanterare --- */
  const handleUpdateEventStatus = (eventId, newStatus) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === eventId ? { ...evt, status: newStatus } : evt))
    );
  };

  const handleToggleChecklistItem = (eventId, itemId) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt;
        return {
          ...evt,
          checklist: evt.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
          ),
        };
      })
    );
  };

  const handleAddComment = (eventId, text) => {
    const now = new Date();
    const timestamp = `${toDateISO(now)} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt;
        return {
          ...evt,
          comments: [
            ...evt.comments,
            {
              id: `cmt-${Date.now()}`,
              authorId: activeUser,
              timestamp,
              text,
            },
          ],
        };
      })
    );
  };

  const handleSaveEvent = (savedEvent) => {
    setEvents((prev) => {
      const exists = prev.some((evt) => evt.id === savedEvent.id);
      if (exists) {
        return prev.map((evt) => (evt.id === savedEvent.id ? savedEvent : evt));
      }
      return [...prev, savedEvent];
    });
    setFormState({ isOpen: false, initialDateISO: savedEvent.date, editingEvent: null });
    setSelectedDayISO(savedEvent.date);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
    setFormState({ isOpen: false, initialDateISO: '2026-11-25', editingEvent: null });
    setDetailModalState((prev) =>
      prev.eventId === eventId ? { eventId: null, focusComment: false } : prev
    );
  };

  /* --- Profilhanterare (färg sparas endast på aktiv användares konto) --- */
  const handleUpdateGuardian = (guardianId, name, colorKey) => {
    setGuardians((prev) =>
      prev.map((g) =>
        g.id === guardianId
          ? { ...g, name, initial: name.charAt(0).toUpperCase() }
          : g
      )
    );
    setColorPreferences((prev) => ({
      ...prev,
      [activeUser]: {
        ...(prev[activeUser] || {}),
        [guardianId]: colorKey,
      },
    }));
  };

  const handleUpdateChild = (childId, name, colorKey) => {
    setChildrenProfiles((prev) =>
      prev.map((c) =>
        c.id === childId ? { ...c, name, initial: name.charAt(0).toUpperCase() } : c
      )
    );
    setColorPreferences((prev) => ({
      ...prev,
      [activeUser]: {
        ...(prev[activeUser] || {}),
        [childId]: colorKey,
      },
    }));
  };

  const handleDeleteChild = (childId) => {
    setChildrenProfiles((prev) => prev.filter((c) => c.id !== childId));
    if (selectedChildFilter === childId) {
      setSelectedChildFilter('both');
    }
  };

  const handleAddChild = (name, colorKey) => {
    const newId = `child-${Date.now()}`;
    setChildrenProfiles((prev) => [
      ...prev,
      {
        id: newId,
        name,
        initial: name.charAt(0).toUpperCase(),
        defaultColorKey: colorKey,
      },
    ]);
    setColorPreferences((prev) => ({
      ...prev,
      [activeUser]: {
        ...(prev[activeUser] || {}),
        [newId]: colorKey,
      },
    }));
  };

  const activeWeekNumber = getISOWeekNumber(parseDateISO(weekAnchorISO));
  const periodTitle =
    calendarView === 'week'
      ? `Vecka ${activeWeekNumber} · ${SWEDISH_MONTHS[currentMonth]} ${currentYear}`
      : `${SWEDISH_MONTHS[currentMonth]} ${currentYear}`;

  return (
    <div className="app-viewport">
      <div
        className="app-shell"
        data-mamma-color={getGuardianColorKey('mamma')}
        data-pappa-color={getGuardianColorKey('pappa')}
      >
        {/* --- Topplist (Header) --- */}
        <header className="top-bar">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Öppna meny"
          >
            <Menu size={22} aria-hidden="true" />
            {pendingCount > 0 ? (
              <span className="icon-btn-badge tabular-nums" aria-hidden="true">
                {pendingCount}
              </span>
            ) : null}
          </button>

          {isLoggedOut ? (
            <span className="setting-option-title">Delad Vårdnad</span>
          ) : null}

          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              setIsLoggedOut(false);
              setActivePage('search');
            }}
            aria-label="Sök aktiviteter"
          >
            <Search size={22} aria-hidden="true" />
          </button>
        </header>

        {/* --- Innehåll baserat på aktiv vy --- */}
        {isLoggedOut ? (
          <LogoutScreen
            guardians={guardians}
            onLoginAs={(guardianId) => {
              setActiveUser(guardianId);
              setIsLoggedOut(false);
              setActivePage('calendar');
            }}
          />
        ) : activePage === 'profiles' ? (
          <ProfilesView
            guardians={guardians}
            childrenProfiles={childrenProfiles}
            activeUser={activeUser}
            getGuardianColorKey={getGuardianColorKey}
            getChildColorKey={getChildColorKey}
            onUpdateGuardian={handleUpdateGuardian}
            onUpdateChild={handleUpdateChild}
            onDeleteChild={handleDeleteChild}
            onAddChild={handleAddChild}
            onBack={() => setActivePage('calendar')}
          />
        ) : activePage === 'search' ? (
          <SearchView
            events={events}
            getChildColorKey={getChildColorKey}
            onSelectEvent={(eventId) =>
              setDetailModalState({ eventId, focusComment: false })
            }
            onBack={() => setActivePage('calendar')}
          />
        ) : activePage === 'notifications' ? (
          <NotificationsView
            events={events}
            guardians={guardians}
            activeUser={activeUser}
            onOpenDay={(dateISO) => {
              setActivePage('calendar');
              setSelectedDayISO(dateISO);
            }}
            onOpenEventDetail={(eventId) =>
              setDetailModalState({ eventId, focusComment: false })
            }
            onBack={() => setActivePage('calendar')}
          />
        ) : activePage === 'settings' ? (
          <SettingsView
            custodyPattern={custodyPattern}
            onChangeCustodyPattern={setCustodyPattern}
            onResetDemoData={handleResetDemoData}
            onBack={() => setActivePage('calendar')}
          />
        ) : activePage === 'help' ? (
          <HelpView onBack={() => setActivePage('calendar')} />
        ) : (
          <main className="main-content">
            {/* --- Kalendernavigering med dropdown för månad och år --- */}
            <div className="calendar-header" ref={periodPickerRef}>
              <button
                type="button"
                className="calendar-nav-btn"
                onClick={handlePrevPeriod}
                aria-label={calendarView === 'week' ? 'Föregående vecka' : 'Föregående månad'}
              >
                <ChevronLeft size={22} aria-hidden="true" />
              </button>

              <div className="period-dropdown-anchor">
                <button
                  type="button"
                  className="period-dropdown-btn tabular-nums"
                  onClick={() => setIsPeriodPickerOpen((prev) => !prev)}
                  aria-expanded={isPeriodPickerOpen}
                  aria-haspopup="dialog"
                  aria-label={`Välj månad och år, nuvarande ${periodTitle}`}
                >
                  <span>{periodTitle}</span>
                  <ChevronDown size={18} aria-hidden="true" />
                </button>

                {isPeriodPickerOpen ? (
                  <div
                    className="period-picker-popover"
                    role="dialog"
                    aria-label="Välj månad och år"
                  >
                    <div className="period-year-row">
                      <button
                        type="button"
                        className="calendar-nav-btn"
                        onClick={() => setCurrentYear((y) => y - 1)}
                        aria-label="Föregående år"
                      >
                        <ChevronLeft size={18} aria-hidden="true" />
                      </button>
                      <span className="period-year-label tabular-nums">{currentYear}</span>
                      <button
                        type="button"
                        className="calendar-nav-btn"
                        onClick={() => setCurrentYear((y) => y + 1)}
                        aria-label="Nästa år"
                      >
                        <ChevronRight size={18} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="period-months-grid">
                      {SWEDISH_MONTHS.map((monthName, idx) => {
                        const isSelected = idx === currentMonth;
                        return (
                          <button
                            key={monthName}
                            type="button"
                            className={`period-month-btn ${isSelected ? 'is-active' : ''}`}
                            onClick={() => handleSelectMonthYear(currentYear, idx)}
                          >
                            {monthName.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                className="calendar-nav-btn"
                onClick={handleNextPeriod}
                aria-label={calendarView === 'week' ? 'Nästa vecka' : 'Nästa månad'}
              >
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            </div>

            {/* --- Integrerad färgkodad snabbväxel (Mamma/Pappa) & View Switcher --- */}
            <div className="view-controls-row">
              <div
                className="guardian-legend"
                role="group"
                aria-label="Färgförklaring och aktiv vårdnadshavarvy"
              >
                <button
                  type="button"
                  className={`guardian-toggle-btn is-mamma ${
                    activeUser === 'mamma' ? 'is-active' : ''
                  }`}
                  onClick={() => setActiveUser('mamma')}
                  aria-pressed={activeUser === 'mamma'}
                  aria-label={`Växla vy till ${mammaProfile ? mammaProfile.name : 'Mamma'}`}
                >
                  <span className="legend-dot is-mamma" aria-hidden="true" />
                  <span>{mammaProfile ? mammaProfile.name : 'Mamma'}</span>
                </button>

                <button
                  type="button"
                  className={`guardian-toggle-btn is-pappa ${
                    activeUser === 'pappa' ? 'is-active' : ''
                  }`}
                  onClick={() => setActiveUser('pappa')}
                  aria-pressed={activeUser === 'pappa'}
                  aria-label={`Växla vy till ${pappaProfile ? pappaProfile.name : 'Pappa'}`}
                >
                  <span className="legend-dot is-pappa" aria-hidden="true" />
                  <span>{pappaProfile ? pappaProfile.name : 'Pappa'}</span>
                </button>
              </div>

              <div className="view-switcher" role="tablist" aria-label="Byt kalendervy">
                <button
                  type="button"
                  role="tab"
                  aria-selected={calendarView === 'month'}
                  className={`view-tab-btn ${calendarView === 'month' ? 'is-active' : ''}`}
                  onClick={() => setCalendarView('month')}
                >
                  <Calendar size={17} aria-hidden="true" />
                  <span>Månad</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={calendarView === 'week'}
                  className={`view-tab-btn ${calendarView === 'week' ? 'is-active' : ''}`}
                  onClick={() => {
                    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(
                      2,
                      '0'
                    )}`;
                    if (!weekAnchorISO.startsWith(monthPrefix)) {
                      setWeekAnchorISO(`${monthPrefix}-01`);
                    }
                    setCalendarView('week');
                  }}
                >
                  <CalendarDays size={17} aria-hidden="true" />
                  <span>Vecka</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={calendarView === 'list'}
                  className={`view-tab-btn ${calendarView === 'list' ? 'is-active' : ''}`}
                  onClick={() => setCalendarView('list')}
                >
                  <List size={17} aria-hidden="true" />
                  <span>Lista</span>
                </button>
              </div>
            </div>

            {/* --- Aktiv kalendervy --- */}
            {calendarView === 'month' ? (
              <MonthView
                year={currentYear}
                monthIndex={currentMonth}
                custodyPattern={custodyPattern}
                events={events}
                childrenProfiles={childrenProfiles}
                guardians={guardians}
                selectedChildFilter={selectedChildFilter}
                getChildColorKey={getChildColorKey}
                onSelectDate={(dateISO) => setSelectedDayISO(dateISO)}
              />
            ) : calendarView === 'week' ? (
              <WeekView
                anchorDateISO={weekAnchorISO}
                custodyPattern={custodyPattern}
                events={events}
                childrenProfiles={childrenProfiles}
                guardians={guardians}
                selectedChildFilter={selectedChildFilter}
                getChildColorKey={getChildColorKey}
                onSelectDate={(dateISO) => setSelectedDayISO(dateISO)}
                onOpenEventDetail={(eventId) =>
                  setDetailModalState({ eventId, focusComment: false })
                }
              />
            ) : (
              <ListView
                year={currentYear}
                monthIndex={currentMonth}
                custodyPattern={custodyPattern}
                events={events}
                childrenProfiles={childrenProfiles}
                guardians={guardians}
                selectedChildFilter={selectedChildFilter}
                getChildColorKey={getChildColorKey}
                onSelectEvent={(eventId) =>
                  setDetailModalState({ eventId, focusComment: false })
                }
                onAddActivity={(dateISO) =>
                  setFormState({
                    isOpen: true,
                    initialDateISO: dateISO,
                    editingEvent: null,
                  })
                }
              />
            )}

            {/* --- Barnfilter under kalendern + Primär CTA --- */}
            <div className="bottom-controls">
              <div className="child-filter-bar" role="group" aria-label="Filtrera på barn">
                <button
                  type="button"
                  className={`child-chip ${selectedChildFilter === 'both' ? 'is-active' : ''}`}
                  onClick={() => setSelectedChildFilter('both')}
                  aria-pressed={selectedChildFilter === 'both'}
                >
                  <Users size={16} aria-hidden="true" />
                  <span>Båda</span>
                </button>
                {childrenProfiles.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    className={`child-chip ${
                      selectedChildFilter === child.id ? 'is-active' : ''
                    }`}
                    onClick={() => setSelectedChildFilter(child.id)}
                    aria-pressed={selectedChildFilter === child.id}
                  >
                    <span
                      className="child-dot"
                      data-color={getChildColorKey(child.id)}
                      aria-hidden="true"
                    />
                    <span>{child.name}</span>
                  </button>
                ))}
              </div>

              <div className="cta-row">
                <button
                  type="button"
                  className="primary-cta-btn"
                  onClick={() =>
                    setFormState({
                      isOpen: true,
                      initialDateISO:
                        selectedDayISO ||
                        `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-25`,
                      editingEvent: null,
                    })
                  }
                >
                  <Plus size={20} aria-hidden="true" />
                  <span>Lägg till aktivitet</span>
                </button>
              </div>
            </div>
          </main>
        )}

        {/* --- Sidomeny (Drawer) --- */}
        <SideDrawer
          isOpen={isDrawerOpen}
          activePage={activePage}
          pendingCount={pendingCount}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={(page) => {
            setIsLoggedOut(false);
            setActivePage(page);
          }}
          onLogout={() => {
            setIsLoggedOut(true);
            setSelectedDayISO(null);
            setDetailModalState({ eventId: null, focusComment: false });
          }}
        />

        {/* --- Dagsvy-modal --- */}
        <DayDetailModal
          dateISO={selectedDayISO}
          custodyPattern={custodyPattern}
          events={events}
          childrenProfiles={childrenProfiles}
          guardians={guardians}
          activeUser={activeUser}
          selectedChildFilter={selectedChildFilter}
          getChildColorKey={getChildColorKey}
          onClose={() => setSelectedDayISO(null)}
          onAddActivity={(dateISO) =>
            setFormState({
              isOpen: true,
              initialDateISO: dateISO,
              editingEvent: null,
            })
          }
          onOpenEventDetail={(eventId, focusComment) =>
            setDetailModalState({ eventId, focusComment })
          }
          onUpdateEventStatus={handleUpdateEventStatus}
        />

        {/* --- Detaljerad aktivitetsvy-modal --- */}
        <EventDetailModal
          eventItem={detailEvent}
          focusCommentOnOpen={detailModalState.focusComment}
          custodyPattern={custodyPattern}
          events={events}
          childrenProfiles={childrenProfiles}
          guardians={guardians}
          activeUser={activeUser}
          onClose={() => setDetailModalState({ eventId: null, focusComment: false })}
          onEdit={(evt) => {
            setDetailModalState({ eventId: null, focusComment: false });
            setFormState({
              isOpen: true,
              initialDateISO: evt.date,
              editingEvent: evt,
            });
          }}
          onToggleChecklistItem={handleToggleChecklistItem}
          onAddComment={handleAddComment}
          onUpdateEventStatus={handleUpdateEventStatus}
        />

        {/* --- Formulär för ny / redigerad aktivitet --- */}
        <EventForm
          isOpen={formState.isOpen}
          initialDateISO={formState.initialDateISO}
          editingEvent={formState.editingEvent}
          custodyPattern={custodyPattern}
          childrenProfiles={childrenProfiles}
          guardians={guardians}
          activeUser={activeUser}
          getChildColorKey={getChildColorKey}
          onClose={() =>
            setFormState({ isOpen: false, initialDateISO: '2026-11-25', editingEvent: null })
          }
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </div>
  );
}
