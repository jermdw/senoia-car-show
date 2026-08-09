import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// The header is sticky, so without this a click from mid-page lands the next
// page at the same scroll offset instead of at its heading.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}
