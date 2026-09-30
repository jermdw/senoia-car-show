// Conversion events for GA4, pushed through the same dataLayer as page views.
// GTM's "Custom Event" triggers for `ticket_click` and `volunteer_signup` turn
// them into GA4 events, which are then marked as key events in GA4 Admin.
//
// Everything here is PII-safe by construction: a link is reduced to a
// destination *type* plus host and path — never the query string, because
// sponsor approval links carry a per-slot access code (`?a=SCSSG1`) — and the
// volunteer event carries the role and day, never the volunteer.

// Ticket Tailor event ids (see docs), so a click is labelled by what is being
// bought rather than by a URL that changed shape three times this year.
const TICKET_TAILOR_EVENTS = {
  8046457: 'car_registration', // 2026 Senoia Car Show Reserved & General Parking
  2164595: 'car_registration', // same event, as the buytickets.at short id
  8250271: 'sponsorship', // 2026 Car Show Sponsors
  2207650: 'sponsorship', // same event, as the buytickets.at short id
  8250262: 'food_registration', // Senoia Car Show Food Registration
  2207639: 'food_registration', // same event, as the buytickets.at short id
}

const isHost = (host, root) => host === root || host.endsWith(`.${root}`)

// Returns the GA4 parameters for a click on `href`, or null when the link is
// not a ticket destination worth counting. GA4's enhanced measurement already
// records generic outbound clicks; this exists to say *which* purchase.
export function ticketClickParams(href, pageOrigin) {
  let url
  try {
    url = new URL(href, pageOrigin)
  } catch {
    return null
  }
  const host = url.hostname.toLowerCase()

  let linkType = null
  if (isHost(host, 'tickettailor.com') || isHost(host, 'buytickets.at')) {
    const id = url.pathname.match(/\d{6,}/)?.[0]
    linkType = TICKET_TAILOR_EVENTS[id] ?? 'tickets_other'
  } else if (isHost(host, 'senoiahistory.com') && url.pathname.startsWith('/embed/tickets/')) {
    linkType = 'poker_run_tickets'
  }
  if (!linkType) return null

  return { link_type: linkType, link_host: host, link_path: url.pathname }
}

function push(event, params) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}

export function pushTicketClick(params) {
  push('ticket_click', { ...params, page_path: window.location.pathname })
}

// Role and day only. The signup itself (name, email, phone) stays in Firestore.
export function pushVolunteerSignup(shift) {
  push('volunteer_signup', {
    shift_role: shift.role,
    shift_day: shift.day,
    page_path: window.location.pathname,
  })
}

// One delegated listener covers every Register / Sponsor / Tickets link on every
// page, present and future, so a new button needs no wiring. `auxclick` catches
// middle-click, which opens the link in a new tab without firing `click`.
// Production only, like initGtm: dev clicks must not reach the live property.
export function initTicketClickTracking() {
  const onClick = (e) => {
    const link = e.target instanceof Element ? e.target.closest('a[href]') : null
    if (!link) return
    const params = ticketClickParams(link.href, window.location.origin)
    if (params) pushTicketClick(params)
  }
  document.addEventListener('click', onClick)
  document.addEventListener('auxclick', onClick)
}
