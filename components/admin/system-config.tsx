"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Settings, CheckCircle } from "lucide-react"

export function SystemConfig() {
  const [maintenance, setMaintenance] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const cfg = JSON.parse(localStorage.getItem("system_config") || "{}")
    setMaintenance(Boolean(cfg.maintenanceMode))
  }, [])

  const save = () => {
    setSaving(true)
    setSaved(false)
    const cfg = { maintenanceMode: maintenance }
    localStorage.setItem("system_config", JSON.stringify(cfg))
    // small delay to simulate save
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 600)
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Settings className="h-5 w-5 text-orange-600" />
          System Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">Maintenance Mode</p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Toggle to place system in maintenance for demo users</p>
              </div>
              <Switch
                checked={maintenance}
                onCheckedChange={(v) => setMaintenance(Boolean(v))}
                className="ml-4"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <Button
          onClick={save}
          disabled={saving}
          className={`flex-1 transition-all duration-300 ${
            saved
              ? "bg-green-600 hover:bg-green-700"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {saved ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Saved
            </span>
          ) : saving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </Card>
  )
}
