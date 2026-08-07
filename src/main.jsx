import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing.jsx'
import Volunteer from './pages/Volunteer.jsx'
import Cancel from './pages/Cancel.jsx'
import Admin from './pages/Admin.jsx'

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
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
