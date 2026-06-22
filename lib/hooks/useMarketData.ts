"use client"

import { useEffect, useState, useRef } from "react"
import { LocalDB, Security } from "@/lib/local-storage/db"

// Simple market data hook for demo: polls LocalDB securities and simulates small random moves
export function useMarketData(pollInterval = 2000) {
  const [securities, setSecurities] = useState<Security[]>([])
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const secs = await LocalDB.getSecurities()
      if (mounted) setSecurities(secs)
    }

    load()

    timerRef.current = window.setInterval(async () => {
      const secs = await LocalDB.getSecurities()
      // apply tiny random drift for demo
      const updated = secs.map((s) => {
        const drift = (Math.random() - 0.5) * 0.01 // up to ±0.5%
        const newPrice = Number((s.current_price * (1 + drift)).toFixed(2))
        return { ...s, previous_close: s.current_price, current_price: newPrice, last_updated: new Date().toISOString() }
      })
      // persist simulated update
      localStorage.setItem("securities", JSON.stringify(updated))
      if (mounted) setSecurities(updated)
    }, pollInterval)

    return () => {
      mounted = false
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [pollInterval])

  return { securities }
}
