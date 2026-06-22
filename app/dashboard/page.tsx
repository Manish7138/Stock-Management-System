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

export default function InvestorDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [investments, setInvestments] = useState<any[]>([])
  const [funds, setFunds] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

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
