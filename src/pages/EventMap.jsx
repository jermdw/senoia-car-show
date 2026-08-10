import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import CategoryIcon from '../components/CategoryIcon.jsx'
import MapCanvas from '../components/MapCanvas.jsx'
import PoiList from '../components/PoiList.jsx'
import ScheduleList from '../components/ScheduleList.jsx'
import {
  CATEGORIES,
  POIS,
  publishedPois,
  publishedSchedule,
} from '../data/eventMap.js'

export default function EventMap() {
  const pois = useMemo(publishedPois, [])
  const schedule = useMemo(publishedSchedule, [])

  // Categories that actually have published locations — an empty filter chip is
  // a dead end for the user and a lie about what's on the map.
  const categories = useMemo(
    () => CATEGORIES.filter((c) => pois.some((p) => p.category === c.id)),
    [pois],
  )

  // Categories we know will exist but can't place yet. Naming them beats leaving a
  // visitor to wonder whether the show simply has no restrooms. Disappears on its own
  // as entries are confirmed.
  const pending = useMemo(
    () =>
      CATEGORIES.filter(
        (c) =>
          !pois.some((p) => p.category === c.id) &&
          POIS.some((p) => p.category === c.id),
      ),
    [pois],
  )

  const [active, setActive] = useState(() => categories.map((c) => c.id))

  // ?poi=<id> lets a QR code on a sign deep-link straight to one location.
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('poi')

  const selectPoi = (id) => {
    const next = new URLSearchParams(searchParams)
    if (id && id !== selectedId) next.set('poi', id)
    else next.delete('poi')
    setSearchParams(next, { replace: true })
  }

  const scheduleWithPois = useMemo(
    () =>
      schedule.map((entry) => ({
        ...entry,
        poi: entry.poiId ? pois.find((p) => p.id === entry.poiId) ?? null : null,
      })),
    [schedule, pois],
  )

  const visible = pois.filter((p) => active.includes(p.category))
  const allOn = active.length === categories.length

  const toggle = (id) =>
    setActive((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-2">
          Show Day <span className="text-gold">Guide</span>
        </h1>
        <p className="font-script text-gold text-2xl mb-6">
          Saturday, September 26, 2026
        </p>
        <p className="text-stone-700 mb-8 leading-relaxed">
          Where to find everything on show day — parking and shuttles, food, the
          stage, and what time it all happens. Spectator admission and parking
          are <strong>free</strong>.
        </p>

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          Find Your Way
        </h2>

        <MapCanvas
          pois={pois}
          categories={categories}
          activeCategories={active}
          selectedId={selectedId}
          onSelect={selectPoi}
        />

        <div className="mb-6 print:hidden">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter locations by type">
            {categories.map((c) => {
              const on = active.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-2 min-h-11 px-4 rounded-full border font-display uppercase tracking-wide text-sm transition-colors ${
                    on
                      ? 'bg-ink text-gold border-ink'
                      : 'bg-white text-stone-600 border-stone-300 hover:border-gold'
                  }`}
                >
                  <CategoryIcon category={c.id} className="w-4 h-4" />
                  {c.label}
                </button>
              )
            })}
          </div>
          {!allOn && (
            <button
              type="button"
              onClick={() => setActive(categories.map((c) => c.id))}
              className="mt-3 min-h-11 text-sm font-semibold text-gold-dark underline underline-offset-2 hover:text-ink"
            >
              Show everything
            </button>
          )}
        </div>

        {/* The filtered view is for screen; print always gets the complete list,
            because a handout that silently omits half the venue is worse than none. */}
        <div className="print:hidden">
          <PoiList
            categories={categories}
            pois={visible}
            selectedId={selectedId}
            onSelect={selectPoi}
          />
        </div>
        <div className="hidden print:block">
          <PoiList categories={categories} pois={pois} />
        </div>

        {pending.length > 0 && (
          <div className="mt-6 bg-white border border-stone-200 border-l-4 border-l-gold rounded-lg p-4">
            <p className="font-display uppercase tracking-wide text-ink mb-1">
              Still to come
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              {pending.map((c) => c.label.toLowerCase()).join(', ')} — locations
              are added here as the organizers finalize the 2026 layout. Questions
              in the meantime?{' '}
              <a className="underline font-semibold" href="tel:+17707279173">
                (770) 727-9173
              </a>
              .
            </p>
          </div>
        )}

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4 mt-10">
          Show Day Schedule
        </h2>
        <ScheduleList schedule={scheduleWithPois} onSelectPoi={selectPoi} />

        <div className="bg-ink rounded-xl p-6 text-center mt-10 print:hidden">
          <p className="font-script text-gold text-2xl mb-2">
            Planning your day?
          </p>
          <a
            href="/flyer-2026.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-gold hover:bg-gold-dark text-ink font-display font-semibold uppercase tracking-wider px-8 py-3 rounded-md transition-colors"
          >
            Download Info Flyer (PDF)
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
