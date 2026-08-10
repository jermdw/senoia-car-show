import { useEffect, useRef, useState, useCallback } from 'react'
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

  // Must gate on isWithinMap, not just on having coordinates: a POI outside the base
  // map's extent (the remote lots — Tencate, Rockaway, Housing Authority) would other-
  // wise render at e.g. left:188%, invisible behind overflow-hidden but still focusable
  // and still counted in the "N of M pinned" caption.
  const placed = pois
    .filter((p) => isWithinMap(p.lat, p.lon))
    .map((p) => ({ poi: p, pos: toPercent(p.lat, p.lon) }))

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
    const onBeforePrint = () => pz.reset({ animate: false })
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
        className="relative overflow-hidden rounded-xl border border-stone-200 bg-white aspect-[1280/1123]"
      >
        <div ref={stageRef} className="relative w-full h-full origin-center">
          <img
            src={BASE_MAP}
            alt="Street map of historic downtown Senoia showing Main Street and the surrounding show area."
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable="false"
          />
          {placed.map(({ poi, pos }) => {
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
                  // Counter-scale so the pin stays a constant 44px touch target at any zoom.
                  transform: `translate(-50%, -50%) scale(${1 / scale})`,
                  zIndex: isSelected ? 20 : 10,
                  backgroundColor: isSelected ? 'var(--color-gold)' : 'var(--color-ink)',
                  borderColor: isSelected ? 'var(--color-ink)' : 'var(--color-gold)',
                  color: isSelected ? 'var(--color-ink)' : 'var(--color-gold)',
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
          {placed.length} of {pois.length} locations pinned — the rest are listed below.
        </span>
        <span>{ATTRIBUTION}</span>
      </figcaption>
    </figure>
  )
}
