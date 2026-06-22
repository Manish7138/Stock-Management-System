import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, Activity, DollarSign } from "lucide-react"

interface AdminOverviewProps {
  totalUsers: number
  totalFunds: number
  totalTransactionVolume: number
  totalAUM: number
}

const StatCard = ({ icon: Icon, label, value, subtext, gradient }: any) => (
  <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}></div>
    <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</CardTitle>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{subtext}</p>
    </CardContent>
  </Card>
)

export function AdminOverview({ totalUsers, totalFunds, totalTransactionVolume, totalAUM }: AdminOverviewProps) {
  const formatCurrency = (value: number) => {
    const crores = value / 10000000
    return `₹${crores.toFixed(2)} Cr`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Users}
        label="Total Users"
        value={totalUsers}
        subtext="Registered accounts"
        gradient="from-blue-500 to-blue-600"
      />
      <StatCard
        icon={Briefcase}
        label="Active Funds"
        value={totalFunds}
        subtext="Mutual funds"
        gradient="from-purple-500 to-purple-600"
      />
      <StatCard
        icon={Activity}
        label="Transaction Volume"
        value={formatCurrency(totalTransactionVolume)}
        subtext="Total processed"
        gradient="from-green-500 to-emerald-600"
      />
      <StatCard
        icon={DollarSign}
        label="Total AUM"
        value={formatCurrency(totalAUM)}
        subtext="Assets under management"
        gradient="from-orange-500 to-red-600"
      />
    </div>
  )
}
