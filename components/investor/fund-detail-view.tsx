"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { LocalDB } from "@/lib/local-storage/db"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast"
import { ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"

interface FundDetailViewProps {
  fund: {
    id: string
    fund_name: string
    fund_code: string
    fund_type: string
    objective: string
    benchmark: string
    risk_level: string
    nav: number
    expense_ratio: number
    minimum_investment: number
    aum: number
    inception_date: string
    fund_performance?: Array<{
      period: string
      returns: number
      sharpe_ratio: number
    }>
    profiles?: {
      full_name: string
    }
  }
  navHistory: Array<{
    nav: number
    date: string
  }>
  userId: string
}

export function FundDetailView({ fund, navHistory, userId }: FundDetailViewProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const chartData = navHistory
    .slice()
    .reverse()
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      nav: Number(item.nav),
    }))

  const handleInvest = async () => {
    if (isLoading) return
    if (!amount || Number.parseFloat(amount) < Number(fund.minimum_investment)) {
      setError(`Minimum investment is ${formatCurrency(Number(fund.minimum_investment))}`)
      return
    }
    // Redirect to payment checkout to select payment method and complete payment
    const params = new URLSearchParams({ fundId: fund.id, amount: String(Number.parseFloat(amount)), userId })
    setIsLoading(true)
    try {
      toast({ title: "Redirecting to checkout", description: "You will be taken to the payment page." })
    } catch (e) {
      // ignore
    }
    router.push(`/dashboard/payments/checkout?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/funds">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{fund.fund_name}</CardTitle>
              <p className="mt-2 text-gray-500">{fund.fund_code}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-base">
                {fund.fund_type}
              </Badge>
              <Badge
                className={`text-base ${
                  fund.risk_level === "high"
                    ? "bg-red-100 text-red-800"
                    : fund.risk_level === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {fund.risk_level} risk
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{fund.objective}</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Current NAV</p>
                <p className="text-3xl font-bold text-blue-600">₹{Number(fund.nav).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Minimum Investment</p>
                <p className="text-lg font-semibold">{formatCurrency(Number(fund.minimum_investment))}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expense Ratio</p>
                <p className="text-lg font-semibold">{Number(fund.expense_ratio).toFixed(2)}%</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">AUM</p>
                <p className="text-lg font-semibold">₹{(Number(fund.aum) / 10000000).toFixed(2)} Cr</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Benchmark</p>
                <p className="text-lg font-semibold">{fund.benchmark || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fund Manager</p>
                <p className="text-lg font-semibold">{fund.profiles?.full_name || "Unassigned"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                NAV History (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="nav" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invest Now</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder={`Min. ${formatCurrency(Number(fund.minimum_investment))}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {amount && (
                <p className="text-sm text-gray-600">
                  Units: {(Number.parseFloat(amount) / Number(fund.nav)).toFixed(4)}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button onClick={handleInvest} className="w-full" disabled={isLoading || !amount}>
              {isLoading ? "Processing..." : "Invest"}
            </Button>

            <p className="text-xs text-gray-500">
              By investing, you agree to the terms and conditions of the mutual fund.
            </p>
          </CardContent>
        </Card>
      </div>

      {fund.fund_performance && fund.fund_performance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {fund.fund_performance
                .filter((p) => ["1M", "3M", "6M", "1Y"].includes(p.period))
                .map((perf) => (
                  <div key={perf.period} className="rounded-lg border p-4">
                    <p className="text-sm text-gray-600">{perf.period} Returns</p>
                    <p
                      className={`text-2xl font-bold ${Number(perf.returns) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {Number(perf.returns) >= 0 ? "+" : ""}
                      {Number(perf.returns).toFixed(2)}%
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Sharpe: {Number(perf.sharpe_ratio).toFixed(2)}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
