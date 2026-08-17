import { useEffect, useState } from 'react'
import { timeUntilShow } from '../lib/showTime.js'

const UNITS = [
  ['days', 'Days'],
  ['hours', 'Hours'],
  ['minutes', 'Minutes'],
  ['seconds', 'Seconds'],
]

/**
 * Ticking countdown to 10am on show day, for the landing hero.
 *
 * The digits are `aria-hidden`: a value that changes every second is noise to a
 * screen reader, so the same information is carried once, in prose, by the
 * visually hidden line (no live region — it is read on demand, not announced).
 */
export default function Countdown() {
  const [left, setLeft] = useState(() => timeUntilShow())

  useEffect(() => {
    const id = setInterval(() => setLeft(timeUntilShow()), 1000)
    return () => clearInterval(id)
  }, [])

  if (left.phase !== 'before') {
    return (
      <p className="font-display text-xl sm:text-2xl uppercase tracking-widest text-gold">
        {left.phase === 'live'
          ? "The show is on — Main Street 'til 4pm"
          : 'That’s a wrap on 2026 — see you next September'}
      </p>
    )
  }

  return (
    <div>
      <p className="font-display text-xs sm:text-sm uppercase tracking-[0.3em] text-gold-pale/60 mb-3">
        Countdown to Show Day
      </p>
      <div
        aria-hidden="true"
        className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto"
      >
        {UNITS.map(([key, label]) => (
          <div
            key={key}
            className="rounded-lg border border-gold/30 bg-gold/10 px-1 py-3 sm:py-4"
          >
            <span className="block font-display font-semibold text-3xl sm:text-5xl leading-none text-gold tabular-nums">
              {key === 'days' ? left[key] : String(left[key]).padStart(2, '0')}
            </span>
            <span className="block font-display text-[0.6rem] sm:text-xs uppercase tracking-widest text-gold-pale/70 mt-1.5">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="sr-only">
        {left.days} days and {left.hours} hours until the show opens at 10am on
        Saturday, September 26, 2026.
      </p>
    </div>
  )
}
