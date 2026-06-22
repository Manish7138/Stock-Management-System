// Simple HTML content checks for key actor pages.
// Run: `node scripts/ui-check.js`
const http = require('http')

const checks = [
  { path: '/', expect: 'Welcome' },
  { path: '/auth/login', expect: 'Sign in' },
  { path: '/auth/register', expect: 'Register' },
  { path: '/dashboard', expect: 'Dashboard' },
  { path: '/manager', expect: 'Portfolio Manager Dashboard' },
  { path: '/manager/funds', expect: 'Funds' },
  { path: '/manager/market', expect: 'Market' },
  { path: '/manager/transactions', expect: 'All Transactions' },
  { path: '/admin', expect: 'Admin' },
]

async function run() {
  const base = 'http://localhost:3000'
  const results = []
  for (const c of checks) {
    try {
      const text = await new Promise((resolve, reject) => {
        http.get(base + c.path, (res) => {
          let data = ''
          res.on('data', (chunk) => (data += chunk))
          res.on('end', () => resolve(data))
        }).on('error', (e) => reject(e))
      })
      const ok = text.includes(c.expect)
      results.push({ path: c.path, status: 200, ok })
    } catch (e) {
      results.push({ path: c.path, error: String(e) })
    }
  }

  console.log('UI check results:')
  for (const r of results) {
    if (r.error) console.log(`${r.path} -> ERROR: ${r.error}`)
    else console.log(`${r.path} -> ${r.status} ${r.ok ? 'OK' : 'MISSING_TEXT'}`)
  }

  const allOk = results.every((r) => !r.error && r.status === 200 && r.ok)
  process.exit(allOk ? 0 : 2)
}

run()
