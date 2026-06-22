"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useToast } from "@/components/ui/toast"

interface Fund {
  id: string
  fund_name: string
  fund_code: string
  fund_type: "equity" | "debt" | "hybrid" | "index" | "sector"
  risk_level: "low" | "medium" | "high"
  nav: number
  aum: number
  is_active: boolean
  inception_date: string
  objective?: string
  benchmark?: string
  expense_ratio?: number
  minimum_investment?: number
  profiles: {
    full_name: string
    email: string
  } | null
}

interface AdminFundsTableProps {
  funds: Fund[]
}

export function AdminFundsTable({ funds }: AdminFundsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [internalFunds, setInternalFunds] = useState<Fund[]>(funds || [])
  const [editingFund, setEditingFund] = useState<Fund | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setInternalFunds(funds || [])
  }, [funds])

  const filteredFunds = internalFunds.filter(
    (fund) =>
      fund.fund_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.fund_code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (value: number) => {
    const crores = value / 10000000
    return `₹${crores.toFixed(2)} Cr`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search funds by name or code..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Fund Name</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Manager</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-900">NAV</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-900">AUM</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFunds.map((fund) => (
                  <tr key={fund.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{fund.fund_name}</p>
                        <p className="text-xs text-gray-500">{fund.fund_code}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{fund.fund_type}</Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{fund.profiles?.full_name || "Unassigned"}</td>
                    <td className="p-4 text-right font-medium">₹{Number(fund.nav).toFixed(2)}</td>
                    <td className="p-4 text-right text-sm text-gray-600">{formatCurrency(Number(fund.aum))}</td>
                    <td className="p-4">
                      <Badge className={fund.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {fund.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingFund(fund)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredFunds.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No funds found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      {editingFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditingFund(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-md shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Edit Fund</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Fund Name</label>
                <Input value={editingFund.fund_name} onChange={(e) => setEditingFund({ ...editingFund, fund_name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Fund Code</label>
                <Input value={editingFund.fund_code} onChange={(e) => setEditingFund({ ...editingFund, fund_code: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Type</label>
                <select
                  className="w-full rounded-md border p-2"
                  value={editingFund.fund_type}
                  onChange={(e) => setEditingFund({ ...editingFund, fund_type: e.target.value as Fund["fund_type"] })}
                >
                  <option value="equity">Equity</option>
                  <option value="debt">Debt</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="index">Index</option>
                  <option value="sector">Sector</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Risk Level</label>
                <select
                  className="w-full rounded-md border p-2"
                  value={editingFund.risk_level}
                  onChange={(e) => setEditingFund({ ...editingFund, risk_level: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">NAV</label>
                <Input value={String(editingFund.nav)} onChange={(e) => setEditingFund({ ...editingFund, nav: Number(e.target.value || 0) })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">AUM</label>
                <Input value={String(editingFund.aum)} onChange={(e) => setEditingFund({ ...editingFund, aum: Number(e.target.value || 0) })} />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-600">Objective</label>
                <Input value={editingFund.objective || ""} onChange={(e) => setEditingFund({ ...editingFund, objective: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-600">Benchmark</label>
                <Input value={editingFund.benchmark || ""} onChange={(e) => setEditingFund({ ...editingFund, benchmark: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Expense Ratio</label>
                <Input value={String(editingFund.expense_ratio ?? 0)} onChange={(e) => setEditingFund({ ...editingFund, expense_ratio: Number(e.target.value || 0) })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Minimum Investment</label>
                <Input value={String(editingFund.minimum_investment ?? 0)} onChange={(e) => setEditingFund({ ...editingFund, minimum_investment: Number(e.target.value || 0) })} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="active"
                  type="checkbox"
                  checked={Boolean(editingFund.is_active)}
                  onChange={(e) => setEditingFund({ ...editingFund, is_active: e.target.checked })}
                />
                <label htmlFor="active" className="text-sm text-gray-700">Active</label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditingFund(null)}>Cancel</Button>
              <Button
                onClick={async () => {
                  try {
                    setSaving(true)
                    const stored = JSON.parse(localStorage.getItem("mutual_funds") || "[]") as any[]
                    const idx = stored.findIndex((f) => f.id === editingFund.id)
                    if (idx === -1) {
                      toast({ title: "Save failed", description: "Fund not found in storage" })
                      setSaving(false)
                      return
                    }
                    const updated = { ...stored[idx], ...editingFund, updated_at: new Date().toISOString() }
                    stored[idx] = updated
                    localStorage.setItem("mutual_funds", JSON.stringify(stored))
                    // update local UI
                    setInternalFunds((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
                    toast({ title: "Saved", description: `${updated.fund_name} updated` })
                    setEditingFund(null)
                  } catch (e) {
                    console.error(e)
                    toast({ title: "Save failed", description: "Could not save fund" })
                  } finally {
                    setSaving(false)
                  }
                }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
