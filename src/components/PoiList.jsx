import CategoryIcon from './CategoryIcon.jsx'
import { isWithinMap } from '../lib/venueGeo.js'

// The text alternative to the map (WCAG 1.1.1) — and on a phone, usually the
// faster way to answer "where's the nearest restroom". Not a fallback view.
// `idPrefix` keeps the screen and print copies from emitting the same DOM ids —
// both are in the DOM at once, only their `display` differs.
export default function PoiList({ categories, pois, selectedId, onSelect, idPrefix = 'poi' }) {
  const groups = categories
    .map((c) => ({ category: c, items: pois.filter((p) => p.category === c.id) }))
    .filter((g) => g.items.length > 0)

  if (groups.length === 0) {
    return (
      <p className="text-stone-600 bg-white border border-stone-200 rounded-lg p-6">
        No locations match the filters you have selected.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {groups.map(({ category, items }) => (
        <section key={category.id} aria-labelledby={`${idPrefix}-group-${category.id}`}>
          <h3
            id={`${idPrefix}-group-${category.id}`}
            className="flex items-center gap-2 font-display uppercase tracking-wide text-ink mb-2"
          >
            <CategoryIcon
              category={category.id}
              className="w-5 h-5"
              style={{ color: `var(--color-cat-${category.id})` }}
            />
            {category.label}
          </h3>
          <ul className="space-y-2">
            {items.map((poi) => {
              const pinned = isWithinMap(poi.lat, poi.lon)
              const body = (
                <>
                  <span className="block font-semibold text-ink">{poi.name}</span>
                  {poi.where && (
                    <span className="block text-stone-700 text-sm mt-0.5">
                      {poi.where}
                    </span>
                  )}
                  {poi.blurb && (
                    <span className="block text-stone-600 text-sm mt-1 leading-relaxed">
                      {poi.blurb}
                    </span>
                  )}
                </>
              )
              return (
                <li key={poi.id}>
                  {pinned ? (
                    <button
                      type="button"
                      onClick={() => onSelect?.(poi.id)}
                      aria-current={selectedId === poi.id ? 'true' : undefined}
                      className={`w-full text-left rounded-lg border p-4 min-h-11 transition-colors ${
                        selectedId === poi.id
                          ? 'bg-gold-pale border-gold'
                          : 'bg-white border-stone-200 hover:border-gold'
                      }`}
                    >
                      {body}
                    </button>
                  ) : (
                    // Not a button: with no pin there is nothing to select or centre.
                    // An <a> also cannot live inside a <button>, which is what the
                    // directions link needs to be.
                    <div className="rounded-lg border border-stone-200 bg-white p-4">
                      {body}
                      {poi.directions && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(poi.directions)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center min-h-11 mt-1 text-sm font-semibold text-gold-dark underline underline-offset-2 hover:text-ink"
                        >
                          Driving directions →
                        </a>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
