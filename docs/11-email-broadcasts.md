# 11 · Email broadcasts

The organizers send three kinds of bulk email: **volunteer** messages (meeting
invite, thank-you), **car-owner** messages (instructions, poker-run reminder),
and **sponsor** follow-ups. Until 2026 the organizers wrote the text and a
person with a Gmail account pasted it into a hand-built recipient list. In 2026
the volunteer and car-owner sends moved to **Resend broadcasts** on the
`senoiacar.show` domain. This doc is the recipe, written so the whole thing can
be scripted next year.

The transactional confirmation/cancellation emails are a different system (a
Cloud Function) — see [03-volunteer-system.md](03-volunteer-system.md).

## The request pattern

Every send starts the same way: **Steve Maloy (show chair) emails the text he
wants sent**, usually in his own voice and signed "Steve". The sender of record
is the website maintainer, not Steve. Rules that held in 2026:

- Steve's wording is final. Fix only plain typos (a missing "a"), and say so.
- Steve may send a follow-up "Edit" email after the first (in 2026 it arrived
  about nine hours later and changed a paragraph). **Read the whole thread before
  building anything.**
- Nothing goes to the full list without a test copy reviewed by the maintainer
  and an explicit "send" — a broadcast can't be recalled.
- Attachments in Steve's email (photos, PDFs) are *not* automatically part of
  the send. Ask.

## Accounts and sender

| Thing | Value |
| --- | --- |
| Service | Resend (free plan: 1,000 contacts/month; marketing broadcasts don't count against the 100/day transactional cap) |
| Verified domain | `senoiacar.show` (also sends the signup confirmations) |
| From | `Senoia Car Show <noreply@senoiacar.show>` |
| Reply-to | The person the email says to reply to. Volunteer meeting invite: `carshow@enjoysenoia.com`. Thank-you ("send *me* your feedback"): Steve's own address |
| Footer | DDA name and PO Box, why they're receiving it, and `{{{RESEND_UNSUBSCRIBE_URL}}}` (required) |

Resend has an MCP connector that Claude Code can use to create, test and send
broadcasts, so the whole flow below can be run from a session.

## Segments

| Segment | Built from |
| --- | --- |
| **Volunteers 2026** | Active `signups` in production Firestore, deduped by email |
| **Car Owners 2026** | Ticket Tailor vehicle-registration orders (cancelled and test orders excluded) |
| **General** | Pre-existing; not used for show sends |

Name the new year's segments from scratch ("Volunteers 2027") rather than
reusing these — last year's list is people who may not want next year's mail.

### Segments go stale — refresh right before every send

This is the single most important rule here. The Volunteers segment was built
on 16 Sep with 81 contacts; by the 3 Oct thank-you, 12 more people had signed
up. A send that trusted the segment would have silently skipped them. **Rebuild
or diff the segment from the source of truth immediately before each broadcast.**

**Volunteers** (production Firestore REST; needs `gcloud` signed in to an
account with project access):

```bash
TOKEN=$(gcloud auth print-access-token --account <you>@gmail.com)
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  "https://firestore.googleapis.com/v1/projects/senoiacar/databases/(default)/documents:runQuery" \
  -d '{"structuredQuery":{"from":[{"collectionId":"signups"}],
       "where":{"fieldFilter":{"field":{"fieldPath":"status"},"op":"EQUAL",
       "value":{"stringValue":"active"}}}}}' > signups.json
```

Each result's `document.fields` has `firstName`, `lastName`, `email`. Then:

1. Lowercase and trim emails; **dedupe by email** (households share one — 121
   active signups were 93 unique addresses in 2026).
2. Diff against the segment (`list-contacts` with the segment id, 100 per page).
3. Add only the missing ones with `create-contact` + `segmentIds`. Do **not**
   re-import with overwrite: the volunteer's name on the signup can differ from
   what's already on the contact.
4. Spot-check for typo addresses (below) before adding.

Keep the exported JSON out of the repo — it is volunteer PII.

**Car owners:** Ticket Tailor → Orders → filter to the vehicle-registration
event → Actions → Export. Ticket Tailor identifies buyers by email, not by
anything friendlier, so dedupe by email there too. The CSV export is the supported route.

### Known data problems

- **Typo addresses.** Volunteers mistype their own email: in 2026 `gamil.com`
  and `belldouth.net` both appeared, each a duplicate of the same person's
  correct address already on file. Skip a typo when the correct address is
  already in the segment; otherwise add it and expect a bounce. A mistyped
  address also means that volunteer's signup confirmation likely never arrived —
  worth catching at the signup form.
- **Import "skip" gotcha.** Resend's contact import with `onConflict: skip`
  does *not* add already-existing contacts to the import's segment. Use
  `add-contact-to-segment` for them.
- **The headcount in the show chair's email is not the segment size.** The 2026
  thank-you cited **151 volunteers**; the website had **93 unique addresses**.
  The difference is crews who never signed up on the site (Poker Run, shuttle
  drivers, department leads) and people sharing addresses. Those people can't
  be reached from the segment. See [09-open-questions.md](09-open-questions.md).
- A volunteer who cancels after the segment was built stays in it. In 2026 one
  such person was still in Volunteers 2026 when the thank-you went out. That is
  harmless for a thank-you and wrong for an instructions email — re-check
  `status` against Firestore when it matters.

## Building a broadcast

House style is the volunteer meeting invite: table-based HTML, inline styles,
600px wide, brand colors (`#16130b` ink header band with a `#ad841f` gold top
border, `#f5eedb` cream background, white content card), Arial. Copy the most
recent broadcast (`get-broadcast`) as the starting point rather than designing
anew; it already passes the email-client rules (no flexbox, no CSS shorthand,
`bgcolor` alongside `background-color`, Outlook conditionals).

Always supply a plain-text body too.

### Images

Email clients need an **absolute URL to a public file**. Host the image on the
site itself:

1. Resize and compress first: ~1200px wide, JPEG, `-strip`, quality ~78
   (`magick in.jpg -auto-orient -resize 1200x -strip -interlace Plane -quality 78 out.jpg`).
   The 2026 thank-you photo came down from a 4000px original to 252 KB.
2. **JPEG, not WebP** — Outlook and some other clients don't render WebP, even
   though the site's own pages use it.
3. Commit it to `public/email/<name>-<year>.jpg` in a pull request. Static files
   under `public/` win over the SPA rewrite, so
   `https://senoiacar.show/email/<name>-<year>.jpg` serves the image.
4. **Wait for the deploy before testing.** Until the merge deploys, that URL
   answers with the app shell (HTML, 200), which looks like a working link but
   renders as a broken image. Confirm `content-type: image/jpeg`.
5. Write alt text that states only what is visible. Don't name a street or an
   event moment you can't see.

`public/email/` is for broadcast assets only; nothing links to it from the site.

### Resend tool gotchas

- `update-broadcast` with `html` **resets the broadcast name to "Untitled"** and
  replaces the plain-text body with an auto-generated one. Re-send `name`,
  `from`, `segmentId` and `replyTo` on every update and re-read the result.
- Setting HTML replaces content made in the Resend dashboard editor. Pick one
  authoring route and stay on it.
- `send-email` (the one-off used for tests) doesn't fill merge tags. Hand-fill
  `{{{FIRST_NAME|there}}}` and drop the unsubscribe link, labelling it as a test.

## The send procedure

1. **Read the request thread** end to end (see above). Confirm wording, sender,
   reply-to, and whether attachments are included.
2. **Refresh the segment** (above). Record before/after counts.
3. **Create the broadcast** (draft) addressed to that segment.
4. **Add images** if any: resize, PR, merge, wait for deploy, verify the URL.
5. **Send a `[TEST]` copy** to the maintainer with a one-off email. Review on a
   phone: header, image, paragraph breaks, reply-to.
6. **Get an explicit go-ahead**, then `send-broadcast`.
7. **Tell the show chair it went out** (he will start receiving replies if his
   address is the reply-to).
8. **Log it** in the table below, and pull delivery numbers a day later.

## Tracking: turn it on first

Open and click tracking are **off** on the domain in Resend, so opens and clicks
are unmeasured ([10-performance-2026.md](10-performance-2026.md)). Switch both on
in the domain settings *before* the first send of the year, and add UTM
parameters to any link in the body so GA4 can attribute the traffic. The 2026
thank-you has no links beyond the footer, so this only matters for sends that
link to the site.

## 2026 send log

| Date | Broadcast | Segment | Recipients | Reply-to | Notes |
| --- | --- | --- | --- | --- | --- |
| 16 Sep | Volunteer meeting invite (Tue 22 / Thu 24 Sep, 7 PM, SAHS museum) | Volunteers 2026 | 81 | `carshow@enjoysenoia.com` | 81 delivered, 0 bounced |
| 25 Sep | Car owners: Poker Run reminder | Car Owners 2026 | 319 | — | 318 delivered, 1 permanent bounce; sent ~9 AM ET |
| 3 Oct | Volunteer thank-you | Volunteers 2026 (refreshed 81 → 93) | 93 | Steve Maloy | Photo of show cars under the header; meeting-is-optional line and feedback request per Steve. Sent 9:06 PM ET. Snapshot a few hours after: 93 sent, 92 delivered, 0 bounced, 0 complaints, 0 unsubscribes, 3 delayed (transient). Opens/clicks unmeasured (tracking off) |

Car-owner and sponsor emails sent *by the show chair himself* from Gmail (for
example the sponsor follow-up of 2 Oct) are outside this system.

## Volunteer thank-you: template

Sent the first weekend after the show. Figures come from the show chair — never
compute or round them yourself.

> **Subject:** Thank you, *{year}* Car Show volunteers!
>
> *{year}* Car Show Volunteers,
>
> Thanks everyone for taking the time to serve as a volunteer for the Senoia Car
> Show. We had **{N} volunteers** *(new record!, if true)* serving in **{P}
> positions**. The car show was a huge success with **{R} registered cars**
> *(…)* and countless spectators. This event could not happen without your
> support. Thank you from me, the Car Show Team, the DDA and the city of Senoia.
>
> I will hold a meeting next week with the car show team… I don't want
> volunteers to feel like they have to come. Please send me your feedback,
> positive or negative, it goes a long way to helping improve the show year
> after year.
>
> Zoom Zoom…
>
> Steve

Two choices were deliberate and worth keeping: the **wrap-up meeting is for the
car show team, not volunteers** (he doesn't want anyone to feel obliged), and
feedback is invited **by reply** — which is why reply-to is the show chair, not
the shared `carshow@` inbox.

## Automating this next year

Everything above is deterministic except the wording and the go/no-go. A script
(or a scheduled Claude Code task) could:

- Pull active signups from Firestore and diff/refresh the segment (the one step
  that went wrong silently in 2026).
- Render the HTML from a template with `{year}`, counts, subject and image.
- Create the draft broadcast and send the `[TEST]` copy.
- **Stop there.** The send stays a human action.

Prefer a `scripts/` file that uses the Admin SDK (the repo already has
`scripts/seed-shifts.mjs` as a pattern) over the REST + `gcloud` recipe once it's
worth the setup. Keep the segment diff report-only by default, so an unexpected
number is seen before anyone is mailed.
