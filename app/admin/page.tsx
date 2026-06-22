"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminOverview } from "@/components/admin/admin-overview"
import { SystemStats } from "@/components/admin/system-stats"
import { RecentActivity } from "@/components/admin/recent-activity"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { SystemConfig } from "@/components/admin/system-config"
import { LocalDB } from "@/lib/local-storage/db"

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dataLoading, setDataLoading] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalFunds, setTotalFunds] = useState(0)
  const [totalTransactionVolume, setTotalTransactionVolume] = useState(0)
  const [totalAUM, setTotalAUM] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && user.role !== "admin") {
      router.push("/auth/login")
      return
    }

    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  const loadData = async () => {
    setDataLoading(true)
    try {
      const users = await LocalDB.getAllUsers()
      const funds = await LocalDB.getFunds()
      const transactions = await LocalDB.getAllTransactions()

      setTotalUsers(users.length)
      setTotalFunds(funds.length)

      const totalTxVol = transactions.reduce((sum, t) => (t.status === "completed" ? sum + Number(t.amount) : sum), 0)
      setTotalTransactionVolume(totalTxVol)

      const totalAUM = funds.reduce((sum, f) => sum + Number(f.aum), 0)
      setTotalAUM(totalAUM)
      setUsersList(users)
    } catch (err) {
      console.error(err)
    } finally {
      setDataLoading(false)
    }
  }

  // polling for light "real-time" updates
  useEffect(() => {
    const iv = setInterval(() => {
      if (user) loadData()
    }, 5000)
    return () => clearInterval(iv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const [usersList, setUsersList] = useState<any[]>([])

  const handleDeleteUser = async (id: string) => {
    // simple delete via localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]") as any[]
    const filtered = users.filter((u) => u.id !== id)
    localStorage.setItem("users", JSON.stringify(filtered))
    // refresh local state
    setUsersList(filtered)
  }

  const handleToggleRole = async (id: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]") as any[]
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) return
    users[idx].role = users[idx].role === "admin" ? "investor" : "admin"
    localStorage.setItem("users", JSON.stringify(users))
    setUsersList(users)
  }

  if (loading || dataLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-900">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6">
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Administrator Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Complete system oversight and management</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <AdminOverview
                totalUsers={totalUsers}
                totalFunds={totalFunds}
                totalTransactionVolume={totalTransactionVolume}
                totalAUM={totalAUM}
              />
            </div>
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
              <SystemStats />
            </div>
            <div className="animate-in fade-in slide-in-from-left-4 duration-900">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h2>
                <UserManagementTable users={usersList} onDelete={handleDeleteUser} onToggleRole={handleToggleRole} />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <RecentActivity />
            </div>
            <div className="animate-in fade-in slide-in-from-right-4 duration-700">
              <SystemConfig />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
