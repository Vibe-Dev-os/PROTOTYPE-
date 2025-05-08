"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EventForm } from "@/components/event-form"
import { getData } from "@/lib/data-utils"

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = (await getData("events")) as any[]
        const event = eventsData.find((e) => e.id === params.id)

        if (event) {
          setEvent(event)
        } else {
          // Event not found, redirect to events page
          router.push("/dashboard/instructor/events")
        }
      } catch (error) {
        console.error("Error fetching event data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">Event not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Edit Event</h1>
        <p className="text-muted-foreground">Update event details and information</p>
      </div>
      <EventForm eventId={params.id} />
    </div>
  )
}
