import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo-dark-bg.png'

const LINKS = [
  { to: '/show', label: 'Show Info' },
  { to: '/map', label: 'Show Day' },
  { to: '/sponsors', label: 'Sponsors' },
  { to: '/vendors', label: 'Vendors' },
  { to: '/merch', label: 'Merch' },
  { to: '/volunteer', label: 'Volunteer' },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `font-display uppercase tracking-wide px-3 py-2 transition-colors ${
      isActive ? 'text-gold' : 'text-cream hover:text-gold-pale'
    }`

  return (
    <header className="bg-ink sticky top-0 z-40 shadow-lg shadow-black/30">
      <div className="max-w-5xl mx-auto flex items-center gap-2 px-4 py-2">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <img src={logo} alt="The Senoia Car Show — home" className="h-14 w-auto" />
        </Link>
        <nav className="hidden md:flex flex-1 justify-end items-center">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            className="ml-3 text-gold-pale/50 hover:text-gold-pale text-xs font-display uppercase tracking-wide"
          >
            Organizers
          </Link>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
          className="md:hidden ml-auto text-cream text-3xl leading-none px-2"
        >
          ☰
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-gold/20 px-4 pb-3 flex flex-col">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="px-3 py-2 text-gold-pale/50 text-sm font-display uppercase tracking-wide"
          >
            Organizers
          </Link>
        </nav>
      )}
    </header>
  )
}
