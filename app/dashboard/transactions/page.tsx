"use client"

import { useAuth } from "@/lib/auth-context"
import { LocalDB } from "@/lib/local-storage/db"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { TransactionHistory } from "@/components/investor/transaction-history"

export default function TransactionsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
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
      const [transactionsData, fundsData] = await Promise.all([LocalDB.getTransactions(user!.id), LocalDB.getFunds()])

      // Join transactions with fund data
      const transactionsWithFunds = transactionsData.map((txn) => ({
        ...txn,
        mutual_funds: fundsData.find((f) => f.id === txn.fund_id),
      }))

      setTransactions(transactionsWithFunds)
    } catch (error) {
      console.error("Error loading transactions:", error)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600">Complete record of all your transactions</p>
        </div>

        <TransactionHistory transactions={transactions} />
      </main>
    </div>
  )
}
