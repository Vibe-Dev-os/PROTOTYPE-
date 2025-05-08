"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getUser } from "@/lib/data-utils"
import { NotificationBanner } from "@/components/notification-banner"

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const user = getUser()
    if (!user) {
      router.push("/")
      return
    }

    // Check if user is accessing the correct dashboard
    const path = window.location.pathname
    const correctPath = `/dashboard/${user.role}`

    if (!path.startsWith(correctPath)) {
      router.push(correctPath)
      return
    }

    // Register service worker for offline functionality
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").catch((error) => {
          console.error("Service Worker registration failed:", error)
        })
      })
    }

    // Force dark mode
    document.documentElement.classList.add("dark")

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0A1A]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#9D4EDD] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
      <NotificationBanner />
    </>
  )
}
