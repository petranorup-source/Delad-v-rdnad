/* --- Formulär för ny eller redigerad aktivitet (EventForm) --- */
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Trash2, Users, X } from 'lucide-react';
import {
  EVENT_CATEGORIES,
  formatSwedishDayTitle,
  getCustodyClassName,
  getCustodyForDate,
  isScheduleBreakingHandover,
  toDateISO,
} from '../data/mockData';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function EventForm({
  isOpen,
  initialDateISO,
  editingEvent,
  custodyPattern,
  childrenProfiles,
  guardians,
  activeUser,
  getChildColorKey,
  onClose,
  onSave,
  onDelete,
}) {
  const [title, setTitle] = useState('');
  const [childId, setChildId] = useState('both');
  const [isHandover, setIsHandover] = useState(false);
  const [handoverParent, setHandoverParent] = useState(activeUser);
  const [returnDate, setReturnDate] = useState('');
  const [category, setCategory] = useState('');
  const [useReceipt, setUseReceipt] = useState(false);
  const [receiptRegistered, setReceiptRegistered] = useState(false);
  const [receiptApproval, setReceiptApproval] = useState(false);
  const [date, setDate] = useState(initialDateISO || toDateISO(new Date()));
  const [isAllDay, setIsAllDay] = useState(false);
  const [time, setTime] = useState('12:15-15:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const returnDateInputRef = useRef(null);
  const focusTrapRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    if (editingEvent) {
      setTitle(editingEvent.title || '');
      setChildId(editingEvent.childId || 'both');
      setIsHandover(Boolean(editingEvent.isHandover));
      setHandoverParent(editingEvent.handoverParent || activeUser);
      setReturnDate(editingEvent.returnDate || editingEvent.date || '');
      setCategory(editingEvent.category || '');
      const hasReg = Boolean(editingEvent.isRegistered);
      const hasAppr =
        editingEvent.status === 'pending' || Boolean(editingEvent.requiresApproval);
      setUseReceipt(hasReg || hasAppr);
      setReceiptRegistered(hasReg);
      setReceiptApproval(hasAppr);
      setDate(editingEvent.date || initialDateISO || toDateISO(new Date()));
      setIsAllDay(Boolean(editingEvent.isAllDay));
      setTime(editingEvent.time || '12:15-15:00');
      setLocation(editingEvent.location || '');
      setDescription(editingEvent.description || '');
      setChecklist(editingEvent.checklist || []);
    } else {
      const targetDate = initialDateISO || toDateISO(new Date());
      setTitle('');
      setChildId('both');
      setIsHandover(false);
      setHandoverParent(activeUser);
      setReturnDate(targetDate);
      setCategory('');
      setUseReceipt(false);
      setReceiptRegistered(false);
      setReceiptApproval(false);
      setDate(targetDate);
      setIsAllDay(false);
      setTime('12:15-15:00');
      setLocation('');
      setDescription('');
      setChecklist([]);
    }
    setNewChecklistItem('');
    setErrorMessage('');
    setShowDeleteConfirm(false);
  }, [isOpen, editingEvent, initialDateISO, activeUser]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const baseCustody = getCustodyForDate(date, custodyPattern);
  const custodyClass = getCustodyClassName(baseCustody);
  const breaksSchedule =
    isHandover && isScheduleBreakingHandover(date, handoverParent, custodyPattern);

  const fromParentId =
    baseCustody.type === 'single'
      ? baseCustody.owner === handoverParent
        ? handoverParent === 'mamma'
          ? 'pappa'
          : 'mamma'
        : baseCustody.owner
      : handoverParent === 'mamma'
        ? 'pappa'
        : 'mamma';

  const fromGuardianName =
    guardians.find((g) => g.id === fromParentId)?.name || 'den andre föräldern';
  const handoverGuardianName =
    guardians.find((g) => g.id === handoverParent)?.name || 'Vårdnadshavare';
  const selectedChildObj = childrenProfiles.find((c) => c.id === childId);
  const childTargetLabel =
    childId === 'both' ? 'barnen' : selectedChildObj ? selectedChildObj.name : 'barnet';

  const handleToggleHandover = (checked) => {
    setIsHandover(checked);
    if (checked) {
      if (baseCustody.type === 'single') {
        setHandoverParent(baseCustody.owner === 'mamma' ? 'pappa' : 'mamma');
      } else {
        setHandoverParent(baseCustody.to);
      }
      if (!returnDate || returnDate < date) {
        setReturnDate(date);
      }
    }
  };

  const handleAddChecklist = () => {
    const trimmed = newChecklistItem.trim();
    if (!trimmed) return;
    setChecklist((prev) => [
      ...prev,
      { id: `chk-${Date.now()}-${prev.length}`, text: trimmed, done: false },
    ]);
    setNewChecklistItem('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Fyll i en titel för aktiviteten.');
      return;
    }
    if (!date) {
      setErrorMessage('Välj ett datum.');
      return;
    }
    if (breaksSchedule) {
      if (!returnDate) {
        setErrorMessage('Ange när barnet/barnen återgår till ordinarie vårdnadshavare.');
        return;
      }
      if (returnDate < date) {
        setErrorMessage('Återlämningsdatum kan inte vara tidigare än startdatumet.');
        return;
      }
    }

    const requiresApproval = useReceipt && receiptApproval;
    const isRegistered = useReceipt && receiptRegistered;

    onSave({
      id: editingEvent ? editingEvent.id : `evt-${Date.now()}`,
      title: title.trim(),
      date,
      time: isAllDay ? 'Heldag' : time.trim() || '12:00',
      isAllDay,
      childId,
      isHandover,
      handoverParent: isHandover ? handoverParent : null,
      fromParent: breaksSchedule ? fromParentId : null,
      returnToParent: breaksSchedule ? fromParentId : null,
      returnDate: breaksSchedule ? returnDate : null,
      category,
      location: location.trim(),
      description: description.trim(),
      isRegistered,
      requiresApproval,
      status: requiresApproval ? 'pending' : 'approved',
      createdBy: activeUser,
      checklist,
      comments: editingEvent ? editingEvent.comments : [],
    });
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
        aria-label={editingEvent ? 'Redigera aktivitet' : 'Ny aktivitet'}
      >
        {/* --- Modalens toplist färgad efter vårdnadshavare på valt datum --- */}
        <header className={`modal-top-bar ${custodyClass}`}>
          <div>
            <h2 className="modal-top-title">
              {editingEvent ? 'Redigera aktivitet' : 'Ny aktivitet'}
            </h2>
            <p className="modal-top-sub">
              *Sparade aktiviteter är synliga för alla i kalendern
            </p>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Stäng formulär"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        <form className="modal-body form-stack" onSubmit={handleSubmit} noValidate>
          {/* --- Titel --- */}
          <div className="form-field">
            <label htmlFor="event-title" className="form-label">
              Titel
            </label>
            <input
              id="event-title"
              type="text"
              className="text-input"
              placeholder="Lägg till titel"
              value={title}
              aria-invalid={Boolean(errorMessage && !title.trim())}
              aria-describedby={errorMessage ? 'event-form-error' : undefined}
              onChange={(event) => {
                setTitle(event.target.value);
                if (errorMessage) setErrorMessage('');
              }}
            />
          </div>

          {/* --- Gäller för --- */}
          <fieldset className="form-field form-fieldset">
            <legend className="form-label">Gäller för:</legend>
            <div className="child-filter-bar">
              <button
                type="button"
                className={`child-chip ${childId === 'both' ? 'is-active' : ''}`}
                onClick={() => setChildId('both')}
              >
                <Users size={16} aria-hidden="true" />
                <span>Båda</span>
              </button>
              {childrenProfiles.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  className={`child-chip ${childId === child.id ? 'is-active' : ''}`}
                  onClick={() => setChildId(child.id)}
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
          </fieldset>

          {/* --- Bytesdag / Överlämning + Avvikande schema --- */}
          <div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={isHandover}
                onChange={(event) => handleToggleHandover(event.target.checked)}
              />
              <span>Bytesdag/Överlämning</span>
            </label>

            {isHandover ? (
              <div className="handover-config-stack">
                <div className="child-filter-bar handover-parent-row">
                  {guardians.map((guardian) => (
                    <button
                      key={guardian.id}
                      type="button"
                      className={`child-chip ${
                        handoverParent === guardian.id ? 'is-active' : ''
                      }`}
                      onClick={() => setHandoverParent(guardian.id)}
                    >
                      <span
                        className={`guardian-avatar ${
                          guardian.id === 'mamma' ? 'is-mamma' : 'is-pappa'
                        }`}
                        aria-hidden="true"
                      >
                        {guardian.initial}
                      </span>
                      <span>{guardian.name} hämtar</span>
                    </button>
                  ))}
                </div>

                {breaksSchedule ? (
                  <div className="handover-return-box">
                    <p className="handover-return-title">
                      Valt datum bryter ordinarie umgängesschema ({childTargetLabel} är hos{' '}
                      {fromGuardianName}).
                    </p>
                    <label htmlFor="event-return-date" className="form-label">
                      När är {childTargetLabel} åter hos {fromGuardianName}?
                    </label>

                    <div className="return-mode-row">
                      <button
                        type="button"
                        className={`category-chip ${returnDate === date ? 'is-active' : ''}`}
                        onClick={() => {
                          setReturnDate(date);
                          if (errorMessage) setErrorMessage('');
                        }}
                      >
                        Samma dag
                      </button>
                      <button
                        type="button"
                        className={`category-chip ${
                          returnDate && returnDate !== date ? 'is-active' : ''
                        }`}
                        onClick={() => {
                          if (!returnDate || returnDate === date) {
                            const nextDay = new Date(
                              `${date}T12:00:00`
                            );
                            nextDay.setDate(nextDay.getDate() + 1);
                            setReturnDate(toDateISO(nextDay));
                          }
                          if (returnDateInputRef.current) {
                            returnDateInputRef.current.focus();
                          }
                        }}
                      >
                        Annat datum
                      </button>
                    </div>

                    <div className="input-with-icon">
                      <Calendar size={18} className="input-icon-left" aria-hidden="true" />
                      <input
                        ref={returnDateInputRef}
                        id="event-return-date"
                        type="date"
                        min={date}
                        className="text-input has-left-icon tabular-nums"
                        value={returnDate}
                        onChange={(event) => {
                          setReturnDate(event.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                      />
                    </div>

                    {returnDate && returnDate >= date ? (
                      <p className="handover-return-summary">
                        {returnDate === date
                          ? `${formatSwedishDayTitle(date)} blir diagonalt delad mellan ${fromGuardianName} och ${handoverGuardianName} (samma dag).`
                          : `${formatSwedishDayTitle(date)} och ${formatSwedishDayTitle(
                              returnDate
                            )} blir diagonalt delade, och dagarna emellan får ${handoverGuardianName}s färg.`}
                        {useReceipt && receiptApproval
                          ? ` Visas som tillfällig markering tills ${fromGuardianName} godkänt.`
                          : ''}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* --- Kategori (valfritt) --- */}
          <fieldset className="form-field form-fieldset">
            <legend className="form-label">Kategori (valfritt)</legend>
            <div className="category-chips">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-chip ${category === cat ? 'is-active' : ''}`}
                  onClick={() => setCategory((prev) => (prev === cat ? '' : cat))}
                >
                  {cat}
                </button>
              ))}
            </div>
          </fieldset>

          {/* --- Kvittering (Anmäld / Godkänd) --- */}
          <div className="form-field">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={useReceipt}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setUseReceipt(checked);
                  if (!checked) {
                    setReceiptRegistered(false);
                    setReceiptApproval(false);
                  }
                }}
              />
              <span>Kvittering (valfritt)</span>
            </label>

            {useReceipt ? (
              <div className="receipt-options-box" role="group" aria-label="Val för kvittering">
                <label className="checkbox-row receipt-option-row">
                  <input
                    type="checkbox"
                    checked={receiptRegistered}
                    onChange={(event) => setReceiptRegistered(event.target.checked)}
                  />
                  <span>
                    <strong>Anmäld</strong>
                    <span className="receipt-hint"> (ex. till fotbollen)</span>
                  </span>
                </label>

                <label className="checkbox-row receipt-option-row">
                  <input
                    type="checkbox"
                    checked={receiptApproval}
                    onChange={(event) => setReceiptApproval(event.target.checked)}
                  />
                  <span>
                    <strong>Godkänd</strong>
                    <span className="receipt-hint">
                      {' '}
                      (ex. vid tillägg på andra förälderns dag eller byte av dag)
                    </span>
                  </span>
                </label>
              </div>
            ) : null}
          </div>

          {/* --- Datum & Tid --- */}
          <div className="date-time-grid">
            <div className="form-field">
              <label htmlFor="event-date" className="form-label">
                Datum
              </label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon-left" aria-hidden="true" />
                <input
                  id="event-date"
                  type="date"
                  className="text-input has-left-icon tabular-nums"
                  value={date}
                  aria-invalid={Boolean(errorMessage && !date)}
                  aria-describedby={errorMessage ? 'event-form-error' : undefined}
                  onChange={(event) => {
                    const nextDate = event.target.value;
                    setDate(nextDate);
                    if (errorMessage) setErrorMessage('');
                    if (!returnDate || returnDate < nextDate) {
                      setReturnDate(nextDate);
                    }
                  }}
                />
              </div>
            </div>

            <div className="form-field">
              <div className="time-mode-toggle" role="group" aria-label="Tidsläge">
                <button
                  type="button"
                  className={`time-mode-btn ${!isAllDay ? 'is-active' : ''}`}
                  onClick={() => setIsAllDay(false)}
                >
                  Tid
                </button>
                <button
                  type="button"
                  className={`time-mode-btn ${isAllDay ? 'is-active' : ''}`}
                  onClick={() => setIsAllDay(true)}
                >
                  Heldag
                </button>
              </div>
              <div className="input-with-icon">
                <Clock size={18} className="input-icon-left" aria-hidden="true" />
                <input
                  id="event-time"
                  type="text"
                  className="text-input has-left-icon tabular-nums"
                  value={isAllDay ? 'Heldag' : time}
                  disabled={isAllDay}
                  onChange={(event) => setTime(event.target.value)}
                  aria-label="Klockslag"
                />
              </div>
            </div>
          </div>

          {/* --- Plats (valfritt) --- */}
          <div className="form-field">
            <label htmlFor="event-location" className="form-label">
              Plats (valfritt)
            </label>
            <div className="input-with-icon">
              <MapPin size={18} className="input-icon-left" aria-hidden="true" />
              <input
                id="event-location"
                type="text"
                className="text-input has-left-icon"
                placeholder="Lägg till plats, adress"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </div>
          </div>

          {/* --- Beskrivning (valfritt) --- */}
          <div className="form-field">
            <label htmlFor="event-description" className="form-label">
              Beskrivning (valfritt)
            </label>
            <textarea
              id="event-description"
              className="textarea-input"
              placeholder="Information till den andre vårdnadshavaren om aktiviteten..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {/* --- Checklista (valfritt) --- */}
          <div className="form-field">
            <span className="form-label">Checklista (valfritt)</span>
            {checklist.length > 0 ? (
              <div className="checklist-draft-list">
                {checklist.map((item) => (
                  <div key={item.id} className="checklist-draft-item">
                    <span>{item.text}</span>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() =>
                        setChecklist((prev) => prev.filter((c) => c.id !== item.id))
                      }
                      aria-label={`Ta bort ${item.text}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="checklist-add-row">
              <input
                type="text"
                className="text-input"
                placeholder="Ta med..."
                value={newChecklistItem}
                onChange={(event) => setNewChecklistItem(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleAddChecklist();
                  }
                }}
                aria-label="Ny punkt i checklista"
              />
              <button
                type="button"
                className="secondary-pill-btn"
                onClick={handleAddChecklist}
              >
                <Plus size={16} aria-hidden="true" />
                <span>Lägg till</span>
              </button>
            </div>
          </div>

          {errorMessage ? (
            <p id="event-form-error" className="form-error" role="alert" aria-live="polite">
              {errorMessage}
            </p>
          ) : null}

          {/* --- Borttagning vid redigering (med enkel bekräftelse) --- */}
          {editingEvent ? (
            <div className="delete-event-zone">
              {showDeleteConfirm ? (
                <div className="delete-confirm-box" role="alert">
                  <p className="delete-confirm-text">
                    Vill du ta bort aktiviteten? Eventuell schemaändring återgår till det vanliga.
                  </p>
                  <div className="delete-confirm-actions">
                    <button
                      type="button"
                      className="btn-outline-pill"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Behåll
                    </button>
                    <button
                      type="button"
                      className="btn-danger-solid"
                      onClick={() => onDelete(editingEvent.id)}
                    >
                      Ja, ta bort
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-danger-outline"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  <span>Ta bort aktivitet</span>
                </button>
              )}
            </div>
          ) : null}

          {/* --- Spara / Avbryt --- */}
          <div className="form-actions-row">
            <button type="button" className="btn-outline-pill" onClick={onClose}>
              Avbryt
            </button>
            <button type="submit" className="btn-primary-pill">
              Spara
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
