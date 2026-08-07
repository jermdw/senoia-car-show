import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

export default function Vendors() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-2">
          Vendor <span className="text-gold">Info</span>
        </h1>
        <p className="text-stone-700 mb-8 leading-relaxed">
          Join us on Historic Main Street and serve a crowd of 8,000–10,000
          car-show visitors. Vendor applications open <strong>May 1, 2026</strong>{' '}
          and require approval from the Senoia Downtown Development Authority.
        </p>

        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
          <p className="font-display text-xl uppercase tracking-wide text-ink mb-2">
            Food Vendors
          </p>
          <p className="text-stone-700 mb-4">
            Music, food &amp; beer trucks — including The Varsity! Food vendors
            can apply directly using our online application.
          </p>
          <a
            href="https://forms.gle/RvrNwhmnMbeVQcwN6"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-gold hover:bg-gold-dark text-ink font-display font-semibold uppercase tracking-wider px-6 py-3 rounded-md transition-colors"
          >
            Food Vendors: Apply Here
          </a>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <p className="font-display text-xl uppercase tracking-wide text-ink mb-2">
            All Other Vendors
          </p>
          <p className="text-stone-700">
            For craft, retail, and other vendor opportunities, contact the
            organizers at{' '}
            <a className="underline font-semibold" href="mailto:carshow@enjoysenoia.com">
              carshow@enjoysenoia.com
            </a>{' '}
            or (770) 727-9173.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
