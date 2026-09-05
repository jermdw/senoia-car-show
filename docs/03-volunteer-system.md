# 03 · Volunteer system

Replaced volunteersignup.org for the 2026 show. Volunteers claim a shift with
name, email, phone and shirt size — no account, no password.

## How it fits together

```
/volunteer  ──calls──►  signUp (Cloud Function)  ──transaction──►  Firestore
   (public)                     │                                   events/2026/shifts/{id}
                                │                                   signups/{autoId}
                                └──best-effort──►  Resend confirmation email
                                                        │
/cancel?token=…  ──calls──►  cancelSignup  ─────────────┘
/admin  ──direct Firestore reads (allowlisted organizers)
```

**All volunteer writes go through the Cloud Functions.** Volunteers have no
auth, so there is no rule that could safely let a browser write these documents
— the Admin SDK inside the function bypasses rules instead, after validating
everything itself.

## Data model

`events/2026`
: `name`, `date`, `signupOpen`, and the `announcement` map (see [04](04-show-day.md)).
  **`signupOpen: false` is the organizers' close switch** — flip it in the
  Firebase console and `signUp` starts rejecting with "Volunteer sign-ups are
  closed." Publicly readable.

`events/2026/shifts/{id}`
: `role`, `time`, `day`, `spotsTotal`, `spotsFilled`, `sortOrder`. Publicly
  readable — counts only, no PII. The id is a 10-character SHA-1 of
  `role|time`, so re-seeding the same CSV always lands on the same documents.

`signups/{autoId}`
: `eventId`, `shiftId`, `firstName`, `lastName`, `email`, `phone`, `shirtSize`,
  `cancelToken`, `status` (`active` | `cancelled`), `createdAt`.
  **Never publicly readable.** Only allowlisted organizers can read it.

`admins/{email}`
: Document id is the lowercase email. Carries `role: 'admin' | 'viewer'`.
  Data-only — adding an organizer needs no deploy, just a document.

## The invariants

These are not style preferences. Breaking either produces a corrupt roster that
nobody notices until show morning.

**1. `spotsFilled` only ever changes inside a transaction that re-checks state.**
Capacity on signup; `status === 'active'` on any cancel or removal. Never write
it with a bare `update()` or in a batch — a double-click or a race between a
volunteer's cancel link and an organizer's Remove button corrupts the count.
Decrements are floored at zero (`Math.max(0, …)`), because a shift that was
deleted and re-seeded with a fresh `spotsFilled: 0` while a signup stayed active
would otherwise go negative and advertise more open spots than exist.

**2. Volunteer PII is never publicly readable.** Public reads are limited to
shift documents (counts) and *announced* award documents. The rule that enforces
it depends on `email_verified` being true in the auth token, which both sign-in
methods provide.

**3. Duplicate emails are allowed by design.** Households share addresses, and
one person may take several slots of the same shift. Do not "fix" this.

## Seeding the shift list

The shift list starts life as a CSV in the shape volunteersignup.org exported —
one row per slot, duplicated rows collapsed into a shift with a spot count.
`data/event_signups_2025_template.csv` is the template.

```
"What","When","Credits","Volunteer First Name","Volunteer Last Name","Email","Phone"
"Sign & Barrels","9/26 - 9:00AM - 12:00PM","","","","",""
"Sign & Barrels","9/26 - 9:00AM - 12:00PM","","","","",""
```

Two `Sign & Barrels` rows become one shift with `spotsTotal: 2`.

```bash
# emulator (defaults to FIRESTORE_EMULATOR_HOST=localhost:8080)
node scripts/seed-shifts.mjs data/event_signups_2025_template.csv

# production — idempotent, preserves spotsFilled
GCLOUD_ACCESS_TOKEN=$(gcloud auth print-access-token) \
  node scripts/seed-shifts.mjs data/event_signups_2025_template.csv --prod
```

Things worth knowing before you run it against production:

- **`DATE_MAP` at the top of the script maps the CSV's day tokens to real
  dates.** For 2026 it mapped `9/26 → 2026-09-25`, `9/27 → 2026-09-26`,
  `9/28 → 2026-09-27`, because the 2025 CSV's dates were a day off from 2026's.
  An unmapped token aborts the run with the offending row — it fails loudly
  rather than seeding a shift onto the wrong day.
- **It is idempotent.** Existing shifts keep their `spotsFilled`; only new ones
  get `spotsFilled: 0`.
- **`signupOpen` is written only when the event document doesn't exist yet**, so
  a re-seed can never silently reopen sign-ups you closed.
- **Production goes over the REST API**, not the Admin SDK, because the Admin
  SDK wants downloaded credentials and a short-lived `gcloud` token is safer.
  The script pages through the *entire* existing shift list first — a shift
  missed by pagination would be treated as new and have its live `spotsFilled`
  clobbered to zero.
- `batchWrite` is non-atomic: HTTP 200 can still carry per-write failures, so
  the script inspects the per-write status and throws if any failed.

The script prints the full plan before writing. Read it.

## The organizer dashboard (`/admin`)

Sign in with a Google popup or an email magic link. Both rely on
`email_verified`. The magic link stores your address in `localStorage` before
sending; open the link on a different device and it prompts for the address
instead.

Three tabs, gated by role:

| Tab | `admin` | `viewer` |
| --- | --- | --- |
| Volunteers — roster, export, add/edit/delete shifts, remove volunteers | ✅ | read + export only |
| Awards | ✅ | hidden |
| Announcement | ✅ | hidden |

The dashboard defaults to read-only until the role document loads, so edit
controls never flash on for a viewer.

### Adding an organizer

Create `admins/<lowercase-email>` in the Firebase console with
`role: 'admin'` or `role: 'viewer'`. **Write the role explicitly.**

A document with *no* `role` is read as `admin` by both `firestore.rules` and
`Admin.jsx`. That default is backwards compatibility — entries written before
the viewer role existed were all full organizers, and reading `role` as null
locked those people out of the dashboard entirely. It is a compatibility floor,
not the way to grant access.

### The shirt order

The Volunteers tab shows a **shirt-size tally across the top**: this is what you
hand to the shirt printer. It counts *shirts, not people* — a volunteer holding
three shifts gets three lines and, per the confirmation email, is owed a shirt
per signup. Sizes are `S, M, L, XL, 2XL, 3XL, 4XL` (`src/shirtSizes.js`, mirrored
in `functions/index.js`; keep the two in step).

### Export CSV

Reproduces the volunteersignup.org column order the organizers are used to,
with `Shirt Size` appended on the end. Two behaviours that exist because the
printed roster must never disagree with the screen:

- A shift holding more signups than `spotsTotal` (because an admin shrank it)
  exports **all** of them — nobody is dropped.
- An active signup whose shift was deleted exports under `(deleted shift)`
  rather than vanishing.

Cells beginning `= + - @` and tabs are prefixed with `'` to neutralise
spreadsheet formula injection from volunteer-supplied text.

### Deleting a shift

Blocked while it has active signups, and re-checked against the server
immediately before the delete — the local snapshot can be stale, and a
volunteer can sign up while the confirmation dialog is open.

## Confirmation emails

Sent via Resend from `Senoia Car Show <noreply@senoiacar.show>`, and
**best-effort by design: an email failure must never fail a signup.** The
volunteer has the spot; a bounced confirmation is an annoyance, a lost
transaction is a real problem.

The signup email contains the role and time, the reserved shirt size, the
**volunteer training meeting dates and shirt-pickup location**, and the cancel
link. Those meeting dates are hardcoded in `functions/index.js` and are easy to
forget at rollover, because they're backend code rather than a page — and
changing them costs a functions deploy.

`RESEND_API_KEY` is a Functions secret. **Sending is skipped entirely when the
value starts with `placeholder`**, which logs `[email skipped — no
RESEND_API_KEY]` instead. That's how the emulator and a non-configured
environment behave. Rebinding the secret requires a functions deploy.

## Testing a signup

**In a real browser, on the real site.** App Check (reCAPTCHA Enterprise) is
enforced on production callables, so:

- `curl` gets `UNAUTHENTICATED` — that means App Check is working, not broken.
- reCAPTCHA does not load in embedded browser panes (in-app webviews, some IDE
  previews). Use a normal browser window.

The emulator skips App Check enforcement via a `FUNCTIONS_EMULATOR` env check,
so local testing is unaffected.
