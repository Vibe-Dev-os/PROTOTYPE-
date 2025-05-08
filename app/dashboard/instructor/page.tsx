"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Calendar, Clock, FileText, GraduationCap, Plus, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData, getUser } from "@/lib/data-utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function InstructorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [myLessons, setMyLessons] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setUser(getUser())

        // Fetch data from IndexedDB
        const lessonsData = (await getData("lessons")) as any[]
        const eventsData = (await getData("events")) as any[]
        const departmentsData = (await getData("departments")) as any[]

        // Filter lessons created by this instructor
        const instructorLessons = lessonsData
          .filter((lesson) => lesson.createdBy === user?.id || lesson.createdBy === "instructor-1")
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 3)

        // Filter upcoming events and sort by date
        const today = new Date()
        const filteredEvents = eventsData
          .filter((event) => new Date(event.date) >= today)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3)

        setMyLessons(instructorLessons)
        setUpcomingEvents(filteredEvents)
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || "Instructor"}</h1>
        <p className="text-muted-foreground">Manage your academic resources and create new content for students.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Lessons</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myLessons.length}</div>
            <p className="text-xs text-muted-foreground">Created learning materials</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Academic departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">Upcoming academic events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Tools</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Interactive learning tools</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Lessons</CardTitle>
              <CardDescription>Learning materials you've created</CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/instructor/lessons/create">
                <Plus className="mr-2 h-4 w-4" />
                New Lesson
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myLessons.length > 0 ? (
                myLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {new Date(lesson.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/dashboard/instructor/lessons/${lesson.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No lessons created yet</p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/instructor/lessons">View All Lessons</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Academic events and activities coming soon</CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/instructor/events/create">
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-none">{event.title}</p>
                        <Badge variant="outline" className="ml-2">
                          {event.type}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/dashboard/instructor/events/${event.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/instructor/events">View All Events</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Learning Tools Management</CardTitle>
            <CardDescription>Create and manage interactive learning tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-primary/5">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Flashcards</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">Create and manage flashcard sets for your courses</p>
                  <Button asChild className="mt-4 w-full" variant="outline">
                    <Link href="/dashboard/instructor/flashcards">Manage Flashcards</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-primary/5">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Quizzes</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">Create and manage quizzes for your courses</p>
                  <Button asChild className="mt-4 w-full" variant="outline">
                    <Link href="/dashboard/instructor/quizzes">Manage Quizzes</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Department</CardTitle>
            <CardDescription>Quick access to your department resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {departments.find((d) => d.id === user?.department?.toLowerCase())?.name || "Information Systems"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {departments.find((d) => d.id === user?.department?.toLowerCase())?.code || "BSIS"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                  <Link href={`/dashboard/instructor/departments/${user?.department?.toLowerCase() || "bsis"}/courses`}>
                    Manage Courses
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/dashboard/instructor/departments/${user?.department?.toLowerCase() || "bsis"}/events`}>
                    Department Events
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
