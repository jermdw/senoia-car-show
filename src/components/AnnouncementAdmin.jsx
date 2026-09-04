import { useEffect, useRef, useState } from 'react'
import { doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, EVENT_ID } from '../firebase'

// Admin-only, and it imports `src/firebase.js` — only `pages/Admin.jsx` may pull this
// in, or the Firebase SDK lands back in the chunk every spectator downloads. See the
// note in AppRoutes.jsx.

export default function AnnouncementAdmin() {
  const [text, setText] = useState('')
  const [active, setActive] = useState(false)
  const [saving, setSaving] = useState(false)
  // True from the first keystroke until the next successful save. The listener
  // below fires on ANY write to events/2026 — a second organizer saving, or the
  // server round-trip of this tab's own save — and unconditionally overwriting
  // the form from it wipes a half-typed announcement. On show day two people are
  // plausibly in this dashboard at once, so the local edit wins until it's
  // committed. `dirty` is a ref, not state: it must not re-run the subscription.
  const dirty = useRef(false)

  useEffect(() => onSnapshot(doc(db, 'events', EVENT_ID), (snap) => {
    if (dirty.current) return
    const a = snap.data()?.announcement
    setText(a?.text ?? '')
    setActive(a?.active ?? false)
  }), [])

  const edit = (setter, value) => {
    dirty.current = true
    setter(value)
  }

  async function save() {
    setSaving(true)
    try {
      await updateDoc(doc(db, 'events', EVENT_ID), {
        announcement: { text, active, updatedAt: serverTimestamp() },
      })
      // Only now may the listener drive the form again — what is on screen is
      // what is stored. Cleared after the await so a failed save keeps the
      // organizer's text on screen to retry with.
      dirty.current = false
    } catch (e) {
      console.error('save announcement failed', e)
      alert('That didn’t save. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h2 className="font-display uppercase tracking-wide text-lg text-ink mb-3">Site Announcement</h2>
      <p className="text-sm text-stone-600 mb-4">
        Shown as a dismissible banner on every public page — gate times, weather
        delays, schedule changes. Saving always brings it back for anyone who already
        dismissed it, even if you only flip "Show this on the site" back on.
      </p>
      <textarea
        value={text}
        onChange={(e) => edit(setText, e.target.value)}
        rows={3}
        placeholder="Gates now open — enter via Barnes St."
        className="w-full border border-stone-300 rounded-lg p-3 text-sm"
      />
      <label className="flex items-center gap-2 mt-3 text-sm">
        <input type="checkbox" checked={active} onChange={(e) => edit(setActive, e.target.checked)} />
        Show this on the site
      </label>
      <button
        onClick={save}
        disabled={saving}
        className="mt-4 bg-gold text-ink font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </main>
  )
}
