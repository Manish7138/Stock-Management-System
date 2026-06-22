"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LocalDB } from "@/lib/local-storage/db"
import { useToast } from "@/components/ui/toast"

export default function CheckoutPage() {
  const search = useSearchParams()
  const router = useRouter()
  const fundId = search.get("fundId") || undefined
  const amount = search.get("amount") || undefined
  const userId = search.get("userId") || undefined

  const [fund, setFund] = useState<any | null>(null)
  const [processing, setProcessing] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [showPinPrompt, setShowPinPrompt] = useState(false)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState<string | null>(null)
  const [pinProcessing, setPinProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!fundId) return
      const f = await LocalDB.getFund(fundId)
      if (mounted) setFund(f)
    }
    load()
    return () => { mounted = false }
  }, [fundId])

  const methods = [
    { id: "gpay", label: "Google Pay" },
    { id: "epay", label: "ePay" },
    { id: "paypal", label: "PayPal" },
    { id: "visa", label: "Visa Card" },
    { id: "amex", label: "American Express" },
  ]

  // When a method is clicked, open PIN prompt to authorize that single method
  const handlePay = async (methodId: string) => {
    if (processing || pinProcessing) return
    if (!userId || !fundId || !amount) return alert("Missing payment info")
    setSelectedMethod(methodId)
    setPin("")
    setPinError(null)
    setShowPinPrompt(true)
  }

  // Confirm PIN and process selected method only
  const confirmAndProcess = async () => {
    if (!selectedMethod) return
    if (pinProcessing) return
    setPinProcessing(true)
    setPinError(null)

    try {
      const current = LocalDB.getCurrentUser()
      if (!current) {
        setPinError("No current user session. Please login.")
        return
      }

      // PIN validation bypassed for demo/university project
      // Proceed with single-method payment
      setShowPinPrompt(false)
      setProcessing(true)
      setMessage(null)

      // Simulate redirect to gateway and processing delay
      await new Promise((r) => setTimeout(r, 1200))

      const invested = await LocalDB.createInvestment(userId, fundId, Number(amount), Number(fund?.nav || 0))
      const msg = `Payment successful via ${selectedMethod}. Transaction id: ${invested.id}`
      setMessage(msg)
      try { toast({ title: "Payment successful", description: msg }) } catch (e) {}

      // Short delay then redirect back to dashboard
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 900)
    } catch (e) {
      console.error(e)
      const errMsg = "Payment failed. Please try another method."
      setMessage(errMsg)
      try { toast({ title: "Payment failed", description: errMsg }) } catch (e) {}
    } finally {
      setPinProcessing(false)
      setProcessing(false)
      setSelectedMethod(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Payment Checkout</h1>
          <p className="text-sm text-gray-500">Complete your payment to finalize the investment.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{amount ? `₹${Number(amount).toFixed(2)}` : "-"}</div>
                <div className="text-sm text-gray-500 mt-2">Fund: {fund?.fund_name || fundId}</div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {methods.map((m) => (
                    <div key={m.id} className="flex items-center justify-between border rounded p-3">
                      <div className="font-medium">{m.label}</div>
                      <Button disabled={processing || showPinPrompt} onClick={() => handlePay(m.id)}>{processing ? "Processing..." : "Pay"}</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PIN Prompt Modal */}
          {showPinPrompt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowPinPrompt(false)} />
              <div className="relative w-full max-w-md bg-white rounded-md shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Authorize Payment</h3>
                <p className="text-sm text-gray-600 mb-4">Enter your transaction PIN to authorize the payment.</p>
                <input
                  type="password"
                  className="w-full rounded-md border px-3 py-2"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN"
                />
                {pinError && <div className="text-sm text-red-600 mt-2">{pinError}</div>}

                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowPinPrompt(false)} disabled={pinProcessing}>Cancel</Button>
                  <Button onClick={confirmAndProcess} disabled={pinProcessing}>{pinProcessing ? "Verifying..." : "Confirm"}</Button>
                </div>
              </div>
            </div>
          )}

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Security & Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">This demo payment gateway simulates payments. In production, integrate with real gateway SDKs and follow PCI compliance.</p>
                {message && <div className="mt-3 rounded bg-green-50 p-2 text-sm text-green-700">{message}</div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
