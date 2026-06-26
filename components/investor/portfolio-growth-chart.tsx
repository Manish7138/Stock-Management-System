"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface PortfolioGrowthChartProps {
  data: Array<{
    month: string
    value: number
    invested: number
  }>
}

export function PortfolioGrowthChart({ data }: PortfolioGrowthChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.month}</p>
          <p className="text-sm text-blue-600">Portfolio: {formatCurrency(payload[0].value)}</p>
          {payload[1] && <p className="text-sm text-gray-600">Invested: {formatCurrency(payload[1].value)}</p>}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Growth Over Time</CardTitle>
        <p className="text-sm text-gray-600">Monthly portfolio value and invested amount</p>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
                name="Portfolio Value"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="invested"
                stroke="#9ca3af"
                dot={{ fill: "#9ca3af", r: 4 }}
                activeDot={{ r: 6 }}
                name="Total Invested"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
