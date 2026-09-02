import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { SPONSORSHIP_URL, BRONZE_PRICE } from '../data/sponsorship.js'
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
import patriotLogo from '../assets/sponsor-patriot-performance.webp'
import sanyLogo from '../assets/sponsor-sany-america.webp'
import hotRodBrothersLogo from '../assets/sponsor-hotrod-brothers-customs.webp'
import gmpLogo from '../assets/sponsor-gmp-performance-south-atlanta.webp'
import jwRodLogo from '../assets/sponsor-jw-rod-and-customs.webp'
import fayetteHumaneLogo from '../assets/sponsor-fayette-humane-society.webp'
import poolFxLogo from '../assets/sponsor-pool-fx.webp'
import synovusLogo from '../assets/sponsor-synovus.webp'
import carlSmithLogo from '../assets/sponsor-carl-smith-and-sons.webp'

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
      // Confirmed as "HotRod Brothers Customs" (hotrodbrotherscustoms.com,
      // Sharpsburg GA) — the shop behind the show's featured Hot Rod Brothers
      // Car reveal. Their site only carries a white-on-black knockout
      // wordmark (no light-background variant); the ink was recolored to
      // black so it reads on these white cells, with the typography
      // otherwise untouched.
      { name: 'HotRod Brothers Customs', logo: hotRodBrothersLogo, w: 400, h: 198, url: 'https://www.hotrodbrotherscustoms.com/' },
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
      // Confirmed as GMP Performance's South Atlanta location, 435-D Dividend
      // Dr, Peachtree City GA 30269 (gmpperformance.com; contacts Paul &
      // Hannah Brooker) — not an unrelated same-initialed business. The logo
      // is the chain's single sitewide wordmark (also used at their
      // Charlotte and Lake Norman locations); the South Atlanta branch has
      // no separate mark of its own.
      { name: 'GMP Performance – South Atlanta', logo: gmpLogo, w: 400, h: 32, url: 'https://www.gmpperformance.com/locations' },
      // Confirmed as Jody Wilkerson's Sharpsburg GA shop (Facebook
      // facebook.com/jwrodncustoms, contact jwrodncustoms@yahoo.com). Placed
      // in Gold per explicit instruction, though the internal plaque list
      // had them in Silver. No standalone website — the logo is their
      // Facebook profile photo, a shop-sign photograph of their "JW" mark.
      { name: 'JW Rod & Customs', logo: jwRodLogo, w: 400, h: 263, url: 'https://www.facebook.com/jwrodncustoms' },
    ],
  },
  {
    tier: 'Silver Sponsors',
    cell: 'h-28',
    sponsors: [
      { name: 'The Dent Guys', logo: dentGuysLogo, w: 400, h: 170, url: 'https://dentguysatl.com/' },
      { name: "Filmore's Garage", logo: filmoresLogo, w: 400, h: 217, url: 'https://www.filmoresgarage.com/' },
      { name: 'ScrubBros Detailing', logo: scrubBrosLogo, w: 400, h: 326, url: 'https://scrubbrosdetailing.org/' },
      // The Williamson GA engine shop (~25 min out), not one of the several
      // unrelated "Patriot Performance" businesses elsewhere — confirmed by
      // matching the supplied artwork to their site's own header logo, which
      // is the same lockup in its dark-background variant (white
      // "Performance"); the file here is the light-background variant that
      // reads on these white cells.
      { name: 'Patriot Performance Engines', logo: patriotLogo, w: 400, h: 78, url: 'https://www.patriotperformanceengines.com/' },
      // 2026-09-02: Clarissa supplied a new combined ad (her BHHS listing plus
      // her mortgage partner Dan Aiken of loanDepot) to replace the old
      // BHHS-only artwork — see the "Car Show Ad Sponsorship Upgrade to
      // Silver" email thread.
      { name: 'Clarissa Uhl – Realtor, Berkshire Hathaway HomeServices Georgia Properties', logo: clarissaLogo, w: 400, h: 156, url: 'https://clarissauhl.bhhsgeorgia.com/' },
      // Fayette County animal welfare nonprofit, confirmed at fayettehumane.org.
      { name: 'Fayette Humane Society', logo: fayetteHumaneLogo, w: 400, h: 390, url: 'https://fayettehumane.org/' },
      // Confirmed as the Peachtree City/Newnan/Fayetteville pool builder
      // (swimmingpoolfx.com, owner Joey Massengale), serving Fayette/Coweta
      // County — not an unrelated national "PoolFX".
      { name: 'Pool FX', logo: poolFxLogo, w: 400, h: 580, url: 'https://swimmingpoolfx.com/' },
    ],
  },
  {
    tier: 'Bronze Sponsors',
    cell: 'h-28',
    sponsors: [
      { name: "Crook's Tire & Auto", logo: crooksLogo, w: 400, h: 181, url: 'https://www.crookstire.com/' },
      // No standalone website found — links to their listed phone number instead.
      { name: 'Superior Tree Service', logo: superiorTreeLogo, w: 400, h: 229, url: 'tel:+16784914703' },
      { name: 'SANY America', logo: sanyLogo, w: 400, h: 114, url: 'https://sanyamerica.com/' },
      // Regional bank (synovus.com), NYSE: SNV, headquartered in Columbus GA.
      // Logo is their official brand SVG wordmark, rasterized at high
      // resolution.
      { name: 'Synovus', logo: synovusLogo, w: 400, h: 72, url: 'https://www.synovus.com/' },
      // Matches both "Carl Smith Lumber" and the plaque list's "Carl Smith &
      // Sons" — confirmed as the same Senoia GA business, full name "Carl E.
      // Smith & Sons Building Materials" (smithbuildingmaterials.com).
      { name: 'Carl E. Smith & Sons Building Materials', logo: carlSmithLogo, w: 400, h: 67, url: 'https://smithbuildingmaterials.com/' },
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
    price: BRONZE_PRICE,
    perks: ['DJ promotional mentions every 60 minutes', 'Website promotion & recognition'],
    // The one tier a sponsor can buy outright. The other three are numbered
    // curbside spaces held behind Ticket Tailor access codes until the SDDA
    // approves and assigns one, so they route through the contact box instead.
    checkout: true,
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
          <strong>still available</strong> for the 2026 show — Bronze can be
          purchased online, and the tiers that include a reserved curbside space
          are approved and assigned by the SDDA.
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
              {/* Only the self-serve tier gets a checkout button. The rest say
                  how they are actually obtained rather than showing a button
                  that lands on a checkout with their tier hidden — every upper
                  tier is an access-code slot until the SDDA assigns one. */}
              {t.checkout ? (
                <a
                  href={SPONSORSHIP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block text-center bg-gold hover:bg-gold-dark text-ink font-display font-semibold uppercase tracking-wider px-5 py-2.5 rounded-md transition-colors"
                >
                  Sponsor Now &mdash; {t.price}
                </a>
              ) : (
                <p className={`mt-4 text-xs uppercase tracking-wide font-display ${t.featured ? 'text-gold-pale/70' : 'text-stone-500'}`}>
                  Reserved through the SDDA
                </p>
              )}
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
          {/* Bronze is the only tier that can be bought outright, so it is the
              one thing this box can offer as a button. Title, Gold and Silver
              are numbered curbside spaces released by access code once the SDDA
              approves the sponsor, which is why they stay an email/phone ask —
              a checkout link would show those sponsors Bronze and nothing else. */}
          <p className="text-gold-pale/90 mb-5">
            Bronze sponsorships can be purchased online right now. Title, Gold
            and Silver include a reserved curbside space, so those are assigned
            by the SDDA &mdash; get in touch and we&rsquo;ll set you up.
          </p>
          <a
            href={SPONSORSHIP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-gold hover:bg-gold-dark text-ink font-display font-semibold text-lg uppercase tracking-wider px-8 py-3 rounded-md transition-colors"
          >
            Become a Bronze Sponsor &mdash; {BRONZE_PRICE}
          </a>
          <p className="text-gold-pale/90 mt-5">
            For Title, Gold or Silver, email{' '}
            <a className="underline font-semibold hover:text-cream" href="mailto:carshow@enjoysenoia.com">
              carshow@enjoysenoia.com
            </a>{' '}
            or call the Welcome Center at{' '}
            <a className="underline font-semibold hover:text-cream" href="tel:+17707279173">(770) 727-9173</a>.
          </p>
        </div>

        {/* Approved Title/Gold/Silver sponsors pay through the same event page —
            their access code reveals their assigned space at checkout. Codes are
            per-slot (one per numbered space), so there is no single code to
            publish here even if we wanted to, and publishing one would let
            anyone buy a reserved space. The code stays in the SDDA's approval
            email; this block only tells them where to spend it. */}
        <div className="mt-4 rounded-xl border border-stone-300 bg-white p-5">
          <p className="font-display uppercase tracking-wide text-ink mb-2">
            Already approved for Title, Gold or Silver?
          </p>
          <p className="text-stone-700 text-sm leading-relaxed">
            Your approval email from the SDDA includes an access code for your
            assigned space. To pay online, open the{' '}
            <a
              href={SPONSORSHIP_URL}
              target="_blank"
              rel="noreferrer"
              className="text-gold-dark underline font-semibold hover:text-ink"
            >
              sponsor box office
            </a>
            , choose <strong>Select Sponsorship Level</strong>, then{' '}
            <strong>Use ticket access code</strong> and enter the code from that
            email. Your sponsorship level will appear once the code is accepted.
            Lost your code? Email{' '}
            <a className="text-gold-dark underline font-semibold hover:text-ink" href="mailto:carshow@enjoysenoia.com">
              carshow@enjoysenoia.com
            </a>
            .
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
