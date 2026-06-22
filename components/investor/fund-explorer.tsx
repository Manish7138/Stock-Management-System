"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Fund {
  id: string
  fund_name: string
  fund_code: string
  fund_type: string
  objective: string
  risk_level: string
  nav: number
  expense_ratio: number
  minimum_investment: number
  aum: number
}

interface FundExplorerProps {
  funds: Fund[]
}

export function FundExplorer({ funds }: FundExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedRisk, setSelectedRisk] = useState<string>("all")

  const filteredFunds = funds.filter((fund) => {
    const matchesSearch =
      fund.fund_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.fund_code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || fund.fund_type === selectedType
    const matchesRisk = selectedRisk === "all" || fund.risk_level === selectedRisk

    return matchesSearch && matchesType && matchesRisk
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatAUM = (value: number) => {
    const crores = value / 10000000
    return `₹${crores.toFixed(2)} Cr`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search funds..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Fund Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="equity">Equity</SelectItem>
                <SelectItem value="debt">Debt</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="index">Index</SelectItem>
                <SelectItem value="sector">Sector</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedRisk} onValueChange={setSelectedRisk}>
              <SelectTrigger>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFunds.map((fund) => (
          <Card key={fund.id} className="flex flex-col">
            <CardContent className="flex-1 p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-gray-900">{fund.fund_name}</h3>
                  <p className="text-sm text-gray-500">{fund.fund_code}</p>
                </div>
                <Badge variant="outline">{fund.fund_type}</Badge>
              </div>

              <p className="mb-4 text-sm text-gray-600 line-clamp-2">{fund.objective}</p>

              <div className="mb-4 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current NAV:</span>
                  <span className="font-semibold">₹{Number(fund.nav).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Min. Investment:</span>
                  <span className="font-medium">{formatCurrency(Number(fund.minimum_investment))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expense Ratio:</span>
                  <span className="font-medium">{Number(fund.expense_ratio).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">AUM:</span>
                  <span className="font-medium">{formatAUM(Number(fund.aum))}</span>
                </div>
              </div>

              <div className="mb-4">
                <Badge
                  className={
                    fund.risk_level === "high"
                      ? "bg-red-100 text-red-800"
                      : fund.risk_level === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }
                >
                  {fund.risk_level} risk
                </Badge>
              </div>

              <Link href={`/dashboard/funds/${fund.id}`} className="block">
                <Button className="w-full gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFunds.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No funds found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
