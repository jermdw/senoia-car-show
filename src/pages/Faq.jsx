import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { faqBySection, publishedFaq } from '../data/faq.js'

const ORIGIN = 'https://senoiacar.show'

/**
 * FAQPage structured data, built from the same strings the page renders so the
 * two cannot drift. Google shows these as expandable answers under the search
 * result, which is the whole point: most of these questions are asked by someone
 * who is already searching rather than reading the site.
 *
 * Injected here rather than in index.html because that file's JSON-LD describes
 * the event itself on every route — a FAQPage there would claim every page is one.
 */
function useFaqJsonLd(items) {
  useEffect(() => {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      url: `${ORIGIN}/faq`,
      mainEntity: items.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') },
      })),
    })
    document.head.appendChild(el)
    return () => el.remove()
  }, [items])
}

export default function Faq() {
  usePageMeta({
    title: 'FAQ — Gates, Load-In, Parking & Maps | Senoia Car Show',
    description:
      'Answers for the 2026 Senoia Car Show: car hauler and trailer parking, show-car gate times and entrances, vendor and non-profit load-in, spectator parking and shuttles, and a printable venue map.',
    path: '/faq',
  })

  const groups = useMemo(faqBySection, [])
  const items = useMemo(publishedFaq, [])
  useFaqJsonLd(items)

  // Uncontrolled <details> would lose the deep-linked open state on re-render, so
  // the set of open questions is React's. Several can be open at once — someone
  // planning a load-in is reading three of these side by side, not one.
  const [openIds, setOpenIds] = useState(() => new Set())
  const setOpen = (id, isOpen) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (isOpen) next.add(id)
      else next.delete(id)
      return next
    })

  // /faq#car-haulers opens that answer — this page exists partly so organizers can
  // answer an email with a link straight to the paragraph, and a link that lands on
  // a collapsed row has not answered anything. ScrollToTop does the scrolling.
  const { hash } = useLocation()
  useEffect(() => {
    const id = hash.slice(1)
    if (id && items.some((f) => f.id === id)) setOpen(id, true)
  }, [hash, items])

  const allOpen = openIds.size === items.length

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink mb-2">
          Frequently Asked <span className="text-gold">Questions</span>
        </h1>
        <p className="font-script text-gold text-2xl mb-6">Saturday, September 26, 2026</p>
        <p className="text-stone-700 mb-8 leading-relaxed">
          Gate times, entrances and addresses for everyone bringing something to
          the show — cars, haulers, tents and trailers — plus the basics for
          anyone coming to look. Every answer links through to the spot on the{' '}
          <Link to="/map" className="underline underline-offset-2 font-semibold hover:text-gold-dark">
            show day guide
          </Link>
          .
        </p>

        {/* Jump links, not a table of contents: this page is read on a phone at
            6am at a gate, where scrolling past twenty answers is the whole cost. */}
        <nav aria-label="Jump to a section" className="flex flex-wrap gap-2 mb-8">
          {groups.map(({ section }) => (
            <a
              key={section.id}
              href={`#section-${section.id}`}
              className="inline-flex items-center min-h-11 px-4 rounded-full border border-stone-300 bg-white font-display uppercase tracking-wide text-sm text-ink hover:border-gold hover:text-gold-dark transition-colors"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={() => setOpenIds(allOpen ? new Set() : new Set(items.map((f) => f.id)))}
            className="min-h-11 text-sm font-semibold text-ink underline underline-offset-2 hover:text-gold-dark"
          >
            {allOpen ? 'Collapse all answers' : 'Expand all answers'}
          </button>
        </div>

        {groups.map(({ section, items: questions }) => (
          <section key={section.id} aria-labelledby={`section-${section.id}`} className="mb-10">
            <h2
              id={`section-${section.id}`}
              // Clears the sticky header when a jump link lands here.
              className="scroll-mt-24 font-display text-2xl uppercase tracking-wide text-ink border-b-2 border-gold pb-2 mb-4"
            >
              {section.label}
            </h2>
            <ul className="space-y-3">
              {questions.map((f) => (
                <li key={f.id}>
                  <details
                    id={f.id}
                    open={openIds.has(f.id)}
                    onToggle={(e) => setOpen(f.id, e.currentTarget.open)}
                    className="scroll-mt-24 group bg-white rounded-xl border border-stone-200 open:border-gold transition-colors"
                  >
                    <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-start gap-3 p-4 min-h-11 font-display text-lg uppercase tracking-wide text-ink group-open:text-gold-dark">
                      {/* aria-hidden: the disclosure state is already announced by
                          <details>/<summary> itself, so the chevron is decoration. */}
                      <span
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-gold transition-transform group-open:rotate-90"
                      >
                        ▸
                      </span>
                      <span>{f.q}</span>
                    </summary>
                    <div className="px-4 pb-4 pl-10">
                      {f.a.map((para) => (
                        <p key={para} className="text-stone-700 leading-relaxed mb-3">
                          {para}
                        </p>
                      ))}
                      {f.links.length > 0 && (
                        <p className="flex flex-wrap gap-x-5 gap-y-2">
                          {f.links.map((l) =>
                            l.to ? (
                              <Link
                                key={l.label}
                                to={l.to}
                                className="font-semibold text-sm text-gold-dark underline underline-offset-2 hover:text-ink"
                              >
                                {l.label} →
                              </Link>
                            ) : (
                              <a
                                key={l.label}
                                href={l.href}
                                // Only http(s) links leave the site; mailto:/tel:
                                // hand off to an app and must not open a blank tab.
                                {...(l.href.startsWith('http')
                                  ? { target: '_blank', rel: 'noreferrer' }
                                  : {})}
                                className="font-semibold text-sm text-gold-dark underline underline-offset-2 hover:text-ink"
                              >
                                {l.label} →
                              </a>
                            ),
                          )}
                        </p>
                      )}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="bg-ink rounded-xl p-6 text-center">
          <p className="font-script text-gold text-2xl mb-2">Still need an answer?</p>
          <p className="text-gold-pale/90 mb-4">
            The organizers would rather hear from you than have you guess at a
            gate on show morning.
          </p>
          <p className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a
              className="font-display uppercase tracking-wide text-cream underline underline-offset-2 hover:text-gold-pale"
              href="mailto:carshow@enjoysenoia.com"
            >
              carshow@enjoysenoia.com
            </a>
            <a
              className="font-display uppercase tracking-wide text-cream underline underline-offset-2 hover:text-gold-pale"
              href="tel:+17707279173"
            >
              (770) 727-9173
            </a>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
