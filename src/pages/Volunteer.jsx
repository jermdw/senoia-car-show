import { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, query } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions, EVENT_ID } from '../firebase'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import ShirtMockup from '../components/ShirtMockup.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { SHIRT_SIZES } from '../shirtSizes.js'

const DAY_LABELS = {
  '2026-09-25': 'Friday, Sept 25 — Setup',
  '2026-09-26': 'Saturday, Sept 26 — Show Day',
  '2026-09-27': 'Sunday, Sept 27 — Cleanup',
}

export default function Volunteer() {
  usePageMeta({
    title: 'Volunteer at the 2026 Senoia Car Show',
    description:
      'The show runs on volunteers — browse open shifts for setup, show day, and cleanup (September 25–27, 2026) and sign up in seconds. No account needed.',
    path: '/volunteer',
  })

  const [shifts, setShifts] = useState(null)
  const [event, setEvent] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'events', EVENT_ID, 'shifts'))
    const unsub1 = onSnapshot(
      q,
      (snap) => setShifts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => {
        console.error('shifts listener failed', err)
        setLoadError(true)
      },
    )
    const unsub2 = onSnapshot(
      doc(db, 'events', EVENT_ID),
      (snap) => setEvent(snap.data() ?? {}),
      (err) => console.error('event listener failed', err),
    )
    return () => { unsub1(); unsub2() }
  }, [])

  const byDay = useMemo(() => {
    if (!shifts) return {}
    const groups = {}
    const ordered = [...shifts].sort(
      (a, b) => a.day.localeCompare(b.day) || a.sortOrder - b.sortOrder,
    )
    for (const s of ordered) {
      ;(groups[s.day] ||= []).push(s)
    }
    return groups
  }, [shifts])

  const closed = event?.signupOpen === false

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <header className="bg-ink text-cream px-6 pt-6 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-display font-semibold uppercase tracking-wide">
          Volunteer <span className="text-gold">Sign-Up</span>
        </h1>
        <p className="text-gold-pale/80 mt-3 max-w-xl mx-auto">
          Pick a shift below — no account needed. You'll get a confirmation
          email, and we'll contact you the week before the show about the
          volunteer orientation meeting.
        </p>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        {!loadError && !closed && (
          <div className="bg-white rounded-xl border border-stone-200 p-5 mb-8 flex items-center gap-5">
            <ShirtMockup className="w-24 sm:w-28 shrink-0" />
            <div>
              <p className="font-display text-xl uppercase tracking-wide text-ink">
                Every volunteer gets a <span className="text-gold-dark">free shirt</span>
              </p>
              <p className="text-stone-600 text-sm mt-1">
                Our way of saying thank you. Choose your size when you claim a
                shift (S–4XL), then pick your shirt up at one of the volunteer
                training meetings the week before the show — dates to be
                announced.
              </p>
            </div>
          </div>
        )}
        {loadError ? (
          <p className="text-center text-red-600 py-12" role="alert">
            We couldn't load the shift list. Please refresh the page, or email{' '}
            <a className="underline" href="mailto:carshow@enjoysenoia.com">carshow@enjoysenoia.com</a>.
          </p>
        ) : closed ? (
          <p className="text-center text-stone-600 py-12">
            Volunteer sign-ups are closed. Questions? Email{' '}
            <a className="underline" href="mailto:carshow@enjoysenoia.com">carshow@enjoysenoia.com</a>.
          </p>
        ) : !shifts ? (
          <p className="text-center text-stone-500 py-12">Loading shifts…</p>
        ) : shifts.length === 0 ? (
          <p className="text-center text-stone-500 py-12">
            Sign-ups aren't open yet. Check back soon!
          </p>
        ) : (
          Object.entries(byDay).map(([day, dayShifts]) => (
            <section key={day} className="mb-10">
              <h2 className="text-xl font-bold text-stone-800 border-b-2 border-gold pb-2 mb-4">
                {DAY_LABELS[day] ?? day}
              </h2>
              <ul className="space-y-3">
                {dayShifts.map((s) => (
                  <ShiftRow key={s.id} shift={s} onSignUp={() => setSelected(s)} />
                ))}
              </ul>
            </section>
          ))
        )}
      </main>

      <SiteFooter />

      {selected && (
        <SignupModal shift={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function ShiftRow({ shift, onSignUp }) {
  const remaining = shift.spotsTotal - shift.spotsFilled
  const full = remaining <= 0
  return (
    <li className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[12rem]">
        <p className="font-semibold text-ink">{shift.role}</p>
        <p className="text-stone-500 text-sm">{shift.time}</p>
      </div>
      <div className="text-sm text-right mr-2">
        {full ? (
          <span className="inline-block bg-stone-200 text-stone-500 font-semibold rounded-full px-3 py-1">
            Full
          </span>
        ) : (
          <span className="inline-block bg-green-100 text-green-800 font-semibold rounded-full px-3 py-1">
            {remaining} {remaining === 1 ? 'spot' : 'spots'} left
          </span>
        )}
      </div>
      <button
        onClick={onSignUp}
        disabled={full}
        className="bg-gold hover:bg-gold-dark disabled:bg-stone-200 disabled:text-stone-400 text-ink font-bold px-5 py-2 rounded-lg transition-colors"
      >
        Sign Up
      </button>
    </li>
  )
}

function SignupModal({ shift, onClose }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', shirtSize: '',
  })
  const [state, setState] = useState({ status: 'idle', error: null })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  // Closing mid-submit would hide the outcome of an in-flight signup
  const safeClose = () => { if (state.status !== 'submitting') onClose() }

  // Escape closes the dialog; no dep array so the handler always sees the
  // current submit-state guard.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') safeClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  async function submit(e) {
    e.preventDefault()
    setState({ status: 'submitting', error: null })
    try {
      const signUp = httpsCallable(functions, 'signUp')
      await signUp({ eventId: EVENT_ID, shiftId: shift.id, ...form })
      setState({ status: 'done', error: null })
    } catch (err) {
      setState({ status: 'idle', error: err.message || 'Something went wrong. Please try again.' })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={safeClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Sign up: ${shift.role}`}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {state.status === 'done' ? (
          <div className="text-center py-4">
            <p className="text-4xl mb-3">✅</p>
            <h2 className="text-xl font-bold text-ink mb-2">You're signed up!</h2>
            <p className="text-stone-600 mb-1">
              {shift.role} &middot; {shift.time}
            </p>
            <p className="text-stone-600 text-sm mb-1">
              Free shirt reserved in size <strong>{form.shirtSize}</strong> —
              pick it up at a volunteer training meeting.
            </p>
            <p className="text-stone-500 text-sm mb-6">
              A confirmation email is on its way to {form.email}. It includes a
              link if you need to cancel later.
            </p>
            <button
              onClick={onClose}
              className="bg-ink text-white font-semibold px-6 py-2 rounded-lg"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 className="text-xl font-bold text-ink">{shift.role}</h2>
            <p className="text-stone-500 text-sm mb-4">{shift.time}</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <label className="block col-span-1">
                <span className="text-sm font-medium text-stone-700">First name</span>
                <input required autoFocus value={form.firstName} onChange={set('firstName')} autoComplete="given-name"
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold" />
              </label>
              <label className="block col-span-1">
                <span className="text-sm font-medium text-stone-700">Last name</span>
                <input required value={form.lastName} onChange={set('lastName')} autoComplete="family-name"
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold" />
              </label>
            </div>
            <label className="block mb-3">
              <span className="text-sm font-medium text-stone-700">Email</span>
              <input required type="email" value={form.email} onChange={set('email')} autoComplete="email"
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold" />
            </label>
            <label className="block mb-3">
              <span className="text-sm font-medium text-stone-700">Phone</span>
              <input required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel"
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold" />
            </label>
            <label className="block mb-5">
              <span className="text-sm font-medium text-stone-700">
                Shirt size <span className="text-stone-500 font-normal">— your free volunteer shirt</span>
              </span>
              <select required value={form.shirtSize} onChange={set('shirtSize')}
                className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold">
                <option value="" disabled>Choose a size…</option>
                {SHIRT_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            {state.error && (
              <p className="text-red-600 text-sm mb-3" role="alert">{state.error}</p>
            )}
            <div className="flex gap-3">
              <button type="button" onClick={safeClose}
                className="flex-1 border border-stone-300 text-stone-700 font-semibold px-4 py-2 rounded-lg">
                Cancel
              </button>
              <button type="submit" disabled={state.status === 'submitting'}
                className="flex-1 bg-gold hover:bg-gold-dark disabled:opacity-60 text-ink font-bold px-4 py-2 rounded-lg">
                {state.status === 'submitting' ? 'Signing up…' : 'Sign Up'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
