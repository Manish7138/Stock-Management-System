// Minimal smoke test for local dev server routes
// Usage: `node scripts/smoke-test.js`
const routes = [
  '/',
  '/manager',
  '/manager/market',
  '/manager/funds',
  '/manager/funds/1',
  '/manager/transactions',
  '/api/health',
]

async function check() {
  const results = []
  for (const r of routes) {
    const url = `http://localhost:3000${r}`
    try {
      const res = await fetch(url)
      results.push({ route: r, status: res.status })
    } catch (e) {
      results.push({ route: r, error: String(e) })
    }
  }

  console.log('Smoke test results:')
  for (const r of results) {
    if (r.status) console.log(`${r.route} -> ${r.status}`)
    else console.log(`${r.route} -> ERROR: ${r.error}`)
  }

  const allOk = results.every((r) => r.status && r.status >= 200 && r.status < 400)
  process.exit(allOk ? 0 : 2)
}

check()
