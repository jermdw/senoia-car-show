import { useEffect, useState } from 'react'
import { fetchAnnouncement } from '../lib/announcement.js'

const DISMISSED_KEY = 'announcementDismissedAt'
const POLL_MS = 60_000

function readDismissed() {
  try {
    return localStorage.getItem(DISMISSED_KEY)
  } catch {
    return null
  }
}

// SDK-free by design — see the note in src/lib/announcement.js. Mounted once in
// SiteHeader, so every page that renders the header gets it for free.
export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null)
  const [dismissedAt, setDismissedAt] = useState(readDismissed)

  useEffect(() => {
    let cancelled = false
    const load = () => {
      fetchAnnouncement().then((a) => {
        if (!cancelled) setAnnouncement(a)
      })
    }
    load()
    // Skip polling while the tab is hidden, and catch up immediately when it
    // becomes visible again rather than waiting out the rest of the interval.
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') load()
    }, POLL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  if (!announcement?.active || !announcement.text) return null
  // updatedAt doubles as a version key: re-toggling active or editing the text
  // bumps it, so a previously-dismissed message reappears as "new".
  if (announcement.updatedAt && announcement.updatedAt === dismissedAt) return null

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, announcement.updatedAt)
    } catch {
      // Private browsing or a full quota — the banner just won't stay dismissed.
    }
    setDismissedAt(announcement.updatedAt)
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="print:hidden bg-gold text-ink flex items-center justify-center gap-3 px-4 py-2 text-sm font-medium text-center"
    >
      <span>{announcement.text}</span>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="text-ink/70 hover:text-ink text-lg leading-none shrink-0"
      >
        ×
      </button>
    </div>
  )
}
