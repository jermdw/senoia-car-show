// Show-vehicle registration is sold on the DDA's Ticket Tailor box office, not
// here — this site only links out to it. Kept as one constant so moving checkout
// again is a single edit rather than a hunt across pages.
//
// Points at the event "2026 Senoia Car Show Reserved & General Parking"
// (Ticket Tailor es_2164595). Its checkout is an interactive seat map, which is
// why the site links out to it rather than embedding the booking widget.
export const REGISTRATION_URL = 'https://buytickets.at/senoiadda/2164595'

// Non-Reserved General Parking — the one tier a buyer can purchase without an
// access code, and so the only price the public pages should quote. The Main
// Street and North Main blocks are fixed-size and sold out; the car-corral
// tiers are access-code blocks held for car clubs. This is Ticket Tailor's list
// price, and the /show pricing table has to agree with it.
export const REGISTRATION_PRICE = '$20'
