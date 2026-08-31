import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-gold-pale/70 text-sm">
      <div className="max-w-5xl mx-auto px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-display uppercase tracking-wide text-cream mb-2">Contact</p>
          <p>
            <a className="underline hover:text-gold-pale" href="mailto:carshow@enjoysenoia.com">
              carshow@enjoysenoia.com
            </a>
          </p>
          <p>
            <a className="underline hover:text-gold-pale" href="tel:+17707279173">(770) 727-9173</a>
          </p>
          <p className="mt-1">PO Box 310, Senoia, GA 30276</p>
          {/* The header bar is full at seven links, so the FAQ reaches every page
              from here instead — it is the answer to most of what arrives in that
              inbox, and it should be visible next to the address people write to. */}
          <p className="mt-3">
            <Link className="underline hover:text-gold-pale" to="/faq">
              Frequently asked questions
            </Link>
          </p>
        </div>
        <div>
          <p className="font-display uppercase tracking-wide text-cream mb-2">The Show</p>
          <p>Saturday, September 26, 2026 · 10am–4pm</p>
          <p>Historic Main Street, Senoia, Georgia</p>
          <p className="mt-1">Free spectator admission &amp; parking</p>
        </div>
        <div>
          <p className="font-display uppercase tracking-wide text-cream mb-2">About</p>
          <p>
            Presented by the Senoia Downtown Development Authority. Proceeds
            support downtown preservation. Please visit our local shops and
            restaurants!
          </p>
          <p className="mt-2">
            Also from the DDA:{' '}
            <a className="underline hover:text-gold-pale" href="https://senoiaporchfest.org">
              Senoia PorchFest
            </a>{' '}
            · Sun, Sept 6
          </p>
        </div>
      </div>
      <p className="text-center pb-6 text-gold-pale/70">
        The Senoia Car Show · Est. 2005
      </p>
    </footer>
  )
}
