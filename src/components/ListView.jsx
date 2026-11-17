/* --- Listvy (Kronologisk översikt av aktiviteter) --- */
import React from 'react';
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  Home,
  MapPin,
  Plus,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import {
  formatSwedishDayTitle,
  getCustodyClassName,
  getDisplayCustodyForDate,
} from '../data/mockData';

export default function ListView({
  year,
  monthIndex,
  custodyPattern,
  events,
  childrenProfiles,
  guardians,
  selectedChildFilter,
  getChildColorKey,
  onSelectEvent,
  onAddActivity,
}) {
  const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

  const filteredEvents = events
    .filter((evt) => {
      const matchesChild =
        selectedChildFilter === 'both' ||
        evt.childId === selectedChildFilter ||
        evt.childId === 'both';
      if (!matchesChild) return false;
      const startsInMonth = evt.date.startsWith(monthPrefix);
      const returnsInMonth =
        evt.isHandover &&
        evt.status === 'approved' &&
        evt.returnDate &&
        evt.returnDate !== evt.date &&
        evt.returnDate.startsWith(monthPrefix);
      return startsInMonth || returnsInMonth;
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  // Gruppera både startaktiviteter och eventuella återlämningsdagar per datum
  const groupedByDate = {};
  filteredEvents.forEach((evt) => {
    if (evt.date.startsWith(monthPrefix)) {
      if (!groupedByDate[evt.date]) groupedByDate[evt.date] = [];
      groupedByDate[evt.date].push({ kind: 'event', evt });
    }
    if (
      evt.isHandover &&
      evt.status === 'approved' &&
      evt.returnDate &&
      evt.returnDate !== evt.date &&
      evt.returnDate.startsWith(monthPrefix)
    ) {
      if (!groupedByDate[evt.returnDate]) groupedByDate[evt.returnDate] = [];
      groupedByDate[evt.returnDate].push({ kind: 'return', evt });
    }
  });

  const dates = Object.keys(groupedByDate).sort();

  if (dates.length === 0) {
    return (
      <section className="simple-card empty-list-card" aria-label="Listvy">
        <p className="empty-day-text">Inga sparade aktiviteter för vald månad och filter.</p>
        {onAddActivity ? (
          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              className="secondary-pill-btn"
              onClick={() =>
                onAddActivity(`${year}-${String(monthIndex + 1).padStart(2, '0')}-01`)
              }
            >
              <Plus size={18} aria-hidden="true" />
              <span>Lägg till aktivitet</span>
            </button>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="list-view-container" aria-label="Aktivitetslista">
      {dates.map((dateISO) => {
        const displayCustody = getDisplayCustodyForDate(
          dateISO,
          selectedChildFilter,
          childrenProfiles,
          guardians,
          custodyPattern,
          events
        );
        const isSplitChildren = displayCustody.mode === 'split-children';
        const custodyClass = isSplitChildren
          ? 'has-split-children'
          : getCustodyClassName(displayCustody.custody);

        return (
          <div key={dateISO} className="list-day-group">
            <div className={`list-day-header ${custodyClass}`}>
              {isSplitChildren ? (
                <div className="split-header-bg" aria-hidden="true">
                  {displayCustody.childCustodies.map(({ child, custody }) => (
                    <div
                      key={child.id}
                      className={`split-header-band ${getCustodyClassName(custody)}`}
                    />
                  ))}
                </div>
              ) : null}
              <div className="list-day-header-content">
                <h3 className="list-day-heading">{formatSwedishDayTitle(dateISO)}</h3>
                <span className="list-day-sub">{displayCustody.label}</span>
              </div>
            </div>

            {displayCustody.hasPendingOverride ? (
              <div className="pending-override-banner">
                Föreslaget byte av dag inväntar godkännande
              </div>
            ) : null}

            <div className="list-day-cards">
              {groupedByDate[dateISO].map((entry) => {
                const { evt, kind } = entry;
                if (kind === 'return') {
                  const returnGuardian = guardians.find(
                    (g) => g.id === (evt.returnToParent || evt.fromParent)
                  );
                  return (
                    <button
                      key={`${evt.id}-return`}
                      type="button"
                      className="activity-card is-handover-card"
                      data-color={getChildColorKey(evt.childId)}
                      onClick={() => onSelectEvent(evt.id)}
                      aria-label={`Öppna återlämning för ${evt.title}`}
                    >
                      <div className="activity-card-grid">
                        <div className="activity-card-left">
                          <div className="handover-badge-row">
                            <span className="handover-home-badge" aria-hidden="true">
                              <RotateCcw size={16} />
                            </span>
                            <span className="activity-card-title">
                              Återgår till {returnGuardian ? returnGuardian.name : 'vårdnadshavare'}
                            </span>
                          </div>
                          <span className="profile-note">Kopplad till: {evt.title}</span>
                        </div>
                      </div>
                    </button>
                  );
                }

                const isHandover = evt.isHandover;
                const handoverParent = guardians.find((g) => g.id === evt.handoverParent);
                const allChecklistDone =
                  evt.checklist.length > 0 && evt.checklist.every((item) => item.done);

                return (
                  <button
                    key={evt.id}
                    type="button"
                    className={`activity-card ${isHandover ? 'is-handover-card' : ''} ${
                      evt.status === 'pending' ? 'is-pending' : ''
                    } ${evt.status === 'declined' ? 'is-declined' : ''}`}
                    data-color={getChildColorKey(evt.childId)}
                    onClick={() => onSelectEvent(evt.id)}
                    aria-label={`Öppna aktivitet ${evt.title}`}
                  >
                    <div className="activity-card-grid">
                      <div className="activity-card-left">
                        {isHandover ? (
                          <div className="handover-badge-row">
                            <span className="handover-home-badge" aria-hidden="true">
                              <Home size={16} />
                            </span>
                            <span
                              className={`guardian-avatar ${
                                evt.handoverParent === 'mamma' ? 'is-mamma' : 'is-pappa'
                              }`}
                            >
                              {handoverParent ? handoverParent.initial : 'M'}
                            </span>
                            <span className="activity-card-title">Hämtar</span>
                          </div>
                        ) : (
                          <>
                            <h4 className="activity-card-title">{evt.title}</h4>
                            {evt.status === 'approved' && evt.isRegistered ? (
                              <span className="status-inline is-approved">
                                <CheckCircle2 size={16} aria-hidden="true" />
                                <span>Anmäld</span>
                              </span>
                            ) : null}
                            {evt.status === 'declined' ? (
                              <span className="status-inline is-declined">
                                <XCircle size={16} aria-hidden="true" />
                                <span>Avböjd</span>
                              </span>
                            ) : null}
                          </>
                        )}
                      </div>

                      <div className="activity-card-right">
                        <span className="activity-meta-line tabular-nums">
                          <Clock size={16} aria-hidden="true" />
                          <span>{evt.isAllDay ? 'Heldag' : evt.time}</span>
                        </span>
                        {evt.location ? (
                          <span className="activity-meta-line">
                            <MapPin size={16} aria-hidden="true" />
                            <span>{evt.location}</span>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {isHandover && evt.checklist.length > 0 ? (
                      <>
                        <div className="inline-checklist-box">
                          <div className="inline-checklist-items">
                            {evt.checklist.map((item) => (
                              <span key={item.id} className={item.done ? 'is-struck' : ''}>
                                {item.text}
                              </span>
                            ))}
                          </div>
                          {allChecklistDone ? (
                            <span className="status-inline is-approved">
                              <CheckCircle2 size={16} aria-hidden="true" />
                              <span>Klar</span>
                            </span>
                          ) : null}
                        </div>
                        {evt.comments.length > 0 ? (
                          <div className="checklist-summary-footer" aria-label="Har kommentar">
                            <HelpCircle size={18} aria-hidden="true" />
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
