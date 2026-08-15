import { useEffect } from 'react'

const ORIGIN = 'https://senoiacar.show'

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Per-route head tags. The static tags in index.html are the crawler-safe
 * defaults (they describe the event as a whole); this hook retargets them to
 * the route actually shown, for the browser tab, JS-rendering crawlers
 * (Googlebot), and anything reading the DOM after hydration.
 *
 * `path` is the canonical path for the page ('/show'). Pages that should
 * never be indexed (404, cancel, admin) pass `noindex: true` instead — they
 * get a robots meta and their canonical is dropped rather than pointed
 * somewhere misleading.
 */
export default function usePageMeta({ title, description, path, noindex = false }) {
  useEffect(() => {
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (noindex) {
      upsertMeta('name', 'robots', 'noindex')
      canonical?.remove()
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove()
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', ORIGIN + path)
      upsertMeta('property', 'og:url', ORIGIN + path)
    }
  }, [title, description, path, noindex])
}
