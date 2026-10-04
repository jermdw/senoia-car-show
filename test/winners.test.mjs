import { test } from 'node:test'
import assert from 'node:assert/strict'
import { WINNERS } from '../src/data/winners.js'

// winners.js is hand-maintained from Firestore once a year, so the cheap mistakes
// (a dropped row, a duplicated car, a year out of order) are checked here.

test('years are unique and newest first', () => {
  const years = WINNERS.map((w) => w.year)
  assert.deepEqual(years, [...new Set(years)].sort((a, b) => b - a))
})

for (const w of WINNERS) {
  test(`${w.year}: required fields and a ranked list`, () => {
    assert.match(w.edition, /^\d+(st|nd|rd|th)$/)
    assert.ok(w.tierLabel)
    assert.ok(w.featured.length > 0 && w.top.length > 0)
    // "Top 50" must actually be 50 deep: a dropped row would silently shorten it.
    const size = Number(w.tierLabel.match(/\d+/)?.[0])
    if (size) assert.equal(w.top.length, size)
  })

  test(`${w.year}: every entry names a car and an owner; no car listed twice in the ranking`, () => {
    for (const a of [...w.featured, ...w.top]) {
      assert.ok(a.vehicle && a.owner && a.carNumber, JSON.stringify(a))
    }
    const numbers = w.top.map((a) => a.carNumber)
    assert.equal(new Set(numbers).size, numbers.length)
  })
}
