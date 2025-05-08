"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getNotifications, markNotificationAsRead } from "@/lib/data-utils"

export function NotificationBanner() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const fetchNotifications = async () => {
    try {
      const allNotifications = await getNotifications()
      if (Array.isArray(allNotifications)) {
        const unreadNotifications = allNotifications.filter((notification: any) => !notification.read)
        setNotifications(unreadNotifications)
      } else {
        console.error("Notifications data is not an array:", allNotifications)
        setNotifications([])
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setNotifications([])
    }
  }

  useEffect(() => {
    // Call the async function
    fetchNotifications()

    // Set up event listener for real-time updates
    const handleUpdate = (event: CustomEvent) => {
      if (event.detail.type === "notification") {
        fetchNotifications()
      }
    }

    window.addEventListener("acadGuideUpdate" as any, handleUpdate as EventListener)

    return () => {
      window.removeEventListener("acadGuideUpdate" as any, handleUpdate as EventListener)
    }
  }, [])

  const handleDismiss = () => {
    if (notifications.length > 0) {
      const notificationId = notifications[currentIndex].id
      markNotificationAsRead(notificationId)

      // Remove the notification from the local state
      const updatedNotifications = notifications.filter((_, index) => index !== currentIndex)
      setNotifications(updatedNotifications)

      // Adjust current index if needed
      if (currentIndex >= updatedNotifications.length && updatedNotifications.length > 0) {
        setCurrentIndex(updatedNotifications.length - 1)
      }
    }
  }

  const handleNext = () => {
    if (currentIndex < notifications.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (!isVisible || notifications.length === 0) {
    return null
  }

  const currentNotification = notifications[currentIndex]

  return (
    <Card
      className={cn(
        "fixed bottom-4 right-4 z-50 w-80 border border-violet-800 bg-violet-900/30 backdrop-blur-md animate-fade-in",
        "shadow-lg violet-glow",
      )}
    >
      <div className="flex items-center justify-between border-b border-violet-800 p-3">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-violet-300" />
          <span className="font-medium text-violet-100">Notification</span>
        </div>
        <div className="flex items-center space-x-1">
          {notifications.length > 1 && (
            <div className="text-xs text-violet-300">
              {currentIndex + 1} / {notifications.length}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-violet-300 hover:bg-violet-800/50 hover:text-violet-100"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-violet-100">{currentNotification.message}</p>
        <p className="mt-1 text-xs text-violet-300">{new Date(currentNotification.timestamp).toLocaleString()}</p>
      </div>
      <div className="flex items-center justify-between border-t border-violet-800 p-3">
        <div className="flex space-x-2">
          {notifications.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-7 border-violet-800 bg-violet-900/50 text-violet-300 hover:bg-violet-800 hover:text-violet-100"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 border-violet-800 bg-violet-900/50 text-violet-300 hover:bg-violet-800 hover:text-violet-100"
                onClick={handleNext}
                disabled={currentIndex === notifications.length - 1}
              >
                Next
              </Button>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 border-violet-800 bg-violet-900/50 text-violet-300 hover:bg-violet-800 hover:text-violet-100"
          onClick={handleDismiss}
        >
          Dismiss
        </Button>
      </div>
    </Card>
  )
}
