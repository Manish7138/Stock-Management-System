"use client"

import { useAuth } from "@/lib/auth-context"
import { LocalDB } from "@/lib/local-storage/db"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PortfolioOverview } from "@/components/investor/portfolio-overview"
import { RecentTransactions } from "@/components/investor/recent-transactions"
import { FundRecommendations } from "@/components/investor/fund-recommendations"
import { QuickActions } from "@/components/investor/quick-actions"
import { DashboardHeader } from "@/components/dashboard-header"
import { PortfolioGrowthChart } from "@/components/investor/portfolio-growth-chart"
import { FundPerformanceChart } from "@/components/investor/fund-performance-chart"
import { AssetAllocationTypeChart } from "@/components/investor/asset-allocation-type-chart"
import { NAVTrendChart } from "@/components/investor/nav-trend-chart"

export default function InvestorDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [investments, setInvestments] = useState<any[]>([])
  const [funds, setFunds] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [portfolioGrowthData, setPortfolioGrowthData] = useState<any[]>([])
  const [fundPerformanceData, setFundPerformanceData] = useState<any[]>([])
  const [assetAllocationData, setAssetAllocationData] = useState<any[]>([])
  const [navTrendData, setNavTrendData] = useState<any[]>([])
  const [fundNames, setFundNames] = useState<string[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && user.role !== "investor") {
      if (user.role === "admin") {
        router.push("/admin")
      }
      return
    }

    if (user) {
      loadData()
    }
  }, [user, loading, router])

  const loadData = async () => {
    try {
      const [investmentsData, fundsData] = await Promise.all([LocalDB.getInvestments(user!.id), LocalDB.getFunds()])

      // Join investments with fund data
      const investmentsWithFunds = investmentsData.map((inv) => ({
        ...inv,
        mutual_funds: fundsData.find((f) => f.id === inv.fund_id),
      }))

      setInvestments(investmentsWithFunds)
      setFunds(fundsData)

      // Generate portfolio growth data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const totalInvested = investmentsWithFunds.reduce((sum, inv) => sum + Number(inv.total_invested), 0)
      const baseValue = totalInvested || 5000000
      const growthData = months.map((month, index) => ({
        month,
        value: baseValue + (index * baseValue * 0.02) + Math.random() * baseValue * 0.01,
        invested: baseValue,
      }))
      setPortfolioGrowthData(growthData)

      // Calculate fund performance and asset allocation
      const performanceData: any[] = []
      const allocationByType: Record<string, number> = {}
      const navDataByFund: Record<string, any[]> = {}
      const investedFundNames: string[] = []

      for (const inv of investmentsWithFunds) {
        const fund = inv.mutual_funds
        if (!fund) continue

        investedFundNames.push(fund.fund_name)

        // Track allocation by type
        allocationByType[fund.fund_type] = (allocationByType[fund.fund_type] || 0) + Number(inv.current_value)

        // Fetch performance metrics for this fund
        try {
          const performance = await LocalDB.getFundPerformance(fund.id)
          const perf1m = performance.find((p) => p.period === "1M")?.returns || 0
          const perf3m = performance.find((p) => p.period === "3M")?.returns || 0
          const perf1y = performance.find((p) => p.period === "1Y")?.returns || 0

          performanceData.push({
            fund_name: fund.fund_name.substring(0, 15) + (fund.fund_name.length > 15 ? "..." : ""),
            returns_1m: perf1m,
            returns_3m: perf3m,
            returns_1y: perf1y,
          })
        } catch (e) {
          console.debug("Could not fetch performance for fund", fund.id)
        }

        // Fetch NAV history for this fund
        try {
          const navHistory = await LocalDB.getNAVHistory(fund.id)
          if (navHistory.length > 0) {
            navDataByFund[fund.fund_name] = navHistory
          }
        } catch (e) {
          console.debug("Could not fetch NAV history for fund", fund.id)
        }
      }

      setFundPerformanceData(performanceData)
      setFundNames(investedFundNames)

      // Convert allocation by type to chart format
      const allocationChartData = Object.entries(allocationByType).map(([type, value]) => ({
        type,
        value,
        displayName: type.charAt(0).toUpperCase() + type.slice(1),
      }))
      setAssetAllocationData(allocationChartData)

      // Merge NAV data into a single array for multi-line chart
      if (Object.keys(navDataByFund).length > 0) {
        const dates = new Set<string>()
        Object.values(navDataByFund).forEach((history) => {
          history.forEach((h) => dates.add(h.date))
        })

        const sortedDates = Array.from(dates).sort()
        // Show last 14 days
        const lastDates = sortedDates.slice(-14)

        const mergedNavData = lastDates.map((date) => {
          const dataPoint: any = { date }
          Object.entries(navDataByFund).forEach(([fundName, history]) => {
            const nav = history.find((h) => h.date === date)
            dataPoint[fundName] = nav?.nav || null
          })
          return dataPoint
        })
        setNavTrendData(mergedNavData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Calculate total portfolio value
  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.total_invested), 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + Number(inv.current_value), 0)
  const totalGainLoss = totalCurrentValue - totalInvested
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Investment Dashboard</h1>
          <p className="text-gray-600">Track your portfolio and manage investments</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PortfolioOverview
              totalInvested={totalInvested}
              totalCurrentValue={totalCurrentValue}
              totalGainLoss={totalGainLoss}
              totalGainLossPercent={totalGainLossPercent}
              investments={investments}
            />
            <div className="mt-6">
              <RecentTransactions userId={user.id} />
            </div>

            {/* Interactive Charts Section */}
            <div className="mt-6 space-y-6">
              <PortfolioGrowthChart data={portfolioGrowthData} />

              {fundPerformanceData.length > 0 && <FundPerformanceChart data={fundPerformanceData} />}

              {assetAllocationData.length > 0 && <AssetAllocationTypeChart data={assetAllocationData} />}

              {navTrendData.length > 0 && fundNames.length > 0 && <NAVTrendChart data={navTrendData} fundNames={fundNames} />}
            </div>
          </div>
          <div className="space-y-6">
            <QuickActions />
            <FundRecommendations riskTolerance="medium" hasCompletedAssessment={false} />
          </div>
        </div>
      </main>
    </div>
  )
}
