// Event map + day-of schedule data.
//
// Source of truth: the 2026 Senoia Car Show Playbook (organizer-maintained).
// Per CLAUDE.md, event facts come from the organizers — never invent or extrapolate.
//
// `confirmed: false` means the playbook is self-contradictory or silent on this item.
// Unconfirmed entries are kept here as a working checklist but are NOT rendered.
// Resolve with the organizers, flip the flag, and they appear.
//
// `lat`/`lon` are real coordinates. Position on the base map is derived from them by
// `src/lib/venueGeo.js`, which is exact because the image was generated at a known
// bounding box — so pins are geocoded, never eyeballed, and survive a re-export.
// Coordinates marked "OSM" came from OpenStreetMap; "intersection" ones were computed
// from where the two named streets actually meet. Null means not yet located.
//
// Remote parking sits OUTSIDE the base map's extent and is deliberately left unpinned —
// including it would mean zooming out until the walkable venue is unreadable. Those
// entries carry `directions` instead, which the list turns into a driving-directions
// link. Shuttle routes are unpinned for a different reason: a route is a line between
// two places, so a single pin would misrepresent it.

export const CATEGORIES = [
  { id: 'restroom', label: 'Restrooms' },
  { id: 'food', label: 'Food & Drink' },
  { id: 'parking', label: 'Parking' },
  { id: 'shuttle', label: 'Shuttles' },
  { id: 'gate', label: 'Entrances' },
  { id: 'awards', label: 'Stage & Awards' },
  { id: 'info', label: 'Info & Registration' },
  { id: 'aid', label: 'First Aid' },
]

export const POIS = [
  // ---- Stage & awards -------------------------------------------------------
  {
    id: 'stage',
    category: 'awards',
    name: 'Stage',
    where: 'Bottom of the hill, by the gazebo',
    blurb:
      'Music and announcements all day, trophy display, and the 3:00pm award ceremony.',
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    id: 'last-year-bis',
    category: 'awards',
    name: "Last Year's Best in Show",
    where: 'Main Street at Seavy Street',
    blurb:
      'The reigning Best in Show car and truck are parked here and recognized during the ceremony.',
    lat: 33.301205, // intersection: Main & Seavy
    lon: -84.554136,
    confirmed: true,
  },
  {
    id: 'nonprofit-row',
    category: 'info',
    name: 'Non-Profit Row',
    where: 'Main Street median',
    blurb:
      'Local non-profits, veterans groups, the DDA, and the I-58 Mission food drive.',
    lat: null,
    lon: null,
    confirmed: true,
  },

  // ---- Entrances ------------------------------------------------------------
  // Gate positions are the playbook's own: "2 gates : North (Main & Johnson),
  // South (Main & Gin)" and "Vendors/sponsors will enter @ Seavy/Pylant".
  // The south gate's two descriptions ("Main & Gin" vs the equipment table's
  // "Travis & Main") are the same junction — Gin joins Main from the west and
  // Travis from the east.
  {
    // Resolved: Baggarly Way has been extended north to meet Main, which is why the
    // two never intersected in OpenStreetMap. The organizers' coordinate lands within
    // a metre of the existing OSM node at the north end of Main (33.30386, -84.553948),
    // about 145 m north of the old Main & Johnson position.
    id: 'gate-north',
    category: 'gate',
    name: 'North Gate — Show Cars',
    where: 'Main Street at Baggarly Way, by Middle Street',
    blurb: 'Show vehicle entry, 7:00am–11:00am. Paid credentials required.',
    lat: 33.303857,
    lon: -84.553939,
    confirmed: true,
  },
  {
    id: 'gate-south',
    category: 'gate',
    name: 'South Gate — Show Cars',
    where: 'Main Street at Travis & Gin',
    blurb: 'Show vehicle entry, 7:00am–11:00am. Paid credentials required.',
    lat: 33.299966, // intersection: Main & Travis/Broad
    lon: -84.554216,
    confirmed: true,
  },
  {
    // The playbook lumped sponsors and vendors together at Seavy/Pylant. The 2026
    // entrance-gates plan splits them: sponsors in from the west, vendors from the east.
    id: 'gate-sponsors',
    category: 'gate',
    name: 'Sponsor Gate — West',
    where: 'Seavy Street at Pylant Street',
    blurb: 'Sponsor setup entry from 6:00am.',
    lat: 33.301342, // intersection: Seavy & Pylant
    lon: -84.556339,
    confirmed: true,
  },
  {
    id: 'gate-vendors',
    category: 'gate',
    name: 'Vendor Gate — East',
    where: 'Seavy Street at Bridge Street',
    blurb: 'Vendor setup entry from 6:00am.',
    lat: 33.301065, // intersection: Seavy & Bridge
    lon: -84.55191,
    confirmed: true,
  },

  // ---- Info -----------------------------------------------------------------
  {
    id: 'welcome-center',
    category: 'info',
    name: 'Senoia Welcome Center',
    where: 'Main Street',
    blurb:
      'Help with online registration, and the place to arrange car-hauler parking and shuttle service.',
    lat: 33.301681, // OSM: Senoia Welcome Center
    lon: -84.554313,
    confirmed: true,
  },
  {
    id: 'firetruck',
    category: 'info',
    name: 'Antique Firetruck Display',
    where: 'By the Senoia marquee',
    blurb: null,
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    // Settled for 2026 after the playbook contradicted itself four times (Buggy Shop ->
    // not Buggy Shop -> Welcome Center? -> DDA table by the gazebo). The tent sits in
    // the alley off Baggarly at Seavy, about 17 m from that intersection — near the
    // FedEx drop box at 48 Main, though not on top of it.
    //
    // The two times are not a contradiction: the desk is open 7:00-11:00 (moved up
    // from 8:00 per organizer feedback, Aug 2026), but a car has to be checked in,
    // parked and showing its ID card by 10:00 to be judged.
    id: 'registration',
    category: 'info',
    name: 'Show Car Registration',
    where: 'Alley off Baggarly Way at Seavy Street, near 48 Main',
    blurb:
      'Every show car owner checks in here. Open 7:00am–11:00am, but you must be checked in by 10:00am to be eligible for awards.',
    lat: 33.301382,
    lon: -84.554646,
    confirmed: true,
  },

  // ---- Restrooms ------------------------------------------------------------
  // Source: the organizers' hand-marked "TOILETS / TRASH" site plan (Aug 2026).
  // 14 porta-potties across 11 locations — the sheet's own margin tally is 14, which
  // reconciles exactly with the P marks, so the set below is complete.
  // Positions are read from that sheet's leader lines and geocoded to the nearest
  // real intersection, so a pin can sit a few tens of metres from the actual unit —
  // the `where` text is the precise guidance, not the pin.
  {
    id: 'restroom-baggarly-johnson',
    category: 'restroom',
    name: 'Portable Restroom',
    where: 'Baggarly Way at Johnson Street',
    blurb: 'North end of the closed streets.',
    lat: 33.302574,
    lon: -84.554654,
    confirmed: true,
  },
  {
    id: 'restroom-barnes',
    category: 'restroom',
    name: 'Portable Restroom',
    where: 'Barnes Street, between Johnson and Seavy',
    blurb: null,
    lat: 33.301825,
    lon: -84.553411,
    confirmed: true,
  },
  {
    id: 'restroom-welcome-center',
    category: 'restroom',
    name: 'Portable Restrooms (2)',
    where: 'Baggarly Way at Seavy Street, by the Welcome Center',
    blurb: null,
    lat: 33.30124,
    lon: -84.554726,
    confirmed: true,
  },
  {
    id: 'restroom-seavy-parking',
    category: 'restroom',
    name: 'Portable Restroom',
    where: 'Parking lot off Seavy Street, east of Main',
    blurb: null,
    lat: 33.301162,
    lon: -84.553472,
    confirmed: true,
  },
  {
    id: 'restroom-bridge',
    category: 'restroom',
    name: 'Portable Restroom',
    where: 'Bridge Street at Seavy Street',
    blurb: null,
    lat: 33.301065,
    lon: -84.55191,
    confirmed: true,
  },
  {
    id: 'restroom-maguires',
    category: 'restroom',
    name: 'Portable Restroom',
    where: 'Maguires lot, off Travis Street',
    blurb: null,
    lat: 33.300077,
    lon: -84.554879,
    confirmed: true,
  },
  {
    id: 'restroom-gin-broad',
    category: 'restroom',
    name: 'Portable Restrooms (2)',
    where: 'Gin Street at Broad Street',
    blurb: null,
    lat: 33.299568,
    lon: -84.553749,
    confirmed: true,
  },
  {
    id: 'restroom-travis-west',
    category: 'restroom',
    name: 'Portable Restrooms (2)',
    where: 'West end of Travis Street, by Lower Creek Trail',
    blurb: null,
    lat: 33.300282,
    lon: -84.555673,
    confirmed: true,
  },
  {
    id: 'restroom-post-office',
    category: 'restroom',
    name: 'Portable Restroom',
    where: 'By the Post Office',
    blurb: null,
    lat: 33.299087,
    lon: -84.554315,
    confirmed: true,
  },
  {
    id: 'restroom-travis-east',
    category: 'restroom',
    name: 'Portable Restroom',
    where: 'Travis Street at Bridge Street',
    blurb: null,
    lat: 33.299575,
    lon: -84.552095,
    confirmed: true,
  },
  {
    // The 14th unit on the sheet, held back. It sits at the "Burn lot", which the 2026
    // public parking plan does not list as a spectator lot — so the site never locates
    // it, and publishing a restroom at a place we cannot direct anyone to is a dead end.
    // Restore this if the Burn lot returns as public parking.
    id: 'restroom-burn-lot',
    category: 'restroom',
    name: 'Portable Restroom',
    where: 'Burn lot (remote parking)',
    blurb: null,
    lat: null,
    lon: null,
    confirmed: false,
  },
  {
    // Pre-existing public restrooms marked on the DDA base map, next to City Hall.
    id: 'restroom-public-city-hall',
    category: 'restroom',
    name: 'Public Restrooms',
    where: 'Main Street by City Hall',
    blurb: 'Permanent public restrooms, open through the day.',
    lat: 33.302111,
    lon: -84.554309,
    confirmed: true,
  },

  // ---- Food -----------------------------------------------------------------
  // The playbook offered three candidate streets (Baggarly, Barnes, Travis). The 2026
  // food vendor plan settles it: the main row F1-F11 lines Travis Street west of Main,
  // with a few stalls out on Main near Broad and by the Welcome Center.
  {
    id: 'food-court',
    category: 'food',
    name: 'Food Court',
    where: 'Travis Street, west of Main',
    blurb:
      'The main run of food and drink vendors, including The Varsity, with tables and seating.',
    lat: 33.30018,
    lon: -84.555276,
    confirmed: true,
  },
  {
    id: 'food-main-broad',
    category: 'food',
    name: 'Food Vendors',
    where: 'Main Street near Broad Street',
    blurb: null,
    lat: 33.299966,
    lon: -84.554216,
    confirmed: true,
  },
  {
    id: 'food-welcome-center',
    category: 'food',
    name: 'Food Vendors',
    where: 'Main Street by the Welcome Center',
    blurb: null,
    lat: 33.301681,
    lon: -84.554313,
    confirmed: true,
  },

  // ---- First aid & safety -----------------------------------------------------
  // Source: the organizers' hand-marked "WATER / SAFETY" site plan (Aug 2026).
  // The water stations that sheet marked were cut by the organizers (Aug 2026
  // feedback) — do not re-add them from the old site plan.
  {
    id: 'first-aid',
    category: 'aid',
    name: 'First Aid',
    where: 'Main Street, near the Senoia Welcome Center',
    blurb: 'Staffed 10:00am to 4:00pm.',
    lat: 33.301681,
    lon: -84.554313,
    confirmed: true,
  },
  {
    id: 'police-tent',
    category: 'aid',
    name: 'Police Tent',
    where: 'North end of Main Street',
    blurb: 'Senoia Police on site through the show.',
    lat: 33.302111,
    lon: -84.554309,
    confirmed: true,
  },

  // ---- Public parking -------------------------------------------------------
  // Spectator parking is free. The remote lots sit outside the base map's frame, so
  // instead of a pin they carry `directions` — a Google Maps query. That matches how
  // they are actually used: you want driving directions before you arrive and the
  // pinned map once you are on foot.
  {
    id: 'parking-seavy-park',
    category: 'parking',
    name: 'Seavy Street Park',
    where: 'East of downtown, on Seavy Street',
    blurb: 'Free spectator parking. Shuttle 1 runs from here into the show.',
    directions: 'Seavy Street Park, Senoia, GA 30276',
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    id: 'parking-marimac',
    category: 'parking',
    name: 'Marimac Lakes & Public Library',
    where: 'West of downtown, off Pylant Street',
    blurb: 'Free spectator parking. Shuttle 3 runs from here into the show.',
    directions: 'Senoia Public Library, Senoia, GA 30276',
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    id: 'parking-rockaway',
    category: 'parking',
    name: 'Rockaway Grass Lots',
    where: 'North of downtown, off Main Street',
    blurb: 'Free spectator parking. Shuttle 2 runs from here into the show.',
    directions: 'Rockaway Road, Senoia, GA 30276',
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    id: 'parking-housing-authority',
    category: 'parking',
    name: 'Housing Authority Field',
    where: 'Off Bridge Street',
    // Deliberately claims no shuttle: none of the three 2026 routes covers Bridge Street.
    blurb: 'Free spectator parking, a short walk east of the show.',
    directions: 'Bridge Street, Senoia, GA 30276',
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    id: 'parking-tencate',
    category: 'parking',
    name: 'Tencate Gravel Lot',
    where: 'Andrews Parkway, just before Highway 74',
    blurb:
      'Free spectator parking, and the drop-off point for car haulers and trailers.',
    directions: 'Andrews Parkway, Senoia, GA 30276',
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    // UNCONFIRMED. The playbook says "Baptist Church"; the 2026 accessible-parking
    // sheet circles a block west of Baggarly north of Seavy; and the only Baptist
    // church OSM knows is well outside the show footprint. Three sources, no
    // agreement — and a wrong pin here strands someone with limited mobility, so it
    // stays unpublished. The confirmed south lot at the Post Office still shows.
    id: 'parking-handicap-baptist',
    category: 'parking',
    name: 'Accessible Parking — North',
    where: 'Senoia Baptist Church',
    blurb: 'Marked accessible spaces at the north end of the show.',
    lat: null,
    lon: null,
    confirmed: false,
  },
  {
    id: 'parking-handicap-post-office',
    category: 'parking',
    name: 'Accessible Parking — South',
    where: 'Post Office',
    blurb: 'Marked accessible spaces at the south end of the show.',
    lat: 33.299087, // OSM: Senoia Post Office
    lon: -84.554315,
    confirmed: true,
  },
  {
    id: 'parking-golf-carts',
    category: 'parking',
    name: 'Golf Cart Parking',
    where: 'North Main above Johnson, South Main below Gin, and Baggarly',
    blurb: 'Marked with "Carts Only" barrels.',
    lat: null,
    lon: null,
    confirmed: true,
  },

  // ---- Shuttles -------------------------------------------------------------
  // The playbook offered three conflicting configurations (3 routes/6 carts, 4 routes,
  // 3 groupings/10 carts). The 2026 public parking plan settles it at three routes,
  // serving Seavy Street Park, Rockaway and Marimac. Free golf-cart shuttles, 9:00am to
  // 5:00pm. Note the other remote lots are NOT on a named route, so their entries must
  // not claim shuttle service.
  //
  // Deliberately unpinned. A route is a line between two places, not a point, so a
  // single pin would claim the shuttle sits there. Every town-end stop also shares an
  // exact coordinate with a restroom or the north gate, which hid those pins entirely.
  // The endpoints are in `where`, and each remote lot names the shuttle that serves it.
  {
    id: 'shuttle-1',
    category: 'shuttle',
    name: 'Shuttle 1 — East',
    where: 'Seavy Street Park into the show, along Seavy Street',
    blurb: 'Running 9:00am to 5:00pm. Catch it back at Seavy & Bridge.',
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    id: 'shuttle-2',
    category: 'shuttle',
    name: 'Shuttle 2 — North',
    where: 'Rockaway lots into the show, down Main Street',
    blurb: 'Running 9:00am to 5:00pm. Catch it back at the north end of Main.',
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    id: 'shuttle-3',
    category: 'shuttle',
    name: 'Shuttle 3 — West',
    where: 'Marimac Lakes and the library into the show, via Travis Street',
    blurb: 'Running 9:00am to 5:00pm. Catch it back at the west end of Travis.',
    lat: null,
    lon: null,
    confirmed: true,
  },
]

// Times are 24h "HH:MM" local. Show day is Saturday, September 26, 2026.
// Valve cover racing is cancelled for 2026 and is deliberately absent.
export const SCHEDULE = [
  {
    time: '07:00',
    label: 'Show car gates open',
    poiId: null,
    detail: 'Paid credentials required. No vehicles admitted before 7:00am.',
    confirmed: true,
  },
  {
    time: '07:00',
    label: 'Registration opens',
    poiId: 'registration',
    detail: 'Same-day registration is $25. Closes at 11:00am.',
    confirmed: true,
  },
  {
    time: '09:00',
    label: 'Shuttle service begins',
    poiId: null,
    detail: 'Golf cart shuttles run from public parking until 5:00pm.',
    confirmed: true,
  },
  {
    time: '10:00',
    label: 'Show opens',
    poiId: null,
    detail: 'Judging begins. Music and announcements from the stage all day.',
    confirmed: true,
  },
  {
    time: '10:30',
    label: 'Silent auction & door prizes begin',
    poiId: 'stage',
    detail: 'Silent auction benefiting the I-58 Mission.',
    confirmed: true,
  },
  {
    time: '11:00',
    label: 'Hot Rod Brothers car reveal',
    poiId: 'stage',
    detail: null,
    confirmed: true,
  },
  {
    time: '14:00',
    label: 'Silent auction closes',
    poiId: 'stage',
    detail: 'Winners announced at 2:30pm.',
    confirmed: true,
  },
  {
    time: '15:00',
    label: 'Award ceremony',
    poiId: 'stage',
    detail:
      '50/50 raffle winner, recognition of last year’s Best in Show, then the Top 50 and Best in Show Car & Truck awards.',
    confirmed: true,
  },
  {
    time: '16:00',
    label: 'Show ends',
    poiId: null,
    detail: 'Show vehicles may not exit before 4:00pm. Streets reopen at 6:00pm.',
    confirmed: true,
  },

  // Playbook conflicts — do not publish until organizers confirm.
  // "Crank Your Engines": 12:15pm (General Info) vs 12:00pm (DJ schedule).
  {
    time: '12:15',
    label: 'Crank Your Engines',
    poiId: null,
    detail: null,
    confirmed: false,
  },
  // Fly over: 11:45am (General Info) vs 1:00pm (DJ schedule).
  {
    time: '13:00',
    label: 'Falcon RV Squadron fly over',
    poiId: null,
    detail: null,
    confirmed: false,
  },
]

export const publishedPois = () => POIS.filter((p) => p.confirmed)

export const publishedSchedule = () =>
  SCHEDULE.filter((s) => s.confirmed).sort((a, b) => a.time.localeCompare(b.time))
