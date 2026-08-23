import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'

// The 2026 food vendor roster, supplied by Valerie Kinney (enjoysenoiafoodtrucks@
// gmail.com), the DDA's food truck coordinator, on 2026-08-22 — her order is kept.
// Names are stored in title case; the cells render `uppercase` in CSS.
const FOOD_VENDORS_2026 = [
  { name: 'The Varsity' },
  { name: 'Mr. Perro ATL' },
  { name: 'Circle M BBQ' },
  { name: 'The Mad Greek' },
  { name: 'Jalapeno Express' },
  { name: 'Fosters Sandwiches' },
  { name: 'Little Miss Juicy' },
  { name: 'Aunt Zesty\u2019s' },
  { name: 'Kettleworks' },
  { name: "Big Daddy's Peanuts" },
]

export default function Vendors() {
  usePageMeta({
    title: 'Vendors & Food Trucks | Senoia Car Show',
    description:
      'Food and beer trucks — including The Varsity — plus local shops and restaurants along Historic Main Street at the 2026 Senoia Car Show. Vendor registration for 2026 is closed.',
    path: '/vendors',
  })

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-4">
          Vendor <span className="text-gold">Info</span>
        </h1>

        <div className="bg-ink rounded-xl p-6 mb-8 text-center">
          <p className="font-display text-2xl uppercase tracking-wide text-gold mb-2">
            Vendor Registration Is Closed
          </p>
          <p className="text-gold-pale/90">
            We're no longer accepting vendor applications for the 2026 show.
            Thank you to everyone who applied!
          </p>
        </div>

        <p className="text-stone-700 mb-6 leading-relaxed">
          Come hungry: the show features music, food &amp; beer trucks —
          including The Varsity — plus local shops and restaurants open all
          along Historic Main Street.
        </p>

        <h2 className="font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4">
          2026 Food Vendors
        </h2>
        <ul className="mb-8 grid gap-2 sm:grid-cols-2">
          {FOOD_VENDORS_2026.map((v) => (
            <li
              key={v.name}
              className="bg-white rounded-lg border border-stone-200 px-4 py-3 font-display uppercase tracking-wide text-ink"
            >
              {v.name}
            </li>
          ))}
        </ul>
        <p className="text-stone-600 text-sm mb-8">
          Find them in the food court on Travis Street west of Main — see the{' '}
          <a className="underline font-semibold" href="/map?poi=food-court">
            show day guide
          </a>{' '}
          for the map.
        </p>

        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <p className="font-display text-xl uppercase tracking-wide text-ink mb-2">
            Questions?
          </p>
          <p className="text-stone-700">
            For anything vendor-related, including next year's show, contact the
            organizers at{' '}
            <a className="underline font-semibold" href="mailto:carshow@enjoysenoia.com">
              carshow@enjoysenoia.com
            </a>{' '}
            or{' '}
            <a className="underline font-semibold" href="tel:+17707279173">(770) 727-9173</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
