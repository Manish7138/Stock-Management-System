// Local Storage Database
// Complete offline data management using IndexedDB and localStorage

export interface User {
  id: string
  email: string
  password: string // In real app, would be hashed
  full_name: string
  role: "investor" | "portfolio_manager" | "admin"
  created_at: string
}

export interface Profile extends User {
  phone?: string
  kyc_status?: "pending" | "verified" | "rejected"
}

export interface MutualFund {
  id: string
  fund_name: string
  fund_code: string
  fund_type: "equity" | "debt" | "hybrid" | "index" | "sector"
  objective: string
  benchmark: string
  expense_ratio: number
  minimum_investment: number
  risk_level: "low" | "medium" | "high"
  nav: number
  aum: number
  inception_date: string
  created_at: string
  updated_at: string
  manager_id?: string
}

export interface Security {
  id: string
  symbol: string
  name: string
  sector: string
  fund_id?: string
  current_price: number
  previous_close: number
  market_cap: number
  volume: number
  last_updated: string
}

export interface Investment {
  id: string
  investor_id: string
  fund_id: string
  units: number
  average_nav: number
  total_invested: number
  current_value: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  investor_id: string
  fund_id: string
  transaction_type: "buy" | "sell"
  amount: number
  units: number
  nav: number
  status: "pending" | "completed" | "failed"
  processed_at?: string
  created_at: string
}

export interface NAVHistory {
  id: string
  fund_id: string
  nav: number
  date: string
}

export interface FundPerformance {
  id: string
  fund_id: string
  period: "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "3Y" | "5Y"
  returns: number
  sharpe_ratio: number
  alpha: number
  beta: number
  standard_deviation: number
}

export interface Watchlist {
  id: string
  user_id: string
  fund_id: string
  created_at: string
}

export interface InvestorProfile {
  id: string
  user_id: string
  risk_tolerance?: string
  investment_experience?: string
  annual_income?: number
  investment_goals?: string
  completed_risk_assessment?: boolean
  created_at?: string
  updated_at?: string
}

export interface StrategyAllocation {
  fund_id: string
  allocation_percent: number
}

export interface RebalanceRule {
  type: "threshold" | "calendar"
  threshold_percent?: number
  frequency?: "monthly" | "quarterly" | "annually"
}

export interface Strategy {
  id: string
  name: string
  manager_id?: string
  fund_allocations: StrategyAllocation[]
  rebalancing?: RebalanceRule
  created_at: string
  updated_at: string
}

export interface ScheduledReport {
  id: string
  name: string
  type: "fund" | "strategy" | "transactions"
  target_id?: string
  frequency?: "daily" | "weekly" | "monthly"
  created_at: string
}

export interface RebalanceState {
  strategy_id: string
  last_run?: string
}

// Initialize local storage with sample data
export function initializeDatabase() {
  if (typeof window === "undefined") return

  // Check if already initialized
  if (localStorage.getItem("db_initialized")) return

  // Sample mutual funds
  const funds: MutualFund[] = [
    {
      id: "1",
      fund_name: "Blue Chip Equity Fund",
      fund_code: "BCEF001",
      fund_type: "equity",
      objective: "Long-term capital appreciation through investments in large-cap stocks",
      benchmark: "NIFTY 50",
      expense_ratio: 0.75,
      minimum_investment: 5000,
      risk_level: "medium",
      nav: 15.42,
      aum: 500000000,
      inception_date: "2020-01-15",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      fund_name: "Growth Opportunities Fund",
      fund_code: "GOF002",
      fund_type: "equity",
      objective: "Aggressive growth through mid and small-cap stocks",
      benchmark: "NIFTY Midcap 100",
      expense_ratio: 1.25,
      minimum_investment: 3000,
      risk_level: "high",
      nav: 22.18,
      aum: 250000000,
      inception_date: "2019-06-01",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      fund_name: "Stable Income Debt Fund",
      fund_code: "SIDF003",
      fund_type: "debt",
      objective: "Regular income with capital preservation through debt securities",
      benchmark: "CRISIL Composite Bond Index",
      expense_ratio: 0.5,
      minimum_investment: 1000,
      risk_level: "low",
      nav: 11.87,
      aum: 750000000,
      inception_date: "2018-03-20",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "4",
      fund_name: "Balanced Hybrid Fund",
      fund_code: "BHF004",
      fund_type: "hybrid",
      objective: "Balanced portfolio of equity and debt for moderate risk-return",
      benchmark: "70% NIFTY 50 + 30% CRISIL",
      expense_ratio: 1.0,
      minimum_investment: 2500,
      risk_level: "medium",
      nav: 18.95,
      aum: 400000000,
      inception_date: "2020-09-10",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "5",
      fund_name: "Technology Sector Fund",
      fund_code: "TSF005",
      fund_type: "sector",
      objective: "Investment in technology and IT sector companies",
      benchmark: "NIFTY IT Index",
      expense_ratio: 1.5,
      minimum_investment: 5000,
      risk_level: "high",
      nav: 28.34,
      aum: 180000000,
      inception_date: "2021-02-15",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "6",
      fund_name: "Index Fund 50",
      fund_code: "IF50006",
      fund_type: "index",
      objective: "Passive investment tracking NIFTY 50 index",
      benchmark: "NIFTY 50",
      expense_ratio: 0.25,
      minimum_investment: 1000,
      risk_level: "medium",
      nav: 13.67,
      aum: 900000000,
      inception_date: "2017-11-01",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      manager_id: "u-manager-1",
    },
  ]

  // Generate NAV history for each fund (last 30 days)
  const navHistory: NAVHistory[] = []
  funds.forEach((fund) => {
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const variation = (Math.random() - 0.5) * 0.5
      navHistory.push({
        id: `nav-${fund.id}-${i}`,
        fund_id: fund.id,
        nav: fund.nav + variation * (i / 30),
        date: date.toISOString().split("T")[0],
      })
    }
  })

  // Generate performance metrics
  const performance: FundPerformance[] = []
  const periods: FundPerformance["period"][] = ["1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "5Y"]
  funds.forEach((fund) => {
    periods.forEach((period, index) => {
      const baseReturn = [0.5, 1.2, 3.5, 8.2, 12.5, 18.3, 35.7, 68.4][index]
      performance.push({
        id: `perf-${fund.id}-${period}`,
        fund_id: fund.id,
        period,
        returns: baseReturn + (Math.random() - 0.5) * 5,
        sharpe_ratio: 1.2 + Math.random() * 0.5,
        alpha: Math.random() * 2 - 0.5,
        beta: 0.9 + Math.random() * 0.3,
        standard_deviation: Math.random() * 5 + 10,
      })
    })
  })

  // assign demo manager to funds (some variability)
  const managerAssignedFunds = funds.map((f, i) => ({ ...f, manager_id: i % 2 === 0 ? "u-manager-1" : undefined }))
  localStorage.setItem("mutual_funds", JSON.stringify(managerAssignedFunds))

  // Create a simple securities dataset derived from funds
  const securities: Security[] = managerAssignedFunds.map((f, i) => ({
    id: `sec-${f.id}`,
    symbol: f.fund_code,
    name: f.fund_name,
    fund_id: f.id,
    sector: f.fund_type === "sector" ? "Technology" : f.fund_type === "equity" ? "Financials" : "General",
    current_price: Number((f.nav * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2)),
    previous_close: Number((f.nav * (1 + (Math.random() - 0.5) * 0.015)).toFixed(2)),
    market_cap: f.aum,
    volume: Math.floor(Math.random() * 1000000) + 10000,
    last_updated: new Date().toISOString(),
  }))
  localStorage.setItem("securities", JSON.stringify(securities))
  localStorage.setItem("nav_history", JSON.stringify(navHistory))
  localStorage.setItem("fund_performance", JSON.stringify(performance))

  // Sample users for demo mode (Investor, Portfolio Manager, Admin)
  const now = new Date().toISOString()
  const users = [
    {
      id: "u-investor-1",
      email: "investor@example.com",
      password: "password",
      full_name: "Demo Investor",
      role: "investor",
      created_at: now,
    },
    {
      id: "u-manager-1",
      email: "manager@example.com",
      password: "password",
      full_name: "Demo Manager",
      role: "portfolio_manager",
      created_at: now,
    },
    {
      id: "u-admin-1",
      email: "admin@example.com",
      password: "password",
      full_name: "System Admin",
      role: "admin",
      created_at: now,
    },
  ]

  // Sample investments and transactions to show activity for each role
  const investments = [
    {
      id: "inv-1",
      investor_id: "u-investor-1",
      fund_id: "1",
      units: 100,
      average_nav: 15.42,
      total_invested: 1542,
      current_value: 1542,
      created_at: now,
      updated_at: now,
    },
  ]

  const transactions = [
    // Investor transactions
    {
      id: "tx-inv-1",
      investor_id: "u-investor-1",
      fund_id: "1",
      transaction_type: "buy",
      amount: 5000,
      units: 5000 / 15.42,
      nav: 15.42,
      status: "completed",
      processed_at: now,
      created_at: now,
    },
    {
      id: "tx-inv-2",
      investor_id: "u-investor-1",
      fund_id: "2",
      transaction_type: "buy",
      amount: 3000,
      units: 3000 / 22.18,
      nav: 22.18,
      status: "completed",
      processed_at: now,
      created_at: now,
    },
    // Manager transactions (demo activity)
    {
      id: "tx-mgr-1",
      investor_id: "u-manager-1",
      fund_id: "2",
      transaction_type: "sell",
      amount: 10000,
      units: 10000 / 22.18,
      nav: 22.18,
      status: "completed",
      processed_at: now,
      created_at: now,
    },
    // Admin transactions (demo activity)
    {
      id: "tx-adm-1",
      investor_id: "u-admin-1",
      fund_id: "3",
      transaction_type: "buy",
      amount: 2000,
      units: 2000 / 11.87,
      nav: 11.87,
      status: "completed",
      processed_at: now,
      created_at: now,
    },
  ]

  localStorage.setItem("users", JSON.stringify(users))
  localStorage.setItem("investments", JSON.stringify(investments))
  localStorage.setItem("transactions", JSON.stringify(transactions))
  localStorage.setItem("investor_profiles", JSON.stringify([]))
  localStorage.setItem("watchlist", JSON.stringify([]))
  localStorage.setItem("db_initialized", "true")

  console.log("[local] Local database initialized with sample data")
}

// Database operations
export const LocalDB = {
  // Users
  async createUser(email: string, password: string, fullName: string, role: User["role"] = "investor"): Promise<User> {
    const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]

    // Check if user exists
    if (users.find((u) => u.email === email)) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password, // In production, would hash this
      full_name: fullName,
      role,
      created_at: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
    return newUser
  },

  async loginUser(email: string, password: string): Promise<User> {
    const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Store current session
    localStorage.setItem("current_user", JSON.stringify(user))
    return user
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("current_user")
    return userStr ? JSON.parse(userStr) : null
  },

  logout() {
    localStorage.removeItem("current_user")
  },

  // Mutual Funds
  async getFunds(): Promise<MutualFund[]> {
    return JSON.parse(localStorage.getItem("mutual_funds") || "[]")
  },

  async getSecurities(): Promise<Security[]> {
    return JSON.parse(localStorage.getItem("securities") || "[]")
  },

  async getSecurity(id: string): Promise<Security | null> {
    const secs = JSON.parse(localStorage.getItem("securities") || "[]") as Security[]
    return secs.find((s) => s.id === id || s.symbol === id) || null
  },

  async getFund(id: string): Promise<MutualFund | null> {
    const funds = await this.getFunds()
    return funds.find((f) => f.id === id) || null
  },

  // NAV History
  async getNAVHistory(fundId: string): Promise<NAVHistory[]> {
    const history = JSON.parse(localStorage.getItem("nav_history") || "[]") as NAVHistory[]
    return history.filter((h) => h.fund_id === fundId).sort((a, b) => a.date.localeCompare(b.date))
  },

  // Performance
  async getFundPerformance(fundId: string): Promise<FundPerformance[]> {
    const performance = JSON.parse(localStorage.getItem("fund_performance") || "[]") as FundPerformance[]
    return performance.filter((p) => p.fund_id === fundId)
  },

  // Investments
  async getInvestments(userId: string): Promise<Investment[]> {
    const investments = JSON.parse(localStorage.getItem("investments") || "[]") as Investment[]
    return investments.filter((i) => i.investor_id === userId)
  },

  async createInvestment(userId: string, fundId: string, amount: number, nav: number): Promise<Investment> {
    const investments = JSON.parse(localStorage.getItem("investments") || "[]") as Investment[]
    const units = amount / nav

    const newInvestment: Investment = {
      id: crypto.randomUUID(),
      investor_id: userId,
      fund_id: fundId,
      units,
      average_nav: nav,
      total_invested: amount,
      current_value: amount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    investments.push(newInvestment)
    localStorage.setItem("investments", JSON.stringify(investments))

    // Create transaction
    await this.createTransaction(userId, fundId, "buy", amount, units, nav)

    return newInvestment
  },

  // Transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]") as Transaction[]
    return transactions
      .filter((t) => t.investor_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  async createTransaction(
    userId: string,
    fundId: string,
    type: "buy" | "sell",
    amount: number,
    units: number,
    nav: number,
  ): Promise<Transaction> {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]") as Transaction[]

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      investor_id: userId,
      fund_id: fundId,
      transaction_type: type,
      amount,
      units,
      nav,
      status: "completed",
      processed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    transactions.push(newTransaction)
    localStorage.setItem("transactions", JSON.stringify(transactions))
    return newTransaction
  },

  // Watchlist
  async getWatchlist(userId: string): Promise<Watchlist[]> {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]") as Watchlist[]
    return watchlist.filter((w) => w.user_id === userId)
  },

  async addToWatchlist(userId: string, fundId: string): Promise<Watchlist> {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]") as Watchlist[]

    

    // Check if already in watchlist
    if (watchlist.find((w) => w.user_id === userId && w.fund_id === fundId)) {
      throw new Error("Fund already in watchlist")
    }

    const newItem: Watchlist = {
      id: crypto.randomUUID(),
      user_id: userId,
      fund_id: fundId,
      created_at: new Date().toISOString(),
    }

    watchlist.push(newItem)
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
    return newItem
  },

  async removeFromWatchlist(userId: string, fundId: string): Promise<void> {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]") as Watchlist[]
    const updated = watchlist.filter((w) => !(w.user_id === userId && w.fund_id === fundId))
    localStorage.setItem("watchlist", JSON.stringify(updated))
  },

  // Investor profiles
  async getInvestorProfile(userId: string): Promise<InvestorProfile | null> {
    const profiles = JSON.parse(localStorage.getItem("investor_profiles") || "[]") as InvestorProfile[]
    return profiles.find((p) => p.user_id === userId) || null
  },

  async upsertInvestorProfile(profile: Partial<InvestorProfile> & { user_id: string }): Promise<InvestorProfile> {
    const profiles = JSON.parse(localStorage.getItem("investor_profiles") || "[]") as InvestorProfile[]
    const existingIndex = profiles.findIndex((p) => p.user_id === profile.user_id)

    if (existingIndex >= 0) {
      const updated: InvestorProfile = {
        ...profiles[existingIndex],
        ...profile,
        updated_at: new Date().toISOString(),
      }
      profiles[existingIndex] = updated
      localStorage.setItem("investor_profiles", JSON.stringify(profiles))
      return updated
    }

    const newProfile: InvestorProfile = {
      id: crypto.randomUUID(),
      user_id: profile.user_id,
      risk_tolerance: profile.risk_tolerance,
      investment_experience: profile.investment_experience,
      annual_income: profile.annual_income,
      investment_goals: profile.investment_goals,
      completed_risk_assessment: profile.completed_risk_assessment || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    profiles.push(newProfile)
    localStorage.setItem("investor_profiles", JSON.stringify(profiles))
    return newProfile
  },

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return JSON.parse(localStorage.getItem("users") || "[]")
  },

  async getAllInvestments(): Promise<Investment[]> {
    return JSON.parse(localStorage.getItem("investments") || "[]")
  },

  async getAllTransactions(): Promise<Transaction[]> {
    return JSON.parse(localStorage.getItem("transactions") || "[]")
  },

  // Strategies (portfolio manager tools)
  async getStrategies(managerId?: string): Promise<Strategy[]> {
    const strategies = JSON.parse(localStorage.getItem("strategies") || "[]") as Strategy[]
    return managerId ? strategies.filter((s) => s.manager_id === managerId) : strategies
  },

  async createStrategy(payload: Partial<Strategy> & { name: string; fund_allocations: StrategyAllocation[]; manager_id?: string }): Promise<Strategy> {
    const strategies = JSON.parse(localStorage.getItem("strategies") || "[]") as Strategy[]
    const now = new Date().toISOString()
    const newStrategy: Strategy = {
      id: crypto.randomUUID(),
      name: payload.name,
      manager_id: payload.manager_id,
      fund_allocations: payload.fund_allocations,
      rebalancing: payload.rebalancing,
      created_at: now,
      updated_at: now,
    }
    strategies.push(newStrategy)
    localStorage.setItem("strategies", JSON.stringify(strategies))
    return newStrategy
  },

  async updateStrategy(id: string, updates: Partial<Strategy>): Promise<Strategy | null> {
    const strategies = JSON.parse(localStorage.getItem("strategies") || "[]") as Strategy[]
    const idx = strategies.findIndex((s) => s.id === id)
    if (idx === -1) return null
    const updated: Strategy = { ...strategies[idx], ...updates, updated_at: new Date().toISOString() }
    strategies[idx] = updated
    localStorage.setItem("strategies", JSON.stringify(strategies))
    return updated
  },

  async deleteStrategy(id: string): Promise<void> {
    const strategies = JSON.parse(localStorage.getItem("strategies") || "[]") as Strategy[]
    const filtered = strategies.filter((s) => s.id !== id)
    localStorage.setItem("strategies", JSON.stringify(filtered))
  },

  // Scheduled reports (demo)
  async getScheduledReports(): Promise<ScheduledReport[]> {
    return JSON.parse(localStorage.getItem("scheduled_reports") || "[]")
  },

  async createScheduledReport(payload: Partial<ScheduledReport> & { name: string; type: ScheduledReport["type"] }): Promise<ScheduledReport> {
    const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]") as ScheduledReport[]
    const now = new Date().toISOString()
    const newReport: ScheduledReport = {
      id: crypto.randomUUID(),
      name: payload.name,
      type: payload.type,
      target_id: payload.target_id,
      frequency: payload.frequency as any,
      created_at: now,
    }
    reports.push(newReport)
    localStorage.setItem("scheduled_reports", JSON.stringify(reports))
    return newReport
  },

  async deleteScheduledReport(id: string): Promise<void> {
    const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]") as ScheduledReport[]
    const filtered = reports.filter((r) => r.id !== id)
    localStorage.setItem("scheduled_reports", JSON.stringify(filtered))
  },

  // Rebalance state: track last-run per strategy for calendar scheduling
  async getRebalanceStates(): Promise<RebalanceState[]> {
    return JSON.parse(localStorage.getItem("rebalancer_state") || "[]") as RebalanceState[]
  },

  async getRebalanceState(strategyId: string): Promise<RebalanceState | null> {
    const states = JSON.parse(localStorage.getItem("rebalancer_state") || "[]") as RebalanceState[]
    return states.find((s) => s.strategy_id === strategyId) || null
  },

  async setRebalanceState(strategyId: string, lastRunIso: string): Promise<void> {
    const states = JSON.parse(localStorage.getItem("rebalancer_state") || "[]") as RebalanceState[]
    const idx = states.findIndex((s) => s.strategy_id === strategyId)
    if (idx === -1) states.push({ strategy_id: strategyId, last_run: lastRunIso })
    else states[idx] = { ...states[idx], last_run: lastRunIso }
    localStorage.setItem("rebalancer_state", JSON.stringify(states))
  },

  // Scheduled reports persistence for manager (demo)
  async getScheduledReports(managerId?: string): Promise<any[]> {
    const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]") as any[]
    return managerId ? reports.filter((r) => r.manager_id === managerId) : reports
  },

  async createScheduledReport(payload: { name: string; manager_id?: string; type: string; target_id?: string; frequency?: string }) {
    const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]") as any[]
    const now = new Date().toISOString()
    const item = { id: crypto.randomUUID(), ...payload, created_at: now, updated_at: now, last_run: null }
    reports.push(item)
    localStorage.setItem("scheduled_reports", JSON.stringify(reports))
    return item
  },

  async deleteScheduledReport(id: string) {
    const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]") as any[]
    const filtered = reports.filter((r) => r.id !== id)
    localStorage.setItem("scheduled_reports", JSON.stringify(filtered))
  },
  async setScheduledReportLastRun(id: string, iso: string) {
    const reports = JSON.parse(localStorage.getItem("scheduled_reports") || "[]") as any[]
    const idx = reports.findIndex((r) => r.id === id)
    if (idx === -1) return false
    reports[idx].last_run = iso
    reports[idx].updated_at = new Date().toISOString()
    localStorage.setItem("scheduled_reports", JSON.stringify(reports))
    return true
  },
}
