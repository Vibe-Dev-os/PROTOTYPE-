"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getData } from "@/lib/data-utils"

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = (await getData("events")) as any[]
        setEvents(eventsData)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Group events by month
  const eventsByMonth: Record<string, any[]> = {}
  events.forEach((event) => {
    const date = new Date(event.date)
    const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" })
    if (!eventsByMonth[monthYear]) {
      eventsByMonth[monthYear] = []
    }
    eventsByMonth[monthYear].push(event)
  })

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Academic Events</h1>
        <p className="text-muted-foreground">Stay updated with upcoming academic events and activities</p>
      </div>

      {Object.entries(eventsByMonth).map(([monthYear, monthEvents]) => (
        <div key={monthYear} className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">{monthYear}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {monthEvents.map((event) => (
              <Card key={event.id} className="flex flex-col overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {new Date(event.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                    </Badge>
                    <Badge variant={event.type === "workshop" ? "default" : "outline"}>{event.type}</Badge>
                  </div>
                  <CardTitle className="mt-2">{event.title}</CardTitle>
                  <CardDescription>{event.organizer}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <p className="mb-4 text-sm text-muted-foreground">{event.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(event.date).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/student/events/${event.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
