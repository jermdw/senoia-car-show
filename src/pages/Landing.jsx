import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import Countdown from '../components/Countdown.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { isVisibleOnShowDay, useShowDayArrived } from '../lib/useShowDay.js'
import { ROUTE_LOADERS, warmRoute } from '../lib/routeLoaders.js'
import { REGISTRATION_URL, REGISTRATION_PRICE } from '../data/registration.js'
import logo from '../assets/logo-hero.webp'

const HIGHLIGHTS = [
  ['600+', 'Collector cars & trucks, 25 years and older'],
  ['Free', 'Spectator admission & parking, shuttles all day'],
  ['10am–4pm', 'Live music, food trucks, awards & door prizes'],
]

// `hideOnShowDay`/`showOnShowDay` carry the same meaning as in SiteHeader's nav
// and are filtered by the same predicate — the home page must not still be
// selling Friday's poker run and a volunteer shift on Saturday morning after the
// header has already retired both. The featured flag moves with them: whichever
// of Volunteer (before) or Awards (on the day) is the standing ask takes the
// full-width banner at the foot of the grid.
const SECTIONS = [
  {
    to: '/show',
    title: 'Show Info',
    text: 'Schedule, key dates, display pricing, and parking logistics for show day.',
  },
  {
    to: '/map',
    title: 'Show Day',
    text: 'Find your way around the show, and what time everything happens.',
  },
  {
    to: '/poker-run',
    title: 'Poker Run',
    text: 'Friday, Sept 25: cruise five landmarks, draw a hand, best hand wins $200. Any vehicle, $25 per entry — tickets on sale now.',
    hideOnShowDay: true,
  },
  {
    to: '/sponsors',
    title: 'Sponsors',
    text: 'Meet our 2026 sponsors — and join them, spots are still available.',
  },
  {
    to: '/vendors',
    title: 'Vendors',
    text: 'Vendor applications are closed for 2026 — see what will be on Main Street.',
  },
  {
    to: '/merch',
    title: 'Merch',
    text: 'The 21st Annual show t-shirt, available at the merchandise tent.',
  },
  {
    to: '/volunteer',
    title: 'Volunteer',
    text: 'The show runs on volunteers — grab a shift and be part of it.',
    featured: true,
    hideOnShowDay: true,
  },
  {
    to: '/awards',
    title: 'Award Winners',
    text: 'Top 50, Best in Show Car & Truck — posted live as they’re called from the stage at 3:00 PM.',
    featured: true,
    showOnShowDay: true,
  },
]

export default function Landing() {
  usePageMeta({
    title: 'Senoia Car Show — Sept 26, 2026 · Historic Downtown Senoia, GA',
    description:
      'The 21st Annual Senoia Car Show: 600+ collector and classic vehicles on Historic Main Street in Senoia, Georgia. Saturday, September 26, 2026, 10am–4pm. Free spectator admission.',
    path: '/',
  })

  const showDayArrived = useShowDayArrived()
  const sections = SECTIONS.filter((s) => isVisibleOnShowDay(s, showDayArrived))

  // Both show-day CTAs below point at /awards, which is lazy and pulls the
  // Firebase chunk. Warm it on visible intent, exactly as SiteHeader does for the
  // nav — on show day this is the busiest link on the site, opened on cell signal
  // in a crowd, and an unwarmed tap looks like nothing happened. Volunteer and
  // Cancel are lazy too, but /volunteer is already warmed from the header.
  const prefetch = (to) =>
    ROUTE_LOADERS[to]
      ? {
          onPointerEnter: () => warmRoute(to),
          onPointerDown: () => warmRoute(to),
          onFocus: () => warmRoute(to),
        }
      : {}

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="text-center px-6 pt-10 pb-14">
          <h1>
            <img
              src={logo}
              alt="The Senoia Car Show — Main Street, Senoia, GA. Established 2005."
              width="800"
              height="820"
              className="w-72 sm:w-96 max-w-full h-auto mx-auto mb-6 drop-shadow-[0_4px_24px_rgba(173,132,31,0.25)]"
            />
            <span className="block font-script text-gold text-3xl sm:text-4xl mb-2">
              Historic Downtown Senoia
            </span>
            <span className="block font-display text-2xl sm:text-3xl uppercase tracking-wide text-cream">
              Saturday, September 26, 2026 &middot; 10am&ndash;4pm
            </span>
          </h1>
          <p className="font-display text-lg uppercase tracking-widest text-gold-pale/80 mt-1 mb-8">
            21st Annual &middot; Free Spectator Admission
          </p>

          <div className="mb-10">
            <Countdown />
          </div>

          {/* Two CTAs, deliberately unequal: registering a car costs money and
              stops the moment the spots run out, so it leads; volunteering is the
              standing ask beside it. */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-ink font-display font-semibold text-xl uppercase tracking-wider px-10 py-4 rounded-md shadow-lg transition-colors"
            >
              Register Your Vehicle
            </a>
            {/* The standing second ask, which changes on the morning of the show:
                sign-ups are over by then, and the board is what people are on the
                site for. Mirrors the same swap in the header nav and the grid. */}
            <Link
              to={showDayArrived ? '/awards' : '/volunteer'}
              {...prefetch(showDayArrived ? '/awards' : '/volunteer')}
              className="w-full sm:w-auto border-2 border-gold text-gold hover:bg-gold hover:text-ink font-display font-semibold text-xl uppercase tracking-wider px-10 py-[0.875rem] rounded-md transition-colors"
            >
              {showDayArrived ? 'Award Winners' : 'Volunteer Sign-Up'}
            </Link>
          </div>
          {/* A countdown over a pair of buttons reads like a ticket sale, so the
              free-to-watch line sits directly under them rather than further down
              the page. */}
          <p className="mt-5 max-w-xl mx-auto text-cream/75 leading-relaxed">
            <strong className="text-gold-pale font-semibold">
              Coming to look? It&rsquo;s free.
            </strong>{' '}
            No ticket, no registration &mdash; spectator admission, parking and
            shuttles all cost nothing. Showing a car?{' '}
            <Link to="/show" className="underline underline-offset-2 hover:text-gold-pale">
              Registration
            </Link>{' '}
            is {REGISTRATION_PRICE}, for display vehicles only &mdash; 25 years
            and older.
          </p>
          <p className="mt-6">
            <a
              href="/flyer-2026.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-gold-pale/80 hover:text-gold-pale underline font-display uppercase tracking-wide text-sm"
            >
              Download the 2026 Info Flyer (PDF)
            </a>
          </p>
        </section>

        <section className="bg-cream py-12 px-4">
          <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-3 text-center">
            {HIGHLIGHTS.map(([big, small]) => (
              <div key={big}>
                <p className="font-display text-4xl text-gold-dark uppercase">{big}</p>
                <p className="text-stone-600 mt-1">{small}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-cream pb-14 px-4">
          <div className="max-w-4xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                {...prefetch(s.to)}
                className={`rounded-xl border p-6 transition-shadow hover:shadow-md ${
                  s.featured
                    ? // The card count leaves an orphan either way (seven before show
                      // day, six on it); the featured CTA takes the whole last row as a
                      // banner rather than sitting alone at a third width.
                      'bg-ink border-gold sm:col-span-2 lg:col-span-3 text-center'
                    : 'bg-white border-stone-200'
                }`}
              >
                <h2 className={`font-display text-xl uppercase tracking-wide mb-1 ${s.featured ? 'text-gold' : 'text-ink'}`}>
                  {s.title} →
                </h2>
                <p className={`text-sm ${s.featured ? 'text-gold-pale/80' : 'text-stone-600'}`}>{s.text}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
