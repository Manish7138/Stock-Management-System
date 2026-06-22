"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { AuditLogsTable } from "@/components/admin/audit-logs-table"
import { LocalDB } from "@/lib/local-storage/db"

export default function AuditLogsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dataLoading, setDataLoading] = useState(true)
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && user.role !== "admin") {
      router.push("/auth/login")
      return
    }

    if (user) loadLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  const loadLogs = async () => {
    setDataLoading(true)
    try {
      const tx = await LocalDB.getAllTransactions()
      const users = await LocalDB.getAllUsers()

      const mapped = tx
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 100)
        .map((t) => ({
          id: t.id,
          action: "TRANSACTION",
          entity_type: "transaction",
          entity_id: t.id,
          created_at: t.created_at,
          profiles: users.find((u) => u.id === t.investor_id)
            ? { full_name: users.find((u) => u.id === t.investor_id)!.full_name, email: users.find((u) => u.id === t.investor_id)!.email }
            : null,
        }))

      setLogs(mapped)
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">Complete audit trail of system activities</p>
        </div>

        <AuditLogsTable logs={logs || []} />
      </main>
    </div>
  )
}
