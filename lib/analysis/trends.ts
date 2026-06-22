import { NAVHistory } from "@/lib/local-storage/db"

function mean(arr: number[]) {
  if (!arr.length) return 0
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

// Simple SMA using the most recent `period` NAVs
export function computeSMA(navHistory: NAVHistory[], period = 5) {
  if (!navHistory || navHistory.length === 0) return 0
  const sorted = [...navHistory].sort((a, b) => a.date.localeCompare(b.date))
  const last = sorted.slice(-period)
  const vals = last.map((d) => d.nav)
  return mean(vals)
}

// Detect moving average crossover: short MA vs long MA
export function detectMACrossover(navHistory: NAVHistory[], short = 5, long = 20) {
  if (!navHistory || navHistory.length === 0) return { signal: "neutral" as const, shortMA: 0, longMA: 0 }

  const shortMA = computeSMA(navHistory, short)
  const longMA = computeSMA(navHistory, long)

  let signal: "bullish" | "bearish" | "neutral" = "neutral"
  if (shortMA > longMA) signal = "bullish"
  else if (shortMA < longMA) signal = "bearish"

  return { signal, shortMA, longMA }
}
