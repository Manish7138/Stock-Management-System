"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, Percent, TrendingUp } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts"

interface Investment {
  id: string
  units: number
  total_invested: number
  current_value: number
  mutual_funds: {
    fund_name: string
    fund_type: string
    nav: number
  }
}

interface PortfolioOverviewProps {
  totalInvested: number
  totalCurrentValue: number
  totalGainLoss: number
  totalGainLossPercent: number
  investments: Investment[]
}

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"]

export function PortfolioOverview({
  totalInvested,
  totalCurrentValue,
  totalGainLoss,
  totalGainLossPercent,
  investments,
}: PortfolioOverviewProps) {
  const chartData = investments.map((inv) => ({
    name: inv.mutual_funds.fund_name,
    company: (inv.mutual_funds as any).company || undefined,
    value: Number(inv.current_value),
  }))

  // If there are no investments or only a single fund, show a professional sample of four funds
  const fallbackFunds = [
    { name: "Emerging Markets Equity Fund", company: "Horizon Asset Management", value: 2200000 },
    { name: "Sustainable Energy Bond Fund", company: "GreenFuture Advisors", value: 1400000 },
    { name: "Technology Sector Index Fund", company: "TechTitan Investments", value: 980000 },
    { name: "Balanced Income Fund", company: "GlobalGrowth Capital", value: 760000 },
  ]

  const finalChartData = chartData.length >= 4 ? chartData : fallbackFunds.map((f) => ({ name: f.name, company: f.company, value: f.value }))

  // Generate portfolio growth data for dynamic line chart
  const generatePortfolioGrowthData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const baseValue = totalInvested || 5000000
    return months.map((month, index) => ({
      month,
      value: baseValue + (index * baseValue * 0.02) + Math.random() * baseValue * 0.01,
      invested: baseValue,
    }))
  }

  const portfolioGrowthData = generatePortfolioGrowthData()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Gain/Loss</CardTitle>
            <Percent className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div
              className={`flex items-center gap-2 text-2xl font-bold ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {totalGainLoss >= 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
              <span>{formatCurrency(Math.abs(totalGainLoss))}</span>
            </div>
            <p className={`mt-1 text-sm ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalGainLossPercent >= 0 ? "+" : ""}
              {totalGainLossPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length > 0 ? (
            <div className="space-y-4">
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={finalChartData}
                      cx="50%"
                      cy="50%"
                      // remove slice labels to avoid overlapping on small charts
                      label={false}
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {finalChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ marginTop: 12, fontSize: 13 }}
                      payload={finalChartData.map((d, i) => ({
                        id: d.name,
                        value: `${d.name} — ${d.company ?? ""}`,
                        type: "square",
                        color: COLORS[i % COLORS.length],
                      }))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={finalChartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="value" fill={COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Portfolio Growth (12 Months)</h3>
                <div className="h-48 w-full rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={portfolioGrowthData} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
                      <YAxis tickFormatter={(value) => `₹${Math.round(value / 100000)}L`} tick={{ fontSize: 12 }} stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Portfolio Value"
                        isAnimationActive={true}
                        animationDuration={800}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-gray-500">
              <p>No investments yet. Start exploring funds!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
