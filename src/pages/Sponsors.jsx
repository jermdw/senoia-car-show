import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import bmwLogo from '../assets/sponsor-bmw-south-atlanta.webp'
import carolinaLogo from '../assets/sponsor-carolina-handling.webp'
import landmarkLogo from '../assets/sponsor-landmark-dodge.webp'
import cycleLogo from '../assets/sponsor-cycle-specialty.webp'
import safebuiltLogo from '../assets/sponsor-safebuilt.webp'
import atlantaLogo from '../assets/sponsor-atlanta-auto-restoration.webp'
import tdkLogo from '../assets/sponsor-tdk-components.webp'
import kellysLogo from '../assets/sponsor-kellys-automotive.webp'
import clarissaLogo from '../assets/sponsor-clarissa-uhl.webp'
import crooksLogo from '../assets/sponsor-crooks-tire.webp'
import wolterLogo from '../assets/sponsor-wolter.webp'
import earlsLogo from '../assets/sponsor-earls-quality-car-care.webp'
import trinityLogo from '../assets/sponsor-trinity-air.webp'
import wildWilliesLogo from '../assets/sponsor-wild-willies.webp'
import rbaLogo from '../assets/sponsor-renewal-by-andersen.webp'
import progressiveLogo from '../assets/sponsor-progressive-heating-air.webp'
import dentGuysLogo from '../assets/sponsor-dent-guys.webp'
import filmoresLogo from '../assets/sponsor-filmores-garage.webp'
import scrubBrosLogo from '../assets/sponsor-scrubbros-detailing.webp'
import superiorTreeLogo from '../assets/sponsor-superior-tree-service.webp'

// `url` is each sponsor's own site, verified individually (Aug 2026) — a wrong
// link on a page thanking a paying sponsor is worse than no link. TDK Components
// USA has no standalone site, so it points at the TDK corporate site. Wolter is
// the Wisconsin-based material handling company; its Atlanta/Buford branches
// serve Coweta County, and the corporate site is where its Atlanta pages live.
const SPONSORS_2026 = [
  {
    tier: 'Title Sponsors',
    cell: 'h-32',
    sponsors: [
      { name: 'BMW of South Atlanta', logo: bmwLogo, w: 400, h: 168, url: 'https://www.bmwofsouthatlanta.com/' },
      { name: 'Carolina Handling', logo: carolinaLogo, w: 400, h: 116, url: 'https://www.carolinahandling.com/' },
      { name: 'Landmark Dodge Chrysler Jeep RAM', logo: landmarkLogo, w: 400, h: 191, url: 'https://landmarkdodge.com/' },
      { name: 'Wolter, Inc.', logo: wolterLogo, w: 400, h: 77, url: 'https://www.wolterinc.com/' },
      { name: "Earl's Quality Car Care", logo: earlsLogo, w: 400, h: 400, url: 'https://www.earlsqualitycarcare.com/' },
      { name: 'Trinity Air', logo: trinityLogo, w: 400, h: 125, url: 'https://trinityair.com/' },
      { name: 'Wild Willies Custom Accessories', logo: wildWilliesLogo, w: 400, h: 103, url: 'https://wildwilliesaccessories.com/' },
    ],
  },
  {
    tier: 'Gold Sponsors',
    cell: 'h-28',
    sponsors: [
      { name: 'Cycle Specialty', logo: cycleLogo, w: 400, h: 204, url: 'https://www.cyclespecialty.com/' },
      { name: 'SAFEbuilt', logo: safebuiltLogo, w: 400, h: 104, url: 'https://safebuilt.com/' },
      { name: 'Atlanta Auto Restoration', logo: atlantaLogo, w: 400, h: 169, url: 'https://atlautoresto.com/' },
      { name: 'TDK Components USA', logo: tdkLogo, w: 400, h: 138, url: 'https://www.tdk.com/en/index.html' },
      { name: "Kelly's Automotive Repair", logo: kellysLogo, w: 400, h: 241, url: 'https://kellysautorepairpeachtreecity.com/' },
      { name: 'Renewal by Andersen', logo: rbaLogo, w: 400, h: 137, url: 'https://www.renewalbyandersen.com/locations/atlanta-ga' },
      { name: 'Progressive Heating, Air & Plumbing', logo: progressiveLogo, w: 400, h: 217, url: 'https://progressiveac.com/' },
      // No findable website/logo for this one — text placeholder until the
      // organizers can supply artwork.
      { name: 'SS Chassis Works' },
    ],
  },
  {
    tier: 'Silver Sponsors',
    cell: 'h-28',
    sponsors: [
      { name: 'The Dent Guys', logo: dentGuysLogo, w: 400, h: 181, url: 'https://dentguysatl.com/' },
      { name: "Filmore's Garage", logo: filmoresLogo, w: 400, h: 217, url: 'https://www.filmoresgarage.com/' },
      { name: 'ScrubBros Detailing', logo: scrubBrosLogo, w: 400, h: 326, url: 'https://scrubbrosdetailing.org/' },
    ],
  },
  {
    tier: 'Bronze Sponsors',
    cell: 'h-28',
    sponsors: [
      { name: 'Clarissa Uhl – Realtor, Berkshire Hathaway HomeServices Georgia Properties', logo: clarissaLogo, w: 400, h: 333, url: 'https://clarissauhl.bhhsgeorgia.com/' },
      { name: "Crook's Tire & Auto", logo: crooksLogo, w: 400, h: 181, url: 'https://www.crookstire.com/' },
      // No standalone website found — links to their listed phone number instead.
      { name: 'Superior Tree Service', logo: superiorTreeLogo, w: 400, h: 229, url: 'tel:+16784914703' },
    ],
  },
]

const TIERS = [
  {
    name: 'Title Sponsor',
    price: '$2,000',
    perks: ["15' × 50' premium curbside space", 'DJ promotional mentions every 15 minutes', 'Website promotion & recognition'],
    featured: true,
  },
  {
    name: 'Gold Sponsor',
    price: '$1,000',
    perks: ["15' × 50' curbside space", 'DJ promotional mentions every 30 minutes', 'Website promotion & recognition'],
  },
  {
    name: 'Silver Sponsor',
    price: '$500',
    perks: ["15' × 25' curbside space", 'DJ promotional mentions every 45 minutes', 'Website promotion & recognition'],
  },
  {
    name: 'Bronze Sponsor',
    price: '$250',
    perks: ['DJ promotional mentions every 60 minutes', 'Website promotion & recognition'],
  },
]

export default function Sponsors() {
  usePageMeta({
    title: '2026 Sponsors | Senoia Car Show',
    description:
      'Meet the sponsors of the 21st Annual Senoia Car Show — and join them: sponsorship spots for the 2026 show are still available.',
    path: '/sponsors',
  })

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-2">
          Sponsor the <span className="text-gold">Show</span>
        </h1>
        <p className="text-stone-700 mb-8 leading-relaxed max-w-2xl">
          Put your business in front of 8,000–10,000 visitors on Historic Main
          Street. Sponsorships support the Senoia Downtown Development Authority
          and keep the show free for spectators. Sponsorships are{' '}
          <strong>still available</strong> for the 2026 show — applications are
          reviewed and approved by the SDDA.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl border p-6 ${
                t.featured
                  ? 'bg-ink text-cream border-gold shadow-lg'
                  : 'bg-white border-stone-200'
              }`}
            >
              <p className={`font-display text-xl uppercase tracking-wide ${t.featured ? 'text-gold' : 'text-ink'}`}>
                {t.name}
              </p>
              <p className={`font-display text-3xl mb-3 ${t.featured ? 'text-cream' : 'text-gold-dark'}`}>
                {t.price}
              </p>
              <ul className={`space-y-1 text-sm ${t.featured ? 'text-gold-pale/90' : 'text-stone-700'}`}>
                {t.perks.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-5 bg-gold-pale/40 border border-gold rounded-xl p-4 text-sm text-ink">
          <strong>Please note:</strong> All sponsorships received after{' '}
          <strong>August 17, 2026</strong> will not receive an appreciation plaque
          due to order lead times.
        </p>

        <div className="mt-8 bg-ink rounded-xl p-6 text-center">
          <p className="font-script text-gold text-2xl mb-1">Still accepting sponsors!</p>
          <p className="text-gold-pale/90">
            Email{' '}
            <a className="underline font-semibold hover:text-cream" href="mailto:carshow@enjoysenoia.com">
              carshow@enjoysenoia.com
            </a>{' '}
            or call the Welcome Center at{' '}
            <a className="underline font-semibold hover:text-cream" href="tel:+17707279173">(770) 727-9173</a>.
          </p>
        </div>

        <h2 className="font-display text-3xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mt-14 mb-2">
          Our 2026 <span className="text-gold">Sponsors</span>
        </h2>
        <p className="font-script text-gold text-2xl mb-6">Thank you for supporting the show!</p>
        {SPONSORS_2026.map(({ tier, cell, sponsors }) => (
          <section key={tier} className="mb-8">
            <h3 className="font-display text-xl uppercase tracking-wide text-gold-dark mb-3">{tier}</h3>
            <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {sponsors.map(({ name, logo, w, h, url }) => (
                <li
                  key={name}
                  className={`bg-white rounded-xl border border-stone-200 hover:border-gold transition-colors ${cell}`}
                >
                  {/* The whole cell is the link, not just the logo pixels — a
                      wordmark with whitespace around it is a frustrating target
                      otherwise. The img alt is the link's accessible name.
                      Sponsors without a logo yet (no `logo`/`url`) fall back to
                      a plain name so the tier list stays accurate even before
                      artwork exists — not wrapped in a link since there's
                      nowhere confirmed to send visitors. */}
                  {logo ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full h-full flex items-center justify-center p-4"
                    >
                      {/* Logos vary widely in aspect ratio; contain them in a
                          fixed-height cell so the rows stay tidy. width/height
                          carry the intrinsic ratio so the grid doesn't shift as
                          they load. Deliberately not lazy: these are the whole
                          point of the section and only ~140KB in total, and a
                          lazy image that never intersects stays invisible. */}
                      <img
                        src={logo}
                        alt={name}
                        width={w}
                        height={h}
                        className="max-h-full max-w-full w-auto h-auto object-contain"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center">
                      <span className="font-display uppercase tracking-wide text-ink">{name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  )
}
