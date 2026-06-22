"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { LocalDB } from "@/lib/local-storage/db"

export default function UserManagementPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dataLoading, setDataLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && user.role !== "admin") {
      router.push("/auth/login")
      return
    }

    if (user) loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  const loadUsers = async () => {
    setDataLoading(true)
    try {
      const all = await LocalDB.getAllUsers()
      setUsers(all)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-50 dark:from-slate-900 dark:via-cyan-900/20 dark:to-slate-900">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6">
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">User Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <UserManagementTable users={users || []} />
        </div>
      </main>
    </div>
  )
}
