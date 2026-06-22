"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp } from "lucide-react"

export function SystemStats() {
  // Mock data for demonstration
  const monthlyData = [
    { month: "Jan", transactions: 45, newUsers: 12 },
    { month: "Feb", transactions: 52, newUsers: 18 },
    { month: "Mar", transactions: 61, newUsers: 15 },
    { month: "Apr", transactions: 58, newUsers: 22 },
    { month: "May", transactions: 70, newUsers: 28 },
    { month: "Jun", transactions: 85, newUsers: 35 },
  ]

  return (
    <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            System Activity
          </CardTitle>
          <span className="text-xs font-medium px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">Last 6 months</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar dataKey="transactions" fill="url(#colorTransactions)" name="Transactions" radius={[8, 8, 0, 0]} isAnimationActive={true} animationDuration={800} />
            <Bar dataKey="newUsers" fill="url(#colorUsers)" name="New Users" radius={[8, 8, 0, 0]} isAnimationActive={true} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
