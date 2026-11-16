/* --- Månadsvy (Kalenderrutnät — endast 1 månad, max 6 veckor) --- */
import React from 'react';
import {
  getCustodyClassName,
  getDisplayCustodyForDate,
  getMonthCalendarWeeks,
  SWEDISH_WEEKDAYS_SHORT,
  toDateISO,
} from '../data/mockData';

export { getCustodyClassName };

export function SplitChildrenBackdrop({ childCustodies, getChildColorKey }) {
  return (
    <div className="split-children-bg" aria-hidden="true">
      {childCustodies.map(({ child, custody }) => (
        <div
          key={child.id}
          className={`split-child-band ${getCustodyClassName(custody)}`}
        >
          <span className="split-child-tag" data-color={getChildColorKey(child.id)}>
            {child.initial}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function MonthView({
  year,
  monthIndex,
  custodyPattern,
  events,
  childrenProfiles,
  guardians,
  selectedChildFilter,
  getChildColorKey,
  onSelectDate,
}) {
  const weeks = getMonthCalendarWeeks(year, monthIndex);
  const todayISO = toDateISO(new Date());

  return (
    <section aria-label="Månadskalender">
      <div className="month-grid-wrapper">
        {/* --- Veckodagsrubriker --- */}
        <div className="month-weekdays" role="row">
          <div className="month-weekday-cell">V.</div>
          {SWEDISH_WEEKDAYS_SHORT.map((dayName) => (
            <div key={dayName} className="month-weekday-cell">
              {dayName}
            </div>
          ))}
        </div>

        {/* --- Kalenderrader per vecka (endast aktuell månads dagar) --- */}
        {weeks.map((week) => (
          <div key={week.weekNumber} className="month-week-row" role="row">
            <div className="month-week-num tabular-nums" aria-label={`Vecka ${week.weekNumber}`}>
              v.{week.weekNumber}
            </div>
            {week.days.map((day) => {
              if (!day.inCurrentMonth) {
                return (
                  <div
                    key={day.dateISO}
                    className="month-day-cell is-empty-outside"
                    aria-hidden="true"
                  />
                );
              }

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

              const dayEvents = events.filter((evt) => {
                if (evt.date !== day.dateISO) return false;
                if (selectedChildFilter === 'both') return true;
                return evt.childId === selectedChildFilter || evt.childId === 'both';
              });

              const hasPending =
                displayCustody.hasPendingOverride ||
                dayEvents.some((evt) => evt.status === 'pending');
              const isToday = day.dateISO === todayISO;

              return (
                <button
                  key={day.dateISO}
                  type="button"
                  className={`month-day-cell ${custodyClass} ${isToday ? 'is-today' : ''} ${
                    displayCustody.hasPendingOverride ? 'has-pending-override' : ''
                  }`}
                  onClick={() => onSelectDate(day.dateISO)}
                  aria-label={`${day.dayNumber}, ${displayCustody.label}, ${dayEvents.length} aktiviteter`}
                >
                  {isSplitChildren ? (
                    <SplitChildrenBackdrop
                      childCustodies={displayCustody.childCustodies}
                      getChildColorKey={getChildColorKey}
                    />
                  ) : null}

                  <div className="month-day-content">
                    <div className="month-day-top">
                      <span className="month-day-num tabular-nums">{day.dayNumber}</span>
                      {hasPending ? (
                        <span
                          className="month-day-pending-mark"
                          title="Inväntar godkännande"
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>

                    {/* --- Diskreta aktivitetsmarkörer --- */}
                    {dayEvents.length > 0 ? (
                      <>
                        <div className="month-day-dots" aria-hidden="true">
                          {dayEvents.slice(0, 4).map((evt) => (
                            <span
                              key={evt.id}
                              className={`month-event-dot ${
                                evt.status === 'declined' ? 'is-declined' : ''
                              }`}
                              data-color={getChildColorKey(evt.childId)}
                            />
                          ))}
                        </div>
                        <div
                          className={`month-event-preview ${
                            dayEvents[0].status === 'pending' ? 'is-pending' : ''
                          } ${dayEvents[0].status === 'declined' ? 'is-declined' : ''}`}
                          data-color={getChildColorKey(dayEvents[0].childId)}
                          aria-hidden="true"
                        >
                          {dayEvents[0].title}
                        </div>
                      </>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
