"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"

interface FundPerformanceData {
  fund_name: string
  returns_1m: number
  returns_3m: number
  returns_1y: number
}

interface FundPerformanceChartProps {
  data: FundPerformanceData[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"]

export function FundPerformanceChart({ data }: FundPerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fund Performance Comparison</CardTitle>
          <p className="text-sm text-gray-600">Returns across different time periods</p>
        </CardHeader>
        <CardContent>
          <div className="flex h-80 items-center justify-center text-gray-500">
            No fund data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.fund_name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.fill }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}%
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
        <CardTitle>Fund Performance Comparison</CardTitle>
        <p className="text-sm text-gray-600">Returns across different time periods</p>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="fund_name" 
                stroke="#6b7280" 
                angle={-45}
                textAnchor="end"
                height={120}
                interval={0}
              />
              <YAxis stroke="#6b7280" label={{ value: "Returns (%)", angle: -90, position: "insideLeft" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="returns_1m" fill={COLORS[0]} name="1 Month" />
              <Bar dataKey="returns_3m" fill={COLORS[1]} name="3 Months" />
              <Bar dataKey="returns_1y" fill={COLORS[2]} name="1 Year" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
