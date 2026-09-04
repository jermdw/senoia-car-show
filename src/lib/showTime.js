// Pure time helpers for the show day guide, kept out of components so they can be
// exercised at a fixed `now` — changing the system clock to test "happening now"
// breaks TLS and Firebase auth token validation.

// ROLLING OVER TO NEXT YEAR: these three constants are the switch, and they have
// to move together with the dates in `index.html`'s Event JSON-LD.
//
// They are also a one-way cliff, which is the part that bites. `hasShowDayArrived`
// is true for every date at or after SHOW_DATE and never flips back, so the moment
// the 2026 show ends the site is permanently in show-day mode: Volunteer and Poker
// Run are gone from the nav and the home page, Awards is pinned there instead, and
// the hero countdown reads "that's a wrap on 2026" forever. That is correct for the
// weeks after the show — but if next year's content lands before these constants
// do, volunteer sign-ups open with no link to them anywhere on the site. Bump these
// FIRST. The dev-only warning below is the tripwire for exactly that.
export const SHOW_DATE = { year: 2026, month: 8, day: 26 } // month is 0-indexed

// Gates open 10am and the show closes at 4pm, Eastern. Late September is still
// EDT (UTC-4), so a fixed offset is exact here — no timezone lookup needed, and
// the instant is the same one `index.html`'s Event JSON-LD advertises.
export const SHOW_START = new Date('2026-09-26T10:00:00-04:00')
export const SHOW_END = new Date('2026-09-26T16:00:00-04:00')

// Optional-chained: this module is deliberately dependency-free so it can be
// imported by the test suite under plain Node, where `import.meta.env` is absent.
if (import.meta.env?.DEV && Date.now() > SHOW_END.getTime() + 45 * 86_400_000) {
  console.warn(
    `[showTime] SHOW_DATE is ${SHOW_DATE.year}-${SHOW_DATE.month + 1}-${SHOW_DATE.day}, ` +
    'more than 45 days past. The site is stuck in show-day mode: the Volunteer and ' +
    'Poker Run links are hidden everywhere and the countdown reads "that\'s a wrap". ' +
    'Update SHOW_DATE/SHOW_START/SHOW_END here and the Event JSON-LD in index.html.',
  )
}

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

// A scheduled window on show day, as three states rather than a boolean: an
// "is it happening" flag has no way to say "it already finished", so the awards
// board's "Announcing now" pill stayed lit until midnight and its empty-board
// copy still promised results "starting at 3:00 PM" at five o'clock.
// Off show day everything is 'before' — hasPassedOnShowDay is false then.
export function phaseOnShowDay(startHhmm, endHhmm, now = new Date()) {
  if (!hasPassedOnShowDay(startHhmm, now)) return 'before'
  return hasPassedOnShowDay(endHhmm, now) ? 'after' : 'during'
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
