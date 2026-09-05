# 02 · Website runbook

Everything needed to run, change and ship <https://senoiacar.show>.

## What it is

A single-page React app on Firebase Hosting, with a small Firestore + Cloud
Functions backend behind the volunteer system. No CMS: page content is
hardcoded in components, on purpose. The show's facts change once a year and
come from the organizers in email and documents — a CMS would add an editing
surface nobody would log into, and a second place for facts to disagree.

| Layer | Choice |
| --- | --- |
| Frontend | React 19, Vite, Tailwind v4, React Router 7 |
| Hosting | Firebase Hosting, project `senoiacar` |
| Data | Cloud Firestore |
| Backend | Cloud Functions v2 (`signUp`, `cancelSignup`) |
| Auth | Firebase Auth — Google popup + email magic link, organizers only |
| Email | Resend, from `noreply@senoiacar.show` |
| Abuse control | App Check (reCAPTCHA Enterprise), enforced on prod callables |
| Analytics | Google Tag Manager → GA4, prod builds only |
| Node | 22 (`.nvmrc`; CI reads the same file) |

## Getting set up

```bash
nvm use                                   # reads .nvmrc → Node 22
npm install && (cd functions && npm install)
```

On an older Node, `npm install` warns `EBADENGINE`. Don't ignore it — CI runs
22, and the versions have behaved differently in ways that passed locally and
broke the deploy (see [08-troubleshooting.md](08-troubleshooting.md)).

Two terminals:

```bash
npx firebase-tools emulators:start --only auth,functions,firestore
npm run dev
```

A **DEV build auto-connects to the emulators** — that wiring lives at the bottom
of `src/firebase.js` and keys off `import.meta.env.DEV`, so there is no flag to
remember and no way to accidentally point `npm run dev` at production data.
The same gate disables App Check and GTM outside production builds.

Seed the emulator with a shift list so `/volunteer` has something to show:

```bash
node scripts/seed-shifts.mjs data/event_signups_2025_template.csv
```

To sign in as an organizer against the emulator, the dev build exposes
`window.__testSignIn('you@example.com')` in the browser console — it mints a
credential directly and skips the Google popup. You still need a matching
`admins/{email}` document in the emulator's Firestore for the dashboard to load.

```bash
npm test     # pure-logic tests: no emulator, no network
npm run lint # oxlint
```

`npm test` covers the show-day time helpers, the awards ordering, the map
projection and the show-day nav swap — deliberately the logic that is hard to
exercise by hand because it only behaves differently on one day of the year.

## Routes

```
/            Landing          public
/show        Show info        public
/poker-run   Poker Run        public
/map         Show day guide   public
/sponsors    Sponsors         public
/vendors     Vendors          public
/merch       Merch            public
/faq         FAQ              public
/awards      Award board      Firebase — lazy
/volunteer   Shift board      Firebase — lazy
/cancel      Cancel a shift   Firebase — lazy, noindex
/admin       Organizer dash   Firebase — lazy, noindex
```

Routes live in `src/AppRoutes.jsx`; `src/main.jsx` is only the error boundary,
router and GTM init.

### The one structural rule: keep Firebase out of the public bundle

The four Firebase-touching routes are behind `React.lazy`, so the ~169 kB
gzipped Firebase SDK never lands in the chunk a spectator downloads. Importing
`src/firebase.js` has side effects — `initializeApp`, App Check, emulator wiring
— so a single stray import from a public page collapses that split silently.
The build still succeeds; the bundle just quietly triples.

**Never import `src/firebase.js` from a public page, or from any component a
public page renders.** The trap is indirect imports: pulling `AwardsAdmin` into
a public page would do it.

Where a public page genuinely needs Firestore data — the announcement banner —
`src/lib/announcement.js` hits the Firestore REST endpoint directly with `fetch`
instead. `events/2026` is publicly readable under the rules, so it needs no auth
and no SDK.

`src/lib/routeLoaders.js` holds the dynamic imports in one place so `AppRoutes`
(to build the lazy components) and `SiteHeader` (to prefetch on hover/focus/touch)
share one import specifier and Vite dedupes them into one chunk. Without the
prefetch, tapping "Volunteer" on a slow connection looks like nothing happened,
because React Router wraps navigation in `startTransition` and keeps the old
page mounted rather than showing the Suspense fallback.

### Navigation

`SiteHeader.jsx` fits exactly seven direct links at the `md` breakpoint, so the
two lowest-traffic ones (`/poker-run`, `/merch`) sit behind a "More ▾" dropdown.
That only applies to the inline bar — the mobile hamburger lists all nine flat,
since a vertical list has no width to economise on.

The nav also **swaps itself on show day** with no redeploy: `hasShowDayArrived()`
drops Volunteer and Poker Run and promotes Awards. See
[01-year-rollover.md](01-year-rollover.md) for why that is a one-way switch.

## Deploying

### Automatic (normal path)

Merge to `main`. `.github/workflows/deploy.yml` runs lint → test → build →
**Firestore rules** → Hosting (and Functions when the push touched `functions/`
or `firebase.json`, or when you tick the box on a manual `workflow_dispatch`).

Two deliberate design decisions in that workflow, both bought with a real
outage:

- **Rules deploy before Hosting, and unconditionally.** Before Hosting, because
  a page whose reads depend on a new rule must not reach users ahead of the
  rule. Unconditionally, because gating on a `firestore.rules` diff skips them
  in exactly the case that matters: a push that *did* change the rules but died
  earlier in the job leaves the fix-forward push — which doesn't touch the file
  — deploying Hosting against the **old** ruleset. That shipped an admin lockout
  fix whose UI half was live and whose rules half was not. Re-uploading an
  unchanged ruleset is a no-op, so the diff check bought nothing.
- **No `--force`.** If a function disappears from source, the deploy stops
  rather than silently deleting it in production.

The job ends with a smoke check: it fetches `/` and confirms `robots.txt` still
starts with a `Sitemap:` line.

Auth is keyless — GitHub's OIDC token is exchanged for the `github-deploy`
service account via Workload Identity Federation, restricted to this repo. **No
service-account key exists to leak**, which matters because this repo is public.
One-time GCP setup is `scripts/setup-ci-deploy.sh` (idempotent; re-run it after
adding a role).

### Manual (fallback)

```bash
npm run build                                                       # required — deploys dist/
npx firebase-tools deploy --only hosting --project senoiacar
npx firebase-tools deploy --only functions,hosting --project senoiacar   # after functions changes
```

A functions deploy is slow and rebinds secrets, which is why CI skips it for
copy changes.

## Branding

Use the theme tokens in `src/index.css` (`@theme`), never raw Tailwind palette
colours:

| Token | Value | Use |
| --- | --- | --- |
| `cream` | `#f5eedb` | page background |
| `gold` / `gold-dark` | `#ad841f` / `#8f6c17` | PMS 1255 — buttons, accents |
| `gold-pale` | `#eedc9a` | PMS 7402 |
| `ink` | `#16130b` | near-black surfaces, footer |

Neutrals are warm `stone-*`, never `slate`. Fonts are `font-display` (Oswald,
condensed caps for headings and buttons) and `font-script` (Yellowtail, sparing
accent lines only). Both are self-hosted via `@fontsource`, so there is no
Google Fonts request and no layout shift.

`html` has an `ink` background on purpose: public pages end in the ink footer,
and iOS overscroll must reveal ink rather than white.

The eight map-category colours in `:root` are **deliberately not in `@theme`**.
They are read at runtime as `var(--color-cat-<id>)` built from a category id,
never as a Tailwind utility class — and Tailwind v4 drops theme variables that
no utility references, which silently rendered every map pin ink-coloured. Each
clears 4.5:1 contrast against `cream`, and none is close to `gold`, which is
reserved for the selected pin.

## SEO

- `public/robots.txt` and `public/sitemap.xml` must list any new public route.
  The SPA rewrite answers everything with the app shell, including `robots.txt`,
  if the file isn't actually there.
- `index.html` carries the Event JSON-LD and the social-card meta.
- Per-route titles and canonicals come from `src/lib/usePageMeta.js`. Every new
  page calls it; private pages pass `noindex: true`, which adds a robots meta
  and *removes* the canonical and `og:url` rather than pointing them somewhere
  misleading.
- **senoiacar.show is the one canonical host.** The `senoiacar.web.app` and
  `.firebaseapp.com` mirrors serve identical copies and must never be linked or
  promoted; the canonical tag keeps them out of the index.
- Adding a new Hosting domain? It must be added by hand to the Firebase Auth
  **authorized domains** list, or Google sign-in fails from it with a generic
  error.

## Analytics

GTM container `GTM-5P5465M9`, loaded only in production builds so localhost
traffic never reaches the live GA4 property. React Router navigation doesn't
reload the page, so `usePageMeta` pushes a virtual `page_view` into the data
layer on every route change.

`pushPageView` tracks **pathname only, never the query string** — `/cancel`
carries a per-signup cancellation token, and that must not reach Google
Analytics. Preserve that if you touch it.
