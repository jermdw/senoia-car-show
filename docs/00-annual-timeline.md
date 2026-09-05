# 00 · The annual timeline

Two calendars run in parallel: the **public deadlines** the organizers publish,
and the **digital work** that has to land before each one. The public dates are
recorded facts from the 2026 cycle (`DATES` in `src/pages/Show.jsx`). The
digital column is what actually happened in 2026, written as guidance — treat it
as a recommendation, not a rule the organizers set.

Anchor everything to show day: **the fourth Saturday in September** has been the
pattern (Sat 27 Sep 2025 → Sat 26 Sep 2026). Confirm the date with the DDA before
you build a year around it; the show moved by a day between those two years.

## The year at a glance

| When | Public deadline | Digital work that must be done first |
| --- | --- | --- |
| **Oct (show + 2 weeks)** | — | **Roll the site to next year.** See [01-year-rollover.md](01-year-rollover.md). This is urgent, not housekeeping: until it happens the site is frozen in show-day mode with the Volunteer and Poker Run links hidden. |
| **Oct–Nov** | Debrief | Capture what broke into [09-open-questions.md](09-open-questions.md) and the troubleshooting doc while it's fresh |
| **Nov–Jan** | Quiet | Renew the domain; check Firebase/Mapbox/Resend billing and free-tier headroom ([07](07-accounts-and-access.md)) |
| **Feb–Apr** | Sponsor prospecting | Build next year's Ticket Tailor sponsorship event; clear last year's sponsor logos off `/sponsors` |
| **May 1** | **Sponsor & vendor applications open** | `/sponsors` live with the new tier table and a working checkout link; `/vendors` reopened |
| **Jun 1, 8:00 AM** | **Show car registration opens** | `REGISTRATION_URL` and `REGISTRATION_PRICE` point at the new Ticket Tailor event; `/show` pricing table agrees with it to the dollar |
| **Jun–Jul** | Sponsors land | Add sponsor logos as they pay — one small PR each, which is how 2026 ran it |
| **Aug 1** | **Volunteer sign-ups open** | Shifts seeded into Firestore, `signupOpen: true`, `/volunteer` tested end to end with a real browser |
| **~Aug 17** | **Sponsorship plaque cut-off** | The dated notice on `/sponsors` says this; move the date |
| **Aug–Sep** | Vendor roster firms up | Food vendor logos onto `/vendors`; poster and flyer published |
| **~4 weeks out** | Site plan finalised | Regenerate the venue map, update `src/data/eventMap.js` POIs and schedule |
| **~2 weeks out** | — | Publish `/faq` updates; the FAQ is what organizers paste into email replies |
| **~1 week out** | Shirt order placed | Pull the shirt-size tally off `/admin` ([03](03-volunteer-system.md)) |
| **Sept, Tue & Thu before** | **Volunteer training meetings, 7:00 PM, SAHS Museum** | Shirt pickup happens here — the confirmation email says so, so the dates in `functions/index.js` must be right |
| **Friday before** | **Cruisin' for History Poker Run** | `/poker-run` stops verified against Google Maps; SAHS ticket embed loading |
| **Show day** | **10 AM – 4 PM** | Award board and announcement banner staffed ([04](04-show-day.md)) |

## Show-day hours, for reference

| Time | What |
| --- | --- |
| 6:00 AM | Sponsor, vendor and non-profit setup gates open |
| 7:00 AM | Show car gates open (paid credentials); same-day registration opens |
| 9:00 AM | All Main Street show vehicles parked; shuttles begin |
| 10:00 AM | Show opens, judging begins |
| 10:30 AM | Silent auction & door prizes begin |
| 11:00 AM | Same-day registration closes (check in by 10:00 to be award-eligible) |
| 2:00 PM | Silent auction closes (winners 2:30) |
| 3:00 PM | Award ceremony — 50/50 raffle, last year's Best in Show, Top 50, Best in Show Car & Truck |
| 4:00 PM | Show ends; no show vehicle exits before this |
| 5:00 PM | Shuttles stop |
| 6:00 PM | Streets reopen |

Source: `SCHEDULE` in `src/data/eventMap.js` and the FAQ. Two 2026 entries stayed
unpublished all year because the operations playbook contradicted itself — the
"Crank Your Engines" time (12:00 vs 12:15) and the Falcon RV Squadron fly-over
(11:45 vs 13:00). They are still sitting in the file with `confirmed: false`.
Resolving those two is a five-minute job for someone with the DDA's ear, and it
has been outstanding for a year.

## What the DDA runs alongside this

Senoia PorchFest, early September (Sun 6 Sept in 2026, <https://senoiaporchfest.org>).
It shares the DDA's calendar, volunteer pool and print vendors, so the two
events compete for the same weeks in August. Worth knowing when you plan
production deadlines.
