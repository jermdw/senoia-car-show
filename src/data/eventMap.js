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
// Note: the remote parking lots (Tencate, Rockaway, Housing Authority) sit OUTSIDE the
// base map's extent. They are deliberately left unplaced — pinning them would require
// zooming the map out so far the three-block venue becomes unreadable. They need either
// a second wider arrival map or plain driving directions.

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
    id: 'gate-north',
    category: 'gate',
    name: 'North Gate — Show Cars',
    where: 'Main Street at Johnson Street',
    blurb: 'Show vehicle entry, 7:00am–11:00am. Paid credentials required.',
    lat: 33.302533, // intersection: Main & Johnson
    lon: -84.554007,
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
    id: 'gate-vendor',
    category: 'gate',
    name: 'Sponsor & Vendor Gate',
    where: 'Seavy Street at Pylant Street',
    blurb: 'Sponsor and vendor setup entry from 6:00am.',
    lat: 33.301342, // intersection: Seavy & Pylant
    lon: -84.556339,
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
    // Playbook contradicts itself four times: Buggy Shop -> not Buggy Shop ->
    // Welcome Center? -> DDA table by the gazebo. Still an open 2026 agenda item.
    id: 'registration',
    category: 'info',
    name: 'Show Car Registration',
    where: null,
    blurb: 'All show car owners must check in by 10:00am.',
    lat: null,
    lon: null,
    confirmed: false,
  },

  // ---- Restrooms ------------------------------------------------------------
  // CRITICAL GAP. The playbook's only placement row is "set Portapotty / Lion's Den",
  // and "Lion's Den" is defined nowhere. No counts. Supplier: Pollard, (770) 599-1800,
  // contact Rebecca; the order task is assigned to Steph in August.
  // One phone call resolves this — it is the highest-value data on the whole map.
  {
    id: 'restroom-lions-den',
    category: 'restroom',
    name: 'Portable Restrooms',
    where: null,
    blurb: null,
    lat: null,
    lon: null,
    confirmed: false,
  },

  // ---- Food -----------------------------------------------------------------
  {
    // Three candidate streets in the playbook: Baggarly (equipment table),
    // Barnes (2024), Travis (2025 feedback: "Travis St worked great for Food").
    id: 'food-court',
    category: 'food',
    name: 'Food Court',
    where: null,
    blurb:
      'Food and drink vendors including The Varsity, with tables and seating.',
    lat: null,
    lon: null,
    confirmed: false,
  },

  // ---- First aid ------------------------------------------------------------
  {
    // Hours are documented (10:00am-4:00pm); location is stated nowhere.
    id: 'first-aid',
    category: 'aid',
    name: 'First Aid',
    where: null,
    blurb: 'Staffed 10:00am to 4:00pm.',
    lat: null,
    lon: null,
    confirmed: false,
  },

  // ---- Public parking -------------------------------------------------------
  // Spectator parking is free. The 2026 agenda lists "hous auth, Lowe, Olivier
  // pasture, Tencate", which drops Seavy St Park / Merrimack / the Burn lot from
  // the older list — so the older lots are unconfirmed until organizers re-confirm.
  {
    id: 'parking-housing-authority',
    category: 'parking',
    name: 'Housing Authority Field',
    where: 'Off Bridge Street',
    blurb: 'Free spectator parking, on a shuttle route.',
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    id: 'parking-rockaway',
    category: 'parking',
    name: 'Rockaway Grass Lots',
    where: 'North of downtown',
    blurb: 'Free spectator parking, on shuttle Route 2.',
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
    lat: null,
    lon: null,
    confirmed: true,
  },
  {
    id: 'parking-handicap-baptist',
    category: 'parking',
    name: 'Accessible Parking — North',
    where: 'Senoia Baptist Church',
    blurb: 'Marked accessible spaces at the north end of the show.',
    lat: null,
    lon: null,
    confirmed: true,
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
  {
    id: 'parking-seavy-park',
    category: 'parking',
    name: 'Seavy Street Park',
    where: 'Seavy Street',
    blurb: 'Free spectator parking, on shuttle Route 1.',
    lat: null,
    lon: null,
    confirmed: false,
  },
  {
    id: 'parking-marimac',
    category: 'parking',
    name: 'Marimac (Library)',
    where: 'West of downtown',
    blurb: 'Free spectator parking, on shuttle Route 3.',
    lat: null,
    lon: null,
    confirmed: false,
  },

  // ---- Shuttles -------------------------------------------------------------
  // Golf cart shuttles run 9:00am-5:00pm. The playbook gives three different route
  // configurations (3 routes/6 carts, 4 routes, 3 groupings/10 carts); the named
  // stop pairs below are the best-documented version but need 2026 confirmation.
  {
    id: 'shuttle-1',
    category: 'shuttle',
    name: 'Shuttle Route 1',
    where: 'Seavy Street Park ↔ Seavy & Barnes',
    blurb: 'Running 9:00am to 5:00pm.',
    lat: null,
    lon: null,
    confirmed: false,
  },
  {
    id: 'shuttle-2',
    category: 'shuttle',
    name: 'Shuttle Route 2',
    where: 'Rockaway ↔ Main & Johnson',
    blurb: 'Running 9:00am to 5:00pm.',
    lat: null,
    lon: null,
    confirmed: false,
  },
  {
    id: 'shuttle-3',
    category: 'shuttle',
    name: 'Shuttle Route 3',
    where: 'Marimac ↔ Pylant & Travis',
    blurb: 'Running 9:00am to 5:00pm.',
    lat: null,
    lon: null,
    confirmed: false,
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
    time: '08:00',
    label: 'Registration opens',
    poiId: 'registration',
    detail: 'Closes at 11:00am.',
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
    label: 'Pedal car silent auction & door prizes begin',
    poiId: 'stage',
    detail: null,
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
