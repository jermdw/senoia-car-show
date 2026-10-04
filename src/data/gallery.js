// Show photos. Everything on /gallery comes from this file — page content is
// hardcoded in components elsewhere on this site, and the gallery follows suit.
//
// Credit: the 2026 photos are by Wayne Dombroski of Stars Mill Photography, who
// has said the show may use them as needed (via Steve Maloy, 2026-10-02; the
// organizers confirmed this covers the website, not just social media). In return
// Wayne and his business are credited wherever his work appears — the page renders
// the credit line from PHOTOGRAPHER, so keep it there.
export const PHOTOGRAPHER = {
  name: 'Wayne Dombroski',
  business: 'Stars Mill Photography',
  url: 'https://www.starsmillphoto.com',
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
    blurb: 'Last year’s show, from the same photographer.',
    url: 'https://www.starsmillphoto.com/2025-car-show-1',
  },
]

// Photos hosted on this site, shown as a grid with a lightbox. The 2026 set is a
// curated selection from Wayne Dombroski's galleries (originals stay with him; these
// are 1600px WebPs with camera metadata stripped, plus 640px thumbnails).
//
// To add more:
//   1. Export a web-sized WebP (about 1600px on the long side, ideally under 300KB)
//      into public/gallery/<year>/ with a NEW, unique filename — files in public/ are
//      not content-hashed, so overwriting one in place can be served stale for a long
//      time. Make a ~640px `-t` thumbnail beside it.
//   2. Add an entry below. `width` and `height` are the full file's pixel size (they
//      reserve space so the grid doesn't jump as images load); `alt` describes the
//      photo for people who can't see it.
//
// `album` is a free-text label that groups photos on the page, in the order the
// labels first appear here. Only albums with at least one photo are shown.
const g = (album, slug, width, height, alt) => ({
  src: `/gallery/2026/${slug}.webp`,
  thumb: `/gallery/2026/${slug}-t.webp`,
  width,
  height,
  alt,
  album,
  year: 2026,
})

export const PHOTOS = [
  g('Best in Show', 'bos-ford-pickup', 1600, 1067, 'Best in Show: a gray-blue Ford F-100 pickup on Main Street with spectators behind it'),
  g('Best in Show', 'bos-chevy-stage', 1600, 1067, 'Best in Show: an olive-green classic Chevrolet sedan with chrome wheels in front of the stage'),
  g('Best in Show', 'bos-pair', 1600, 1067, 'The Best in Show Chevrolet and Ford pickup parked side by side in front of the stage'),
  g('Best in Show', 'bos-wheel', 1067, 1600, 'Close-up of a polished multi-spoke chrome wheel on the Best in Show Chevrolet'),
  g('Best in Show', 'bos-interior', 1600, 1067, 'Brown leather interior and chrome steering wheel of the Best in Show Chevrolet'),
  g('Best in Show', 'bos-coyote-badge', 1600, 1067, 'Ford 5.0L Coyote badge on the fender of the Best in Show pickup'),
  g('Cars', 'cars-blue-flatbed', 1600, 1067, 'A blue Chevrolet cab-over flatbed truck parked in front of a brick building'),
  g('Cars', 'cars-fire-engine', 1600, 1067, 'A vintage red fire engine with brass fittings on display'),
  g('Cars', 'cars-gold-corvette', 1600, 1067, 'A gold Corvette convertible with its hood raised in front of a brick building'),
  g('Cars', 'cars-red-coupe', 1600, 1067, 'A glossy red vintage coupe with a raised hood panel on Main Street'),
  g('Cars', 'cars-microcar', 1067, 1600, 'A tiny red microcar under a white tent'),
  g('Cars', 'cars-camaro-front', 1600, 1067, 'Front end of an orange Camaro with white racing stripes'),
  g('Cars', 'cars-navy-chevy', 1600, 1067, 'A navy blue Chevrolet with its hood raised and a chrome bumper'),
  g('Cars', 'cars-coke-cooler', 1067, 1600, 'A red Coca-Cola cooler sitting on the red seat of a classic car'),
  g('Cars', 'cars-red-ford-wreath', 1600, 1067, 'A red Ford pickup with a Christmas wreath on its grille and a 1962 license plate'),
  g('Cars', 'cars-flame-hot-rod', 1600, 1067, 'A blue hot rod with orange flames painted on the hood'),
  g('Cars', 'cars-lowrider', 1600, 1067, 'A light-blue lowrider with its front wheels raised on hydraulics'),
  g('Cars', 'cars-skeleton', 1600, 1067, 'A skeleton sitting behind the wheel of a classic car'),
  g('Cars', 'cars-swan-ornament', 1067, 1600, 'A chrome swan hood ornament against a blurred green background'),
  g('Cars', 'cars-military-dodge', 1600, 1067, 'A restored olive-drab military Dodge truck with a canvas top'),
  g('Cars', 'cars-vw-bus', 1067, 1600, 'A green Volkswagen camper bus with its pop-top roof raised'),
  g('Cars', 'cars-scout', 1600, 1067, 'A gray International Scout with its hood up inside a small white fence'),
  g('Cars', 'cars-cobra', 1600, 1067, 'A Cobra-style roadster with a flag-patterned hood'),
  g('Cars', 'cars-vintage-grille', 1067, 1600, 'The chrome grille of a maroon vintage car with a 1932 Georgia license plate'),
  g('Cars', 'cars-orange-01', 1600, 1067, 'The number 01 painted on the door of an orange muscle car'),
  g('Cars', 'cars-purple-hot-rod', 1600, 1067, 'A purple hot rod with yellow flames on its fender'),
  g('Cars', 'cars-vette-dash', 1600, 1067, 'Orange and red dashboard with a chrome three-spoke steering wheel'),
  g('Cars', 'cars-teal-chevy', 1600, 1067, 'A teal Chevrolet with its hood raised under a canopy tent'),
  g('Show Day', 'day-aerial-1', 1600, 1199, 'Aerial view of Main Street filled with show cars and visitors'),
  g('Show Day', 'day-aerial-2', 1600, 1199, 'Looking down on Main Street as crowds walk between rows of show cars'),
  g('Show Day', 'day-crowd', 1600, 1067, 'Visitors looking at a black classic car in front of a downtown storefront'),
  g('Show Day', 'day-trophies', 1600, 1067, 'Best Car and Best Truck trophies on a gingham-covered table in front of the sponsor banner'),
  g('Awards', 'awards-02', 1600, 1067, 'A Top 50 winner holding a trophy between two presenters in orange show shirts'),
  g('Awards', 'awards-15', 1600, 1067, 'A young Top 50 winner holding a trophy with two presenters'),
  g('Awards', 'awards-17', 1600, 1067, 'A Top 50 winner posing with two children and a trophy'),
  g('Awards', 'awards-26', 1600, 1067, 'A Top 50 winner in an “I ♥ my wife” T-shirt holding a trophy'),
  g('Awards', 'awards-32', 1600, 1067, 'A Top 50 winner in a red polka-dot dress holding a trophy'),
  g('Awards', 'awards-35', 1600, 1067, 'A Top 50 winner holding a baby and a trophy'),
]
