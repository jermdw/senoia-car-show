import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

export default function Vendors() {
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
            Our vendor lineup for the 2026 show is full. Thank you to everyone
            who applied — we'll announce next year's application window here.
          </p>
        </div>

        <p className="text-stone-700 mb-6 leading-relaxed">
          Come hungry: the show features music, food &amp; beer trucks —
          including The Varsity — plus local shops and restaurants open all
          along Historic Main Street.
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
