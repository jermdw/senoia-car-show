import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Show from './pages/Show.jsx'
import PokerRun from './pages/PokerRun.jsx'
import EventMap from './pages/EventMap.jsx'
import Sponsors from './pages/Sponsors.jsx'
import Vendors from './pages/Vendors.jsx'
import Merch from './pages/Merch.jsx'
import Faq from './pages/Faq.jsx'
import NotFound from './pages/NotFound.jsx'
import { ROUTE_LOADERS } from './lib/routeLoaders.js'

// These four are the only routes that touch Firebase, and importing
// `src/firebase.js` has side effects (initializeApp, App Check, emulator wiring).
// Loading them lazily keeps the ~169 kB gzipped Firebase SDK out of the chunk every
// spectator downloads on show day — none of the public pages above need it.
const Awards = lazy(ROUTE_LOADERS['/awards'])
const Volunteer = lazy(ROUTE_LOADERS['/volunteer'])
const Cancel = lazy(ROUTE_LOADERS['/cancel'])
const Admin = lazy(ROUTE_LOADERS['/admin'])

// The fallback stands in for the page that is about to mount, so it has to
// match that page's background. The awards board is ink and is the one lazy
// route usually opened cold — from a QR code on show-day signage, with no
// hover to warm the chunk first — where a cream flash reads as a broken load.
function RouteFallback() {
  const { pathname } = useLocation()
  return <div className={`min-h-screen ${pathname === '/awards' ? 'bg-ink' : 'bg-cream'}`} />
}

export default function AppRoutes() {
  return (
    // Only the lazy routes suspend, so the eager public pages never flash this.
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/show" element={<Show />} />
        <Route path="/poker-run" element={<PokerRun />} />
        <Route path="/map" element={<EventMap />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
