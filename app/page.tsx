"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Shield, TrendingUp, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Stock Management System</span>
          </div>
          <nav className="flex items-center gap-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
              </Button>
            )}
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white md:text-6xl">
            Professional Stock Management System
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Platform
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Comprehensive stock market platform for traders and administrators. Real-time analytics, secure
            transactions, and powerful trading tools.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                Start Investing <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Real-Time Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track fund performance with live NAV updates, performance metrics, and comprehensive portfolio
                analytics.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Secure Transactions</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enterprise-grade security with encrypted data, audit trails, and role-based access control.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Fund Management</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Complete fund lifecycle management with automated NAV calculation and performance tracking.
              </p>
            </div>
          </div>
        </section>

        {/* User Roles */}
        <section className="bg-gray-50 py-16 dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">Built for Every Role</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 text-4xl">📊</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Investors</h3>
                <p className="text-gray-600 dark:text-gray-400">Explore funds, manage investments, track portfolio performance</p>
              </div>
              <div className="text-center">
                <div className="mb-4 text-4xl">💼</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Portfolio Managers</h3>
                <p className="text-gray-600 dark:text-gray-400">Analyze markets, execute trades, optimize fund allocation</p>
              </div>
              <div className="text-center">
                <div className="mb-4 text-4xl">⚙️</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Administrators</h3>
                <p className="text-gray-600 dark:text-gray-400">System oversight, compliance, reporting and audit management</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 Stock Market. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
