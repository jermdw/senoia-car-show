// Converts real coordinates to a position on the base map image.
//
// `public/venue-base-2026-web.webp` was generated from the Mapbox Static Images API
// at exactly the bounding box below, so this transform is exact — not a calibration.
// Regenerate the image and update BBOX together, and every pin moves correctly:
//
//   STYLE=jermdwsahs/cmsnd0mkk017601qo0nsz6fpp
//   curl -g -o /tmp/base.png \
//     "https://api.mapbox.com/styles/v1/$STYLE/static/[-84.5572,33.29855,-84.5512,33.30425]/1126x1280?access_token=$MB_TOKEN"
//   cwebp -q 88 /tmp/base.png -o public/venue-base-2026-web.webp   # ~600 kB -> 40 kB
//
// The frame is cropped to the walkable venue (~558 x 759 m), not the wider area it
// started as. A wider frame squeezed 21 pins into the middle third of the image where
// they overlapped into a blob on a phone; cropping spreads them across the full width.
// Remote parking is outside this frame on purpose — it gets addresses and directions
// rather than pins, since zooming out far enough to include it shrinks the venue to
// illegibility. Changing BBOX moves every pin automatically; nothing is hand-placed.
//
// The style is a classic Light with the `poi-label` layer deleted. Mapbox's stock
// styles label every business and landmark — "Papp Clinic", "Peavy Gravesite" — which
// competes with our own pins and puts arbitrary businesses on an event map. Dropping
// that one layer leaves street names only, so everything named on the map is ours.
// Classic (not Standard) because the Static Images API cannot render Standard styles.
//
// The @2x variant lives at design/venue-base-2026-print.png (2560x1838) — the source for
// the printed "You Are Here" boards. It is deliberately OUTSIDE public/, because Vite copies
// public/ wholesale into dist/ and it would otherwise ship ~900 kB on every deploy unused.
// Mapbox's terms require text attribution wherever this image is shown, on screen
// and in print: "© Mapbox, © OpenStreetMap".

export const BBOX = { west: -84.5572, south: 33.29855, east: -84.5512, north: 33.30425 }

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
