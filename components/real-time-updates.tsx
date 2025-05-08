"use client"

import { useState, useEffect } from "react"
import { Bell, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentUpdates, markUpdateAsRead } from "@/lib/data-utils"

export function RealTimeUpdates() {
  const [updates, setUpdates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchUpdates = async () => {
    setIsLoading(true)
    try {
      const recentUpdates = await getRecentUpdates()
      setUpdates(recentUpdates)
    } catch (error) {
      console.error("Error fetching updates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUpdates()

    // Set up event listener for real-time updates
    const handleUpdate = (event: CustomEvent) => {
      if (event.detail.type === "update") {
        fetchUpdates()
      }
    }

    window.addEventListener("acadGuideUpdate" as any, handleUpdate as EventListener)

    return () => {
      window.removeEventListener("acadGuideUpdate" as any, handleUpdate as EventListener)
    }
  }, [])

  const handleMarkAsRead = async (updateId: string) => {
    try {
      await markUpdateAsRead(updateId)
      setUpdates(updates.filter((update) => update.id !== updateId))
    } catch (error) {
      console.error("Error marking update as read:", error)
    }
  }

  if (updates.length === 0 && !isLoading) {
    return null
  }

  return (
    <Card className="border-violet-800 bg-violet-900/10 shadow-md violet-glow">
      <CardHeader className="border-b border-violet-800/50 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-violet-400" />
            <CardTitle className="text-lg text-violet-100">Recent Updates</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-violet-400 hover:bg-violet-900/50 hover:text-violet-100"
            onClick={fetchUpdates}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
        <CardDescription className="text-violet-300">
          Stay updated with the latest changes to your courses and materials
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-violet-800/50">
          {updates.map((update) => (
            <div key={update.id} className="flex items-start justify-between p-4 hover:bg-violet-900/20">
              <div>
                <p className="font-medium text-violet-100">{update.title}</p>
                <p className="mt-1 text-sm text-violet-300">{update.message}</p>
                <p className="mt-1 text-xs text-violet-400">{new Date(update.timestamp).toLocaleString()}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 h-7 text-violet-400 hover:bg-violet-900/50 hover:text-violet-100"
                onClick={() => handleMarkAsRead(update.id)}
              >
                Dismiss
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
