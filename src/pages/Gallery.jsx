import { useMemo } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import PhotoGrid from '../components/PhotoGrid.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { ALBUMS, PHOTOGRAPHER, PHOTOS } from '../data/gallery.js'

const linkOut = { target: '_blank', rel: 'noreferrer' }

export default function Gallery() {
  usePageMeta({
    title: 'Photo Gallery — 2026 Show Photos | Senoia Car Show',
    description:
      'Photos from the 21st Annual Senoia Car Show, held September 26, 2026 on Historic Main Street in Senoia, Georgia — the cars, the Top 50, and the people who made the show.',
    path: '/gallery',
  })

  // Group the hosted photos by album label, keeping first-seen order. Albums with
  // no photos never appear, so there are no empty headings.
  const groups = useMemo(() => {
    const byAlbum = new Map()
    for (const p of PHOTOS) {
      if (!byAlbum.has(p.album)) byAlbum.set(p.album, [])
      byAlbum.get(p.album).push(p)
    }
    return [...byAlbum]
  }, [])

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-2">
          Photo <span className="text-gold">Gallery</span>
        </h1>
        <p className="font-script text-gold text-2xl mb-4">The 21st Annual Senoia Car Show</p>
        <p className="text-stone-700 mb-8 leading-relaxed max-w-2xl">
          Photos from show day on Historic Main Street, by{' '}
          <a className="underline font-semibold" href={PHOTOGRAPHER.url} {...linkOut}>
            {PHOTOGRAPHER.name} of {PHOTOGRAPHER.business}
          </a>
          , who generously shared them with the show. Thank you, Wayne!
        </p>

        {groups.map(([album, photos]) => (
          <section key={album} className="mb-10" aria-labelledby={`album-${album}`}>
            <h2
              id={`album-${album}`}
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
