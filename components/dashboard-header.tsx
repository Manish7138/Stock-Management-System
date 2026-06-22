import { LogoutButton } from "./logout-button"
import { Bell, Menu } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

interface DashboardHeaderProps {
  user: {
    full_name: string
    email: string
    role: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const getRoleName = (role: string) => {
    switch (role) {
      case "investor":
        return "User"
      case "admin":
        return "Administrator"
      default:
        return "User"
    }
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="app-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href={user.role === "admin" ? "/admin" : "/dashboard"}
            className="flex items-center gap-3"
          >
            <picture>
              <source srcSet="/branding.png" type="image/png" />
              <img src="/branding.svg" alt="SM" className="h-10 w-auto rounded-sm" />
            </picture>
            <span className="text-xl font-bold text-blue-600 hidden sm:inline">SM</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {user.role === "investor" && (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/dashboard/funds" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Explore Funds
                </Link>
                <Link href="/dashboard/portfolio" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  My Portfolio
                </Link>
                <Link href="/dashboard/transactions" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Transactions
                </Link>
              </>
            )}
            {user.role === "admin" && (
              <>
                <Link href="/admin" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Users
                </Link>
                <Link href="/admin/funds" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Funds
                </Link>
                <Link href="/admin/reports" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Reports
                </Link>
                <Link href="/admin/audit" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Audit Logs
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="hidden flex-col items-end md:flex">
            <span className="text-sm font-medium text-gray-900">{user.full_name}</span>
            <span className="text-xs text-gray-500">{getRoleName(user.role)}</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
