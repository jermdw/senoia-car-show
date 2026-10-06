import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ORIGIN, shareLinks, shareUrl, photoSlug } from '../src/lib/share.js'

test('share URLs use the canonical host', () => {
  assert.equal(ORIGIN, 'https://senoiacar.show')
  assert.equal(shareUrl('/gallery'), 'https://senoiacar.show/gallery')
})

test('share links encode the URL, title and text', () => {
  const l = shareLinks({ path: '/gallery/2026?photo=cars-scout', title: 'A & B', text: 'Look: it’s great' })
  assert.ok(l.facebook.endsWith(encodeURIComponent('https://senoiacar.show/gallery/2026?photo=cars-scout')))
  assert.ok(l.x.includes('text=' + encodeURIComponent('Look: it’s great')))
  assert.ok(l.email.startsWith('mailto:?subject=A%20%26%20B&body='))
  assert.ok(!/web\.app|firebaseapp/.test(Object.values(l).join('')))
})

test('photoSlug is the file name without extension', () => {
  assert.equal(photoSlug({ src: '/gallery/2026/cars-scout.webp' }), 'cars-scout')
})
