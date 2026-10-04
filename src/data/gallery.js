// Show photos. Everything on /gallery comes from this file — page content is
// hardcoded in components elsewhere on this site, and the gallery follows suit.
//
// Credit: the 2026 photos are by Wayne Dombroski of Stars Mill Photography, who
// has said the show may use them as needed (via Steve Maloy, 2026-10-02; the
// organizers confirmed this covers the website, not just social media). The 2025
// set is also his, curated from his public 2025 gallery on 2026-10-04 at the
// organizers' request (Wayne's 2026-10-02 permission was given for the 2026 photos
// — worth a one-line confirmation from him that it extends to 2025). In return
// Wayne and his business are credited wherever his work appears — the page renders
// the credit line from PHOTOGRAPHER, so keep it there.
export const PHOTOGRAPHER = {
  name: 'Wayne Dombroski',
  business: 'Stars Mill Photography',
  url: 'https://www.starsmillphoto.com',
}

// One entry per year that has a gallery. `edition` is the ordinal printed on that
// year's trophies and signage ("20th Senoia Car Show" on the 2025 plaques), not
// arithmetic on the year — don't extrapolate it. The newest year is the default
// at /gallery; older years live at /gallery/<year>.
export const EDITIONS = {
  2026: { edition: '21st' },
  2025: { edition: '20th' },
}

// Full galleries that live on the photographer's own site. These are links out
// rather than copies, so they cost nothing to host and need no permission beyond
// the link. Newest first; add a row per year. Photo counts are as of 2026-10-03.
export const ALBUMS = [
  {
    year: 2026,
    title: '2026 Senoia Car Show',
    blurb: 'Every photo from show day: Cars (126 photos) and the Top 50 (52 photos).',
    url: 'https://www.starsmillphoto.com/senoia-car-show-2026',
  },
  {
    year: 2025,
    title: '2025 Senoia Car Show',
    blurb: 'The 20th show, from the same photographer: 150+ photos of the cars, the show and the awards (as of 2026-10-04).',
    url: 'https://www.starsmillphoto.com/2025-car-show-1',
  },
]

// Photos hosted on this site, shown as a grid with a lightbox. Each year's set is a
// curated selection from Wayne Dombroski's galleries (originals stay with him; these
// are WebPs of at most 1600px with camera metadata stripped, plus 640px thumbnails).
//
// To add more:
//   1. Export a web-sized WebP (about 1600px on the long side, ideally under 300KB)
//      into public/gallery/<year>/ with a NEW, unique filename — files in public/ are
//      not content-hashed, so overwriting one in place can be served stale for a long
//      time. Make a ~640px `-t` thumbnail beside it.
//   2. Add an entry below (the first argument is the show year). `width` and `height` are the full file's pixel size (they
//      reserve space so the grid doesn't jump as images load); `alt` describes the
//      photo for people who can't see it.
//
// `album` is a free-text label that groups photos on the page, in the order the
// labels first appear here. Only albums with at least one photo are shown.
const g = (year, album, slug, width, height, alt) => ({
  src: `/gallery/${year}/${slug}.webp`,
  thumb: `/gallery/${year}/${slug}-t.webp`,
  width,
  height,
  alt,
  album,
  year,
})

export const PHOTOS = [
  g(2026, 'Best in Show', 'bos-ford-pickup', 1600, 1067, 'Best in Show: a gray-blue Ford F-100 pickup on Main Street with spectators behind it'),
  g(2026, 'Best in Show', 'bos-chevy-stage', 1600, 1067, 'Best in Show: an olive-green classic Chevrolet sedan with chrome wheels in front of the stage'),
  g(2026, 'Best in Show', 'bos-pair', 1600, 1067, 'The Best in Show Chevrolet and Ford pickup parked side by side in front of the stage'),
  g(2026, 'Best in Show', 'bos-wheel', 1067, 1600, 'Close-up of a polished multi-spoke chrome wheel on the Best in Show Chevrolet'),
  g(2026, 'Best in Show', 'bos-interior', 1600, 1067, 'Brown leather interior and chrome steering wheel of the Best in Show Chevrolet'),
  g(2026, 'Best in Show', 'bos-coyote-badge', 1600, 1067, 'Ford 5.0L Coyote badge on the fender of the Best in Show pickup'),
  g(2026, 'Cars', 'cars-blue-flatbed', 1600, 1067, 'A blue Chevrolet cab-over flatbed truck parked in front of a brick building'),
  g(2026, 'Cars', 'cars-fire-engine', 1600, 1067, 'A vintage red fire engine with brass fittings on display'),
  g(2026, 'Cars', 'cars-gold-corvette', 1600, 1067, 'A gold Corvette convertible with its hood raised in front of a brick building'),
  g(2026, 'Cars', 'cars-red-coupe', 1600, 1067, 'A glossy red vintage coupe with a raised hood panel on Main Street'),
  g(2026, 'Cars', 'cars-microcar', 1067, 1600, 'A tiny red microcar under a white tent'),
  g(2026, 'Cars', 'cars-camaro-front', 1600, 1067, 'Front end of an orange Camaro with white racing stripes'),
  g(2026, 'Cars', 'cars-navy-chevy', 1600, 1067, 'A navy blue Chevrolet with its hood raised and a chrome bumper'),
  g(2026, 'Cars', 'cars-coke-cooler', 1067, 1600, 'A red Coca-Cola cooler sitting on the red seat of a classic car'),
  g(2026, 'Cars', 'cars-red-ford-wreath', 1600, 1067, 'A red Ford pickup with a Christmas wreath on its grille and a 1962 license plate'),
  g(2026, 'Cars', 'cars-flame-hot-rod', 1600, 1067, 'A blue hot rod with orange flames painted on the hood'),
  g(2026, 'Cars', 'cars-lowrider', 1600, 1067, 'A light-blue lowrider with its front wheels raised on hydraulics'),
  g(2026, 'Cars', 'cars-skeleton', 1600, 1067, 'A skeleton sitting behind the wheel of a classic car'),
  g(2026, 'Cars', 'cars-swan-ornament', 1067, 1600, 'A chrome swan hood ornament against a blurred green background'),
  g(2026, 'Cars', 'cars-military-dodge', 1600, 1067, 'A restored olive-drab military Dodge truck with a canvas top'),
  g(2026, 'Cars', 'cars-vw-bus', 1067, 1600, 'A green Volkswagen camper bus with its pop-top roof raised'),
  g(2026, 'Cars', 'cars-scout', 1600, 1067, 'A gray International Scout with its hood up inside a small white fence'),
  g(2026, 'Cars', 'cars-cobra', 1600, 1067, 'A Cobra-style roadster with a flag-patterned hood'),
  g(2026, 'Cars', 'cars-vintage-grille', 1067, 1600, 'The chrome grille of a maroon vintage car with a 1932 Georgia license plate'),
  g(2026, 'Cars', 'cars-orange-01', 1600, 1067, 'The number 01 painted on the door of an orange muscle car'),
  g(2026, 'Cars', 'cars-purple-hot-rod', 1600, 1067, 'A purple hot rod with yellow flames on its fender'),
  g(2026, 'Cars', 'cars-vette-dash', 1600, 1067, 'Orange and red dashboard with a chrome three-spoke steering wheel'),
  g(2026, 'Cars', 'cars-teal-chevy', 1600, 1067, 'A teal Chevrolet with its hood raised under a canopy tent'),
  g(2026, 'Show Day', 'day-aerial-1', 1600, 1199, 'Aerial view of Main Street filled with show cars and visitors'),
  g(2026, 'Show Day', 'day-aerial-2', 1600, 1199, 'Looking down on Main Street as crowds walk between rows of show cars'),
  g(2026, 'Show Day', 'day-crowd', 1600, 1067, 'Visitors looking at a black classic car in front of a downtown storefront'),
  g(2026, 'Show Day', 'day-trophies', 1600, 1067, 'Best Car and Best Truck trophies on a gingham-covered table in front of the sponsor banner'),
  g(2026, 'Awards', 'awards-02', 1600, 1067, 'A Top 50 winner holding a trophy between two presenters in orange show shirts'),
  g(2026, 'Awards', 'awards-15', 1600, 1067, 'A young Top 50 winner holding a trophy with two presenters'),
  g(2026, 'Awards', 'awards-17', 1600, 1067, 'A Top 50 winner posing with two children and a trophy'),
  g(2026, 'Awards', 'awards-26', 1600, 1067, 'A Top 50 winner in an “I ♥ my wife” T-shirt holding a trophy'),
  g(2026, 'Awards', 'awards-32', 1600, 1067, 'A Top 50 winner in a red polka-dot dress holding a trophy'),
  g(2026, 'Awards', 'awards-35', 1600, 1067, 'A Top 50 winner holding a baby and a trophy'),
  g(2025, 'Best in Show', 'bis-car-plaque', 1488, 992, 'The 2025 Best Car in Show plaque, a metal hot rod cutout with a blue banner, on a gingham tablecloth'),
  g(2025, 'Best in Show', 'bis-car-presenters', 1488, 992, 'Two presenters in orange show shirts holding the Best Car in Show plaque on the stage'),
  g(2025, 'Best in Show', 'bis-truck-plaque', 1488, 992, 'Close-up of the 2025 Best Truck in Show plaque held up in front of the sponsor banner'),
  g(2025, 'Best in Show', 'bis-truck-family', 1488, 992, 'A family with the Best Truck in Show plaque, flanked by two presenters in orange shirts'),
  g(2025, 'Cars', 'cars-silver-corvette', 1488, 992, 'A silver Corvette convertible with its hood raised next to a Chevrolet Corvette display sign'),
  g(2025, 'Cars', 'cars-lowrider-impala', 1488, 992, 'A light-blue Chevrolet Impala lowrider with its front wheel raised on hydraulics'),
  g(2025, 'Cars', 'cars-white-stingray', 1488, 992, 'A white Corvette Stingray with its hood open in front of a brick church'),
  g(2025, 'Cars', 'cars-maroon-1940', 1488, 992, 'A maroon 1940s sedan with wire wheels and its hood raised beside a display placard'),
  g(2025, 'Cars', 'cars-blue-camaro', 1488, 992, 'A blue Camaro Z/28 with white stripes and its hood up under a tent'),
  g(2025, 'Cars', 'cars-silver-chevelle', 1488, 992, 'A silver Chevelle with a blower sticking up through the hood'),
  g(2025, 'Cars', 'cars-vw-bus-front', 1488, 1052, 'The front of a cream Volkswagen bus with a "PRINCESS" license plate'),
  g(2025, 'Cars', 'cars-red-mg', 1488, 992, 'A red MG-style roadster with chrome headlamps and a radiator shell'),
  g(2025, 'Cars', 'cars-vw-bug-patina', 1488, 992, 'A cream Volkswagen Beetle with weathered paint beside a rusty-orange Beetle'),
  g(2025, 'Cars', 'cars-karmann-ghia', 1488, 992, 'A turquoise Karmann Ghia with its front trunk lid raised'),
  g(2025, 'Cars', 'cars-yellow-hot-rod', 1488, 992, 'The front of a yellow hot rod with an exposed grille and a California plate'),
  g(2025, 'Cars', 'cars-1939-grille', 1488, 992, 'A silver 1939 grille topped with a flame-pattern ornament in front of a checkerboard panel'),
  g(2025, 'Cars', 'cars-isetta', 1488, 1042, 'A small red-orange BMW Isetta bubble car parked on Main Street'),
  g(2025, 'Cars', 'cars-blue-peterbilt', 1488, 992, 'A blue Peterbilt tractor with polished chrome stacks'),
  g(2025, 'Cars', 'cars-red-57-chevy', 1488, 992, 'A red 1957 Chevrolet Bel Air with its hood raised and chrome bumper'),
  g(2025, 'Cars', 'cars-teal-rat-rod', 1488, 992, 'A teal rat-rod pickup with an exposed engine and hand-lettered doors'),
  g(2025, 'Cars', 'cars-chevy-apache', 1488, 992, 'A teal and cream Chevrolet Apache pickup with its hood up in front of a historic storefront'),
  g(2025, 'Cars', 'cars-ford-woodie', 1488, 992, 'A weathered Ford station wagon with wood-grain panels and its hood raised'),
  g(2025, 'Cars', 'cars-superbird', 1488, 992, 'A lime-green Plymouth Superbird with its tall rear wing and trunk lid raised'),
  g(2025, 'Cars', 'cars-red-cobra', 1488, 992, 'A red Cobra roadster with white racing stripes and its hood open'),
  g(2025, 'Cars', 'cars-rocky-mount-engine', 1488, 992, 'A vintage red fire engine lettered "Rocky Mount" with an American flag on the cab'),
  g(2025, 'Cars', 'cars-yellow-coupe', 1488, 992, 'A yellow 1930s coupe hot rod next to a rusty open-cab rat rod'),
  g(2025, 'Cars', 'cars-austin-healey', 1488, 1092, 'A light-blue Austin-Healey Sprite with its hood up as visitors look on'),
  g(2025, 'Cars', 'cars-blue-bronco', 1488, 992, 'A blue early Ford Bronco with its hood up beside a display board'),
  g(2025, 'Cars', 'cars-flame-chevy-truck', 1488, 992, 'A blue and white Chevrolet pickup with flames painted on the hood'),
  g(2025, 'Cars', 'cars-sinclair-f100', 1488, 992, 'A mint-green Ford F-100 pickup with a Sinclair dinosaur logo on the door'),
  g(2025, 'Show Day', 'day-main-street', 1488, 992, 'Main Street looking toward the water tower, with a flag, a Senoia Police tent and cars on both sides'),
  g(2025, 'Show Day', 'day-registration', 1488, 992, 'A "Registration at 7 AM" sign with the Senoia water tower and arriving show cars behind it'),
  g(2025, 'Show Day', 'day-crowd-cars', 1488, 992, 'Visitors strolling between rows of show cars under shade trees'),
  g(2025, 'Show Day', 'day-vfw-tent', 1488, 992, 'Volunteers talking at the Veterans of Foreign Wars tent'),
  g(2025, 'Show Day', 'day-flag-downtown', 1488, 992, 'An American flag hanging over a downtown intersection with visitors walking through'),
  g(2025, 'Show Day', 'day-race-ramp', 1488, 992, 'Children and a volunteer at a wooden race ramp on the grass'),
  g(2025, 'Show Day', 'day-dog', 1488, 992, 'A dog resting in the shade of a classic car on Main Street'),
  g(2025, 'Show Day', 'day-ceremony-crowd', 1488, 992, 'A crowd gathered in the street for the awards ceremony'),
  g(2025, 'Awards', 'awards-stage', 1488, 992, 'Presenters and guests at the table beside the stage during the awards ceremony'),
  g(2025, 'Awards', 'awards-handshake', 1488, 992, 'A winner in a light-blue shirt shaking hands with a presenter at the awards stage'),
  g(2025, 'Awards', 'awards-trophy-green', 1488, 1057, 'A winner in a green shirt holding a plaque between two presenters in orange show shirts'),
  g(2025, 'Awards', 'awards-trophy-blue', 1488, 992, 'A winner in a light-blue shirt holding a Top 30 plaque between two presenters'),
  g(2025, 'Awards', 'awards-trophy-maroon', 1488, 992, 'A winner in a maroon shirt holding a plaque between two presenters in orange shirts'),
  g(2025, 'Awards', 'awards-kid', 1488, 992, 'A child holding a plaque while two presenters in orange shirts kneel on either side'),
  g(2025, 'Awards', 'awards-group', 1488, 992, 'Two winners and two presenters posing with a Car Show plaque'),
]
