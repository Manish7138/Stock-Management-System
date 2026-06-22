"use client"

import { useAuth } from "@/lib/auth-context"
import { LocalDB, type MutualFund, type NAVHistory, type FundPerformance } from "@/lib/local-storage/db"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { FundDetailView } from "@/components/investor/fund-detail-view"

export default function FundDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [fund, setFund] = useState<MutualFund | null>(null)
  const [navHistory, setNavHistory] = useState<NAVHistory[]>([])
  const [performance, setPerformance] = useState<FundPerformance[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && id) {
      loadData()
    }
  }, [user, loading, id, router])

  const loadData = async () => {
    try {
      const [fundData, navData, perfData] = await Promise.all([
        LocalDB.getFund(id),
        LocalDB.getNAVHistory(id),
        LocalDB.getFundPerformance(id),
      ])

      if (!fundData) {
        router.push("/dashboard/funds")
        return
      }

      setFund(fundData)
      setNavHistory(navData)
      setPerformance(perfData)
    } catch (error) {
      console.error("Error loading fund details:", error)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fund details...</p>
        </div>
      </div>
    )
  }

  if (!user || !fund) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6">
        <FundDetailView fund={fund} navHistory={navHistory} performance={performance} userId={user.id} />
      </main>
    </div>
  )
}
