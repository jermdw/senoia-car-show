import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  compareCarNumber,
  matchesAwardSearch,
  sortFeatured,
  sortTop50,
} from '../src/lib/awards.js'

// These decide the order a spectator standing at the stage sees, and the same
// order the organizer sees in the admin list — a winner at position 7 on one
// has to be at position 7 on the other.

test('car numbers sort numerically, not as text', () => {
  const rows = [{ carNumber: '10' }, { carNumber: '9' }, { carNumber: '07' }]
  assert.deepEqual(sortTop50(rows).map((r) => r.carNumber), ['07', '9', '10'])
})

test('leading zeros are preserved but do not affect ordering', () => {
  // The printed judging sheet writes "07"; the board must show "07" and still
  // place it before 9.
  const rows = [{ carNumber: '9' }, { carNumber: '07' }]
  const sorted = sortTop50(rows)
  assert.equal(sorted[0].carNumber, '07', 'stays a string, zero intact')
  assert.equal(sorted[1].carNumber, '9')
})

test('lettered class numbers sort after the plain ones, alphabetically', () => {
  const rows = [{ carNumber: 'B12' }, { carNumber: '10' }, { carNumber: 'A3' }]
  assert.deepEqual(sortTop50(rows).map((r) => r.carNumber), ['10', 'A3', 'B12'])
})

test('a row with no car number still sorts somewhere and is never dropped', () => {
  const rows = [{ carNumber: 'B12' }, {}, { carNumber: '5' }, { carNumber: '' }]
  const sorted = sortTop50(rows)
  assert.equal(sorted.length, 4, 'every winner reaches the board')
  assert.equal(sorted[0].carNumber, '5', 'numbered rows still lead')
})

test('sorting does not mutate the caller\'s array', () => {
  // Both sides render from the same live snapshot array; sorting in place would
  // reorder the other one underneath it.
  const rows = [{ carNumber: '10' }, { carNumber: '9' }]
  sortTop50(rows)
  assert.equal(rows[0].carNumber, '10')

  const featured = [{ id: 'b', sortOrder: 2 }, { id: 'a', sortOrder: 1 }]
  sortFeatured(featured)
  assert.equal(featured[0].id, 'b')
})

test('compareCarNumber is a consistent comparator', () => {
  assert.ok(compareCarNumber({ carNumber: '7' }, { carNumber: '10' }) < 0)
  assert.ok(compareCarNumber({ carNumber: '10' }, { carNumber: '7' }) > 0)
  assert.equal(compareCarNumber({ carNumber: '7' }, { carNumber: '7' }), 0)
})

test('featured trophies follow announcement order, missing sortOrder first', () => {
  const rows = [{ id: 'truck', sortOrder: 2 }, { id: 'car', sortOrder: 1 }, { id: 'legacy' }]
  assert.deepEqual(sortFeatured(rows).map((r) => r.id), ['legacy', 'car', 'truck'])
})

test('search covers every field printed on the row', () => {
  const award = {
    carNumber: '07',
    vehicle: '1963 Chevrolet Corvette Split Window',
    owner: 'Sarah L.',
    awardClass: 'Classic Sports',
    title: '',
  }
  // A spectator knows the car, its number, or the owner — never which one the
  // page indexes on.
  assert.equal(matchesAwardSearch(award, '07'), true, 'by number')
  assert.equal(matchesAwardSearch(award, 'corvette'), true, 'by model, case-insensitive')
  assert.equal(matchesAwardSearch(award, 'sarah'), true, 'by owner')
  assert.equal(matchesAwardSearch(award, 'classic sports'), true, 'by class')
  assert.equal(matchesAwardSearch(award, 'mustang'), false)
})

test('an empty or whitespace search matches everything', () => {
  assert.equal(matchesAwardSearch({ vehicle: 'anything' }, ''), true)
  assert.equal(matchesAwardSearch({ vehicle: 'anything' }, '   '), true)
})

test('search does not crash on a row with missing fields', () => {
  // Rows can arrive from a CSV import with blank optional columns.
  assert.equal(matchesAwardSearch({}, 'x'), false)
  assert.equal(matchesAwardSearch({ vehicle: undefined, owner: null }, 'x'), false)
})
