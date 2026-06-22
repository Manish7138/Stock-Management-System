"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LocalDB } from "@/lib/local-storage/db"

export default function AdminReportsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<any[]>([])
  const [name, setName] = useState("")
  const [type, setType] = useState<"transactions" | "fund" | "strategy">("transactions")
  const [targetId, setTargetId] = useState<string | undefined>(undefined)
  const [funds, setFunds] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }
    if (user && user.role !== "admin") {
      router.push("/auth/login")
      return
    }
    if (user) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  const load = async () => {
    try {
      const r = await LocalDB.getScheduledReports()
      setReports(r || [])
      const f = await LocalDB.getFunds()
      setFunds(f || [])
    } catch (e) {
      console.error(e)
    }
  }

  const create = async () => {
    if (!name) return alert("Please enter a name for the report")
    try {
      await LocalDB.createScheduledReport({ name, type, target_id: targetId })
      setName("")
      setTargetId(undefined)
      await load()
    } catch (e) {
      console.error(e)
      alert("Failed to create report")
    }
  }

  const runReport = async (r: any) => {
    try {
      if (r.type === "transactions") {
        const tx = await LocalDB.getAllTransactions()
        const csv = ["id,investor_id,fund_id,type,amount,units,nav,status,created_at", ...tx.map((t: any) => `${t.id},${t.investor_id},${t.fund_id},${t.transaction_type},${t.amount},${t.units},${t.nav},${t.status},${t.created_at}`)].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${r.name || 'transactions'}.csv`
        a.click()
        URL.revokeObjectURL(url)
      } else if (r.type === "fund") {
        const fund = await LocalDB.getFund(r.target_id)
        if (!fund) return alert("Fund not found")
        const perf = await LocalDB.getFundPerformance(fund.id)
        const csv = ["period,returns,sharpe,alpha,beta,stdev", ...perf.map((p: any) => `${p.period},${p.returns},${p.sharpe_ratio},${p.alpha},${p.beta},${p.standard_deviation}`)].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${r.name || 'fund-report'}.csv`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        alert("Unsupported report type in this demo")
      }

      await LocalDB.setScheduledReportLastRun?.(r.id, new Date().toISOString())
      await load()
    } catch (e) {
      console.error(e)
      alert("Failed to run report")
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Delete this scheduled report?")) return
    await LocalDB.deleteScheduledReport(id)
    await load()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Reports</h1>
          <p className="text-gray-600">Create and run scheduled reports (demo)</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.length === 0 && <p className="text-sm text-gray-500">No scheduled reports</p>}
                  {reports.map((r) => (
                    <div key={r.id} className="flex items-center justify-between border p-3 rounded">
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-gray-500">Type: {r.type} {r.target_id ? ` • target: ${r.target_id}` : ''}</div>
                        <div className="text-xs text-gray-400">Last run: {r.last_run || 'never'}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => runReport(r)}>Run</Button>
                        <Button variant="destructive" onClick={() => remove(r.id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create Scheduled Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Input placeholder="Report name" value={name} onChange={(e) => setName(e.target.value)} />
                  <select value={type} onChange={(e) => setType(e.target.value as any)} className="border p-1 rounded w-full">
                    <option value="transactions">Transactions</option>
                    <option value="fund">Fund Performance</option>
                  </select>
                  {type === "fund" && (
                    <select className="border p-1 rounded w-full" value={targetId || ''} onChange={(e) => setTargetId(e.target.value || undefined)}>
                      <option value="">-- select fund --</option>
                      {funds.map((f) => (
                        <option key={f.id} value={f.id}>{f.fund_name}</option>
                      ))}
                    </select>
                  )}
                  <div className="flex justify-end">
                    <Button onClick={create}>Create</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Help / Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">This demo stores scheduled reports in localStorage. Use Run to download CSVs.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
