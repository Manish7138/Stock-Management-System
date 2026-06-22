"use client"

import { useAuth } from "@/lib/auth-context"
import { LocalDB } from "@/lib/local-storage/db"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { ArrowLeft, TrendingDown, Check } from "lucide-react"
import Link from "next/link"

interface Investment {
  id: string
  fund_id: string
  units: number
  total_invested: number
  current_value: number
  mutual_funds: {
    id: string
    fund_name: string
    fund_type: string
    nav: number
    company?: string
  }
}

export default function SellStocksPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [selectedFund, setSelectedFund] = useState<Investment | null>(null)
  const [quantityToSell, setQuantityToSell] = useState<string>("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && user.role !== "investor") {
      if (user.role === "admin") {
        router.push("/admin")
      }
      return
    }

    if (user) {
      loadData()
    }
  }, [user, loading, router])

  const loadData = async () => {
    try {
      const [investmentsData, fundsData] = await Promise.all([
        LocalDB.getInvestments(user!.id),
        LocalDB.getFunds(),
      ])

      const investmentsWithFunds = investmentsData.map((inv) => ({
        ...inv,
        mutual_funds: fundsData.find((f) => f.id === inv.fund_id),
      }))

      setInvestments(investmentsWithFunds)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setDataLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleFundSelect = (fundId: string) => {
    const fund = investments.find((inv) => inv.fund_id === fundId)
    setSelectedFund(fund || null)
    setQuantityToSell("")
    setSuccessMessage("")
  }

  const calculateProceeds = () => {
    if (!selectedFund || !quantityToSell) return 0
    const quantity = parseFloat(quantityToSell)
    if (isNaN(quantity) || quantity <= 0) return 0
    return quantity * selectedFund.mutual_funds.nav
  }

  const validateSale = () => {
    if (!selectedFund || !quantityToSell) {
      alert("Please select a fund and enter quantity")
      return false
    }

    const quantity = parseFloat(quantityToSell)
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity")
      return false
    }

    if (quantity > selectedFund.units) {
      alert(`You only have ${selectedFund.units} units. Please enter a lower quantity.`)
      return false
    }

    return true
  }

  const handleSellConfirm = async () => {
    if (!validateSale() || !selectedFund) return

    setIsProcessing(true)
    try {
      const quantity = parseFloat(quantityToSell)
      const proceeds = calculateProceeds()

      // Create a sell transaction in local storage
      const sellRecord = {
        id: `sell-${Date.now()}`,
        user_id: user!.id,
        fund_id: selectedFund.fund_id,
        transaction_type: "SELL",
        units: quantity,
        amount: proceeds,
        nav: selectedFund.mutual_funds.nav,
        transaction_date: new Date().toISOString(),
      }

      // Save the transaction (assuming LocalDB has this method)
      if ((LocalDB as any).addTransaction) {
        await (LocalDB as any).addTransaction(sellRecord)
      }

      setSuccessMessage(`Successfully sold ${quantity} units of ${selectedFund.mutual_funds.fund_name}`)
      setShowConfirmDialog(false)
      setSelectedFund(null)
      setQuantityToSell("")

      // Reload data to show updated balance
      setTimeout(() => {
        loadData()
        setSuccessMessage("")
      }, 2000)
    } catch (error) {
      console.error("Error processing sale:", error)
      alert("Error processing sale. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sell Stocks</h1>
            <p className="text-gray-600">Liquidate your investments</p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200">
            <Check className="h-5 w-5" />
            <p>{successMessage}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {investments.length === 0 ? (
                  <div className="flex h-40 items-center justify-center text-gray-500">
                    <p>No investments to sell. Start exploring and investing in funds!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {investments.map((investment) => (
                      <div
                        key={investment.id}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                          selectedFund?.id === investment.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleFundSelect(investment.fund_id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {investment.mutual_funds.fund_name}
                            </h3>
                            <p className="text-sm text-gray-600">{investment.mutual_funds.company}</p>
                            <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Units Held</p>
                                <p className="font-semibold">{investment.units}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Current NAV</p>
                                <p className="font-semibold">{formatCurrency(investment.mutual_funds.nav)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Current Value</p>
                                <p className="font-semibold">{formatCurrency(investment.current_value)}</p>
                              </div>
                            </div>
                          </div>
                          {selectedFund?.id === investment.id && (
                            <div className="text-blue-600">
                              <Check className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Sell Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedFund ? (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Selected Fund</Label>
                      <p className="mt-1 font-semibold text-gray-900">
                        {selectedFund.mutual_funds.fund_name}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                        Quantity to Sell (Units)
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="0"
                        value={quantityToSell}
                        onChange={(e) => setQuantityToSell(e.target.value)}
                        max={selectedFund.units}
                        min="0"
                        step="0.01"
                        className="mt-1"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Available: {selectedFund.units} units
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">NAV per Unit</span>
                        <span className="font-semibold">{formatCurrency(selectedFund.mutual_funds.nav)}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-sm text-gray-600">Estimated Proceeds</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(calculateProceeds())}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => setShowConfirmDialog(true)}
                      disabled={!quantityToSell || parseFloat(quantityToSell) <= 0}
                    >
                      Proceed to Sell
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Select a fund from the list to proceed with selling</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sale</AlertDialogTitle>
            <AlertDialogDescription asChild>
              {selectedFund && (
                <div className="mt-4 space-y-3">
                  <div className="rounded bg-gray-50 p-3">
                    <div className="text-sm text-gray-600">Fund:</div>
                    <div className="font-semibold text-gray-900">
                      {selectedFund.mutual_funds.fund_name}
                    </div>
                  </div>
                  <div className="rounded bg-gray-50 p-3">
                    <div className="text-sm text-gray-600">Quantity:</div>
                    <div className="font-semibold text-gray-900">{quantityToSell} units</div>
                  </div>
                  <div className="rounded bg-green-50 p-3 border border-green-200">
                    <div className="text-sm text-gray-600">You will receive:</div>
                    <div className="font-bold text-green-600 text-lg">
                      {formatCurrency(calculateProceeds())}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 pt-2">
                    This transaction will be processed immediately.
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end pt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSellConfirm}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Processing..." : "Confirm Sale"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
