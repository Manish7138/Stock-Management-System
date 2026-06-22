"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminFundsTable } from "@/components/admin/admin-funds-table"
import { LocalDB } from "@/lib/local-storage/db"

export default function AdminFundsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dataLoading, setDataLoading] = useState(true)
  const [funds, setFunds] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && user.role !== "admin") {
      router.push("/auth/login")
      return
    }

    if (user) loadFunds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  const loadFunds = async () => {
    setDataLoading(true)
    try {
      const all = await LocalDB.getFunds()
      setFunds(all)
    } catch (err) {
      console.error(err)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || dataLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fund Management</h1>
            <p className="text-gray-600">Manage mutual funds and assignments</p>
          </div>
        </div>

        <AdminFundsTable funds={funds || []} />
      </main>
    </div>
  )
}
