"use client"

import { useAuth } from "@/lib/auth-context"
import { LocalDB, type MutualFund } from "@/lib/local-storage/db"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { FundExplorer } from "@/components/investor/fund-explorer"

export default function FundsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [funds, setFunds] = useState<MutualFund[]>([])
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
      const fundsData = await LocalDB.getFunds()
      setFunds(fundsData)
    } catch (error) {
      console.error("Error loading funds:", error)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading funds...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Explore Mutual Funds</h1>
          <p className="text-gray-600">Browse and invest in available mutual funds</p>
        </div>

        <FundExplorer funds={funds} />
      </main>
    </div>
  )
}
