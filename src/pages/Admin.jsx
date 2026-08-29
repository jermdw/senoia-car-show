import { useEffect, useMemo, useRef, useState } from 'react'
import {
  collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, runTransaction, setDoc, updateDoc, where,
} from 'firebase/firestore'
import {
  GoogleAuthProvider, isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail,
  signInWithEmailLink, signInWithPopup, signOut,
} from 'firebase/auth'
import { db, auth, EVENT_ID } from '../firebase'
import logoLight from '../assets/logo-light-bg.webp'
import { SHIRT_SIZES } from '../shirtSizes.js'
import usePageMeta from '../lib/usePageMeta.js'
import AwardsAdmin from '../components/AwardsAdmin.jsx'

const EMAIL_LINK_KEY = 'scsEmailForSignIn'

export default function Admin() {
  usePageMeta({
    title: 'Organizer Dashboard | Senoia Car Show',
    description: 'Organizer dashboard for Senoia Car Show volunteer sign-ups.',
    noindex: true,
  })

  const [user, setUser] = useState(undefined)
  const [linkError, setLinkError] = useState(null)
  // Set synchronously so the sign-in form never flashes while the link is
  // being redeemed — the redemption round-trip outlives the auth state check.
  const [completing, setCompleting] = useState(() =>
    isSignInWithEmailLink(auth, window.location.href),
  )
  const redeeming = useRef(false)

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  // Complete a magic-link sign-in when the user lands here from their email
  useEffect(() => {
    // The code is single-use, so it must not be redeemed twice (StrictMode
    // double-invokes effects in development).
    if (!completing || redeeming.current) return
    redeeming.current = true
    // The email is stored before the link is sent; if the link is opened on a
    // different device the browser has no record of it, so ask.
    const email =
      window.localStorage.getItem(EMAIL_LINK_KEY) ||
      window.prompt('Confirm your email address to finish signing in:')
    if (!email) {
      window.history.replaceState(null, '', '/admin')
      setCompleting(false)
      return
    }
    signInWithEmailLink(auth, email.trim(), window.location.href)
      .then(() => window.localStorage.removeItem(EMAIL_LINK_KEY))
      .catch((e) => {
        console.error('email link sign-in failed', e)
        setLinkError(
          e.code === 'auth/invalid-action-code'
            ? 'This sign-in link has expired or was already used. Request a new one below.'
            : 'Signing in with that link failed. Request a new one below.',
        )
      })
      .finally(() => {
        window.history.replaceState(null, '', '/admin')
        setCompleting(false)
      })
  }, [completing])

  if (completing) return <Centered>Signing you in…</Centered>
  if (user === undefined) return <Centered>Loading…</Centered>
  if (!user) return <SignIn linkError={linkError} onClearLinkError={() => setLinkError(null)} />
  return <Dashboard user={user} />
}

function Centered({ children }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-stone-500">
      {children}
    </div>
  )
}

function SignIn({ linkError, onClearLinkError }) {
  const [error, setError] = useState(null)
  const [email, setEmail] = useState('')
  const [linkState, setLinkState] = useState('idle') // idle | sending | sent

  // The expired-link notice belongs to the previous attempt; starting a new
  // one must clear it, or a fresh link is reported as expired.
  function resetErrors() {
    setError(null)
    onClearLinkError()
  }

  async function google() {
    resetErrors()
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (e) {
      // Dismissing the popup isn't an error worth showing
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return
      setError('Sign-in failed. Please try again.')
      console.error('sign-in failed', e)
    }
  }

  async function sendLink(e) {
    e.preventDefault()
    resetErrors()
    setLinkState('sending')
    const addr = email.trim().toLowerCase()
    // Stored before sending: a storage failure here (private browsing) must
    // not be reported as a send failure once the email is already out.
    try {
      window.localStorage.setItem(EMAIL_LINK_KEY, addr)
    } catch (err) {
      console.warn('could not remember email for sign-in link', err)
    }
    try {
      await sendSignInLinkToEmail(auth, addr, {
        url: `${window.location.origin}/admin`,
        handleCodeInApp: true,
      })
      setLinkState('sent')
    } catch (err) {
      console.error('send sign-in link failed', err)
      setError('Sending the sign-in link failed. Check the email address and try again.')
      setLinkState('idle')
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center">
        <img src={logoLight} alt="The Senoia Car Show" className="w-36 mx-auto mb-4" />
        <h1 className="text-xl font-display font-semibold uppercase tracking-wide text-ink mb-1">
          Organizer Dashboard
        </h1>
        <p className="text-stone-500 text-sm mb-6">Senoia Car Show 2026</p>
        {(error ?? linkError) && (
          <p className="text-red-600 text-sm mb-3" role="alert">{error ?? linkError}</p>
        )}
        <button onClick={google} className="bg-ink text-white font-semibold px-6 py-3 rounded-lg w-full">
          Sign in with Google
        </button>
        <div className="flex items-center gap-3 my-5 text-stone-400 text-xs uppercase tracking-widest">
          <span className="flex-1 border-t border-stone-200" />
          or
          <span className="flex-1 border-t border-stone-200" />
        </div>
        {linkState === 'sent' ? (
          <p className="text-stone-600 text-sm">
            Check your email — we sent a sign-in link to <strong>{email.trim()}</strong>.
            Open it on this device to finish signing in.
          </p>
        ) : (
          <form onSubmit={sendLink}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="submit"
              disabled={linkState === 'sending'}
              className="border border-ink text-ink font-semibold px-6 py-3 rounded-lg w-full disabled:opacity-60"
            >
              {linkState === 'sending' ? 'Sending…' : 'Email me a sign-in link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function Dashboard({ user }) {
  const [shifts, setShifts] = useState(null)
  const [signups, setSignups] = useState(null)
  const [denied, setDenied] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [editing, setEditing] = useState(null) // shift object or 'new'
  const [openRoster, setOpenRoster] = useState(null) // shiftId
  const [tab, setTab] = useState('volunteers') // volunteers | awards
  // Defaults to read-only until the admin doc loads, so edit controls never
  // flash on for a viewer before their role is known.
  const [role, setRole] = useState(null)
  const isViewer = role !== 'admin'

  useEffect(() => {
    getDoc(doc(db, 'admins', user.email))
      .then((snap) => setRole(snap.exists() ? snap.data().role : null))
      .catch((err) => {
        console.error('role lookup failed', err)
        setRole(null)
      })
  }, [user.email])

  useEffect(() => {
    // Only permission-denied means "not an organizer" — anything else
    // (offline, missing index, backend outage) is a load failure.
    const onError = (err) => {
      console.error('admin listener failed', err)
      if (err.code === 'permission-denied') setDenied(true)
      else setLoadError(true)
    }
    const unsub1 = onSnapshot(
      query(collection(db, 'events', EVENT_ID, 'shifts')),
      (snap) => setShifts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      onError,
    )
    const unsub2 = onSnapshot(
      query(collection(db, 'signups'), where('eventId', '==', EVENT_ID), where('status', '==', 'active')),
      (snap) => setSignups(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      onError,
    )
    return () => { unsub1(); unsub2() }
  }, [])

  const signupsByShift = useMemo(() => {
    const m = {}
    for (const s of signups ?? []) (m[s.shiftId] ||= []).push(s)
    return m
  }, [signups])

  const sorted = useMemo(
    () => [...(shifts ?? [])].sort((a, b) => a.day.localeCompare(b.day) || a.sortOrder - b.sortOrder),
    [shifts],
  )

  // What organizers actually need to place the shirt order. A volunteer can
  // hold several shifts, so this counts shirts (one per signup), not people.
  const shirtCounts = useMemo(() => {
    const counts = new Map(SHIRT_SIZES.map((s) => [s, 0]))
    let unknown = 0
    for (const v of signups ?? []) {
      if (counts.has(v.shirtSize)) counts.set(v.shirtSize, counts.get(v.shirtSize) + 1)
      else unknown++
    }
    return { counts, unknown }
  }, [signups])

  if (denied) {
    return (
      <Centered>
        <div className="text-center">
          <p className="text-stone-700 font-semibold mb-2">
            {user.email} doesn't have organizer access.
          </p>
          <button onClick={() => signOut(auth)} className="underline text-stone-500">Sign out</button>
        </div>
      </Centered>
    )
  }

  if (loadError) {
    return (
      <Centered>
        <p className="text-red-600 font-semibold" role="alert">
          Couldn't load the dashboard. Check your connection and refresh.
        </p>
      </Centered>
    )
  }

  function exportCsv() {
    // Shirt Size is appended so the leading columns still match the old
    // volunteersignup.org export the organizers are used to.
    const rows = [['What', 'When', 'Credits', 'Volunteer First Name', 'Volunteer Last Name', 'Email', 'Phone', 'Shirt Size']]
    for (const shift of sorted) {
      const roster = signupsByShift[shift.id] ?? []
      // A shift can hold more signups than spotsTotal if an admin shrank it —
      // never drop volunteers from the export.
      for (let i = 0; i < Math.max(shift.spotsTotal, roster.length); i++) {
        const v = roster[i]
        rows.push([shift.role, shift.time, '', v?.firstName ?? '', v?.lastName ?? '', v?.email ?? '', v?.phone ?? '', v?.shirtSize ?? ''])
      }
    }
    // An active signup whose shift was deleted is still a real volunteer (and
    // still owes a shirt) — export it under a placeholder rather than let the
    // printed roster disagree with the on-screen totals.
    const knownShiftIds = new Set(sorted.map((s) => s.id))
    for (const v of signups ?? []) {
      if (!knownShiftIds.has(v.shiftId)) {
        rows.push(['(deleted shift)', '', '', v.firstName, v.lastName, v.email, v.phone, v.shirtSize ?? ''])
      }
    }
    const csv = rows
      .map((r) => r.map((c) => {
        let s = String(c)
        // Neutralize spreadsheet formula injection from volunteer-supplied text
        if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
        return `"${s.replaceAll('"', '""')}"`
      }).join(','))
      .join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `senoia-car-show-signups-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function removeVolunteer(signup) {
    if (!confirm(`Remove ${signup.firstName} ${signup.lastName} from this shift?`)) return
    try {
      // Transaction guards the counter: a double-click or a race with the
      // volunteer's own cancel link must not decrement twice.
      await runTransaction(db, async (t) => {
        const shiftRef = doc(db, 'events', EVENT_ID, 'shifts', signup.shiftId)
        const [snap, shiftSnap] = await Promise.all([
          t.get(doc(db, 'signups', signup.id)),
          t.get(shiftRef),
        ])
        if (!snap.exists() || snap.data().status !== 'active') return
        t.update(snap.ref, { status: 'cancelled' })
        // The shift may have been deleted out from under this signup — the
        // removal must still succeed, and the counter must never go below
        // zero (mirrors cancelSignup in functions/index.js).
        if (shiftSnap.exists()) {
          t.update(shiftRef, { spotsFilled: Math.max(0, (shiftSnap.data().spotsFilled ?? 0) - 1) })
        }
      })
    } catch (e) {
      console.error('remove volunteer failed', e)
      alert('Removing the volunteer failed. Check your connection and try again.')
    }
  }

  async function deleteShift(shift) {
    const roster = signupsByShift[shift.id] ?? []
    if (roster.length > 0) {
      alert('This shift has active signups. Remove the volunteers first.')
      return
    }
    if (!confirm(`Delete shift "${shift.role} (${shift.time})"?`)) return
    try {
      // Re-check against the server right before deleting: the local snapshot
      // can be stale, and a volunteer may have signed up while the confirm
      // dialog was open. An orphaned active signup corrupts the totals.
      const fresh = await getDocs(query(
        collection(db, 'signups'),
        where('shiftId', '==', shift.id),
        where('status', '==', 'active'),
      ))
      if (!fresh.empty) {
        alert('This shift has active signups. Remove the volunteers first.')
        return
      }
      await deleteDoc(doc(db, 'events', EVENT_ID, 'shifts', shift.id))
    } catch (e) {
      console.error('delete shift failed', e)
      alert('Deleting the shift failed. Check your connection and try again.')
    }
  }

  const totalFilled = (signups ?? []).length
  const totalSpots = (shifts ?? []).reduce((n, s) => n + s.spotsTotal, 0)

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-ink text-white px-6 py-4 flex flex-wrap items-center gap-3">
        <h1 className="font-bold text-lg flex-1">Senoia Car Show — Organizer Dashboard</h1>
        {/* Shift tools belong to the volunteer view; on the awards tab they
            would act on a list that isn't on screen. */}
        {tab === 'volunteers' && (
          <>
            <span className="text-stone-300 text-sm">{totalFilled} / {totalSpots} spots filled</span>
            <button onClick={exportCsv} className="bg-gold text-ink font-semibold px-4 py-2 rounded-lg text-sm">
              Export CSV
            </button>
            {!isViewer && (
              <button onClick={() => setEditing('new')} className="bg-white/10 px-4 py-2 rounded-lg text-sm">
                + Add Shift
              </button>
            )}
          </>
        )}
        <button onClick={() => signOut(auth)} className="text-stone-400 underline text-sm">Sign out</button>
      </header>

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 flex gap-1">
          {[['volunteers', 'Volunteers'], !isViewer && ['awards', 'Awards']].filter(Boolean).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={`px-4 py-3 font-display uppercase tracking-wide text-sm border-b-2 -mb-px ${
                tab === id ? 'border-gold text-ink' : 'border-transparent text-stone-500 hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'awards' ? <AwardsAdmin /> : (
      <main className="max-w-4xl mx-auto p-4">
        {signups && totalFilled > 0 && (
          <div className="bg-white rounded-lg border border-stone-200 p-3 mb-4 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink text-sm mr-1">Shirt order:</span>
            {SHIRT_SIZES.map((size) => (
              <span key={size} className="text-sm bg-stone-100 rounded px-2 py-1">
                <span className="font-semibold text-ink">{size}</span>{' '}
                <span className="text-stone-600">{shirtCounts.counts.get(size)}</span>
              </span>
            ))}
            {shirtCounts.unknown > 0 && (
              <span className="text-sm text-stone-500">
                ({shirtCounts.unknown} signed up before sizes were collected)
              </span>
            )}
          </div>
        )}
        {!shifts || !signups ? (
          <p className="text-center text-stone-500 py-12">Loading…</p>
        ) : (
          <ul className="space-y-2">
            {sorted.map((shift) => {
              const roster = signupsByShift[shift.id] ?? []
              const open = openRoster === shift.id
              return (
                <li key={shift.id} className="bg-white rounded-lg border border-stone-200">
                  <div className="p-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setOpenRoster(open ? null : shift.id)}
                      className="flex-1 text-left min-w-[14rem]"
                    >
                      <span className="font-semibold text-ink">{shift.role}</span>
                      <span className="text-stone-500 text-sm ml-2">{shift.time}</span>
                    </button>
                    <span className={`text-sm font-semibold rounded-full px-3 py-1 ${
                      roster.length >= shift.spotsTotal ? 'bg-green-100 text-green-800' : 'bg-gold-pale text-gold-dark'
                    }`}>
                      {roster.length} / {shift.spotsTotal}
                    </span>
                    {!isViewer && (
                      <>
                        <button onClick={() => setEditing(shift)} className="text-stone-500 underline text-sm">Edit</button>
                        <button onClick={() => deleteShift(shift)} className="text-red-500 underline text-sm">Delete</button>
                      </>
                    )}
                  </div>
                  {open && (
                    <div className="border-t border-stone-100 p-3">
                      {roster.length === 0 ? (
                        <p className="text-stone-400 text-sm">No signups yet.</p>
                      ) : (
                        <table className="w-full text-sm">
                          <tbody>
                            {roster.map((v) => (
                              <tr key={v.id} className="border-b border-stone-50 last:border-0">
                                <td className="py-1 pr-3 font-medium text-stone-800">{v.firstName} {v.lastName}</td>
                                <td className="py-1 pr-3 text-stone-500">{v.email}</td>
                                <td className="py-1 pr-3 text-stone-500">{v.phone}</td>
                                <td className="py-1 pr-3">
                                  {v.shirtSize ? (
                                    <span className="inline-block bg-gold-pale text-gold-dark font-semibold rounded px-2 py-0.5 text-xs">
                                      {v.shirtSize}
                                    </span>
                                  ) : (
                                    <span className="text-stone-300 text-xs">—</span>
                                  )}
                                </td>
                                {!isViewer && (
                                  <td className="py-1 text-right">
                                    <button onClick={() => removeVolunteer(v)} className="text-red-500 underline">
                                      Remove
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </main>
      )}

      {editing && (
        <ShiftEditor
          shift={editing === 'new' ? null : editing}
          activeCount={editing === 'new' ? 0 : (signupsByShift[editing.id]?.length ?? 0)}
          maxSortOrder={Math.max(0, ...(shifts ?? []).map((s) => s.sortOrder))}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function ShiftEditor({ shift, activeCount, maxSortOrder, onClose }) {
  const [form, setForm] = useState(
    shift ?? { role: '', time: '', day: '2026-09-26', spotsTotal: 2, category: '' },
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const safeClose = () => { if (!saving) onClose() }

  // Escape closes the dialog; no dep array so the handler always sees the
  // current `saving` guard.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') safeClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  async function save(e) {
    e.preventDefault()
    const spotsTotal = Number(form.spotsTotal)
    if (spotsTotal < activeCount) {
      setError(`This shift already has ${activeCount} volunteers — spots can't be lower than that.`)
      return
    }
    setSaving(true)
    setError(null)
    const data = {
      role: form.role.trim(),
      time: form.time.trim(),
      day: form.day,
      category: form.category?.trim() ?? '',
      spotsTotal,
    }
    try {
      if (shift) {
        await updateDoc(doc(db, 'events', EVENT_ID, 'shifts', shift.id), data)
      } else {
        const id = crypto.randomUUID().slice(0, 8)
        await setDoc(doc(db, 'events', EVENT_ID, 'shifts', id), {
          ...data,
          spotsFilled: 0,
          sortOrder: maxSortOrder + 1,
        })
      }
      onClose()
    } catch (err) {
      console.error('save shift failed', err)
      setError('Saving failed. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={safeClose}>
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={shift ? 'Edit shift' : 'New shift'}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-3 max-h-[90vh] overflow-y-auto my-auto"
      >
        <h2 className="text-lg font-bold text-ink">{shift ? 'Edit Shift' : 'New Shift'}</h2>
        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Role</span>
          <input required autoFocus value={form.role} onChange={set('role')}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Time (shown to volunteers)</span>
          <input required value={form.time} onChange={set('time')} placeholder="9/26 - 9:00AM - 12:00PM"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Day</span>
            <select value={form.day} onChange={set('day')}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 bg-white">
              <option value="2026-09-25">Fri 9/25 (Setup)</option>
              <option value="2026-09-26">Sat 9/26 (Show)</option>
              <option value="2026-09-27">Sun 9/27 (Cleanup)</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Spots</span>
            <input required type="number" min="1" value={form.spotsTotal} onChange={set('spotsTotal')}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={safeClose}
            className="flex-1 border border-stone-300 text-stone-700 font-semibold px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 bg-ink disabled:opacity-60 text-white font-bold px-4 py-2 rounded-lg">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
