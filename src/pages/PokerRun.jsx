import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'

// The five photo stops, in the suggested driving order from the organizers' route
// map (Senoia → Sharpsburg → Newnan → GA-16 → back to Senoia, ~33 miles / ~51 min).
// Participants may visit them in any order. Each `address` is exactly what Google
// Maps resolves, so the per-stop links land on the right pin.
//
// TODO(organizers): stop 3 is a private address — confirm the name it should be
// listed under before the run (the route map labels it "Woodies").
const STOPS = [
  { name: 'Senoia City Cemetery', address: 'Senoia City Cemetery, Senoia, GA 30276' },
  { name: 'Clayton Appliances', address: '51 Marion Beavers Rd, Sharpsburg, GA 30277' },
  { name: '1 Wood Dr, Newnan', address: '1 Wood Dr, Newnan, GA 30263' },
  { name: 'Aqua Design Systems', address: '5127 GA-16, Senoia, GA 30276' },
  {
    name: 'SAHS History Museum',
    address: '6 Couch St, Senoia, GA 30276',
    note: 'Also known as the Carmichael House — the Senoia Area Historical Society’s home.',
  },
]

const FINISH = {
  name: 'Stone Lodge at Marimac Lakes',
  address: 'Marimac Lake, 148 Pylant St, Senoia, GA 30276',
}

const mapsSearch = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

// One tap opens the whole loop in the Google Maps app: the five stops in order,
// ending at the turn-in (the one place with a deadline) rather than at stop 5.
const ROUTE_URL =
  'https://www.google.com/maps/dir/?api=1' +
  `&origin=${encodeURIComponent(STOPS[0].address)}` +
  `&destination=${encodeURIComponent(FINISH.address)}` +
  `&waypoints=${encodeURIComponent(STOPS.slice(1).map((s) => s.address).join('|'))}` +
  '&travelmode=driving'

const STEPS = [
  ['Cruise the stops', 'Drive to all five landmarks below, in any order, at your own pace. There’s no official start time — go whenever suits you on Friday afternoon.'],
  ['Snap a photo', 'Take a picture of your vehicle at each stop. A selfie with the car counts! Tell any onlookers to come see the show on Saturday.'],
  ['Draw your hand', 'Bring your five photos to the Stone Lodge at Marimac Lakes between 6:00 and 7:00 PM. Each photo earns you a playing card — five cards is your poker hand.'],
  ['Win', 'The best five-card poker hand (standard poker rules) takes the $200 cash prize. Winner announced at 7:00 PM, followed by a free hot dog dinner for all participants.'],
]

const FACTS = [
  ['Any vehicle', 'Car, truck, or motorcycle — no age restriction, unlike the show'],
  ['Own pace', 'No set start time; visit the stops in any order'],
  ['$200', 'Cash prize for the best poker hand'],
  ['6–7 PM', 'Photo turn-in at Marimac Lakes; winner announced at 7:00'],
]

export default function PokerRun() {
  usePageMeta({
    title: 'Cruisin’ for History Poker Run — Fri, Sept 25, 2026 | Senoia Car Show',
    description:
      'Kick off car show weekend with the Cruisin’ for History Poker Run, Friday, September 25, 2026: drive to five local landmarks, photograph your car at each, and turn in your photos at Marimac Lakes 6–7 PM for a poker hand. Best hand wins $200. Any vehicle welcome; benefits the Senoia Area Historical Society.',
    path: '/poker-run',
  })

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <p className="font-script text-gold text-3xl leading-none mb-1">Cruisin’ for History</p>
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-2">
          Poker <span className="text-gold">Run</span>
        </h1>
        <p className="font-display text-xl uppercase tracking-wide text-stone-700 mb-6">
          Friday, September 25, 2026 &middot; the afternoon before the show
        </p>

        <p className="text-stone-700 mb-4 leading-relaxed">
          Back for its second year, the Cruisin’ for History Poker Run is a
          laid-back fundraiser for the{' '}
          <a
            className="underline font-semibold"
            href="https://senoiahistory.com"
            target="_blank"
            rel="noreferrer"
          >
            Senoia Area Historical Society
          </a>
          . Drive a loop of five local landmarks, photograph your ride at each,
          then trade your photos for a poker hand. Best hand wins — and everyone
          eats.
        </p>
        <p className="text-stone-700 mb-8 leading-relaxed">
          Unlike the show itself, <strong>any make, model, or year</strong> of
          car, truck, or motorcycle can join. It’s the perfect way to kick off
          car show weekend and support the preservation of Senoia’s history.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 text-center">
          {FACTS.map(([big, small]) => (
            <div key={big} className="bg-white rounded-xl border border-stone-200 p-4">
              <p className="font-display text-2xl text-gold-dark uppercase leading-tight">{big}</p>
              <p className="text-stone-600 text-sm mt-1">{small}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          How It Works
        </h2>
        <ol className="mb-10 space-y-4">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="flex gap-4">
              <span className="shrink-0 w-9 h-9 rounded-full bg-ink text-gold font-display text-lg flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="font-display uppercase tracking-wide text-ink text-lg leading-tight">{title}</p>
                <p className="text-stone-700">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          The Route
        </h2>
        <p className="text-stone-700 mb-4 leading-relaxed">
          Five stops, roughly a 33-mile loop — about 50 minutes of driving
          without the photo breaks. The order below is the suggested route; you’re
          free to run it however you like. Tap any address to open it in your
          maps app, or open the whole loop — stops 1–5, then the finish line —
          in one go.
        </p>
        <a
          href={ROUTE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-gold hover:bg-gold-dark text-ink font-display font-semibold uppercase tracking-wider px-6 py-3 rounded-md transition-colors mb-6"
        >
          Open the Full Route in Google Maps
        </a>

        <ol className="space-y-3 mb-6">
          {STOPS.map((s, i) => (
            <li key={s.address} className="bg-white rounded-xl border border-stone-200 p-4 flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-gold text-ink font-display text-xl flex items-center justify-center">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-display uppercase tracking-wide text-ink text-lg leading-tight">
                  Stop {i + 1}: {s.name}
                </p>
                <a
                  href={mapsSearch(s.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold-dark underline underline-offset-2 hover:text-ink break-words"
                >
                  {s.address}
                </a>
                {s.note && <p className="text-stone-600 text-sm mt-1">{s.note}</p>}
              </div>
            </li>
          ))}
        </ol>

        <div className="bg-ink rounded-xl p-6 mb-10">
          <p className="font-script text-gold text-2xl mb-1">Finish line</p>
          <p className="font-display uppercase tracking-wide text-cream text-lg leading-tight">
            {FINISH.name}
          </p>
          <a
            href={mapsSearch(FINISH.address)}
            target="_blank"
            rel="noreferrer"
            className="text-gold-pale underline underline-offset-2 hover:text-gold"
          >
            {FINISH.address}
          </a>
          <p className="text-gold-pale/80 mt-3">
            Proceed across the lake to the Stone Lodge between{' '}
            <strong className="text-cream">6:00 and 7:00 PM</strong> with your
            five photos to draw your hand. Winner announced at 7:00, hot dog
            dinner to follow.
          </p>
        </div>

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          Entry
        </h2>
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-10">
          <p className="font-display text-xl uppercase tracking-wide text-ink mb-2">
            Entry details coming soon
          </p>
          <p className="text-stone-700">
            Ticket pricing and how to register will be posted here and on the{' '}
            <a
              className="underline font-semibold"
              href="https://senoiahistory.com/news"
              target="_blank"
              rel="noreferrer"
            >
              Senoia Area Historical Society
            </a>{' '}
            site. All proceeds benefit the Historical Society.
          </p>
        </div>

        <div className="bg-cream border-2 border-gold rounded-xl p-6 text-center">
          <p className="font-script text-gold text-2xl mb-2">Then come see the show</p>
          <p className="text-stone-700 mb-4">
            The 21st Annual Senoia Car Show is the next morning, Saturday,
            September 26 — 10am–4pm on Historic Main Street.
          </p>
          <Link
            to="/show"
            className="inline-block bg-gold hover:bg-gold-dark text-ink font-display font-semibold uppercase tracking-wider px-8 py-3 rounded-md transition-colors"
          >
            Show Info
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
