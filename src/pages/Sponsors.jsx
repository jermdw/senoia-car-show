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
import patriotLogo from '../assets/sponsor-patriot-performance.webp'
import sanyLogo from '../assets/sponsor-sany-america.webp'
import hotRodBrothersLogo from '../assets/sponsor-hotrod-brothers-customs.webp'
import gmpLogo from '../assets/sponsor-gmp-performance-south-atlanta.webp'
import jwRodLogo from '../assets/sponsor-jw-rod-and-customs.webp'
import fayetteHumaneLogo from '../assets/sponsor-fayette-humane-society.webp'
import poolFxLogo from '../assets/sponsor-pool-fx.webp'
import synovusLogo from '../assets/sponsor-synovus.webp'
import carlSmithLogo from '../assets/sponsor-carl-smith-and-sons.webp'
import flintGrindersLogo from '../assets/sponsor-flint-grinders.webp'
import anytimeFitnessLogo from '../assets/sponsor-anytime-fitness.webp'
import av8Logo from '../assets/sponsor-av8-precision-coatings.webp'
import westsideLogo from '../assets/sponsor-westside-shower-and-bath.webp'
import senoiaSimRacingLogo from '../assets/sponsor-senoia-sim-racing.webp'

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
      // is the branch's own "GMP Performance / South Atlanta" lockup, from the
      // profile image of the Facebook page GMP runs for this location; the
      // chain-wide wordmark we showed before read to the sponsor as plain
      // text (2026-09-24). Links to the home page: /locations was
      // replaced by an empty WordPress install in Sept 2026 and the sponsor
      // flagged that the link no longer reached their site.
      { name: 'GMP Performance – South Atlanta', logo: gmpLogo, w: 400, h: 150, url: 'https://www.gmpperformance.com/' },
      // Confirmed as Jody Wilkerson's Sharpsburg GA shop (Facebook
      // facebook.com/jwrodncustoms, contact jwrodncustoms@yahoo.com). Placed
      // in Gold per explicit instruction, though the internal plaque list
      // had them in Silver. No standalone website — the logo is their
      // Facebook profile photo, a shop-sign photograph of their "JW" mark.
      { name: 'JW Rod & Customs', logo: jwRodLogo, w: 400, h: 263, url: 'https://www.facebook.com/jwrodncustoms' },
      // Slot G10 (Senoia Marquee), paid. A franchise trades under the national
      // brand mark, so the corporate logo is the right artwork; this file is the
      // one the same sponsor's PorchFest 2026 listing uses (rasterized from the
      // SVG anytimefitness.com serves). The URL is the Senoia club's own page,
      // not the corporate home page — the SDDA confirmed that club as the
      // sponsor for PorchFest. It still read "Opening Soon" on 2026-09-14.
      {
        name: 'Anytime Fitness',
        logo: anytimeFitnessLogo,
        w: 400,
        h: 107,
        url: 'https://www.anytimefitness.com/locations/senoia-georgia-5654',
      },
      // Confirmed as the Peachtree City/Newnan/Fayetteville pool builder
      // (swimmingpoolfx.com, owner Joey Massengale), serving Fayette/Coweta
      // County — not an unrelated national "PoolFX". Gold, not Silver, per the
      // organizers (2026-09-16).
      { name: 'Pool FX', logo: poolFxLogo, w: 400, h: 580, url: 'https://swimmingpoolfx.com/' },
      // The iRacing simulator venue at 48 Main St (lower level), downtown
      // Senoia — confirmed by the supplied artwork matching the SSR logo on
      // senoiasimracing.com. Like HotRod Brothers, they only publish a
      // white-knockout mark, so the white ink was recoloured black; the red
      // arcs are untouched. Added to Gold per the organizers (2026-09-23).
      {
        name: 'Senoia Sim Racing',
        logo: senoiaSimRacingLogo,
        w: 400,
        h: 101,
        url: 'https://senoiasimracing.com/',
      },
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
      // Woodbury GA forestry/stump grinding business. Artwork supplied by the
      // organizers (Sept 2026), trimmed of its white margin. URL supplied by
      // the organizers and confirmed by the site's own name, Woodbury GA
      // address and forestry-mulching/stump-grinding services.
      { name: 'Flint! Grinders LLC', logo: flintGrindersLogo, w: 400, h: 239, url: 'https://flintgrinders.com/' },
      // Slot S4 (Seavy & Baggerly N2), paid. The organizers' 2026 row
      // abbreviates this to "Community Church"; the full name confirmed by the
      // organizers is Community Bible Church, matching the 2024 rows and the
      // contact's own address (brooks.everett@communitybiblechurch.com).
      { name: 'Community Bible Church' },
      // Slot S6 (Seavy & Baggerly N4), paid. One business, two storefronts,
      // one duck: it also trades as Westside Construction. Listed under the
      // organizers' spelling and linked to the matching site per their
      // instruction (2026-09-22) — so if artwork or a row arrives later as
      // "Westside Construction", it belongs on THIS row, not a new one.
      //
      // Each storefront runs its own variant of the same duck-and-script mark,
      // with its own number, which is how they were tied together:
      //   westsideshowerandbath.com  shower/bath only, 770-676-BATH (linked)
      //   westsideconstruction.net   + roof/tub, "SHOWER·BATH·ROOFING·
      //                              CONSTRUCTION", 877-71-WESTSIDE
      // The artwork here is the combined variant the organizers supplied
      // (Sept 2026), so the cell shows the 877 number while the link goes to
      // the 770 site. That is the sponsor's own file and the organizers' own
      // link choice — not a mismatch to "fix".
      { name: 'Westside Shower & Bath', logo: westsideLogo, w: 400, h: 295, url: 'https://westsideshowerandbath.com/' },
      // Slot S17 (Snap Fitness), committed by invoice. Weaker standing than
      // the other committed entries here: the organizers' list notes no access
      // code has been issued yet. Included because `committed` is this page's
      // existing inclusion bar (Flint! Grinders, JW Rod, GMP, Synovus and SANY
      // are all on the page on that basis); drop it if the organizers would
      // rather hold until payment. Logo is the sponsor's own dark-lettering
      // artwork, sent by owner Rob Tuck and forwarded by Steve on 2026-09-12.
      // The URL is not the domain in his email (av8pc.com is an unfinished
      // placeholder with a broken certificate); av8precisioncoatings.com is the
      // live site, and it names the same Peachtree City Cerakote shop.
      { name: 'AV8 Precision Coatings', logo: av8Logo, w: 400, h: 175, url: 'https://av8precisioncoatings.com/' },
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

export default function Sponsors() {
  usePageMeta({
    title: '2026 Sponsors | Senoia Car Show',
    description:
      'Thank you to the sponsors of the 21st Annual Senoia Car Show, held September 26, 2026 on Historic Main Street in Senoia, Georgia.',
    path: '/sponsors',
  })

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-2">
          Thank You, <span className="text-gold">Sponsors</span>
        </h1>
        <p className="text-stone-700 mb-8 leading-relaxed max-w-2xl">
          The 2026 show was free for spectators because of the businesses below.
          Their sponsorships support the Senoia Downtown Development Authority
          and downtown preservation &mdash; please thank them with your business.
        </p>

        <h2 className="font-display text-3xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-2">
          Our 2026 <span className="text-gold">Sponsors</span>
        </h2>
        <p className="font-script text-gold text-2xl mb-6">Thank you for supporting the show!</p>
        {SPONSORS_2026.map(({ tier, cell, sponsors }) => (
          <section key={tier} className="mb-8">
            <h3 className="font-display text-xl uppercase tracking-wide text-gold-dark mb-3">{tier}</h3>
            <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {sponsors.map(({ name, logo, w, h, url }) => {
                const LogoWrapper = url ? 'a' : 'div'
                return (
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
                    // A logo with no confirmed `url` renders in a plain div — an
                    // href-less <a> is neither a link nor honest.
                    <LogoWrapper
                      href={url}
                      // Only http(s) links leave the site; a `tel:` sponsor (Superior
                      // Tree Service has no website) hands off to the phone app and
                      // must not also open a blank tab. Mirrors the same guard in
                      // pages/Faq.jsx.
                      {...(url?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
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
                    </LogoWrapper>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center">
                      <span className="font-display uppercase tracking-wide text-ink">{name}</span>
                    </div>
                  )}
                </li>
                )
              })}
            </ul>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  )
}
