import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isOnlineRegistrationOpen } from '../src/data/registration.js'

// 22:00Z = 6:00pm EDT on Friday, Sept 25 — the cutoff.
test('online registration closes at 6:00pm Eastern the day before the show', () => {
  assert.equal(isOnlineRegistrationOpen(new Date('2026-09-25T21:59:00Z')), true, '5:59pm ET')
  assert.equal(isOnlineRegistrationOpen(new Date('2026-09-25T22:00:00Z')), false, '6:00pm ET')
  assert.equal(isOnlineRegistrationOpen(new Date('2026-09-26T14:00:00Z')), false, 'show morning')
})
