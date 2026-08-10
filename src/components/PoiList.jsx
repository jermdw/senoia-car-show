import CategoryIcon from './CategoryIcon.jsx'

// The text alternative to the map (WCAG 1.1.1) — and on a phone, usually the
// faster way to answer "where's the nearest restroom". Not a fallback view.
export default function PoiList({ categories, pois, selectedId, onSelect }) {
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
        <section key={category.id} aria-labelledby={`poi-group-${category.id}`}>
          <h3
            id={`poi-group-${category.id}`}
            className="flex items-center gap-2 font-display uppercase tracking-wide text-ink mb-2"
          >
            <CategoryIcon category={category.id} className="w-5 h-5 text-gold-dark" />
            {category.label}
          </h3>
          <ul className="space-y-2">
            {items.map((poi) => (
              <li key={poi.id}>
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
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
