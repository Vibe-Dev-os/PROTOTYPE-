"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, GraduationCap, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData } from "@/lib/data-utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { departments } from "@/lib/sample-data" // Import sample data directly

export default function DepartmentPage({ params }: { params: { id: string } }) {
  const [department, setDepartment] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        // Try to fetch department data from IndexedDB
        let departmentsData: any[] = []
        try {
          departmentsData = (await getData("departments")) as any[]
        } catch (dbError) {
          console.warn("Error fetching from IndexedDB, using fallback data:", dbError)
          // Fallback to imported sample data if IndexedDB fails
          departmentsData = departments
        }

        // If still no data, create a fallback for BSIS
        if (!departmentsData || departmentsData.length === 0) {
          console.warn("No departments data available, creating fallback data")
          departmentsData = departments
        }

        // Try to find department by ID, code, or name (case insensitive)
        const searchId = params.id.toLowerCase()
        let department = departmentsData.find(
          (d) =>
            d.id.toLowerCase() === searchId ||
            d.code.toLowerCase() === searchId ||
            d.name.toLowerCase().replace(/\s+/g, "") === searchId,
        )

        // If not found, check if it's an acronym (like BSIS)
        if (!department) {
          // Check if any department name's initials match the search ID
          department = departmentsData.find((d) => {
            const initials = d.name
              .split(" ")
              .map((word: string) => word[0])
              .join("")
              .toLowerCase()
            return initials === searchId
          })
        }

        // Special case for BSIS if not found
        if (!department && searchId === "bsis") {
          department = {
            id: "bsis",
            name: "Bachelor of Science in Information Systems",
            code: "BSIS",
            description: "Study of information systems and their application in business and organizations",
          }
        }

        if (!department) {
          throw new Error(`Department "${params.id}" not found`)
        }

        setDepartment(department)

        // Fetch courses for this department
        let coursesData: any[] = []
        try {
          coursesData = (await getData("courses")) as any[]
        } catch (error) {
          console.warn("Error fetching courses, using fallback:", error)
          // Fallback courses for BSIS
          if (department.id === "bsis") {
            coursesData = [
              {
                id: "bsis-course-1",
                departmentId: "bsis",
                name: "Introduction to Information Systems",
                code: "BSIS101",
                description: "Overview of information systems concepts, components, and their role in business",
                credits: 3,
                instructor: "Dr. Maria Santos",
                year: 1,
                semester: 1,
              },
              {
                id: "bsis-course-2",
                departmentId: "bsis",
                name: "Database Management Systems",
                code: "BSIS201",
                description: "Design and implementation of database systems for business applications",
                credits: 4,
                instructor: "Prof. Juan Cruz",
                year: 1,
                semester: 2,
              },
              {
                id: "bsis-course-3",
                departmentId: "bsis",
                name: "Systems Analysis and Design",
                code: "BSIS301",
                description: "Methods and techniques for analyzing and designing information systems",
                credits: 3,
                instructor: "Dr. Ana Reyes",
                year: 2,
                semester: 1,
              },
            ]
          }
        }

        const departmentCourses = coursesData.filter(
          (c) => c.departmentId === department.id || c.departmentCode === department.code,
        )
        setCourses(departmentCourses)

        // Fetch events for this department
        let eventsData: any[] = []
        try {
          eventsData = (await getData("events")) as any[]
        } catch (error) {
          console.warn("Error fetching events, using fallback:", error)
          // Fallback event for BSIS
          if (department.id === "bsis") {
            eventsData = [
              {
                id: "bsis-event-1",
                departmentId: "bsis",
                title: "BSIS Career Fair",
                description: "Annual career fair for BSIS students to connect with potential employers",
                date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
                location: "Main Campus, Building B, Room 201",
                type: "Career Fair",
              },
            ]
          }
        }

        const departmentEvents = eventsData.filter(
          (e) => e.departmentId === department.id || e.departmentCode === department.code,
        )
        setEvents(departmentEvents)
      } catch (error) {
        console.error("Error fetching department data:", error)
        setError(error instanceof Error ? error.message : "Failed to load department data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !department) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/student/departments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Departments
            </Link>
          </Button>
        </div>

        <Card className="border-violet-500/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="h-16 w-16 text-violet-500/70 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Department Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The department you're looking for doesn't exist or couldn't be loaded."}
            </p>
            <Button asChild>
              <Link href="/dashboard/student/departments">Browse All Departments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Group courses by year and semester
  const coursesByYear = courses.reduce((acc: any, course) => {
    const year = course.year || 1 // Default to year 1 if not specified
    const semester = course.semester || 1 // Default to semester 1 if not specified

    if (!acc[year]) {
      acc[year] = { 1: [], 2: [] }
    }

    acc[year][semester].push(course)
    return acc
  }, {})

  // Check if an event is upcoming
  const isUpcoming = (date: string) => {
    const eventDate = new Date(date)
    const today = new Date()
    return eventDate >= today
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/student/departments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Departments
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
            <GraduationCap className="h-8 w-8 text-violet-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{department.name}</h1>
            <p className="text-muted-foreground">{department.code}</p>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground">{department.description}</p>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="events">Department Events</TabsTrigger>
        </TabsList>
        <TabsContent value="courses">
          <div className="space-y-8">
            {Object.keys(coursesByYear).length > 0 ? (
              Object.keys(coursesByYear)
                .sort((a, b) => Number(a) - Number(b))
                .map((year) => (
                  <div key={year} className="space-y-4">
                    <h2 className="text-xl font-semibold">Year {year}</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="mb-4 text-lg font-medium">1st Semester</h3>
                        <div className="space-y-4">
                          {coursesByYear[year][1].length > 0 ? (
                            coursesByYear[year][1].map((course: any) => (
                              <Card key={course.id} className="transition-all hover:border-violet-500/30">
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">{course.name}</CardTitle>
                                    <Badge variant="outline">{course.code}</Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground">{course.description}</p>
                                  <div className="mt-4 flex justify-end">
                                    <Button asChild variant="outline" size="sm">
                                      <Link href={`/dashboard/student/courses/${course.id}`}>View Course</Link>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No courses for this semester</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-4 text-lg font-medium">2nd Semester</h3>
                        <div className="space-y-4">
                          {coursesByYear[year][2].length > 0 ? (
                            coursesByYear[year][2].map((course: any) => (
                              <Card key={course.id} className="transition-all hover:border-violet-500/30">
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">{course.name}</CardTitle>
                                    <Badge variant="outline">{course.code}</Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground">{course.description}</p>
                                  <div className="mt-4 flex justify-end">
                                    <Button asChild variant="outline" size="sm">
                                      <Link href={`/dashboard/student/courses/${course.id}`}>View Course</Link>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No courses for this semester</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <Card className="border-violet-500/20">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <GraduationCap className="h-12 w-12 text-violet-500/70 mb-3" />
                  <h3 className="text-xl font-semibold mb-2">No Courses Available</h3>
                  <p className="text-muted-foreground">There are currently no courses available for this department.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="events">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((event) => {
                  const upcoming = isUpcoming(event.date)

                  return (
                    <Card key={event.id} className="overflow-hidden transition-all hover:border-violet-500/30">
                      <CardHeader className="bg-violet-500/5 pb-4">
                        <div className="flex items-center justify-between">
                          <Badge variant={upcoming ? "default" : "outline"}>
                            {upcoming ? "Upcoming" : "Past Event"}
                          </Badge>
                          <Badge variant="outline">{event.type || "Event"}</Badge>
                        </div>
                        <CardTitle className="mt-2 text-lg">{event.title}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
                        <Button asChild className="w-full">
                          <Link href={`/dashboard/student/events/${event.id}`}>View Details</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })
            ) : (
              <div className="col-span-full">
                <Card className="border-violet-500/20">
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Calendar className="h-12 w-12 text-violet-500/70 mb-3" />
                    <h3 className="text-xl font-semibold mb-2">No Events Available</h3>
                    <p className="text-muted-foreground">
                      There are currently no events scheduled for this department.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
