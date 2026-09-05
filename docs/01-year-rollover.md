# 01 · Year rollover checklist

**This is the first job of the new cycle, and it is time-critical.** Do it in
the two weeks after the show, not in the spring.

## Why the order matters

`hasShowDayArrived()` in `src/lib/showTime.js` is a **one-way switch**. From the
moment show day arrives it returns `true` forever, and the site changes
permanently:

- the Volunteer and Poker Run links vanish from the nav and the home page
- the Awards board is pinned into the nav in their place
- the hero countdown reads *"That's a wrap on 2026 — see you next September"*

That is correct for October. It is catastrophic in June, because next year's
volunteer sign-ups will open with **no link to them anywhere on the site**.
Bumping the date constants is therefore step 1, before any content work.

There is a tripwire for exactly this: a dev-only console warning fires in
`npm run dev` once `SHOW_END` is more than 45 days past. If you see it, you are
already late.

---

## Step 1 — The date switch (do this first, on its own branch)

`src/lib/showTime.js`:

```js
export const SHOW_DATE = { year: 2027, month: 8, day: 25 } // month is 0-INDEXED: 8 = September
export const SHOW_START = new Date('2027-09-25T10:00:00-04:00')
export const SHOW_END   = new Date('2027-09-25T16:00:00-04:00')
```

Three things to get right:

1. **`month` is zero-indexed.** September is `8`. This has bitten people.
2. **The `-04:00` offset is deliberate, not lazy.** Late September in Georgia is
   still EDT (UTC−4), so a fixed offset is exact and needs no timezone library.
   If the show ever moves past the first Sunday in November, this stops being true.
3. **`index.html`'s Event JSON-LD must advertise the same instants** (step 3).
   Search engines read that, not the JS.

Then `npm test` — `test/showTime.test.mjs` exercises these at a fixed clock.

## Step 2 — The event id

`EVENT_ID` is the Firestore document under `events/`, and it is declared in
**four separate files**. Missing one produces a site that reads shifts from one
year and writes awards to another, with no error message.

| File | Constant |
| --- | --- |
| `src/firebase.js` | `export const EVENT_ID = '2026'` |
| `src/lib/announcement.js` | `const EVENT_ID = '2026'` (kept separate on purpose — this module must not import the Firebase SDK) |
| `scripts/seed-shifts.mjs` | `const EVENT_ID = '2026'` |
| `scripts/seed-awards.mjs` | `const EVENT_ID = '2026'` |

`grep -rn "EVENT_ID = '" src scripts` before you call this step done.

Leave the old year's Firestore data in place. `events/2026` costs nothing to
keep and is the only record of who volunteered and who won.

## Step 3 — `index.html`

Everything a crawler or a Facebook share card sees:

- `<title>` and `<meta name="description">`
- `og:title`, `og:description`, `og:image`, `og:image:alt`
- `twitter:image`
- **Event JSON-LD — there are two `Event` objects in the array**: the car show
  and the Cruisin' for History Poker Run. Update `name` (the ordinal —
  "21st Annual" → "22nd Annual"), `startDate`, `endDate`, and the poker run's
  dates. If weather ever forces a change, `eventStatus` is where you say so
  (`EventPostponed`, `EventCancelled`).
- Both `image` arrays point at `share-card-2026.png` / `poster-2026.webp` —
  rename these to the new year when you replace the artwork (step 6).

## Step 4 — Rebuild the shift list and reopen sign-ups

Full detail in [03-volunteer-system.md](03-volunteer-system.md). In summary:

1. Export the roster from `/admin` → **Export CSV** before you touch anything —
   it is the only backup of who did what last year, and it is the input to
   next year's shift list.
2. Edit the CSV down to the shifts you want (one row per slot, no volunteer
   names), fix the `DATE_MAP` at the top of `scripts/seed-shifts.mjs` to map the
   CSV's day tokens to the new dates, and update the event `name` and `date` in
   the same file.
3. Seed the emulator first, check `/volunteer` looks right, then seed production.

The seed script is idempotent and never clobbers `spotsFilled`, and it only
writes `signupOpen` when the event document doesn't exist yet — so re-running it
can't silently reopen sign-ups you closed.

## Step 5 — Content pass, page by page

| File | What carries the year |
| --- | --- |
| `src/pages/Landing.jsx` | Hero date line, "21st Annual", meta, card blurbs, flyer link |
| `src/pages/Show.jsx` | `PRICING` table, `DATES` list, "21st Annual", the whole intro paragraph |
| `src/pages/Sponsors.jsx` | `SPONSORS_2026` array (clear it), `TIERS` prices, the dated plaque-deadline notice |
| `src/pages/Vendors.jsx` | `FOOD_VENDORS_2026` array (clear it), the "registration is closed" banner — **reopen it** |
| `src/pages/Merch.jsx` | Shirt art, price, colours, sizes, the enjoysenoia.com buy link |
| `src/pages/PokerRun.jsx` | Date line, the five `STOPS`, `TICKETS_URL` (the year is in the slug) |
| `src/data/registration.js` | `REGISTRATION_URL`, `REGISTRATION_PRICE` |
| `src/data/sponsorship.js` | `SPONSORSHIP_URL`, `BRONZE_PRICE`, the Ticket Tailor event ids in the comment |
| `src/data/eventMap.js` | Every POI and `SCHEDULE` entry |
| `src/data/faq.js` | Dates and addresses throughout |
| `src/components/Countdown.jsx` | "That's a wrap on 2026" and the fallback date line |
| `src/components/SiteFooter.jsx` | Date line, PorchFest date |
| `functions/index.js` | **The volunteer training meeting dates in the confirmation email.** Easy to miss — it's backend code, not a page. Requires a functions deploy. |

`grep -rn "2026\|21st" src functions scripts index.html public/sitemap.xml`
catches the rest. Expect roughly 120 hits; most are legitimately dates in copy.

## Step 6 — Artwork

Recipes are in [05-assets-and-artwork.md](05-assets-and-artwork.md). The pieces
with a year baked into the filename:

- `public/share-card-2026.png` (1200×630, referenced by `index.html`)
- `public/poster-2026.webp` and `public/flyer-2026.pdf` (linked from `/` and `/show`)
- `public/venue-base-2026-web.webp` and `design/venue-base-2026-print.png`
- `src/assets/shirt-*.webp`

Rename the files rather than overwriting. `/assets/**` is served with a
one-year immutable cache header, and `public/` files are not content-hashed —
a same-named replacement can be served stale from a visitor's browser for
months.

## Step 7 — SEO plumbing

- `public/sitemap.xml` — bump every `lastmod`; add any new route.
- `public/robots.txt` — add any new private route to `Disallow`.
- Any new page must call `usePageMeta()` with its own title, description and
  canonical `path` (or `noindex: true` if it's private).

The SPA rewrite in `firebase.json` answers `**` with the app shell, so a route
missing from `sitemap.xml` is genuinely invisible, and a file missing from
`public/` returns the React app rather than a 404.

## Step 8 — Access review

In the Firebase console, `admins/{email}`:

- Remove organizers who have rotated off.
- Add new ones, **writing `role: 'admin'` or `role: 'viewer'` explicitly.**
  A document with no `role` is read as full `admin` by both the rules and the
  dashboard. That fallback exists only for entries predating the viewer role;
  relying on it grants more access than you meant to.

## Step 9 — Deploy and verify

```bash
npm run lint && npm test && npm run build
```

Merging to `main` deploys automatically. Then, in a real browser:

- `/` — countdown counts down to the new date, Volunteer and Poker Run links are back
- `/volunteer` — shifts listed; complete one real sign-up and confirm the email arrives
- `/cancel?token=…` — use the link in that email
- `/admin` — sign in, see the sign-up, remove it
- `/awards` — the board is empty and says so (last year's winners stay under `events/2026`)
- View source on `/` — JSON-LD dates are the new ones
- Paste the URL into Facebook's sharing debugger — the new share card appears

## The five-minute version

```
[ ] showTime.js constants (FIRST)
[ ] EVENT_ID in all four files
[ ] index.html: title, meta, both JSON-LD events
[ ] Seed new shifts, signupOpen: true
[ ] Content pass, incl. training-meeting dates in functions/index.js
[ ] New artwork with new filenames
[ ] sitemap.xml lastmod + robots.txt
[ ] admins/{email} review, roles explicit
[ ] Deploy; test a real sign-up in a real browser
```
