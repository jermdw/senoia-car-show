import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import carArt from '../assets/car-art.png'

export default function Merch() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-8">
          Show <span className="text-gold">Merch</span>
        </h1>

        <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
          <img src={carArt} alt="Senoia Car Show hot rod artwork" className="max-w-xs w-full mx-auto mb-6" />
          <p className="font-display text-2xl uppercase tracking-wide text-ink">
            21st Annual Senoia Car Show T-Shirt
          </p>
          <p className="font-display text-3xl text-gold-dark my-2">$20</p>
          <p className="text-stone-700 mb-1">Unisex cut · China Blue · Sizes SM–3XL</p>
          <p className="text-stone-600 text-sm mb-6">
            Need 4XL? Email{' '}
            <a className="underline" href="mailto:welcome@enjoysenoia.com">welcome@enjoysenoia.com</a>
          </p>
          <p className="text-stone-700">
            Available at the merchandise tent on show day — proceeds support
            downtown Senoia.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
