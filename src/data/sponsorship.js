// Sponsorships are sold on the DDA's Ticket Tailor box office, not here — same
// arrangement as vehicle registration (see registration.js), and kept as
// constants for the same reason: moving checkout is one edit, not a hunt.
//
// Points at the event "2026 Car Show Sponsors" (Ticket Tailor es_2207650 /
// ev_8250271). Note this event is deliberately absent from the public box
// office listing at tickettailor.com/events/senoiadda — it is Published and
// selling, and only reachable by this direct link. Don't conclude from the
// listing that it is offline.
export const SPONSORSHIP_URL = 'https://buytickets.at/senoiadda/2207650'

// Only the Bronze tier is on open public sale. Title, Gold and Silver are built
// in Ticket Tailor as individually numbered slots (Title 1–11, Gold 1–12,
// Silver 1–16), each quantity 1 and each gated behind a ticket access code,
// because every slot is a specific curbside space the SDDA assigns on approval.
// A logged-out buyer opening the checkout sees Bronze and nothing else — which
// is why the page sends the upper tiers through the SDDA rather than to a
// checkout that would look broken or sold out to them.
//
// This is the Ticket Tailor list price, and the TIERS table in
// pages/Sponsors.jsx has to agree with it.
export const BRONZE_PRICE = '$250'

// For the organizers, not this page: Ticket Tailor can pre-apply an access code
// via `?a=CODE`, so an approved sponsor can be sent straight to their unlocked
// tier from the SDDA's approval email:
//
//   https://www.tickettailor.com/events/senoiadda/2207650?a=<their code>
//
// Two gotchas. It only works on the www.tickettailor.com/events/… form — the
// buytickets.at short link drops the query string. And codes are *per slot*,
// not per tier: Title 2 and Gold 1 each have their own, so such a link is
// unique to one sponsor and must never be published on this site — it would
// let anyone buy that reserved curbside space.
//
// The codes themselves live in Ticket Tailor and in the SDDA's approval email,
// and belong in neither this file nor docs/. This repo is public, so a code
// committed here is a code given away; not even as an example.

