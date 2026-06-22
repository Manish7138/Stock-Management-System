"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"

interface Transaction {
  id: string
  transaction_type: string
  units: number
  nav: number
  amount: number
  status: string
  transaction_date: string
  notes: string | null
  mutual_funds: {
    fund_name: string
    fund_code: string
  }
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        {transactions.length > 0 ? (
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-6 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-full p-3 ${
                      transaction.transaction_type === "buy" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {transaction.transaction_type === "buy" ? (
                      <ArrowDownCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <ArrowUpCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{transaction.mutual_funds.fund_name}</h4>
                    <p className="text-sm text-gray-500">{transaction.mutual_funds.fund_code}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {Number(transaction.units).toFixed(4)} units @ ₹{Number(transaction.nav).toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{formatDate(transaction.transaction_date)}</p>
                    {transaction.notes && <p className="mt-1 text-xs italic text-gray-500">{transaction.notes}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xl font-bold ${
                      transaction.transaction_type === "buy" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.transaction_type === "buy" ? "-" : "+"}
                    {formatCurrency(Number(transaction.amount))}
                  </p>
                  <Badge className={`mt-2 ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No transactions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
