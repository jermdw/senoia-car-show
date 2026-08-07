import { useEffect, useMemo, useState } from 'react'
import {
  collection, deleteDoc, doc, onSnapshot, query, runTransaction, setDoc, updateDoc, where, increment,
} from 'firebase/firestore'
import {
  GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut,
} from 'firebase/auth'
import { db, auth, EVENT_ID } from '../firebase'
import logoLight from '../assets/logo-light-bg.png'

export default function Admin() {
  const [user, setUser] = useState(undefined)

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  if (user === undefined) return <Centered>Loading…</Centered>
  if (!user) return <SignIn />
  return <Dashboard user={user} />
}

function Centered({ children }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-stone-500">
      {children}
    </div>
  )
}

function SignIn() {
  const [error, setError] = useState(null)
  async function go() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (e) {
      // Dismissing the popup isn't an error worth showing
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return
      setError('Sign-in failed. Please try again.')
      console.error('sign-in failed', e)
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
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button onClick={go} className="bg-ink text-white font-semibold px-6 py-3 rounded-lg w-full">
          Sign in with Google
        </button>
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
    const rows = [['What', 'When', 'Credits', 'Volunteer First Name', 'Volunteer Last Name', 'Email', 'Phone']]
    for (const shift of sorted) {
      const roster = signupsByShift[shift.id] ?? []
      // A shift can hold more signups than spotsTotal if an admin shrank it —
      // never drop volunteers from the export.
      for (let i = 0; i < Math.max(shift.spotsTotal, roster.length); i++) {
        const v = roster[i]
        rows.push([shift.role, shift.time, '', v?.firstName ?? '', v?.lastName ?? '', v?.email ?? '', v?.phone ?? ''])
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
        const snap = await t.get(doc(db, 'signups', signup.id))
        if (!snap.exists() || snap.data().status !== 'active') return
        t.update(snap.ref, { status: 'cancelled' })
        t.update(doc(db, 'events', EVENT_ID, 'shifts', signup.shiftId), { spotsFilled: increment(-1) })
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
        <span className="text-stone-300 text-sm">{totalFilled} / {totalSpots} spots filled</span>
        <button onClick={exportCsv} className="bg-gold text-ink font-semibold px-4 py-2 rounded-lg text-sm">
          Export CSV
        </button>
        <button onClick={() => setEditing('new')} className="bg-white/10 px-4 py-2 rounded-lg text-sm">
          + Add Shift
        </button>
        <button onClick={() => signOut(auth)} className="text-stone-400 underline text-sm">Sign out</button>
      </header>

      <main className="max-w-4xl mx-auto p-4">
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
                    <button onClick={() => setEditing(shift)} className="text-stone-500 underline text-sm">Edit</button>
                    <button onClick={() => deleteShift(shift)} className="text-red-500 underline text-sm">Delete</button>
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
                                <td className="py-1 text-right">
                                  <button onClick={() => removeVolunteer(v)} className="text-red-500 underline">
                                    Remove
                                  </button>
                                </td>
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
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-3 max-h-[90vh] overflow-y-auto my-auto"
      >
        <h2 className="text-lg font-bold text-ink">{shift ? 'Edit Shift' : 'New Shift'}</h2>
        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Role</span>
          <input required value={form.role} onChange={set('role')}
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
