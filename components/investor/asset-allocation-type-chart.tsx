"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface AssetAllocationData {
  type: string
  value: number
  displayName: string
}

interface AssetAllocationTypeChartProps {
  data: AssetAllocationData[]
}

const COLORS: Record<string, string> = {
  equity: "#3b82f6",
  debt: "#10b981",
  hybrid: "#f59e0b",
  sector: "#ef4444",
  index: "#06b6d4",
  other: "#8b5cf6",
}

export function AssetAllocationTypeChart({ data }: AssetAllocationTypeChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation by Type</CardTitle>
          <p className="text-sm text-gray-600">Portfolio distribution by fund type</p>
        </CardHeader>
        <CardContent>
          <div className="flex h-80 items-center justify-center text-gray-500">
            No allocation data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : "0"
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.displayName}</p>
          <p className="text-sm text-gray-600">₹{value.toLocaleString("en-IN")}</p>
          <p className="text-sm font-semibold text-gray-900">{percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Allocation by Type</CardTitle>
        <p className="text-sm text-gray-600">Portfolio distribution by fund type</p>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.type] || COLORS.other} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
