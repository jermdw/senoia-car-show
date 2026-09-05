# 05 · Assets & artwork

How every image on the site was made, so none of it has to be reverse-engineered
next year.

## The house rules

1. **WebP for everything on the site.** The only exceptions are the social
   share card (PNG — several scrapers still don't accept WebP) and the
   favicons/apple-touch-icon.
2. **Ship the size you display.** Every `<img>` carries explicit `width` and
   `height` so the page doesn't reflow as images land.
3. **Put the year in the filename** and add a new file rather than overwriting.
   `/assets/**` is served `max-age=31536000, immutable`, and files in `public/`
   are not content-hashed by Vite — a same-named replacement can be served
   stale from a visitor's browser for months.
4. **Keep print-resolution sources out of `public/`.** Vite copies `public/`
   wholesale into `dist/`, so a 2 MB print master ships on every deploy for no
   reason. Print masters live in `design/`.
5. **Never guess a logo.** A wrong logo on a page thanking a paying sponsor is
   worse than a plain text cell. See the sourcing rules below.

## Current inventory

| File | Size | What it is |
| --- | --- | --- |
| `src/assets/logo-header.webp` | 175×180 | Small mark for the `SiteHeader` bar. **Loads on every page** — keep it sized for its slot. |
| `src/assets/logo-hero.webp` | 800×820 | Large mark for the Landing hero |
| `src/assets/logo-light-bg.webp` | 400×410 | Variant for white/cream backgrounds (the admin sign-in card) |
| `public/share-card-2026.png` | 1200×630 | Open Graph / Twitter card |
| `public/poster-2026.webp` | — | Event poster, clickable on `/show` |
| `public/flyer-2026.pdf` | 101 kB | The printable flyer people share with car clubs |
| `public/venue-base-2026-web.webp` | 1126×1280 | Show day map base image |
| `design/venue-base-2026-print.png` | 2252×2560 | @2x master for printed "You Are Here" boards |
| `public/favicon.png` / `favicon-48.png` / `apple-touch-icon.png` | 125×128 / 48×48 / 180×180 | Browser and iOS icons |
| `src/assets/shirt-front-art.webp` | 300×385 | Volunteer shirt print art |
| `src/assets/shirt-a250-art.webp` | 720×678 | America 250 back print |
| `src/assets/shirt-kids-art.webp` | 600×600 | Kids' racer print |
| `src/assets/shirt-21st-mockup.webp` | 720×383 | Photographed/rendered mockup of the annual shirt |
| `src/assets/sponsor-*.webp` | 400 px wide | 29 sponsor logos |
| `src/assets/vendor-*.webp` | 400 px wide | 8 food vendor logos |

---

## The venue map — the one recipe you must not lose

`/map` is **not** a hand-drawn illustration and **not** a screenshot with pins
dragged onto it. It is a Mapbox Static Images export taken at an exact bounding
box, with every pin positioned from real latitude/longitude by
`src/lib/venueGeo.js`. That is why re-exporting the image doesn't break the
pins, and why nothing needs recalibrating.

### Regenerating the base image

```bash
STYLE=jermdwsahs/cmsnd0mkk017601qo0nsz6fpp
curl -g -o /tmp/base.png \
  "https://api.mapbox.com/styles/v1/$STYLE/static/[-84.5572,33.29855,-84.5512,33.30425]/1126x1280?access_token=$MB_TOKEN"
cwebp -q 88 /tmp/base.png -o public/venue-base-2026-web.webp   # ~600 kB -> 40 kB
```

The @2x print master is the same call at `2252x2560`, saved as PNG into
`design/`.

**If you change the bounding box, change `BBOX` in `src/lib/venueGeo.js` in the
same commit.** The two are one unit; every pin moves automatically and correctly.

```js
export const BBOX = { west: -84.5572, south: 33.29855, east: -84.5512, north: 33.30425 }
```

### Four decisions baked into that command

- **The frame is cropped tight to the walkable venue (~558 × 634 m).** A wider
  frame squeezed 21 pins into the middle third of the image, where they
  overlapped into a blob on a phone. Cropping spreads them across the full width.
- **Remote parking is deliberately outside the frame.** Including it means
  zooming out until the venue itself is illegible. Those entries carry a
  `directions` field instead, which the list turns into a driving-directions
  link.
- **The style is a classic Light with the `poi-label` layer deleted.** Mapbox's
  stock styles label every business and landmark — "Papp Clinic", "Peavy
  Gravesite" — which competes with our own pins and puts arbitrary businesses on
  an event map. Dropping that one layer leaves street names only, so everything
  named on the map is ours.
- **Classic, not Standard.** The Static Images API cannot render Standard styles.

### Attribution is a licence condition

Mapbox's terms require the text **`© Mapbox, © OpenStreetMap`** wherever this
image appears — on screen *and in print*. It's exported as `ATTRIBUTION` from
`venueGeo.js` and displayed on `/map`. Put it on the printed boards too.

### Placing a new pin

Add a POI to `POIS` in `src/data/eventMap.js` with real `lat`/`lon`. Sources
used in 2026, recorded per entry in the comments: OpenStreetMap node
coordinates, or a computed intersection of two named streets. `isWithinMap()`
tells you whether it will render inside the frame. `lat: null` means not yet
located, and the pin simply doesn't render.

Web Mercator is used for the vertical axis — longitude is linear across the
frame but latitude is not, and using raw latitude skews pins by a few metres,
which at this scale is enough to put a pin on the wrong side of a street.

### The `confirmed` flag

Every POI, schedule entry and FAQ answer carries `confirmed: true | false`.
**`false` means the operations playbook is silent or self-contradictory on this
item.** Those entries stay in the file as a working checklist and are never
rendered — `publishedPois()`, `publishedSchedule()` and `publishedFaq()` filter
them out. Resolve with the organizers, flip the flag, and they appear. This is
the mechanism that keeps guessed facts off the site; use it rather than deleting
an uncertain entry.

---

## Sponsor and vendor logos

The rule that produced 29 correct logos and zero embarrassments:

**Verify the business, not the name.** Several sponsors share a name with an
unrelated company. Recorded in the 2026 comments, each next to its row:

- *Circle M Barbeque* (Byrom Rd, Senoia) — `circlembbq.com` is an **unrelated**
  whole-hog restaurant in Liberty, SC, and must never become that row's `url`.
- *GMP Performance – South Atlanta* — confirmed by street address, not initials.
- *Patriot Performance Engines* — the Williamson GA engine shop, confirmed by
  matching the supplied artwork to their site's own header logo.
- *Pool FX* — the Peachtree City pool builder, not a national firm of the same name.

Leave a one-line comment recording *how* you confirmed each one. That comment is
what makes next year's check a ten-second read instead of a re-investigation.

**Process:**

1. Ask the sponsor for artwork. Their own file always beats a scrape.
2. Otherwise take the light-background variant from their own site's header.
3. Normalise to **400 px wide**, WebP, transparent background where the source
   has one. Record the real `w`/`h` in the data array — the grid uses them.
4. Cells are white, so a white-knockout wordmark won't read. HotRod Brothers
   Customs only publish a white-on-black mark; the ink was recoloured to black
   with the typography otherwise untouched. That is the acceptable edit — do not
   redraw or re-typeset someone's mark.
5. **No artwork you can verify? Ship a plain text cell.** `SS Chassis Works`,
   `Circle M Barbeque` and `Fosters Sandwiches` all render as text. That is the
   correct outcome, not a gap.
6. Food trucks routinely have a logo but no website (or a Facebook page only),
   so on `/vendors` `logo` and `url` are independent — a logo can render
   unlinked. The sponsor grid pairs them.

---

## Shirt artwork

`src/components/ShirtMockup.jsx` draws the tee itself as **inline SVG** and drops
the real print art into it as an `<image>`. That means one component renders
every shirt at any size without a blurry photo, and a new colourway is two hex
values:

```jsx
<ShirtMockup shirt="#045EB4" shade="#034E96" art={kidsArt} artBox={SQUARE_ART} />
```

`artBox` is the viewbox rectangle the art sits in. The default suits tall front
art; square back prints need the wider box `{ x: 116, y: 112, width: 168, height: 172 }`
defined in `Merch.jsx`. The volunteer shirt is the coral default.

Supply the print art as a **transparent-background WebP** at roughly the size it
prints. Get it from the printer's separation file, not from a photo of a shirt.

The 21st Annual shirt is the exception — it uses a flat mockup image
(`shirt-21st-mockup.webp`, front and back on a blue tee) rather than the SVG,
because the design wraps both faces.

Shirt sizes are `S, M, L, XL, 2XL, 3XL, 4XL`, declared in `src/shirtSizes.js`
and mirrored in `functions/index.js` — **keep the two lists in step**, because
the function rejects a size the form could otherwise offer.

## Icons and line art

`src/components/AwardArt.jsx` and `CategoryIcon.jsx` are hand-written SVG
strokes in `currentColor`, so they inherit whatever gold or ink they sit on.
Kept as strokes rather than photographs deliberately: on show day organizers are
typing winners into a phone at the stage, and there is no moment in that
workflow to shoot, crop and upload a car.

Map category colour is layered **on top of an already-distinct icon shape**,
never instead of it — the map is readable without colour vision.

## Poster, flyer and share card

| | Spec | Notes |
| --- | --- | --- |
| Poster | WebP, lossless | Displayed at 160 px on `/show`, links to the flyer |
| Flyer | PDF, ~100 kB | The thing people actually print and hand out at car clubs |
| Share card | **PNG, exactly 1200×630** | Referenced absolutely in `index.html` as `https://senoiacar.show/share-card-2026.png`, with matching `og:image:width/height` and a real `og:image:alt` |

After replacing the share card, run the URL through Facebook's sharing debugger
and X's card validator to force a re-scrape — both cache aggressively, and a
stale card is the single most visible artwork bug the site can have.

---

## ⬜ Print & physical signage — needs filling in

**This is the biggest gap in the playbook.** Everything above is reconstructable
from the repo. The physical production is not, because none of it lives here.

Whoever produced these in 2026: please fill in the sections below and open a PR.
Even three lines each is worth more than nothing in twelve months.

### Porch signs / yard signs

- [ ] What are they, exactly — dimensions, substrate (coroplast? aluminium?),
      single or double sided, H-stake or frame?
- [ ] Who designed the artwork, in what application, and **where is the source
      file**? (If it's an Illustrator/Canva/Express document, put the link or the
      exported source in `design/` and reference it here.)
- [ ] Which printer, what did they cost, and what lead time did they need?
- [ ] What file format and bleed did the printer ask for?
- [ ] How many were made, where were they placed, and who collects them afterwards?
- [ ] Are they year-dated, or reusable? (If reusable, that changes the whole
      timeline.)

### Everything else printed

Same six questions for each of: the **"You Are Here" boards** (the one thing
here the repo *does* feed — `design/venue-base-2026-print.png`, and remember the
Mapbox attribution), banners, sponsor plaques (**note the mid-August order
cut-off already published on `/sponsors`**), the printed flyer's print run,
gate and directional signage, trophies, and the printed judging sheets.

### The standing questions for all of it

- [ ] Which vendors did we use, and would we use them again?
- [ ] What is the real lead time, counted backwards from show day?
- [ ] Where do the source files live, and who has access?
- [ ] Do we own the artwork, or does the designer?
- [ ] What is stored between years, and where physically?

A good format is one short markdown file per item under `docs/print/`, with the
source file dropped into `design/` alongside it.
