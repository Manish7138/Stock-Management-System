"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { PortfolioOverview } from "@/components/investor/portfolio-overview"

export default function BrandingDemo() {
  const user = { full_name: "Demo Investor", email: "investor@example.com", role: "investor" }

  const investments = [
    {
      id: "inv-1",
      units: 100,
      total_invested: 154200,
      current_value: 180000,
      mutual_funds: { fund_name: "Blue Chip Equity Fund", fund_type: "equity", nav: 15.42 },
    },
    {
      id: "inv-2",
      units: 50,
      total_invested: 111000,
      current_value: 120000,
      mutual_funds: { fund_name: "Stable Income Debt Fund", fund_type: "debt", nav: 11.87 },
    },
    {
      id: "inv-3",
      units: 30,
      total_invested: 85000,
      current_value: 92000,
      mutual_funds: { fund_name: "Technology Sector Fund", fund_type: "sector", nav: 28.34 },
    },
  ]

  const totalInvested = investments.reduce((s, i) => s + Number(i.total_invested), 0)
  const totalCurrentValue = investments.reduce((s, i) => s + Number(i.current_value), 0)
  const totalGainLoss = totalCurrentValue - totalInvested
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto p-6">
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-white to-purple-50 p-6 shadow-md">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-center">
              <div className="flex-shrink-0">
                <img
                  src="/placeholder-logo.png"
                  alt="Branding"
                  className="h-40 w-64 max-w-full object-cover rounded-lg border border-gray-100 shadow-lg"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-extrabold text-gray-900">Investment Dashboard</h1>
                <p className="mt-1 text-gray-600">Track your portfolio and manage investments with confidence.</p>
                <div className="mt-4 flex items-center justify-center gap-3 md:justify-start">
                  <div className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-gray-800 shadow">Demo Account</div>
                  <div className="rounded-lg bg-white/90 px-4 py-2 text-sm text-gray-600 shadow">Last updated: just now</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <PortfolioOverview
                totalInvested={totalInvested}
                totalCurrentValue={totalCurrentValue}
                totalGainLoss={totalGainLoss}
                totalGainLossPercent={totalGainLossPercent}
                investments={investments}
              />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="mt-1 text-sm text-gray-500">Use the main dashboard for actions</p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Summary</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li>Total Invested: <span className="font-medium text-gray-900">₹{totalInvested.toLocaleString()}</span></li>
                <li>Current Value: <span className="font-medium text-gray-900">₹{totalCurrentValue.toLocaleString()}</span></li>
                <li>Gain/Loss: <span className={`font-medium ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{totalGainLoss.toLocaleString()}</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
