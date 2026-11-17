/* --- Dagsvy-modal (DayDetailModal) --- */
import React, { useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  Home,
  MapPin,
  Plus,
  RotateCcw,
  X,
  XCircle,
} from 'lucide-react';
import {
  formatSwedishDayTitle,
  getCustodyClassName,
  getDisplayCustodyForDate,
} from '../data/mockData';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function DayDetailModal({
  dateISO,
  custodyPattern,
  events,
  childrenProfiles,
  guardians,
  activeUser,
  selectedChildFilter,
  getChildColorKey,
  onClose,
  onAddActivity,
  onOpenEventDetail,
  onUpdateEventStatus,
}) {
  const focusTrapRef = useFocusTrap(Boolean(dateISO));
  useEffect(() => {
    if (!dateISO) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dateISO, onClose]);

  if (!dateISO) return null;

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
  const otherGuardian = guardians.find((g) => g.id !== activeUser);

  const dayEvents = events
    .filter((evt) => {
      if (evt.date !== dateISO) return false;
      if (selectedChildFilter === 'both') return true;
      return evt.childId === selectedChildFilter || evt.childId === 'both';
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const returnEvents = events.filter((evt) => {
    if (!evt.isHandover || evt.status !== 'approved') return false;
    if (!evt.returnDate || evt.returnDate === evt.date) return false;
    if (evt.returnDate !== dateISO) return false;
    if (selectedChildFilter === 'both') return true;
    return evt.childId === selectedChildFilter || evt.childId === 'both';
  });

  const hasAnyItems = dayEvents.length > 0 || returnEvents.length > 0;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={focusTrapRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${formatSwedishDayTitle(dateISO)}, ${displayCustody.label}`}
      >
        {/* --- Modalens färgkodade toplist --- */}
        <header className={`modal-top-bar ${custodyClass}`}>
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

          <div className="modal-top-content">
            <h2 className="modal-top-title">{formatSwedishDayTitle(dateISO)}</h2>
            <p className="modal-top-sub">{displayCustody.label}</p>
          </div>
          <div className="modal-top-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              aria-label="Stäng dagsvy"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
        </header>

        {displayCustody.hasPendingOverride ? (
          <div className="pending-override-banner">
            Föreslaget byte av dag — kalenderfärgen uppdateras när den andra vårdnadshavaren godkänner.
          </div>
        ) : null}

        {/* --- Dagens aktiviteter eller tomt tillstånd --- */}
        <div className="modal-body">
          {!hasAnyItems ? (
            <div className="empty-day-state">
              <p className="empty-day-text">Inga sparade aktiviteter på valt datum</p>
              <button
                type="button"
                className="secondary-pill-btn"
                onClick={() => onAddActivity(dateISO)}
              >
                <Plus size={18} aria-hidden="true" />
                <span>Lägg till aktivitet</span>
              </button>
            </div>
          ) : (
            <>
              {returnEvents.map((evt) => {
                const returnGuardian = guardians.find(
                  (g) => g.id === (evt.returnToParent || evt.fromParent)
                );
                return (
                  <button
                    key={`${evt.id}-return`}
                    type="button"
                    className="activity-card is-handover-card"
                    data-color={getChildColorKey(evt.childId)}
                    onClick={() => onOpenEventDetail(evt.id, false)}
                    aria-label={`Öppna återlämning för ${evt.title}`}
                  >
                    <div className="handover-badge-row">
                      <span className="handover-home-badge" aria-hidden="true">
                        <RotateCcw size={16} />
                      </span>
                      <span className="activity-card-title">
                        Återgår till {returnGuardian ? returnGuardian.name : 'vårdnadshavare'}
                      </span>
                    </div>
                    <span className="profile-note">Avvikande byte: {evt.title}</span>
                  </button>
                );
              })}

              {dayEvents.map((evt) => {
                const isPending = evt.status === 'pending';
                const isDeclined = evt.status === 'declined';
                const isHandover = evt.isHandover;
                const handoverParent = guardians.find((g) => g.id === evt.handoverParent);
                const returnParent = guardians.find(
                  (g) => g.id === (evt.returnToParent || evt.fromParent)
                );
                const allChecklistDone =
                  evt.checklist.length > 0 && evt.checklist.every((item) => item.done);
                const canRespond = isPending && evt.createdBy !== activeUser;

                return (
                  <div key={evt.id}>
                    <div
                      className={`activity-card ${isHandover ? 'is-handover-card' : ''} ${
                        isPending ? 'is-pending' : ''
                      } ${isDeclined ? 'is-declined' : ''}`}
                      data-color={getChildColorKey(evt.childId)}
                    >
                      <button
                        type="button"
                        className="activity-card-clickable"
                        onClick={() => onOpenEventDetail(evt.id, false)}
                        aria-label={`Öppna detaljer för ${evt.title}`}
                      >
                        <div className="activity-card-grid">
                          <div className="activity-card-left">
                            {isHandover ? (
                              <>
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
                                {evt.returnDate ? (
                                  <span className="profile-note">
                                    Återgår till {returnParent ? returnParent.name : 'ordinarie'}:{' '}
                                    {evt.returnDate === evt.date
                                      ? 'Samma dag'
                                      : formatSwedishDayTitle(evt.returnDate)}
                                  </span>
                                ) : null}
                              </>
                            ) : (
                              <>
                                <h3 className="activity-card-title">{evt.title}</h3>
                                {evt.status === 'approved' && evt.isRegistered ? (
                                  <span className="status-inline is-approved">
                                    <CheckCircle2 size={17} aria-hidden="true" />
                                    <span>Anmäld</span>
                                  </span>
                                ) : null}
                                {isDeclined ? (
                                  <span className="status-inline is-declined">
                                    <XCircle size={17} aria-hidden="true" />
                                    <span>Avböjd</span>
                                  </span>
                                ) : null}
                              </>
                            )}
                          </div>

                          <div className="activity-card-right">
                            <span className="activity-meta-line tabular-nums">
                              <Clock size={17} aria-hidden="true" />
                              <span>{evt.isAllDay ? 'Heldag' : evt.time}</span>
                            </span>
                            {evt.location ? (
                              <span className="activity-meta-line">
                                <MapPin size={17} aria-hidden="true" />
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
                                  <CheckCircle2 size={17} aria-hidden="true" />
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

                      {isPending && !canRespond ? (
                        <p className="pending-wait-note">
                          Väntar på svar från {otherGuardian ? otherGuardian.name : 'andra vårdnadshavaren'}
                        </p>
                      ) : null}
                    </div>

                    {/* --- Godkänn / Avböj / Kommentera för obehandlad aktivitet --- */}
                    {canRespond ? (
                      <div className="pending-actions-bar">
                        <button
                          type="button"
                          className="pending-action-btn is-approve"
                          onClick={() => onUpdateEventStatus(evt.id, 'approved')}
                        >
                          <CheckCircle2 size={24} aria-hidden="true" />
                          <span>Godkänn</span>
                        </button>
                        <button
                          type="button"
                          className="pending-action-btn is-decline"
                          onClick={() => onUpdateEventStatus(evt.id, 'declined')}
                        >
                          <XCircle size={24} aria-hidden="true" />
                          <span>Avböj</span>
                        </button>
                        <button
                          type="button"
                          className="pending-action-btn is-comment"
                          onClick={() => onOpenEventDetail(evt.id, true)}
                        >
                          <HelpCircle size={24} aria-hidden="true" />
                          <span>Kommentera</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <div className="empty-day-state">
                <button
                  type="button"
                  className="secondary-pill-btn"
                  onClick={() => onAddActivity(dateISO)}
                >
                  <Plus size={18} aria-hidden="true" />
                  <span>Lägg till aktivitet</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
