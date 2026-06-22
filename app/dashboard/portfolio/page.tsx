"use client"

import { useAuth } from "@/lib/auth-context"
import { LocalDB } from "@/lib/local-storage/db"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PortfolioDetails } from "@/components/investor/portfolio-details"

export default function PortfolioPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [investments, setInvestments] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && user.role !== "investor") {
      router.push("/")
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
    } catch (error) {
      console.error("Error loading portfolio:", error)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-gray-600">Detailed view of your investments</p>
        </div>

        <PortfolioDetails investments={investments} />
      </main>
    </div>
  )
}
