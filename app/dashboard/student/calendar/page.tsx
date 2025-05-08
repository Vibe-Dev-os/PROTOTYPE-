"use client"

import { useEffect, useState } from "react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, MapPin } from "lucide-react"

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = (await getData("events")) as any[]
        const departmentsData = (await getData("departments")) as any[]

        // Add academic calendar events (mock data for demo)
        const academicEvents = [
          {
            id: "academic-1",
            title: "Final Examination Week",
            description: "Final examinations for all courses",
            type: "Examination",
            date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString(),
            location: "All Campus Buildings",
            departmentId: "all",
            isAcademic: true,
          },
          {
            id: "academic-2",
            title: "Enrollment Period",
            description: "Enrollment for the next semester",
            type: "Academic",
            date: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 5).toISOString(),
            location: "Registrar's Office",
            departmentId: "all",
            isAcademic: true,
          },
          {
            id: "academic-3",
            title: "Midterm Week",
            description: "Midterm examinations for all courses",
            type: "Examination",
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 20).toISOString(),
            location: "All Campus Buildings",
            departmentId: "all",
            isAcademic: true,
          },
        ]

        setEvents([...eventsData, ...academicEvents])
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching calendar data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter events by selected date and department
  const getFilteredEvents = () => {
    if (!selectedDate) return []

    return events.filter((event) => {
      const eventDate = new Date(event.date)
      const isSameDate =
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()

      const isDepartmentMatch =
        selectedDepartment === "all" || event.departmentId === selectedDepartment || event.departmentId === "all"

      return isSameDate && isDepartmentMatch
    })
  }

  // Get dates with events for highlighting in calendar
  const getDatesWithEvents = () => {
    const filteredEvents = events.filter(
      (event) =>
        selectedDepartment === "all" || event.departmentId === selectedDepartment || event.departmentId === "all",
    )

    return filteredEvents.map((event) => new Date(event.date))
  }

  // Get department name by ID
  const getDepartmentName = (departmentId: string) => {
    if (departmentId === "all") return "All Departments"
    const department = departments.find((dept) => dept.id === departmentId)
    return department ? department.name : "Unknown Department"
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Academic Calendar</h1>
        <p className="text-muted-foreground">View academic events and important dates</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view events</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasEvent: getDatesWithEvents(),
                }}
                modifiersStyles={{
                  hasEvent: {
                    fontWeight: "bold",
                    backgroundColor: "hsl(var(--primary) / 0.1)",
                    color: "hsl(var(--primary))",
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filter</CardTitle>
              <CardDescription>Filter events by department</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.code} - {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Events for {selectedDate?.toLocaleDateString()}</CardTitle>
                <CardDescription>
                  {selectedDepartment === "all"
                    ? "Showing events for all departments"
                    : `Showing events for ${getDepartmentName(selectedDepartment)}`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {getFilteredEvents().length} Events
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {getFilteredEvents().length > 0 ? (
              <div className="space-y-6">
                {getFilteredEvents().map((event, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-medium">{event.title}</h3>
                      <Badge variant={event.isAcademic ? "default" : "outline"}>
                        {event.isAcademic ? "Academic Calendar" : event.type}
                      </Badge>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">{event.description}</p>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">No events scheduled for this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
