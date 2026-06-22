import { LocalDB } from "@/lib/local-storage/db"

function mean(arr: number[]) {
  if (!arr.length) return 0
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

function stddev(arr: number[]) {
  if (arr.length <= 1) return 0
  const m = mean(arr)
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1)
  return Math.sqrt(variance)
}

// Compute momentum as percentage change over the window (last - first) / first * 100
export function computeMomentumFromNAV(navHistory: { nav: number; date: string }[]) {
  if (!navHistory || navHistory.length < 2) return 0
  const sorted = [...navHistory].sort((a, b) => a.date.localeCompare(b.date))
  const first = sorted[0].nav
  const last = sorted[sorted.length - 1].nav
  if (first === 0) return 0
  return ((last - first) / first) * 100
}

// Compute volatility as standard deviation of percent returns between consecutive NAVs
export function computeVolatilityFromNAV(navHistory: { nav: number; date: string }[]) {
  if (!navHistory || navHistory.length < 2) return 0
  const sorted = [...navHistory].sort((a, b) => a.date.localeCompare(b.date))
  const returns: number[] = []
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].nav
    const cur = sorted[i].nav
    if (prev === 0) continue
    returns.push((cur - prev) / prev)
  }
  return stddev(returns) * 100 // convert to percent
}

// Composite score: momentum normalized by volatility (risk-adjusted), scaled to 0-100
export async function computeScoreForFund(fundId: string) {
  try {
    const navHistory = await LocalDB.getNAVHistory(fundId)
    if (!navHistory || navHistory.length < 2) return 0

    const momentum = computeMomentumFromNAV(navHistory)
    const volatility = computeVolatilityFromNAV(navHistory)

    // If volatility is very low, avoid division by zero
    const scoreRaw = volatility > 0 ? momentum / volatility : momentum

    // Transform scoreRaw to a bounded 0-100 scale using a sigmoid-ish mapping
    // First clamp extreme values
    const capped = Math.max(Math.min(scoreRaw, 20), -20) // reasonable bounds
    // scale and shift
    const scaled = (capped + 20) / 40 // 0..1
    const score = Math.round(scaled * 10000) / 100 // 0..100 with 2 decimals
    return score
  } catch (err) {
    console.error("computeScoreForFund", err)
    return 0
  }
}

// Convenience: compute score for a security using its fund_id if present
export async function computeScoreForSecurity(security: { fund_id?: string; symbol?: string }) {
  if (security.fund_id) return computeScoreForFund(security.fund_id)
  // fallback: try to find fund by symbol
  const funds = await LocalDB.getFunds()
  const fund = funds.find((f) => f.fund_code === security.symbol)
  if (fund) return computeScoreForFund(fund.id)
  return 0
}
