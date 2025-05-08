"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getData } from "@/lib/data-utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Calendar,
  FileText,
  GraduationCap,
  PlusCircle,
  Edit,
  AlertCircle,
  ArrowLeft,
  Plus,
  BookOpen,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function InstructorDepartmentDetailPage() {
  const params = useParams()
  const departmentId = params.id as string

  const [department, setDepartment] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDepartmentData() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch department data
        const departmentsData = await getData("departments")

        if (!departmentsData || departmentsData.length === 0) {
          throw new Error("No departments data available")
        }

        const foundDepartment = departmentsData.find(
          (dept: any) => dept.id.toLowerCase() === departmentId.toLowerCase(),
        )

        if (!foundDepartment) {
          throw new Error("Department not found")
        }

        setDepartment({
          ...foundDepartment,
          students: Math.floor(Math.random() * 100) + 50, // Mock data
          instructors: Math.floor(Math.random() * 10) + 5, // Mock data
        })

        // Fetch related data
        const coursesData = await getData("courses")
        const departmentCourses = coursesData.filter(
          (course: any) => course.departmentId.toLowerCase() === departmentId.toLowerCase(),
        )
        setCourses(departmentCourses)

        const lessonsData = await getData("lessons")
        const departmentLessons = lessonsData.filter((lesson: any) =>
          departmentCourses.some((course: any) => course.id === lesson.courseId),
        )
        setLessons(departmentLessons)

        const eventsData = await getData("events")
        const departmentEvents = eventsData.filter(
          (event: any) => event.departmentId?.toLowerCase() === departmentId.toLowerCase(),
        )
        setEvents(departmentEvents)

        const subjectsData = (await getData("subjects")) || []
        const departmentSubjects = subjectsData.filter((subject: any) => subject.departmentId === departmentId)
        setSubjects(departmentSubjects)
      } catch (error) {
        console.error("Error fetching department data:", error)
        setError(error instanceof Error ? error.message : "Failed to load department data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartmentData()
  }, [departmentId])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
        </div>
        <div className="mt-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid gap-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !department) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/instructor/departments">
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
              <Link href="/dashboard/instructor/departments">Browse All Departments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold md:text-3xl">{department.name}</h1>
            <Badge variant="outline">{department.code}</Badge>
          </div>
          <p className="text-muted-foreground">{department.description}</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/instructor/departments/edit/${params.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Department
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="transition-all hover:border-violet-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Courses in this department</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:border-violet-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{department.students}</div>
            <p className="text-xs text-muted-foreground">Enrolled in department courses</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:border-violet-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{department.instructors}</div>
            <p className="text-xs text-muted-foreground">Teaching department courses</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Subjects</h2>
          <Button asChild>
            <Link href={`/dashboard/instructor/departments/${params.id}/subjects/create`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Link>
          </Button>
        </div>

        {subjects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Card key={subject.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subject.code}</CardTitle>
                    <Badge>{subject.credits} credits</Badge>
                  </div>
                  <CardDescription>{subject.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{subject.description}</p>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex w-full justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {subject.semester === 1
                        ? "First Semester"
                        : subject.semester === 2
                          ? "Second Semester"
                          : "Summer"}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/instructor/departments/${params.id}/subjects/${subject.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-muted p-3">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-lg font-medium">No subjects yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Start by adding subjects to this department</p>
              <Button className="mt-4" asChild>
                <Link href={`/dashboard/instructor/departments/${params.id}/subjects/create`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Subject
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="courses" className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Department Courses</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Link href={`/dashboard/instructor/courses/${course.id}`} key={course.id}>
                  <Card className="h-full overflow-hidden transition-all hover:border-violet-500/30 hover:shadow-sm">
                    <CardHeader>
                      <CardTitle>{course.name}</CardTitle>
                      <CardDescription>{course.code}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {lessons.filter((lesson) => lesson.courseId === course.id).length} Lessons
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="col-span-full border-violet-500/20">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <GraduationCap className="h-12 w-12 text-violet-500/70 mb-3" />
                  <h3 className="mt-2 text-xl font-semibold">No Courses Yet</h3>
                  <p className="mt-2 text-center text-muted-foreground">
                    This department doesn't have any courses yet. Add a course to get started.
                  </p>
                  <Button className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Course
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="lessons">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Department Lessons</h2>
            <Button asChild>
              <Link href="/dashboard/instructor/lessons/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Lesson
              </Link>
            </Button>
          </div>
          <Card className="border-violet-500/20">
            <CardContent className="p-0">
              {lessons.length > 0 ? (
                <div className="divide-y">
                  {lessons.map((lesson) => {
                    const course = courses.find((c) => c.id === lesson.courseId)
                    return (
                      <Link href={`/dashboard/instructor/lessons/${lesson.id}`} key={lesson.id}>
                        <div className="flex items-start justify-between p-4 transition-colors hover:bg-violet-500/5">
                          <div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-violet-500" />
                              <h3 className="font-medium">{lesson.title}</h3>
                            </div>
                            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{lesson.content}</p>
                          </div>
                          {course && (
                            <Badge variant="outline" className="ml-2">
                              {course.code}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6">
                  <FileText className="h-12 w-12 text-violet-500/70 mb-3" />
                  <h3 className="mt-2 text-xl font-semibold">No Lessons Yet</h3>
                  <p className="mt-2 text-center text-muted-foreground">
                    There are no lessons for this department yet. Create a lesson to get started.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard/instructor/lessons/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create First Lesson
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Department Events</h2>
            <Button asChild>
              <Link href="/dashboard/instructor/events/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>
          <Card className="border-violet-500/20">
            <CardContent className="p-0">
              {events.length > 0 ? (
                <div className="divide-y">
                  {events.map((event) => (
                    <Link href={`/dashboard/instructor/events/${event.id}`} key={event.id}>
                      <div className="flex items-start justify-between p-4 transition-colors hover:bg-violet-500/5">
                        <div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-violet-500" />
                            <h3 className="font-medium">{event.title}</h3>
                          </div>
                          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{event.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {new Date(event.date).toLocaleDateString()}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6">
                  <Calendar className="h-12 w-12 text-violet-500/70 mb-3" />
                  <h3 className="mt-2 text-xl font-semibold">No Events Yet</h3>
                  <p className="mt-2 text-center text-muted-foreground">
                    There are no events for this department yet. Create an event to get started.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard/instructor/events/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create First Event
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
