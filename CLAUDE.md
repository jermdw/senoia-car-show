# CLAUDE.md

Website + volunteer sign-up system for the annual Senoia Car Show (Sept 26, 2026).
Live at https://senoiacar.show on Firebase project `senoiacar` (Hosting, Firestore,
Cloud Functions, Auth). The volunteer system replaced volunteersignup.org; the
informational pages replaced the legacy page at enjoysenoia.com.

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

Merging to `main` auto-deploys via `.github/workflows/deploy.yml` (hosting every
push; functions too when `functions/**` changed, or via "Run workflow" with the
box ticked). Keyless auth (Workload Identity Federation) — one-time GCP setup is
`scripts/setup-ci-deploy.sh`. The manual commands above remain the fallback.

Prod seed (idempotent, preserves `spotsFilled`):
`GCLOUD_ACCESS_TOKEN=$(gcloud auth print-access-token) node scripts/seed-shifts.mjs <csv> --prod`

## Architecture

- **SPA**: React 19 + Vite + Tailwind v4, routes in `src/AppRoutes.jsx` (`src/main.jsx`
  is just the error boundary + router): public info pages (`/`, `/show`, `/map`,
  `/sponsors`, `/vendors`, `/merch`) use the shared `SiteHeader`/`SiteFooter`
  components; `/volunteer` (shift board), `/cancel?token=` (from confirmation emails),
  `/admin` (organizer dashboard).
  The three Firebase-touching routes (`/volunteer`, `/cancel`, `/admin`) are behind
  `React.lazy` so the Firebase SDK stays out of the chunk every spectator downloads —
  **keep public pages free of any `src/firebase.js` import** or that split collapses.
- **Show day guide** (`/map`): base map is a Mapbox Static Images export at a fixed
  bounding box; `src/lib/venueGeo.js` converts lat/lon to a position on it exactly, so
  pins are geocoded, never hand-placed. Content lives in `src/data/eventMap.js`, where
  every entry carries a `confirmed` flag — unconfirmed entries are a working checklist
  and are never rendered. Mapbox's terms require the `© Mapbox, © OpenStreetMap`
  attribution the page displays.
- **Cloud Functions v2** (`functions/index.js`): `signUp` and `cancelSignup` callables.
  All volunteer writes go through them (volunteers have no auth; the Admin SDK
  bypasses rules). Resend confirmation emails are best-effort by design — email
  failure must never fail a signup.
- **Firestore**: `events/2026` (`signupOpen: false` closes sign-ups),
  `events/2026/shifts/{id}` (`role, time, day, category, spotsTotal, spotsFilled,
  sortOrder`), `signups/{autoId}` (volunteer PII + `status` + `cancelToken`),
  `admins/{email}` (organizer allowlist; doc ID = lowercase email; data-only, no
  deploy needed to change).

## Invariants

- `spotsFilled` changes only inside transactions that re-check state
  (capacity on signup, `status === 'active'` on any cancel/remove). Never write it
  with a bare update/batch — a double-click or race corrupts the count.
- Volunteer PII (`signups`) is never publicly readable; only allowlisted admins
  (verified email matching an `admins/{email}` doc) read it. Public reads are
  limited to shift docs (counts, no PII).
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
  meta — update dates/status and `share-card-2026.png` each year. Per-route
  titles/canonicals come from `src/lib/usePageMeta.js`; every new page should
  call it (`noindex: true` for anything private). senoiacar.show is the
  canonical host — the `.web.app`/`.firebaseapp.com` mirrors must never be
  linked or promoted.
- GitHub secret-scanning flags the Firebase web API key in `src/firebase.js`;
  it is a public client identifier, not a secret (alert #1 resolved as such).
