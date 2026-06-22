"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { LocalDB } from "@/lib/local-storage/db"

export function RecentTransactions({ userId }: { userId: string }) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        const tx = await LocalDB.getTransactions(userId)
        const funds = await LocalDB.getFunds()
        const enriched = tx.map((t) => ({ ...t, mutual_funds: funds.find((f) => f.id === t.fund_id) }))
        if (mounted) setTransactions(enriched.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [userId])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-full p-2 ${transaction.transaction_type === "buy" ? "bg-green-100" : "bg-red-100"}`}
                  >
                    {transaction.transaction_type === "buy" ? (
                      <ArrowDownCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowUpCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.mutual_funds?.fund_name}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.units} units @ {formatCurrency(Number(transaction.nav))}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(transaction.processed_at || transaction.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${transaction.transaction_type === "buy" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.transaction_type === "buy" ? "-" : "+"}
                    {formatCurrency(Number(transaction.amount))}
                  </p>
                  <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No transactions yet</p>
        )}
      </CardContent>
    </Card>
  )
}
