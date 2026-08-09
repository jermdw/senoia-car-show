import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// The header is sticky, so without this a click from mid-page lands the next
// page at the same scroll offset instead of at its heading. Back/Forward (POP)
// is left alone so the browser can restore where the visitor was.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])
  return null
}
