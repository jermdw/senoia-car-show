// Pure time helpers for the show day guide, kept out of components so they can be
// exercised at a fixed `now` — changing the system clock to test "happening now"
// breaks TLS and Firebase auth token validation.

export const SHOW_DATE = { year: 2026, month: 8, day: 26 } // month is 0-indexed

// Gates open 10am and the show closes at 4pm, Eastern. Late September is still
// EDT (UTC-4), so a fixed offset is exact here — no timezone lookup needed, and
// the instant is the same one `index.html`'s Event JSON-LD advertises.
export const SHOW_START = new Date('2026-09-26T10:00:00-04:00')
export const SHOW_END = new Date('2026-09-26T16:00:00-04:00')

export function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h < 12 ? 'am' : 'pm'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')}${suffix}`
}

// The event runs on US Eastern time; a remote visitor's clock must be read in
// the event's timezone or the highlight drifts by their UTC offset.
const EVENT_TZ = 'America/New_York'

function eventLocalParts(now) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: EVENT_TZ,
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(now)
  const num = (type) => Number(parts.find((p) => p.type === type).value)
  return {
    year: num('year'),
    month: num('month') - 1, // align with SHOW_DATE's 0-indexed month
    day: num('day'),
    hhmm: `${String(num('hour')).padStart(2, '0')}:${String(num('minute')).padStart(2, '0')}`,
  }
}

// Highlighting "happening now" on a random day in July would be nonsense.
export function isShowDay(now = new Date()) {
  const p = eventLocalParts(now)
  return p.year === SHOW_DATE.year && p.month === SHOW_DATE.month && p.day === SHOW_DATE.day
}

// True from the start of show day onward (event-local calendar date >= SHOW_DATE),
// never re-flipping false the day after. Drives the nav swap in SiteHeader — day-of
// links (Volunteer, Poker Run) drop off and Awards appears — without a redeploy.
export function hasShowDayArrived(now = new Date()) {
  const p = eventLocalParts(now)
  if (p.year !== SHOW_DATE.year) return p.year > SHOW_DATE.year
  if (p.month !== SHOW_DATE.month) return p.month > SHOW_DATE.month
  return p.day >= SHOW_DATE.day
}

// True once the event-local clock has reached `hhmm`, and only on show day —
// "announcing now" on the awards board in March would be nonsense. Reads the
// wall clock in the event's timezone rather than comparing against SHOW_START,
// because the caller's cue is a scheduled local time ("3:00pm"), not an offset
// from the gates opening.
export function hasPassedOnShowDay(hhmm, now = new Date()) {
  return isShowDay(now) && eventLocalParts(now).hhmm >= hhmm
}

// Time left until the gates open, split into whole units. Past the start it
// returns a phase instead of numbers — the countdown must never render negative
// digits, and "0 days 0 hours" during the show would read as a dead clock.
export function timeUntilShow(now = new Date()) {
  const ms = SHOW_START - now
  if (ms <= 0) return { phase: now < SHOW_END ? 'live' : 'over' }
  const total = Math.floor(ms / 1000)
  return {
    phase: 'before',
    days: Math.floor(total / 86400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  }
}

// Index of the most recent entry at or before `now`, or -1 before the first.
// Assumes `schedule` is sorted ascending by `time`.
export function currentEntryIndex(schedule, now = new Date()) {
  const { hhmm } = eventLocalParts(now)
  let index = -1
  schedule.forEach((entry, i) => {
    if (entry.time <= hhmm) index = i
  })
  return index
}
