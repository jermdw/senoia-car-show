// Frequently asked questions for /faq.
//
// Source of truth is the same as everywhere else on this site: the organizers.
// Every fact below already appears in `src/data/eventMap.js`, `src/pages/Show.jsx`
// or `src/data/registration.js` — this file re-states them in the words people
// actually ask in, it does not introduce new ones. Per CLAUDE.md, never invent or
// extrapolate an event fact to fill a gap here; leave the question out instead.
//
// Two answers came directly from the organizers (2026-08-31), prompted by Tom
// Duncan's email about the American Legion tent at M10:
//   - non-profit exhibitors in the Main Street median load in through the
//     Sponsor Gate (Seavy & Pylant) from 6:00am;
//   - General Parking spaces are not pre-assigned — either show-car gate works
//     and marshals direct each car on arrival.
// Both are reflected in eventMap.js too, so the map and the FAQ can't drift.
//
// `confirmed: false` follows the eventMap.js convention: the entry is a working
// draft, is NOT rendered, and is not emitted in the FAQPage structured data.
//
// Answers are plain strings, deliberately: `links` carries anything clickable
// instead of embedding markup. That keeps one copy of each answer serving both
// the page and the JSON-LD (which must be text), so the two can never disagree.
// An `href` link is external/asset, a `to` link is an in-app route.

import { REGISTRATION_URL, REGISTRATION_PRICE } from './registration.js'

export const FAQ_SECTIONS = [
  { id: 'load-in', label: 'Getting In & Setting Up' },
  { id: 'show-cars', label: 'Showing a Car' },
  { id: 'spectators', label: 'Coming to Look' },
  { id: 'weekend', label: 'The Rest of the Weekend' },
]

const EMAIL = 'carshow@enjoysenoia.com'
const PHONE = '(770) 727-9173'

export const FAQ = [
  // ---- Getting in & setting up ---------------------------------------------
  {
    id: 'car-haulers',
    section: 'load-in',
    q: 'Where do car haulers and trailers park, load and unload?',
    a: [
      'Haulers and trailers use the Tencate gravel lot on Andrews Parkway, just before Highway 74. That is the drop-off point for rigs — unload your show vehicle there, drive it into town through one of the show-car gates, and leave the hauler parked at Tencate for the day. There is no room to turn a rig around inside the street closure once Main Street fills.',
      `The Senoia Welcome Center on Main Street is where car-hauler parking and shuttle service are arranged, so get in touch ahead of show day if you are bringing one: ${EMAIL} or ${PHONE}.`,
    ],
    links: [
      { label: 'Tencate lot on the show day guide', to: '/map?poi=parking-tencate' },
      {
        label: 'Driving directions to the Tencate lot',
        href: 'https://www.google.com/maps/dir/?api=1&destination=Andrews%20Parkway%2C%20Senoia%2C%20GA%2030276',
      },
    ],
    confirmed: true,
  },
  {
    id: 'show-car-entrance',
    section: 'load-in',
    q: 'What time do the show-car gates open, and where are they?',
    a: [
      'Show-car gates open at 7:00am and close at 11:00am. No vehicle is admitted before 7:00am, and every car coming through needs its paid credential.',
      'There are two gates, and either one works: the North Gate on Main Street at Baggarly Way, by Middle Street, and the South Gate on Main Street where Travis and Gin meet it. Come in at whichever is the easier approach from your direction.',
    ],
    links: [
      { label: 'North Gate on the map', to: '/map?poi=gate-north' },
      { label: 'South Gate on the map', to: '/map?poi=gate-south' },
    ],
    confirmed: true,
  },
  {
    id: 'general-parking',
    section: 'load-in',
    q: 'I bought unreserved General Parking. Where do I go, and when?',
    a: [
      'Same gates, same hours as every other show vehicle: North Gate (Main at Baggarly Way) or South Gate (Main at Travis and Gin), 7:00am to 11:00am.',
      'General Parking spaces are not assigned in advance, so there is nothing to look up before you arrive — parking marshals at the gate direct you to an open space as you come in. Arrive early if you would like a say in where you land.',
    ],
    links: [
      { label: 'Where to check in', to: '/faq#registration-desk' },
      { label: 'North Gate on the map', to: '/map?poi=gate-north' },
      { label: 'South Gate on the map', to: '/map?poi=gate-south' },
    ],
    confirmed: true,
  },
  {
    id: 'vendor-entrance',
    section: 'load-in',
    q: 'Where do vendors enter to set up, and what time?',
    a: [
      'Food and merchandise vendors come in from the east, at the Vendor Gate on Seavy Street at Bridge Street, from 6:00am — an hour before the show-car gates open, so you can be set up before Main Street starts filling.',
      'The food court runs along Travis Street west of Main, with a few stalls out on Main near Broad and by the Welcome Center. Vendor applications for the 2026 show are closed.',
    ],
    links: [
      { label: 'Vendor Gate on the map', to: '/map?poi=gate-vendors' },
      { label: 'Vendor info', to: '/vendors' },
    ],
    confirmed: true,
  },
  {
    id: 'nonprofit-entrance',
    section: 'load-in',
    q: 'I am a non-profit with a tent in the Main Street median. Which entrance do I use?',
    a: [
      'Non-Profit Row sits in the Main Street median — local non-profits, veterans groups, the DDA, and the I-58 Mission food drive. Load in through the Sponsor Gate on the west side, Seavy Street at Pylant Street, from 6:00am. That is an hour ahead of the show-car gates, which is deliberate: the median has to be set before vehicles start filling Main Street on either side of it.',
      `Bring your space number with you — staff at the gate will point you to it. If you have not confirmed a space yet, or need to change one, email ${EMAIL} or call ${PHONE}.`,
    ],
    links: [
      { label: 'Sponsor Gate on the map', to: '/map?poi=gate-sponsors' },
      { label: 'Non-Profit Row on the map', to: '/map?poi=nonprofit-row' },
    ],
    confirmed: true,
  },
  {
    id: 'sponsor-entrance',
    section: 'load-in',
    q: 'Where do sponsors set up?',
    a: [
      'Sponsors enter from the west at the Sponsor Gate, Seavy Street at Pylant Street, from 6:00am — the same gate the non-profit exhibitors use.',
    ],
    links: [
      { label: 'Sponsor Gate on the map', to: '/map?poi=gate-sponsors' },
      { label: '2026 sponsors', to: '/sponsors' },
    ],
    confirmed: true,
  },
  {
    id: 'downloadable-map',
    section: 'load-in',
    q: 'Is there a map of all this I can download?',
    a: [
      'Yes. The show day guide is an interactive map of the whole venue — both show-car gates, the vendor and sponsor gates, every parking lot and shuttle route, restrooms, food, first aid — and it has a print button that saves the map together with the full list of locations and the schedule as one PDF. On a phone, pick "Save as PDF" from the print dialog (on an iPhone: Share, then Print, then Save to Files).',
      'The remote parking lots each carry a driving-directions link, and the printed copy always includes every location, even the ones you filtered out on screen.',
    ],
    links: [
      { label: 'Open the show day guide', to: '/map' },
      { label: 'Printable 2026 event flyer (PDF)', href: '/flyer-2026.pdf' },
    ],
    confirmed: true,
  },

  // ---- Showing a car --------------------------------------------------------
  {
    id: 'eligibility',
    section: 'show-cars',
    q: 'What vehicles are eligible to show?',
    a: [
      'Vehicles 25 years and older — model year 2001 or older for the 2026 show. Any make, model or condition within that.',
    ],
    links: [],
    confirmed: true,
  },
  {
    id: 'registration-cost',
    section: 'show-cars',
    q: 'What does it cost to show a car, and how do I register?',
    a: [
      `Unreserved General Parking is ${REGISTRATION_PRICE} in advance or $25 same-day. The Main Street and North Main Street blocks are fixed-size and have sold out for 2026, so General Parking is the tier still on sale.`,
      'Advance registration is online through the Senoia DDA box office. Same-day registration runs at the registration desk from 7:00 to 11:00am on show day. Registering is for show vehicles only — spectator admission and parking are always free.',
    ],
    links: [
      { label: 'Register your vehicle', href: REGISTRATION_URL },
      { label: 'Full pricing table', to: '/show' },
    ],
    confirmed: true,
  },
  {
    id: 'registration-desk',
    section: 'show-cars',
    q: 'Where do I check in once I am parked?',
    a: [
      'Every show car owner checks in at the registration desk, in the alley off Baggarly Way at Seavy Street, near 48 Main. It is open 7:00 to 11:00am.',
      'Check in by 10:00am to be eligible for awards — that is a hard cutoff, and it is an hour before the desk itself closes. Show vehicles displayed on Main Street also have to be parked by 9:00am.',
    ],
    links: [{ label: 'Registration desk on the map', to: '/map?poi=registration' }],
    confirmed: true,
  },
  {
    id: 'judging',
    section: 'show-cars',
    q: 'How does judging work, and when are awards announced?',
    a: [
      'Judging begins when the show opens at 10:00am, which is why check-in closes for award purposes at 10:00. The award ceremony is at 3:00pm at the stage by the gazebo: the 50/50 raffle winner, recognition of last year’s Best in Show, then the Top 50 and Best in Show Car & Truck.',
      'Winners are posted to the live award board on this site as they are announced, so you can look up a number without standing at the stage.',
    ],
    links: [
      { label: 'Live award board', to: '/awards' },
      { label: 'Stage on the map', to: '/map?poi=stage' },
    ],
    confirmed: true,
  },
  {
    id: 'leaving-early',
    section: 'show-cars',
    q: 'Can I leave before the show ends?',
    a: [
      'No — show vehicles may not exit before 4:00pm, when the show closes. Thousands of people are walking the closed streets all day, and there is no safe way to move a car out through them. The streets reopen at 6:00pm.',
    ],
    links: [],
    confirmed: true,
  },

  // ---- Coming to look -------------------------------------------------------
  {
    id: 'admission',
    section: 'spectators',
    q: 'How much does it cost to come and look?',
    a: [
      'Nothing. Spectator admission, parking and the shuttles are all free, and there is no ticket to book — just turn up. The show runs 10:00am to 4:00pm on Saturday, September 26, 2026, on Historic Main Street in downtown Senoia.',
    ],
    links: [],
    confirmed: true,
  },
  {
    id: 'spectator-parking',
    section: 'spectators',
    q: 'Where do spectators park?',
    a: [
      'Free lots ring the show. Seavy Street Park to the east (Shuttle 1), the Rockaway grass lots to the north (Shuttle 2), and Marimac Lakes and the public library to the west (Shuttle 3) are each on a shuttle route. The Housing Authority field off Bridge Street is a short walk east of the show and is not on a route, and the Tencate gravel lot on Andrews Parkway takes cars as well.',
      'Free golf-cart shuttles run from 9:00am to 5:00pm. If you are arriving by golf cart, cart parking is marked with "Carts Only" barrels on North Main above Johnson, South Main below Gin, and on Baggarly.',
    ],
    links: [{ label: 'All lots, with driving directions', to: '/map' }],
    confirmed: true,
  },
  {
    id: 'accessible-parking',
    section: 'spectators',
    q: 'Is there accessible parking?',
    a: [
      'Yes — marked accessible spaces at the Post Office, at the south end of the show.',
    ],
    links: [
      { label: 'Accessible parking on the map', to: '/map?poi=parking-handicap-post-office' },
    ],
    confirmed: true,
  },
  {
    id: 'food',
    section: 'spectators',
    q: 'What is there to eat?',
    a: [
      'The main run of food and beer trucks lines Travis Street west of Main, with tables and seating — The Varsity, Circle M Barbeque, The Mad Greek, Jalapeno Express and more. A few more stalls sit out on Main near Broad and by the Welcome Center, and the downtown shops and restaurants are open all day.',
    ],
    links: [
      { label: 'The 2026 food vendors', to: '/vendors' },
      { label: 'Food court on the map', to: '/map?poi=food-court' },
    ],
    confirmed: true,
  },
  {
    id: 'restrooms-first-aid',
    section: 'spectators',
    q: 'Where are the restrooms and first aid?',
    a: [
      'Portable restrooms are spread across the venue, and there are permanent public restrooms on Main Street by City Hall. First aid is on Main Street near the Senoia Welcome Center, staffed 10:00am to 4:00pm, and the Senoia Police tent is at the north end of Main.',
      'The show day guide lists every one of them — filter to Restrooms or First Aid to find the nearest.',
    ],
    links: [{ label: 'Find the nearest one', to: '/map' }],
    confirmed: true,
  },
  {
    id: 'schedule',
    section: 'spectators',
    q: 'What happens when?',
    a: [
      'Gates and registration open at 7:00am, shuttles start at 9:00am, and the show opens at 10:00am. The silent auction and door prizes start at 10:30am, the Hot Rod Brothers car reveal is at 11:00am, the auction closes at 2:00pm with winners at 2:30pm, and the award ceremony is at 3:00pm. The show ends at 4:00pm and the streets reopen at 6:00pm.',
    ],
    links: [{ label: 'Full show day schedule', to: '/map?view=schedule' }],
    confirmed: true,
  },

  // ---- The rest of the weekend ---------------------------------------------
  {
    id: 'poker-run',
    section: 'weekend',
    q: 'What is the poker run?',
    a: [
      'The Cruisin’ for History Poker Run kicks off the weekend on Friday, September 25. Drive five local landmarks at your own pace, photograph your ride at each, then turn in your photos at Marimac Lakes between 6:00 and 7:00pm to draw a poker hand. Best hand wins $200 cash.',
      'Any make, model or year is welcome — it is not limited to show cars. Tickets are $25 per entry and proceeds benefit the Senoia Area Historical Society.',
    ],
    links: [{ label: 'Route, stops and tickets', to: '/poker-run' }],
    confirmed: true,
  },
  {
    id: 'merch',
    section: 'weekend',
    q: 'Where do I get a show t-shirt?',
    a: [
      'At the merchandise tent on show day. Proceeds support downtown Senoia preservation.',
    ],
    links: [{ label: 'See this year’s shirts', to: '/merch' }],
    confirmed: true,
  },
  {
    id: 'volunteer',
    section: 'weekend',
    q: 'Can I help out?',
    a: [
      'Yes, and the show genuinely runs on it. Shifts are posted on the volunteer board — pick one that suits you, no account needed, and you will get a confirmation email with a link to cancel if your plans change.',
    ],
    links: [{ label: 'Volunteer sign-up', to: '/volunteer' }],
    confirmed: true,
  },
  {
    id: 'contact',
    section: 'weekend',
    q: 'My question is not here. Who do I ask?',
    a: [
      `Email ${EMAIL} or call ${PHONE}. The show is presented by the Senoia Downtown Development Authority, PO Box 310, Senoia, GA 30276.`,
    ],
    links: [
      { label: `Email ${EMAIL}`, href: `mailto:${EMAIL}` },
      { label: `Call ${PHONE}`, href: 'tel:+17707279173' },
    ],
    confirmed: true,
  },
]

export const publishedFaq = () => FAQ.filter((f) => f.confirmed)

// Sections with at least one published question, in FAQ_SECTIONS order, each
// carrying its own items — an empty section heading is a dead end for a reader
// the same way an empty map filter chip is.
export const faqBySection = () => {
  const published = publishedFaq()
  return FAQ_SECTIONS.map((section) => ({
    section,
    items: published.filter((f) => f.section === section.id),
  })).filter((g) => g.items.length > 0)
}
