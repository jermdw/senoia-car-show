import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-20 w-full text-center">
        <p className="font-script text-gold text-4xl mb-2">Wrong turn!</p>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink mb-4">
          Page Not Found
        </h1>
        <p className="text-stone-700 mb-8">
          That page doesn't exist — it may have moved. Try the menu above, or
          head back to the home page.
        </p>
        <Link
          to="/"
          className="inline-block bg-gold hover:bg-gold-dark text-ink font-display font-semibold uppercase tracking-wider px-8 py-3 rounded-md transition-colors"
        >
          Back to Home
        </Link>
      </main>
      <SiteFooter />
    </div>
  )
}
