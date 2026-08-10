import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Show from './pages/Show.jsx'
import EventMap from './pages/EventMap.jsx'
import Sponsors from './pages/Sponsors.jsx'
import Vendors from './pages/Vendors.jsx'
import Merch from './pages/Merch.jsx'
import { ROUTE_LOADERS } from './lib/routeLoaders.js'

// These three are the only routes that touch Firebase, and importing
// `src/firebase.js` has side effects (initializeApp, App Check, emulator wiring).
// Loading them lazily keeps the ~169 kB gzipped Firebase SDK out of the chunk every
// spectator downloads on show day — none of the public pages above need it.
const Volunteer = lazy(ROUTE_LOADERS['/volunteer'])
const Cancel = lazy(ROUTE_LOADERS['/cancel'])
const Admin = lazy(ROUTE_LOADERS['/admin'])

export default function AppRoutes() {
  return (
    // Only the lazy routes suspend, so the eager public pages never flash this.
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/show" element={<Show />} />
        <Route path="/map" element={<EventMap />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Suspense>
  )
}
