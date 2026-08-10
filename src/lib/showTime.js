// Pure time helpers for the show day guide, kept out of components so they can be
// exercised at a fixed `now` — changing the system clock to test "happening now"
// breaks TLS and Firebase auth token validation.

export const SHOW_DATE = { year: 2026, month: 8, day: 26 } // month is 0-indexed

export function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h < 12 ? 'am' : 'pm'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')}${suffix}`
}

// Highlighting "happening now" on a random day in July would be nonsense.
export function isShowDay(now = new Date()) {
  return (
    now.getFullYear() === SHOW_DATE.year &&
    now.getMonth() === SHOW_DATE.month &&
    now.getDate() === SHOW_DATE.day
  )
}

// Index of the most recent entry at or before `now`, or -1 before the first.
// Assumes `schedule` is sorted ascending by `time`.
export function currentEntryIndex(schedule, now = new Date()) {
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes(),
  ).padStart(2, '0')}`
  let index = -1
  schedule.forEach((entry, i) => {
    if (entry.time <= hhmm) index = i
  })
  return index
}
