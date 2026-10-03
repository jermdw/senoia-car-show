// Show photos. Everything on /gallery comes from this file — page content is
// hardcoded in components elsewhere on this site, and the gallery follows suit.
//
// Credit: the 2026 photos are by Wayne Dombroski of Stars Mill Photography, who
// has said the show may use them as needed (via Steve Maloy, 2026-10-02; the
// organizers confirmed this covers the website, not just social media). In return
// Wayne and his business are credited wherever his work appears — the page renders
// the credit line from PHOTOGRAPHER, so keep it there.
export const PHOTOGRAPHER = {
  name: 'Wayne Dombroski',
  business: 'Stars Mill Photography',
  url: 'https://www.starsmillphoto.com',
}

// Full galleries that live on the photographer's own site. These are links out
// rather than copies, so they cost nothing to host and need no permission beyond
// the link. Newest first; add a row per year. Photo counts are as of 2026-10-03.
export const ALBUMS = [
  {
    year: 2026,
    title: '2026 Senoia Car Show',
    blurb: 'Two galleries from show day: Cars (126 photos) and the Top 50 (52 photos).',
    url: 'https://www.starsmillphoto.com/senoia-car-show-2026',
  },
  {
    year: 2025,
    title: '2025 Senoia Car Show',
    blurb: 'Last year’s show, from the same photographer.',
    url: 'https://www.starsmillphoto.com/2025-car-show-1',
  },
]

// Photos hosted on this site, shown as a grid with a lightbox. Empty until the
// organizers pick a set. To add one:
//   1. Export it as a web-sized JPEG or WebP (about 1600px on the long side) into
//      public/gallery/<year>/ — public/ is served as-is, so the file is reachable
//      at /gallery/<year>/<name>.
//   2. Add an entry below. `width` and `height` are the file's real pixel size
//      (they reserve space so the grid doesn't jump as images load); `alt`
//      describes the photo for people who can't see it.
//
// { src: '/gallery/2026/best-in-show.webp', width: 1600, height: 1067,
//   alt: 'Best in Show truck on Main Street', album: 'Awards', year: 2026 },
//
// `album` is a free-text label used to group photos on the page (Cars, Awards,
// Poker Run, Volunteers, ...). Only albums with at least one photo are shown.
export const PHOTOS = []
