const GTM_ID = 'GTM-5P5465M9'

// Loads the GTM container only in production builds, so localhost/dev
// traffic never reaches the live GA4 property. Mirrors the App Check
// PROD gate in src/firebase.js.
export function initGtm() {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)
}

// Pushes a virtual pageview for GTM's "Custom Event - page_view (SPA)"
// trigger, since React Router navigation never reloads the page. Tracks
// pathname only — never the query string, which on /cancel carries a
// per-signup cancellation token that must not reach Google Analytics.
export function pushPageView(title) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'page_view',
    page_path: window.location.pathname,
    page_title: title,
    page_location: window.location.origin + window.location.pathname,
  })
}
