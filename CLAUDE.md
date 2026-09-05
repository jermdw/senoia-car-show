# CLAUDE.md

Website + volunteer sign-up system for the annual Senoia Car Show (Sept 26, 2026).
Live at https://senoiacar.show on Firebase project `senoiacar` (Hosting, Firestore,
Cloud Functions, Auth). The volunteer system replaced volunteersignup.org; the
informational pages replaced the legacy page at enjoysenoia.com.

The human-facing planning playbook lives in `docs/` — year-rollover checklist,
asset recipes (incl. the Mapbox map export), show-day runbook, accounts. This
file is the compressed version of the same knowledge; when you change something
covered by both, update both in the same commit.

## Commands

```bash
npm run dev            # Vite dev server (auto-connects to emulators in DEV builds)
npx firebase-tools emulators:start --only auth,functions,firestore
node scripts/seed-shifts.mjs data/event_signups_2025_template.csv        # seed emulator
npm run build          # required before any hosting deploy (deploys dist/)
npm run lint           # oxlint
npx firebase-tools deploy --only hosting --project senoiacar             # site only
npx firebase-tools deploy --only functions,hosting --project senoiacar   # after functions changes
```

Merging to `main` auto-deploys via `.github/workflows/deploy.yml` (hosting and
Firestore rules every push; functions too when `functions/**` or `firebase.json`
changed, or via "Run workflow" with the box ticked). Rules go out
unconditionally — gating them on a `firestore.rules` diff skipped them whenever
a rules-changing push failed before that step, leaving hosting live against the
old ruleset. Node version comes from `.nvmrc`; keep local and CI on it. Keyless
auth (Workload Identity Federation) — one-time GCP setup is
`scripts/setup-ci-deploy.sh`. The manual commands above remain the fallback.

Prod seed (idempotent, preserves `spotsFilled`):
`GCLOUD_ACCESS_TOKEN=$(gcloud auth print-access-token) node scripts/seed-shifts.mjs <csv> --prod`

## Architecture

- **SPA**: React 19 + Vite + Tailwind v4, routes in `src/AppRoutes.jsx` (`src/main.jsx`
  is just the error boundary + router): public info pages (`/`, `/show`, `/map`,
  `/sponsors`, `/vendors`, `/merch`, `/faq`) use the shared `SiteHeader`/`SiteFooter`
  components; `/awards` (live award board), `/volunteer` (shift board),
  `/cancel?token=` (from confirmation emails), `/admin` (organizer dashboard).
  The four Firebase-touching routes (`/awards`, `/volunteer`, `/cancel`, `/admin`) are
  behind `React.lazy` so the Firebase SDK stays out of the chunk every spectator
  downloads — **keep public pages free of any `src/firebase.js` import** (including
  indirectly, via a component such as `AwardsAdmin`) or that split collapses.
  The header bar fits exactly seven direct links at `md`, so `SiteHeader.jsx` tucks
  the two lowest-traffic ones (`/poker-run`, `/merch`) behind a "More ▾" dropdown
  to make room for `/faq` and `/awards` as direct links — the dropdown only affects
  the inline `md`+ bar; the mobile hamburger menu lists all nine links flat, since a
  vertical list has no width to economize on. `/faq` is also reached from the
  footer (on every page) plus `/show`, `/map` and `/vendors`.
- **FAQ** (`/faq`): gate times, entrances and load-in addresses, in the words people
  email them in. Content is `src/data/faq.js`, which re-states facts that already
  live in `eventMap.js`/`Show.jsx`/`registration.js` rather than introducing new
  ones, and carries the same `confirmed` flag convention. Answers are plain strings
  with a separate `links` array so one copy feeds both the page and its FAQPage
  JSON-LD. Every question is deep-linkable (`/faq#car-haulers`) and opens on
  arrival — organizers answer email with those links, so cold loads must work.
- **Show day guide** (`/map`): base map is a Mapbox Static Images export at a fixed
  bounding box; `src/lib/venueGeo.js` converts lat/lon to a position on it exactly, so
  pins are geocoded, never hand-placed. Content lives in `src/data/eventMap.js`, where
  every entry carries a `confirmed` flag — unconfirmed entries are a working checklist
  and are never rendered. Mapbox's terms require the `© Mapbox, © OpenStreetMap`
  attribution the page displays.
- **Award board** (`/awards`): the show-day results page, fed live from Firestore.
  Organizers type winners on the Awards tab of `/admin` (`src/components/AwardsAdmin.jsx`);
  rows are **staged** (`announced: false`) until published, so the judges' sheet can be
  entered before the 3:00pm ceremony without leaking. Shared sort/search live in
  `src/lib/awards.js` so both sides order the list identically.
- **Cloud Functions v2** (`functions/index.js`): `signUp` and `cancelSignup` callables.
  All volunteer writes go through them (volunteers have no auth; the Admin SDK
  bypasses rules). Resend confirmation emails are best-effort by design — email
  failure must never fail a signup.
- **Firestore**: `events/2026` (`signupOpen: false` closes sign-ups),
  `events/2026/shifts/{id}` (`role, time, day, spotsTotal, spotsFilled,
  sortOrder`), `events/2026/awards/{id}` (`tier, title, carNumber, vehicle, owner,
  awardClass, photoUrl, announced, sortOrder`),
  `signups/{autoId}` (volunteer PII + `status` + `cancelToken`),
  `admins/{email}` (organizer allowlist; doc ID = lowercase email; data-only, no
  deploy needed to change). Carries `role: 'admin' | 'viewer'` — `admin` manages
  shifts, removes volunteers and gets the Awards/Announcement tabs; `viewer` can
  only read and export the roster. **Write the role explicitly when adding
  someone.** A doc with no `role` is read as `admin` (rules and `Admin.jsx` both
  default it), because entries predating the viewer role were full organizers —
  that fallback is backwards compatibility, not the way to grant access.

## Invariants

- `spotsFilled` changes only inside transactions that re-check state
  (capacity on signup, `status === 'active'` on any cancel/remove). Never write it
  with a bare update/batch — a double-click or race corrupts the count.
- Volunteer PII (`signups`) is never publicly readable; only allowlisted admins
  (verified email matching an `admins/{email}` doc) read it. Public reads are
  limited to shift docs (counts, no PII) and **announced** award docs.
- The public board's award query must keep its `where('announced', '==', true)`
  filter: that constraint is what makes the read pass the rules, so dropping it
  breaks the page rather than silently exposing staged winners. Award owner names
  are published, so they carry the announcer's form (first name, last initial) —
  the admin form says so; don't widen that field to full contact details.
- Duplicate signup emails are **allowed by design** (households share addresses).
- Admin sign-in: Google popup or email magic link. Both rely on
  `email_verified` in rules.

## Brand

Use the theme tokens in `src/index.css` (`@theme`), not raw Tailwind palette colors:
`cream` (page bg), `gold`/`gold-dark` (PMS 1255, buttons/accents), `gold-pale`
(PMS 7402), `ink` (near-black surfaces). Neutrals are warm `stone-*`, never `slate`.
Fonts: `font-display` (Oswald, condensed caps for headings/buttons) and
`font-script` (Yellowtail, sparing accent lines). Logos live in `src/assets`,
all WebP: `logo-header.webp` (small, for the `SiteHeader` bar), `logo-hero.webp`
(large, Landing hero), `logo-light-bg.webp` (for white/cream, e.g. the admin
sign-in card). Keep header art sized for its slot — it loads on every page.

## Gotchas

- **App Check** (reCAPTCHA Enterprise) is enforced on prod callables — curl gets
  `UNAUTHENTICATED`; that means it's working. Test signups in a real browser
  (reCAPTCHA does not load in embedded browser panes). The emulator skips
  enforcement via the `FUNCTIONS_EMULATOR` env check.
- **New Hosting domains** must be manually added to Firebase Auth authorized
  domains or Google sign-in fails from them with a generic error.
- `RESEND_API_KEY` is a Functions secret; sending is skipped when the value
  starts with `placeholder`. Rebind requires a functions deploy.
- `html` background is `ink` on purpose — iOS overscroll must match the footer.
- Page content is deliberately hardcoded in components (no CMS). Event facts
  (pricing, dates, sponsor tiers/names) come from the organizers or the legacy
  enjoysenoia.com page — never invent or extrapolate them.
- **SEO plumbing**: `public/robots.txt` + `public/sitemap.xml` must list any new
  public route (the SPA rewrite otherwise answers everything, even robots.txt,
  with the app shell). `index.html` carries the Event JSON-LD and social-card
  meta — update dates/status and `share-card-2026.png` each year, together with
  `SHOW_DATE`/`SHOW_START`/`SHOW_END` in `src/lib/showTime.js`. Bump those
  **first**: `hasShowDayArrived()` is a one-way switch, so until they move, next
  year's site stays in show-day mode with the Volunteer and Poker Run links
  hidden from the nav and the home page. A dev-only console warning fires once
  the date is more than 45 days stale. Per-route
  titles/canonicals come from `src/lib/usePageMeta.js`; every new page should
  call it (`noindex: true` for anything private). senoiacar.show is the
  canonical host — the `.web.app`/`.firebaseapp.com` mirrors must never be
  linked or promoted.
- GitHub secret-scanning flags the Firebase web API key in `src/firebase.js`;
  it is a public client identifier, not a secret (alert #1 resolved as such).
