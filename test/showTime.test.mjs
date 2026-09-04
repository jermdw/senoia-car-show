import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  SHOW_END,
  SHOW_START,
  currentEntryIndex,
  formatTime,
  hasPassedOnShowDay,
  hasShowDayArrived,
  isShowDay,
  phaseOnShowDay,
  timeUntilShow,
} from '../src/lib/showTime.js'

// Every case pins an explicit instant. The whole reason these helpers take a
// `now` argument is that the alternative — moving the system clock to test
// "happening now" — breaks TLS and Firebase token validation on the machine.
//
// Times are written in UTC so the Eastern conversion is the thing under test,
// not something the test also assumes. Show day is 2026-09-26, EDT (UTC-4):
// 14:00Z = 10:00am ET (gates), 19:00Z = 3:00pm ET (ceremony), 20:00Z = 4:00pm ET.
const at = (iso) => new Date(iso)

test('isShowDay reads the calendar date in event time, not the visitor\'s', () => {
  assert.equal(isShowDay(at('2026-09-26T13:00:00Z')), true, '9am ET on show day')
  assert.equal(isShowDay(at('2026-09-26T23:59:00Z')), true, '7:59pm ET on show day')

  // The trap: UTC has already rolled over to the 26th while Senoia is still on
  // the 25th. A visitor in London must not see "happening now" the night before.
  assert.equal(isShowDay(at('2026-09-26T03:30:00Z')), false, '11:30pm ET on the 25th')
  // And the mirror: still the 26th in UTC, already the 27th nowhere.
  assert.equal(isShowDay(at('2026-09-27T04:30:00Z')), false, '12:30am ET on the 27th')
})

test('hasShowDayArrived flips once, at event-local midnight, and never reverts', () => {
  assert.equal(hasShowDayArrived(at('2026-09-26T03:59:00Z')), false, '11:59pm ET, day before')
  assert.equal(hasShowDayArrived(at('2026-09-26T04:01:00Z')), true, '12:01am ET, show day')
  assert.equal(hasShowDayArrived(at('2026-10-01T12:00:00Z')), true, 'the week after')

  // Guards the nav swap's year comparison: January of the FOLLOWING year is a
  // smaller month and day than SHOW_DATE, so a naive month/day compare would
  // wrongly report the show as still upcoming and bring back the Volunteer link.
  assert.equal(hasShowDayArrived(at('2027-01-05T12:00:00Z')), true, 'next January')
  assert.equal(hasShowDayArrived(at('2025-12-31T12:00:00Z')), false, 'the previous year')
})

test('hasPassedOnShowDay gates on the wall clock, and only on show day', () => {
  assert.equal(hasPassedOnShowDay('15:00', at('2026-09-26T18:59:00Z')), false, '2:59pm ET')
  assert.equal(hasPassedOnShowDay('15:00', at('2026-09-26T19:00:00Z')), true, '3:00pm ET exactly')
  assert.equal(hasPassedOnShowDay('15:00', at('2026-09-26T19:01:00Z')), true, '3:01pm ET')

  // 3pm on a Tuesday in March is not the awards ceremony.
  assert.equal(hasPassedOnShowDay('15:00', at('2026-03-10T19:00:00Z')), false, 'not show day')
})

test('phaseOnShowDay closes the awards ceremony window at the end of the show', () => {
  // The exact call pages/Awards.jsx makes: 3:00pm ceremony, 4:00pm show close.
  const phase = (now) => phaseOnShowDay('15:00', '16:00', now)

  assert.equal(phase(at('2026-09-26T18:30:00Z')), 'before', '2:30pm ET')
  assert.equal(phase(at('2026-09-26T19:00:00Z')), 'during', '3:00pm ET exactly')
  assert.equal(phase(at('2026-09-26T19:30:00Z')), 'during', '3:30pm ET, mid-ceremony')
  assert.equal(phase(at('2026-09-26T20:00:00Z')), 'after', '4:00pm ET, show closes')

  // The regression this exists for: "Announcing now" lit at 11pm.
  assert.equal(phase(at('2026-09-27T03:00:00Z')), 'after', '11pm ET on show day')

  // And off show day it must read as upcoming, not finished.
  assert.equal(phase(at('2026-03-10T19:00:00Z')), 'before', '3pm on a Tuesday in March')
})

test('formatTime renders 24h schedule times as the site writes them', () => {
  assert.equal(formatTime('07:00'), '7:00am')
  assert.equal(formatTime('10:30'), '10:30am')
  assert.equal(formatTime('12:15'), '12:15pm', 'noon is 12pm, not 0pm')
  assert.equal(formatTime('15:00'), '3:00pm')
  assert.equal(formatTime('16:00'), '4:00pm')
  assert.equal(formatTime('00:30'), '12:30am', 'midnight is 12am, not 0am')
})

test('timeUntilShow never returns negative digits', () => {
  const before = timeUntilShow(at('2026-09-25T14:00:00Z'))
  assert.equal(before.phase, 'before')
  assert.equal(before.days, 1)
  assert.ok(Object.values(before).every((v) => v === 'before' || v >= 0))

  // The boundaries are where a countdown shows "0 days 0 hours" or goes negative.
  assert.equal(timeUntilShow(new Date(SHOW_START.getTime())).phase, 'live', 'exactly at 10am')
  assert.equal(timeUntilShow(new Date(SHOW_START.getTime() - 1)).phase, 'before', '1ms before')
  assert.equal(timeUntilShow(new Date(SHOW_END.getTime() - 1)).phase, 'live', '1ms before close')
  assert.equal(timeUntilShow(new Date(SHOW_END.getTime())).phase, 'over', 'exactly at 4pm')
})

test('currentEntryIndex picks the most recent entry at or before now', () => {
  // Mirrors the real schedule's shape, including the two entries that share 07:00.
  const schedule = [
    { time: '07:00', label: 'Show car gates open' },
    { time: '07:00', label: 'Registration opens' },
    { time: '10:00', label: 'Show opens' },
    { time: '15:00', label: 'Award ceremony' },
  ]

  assert.equal(currentEntryIndex(schedule, at('2026-09-26T10:00:00Z')), -1, '6am ET, before all')
  assert.equal(currentEntryIndex(schedule, at('2026-09-26T19:30:00Z')), 3, '3:30pm ET')

  // At 7am it can only name ONE of the two entries sharing that time, which is
  // why ScheduleList highlights by time rather than by this index.
  const i = currentEntryIndex(schedule, at('2026-09-26T11:00:00Z'))
  assert.equal(schedule[i].time, '07:00')
})
