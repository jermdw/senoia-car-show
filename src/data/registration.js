// Show-vehicle registration is sold on the DDA's Ticket Tailor box office, not
// here — this site only links out to it. Kept as one constant so moving checkout
// again is a single edit rather than a hunt across pages.
//
// Points at the event "2026 Senoia Car Show Reserved & General Parking"
// (Ticket Tailor es_2164595). Its checkout is an interactive seat map, which is
// why the site links out to it rather than embedding the booking widget.
//
// This is the *direct checkout* link, not the `buytickets.at/senoiadda/2164595`
// event landing page, and that is deliberate: on phone widths Ticket Tailor
// hides the in-flow hero CTA (`.hero__content__cta { display: none }`) and
// leaves a `position: fixed; bottom: 0` bar as the only way to buy. When
// anything covers that one bar — iOS Safari's bottom toolbar, or a content
// blocker's cosmetic filter, which target exactly that shape — the page has no
// other buy button and the buyer is simply stuck. Reported by a car owner and
// reproduced on a second phone in Sept 2026. The checkout page below puts its
// Next button in `position: sticky` inside normal flow, so scrolling always
// reaches it. Same seat-map checkout, one fewer fixed bar to fail.
//
// The `chk` hash is the event's published checkout token, not a session
// artifact: it is what the landing page's own buy button points at, and a
// cookie-free browser request for it returns 200 with the live tier list. If
// registration ever 404s, re-copy it from the Ticket Tailor dashboard under the
// event's "Links & widgets".
//
// Don't check this link with curl — Ticket Tailor's edge returns 403 to every
// non-browser client, including their own homepage and a deliberately bogus
// token, so a 403 says nothing about whether the link works. It is the same
// trap as App Check on our callables. Verify from a real browser instead: a
// cookie-free `fetch(url, {credentials: 'omit'})` returns 200 and ~54kB
// containing "Non-Reserved General Parking", where a bad token returns 404 and
// ~1kB.
export const REGISTRATION_URL =
  'https://www.tickettailor.com/checkout/view-event/id/8046457/chk/bdc3/'

// Non-Reserved General Parking — the one tier a buyer can purchase without an
// access code, and so the only price the public pages should quote. The Main
// Street and North Main blocks are fixed-size and sold out; the car-corral
// tiers are access-code blocks held for car clubs. This is Ticket Tailor's list
// price, and the /show pricing table has to agree with it.
export const REGISTRATION_PRICE = '$20'
