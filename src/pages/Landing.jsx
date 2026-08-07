import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-amber-400 font-semibold tracking-widest uppercase text-sm mb-4">
          21st Annual
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 font-serif">
          Senoia Car Show
        </h1>
        <p className="text-xl sm:text-2xl text-slate-300 mb-2">
          Saturday, September 26, 2026 &middot; 10:00 AM
        </p>
        <p className="text-lg text-slate-400 mb-10">
          Historic Downtown Senoia, Georgia
        </p>
        <Link
          to="/volunteer"
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-colors"
        >
          Volunteer Sign-Up
        </Link>
        <p className="mt-10 text-slate-500 text-sm max-w-md">
          600+ collector and classic vehicles on display. Free public admission
          and spectator parking. Full event details coming soon.
        </p>
      </main>
      <footer className="text-center py-6 text-slate-600 text-sm">
        Questions? <a className="underline hover:text-slate-400" href="mailto:carshow@enjoysenoia.com">carshow@enjoysenoia.com</a>
      </footer>
    </div>
  )
}
