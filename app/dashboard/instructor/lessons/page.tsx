"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, FileText, Plus, Search, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getData, getUser, storeData } from "@/lib/data-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function InstructorLessonsPage() {
  const [lessons, setLessons] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredLessons, setFilteredLessons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setUser(getUser())
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const lessonsData = (await getData("lessons")) as any[]
      const coursesData = (await getData("courses")) as any[]
      const departmentsData = (await getData("departments")) as any[]

      setLessons(lessonsData)
      setFilteredLessons(lessonsData)
      setCourses(coursesData)
      setDepartments(departmentsData)
    } catch (error) {
      console.error("Error fetching lessons:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLessons(lessons)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = lessons.filter(
        (lesson) => lesson.title.toLowerCase().includes(query) || lesson.content.toLowerCase().includes(query),
      )
      setFilteredLessons(filtered)
    }
  }, [searchQuery, lessons])

  const getCourseById = (courseId: string) => {
    return courses.find((course) => course.id === courseId)
  }

  const getDepartmentById = (departmentId: string) => {
    return departments.find((dept) => dept.id === departmentId)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleDeleteClick = (lessonId: string) => {
    setLessonToDelete(lessonId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!lessonToDelete) return

    try {
      const updatedLessons = lessons.filter((lesson) => lesson.id !== lessonToDelete)
      await storeData("lessons", updatedLessons)
      setLessons(updatedLessons)
      setFilteredLessons(updatedLessons)

      toast({
        title: "Lesson deleted",
        description: "The lesson has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting lesson:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the lesson. Please try again.",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setLessonToDelete(null)
    }
  }

  const isMyLesson = (lesson: any) => {
    return lesson.createdBy === user?.id || lesson.createdBy === "instructor-1"
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
          <h1 className="text-2xl font-bold md:text-3xl">Manage Lessons</h1>
          <p className="text-muted-foreground">Create and manage learning materials for your courses</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search lessons..."
              className="w-full pl-8 md:w-[250px]"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button asChild>
            <Link href="/dashboard/instructor/lessons/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Lesson
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="my-lessons" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="my-lessons">My Lessons</TabsTrigger>
          <TabsTrigger value="all-lessons">All Lessons</TabsTrigger>
        </TabsList>
        <TabsContent value="my-lessons">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.filter(isMyLesson).length > 0 ? (
              filteredLessons.filter(isMyLesson).map((lesson) => {
                const course = getCourseById(lesson.courseId)
                const department = course ? getDepartmentById(course.departmentId) : null

                return (
                  <Card key={lesson.id} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>
                          {course?.code} - {course?.name}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <Badge variant="outline">{department?.code || "Unknown Department"}</Badge>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Last updated: {new Date(lesson.updatedAt).toLocaleDateString()}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {lesson.content.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" className="flex-1">
                          <Link href={`/dashboard/instructor/lessons/${lesson.id}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => handleDeleteClick(lesson.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                {searchQuery ? "No lessons match your search query" : "You haven't created any lessons yet"}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="all-lessons">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => {
                const course = getCourseById(lesson.courseId)
                const department = course ? getDepartmentById(course.departmentId) : null
                const isOwner = isMyLesson(lesson)

                return (
                  <Card key={lesson.id} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>
                          {course?.code} - {course?.name}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <Badge variant="outline">{department?.code || "Unknown Department"}</Badge>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Last updated: {new Date(lesson.updatedAt).toLocaleDateString()}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {lesson.content.substring(0, 100)}...
                        </p>
                      </div>
                      {isOwner ? (
                        <div className="flex gap-2">
                          <Button asChild variant="outline" className="flex-1">
                            <Link href={`/dashboard/instructor/lessons/${lesson.id}/edit`}>Edit</Link>
                          </Button>
                          <Button variant="outline" className="flex-1" onClick={() => handleDeleteClick(lesson.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      ) : (
                        <Button asChild className="w-full">
                          <Link href={`/dashboard/instructor/lessons/${lesson.id}`}>View Lesson</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                {searchQuery ? "No lessons match your search query" : "No lessons available"}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lesson and remove it from all courses.
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
