"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface NAVTrendData {
  date: string
  [key: string]: string | number
}

interface NAVTrendChartProps {
  data: NAVTrendData[]
  fundNames: string[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"]

export function NAVTrendChart({ data, fundNames }: NAVTrendChartProps) {
  if (!data || data.length === 0 || !fundNames || fundNames.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>NAV Trend Analysis</CardTitle>
          <p className="text-sm text-gray-600">Net Asset Value trends for your invested funds</p>
        </CardHeader>
        <CardContent>
          <div className="flex h-80 items-center justify-center text-gray-500">
            No NAV data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.date}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ₹{entry.value?.toFixed(2) || "0.00"}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NAV Trend Analysis</CardTitle>
        <p className="text-sm text-gray-600">Net Asset Value trends for your invested funds</p>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#6b7280" label={{ value: "NAV (₹)", angle: -90, position: "insideLeft" }} />
              <Tooltip content={<CustomTooltip />} />
              {fundNames.length <= 5 && <Legend />}
              {fundNames.map((fundName, index) => (
                <Line
                  key={`line-${index}`}
                  type="monotone"
                  dataKey={fundName}
                  stroke={COLORS[index % COLORS.length]}
                  dot={false}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                  isAnimationActive={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
