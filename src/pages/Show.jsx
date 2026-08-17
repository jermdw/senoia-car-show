import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'

const PRICING = [
  { area: 'Main Street', advance: '$40', sameDay: '$50' },
  { area: 'North Main Street', advance: '$30', sameDay: '$40' },
  { area: 'General Parking', advance: '$25', sameDay: '$30' },
]

const DATES = [
  ['May 1, 2026', 'Sponsor & vendor applications open'],
  ['June 1, 2026 · 8:00 AM', 'Show car registration opens'],
  ['August 1, 2026', 'Volunteer sign-ups open'],
  ['September 25, 2026 · afternoon', 'Cruisin’ for History Poker Run (photo turn-in 6–7 PM)'],
  ['September 26, 2026 · by 9:00 AM', 'All Main Street show vehicles parked'],
  ['September 26, 2026 · 10 AM–4 PM', 'Show day!'],
]

export default function Show() {
  usePageMeta({
    title: 'Show Info — Key Dates, Pricing & Parking | Senoia Car Show',
    description:
      'Everything about the 21st Annual Senoia Car Show, Sept 26, 2026: key dates, show vehicle display pricing (25 years and older), free spectator parking with shuttles, awards, and door prizes.',
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
          The 21st Annual Senoia Car Show brings <strong>600+ collector and
          classic vehicles</strong> to Historic Main Street in downtown Senoia,
          with 8,000–10,000 spectators from across the Southeast. Enjoy classic
          cars, live music, local shopping, food vendors, door prizes, and an
          awards ceremony — plus Best in Show Car &amp; Truck, a car club corral,
          and the 50/50 raffle benefiting the I-58 Mission food bank. Friday
          evening, kick things off with the poker run.
        </p>
        <p className="text-stone-700 mb-8 leading-relaxed">
          Public admission and spectator parking are <strong>free</strong>, with
          shuttle service running throughout the day. Proceeds support the
          Senoia Downtown Development Authority and downtown preservation.
        </p>

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          Key Dates
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
          Show Vehicle Display Pricing
        </h2>
        <p className="text-stone-600 text-sm mb-3">
          Open to vehicles 25 years and older (model year 2001 or older).
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full bg-white rounded-lg border border-stone-200 text-left">
            <thead>
              <tr className="font-display uppercase tracking-wide text-sm text-cream bg-ink">
                <th className="px-4 py-3 rounded-tl-lg">Display Area</th>
                <th className="px-4 py-3">Advance</th>
                <th className="px-4 py-3 rounded-tr-lg">Same-Day</th>
              </tr>
            </thead>
            <tbody>
              {PRICING.map((r) => (
                <tr key={r.area} className="border-t border-stone-100">
                  <td className="px-4 py-3 font-semibold text-ink">{r.area}</td>
                  <td className="px-4 py-3 text-stone-700">{r.advance}</td>
                  <td className="px-4 py-3 text-stone-700">{r.sameDay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-stone-600 text-sm mb-8">
          Registration opened June 1 at{' '}
          <a className="underline" href="https://www.enjoysenoia.com/events/senoia-car-show-2" target="_blank" rel="noreferrer">
            enjoysenoia.com
          </a>.
        </p>

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          Parking &amp; Logistics
        </h2>
        <ul className="list-disc pl-5 text-stone-700 space-y-2 mb-8">
          <li>All registered show vehicles displayed on Main Street must be parked by <strong>9:00 AM</strong>.</li>
          <li>North Main Street show parking has been expanded this year.</li>
          <li>The Maguires Lot returns to general parking (no longer reserved).</li>
          <li>Free spectator parking with shuttles running all day.</li>
        </ul>
        <p className="mb-8 flex flex-wrap gap-x-6 gap-y-2">
          <Link
            to="/map"
            className="font-display uppercase tracking-wide text-gold-dark underline underline-offset-2 hover:text-ink"
          >
            See the show day guide →
          </Link>
          <Link
            to="/awards"
            className="font-display uppercase tracking-wide text-gold-dark underline underline-offset-2 hover:text-ink"
          >
            2026 award winners →
          </Link>
        </p>

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          Poker Run
        </h2>
        <p className="text-stone-700 mb-4 leading-relaxed">
          Kick off the weekend on <strong>Friday, September 25</strong> with the
          Cruisin’ for History Poker Run: cruise five local landmarks at your own
          pace, photograph your ride at each, then turn in your photos at
          Marimac Lakes between 6:00 and 7:00 PM to draw a poker hand. Best hand
          wins $200 cash. Any make, model, or year is welcome; tickets are $25
          per entry, and proceeds benefit the Senoia Area Historical Society.
        </p>
        <p className="mb-8 flex flex-wrap gap-x-6 gap-y-2">
          <Link
            to="/poker-run"
            className="font-display uppercase tracking-wide text-gold-dark underline underline-offset-2 hover:text-ink"
          >
            Route, stops &amp; details →
          </Link>
          <Link
            to="/poker-run#tickets"
            className="font-display uppercase tracking-wide text-gold-dark underline underline-offset-2 hover:text-ink"
          >
            Buy tickets →
          </Link>
        </p>

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          Event Flyer
        </h2>
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8 sm:flex items-center gap-6">
          <a href="/flyer-2026.pdf" target="_blank" rel="noreferrer" className="block shrink-0 w-40 mx-auto sm:mx-0 mb-4 sm:mb-0">
            <img
              src="/poster-2026.webp"
              alt="2026 Senoia Car Show poster — click to open the printable flyer"
              className="rounded shadow-md hover:shadow-lg transition-shadow"
            />
          </a>
          <div className="text-center sm:text-left">
            <p className="text-stone-700 mb-4">
              Grab the printable 2026 flyer to share with your car club, shop,
              or friends.
            </p>
            <a
              href="/flyer-2026.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-gold hover:bg-gold-dark text-ink font-display font-semibold uppercase tracking-wider px-6 py-3 rounded-md transition-colors"
            >
              Download Info Flyer (PDF)
            </a>
          </div>
        </div>

        <div className="bg-ink rounded-xl p-6 text-center">
          <p className="font-script text-gold text-2xl mb-2">Want to help make it happen?</p>
          <Link
            to="/volunteer"
            className="inline-block bg-gold hover:bg-gold-dark text-ink font-display font-semibold uppercase tracking-wider px-8 py-3 rounded-md transition-colors"
          >
            Volunteer Sign-Up
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
