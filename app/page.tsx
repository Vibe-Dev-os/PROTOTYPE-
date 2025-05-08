"use client"

import { useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { initializeBasicData } from "@/lib/init-utils"

export default function Home() {
  useEffect(() => {
    // Initialize basic data when the page loads
    initializeBasicData()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <LoginForm />
    </main>
  )
}
