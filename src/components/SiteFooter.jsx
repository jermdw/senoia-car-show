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
        </div>
      </div>
      <p className="text-center pb-6 text-gold-pale/70">
        The Senoia Car Show · Est. 2005
      </p>
    </footer>
  )
}
