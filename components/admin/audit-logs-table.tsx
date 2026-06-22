"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AuditLog {
  id: string
  action: string
  entity_type: string
  entity_id: string
  created_at: string
  profiles: {
    full_name: string
    email: string
  } | null
}

interface AuditLogsTableProps {
  logs: AuditLog[]
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case "INSERT":
        return "bg-green-100 text-green-800"
      case "UPDATE":
        return "bg-blue-100 text-blue-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-900">Action</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-900">Entity Type</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-900">Entity ID</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-600">{formatDate(log.created_at)}</td>
                  <td className="p-4 text-sm text-gray-900">
                    {log.profiles ? (
                      <div>
                        <p className="font-medium">{log.profiles.full_name}</p>
                        <p className="text-xs text-gray-500">{log.profiles.email}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">System</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{log.entity_type}</td>
                  <td className="p-4">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {log.entity_id.substring(0, 8)}...
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {logs.length === 0 && (
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No audit logs available.</p>
        </CardContent>
      )}
    </Card>
  )
}
