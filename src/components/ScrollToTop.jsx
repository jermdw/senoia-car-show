import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// The header is sticky, so without this a click from mid-page lands the next
// page at the same scroll offset instead of at its heading. Back/Forward (POP)
// is left alone so the browser can restore where the visitor was.
//
// A hash (`/poker-run#tickets`, `/faq#car-haulers`) wins over top-of-page: React
// Router doesn't do fragment scrolling itself, and the browser can't do it either
// because the target isn't in the document the server sent — it appears a render
// later. Targets carry `scroll-mt-*` to clear the sticky header.
//
// The hash is handled BEFORE the POP check, deliberately. React Router reports the
// very first navigation of a session as POP, so an early return there swallowed
// every deep link that arrived cold — pasted into an email, texted, or scanned off
// a sign — which is the only way most of them are ever opened.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1))
    if (target) {
      target.scrollIntoView()
      return
    }
    if (navigationType === 'POP') return
    window.scrollTo(0, 0)
  }, [pathname, hash, navigationType])
  return null
}
