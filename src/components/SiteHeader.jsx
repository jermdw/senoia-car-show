import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/logo-header.webp'
import { warmRoute } from '../lib/routeLoaders.js'
import { hasShowDayArrived } from '../lib/showTime.js'
import AnnouncementBanner from './AnnouncementBanner.jsx'

// Start fetching a lazily-loaded route's chunk as soon as intent is visible, so the
// navigation itself feels instant. Pointer-down covers touch, where there is no hover.
const prefetch = (to) => ({
  onPointerEnter: () => warmRoute(to),
  onPointerDown: () => warmRoute(to),
  onFocus: () => warmRoute(to),
})

// Direct top-level links. Kept to seven so the md band (768–~830px, iPad
// portrait) still fits them without wrapping — see the "More" dropdown below
// for how an eighth and ninth link (Poker Run, Merch) get out of the way.
// `hideOnShowDay`/`showOnShowDay` links are filtered in the component by
// hasShowDayArrived(): Volunteer and Poker Run stop being actionable once the
// show starts, and Awards (dead air until the 3pm ceremony) isn't worth a slot
// before then — see AwardsAdmin's staged/announced flow for why.
const LINKS = [
  { to: '/show', label: 'Show Info' },
  { to: '/map', label: 'Show Day' },
  { to: '/sponsors', label: 'Sponsors' },
  { to: '/vendors', label: 'Vendors' },
  { to: '/volunteer', label: 'Volunteer', hideOnShowDay: true },
  { to: '/faq', label: 'FAQ' },
  { to: '/awards', label: 'Awards', showOnShowDay: true },
]

// Lower-traffic links tucked behind "More" on the inline desktop/tablet bar
// so LINKS above can stay at seven. The mobile hamburger menu below ignores
// this grouping and lists everything flat, since a vertical list has no
// width constraint to work around.
const MORE_LINKS = [
  { to: '/poker-run', label: 'Poker Run', hideOnShowDay: true },
  { to: '/merch', label: 'Merch' },
]

const isVisible = (l, showDayArrived) =>
  l.showOnShowDay ? showDayArrived : !(l.hideOnShowDay && showDayArrived)

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef(null)
  const location = useLocation()
  // Recomputed per render (route change, remount) rather than on a running
  // timer — a stale nav for the remainder of a session someone had open
  // before 10am is an acceptable trade for not polling the clock all day.
  const showDayArrived = hasShowDayArrived()
  const links = LINKS.filter((l) => isVisible(l, showDayArrived))
  const moreLinks = MORE_LINKS.filter((l) => isVisible(l, showDayArrived))
  const allLinks = [...links.slice(0, 2), ...moreLinks, ...links.slice(2)]

  useEffect(() => {
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!moreOpen) return
    const onClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return
      setMoreOpen(false)
      moreRef.current?.querySelector('button')?.focus()
    }
    document.addEventListener('pointerdown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [moreOpen])

  const linkClass = ({ isActive }) =>
    `font-display uppercase tracking-wide whitespace-nowrap px-2 lg:px-3 py-2 transition-colors ${
      isActive ? 'text-gold' : 'text-cream hover:text-gold-pale'
    }`

  const moreLinkClass = ({ isActive }) =>
    `block font-display uppercase tracking-wide whitespace-nowrap px-4 py-2 transition-colors ${
      isActive ? 'text-gold' : 'text-cream hover:text-gold-pale'
    }`

  return (
    // print:static — a sticky header prints wherever the viewport left it, which
    // dropped the bar into the middle of the show day guide's printed handout.
    // Static keeps it as a masthead at the top; the nav itself is dead ink on paper.
    <header className="bg-ink sticky top-0 z-40 shadow-lg shadow-black/30 print:static print:shadow-none">
      <div className="max-w-5xl mx-auto flex items-center gap-2 px-4 py-2">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <img src={logo} alt="The Senoia Car Show — home" className="h-14 w-auto" />
        </Link>
        <nav className="hidden md:flex flex-1 justify-end items-center print:hidden">
          {links.slice(0, 2).map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} {...prefetch(l.to)}>
              {l.label}
            </NavLink>
          ))}
          <div
            className="relative"
            ref={moreRef}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setMoreOpen(false)
            }}
          >
            <button
              id="more-nav-button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-controls="more-nav-panel"
              className={`font-display uppercase tracking-wide whitespace-nowrap px-2 lg:px-3 py-2 transition-colors ${
                moreOpen || moreLinks.some((l) => l.to === location.pathname)
                  ? 'text-gold'
                  : 'text-cream hover:text-gold-pale'
              }`}
            >
              More ▾
            </button>
            {moreOpen && (
              // A plain disclosure panel of ordinary nav links, not an ARIA
              // menu widget — role="menu" implies arrow-key/Home/End
              // navigation and Escape-to-close that this doesn't implement,
              // which would announce as "menu" to screen readers while
              // behaving like a static list. Escape and outside-click/blur
              // still close it (see the effect above and onBlur here).
              <div
                id="more-nav-panel"
                aria-labelledby="more-nav-button"
                className="absolute right-0 top-full mt-1 bg-ink border border-gold/20 rounded-md shadow-lg py-1 min-w-max"
              >
                {moreLinks.map((l) => (
                  <NavLink key={l.to} to={l.to} className={moreLinkClass} {...prefetch(l.to)}>
                    {l.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          {links.slice(2).map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} {...prefetch(l.to)}>
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            {...prefetch('/admin')}
            className="ml-3 text-gold-pale/70 hover:text-gold-pale text-xs font-display uppercase tracking-wide"
          >
            Organizers
          </Link>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
          className="md:hidden ml-auto text-cream text-3xl leading-none px-2 print:hidden"
        >
          ☰
        </button>
      </div>
      <AnnouncementBanner />
      {open && (
        // print:hidden too — the toggle that opened this is itself hidden on paper,
        // so an open menu would print as an unexplained list of links.
        <nav className="md:hidden border-t border-gold/20 px-4 pb-3 flex flex-col print:hidden">
          {allLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={linkClass}
              onClick={() => setOpen(false)}
              {...prefetch(l.to)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            {...prefetch('/admin')}
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
