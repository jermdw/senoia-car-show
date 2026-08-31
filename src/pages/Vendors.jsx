import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import varsityLogo from '../assets/vendor-varsity.webp'
import madGreekLogo from '../assets/vendor-mad-greek.webp'
import jalapenoLogo from '../assets/vendor-jalapeno-express.webp'
import littleMissJuicyLogo from '../assets/vendor-little-miss-juicy.webp'
import auntZestysLogo from '../assets/vendor-aunt-zestys.webp'
import kettleworksLogo from '../assets/vendor-kettleworks.webp'
import bigDaddysLogo from '../assets/vendor-big-daddys-peanuts.webp'
import perroLogo from '../assets/vendor-mr-perro-atl.webp'

// The 2026 food vendor roster, supplied by Valerie Kinney (enjoysenoiafoodtrucks@
// gmail.com), the DDA's food truck coordinator, on 2026-08-22 — her order is kept.
// Names are stored in title case; the cells render `uppercase` in CSS.
//
// Names and `url`s were verified against the vendors' own Ticket Tailor food
// registrations (buyer email / menu description), which is the only place the
// trading identity is recorded — the checkout form never asks for a business
// name. Two traps that costs us if forgotten: Val's "CIRCLE M BBQ" trades as
// **Circle M Barbeque** (Byrom Rd, Senoia), and `circlembbq.com` is an unrelated
// whole-hog restaurant in Liberty, SC — it must never become this row's `url`.
//
// Circle M Barbeque and Fosters Sandwiches have no artwork we could source and
// no findable site, so they fall back to a plain name cell, exactly as
// `SS Chassis Works` does on /sponsors. Val has their contacts and is the right
// person to ask for logos — a wrong logo is worse than a text cell.
// Kettleworks and Mr. Perro ATL have artwork but no standalone site (Mr. Perro's
// logo is their Facebook profile picture, pulled 2026-08-23; only a Facebook page
// exists), so those cells are deliberately unlinked: `logo` and `url` are
// independent here, unlike the sponsor grid, because food trucks routinely have
// one without the other.
const FOOD_VENDORS_2026 = [
  { name: 'The Varsity', logo: varsityLogo, w: 400, h: 55, url: 'https://www.thevarsity.com/' },
  { name: 'Mr. Perro ATL', logo: perroLogo, w: 400, h: 400 },
  { name: 'Circle M Barbeque' },
  { name: 'The Mad Greek', logo: madGreekLogo, w: 315, h: 315, url: 'https://www.themadgreekfood.com/' },
  { name: 'Jalapeno Express', logo: jalapenoLogo, w: 400, h: 160, url: 'https://jalapenoexpressbbq.com/' },
  { name: 'Fosters Sandwiches' },
  { name: 'Little Miss Juicy', logo: littleMissJuicyLogo, w: 290, h: 290, url: 'https://linktr.ee/littlemissjuicy' },
  { name: 'Aunt Zesty\u2019s', logo: auntZestysLogo, w: 400, h: 59, url: 'https://auntzestys.com/' },
  { name: 'Kettleworks', logo: kettleworksLogo, w: 400, h: 363 },
  { name: "Big Daddy's Peanuts", logo: bigDaddysLogo, w: 400, h: 273, url: 'https://bigdaddyspeanuts.com/' },
]

// A logo sits inside the cell either way; it only becomes a link when we have a
// site we actually verified belongs to that vendor.
function LogoCell({ url, children }) {
  const className = 'w-full h-full flex items-center justify-center p-4'
  return url ? (
    <a href={url} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <div className={className}>{children}</div>
  )
}

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
        <ul className="mb-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {FOOD_VENDORS_2026.map(({ name, logo, w, h, url }) => (
            <li
              key={name}
              className="bg-white rounded-xl border border-stone-200 hover:border-gold transition-colors h-32"
            >
              {/* Same cell contract as the sponsor grid: the whole cell is the
                  link so a wordmark surrounded by whitespace is still an easy
                  target, width/height carry the intrinsic ratio so the grid
                  doesn't reflow as logos load, and a fixed-height cell with
                  object-contain keeps wildly different aspect ratios tidy.
                  Not lazy-loaded, for the same reason as /sponsors. Unlike that
                  grid, a logo without a `url` renders unlinked rather than
                  falling back to text — see the roster comment. */}
              {logo ? (
                <LogoCell url={url}>
                  <img
                    src={logo}
                    alt={name}
                    width={w}
                    height={h}
                    className="max-h-full max-w-full w-auto h-auto object-contain"
                  />
                </LogoCell>
              ) : (
                /* Placeholder "logo" for vendors whose artwork we don't have yet:
                   a plain bordered wordmark so the row reads as a logo cell and
                   the listing looks complete. Rendered in markup rather than as
                   an image so it stays sharp at any DPI and costs no bytes —
                   dropping in real artwork is just adding `logo`/`w`/`h` above. */
                <div className="w-full h-full flex items-center justify-center p-3">
                  <span className="w-full border border-ink bg-white px-2 py-3 text-center font-display uppercase tracking-wide text-ink text-sm leading-tight">
                    {name}
                  </span>
                </div>
              )}
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
          <p className="text-stone-700 mt-3">
            Setting up on show day? Vendors enter at Seavy Street and Bridge
            Street from 6:00am &mdash;{' '}
            <Link to="/faq#vendor-entrance" className="underline font-semibold">
              load-in times and entrances
            </Link>{' '}
            are on the FAQ.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
