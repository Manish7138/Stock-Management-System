import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, FileText, Settings, TrendingDown } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href="/dashboard/funds" className="block">
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <Search className="h-4 w-4" />
            Explore Funds
          </Button>
        </Link>
        <Link href="/dashboard/portfolio" className="block">
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <TrendingUp className="h-4 w-4" />
            View Portfolio
          </Button>
        </Link>
        <Link href="/dashboard/transactions" className="block">
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <FileText className="h-4 w-4" />
            Transaction History
          </Button>
        </Link>
        <Link href="/dashboard/sell-stocks" className="block">
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50">
            <TrendingDown className="h-4 w-4" />
            Sell Stocks
          </Button>
        </Link>
        <Link href="/dashboard/risk-assessment" className="block">
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            Risk Assessment
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
