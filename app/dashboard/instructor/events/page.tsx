"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Filter, Plus, Search, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData, storeData } from "@/lib/data-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function InstructorEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedEventType, setSelectedEventType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const eventsData = (await getData("events")) as any[]
      const departmentsData = (await getData("departments")) as any[]

      // Sort events by date (upcoming first)
      const sortedEvents = eventsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setEvents(sortedEvents)
      setFilteredEvents(sortedEvents)
      setDepartments(departmentsData)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    filterEvents()
  }, [searchQuery, selectedDepartment, selectedEventType, events])

  const filterEvents = () => {
    let filtered = [...events]

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (event) => event.title.toLowerCase().includes(query) || event.description.toLowerCase().includes(query),
      )
    }

    // Filter by department
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((event) => event.departmentId === selectedDepartment)
    }

    // Filter by event type
    if (selectedEventType !== "all") {
      filtered = filtered.filter((event) => event.type === selectedEventType)
    }

    setFilteredEvents(filtered)
  }

  const getDepartmentById = (departmentId: string) => {
    return departments.find((dept) => dept.id === departmentId)
  }

  // Get unique event types
  const eventTypes = Array.from(new Set(events.map((event) => event.type)))

  // Check if an event is upcoming
  const isUpcoming = (date: string) => {
    const eventDate = new Date(date)
    const today = new Date()
    return eventDate >= today
  }

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return

    try {
      const updatedEvents = events.filter((event) => event.id !== eventToDelete)
      await storeData("events", updatedEvents)
      setEvents(updatedEvents)

      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the event. Please try again.",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setEventToDelete(null)
    }
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
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Manage Events</h1>
          <p className="text-muted-foreground">Create and manage academic events and activities</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="w-full pl-8 md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/dashboard/instructor/events/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by:</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-row">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedEventType} onValueChange={setSelectedEventType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const department = getDepartmentById(event.departmentId)
            const upcoming = isUpcoming(event.date)

            return (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={upcoming ? "default" : "outline"}>{upcoming ? "Upcoming" : "Past Event"}</Badge>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  <CardTitle className="mt-2 text-lg">{event.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {department?.code} - {department?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/dashboard/instructor/events/${event.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleDeleteClick(event.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center text-muted-foreground">No events match your search criteria</div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
