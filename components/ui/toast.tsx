"use client"

import * as React from "react"

type Toast = { id: string; title: string; description?: string }

const ToastContext = React.createContext<{
  toast: (t: Omit<Toast, "id">) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((t: Omit<Toast, "id">) => {
    const id = crypto.randomUUID()
    setToasts((s) => [...s, { id, ...t }])
    // auto-remove after 4s
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className="min-w-[240px] max-w-sm rounded-md bg-white shadow-lg border px-4 py-2">
            <div className="font-semibold text-sm">{t.title}</div>
            {t.description && <div className="text-xs text-gray-600">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

