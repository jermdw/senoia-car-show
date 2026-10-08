// Export a traffic report from GA4 and Search Console (read-only).
// Usage:
//   node scripts/export-analytics.mjs                                  # last 30 days, markdown to stdout
//   node scripts/export-analytics.mjs --start 2026-09-07 --end 2026-10-08
//   node scripts/export-analytics.mjs --start 2026-09-07 --csv out/    # also write one CSV per table
//
// Needs Application Default Credentials with the read-only Analytics and Search
// Console scopes — the one-time login and why it uses a custom OAuth client are
// in docs/12-analytics-and-seo.md. IDs below are public; no secrets live here.
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const GA_PROPERTY = '549032613' // GA4 property "senoiacar"
const GSC_SITE = 'sc-domain:senoiacar.show'
const QUOTA_PROJECT = 'senoiacar'

const args = process.argv.slice(2)
const opt = (name) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? undefined : args[i + 1]
}
const today = new Date().toISOString().slice(0, 10)
const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10)
const start = opt('start') ?? daysAgo(30)
const end = opt('end') ?? today
const csvDir = opt('csv')
for (const [label, v] of [['--start', start], ['--end', end]]) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    console.error(`${label} must be YYYY-MM-DD, got "${v}"`)
    process.exit(1)
  }
}

function accessToken() {
  try {
    return execFileSync('gcloud', ['auth', 'application-default', 'print-access-token'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
  } catch (e) {
    console.error('Could not get an access token. Run the login in docs/12-analytics-and-seo.md first.')
    console.error(String(e.stderr || e.message).trim())
    process.exit(1)
  }
}
const token = accessToken()

async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-goog-user-project': QUOTA_PROJECT,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) {
    const msg = json.error?.message ?? res.statusText
    console.error(`${res.status} from ${new URL(url).host}: ${msg}`)
    if (/scope/i.test(msg)) console.error('The token is missing a scope — repeat the login in docs/12.')
    process.exit(1)
  }
  return json
}

const ga = async (dimension, metrics, { limit = 15, orderBy } = {}) => {
  const json = await post(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY}:runReport`,
    {
      dateRanges: [{ startDate: start, endDate: end }],
      dimensions: [{ name: dimension }],
      metrics: metrics.map((name) => ({ name })),
      limit,
      orderBys: orderBy
        ? [{ dimension: { dimensionName: dimension } }]
        : [{ metric: { metricName: metrics[0] }, desc: true }],
    },
  )
  return (json.rows ?? []).map((r) => [
    r.dimensionValues[0].value,
    ...r.metricValues.map((m) => Number(m.value)),
  ])
}

const gsc = async (dimensions, rowLimit = 15) => {
  const json = await post(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`,
    { startDate: start, endDate: end, dimensions, rowLimit },
  )
  return (json.rows ?? []).map((r) => [
    r.keys[0],
    r.clicks,
    r.impressions,
    Math.round(r.ctr * 1000) / 10,
    Math.round(r.position * 10) / 10,
  ])
}

const GA_COLS = ['sessions', 'users', 'views']
const GSC_COLS = ['clicks', 'impressions', 'ctr %', 'avg position']
const gaMetrics = ['sessions', 'activeUsers', 'screenPageViews']

const tables = [
  { title: 'GA4 daily', first: 'date', cols: GA_COLS, rows: await ga('date', gaMetrics, { limit: 400, orderBy: 'date' }) },
  { title: 'GA4 channels', first: 'channel', cols: GA_COLS, rows: await ga('sessionDefaultChannelGroup', gaMetrics) },
  { title: 'GA4 source / medium', first: 'source / medium', cols: GA_COLS, rows: await ga('sessionSourceMedium', gaMetrics) },
  { title: 'GA4 pages', first: 'page', cols: GA_COLS, rows: await ga('pagePath', gaMetrics, { limit: 20 }) },
  { title: 'GA4 events', first: 'event', cols: ['count'], rows: await ga('eventName', ['eventCount']) },
  { title: 'Search Console daily', first: 'date', cols: GSC_COLS, rows: (await gsc(['date'], 400)).sort((a, b) => a[0].localeCompare(b[0])) },
  { title: 'Search Console queries', first: 'query', cols: GSC_COLS, rows: await gsc(['query'], 25) },
  { title: 'Search Console pages', first: 'page', cols: GSC_COLS, rows: await gsc(['page'], 20) },
]

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const cell = (v) => String(v).replaceAll('|', '\\|')
const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replaceAll('"', '""')}"` : String(v))

const out = [`# Traffic report ${start} → ${end}`, '']
out.push('Search Console data lags about two days; GA4 includes the current day.', '')
for (const t of tables) {
  const head = [t.first, ...t.cols]
  out.push(`## ${t.title}`, '', `| ${head.join(' | ')} |`, `|${head.map(() => ' --- ').join('|')}|`)
  for (const r of t.rows) out.push(`| ${r.map(cell).join(' | ')} |`)
  const sums = t.title.endsWith('daily')
    ? t.cols.map((_, i) => t.rows.reduce((a, r) => a + r[i + 1], 0))
    : null
  if (sums && t.cols[0] !== 'avg position') {
    const additive = t.cols.map((c, i) => (c === 'ctr %' || c === 'avg position' ? '' : sums[i]))
    out.push(`| **total** | ${additive.join(' | ')} |`)
  }
  out.push('')
}
console.log(out.join('\n'))

if (csvDir) {
  mkdirSync(csvDir, { recursive: true })
  for (const t of tables) {
    const lines = [[t.first, ...t.cols], ...t.rows].map((r) => r.map(csvCell).join(','))
    writeFileSync(join(csvDir, `${slug(t.title)}.csv`), lines.join('\n') + '\n')
  }
  console.error(`Wrote ${tables.length} CSVs to ${csvDir}`)
}
