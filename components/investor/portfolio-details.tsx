"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowUp, ArrowDown } from "lucide-react"

interface Investment {
  id: string
  units: number
  average_nav: number
  total_invested: number
  current_value: number
  mutual_funds: {
    id: string
    fund_name: string
    fund_code: string
    fund_type: string
    risk_level: string
    nav: number
  }
}

interface PortfolioDetailsProps {
  investments: Investment[]
}

export function PortfolioDetails({ investments }: PortfolioDetailsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const totalPortfolio = investments.reduce((sum, inv) => sum + Number(inv.current_value), 0)

  return (
    <div className="space-y-6">
      {investments.length > 0 ? (
        investments.map((investment) => {
          const gainLoss = Number(investment.current_value) - Number(investment.total_invested)
          const gainLossPercent = (gainLoss / Number(investment.total_invested)) * 100
          const allocationPercent = (Number(investment.current_value) / totalPortfolio) * 100

          return (
            <Card key={investment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{investment.mutual_funds.fund_name}</CardTitle>
                    <p className="mt-1 text-sm text-gray-500">{investment.mutual_funds.fund_code}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{investment.mutual_funds.fund_type}</Badge>
                    <Badge
                      className={
                        investment.mutual_funds.risk_level === "high"
                          ? "bg-red-100 text-red-800"
                          : investment.mutual_funds.risk_level === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }
                    >
                      {investment.mutual_funds.risk_level} risk
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Units Held</p>
                      <p className="text-2xl font-bold">{Number(investment.units).toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average NAV</p>
                      <p className="text-lg font-semibold">₹{Number(investment.average_nav).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current NAV</p>
                      <p className="text-lg font-semibold">₹{Number(investment.mutual_funds.nav).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Invested</p>
                      <p className="text-2xl font-bold">{formatCurrency(Number(investment.total_invested))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Value</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(Number(investment.current_value))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gain/Loss</p>
                      <div
                        className={`flex items-center gap-2 text-xl font-bold ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {gainLoss >= 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                        <span>{formatCurrency(Math.abs(gainLoss))}</span>
                        <span className="text-sm">({gainLossPercent.toFixed(2)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-600">Portfolio Allocation</span>
                    <span className="font-medium">{allocationPercent.toFixed(2)}%</span>
                  </div>
                  <Progress value={allocationPercent} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No investments yet. Start exploring funds to build your portfolio!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
