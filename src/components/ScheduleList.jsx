import { useEffect, useState } from 'react'
import { currentEntryIndex, formatTime, isShowDay } from '../lib/showTime.js'
import { isWithinMap } from '../lib/venueGeo.js'

const TICK_MS = 30_000

// `now` is for tests only. Left unset, the component keeps its own clock: a visitor who
// opens the page at 10:55 and pockets the phone must still see the 3:00pm award ceremony
// light up, and nothing else on this page re-renders on a timer.
export default function ScheduleList({ schedule, onSelectPoi, now }) {
  const [clock, setClock] = useState(() => now ?? new Date())

  useEffect(() => {
    if (now) return undefined
    const id = setInterval(() => setClock(new Date()), TICK_MS)
    return () => clearInterval(id)
  }, [now])

  const current = now ?? clock
  const live = isShowDay(current)
  const activeIndex = live ? currentEntryIndex(schedule, current) : -1
  // Match on the time, not the index: two things genuinely start at 7:00am (the
  // show car gates and registration), and currentEntryIndex can only name one of
  // them, so keying off the index left the other silently unhighlighted.
  const activeTime = activeIndex >= 0 ? schedule[activeIndex].time : null

  return (
    <ol className="space-y-2">
      {schedule.map((entry) => {
        const isNow = entry.time === activeTime
        return (
          <li
            key={entry.time + entry.label}
            className={`rounded-lg border p-4 sm:flex sm:gap-4 ${
              isNow ? 'bg-gold-pale border-gold' : 'bg-white border-stone-200'
            }`}
          >
            <p className={`font-display text-lg w-24 shrink-0 ${
              isNow ? 'text-ink' : 'text-gold-dark'
            }`}>
              {formatTime(entry.time)}
            </p>
            <div className="min-w-0">
              <p className="font-display uppercase tracking-wide text-ink">
                {entry.label}
                {isNow && (
                  <span className="ml-2 align-middle bg-ink text-gold text-xs font-semibold px-2 py-0.5 rounded normal-case tracking-normal">
                    Happening now
                  </span>
                )}
              </p>
              {entry.detail && (
                <p className="text-stone-700 text-sm mt-1 leading-relaxed">
                  {entry.detail}
                </p>
              )}
              {entry.locationPending && (
                <p className="text-stone-600 text-sm mt-1 italic">
                  Location to be announced.
                </p>
              )}
              {entry.poi &&
                (isWithinMap(entry.poi.lat, entry.poi.lon) ? (
                  <button
                    type="button"
                    onClick={() => onSelectPoi?.(entry.poi.id)}
                    className="mt-2 min-h-11 inline-flex items-center text-sm font-semibold text-gold-dark underline underline-offset-2 hover:text-ink"
                  >
                    {entry.poi.where
                      ? `${entry.poi.name} — ${entry.poi.where}`
                      : entry.poi.name}
                  </button>
                ) : (
                  // Plain text, not a button: this location has no pin to centre on,
                  // so a control here would look actionable and do nothing. The stage
                  // is the live case — it is described but not yet geocoded.
                  <p className="mt-1 text-stone-700 text-sm">
                    {entry.poi.where
                      ? `${entry.poi.name} — ${entry.poi.where}`
                      : entry.poi.name}
                  </p>
                ))}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
