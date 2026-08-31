import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import CategoryIcon from '../components/CategoryIcon.jsx'
import MapCanvas from '../components/MapCanvas.jsx'
import PoiList from '../components/PoiList.jsx'
import ScheduleList from '../components/ScheduleList.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { isWithinMap } from '../lib/venueGeo.js'
import {
  CATEGORIES,
  POIS,
  publishedPois,
  publishedSchedule,
} from '../data/eventMap.js'

export default function EventMap() {
  usePageMeta({
    title: 'Show Day Map — Parking, Shuttles & Schedule | Senoia Car Show',
    description:
      'The interactive show-day guide for the 2026 Senoia Car Show: parking and shuttles, food, restrooms, first aid, and what time everything happens on Historic Main Street.',
    path: '/map',
  })

  const pois = useMemo(publishedPois, [])
  const schedule = useMemo(publishedSchedule, [])

  // Categories that actually have published locations — an empty filter chip is
  // a dead end for the user and a lie about what's on the map.
  const categories = useMemo(
    () => CATEGORIES.filter((c) => pois.some((p) => p.category === c.id)),
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

  // MapCanvas centres the map on a selected pin, but the off-map entries (the
  // hauler lot, Non-Profit Row, the stage) have none — a ?poi= link to one of those
  // would land at the top of the page with the highlight somewhere below the fold.
  useEffect(() => {
    if (!selectedId) return
    const poi = pois.find((p) => p.id === selectedId)
    if (!poi || isWithinMap(poi.lat, poi.lon)) return
    document.getElementById(`poi-item-${selectedId}`)?.scrollIntoView({ block: 'center' })
  }, [selectedId, pois])

  // Which tab is showing also lives in the URL, so signage can QR straight to the
  // schedule (/map?view=schedule) the same way it can QR to a single pin.
  const view = searchParams.get('view') === 'schedule' ? 'schedule' : 'locations'
  const setView = (v) => {
    const next = new URLSearchParams(searchParams)
    if (v === 'schedule') next.set('view', v)
    else next.delete('view')
    setSearchParams(next, { replace: true })
  }

  // Arrow/Home/End movement between tabs, per the ARIA tabs pattern. Focus has to
  // follow the selection: with roving tabindex the old tab drops to tabIndex=-1, so
  // leaving focus on it breaks the pattern's invariant and announces nothing.
  const tabRefs = useRef({})
  const onTabKey = (e) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const next =
      e.key === 'Home'
        ? 'locations'
        : e.key === 'End'
          ? 'schedule'
          : view === 'locations'
            ? 'schedule'
            : 'locations'
    setView(next)
    tabRefs.current[next]?.focus()
  }

  // Resolved against ALL pois, not just published ones. A confirmed schedule entry can
  // point at a location we haven't pinned down yet (registration is the live case): if we
  // looked only at published pois the link would silently vanish and the visitor would be
  // told an event happens with no hint that its location is still unknown.
  const scheduleWithPois = useMemo(
    () =>
      schedule.map((entry) => {
        const poi = entry.poiId ? POIS.find((p) => p.id === entry.poiId) ?? null : null
        return {
          ...entry,
          poi: poi?.confirmed ? poi : null,
          locationPending: !!poi && !poi.confirmed,
        }
      }),
    [schedule],
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
          Where to find your way around the show, and what time everything
          happens. Spectator admission and parking are <strong>free</strong>.
        </p>

        <MapCanvas
          pois={pois}
          categories={categories}
          // On the Schedule tab the filter chips are inside the hidden panel, so a
          // filtered-down map would have no reachable control to restore it. Show
          // everything there instead.
          activeCategories={view === 'schedule' ? categories.map((c) => c.id) : active}
          selectedId={selectedId}
          onSelect={selectPoi}
        />

        {/* Two intents, one page: "where is it" and "when is it". The map stays above
            both because schedule entries link to their pin. */}
        <div
          role="tablist"
          aria-label="Show day guide"
          className="flex border-b-2 border-gold mb-6 print:hidden"
        >
          {[
            { id: 'locations', label: 'Find Your Way' },
            { id: 'schedule', label: 'Schedule' },
          ].map((t) => {
            const on = view === t.id
            return (
              <button
                key={t.id}
                ref={(el) => { tabRefs.current[t.id] = el }}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={on}
                aria-controls={`panel-${t.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setView(t.id)}
                onKeyDown={onTabKey}
                className={`min-h-11 px-5 font-display text-lg uppercase tracking-wide rounded-t-md transition-colors ${
                  on
                    ? 'bg-ink text-gold'
                    : 'text-stone-600 hover:text-ink hover:bg-gold-pale/40'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div
          role="tabpanel"
          id="panel-locations"
          aria-labelledby="tab-locations"
          tabIndex={0}
          className={view === 'locations' ? '' : 'hidden print:block'}
        >
        <div className="mb-6 print:hidden">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter locations by type">
            {categories.map((c) => {
              const on = active.includes(c.id)
              return (
                // The chips double as the map's legend, so an active chip is filled
                // with the same hue its pins use.
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  aria-pressed={on}
                  style={
                    on
                      ? {
                          backgroundColor: `var(--color-cat-${c.id})`,
                          borderColor: `var(--color-cat-${c.id})`,
                          color: 'var(--color-cream)',
                        }
                      : { color: `var(--color-cat-${c.id})` }
                  }
                  className={`inline-flex items-center gap-2 min-h-11 px-4 rounded-full border font-display uppercase tracking-wide text-sm transition-colors ${
                    on ? '' : 'bg-white border-stone-300 hover:border-stone-500'
                  }`}
                >
                  <CategoryIcon category={c.id} className="w-4 h-4" />
                  {c.label}
                </button>
              )
            })}
          </div>
          {/* Always rendered, disabled rather than removed: unmounting the control that
              was just activated drops keyboard and screen-reader focus to <body>. */}
          <button
            type="button"
            onClick={() => setActive(categories.map((c) => c.id))}
            disabled={allOn}
            className="mt-3 min-h-11 text-sm font-semibold text-ink underline underline-offset-2 hover:text-gold-dark disabled:no-underline disabled:text-stone-400 disabled:hover:text-stone-400"
          >
            Show everything
          </button>
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
          <PoiList categories={categories} pois={pois} idPrefix="poi-print" />
        </div>

        </div>

        <div
          role="tabpanel"
          id="panel-schedule"
          aria-labelledby="tab-schedule"
          tabIndex={0}
          className={view === 'schedule' ? '' : 'hidden print:block'}
        >
          <h2 className="hidden print:block font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4 mt-10">
            Show Day Schedule
          </h2>
          <ScheduleList schedule={scheduleWithPois} onSelectPoi={selectPoi} />
        </div>

        <div className="bg-ink rounded-xl p-6 text-center mt-10 print:hidden">
          <p className="font-script text-gold text-2xl mb-2">
            Planning your day?
          </p>
          <p className="text-gold-pale/90 mb-4">
            Take the whole guide with you &mdash; the map, every location and the
            schedule print onto one sheet, or save as a PDF from the print dialog.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {/* The page already has a full print stylesheet (both tab panels are
                rendered, filters are ignored, the map resets to the whole venue on
                beforeprint) — but nothing invoked it, so people asked us for a
                downloadable map that was already sitting behind Ctrl+P. */}
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-ink font-display font-semibold uppercase tracking-wider px-8 py-3 rounded-md transition-colors"
            >
              Print / Save as PDF
            </button>
            <a
              href="/flyer-2026.pdf"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto border-2 border-gold text-gold hover:bg-gold hover:text-ink font-display font-semibold uppercase tracking-wider px-8 py-[0.625rem] rounded-md transition-colors"
            >
              Download Info Flyer (PDF)
            </a>
          </div>
          <p className="mt-5 text-gold-pale/90">
            Bringing a car, a hauler, or a tent?{' '}
            <Link to="/faq" className="text-cream underline underline-offset-2 hover:text-gold-pale">
              Gate times and load-in answers
            </Link>{' '}
            are on the FAQ.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
