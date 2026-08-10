// Converts real coordinates to a position on the base map image.
//
// `public/venue-base-2026-web.png` was generated from the Mapbox Static Images API
// at exactly the bounding box below, so this transform is exact — not a calibration.
// Regenerate the image and update BBOX together, and every pin moves correctly:
//
//   curl -g -o public/venue-base-2026-web.png \
//     "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/[-84.5595,33.2985,-84.5495,33.3045]/1280x919?access_token=$MB_TOKEN"
//
// The @2x variant lives at design/venue-base-2026-print.png (2560x1838) — the source for
// the printed "You Are Here" boards. It is deliberately OUTSIDE public/, because Vite copies
// public/ wholesale into dist/ and it would otherwise ship ~900 kB on every deploy unused.
// Mapbox's terms require text attribution wherever this image is shown, on screen
// and in print: "© Mapbox, © OpenStreetMap".

export const BBOX = { west: -84.5595, south: 33.2985, east: -84.5495, north: 33.3045 }

export const ATTRIBUTION = '© Mapbox, © OpenStreetMap'

// Web Mercator: longitude is linear, latitude is not. Using raw latitude here would
// skew pins vertically — a few metres at this scale, but enough to put a pin on the
// wrong side of a street.
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2))

const yNorth = mercY(BBOX.north)
const ySouth = mercY(BBOX.south)

/** Position of a coordinate as percentages of the base image, or null if unplaced. */
export function toPercent(lat, lon) {
  // Number.isFinite, not typeof: NaN and Infinity are both typeof 'number' and would
  // otherwise produce a truthy result with a NaN coordinate, rendering `top: NaN%`.
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  return {
    x: ((lon - BBOX.west) / (BBOX.east - BBOX.west)) * 100,
    y: ((yNorth - mercY(lat)) / (yNorth - ySouth)) * 100,
  }
}

/** False for anything outside the exported image — a pin that would render off-map. */
export function isWithinMap(lat, lon) {
  const p = toPercent(lat, lon)
  return !!p && p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100
}
