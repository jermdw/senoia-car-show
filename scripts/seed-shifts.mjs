// Seed events/2026/shifts from the volunteersignup.org CSV export.
// Usage:
//   node scripts/seed-shifts.mjs path/to/event_signups.csv            # against emulator (FIRESTORE_EMULATOR_HOST=localhost:8080)
//   node scripts/seed-shifts.mjs path/to/event_signups.csv --prod     # against production
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const csvPath = process.argv[2]
const prod = process.argv.includes('--prod')
if (!csvPath) {
  console.error('Usage: node scripts/seed-shifts.mjs <csv> [--prod]')
  process.exit(1)
}
if (!prod && !process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
}

const EVENT_ID = '2026'
// 2025 CSV dates → 2026 event dates (show moved Sat 9/27/25 → Sat 9/26/26)
const DATE_MAP = { '9/26': '2026-09-25', '9/27': '2026-09-26', '9/28': '2026-09-27' }

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

const [header, ...rows] = parseCsv(readFileSync(csvPath, 'utf8'))
if (header[0] !== 'What' || header[1] !== 'When') {
  console.error('Unexpected CSV format; expected columns starting with What,When')
  process.exit(1)
}

// Collapse duplicate rows (one row per slot) into shifts with spot counts.
const shifts = new Map()
let sortOrder = 0
for (const [i, [role, when]] of rows.entries()) {
  if (!role) continue
  if (!when) {
    console.error(`Row ${i + 2}: "${role}" has no When column`)
    process.exit(1)
  }
  const key = `${role}|${when}`
  if (!shifts.has(key)) {
    const dayToken = when.trim().split(/[\s-]+/)[0]
    const day = DATE_MAP[dayToken]
    if (!day) {
      console.error(`Row "${role}" has unmapped date in "${when}"`)
      process.exit(1)
    }
    // Rewrite the 2025 day prefix to the 2026 date for display
    const [m, d] = day.slice(5).split('-').map(Number)
    const time = when.replace(dayToken, `${m}/${d}`)
    shifts.set(key, {
      id: createHash('sha1').update(key).digest('hex').slice(0, 10),
      role,
      time,
      day,
      spotsTotal: 0,
      sortOrder: sortOrder++,
    })
  }
  shifts.get(key).spotsTotal++
}

console.log(`Seeding ${shifts.size} shifts (${[...shifts.values()].reduce((n, s) => n + s.spotsTotal, 0)} total spots) → ${prod ? 'PRODUCTION' : 'emulator'}`)

if (prod) {
  await seedViaRest()
} else {
  await seedViaAdminSdk()
}

async function seedViaAdminSdk() {
  initializeApp({ projectId: 'senoiacar' })
  const db = getFirestore()
  const batch = db.batch()
  batch.set(db.doc(`events/${EVENT_ID}`), {
    name: '21st Annual Senoia Car Show',
    date: '2026-09-26',
    signupOpen: true,
  }, { merge: true })
  for (const s of shifts.values()) {
    const { id, ...data } = s
    const ref = db.doc(`events/${EVENT_ID}/shifts/${id}`)
    const existing = await ref.get()
    // Idempotent: never clobber spotsFilled on re-run
    batch.set(ref, existing.exists ? data : { ...data, spotsFilled: 0 }, { merge: true })
  }
  await batch.commit()
}

// The Admin SDK requires ADC/cert credentials; for prod we use the REST API
// with a short-lived token from `gcloud auth print-access-token` instead.
async function seedViaRest() {
  const token = process.env.GCLOUD_ACCESS_TOKEN
  if (!token) {
    console.error('Set GCLOUD_ACCESS_TOKEN (gcloud auth print-access-token) for --prod')
    process.exit(1)
  }
  const dbPath = 'projects/senoiacar/databases/(default)'
  const docs = `https://firestore.googleapis.com/v1/${dbPath}/documents`
  const name = (path) => `${dbPath}/documents/${path}`
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const listRes = await fetch(`${docs}/events/${EVENT_ID}/shifts?pageSize=300&mask.fieldPaths=day`, { headers })
  if (!listRes.ok) throw new Error(`list failed: ${listRes.status} ${await listRes.text()}`)
  const existing = new Set(
    ((await listRes.json()).documents ?? []).map((d) => d.name.split('/').pop()),
  )

  const str = (v) => ({ stringValue: v })
  const int = (v) => ({ integerValue: String(v) })
  const writes = [{
    update: {
      name: name(`events/${EVENT_ID}`),
      fields: {
        name: str('21st Annual Senoia Car Show'),
        date: str('2026-09-26'),
        signupOpen: { booleanValue: true },
      },
    },
    updateMask: { fieldPaths: ['name', 'date', 'signupOpen'] },
  }]
  for (const s of shifts.values()) {
    const fields = {
      role: str(s.role), time: str(s.time), day: str(s.day),
      spotsTotal: int(s.spotsTotal), sortOrder: int(s.sortOrder),
    }
    const fieldPaths = ['role', 'time', 'day', 'spotsTotal', 'sortOrder']
    if (!existing.has(s.id)) {
      fields.spotsFilled = int(0)
      fieldPaths.push('spotsFilled')
    }
    writes.push({
      update: { name: name(`events/${EVENT_ID}/shifts/${s.id}`), fields },
      updateMask: { fieldPaths },
    })
  }
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
  console.log(`batchWrite applied ${body.writeResults?.length ?? 0} writes (${existing.size} pre-existing shifts preserved)`)
}

for (const s of shifts.values()) console.log(`  ${s.day}  ${s.role} (${s.spotsTotal})`)
console.log('Done.')
