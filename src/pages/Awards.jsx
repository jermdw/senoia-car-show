import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db, EVENT_ID } from '../firebase'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { ClockMark, Medallion, SearchMark, TrophyMark } from '../components/AwardArt.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { hasPassedOnShowDay } from '../lib/showTime.js'
import {
  FEATURED,
  matchesAwardSearch,
  sortFeatured,
  sortTop50,
} from '../lib/awards.js'

// Matches the 3:00pm entry and the `stage` pin in `src/data/eventMap.js`. Kept
// literal here in line with the rest of the site's hardcoded event facts —
// importing the whole POI list to read two strings costs every spectator the
// map data on a page that has no map.
const CEREMONY_TIME = '15:00'
const CEREMONY_LABEL = '3:00 PM'
const CEREMONY_PLACE = 'The Stage — bottom of the hill, by the gazebo'

// The board is a passive display: nobody reloads it during the ceremony, so
// the "announcing now" state has to arrive on its own.
const TICK_MS = 30_000

export default function Awards() {
  usePageMeta({
    title: '2026 Award Winners | Senoia Car Show',
    description:
      'Live results from the 21st Annual Senoia Car Show awards ceremony — Top 50 winners plus Best in Show Car and Truck, posted as they are announced from the stage on September 26, 2026.',
    path: '/awards',
  })

  const [awards, setAwards] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [term, setTerm] = useState('')
  const [ceremonyStarted, setCeremonyStarted] = useState(() =>
    hasPassedOnShowDay(CEREMONY_TIME),
  )

  useEffect(() => {
    const id = setInterval(
      () => setCeremonyStarted(hasPassedOnShowDay(CEREMONY_TIME)),
      TICK_MS,
    )
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    // The `announced` filter is not a nicety — the security rules reject an
    // unfiltered read, so that staged results stay off the board until the
    // organizers read them out. See firestore.rules.
    const q = query(
      collection(db, 'events', EVENT_ID, 'awards'),
      where('announced', '==', true),
    )
    return onSnapshot(
      q,
      (snap) => {
        setAwards(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoadError(false)
      },
      (err) => {
        console.error('awards listener failed', err)
        setLoadError(true)
      },
    )
  }, [])

  const featured = useMemo(
    () => sortFeatured((awards ?? []).filter((a) => a.tier === FEATURED)),
    [awards],
  )
  // Anything that is not a featured trophy belongs on the numbered list, so a
  // row saved without a tier still reaches the board rather than being
  // announced by the organizer and rendered nowhere. Matches AwardsAdmin.
  const top50 = useMemo(
    () => sortTop50((awards ?? []).filter((a) => a.tier !== FEATURED)),
    [awards],
  )
  const matches = useMemo(
    () => top50.filter((a) => matchesAwardSearch(a, term)),
    [top50, term],
  )

  const nothingYet = awards !== null && awards.length === 0

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <SiteHeader />

      <header className="border-b border-gold/25 px-4 pt-8 pb-7 text-center">
        <TrophyMark className="w-11 h-11 mx-auto text-gold" />
        <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-cream mt-3">
          2026 Awards &amp; <span className="text-gold">Trophy Ceremony</span>
        </h1>
        <p className="font-script text-gold-pale text-xl mt-1">
          Saturday, September 26, 2026
        </p>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
        <CeremonyCard started={ceremonyStarted} />

        {loadError ? (
          <p className="text-center text-red-300 py-14" role="alert">
            We couldn't load the results. Please refresh the page — the winners
            are also read out from the stage.
          </p>
        ) : awards === null ? (
          <p className="text-center text-gold-pale/60 py-14">Loading results…</p>
        ) : nothingYet ? (
          <NoResultsYet started={ceremonyStarted} />
        ) : (
          <>
            {featured.length > 0 && (
              <Section title="Featured Winners">
                <div className="space-y-4">
                  {featured.map((a) => (
                    <FeaturedCard key={a.id} award={a} />
                  ))}
                </div>
              </Section>
            )}

            {top50.length > 0 && (
              <Section title="Top 50 Awards">
                {/* The placeholder names the two things a spectator has to
                    hand; the box also matches owner and class, but spelling
                    all four out overflows a phone-width field. */}
                <label className="block relative mb-4">
                  <span className="sr-only">
                    Search the Top 50 winners by car number, make, model, owner, or class
                  </span>
                  <SearchMark className="w-5 h-5 text-gold-pale/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search by car number or make/model"
                    className="w-full rounded-lg border border-gold/40 bg-white/5 text-cream placeholder:text-gold-pale/40 pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                </label>

                {/* Polite, and only the count: re-announcing all fifty rows
                    every time one lands would bury the new winner. */}
                <p className="text-gold-pale/60 text-sm mb-3" aria-live="polite">
                  {term
                    ? `${matches.length} of ${top50.length} announced ${plural(top50.length, 'winner')} match "${term}"`
                    : `${top50.length} ${plural(top50.length, 'winner')} announced so far`}
                </p>

                {matches.length === 0 ? (
                  <p className="text-gold-pale/60 py-6">
                    No announced winner matches that yet. Awards are posted here
                    as they're called from the stage — try again in a minute.
                  </p>
                ) : (
                  <ul className="divide-y divide-gold/15 border-y border-gold/15">
                    {matches.map((a) => (
                      <Top50Row key={a.id} award={a} />
                    ))}
                  </ul>
                )}
              </Section>
            )}
          </>
        )}

        <p className="text-gold-pale/50 text-sm mt-10 text-center">
          Trophies are handed out at the stage. Can't stay? Email{' '}
          <a className="underline hover:text-gold-pale" href="mailto:carshow@enjoysenoia.com">
            carshow@enjoysenoia.com
          </a>{' '}
          to arrange a pickup.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}

const plural = (n, word) => (n === 1 ? word : `${word}s`)

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl uppercase tracking-wide text-cream border-b-2 border-gold pb-2 mb-5">
        {title}
      </h2>
      {children}
    </section>
  )
}

function CeremonyCard({ started }) {
  return (
    <div className="rounded-xl border border-gold/40 bg-white/5 px-5 py-4 text-center">
      <p className="font-display text-xl uppercase tracking-wide text-gold">
        Ceremony Schedule
      </p>
      <p className="mt-2 flex items-center justify-center gap-2 text-cream text-lg">
        <ClockMark className="w-5 h-5 text-gold-pale shrink-0" />
        {CEREMONY_LABEL} · {CEREMONY_PLACE}
      </p>
      <p className="mt-2 text-gold-pale/70 text-sm">
        50/50 raffle winner, last year's Best in Show, then the Top 50 and Best
        in Show Car &amp; Truck.{' '}
        <Link to="/map?poi=stage" className="underline hover:text-gold-pale">
          Find the stage →
        </Link>
      </p>
      {started && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold text-ink font-display uppercase tracking-widest text-xs px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-ink animate-pulse" />
          Announcing now
        </p>
      )}
    </div>
  )
}

function NoResultsYet({ started }) {
  return (
    <div className="text-center py-14">
      <Medallion label="2026" className="w-24 h-24 mx-auto text-gold/50" />
      <p className="text-cream text-lg mt-4">
        {started
          ? 'The ceremony is underway — winners appear here within moments of being called.'
          : `Winners are posted here live, starting at ${CEREMONY_LABEL}.`}
      </p>
      <p className="text-gold-pale/60 mt-2">
        Leave this page open; it updates on its own.
      </p>
    </div>
  )
}

function FeaturedCard({ award }) {
  const { title, vehicle, owner, carNumber, awardClass, photoUrl } = award
  return (
    // A row even on a phone: stacked, the art panel becomes a full-width band
    // that pushes the winner's name below the fold.
    <article className="rounded-xl border border-gold/40 bg-white/5 overflow-hidden flex">
      <div className="w-28 sm:w-40 shrink-0 bg-gold/10 flex items-center justify-center p-3">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={vehicle ? `${vehicle}, ${title}` : title}
            loading="lazy"
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <Medallion
            label={carNumber ? `#${carNumber}` : 'BEST'}
            className="w-20 h-20 sm:w-24 sm:h-24 text-gold"
          />
        )}
      </div>
      <div className="p-4 sm:p-5 flex-1 min-w-0">
        <h3 className="font-display text-xl sm:text-2xl uppercase tracking-wide text-gold">
          {title}
        </h3>
        <p className="text-cream text-lg mt-1">{vehicle}</p>
        {owner && <p className="text-gold-pale/80 mt-1">Owner: {owner}</p>}
        <p className="text-gold-pale/60 text-sm mt-1">
          {[carNumber && `Car #${carNumber}`, awardClass].filter(Boolean).join(' · ')}
        </p>
      </div>
    </article>
  )
}

function Top50Row({ award }) {
  const { carNumber, vehicle, owner, awardClass } = award
  return (
    <li className="py-3 flex gap-3">
      <span className="font-display text-gold text-lg tabular-nums w-10 shrink-0">
        {carNumber || '—'}
      </span>
      {/* Owner and class sit beside the car on a wide screen and drop under it
          on a phone — inline, the longest model names push them onto a ragged
          third line and the fifty rows stop scanning as a list. */}
      <div className="flex-1 min-w-0 sm:flex sm:items-baseline sm:gap-4">
        <span className="text-cream sm:flex-1">{vehicle}</span>
        {(owner || awardClass) && (
          <span className="block sm:inline text-gold-pale/70 text-sm mt-0.5 sm:mt-0 sm:text-right">
            {[owner, awardClass].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>
    </li>
  )
}
