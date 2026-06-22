import { NAVHistory } from "@/lib/local-storage/db"

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

// Compute daily returns array from NAV history (sorted ascending by date)
export function computeDailyReturns(navHistory: NAVHistory[]) {
  if (!navHistory || navHistory.length < 2) return []
  const sorted = [...navHistory].sort((a, b) => a.date.localeCompare(b.date))
  const returns: number[] = []
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].nav
    const cur = sorted[i].nav
    if (prev === 0) continue
    returns.push((cur - prev) / prev)
  }
  return returns
}

// Annualized return from daily returns (geometric)
export function computeAnnualizedReturn(dailyReturns: number[]) {
  if (!dailyReturns || dailyReturns.length === 0) return 0
  const cumulative = dailyReturns.reduce((acc, r) => acc * (1 + r), 1)
  const totalDays = dailyReturns.length
  const annualFactor = 252 / totalDays
  return Math.pow(cumulative, annualFactor) - 1
}

// Sharpe ratio (annualized). riskFreeRate is annual (e.g., 0.05 for 5%)
export function computeSharpe(dailyReturns: number[], riskFreeRate = 0.05) {
  if (!dailyReturns || dailyReturns.length === 0) return 0
  const rfDaily = riskFreeRate / 252
  const excess = dailyReturns.map((r) => r - rfDaily)
  const avgExcess = mean(excess)
  const sd = stddev(dailyReturns)
  if (sd === 0) return 0
  const sharpe = (avgExcess / sd) * Math.sqrt(252)
  return sharpe
}

// Sortino ratio: use downside deviation (stddev of negative returns)
export function computeSortino(dailyReturns: number[], riskFreeRate = 0.05) {
  if (!dailyReturns || dailyReturns.length === 0) return 0
  const rfDaily = riskFreeRate / 252
  const excess = dailyReturns.map((r) => r - rfDaily)
  const negative = excess.filter((r) => r < 0)
  const downside = stddev(negative)
  if (downside === 0) return 0
  const avgExcess = mean(excess)
  const sortino = (avgExcess / downside) * Math.sqrt(252)
  return sortino
}

// Rolling return over window days (% change over the window)
export function computeRollingReturns(navHistory: NAVHistory[], window = 20) {
  if (!navHistory || navHistory.length < window) return []
  const sorted = [...navHistory].sort((a, b) => a.date.localeCompare(b.date))
  const results: { date: string; rollingReturn: number }[] = []
  for (let i = window; i < sorted.length; i++) {
    const start = sorted[i - window].nav
    const end = sorted[i].nav
    if (start === 0) continue
    results.push({ date: sorted[i].date, rollingReturn: (end - start) / start })
  }
  return results
}
