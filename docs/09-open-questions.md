# 09 · Open questions

Things this playbook cannot answer from the code, and things left unresolved at
the end of the 2026 cycle. **Each one is a small job for someone with the
organizers' ear.** Close them by editing the relevant doc or file and deleting
the entry here.

## Carried over from 2026 — unresolved

### 1. Two schedule entries have never been published

`src/data/eventMap.js` holds both at `confirmed: false`, so they don't render.
The operations playbook contradicts itself:

| Entry | Conflict |
| --- | --- |
| **"Crank Your Engines"** | 12:15 PM (General Info) vs 12:00 PM (DJ schedule) |
| **Falcon RV Squadron fly-over** | 11:45 AM (General Info) vs 1:00 PM (DJ schedule) |

Ask the DJ and the flight coordinator, flip the flags. This has been open for a
year and is a two-question email.

### 2. Poker run stop 3 is a private address

`src/pages/PokerRun.jsx` lists it as `1 Wood Dr, Newnan` — the route map labels
it "Woodies". There's a `TODO(organizers)` in the file. **Confirm the name it
should be listed under, and confirm the owner is happy to be publicly listed at
all**, before next year's page goes up.

### 3. Three businesses render as text because we have no verified artwork

- `SS Chassis Works` (Gold sponsor)
- `Circle M Barbeque` (food vendor — note the name trap documented in
  `src/pages/Vendors.jsx`; `circlembbq.com` is an unrelated SC restaurant)
- `Fosters Sandwiches` (food vendor)

The DDA's food-truck coordinator has contacts for the two vendors. A text cell
is a correct outcome, not a bug — but artwork would be better.

### 4. ⚠️ Ticket Tailor access-code examples are in a public file

`src/data/sponsorship.js` contains a comment giving two real-looking per-slot
access codes as examples of the `?a=CODE` mechanism. Those codes each unlock one
reserved curbside sponsor space, and this repository is public.

**Action:** replace them with `<code>` placeholders in the comment, and — if
they were ever live — rotate them in Ticket Tailor. The mechanism is worth
documenting; the codes are not. See
[06-content-map.md](06-content-map.md#the-ticket-tailor-tier-mechanics).

## Needs an organizer to fill in

### 5. Where does the operations playbook live?

`src/data/eventMap.js` cites "the 2026 Senoia Car Show Playbook
(organizer-maintained)" as the source of truth for every event fact. Nothing
records *where it is* or *who holds it*. Put a link or a location in
[README.md](README.md) — without it, the citation is unverifiable.

### 6. Print & physical signage

The whole of the "⬜ Print & physical signage" section in
[05-assets-and-artwork.md](05-assets-and-artwork.md) — porch signs, "You Are
Here" boards, banners, plaques, trophies, gate signage. Vendors, lead times,
source files, costs, who stores what between years.

**This is the single biggest gap in the playbook.**

### 7. The bus-factor list

[07-accounts-and-access.md](07-accounts-and-access.md) ends with a list of "who
holds this credential" that only the current maintainers can complete. It needs
to live somewhere the DDA controls, not only in this repo — the repo is one of
the things it grants access to.

### 8. Decisions for the 2027 cycle

- [ ] **Confirm show day.** The fourth Saturday in September has been the
      pattern, but the date moved between 2025 and 2026. Everything in
      [01-year-rollover.md](01-year-rollover.md) hangs off it.
- [ ] Do Main Street and North Main sell out again? Both were fixed-size blocks
      marked sold out in 2026, which is why `/show` shows a struck-through
      price rather than a dead checkout link.
- [ ] Do the sponsorship tiers, prices and slot counts (Title 1–11, Gold 1–12,
      Silver 1–16) carry over?
- [ ] Is the plaque order cut-off still mid-August?
- [ ] Are the volunteer training meetings still the Tuesday and Thursday before,
      at 7:00 PM at the SAHS Museum? These are hardcoded in the confirmation
      email in `functions/index.js`.
- [ ] Does the shirt design change? Is the volunteer shirt still free with a
      shift, and still one per signup rather than one per person?

## Improvements worth considering

None of these are broken. They're the things that came up and didn't get done.

- **`EVENT_ID` is declared in four files.** Rolling the year means changing all
  four, and missing one produces a site that reads shifts from one year and
  writes awards to another with no error. It can't trivially be one shared
  constant — `src/lib/announcement.js` deliberately avoids importing
  `src/firebase.js` — but a tiny dependency-free `src/lib/eventId.js` imported by
  all four would fix it.
- **A rollover script.** Steps 1–3 of the rollover are mechanical enough to
  automate: take a year, rewrite the constants, rename the dated assets, bump
  the sitemap.
- **A `/playbook` route.** These docs currently need a GitHub visit. Rendering
  them at `senoiacar.show/playbook` (noindexed) would put them in front of
  non-technical committee members.
- **Archive the roster off-platform after each show.** Volunteer PII sits in
  Firestore indefinitely. Consider a retention policy: export, then delete
  `signups` older than two years.
