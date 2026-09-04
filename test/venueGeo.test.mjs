import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BBOX, isWithinMap, toPercent } from '../src/lib/venueGeo.js'
import { POIS, publishedPois } from '../src/data/eventMap.js'

// This transform is what puts a pin on the right side of a street. It is exact
// rather than calibrated, because the base image was exported from Mapbox at
// precisely BBOX — so the corners are assertable to the pixel.

const near = (actual, expected, tolerance, message) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `${message}: got ${actual}, expected ~${expected}`,
  )

test('the bounding box corners map to the image corners', () => {
  assert.deepEqual(toPercent(BBOX.north, BBOX.west), { x: 0, y: 0 }, 'north-west')

  const se = toPercent(BBOX.south, BBOX.east)
  near(se.x, 100, 0.0001, 'south-east x')
  near(se.y, 100, 0.0001, 'south-east y')
})

test('latitude is projected through Web Mercator, not used raw', () => {
  // A linear latitude scale would put the midpoint at exactly 50%. Mercator
  // does not — and the difference is enough to move a pin across a street.
  const mid = toPercent((BBOX.north + BBOX.south) / 2, (BBOX.west + BBOX.east) / 2)
  near(mid.x, 50, 0.0001, 'longitude IS linear')
  assert.notEqual(mid.y, 50, 'latitude is not')
  near(mid.y, 50, 0.01, 'but only slightly off at this scale')
})

test('non-finite coordinates are rejected rather than rendering NaN%', () => {
  // typeof NaN === 'number', so a typeof check here would pass and emit
  // `top: NaN%`. Number.isFinite is the guard.
  for (const bad of [null, undefined, NaN, Infinity, -Infinity, 'x']) {
    assert.equal(toPercent(bad, -84.554), null, `lat ${String(bad)}`)
    assert.equal(toPercent(33.301, bad), null, `lon ${String(bad)}`)
    assert.equal(isWithinMap(bad, bad), false, `isWithinMap ${String(bad)}`)
  }
})

test('isWithinMap excludes anything that would render off the image', () => {
  assert.equal(isWithinMap(33.301205, -84.554136), true, 'Main at Seavy, inside the venue')
  assert.equal(isWithinMap(33.9, -84.5), false, 'well north of the frame')
  assert.equal(isWithinMap(BBOX.north + 0.001, BBOX.west), false, 'just past the top edge')
})

test('every published POI is either pinned inside the frame or has directions', () => {
  // The failure this guards is silent: a POI with real coordinates that fall
  // outside BBOX gets no pin and no directions link, so it is named in the
  // caption's count but reachable nowhere on the page.
  for (const poi of publishedPois()) {
    if (isWithinMap(poi.lat, poi.lon)) continue
    assert.ok(
      poi.lat === null || poi.directions,
      `"${poi.id}" has coordinates outside the map but no directions fallback`,
    )
  }
})

test('POI ids are unique and every schedule link resolves', async () => {
  const { SCHEDULE } = await import('../src/data/eventMap.js')
  const ids = POIS.map((p) => p.id)
  assert.equal(new Set(ids).size, ids.length, 'duplicate POI id would break ?poi= deep links')

  for (const entry of SCHEDULE) {
    if (!entry.poiId) continue
    assert.ok(ids.includes(entry.poiId), `schedule entry "${entry.label}" points at a missing POI`)
  }
})
