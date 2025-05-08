"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { getData, getUser, storeData } from "@/lib/data-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface EventFormProps {
  eventId?: string
}

export function EventForm({ eventId }: EventFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [location, setLocation] = useState("")
  const [type, setType] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [departments, setDepartments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const user = getUser()

  const eventTypes = ["Orientation", "Academic", "Career", "Examination", "Lecture", "Competition", "Workshop", "Other"]

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch departments
        const departmentsData = (await getData("departments")) as any[]
        setDepartments(departmentsData)

        // If editing an existing event, fetch its data
        if (eventId) {
          const eventsData = (await getData("events")) as any[]
          const event = eventsData.find((e) => e.id === eventId)

          if (event) {
            setTitle(event.title)
            setDescription(event.description)
            setDate(new Date(event.date))
            setLocation(event.location)
            setType(event.type)
            setDepartmentId(event.departmentId)
          }
        } else {
          // For new events, set the user's department as default
          if (user?.department) {
            setDepartmentId(user.department.toLowerCase())
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please try again.",
        })
      } finally {
        setIsFetching(false)
      }
    }

    fetchData()
  }, [eventId, toast, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!title || !description || !date || !location || !type || !departmentId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields.",
        })
        setIsLoading(false)
        return
      }

      // Get existing events
      const eventsData = (await getData("events")) as any[]

      // Prepare the event object
      const now = new Date().toISOString()

      let updatedEvents

      if (eventId) {
        // Update existing event
        updatedEvents = eventsData.map((event) => {
          if (event.id === eventId) {
            return {
              ...event,
              title,
              description,
              date: date.toISOString(),
              location,
              type,
              departmentId,
              updatedAt: now,
            }
          }
          return event
        })

        toast({
          title: "Success",
          description: "Event updated successfully.",
        })
      } else {
        // Create new event
        const newEvent = {
          id: Date.now().toString(),
          title,
          description,
          date: date.toISOString(),
          location,
          type,
          departmentId,
          createdAt: now,
          updatedAt: now,
        }

        updatedEvents = [...eventsData, newEvent]

        toast({
          title: "Success",
          description: "Event created successfully.",
        })
      }

      // Store updated events
      await storeData("events", updatedEvents)

      // Redirect to events page
      router.push("/dashboard/instructor/events")
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save event. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={departmentId} onValueChange={setDepartmentId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.code} - {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Event Date and Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter event location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Event Description</Label>
            <Textarea
              id="description"
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : eventId ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
