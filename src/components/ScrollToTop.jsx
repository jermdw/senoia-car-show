import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// The header is sticky, so without this a click from mid-page lands the next
// page at the same scroll offset instead of at its heading. Back/Forward (POP)
// is left alone so the browser can restore where the visitor was.
//
// A hash (`/poker-run#tickets`) wins over top-of-page: React Router doesn't do
// fragment scrolling itself, and on a cold load the browser's own attempt races
// the SPA render. Targets carry `scroll-mt-*` to clear the sticky header.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  useEffect(() => {
    if (navigationType === 'POP') return
    const target = hash && document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash, navigationType])
  return null
}
