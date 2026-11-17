/* --- Sökvy (SearchView) --- */
import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin, Search } from 'lucide-react';
import { formatSwedishDayTitle } from '../data/mockData';

export default function SearchView({
  events,
  getChildColorKey,
  onSelectEvent,
  onBack,
}) {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();

  const matches = events
    .filter((evt) => {
      if (!normalized) return true;
      const inChecklist = evt.checklist.some((c) =>
        c.text.toLowerCase().includes(normalized)
      );
      return (
        evt.title.toLowerCase().includes(normalized) ||
        (evt.location && evt.location.toLowerCase().includes(normalized)) ||
        (evt.description && evt.description.toLowerCase().includes(normalized)) ||
        (evt.category && evt.category.toLowerCase().includes(normalized)) ||
        inChecklist
      );
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <main className="subview-container" aria-label="Sök aktiviteter">
      <div className="subview-header">
        <button
          type="button"
          className="icon-btn"
          onClick={onBack}
          aria-label="Tillbaka till kalender"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="subview-title">Sök</h1>
      </div>

      <div className="input-with-icon">
        <Search size={18} className="input-icon-left" aria-hidden="true" />
        <input
          type="search"
          className="text-input has-left-icon"
          placeholder="Sök aktivitet, plats eller packlista..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Sök efter aktiviteter"
          autoFocus
        />
      </div>

      <div className="list-view-container">
        {matches.length === 0 ? (
          <div className="simple-card">
            <p className="empty-day-text">Inga aktiviteter matchade din sökning.</p>
            {query.trim() ? (
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="secondary-pill-btn"
                  onClick={() => setQuery('')}
                >
                  Rensa sökning
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          matches.map((evt) => (
            <button
              key={evt.id}
              type="button"
              className={`activity-card ${evt.status === 'pending' ? 'is-pending' : ''} ${
                evt.status === 'declined' ? 'is-declined' : ''
              }`}
              data-color={getChildColorKey(evt.childId)}
              onClick={() => onSelectEvent(evt.id)}
              aria-label={`Öppna ${evt.title} den ${formatSwedishDayTitle(evt.date)}`}
            >
              <div className="activity-card-grid">
                <div className="activity-card-left">
                  <span className="profile-card-label">
                    {formatSwedishDayTitle(evt.date)}
                  </span>
                  <h2 className="activity-card-title">{evt.title}</h2>
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
            </button>
          ))
        )}
      </div>
    </main>
  );
}
