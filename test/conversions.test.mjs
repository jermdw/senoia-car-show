import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ticketClickParams } from '../src/lib/conversions.js'
import { REGISTRATION_URL } from '../src/data/registration.js'
import { SPONSORSHIP_URL } from '../src/data/sponsorship.js'

const ORIGIN = 'https://senoiacar.show'

test('the live Register button link is counted as car registration', () => {
  assert.deepEqual(ticketClickParams(REGISTRATION_URL, ORIGIN), {
    link_type: 'car_registration',
    link_host: 'www.tickettailor.com',
    link_path: '/checkout/view-event/id/8046457/chk/bdc3/',
  })
})

test('the buytickets.at short link for registration is car registration too', () => {
  assert.equal(
    ticketClickParams('https://buytickets.at/senoiadda/2164595', ORIGIN).link_type,
    'car_registration',
  )
})

test('the sponsor link is counted as sponsorship', () => {
  assert.equal(ticketClickParams(SPONSORSHIP_URL, ORIGIN).link_type, 'sponsorship')
})

test('food registration is counted separately', () => {
  assert.equal(
    ticketClickParams('https://buytickets.at/senoiadda/2207639', ORIGIN).link_type,
    'food_registration',
  )
})

test('poker run tickets are counted', () => {
  assert.equal(
    ticketClickParams('https://senoiahistory.com/embed/tickets/cruisin-for-history-poker-run-2026', ORIGIN).link_type,
    'poker_run_tickets',
  )
})

test('an unknown Ticket Tailor event is still a ticket click, not a mislabel', () => {
  assert.equal(
    ticketClickParams('https://www.tickettailor.com/events/senoiadda/9999999', ORIGIN).link_type,
    'tickets_other',
  )
})

test('the query string never reaches the event: sponsor codes and tokens stay out', () => {
  const p = ticketClickParams('https://www.tickettailor.com/events/senoiadda/2207650?a=SCSSG1', ORIGIN)
  assert.equal(p.link_type, 'sponsorship')
  assert.equal(JSON.stringify(p).includes('SCSSG1'), false)
  assert.equal(JSON.stringify(p).includes('?'), false)
})

test('ordinary links are ignored', () => {
  assert.equal(ticketClickParams('https://senoiahistory.com/', ORIGIN), null, 'museum home page')
  assert.equal(ticketClickParams('/faq', ORIGIN), null, 'internal route')
  assert.equal(ticketClickParams('mailto:carshow@enjoysenoia.com', ORIGIN), null, 'mailto')
  assert.equal(ticketClickParams('https://example.com/tickettailor.com', ORIGIN), null, 'lookalike path')
  assert.equal(ticketClickParams('https://nottickettailor.com/x/8046457', ORIGIN), null, 'lookalike host')
})
