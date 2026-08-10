import { useEffect, useState } from 'react'
import { currentEntryIndex, formatTime, isShowDay } from '../lib/showTime.js'

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

  return (
    <ol className="space-y-2">
      {schedule.map((entry, i) => {
        const isNow = i === activeIndex
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
              {entry.poi && (
                <button
                  type="button"
                  onClick={() => onSelectPoi?.(entry.poi.id)}
                  className="mt-2 min-h-11 inline-flex items-center text-sm font-semibold text-gold-dark underline underline-offset-2 hover:text-ink"
                >
                  {entry.poi.where
                    ? `${entry.poi.name} — ${entry.poi.where}`
                    : entry.poi.name}
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
