import { useEffect, useState } from 'react'
import { hasShowDayArrived } from './showTime.js'
import { hasRegistrationClosed } from '../data/registration.js'

/**
 * Show-day nav state, shared by every surface that has to swap links on the
 * morning of the show — the header bar and the landing page's card grid.
 *
 * It lives here rather than in `showTime.js` (which is deliberately pure, so it
 * can be exercised at a fixed `now`) and rather than inside `SiteHeader` (where
 * it started): two components deciding independently which links are live is how
 * the home page ended up promoting Volunteer and Poker Run on show day while the
 * header had already retired them.
 */
export function useShowDayArrived() {
  const [arrived, setArrived] = useState(hasShowDayArrived)

  // Once true this never reverts, so the interval only needs to run beforehand —
  // it clears itself as soon as the flip happens. Keeps a tab left open across
  // the event-local midnight from being stuck on the pre-show nav until the
  // visitor happens to navigate.
  useEffect(() => {
    if (arrived) return
    const interval = setInterval(() => setArrived(hasShowDayArrived()), 60_000)
    return () => clearInterval(interval)
  }, [arrived])

  return arrived
}

/**
 * The one definition of what the two flags mean, so a link marked up once
 * behaves the same everywhere it appears.
 *
 * `hideOnShowDay` — stops being actionable once the show starts (Volunteer,
 * Poker Run). `showOnShowDay` — dead air until then, so not worth a slot before
 * (Awards). Anything with neither flag is always visible.
 */
export const isVisibleOnShowDay = (item, arrived) =>
  item.showOnShowDay ? arrived : !(item.hideOnShowDay && arrived)

/**
 * Same one-way flip as useShowDayArrived, for the online registration cutoff.
 * The poll matters here more than for the nav: the cutoff is 6:00pm, when
 * people are actively on the page, so an open tab has to catch it without a
 * reload rather than leave a live-looking button pointing at a closed checkout.
 */
export function useRegistrationClosed() {
  const [closed, setClosed] = useState(hasRegistrationClosed)

  useEffect(() => {
    if (closed) return
    const interval = setInterval(() => setClosed(hasRegistrationClosed()), 60_000)
    return () => clearInterval(interval)
  }, [closed])

  return closed
}
