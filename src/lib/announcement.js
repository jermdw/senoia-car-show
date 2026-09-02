// Public, SDK-free read of the show's announcement banner. Hits the Firestore REST
// endpoint directly instead of the Firebase SDK, so pages that render the banner never
// pull the Firebase chunk into the public bundle — see the "keep public pages
// Firebase-free" note in AppRoutes.jsx. events/2026 is already publicly readable
// under firestore.rules, so this needs no auth and no API key.

const PROJECT_ID = 'senoiacar'
const EVENT_ID = '2026'

const BASE_URL = import.meta.env.DEV
  ? `http://localhost:8080/v1/projects/${PROJECT_ID}/databases/(default)/documents`
  : `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

// Never throws — a flaky fetch or a doc with no `announcement` field just means no
// banner, not a broken page.
export async function fetchAnnouncement() {
  try {
    const res = await fetch(`${BASE_URL}/events/${EVENT_ID}`)
    if (!res.ok) return null
    const body = await res.json()
    const fields = body.fields?.announcement?.mapValue?.fields
    if (!fields) return null
    return {
      text: fields.text?.stringValue ?? '',
      active: fields.active?.booleanValue ?? false,
      updatedAt: fields.updatedAt?.timestampValue ?? '',
    }
  } catch {
    return null
  }
}
