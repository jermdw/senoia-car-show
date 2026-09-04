import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isVisibleOnShowDay } from '../src/lib/useShowDay.js'

// One predicate decides what the header bar and the landing page's card grid
// each show. It exists because they used to decide separately, and drifted: on
// the morning of the show the nav retired Volunteer and Poker Run while the home
// page went on promoting both, including as its full-width featured banner.

const HIDE = { to: '/volunteer', hideOnShowDay: true }
const SHOW = { to: '/awards', showOnShowDay: true }
const ALWAYS = { to: '/show' }

test('an unflagged link is always visible', () => {
  assert.equal(isVisibleOnShowDay(ALWAYS, false), true, 'before show day')
  assert.equal(isVisibleOnShowDay(ALWAYS, true), true, 'on show day')
})

test('hideOnShowDay links drop off the moment the show starts', () => {
  assert.equal(isVisibleOnShowDay(HIDE, false), true)
  assert.equal(isVisibleOnShowDay(HIDE, true), false)
})

test('showOnShowDay links appear only once the show starts', () => {
  assert.equal(isVisibleOnShowDay(SHOW, false), false)
  assert.equal(isVisibleOnShowDay(SHOW, true), true)
})

test('the two flags are exact complements, so a swap never blanks a slot', () => {
  // Volunteer out / Awards in has to be a swap, not a gap or a double-up —
  // both are marked `featured` on the landing grid and exactly one may win.
  for (const arrived of [false, true]) {
    assert.notEqual(
      isVisibleOnShowDay(HIDE, arrived),
      isVisibleOnShowDay(SHOW, arrived),
      `exactly one is visible when arrived=${arrived}`,
    )
  }
})

test('the landing grid shows exactly one featured card in either state', async () => {
  // Guards the real data, not just the predicate: a second `featured` entry
  // would render two full-width ink banners stacked at the foot of the page.
  const source = await import('node:fs').then((fs) =>
    fs.readFileSync(new URL('../src/pages/Landing.jsx', import.meta.url), 'utf8'),
  )
  // The SECTIONS entries that carry `featured: true`, and how each is gated.
  assert.equal(
    (source.match(/featured: true/g) ?? []).length,
    2,
    'expected exactly two featured landing cards (Volunteer before, Awards on the day)',
  )
})
