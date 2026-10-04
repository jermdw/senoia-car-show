import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { matchesAwardSearch } from '../lib/awards.js'
import { PHOTOGRAPHER, PHOTOS } from '../data/gallery.js'
import { WINNERS } from '../data/winners.js'

// The permanent record of each show's winners. Static data (src/data/winners.js),
// deliberately not Firestore: this page must stay free of `src/firebase.js`, and the
// live board's data is reset each year. Newest year is /history; older years are
// /history/<year>.
const YEARS = WINNERS.map((w) => w.year)
const LATEST = YEARS[0]

export default function History() {
  const { year: yearParam } = useParams()
  const year = yearParam ? Number(yearParam) : LATEST
  const entry = WINNERS.find((w) => w.year === year)

  usePageMeta({
    title: `${year} Winners — Show History | Senoia Car Show`,
    description: `Best in Show and the ${entry?.tierLabel ?? 'award'} winners from the ${entry?.edition} Annual Senoia Car Show, ${year} — part of the show's historical record.`,
    path: year === LATEST ? '/history' : `/history/${year}`,
  })

  const [term, setTerm] = useState('')
  const placed = useMemo(
    () => (entry ? entry.top.map((a, i) => ({ ...a, place: i + 1 })) : []),
    [entry],
  )
  const shown = useMemo(() => placed.filter((a) => matchesAwardSearch(a, term)), [placed, term])

  // An unknown year goes to the newest rather than rendering an empty page.
  if (!entry) return <Navigate to="/history" replace />

  const hasPhotos = PHOTOS.some((p) => p.year === year)
  const photoCredit = entry.featured.some((f) => f.photo?.includes('/gallery/'))

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-2">
          Show <span className="text-gold">History</span>
        </h1>
        <p className="font-script text-gold text-2xl mb-4">A record of every year’s winners</p>

        {YEARS.length > 1 && (
          <nav aria-label="History year" className="flex flex-wrap gap-2 mb-6">
            {YEARS.map((y) => (
              <Link
                key={y}
                to={y === LATEST ? '/history' : `/history/${y}`}
                aria-current={y === year ? 'page' : undefined}
                className={`font-display uppercase tracking-wide px-4 py-1.5 rounded-md border transition ${
                  y === year
                    ? 'bg-gold border-gold text-ink'
                    : 'border-stone-300 text-stone-700 hover:border-gold hover:text-ink'
                }`}
              >
                {y}
              </Link>
            ))}
          </nav>
        )}

        <h2 className="font-display text-3xl uppercase tracking-wide text-ink mb-1">
          {year} · The {entry.edition} Annual Show
        </h2>
        {entry.note && <p className="text-stone-700 mb-2">{entry.note}</p>}
        {hasPhotos && (
          <p className="mb-6">
            <Link
              className="underline font-semibold text-stone-800 hover:text-ink"
              to={year === LATEST ? '/gallery' : `/gallery/${year}`}
            >
              See the {year} photos →
            </Link>
          </p>
        )}

        <h3 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          Best in Show
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          {entry.featured.map((f) => (
            <article key={f.title} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              {f.photo && (
                <img
                  src={f.photo}
                  alt={`${f.vehicle}, ${f.title}`}
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover"
                />
              )}
              <div className="p-4">
                <p className="font-display text-xl uppercase tracking-wide text-gold-dark">{f.title}</p>
                <p className="text-ink text-lg">{f.vehicle}</p>
                {f.owner && <p className="text-stone-600">Owner: {f.owner}</p>}
                <p className="text-stone-500 text-sm">
                  {[f.carNumber && `Car #${f.carNumber}`, f.awardClass].filter(Boolean).join(' · ')}
                </p>
              </div>
            </article>
          ))}
        </div>
        {photoCredit && (
          <p className="text-stone-500 text-xs -mt-8 mb-10">
            Photos:{' '}
            <a className="underline" href={PHOTOGRAPHER.url} target="_blank" rel="noreferrer">
              {PHOTOGRAPHER.name}, {PHOTOGRAPHER.business}
            </a>
          </p>
        )}

        <h3 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          {entry.tierLabel}
        </h3>
        <label className="block mb-4">
          <span className="sr-only">Search the {entry.tierLabel}</span>
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by car number, make/model or owner"
            className="w-full max-w-md rounded-md border border-stone-300 bg-white px-3 py-2"
          />
        </label>
        <p className="text-stone-600 text-sm mb-3" aria-live="polite">
          {term.trim() ? `${shown.length} of ${placed.length} shown` : `${placed.length} winners, in order of placing`}
        </p>
        <ol className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-200">
          {shown.map((a) => (
            <li key={a.carNumber + a.vehicle} className="flex gap-4 p-3 sm:p-4 items-baseline">
              <span className="font-display text-xl text-gold-dark w-10 shrink-0 text-right">{a.place}</span>
              <span className="min-w-0">
                <span className="block text-ink font-semibold">{a.vehicle}</span>
                <span className="block text-stone-600 text-sm">
                  {[a.owner, a.carNumber && `Car #${a.carNumber}`, a.awardClass].filter(Boolean).join(' · ')}
                </span>
              </span>
            </li>
          ))}
        </ol>
        {shown.length === 0 && <p className="text-stone-600 mt-4">No winners match “{term}”.</p>}

        <p className="text-stone-600 mt-10 max-w-2xl">
          Results from earlier shows will be added here as the records are found.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
