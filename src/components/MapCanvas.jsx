import { useEffect, useRef, useState, useCallback } from 'react'
import { flushSync } from 'react-dom'
import Panzoom from '@panzoom/panzoom'
import CategoryIcon from './CategoryIcon.jsx'
import { toPercent, isWithinMap, ATTRIBUTION } from '../lib/venueGeo.js'

const BASE_MAP = '/venue-base-2026-web.webp'
const MIN_SCALE = 1
const MAX_SCALE = 6

export default function MapCanvas({ pois, categories, activeCategories, selectedId, onSelect }) {
  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const panzoomRef = useRef(null)
  const pinRefs = useRef({})
  const [scale, setScale] = useState(1)

  // Gate on isWithinMap, not merely on having coordinates. Everything off-map today
  // carries lat/lon null so this is currently defensive, but the moment anyone gives a
  // remote lot real coordinates it would otherwise render at e.g. left:188% — invisible
  // behind overflow-hidden, yet still focusable and still counted in the caption.
  const placed = pois
    .filter((p) => isWithinMap(p.lat, p.lon))
    .map((p) => ({ poi: p, pos: toPercent(p.lat, p.lon) }))

  // Several things genuinely share a spot — first aid, food and the Welcome Center are
  // all at 68 Main; the Post Office has both a restroom and accessible parking. Their
  // coordinates are correct and stay untouched; instead the pins fan out around the
  // shared point so each stays visible and tappable. Offsets are applied in screen
  // pixels (see the transform below), so the cluster keeps its shape at any zoom.
  const FAN_RADIUS_PX = 11
  const groups = new Map()
  placed.forEach((p) => {
    const key = `${p.pos.x.toFixed(4)},${p.pos.y.toFixed(4)}`
    const g = groups.get(key)
    if (g) g.push(p)
    else groups.set(key, [p])
  })
  groups.forEach((members) => {
    if (members.length < 2) return
    members.forEach((m, i) => {
      const angle = (i / members.length) * 2 * Math.PI - Math.PI / 2
      m.fan = {
        dx: Math.cos(angle) * FAN_RADIUS_PX,
        dy: Math.sin(angle) * FAN_RADIUS_PX,
      }
    })
  })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const pz = Panzoom(stage, {
      minScale: MIN_SCALE,
      maxScale: MAX_SCALE,
      contain: 'outside',
      // Buttons inside the stage must stay clickable rather than starting a pan.
      excludeClass: 'map-pin',
      // Own the DOM write explicitly. Relying on panzoom's default write plus its
      // panzoomchange event left the transform unpainted and `scale` stale after
      // StrictMode's mount/unmount/mount cycle, which broke the pin counter-scaling.
      setTransform: (elem, { scale: s, x, y }) => {
        elem.style.transform = `scale(${s}) translate(${x}px, ${y}px)`
        setScale(s)
      },
    })
    panzoomRef.current = pz
    const parent = stage.parentElement
    const onWheel = (e) => pz.zoomWithWheel(e)
    parent.addEventListener('wheel', onWheel)
    // The container clips to its bounds, so printing while zoomed would crop the
    // handout to whatever the user was looking at — and silently drop pins that
    // the printed list still names. Reset to the full venue before the print runs.
    // flushSync so the pins' counter-scale state is committed before the print
    // snapshot: reset() writes the transform synchronously, but the setScale it
    // triggers would otherwise be batched and the pins would print at a stale scale.
    const onBeforePrint = () => flushSync(() => pz.reset({ animate: false }))
    window.addEventListener('beforeprint', onBeforePrint)
    return () => {
      parent.removeEventListener('wheel', onWheel)
      window.removeEventListener('beforeprint', onBeforePrint)
      pz.destroy()
    }
  }, [])

  // Measure-and-correct rather than modelling panzoom's transform: read where the
  // pin actually is on screen and pan by that delta. Pan units are pre-scale, hence /scale.
  const centerOn = useCallback((id) => {
    const pz = panzoomRef.current
    const pin = pinRefs.current[id]
    const container = containerRef.current
    if (!pz || !pin || !container) return
    const c = container.getBoundingClientRect()
    const p = pin.getBoundingClientRect()
    // A hidden (filtered-out) pin measures as all zeros, which would pan the map to
    // a meaningless spot. Its ref is still live, so the null check above can't catch it.
    if (!p.width || !p.height) return
    const dx = c.left + c.width / 2 - (p.left + p.width / 2)
    const dy = c.top + c.height / 2 - (p.top + p.height / 2)
    const cur = pz.getPan()
    const s = pz.getScale()
    // Not animated on purpose: panzoom reports the settled pan immediately while the
    // element is still easing, so measuring mid-animation and adding a delta to the
    // already-final value overshoots when two selections land inside one transition.
    pz.pan(cur.x + dx / s, cur.y + dy / s, { animate: false })
  }, [])

  useEffect(() => {
    if (!selectedId) return
    // Wait a frame so the pin is laid out before measuring it.
    const raf = requestAnimationFrame(() => centerOn(selectedId))
    return () => cancelAnimationFrame(raf)
  }, [selectedId, centerOn])

  const zoomBy = (factor) => {
    const pz = panzoomRef.current
    if (pz) pz.zoom(Math.min(MAX_SCALE, Math.max(MIN_SCALE, pz.getScale() * factor)), { animate: true })
  }
  const reset = () => panzoomRef.current?.reset({ animate: true })

  const labelFor = (poi) => {
    const cat = categories.find((c) => c.id === poi.category)
    return `${poi.name}${poi.where ? `, ${poi.where}` : ''}${cat ? ` — ${cat.label}` : ''}`
  }

  return (
    <figure className="mb-4">
      <div
        ref={containerRef}
        // Must match the exported image's aspect exactly, or object-cover crops it and
        // every pin drifts off its street. Keep in step with BBOX in venueGeo.js.
        className="relative overflow-hidden rounded-xl border border-stone-200 bg-white aspect-[1126/1280]"
      >
        <div ref={stageRef} className="relative w-full h-full origin-center">
          <img
            src={BASE_MAP}
            alt="Street map of historic downtown Senoia showing Main Street and the surrounding show area."
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable="false"
          />
          {placed.map(({ poi, pos, fan }) => {
            const isSelected = poi.id === selectedId
            // Filtered-out pins are hidden on screen but always printed, so the
            // handout can never show fewer locations than the list beside it.
            const isActive = activeCategories.includes(poi.category)
            return (
              <button
                key={poi.id}
                ref={(el) => { pinRefs.current[poi.id] = el }}
                type="button"
                onClick={() => onSelect?.(poi.id)}
                aria-label={labelFor(poi)}
                aria-current={isSelected ? 'true' : undefined}
                aria-hidden={!isActive}
                tabIndex={isActive ? undefined : -1}
                // 36px on phones so six pins in three blocks don't overlap into a
                // blob; 44px from sm up. Both clear WCAG 2.5.8's 24px minimum, and
                // zooming separates them further without changing their size.
                className={`map-pin absolute items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 shadow-md transition-colors print:flex ${
                  isActive ? 'flex' : 'hidden'
                }`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  // Counter-scale so the pin stays a constant 44px touch target at any
                  // zoom. The fan offset is divided by scale because it lives in stage
                  // coordinates, which the stage's own scale(s) then multiplies back up
                  // — net effect is a constant offset in screen pixels.
                  transform: `translate(-50%, -50%) translate(${(fan?.dx ?? 0) / scale}px, ${
                    (fan?.dy ?? 0) / scale
                  }px) scale(${1 / scale})`,
                  zIndex: isSelected ? 20 : 10,
                  // Gold is reserved for the selected pin so it can never be mistaken
                  // for a category. Category hues are defined in index.css.
                  backgroundColor: isSelected
                    ? 'var(--color-gold)'
                    : `var(--color-cat-${poi.category}, var(--color-ink))`,
                  borderColor: isSelected ? 'var(--color-ink)' : 'var(--color-cream)',
                  color: isSelected ? 'var(--color-ink)' : 'var(--color-cream)',
                }}
              >
                <CategoryIcon category={poi.category} className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )
          })}
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-1 print:hidden">
          <button type="button" onClick={() => zoomBy(1.5)} aria-label="Zoom in"
            className="w-11 h-11 rounded-md bg-ink text-gold font-display text-xl leading-none shadow">+</button>
          <button type="button" onClick={() => zoomBy(1 / 1.5)} aria-label="Zoom out"
            className="w-11 h-11 rounded-md bg-ink text-gold font-display text-xl leading-none shadow">−</button>
          <button type="button" onClick={reset} aria-label="Reset map view"
            className="w-11 h-11 rounded-md bg-ink text-gold font-display text-[10px] uppercase tracking-wide shadow">Reset</button>
        </div>
      </div>

      <figcaption className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-stone-600">
        <span>
          {placed.length} of {pois.length} locations pinned — the rest are listed under Find Your Way.
        </span>
        <span>{ATTRIBUTION}</span>
      </figcaption>
    </figure>
  )
}
