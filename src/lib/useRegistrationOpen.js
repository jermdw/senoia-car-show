import { useEffect, useState } from 'react'
import { isOnlineRegistrationOpen } from '../data/registration.js'

/**
 * Whether the online (Ticket Tailor) registration links should still show.
 * Re-checks every minute so a page left open across the cutoff retires its
 * buttons without a reload; like the show-day switch, it only ever flips one
 * way, so the interval stops once it has.
 */
export function useOnlineRegistrationOpen() {
  const [open, setOpen] = useState(isOnlineRegistrationOpen)

  useEffect(() => {
    if (!open) return
    const interval = setInterval(() => setOpen(isOnlineRegistrationOpen()), 60_000)
    return () => clearInterval(interval)
  }, [open])

  return open
}
