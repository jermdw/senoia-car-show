import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import bmwLogo from '../assets/sponsor-bmw-south-atlanta.png'

const SPONSORS_2026 = [
  {
    tier: 'Title Sponsors',
    names: ['BMW of South Atlanta', 'Carolina Handling', 'Landmark Dodge'],
    logos: { 'BMW of South Atlanta': bmwLogo },
  },
  {
    tier: 'Gold Sponsors',
    names: ['Cycle Specialty', 'SAFEbuilt', 'Atlanta Auto Restoration', 'TDK Components USA', "Kelly's Automotive Repair"],
  },
  {
    tier: 'Bronze Sponsors',
    names: ['Clarissa Uhl – Realtor', "Crook's Tire & Auto"],
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

        <h2 className="font-display text-3xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mt-14 mb-2">
          Our 2026 <span className="text-gold">Sponsors</span>
        </h2>
        <p className="font-script text-gold text-2xl mb-6">Thank you for supporting the show!</p>
        {SPONSORS_2026.map(({ tier, names, logos }) => (
          <section key={tier} className="mb-8">
            <h3 className="font-display text-xl uppercase tracking-wide text-gold-dark mb-3">{tier}</h3>
            <ul className={`grid gap-4 ${tier === 'Title Sponsors' ? 'sm:grid-cols-3' : 'sm:grid-cols-3 lg:grid-cols-4'}`}>
              {names.map((name) => (
                <li
                  key={name}
                  className={`bg-white rounded-xl border border-stone-200 flex items-center justify-center text-center px-4 ${
                    tier === 'Title Sponsors' ? 'py-6 min-h-28' : 'py-4'
                  }`}
                >
                  {logos?.[name] ? (
                    <img src={logos[name]} alt={name} className="max-h-20 w-auto max-w-full" />
                  ) : (
                    <span className={`font-display text-ink ${tier === 'Title Sponsors' ? 'text-xl' : ''}`}>
                      {name}
                    </span>
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
