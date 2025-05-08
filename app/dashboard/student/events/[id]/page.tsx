"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { Badge } from "@/components/ui/badge"

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null)
  const [department, setDepartment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = (await getData("events")) as any[]
        const event = eventsData.find((e) => e.id === params.id)

        if (event) {
          setEvent(event)

          // Fetch department data
          const departmentsData = (await getData("departments")) as any[]
          const department = departmentsData.find((d) => d.id === event.departmentId)
          setDepartment(department)
        }
      } catch (error) {
        console.error("Error fetching event data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

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
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Event not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if event is upcoming
  const isUpcoming = (date: string) => {
    const eventDate = new Date(date)
    const today = new Date()
    return eventDate >= today
  }

  const upcoming = isUpcoming(event.date)

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/student/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={upcoming ? "default" : "outline"}>{upcoming ? "Upcoming" : "Past Event"}</Badge>
            <Badge variant="outline">{event.type}</Badge>
          </div>
          <CardTitle className="mt-2 text-2xl md:text-3xl">{event.title}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {department?.code} - {department?.name}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border p-4">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-4">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-4">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="prose prose-sm max-w-none dark:prose-invert md:prose-base">
            <h3 className="text-lg font-semibold">Description</h3>
            {event.description.split("\n").map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
