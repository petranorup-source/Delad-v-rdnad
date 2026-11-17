/* --- Veckovy (Kolumner Mån till Fre, följer månadsvyns struktur) --- */
import React from 'react';
import { Plus } from 'lucide-react';
import {
  getCustodyClassName,
  getDisplayCustodyForDate,
  getWeekDaysFromDate,
  toDateISO,
} from '../data/mockData';
import { SplitChildrenBackdrop } from './MonthView';

export default function WeekView({
  anchorDateISO,
  custodyPattern,
  events,
  childrenProfiles,
  guardians,
  selectedChildFilter,
  getChildColorKey,
  onSelectDate,
  onOpenEventDetail,
}) {
  const { weekNumber, days } = getWeekDaysFromDate(anchorDateISO, 5);
  const todayISO = toDateISO(new Date());

  return (
    <section aria-label={`Veckovy vecka ${weekNumber}`}>
      <div className="month-grid-wrapper">
        {/* --- Veckodagsrubriker: V. samt Mån till Fre --- */}
        <div className="week-columns-header" role="row">
          <div className="month-weekday-cell">V.</div>
          {days.map((day) => (
            <div key={day.dateISO} className="month-weekday-cell">
              {day.weekdayShort}
            </div>
          ))}
        </div>

        {/* --- Kolumnrad med veckonummer och Mån–Fre --- */}
        <div className="week-columns-row" role="row">
          <div className="month-week-num tabular-nums" aria-label={`Vecka ${weekNumber}`}>
            v.{weekNumber}
          </div>

          {days.map((day) => {
            const displayCustody = getDisplayCustodyForDate(
              day.dateISO,
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
            const isToday = day.dateISO === todayISO;

            const dayEvents = events
              .filter((evt) => {
                if (evt.date !== day.dateISO) return false;
                if (selectedChildFilter === 'both') return true;
                return evt.childId === selectedChildFilter || evt.childId === 'both';
              })
              .sort((a, b) => a.time.localeCompare(b.time));

            return (
              <div
                key={day.dateISO}
                className={`week-col-cell ${custodyClass} ${isToday ? 'is-today' : ''} ${
                  displayCustody.hasPendingOverride ? 'has-pending-override' : ''
                }`}
              >
                {isSplitChildren ? (
                  <SplitChildrenBackdrop
                    childCustodies={displayCustody.childCustodies}
                    getChildColorKey={getChildColorKey}
                  />
                ) : null}

                <div className="week-col-inner">
                  <button
                    type="button"
                    className="week-col-day-btn"
                    onClick={() => onSelectDate(day.dateISO)}
                    aria-label={`${day.weekdayLong} ${day.dayNumber}, ${displayCustody.label}, ${dayEvents.length} aktiviteter`}
                  >
                    <span className="month-day-num tabular-nums">{day.dayNumber}</span>
                    {displayCustody.hasPendingOverride ? (
                      <span
                        className="month-day-pending-mark"
                        title="Föreslaget byte inväntar godkännande"
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>

                  <div className="week-col-events">
                    {dayEvents.map((evt) => (
                      <button
                        key={evt.id}
                        type="button"
                        className={`week-col-event-pill ${
                          evt.status === 'pending' ? 'is-pending' : ''
                        } ${evt.status === 'declined' ? 'is-declined' : ''}`}
                        data-color={getChildColorKey(evt.childId)}
                        onClick={() => onOpenEventDetail(evt.id)}
                        aria-label={`Öppna ${evt.title} ${evt.isAllDay ? 'Heldag' : evt.time}`}
                      >
                        <span className="week-col-event-time tabular-nums">
                          {evt.isAllDay ? 'Heldag' : evt.time}
                        </span>
                        <span className="week-col-event-title">{evt.title}</span>
                      </button>
                    ))}
                    {dayEvents.length === 0 ? (
                      <button
                        type="button"
                        className="week-col-empty-card"
                        onClick={() => onSelectDate(day.dateISO)}
                        aria-label={`Inga aktiviteter ${day.weekdayLong} ${day.dayNumber}. Tryck för att visa eller lägga till.`}
                      >
                        <Plus size={13} aria-hidden="true" />
                        <span>Lägg till</span>
                      </button>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    className="week-col-spacer-btn"
                    onClick={() => onSelectDate(day.dateISO)}
                    aria-label={`Visa eller lägg till aktivitet ${day.weekdayLong} ${day.dayNumber}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
