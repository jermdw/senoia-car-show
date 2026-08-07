import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

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
          and keep the show free for spectators. Applications open{' '}
          <strong>May 1, 2026</strong> and require approval by the SDDA.
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

        <p className="mt-8 text-stone-700">
          Ready to sponsor, or have questions? Email{' '}
          <a className="underline font-semibold" href="mailto:carshow@enjoysenoia.com">
            carshow@enjoysenoia.com
          </a>{' '}
          or call the Welcome Center at (770) 727-9173.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
