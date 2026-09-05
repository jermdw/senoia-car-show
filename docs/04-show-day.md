# 04 · Show day operations

The site does three jobs on show day: the **guide** (`/map`), the **award
board** (`/awards`) and the **announcement banner**. Two of them need a human at
a keyboard.

## Before the doors open

- [ ] `/map` matches the actual site plan. It is the page people open at the gate.
- [ ] `/faq` answers this year's gate times and load-in addresses. Organizers
      paste FAQ deep links into email replies (`/faq#car-haulers`), so cold
      loads must work — every question is deep-linkable and opens on arrival.
- [ ] The judges' sheet is staged in the award board (below) — do this the night
      before if you can.
- [ ] Someone with an `admin` (not `viewer`) role is signed in to `/admin` on the
      device that will be at the stage, and has tested it on **show wifi or
      cellular**, not the office network.
- [ ] Sign-ups closed if you want them closed: `events/2026` → `signupOpen: false`.

## The nav swaps itself

No deploy needed. From the first moment of show day, `hasShowDayArrived()`
drops the Volunteer and Poker Run links from the header and the home page and
promotes Awards in their place. This is driven by `SHOW_DATE` in
`src/lib/showTime.js` and it is **one-way** — see
[01-year-rollover.md](01-year-rollover.md).

The `/map` schedule also highlights the current entry, and the awards board
shows an "Announcing now" pill, only on show day and only within the scheduled
window. Both read the wall clock in `America/New_York` rather than the
visitor's own timezone, so a spectator whose phone is set to Central time still
sees the right thing.

## The award board

**The shape of the workflow:** organizers type winners on the **Awards tab of
`/admin`**, and every row is **staged** (`announced: false`) until published.
That is what lets the judges' sheet be entered before the 3:00 PM ceremony
without leaking a single winner.

`events/2026/awards/{id}`:

| Field | |
| --- | --- |
| `tier` | `'featured'` or `'top50'` |
| `title` | featured only — the trophy name, e.g. `Best in Show Car` |
| `carNumber` | the entrant's number as a **string** — leading zeros are meaningful on the printed judging sheet |
| `vehicle` | `1957 Chevrolet Bel Air` |
| `owner` | **announcer's form: first name, last initial** |
| `awardClass` | optional — the class the car placed in |
| `photoUrl` | optional; featured cards show it, everything else gets a medallion |
| `announced` | `false` while staged |
| `sortOrder` | announcement order for the featured trophies |

### Two rules you must not break

**1. Owner names are the announcer's form — "John D." — and nothing more.**
These are published to the open web. The admin form says so. Do not widen that
field to full names, towns or contact details.

**2. The public board's query must keep `where('announced', '==', true)`.**
That filter is not a convenience — it is what makes the read pass the Firestore
rules. Drop it and the page breaks outright rather than silently exposing
staged winners, which is the failure mode you want, but it means "the awards
page is blank" can be a symptom of someone removing that filter.

### Running the ceremony

Publishing is **per group, never global**. There is no "publish everything"
button, deliberately: the Best in Show trophies are the finale, and a global
button would put them on the board before they were called.

1. **Before the ceremony** — enter or import the whole judges' sheet. Everything
   lands staged. The header shows `N live · M staged`.
2. **As each category is called** — hit *Publish N staged* on that group. It is
   a single batch write, so the board never shows half a category.
3. **A single row** can be toggled Live/Staged by tapping its badge — that is
   the undo for publishing something early.
4. **Best in Show last.** Publish the featured group only when the announcer
   reaches it.

Until the first row is published, the public board shows a "results starting at
3:00 PM" notice rather than looking broken.

### Bulk-loading the judges' sheet

`scripts/seed-awards.mjs` takes a CSV so you aren't typing 50 rows on a phone:

```bash
node scripts/seed-awards.mjs winners.csv --dry-run --prod   # read the plan first
node scripts/seed-awards.mjs winners.csv --prod             # imports STAGED
```

CSV columns (header row required, any order): `id,tier,title,carNumber,vehicle,owner,class`.
`tier` defaults to `top50`.

**The one trap.** The document id is derived from the row's *identity* — a Top 50
row is keyed on its car number, a featured row on its trophy name. So:

- Fixing a wrong **vehicle, owner or class** → updates the existing row. Good.
- Fixing a wrong **car number or trophy name** → changes the identity, writes a
  **new staged row**, and leaves the wrong one live. Bad.

For that second case, add an `id` column and keep the id stable across the
correction. Always `--dry-run` first: it prints the document ids without
touching the database, and an id that shifts between runs is the difference
between correcting a winner and publishing a second copy of them.

Re-running an import mid-ceremony is safe — `announced` is only written on
create, so a re-import never pulls an already-called winner back off the board.

### The demo set

```bash
node scripts/seed-awards.mjs --demo --prod        # sample board for organizers to preview
node scripts/seed-awards.mjs --clear-demo --prod  # removes ONLY the demo rows
```

Demo rows carry a `demo-` id prefix so `--clear-demo` can't take out a real
winner typed in alongside them. The placeholder owners are named after cartoon
characters on purpose: the demo goes on a public URL while organizers preview
it, so no row may be mistakable for a real entrant.

**Clear the demo set before show day.**

### Sorting and search

`src/lib/awards.js` holds the sort and search so the public board and the admin
list order identically — a winner the organizer sees at position 7 is at
position 7 on every spectator's phone. Car numbers sort numerically despite
being strings (so "10" follows "9"), and lettered numbers like `B12` sort after
the plain ones, alphabetically.

The single search box matches car number, vehicle, owner, class and title at
once, because a spectator at the stage knows *one* of those ("the blue F-100")
and never which one the site indexes on.

## The announcement banner

The Announcement tab of `/admin` writes `announcement: { text, active, updatedAt }`
onto `events/2026`. This is the "shuttles are running from the Baptist church
lot" / "ceremony delayed 20 minutes" channel.

It is read by `src/lib/announcement.js` over the **Firestore REST API**, not the
Firebase SDK — that's what lets it render on public pages without dragging the
Firebase chunk into the spectator bundle. It never throws: a flaky fetch just
means no banner, not a broken page.

**Two organizers can plausibly be in this dashboard at once on show day**, so
the form is built for it: your local edit wins over incoming snapshots until
you save, and text typed while a save is in flight is not marked clean by a
write that didn't carry it. Don't "simplify" that logic — it exists because the
naive version wipes a half-typed announcement.

Turn `active` off when the message expires. It has no automatic expiry.

## After the show

- Turn the announcement banner off.
- Leave the awards published — `/awards` is a nice permanent record, and
  `events/2026` stays in Firestore forever.
- Export the volunteer roster from `/admin` before anything else; it is the
  input to next year's shift list.
- **Start [01-year-rollover.md](01-year-rollover.md) within two weeks.**
