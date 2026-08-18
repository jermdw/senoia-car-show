import { useEffect, useMemo, useRef, useState } from 'react'
import {
  collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc, writeBatch,
} from 'firebase/firestore'
import { db, EVENT_ID } from '../firebase'
import {
  FEATURED, FEATURED_TITLES, TOP50, sortFeatured, sortTop50,
} from '../lib/awards.js'

// Admin-only, and it imports `src/firebase.js` — only `pages/Admin.jsx` may
// pull this in, or the Firebase SDK lands back in the chunk every spectator
// downloads. See the note in AppRoutes.jsx.

const BLANK_AWARD = { carNumber: '', vehicle: '', owner: '', awardClass: '', title: '', photoUrl: '' }

/**
 * Show-day awards entry. Split out from the volunteer dashboard on purpose:
 * this is used once a year, standing next to the stage, on a phone, while
 * names are being read out — so the quick-add row keeps focus and keeps the
 * tier between entries rather than resetting to a default.
 *
 * Nothing here touches `spotsFilled`, so plain writes are safe; the
 * transaction rule applies only to the shift counters.
 */
export default function AwardsAdmin() {
  const [awards, setAwards] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => onSnapshot(
    collection(db, 'events', EVENT_ID, 'awards'),
    (snap) => {
      setAwards(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoadError(false)
    },
    (err) => {
      console.error('awards listener failed', err)
      setLoadError(true)
    },
  ), [])

  const featured = useMemo(
    () => sortFeatured((awards ?? []).filter((a) => a.tier === FEATURED)),
    [awards],
  )
  // Anything not explicitly a featured trophy belongs on the numbered list,
  // so a row saved with a missing tier still shows up somewhere.
  const top50 = useMemo(
    () => sortTop50((awards ?? []).filter((a) => a.tier !== FEATURED)),
    [awards],
  )
  const staged = useMemo(() => (awards ?? []).filter((a) => !a.announced), [awards])
  const nextSortOrder = Math.max(0, ...(awards ?? []).map((a) => a.sortOrder ?? 0)) + 1

  async function setAnnounced(award, announced) {
    try {
      await updateDoc(doc(db, 'events', EVENT_ID, 'awards', award.id), { announced })
    } catch (e) {
      console.error('announce award failed', e)
      alert('That didn’t save. Check your connection and try again.')
    }
  }

  // Publishing is per-group, never global: the Best in Show trophies are the
  // finale, and a single "publish everything" button would put them on the
  // board along with the Top 50 — spoiling the exact reveal that staging
  // exists to protect.
  async function publishGroup(rows, label) {
    const pending = rows.filter((a) => !a.announced)
    if (pending.length === 0) return
    if (!confirm(
      `Publish ${pending.length} staged ${label} ${pending.length === 1 ? 'award' : 'awards'} to the public board now?`,
    )) return
    try {
      // Well under the 500-write batch limit — the board is fifty-odd rows
      // typed by hand. One batch, because a partial publish would put half a
      // category on the board while the announcer reads the other half.
      const batch = writeBatch(db)
      for (const a of pending) {
        batch.update(doc(db, 'events', EVENT_ID, 'awards', a.id), { announced: true })
      }
      await batch.commit()
    } catch (e) {
      console.error('publish staged awards failed', e)
      alert('Publishing failed. Check your connection and try again.')
    }
  }

  async function removeAward(award) {
    if (!confirm(`Delete "${award.vehicle || award.title || 'this award'}"?`)) return
    try {
      await deleteDoc(doc(db, 'events', EVENT_ID, 'awards', award.id))
    } catch (e) {
      console.error('delete award failed', e)
      alert('Deleting failed. Check your connection and try again.')
    }
  }

  if (loadError) {
    return (
      <main className="max-w-4xl mx-auto p-4">
        <p className="text-red-600 font-semibold py-12 text-center" role="alert">
          Couldn't load the awards. Check your connection and refresh.
        </p>
      </main>
    )
  }

  const liveCount = (awards ?? []).length - staged.length

  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg border border-stone-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h2 className="font-display uppercase tracking-wide text-ink flex-1">Add a winner</h2>
          {awards && (
            <span className="text-sm text-stone-600">{liveCount} live · {staged.length} staged</span>
          )}
        </div>
        <QuickAdd nextSortOrder={nextSortOrder} />
        <p className="text-stone-500 text-xs mt-3">
          Staged rows are invisible to the public until published — enter the
          judges' sheet ahead of time, then publish as each category is called.
          Owner names are printed on the public board, so use the announcer's
          form (first name and last initial).
        </p>
      </div>

      {!awards ? (
        <p className="text-center text-stone-500 py-12">Loading…</p>
      ) : awards.length === 0 ? (
        <p className="text-center text-stone-500 py-12">
          No awards entered yet. The public board shows a “winners post here at
          3:00 PM” notice until the first one is published.
        </p>
      ) : (
        <>
          <AwardGroup title="Featured trophies" rows={featured}
            onPublishAll={() => publishGroup(featured, 'featured')}
            onToggle={setAnnounced} onEdit={setEditing} onDelete={removeAward} />
          <AwardGroup title="Top 50" rows={top50}
            onPublishAll={() => publishGroup(top50, 'Top 50')}
            onToggle={setAnnounced} onEdit={setEditing} onDelete={removeAward} />
        </>
      )}

      <p className="text-center mt-6">
        <a href="/awards" target="_blank" rel="noreferrer" className="text-stone-500 underline text-sm">
          Open the public board ↗
        </a>
      </p>

      {editing && <AwardEditor award={editing} onClose={() => setEditing(null)} />}
    </main>
  )
}

function AwardGroup({ title, rows, onPublishAll, onToggle, onEdit, onDelete }) {
  if (rows.length === 0) return null
  const stagedCount = rows.filter((a) => !a.announced).length
  return (
    <section className="mb-6">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h3 className="font-display uppercase tracking-wide text-stone-600 text-sm flex-1">
          {title} ({rows.length})
        </h3>
        {stagedCount > 0 && (
          <button
            onClick={onPublishAll}
            className="bg-gold text-ink font-semibold px-4 py-1.5 rounded-lg text-sm"
          >
            Publish {stagedCount} staged
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {rows.map((a) => (
          <li key={a.id} className="bg-white rounded-lg border border-stone-200 p-3 flex flex-wrap items-center gap-2">
            <span className="font-display text-gold-dark w-12 shrink-0 tabular-nums">
              {a.carNumber || '—'}
            </span>
            <span className="flex-1 min-w-[12rem]">
              {a.title && <span className="font-semibold text-ink mr-2">{a.title}</span>}
              <span className="text-stone-800">{a.vehicle}</span>
              {a.owner && <span className="text-stone-500 text-sm ml-2">{a.owner}</span>}
              {a.awardClass && <span className="text-stone-400 text-sm ml-2">{a.awardClass}</span>}
            </span>
            <button
              onClick={() => onToggle(a, !a.announced)}
              aria-pressed={!!a.announced}
              className={`text-sm font-semibold rounded-full px-3 py-1 ${
                a.announced ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-500'
              }`}
            >
              {a.announced ? 'Live' : 'Staged'}
            </button>
            <button onClick={() => onEdit(a)} className="text-stone-500 underline text-sm">Edit</button>
            <button onClick={() => onDelete(a)} className="text-red-500 underline text-sm">Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function QuickAdd({ nextSortOrder }) {
  // Tier and the publish switch persist across adds — an organizer entering
  // the Top 50 sets them once and then types fifty rows.
  const [tier, setTier] = useState(TOP50)
  const [publishNow, setPublishNow] = useState(false)
  const [form, setForm] = useState(BLANK_AWARD)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const firstField = useRef(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function add(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await setDoc(doc(db, 'events', EVENT_ID, 'awards', crypto.randomUUID().slice(0, 8)), {
        tier,
        title: tier === FEATURED ? form.title.trim() : '',
        carNumber: form.carNumber.trim(),
        vehicle: form.vehicle.trim(),
        owner: form.owner.trim(),
        awardClass: form.awardClass.trim(),
        photoUrl: tier === FEATURED ? form.photoUrl.trim() : '',
        announced: publishNow,
        sortOrder: nextSortOrder,
      })
      setForm(BLANK_AWARD)
      firstField.current?.focus()
    } catch (err) {
      console.error('add award failed', err)
      setError('Saving failed. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={add} className="space-y-2">
      {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          aria-label="Award tier"
          className="rounded-lg border border-stone-300 px-3 py-2 bg-white"
        >
          <option value={TOP50}>Top 50</option>
          <option value={FEATURED}>Featured trophy</option>
        </select>
        <input
          ref={firstField}
          value={form.carNumber}
          onChange={set('carNumber')}
          placeholder="Car #"
          aria-label="Car number"
          className="w-24 rounded-lg border border-stone-300 px-3 py-2"
        />
        <input
          required
          value={form.vehicle}
          onChange={set('vehicle')}
          placeholder="1957 Chevrolet Bel Air"
          aria-label="Year, make and model"
          className="flex-1 min-w-[14rem] rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          value={form.owner}
          onChange={set('owner')}
          placeholder="Owner (John D.)"
          aria-label="Owner"
          className="flex-1 min-w-[10rem] rounded-lg border border-stone-300 px-3 py-2"
        />
        <input
          value={form.awardClass}
          onChange={set('awardClass')}
          placeholder="Class (optional)"
          aria-label="Class"
          className="flex-1 min-w-[10rem] rounded-lg border border-stone-300 px-3 py-2"
        />
      </div>
      {tier === FEATURED && (
        <div className="flex flex-wrap gap-2">
          <input
            required
            list="featured-titles"
            value={form.title}
            onChange={set('title')}
            placeholder="Trophy name"
            aria-label="Trophy name"
            className="flex-1 min-w-[12rem] rounded-lg border border-stone-300 px-3 py-2"
          />
          <datalist id="featured-titles">
            {FEATURED_TITLES.map((t) => <option key={t} value={t} />)}
          </datalist>
          <input
            type="url"
            value={form.photoUrl}
            onChange={set('photoUrl')}
            placeholder="Photo URL (optional)"
            aria-label="Photo URL"
            className="flex-1 min-w-[12rem] rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={publishNow}
            onChange={(e) => setPublishNow(e.target.checked)}
            className="w-4 h-4"
          />
          Publish immediately
        </label>
        <button
          type="submit"
          disabled={saving}
          className="bg-ink disabled:opacity-60 text-white font-bold px-6 py-2 rounded-lg"
        >
          {saving ? 'Adding…' : 'Add'}
        </button>
      </div>
    </form>
  )
}

function AwardEditor({ award, onClose }) {
  // `tier` is not in BLANK_AWARD (QuickAdd holds it as its own state), and an
  // older document may predate the field — without this the select goes
  // uncontrolled and the save sends `tier: undefined`, which updateDoc rejects.
  const [form, setForm] = useState({ ...BLANK_AWARD, ...award, tier: award.tier ?? TOP50 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const safeClose = () => { if (!saving) onClose() }

  // Escape closes the dialog; no dep array so the handler always sees the
  // current `saving` guard (mirrors ShiftEditor).
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') safeClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      // `announced` is deliberately absent: publishing is the row's Live/Staged
      // toggle, so opening this dialog to fix a typo can never put an
      // un-announced winner on the board.
      await updateDoc(doc(db, 'events', EVENT_ID, 'awards', award.id), {
        tier: form.tier,
        title: form.tier === FEATURED ? form.title.trim() : '',
        carNumber: form.carNumber.trim(),
        vehicle: form.vehicle.trim(),
        owner: form.owner.trim(),
        awardClass: form.awardClass.trim(),
        photoUrl: form.tier === FEATURED ? form.photoUrl.trim() : '',
      })
      onClose()
    } catch (err) {
      console.error('save award failed', err)
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
        aria-label="Edit award"
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-3 max-h-[90vh] overflow-y-auto my-auto"
      >
        <h2 className="text-lg font-bold text-ink">Edit Award</h2>
        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Tier</span>
          <select value={form.tier} onChange={set('tier')}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 bg-white">
            <option value={TOP50}>Top 50</option>
            <option value={FEATURED}>Featured trophy</option>
          </select>
        </label>
        {form.tier === FEATURED && (
          <>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Trophy name</span>
              <input required value={form.title} onChange={set('title')}
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Photo URL (optional)</span>
              <input type="url" value={form.photoUrl} onChange={set('photoUrl')}
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
            </label>
          </>
        )}
        <div className="grid grid-cols-3 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Car #</span>
            <input value={form.carNumber} onChange={set('carNumber')}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
          </label>
          <label className="block col-span-2">
            <span className="text-sm font-medium text-stone-700">Year, make &amp; model</span>
            <input required autoFocus value={form.vehicle} onChange={set('vehicle')}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Owner (shown publicly)</span>
          <input value={form.owner} onChange={set('owner')} placeholder="John D."
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Class</span>
          <input value={form.awardClass} onChange={set('awardClass')}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" />
        </label>
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
