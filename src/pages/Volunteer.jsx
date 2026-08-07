import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions, EVENT_ID } from '../firebase'

const DAY_LABELS = {
  '2026-09-25': 'Friday, Sept 25 — Setup',
  '2026-09-26': 'Saturday, Sept 26 — Show Day',
  '2026-09-27': 'Sunday, Sept 27 — Cleanup',
}

export default function Volunteer() {
  const [shifts, setShifts] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'events', EVENT_ID, 'shifts'))
    return onSnapshot(q, (snap) => {
      setShifts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  }, [])

  const byDay = useMemo(() => {
    if (!shifts) return {}
    const groups = {}
    for (const s of [...shifts].sort((a, b) => a.sortOrder - b.sortOrder)) {
      ;(groups[s.day] ||= []).push(s)
    }
    return groups
  }, [shifts])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-8 text-center">
        <Link to="/" className="text-amber-400 text-sm tracking-widest uppercase font-semibold">
          Senoia Car Show 2026
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2 font-serif">Volunteer Sign-Up</h1>
        <p className="text-slate-300 mt-3 max-w-xl mx-auto">
          Pick a shift below — no account needed. You'll get a confirmation
          email, and we'll contact you the week before the show about the
          volunteer orientation meeting.
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {!shifts && <p className="text-center text-slate-500 py-12">Loading shifts…</p>}
        {shifts && shifts.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            Sign-ups aren't open yet. Check back soon!
          </p>
        )}
        {Object.entries(byDay).map(([day, dayShifts]) => (
          <section key={day} className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-amber-400 pb-2 mb-4">
              {DAY_LABELS[day] ?? day}
            </h2>
            <ul className="space-y-3">
              {dayShifts.map((s) => (
                <ShiftRow key={s.id} shift={s} onSignUp={() => setSelected(s)} />
              ))}
            </ul>
          </section>
        ))}
      </main>

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
    <li className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[12rem]">
        <p className="font-semibold text-slate-900">{shift.role}</p>
        <p className="text-slate-500 text-sm">{shift.time}</p>
      </div>
      <div className="text-sm text-right mr-2">
        {full ? (
          <span className="inline-block bg-slate-200 text-slate-500 font-semibold rounded-full px-3 py-1">
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
        className="bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-bold px-5 py-2 rounded-lg transition-colors"
      >
        Sign Up
      </button>
    </li>
  )
}

function SignupModal({ shift, onClose }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [state, setState] = useState({ status: 'idle', error: null })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {state.status === 'done' ? (
          <div className="text-center py-4">
            <p className="text-4xl mb-3">✅</p>
            <h2 className="text-xl font-bold text-slate-900 mb-2">You're signed up!</h2>
            <p className="text-slate-600 mb-1">
              {shift.role} &middot; {shift.time}
            </p>
            <p className="text-slate-500 text-sm mb-6">
              A confirmation email is on its way to {form.email}. It includes a
              link if you need to cancel later.
            </p>
            <button
              onClick={onClose}
              className="bg-slate-900 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 className="text-xl font-bold text-slate-900">{shift.role}</h2>
            <p className="text-slate-500 text-sm mb-4">{shift.time}</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <label className="block col-span-1">
                <span className="text-sm font-medium text-slate-700">First name</span>
                <input required value={form.firstName} onChange={set('firstName')} autoComplete="given-name"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </label>
              <label className="block col-span-1">
                <span className="text-sm font-medium text-slate-700">Last name</span>
                <input required value={form.lastName} onChange={set('lastName')} autoComplete="family-name"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </label>
            </div>
            <label className="block mb-3">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input required type="email" value={form.email} onChange={set('email')} autoComplete="email"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </label>
            <label className="block mb-5">
              <span className="text-sm font-medium text-slate-700">Phone</span>
              <input required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </label>
            {state.error && (
              <p className="text-red-600 text-sm mb-3" role="alert">{state.error}</p>
            )}
            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 border border-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg">
                Cancel
              </button>
              <button type="submit" disabled={state.status === 'submitting'}
                className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-bold px-4 py-2 rounded-lg">
                {state.status === 'submitting' ? 'Signing up…' : 'Sign Up'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
