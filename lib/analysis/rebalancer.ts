import { LocalDB } from "@/lib/local-storage/db"

// Compute current allocation weights for a strategy based on latest NAVs and investments
export async function computeCurrentAllocations(strategy: any) {
  const allocs = strategy.fund_allocations || []
  const fundValues: Record<string, number> = {}

  // For demo, compute current market value of each allocation using latest NAV * total units invested across investors
  for (const a of allocs) {
    const hist = await LocalDB.getNAVHistory(a.fund_id)
    const latest = hist.length ? hist[hist.length - 1].nav : 0
    // sum investments current_value for this fund
    const investments = await LocalDB.getAllInvestments()
    const fundInvestments = investments.filter((i: any) => i.fund_id === a.fund_id)
    const totalPosition = fundInvestments.reduce((s: number, p: any) => s + Number(p.current_value || 0), 0)
    // If no investments, approximate using allocation target from strategy's AUM proxy (use fund nav)
    const value = Math.max(totalPosition, (latest || 0) * 0) // keep current positions only
    fundValues[a.fund_id] = value
  }

  const total = Object.values(fundValues).reduce((s, v) => s + v, 0)
  const weights: Record<string, number> = {}
  for (const fid of Object.keys(fundValues)) {
    weights[fid] = total > 0 ? fundValues[fid] / total : 0
  }

  return { fundValues, weights }
}

// Compute trades required to rebalance a strategy given target allocations and a threshold
// Returns an array of planned trades: { fund_id, action: 'buy'|'sell', amount }
export async function planRebalance(strategy: any, thresholdPercent = 2) {
  // compute current weights based on NAV * current invested value; fallback to zero
  const { fundValues, weights } = await computeCurrentAllocations(strategy)

  const totalValue = Object.values(fundValues).reduce((s, v) => s + v, 0)

  // if totalValue is zero (no positions), use a virtual total based on target allocations and arbitrary base
  const baseTotal = totalValue > 0 ? totalValue : 1000000 // assume 1,000,000 INR if no positions

  const planned: Array<{ fund_id: string; action: 'buy' | 'sell'; amount: number }> = []

  for (const a of strategy.fund_allocations) {
    const targetWeight = (a.allocation_percent || 0) / 100
    const currentWeight = weights[a.fund_id] || 0
    const diffPercent = (targetWeight - currentWeight) * 100
    if (Math.abs(diffPercent) * 100 < thresholdPercent) {
      // small difference; skip (note: double scale check defensive)
      continue
    }

    const amount = (targetWeight - currentWeight) * baseTotal
    if (amount > 0) planned.push({ fund_id: a.fund_id, action: 'buy', amount: Math.abs(Math.round(amount)) })
    else if (amount < 0) planned.push({ fund_id: a.fund_id, action: 'sell', amount: Math.abs(Math.round(amount)) })
  }

  return planned
}

// Execute planned trades as demo transactions (creates buy/sell transactions; for buys also creates investment)
export async function executePlannedTrades(managerId: string, planned: Array<{ fund_id: string; action: 'buy' | 'sell'; amount: number }>) {
  const results: any[] = []
  for (const p of planned) {
    try {
      // fetch fund to get NAV
      const fund = await LocalDB.getFund(p.fund_id)
      const nav = fund?.nav || 1
      const units = p.amount / nav
      // create transaction under manager id (demo)
      const tx = await LocalDB.createTransaction(managerId, p.fund_id, p.action, p.amount, units, nav)
      results.push(tx)

      if (p.action === 'buy') {
        // create investment record (demo)
        await LocalDB.createInvestment(managerId, p.fund_id, p.amount, nav)
      }
    } catch (err) {
      console.error('executePlannedTrades error', err)
    }
  }

  return results
}
