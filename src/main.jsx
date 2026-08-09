import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing.jsx'
import Volunteer from './pages/Volunteer.jsx'
import Cancel from './pages/Cancel.jsx'
import Admin from './pages/Admin.jsx'
import Show from './pages/Show.jsx'
import Sponsors from './pages/Sponsors.jsx'
import Vendors from './pages/Vendors.jsx'
import Merch from './pages/Merch.jsx'
import NotFound from './pages/NotFound.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error, info) {
    console.error('render error', error, info)
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-stone-700">
        <p>
          Something went wrong. Please refresh the page, or email{' '}
          <a className="underline" href="mailto:carshow@enjoysenoia.com">carshow@enjoysenoia.com</a>.
        </p>
      </div>
    )
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/show" element={<Show />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
