# 08 · Troubleshooting

Failure modes already paid for once. Each entry is a symptom, the cause, and the
fix.

## Sign-ups

**`curl` to a callable returns `UNAUTHENTICATED`**
Not a bug. App Check (reCAPTCHA Enterprise) is enforced on production callables
— that response means it's working. Test in a real browser.

**Sign-up fails in an embedded browser pane**
reCAPTCHA doesn't load in in-app webviews or some IDE preview panes. Use a
normal browser window. The emulator skips App Check enforcement entirely
(`FUNCTIONS_EMULATOR` check in `functions/index.js`), so local testing never
sees this.

**"Volunteer sign-ups are closed"**
`events/2026` has `signupOpen: false`. That's the organizers' close switch —
flip it in the Firebase console.

**Sign-ups work but no confirmation email arrives**
By design, email failure never fails a signup. Check the function logs: if you
see `[email skipped — no RESEND_API_KEY]`, the secret is unset or starts with
`placeholder`. Rebinding it **requires a functions deploy**. Otherwise look for
`Resend error <status>` in the logs and check the Resend dashboard and the
domain's DNS records.

**`spotsFilled` disagrees with the roster**
Something wrote it outside a transaction. Recount from the `signups` collection
(`status === 'active'`, grouped by `shiftId`) and correct it — then find the
bare `update()` or batch write that caused it. Never write `spotsFilled` outside
a transaction that re-checks state.

**A volunteer appears twice with the same email**
Working as intended. Households share addresses and one person may take several
slots. Don't dedupe.

## Admin dashboard

**"…doesn't have organizer access" for someone who should have it**
`admins/<email>` doesn't exist, the email case doesn't match (document id must
be **lowercase**), or their sign-in didn't produce a verified email. All rules
check `email_verified`.

**An organizer sees the dashboard but no edit controls**
Their `admins` document has `role: 'viewer'`. Change it to `'admin'`. Note that
a document with *no* `role` field reads as `admin` — if edit controls are
missing, the role is explicitly set to viewer.

**"Couldn't load the dashboard"**
Distinct from the access-denied screen. Only `permission-denied` means "not an
organizer"; anything else (offline, missing index, backend outage) shows this.
Check the browser console.

**The magic-link sign-in says the link expired on the first try**
The code is single-use. React StrictMode double-invokes effects in development,
which used to redeem it twice; there's a guard for that now. On a genuinely
expired or reused link, request a new one. Opening the link on a *different
device* prompts for the email address, because the address is stored in
`localStorage` on the device that requested it.

**Google sign-in fails from a new URL with a generic error**
The domain isn't in Firebase Auth's authorized domains list. Add it by hand.

## Award board

**`/awards` is blank or errors**
Check that the public query still has `where('announced', '==', true)`. That
filter is what makes the read pass the Firestore rules — without it the read is
rejected for everyone who isn't an organizer.

**A winner appears twice after a CSV re-import**
You corrected a **car number** or a **trophy name**. The document id is derived
from those, so the correction created a new row and left the old one live.
Delete the stale row from the Awards tab, and pin the row with an explicit `id`
column before re-importing.

**Demo winners are visible to the public**
```bash
node scripts/seed-awards.mjs --clear-demo --prod
```
Removes only the `demo-` prefixed rows.

**"Announcing now" stayed lit all evening**
Fixed: the schedule window is now three states (`before` / `during` / `after`)
via `phaseOnShowDay`, not a boolean. A boolean has no way to say "already
finished", which left the pill lit until midnight and the empty-board copy
promising results "starting at 3:00 PM" at five o'clock. Don't reduce it back to
a boolean.

**A half-typed announcement got wiped**
The Announcement form keeps your local edit until it's saved, precisely because
`onSnapshot` fires on any write to `events/2026` — including a second organizer
saving, and your own save's round-trip. If this recurs, the `dirty`/`revision`
guards in `AnnouncementAdmin.jsx` have been simplified away. Put them back.

## Site & deploys

**Volunteer / Poker Run links are missing from the nav in spring**
`SHOW_DATE` in `src/lib/showTime.js` is still last year's. `hasShowDayArrived()`
is one-way. Bump the three constants. There's a dev-only console warning that
fires once `SHOW_END` is 45 days stale — that's the tripwire.

**The public bundle suddenly tripled in size**
Something on a public page imports `src/firebase.js`, directly or through a
component (pulling in `AwardsAdmin` would do it). The build succeeds silently.
Check `dist/` chunk sizes and trace the import.

**Every map pin renders ink-coloured**
The `--color-cat-*` variables moved into Tailwind's `@theme`. They must stay in
plain `:root` — they're read at runtime as `var(--color-cat-<id>)` built from a
category id, never as a utility class, and Tailwind v4 drops theme variables no
utility references.

**Pins are on the wrong side of the street**
`BBOX` in `src/lib/venueGeo.js` doesn't match the bounding box the base image
was exported at. They are one unit; change them together.

**`robots.txt` or `sitemap.xml` returns the React app**
The file isn't actually in `public/`. The SPA rewrite in `firebase.json` answers
`**` with the app shell. The CI smoke check greps `robots.txt` for a `Sitemap:`
line to catch exactly this.

**A new page isn't indexed**
It's missing from `public/sitemap.xml`, or it isn't calling `usePageMeta()`, or
it's passing `noindex: true`.

**The social share card is stale after replacing it**
Facebook and X cache aggressively. Re-scrape through their debuggers. And
rename the file with the new year rather than overwriting — `public/` files
aren't content-hashed, and `/assets/**` is served immutable for a year.

**A deploy failed and now the live site behaves inconsistently**
Read the workflow log for the *step* that failed. Rules deploy before Hosting,
so a failure there stops the release with the old site intact — the safe
failure. This ordering exists because gating rules on a `firestore.rules` diff
once shipped an admin-lockout fix whose UI half was live and whose rules half
was not.

**A function vanished from production**
It shouldn't have — the deploy runs without `--force` specifically so that a
function missing from source stops the deploy rather than being deleted
silently. If a deploy is refusing to proceed for this reason, that's the guard
working. Confirm the deletion is intended and do it deliberately.

**`npm install` warns `EBADENGINE`**
You're not on Node 22. `nvm use` reads `.nvmrc`. This is worth fixing rather
than ignoring: local Node 20 versus CI's Node 22 once made `node --test test/`
pass every local run and fail the deploy, because Node 20 accepts a directory
argument there and Node 22 treats it as a glob that matches nothing. CI now
pins from the same `.nvmrc` file so the two can't drift.

**`firebase deploy` says "have you run firebase login?" in CI**
The Workload Identity exchange failed. The auth step mints a token specifically
so the failure surfaces there with GCP's own error instead of as this vague
message further down. Read that step's output; usually it's a missing IAM role —
add it and re-run `scripts/setup-ci-deploy.sh`.

**GitHub secret-scanning flagged the Firebase API key**
It's a public client identifier, not a secret. Alert #1 was resolved as such.
