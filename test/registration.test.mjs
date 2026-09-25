import { test } from 'node:test'
import assert from 'node:assert/strict'
import { REGISTRATION_CLOSES, hasRegistrationClosed } from '../src/data/registration.js'

// UTC instants, so the Eastern offset is under test rather than assumed:
// 22:00Z on the 25th is 6:00pm EDT, the night before the show.
const at = (iso) => new Date(iso)

test('online registration closes at 6:00pm Eastern the night before the show', () => {
  assert.equal(REGISTRATION_CLOSES.toISOString(), '2026-09-25T22:00:00.000Z')
  assert.equal(hasRegistrationClosed(at('2026-09-25T21:59:59Z')), false, '5:59:59pm ET')
  assert.equal(hasRegistrationClosed(at('2026-09-25T22:00:00Z')), true, '6:00pm ET exactly')
  assert.equal(hasRegistrationClosed(at('2026-09-26T14:00:00Z')), true, 'show morning')
})

test('a visitor west of Senoia sees the same cutoff, not their own 6pm', () => {
  // 3:00pm in California is 6:00pm in Senoia — already closed.
  assert.equal(hasRegistrationClosed(at('2026-09-25T22:00:00Z')), true)
  // 6:00pm in California is 9:00pm in Senoia; 6:00pm in London is 1:00pm in Senoia.
  assert.equal(hasRegistrationClosed(at('2026-09-25T17:00:00Z')), false, '6pm BST')
})
