"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { LocalDB } from "@/lib/local-storage/db"
import { useRouter } from "next/navigation"

interface RiskAssessmentFormProps {
  existingProfile: {
    risk_tolerance?: string
    investment_experience?: string
    annual_income?: number
    investment_goals?: string
  } | null
  userId: string
}

export function RiskAssessmentForm({ existingProfile, userId }: RiskAssessmentFormProps) {
  const [riskTolerance, setRiskTolerance] = useState(existingProfile?.risk_tolerance || "")
  const [experience, setExperience] = useState(existingProfile?.investment_experience || "")
  const [income, setIncome] = useState(existingProfile?.annual_income?.toString() || "")
  const [goals, setGoals] = useState(existingProfile?.investment_goals || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await LocalDB.upsertInvestorProfile({
        user_id: userId,
        risk_tolerance: riskTolerance,
        investment_experience: experience,
        annual_income: income ? Number.parseFloat(income) : undefined,
        investment_goals: goals,
        completed_risk_assessment: true,
      })

      router.push("/dashboard")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Investment Profile Questionnaire</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Risk Tolerance</Label>
            <p className="text-sm text-gray-600">How much risk are you comfortable taking with your investments?</p>
            <RadioGroup value={riskTolerance} onValueChange={setRiskTolerance}>
              <div className="flex items-center space-x-2 rounded-lg border p-4">
                <RadioGroupItem value="conservative" id="conservative" />
                <Label htmlFor="conservative" className="flex-1 cursor-pointer">
                  <div className="font-medium">Conservative</div>
                  <div className="text-sm text-gray-500">Low risk, stable returns</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-4">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                  <div className="font-medium">Moderate</div>
                  <div className="text-sm text-gray-500">Balanced risk and return</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-4">
                <RadioGroupItem value="aggressive" id="aggressive" />
                <Label htmlFor="aggressive" className="flex-1 cursor-pointer">
                  <div className="font-medium">Aggressive</div>
                  <div className="text-sm text-gray-500">High risk, high potential returns</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Investment Experience</Label>
            <p className="text-sm text-gray-600">What is your level of investment experience?</p>
            <RadioGroup value={experience} onValueChange={setExperience}>
              <div className="flex items-center space-x-2 rounded-lg border p-4">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                  <div className="font-medium">Beginner</div>
                  <div className="text-sm text-gray-500">New to investing</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-4">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                  <div className="font-medium">Intermediate</div>
                  <div className="text-sm text-gray-500">Some investment experience</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-4">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                  <div className="font-medium">Advanced</div>
                  <div className="text-sm text-gray-500">Experienced investor</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income" className="text-base font-semibold">
              Annual Income (Optional)
            </Label>
            <Input
              id="income"
              type="number"
              placeholder="₹500000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals" className="text-base font-semibold">
              Investment Goals
            </Label>
            <Textarea
              id="goals"
              placeholder="E.g., Retirement planning, wealth creation, child education..."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={4}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || !riskTolerance || !experience}>
            {isLoading ? "Saving..." : "Complete Assessment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
