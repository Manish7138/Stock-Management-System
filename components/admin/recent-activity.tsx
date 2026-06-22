"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LocalDB } from "@/lib/local-storage/db"
import { Activity, TrendingUp, TrendingDown } from "lucide-react"

export function RecentActivity() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        const tx = await LocalDB.getAllTransactions()
        const users = await LocalDB.getAllUsers()

        // Create simple activity logs from transactions
        const activity = tx
          .slice()
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 10)
          .map((t) => ({
            id: t.id,
            actor: users.find((u) => u.id === t.investor_id)?.full_name || "Unknown",
            action: t.transaction_type === "buy" ? "TRANSACTION_BUY" : "TRANSACTION_SELL",
            entity_type: "transaction",
            created_at: t.created_at,
          }))

        if (mounted) setLogs(activity)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getActionIcon = (action: string) => {
    return action === "TRANSACTION_BUY" ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    )
  }

  const getActionStyles = (action: string) => {
    switch (action) {
      case "TRANSACTION_BUY":
        return {
          badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          dot: "bg-green-500",
        }
      case "TRANSACTION_SELL":
        return {
          badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
          dot: "bg-blue-500",
        }
      default:
        return {
          badge: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
          dot: "bg-gray-500",
        }
    }
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Activity className="h-5 w-5 text-purple-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
            </div>
          ) : logs && logs.length > 0 ? (
            logs.map((log, index) => {
              const styles = getActionStyles(log.action)
              return (
                <div
                  key={log.id}
                  className="group relative flex gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 transform hover:translate-x-1 animate-in fade-in slide-in-from-left-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`mt-1 h-2 w-2 rounded-full ${styles.dot} flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{log.actor}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{log.entity_type}</p>
                  </div>
                  <Badge className={`${styles.badge} flex items-center gap-1 flex-shrink-0`}>
                    {getActionIcon(log.action)}
                    {log.action}
                  </Badge>
                </div>
              )
            })
          ) : (
            <p className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
          )}
        </div>
      </CardContent>
      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">Last updated {new Date().toLocaleTimeString()}</p>
      </div>
    </Card>
  )
}
