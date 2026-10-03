import { useEffect, useRef, useState } from 'react'

/**
 * Thumbnail grid with a lightbox. The lightbox is a native <dialog>: showModal()
 * brings the focus trap, the backdrop, inert background and Escape-to-close for
 * free, so none of that is reimplemented here. Arrow keys step through the set;
 * a click on the backdrop closes it.
 */
export default function PhotoGrid({ photos }) {
  const dialogRef = useRef(null)
  const [index, setIndex] = useState(null)

  const open = (i) => {
    setIndex(i)
    dialogRef.current?.showModal()
  }
  const count = photos.length
  const step = (delta) => setIndex((i) => (i + delta + count) % count)

  const isOpen = index !== null
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % count)
      else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, count])

  const photo = index === null ? null : photos[index]

  return (
    <>
      <ul className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => open(i)}
              className="block w-full aspect-[4/3] overflow-hidden rounded-lg bg-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <img
                src={p.thumb ?? p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
              <span className="sr-only">Enlarge photo</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current.close()
        }}
        aria-label="Photo viewer"
        className="m-auto max-w-[min(96vw,1400px)] max-h-[96vh] bg-transparent p-0 backdrop:bg-black/85"
      >
        {photo && (
          <figure className="flex flex-col items-center gap-3">
            <img
              src={photo.src}
              alt={photo.alt}
              className="max-w-full max-h-[80vh] w-auto h-auto rounded-md"
            />
            <figcaption className="text-cream text-sm text-center">
              {photo.alt}
              <span className="block text-gold-pale/70 mt-1">
                {index + 1} of {photos.length}
              </span>
            </figcaption>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => step(-1)}
                className="bg-gold hover:bg-gold-dark text-ink font-display uppercase tracking-wide px-4 py-2 rounded-md"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="border border-gold text-gold hover:bg-gold hover:text-ink font-display uppercase tracking-wide px-4 py-2 rounded-md"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="bg-gold hover:bg-gold-dark text-ink font-display uppercase tracking-wide px-4 py-2 rounded-md"
              >
                Next
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </>
  )
}
