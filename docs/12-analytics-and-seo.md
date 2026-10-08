# 12 · Analytics & SEO reference

Where the traffic data lives, what every ID maps to, and how to get at it. This
exists so nobody (human or AI agent) has to rediscover the property IDs, the
container layout, or the browser quirks each time someone asks "how's traffic?".

**No secrets here.** Measurement IDs, container IDs and property IDs are public
identifiers (they ship in page source or are visible to anyone with access).
Access is controlled by the Google account that owns each tool — see
[07 · Accounts & access](07-accounts-and-access.md). Owner email addresses are
deliberately not recorded in this public repo.

*Collected 2026-10-08 from the live consoles. If a console disagrees with this
file, the console wins — fix the file in the same commit.*

## The map at a glance

```
senoiacar.show
  └─ GTM container  GTM-5P5465M9  (senoiacarshow, workspace 4)
       └─ Google tag "scs-website"  →  GA4 G-QG98T0QET3   (also GT-5M37XTNX)
            └─ GA4 property "senoiacar" ── data stream "scs-website"
Search Console: Domain property  sc-domain:senoiacar.show   (independent of GTM/GA4)
```

## Google Analytics 4

| Item | Value |
| --- | --- |
| Account ID | `403948353` |
| Property name / ID | `senoiacar` / `549032613` |
| Data stream | `scs-website` (web), stream ID `15394980719` |
| Measurement ID | `G-QG98T0QET3` (a zero in `T0`, not the letter O) |
| Stream URL field | **Blank** in the stream settings — harmless (collection is active), but fill it with `https://senoiacar.show` if you're in there anyway |
| Enhanced measurement | On (page views, scrolls, outbound clicks, +4 more) |
| Redact data | Email redaction active; URL query-parameter redaction keys **not** configured |
| Direct links | Home: `https://analytics.google.com/analytics/web/#/a403948353p549032613/reports/intelligenthome` · Stream: `…/#/a403948353p549032613/admin/streams/table/15394980719` |

Useful reports: **Reports → Acquisition → Traffic acquisition** (channels /
source-medium), **Reports → Engagement → Pages and screens**.

### What the data looks like (snapshot)

GA4 Home, "Last 7 days" ending 2026-10-07, versus the prior 7 days:

| Metric | Value | vs prior period |
| --- | --- | --- |
| Active users | 389 | −84.7% |
| Sessions | 552 | −85.5% |
| Events | 2.4K | −91.0% |
| Key events | 0 | — |

- Channels (sessions): Direct 239, Organic Search 143, Cross-network 70,
  Unassigned 63, Referral 53, Organic Social 26.
- Source / medium: `google / organic` 136, `(direct)` 239,
  `enjoysenoia.com / referral` 46, `facebook.com / referral` 18,
  `bing / organic` 2, `duckduckgo / organic` 3.
- Top pages by views: home (234), **2026 Award Winners (174)**, Show Info (12),
  Show Day Map (12), Poker Run (4), Vendors (3), FAQ (2).
- Geography: US 377 of 389 users.
- Anomaly GA flagged: Organic Search users spiked on 2026-09-17.

This is the post-show tail: the awards board and home page are what's still
being visited. Treat it as the baseline for "what we still see after the show".

## Search Console

| Item | Value |
| --- | --- |
| Property | **Domain property** `sc-domain:senoiacar.show` (covers http/https and every subdomain of `senoiacar.show`; the `.web.app`/`.firebaseapp.com` mirrors are separate domains and are not included) |
| Owner | Jeremy Warren (sole user; verified) |
| Sitemap | `https://senoiacar.show/sitemap.xml` — submitted 2026-08-25, last read 2026-10-02, status Success, 10 pages discovered |
| Direct link | `https://search.google.com/search-console?resource_id=sc-domain:senoiacar.show` |

Overview snapshot (2026-10-08): **1,488 total web-search clicks** since the
chart begins (2026-08-13). Clicks ramp from mid-September, peak around the show
(~480/day near 2026-09-26/27), then fall to a near-zero tail by early October.
GSC flagged the query `senoia car show 2026` (+253% impressions) and the home
page `/` (−94% clicks vs usual) — both just the show-week spike unwinding.

Indexing: **10 indexed, 16 not indexed** pages. Not yet investigated — open
**Indexing → Pages** to see the reasons. Some "not indexed" is expected (the
`.web.app`/`.firebaseapp.com` mirrors are kept out by canonical tags,
`noindex` routes like `/cancel` and `/admin`), but a human should look once.
Core Web Vitals: all URLs Good on mobile and desktop. HTTPS: all URLs HTTPS.
Enhancements → Events: 14 valid, 0 invalid.

## Google Tag Manager

All three containers live in one GTM account.

| Field | Value |
| --- | --- |
| Account | `jermDev` — account ID `6372380960` |
| Containers | `senoiacarshow` **`GTM-5P5465M9`** (this site) · `senoiahistory.com` `GTM-WZ44BMDR` · `senoiaporchfest` `GTM-5TLDPSQN` |
| This site's container ID (numeric) | `261761502`, default workspace `4` |
| Console link | `https://tagmanager.google.com/#/container/accounts/6372380960/containers/261761502/workspaces/4` |
| Google tag | `scs-website` → destinations `G-QG98T0QET3` and `GT-5M37XTNX`; feeds the one GA4 destination, stream `scs-website` |

Tags in `GTM-5P5465M9` (all live; no pending workspace changes as of 2026-10-08):

| Tag | Type | Trigger |
| --- | --- | --- |
| GA4 Configuration - senoiacar.show | Google Tag | Initialization – All Pages |
| GA4 Event - page_view (SPA) | GA4 Event | Custom Event `page_view` (pushed by `usePageMeta` on every route change) |
| GA4 Event - ticket_click | GA4 Event | Custom Event `ticket_click` |
| GA4 Event - volunteer_signup | GA4 Event | Custom Event `volunteer_signup` |

The `ticket_click` and `volunteer_signup` tags were last edited ~2026-09-30.
Code side: `src/lib/gtm.js` (container ID), `src/lib/conversions.js` (event
pushes); event semantics are in [02 · Website runbook](02-website-runbook.md#analytics).
The other two containers belong to sister sites (`senoiaporchfest` is
`~/git/senoia-porchfest`) and use the same two-tag SPA pattern; their GA4
properties were **not** looked up here.

> **Open item.** The GA4 Home card shows **Key events: 0**. The runbook says
> `ticket_click` and `volunteer_signup` must be marked as key events in GA4
> Admin → Events or conversions never show. Either they aren't marked or no one
> has clicked a ticket link since the show ended — check Admin → Events before
> next year's push.

## Getting the numbers (for humans and agents)

- **No API access is wired up.** `gcloud` auth tokens don't carry the Analytics
  scope by default, and no GA4/Search Console connector is configured in Claude.
  Until that changes, the working routes are the console UIs (below) or a CSV
  export dropped into the repo.
- **Agents: use the user's own Chrome** (Claude in Chrome), which is already
  signed in. The built-in browser pane has no Google session.
- **GA4 deep links:** the property Home URL and the data-stream URL above load
  directly. Other `admin/...` deep links (`admin/property/details`,
  `admin/account/details`) bounce back to Home — click through the Admin UI
  instead. `get_page_text` on Home returns every card's numbers, which is the
  fastest read.
- **Search Console deep links** work with the `resource_id` query param:
  `/search-console/sitemaps`, `/users`, `/performance/search-analytics`.
- **GTM:** the console link above lands on the workspace; `…/versions` links
  bounce to the container list, so use the Versions tab.
- Don't take "0 requests" or a `503` on `google-analytics.com/g/collect` seen
  through an automated browser as a broken setup — ad blockers fake it. Verify
  with GTM Preview / GA4 DebugView.
- A blank `Stream URL` and a `GT-` destination listed next to the `G-` ID are
  both normal.

## Refresh checklist (each rollover / SEO review)

1. Search Console → Performance: export Queries and Pages for the window.
2. GA4 → Traffic acquisition and Pages and screens for the same window.
3. Search Console → Indexing → Pages: record the "not indexed" reasons.
4. Confirm the sitemap's *Last read* date is recent and the page count matches
   `public/sitemap.xml` (new routes need a line there — see `CLAUDE.md`).
5. GA4 Admin → Events: `ticket_click` and `volunteer_signup` are key events.
6. Update the snapshot numbers above with the date.
