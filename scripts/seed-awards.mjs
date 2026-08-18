// Bulk-load events/2026/awards — the judges' sheet before the ceremony, or a
// demo set for showing organizers what the board will look like.
// Usage:
//   node scripts/seed-awards.mjs --demo                  # sample winners → emulator
//   node scripts/seed-awards.mjs --demo --prod           # sample winners → production
//   node scripts/seed-awards.mjs winners.csv             # judges' sheet → emulator, staged
//   node scripts/seed-awards.mjs winners.csv --prod      # judges' sheet → production, staged
//   node scripts/seed-awards.mjs --clear-demo --prod     # remove only the demo rows
//
// Re-running an import is safe mid-ceremony: `announced` is written only when
// a document is created, so fixing a typo in the sheet and re-importing never
// pulls an already-called winner back off the board. To reset the demo to its
// original mix of live and staged rows, --clear-demo first.
//
// CSV columns (header row required, order free):
//   tier,title,carNumber,vehicle,owner,class
// `tier` is top50 (default) or featured; `title` is the trophy name and only
// applies to featured rows. Imported rows arrive STAGED — publish them from
// the Awards tab of /admin when the announcer reaches them.
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const args = process.argv.slice(2)
const prod = args.includes('--prod')
const demo = args.includes('--demo')
const clearDemo = args.includes('--clear-demo')
const csvPath = args.find((a) => !a.startsWith('--'))

if (!demo && !clearDemo && !csvPath) {
  console.error('Usage: node scripts/seed-awards.mjs (<csv> | --demo | --clear-demo) [--prod]')
  process.exit(1)
}
if (!prod && !process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
}

const EVENT_ID = '2026'
// Demo rows carry this prefix so --clear-demo can take them back out without
// touching a real winner an organizer typed in alongside them.
const DEMO_PREFIX = 'demo-'

// Placeholder cars, with owners named after cartoon characters — the demo set
// goes on a public URL while organizers preview the board, so no row may be
// mistakable for a real entrant. Names still use the announcer's form (first
// name, last initial) so the layout matches a real ceremony.
const DEMO_FEATURED = [
  ['Best in Show Car', '112', '1957 Chevrolet Bel Air', 'John D.', 'Tri-Five'],
  ['Best in Show Truck', '087', '1968 Ford F-100', 'Mike S.', 'Classic Truck'],
]
const DEMO_TOP50 = [
  ['01', '1969 Ford Mustang Fastback', 'Jane D.', 'Muscle Car'],
  ['02', '1932 Ford Roadster', 'Tom R.', 'Hot Rod'],
  ['03', '1963 Chevrolet Corvette Split Window', 'Sarah L.', 'Classic Sports'],
  ['04', '1970 Dodge Challenger R/T', 'Bob H.', 'Muscle Car'],
  ['05', '1955 Chevrolet 210', 'Chris M.', 'Tri-Five'],
  ['06', '1966 Pontiac GTO', 'Dana W.', 'Muscle Car'],
  ['07', '1948 Ford F-1', 'Ray P.', 'Classic Truck'],
  ['08', '1972 Datsun 240Z', 'Ana G.', 'Import'],
  ['09', '1957 Ford Thunderbird', 'Lou K.', 'Classic Sports'],
  ['10', '1965 Shelby Cobra', 'Pat V.', 'Classic Sports'],
  ['11', '1979 Jeep CJ-7', 'Sam T.', '4x4'],
  ['12', '1953 Buick Skylark', 'Nora F.', 'Post-War Classic'],
  ['13', '1970 Plymouth Road Runner', 'Road R.', 'Muscle Car'],
  ['14', '1949 Mercury Eight', 'Bugs B.', 'Post-War Classic'],
  ['15', '1963 Volkswagen Beetle', 'Daffy D.', 'Import'],
  ['16', '1957 Chevrolet Nomad', 'Porky P.', 'Tri-Five'],
  ['17', '1936 Ford Coupe', 'Elmer F.', 'Hot Rod'],
  ['18', '1967 Shelby GT500', 'Speedy G.', 'Muscle Car'],
  ['19', '1952 Willys Jeep', 'Yosemite S.', '4x4'],
  ['20', '1961 Jaguar E-Type', 'Pepé L.', 'Classic Sports'],
  ['21', '1958 Chevrolet Apache', 'Foghorn L.', 'Classic Truck'],
  ['22', '1959 Cadillac Coupe DeVille', 'Tweety B.', 'Post-War Classic'],
  ['23', '1969 Dodge Charger', 'Sylvester C.', 'Muscle Car'],
  ['24', '1932 Ford Tudor', 'Marvin M.', 'Hot Rod'],
  ['25', '1968 Volvo P1800', 'Taz D.', 'Import'],
  ['26', '1956 Chevrolet 3100', 'Granny G.', 'Classic Truck'],
  ['27', '1964 Buick Riviera', 'Lola B.', 'Post-War Classic'],
  ['28', '1955 Chevrolet Bel Air', 'Wile E. C.', 'Tri-Five'],
  ['29', '1948 Chevrolet Fleetmaster', 'Michigan F.', 'Post-War Classic'],
  ['30', '1972 Chevrolet K5 Blazer', 'Ralph W.', '4x4'],
  ['31', '1957 Ford Fairlane 500', 'Sam S.', 'Post-War Classic'],
  ['32', '1934 Ford Roadster', 'Beaky B.', 'Hot Rod'],
]

function parseCsv(text) {
  const rows = []
  let row = [], field = '', inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') inQuotes = false
      else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') {
      if (field || row.length) { row.push(field); rows.push(row); row = []; field = '' }
    } else field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows
}

function fromCsv(path) {
  const [header, ...rows] = parseCsv(readFileSync(path, 'utf8'))
  if (!header) {
    console.error('Empty CSV')
    process.exit(1)
  }
  const col = {}
  header.forEach((h, i) => { col[h.trim().toLowerCase()] = i })
  if (col.vehicle === undefined) {
    console.error(`CSV needs a "vehicle" column; got: ${header.join(', ')}`)
    process.exit(1)
  }
  const at = (row, key) => (col[key] === undefined ? '' : (row[col[key]] ?? '').trim())
  return rows
    .filter((row) => at(row, 'vehicle'))
    .map((row, i) => {
      const tier = at(row, 'tier').toLowerCase() === 'featured' ? 'featured' : 'top50'
      const vehicle = at(row, 'vehicle')
      const carNumber = at(row, 'carnumber') || at(row, 'car #') || at(row, 'number')
      return {
        // Hash the car, not the row position: inserting or deleting a line in
        // the sheet must not shift every later winner onto the previous
        // winner's document (mirrors seed-shifts.mjs).
        id: `sheet-${createHash('sha1').update(`${tier}|${carNumber}|${vehicle}`).digest('hex').slice(0, 10)}`,
        tier,
        title: tier === 'featured' ? at(row, 'title') : '',
        carNumber,
        vehicle,
        owner: at(row, 'owner'),
        awardClass: at(row, 'class') || at(row, 'awardclass'),
        photoUrl: '',
        // Never auto-publish an imported sheet: the point of the import is to
        // have the winners loaded *before* they are called from the stage.
        announced: false,
        sortOrder: i,
      }
    })
}

function demoAwards() {
  const out = []
  DEMO_FEATURED.forEach(([title, carNumber, vehicle, owner, awardClass], i) => {
    out.push({
      id: `${DEMO_PREFIX}f${i}`, tier: 'featured', title, carNumber, vehicle, owner,
      awardClass, photoUrl: '', announced: true, sortOrder: 100 + i,
    })
  })
  DEMO_TOP50.forEach(([carNumber, vehicle, owner, awardClass], i) => {
    out.push({
      id: `${DEMO_PREFIX}t${i}`, tier: 'top50', title: '', carNumber, vehicle, owner,
      awardClass, photoUrl: '',
      // The last two stay staged so the Awards tab also demonstrates the
      // publish step, not just a finished board.
      announced: i < DEMO_TOP50.length - 2,
      sortOrder: i,
    })
  })
  return out
}

const awards = clearDemo ? [] : (demo ? demoAwards() : fromCsv(csvPath))

if (clearDemo) {
  console.log(`Clearing demo awards → ${prod ? 'PRODUCTION' : 'emulator'}`)
  if (prod) await clearViaRest()
  else await clearViaAdminSdk()
  console.log('Done.')
} else {
  const staged = awards.filter((a) => !a.announced).length
  console.log(
    `Seeding ${awards.length} awards (${staged} staged) → ${prod ? 'PRODUCTION' : 'emulator'}`,
  )
  if (prod) await seedViaRest()
  else await seedViaAdminSdk()
  for (const a of awards) {
    console.log(`  ${a.announced ? 'live  ' : 'staged'} ${a.carNumber || '—'}  ${a.title || a.tier}  ${a.vehicle}`)
  }
  console.log('Done.')
}

function adminDb() {
  initializeApp({ projectId: 'senoiacar' })
  return getFirestore()
}

async function seedViaAdminSdk() {
  const db = adminDb()
  const batch = db.batch()
  for (const { id, ...data } of awards) {
    const ref = db.doc(`events/${EVENT_ID}/awards/${id}`)
    // `announced` belongs to the announcer, not the sheet: once a document
    // exists, only the Awards tab may change whether it is on the board.
    const payload = { ...data }
    if ((await ref.get()).exists) delete payload.announced
    batch.set(ref, payload, { merge: true })
  }
  await batch.commit()
}

async function clearViaAdminSdk() {
  const db = adminDb()
  const snap = await db.collection(`events/${EVENT_ID}/awards`).get()
  const batch = db.batch()
  let n = 0
  for (const d of snap.docs) {
    if (!d.id.startsWith(DEMO_PREFIX)) continue
    batch.delete(d.ref)
    n++
  }
  await batch.commit()
  console.log(`Deleted ${n} demo awards (${snap.size - n} other awards left alone)`)
}

// The Admin SDK requires ADC/cert credentials; for prod we use the REST API
// with a short-lived token from `gcloud auth print-access-token` instead.
function restContext() {
  const token = process.env.GCLOUD_ACCESS_TOKEN
  if (!token) {
    console.error('Set GCLOUD_ACCESS_TOKEN (gcloud auth print-access-token) for --prod')
    process.exit(1)
  }
  const dbPath = 'projects/senoiacar/databases/(default)'
  return {
    docs: `https://firestore.googleapis.com/v1/${dbPath}/documents`,
    name: (path) => `${dbPath}/documents/${path}`,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  }
}

async function batchWrite({ docs, headers }, writes) {
  const res = await fetch(`${docs}:batchWrite`, {
    method: 'POST', headers, body: JSON.stringify({ writes }),
  })
  if (!res.ok) throw new Error(`batchWrite failed: ${res.status} ${await res.text()}`)
  // batchWrite is non-atomic: HTTP 200 can still carry per-write failures
  const body = await res.json()
  const failed = (body.status ?? []).filter((s) => s.code)
  if (failed.length) {
    throw new Error(`batchWrite had ${failed.length} failed writes: ${JSON.stringify(failed.slice(0, 3))}`)
  }
  return body.writeResults?.length ?? 0
}

async function seedViaRest() {
  const ctx = restContext()
  const existing = await listAwardIds(ctx)
  const str = (v) => ({ stringValue: v })
  const writes = awards.map(({ id, ...a }) => {
    const fields = {
      tier: str(a.tier), title: str(a.title), carNumber: str(a.carNumber),
      vehicle: str(a.vehicle), owner: str(a.owner), awardClass: str(a.awardClass),
      photoUrl: str(a.photoUrl),
      sortOrder: { integerValue: String(a.sortOrder) },
    }
    const fieldPaths = [
      'tier', 'title', 'carNumber', 'vehicle', 'owner', 'awardClass',
      'photoUrl', 'sortOrder',
    ]
    // `announced` belongs to the announcer, not the sheet: once a document
    // exists, only the Awards tab may change whether it is on the board.
    if (!existing.has(id)) {
      fields.announced = { booleanValue: a.announced }
      fieldPaths.push('announced')
    }
    return {
      update: { name: ctx.name(`events/${EVENT_ID}/awards/${id}`), fields },
      updateMask: { fieldPaths },
    }
  })
  const kept = awards.filter((a) => existing.has(a.id)).length
  console.log(
    `batchWrite applied ${await batchWrite(ctx, writes)} writes` +
    (kept ? ` (${kept} pre-existing awards kept their live/staged state)` : ''),
  )
}

// Page the whole collection: an award missed here reads as new, and would get
// its live/staged state overwritten by the sheet.
async function listAwardIds(ctx) {
  const ids = new Set()
  let pageToken
  do {
    const params = new URLSearchParams({ pageSize: '300', 'mask.fieldPaths': 'tier' })
    if (pageToken) params.set('pageToken', pageToken)
    const res = await fetch(`${ctx.docs}/events/${EVENT_ID}/awards?${params}`, { headers: ctx.headers })
    if (!res.ok) throw new Error(`list failed: ${res.status} ${await res.text()}`)
    const page = await res.json()
    for (const d of page.documents ?? []) ids.add(d.name.split('/').pop())
    pageToken = page.nextPageToken
  } while (pageToken)
  return ids
}

async function clearViaRest() {
  const ctx = restContext()
  const ids = [...await listAwardIds(ctx)]

  const demoIds = ids.filter((id) => id.startsWith(DEMO_PREFIX))
  if (demoIds.length === 0) {
    console.log(`No demo awards found (${ids.length} other awards left alone)`)
    return
  }
  const writes = demoIds.map((id) => ({ delete: ctx.name(`events/${EVENT_ID}/awards/${id}`) }))
  await batchWrite(ctx, writes)
  console.log(`Deleted ${demoIds.length} demo awards (${ids.length - demoIds.length} other awards left alone)`)
}
