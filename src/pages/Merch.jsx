import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import ShirtMockup from '../components/ShirtMockup.jsx'
import annualMockup from '../assets/shirt-21st-mockup.webp'
import a250Art from '../assets/shirt-a250-art.webp'
import kidsArt from '../assets/shirt-kids-art.webp'

// Square back/front prints need a wider box than the default tall front art.
const SQUARE_ART = { x: 116, y: 112, width: 168, height: 172 }

export default function Merch() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-8">
          Show <span className="text-gold">Merch</span>
        </h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-xl border border-stone-200 p-6 text-center flex flex-col">
            <img
              src={annualMockup}
              alt="21st Annual show shirt, front and back, on a blue tee"
              width="720"
              height="383"
              className="w-full max-w-xs mx-auto mb-4 mt-6"
            />
            <p className="font-display text-xl uppercase tracking-wide text-ink">
              21st Annual Show T-Shirt
            </p>
            <p className="font-display text-3xl text-gold-dark my-2">$20</p>
            <p className="text-stone-700 text-sm">Unisex cut · China Blue · Sizes SM–3XL</p>
            <p className="text-stone-600 text-sm mt-2">
              Need 4XL? Email{' '}
              <a className="underline" href="mailto:welcome@enjoysenoia.com">welcome@enjoysenoia.com</a>
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6 text-center flex flex-col">
            <ShirtMockup
              className="w-48 mx-auto mb-4"
              shirt="#9A9BA0"
              shade="#84858C"
              art={a250Art}
              artBox={SQUARE_ART}
            />
            <p className="font-display text-xl uppercase tracking-wide text-ink">
              America 250 T-Shirt
            </p>
            <p className="text-stone-700 text-sm mt-2">
              Celebrating 250 years of America — full back print with the show
              logo on the front chest. Granite tee.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6 text-center flex flex-col">
            <ShirtMockup
              className="w-48 mx-auto mb-4"
              shirt="#045EB4"
              shade="#034E96"
              art={kidsArt}
              artBox={SQUARE_ART}
            />
            <p className="font-display text-xl uppercase tracking-wide text-ink">
              Kids&rsquo; Racer T-Shirt
            </p>
            <p className="text-stone-700 text-sm mt-2">
              Three furry racers on a royal blue tee, just for the young
              gearheads.
            </p>
          </div>
        </div>

        <p className="text-stone-700 text-center mt-8">
          All shirts available at the merchandise tent on show day — proceeds
          support downtown Senoia.
        </p>

        <div className="bg-white rounded-xl border border-stone-200 p-5 mt-8 flex items-center gap-5 max-w-xl mx-auto">
          <ShirtMockup className="w-20 shrink-0" />
          <p className="text-stone-700 text-sm">
            Rather earn one?{' '}
            <span className="font-semibold">Volunteers get their own shirt free</span>{' '}
            as a thank-you.{' '}
            <Link to="/volunteer" className="underline text-gold-dark">
              Claim a shift
            </Link>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
