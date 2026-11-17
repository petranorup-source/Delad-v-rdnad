/* --- Sekundära vyer: Notiser, Inställningar, Hjälp & Logga ut --- */
import React, { useState } from 'react';
import { ArrowLeft, Check, Download, MessageSquare, RotateCcw, Share } from 'lucide-react';
import { formatSwedishDayTitle } from '../data/mockData';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function NotificationsView({
  events,
  guardians,
  activeUser,
  onOpenDay,
  onOpenEventDetail,
  onBack,
}) {
  const otherGuardian = guardians.find((g) => g.id !== activeUser);
  const pendingEvents = events.filter(
    (evt) => evt.status === 'pending' && evt.createdBy !== activeUser
  );
  const commentedEvents = events.filter((evt) => evt.comments.length > 0);

  return (
    <main className="subview-container" aria-label="Notiser">
      <div className="subview-header">
        <button
          type="button"
          className="icon-btn"
          onClick={onBack}
          aria-label="Tillbaka till kalender"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="subview-title">Notiser</h1>
      </div>

      <section className="simple-card" aria-label="Obehandlade aktiviteter">
        <h2 className="profile-section-title">Att ta ställning till</h2>
        {pendingEvents.length === 0 ? (
          <p className="profile-note">Inga obehandlade aktiviteter just nu.</p>
        ) : (
          pendingEvents.map((evt) => (
            <button
              key={evt.id}
              type="button"
              className="notification-item-btn"
              onClick={() => onOpenDay(evt.date)}
            >
              <div>
                <div className="setting-option-title">{evt.title}</div>
                <div className="setting-option-desc">
                  Tillagd av {otherGuardian ? otherGuardian.name : 'andra vårdnadshavaren'} ·{' '}
                  {formatSwedishDayTitle(evt.date)}
                </div>
              </div>
              <span className="setting-option-desc">Visa</span>
            </button>
          ))
        )}
      </section>

      <section className="simple-card" aria-label="Senaste kommentarer">
        <h2 className="profile-section-title">Kommentarer på aktiviteter</h2>
        {commentedEvents.length === 0 ? (
          <p className="profile-note">Inga nya kommentarer.</p>
        ) : (
          commentedEvents.map((evt) => {
            const latest = evt.comments[evt.comments.length - 1];
            const author = guardians.find((g) => g.id === latest.authorId);
            return (
              <button
                key={evt.id}
                type="button"
                className="notification-item-btn"
                onClick={() => onOpenEventDetail(evt.id)}
              >
                <div>
                  <div className="setting-option-title">{evt.title}</div>
                  <div className="setting-option-desc">
                    {author ? author.name : 'Vårdnadshavare'}: {latest.text}
                  </div>
                </div>
                <MessageSquare size={18} aria-hidden="true" />
              </button>
            );
          })
        )}
      </section>
    </main>
  );
}

export function SettingsView({
  custodyPattern,
  onChangeCustodyPattern,
  onResetDemoData,
  onBack,
}) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  return (
    <main className="subview-container" aria-label="Inställningar">
      <div className="subview-header">
        <button
          type="button"
          className="icon-btn"
          onClick={onBack}
          aria-label="Tillbaka till kalender"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="subview-title">Inställningar</h1>
      </div>

      <section className="simple-card" aria-label="Umgängesschema">
        <h2 className="profile-section-title">Umgängesschema</h2>
        <button
          type="button"
          className={`setting-option-btn ${
            custodyPattern === 'alternating-weeks' ? 'is-selected' : ''
          }`}
          onClick={() => onChangeCustodyPattern('alternating-weeks')}
          aria-pressed={custodyPattern === 'alternating-weeks'}
        >
          <div>
            <div className="setting-option-title">Varannan vecka</div>
            <div className="setting-option-desc">
              Byte sker varje fredag med diagonalt delad bytesdag i kalendern.
            </div>
          </div>
          {custodyPattern === 'alternating-weeks' ? (
            <Check size={20} aria-hidden="true" />
          ) : null}
        </button>

        <button
          type="button"
          className={`setting-option-btn ${
            custodyPattern === 'alternating-weekends' ? 'is-selected' : ''
          }`}
          onClick={() => onChangeCustodyPattern('alternating-weekends')}
          aria-pressed={custodyPattern === 'alternating-weekends'}
        >
          <div>
            <div className="setting-option-title">Varannan helg</div>
            <div className="setting-option-desc">
              Vardagar hos Mamma, varannan helg fredag–söndag hos Pappa.
            </div>
          </div>
          {custodyPattern === 'alternating-weekends' ? (
            <Check size={20} aria-hidden="true" />
          ) : null}
        </button>
      </section>

      {/* --- PWA-installation --- */}
      {!isInstalled ? (
        <section className="simple-card" aria-label="Installera appen">
          <h2 className="profile-section-title">Installera på hemskärmen</h2>
          <p className="profile-note">
            Lägg till Delad Vårdnad på telefonen eller datorn för snabb åtkomst som en vanlig app.
          </p>
          {isInstallable ? (
            <div>
              <button type="button" className="secondary-pill-btn" onClick={install}>
                <Download size={18} aria-hidden="true" />
                <span>Installera Delad Vårdnad</span>
              </button>
            </div>
          ) : isIOS ? (
            <div>
              <button
                type="button"
                className="secondary-pill-btn"
                onClick={() => setShowIOSGuide((prev) => !prev)}
              >
                <Share size={18} aria-hidden="true" />
                <span>Så installerar du på iPhone / iPad</span>
              </button>
              {showIOSGuide ? (
                <p className="profile-note ios-guide-note">
                  1. Tryck på dela-knappen i Safari. 2. Välj Lägg till på hemskärmen.
                </p>
              ) : null}
            </div>
          ) : (
            <p className="profile-note">
              Öppna webbläsarens meny och välj Installera app eller Lägg till på hemskärmen.
            </p>
          )}
        </section>
      ) : null}
      {/* --- Demodata & Återställning --- */}
      <section className="simple-card" aria-label="Återställ demodata">
        <h2 className="profile-section-title">Demodata & Återställning</h2>
        <p className="profile-note">
          Dina ändringar, aktiviteter och färgval sparas automatiskt i din webbläsare. Vill du börja om från början?
        </p>
        {showResetConfirm ? (
          <div className="delete-confirm-box" role="alert">
            <p className="delete-confirm-text">
              Är du säker? Alla sparade aktiviteter, ändrade namn och inställningar återställs till ursprungliga demodata.
            </p>
            <div className="delete-confirm-actions">
              <button
                type="button"
                className="btn-outline-pill"
                onClick={() => setShowResetConfirm(false)}
              >
                Avbryt
              </button>
              <button
                type="button"
                className="btn-danger-solid"
                onClick={() => {
                  if (onResetDemoData) onResetDemoData();
                  setShowResetConfirm(false);
                  setResetDone(true);
                  setTimeout(() => setResetDone(false), 3500);
                }}
              >
                Återställ data
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              type="button"
              className="btn-danger-outline"
              onClick={() => setShowResetConfirm(true)}
            >
              <RotateCcw size={16} aria-hidden="true" />
              <span>Återställ till ursprunglig demodata</span>
            </button>
            {resetDone ? (
              <p className="status-inline is-approved" style={{ marginTop: '10px' }}>
                <Check size={16} aria-hidden="true" />
                <span>Demodata har återställts!</span>
              </p>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}

export function HelpView({ onBack }) {
  const [feedbackText, setFeedbackText] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!feedbackText.trim()) return;
    setSent(true);
    setFeedbackText('');
  };

  return (
    <main className="subview-container" aria-label="Hjälp och feedback">
      <div className="subview-header">
        <button
          type="button"
          className="icon-btn"
          onClick={onBack}
          aria-label="Tillbaka till kalender"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="subview-title">Hjälp och feedback</h1>
      </div>

      <section className="simple-card">
        <h2 className="profile-section-title">Så fungerar kalendern</h2>
        <p className="setting-option-desc">
          • Dagens bakgrundsfärg visar vilken vårdnadshavare som har barnen.
        </p>
        <p className="setting-option-desc">
          • Diagonalt delade dagar markerar bytesdag & överlämning.
        </p>
        <p className="setting-option-desc">
          • Nya aktiviteter får en streckad ram tills den andra vårdnadshavaren har tryckt Godkänn eller Avböj.
        </p>
      </section>

      <section className="simple-card">
        <h2 className="profile-section-title">Skicka feedback</h2>
        <form className="form-stack" onSubmit={handleSubmit}>
          <textarea
            className="textarea-input"
            placeholder="Beskriv om något kan göras tydligare..."
            value={feedbackText}
            onChange={(event) => {
              setFeedbackText(event.target.value);
              if (sent) setSent(false);
            }}
            aria-label="Feedback"
          />
          {sent ? (
            <p className="status-inline is-approved">
              <Check size={16} aria-hidden="true" />
              <span>Tack för din feedback.</span>
            </p>
          ) : null}
          <div className="form-actions-row">
            <button type="submit" className="btn-primary-pill">
              Skicka
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export function LogoutScreen({ guardians, onLoginAs }) {
  return (
    <main className="logout-screen" aria-label="Utloggad">
      <h1 className="calendar-period-title">Du är utloggad</h1>
      <p className="profile-note">Välj vilken vårdnadshavare du vill öppna kalendern som:</p>
      <div className="child-filter-bar">
        {guardians.map((g) => (
          <button
            key={g.id}
            type="button"
            className="secondary-pill-btn"
            onClick={() => onLoginAs(g.id)}
          >
            <span
              className={`guardian-avatar ${g.id === 'mamma' ? 'is-mamma' : 'is-pappa'}`}
              aria-hidden="true"
            >
              {g.initial}
            </span>
            <span>Fortsätt som {g.name}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
