import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import PhotoGrid from '../components/PhotoGrid.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { ALBUMS, EDITIONS, PHOTOGRAPHER, PHOTOS } from '../data/gallery.js'

const linkOut = { target: '_blank', rel: 'noreferrer' }

// Newest first. The newest year is what /gallery shows; older years are reached
// from the switcher and live at /gallery/<year>.
const YEARS = Object.keys(EDITIONS).map(Number).sort((a, b) => b - a)
const LATEST = YEARS[0]

export default function Gallery() {
  const { year: yearParam } = useParams()
  const year = yearParam ? Number(yearParam) : LATEST
  const known = YEARS.includes(year)
  const edition = EDITIONS[year]?.edition

  // The newest year keeps the bare /gallery URL as its canonical, so /gallery/2026
  // (which also resolves) doesn't compete with it in search.
  usePageMeta({
    title: `Photo Gallery — ${year} Show Photos | Senoia Car Show`,
    description: `Photos from the ${edition} Annual Senoia Car Show, ${year}, on Historic Main Street in Senoia, Georgia — the cars, the show day crowd and the award winners.`,
    path: year === LATEST ? '/gallery' : `/gallery/${year}`,
  })

  // Group the year's hosted photos by album label, keeping first-seen order.
  // Albums with no photos never appear, so there are no empty headings.
  const groups = useMemo(() => {
    const byAlbum = new Map()
    for (const p of PHOTOS) {
      if (p.year !== year) continue
      if (!byAlbum.has(p.album)) byAlbum.set(p.album, [])
      byAlbum.get(p.album).push(p)
    }
    return [...byAlbum]
  }, [year])

  // An unknown year ("/gallery/1999") goes to the current gallery rather than
  // rendering an empty page.
  if (!known) return <Navigate to="/gallery" replace />

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-2">
          Photo <span className="text-gold">Gallery</span>
        </h1>
        <p className="font-script text-gold text-2xl mb-4">
          The {edition} Annual Senoia Car Show
        </p>
        <nav aria-label="Gallery year" className="flex flex-wrap gap-2 mb-6">
          {YEARS.map((y) => (
            <Link
              key={y}
              to={y === LATEST ? '/gallery' : `/gallery/${y}`}
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
        <p className="text-stone-700 mb-8 leading-relaxed max-w-2xl">
          Photos from show day on Historic Main Street, by{' '}
          <a className="underline font-semibold" href={PHOTOGRAPHER.url} {...linkOut}>
            {PHOTOGRAPHER.name} of {PHOTOGRAPHER.business}
          </a>
          , who generously shared them with the show. Thank you, Wayne!
        </p>

        {groups.map(([album, photos]) => (
          <section key={album} className="mb-10" aria-labelledby={`album-${year}-${album}`}>
            <h2
              id={`album-${year}-${album}`}
              className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4"
            >
              {album}
            </h2>
            <PhotoGrid photos={photos} />
          </section>
        ))}

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          Full Galleries
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {ALBUMS.map((a) => (
            <li key={a.url}>
              <a
                href={a.url}
                {...linkOut}
                className="block h-full bg-white rounded-xl border border-stone-200 hover:border-gold hover:shadow-md transition p-6"
              >
                <p className="font-display text-xl uppercase tracking-wide text-ink mb-1">
                  {a.title} →
                </p>
                <p className="text-stone-600 text-sm">{a.blurb}</p>
                <p className="text-stone-500 text-xs mt-3 uppercase tracking-wide font-display">
                  {PHOTOGRAPHER.business}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  )
}
