# 2026 Website Performance Report (show week baseline)

Source: Google Analytics 4, property `senoiacar` (549032613), pulled 2026-09-30.
Window: Sat Sep 19 – Tue Sep 29, 2026 (show = Sat Sep 26). Sep 29 is a partial day.
GA4 tracking began 2026-08-20, so **2026 is the first year with data — this is the
baseline** future years compare against. Times are the property's timezone.

Metric definitions (use the same ones next year): **Views** = `page_view` events;
**Active users** = GA4 active users for that day (daily figures do not sum to the
range total); **Sessions** = GA4 sessions; **Engagement** = avg engagement time per
active user.

## Headline numbers (Sep 19–29)

| Metric | Value |
|---|---|
| Page views | 21,185 |
| Active users (unique, whole window) | 3,275 |
| Sessions | 5,008 |
| Engaged sessions / engagement rate | 2,891 / 57.7% |
| Avg engagement time per active user | 1m 22s |
| Views per active user | 6.47 |
| Events | 34,523 |
| Key events (conversions) | 0 — none configured |

## Day by day

| Date | | Views | Active users | Sessions |
|---|---|---|---|---|
| Sat 9/19 | | 271 | 76 | 106 |
| Sun 9/20 | | 511 | 96 | 139 |
| Mon 9/21 | | 1,399 | 235 | 302 |
| Tue 9/22 | volunteer meeting | 1,824 | 288 | 355 |
| Wed 9/23 | | 1,456 | 242 | 318 |
| Thu 9/24 | volunteer meeting | 1,686 | 288 | 405 |
| Fri 9/25 | poker run, reg. closes 6pm | 5,136 | 794 | 1,016 |
| **Sat 9/26** | **SHOW DAY** | **6,825** | **971** | **1,411** |
| Sun 9/27 | | 1,379 | 539 | 663 |
| Mon 9/28 | | 448 | 98 | 170 |
| Tue 9/29 | partial | 250 | 52 | ~122 |

Show-day ratio: 4.3x the 9/21–9/24 average (~1,590 views/day), and 25x
the Sep 19 low. Show day + poker run Friday = 56% of all views in the window.
Baseline week Sep 12–18: 1,999 views, 432 active users, 576 sessions — show day
alone did 3.4x that week's views.

## Show day (Sep 26) by page

| Page | Views | Active users | Avg engagement |
|---|---|---|---|
| `/` | 1,903 | 791 | 19s |
| `/map` | 1,852 | 273 | 1m 27s |
| `/show` | 952 | 265 | 34s |
| `/awards` | 915 | 153 | 2m 04s |
| `/faq` | 411 | 104 | 45s |
| `/vendors` | 363 | 108 | 36s |
| `/merch` | 171 | 47 | 28s |
| `/sponsors` | 115 | 31 | 27s |
| `/poker-run` | 83 | 51 | 36s |
| `/volunteer` | 31 | 13 | 42s |

Show-day sessions by channel (1,411): Organic Search 849 (60%), Organic Social 236
(17%), Direct 229 (16%), Referral 93 (7%, longest sessions at 2m 05s).

## Whole window by page

| Page | Views | Active users | Avg engagement |
|---|---|---|---|
| `/` | 5,490 | 2,261 | 23s |
| `/map` | 5,292 | 720 | 1m 43s |
| `/show` | 3,276 | 839 | 47s |
| `/awards` | 2,043 | 707 | 48s |
| `/faq` | 1,528 | 321 | 59s |
| `/vendors` | 997 | 279 | 39s |
| `/poker-run` | 770 | 366 | 34s |
| `/merch` | 627 | 184 | 30s |
| `/sponsors` | 596 | 145 | 55s |
| `/volunteer` | 424 | 116 | 51s |

`/map` is the standout: 7.35 views per user and the longest engagement of any
public page — it is the show-day tool people actually use.

## Traffic sources (Sep 19–29 sessions)

| Channel | Sessions | Share | Engagement rate |
|---|---|---|---|
| Organic Search | 2,384 | 47.6% | 58.6% |
| Organic Social | 1,244 | 24.8% | 62.1% |
| Direct | 910 | 18.2% | 47.0% |
| Referral | 386 | 7.7% | 63.2% |
| Unassigned / Cross-network / AI assistant | 52 | 1.0% | — |

## Audience

- **Country:** overwhelmingly US (2.7K of ~2.7K active users in the last-7-day view;
  a handful from UK, Germany, Singapore, Taiwan — likely bots/crawlers).
- **Browser (active users):** Safari 1,965 (60%), Chrome 1,041 (32%), Edge 135,
  Safari in-app 42, Firefox 38. Mobile Safari dominance matches on-site attendees
  using the map from phones — keep the map and FAQ mobile-first.

## Takeaways

1. **Demand is a two-day spike.** Traffic sat at ~100–300 users/day until the
   9/21 ramp, then hit 794 (Fri) and 971 (Sat). Anything needed on show day
   should be live by Thursday.
2. **Organic Search led**, even on show day (60%) — the SEO plumbing (per-route
   titles, JSON-LD, sitemap) is paying off; people are Googling the show.
3. **`/awards` worked as a live board** — 915 show-day views at 2m 04s engagement,
   the highest of any page that day, and still 2,043 total. It also drove a Sunday
   tail (1,379 views on 9/27).

## Gaps — not captured in this report

- **No conversions.** GA4 shows 0 key events: the Register (Ticket Tailor) and
  Volunteer-signup clicks are not tracked as events. Add outbound-click and
  signup-success events before next year, or year-over-year funnel comparison is
  impossible. (`file_download` fired 202 times in the last 7 days — likely the
  map/PDF downloads — worth confirming.)
- **Ad-blocker / privacy undercount.** GA4 misses blocked users; treat the numbers
  as a floor, and compare only to future GA4 numbers.
- **Hourly show-day curve** (peak hour for the map) — not pulled; grab it from
  GA4 Realtime/Explore next year *during* the show.
- **Sign-up volume, email performance, ticket sales** — volunteer sign-ups
  (Firestore `signups`), Resend broadcast open/click rates, and Ticket Tailor
  registration counts are separate systems and were not pulled here.
- **Server-side metrics** (Firebase Hosting bandwidth, Cloud Functions errors,
  App Check rejections) — not pulled.
- **No prior-year comparison exists** for the site (new in 2026; the legacy
  enjoysenoia.com page had no shared analytics).

## Reproducing this next year

GA4 report URLs accept a custom range: `.../reports/explorer?r=all-pages-and-screens&params=_u.date00%3DYYYYMMDD%26_u.date01%3DYYYYMMDD`
(also `r=lifecycle-traffic-acquisition-v2`, `r=user-technology-detail`). Pull the
same window relative to show day (show day −7 through +3), the baseline week
(−14 through −8), and the daily table above.
