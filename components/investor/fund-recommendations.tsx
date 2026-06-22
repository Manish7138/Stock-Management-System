"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { LocalDB, type MutualFund } from "@/lib/local-storage/db"

export function FundRecommendations() {
  const [funds, setFunds] = useState<MutualFund[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFunds = async () => {
      try {
        const allFunds = await LocalDB.getFunds()
        // Filter for recommended funds (e.g., low/medium risk, good performance)
        const recommended = allFunds.filter((f) => f.risk_level !== "high").slice(0, 3)
        setFunds(recommended)
      } catch (error) {
        console.error("Error loading fund recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFunds()
  }, [])

  if (loading) return <div>Loading recommendations...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Funds</CardTitle>
        <CardDescription>Curated selections based on your profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {funds.map((fund) => (
          <Link key={fund.id} href={`/dashboard/funds/${fund.id}`}>
            <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{fund.fund_name}</h4>
                  <p className="text-sm text-gray-600">{fund.objective}</p>
                </div>
                <Badge variant="secondary">{fund.risk_level}</Badge>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                NAV: ₹{fund.nav.toFixed(2)} | Expense Ratio: {fund.expense_ratio}%
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}