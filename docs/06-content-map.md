# 06 · Where every fact lives

The lookup table for "someone emailed to say X is wrong — which file?"

There is no CMS. Content is hardcoded in components on purpose: the facts change
once a year, they arrive from the organizers by email, and a CMS would add an
editing surface nobody logs into plus a second place for facts to disagree.

## Facts declared once and reused

Change these in one place and every page that quotes them follows.

| Fact | Declared in |
| --- | --- |
| Show date, gates open/close | `SHOW_DATE`, `SHOW_START`, `SHOW_END` — `src/lib/showTime.js` |
| Firestore event id | `EVENT_ID` — `src/firebase.js`, and **separately** in `src/lib/announcement.js`, `scripts/seed-shifts.mjs`, `scripts/seed-awards.mjs` |
| Show car registration link & price | `REGISTRATION_URL`, `REGISTRATION_PRICE` — `src/data/registration.js` |
| Sponsorship link & Bronze price | `SPONSORSHIP_URL`, `BRONZE_PRICE` — `src/data/sponsorship.js` |
| Shirt sizes | `SHIRT_SIZES` — `src/shirtSizes.js` (**mirrored in `functions/index.js`**) |
| Brand colours & fonts | `@theme` in `src/index.css` |
| Map bounding box & attribution | `BBOX`, `ATTRIBUTION` — `src/lib/venueGeo.js` |
| GTM container id | `src/lib/gtm.js` |

## Page by page

| Page | File | Facts it owns |
| --- | --- | --- |
| `/` | `src/pages/Landing.jsx` | Hero date line, ordinal ("21st Annual"), card blurbs, flyer link |
| `/show` | `src/pages/Show.jsx` | `PRICING` table, `DATES` key-dates list, eligibility (25 years and older), parking & logistics bullets, same-day registration hours, poker run summary |
| `/poker-run` | `src/pages/PokerRun.jsx` | The five `STOPS` and `FINISH`, `STEPS`, `FACTS`, the SAHS ticket embed URL |
| `/map` | `src/data/eventMap.js` | `CATEGORIES`, `POIS`, `SCHEDULE` |
| `/sponsors` | `src/pages/Sponsors.jsx` | `SPONSORS_2026` roster by tier, `TIERS` prices and perks, the plaque-deadline notice |
| `/vendors` | `src/pages/Vendors.jsx` | `FOOD_VENDORS_2026`, the registration-closed banner |
| `/merch` | `src/pages/Merch.jsx` | Shirt names, prices, colours, sizes, the online store link |
| `/faq` | `src/data/faq.js` | Every Q&A, grouped into four sections |
| Footer, every page | `src/components/SiteFooter.jsx` | Contact email, phone, PO box, date line, PorchFest cross-promo |
| `index.html` | — | `<title>`, meta description, Open Graph, **two Event JSON-LD objects** |
| Confirmation email | `functions/index.js` | **Volunteer training meeting dates and shirt pickup location** |

## The `confirmed` flag convention

`src/data/eventMap.js` and `src/data/faq.js` both carry a `confirmed` boolean on
every entry, and both export a `published*()` helper that filters on it.

`confirmed: false` means **the operations playbook is silent on this item or
contradicts itself.** The entry stays in the file as a working checklist and is
never rendered. Resolve it with the organizers, flip the flag, and it appears.

Use this instead of deleting an uncertain entry or publishing a guess. Two
entries have been sitting at `false` since 2026 — see
[09-open-questions.md](09-open-questions.md).

## The FAQ deserves its own note

`/faq` is written in the words people actually email in, not in the words the
organizers use internally. Every question is deep-linkable (`/faq#car-haulers`)
and **opens on arrival**, because organizers answer email by pasting those links
— so cold loads must work.

Answers are plain strings with a separate `links` array, so one copy feeds both
the rendered page and the FAQPage JSON-LD. Don't put markup in the answer string.

The FAQ deliberately **re-states** facts that already live in `eventMap.js`,
`Show.jsx` and `registration.js` rather than introducing new ones. When you
change a gate time, grep for it — it is quoted in more than one place, and the
FAQ is the copy people trust most because it's the one that got emailed to them.

## Money and checkout

Nothing is sold on this site. Two external box offices:

| What | Where | Notes |
| --- | --- | --- |
| Show vehicle registration | Ticket Tailor `buytickets.at/senoiadda/2164595` | Interactive seat-map checkout, which is why we link out rather than embed |
| Sponsorships | Ticket Tailor `buytickets.at/senoiadda/2207650` | Deliberately **absent from the public listing** at tickettailor.com/events/senoiadda — it is Published and selling, reachable only by direct link. Don't conclude from the listing that it's offline. |
| Shirts (online) | `enjoysenoia.com` store | That's where the DDA's payment processing lives |
| Poker run tickets | `senoiahistory.com` (Stripe) | Embedded as an iframe on `/poker-run` |

### The Ticket Tailor tier mechanics

Only **Bronze** is on open public sale. Title, Gold and Silver are built as
individually numbered slots (Title 1–11, Gold 1–12, Silver 1–16), each quantity
1 and each gated behind a **ticket access code**, because every slot is a
specific curbside space the SDDA assigns on approval.

A logged-out buyer opening the checkout sees Bronze and nothing else. That is
why `/sponsors` sends the upper tiers through the SDDA contact box instead of to
a checkout that would look sold out or broken to them.

Ticket Tailor can pre-apply an access code via `?a=CODE`, so an approved sponsor
can be sent straight to their unlocked tier from the SDDA's approval email. Two
gotchas:

1. It only works on the `www.tickettailor.com/events/…` form. **The
   `buytickets.at` short link silently drops the query string.**
2. **Codes are per slot, not per tier.** Such a link is unique to one sponsor's
   reserved space and must never be published on the site — it would let anyone
   buy that space.

> ⚠️ **Access codes belong in Ticket Tailor and in the SDDA's email, nowhere
> else.** They must not be committed to this repo or written into these docs.
> See [09-open-questions.md](09-open-questions.md) — there is a cleanup item
> outstanding on this.

### The poker run ticket embed

The SAHS widget is framed rather than reimplemented, and it posts
`{type:'sahs:embed-height', height}` to resize itself. Our handler is stricter
than SAHS's own reference snippet: it checks the origin **and** that the message
came from that iframe's own window, then clamps the height so a bad value can't
blow up the layout. Keep both checks if you touch it.
