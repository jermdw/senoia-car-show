import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'

// Written as a look back: the show is over, so this page no longer carries the
// pre-show material (display pricing and the Ticket Tailor registration button,
// the same-day desk, parking and load-in logistics, the poker run ticket link, the
// printable flyer, the volunteer sign-up). To bring any of it back for the next
// show, `git log -p -- src/pages/Show.jsx` has the 2026 version — see
// docs/01-year-rollover.md.
const DATES = [
  ['May 1, 2026', 'Sponsor & vendor applications opened'],
  ['June 1, 2026 · 8:00 AM', 'Show car registration opened'],
  ['August 1, 2026', 'Volunteer sign-ups opened'],
  ['September 25, 2026 · afternoon', 'Cruisin’ for History Poker Run (photo turn-in 6–7 PM)'],
  ['September 26, 2026 · by 9:00 AM', 'All Main Street show vehicles parked'],
  ['September 26, 2026 · 10 AM–4 PM', 'Show day!'],
]

export default function Show() {
  usePageMeta({
    title: 'Show Info — 2026 Recap | Senoia Car Show',
    description:
      'A look back at the 21st Annual Senoia Car Show, held Saturday, September 26, 2026 on Historic Main Street in downtown Senoia, Georgia: key dates, the poker run, and the award winners.',
    path: '/show',
  })

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-2">
          Show <span className="text-gold">Info</span>
        </h1>
        <p className="font-script text-gold text-2xl mb-6">Saturday, September 26, 2026</p>

        <p className="text-stone-700 mb-4 leading-relaxed">
          The 21st Annual Senoia Car Show filled Historic Main Street in
          downtown Senoia with collector and classic vehicles, live music, local
          shopping, food vendors, door prizes, and an awards ceremony &mdash;
          plus Best in Show Car &amp; Truck, a car club corral, and a 50/50
          raffle benefiting the I-58 Mission food bank. The poker run kicked off
          the weekend on Friday evening.
        </p>
        <p className="text-stone-700 mb-8 leading-relaxed">
          Public admission and spectator parking were <strong>free</strong>, with
          shuttle service running throughout the day. Proceeds support the
          Senoia Downtown Development Authority and downtown preservation.
          Thank you to everyone who came out, showed a car, sponsored, sold,
          or volunteered.
        </p>

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          2026 Key Dates
        </h2>
        <ul className="mb-8 space-y-2">
          {DATES.map(([when, what]) => (
            <li key={what} className="flex flex-wrap gap-x-3">
              <span className="font-display text-gold-dark w-64 shrink-0">{when}</span>
              <span className="text-stone-700">{what}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          Poker Run
        </h2>
        <p className="text-stone-700 mb-4 leading-relaxed">
          On <strong>Friday, September 25</strong> the Cruisin’ for History Poker
          Run sent drivers to five local landmarks at their own pace to
          photograph their ride at each, then to Marimac Lakes between 6:00 and
          7:00 PM to turn in their photos and draw a poker hand. Best hand won
          $200 cash, and proceeds benefit the Senoia Area Historical Society.
        </p>

        <p className="mb-8 flex flex-wrap gap-x-6 gap-y-2">
          <Link
            to="/awards"
            className="font-display uppercase tracking-wide text-gold-dark underline underline-offset-2 hover:text-ink"
          >
            2026 award winners →
          </Link>
          <Link
            to="/sponsors"
            className="font-display uppercase tracking-wide text-gold-dark underline underline-offset-2 hover:text-ink"
          >
            Thank you, sponsors →
          </Link>
          <Link
            to="/poker-run"
            className="font-display uppercase tracking-wide text-gold-dark underline underline-offset-2 hover:text-ink"
          >
            About the poker run →
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
