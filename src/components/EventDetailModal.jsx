/* --- Detaljerad aktivitetsvy (EventDetailModal) --- */
import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Pencil,
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

export default function EventDetailModal({
  eventItem,
  focusCommentOnOpen,
  custodyPattern,
  events,
  childrenProfiles,
  guardians,
  activeUser,
  onClose,
  onEdit,
  onToggleChecklistItem,
  onAddComment,
  onUpdateEventStatus,
}) {
  const [commentDraft, setCommentDraft] = useState('');
  const [commentError, setCommentError] = useState('');
  const commentInputRef = useRef(null);
  const focusTrapRef = useFocusTrap(Boolean(eventItem));

  useEffect(() => {
    if (!eventItem) return undefined;
    setCommentError('');
    if (focusCommentOnOpen && commentInputRef.current) {
      commentInputRef.current.focus();
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [eventItem, focusCommentOnOpen, onClose]);

  if (!eventItem) return null;

  const displayCustody = getDisplayCustodyForDate(
    eventItem.date,
    eventItem.childId || 'both',
    childrenProfiles,
    guardians,
    custodyPattern,
    events
  );
  const isSplitChildren = displayCustody.mode === 'split-children';
  const custodyClass = isSplitChildren
    ? 'has-split-children'
    : getCustodyClassName(displayCustody.custody);

  const returnGuardian = guardians.find(
    (g) => g.id === (eventItem.returnToParent || eventItem.fromParent)
  );
  const handoverGuardian = guardians.find((g) => g.id === eventItem.handoverParent);

  const totalChecklist = eventItem.checklist.length;
  const completedChecklist = eventItem.checklist.filter((item) => item.done).length;
  const allChecklistDone = totalChecklist > 0 && completedChecklist === totalChecklist;
  const canRespond = eventItem.status === 'pending' && eventItem.createdBy !== activeUser;

  const handleSubmitComment = (event) => {
    event.preventDefault();
    const trimmed = commentDraft.trim();
    if (!trimmed) {
      setCommentError('Skriv en kommentar innan du skickar.');
      return;
    }
    setCommentError('');
    onAddComment(eventItem.id, trimmed);
    setCommentDraft('');
  };

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
        aria-label={`Aktivitetsdetaljer: ${eventItem.title}`}
      >
        {/* --- Modalens toplist med redigerings- och stängknapp --- */}
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
            <h2 className="modal-top-title">{formatSwedishDayTitle(eventItem.date)}</h2>
            <p className="modal-top-sub">{displayCustody.label}</p>
          </div>
          <div className="modal-top-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={() => onEdit(eventItem)}
              aria-label="Redigera aktivitet"
            >
              <Pencil size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              aria-label="Stäng aktivitetsvy"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="modal-body">
          {/* --- Titel, tid, plats & status --- */}
          <div className="detail-meta-stack">
            <h3 className="detail-title">{eventItem.title}</h3>

            <span className="activity-meta-line tabular-nums">
              <Clock size={18} aria-hidden="true" />
              <span>{eventItem.isAllDay ? 'Heldag' : eventItem.time}</span>
            </span>

            {eventItem.location ? (
              <span className="activity-meta-line">
                <MapPin size={18} aria-hidden="true" />
                <span>{eventItem.location}</span>
              </span>
            ) : null}

            {eventItem.isHandover && eventItem.returnDate ? (
              <span className="activity-meta-line">
                <RotateCcw size={18} aria-hidden="true" />
                <span>
                  {handoverGuardian ? handoverGuardian.name : 'Vårdnadshavare'} hämtar · Återgår till{' '}
                  {returnGuardian ? returnGuardian.name : 'ordinarie'}:{' '}
                  {eventItem.returnDate === eventItem.date
                    ? 'Samma dag'
                    : formatSwedishDayTitle(eventItem.returnDate)}
                </span>
              </span>
            ) : null}

            {eventItem.status === 'approved' && eventItem.isRegistered ? (
              <span className="status-inline is-approved">
                <CheckCircle2 size={17} aria-hidden="true" />
                <span>Anmäld</span>
              </span>
            ) : null}

            {eventItem.status === 'declined' ? (
              <span className="status-inline is-declined">
                <XCircle size={17} aria-hidden="true" />
                <span>Avböjd — tryck på pennan för att redigera</span>
              </span>
            ) : null}

            {eventItem.description ? (
              <p className="detail-description">{eventItem.description}</p>
            ) : null}
          </div>

          {canRespond ? (
            <div className="pending-actions-bar">
              <button
                type="button"
                className="pending-action-btn is-approve"
                onClick={() => onUpdateEventStatus(eventItem.id, 'approved')}
              >
                <CheckCircle2 size={22} aria-hidden="true" />
                <span>Godkänn</span>
              </button>
              <button
                type="button"
                className="pending-action-btn is-decline"
                onClick={() => onUpdateEventStatus(eventItem.id, 'declined')}
              >
                <XCircle size={22} aria-hidden="true" />
                <span>Avböj</span>
              </button>
            </div>
          ) : null}

          {/* --- Interaktiv checklista --- */}
          {totalChecklist > 0 ? (
            <section aria-label="Checklista">
              <h4 className="detail-section-label">Checklista</h4>
              <div className="checklist-box">
                {eventItem.checklist.map((item) => (
                  <label key={item.id} className="checklist-row">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => onToggleChecklistItem(eventItem.id, item.id)}
                    />
                    <span className={item.done ? 'is-struck' : ''}>{item.text}</span>
                  </label>
                ))}
                <div className="checklist-progress tabular-nums">
                  {allChecklistDone ? (
                    <span className="status-inline is-approved">
                      <CheckCircle2 size={18} aria-hidden="true" />
                      <span>Klar</span>
                    </span>
                  ) : (
                    <>
                      <span className="progress-ring-icon" aria-hidden="true" />
                      <span>
                        {completedChecklist}/{totalChecklist}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </section>
          ) : null}

          {/* --- Kommentarer --- */}
          <section aria-label="Kommentarer">
            <h4 className="detail-section-label">Kommentarer</h4>

            {eventItem.comments.length > 0 ? (
              <div className="comments-list">
                {eventItem.comments.map((comment) => {
                  const author = guardians.find((g) => g.id === comment.authorId);
                  return (
                    <div key={comment.id} className="comment-card">
                      <div className="comment-card-top">
                        <span className="comment-author">
                          <span
                            className={`guardian-avatar ${
                              comment.authorId === 'mamma' ? 'is-mamma' : 'is-pappa'
                            }`}
                          >
                            {author ? author.initial : 'V'}
                          </span>
                          <span>{author ? author.name : 'Vårdnadshavare'}</span>
                        </span>
                        <span className="comment-time tabular-nums">{comment.timestamp}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="profile-note">Inga kommentarer ännu.</p>
            )}

            {commentError ? (
              <p className="form-error" role="alert" style={{ marginBottom: '8px' }}>
                {commentError}
              </p>
            ) : null}

            <form className="comment-composer" onSubmit={handleSubmitComment}>
              <label htmlFor="comment-input" className="sr-only">
                Skriv en kommentar
              </label>
              <input
                ref={commentInputRef}
                id="comment-input"
                type="text"
                className="text-input"
                placeholder="Kommentera..."
                value={commentDraft}
                onChange={(event) => {
                  setCommentDraft(event.target.value);
                  if (commentError) setCommentError('');
                }}
              />
              <button type="submit" className="btn-primary-pill">
                Skicka
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
