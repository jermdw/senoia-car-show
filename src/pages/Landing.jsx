import { Link } from 'react-router-dom'
import logo from '../assets/logo-dark-bg.png'

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink text-cream flex flex-col">
      <header className="flex justify-end px-5 pt-4">
        <Link
          to="/admin"
          className="text-gold-pale/60 hover:text-gold-pale text-sm font-display tracking-wide uppercase"
        >
          Organizers
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <img
          src={logo}
          alt="The Senoia Car Show — Main Street, Senoia, GA. Established 2005."
          className="w-72 sm:w-96 max-w-full mb-6 drop-shadow-[0_4px_24px_rgba(173,132,31,0.25)]"
        />
        <p className="font-script text-gold text-3xl sm:text-4xl mb-2">
          Historic Downtown Senoia
        </p>
        <p className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-cream mb-1">
          Saturday, September 26, 2026 &middot; 10am&ndash;4pm
        </p>
        <p className="font-display text-lg uppercase tracking-widest text-gold-pale/80 mb-10">
          21st Annual &middot; Free Spectator Admission
        </p>
        <Link
          to="/volunteer"
          className="bg-gold hover:bg-gold-dark text-ink font-display font-semibold text-xl uppercase tracking-wider px-10 py-4 rounded-md shadow-lg transition-colors"
        >
          Volunteer Sign-Up
        </Link>
        <p className="mt-10 text-gold-pale/60 text-sm max-w-md">
          600+ collector cars &amp; trucks on Historic Main Street. Full event
          details coming soon.
        </p>
      </main>
      <footer className="text-center py-6 text-gold-pale/50 text-sm">
        Questions?{' '}
        <a className="underline hover:text-gold-pale" href="mailto:carshow@enjoysenoia.com">
          carshow@enjoysenoia.com
        </a>
      </footer>
    </div>
  )
}
