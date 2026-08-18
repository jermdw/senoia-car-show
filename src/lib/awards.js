// Shape and ordering for the show-day awards board. Both the public board
// (`/awards`) and the organizer entry form (`/admin`) read the same documents,
// so the sort and the search live here rather than being re-derived on each
// side — a winner the organizer sees at position 7 has to be at position 7 on
// every spectator's phone too.
//
// An award document (`events/{eventId}/awards/{id}`):
//   tier        'featured' | 'top50'
//   title       featured only — the trophy's name, e.g. 'Best in Show Car'
//   carNumber   the entrant's assigned number, as a string ('07', 'B12');
//               leading zeros are meaningful on the printed judging sheet
//   vehicle     '1957 Chevrolet Bel Air'
//   owner       display name as announced from the stage ('John D.')
//   awardClass  optional class the car placed in ('Muscle Car')
//   photoUrl    optional; featured cards show it, everything else shows a medallion
//   announced   false while staged, true once read out from the stage
//   sortOrder   announcement order, used for the featured trophies

export const FEATURED = 'featured'
export const TOP50 = 'top50'

// The two trophies the ceremony always closes with. Organizers can type any
// title they like — these are only offered as suggestions so the spelling
// stays consistent with the printed program.
export const FEATURED_TITLES = ['Best in Show Car', 'Best in Show Truck']

// Entrant numbers are stored as strings (leading zeros matter), but "10" must
// still sort after "9". Anything that isn't a plain number — a lettered class
// number like "B12" — sorts after the plain ones, alphabetically.
export function compareCarNumber(a, b) {
  const na = plainNumber(a.carNumber)
  const nb = plainNumber(b.carNumber)
  if (na !== null && nb !== null) return na - nb
  if (na !== null) return -1
  if (nb !== null) return 1
  return String(a.carNumber ?? '').localeCompare(String(b.carNumber ?? ''))
}

function plainNumber(value) {
  const text = String(value ?? '').trim()
  return /^\d+$/.test(text) ? Number(text) : null
}

export const sortFeatured = (list) =>
  [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

export const sortTop50 = (list) => [...list].sort(compareCarNumber)

// One box that searches everything printed on the row, because a spectator at
// the stage knows the car ("blue F-100"), its number, or the owner's name —
// never which of the three the site indexes on.
export function matchesAwardSearch(award, term) {
  const q = term.trim().toLowerCase()
  if (!q) return true
  return [award.carNumber, award.vehicle, award.owner, award.awardClass, award.title]
    .map((v) => String(v ?? '').toLowerCase())
    .join(' ')
    .includes(q)
}
