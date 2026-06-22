"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { RiskAssessmentForm } from "@/components/investor/risk-assessment-form"
import { LocalDB } from "@/lib/local-storage/db"

export default function RiskAssessmentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && user.role !== "investor") {
      router.push("/auth/login")
      return
    }

    if (user) loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  const loadProfile = async () => {
    setDataLoading(true)
    try {
      const p = await LocalDB.getInvestorProfile(user!.id)
      setProfile(p)
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || dataLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Risk Assessment</h1>
          <p className="text-gray-600">Help us understand your investment profile</p>
        </div>

        <RiskAssessmentForm existingProfile={profile} userId={user.id} />
      </main>
    </div>
  )
}
